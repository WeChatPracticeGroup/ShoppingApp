Component({
  properties: {
    userInfo: {
      type: Object,
      value: null
    },
  },
  data: {
    defaultAvatarUrl: '../../images/user-center-avatar.png',
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