const qs = require("qs");

// const { throwError } = require("./utils");

const { login } = require("./user/index");
const {
    addressCreate,
    addressGetAll,
    addressGetByType,
} = require("./user/address");

const { getOrderList, addOrder, getOrderDetail } = require("./order/index");

// 云函数入口函数
exports.main = async (event, context) => {
    // try {
    switch (event.method) {
        case "GET":
            return await GET(event, context);
        case "POST":
            return await POST(event, context);
    }
    // } catch (error) {
    //     console.log("reject~~", error);
    //     return error;
    // }
};

const GET = async (event, context) => {
    const splitUrl = event.url.split("?");
    const route = splitUrl[0];
    const params = splitUrl[1] ? qs.parse(splitUrl[1]) : {};
    event.params = params;

    switch (route) {
        case "user/addressGetAll":
            return await addressGetAll(event, context);
        case "user/addressGetByType":
            return await addressGetByType(event, context);

        case "order/getOrderList":
            return await getOrderList(event, context);
    }
};

const POST = async (event, context) => {
    switch (event.url) {
        case "user/login":
            return await login(event, context);
        case "user/addressCreate":
            return await addressCreate(event, context);
        case "order/addOrder":
            return await addOrder(event, context);
        case "order/getOrderDetail":
            return await getOrderDetail(event, context);
    }
};
