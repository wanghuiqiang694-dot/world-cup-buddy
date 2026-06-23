// ========== 欧洲联赛通用数据与渲染 ==========
// 支持：欧冠、英超、西甲、德甲、意甲、法甲

// 各联赛数据存储
var LEAGUE_DATA = {
  champions: { matches: [], standings: [], matchResults: {}, lastUpdated: '' },
  premier:  { matches: [], standings: [], matchResults: {}, lastUpdated: '' },
  laliga:   { matches: [], standings: [], matchResults: {}, lastUpdated: '' },
  bundesliga: { matches: [], standings: [], matchResults: {}, lastUpdated: '' },
  seriea:   { matches: [], standings: [], matchResults: {}, lastUpdated: '' },
  ligue1:   { matches: [], standings: [], matchResults: {}, lastUpdated: '' }
};

// 联赛子视图状态
var leagueSubView = 'standings'; // standings | schedule | predict

// 联赛配色
var LEAGUE_COLORS = {
  champions: '#1a237e',
  premier: '#3d0c02',
  laliga: '#b71c1c',
  bundesliga: '#1b5e20',
  seriea: '#0d47a1',
  ligue1: '#1a237e'
};

// ========== 联赛通用渲染 ==========

function renderLeaguePage(leagueKey) {
  renderLeagueEventPage(leagueKey);
  renderLeagueTeamsPage(leagueKey);
  renderLeaguePredictPage(leagueKey);
}

function renderLeagueEventPage(leagueKey) {
  // 隐藏世界杯的子导航
  var wcNav = $('#event-sub-nav');
  if (wcNav) wcNav.innerHTML = '';

  var content = $('#event-content');
  if (!content) return;

  var data = LEAGUE_DATA[leagueKey];
  var config = LEAGUE_CONFIG[leagueKey];
  var color = LEAGUE_COLORS[leagueKey] || '#6366f1';

  var html = '';
  html += '<div class="mengchao-sub-nav">';
  html += '<a class="mengchao-sub-btn' + (leagueSubView === 'standings' ? ' active' : '') + '" onclick="switchLeagueSubView(\'' + leagueKey + '\',\'standings\')">积分榜</a>';
  html += '<a class="mengchao-sub-btn' + (leagueSubView === 'schedule' ? ' active' : '') + '" onclick="switchLeagueSubView(\'' + leagueKey + '\',\'schedule\')">赛程</a>';
  html += '<a class="mengchao-sub-btn' + (leagueSubView === 'predict' ? ' active' : '') + '" onclick="switchLeagueSubView(\'' + leagueKey + '\',\'predict\')">预测</a>';
  html += '</div>';

  if (leagueSubView === 'standings') {
    html += renderLeagueStandings(leagueKey, data, config, color);
  } else if (leagueSubView === 'schedule') {
    html += renderLeagueSchedule(leagueKey, data, config, color);
  } else {
    html += renderLeaguePredictView(leagueKey, data, config, color);
  }

  content.innerHTML = html;
}

function switchLeagueSubView(leagueKey, view) {
  leagueSubView = view;
  renderLeagueEventPage(leagueKey);
}

// ========== 积分榜 ==========

function renderLeagueStandings(leagueKey, data, config, color) {
  var html = '';
  html += '<div class="mengchao-standings-wrap">';
  html += '<div class="mengchao-section-title">' + config.name + '积分榜</div>';

  if (data.lastUpdated) {
    html += '<div class="mengchao-update-time">数据更新: ' + data.lastUpdated.slice(0, 10) + '</div>';
  }

  if (!data.standings || data.standings.length === 0) {
    html += '<div class="mengchao-rules-card"><div class="mengchao-rules-text">赛季数据尚未开始同步，请稍后再来查看。数据将通过云端自动更新。</div></div>';
    html += '</div>';
    return html;
  }

  // 判断是欧冠还是联赛来决定晋级区
  var isChampions = leagueKey === 'champions';
  var qualifyLine = isChampions ? Math.min(data.standings.length, 8) : 4; // 欧冠前8晋级，联赛前4欧冠资格
  var europaLine = isChampions ? -1 : (leagueKey === 'premier' ? 6 : 5); // 联赛欧联席位

  html += '<div class="mengchao-table-container"><table class="mengchao-table">';
  html += '<thead><tr><th>排名</th><th>球队</th><th>场</th><th>胜</th><th>平</th><th>负</th><th>进</th><th>失</th><th>净</th><th>积分</th></tr></thead>';
  html += '<tbody>';

  data.standings.forEach(function(s) {
    var gd = s.gf - s.ga;
    var gdClass = gd > 0 ? 'mengchao-gd-pos' : (gd < 0 ? 'mengchao-gd-neg' : '');
    var rankClass = '';
    if (s.rank <= qualifyLine) rankClass = 'mengchao-rank-top';
    else if (europaLine > 0 && s.rank <= europaLine) rankClass = 'mengchao-rank-mid';
    else if (s.rank > data.standings.length - 3) rankClass = 'mengchao-rank-bot';

    html += '<tr class="' + rankClass + '">';
    html += '<td class="mengchao-rank">' + s.rank + '</td>';
    html += '<td class="mengchao-team-cell">' + s.team + '</td>';
    html += '<td>' + s.played + '</td>';
    html += '<td class="mengchao-w">' + s.won + '</td>';
    html += '<td class="mengchao-d">' + s.drawn + '</td>';
    html += '<td class="mengchao-l">' + s.lost + '</td>';
    html += '<td>' + s.gf + '</td>';
    html += '<td>' + s.ga + '</td>';
    html += '<td class="' + gdClass + '">' + (gd > 0 ? '+' : '') + gd + '</td>';
    html += '<td class="mengchao-pts">' + s.pts + '</td>';
    html += '</tr>';
  });

  html += '</tbody></table></div>';

  // 图例
  html += '<div class="mengchao-legend">';
  if (isChampions) {
    html += '<span class="mengchao-legend-item"><span class="mengchao-legend-dot" style="background:#22c55e"></span>晋级淘汰赛</span>';
  } else {
    html += '<span class="mengchao-legend-item"><span class="mengchao-legend-dot" style="background:#22c55e"></span>欧冠区</span>';
    if (europaLine > qualifyLine) {
      html += '<span class="mengchao-legend-item"><span class="mengchao-legend-dot" style="background:#3b82f6"></span>欧联区</span>';
    }
  }
  html += '<span class="mengchao-legend-item"><span class="mengchao-legend-dot" style="background:#ef4444"></span>降级区</span>';
  html += '</div>';

  html += '</div>';
  return html;
}

// ========== 赛程 ==========

function renderLeagueSchedule(leagueKey, data, config, color) {
  var html = '';
  html += '<div class="mengchao-schedule-wrap">';
  html += '<div class="mengchao-section-title">' + config.name + '赛程</div>';

  if (!data.matches || data.matches.length === 0) {
    html += '<div class="mengchao-rules-card"><div class="mengchao-rules-text">赛季赛程数据尚未同步，请稍后再来查看。数据将通过云端自动更新。</div></div>';
    html += '</div>';
    return html;
  }

  // 按日期分组
  var today = new Date().toISOString().slice(0, 10);
  var todayM = [], tomorrowM = [], upcomingM = [], finishedM = [];
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var tomorrowStr = tomorrow.toISOString().slice(0, 10);

  data.matches.forEach(function(m) {
    var result = data.matchResults[m.id];
    var isFinished = result && result.score && !result.live;
    var isLive = result && result.live;

    if (isFinished) {
      finishedM.push(m);
    } else if (m.date === today || isLive) {
      todayM.push(m);
    } else if (m.date === tomorrowStr) {
      tomorrowM.push(m);
    } else {
      upcomingM.push(m);
    }
  });

  var sortByTime = function(a, b) { return (a.date + 'T' + (a.time || '')).localeCompare(b.date + 'T' + (b.time || '')); };
  todayM.sort(sortByTime);
  tomorrowM.sort(sortByTime);
  upcomingM.sort(sortByTime);
  finishedM.sort(function(a, b) { return (b.date + 'T' + (b.time || '')).localeCompare(a.date + 'T' + (a.time || '')); });

  // 今日
  if (todayM.length > 0) {
    html += '<div class="section-divider today-divider"><span>今日赛程</span><span class="section-divider-count">' + todayM.length + '场</span></div>';
    todayM.forEach(function(m) { html += renderLeagueMatchCard(m, data, color, true); });
  }

  // 明日
  if (tomorrowM.length > 0) {
    html += '<div class="section-divider tomorrow-divider"><span>明日赛程</span><span class="section-divider-count">' + tomorrowM.length + '场</span></div>';
    tomorrowM.forEach(function(m) { html += renderLeagueMatchCard(m, data, color, false); });
  }

  // 未来
  if (upcomingM.length > 0) {
    html += '<div class="section-divider upcoming-divider"><span>未来赛程</span><span class="section-divider-count">' + upcomingM.length + '场</span></div>';
    var lastDate = '';
    upcomingM.forEach(function(m) {
      if (m.date !== lastDate) {
        lastDate = m.date;
        var d = new Date(m.date + 'T00:00:00+08:00');
        var wd = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
        html += '<div class="date-header">' + m.date.slice(5) + ' 周' + wd + '</div>';
      }
      html += renderLeagueMatchCard(m, data, color, false);
    });
  }

  // 已结束
  if (finishedM.length > 0) {
    html += '<div class="section-divider finished-divider"><span>已结束</span><span class="section-divider-count">' + finishedM.length + '场</span></div>';
    var lastDate2 = '';
    finishedM.forEach(function(m) {
      if (m.date !== lastDate2) {
        lastDate2 = m.date;
        var d2 = new Date(m.date + 'T00:00:00+08:00');
        var wd2 = ['日', '一', '二', '三', '四', '五', '六'][d2.getDay()];
        html += '<div class="date-header">' + m.date.slice(5) + ' 周' + wd2 + '</div>';
      }
      html += renderLeagueMatchCard(m, data, color, false);
    });
  }

  html += '</div>';
  return html;
}

function renderLeagueMatchCard(m, data, color, isToday) {
  var result = data.matchResults[m.id];
  var isFinished = result && result.score && !result.live;
  var isLive = result && result.live;
  var round = m.round || '';

  if (isFinished) {
    var parts = result.score.split(':');
    var hg = parseInt(parts[0]) || 0, ag = parseInt(parts[1]) || 0;
    var homeWin = hg > ag, awayWin = ag > hg, draw = hg === ag;
    return '<div class="match-card match-finished">' +
      '<div class="match-meta"><span>' + m.date + ' ' + (m.time || '') + '</span><span>' + round + ' · 已结束</span></div>' +
      '<div class="match-vs match-vs-result">' +
        '<span class="match-team' + (homeWin ? ' team-won' : (!draw ? ' team-lost' : '')) + '">' + m.home + '</span>' +
        '<span class="match-score-final"><span class="score-home' + (homeWin ? ' score-won' : '') + '">' + parts[0] + '</span><span class="score-sep">:</span><span class="score-away' + (awayWin ? ' score-won' : '') + '">' + parts[1] + '</span></span>' +
        '<span class="match-team' + (awayWin ? ' team-won' : (!draw ? ' team-lost' : '')) + '">' + m.away + '</span>' +
      '</div>' +
      (m.venue ? '<div class="match-venue">' + m.venue + '</div>' : '') +
      '</div>';
  }

  if (isToday || isLive) {
    var score = result && result.score ? result.score : null;
    var centerHtml = score ? '<span class="match-score-live">' + score + '</span>' : '<span class="match-live">' + (isLive ? '进行中' : '今天 ' + (m.time || '')) + '</span>';
    return '<div class="match-card match-today">' +
      '<div class="match-meta"><span>' + m.date + ' ' + (m.time || '') + '</span><span>' + round + (isLive ? ' · 进行中' : '') + '</span></div>' +
      '<div class="match-vs"><span class="match-team">' + m.home + '</span>' + centerHtml + '<span class="match-team">' + m.away + '</span></div>' +
      (m.venue ? '<div class="match-venue">' + m.venue + '</div>' : '') +
      '</div>';
  }

  return '<div class="match-card">' +
    '<div class="match-meta"><span>' + m.date + ' ' + (m.time || '') + '</span><span>' + round + '</span></div>' +
    '<div class="match-vs"><span class="match-team">' + m.home + '</span><span class="vs">VS</span><span class="match-team">' + m.away + '</span></div>' +
    (m.venue ? '<div class="match-venue">' + m.venue + '</div>' : '') +
    '</div>';
}

// ========== 预测 ==========

function renderLeaguePredictView(leagueKey, data, config, color) {
  var html = '';
  html += '<div class="mengchao-predict-wrap">';

  if (!data.matches || data.matches.length === 0 || !data.standings || data.standings.length === 0) {
    html += '<div class="mengchao-rules-card"><div class="mengchao-rules-text">赛季数据尚未同步，预测功能将在数据可用后自动开放。</div></div>';
    html += '</div>';
    return html;
  }

  // 找未开始的比赛（最近5场）
  var upcomingMatches = data.matches.filter(function(m) {
    return !data.matchResults[m.id] || !data.matchResults[m.id].score;
  }).slice(0, 5);

  if (upcomingMatches.length === 0) {
    html += '<div class="mengchao-section-title">本轮比赛已全部结束</div>';
    html += '</div>';
    return html;
  }

  html += '<div class="mengchao-section-title">' + config.name + '预测</div>';

  upcomingMatches.forEach(function(m) {
    // 从积分榜找排名
    var homeStanding = data.standings.find(function(s) { return s.team === m.home; });
    var awayStanding = data.standings.find(function(s) { return s.team === m.away; });
    var homeRank = homeStanding ? homeStanding.rank : '-';
    var awayRank = awayStanding ? awayStanding.rank : '-';

    // 简单预测逻辑：基于排名和积分
    var homePts = homeStanding ? homeStanding.pts : 0;
    var awayPts = awayStanding ? awayStanding.pts : 0;
    var homePlayed = homeStanding ? Math.max(homeStanding.played, 1) : 1;
    var awayPlayed = awayStanding ? Math.max(awayStanding.played, 1) : 1;
    var homePPG = homePts / homePlayed;
    var awayPPG = awayPts / awayPlayed;

    // 主场优势 +0.3
    var homeStrength = homePPG + 0.3;
    var awayStrength = awayPPG;

    var wdl = homeStrength > awayStrength + 0.3 ? '主胜' : (awayStrength > homeStrength + 0.3 ? '客胜' : '平');
    var diff = Math.abs(homeStrength - awayStrength);
    var homeGoals, awayGoals;
    if (diff > 1) {
      homeGoals = wdl === '主胜' ? 2 : 0;
      awayGoals = wdl === '客胜' ? 2 : 0;
    } else {
      homeGoals = wdl === '主胜' ? 1 : (wdl === '平' ? 1 : 0);
      awayGoals = wdl === '客胜' ? 1 : (wdl === '平' ? 1 : 0);
    }
    if (homeGoals === 0 && awayGoals === 0) homeGoals = 1;

    var goalsLabel = (homeGoals + awayGoals) <= 2 ? '小2.5球' : '大2.5球';

    html += '<div class="mengchao-predict-card">';
    html += '<div class="mengchao-predict-header">';
    html += '<div class="mengchao-predict-team">';
    html += '<span class="mengchao-predict-team-name">' + m.home + '</span>';
    html += '<span class="mengchao-predict-rank">#' + homeRank + '</span>';
    html += '</div>';
    html += '<div class="mengchao-predict-vs">VS</div>';
    html += '<div class="mengchao-predict-team mengchao-predict-team-away">';
    html += '<span class="mengchao-predict-rank">#' + awayRank + '</span>';
    html += '<span class="mengchao-predict-team-name">' + m.away + '</span>';
    html += '</div>';
    html += '</div>';
    html += '<div class="mengchao-predict-info">' + m.date + ' ' + (m.time || '') + (m.venue ? ' · ' + m.venue : '') + '</div>';
    html += '<div class="mengchao-predict-result">';
    html += '<span class="mengchao-predict-wdl wdl-' + (wdl === '主胜' ? 'home' : wdl === '客胜' ? 'away' : 'draw') + '">' + wdl + '</span>';
    html += '<span class="mengchao-predict-score">' + homeGoals + ':' + awayGoals + '</span>';
    html += '<span class="mengchao-predict-goals">' + goalsLabel + '</span>';
    html += '</div>';
    html += '</div>';
  });

  html += '</div>';
  return html;
}

// ========== 球队页面 ==========

function renderLeagueTeamsPage(leagueKey) {
  var content = $('#page-teams');
  if (!content) return;

  var data = LEAGUE_DATA[leagueKey];
  var config = LEAGUE_CONFIG[leagueKey];
  var color = LEAGUE_COLORS[leagueKey] || '#6366f1';

  var html = '';
  html += '<div class="mengchao-teams-wrap">';
  html += '<div class="mengchao-section-title">' + config.name + '球队</div>';

  if (!data.standings || data.standings.length === 0) {
    html += '<div class="mengchao-rules-card"><div class="mengchao-rules-text">赛季数据尚未同步，请稍后再来查看。</div></div>';
    html += '</div>';
    content.innerHTML = html;
    return;
  }

  html += '<div class="mengchao-teams-grid">';

  data.standings.forEach(function(s) {
    html += '<div class="mengchao-team-card" style="border-left:4px solid ' + color + '">';
    html += '<div class="mengchao-team-card-header">';
    html += '<span class="mengchao-team-card-rank">#' + s.rank + '</span>';
    html += '<span class="mengchao-team-card-name">' + s.team + '</span>';
    html += '<span class="mengchao-team-card-pts">' + s.pts + '分</span>';
    html += '</div>';
    html += '<div class="mengchao-team-card-stats">';
    html += '<span>' + s.won + '胜</span><span>' + s.drawn + '平</span><span>' + s.lost + '负</span>';
    html += '<span>进' + s.gf + '球</span><span>失' + s.ga + '球</span>';
    html += '</div>';
    html += renderFanMiniBar('team_' + s.team);
    html += '</div>';
  });

  html += '</div></div>';
  content.innerHTML = html;
}

// ========== 预测页面（tab） ==========

function renderLeaguePredictPage(leagueKey) {
  var content = $('#predict-content');
  if (!content) return;

  var data = LEAGUE_DATA[leagueKey];
  var config = LEAGUE_CONFIG[leagueKey];

  var html = '';
  html += '<div class="mengchao-predict-wrap">';
  html += '<div class="mengchao-section-title">' + config.name + '预测</div>';

  if (!data.matches || data.matches.length === 0) {
    html += '<div class="mengchao-rules-card"><div class="mengchao-rules-text">赛季数据尚未同步，预测功能将在数据可用后自动开放。</div></div>';
  } else {
    html += renderLeaguePredictView(leagueKey, data, config, LEAGUE_COLORS[leagueKey]);
  }

  html += '</div>';
  content.innerHTML = html;
}
