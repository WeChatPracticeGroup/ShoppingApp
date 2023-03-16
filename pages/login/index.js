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
        
    }
});
