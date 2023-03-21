const qs = require("qs");

// utils
const { throwError, responseInterceptor } = require("./utils");

// routes
const { login, getOpenId, updateUserProfile } = require("./user/index");
const { getHomeImages } = require("./home/index");
const {
    addressCreate,
    addressGetAll,
    addressGetByType,
    addressDelete,
} = require("./user/address");
const { cartItemAdd, cartItems } = require("./shoppingCart/index");
const { getOrderList, addOrder, getOrderDetail, addOrdersTest } = require("./order/index");
//product

const {
    getProductList,
    getSubProductList,
    getProductDetail,
    getCategoryList,
} = require("./product/index");

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        console.log("event: ", event);
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
        // home routes
        case "home/getHomeImages": 
            return await getHomeImages(event, context);
        
        // user routes
        case "user/addressGetAll":
            return await addressGetAll(event, context);
        case "user/addressGetByType":
            return await addressGetByType(event, context);
        case "product/getProductList":
            return await getProductList(event, context);
        case "product/getSubProductList":
            return await getSubProductList(event, context);
        case "product/getProductDetail":
            return await getProductDetail(event, context);
        case "product/getCategoryList":
            return await getCategoryList(event, context);
        case "user/getOpenId":
            return await getOpenId(event, context);

        // order routes
        case "order/getOrderList":
            return await getOrderList(event, context);
        case "order/getOrderDetail":
            return await getOrderDetail(event, context);

        // shopping cart routes
        case "shoppingCart/cartItems":
            return await cartItems(event, context);
        
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
        case "user/updateUserProfile":
            return await updateUserProfile(event, context);

        // order routes
        case "order/addOrder":
            return await addOrder(event, context);
        case "order/addOrdersTest":
            return await addOrdersTest(event, context);

        // shopping cart routes
        case "shoppingCart/cartItemAdd":
            return await cartItemAdd(event, context);
            
        default:
            return throwError(404, "找不到请求地址");
    }
};
