const cloud = require("wx-server-sdk");

const { throwError } = require("../utils");

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

const addressCreate = async (event, context) => {
    const { type, addressDetail, company, zipCode } = event.params;
    const wxContext = cloud.getWXContext();
    const addressCount = await db
        .collection("addressBook")
        .where({
            openid: wxContext.OPENID,
            type,
        })
        .count();

    if (addressCount.total >= 3) {
        return throwError(400, "地址超过3个");
    }

    const data = {
        openid: wxContext.OPENID,
        type,
        zipCode,
        company,
        addressDetail,
    };
    return await db.collection("addressBook").add({
        data,
    });
};

const addressUpdate = async (event, context) => {
    const { id, addressDetail, company, zipCode } = event.params;
    const wxContext = cloud.getWXContext();
    
    const dataToUpdate = {
        addressDetail,
        company,
        zipCode,
    }
    
    return await db
        .collection("addressBook")
        .where({
            openid: wxContext.OPENID,
            _id: id,
        })
        .update({
            data: { ...dataToUpdate },
        })
        .catch((e) => {
            throwError(400, "数据更新失败");
        });
};

const addressGetAll = async (event, context) => {
    const wxContext = cloud.getWXContext();

    return await db
        .collection("addressBook")
        .where({
            openid: wxContext.OPENID,
        })
        .field({
            openid: false,
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
        .field({
            openid: false,
        })
        .get();
};

const addressGetById = async (event, context) => {
    const { id } = event.params;
    const wxContext = cloud.getWXContext();

    return await db
        .collection("addressBook")
        .where({
            openid: wxContext.OPENID,
            _id: id,
        })
        .field({
            openid: false,
        })
        .get()
        .then((res) => {
            const { data } = res;
            if(!data.length) {
                throwError(400, "该地址不存在")
            }
            return {...res, data: data[0]};
        });
};

const addressDelete = async (event, context) => {
    const wxContext = cloud.getWXContext();

    const { id } = event.params;

    return await db
        .collection("addressBook")
        .where({
            openid: wxContext.OPENID,
            _id: id,
        })
        .remove();
};

module.exports = {
    addressCreate,
    addressGetByType,
    addressGetAll,
    addressDelete,
    addressGetById,
    addressUpdate,
};
