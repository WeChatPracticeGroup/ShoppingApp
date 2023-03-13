import {categoryListData} from "../../mockData/category/category"

Page({
  data: {
      placeHolder: "请输入关键字搜索",
      categorys: [
        {
          id: 0,
          name: '按品牌',
          isActive: true
        },
        {
          id: 1,
          name: '按类别',
          isActive: false
        }
      ],
      subCategorys: [
        {
          id: 0,
          name: '智能生活解决方案',
          isActive: true
        },
        {
          id: 1,
          name: '服务',
          isActive: false
        },
        {
          id: 2,
          name: '入侵检测',
          isActive: false
        },
        {
          id: 3,
          name: '控制器',
          isActive: false
        }
      ],
      menuItems: [
        {
          id: 0,
          name: '空气处理系统',
          isActive: true
        },
        {
          id: 1,
          name: '其他空水产品',
          isActive: false
        },
        {
          id: 2,
          name: '全屋水系统',
          isActive: false
        },
        {
          id: 3,
          name: '智能控制系统',
          isActive: false
        }
      ]
  },
  onReady() {
    const mockData = categoryListData;
    console.log(mockData);
  },
  handleCategoryTap(e) {
    console.log(e);
    const { index, source } = e.currentTarget.dataset;
    const items = this.data[source];
    items.forEach((item, i) => item.id === index ? item.isActive = true : item.isActive = false);
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