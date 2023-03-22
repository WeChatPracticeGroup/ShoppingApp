const cloud = require("wx-server-sdk");
const moment = require("moment");

const { throwError } = require("../utils");

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
const _ = db.command;

const cartItemAdd = async (event, context) => {
    const wxContext = cloud.getWXContext();

    const { id, quantity = 1 } = event.params;

    const data = {
        openid: wxContext.OPENID,
        quantity,
        productId: id,
    };
    return await db
        .collection("shoppingCart")
        .add({
            data,
        })
        .then((res) => {
            return res;
        });
};

const cartItemRemove = async (event, context) => {
    const { OPENID } = cloud.getWXContext();

    const { ids = [] } = event.params;

    return await db
        .collection("shoppingCart")
        .where({ openid: OPENID, _id: _.in(ids) })
        .remove()
        .then((res) => {
            const { removed } = res.stats;
            if (removed > 0) {
                return res;
            } else {
                throwError(400, "删除失败");
            }
        });
};

const cartItems = async (event, context) => {
    const { OPENID } = cloud.getWXContext();

    const cartItems = await db
        .collection("shoppingCart")
        .where({ openid: OPENID })
        .get()
        .then((res) => {
            const { data = [] } = res;
            const idList = data.map((item) => {
                const { productId, quantity, _id } = item;
                return {
                    _id,
                    productId,
                    quantity,
                };
            });

            return idList;
        });

    const productIdGroup = cartItems.map((item) => Number(item.productId));

    const products = await db
        .collection("products")
        .where({
            id: _.in(productIdGroup),
        })
        .get()
        .then((res) => {
            return res.data;
        })
        .catch((e) => {
            throwError(400, "获取商品信息失败");
        });

    const dataReturn = products.map((product) => {
        const cartInfo = cartItems.find(
            (item) => item.productId === product.id
        );

        const result = {
            productInfo: product,
            ...cartInfo,
            // amount: (product.price * cartInfo.quantity).toFixed(2),
        };
        return result;
    });

    return { data: dataReturn };
};

const pay = async (event, context) => {
    const { OPENID } = cloud.getWXContext();
    const { address = "我是详细地址", company = "某某公司" } = event.params;

    const productItems = [
        {
            productId: 3,
            quantity: 3,
            productInfo: [
                {
                    categorys: [3],
                    description:
                        "空气净化器在居家、医疗、工业领域均有应用，居家领域以单机类的家用空气净化器为市场的主流产品。最主要的功能是去除空气中的颗粒物，包括过敏原、室内的PM2.5等，同时还可以解决由于装修或者其他原因导致的室内、地下空间、车内挥发性有机物空气污染问题。由于相对封闭的空间中空气污染物的释放有持久性和不确定性的特点，因此使用空气净化器净化室内空气是国际公认的改善室内空气质量的方法之一",
                    id: 3,
                    image: "空气处理系统/便携式空气净化器/2.png",
                    longName: "产品_比较长的名字测试_3",
                    name: "产品_3",
                    parentId: 0,
                    price: 861.7,
                    _id: "0882251a6418032200cfc03a34f84bad",
                },
            ],
        },
    ];

    const orderId = new Date();

    const order = {
        amount,
        company,
        address,
        productItems,
        poNumber: `P-009${orderId.substring(orderId.length - 8)}`,
        orderId,
        subscriptionDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        status: 1,
        openid: OPENID,
    };

    const result = await db
        .collection("orders")
        .add({
            data: order,
        })
        .then((res) => {
            return res;
        })
        .catch((e) => {
            throwError(400, "提交订单失败");
        });

    console.log("result: ", result);
    if (result) {
    }
};

module.exports = {
    cartItemAdd,
    cartItems,
    cartItemRemove,
    pay,
};
