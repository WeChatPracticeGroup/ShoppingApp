const UserStatus = {
  NoLogin: 1,
  Login: 2,
};

Component({
  properties: {
    currentLoginType: {
      type: Number,
      value: UserStatus.NoLogin
    },
    userInfo: {
      type: Object,
      value: {}
    },
    isNeedGetUserProfile: {
      type: Boolean,
      value: false
    }
  },
  data: {
    LoginType: UserStatus,
    defaultAvatarUrl: '../../images/user-center-avatar.png',
    phoneNumber: ""
  },
  methods: {
    getUserProfile(e) {
      console.log("This is a text");
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