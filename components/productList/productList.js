// components/productList/productList.js
Component({
  /**
   * Component properties
   */
  properties: {
    list: {
      type: Array,
      value: []
    },
  },

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   */
  methods: {
    onChange(event) {
      this.setData({
        checked: event.detail,
      });
    },
    gotoPDP(e){
      var item = e.currentTarget.dataset.item;
      console.log(item)
      wx.navigateTo({
        url: '/pages/detail/index?name='+item.code,
      })
    },
  }
})
