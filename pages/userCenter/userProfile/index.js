import request from "/utils/request";

const defaultAvatarUrl =
    "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0";

Page({
    data: {
        avatarUrl: defaultAvatarUrl,
        userInfo: null,
        nickname: '',
        phone: '',
    },

    onShow() {
        const userInfo = wx.getStorageSync("userInfo") || null;
        if (userInfo) {
            const { phone = '', avatarUrl, nickname = '' } = userInfo;
            this.setData({
                phone,
                avatarUrl,
                nickname,
            });
        }
    },
    onChooseAvatar(e) {
        const { avatarUrl } = e.detail;
        console.log("avatarUrl: ", avatarUrl);
        this.setData({
            avatarUrl,
        });
    },
    onNicknameChange(event) {
        this.setData({
            nickname: event.detail,
        });
    },
    onPhoneChange(event) {
        this.setData({
            phone: event.detail,
        });
    },
    onSubmit() {
        const { phone, nickname, avatarUrl } = this.data;
        const params = {
            phone,
            nickname,
            avatarUrl,
        };
        wx.showLoading();
        request
            .post("user/updateUserProfile", params)
            .then((res) => {
                console.log("updateUserProfile res: ", res);
                wx.showToast({
                    title: '修改成功',
                    icon: 'success',
                    duration: 1500,
                    mask: false,
                });
            })
            .catch((e) => {
                console.log("updateUserProfile e: ", e);
                wx.showToast({
                    title: e.message,
                    icon: 'success',
                    duration: 1500,
                    mask: false,
                });
            }).finally(() => {
                wx.hideLoading();
            });
    },
});
