import request from "/utils/request";

Page({
    /**
     * 页面的初始数据
     */
    data: {
        orderList: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {},

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},

    handleAdd() {
        wx.showLoading();
        request.post("order/addOrder", {
            // "id": "0260855311",
            POId: "Q-00949113",
            orderData: "2023-01-21",
            deliveryParty: "成都市 610000",
            orderStatus: "已预订",
            orderAmount: 494756.88,
        })
        .finally(() => {
            this.handleGetOrderList();
            setTimeout(() => {
                wx.hideLoading();
            }, 500);
        });
    },

    handleGetOrderList() {
        wx.showLoading();
        request.get("order/getOrderList")
            .then((res) => {
                this.setData({
                    orderList: res.data,
                });
            })
            .finally(() => {
                setTimeout(function () {
                    wx.hideLoading();
                }, 500);
            });
    },

    handleClearOrderList() {
        wx.showLoading();
        request.post("order/clearOrderList")
            .then(() => {
                this.setData({
                    orderList: [],
                });
            })
            .finally(() => {
                setTimeout(function () {
                    wx.hideLoading();
                }, 500);
            });
    },
});
