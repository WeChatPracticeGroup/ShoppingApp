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

const generateImgUrl = (filePath) => {
    return `cloud://cloud1-5gnddxta5b8abcf2.636c-cloud1-5gnddxta5b8abcf2-1317058792${filePath}`
}

module.exports = {
  formatTime,
  getSearchBarBoundingClientRect,
  generateImgUrl,
}

const homeImages = {
    banners: [
        "/home/banner1.png",
        "/home/banner2.png",
        "/home/banner3.png",
        "/home/banner4.png",
    ],
    categoryImages: [
        {
            title: "消防",
            imagePath: "/home/消防1.png"
        },
        {
            title: "安防",
            imagePath: "/home/安防1.png"
        },
        {
            title: "楼宇自控",
            imagePath: "/home/楼宇自控1.png"
        },
        {
            title: "软件平台",
            imagePath: "/home/软件平台1.png"
        },
        {
            title: "智能生活",
            imagePath: "/home/智能生活1.png"
        },
        {
            title: "电子材料",
            imagePath: "/home/电子材料1.png"
        },
        {
            title: "个人防护设备",
            imagePath: "/home/个人防护设备1.png"
        },
        {
            title: "传感物联",
            imagePath: "/home/传感物联1.png"
        },
    ]
}
