#!/usr/bin/env node
/**
 * 从 TheSportsDB API 抓取 2026 世界杯赛程和比分数据
 * 更新 data/worldcup.json
 * 
 * 策略：使用 searchevents.php 逐场查询比分，避免 eventsday.php 的结果截断问题
 * eventsday.php 免费版每天最多返回3条，导致大量比赛比分丢失
 * searchevents.php 按 "HomeTeam_vs_AwayTeam" 查询，可精确获取每场比赛数据
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'worldcup.json');

// 中英文球队名映射
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
 * 使用 searchevents.php 查询单场比赛比分
 * searchevents 格式: "HomeTeam_vs_AwayTeam"
 */
async function fetchMatchScore(homeEN, awayEN) {
  const query = `${homeEN}_vs_${awayEN}`;
  const url = `https://www.thesportsdb.com/api/v1/json/3/searchevents.php?e=${encodeURIComponent(query)}`;
  const data = await fetchWithRetry(url);
  if (!data) return null;
  
  const events = data.event || data.events || [];
  if (events.length === 0) return null;
  
  // 找到2026世界杯的比赛（可能返回历史比赛）
  const wcEvent = events.find(e => 
    e.idLeague === '4429' && e.strSeason === '2026'
  ) || events.find(e => e.idLeague === '4429') || events[0];
  
  return wcEvent;
}

async function main() {
  console.log('=== 开始抓取世界杯数据 (searchevents模式) ===');

  // 读取现有数据作为基础
  let existingData = { matches: [], matchResults: {} };
  if (fs.existsSync(DATA_FILE)) {
    try {
      existingData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (e) {}
  }

  const matches = existingData.matches;
  const updatedResults = { ...existingData.matchResults };
  let resultUpdated = 0;
  let matchUpdated = 0;

  // 只查询已经开赛或当天/近期比赛（节省API调用）
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  
  // 筛选需要查询的比赛：过去7天到未来3天
  const queryDateStart = new Date(now);
  queryDateStart.setDate(queryDateStart.getDate() - 7);
  const queryDateEnd = new Date(now);
  queryDateEnd.setDate(queryDateEnd.getDate() + 3);
  
  const matchesToQuery = matches.filter(m => {
    const mDate = m.date || '2099-01-01';
    return mDate >= queryDateStart.toISOString().slice(0, 10) && 
           mDate <= queryDateEnd.toISOString().slice(0, 10);
  });
  
  console.log(`共 ${matches.length} 场比赛，需查询 ${matchesToQuery.length} 场近期比赛`);

  // 批量查询，每批3个，避免API限流
  const batchSize = 3;
  for (let i = 0; i < matchesToQuery.length; i += batchSize) {
    const batch = matchesToQuery.slice(i, i + batchSize);
    console.log(`  查询第 ${i+1}-${Math.min(i+batchSize, matchesToQuery.length)} 场...`);
    
    const promises = batch.map(async (match) => {
      const homeEN = TEAM_EN_MAP[match.home];
      const awayEN = TEAM_EN_MAP[match.away];
      if (!homeEN || !awayEN) return null;
      
      const evt = await fetchMatchScore(homeEN, awayEN);
      return { match, evt };
    });
    
    const results = await Promise.all(promises);
    
    for (const { match, evt } of results) {
      if (!evt) continue;
      
      const homeScore = evt.intHomeScore;
      const awayScore = evt.intAwayScore;
      const status = evt.strStatus;
      
      if (homeScore !== null && awayScore !== null && 
          homeScore !== undefined && awayScore !== undefined) {
        const isFinished = ['FT', 'AET', 'PEN'].includes(status);
        const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'BT', 'LIVE'].includes(status);
        
        const newResult = {
          score: homeScore + ':' + awayScore,
          events: isFinished ? '比赛结束' : isLive ? '进行中' : (updatedResults[match.id] ? updatedResults[match.id].events : ''),
          live: isLive
        };
        
        const existing = updatedResults[match.id];
        if (!existing || existing.score !== newResult.score) {
          updatedResults[match.id] = newResult;
          resultUpdated++;
        }
      }
      
      // 更新比赛时间
      if (evt.strTime) {
        const [h, m] = evt.strTime.split(':').map(Number);
        const bjH = (h + 8) % 24;
        const bjDate = new Date(evt.dateEvent + 'T00:00:00Z');
        if (h + 8 >= 24) bjDate.setDate(bjDate.getDate() + 1);
        const dateStr = bjDate.getFullYear() + '-' +
          String(bjDate.getMonth() + 1).padStart(2, '0') + '-' +
          String(bjDate.getDate()).padStart(2, '0');
        const timeStr = String(bjH).padStart(2, '0') + ':' + String(m).padStart(2, '0');
        
        if (match.date !== dateStr || match.time !== timeStr) {
          match.date = dateStr;
          match.time = timeStr;
          matchUpdated++;
        }
      }
    }
    
    // 批次间延迟，避免API限流
    if (i + batchSize < matchesToQuery.length) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log(`更新 ${matchUpdated} 场赛程时间，${resultUpdated} 条比分`);

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
