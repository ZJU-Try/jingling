// 技能数据
export const SKILLS = {
  // 普通系
  tackle: { id: 'tackle', name: '撞击', power: 0.5, pp: 30, element: 'normal', description: '用身体撞击对手' },
  scratch: { id: 'scratch', name: '抓挠', power: 0.5, pp: 30, element: 'normal', description: '用利爪抓挠对手' },
  quick_attack: { id: 'quick_attack', name: '急速突袭', power: 0.6, pp: 20, element: 'normal', description: '以极快的速度突袭对手' },
  body_slam: { id: 'body_slam', name: '猛撞', power: 1.0, pp: 15, element: 'normal', description: '用全身力量撞击对手' },
  mega_punch: { id: 'mega_punch', name: '重拳', power: 1.2, pp: 10, element: 'normal', description: '全力一击' },
  hyper_beam: { id: 'hyper_beam', name: '毁灭光束', power: 1.8, pp: 5, element: 'normal', description: '释放毁灭性能量' },
  // 火系
  ember: { id: 'ember', name: '火苗', power: 0.6, pp: 25, element: 'fire', description: '发射小火苗' },
  flame_burst: { id: 'flame_burst', name: '火焰喷射', power: 0.9, pp: 15, element: 'fire', description: '喷射火焰攻击' },
  fire_fang: { id: 'fire_fang', name: '烈焰牙', power: 1.1, pp: 10, element: 'fire', description: '用火焰包裹的牙齿撕咬' },
  inferno: { id: 'inferno', name: '地狱烈焰', power: 1.5, pp: 8, element: 'fire', description: '召唤地狱之火' },
  solar_flare: { id: 'solar_flare', name: '日曜焚天', power: 2.0, pp: 3, element: 'fire', description: '引动太阳真火焚烧一切' },
  // 水系
  water_gun: { id: 'water_gun', name: '水枪', power: 0.6, pp: 25, element: 'water', description: '喷射水流攻击' },
  aqua_jet: { id: 'aqua_jet', name: '水刃', power: 0.8, pp: 20, element: 'water', description: '用高压水流切割' },
  bubble_beam: { id: 'bubble_beam', name: '泡沫光线', power: 0.9, pp: 15, element: 'water', description: '发射泡沫光线' },
  hydro_pump: { id: 'hydro_pump', name: '水炮', power: 1.4, pp: 8, element: 'water', description: '发射高压水炮' },
  tsunami: { id: 'tsunami', name: '海啸灭世', power: 2.0, pp: 3, element: 'water', description: '召唤海啸吞没一切' },
  // 木系
  vine_whip: { id: 'vine_whip', name: '藤鞭', power: 0.6, pp: 25, element: 'wood', description: '用藤蔓抽打' },
  leaf_blade: { id: 'leaf_blade', name: '叶刃', power: 0.9, pp: 15, element: 'wood', description: '用锋利的叶片切割' },
  seed_bomb: { id: 'seed_bomb', name: '种子炸弹', power: 1.1, pp: 10, element: 'wood', description: '发射爆炸种子' },
  forest_rage: { id: 'forest_rage', name: '森林之怒', power: 1.5, pp: 8, element: 'wood', description: '召唤森林的力量' },
  nature_wrath: { id: 'nature_wrath', name: '自然之怒', power: 2.0, pp: 3, element: 'wood', description: '引动自然之怒' },
  // 土系
  rock_throw: { id: 'rock_throw', name: '掷石', power: 0.6, pp: 25, element: 'earth', description: '投掷岩石' },
  mud_slap: { id: 'mud_slap', name: '泥浆拍击', power: 0.7, pp: 20, element: 'earth', description: '用泥浆拍击对手' },
  rock_slide: { id: 'rock_slide', name: '落石', power: 1.1, pp: 10, element: 'earth', description: '让岩石坠落' },
  earthquake: { id: 'earthquake', name: '大地震', power: 1.5, pp: 8, element: 'earth', description: '引发地震' },
  mountain_collapse: { id: 'mountain_collapse', name: '山崩地裂', power: 2.0, pp: 3, element: 'earth', description: '召唤山崩之力' },
  // 金系
  metal_claw: { id: 'metal_claw', name: '金属爪', power: 0.7, pp: 25, element: 'metal', description: '用金属利爪攻击' },
  iron_slash: { id: 'iron_slash', name: '铁刃斩', power: 1.0, pp: 15, element: 'metal', description: '用铁刃斩击' },
  steel_cannon: { id: 'steel_cannon', name: '钢炮', power: 1.3, pp: 10, element: 'metal', description: '发射钢弹' },
  blade_storm: { id: 'blade_storm', name: '剑刃风暴', power: 1.6, pp: 8, element: 'metal', description: '召唤剑刃风暴' },
  meteor_blade: { id: 'meteor_blade', name: '陨星斩', power: 2.0, pp: 3, element: 'metal', description: '召唤陨星之力斩击' },
  // 雷系
  thunder_shock: { id: 'thunder_shock', name: '电击', power: 0.6, pp: 25, element: 'thunder', description: '释放微弱电流' },
  spark: { id: 'spark', name: '电火花', power: 0.8, pp: 20, element: 'thunder', description: '释放电火花' },
  thunder_fang: { id: 'thunder_fang', name: '雷电牙', power: 1.1, pp: 10, element: 'thunder', description: '用雷电包裹的牙齿撕咬' },
  thunderbolt: { id: 'thunderbolt', name: '雷电', power: 1.5, pp: 8, element: 'thunder', description: '召唤雷电轰击' },
  judgment_bolt: { id: 'judgment_bolt', name: '天罚神雷', power: 2.0, pp: 3, element: 'thunder', description: '召唤天罚之雷' },
  // 暗系
  shadow_ball: { id: 'shadow_ball', name: '暗影球', power: 0.7, pp: 25, element: 'dark', description: '投掷暗影能量球' },
  dark_pulse: { id: 'dark_pulse', name: '黑暗脉冲', power: 1.0, pp: 15, element: 'dark', description: '释放黑暗波动' },
  night_slash: { id: 'night_slash', name: '暗夜斩', power: 1.2, pp: 10, element: 'dark', description: '在黑暗中斩击' },
  soul_drain: { id: 'soul_drain', name: '噬魂', power: 1.4, pp: 8, element: 'dark', description: '吸取对手灵魂' },
  abyss_gaze: { id: 'abyss_gaze', name: '深渊凝视', power: 2.0, pp: 3, element: 'dark', description: '用深渊之力吞噬对手' },
  // 风系
  gust: { id: 'gust', name: '疾风', power: 0.6, pp: 25, element: 'wind', description: '刮起疾风' },
  air_slash: { id: 'air_slash', name: '空气斩', power: 0.9, pp: 15, element: 'wind', description: '用压缩空气斩击' },
  hurricane: { id: 'hurricane', name: '飓风', power: 1.3, pp: 10, element: 'wind', description: '召唤飓风' },
  tornado: { id: 'tornado', name: '龙卷风', power: 1.6, pp: 8, element: 'wind', description: '召唤龙卷风' },
  divine_wind: { id: 'divine_wind', name: '九天神风', power: 2.0, pp: 3, element: 'wind', description: '召唤九天之上的神风' },
  mercy: { id: 'mercy', name: '怜悯', power: 0.3, pp: 10, element: 'wind', description: '心怀怜悯的攻击，若伤害超过敌方剩余HP则敌方HP锁定为1点' },
  // 龙系
  dragon_breath: { id: 'dragon_breath', name: '龙息', power: 0.7, pp: 25, element: 'dragon', description: '吐出龙息' },
  dragon_claw: { id: 'dragon_claw', name: '龙爪', power: 1.1, pp: 15, element: 'dragon', description: '用龙爪撕裂' },
  draco_meteor: { id: 'draco_meteor', name: '龙星群', power: 1.5, pp: 8, element: 'dragon', description: '召唤龙星坠落' },
  dragon_fury: { id: 'dragon_fury', name: '龙怒', power: 1.8, pp: 5, element: 'dragon', description: '释放龙之怒火' },
  chaos_dragon: { id: 'chaos_dragon', name: '混沌龙灭', power: 2.0, pp: 3, element: 'dragon', description: '召唤混沌之龙毁灭一切' },
};

// 元素克制关系
export const ELEMENT_ADVANTAGE = {
  fire: { wood: 2.0, metal: 0.5, water: 0.5, fire: 0.5 },
  water: { fire: 2.0, earth: 0.5, wood: 2.0, water: 0.5 },
  wood: { earth: 2.0, water: 0.5, fire: 0.5, wood: 0.5 },
  earth: { thunder: 2.0, fire: 2.0, wood: 0.5, metal: 0.5, earth: 0.5 },
  metal: { wood: 2.0, earth: 2.0, fire: 0.5, metal: 0.5 },
  thunder: { water: 2.0, wind: 2.0, earth: 0.5, thunder: 0.5 },
  dark: { normal: 2.0, dragon: 0.5, dark: 0.5 },
  wind: { wood: 2.0, earth: 2.0, metal: 0.5, wind: 0.5 },
  dragon: { dragon: 1.5, normal: 1.0 },
  normal: {},
};

export const ELEMENT_COLORS = {
  normal: '#a0a0a0',
  fire: '#ff5544',
  water: '#3399ff',
  wood: '#44cc44',
  earth: '#cc8844',
  metal: '#cccccc',
  thunder: '#ffdd33',
  dark: '#9966cc',
  wind: '#88ddff',
  dragon: '#ff66cc',
};

export const ELEMENT_NAMES = {
  normal: '普通',
  fire: '火',
  water: '水',
  wood: '木',
  earth: '土',
  metal: '金',
  thunder: '雷',
  dark: '暗',
  wind: '风',
  dragon: '龙',
};

export function getElementMultiplier(attackElement, defenseElement) {
  const advantage = ELEMENT_ADVANTAGE[attackElement];
  if (!advantage) return 1.0;
  return advantage[defenseElement] || 1.0;
}
