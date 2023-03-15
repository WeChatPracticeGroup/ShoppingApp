const cloud = require("wx-server-sdk");

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

const getProductList = async (event, context) => {
    const { category } = event.params;
    return await db
        .collection("products") 
        .where({
            categorys: Number(category), 
            parentId : 0
        })
        .get();
};

const getSubProductList = async (event, context) => {
  const { parentId } = event.params;
  return await db
        .collection("products")
        .where({
          parentId: Number(parentId)
        })
        .limit(10)
        .get();
};

const getProductDetail = async (event, context) => {
    const { id } = event.params;
    return await db
        .collection("products")
        .where({
            id: Number(id),
        })
        .limit(1)
        .get();
};

const getCategoryList = async (event, context) => {
    return await db
        .collection("categorys")       
        .get();
};

module.exports = {
    getProductList,
    getSubProductList,
    getProductDetail,
    getCategoryList
}
