const qs = require("qs");

// utils
const { throwError, responseInterceptor } = require("./utils");

// routes
const { login, getOpenId } = require("./user/index");
const {
    addressCreate,
    addressGetAll,
    addressGetByType,
    addressDelete,
} = require("./user/address");
const { getOrderList, addOrder, getOrderDetail } = require("./order/index");

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        let res = await handleRoutes(event, context);
        if (!res) {
            throwError(400, "请求错误");
        }

        return responseInterceptor(res);
    } catch (error) {
        console.error("catch error =>", error);
        error.success = false;
        return error;
    }
};

const handleRoutes = async (event, context) => {
    // seperate the request methods
    switch (event.method) {
        case "GET":
            return await GET(event, context);
        case "POST":
            return await POST(event, context);
        default:
            return throwError(405, "请求Method错误");
    }
};

const GET = async (event, context) => {
    const splitUrl = event.url.split("?");
    const route = splitUrl[0];
    const params = splitUrl[1] ? qs.parse(splitUrl[1]) : {};
    event.params = params;

    switch (route) {
        // user routes
        case "user/addressGetAll":
            return await addressGetAll(event, context);
        case "user/addressGetByType":
            return await addressGetByType(event, context);
        case "user/getOpenId":
            return await getOpenId(event, context);

        // order routes
        case "order/getOrderList":
            return await getOrderList(event, context);
        case "order/getOrderDetail":
            return await getOrderDetail(event, context);

        default:
            return throwError(404, "找不到请求地址");
    }
};

const POST = async (event, context) => {
    switch (event.url) {
        // user routes
        case "user/login":
            return await login(event, context);
        case "user/addressCreate":
            return await addressCreate(event, context);
        case "user/addressDelete":
            return await addressDelete(event, context);

        // order routes
        case "order/addOrder":
            return await addOrder(event, context);

        default:
            return throwError(404, "找不到请求地址");
    }
};
