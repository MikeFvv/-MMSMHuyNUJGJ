
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
} from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';

import ItemView_HC_GL from './ItemView_HC_GL';
import ItemView_1X2 from './ItemView_1X2';
import ItemView_TCS from './ItemView_TCS';
import ItemView_TG from './ItemView_TG';
import ItemView_TGOE from './ItemView_TGOE';
import ItemView_FLG from './ItemView_FLG';
import ItemView_1X2GL from './ItemView_1X2GL';
import ItemView_BTS from './ItemView_BTS';
import FBGameBottom from './FBGameBottom';  // 底部
import ScorceZHBottom from '../../footballTool/ScorceSpecailBottomView'; // 综合过关底部

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

            if (nextProps.game_type == 3 && nextProps.superSltDic.d_key != null) {
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
        params.append("play_group", this.props.tabIdx); // 0:所有盤口, 1:讓球 & 大小盤口, 2:上半場盤口, 3: 比分盤口, 4:主盤口, 5:進球盤口, 6:其他盤口

        console.log('所有玩法请求 params == ', params);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((response) => {
                console.log('所有玩法请求', response);
                if (response.msg == 0) {
                    this.setState({
                        bet_data: response.data.bet_data,
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
        params.append('game_type', this.props.game_type);
        params.append('is_better', paramData.is_better ? 1 : 0);  // 接受最佳赔率
        params.append('data', JSON.stringify(paramData.data));

        console.log('所有玩法下注参数：', params);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((response) => {
                console.log('所有玩法下注结果：', response);

                if (response.msg == 0 && response.data) {
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
        if (this.props.game_type == 3 && showSuperD && this.props.superSltDic.d_key) {
            // 如果.superSltDic['d_key'] 的值存在，那就用它。
            sltkey = this.props.superSltDic.d_key;
        }

        return (
            <View>
                {this._HC_GL('HC', old_keys, sltkey)}
                {this._HC_GL('HHC', old_keys, sltkey)}
                {this._HC_GL('GL', old_keys, sltkey)}
                {this._HC_GL('HGL', old_keys, sltkey)}
                {this._1X2('1X2', old_keys, sltkey)}
                {this._1X2('H1X2', old_keys, sltkey)}
                {this._TCS('TCS', old_keys, sltkey)}
                {this._TCS('HTCS', old_keys, sltkey)}
                {this._TG('TG', old_keys, sltkey)}
                {this._TG('HTG', old_keys, sltkey)}
                {this._TGOE('BTS', old_keys, sltkey)}
                {this._TGOE('HBTS', old_keys, sltkey)}
                {this._HC_GL('GLH', old_keys, sltkey)}
                {this._HC_GL('GLV', old_keys, sltkey)}
                {this._HC_GL('HGLH', old_keys, sltkey)}
                {this._HC_GL('HGLV', old_keys, sltkey)}
                {this._TGOE('TGOE', old_keys, sltkey)}
                {this._TGOE('HTGOE', old_keys, sltkey)}
                {this._FLG('FLG', old_keys, sltkey)}
                {this._TGOE('HFT', old_keys, sltkey)}
                {this._FLG('WM', old_keys, sltkey)}
                {this._TGOE('DC', old_keys, sltkey)}
                {this._1X2('CNS', old_keys, sltkey)}
                {this._1X2('WTN', old_keys, sltkey)}
                {this._1X2GL('1X2GL', old_keys, sltkey)}
                {this._BTS('1X2BTS', old_keys, sltkey)}
                {this._1X2GL('GLBTS', old_keys, sltkey)}
                {this._FLG('1X2FG', old_keys, sltkey)}
                {this._1X2('R2G', old_keys, sltkey)}
                {this._1X2('R3G', old_keys, sltkey)}
                {this._TGOE('HMG', old_keys, sltkey)}
                {this._TGOE('HMG1x2', old_keys, sltkey)}
                {this._1X2('SBH', old_keys, sltkey)}
                {this._TGOE('FGM', old_keys, sltkey)}
                {this._TGOE('TFG3W', old_keys, sltkey)}
                {this._TGOE('TFG', old_keys, sltkey)}
                {this._1X2GL('DCGL', old_keys, sltkey)}
                {this._BTS('DCBTS', old_keys, sltkey)}
                {this._FLG('DCFTS', old_keys, sltkey)}
                {this._1X2GL('GLTGOE', old_keys, sltkey)}
                {this._1X2GL('GLFTS', old_keys, sltkey)}
                {this._1X2('WFB', old_keys, sltkey)}
                {this._1X2('WEH', old_keys, sltkey)}
                {this._1X2('WBH', old_keys, sltkey)}
            </View>
        )
    }

    _handleSltData(key, ballData) {
        console.log('当前点击数据 == ', key, ' == ', ballData, this.state.bet_data[key]);

        if (this.props.game_type == 3 && ballData[0].d_key != null) {
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

        } else if (this.props.game_type == 3 && ballData[0].d_key == null) {
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

    _HC_GL(key, old_keys, slt_key) {
        let data = this.state.bet_data[key];
        if (data == null) { return null };

        return (
            <ItemView_HC_GL d_key={key} data={data} style={{ a: styles.viewStyle, b: styles.haderStyle }} nowGameData={this.props.nowGameData}
                slt_key={slt_key}
                old_keys={old_keys}
                superSltDic={this.props.superSltDic}
                ballClick={(ballData) => {
                    this._handleSltData(key, ballData);
                }}>
            </ItemView_HC_GL>
        )
    }

    _1X2(key, old_keys, slt_key) {
        let data = this.state.bet_data[key];
        if (data == null) { return null };

        return (
            <ItemView_1X2 d_key={key} data={data} style={{ a: styles.viewStyle, b: styles.haderStyle }} nowGameData={this.props.nowGameData}
                slt_key={slt_key}
                old_keys={old_keys}
                superSltDic={this.props.superSltDic}
                ballClick={(ballData) => {
                    this._handleSltData(key, ballData);
                }}>
            </ItemView_1X2>
        )
    }

    _TCS(key, old_keys, slt_key) {
        let data = this.state.bet_data[key];
        if (data == null) { return null };
        return (
            <ItemView_TCS d_key={key} data={data} style={{ a: styles.viewStyle, b: styles.haderStyle }} nowGameData={this.props.nowGameData}
                slt_key={slt_key}
                old_keys={old_keys}
                superSltDic={this.props.superSltDic}
                ballClick={(ballData) => {
                    this._handleSltData(key, ballData);
                }}>
            </ItemView_TCS>
        )
    }

    _TG(key, old_keys, slt_key) {
        let data = this.state.bet_data[key];
        if (data == null) { return null };
        return (
            <ItemView_TG d_key={key} data={data} style={{ a: styles.viewStyle, b: styles.haderStyle }} nowGameData={this.props.nowGameData}
                slt_key={slt_key}
                old_keys={old_keys}
                superSltDic={this.props.superSltDic}
                ballClick={(ballData) => {
                    this._handleSltData(key, ballData);
                }}>
            </ItemView_TG>
        )
    }

    _TGOE(key, old_keys, slt_key) {
        let data = this.state.bet_data[key];
        if (data == null) { return null };
        return (
            <ItemView_TGOE d_key={key} data={data} style={{ a: styles.viewStyle, b: styles.haderStyle }} nowGameData={this.props.nowGameData}
                slt_key={slt_key}
                old_keys={old_keys}
                superSltDic={this.props.superSltDic}
                ballClick={(ballData) => {
                    this._handleSltData(key, ballData);
                }}>
            </ItemView_TGOE>
        )
    }

    _FLG(key, old_keys, slt_key) {
        let data = this.state.bet_data[key];
        if (data == null) { return null };
        return (
            <ItemView_FLG d_key={key} data={data} style={{ a: styles.viewStyle, b: styles.haderStyle }} nowGameData={this.props.nowGameData}
                slt_key={slt_key}
                old_keys={old_keys}
                superSltDic={this.props.superSltDic}
                ballClick={(ballData) => {
                    this._handleSltData(key, ballData);
                }}>
            </ItemView_FLG>
        )
    }

    _1X2GL(key, old_keys, slt_key) {
        let data = this.state.bet_data[key];
        if (data == null) { return null };
        return (
            <ItemView_1X2GL d_key={key} data={data} style={{ a: styles.viewStyle, b: styles.haderStyle }} nowGameData={this.props.nowGameData}
                slt_key={slt_key}
                old_keys={old_keys}
                superSltDic={this.props.superSltDic}
                ballClick={(ballData) => {
                    this._handleSltData(key, ballData);
                }}>
            </ItemView_1X2GL>
        )
    }

    _BTS(key, old_keys, slt_key) {
        let data = this.state.bet_data[key];
        if (data == null) { return null };
        return (
            <ItemView_BTS d_key={key} data={data} style={{ a: styles.viewStyle, b: styles.haderStyle }} nowGameData={this.props.nowGameData}
                slt_key={slt_key}
                old_keys={old_keys}
                superSltDic={this.props.superSltDic}
                ballClick={(ballData) => {
                    this._handleSltData(key, ballData);
                }}>
            </ItemView_BTS>
        )
    }

    render() {

        let isShowBottom = this.state.sltBallData.length > 0 && this.state.sltBallData[0].d_key != null ? true : false;

        return (
            <View style={{ flex: 1 }}>

                {this.state.isHaveData
                    ? <ScrollView style={{}}>
                        {this._allGameView()}
                        <View style={{ height: isShowBottom ? 90 : 0, marginBottom: SCREEN_HEIGHT == 812 ? 34 : 0 }} />
                    </ScrollView>

                    : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text allowFontScaling={false} style={{ fontSize: 30 }}>暂无数据！</Text>
                    </View>
                }

                {this.props.game_type != 3
                    ? <FBGameBottom style={{}}
                        isShowView={isShowBottom}  // 显示底部view
                        sport_id={this.props.sport_id}
                        game_type={this.props.game_type} // 0滚球、1今日、2早盘、3综合、4冠军
                        sltBallData={this.state.sltBallData}  // 选择的号码
                        nowGameData={this.props.nowGameData}  // 当前盘口的数据
                        xiaZhuClick={(paramData) => {

                            if (global.UserLoginObject.Uid != '') {
                                this._xiaZhuMethod(paramData);  // 确定下注

                            } else {
                                Alert.alert('温馨提示', '您还未登录,请先去登录!',
                                    [
                                        { text: '确定', onPress: () => this.props.navigate('Login', { title: '登录' }) },
                                        { text: '取消', onPress: () => { } },
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
                                        { text: '确定', onPress: () => this.props.navigate('Login', { title: '登录' }) },
                                        { text: '取消', onPress: () => { } }
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
    // 不想每个itemview里面都写一次，所以在这写当样式传进去用
    // 每个itemview的外边框
    viewStyle: {
        width: SCREEN_WIDTH - 20,
        margin: 10,
        borderColor: '#d2d2d2',
        borderWidth: 0.5,
        borderRadius: 3,
        backgroundColor: '#fff',
    },
    // 每个itemview的头部样式
    haderStyle: {
        backgroundColor: '#f3f3f3',
        justifyContent: 'center',
        // alignItems: 'center',
        paddingLeft: Adaption.Width(20),
        width: SCREEN_WIDTH - 21, // 多减1为不挡住左右边线条
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        borderColor: '#d2d2d2',
        borderBottomWidth: 0.5,
    },
})