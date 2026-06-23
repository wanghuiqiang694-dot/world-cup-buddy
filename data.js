// 2026 美加墨世界杯 - 完整赛程数据
// 数据来源：FIFA 官方赛程 + ESPN 赛程验证
// 时间均为北京时间（UTC+8）

const FLAG_MAP = {
  '墨西哥': '🇲🇽', '南非': '🇿🇦', '韩国': '🇰🇷', '捷克': '🇨🇿',
  '加拿大': '🇨🇦', '波黑': '🇧🇦', '卡塔尔': '🇶🇦', '瑞士': '🇨🇭',
  '巴西': '🇧🇷', '摩洛哥': '🇲🇦', '海地': '🇭🇹', '苏格兰': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  '美国': '🇺🇸', '巴拉圭': '🇵🇾', '澳大利亚': '🇦🇺', '土耳其': '🇹🇷',
  '德国': '🇩🇪', '库拉索': '🇨🇼', '科特迪瓦': '🇨🇮', '厄瓜多尔': '🇪🇨',
  '荷兰': '🇳🇱', '日本': '🇯🇵', '瑞典': '🇸🇪', '突尼斯': '🇹🇳',
  '比利时': '🇧🇪', '埃及': '🇪🇬', '伊朗': '🇮🇷', '新西兰': '🇳🇿',
  '西班牙': '🇪🇸', '佛得角': '🇨🇻', '沙特阿拉伯': '🇸🇦', '乌拉圭': '🇺🇾',
  '法国': '🇫🇷', '塞内加尔': '🇸🇳', '伊拉克': '🇮🇶', '挪威': '🇳🇴',
  '阿根廷': '🇦🇷', '阿尔及利亚': '🇩🇿', '奥地利': '🇦🇹', '约旦': '🇯🇴',
  '葡萄牙': '🇵🇹', '民主刚果': '🇨🇩', '乌兹别克斯坦': '🇺🇿', '哥伦比亚': '🇨🇴',
  '英格兰': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '克罗地亚': '🇭🇷', '加纳': '🇬🇭', '巴拿马': '🇵🇦'
};

// 12 个小组
const GROUPS = {
  A: ['墨西哥', '南非', '韩国', '捷克'],
  B: ['加拿大', '波黑', '卡塔尔', '瑞士'],
  C: ['巴西', '摩洛哥', '海地', '苏格兰'],
  D: ['美国', '巴拉圭', '澳大利亚', '土耳其'],
  E: ['德国', '库拉索', '科特迪瓦', '厄瓜多尔'],
  F: ['荷兰', '日本', '瑞典', '突尼斯'],
  G: ['比利时', '埃及', '伊朗', '新西兰'],
  H: ['西班牙', '佛得角', '沙特阿拉伯', '乌拉圭'],
  I: ['法国', '塞内加尔', '伊拉克', '挪威'],
  J: ['阿根廷', '阿尔及利亚', '奥地利', '约旦'],
  K: ['葡萄牙', '民主刚果', '乌兹别克斯坦', '哥伦比亚'],
  L: ['英格兰', '克罗地亚', '加纳', '巴拿马']
};

// 小组赛赛程（北京时间，已核对 FIFA 官方赛程）
const MATCHES = [
  // ===== 第1轮 =====
  { id: 1,  group: 'A', round: 1, home: '墨西哥', away: '南非', date: '2026-06-12', time: '03:00', venue: '墨西哥城' },
  { id: 2,  group: 'A', round: 1, home: '韩国', away: '捷克', date: '2026-06-12', time: '10:00', venue: '瓜达拉哈拉' },
  { id: 3,  group: 'B', round: 1, home: '加拿大', away: '波黑', date: '2026-06-13', time: '03:00', venue: '多伦多' },
  { id: 5,  group: 'B', round: 1, home: '卡塔尔', away: '瑞士', date: '2026-06-14', time: '03:00', venue: '旧金山湾区' },
  { id: 4,  group: 'D', round: 1, home: '美国', away: '巴拉圭', date: '2026-06-13', time: '09:00', venue: '洛杉矶' },
  { id: 8,  group: 'D', round: 1, home: '澳大利亚', away: '土耳其', date: '2026-06-14', time: '12:00', venue: '温哥华' },
  { id: 6,  group: 'C', round: 1, home: '巴西', away: '摩洛哥', date: '2026-06-14', time: '06:00', venue: '纽约/新泽西' },
  { id: 7,  group: 'C', round: 1, home: '海地', away: '苏格兰', date: '2026-06-14', time: '09:00', venue: '波士顿' },
  { id: 9,  group: 'E', round: 1, home: '德国', away: '库拉索', date: '2026-06-15', time: '01:00', venue: '休斯敦' },
  { id: 11, group: 'E', round: 1, home: '科特迪瓦', away: '厄瓜多尔', date: '2026-06-15', time: '07:00', venue: '费城' },
  { id: 10, group: 'F', round: 1, home: '荷兰', away: '日本', date: '2026-06-15', time: '04:00', venue: '达拉斯' },
  { id: 12, group: 'F', round: 1, home: '瑞典', away: '突尼斯', date: '2026-06-15', time: '10:00', venue: '蒙特雷' },
  { id: 13, group: 'H', round: 1, home: '西班牙', away: '佛得角', date: '2026-06-16', time: '03:00', venue: '亚特兰大' },
  { id: 15, group: 'H', round: 1, home: '沙特阿拉伯', away: '乌拉圭', date: '2026-06-16', time: '06:00', venue: '迈阿密' },
  { id: 14, group: 'G', round: 1, home: '比利时', away: '埃及', date: '2026-06-16', time: '03:00', venue: '西雅图' },
  { id: 16, group: 'G', round: 1, home: '伊朗', away: '新西兰', date: '2026-06-16', time: '09:00', venue: '洛杉矶' },
  { id: 17, group: 'I', round: 1, home: '法国', away: '塞内加尔', date: '2026-06-17', time: '03:00', venue: '纽约/新泽西' },
  { id: 18, group: 'I', round: 1, home: '伊拉克', away: '挪威', date: '2026-06-17', time: '06:00', venue: '波士顿' },
  { id: 19, group: 'J', round: 1, home: '阿根廷', away: '阿尔及利亚', date: '2026-06-17', time: '09:00', venue: '堪萨斯城' },
  { id: 20, group: 'J', round: 1, home: '奥地利', away: '约旦', date: '2026-06-17', time: '06:00', venue: '旧金山湾区' },
  { id: 21, group: 'K', round: 1, home: '葡萄牙', away: '民主刚果', date: '2026-06-17', time: '01:00', venue: '休斯敦' },
  { id: 24, group: 'K', round: 1, home: '乌兹别克斯坦', away: '哥伦比亚', date: '2026-06-17', time: '09:00', venue: '墨西哥城' },
  { id: 22, group: 'L', round: 1, home: '英格兰', away: '克罗地亚', date: '2026-06-17', time: '04:00', venue: '达拉斯' },
  { id: 23, group: 'L', round: 1, home: '加纳', away: '巴拿马', date: '2026-06-17', time: '03:00', venue: '多伦多' },
  // ===== 第2轮 =====
  { id: 25, group: 'A', round: 2, home: '捷克', away: '南非', date: '2026-06-19', time: '00:00', venue: '亚特兰大' },
  { id: 28, group: 'A', round: 2, home: '墨西哥', away: '韩国', date: '2026-06-19', time: '09:00', venue: '瓜达拉哈拉' },
  { id: 26, group: 'B', round: 2, home: '瑞士', away: '波黑', date: '2026-06-19', time: '03:00', venue: '洛杉矶' },
  { id: 27, group: 'B', round: 2, home: '加拿大', away: '卡塔尔', date: '2026-06-19', time: '06:00', venue: '温哥华' },
  { id: 29, group: 'D', round: 2, home: '美国', away: '澳大利亚', date: '2026-06-20', time: '03:00', venue: '西雅图' },
  { id: 32, group: 'D', round: 2, home: '土耳其', away: '巴拉圭', date: '2026-06-20', time: '12:00', venue: '旧金山湾区' },
  { id: 30, group: 'C', round: 2, home: '苏格兰', away: '摩洛哥', date: '2026-06-20', time: '06:00', venue: '波士顿' },
  { id: 31, group: 'C', round: 2, home: '巴西', away: '海地', date: '2026-06-20', time: '09:00', venue: '费城' },
  { id: 33, group: 'F', round: 2, home: '荷兰', away: '瑞典', date: '2026-06-21', time: '01:00', venue: '休斯敦' },
  { id: 36, group: 'F', round: 2, home: '突尼斯', away: '日本', date: '2026-06-21', time: '12:00', venue: '蒙特雷' },
  { id: 34, group: 'E', round: 2, home: '德国', away: '科特迪瓦', date: '2026-06-21', time: '04:00', venue: '多伦多' },
  { id: 35, group: 'E', round: 2, home: '厄瓜多尔', away: '库拉索', date: '2026-06-21', time: '08:00', venue: '堪萨斯城' },
  { id: 37, group: 'H', round: 2, home: '西班牙', away: '沙特阿拉伯', date: '2026-06-22', time: '12:00', venue: '亚特兰大' },
  { id: 39, group: 'H', round: 2, home: '乌拉圭', away: '佛得角', date: '2026-06-22', time: '18:00', venue: '迈阿密' },
  { id: 38, group: 'G', round: 2, home: '比利时', away: '伊朗', date: '2026-06-22', time: '15:00', venue: '洛杉矶' },
  { id: 40, group: 'G', round: 2, home: '新西兰', away: '埃及', date: '2026-06-22', time: '21:00', venue: '温哥华' },
  { id: 41, group: 'J', round: 2, home: '阿根廷', away: '奥地利', date: '2026-06-23', time: '13:00', venue: '达拉斯' },
  { id: 44, group: 'J', round: 2, home: '约旦', away: '阿尔及利亚', date: '2026-06-23', time: '11:00', venue: '旧金山湾区' },
  { id: 42, group: 'I', round: 2, home: '法国', away: '伊拉克', date: '2026-06-23', time: '17:00', venue: '费城' },
  { id: 43, group: 'I', round: 2, home: '挪威', away: '塞内加尔', date: '2026-06-23', time: '20:00', venue: '纽约/新泽西' },
  { id: 45, group: 'K', round: 2, home: '葡萄牙', away: '乌兹别克斯坦', date: '2026-06-24', time: '01:00', venue: '休斯敦' },
  { id: 48, group: 'K', round: 2, home: '哥伦比亚', away: '民主刚果', date: '2026-06-24', time: '10:00', venue: '瓜达拉哈拉' },
  { id: 46, group: 'L', round: 2, home: '英格兰', away: '加纳', date: '2026-06-24', time: '04:00', venue: '波士顿' },
  { id: 47, group: 'L', round: 2, home: '巴拿马', away: '克罗地亚', date: '2026-06-24', time: '07:00', venue: '多伦多' },
  // ===== 第3轮 =====
  { id: 49, group: 'B', round: 3, home: '瑞士', away: '加拿大', date: '2026-06-25', time: '03:00', venue: '温哥华' },
  { id: 50, group: 'B', round: 3, home: '波黑', away: '卡塔尔', date: '2026-06-25', time: '03:00', venue: '西雅图' },
  { id: 51, group: 'C', round: 3, home: '苏格兰', away: '巴西', date: '2026-06-25', time: '06:00', venue: '迈阿密' },
  { id: 52, group: 'C', round: 3, home: '摩洛哥', away: '海地', date: '2026-06-25', time: '06:00', venue: '亚特兰大' },
  { id: 53, group: 'A', round: 3, home: '捷克', away: '墨西哥', date: '2026-06-25', time: '09:00', venue: '墨西哥城' },
  { id: 54, group: 'A', round: 3, home: '南非', away: '韩国', date: '2026-06-25', time: '09:00', venue: '蒙特雷' },
  { id: 55, group: 'E', round: 3, home: '库拉索', away: '科特迪瓦', date: '2026-06-26', time: '04:00', venue: '费城' },
  { id: 56, group: 'E', round: 3, home: '厄瓜多尔', away: '德国', date: '2026-06-26', time: '04:00', venue: '纽约/新泽西' },
  { id: 57, group: 'F', round: 3, home: '日本', away: '瑞典', date: '2026-06-26', time: '07:00', venue: '达拉斯' },
  { id: 58, group: 'F', round: 3, home: '突尼斯', away: '荷兰', date: '2026-06-26', time: '07:00', venue: '堪萨斯城' },
  { id: 59, group: 'D', round: 3, home: '土耳其', away: '美国', date: '2026-06-26', time: '10:00', venue: '洛杉矶' },
  { id: 60, group: 'D', round: 3, home: '巴拉圭', away: '澳大利亚', date: '2026-06-26', time: '10:00', venue: '旧金山湾区' },
  { id: 63, group: 'I', round: 3, home: '挪威', away: '法国', date: '2026-06-27', time: '03:00', venue: '波士顿' },
  { id: 64, group: 'I', round: 3, home: '塞内加尔', away: '伊拉克', date: '2026-06-27', time: '03:00', venue: '多伦多' },
  { id: 61, group: 'H', round: 3, home: '佛得角', away: '沙特阿拉伯', date: '2026-06-27', time: '08:00', venue: '休斯敦' },
  { id: 62, group: 'H', round: 3, home: '乌拉圭', away: '西班牙', date: '2026-06-27', time: '08:00', venue: '瓜达拉哈拉' },
  { id: 65, group: 'G', round: 3, home: '埃及', away: '伊朗', date: '2026-06-27', time: '11:00', venue: '西雅图' },
  { id: 66, group: 'G', round: 3, home: '新西兰', away: '比利时', date: '2026-06-27', time: '11:00', venue: '温哥华' },
  { id: 67, group: 'L', round: 3, home: '巴拿马', away: '英格兰', date: '2026-06-28', time: '05:00', venue: '纽约/新泽西' },
  { id: 68, group: 'L', round: 3, home: '克罗地亚', away: '加纳', date: '2026-06-28', time: '05:00', venue: '费城' },
  { id: 69, group: 'K', round: 3, home: '哥伦比亚', away: '葡萄牙', date: '2026-06-28', time: '07:30', venue: '迈阿密' },
  { id: 70, group: 'K', round: 3, home: '民主刚果', away: '乌兹别克斯坦', date: '2026-06-28', time: '07:30', venue: '亚特兰大' },
  { id: 71, group: 'J', round: 3, home: '阿尔及利亚', away: '奥地利', date: '2026-06-28', time: '10:00', venue: '堪萨斯城' },
  { id: 72, group: 'J', round: 3, home: '约旦', away: '阿根廷', date: '2026-06-28', time: '10:00', venue: '达拉斯' }
];

// 国家代码（ISO 3166-1 alpha-2），用于 flagcdn.com SVG 国旗
const COUNTRY_CODE = {
  '墨西哥': 'mx', '南非': 'za', '韩国': 'kr', '捷克': 'cz',
  '加拿大': 'ca', '波黑': 'ba', '卡塔尔': 'qa', '瑞士': 'ch',
  '巴西': 'br', '摩洛哥': 'ma', '海地': 'ht', '苏格兰': 'gb-sct',
  '美国': 'us', '巴拉圭': 'py', '澳大利亚': 'au', '土耳其': 'tr',
  '德国': 'de', '库拉索': 'cw', '科特迪瓦': 'ci', '厄瓜多尔': 'ec',
  '荷兰': 'nl', '日本': 'jp', '瑞典': 'se', '突尼斯': 'tn',
  '比利时': 'be', '埃及': 'eg', '伊朗': 'ir', '新西兰': 'nz',
  '西班牙': 'es', '佛得角': 'cv', '沙特阿拉伯': 'sa', '乌拉圭': 'uy',
  '法国': 'fr', '塞内加尔': 'sn', '伊拉克': 'iq', '挪威': 'no',
  '阿根廷': 'ar', '阿尔及利亚': 'dz', '奥地利': 'at', '约旦': 'jo',
  '葡萄牙': 'pt', '民主刚果': 'cd', '乌兹别克斯坦': 'uz', '哥伦比亚': 'co',
  '英格兰': 'gb-eng', '克罗地亚': 'hr', '加纳': 'gh', '巴拿马': 'pa'
};

// 球队历届世界杯战绩
const TEAM_HISTORY = {
  '阿根廷': {
    federation: 'CONMEBOL', coach: '斯卡洛尼', star: '梅西',
    titles: 3, appearances: 19, best: '冠军（1978、1986、2022）',
    recent: [
      { year: 2022, result: '冠军', round: '决赛胜法国' },
      { year: 2018, result: '16强', round: '负法国' },
      { year: 2014, result: '亚军', round: '决赛负德国' },
      { year: 2010, result: '8强', round: '负德国' }
    ]
  },
  '法国': {
    federation: 'UEFA', coach: '德尚', star: '姆巴佩',
    titles: 2, appearances: 16, best: '冠军（1998、2018）',
    recent: [
      { year: 2022, result: '亚军', round: '决赛负阿根廷' },
      { year: 2018, result: '冠军', round: '决赛胜克罗地亚' },
      { year: 2014, result: '8强', round: '负德国' },
      { year: 2010, result: '小组赛', round: 'A组第3' }
    ]
  },
  '巴西': {
    federation: 'CONMEBOL', coach: '安切洛蒂', star: '维尼修斯',
    titles: 5, appearances: 22, best: '冠军（1958、1962、1970、1994、2002）',
    recent: [
      { year: 2022, result: '8强', round: '负克罗地亚' },
      { year: 2018, result: '8强', round: '负比利时' },
      { year: 2014, result: '4强', round: '1-7负德国' },
      { year: 2010, result: '8强', round: '负荷兰' }
    ]
  },
  '英格兰': {
    federation: 'UEFA', coach: '图赫尔', star: '贝林厄姆',
    titles: 1, appearances: 16, best: '冠军（1966）',
    recent: [
      { year: 2022, result: '8强', round: '负法国' },
      { year: 2018, result: '4强', round: '负克罗地亚' },
      { year: 2014, result: '小组赛', round: 'D组垫底' },
      { year: 2010, result: '16强', round: '负德国' }
    ]
  },
  '西班牙': {
    federation: 'UEFA', coach: '德拉富恩特', star: '罗德里',
    titles: 1, appearances: 16, best: '冠军（2010）',
    recent: [
      { year: 2022, result: '16强', round: '负摩洛哥' },
      { year: 2018, result: '16强', round: '负俄罗斯' },
      { year: 2014, result: '小组赛', round: 'B组第3' },
      { year: 2010, result: '冠军', round: '决赛胜荷兰' }
    ]
  },
  '德国': {
    federation: 'UEFA', coach: '纳格尔斯曼', star: '穆西亚拉',
    titles: 4, appearances: 20, best: '冠军（1954、1974、1990、2014）',
    recent: [
      { year: 2022, result: '小组赛', round: 'E组第3' },
      { year: 2018, result: '小组赛', round: 'F组垫底' },
      { year: 2014, result: '冠军', round: '决赛胜阿根廷' },
      { year: 2010, result: '4强', round: '负西班牙' }
    ]
  },
  '葡萄牙': {
    federation: 'UEFA', coach: '马丁内斯', star: 'B席',
    titles: 0, appearances: 8, best: '4强（1966、2006）',
    recent: [
      { year: 2022, result: '8强', round: '负摩洛哥' },
      { year: 2018, result: '16强', round: '负乌拉圭' },
      { year: 2014, result: '小组赛', round: 'G组第3' },
      { year: 2010, result: '16强', round: '负西班牙' }
    ]
  },
  '荷兰': {
    federation: 'UEFA', coach: '科曼', star: '范戴克',
    titles: 0, appearances: 11, best: '亚军（1974、1978、2010）',
    recent: [
      { year: 2022, result: '8强', round: '负阿根廷' },
      { year: 2018, result: '未晋级', round: '-' },
      { year: 2014, result: '4强', round: '负阿根廷' },
      { year: 2010, result: '亚军', round: '决赛负西班牙' }
    ]
  },
  '比利时': {
    federation: 'UEFA', coach: '特德斯科', star: '德布劳内',
    titles: 0, appearances: 14, best: '4强（2018）',
    recent: [
      { year: 2022, result: '小组赛', round: 'F组第3' },
      { year: 2018, result: '4强', round: '负法国' },
      { year: 2014, result: '8强', round: '负阿根廷' },
      { year: 2010, result: '未晋级', round: '-' }
    ]
  },
  '克罗地亚': {
    federation: 'UEFA', coach: '达利奇', star: '莫德里奇',
    titles: 0, appearances: 6, best: '亚军（2018）',
    recent: [
      { year: 2022, result: '4强', round: '负阿根廷' },
      { year: 2018, result: '亚军', round: '决赛负法国' },
      { year: 2014, result: '小组赛', round: 'A组第3' },
      { year: 2010, result: '未晋级', round: '-' }
    ]
  },
  '美国': {
    federation: 'CONCACAF', coach: '波切蒂诺', star: '普利西奇',
    titles: 0, appearances: 11, best: '4强（1930）',
    recent: [
      { year: 2022, result: '16强', round: '负荷兰' },
      { year: 2018, result: '未晋级', round: '-' },
      { year: 2014, result: '16强', round: '负比利时' },
      { year: 2010, result: '16强', round: '负加纳' }
    ]
  },
  '墨西哥': {
    federation: 'CONCACAF', coach: '阿圭尔', star: '希门尼斯',
    titles: 0, appearances: 17, best: '8强（1970、1986）',
    recent: [
      { year: 2022, result: '小组赛', round: 'C组第3' },
      { year: 2018, result: '16强', round: '负巴西' },
      { year: 2014, result: '16强', round: '负荷兰' },
      { year: 2010, result: '16强', round: '负阿根廷' }
    ]
  },
  '瑞士': {
    federation: 'UEFA', coach: '雅金', star: '扎卡',
    titles: 0, appearances: 12, best: '8强（1934、1938、1954）',
    recent: [
      { year: 2022, result: '16强', round: '负葡萄牙' },
      { year: 2018, result: '16强', round: '负瑞典' },
      { year: 2014, result: '16强', round: '负阿根廷' },
      { year: 2010, result: '小组赛', round: 'H组第3' }
    ]
  },
  '乌拉圭': {
    federation: 'CONMEBOL', coach: '贝尔萨', star: '巴尔韦德',
    titles: 2, appearances: 14, best: '冠军（1930、1950）',
    recent: [
      { year: 2022, result: '小组赛', round: 'H组第3' },
      { year: 2018, result: '8强', round: '负法国' },
      { year: 2014, result: '16强', round: '负哥伦比亚' },
      { year: 2010, result: '4强', round: '负荷兰' }
    ]
  },
  '哥伦比亚': {
    federation: 'CONMEBOL', coach: '洛伦索', star: '迪亚斯',
    titles: 0, appearances: 6, best: '8强（2014）',
    recent: [
      { year: 2022, result: '未晋级', round: '-' },
      { year: 2018, result: '小组赛', round: 'H组垫底' },
      { year: 2014, result: '8强', round: '负巴西' },
      { year: 2010, result: '未晋级', round: '-' }
    ]
  },
  '日本': {
    federation: 'AFC', coach: '森保一', star: '三笘薰',
    titles: 0, appearances: 7, best: '16强（2002、2010、2018、2022）',
    recent: [
      { year: 2022, result: '16强', round: '负克罗地亚' },
      { year: 2018, result: '16强', round: '负比利时' },
      { year: 2014, result: '小组赛', round: 'C组垫底' },
      { year: 2010, result: '16强', round: '负巴拉圭' }
    ]
  },
  '摩洛哥': {
    federation: 'CAF', coach: '雷格拉吉', star: '阿什拉夫',
    titles: 0, appearances: 6, best: '4强（2022）',
    recent: [
      { year: 2022, result: '4强', round: '负法国' },
      { year: 2018, result: '小组赛', round: 'B组垫底' },
      { year: 2014, result: '未晋级', round: '-' },
      { year: 2010, result: '未晋级', round: '-' }
    ]
  },
  '韩国': {
    federation: 'AFC', coach: '洪明甫', star: '孙兴慜',
    titles: 0, appearances: 11, best: '4强（2002）',
    recent: [
      { year: 2022, result: '16强', round: '负巴西' },
      { year: 2018, result: '小组赛', round: 'F组垫底' },
      { year: 2014, result: '小组赛', round: 'H组垫底' },
      { year: 2010, result: '16强', round: '负乌拉圭' }
    ]
  },
  '澳大利亚': {
    federation: 'AFC', coach: '阿诺德', star: '库西尼',
    titles: 0, appearances: 6, best: '16强（2006、2022）',
    recent: [
      { year: 2022, result: '16强', round: '负阿根廷' },
      { year: 2018, result: '小组赛', round: 'C组垫底' },
      { year: 2014, result: '小组赛', round: 'B组垫底' },
      { year: 2010, result: '小组赛', round: 'D组垫底' }
    ]
  },
  '厄瓜多尔': {
    federation: 'CONMEBOL', coach: '贝卡切切', star: '瓦伦西亚',
    titles: 0, appearances: 4, best: '16强（2006）',
    recent: [
      { year: 2022, result: '小组赛', round: 'A组第3' },
      { year: 2018, result: '未晋级', round: '-' },
      { year: 2014, result: '小组赛', round: 'E组垫底' },
      { year: 2010, result: '未晋级', round: '-' }
    ]
  },
  '奥地利': {
    federation: 'UEFA', coach: '朗尼克', star: '萨比策',
    titles: 0, appearances: 7, best: '4强（1934、1954）',
    recent: [
      { year: 2022, result: '未晋级', round: '-' },
      { year: 2018, result: '未晋级', round: '-' },
      { year: 2014, result: '未晋级', round: '-' },
      { year: 2010, result: '未晋级', round: '-' }
    ]
  },
  '土耳其': {
    federation: 'UEFA', coach: '居内什', star: '恰尔汗奥卢',
    titles: 0, appearances: 2, best: '4强（2002）',
    recent: [
      { year: 2022, result: '未晋级', round: '-' },
      { year: 2018, result: '未晋级', round: '-' },
      { year: 2014, result: '未晋级', round: '-' },
      { year: 2010, result: '未晋级', round: '-' }
    ]
  },
  '瑞典': {
    federation: 'UEFA', coach: '托姆森', star: '伊萨克',
    titles: 0, appearances: 12, best: '亚军（1958）',
    recent: [
      { year: 2022, result: '未晋级', round: '-' },
      { year: 2018, result: '8强', round: '负英格兰' },
      { year: 2014, result: '未晋级', round: '-' },
      { year: 2010, result: '未晋级', round: '-' }
    ]
  },
  '苏格兰': {
    federation: 'UEFA', coach: '克拉克', star: '罗伯逊',
    titles: 0, appearances: 8, best: '小组赛（多次）',
    recent: [
      { year: 2022, result: '未晋级', round: '-' },
      { year: 2018, result: '未晋级', round: '-' },
      { year: 2014, result: '未晋级', round: '-' },
      { year: 2010, result: '未晋级', round: '-' }
    ]
  },
  '加纳': {
    federation: 'CAF', coach: '阿多', star: '库杜斯',
    titles: 0, appearances: 4, best: '8强（2010）',
    recent: [
      { year: 2022, result: '小组赛', round: 'H组垫底' },
      { year: 2018, result: '未晋级', round: '-' },
      { year: 2014, result: '小组赛', round: 'G组垫底' },
      { year: 2010, result: '8强', round: '负乌拉圭' }
    ]
  },
  '科特迪瓦': {
    federation: 'CAF', coach: '法耶', star: '佩佩',
    titles: 0, appearances: 3, best: '小组赛（2006、2010、2014）',
    recent: [
      { year: 2022, result: '未晋级', round: '-' },
      { year: 2018, result: '未晋级', round: '-' },
      { year: 2014, result: '小组赛', round: 'C组第3' },
      { year: 2010, result: '小组赛', round: 'G组第3' }
    ]
  },
  '埃及': {
    federation: 'CAF', coach: '加里卡', star: '萨拉赫',
    titles: 0, appearances: 3, best: '小组赛（1990、2018、2022）',
    recent: [
      { year: 2022, result: '小组赛', round: 'A组垫底' },
      { year: 2018, result: '小组赛', round: 'A组垫底' },
      { year: 2014, result: '未晋级', round: '-' },
      { year: 2010, result: '未晋级', round: '-' }
    ]
  },
  '巴拉圭': {
    federation: 'CONMEBOL', coach: '阿尔法罗', star: '阿尔米隆',
    titles: 0, appearances: 10, best: '8强（2010）',
    recent: [
      { year: 2022, result: '未晋级', round: '-' },
      { year: 2018, result: '未晋级', round: '-' },
      { year: 2014, result: '未晋级', round: '-' },
      { year: 2010, result: '8强', round: '负西班牙' }
    ]
  },
  '卡塔尔': {
    federation: 'AFC', coach: '洛佩斯', star: '阿费夫',
    titles: 0, appearances: 1, best: '小组赛（2022）',
    recent: [
      { year: 2022, result: '小组赛', round: 'A组垫底' },
      { year: 2018, result: '未晋级', round: '-' },
      { year: 2014, result: '未晋级', round: '-' },
      { year: 2010, result: '未晋级', round: '-' }
    ]
  },
  '沙特阿拉伯': {
    federation: 'AFC', coach: '雷纳德', star: '达瓦萨里',
    titles: 0, appearances: 6, best: '16强（1994）',
    recent: [
      { year: 2022, result: '小组赛', round: 'C组垫底' },
      { year: 2018, result: '小组赛', round: 'A组垫底' },
      { year: 2014, result: '未晋级', round: '-' },
      { year: 2010, result: '未晋级', round: '-' }
    ]
  },
  '伊朗': {
    federation: 'AFC', coach: '加勒诺埃', star: '塔雷米',
    titles: 0, appearances: 6, best: '小组赛（多次）',
    recent: [
      { year: 2022, result: '小组赛', round: 'B组第3' },
      { year: 2018, result: '小组赛', round: 'B组第3' },
      { year: 2014, result: '小组赛', round: 'F组垫底' },
      { year: 2010, result: '未晋级', round: '-' }
    ]
  },
  '挪威': {
    federation: 'UEFA', coach: '索尔巴肯', star: '哈兰德',
    titles: 0, appearances: 3, best: '16强（1998）',
    recent: [
      { year: 2022, result: '未晋级', round: '-' },
      { year: 2018, result: '未晋级', round: '-' },
      { year: 2014, result: '未晋级', round: '-' },
      { year: 2010, result: '未晋级', round: '-' }
    ]
  },
  '塞内加尔': {
    federation: 'CAF', coach: '西塞', star: '马内',
    titles: 0, appearances: 3, best: '8强（2002）',
    recent: [
      { year: 2022, result: '16强', round: '负英格兰' },
      { year: 2018, result: '小组赛', round: 'H组垫底' },
      { year: 2014, result: '未晋级', round: '-' },
      { year: 2010, result: '未晋级', round: '-' }
    ]
  },
  '阿尔及利亚': {
    federation: 'CAF', coach: '佩尔科维奇', star: '马赫雷斯',
    titles: 0, appearances: 4, best: '16强（2014）',
    recent: [
      { year: 2022, result: '未晋级', round: '-' },
      { year: 2018, result: '小组赛', round: 'C组垫底' },
      { year: 2014, result: '16强', round: '负德国' },
      { year: 2010, result: '未晋级', round: '-' }
    ]
  },
  '捷克': {
    federation: 'UEFA', coach: '希尔哈维', star: '希克',
    titles: 0, appearances: 1, best: '亚军（1934，作为捷克斯洛伐克2次亚军）',
    recent: [
      { year: 2022, result: '未晋级', round: '-' },
      { year: 2018, result: '未晋级', round: '-' },
      { year: 2014, result: '未晋级', round: '-' },
      { year: 2010, result: '未晋级', round: '-' }
    ]
  },
  '波黑': {
    federation: 'UEFA', coach: '巴耶维奇', star: '皮亚尼奇',
    titles: 0, appearances: 1, best: '小组赛（2014）',
    recent: [
      { year: 2022, result: '未晋级', round: '-' },
      { year: 2018, result: '未晋级', round: '-' },
      { year: 2014, result: '小组赛', round: 'F组第3' },
      { year: 2010, result: '未晋级', round: '-' }
    ]
  },
  '突尼斯': {
    federation: 'CAF', coach: '卡德里', star: '哈兹里',
    titles: 0, appearances: 6, best: '小组赛（多次）',
    recent: [
      { year: 2022, result: '小组赛', round: 'D组第3' },
      { year: 2018, result: '小组赛', round: 'G组垫底' },
      { year: 2014, result: '未晋级', round: '-' },
      { year: 2010, result: '未晋级', round: '-' }
    ]
  },
  '巴拿马': {
    federation: 'CONCACAF', coach: '克里斯蒂森', star: '托雷斯',
    titles: 0, appearances: 1, best: '小组赛（2018）',
    recent: [
      { year: 2022, result: '未晋级', round: '-' },
      { year: 2018, result: '小组赛', round: 'G组垫底' },
      { year: 2014, result: '未晋级', round: '-' },
      { year: 2010, result: '未晋级', round: '-' }
    ]
  },
  '新西兰': {
    federation: 'OFC', coach: '巴泽利', star: '伍德',
    titles: 0, appearances: 2, best: '小组赛（2010）',
    recent: [
      { year: 2022, result: '未晋级', round: '-' },
      { year: 2018, result: '未晋级', round: '-' },
      { year: 2014, result: '未晋级', round: '-' },
      { year: 2010, result: '小组赛', round: 'F组第3' }
    ]
  },
  '伊拉克': {
    federation: 'AFC', coach: '卡萨斯', star: '侯赛因',
    titles: 0, appearances: 1, best: '小组赛（1986）',
    recent: [
      { year: 2022, result: '未晋级', round: '-' },
      { year: 2018, result: '未晋级', round: '-' },
      { year: 2014, result: '未晋级', round: '-' },
      { year: 2010, result: '未晋级', round: '-' }
    ]
  },
  '约旦': {
    federation: 'AFC', coach: '阿穆塔', star: '塔马里',
    titles: 0, appearances: 0, best: '首次参赛',
    recent: []
  },
  '乌兹别克斯坦': {
    federation: 'AFC', coach: '卡塔内茨', star: '肖穆罗多夫',
    titles: 0, appearances: 0, best: '首次参赛',
    recent: []
  },
  '佛得角': {
    federation: 'CAF', coach: '布比斯塔', star: '门德斯',
    titles: 0, appearances: 0, best: '首次参赛',
    recent: []
  },
  '民主刚果': {
    federation: 'CAF', coach: '恩塞卡', star: '巴坎布',
    titles: 0, appearances: 1, best: '小组赛（1974，作为扎伊尔）',
    recent: [
      { year: 2022, result: '未晋级', round: '-' },
      { year: 2018, result: '未晋级', round: '-' },
      { year: 2014, result: '未晋级', round: '-' },
      { year: 2010, result: '未晋级', round: '-' }
    ]
  },
  '库拉索': {
    federation: 'CONCACAF', coach: '比兹', star: '巴库纳',
    titles: 0, appearances: 0, best: '首次参赛',
    recent: []
  },
  '海地': {
    federation: 'CONCACAF', coach: '加西亚', star: '内斯里',
    titles: 0, appearances: 1, best: '小组赛（1974）',
    recent: [
      { year: 2022, result: '未晋级', round: '-' },
      { year: 2018, result: '未晋级', round: '-' },
      { year: 2014, result: '未晋级', round: '-' },
      { year: 2010, result: '未晋级', round: '-' }
    ]
  }
};

// 淘汰赛对阵结构
const KNOCKOUT_BRACKET = {
  top: [
    { round: 'r32', label: '1/16决赛', games: [
      { id: 'R32-1', pos1: 'A1', pos2: '3rd-A', date: '2026-06-28', time: '03:00', venue: '费城' },
      { id: 'R32-2', pos1: 'B1', pos2: '3rd-B', date: '2026-06-28', time: '06:00', venue: '西雅图' },
      { id: 'R32-3', pos1: 'C1', pos2: '3rd-C', date: '2026-06-28', time: '09:00', venue: '波士顿' },
      { id: 'R32-4', pos1: 'D1', pos2: '3rd-D', date: '2026-06-29', time: '03:00', venue: '达拉斯' },
      { id: 'R32-5', pos1: 'A2', pos2: 'B2', date: '2026-06-29', time: '06:00', venue: '休斯敦' },
      { id: 'R32-6', pos1: 'C2', pos2: 'D2', date: '2026-06-29', time: '09:00', venue: '亚特兰大' },
      { id: 'R32-7', pos1: 'E1', pos2: '3rd-E', date: '2026-06-30', time: '03:00', venue: '纽约/新泽西' },
      { id: 'R32-8', pos1: 'F1', pos2: '3rd-F', date: '2026-06-30', time: '06:00', venue: '洛杉矶' }
    ]},
    { round: 'r16', label: '1/8决赛', games: [
      { id: 'R16-1', pos1: 'R32-1', pos2: 'R32-2', date: '2026-07-04', time: '03:00', venue: '纽约/新泽西' },
      { id: 'R16-2', pos1: 'R32-3', pos2: 'R32-4', date: '2026-07-04', time: '09:00', venue: '达拉斯' },
      { id: 'R16-3', pos1: 'R32-5', pos2: 'R32-6', date: '2026-07-05', time: '03:00', venue: '费城' },
      { id: 'R16-4', pos1: 'R32-7', pos2: 'R32-8', date: '2026-07-05', time: '09:00', venue: '休斯敦' }
    ]},
    { round: 'qf', label: '1/4决赛', games: [
      { id: 'QF-1', pos1: 'R16-1', pos2: 'R16-2', date: '2026-07-10', time: '03:00', venue: '洛杉矶' },
      { id: 'QF-2', pos1: 'R16-3', pos2: 'R16-4', date: '2026-07-10', time: '09:00', venue: '迈阿密' }
    ]},
    { round: 'sf', label: '半决赛', games: [
      { id: 'SF-1', pos1: 'QF-1', pos2: 'QF-2', date: '2026-07-15', time: '03:00', venue: '达拉斯' }
    ]}
  ],
  bottom: [
    { round: 'r32', label: '1/16决赛', games: [
      { id: 'R32-9',  pos1: 'G1', pos2: '3rd-G', date: '2026-07-01', time: '03:00', venue: '蒙特雷' },
      { id: 'R32-10', pos1: 'H1', pos2: '3rd-H', date: '2026-07-01', time: '06:00', venue: '瓜达拉哈拉' },
      { id: 'R32-11', pos1: 'I1', pos2: '3rd-I', date: '2026-07-01', time: '09:00', venue: '堪萨斯城' },
      { id: 'R32-12', pos1: 'J1', pos2: '3rd-J', date: '2026-07-02', time: '03:00', venue: '亚特兰大' },
      { id: 'R32-13', pos1: 'K1', pos2: '3rd-K', date: '2026-07-02', time: '06:00', venue: '波士顿' },
      { id: 'R32-14', pos1: 'L1', pos2: '3rd-L', date: '2026-07-02', time: '09:00', venue: '旧金山湾区' },
      { id: 'R32-15', pos1: 'G2', pos2: 'H2', date: '2026-07-03', time: '03:00', venue: '西雅图' },
      { id: 'R32-16', pos1: 'E2', pos2: 'F2', date: '2026-07-03', time: '06:00', venue: '温哥华' }
    ]},
    { round: 'r16', label: '1/8决赛', games: [
      { id: 'R16-5', pos1: 'R32-9',  pos2: 'R32-10', date: '2026-07-06', time: '03:00', venue: '蒙特雷' },
      { id: 'R16-6', pos1: 'R32-11', pos2: 'R32-12', date: '2026-07-06', time: '09:00', venue: '堪萨斯城' },
      { id: 'R16-7', pos1: 'R32-13', pos2: 'R32-14', date: '2026-07-07', time: '03:00', venue: '波士顿' },
      { id: 'R16-8', pos1: 'R32-15', pos2: 'R32-16', date: '2026-07-07', time: '09:00', venue: '温哥华' }
    ]},
    { round: 'qf', label: '1/4决赛', games: [
      { id: 'QF-3', pos1: 'R16-5', pos2: 'R16-6', date: '2026-07-11', time: '03:00', venue: '瓜达拉哈拉' },
      { id: 'QF-4', pos1: 'R16-7', pos2: 'R16-8', date: '2026-07-12', time: '03:00', venue: '纽约/新泽西' }
    ]},
    { round: 'sf', label: '半决赛', games: [
      { id: 'SF-2', pos1: 'QF-3', pos2: 'QF-4', date: '2026-07-16', time: '03:00', venue: '亚特兰大' }
    ]}
  ],
  final: [
    { round: '3rd', label: '季军赛', games: [
      { id: '3RD', pos1: 'SF-1L', pos2: 'SF-2L', date: '2026-07-19', time: '03:00', venue: '迈阿密' }
    ]},
    { round: 'final', label: '决赛', games: [
      { id: 'FINAL', pos1: 'SF-1', pos2: 'SF-2', date: '2026-07-20', time: '03:00', venue: '纽约/新泽西' }
    ]}
  ]
};

const MATCH_RESULTS = {
  // ===== 第1轮（6/12 - 6/17，已全部结束）=====
  1:  { score: '2:0', events: '墨西哥完胜南非' },
  2:  { score: '2:1', events: '韩国力克捷克' },
  3:  { score: '1:1', events: '加拿大战平波黑' },
  4:  { score: '4:1', events: '美国大胜巴拉圭' },
  5:  { score: '1:1', events: '卡塔尔战平瑞士' },
  6:  { score: '1:1', events: '巴西战平摩洛哥' },
  7:  { score: '0:1', events: '苏格兰小胜海地' },
  8:  { score: '2:0', events: '澳大利亚完胜土耳其' },
  9:  { score: '7:1', events: '德国大胜库拉索' },
  10: { score: '2:2', events: '荷兰战平日本' },
  11: { score: '1:0', events: '科特迪瓦小胜厄瓜多尔' },
  12: { score: '5:1', events: '瑞典大胜突尼斯' },
  13: { score: '0:0', events: '西班牙闷平佛得角' },
  14: { score: '1:1', events: '比利时战平埃及' },
  15: { score: '1:1', events: '沙特战平乌拉圭' },
  16: { score: '2:2', events: '伊朗战平新西兰' },
  17: { score: '3:1', events: '法国胜塞内加尔' },
  18: { score: '1:4', events: '挪威大胜伊拉克' },
  19: { score: '3:0', events: '阿根廷完胜阿尔及利亚' },
  20: { score: '3:1', events: '奥地利胜约旦' },
  21: { score: '1:1', events: '葡萄牙战平民主刚果' },
  22: { score: '4:2', events: '英格兰胜克罗地亚' },
  23: { score: '1:0', events: '加纳小胜巴拿马' },
  24: { score: '1:3', events: '哥伦比亚胜乌兹别克斯坦' },
  // ===== 第2轮（6/19 - 6/23，已结束场次）=====
  25: { score: '1:1', events: '捷克战平南非' },
  26: { score: '4:1', events: '瑞士大胜波黑' },
  27: { score: '6:0', events: '加拿大狂胜卡塔尔' },
  28: { score: '1:0', events: '墨西哥小胜韩国' },
  29: { score: '2:0', events: '美国完胜澳大利亚' },
  30: { score: '0:1', events: '摩洛哥小胜苏格兰' },
  31: { score: '3:0', events: '巴西完胜海地' },
  32: { score: '0:1', events: '巴拉圭小胜土耳其' },
  33: { score: '5:1', events: '荷兰大胜瑞典' },
  34: { score: '2:1', events: '德国力克科特迪瓦' },
  35: { score: '0:0', events: '厄瓜多尔闷平库拉索' },
  36: { score: '0:4', events: '日本大胜突尼斯' },
  37: { score: '4:0', events: '西班牙大胜沙特' },
  38: { score: '0:0', events: '比利时闷平伊朗' },
  39: { score: '2:2', events: '乌拉圭战平佛得角' },
  40: { score: '1:3', events: '埃及胜新西兰' },
  41: { score: '2:0', events: '阿根廷完胜奥地利' },
  42: { score: '3:0', events: '法国完胜伊拉克' },
  43: { score: '3:2', events: '挪威险胜塞内加尔' },
  44: { score: '1:2', events: '阿尔及利亚胜约旦' }
};

// 球员数据 - 增强: 身价(value/万欧)、身高(height/cm)、惯用脚(foot)、荣誉(honors)
const PLAYER_DATA = {
  '阿根廷': {
    active: [
      { name: '梅西', en: 'Lionel Messi', pos: '前锋', num: 10, goals: 5, assists: 0, club: '迈阿密国际', age: 38, caps: 190, value: 2500, height: 170, foot: '左脚', bio: '8次金球奖得主，2022世界杯冠军队长，足球史上最伟大的球员之一。', honors: ['8次金球奖','2022世界杯冠军','4次欧冠冠军','2021美洲杯冠军'] },
      { name: '阿尔瓦雷斯', en: 'Julian Alvarez', pos: '前锋', num: 9, goals: 0, assists: 1, club: '马德里竞技', age: 25, caps: 58, value: 9000, height: 170, foot: '右脚', bio: '2022世界杯夺冠功臣，绰号"蜘蛛"，高效射手。', honors: ['2022世界杯冠军','2023欧冠冠军'] },
      { name: '阿尔马达', en: 'Thiago Almada', pos: '中场', num: 8, goals: 0, assists: 1, club: '里昂', age: 25, caps: 18, value: 3000, height: 171, foot: '左脚', bio: '技术型中场，传球视野出色，阿根廷新生代核心。', honors: ['2022世界杯冠军'] },
      { name: '帕雷德斯', en: 'Leandro Paredes', pos: '中场', num: 5, goals: 0, assists: 1, club: '罗马', age: 30, caps: 68, value: 800, height: 180, foot: '右脚', bio: '防守型中场，长传精准，2022世界杯主力。', honors: ['2022世界杯冠军','2021美洲杯冠军'] },
      { name: '马丁内斯', en: 'Emiliano Martinez', pos: '门将', num: 23, goals: 0, assists: 0, club: '阿斯顿维拉', age: 32, caps: 55, value: 2800, height: 195, foot: '右脚', bio: '2022世界杯金手套奖，点球大战专家，阿根廷后防定海神针。', honors: ['2022世界杯金手套','2022世界杯冠军','2次雅辛奖'] }
    ],
    legend: [
      { name: '马拉多纳', en: 'Diego Maradona', pos: '前锋', num: 10, era: '1977-1994', caps: 91, goals: 34, bio: '1986世界杯冠军+金球奖，"上帝之手"与"世纪进球"缔造者，阿根廷永恒的足球之神。', honors: ['1986世界杯冠军+金球奖','1986世界杯金靴','2次意甲冠军'] },
      { name: '巴蒂斯图塔', en: 'Gabriel Batistuta', pos: '前锋', num: 9, era: '1991-2002', caps: 78, goals: 56, bio: '绰号"战神"，阿根廷历史最佳射手之一，远射力量惊人。', honors: ['2次美洲杯冠军','1991美洲杯金靴','佛罗伦萨传奇'] }
    ]
  },
  '法国': {
    active: [
      { name: '姆巴佩', en: 'Kylian Mbappe', pos: '前锋', num: 10, goals: 4, assists: 0, club: '皇家马德里', age: 27, caps: 90, value: 18000, height: 178, foot: '右脚', bio: '2018世界杯冠军+最佳新秀，2022决赛帽子戏法，当今足坛速度之王。', honors: ['2018世界杯冠军','2022世界杯金靴','1次欧冠冠军','6次法甲冠军'] },
      { name: '登贝莱', en: 'Ousmane Dembele', pos: '前锋', num: 11, goals: 1, assists: 2, club: '巴黎圣日耳曼', age: 29, caps: 56, value: 5000, height: 178, foot: '左脚', bio: '突破能力极强，左右脚均衡，法国边路利器。', honors: ['2018世界杯冠军','2次西甲冠军'] },
      { name: '奥利塞', en: 'Michael Olise', pos: '中场', num: 7, goals: 0, assists: 2, club: '拜仁慕尼黑', age: 24, caps: 15, value: 6000, height: 184, foot: '左脚', bio: '法国新晋国脚，技术细腻，创造力十足的中场。', honors: ['2024奥运会银牌'] },
      { name: '图拉姆', en: 'Marcus Thuram', pos: '前锋', num: 15, goals: 1, assists: 0, club: '国际米兰', age: 27, caps: 32, value: 4500, height: 192, foot: '右脚', bio: '法国名宿图拉姆之子，意甲冠军前锋。', honors: ['2022世界杯亚军','2024意甲冠军'] },
      { name: '萨利巴', en: 'William Saliba', pos: '后卫', num: 4, goals: 0, assists: 0, club: '阿森纳', age: 24, caps: 28, value: 8000, height: 192, foot: '右脚', bio: '法甲最顶级中卫，防空与出球能力俱佳。', honors: ['2022世界杯亚军'] }
    ],
    legend: [
      { name: '齐达内', en: 'Zinedine Zidane', pos: '中场', num: 10, era: '1994-2006', caps: 108, goals: 31, bio: '1998世界杯冠军+金球奖，优雅的艺术足球大师，3次世界足球先生。', honors: ['1998世界杯冠军','3次世界足球先生','1次欧冠冠军','2次意甲冠军'] },
      { name: '亨利', en: 'Thierry Henry', pos: '前锋', num: 12, era: '1997-2008', caps: 123, goals: 51, bio: '法国历史最佳射手，阿森纳传奇，1998世界杯+2000欧洲杯冠军成员。', honors: ['1998世界杯冠军','2000欧洲杯冠军','2次英超冠军','4次英超金靴'] }
    ]
  },
  '挪威': {
    active: [
      { name: '哈兰德', en: 'Erling Haaland', pos: '前锋', num: 9, goals: 4, assists: 0, club: '曼城', age: 25, caps: 40, value: 20000, height: 194, foot: '左脚', bio: '英超金靴，进球机器，身体素质与射术的完美结合。', honors: ['2次英超金靴','1次欧冠冠军','2023 FIFA最佳','2020欧洲金童奖'] },
      { name: '厄斯蒂高', en: 'Leo Ostigard', pos: '后卫', num: 4, goals: 1, assists: 0, club: '雷恩', age: 25, caps: 32, value: 800, height: 185, foot: '右脚', bio: '挪威后防核心，身体对抗出色。', honors: [] },
      { name: '索尔茨维特', en: 'Sander Berge', pos: '中场', num: 8, goals: 0, assists: 1, club: '富勒姆', age: 27, caps: 50, value: 1200, height: 195, foot: '右脚', bio: '中场屏障，传球稳定，挪威中场发动机。', honors: [] }
    ],
    legend: []
  },
  '德国': {
    active: [
      { name: '翁达夫', en: 'Deniz Undav', pos: '前锋', num: 13, goals: 3, assists: 2, club: '斯图加特', age: 28, caps: 18, value: 2500, height: 180, foot: '右脚', bio: '高效射手，德甲赛季最佳射手候选人。', honors: [] },
      { name: '基米希', en: 'Joshua Kimmich', pos: '中场', num: 6, goals: 0, assists: 2, club: '拜仁慕尼黑', age: 30, caps: 98, value: 5000, height: 176, foot: '右脚', bio: '德国队魂，攻守兼备的全能中场，领袖气质。', honors: ['1次欧冠冠军','8次德甲冠军','2017联合会杯冠军'] },
      { name: '穆西亚拉', en: 'Jamal Musiala', pos: '中场', num: 10, goals: 1, assists: 1, club: '拜仁慕尼黑', age: 22, caps: 40, value: 13000, height: 183, foot: '左脚', bio: '德国天才少年，盘带技术世界顶级，被誉为"新梅西"。', honors: ['2022金童奖','4次德甲冠军','2024欧洲杯最佳年轻球员'] },
      { name: '维尔茨', en: 'Florian Wirtz', pos: '中场', num: 17, goals: 1, assists: 0, club: '勒沃库森', age: 22, caps: 25, value: 14000, height: 176, foot: '右脚', bio: '德甲最年轻的创造型中场，传球与射门俱佳。', honors: ['2024德甲冠军','2023德甲MVP'] }
    ],
    legend: [
      { name: '克洛泽', en: 'Miroslav Klose', pos: '前锋', num: 11, era: '2001-2014', caps: 137, goals: 71, bio: '世界杯历史最佳射手16球，2014世界杯冠军，空翻庆祝传奇。', honors: ['2014世界杯冠军','世界杯历史最佳射手16球','3次德甲冠军'] },
      { name: '贝肯鲍尔', en: 'Franz Beckenbauer', pos: '后卫', num: 5, era: '1965-1977', caps: 103, goals: 14, bio: '"足球皇帝"，自由人位置开创者，1974世界杯冠军队长。', honors: ['1974世界杯冠军','2次金球奖','3次欧冠冠军','1972欧洲杯冠军'] }
    ]
  },
  '巴西': {
    active: [
      { name: '维尼修斯', en: 'Vinicius Junior', pos: '前锋', num: 7, goals: 2, assists: 1, club: '皇家马德里', age: 25, caps: 40, value: 20000, height: 176, foot: '右脚', bio: '2024金球奖候选，突破与速度顶级，皇马主力边锋。', honors: ['2次欧冠冠军','2024FIFA最佳','4次西甲冠军'] },
      { name: '罗德里戈', en: 'Rodrygo', pos: '前锋', num: 11, goals: 1, assists: 1, club: '皇家马德里', age: 25, caps: 30, value: 11000, height: 174, foot: '右脚', bio: '大场面球员，欧冠关键先生，技术全面。', honors: ['2次欧冠冠军','4次西甲冠军'] },
      { name: '帕奎塔', en: 'Lucas Paqueta', pos: '中场', num: 8, goals: 1, assists: 0, club: '西汉姆联', age: 27, caps: 52, value: 3500, height: 180, foot: '右脚', bio: '巴西中场核心，传球与控球能力出色。', honors: ['2019美洲杯冠军'] }
    ],
    legend: [
      { name: '贝利', en: 'Pele', pos: '前锋', num: 10, era: '1957-1971', caps: 92, goals: 77, bio: '3次世界杯冠军(1958/1962/1970)，"球王"，足球史上最伟大的球员。', honors: ['3次世界杯冠军','2次南美解放者杯','1281粒进球','FIFA世纪最佳球员'] },
      { name: '罗纳尔多', en: 'Ronaldo', pos: '前锋', num: 9, era: '1994-2011', caps: 98, goals: 62, bio: '"外星人"，2次世界杯冠军，2002世界杯金靴8球，史上最恐怖的射手。', honors: ['2次世界杯冠军','3次FIFA最佳球员','2次金球奖','2002世界杯金靴'] },
      { name: '罗纳尔迪尼奥', en: 'Ronaldinho', pos: '前锋', num: 10, era: '1999-2013', caps: 97, goals: 33, bio: '"足球精灵"，2002世界杯冠军，2005金球奖，球场上最快乐的魔术师。', honors: ['2002世界杯冠军','2005金球奖','1次欧冠冠军','2次西甲冠军'] }
    ]
  },
  '英格兰': {
    active: [
      { name: '凯恩', en: 'Harry Kane', pos: '前锋', num: 9, goals: 2, assists: 1, club: '拜仁慕尼黑', age: 32, caps: 105, value: 5000, height: 188, foot: '右脚', bio: '英格兰历史最佳射手，顶级中锋，射术全面。', honors: ['3次英超金靴','2018世界杯金靴','2024德甲冠军'] },
      { name: '贝林厄姆', en: 'Jude Bellingham', pos: '中场', num: 22, goals: 1, assists: 1, club: '皇家马德里', age: 22, caps: 42, value: 15000, height: 186, foot: '右脚', bio: '英格兰天才中场，2024金球奖候选，攻守兼备。', honors: ['1次欧冠冠军','2023金童奖','2024西甲冠军'] },
      { name: '萨卡', en: 'Bukayo Saka', pos: '前锋', num: 7, goals: 1, assists: 0, club: '阿森纳', age: 23, caps: 42, value: 14000, height: 178, foot: '左脚', bio: '阿森纳青训瑰宝，速度与技术兼备的边锋。', honors: ['2021欧洲杯亚军','2023英格兰最佳球员'] },
      { name: '福登', en: 'Phil Foden', pos: '前锋', num: 11, goals: 1, assists: 0, club: '曼城', age: 25, caps: 45, value: 13000, height: 171, foot: '左脚', bio: '曼城核心，2023-24赛季英超最佳球员。', honors: ['1次欧冠冠军','6次英超冠军','2024英超MVP'] }
    ],
    legend: [
      { name: '查尔顿', en: 'Bobby Charlton', pos: '中场', num: 9, era: '1958-1970', caps: 106, goals: 49, bio: '1966世界杯冠军核心，英格兰历史最伟大球员。', honors: ['1966世界杯冠军','1966金球奖','1次欧冠冠军','3次英甲冠军'] },
      { name: '莱因克尔', en: 'Gary Lineker', pos: '前锋', num: 10, era: '1984-1992', caps: 80, goals: 48, bio: '1986世界杯金靴，英格兰传奇射手，职业生涯从未吃牌。', honors: ['1986世界杯金靴','3次英超金靴','1次足总杯冠军'] }
    ]
  },
  '西班牙': {
    active: [
      { name: '亚马尔', en: 'Lamine Yamal', pos: '前锋', num: 19, goals: 1, assists: 1, club: '巴塞罗那', age: 18, caps: 20, value: 15000, height: 180, foot: '左脚', bio: '足坛最强天才少年，16岁即成巴萨主力，2024欧洲杯最佳年轻球员。', honors: ['2024欧洲杯冠军','2024欧洲杯最佳年轻球员'] },
      { name: '佩德里', en: 'Pedri', pos: '中场', num: 8, goals: 1, assists: 1, club: '巴塞罗那', age: 22, caps: 40, value: 10000, height: 174, foot: '右脚', bio: '巴萨中场核心，传球与视野顶级，2021金童奖。', honors: ['2021金童奖','2次西甲冠军','2024欧洲杯冠军'] },
      { name: '威廉姆斯', en: 'Nico Williams', pos: '前锋', num: 17, goals: 1, assists: 0, club: '毕尔巴鄂竞技', age: 22, caps: 25, value: 6000, height: 181, foot: '右脚', bio: '2024欧洲杯决赛MVP，速度型边锋，突破犀利。', honors: ['2024欧洲杯冠军','2024欧洲杯决赛MVP'] }
    ],
    legend: [
      { name: '哈维', en: 'Xavi', pos: '中场', num: 6, era: '2000-2014', caps: 133, goals: 13, bio: '2010世界杯冠军核心，传球大师，tiki-taka的灵魂。', honors: ['2010世界杯冠军','4次欧冠冠军','8次西甲冠军','2012欧洲杯冠军'] },
      { name: '伊涅斯塔', en: 'Andres Iniesta', pos: '中场', num: 8, era: '2006-2018', caps: 131, goals: 14, bio: '2010世界杯决赛绝杀进球者，巴萨传奇，球场上的艺术家。', honors: ['2010世界杯冠军','4次欧冠冠军','9次西甲冠军','2012欧洲杯冠军'] }
    ]
  },
  '葡萄牙': {
    active: [
      { name: 'B费', en: 'Bruno Fernandes', pos: '中场', num: 8, goals: 1, assists: 1, club: '曼联', age: 30, caps: 72, value: 5000, height: 179, foot: '右脚', bio: '葡萄牙创造力核心，传球与远射俱佳。', honors: ['1次足总杯冠军','1次联赛杯冠军'] },
      { name: '莱奥', en: 'Rafael Leao', pos: '前锋', num: 17, goals: 1, assists: 0, club: 'AC米兰', age: 26, caps: 30, value: 7500, height: 188, foot: '右脚', bio: '速度型边锋，意甲MVP，突破犀利。', honors: ['2022意甲MVP','1次意甲冠军'] },
      { name: '席尔瓦', en: 'Bernardo Silva', pos: '中场', num: 10, goals: 0, assists: 1, club: '曼城', age: 30, caps: 95, value: 5000, height: 173, foot: '右脚', bio: '曼城核心中场，技术细腻，战术执行力极强。', honors: ['1次欧冠冠军','6次英超冠军','2019欧洲国联冠军'] }
    ],
    legend: [
      { name: 'C罗', en: 'Cristiano Ronaldo', pos: '前锋', num: 7, era: '2003-2024', caps: 214, goals: 130, bio: '5次金球奖，国家队历史最佳射手130球，5届世界杯进球，永不服输的传奇。', honors: ['5次金球奖','5次欧冠冠军','国家队130球','5届世界杯进球'] },
      { name: '菲戈', en: 'Luis Figo', pos: '中场', num: 7, era: '1991-2006', caps: 127, goals: 32, bio: '2000金球奖，葡萄牙黄金一代领袖，盘带大师。', honors: ['2000金球奖','1次欧冠冠军','4次西甲冠军'] }
    ]
  },
  '荷兰': {
    active: [
      { name: '加克波', en: 'Cody Gakpo', pos: '前锋', num: 8, goals: 1, assists: 1, club: '利物浦', age: 26, caps: 40, value: 6000, height: 189, foot: '右脚', bio: '2022世界杯3球射手，利物浦攻击手，效率极高。', honors: ['1次足总杯冠军','1次联赛杯冠军'] },
      { name: '邓弗里斯', en: 'Denzel Dumfries', pos: '后卫', num: 22, goals: 0, assists: 2, club: '国际米兰', age: 28, caps: 50, value: 3500, height: 188, foot: '右脚', bio: '荷兰飞翼，攻守兼备的右后卫。', honors: ['1次意甲冠军','2024意甲冠军'] },
      { name: '赫拉芬贝赫', en: 'Ryan Gravenberch', pos: '中场', num: 6, goals: 0, assists: 2, club: '利物浦', age: 23, caps: 25, value: 4500, height: 190, foot: '右脚', bio: '荷兰新生代中场，身体与技术兼备。', honors: ['1次英超冠军'] },
      { name: '范戴克', en: 'Virgil van Dijk', pos: '后卫', num: 4, goals: 1, assists: 0, club: '利物浦', age: 33, caps: 75, value: 4000, height: 193, foot: '右脚', bio: '世界顶级中卫，利物浦队长，防空与领导力出众。', honors: ['1次欧冠冠军','1次英超冠军','2019欧足联最佳'] }
    ],
    legend: [
      { name: '克鲁伊夫', en: 'Johan Cruyff', pos: '前锋', num: 14, era: '1966-1977', caps: 48, goals: 33, bio: '"全攻全守"足球之父，3次金球奖，改变足球历史的伟大天才。', honors: ['3次金球奖','3次欧冠冠军','9次荷甲冠军','全攻全守战术开创者'] },
      { name: '范巴斯滕', en: 'Marco van Basten', pos: '前锋', num: 9, era: '1983-1993', caps: 58, goals: 24, bio: '3次金球奖，1988欧洲杯冠军+零度角进球，最优雅的射手。', honors: ['3次金球奖','2次欧冠冠军','1988欧洲杯冠军','3次意甲冠军'] }
    ]
  },
  '比利时': {
    active: [
      { name: '德布劳内', en: 'Kevin De Bruyne', pos: '中场', num: 7, goals: 1, assists: 1, club: '曼城', age: 34, caps: 108, value: 5000, height: 181, foot: '右脚', bio: '世界第一中场，传球与视野无人能及，曼城王朝核心。', honors: ['1次欧冠冠军','6次英超冠军','2次PFA最佳','2018世界杯季军'] },
      { name: '多库', en: 'Jeremy Doku', pos: '前锋', num: 22, goals: 1, assists: 0, club: '曼城', age: 23, caps: 30, value: 4500, height: 173, foot: '左脚', bio: '速度型边锋，突破能力极强。', honors: ['1次英超冠军'] }
    ],
    legend: []
  },
  '克罗地亚': {
    active: [
      { name: '莫德里奇', en: 'Luka Modric', pos: '中场', num: 10, goals: 0, assists: 1, club: '皇家马德里', age: 39, caps: 185, value: 500, height: 172, foot: '右脚', bio: '2018金球奖，皇马传奇中场，2018世界杯亚军队长，足球智慧的化身。', honors: ['2018金球奖','6次欧冠冠军','4次西甲冠军','2018世界杯亚军'] },
      { name: '克拉马里奇', en: 'Andrej Kramaric', pos: '前锋', num: 9, goals: 1, assists: 0, club: '霍芬海姆', age: 34, caps: 85, value: 500, height: 177, foot: '左脚', bio: '克罗地亚老牌射手，门前嗅觉灵敏。', honors: ['2018世界杯亚军'] }
    ],
    legend: [
      { name: '苏克', en: 'Davor Suker', pos: '前锋', num: 9, era: '1990-2002', caps: 69, goals: 45, bio: '1998世界杯金靴6球，克罗地亚黄金一代领军人物，"左脚会拉小提琴"。', honors: ['1998世界杯金靴','1998世界杯季军','1次西甲冠军'] }
    ]
  },
  '美国': {
    active: [
      { name: '普利西奇', en: 'Christian Pulisic', pos: '前锋', num: 10, goals: 1, assists: 1, club: 'AC米兰', age: 26, caps: 72, value: 4000, height: 177, foot: '右脚', bio: '美国队长，AC米兰主力，美国足球旗帜性人物。', honors: ['1次欧冠冠军','2021中北美国联冠军'] },
      { name: '麦肯尼', en: 'Weston McKennie', pos: '中场', num: 8, goals: 0, assists: 1, club: '尤文图斯', age: 26, caps: 60, value: 2000, height: 183, foot: '右脚', bio: '美国中场核心，身体对抗出色。', honors: ['1次意甲冠军'] }
    ],
    legend: []
  },
  '墨西哥': {
    active: [
      { name: '希门尼斯', en: 'Raul Jimenez', pos: '前锋', num: 9, goals: 1, assists: 0, club: '富勒姆', age: 34, caps: 110, value: 300, height: 188, foot: '右脚', bio: '墨西哥头号射手，头球能力出众。', honors: ['1次中北美金杯冠军'] },
      { name: '洛萨诺', en: 'Hirving Lozano', pos: '前锋', num: 22, goals: 1, assists: 0, club: '埃因霍温', age: 29, caps: 70, value: 1200, height: 175, foot: '右脚', bio: '绰号"查奇"，速度型边锋，2018世界杯对德国进球。', honors: ['1次荷甲冠军','1次中北美金杯冠军'] }
    ],
    legend: []
  },
  '瑞典': {
    active: [
      { name: '伊萨克', en: 'Alexander Isak', pos: '前锋', num: 11, goals: 1, assists: 3, club: '纽卡斯尔', age: 25, caps: 45, value: 9000, height: 182, foot: '右脚', bio: '英超最顶级射手之一，速度与射术兼备。', honors: [] }
    ],
    legend: [
      { name: '伊布拉希莫维奇', en: 'Zlatan Ibrahimovic', pos: '前锋', num: 10, era: '2001-2023', caps: 122, goals: 62, bio: '"上帝"伊布，自传式传奇，足球史上最有个性的超级射手。', honors: ['4次意甲冠军','4次法甲冠军','2次荷甲冠军','62球国家队纪录'] }
    ]
  },
  '加拿大': {
    active: [
      { name: '戴维', en: 'Jonathan David', pos: '前锋', num: 9, goals: 3, assists: 0, club: '里尔', age: 25, caps: 55, value: 4500, height: 177, foot: '右脚', bio: '加拿大头号射手，法甲高效射手。', honors: ['1次法甲冠军'] }
    ],
    legend: []
  },
  '摩洛哥': {
    active: [
      { name: '阿什拉夫', en: 'Achraf Hakimi', pos: '后卫', num: 2, goals: 0, assists: 2, club: '巴黎圣日耳曼', age: 26, caps: 65, value: 6500, height: 181, foot: '右脚', bio: '2022世界杯四强功臣，世界级右后卫，速度与进攻能力顶级。', honors: ['2022世界杯4强','2次法甲冠军','1次欧冠冠军'] }
    ],
    legend: []
  },
  '新西兰': {
    active: [
      { name: '伍德', en: 'Chris Wood', pos: '前锋', num: 9, goals: 1, assists: 2, club: '诺丁汉森林', age: 33, caps: 80, value: 600, height: 191, foot: '右脚', bio: '新西兰历史最佳射手，英超老将。', honors: [] }
    ],
    legend: []
  },
  '乌拉圭': {
    active: [
      { name: '巴尔韦德', en: 'Federico Valverde', pos: '中场', num: 15, goals: 0, assists: 1, club: '皇家马德里', age: 26, caps: 55, value: 12000, height: 182, foot: '右脚', bio: '皇马中场引擎，跑动能力世界顶级，远射出色。', honors: ['2次欧冠冠军','4次西甲冠军','2022世界杯季军候选'] },
      { name: '努涅斯', en: 'Darwin Nunez', pos: '前锋', num: 11, goals: 1, assists: 0, club: '利物浦', age: 25, caps: 40, value: 6500, height: 187, foot: '右脚', bio: '乌拉圭锋线杀手，速度与力量兼备。', honors: ['1次英超冠军'] }
    ],
    legend: [
      { name: '苏亚雷斯', en: 'Luis Suarez', pos: '前锋', num: 9, era: '2007-2024', caps: 143, goals: 69, bio: '乌拉圭历史最佳射手，利物浦传奇，2011美洲杯冠军功臣。', honors: ['2011美洲杯冠军','1次欧冠冠军','4次西甲冠军','3次欧洲金靴'] }
    ]
  },
  '哥伦比亚': {
    active: [
      { name: '迪亚斯', en: 'Luis Diaz', pos: '前锋', num: 7, goals: 1, assists: 0, club: '利物浦', age: 28, caps: 55, value: 7500, height: 178, foot: '右脚', bio: '哥伦比亚飞翼，速度与技术兼备。', honors: ['1次足总杯冠军','1次联赛杯冠军'] }
    ],
    legend: [
      { name: '巴尔德拉马', en: 'Carlos Valderrama', pos: '中场', num: 10, era: '1985-1998', caps: 111, goals: 11, bio: '"金毛狮王"，哥伦比亚传奇队长，3届世界杯，南美最优雅的中场。', honors: ['2次南美足球先生','3届世界杯参赛','111场国家队纪录'] }
    ]
  },
  '伊朗': {
    active: [
      { name: '塔雷米', en: 'Mehdi Taremi', pos: '前锋', num: 9, goals: 0, assists: 1, club: '国际米兰', age: 32, caps: 80, value: 1200, height: 183, foot: '右脚', bio: '伊朗头号射手，波尔图传奇，欧冠常客。', honors: ['2次葡超冠军','1次葡超金靴'] }
    ],
    legend: []
  },
  '巴拉圭': {
    active: [
      { name: '阿尔米隆', en: 'Miguel Almiron', pos: '中场', num: 10, goals: 0, assists: 2, club: '纽卡斯尔', age: 30, caps: 55, value: 1500, height: 174, foot: '右脚', bio: '巴拉圭核心，速度型中场。', honors: ['1次美职联冠军'] }
    ],
    legend: []
  },
  '塞内加尔': {
    active: [
      { name: '马内', en: 'Sadio Mane', pos: '前锋', num: 10, goals: 1, assists: 0, club: '利雅得胜利', age: 33, caps: 100, value: 1200, height: 175, foot: '右脚', bio: '2022非洲杯冠军+MVP，利物浦传奇，非洲足球旗帜。', honors: ['2022非洲杯冠军','1次欧冠冠军','1次英超冠军','2022非洲杯MVP'] }
    ],
    legend: []
  },
  '埃及': {
    active: [
      { name: '萨拉赫', en: 'Mohamed Salah', pos: '前锋', num: 10, goals: 0, assists: 0, club: '利物浦', age: 33, caps: 95, value: 5000, height: 175, foot: '左脚', bio: '利物浦传奇，英超金靴常客，埃及法老。', honors: ['3次英超金靴','1次欧冠冠军','1次英超冠军','2次非洲足球先生'] }
    ],
    legend: []
  },
  '韩国': {
    active: [
      { name: '孙兴慜', en: 'Son Heung-min', pos: '前锋', num: 7, goals: 0, assists: 1, club: '热刺', age: 33, caps: 125, value: 4500, height: 183, foot: '双脚', bio: '亚洲足球历史最佳球员，2020英超金靴，热刺队长。', honors: ['2020英超金靴','1次亚运会金牌','亚洲历史最佳球员'] }
    ],
    legend: []
  },
  '日本': {
    active: [
      { name: '三笘薰', en: 'Kaoru Mitoma', pos: '前锋', num: 7, goals: 0, assists: 0, club: '布莱顿', age: 27, caps: 35, value: 5000, height: 173, foot: '左脚', bio: '日本盘带大师，英超过人王，2022世界杯替补奇兵。', honors: [] },
      { name: '久保建英', en: 'Takefusa Kubo', pos: '中场', num: 20, goals: 0, assists: 1, club: '皇家社会', age: 23, caps: 35, value: 3500, height: 173, foot: '左脚', bio: '日本天才，曾效力巴萨青训，西甲主力。', honors: [] }
    ],
    legend: []
  },
  '瑞士': {
    active: [
      { name: '扎卡', en: 'Granit Xhaka', pos: '中场', num: 10, goals: 0, assists: 0, club: '勒沃库森', age: 32, caps: 125, value: 1500, height: 185, foot: '左脚', bio: '瑞士队长，中场铁闸，领导力出众。', honors: ['2024德甲冠军','3次足总杯冠军'] }
    ],
    legend: []
  },
  '奥地利': {
    active: [
      { name: '萨比策', en: 'Marcel Sabitzer', pos: '中场', num: 9, goals: 0, assists: 0, club: '多特蒙德', age: 30, caps: 80, value: 1200, height: 178, foot: '右脚', bio: '奥地利核心，远射与传球能力出色。', honors: ['1次德甲冠军'] }
    ],
    legend: []
  },
  '土耳其': {
    active: [
      { name: '恰尔汗奥卢', en: 'Hakan Calhanoglu', pos: '中场', num: 10, goals: 0, assists: 0, club: '国际米兰', age: 31, caps: 85, value: 3500, height: 178, foot: '右脚', bio: '意甲顶级中场，远射与定位球专家。', honors: ['1次意甲冠军'] }
    ],
    legend: []
  },
  '苏格兰': {
    active: [
      { name: '罗伯逊', en: 'Andrew Robertson', pos: '后卫', num: 3, goals: 0, assists: 0, club: '利物浦', age: 30, caps: 75, value: 2000, height: 178, foot: '左脚', bio: '利物浦队长，英超最佳左后卫之一。', honors: ['1次欧冠冠军','1次英超冠军'] }
    ],
    legend: []
  },
  '加纳': {
    active: [
      { name: '库杜斯', en: 'Mohammed Kudus', pos: '中场', num: 10, goals: 0, assists: 0, club: '西汉姆联', age: 24, caps: 40, value: 5000, height: 175, foot: '右脚', bio: '加纳天才中场，2022世界杯2球射手。', honors: [] }
    ],
    legend: []
  },
  '科特迪瓦': {
    active: [
      { name: '佩佩', en: 'Nicolas Pepe', pos: '前锋', num: 19, goals: 0, assists: 0, club: '特拉布宗体育', age: 29, caps: 45, value: 500, height: 183, foot: '左脚', bio: '科特迪瓦边锋，曾效力阿森纳。', honors: [] }
    ],
    legend: []
  }
};

// 射手榜
const TOP_SCORERS = [
  { name: '梅西', en: 'Lionel Messi', team: '阿根廷', goals: 5 },
  { name: '姆巴佩', en: 'Kylian Mbappe', team: '法国', goals: 4 },
  { name: '哈兰德', en: 'Erling Haaland', team: '挪威', goals: 4 },
  { name: '翁达夫', en: 'Deniz Undav', team: '德国', goals: 3 },
  { name: '戴维', en: 'Jonathan David', team: '加拿大', goals: 3 },
  { name: '维尼修斯', en: 'Vinicius Junior', team: '巴西', goals: 2 },
  { name: '凯恩', en: 'Harry Kane', team: '英格兰', goals: 2 },
  { name: '罗德里戈', en: 'Rodrygo', team: '巴西', goals: 2 }
];

// 助攻榜
const TOP_ASSISTS = [
  { name: '伊萨克', en: 'Alexander Isak', team: '瑞典', assists: 3 },
  { name: '翁达夫', en: 'Deniz Undav', team: '德国', assists: 2 },
  { name: '邓弗里斯', en: 'Denzel Dumfries', team: '荷兰', assists: 2 },
  { name: '基米希', en: 'Joshua Kimmich', team: '德国', assists: 2 },
  { name: '阿尔米隆', en: 'Miguel Almiron', team: '巴拉圭', assists: 2 },
  { name: '阿什拉夫', en: 'Achraf Hakimi', team: '摩洛哥', assists: 2 },
  { name: '赫拉芬贝赫', en: 'Ryan Gravenberch', team: '荷兰', assists: 2 },
  { name: '伍德', en: 'Chris Wood', team: '新西兰', assists: 2 },
  { name: '登贝莱', en: 'Ousmane Dembele', team: '法国', assists: 2 },
  { name: '奥利塞', en: 'Michael Olise', team: '法国', assists: 2 }
];

// 球队实力评分
const TEAM_STRENGTH = {
  '阿根廷': 95, '法国': 94, '巴西': 93, '英格兰': 91, '西班牙': 90,
  '德国': 89, '葡萄牙': 88, '荷兰': 87, '比利时': 85, '克罗地亚': 84,
  '美国': 82, '墨西哥': 80, '瑞士': 79, '乌拉圭': 79, '哥伦比亚': 78,
  '日本': 77, '摩洛哥': 77, '韩国': 75, '澳大利亚': 74, '厄瓜多尔': 74,
  '奥地利': 73, '土耳其': 72, '瑞典': 72, '苏格兰': 71, '加纳': 71,
  '科特迪瓦': 71, '埃及': 70, '巴拉圭': 70, '卡塔尔': 68, '挪威': 69,
  '塞内加尔': 72, '阿尔及利亚': 69, '捷克': 71, '波黑': 68, '突尼斯': 67,
  '沙特阿拉伯': 67, '伊朗': 67, '巴拿马': 63, '新西兰': 62, '伊拉克': 64,
  '约旦': 63, '乌兹别克斯坦': 64, '佛得角': 62, '民主刚果': 63,
  '库拉索': 58, '海地': 60
};

// 球队总身价（万欧元）
const TEAM_VALUE = {
  '阿根廷': 82000, '法国': 105000, '巴西': 98000, '英格兰': 92000, '西班牙': 88000,
  '德国': 75000, '葡萄牙': 68000, '荷兰': 58000, '比利时': 42000, '克罗地亚': 28000,
  '美国': 32000, '墨西哥': 18000, '瑞士': 22000, '乌拉圭': 35000, '哥伦比亚': 28000,
  '日本': 25000, '摩洛哥': 26000, '韩国': 15000, '澳大利亚': 12000, '厄瓜多尔': 14000,
  '奥地利': 18000, '土耳其': 16000, '瑞典': 18000, '苏格兰': 12000, '加纳': 10000,
  '科特迪瓦': 8000, '埃及': 9000, '巴拉圭': 8000, '卡塔尔': 5000, '挪威': 38000,
  '塞内加尔': 12000, '阿尔及利亚': 8000, '捷克': 10000, '波黑': 7000, '突尼斯': 6000,
  '沙特阿拉伯': 8000, '伊朗': 6000, '巴拿马': 3000, '新西兰': 4000, '伊拉克': 4000,
  '约旦': 3000, '乌兹别克斯坦': 5000, '佛得角': 2000, '民主刚果': 4000,
  '库拉索': 1500, '海地': 2000
};
