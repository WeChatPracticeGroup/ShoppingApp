import request from "/utils/request";
import { generateImgUrl } from '/utils/util';

Page({
  data: {
    placeHolder: "请输入要搜索的商品",
    showBackBtnInSearchBar: true,
    list: [],
    selectedItems: [],
    showCheckbox: true,
    disableQuatity: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    this.getCartItems()
  },
  getCartItems() {
    request.get("shoppingCart/cartItems").then(res => {
      const prefix = generateImgUrl();
      const list = res.data.map(item => {
          item.productInfo.image = `${prefix}/categorys/${item.productInfo.image}`;
          return item;
      })
      this.setData({ list });
    }).catch(e => {
      wx.showToast({
          title: e.message || e || "请求错误",
      })
    })
  },
  buyNow(e) {
    const _this = this;
    wx.navigateTo({
      url: '/pages/shoppingCart/checkout',
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: _this.data.selectedItems })
      }
    })
  },
  itemRemove(e) {
    const _this = this;
    let removeList = this.data.selectedItems.map((item) => {
      return item._id;
    })
    const param = {ids: removeList};
    request.post("shoppingCart/cartItemRemove", param).then(res => {
      _this.getCartItems()
    }).catch(e => {
      wx.showToast({
          title: e.message || e || "请求错误",
      })
    })
  },
  updateSelectedItems(e) {
    console.log("updateSelectedItems: ", e.detail);
    this.setData({
        selectedItems: e.detail.selectedItems,
    })
  },
  onQuantityChange(e) {
    console.log("onQuantityChange: ", e.detail);
  },
  addOrder() {
    console.log("addOrder: ", this.data.selectedItems);
    if(!this.data.selectedItems.length) {
        wx.showToast({
            title: '请勾选购买的产品',
            icon: 'error',
            duration: 1500,
        });
        return;
    }
    
    const amount = this.data.selectedItems.reduce((prev, curr) => {
        const { quantity, productInfo } = curr;
        const singleAmount = quantity * productInfo.price
        return prev + Number(singleAmount);
    }, 0).toFixed(2);
    
    const params = {
        productItems: this.data.selectedItems,
        amount: Number(amount),
    }
    
    request.post("shoppingCart/pay", params).then(res => {
        console.log("pay res: ", res);
    }).catch(e => {
        console.error(e.message);
    })
    
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})