import { SPIRIT_TEMPLATES, calculateStats, buildSkillLists } from '../data/spirits';

const RARE_ITEMS_BY_TIER = {
  1: ['shards'],
  2: ['shards', 'ancient_coin'],
  3: ['ancient_coin', 'old_jade'],
  4: ['old_jade', 'bronze_beast'],
  5: ['bronze_beast', 'gold_leaf'],
};

function getRareItemForArea(areaId) {
  if (Math.random() > 0.015) return null;
  let tier = 1;
  if (areaId >= 3) tier = 2;
  if (areaId >= 5) tier = 3;
  if (areaId >= 7) tier = 4;
  if (areaId >= 9) tier = 5;
  const items = RARE_ITEMS_BY_TIER[tier] || RARE_ITEMS_BY_TIER[1];
  return { itemId: items[Math.floor(Math.random() * items.length)], quantity: 1 };
}

export function explore(scene, areaId) {
  const rareDrop = getRareItemForArea(areaId);
  if (rareDrop) return { type: 'item', itemId: rareDrop.itemId, quantity: rareDrop.quantity };

  const roll = Math.random();
  if (roll < 0.40) {
    const enemy = generateEnemy(scene, areaId);
    if (enemy) return { type: 'enemy', enemy };
  }
  if (roll < 0.70) {
    const commonItems = ['herb', 'ether', 'capture_seal'];
    const rareItems = ['health_potion', 'advanced_capture_seal'];
    const pool = Math.random() < 0.1 ? rareItems : commonItems;
    return { type: 'item', itemId: pool[Math.floor(Math.random() * pool.length)], quantity: 1 };
  }
  if (roll < 0.85) {
    return { type: 'gold', amount: 10 + Math.floor(Math.random() * 30) + areaId * 5 };
  }
  return { type: 'nothing' };
}

export function getBattleRareDrop(areaId, enemyLevel) {
  if (Math.random() > 0.02) return null;
  let tier = 1;
  if (areaId >= 3 || enemyLevel >= 12) tier = 2;
  if (areaId >= 5 || enemyLevel >= 22) tier = 3;
  if (areaId >= 7 || enemyLevel >= 35) tier = 4;
  if (areaId >= 9 || enemyLevel >= 45) tier = 5;
  const items = RARE_ITEMS_BY_TIER[tier] || RARE_ITEMS_BY_TIER[1];
  return { itemId: items[Math.floor(Math.random() * items.length)], quantity: 1 };
}

export function generateEnemy(scene, areaId) {
  const pool = scene.enemyPool || [];
  const rarePool = scene.rareEnemyPool || [];
  if (pool.length === 0) return null;

  const isRare = rarePool.length > 0 && Math.random() < 0.08;
  const templateId = isRare ? rarePool[Math.floor(Math.random() * rarePool.length)] : pool[Math.floor(Math.random() * pool.length)];

  const template = SPIRIT_TEMPLATES[templateId];
  if (!template) return null;

  const [minLv, maxLv] = scene.levelRange || [1, 5];
  const level = Math.max(1, minLv + Math.floor(Math.random() * (maxLv - minLv + 1)));
  const stats = calculateStats(template.baseStats, level);
  const { equipped: skills } = buildSkillLists(templateId, level);

  return {
    templateId,
    name: template.name,
    element: template.element,
    level,
    hp: stats.maxHp,
    maxHp: stats.maxHp,
    atk: stats.atk,
    def: stats.def,
    spd: stats.spd,
    skills,
    captureRate: template.captureRate,
    goldReward: 20 + level * 3 + areaId * 5,
    expReward: 15 + level * 2 + areaId * 2,
  };
}

// 生成道馆挑战的敌方精灵
export function generateGymEnemy(templateId, level, areaId) {
  const template = SPIRIT_TEMPLATES[templateId];
  if (!template) return null;
  const stats = calculateStats(template.baseStats, level);
  const { equipped } = buildSkillLists(templateId, level);
  return {
    templateId,
    name: template.name,
    element: template.element,
    level,
    hp: stats.maxHp,
    maxHp: stats.maxHp,
    atk: stats.atk,
    def: stats.def,
    spd: stats.spd,
    skills: equipped,
    captureRate: 0, // 道馆精灵不可捕捉
    goldReward: 100 + level * 10 + areaId * 30,
    expReward: 50 + level * 5 + areaId * 10,
  };
}
