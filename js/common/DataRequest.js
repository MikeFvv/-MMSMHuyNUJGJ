/**
 * Created by Mike on 2017/11/13.
 * 首页、及其它 页面数据请求类封装
 * 刷新从网络获取;非刷新从本地获取,
 * 若本地数据过期,先返回本地数据,然后返回从网络获取的数据
 *
 */
'use strict';

import {
    AsyncStorage,
} from 'react-native';


var CryptoJS = require("crypto-js");

var dataRequest;
export default class DataRequest {


    static rootCallBack = null;

    constructor(isInit) {
        if (isInit) this.start();

    }

    static init(isInit, funAction) {
        if (!dataRequest) {
            dataRequest = new DataRequest(isInit);
        }
        DataRequest.rootCallBack = funAction;
        return dataRequest;
    }

    static setDataRequest(obj) {
        dataRequest = obj;
    }

    start() {
        this._getDatas();
    }


    // 获取数据方法
    _getDatas() {

        let yindaoKey = 'HomeYinDaoObjcet';
        UserDefalts.getItem(yindaoKey, (error, result) => {
            if (!error) {
                if (result !== '' && result !== null) {
                    HomeYinDao = 1;
                } else {
                    HomeYinDao =0;
                }
            }
        });

        let homeDataObjcet = {
            cpicon: GlobalConfig.cpicon(),
            homeBanner: GlobalConfig.homeBanner(),
            cpLinShiIcon: GlobalConfig.backupCpicon()
        }
        let homeDataValue = JSON.stringify(homeDataObjcet);
        UserDefalts.setItem('HomeImagDataObjcet', homeDataValue, (error) => {
        });
        Cpicon = GlobalConfig.cpicon();
        CPLinShiIcon = GlobalConfig.backupCpicon();
        HomeBanner = GlobalConfig.homeBanner();
        if (bankList.length == 0 || bankList == null) {
            //请求银行列表
            this._fetchBankList();
        }

        // 投注时存的gameid，在加密登录的时候要提交到后台。游戏偏好使用。
        AsyncStorage.getItem('TouZhuGameIDNote', (error, res) => {
            if (!error) {
                if (res !== '' && res !== null) {
                    let touZhuGameID = JSON.parse(res);
                    global.GTouZhuGameID = touZhuGameID;
                }
            }
        });

        this._fetchGamePlayData();
        //进入APP 默认去读缓存
        global.UserInfo.shareInstance();
        global.UserInfo.queryUserInfo((result) => {

            if (result.msg == 0) {
                global.UserLoginObject = result.data;
                this._encodeLogin();
            }
        });

        let gongGaoKey = 'HomeGongGaoObjcet';
        UserDefalts.getItem(gongGaoKey, (error, result) => {
            if (!error) {
                if (result !== '' && result !== null) {
                    let gongGaoModel = JSON.parse(result);
                    GongGaoContent = gongGaoModel.GongGaoArray;
                    this._fetchGongGaoData();
                } else {
                    this._fetchGongGaoData();
                }
            }
        });

        //获取用户设定信息
        let key = 'systemObjcet';
        UserDefalts.getItem(key, (error, result) => {
            if (!error) {
                if (result !== '' && result !== null) {
                    let systemModel = JSON.parse(result);
                    global.isOpenShake = systemModel.openShake;
                }
                else {
                    //首次进入APP初始化状态都是不开启
                    global.isOpenShake = true;
                }
            }

        });
        this._getPlayDatas();


        //  首页请求数据缓存
        let homeKey = 'HomeCaiZhongObjcet';
        UserDefalts.getItem(homeKey, (error, result) => {
            if (!error) {
                if (result == '' || result == null) {
                    this._fetchHomeData();
                } else if (result !== '' && result !== null) {
                    let homeModel = JSON.parse(result);
                    AllZhongArray = homeModel.HomeCaiZhongAllArray;
                    HomeArray = homeModel.HomeCaiZhongArray;
                    HomeHeightZhongArray = homeModel.HomeHeightCaiZhongArray;
                    HomeLowZhongArray = homeModel.HomeLowCaiZhongArray;
                    SwiperArray = homeModel.HomeSwiperArray;
                    HomeSystemArray = homeModel.HomeSystemArray;
                    FootWinArray = homeModel.HomeFootWinArray;
                    TiYuArray = homeModel.HomeTiYuArray;
                    if (DataRequest.rootCallBack != undefined) {
                        DataRequest.rootCallBack(true);
                    }
                } else {
                    if (DataRequest.rootCallBack != undefined) {
                        DataRequest.rootCallBack(false);
                    }
                }

            }
        });
    }

    _fetchMeiRiQianDaoData(){

        //请求参数
        let params = new FormData();
        params.append("ac", "getUserSignedLog");
        params.append("uid", global.UserLoginObject.Uid);
        params.append("token",global.UserLoginObject.Token);
        params.append("sessionkey",global.UserLoginObject.session_key);
       

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
          .then(response => {
            QianDaoWeiHu = response.msg;
       })
       .catch(err => { });
  }


  _fetchGamePianHaoData() {
    if (global.UserLoginObject.Uid != '' && global.UserLoginObject.Token != '') {
    let params = new FormData();
  params.append("ac", "getUserHobby");
  params.append("uid", global.UserLoginObject.Uid);
  params.append("token", global.UserLoginObject.Token);
  params.append("sessionkey", global.UserLoginObject.session_key);

      var promise = GlobalBaseNetwork.sendNetworkRequest(params);

      promise
          .then(response => {
              if (response.msg == 0) {
                
                let data = response.data ? response.data : [];
                global.YouXiPianHaoData = data;
                let gameList = global.AllPlayGameList;

                for (let i = data.length - 1; i >= 0; i--) {
                    for (let j = 0; j < gameList.length; j++) {
                        let dic = gameList[j];
                        if (data[i] == dic['game_id']) {
                            gameList.splice(j, 1);  // 删除
                            gameList.splice(0, 0, dic); // 添加到第一位
                            break;
                        }
                    }
                }
                global.AllPlayGameList = gameList;
              }
          })
          .catch(err => {
          });
        }
  }


  // 提交游戏偏好需要的gameid
  _updateUserHobby() {

    let keys = Object.keys(global.GTouZhuGameID);
    if (keys.length <= 0) {
        return;  // 没有值直接退出
    }

    let gameidStr_list = '';
    for (let i = 0; i < keys.length; i++) {
        let gaid = keys[i];
        let count = GTouZhuGameID[gaid];
        gameidStr_list += (i == keys.length - 1 ? `${gaid}:${count}` : `${gaid}:${count},`);
    }

    let params = new FormData();
    params.append("ac", "updateUserHobby");
    params.append("uid", global.UserLoginObject.Uid);
    params.append("token", global.UserLoginObject.Token);
    params.append("sessionkey", global.UserLoginObject.session_key);
    params.append("str_list", gameidStr_list);
    // params.append("str_list", '36:88,25:100,40:50');
  
    var promise = GlobalBaseNetwork.sendNetworkRequest(params);
    promise
        .then(response => {
            if (response.msg == 0) {
                // 成功后，清空，存储。
                global.GTouZhuGameID = {};
                let datas = JSON.stringify(global.GTouZhuGameID);
                UserDefalts.setItem('TouZhuGameIDNote', datas, (error) => { });
            }
        })
        .catch(err => {
        });
  }

  //获取个人消息数据
  _fetchPersonalMessageData() {

    if (global.UserLoginObject.Uid != '' && global.UserLoginObject.Token != '') {
        //请求参数
    let params = new FormData();
    params.append("ac", "flushPrice");
    params.append("uid", global.UserLoginObject.Uid);
    params.append("token", global.UserLoginObject.Token);
    params.append("sessionkey", global.UserLoginObject.session_key);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);

        promise
            .then(response => {
                if (response.msg == 0) {
                    let datalist = response.data;
                    if (response.data == null ) {
                        PersonMessageArray=0;
                        Hongbaolihe = 0;
                        Gerenfankui = 0;
                        Fuliqiandao = 0;
                        AnQuanZhongXin = 0;

                    } else {
                       if((1 & response.data.user_flag)>0){
                        Hongbaolihe = 1;
                       }else {
                        Hongbaolihe = 0;
                       }
                       if((2 & response.data.user_flag)>0){
                        PersonMessageArray = 1;
                       }else {
                        PersonMessageArray = 0;
                       }
                       if((4 & response.data.user_flag)>0){
                        Gerenfankui = 1;
                       }else {
                        Gerenfankui = 0;
                       }
                       if((8 & response.data.user_flag)>0){
                        Fuliqiandao = 1;
                       }else {
                        Fuliqiandao = 0;
                       }
                       if((16 & response.data.user_flag)>0){
                        AnQuanZhongXin = 1;
                       }else {
                        AnQuanZhongXin = 0;
                       }
                    }

                } else {

                }

            })
            .catch(err => {
            });
    }
}

    //首页彩种数据
    _fetchHomeData() {
          
        let paramsNotice = new FormData();
        paramsNotice.append("ac", "getSystemNotice");
        var promise = GlobalBaseNetwork.sendNetworkRequest(paramsNotice);
        promise
            .then(response => {
                if (response.msg == 0) {
   
                    let datalist = response.data;
                    if (datalist && datalist.length > 0) {
   
                        let datalist = response.data;
                        // let dataBannerList = response.data['banner'];
                        // let dataNonticeList = response.data['notice'];
                        // let dataWinlist = response.data['winlist'];
                        
                      HomeSystemArray = datalist;
                        // SwiperArray = dataBannerList;
                        // HomeSystemArray = dataNonticeList;
                        // FootWinArray = dataWinBlog;
                        let homeObjcet = {
                             HomeCaiZhongArray: HomeArray,
                            HomeSystemArray: HomeSystemArray,
                            HomeSwiperArray: SwiperArray,
                            HomeFootWinArray: FootWinArray,
                            HomeHeightCaiZhongArray: HomeHeightZhongArray,
                            HomeLowCaiZhongArray: HomeLowZhongArray,
                            HomeCaiZhongAllArray: AllZhongArray,
                            HomeTiYuArray:TiYuArray
   
                        }
   
                        let homeCaizhongValue = JSON.stringify(homeObjcet);
   
                        let key = 'HomeCaiZhongObjcet';
                        UserDefalts.setItem(key, homeCaizhongValue, (error) => {
                            if (!error) {
                            }
                        });
   
                       
                    } 
   
                } 
            })
            .catch(err => {
              
            });
      

        //请求参数
        let params = new FormData();
        params.append("ac", "getGameListAtin");
        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then(response => {
                if (response.msg == 0) {

                    let datalist = response.data;
                    if (datalist) {

                        let datalist = response.data;
                        // let dataBannerList = response.data['banner'];
                        // let dataNonticeList = response.data['notice'];
                        // let dataWinlist = response.data['winlist'];
                        let indexArray = [];
                        let dataBlog = [];
                        let i = 0;
                       
                        datalist.map(dict => {
                            dataBlog.push({ key: i, value: dict });
                            i++;
                        });
                         AllZhongArray = dataBlog;
                        // for (var j = 0; j < datalist.length; j++) {
                        //     indexArray.push({ key: j, value: datalist[j] });
                        //     if (j == 16) {
                        //         break;
                        //     }
                        // }
                       // indexArray.push({ key: 17, value: {} });

                        HomeHeightZhongArray = [];
                        HomeLowZhongArray = [];
                        TiYuArray = [];

                        datalist.map((item) => {
                        if (item.type == 1) {
                            if (item.speed == 1 ) {
                                HomeHeightZhongArray.push({ key: i, value: item });
                            } else if (item.speed == 0) {
                                HomeLowZhongArray.push({ key: i, value: item });
                            }
                            if (item.hot == 1) {
                                indexArray.push({key: i, value: item});
                            }
                        }else {
                            TiYuArray.push({ key: i, value: item });
                            if (item.hot == 1 ) {
                              indexArray.push({key: i, value: item});
                              }
                          }
                            i++;
                        })
                         indexArray.push({ key: 99, value: {} });

                    


                        HomeArray = indexArray;
                        // SwiperArray = dataBannerList;
                        // HomeSystemArray = dataNonticeList;
                        // FootWinArray = dataWinBlog;
                        let homeObjcet = {
                            HomeCaiZhongArray: HomeArray,
                            HomeSwiperArray: SwiperArray,
                            HomeSystemArray: HomeSystemArray,
                            HomeFootWinArray: FootWinArray,
                            HomeHeightCaiZhongArray: HomeHeightZhongArray,
                            HomeLowCaiZhongArray: HomeLowZhongArray,
                            HomeCaiZhongAllArray: AllZhongArray,
                            HomeTiYuArray:TiYuArray

                        }

                        let homeCaizhongValue = JSON.stringify(homeObjcet);

                        let key = 'HomeCaiZhongObjcet';
                        UserDefalts.setItem(key, homeCaizhongValue, (error) => {
                            if (!error) {
                            }
                        });

                        if (DataRequest.rootCallBack != undefined) {
                            DataRequest.rootCallBack(true);
                        }
                    } else {
                        if (DataRequest.rootCallBack != undefined) {
                            DataRequest.rootCallBack(false);
                        }
                    }

                } else {
                    {
                        if (DataRequest.rootCallBack != undefined) {
                            DataRequest.rootCallBack(false);
                        }
                    }
                    ;
                }
            })
            .catch(err => {
                {

                    if (DataRequest.rootCallBack != undefined) {
                        DataRequest.rootCallBack(false);
                    }

                }
            });
    }

    //获取不登录时公告弹窗
    _fetchGongGaoData() {
        //请求参数
        let params = new FormData();
        params.append("ac", "getNoticeAppForOffline");


        var promise = GlobalBaseNetwork.sendNetworkRequest(params);

        promise
            .then(response => {
                if (response.msg == 0) {
                    if (response.data != undefined) {
                        GongGaoContent = response.data;
                        let GongGaoObjcet = { GongGaoArray: response.data }
                        let GongGaoValue = JSON.stringify(GongGaoObjcet);
                        UserDefalts.setItem('HomeGongGaoObjcet', GongGaoValue, (error) => {
                        });
                    } else {
                        AsyncStorage.removeItem('HomeGongGaoObjcet', (error) => {
                        });
                    }

                } else {
                    {
                        //this._alertShow(response.param)
                    }
                    ;
                }
            })
            .catch(err => {
            });
    }

    //请求银行列表
    _fetchBankList() {
        let params = new FormData();
        params.append("ac", "getBankCardList");
        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {
                if (responseData.msg == 0) {
                    global.bankList = responseData.data;
                }
            })
            .catch((err) => {
            })
    }

    //请求彩种玩法，缓存到global
    _fetchGamePlayData() {
        //缓存所有彩种列表
        let params = new FormData();
        params.append("ac", "getGameListAtin");

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                if (responseData.msg == 0) {

                    let datalist = responseData.data;
                    if (datalist && datalist.length > 0) {

                        // 缓存数据
                        let datas = JSON.stringify(responseData.data);
                        AsyncStorage.setItem('GameListData', datas, (error) => { });
                        
                        let newmodel = {}
                        let openGameList = [];

                        for (let i = 0; i < datalist.length; i++) {
                            let model = datalist[i];

                            if (model.enable != 2 && model.type == 1) { //只存type == 1的正常彩票。除了体育彩
                                openGameList.push(model);
                            }

                            // 存yearid
                            if (model.js_tag == 'lhc') {
                                global.yearId = model.yearid;
                                if (global.yearId.length > 0) {
                                    break;  // 防止拿到空值，有值再退出
                                }
                            }

                            newmodel[`${model.game_id}`] = model; // game_id作为key，每个key对应的Model存起来
                        }

                        global.AllPlayGameList = openGameList;
                        global.GameListConfigModel = newmodel;
                    }
                }

            })

            .catch((err) => {
            })
    }


    _getPlayDatas() {
        AsyncStorage.getItem('PlayDatas', (error, res) => {
            if (!error) {
                if (res !== '' && res !== null) {
                    let playDatas = JSON.parse(res);
                    global.GPlayDatas = playDatas;
                }
            }
        });


        AsyncStorage.getItem('TouZhuGuidekey', (error, res) => {
            if (!error) {
                if (res !== '' && res !== null) {
                    global.TouZhuGuide = JSON.parse(res);
                } else {
                    global.TouZhuGuide = 1; 
                }
            }
        });

        AsyncStorage.getItem('TrendDatas', (error, res) => {
            if (!error) {
                if (res !== '' && res !== null) {
                    let trendDatas = JSON.parse(res);
                    global.GTrendDatas = trendDatas;
                }
            }
        });
    }

    _encodeLogin() {

        //加密登录
        if (global.UserLoginObject != undefined && global.UserLoginObject.Uid != '') {

            let params = new FormData();
            params.append("ac", "encodeLogin");
            params.append("uid", global.UserLoginObject.Uid);  //去掉首尾空格
            params.append("code", global.UserLoginObject.codePWD);
            params.append("edition", global.VersionNum);

            var promise = GlobalBaseNetwork.sendNetworkRequest(params);

            promise
                .then(response => {

                    if (response.msg == 0 && response.data) {

                        let headerIcon = '';
                        if (response.data.head_icon.length > 0) {
                            headerIcon = response.data.head_icon;
                        }

                        let loginObject = {};
                        if (global.UserLoginObject.is_Guest != 2) {
                         
                            loginObject = {
                                'session_key': response.data.session_key,
                                'Uid': response.data.uid,
                                'Question_1': response.data.question_1,
                                'Question_2': response.data.question_2,
                                'Question_3': response.data.question_3,
                                'Tkpass_ok': response.data.tkpass_ok,
                                'Phone': response.data.phone,
                                'Email': response.data.email,
                                'Wechat': response.data.wechat,
                                'Qq_num': response.data.qq,
                                'Real_name': response.data.real_name,
                                'Token': response.data.token,
                                'TotalMoney': response.data.price.toString(),
                                'UserName': response.data.username,
                                'TKPrice': response.data.last_get_price.toString(),
                                'UserHeaderIcon': headerIcon,
                                'Sign_event': response.data.sign_event,//判断每日签到通道是否开启 0 未开，1开启
                                'Gift_event': response.data.gift_event,//判断红包通道是否开启0 未开，1开启
                                'Card_num': response.data.bank_typename,//默认的银行卡号 判断是否绑定银行卡
                                'Level': response.data.level,//代理判断
                                'is_Guest': response.data.test,//判断是否是试玩账号 test 0=正式 ，1=测试 ，2=试玩
                                // 'RiseEvent': response.data.rise_event,//是不是开放等级页面
                                'fp_ssc': response.data.fp_ssc, // 时时彩
                                'fp_pcdd': response.data.fp_pcdd, // PC蛋蛋
                                'fp_k3': response.data.fp_k3, // 快3
                                'fp_pk10': response.data.fp_pk10, // PK10
                                'fp_3d': response.data.fp_3d, // 3D
                                'fp_11x5': response.data.fp_11x5, // 11选5
                                'fp_lhc': response.data.fp_lhc, // 六合彩
                                'codePWD': response.data.code,  //加密登录
                                //'rise_lock': response.data.rise_lock, //每日加奖跳动
                            };

                    } else {
                       loginObject = {
                            'session_key': response.data.session_key,
                            'Uid': response.data.uid,
                            'Token': response.data.token,
                            'TotalMoney': response.data.price.toString(),
                            'UserName': response.data.username,
                            'UserHeaderIcon': headerIcon,
                            'TKPrice': response.data.last_get_price.toString(),
                            'Level': response.data.level,//代理判断
                            'is_Guest': response.data.test,//判断是否是试玩账号 test 0=正式 ，1=测试 ，2=试玩
                            'codePWD': response.data.code,  //加密登录
                        };
                    }

                        global.UserLoginObject = loginObject;
                        //加密登录成功后用新的uid,token请求
                        this._fetchGamePianHaoData();  // 拿到uid token后请求游戏偏好
                        this._updateUserHobby();  // 提交gameid, 用于后台搞游戏偏好的。
                        // this._fetchPersonalMessageData();
                        this._fetchMeiRiQianDaoData();
                        PushNotification.emit('LoginSuccess', global.UserLoginObject);

                        //将数据存到本地
                        global.UserInfo.shareInstance();
                        global.UserInfo.saveUserInfo(loginObject, (result) => {
                        });
                    } else {
                        //清除用户数据的方法

                        global.UserInfo.shareInstance();
                        global.UserInfo.removeUserInfo((result) => {

                            if (result == true) {
                            }
                        })
                    }

                })
                .catch(err => {

                });
        }
    }

}
