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
    showCheckbox: {
      type: Boolean,
      value: true
    },
    disableQuatity: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Component initial data
   */
  data: {
    // list: [],
    selectedItemIds: [],
  },
  
  /**
   * Component methods
   */
  methods: {
    onChange(event) {
    const selectedItemIds = event.detail;
      this.setData({
        selectedItemIds
      });
      
      const selectedItems = this.properties.list.filter(item => selectedItemIds.includes(item._id));
      this.triggerEvent('updateSelectedItems', {
        selectedItems
      });
    },
    gotoPDP(e){
      var item = e.currentTarget.dataset.item;
      wx.navigateTo({
        url: '/pages/detail/index?id='+item.productInfo.id,
      })
    },
    onQuantityChange(e) {
        this.properties.list.forEach(item => {
            if(item._id === e.currentTarget.dataset._id) {
                item.quantity = e.detail;
            }
        });
        
        this.triggerEvent('onQuantityChange', {
            list: this.properties.list
        });
    }
  }
})
