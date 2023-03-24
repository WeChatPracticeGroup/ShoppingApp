const cloud = require("wx-server-sdk");

const { throwError } = require("../utils");

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

const getHomeImages = async (event, context) => {
    const result = await db.collection("staticImages").limit(1).get();

    const imagesObj = result.data[0].home;
    if (!result.data.length || !imagesObj) {
        return throwError(400, "获取主页图片失败");
    }

    return { data: imagesObj };
};

// const updateHomeImages = async (event, context) => {
//     const data = {
//         home: {
//             banners: [
//                 "/home/banner1.png",
//                 "/home/banner2.png",
//                 "/home/banner3.png",
//                 "/home/banner4.png",
//             ],
//             categoryImages: [
//                 {
//                     title: "消防",
//                     imagePath: "/home/消防1.png",
//                 },
//                 {
//                     title: "安防",
//                     imagePath: "/home/安防1.png",
//                 },
//                 {
//                     title: "楼宇自控",
//                     imagePath: "/home/楼宇自控1.png",
//                 },
//                 {
//                     title: "软件平台",
//                     imagePath: "/home/软件平台1.png",
//                 },
//                 {
//                     title: "智能生活",
//                     imagePath: "/home/智能生活1.png",
//                 },
//                 {
//                     title: "电子材料",
//                     imagePath: "/home/电子材料1.png",
//                 },
//                 {
//                     title: "个人防护设备",
//                     imagePath: "/home/个人防护设备1.png",
//                 },
//                 {
//                     title: "传感物联",
//                     imagePath: "/home/传感物联1.png",
//                 },
//             ],
//         },
//     };
//     return await db.collection("staticImages").add({
//         data,
//     });
// };

module.exports = {
    // updateHomeImages,
    getHomeImages,
};
