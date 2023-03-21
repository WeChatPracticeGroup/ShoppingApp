import request from "/utils/request";
import { generateImgUrl } from '/utils/util';

Page({
  data: {
    placeHolder: "请输入要搜索的商品",
    showBackBtnInSearchBar: true,
    bannerCurrentIndex: 0,
    detail: {},
    imagePrefix: generateImgUrl() + '/categorys/'
  },
  onLoad(options) {
    console.log('onload in detail page:',options);
    wx.showLoading({
      title: 'Loading'
    });

    request.get("product/getProductDetail", {id: options.id}).then((res) => {
      this.setData({
        detail: res.data[0]
      });
      wx.hideLoading();
    }).catch(e => {
      wx.showToast({
        title: e.message || e || "请求错误",
      })
    }).finally(() => {
      wx.hideLoading();
    });
  },
  onBannerChange(options) {
    this.setData({
      bannerCurrentIndex: options.detail.current
    })
  },
  handleToHome(options) {
    wx.switchTab({
      url: '/pages/home/index',
    })
  }
})