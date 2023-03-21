import request from "/utils/request";
import { mockOrders } from "./mockData";

Page({
    data: {},
    onLoad: function (options) {},

    userLogin() {
        const params = {
            clientType: "distributor",
        };
        request.post("user/login", params).then((res) => {
            console.log("res: ", res);
        });
    },

    addOrders() {
        mockOrders.forEach((order) => {
            request
                .post("order/addOrdersTest", order)
                .then((res) => {
                    console.log("addOrdersTest: ", res);
                })
                .catch((e) => {
                    console.log("addOrdersTest: ", e);
                });
        });
    },

    getOrderList() {
        const params = {
            status: "1",
        };
        request
            .get("order/getOrderList", params)
            .then((res) => {
                console.log("res: ", res);
            })
            .catch((e) => {
                console.log("e: ", e);
            });
    },

    getOrderDetail() {
        const params = {
            orderID: "34312553114",
        };
        request
            .get("order/getOrderDetail", params)
            .then((res) => {
                console.log("res: ", res);
            })
            .catch((e) => {
                console.log("e: ", e);
            });
    },

    getHomeImages() {
        request
            .get("home/getHomeImages")
            .then((res) => {
                console.log("res: ", res);
            })
            .catch((e) => {
                console.log("e: ", e);
            });
    },

    updateUserPhone() {
        const params = {
            phone: "18482105374",
        };
        request
            .post("user/updateUserPhone", params)
            .then((res) => {
                console.log("res: ", res);
            })
            .catch((e) => {
                console.log("e: ", e);
            });
    },

    cartItemAdd() {
        for (let i = 10; i < 15; i++) {
            const params = {
                id: i,
                quantity: i,
            };

            request.post("shoppingCart/cartItemAdd", params).then(res => {
                console.log("res: ", res);
            }).catch(e => {
                console.log("e: ", e);
            })
        }
    },
    cartItems() {
        request
            .get("shoppingCart/cartItems")
            .then((res) => {
                console.log("res: ", res);
            })
            .catch((e) => {
                console.log("e: ", e);
            });
    },
});
