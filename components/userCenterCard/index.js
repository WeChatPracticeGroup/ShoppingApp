Component({
  properties: {
    userInfo: {
      type: Object,
      value: null
    },
  },
  data: {
    // defaultAvatarUrl: '../../images/user-center-avatar.png',
    defaultAvatarUrl: `https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0`,
    phoneNumber: "",
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'),
    isDialogShow: false
  },
  methods: {
    login(e) {
      if (this.properties.userInfo) return;
      this.triggerEvent("login");
    },
    showUserPhoneDialog() {
      this.setData({
        isDialogShow: true
      });
    },
    savePhoneNumber(e) {
      this.setData({
        phoneNumber: e?.detail?.phoneNumber || "",
        isDialogShow: false
      })
    }
  }
});