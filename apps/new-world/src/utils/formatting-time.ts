/**
 * 时间格式化
 */

/** 格式化时间：今天显示 HH:mm，跨天显示 M-D HH:mm */
export function formatTime(time?: string | number | Date) {
  if (!time) return '';
  const d = new Date(time);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');

  console.log(
    '格式化时间今天显示',
    time,
    sameDay ? `${hh}:${mm}` : `${d.getMonth() + 1}-${d.getDate()} ${hh}:${mm}`
  );
  return sameDay
    ? `${hh}:${mm}`
    : `${d.getMonth() + 1}-${d.getDate()} ${hh}:${mm}`;
}
