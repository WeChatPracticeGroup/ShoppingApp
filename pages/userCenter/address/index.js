import {
    addressListSale,
    addressListDelivery,
    addressListPayer,
} from "../../../mockData/userCenter/address";

Page({
    /**
     * 页面的初始数据
     */
    data: {
        addressSale: [],
        addressDelivery: [],
        addressPayer: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.fetchAddressList();
    },

    fetchAddressList() {
        wx.showLoading({
            title: "加载中",
        });
        
        this.setData({
            addressSale: addressListSale,
            addressDelivery: addressListDelivery,
            addressPayer: addressListPayer,
        });

        setTimeout(() => {
            wx.hideLoading();
        }, 1000);
    },
    
    handleEdit(e) {
        const { id, type } = e.currentTarget.dataset;
        if(!id || !type) {
            wx.showToast({
                title: '跳转失败，请重试',
                icon: 'error',
                duration: 2000
              })
            return;              
        }
        
        wx.navigateTo({
            url: `/pages/userCenter/address/edit/index?id=${id}&type=${type}`,
        });
    }
});
