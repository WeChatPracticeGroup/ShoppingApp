const cloud = require("wx-server-sdk");

const { throwError } = require("../utils");

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

const addressCreate = async (event, context) => {
    const { params } = event;
    const wxContext = cloud.getWXContext();
    const addressCount = await db
        .collection("addressBook")
        .where({
            openid: wxContext.OPENID,
            type: params.type,
        })
        .count();

    if (addressCount.total >= 3) {
        return throwError(400, "最多只可保存3个地址");

        // return {
        //     data: null,
        //     errMsg: "最多只可保存3个地址",
        // };
    }

    const data = {
        openid: wxContext.OPENID,
        ...event.params,
    };

    return await db.collection("addressBook").add({
        data,
    });
};

const addressGetAll = async (event, context) => {
    const wxContext = cloud.getWXContext();

    return await db
        .collection("addressBook")
        .where({
            openid: wxContext.OPENID,
        })
        .orderBy("type", "asc")
        .get();
};

/**
 * @param type string "1, 2, 3..."
 */
const addressGetByType = async (event, context) => {
    const { type } = event.params;
    const wxContext = cloud.getWXContext();

    return await db
        .collection("addressBook")
        .where({
            openid: wxContext.OPENID,
            type,
        })
        .get();
};

module.exports = {
    addressCreate,
    addressGetByType,
    addressGetAll,
};
