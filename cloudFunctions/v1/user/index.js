const cloud = require("wx-server-sdk");

const { addressCreate } = require('./address');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

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
    
    return { data: result.data };
     

};

const register = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const { nickName, avatarUrl, gender } = event.params;

    const data = {
        openid: wxContext.OPENID,
        nickName,
        avatarUrl,
        gender,
    };

    return await db.collection("users").add({
        data,
    });
};

module.exports = {
    login, 
    register,
}