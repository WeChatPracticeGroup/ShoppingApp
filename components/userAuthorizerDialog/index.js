const {
  default: request
} = require("/utils/request");

Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },
  data: {
    authorizerDialog: {
      title: "用户授权",
      confirmButtonText: "立即授权",
      cancelButtonText: "暂不授权",
      message: "为方便您更好的体验小程序，请先授权"
    }
  },
  methods: {
    onConfirm() {
      wx.showLoading();
      request.post("user/login")
        .then(res => {
          const userInfo = res.data;

          if (!userInfo) {
            return Promise.reject("login failed");
          };

          wx.setStorageSync('userInfo', userInfo);
          this.triggerEvent("onAuthCompleted");
        }).catch(error => {
          console.log(`[login error]: ${JSON.stringify(error)}`);
          wx.showToast({
            title: '授权失败',
            icon: "error",
            duration: 1500,
            mask: false
          })
        }).finally(() => {
          wx.hideLoading();
        });
    },
    onCancel() {
        this.triggerEvent("onCancel");
    }
  }
});