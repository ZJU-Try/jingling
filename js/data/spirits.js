import { SKILLS } from './skills';

// 基础精灵模板
export const SPIRIT_TEMPLATES = {
  // ========== 区域1: 青木原 ==========
  wild_dog: { id: 'wild_dog', name: '野狗', element: 'normal', baseStats: { hp: 25, atk: 10, def: 6, spd: 11 }, skills: ['tackle', 'quick_attack', 'body_slam'], learnLevels: [1, 3, 7], captureRate: 0.7, description: '在森林中游荡的野狗。' },
  tree_sprite: { id: 'tree_sprite', name: '小树妖', element: 'wood', baseStats: { hp: 30, atk: 8, def: 10, spd: 6 }, skills: ['vine_whip', 'leaf_blade', 'seed_bomb'], learnLevels: [1, 4, 8], captureRate: 0.65, description: '青木原常见的树精灵。' },
  spirit_fox: { id: 'spirit_fox', name: '灵狐', element: 'wind', baseStats: { hp: 28, atk: 12, def: 7, spd: 14 }, skills: ['scratch', 'gust', 'air_slash', 'mercy'], learnLevels: [1, 3, 8, 13], captureRate: 0.3, description: '传说中的灵狐，身姿飘逸。', evolution: { templateId: 'spirit_fox_ev1', levelRequired: 25, evolveMessage: '灵狐尾巴分裂成九条——进化成了九尾灵狐！' } },
  iron_turtle: { id: 'iron_turtle', name: '铁甲龟', element: 'earth', baseStats: { hp: 40, atk: 8, def: 15, spd: 4 }, skills: ['tackle', 'rock_throw', 'rock_slide'], learnLevels: [1, 3, 8], captureRate: 0.5, description: '背负坚硬甲壳的乌龟。' },
  golden_butterfly: { id: 'golden_butterfly', name: '金翅蝶', element: 'wind', baseStats: { hp: 22, atk: 14, def: 5, spd: 16 }, skills: ['gust', 'air_slash', 'hurricane'], learnLevels: [1, 5, 10], captureRate: 0.2, description: '翅膀闪耀金色光芒的稀有蝴蝶。' },

  // ========== 区域2: 赤焰沙漠 ==========
  sand_worm: { id: 'sand_worm', name: '沙虫', element: 'earth', baseStats: { hp: 35, atk: 14, def: 12, spd: 8 }, skills: ['rock_throw', 'mud_slap', 'rock_slide'], learnLevels: [1, 5, 12], captureRate: 0.6, description: '潜伏在沙漠地下的巨型蠕虫。' },
  fire_lizard: { id: 'fire_lizard', name: '火蜥蜴', element: 'fire', baseStats: { hp: 32, atk: 16, def: 10, spd: 13 }, skills: ['ember', 'flame_burst', 'fire_fang'], learnLevels: [1, 5, 12], captureRate: 0.55, description: '高温沙地中生存的火属性蜥蜴。', evolution: { templateId: 'fire_lizard_ev1', levelRequired: 30, evolveMessage: '火蜥蜴的体型急剧膨胀——进化成了烈焰龙！' } },
  scorpion_king: { id: 'scorpion_king', name: '毒蝎', element: 'earth', baseStats: { hp: 30, atk: 18, def: 14, spd: 10 }, skills: ['scratch', 'metal_claw', 'iron_slash'], learnLevels: [1, 6, 13], captureRate: 0.45, description: '尾巴带有剧毒的沙漠蝎子。' },
  flame_bird: { id: 'flame_bird', name: '赤焰鸟', element: 'fire', baseStats: { hp: 38, atk: 20, def: 10, spd: 18 }, skills: ['ember', 'flame_burst', 'inferno'], learnLevels: [1, 8, 16], captureRate: 0.2, description: '传说中的火鸟。', evolution: { templateId: 'flame_bird_ev1', levelRequired: 40, evolveMessage: '赤焰鸟浑身浴火——进化成了火凤凰！' } },
  magma_beast: { id: 'magma_beast', name: '熔岩巨兽', element: 'fire', baseStats: { hp: 55, atk: 22, def: 18, spd: 10 }, skills: ['ember', 'flame_burst', 'fire_fang', 'inferno'], learnLevels: [1, 5, 10, 18], captureRate: 0.15, description: '由熔岩凝聚而成的巨兽。' },

  // ========== 区域3: 黑水沼泽 ==========
  poison_frog: { id: 'poison_frog', name: '毒蛙', element: 'water', baseStats: { hp: 35, atk: 16, def: 12, spd: 14 }, skills: ['water_gun', 'bubble_beam', 'mud_slap'], learnLevels: [1, 6, 14], captureRate: 0.6, description: '皮肤上覆盖着剧毒粘液的青蛙。' },
  leech_spirit: { id: 'leech_spirit', name: '水蛭精', element: 'water', baseStats: { hp: 38, atk: 14, def: 16, spd: 9 }, skills: ['water_gun', 'aqua_jet', 'soul_drain'], learnLevels: [1, 6, 14], captureRate: 0.5, description: '修炼成精的水蛭。' },
  mud_golem: { id: 'mud_golem', name: '泥浆傀儡', element: 'earth', baseStats: { hp: 45, atk: 16, def: 20, spd: 5 }, skills: ['rock_throw', 'mud_slap', 'rock_slide', 'earthquake'], learnLevels: [1, 5, 12, 20], captureRate: 0.45, description: '由沼泽泥浆凝聚而成的傀儡。' },
  mysterious_water_snake: { id: 'mysterious_water_snake', name: '玄水蛇', element: 'water', baseStats: { hp: 40, atk: 22, def: 14, spd: 20 }, skills: ['water_gun', 'aqua_jet', 'hydro_pump'], learnLevels: [1, 8, 18], captureRate: 0.2, description: '通体幽蓝的神秘水蛇。', evolution: { templateId: 'mysterious_water_snake_ev1', levelRequired: 50, evolveMessage: '玄水蛇头顶生出龙角——进化成了蛟龙！' } },
  hydra: { id: 'hydra', name: '九头蛇', element: 'water', baseStats: { hp: 60, atk: 24, def: 20, spd: 12 }, skills: ['water_gun', 'bubble_beam', 'soul_drain', 'hydro_pump'], learnLevels: [1, 5, 12, 25], captureRate: 0.1, description: '拥有九个头颅的恐怖水蛇。' },

  // ========== 区域4: 金戈荒原 ==========
  terracotta_warrior: { id: 'terracotta_warrior', name: '兵俑', element: 'earth', baseStats: { hp: 45, atk: 20, def: 22, spd: 7 }, skills: ['tackle', 'rock_throw', 'metal_claw', 'iron_slash'], learnLevels: [1, 5, 12, 22], captureRate: 0.5, description: '古代战场遗留的陶土兵俑。' },
  gold_eater: { id: 'gold_eater', name: '食金兽', element: 'metal', baseStats: { hp: 42, atk: 24, def: 18, spd: 12 }, skills: ['scratch', 'metal_claw', 'iron_slash', 'steel_cannon'], learnLevels: [1, 6, 14, 24], captureRate: 0.4, description: '以金属为食的奇异灵兽。' },
  rusty_blade: { id: 'rusty_blade', name: '锈刀魂', element: 'metal', baseStats: { hp: 38, atk: 26, def: 14, spd: 16 }, skills: ['scratch', 'metal_claw', 'blade_storm'], learnLevels: [1, 8, 20], captureRate: 0.35, description: '遗弃在战场上的古刀所化的刀灵。' },
  flying_sword_spirit: { id: 'flying_sword_spirit', name: '飞剑灵', element: 'metal', baseStats: { hp: 40, atk: 28, def: 12, spd: 24 }, skills: ['air_slash', 'metal_claw', 'blade_storm', 'meteor_blade'], learnLevels: [1, 8, 18, 30], captureRate: 0.15, description: '能够御剑飞行的剑灵。', evolution: { templateId: 'flying_sword_spirit_ev1', levelRequired: 60, evolveMessage: '万剑归宗——进化成了万剑灵！' } },
  mechanical_beast: { id: 'mechanical_beast', name: '机关巨兽', element: 'metal', baseStats: { hp: 70, atk: 28, def: 28, spd: 8 }, skills: ['tackle', 'metal_claw', 'steel_cannon', 'blade_storm'], learnLevels: [1, 5, 15, 35], captureRate: 0.1, description: '古代机关术的最高杰作。' },

  // ========== 区域5: 土息山脉 ==========
  rock_monster: { id: 'rock_monster', name: '岩怪', element: 'earth', baseStats: { hp: 50, atk: 22, def: 26, spd: 6 }, skills: ['rock_throw', 'mud_slap', 'rock_slide', 'earthquake'], learnLevels: [1, 5, 14, 28], captureRate: 0.5, description: '由山间巨石成精的怪物。' },
  pangolin: { id: 'pangolin', name: '穿山甲', element: 'earth', baseStats: { hp: 48, atk: 24, def: 28, spd: 10 }, skills: ['scratch', 'metal_claw', 'rock_slide'], learnLevels: [1, 6, 16], captureRate: 0.45, description: '身披坚硬鳞甲的穿山甲。' },
  cave_bat: { id: 'cave_bat', name: '洞穴蝙蝠', element: 'dark', baseStats: { hp: 38, atk: 20, def: 12, spd: 22 }, skills: ['scratch', 'shadow_ball', 'dark_pulse'], learnLevels: [1, 5, 14], captureRate: 0.4, description: '栖息在黑暗洞穴中的蝙蝠群。' },
  rock_dragon: { id: 'rock_dragon', name: '岩龙幼崽', element: 'dragon', baseStats: { hp: 52, atk: 26, def: 24, spd: 14 }, skills: ['dragon_breath', 'dragon_claw', 'draco_meteor'], learnLevels: [1, 10, 22], captureRate: 0.15, description: '土息山脉深处生活的幼年岩龙。', evolution: { templateId: 'rock_dragon_ev1', levelRequired: 70, evolveMessage: '岩龙幼崽体型急剧膨胀——进化成了岩龙！' } },
  mountain_giant: { id: 'mountain_giant', name: '山岭巨人', element: 'earth', baseStats: { hp: 85, atk: 28, def: 32, spd: 5 }, skills: ['rock_throw', 'rock_slide', 'earthquake', 'mountain_collapse'], learnLevels: [1, 8, 18, 42], captureRate: 0.08, description: '由整座山峰化形的巨人。' },

  // ========== 区域6: 雷霆峡谷 ==========
  thunder_hawk: { id: 'thunder_hawk', name: '雷鹰', element: 'thunder', baseStats: { hp: 45, atk: 26, def: 16, spd: 26 }, skills: ['thunder_shock', 'spark', 'thunder_fang'], learnLevels: [1, 6, 16], captureRate: 0.45, description: '在雷暴中翱翔的猛禽。' },
  lightning_rat: { id: 'lightning_rat', name: '电光鼠', element: 'thunder', baseStats: { hp: 38, atk: 24, def: 12, spd: 32 }, skills: ['quick_attack', 'thunder_shock', 'spark'], learnLevels: [1, 5, 14], captureRate: 0.4, description: '速度快如闪电的小鼠。' },
  storm_wolf: { id: 'storm_wolf', name: '风暴狼', element: 'wind', baseStats: { hp: 48, atk: 28, def: 18, spd: 28 }, skills: ['scratch', 'gust', 'air_slash', 'hurricane'], learnLevels: [1, 5, 14, 28], captureRate: 0.35, description: '在峡谷风暴中出没的狼群首领。' },
  thunder_kirin: { id: 'thunder_kirin', name: '雷麒麟', element: 'thunder', baseStats: { hp: 55, atk: 32, def: 22, spd: 26 }, skills: ['thunder_shock', 'spark', 'thunderbolt', 'judgment_bolt'], learnLevels: [1, 8, 20, 35], captureRate: 0.12, description: '传说中的雷之圣兽。', evolution: { templateId: 'thunder_kirin_ev1', levelRequired: 80, evolveMessage: '雷麒麟周身雷电暴涨——进化成了雷神兽！' } },
  purple_thunder_dragon: { id: 'purple_thunder_dragon', name: '紫电狂龙', element: 'thunder', baseStats: { hp: 75, atk: 35, def: 24, spd: 30 }, skills: ['thunder_shock', 'thunder_fang', 'thunderbolt', 'judgment_bolt'], learnLevels: [1, 8, 18, 55], captureRate: 0.08, description: '掌控紫电的狂暴雷龙。' },

  // ========== 区域7: 幽冥鬼域 ==========
  lonely_ghost: { id: 'lonely_ghost', name: '孤魂', element: 'dark', baseStats: { hp: 42, atk: 24, def: 14, spd: 24 }, skills: ['shadow_ball', 'dark_pulse', 'night_slash'], learnLevels: [1, 6, 16], captureRate: 0.5, description: '幽冥鬼域中徘徊的孤独灵魂。' },
  zombie_dog: { id: 'zombie_dog', name: '僵尸犬', element: 'dark', baseStats: { hp: 52, atk: 28, def: 22, spd: 12 }, skills: ['tackle', 'scratch', 'shadow_ball', 'night_slash'], learnLevels: [1, 5, 12, 24], captureRate: 0.45, description: '被黑暗力量复活的亡犬。' },
  soul_reaper: { id: 'soul_reaper', name: '勾魂使', element: 'dark', baseStats: { hp: 48, atk: 30, def: 18, spd: 28 }, skills: ['shadow_ball', 'dark_pulse', 'night_slash', 'soul_drain'], learnLevels: [1, 6, 16, 32], captureRate: 0.25, description: '手持镰刀的死神使者。' },
  ghost_general: { id: 'ghost_general', name: '鬼将', element: 'dark', baseStats: { hp: 60, atk: 34, def: 26, spd: 22 }, skills: ['metal_claw', 'dark_pulse', 'night_slash', 'abyss_gaze'], learnLevels: [1, 8, 20, 40], captureRate: 0.12, description: '古代战死的将军所化的厉鬼。' },
  judge_pen: { id: 'judge_pen', name: '判官笔', element: 'dark', baseStats: { hp: 70, atk: 38, def: 28, spd: 26 }, skills: ['shadow_ball', 'soul_drain', 'night_slash', 'abyss_gaze'], learnLevels: [1, 8, 18, 45], captureRate: 0.06, description: '幽冥之主的书写工具。' },

  // ========== 区域8: 苍穹云海 ==========
  cloud_beast: { id: 'cloud_beast', name: '云兽', element: 'wind', baseStats: { hp: 52, atk: 28, def: 22, spd: 26 }, skills: ['gust', 'air_slash', 'hurricane'], learnLevels: [1, 6, 18], captureRate: 0.45, description: '由云朵凝聚而成的灵兽。' },
  wind_spirit: { id: 'wind_spirit', name: '风灵', element: 'wind', baseStats: { hp: 48, atk: 26, def: 18, spd: 32 }, skills: ['gust', 'air_slash', 'tornado', 'divine_wind'], learnLevels: [1, 6, 16, 35], captureRate: 0.35, description: '风之元素的化身。' },
  thunder_phoenix: { id: 'thunder_phoenix', name: '凤凰', element: 'fire', baseStats: { hp: 65, atk: 36, def: 26, spd: 30 }, skills: ['ember', 'flame_burst', 'inferno', 'solar_flare'], learnLevels: [1, 8, 20, 45], captureRate: 0.1, description: '浴火重生的神鸟。', evolution: { templateId: 'thunder_phoenix_ev1', levelRequired: 100, evolveMessage: '凤凰浴火重生——进化成了朱雀！' } },
  azure_dragon: { id: 'azure_dragon', name: '四象青龙', element: 'dragon', baseStats: { hp: 85, atk: 38, def: 32, spd: 34 }, skills: ['dragon_breath', 'dragon_claw', 'draco_meteor', 'dragon_fury'], learnLevels: [1, 8, 18, 50], captureRate: 0.06, description: '镇守东方的四象神兽之一。' },

  // ========== 区域9: 九州龙脉 ==========
  flood_dragon: { id: 'flood_dragon', name: '蛟龙', element: 'dragon', baseStats: { hp: 60, atk: 32, def: 26, spd: 28 }, skills: ['water_gun', 'dragon_breath', 'dragon_claw', 'hydro_pump'], learnLevels: [1, 6, 14, 30], captureRate: 0.3, description: '尚未完全化龙的蛟。' },
  yinglong_guard: { id: 'yinglong_guard', name: '应龙守卫', element: 'dragon', baseStats: { hp: 72, atk: 36, def: 32, spd: 26 }, skills: ['dragon_breath', 'dragon_claw', 'draco_meteor', 'chaos_dragon'], learnLevels: [1, 8, 20, 45], captureRate: 0.15, description: '应龙后裔，龙脉的忠诚守卫者。' },
  clawed_golden_dragon: { id: 'clawed_golden_dragon', name: '五爪金龙', element: 'dragon', baseStats: { hp: 80, atk: 42, def: 36, spd: 32 }, skills: ['dragon_breath', 'dragon_claw', 'dragon_fury', 'chaos_dragon'], learnLevels: [1, 10, 28, 50], captureRate: 0.08, description: '龙族中的皇者。', evolution: { templateId: 'clawed_golden_dragon_ev1', levelRequired: 100, evolveMessage: '五爪金龙觉醒混沌之力——觉醒为混沌祖龙！' } },
  chaos_ancestral_dragon: { id: 'chaos_ancestral_dragon', name: '混沌祖龙', element: 'dragon', baseStats: { hp: 120, atk: 50, def: 40, spd: 38 }, skills: ['dragon_breath', 'draco_meteor', 'dragon_fury', 'chaos_dragon'], learnLevels: [1, 10, 25, 60], captureRate: 0.0, description: '龙族始祖。' },

  // ========== 初始精灵 ==========
  danta: { id: 'danta', name: '蛋挞', element: 'dark', baseStats: { hp: 26, atk: 14, def: 7, spd: 13 }, skills: ['scratch', 'shadow_ball', 'dark_pulse'], learnLevels: [1, 1, 8], captureRate: 0, description: '深灰虎斑长毛猫，敏锐而狡黠。', evolution: { templateId: 'danta_ev1', levelRequired: 20, evolveMessage: '蛋挞的身体被暗影之力包裹——进化成了暗影猫！' } },
  xiaobai: { id: 'xiaobai', name: '小白', element: 'water', baseStats: { hp: 28, atk: 11, def: 11, spd: 10 }, skills: ['scratch', 'water_gun', 'bubble_beam'], learnLevels: [1, 1, 8], captureRate: 0, description: '纯白长毛猫，水元素亲和力极强。', evolution: { templateId: 'xiaobai_ev1', levelRequired: 20, evolveMessage: '小白的毛发如月光下的波浪般流动——进化成了水月猫！' } },
  maidou: { id: 'maidou', name: '麦兜', element: 'normal', baseStats: { hp: 32, atk: 8, def: 15, spd: 5 }, skills: ['tackle', 'body_slam', 'mega_punch'], learnLevels: [1, 1, 8], captureRate: 0, description: '金渐层圆脸长毛猫，强壮可靠。', evolution: { templateId: 'maidou_ev1', levelRequired: 20, evolveMessage: '麦兜的金色毛发更加璀璨夺目——进化成了金辉猫！' } },
  xiaoyuan: { id: 'xiaoyuan', name: '小袁', element: 'wood', baseStats: { hp: 36, atk: 7, def: 12, spd: 5 }, skills: ['tackle', 'vine_whip', 'seed_bomb'], learnLevels: [1, 1, 8], captureRate: 0, description: '圆滚滚的短毛猫，与自然深度连接。', evolution: { templateId: 'xiaoyuan_ev1', levelRequired: 20, evolveMessage: '小袁的身体周围长出藤蔓和绿叶——进化成了森灵猫！' } },
  heimei: { id: 'heimei', name: '黑妹', element: 'thunder', baseStats: { hp: 20, atk: 12, def: 5, spd: 23 }, skills: ['scratch', 'thunder_shock', 'spark'], learnLevels: [1, 1, 8], captureRate: 0, description: '漆黑发亮的小狗，速度极快如闪电。', evolution: { templateId: 'heimei_ev1', levelRequired: 20, evolveMessage: '黑妹周身雷光闪耀——进化成了闪电犬！' } },
};

// 进化形态精灵
export const EVOLUTION_TEMPLATES = {
  danta_ev1: { id: 'danta_ev1', name: '暗影猫', element: 'dark', baseStats: { hp: 38, atk: 22, def: 14, spd: 24 }, skills: ['scratch', 'shadow_ball', 'dark_pulse', 'night_slash', 'soul_drain'], learnLevels: [1, 1, 8, 22, 38], captureRate: 0, description: '蛋挞进化后的形态。', evolution: { templateId: 'danta_ev2', levelRequired: 45, evolveMessage: '暗影猫缠绕冥界之气——进化成了冥府猫！' } },
  danta_ev2: { id: 'danta_ev2', name: '冥府猫', element: 'dark', baseStats: { hp: 55, atk: 35, def: 22, spd: 36 }, skills: ['scratch', 'shadow_ball', 'dark_pulse', 'night_slash', 'soul_drain', 'abyss_gaze'], learnLevels: [1, 1, 8, 22, 38, 55], captureRate: 0, description: '蛋挞的最终进化形态。' },
  xiaobai_ev1: { id: 'xiaobai_ev1', name: '水月猫', element: 'water', baseStats: { hp: 35, atk: 25, def: 16, spd: 18 }, skills: ['scratch', 'water_gun', 'bubble_beam', 'aqua_jet', 'hydro_pump'], learnLevels: [1, 1, 8, 22, 38], captureRate: 0, description: '小白进化后的形态。', evolution: { templateId: 'xiaobai_ev2', levelRequired: 45, evolveMessage: '水月猫如海洋之主降临——进化成了海皇猫！' } },
  xiaobai_ev2: { id: 'xiaobai_ev2', name: '海皇猫', element: 'water', baseStats: { hp: 52, atk: 38, def: 26, spd: 28 }, skills: ['scratch', 'water_gun', 'bubble_beam', 'aqua_jet', 'hydro_pump', 'tsunami'], learnLevels: [1, 1, 8, 22, 38, 55], captureRate: 0, description: '小白的最终进化形态。' },
  maidou_ev1: { id: 'maidou_ev1', name: '金辉猫', element: 'metal', baseStats: { hp: 55, atk: 18, def: 28, spd: 10 }, skills: ['tackle', 'body_slam', 'mega_punch', 'metal_claw', 'iron_slash'], learnLevels: [1, 1, 8, 22, 38], captureRate: 0, description: '麦兜进化后的形态。', evolution: { templateId: 'maidou_ev2', levelRequired: 45, evolveMessage: '金辉猫全身金光暴涨——进化成了金皇猫！' } },
  maidou_ev2: { id: 'maidou_ev2', name: '金皇猫', element: 'metal', baseStats: { hp: 80, atk: 28, def: 42, spd: 14 }, skills: ['tackle', 'body_slam', 'mega_punch', 'metal_claw', 'iron_slash', 'blade_storm'], learnLevels: [1, 1, 8, 22, 38, 55], captureRate: 0, description: '麦兜的最终进化形态。' },
  xiaoyuan_ev1: { id: 'xiaoyuan_ev1', name: '森灵猫', element: 'wood', baseStats: { hp: 52, atk: 12, def: 22, spd: 8 }, skills: ['tackle', 'vine_whip', 'seed_bomb', 'leaf_blade', 'forest_rage'], learnLevels: [1, 1, 8, 22, 38], captureRate: 0, description: '小袁进化后的形态。', evolution: { templateId: 'xiaoyuan_ev2', levelRequired: 45, evolveMessage: '森灵猫化为森林的化身——进化成了森之王！' } },
  xiaoyuan_ev2: { id: 'xiaoyuan_ev2', name: '森之王', element: 'wood', baseStats: { hp: 80, atk: 22, def: 38, spd: 14 }, skills: ['tackle', 'vine_whip', 'seed_bomb', 'leaf_blade', 'nature_wrath'], learnLevels: [1, 1, 8, 22, 45], captureRate: 0, description: '小袁的最终进化形态。' },
  heimei_ev1: { id: 'heimei_ev1', name: '闪电犬', element: 'thunder', baseStats: { hp: 38, atk: 18, def: 12, spd: 30 }, skills: ['scratch', 'thunder_shock', 'spark', 'thunder_fang', 'thunderbolt'], learnLevels: [1, 1, 8, 22, 38], captureRate: 0, description: '黑妹进化后的形态。', evolution: { templateId: 'heimei_ev2', levelRequired: 45, evolveMessage: '闪电犬引动天雷附体——进化成了雷神犬！' } },
  heimei_ev2: { id: 'heimei_ev2', name: '雷神犬', element: 'thunder', baseStats: { hp: 58, atk: 30, def: 20, spd: 48 }, skills: ['scratch', 'thunder_shock', 'spark', 'thunder_fang', 'judgment_bolt'], learnLevels: [1, 1, 8, 22, 45], captureRate: 0, description: '黑妹的最终进化形态。' },
  spirit_fox_ev1: { id: 'spirit_fox_ev1', name: '九尾灵狐', element: 'wind', baseStats: { hp: 45, atk: 26, def: 16, spd: 30 }, skills: ['scratch', 'gust', 'air_slash', 'hurricane', 'tornado'], learnLevels: [1, 3, 8, 22, 38], captureRate: 0, description: '灵狐进化后的九尾形态。' },
  fire_lizard_ev1: { id: 'fire_lizard_ev1', name: '烈焰龙', element: 'fire', baseStats: { hp: 55, atk: 32, def: 20, spd: 22 }, skills: ['ember', 'flame_burst', 'fire_fang', 'inferno', 'solar_flare'], learnLevels: [1, 5, 12, 28, 45], captureRate: 0, description: '火蜥蜴进化后的龙形态。' },
  flame_bird_ev1: { id: 'flame_bird_ev1', name: '火凤凰', element: 'fire', baseStats: { hp: 72, atk: 42, def: 30, spd: 38 }, skills: ['ember', 'flame_burst', 'inferno', 'solar_flare'], learnLevels: [1, 8, 25, 50], captureRate: 0, description: '赤焰鸟进化后的凤凰形态。' },
  mysterious_water_snake_ev1: { id: 'mysterious_water_snake_ev1', name: '蛟龙', element: 'dragon', baseStats: { hp: 68, atk: 38, def: 28, spd: 32 }, skills: ['water_gun', 'aqua_jet', 'hydro_pump', 'dragon_breath', 'dragon_claw'], learnLevels: [1, 8, 18, 35, 55], captureRate: 0, description: '玄水蛇化龙后的形态。' },
  flying_sword_spirit_ev1: { id: 'flying_sword_spirit_ev1', name: '万剑灵', element: 'metal', baseStats: { hp: 60, atk: 48, def: 22, spd: 40 }, skills: ['air_slash', 'metal_claw', 'blade_storm', 'meteor_blade'], learnLevels: [1, 8, 25, 55], captureRate: 0, description: '万剑归宗的剑灵。' },
  rock_dragon_ev1: { id: 'rock_dragon_ev1', name: '岩龙', element: 'dragon', baseStats: { hp: 78, atk: 40, def: 42, spd: 22 }, skills: ['dragon_breath', 'dragon_claw', 'draco_meteor', 'dragon_fury', 'earthquake'], learnLevels: [1, 10, 22, 40, 60], captureRate: 0, description: '岩龙幼崽成长后的完全体。' },
  thunder_kirin_ev1: { id: 'thunder_kirin_ev1', name: '雷神兽', element: 'thunder', baseStats: { hp: 80, atk: 48, def: 35, spd: 42 }, skills: ['thunder_shock', 'spark', 'thunderbolt', 'judgment_bolt'], learnLevels: [1, 8, 28, 60], captureRate: 0, description: '雷麒麟的最终形态。' },
  thunder_phoenix_ev1: { id: 'thunder_phoenix_ev1', name: '朱雀', element: 'fire', baseStats: { hp: 95, atk: 55, def: 42, spd: 48 }, skills: ['ember', 'flame_burst', 'inferno', 'solar_flare'], learnLevels: [1, 10, 30, 65], captureRate: 0, description: '凤凰浴火重生后的朱雀形态。' },
  clawed_golden_dragon_ev1: { id: 'clawed_golden_dragon_ev1', name: '混沌祖龙', element: 'dragon', baseStats: { hp: 130, atk: 58, def: 48, spd: 45 }, skills: ['dragon_breath', 'dragon_claw', 'dragon_fury', 'chaos_dragon'], learnLevels: [1, 12, 35, 70], captureRate: 0, description: '五爪金龙觉醒混沌之力后的终极形态。' },
};

export function getTemplate(templateId) {
  return SPIRIT_TEMPLATES[templateId] || EVOLUTION_TEMPLATES[templateId];
}

// 根据等级计算属性
export function calculateStats(baseStats, level) {
  const scale = 1 + (level - 1) * 0.18;
  return {
    maxHp: Math.max(1, Math.round(baseStats.hp * scale)),
    atk: Math.max(1, Math.round(baseStats.atk * scale)),
    def: Math.max(1, Math.round(baseStats.def * scale)),
    spd: Math.max(1, Math.round(baseStats.spd * scale)),
  };
}

export function calculateEvolutionStats(baseStats, level) {
  const scale = 1 + (level - 1) * 0.18;
  const evoBonus = 1.3;
  return {
    maxHp: Math.max(1, Math.round(baseStats.hp * scale * evoBonus)),
    atk: Math.max(1, Math.round(baseStats.atk * scale * evoBonus)),
    def: Math.max(1, Math.round(baseStats.def * scale * evoBonus)),
    spd: Math.max(1, Math.round(baseStats.spd * scale * evoBonus)),
  };
}

export function getExpToNextLevel(level) {
  return Math.floor(10 * Math.pow(level, 1.5));
}

// 查找进化链
function findEvolutionChain(templateId) {
  function findPreEvolution(tid) {
    for (const tmpl of Object.values(SPIRIT_TEMPLATES)) {
      if (tmpl.evolution && tmpl.evolution.templateId === tid) return tmpl;
    }
    for (const tmpl of Object.values(EVOLUTION_TEMPLATES)) {
      if (tmpl.evolution && tmpl.evolution.templateId === tid) return tmpl;
    }
    return undefined;
  }

  const chainIds = [templateId];
  let pre = findPreEvolution(templateId);
  while (pre) {
    chainIds.unshift(pre.id);
    pre = findPreEvolution(pre.id);
  }

  return chainIds.map(id => SPIRIT_TEMPLATES[id] || EVOLUTION_TEMPLATES[id]).filter(Boolean);
}

// 构建技能列表（含进化链），按 learnLevel 降序取前4个为装备技能
export function buildSkillLists(templateId, level) {
  const chain = findEvolutionChain(templateId);
  const allSkills = [];

  chain.forEach(template => {
    template.skills.forEach((skillId, idx) => {
      if (template.learnLevels[idx] <= level) {
        const skill = SKILLS[skillId];
        if (skill && !allSkills.find(s => s.skill.id === skillId)) {
          allSkills.push({ skill, learnLevel: template.learnLevels[idx] });
        }
      }
    });
  });

  allSkills.sort((a, b) => b.learnLevel - a.learnLevel);

  return {
    equipped: allSkills.slice(0, 4).map(s => s.skill),
    backup: allSkills.slice(4).map(s => s.skill),
  };
}

// 通过模板创建一只精灵实例
export function createSpiritInstance(templateId, level, isStarter = false) {
  const template = getTemplate(templateId);
  if (!template) return null;
  const stats = calculateStats(template.baseStats, level);
  const { equipped, backup } = buildSkillLists(templateId, level);

  return {
    instanceId: (isStarter ? 'starter_' : 'wild_') + templateId + '_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    templateId,
    nickname: template.name,
    level,
    exp: 0,
    expToNext: getExpToNextLevel(level),
    hp: stats.maxHp,
    maxHp: stats.maxHp,
    atk: stats.atk,
    def: stats.def,
    spd: stats.spd,
    skills: equipped,
    backupSkills: backup,
    pp: Object.fromEntries([...equipped, ...backup].map(s => [s.id, s.pp])),
    element: template.element,
    learnedSkillIds: [...equipped, ...backup].map(s => s.id),
  };
}
