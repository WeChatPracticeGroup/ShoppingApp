import {
    addressListSale,
    addressListDelivery,
    addressListPayer,
} from "../../../../mockData/userCenter/address";

Page({
    data: {
        addressToEdit: null,
    },
    onLoad(routerParams) {
        const { id, type } = routerParams;
        this.fetchAddress({ id, type });
    },

    fetchAddress(params) {
        const { id, type } = params;
        let addressToEdit = null;
        if (type === "1") {
            addressToEdit = addressListSale.find(
                (item) => id === String(item.id)
            );
        } else if (type === "2") {
            addressToEdit = addressListDelivery.find(
                (item) => id === String(item.id)
            );
        } else if (type === "3") {
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
        console.log("this.addressToEdit: ", this.addressToEdit);
    },
});
