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
            console.log("request: ", res);
            return res.result;
        });
};
const request = new Request();

export default request;
