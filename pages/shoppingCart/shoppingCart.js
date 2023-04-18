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
  onShow(options) {
    this.getCartItems();
  },
  getCartItems() {
    wx.showLoading();
    request.get("shoppingCart/cartItems").then(res => {
      const prefix = generateImgUrl();
      const list = res.data.map(item => {
          item.productInfo.image = `${prefix}/categorys/${item.productInfo.image}`;
          return item;
      })
      this.setData({ list: [...list] });
    }).catch(e => {
      wx.showToast({
          title: e.message || e || "请求错误",
      })
    }).finally(() => wx.hideLoading())
  },
  buyNow(e) {
    const _this = this;
    if(this.data.selectedItems.length < 1) {
        wx.showToast({
            title: '请先勾选商品',
            icon: 'error',
            duration: 1500,
        });
        return;
    }
    
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
    wx.showLoading();
    request.post("shoppingCart/cartItemRemove", param).then(res => {
        wx.showToast({
            title: "删除成功"
        })
      _this.getCartItems()
    }).catch(e => {
      wx.showToast({
          title: e.message || e || "请求错误",
      })
    }).finally(() => {
        setTimeout(() => {
            wx.hideLoading();
        }, 1000)
    })
  },
  updateSelectedItems(e) {
    this.setData({
        selectedItems: e.detail.selectedItems,
    })
  },
  onQuantityChange(e) {
    // console.log("onQuantityChange: ", e.detail);
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

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