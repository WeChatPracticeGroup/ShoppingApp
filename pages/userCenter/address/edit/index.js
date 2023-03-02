import {
    addressListSale,
    addressListDelivery,
    addressListPayer,
} from "../../../../mockData/userCenter/address";

Page({
    data: {
        addressToEdit: null,
        addressOrder: "",
        pageType: "edit", // values: edit, create
    },
    onLoad(routerParams) {
        const { id, addressType, pageType } = routerParams;
        if (pageType) {
            this.setData({ pageType });
        }

        if (this.pageType === "edit") {
            this.fetchAddress({ id, addressType });
        }
    },

    fetchAddress(params) {
        const { id, addressType } = params;
        let addressToEdit = null;
        if (addressType === "1") {
            addressToEdit = addressListSale.find(
                (item) => id === String(item.id)
            );
        } else if (addressType === "2") {
            addressToEdit = addressListDelivery.find(
                (item) => id === String(item.id)
            );
        } else if (addressType === "3") {
            addressToEdit = addressListPayer.find(
                (item) => id === String(item.id)
            );
        }

        if (!addressToEdit) {
            wx.showToast({
                title: "请求失败",
                icon: "error",
                duration: 2000,
            });
            wx.navigateBack({
                delta: 1,
            });
        }

        this.setData({ addressToEdit });
    },

    formSubmit(e) {
        console.log("e: ", e.detail.value);
        const { addressMain, addressDetail, zipCode } = e.detail.value;

        // 缺校验逻辑
        const newAddressToEdit = {
            ...this.addressToEdit,
            addressMain,
            addressDetail,
            zipCode,
        };
        this.setData({ addressToEdit: newAddressToEdit });
    },

    submit() {
        console.log("此处提交请求到后端");
    },
});
