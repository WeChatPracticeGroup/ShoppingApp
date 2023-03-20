const app = getApp();

const defaultAvatarUrl =
    "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0";

Page({
    data: {
        avatarUrl: defaultAvatarUrl,
    },
    onLoad() {
        wx.onThemeChange((result) => {
            this.setData({
                theme: result.theme,
            });
        });
    },
    onChooseAvatar(e) {
        const { avatarUrl } = e.detail;
        this.setData({
            avatarUrl,
        });
    },
    onChange(event) {
        // event.detail 为当前输入的值
        console.log(event.detail);
      },
});
