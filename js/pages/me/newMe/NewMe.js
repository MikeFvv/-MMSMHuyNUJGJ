/**
 Created by Ward on 2018/02/01 13:54
 新版官方信用选择视图
 */
import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    FlatList,
    Modal,
    Alert,
} from 'react-native';

import Toast, { DURATION } from 'react-native-easy-toast'
import Moment from 'moment';



//定义一个数组初始化按钮的图片路径
let personListImageArr = [ require('./img/ic_newme_winRecord.png'), require('./img/ic_newme_touzhuRecord.png'),
    require('./img/ic_newme_accountDetail.png'),require('./img/ic_newme_cashTrade.png'), require('./img/ic_newme_agentCenter.png'),
    require('./img/ic_newme_welfaTask.png'), require('./img/ic_newme_perMeagse.png'),
    require('./img/ic_newme_safeCenter.png'), require('./img/ic_feedBack.png'), require('./img/ic_newme_moreSetting.png')];

export default class NewMe extends Component {

    constructor(props) {
        super(props);

        this.state = ({
            isLogin: '',  //刷新界面用到
            userName: '', //用户名
            headerIcon: '',//用户头像
            totalMoney:  '0.00',//用户总金额
            tkPrice: '0.00', //提款金额
            Level:'',//代理
            is_GuestShiWan:0, //是否为试玩
            sign_event:0,    //是否开启签到
            messageArray:0, //个人消息数组
            gerenfankui:0,
            personListData:[],   //个人中心数组
            isShowShiWan:false,//免费试玩体验公告
            qiandao:0,
            anquanzhongxin:0,
        })
    }

    static navigationOptions = ({ navigation, screenProps }) => ({
        // header 设置为null 表示隐藏导航栏
        header: null,

    })

    componentDidMount() {

        //初始化自定义数组
        let itemList = [{key:0, value:{title:'中奖记录'}},
            {key:1, value:{title:'投注记录'}}, {key:2, value:{title:'账户明细'}},
            {key:3, value:{title:'现金交易'}}, {key:4, value:{title:'代理中心'}},
            {key:5, value:{title:'福利任务'}}, {key:6, value:{title:'个人消息'}},
            {key:7, value:{title:'安全中心'}}, {key:8, value:{title:'意见反馈'}},
            {key:9, value:{title:'更多设置'}}, {key:10, value:{title:''}}, {key:11, value:{title:''}}];

        //根据sysinfo 接口的 cash_status 字段显示或隐藏现金交易入口
        if (GlobalConfig.userData.cash_status == '0'){
            personListImageArr.splice(3,1);
            itemList.splice(3,1);
        }

        this.setState({
            personListData:itemList,
        })

        this._fetchPersonalMessageData();

        //设置用户的信息
        this._setUserInfo();

        //获取等级头衔信息
        this._fetchUserEventRise();
        this.subscription6666 = PushNotification.addListener('ShuaXinJinEr', () => {

            this._fetchPersonalMessageData();
        });
        this.subscription222 = PushNotification.addListener('BiaoJiMessageSuccess', () => {

            this._fetchPersonalMessageData();
        });

        //接受用户登录成功的通知
        this.subscription = PushNotification.addListener('LoginSuccess', (loginObject)=>{

            this.setState({

                isLogin: loginObject.Token,  //Token
                userName: loginObject.UserName, //用户名
                headerIcon: loginObject.UserHeaderIcon,//用户头像
                totalMoney: loginObject.TotalMoney,//用户总金额
                tkPrice: loginObject.TKPrice ? loginObject.TKPrice : '0.00', //提款金额
                Level:loginObject.Level,//代理
                is_GuestShiWan:loginObject.is_Guest,
                sign_event:loginObject.Sign_event,

            })
            if(loginObject.is_Guest==2) {
                this.setState({isShowShiWan:true})
            }

            //获取等级头衔信息
            this._fetchUserEventRise();


            //请求参数
            this._fetchPersonalMessageData();

            //签到是否关闭
            this._fetchMeiRiQianDaoData();

        });

        //接受用户退出登录的通知
        this.subscription4 = PushNotification.addListener('LoginOutSuccess', ()=>{
            this.refs.Toast && this.refs.Toast.show('退出登录成功!', 1000);
            this.setState({isLogin:'',messageArray:0,gerenfankui:0,qiandao:0,anquanzhongxin:0});
        });


        //接受刷新金额的通知
        this.subscription2 = PushNotification.addListener('RefreshUserTotalMoney', (money) => {

            //数字类型的取两位小数
            if (typeof(money) == 'number'){

                money = money.toFixed(2);
            }

            this.setState({totalMoney:money})
        });

        //接受用户修改头像的通知
        this.subscription3 = PushNotification.addListener('ChangeUserImage', (headerImage) => {
            this.setState({headerIcon:headerImage});
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

    //获取等级信息
    _fetchUserEventRise() {

        if (global.UserLoginObject.Uid != '') {

            let params = new FormData();
            params.append("ac", "GetUserEventRiseInfo");
            params.append("uid", global.UserLoginObject.Uid);
            params.append("token",global.UserLoginObject.Token);
            params.append("sessionkey",global.UserLoginObject.session_key);

            var promise = GlobalBaseNetwork.sendNetworkRequest(params);
            promise
                .then((responseData) => {

                    if (responseData.msg == 0) {

                        global.RiseEvent = 1;//请求到数据说明等级头衔开放
                    }
                })
                .catch((err) => {


                });
        }
    }

    //获取
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

                            this.setState({messageArray:0,gerenfankui:0,qiandao:0,anquanzhongxin:0})

                        } else {

                            // 顺便也刷一下金额吧。。。。
                            if (typeof(response.data.price) == 'number') {
                                response.data.price = response.data.price.toFixed(2);
                            }
                            global.UserLoginObject.TotalMoney = response.data.price;
                            this.setState({ totalMoney:response.data.price })
                            PushNotification.emit('RefreshHomeNavRightText', response.data.price); // 顺便首页导航的金额也刷新

                            if((1 & response.data.user_flag)>0){
                                Hongbaolihe = 1;
                            }else {
                                Hongbaolihe = 0;
                            }

                            if((2 & response.data.user_flag)>0){
                                this.setState({messageArray: 1})
                                PersonMessageArray = 1;
                            }else {
                                PersonMessageArray = 0;
                                this.setState({messageArray: 0})
                            }

                            if((4 & response.data.user_flag)>0){
                                this.setState({gerenfankui: 1})
                                Gerenfankui = 1;
                            }else {
                                Gerenfankui = 0;
                                this.setState({gerenfankui: 0})
                            }

                            if((8 & response.data.user_flag)>0){
                                this.setState({qiandao:1,})
                                Fuliqiandao = 1;
                            }else {
                                Fuliqiandao = 0;
                                this.setState({qiandao:0,})
                            }

                            if((16 & response.data.user_flag)>0){
                                AnQuanZhongXin = 1;
                                this.setState({anquanzhongxin:1,})
                            }else {
                                AnQuanZhongXin = 0;
                                this.setState({anquanzhongxin:0,})
                            }
                        }

                    } else {

                    }

                })
                .catch(err => {
                });
        }else {
            this.setState({
                isLogin: '',  //Token
                userName: '', //用户名
                headerIcon: '',//用户头像
                totalMoney: '',//用户总金额
                tkPrice: '', //提款金额
                Level:'',//代理
         
    
            })
        }

    }

    //设置用户信息
    _setUserInfo(){

        this.setState({

            isLogin: global.UserLoginObject.Token,  //Token
            userName: global.UserLoginObject.UserName, //用户名
            headerIcon: global.UserLoginObject.UserHeaderIcon,//用户头像
            totalMoney:  global.UserLoginObject.TotalMoney,//用户总金额
            tkPrice: global.UserLoginObject.TKPrice, //提款金额
            Level:global.UserLoginObject.Level,//代理
            is_GuestShiWan:global.UserLoginObject.is_Guest,
            sign_event:global.UserLoginObject.Sign_event,

        })
    }

    componentWillUnmount(){

        if (typeof(this.subscription) == 'object'){
            this.subscription && this.subscription.remove();
        }

        if (typeof(this.subscription4) == 'object'){
            this.subscription4 && this.subscription4.remove();
        }

        if (typeof(this.subscription2) == 'object'){
            this.subscription2 && this.subscription2.remove();
        }

        if (typeof(this.subscription3) == 'object'){
            this.subscription3 && this.subscription3.remove();
        }
        if (typeof(this.subscription222) == 'object'){
            this.subscription222 && this.subscription222.remove();
        }
        if (typeof(this.subscription6666) == 'object'){
            this.subscription6666 && this.subscription6666.remove();
        }
    }

    //刷新金额
    _onRershRMB(navigate){

        this.refs.LoadingView && this.refs.LoadingView.showLoading('正在刷新余额..');
        //请求参数

        let params = new FormData();
        params.append("ac", "flushPrice");
        params.append("uid", global.UserLoginObject.Uid);
        params.append("token", global.UserLoginObject.Token);
        params.append('sessionkey',global.UserLoginObject.session_key);
        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then(response => {

                this.refs.LoadingView && this.refs.LoadingView.cancer();
                if (response.msg == 0) {

                    this.refs.Toast.show('刷新金额成功!', 1000);

                    //数字类型的取两位小数
                    if (typeof(response.data.price) == 'number'){

                        response.data.price = response.data.price.toFixed(2);
                    }

                    global.UserLoginObject.TotalMoney = response.data.price;
                    // global.UserLoginObject.Sign_event = response.data._user.sign_event;//判断每日签到通道是否开启 0 未开，1开启
                    // global.UserLoginObject.Gift_event = response.data._user.gift_event;//判断红包通道是否开启0 未开，1开启
                    // global.UserLoginObject.RiseEvent = response.data._user.rise_event,//是不是开放等级页面
                    // global.UserInfo.updateUserInfo(global.UserLoginObject, (result) => {});

                    this.setState({
                        totalMoney:response.data.price,
                        tkPrice:response.data.last_get_price,
                    })

                    PushNotification.emit('RefreshHomeNavRightText', response.data.price); //我的界面刷新金额时首页也更新
                } else {
                    Alert.alert(
                        '提示',
                        response.param,
                        [
                            {text: '确定', onPress: () => {navigate('Login',{title:'登录',})}},
                            {text: '取消', onPress: () => {}},
                        ]
                    )
                }
            })
            .catch(err => { });
    }

    //渲染每个Item
    _renderItemView(item) {

        const { navigate } = this.props.navigation;

        //每个Cell的高度等于屏幕高度 - 头部的高度 - 充值头部高度
        let headHeight = SCREEN_HEIGHT == 812 ? 230 : 170;
        let chaHeight = this.state.isLogin ? 136 : 100
        let rowHeight = (SCREEN_HEIGHT - headHeight - chaHeight)/4;

        //空白区域不能点击
        return <TouchableOpacity onPress = {() => {item.index <= 9 ? this._clickMeBtn(item, navigate) : null}} activeOpacity={1} style = {{borderRightWidth:1, borderBottomWidth:1, borderColor:'#f3f3f3',justifyContent:'center', alignItems:'center', width:SCREEN_WIDTH/3, height:rowHeight, backgroundColor:'#fff'}}>
            <View style = {{flexDirection:'row'}}>
                <Image style = {{width:23, height:23}} source={personListImageArr[item.index]}/>
                {item.item.value.title == '个人消息'? (this.state.messageArray != 0? <View style = {{backgroundColor:'red', width:6, height:6, borderRadius:3}}/> : null):null}
                {item.item.value.title == '意见反馈'? (this.state.gerenfankui != 0? <View style = {{backgroundColor:'red', width:6, height:6, borderRadius:3}}/> : null):null}
                {item.item.value.title == '福利任务'? (this.state.qiandao != 0? <View style = {{backgroundColor:'red', width:6, height:6, borderRadius:3}}/> : null):null}
                {item.item.value.title == '安全中心'? (this.state.anquanzhongxin != 0? <View style = {{backgroundColor:'red', width:6, height:6, borderRadius:3}}/> : null):null}

            </View>
            <CusBaseText style = {{fontSize:Adaption.Font(17,14), color:'#414141', marginTop:10}}>
                {item.item.value.title}
            </CusBaseText>
        </TouchableOpacity>
    }

    _clickMeBtn(item, navigate) {

        //如果点击的是number类型，则是上面的按钮
        if (typeof(item) == 'number'){

            if (this.state.isLogin == ''){

                Alert.alert(
                    '提示',
                    '您还未登录,请先去登录',
                    [
                        {text: '确定', onPress: () => {navigate('Login',{title:'登录',})}},
                        {text: '取消', onPress: () => {}},
                    ]
                )
            }
            else {

                if (this.state.is_GuestShiWan == 2 ) { //试玩账号提示无权访问

                    Alert.alert(
                        '温馨提示',
                        '您的账号是试玩账号,没有权限访问!',
                        [
                            {text: '确定', onPress: () => {}},
                        ]
                    )
                }
                else {

                    switch (item) {
                        case 9:
                            navigate('RechargeCenter') //充值
                            break;

                        case 10:
                            //提现界面


                            if (global.UserLoginObject.Card_num){
                                navigate('DrawalInfo');
                            }
                            else {
                                navigate('BindBankCard',{callback: () => {},BindBankCardPreviousAction:'DrawalCenter'});
                            }
                            return;


                        case 11:
                            navigate('RechargeRecord',{title:'充值记录'})
                            break;

                        case 12:
                            navigate('BuyRecord',{title:'提款记录'})
                            break;

                        case 13:
                            if (QianDaoWeiHu==60007) {
                                Alert.alert(
                                    '提示',
                                    '该通道未开通',
                                    [
                                        {text: '确定', onPress: () => {}},
                                    ]
                                )
                                return;
                            }else {
                                navigate('DailyAttendance',{ callback: () => {
                                    this._fetchPersonalMessageData()
                                }})
                            }
                            break;

                        default:
                            break;
                    }
                }
            }
        }
        else {
            //点击FlatList的方法

            if (item.item.value.title != ''){

                if (this.state.isLogin == ''){ //未登录的情况下

                    if (item.item.value.title == '更多设置'){
                        navigate('MoreSetting', {title:'更多设置',})
                    }
                    else {
                        Alert.alert(
                            '提示',
                            '您还未登录,请先去登录',
                            [
                                {text: '确定', onPress: () => {navigate('Login',{title:'登录',})}},
                                {text: '取消', onPress: () => {}},
                            ]
                        )
                    }
                }
                else {
                    //登录的情况下,是否为试玩账号
                    if (this.state.is_GuestShiWan == 2) {

                        if (item.item.value.title != '') {

                            //试玩账号可以查看投注记录，中奖记录，更多设置

                            if (item.item.value.title == '中奖记录'){
                                navigate('MeWinRecord', {title:'中奖记录'});
                            }
                            else if (item.item.value.title  == '投注记录'){
                                navigate('TouZhuRecord', {wanfa: 1});
                            }
                            else  if (item.item.value.title== '更多设置'){
                                navigate('MoreSetting', {title:'更多设置',});
                            }
                            else {
                                Alert.alert(
                                    '温馨提示',
                                    '您的账号是试玩账号,没有权限访问!',
                                    [
                                        {text: '确定', onPress: () => {}},
                                    ]
                                )
                            }
                        }
                    }
                    else {

                        //正常的账号
                        //根据item的标题判断更加灵活。如果item为数字则点击的是FlatList头部的按钮，否则都是点击下面FlatList的按钮

                        if (item.item.value.title != '') {

                            if (item.item.value.title == '中奖记录') {
                                navigate('MeWinRecord', {title: '中奖记录'})
                            }
                            else if (item.item.value.title == '投注记录') {
                                navigate('TouZhuRecord', {wanfa: 1});
                            }
                            else if (item.item.value.title == '账户明细') {
                                navigate('AccountDetails', {title: '账户明细'})
                            }
                            else if (item.item.value.title == '现金交易') {

                                if (global.UserLoginObject.Card_num){
                                    navigate('CashTrasaAcount');
                                }
                                else {
                                    navigate('BindBankCard',{callback: () => {},BindBankCardPreviousAction:'CashTrasaCenter'});
                                }
                                return;

                            }
                            else if (item.item.value.title == '代理中心') {
                                //代理中心
                                if (this.state.Level == 0) {
                                    navigate('ApplicationAgentDelege')
                                } else {
                                    navigate('Theagency', {title: '代理中心'})
                                }
                            }
                            else if (item.item.value.title == '福利任务') {

                                navigate('WelfareTask', {title: '福利任务',  callback: () => {
                                    this._fetchPersonalMessageData()
                                }});
                            }
                            else if (item.item.value.title == '个人消息') {
                                navigate('PersonalMessage', {
                                    callback: () => {
                                        this._fetchPersonalMessageData()
                                    }
                                }) //个人消息
                            }
                            else if (item.item.value.title == '安全中心') {
                                navigate('Safetycenter', {title: '安全中心',
                                    callback: () => {
                                        this._fetchPersonalMessageData()
                                    }
                                })
                            }
                            else if (item.item.value.title == '更多设置') {
                                navigate('MoreSetting', {title: '更多设置'})
                            }
                            else if (item.item.value.title == '意见反馈') {
                                navigate('FeedbackList', {
                                    callback: () => {
                                        this._fetchPersonalMessageData()
                                    }
                                })
                            }
                            else if (item.item.value.title == '今日盈亏'){
                                navigate('TodayProfitLoss', {title:'今日盈亏'})
                            }
                        }
                    }
                }
            }
        }
    }

    _isShowisShowShiWanView(){
        return (
            <View style={{
                backgroundColor: 'rgba(0,0,0,0.1)',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <View style={{
                    width: SCREEN_WIDTH - 40,
                    height: 260,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    alignItems: 'center',

                }}>
                    <View style={{height:60, width:SCREEN_WIDTH - 40,backgroundColor:COLORS.appColor,justifyContent: 'center',alignItems: 'center',borderTopLeftRadius:10,borderTopRightRadius:10}}>
                        <CusBaseText style={{
                            fontSize: Adaption.Font(20, 20),
                            color: 'white',
                            textAlign: 'center',
                        }}>
                            欢迎免费试玩体验
                        </CusBaseText>
                    </View>
                    <View
                        style={{ width: SCREEN_WIDTH - 60, height: 80, marginTop: 5,flexDirection:'row' }}>
                        <CusBaseText style={{fontSize: Adaption.Font(18, 17), color: '#222222', }}>
                            <CusBaseText style={{fontSize: Adaption.Font(18, 17), color: 'red', }}>试玩账号</CusBaseText>只提供玩家熟悉游戏,不允许充值和提款,且不享有参加优惠活动的权利,有效时间<CusBaseText style={{fontSize: Adaption.Font(18, 17), color: 'red', }}>72小时</CusBaseText>。
                        </CusBaseText>
                    </View>

                    <TouchableOpacity activeOpacity={1}
                                      style={{ width:SCREEN_WIDTH-120,height:40,marginTop:60, justifyContent: 'center', alignItems: 'center',backgroundColor:COLORS.appColor, borderRadius: 20 }}
                                      onPress={() => this.onDown()}>
                        <CusBaseText
                            style={{ fontSize: Adaption.Font(17, 16), color: 'white', textAlign: 'center' }}>
                            确定
                        </CusBaseText>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    onDown(){
        this.setState({isShowShiWan:false})
    }


    //列表头部

    render() {

        const { navigate } = this.props.navigation;

        return <View style={{ flex: 1, backgroundColor:'#fff'}}>
            {this.state.isLogin != '' ? (<View style = {{backgroundColor:global.COLORS.appColor, height:SCREEN_HEIGHT == 812 ? 194 : 174, width:SCREEN_WIDTH}}>
                <View style = {{height:110, marginTop:SCREEN_HEIGHT == 812 ? 30 : 10, flexDirection:'row', alignItems:'center'}}>
                    <View style = {{flex:0.25}}>
                        <TouchableOpacity onPress={() => global.UserLoginObject.is_Guest == 2 ?  Alert.alert('温馨提示', '您的账号是试玩账号,没有权限访问!', [{text: '确定', onPress: () => {}}]) : navigate('MyInfo')} activeOpacity={0.7}>
                            <Image style = {{marginLeft:20, marginTop:10, width:50, height:50, borderRadius:25}}
                                   source = {this.state.headerIcon != "" ? { uri: this.state.headerIcon } : require('./img/ic_newme_defaultHead.png')}
                                   onError={({ nativeEvent: { error } }) => {
                                       this.setState({headerIcon:''});
                                   }} /></TouchableOpacity>
                    </View>
                    <View style = {{flex:0.65}}>
                        <CusBaseText style = {{color:'white', fontSize:Adaption.Font(20,17)}}>{global.UserLoginObject.UserName != '' ? global.UserLoginObject.UserName : ''}</CusBaseText>
                    </View>
                    <View style = {{flex:0.1}}>
                        <TouchableOpacity activeOpacity={0.7} onPress = {() => navigate('ChatService', {callback:() => {},title:'在线客服'})}>
                            <Image style = {{width:24, height:24}} source = {require('./img/ic_newme_chatService.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style = {{height:54, backgroundColor:'#f8752d', flexDirection:'row'}}>
                    <TouchableOpacity onPress={() => {this._onRershRMB(navigate)}} activeOpacity={0.8} style = {{flex:0.33, flexDirection:'row'}}>
                        <View style = {{flex:0.8, marginLeft:15}}>
                            <CusBaseText style = {{color:'#ffea01', fontSize:Adaption.Font(17,14), marginTop:5}}>
                                {this.state.totalMoney}
                            </CusBaseText>
                            <CusBaseText style = {{color:'white', fontSize:Adaption.Font(17,14), marginTop:8}}>
                                余额
                            </CusBaseText>
                        </View>
                        <View style = {{flex:0.2, alignItems:'center', justifyContent:'center'}}>
                            <Image style = {{width:22, height:22}} source = {require('./img/ic_newme_refresh.png')}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style = {{flex:0.33, flexDirection:'row'}}>
                        <View style = {{marginLeft:10, height:30, marginTop:12, width:1, backgroundColor:'white'}}/>
                        <View style = {{flex:0.99, marginLeft:10}}>
                            <CusBaseText style = {{color:'#ffea01', fontSize:Adaption.Font(17,14), marginTop:5}}>
                                {this.state.tkPrice}
                            </CusBaseText>
                            <CusBaseText style = {{color:'white', fontSize:Adaption.Font(17,13), marginTop:8,}}>
                                最近提款金额
                            </CusBaseText>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style = {{flex:0.33, flexDirection:'row'}} onPress = {() => this._clickMeBtn(13, navigate)}>
                        <View style = {{marginLeft:10, height:30, marginTop:12, width:1, backgroundColor:'white'}}/>
                        <View style = {{alignItems:'center', justifyContent:'center', flex:0.99}}>
                            <Image style = {{width:20, height:20}} source = {require('../img/ic_dayliySignUp.png')}/>
                            <CusBaseText style = {{color:'white', fontSize:Adaption.Font(17,14), marginTop:5}}>
                                签到
                            </CusBaseText>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>) : (<View style = {{backgroundColor:global.COLORS.appColor, height:SCREEN_HEIGHT == 812 ? 154 : 134, width:SCREEN_WIDTH, flexDirection:'row'}}>
                <View style = {{flex:0.1, marginTop:45}}>
                </View>
                <View style = {{justifyContent:'center', alignItems:'center', flex:0.8, marginTop:15}}>
                    <Image style = {{width:50, height:50, marginTop:10}} source = {require('./img/ic_newme_defaultHead.png')}/>
                    <View style = {{flexDirection:'row', marginTop:5}}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => {global.isHomeVcPush = false; global.isHomeAndLoginPush = false; navigate('Login', {title:'登录',})}}>
                            <CusBaseText style = {{marginRight:10,fontSize:Adaption.Font(24,20), color:'white'}}>
                                登录
                            </CusBaseText>
                        </TouchableOpacity>
                       <View style = {{marginTop:2, width:1, height:20, backgroundColor:'#fff'}}/>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => { global.isHomeVcPush = true; global.isHomeAndLoginPush = false; navigate('Register', { title: '注册' })}}>
                            <CusBaseText style = {{marginLeft:10,fontSize:Adaption.Font(24,20), color:'white'}}>
                                注册
                            </CusBaseText>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style = {{flex:0.1, marginTop:45}}>
                    <TouchableOpacity activeOpacity={0.7} onPress = {() => {

                        navigate('ChatService', {callback:() => {},title:'在线客服'});
                    }}>
                        <Image style = {{width:24, height:24}} source = {require('./img/ic_newme_chatService.png')}>
                        </Image>
                    </TouchableOpacity>
                </View>
            </View>)}
            <View style = {{height:Adaption.Height(70), width:SCREEN_WIDTH}}>
                <View style = {{height:Adaption.Height(63), backgroundColor:'#fff', flexDirection:'row'}}>
                    <TouchableOpacity onPress = {() => this._clickMeBtn(9, navigate)} style = {{flex:0.25, justifyContent:'center', alignItems:'center'}} activeOpacity={0.7}>
                        <Image style = {{width:23, height:23}} source = {require('./img/ic_newme_topUp.png')}/>
                        <CusBaseText style = {{fontSize:Adaption.Font(17,14), color:'#7d7d7d', marginTop:5}}>
                            我要充值
                        </CusBaseText>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress = {() => this._clickMeBtn(10, navigate)} style = {{flex:0.25, justifyContent:'center', alignItems:'center'}} activeOpacity={0.7}>
                        <Image style = {{width:23, height:23}} source = {require('./img/ic_newme_DrawCash.png')}/>
                        <CusBaseText style = {{fontSize:Adaption.Font(17,14), color:'#7d7d7d', marginTop:5}}>
                            我要提款
                        </CusBaseText>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress = {() => this._clickMeBtn(11, navigate)} style = {{flex:0.25, justifyContent:'center', alignItems:'center'}} activeOpacity={0.7}>
                        <Image style = {{width:23, height:23}} source = {require('./img/ic_newme_topUpRecord.png')}/>
                        <CusBaseText style = {{fontSize:Adaption.Font(17,14), color:'#7d7d7d', marginTop:5}}>
                            充值记录
                        </CusBaseText>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress = {() => this._clickMeBtn(12, navigate)} style = {{flex:0.25, justifyContent:'center', alignItems:'center'}} activeOpacity={0.7}>
                        <Image style = {{width:23, height:23}} source = {require('./img/ic_newme_drawRecord.png')}/>
                        <CusBaseText style = {{fontSize:Adaption.Font(17,14), color:'#7d7d7d', marginTop:5}}>
                            提款记录
                        </CusBaseText>
                    </TouchableOpacity>
                </View>
                <View style = {{height:Adaption.Height(7), backgroundColor:'#f3f3f3'}}/>
            </View>
            <FlatList
                data={this.state.personListData.length != 0 ? this.state.personListData : []}
                renderItem={item => this._renderItemView(item)}
                horizontal={false} //水平还是垂直
                numColumns={3} //指定多少列
                scrollEnabled={false} //禁止滑动
                showsVerticalScrollIndicator={false} //不显示右边滚动条
                extraData={this.state}
            />
            <Modal
                visible={this.state.isShowShiWan}
                //显示是的动画默认none
                //从下面向上滑动slide
                //慢慢显示fade
                animationType={'none'}
                //是否透明默认是不透明 false
                transparent={true}
                //关闭时调用
                onRequestClose={() => {
                }}
            >{this._isShowisShowShiWanView()}</Modal>
            <Toast ref="Toast" position='center'/>
            <LoadingView ref='LoadingView' />
        </View>
    }
}