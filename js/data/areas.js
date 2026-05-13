// 区域和场景数据
export const AREAS = [
  {
    id: 1, name: '青木原', description: '茂密的原始森林，每位御灵师的起点。', theme: 'forest', bgColor: '#0a1a0a',
    scenes: [
      { id: 'forest_camp', name: '林间营地', description: '青木原中的一片空地。在此可休息恢复。', type: 'camp' },
      { id: 'forest_edge', name: '森林边缘', description: '森林的外围地带。', type: 'wild1', enemyPool: ['wild_dog', 'tree_sprite'], levelRange: [1, 4], rareEnemyPool: ['spirit_fox'] },
      { id: 'forest_depths', name: '密林深处', description: '树木遮天蔽日。', type: 'wild2', enemyPool: ['tree_sprite', 'wild_dog'], levelRange: [3, 7], rareEnemyPool: ['spirit_fox', 'golden_butterfly'] },
      { id: 'forest_gym', name: '青木道馆', description: '由古树环绕的木质建筑。', type: 'gym' },
    ],
    gymLeader: { name: '阿木', title: '青木原守护者', team: ['tree_sprite', 'iron_turtle'], teamLevels: [6, 8], intro: '欢迎来到青木原，年轻的御灵师。', defeatText: '你的实力已经超越了青木原！' },
    unlockRequirement: 0, leaderImage: 'leader1',
  },
  {
    id: 2, name: '赤焰沙漠', description: '烈日炙烤的沙海。', theme: 'desert', bgColor: '#1a0a0a',
    scenes: [
      { id: 'desert_oasis', name: '沙漠绿洲', description: '清泉绿洲，旅人补给地。', type: 'camp' },
      { id: 'desert_dunes', name: '热浪沙丘', description: '连绵起伏的沙丘。', type: 'wild1', enemyPool: ['sand_worm', 'fire_lizard'], levelRange: [8, 12], rareEnemyPool: ['scorpion_king'] },
      { id: 'desert_canyon', name: '熔岩峡谷', description: '岩壁上流淌着熔岩痕迹。', type: 'wild2', enemyPool: ['fire_lizard', 'scorpion_king'], levelRange: [10, 16], rareEnemyPool: ['flame_bird'] },
      { id: 'desert_gym', name: '赤焰道馆', description: '建在死火山口中的道馆。', type: 'gym' },
    ],
    gymLeader: { name: '炎舞', title: '赤焰舞者', team: ['fire_lizard', 'scorpion_king', 'magma_beast'], teamLevels: [14, 16, 18], intro: '赤焰沙漠是火之圣地！', defeatText: '你扑灭了我的火焰...' },
    unlockRequirement: 1, leaderImage: 'leader2',
  },
  {
    id: 3, name: '黑水沼泽', description: '阴冷潮湿的沼泽地带。', theme: 'swamp', bgColor: '#0a0a1a',
    scenes: [
      { id: 'swamp_hut', name: '猎人小屋', description: '沼泽边缘高地上的木屋。', type: 'camp' },
      { id: 'swamp_marsh', name: '毒雾沼泽', description: '紫色的毒雾弥漫水面。', type: 'wild1', enemyPool: ['poison_frog', 'leech_spirit'], levelRange: [15, 20], rareEnemyPool: ['mud_golem'] },
      { id: 'swamp_depths', name: '黑水深渊', description: '沼泽最深处。', type: 'wild2', enemyPool: ['leech_spirit', 'mud_golem'], levelRange: [18, 25], rareEnemyPool: ['mysterious_water_snake'] },
      { id: 'swamp_gym', name: '黑水道馆', description: '泥潭中央的竹楼。', type: 'gym' },
    ],
    gymLeader: { name: '毒娘子', title: '万毒之主', team: ['poison_frog', 'mud_golem', 'hydra'], teamLevels: [22, 24, 28], intro: '我的毒会让你生不如死...', defeatText: '我的毒竟然对你无效...' },
    unlockRequirement: 2, leaderImage: 'leader3',
  },
  {
    id: 4, name: '金戈荒原', description: '一片荒凉的战场遗迹。', theme: 'wasteland', bgColor: '#1a1a0a',
    scenes: [
      { id: 'wasteland_fort', name: '废弃要塞', description: '古代战争遗留的石制要塞。', type: 'camp' },
      { id: 'wasteland_field', name: '古战场', description: '曾经的决战之地。', type: 'wild1', enemyPool: ['terracotta_warrior', 'gold_eater'], levelRange: [22, 28], rareEnemyPool: ['rusty_blade'] },
      { id: 'wasteland_ruins', name: '兵器冢', description: '埋葬神兵利器的坟场。', type: 'wild2', enemyPool: ['gold_eater', 'rusty_blade'], levelRange: [26, 34], rareEnemyPool: ['flying_sword_spirit'] },
      { id: 'wasteland_gym', name: '金戈道馆', description: '由无数兵器堆砌而成的堡垒。', type: 'gym' },
    ],
    gymLeader: { name: '破军', title: '百战将军', team: ['terracotta_warrior', 'gold_eater', 'flying_sword_spirit', 'mechanical_beast'], teamLevels: [30, 32, 34, 38], intro: '我的军队无人能敌！', defeatText: '千战不败的神话被你打破了。' },
    unlockRequirement: 3, leaderImage: 'leader4',
  },
  {
    id: 5, name: '土息山脉', description: '连绵不绝的巍峨山脉。', theme: 'mountain', bgColor: '#1a150a',
    scenes: [
      { id: 'mountain_base', name: '山脚村落', description: '依山而建的小村庄。', type: 'camp' },
      { id: 'mountain_path', name: '碎石小径', description: '蜿蜒向上的山路。', type: 'wild1', enemyPool: ['rock_monster', 'pangolin'], levelRange: [30, 36], rareEnemyPool: ['cave_bat'] },
      { id: 'mountain_cave', name: '龙眠洞穴', description: '山脉深处的巨大洞穴。', type: 'wild2', enemyPool: ['pangolin', 'cave_bat'], levelRange: [34, 42], rareEnemyPool: ['rock_dragon'] },
      { id: 'mountain_gym', name: '土息道馆', description: '山巅巨石之上的道馆。', type: 'gym' },
    ],
    gymLeader: { name: '不动', title: '山岳禅师', team: ['rock_monster', 'pangolin', 'rock_dragon', 'mountain_giant'], teamLevels: [38, 40, 42, 48], intro: '施主，你的心够坚定吗？', defeatText: '你已领悟了真正的力量。' },
    unlockRequirement: 4, leaderImage: 'leader5',
  },
  {
    id: 6, name: '雷霆峡谷', description: '终年雷暴不断的险峻峡谷。', theme: 'canyon', bgColor: '#0a0a2a',
    scenes: [
      { id: 'canyon_shelter', name: '避雷营地', description: '峡谷中的天然遮蔽处。', type: 'camp' },
      { id: 'canyon_path', name: '闪电小径', description: '峡谷中的狭窄通道。', type: 'wild1', enemyPool: ['thunder_hawk', 'lightning_rat'], levelRange: [38, 45], rareEnemyPool: ['storm_wolf'] },
      { id: 'canyon_eye', name: '风暴之眼', description: '雷电汇聚之地。', type: 'wild2', enemyPool: ['thunder_hawk', 'storm_wolf'], levelRange: [42, 52], rareEnemyPool: ['thunder_kirin'] },
      { id: 'canyon_gym', name: '雷霆道馆', description: '最高峭壁上的石台。', type: 'gym' },
    ],
    gymLeader: { name: '雷震子', title: '天雷使者', team: ['lightning_rat', 'storm_wolf', 'thunder_kirin', 'purple_thunder_dragon'], teamLevels: [48, 52, 56, 62], intro: '天雷降世，万邪辟易！', defeatText: '看来天道也认可了你的实力。' },
    unlockRequirement: 5, leaderImage: 'leader6',
  },
  {
    id: 7, name: '幽冥鬼域', description: '阴阳两界的交界处。', theme: 'dark', bgColor: '#0a0a0a',
    scenes: [
      { id: 'ghost_light', name: '引魂灯驿站', description: '鬼域入口处的小驿站。', type: 'camp' },
      { id: 'ghost_wander', name: '亡者之路', description: '通往幽冥深处的石板路。', type: 'wild1', enemyPool: ['lonely_ghost', 'zombie_dog'], levelRange: [48, 56], rareEnemyPool: ['soul_reaper'] },
      { id: 'ghost_throne', name: '冥王殿外', description: '幽冥之主宫殿的外围。', type: 'wild2', enemyPool: ['zombie_dog', 'soul_reaper'], levelRange: [54, 65], rareEnemyPool: ['ghost_general'] },
      { id: 'ghost_gym', name: '幽冥道馆', description: '传说中的阎罗殿。', type: 'gym' },
    ],
    gymLeader: { name: '阎罗', title: '幽冥之主', team: ['soul_reaper', 'zombie_dog', 'ghost_general', 'judge_pen'], teamLevels: [58, 62, 68, 75], intro: '生死簿上有汝名。', defeatText: '你的命，不在我手。' },
    unlockRequirement: 6, leaderImage: 'leader7',
  },
  {
    id: 8, name: '苍穹云海', description: '万丈高空之上的云层世界。', theme: 'sky', bgColor: '#0a0a2a',
    scenes: [
      { id: 'sky_platform', name: '浮云台', description: '悬浮在云端的巨大平台。', type: 'camp' },
      { id: 'sky_wander', name: '流云通道', description: '由流动云层构成的通道。', type: 'wild1', enemyPool: ['cloud_beast', 'wind_spirit'], levelRange: [58, 68], rareEnemyPool: ['thunder_phoenix'] },
      { id: 'sky_palace', name: '天门之外', description: '传说中的天门所在。', type: 'wild2', enemyPool: ['wind_spirit', 'cloud_beast'], levelRange: [65, 75], rareEnemyPool: ['thunder_phoenix', 'azure_dragon'] },
      { id: 'sky_gym', name: '苍穹道馆', description: '九天之上的玉石宫殿。', type: 'gym' },
    ],
    gymLeader: { name: '天尊', title: '九天之上', team: ['cloud_beast', 'wind_spirit', 'thunder_phoenix', 'azure_dragon'], teamLevels: [70, 74, 80, 88], intro: '九天之上，万法归一。', defeatText: '九天之上，你亦能至。' },
    unlockRequirement: 7, leaderImage: 'leader8',
  },
  {
    id: 9, name: '九州龙脉', description: '神州大地的核心所在。', theme: 'dragon', bgColor: '#1a0a0a',
    scenes: [
      { id: 'dragon_shrine', name: '龙神庙', description: '供奉龙神的古老庙宇。', type: 'camp' },
      { id: 'dragon_path', name: '龙脊古道', description: '沿龙脉脊背延伸的古道。', type: 'wild1', enemyPool: ['flood_dragon', 'yinglong_guard'], levelRange: [70, 80], rareEnemyPool: ['clawed_golden_dragon'] },
      { id: 'dragon_core', name: '祖龙之巢', description: '龙脉的中心。', type: 'wild2', enemyPool: ['flood_dragon', 'yinglong_guard'], levelRange: [78, 88], rareEnemyPool: ['clawed_golden_dragon'] },
      { id: 'dragon_gym', name: '龙脉圣殿', description: '混沌祖龙的栖息之地。', type: 'gym' },
    ],
    gymLeader: { name: '轩辕帝', title: '人皇', team: ['flood_dragon', 'yinglong_guard', 'clawed_golden_dragon', 'chaos_ancestral_dragon'], teamLevels: [82, 88, 95, 100], intro: '朕乃轩辕，人族之皇！', defeatText: '哈哈哈！终于有人能战胜朕！你已成为传说中的御灵大师！' },
    unlockRequirement: 8, leaderImage: 'leader9',
  },
];

export function getArea(id) {
  return AREAS.find(a => a.id === id);
}

export function getScene(areaId, sceneId) {
  const area = getArea(areaId);
  if (!area) return null;
  return area.scenes.find(s => s.id === sceneId);
}
