import request from "/utils/request";

Page({
  categorysData : [],
  data: {
      placeHolder: "请输入关键字搜索",
      categorys: [],
      subCategorys: [],
      menuCategorys: [],
      products: [],
      hiddenLoading: true
  },
  onLoad() {
    this.setData({ hiddenLoading: false });
    request.get("product/getCategoryList").then(res => {
      this.setData({ hiddenLoading: true });
      if (res?.data && res.data.length > 0) {
        console.log('categorys:',res.data);
      } else {
        console.log('no category data');
        return;
      }
      
      this.categorysData = res.data;
      const defaultCategory = res.data[0]
      const categoryId = defaultCategory.id;
      const menutCategoryId = defaultCategory.menuCategorys[0].menuCategorys[0].id;

      defaultCategory.isActive = true;
      this.setSubCategorys(categoryId);
      this.setData({ categorys: res.data });
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

    this.setData({ hiddenLoading: false });
    request.get("product/getProductList", {category: menutCategoryId}).then((res) => {
      this.setData({ hiddenLoading: true });
      if (res?.data) {
        console.log(`${menutCategoryId} products:`,res.data);
      } else {
        console.log('no product data');
      }
     
      this.setData({
        products: res.data
      })
    });
  },
  handleCategoryTap(e) {
    console.log(e);
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
    console.log(e.detail.inputValue);
    const search = this.selectComponent('#searchBar');
    search.runChild();
  },
  handleScrollLower(e) {
    // TODO: scroll到底时更新数据
  }
})