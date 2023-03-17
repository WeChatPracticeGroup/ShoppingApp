const cloud = require("wx-server-sdk");

const { throwError } = require("../utils");

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

const cartItemAdd = async (event, context) => {
    const wxContext = cloud.getWXContext();

    const data = {
        openid: wxContext.OPENID,
        ...event.params,
    };
    return await db.collection("shoppingCart").add({
        data,
    });
};

const cartItemUpdate = async (event, context) => {
    const { OPENID } = cloud.getWXContext();

    const { amount } = event.params;
    const data = {
        amount,
    };
    return await db.collection("shoppingCart").where({ openid: OPENID }).update({
        data,
    });
};

module.exports = {
    cartItemAdd,
    cartItemUpdate
}