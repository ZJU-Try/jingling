let instance;

const SAVE_SLOTS_KEY = 'jiuzhou_save_slots_v2';
const MAX_SAVE_SLOTS = 8;

function createInitialState() {
  return {
    screen: 'start',
    hasSave: false,
    saveSlots: [],
    currentSlotId: null,
    pendingSlotId: null,
    player: {
      name: '御灵师',
      gold: 500,
      highestAreaUnlocked: 1,
      currentAreaId: 1,
      currentSceneId: 'forest_camp',
    },
    spirits: [],
    spiritStations: [],
    activeSpiritIndex: 0,
    inventory: [
      { itemId: 'capture_seal', quantity: 5 },
      { itemId: 'herb', quantity: 3 },
    ],
    chosenStarters: [],
    claimedRewards: [],
    encounteredSpirits: [],
    pokedexDetailId: '',
    autoMode: false,
    musicEnabled: true,
    battle: null,
    logs: [],
    ui: {
      buttons: [],
      toast: '',
      page: {},
    },
    fx: {
      shakeFrames: 0,
      flashFrames: 0,
    },
    frame: 0,
  };
}

export default class DataBus {
  constructor() {
    if (instance) {
      return instance;
    }
    this.reset();
    instance = this;
  }

  reset() {
    this.state = createInitialState();
    this.refreshSaveSlots();
  }

  readSlots() {
    try {
      const raw = wx.getStorageSync(SAVE_SLOTS_KEY);
      if (!raw) return [];
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('读取存档槽失败:', err);
      return [];
    }
  }

  writeSlots(slots) {
    try {
      wx.setStorageSync(SAVE_SLOTS_KEY, JSON.stringify(slots));
      return true;
    } catch (err) {
      console.error('写入存档槽失败:', err);
      return false;
    }
  }

  refreshSaveSlots() {
    const slots = this.readSlots().sort((a, b) => a.slotId - b.slotId);
    this.state.saveSlots = slots;
    this.state.hasSave = slots.length > 0;
  }

  buildSaveData() {
    return {
      player: this.state.player,
      spirits: this.state.spirits,
      spiritStations: this.state.spiritStations,
      activeSpiritIndex: this.state.activeSpiritIndex,
      inventory: this.state.inventory,
      highestAreaUnlocked: this.state.player.highestAreaUnlocked,
      chosenStarters: this.state.chosenStarters,
      claimedRewards: this.state.claimedRewards,
      encounteredSpirits: this.state.encounteredSpirits,
      timestamp: Date.now(),
    };
  }

  saveToSlot(slotId, name) {
    if (!slotId || slotId < 1 || slotId > MAX_SAVE_SLOTS) return false;
    const now = Date.now();
    const saveData = this.buildSaveData();
    const slots = this.readSlots();
    const existing = slots.find((s) => s.slotId === slotId);
    let nextSlots;

    if (existing) {
      nextSlots = slots.map((s) => (s.slotId === slotId
        ? {
          ...s,
          name: name || s.name,
          data: saveData,
          updatedAt: now,
        }
        : s));
    } else {
      nextSlots = slots.concat({
        slotId,
        name: name || ('存档 ' + slotId),
        data: saveData,
        createdAt: now,
        updatedAt: now,
      });
    }

    if (!this.writeSlots(nextSlots)) return false;
    this.state.currentSlotId = slotId;
    this.refreshSaveSlots();
    return true;
  }

  loadFromSlot(slotId) {
    const slots = this.readSlots();
    const slot = slots.find((s) => s.slotId === slotId);
    if (!slot || !slot.data) return false;
    return this.loadSave(slot.data, slotId);
  }

  deleteSlot(slotId) {
    const slots = this.readSlots();
    const nextSlots = slots.filter((s) => s.slotId !== slotId);
    const ok = this.writeSlots(nextSlots);
    if (!ok) return false;
    if (this.state.currentSlotId === slotId) this.state.currentSlotId = null;
    this.refreshSaveSlots();
    return true;
  }

  startNewGame() {
    const pending = this.state.pendingSlotId;
    this.reset();
    this.state.pendingSlotId = pending;
    this.state.screen = 'chooseStarter';
  }

  loadSave(data, slotId) {
    if (!data) return false;
    const slots = this.readSlots();
    const hasSave = slots.length > 0;
    const pending = this.state.pendingSlotId;
    this.state = createInitialState();
    this.state.saveSlots = slots;
    this.state.hasSave = hasSave;
    this.state.pendingSlotId = pending;
    this.state.player = data.player || this.state.player;
    this.state.spirits = data.spirits || [];
    this.state.spiritStations = Array.isArray(data.spiritStations) ? data.spiritStations : [];
    this.state.activeSpiritIndex = data.activeSpiritIndex || 0;
    this.state.inventory = data.inventory || [];
    this.state.player.highestAreaUnlocked = data.highestAreaUnlocked || this.state.player.highestAreaUnlocked;
    this.state.chosenStarters = data.chosenStarters || [];
    this.state.claimedRewards = data.claimedRewards || [];
    this.state.encounteredSpirits = data.encounteredSpirits || [];
    this.state.currentSlotId = slotId || this.state.currentSlotId;
    this.state.screen = 'areaSelect';
    return true;
  }

  createNewSlotFromCurrent(slotId, slotName) {
    const ok = this.saveToSlot(slotId, slotName || ('存档 ' + slotId));
    if (ok) {
      this.state.pendingSlotId = null;
    }
    return ok;
  }

  quickSave() {
    if (this.state.currentSlotId) {
      return this.saveToSlot(this.state.currentSlotId);
    }
    const used = new Set(this.state.saveSlots.map((s) => s.slotId));
    for (let i = 1; i <= MAX_SAVE_SLOTS; i++) {
      if (!used.has(i)) {
        return this.saveToSlot(i, '存档 ' + i);
      }
    }
    return false;
  }

  getSavePayload() {
    return this.buildSaveData();
  }

  addLog(text) {
    const entry = {
      id: Date.now() + '_' + Math.floor(Math.random() * 1000),
      text,
      timestamp: Date.now(),
    };
    this.state.logs.push(entry);
    if (this.state.logs.length > 10) {
      this.state.logs.shift();
    }
  }

  toggleAutoMode() {
    this.state.autoMode = !this.state.autoMode;
    return this.state.autoMode;
  }

  toggleMusic() {
    this.state.musicEnabled = !this.state.musicEnabled;
    return this.state.musicEnabled;
  }

  setPage(screen, page) {
    this.state.ui.page[screen] = Math.max(0, page || 0);
  }

  getPage(screen) {
    return this.state.ui.page[screen] || 0;
  }

  addEncounter(templateId) {
    if (!templateId) return;
    if (!this.state.encounteredSpirits.includes(templateId)) {
      this.state.encounteredSpirits.push(templateId);
    }
  }

  addStationSpirit(spirit) {
    if (!spirit) return;
    this.state.spiritStations.push({ spirit, depositedAt: Date.now() });
  }

  depositSpirit(spiritIndex) {
    const spirit = this.state.spirits[spiritIndex];
    if (!spirit) return false;
    if (this.state.spirits.length <= 1) return false;
    this.state.spiritStations.push({ spirit, depositedAt: Date.now() });
    this.state.spirits.splice(spiritIndex, 1);
    if (this.state.activeSpiritIndex >= this.state.spirits.length) {
      this.state.activeSpiritIndex = Math.max(0, this.state.spirits.length - 1);
    }
    return true;
  }

  withdrawSpirit(stationIndex) {
    if (this.state.spirits.length >= 6) return false;
    const pack = this.state.spiritStations[stationIndex];
    if (!pack) return false;
    this.state.spirits.push(pack.spirit);
    this.state.spiritStations.splice(stationIndex, 1);
    return true;
  }

  removeStationSpirit(stationIndex) {
    const pack = this.state.spiritStations[stationIndex];
    if (!pack) return null;
    this.state.spiritStations.splice(stationIndex, 1);
    return pack.spirit;
  }

  getSpiritHighestLevel() {
    if (this.state.spirits.length === 0) return 0;
    let max = 0;
    for (let i = 0; i < this.state.spirits.length; i++) {
      if (this.state.spirits[i].level > max) max = this.state.spirits[i].level;
    }
    return max;
  }

  triggerShake(frames) {
    this.state.fx.shakeFrames = Math.max(this.state.fx.shakeFrames, frames || 8);
  }

  triggerFlash(frames) {
    this.state.fx.flashFrames = Math.max(this.state.fx.flashFrames, frames || 6);
  }

  tickFx() {
    if (this.state.fx.shakeFrames > 0) this.state.fx.shakeFrames -= 1;
    if (this.state.fx.flashFrames > 0) this.state.fx.flashFrames -= 1;
  }

  addItem(itemId, quantity) {
    const item = this.state.inventory.find((it) => it.itemId === itemId);
    if (item) {
      item.quantity += quantity;
      return;
    }
    this.state.inventory.push({ itemId, quantity });
  }

  removeItem(itemId, quantity) {
    const item = this.state.inventory.find((it) => it.itemId === itemId);
    if (!item || item.quantity < quantity) return false;
    item.quantity -= quantity;
    if (item.quantity <= 0) {
      this.state.inventory = this.state.inventory.filter((it) => it.itemId !== itemId);
    }
    return true;
  }

  getItemCount(itemId) {
    const item = this.state.inventory.find((it) => it.itemId === itemId);
    return item ? item.quantity : 0;
  }

  getActiveSpirit() {
    return this.state.spirits[this.state.activeSpiritIndex] || null;
  }
}
