// ========== 工具函数 ==========
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function debounce(fn, delay) {
  let timer = null;
  return function() {
    const args = arguments;
    const ctx = this;
    clearTimeout(timer);
    timer = setTimeout(function() { fn.apply(ctx, args); }, delay);
  };
}

function flag(team) { return FLAG_MAP[team] || ''; }

function countryCode(team) { return COUNTRY_CODE[team] || ''; }

function flagImg(team, cls) {
  const code = countryCode(team);
  if (code) {
    return '<img class="' + (cls || 'team-card-flag') + '" src="https://flagcdn.com/w80/' + code + '.png" alt="' + team + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'block\';"><span style="display:none;font-size:32px;">' + flag(team) + '</span>';
  }
  return '<span class="team-card-emoji">' + flag(team) + '</span>';
}

function strengthClass(s) {
  if (s >= 80) return 'strength-high';
  if (s >= 65) return 'strength-mid';
  return 'strength-low';
}

function strengthLabel(s) {
  if (s >= 85) return '夺冠热门';
  if (s >= 80) return '强队';
  if (s >= 70) return '中上游';
  if (s >= 65) return '中游';
  return '弱旅';
}

function formatValue(wan) {
  if (!wan) return '暂无';
  if (wan >= 10000) return (wan / 10000).toFixed(1) + '亿欧';
  return wan + '万欧';
}

function findPlayerTeam(playerName) {
  for (const [team, pd] of Object.entries(PLAYER_DATA)) {
    if (pd.active && pd.active.find(p => p.name === playerName)) return { team, type: 'active' };
    if (pd.legend && pd.legend.find(p => p.name === playerName)) return { team, type: 'legend' };
  }
  return null;
}

// ========== 球员照片缓存与动态加载 ==========
const _photoCache = {};

function loadPlayerPhoto(imgEl, enName) {
  if (!enName || !imgEl) return;
  if (_photoCache[enName]) {
    if (_photoCache[enName] === 'fail') {
      imgEl.style.display = 'none';
      if (imgEl.nextElementSibling) imgEl.nextElementSibling.style.display = 'flex';
      return;
    }
    imgEl.src = _photoCache[enName];
    return;
  }
  fetch('https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=' + encodeURIComponent(enName))
    .then(r => r.json())
    .then(data => {
      if (data.player && data.player.length > 0 && data.player[0].strCutout) {
        const url = data.player[0].strCutout;
        _photoCache[enName] = url;
        imgEl.src = url;
      } else {
        _photoCache[enName] = 'fail';
        imgEl.style.display = 'none';
        if (imgEl.nextElementSibling) imgEl.nextElementSibling.style.display = 'flex';
      }
    })
    .catch(() => {
      _photoCache[enName] = 'fail';
      imgEl.style.display = 'none';
      if (imgEl.nextElementSibling) imgEl.nextElementSibling.style.display = 'flex';
    });
}

function loadVisiblePlayerPhotos() {
  document.querySelectorAll('.player-photo[data-en]').forEach(img => {
    if (img.src && img.src !== location.href && !img.src.includes('about:blank')) return;
    loadPlayerPhoto(img, img.dataset.en);
  });
}

// ========== Tab 切换 ==========
$$('.tab').forEach(tab => {
  if (tab) tab.addEventListener('click', () => {
    $$('.tab').forEach(t => t.classList.remove('active'));
    $$('.page').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const target = $(`#page-${tab.dataset.tab}`);
    if (target) target.classList.add('active');
    if (currentLeague === 'mengchao') {
      // 蒙超：每个tab都走蒙超专属渲染
      if (tab.dataset.tab === 'event') renderMengchaoEventPage();
      else if (tab.dataset.tab === 'teams') renderMengchaoTeamsPage();
      else if (tab.dataset.tab === 'predict') renderMengchaoPredictPage();
    } else {
      if (tab.dataset.tab === 'event') renderEventPage();
      if (tab.dataset.tab === 'teams') renderTeamsPage();
      // 如果当前不是世界杯联赛，在新 tab 页面上也显示覆盖层
      if (currentLeague !== 'worldcup') {
        var config = LEAGUE_CONFIG[currentLeague];
        showLeagueComingSoon(currentLeague, config);
      }
    }
  });
});

// ========== 左侧侧边栏 ==========
var _sidebar = $('#sidebar');
var _sidebarOverlay = $('#sidebar-overlay');
var _menuToggle = $('#menu-toggle');
var _sidebarClose = $('#sidebar-close');

function openSidebar() {
  if (_sidebar) _sidebar.classList.add('open');
  if (_sidebarOverlay) _sidebarOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  if (_sidebar) _sidebar.classList.remove('open');
  if (_sidebarOverlay) _sidebarOverlay.classList.remove('open');
  document.body.style.overflow = '';
  // 同时关闭隐藏设置面板
  var sp = $('#sidebar-settings');
  if (sp) sp.classList.remove('open');
}

if (_menuToggle) _menuToggle.addEventListener('click', openSidebar);
if (_sidebarClose) _sidebarClose.addEventListener('click', closeSidebar);
if (_sidebarOverlay) _sidebarOverlay.addEventListener('click', closeSidebar);

// ========== 联赛切换 ==========
var currentLeague = 'worldcup';

var LEAGUE_CONFIG = {
  worldcup: { name: '2026 世界杯', subtitle: '美加墨世界杯 · 48队 · 12组 · 104场' },
  mengchao: { name: '蒙超', subtitle: '2026 内蒙古足球超级联赛 · 12队 · 11轮' },
  champions: { name: '欧冠联赛', subtitle: '2025-26 赛季 · 欧洲冠军联赛' },
  premier: { name: '英超', subtitle: '2025-26 赛季 · 英格兰超级联赛' },
  laliga: { name: '西甲', subtitle: '2025-26 赛季 · 西班牙甲级联赛' },
  bundesliga: { name: '德甲', subtitle: '2025-26 赛季 · 德国甲级联赛' },
  seriea: { name: '意甲', subtitle: '2025-26 赛季 · 意大利甲级联赛' },
  ligue1: { name: '法甲', subtitle: '2025-26 赛季 · 法国甲级联赛' }
};

function switchLeague(league) {
  // 更新侧边栏高亮
  $$('.sidebar-item[data-league]').forEach(function(item) {
    item.classList.toggle('active', item.dataset.league === league);
  });
  currentLeague = league;
  var config = LEAGUE_CONFIG[league];

  if (league === 'worldcup') {
    // 切换回世界杯：移除覆盖层，恢复页面内容
    updateHeaderForLeague(config);
    removeLeagueComingSoon();
  } else if (league === 'mengchao') {
    // 蒙超：使用真实数据渲染
    updateHeaderForLeague(config);
    removeLeagueComingSoon();
    renderMengchaoPage();
  } else {
    // 其他联赛 - 显示即将开放覆盖层
    updateHeaderForLeague(config);
    showLeagueComingSoon(league, config);
  }
  closeSidebar();
}

function updateHeaderForLeague(config) {
  var h1 = document.querySelector('.header h1');
  var subtitle = document.querySelector('.header .subtitle');
  if (h1) h1.innerHTML = config.name + '观赛搭子';
  if (subtitle) subtitle.textContent = config.subtitle;
}

function showLeagueComingSoon(league, config) {
  // 先移除旧覆盖层
  removeLeagueComingSoon(true);
  // 覆盖层直接挂在 body 上（fixed 定位，不破坏任何页面内容）
  var overlay = document.createElement('div');
  overlay.className = 'league-coming-soon-overlay';
  overlay.innerHTML = '<div class="league-coming-soon">' +
    '<div class="league-coming-soon-icon">' + getLeagueIcon(league) + '</div>' +
    '<div class="league-coming-soon-title">' + config.name + '</div>' +
    '<div class="league-coming-soon-subtitle">即将开放，敬请期待</div>' +
    '<div class="league-coming-soon-desc">我们正在为 ' + config.name + ' 准备专属的赛程、数据和 AI 预测功能，上线后会在侧边栏通知你。</div>' +
    '<button class="league-back-btn" onclick="switchLeague(\'worldcup\')">返回世界杯</button>' +
    '</div>';
  document.body.appendChild(overlay);
}

function removeLeagueComingSoon(skipRerender) {
  // 移除所有覆盖层
  $$('.league-coming-soon-overlay').forEach(function(el) {
    el.remove();
  });
  // 切换回世界杯时重新渲染所有页面内容
  if (!skipRerender) {
    renderEventPage();
    renderTeamsPage();
    // 预测页面会在切换tab时自动渲染
  }
}

function getLeagueIcon(league) {
  var icons = {
    worldcup: '🏆',
    mengchao: '🐎',
    champions: '🇪🇺',
    premier: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    laliga: '🇪🇸',
    bundesliga: '🇩🇪',
    seriea: '🇮🇹',
    ligue1: '🇫🇷'
  };
  return icons[league] || '⚽';
}

// ========== 深色/浅色模式切换 ==========
function toggleDarkMode() {
  var body = document.body;
  var isLight = body.classList.toggle('light-mode');
  var text = $('#dark-mode-text');
  if (text) text.textContent = isLight ? '浅色模式' : '深色模式';
  var icon = document.querySelector('#dark-mode-text') ? document.querySelector('#dark-mode-text').previousElementSibling : null;
  if (icon) icon.textContent = isLight ? '☀️' : '🌙';
  closeSidebar();
}

// ========== 隐藏设置入口：长按版本号 3 秒 ==========
var _versionEl = $('#sidebar-version');
var _longPressTimer = null;

if (_versionEl) {
  _versionEl.addEventListener('mousedown', function(e) {
    e.preventDefault();
    _longPressTimer = setTimeout(function() {
      openSidebarSettings();
    }, 3000);
  });
  _versionEl.addEventListener('mouseup', function() { clearTimeout(_longPressTimer); });
  _versionEl.addEventListener('mouseleave', function() { clearTimeout(_longPressTimer); });
  _versionEl.addEventListener('touchstart', function(e) {
    e.preventDefault();
    _longPressTimer = setTimeout(function() {
      openSidebarSettings();
    }, 3000);
  }, { passive: false });
  _versionEl.addEventListener('touchend', function() { clearTimeout(_longPressTimer); });
  _versionEl.addEventListener('touchcancel', function() { clearTimeout(_longPressTimer); });
}

function openSidebarSettings() {
  var sp = $('#sidebar-settings');
  if (sp) sp.classList.add('open');
  loadSettings();
}

var _sidebarSettingsClose = $('#sidebar-settings-close');
if (_sidebarSettingsClose) _sidebarSettingsClose.addEventListener('click', function() {
  var sp = $('#sidebar-settings');
  if (sp) sp.classList.remove('open');
});

// 设置加载和保存（侧边栏隐藏面板）
function loadSettings() {
  var apiKey = localStorage.getItem('wc_api_key') || '';
  var apiEl = $('#api-key'); if (apiEl) apiEl.value = apiKey;
  if (apiKey) { var s = $('#save-status'); if (s) { s.textContent = '已配置 API Key'; s.style.color = 'var(--success)'; } }
  var footballStatus = $('#football-save-status'); if (footballStatus) { footballStatus.textContent = '比分数据自动实时更新，无需配置'; footballStatus.style.color = 'var(--success)'; }
}

var _saveSettings = $('#save-settings');
if (_saveSettings) _saveSettings.addEventListener('click', function() {
  var apiKey = $('#api-key').value.trim();
  localStorage.setItem('wc_api_key', apiKey);
  var status = $('#save-status');
  if (apiKey) { status.textContent = '保存成功！现在可以去「AI 聊球」页面聊天了'; status.style.color = 'var(--success)'; }
  else { status.textContent = '请填写 API Key'; status.style.color = 'var(--warning)'; }
});

// ========== 赛事数据页面（含子导航） ==========
let eventSubView = 'schedule';
let currentPhase = 'group';
let currentGroup = 'all';

function renderEventSubNav() {
  const nav = $('#event-sub-nav');
  if (!nav) return;
  nav.innerHTML =
    '<a class="sub-nav-btn' + (eventSubView === 'schedule' ? ' active' : '') + '" onclick="switchEventSub(\'schedule\')">赛事数据</a>' +
    '<a class="sub-nav-btn' + (eventSubView === 'players' ? ' active' : '') + '" onclick="switchEventSub(\'players\')">球员数据</a>';
}

function switchEventSub(view) {
  eventSubView = view;
  renderEventSubNav();
  renderEventPage();
}

function renderEventPage() {
  renderEventSubNav();
  const content = $('#event-content');
  if (!content) return;
  if (eventSubView === 'schedule') {
    renderScheduleInto(content);
  } else {
    renderPlayerStatsPage(content);
  }
}

// ========== 赛程数据 ==========
function renderScheduleInto(container) {
  let html = '';
  const phases = [
    { key: 'group', label: '小组赛' },
    { key: 'r32', label: '32强' },
    { key: 'r16', label: '16强' },
    { key: 'qf', label: '8强' },
    { key: 'sf', label: '4强' },
    { key: '3rd', label: '季军赛' },
    { key: 'final', label: '决赛' }
  ];
  html += '<div class="schedule-phase-nav">';
  phases.forEach(p => {
    html += '<a class="phase-nav-btn' + (currentPhase === p.key ? ' active' : '') + '" onclick="switchPhase(\'' + p.key + '\')">' + p.label + '</a>';
  });
  html += '</div>';

  if (currentPhase === 'group') {
    html += renderGroupSchedule();
  } else {
    html += renderKnockoutSchedule();
  }

  container.innerHTML = html;
  bindScheduleEvents(container);
}

function switchPhase(phase) {
  currentPhase = phase;
  currentGroup = 'all';
  const content = $('#event-content');
  if (content) renderScheduleInto(content);
}

function renderGroupSchedule() {
  let html = '';
  html += '<div class="filter-bar" id="group-filters">';
  html += '<button class="filter-btn' + (currentGroup === 'all' ? ' active' : '') + '" data-group="all">全部</button>';
  for (const g of Object.keys(GROUPS)) {
    html += '<button class="filter-btn' + (currentGroup === g ? ' active' : '') + '" data-group="' + g + '">' + g + ' 组</button>';
  }
  html += '</div>';
  html += '<div class="search-bar"><input type="text" id="schedule-search" placeholder="搜索球队名称..."></div>';

  let filtered = currentGroup === 'all' ? [...MATCHES] : MATCHES.filter(m => m.group === currentGroup);
  const todayM = [], tomorrowM = [], upcomingM = [], finishedM = [];
  filtered.forEach(m => {
    const s = getMatchStatus(m);
    if (s === 'today') todayM.push(m);
    else if (s === 'tomorrow') tomorrowM.push(m);
    else if (s === 'upcoming') upcomingM.push(m);
    else finishedM.push(m);
  });
  // 按时间排序
  const sortByTime = (a, b) => (a.date + 'T' + a.time).localeCompare(b.date + 'T' + b.time);
  todayM.sort(sortByTime);
  tomorrowM.sort(sortByTime);
  upcomingM.sort(sortByTime);
  finishedM.sort((a, b) => (b.date + 'T' + b.time).localeCompare(a.date + 'T' + b.time));
  html += renderScheduleSections(todayM, tomorrowM, upcomingM, finishedM);
  return html;
}

function renderKnockoutSchedule() {
  const koGames = getKnockoutGames(currentPhase);
  const phaseNames = { r32: '1/16决赛（32强）', r16: '1/8决赛（16强）', qf: '1/4决赛（8强）', sf: '半决赛（4强）', '3rd': '季军赛', final: '决赛' };

  let html = '';
  html += '<div class="ko-phase-header">' + phaseNames[currentPhase] + '</div>';
  html += '<div class="ko-phase-subtitle">共 ' + koGames.length + ' 场</div>';
  html += '<div class="search-bar"><input type="text" id="schedule-search" placeholder="搜索球队名称..."></div>';

  const todayM = [], tomorrowM = [], upcomingM = [], finishedM = [];
  koGames.forEach(m => {
    const s = getMatchStatus(m);
    if (s === 'today') todayM.push(m);
    else if (s === 'tomorrow') tomorrowM.push(m);
    else if (s === 'upcoming') upcomingM.push(m);
    else finishedM.push(m);
  });

  // 按时间排序
  const sortByTime = (a, b) => (a.date + 'T' + (a.time || '')).localeCompare(b.date + 'T' + (b.time || ''));
  todayM.sort(sortByTime);
  tomorrowM.sort(sortByTime);
  upcomingM.sort(sortByTime);
  finishedM.sort((a, b) => (b.date + 'T' + (b.time || '')).localeCompare(a.date + 'T' + (b.time || '')));

  html += renderScheduleSections(todayM, tomorrowM, upcomingM, finishedM, phaseNames[currentPhase]);
  html += '<div id="bracket-section"></div>';
  return html;
}

function renderScheduleSections(todayM, tomorrowM, upcomingM, finishedM, phaseLabel) {
  let html = '';
  const pl = phaseLabel || '';

  html += '<div class="schedule-nav">';
  html += '<a class="schedule-nav-btn today-nav" onclick="document.getElementById(\'section-today\').scrollIntoView({behavior:\'smooth\',block:\'start\'})">今日 <span class="nav-count">' + todayM.length + '</span></a>';
  html += '<a class="schedule-nav-btn tomorrow-nav" onclick="document.getElementById(\'section-tomorrow\').scrollIntoView({behavior:\'smooth\',block:\'start\'})">明日 <span class="nav-count">' + tomorrowM.length + '</span></a>';
  html += '<a class="schedule-nav-btn upcoming-nav" onclick="document.getElementById(\'section-upcoming\').scrollIntoView({behavior:\'smooth\',block:\'start\'})">未来 <span class="nav-count">' + upcomingM.length + '</span></a>';
  html += '<a class="schedule-nav-btn finished-nav" onclick="document.getElementById(\'section-finished\').scrollIntoView({behavior:\'smooth\',block:\'start\'})">已结束 <span class="nav-count">' + finishedM.length + '</span></a>';
  html += '</div>';

  html += '<div id="section-today" class="section-anchor"></div>';
  if (todayM.length > 0) {
    html += '<div class="section-divider today-divider"><span>今日赛程</span><span class="section-divider-count">' + todayM.length + '场</span></div>';
    html += todayM.map(m => renderMatchCard(m)).join('');
  } else {
    html += '<div class="no-today-hint">今天没有' + (pl || '') + '比赛</div>';
  }

  html += '<div id="section-tomorrow" class="section-anchor"></div>';
  if (tomorrowM.length > 0) {
    html += '<div class="section-divider tomorrow-divider"><span>明日赛程</span><span class="section-divider-count">' + tomorrowM.length + '场</span></div>';
    html += tomorrowM.map(m => renderMatchCard(m)).join('');
  } else {
    html += '<div class="no-today-hint" style="color:var(--text-tertiary)">明天没有' + (pl || '') + '比赛</div>';
  }

  html += '<div id="section-upcoming" class="section-anchor"></div>';
  if (upcomingM.length > 0) {
    html += '<div class="section-divider upcoming-divider"><span>未来赛程</span><span class="section-divider-count">' + upcomingM.length + '场</span></div>';
    let lastDate = '';
    upcomingM.forEach(m => {
      if (m.date !== lastDate) {
        lastDate = m.date;
        const d = new Date(m.date + 'T00:00:00+08:00');
        const wd = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
        html += '<div class="date-header">' + m.date.slice(5) + ' 周' + wd + '</div>';
      }
      html += renderMatchCard(m);
    });
  }

  html += '<div id="section-finished" class="section-anchor"></div>';
  if (finishedM.length > 0) {
    html += '<div class="section-divider finished-divider"><span>已结束</span><span class="section-divider-count">' + finishedM.length + '场</span></div>';
    let lastDate = '';
    finishedM.forEach(m => {
      if (m.date !== lastDate) {
        lastDate = m.date;
        const d = new Date(m.date + 'T00:00:00+08:00');
        const wd = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
        html += '<div class="date-header">' + m.date.slice(5) + ' 周' + wd + '</div>';
      }
      html += renderMatchCard(m);
    });
  }

  return html;
}

function bindScheduleEvents(container) {
  const filterBar = container.querySelector('#group-filters');
  if (filterBar) {
    filterBar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentGroup = btn.dataset.group;
        renderScheduleInto($('#event-content'));
      });
    });
  }
  const searchInput = container.querySelector('#schedule-search');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(function() {
      renderScheduleInto($('#event-content'));
    }, 300));
  }
  const bracketSection = container.querySelector('#bracket-section');
  if (bracketSection && currentPhase !== 'group') {
    renderBracketInto(bracketSection);
  }
}

// ========== 赛程辅助函数 ==========
function getGroupStandingsRanked() {
  const result = {};
  for (const g of Object.keys(GROUPS)) {
    result[g] = calcGroupStandings(g).map(s => s.team);
  }
  return result;
}

function resolveTeamFromPos(pos, standings, koResults) {
  if (!pos) return null;
  if (pos.endsWith('L')) {
    const winnerPos = pos.slice(0, -1);
    const gr = koResults[winnerPos];
    if (gr && gr.home && gr.away && gr.score) {
      const parts = gr.score.split(':');
      const hg = parseInt(parts[0]) || 0, ag = parseInt(parts[1]) || 0;
      if (hg > ag) return gr.away;
      if (ag > hg) return gr.home;
      return gr.away;
    }
    return null;
  }
  if (pos.startsWith('R') || pos.startsWith('QF-') || pos.startsWith('SF-')) {
    const gr = koResults[pos];
    if (gr && gr.home && gr.away && gr.score) {
      const parts = gr.score.split(':');
      const hg = parseInt(parts[0]) || 0, ag = parseInt(parts[1]) || 0;
      if (hg > ag) return gr.home;
      if (ag > hg) return gr.away;
      return null;
    }
    return null;
  }
  if (pos.startsWith('3rd-')) {
    const group = pos.split('-')[1];
    const gs = standings[group];
    if (gs && gs.length >= 3) return gs[2];
    return null;
  }
  const match = pos.match(/^([A-L])([1-4])$/);
  if (match) {
    const gs = standings[match[1]];
    if (gs && gs[parseInt(match[2]) - 1]) return gs[parseInt(match[2]) - 1];
    return null;
  }
  return null;
}

function resolvePosLabel(pos) {
  if (!pos) return '待定';
  if (pos.endsWith('L')) return '待定';
  if (pos.startsWith('R') || pos.startsWith('QF-') || pos.startsWith('SF-')) return '待定';
  if (pos.startsWith('3rd-')) return pos.split('-')[1] + '组第3';
  const match = pos.match(/^([A-L])([1-4])$/);
  if (match) return match[1] + '组第' + match[2];
  return pos;
}

function getKnockoutResults() {
  const koResults = {};
  for (const [id, result] of Object.entries(MATCH_RESULTS)) {
    if (typeof id === 'string' && (id.startsWith('R') || id.startsWith('QF') || id.startsWith('SF') || id.startsWith('3RD') || id.startsWith('FINAL'))) {
      koResults[id] = result;
    }
  }
  return koResults;
}

function getMatchStatus(m) {
  const now = new Date();
  const matchDate = new Date(m.date + 'T' + m.time + ':00+08:00');
  const todayStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.getFullYear() + '-' + String(tomorrow.getMonth() + 1).padStart(2, '0') + '-' + String(tomorrow.getDate()).padStart(2, '0');
  const result = MATCH_RESULTS[m.id];
  if (result && result.score) {
    if (result.live) return 'today';
    return 'finished';
  }
  if (m.date === todayStr) {
    const hoursSince = (now - matchDate) / (1000 * 60 * 60);
    if (hoursSince > 3 && !(result && result.score)) return 'finished';
    return 'today';
  }
  if (m.date === tomorrowStr) return 'tomorrow';
  if (matchDate < now) return 'finished';
  return 'upcoming';
}

function getKnockoutGames(round) {
  const allRounds = [...KNOCKOUT_BRACKET.top, ...KNOCKOUT_BRACKET.bottom, ...KNOCKOUT_BRACKET.final];
  const found = allRounds.filter(r => r.round === round);
  let games = [];
  found.forEach(r => { games = games.concat(r.games); });
  return games;
}

function renderMatchCard(m) {
  const status = getMatchStatus(m);
  const result = MATCH_RESULTS[m.id];
  const isFinished = status === 'finished' || (result && result.score && !result.live);
  const isToday = status === 'today';
  const homeTeam = m.home || resolveTeamFromPos(m.pos1, getGroupStandingsRanked(), getKnockoutResults());
  const awayTeam = m.away || resolveTeamFromPos(m.pos2, getGroupStandingsRanked(), getKnockoutResults());
  const homeLabel = m.home || resolvePosLabel(m.pos1);
  const awayLabel = m.away || resolvePosLabel(m.pos2);
  const isPlaceholder = !homeTeam || !awayTeam;
  const phaseLabel = m.group ? (m.group + '组 · 第' + m.round + '轮') : (m.koLabel || '');

  if (isFinished && !isPlaceholder) {
    const score = result && result.score ? result.score : '-:-';
    const parts = score.split(':');
    const homeGoals = parseInt(parts[0]) || 0, awayGoals = parseInt(parts[1]) || 0;
    const homeWin = homeGoals > awayGoals, awayWin = awayGoals > homeGoals, draw = homeGoals === awayGoals;
    return '<div class="match-card match-finished">' +
      '<div class="match-meta"><span>' + m.date + ' ' + m.time + '</span><span>' + phaseLabel + ' · 已结束</span></div>' +
      '<div class="match-vs match-vs-result">' +
        '<span class="match-team' + (homeWin ? ' team-won' : (draw ? '' : ' team-lost')) + '" onclick="openTeamDetail(\'' + homeTeam + '\')">' + flagImg(homeTeam, 'team-card-flag') + ' ' + homeTeam + '</span>' +
        '<span class="match-score-final"><span class="score-home' + (homeWin ? ' score-won' : '') + '">' + parts[0] + '</span><span class="score-sep">:</span><span class="score-away' + (awayWin ? ' score-won' : '') + '">' + parts[1] + '</span></span>' +
        '<span class="match-team' + (awayWin ? ' team-won' : (draw ? '' : ' team-lost')) + '" onclick="openTeamDetail(\'' + awayTeam + '\')">' + awayTeam + ' ' + flagImg(awayTeam, 'team-card-flag') + '</span>' +
      '</div>' +
      (result && result.events ? '<div class="match-events">' + result.events + '</div>' : '') +
      '<div class="match-venue">' + m.venue + '</div></div>';
  }
  if (isPlaceholder) {
    return '<div class="match-card match-card-placeholder">' +
      '<div class="match-meta"><span>' + m.date + ' ' + m.time + '</span><span>' + phaseLabel + '</span></div>' +
      '<div class="match-vs"><span class="match-team match-team-placeholder">' + homeLabel + '</span><span class="vs">VS</span><span class="match-team match-team-placeholder">' + awayLabel + '</span></div>' +
      '<div class="match-venue">' + m.venue + '</div></div>';
  }
  if (isToday) {
    const isLive = result && result.live;
    const score = result && result.score ? result.score : null;
    let centerHtml = score ? '<span class="match-score-live">' + score + '</span>' : '<span class="match-live">' + (isLive ? '进行中' : '今天 ' + m.time) + '</span>';
    return '<div class="match-card match-today">' +
      '<div class="match-meta"><span>' + m.date + ' ' + m.time + '</span><span>' + phaseLabel + (isLive ? ' · 进行中' : '') + '</span></div>' +
      '<div class="match-vs"><span class="match-team" onclick="openTeamDetail(\'' + homeTeam + '\')">' + flagImg(homeTeam, 'team-card-flag') + ' ' + homeTeam + '</span>' + centerHtml + '<span class="match-team" onclick="openTeamDetail(\'' + awayTeam + '\')">' + awayTeam + ' ' + flagImg(awayTeam, 'team-card-flag') + '</span></div>' +
      '<div class="match-venue">' + m.venue + '</div></div>';
  }
  return '<div class="match-card">' +
    '<div class="match-meta"><span>' + m.date + ' ' + m.time + '</span><span>' + phaseLabel + '</span></div>' +
    '<div class="match-vs"><span class="match-team" onclick="openTeamDetail(\'' + homeTeam + '\')">' + flagImg(homeTeam, 'team-card-flag') + ' ' + homeTeam + '</span><span class="vs">VS</span><span class="match-team" onclick="openTeamDetail(\'' + awayTeam + '\')">' + awayTeam + ' ' + flagImg(awayTeam, 'team-card-flag') + '</span></div>' +
    '<div class="match-venue">' + m.venue + '</div></div>';
}

// ========== 对阵图 ==========
function renderBracketInto(container) {
  const standings = getGroupStandingsRanked();
  const koResults = getKnockoutResults();

  function renderBracketMatch(game) {
    const team1 = resolveTeamFromPos(game.pos1, standings, koResults);
    const team2 = resolveTeamFromPos(game.pos2, standings, koResults);
    const label1 = team1 || resolvePosLabel(game.pos1);
    const label2 = team2 || resolvePosLabel(game.pos2);
    const result = koResults[game.id];
    const isPlaceholder = !team1 || !team2;
    let score1 = '', score2 = '';
    let team1Class = 'nba-team', team2Class = 'nba-team';
    if (result && result.score) {
      const parts = result.score.split(':');
      score1 = parts[0] || ''; score2 = parts[1] || '';
      const hh = parseInt(parts[0]) || 0, aa = parseInt(parts[1]) || 0;
      if (hh > aa) team1Class += ' nba-team-won';
      else if (aa > hh) team2Class += ' nba-team-won';
    }
    let m = '<div class="nba-match' + (isPlaceholder ? ' nba-match-placeholder' : '') + '">';
    m += '<div class="' + team1Class + '" onclick="' + (team1 ? 'openTeamDetail(\'' + team1 + '\')' : '') + '">';
    if (team1) m += '<span class="nba-team-flag">' + flagImg(team1, 'nba-flag-img') + '</span>';
    m += '<span class="nba-team-name">' + label1 + '</span><span class="nba-team-score">' + score1 + '</span></div>';
    m += '<div class="' + team2Class + '" onclick="' + (team2 ? 'openTeamDetail(\'' + team2 + '\')' : '') + '">';
    if (team2) m += '<span class="nba-team-flag">' + flagImg(team2, 'nba-flag-img') + '</span>';
    m += '<span class="nba-team-name">' + label2 + '</span><span class="nba-team-score">' + score2 + '</span></div>';
    m += '</div>';
    return m;
  }

  let html = '';
  html += '<div class="nba-bracket-title">淘汰赛对阵图</div>';
  html += '<div class="nba-bracket-subtitle">小组前2名 + 8个最佳第3名晋级32强</div>';

  const topRounds = KNOCKOUT_BRACKET.top;
  const bottomRounds = KNOCKOUT_BRACKET.bottom;
  const roundLabels = ['1/16决赛', '1/8决赛', '1/4决赛', '半决赛'];

  html += '<div class="nba-bracket-container">';
  html += '<div class="nba-half-label nba-top-label">上半区</div>';
  for (let ri = 0; ri < 4; ri++) {
    html += '<div class="nba-round-col">';
    html += '<div class="nba-round-header">' + roundLabels[ri] + '</div>';
    html += '<div class="nba-round-games nba-top">';
    if (topRounds[ri]) topRounds[ri].games.forEach(g => { html += renderBracketMatch(g); });
    html += '</div>';
    if (ri === 3) {
      html += '<div class="nba-trophy-center">';
      html += '<img class="nba-trophy-img" src="https://digitalhub.fifa.com/transform/8a4e6f0b-2965-4c0c-8b62-b6e6c4c5e7b6/2026-FIFA-World-Cup-Logo" alt="大力神杯" onerror="this.outerHTML=\'🏆\'">';
      html += '<div class="nba-trophy-date">7/20 决赛</div></div>';
    }
    html += '<div class="nba-round-games nba-bottom">';
    if (bottomRounds[ri]) bottomRounds[ri].games.forEach(g => { html += renderBracketMatch(g); });
    html += '</div></div>';
  }
  html += '<div class="nba-half-label nba-bottom-label">下半区</div>';
  html += '</div>';

  html += '<div class="nba-finals-row">';
  html += '<div class="nba-final-card"><div class="nba-final-label">季军赛 7/19</div>';
  html += renderBracketMatch(KNOCKOUT_BRACKET.final[0].games[0]);
  html += '</div><div class="nba-final-card nba-final-champion"><div class="nba-final-label">决赛 7/20 03:00</div>';
  html += renderBracketMatch(KNOCKOUT_BRACKET.final[1].games[0]);
  html += '</div></div>';

  container.innerHTML = html;
}

// ========== 球员数据页面（射手榜+助攻榜，可点击） ==========
function renderPlayerStatsPage(container) {
  let html = '';

  // 射手榜
  html += '<div class="ranking-title">射手榜</div>';
  html += '<div class="ranking-list">';
  TOP_SCORERS.forEach((p, i) => {
    const medal = i === 0 ? '<span class="medal-gold">1</span>' : i === 1 ? '<span class="medal-silver">2</span>' : i === 2 ? '<span class="medal-bronze">3</span>' : '<span class="rank-num">' + (i + 1) + '</span>';
    html += '<div class="ranking-item clickable" onclick="openPlayerDetailFromRanking(\'' + p.name + '\')">';
    html += '<div class="ranking-pos">' + medal + '</div>';
    html += '<div class="ranking-photo-wrap">';
    html += '<img class="ranking-photo player-photo" data-en="' + (p.en || '') + '" src="" alt="' + p.name + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';">';
    html += '<div class="ranking-photo-fallback">' + p.name.charAt(0) + '</div>';
    html += '</div>';
    html += '<div class="ranking-info"><div class="ranking-name">' + p.name + '</div><div class="ranking-team">' + flag(p.team) + ' ' + p.team + '</div></div>';
    html += '<div class="ranking-value">' + p.goals + '<span class="ranking-unit">球</span></div>';
    html += '</div>';
  });
  html += '</div>';

  // 助攻榜
  html += '<div class="ranking-title" style="margin-top:28px;">助攻榜</div>';
  html += '<div class="ranking-list">';
  TOP_ASSISTS.forEach((p, i) => {
    const medal = i === 0 ? '<span class="medal-gold">1</span>' : i === 1 ? '<span class="medal-silver">2</span>' : i === 2 ? '<span class="medal-bronze">3</span>' : '<span class="rank-num">' + (i + 1) + '</span>';
    html += '<div class="ranking-item clickable" onclick="openPlayerDetailFromRanking(\'' + p.name + '\')">';
    html += '<div class="ranking-pos">' + medal + '</div>';
    html += '<div class="ranking-photo-wrap">';
    html += '<img class="ranking-photo player-photo" data-en="' + (p.en || '') + '" src="" alt="' + p.name + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';">';
    html += '<div class="ranking-photo-fallback">' + p.name.charAt(0) + '</div>';
    html += '</div>';
    html += '<div class="ranking-info"><div class="ranking-name">' + p.name + '</div><div class="ranking-team">' + flag(p.team) + ' ' + p.team + '</div></div>';
    html += '<div class="ranking-value">' + p.assists + '<span class="ranking-unit">助攻</span></div>';
    html += '</div>';
  });
  html += '</div>';

  container.innerHTML = html;
  setTimeout(loadVisiblePlayerPhotos, 100);
}

// 从射手榜/助攻榜点击球员 -> 打开球员详情
function openPlayerDetailFromRanking(playerName) {
  const found = findPlayerTeam(playerName);
  if (found) {
    openPlayerDetail(found.team, playerName, found.type);
  }
}

// ========== 球队页面 ==========
let teamViewMode = 'standings';
let teamSearchKw = '';
let teamStrengthFilter = 'all';

function calcGroupStandings(groupName) {
  const teams = GROUPS[groupName];
  if (!teams) return [];
  const groupMatches = MATCHES.filter(m => m.group === groupName);
  const standings = {};
  teams.forEach(t => { standings[t] = { team: t, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 }; });
  groupMatches.forEach(m => {
    const result = MATCH_RESULTS[m.id];
    if (!result || !result.score) return;
    const parts = result.score.split(':');
    const homeGoals = parseInt(parts[0]) || 0, awayGoals = parseInt(parts[1]) || 0;
    standings[m.home].played++; standings[m.away].played++;
    standings[m.home].gf += homeGoals; standings[m.home].ga += awayGoals;
    standings[m.away].gf += awayGoals; standings[m.away].ga += homeGoals;
    if (homeGoals > awayGoals) { standings[m.home].won++; standings[m.home].pts += 3; standings[m.away].lost++; }
    else if (homeGoals === awayGoals) { standings[m.home].drawn++; standings[m.home].pts += 1; standings[m.away].drawn++; standings[m.away].pts += 1; }
    else { standings[m.away].won++; standings[m.away].pts += 3; standings[m.home].lost++; }
  });
  return Object.values(standings).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    const gdA = a.gf - a.ga, gdB = b.gf - b.ga;
    if (gdB !== gdA) return gdB - gdA;
    return b.gf - a.gf;
  });
}

function getQualifyStatus(rank) {
  if (rank <= 2) return { label: '出线', cls: 'qualify-top' };
  if (rank === 3) return { label: '待定', cls: 'qualify-maybe' };
  return { label: '淘汰', cls: 'qualify-out' };
}

function renderTeamsPage() {
  const container = $('#page-teams');
  if (!container) return;
  const groups = Object.keys(GROUPS);
  const filteredGroups = teamSearchKw.trim()
    ? groups.filter(g => {
        const kw = teamSearchKw.trim().toLowerCase();
        return g.toLowerCase().includes(kw) || GROUPS[g].some(t => t.toLowerCase().includes(kw));
      })
    : groups;

  let html = '';
  html += '<div class="search-bar"><input type="text" id="team-search" placeholder="搜索球队或小组..." value="' + teamSearchKw.replace(/"/g, '&quot;') + '"></div>';
  html += '<div class="group-nav">';
  html += '<a class="group-nav-btn' + (teamViewMode === 'standings' ? ' active' : '') + '" onclick="switchTeamView(\'standings\')">积分排名</a>';
  html += '<a class="group-nav-btn' + (teamViewMode === 'cards' ? ' active' : '') + '" onclick="switchTeamView(\'cards\')">球队列表</a>';
  html += '</div>';

  if (filteredGroups.length === 0) {
    html += '<div style="text-align:center;padding:40px;color:var(--text-dim);">未找到匹配的小组或球队</div>';
    container.innerHTML = html;
    bindTeamSearch();
    return;
  }

  if (teamViewMode === 'standings') {
    filteredGroups.forEach(group => {
      const standings = calcGroupStandings(group);
      html += '<div class="group-card">';
      html += '<div class="group-header" onclick="toggleGroup(this)"><h3>' + group + ' 组</h3><span class="arrow">▼</span></div>';
      html += '<div class="group-body">';
      html += '<table class="standings-table"><thead><tr><th class="st-rank">#</th><th class="st-team">球队</th><th>赛</th><th>胜</th><th>平</th><th>负</th><th>进</th><th>失</th><th>净</th><th class="st-pts">分</th><th class="st-status">状态</th></tr></thead><tbody>';
      standings.forEach((s, idx) => {
        const rank = idx + 1;
        const qs = getQualifyStatus(rank);
        const gd = s.gf - s.ga;
        const gdStr = gd > 0 ? '+' + gd : String(gd);
        html += '<tr class="standings-row" onclick="openTeamDetail(\'' + s.team + '\')" style="cursor:pointer">';
        html += '<td class="st-rank">' + rank + '</td>';
        html += '<td class="st-team"><span class="team-flag-sm">' + flagImg(s.team, 'team-card-flag') + '</span> ' + s.team + '</td>';
        html += '<td>' + s.played + '</td><td>' + s.won + '</td><td>' + s.drawn + '</td><td>' + s.lost + '</td>';
        html += '<td>' + s.gf + '</td><td>' + s.ga + '</td><td>' + gdStr + '</td>';
        html += '<td class="st-pts"><b>' + s.pts + '</b></td>';
        html += '<td class="st-status"><span class="qualify-badge ' + qs.cls + '">' + qs.label + '</span></td>';
        html += '</tr>';
      });
      html += '</tbody></table>';
      html += '<div class="standings-legend"><span class="qualify-badge qualify-top">出线</span> 前2名直接晋级 <span class="qualify-badge qualify-maybe">待定</span> 第3名待比较 <span class="qualify-badge qualify-out">淘汰</span></div>';
      html += '</div></div>';
    });
  } else {
    html += '<div class="strength-filter-bar"><select id="strength-filter" onchange="onStrengthFilterChange(this.value)">';
    html += '<option value="all"' + (teamStrengthFilter === 'all' ? ' selected' : '') + '>全部球队</option>';
    html += '<option value="夺冠热门"' + (teamStrengthFilter === '夺冠热门' ? ' selected' : '') + '>夺冠热门</option>';
    html += '<option value="强队"' + (teamStrengthFilter === '强队' ? ' selected' : '') + '>强队</option>';
    html += '<option value="中上游"' + (teamStrengthFilter === '中上游' ? ' selected' : '') + '>中上游</option>';
    html += '<option value="中游"' + (teamStrengthFilter === '中游' ? ' selected' : '') + '>中游</option>';
    html += '<option value="弱旅"' + (teamStrengthFilter === '弱旅' ? ' selected' : '') + '>弱旅</option>';
    html += '</select></div>';

    let allTeams = [];
    filteredGroups.forEach(group => {
      GROUPS[group].forEach(t => {
        const s = TEAM_STRENGTH[t] || 60;
        const label = strengthLabel(s);
        if (teamStrengthFilter === 'all' || label === teamStrengthFilter) {
          allTeams.push({ name: t, strength: s, label: label, group: group });
        }
      });
    });
    if (allTeams.length === 0) {
      html += '<div style="text-align:center;padding:40px;color:var(--text-dim);">没有符合筛选条件的球队</div>';
    } else {
      html += '<div class="team-card-grid">';
      allTeams.forEach(t => {
        html += '<div class="team-card" onclick="openTeamDetail(\'' + t.name + '\')">';
        html += flagImg(t.name, 'team-card-flag');
        html += '<div class="team-card-name">' + t.name + '</div>';
        html += '<div class="team-card-group">' + t.group + '组</div>';
        html += '<span class="team-card-tag ' + strengthClass(t.strength) + '">' + t.label + '</span>';
        html += '</div>';
      });
      html += '</div>';
    }
  }

  container.innerHTML = html;
  bindTeamSearch();
}

function bindTeamSearch() {
  const searchInput = $('#team-search');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(function() {
      teamSearchKw = searchInput.value;
      renderTeamsPage();
    }, 300));
  }
}

function switchTeamView(mode) { teamViewMode = mode; renderTeamsPage(); }
function onStrengthFilterChange(val) { teamStrengthFilter = val; renderTeamsPage(); }
function toggleGroup(el) { el.classList.toggle('expanded'); el.nextElementSibling.classList.toggle('hidden'); }

// ========== 球队详情弹窗 ==========
function openTeamDetail(team) {
  const modal = $('#team-modal');
  const detail = $('#team-detail');
  const h = TEAM_HISTORY[team];
  const s = TEAM_STRENGTH[team] || 60;
  const tv = TEAM_VALUE[team];

  let teamGroup = '';
  for (const [g, teams] of Object.entries(GROUPS)) {
    if (teams.includes(team)) { teamGroup = g; break; }
  }
  const teamMatches = MATCHES.filter(m => m.group === teamGroup);

  let html = '';
  // 顶部信息
  html += '<div class="detail-hero">' + flagImg(team, 'detail-flag') + '<div class="detail-team-name">' + flag(team) + ' ' + team + '</div><div class="detail-federation">' + (h ? h.federation : '') + ' · ' + teamGroup + '组</div></div>';

  // 信息网格：夺冠、参赛、身价、评分
  if (h) {
    html += '<div class="detail-info-grid"><div class="detail-info-item"><div class="detail-info-value">' + h.titles + '</div><div class="detail-info-label">夺冠次数</div></div><div class="detail-info-item"><div class="detail-info-value">' + h.appearances + '</div><div class="detail-info-label">参赛次数</div></div><div class="detail-info-item"><div class="detail-info-value">' + (tv ? formatValue(tv) : '-') + '</div><div class="detail-info-label">球队身价</div></div><div class="detail-info-item"><div class="detail-info-value">' + s + '</div><div class="detail-info-label">实力评分</div></div></div>';
    html += '<div class="detail-tags">';
    if (h.titles > 0) html += '<span class="detail-tag">' + h.titles + '届冠军</span>';
    html += '<span class="detail-tag">核心: ' + h.star + '</span><span class="detail-tag">主帅: ' + h.coach + '</span></div>';
    html += '<div class="detail-section" style="padding-bottom:8px;"><div class="detail-section-title">历史最佳</div><div style="font-size:14px;color:var(--text);">' + h.best + '</div></div>';
    if (h.recent && h.recent.length > 0) {
      html += '<div class="detail-section"><div class="detail-section-title">近四届战绩</div><table class="history-table"><thead><tr><th>年份</th><th>成绩</th><th>详情</th></tr></thead><tbody>';
      h.recent.forEach(r => {
        html += '<tr><td>' + r.year + '</td><td class="' + resultClass(r.result) + '">' + r.result + '</td><td>' + r.round + '</td></tr>';
      });
      html += '</tbody></table></div>';
    }
  } else {
    html += '<div class="detail-info-grid"><div class="detail-info-item"><div class="detail-info-value">0</div><div class="detail-info-label">夺冠次数</div></div><div class="detail-info-item"><div class="detail-info-value">0</div><div class="detail-info-label">参赛次数</div></div><div class="detail-info-item"><div class="detail-info-value">' + (tv ? formatValue(tv) : '-') + '</div><div class="detail-info-label">球队身价</div></div><div class="detail-info-item"><div class="detail-info-value">' + s + '</div><div class="detail-info-label">实力评分</div></div></div>';
    html += '<div class="detail-section"><div class="detail-section-title">历史最佳</div><div style="font-size:14px;color:var(--text);">首次参赛！创造历史的开始</div></div>';
  }

  // 现役球员
  const pd = PLAYER_DATA[team];
  if (pd && pd.active && pd.active.length > 0) {
    html += '<div class="detail-section"><div class="detail-section-title">现役球员</div>';
    html += '<div class="player-grid">';
    pd.active.forEach(p => {
      html += '<div class="player-card" onclick="openPlayerDetail(\'' + team + '\',\'' + p.name + '\',\'active\')">';
      html += '<div class="player-photo-wrap"><img class="player-photo" data-en="' + (p.en || '') + '" src="" alt="' + p.name + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';"><div class="player-photo-fallback">' + p.name.charAt(0) + '</div></div>';
      html += '<div class="player-info"><div class="player-name">#' + p.num + ' ' + p.name + '</div><div class="player-pos">' + p.pos + '</div>';
      html += '<div class="player-stats"><span class="player-stat">' + p.goals + '球</span><span class="player-stat">' + p.assists + '助</span></div>';
      if (p.value) html += '<div class="player-value-badge">' + formatValue(p.value) + '</div>';
      html += '</div></div>';
    });
    html += '</div></div>';
  }

  // 历史明星球员
  if (pd && pd.legend && pd.legend.length > 0) {
    html += '<div class="detail-section"><div class="detail-section-title">历史明星</div>';
    html += '<div class="player-grid legend-grid">';
    pd.legend.forEach(p => {
      html += '<div class="player-card legend-card" onclick="openPlayerDetail(\'' + team + '\',\'' + p.name + '\',\'legend\')">';
      html += '<div class="player-photo-wrap"><img class="player-photo" data-en="' + (p.en || '') + '" src="" alt="' + p.name + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';"><div class="player-photo-fallback">' + p.name.charAt(0) + '</div></div>';
      html += '<div class="player-info"><div class="player-name">#' + p.num + ' ' + p.name + '</div><div class="player-pos">' + p.pos + ' · ' + (p.era || '') + '</div>';
      if (p.goals !== undefined) html += '<div class="player-stats"><span class="player-stat">' + p.goals + '球</span><span class="player-stat">' + p.caps + '场</span></div>';
      html += '</div></div>';
    });
    html += '</div></div>';
  }

  // 本届小组赛（含比分/状态）
  if (teamMatches.length > 0) {
    html += '<div class="detail-section"><div class="detail-section-title">本届小组赛</div>';
    teamMatches.forEach(m => {
      const isHome = m.home === team;
      const opponent = isHome ? m.away : m.home;
      const matchStatus = getMatchStatus(m);
      const result = MATCH_RESULTS[m.id];
      const isFinished = matchStatus === 'finished' || (result && result.score && !result.live);
      const isToday = matchStatus === 'today';

      html += '<div class="detail-match-item" onclick="switchToEventTab()" style="cursor:pointer">';
      html += '<div class="detail-match-vs">';
      html += '<span>' + flag(team) + '</span>';
      html += '<span class="detail-match-prefix">' + (isHome ? 'vs' : '@') + '</span>';
      html += '<span>' + flag(opponent) + '</span>';
      html += '<span class="detail-match-opponent" onclick="event.stopPropagation();openTeamDetail(\'' + opponent + '\')">' + opponent + '</span>';
      html += '</div>';

      html += '<div class="detail-match-right">';
      if (isFinished && result && result.score) {
        const parts = result.score.split(':');
        const hg = parseInt(parts[0]) || 0, ag = parseInt(parts[1]) || 0;
        const myGoals = isHome ? hg : ag;
        const oppGoals = isHome ? ag : hg;
        const won = myGoals > oppGoals, draw = myGoals === oppGoals;
        html += '<span class="detail-match-score ' + (won ? 'score-win' : (!draw ? 'score-lose' : 'score-draw')) + '">' + result.score + '</span>';
      } else if (isToday) {
        const isLive = result && result.live;
        html += '<span class="detail-match-status live">' + (isLive ? '进行中' : '今天') + '</span>';
        if (result && result.score) html += '<span class="detail-match-score">' + result.score + '</span>';
      } else {
        html += '<span class="detail-match-status upcoming">' + m.date.slice(5) + ' ' + m.time + '</span>';
      }
      html += '</div></div>';
    });
    html += '</div>';
  }

  detail.innerHTML = html;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(loadVisiblePlayerPhotos, 100);
}

function closeTeamModal() {
  $('#team-modal').classList.remove('open');
  document.body.style.overflow = '';
}

// 跳转到赛事数据tab
function switchToEventTab() {
  closeTeamModal();
  $$('.tab').forEach(t => t.classList.remove('active'));
  $$('.page').forEach(p => p.classList.remove('active'));
  const eventTab = document.querySelector('.tab[data-tab="event"]');
  if (eventTab) eventTab.classList.add('active');
  const eventPage = $('#page-event');
  if (eventPage) eventPage.classList.add('active');
  eventSubView = 'schedule';
  renderEventPage();
}

function resultClass(result) {
  if (result.includes('冠军')) return 'result-champion';
  if (result.includes('亚军')) return 'result-runner';
  if (result.includes('4强')) return 'result-semi';
  if (result.includes('16强') || result.includes('8强')) return 'result-ko';
  if (result.includes('小组赛')) return 'result-group';
  if (result.includes('未晋级')) return 'result-dnq';
  return '';
}

// ========== 球员详情弹窗（增强版） ==========
function openPlayerDetail(team, playerName, type) {
  const modal = $('#player-modal');
  const detail = $('#player-detail');
  const pd = PLAYER_DATA[team];
  if (!pd) return;

  const players = type === 'legend' ? (pd.legend || []) : (pd.active || []);
  const player = players.find(p => p.name === playerName);
  if (!player) return;

  let html = '';
  // 头部
  html += '<div class="player-detail-hero">';
  html += '<div class="player-detail-photo-wrap"><img class="player-detail-photo player-photo" data-en="' + (player.en || '') + '" src="" alt="' + player.name + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';"><div class="player-detail-photo-fallback">' + player.name.charAt(0) + '</div></div>';
  html += '<div class="player-detail-name">#' + player.num + ' ' + player.name + '</div>';
  html += '<div class="player-detail-en">' + (player.en || '') + '</div>';
  html += '<div class="player-detail-team" onclick="closePlayerModal();openTeamDetail(\'' + team + '\')" style="cursor:pointer">' + flag(team) + ' ' + team + ' · ' + player.pos + '</div>';
  html += '</div>';

  // 信息网格
  html += '<div class="detail-info-grid">';
  if (type === 'legend') {
    html += '<div class="detail-info-item"><div class="detail-info-value">' + (player.caps || '-') + '</div><div class="detail-info-label">国家队出场</div></div>';
    html += '<div class="detail-info-item"><div class="detail-info-value">' + (player.goals !== undefined ? player.goals : '-') + '</div><div class="detail-info-label">国家队进球</div></div>';
    html += '<div class="detail-info-item"><div class="detail-info-value">' + (player.era || '-') + '</div><div class="detail-info-label">效力时期</div></div>';
  } else {
    html += '<div class="detail-info-item"><div class="detail-info-value">' + (player.age || '-') + '</div><div class="detail-info-label">年龄</div></div>';
    html += '<div class="detail-info-item"><div class="detail-info-value">' + (player.height || '-') + (player.height ? 'cm' : '') + '</div><div class="detail-info-label">身高</div></div>';
    html += '<div class="detail-info-item"><div class="detail-info-value">' + (player.club || '-') + '</div><div class="detail-info-label">效力俱乐部</div></div>';
  }
  html += '</div>';

  // 第二行信息
  html += '<div class="detail-info-grid">';
  if (type === 'active') {
    html += '<div class="detail-info-item"><div class="detail-info-value">' + (player.caps || '-') + '</div><div class="detail-info-label">国家队出场</div></div>';
    html += '<div class="detail-info-item"><div class="detail-info-value">' + (player.foot || '-') + '</div><div class="detail-info-label">惯用脚</div></div>';
    html += '<div class="detail-info-item"><div class="detail-info-value player-value-text">' + (player.value ? formatValue(player.value) : '-') + '</div><div class="detail-info-label">目前身价</div></div>';
  } else {
    html += '<div class="detail-info-item"><div class="detail-info-value player-value-text">--</div><div class="detail-info-label">身价</div></div>';
    html += '<div class="detail-info-item"><div class="detail-info-value">--</div><div class="detail-info-label">身高</div></div>';
    html += '<div class="detail-info-item"><div class="detail-info-value">--</div><div class="detail-info-label">惯用脚</div></div>';
  }
  html += '</div>';

  // 本届数据
  if (type === 'active') {
    html += '<div class="detail-tags">';
    html += '<span class="detail-tag">' + player.goals + ' 球</span>';
    html += '<span class="detail-tag">' + player.assists + ' 助攻</span>';
    html += '</div>';
  }

  // 荣誉
  if (player.honors && player.honors.length > 0) {
    html += '<div class="detail-section"><div class="detail-section-title">主要荣誉</div>';
    html += '<div class="honors-list">';
    player.honors.forEach(h => {
      html += '<span class="honor-badge">' + h + '</span>';
    });
    html += '</div></div>';
  }

  // 简介
  if (player.bio) {
    html += '<div class="detail-section"><div class="detail-section-title">球员简介</div><div class="player-bio">' + player.bio + '</div></div>';
  }

  // 跳转到球队
  html += '<div class="detail-section"><div class="detail-section-title" style="cursor:pointer;color:var(--accent-light)" onclick="closePlayerModal();openTeamDetail(\'' + team + '\')">查看 ' + team + ' 球队详情 ></div></div>';

  detail.innerHTML = html;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(loadVisiblePlayerPhotos, 100);
}

function closePlayerModal() {
  $('#player-modal').classList.remove('open');
  document.body.style.overflow = '';
}

const _modalClose = $('#modal-close');
if (_modalClose) _modalClose.addEventListener('click', closeTeamModal);
const _teamModal = $('#team-modal');
if (_teamModal) _teamModal.addEventListener('click', e => { if (e.target === e.currentTarget) closeTeamModal(); });

const _playerModalClose = $('#player-modal-close');
if (_playerModalClose) _playerModalClose.addEventListener('click', closePlayerModal);
const _playerModal = $('#player-modal');
if (_playerModal) _playerModal.addEventListener('click', e => { if (e.target === e.currentTarget) closePlayerModal(); });

// ========== 赔率分析（已替换为预测系统，见 predict.js）==========

// ========== AI 聊天 ==========
const chatMessages = $('#chat-messages');
const chatInput = $('#chat-input');
const chatSend = $('#chat-send');

function buildWorldCupContext() {
  let ctx = '你是2026美加墨世界杯观赛搭子，一个专业又热情的足球评论员。以下是本届世界杯数据：\n\n';
  ctx += '分组情况：\n';
  for (const [g, teams] of Object.entries(GROUPS)) ctx += g + '组：' + teams.join('、') + '\n';
  ctx += '\n赛程（北京时间）：\n';
  MATCHES.forEach(m => { ctx += m.date + ' ' + m.time + ' ' + m.group + '组第' + m.round + '轮 ' + m.home + 'vs' + m.away + '（' + m.venue + '）\n'; });
  ctx += '\n规则：48队分12组，每组前2名+8个最好第3名晋级32强淘汰赛。揭幕战6月12日03:00墨西哥vs南非，决赛7月20日。';
  ctx += '\n\n请用中文回答，语气热情专业，像球迷之间聊天一样。回答控制在200字以内。';
  return ctx;
}

async function callQianfan(userMsg) {
  const apiKey = localStorage.getItem('wc_api_key');
  if (!apiKey) return '请先在「设置」页面配置百度千帆的 API Key，然后就能和我聊球了！';
  try {
    const body = { model: 'ernie-4.0-8k', messages: [{ role: 'user', content: buildWorldCupContext() }, ...getChatHistory(), { role: 'user', content: userMsg }], temperature: 0.8, top_p: 0.9 };
    const res = await fetch('https://qianfan.baidubce.com/v2/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey }, body: JSON.stringify(body) });
    const data = await res.json();
    if (data.error_code) return '接口出错：' + (data.error_msg || '未知错误') + '。如果是不支持该模型，可在代码中换成 ernie-3.5-8k。';
    return (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '抱歉，我没想好怎么说...';
  } catch (err) {
    console.error('千帆 API 调用失败:', err);
    return '网络请求失败，请检查网络连接后重试。';
  }
}

function getChatHistory() {
  if (!chatMessages) return [];
  const history = [];
  chatMessages.querySelectorAll('.msg').forEach(m => {
    const text = m.querySelector('.msg-bubble').textContent;
    if (m.classList.contains('user')) history.push({ role: 'user', content: text });
    else if (!text.includes('观赛搭子')) history.push({ role: 'assistant', content: text });
  });
  return history.slice(-6);
}

function addMessage(text, isUser) {
  if (!chatMessages) return;
  const div = document.createElement('div');
  div.className = 'msg ' + (isUser ? 'user' : 'bot');
  div.innerHTML = '<div class="msg-bubble">' + text + '</div>';
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTypingIndicator() {
  if (!chatMessages) return;
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.id = 'typing';
  div.innerHTML = '<div class="msg-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>';
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() { const el = $('#typing'); if (el) el.remove(); }

async function sendMessage() {
  if (!chatInput || !chatSend) return;
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = '';
  addMessage(text, true);
  chatSend.disabled = true;
  addTypingIndicator();
  const reply = await callQianfan(text);
  removeTypingIndicator();
  addMessage(reply, false);
  chatSend.disabled = false;
  if (chatInput) chatInput.focus();
}

if (chatSend) chatSend.addEventListener('click', sendMessage);
if (chatInput) chatInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });
$$('.quick-ask').forEach(btn => { btn.addEventListener('click', () => { if (chatInput) { chatInput.value = btn.dataset.q; sendMessage(); } }); });

// ========== 设置（已移至侧边栏隐藏面板） ==========

// ========== 初始化 ==========
function init() {
  renderEventPage();
  renderTeamsPage();
  fetchLiveScores();
}

init();

// ========== 实时比分 API ==========
const LIVE_REFRESH_INTERVAL = 60 * 1000;
let liveRefreshTimer = null;

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
for (const [cn, en] of Object.entries(TEAM_EN_MAP)) EN_CN_MAP[en.toLowerCase()] = cn;

function findChineseTeam(enName) {
  if (!enName) return null;
  const cn = EN_CN_MAP[enName.toLowerCase()];
  if (cn) return cn;
  const lower = enName.toLowerCase();
  for (const [en, cn2] of Object.entries(EN_CN_MAP)) { if (lower.includes(en.split(' ')[0])) return cn2; }
  return null;
}

async function fetchLiveScores() {
  loadCachedResults();
  try {
    const lastFetch = localStorage.getItem('wc_last_fetch');
    const isFirstLoad = !lastFetch || Date.now() - parseInt(lastFetch) > 6 * 60 * 60 * 1000;
    const dates = [];
    const now = new Date();
    if (isFirstLoad) {
      const start = new Date('2026-06-11T00:00:00Z');
      const end = new Date('2026-06-29T00:00:00Z');
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) dates.push(d.toISOString().slice(0, 10));
    } else {
      for (let i = -3; i <= 3; i++) {
        const d = new Date(now); d.setDate(d.getDate() + i);
        const ds = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        if (ds >= '2026-06-11' && ds <= '2026-06-28') dates.push(ds);
      }
    }
    const allEvents = [];
    const batchSize = 5;
    for (let i = 0; i < dates.length; i += batchSize) {
      const batch = dates.slice(i, i + batchSize);
      const promises = batch.map(date => fetch('https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=' + date + '&l=4429').then(r => r.json()).then(data => (data.events || []).map(e => ({ ...e, _queryDate: date }))).catch(() => []));
      const results = await Promise.all(promises);
      results.forEach(events => allEvents.push(...events));
    }
    if (allEvents.length === 0) { console.log('TheSportsDB 暂无 2026 世界杯数据'); return; }
    let updated = 0;
    allEvents.forEach(evt => {
      const homeCN = findChineseTeam(evt.strHomeTeam);
      const awayCN = findChineseTeam(evt.strAwayTeam);
      if (!homeCN || !awayCN) return;
      const match = MATCHES.find(m => m.home === homeCN && m.away === awayCN);
      if (!match) return;
      const homeScore = evt.intHomeScore, awayScore = evt.intAwayScore, status = evt.strStatus;
      if (homeScore !== null && awayScore !== null && homeScore !== undefined && awayScore !== undefined) {
        const isFinished = ['FT', 'AET', 'PEN'].includes(status);
        const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'BT', 'LIVE'].includes(status);
        MATCH_RESULTS[match.id] = { score: homeScore + ':' + awayScore, events: isFinished ? '比赛结束' : isLive ? '进行中' : '', live: isLive };
        updated++;
      }
      if (evt.strTime) {
        const [h, m] = evt.strTime.split(':').map(Number);
        const bjH = (h + 8) % 24;
        const bjDate = new Date(evt.dateEvent + 'T00:00:00Z');
        if (h + 8 >= 24) bjDate.setDate(bjDate.getDate() + 1);
        const dateStr = bjDate.getFullYear() + '-' + String(bjDate.getMonth() + 1).padStart(2, '0') + '-' + String(bjDate.getDate()).padStart(2, '0');
        const timeStr = String(bjH).padStart(2, '0') + ':' + String(m).padStart(2, '0');
        if (match.date !== dateStr || match.time !== timeStr) { match.date = dateStr; match.time = timeStr; updated++; }
      }
    });
    localStorage.setItem('wc_match_results', JSON.stringify(MATCH_RESULTS));
    localStorage.setItem('wc_last_fetch', Date.now().toString());
    const activePage = document.querySelector('.page.active');
    if (activePage && activePage.id === 'page-event') renderEventPage();
    if (activePage && activePage.id === 'page-teams') renderTeamsPage();
    if (updated > 0) showRefreshIndicator('已更新 ' + updated + ' 条数据');
  } catch (err) {
    console.warn('TheSportsDB 请求失败:', err.message);
    showRefreshIndicator('更新失败，使用缓存数据');
  }
  if (!liveRefreshTimer) liveRefreshTimer = setInterval(fetchLiveScores, LIVE_REFRESH_INTERVAL);
}

function loadCachedResults() {
  const cached = localStorage.getItem('wc_match_results');
  if (cached) { try { Object.assign(MATCH_RESULTS, JSON.parse(cached)); } catch (e) {} }
}

function showRefreshIndicator(text) {
  let indicator = $('#refresh-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'refresh-indicator';
    indicator.style.cssText = 'position:fixed;bottom:20px;right:20px;background:var(--card-bg);color:var(--text);padding:8px 16px;border-radius:8px;font-size:12px;border:1px solid var(--card-border);z-index:999;opacity:0;transition:opacity 0.3s;';
    document.body.appendChild(indicator);
  }
  indicator.textContent = text;
  indicator.style.opacity = '1';
  setTimeout(function() { indicator.style.opacity = '0'; }, 3000);
}

// ========== 蒙超联赛渲染 ==========
var mengchaoSubView = 'standings'; // standings | schedule | scorers

function renderMengchaoPage() {
  // 切换到蒙超时一次性渲染所有页面
  renderMengchaoEventPage();
  renderMengchaoTeamsPage();
  renderMengchaoPredictPage();
}

function renderMengchaoEventPage() {
  // 隐藏世界杯的子导航
  var wcNav = $('#event-sub-nav');
  if (wcNav) wcNav.innerHTML = '';

  var content = $('#event-content');
  if (!content) return;

  var html = '';
  html += '<div class="mengchao-sub-nav">';
  html += '<a class="mengchao-sub-btn' + (mengchaoSubView === 'standings' ? ' active' : '') + '" onclick="switchMengchaoSubView(\'standings\')">积分榜</a>';
  html += '<a class="mengchao-sub-btn' + (mengchaoSubView === 'schedule' ? ' active' : '') + '" onclick="switchMengchaoSubView(\'schedule\')">赛程</a>';
  html += '<a class="mengchao-sub-btn' + (mengchaoSubView === 'scorers' ? ' active' : '') + '" onclick="switchMengchaoSubView(\'scorers\')">射手榜</a>';
  html += '</div>';

  if (mengchaoSubView === 'standings') {
    html += renderMengchaoStandings();
  } else if (mengchaoSubView === 'schedule') {
    html += renderMengchaoSchedule();
  } else {
    html += renderMengchaoScorers();
  }

  content.innerHTML = html;
}

function switchMengchaoSubView(view) {
  mengchaoSubView = view;
  renderMengchaoEventPage();
}

function renderMengchaoStandings() {
  var html = '';
  html += '<div class="mengchao-standings-wrap">';
  html += '<div class="mengchao-section-title">2026 蒙超联赛积分榜</div>';
  html += '<div class="mengchao-update-time">更新至第6轮 · 2026-06-22</div>';
  html += '<div class="mengchao-table-container"><table class="mengchao-table">';
  html += '<thead><tr><th>排名</th><th>球队</th><th>场</th><th>胜</th><th>平</th><th>负</th><th>进</th><th>失</th><th>净</th><th>积分</th></tr></thead>';
  html += '<tbody>';
  MENGCHAO_STANDINGS.forEach(function(s) {
    var teamInfo = MENGCHAO_TEAMS[s.team] || {};
    var color = teamInfo.color || '#6366f1';
    var gd = s.gf - s.ga;
    var gdClass = gd > 0 ? 'mengchao-gd-pos' : (gd < 0 ? 'mengchao-gd-neg' : '');
    var rankClass = '';
    if (s.rank <= 2) rankClass = 'mengchao-rank-top';
    else if (s.rank <= 8) rankClass = 'mengchao-rank-mid';
    else rankClass = 'mengchao-rank-bot';

    html += '<tr class="' + rankClass + '">';
    html += '<td class="mengchao-rank">' + s.rank + '</td>';
    html += '<td class="mengchao-team-cell"><span class="mengchao-team-dot" style="background:' + color + '"></span>' + s.team + '</td>';
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
  html += '<div class="mengchao-legend">';
  html += '<span class="mengchao-legend-item"><span class="mengchao-legend-dot" style="background:#22c55e"></span>晋级区（前8）</span>';
  html += '<span class="mengchao-legend-item"><span class="mengchao-legend-dot" style="background:#ef4444"></span>淘汰区</span>';
  html += '</div>';
  html += '</div>';
  return html;
}

function renderMengchaoSchedule() {
  var html = '';
  var today = new Date().toISOString().slice(0, 10);

  // 按轮次分组
  var rounds = {};
  MENGCHAO_MATCHES.forEach(function(m) {
    if (!rounds[m.round]) rounds[m.round] = [];
    rounds[m.round].push(m);
  });

  // 分类轮次：即将开始/进行中、已结束、未来
  var nextRound = null;  // 最近一轮要开始的
  var finishedRounds = [];
  var futureRounds = [];

  var roundNums = Object.keys(rounds).map(Number).sort(function(a,b) { return a - b; });
  roundNums.forEach(function(round) {
    var matches = rounds[round];
    var allFinished = matches.every(function(m) { return m.finished; });
    var allUpcoming = matches.every(function(m) { return !m.finished; });
    if (allFinished) {
      finishedRounds.push(round);
    } else {
      // 第一个未全部结束的轮次就是"最近一轮"
      if (nextRound === null) nextRound = round;
      else futureRounds.push(round);
    }
  });

  html += '<div class="mengchao-schedule-wrap">';
  html += '<div class="mengchao-section-title">蒙超联赛赛程</div>';

  function renderRoundBlock(round) {
    var matches = rounds[round];
    var allFinished = matches.every(function(m) { return m.finished; });
    var hasToday = matches.some(function(m) { return m.date === today; });

    html += '<div class="mengchao-round' + (allFinished ? ' mengchao-round-finished' : '') + (hasToday ? ' mengchao-round-today' : '') + '">';
    html += '<div class="mengchao-round-header">';
    html += '<span class="mengchao-round-label">第' + round + '轮</span>';
    if (allFinished) html += '<span class="mengchao-round-status mengchao-status-done">已结束</span>';
    else if (hasToday) html += '<span class="mengchao-round-status mengchao-status-live">进行中</span>';
    else html += '<span class="mengchao-round-status mengchao-status-upcoming">未开始</span>';
    html += '</div>';

    matches.forEach(function(m) {
      var homeInfo = MENGCHAO_TEAMS[m.home] || {};
      var awayInfo = MENGCHAO_TEAMS[m.away] || {};
      html += '<div class="mengchao-match' + (m.finished ? ' mengchao-match-finished' : '') + '">';
      html += '<div class="mengchao-match-date">' + m.date + ' ' + (m.time || '') + '</div>';
      html += '<div class="mengchao-match-body">';
      html += '<div class="mengchao-match-team">';
      html += '<span class="mengchao-team-dot" style="background:' + (homeInfo.color || '#6366f1') + '"></span>';
      html += '<span class="mengchao-match-team-name">' + m.home + '</span>';
      html += '</div>';
      if (m.finished && m.homeScore !== null) {
        html += '<div class="mengchao-match-score"><span class="mengchao-score-num">' + m.homeScore + '</span><span class="mengchao-score-sep">:</span><span class="mengchao-score-num">' + m.awayScore + '</span></div>';
      } else {
        html += '<div class="mengchao-match-score mengchao-vs">VS</div>';
      }
      html += '<div class="mengchao-match-team mengchao-match-team-away">';
      html += '<span class="mengchao-team-dot" style="background:' + (awayInfo.color || '#6366f1') + '"></span>';
      html += '<span class="mengchao-match-team-name">' + m.away + '</span>';
      html += '</div>';
      html += '</div>';
      html += '<div class="mengchao-match-venue">' + m.venue + '</div>';
      html += '</div>';
    });

    html += '</div>';
  }

  // 1. 最近一轮（即将开始/进行中）放最前
  if (nextRound !== null) renderRoundBlock(nextRound);

  // 2. 已结束的倒序排列
  finishedRounds.reverse().forEach(function(round) {
    renderRoundBlock(round);
  });

  // 3. 之后的比赛
  futureRounds.forEach(function(round) {
    renderRoundBlock(round);
  });

  html += '</div>';
  return html;
}

function renderMengchaoScorers() {
  var html = '';
  html += '<div class="mengchao-scorers-wrap">';
  html += '<div class="mengchao-section-title">蒙超射手榜</div>';

  MENGCHAO_SCORERS.forEach(function(s) {
    var teamInfo = MENGCHAO_TEAMS[s.team] || {};
    var color = teamInfo.color || '#6366f1';
    var medalIcon = '';
    if (s.rank === 1) medalIcon = '🥇';
    else if (s.rank === 2) medalIcon = '🥈';
    else if (s.rank === 3) medalIcon = '🥉';

    html += '<div class="mengchao-scorer-card">';
    html += '<div class="mengchao-scorer-rank">' + (medalIcon || s.rank) + '</div>';
    html += '<div class="mengchao-scorer-info">';
    html += '<div class="mengchao-scorer-name">' + s.name + '</div>';
    html += '<div class="mengchao-scorer-team"><span class="mengchao-team-dot" style="background:' + color + '"></span>' + s.team + (s.note ? ' · ' + s.note : '') + '</div>';
    html += '</div>';
    html += '<div class="mengchao-scorer-goals">' + s.goals + '<span class="mengchao-scorer-unit">球</span></div>';
    html += '</div>';
  });

  html += '</div>';
  return html;
}

function renderMengchaoTeamsPage() {
  var content = $('#page-teams');
  if (!content) return;

  var html = '';
  html += '<div class="mengchao-teams-wrap">';
  html += '<div class="mengchao-section-title">蒙超联赛球队</div>';
  html += '<div class="mengchao-teams-grid">';

  MENGCHAO_STANDINGS.forEach(function(s) {
    var teamInfo = MENGCHAO_TEAMS[s.team] || {};
    var color = teamInfo.color || '#6366f1';
    html += '<div class="mengchao-team-card" onclick="showMengchaoTeamDetail(\'' + s.team + '\')" style="border-left:4px solid ' + color + '">';
    html += '<div class="mengchao-team-card-header">';
    html += '<span class="mengchao-team-card-rank">#' + s.rank + '</span>';
    html += '<span class="mengchao-team-card-name">' + s.team + '</span>';
    html += '<span class="mengchao-team-card-pts">' + s.pts + '分</span>';
    html += '</div>';
    html += '<div class="mengchao-team-card-stats">';
    html += '<span>' + s.won + '胜</span><span>' + s.drawn + '平</span><span>' + s.lost + '负</span>';
    html += '<span>进' + s.gf + '球</span><span>失' + s.ga + '球</span>';
    html += '</div>';
    if (teamInfo.desc) {
      html += '<div class="mengchao-team-card-desc">' + teamInfo.desc + '</div>';
    }
    html += '</div>';
  });

  html += '</div></div>';
  content.innerHTML = html;
}

var mengchaoPredictView = 'next'; // next | history

function renderMengchaoPredictPage() {
  var content = $('#predict-content');
  if (!content) return;

  var html = '';
  html += '<div class="mengchao-predict-wrap">';

  // 子导航：下期预测 | 往期预测
  html += '<div class="mengchao-sub-nav">';
  html += '<a class="mengchao-sub-btn' + (mengchaoPredictView === 'next' ? ' active' : '') + '" onclick="switchMengchaoPredictView(\'next\')">下期预测</a>';
  html += '<a class="mengchao-sub-btn' + (mengchaoPredictView === 'history' ? ' active' : '') + '" onclick="switchMengchaoPredictView(\'history\')">往期预测</a>';
  html += '</div>';

  if (mengchaoPredictView === 'next') {
    html += renderMengchaoNextPredict();
  } else {
    html += renderMengchaoHistoryPredict();
  }

  html += '</div>';
  content.innerHTML = html;
}

function switchMengchaoPredictView(view) {
  mengchaoPredictView = view;
  renderMengchaoPredictPage();
}

function renderMengchaoNextPredict() {
  var html = '';
  // 找最近未开始的轮次
  var nextRound = null;
  var rounds = {};
  MENGCHAO_MATCHES.forEach(function(m) {
    if (!rounds[m.round]) rounds[m.round] = [];
    rounds[m.round].push(m);
  });
  var roundNums = Object.keys(rounds).map(Number).sort(function(a,b) { return a - b; });
  for (var i = 0; i < roundNums.length; i++) {
    var allFinished = rounds[roundNums[i]].every(function(m) { return m.finished; });
    if (!allFinished) { nextRound = roundNums[i]; break; }
  }

  if (nextRound === null) {
    html += '<div class="mengchao-section-title">本赛季常规赛已全部结束</div>';
    return html;
  }

  var matches = rounds[nextRound];
  html += '<div class="mengchao-section-title">第' + nextRound + '轮 预测</div>';

  matches.forEach(function(m) {
    var homeInfo = MENGCHAO_TEAMS[m.home] || {};
    var awayInfo = MENGCHAO_TEAMS[m.away] || {};
    var homeStanding = MENGCHAO_STANDINGS.find(function(s) { return s.team === m.home; });
    var awayStanding = MENGCHAO_STANDINGS.find(function(s) { return s.team === m.away; });

    // 简单预测逻辑：基于排名和积分
    var homePts = homeStanding ? homeStanding.pts : 0;
    var awayPts = awayStanding ? awayStanding.pts : 0;
    var homeRank = homeStanding ? homeStanding.rank : 6;
    var awayRank = awayStanding ? awayStanding.rank : 6;
    var homeStr = MENGCHAO_TEAMS[m.home] ? MENGCHAO_TEAMS[m.home].strength : 60;
    var awayStr = MENGCHAO_TEAMS[m.away] ? MENGCHAO_TEAMS[m.away].strength : 60;
    var homeScore = Math.round(homeStr / 20 + (12 - homeRank) * 0.15);
    var awayScore = Math.round(awayStr / 20 + (12 - awayRank) * 0.15);
    if (homeScore === awayScore) homeScore += (homePts >= awayPts ? 1 : 0);
    if (homeScore < 0) homeScore = 0;
    if (awayScore < 0) awayScore = 0;
    var wdl = homeScore > awayScore ? '主胜' : (homeScore < awayScore ? '客胜' : '平');
    var totalGoals = homeScore + awayScore;
    var goalsLabel = totalGoals <= 2 ? '小2.5球' : '大2.5球';

    html += '<div class="mengchao-predict-card">';
    html += '<div class="mengchao-predict-header">';
    html += '<div class="mengchao-predict-team">';
    html += '<span class="mengchao-team-dot" style="background:' + (homeInfo.color || '#6366f1') + '"></span>';
    html += '<span class="mengchao-predict-team-name">' + m.home + '</span>';
    html += '<span class="mengchao-predict-rank">#' + homeRank + '</span>';
    html += '</div>';
    html += '<div class="mengchao-predict-vs">VS</div>';
    html += '<div class="mengchao-predict-team mengchao-predict-team-away">';
    html += '<span class="mengchao-predict-rank">#' + awayRank + '</span>';
    html += '<span class="mengchao-predict-team-name">' + m.away + '</span>';
    html += '<span class="mengchao-team-dot" style="background:' + (awayInfo.color || '#6366f1') + '"></span>';
    html += '</div>';
    html += '</div>';
    html += '<div class="mengchao-predict-info">' + m.date + ' ' + (m.time || '') + ' · ' + m.venue + '</div>';
    html += '<div class="mengchao-predict-result">';
    html += '<span class="mengchao-predict-wdl wdl-' + (wdl === '主胜' ? 'home' : wdl === '客胜' ? 'away' : 'draw') + '">' + wdl + '</span>';
    html += '<span class="mengchao-predict-score">' + homeScore + ':' + awayScore + '</span>';
    html += '<span class="mengchao-predict-goals">' + goalsLabel + '</span>';
    html += '</div>';
    html += '</div>';
  });

  // 晋级形势分析
  html += '<div class="mengchao-section-title" style="margin-top:20px">晋级形势分析</div>';
  html += '<div class="mengchao-qualify-section">';
  html += '<div class="mengchao-qualify-row mengchao-qualify-header"><span>排名</span><span>球队</span><span>积分</span><span>剩余</span><span>形势</span></div>';
  MENGCHAO_STANDINGS.forEach(function(s) {
    var remaining = s.played >= 11 ? 0 : (11 - s.played);
    var situation = '';
    var sitClass = '';
    if (s.rank <= 4) { situation = '晋级无忧'; sitClass = 'mengchao-sit-safe'; }
    else if (s.rank <= 8) { situation = '有望晋级'; sitClass = 'mengchao-sit-likely'; }
    else { situation = '形势严峻'; sitClass = 'mengchao-sit-danger'; }
    html += '<div class="mengchao-qualify-row">';
    html += '<span>' + s.rank + '</span>';
    html += '<span>' + s.team + '</span>';
    html += '<span>' + s.pts + '</span>';
    html += '<span>' + remaining + '场</span>';
    html += '<span class="' + sitClass + '">' + situation + '</span>';
    html += '</div>';
  });
  html += '</div>';

  return html;
}

function renderMengchaoHistoryPredict() {
  var html = '';

  // 找所有已结束的比赛，倒序排列（最近在前）
  var finishedMatches = MENGCHAO_MATCHES.filter(function(m) { return m.finished; }).reverse();

  if (finishedMatches.length === 0) {
    html += '<div style="text-align:center;padding:40px;color:var(--text-dim);">暂无已结束的比赛</div>';
    return html;
  }

  // 按轮次分组，倒序
  var rounds = {};
  finishedMatches.forEach(function(m) {
    if (!rounds[m.round]) rounds[m.round] = [];
    rounds[m.round].push(m);
  });
  var roundNums = Object.keys(rounds).map(Number).sort(function(a,b) { return b - a; });

  roundNums.forEach(function(round) {
    var matches = rounds[round];
    html += '<div class="mengchao-round mengchao-round-finished">';
    html += '<div class="mengchao-round-header">';
    html += '<span class="mengchao-round-label">第' + round + '轮</span>';
    html += '<span class="mengchao-round-status mengchao-status-done">已结束</span>';
    html += '</div>';

    matches.forEach(function(m) {
      var homeInfo = MENGCHAO_TEAMS[m.home] || {};
      var awayInfo = MENGCHAO_TEAMS[m.away] || {};
      html += '<div class="mengchao-match mengchao-match-finished">';
      html += '<div class="mengchao-match-date">' + m.date + ' ' + (m.time || '') + '</div>';
      html += '<div class="mengchao-match-body">';
      html += '<div class="mengchao-match-team">';
      html += '<span class="mengchao-team-dot" style="background:' + (homeInfo.color || '#6366f1') + '"></span>';
      html += '<span class="mengchao-match-team-name">' + m.home + '</span>';
      html += '</div>';
      html += '<div class="mengchao-match-score"><span class="mengchao-score-num">' + m.homeScore + '</span><span class="mengchao-score-sep">:</span><span class="mengchao-score-num">' + m.awayScore + '</span></div>';
      html += '<div class="mengchao-match-team mengchao-match-team-away">';
      html += '<span class="mengchao-team-dot" style="background:' + (awayInfo.color || '#6366f1') + '"></span>';
      html += '<span class="mengchao-match-team-name">' + m.away + '</span>';
      html += '</div>';
      html += '</div>';
      html += '<div class="mengchao-match-venue">' + m.venue + '</div>';
      html += '</div>';
    });

    html += '</div>';
  });

  // 数据洞察
  html += '<div class="mengchao-section-title" style="margin-top:20px">数据洞察</div>';
  html += '<div class="mengchao-insight-cards">';

  var topTeam = MENGCHAO_STANDINGS[0];
  var topInfo = MENGCHAO_TEAMS[topTeam.team] || {};
  html += '<div class="mengchao-insight-card" style="border-left:4px solid ' + (topInfo.color || '#6366f1') + '">';
  html += '<div class="mengchao-insight-icon">🏆</div>';
  html += '<div class="mengchao-insight-title">领跑者</div>';
  html += '<div class="mengchao-insight-team">' + topTeam.team + '</div>';
  html += '<div class="mengchao-insight-detail">' + topTeam.pts + '分 · ' + topTeam.won + '胜' + topTeam.drawn + '平' + topTeam.lost + '负</div>';
  html += '</div>';

  var bestAttack = MENGCHAO_STANDINGS.slice().sort(function(a,b) { return b.gf - a.gf; })[0];
  var baInfo = MENGCHAO_TEAMS[bestAttack.team] || {};
  html += '<div class="mengchao-insight-card" style="border-left:4px solid ' + (baInfo.color || '#6366f1') + '">';
  html += '<div class="mengchao-insight-icon">⚽</div>';
  html += '<div class="mengchao-insight-title">最强火力</div>';
  html += '<div class="mengchao-insight-team">' + bestAttack.team + '</div>';
  html += '<div class="mengchao-insight-detail">' + bestAttack.gf + '球 · 场均' + (bestAttack.gf / bestAttack.played).toFixed(1) + '球</div>';
  html += '</div>';

  var bestDef = MENGCHAO_STANDINGS.slice().sort(function(a,b) { return a.ga - b.ga; })[0];
  var bdInfo = MENGCHAO_TEAMS[bestDef.team] || {};
  html += '<div class="mengchao-insight-card" style="border-left:4px solid ' + (bdInfo.color || '#6366f1') + '">';
  html += '<div class="mengchao-insight-icon">🛡️</div>';
  html += '<div class="mengchao-insight-title">最佳防线</div>';
  html += '<div class="mengchao-insight-team">' + bestDef.team + '</div>';
  html += '<div class="mengchao-insight-detail">仅失' + bestDef.ga + '球 · 场均失' + (bestDef.ga / bestDef.played).toFixed(1) + '球</div>';
  html += '</div>';

  var topScorer = MENGCHAO_SCORERS[0];
  var tsInfo = MENGCHAO_TEAMS[topScorer.team] || {};
  html += '<div class="mengchao-insight-card" style="border-left:4px solid ' + (tsInfo.color || '#6366f1') + '">';
  html += '<div class="mengchao-insight-icon">👟</div>';
  html += '<div class="mengchao-insight-title">射手王</div>';
  html += '<div class="mengchao-insight-team">' + topScorer.name + '</div>';
  html += '<div class="mengchao-insight-detail">' + topScorer.team + ' · ' + topScorer.goals + '球</div>';
  html += '</div>';

  html += '</div>';

  return html;
}

function showMengchaoTeamDetail(teamName) {
  var teamInfo = MENGCHAO_TEAMS[teamName] || {};
  var standing = MENGCHAO_STANDINGS.find(function(s) { return s.team === teamName; });
  var teamMatches = MENGCHAO_MATCHES.filter(function(m) { return m.home === teamName || m.away === teamName; });

  var html = '';
  html += '<div class="mengchao-team-detail">';
  html += '<div class="mengchao-team-detail-header" style="background:' + (teamInfo.color || '#6366f1') + '">';
  html += '<div class="mengchao-team-detail-name">' + teamName + '</div>';
  if (standing) {
    html += '<div class="mengchao-team-detail-pts">' + standing.pts + '分 · 第' + standing.rank + '名</div>';
  }
  html += '</div>';

  if (standing) {
    html += '<div class="mengchao-team-detail-stats">';
    html += '<div class="mengchao-detail-stat"><div class="mengchao-detail-stat-val">' + standing.played + '</div><div class="mengchao-detail-stat-label">已赛</div></div>';
    html += '<div class="mengchao-detail-stat"><div class="mengchao-detail-stat-val mengchao-w">' + standing.won + '</div><div class="mengchao-detail-stat-label">胜</div></div>';
    html += '<div class="mengchao-detail-stat"><div class="mengchao-detail-stat-val mengchao-d">' + standing.drawn + '</div><div class="mengchao-detail-stat-label">平</div></div>';
    html += '<div class="mengchao-detail-stat"><div class="mengchao-detail-stat-val mengchao-l">' + standing.lost + '</div><div class="mengchao-detail-stat-label">负</div></div>';
    html += '<div class="mengchao-detail-stat"><div class="mengchao-detail-stat-val">' + standing.gf + '</div><div class="mengchao-detail-stat-label">进球</div></div>';
    html += '<div class="mengchao-detail-stat"><div class="mengchao-detail-stat-val">' + standing.ga + '</div><div class="mengchao-detail-stat-label">失球</div></div>';
    html += '</div>';
  }

  if (teamInfo.venue) {
    html += '<div class="mengchao-team-detail-info"><span class="mengchao-detail-label">主场</span><span>' + teamInfo.venue + '</span></div>';
  }
  if (teamInfo.desc) {
    html += '<div class="mengchao-team-detail-info"><span class="mengchao-detail-label">简介</span><span>' + teamInfo.desc + '</span></div>';
  }

  // 近期赛程
  html += '<div class="mengchao-team-detail-matches">';
  html += '<div class="mengchao-detail-section-title">赛程</div>';
  teamMatches.forEach(function(m) {
    var isHome = m.home === teamName;
    html += '<div class="mengchao-team-match' + (m.finished ? ' mengchao-match-finished' : '') + '">';
    html += '<span class="mengchao-tm-round">第' + m.round + '轮</span>';
    html += '<span class="mengchao-tm-date">' + m.date + '</span>';
    html += '<span class="mengchao-tm-vs">' + m.home + (m.finished && m.homeScore !== null ? ' ' + m.homeScore + ':' + m.awayScore + ' ' : ' vs ') + m.away + '</span>';
    html += '<span class="mengchao-tm-tag">' + (isHome ? '主' : '客') + '</span>';
    html += '</div>';
  });
  html += '</div>';

  html += '</div>';

  var modal = $('#team-modal');
  var detail = $('#team-detail');
  if (modal && detail) {
    detail.innerHTML = html;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}
