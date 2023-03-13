import {
  orderList
} from "../../../mockData/example/oerderList";

// pages/order/order-detail/index.js
Page({

  /**
   * 组件的初始数据
   */
  data: {
    activeNames: ['1'],
    productNames: ['1'],
    orderInfo: {}
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  onProductCollapseChange(event) {
    this.setData({
      productNames: event.detail,
    });
  },
  onLoad(options) {
    this.setData({
      ['orderInfo']: orderList.find(item => item.orderID === options.orderID)
    })
    this.data
  }

})