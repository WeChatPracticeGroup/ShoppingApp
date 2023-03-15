// pages/userCenter/index.js

const {
  default: request
} = require("/utils/request");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

  },
  async getUserProfile() {
    console.log("this function is triggered");

    wx.showLoading();
    request.post("user/login").then(res => {
      if (res.errMsg) {
        Promise.reject();
        return;
      }

      const openId = res.data ? res.data.openid : null;
      if (!openId) return;
      wx.setStorageSync('openId', openId);

      this.setData({
        isLogin: !!openId,
        userInfo: res.data
      });
    }).catch(error => {
      console.warn("[login error]", error);
      wx.showToast({
        title: '用户登录失败',
        icon: "error"
      })
    }).finally(() => {
      wx.hideLoading();
    });
  },

  Logout() {
    console.log("call logout");
  }
})