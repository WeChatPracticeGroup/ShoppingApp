import request from "/utils/request";
import { generateImgUrl } from '/utils/util';

Page({
  isAsceOrder: false,
  data: {
      placeHolder: "请输入要搜索的商品",
      showBackBtnInSearchBar: true,
      sorts: [
        {
          id: 0,
          name: '名称'
        },
        {
          id: 1,
          name: '价格'
        }
      ],
      products: [],
      imagePrefix: generateImgUrl() + '/categorys/'
  },
  onLoad(options) {
    if (!options.id) {
      return;
    }

    console.log('onload in list page:',options);
    wx.showLoading({
      title: 'Loading'
    });

    request.get("product/getSubProductList", {parentId: options.id}).then((res) => {
      this.setData({
        products: res.data
      })
      wx.hideLoading();
    }).catch(e => {
      wx.showToast({
        title: e.message || e || "请求错误",
      })
    }).finally(() => {
      wx.hideLoading();
    });
  },
  sortList(property) {
    const {products} = this.data;

    this.isAsceOrder = !this.isAsceOrder;
    products.sort((a,b) => {
      if (a[property] < b[property]) {
        return this.isAsceOrder ? 1 : -1;
      }
      if (a[property] > b[property]) {
        return this.isAsceOrder ? -1 : 1;
      }
      return 0;      
    })
    this.setData({
      products
    })
  },
  handleSortTap(e) {
    const {index} = e.currentTarget.dataset;

    if (index === 0) {
      this.sortList('name');
    } else {
      this.sortList('price');
    }
  },
  handleSearch(e) {
    const search = this.selectComponent('#searchBar');
    search.runChild();
  },
  handleScrollLower(e) {
    // TODO: scroll到底时更新数据
  }
})