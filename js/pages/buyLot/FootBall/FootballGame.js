
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
import ScorceBottom from './footballTool/ScorceBottomView';   //足彩底部控件
import ScorceZHBottom from './footballTool/ScorceSpecailBottomView'; //足彩综合过关底部控件
import ScorcePanKou from './footballTool/PankouSelectView';  //足彩盘口选择视图



export default class FootballGame extends Component {

    static navigationOptions = ({ navigation }) => ({

        header: (

            <CustomNavBar
                leftClick={() => {navigation.state.params.backAction ? navigation.state.params.backAction() : null; navigation.goBack()}}
                centerView={
                    <View style = {{ width: SCREEN_WIDTH - 120, height: 44, flexDirection: 'row', marginTop: SCREEN_HEIGHT == 812 ? 40 : 20,}}>
                        <TouchableOpacity
                            style = {{width:(SCREEN_WIDTH-120)/3, height:44, alignItems:'center', justifyContent:'center'}}
                            activeOpacity={0.8}
                            onPress={() => {
                                  navigation.state.params ? navigation.state.params.navRolling(navigation) : null
                            }}>
                            <CusBaseText style = {{color: navigation.state.params.currentChooseTypeIndex == 0 ? '#fdf000' : '#fff', fontSize:Adaption.Font(20,17)}}>
                                滚球
                            </CusBaseText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style = {{width:(SCREEN_WIDTH-120)/3, height:44, alignItems:'center', justifyContent:'center'}}
                            activeOpacity={0.8}
                            onPress={() => {
                                navigation.state.params ? navigation.state.params.navToday(navigation) : null
                            }}>
                            <CusBaseText style = {{color:navigation.state.params.currentChooseTypeIndex == 1 ? '#fdf000' : '#fff', fontSize:Adaption.Font(20,17)}}>
                                今日
                            </CusBaseText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style = {{width:(SCREEN_WIDTH-120)/3, height:44, alignItems:'center', justifyContent:'center'}}
                            activeOpacity={0.8}
                            onPress={() => {
                                navigation.state.params ? navigation.state.params.navEarly(navigation) : null
                            }}>
                            <CusBaseText style = {{color:navigation.state.params.currentChooseTypeIndex == 2 ? '#fdf000' : '#fff', fontSize:Adaption.Font(20,17)}}>
                                早盘
                            </CusBaseText>
                        </TouchableOpacity>
                    </View>
                }
                rightView={
                    <View style = {{flexDirection:'row', alignItems:'center', marginTop:SCREEN_HEIGHT == 812 ? 44 : 20}}>
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
            topTabIdx:0,  //当前滚动的界面的下标,默认0为让球,1为综合过关,2为冠军
            sortDataIdx: 0,  //0 按时间排序， 1按联盟排序， 默认按联盟排序
            selctBallsDict: {},  // 选择的号码
            leagueIdArr: [], // 联盟ID数据
            footBallID:props.navigation.state.params.gameId ? props.navigation.state.params.gameId : 2001,
            isShowVerbView:false,  //是否显示维护界面
            verbTimeStr:'',  //维护的时间
            allDataClick:false, //是否从所有玩法回来，综合过关需要刷新页面
            selectPanKou:'香港盘',  //默认选择的盘口为香港盘
        };

        props.navigation.state.params.currentChooseTypeIndex = 0;// 默认值是滚球
        this.timer1 = null; //倒计时定时器
        this.wating = false; //防止多次快速点击
        this.xiaZhuClickWating = false;  //防止快速点击下注按钮
    }

    componentDidMount() {

        this.props.navigation.setParams({
            navRightPress: this._rightBtnPress,
            // navTitlePress: this._navTitleBtnPress,
            navCountDownText: 180,
            navRolling:this._navRollingBtnClick,//滚球点击
            navToday:this._navTodayBtnClick,//今日点击
            navEarly:this._navEarlyBtnClick,//早盘点击
            currentChooseTypeIndex:0  //当前选择的类型，默认为今日
        });


        this.subscription = PushNotification.addListener('FBShopCarXiaZhuSuccessNotification', ()=>{
            this.refs.Toast && this.refs.Toast.show('下注成功!', 3000);
        });

        this._fetchTypeData();
    }


    //请求足彩列表的类型数据
    _fetchTypeData(){

        let params = new FormData();
        params.append('ac', 'getSportMatchList');
        params.append('game_type', 5);
        params.append('sport_id',  this.state.footBallID);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                if (responseData.msg == 50003){

                    this.setState({isShowVerbView:true, verbTimeStr:responseData.data.maintenance_time});
                }
            })
            .catch((err) => {

            })
    }

    //移除通知
    componentWillUnmount() {

        if (typeof(this.subscription) == 'object'){
            this.subscription && this.subscription.remove();
        }

        //清除定时器
        this.timer1 && clearInterval(this.timer1);

        //若组件被卸载，刷新state则直接返回，可以解决警告(倒计时组件可能造成的警告)
        this.setState = (state,callback) => {
            return;
        }
    }


    //滚球按钮点击的方法
    _navRollingBtnClick = (navigation) => {
        navigation.setParams({currentChooseTypeIndex:0});
        this.setState({
            gameTypeIdx: 0,
            selctBallsDict: {},
            topTabIdx: 0, // 重置
            leagueIdArr: [], // 重置
        })
    }

    //今日按钮点击的方法
    _navTodayBtnClick = (navigation) => {
        navigation.setParams({currentChooseTypeIndex:1});
        this.setState({
            gameTypeIdx: 1,
            selctBallsDict: {},
            topTabIdx: 0, // 重置
            leagueIdArr: [], // 重置
        })
    }

    //早盘按钮点击方法
    _navEarlyBtnClick = (navigation) => {
        navigation.setParams({currentChooseTypeIndex:2});
        this.setState({
            gameTypeIdx: 2,
            selctBallsDict: {},
            topTabIdx: 0, // 重置
            leagueIdArr: [], // 重置
        })
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



        }  else if (index == 1) {
            navigate('Screening',{sportID:this.state.footBallID, game_type: this.state.gameTypeIdx, play_group: this.state.topTabIdx > 1 ? this.state.topTabIdx - 1 : this.state.topTabIdx, gaBack:this._callback.bind(this)});

        } else if (index == 2) {
            if (global.UserLoginObject.Token == '') {
                setTimeout(() => {
                    Alert.alert('提示', '您还未登录,请先去登录',
                        [
                            {text: '取消', onPress: () => { }},
                            {text: '确定', onPress: () => {navigate('Login', {title: '登录'})}},
                        ]
                    )
                }, 100);
            } else {
                navigate('TouZhuRecord', {wanfa: 0, sportID:this.state.footBallID});
            }

        } else if (index == 3) {
            navigate('GameRulesHome');

        } else if (index == 4) {
            navigate('FootballResult', {sportID: this.state.footBallID});
        }
        else if (index == 5){
            navigate('PeilvCaculate');
        }
    }

    //下注方法
    _xiaZhuMethod(params){

        if (this.tempParamData == params) {
            console.log('相同了。不给投。。。');
            return;
        } else {
            console.log('不相同。开始投。。。。');
            this.tempParamData = params;  // 把这个要提交投注的数据记下来。防止点多次了 投重复的。
        }
        
        this.refs.LoadingView && this.refs.LoadingView.showLoading('下注中');

        params.append('ac', 'betSport');
        params.append('token', global.UserLoginObject.Token);
        params.append('uid', global.UserLoginObject.Uid);
        params.append('sessionkey', global.UserLoginObject.session_key);
        params.append('game_type',  this.props.navigation.state.params.currentChooseTypeIndex); //topIdx 0 默认滚球,1今日，2早盘
        params.append("play_group", this.state.topTabIdx == 1 ? 4 : this.state.topTabIdx == 2 ? 5 : this.state.topTabIdx); //playgroup 0让球，4综合过关,5冠军
        params.append('payment_methods', 0);  //默认余额支付
        params.append('bet_odds', this.state.selectPanKou == '香港盘' ? 0 : 1);  //下注时选的盘口

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                this.refs.LoadingView && this.refs.LoadingView.dissmiss();
                
                if (responseData.msg != 0) {
                    this.tempParamData = [];  // 不成功的，要重置
                }

                if (responseData.msg == 0 && responseData.data){
                    global.UserLoginObject.TotalMoney = responseData.data.price;
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

            })
    }

    _gameCenterView(tabIndex, gametypeID, title) {
        return (
            <FBGameCenter key={tabIndex} tabIdx={tabIndex} play_group={tabIndex} game_typeID={gametypeID} orderIndex={this.state.sortDataIdx} tabLabel={title} sportID = {this.state.footBallID}
                          maintenance={this.state.isShowVerbView}
                          maintenanceTime={this.state.verbTimeStr}
                          currentPanKou={this.state.selectPanKou}
                          navigate={this.props.navigation.navigate} // 传入导航
                          downPullRefresh={() => {
                              this.props.navigation.setParams({
                                  navCountDownText: this.state.gameTypeIdx == 0 ? 30 : 180, //滚球30秒刷新，其他180秒刷新
                              });
                          }}
                          ballsDictClick={(seltBallsDic) => {

                              this.setState({
                                  selctBallsDict: seltBallsDic,
                              })

                          }}
                          AllDataBlock={() => {
                              this.setState({
                                  allDataClick:true,
                              })

                              setTimeout(() => {this.state.allDataClick = false}, 1000);
                          }}
            >
            </FBGameCenter>
        )
    }

    render() {

        let isIphoneX = SCREEN_HEIGHT == 812 ? true : false;  //是否为iphoneX

        return (
            <View style={{ flex: 1 }}>

                {this.props.navigation.state.params.currentChooseTypeIndex != 0 ? <ScrollableTabView
                    key={this.props.navigation.state.params.currentChooseTypeIndex}
                    automaticallyAdjustContentInsets={false}
                    alwaysBounceHorizontal={false}
                    style={{ height: SCREEN_HEIGHT - 90, marginTop:50 }}
                    onScroll={(postion) => {

                        if (postion % 1 == 0) {
                            if (postion != this.state.topTabIdx) {

                                this.state.topTabIdx = postion;
                                this.state.leagueIdArr = []; // 重置
                                this.setState({
                                    selctBallsDict: {},
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
                    {/* groupID： 0让球大小， 1综合过关， 2冠军 */}
                    {this._gameCenterView(0, this.props.navigation.state.params.currentChooseTypeIndex, '让球/大小')}
                    {this._gameCenterView(1, this.props.navigation.state.params.currentChooseTypeIndex, '综合过关')}
                    {this._gameCenterView(2, this.props.navigation.state.params.currentChooseTypeIndex, '冠军')}

                </ScrollableTabView> : <View
                    style={{ height:isIphoneX ? SCREEN_HEIGHT - 260 : SCREEN_HEIGHT - 200, marginTop:50 }}>
                    {/* groupID： 0让球大小， 1综合过关， 2冠军 */}
                    {this._gameCenterView(0, 0, '让球/大小')}

                </View>}

                {/*头部视图固定*/}
                <View style = {{position:'absolute'}}>
                    <ScorcePanKou
                        gameTypeID={this.props.navigation.state.params.currentChooseTypeIndex}
                        PankouPicker={(pankouItem)=>{
                            //盘口选择的回调
                            this.setState({selectPanKou:pankouItem.item});
                        }}
                    />
                </View>

                {/* 综合过关底部 */}
                {this.state.isShowVerbView == true ? null
                    :   this.state.topTabIdx == 1 ? <ScorceZHBottom style={{ height: 50, marginBottom: isIphoneX ? 34 : 0 }}
                        NextStepOnPress={(pushDict) => {

                            if (global.UserLoginObject.Uid != '') {
                                if (pushDict) {

                                    this.props.navigation.navigate('FBShopCar', {
                                        navCountDownText: 10,
                                        dataDict: pushDict,
                                        gameType: this.state.gameTypeIdx,  //
                                        playgroup: this.state.topTabIdx,  //play_group  //让球，综合过关，冠军
                                    });
                                } else {
                                    this.refs.Toast && this.refs.Toast.show('下注内容不能为空!', 1000);
                                }
                            }
                            else {
                                Alert.alert('温馨提示', '您还未登录,请先去登录',
                                    [
                                        { text: '取消', onPress: () => { } },
                                        { text: '确定', onPress: () => this.props.navigation.navigate('Login', { title: '登录', loginClick: true }) },
                                    ]
                                )
                            }
                        }}
                        PickDataDict={this.state.selctBallsDict}
                        sportIDsportID={this.state.footBallID} /> :
                        <ScorceBottom style={{ height: 90, marginBottom: isIphoneX ? 34 : 0 }}
                            XiaZhuOnPress={(params) => {

                                if (global.UserLoginObject.Uid != '') {

                                    if (this.xiaZhuClickWating == false) {

                                        this.xiaZhuClickWating = true;

                                        if (params) {
                                            //选择了号码则直接拼接参数投注
                                            this._xiaZhuMethod(params);
                                        }
                                        else {
                                            //没有选择号码点击下注则提示
                                            this.refs.Toast && this.refs.Toast.show('下注内容不能为空!', 1000);
                                        }

                                        setTimeout(() => { this.xiaZhuClickWating = false }, 1000);
                                    }
                                }
                                else {
                                    Alert.alert('温馨提示', '您还未登录,请先去登录',
                                        [
                                            { text: '取消', onPress: () => { } },
                                            { text: '确定', onPress: () => this.props.navigation.navigate('Login', { title: '登录', loginClick: true }) },
                                        ]
                                    )
                                }
                            }}
                            normalPickDataDict={this.state.selctBallsDict}
                            zongHePickDataDict={null}
                            currentTabIndex={this.state.topTabIdx}
                            sportID={this.state.footBallID}
                            currentPanKou={this.state.selectPanKou}/>
                }


                {/* 更多 */}
                <ScorceSlectAlert
                    ref='ScoreAlertView'
                    CellClick={(index) => {
                        this.setState({selctBallsDict:{}});
                        this._scorceSlectAlertIndex(index);
                    }}
                />
                <Toast ref="Toast" position='center'/>
                <LoadingView ref='LoadingView'/>
            </View>
        );
    }
}
