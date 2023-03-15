wx.cloud.init({
    env: 'cloud1-5gnddxta5b8abcf2'
  })
const db = wx.cloud.database({env: 'cloud1-5gnddxta5b8abcf2'})

Page({
  categorysData : [],
  productsData: [],
  data: {
      placeHolder: "请输入关键字搜索",
      categorys: [],
      subCategorys: [],
      menuCategorys: [],
      products: []
  },
  onReady() {
    db.collection('categorys').get().then(res => {
      if (res?.data && res.data.length > 0) {
        console.log('categorys:',res.data);
      } else {
        console.log('no category data');
        return;
      }
      
      this.categorysData = res.data;
      const categorys = res.data;
      categorys[0].isActive = true;
      this.setSubCategorys(categorys[0].id);
      this.setData({ categorys });

      db.collection('products').get().then(res => {
        if (res?.data) {
          console.log('products:',res.data);
        } else {
          console.log('no product data');
        }
       
        this.productsData = res.data;
        const { menuCategorys } = this.data;
        this.setProducts(menuCategorys[0].id);
      });
    });
  },
  setSubCategorys(categoryId) {
    const { menuCategorys } = this.categorysData.find(item => item.id === categoryId);
    menuCategorys[0].isActive = true;
    this.setData({ subCategorys: menuCategorys }, () => {
      this.setMenuCategorys(menuCategorys[0].id);
    });
  },
  setMenuCategorys(subCategoryId) {
    const { subCategorys } = this.data;
    const { menuCategorys } = subCategorys.find(item => item.id === subCategoryId);

    menuCategorys.forEach((item, index) => {
      index === 0 ? item.isActive = true : item.isActive = false
    })
    this.setData({ menuCategorys });
  },
  setProducts(menuCatoryId) {
    const products = [];

    products.push(this.productsData.find(item => item.id === menuCatoryId));
    this.setData({
      products
    })
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