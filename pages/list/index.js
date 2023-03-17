import request from "/utils/request";

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
      products: []
  },
  onLoad(options) {
    if (!options.id) {
      return;
    }
    console.log('list onload options:',options);         
    request.get("product/getSubProductList", {parentId: 6}).then((res) => {
      console.log('getSubProductList:',res);
      this.setData({
        products: res.data
      })
    })
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
    console.log(e);
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