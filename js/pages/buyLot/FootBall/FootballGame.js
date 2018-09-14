
/**
 Created by Money on 2018/03/21
 足球玩法的 投注总界面
 */

import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';

import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view';
import Toast, {DURATION} from 'react-native-easy-toast'  //土司视图

import FBGameCenter from './FBGameCenter/FBGameCenter';  // 玩法选号中心
import ScorceSlectAlert from './footballTool/ScorceSlectAlert';  //更多选择框
import ScorceDropView from './footballTool/ScorceDropDownView';  //足彩下拉框
import ScorceBottom from './footballTool/ScorceBottomView';   //足彩底部控件
import ScorceZHBottom from './footballTool/ScorceSpecailBottomView'; //足彩综合过关底部控件


export default class FootballGame extends Component {

    static navigationOptions = ({ navigation }) => ({

        header: (

            <CustomNavBar
                leftClick={() => {navigation.state.params.backAction ? navigation.state.params.backAction() : null; navigation.goBack()}}
                centerView={
                    <TouchableOpacity activeOpacity={1} onPress={navigation.state.params ? navigation.state.params.navTitlePress : null}>
                        <View style={{
                            marginLeft:40,
                            width: SCREEN_WIDTH - 180,
                            height: 44,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            marginTop: SCREEN_HEIGHT == 812 ? 44 : 20,
                        }}>
                            <CusBaseText style={{ fontSize: 18, color: 'white', }}>{navigation.state.params.navfirstTitle}</CusBaseText>
                            <Image style={{ width: 15, height: 15, }} source={require("../../theLot/img/xuansan.png")}/>
                        </View>
                    </TouchableOpacity>
                }
                rightView={
                    <View style = {{flexDirection:'row', alignItems:'center', marginTop:SCREEN_HEIGHT == 812 ? 44 : 20}}>
                        <TouchableOpacity style = {{width:40, height:44, alignItems:'center', justifyContent:'center'}} activeOpacity={1} onPress = {() => {navigation.state.params ? navigation.state.params.navTimePress(navigation) : null}}>
                            <CusBaseText style = {{color:'#fff', fontSize:Adaption.Font(18,15)}}>
                            {navigation.state.params.navCountDownText ? navigation.state.params.navCountDownText : '0'}
                        </CusBaseText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                navigation.state.params ? navigation.state.params.navRightPress() : null
                            }}
                            style={{ width: 40, height: 44, justifyContent: 'center', alignItems: 'center' }}>
                            <Image style={{ width: 20, height: 20 }} source={require('./img/ic_moreStepFuc.png')} />
                        </TouchableOpacity>
                    </View>
                }
            />
        ),

    });

    constructor(props) {

        super(props);

        this.state = {
            gameTypeIdx: 1,  //当前默认选择的玩法下标是今日赛事
            topTabIdx:0,  //当前滚动的界面的下标
            sortDataIdx: 0,  //0 按时间排序， 1按联盟排序， 默认按联盟排序
            selctBallsDict: {},  // 选择的号码
            leagueIdArr: [], // 联盟ID数据
            footBallID:props.navigation.state.params.gameId ? props.navigation.state.params.gameId : 2001,
            isShowVerbView:false,  //是否显示维护界面
            verbTimeStr:'',  //维护的时间
            isSelectFromAllPlay:false,  //是否从综合过关需要所有玩法界面选择号码回调
        };

        this.timer1 = null; //倒计时定时器
        this.wating = false; //防止多次快速点击
        this.xiaZhuClickWating = false;  //防止快速点击下注按钮


    }

    componentDidMount() {

        this.props.navigation.setParams({
            navRightPress: this._rightBtnPress,
            navTitlePress: this._navTitleBtnPress,
            navfirstTitle: '今日赛事',
            navCountDownText: 180,
            navTimePress: this._navTimeOnPress,
        });

        this._countDownTime();

        this.subscription = PushNotification.addListener('FBShopCarXiaZhuSuccessNotification', ()=>{
            this.refs.Toast && this.refs.Toast.show('下注成功!', 3000);
        });

    }

    //移除通知
    componentWillUnmount() {

        if (typeof(this.subscription) == 'object'){
            this.subscription && this.subscription.remove();
        }
    }


    //返回是否要刷新render
    shouldComponentUpdate(nextProps, nextState) {

        //当state的值改变时刷新界面
        if (nextState.gameTypeIdx != this.state.gameTypeIdx ||
            nextState.topTabIdx != this.state.topTabIdx ||
            nextState.sortDataIdx != this.state.sortDataIdx ||
            nextState.selctBallsDict != this.state.selctBallsDict ||
            nextState.isShowVerbView != this.state.isShowVerbView ||
            this.state.isSelectFromAllPlay == true){

            return true;
        }
        else {
            return false;
        }
    }

    //导航栏刷新时间点击方法
    _navTimeOnPress = (navigation) => {

        if (this.wating == false) {

            this.wating = true;

            setTimeout(() => {this.wating = false}, 1000)

            navigation.setParams({
                navCountDownText: this.state.gameTypeIdx == 0 ? 30 : 180,
            });

            //倒计时结束或者重新请求时
            PushNotification.emit('RefreshFootBallViewDataNotificaiton', this.state.sortDataIdx, this.state.leagueIdArr, this.state.topTabIdx, false);
        }
    }

    //倒计时刷新开奖数据
    _countDownTime(){

        if (this.timer1) {
            return;
        }

        this.timer1 = setInterval(() => {

            if (this.props.navigation.state.params.navCountDownText < 1){
                this.props.navigation.state.params.navCountDownText = this.state.gameTypeIdx == 0 ? 30 : 180;
                PushNotification.emit('RefreshFootBallViewDataNotificaiton', this.state.sortDataIdx, this.state.leagueIdArr, this.state.topTabIdx, false);
            }
            else {

                this.props.navigation.state.params.navCountDownText -= 1;
            }

            this.props.navigation.setParams({
                navCountDownText: this.props.navigation.state.params.navCountDownText,
            });
        }, 1000)
    }

    //移除通知
    componentWillUnmount(){

        //清除定时器
        this.timer1 && clearInterval(this.timer1);

        //若组件被卸载，刷新state则直接返回，可以解决警告(倒计时组件可能造成的警告)
        this.setState = (state,callback) => {
            return;
        }
    }


    //中间标题点击
    _navTitleBtnPress = () => {

        this.refs.ScorceDropDownView && this.refs.ScorceDropDownView.show();//足彩下拉选择控件
    }

    //右边按钮点击
    _rightBtnPress = () => {

        this.refs.ScoreAlertView && this.refs.ScoreAlertView.showAlertView();//足彩更多功能组件
    };


     // 赛选联赛回调数据
    _callback(da) {
        this.state.leagueIdArr = da;
        PushNotification.emit('RefreshFootBallViewDataNotificaiton', this.state.sortDataIdx, this.state.leagueIdArr, this.state.topTabIdx, true);
    }

    _scorceSlectAlertIndex(index) {
        const { navigate } = this.props.navigation;
        if (index == 0) {
            this.setState({sortDataIdx:1}); //按联盟排序
            PushNotification.emit('RefreshFootBallViewDataNotificaiton', 1, this.state.leagueIdArr, this.state.topTabIdx, true);
            //重新排序后重置倒计时时间
            this.props.navigation.setParams({
                navCountDownText: this.state.gameTypeIdx == 0 ? 30 : 180,
            });

        } else if (index == 1) {
            this.setState({sortDataIdx:0}); //按时间排序
            PushNotification.emit('RefreshFootBallViewDataNotificaiton', 0, this.state.leagueIdArr, this.state.topTabIdx, true);
            this.props.navigation.setParams({
                navCountDownText: this.state.gameTypeIdx == 0 ? 30 : 180,
            });

        } else if (index == 2) {
            navigate('Screening',{sportID:this.state.footBallID, game_type: this.state.gameTypeIdx, play_group: this.state.topTabIdx > 1 ? this.state.topTabIdx - 1 : this.state.topTabIdx, gaBack:this._callback.bind(this)});

        } else if (index == 3) {
            navigate('TouZhuRecord', {wanfa: 0, sportID:this.state.footBallID});

        }  else if (index == 4) {
            navigate('GameRulesHome');

        }  else if (index == 5) {
            navigate('FootballResult', {sportID:this.state.footBallID});
        }
    }

    //下注方法
    _xiaZhuMethod(params){

        this.refs.LoadingView && this.refs.LoadingView.showLoading('下注中');

        params.append('ac', 'betSport');
        params.append('token', global.UserLoginObject.Token);
        params.append('uid', global.UserLoginObject.Uid);
        params.append('sessionkey', global.UserLoginObject.session_key);
        params.append('game_type', this.state.gameTypeIdx);
        params.append('payment_methods', 0);  //默认余额支付

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                this.refs.LoadingView && this.refs.LoadingView.dissmiss();

                if (responseData.msg == 0 && responseData.data){
                    this.refs.Toast && this.refs.Toast.show('下注成功!', 2000);
                    PushNotification.emit('ClearFootBallGameViewBallNotification', true);//发出通知清空界面 
                    this.setState({selctBallsDict:null})
                }
                else if (responseData.msg == 50012) { //余额不足是否前往充值

                    Alert.alert(
                        '温馨提示',
                        '您的余额不足，是否前往充值',
                        [{
                            text: '确定', onPress: () => {
                                this.props.navigation.navigate('RechargeCenter')
                            }
                        },
                            {
                                text: '取消', onPress: () => {
                            }
                            },
                        ],
                    )
                }
                else {

                    if (responseData.param){
                        this.refs.Toast && this.refs.Toast.show(responseData.param, 1000);
                    }
                }
            })
            .catch((err) => {
                if (err.message != '') {
                    this.refs.Toast && this.refs.Toast.show(err.message , 1000);
                }
            })
    }

    _gameCenterView(tabIndex, groupID, title) {
        return (
            <FBGameCenter key={tabIndex} tabIdx={tabIndex} play_group={groupID} game_typeID={this.state.gameTypeIdx} orderIndex={this.state.sortDataIdx} tabLabel={title} sportID = {this.state.footBallID}
                maintenance={this.state.isShowVerbView}
                maintenanceTime={this.state.verbTimeStr}
                navigate={this.props.navigation.navigate} // 传入导航
                downPullRefresh={() => {
                    this.props.navigation.setParams({
                        navCountDownText: this.state.gameTypeIdx == 0 ? 30 : 180, //滚球30秒刷新，其他180秒刷新
                    });
                }}
                ballsDictClick={(seltBallsDic) => {

                   this.state.isSelectFromAllPlay = true;  //强行刷新render,综合过关回调需要刷新
                    setTimeout(()=>{this.state.isSelectFromAllPlay = false},1000);

                    this.setState({
                        selctBallsDict: seltBallsDic,
                    })

                }}
            >
            </FBGameCenter>
        )
    }

    render() {

        let isIphoneX = SCREEN_HEIGHT == 812 ? true : false;  //是否为iphoneX

        return (
            <View style={{ flex: 1 }}>

                {this.state.gameTypeIdx == 3 || this.state.gameTypeIdx == 4
                    ? <ScrollableTabView
                        key={this.state.gameTypeIdx}
                        automaticallyAdjustContentInsets={false}
                        alwaysBounceHorizontal={false}
                        style={{ height: SCREEN_HEIGHT - 90 }}
                        onScroll={(postion) => {}}
                        renderTabBar={() =>
                            <ScrollableTabBar
                                backgroundColor={'#fff'}
                                activeTextColor={COLORS.appColor}
                                underlineStyle={{ backgroundColor: COLORS.appColor, height: 3 }}
                                textStyle={{ fontSize: 17 }}
                            />
                        }>

                        {this._gameCenterView(0, 0, this.state.gameTypeIdx == 4 ? '冠军' : '独赢/让球/大小')}

                    </ScrollableTabView>
                    : this.state.gameTypeIdx == 0
                        ? <ScrollableTabView
                            key={this.state.gameTypeIdx}
                            automaticallyAdjustContentInsets={false}
                            alwaysBounceHorizontal={false}
                            style={{ height: SCREEN_HEIGHT - 90 }}
                            onScroll={(postion) => {

                                //是否滑动完成
                                if (postion % 1 == 0) {
                                    if (postion != this.state.topTabIdx) {

                                        this.state.topTabIdx = postion;
                                        this.state.leagueIdArr = []; // 重置
                                        this.setState({
                                            selctBallsDict: {},
                                        })

                                        this.props.navigation.setParams({
                                            navCountDownText: 30,
                                        })
                                    }
                                }
                            }}
                            renderTabBar={() =>
                                <ScrollableTabBar
                                    backgroundColor={'#fff'}
                                    activeTextColor={COLORS.appColor}
                                    underlineStyle={{ backgroundColor: COLORS.appColor, height: 3 }}
                                    textStyle={{ fontSize: 17 }}
                                >
                                </ScrollableTabBar>
                            }>
                            {this._gameCenterView(0, 0, '独赢/让球/大小')}
                            {this._gameCenterView(1, 1, '波胆（全）')}
                            {this._gameCenterView(2, 1, '波胆（半）')}

                        </ScrollableTabView>
                        : <ScrollableTabView
                            key={this.state.gameTypeIdx}
                            automaticallyAdjustContentInsets={false}
                            alwaysBounceHorizontal={false}
                            style={{ height: SCREEN_HEIGHT - 90 }}
                            onScroll={(postion) => {

                                if (postion % 1 == 0) {
                                    if (postion != this.state.topTabIdx) {

                                        this.state.topTabIdx = postion;
                                        this.state.leagueIdArr = []; // 重置
                                        this.setState({
                                            selctBallsDict: {},
                                        })

                                        this.props.navigation.setParams({
                                            navCountDownText: 180,
                                        })
                                    }
                                }
                            }}
                            renderTabBar={() =>
                                <ScrollableTabBar
                                    backgroundColor={'#fff'}
                                    activeTextColor={COLORS.appColor}
                                    underlineStyle={{ backgroundColor: COLORS.appColor, height: 3 }}
                                    textStyle={{ fontSize: 17 }}
                                >
                                </ScrollableTabBar>
                            }>
                            {/* groupID： 0独赢， 1波胆， 2半场/全场，3总入球 */}
                            {this._gameCenterView(0, 0, '独赢/让球/大小')}
                            {this._gameCenterView(1, 1, '波胆（全）')}
                            {this._gameCenterView(2, 1, '波胆（半）')}
                            {this._gameCenterView(3, 2, '半场/全场')}
                            {this._gameCenterView(4, 3, '总入球')}

                        </ScrollableTabView>
                }

                {/* 综合过关底部 */}
                {this.state.isShowVerbView == true ? null
                    : this.state.gameTypeIdx == 3 ? <ScorceZHBottom style = {{height:50, marginBottom: isIphoneX ? 34 : 0}}
                    NextStepOnPress = {(pushDict) => {

                        if (global.UserLoginObject.Uid != '') {
                            if (pushDict) {

                                this.props.navigation.navigate('FBShopCar', {
                                    navCountDownText: 10,
                                    dataDict: pushDict,
                                    gameType:this.state.gameTypeIdx,
                                });
                            }
                            else {

                                //没有选择号码点击下注则提示
                                this.refs.Toast && this.refs.Toast.show('下注内容不能为空!', 1000);
                            }
                        }
                        else {

                            Alert.alert(
                                '温馨提示',
                                '您还未登录,请先去登录!',
                                [
                                    {text: '确定', onPress: () => this.props.navigation.navigate('Login', {title: '登录'})},
                                    {text: '取消', onPress: () => {}}
                                ])
                        }
                    }}
                    PickDataDict = {this.state.selctBallsDict}
                    sportIDsportID = {this.state.footBallID}/> :
                    <ScorceBottom style={{ height: 90, marginBottom: isIphoneX ? 34 : 0 }}
                      XiaZhuOnPress={(params) => {

                            if (global.UserLoginObject.Uid != ''){

                                if (this.xiaZhuClickWating == false){

                                    this.xiaZhuClickWating = true;

                                    if (params){
                                        //选择了号码则直接拼接参数投注
                                        this._xiaZhuMethod(params);
                                    }
                                    else {
                                        //没有选择号码点击下注则提示
                                        this.refs.Toast && this.refs.Toast.show('下注内容不能为空!', 1000);
                                    }

                                    setTimeout(()=> {this.xiaZhuClickWating = false},1000);
                                }
                            }
                            else {
                                Alert.alert(
                                    '温馨提示',
                                    '您还未登录,请先去登录!',
                                    [
                                        {text: '确定', onPress: () => this.props.navigation.navigate('Login', {title: '登录'})},
                                        {text: '取消', onPress: () => {}}
                                    ])
                            }
                      }}
                    normalPickDataDict = {this.state.selctBallsDict}
                    zongHePickDataDict = {null}
                    currentGameType = {this.state.gameTypeIdx}
                    currentTabIndex = {this.state.topTabIdx}
                    sportID = {this.state.footBallID}/>
                }

                {/* 通用底部 */}
                
                {/* 更多 */}
                <ScorceSlectAlert
                    ref='ScoreAlertView'
                    CellClick={(index) => {
                        this.setState({selctBallsDict:{}});
                        this._scorceSlectAlertIndex(index);
                    }}
                />

                {/* 头部下拉 */}
                <ScorceDropView
                    ref='ScorceDropDownView'
                    selectIndex={this.state.gameTypeIdx}
                    sportID = {this.state.footBallID}
                    isSystemVerb = {(isVerb, verbTimeStr) => {
                        this.setState({isShowVerbView:isVerb, verbTimeStr:verbTimeStr})}
                    }
                    itemTitleSelect={(item) => {

                        //切换不同的玩法类型时刷新底部的工具栏

                        this.props.navigation.setParams({
                            navfirstTitle: item.item.title,
                            navCountDownText:item.index == 0 ? 30 : 180, //滚球30秒刷新，其他180秒刷新
                        });

                      //item.index  0 滚球, 1今日赛事， 2 早盘， 3 综合过关， 4 冠军
                        this.setState({
                            gameTypeIdx: item.index,
                            selctBallsDict: {},
                            topTabIdx: 0, // 重置
                            leagueIdArr: [], // 重置
                        })
                    }}
                />
                <Toast ref="Toast" position='center'/>
                <LoadingView ref='LoadingView'/>
            </View>
        );
    }
}