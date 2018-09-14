import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
    ImageBackground,
} from 'react-native';

import Toast, { DURATION } from 'react-native-easy-toast'
import BaseNetwork from "../../skframework/component/BaseNetwork"; //网络请求
import Adaption from "../../skframework/tools/Adaption";
import Moment from 'moment';

export default class Me extends Component {
    //构造函数
    constructor(props) {
        super(props);

        this.state = ({
            isLogin: '',  //刷新界面用到
            userName: '', //用户名
            headerIcon: '',//用户头像
            totalMoney: 0,//用户总金额
            tkPrice: 0, //提款金额
            Level: '',//代理
            is_GuestShiWan: 0,
            sign_event: 0,
            messageArray: [],
            hidFunNum: 2,  // 多少个隐藏
        });



        // 添加功能隐藏和显示
        this.meDictList = [
            {
                'index': 7,
                'icon': require('./img/ic_buyLotteryList.png'),
                'name': '购彩记录',
                'details': '查看投注记录'
            },
            {
                'index': 8,
                'icon': require('./img/ic_winLotteryList.png'),
                'name': '中奖记录',
                'details': '查看中奖记录'
            },
            {
                'index': 9,
                'icon': require('./img/ic_accountdetail.png'),
                'name': '账户明细',
                'details': '查看资金流向'
            },
            {
                'index': 10,
                'icon': require('./img/ic_agentCenter.png'),
                'name': '代理中心',
                'details': '查看代理信息'
            },
            {
                'index': 11,
                'icon': require('./img/ic_drawCashRecord.png'),
                'name': '提款记录',
                'details': '查看提款记录'
            },
            {
                'index': 12,
                'icon': require('./img/ic_topuprecord.png'),
                'name': '充值记录',
                'details': '查看充值记录'
            },
            {
                'index': 13,
                'icon': require('./img/ic_welfaretask.png'),
                'name': '福利任务',
                'details': '马上签到领福利'
            },
            // {
            //     'index': 19,
            //     'icon': require('./img/ic_jinriyingkui.png'),
            //     'name': '今日盈亏',
            //     'details': '查看金额盈亏'
            // },
            {
                'index': 17,
                'icon': require('./img/ic_personmsg.png'),
                'name': '个人消息',
                'details': '查看个人消息'
            },
            {
                'index': 16,
                'icon': require('./img/ic_serviceCenter.png'),
                'name': '客服中心',
                'details': '24小时在线'
            },
            // {
            //     'index': 15,
            //     'icon': require('./img/ic_cashTransfer.png'),
            //     'name': '现金转账',
            //     'details': '转账给好友'
            // },
            {
                'index': 14,
                'icon': require('./img/ic_agentCenter.png'),
                'name': '安全中心',
                'details': '银行卡绑定'
            },
            {
                'index': 18,
                'icon': require('./img/ic_moresetting.png'),
                'name': '更多设置',
                'details': '开启中奖通知'
            },
        ];

        // 今日盈亏
        if (GlobalConfig.userData.profit_status == 1) {

            this.state.hidFunNum = 1;
            this.meDictList.splice(7, 0, {
                'index': 19,
                'icon': require('./img/ic_jinriyingkui.png'),
                'name': '今日盈亏',
                'details': '查看金额盈亏'
            });

        }

        // 现金交易
        if (GlobalConfig.userData.cash_status == 1) {
            var spIndex = 9;
            if (GlobalConfig.userData.profit_status == 1) {
                spIndex = 10;
                this.state.hidFunNum = 0;
            } else {
                this.state.hidFunNum = 1;
            }

            this.meDictList.splice(spIndex, 0, {
                'index': 15,
                'icon': require('./img/ic_cashTransfer.png'),
                'name': '现金转账',
                'details': '转账给好友'
            });

        }

        // this.setState({
        //     hidFunNum: this.state.hidFunNum,
        // })

    }

    static navigationOptions = ({ navigation, screenProps }) => ({

        tabBarOnPress: (({ route, index }, jumpToIndex) => {
            // 只有调用jumpToIndex方法之后才会真正的跳转页面
            jumpToIndex(index);
            // console.log(route);
            navigation.state.params && navigation.state.params.tabBarPress ? navigation.state.params.tabBarPress() : null;
        }),
        //transparent
        header: (

            <View
                style={{ width: SCREEN_WIDTH, height: (SCREEN_HEIGHT == 812 ? 88 : 64), flexDirection: 'row' ,backgroundColor:COLORS.appColor}}>

                <View style={{
                    width: SCREEN_WIDTH - 173 / 3.0 - 10,
                    backgroundColor: 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <CusBaseText style={{
                        color: 'white',
                        fontSize: 18,
                        marginLeft: 80,
                        marginTop: (SCREEN_HEIGHT == 812 ? 40 : 20)
                    }}>个人中心</CusBaseText>
                </View>

            </View>

        ),
    });


    componentDidMount() {
        this._fetchPersonalMessageData();

        //设置用户的信息
        this._setUserInfo();

        //接受用户登录成功的通知
        this.subscription = PushNotification.addListener('LoginSuccess', (loginObject) => {

            this.setState({

                isLogin: loginObject.Token,  //Token
                userName: loginObject.UserName, //用户名
                headerIcon: loginObject.UserHeaderIcon,//用户头像
                totalMoney: loginObject.TotalMoney,//用户总金额
                tkPrice: loginObject.TKPrice, //提款金额
                Level: loginObject.Level,//代理
                is_GuestShiWan: loginObject.is_Guest,
                sign_event: loginObject.Sign_event,

            })


            //请求参数
            let params = new FormData();
            params.append("ac", "getUserMessage");
            params.append("uid", loginObject.Uid);
            params.append("token", loginObject.Token);
            params.append("bdate", "1970-01-01");
            params.append("edate", Moment().format('YYYY-MM-DD'));
            params.append("type", "1");
            params.append("limit", "20");

            var promise = BaseNetwork.sendNetworkRequest(params);

            promise
                .then(response => {
                    if (response.msg == 0) {
                        let datalist = response.data;
                        if (datalist && datalist.length > 0) {
                            let dataBlog = [];
                            let i = 0;
                            datalist.map(dict => {
                                dataBlog.push({ key: i, value: dict });
                                i++;
                            });
                            this.setState({ messageArray: dataBlog })
                            datalist = null;
                            dataBlog = null;
                        }
                    }

                })
                .catch(err => { });

        });

        //接受用户退出登录的通知
        this.subscription4 = PushNotification.addListener('LoginOutSuccess', () => {
            this.setState({ isLogin: '', messageArray: [] });
        });


        //接受刷新金额的通知
        this.subscription2 = PushNotification.addListener('RefreshUserTotalMoney', (money) => {

            //数字类型的取两位小数
            if (typeof (money) == 'number') {

                money = money.toFixed(2);
            }

            this.setState({ totalMoney: money })
        });

        //接受用户修改头像的通知
        this.subscription3 = PushNotification.addListener('ChangeUserImage', (headerImage) => {
            this.setState({ headerIcon: headerImage });
        });
    }

    //获取个人消息数据
    _fetchPersonalMessageData() {


        if (global.UserLoginObject.Uid != '' && global.UserLoginObject.Token != '') {
            //请求参数
            let params = new FormData();
            params.append("ac", "getUserMessage");
            params.append("uid", global.UserLoginObject.Uid);
            params.append("token", global.UserLoginObject.Token);
            params.append("bdate", "1970-01-01");
            params.append("edate", Moment().format('YYYY-MM-DD'));
            params.append("type", '1');
            params.append("limit", "20");

            var promise = BaseNetwork.sendNetworkRequest(params);

            promise
                .then(response => {
                    if (response.msg == 0) {
                        let datalist = response.data;
                        if (response.data == null || response.data.length == 0) {
                            this.setState({ messageArray: [] })
                        } else {
                            let dataBlog = [];
                            let i = 0;
                            datalist.map(dict => {
                                dataBlog.push({ key: i, value: dict });
                                i++;
                            });
                            this.setState({ messageArray: dataBlog })
                            datalist = null;
                            dataBlog = null;
                        }

                    } else {

                    }

                })
                .catch(err => {
                });
        }
    }

    //设置用户信息
    _setUserInfo() {

        this.setState({

            isLogin: global.UserLoginObject.Token,  //Token
            userName: global.UserLoginObject.UserName, //用户名
            headerIcon: global.UserLoginObject.UserHeaderIcon,//用户头像
            totalMoney: global.UserLoginObject.TotalMoney,//用户总金额
            tkPrice: global.UserLoginObject.TKPrice, //提款金额
            Level: global.UserLoginObject.Level,//代理
            is_GuestShiWan: global.UserLoginObject.is_Guest,
            sign_event: global.UserLoginObject.Sign_event,

        })
    }

    componentWillUnmount() {

        if (typeof (this.subscription) == 'object') {
            this.subscription && this.subscription.remove();
        }

        if (typeof (this.subscription4) == 'object') {
            this.subscription4 && this.subscription4.remove();
        }

        if (typeof (this.subscription2) == 'object') {
            this.subscription2 && this.subscription2.remove();
        }

        if (typeof (this.subscription3) == 'object') {
            this.subscription3 && this.subscription3.remove();
        }
    }

    //点击我的界面各种按钮
    _onMeAction(index, navigate) {

        if (this.state.isLogin != '') {

            if (this.state.is_GuestShiWan == 2) {
                if (index == 7) {//购彩记录
                    navigate('TouZhuRecord')
                } else if (index == 8) {//中奖记录
                    navigate('MeWinRecord', { title: '中奖记录' })
                } else if (index == 9) {//账户明细
                    navigate('AccountDetails', { title: '账户明细' })
                } else if (index == 16) {//客服中心
                    navigate('ChatService', {callback:() => {}, title: '在线客服' })
                } else if (index == 18) {//更多设置
                    navigate('MoreSetting', { title: '更多设置', })
                } else {
                    Alert.alert(
                        '温馨提示',
                        '您的账号是试玩账号,没有权限访问!',
                        [
                            { text: '确定', onPress: () => { } },
                        ]
                    )
                }


            } else {
                switch (index) {
                    case 0://点击头像
                        break;
                    case 1://签到
                        if (this.state.sign_event == 0) {
                            Alert.alert(
                                '提示',
                                '该通道未开通',
                                [
                                    { text: '确定', onPress: () => { } },
                                ]
                            )
                        } else {
                            navigate('DailyAttendance')
                        }
                        break;
                    case 2://充值
                        navigate('RechargeCenter')
                        break;
                    case 3://提现

                        if (global.UserLoginObject.Card_num) {
                            navigate('DrawalInfo');
                            return;
                        }
                        // BindBankCardPreviousAction  拥有唯一性 请不要覆盖
                        navigate('BindBankCard', {callback: () => {}, BindBankCardPreviousAction: 'DrawalCenter' });
                        break;

                    case 5:
                        Alert.alert(
                            '提示',
                            '您还未登录,请先去登录',
                            [
                                { text: '确定', onPress: () => { navigate('Login', { title: '登录', }) } },
                                { text: '取消', onPress: () => { } },
                            ]
                        )
                        break;
                    case 6:
                        Alert.alert(
                            '提示',
                            '您还未登录,请先去登录',
                            [
                                { text: '确定', onPress: () => { navigate('Login', { title: '登录', }) } },
                                { text: '取消', onPress: () => { } },
                            ]
                        )
                        break;
                    case 10://代理中心
                        if (this.state.Level == 0) {
                            navigate('ApplicationAgentDelege')
                        } else {
                            navigate('Theagency', { title: '代理中心' })
                        }
                        break;
                    case 11://提款记录
                        navigate('BuyRecord', { title: '提款记录' })
                        break;
                    case 12://充值记录
                        navigate('RechargeRecord', { title: '充值记录' })

                        break;
                    case 13://福利任务
                        navigate('WelfareTask', { title: '福利任务' })
                        break;
                    case 14://安全中心
                        navigate('Safetycenter', { title: '安全中心' })
                        break;
                    case 15://现金转账

                        if (global.UserLoginObject.Card_num) {
                            navigate('CashTrasaAcount');
                            return;
                        }
                        navigate('BindBankCard', {callback: () => {}, BindBankCardPreviousAction: 'CashTrasaCenter' });

                        break;
                    case 17:
                        navigate('PersonalMessage', { callback: () => { this._fetchPersonalMessageData() } })
                        break;
                    case 19://今日盈亏
                        navigate('TodayProfitLoss')
                        break;
                    default:
                        break;

                }
            }

            if (index == 7) {//购彩记录
                navigate('TouZhuRecord')
            } else if (index == 8) {//中奖记录
                navigate('MeWinRecord', { title: '中奖记录' })
            } else if (index == 9) {//账户明细
                navigate('AccountDetails', { title: '账户明细' })
            }

        } else {
            if (index == 16) {//客服中心
                navigate('ChatService', {callback:() => { }, title: '在线客服' })
            } else if (index == 18) {//更多设置
                navigate('MoreSetting', { title: '更多设置', })
            } else {
                Alert.alert(
                    '提示',
                    '您还未登录,请先去登录',
                    [
                        { text: '确定', onPress: () => { navigate('Login', { title: '登录', }) } },
                        { text: '取消', onPress: () => { } },
                    ]
                )
            }

        }
        if (index == 16) {//客服中心
            navigate('ChatService', {callback:() => { }, title: '在线客服' })
        } else if (index == 18) {//更多设置
            navigate('MoreSetting', { title: '更多设置', })
        }
    }

    //刷新金额
    _onRershRMB(navigate) {

        this.refs.LoadingView && this.refs.LoadingView.showLoading('正在刷新余额..');
        //请求参数
        let params = new FormData();
        params.append("ac", "flushPrice");
        params.append("uid", global.UserLoginObject.Uid);
        params.append("token", global.UserLoginObject.Token);
        params.append('sessionkey', this.loginObject.session_key);
        var promise = BaseNetwork.sendNetworkRequest(params);
        promise
            .then(response => {

                this.refs.LoadingView && this.refs.LoadingView.cancer();
                if (response.msg == 0) {

                    this.refs.Toast.show('刷新金额成功!', 1000);

                    //数字类型的取两位小数
                    if (typeof (response.data.price) == 'number') {

                        response.data.price = response.data.price.toFixed(2);
                    }

                    global.UserLoginObject.TotalMoney = response.data.price;
                    global.UserLoginObject.Sign_event = response.data._user.sign_event;//判断每日签到通道是否开启 0 未开，1开启
                    global.UserLoginObject.Gift_event = response.data._user.gift_event;//判断红包通道是否开启0 未开，1开启
                    global.UserLoginObject.RiseEvent = response.data._user.rise_event,//是不是开放等级页面

                        global.UserInfo.updateUserInfo(global.UserLoginObject, (result) => { });

                    this.setState({
                        totalMoney: response.data.price,
                    })

                    PushNotification.emit('RefreshHomeNavRightText', response.data.price); //我的界面刷新金额时首页也更新
                } else {
                    Alert.alert(
                        '提示',
                        response.param,
                        [
                            { text: '确定', onPress: () => { navigate('Login', { title: '登录', }) } },
                            { text: '取消', onPress: () => { } },
                        ]
                    )
                }
            })
            .catch(err => { });
    }

    //根据登录状态改变布局
    _createView(navigate) {
        return this.state.isLogin != '' ? (
            <View style={{ width: window.width, height: 140 + Adaption.Width(60) }}>
                <ImageBackground style={{ width: window.width, height: 140, flexDirection: 'column' }} source={require('./img/ic_userBackground.png')} >
                    <TouchableOpacity onPress={() => navigate('MyInfo')} activeOpacity={1} style={{ marginLeft: 15, flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            style={{ width: 50, height: 50, marginTop: 10, borderRadius: 25 }}
                            source={this.state.headerIcon != "" ? { uri:this.state.headerIcon } : (require('./img/ic_userHB.png'))}
                            onError={({ nativeEvent: { error } }) => {
                                this.refs.Toast.show('温馨提示', '您的头像可能有误！请重新上传', 1000);
                            }
                            }>
                        </Image>
                        <CusBaseText style={{ color: 'white', fontSize: Adaption.Font(22, 20), backgroundColor: 'rgba(0,0,0,0)', marginLeft: 15 }}>{this.state.userName}</CusBaseText>
                    </TouchableOpacity>
                    <View style={{ backgroundColor: 'rgba(0,0,0,0.3)', height: 60, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: 20 }}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => this._onRershRMB(navigate)} style={{ flex: 0.33, marginLeft: 10 }}>
                            <View style={{ flex: 0.5, justifyContent: 'center' }}>
                                <CusBaseText style={{ fontSize: Adaption.Font(18, 16), color: 'red' }}>{this.state.totalMoney}</CusBaseText>
                            </View>
                            <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 0.7 }}><CusBaseText style={{ fontSize: Adaption.Font(16, 14), color: 'white' }}>余额</CusBaseText></View>
                                <View style={{ flex: 0.3 }}><Image style={{ width: 20, height: 20 }} source={require('./img/ic_shuaxina.png')}></Image></View>
                            </View>
                        </TouchableOpacity>
                        <View style={{ width: 1, height: 36, backgroundColor: 'white' }}></View>
                        <TouchableOpacity activeOpacity={1} style={{ flex: 0.33, alignItems: 'center', justifyContent: 'center' }}>
                            <CusBaseText style={{ fontSize: Adaption.Font(18, 16), color: 'red' }}>{this.state.tkPrice}</CusBaseText>
                            <CusBaseText style={{ fontSize: Adaption.Font(15, 13), color: 'white', marginTop: 5 }}>最近提款金额</CusBaseText>
                        </TouchableOpacity>
                        <View style={{ width: 1, height: 36, backgroundColor: 'white' }}></View>
                        <TouchableOpacity onPress={() => this._onMeAction(1, navigate)} activeOpacity={1} style={{ flex: 0.33, alignItems: 'center', }}>
                            <Image style={{ width: 20, height: 20, marginTop: 5 }} source={require('./img/ic_dayliySignUp.png')}></Image>
                            <CusBaseText style={{ fontSize: Adaption.Font(15, 13), color: 'white', marginTop: 5 }}>签到</CusBaseText>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
                <View style={{ height: Adaption.Width(60), backgroundColor: '#ffffff', flexDirection: 'row' }}>
                    <TouchableOpacity activeOpacity={1} onPress={() => this._onMeAction(2, navigate)} style={[styles.container_HeaderView_Box, { borderRightWidth: 1, }]}>
                        <Image style={styles.container_HeaderView_Box_Image} source={require('./img/ic_topup.png')}></Image>
                        <CusBaseText style={[styles.container_HeaderView_Box_Text, { color: COLORS.appColor, }]}>充值</CusBaseText>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => this._onMeAction(3, navigate)} style={styles.container_HeaderView_Box}>
                        <Image style={styles.container_HeaderView_Box_Image} source={require('./img/ic_drawcash.png')}></Image>
                        <CusBaseText style={[styles.container_HeaderView_Box_Text, { color: 'green', }]}>提现</CusBaseText>
                    </TouchableOpacity>
                </View>
            </View>) : (
                <View style={{ width: window.width, height: 120 + Adaption.Width(60), }}>
                    <ImageBackground style={{ height: 120, flexDirection: 'column' }} source={require('./img/ic_userBackground.png')} >
                        <TouchableOpacity onPress={() => { global.isHomeVcPush = false; global.isHomeAndLoginPush = false; navigate('Login', { title: '登录', }) }} activeOpacity={1} style={{ justifyContent: 'center', alignItems: 'center' }}>

                            <Image style={{ width: 50, height: 50, marginTop: 10, borderRadius: 25 }} source={require('./img/ic_userHB.png')}></Image>
                            <CusBaseText style={{ color: 'white', fontSize: Adaption.Font(20, 18), backgroundColor: 'rgba(0,0,0,0)', marginTop: 20 }}>登录|注册</CusBaseText>
                        </TouchableOpacity>
                    </ImageBackground>
                    <View style={{ height: Adaption.Width(60), backgroundColor: '#ffffff', flexDirection: 'row' }}>
                        <TouchableOpacity activeOpacity={1} onPress={() => this._onMeAction(5, navigate)} style={[styles.container_HeaderView_Box, { borderRightWidth: 1, }]}>
                            <Image style={styles.container_HeaderView_Box_Image} source={require('./img/ic_topup.png')}></Image>
                            <CusBaseText style={[styles.container_HeaderView_Box_Text, { color: COLORS.appColor, }]}>充值</CusBaseText>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={() => this._onMeAction(6, navigate)} style={styles.container_HeaderView_Box}>
                            <Image style={styles.container_HeaderView_Box_Image} source={require('./img/ic_drawcash.png')}></Image>
                            <CusBaseText style={[styles.container_HeaderView_Box_Text, { color: 'green', }]}>提现</CusBaseText>
                        </TouchableOpacity>
                    </View>
                </View>)
    }


    render() {

        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                {this._createView(navigate)}
                <ScrollView automaticallyAdjustContentInsets={false}
                    alwaysBounceHorizontal={false} style={{ flex: 1, marginTop: 3 }}>
                    <View style={[styles.contain_SettingListView]}>
                        <TouchableOpacity activeOpacity={1} onPress={() => this._onMeAction(this.meDictList[0]["index"], navigate)} style={[styles.container_SettingListView_Model, { borderRightWidth: 1 }]}>
                            <View style={styles.container_SettingListView_Model_Left}><Image style={{ width: 20, height: 20 }} source={this.meDictList[0]["icon"]}></Image></View>
                            <View style={styles.container_SettingListView_Model_Right}>
                                <CusBaseText style={styles.container_SettingListView_Model_Right_Title}>{this.meDictList[0]["name"]}</CusBaseText>
                                <CusBaseText style={styles.container_SettingListView_Model_Right_Content}>{this.meDictList[0]["details"]}</CusBaseText>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={() => this._onMeAction(this.meDictList[1]["index"], navigate)} style={styles.container_SettingListView_Model}>
                            <View style={styles.container_SettingListView_Model_Left}><Image style={{ width: 20, height: 20 }} source={this.meDictList[1]["icon"]}></Image></View>
                            <View style={styles.container_SettingListView_Model_Right}>
                                <CusBaseText style={styles.container_SettingListView_Model_Right_Title}>{this.meDictList[1]["name"]}</CusBaseText>
                                <CusBaseText style={styles.container_SettingListView_Model_Right_Content}>{this.meDictList[1]["details"]}</CusBaseText>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contain_SettingListView}>
                        <TouchableOpacity activeOpacity={1} onPress={() => this._onMeAction(this.meDictList[2]["index"], navigate)} style={[styles.container_SettingListView_Model, { borderRightWidth: 1 }]}>
                            <View style={styles.container_SettingListView_Model_Left}><Image style={{ width: 20, height: 20 }} source={this.meDictList[2]["icon"]}></Image></View>
                            <View style={styles.container_SettingListView_Model_Right}>
                                <CusBaseText style={styles.container_SettingListView_Model_Right_Title}>{this.meDictList[2]["name"]}</CusBaseText>
                                <CusBaseText style={styles.container_SettingListView_Model_Right_Content}>{this.meDictList[2]["details"]}</CusBaseText>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={() => this._onMeAction(this.meDictList[3]["index"], navigate)} style={styles.container_SettingListView_Model}>
                            <View style={styles.container_SettingListView_Model_Left}><Image style={{ width: 20, height: 20 }} source={this.meDictList[3]["icon"]}></Image></View>
                            <View style={styles.container_SettingListView_Model_Right}>
                                <CusBaseText style={styles.container_SettingListView_Model_Right_Title}>{this.meDictList[3]["name"]}</CusBaseText>
                                <CusBaseText style={styles.container_SettingListView_Model_Right_Content}>{this.meDictList[3]["details"]}</CusBaseText>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.contain_SettingListView, { marginTop: 3 }]}>
                        <TouchableOpacity activeOpacity={1} onPress={() => this._onMeAction(this.meDictList[4]["index"], navigate)} style={[styles.container_SettingListView_Model, { borderRightWidth: 1 }]}>
                            <View style={styles.container_SettingListView_Model_Left}><Image style={{ width: 20, height: 20 }} source={this.meDictList[4]["icon"]}></Image></View>
                            <View style={styles.container_SettingListView_Model_Right}>
                                <CusBaseText style={styles.container_SettingListView_Model_Right_Title}>{this.meDictList[4]["name"]}</CusBaseText>
                                <CusBaseText style={styles.container_SettingListView_Model_Right_Content}>{this.meDictList[4]["details"]}</CusBaseText>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={() => this._onMeAction(this.meDictList[5]["index"], navigate)} style={styles.container_SettingListView_Model}>
                            <View style={styles.container_SettingListView_Model_Left}><Image style={{ width: 20, height: 20 }} source={this.meDictList[5]["icon"]}></Image></View>
                            <View style={styles.container_SettingListView_Model_Right}>
                                <CusBaseText style={styles.container_SettingListView_Model_Right_Title}>{this.meDictList[5]["name"]}</CusBaseText>
                                <CusBaseText style={styles.container_SettingListView_Model_Right_Content}>{this.meDictList[5]["details"]}</CusBaseText>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contain_SettingListView}>
                        <TouchableOpacity activeOpacity={1} onPress={() => this._onMeAction(this.meDictList[6]["index"], navigate)} style={[styles.container_SettingListView_Model, { borderRightWidth: 1 }]}>
                            <View style={styles.container_SettingListView_Model_Left}><Image style={{ width: 20, height: 20 }} source={this.meDictList[6]["icon"]}></Image></View>
                            <View style={styles.container_SettingListView_Model_Right}>
                                <CusBaseText style={styles.container_SettingListView_Model_Right_Title}>{this.meDictList[6]["name"]}</CusBaseText>
                                <CusBaseText style={styles.container_SettingListView_Model_Right_Content}>{this.meDictList[6]["details"]}</CusBaseText>
                            </View>
                            {this.meDictList[6]["name"]!='个人消息'? null : this.state.messageArray.length != 0 ? <View style={{ width: 6, height: 6, backgroundColor: 'red', borderRadius: 3, marginTop: 10, marginRight: 10 }}></View> : null}
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={() => this._onMeAction(this.meDictList[7]["index"], navigate)} style={styles.container_SettingListView_Model}>
                            <View style={styles.container_SettingListView_Model_Left}><Image style={{ width: 20, height: 20 }} source={this.meDictList[7]["icon"]}></Image></View>
                            <View style={styles.container_SettingListView_Model_Right}>
                                <CusBaseText style={styles.container_SettingListView_Model_Right_Title}>{this.meDictList[7]["name"]}</CusBaseText>
                                <CusBaseText style={styles.container_SettingListView_Model_Right_Content}>{this.meDictList[7]["details"]}</CusBaseText>
                            </View>
                            {this.meDictList[7]["name"]!='个人消息'? null : this.state.messageArray.length != 0 ? <View style={{ width: 6, height: 6, backgroundColor: 'red', borderRadius: 3, marginTop: 10, marginRight: 10 }}></View> : null}
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.contain_SettingListView, { marginTop: 3 }]}>
                        <TouchableOpacity activeOpacity={1} onPress={() => this._onMeAction(this.meDictList[8]["index"], navigate)} style={[styles.container_SettingListView_Model, { borderRightWidth: 1 }]}>
                            <View style={styles.container_SettingListView_Model_Left}><Image style={{ width: 20, height: 20 }} source={this.meDictList[8]["icon"]}></Image></View>
                            <View style={styles.container_SettingListView_Model_Right}>
                                <CusBaseText style={styles.container_SettingListView_Model_Right_Title}>{this.meDictList[8]["name"]}</CusBaseText>
                                <CusBaseText style={styles.container_SettingListView_Model_Right_Content}>{this.meDictList[8]["details"]}</CusBaseText>
                            </View>
                            {this.meDictList[8]["name"]!='个人消息'? null : this.state.messageArray.length != 0 ? <View style={{ width: 6, height: 6, backgroundColor: 'red', borderRadius: 3, marginTop: 10, marginRight: 10 }}></View> : null}

                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={1} onPress={() => this._onMeAction(this.meDictList[9]["index"], navigate)} style={styles.container_SettingListView_Model}>
                            <View style={styles.container_SettingListView_Model_Left}><Image style={{ width: 20, height: 20 }} source={this.meDictList[9]["icon"]}></Image></View>
                            <View style={styles.container_SettingListView_Model_Right}>
                                <CusBaseText style={styles.container_SettingListView_Model_Right_Title}>{this.meDictList[9]["name"]}</CusBaseText>
                                <CusBaseText style={styles.container_SettingListView_Model_Right_Content}>{this.meDictList[9]["details"]}</CusBaseText>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {this.state.hidFunNum == 2 ? null : <View style={styles.contain_SettingListView}>
                        <TouchableOpacity activeOpacity={1} onPress={() => this._onMeAction(this.meDictList[10]["index"], navigate)} style={[styles.container_SettingListView_Model, { borderRightWidth: 1 }]}>
                            <View style={styles.container_SettingListView_Model_Left}><Image style={{ width: 20, height: 20 }} source={this.meDictList[10]["icon"]}></Image></View>
                            <View style={styles.container_SettingListView_Model_Right}>
                                <CusBaseText style={styles.container_SettingListView_Model_Right_Title}>{this.meDictList[10]["name"]}</CusBaseText>
                                <CusBaseText style={styles.container_SettingListView_Model_Right_Content}>{this.meDictList[10]["details"]}</CusBaseText>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={() => this._onMeAction(this.meDictList[11]["index"], navigate)} style={styles.container_SettingListView_Model}>
                            <View style={styles.container_SettingListView_Model_Left}><Image style={{ width: 20, height: 20 }} source={this.meDictList[11]["icon"]}></Image></View>
                            <View style={styles.container_SettingListView_Model_Right}>
                                <CusBaseText style={styles.container_SettingListView_Model_Right_Title}>{this.meDictList[11]["name"]}</CusBaseText>
                                <CusBaseText style={styles.container_SettingListView_Model_Right_Content}>{this.meDictList[11]["details"]}</CusBaseText>
                            </View>
                        </TouchableOpacity>
                    </View>}


                    {this.state.hidFunNum == 1 ? null :
                        <View style={styles.contain_SettingListView}>
                            <TouchableOpacity activeOpacity={1} onPress={() => this._onMeAction(this.meDictList[this.meDictList.length - 1]["index"], navigate)} style={[styles.container_SettingListView_Model, { borderRightWidth: 1 }]}>
                                <View style={styles.container_SettingListView_Model_Left}><Image style={{ width: 20, height: 20 }} source={this.meDictList[this.meDictList.length - 1]["icon"]}></Image></View>
                                <View style={styles.container_SettingListView_Model_Right}>
                                    <CusBaseText style={styles.container_SettingListView_Model_Right_Title}>{this.meDictList[this.meDictList.length - 1]["name"]}</CusBaseText>
                                    <CusBaseText style={styles.container_SettingListView_Model_Right_Content}>{this.meDictList[this.meDictList.length - 1]["details"]}</CusBaseText>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={1} style={{ flex: 0.5, height: Adaption.Width(60), backgroundColor: 'rgb(230,230,230)' }}>
                            </TouchableOpacity>
                        </View>}

                </ScrollView>
                <Toast ref="Toast" position='center' />
                <LoadingView ref='LoadingView' />
            </View>
        );
    }


}

const styles = StyleSheet.create({
    //视图容器
    container: {
        backgroundColor: 'rgb(230,230,230)',
        flex: 1
    },

    //单个模块视图
    container_HeaderView_Box: {
        borderColor: 'lightgrey',
        flex: 0.5,
        flexDirection: 'row',
        alignItems: 'center',      //垂直居中
        justifyContent: 'center',  //水平居中
        height: Adaption.Width(60),
        borderBottomWidth: 1,
    },
    //模块里的图片
    container_HeaderView_Box_Image: {
        width: 20,
        height: 20,
    },
    //模块的文字
    container_HeaderView_Box_Text: {
        textAlign: 'left',
        fontSize: Adaption.Font(18, 16),
        marginLeft: 10,
    },

    //列表
    contain_SettingListView: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        height: Adaption.Width(60),
    },

    //列表单个模块
    container_SettingListView_Model: {
        flex: 0.5,
        height: Adaption.Width(60),
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderColor: 'lightgrey',
    },

    //列表模块左边
    container_SettingListView_Model_Left: {
        flex: 0.3,
        height: Adaption.Width(60),
        alignItems: 'center',
        justifyContent: 'center',
    },

    //列表模块右边
    container_SettingListView_Model_Right: {
        flex: 0.7,
        height: Adaption.Width(60),
        flexDirection: 'column',
        justifyContent: 'center',
    },

    //右边标题
    container_SettingListView_Model_Right_Title: {
        fontSize: Adaption.Font(17, 15),
        color: '#454545',
    },

    //右边标题描述
    container_SettingListView_Model_Right_Content: {
        fontSize: Adaption.Font(14, 12),
        marginTop: Adaption.Width(8),
        color: COLORS.global_subtitle_color,
    }

})