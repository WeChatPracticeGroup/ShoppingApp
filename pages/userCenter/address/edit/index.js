import request from "/utils/request";

Page({
    data: {
        addressToEdit: null,
        addressOrder: "",
        pageType: "edit", // values: edit, create
        addressType: null,
    },

    onLoad(routerParams) {
        const { id = null, addressType, pageType } = routerParams;
        if (pageType) {
            this.setData({ pageType, addressType });
        }

        if (pageType === "edit" && id) {
            this.fetchAddress({ id, addressType });
        }
    },

    // handleDelete(params) {
    //     request
    //         .post("user/addressDelete", params)
    //         .then((res) => {
    //             console.log("handleLogin res: ", res);
    //         })
    //         .catch((e) => {
    //             console.log("handleLogin e: ", e);
    //         });
    // },

    fetchAddress({ id }) {
        const params = {
            id,
        };
        wx.showLoading({
            title: "加载中",
            mask: false,
        });
        request
            .get("user/addressGetById", params)
            .then((res) => {
                this.setData({ addressToEdit: res.data });
            })
            .catch((e) => {
                wx.showToast({
                    title: "加载失败",
                    icon: "error",
                    duration: 1500,
                    mask: false,
                });
            })
            .finally(() => {
                wx.hideLoading();
            });
    },

    formSubmit(e) {
        const { addressMain, addressDetail, zipCode } = e.detail.value;
        // 缺校验逻辑
        const newAddressToEdit = {
            id: this.data.addressToEdit?._id || null,
            type: this.data.addressType,
            addressMain,
            addressDetail,
            zipCode,
        };
        this.setData({ addressToEdit: newAddressToEdit });

        const { pageType } = this.data;
        if (pageType === "create") {
            this.submit("user/addressCreate", newAddressToEdit);
        } else if (pageType === "edit") {
            this.submit("user/addressUpdate", newAddressToEdit);
        }
    },

    submit(url, params) {
        wx.showLoading({ title: "提交中" });
        request
            .post(url, params)
            .then((res) => {
                wx.showToast({
                    title: "提交成功",
                    icon: "success",
                    duration: 1500,
                });
                this.messageBeforePage();
                setTimeout(() => {
                    wx.navigateBack({
                        delta: 1,
                    });
                }, 1000);
            })
            .catch((e) => {
                wx.showToast({
                    title: e.message || "提交失败",
                    icon: "error",
                    duration: 1500,
                });
            })
            .finally(() => {
                setTimeout(() => {
                    wx.hideLoading();
                }, 2000);
            });
    },

    messageBeforePage() {
        let pages = getCurrentPages();
        let beforePage = pages[pages.length - 2];
        beforePage.setData({
            requiredFetch: true,
        });
        // beforePage.goUpdate();
    },
});
