const cloud = require("wx-server-sdk");

const { throwError } = require("../utils");

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
const _ = db.command;

const getOrderList = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const { status } = event.params;
    
    let whereConditions = {
        openid: _.eq(wxContext.OPENID).or(_.eq(null)),
    }
    
    if(status) {
        whereConditions = {
            ...whereConditions,
            status,
        }
    }
    
    return await db
        .collection("orders")
        .field({
            address: true,
            orderID: true,
            poNumber: true,
            status: true,
            subscriptionDate: true,
            zipCode: true,
            amount: true,
        })
        .where(whereConditions)
        .get();
};

const getOrderDetail = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const { orderID } = event.params;
    const result = await db
        .collection("orders")
        .where({
            // openid: wxContext.OPENID,
            orderID,
        })
        .get();
        
    if(!result.data.length) {
        throwError(400, "该订单号不存在")
    }
    
    return { data: result.data[0] || null };
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

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRandomFloat = (min, max, decimals) => {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
  
    return parseFloat(str);
  }

const addOrdersTest = async (event, context) => {
    const wxContext = cloud.getWXContext();
    
    const amount = getRandomFloat(100, 10000, 2);
    const zipCode = "610000";
    
    const data = {
        ...event.params,
        status: String(getRandomInt(1, 4)),
        amount,
        zipCode,
        address: `我是一个随机地址：${getRandomInt(1, 100)}`
    }

    return await db.collection("orders").add({
        data,
    });
};

module.exports = {
    getOrderList,
    getOrderDetail,
    addOrder,
    addOrdersTest,
};

