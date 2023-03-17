// const cloud = require("wx-server-sdk");

// cloud.init({
//     env: cloud.DYNAMIC_CURRENT_ENV,
// });

// const db = cloud.database();


// const homeImages = async (event, context) => {
//     const wxContext = cloud.getWXContext();
//     const result = await db
//         .collection("users")
//         .where({
//             openid: wxContext.OPENID,
//         })
//         .limit(1)
//         .get();

//     if (!result.data.length) {
//         return await register(event, context);
//     }

//     return { data: result.data[0] };
// };