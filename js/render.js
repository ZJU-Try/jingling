// Canvas 初始化 + 屏幕尺寸
GameGlobal.canvas = wx.createCanvas();

const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();

canvas.width = windowInfo.screenWidth;
canvas.height = windowInfo.screenHeight;

export const SCREEN_WIDTH = windowInfo.screenWidth;
export const SCREEN_HEIGHT = windowInfo.screenHeight;
export const PIXEL_RATIO = windowInfo.pixelRatio || 1;

// 适配设计稿尺寸 (375x667) 缩放系数
export const DESIGN_WIDTH = 375;
export const DESIGN_HEIGHT = 667;
export const SCALE = Math.min(SCREEN_WIDTH / DESIGN_WIDTH, SCREEN_HEIGHT / DESIGN_HEIGHT);
