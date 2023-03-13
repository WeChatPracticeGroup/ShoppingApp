const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const getSearchBarBoundingClientRect = () => {
  const { top, width, height, right } = wx.getMenuButtonBoundingClientRect();
  const { statusBarHeight } = wx.getSystemInfoSync();
  const margin = top - statusBarHeight;

  return {
    navHeight: (height + statusBarHeight + (margin * 2)), // 导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度 + 状态栏高度
    height: height,
    width: right - width - 20,
    top: statusBarHeight + margin
  };
}

module.exports = {
  formatTime,
  getSearchBarBoundingClientRect
}
