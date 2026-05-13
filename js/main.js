import './render';
import DataBus from './databus';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './render';
import { AREAS, getArea, getScene } from './data/areas';
import { ITEMS, SHOP_ITEMS_BY_AREA } from './data/items';
import { SPIRIT_TEMPLATES, EVOLUTION_TEMPLATES, createSpiritInstance } from './data/spirits';
import { explore, generateGymEnemy } from './logic/exploration';
import { executePlayerSkill, executeEnemyAction, attemptFlee, determineFirst } from './logic/battle';
import { attemptCapture } from './logic/capture';
import { processLevelUp, applyItemEffect } from './logic/spirit';

const ctx = canvas.getContext('2d');
const STARTERS = ['danta', 'xiaobai', 'maidou', 'xiaoyuan', 'heimei'];
const SAVE_PAGE_SIZE = 3;

const COLORS = {
  bg: '#04070f',
  panel: '#081325',
  panel2: '#0b1730',
  text: '#d9e6ff',
  dim: '#7f92b8',
  green: '#41e08a',
  cyan: '#36d4ff',
  yellow: '#f4c55b',
  red: '#ff6f7d',
  border: '#20355d',
};

const ELEMENT_COLORS = {
  normal: '#a7acb7',
  fire: '#ff7b67',
  water: '#53a5ff',
  wood: '#56d273',
  earth: '#dca65a',
  metal: '#c6ccd8',
  thunder: '#ffd84a',
  dark: '#b26bff',
  wind: '#73dfff',
  dragon: '#ff8f8f',
};

const ELEMENT_NAMES = {
  normal: '普通', fire: '火', water: '水', wood: '木', earth: '土',
  metal: '金', thunder: '雷', dark: '暗', wind: '风', dragon: '龙',
};

const ALL_REWARDS = [
  ...Array.from({ length: 10 }, (_, i) => {
    const n = i + 1;
    const level = 5 * n;
    return {
      id: 'lv' + level + '_auto',
      title: '等级突破 Lv.' + level,
      type: 'auto_ticket',
      ticketMultiplier: n,
      target: level,
    };
  }),
  ...[20, 40, 60, 80].map((level) => ({
    id: 'lv' + level + '_starter',
    title: '御灵大师 Lv.' + level,
    type: 'starter_pick',
    target: level,
  })),
];

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function paginate(items, page, pageSize) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const p = clamp(page || 0, 0, totalPages - 1);
  const start = p * pageSize;
  return {
    page: p,
    totalPages,
    list: items.slice(start, start + pageSize),
  };
}

export default class Main {
  constructor() {
    this.databus = new DataBus();
    GameGlobal.databus = this.databus;

    this.aniId = 0;
    this.buttons = [];
    this.imageCache = {};
    this.currentBgm = '';
    this.battleMenu = 'main';
    this.shopTab = 'buy';
    this.stationTab = 'withdraw';

    this.touchHandler = this.onTouchStart.bind(this);
    wx.onTouchStart(this.touchHandler);

    this.setupAudio();
    this.databus.refreshSaveSlots();
    this.databus.addLog('欢迎来到九州灵绘卷。');

    this.loop = this.loop.bind(this);
    this.aniId = requestAnimationFrame(this.loop);
  }

  setupAudio() {
    this.audio = {
      click: wx.createInnerAudioContext(),
      attack: wx.createInnerAudioContext(),
      victory: wx.createInnerAudioContext(),
      bgmExplore: wx.createInnerAudioContext(),
      bgmBattle: wx.createInnerAudioContext(),
    };
    this.audio.click.src = 'audio/click.mp3';
    this.audio.attack.src = 'audio/attack.mp3';
    this.audio.victory.src = 'audio/victory.mp3';
    this.audio.bgmExplore.src = 'audio/bgm_explore.mp3';
    this.audio.bgmBattle.src = 'audio/bgm_battle.mp3';
    this.audio.bgmExplore.loop = true;
    this.audio.bgmBattle.loop = true;
    this.audio.click.volume = 0.6;
    this.audio.attack.volume = 0.6;
    this.audio.victory.volume = 0.7;
    this.audio.bgmExplore.volume = 0.4;
    this.audio.bgmBattle.volume = 0.4;
  }

  stopAllBgm() {
    this.audio.bgmExplore.stop();
    this.audio.bgmBattle.stop();
  }

  playClick() {
    if (!this.databus.state.musicEnabled) return;
    try {
      this.audio.click.stop();
      this.audio.click.play();
    } catch (e) {
      console.error(e);
    }
  }

  playAttack() {
    if (!this.databus.state.musicEnabled) return;
    try {
      this.audio.attack.stop();
      this.audio.attack.play();
    } catch (e) {
      console.error(e);
    }
  }

  playVictory() {
    if (!this.databus.state.musicEnabled) return;
    try {
      this.audio.victory.stop();
      this.audio.victory.play();
    } catch (e) {
      console.error(e);
    }
  }

  syncBgm() {
    const state = this.databus.state;
    if (!state.musicEnabled) {
      this.currentBgm = '';
      this.stopAllBgm();
      return;
    }

    const isBattle = state.screen === 'battle' || state.screen === 'gymBattle';
    const isExplore = state.screen === 'explore';
    if (isBattle && this.currentBgm !== 'battle') {
      this.stopAllBgm();
      this.currentBgm = 'battle';
      this.audio.bgmBattle.play();
      return;
    }
    if (isExplore && this.currentBgm !== 'explore') {
      this.stopAllBgm();
      this.currentBgm = 'explore';
      this.audio.bgmExplore.play();
      return;
    }
    if (!isBattle && !isExplore && this.currentBgm) {
      this.currentBgm = '';
      this.stopAllBgm();
    }
  }

  onTouchStart(e) {
    if (!e || !e.touches || e.touches.length === 0) return;
    const t = e.touches[0];
    const x = t.clientX;
    const y = t.clientY;

    for (let i = this.buttons.length - 1; i >= 0; i--) {
      const btn = this.buttons[i];
      if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
        if (btn.silent !== true) this.playClick();
        if (typeof btn.onTap === 'function') btn.onTap();
        break;
      }
    }
  }

  setToast(text) {
    this.databus.state.ui.toast = text;
    this.databus.addLog(text);
  }

  getImage(path) {
    if (!path) return null;
    if (this.imageCache[path]) return this.imageCache[path];
    const img = wx.createImage();
    img._ready = false;
    img.onload = () => {
      img._ready = true;
    };
    img.onerror = () => {
      img._ready = false;
    };
    img.src = path;
    this.imageCache[path] = img;
    return img;
  }

  drawImageSafe(path, x, y, w, h) {
    const img = this.getImage(path);
    if (!img || !img._ready) return false;
    ctx.drawImage(img, x, y, w, h);
    return true;
  }

  getSpiritImagePath(templateId) {
    const starters = {
      danta: 'images/spirits/danta_ev1.png',
      xiaobai: 'images/spirits/xiaobai_ev1.png',
      maidou: 'images/spirits/maidou_ev1.png',
      xiaoyuan: 'images/spirits/xiaoyuan_ev1.png',
      heimei: 'images/spirits/heimei_ev1.png',
    };
    if (starters[templateId]) return starters[templateId];
    return 'images/spirits/' + templateId + '.png';
  }

  getLeaderImagePath(areaId) {
    return 'images/leaders/leader' + areaId + '.png';
  }

  drawBox(x, y, w, h, border, fill) {
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = border;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
  }

  drawText(text, x, y, size, color, align) {
    ctx.fillStyle = color || COLORS.text;
    ctx.font = (size || 14) + 'px sans-serif';
    ctx.textAlign = align || 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(text, x, y);
  }

  drawWrappedText(text, x, y, maxWidth, lineHeight, color, size, maxLines) {
    ctx.fillStyle = color || COLORS.dim;
    ctx.font = (size || 13) + 'px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    const chars = (text || '').split('');
    let line = '';
    let lineIndex = 0;

    for (let i = 0; i < chars.length; i++) {
      const test = line + chars[i];
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, y + lineIndex * lineHeight);
        line = chars[i];
        lineIndex += 1;
        if (maxLines && lineIndex >= maxLines) return;
      } else {
        line = test;
      }
    }
    if (!maxLines || lineIndex < maxLines) {
      ctx.fillText(line, x, y + lineIndex * lineHeight);
    }
  }

  addButton(x, y, w, h, text, onTap, options) {
    const style = options || {};
    this.buttons.push({ x, y, w, h, onTap, silent: style.silent });
    this.drawBox(x, y, w, h, style.border || COLORS.border, style.fill || COLORS.panel2);
    this.drawText(text, x + w / 2, y + (h - (style.fontSize || 16)) / 2, style.fontSize || 16, style.color || COLORS.text, 'center');
  }

  drawTopBar(title, subtitle) {
    const state = this.databus.state;
    this.drawBox(0, 0, SCREEN_WIDTH, 64, '#14223f', '#070d18');
    this.drawText(title || '九州灵绘卷', 12, 9, 22, COLORS.green);
    if (subtitle) this.drawText(subtitle, 12, 38, 12, COLORS.dim);

    this.drawText('铜钱 ' + state.player.gold, SCREEN_WIDTH - 12, 10, 16, COLORS.yellow, 'right');
    this.drawText('解锁 ' + state.player.highestAreaUnlocked + '/9', SCREEN_WIDTH - 12, 34, 12, COLORS.dim, 'right');
  }

  drawLogPanel() {
    const logs = this.databus.state.logs.slice(-3);
    const h = 88;
    const y = SCREEN_HEIGHT - h;
    this.drawBox(0, y, SCREEN_WIDTH, h, '#18263f', '#040912');
    for (let i = 0; i < logs.length; i++) {
      this.drawWrappedText(logs[i].text, 10, y + 10 + i * 24, SCREEN_WIDTH - 20, 20, '#9bb1d6', 12, 1);
    }
  }

  gotoScreen(screen) {
    this.databus.state.screen = screen;
    if (screen !== 'battle' && screen !== 'gymBattle') {
      this.battleMenu = 'main';
    }
  }

  beginNewGame(slotId) {
    this.databus.state.pendingSlotId = slotId || null;
    this.databus.startNewGame();
    this.setToast('请选择你的初始精灵。');
  }

  pickStarter(templateId) {
    const spirit = createSpiritInstance(templateId, 5, true);
    if (!spirit) return;
    const state = this.databus.state;
    state.spirits = [spirit];
    state.activeSpiritIndex = 0;
    state.chosenStarters = [templateId];
    this.databus.addEncounter(templateId);

    const slotId = state.pendingSlotId || 1;
    this.databus.state.currentSlotId = slotId;
    this.databus.createNewSlotFromCurrent(slotId, '存档 ' + slotId);

    this.gotoScreen('areaSelect');
    this.setToast('你选择了' + spirit.nickname + '。冒险开始。');
  }

  quickSave() {
    if (this.databus.quickSave()) {
      this.setToast('存档成功。');
    } else {
      this.setToast('存档失败。');
    }
  }

  returnToTitle() {
    this.quickSave();
    this.databus.reset();
    this.gotoScreen('start');
  }

  moveToArea(areaId) {
    const state = this.databus.state;
    if (areaId > state.player.highestAreaUnlocked) {
      this.setToast('该区域尚未解锁。');
      return;
    }
    const area = getArea(areaId);
    if (!area) return;
    state.player.currentAreaId = areaId;
    state.player.currentSceneId = area.scenes[0].id;
    this.gotoScreen('explore');
    this.setToast('你来到了' + area.name + '。');
  }

  moveToScene(sceneId) {
    const state = this.databus.state;
    const area = getArea(state.player.currentAreaId);
    const scene = getScene(state.player.currentAreaId, sceneId);
    if (!area || !scene) return;
    state.player.currentSceneId = sceneId;
    this.setToast('你来到了' + scene.name + '。' + scene.description);

    if (scene.type === 'camp') {
      for (let i = 0; i < state.spirits.length; i++) {
        const sp = state.spirits[i];
        sp.hp = sp.maxHp;
        sp.pp = Object.fromEntries(sp.skills.map((sk) => [sk.id, sk.pp]));
      }
      this.databus.addLog('你在营地休息，所有精灵恢复了体力和PP。');
    }
  }

  startBattle(enemy, isGym, gymMeta) {
    const state = this.databus.state;
    this.battleMenu = 'main';
    state.battle = {
      enemySpirit: enemy,
      isGymBattle: !!isGym,
      gymMeta: gymMeta || null,
    };
    this.databus.addEncounter(enemy.templateId);
    this.gotoScreen(isGym ? 'gymBattle' : 'battle');
    this.databus.triggerFlash(4);
    this.setToast('遭遇了' + enemy.name + ' Lv.' + enemy.level + '。');
  }

  handleExplore() {
    const state = this.databus.state;
    const scene = getScene(state.player.currentAreaId, state.player.currentSceneId);
    if (!scene) return;
    if (scene.type === 'camp') {
      this.setToast('在营地中可进行补给与管理。');
      return;
    }
    if (scene.type === 'gym') {
      this.handleChallengeGym();
      return;
    }

    const result = explore(scene, state.player.currentAreaId);
    if (result.type === 'enemy') {
      this.startBattle(result.enemy, false, null);
      return;
    }
    if (result.type === 'item') {
      this.databus.addItem(result.itemId, result.quantity);
      const item = ITEMS[result.itemId];
      this.setToast('获得 ' + (item ? item.name : result.itemId) + ' x' + result.quantity + '。');
      return;
    }
    if (result.type === 'gold') {
      state.player.gold += result.amount;
      this.setToast('获得铜钱 +' + result.amount + '。');
      return;
    }
    this.setToast('什么都没有发生。');
  }

  handleChallengeGym() {
    const state = this.databus.state;
    const area = getArea(state.player.currentAreaId);
    if (!area) return;
    const enemy = generateGymEnemy(area.gymLeader.team[0], area.gymLeader.teamLevels[0], area.id);
    if (!enemy) return;
    this.databus.addLog(area.gymLeader.intro);
    this.startBattle(enemy, true, { areaId: area.id, teamIndex: 0, totalTeam: area.gymLeader.team.length });
  }

  finishBattleVictory(enemy) {
    const state = this.databus.state;
    const spirit = this.databus.getActiveSpirit();
    if (spirit) {
      const result = processLevelUp(spirit, enemy.expReward);
      state.spirits[state.activeSpiritIndex] = result.spirit;
      if (result.levelsGained > 0) {
        this.databus.addLog(result.spirit.nickname + ' 升到 Lv.' + result.spirit.level + '。');
      }
      if (result.evolutionLog) this.databus.addLog(result.evolutionLog);
    }

    state.player.gold += enemy.goldReward;
    this.databus.addLog('战斗胜利，获得 ' + enemy.goldReward + ' 铜钱。');
    this.playVictory();

    if (state.battle && state.battle.isGymBattle) {
      const meta = state.battle.gymMeta;
      if (!meta) {
        state.battle = null;
        this.gotoScreen('explore');
        return;
      }
      const area = getArea(meta.areaId);
      if (!area) {
        state.battle = null;
        this.gotoScreen('explore');
        return;
      }

      const nextIndex = meta.teamIndex + 1;
      if (nextIndex < area.gymLeader.team.length) {
        const nextEnemy = generateGymEnemy(area.gymLeader.team[nextIndex], area.gymLeader.teamLevels[nextIndex], area.id);
        if (nextEnemy) {
          state.battle.enemySpirit = nextEnemy;
          state.battle.gymMeta.teamIndex = nextIndex;
          this.databus.addLog(area.gymLeader.name + ' 派出了 ' + nextEnemy.name + '。');
          this.databus.triggerFlash(4);
          return;
        }
      }

      this.databus.addLog(area.gymLeader.defeatText);
      if (state.player.highestAreaUnlocked <= area.id && area.id < 9) {
        state.player.highestAreaUnlocked += 1;
        this.databus.addLog('解锁新区域。');
      }
    }

    state.battle = null;
    this.gotoScreen('explore');
  }

  handlePlayerAttack(skill) {
    const state = this.databus.state;
    if (!state.battle) return;
    const enemy = state.battle.enemySpirit;
    const spirit = this.databus.getActiveSpirit();
    if (!spirit || !enemy) return;

    const pFirst = determineFirst(spirit.spd, enemy.spd) === 'player';

    const doPlayer = () => {
      const result = executePlayerSkill(spirit, enemy, skill);
      this.databus.addLog(result.message);
      if (typeof result.newEnemyHp === 'number') enemy.hp = result.newEnemyHp;
      this.playAttack();
      this.databus.triggerShake(8);
      return enemy.hp <= 0;
    };

    const doEnemy = () => {
      const result = executeEnemyAction(enemy, spirit);
      this.databus.addLog(result.message);
      if (typeof result.newPlayerHp === 'number') spirit.hp = result.newPlayerHp;
      this.databus.triggerShake(6);
      if (spirit.hp <= 0) {
        this.autoSwitchSpirit();
      }
    };

    if (pFirst) {
      if (doPlayer()) {
        this.finishBattleVictory(enemy);
        return;
      }
      doEnemy();
    } else {
      doEnemy();
      if (state.screen === 'gameOver') return;
      if (doPlayer()) {
        this.finishBattleVictory(enemy);
      }
    }
  }

  autoSwitchSpirit() {
    const state = this.databus.state;
    for (let i = 0; i < state.spirits.length; i++) {
      if (state.spirits[i].hp > 0) {
        state.activeSpiritIndex = i;
        this.databus.addLog('自动切换到 ' + state.spirits[i].nickname + '。');
        return true;
      }
    }
    state.battle = null;
    this.gotoScreen('gameOver');
    this.setToast('队伍全员倒下。');
    return false;
  }

  handleBattleCapture() {
    const state = this.databus.state;
    const battle = state.battle;
    if (!battle) return;
    const enemy = battle.enemySpirit;
    if (battle.isGymBattle || enemy.captureRate <= 0) {
      this.setToast('道馆精灵不可捕捉。');
      return;
    }

    let itemId = '';
    let mult = 0;
    if (this.databus.getItemCount('master_capture_seal') > 0) {
      itemId = 'master_capture_seal';
      mult = 4.0;
    } else if (this.databus.getItemCount('advanced_capture_seal') > 0) {
      itemId = 'advanced_capture_seal';
      mult = 2.0;
    } else if (this.databus.getItemCount('capture_seal') > 0) {
      itemId = 'capture_seal';
      mult = 1.0;
    }

    if (!itemId) {
      this.setToast('没有封妖符。');
      return;
    }

    this.databus.removeItem(itemId, 1);
    const result = attemptCapture(enemy, mult);
    if (result.success) {
      const caught = createSpiritInstance(enemy.templateId, enemy.level, false);
      if (caught) {
        if (state.spirits.length < 6) state.spirits.push(caught);
        else this.databus.addStationSpirit(caught);
      }
      this.databus.addLog('捕捉成功，你收服了 ' + enemy.name + '。');
      state.battle = null;
      this.gotoScreen('explore');
      return;
    }
    this.databus.addLog('捕捉失败，成功率约 ' + Math.floor(result.rate * 100) + '%。');
  }

  handleBattleFlee() {
    const state = this.databus.state;
    if (!state.battle) return;
    if (state.battle.isGymBattle) {
      this.setToast('道馆战无法逃跑。');
      return;
    }

    const spirit = this.databus.getActiveSpirit();
    const enemy = state.battle.enemySpirit;
    if (!spirit || !enemy) return;
    if (attemptFlee(spirit.spd, enemy.spd)) {
      this.databus.addLog('逃跑成功。');
      state.battle = null;
      this.gotoScreen('explore');
    } else {
      this.databus.addLog('逃跑失败。');
    }
  }

  useItemOnActive(itemId) {
    const state = this.databus.state;
    const item = ITEMS[itemId];
    const spirit = this.databus.getActiveSpirit();
    if (!item || !spirit) return;
    if (this.databus.getItemCount(itemId) <= 0) {
      this.setToast('道具不足。');
      return;
    }
    const result = applyItemEffect(item, spirit);
    if (!result.success) {
      this.setToast(result.message || '无法使用。');
      return;
    }
    this.databus.removeItem(itemId, 1);
    state.spirits[state.activeSpiritIndex] = result.spirit;
    this.setToast(result.message || '道具使用成功。');
  }

  claimReward(reward) {
    const state = this.databus.state;
    if (state.claimedRewards.includes(reward.id)) return;

    if (reward.type === 'auto_ticket') {
      const qty = 50 * reward.ticketMultiplier;
      this.databus.addItem('auto_explore_ticket', qty);
      state.claimedRewards.push(reward.id);
      this.setToast('领取奖励：自动探索券 x' + qty + '。');
      return;
    }

    const available = STARTERS.filter((id) => !state.chosenStarters.includes(id));
    if (available.length === 0) {
      this.setToast('已无可领取初始精灵。');
      state.claimedRewards.push(reward.id);
      return;
    }

    state.ui.rewardPendingId = reward.id;
    this.gotoScreen('rewardStarterPick');
  }

  claimStarterFromReward(templateId) {
    const state = this.databus.state;
    const rewardId = state.ui.rewardPendingId;
    if (!rewardId) return;
    if (state.chosenStarters.includes(templateId)) {
      this.setToast('该初始精灵已领取。');
      return;
    }

    const spirit = createSpiritInstance(templateId, 2, true);
    if (!spirit) return;
    if (state.spirits.length < 6) state.spirits.push(spirit);
    else this.databus.addStationSpirit(spirit);

    state.chosenStarters.push(templateId);
    state.claimedRewards.push(rewardId);
    state.ui.rewardPendingId = '';
    this.gotoScreen('rewards');
    this.setToast('奖励精灵已加入。');
  }

  updateAutoExplore() {
    const state = this.databus.state;
    if (!state.autoMode || state.screen !== 'explore') return;
    const scene = getScene(state.player.currentAreaId, state.player.currentSceneId);
    if (!scene || scene.type === 'camp' || scene.type === 'gym') return;

    if (state.frame % 30 !== 0) return;

    const ticketCount = this.databus.getItemCount('auto_explore_ticket');
    if (ticketCount <= 0) {
      state.autoMode = false;
      this.setToast('自动探索券耗尽，自动模式关闭。');
      return;
    }
    this.databus.removeItem('auto_explore_ticket', 1);
    this.handleExplore();
  }

  update() {
    this.databus.state.frame += 1;
    this.databus.tickFx();
    this.syncBgm();
    this.updateAutoExplore();
  }

  drawStartScreen() {
    const state = this.databus.state;
    const cx = SCREEN_WIDTH / 2;
    const cy = SCREEN_HEIGHT / 2;

    // 标题区域：垂直居中偏上
    const titleY = cy - 140;

    // 标题背景光晕
    const grd = ctx.createRadialGradient(cx, titleY + 10, 0, cx, titleY + 10, 140);
    grd.addColorStop(0, 'rgba(0,200,80,0.07)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(cx - 140, titleY - 50, 280, 140);

    // 主标题
    this.drawText('✧ 九州灵绘卷 ✧', cx, titleY, 44, COLORS.green, 'center');

    // 英文副标题
    this.drawText('JIUZHOU SPIRIT SCROLL', cx, titleY + 56, 19, '#4a6a5a', 'center');

    // 装饰横线
    const lineY = titleY + 88;
    ctx.save();
    ctx.strokeStyle = '#1e3d2a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 140, lineY);
    ctx.lineTo(cx + 140, lineY);
    ctx.stroke();
    // 中心小菱形
    ctx.fillStyle = '#2a5a38';
    ctx.beginPath();
    ctx.moveTo(cx, lineY - 4);
    ctx.lineTo(cx + 5, lineY);
    ctx.lineTo(cx, lineY + 4);
    ctx.lineTo(cx - 5, lineY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 副标语
    this.drawText('收集精灵 · 挑战道馆 · 成为御灵大师', cx, lineY + 26, 17, '#556070', 'center');

    // 按钮区域
    const btnY = cy + 30;
    this.addButton(cx - 220, btnY, 440, 72, state.hasSave ? '继续冒险' : '开始冒险', () => {
      this.gotoScreen('saveManager');
    }, { border: COLORS.green, color: COLORS.green, fill: '#051a10', fontSize: 32 });

    this.addButton(cx - 220, btnY + 88, 440, 54, '更新日志', () => {
      this.gotoScreen('changelog');
    }, { border: '#253548', color: '#6a7e9a', fill: '#07101e', fontSize: 22 });

    // 版本号
    this.drawText('v1.7.0', cx, SCREEN_HEIGHT - 44, 18, '#2c3648', 'center');
  }

  drawSaveManager() {
    const state = this.databus.state;
    this.drawTopBar('存档管理', '选择存档读取或创建新存档');

    const slots = [];
    for (let i = 1; i <= 8; i++) {
      const found = state.saveSlots.find((s) => s.slotId === i);
      slots.push(found || { slotId: i, empty: true });
    }

    const pageData = paginate(slots, this.databus.getPage('saveManager'), SAVE_PAGE_SIZE);
    this.databus.setPage('saveManager', pageData.page);

    let y = 86;
    for (let i = 0; i < pageData.list.length; i++) {
      const slot = pageData.list[i];
        const h = 150;
        const borderColor = slot.empty ? '#3a444f' : '#2a3652';
        const fillColor = slot.empty ? '#0a0f15' : '#060d1a';
      
        this.drawBox(16, y, SCREEN_WIDTH - 32, h, borderColor, fillColor);
      
        // 存档编号
        this.drawText('存档 ' + slot.slotId, 30, y + 12, 26, slot.empty ? '#5a6984' : COLORS.text);

      if (slot.empty) {
          this.drawText('空位', 30, y + 50, 20, '#68728f');
          this.addButton(SCREEN_WIDTH - 120, y + 42, 100, 50, '新建', () => {
          this.beginNewGame(slot.slotId);
          }, { border: COLORS.green, color: COLORS.green, fill: '#062012', fontSize: 20 });
      } else {
        const data = slot.data || {};
        const spirits = data.spirits || [];
        const stations = data.spiritStations || [];
        const maxLv = spirits.length > 0 ? Math.max(...spirits.map((s) => s.level)) : 1;
          const timestamp = new Date(slot.updatedAt || slot.createdAt).toLocaleDateString('zh-CN');
        
          // 日期
          this.drawText(timestamp, 30, y + 44, 16, '#a4b3d7');
        
          // 精灵与经济信息（两行）
          this.drawText('背包: ' + spirits.length + '只  精灵站: ' + stations.length + '只', 30, y + 66, 16, COLORS.green);
          this.drawText('铜钱: ' + (data.player ? data.player.gold : 0) + '  已解锁: ' + (data.highestAreaUnlocked || 1) + '/9  等级: ' + maxLv, 30, y + 86, 16, '#8ea1c8');

          this.addButton(SCREEN_WIDTH - 210, y + 42, 88, 48, '读取', () => {
          if (this.databus.loadFromSlot(slot.slotId)) {
            this.setToast('读取存档成功。');
            this.gotoScreen('areaSelect');
          } else {
            this.setToast('读取失败。');
          }
          }, { border: COLORS.green, color: COLORS.green, fill: '#062012', fontSize: 18 });

          this.addButton(SCREEN_WIDTH - 110, y + 42, 88, 48, '删除', () => {
          if (this.databus.deleteSlot(slot.slotId)) {
            this.setToast('已删除存档 ' + slot.slotId + '。');
          }
          }, { border: '#66333d', color: COLORS.red, fill: '#1a0b11', fontSize: 18 });
      }

        y += h + 12;
    }

      this.addButton(16, SCREEN_HEIGHT - 176, 130, 50, '返回', () => {
      this.gotoScreen('start');
      }, { border: '#2f3a56', color: COLORS.dim, fill: '#080f1f', fontSize: 20 });

      this.addButton(158, SCREEN_HEIGHT - 176, 130, 50, '上一页', () => {
      this.databus.setPage('saveManager', pageData.page - 1);
      }, { border: '#2f3a56', color: COLORS.cyan, fill: '#081327', fontSize: 20 });

      this.addButton(300, SCREEN_HEIGHT - 176, 130, 50, '下一页', () => {
      this.databus.setPage('saveManager', pageData.page + 1);
      }, { border: '#2f3a56', color: COLORS.cyan, fill: '#081327', fontSize: 20 });

      this.drawText((pageData.page + 1) + '/' + pageData.totalPages, SCREEN_WIDTH - 20, SCREEN_HEIGHT - 170, 18, '#5d6f96', 'right');
  }

  drawChooseStarterScreen(fromReward) {
    const state = this.databus.state;
    this.drawTopBar(fromReward ? '奖励 - 选择初始精灵' : '选择初始精灵', fromReward ? '每只初始精灵仅可领取一次' : '新存档将以该精灵开局');

    let y = 90;
    for (let i = 0; i < STARTERS.length; i++) {
      const id = STARTERS[i];
      const temp = SPIRIT_TEMPLATES[id];
      if (!temp) continue;

      this.drawBox(16, y, SCREEN_WIDTH - 32, 92, '#2a3652', '#081325');
      const imgOk = this.drawImageSafe(this.getSpiritImagePath(id), 26, y + 10, 72, 72);
      if (!imgOk) {
        this.drawBox(26, y + 10, 72, 72, '#273751', '#0b1324');
        this.drawText('?', 62, y + 26, 34, '#57638a', 'center');
      }
      this.drawText(temp.name, 112, y + 12, 26, COLORS.text);
      this.drawText('属性: ' + ELEMENT_NAMES[temp.element], 112, y + 46, 20, ELEMENT_COLORS[temp.element] || COLORS.dim);
      this.drawText('描述: ' + temp.description, 112, y + 70, 16, '#8ea0c8');

      const already = state.chosenStarters.includes(id);
      this.addButton(SCREEN_WIDTH - 132, y + 22, 96, 48, already ? '已领取' : '选择', () => {
        if (fromReward) this.claimStarterFromReward(id);
        else this.pickStarter(id);
      }, {
        border: already ? '#3c455f' : COLORS.green,
        color: already ? '#5f6984' : COLORS.green,
        fill: already ? '#0c1221' : '#082013',
        fontSize: 20,
      });

      y += 102;
      if (y > SCREEN_HEIGHT - 170) break;
    }

    this.addButton(16, SCREEN_HEIGHT - 176, 140, 50, '返回', () => {
      this.gotoScreen(fromReward ? 'rewards' : 'saveManager');
    }, { border: '#2f3a56', color: COLORS.dim, fill: '#080f1f', fontSize: 22 });
  }

  drawAreaSelectScreen() {
    const state = this.databus.state;
    this.drawTopBar('神州大地', '选择你要前往的区域');

      this.addButton(16, 78, 164, 42, '奖励', () => this.gotoScreen('rewards'), { border: '#6a5d2d', color: COLORS.yellow, fill: '#1a1608', fontSize: 20 });
      this.addButton(188, 78, 164, 42, '图鉴', () => this.gotoScreen('pokedex'), { border: '#2d586a', color: COLORS.cyan, fill: '#08161a', fontSize: 20 });
      this.addButton(360, 78, 88, 42, '存档', () => this.quickSave(), { border: '#355d7d', color: '#8ee7ff', fill: '#081826', fontSize: 16 });

    const pageData = paginate(AREAS, this.databus.getPage('areaSelect'), 4);
    this.databus.setPage('areaSelect', pageData.page);

      let y = 130;
    for (let i = 0; i < pageData.list.length; i++) {
      const area = pageData.list[i];
      const locked = area.id > state.player.highestAreaUnlocked;
      const current = area.id === state.player.currentAreaId;

        this.drawBox(16, y, SCREEN_WIDTH - 32, 120, locked ? '#3a444f' : current ? '#2d8c5a' : '#2f79b0', '#07101f');
        this.drawText(area.id + '. ' + area.name, 26, y + 10, 28, locked ? '#67728d' : COLORS.text);
        this.drawWrappedText(area.description, 26, y + 48, SCREEN_WIDTH - 180, 20, '#8fa1c8', 16, 2);

      const leaderPath = this.getLeaderImagePath(area.id);
        this.drawImageSafe(leaderPath, SCREEN_WIDTH - 134, y + 14, 96, 96);

        this.addButton(SCREEN_WIDTH - 132, y + 72, 96, 36, locked ? '未解锁' : (current ? '当前' : '进入'), () => {
        if (!locked) this.moveToArea(area.id);
      }, {
        border: locked ? '#444f68' : current ? '#2d8c5a' : '#2f79b0',
        color: locked ? '#65728d' : (current ? COLORS.green : COLORS.cyan),
        fill: '#091121',
          fontSize: 16,
      });

        y += 132;
    }

    this.addButton(16, SCREEN_HEIGHT - 176, 110, 50, '上一页', () => {
      this.databus.setPage('areaSelect', pageData.page - 1);
    }, { border: '#2f3a56', color: COLORS.cyan, fill: '#081327', fontSize: 18 });

    this.addButton(134, SCREEN_HEIGHT - 176, 110, 50, '下一页', () => {
      this.databus.setPage('areaSelect', pageData.page + 1);
    }, { border: '#2f3a56', color: COLORS.cyan, fill: '#081327', fontSize: 18 });

    this.addButton(252, SCREEN_HEIGHT - 176, 110, 50, '返回', () => this.gotoScreen('saveManager'), { border: '#2f3a56', color: COLORS.dim, fill: '#080f1f', fontSize: 18 });
    this.addButton(370, SCREEN_HEIGHT - 176, 98, 50, state.musicEnabled ? '音效开' : '音效关', () => {
      const enabled = this.databus.toggleMusic();
      if (!enabled) this.stopAllBgm();
    }, { border: '#2f3a56', color: state.musicEnabled ? COLORS.green : '#7a86a6', fill: '#080f1f', fontSize: 16 });
  }

  drawExploreScreen() {
    const state = this.databus.state;
    const area = getArea(state.player.currentAreaId);
    const scene = getScene(state.player.currentAreaId, state.player.currentSceneId);
    if (!area || !scene) {
      this.gotoScreen('areaSelect');
      return;
    }

    this.drawTopBar(area.name, scene.name);

    this.drawBox(16, 78, SCREEN_WIDTH - 32, 96, '#1f2f4f', '#060d1a');
    this.drawWrappedText(scene.description, 26, 92, SCREEN_WIDTH - 52, 24, '#b6c5e4', 22, 3);

    const active = this.databus.getActiveSpirit();
    if (active) {
      this.drawBox(16, 184, SCREEN_WIDTH - 32, 118, '#228a5a', '#051b10');
      const imgOk = this.drawImageSafe(this.getSpiritImagePath(active.templateId), 26, 196, 96, 96);
      if (!imgOk) this.drawBox(26, 196, 96, 96, '#254062', '#081224');
      this.drawText(active.nickname + '  Lv.' + active.level, 136, 198, 28, COLORS.green);
      this.drawText('属性: ' + ELEMENT_NAMES[active.element], 136, 230, 20, ELEMENT_COLORS[active.element] || '#9fb2d8');
      this.drawText('HP ' + active.hp + '/' + active.maxHp, 136, 258, 20, '#9fb2d8');
      const hpRate = clamp(active.hp / Math.max(1, active.maxHp), 0, 1);
      this.drawBox(136, 284, SCREEN_WIDTH - 182, 10, '#2b3c5a', '#2b3c5a');
      ctx.fillStyle = hpRate > 0.3 ? COLORS.green : COLORS.red;
      ctx.fillRect(136, 284, (SCREEN_WIDTH - 182) * hpRate, 10);
    }

    const scenes = area.scenes;
    const bw = Math.floor((SCREEN_WIDTH - 44) / 2);
    for (let i = 0; i < scenes.length; i++) {
      const s = scenes[i];
      const x = 16 + (i % 2) * (bw + 12);
      const y = 312 + Math.floor(i / 2) * 50;
      const selected = s.id === scene.id;
      this.addButton(x, y, bw, 40, s.name, () => this.moveToScene(s.id), {
        border: selected ? COLORS.green : '#2a3652',
        color: selected ? COLORS.green : '#9aa9cb',
        fill: '#070f1c',
        fontSize: 18,
      });
    }

    this.addButton(16, 422, SCREEN_WIDTH - 32, 52, scene.type === 'gym' ? ('挑战' + area.gymLeader.name) : '探索场景', () => {
      if (scene.type === 'gym') this.handleChallengeGym();
      else this.handleExplore();
    }, {
      border: scene.type === 'gym' ? COLORS.red : COLORS.green,
      color: scene.type === 'gym' ? COLORS.red : COLORS.green,
      fill: '#081322',
      fontSize: 26,
    });

    this.addButton(16, 484, 144, 48, '背包', () => this.gotoScreen('inventory'), { border: COLORS.cyan, color: COLORS.cyan, fill: '#081426', fontSize: 22 });
    this.addButton(172, 484, 144, 48, '商店', () => this.gotoScreen('shop'), { border: COLORS.yellow, color: COLORS.yellow, fill: '#1a1608', fontSize: 22 });
    this.addButton(328, 484, 140, 48, '精灵站', () => this.gotoScreen('spiritStation'), { border: COLORS.cyan, color: COLORS.cyan, fill: '#081426', fontSize: 22 });

    this.addButton(16, 540, 224, 46, '精灵管理', () => this.gotoScreen('spiritManage'), { border: COLORS.green, color: COLORS.green, fill: '#051a10', fontSize: 22 });
    this.addButton(248, 540, 220, 46, state.autoMode ? ('停止自动(' + this.databus.getItemCount('auto_explore_ticket') + ')') : ('自动探索(' + this.databus.getItemCount('auto_explore_ticket') + ')'), () => {
      const count = this.databus.getItemCount('auto_explore_ticket');
      if (!state.autoMode && count <= 0) {
        this.setToast('没有自动探索券。');
        return;
      }
      const mode = this.databus.toggleAutoMode();
      this.setToast(mode ? '自动模式已开启。' : '自动模式已关闭。');
    }, {
      border: state.autoMode ? COLORS.red : COLORS.yellow,
      color: state.autoMode ? COLORS.red : COLORS.yellow,
      fill: '#081322',
      fontSize: 20,
    });

    this.addButton(16, 594, 144, 44, '区域地图', () => this.gotoScreen('areaSelect'), { border: '#314059', color: '#9ab0d6', fill: '#081020', fontSize: 18 });
    this.addButton(172, 594, 144, 44, '存档', () => this.quickSave(), { border: '#355d7d', color: '#8ee7ff', fill: '#081826', fontSize: 18 });
    this.addButton(328, 594, 140, 44, '返回标题', () => this.returnToTitle(), { border: '#66333d', color: COLORS.red, fill: '#1a0b11', fontSize: 18 });
  }

  drawBattleScreen(isGym) {
    const state = this.databus.state;
    const battle = state.battle;
    const spirit = this.databus.getActiveSpirit();
    if (!battle || !spirit) {
      this.gotoScreen('explore');
      return;
    }

    const enemy = battle.enemySpirit;
    this.drawTopBar(isGym ? 'BOSS BATTLE' : 'BATTLE', isGym ? '道馆挑战' : '野外遭遇');

    if (state.fx.flashFrames > 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fillRect(0, 64, SCREEN_WIDTH, SCREEN_HEIGHT - 64);
    }

    if (isGym && battle.gymMeta) {
      const area = getArea(battle.gymMeta.areaId);
        this.drawBox(16, 76, SCREEN_WIDTH - 32, 88, '#7d4d21', '#30180a');
        this.drawImageSafe(this.getLeaderImagePath(battle.gymMeta.areaId), 26, 80, 72, 72);
        this.drawText(area ? area.gymLeader.name : '馆主', 112, 84, 26, COLORS.yellow);
        this.drawText('第' + (battle.gymMeta.teamIndex + 1) + '/' + battle.gymMeta.totalTeam + '只', 112, 114, 16, '#f1cc8a');
    }

    const enemyY = isGym ? 182 : 86;
      this.drawBox(16, enemyY, SCREEN_WIDTH - 32, 156, '#6a3341', '#140912');
      this.drawImageSafe(this.getSpiritImagePath(enemy.templateId), 26, enemyY + 14, 120, 120);
      this.drawText(enemy.name, 160, enemyY + 14, 32, COLORS.red);
      this.drawText('Lv.' + enemy.level + '  ' + ELEMENT_NAMES[enemy.element], 160, enemyY + 52, 18, ELEMENT_COLORS[enemy.element] || '#c89ab4');
      this.drawText(enemy.hp + '/' + enemy.maxHp, 160, enemyY + 78, 20, '#f9a3ac');
    this.drawBox(168, enemyY + 120, SCREEN_WIDTH - 200, 12, '#2a3b58', '#2a3b58');
    ctx.fillStyle = enemy.hp / Math.max(1, enemy.maxHp) > 0.3 ? COLORS.green : COLORS.red;
      ctx.fillRect(160, enemyY + 102, (SCREEN_WIDTH - 190) * clamp(enemy.hp / Math.max(1, enemy.maxHp), 0, 1), 10);

    this.drawBox(16, enemyY + 176, SCREEN_WIDTH - 32, 100, '#243452', '#060d1a');
    const log = state.logs.slice(-3).map((l) => l.text).join(' ');
    this.drawWrappedText(log, 26, enemyY + 188, SCREEN_WIDTH - 52, 26, '#c1cee8', 20, 3);

      const selfY = enemyY + 280;
      this.drawBox(16, selfY, SCREEN_WIDTH - 32, 140, '#238759', '#051710');
      this.drawImageSafe(this.getSpiritImagePath(spirit.templateId), SCREEN_WIDTH - 146, selfY + 10, 120, 120);
      this.drawText(spirit.nickname, 26, selfY + 12, 32, COLORS.green);
      this.drawText('Lv.' + spirit.level + '  ' + ELEMENT_NAMES[spirit.element], 26, selfY + 50, 18, ELEMENT_COLORS[spirit.element] || '#a6d8be');
      this.drawText(spirit.hp + '/' + spirit.maxHp, 26, selfY + 74, 20, '#9df1bb');
      this.drawBox(26, selfY + 102, SCREEN_WIDTH - 186, 10, '#2a3b58', '#2a3b58');
    ctx.fillStyle = spirit.hp / Math.max(1, spirit.maxHp) > 0.3 ? COLORS.green : COLORS.red;
      ctx.fillRect(26, selfY + 102, (SCREEN_WIDTH - 186) * clamp(spirit.hp / Math.max(1, spirit.maxHp), 0, 1), 10);

      const baseY = selfY + 148;
    if (this.battleMenu === 'main') {
      // 2x3 网格菜单布局
      const buttonW = (SCREEN_WIDTH - 48) / 3;
      const buttonH = 48;
      const gapX = 8;
      const gapY = 8;
      
      // 第一行：攻击、技能、捕提
      this.addButton(16, baseY, buttonW, buttonH, '攻击', () => {
        const basic = { id: 'basic_attack', name: '普通攻击', power: 0.4, pp: 999, element: spirit.element, description: '普通攻击' };
        this.handlePlayerAttack(basic);
      }, { border: COLORS.red, color: COLORS.red, fill: '#170a11', fontSize: 20 });

      this.addButton(16 + buttonW + gapX, baseY, buttonW, buttonH, '技能', () => {
        this.battleMenu = 'skills';
      }, { border: COLORS.yellow, color: COLORS.yellow, fill: '#191406', fontSize: 20 });

      this.addButton(16 + (buttonW + gapX) * 2, baseY, buttonW, buttonH, '捕提', () => {
        this.handleBattleCapture();
      }, { border: COLORS.cyan, color: COLORS.cyan, fill: '#081426', fontSize: 20 });

      // 第二行：道具、切换、逃跑/认输
      this.addButton(16, baseY + buttonH + gapY, buttonW, buttonH, '道具', () => {
        this.battleMenu = 'items';
      }, { border: COLORS.green, color: COLORS.green, fill: '#06170d', fontSize: 20 });

      this.addButton(16 + buttonW + gapX, baseY + buttonH + gapY, buttonW, buttonH, '切换', () => {
        this.battleMenu = 'swap';
      }, { border: COLORS.cyan, color: COLORS.cyan, fill: '#081426', fontSize: 20 });

      this.addButton(16 + (buttonW + gapX) * 2, baseY + buttonH + gapY, buttonW, buttonH, isGym ? '认输' : '逃跑', () => {
        if (isGym) {
          state.battle = null;
          this.gotoScreen('explore');
          this.databus.addLog('你选择了认输。');
        } else {
          this.handleBattleFlee();
        }
      }, { border: isGym ? '#5a5a8f' : COLORS.cyan, color: isGym ? '#b0a8ff' : COLORS.cyan, fill: '#081426', fontSize: 20 });
    }

    if (this.battleMenu === 'skills') {
      let y = baseY;
      for (let i = 0; i < spirit.skills.length; i++) {
        const sk = spirit.skills[i];
        const pp = spirit.pp[sk.id] || 0;
        this.addButton(16, y, SCREEN_WIDTH - 32, 42, sk.name + '  PP ' + pp + '/' + sk.pp + '  威力 ' + Math.floor(sk.power * 100), () => {
          if (pp <= 0) {
            this.setToast('PP不足。');
            return;
          }
          spirit.pp[sk.id] = pp - 1;
          this.handlePlayerAttack(sk);
        }, {
          border: pp > 0 ? COLORS.yellow : '#4e556a',
          color: pp > 0 ? COLORS.yellow : '#69748f',
          fill: '#081322',
          fontSize: 18,
        });
        y += 48;
      }
      this.addButton(16, y, SCREEN_WIDTH - 32, 40, '返回', () => {
        this.battleMenu = 'main';
      }, { border: COLORS.green, color: COLORS.green, fill: '#081322', fontSize: 20 });
    }

    if (this.battleMenu === 'items') {
      const inventory = state.inventory.filter((it) => ITEMS[it.itemId]);
      let y = baseY;
      let shown = 0;
      for (let i = 0; i < inventory.length; i++) {
        const it = inventory[i];
        const item = ITEMS[it.itemId];
        if (!item) continue;
        if (item.type !== 'consumable' && item.type !== 'capture') continue;

        this.addButton(16, y, SCREEN_WIDTH - 32, 40, item.name + ' x' + it.quantity, () => {
          if (item.type === 'capture') this.handleBattleCapture();
          else this.useItemOnActive(it.itemId);
          this.battleMenu = 'main';
        }, {
          border: item.type === 'capture' ? COLORS.cyan : COLORS.green,
          color: item.type === 'capture' ? COLORS.cyan : COLORS.green,
          fill: '#07121f',
          fontSize: 18,
        });
        y += 46;
        shown += 1;
        if (shown >= 4) break;
      }
      if (shown === 0) {
        this.drawText('暂无可用道具', SCREEN_WIDTH / 2, baseY + 10, 22, '#7885a6', 'center');
        y = baseY + 48;
      }
      this.addButton(16, y, SCREEN_WIDTH - 32, 40, '返回', () => {
        this.battleMenu = 'main';
      }, { border: COLORS.green, color: COLORS.green, fill: '#081322', fontSize: 20 });
    }

    if (this.battleMenu === 'swap') {
      let y = baseY;
      let shown = 0;
      for (let i = 0; i < state.spirits.length; i++) {
        if (i === state.activeSpiritIndex) continue;
        const sp = state.spirits[i];
        this.addButton(16, y, SCREEN_WIDTH - 32, 40, sp.nickname + ' Lv.' + sp.level + '  HP ' + sp.hp + '/' + sp.maxHp, () => {
          if (sp.hp <= 0) {
            this.setToast('该精灵已倒下。');
            return;
          }
          state.activeSpiritIndex = i;
          this.battleMenu = 'main';
          this.setToast('已切换出战。');
        }, {
          border: sp.hp > 0 ? COLORS.green : '#5a4251',
          color: sp.hp > 0 ? COLORS.green : '#8b6d7a',
          fill: '#081322',
          fontSize: 18,
        });
        y += 46;
        shown += 1;
        if (shown >= 4) break;
      }
      if (shown === 0) {
        this.drawText('没有可切换精灵', SCREEN_WIDTH / 2, baseY + 10, 22, '#7885a6', 'center');
        y = baseY + 48;
      }
      this.addButton(16, y, SCREEN_WIDTH - 32, 40, '返回', () => {
        this.battleMenu = 'main';
      }, { border: COLORS.green, color: COLORS.green, fill: '#081322', fontSize: 20 });
    }
  }

  drawInventoryScreen() {
    const state = this.databus.state;
    this.drawTopBar('背包', '点击道具对当前出战精灵使用');

    const pageData = paginate(state.inventory, this.databus.getPage('inventory'), 6);
    this.databus.setPage('inventory', pageData.page);

    let y = 82;
    for (let i = 0; i < pageData.list.length; i++) {
      const slot = pageData.list[i];
      const item = ITEMS[slot.itemId];
      if (!item) continue;
      this.drawBox(16, y, SCREEN_WIDTH - 32, 84, '#2a3652', '#081325');
      this.drawImageSafe('images/items/' + slot.itemId + '.png', 26, y + 10, 62, 62);
      this.drawText(item.name + ' x' + slot.quantity, 98, y + 12, 26, COLORS.text);
      this.drawWrappedText(item.description, 98, y + 44, SCREEN_WIDTH - 230, 20, '#8ea1c8', 16, 2);
      this.addButton(SCREEN_WIDTH - 128, y + 18, 88, 44, '使用', () => {
        this.useItemOnActive(slot.itemId);
      }, { border: COLORS.green, color: COLORS.green, fill: '#081322', fontSize: 18 });
      y += 92;
    }

    this.addButton(16, SCREEN_HEIGHT - 176, 100, 50, '上一页', () => {
      this.databus.setPage('inventory', pageData.page - 1);
    }, { border: '#2f3a56', color: COLORS.cyan, fill: '#081327', fontSize: 18 });

    this.addButton(124, SCREEN_HEIGHT - 176, 100, 50, '下一页', () => {
      this.databus.setPage('inventory', pageData.page + 1);
    }, { border: '#2f3a56', color: COLORS.cyan, fill: '#081327', fontSize: 18 });

    this.addButton(232, SCREEN_HEIGHT - 176, 236, 50, '返回', () => {
      this.setScreen('explore');
    }, { border: '#2f3a56', color: COLORS.dim, fill: '#080f1f', fontSize: 20 });
  }

  drawShopScreen() {
    const state = this.databus.state;
    const areaId = state.player.currentAreaId;
    this.drawTopBar('商店', this.shopTab === 'buy' ? '购买补给' : '出售背包物品');

    this.addButton(16, 80, 220, 44, '购买', () => {
      this.shopTab = 'buy';
      this.databus.setPage('shop', 0);
    }, {
      border: this.shopTab === 'buy' ? COLORS.green : '#2a3652',
      color: this.shopTab === 'buy' ? COLORS.green : '#8fa1c8',
      fill: '#081322',
      fontSize: 20,
    });

    this.addButton(248, 80, 220, 44, '出售', () => {
      this.shopTab = 'sell';
      this.databus.setPage('shop', 0);
    }, {
      border: this.shopTab === 'sell' ? COLORS.yellow : '#2a3652',
      color: this.shopTab === 'sell' ? COLORS.yellow : '#8fa1c8',
      fill: '#081322',
      fontSize: 20,
    });

    const list = this.shopTab === 'buy'
      ? (SHOP_ITEMS_BY_AREA[areaId] || SHOP_ITEMS_BY_AREA[1]).map((id) => ({ itemId: id, quantity: 1 }))
      : state.inventory;

    const pageData = paginate(list, this.databus.getPage('shop'), 5);
    this.databus.setPage('shop', pageData.page);

    let y = 134;
    for (let i = 0; i < pageData.list.length; i++) {
      const slot = pageData.list[i];
      const item = ITEMS[slot.itemId];
      if (!item) continue;

      this.drawBox(16, y, SCREEN_WIDTH - 32, 92, '#2a3652', '#081325');
      this.drawImageSafe('images/items/' + slot.itemId + '.png', 26, y + 14, 62, 62);
      this.drawText(item.name + (this.shopTab === 'sell' ? (' x' + slot.quantity) : ''), 98, y + 12, 24, COLORS.text);
      this.drawWrappedText(item.description, 98, y + 42, SCREEN_WIDTH - 236, 18, '#8ea1c8', 14, 2);

      const price = this.shopTab === 'buy' ? item.price : item.sellPrice;
      this.drawText((this.shopTab === 'buy' ? '售价 ' : '回收 ') + price, SCREEN_WIDTH - 160, y + 12, 18, COLORS.yellow);

      this.addButton(SCREEN_WIDTH - 132, y + 24, 92, 40, this.shopTab === 'buy' ? '购买' : '出售', () => {
        if (this.shopTab === 'buy') {
          if (state.player.gold < item.price) {
            this.setToast('铜钱不足。');
            return;
          }
          state.player.gold -= item.price;
          this.databus.addItem(slot.itemId, 1);
          this.setToast('已购买 ' + item.name + '。');
        } else {
          if (!this.databus.removeItem(slot.itemId, 1)) {
            this.setToast('数量不足。');
            return;
          }
          state.player.gold += item.sellPrice;
          this.setToast('已出售 ' + item.name + '。');
        }
      }, {
        border: this.shopTab === 'buy' ? COLORS.green : COLORS.yellow,
        color: this.shopTab === 'buy' ? COLORS.green : COLORS.yellow,
        fill: '#081322',
        fontSize: 18,
      });

      y += 100;
    }

    this.addButton(16, SCREEN_HEIGHT - 176, 100, 50, '上一页', () => {
      this.databus.setPage('shop', pageData.page - 1);
    }, { border: '#2f3a56', color: COLORS.cyan, fill: '#081327', fontSize: 18 });

    this.addButton(124, SCREEN_HEIGHT - 176, 100, 50, '下一页', () => {
      this.databus.setPage('shop', pageData.page + 1);
    }, { border: '#2f3a56', color: COLORS.cyan, fill: '#081327', fontSize: 18 });

    this.addButton(232, SCREEN_HEIGHT - 176, 236, 50, '返回探索', () => this.gotoScreen('explore'), { border: '#2f3a56', color: COLORS.dim, fill: '#080f1f', fontSize: 20 });
  }

  drawSpiritManageScreen() {
    const state = this.databus.state;
    this.drawTopBar('精灵管理', '点击精灵设为出战');

    const pageData = paginate(state.spirits, this.databus.getPage('spiritManage'), 5);
    this.databus.setPage('spiritManage', pageData.page);

    let y = 82;
    for (let i = 0; i < pageData.list.length; i++) {
      const sp = pageData.list[i];
      const index = state.spirits.indexOf(sp);
      this.drawBox(16, y, SCREEN_WIDTH - 32, 98, index === state.activeSpiritIndex ? '#2d8c5a' : '#2a3652', '#081325');
      this.drawImageSafe(this.getSpiritImagePath(sp.templateId), 26, y + 12, 72, 72);
      this.drawText(sp.nickname + '  Lv.' + sp.level, 108, y + 10, 24, COLORS.text);
      this.drawText('HP ' + sp.hp + '/' + sp.maxHp + '  攻' + sp.atk + ' 防' + sp.def + ' 速' + sp.spd, 108, y + 42, 16, '#9db0d7');
      this.drawText('技能: ' + sp.skills.map((s) => s.name).join(' / '), 108, y + 66, 14, '#8396be');

      this.addButton(SCREEN_WIDTH - 134, y + 26, 94, 42, index === state.activeSpiritIndex ? '出战中' : '设为出战', () => {
        if (sp.hp <= 0) {
          this.setToast('该精灵已倒下。');
          return;
        }
        state.activeSpiritIndex = index;
        this.setToast('已切换为 ' + sp.nickname + '。');
      }, {
        border: index === state.activeSpiritIndex ? '#3d9266' : COLORS.green,
        color: index === state.activeSpiritIndex ? '#9fd8b9' : COLORS.green,
        fill: '#081322',
        fontSize: 16,
      });

      y += 106;
    }

    this.addButton(16, SCREEN_HEIGHT - 176, 100, 50, '上一页', () => {
      this.databus.setPage('spiritManage', pageData.page - 1);
    }, { border: '#2f3a56', color: COLORS.cyan, fill: '#081327', fontSize: 18 });

    this.addButton(124, SCREEN_HEIGHT - 176, 100, 50, '下一页', () => {
      this.databus.setPage('spiritManage', pageData.page + 1);
    }, { border: '#2f3a56', color: COLORS.cyan, fill: '#081327', fontSize: 18 });

    this.addButton(232, SCREEN_HEIGHT - 176, 236, 50, '返回探索', () => this.gotoScreen('explore'), { border: '#2f3a56', color: COLORS.dim, fill: '#080f1f', fontSize: 20 });
  }

  drawSpiritStationScreen() {
    const state = this.databus.state;
    this.drawTopBar('精灵站', this.stationTab === 'withdraw' ? '取出 / 出售站内精灵' : '将背包精灵存入精灵站');

    this.addButton(16, 80, 220, 44, '取出/出售', () => {
      this.stationTab = 'withdraw';
      this.databus.setPage('spiritStation', 0);
    }, {
      border: this.stationTab === 'withdraw' ? COLORS.green : '#2a3652',
      color: this.stationTab === 'withdraw' ? COLORS.green : '#8fa1c8',
      fill: '#081322',
      fontSize: 20,
    });
    this.addButton(248, 80, 220, 44, '存入', () => {
      this.stationTab = 'deposit';
      this.databus.setPage('spiritStation', 0);
    }, {
      border: this.stationTab === 'deposit' ? COLORS.cyan : '#2a3652',
      color: this.stationTab === 'deposit' ? COLORS.cyan : '#8fa1c8',
      fill: '#081322',
      fontSize: 20,
    });

    const source = this.stationTab === 'withdraw' ? state.spiritStations : state.spirits;
    const pageData = paginate(source, this.databus.getPage('spiritStation'), 4);
    this.databus.setPage('spiritStation', pageData.page);

    let y = 134;
    for (let i = 0; i < pageData.list.length; i++) {
      const entry = pageData.list[i];
      const spirit = this.stationTab === 'withdraw' ? entry.spirit : entry;
      const realIndex = source.indexOf(entry);
      this.drawBox(16, y, SCREEN_WIDTH - 32, 112, '#2a3652', '#081325');
      this.drawImageSafe(this.getSpiritImagePath(spirit.templateId), 26, y + 18, 76, 76);
      this.drawText(spirit.nickname + '  Lv.' + spirit.level, 114, y + 14, 24, COLORS.text);
      this.drawText('HP ' + spirit.hp + '/' + spirit.maxHp + '  攻' + spirit.atk + ' 防' + spirit.def + ' 速' + spirit.spd, 114, y + 44, 16, '#9db0d7');

      if (this.stationTab === 'withdraw') {
        const storedHours = Math.max(0, Math.floor((Date.now() - entry.depositedAt) / (1000 * 60 * 60)));
        this.drawText('存放 ' + storedHours + ' 小时  预计经验 +' + storedHours, 114, y + 66, 14, '#88c9ff');

        this.addButton(SCREEN_WIDTH - 132, y + 12, 92, 34, '取回', () => {
          if (state.spirits.length >= 6) {
            this.setToast('背包已满。');
            return;
          }
          if (storedHours > 0) {
            const leveled = processLevelUp(spirit, storedHours);
            entry.spirit = leveled.spirit;
          }
          this.databus.withdrawSpirit(realIndex);
          this.setToast('已取回精灵。');
        }, { border: COLORS.green, color: COLORS.green, fill: '#071a10', fontSize: 16 });

        this.addButton(SCREEN_WIDTH - 132, y + 52, 92, 34, '出售', () => {
          const sold = this.databus.removeStationSpirit(realIndex);
          if (!sold) return;
          const gain = sold.level * 100;
          state.player.gold += gain;
          this.setToast('出售成功，获得 ' + gain + ' 铜钱。');
        }, { border: COLORS.yellow, color: COLORS.yellow, fill: '#1a1608', fontSize: 16 });
      } else {
        this.addButton(SCREEN_WIDTH - 132, y + 36, 92, 40, '存入', () => {
          if (!this.databus.depositSpirit(realIndex)) {
            this.setToast('至少保留一只精灵。');
            return;
          }
          this.setToast('已存入精灵站。');
        }, { border: COLORS.cyan, color: COLORS.cyan, fill: '#081426', fontSize: 18 });
      }

      y += 120;
    }

    this.addButton(16, SCREEN_HEIGHT - 176, 100, 50, '上一页', () => {
      this.databus.setPage('spiritStation', pageData.page - 1);
    }, { border: '#2f3a56', color: COLORS.cyan, fill: '#081327', fontSize: 18 });

    this.addButton(124, SCREEN_HEIGHT - 176, 100, 50, '下一页', () => {
      this.databus.setPage('spiritStation', pageData.page + 1);
    }, { border: '#2f3a56', color: COLORS.cyan, fill: '#081327', fontSize: 18 });

    this.addButton(232, SCREEN_HEIGHT - 176, 236, 50, '返回探索', () => this.gotoScreen('explore'), { border: '#2f3a56', color: COLORS.dim, fill: '#080f1f', fontSize: 20 });
  }

  drawRewardsScreen() {
    const state = this.databus.state;
    this.drawTopBar('奖励', '等级突破奖励与初始精灵奖励');

    const maxLv = this.databus.getSpiritHighestLevel();
    const pageData = paginate(ALL_REWARDS, this.databus.getPage('rewards'), 6);
    this.databus.setPage('rewards', pageData.page);

    let y = 82;
    for (let i = 0; i < pageData.list.length; i++) {
      const reward = pageData.list[i];
      const met = maxLv >= reward.target;
      const claimed = state.claimedRewards.includes(reward.id);
      const availableStarter = STARTERS.some((id) => !state.chosenStarters.includes(id));
      const blocked = reward.type === 'starter_pick' && !availableStarter;
      const canClaim = met && !claimed && !blocked;

      this.drawBox(16, y, SCREEN_WIDTH - 32, 86, canClaim ? '#8f6f2b' : claimed || blocked ? '#2d8c5a' : '#2a3652', '#081325');
      this.drawText(reward.title, 28, y + 12, 24, canClaim ? COLORS.yellow : (claimed || blocked ? COLORS.green : COLORS.text));
      this.drawText('进度 ' + Math.min(maxLv, reward.target) + '/' + reward.target, SCREEN_WIDTH - 42, y + 14, 16, '#9db0d7', 'right');

      const desc = reward.type === 'auto_ticket'
        ? ('最高等级达到' + reward.target + '，奖励' + (50 * reward.ticketMultiplier) + '张自动探索券')
        : ('最高等级达到' + reward.target + '，可选择一只初始精灵');
      this.drawWrappedText(desc, 28, y + 44, SCREEN_WIDTH - 220, 18, '#8ea1c8', 14, 2);

      const label = claimed ? '已领取' : blocked ? '已无可选' : canClaim ? '领取' : '未达成';
      this.addButton(SCREEN_WIDTH - 132, y + 24, 92, 36, label, () => {
        if (canClaim) this.claimReward(reward);
      }, {
        border: canClaim ? COLORS.yellow : (claimed ? '#2d8c5a' : '#4d5873'),
        color: canClaim ? COLORS.yellow : (claimed ? COLORS.green : '#77839f'),
        fill: '#081322',
        fontSize: 16,
      });

      y += 94;
    }

    this.addButton(16, SCREEN_HEIGHT - 176, 100, 50, '上一页', () => {
      this.databus.setPage('rewards', pageData.page - 1);
    }, { border: '#2f3a56', color: COLORS.cyan, fill: '#081327', fontSize: 18 });

    this.addButton(124, SCREEN_HEIGHT - 176, 100, 50, '下一页', () => {
      this.databus.setPage('rewards', pageData.page + 1);
    }, { border: '#2f3a56', color: COLORS.cyan, fill: '#081327', fontSize: 18 });

    this.addButton(232, SCREEN_HEIGHT - 176, 236, 50, '返回地图', () => this.gotoScreen('areaSelect'), { border: '#2f3a56', color: COLORS.dim, fill: '#080f1f', fontSize: 20 });
  }

  buildPokedexEntries() {
    const entries = [];
    const allTemplates = { ...SPIRIT_TEMPLATES, ...EVOLUTION_TEMPLATES };
    const keys = Object.keys(allTemplates);
    for (let i = 0; i < keys.length; i++) {
      const id = keys[i];
      const temp = allTemplates[id];
      entries.push({
        id,
        name: temp.name,
        element: temp.element,
        description: temp.description,
        baseStats: temp.baseStats,
      });
    }
    return entries;
  }

  drawPokedexScreen() {
    const state = this.databus.state;
    this.drawTopBar('精灵图鉴', '已遇见 ' + state.encounteredSpirits.length + ' 只');

    const entries = this.buildPokedexEntries();
    const pageData = paginate(entries, this.databus.getPage('pokedex'), 12);
    this.databus.setPage('pokedex', pageData.page);

    const cols = 3;
    const gap = 12;
    const cardW = Math.floor((SCREEN_WIDTH - 32 - gap * (cols - 1)) / cols);
    const cardH = 116;
    for (let i = 0; i < pageData.list.length; i++) {
      const en = pageData.list[i];
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = 16 + col * (cardW + gap);
      const y = 82 + row * (cardH + 10);
      const met = state.encounteredSpirits.includes(en.id);
        // 已遇见：绿色边框，未遇见：暗色边框
        const borderColor = met ? '#2d8c5a' : '#3a4450';
        const fillColor = met ? '#051b10' : '#0a0f15';
        this.drawBox(x, y, cardW, cardH, borderColor, fillColor);

      if (met) {
        const ok = this.drawImageSafe(this.getSpiritImagePath(en.id), x + (cardW - 56) / 2, y + 10, 56, 56);
        if (!ok) this.drawImageSafe('images/items/unknown_spirit.png', x + (cardW - 56) / 2, y + 10, 56, 56);
      } else {
        this.drawImageSafe('images/items/unknown_spirit.png', x + (cardW - 56) / 2, y + 10, 56, 56);
      }

      this.drawText(met ? en.name : '???', x + cardW / 2, y + 70, 16, met ? COLORS.text : '#6b7696', 'center');
        this.drawText(met ? ELEMENT_NAMES[en.element] : '?', x + cardW / 2, y + 92, 13, met ? (ELEMENT_COLORS[en.element] || '#9fb2d8') : '#60708f', 'center');

      this.buttons.push({ x, y, w: cardW, h: cardH, onTap: () => {
        state.pokedexDetailId = en.id;
        this.gotoScreen('pokedexDetail');
      } });
    }

    this.addButton(16, SCREEN_HEIGHT - 176, 100, 50, '上一页', () => {
      this.databus.setPage('pokedex', pageData.page - 1);
    }, { border: '#2f3a56', color: COLORS.cyan, fill: '#081327', fontSize: 18 });

    this.addButton(124, SCREEN_HEIGHT - 176, 100, 50, '下一页', () => {
      this.databus.setPage('pokedex', pageData.page + 1);
    }, { border: '#2f3a56', color: COLORS.cyan, fill: '#081327', fontSize: 18 });

    this.addButton(232, SCREEN_HEIGHT - 176, 236, 50, '返回地图', () => this.gotoScreen('areaSelect'), { border: '#2f3a56', color: COLORS.dim, fill: '#080f1f', fontSize: 20 });
  }

  drawPokedexDetailScreen() {
    const state = this.databus.state;
    const entries = this.buildPokedexEntries();
    const id = state.pokedexDetailId || (entries[0] && entries[0].id);
    const entry = entries.find((e) => e.id === id);
    if (!entry) {
      this.gotoScreen('pokedex');
      return;
    }

    const met = state.encounteredSpirits.includes(entry.id);

    this.drawTopBar('图鉴详情', met ? entry.name : '???');
    this.drawBox(16, 82, SCREEN_WIDTH - 32, 542, '#2a3652', '#071020');

    if (met) {
      const ok = this.drawImageSafe(this.getSpiritImagePath(entry.id), 26, 94, 132, 132);
      if (!ok) this.drawImageSafe('images/items/unknown_spirit.png', 26, 94, 132, 132);
    } else {
      this.drawImageSafe('images/items/unknown_spirit.png', 26, 94, 132, 132);
    }

    this.drawText(met ? entry.name : '???', 172, 96, 34, met ? COLORS.text : '#6b7696');
    this.drawText('属性: ' + (met ? ELEMENT_NAMES[entry.element] : '?'), 172, 142, 20, met ? (ELEMENT_COLORS[entry.element] || '#9fb2d8') : '#6b7696');

    this.drawText('基础属性', 26, 242, 24, COLORS.cyan);
    if (met) {
      this.drawText('HP ' + entry.baseStats.hp + '   攻 ' + entry.baseStats.atk + '   防 ' + entry.baseStats.def + '   速 ' + entry.baseStats.spd, 26, 276, 20, '#afc0e4');
    } else {
      this.drawText('?', 26, 276, 20, '#6b7696');
    }

    this.drawText('描述', 26, 322, 24, COLORS.cyan);
    this.drawWrappedText(met ? entry.description : '未知', 26, 356, SCREEN_WIDTH - 52, 24, '#afc0e4', 20, 8);

    this.addButton(16, SCREEN_HEIGHT - 176, 452, 50, '返回图鉴', () => this.gotoScreen('pokedex'), { border: '#2f3a56', color: COLORS.dim, fill: '#080f1f', fontSize: 20 });
  }

  drawGameOverScreen() {
    this.drawTopBar('战斗失败', '队伍全员倒下');
    const cx = SCREEN_WIDTH / 2;
    this.drawText('全员倒下', cx, 218, 48, COLORS.red, 'center');
    this.drawText('回到主菜单后可继续读取存档。', cx, 286, 24, '#8fa1c8', 'center');

    this.addButton(cx - 160, 380, 320, 58, '返回主菜单', () => {
      this.databus.state.battle = null;
      this.gotoScreen('start');
    }, { border: COLORS.red, color: COLORS.red, fill: '#1a0b11', fontSize: 26 });
  }

  drawChangelogScreen() {
    this.drawTopBar('更新日志', 'v1.7.0');
    this.drawBox(16, 82, SCREEN_WIDTH - 32, 542, '#2a3652', '#071020');
    const lines = [
      '1. 修复升级属性异常。',
      '2. 战斗结算强化。',
      '3. 新增奖励、图鉴、精灵站模块。',
      '4. 新增多存档槽管理。',
      '5. 新增素材化界面渲染。',
      '6. 新增BGM/SFX与战斗反馈动画。',
    ];
    for (let i = 0; i < lines.length; i++) {
      this.drawText(lines[i], 28, 104 + i * 54, 24, '#b6c5e4');
    }
    this.addButton(16, SCREEN_HEIGHT - 176, 452, 50, '返回', () => this.gotoScreen('start'), { border: '#2f3a56', color: COLORS.dim, fill: '#080f1f', fontSize: 20 });
  }

  render() {
    this.buttons = [];

    let shakeX = 0;
    let shakeY = 0;
    if (this.databus.state.fx.shakeFrames > 0) {
      shakeX = (Math.random() - 0.5) * 8;
      shakeY = (Math.random() - 0.5) * 6;
    }

    ctx.save();
    ctx.translate(shakeX, shakeY);

    ctx.clearRect(-16, -16, SCREEN_WIDTH + 32, SCREEN_HEIGHT + 32);
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(-16, -16, SCREEN_WIDTH + 32, SCREEN_HEIGHT + 32);

    const s = this.databus.state.screen;
    if (s === 'start') this.drawStartScreen();
    else if (s === 'saveManager') this.drawSaveManager();
    else if (s === 'chooseStarter') this.drawChooseStarterScreen(false);
    else if (s === 'rewardStarterPick') this.drawChooseStarterScreen(true);
    else if (s === 'areaSelect') this.drawAreaSelectScreen();
    else if (s === 'explore') this.drawExploreScreen();
    else if (s === 'battle') this.drawBattleScreen(false);
    else if (s === 'gymBattle') this.drawBattleScreen(true);
    else if (s === 'inventory') this.drawInventoryScreen();
    else if (s === 'shop') this.drawShopScreen();
    else if (s === 'spiritManage') this.drawSpiritManageScreen();
    else if (s === 'spiritStation') this.drawSpiritStationScreen();
    else if (s === 'rewards') this.drawRewardsScreen();
    else if (s === 'pokedex') this.drawPokedexScreen();
    else if (s === 'pokedexDetail') this.drawPokedexDetailScreen();
    else if (s === 'gameOver') this.drawGameOverScreen();
    else if (s === 'changelog') this.drawChangelogScreen();

    this.drawLogPanel();

    ctx.restore();
  }

  loop() {
    this.update();
    this.render();
    this.aniId = requestAnimationFrame(this.loop);
  }
}
