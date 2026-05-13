import { SPIRIT_TEMPLATES, EVOLUTION_TEMPLATES, calculateStats, calculateEvolutionStats, getExpToNextLevel } from '../data/spirits';
import { SKILLS } from '../data/skills';

// 处理精灵获得经验和升级
export function processLevelUp(spirit, expGain) {
  let newExp = spirit.exp + expGain;
  let newLevel = spirit.level;
  let newExpToNext = spirit.expToNext;
  let newMaxHp = spirit.maxHp;
  let newHp = spirit.hp;
  let newAtk = spirit.atk;
  let newDef = spirit.def;
  let newSpd = spirit.spd;
  let newSkills = [...spirit.skills];
  let newBackupSkills = [...(spirit.backupSkills || [])];
  let newPp = { ...spirit.pp };
  let newLearnedIds = [...(spirit.learnedSkillIds || spirit.skills.map(s => s.id))];
  let levelsGained = 0;
  let evolutionLog;
  let evolvedTemplateId;
  let evolvedName;
  let evolvedElement;
  let learnedSkills = [];

  while (newExp >= newExpToNext && newLevel < 100) {
    newExp -= newExpToNext;
    newLevel++;
    levelsGained++;
    const template = SPIRIT_TEMPLATES[spirit.templateId] || EVOLUTION_TEMPLATES[spirit.templateId];
    if (template) {
      const stats = calculateStats(template.baseStats, newLevel);
      newMaxHp = stats.maxHp; newAtk = stats.atk; newDef = stats.def; newSpd = stats.spd;

      template.skills.forEach((skillId, idx) => {
        if (template.learnLevels[idx] === newLevel) {
          const skill = SKILLS[skillId];
          if (skill && !newLearnedIds.includes(skillId)) {
            newLearnedIds.push(skillId);
            if (newSkills.length < 4) {
              newSkills.push(skill);
              newPp[skillId] = skill.pp;
              learnedSkills.push(skill);
            } else {
              newBackupSkills.push(skill);
            }
          }
        }
      });

      const evoTargetTemplate = EVOLUTION_TEMPLATES[spirit.templateId] || template;
      if (evoTargetTemplate.evolution && newLevel >= evoTargetTemplate.evolution.levelRequired) {
        const evoTemplate = EVOLUTION_TEMPLATES[evoTargetTemplate.evolution.templateId];
        if (evoTemplate) {
          const evoStats = calculateEvolutionStats(evoTemplate.baseStats, newLevel);
          newMaxHp = evoStats.maxHp; newAtk = evoStats.atk; newDef = evoStats.def; newSpd = evoStats.spd;
          evoTemplate.skills.forEach((skillId, idx) => {
            if (evoTemplate.learnLevels[idx] <= newLevel) {
              const skill = SKILLS[skillId];
              if (skill && !newLearnedIds.includes(skillId)) {
                newLearnedIds.push(skillId);
                if (newSkills.length < 4) {
                  newSkills.push(skill); newPp[skillId] = skill.pp;
                } else {
                  newBackupSkills.push(skill);
                }
              }
            }
          });
          evolutionLog = evoTargetTemplate.evolution.evolveMessage;
          evolvedTemplateId = evoTemplate.id;
          evolvedName = evoTemplate.name;
          evolvedElement = evoTemplate.element;
        }
      }
    }
    newExpToNext = getExpToNextLevel(newLevel);
  }

  const finalTemplateId = evolvedTemplateId || spirit.templateId;
  const finalTemplate = SPIRIT_TEMPLATES[finalTemplateId] || EVOLUTION_TEMPLATES[finalTemplateId];
  if (finalTemplate && levelsGained > 0 && !evolvedTemplateId) {
    const finalStats = calculateStats(finalTemplate.baseStats, newLevel);
    newMaxHp = finalStats.maxHp; newAtk = finalStats.atk; newDef = finalStats.def; newSpd = finalStats.spd;
  }

  const hpGain = newMaxHp - spirit.maxHp;
  const updatedSpirit = {
    ...spirit,
    level: newLevel,
    exp: newExp,
    expToNext: newExpToNext,
    maxHp: newMaxHp,
    hp: Math.min(newHp + Math.max(0, hpGain), newMaxHp),
    atk: newAtk,
    def: newDef,
    spd: newSpd,
    skills: newSkills,
    backupSkills: newBackupSkills,
    pp: newPp,
    learnedSkillIds: newLearnedIds,
  };

  if (evolvedTemplateId) {
    updatedSpirit.templateId = evolvedTemplateId;
    updatedSpirit.nickname = evolvedName;
    updatedSpirit.element = evolvedElement;
  }

  return { spirit: updatedSpirit, levelsGained, evolutionLog, learnedSkills };
}

// 使用物品
export function applyItemEffect(item, spirit) {
  if (!item || !spirit) return { success: false };
  const parts = item.effect.split(':');
  const effectType = parts[0];
  let newSpirit = { ...spirit };
  let message = '';

  switch (effectType) {
    case 'heal': {
      const amount = parseInt(parts[1]);
      if (newSpirit.hp <= 0) return { success: false, message: '精灵已倒下，需要使用复活药！' };
      const healed = Math.min(newSpirit.maxHp - newSpirit.hp, amount === 9999 ? newSpirit.maxHp : amount);
      newSpirit.hp = Math.min(newSpirit.maxHp, newSpirit.hp + (amount === 9999 ? newSpirit.maxHp : amount));
      message = `${newSpirit.nickname}恢复了${healed}点HP！`;
      break;
    }
    case 'restore_pp': {
      const amount = parseInt(parts[1]);
      const newPp = { ...newSpirit.pp };
      newSpirit.skills.forEach(skill => {
        newPp[skill.id] = Math.min(skill.pp, (newPp[skill.id] || 0) + (amount === 999 ? skill.pp : amount));
      });
      newSpirit.pp = newPp;
      message = `${newSpirit.nickname}的PP已恢复！`;
      break;
    }
    case 'revive': {
      if (newSpirit.hp > 0) return { success: false, message: '该精灵还未倒下！' };
      const percent = parseInt(parts[1]);
      newSpirit.hp = Math.floor(newSpirit.maxHp * percent / 100);
      message = `${newSpirit.nickname}复活了！`;
      break;
    }
    case 'boost': {
      const stat = parts[1];
      const value = parseInt(parts[2]);
      if (stat === 'hp') {
        newSpirit.maxHp += value;
        newSpirit.hp += value;
      } else {
        newSpirit[stat] = (newSpirit[stat] || 0) + value;
      }
      const statNames = { atk: '攻击力', def: '防御力', spd: '速度', hp: '最大HP' };
      message = `${newSpirit.nickname}的${statNames[stat]}永久提升了${value}点！`;
      break;
    }
    case 'exp': {
      const amount = parseInt(parts[1]);
      const result = processLevelUp(newSpirit, amount);
      newSpirit = result.spirit;
      message = `${spirit.nickname}获得了${amount}点经验值！`;
      if (result.levelsGained > 0) {
        message += ` 升到Lv.${newSpirit.level}！`;
      }
      if (result.evolutionLog) {
        message += ` ✨ ${result.evolutionLog}`;
      }
      break;
    }
    default:
      return { success: false, message: '该物品无效果' };
  }

  return { success: true, spirit: newSpirit, message };
}
