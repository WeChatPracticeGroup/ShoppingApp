const UserStatus = {
  NoLogin: 1,
  Login: 2,
};

Component({
  properties: {
    isLogin: {
      type: Boolean,
      value: false
    },
    userInfo: {
      type: Object,
      value: {}
    },
  },
  data: {
    defaultClientType: "Distributor",
    defaultAvatarUrl: '../../images/user-center-avatar.png',
    phoneNumber: "",
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName')
  },
  methods: {
    getUserProfile(e) {
      if (this.properties.isLogin) return;
      this.triggerEvent("getUserProfile");
    },
    getPhoneNumber() {
      console.log("This is a phone number");
      setTimeout(() => {
        this.setData({
          phoneNumber: "186457898"
        })
      }, 500);
    }
  }
});