
/**
 Created by Money on 2018/05/30
 所有玩法 选号中心
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    ActivityIndicator,
    ImageBackground,
    Image,
} from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import Moment from 'moment';

import FBGameBottom from './FBGameBottom';  // 底部
import ItemView_LName_RPeilv from '../NewAllGame/ItemView_LNameRPeilv';  //左队名，右边赔率的视图
import ItemView_HLRView from '../NewAllGame/ItemView_HaflView';  //左右对称视图,单个视图为左描述右赔率
import ItemView_TCSView from '../NewAllGame/ItemView_TCSView';  //三列布局的视图
import ItemView_GLTGOE from  '../NewAllGame/ItemView_GLTGOE';   //两列布局的视图
import ScorceZHBottom from '../../footballTool/ScorceSpecailBottomView'; // 综合过关底部
import PanKouChangeTool from  '../../footballTool/ScorcePanKouPeilvChange'; //盘口转换的工具类

let lastTabIdx = -1;
export default class FBAllGameCenter extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,  // 是否显示加载框
            loadTitle: '请求中...',
            isHaveData: true, // 是否有数据
            bet_data: {},  // 请求的数据
            sltBallData: [],  // 选择的号码, [字典]
            oldBallData: [],  // 上次选的
            allSltDic: props.superAllSltDic, // 综合过关 在进入所有玩法时 选择的号码数据。
            beiginTime:'', //比赛开始的时间(非滚球时显示)
            rollingTime:'',//滚球中的时间
        };

        lastTabIdx = props.tabIdx;
    }

    componentDidMount() {
        this._getSportAllBetMethod();

        // 刷新通知。
        this.refreshGame = PushNotification.addListener('RefreshAllGame', () => {
            this.setState({
                loadTitle: '请求中...',
                isLoading: true,
            })
            this._getSportAllBetMethod(true);
        });

        // 清空号码的通知
        this.clearNotify = PushNotification.addListener('ClearFootBallGameViewBallNotification', () => {
            // 坑爹 不能直接 = {} 赋空。 只能这样按key删除清空了。
            delete this.props.superSltDic.d_key;
            delete this.props.superSltDic.sltIdx;

            this.setState({
                allSltDic: {},  // 清空。
                oldBallData: this.state.sltBallData, // 清空时，要用到old_keys
                sltBallData: [],
            })
        });

        this.subscription = PushNotification.addListener('FBShopCarXiaZhuSuccessNotification', () => {
            this.refs.Toast && this.refs.Toast.show('下注成功!', 2000);  // 综合过关 从所有玩法进入购物车下注成功
        });
    }

    componentWillReceiveProps(nextProps) {
        // 切换tabbar时 要清空已选数据  请求新数据
        if (lastTabIdx != nextProps.tabIdx) {
            lastTabIdx = nextProps.tabIdx;

            if (nextProps.tabIdx == 1 && nextProps.superSltDic.d_key != null) {
                this.showSuperDic = true;
                this.state.oldBallData = [];
                this.state.sltBallData = [];

            } else {
                this.state.oldBallData = this.state.sltBallData;  // 清空时，要用到old_keys
                this.state.sltBallData = [];
            }
        }
    }

    //移除组件
    componentWillUnmount() {
        if (typeof (this.refreshGame) == 'object') {
            this.refreshGame && this.refreshGame.remove();
        }

        if (typeof (this.clearNotify) == 'object') {
            this.clearNotify && this.clearNotify.remove();
        }

        if (typeof (this.subscription) == 'object') {
            this.subscription && this.subscription.remove();
        }
        // 若组件被卸载，刷新state则直接返回
        this.setState = (state, callback) => {
            return;
        }
    }

    _getSportAllBetMethod(refresh) {

        let params = new FormData();
        params.append("ac", "getSportAllBetMethod");
        params.append("game_type", this.props.game_type);
        params.append("sport_key", 'FT');
        params.append("hg_id", this.props.hg_id);
        params.append("play_group", 0); // 0:所有盤口, 1:讓球 & 大小盤口, 2:上半場盤口, 3: 比分盤口, 4:主盤口, 5:進球盤口, 6:其他盤口

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((response) => {

                if (response.msg == 0) {

                    let newData = this._handleAllGamePanKou(response.data.bet_data);

                    this.setState({
                        bet_data: newData,
                        beiginTime:response.data.begin_time,
                        rollingTime:response.data.rolling_time,
                        isLoading: false,
                        isHaveData: Object.keys(response.data.bet_data).length > 0 ? true : false,
                        isRefresh: refresh ? refresh : false,
                    })
                } else {
                    this.setState({
                        bet_data: {},
                        isLoading: false,
                        isHaveData: false,
                    })
                    this.refs.Toast && this.refs.Toast.show(response.param, 2000);
                }
            })
            .catch((err) => {
                this.setState({
                    isLoading: false,
                    isHaveData: false,
                })
            })
    }

    //下注方法
    _xiaZhuMethod(paramData) {

        if (this.tempParamData == paramData) {
            console.log('相同了。不给投。。。');
            return;
        } else {
            console.log('不相同。开始投。。。。');
            this.tempParamData = paramData;  // 把这个要提交投注的数据记下来。防止点多次了 投重复的。
        }

        this.setState({
            loadTitle: '下注中...',
            isLoading: true,
        })

        let params = new FormData();
        params.append('ac', 'betSport');
        params.append('token', global.UserLoginObject.Token);
        params.append('uid', global.UserLoginObject.Uid);
        params.append('sessionkey', global.UserLoginObject.session_key);
        params.append('ver', global.VersionNum);
        params.append('payment_methods', 0);  //默认余额支付
        params.append('game_type', this.props.game_type); //gameType 0 默认滚球,1今日，2早盘
        params.append('play_group',this.props.play_group); //playgroup 0让球，4综合过关,5冠军
        params.append('is_better', paramData.is_better ? 1 : 0);  // 接受最佳赔率
        params.append('data', JSON.stringify(paramData.data));

        console.log('所有玩法下注参数：', params);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((response) => {
                console.log('所有玩法下注结果：', response);

                if (response.msg != 0) {
                    this.tempParamData = [];  // 不成功的，要重置
                }

                if (response.msg == 0 && response.data) {
                    global.UserLoginObject.TotalMoney = response.data.price;
                    this.refs.Toast && this.refs.Toast.show('下注成功!', 1000);
                    
                    // 清空选号内容
                    this.state.oldBallData = this.state.sltBallData;  // 清空时，要用到old_keys
                    this.state.sltBallData = [];

                } else if (response.msg == 50012) {
                    Alert.alert('温馨提示', '您的余额不足，是否前往充值',
                        [
                            { text: '确定', onPress: () => { this.props.navigation.navigate('RechargeCenter') } },
                            { text: '取消', onPress: () => { } },
                        ],
                    )

                } else {
                    this.refs.Toast && this.refs.Toast.show(response.param, 1000);
                }

                this.setState({
                    isLoading: false,
                })
            })
            .catch((err) => {
                this.refs.Toast && this.refs.Toast.show('下注失败！', 1000);
                this.setState({
                    isLoading: false,
                })
            })
    }

    //处理所有玩法的HC,HHC,GL,HGL的盘口的赔率
    _handleAllGamePanKou(data){

        if (Object.keys(data).length != 0){

            let HCData = data.HC ? data.HC : null;
            let HHCData = data.HHC ? data.HHC : null;
            let GLData = data.GL ? data.GL : null;
            let HGLData = data.HGL ? data.HGL : null;

            //让分的盘口赔率处理
            if (HCData){

                let hchDataArr = HCData.H;
                let hcvDataArr = HCData.V;

                for (let i = 0 ; i < hchDataArr.length; i++){

                    let hchModel = hchDataArr[i];

                    hchModel.HK = hchModel.p; //让分HC主香港盘的赔率
                    hchModel.IND = PanKouChangeTool.getScorcePankouChangePeilv(hchModel.p, '印尼盘');//让分HC主印尼盘的赔率
                    hchModel.MY = PanKouChangeTool.getScorcePankouChangePeilv(hchModel.p, '马来盘');//让分HC主马来盘的赔率
                    hchModel.DEC = PanKouChangeTool.getScorcePankouChangePeilv(hchModel.p, '欧洲盘');//让分HC主欧洲盘的赔率
                }


                for (let j = 0 ; j < hcvDataArr.length; j++){

                    let hcvModel = hcvDataArr[j];

                    hcvModel.HK = hcvModel.p; //让分HC客香港盘的赔率
                    hcvModel.IND = PanKouChangeTool.getScorcePankouChangePeilv(hcvModel.p, '印尼盘');//让分HC客印尼盘的赔率
                    hcvModel.MY = PanKouChangeTool.getScorcePankouChangePeilv(hcvModel.p, '马来盘');//让分HC客马来盘的赔率
                    hcvModel.DEC = PanKouChangeTool.getScorcePankouChangePeilv(hcvModel.p, '欧洲盘');//让分HC客欧洲盘的赔率
                }
            }

            //半场让分的盘口赔率处理
            if (HHCData){

                let hhchDataArr = HCData.H;
                let hhcvDataArr = HCData.V;

                for (let i = 0 ; i < hhchDataArr.length; i++){

                    let hchModel = hhchDataArr[i];

                    hchModel.HK = hchModel.p; //让分HC主香港盘的赔率
                    hchModel.IND = PanKouChangeTool.getScorcePankouChangePeilv(hchModel.p, '印尼盘');//让分HC主印尼盘的赔率
                    hchModel.MY = PanKouChangeTool.getScorcePankouChangePeilv(hchModel.p, '马来盘');//让分HC主马来盘的赔率
                    hchModel.DEC = PanKouChangeTool.getScorcePankouChangePeilv(hchModel.p, '欧洲盘');//让分HC主欧洲盘的赔率
                }


                for (let j = 0 ; j < hhcvDataArr.length; j++){

                    let hcvModel = hhcvDataArr[j];

                    hcvModel.HK = hcvModel.p; //让分HC客香港盘的赔率
                    hcvModel.IND = PanKouChangeTool.getScorcePankouChangePeilv(hcvModel.p, '印尼盘');//让分HC客印尼盘的赔率
                    hcvModel.MY = PanKouChangeTool.getScorcePankouChangePeilv(hcvModel.p, '马来盘');//让分HC客马来盘的赔率
                    hcvModel.DEC = PanKouChangeTool.getScorcePankouChangePeilv(hcvModel.p, '欧洲盘');//让分HC客欧洲盘的赔率
                }
            }

            //大小的盘口赔率处理
            if (GLData){

                let glovDataArr = GLData.OV;
                let glunDataArr = GLData.UN;

                for (let i = 0 ; i < glovDataArr.length; i++){

                    let glovModel = glovDataArr[i];

                    glovModel.HK = glovModel.p; //让分HC主香港盘的赔率
                    glovModel.IND = PanKouChangeTool.getScorcePankouChangePeilv(glovModel.p, '印尼盘');//让分HC主印尼盘的赔率
                    glovModel.MY = PanKouChangeTool.getScorcePankouChangePeilv(glovModel.p, '马来盘');//让分HC主马来盘的赔率
                    glovModel.DEC = PanKouChangeTool.getScorcePankouChangePeilv(glovModel.p, '欧洲盘');//让分HC主欧洲盘的赔率
                }


                for (let j = 0 ; j < glunDataArr.length; j++){

                    let glunModel = glunDataArr[j];

                    glunModel.HK = glunModel.p; //让分HC客香港盘的赔率
                    glunModel.IND = PanKouChangeTool.getScorcePankouChangePeilv(glunModel.p, '印尼盘');//让分HC客印尼盘的赔率
                    glunModel.MY = PanKouChangeTool.getScorcePankouChangePeilv(glunModel.p, '马来盘');//让分HC客马来盘的赔率
                    glunModel.DEC = PanKouChangeTool.getScorcePankouChangePeilv(glunModel.p, '欧洲盘');//让分HC客欧洲盘的赔率
                }

            }

            //半场大小的盘口赔率处理
            if (HGLData){

                let hglovDataArr = GLData.OV;
                let hglunDataArr = GLData.UN;

                for (let i = 0 ; i < hglovDataArr.length; i++){

                    let glovModel = hglovDataArr[i];

                    glovModel.HK = glovModel.p; //让分HC主香港盘的赔率
                    glovModel.IND = PanKouChangeTool.getScorcePankouChangePeilv(glovModel.p, '印尼盘');//让分HC主印尼盘的赔率
                    glovModel.MY = PanKouChangeTool.getScorcePankouChangePeilv(glovModel.p, '马来盘');//让分HC主马来盘的赔率
                    glovModel.DEC = PanKouChangeTool.getScorcePankouChangePeilv(glovModel.p, '欧洲盘');//让分HC主欧洲盘的赔率
                }


                for (let j = 0 ; j < hglunDataArr.length; j++){

                    let glunModel = hglunDataArr[j];

                    glunModel.HK = glunModel.p; //让分HC客香港盘的赔率
                    glunModel.IND = PanKouChangeTool.getScorcePankouChangePeilv(glunModel.p, '印尼盘');//让分HC客印尼盘的赔率
                    glunModel.MY = PanKouChangeTool.getScorcePankouChangePeilv(glunModel.p, '马来盘');//让分HC客马来盘的赔率
                    glunModel.DEC = PanKouChangeTool.getScorcePankouChangePeilv(glunModel.p, '欧洲盘');//让分HC客欧洲盘的赔率
                }
            }
        }

        return data;
    }


    _allGameView() {

        if (Object.keys(this.state.bet_data).length <= 0) {
            return null;
        }

        let refresh = this.state.isRefresh ? true : false;  // 为true一定刷新界面，主要是刷新显示的赔率
        this.state.isRefresh = false; // 执行一次后，一定设为false

        let showSuperD = this.showSuperDic ? true : false;  // 为true一定重置界面的选择状态 为poprs.superSltDic的值。
        this.showSuperDic = false;  // 执行一次后，一定设为false

        let old_keys = [refresh, showSuperD];  // 懒得再写几个变量传到itemView_ 去了，所有直接用这个吧 这两个元素，含义在上面。
        for (let a = 0; a < this.state.oldBallData.length; a++) {
            old_keys.push(this.state.oldBallData[a]['d_key']);
        }

        let sltkey = this.state.sltBallData[0] ? this.state.sltBallData[0]['d_key'] : '';
        if (this.props.tabIdx == 1 && showSuperD && this.props.superSltDic.d_key) {
            // 如果.superSltDic['d_key'] 的值存在，那就用它。
            sltkey = this.props.superSltDic.d_key;
        }

        return (
            <View>
                {/*让球*/}
                {this._LNameRPeilv('HC', old_keys, sltkey)}
                {/*半场让球*/}
                {this._LNameRPeilv('HHC', old_keys, sltkey)}
                {/*大小*/}
                {this._HaflView('GL', old_keys, sltkey)}
                {/*半场大小*/}
                {this._HaflView('HGL', old_keys, sltkey)}
                {/*独赢*/}
                {this._LNameRPeilv('1X2', old_keys, sltkey)}
                {/*半场独赢*/}
                {this._LNameRPeilv('H1X2', old_keys, sltkey)}
                {/*波胆*/}
                {this._TCSView('TCS', old_keys, sltkey)}
                {/*半场波胆*/}
                {this._TCSView('HTCS', old_keys, sltkey)}
                {/*总进球数*/}
                {this._GLTGOEView('TG', old_keys, sltkey)}
                {/*半场总进球数*/}
                {this._GLTGOEView('HTG', old_keys, sltkey)}
                {/*双方球队进球*/}
                {this._HaflView('BTS', old_keys, sltkey)}
                {/*半场双方球队进球*/}
                {this._HaflView('HBTS', old_keys, sltkey)}
                {/*球队进球数: 主 - 大/小*/}
                {this._HaflView('GLH', old_keys, sltkey)}
                {/*球队进球数: 客 - 大/小*/}
                {this._HaflView('GLV', old_keys, sltkey)}
                {/*球队进球数: 主 - 大/小 - 上半场*/}
                {this._HaflView('HGLH', old_keys, sltkey)}
                {/*球队进球数: 客 - 大/小 - 上半场*/}
                {this._HaflView('HGLV', old_keys, sltkey)}
                {/*单双*/}
                {this._HaflView('TGOE', old_keys, sltkey)}
                {/*半场单双*/}
                {this._HaflView('HTGOE', old_keys, sltkey)}
                {/*半场 / 全场*/}
                {this._LNameRPeilv('HFT', old_keys, sltkey)}
                {/*净胜球数*/}
                {this._LNameRPeilv('WM', old_keys, sltkey)}
                {/*双重机会*/}
                {this._LNameRPeilv('DC', old_keys, sltkey)}
                {/*零失球*/}
                {this._LNameRPeilv('CNS', old_keys, sltkey)}
                {/*零失球获胜*/}
                {this._LNameRPeilv('WTN', old_keys, sltkey)}
                {/*独赢&双方进球*/}
                {this._LNameRPeilv('1X2BTS', old_keys, sltkey)}
                {/*独赢 & 进球 / 大小*/}
                {this._TCSView('1X2GL', old_keys, sltkey)}
                {/*进球大/ 小 & 双方球队进球*/}
                {this._GLTGOEView('GLBTS', old_keys, sltkey)}
                {/*独赢&最先进球*/}
                {this._LNameRPeilv('1X2FG', old_keys, sltkey)}
                {/*先进2球的一方*/}
                {this._HaflView('R2G', old_keys, sltkey)}
                {/*先进3球的一方*/}
                {this._HaflView('R3G', old_keys, sltkey)}
                {/*最多进球的半场*/}
                {this._LNameRPeilv('HMG', old_keys, sltkey)}
                {/*双半场进球*/}
                {this._LNameRPeilv('SBH', old_keys, sltkey)}
                {/*首个进球方式*/}
                {this._LNameRPeilv('FGM', old_keys, sltkey)}
                {/*首个进球时间*/}
                {this._LNameRPeilv('TFG', old_keys, sltkey)}
                {/*首个进球时间-3项*/}
                {this._LNameRPeilv('TFG3W', old_keys, sltkey)}
                {/*双重机会 & 进球/大小*/}
                {this._TCSView('DCGL', old_keys, sltkey)}
                {/*双重机会 & 双方球队进球*/}
                {this._LNameRPeilv('DCBTS', old_keys, sltkey)}
                {/*双重机会 & 最先进球*/}
                {this._LNameRPeilv('DCFTS', old_keys, sltkey)}
                {/*进球大 / 小 & 进球单 / 双*/}
                {this._GLTGOEView('GLTGOE', old_keys, sltkey)}
                {/*进球大/ 小 & 最先进球*/}
                {this._GLTGOEView('GLFTS', old_keys, sltkey)}
                {/*落后反超获胜*/}
                {this._LNameRPeilv('WFB', old_keys, sltkey)}
                {/*赢得任一半场*/}
                {this._LNameRPeilv('WEH', old_keys, sltkey)}
                {/*赢得所有半场*/}
                {this._LNameRPeilv('WBH', old_keys, sltkey)}
                {/*最先 / 最后进球*/}
                {this._LNameRPeilv('FLG', old_keys, sltkey)}
            </View>
        )
    }

    _handleSltData(key, ballData) {
        console.log('当前点击数据 == ', key, ' == ', ballData, this.state.bet_data[key]);

        if (this.props.tabIdx == 1 && ballData[0].d_key != null) {
            // 综合过关 你妹的坑货
            let dkey = ballData[0].d_key;

            // 有选择号码后。改变它的值。
            this.props.superSltDic.d_key = dkey;
            this.props.superSltDic.sltIdx = ballData[0].sltIdx;
            /////////////////////////

            let sltDic = {};
            // 这样把superBackup的值赋给 sltDic，可以说是浅拷贝；如果sltDic = superBackup 这样给sltDic赋值的话，在下面代码改变sltDic的值时，superBackup也会跟着变。
             Object.assign(sltDic, this.props.superBackupSltDic);

            sltDic['k'] = ballData[0].k;
            sltDic['p'] = ballData[0].p;
            sltDic['playMethod'] = dkey;
            sltDic['kTit'] = ballData[0].kTit ? ballData[0].kTit : ballData[0].k;
            sltDic['allbetSltIdx'] = ballData[0].sltIdx;  // 如果有多个让球大小时要用
            sltDic['is_all_method'] = '1';  // 所有玩法加这个字段

            let isNoFullT = dkey == 'HHC' || dkey == 'HGL' || dkey == 'H1X2' || dkey == 'HTCS' || dkey == 'HTG' || dkey == 'HBTS' || dkey == 'HGLH' || dkey == 'HGLV' || dkey == 'HTGOE' || dkey == 'HMG' || dkey == 'HMG1x2';
            if (isNoFullT) {
                sltDic['isFullTime'] = false;
            }

            if (dkey == '1X2' || dkey == 'H1X2' || dkey == 'HC' || dkey == 'HHC' || dkey == 'GL' || dkey == 'HGL' || dkey == 'TGOE' || dkey == 'HTGOE') {
                // 这几个dkey都是上一层有界面的
                if (dkey.includes('1X2') && ballData[0].sltIdx <= 2) {
                    sltDic['sltIdx'] = ballData[0].sltIdx;
                } else if (ballData[0].sltIdx <= 1) {

                    if (0) {
                        // 旧的进这里（独赢/让球/大小）
                        if (ballData[0].sltIdx == 0) {
                            if (dkey.includes('HC')) {
                                sltDic['sltIdx'] = 3;
                            } else if (dkey.includes('GL')) {
                                sltDic['sltIdx'] = 6;
                            } else if (dkey.includes('TGOE')) {
                                sltDic['sltIdx'] = 9;
                            }
                        } else {
                            if (dkey.includes('HC')) {
                                sltDic['sltIdx'] = 5;
                            } else if (dkey.includes('GL')) {
                                sltDic['sltIdx'] = 8;
                            } else if (dkey.includes('TGOE')) {
                                sltDic['sltIdx'] = 11;
                            }
                        }

                    } else {
                        // 新的进这里（让球/大小）
                        if (ballData[0].sltIdx == 0) {
                            if (dkey == 'HC') {
                                sltDic['sltIdx'] = 0;
                            } else if (dkey == 'GL') {
                                sltDic['sltIdx'] = 2;
                            }
                        } else {
                            if (dkey == 'HC') {
                                sltDic['sltIdx'] = 1;
                            } else if (dkey == 'GL') {
                                sltDic['sltIdx'] = 3;
                            }
                        }   
                    }
                }

                if (dkey.includes('1X2')) {
                    sltDic['isHVXO'] = ballData[0].k.toLowerCase();
                } else if (ballData[0].sltIdx % 2 == 0) {
                    sltDic['isHVXO'] = 'h';
                } else {
                    sltDic['isHVXO'] = 'v';
                }
            }

            // 到这呢 要把这个this.props.superAllSltDic回调回去。

            Object.assign(this.state.allSltDic, { [sltDic.sectionItemiId]: sltDic });
            this.props.zongheBackData ? this.props.zongheBackData(this.state.allSltDic, this.props.superSltDic) : null;

        } else if (this.props.tabIdx == 1 && ballData[0].d_key == null) {
            // 没有选择了，那就把他的值都干掉。
            delete this.props.superSltDic.d_key;
            delete this.props.superSltDic.sltIdx;
            ///////////////////

            // 没有选择，删除superAllSltDic对应的sectionItemiId
            let sectionItemiId = this.props.superBackupSltDic['sectionItemiId'];
            delete this.state.allSltDic[sectionItemiId];
            this.props.zongheBackData ? this.props.zongheBackData(this.state.allSltDic, this.props.superSltDic) : null;
        }


        this.setState({
            oldBallData: this.state.sltBallData, // 存之前的。
            sltBallData: ballData,  // 当前选择的。
        })
    }

    //HC,1x2, DC,HFT, CNS, WBH,WEH,SBH,的样式都是左队名右赔率
    _LNameRPeilv(key, old_keys, slt_key) {
        let data = this.state.bet_data[key];
        if (data == null) { return null };

        return (
            <ItemView_LName_RPeilv d_key={key} data={data} style={{b: styles.haderStyle }} nowGameData={this.props.nowGameData}
                slt_key={slt_key}
                old_keys={old_keys}
                superSltDic={this.props.superSltDic}
                selectPanKou={this.props.selectPanKou}
                ballClick={(ballData) => {
                    this._handleSltData(key, ballData);
                }}>
            </ItemView_LName_RPeilv>
        )
    }

    //GL,BTS,TGOE,GLTGOE 的样式。左右对称，视图为左描述右按钮的View
    _HaflView(key, old_keys, slt_key){

        let data = this.state.bet_data[key];
        if (data == null) { return null };

        return (
            <ItemView_HLRView d_key={key} data={data} style={{b: styles.haderStyle }} nowGameData={this.props.nowGameData}
                                   slt_key={slt_key}
                                   old_keys={old_keys}
                                   selectPanKou={this.props.selectPanKou}
                                   superSltDic={this.props.superSltDic}
                                   ballClick={(ballData) => {
                                       this._handleSltData(key, ballData);
                                   }}>
            </ItemView_HLRView>
        )
    }

    //TCS, 1X2GL, DCGL 的样式.三列Item布局的样式
    _TCSView(key, old_keys, slt_key){

        let data = this.state.bet_data[key];
        if (data == null) { return null };

        return (
            <ItemView_TCSView d_key={key} data={data} style={{b: styles.haderStyle }} nowGameData={this.props.nowGameData}
                              slt_key={slt_key}
                              old_keys={old_keys}
                              superSltDic={this.props.superSltDic}
                              ballClick={(ballData) => {
                                  this._handleSltData(key, ballData);
                              }}>
            </ItemView_TCSView>
        )
    }

    //GLTGOE, GLFTS的样式,两列Item布局的样式
    _GLTGOEView(key, old_keys, slt_key){

        let data = this.state.bet_data[key];
        if (data == null) { return null };

        return (
            <ItemView_GLTGOE d_key={key} data={data} style={{b: styles.haderStyle }} nowGameData={this.props.nowGameData}
                              slt_key={slt_key}
                              old_keys={old_keys}
                              superSltDic={this.props.superSltDic}
                              ballClick={(ballData) => {
                                  this._handleSltData(key, ballData);
                              }}>
            </ItemView_GLTGOE>
        )
    }

    render() {

        let isShowBottom = this.state.sltBallData.length > 0 && this.state.sltBallData[0].d_key != null ? true : false;

        // let isShowCorner = this.props.nowGameData.is_corner == 1 ? '(角球数) ' : '';
        let raceTime = ''; //比赛的时间。

        //滚球中
        if (this.props.game_type == 0){

            let splitArr = this.state.rollingTime.split(' '); //分割后台返回的时间字符串
            if (this.state.rollingTime.includes('1H')) {
                raceTime =  '上半场 ' + '   ' + splitArr[splitArr.length - 1]; //上半场
            } else if (this.state.rollingTime.includes('2H')) {
                raceTime =  '下半场 ' + '   ' + splitArr[splitArr.length - 1]; //下半场
            } else {
                raceTime = this.state.rollingTime;
            }
        }
        else {
            raceTime =  this.state.beiginTime;
        }

        return (
            <View style={{ flex: 1 }}>

                {this.state.isHaveData
                    ? <ScrollView style={{}}>
                        <ImageBackground style = {{width:SCREEN_WIDTH, height:135, alignItems:'center'}} source = {require('../../img/ic_football_result_detail.jpg')} resizeMode={'stretch'}>
                            <CusBaseText style = {{marginTop:15, backgroundColor: 'transparent', color:'#fff', fontSize:Adaption.Font(20,18)}}>
                                {this.props.leagueData}
                            </CusBaseText>
                            <View style = {{flexDirection:'row', alignItems:'center'}}>
                                <View style = {{flex:0.45, justifyContent:'center'}}>
                                    <CusBaseText style = {{textAlign: 'right',backgroundColor: 'transparent', color:'#fff', marginTop:15, fontSize:Adaption.Font(17,15)}}>
                                        {this.props.nowGameData.h}
                                    </CusBaseText>
                                </View>
                                <View style={{flex:0.1, marginTop:15, alignItems:'center'}}>
                                    <Image style={{width: Adaption.Width(30), height:  Adaption.Width(30), resizeMode:'contain'}} source={require('../../img/ic_football_result_vs.png')}/>
                                </View>
                                <View style = {{flex:0.45, justifyContent:'center'}}>
                                    <CusBaseText style = {{textAlign: 'left',backgroundColor: 'transparent', color:'#fff', marginTop:15, fontSize:Adaption.Font(17,15)}}>
                                        {this.props.nowGameData.v}
                                    </CusBaseText>
                                </View>
                            </View>
                            <View style = {{backgroundColor:'#29262d', width:Adaption.Width(180), height:35, marginTop:10, justifyContent:'center', alignItems:'center'}}>
                                <CusBaseText style = {{backgroundColor: 'transparent', color:'#fff', fontSize:Adaption.Font(15,12), marginLeft:5}}>
                                    {raceTime}
                                </CusBaseText>
                            </View>
                        </ImageBackground>
                        {this._allGameView()}
                        <View style={{ height: isShowBottom ? 90 : 0, marginBottom: SCREEN_HEIGHT == 812 ? 34 : 0 }} />
                    </ScrollView>

                    : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text allowFontScaling={false} style={{ fontSize: 30 }}>暂无数据！</Text>
                    </View>
                }

                {this.props.tabIdx != 1
                    ? <FBGameBottom style={{}}
                        isShowView={isShowBottom}  // 显示底部view
                        sport_id={this.props.sport_id}
                        game_type={this.props.game_type} // 0滚球、1今日、2早盘、3综合、4冠军
                        sltBallData={this.state.sltBallData}  // 选择的号码
                        nowGameData={this.props.nowGameData}  // 当前盘口的数据
                        selectPanKou={this.props.selectPanKou}
                        xiaZhuClick={(paramData) => {

                            if (global.UserLoginObject.Uid != '') {
                                this._xiaZhuMethod(paramData);  // 确定下注

                            } else {
                                Alert.alert('温馨提示', '您还未登录,请先去登录!',
                                    [
                                        { text: '取消', onPress: () => { } },
                                        { text: '确定', onPress: () => this.props.navigate('Login', { title: '登录' }) },
                                    ]
                                );
                            }
                        }}
                    >
                    </FBGameBottom>
                    : <ScorceZHBottom style={{ height: 50, marginBottom: SCREEN_HEIGHT == 812 ? 34 : 0 }}
                        PickDataDict={this.state.allSltDic}
                        NextStepOnPress={(pushDict) => {
                            if (global.UserLoginObject.Uid != '') {
                                if (pushDict) {
                                    this.props.navigate('FBShopCar', { navCountDownText: 10, dataDict: pushDict, gameType: this.props.game_type });
                                } else {
                                    this.refs.Toast && this.refs.Toast.show('下注内容不能为空!', 1000);
                                }
                            } else {
                                Alert.alert(
                                    '温馨提示', '您还未登录,请先去登录!',
                                    [
                                        { text: '取消', onPress: () => { } },
                                        { text: '确定', onPress: () => this.props.navigate('Login', { title: '登录' }) },
                                    ]
                                );
                            }
                        }}
                    />
                }

                {this.state.isLoading ? this._loadingView() : null}
                <Toast ref="Toast" position='center' />
            </View>
        )
    }

    _loadingView() {
        return (
            <View style={{ backgroundColor: 'rgba(0,0,0,0.6)', height: Adaption.Width(80), width: Adaption.Width(100), borderRadius: 5, justifyContent: 'center', alignItems: 'center', position: 'absolute', left: SCREEN_WIDTH / 2 - Adaption.Width(50), top: SCREEN_HEIGHT / 2 - Adaption.Width(150) }}>
                <ActivityIndicator color="white" />
                <Text style={{ marginTop: 10, fontSize: 14, color: 'white' }}>{this.state.loadTitle}</Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({

    // 每个itemview的头部样式
    haderStyle: {
        backgroundColor: '#f5f6f7',
        justifyContent: 'center',
        // alignItems: 'center',
        width: SCREEN_WIDTH, // 多减1为不挡住左右边线条
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        borderColor: '#d1d2d3',
        borderBottomWidth: 0.5,
        height:50,
        flexDirection:'row',
    },
})