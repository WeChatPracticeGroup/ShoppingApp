import request from "/utils/request";

Page({

  /**
   * Page initial data
   */
  data: {
      showPayCode: false,
      showCheckbox: false,
      disableQuatity: true
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    const _this =  this;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      const list = data.data;
      let price = 0;
      for(var i = 0; i < list.length; i++) {
        price += list[i].productInfo.price * list[i].quantity;
      }
      //get address
      const address = _this.getAddress();
      _this.setData({ list, price, address });
      _this.getPay(data.data);
    })
  },

  getAddress: function() {
    request.get("user/addressGetByType", {type: 1}).then(res => {
      console.log(res) 
      //const address = res.data;
    }).catch(e => {
      wx.showToast({
          title: e.message || e || "请求错误",
      })
    })
    
    const address = {
      location: '西安市天谷七路环普软件苑',
      addressName: 'Kate',
      phone: 111111111,
      company: '奈佳罗软件'
    }

    return address;
  },
  getPay: function(data) {
    let amount = 0;
    for(let i = 0; i<data.length; i++) {
      amount += data[i].quantity;
    }
    const params = {
      amount: amount,
      productItems: data
    }
    console.log(params)
    request.post("shoppingCart/pay", params).then(res => {
      console.log(res)
    }).catch(e => {
      wx.showToast({
          title: e.message || e || "请求错误",
      })
    })
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