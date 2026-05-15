// Canvas 初始化 + 屏幕尺寸
GameGlobal.canvas = wx.createCanvas();

const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();

canvas.width = windowInfo.screenWidth;
canvas.height = windowInfo.screenHeight;

export const SCREEN_WIDTH = windowInfo.screenWidth;
export const SCREEN_HEIGHT = windowInfo.screenHeight;
export const PIXEL_RATIO = windowInfo.pixelRatio || 1;
// 状态栏 + 胶囊按钮区域高度（防止内容被微信导航遮挡）
export const SAFE_TOP = (windowInfo.statusBarHeight || 20) + 4;
// iPhone 底部 Home 条安全区（约 34px），防止按钮被遮挡
export const SAFE_BOTTOM = windowInfo.safeArea
  ? Math.max(0, windowInfo.screenHeight - windowInfo.safeArea.bottom)
  : 0;

// 适配设计稿尺寸 (375x667) 缩放系数
export const DESIGN_WIDTH = 375;
export const DESIGN_HEIGHT = 667;
export const SCALE = Math.min(SCREEN_WIDTH / DESIGN_WIDTH, SCREEN_HEIGHT / DESIGN_HEIGHT);
