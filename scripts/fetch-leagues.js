#!/usr/bin/env node
/**
 * 从 TheSportsDB API 抓取欧洲主流联赛赛程和比分数据
 * 支持联赛：欧冠、英超、西甲、德甲、意甲、法甲
 * 
 * TheSportsDB League IDs:
 * - 欧冠 (Champions League): 4480
 * - 英超 (Premier League): 4328
 * - 西甲 (La Liga): 4335
 * - 德甲 (Bundesliga): 4331
 * - 意甲 (Serie A): 4332
 * - 法甲 (Ligue 1): 4334
 */

const fs = require('fs');
const path = require('path');

const LEAGUES = {
  champions: { id: 4480, name: '欧冠', file: 'champions.json', season: '2025-2026' },
  premier:  { id: 4328, name: '英超', file: 'premier.json', season: '2025-2026' },
  laliga:   { id: 4335, name: '西甲', file: 'laliga.json', season: '2025-2026' },
  bundesliga: { id: 4331, name: '德甲', file: 'bundesliga.json', season: '2025-2026' },
  seriea:   { id: 4332, name: '意甲', file: 'seriea.json', season: '2025-2026' },
  ligue1:   { id: 4334, name: '法甲', file: 'ligue1.json', season: '2025-2026' }
};

const DATA_DIR = path.join(__dirname, '..', 'data');

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const resp = await fetch(url);
      if (resp.ok) return await resp.json();
      console.warn(`  请求失败 (attempt ${i + 1}): ${resp.status}`);
      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {
      console.warn(`  网络错误 (attempt ${i + 1}): ${e.message}`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  return null;
}

async function fetchLeagueData(leagueKey, leagueConfig) {
  console.log(`\n=== 开始抓取 ${leagueConfig.name} 数据 ===`);
  
  const dataFile = path.join(DATA_DIR, leagueConfig.file);
  
  // 读取现有数据
  let existingData = { matches: [], standings: [], matchResults: {} };
  if (fs.existsSync(dataFile)) {
    try {
      existingData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    } catch (e) {}
  }
  
  const leagueId = leagueConfig.id;
  
  // 1. 获取联赛赛季信息
  const seasonData = await fetchWithRetry(
    `https://www.thesportsdb.com/api/v1/json/3/searchevents.php?e=&l=${leagueId}&s=${leagueConfig.season}`
  );
  
  if (!seasonData || !seasonData.event) {
    console.log(`  ${leagueConfig.name}: TheSportsDB 暂无赛季数据`);
    return false;
  }
  
  const events = seasonData.event;
  console.log(`  获取到 ${events.length} 场赛事`);
  
  // 2. 处理赛程和比分
  const updatedMatches = [...existingData.matches];
  const updatedResults = { ...existingData.matchResults };
  const matchIndex = {};
  updatedMatches.forEach((m, i) => { matchIndex[m.id] = i; });
  
  let newMatches = 0;
  let updatedResultsCount = 0;
  
  events.forEach(evt => {
    if (!evt.strHomeTeam || !evt.strAwayTeam) return;
    
    const matchId = evt.idEvent;
    const homeTeam = evt.strHomeTeam;
    const awayTeam = evt.strAwayTeam;
    const homeScore = evt.intHomeScore;
    const awayScore = evt.intAwayScore;
    const status = evt.strStatus;
    
    const isFinished = ['FT', 'AET', 'PEN'].includes(status);
    const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'BT', 'LIVE'].includes(status);
    
    // 时间处理（UTC 转北京时间）
    let dateStr = evt.dateEvent || '';
    let timeStr = '';
    if (evt.strTime) {
      const [h, m] = evt.strTime.split(':').map(Number);
      const bjH = (h + 8) % 24;
      const bjDate = new Date(dateStr + 'T00:00:00Z');
      if (h + 8 >= 24) bjDate.setDate(bjDate.getDate() + 1);
      dateStr = bjDate.getFullYear() + '-' +
        String(bjDate.getMonth() + 1).padStart(2, '0') + '-' +
        String(bjDate.getDate()).padStart(2, '0');
      timeStr = String(bjH).padStart(2, '0') + ':' + String(m).padStart(2, '0');
    }
    
    const round = evt.intRound ? `第${evt.intRound}轮` : '';
    
    if (matchIndex[matchId] !== undefined) {
      // 更新现有比赛
      const idx = matchIndex[matchId];
      if (dateStr) updatedMatches[idx].date = dateStr;
      if (timeStr) updatedMatches[idx].time = timeStr;
    } else {
      // 新增比赛
      updatedMatches.push({
        id: matchId,
        home: homeTeam,
        away: awayTeam,
        date: dateStr,
        time: timeStr,
        round: round,
        venue: evt.strVenue || ''
      });
      matchIndex[matchId] = updatedMatches.length - 1;
      newMatches++;
    }
    
    // 更新比分
    if (homeScore !== null && awayScore !== null && homeScore !== undefined && awayScore !== undefined) {
      const newResult = {
        score: homeScore + ':' + awayScore,
        events: isFinished ? '比赛结束' : isLive ? '进行中' : '',
        live: isLive
      };
      const existing = updatedResults[matchId];
      if (!existing || existing.score !== newResult.score) {
        updatedResults[matchId] = newResult;
        updatedResultsCount++;
      }
    }
  });
  
  console.log(`  新增 ${newMatches} 场，更新 ${updatedResultsCount} 条比分`);
  
  // 3. 获取积分榜
  let updatedStandings = existingData.standings || [];
  const tableData = await fetchWithRetry(
    `https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=${leagueId}&s=${leagueConfig.season}`
  );
  
  if (tableData && tableData.table) {
    updatedStandings = tableData.table.map((t, i) => ({
      rank: i + 1,
      team: t.strTeam,
      played: t.intPlayed || 0,
      won: t.intWin || 0,
      drawn: t.intDraw || 0,
      lost: t.intLoss || 0,
      gf: t.intGoalsFor || 0,
      ga: t.intGoalsAgainst || 0,
      pts: t.intPoints || 0
    }));
    console.log(`  积分榜: ${updatedStandings.length} 支球队`);
  }
  
  // 4. 写入文件
  const output = {
    lastUpdated: new Date().toISOString(),
    league: leagueConfig.name,
    season: leagueConfig.season,
    matches: updatedMatches,
    standings: updatedStandings,
    matchResults: updatedResults
  };
  
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify(output, null, 2), 'utf8');
  console.log(`  data/${leagueConfig.file} 已更新`);
  
  return true;
}

async function main() {
  let anyUpdated = false;
  
  for (const [key, config] of Object.entries(LEAGUES)) {
    try {
      const updated = await fetchLeagueData(key, config);
      if (updated) anyUpdated = true;
    } catch (err) {
      console.error(`  ${config.name} 抓取失败:`, err.message);
    }
    
    // 避免 API 限流
    await new Promise(r => setTimeout(r, 2000));
  }
  
  if (anyUpdated) {
    console.log('\n=== 联赛数据更新完成 ===');
  } else {
    console.log('\n=== 无联赛数据更新 ===');
  }
}

main().catch(err => {
  console.error('脚本执行失败:', err);
  process.exit(1);
});
