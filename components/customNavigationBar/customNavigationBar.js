// components/customNavigationBar.js

const app = getApp()
const systemInfo = wx.getSystemInfoSync();
// 胶囊按钮位置信息
const menuButtonInfo = wx.getMenuButtonBoundingClientRect();

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    navBarHeight: (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height + systemInfo.statusBarHeight,
    statusBarHeight: systemInfo.statusBarHeight,
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})