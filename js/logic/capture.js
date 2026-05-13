// 计算捕捉成功率
export function calculateCaptureRate(enemy, itemMultiplier = 1.0) {
  const hpRatio = enemy.hp / enemy.maxHp;
  let rate = enemy.captureRate * (1 - hpRatio) * itemMultiplier;
  if (hpRatio < 0.1) rate *= 3.0;
  else if (hpRatio < 0.3) rate *= 1.8;
  else if (hpRatio < 0.5) rate *= 1.2;
  if (enemy.captureRate <= 0) return 0;
  return Math.min(0.95, Math.max(0.01, rate));
}

export function attemptCapture(enemy, itemMultiplier = 1.0) {
  const rate = calculateCaptureRate(enemy, itemMultiplier);
  return { success: Math.random() < rate, rate };
}
