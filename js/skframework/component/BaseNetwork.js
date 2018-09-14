
// 业主的地址
let OTHER = 0, GRAYLOG_ERROR = 1, GRAYLOG_WARNING = 2, GRAYLOG_INFO = 3, GRAYLOG_DEBUG = 4;
var CryptoJS = require("crypto-js");
import Moment from 'moment';

if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength, padString) {
        targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
        padString = String(padString || ' ');
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength - this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0, targetLength) + String(this);
        }
    };
}

export default {
    // params 请求参数
    // IPIndex 请求线路下标
    // urlPath 请求路径Î
    sendNetworkRequest(params, ipIndex, urlPath) {
        let that = this;

        params.append('client_type', '3');

        console.log(params);

        let form_unique_token = Math.random().toString(35).slice(2, 8) + (new Date()).getTime() + Math.random().toString(35).slice(2, 8) + 'E' + Math.random().toString(35).slice(2, 8);
        params.append("form_unique_token", form_unique_token);

        let encryptPar = this._ClEncrypt(params, 'bx20180701');
        let enParams = new FormData();
        enParams.append("p", encryptPar);

        return new Promise(function (resolve, reject) {

            // GlobalConfig.lineIPArrayURL(global.GlobalLineIPIndex++);
            // fetch(urlPath ? urlPath : ipIndex != (undefined || null) ? GlobalConfig.lineIPArrayURL(ipIndex) : GlobalConfig.lineBaseIPURL() + '/' + params._parts[0][1], {
            fetch(urlPath ? urlPath + '/' + params._parts[0][1] + '/iOS' : GlobalConfig.lineBaseIPURL() + '/' + params._parts[0][1] + '/iOS', {
                method: 'POST',
                headers: {
                    'BXVIP-UA': 'ios',
                },
                // body: params, // 参数
                body: enParams, // 参数
                timeout: 15, // 超时了
            })
                .then((response) => response.json())
                .then((responseData) => {

                    if (responseData.msg == 40000) {

                        console.log(params);

                        PushNotification.emit('ServerLoginOutNotification');  //任何接口返回40000,都踢下线
                    }

                    resolve(responseData);

                })
                .catch((err) => {


                    global.GlobalLineIPIndex = global.GlobalLineIPIndex + 1;
                    GlobalConfig.lineIPArrayURL(global.GlobalLineIPIndex);

                    var array = params._parts;
                    var bodystr = '';
                    for (var i = 0; i < array.length; i++) {
                        var bodygroup = '';
                        let parameter = array[i][0]; //第一组第一个参数
                        let value = array[i][1]; //第一组第2个值
                        if (value == 0) {
                            value = value + "";//不加空串,当value为整数0时,下面直接通过不了.
                        }
                        if (parameter && value) {
                            if (i == array.length - 1) {
                                bodygroup = parameter + '=' + value
                            }
                            else {
                                bodygroup = parameter + '=' + value + '&'

                            }
                        }
                        bodystr += bodygroup;
                    }

                    { that.sendGrayLog(err, GRAYLOG_ERROR, bodystr) };

                    reject(err);
                });
        });

    },

    //发送错误日志
    sendGrayLog(responseData, info, bodystr) {

        if (responseData.stack.indexOf('[native code]') != -1 || responseData.stack.indexOf('CodePush') != -1 || sbodystr.indexOf('[native code]') != -1 || bodystr.indexOf('CodePush') != -1) {
            console.log('错误信息');
            return;
        }

        //     * 记录日志
        //     *
        //     * @param title 日志简要说明
        //     * @param extra 扩展参数，需要额外记录的参数记录在这里
        //     * @param level 日志等级：GRAYLOG_INFO, GRAYLOG_WARNING, GRAYLOG_ERROR, GRAYLOG_DEBUG
        //     *              facility   模块类型，不填默认为bxvip_index  安卓为android
        //     *              full        是否启动详细模式，设置为true后启动详细模式，这时候会记录全部的session
        //     * @ controller 控制器名称

        //发送错误请求
        // let LOG_URL = "http://13.113.153.206:9000/index.php/PhoneApi/request/ac/setAppLog";
        let currentMomentStr = Moment().format('X');
        let titleStr = "IOS:" + (responseData.param ? responseData.param : responseData.message);
        let md5Str = `graylog+${titleStr}+${info}+${currentMomentStr}`;
        let singeStr = ''; //MD5加密字符串
        singeStr = CryptoJS.MD5(md5Str).toString();
        let LOG_ERL = GlobalConfig.lineBaseIPURL();
        let newparams = new FormData();
        newparams.append('ac', 'addGrayLog')
        newparams.append('sign', singeStr);
        newparams.append("client_type", "3");
        newparams.append("title", titleStr);
        newparams.append("message", bodystr + "\n" + responseData.stack);
        newparams.append("level", info);
        newparams.append("facility", "ios");
        newparams.append('time_stamp', currentMomentStr);
        newparams.append("controller", this.constructor.name);

        let encryptPar = this._ClEncrypt(newparams, 'bx20180701');
        let enParams = new FormData();
        enParams.append("p", encryptPar);

        fetch(LOG_ERL, {
            method: 'POST',
            headers: {
                'BXVIP-UA': 'ios',
            },
            // body: newparams,
            body: enParams,
            timeout: 15,
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson.msg;
            })
            .catch((error) => {

            });
    },


    sendNetworkTabelRequest(params) {

        params.append('client_type', '3');

        let encryptPar = this._ClEncrypt(params, 'bx20180701');
        let enParams = new FormData();
        enParams.append("p", encryptPar);

        return new Promise(function (resolve, reject) {
            fetch(GlobalConfig.rebateOddsTableURL() + '/' + params._parts[0][1] + '/iOS', {
                method: 'POST',
                headers: {
                    'BXVIP-UA': 'ios',
                },
                // body: params, // 参数
                body: enParams, // 参数

                timeout: 15, // 超时了
            })
                .then((response) => response.json())
                .then((responseData) => {
                    resolve(responseData);
                })
                .catch((err) => {
                    global.GlobalLineIPIndex = global.GlobalLineIPIndex + 1;
                    GlobalConfig.lineIPArrayURL(global.GlobalLineIPIndex);
                    reject(err);
                });
        });
    },


    sendHuoDongNetworkRequest(params, ipIndex, urlPath) {
        let that = this;

        params.append('client_type', '3');

        let encryptPar = this._ClEncrypt(params, 'bx20180701');
        let enParams = new FormData();
        enParams.append("p", encryptPar);

        return new Promise(function (resolve, reject) {
            // fetch(urlPath ? urlPath : ipIndex != (undefined || null) ? GlobalConfig.lineIPArrayURL(ipIndex) : GlobalConfig.lineBaseIPURL() + '/' + params._parts[0][1], {
            fetch(urlPath ? urlPath + '/' + params._parts[0][1] + '/iOS' : GlobalConfig.lineBaseIPURL() + '/' + params._parts[0][1] + '/iOS', {
                method: 'POST',
                headers: {
                    'BXVIP-UA': 'ios',
                },
                // body: params, // 参数
                body: enParams, // 参数
                timeout: 15, // 超时了
            })
                .then((response) => {

                    // response.json()
                    let strJson = response._bodyText;
                    resolve(strJson);
                })
                .catch((err) => {
                    global.GlobalLineIPIndex = global.GlobalLineIPIndex + 1;
                    GlobalConfig.lineIPArrayURL(global.GlobalLineIPIndex);
                    console.log(err);
                });
        })

    },



    _ClEncrypt(valValue, keyValue) {

        // let keyByte = keyValue.charCodeAt();
        // let valByte = valValue.charCodeAt();

        let parStr = '';
        for (let i = 0; i < valValue._parts.length; i++) {
            if (i == valValue._parts.length - 1) {
                parStr += valValue._parts[i][0] + '=' + valValue._parts[i][1];
            } else {
                parStr += valValue._parts[i][0] + '=' + valValue._parts[i][1] + '&';
            }
        }


        let valArr = unescape(encodeURIComponent(parStr)).split('');
        let keyArr = keyValue.split('');

        for (let i = 0; i < valArr.length; i++) {
            for (let j = 0; j < keyArr.length; j++) {

                let valStr = valArr[i];
                let keyStr = keyArr[j];
                let ccc = ((valStr.charCodeAt && valStr.charCodeAt()) || valArr[i]) ^ keyStr.charCodeAt();
                valArr[i] = ccc;
            }
        }

        let result = '';
        for (let i = 0; i < valArr.length; i++) {
            let c = valArr[i];
            result += c.toString(16).padStart(2, '0');
        }

        let md5 = CryptoJS.MD5(parStr + '&encode=' + keyValue).toString();
        let resultUpper = 'DEX' + result + md5;
        return resultUpper.toUpperCase();
    }

}

