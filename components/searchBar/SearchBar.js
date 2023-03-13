const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      placeHolder: {
        type: String,
        value:  ""
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
    navHeight: app.globalData.searchBar.navHeight,
    searchMarginTop: app.globalData.searchBar.top,
    searchWidth: app.globalData.searchBar.width,
    searchHeight:app.globalData.searchBar.height,
    inputValue: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput: function(e) {
      this.setData({
        inputValue: e.detail.value
      })
    },
    onSearch: function() {
      this.triggerEvent('search', { inputValue: this.data.inputValue });
    },
    runChild: function() {
      this.setData({
        inputValue: 'test run child'
      })
    }
  }
})
