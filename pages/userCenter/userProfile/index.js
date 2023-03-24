import request from "/utils/request";

const defaultAvatarUrl =
  "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0";

const phoneFormatExp = /^((1[0-9]{10})|(((([0-9]{3}-)?[0-9]{8})|(([0-9]{4}-)?[0-9]{7}))(-[0-9]{1,4})?))$/;

const phoneErrorMessage = "电话格式错误，请重新输入";

Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    userInfo: null,
    nickname: "",
    phone: "",
    phoneErrorMessage: ""
  },

  onShow() {
    const userInfo = wx.getStorageSync("userInfo") || null;
    if (userInfo) {
      const {
        phone = "", avatarUrl, nickname = ""
      } = userInfo;
      this.setData({
        phone,
        avatarUrl,
        nickname,
      });
    }
  },
  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail;
    wx.cloud.uploadFile({
      cloudPath: `avatar/${Date.now()}.jpg`,
      filePath: avatarUrl
    }).then(res => {
      console.log("uploadFile success: ", res.fileID)
      this.setData({
        avatarUrl: res.fileID
      })
    }).catch(error => {
      console.log("uploadFile failed", JSON.stringify(error));
    })
  },
  onNicknameChange(event) {
    console.log("nickName: ", event.detail);
    this.setData({
      nickname: event.detail,
    });
  },
  onPhoneChange(event) {
    if (phoneFormatExp.test(event?.detail)) {
      this.setData({
        phone: event.detail,
        phoneErrorMessage: ''
      });
    } else {
      this.setData({
        phoneErrorMessage: "电话格式错误，请重新输入"
      })
    }
  },
  onSubmit() {
    const {
      phone,
      nickname,
      avatarUrl
    } = this.data;

    wx.showLoading();
    request
      .post("user/updateUserProfile", {
        phone,
        nickname,
        avatarUrl,
      })
      .then((res) => {
        console.log("updateUserProfile res: ", res);
        wx.setStorageSync('userInfo', res.data);
        setTimeout(() => {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1500,
            mask: false,
          });
        })

      })
      .catch((e) => {
        console.log("updateUserProfile e: ", JSON.stringify(e));
        wx.showToast({
          title: e.message,
          icon: 'error',
          duration: 1500,
          mask: false,
        });
      }).finally(() => {
        wx.hideLoading();
      });
  },
});