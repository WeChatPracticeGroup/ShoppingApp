import request from "/utils/request";

Page({
    data: {
        addressToEdit: null,
        addressOrder: "",
        pageType: "edit", // values: edit, create
        addressType: null,
    },

    onLoad(routerParams) {
        const { id, addressType, pageType } = routerParams;
        if (pageType) {
            this.setData({ pageType, addressType });
        }

        if (pageType === "edit") {
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

    fetchAddress({ addressType, id }) {
        // this.handleDelete({ id });
        console.log("fetchAddress ~~ ");
        let addressToEdit = null;

        const params = {
            type: addressType,
        };
        request.get("user/addressGetByType", params).then((res) => {
            console.log("addressGetByType res: ", res);
        });

        // if (!addressToEdit) {
        //     wx.showToast({
        //         title: "请求失败",
        //         icon: "error",
        //         duration: 2000,
        //     });
        //     wx.navigateBack({
        //         delta: 1,
        //     });
        // }

        this.setData({ addressToEdit });
    },

    formSubmit(e) {
        const { addressMain, addressDetail, zipCode } = e.detail.value;
        // 缺校验逻辑
        const newAddressToEdit = {
            ...this.addressToEdit,
            type: this.data.addressType,
            addressMain,
            addressDetail,
            zipCode,
        };
        this.setData({ addressToEdit: newAddressToEdit });
        this.submit(newAddressToEdit);
    },

    submit(params) {
        request
            .post("user/addressCreate", params)
            .then((res) => {
                console.log("addressCreate res: ", res);
            })
            .catch((e) => {
                console.log("e: ", e.message);
            });
    },
});
