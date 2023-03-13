import {
  orderList
} from "../../mockData/example/oerderList";


// pages/order/index.js
import {orderListData} from "../../mockData/orderList/orderList"
import request from '/utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    speedValue: 10,
    orderList: orderList,
    tabAndstatusMap: {
      "已预定": "已预定",
      "准备装运": "订单待处理",
      "发货完成": "进行中",
      //todo:需根据业务对订单分组
    }
  },

  onTabsChange(event) {
    var that = this
    this.setData({
      ['orderList']: event.detail.title === "全部" ? orderList : orderList.filter(item =>
        that.data.tabAndstatusMap[item.status] === event.detail.title
      )
    })
    this.data.orderList
  },

  openOrderDetail(e) {
    const orderID = e.target.dataset.id
    wx.navigateTo({
      url: '/pages/order/order-detail/index?orderID=' + orderID,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      menuButtonInfo: wx.getMenuButtonBoundingClientRect()
    })
  //   console.log(this.data.menuButtonInfo)
    const { top, width, height, right } = this.data.menuButtonInfo
    wx.getSystemInfo({
      success: (res) => {
        const { statusBarHeight } = res
        const margin = top - statusBarHeight
        this.setData({
          navHeight: (height + statusBarHeight + (margin * 2)),
          statusBarHeight: statusBarHeight,
          searchMarginTop: statusBarHeight + margin, // 状态栏 + 胶囊按钮边距
          searchHeight: height,  // 与胶囊按钮同高
          searchWidth: right - width // 胶囊按钮右边坐标 - 胶囊按钮宽度 = 按钮左边可使用宽度
        })
      },
    })
    this.getOrderList().then((res) => {
      this.setData({orderListData: res})
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})