
import request from '/utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    speedValue: 10,
    orderList: [],
    currentOrderList: [],
    tabAndstatusMap: {
      "1": "已预定",
      "2": "订单待处理",
      "3": "进行中",
      "4": "订单完成",
      //todo:需根据业务对订单分组
    }
  },
  onTabsChange(event) {
    this.setData({
      ['currentOrderList']: event.detail.index === 0 ? this.data.orderList : this.data.orderList.filter(item =>
        item.status == event.detail.index
      )
    })
  },

  openOrderDetail(e) {
    const orderId = e.target.dataset.id
    wx.navigateTo({
      url: '/pages/order/order-detail/index?orderId=' + orderId,
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
    const {
      top,
      width,
      height,
      right
    } = this.data.menuButtonInfo
    wx.getSystemInfo({
      success: (res) => {
        const {
          statusBarHeight
        } = res
        const margin = top - statusBarHeight
        this.setData({
          navHeight: (height + statusBarHeight + (margin * 2)),
          statusBarHeight: statusBarHeight,
          searchMarginTop: statusBarHeight + margin, // 状态栏 + 胶囊按钮边距
          searchHeight: height, // 与胶囊按钮同高
          searchWidth: right - width // 胶囊按钮右边坐标 - 胶囊按钮宽度 = 按钮左边可使用宽度
        })
      },
    })
    request.get('order/getOrderList').then((res) => {
      this.setData({
        orderList: res.data,
        currentOrderList: res.data
      })
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