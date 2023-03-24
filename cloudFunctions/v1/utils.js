const throwError = (errCode = 400, errMsg = "服务器错误") => {
    const err = new Error(errMsg);
    err.success = false;
    err.errCode = errCode;
    err.errMsg = errMsg;
    throw err;
};


const responseInterceptor = (response) => {
    response.success = true;
    response.code = 200;
    delete response.errMsg;
    return response;
};

module.exports = {
    throwError,
    responseInterceptor,
};
