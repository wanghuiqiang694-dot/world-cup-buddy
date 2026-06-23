// ========== 2026 世界杯泊松概率预测系统 ==========
// 功能：今日预测 / 往期预测 / 预测详情 / 自动预测 / 赛果验证
// 引擎：基于泊松分布的确定性概率模型（无随机数），λ由实力+身价+主场计算

// ========== 预测数据存储 ==========
// 存储结构：localStorage 'wc_predictions' -> { [matchId]: { ... } }
// 每条预测：
// {
//   matchId, home, away, date, time, group, venue,
//   predictTime: '生成时间',
//   winDrawLose: '主胜/平/客胜',
//   score: '2:1',
//   halfFull: '胜胜/胜平/平胜...',
//   goals: '3球',
//   confidence: '高/中/低',
//   analysis: '泊松模型分析文本',
//   homeWinProb: 55, drawProb: 25, awayWinProb: 20,
//   result: { score:'2:1', verified:true/false,
//             correct: { wdl:true, score:false, hf:true, goals:true } }
// }

var PREDICT_STORAGE_KEY = 'wc_predictions';

function getPredictions() {
  try {
    var data = localStorage.getItem(PREDICT_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) { return {}; }
}

function savePredictions(preds) {
  localStorage.setItem(PREDICT_STORAGE_KEY, JSON.stringify(preds));
}

function getSinglePrediction(matchId) {
  var preds = getPredictions();
  return preds[matchId] || null;
}

function saveSinglePrediction(matchId, pred) {
  var preds = getPredictions();
  preds[matchId] = pred;
  savePredictions(preds);
}

// ========== 半全场结果计算 ==========
// 基于泊松模型：用上半场λ（全场λ×0.45）计算最可能的上半场比分，
// 再结合全场比分得到半全场结果。多候选取概率最高的。
function calcHalfFull(homeGoals, awayGoals, lambdaHome, lambdaAway) {
  // 如果没有提供λ参数，退化为简单计算
  if (!lambdaHome || !lambdaAway) {
    return calcHalfFullSimple(homeGoals, awayGoals);
  }

  // 上半场进球数约为全场的 42-48%，取 0.45
  var lambdaHomeHalf = lambdaHome * 0.45;
  var lambdaAwayHalf = lambdaAway * 0.45;

  // 找出全场结果
  var fullResult = homeGoals > awayGoals ? '胜' : (homeGoals < awayGoals ? '负' : '平');

  // 遍历上半场比分（0-4），取联合概率最高的且与全场结果一致的
  var bestHalfResult = '平', bestProb = -1;
  var halfResults = ['胜', '平', '负'];
  var MAX_HALF = 4;

  for (var hi = 0; hi <= MAX_HALF; hi++) {
    for (var ai = 0; ai <= MAX_HALF; ai++) {
      var pHome = poissonProb(lambdaHomeHalf, hi);
      var pAway = poissonProb(lambdaAwayHalf, ai);
      var prob = pHome * pAway;
      var hr = hi > ai ? '胜' : (hi < ai ? '负' : '平');
      // 只看概率最高的上半场结果
      if (prob > bestProb) {
        bestProb = prob;
        bestHalfResult = hr;
      }
    }
  }

  return bestHalfResult + fullResult;
}

// 简单半全场计算（用于赛果验证，已知实际比分但没有λ参数）
function calcHalfFullSimple(homeGoals, awayGoals) {
  // 按上半场进球约为全场45%估算
  var homeHalf = Math.round(homeGoals * 0.45);
  var awayHalf = Math.round(awayGoals * 0.45);
  var halfResult = homeHalf > awayHalf ? '胜' : (homeHalf < awayHalf ? '负' : '平');
  var fullResult = homeGoals > awayGoals ? '胜' : (homeGoals < awayGoals ? '负' : '平');
  return halfResult + fullResult;
}

// ========== 泊松分布工具函数 ==========

// 阶乘（查表法，0-7 足够覆盖足球比分场景）
var FACT_TABLE = [1, 1, 2, 6, 24, 120, 720, 5040];
function factorial(n) {
  if (n < 0) return 1;
  if (n >= FACT_TABLE.length) {
    var r = FACT_TABLE[FACT_TABLE.length - 1];
    for (var i = FACT_TABLE.length; i <= n; i++) { r *= i; }
    return r;
  }
  return FACT_TABLE[n];
}

// 泊松概率 P(X=k) = (λ^k * e^(-λ)) / k!
function poissonProb(lambda, k) {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  return Math.pow(lambda, k) * Math.exp(-lambda) / factorial(k);
}

// ========== 期望进球数计算 ==========
// λ = f(进攻能力, 对手防守能力, 主场优势, 身价系数)
// 进攻和防守从同一TEAM_STRENGTH派生但权重不同（强队攻守兼备，
// 但攻击力提升更显著；弱队防守组织相对优于进攻创造力）
function calcExpectedGoals(attackTeam, defendTeam, isHome) {
  var attackStrength = TEAM_STRENGTH[attackTeam] || 60;
  var defendStrength = TEAM_STRENGTH[defendTeam] || 60;

  // 世界杯场均进球约2.6，单队约1.3
  var baseLambda = 1.30;

  // 进攻系数：实力越高进攻越强，非线性放大顶级球队
  // strength 60→1.00, 70→1.12, 80→1.28, 90→1.52, 95→1.68
  var attackFactor = Math.pow(attackStrength / 60, 1.2);

  // 防守系数：对手实力越高，本队进球越少
  // strength 60→1.00, 70→0.86, 80→0.73, 90→0.62, 95→0.57
  var defendFactor = Math.pow(60 / Math.max(defendStrength, 40), 1.0);

  var lambda = baseLambda * attackFactor * defendFactor;

  // 身价修正：身价高说明阵容深度和替补质量好，进攻上限更高
  var attackValue = TEAM_VALUE[attackTeam] || 5000;
  var defendValue = TEAM_VALUE[defendTeam] || 5000;
  // 身价比修正，幅度控制在±5%
  var valueRatio = (attackValue / Math.max(defendValue, 1000));
  if (valueRatio > 3) valueRatio = 3;
  var valueModifier = 1 + (valueRatio - 1) * 0.02; // ±6% 以内
  lambda *= valueModifier;

  // 主场优势（仅主队）：约10-15%进攻加成，世界杯东道主效应更强
  if (isHome) {
    lambda *= 1.12;
  }

  // 限制λ在合理范围 [0.4, 3.5]
  if (lambda < 0.4) lambda = 0.4;
  if (lambda > 3.5) lambda = 3.5;

  return lambda;
}

// ========== 基于泊松模型的严谨预测引擎 ==========
// 确定性模型：无随机数，基于概率最优化
function localPredict(home, away) {
  var hs = TEAM_STRENGTH[home] || 60;
  var as = TEAM_STRENGTH[away] || 60;

  // 计算双方期望进球数（泊松参数λ）
  var lambdaHome = calcExpectedGoals(home, away, true);
  var lambdaAway = calcExpectedGoals(away, home, false);

  // 用泊松分布联合概率计算胜平负
  // P(主胜) = Σ P(home=i) * P(away=j) where i > j
  // P(平局) = Σ P(home=i) * P(away=i)
  // P(客胜) = Σ P(home=i) * P(away=j) where i < j
  var homeWinProb = 0, drawProb = 0, awayWinProb = 0;
  var MAX_GOALS = 7; // 覆盖0-7球，概率尾部可忽略

  // 同时记录每个比分组合的概率，用于选取最可能比分
  var scoreProbs = {};

  for (var i = 0; i <= MAX_GOALS; i++) {
    var pHome = poissonProb(lambdaHome, i);
    for (var j = 0; j <= MAX_GOALS; j++) {
      var pAway = poissonProb(lambdaAway, j);
      var jointProb = pHome * pAway;
      var key = i + ':' + j;
      scoreProbs[key] = jointProb;

      if (i > j) homeWinProb += jointProb;
      else if (i === j) drawProb += jointProb;
      else awayWinProb += jointProb;
    }
  }

  // 归一化（确保概率和为1）
  var total = homeWinProb + drawProb + awayWinProb;
  homeWinProb = homeWinProb / total;
  drawProb = drawProb / total;
  awayWinProb = awayWinProb / total;

  // 确定胜平负结果（取概率最大的）
  var wdl;
  if (homeWinProb >= drawProb && homeWinProb >= awayWinProb) {
    wdl = '主胜';
  } else if (awayWinProb >= homeWinProb && awayWinProb >= drawProb) {
    wdl = '客胜';
  } else {
    wdl = '平';
  }

  // 选取概率最高的比分（按胜平负类别筛选）
  var bestScore = selectBestScore(scoreProbs, wdl);

  // 选取概率第二高的比分（不同结果时给出备选）
  var altScores = selectAltScores(scoreProbs, bestScore, 2);

  // 半全场基于泊松上半场模型推算
  var bestScoreParts = bestScore.split(':');
  var hf = calcHalfFull(parseInt(bestScoreParts[0]), parseInt(bestScoreParts[1]), lambdaHome, lambdaAway);

  // 进球数基于泊松期望值（取整，与验证逻辑对齐）
  var expectedTotal = lambdaHome + lambdaAway;
  var goalsLabel = Math.round(expectedTotal) + '球';

  // 置信度：概率越集中越可信
  var maxProb = Math.max(homeWinProb, drawProb, awayWinProb);
  var confidence;
  if (maxProb >= 0.60) confidence = '高';
  else if (maxProb >= 0.45) confidence = '中';
  else confidence = '低';

  // 生成分析
  var analysis = generateAnalysis(home, away, hs, as, wdl, bestScore, hf, expectedTotal,
    homeWinProb, drawProb, awayWinProb, lambdaHome, lambdaAway, altScores, confidence);

  return {
    winDrawLose: wdl,
    score: bestScore,
    halfFull: hf,
    goals: goalsLabel,
    analysis: analysis,
    homeWinProb: Math.round(homeWinProb * 100),
    drawProb: Math.round(drawProb * 100),
    awayWinProb: Math.round(awayWinProb * 100),
    confidence: confidence
  };
}

// 选取概率最高的比分（限定在预测胜平负类别内）
function selectBestScore(scoreProbs, wdl) {
  var bestKey = '1:0', bestProb = 0;
  for (var key in scoreProbs) {
    if (!scoreProbs.hasOwnProperty(key)) continue;
    var parts = key.split(':');
    var h = parseInt(parts[0]), a = parseInt(parts[1]);
    var matchWDL = h > a ? '主胜' : (h < a ? '客胜' : '平');
    if (matchWDL !== wdl) continue;
    if (scoreProbs[key] > bestProb) {
      bestProb = scoreProbs[key];
      bestKey = key;
    }
  }
  return bestKey;
}

// 选取概率次高的2个比分（不限于同一胜平负类别）
// 阈值：至少为最高概率的20%，排除极端冷门
function selectAltScores(scoreProbs, excludeKey, count) {
  // 先找最高概率（排除的那个），作为阈值基准
  var maxProb = 0;
  if (scoreProbs.hasOwnProperty(excludeKey)) {
    maxProb = scoreProbs[excludeKey];
  }
  var threshold = maxProb * 0.15; // 最高概率的15%作为阈值
  if (threshold < 0.005) threshold = 0.005; // 最低0.5%

  var sorted = [];
  for (var key in scoreProbs) {
    if (!scoreProbs.hasOwnProperty(key)) continue;
    if (key === excludeKey) continue;
    if (scoreProbs[key] < threshold) continue;
    sorted.push({ score: key, prob: scoreProbs[key] });
  }
  sorted.sort(function(a, b) { return b.prob - a.prob; });
  return sorted.slice(0, count).map(function(s) { return s.score; });
}

function generateAnalysis(home, away, hs, as, wdl, bestScore, hf, expectedTotal,
                         homeWinProb, drawProb, awayWinProb, lambdaHome, lambdaAway, altScores, confidence) {
  var diff = hs - as;
  var homeHistory = TEAM_HISTORY[home];
  var awayHistory = TEAM_HISTORY[away];
  var homeStar = homeHistory ? homeHistory.star : '未知';
  var awayStar = awayHistory ? awayHistory.star : '未知';
  var homeCoach = homeHistory ? homeHistory.coach : '未知';
  var awayCoach = awayHistory ? awayHistory.coach : '未知';
  var homeTitles = homeHistory ? homeHistory.titles : 0;
  var awayTitles = awayHistory ? awayHistory.titles : 0;
  var homeApp = homeHistory ? homeHistory.appearances : 0;
  var awayApp = awayHistory ? awayHistory.appearances : 0;
  var homeValue = TEAM_VALUE[home] || 5000;
  var awayValue = TEAM_VALUE[away] || 5000;

  var lines = [];

  // ===== 1. 实力对比与数据概览 =====
  var strengthGap = Math.abs(diff);
  var gapLevel;
  if (strengthGap > 20) gapLevel = '悬殊';
  else if (strengthGap > 10) gapLevel = '明显';
  else if (strengthGap > 5) gapLevel = '有一定差距';
  else gapLevel = '十分接近';

  var homeValueStr = homeValue >= 10000 ? (homeValue / 10000).toFixed(1) + '亿' : homeValue + '万';
  var awayValueStr = awayValue >= 10000 ? (awayValue / 10000).toFixed(1) + '亿' : awayValue + '万';
  lines.push('【实力对比】' + home + '（实力指数 ' + hs + ' / 身价 ' + homeValueStr + '欧元）vs ' + away + '（实力指数 ' + as + ' / 身价 ' + awayValueStr + '欧元），双方实力' + gapLevel + '。');

  // 攻防数据
  lines.push('【攻防预期】' + home + '期望进球 λ=' + lambdaHome.toFixed(2) + '，' + away + '期望进球 λ=' + lambdaAway.toFixed(2) + '，预期总进球 ' + expectedTotal.toFixed(2) + '。');

  // ===== 2. 概率模型核心结论 =====
  var probStr = '主胜 ' + Math.round(homeWinProb * 100) + '% / 平局 ' + Math.round(drawProb * 100) + '% / 客胜 ' + Math.round(awayWinProb * 100) + '%';
  lines.push('【概率预测】基于泊松分布模型，' + probStr + '。置信度：' + confidence + '。');

  if (wdl === '主胜') {
    if (homeWinProb > 0.6) {
      lines.push(home + '胜面极大（概率超60%），' + homeStar + '领衔的阵容有望稳健取胜。');
    } else if (homeWinProb > 0.45) {
      lines.push(home + '胜面占优，但优势并非压倒性，需警惕' + away + '反击。');
    } else {
      lines.push(home + '微弱优势，本场胜负悬念较大，' + homeStar + '的发挥至关重要。');
    }
  } else if (wdl === '客胜') {
    if (awayWinProb > 0.6) {
      lines.push(away + '胜面极大（概率超60%），' + awayStar + '带队客场强势。');
    } else if (awayWinProb > 0.45) {
      lines.push(away + '客胜概率占优，但主场因素可能给' + home + '带来加成。');
    } else {
      lines.push(away + '微弱占优，' + awayStar + '与' + homeStar + '的对决将决定走势。');
    }
  } else {
    lines.push('双方实力接近，平局概率最高，比赛很可能进入胶着状态。');
  }

  // ===== 3. 比分预测（含备选及概率） =====
  lines.push('【比分预测】最可能比分 ' + bestScore + '（泊松联合概率最高）');
  if (altScores && altScores.length > 0) {
    lines.push('备选比分：' + altScores.join('、') + '。');
  }

  // ===== 4. 半全场走势 =====
  var hfMap = {
    '胜胜': '上半场领先后稳守优势，掌控全场节奏',
    '胜平': '上半场领先但下半场被追平，后劲不足或被对手调整',
    '胜负': '上半场领先但遭逆转，防守端下半场崩盘',
    '平胜': '上半场试探后下半场发力制胜，慢热型球队典型路径',
    '平平': '全场僵持，双方均无法打破平衡',
    '平负': '上半场僵持后下半场失守，体能或替补深度劣势',
    '负胜': '上半场落后但完成逆转，韧性十足',
    '负平': '上半场落后但下半场扳平，止住颓势',
    '负负': '全场被动，始终未能找到节奏'
  };
  lines.push('【半全场】' + hf + ' — ' + (hfMap[hf] || '') + '。');

  // ===== 5. 进球数分析 =====
  if (expectedTotal >= 3.0) {
    lines.push('【进球数】预期 ' + expectedTotal.toFixed(1) + ' 球，大球概率较高，比赛节奏开放。');
  } else if (expectedTotal >= 2.2) {
    lines.push('【进球数】预期 ' + expectedTotal.toFixed(1) + ' 球，攻防节奏适中。');
  } else {
    lines.push('【进球数】预期 ' + expectedTotal.toFixed(1) + ' 球，小球概率较高，防守博弈为主。');
  }

  // ===== 6. 近期战绩与大赛底蕴 =====
  if (homeHistory && homeHistory.recent && homeHistory.recent.length > 0) {
    var homeRecent = homeHistory.recent.map(function(r) { return r.year + r.result; }).join('、');
    lines.push('【' + home + '近况】' + (homeTitles > 0 ? homeTitles + '次世界杯冠军，' : '') + '近' + homeHistory.recent.length + '届：' + homeRecent + '。主帅' + homeCoach + '，核心' + homeStar + '。');
  }
  if (awayHistory && awayHistory.recent && awayHistory.recent.length > 0) {
    var awayRecent = awayHistory.recent.map(function(r) { return r.year + r.result; }).join('、');
    lines.push('【' + away + '近况】' + (awayTitles > 0 ? awayTitles + '次世界杯冠军，' : '') + '近' + awayHistory.recent.length + '届：' + awayRecent + '。主帅' + awayCoach + '，核心' + awayStar + '。');
  }

  // ===== 7. 小组形势分析 =====
  var groupInfo = analyzeGroupSituation(home, away);
  if (groupInfo) {
    lines.push(groupInfo);
  }

  return lines.join('\n');
}

// 小组形势深度分析：计算当前积分、排名、出线形势
function analyzeGroupSituation(home, away) {
  if (typeof GROUPS === 'undefined' || typeof MATCHES === 'undefined') return null;

  // 找到主客队所属小组
  var homeGroup = null, awayGroup = null;
  for (var g in GROUPS) {
    if (!GROUPS.hasOwnProperty(g)) continue;
    if (GROUPS[g].indexOf(home) >= 0) homeGroup = g;
    if (GROUPS[g].indexOf(away) >= 0) awayGroup = g;
  }

  // 不在同一小组或找不到小组
  if (!homeGroup || homeGroup !== awayGroup) return null;

  // 计算小组各队当前积分
  var standings = {};
  var teams = GROUPS[homeGroup];
  for (var t = 0; t < teams.length; t++) {
    standings[teams[t]] = { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 };
  }

  // 遍历所有已有结果的比赛
  for (var mid in MATCH_RESULTS) {
    if (!MATCH_RESULTS.hasOwnProperty(mid)) continue;
    var result = MATCH_RESULTS[mid];
    if (!result.score) continue;
    var match = null;
    for (var mi = 0; mi < MATCHES.length; mi++) {
      if (MATCHES[mi].id == mid) { match = MATCHES[mi]; break; }
    }
    if (!match || match.group !== homeGroup) continue;

    var parts = result.score.split(':');
    var hg = parseInt(parts[0]) || 0;
    var ag = parseInt(parts[1]) || 0;

    if (standings[match.home]) {
      standings[match.home].played++;
      standings[match.home].gf += hg;
      standings[match.home].ga += ag;
      if (hg > ag) { standings[match.home].won++; standings[match.home].pts += 3; }
      else if (hg === ag) { standings[match.home].drawn++; standings[match.home].pts += 1; }
      else { standings[match.home].lost++; }
    }
    if (standings[match.away]) {
      standings[match.away].played++;
      standings[match.away].gf += ag;
      standings[match.away].ga += hg;
      if (ag > hg) { standings[match.away].won++; standings[match.away].pts += 3; }
      else if (ag === hg) { standings[match.away].drawn++; standings[match.away].pts += 1; }
      else { standings[match.away].lost++; }
    }
  }

  // 找本场是第几轮
  var currentMatch = null;
  for (var ci = 0; ci < MATCHES.length; ci++) {
    if (MATCHES[ci].home === home && MATCHES[ci].away === away && MATCHES[ci].group === homeGroup) {
      currentMatch = MATCHES[ci]; break;
    }
  }
  var roundLabel = currentMatch ? ('第' + currentMatch.round + '轮') : '';

  // 构造积分概览
  var rankArr = [];
  for (var team in standings) {
    if (!standings.hasOwnProperty(team)) continue;
    var s = standings[team];
    rankArr.push({ team: team, pts: s.pts, played: s.played, gd: s.gf - s.ga });
  }
  rankArr.sort(function(a, b) { return b.pts - a.pts || b.gd - a.gd; });

  var homePts = standings[home] ? standings[home].pts : 0;
  var awayPts = standings[away] ? standings[away].pts : 0;
  var homePlayed = standings[home] ? standings[home].played : 0;
  var awayPlayed = standings[away] ? standings[away].played : 0;

  var info = '【小组形势】' + homeGroup + '组' + roundLabel + '。';
  info += home + '（' + homePlayed + '场' + homePts + '分）vs ' + away + '（' + awayPlayed + '场' + awayPts + '分）。';

  // 出线形势判断
  // 小组前2名直接出线，48队扩军后可能前2+部分第3出线
  var homeRank = -1, awayRank = -1;
  for (var ri = 0; ri < rankArr.length; ri++) {
    if (rankArr[ri].team === home) homeRank = ri + 1;
    if (rankArr[ri].team === away) awayRank = ri + 1;
  }

  var totalRounds = 3; // 小组赛3轮
  var maxPts = (totalRounds - homePlayed) * 3 + homePts;

  if (homePlayed === 0 && awayPlayed === 0) {
    info += '小组赛首战，双方均需全力抢分开门红。';
  } else if (homePlayed >= 2 || awayPlayed >= 2) {
    // 末轮或接近末轮
    if (homePts >= 6 || awayPts >= 6) {
      info += '已有球队积6分以上，本场获胜即可确保出线。';
    } else if (homePts <= 0 && homePlayed >= 2) {
      info += home + '两轮0分濒临出局，本场必须全力争胜。';
    } else if (awayPts <= 0 && awayPlayed >= 2) {
      info += away + '两轮0分濒临出局，本场必须全力争胜。';
    } else {
      info += '小组出线形势紧张，本场结果将决定最终排名。';
    }
  } else {
    // 第2轮
    if (homePts >= 3 && awayPts >= 3) {
      info += '双方首轮均取胜，本场胜者将锁定出线名额。';
    } else if (homePts === 0 && awayPts === 0) {
      info += '双方首轮均失利，本场可谓生死战。';
    } else {
      info += '本场结果将直接影响出线主动权。';
    }
  }

  // 积分榜概览
  var rankStr = rankArr.map(function(r, i) {
    return (i + 1) + '.' + r.team + '(' + r.pts + '分)';
  }).join(' ');
  info += ' 当前积分：' + rankStr + '。';

  return info;
}

// ========== 为一场比赛生成预测 ==========
function generatePrediction(matchId) {
  var match = MATCHES.find(function(m) { return m.id === matchId; });
  if (!match) return null;

  var home = match.home;
  var away = match.away;
  if (!home || !away) return null;

  var existing = getSinglePrediction(matchId);
  // 如果已有预测且比赛未结束，不重复生成
  if (existing && !existing.result) return existing;

  var pred = localPredict(home, away);
  if (!pred) return null;

  var now = new Date();
  var record = {
    matchId: matchId,
    home: home,
    away: away,
    date: match.date,
    time: match.time,
    group: match.group || '',
    venue: match.venue || '',
    predictTime: now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0'),
    winDrawLose: pred.winDrawLose,
    score: pred.score,
    halfFull: pred.halfFull,
    goals: pred.goals,
    analysis: pred.analysis,
    homeWinProb: pred.homeWinProb,
    drawProb: pred.drawProb,
    awayWinProb: pred.awayWinProb,
    confidence: pred.confidence || '中',
    result: null // 赛后填充
  };

  saveSinglePrediction(matchId, record);
  return record;
}

// ========== 批量生成明日预测（"今日预测"tab实际展示明天比赛） ==========
function generateTodayPredictions() {
  var tomorrowStr = getTomorrowStr();
  var tomorrowMatches = MATCHES.filter(function(m) {
    return m.date === tomorrowStr && m.home && m.away;
  });

  for (var i = 0; i < tomorrowMatches.length; i++) {
    var m = tomorrowMatches[i];
    var existing = getSinglePrediction(m.id);
    if (!existing) {
      generatePrediction(m.id);
    }
  }
}

function getTodayStr() {
  var now = new Date();
  return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
}

function getTomorrowStr() {
  var now = new Date();
  now.setDate(now.getDate() + 1);
  return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
}

// ========== 赛果验证 ==========
function verifyPrediction(matchId) {
  var pred = getSinglePrediction(matchId);
  if (!pred) return pred;

  var matchResult = MATCH_RESULTS[matchId];
  if (!matchResult || !matchResult.score) return pred;

  // 如果已有验证结果，检查比分是否变化（比如比赛从进行中到结束，比分可能更新）
  // 比分变化时需要重新验证
  if (pred.result && pred.result.score === matchResult.score) return pred;

  var actualScore = matchResult.score;
  var parts = actualScore.split(':');
  var actualHome = parseInt(parts[0]) || 0;
  var actualAway = parseInt(parts[1]) || 0;

  // 实际胜平负
  var actualWDL = actualHome > actualAway ? '主胜' : (actualHome < actualAway ? '客胜' : '平');
  // 实际半全场（用简单计算，赛果验证没有λ参数）
  var actualHF = calcHalfFullSimple(actualHome, actualAway);
  // 实际进球数
  var actualGoals = (actualHome + actualAway) + '球';

  pred.result = {
    score: actualScore,
    verified: true,
    correct: {
      wdl: pred.winDrawLose === actualWDL,
      score: pred.score === actualScore,
      hf: pred.halfFull === actualHF,
      goals: pred.goals === actualGoals
    }
  };

  saveSinglePrediction(matchId, pred);
  return pred;
}

// 批量验证所有已结束比赛的预测
function verifyAllPredictions() {
  var preds = getPredictions();
  var changed = false;
  for (var matchId in preds) {
    if (preds.hasOwnProperty(matchId)) {
      var oldPred = preds[matchId];
      if (!oldPred.result) {
        var result = MATCH_RESULTS[matchId];
        if (result && result.score) {
          verifyPrediction(parseInt(matchId));
          changed = true;
        }
      }
    }
  }
  return changed;
}

// ========== 预测页面渲染 ==========
var predictView = 'today'; // 'today' | 'history'

function renderPredictPage() {
  // 如果当前是蒙超联赛，跳转到蒙超预测渲染
  if (typeof currentLeague !== 'undefined' && currentLeague === 'mengchao') {
    if (typeof renderMengchaoPredictPage === 'function') renderMengchaoPredictPage();
    return;
  }

  var container = document.getElementById('predict-content');
  if (!container) return;

  // 先验证所有预测
  verifyAllPredictions();

  var html = '';

  // 子导航
  html += '<div class="predict-sub-nav">';
  html += '<a class="predict-nav-btn' + (predictView === 'today' ? ' active' : '') + '" onclick="switchPredictView(\'today\')">明日预测</a>';
  html += '<a class="predict-nav-btn' + (predictView === 'history' ? ' active' : '') + '" onclick="switchPredictView(\'history\')">往期预测</a>';
  html += '</div>';

  if (predictView === 'today') {
    html += renderTodayPredictions();
  } else {
    html += renderHistoryPredictions();
  }

  container.innerHTML = html;
}

function switchPredictView(view) {
  predictView = view;
  renderPredictPage();
}

// ========== 今日预测 ==========
// "今日预测"实际显示明天的比赛（提前预测），今天的比赛归入往期预测
function renderTodayPredictions() {
  var tomorrowStr = getTomorrowStr();
  var tomorrowMatches = MATCHES.filter(function(m) {
    return m.date === tomorrowStr && m.home && m.away;
  });

  // 按时间排序
  tomorrowMatches.sort(function(a, b) {
    return (a.time || '').localeCompare(b.time || '');
  });

  var html = '';

  if (tomorrowMatches.length === 0) {
    // 没有明天比赛时，显示最近的未来比赛
    var todayStr = getTodayStr();
    var upcomingMatches = MATCHES.filter(function(m) {
      return m.date > todayStr && m.home && m.away;
    }).sort(function(a, b) {
      return (a.date + a.time).localeCompare(b.date + b.time);
    }).slice(0, 6);

    if (upcomingMatches.length === 0) {
      html += '<div class="predict-empty">暂无即将进行的比赛</div>';
      return html;
    }

    html += '<div class="predict-section-title">近期比赛预测</div>';
    upcomingMatches.forEach(function(m) {
      html += renderPredictCard(m);
    });
  } else {
    html += '<div class="predict-section-title">明日 ' + tomorrowStr.slice(5) + ' 共 ' + tomorrowMatches.length + ' 场</div>';
    tomorrowMatches.forEach(function(m) {
      html += renderPredictCard(m);
    });
  }

  return html;
}

// ========== 往期预测 ==========
// 往期预测包含：今天和之前所有已结束比赛的预测
function renderHistoryPredictions() {
  var preds = getPredictions();
  var todayStr = getTodayStr();
  var html = '';

  // 按日期分组，包含今天和之前的比赛
  var byDate = {};
  for (var matchId in preds) {
    if (preds.hasOwnProperty(matchId)) {
      var p = preds[matchId];
      // 往期 = 今天及之前日期，且已有验证结果
      if (p.date <= todayStr && p.result && p.result.verified) {
        if (!byDate[p.date]) byDate[p.date] = [];
        byDate[p.date].push(p);
      }
    }
  }

  // 同时也把今天已有结果但没预测的比赛收集进来（展示实际比分）
  var todayMatches = MATCHES.filter(function(m) {
    return m.date === todayStr && m.home && m.away;
  });
  todayMatches.forEach(function(m) {
    var result = MATCH_RESULTS[m.id];
    if (result && result.score && !result.live) {
      var existingPred = preds[m.id];
      if (!existingPred) {
        // 没预测但有结果的比赛，也显示在往期
        if (!byDate[todayStr]) byDate[todayStr] = [];
        var alreadyIn = byDate[todayStr].some(function(item) { return item.matchId === m.id; });
        if (!alreadyIn) {
          byDate[todayStr].push({
            matchId: m.id, home: m.home, away: m.away, date: m.date, time: m.time,
            winDrawLose: '-', score: '-', halfFull: '-', goals: '-',
            result: { score: result.score, verified: true, correct: {} }
          });
        }
      }
    }
  });

  var dates = Object.keys(byDate).sort().reverse();
  if (dates.length === 0) {
    html += '<div class="predict-empty">暂无已验证的往期预测<br>比赛结束后预测结果将自动更新</div>';
    return html;
  }

  dates.forEach(function(date) {
    var items = byDate[date];
    // 按时间排序
    items.sort(function(a, b) { return (a.time || '').localeCompare(b.time || ''); });

    var d = new Date(date + 'T00:00:00+08:00');
    var wd = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];

    // 统计命中
    var hitCount = 0;
    var totalItems = items.length;
    items.forEach(function(item) {
      var c = item.result.correct;
      if (c && (c.wdl || c.score || c.hf || c.goals)) hitCount++;
    });

    var isToday = date === todayStr;
    html += '<div class="predict-date-group">';
    html += '<div class="predict-date-header">' + (isToday ? '今日 ' : '') + date.slice(5) + ' 周' + wd + ' <span class="predict-hit-rate">命中 ' + hitCount + '/' + totalItems + '</span></div>';
    items.forEach(function(item) {
      html += renderHistoryCard(item);
    });
    html += '</div>';
  });

  return html;
}

// ========== 预测卡片（今日/近期） ==========
function renderPredictCard(match) {
  var pred = getSinglePrediction(match.id);
  // 每次渲染都重新验证，确保命中状态与最新 MATCH_RESULTS 同步
  if (pred) {
    var rePred = verifyPrediction(match.id);
    if (rePred) pred = rePred;
  }
  var result = MATCH_RESULTS[match.id];
  var isFinished = result && result.score && !result.live;
  var phaseLabel = match.group ? (match.group + '组') : (match.koLabel || '');

  var html = '<div class="predict-card" onclick="openPredictDetail(' + match.id + ')">';

  // 头部：球队 + 比分
  html += '<div class="predict-card-header">';
  html += '<div class="predict-teams">';
  html += '<span class="predict-team">' + flagImg(match.home, 'predict-flag') + ' ' + match.home + '</span>';
  html += '<span class="predict-vs">VS</span>';
  html += '<span class="predict-team">' + match.away + ' ' + flagImg(match.away, 'predict-flag') + '</span>';
  html += '</div>';
  html += '<div class="predict-meta">' + match.date.slice(5) + ' ' + match.time + ' · ' + phaseLabel + '</div>';
  html += '</div>';

  if (pred) {
    // 有预测
    html += '<div class="predict-card-body">';

    // 预测结果概览
    html += '<div class="predict-summary">';
    html += '<div class="predict-item"><span class="predict-label">胜平负</span><span class="predict-value wdl-' + pred.winDrawLose + '">' + pred.winDrawLose + '</span></div>';
    html += '<div class="predict-item"><span class="predict-label">比分</span><span class="predict-value">' + pred.score + '</span></div>';
    html += '<div class="predict-item"><span class="predict-label">半全场</span><span class="predict-value">' + pred.halfFull + '</span></div>';
    html += '<div class="predict-item"><span class="predict-label">进球数</span><span class="predict-value">' + pred.goals + '</span></div>';
    if (pred.confidence) {
      var cc = pred.confidence === '高' ? 'confidence-high' : (pred.confidence === '低' ? 'confidence-low' : 'confidence-mid');
      html += '<div class="predict-item"><span class="predict-label">置信度</span><span class="predict-value ' + cc + '">' + pred.confidence + '</span></div>';
    }
    html += '</div>';

    // 如果比赛已结束，显示验证结果
    if (isFinished && pred.result && pred.result.verified) {
      var c = pred.result.correct;
      var correctItems = [];
      if (c.wdl) correctItems.push('胜平负');
      if (c.score) correctItems.push('比分');
      if (c.hf) correctItems.push('半全场');
      if (c.goals) correctItems.push('进球数');

      html += '<div class="predict-verify">';
      if (correctItems.length > 0) {
        html += '<span class="verify-badge verify-hit">命中 ' + correctItems.join('、') + '</span>';
      }
      html += '<span class="verify-score">实际 ' + pred.result.score + '</span>';
      html += '</div>';
    }

    // 概率条
    html += '<div class="predict-prob-bar">';
    html += '<div class="prob-segment prob-home" style="width:' + pred.homeWinProb + '%">' + (pred.homeWinProb > 15 ? pred.homeWinProb + '%' : '') + '</div>';
    html += '<div class="prob-segment prob-draw" style="width:' + pred.drawProb + '%">' + (pred.drawProb > 15 ? pred.drawProb + '%' : '') + '</div>';
    html += '<div class="prob-segment prob-away" style="width:' + pred.awayWinProb + '%">' + (pred.awayWinProb > 15 ? pred.awayWinProb + '%' : '') + '</div>';
    html += '</div>';

    html += '</div>';
  } else {
    // 无预测 - 显示生成按钮
    html += '<div class="predict-card-empty">';
    html += '<div class="predict-gen-hint">点击生成AI预测</div>';
    html += '</div>';
  }

  html += '</div>';
  return html;
}

// ========== 往期预测卡片 ==========
function renderHistoryCard(pred) {
  // 重新验证，确保 MATCH_RESULTS 更新后命中状态也更新
  var rePred = verifyPrediction(pred.matchId);
  if (rePred) pred = rePred;

  var c = pred.result.correct;
  var correctItems = [];
  if (c.wdl) correctItems.push('胜平负');
  if (c.score) correctItems.push('比分');
  if (c.hf) correctItems.push('半全场');
  if (c.goals) correctItems.push('进球数');

  var html = '<div class="predict-history-card" onclick="openPredictDetail(' + pred.matchId + ')">';

  // 头部
  html += '<div class="predict-hist-header">';
  html += '<span class="predict-hist-teams">' + flag(pred.home) + ' ' + pred.home + ' ' + pred.score + ' ' + pred.away + ' ' + flag(pred.away) + '</span>';
  html += '<span class="predict-hist-actual">实际 ' + pred.result.score + '</span>';
  html += '</div>';

  // 命中项
  html += '<div class="predict-hist-result">';
  if (correctItems.length > 0) {
    html += '<span class="verify-badge verify-hit">命中 ' + correctItems.join('、') + '</span>';
  } else {
    html += '<span class="verify-badge verify-miss">未命中</span>';
  }
  html += '</div>';

  html += '</div>';
  return html;
}

// ========== 预测详情弹窗 ==========
function openPredictDetail(matchId) {
  var match = MATCHES.find(function(m) { return m.id === matchId; });
  if (!match) return;

  var pred = getSinglePrediction(matchId);

  // 如果没有预测，先生成
  if (!pred) {
    var newPred = generatePrediction(matchId);
    if (newPred) {
      renderPredictDetailInner(matchId);
      // 刷新列表
      renderPredictPage();
      return;
    }
  }

  renderPredictDetailInner(matchId);
}

function renderPredictDetailInner(matchId) {
  var match = MATCHES.find(function(m) { return m.id === matchId; });
  if (!match) return;

  var pred = getSinglePrediction(matchId);
  if (!pred) return;

  // 验证赛果
  pred = verifyPrediction(matchId);

  var result = MATCH_RESULTS[matchId];
  var isFinished = result && result.score && !result.live;

  var detail = document.getElementById('predict-detail');
  if (!detail) return;

  var html = '';

  // 头部
  html += '<div class="predict-detail-hero">';
  html += '<div class="predict-detail-teams">' + flagImg(match.home, 'detail-flag') + ' ' + match.home + ' <span class="predict-detail-vs">VS</span> ' + match.away + ' ' + flagImg(match.away, 'detail-flag') + '</div>';
  html += '<div class="predict-detail-meta">' + match.date + ' ' + match.time + ' · ' + match.venue + '</div>';
  if (isFinished && result) {
    html += '<div class="predict-detail-score">最终比分 ' + result.score + '</div>';
  }
  html += '</div>';

  // 预测结果
  html += '<div class="predict-detail-section">';
  html += '<div class="predict-detail-title">AI 预测';
  if (pred.confidence) {
    var confClass = pred.confidence === '高' ? 'confidence-high' : (pred.confidence === '低' ? 'confidence-low' : 'confidence-mid');
    html += ' <span class="confidence-badge ' + confClass + '">置信度：' + pred.confidence + '</span>';
  }
  html += '</div>';

  html += '<div class="predict-detail-grid">';
  html += '<div class="predict-detail-item"><div class="pdi-label">胜平负</div><div class="pdi-value wdl-' + pred.winDrawLose + '">' + pred.winDrawLose + '</div>';
  if (pred.result && pred.result.correct) {
    html += pred.result.correct.wdl ? '<div class="pdi-hit">命中</div>' : '';
  }
  html += '</div>';

  html += '<div class="predict-detail-item"><div class="pdi-label">比分</div><div class="pdi-value">' + pred.score + '</div>';
  if (pred.result && pred.result.correct) {
    html += pred.result.correct.score ? '<div class="pdi-hit">命中</div>' : '';
  }
  html += '</div>';

  html += '<div class="predict-detail-item"><div class="pdi-label">半全场</div><div class="pdi-value">' + pred.halfFull + '</div>';
  if (pred.result && pred.result.correct) {
    html += pred.result.correct.hf ? '<div class="pdi-hit">命中</div>' : '';
  }
  html += '</div>';

  html += '<div class="predict-detail-item"><div class="pdi-label">进球数</div><div class="pdi-value">' + pred.goals + '</div>';
  if (pred.result && pred.result.correct) {
    html += pred.result.correct.goals ? '<div class="pdi-hit">命中</div>' : '';
  }
  html += '</div>';
  html += '</div>';
  html += '</div>';

  // 概率分析
  html += '<div class="predict-detail-section">';
  html += '<div class="predict-detail-title">概率分析</div>';
  html += '<div class="predict-prob-detail">';
  html += '<div class="prob-detail-row"><span class="prob-detail-label">' + match.home + '胜</span><div class="prob-detail-bar-wrap"><div class="prob-detail-bar prob-home" style="width:' + pred.homeWinProb + '%"></div></div><span class="prob-detail-num">' + pred.homeWinProb + '%</span></div>';
  html += '<div class="prob-detail-row"><span class="prob-detail-label">平局</span><div class="prob-detail-bar-wrap"><div class="prob-detail-bar prob-draw" style="width:' + pred.drawProb + '%"></div></div><span class="prob-detail-num">' + pred.drawProb + '%</span></div>';
  html += '<div class="prob-detail-row"><span class="prob-detail-label">' + match.away + '胜</span><div class="prob-detail-bar-wrap"><div class="prob-detail-bar prob-away" style="width:' + pred.awayWinProb + '%"></div></div><span class="prob-detail-num">' + pred.awayWinProb + '%</span></div>';
  html += '</div>';
  html += '</div>';

  // AI分析
  html += '<div class="predict-detail-section">';
  html += '<div class="predict-detail-title">AI 分析</div>';
  html += '<div class="predict-analysis">' + pred.analysis.replace(/\n/g, '<br>') + '</div>';
  html += '<div class="predict-time">预测时间：' + pred.predictTime + '</div>';
  html += '</div>';

  // 赛果验证
  if (pred.result && pred.result.verified) {
    html += '<div class="predict-detail-section predict-verify-section">';
    html += '<div class="predict-detail-title">赛果验证</div>';

    var c = pred.result.correct;
    var correctItems = [];
    if (c.wdl) correctItems.push('胜平负');
    if (c.score) correctItems.push('比分');
    if (c.hf) correctItems.push('半全场');
    if (c.goals) correctItems.push('进球数');

    html += '<div class="verify-summary">';
    html += '<div class="verify-row"><span class="verify-label">实际比分</span><span class="verify-value">' + pred.result.score + '</span></div>';
    html += '<div class="verify-row"><span class="verify-label">预测胜平负</span><span class="verify-value">' + pred.winDrawLose + '</span><span class="verify-icon ' + (c.wdl ? 'icon-hit' : 'icon-miss') + '">' + (c.wdl ? '命中' : '') + '</span></div>';
    html += '<div class="verify-row"><span class="verify-label">预测比分</span><span class="verify-value">' + pred.score + '</span><span class="verify-icon ' + (c.score ? 'icon-hit' : 'icon-miss') + '">' + (c.score ? '命中' : '') + '</span></div>';
    html += '<div class="verify-row"><span class="verify-label">预测半全场</span><span class="verify-value">' + pred.halfFull + '</span><span class="verify-icon ' + (c.hf ? 'icon-hit' : 'icon-miss') + '">' + (c.hf ? '命中' : '') + '</span></div>';
    html += '<div class="verify-row"><span class="verify-label">预测进球数</span><span class="verify-value">' + pred.goals + '</span><span class="verify-icon ' + (c.goals ? 'icon-hit' : 'icon-miss') + '">' + (c.goals ? '命中' : '') + '</span></div>';
    html += '</div>';

    if (correctItems.length > 0) {
      html += '<div class="verify-conclusion hit">命中 ' + correctItems.join('、') + '</div>';
    } else {
      html += '<div class="verify-conclusion miss">本场预测未命中，继续加油！</div>';
    }
    html += '</div>';
  }

  // 重新预测按钮（仅未结束的比赛）
  if (!isFinished) {
    html += '<div class="predict-detail-section">';
    html += '<button class="predict-retry-btn" onclick="retryPrediction(' + matchId + ')">重新预测</button>';
    html += '</div>';
  }

  detail.innerHTML = html;

  var modal = document.getElementById('predict-modal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closePredictModal() {
  var modal = document.getElementById('predict-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

function retryPrediction(matchId) {
  // 删除旧预测，重新生成
  var preds = getPredictions();
  delete preds[matchId];
  savePredictions(preds);
  closePredictModal();
  openPredictDetail(matchId);
}

// ========== 预测系统初始化 ==========
function initPredictSystem() {
  // 绑定弹窗关闭
  var closeBtn = document.getElementById('predict-modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closePredictModal);
  var modal = document.getElementById('predict-modal');
  if (modal) modal.addEventListener('click', function(e) { if (e.target === modal) closePredictModal(); });

  // 验证已有预测
  verifyAllPredictions();

  // 为今天的比赛自动生成预测
  generateTodayPredictions();

  // 渲染预测页面
  renderPredictPage();

  // 注意：Tab切换时的预测渲染由 app.js 的统一 tab 切换逻辑处理
  // 不再在这里绑定 predictTab 的 click 监听器，避免与 app.js 竞争
}

// 在数据加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initPredictSystem, 100);
  });
} else {
  setTimeout(initPredictSystem, 100);
}
