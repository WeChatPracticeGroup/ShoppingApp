import request from "/utils/request";

Page({

  /**
   * Page initial data
   */
  data: {
    data: {
      showPayCode: false,
    },
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    var address = {
      location: '西安市天谷七路环普软件苑',
      addressName: 'Kate',
      phone: 111111111,
    }
    var list = [
      {
        image: '/images/banner.png',
        name: 'FC400UV24A',
        summary: '电子式空气净化器',
        price: '￥2300.00'
      },
      {
        image: '/images/banner.png',
        name: 'FC400UV24A',
        summary: '电子式空气净化器',
        price: '￥2300.00'
      }
    ];
    // request.post("shoppingcart/pay").then(res => {
    //   console.log(res)
      // const prefix = generateImgUrl();
      // let { addresses, list, price } = res.data;
      
      // banners = banners.map(banner => `${prefix}${banner}`);
      // categoryImages.forEach(img => {
      //     img.imagePath = `${prefix}${img.imagePath}`;
      // });
      // this.setData({ list: list });
    // }).catch(e => {
    //   wx.showToast({
    //       title: e.message || e || "请求错误",
    //   })
    // })
    this.setData({ address: address, list: list })
  },
  
  handleBackTap: function(e) {
    console.log('handle back tap in search bar');
    let pages = getCurrentPages()
    if(pages[pages.length - 2]){
      //如果有上一页，就返回上一页
      wx.navigateBack({//返回
        delta: 1
      })
    } else {
        wx.switchTab({
          url: '/pages/home/index',
        })
    }
    //wx.navigateBack();
  },
  pay:function(e) {
    this.setData({showPayCode: true})
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