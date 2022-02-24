import axios from "axios";

let client = axios.create({
    baseURL: "https://be-guest-list.herokuapp.com/api/v1",
    maxRedirects: 5 // default
});
const request = function (options) {
    const onSuccess = function (response) {
        return response.data;
    };

    const onError = function (error) {
        return Promise.reject(error.response || error.message);
    };

    return client(options)
        .then(onSuccess)
        .catch(onError);
};

export default request;