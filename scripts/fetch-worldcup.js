#!/usr/bin/env node
/**
 * 从 TheSportsDB API 抓取 2026 世界杯赛程和比分数据
 * 更新 data/worldcup.json
 * 
 * 策略（混合模式）：
 * 1. 优先使用 eventsday.php（返回准确的2026 WC数据，但每天最多3条）
 * 2. 对 eventsday 未覆盖的比赛，用 searchevents.php 补充
 * 3. searchevents 严格过滤：只接受 idLeague=4429 AND strSeason=2026 的结果
 * 4. 永远不覆写比赛日期（searchevents可能返回历史比赛导致日期错乱）
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'worldcup.json');

const TEAM_EN_MAP = {
  '墨西哥': 'Mexico', '南非': 'South Africa', '韩国': 'South Korea', '捷克': 'Czech Republic',
  '加拿大': 'Canada', '波黑': 'Bosnia-Herzegovina', '卡塔尔': 'Qatar', '瑞士': 'Switzerland',
  '巴西': 'Brazil', '摩洛哥': 'Morocco', '海地': 'Haiti', '苏格兰': 'Scotland',
  '美国': 'USA', '巴拉圭': 'Paraguay', '澳大利亚': 'Australia', '土耳其': 'Turkey',
  '德国': 'Germany', '库拉索': 'Curacao', '科特迪瓦': 'Ivory Coast', '厄瓜多尔': 'Ecuador',
  '荷兰': 'Netherlands', '日本': 'Japan', '瑞典': 'Sweden', '突尼斯': 'Tunisia',
  '比利时': 'Belgium', '埃及': 'Egypt', '伊朗': 'Iran', '新西兰': 'New Zealand',
  '西班牙': 'Spain', '佛得角': 'Cape Verde', '沙特阿拉伯': 'Saudi Arabia', '乌拉圭': 'Uruguay',
  '法国': 'France', '塞内加尔': 'Senegal', '伊拉克': 'Iraq', '挪威': 'Norway',
  '阿根廷': 'Argentina', '阿尔及利亚': 'Algeria', '奥地利': 'Austria', '约旦': 'Jordan',
  '葡萄牙': 'Portugal', '民主刚果': 'DR Congo', '乌兹别克斯坦': 'Uzbekistan', '哥伦比亚': 'Colombia',
  '英格兰': 'England', '克罗地亚': 'Croatia', '加纳': 'Ghana', '巴拿马': 'Panama'
};

const EN_CN_MAP = {};
for (const [cn, en] of Object.entries(TEAM_EN_MAP)) {
  EN_CN_MAP[en.toLowerCase()] = cn;
}

function findChineseTeam(enName) {
  if (!enName) return null;
  const cn = EN_CN_MAP[enName.toLowerCase()];
  if (cn) return cn;
  const lower = enName.toLowerCase();
  for (const [en, cn2] of Object.entries(EN_CN_MAP)) {
    if (lower.includes(en.split(' ')[0])) return cn2;
  }
  return null;
}

async function fetchWithRetry(url, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const resp = await fetch(url);
      if (resp.ok) return await resp.json();
      console.warn(`  请求失败 (attempt ${i + 1}): ${resp.status}`);
      await new Promise(r => setTimeout(r, delay));
    } catch (e) {
      console.warn(`  网络错误 (attempt ${i + 1}): ${e.message}`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  return null;
}

/**
 * 从赛事数据更新比分（不更新日期，防止历史数据污染）
 */
function applyScore(match, evt, updatedResults) {
  const homeScore = evt.intHomeScore;
  const awayScore = evt.intAwayScore;
  const status = evt.strStatus;

  if (homeScore !== null && awayScore !== null && homeScore !== undefined && awayScore !== undefined) {
    const isFinished = ['FT', 'AET', 'PEN'].includes(status);
    const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'BT', 'LIVE'].includes(status);

    const existing = updatedResults[match.id];
    const newResult = {
      score: homeScore + ':' + awayScore,
      events: isFinished ? '比赛结束' : isLive ? '进行中' : (existing ? existing.events : ''),
      live: isLive
    };

    if (!existing || existing.score !== newResult.score) {
      updatedResults[match.id] = newResult;
      return true;
    }
  }
  return false;
}

async function main() {
  console.log('=== 开始抓取世界杯数据 (混合模式) ===');

  let existingData = { matches: [], matchResults: {} };
  if (fs.existsSync(DATA_FILE)) {
    try {
      existingData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (e) {}
  }

  const matches = existingData.matches;
  const updatedResults = { ...existingData.matchResults };
  let resultUpdated = 0;

  // 构建比赛索引
  const matchByKey = {};
  matches.forEach(m => { matchByKey[m.home + '_vs_' + m.away] = m; });

  // ========== 第一步：eventsday.php（准确但截断） ==========
  const now = new Date();
  const dates = [];
  // 只查询过去7天到未来3天
  for (let i = -7; i <= 3; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const ds = d.toISOString().slice(0, 10);
    if (ds >= '2026-06-11' && ds <= '2026-07-21') dates.push(ds);
  }

  console.log(`第一步：eventsday 查询 ${dates.length} 天数据...`);

  const foundByEventsday = new Set(); // 记录eventsday已覆盖的比赛
  const batchSize = 5;

  for (let i = 0; i < dates.length; i += batchSize) {
    const batch = dates.slice(i, i + batchSize);
    const promises = batch.map(date =>
      fetchWithRetry(`https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${date}&l=4429`)
        .then(data => (data && data.events) ? data.events : [])
        .catch(() => [])
    );
    const results = await Promise.all(promises);

    for (const events of results) {
      for (const evt of events) {
        // 严格过滤：只接受2026 WC赛事
        if (evt.idLeague !== '4429' || evt.strSeason !== '2026') continue;

        const homeCN = findChineseTeam(evt.strHomeTeam);
        const awayCN = findChineseTeam(evt.strAwayTeam);
        if (!homeCN || !awayCN) continue;

        const key = homeCN + '_vs_' + awayCN;
        const match = matchByKey[key];
        if (!match) continue;

        foundByEventsday.add(match.id);
        if (applyScore(match, evt, updatedResults)) resultUpdated++;
      }
    }

    if (i + batchSize < dates.length) {
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  console.log(`  eventsday 覆盖 ${foundByEventsday.size} 场，更新 ${resultUpdated} 条比分`);

  // ========== 第二步：searchevents.php 补充未覆盖的比赛 ==========
  // 找出近期（过去7天-未来3天）但eventsday未覆盖的比赛
  const recentDateStart = new Date(now);
  recentDateStart.setDate(recentDateStart.getDate() - 7);
  const recentDateEnd = new Date(now);
  recentDateEnd.setDate(recentDateEnd.getDate() + 3);
  const recentStartStr = recentDateStart.toISOString().slice(0, 10);
  const recentEndStr = recentDateEnd.toISOString().slice(0, 10);

  const missingMatches = matches.filter(m => {
    return !foundByEventsday.has(m.id) &&
           m.date >= recentStartStr && m.date <= recentEndStr;
  });

  console.log(`第二步：searchevents 补充 ${missingMatches.length} 场未覆盖比赛...`);

  let searchUpdated = 0;
  const searchBatchSize = 3;

  for (let i = 0; i < missingMatches.length; i += searchBatchSize) {
    const batch = missingMatches.slice(i, i + searchBatchSize);
    console.log(`  查询第 ${i + 1}-${Math.min(i + searchBatchSize, missingMatches.length)} 场...`);

    const promises = batch.map(async (match) => {
      const homeEN = TEAM_EN_MAP[match.home];
      const awayEN = TEAM_EN_MAP[match.away];
      if (!homeEN || !awayEN) return null;

      const query = `${homeEN}_vs_${awayEN}`;
      const data = await fetchWithRetry(`https://www.thesportsdb.com/api/v1/json/3/searchevents.php?e=${encodeURIComponent(query)}`);
      if (!data) return null;

      const events = data.event || data.events || [];
      if (events.length === 0) return null;

      // 严格过滤：只接受 idLeague=4429 AND strSeason=2026
      const wc2026Event = events.find(e => e.idLeague === '4429' && e.strSeason === '2026');
      if (!wc2026Event) return null; // 没找到2026 WC比赛，跳过（避免历史数据污染）

      return { match, evt: wc2026Event };
    });

    const results = await Promise.all(promises);
    for (const item of results) {
      if (!item) continue;
      if (applyScore(item.match, item.evt, updatedResults)) searchUpdated++;
    }

    if (i + searchBatchSize < missingMatches.length) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log(`  searchevents 补充更新 ${searchUpdated} 条比分`);
  console.log(`总计更新 ${resultUpdated + searchUpdated} 条比分`);

  // 写入文件
  const output = {
    lastUpdated: new Date().toISOString(),
    matches: matches,
    matchResults: updatedResults
  };

  fs.writeFileSync(DATA_FILE, JSON.stringify(output, null, 2), 'utf8');
  console.log('data/worldcup.json 已更新');
}

main().catch(err => {
  console.error('脚本执行失败:', err);
  process.exit(1);
});
