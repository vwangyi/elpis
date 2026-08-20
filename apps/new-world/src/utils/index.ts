import _ from 'lodash';
import type { DebouncedFunc, DebounceSettings, ThrottleSettings } from 'lodash';

export function isArray(arg: unknown) {
  return Array.isArray(arg);
}

/**
 * 创建一个防抖函数
 * https://www.lodashjs.com/docs/lodash.debounce
 * @param func 需要防抖的函数
 * @param wait 延迟毫秒数
 * @param options 选项配置
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait?: number,
  options?: DebounceSettings
): DebouncedFunc<T> {
  return _.debounce(func, wait, options);
}

/**
 * 创建一个节流函数
 * https://www.lodashjs.com/docs/lodash.throttle
 * @param func 需要节流的函数
 * @param wait 延迟毫秒数
 * @param options 选项配置
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait?: number,
  options?: ThrottleSettings
): DebouncedFunc<T> {
  return _.throttle(func, wait, options);
}
