export const request = (options) => {
    return new Promise((resolve, reject) => {
        wx.request({
            ...options,
            success(res) {
                resolve(res);
            },
            fail(res) {
                reject(res.data);
            },
        });
    });
};

export const wxPromise = (api) => {
    function func(options, ...params) {
        return new Promise((resolve, reject) => {
            api(
                {
                    ...options,
                    success: (res) => {
                        resolve(res);
                    },
                    fail: reject,
                },
                ...params
            );
        });
    }
};
