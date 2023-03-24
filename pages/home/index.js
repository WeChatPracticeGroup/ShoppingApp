import request from '/utils/request';
import { generateImgUrl } from '/utils/util';

Page({
    /**
     * 页面的初始数据
     */
    data: {
        messageCount: 1,
        banners: [],
        goods: [],
        userInfo: null,
        isDialogShow: false,
    },

    onLoad() {
        this.init()
    },

    init() {
        this.loadHomePage()
        this.handleUserLogin()
    },
    
    handleUserLogin() {
        const userInfo = wx.getStorageSync('userInfo');
        if(!userInfo) {
            this.setData({
                isDialogShow: true,
            })
        }
    },
    
    onAuthCompleted() {
        wx.showToast({
            title: '授权成功',
            icon: "success"
        });
        this.setData({
            isDialogShow: false,
        })
    },

    loadHomePage() {
        wx.showLoading({
            title: 'Loading'
        });
        request.get("home/getHomeImages").then(res => {
            const prefix = generateImgUrl();
            let { banners, categoryImages } = res.data;
            
            banners = banners.map(banner => `${prefix}${banner}`);
            categoryImages.forEach(img => {
                img.imagePath = `${prefix}${img.imagePath}`;
            });
            
            this.setData({
                banners,
                goods: { ...categoryImages },
            })

            wx.hideLoading();
        }).catch(e => {
            wx.showToast({
                title: e.message || e || "请求错误",
            })
        }).finally(() => {
            wx.hideLoading();
        })
    },

    onItemClick(e) {
        wx.showToast({
            title: '跳转产品功能暂未实现，敬请期待',
            icon: 'none',
            duration: 2000
        })
    },

    toSearchPage() {
        wx.showToast({
            title: 'to search page',
            icon: 'none',
            duration: 2000
        })
    },

    toMessagePage() {
        wx.showToast({
            title: 'to message page',
            icon: 'none',
            duration: 2000
        })
    },

    toOrder() {
        wx.navigateTo({
            url: "/pages/example/index",
        });
    },

    toLogin() {
        wx.navigateTo({
            url: "/pages/login/index",
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() { },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() { },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() { },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() { },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() { },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() { },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() { },
});