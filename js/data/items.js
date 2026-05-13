// 物品数据
export const ITEMS = {
  herb: { id: 'herb', name: '草药', type: 'consumable', price: 20, sellPrice: 5, description: '恢复30点HP。', effect: 'heal:30' },
  health_potion: { id: 'health_potion', name: '生命药水', type: 'consumable', price: 50, sellPrice: 12, description: '恢复80点HP。', effect: 'heal:80' },
  super_potion: { id: 'super_potion', name: '超级药水', type: 'consumable', price: 120, sellPrice: 30, description: '恢复200点HP。', effect: 'heal:200' },
  full_restore: { id: 'full_restore', name: '完全恢复', type: 'consumable', price: 300, sellPrice: 75, description: '完全恢复HP。', effect: 'heal:9999' },
  ether: { id: 'ether', name: '蓝药', type: 'consumable', price: 40, sellPrice: 10, description: '恢复所有技能20点PP。', effect: 'restore_pp:20' },
  max_ether: { id: 'max_ether', name: '最大蓝药', type: 'consumable', price: 150, sellPrice: 37, description: '完全恢复所有技能PP。', effect: 'restore_pp:999' },
  revive: { id: 'revive', name: '复活药', type: 'consumable', price: 200, sellPrice: 50, description: '复活一只倒下的精灵。', effect: 'revive:50' },
  max_revive: { id: 'max_revive', name: '完全复活', type: 'consumable', price: 500, sellPrice: 125, description: '复活并完全恢复HP。', effect: 'revive:100' },
  capture_seal: { id: 'capture_seal', name: '封妖符', type: 'capture', price: 30, sellPrice: 7, description: '基础捕捉道具。', effect: 'capture:1.0' },
  advanced_capture_seal: { id: 'advanced_capture_seal', name: '高级封妖符', type: 'capture', price: 100, sellPrice: 25, description: '高级捕捉道具(2x)。', effect: 'capture:2.0' },
  master_capture_seal: { id: 'master_capture_seal', name: '大师封妖符', type: 'capture', price: 300, sellPrice: 75, description: '大师级捕捉道具(4x)。', effect: 'capture:4.0' },
  atk_elixir: { id: 'atk_elixir', name: '攻击精华', type: 'permanent', price: 1000, sellPrice: 250, description: '永久提升3点攻击力。', effect: 'boost:atk:3' },
  def_elixir: { id: 'def_elixir', name: '防御精华', type: 'permanent', price: 1000, sellPrice: 250, description: '永久提升3点防御力。', effect: 'boost:def:3' },
  spd_elixir: { id: 'spd_elixir', name: '速度精华', type: 'permanent', price: 1000, sellPrice: 250, description: '永久提升3点速度。', effect: 'boost:spd:3' },
  hp_elixir: { id: 'hp_elixir', name: '固本丸', type: 'permanent', price: 1000, sellPrice: 250, description: '永久提升5点最大HP。', effect: 'boost:hp:5' },
  exp_voucher_small: { id: 'exp_voucher_small', name: '初级经验券', type: 'consumable', price: 80, sellPrice: 20, description: '获得50点经验值。', effect: 'exp:50' },
  exp_voucher_medium: { id: 'exp_voucher_medium', name: '中级经验券', type: 'consumable', price: 200, sellPrice: 50, description: '获得150点经验值。', effect: 'exp:150' },
  exp_voucher_large: { id: 'exp_voucher_large', name: '高级经验券', type: 'consumable', price: 500, sellPrice: 125, description: '获得400点经验值。', effect: 'exp:400' },
  shards: { id: 'shards', name: '碎瓷片', type: 'consumable', price: 999999, sellPrice: 200, description: '古老的瓷器碎片。', effect: 'none' },
  ancient_coin: { id: 'ancient_coin', name: '古铜币', type: 'consumable', price: 999999, sellPrice: 400, description: '刻有神秘符号的古代铜钱。', effect: 'none' },
  old_jade: { id: 'old_jade', name: '旧玉佩', type: 'consumable', price: 999999, sellPrice: 600, description: '温润的古玉佩。', effect: 'none' },
  bronze_beast: { id: 'bronze_beast', name: '青铜兽雕', type: 'consumable', price: 999999, sellPrice: 800, description: '威严的青铜瑞兽雕塑。', effect: 'none' },
  gold_leaf: { id: 'gold_leaf', name: '金叶子', type: 'consumable', price: 999999, sellPrice: 1000, description: '纯金打造的叶子。', effect: 'none' },
};

// 商店按区域解锁
export const SHOP_ITEMS_BY_AREA = {
  1: ['herb', 'health_potion', 'capture_seal', 'ether'],
  2: ['herb', 'health_potion', 'capture_seal', 'advanced_capture_seal', 'ether', 'revive', 'exp_voucher_small'],
  3: ['health_potion', 'super_potion', 'capture_seal', 'advanced_capture_seal', 'ether', 'max_ether', 'revive', 'exp_voucher_small'],
  4: ['health_potion', 'super_potion', 'capture_seal', 'advanced_capture_seal', 'ether', 'max_ether', 'revive', 'exp_voucher_small', 'exp_voucher_medium'],
  5: ['super_potion', 'full_restore', 'capture_seal', 'advanced_capture_seal', 'ether', 'max_ether', 'revive', 'max_revive', 'exp_voucher_medium'],
  6: ['super_potion', 'full_restore', 'advanced_capture_seal', 'master_capture_seal', 'max_ether', 'revive', 'max_revive', 'exp_voucher_medium'],
  7: ['super_potion', 'full_restore', 'advanced_capture_seal', 'master_capture_seal', 'max_ether', 'revive', 'max_revive', 'atk_elixir', 'exp_voucher_medium', 'exp_voucher_large'],
  8: ['full_restore', 'master_capture_seal', 'max_ether', 'max_revive', 'atk_elixir', 'def_elixir', 'spd_elixir', 'hp_elixir', 'exp_voucher_large'],
  9: ['full_restore', 'master_capture_seal', 'max_ether', 'max_revive', 'atk_elixir', 'def_elixir', 'spd_elixir', 'hp_elixir', 'exp_voucher_large'],
};
