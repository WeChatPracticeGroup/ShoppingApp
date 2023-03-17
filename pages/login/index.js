import request from "/utils/request";
import { mockOrders } from './mockData';

Page({
    data: {},
    onLoad: function (options) {},

    userLogin() {
        const params = {
            clientType: "distributor"
        }
        request.post("user/login", params).then(res => {
            console.log("res: ", res);
        })
    },
    
    addOrders() {
        mockOrders.forEach(order => {
            console.log("order: ", order);
            request.post("order/addOrdersTest", order).then(res => {
                console.log("addOrdersTest: ", res);
            }).catch(e => {
                console.log("addOrdersTest: ", e);
            });
        })
    },
    
    getOrderList() {
        console.log("getOrderList~~");
        const params = {
            status: "1"
        };
        request.get("order/getOrderList", params).then(res => {
            console.log("res: ", res);
        }).catch(e => {
            console.log("e: ", e);
        })
    },
    
    getOrderDetail() {
        console.log("getOrderDetail~~");
        const params = {
            orderID: "34312553114",
        };
        request.get("order/getOrderDetail", params).then(res => {
            console.log("res: ", res);
        }).catch(e => {
            console.log("e: ", e);
        })
    },
    
    getHomeImages() {
        console.log("updateHomeImages~~");
        request.get("home/getHomeImages").then(res => {
            console.log("res: ", res);
        }).catch(e => {
            console.log("e: ", e);
        })
    }
});
