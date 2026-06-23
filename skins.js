// ========== 皮肤系统 ==========
// 设计思路：标题栏用球队主色实色/渐变填充（醒目），tab栏深色（与标题区分），
// 内容区再深一层，卡片亮于背景，accent用于高亮元素
var SKINS = [
  {
    id: 'default',
    name: '默认',
    colors: ['#6366f1', '#232845', '#1a1f36'],
    vars: {
      '--primary': '#1a1f36',
      '--primary-light': '#252b48',
      '--secondary': '#2a3158',
      '--accent': '#6366f1',
      '--accent-light': '#818cf8',
      '--accent-rgb': '99, 102, 241',
      '--accent2': '#2a3158',
      '--card-bg': '#232845',
      '--card-border': '#363e66',
      '--header-bg': '#6366f1',
      '--header-text': '#ffffff',
      '--tab-bg': '#232845',
      '--tab-active-bg': 'rgba(99, 102, 241, 0.15)'
    }
  },
  {
    id: 'argentina',
    name: '阿根廷',
    colors: ['#75AADB', '#FFFFFF', '#75AADB'],
    vars: {
      '--primary': '#141e30',
      '--primary-light': '#1e2d4a',
      '--secondary': '#243656',
      '--accent': '#75AADB',
      '--accent-light': '#9CC5E8',
      '--accent-rgb': '117, 170, 219',
      '--accent2': '#243656',
      '--card-bg': '#1e2d4a',
      '--card-border': '#30486e',
      '--header-bg': 'linear-gradient(135deg, #75AADB 0%, #4A8BC2 100%)',
      '--header-text': '#ffffff',
      '--tab-bg': '#1e2d4a',
      '--tab-active-bg': 'rgba(117, 170, 219, 0.15)'
    }
  },
  {
    id: 'brazil',
    name: '巴西',
    colors: ['#FFDF00', '#009739', '#FFDF00'],
    vars: {
      '--primary': '#0f1f14',
      '--primary-light': '#1a3322',
      '--secondary': '#224430',
      '--accent': '#2ECC55',
      '--accent-light': '#50E070',
      '--accent-rgb': '46, 204, 85',
      '--accent2': '#224430',
      '--card-bg': '#1a3322',
      '--card-border': '#2e5a3a',
      '--header-bg': 'linear-gradient(135deg, #009739 0%, #006628 100%)',
      '--header-text': '#FFDF00',
      '--tab-bg': '#1a3322',
      '--tab-active-bg': 'rgba(46, 204, 85, 0.15)'
    }
  },
  {
    id: 'england',
    name: '英格兰',
    colors: ['#CF081F', '#FFFFFF', '#CF081F'],
    vars: {
      '--primary': '#1c1215',
      '--primary-light': '#2e1a1f',
      '--secondary': '#3e222a',
      '--accent': '#E8364B',
      '--accent-light': '#F06070',
      '--accent-rgb': '232, 54, 75',
      '--accent2': '#3e222a',
      '--card-bg': '#2e1a1f',
      '--card-border': '#4e3038',
      '--header-bg': 'linear-gradient(135deg, #CF081F 0%, #A00618 100%)',
      '--header-text': '#ffffff',
      '--tab-bg': '#2e1a1f',
      '--tab-active-bg': 'rgba(232, 54, 75, 0.15)'
    }
  },
  {
    id: 'france',
    name: '法国',
    colors: ['#002395', '#FFFFFF', '#ED2939'],
    vars: {
      '--primary': '#0e1428',
      '--primary-light': '#1a2040',
      '--secondary': '#242e58',
      '--accent': '#3355CC',
      '--accent-light': '#5577EE',
      '--accent-rgb': '51, 85, 204',
      '--accent2': '#242e58',
      '--card-bg': '#1a2040',
      '--card-border': '#304070',
      '--header-bg': 'linear-gradient(135deg, #002395 0%, #001A70 100%)',
      '--header-text': '#ffffff',
      '--tab-bg': '#1a2040',
      '--tab-active-bg': 'rgba(51, 85, 204, 0.15)'
    }
  },
  {
    id: 'germany',
    name: '德国',
    colors: ['#DD0000', '#000000', '#FFCE00'],
    vars: {
      '--primary': '#161616',
      '--primary-light': '#222222',
      '--secondary': '#2e2e2e',
      '--accent': '#DD0000',
      '--accent-light': '#FF3333',
      '--accent-rgb': '221, 0, 0',
      '--accent2': '#2e2e2e',
      '--card-bg': '#222222',
      '--card-border': '#3e3e3e',
      '--header-bg': 'linear-gradient(135deg, #DD0000 0%, #AA0000 100%)',
      '--header-text': '#FFCE00',
      '--tab-bg': '#222222',
      '--tab-active-bg': 'rgba(221, 0, 0, 0.15)'
    }
  },
  {
    id: 'spain',
    name: '西班牙',
    colors: ['#AA151B', '#F1BF00', '#AA151B'],
    vars: {
      '--primary': '#1c1212',
      '--primary-light': '#2e1a1a',
      '--secondary': '#3e2222',
      '--accent': '#CC3333',
      '--accent-light': '#EE5555',
      '--accent-rgb': '204, 51, 51',
      '--accent2': '#3e2222',
      '--card-bg': '#2e1a1a',
      '--card-border': '#4e3232',
      '--header-bg': 'linear-gradient(135deg, #AA151B 0%, #881015 100%)',
      '--header-text': '#F1BF00',
      '--tab-bg': '#2e1a1a',
      '--tab-active-bg': 'rgba(204, 51, 51, 0.15)'
    }
  },
  {
    id: 'italy',
    name: '意大利',
    colors: ['#009246', '#FFFFFF', '#CE2B37'],
    vars: {
      '--primary': '#0f1f14',
      '--primary-light': '#1a3322',
      '--secondary': '#224430',
      '--accent': '#22B566',
      '--accent-light': '#44DD88',
      '--accent-rgb': '34, 181, 102',
      '--accent2': '#224430',
      '--card-bg': '#1a3322',
      '--card-border': '#2e5a3a',
      '--header-bg': 'linear-gradient(135deg, #009246 0%, #006E34 100%)',
      '--header-text': '#ffffff',
      '--tab-bg': '#1a3322',
      '--tab-active-bg': 'rgba(34, 181, 102, 0.15)'
    }
  },
  {
    id: 'netherlands',
    name: '荷兰',
    colors: ['#FF6600', '#FFFFFF', '#FF6600'],
    vars: {
      '--primary': '#1c1510',
      '--primary-light': '#2e2418',
      '--secondary': '#3e3222',
      '--accent': '#FF8833',
      '--accent-light': '#FFAA66',
      '--accent-rgb': '255, 136, 51',
      '--accent2': '#3e3222',
      '--card-bg': '#2e2418',
      '--card-border': '#4e4430',
      '--header-bg': 'linear-gradient(135deg, #FF6600 0%, #CC5200 100%)',
      '--header-text': '#ffffff',
      '--tab-bg': '#2e2418',
      '--tab-active-bg': 'rgba(255, 136, 51, 0.15)'
    }
  },
  {
    id: 'portugal',
    name: '葡萄牙',
    colors: ['#006600', '#FF0000', '#006600'],
    vars: {
      '--primary': '#0f1f14',
      '--primary-light': '#1a3322',
      '--secondary': '#224430',
      '--accent': '#22AA22',
      '--accent-light': '#44CC44',
      '--accent-rgb': '34, 170, 34',
      '--accent2': '#224430',
      '--card-bg': '#1a3322',
      '--card-border': '#2e5a3a',
      '--header-bg': 'linear-gradient(135deg, #006600 0%, #004D00 100%)',
      '--header-text': '#ffffff',
      '--tab-bg': '#1a3322',
      '--tab-active-bg': 'rgba(34, 170, 34, 0.15)'
    }
  },
  {
    id: 'japan',
    name: '日本',
    colors: ['#BC002D', '#FFFFFF', '#000080'],
    vars: {
      '--primary': '#140e1a',
      '--primary-light': '#221a30',
      '--secondary': '#322640',
      '--accent': '#DD2255',
      '--accent-light': '#EE5577',
      '--accent-rgb': '221, 34, 85',
      '--accent2': '#322640',
      '--card-bg': '#221a30',
      '--card-border': '#3e3452',
      '--header-bg': 'linear-gradient(135deg, #BC002D 0%, #8E0022 100%)',
      '--header-text': '#ffffff',
      '--tab-bg': '#221a30',
      '--tab-active-bg': 'rgba(221, 34, 85, 0.15)'
    }
  },
  {
    id: 'korea',
    name: '韩国',
    colors: ['#CD2E3A', '#FFFFFF', '#003478'],
    vars: {
      '--primary': '#120e1a',
      '--primary-light': '#201a2e',
      '--secondary': '#302640',
      '--accent': '#E05060',
      '--accent-light': '#EE7888',
      '--accent-rgb': '224, 80, 96',
      '--accent2': '#302640',
      '--card-bg': '#201a2e',
      '--card-border': '#3e3458',
      '--header-bg': 'linear-gradient(135deg, #CD2E3A 0%, #A02230 100%)',
      '--header-text': '#ffffff',
      '--tab-bg': '#201a2e',
      '--tab-active-bg': 'rgba(224, 80, 96, 0.15)'
    }
  }
];

var CURRENT_SKIN = localStorage.getItem('wc_skin') || 'default';

function applySkin(skinId) {
  var skin = SKINS.find(function(s) { return s.id === skinId; });
  if (!skin) return;
  var root = document.documentElement;
  for (var key in skin.vars) {
    root.style.setProperty(key, skin.vars[key]);
  }
  // 标题栏特殊处理：支持渐变色
  var header = document.querySelector('.header');
  if (header) {
    var headerBg = skin.vars['--header-bg'];
    if (headerBg && headerBg.indexOf('gradient') !== -1) {
      header.style.background = headerBg;
    } else {
      header.style.background = headerBg;
    }
  }
  CURRENT_SKIN = skinId;
  localStorage.setItem('wc_skin', skinId);
  updateSkinItemActive();
}

function renderSkinList() {
  var list = document.getElementById('skin-list');
  if (!list) return;
  list.innerHTML = '';
  SKINS.forEach(function(skin) {
    var item = document.createElement('div');
    item.className = 'skin-item' + (skin.id === CURRENT_SKIN ? ' active' : '');
    item.dataset.skinId = skin.id;

    var colorsDiv = document.createElement('div');
    colorsDiv.className = 'skin-colors';
    skin.colors.forEach(function(c) {
      var bar = document.createElement('div');
      bar.className = 'skin-color-bar';
      bar.style.background = c;
      colorsDiv.appendChild(bar);
    });

    var nameDiv = document.createElement('div');
    nameDiv.className = 'skin-item-name';
    nameDiv.textContent = skin.name;

    item.appendChild(colorsDiv);
    item.appendChild(nameDiv);
    item.addEventListener('click', function() {
      applySkin(skin.id);
    });
    list.appendChild(item);
  });
}

function updateSkinItemActive() {
  var items = document.querySelectorAll('.skin-item');
  items.forEach(function(item) {
    if (item.dataset.skinId === CURRENT_SKIN) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function openSkinPanel() {
  var panel = document.getElementById('skin-panel');
  if (panel) {
    renderSkinList();
    panel.classList.add('open');
  }
}

function closeSkinPanel() {
  var panel = document.getElementById('skin-panel');
  if (panel) panel.classList.remove('open');
}

function initSkin() {
  var toggleBtn = document.getElementById('skin-toggle');
  if (toggleBtn) toggleBtn.addEventListener('click', openSkinPanel);

  var closeBtn = document.getElementById('skin-panel-close');
  if (closeBtn) closeBtn.addEventListener('click', closeSkinPanel);

  var panel = document.getElementById('skin-panel');
  if (panel) panel.addEventListener('click', function(e) {
    if (e.target === panel) closeSkinPanel();
  });

  // 恢复上次选择的皮肤
  if (CURRENT_SKIN !== 'default') {
    applySkin(CURRENT_SKIN);
  }
}

// DOM ready 后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSkin);
} else {
  initSkin();
}
