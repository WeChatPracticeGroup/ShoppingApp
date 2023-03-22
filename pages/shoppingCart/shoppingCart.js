import request from "/utils/request";
import { generateImgUrl } from '/utils/util';

Page({
  data: {
    placeHolder: "请输入要搜索的商品",
    showBackBtnInSearchBar: true,
    nameState:0,
    priceState:0,
    chooseImgState:true,
    list: [],
    selectedItems: [],
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    // var list = [
    //   {
    //     image: '/images/banner.png',
    //     name: 'FC400UV24A',
    //     summary: '电子式空气净化器',
    //     price: '￥2300.00'
    //   },
    //   {
    //     image: '/images/banner.png',
    //     name: 'FC400UV24A',
    //     summary: '电子式空气净化器',
    //     price: '￥2300.00'
    //   },
    //   {
    //     image: '/images/banner.png',
    //     name: 'FC400UV24A',
    //     summary: '电子式空气净化器',
    //     price: '￥2300.00'
    //   },
    //   {
    //     image: '/images/banner.png',
    //     name: 'FC400UV24A',
    //     summary: '电子式空气净化器',
    //     price: '￥2300.00'
    //   },
    //   {
    //     image: '/images/banner.png',
    //     name: 'FC400UV24A',
    //     summary: '电子式空气净化器',
    //     price: '￥2300.00'
    //   }
    // ]
    request.get("shoppingCart/cartItems").then(res => {
        // console.log("lala: ", res)
        const prefix = generateImgUrl();
        const list = res.data.map(item => {
            item.productInfo.image = `${prefix}/categorys/${item.productInfo.image}`;
            return item;
        })
        // const prefix = generateImgUrl();
        // let { banners, categoryImages } = res.data;
        
        // banners = banners.map(banner => `${prefix}${banner}`);
        // categoryImages.forEach(img => {
        //     img.imagePath = `${prefix}${img.imagePath}`;
        // });
        this.setData({ list });
      }).catch(e => {
        wx.showToast({
            title: e.message || e || "请求错误",
        })
      })
    //   this.setData({ list: list });
  },
  onChange(event) {
    this.setData({
      checked: event.detail,
    });
  },
  gotoPDP(e){
    var item = e.currentTarget.dataset.item;
    console.log(item)
    wx.navigateTo({
      url: '/pages/detail/index?name='+item.code,
    })
  },
  buyNow(e) {
    wx.navigateTo({
      url: '/pages/shoppingCart/checkout',
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