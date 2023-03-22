import request from "/utils/request";
import { generateImgUrl } from '/utils/util';

Page({
  categorysData : [],
  data: {
      placeHolder: "请输入关键字搜索",
      categorys: [],
      subCategorys: [],
      menuCategorys: [],
      products: [],
      imagePrefix: generateImgUrl() + '/categorys/'
  },
  onLoad() {
    wx.showLoading({
      title: 'Loading'
    });
    request.get("product/getCategoryList").then(res => {
      if (res?.data?.length === 0) {
        return;
      }
      
      this.categorysData = res.data;
      const defaultCategory = res.data[0]
      const categoryId = defaultCategory.id;

      defaultCategory.isActive = true;
      this.setSubCategorys(categoryId);
      this.setData({ categorys: res.data });
      wx.hideLoading();
    }).catch(e => {
      wx.showToast({
        title: e.message || e || "请求错误",
    })
    }).finally(() => {
      wx.hideLoading();
    });
  },
  setSubCategorys(categoryId) {
    const { menuCategorys: subCategorys } = this.categorysData.find(item => item.id === categoryId);
    subCategorys[0].isActive = true;
    this.setData({ subCategorys: subCategorys }, () => {
      this.setMenuCategorys(subCategorys[0].id);
    });
  },
  setMenuCategorys(subCategoryId) {
    const { subCategorys } = this.data;
    const { menuCategorys } = subCategorys.find(item => item.id === subCategoryId);
    menuCategorys.forEach((item, index) => {
      index === 0 ? item.isActive = true : item.isActive = false
    })
    this.setData({ menuCategorys }, () => {
      this.setProducts(menuCategorys[0].id);
    });
  },
  setProducts(menutCategoryId) {
    if (!menutCategoryId) {
      return;
    }

    wx.showLoading({
      title: 'Loading'
    });
    request.get("product/getProductList", {category: menutCategoryId}).then((res) => {
      if (res.data === undefined || res.data.length ===0) {
        return;
      }
     
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
  handleCategoryTap(e) {
    const { id, source } = e.currentTarget.dataset;
    const items = this.data[source];

    if (source === 'categorys') {
      this.setSubCategorys(id);
    } else if(source === 'subCategorys') {
      this.setMenuCategorys(id);
    } else {
      this.setProducts(id);
    }

    items.forEach((item, i) => item.id === id ? item.isActive = true : item.isActive = false);
    this.setData({
      [source]: items
    })
  },
  handleSearch(e) {
    const search = this.selectComponent('#searchBar');
    search.runChild();
  },
  handleScrollLower(e) {
    // TODO: scroll到底时更新数据
  }
})