import request from "/utils/request";
import { generateImgUrl } from '/utils/util';

Page({
  data: {
    placeHolder: "请输入要搜索的商品",
    showBackBtnInSearchBar: true,
    bannerCurrentIndex: 0,
    detail: {},
    imagePrefix: generateImgUrl() + '/categorys/',
    num: 1,  
    minusStatus: 'disabled'
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
  toHome(options) {
    wx.switchTab({
      url: '/pages/home/index',
    })
  },
  bindMinus() {  
    var num = this.data.num;
    if (num > 1) {  
        num--;  
    }
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    this.setData({  
        num,  
        minusStatus  
    });  
  },
  bindPlus() {  
      var num = this.data.num;
      num++;
      var minusStatus = num < 1 ? 'disabled' : 'normal';
      this.setData({  
          num,
          minusStatus
      });  
  },
  bindManual(e) {  
      var num = e.detail.value;
      this.setData({  
          num  
      });  
  },
  addToCart() {
    wx.showLoading({
      title: 'Loading'
    });
    
    const params = {id: this.data.detail.id, quantity: this.data.num };
    request.post("shoppingCart/cartItemAdd", params).then(res => {
      if (res.success) {
        wx.showToast({
          title: "成功加入购物车",
        })
      } else {
        wx.hideLoading();
      }
    }).catch(e => {
      wx.showToast({
        title: e.message || e || "请求错误",
      })
    }).finally(() => {
      wx.hideLoading();
    });
  }
})