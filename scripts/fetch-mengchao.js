#!/usr/bin/env node
/**
 * 从网络搜索抓取蒙超联赛最新数据
 * 更新 data/mengchao.json
 * 
 * 数据源策略：
 * 1. 优先从 TheSportsDB 搜索（如果有蒙超数据）
 * 2. 备选从搜索引擎抓取新闻页面解析比分
 * 3. 如果都没有新数据，保持现有数据不变
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const DATA_FILE = path.join(__dirname, '..', 'data', 'mengchao.json');

// 球队名称列表（用于匹配搜索结果）
const TEAM_NAMES = [
  '赤峰', '鄂尔多斯', '通辽', '乌兰察布', '包头', '阿拉善盟',
  '巴彦淖尔', '呼和浩特', '兴安盟', '锡林郭勒盟', '呼伦贝尔', '乌海'
];

// 解析比分文本 "赤峰 4:1 呼伦贝尔" -> { home, away, homeScore, awayScore }
function parseScoreText(text) {
  // 匹配模式：球队A 数字:数字 球队B
  const patterns = [
    /(\S+?)\s*(\d+)\s*[:：]\s*(\d+)\s*(\S+)/,
    /(\S+?)\s*(\d+)\s*[-—]\s*(\d+)\s*(\S+)/
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const home = match[1].trim();
      const away = match[4].trim();
      const homeScore = parseInt(match[2]);
      const awayScore = parseInt(match[3]);

      // 验证是否是蒙超球队
      const homeTeam = TEAM_NAMES.find(t => home.includes(t));
      const awayTeam = TEAM_NAMES.find(t => away.includes(t));

      if (homeTeam && awayTeam) {
        return { home: homeTeam, away: awayTeam, homeScore, awayScore };
      }
    }
  }
  return null;
}

// 从 TheSportsDB 搜索蒙超赛事
async function fetchFromTheSportsDB() {
  console.log('尝试从 TheSportsDB 搜索蒙超赛事...');

  // TheSportsDB 中蒙超的 League ID 可能不存在
  // 尝试搜索最近的内蒙古足球赛事
  try {
    const url = 'https://www.thesportsdb.com/api/v1/json/3/searchevents.php?e=Inner+Mongolia+Super+League';
    const resp = await fetch(url);
    const data = await resp.json();

    if (data.event && data.event.length > 0) {
      console.log(`  找到 ${data.event.length} 条赛事`);
      return data.event;
    }
  } catch (e) {
    console.warn('  TheSportsDB 搜索失败:', e.message);
  }

  return [];
}

// 从百度搜索抓取蒙超最新赛果
async function fetchFromBaiduSearch() {
  console.log('尝试从百度搜索获取蒙超最新赛果...');

  // 当前轮次和日期
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const searchQueries = [
    `${year}蒙超联赛第${Math.ceil(month - 4)}轮比分`,
    `${year}内蒙古足球超级联赛积分榜`,
    `蒙超${year}最新比分`
  ];

  const results = [];

  for (const query of searchQueries) {
    try {
      const url = `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`;
      const resp = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      const html = await resp.text();

      // 从搜索结果摘要中提取比分
      // 百度搜索结果通常包含比分信息在摘要文本中
      const scoreRegex = /(?:赤峰|鄂尔多斯|通辽|乌兰察布|包头|阿拉善|巴彦淖尔|呼和浩特|兴安盟|锡林郭勒|呼伦贝尔|乌海)[^\d]*?(\d+)\s*[:：]\s*(\d+)/g;
      let match;
      while ((match = scoreRegex.exec(html)) !== null) {
        const context = html.substring(Math.max(0, match.index - 50), match.index + match[0].length + 50);
        const parsed = parseScoreText(context);
        if (parsed) {
          results.push(parsed);
        }
      }
    } catch (e) {
      console.warn(`  搜索"${query}"失败:`, e.message);
    }
  }

  return results;
}

// 从懂球帝/虎扑等体育网站抓取
async function fetchFromSportsSites() {
  console.log('尝试从体育网站获取蒙超数据...');

  const results = [];

  // 尝试从足球数据网站获取
  const sources = [
    {
      name: '球探网',
      url: 'https://live.zqzq.info/Match/MatchList?leagueid=9801',
      parse: (html) => {
        const scores = [];
        // 简单的正则匹配比分
        const regex = /(\d+)\s*-\s*(\d+)/g;
        // 实际解析需要根据具体页面结构
        return scores;
      }
    }
  ];

  for (const source of sources) {
    try {
      const resp = await fetch(source.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      if (resp.ok) {
        const html = await resp.text();
        const scores = source.parse(html);
        results.push(...scores);
      }
    } catch (e) {
      console.warn(`  ${source.name} 抓取失败:`, e.message);
    }
  }

  return results;
}

async function main() {
  console.log('=== 开始抓取蒙超联赛数据 ===');

  // 读取现有数据
  let existingData = {
    lastUpdated: '',
    teams: {},
    standings: [],
    matches: [],
    scorers: []
  };

  if (fs.existsSync(DATA_FILE)) {
    try {
      existingData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (e) {}
  }

  console.log(`现有数据：${existingData.matches.length} 场赛程，${existingData.standings.length} 支球队`);

  // 多源尝试获取最新数据
  let newScores = [];

  // 方法1：TheSportsDB
  const theSportsDBEvents = await fetchFromTheSportsDB();

  // 方法2：百度搜索
  const baiduScores = await fetchFromBaiduSearch();
  newScores.push(...baiduScores);

  // 方法3：体育网站
  const siteScores = await fetchFromSportsSites();
  newScores.push(...siteScores);

  if (newScores.length === 0 && theSportsDBEvents.length === 0) {
    console.log('未能获取到新的蒙超数据，保持现有数据不变');
    return;
  }

  // 处理 TheSportsDB 数据
  if (theSportsDBEvents.length > 0) {
    theSportsDBEvents.forEach(evt => {
      const homeCN = TEAM_NAMES.find(t => (evt.strHomeTeam || '').includes(t));
      const awayCN = TEAM_NAMES.find(t => (evt.strAwayTeam || '').includes(t));
      if (!homeCN || !awayCN) return;

      const homeScore = parseInt(evt.intHomeScore);
      const awayScore = parseInt(evt.intAwayScore);
      if (isNaN(homeScore) || isNaN(awayScore)) return;

      newScores.push({ home: homeCN, away: awayCN, homeScore, awayScore });
    });
  }

  // 去重
  const seen = new Set();
  const uniqueScores = newScores.filter(s => {
    const key = s.home + '_vs_' + s.away;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`获取到 ${uniqueScores.length} 条新比分数据`);

  // 更新比赛数据
  let updated = 0;
  uniqueScores.forEach(score => {
    const match = existingData.matches.find(m =>
      m.home === score.home && m.away === score.away && !m.finished
    );
    if (match) {
      match.homeScore = score.homeScore;
      match.awayScore = score.awayScore;
      match.finished = true;
      updated++;
    }
  });

  if (updated > 0) {
    console.log(`更新了 ${updated} 场比赛比分`);

    // 重新计算积分榜
    recalcStandings(existingData);

    // 更新时间戳
    existingData.lastUpdated = new Date().toISOString();

    // 写入文件
    fs.writeFileSync(DATA_FILE, JSON.stringify(existingData, null, 2), 'utf8');
    console.log('data/mengchao.json 已更新');
  } else {
    console.log('没有需要更新的比赛数据');
  }
}

// 根据比赛结果重新计算积分榜
function recalcStandings(data) {
  const teams = {};

  // 初始化所有球队
  Object.keys(data.teams).forEach(team => {
    teams[team] = { team, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 };
  });

  // 统计已完成的比赛
  data.matches.forEach(m => {
    if (!m.finished || m.homeScore === null) return;

    if (!teams[m.home]) teams[m.home] = { team: m.home, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 };
    if (!teams[m.away]) teams[m.away] = { team: m.away, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 };

    teams[m.home].played++;
    teams[m.away].played++;
    teams[m.home].gf += m.homeScore;
    teams[m.home].ga += m.awayScore;
    teams[m.away].gf += m.awayScore;
    teams[m.away].ga += m.homeScore;

    if (m.homeScore > m.awayScore) {
      teams[m.home].won++;
      teams[m.home].pts += 3;
      teams[m.away].lost++;
    } else if (m.homeScore === m.awayScore) {
      teams[m.home].drawn++;
      teams[m.home].pts += 1;
      teams[m.away].drawn++;
      teams[m.away].pts += 1;
    } else {
      teams[m.away].won++;
      teams[m.away].pts += 3;
      teams[m.home].lost++;
    }
  });

  // 排名
  const standings = Object.values(teams).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    const gdA = a.gf - a.ga, gdB = b.gf - b.ga;
    if (gdB !== gdA) return gdB - gdA;
    return b.gf - a.gf;
  });

  standings.forEach((s, i) => { s.rank = i + 1; });

  data.standings = standings;
}

main().catch(err => {
  console.error('脚本执行失败:', err);
  process.exit(1);
});
