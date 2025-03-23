"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPosX = exports.getMainLayoutClassName = exports.getDisplayTimeBySeconds = void 0;
exports.throttle = throttle;
const getMainLayoutClassName = layout => {
  switch (layout) {
    case 'stacked':
      return 'rhap_stacked';
    case 'stacked-reverse':
      return 'rhap_stacked-reverse';
    case 'horizontal':
      return 'rhap_horizontal';
    case 'horizontal-reverse':
      return 'rhap_horizontal-reverse';
    default:
      return 'rhap_stacked';
  }
};
exports.getMainLayoutClassName = getMainLayoutClassName;
const getPosX = event => {
  if (event instanceof MouseEvent) {
    return event.clientX;
  } else {
    return event.touches[0].clientX;
  }
};
exports.getPosX = getPosX;
const addHeadingZero = num => {
  return num > 9 ? num.toString() : `0${num}`;
};
const getDisplayTimeBySeconds = (seconds, totalSeconds, timeFormat) => {
  if (!isFinite(seconds)) {
    return null;
  }
  const min = Math.floor(seconds / 60);
  const minStr = addHeadingZero(min);
  const secStr = addHeadingZero(Math.floor(seconds % 60));
  const minStrForHour = addHeadingZero(Math.floor(min % 60));
  const hourStr = Math.floor(min / 60);
  const mmSs = `${minStr}:${secStr}`;
  const hhMmSs = `${hourStr}:${minStrForHour}:${secStr}`;
  if (timeFormat === 'auto') {
    if (totalSeconds >= 3600) {
      return hhMmSs;
    } else {
      return mmSs;
    }
  } else if (timeFormat === 'mm:ss') {
    return mmSs;
  } else if (timeFormat === 'hh:mm:ss') {
    return hhMmSs;
  }
};
exports.getDisplayTimeBySeconds = getDisplayTimeBySeconds;
function throttle(func, limit) {
  let inThrottle = false;
  return arg => {
    if (!inThrottle) {
      func(arg);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}