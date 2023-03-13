const throwError = (code = 400, errMsg = "服务器错误") => {
    const err = new Error(errMsg);
    err.fail = true;
    err.code = code;
    err.errMsg = errMsg;
    throw err;
};

module.exports = {
    throwError,
};
