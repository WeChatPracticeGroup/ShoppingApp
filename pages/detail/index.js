import request from "/utils/request";

Page({
  data: {
    placeHolder: "请输入要搜索的商品",
    showBackBtnInSearchBar: true,
    banners: [1, 2, 3, 4],
    bannerCurrentIndex: 0,
    productDetailData: {}
  },
  onLoad(options) {
    console.log('detail onload options:',options);
    request.get("product/getProductDetail", {id: options.id}).then((res) => {
      console.log('getProductDetail:',res);
      this.setData({
        productDetailData: res.data[0]
      })
    })
  },
  onBannerChange(options) {
    this.setData({
      bannerCurrentIndex: options.detail.current
    })
  }
})