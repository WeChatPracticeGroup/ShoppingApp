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
    
    handleDetail() {
        console.log("handleDetail");
        wx.showModal({
            title: '编辑',
            content: '',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {
                if(result.confirm){
                    
                }
            },
            fail: ()=>{},
            complete: ()=>{}
        });
    }
});
