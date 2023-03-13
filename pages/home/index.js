Page({
    /**
     * 页面的初始数据
     */
    data: {
        messageCount: 1,
        banners: [1, 2, 3, 4],
        goods: [1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 9, 9, 9, 9, 9]
    },

    jumpToSearchPage() {
        wx.showToast({
            title: 'to search page',
            icon: 'none',
            duration: 2000
        })
    },

    jumpToMessagePage() {
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
     * 生命周期函数--监听页面加载
     */
    onLoad(options) { },

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