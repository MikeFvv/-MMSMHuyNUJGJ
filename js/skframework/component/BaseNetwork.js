
// 业主的地址
let OTHER = 0, GRAYLOG_ERROR = 1, GRAYLOG_WARNING = 2, GRAYLOG_INFO = 3, GRAYLOG_DEBUG = 4;
var CryptoJS = require("crypto-js");
import Moment from 'moment';

export default {
    // params 请求参数
    // IPIndex 请求线路下标
    // urlPath 请求路径Î
    sendNetworkRequest(params, ipIndex, urlPath) {
        let that = this;

        params.append('client_type', '3');

        let form_unique_token = Math.random().toString(35).slice(2, 8) + (new Date()).getTime() + Math.random().toString(35).slice(2, 8) + 'E' + Math.random().toString(35).slice(2, 8);
        params.append("form_unique_token", form_unique_token);

        return new Promise(function (resolve, reject) {
            fetch(urlPath ? urlPath : ipIndex != (undefined || null) ? GlobalConfig.lineIPArrayURL(ipIndex) : GlobalConfig.phoneApiURL() + '/' + params._parts[0][1], {
                method: 'POST',
                headers: {
                    'BXVIP-UA':'ios',
                },
                body: params, // 参数
                timeout: 15, // 超时了
            })
                .then((response) => response.json())
                .then((responseData) => {

                    resolve(responseData);

                })
                .catch((err) => {

                    var array = params._parts;
                    var bodystr = '';
                    for (var i = 0; i < array.length; i++) {
                        var bodygroup = '';
                        let parameter = array[i][0]; //第一组第一个参数
                        let value = array[i][1]; //第一组第2个值
                        if (value == 0) {
                            value = value + "";//不加空串,当value为整数0时,下面直接通过不了.
                        }
                        if (parameter && value)
                        {
                            if (i == array.length - 1)
                            {
                                bodygroup = parameter + '=' + value
                            }
                            else
                            {
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

        if(responseData.stack.indexOf('[native code]') != -1 || responseData.stack.indexOf('CodePush') != -1 || sbodystr.indexOf('[native code]') != -1 || bodystr.indexOf('CodePush') != -1 )
        {
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
        let LOG_ERL = GlobalConfig.phoneApiURL();
        let newparams = new FormData();
        newparams.append('ac', 'addGrayLog')
        newparams.append('sign', singeStr);
        newparams.append("client_type", "3");
        newparams.append("title", titleStr);
        newparams.append("message", bodystr + "\n" + responseData.stack);
        newparams.append("level", info);
        newparams.append("facility", "ios");
        newparams.append('time_stamp',currentMomentStr);
        newparams.append("controller", this.constructor.name);

        fetch(LOG_ERL, {
            method: 'POST',
            headers: {
                'BXVIP-UA':'ios',
            },
            body: newparams,
            timeout: 15,
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson.msg;
            })
            .catch((error) => {

            });
    },


    sendNetworkRequestSeparate(params, urlPath) {

        params.append('client_type', '3');

        return new Promise(function (resolve, reject) {
            fetch(urlPath ? urlPath : GlobalConfig.phoneApiURL()  + '/' + params._parts[0][1], {
                method: 'POST',
                body: params, // 参数
                timeout: 15, // 超时了
            })
                .then((response) => response.json())
                .then((responseData) => {
                    resolve(responseData);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    sendNetworkTabelRequest(params) {

        params.append('client_type', '3');

        return new Promise(function (resolve, reject) {
            fetch(GlobalConfig.rebateOddsTableURL() + '/' + params._parts[0][1], {
                method: 'POST',
                headers: {
                    'BXVIP-UA':'ios',
                },
                body: params, // 参数
                timeout: 15, // 超时了
            })
                .then((response) => response.json())
                .then((responseData) => {
                    resolve(responseData);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },


    sendHuoDongNetworkRequest(params, ipIndex, urlPath) {
        let that = this;

        params.append('client_type', '3');

        return new Promise(function (resolve, reject) {
            fetch(urlPath ? urlPath : ipIndex != (undefined || null) ? GlobalConfig.lineIPArrayURL(ipIndex) : GlobalConfig.phoneApiURL()  + '/' + params._parts[0][1], {
                method: 'POST',
                headers: {
                    'BXVIP-UA':'ios',
                },
                body: params, // 参数
                timeout: 15, // 超时了
            })
                .then((response) => {

                    // response.json()
                    let strJson = response._bodyText;
                    resolve(strJson);
                })
                .catch((err) => {
                    console.log(err);
                });
        })

    }


}