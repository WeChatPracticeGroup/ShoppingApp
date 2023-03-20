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
    userInfo: null,
    isDialogShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    });
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

  onAuthCompleted() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      isDialogShow: false
    })
  },
  checkAuth() {
    if (!this.data.userInfo) {
        this.setData({
          isDialogShow: true
        });
        return;
      };
  },
  /*
   * 跳转到通讯簿
   */
  goToAddressPage(option) {
    console.log("oprions: ", option);
    wx.navigateTo({
      url: '/pages/userCenter/address/index',
    })
  },
    /*
   * 跳转到我的资料
   */
    goToProfile(option) {
        console.log("oprions: ", option);
        wx.navigateTo({
          url: '/pages/userCenter/userProfile/index',
        })
      },

  /*
   * 用户登录 
   */
  login() {
    wx.showLoading({
      title: '登录中...',
    });

    request.post("user/login")
      .then(res => {
        const userInfo = res.data;

        if (!userInfo) {
          return Promise.reject("login failed");
        };

        wx.setStorageSync('userInfo', userInfo);

        this.setData({
          userInfo
        });
      }).catch(error => {
        console.log(`[login error]: ${error}`);
        wx.showToast({
          title: '用户登录失败',
          icon: "error"
        })
      }).finally(() => {
        wx.hideLoading();
      });
  },

  /*
   * 用户退出登录
   */
  logout() {
    wx.showLoading();
    wx.removeStorage({
      key: 'userInfo',
    });
    this.setData({
      userInfo: null
    });
    wx.hideLoading();
  }
})