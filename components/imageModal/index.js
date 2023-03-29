Component({
  properties: {
    imgSrc: {
      type: String,
      value: ''
    },
    fileName: {
      type: String,
      value: ''
    }
  },

  methods: {
    saveToPhone() {
      wx.showLoading({
        title: 'Loading...'
      });
      //wx.downloadFile方法：下载文件资源到本地
      wx.downloadFile({
        url: this.properties.imgSrc,
        success: function (res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function (data) {
              wx.hideLoading();
              wx.showToast({
                title: '保存成功',
                icon: 'none'
              })
            },
            // 接口调用失败的回调函数
            fail: function (err) {
              if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
                wx.showModal({
                  title: '提示',
                  content: '请授权保存到相册',
                  modalType: false,
                  success: res => {
                    if (res.confirm) {
                      wx.openSetting({
                        success(settingdata) {
                          console.log("settingdata", settingdata)
                          if (settingdata.authSetting['scope.writePhotosAlbum']) {
                            wx.showToast({
                              title: '授权成功',
                              icon: 'none'
                            })
                          } else {
                            wx.showToast({
                              title: '授权失败',
                              icon: 'none'
                            })
                          }
                        },
                        fail(failData) {
                          console.log("failData", failData)
                        },
                        complete(finishData) {
                          console.log("finishData", finishData)
                        }
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              }
            },
            complete(res) {
              wx.hideLoading(); //隐藏 loading 提示框
            }
          })
        },
        fail: function(err) {
          console.log('down load QR image failed:', err),
          wx.hideLoading();
        }
      })
    },
    clickHide() {
      this.triggerEvent('closeModal')
    }
  }
})