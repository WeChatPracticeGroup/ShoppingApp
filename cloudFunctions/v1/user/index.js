const cloud = require("wx-server-sdk");

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

const DISTRIBUTOR = "Distributor";

const login = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const result = await db
        .collection("users")
        .where({
            openid: wxContext.OPENID,
        })
        .limit(1)
        .get();

    if (!result.data.length) {
        return await register(event, context);
    }

    return { data: result.data[0] };
};

const register = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const { nickName, gender, phone } = event.params;

    const data = {
        openid: wxContext.OPENID,
        clientType: DISTRIBUTOR,
        nickName,
        gender,
        phone,
    };

    return await db.collection("users").add({
        data,
    });
};

// 获取openId云函数入口函数
const getOpenId = async (event, context) => {
    const wxContext = cloud.getWXContext();

    return {
        openid: wxContext.OPENID,
    };
};

module.exports = {
    login,
    register,
    getOpenId,
};
