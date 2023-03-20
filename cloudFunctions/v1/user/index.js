const cloud = require("wx-server-sdk");
const moment = require("moment");

const { throwError } = require("../utils");

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

const DISTRIBUTOR = "distributor";

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
    const {
        clientType = DISTRIBUTOR,
        nickname = "",
        phone = "",
        avatarUrl = "",
    } = event.params;
    const timestamp = Date.now();
    const createdAt = moment(timestamp).format("YYYY-MM-DD HH:mm:ss");

    const data = {
        openid: wxContext.OPENID,
        phone,
        nickname,
        clientType,
        createdAt,
        timestamp,
        avatarUrl,
    };

    const { _id } = await db.collection("users").add({
        data,
    });

    if (_id) {
        const result = await db
            .collection("users")
            .where({
                _id,
            })
            .limit(1)
            .get();

        return { data: result.data[0] };
    }

    return throwError(400, "注册失败");
};

// 获取openId云函数入口函数
const getOpenId = async (event, context) => {
    const wxContext = cloud.getWXContext();

    return {
        openid: wxContext.OPENID,
    };
};

const updateUserProfile = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const { phone, nickname, avatarUrl } = event.params;

    const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (phone && !phoneReg.test(phone)) {
        return throwError(400, "手机号格式不正确");
    }

    const dataToUpdate = {
        phone,
        nickname,
        avatarUrl,
    };

    return await db
        .collection("users")
        .where({
            openid: wxContext.OPENID,
        })
        .update({
            data: { ...dataToUpdate },
        });
};

module.exports = {
    login,
    register,
    getOpenId,
    updateUserProfile,
};
