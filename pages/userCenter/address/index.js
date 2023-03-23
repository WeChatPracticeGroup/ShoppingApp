import request from "/utils/request";
import { ADDRESS_TYPES } from "/constants/userCenter/address";

Page({
    /**
     * 页面的初始数据
     */
    data: {
        addressSale: [],
        addressDelivery: [],
        addressPayer: [],
        activeTab: 0,
        requiredFetch: true,
    },

    // onLoad() {
    //     this.fetchAddressList();
    // },
    
    onShow() {
        if(this.data.requiredFetch) {
            this.fetchAddressList();
            this.setData({
                requiredFetch: false,
            })
        }
    },
    
    // goUpdate(){
    //     console.log('我更新啦');
    //     this.setData({
    //         requiredFetch: false,
    //     })
    // },


    fetchAddressList() {
        wx.showLoading({
            title: "加载列表中",
        });
        request
            .get("user/addressGetAll")
            .then((res) => {
                const addressList = res.data || [];
                const _addressListSale = [];
                const _addressDelivery = [];
                const _addressPayer = [];
                addressList.forEach((item) => {
                    if (item.type === ADDRESS_TYPES.addressSale.value) {
                        _addressListSale.push(item);
                    } else if (
                        item.type === ADDRESS_TYPES.addressDelivery.value
                    ) {
                        _addressDelivery.push(item);
                    } else if (item.type === ADDRESS_TYPES.addressPayer.value) {
                        _addressPayer.push(item);
                    }
                });

                this.setData({
                    addressSale: _addressListSale,
                    addressDelivery: _addressDelivery,
                    addressPayer: _addressPayer,
                });
            })
            .catch(e => {
                wx.showToast({
                    title: e.message,
                    icon: 'error',
                    duration: 1500,
                });
            })
            .finally(() => {
                setTimeout(() => {
                    wx.hideLoading();
                }, 1000);
            });
    },

    handleEdit(e) {
        const { id, type } = e.currentTarget.dataset;
        if (!id || !type) {
            wx.showToast({
                title: "跳转失败，请重试",
                icon: "error",
                duration: 1500,
            });
            return;
        }

        wx.navigateTo({
            url: `/pages/userCenter/address/edit/index?id=${id}&addressType=${type}&pageType=edit`,
        });
    },
    handleCreate(e) {
        const { type } = e.currentTarget.dataset;
        if (!type) {
            wx.showToast({
                title: "跳转失败，请重试",
                icon: "error",
                duration: 1500,
            });
            return;
        }
        wx.navigateTo({
            url: `/pages/userCenter/address/edit/index?addressType=${type}&pageType=create`,
        });
    },
});
