const cloud = require("wx-server-sdk");

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV,
});

const createQRCode = async (event, context) => {
  const {path, scene, name} = event.params;
  try {
    const result = await cloud.openapi.wxacode.getUnlimited({
      path,
      scene: scene || 'type=detail'
    })
    const upload = await cloud.uploadFile({
      cloudPath: `qrcode/${name}.png`,
      fileContent: result.buffer
    })
    return upload;
  } catch (err) {
    console.log(err)
    return err;
  }
};

module.exports = {
  createQRCode
};