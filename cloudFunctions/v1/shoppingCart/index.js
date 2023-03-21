const cloud = require("wx-server-sdk");

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

const cartItems = async (event, context) => {
    const { OPENID } = cloud.getWXContext();

    const cartItems = await db
        .collection("shoppingCart")
        .where({ openid: OPENID })
        .get()
        .then((res) => {
            const { data = [] } = res;
            const idList = data.map((item) => {
                const { productId, quantity } = item;
                return {
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

module.exports = {
    cartItemAdd,
    cartItems,
};
