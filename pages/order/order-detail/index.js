import {
  orderList
} from "/mockData/orderList/orderList"
import request from '/utils/request'

// pages/order/order-detail/index.js
Page({

  /**
   * 组件的初始数据
   */
  data: {
    activeNames: ['1'],
    productNames: ['1'],
    orderInfo: {},
    tabAndstatusMap: {
      "1": "已预定",
      "2": "订单待处理",
      "3": "进行中",
      "4": "订单完成",
    }
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
    request.get('order/getOrderDetail', {orderId: options.orderId}).then((res) => {
      this.setData({
        orderInfo: res.data
      })
      console.log(res.data)
    })
  }
})