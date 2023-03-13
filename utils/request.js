import qs from "querystring";

class Request {
    get(url, params, header = {}, extraOptions) {
        const options = {
            method: "GET",
            url: url + "?" + qs.stringify(params),
            header,
            ...extraOptions,
        };
        return requestCloud(options);
    }

    post(url, params = {}, header = {}, extraOptions) {
        const options = {
            method: "POST",
            url,
            params,
            header,
            ...extraOptions,
        };
        return requestCloud(options);
    }
}

const requestCloud = (options = {}) => {
    return wx.cloud
        .callFunction({
            name: "v1",
            data: {
                ...options,
            },
        })
        .then((res) => {
            // console.log("request: ", res);
            // const { fail } = res.result;
            // if (fail) {
            //     const err = new Error();
            //     err.code = res.result.code;
            //     err.errMsg = res.result.errMsg;
            //     err.fail = res.result.fail;
            //     throw err;
            // }

            return res.result;
        });
};
const request = new Request();

export default request;
