import wxbarcode from 'wxbarcode';
import request from "/utils/request";
import { generateImgUrl } from '/utils/util';

Page({

  /**
   * Page initial data
   */
  data: {
      showPayCode: false,
      showCheckbox: false,
      disableQuatity: true,
      showAddressOptions: false,
      addressOptions: [
        {
          name: '选项',
          subname: '描述信息',
        },
        {
          name: '选项',
          subname: '描述信息',
        },
        {
          name: '选项',
          subname: '描述信息',
        },
      ],
      selectedAddress: null,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    wxbarcode.qrcode('qrcode', '1234567890123456789', 400, 600);
    const _this =  this;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      const list = data.data;
      let price = 0;
      for(var i = 0; i < list.length; i++) {
        price += list[i].productInfo.price * list[i].quantity;
      }
      //get address
      _this.getAddress();
      _this.setData({ list, price: price.toFixed(2) });
    //   _this.getPay(data.data);
    })
  },

  getAddress: function() {
    request.get("user/addressGetByType", {type: 1}).then(res => {
      const adddressOptions = res.data.map(address => {
            return {
                ...address,
                name: address.company,
                subname: address.addressDetail,
            }
      });
      
      this.setData({ 
        adddressOptions,
        selectedAddress: adddressOptions[0] || null,
     })
      
    }).catch(e => {
      wx.showToast({
          title: e.message || e || "请求错误",
      })
    })
  },
  onShowAddress() {
    const { addressOptions } = this.data;
    if(addressOptions && addressOptions.length) {
        this.setData({ showAddressOptions: true })
        return;
    }
    
    wx.showToast({
        title: '请先添加地址',
        icon: 'none',
        duration: 1000,
        success: ()=>{
            setTimeout(() => {
                wx.redirectTo({
                    url: "/pages/userCenter/address/index",
                });
            }, 1500)
        },
    });
  },
  onSelectAddress(e) {
    this.setData({
        selectedAddress: e.detail
    })
  },
  onCloseAddress() {
    this.setData({ showAddressOptions: false })
  },
  getPay: function(data) {
    const { company, addressDetail, zipCode } = this.data.selectedAddress;
    const params = {
      amount: Number(this.data.price),
      productItems: data,
      company, 
      address: addressDetail, 
      zipCode,
    }
    request.post("shoppingCart/pay", params).then(res => {
      wx.showToast({
          title: "支付成功",
          duration: 1500,
      })
      this.messageCartToUpdate();
      setTimeout(() => {
        wx.navigateBack({
            delta: 1
          });
      }, 1500)
    }).catch(e => {
      wx.showToast({
          title: e.message || e || "请求错误",
      })
    }).finally(() => {
        this.setData({ showPayCode: false });
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
    this.setData({ showPayCode: true });
  },
  payFinished() {
    this.getPay(this.data.list)
  },
  messageCartToUpdate() {
    let pages = getCurrentPages();
    let beforePage = pages[pages.length - 2];
    beforePage.getCartItems();
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