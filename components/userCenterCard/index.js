Component({
  properties: {
    userInfo: {
      type: Object,
      value: null
    },
  },
  data: {
    defaultAvatarUrl: `https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0`,
    isDialogShow: false
  },
  methods: {
    login(e) {
      if (this.properties.userInfo) return;
      this.triggerEvent("login");
    }
  }
});