import { getElementMultiplier } from '../data/skills';

// 伤害计算
export function calculateDamage(attacker, defender, skill) {
  const hitChance = 0.95;
  if (Math.random() > hitChance) {
    return { damage: 0, isCritical: false, isMiss: true };
  }
  let damage = Math.max(1, Math.floor(attacker.atk * skill.power - defender.def * 0.5));
  const elementMultiplier = getElementMultiplier(skill.element, defender.element);
  damage = Math.floor(damage * elementMultiplier);
  const randomFactor = 0.9 + Math.random() * 0.2;
  damage = Math.floor(damage * randomFactor);
  const isCritical = Math.random() < 0.1;
  if (isCritical) damage = Math.floor(damage * 1.5);
  return { damage: Math.max(1, damage), isCritical, isMiss: false };
}

// 敌方AI选择动作
export function enemyAIChooseAction(enemy) {
  const skills = enemy.skills.slice().sort((a, b) => b.power - a.power);
  if (Math.random() < 0.8 && skills.length > 0) {
    return { skill: skills[0] };
  }
  return { skill: { id: 'basic_attack', name: '普通攻击', power: 0.4, pp: 999, element: enemy.element, description: '普通攻击' } };
}

// 逃跑成功率
export function calculateFleeChance(playerSpd, enemySpd) {
  const baseChance = 0.5;
  const spdRatio = playerSpd / Math.max(enemySpd, 1);
  return Math.min(0.9, baseChance * spdRatio);
}

// 先手判定
export function determineFirst(playerSpd, enemySpd) {
  if (playerSpd === enemySpd) return Math.random() < 0.5 ? 'player' : 'enemy';
  return playerSpd > enemySpd ? 'player' : 'enemy';
}

// 执行玩家攻击/技能
export function executePlayerSkill(playerSpirit, enemySpirit, skill) {
  const { damage, isCritical, isMiss } = calculateDamage(playerSpirit, enemySpirit, skill);
  if (isMiss) {
    return { message: `${playerSpirit.nickname}的${skill.name}没有命中！`, damage: 0 };
  }

  let newHp;
  let mercyText = '';
  if (skill.id === 'mercy') {
    if (enemySpirit.hp <= 1) { newHp = 1; mercyText = ' 怜悯之心生效，敌方HP锁定为1点！'; }
    else if (damage >= enemySpirit.hp) { newHp = 1; mercyText = ' 怜悯之心生效，敌方HP锁定为1点！'; }
    else newHp = Math.max(0, enemySpirit.hp - damage);
  } else {
    newHp = Math.max(0, enemySpirit.hp - damage);
  }

  const critText = isCritical ? '暴击！' : '';
  const elementMult = getElementMultiplier(skill.element, enemySpirit.element);
  const elementText = elementMult > 1 ? ' 效果拔群！' : elementMult < 1 ? ' 效果不佳...' : '';

  return {
    damage, isCritical, newEnemyHp: newHp,
    message: `${playerSpirit.nickname}使用${skill.name}！${critText}造成${damage}点伤害！${mercyText}${elementText}`,
  };
}

// 执行敌方动作
export function executeEnemyAction(enemySpirit, playerSpirit) {
  const { skill } = enemyAIChooseAction(enemySpirit);
  const { damage, isCritical, isMiss } = calculateDamage(
    { atk: enemySpirit.atk, element: enemySpirit.element },
    { def: playerSpirit.def, element: playerSpirit.element },
    skill
  );
  if (isMiss) {
    return { message: `${enemySpirit.name}的${skill.name}没有命中！`, damage: 0 };
  }
  const newHp = Math.max(0, playerSpirit.hp - damage);
  const critText = isCritical ? '暴击！' : '';
  const elementMult = getElementMultiplier(skill.element, playerSpirit.element);
  const elementText = elementMult > 1 ? ' 效果拔群！' : elementMult < 1 ? ' 效果不佳...' : '';
  return {
    damage, isCritical, newPlayerHp: newHp,
    message: `${enemySpirit.name}使用${skill.name}！${critText}对你造成${damage}点伤害！${elementText}`,
  };
}

// 逃跑
export function attemptFlee(playerSpd, enemySpd) {
  const chance = calculateFleeChance(playerSpd, enemySpd);
  return Math.random() < chance;
}
