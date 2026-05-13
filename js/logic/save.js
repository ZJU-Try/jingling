// 存档管理 - 使用 wx.setStorage/getStorage
const SAVE_KEY = 'jiuzhou_save_v1';

export function loadSave() {
  try {
    const raw = wx.getStorageSync(SAVE_KEY);
    if (!raw) return null;
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch (e) {
    console.error('加载存档失败:', e);
    return null;
  }
}

export function saveGame(state) {
  try {
    const saveData = {
      player: state.player,
      spirits: state.spirits,
      activeSpiritIndex: state.activeSpiritIndex,
      inventory: state.inventory,
      highestAreaUnlocked: state.player.highestAreaUnlocked,
      timestamp: Date.now(),
      chosenStarters: state.chosenStarters,
      encounteredSpirits: state.encounteredSpirits,
    };
    wx.setStorageSync(SAVE_KEY, JSON.stringify(saveData));
    return true;
  } catch (e) {
    console.error('保存失败:', e);
    return false;
  }
}

export function hasSave() {
  try {
    const raw = wx.getStorageSync(SAVE_KEY);
    return !!raw;
  } catch {
    return false;
  }
}

export function clearSave() {
  try {
    wx.removeStorageSync(SAVE_KEY);
    return true;
  } catch {
    return false;
  }
}
