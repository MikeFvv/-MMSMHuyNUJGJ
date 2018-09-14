import {
    AppRegistry,
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    StatusBar,
    AsyncStorage,
    NativeModules,
    Dimensions,
    Platform,
    Modal,
    TextInput,
    NetInfo,
    BackHandler,
    ToastAndroid,
    Image,
} from 'react-native';
import React, { Component } from 'react';
import './skframework/common/Global'
import App from './App.js';
import LocalImgs from '../js/res/img';
import CodePush from 'react-native-code-push';
import BaseNetwork from './skframework/component/BaseNetwork'
// import { CachedImage, ImageCache } from "react-native-img-cache";
import SwitchURLRoot from "./skframework/common/SwitchURLClass";
import DataRequest from "./common/DataRequest";
import GetSetStorge from './skframework/component/GetSetStorge';
import RNFetchBlob from 'react-native-fetch-blob';

import AllenModal from './skframework/component/AllenModal';

import {
    CachedImage,
    ImageCacheProvider
} from 'react-native-cached-image';

import AllenShortCut from './allenPlus/AllenShortCut';


let { height, width } = Dimensions.get('window');

if (!__DEV__) {
    global.console = {
        info: () => {
        },
        log: () => {
        },
        warn: () => {
        },
        error: () => {
        },
    };
}



export default class Root extends Component {

    constructor(props) {
        super(props);
        this.checkUpdate = this.checkUpdate.bind(this)
        this.state = {
            finished: false,
            finishedPage: false,
            syncMessage: '正在检测更新',
            lauchImgUri: '',
            type: 0,
            isShowEnterUrlPage: false,
            waiting: false,
            enterMessage: '',
        };
        if (Platform.OS === 'ios') {

            if (!GLOBALisRNParameters) {
                global.GlobalRNmmStatus = this.props['mmStatus'];
                if (global.GlobalRNmmStatus == 5) {
                    SwitchRoute = 0;
                } else {
                    SwitchRoute = 1;
                }
            }

        }
        // 1 避免过快跳转到 Conversion页面  2 延缓进入主界面 等待数据加载
        this.time = "";
        this.isLoadData = false;
        this.isUpdate = false;
        global.LaunchImageUrl = "";
        this.requestNum = 5;
        this.ipArr = [];// IP数组
        this.ipIndex = 0;// 地址索引读取

        this.lineIPIndex1 = 0;
        this.isLineSwitch = false;
        this.LaunchImageUrlArray = [global.LaunchImageUrl];
        this.NewOldVersion = 2;
        this.plistIndex = 0;
        this.domainNameMm = '';

    }

    componentWillMount() {


        global.RouterIndex = this.props['router'];
        GlobalConfig.baseURL = this.props['mmUrl'];
        this.domainNameMm = this.props['mmUrl'];
        global.GLOBALmmRainbow = this.props['mmRainbow'];

        if (GLOBALisRNParameters == false) {
            // 判断是否有数据
            if (global.GLOBALmmRainbow && global.GLOBALmmRainbow['url_list']) {

                let ipArray = global.GLOBALmmRainbow['url_list'].split(";");
                let AddHttpIPArry = [];

                for (let index = 0; index < ipArray.length; index++) {
                    // 用户输入带http:// 或者不带http:// 都可以
                    let ipUrl = ipArray[index];
                    if (!this.isContains(ipUrl, 'http')) {
                        AddHttpIPArry.push('http://' + ipUrl);
                    } else {
                        AddHttpIPArry.push(ipUrl);
                    }
                }

                global.GlobalLineIPArray = AddHttpIPArry;
                GlobalConfig.lineIPArray = AddHttpIPArry;
            } else {
                console.log('没有备用线路，或者早期的App没有传mmRainbow');
            }


            if (this.props['mmUrl'] && this.props['mmUrl'].length > 0) {
                let ipUrl = this.props['mmUrl'];
                let ipHttp = '';

                var arrHttp = ipUrl.split("|");
                // console.log(httpUrl);
                if (arrHttp.length > 1) {
                    global.rcode = arrHttp[2];
                }
                ipUrl = arrHttp[0];


                if (!this.isContains(ipUrl, 'http')) {
                    ipHttp = 'http://' + ipUrl;
                } else {
                    ipHttp = ipUrl;
                }

                // global.GlobalLineIPArray.splice(0, 0, ipHttp);  // 将主域名添加到数组开始位置
                // GlobalConfig.lineIPArray.splice(0, 0, ipHttp);  // 将主域名添加到数组开始位置
            }
        }

        // ios才需要查询
        this._getLauchImg();

        this._delayedOpen();
        this._getAsyncGameListData();
        this.checkUpdate()
        this._getDomainNameRequest();

    }

    _getLauchImg() {

        //获取启动图
        AsyncStorage.getItem("welcomeImg", (error, result) => {
            if (!error) {
                if (result !== '' && result !== null) {
                    global.LaunchImageUrl = result;
                    this.setState({
                        lauchImgUri: result,
                    });
                }
            }
        });

    }


    _getWelcomeImg() {

        let params = new FormData();
        params.append("ac", "getApiWelcome");
        var promise = BaseNetwork.sendNetworkRequest(params);
        promise
            .then(response => {
                //请求成功
                if (response.msg == 0) {
                    let welcomeUrl = '';
                    let imgarray = response.data;
                    if (imgarray && imgarray.length > 0) {
                        for (let i = 0; i < imgarray.length; i++) {
                            let img = imgarray[0];
                            let imgurl = img.banner;
                            welcomeUrl = imgurl;
                        }
                        var keyName = 'welcomeImg';
                        var keyValue = welcomeUrl;
                        AsyncStorage.setItem(keyName, keyValue, function (errs) {
                            if (errs) {
                                //console.log('ztf 存储错误');
                            }
                            if (!errs) {
                                //console.log('ztf 存储成功!!!');
                            }
                        });
                    }
                } else {
                    console.log(" 请求引导图片失败");
                }
            })
            .catch(err => {
                console.log("  err: " + err.toString());
            });
    }

    componentDidMount() {
        if (iOS) {
            this._setLauchImg();
        }

        //监听网络链接变化事件
        NetInfo.isConnected.addEventListener('connectionChange', this._handleIsConnectedChange);

        this.subscription4 = PushNotification.addListener('AllenSuccess', () => {
            this.setState({});
            this.refs.calendarstart.open();
        });
    }

    componentWillUnmount() {
        //移除监听
        NetInfo.isConnected.removeEventListener('connectionChange', this._handleIsConnectedChange);

        if (typeof (this.subscription4) == 'object') {
            this.subscription4 && this.subscription4.remove();
        }
    }


    // 网络监听方法
    _handleIsConnectedChange = (isConnected) => {

        if (!isConnected) {
            global.isFirstNetwork = false;

            if (this.state.finishedPage == false) {
                this.isLoadData = true;
                this.isUpdate = true;
                // 进入App
                this.inAppPage()

                this.setState({
                    finishedPage: true,
                });
            }
        } else {
            if (global.GlobalRNmmStatus == 1 || global.GlobalRNmmStatus >= 5) {
                this.checkUpdate()
            }

        }
    }


    _setLauchImg() {
        //缓存启动图片的uri,延时是为了避免请求并发
        setTimeout(() => {
            this._getWelcomeImg();
        }, 6000);
    }

    // 获取域名请求
    _getDomainNameRequest() {
        if (SwitchRoute == 0) {  // 自动判断=>真页面或者输入域名页面
            GlobalFixed = true;
            this._getEnterUrlData();
        } else if (SwitchRoute == 1) {  // 真页面

            if (Platform.OS === 'ios') {
                if (GLOBALisRNParameters) {
                    let url = SwitchURLRoot(SwitchURLIndex);
                    this.domainNameMm = url;
                    this._getSysInfo(url);
                    return;
                }

                if (global.GlobalRNmmStatus == 1 || (GlobalConfig.baseURL && GlobalConfig.baseURL.length > 0)) {
                    this._getSysInfo(GlobalConfig.baseURL);
                } else {
                    this._switchURLRequest();
                }

            }

        } else {   // 马甲页面  or  用户输入域名页面
            this.isLoadData = true;
            // 进入App
            this.inAppPage()
        }
    }

    // 获取业主的URL
    _switchURLRequest() {

        if (Platform.OS === 'ios') {

            let url = SwitchURLRoot(SwitchURLIndex);
            this.domainNameMm = url;
            this._getSysInfo(url);

        }


    }


    // 获取用户本地存储的RUL ， 没有就跳转到输入域名页面
    _getEnterUrlData() {
        let key = 'USERBASEURL';
        AsyncStorage.getItem(key, (error, result) => {
            if (!error) {
                if (result !== '' && result !== null) {

                    let userEnterURL = JSON.parse(result);

                    // GlobalConfig.baseURL = userURL;  // 保存url
                    // let userURLOk = this._replaceOldDomainName(userURL);
                    // 需要每次启动更新这里的信息 ，里面包含邀请码设置
                    // this._getSysInfo(userURLOk);
                    this._getByInterfaceReturnDomainName(userEnterURL)

                } else {
                    this.setState({
                        isShowEnterUrlPage: true,
                    });
                }
            } else {
                this.setState({
                    isShowEnterUrlPage: true,
                });
            }
        });

    }



    // 获取用户本地存储的RUL 和 信息
    _getLocallySaveUrlData() {

        //获取系统配置信息的key, 比如图片拼接基本路径,是否填写邀请码，等等
        let systemKey = 'SysInfo';
        AsyncStorage.getItem(systemKey, (error, result) => {
            if (!error) {
                if (result !== '' && result !== null) {

                    let userData = JSON.parse(result);
                    GlobalConfig.userData = userData;
                }
            }
        })

        let key = 'LINEURL';
        AsyncStorage.getItem(key, (error, result) => {
            if (!error) {
                if (result !== '' && result !== null) {

                    let userURL = JSON.parse(result);
                    GlobalConfig.baseURL = userURL;  // 保存url

                    this.setState({ syncMessage: '正在努力为您加载数据，您稍安勿躁..' })
                    DataRequest.init(true, rootCallBack = (data) => {
                        this.getDataRequestReturnData(data)
                    })

                } else {

                    this.isLoadData = true;
                    // 进入App
                    this.inAppPage()
                }
            } else {

                this.isLoadData = true;
                // 进入App
                this.inAppPage()
            }
        });

    }

    isContains(str, substr) {
        return str.indexOf(substr) >= 0;
    }




    // 验证 url 是否正确
    _getSysInfo(userEnterUrl) {

        var arrHttp = userEnterUrl.split("|");

        if (arrHttp.length > 1) {
            global.rcode = arrHttp[2];
        }
        userEnterUrl = arrHttp[0];

        // let messString = '正在重试获取系统数据, 请耐心等待...' + this.requestNum;
        // this.setState({ syncMessage: messString })

        setTimeout(() => {
            if (!this.isLoadData) {
                this.setState({ syncMessage: '正在重试获取系统数据, 请耐心等待...' })
            }
        }, 5000)

        //请求参数
        let params = new FormData();
        params.append("ac", "getSysInfo");
        // params.append("enom", userEnterUrl);
        params.append("enom", this.domainNameMm ? this.domainNameMm : userEnterUrl);


        let baseURL = '';
        // 用户输入带http:// 或者不带http:// 都可以
        if (!this.isContains(userEnterUrl, 'http')) {
            baseURL = 'http://' + userEnterUrl;
        } else {
            baseURL = userEnterUrl;
        }
        let phoneApiUrl = baseURL + '/request';
        var promise = GlobalBaseNetwork.sendNetworkRequest(params, null, phoneApiUrl);
        promise
            .then(response => {
                if (response.msg == 0) {

                    // 初始化
                    this.lineIPIndex1 = 0;

                    // Alert.alert('验证成功');

                    if (this.state.isShowEnterUrlPage == true) {
                        this.setState({
                            waiting: true,
                            enterMessage: '验证通过， 请等待数据加载...'
                        })
                    }



                    if (this.state.isShowEnterUrlPage == true) {
                        GetSetStorge.setStorgeAsync('USERBASEURL', JSON.stringify(baseURL))
                    }
                    GetSetStorge.setStorgeAsync('LINEURL', JSON.stringify(baseURL))
                    GetSetStorge.setStorgeAsync('SysInfo', JSON.stringify(response.data))

                    GlobalConfig.baseURL = baseURL;  // 保存url
                    GlobalConfig.userData = response.data;  // 保存系统信息

                    
                    // if (this.state.isShowEnterUrlPage == true) {
                    //     global.GlobalLineIPArray.splice(0, 0, baseURL);  // 将主域名添加到数组开始位置
                    //     GlobalConfig.lineIPArray.splice(0, 0, baseURL);  // 将主域名添加到数组开始位置
                    // }


                    GetSetStorge.setStorgeAsync('iSNeedInviteCode', JSON.stringify(response.data.bind_param));

                    this.setState({ syncMessage: '正在努力为您加载数据，您稍安勿躁..' })
                    DataRequest.init(true, rootCallBack = (data) => {
                        this.getDataRequestReturnData(data)
                    })

                } else if (response.msg == 45000) {
                    GlobalConfig.baseURL = baseURL;  // 保存url
                    GlobalConfig.userData = response.data;  // 保存系统信息
                    if (response.data.etime != undefined) {
                        SystemTime = response.data.btime + '—' + response.data.etime;
                    }
                    isSystemMaintain = true;

                    this.getDataRequestReturnData(false)

                } else {
                    if (this.state.isShowEnterUrlPage == true) {
                        this.setState({
                            enterMessage: ''
                        })
                        Alert.alert('验证网址没有通过,请重新输入');
                    } else {

                        this.isLineSwitch = true;
                        // 请求少于GlobalLineIPRequestMax次 继续请求
                        if (this.lineIPIndex1 < global.GlobalLineIPRequestMax) {
                            this.lineIPIndex1++;
                            this.setState({ syncMessage: '正在第' + this.lineIPIndex1 + '次切换线路' })
                            let resultIndex = this.lineIPIndex1 % global.GlobalLineIPArray.length;
                            this._getSysInfo(global.GlobalLineIPArray[resultIndex]);
                        } else {
                            this.lineIPIndex1 = 0;
                            this._getLocallySaveUrlData();
                        }
                    }
                }
            })
            .catch(err => {
                {
                    if (this.state.isShowEnterUrlPage == true) {
                        this.setState({
                            enterMessage: ''
                        })
                        if (err.message = 'Network request failed') {
                            Alert.alert('请求失败');
                        } else {
                            Alert.alert(err.message ? err.message : '请求失败');
                        }
                    } else {

                        this.isLineSwitch = true;
                        // 请求少于GlobalLineIPRequestMax次 继续请求
                        if (this.lineIPIndex1 < global.GlobalLineIPRequestMax) {
                            this.lineIPIndex1++;
                            this.setState({ syncMessage: '正在第' + this.lineIPIndex1 + '次切换线路' })
                            let resultIndex = this.lineIPIndex1 % global.GlobalLineIPArray.length;
                            this._getSysInfo(global.GlobalLineIPArray[resultIndex]);
                        } else {
                            this.lineIPIndex1 = 0;
                            this._getLocallySaveUrlData();
                        }

                    }
                }
            });
    }


    _userEnterKefu() {
        this.props.navigation('ChatService', { callback: () => { }, title: '在线客服' })
    }

    //接收的数据
    getDataRequestReturnData = (data) => {
        this.setState({ waiting: false, syncMessage: '正在进入..' })
        //this.setState({waiting: false})
        this.isLoadData = true;
        // 进入App
        this.inAppPage()
    }


    codePushStatusDidChange(syncStatus) {
        let isStart = false
        switch (syncStatus) {
            case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                this.setState({
                    syncMessage: '正在检查新配置'
                })
                break
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                break
            case CodePush.SyncStatus.INSTALLING_UPDATE:
                break
            case CodePush.SyncStatus.UP_TO_DATE:
                this.setState({
                    syncMessage: '正在加载配置'
                })
                isStart = true;
                break
            case CodePush.SyncStatus.UPDATE_INSTALLED:
                this.setState({
                    syncMessage: '应用更新完成,重启中...'
                })
                break
            case CodePush.SyncStatus.UNKNOWN_ERROR:
                this.setState({
                    syncMessage: "应用更新出错,请退出重新启动!"
                });
                isStart = true;
                break;
        }

        isStart ? this.isUpdate = true : this.isUpdate = false;
        isStart ? this.inAppPage() : false;
        // isStart ? null : this._delayedOpen();
    }

    // 经过最大延时后，不管有没有数据都需要进入
    _delayedOpen() {
        setTimeout(() => {
            if (!this.isLoadData) {
                if (this.state.isShowEnterUrlPage == false) {
                    this.isLoadData = true;
                }

                if (Cpicon.length == 0 || Cpicon == undefined) {
                    let homeImageKey = 'HomeImagDataObjcet';
                    UserDefalts.getItem(homeImageKey, (error, result) => {
                        if (!error) {
                            if (result !== '' && result !== null) {
                                let homeImageModel = JSON.parse(result);
                                Cpicon = homeImageModel.cpicon;
                                HomeBanner = homeImageModel.homeBanner;
                                CPLinShiIcon = homeImageModel.cpLinShiIcon;
                            }
                        }
                    });
                }

                let yindaoKey = 'HomeYinDaoObjcet';
                UserDefalts.getItem(yindaoKey, (error, result) => {
                    if (!error) {
                        if (result !== '' && result !== null) {
                            HomeYinDao = 1;
                        } else {
                            HomeYinDao = 0;
                        }
                    }
                });
                //  首页请求数据缓存
                let homeKey = 'HomeCaiZhongObjcet';
                UserDefalts.getItem(homeKey, (error, result) => {
                    if (!error) {
                        if (result == '' || result == null) {

                        } else if (result !== '' && result !== null) {
                            let homeModel = JSON.parse(result);
                            AllZhongArray = homeModel.HomeCaiZhongAllArray;
                            HomeArray = homeModel.HomeCaiZhongArray;
                            HomeHeightZhongArray = homeModel.HomeHeightCaiZhongArray;
                            HomeLowZhongArray = homeModel.HomeLowCaiZhongArray;
                            SwiperArray = homeModel.HomeSwiperArray;
                            HomeSystemArray = homeModel.HomeSystemArray;
                            FootWinArray = homeModel.HomeFootWinArray;

                        }
                        this.inAppPage();
                    }
                });
            }

            this.setState({
                syncMessage: "数据请求超时,正在进入"
            });

        }, 10000)


        setTimeout(() => {
            if (!this.isUpdate) {
                this.isUpdate = true;
                this.inAppPage();
            }
            this.setState({
                syncMessage: "网络太慢, 正在进入"
            });
        }, 120000)
    }


    _getAsyncGameListData() {
        AsyncStorage.getItem('GameListData', (error, res) => {
            if (!error) {
                if (res !== '' && res !== null) {
                    let gameListData = JSON.parse(res);
                    if (gameListData.length > 1 && global.AllPlayGameList.length <= 0) {
                        this._handleGameList(gameListData);  // 处理数据
                    }
                }
            }
        });

        AsyncStorage.getItem('PlayDatas', (error, res) => {
            if (!error) {
                if (res !== '' && res !== null) {
                    let playDatas = JSON.parse(res);
                    global.GPlayDatas = playDatas;
                }
            }
        });

        AsyncStorage.getItem('OpenAllData_tag', (error, res) => {
            if (!error) {
                if (res !== '' && res !== null) {
                    let openDatas = JSON.parse(res);
                    global.OpenAllData_tag = openDatas;
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

    _handleGameList(datalist) {
        let newmodel = {}
        let openGameList = [];

        for (let i = 0; i < datalist.length; i++) {
            let model = datalist[i];

            if (model.enable != 2) {
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

    inAppPage() {


        if (this.isLoadData == true && this.isUpdate == true) {

            if (this.state.finishedPage)
                return;

            if (this.state.isShowEnterUrlPage) {
                this.setState({
                    isShowEnterUrlPage: false,
                    finished: true,
                });
            } else {
                this.setState({
                    finished: true,
                });
            }

            setTimeout(() => {
                this.setState({
                    finishedPage: true,
                });
            }, 1000)

        }
    }


    //下载资源包
    codePushDownloadDidProgress(progress) {
        this.setState({
            syncMessage: `正在下载新配置${(progress.receivedBytes / progress.totalBytes * 100.001).toFixed(2)}%`
        })
    }


    /** U更新被静默下载，并在重新启动（推荐） */
    // 后台更新
    checkUpdate() {
        CodePush.checkForUpdate().then((update) => {

            //console.log('update', update)
            if (!update) {

                if (this.isLineSwitch == false) {
                    this.setState({ syncMessage: '当前是最新配置' })
                }

                this.isUpdate = true;

                this.inAppPage();
            } else {
                CodePush.sync(
                    { installMode: CodePush.InstallMode.IMMEDIATE },
                    this.codePushStatusDidChange.bind(this),
                    this.codePushDownloadDidProgress.bind(this)
                ).catch((e) => {
                    console.log(e)
                    this.isUpdate = true;
                    this.inAppPage();
                })
            }
        }).catch((err) => {
            // console.log(err)
            this.isUpdate = true;
            this.inAppPage();
        })
        CodePush.notifyAppReady()

    }




    _onEnterDomainNamViewClose() {
        this.setState({ isShowEnterUrlPage: false })
    }




    // 解码方法
    // textCode 加密字符串
    // pass  解密字符
    _decode(textCode, pass) {

        if (!textCode) {
            return;
        }

        let result = '';
        let codes = [];

        for (let i = 0; i < pass.length; i++) {
            let objStr = parseInt(pass.charCodeAt(i));  //返回指定位置的Unicode编码
            codes.push(objStr);
        }

        //获取两个十六进制，并转换为十进制
        for (let i = 0; i < textCode.length; i += 2) {

            let hex = parseInt(textCode.substring(i, i + 2), 16);
            let inte = parseInt(hex.toString(10), 10);
            for (let j = pass.length; j > 0; j--) {
                let val = inte - (codes[j - 1]) * j;
                if (val < 0) {
                    inte = 256 - (Math.abs(val) % 256);
                } else {
                    inte = val % 256;
                }
            }
            result += String.fromCharCode(inte);//转换成ascii，并拼接到字符串中
        }
        return result;

    }

    //  点击按钮确认输入域名
    _userEnterConfirmBtn() {

        if (this.userEnterUrl === undefined || this.userEnterUrl === '' || this.userEnterUrl === null) {
            Alert.alert('请输入域名！');
        } else {

            this.setState({ enterMessage: '正在验证域名, 请等待...' })
            CPYuMingShuRu = 1;

            // this.setState({ waiting: true });
            // setTimeout(() => {
            //     this.setState({ waiting: false })
            // }, 2000);
            this.userEnterUrl = this._mmTrim(this.userEnterUrl);

            // 替换域名
            this._replaceDomainName();

            this._getByInterfaceReturnDomainName(this.userEnterUrl);
            // this._getSysInfo(this.userEnterUrl);

        }
    }

    _mmTrim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }

    // 输入时 替换域名
    _replaceDomainName() {
        // OK的
        let urlArr = [
            '1256aa.com',
            '3690077.com',
            '3690077.com',
            '3690077.com',
            'qcw102.com',
            'qcw102.com',
            'qcw102.com',
            'cpb0002.com',
            'cpb0002.com',
            'qtc009.com',
            'qtc009.com',

            'ios.gdemcg.com',
            'ios.gdemcg.com',
            'ios.gdemcg.com',
            'ios.gdemcg.com',
            'ios.gdemcg.com',
            'ios.gdemcg.com',
        ];

        let urlArr1 = [
            'http://www.1256.com',
            'http://www.369.cc',
            'http://www.369c.cc',
            'http://www.369cai.cc',
            'http://www.qcw001.com',
            'http://www.qcw101.com',
            'http://www.qcw007.com',
            'http://www.cpb0001.com',
            'http://www.cpb0003.com',
            'http://www.qitiancai.com',
            'http://www.qtc001.com',

            'http://www.cpb11.com',
            'http://www.cpb00.com',
            'http://www.cpb33.com',
            'http://www.cpb55.com',
            'http://www.cpb0004.com',
            'http://www.cpb0005.com',
        ];
        let urlArr2 = [
            'www.1256.com',
            'www.369.cc',
            'www.369c.cc',
            'www.369cai.cc',
            'www.qcw001.com',
            'www.qcw101.com',
            'www.qcw007.com',
            'www.cpb0001.com',
            'www.cpb0003.com',
            'www.qitiancai.com',
            'www.qtc001.com',

            'www.cpb11.com',
            'www.cpb00.com',
            'www.cpb33.com',
            'www.cpb55.com',
            'www.cpb0004.com',
            'www.cpb0005.com',
        ];
        let urlArr3 = [
            '1256.com',
            '369.cc',
            '369c.cc',
            '369cai.cc',
            'qcw001.com',
            'qcw101.com',
            'qcw007.com',
            'cpb0001.com',
            'cpb0003.com',
            'qitiancai.com',
            'qtc001.com',

            'cpb11.com',
            'cpb00.com',
            'cpb33.com',
            'cpb55.com',
            'cpb0004.com',
            'cpb0005.com',
        ];

        for (let index = 0; index < urlArr.length; index++) {
            let element = urlArr[index];
            if (this.isContains(this.userEnterUrl, 'http://www.')) {
                let urlIndex1 = urlArr1[index];
                if (urlIndex1 == this.userEnterUrl) {
                    this.userEnterUrl = element;
                    break;
                }
            } else if (this.isContains(this.userEnterUrl, 'www')) {
                let urlIndex2 = urlArr2[index];
                if (urlIndex2 == this.userEnterUrl) {
                    this.userEnterUrl = element;
                    break;
                }
            } else {
                let urlIndex3 = urlArr3[index];
                if (urlIndex3 == this.userEnterUrl) {
                    this.userEnterUrl = element;
                    break;
                }
            }
        }
    }


    // 替换已经保存的旧的域名
    _replaceOldDomainName(userURL) {
        // OK 的域名
        let urlArrOkArr = [
            'qcw102.com',
            'qcw102.com',
            'qcw102.com',
            'cpb0002.com',
            'cpb0002.com',
            'qtc009.com',
            'qtc009.com',

            'ios.gdemcg.com',
            'ios.gdemcg.com',
            'ios.gdemcg.com',
            'ios.gdemcg.com',
            'ios.gdemcg.com',
            'ios.gdemcg.com',
        ];


        let urlArr = [
            'http://qcw001.com',
            'http://qcw101.com',
            'http://qcw007.com',
            'http://cpb0001.com',
            'http://cpb0003.com',
            'http://qitiancai.com',
            'http://qtc001.com',

            'http://cpb11.com',
            'http://cpb00.com',
            'http://cpb33.com',
            'http://cpb55.com',
            'http://cpb0004.com',
            'http://cpb0005.com',
        ];

        let urlArrHttpwww = [
            'http://www.qcw001.com',
            'http://www.qcw101.com',
            'http://www.qcw007.com',
            'http://www.cpb0001.com',
            'http://www.cpb0003.com',
            'http://www.qitiancai.com',
            'http://www.qtc001.com',

            'http://www.cpb11.com',
            'http://www.cpb00.com',
            'http://www.cpb33.com',
            'http://www.cpb55.com',
            'http://www.cpb0004.com',
            'http://www.cpb0005.com',
        ];



        for (let index = 0; index < urlArr.length; index++) {
            let element = urlArr[index];
            let elementHttpwww = urlArrHttpwww[index];
            if (userURL == element || userURL == elementHttpwww) {
                userURLOK = urlArrOkArr[index];
            }
        }
        return userURL;
    }



    _getByInterfaceReturnDomainName(urlPath) {

        this.domainNameMm = urlPath;

        let arrPlist = ['http://plist.aotubangfen.com:8089', 'http://plist.gotoguxiang.com:8089', 'http://plist.aujingift.com:8089', 'http://plist.jifenos.com:8089', 'http://plist.xmfn14.com:8089'];
       
        let rmIndex = Math.floor(Math.random() * arrPlist.length);

        // 正式站  plistIndex
        let urlPathPlist = arrPlist[rmIndex] + '/index.php/AppApi/request?ac=getUrlInfo&client_type=3&key=d20a1bf73c288b4ad4ddc8eb3fc59274704a0495&domain=' + urlPath;


        // let params = new FormData();
        // params.append("ac", "getUrlInfo");
        // params.append("client_type", '3');
        // params.append("key", 'd20a1bf73c288b4ad4ddc8eb3fc59274704a0495');
        // params.append("domain", urlPath);

        // let encryptPar = this._ClEncrypt(params, 'bx20180701');
        // let urlPathPlist = arrPlist[rmIndex] + '/index.php/AppApi/request?p=' + encryptPar;

        let messString = '正在重试获取域名, 请耐心等待...' + this.requestNum;
        var request = new XMLHttpRequest();
        var isTimeOut = false;

        var timer = setTimeout(() => {
            isTimeOut = true;
            request.abort();
            this.isLoadData = true;
            this.inAppPage();
        }, 10000);

        request.onreadystatechange = (e) => {
            if (request.readyState !== 4) {
                return;
            }
            if (isTimeOut) return;
            clearTimeout(timer);
            if (request.status === 200) {

                var responseData = JSON.parse(request.responseText);

                if (!responseData['data']) {
                    this.NewOldVersion = 1;
                    this._getSysInfo(urlPath);
                    return;
                }

                let decodeStr = JSON.parse(this._decode(responseData['data'], 'bxvip588'));

                if (!decodeStr) {
                    this.NewOldVersion = 1;
                    this._getSysInfo(urlPath);
                    return;
                }


                let urlsStr = decodeStr['url'];
                var arrUrl = urlsStr.split(";");

                let versionJudgment = decodeStr['version'];

                if (arrUrl.length > 0) {

                    let AddHttpIPArry = [];

                    for (let index = 0; index < arrUrl.length; index++) {
                        // 用户输入带http:// 或者不带http:// 都可以
                        let ipUrl = arrUrl[index];
                        if (!this.isContains(ipUrl, 'http')) {
                            AddHttpIPArry.push('http://' + ipUrl);
                        } else {
                            AddHttpIPArry.push(ipUrl);
                        }
                    }


                    GetSetStorge.setStorgeAsync('USERBASEURL', JSON.stringify(urlPath))


                    global.GlobalLineIPArray = AddHttpIPArry;
                    GlobalConfig.lineIPArray = AddHttpIPArry;

                    this._getSysInfo(arrUrl[0]);

                } else {
                    this.isLoadData = true;
                    this.inAppPage()
                }

            } else {

                self.plistIndex++;
                if (self.plistIndex > arrPlist.length - 1) {
                    self.plistIndex = 0;
                    this._getLocallySaveUrlData();
                } else {
                    this.setState({ syncMessage: messString })
                    this._getByInterfaceReturnDomainName(urlPath)
                }
            }
        };
        request.open('GET', urlPathPlist);
        request.send();
    }




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

        let valArr = parStr.split('');
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


    // 输入域名页面
    _isShowEnterDomainNamView() {
        let versionIDStr;
        if (global.GLOBALmmRainbow && global.GLOBALmmRainbow['id']) {
            versionIDStr = VersionNum + '  ID:' + global.GLOBALmmRainbow['id'];
        } else {
            versionIDStr = VersionNum;
        }

        return (

            <View style={styles.eNameViewContainer}>
                <ImageBackground style={styles.eNameImageStyle}
                    source={LocalImgs.ic_bg_urlback}
                >

                    <View style={styles.enter_urlbg_container}>
                        <Text style={styles.enterMessageStyle}>{this.state.enterMessage || ""}</Text>

                        <View style={styles.enter_container}>
                            <View style={styles.url_TitleViewStyle}>
                                <Text style={styles.eNametitleStyle}>域名</Text>
                            </View>
                            <TextInput
                                autoCapitalize='none'
                                autoCorrect={false}
                                underlineColorAndroid='transparent'
                                style={styles.eNameInputTextStyle}
                                placeholder='请输入域名'
                                onChangeText={(text) => this.userEnterUrl = text}
                            />
                        </View>


                        <TouchableOpacity
                            disabled={this.state.waiting}
                            style={styles.confirmBtnStyle}
                            activeOpacity={0.5}
                            onPress={() => {
                                this._userEnterConfirmBtn();
                            }}
                        >
                            <ImageBackground style={styles.urlbtn_imgStyle}
                                source={LocalImgs.ic_urlbtn}>

                                <Text style={styles.confirmBtnText}>确认</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>

                </ImageBackground>
                <Text style={styles.enter_VersionNumStyle}>{versionIDStr}</Text>
            </View>
        )
    }





    render() {

        let versionIDStr;
        if (global.GLOBALmmRainbow && global.GLOBALmmRainbow['id']) {
            versionIDStr = VersionNum + '  ID:' + global.GLOBALmmRainbow['id'];
        } else {
            versionIDStr = VersionNum;
        }

        return <View style={styles.container}>
            <AllenShortCut allenToastCallBack={this.allenToastCallBack} />
            {this.state.finished ? <App /> : null}
            {
                this.state.finishedPage ? null :
                    (this.state.lauchImgUri == '' ? (
                        <ImageBackground style={styles.imageBackStyle}
                            source={LocalImgs.ic_public_launchImage}>
                            <Text style={styles.messages}>{'' + this.state.syncMessage || ""}</Text>

                            <Text style={styles.VersionNumCodeStyle}>{versionIDStr}</Text>

                        </ImageBackground>
                    ) : (
                            <View style={styles.imageBackStyle}>
                                {/* <CachedImage source={{ uri: this.state.lauchImgUri }} style={styles.CachedImageStyle}
                                    ></CachedImage> */}

                                <ImageCacheProvider
                                    urlsToPreload={this.LaunchImageUrlArray}
                                    onPreloadComplete={() => console.log('hey there')}>
                                    <CachedImage source={{ uri: this.state.lauchImgUri }} style={styles.CachedImageStyle} />
                                </ImageCacheProvider>


                                <Text style={styles.messages}>{'' + this.state.syncMessage || ""}</Text>
                                <Text style={styles.VersionNumCodeStyle}>{versionIDStr}</Text>
                            </View>

                        )
                    )
            }


            <Modal
                visible={this.state.isShowEnterUrlPage}
                //显示是的动画默认none
                //从下面向上滑动slide
                //慢慢显示fade
                animationType={'none'}
                //是否透明默认是不透明 false
                transparent={true}
                //关闭时调用
                onRequestClose={() => this._onEnterDomainNamViewClose()}
            >{this._isShowEnterDomainNamView()}</Modal>

            <AllenModal
                style={{ backgroundColor: "transparent", position: "absolute", top: 0, left: 0 }}
                transparent={true}
                backdropPressToClose={true}
                ref={"calendarstart"}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <ImageBackground style={{ width: SCREEN_WIDTH - 60, height: 350, alignItems: 'center' }}
                        source={require('./pages/home/img/ic_home_jsj.png')}>
                        <CusBaseText style={{ fontSize: 14, color: '#ffcf00', marginTop: 270, fontWeight: '900' }}>
                            恭喜您获得财神红包!!!
                            </CusBaseText><CusBaseText style={{ fontSize: 14, color: '#ffcf00', fontWeight: '900' }}>
                            {global.prizeToPrize}彩金
                            </CusBaseText>
                    </ImageBackground>

                    <TouchableOpacity style={{ marginTop: 10 }} activeOpacity={0.7} onPress={() => {
                        this.setState({ isShowDaliyGiftView: false, isShowPriceToPriceView: false })
                        // this.refs.calendarstart.open();
                        this.refs.calendarstart.close();
                    }}>
                        <Image style={{ width: 20, height: 20 }}
                            source={require('./pages/home/img/ic_xoxo.png')}>
                        </Image>
                    </TouchableOpacity>

                </View>
            </AllenModal>



        </View>


        // }

    }











    // ============== 暂时弃用方法 ==============

    // iOS 暂用替代方法
    _iOSXMLHttpRequest(urlPath) {
        let messString = '正在重试获取域名, 请耐心等待...' + this.requestNum;
        var request = new XMLHttpRequest();
        var isTimeOut = false;
        var timer = setTimeout(() => {
            isTimeOut = true;
            request.abort();
            this.isLoadData = true;
            this.inAppPage();
        }, 10000);
        request.onreadystatechange = (e) => {
            if (request.readyState !== 4) {
                return;
            }
            if (isTimeOut) return;
            clearTimeout(timer);
            if (request.status === 200) {
                console.log('success', request.responseText);
                let httpUrl = this._decode(request.responseText, 'bxvip588');
                var arr = httpUrl.split("|");//http://bxvip588.com=355656|0
                // console.log(httpUrl);
                if (arr.length > 0) {
                    if (arr.length >= 4) {
                        global.rcode = arr[3];
                    }
                    this._getSysInfo(arr[0]);
                } else {
                    this.isLoadData = true;
                    this.inAppPage()
                }
            } else {
                if (this.requestNum > 0) {
                    this.setState({ syncMessage: messString })
                    this.requestNum--;
                    this._iOSXMLHttpRequest(urlPath)
                } else {
                    this._getLocallySaveUrlData();
                }
            }
        };
        request.open('GET', urlPath);
        request.send();
    }



    // 获取http 原生fetch 
    _xMLHttpRequest(urlPath) {

        let messString = '正在重试获取域名, 请耐心等待...' + this.requestNum;

        console.log('urlPath--->', urlPath);

        fetch(urlPath, {
            method: 'GET',
            timeout: 15,
        })
            .then((response) => {
                // response.json()
                console.log('response--->', response);

                if (response.status === 200) {
                    let httpUrl = this._decode(response._bodyText, 'bxvip588');
                    var arr = httpUrl.split("|");//http://bxvip588.com=355656|0|rcode|12|ip|12.12.121.2;12.132.12.1
                    if (arr.length > 0) {

                        if (arr.length >= 4) {
                            global.rcode = arr[3];
                        }
                        this._getSysInfo(arr[0]);
                    } else {
                        this.isLoadData = true;
                        // 进入App
                        this.inAppPage()
                    }

                } else {
                    if (this.requestNum > 0) {
                        this.setState({ syncMessage: messString })
                        this.requestNum--;
                        this._xMLHttpRequest(urlPath)
                    } else {
                        this._getLocallySaveUrlData();
                    }
                }
            })
            .catch((err) => {

                if (this.requestNum > 0) {
                    this.setState({ syncMessage: messString })
                    this.requestNum--;
                    this._xMLHttpRequest(urlPath)
                } else {
                    this._getLocallySaveUrlData();
                }
            });
    }




};




const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageBackStyle: {
        position: 'absolute',
        flexDirection: "column",
        alignItems: 'center',
        // justifyContent: 'center',
        top: 0,
        left: 0,
        width: width,
        height: height,
    },

    CachedImageStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height,
    },

    messages: {
        position: 'absolute',
        marginTop: height - 50,
        // flexWrap: 'nowrap',
        textAlign: "center",
        // height:20,
        color: '#515151',
        // alignItems: 'center',
        // backgroundColor: 'blue'
        backgroundColor: 'rgba(0, 0, 0, 0)'
        // textAlignVertical:'bottom',
    },
    VersionNumCodeStyle: {
        position: 'absolute',
        marginTop: height - 30,
        textAlign: "center",
        color: '#515151',
        // backgroundColor: 'yellow',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        fontSize: 12,
    },

    enter_VersionNumStyle: {
        position: 'absolute',
        marginTop: height - 30,
        textAlign: "center",
        width: SCREEN_WIDTH,
        color: '#515151',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        fontSize: 14,
    },


    // 输入域名
    eNameViewContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    eNameImageStyle: {
        position: 'absolute',
        // flexDirection: "row",
        alignItems: 'center',
        top: 0,
        left: 0,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    enter_urlbg_container: {
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor:'blue',
        marginTop: -120,
    },

    enterMessageStyle: {
        height: 25,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        fontSize: 20,
        color: 'blue',
        marginTop: 60,
    },

    enter_container: {
        // justifyContent:'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: 50,
        width: width - 30 * 2,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#dfdfea',
    },
    url_TitleViewStyle: {
        width: 70,
        borderRightWidth: 1,
        borderColor: '#dfdfea',
        height: 49,
        justifyContent: 'center',
        alignItems: 'center',
    },

    eNametitleStyle: {
        color: '#474849',
        fontSize: 16,
    },
    eNameInputTextStyle: {
        flex: 1,
        height: 32,
        paddingLeft: 5,
        textAlign: 'left',
        color: 'black',
        fontSize: 14,
        padding: 0,
        marginLeft: 5,
    },


    // 例：详情
    remarks_style: {},
    remarks_text: {
        color: '#ebebeb',
    },

    confirmBtnStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },

    urlbtn_imgStyle: {
        width: 462 / 2,
        height: 99 / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },

    confirmBtnText: {
        color: '#010a00',
        fontSize: 20,
        backgroundColor: 'rgba(0, 0, 0, 0)'
    },



});


/**
 * 配置了手动检查频率，便于测试。 对于生产应用程序，建议配置一个
   *不同的检查频率，如ON_APP_START，对于CodePush.sync（）不执行的“手动”方法
   *需要明确调用。 CodePush.sync（）的所有选项也可在此装饰器中使用。
 */
// let codePushOptions = { checkFrequency: CodePush.CheckFrequency.MANUAL };
// Root = CodePush(codePushOptions)(Root);


// global.BASEURL = 'hahaha';
// 关闭全部的警告
if (iOS) {
    console.disableYellowBox = true;
}
// console.disableYellowBox = true;
// 关闭指定的警告
//console.warn('YellowBox is disabled.');

AppRegistry.registerComponent('SKyCPRN', () => Root);
