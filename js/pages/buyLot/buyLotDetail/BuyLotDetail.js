'use strict';

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    AsyncStorage,
    ActivityIndicator,
    Modal,
    Alert,
} from 'react-native';

import Toast, {DURATION} from 'react-native-easy-toast'  //土司视图
import SelectGameView from '../../trend/SelectGameView';      //彩种选择弹窗视图
import BuyCenter from './touzhu2.0/NewBuyCenter/NewBuyCenter';
import NewBottomView from './buyTool/NewUnitBottomView';   //新版底部工具栏
import  NewAllenShopAlertView from './touzhu2.0/shoppingCart/AllenShopContentAlertViewVersion3';
import NewOpenInfoHeader from './touzhu2.0/newBuyTool/NewOpenInfoView';  //新版开奖头部视图
import NewGuanFangXinYongView from './touzhu2.0/newBuyTool/NewSwitchGFXYView';  //新版官方信用选择视图

import CalcReturnParam from './CalcReturnParam'; // 计算返回投注需要的参数

let currentTime = 0;  //当前时间
let currentFengPan = 0; //当前封盘时间
var isRemindJieZhi = false; //是否提示用户到期
let trendClick = true; // 走势连续点击
var currentUserMoney = 0;

class BuyLotDetail extends Component {

    static navigationOptions = ({ navigation }) => ({

        header: (

            <CustomNavBar
                leftClick={() => navigation.state.params.navLeftPress ? navigation.state.params.navLeftPress() : null}
                centerView={
                    <TouchableOpacity
                        activeOpacity={1} onPress={navigation.state.params ? navigation.state.params.navTitlePress : null}>
                        <View style={{
                            width: SCREEN_WIDTH - 140,
                            height: 44,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            marginTop: SCREEN_HEIGHT == 812 ? 40 : 20,
                        }}>
                            <CusBaseText style={{ fontSize: Adaption.Font(18, 16), color: 'white' }}>{navigation.state.params.navcLTitle}</CusBaseText>
                            <CusBaseText style={{ fontSize: Adaption.Font(15, 13), color: 'white', marginTop: 2 }}>{navigation.state.params.navcSTitle}</CusBaseText>
                            {navigation.state.params.navcSTitle != null && navigation.state.params.navcSTitle.length > 1
                                ? <Image resizeMode={'contain'} style={{width: 15, height: 15}} source={require("../img/whitejiantou.png")}/>
                                : null
                            }
                        </View>
                    </TouchableOpacity>
                }
                rightView={
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ width: 60, height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: SCREEN_HEIGHT == 812 ? 40 : 20 }}
                        onPress={navigation.state.params ? navigation.state.params.navRightPress : null}
                    >
                        <Image resizeMode={'contain'} style={{width: Adaption.Width(20), height: Adaption.Width(20) }} source={require('../img/ic_buyLotChange.png')}/>
                        <CusBaseText style={{fontSize: Adaption.Font(17, 15), marginLeft:2, color: 'white'}}>彩种</CusBaseText>
                    </TouchableOpacity>
                }
            />
        ),
    })

    constructor(props) {
        super(props);

        let gameId = this.props.navigation.state.params.gameId;
        let gameName = '', tag = '', js_tag = '', speed = 0;

        if (Object.keys(global.GameListConfigModel).length > 0) {
            let gameDic = global.GameListConfigModel[`${gameId}`];

            js_tag = gameDic['js_tag']; // 当前彩种的js_tag
            tag = gameDic['tag']; // 当前彩种的tag, 根据tag判断高频彩
            gameId = gameId; //当前彩种的game_id
            gameName = gameDic['game_name']; //当前彩种的名称
            speed = gameDic['speed'];  //高低频彩判断
        }

        this.state = {
            allPlayData: [],
            currentWafaAllPlayData:[],  // 当前玩法的所有数据 。官方 或 信用的
            peilvDataArr: [], // 存放请求回来的赔率
            isShowGameView: false,
            isShowSwitchBlocksView: false,
            isShowShopAlertView: false, //是否弹出购物车弹窗
            currentPlayData: {}, // 当前选中的玩法数据。 和值、直选复式..
            current_js_tag: js_tag, // 当前彩种的js_tag
            current_tag: tag, // 当前彩种的tag, 根据tag判断高频彩
            current_gameId: gameId,
            current_gameName: gameName, //当前彩种的名称
            current_speed: speed,  //高低频彩判断

            ballSelectData: {}, // 选的号码
            titles: [], // 左边的title；千位／百位...
            pickerZhuShu: 0, //选的总注数
            shopCarZhushuNum: 0, // 购物车的总注数
            ballsNumPinJieArr: [], //解析拼接后的号码
            isShowLoad: false, // 加载框
            isLoadPeilv: false, // 赔率请求是否成功。
            wanfaindx: 1,  // 默认显示0官方玩法
            isLockTouZhu:false, //是否是封盘时间
            isClickOpen:false,  //开奖列表是否展开
            lockTime:0,  //封盘时间
            isShowGuide1: global.TouZhuGuide == 0 ? false : true, // 是否显示引导页面1
        };
        this.isTrendCallBack = false;
        this.wating = false;  //不能多次点击
    }

    componentWillUnmount() {

        // global.isLeaveBuyVC = true;

        if (typeof(this.subscription) == 'object') {
            this.subscription && this.subscription.remove();
        }

        if (typeof(this.subscription3) == 'object') {
            this.subscription3 && this.subscription3.remove();
        }

        if (typeof(this.subscription2) == 'object') {
            this.subscription2 && this.subscription2.remove();
        }

        if (typeof(this.subscription4) == 'object') {
            this.subscription4 && this.subscription4.remove();
        }


        //若组件被卸载，刷新state则直接返回，可以解决警告(倒计时组件可能造成的警告)
        this.setState = (state,callback) => {
            return;
        }

    }

    componentDidMount() {

        // global.isLeaveBuyVC = false; //是否离开界面
        global.isInShopCarVC = false; //是否在购物车界面
        global.isInBuyLotVC = true;  //是否在投注界面
        currentUserMoney = global.UserLoginObject.TotalMoney;

        global.ShopHistoryArr = [];  // 防止划左边返回上一个界面 购物车没清空问题。
        
        this.props.navigation.setParams({
            navRightPress: this._showHelpView,
            navTitlePress: this._showSwitchBlocksView,
            navcLTitle: this.state.current_gameName,
            navcSTitle: '',
            navLeftPress: this._clearTouZhuList,
        });

        //请求当前彩种开奖数据
        this._fetchCountDownData(this.state.current_tag);
        this._fetchOpenInfoData(this.state.current_tag);

        let isLogin = global.UserLoginObject.Uid && global.UserLoginObject.Token; // 是否登录
        this._requestPeilvConfig(this.state.current_gameId, this.state.current_js_tag, isLogin ? true : false); // 请求赔率
        
        this._currentPlayData(this.state.current_js_tag);

        if (global.AllPlayGameList == null || global.AllPlayGameList.length <= 0) {
            this._fetchAllCZData(); //请求所有彩种。
        }

        //接受倒计时通知,弹出是否清空购物车界面
        this.subscription = PushNotification.addListener('BuyLotDetailCountDown', () => {

            if ((isRemindJieZhi == false && global.isInShopCarVC == false && global.isInBuyLotVC == true)) {

                isRemindJieZhi = true;
                //每次倒计时结束都会提示用户
                if (this.state.isShowGameView == true || this.state.isShowShopAlertView == true) {

                    this.setState({

                        isShowGameView: false,
                        isShowShopAlertView: false,
                    })
                }

                // 购物车有数据时 弹出倒计时截止弹窗
                if (global.ShopHistoryArr.length != 0) {

                    setTimeout(() => {

                        //自定义弹窗, 必须要判断这个RNAlert 存在
                        this.refs.RNAlert && this.refs.RNAlert.show();
                        this.refs.RNAlert && this.refs.RNAlert.dissmiss(3);
                    }, 200);
                }

                //设置延迟30秒,已经弹过窗的要重新赋值
                setTimeout(() => {

                    isRemindJieZhi = false;

                }, 30000);
            }
        });

        //手动添加回来刷新购物车号码
        this.subscription3 = PushNotification.addListener('HandAutoAddNotification', (newZhushuNum) => {
            this.setState({shopCarZhushuNum: newZhushuNum});
        });


        // 登录后，重新刷新显示赔率
        this.subscription2 = PushNotification.addListener('RefreshBalls', () => {

            // 从这个界面去登录，回来要请空玩法数据，重新请求。
            this.setState({
                pickerZhuShu: 0,
                totalPrice: 0.00,
            })

            // 发出清空号码的通知
            PushNotification.emit('ClearAllBalls');

            // 请求赔率
            setTimeout(() => {
                let isLogin = global.UserLoginObject.Uid && global.UserLoginObject.Token; // 是否登录
                this._requestPeilvConfig(this.state.current_gameId, this.state.current_js_tag, isLogin ? true : false); // 请求赔率
            }, 500)
        });

        //投注成功的通知
        this.subscription4 = PushNotification.addListener('TouZhuSuccessNotifcation', (message) => {

            this.refs.Toast && this.refs.Toast.show(message, 3000);
        });
    }

    //退出投注界面时的逻辑
    _clearTouZhuList = () => {
        if (global.ShopHistoryArr.length != 0) {
            Alert.alert('温馨提示', '您是否要清空购物车',
                [
                    {
                        text: '取消', onPress: () => {
                        }
                    },
                    {
                        text: '确定', onPress: () => {
                            this._reasetLotView()
                        }
                    },
                ]);
        } else {

            if (this.wating == false) {

            //如果用户没有投注则返回时不刷新金额
         
            this.props.navigation.state.params.backAction ? this.props.navigation.state.params.backAction() : null;
            
            PushNotification.emit('Lot_CellTime', global.time, this.props.navigation.state.params.indexList);
            this.props.navigation.goBack();
                this.wating = true;

                //退出重置元角分单位
                global.LastSelectUnit = 0;
                global.ShopHistoryArr = [];
                global.BeiShu = '1';     //重新初始化，防止下次进来计算出错
                global.ZhuiQiShu = '1';

                //如果用户没有投注则返回时不刷新金额
            
                this.props.navigation.state.params.backAction ? this.props.navigation.state.params.backAction() : null;
              
                PushNotification.emit('Lot_CellTime', global.time, this.props.navigation.state.params.indexList);
                this.props.navigation.goBack();

                setTimeout(() => {this.wating = false}, 3000);
            }
        }
    }

    //重置视图，清空数据
    _reasetLotView() {

        this.refs.Toast && this.refs.Toast.show('清空购物车成功!', 1000);
        PushNotification.emit('ClearAllBalls');
        this.setState({
            pickerZhuShu: 0,
            totalPrice: 0.00,
            ballSelectData: {},
            shopCarZhushuNum: 0, //购物车号码
        });

        global.ShopHistoryArr = [];
        global.LastSelectUnit = 0;
        PushNotification.emit('ClearShopCarOffNotification');  //清空购物车，屏蔽查看购物车按钮的通知
    }

    //弹出彩种列表
    _showHelpView = () => {

        this.setState({
            isShowGameView: !this.state.isShowGameView,
        })
    };

    //弹出玩法选择
    _showSwitchBlocksView = () => {
        if (this.props.navigation.state.params.navcSTitle != null && this.props.navigation.state.params.navcSTitle.length > 1) {
            this.setState({
                isShowSwitchBlocksView: !this.state.isShowSwitchBlocksView,
            });
        }
    };

    //获取历史开奖数据接口
    _fetchOpenInfoData(tag){

        let params = new FormData();
        params.append('ac','getKjCpLog');
        params.append('tag', tag);
        params.append('pcount', 8);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                if (responseData.msg == 0 && responseData.data.length > 0) {

                    let prevList = [];
                    responseData.data.map((prev, j) => {
                        prevList.push({key: j, value: prev});
                    });

                    this.setState({
                        prevList: prevList,
                    })
                } else {
                    //彩种数据请求失败或返回错误
                    this.refs.Toast && this.refs.Toast.show('获取开奖数据错误!', 1000);
                }
            })
            .catch((err) => {
            })
    }

    //获取彩种倒计时接口，返回10条数据，本地倒计时
    _fetchCountDownData(tag){

        let params = new FormData();
        params.append('ac', 'getCplogList');
        params.append('tag', tag);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                if (responseData.msg == 0 && responseData.data) {

                    if (responseData.data[0].next.length != 0){

                        let nextList = responseData.data[0].next;

                        global.CurrentQiShu = nextList[0].qishu;  //当前期数

                         let isLock =  nextList[0].stoptime - nextList[0].server_time;  //如果这个字段小于等于0则表示已封盘

                        if (isLock <= 0){

                            this.setState({
                                isLockTouZhu:true,
                            })

                            //设置锁定时间(封盘时间)
                            setTimeout(() => {

                                this.setState({
                                    isLockTouZhu:false,
                                })

                            }, isLock * 1000)
                        }
                        else {
                            //切换彩种造成封盘
                            if (this.state.isLockTouZhu == true){
                                this.setState({
                                    isLockTouZhu:false,
                                })
                            }
                        }

                        this.setState({
                            nextData:nextList,
                        })
                    }
                    else {
                        //彩种数据请求失败或返回错误
                        this.refs.Toast && this.refs.Toast.show('获取倒计时数据错误!', 1000);
                    }
                }
                else {
                    this.refs.Toast && this.refs.Toast.show(responseData.param, 1000);
                }
            })
            .catch((err) => {
            })
    }

    // 请求所有彩种，点击导航右上角的时候，传这个数据进去
    _fetchAllCZData() {
        let params = new FormData();
        params.append("ac", "getGameListAtin");
        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {
                if (responseData.msg == 0) {
                    global.AllPlayGameList = responseData.data;
                }
            })
            .catch((err) => {
            })
    }

    // 获取玩法数据，（请求或从缓存取）
    _currentPlayData(js_tag) {

        let dataList = global.GPlayDatas[`js_tag_${js_tag}_List`] == undefined ? [] : global.GPlayDatas[`js_tag_${js_tag}_List`];

        // 有缓存数据，那就先从缓存取，再请求新数据替换它。
        if (dataList != null && dataList.length > 0) {
            // 直接处理数据。
            this._handlePlay(dataList);

            // 去请求 要不要更新玩法配置，如果结果为1，就直接去请求玩法。
            this._getPlayConfigUpdate(js_tag);

        } else {
            // 请求数据，里面再处理数据。
            this._requestPlayData(js_tag, true);
        }
    }


    // 请求当前玩法的赔率
    _requestPeilvConfig(game_id, js_tag, isLogin) {

        let keystr = `gameId_${game_id}_${js_tag}_peilv`;
        if (!isLogin) { // 未登录
           // 非邀请码的域名bind_param有值；邀请模式bind_param没有值； 邀请模式不请求赔率
           if (GlobalConfig.userData.bind_param == '') {
                this.setState({
                    isLoadPeilv: true,
                })
                return;
            }
            keystr = `noLogin_gameId_${game_id}_${js_tag}_peilv`;
        }

        let peilvDatas = global.GPlayDatas[keystr] == undefined ? [] : global.GPlayDatas[keystr];
        if (peilvDatas.length > 0) {
            this.setState({
                isLoadPeilv: true,
                peilvDataArr: peilvDatas,
            })
        } else {
            this.state.peilvDataArr = [];
        }

        let params = new FormData();
        if (isLogin) {
            params.append("ac", 'getPeilvConfig');
            params.append("uid", global.UserLoginObject.Uid != null ? global.UserLoginObject.Uid : '');
            params.append("token", global.UserLoginObject.Token != null ? global.UserLoginObject.Token : '');
            params.append("sessionkey", global.UserLoginObject.Token != null ? global.UserLoginObject.Token : '');
        } else {
            params.append("ac", 'getPeilvNoLogin');
            params.append("bind_param", GlobalConfig.userData.bind_param);
        }
        params.append("gameid", game_id);
        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                if (responseData.msg == 0 && responseData.data != null) {
                    if (keystr.includes(this.state.current_js_tag)) {
                        // 防止请求没成功时，又去切换彩种，赋值错乱的
                        this.setState({
                            isLoadPeilv: true,
                            peilvDataArr: responseData.data,
                        });
                    } else {
                        this.setState({
                            isLoadPeilv: true,
                        });
                    }

                    // data有数据，缓存数据
                    if (responseData.data.length > 0) {
                        global.GPlayDatas[keystr] = responseData.data; // 当前玩法赔率
                        let datas = JSON.stringify(global.GPlayDatas);
                        AsyncStorage.setItem('PlayDatas', datas, (error) => { });
                    }
                
                } else {
                    this.setState({
                        isLoadPeilv: true,  // 请求发生错误
                        peilvDataArr: this.state.peilvDataArr.length > 0 ? this.state.peilvDataArr : [],
                    })
                    this.refs.Toast && this.refs.Toast.show('赔率'+responseData.param, 1500);
                }
            })
            .catch((err) => {
                this.setState({
                    isLoadPeilv: true,  // 请求发生错误
                })
                this.refs.Toast && this.refs.Toast.show('赔率获取失败！', 1500);
            })
    }

    // 是否要更新玩法配置
    _getPlayConfigUpdate(js_tag) {

        let last_time =  global.GPlayDatas[`timestamp_${js_tag}`] ? global.GPlayDatas[`timestamp_${js_tag}`] : 0;

        if (last_time == 0) {
           // 直接去请求玩法配置 
           this._requestPlayData(js_tag);
           return;
        }

        // 请求 是否有更新玩法配置
        let params = new FormData();
        params.append("ac", "getPlayConfigUpdate");
        params.append("js_tag", js_tag);
        params.append("last_time", last_time);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {
                if (responseData.msg == 0) {
                
                    if (responseData.data.update && responseData.data.update == 1) {
                        // 为1时，更新玩法配置。
                        this._requestPlayData(js_tag); // 请求数据，里面再处理数据。
                    }
                }
            })
            .catch((err) => {
            })
    }

    // 请求玩法数据。
    _requestPlayData(js_tag, isshowLoad) {

        if (isshowLoad) {
            this.setState({ isShowLoad: true}); // 加载框
        }

        let params = new FormData();
        params.append("ac", "getGamePlayConfig");
        params.append("js_tag", js_tag);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                if (responseData.msg != 0) {
                    
                    if (isshowLoad) {
                        this.refs.Toast && this.refs.Toast.show('玩法数据：' + responseData.param, 2000);
                        this._handlePlay([]);  // 玩法请求失败，也要改变导航标题和界面
                    }

                } else {

                    let dataList = responseData.data ? responseData.data.list : [];
                    this._handlePlay(dataList);  // 处理数据。

                    // 缓存玩法数据
                    global.GPlayDatas[`js_tag_${js_tag}_List`] = dataList;
                    global.GPlayDatas[`timestamp_${js_tag}`] = responseData.data.timestamp ? responseData.data.timestamp : 0;
                    let datas = JSON.stringify(global.GPlayDatas);
                    AsyncStorage.setItem('PlayDatas', datas, (error) => { });
                }
            })

            .catch((err) => {
                if (isshowLoad) {

                    this._handlePlay([]);  // 玩法请求失败，也要改变导航标题和界面

                    if (err.message == 'Network request failed') {
                        this.refs.Toast && this.refs.Toast.show('网络请求失败！', 2000);
                    } else {
                        this.refs.Toast && this.refs.Toast.show('加载失败！', 1500);
                    }
                }
            })
    }

    // 处理玩法数据。
    _handlePlay(dataList) {

        let officiList = [];
        let creditList = [];
        dataList.map((value, idx) => {
            if (value.showofficial == '0') {
                officiList.push(value);
            } else {
                creditList.push(value);
            }
        });

        let allDataArr = [officiList, creditList];
        let wanfaidx = this.state.wanfaindx == 1 && creditList.length <= 0 && officiList.length > 0 ? 0 : this.state.wanfaindx;
        //刷新界面要用到
        this.setState({
            wanfaindx: wanfaidx, // 重新赋值
            allPlayData: allDataArr,
            currentWafaAllPlayData: allDataArr[wanfaidx],
            currentPlayData: dataList.length <= 0 ? {} : allDataArr[wanfaidx][0].submenu[0].playlist[0], // 默认彩种数据 切换玩法时改变
            isShowLoad: false,  // 隐藏加载框
        });

        //重新设置导航栏。
        let jsttag = dataList[0].js_tag;  // 判断如果是快三 pcdd 六合彩 就不显示navcSTitle。
        if (this.isTrendCallBack) {
            // 走势彩种改变后，返回到这里时 刷新导航栏要延迟一下，不然刷新导航的方法他不走。
            this.isTrendCallBack = false;
            setTimeout(() => {
                this.props.navigation.setParams({
                    navRightPress: this._showHelpView,
                    navTitlePress: this._showSwitchBlocksView,
                    navcLTitle: this.state.current_gameName,
                    navcSTitle: creditList.length <= 0 && (jsttag == 'lhc' || jsttag == 'k3' || jsttag == 'pcdd') ? '' : (wanfaidx == 0 ? '-官方玩法' : '-双面玩法'),
                    navLeftPress: this._clearTouZhuList,
                });
            }, 1)

        } else {
            this.props.navigation.setParams({
                navRightPress: this._showHelpView,
                navTitlePress: this._showSwitchBlocksView,
                navcLTitle: this.state.current_gameName,
                navcSTitle: creditList.length <= 0 && (jsttag == 'lhc' || jsttag == 'k3' || jsttag == 'pcdd') ? '' : (wanfaidx == 0 ? '-官方玩法' : '-双面玩法'),
                navLeftPress: this._clearTouZhuList,
            });
        }
    }

    //所有彩种注数计算的方法
    _caculateAllPlayGame(selectballs, playData, titles) {

        if (Object.keys(selectballs).length <= 0) {
            this.setState({
                pickerZhuShu: 0,
            })
            return;
        
        } else {
            let parameter = {
                selectballs: selectballs, // 所选的号码
                titles: titles,  // 所有的title
                js_tag: this.state.current_js_tag,
                playData: playData, // 当前玩法的数据
            }

            // 返回注数的方法。
            let zhushu = CalcReturnParam.zhuShuReturnMethod(parameter);
            if (zhushu.ballArr != null) {
                // 单式的 要取有效的那注号码
                this.state.ballSelectData[Object.keys(this.state.ballSelectData)[0]] = zhushu.ballArr;
                if (zhushu.zhushu == 0) {
                    this.refs.Toast && this.refs.Toast.show('您输入号码不合法，请重新输入!', 1500);
                }
                this.setState({
                    pickerZhuShu: zhushu.zhushu,
                })
            } else {
                this.setState({
                    pickerZhuShu: zhushu,
                })
            }
        }
    }

    // 确定切换彩种的处理方法
    _changeCaiZhongHandle(gameId, gameData) {

        let gameName, tag, jstag, speed = '';
        if (gameData) {
            gameName = gameData['game_name'];
            tag = gameData['tag'];
            jstag = gameData['js_tag'];
            speed = gameData['speed'];
        } else {
            let gameDic = global.GameListConfigModel[`${gameId}`];
            gameName = gameDic['game_name'];
            tag = gameDic['tag'];
            jstag = gameDic['js_tag'];
            speed = gameDic['speed'];
        }

        this.state.prevList = []; // 切换，清空开奖的数据
        this.state.nextData = []; // 切换，清空倒计时数据
        this._fetchOpenInfoData(tag);
        this._fetchCountDownData(tag);

        this.state.current_gameName = gameName;

        this.state.wanfaindx = 1; // 重置.
        this.state.current_gameId = gameId; 
        // 以上两个值要在currentWafaAllPlayData赋值新数据之前改变。不然在buycenter里面很可能崩馈。

        this.state.isLoadPeilv = false;  // 加载赔率是否成功。

        //切换后，请求新的数据。
        let isLogin = global.UserLoginObject.Uid && global.UserLoginObject.Token; // 是否登录
        this._requestPeilvConfig(gameId, jstag, isLogin ? true : false); // 请求赔率
       
        
        global.CurrentQiShu = 0; // 切换重置

        this._currentPlayData(jstag);

        this.setState({
            isShowGameView: false,
            pickerZhuShu: 0,
            totalPrice: 0.00,
            ballSelectData: {},
            titles: [],
            current_tag: tag,
            current_js_tag: jstag,
            current_speed: speed,
            shopCarZhushuNum: 0, //切换彩种后购物车的num置为0；
        });
    }

 render() {

        let iphoneX = global.iOS ? (SCREEN_HEIGHT == 812 ? true : false) : 0; //是否是iphoneX

        //六合彩与别的彩种底部工具栏高度不同
        let bottomToolHeight = 50; // = this.state.current_tag == 'xglhc' ? 50 : 80;
        //号码为多排时高度要变高
        let headerToolHeight = 110;
        let iphoneXBottomHeight = iphoneX ? 60 : 0;

        const {navigate} = this.props.navigation;
        return (
            <View style={styles.container}>
                {this.state.isShowLoad == false && this.state.isLoadPeilv? (<View style={{flex: 1}}>
                        <View style={styles.container}>
                            <View style={styles.scrollViewContainer}>
                                {/*购彩界面*/}
                                <BuyCenter
                                    key={this.state.wanfaindx * 100 + parseInt(this.state.current_gameId)}
                                    style={{marginTop: 110, height: SCREEN_HEIGHT - headerToolHeight - 64  - bottomToolHeight - iphoneXBottomHeight }}
                                    wafaDataArr={this.state.currentWafaAllPlayData}
                                    peilvDataArr={this.state.peilvDataArr}
                                    js_tag={this.state.current_js_tag}
                                    tag={this.state.current_tag}
                                    wanfaindex={this.state.wanfaindx}
                                    speed={this.state.current_speed}
                                    shopCarZhushuNum={this.state.shopCarZhushuNum}
                                    ballsClick={(ballSelectDatas, playData, titleArr, ballArr) => {

                                        this.state.ballSelectData = ballSelectDatas; // 不用setState赋值。
                                        // 选号回调到这里。
                                        this.setState({
                                            currentPlayData: playData,
                                            titles: titleArr,
                                            ballArr: ballArr,
                                        });
                                        //每次回调传入号码和标题参数
                                        this._caculateAllPlayGame(ballSelectDatas, playData, titleArr);
                                    }}
                                    shopCarClick={(playData, titleArr, ballArr) => {
                                        // 购物车
                                        if (global.ShopHistoryArr.length > 0) {

                                            PushNotification.emit('DidGoToShopCarDetailVC');
                                            PushNotification.emit('ClearAllBalls'); // 进入购物车时 清空已选的号码
                                            
                                            let playDataModel = {
                                                tag: this.state.current_tag,
                                                js_tag: this.state.current_js_tag,
                                                gameid: this.state.current_gameId,
                                                speed: this.state.current_speed,
                                                playData: playData,
                                                titles: titleArr,
                                                ballsArr: ballArr, // 随机的号码，从这里选出来
                                                peilvDataArr: this.state.peilvDataArr, // 当前玩法的赔率
                                            };
                                            navigate('ShopCarView', { title: '投注列表', dataModelArr: global.ShopHistoryArr, playDataModel: playDataModel,leaveTime: currentTime, fengPanTime: currentFengPan, nextTimeList: this.state.nextData});

                                        } else {
                                            this.refs.Toast && this.refs.Toast.show('您的购物车空空如也！', 1000);
                                            if (this.state.shopCarZhushuNum > 0) {
                                                this.setState({
                                                    shopCarZhushuNum: 0,
                                                });
                                            }
                                        }
                                    }}
                                >
                                </BuyCenter>
                            </View>

                            {/*头部View*/}
                            <NewOpenInfoHeader
                                style={{ position: 'absolute', left: 0, top: 0 }}
                                key={this.state.current_gameId}
                                tag = {this.state.current_tag}
                                js_tag = {this.state.current_js_tag}
                                speed = {this.state.current_speed}
                                nextTimeList={this.state.nextData ? this.state.nextData : []}
                                getCurrentTime={(timeStr) => currentTime = timeStr}
                                getCurrentFengPan={(fengPanStr) => currentFengPan = fengPanStr}
                                prevList={this.state.prevList ? this.state.prevList : []}
                                isLock = {this.state.isLockTouZhu}
                                isRefreshLockStatues = {(isLock) => {
                                    if (this.state.isLockTouZhu != isLock) {
                                        this.setState({
                                            isLockTouZhu:isLock
                                        });
                                    }
                                }}>
                            </NewOpenInfoHeader>

                            <SelectGameView
                                currentGameid={this.state.current_gameId}
                                isClose={this.state.isShowGameView && global.AllPlayGameList.length > 0}
                                close={() => {
                                    this.setState({
                                        isShowGameView: false,
                                    })
                                }}

                                caiZhongClick={(gameData) => {

                                    if (this.state.current_gameName == gameData.game_name && this.state.currentWafaAllPlayData.length > 0) {
                                        this.setState({
                                            isShowGameView: false,
                                        })
                                        return; // 选择相同 直接退出
                                    }

                                    if (global.ShopHistoryArr.length > 0) {
                                        Alert.alert('提示', '您的购物车已有投注，切换彩种会清空购物车！确定进行切换！',
                                            [
                                                {
                                                    text: '取消', onPress: () => {
                                                    }
                                                },
                                                {
                                                    text: '确定', onPress: () => {
                                                        global.ShopHistoryArr = [];
                                                        global.BeiShu = '1';     //重新初始化，防止下次进来计算出错
                                                        global.ZhuiQiShu = '1';
                                                        PushNotification.emit('ClearShopCarOffNotification');  //清空购物车，屏蔽查看购物车按钮的通知

                                                        this._changeCaiZhongHandle(gameData.game_id, gameData);
                                                    }
                                                }
                                            ]);

                                    } else {
                                        this._changeCaiZhongHandle(gameData.game_id, gameData);
                                    }
                                }}
                            >
                            </SelectGameView>
                            {this.state.isShowSwitchBlocksView ?
                                <NewGuanFangXinYongView
                                    isClose={this.state.isShowSwitchBlocksView}
                                    slectIndex = {this.state.wanfaindx}
                                    close={() => {
                                        this.setState({
                                            isShowSwitchBlocksView: false,
                                        })
                                    }}
                                    onChange={(currentIndex) => {

                                        let curData = this.state.allPlayData[currentIndex]; // 没有数据 就提示未开放吧。
                                        if (curData && curData.length <= 0) {
                                            this.refs.Toast && this.refs.Toast.show(currentIndex == 1 ? '双面玩法暂无数据' : '官方玩法暂无数据', 1500);
                                            this.setState({
                                                isShowSwitchBlocksView: false,
                                            })
                                            if (this.state.allPlayData[0].length <= 0 && this.state.allPlayData[1].length <= 0) {
                                                // 双面 官方都关闭了的 可以切换按钮。
                                                this.state.wanfaindx = currentIndex;
                                                this.props.navigation.setParams({
                                                    navcSTitle: currentIndex == 0 ? '-官方玩法': '-双面玩法',
                                                });
                                            }
                                            return;
                                        }

                                        this.state.wanfaindx = currentIndex; // 改变了wanfaindx，再从allPlayData里拿对应的玩法数据。
                                        this.setState({
                                            pickerZhuShu: 0,
                                            totalPrice: 0.00,
                                            ballSelectData: {},
                                            titles: [],
                                            isShowSwitchBlocksView: false,
                                            currentWafaAllPlayData: this.state.allPlayData[currentIndex],
                                            currentPlayData: this.state.allPlayData[currentIndex][0].submenu[0].playlist[0], // 默认彩种数据
                                        });
                                        this.props.navigation.setParams({
                                            navcSTitle: currentIndex == 0 ? '-官方玩法': '-双面玩法',
                                        });
                                    }}/> 
                                : null
                            }
                        </View>
                        <NewBottomView
                            style={{
                                marginBottom: iphoneX ? 34 : 0,
                                height: 50,
                                backgroundColor: '#1d1e1f',
                                flexDirection: 'row'
                            }}
                            isLock = {this.state.isLockTouZhu}
                            selectNumZhuShu={this.state.pickerZhuShu}
                            ClearCarClick={() => {
                                if (this.state.pickerZhuShu != 0 || Object.keys(this.state.ballSelectData).length > 0) {

                                    this.refs.Toast && this.refs.Toast.show('清空号码成功!', 1000);
                                    //只清空当前界面的号码
                                    PushNotification.emit('ClearAllBalls');
                                    this.setState({
                                        pickerZhuShu: 0,
                                        totalPrice: 0.00,
                                        ballSelectData: {},
                                    })
                                }
                            }}
                            TrendClick={() => {
                                if (trendClick) {
                                    trendClick = false;
                                    global.isInBuyLotVC = false;
                                    
                                    navigate('BuyTrend', {
                                        gameId: `${this.state.current_gameId}`,
                                        gameName: this.state.current_gameName,
                                        callbackGameid: (callGameId) => {
                                            this.isTrendCallBack = true;
                                            this._changeCaiZhongHandle(callGameId);
                                        }
                                    });
                                }
                                this.time = setTimeout(() => {
                                    trendClick = true;
                                }, 1000);
                            }}
                            GamePlayClick={() => {

                                Alert.alert(' ', `范例：${this.state.currentPlayData.play_fanli}\n\n玩法说明：${this.state.currentPlayData.play_shuoming}`, [{
                                    text: '确定',
                                    onPress: () => {
                                    }
                                }])
                            }}
                            XiaZhuClick={() => {
                                if (global.UserLoginObject.Token == '') {

                                    Alert.alert('提示', '您还未登录,请先去登录',
                                        [
                                            {
                                                text: '取消', onPress: () => {
                                                }
                                            },
                                            {
                                                text: '确定', onPress: () => {
                                                    navigate('Login', {title: '登录', isBuy: true});
                                                }
                                            },
                                        ])
                                } else if (global.CurrentQiShu == 0) {  //请求不到开奖期数时要拦截用户进入购物车

                                    Alert.alert('温馨提示', '当前投注期数为空,是否重新请求数据!', [{text:'是', onPress: ()=>{
                                        this._fetchCountDownData(this.state.current_tag);
                                    }}, {text:'否', onPress: ()=> {

                                    }}]);

                                }
                                else {

                                    let zhushu = this.state.pickerZhuShu;
                                    //没有选择号码时不能弹出视图
                                    if (zhushu > 0) {
                                        let shopModelArr = this._handleTouZhuBalls((Number.parseInt || parseInt)(zhushu, 10) * 2, 2, zhushu);
                                        this.setState({
                                            ballsNumPinJieArr: shopModelArr,
                                            isShowShopAlertView: true,
                                        });
                                    } else {
                                        Alert.alert('提示', '请选择号码!', [{
                                            text: '确定', onPress: () => {
                                            }
                                        }])
                                    }
                                }
                            }}
                        >
                        </NewBottomView>
                        <NewAllenShopAlertView
                            playData={this.state.currentPlayData}
                            caiZhongName={this.state.current_gameName}
                            qiShuNum={global.CurrentQiShu}
                            visiable={this.state.isShowShopAlertView}
                            pickZhuShu={this.state.pickerZhuShu}
                            dataArr={this.state.ballsNumPinJieArr}
                            jstag={this.state.current_js_tag}
                            isGF={this.state.wanfaindx}
                            closeClick={() => {
                                this.setState({isShowShopAlertView: false})
                            }}
                            addToShopCarClick={(data) => {
                                // 加入购物车
                                global.ShopHistoryArr = [...data, ...global.ShopHistoryArr];

                                //清空当前界面的号码
                                PushNotification.emit('ClearAllBalls');
                                this.setState({
                                    shopCarZhushuNum: global.ShopHistoryArr.length, 
                                    isShowShopAlertView: false,
                                    pickerZhuShu: 0,
                                    totalPrice: 0.00,
                                    ballSelectData: {},
                                })

                                // 进入购物车
                                PushNotification.emit('DidGoToShopCarDetailVC');
                                let playDataModel = {
                                    tag: this.state.current_tag,
                                    js_tag: this.state.current_js_tag,
                                    gameid: this.state.current_gameId,
                                    speed: this.state.current_speed,
                                    playData: this.state.currentPlayData, //playData,
                                    titles: this.state.titles,
                                    ballsArr: this.state.ballArr,  // 随机的号码，从这里选出来
                                    peilvDataArr: this.state.peilvDataArr, // 当前玩法的赔率
                                };
                                navigate('ShopCarView', { title: '投注列表', dataModelArr: global.ShopHistoryArr, playDataModel: playDataModel,leaveTime: currentTime, fengPanTime: currentFengPan, nextTimeList: this.state.nextData });

                            }}
                            comformBuyClick={(data,qishu,beishu) => {
                                // 确定购买
                                this.setState({
                                    isShowShopAlertView: false,
                                })
                            }}/>
                    </View>)
                    : (<View style={{
                        backgroundColor: 'rgba(255,255,255,1)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1
                    }}>

                        <Image
                            source={require('../img/ic_buy_buy_frist.png')}
                            style={{resizeMode: 'stretch', width: SCREEN_WIDTH, height: SCREEN_HEIGHT - 49 - 64}}
                        />
                        <ActivityIndicator size="small" style={{
                            position: 'absolute',
                            left: SCREEN_WIDTH / 2 - 18,
                            top: SCREEN_HEIGHT / 2 - 18
                        }}/>
                    </View>)
                }
                <Toast ref="Toast" position='center'/>
                <LoadingView ref='LoadingView'/>
                <RNAlert comformBtnTitle={'确定'} cancleBtnTitle={'取消'} comformClik={() => {this._reasetLotView(); isRemindJieZhi = false;}} dissmissClick={() => {isRemindJieZhi = false;}} ref='RNAlert' alertTitle={'提示'} alertContent={'本期倒计时截止' + '\n' + '是否清空购物车'}/>
                {this._isShowGuideView()} 
            </View>
        );
    }

    _isShowGuideView() {

        let image1 = [require('../img/xhnf5s1.png'), require('../img/xhnf71.png'), require('../img/xhnf7p1.png'), require('../img/xhnfX1.png')];

        let idx = 3;
        if (SCREEN_HEIGHT == 568) {
            idx = 0;
        } else if (SCREEN_HEIGHT == 667) {
            idx = 1;
        } else if (SCREEN_HEIGHT == 736) {
            idx = 2;
        }

        return (
            <Modal
              visible={this.state.isShowGuide1}
              animationType={'none'}
              transparent={true}
              onRequestClose={() => { }}
              >
                <TouchableOpacity activeOpacity={1}
                  onPress = {() => {
                      
                        this.setState({
                            isShowGuide1: false,
                        })

                        global.TouZhuGuide = 0;
                        let datas = JSON.stringify(0);
                        AsyncStorage.setItem('TouZhuGuidekey', datas, (error) => { });
                    
                  }}>
                    <Image style={{resizeMode: 'contain', width: SCREEN_WIDTH, height: SCREEN_HEIGHT}}
                        source={image1[idx]}>
                    </Image>
                </TouchableOpacity>
            </Modal>
        )
    }

    //（投注号码拼接及投注所需要的参数）
    _handleTouZhuBalls(totalPrice, singlePrice, pickerZhuShu) {

        let {ballSelectData, currentPlayData, peilvDataArr, current_js_tag, current_tag, current_gameId, titles} = this.state;
        let params = {
            ballsData: ballSelectData,  //当前选择的号码，可能包含赔率 或`%{title}0`
            playData: currentPlayData,  // 当前玩法的数据
            peilvDataArr: peilvDataArr, // 当前玩法的赔率
            js_tag: current_js_tag,     // 当前js_tag
            tag: current_tag,           // 当前tag
            gameid: current_gameId,     // gameid 要取current_gameId，不能从playData拿，因为它是缓存的，拿它会出错的
            titles: titles,             // 所有的titles
            totalPrice: (Number.parseFloat || parseFloat)(totalPrice, 10),
            singlePrice: (Number.parseFloat || parseFloat)(singlePrice, 10),
            zhushu: (Number.parseInt || parseInt)(pickerZhuShu),
            qishu: global.CurrentQiShu,
        }

        // 判断是不是六合彩。
        if (current_js_tag == "lhc") {
            return CalcReturnParam.getLHCTuoZhuParam(params);
        } else {
            return CalcReturnParam.getTuoZhuParam(params);
        }
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f3f3f3',
    },

    scrollViewContainer: {
        width: SCREEN_WIDTH,
        backgroundColor: '#f3f3f3',
        position: 'absolute',
        top: 0,
        left: 0,
    },

});


export default BuyLotDetail;
