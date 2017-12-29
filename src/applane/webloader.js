import qs from "qs";
import getEncryptedParams from "./encryption";
// import { WEB } from "../components/platform";
var io = require("socket.io-client");

class WebLoader {

    constructor({ config="" }) {
        this.url = config.url;
        this.encryption = config.encryption|| false;
    }
    fetchData(params, options) {
        try {
            return this.fetchDataFromUrl(params, options).then(response => response.json()).then(response => {
               console.log("response>>>>"+JSON.stringify(response))
                if (response.status === "error") {
                    /*pass error code for changing the error message at client side @Dipak (15/11/2017)*/
                    var errorInfo = response.response.error;
                    var error = new Error(errorInfo.message);
                    error.code = errorInfo.code;
                    throw error;
                }
                console.log(response)
                return response;
            });
        } catch (e) {
            alert("error caught.." + e);
            return Promise.reject(e);
        }
    }

    fetchDataFromUrl({ uri, body, multipart, encryption, method = "POST" }, options = {}) {
        var url = `${this.url}${uri || ""}`;
        if (typeof body === "object") {
            body.timezone = new Date().getTimezoneOffset();
            if (!multipart) {
                body = {
                    ...body
                };
                /*Convert parmaters of body in string@Sunil 5-11-17*/
                for (var k in body) {
                    if (typeof body[k] == "object") {
                        body[k] = JSON.stringify(body[k]);
                    }
                }
                if (encryption || this.encryption) {
                    body = getEncryptedParams(body);
                }
            }
        }

        if (method === "POST" && false) {
            // var headers = {};
            // /*if uploading a  multipart file then do not make headers and modify body @Dipak   */
            // if (!multipart) {
            //     headers = WEB
            //         ? {
            //             Accept: "application/json",
            //             "Content-Type": "application/x-www-form-urlencoded"
            //         }
            //         : {
            //             Accept: "application/json",
            //             "Content-Type": "application/json"
            //         };
            //     if (typeof body !== "string") {
            //         /*in web case urlencoded is used and requires stringify of parameters*/
            //         if (headers && headers["Content-Type"] === "application/x-www-form-urlencoded") {
            //             body = qs.stringify(body);
            //         } else {
            //             body = JSON.stringify(body);
            //         }
            //     }
            // }
            // var parameters = {
            //     headers,
            //     ...options,
            //     body,
            //     method
            // };
            // return fetch(`${url}`, parameters);
        } else {
            console.log("url>>>"+url)
            const encodedQuery = qs.stringify(body);
            // return fetch(`${url}?${encodedQuery}`, options);
            return fetch(`${url}`, options);
        }
    }

    setToken(token) {
        this.token = token;
    }

    // load(query) {
    //     return new Promise((resolve, reject) => {
    //         this.socket.emit("load", query.json(), (errMessage, data) => {
    //             if (errMessage) {
    //                 window.alert(`Err in loading data>>>>>>>>>>${errMessage}`);
    //                 reject(errMessage);
    //             } else {
    //                 resolve(data);
    //             }
    //         });
    //     });
    // }
    //
    // save(_updates, _model) {
    //     return new Promise((resolve, reject) => {
    //         this.socket.emit(
    //             "save",
    //             {
    //                 _updates,
    //                 model: _model.getId()
    //             },
    //             (errMessage, data) => {
    //                 if (errMessage) {
    //                     window.alert(`Err in save data>>>>>>>>>>${errMessage}`);
    //                     reject(errMessage);
    //                 } else {
    //                     console.log("data>>>>>>>>>>>>>", data);
    //                     resolve(data);
    //                 }
    //             }
    //         );
    //     });
    // }
}

export {WebLoader}
