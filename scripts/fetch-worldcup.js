#!/usr/bin/env node
/**
 * 从 TheSportsDB API 抓取 2026 世界杯赛程和比分数据
 * 更新 data/worldcup.json
 * 
 * TheSportsDB 免费API（League ID 4429 = FIFA World Cup）
 * 接口：eventsday.php?d=YYYY-MM-DD&l=4429
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

// 反向映射
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

async function main() {
  console.log('=== 开始抓取世界杯数据 ===');

  // 读取现有数据作为基础
  let existingData = { matches: [], matchResults: {} };
  if (fs.existsSync(DATA_FILE)) {
    try {
      existingData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (e) {}
  }

  // 构建现有比赛索引
  const matchIndex = {};
  existingData.matches.forEach(m => {
    matchIndex[m.home + '_vs_' + m.away] = m;
  });

  // 抓取比赛日期范围：世界杯期间
  const dates = [];
  const start = new Date('2026-06-11');
  const end = new Date('2026-07-21');
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().slice(0, 10));
  }

  console.log(`需要抓取 ${dates.length} 天的数据...`);

  const allEvents = [];
  const batchSize = 5;
  for (let i = 0; i < dates.length; i += batchSize) {
    const batch = dates.slice(i, i + batchSize);
    console.log(`  抓取 ${batch[0]} ~ ${batch[batch.length - 1]}...`);

    const promises = batch.map(date =>
      fetchWithRetry(`https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${date}&l=4429`)
        .then(data => (data && data.events) ? data.events.map(e => ({ ...e, _queryDate: date })) : [])
        .catch(() => [])
    );
    const results = await Promise.all(promises);
    results.forEach(events => allEvents.push(...events));

    // 避免 API 限流
    if (i + batchSize < dates.length) {
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  console.log(`共获取 ${allEvents.length} 条赛事数据`);

  if (allEvents.length === 0) {
    console.log('TheSportsDB 暂无 2026 世界杯数据，保持现有数据不变');
    return;
  }

  // 处理赛事数据
  const updatedMatches = [...existingData.matches];
  const updatedResults = { ...existingData.matchResults };
  let matchUpdated = 0;
  let resultUpdated = 0;

  allEvents.forEach(evt => {
    const homeCN = findChineseTeam(evt.strHomeTeam);
    const awayCN = findChineseTeam(evt.strAwayTeam);
    if (!homeCN || !awayCN) return;

    const key = homeCN + '_vs_' + awayCN;
    const match = matchIndex[key];
    if (!match) return;

    // 更新比分
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
        resultUpdated++;
      }
    }

    // 更新比赛时间（UTC 转北京时间）
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
  });

  console.log(`更新 ${matchUpdated} 场赛程时间，${resultUpdated} 条比分`);

  // 写入文件
  const output = {
    lastUpdated: new Date().toISOString(),
    matches: updatedMatches,
    matchResults: updatedResults
  };

  fs.writeFileSync(DATA_FILE, JSON.stringify(output, null, 2), 'utf8');
  console.log('data/worldcup.json 已更新');
}

main().catch(err => {
  console.error('脚本执行失败:', err);
  process.exit(1);
});
