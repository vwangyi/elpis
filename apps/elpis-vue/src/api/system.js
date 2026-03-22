/**
 * @param {*} database 数据库名
 * @param {*} version 数据库版本
 * @param {*} upgradeCallback 升级时回调
 */
export function openDatabase(database, version, upgradeCallback) {
  return new Promise((resolve, reject) => {
    const indexedDB = window.indexedDB;
    if (!indexedDB) {
      throw new Error("不支持window.indexedDB");
    }
    const res = indexedDB.open(database, version);
    // 升级数据库就触发 比如 新建表。表里面新增一条数据 不叫数据库更新 最多叫表更新了
    res.onupgradeneeded = upgradeCallback;
    res.onerror = reject;
    res.onsuccess = resolve;
  });
}

/**
 * 检测浏览器类型
 * @returns { String }
 */
export function detectBrowser() {
  const { userAgent } = window.navigator;
  if (/Chrome/.test(userAgent) && !/Edg|OPR/.test(userAgent)) return "Chrome";
  if (/Firefox/.test(userAgent)) return "Firefox";
  if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) return "Safari";
  if (/Edg/.test(userAgent)) return "Edge";
  return "";
}

/**
 * 获取系统电池信息
 * @returns
 */
export async function getBatteryInfo() {
  return new Promise(async (resolve, reject) => {
    if ("getBattery" in window.navigator) {
      const battery = await window.navigator.getBattery();

      // "电量:", battery.level * 100 + "%");
      // "充电中:", battery.charging);
      // "充电时间:", battery.chargingTime);
      // "放电时间:", battery.dischargingTime);
      // "battery", battery);

      // 监听电量变化
      //   battery.addEventListener("levelchange", () => {
      //     "电量变化:", battery.level * 100 + "%");
      //   });
      resolve(battery);
    } else {
      // 比如 safari浏览器 就不支持 window.navigator.getBattery
      reject(`您的${detectBrowser()}浏览器不支持获取电量`);
    }
  });
}
