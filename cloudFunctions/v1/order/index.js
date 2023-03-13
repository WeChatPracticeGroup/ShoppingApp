const cloud = require("wx-server-sdk");

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
const _ = db.command;

const getOrderList = async (event, context) => {
    const wxContext = cloud.getWXContext();
    return await db
        .collection("orders")
        .field({
            POId: true,
            deliveryParty: true,
            orderAmount: true,
            orderDate: true,
            orderStatus: true,
        })
        .where({
            openid: _.eq(wxContext.OPENID).or(_.eq(null)),
        })
        .get();
};

const getOrderDetail = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const { id } = event.params;
    return await db
        .collection("orders")
        .where({
            openid: wxContext.OPENID,
            _id: id,
        })
        .limit(1)
        .get();
};

const addOrder = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const data = {
        ...event.params,
        openid: wxContext.OPENID,
    };
    return await db.collection("orders").add({
        data,
    });
};

module.exports = {
    getOrderList,
    getOrderDetail,
    addOrder,
}
