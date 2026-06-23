// 2026 内蒙古足球超级联赛（蒙超）数据
// 12支盟市代表队 · 常规赛11轮主客场单循环 · 前8名进入淘汰赛
// 数据来源：官方报道及多家体育媒体，更新至第6轮（2026-06-21）

// ========== 球队信息 ==========
const MENGCHAO_TEAMS = {
  '呼和浩特': { name: '呼和浩特队', city: '呼和浩特市', venue: '呼和浩特体育场', color: '#1a5fb4', strength: 72, desc: '上届冠军，本赛季开局不利，第6轮终获首胜' },
  '通辽': { name: '通辽队', city: '通辽市', venue: '通辽市奥体中心', color: '#e01b24', strength: 78, desc: '上届亚军，本赛季表现出色，稳居前列' },
  '赤峰': { name: '赤峰队', city: '赤峰市', venue: '赤峰体育中心', color: '#ff7800', strength: 76, desc: '本赛季领头羊，前6轮保持不败' },
  '鄂尔多斯': { name: '鄂尔多斯队', city: '鄂尔多斯市', venue: '鄂尔多斯市体育事业发展中心体育场', color: '#26a269', strength: 75, desc: '进攻火力强劲，积分榜第二' },
  '包头': { name: '包头队', city: '包头市', venue: '包头市奥体中心足球场', color: '#99c1f1', strength: 70, desc: '老牌劲旅，本赛季表现稳定' },
  '锡林郭勒盟': { name: '锡林郭勒盟队', city: '锡林郭勒盟', venue: '锡林郭勒盟体育场', color: '#c01c28', strength: 60, desc: '本赛季战绩不佳，排名靠后' },
  '巴彦淖尔': { name: '巴彦淖尔队', city: '巴彦淖尔市', venue: '巴彦淖尔市足球主题公园', color: '#33d17a', strength: 65, desc: '新赛季开门红后状态起伏' },
  '阿拉善盟': { name: '阿拉善盟队', city: '阿拉善盟', venue: '阿左旗巴彦浩特多功能体育场', color: '#f5c211', strength: 58, desc: '本赛季表现不佳，排名靠后' },
  '呼伦贝尔': { name: '呼伦贝尔队', city: '呼伦贝尔市', venue: '呼伦贝尔学院体育场', color: '#1c71d8', strength: 66, desc: '开局两连败后逐渐调整' },
  '兴安盟': { name: '兴安盟队', city: '兴安盟', venue: '兴安盟体育场', color: '#a51d2d', strength: 62, desc: '揭幕战客场取胜，但后续不稳定' },
  '乌海': { name: '乌海队', city: '乌海市', venue: '乌海市第一中学体育场', color: '#5c3566', strength: 60, desc: '本赛季平局较多' },
  '乌兰察布': { name: '乌兰察布队', city: '乌兰察布市', venue: '乌兰察布市体育场', color: '#813d9c', strength: 68, desc: '主场优势明显，第六轮2:0完胜兴安盟' }
};

// ========== 积分榜（截至第6轮） ==========
const MENGCHAO_STANDINGS = [
  { rank: 1,  team: '赤峰',     played: 6, won: 4, drawn: 1, lost: 1, gf: 12, ga: 5,  pts: 13 },
  { rank: 2,  team: '鄂尔多斯', played: 6, won: 3, drawn: 3, lost: 0, gf: 13, ga: 3,  pts: 12 },
  { rank: 3,  team: '包头',     played: 6, won: 3, drawn: 1, lost: 2, gf: 9,  ga: 5,  pts: 10 },
  { rank: 4,  team: '通辽',     played: 6, won: 3, drawn: 1, lost: 2, gf: 8,  ga: 6,  pts: 10 },
  { rank: 5,  team: '乌兰察布', played: 6, won: 3, drawn: 0, lost: 3, gf: 10, ga: 7,  pts: 9 },
  { rank: 6,  team: '呼伦贝尔', played: 6, won: 2, drawn: 1, lost: 3, gf: 5,  ga: 8,  pts: 7 },
  { rank: 7,  team: '巴彦淖尔', played: 6, won: 2, drawn: 0, lost: 4, gf: 5,  ga: 11, pts: 6 },
  { rank: 8,  team: '兴安盟',   played: 6, won: 1, drawn: 2, lost: 3, gf: 4,  ga: 6,  pts: 5 },
  { rank: 9,  team: '呼和浩特', played: 6, won: 1, drawn: 1, lost: 4, gf: 7,  ga: 11, pts: 4 },
  { rank: 10, team: '阿拉善盟', played: 6, won: 1, drawn: 1, lost: 4, gf: 5,  ga: 11, pts: 4 },
  { rank: 11, team: '乌海',     played: 6, won: 0, drawn: 2, lost: 4, gf: 3,  ga: 10, pts: 2 },
  { rank: 12, team: '锡林郭勒盟', played: 6, won: 0, drawn: 1, lost: 5, gf: 2,  ga: 12, pts: 1 }
];

// ========== 赛程 ==========
const MENGCHAO_MATCHES = [
  // ===== 第1轮 (5月15-16日) =====
  { id: 'mc1',  round: 1, home: '呼和浩特', away: '赤峰',     date: '2026-05-16', time: '19:00', venue: '呼和浩特体育场', homeScore: 1, awayScore: 2, finished: true },
  { id: 'mc2',  round: 1, home: '通辽',     away: '锡林郭勒盟', date: '2026-05-16', time: '19:00', venue: '通辽市奥体中心', homeScore: 2, awayScore: 0, finished: true },
  { id: 'mc3',  round: 1, home: '鄂尔多斯', away: '包头',     date: '2026-05-16', time: '16:00', venue: '鄂尔多斯市体育事业发展中心体育场', homeScore: 1, awayScore: 1, finished: true },
  { id: 'mc4',  round: 1, home: '巴彦淖尔', away: '阿拉善盟', date: '2026-05-16', time: '16:00', venue: '巴彦淖尔市足球主题公园', homeScore: 2, awayScore: 0, finished: true },
  { id: 'mc5',  round: 1, home: '呼伦贝尔', away: '兴安盟',   date: '2026-05-16', time: '15:00', venue: '呼伦贝尔学院体育场', homeScore: 0, awayScore: 1, finished: true },
  { id: 'mc6',  round: 1, home: '乌海',     away: '乌兰察布', date: '2026-05-16', time: '16:00', venue: '乌海市第一中学体育场', homeScore: 1, awayScore: 1, finished: true },

  // ===== 第2轮 (5月23-24日) =====
  { id: 'mc7',  round: 2, home: '赤峰',     away: '包头',     date: '2026-05-24', time: '16:00', venue: '赤峰体育中心', homeScore: 1, awayScore: 0, finished: true },
  { id: 'mc8',  round: 2, home: '鄂尔多斯', away: '乌海',     date: '2026-05-23', time: '16:00', venue: '鄂尔多斯市体育事业发展中心体育场', homeScore: 4, awayScore: 0, finished: true },
  { id: 'mc9',  round: 2, home: '锡林郭勒盟', away: '呼和浩特', date: '2026-05-24', time: '15:00', venue: '锡林郭勒盟体育场', homeScore: 1, awayScore: 1, finished: true },
  { id: 'mc10', round: 2, home: '乌兰察布', away: '呼伦贝尔', date: '2026-05-24', time: '16:00', venue: '乌兰察布市体育场', homeScore: 3, awayScore: 0, finished: true },
  { id: 'mc11', round: 2, home: '兴安盟',   away: '巴彦淖尔', date: '2026-05-23', time: '16:00', venue: '兴安盟体育场', homeScore: 0, awayScore: 0, finished: true },
  { id: 'mc12', round: 2, home: '阿拉善盟', away: '通辽',     date: '2026-05-24', time: '15:00', venue: '阿左旗巴彦浩特多功能体育场', homeScore: 1, awayScore: 1, finished: true },

  // ===== 第3轮 (5月30-31日) =====
  { id: 'mc13', round: 3, home: '赤峰',     away: '锡林郭勒盟', date: '2026-05-31', time: '16:00', venue: '赤峰体育中心', homeScore: 4, awayScore: 1, finished: true },
  { id: 'mc14', round: 3, home: '呼和浩特', away: '乌兰察布', date: '2026-05-30', time: '19:00', venue: '呼和浩特体育场', homeScore: 1, awayScore: 1, finished: true },
  { id: 'mc15', round: 3, home: '鄂尔多斯', away: '通辽',     date: '2026-05-31', time: '16:00', venue: '鄂尔多斯市体育事业发展中心体育场', homeScore: 0, awayScore: 0, finished: true },
  { id: 'mc16', round: 3, home: '巴彦淖尔', away: '呼伦贝尔', date: '2026-05-30', time: '16:00', venue: '巴彦淖尔市足球主题公园', homeScore: 2, awayScore: 1, finished: true },
  { id: 'mc17', round: 3, home: '包头',     away: '兴安盟',   date: '2026-05-31', time: '16:00', venue: '包头市奥体中心足球场', homeScore: 2, awayScore: 0, finished: true },
  { id: 'mc18', round: 3, home: '乌海',     away: '阿拉善盟', date: '2026-05-30', time: '17:00', venue: '乌海市第一中学体育场', homeScore: 0, awayScore: 1, finished: true },

  // ===== 第4轮 (6月6-7日) =====
  { id: 'mc19', round: 4, home: '锡林郭勒盟', away: '阿拉善盟', date: '2026-06-07', time: '15:00', venue: '锡林郭勒盟体育场', homeScore: 0, awayScore: 1, finished: true },
  { id: 'mc20', round: 4, home: '乌兰察布', away: '包头',     date: '2026-06-07', time: '16:00', venue: '乌兰察布市体育场', homeScore: 0, awayScore: 4, finished: true },
  { id: 'mc21', round: 4, home: '兴安盟',   away: '乌海',     date: '2026-06-07', time: '16:00', venue: '兴安盟体育场', homeScore: 1, awayScore: 1, finished: true },
  { id: 'mc22', round: 4, home: '巴彦淖尔', away: '呼伦贝尔', date: '2026-06-06', time: '16:00', venue: '巴彦淖尔市足球主题公园', homeScore: 0, awayScore: 2, finished: true },
  { id: 'mc23', round: 4, home: '赤峰',     away: '通辽',     date: '2026-06-07', time: '16:00', venue: '赤峰体育中心', homeScore: 2, awayScore: 2, finished: true },
  { id: 'mc24', round: 4, home: '呼和浩特', away: '鄂尔多斯', date: '2026-06-07', time: '19:00', venue: '呼和浩特体育场', homeScore: 0, awayScore: 3, finished: true },

  // ===== 第5轮 (6月13-14日) =====
  { id: 'mc25', round: 5, home: '通辽',     away: '呼和浩特', date: '2026-06-14', time: '19:30', venue: '通辽市奥体中心', homeScore: 2, awayScore: 1, finished: true },
  { id: 'mc26', round: 5, home: '巴彦淖尔', away: '乌兰察布', date: '2026-06-13', time: '16:00', venue: '巴彦淖尔市足球主题公园', homeScore: 2, awayScore: 4, finished: true },
  { id: 'mc27', round: 5, home: '呼伦贝尔', away: '鄂尔多斯', date: '2026-06-13', time: '17:00', venue: '呼伦贝尔学院体育场', homeScore: 1, awayScore: 1, finished: true },
  { id: 'mc28', round: 5, home: '乌海',     away: '赤峰',     date: '2026-06-13', time: '17:00', venue: '乌海市第一中学体育场', homeScore: 0, awayScore: 2, finished: true },
  { id: 'mc29', round: 5, home: '阿拉善盟', away: '兴安盟',   date: '2026-06-13', time: '17:00', venue: '阿左旗巴彦浩特多功能体育场', homeScore: 4, awayScore: 1, finished: true },
  { id: 'mc30', round: 5, home: '包头',     away: '锡林郭勒盟', date: '2026-06-13', time: '19:30', venue: '包头市奥体中心足球场', homeScore: 1, awayScore: 0, finished: true },

  // ===== 第6轮 (6月20-21日) =====
  { id: 'mc31', round: 6, home: '鄂尔多斯', away: '巴彦淖尔', date: '2026-06-20', time: '19:30', venue: '鄂尔多斯市体育事业发展中心体育场', homeScore: 3, awayScore: 0, finished: true },
  { id: 'mc32', round: 6, home: '通辽',     away: '包头',     date: '2026-06-20', time: '19:30', venue: '通辽市奥体中心', homeScore: null, awayScore: null, finished: false },
  { id: 'mc33', round: 6, home: '乌兰察布', away: '兴安盟',   date: '2026-06-20', time: '16:00', venue: '乌兰察布市体育场', homeScore: 2, awayScore: 0, finished: true },
  { id: 'mc34', round: 6, home: '赤峰',     away: '呼伦贝尔', date: '2026-06-20', time: '19:00', venue: '赤峰体育中心', homeScore: null, awayScore: null, finished: false },
  { id: 'mc35', round: 6, home: '呼和浩特', away: '阿拉善盟', date: '2026-06-21', time: '19:30', venue: '呼和浩特国家北方足球训练基地', homeScore: 3, awayScore: 2, finished: true },
  { id: 'mc36', round: 6, home: '乌海',     away: '锡林郭勒盟', date: '2026-06-21', time: '17:00', venue: '乌海市第一中学体育场', homeScore: null, awayScore: null, finished: false },

  // ===== 第7轮 (6月27-28日) =====
  { id: 'mc37', round: 7, home: '巴彦淖尔', away: '赤峰',     date: '2026-06-27', time: '16:00', venue: '巴彦淖尔市足球主题公园', homeScore: null, awayScore: null, finished: false },
  { id: 'mc38', round: 7, home: '包头',     away: '呼和浩特', date: '2026-06-27', time: '19:30', venue: '包头市奥体中心足球场', homeScore: null, awayScore: null, finished: false },
  { id: 'mc39', round: 7, home: '呼伦贝尔', away: '乌海',     date: '2026-06-27', time: '17:00', venue: '呼伦贝尔学院体育场', homeScore: null, awayScore: null, finished: false },
  { id: 'mc40', round: 7, home: '兴安盟',   away: '鄂尔多斯', date: '2026-06-28', time: '16:00', venue: '兴安盟体育场', homeScore: null, awayScore: null, finished: false },
  { id: 'mc41', round: 7, home: '锡林郭勒盟', away: '乌兰察布', date: '2026-06-28', time: '15:00', venue: '锡林郭勒盟体育场', homeScore: null, awayScore: null, finished: false },
  { id: 'mc42', round: 7, home: '阿拉善盟', away: '通辽',     date: '2026-06-28', time: '16:00', venue: '阿左旗巴彦浩特多功能体育场', homeScore: null, awayScore: null, finished: false },

  // ===== 第8轮 (7月4-5日) =====
  { id: 'mc43', round: 8, home: '赤峰',     away: '兴安盟',   date: '2026-07-04', time: '16:00', venue: '赤峰体育中心', homeScore: null, awayScore: null, finished: false },
  { id: 'mc44', round: 8, home: '鄂尔多斯', away: '锡林郭勒盟', date: '2026-07-04', time: '16:00', venue: '鄂尔多斯市体育事业发展中心体育场', homeScore: null, awayScore: null, finished: false },
  { id: 'mc45', round: 8, home: '通辽',     away: '呼伦贝尔', date: '2026-07-04', time: '19:30', venue: '通辽市奥体中心', homeScore: null, awayScore: null, finished: false },
  { id: 'mc46', round: 8, home: '包头',     away: '巴彦淖尔', date: '2026-07-05', time: '16:00', venue: '包头市奥体中心足球场', homeScore: null, awayScore: null, finished: false },
  { id: 'mc47', round: 8, home: '乌兰察布', away: '阿拉善盟', date: '2026-07-05', time: '16:00', venue: '乌兰察布市体育场', homeScore: null, awayScore: null, finished: false },
  { id: 'mc48', round: 8, home: '乌海',     away: '呼和浩特', date: '2026-07-05', time: '17:00', venue: '乌海市第一中学体育场', homeScore: null, awayScore: null, finished: false },

  // ===== 第9轮 (7月11-12日) =====
  { id: 'mc49', round: 9, home: '呼和浩特', away: '包头',     date: '2026-07-11', time: '19:00', venue: '呼和浩特体育场', homeScore: null, awayScore: null, finished: false },
  { id: 'mc50', round: 9, home: '呼伦贝尔', away: '乌兰察布', date: '2026-07-11', time: '17:00', venue: '呼伦贝尔学院体育场', homeScore: null, awayScore: null, finished: false },
  { id: 'mc51', round: 9, home: '兴安盟',   away: '通辽',     date: '2026-07-12', time: '16:00', venue: '兴安盟体育场', homeScore: null, awayScore: null, finished: false },
  { id: 'mc52', round: 9, home: '阿拉善盟', away: '鄂尔多斯', date: '2026-07-12', time: '16:00', venue: '阿左旗巴彦浩特多功能体育场', homeScore: null, awayScore: null, finished: false },
  { id: 'mc53', round: 9, home: '锡林郭勒盟', away: '赤峰',   date: '2026-07-12', time: '15:00', venue: '锡林郭勒盟体育场', homeScore: null, awayScore: null, finished: false },
  { id: 'mc54', round: 9, home: '巴彦淖尔', away: '乌海',     date: '2026-07-12', time: '16:00', venue: '巴彦淖尔市足球主题公园', homeScore: null, awayScore: null, finished: false },

  // ===== 第10轮 (7月18-19日) =====
  { id: 'mc55', round: 10, home: '通辽',     away: '鄂尔多斯', date: '2026-07-18', time: '19:30', venue: '通辽市奥体中心', homeScore: null, awayScore: null, finished: false },
  { id: 'mc56', round: 10, home: '包头',     away: '赤峰',     date: '2026-07-18', time: '16:00', venue: '包头市奥体中心足球场', homeScore: null, awayScore: null, finished: false },
  { id: 'mc57', round: 10, home: '乌兰察布', away: '呼和浩特', date: '2026-07-19', time: '16:00', venue: '乌兰察布市体育场', homeScore: null, awayScore: null, finished: false },
  { id: 'mc58', round: 10, home: '乌海',     away: '兴安盟',   date: '2026-07-19', time: '17:00', venue: '乌海市第一中学体育场', homeScore: null, awayScore: null, finished: false },
  { id: 'mc59', round: 10, home: '呼伦贝尔', away: '巴彦淖尔', date: '2026-07-19', time: '17:00', venue: '呼伦贝尔学院体育场', homeScore: null, awayScore: null, finished: false },
  { id: 'mc60', round: 10, home: '阿拉善盟', away: '锡林郭勒盟', date: '2026-07-19', time: '16:00', venue: '阿左旗巴彦浩特多功能体育场', homeScore: null, awayScore: null, finished: false },

  // ===== 第11轮 (7月25-26日) =====
  { id: 'mc61', round: 11, home: '鄂尔多斯', away: '赤峰',     date: '2026-07-25', time: '16:00', venue: '鄂尔多斯市体育事业发展中心体育场', homeScore: null, awayScore: null, finished: false },
  { id: 'mc62', round: 11, home: '呼和浩特', away: '通辽',     date: '2026-07-25', time: '19:00', venue: '呼和浩特体育场', homeScore: null, awayScore: null, finished: false },
  { id: 'mc63', round: 11, home: '兴安盟',   away: '呼伦贝尔', date: '2026-07-26', time: '16:00', venue: '兴安盟体育场', homeScore: null, awayScore: null, finished: false },
  { id: 'mc64', round: 11, home: '锡林郭勒盟', away: '巴彦淖尔', date: '2026-07-26', time: '15:00', venue: '锡林郭勒盟体育场', homeScore: null, awayScore: null, finished: false },
  { id: 'mc65', round: 11, home: '乌海',     away: '包头',     date: '2026-07-26', time: '17:00', venue: '乌海市第一中学体育场', homeScore: null, awayScore: null, finished: false },
  { id: 'mc66', round: 11, home: '乌兰察布', away: '阿拉善盟', date: '2026-07-26', time: '16:00', venue: '乌兰察布市体育场', homeScore: null, awayScore: null, finished: false }
];

// ========== 射手榜 ==========
const MENGCHAO_SCORERS = [
  { rank: 1,  name: '王闵捷', team: '赤峰',     goals: 4, note: '含1粒点球' },
  { rank: 2,  name: '吴宇帆', team: '鄂尔多斯', goals: 3, note: '第二轮梅开二度' },
  { rank: 3,  name: '宝音门德', team: '呼伦贝尔', goals: 2, note: '' },
  { rank: 4,  name: '希力德格', team: '赤峰',   goals: 2, note: '' },
  { rank: 5,  name: '叶重秋', team: '赤峰',     goals: 2, note: '' },
  { rank: 6,  name: '周鹏程', team: '乌兰察布', goals: 2, note: '第六轮梅开二度' },
  { rank: 7,  name: '刘恒奇', team: '巴彦淖尔', goals: 1, note: '首轮破门' },
  { rank: 8,  name: '陈象',   team: '兴安盟',   goals: 1, note: '首轮81分钟绝杀' },
  { rank: 9,  name: '李佳一', team: '呼和浩特', goals: 1, note: '揭幕战任意球破门' },
  { rank: 10, name: '阿尔什恩', team: '鄂尔多斯', goals: 1, note: '' }
];
