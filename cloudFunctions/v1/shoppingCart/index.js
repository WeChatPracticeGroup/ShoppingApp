const cloud = require("wx-server-sdk");
const moment = require('moment');

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
            if(removed > 0){
                return res;
            } else {
                throwError(400, "删除失败")
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
    const { productItems, address, company, amount } = event.params;
    
    const orderId = String(new Date());
    
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
    }
}

module.exports = {
    cartItemAdd,
    cartItems,
    cartItemRemove,
    pay,
};
