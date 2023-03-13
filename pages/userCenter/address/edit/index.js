// import {
//     addressListSale,
//     addressListDelivery,
//     addressListPayer,
// } from "../../../../mockData/userCenter/address";
import request from '/utils/request';

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

        if (this.pageType === "edit") {
            this.fetchAddress({ id, addressType });
        }
    },

    fetchAddress({ addressType }) {
        console.log("fetchAddress ~~ ");
        let addressToEdit = null;
        
        const params = {
            type: addressType
        }
        request.get("user/addressGetByType", params).then(res => {
            console.log("addressGetByType res: ", res);
        })

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
        console.log("e: ", e.detail.value);
        const { addressMain, addressDetail, zipCode } = e.detail.value;
        console.log("this.data.addressType: ", this.data.addressType);
        // 缺校验逻辑
        const newAddressToEdit = {
            ...this.addressToEdit,
            type: this.data.addressType,
            addressMain,
            addressDetail,
            zipCode,
        };
        console.log("newAddressToEdit: ", newAddressToEdit);
        this.setData({ addressToEdit: newAddressToEdit });
        this.submit(newAddressToEdit);
    },

    submit(params) {
        console.log("此处提交请求到后端");
        request.post("user/addressCreate", params).then(res => {
            console.log("addressCreate res: ", res);
        })
    },
});
