Page({
  data: {
      placeHolder: "请输入要搜索的商品",
      sorts: [
        {
          id: 0,
          name: '名称'
        },
        {
          id: 1,
          name: '价格'
        }
      ]
  },

  handleCategoryTap(e) {
    console.log(e);
  },
  handleSearch(e) {
    const search = this.selectComponent('#searchBar');
    search.runChild();
  },
  handleScrollLower(e) {
    // TODO: scroll到底时更新数据
  }
})