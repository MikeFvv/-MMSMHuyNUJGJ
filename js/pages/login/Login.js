import React, { Component } from 'react';
import {
    StyleSheet,
    NetInfo,
    View,
    TouchableOpacity,
    Image,
    TextInput,
    Alert,
    StatusBar,
} from 'react-native';
import { Keyboard, AsyncStorage } from 'react-native'
import Toast, { DURATION } from 'react-native-easy-toast'
import Adaption from "../../skframework/tools/Adaption";
import BaseNetwork from "../../skframework/component/BaseNetwork"; //网络请求
import AllenNavStyle from '../home/AllenNavStyle';
import LocalVcode from '../me/safeCenter/LocalValidation';  //本地验证

import Regex from '../../skframework/component/Regex'

var isNetWorkConnected = true;
var registerKey = ''; //注册的秘钥

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userText: '',
            pwdText: '',
            veriyCode: '',  //本地的验证码
            imgConformCode: '', //后台返回的Base64验证码
            inputCode: '',  //输入的验证码
        }
    }

    // isBuy: this.props.navigation.state.params.isBuy

    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({ navigation }) => ({
        header: (
            <AllenNavStyle

                centerText={navigation.state.params.title}

                // leftClick={() => navigation.goBack()}
                leftClick={() => navigation.state.params.loginClick == true ? setTimeout(
                    () => { navigation.state.params.loginClick = false;},
                    1000
                ): navigation.goBack()}
            />
        ),
        title: navigation.state.params.title,
        headerStyle: { backgroundColor: COLORS.appColor, marginTop: Android ? (parseFloat(global.versionSDK) > 19 ? StatusBar.currentHeight : 0) : 0 },
        headerTitleStyle: { color: 'white', alignSelf: 'center' },
        //加入右边空视图,否则标题不居中  ,alignSelf:'center'
        headerRight: (
            <View style={GlobalStyles.nav_blank_view} />
        ),
        headerLeft: (
            <TouchableOpacity
                activeOpacity={1}
                style={GlobalStyles.nav_headerLeft_touch}
                onPress={() => { navigation.goBack() }}>
                <View style={GlobalStyles.nav_headerLeft_view} />
            </TouchableOpacity>
        ),
    });


    componentDidMount() {

        //记住注册，免费试玩登录的key 成功后跳转

        global.RegisterSuccessGoToMeKey = this.props.navigation.state.key;

        if (this.props.navigation.state.params.indexR == 1) {
            this.refs.toast.show('登录超时,请重新登录!', 1000);
        }

        NetInfo.isConnected.fetch().then(isConnected => {

            isNetWorkConnected = isConnected;
        });
    }

    //登录点击的函数
    _lonGinBtnClick() {
        //隐藏键盘
        Keyboard.dismiss();

        this.state.userText = this.state.userText.trim();
        this.state.pwdText = this.state.pwdText.trim();

        if (this.state.userText.length == 0) {
            this._showInfo('用户名不能为空');
            return;
        }
        else if (this.state.userText.length < 4) {
            this._showInfo('用户名的格式不正确');
            return;
        }
        else if (this.state.pwdText.length == 0) {
            this._showInfo('密码不能为空');
            return;
        }
        else if (this.state.pwdText.length < 4) {
            this._showInfo('密码的格式不正确');
            return;
        }
        else if (!Regex(this.state.userText, 'LoginUser')) {
            this._showInfo('用户名请输入4-20个英文字母 或数字 或下划线');
            return;
        }
        else if (!Regex(this.state.pwdText, 'LoginPassword')) {
            this._showInfo('密码请输入6-20个英文字母 或数字 或下划线');
            return;
        }
        else if (this.state.inputCode.length == 0) {
            this._showInfo('验证码不能为空');
            return;
        }
        else if (this.state.inputCode != this.state.veriyCode){
            this._showInfo('验证码不正确');
            return;
        }
        else {
            this.refs.LoadingView && this.refs.LoadingView.showLoading('正在登录...');
            let params = new FormData();
            params.append("ac", "userLogin");
            params.append("username", this.state.userText);  //去掉首尾空格
            params.append("password", this.state.pwdText);
            params.append("edition", global.VersionNum);
            params.append("vcode", '6666');
            params.append("vid", 'b97ec930-7c7c-11e8-acae-0242ac190002');

            var mainUrl = global.GlobalConfig.baseURL;
            if (mainUrl.includes('http://')) {
                mainUrl = mainUrl.substring(7, mainUrl.length);
            }
            params.append("domain", mainUrl);  //附带主线路域名

            var promise = BaseNetwork.sendNetworkRequest(params);

            promise
                .then(response => {

                    this.refs.LoadingView && this.refs.LoadingView.cancer(0);
                    //请求成功
                    if (response.msg == 0 && response.data) {

                        this.refs.LoadingView && this.refs.LoadingView.showSuccess('登录成功');

                        this.props.navigation.state.params.indexR == 0;
                        let headerIcon = '';
                        if (response.data.head_icon.length > 0) {
                            headerIcon = response.data.head_icon;
                        }
                        if(HomeYinDao == 0) {
                            HomeYinDao = 1;
                            let homeyindaoObjcet = {
                                homeYinDao: 1,
                            }

                            let homeYinDaoValue = JSON.stringify(homeyindaoObjcet);

                            let key = 'HomeYinDaoObjcet';
                            UserDefalts.setItem(key, homeYinDaoValue, (error) => {
                                if (!error) {
                                }
                            });

                        }else {
                            let homeyindaoObjcet = {
                                homeYinDao: 0,
                            }

                            let homeYinDaoValue = JSON.stringify(homeyindaoObjcet);

                            let key = 'HomeYinDaoObjcet';
                            UserDefalts.setItem(key, homeYinDaoValue, (error) => {
                                if (!error) {
                                }
                            });
                        }

                        let loginObject = {
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
                            'user_Name': this.state.userText, //用户名称
                            'user_Pwd': this.state.pwdText,  //用户密码
                            'codePWD': response.data.code,  //加密登录
                            //'rise_lock': response.data.rise_lock, //每日加奖跳动
                        };

                        //赋值
                        global.UserLoginObject = loginObject;


                        //将数据存到本地, 延迟10秒再赋值，可能可以防止出现登录失败也赋值的问题😂
                        setTimeout(() => {

                            global.UserInfo.shareInstance();
                            global.UserInfo.saveUserInfo(global.UserLoginObject, (result) => {
                            });
                        }, 10000);

                        global.GPlayDatas = {}; //重新登录，清空玩法数据, 再存GPlayDatas数据
                        let datas = JSON.stringify(global.GPlayDatas);
                        AsyncStorage.setItem('PlayDatas', datas, (error) => { });

                        // 从投注界面进来的。
                        if (this.props.navigation.state.params.isBuy == true) {
                            // global.ShouYeYinDao=1;
                            PushNotification.emit('RefreshBalls');
                        }

                        this.props.navigation.goBack();
                        setTimeout(() => {
                            PushNotification.emit('HomeYinDao', global.UserLoginObject);
                            PushNotification.emit('LoginSuccess', global.UserLoginObject);
                        }, 300)

                    }
                    else {

                        if (response.param) {

                            if (response.param.includes('JSON')){
                                this.refs.LoadingView && this.refs.LoadingView.showFaile('登录失败!');
                            }
                            else {

                                this.refs.LoadingView && this.refs.LoadingView.showFaile(response.param);
                            }
                        }
                    }
                })
                .catch(err => {


                    let errStr = err.message;
                    if (errStr.includes("request failed")) {

                        if (isNetWorkConnected == true) {
                            errStr = '服务器请求失败';
                        }
                        else {
                            errStr = '网络请求失败';
                        }
                    }
                    else if (errStr.includes('JSON')){

                        this.refs.LoadingView && this.refs.LoadingView.showFaile('服务器错误,登录失败!');
                    }

                    this.refs.LoadingView && this.refs.LoadingView.showFaile(errStr);
                });
        }
    }

    _showInfo(title) {
        Alert.alert(
            '温馨提示',
            title,
            [
                { text: '确定', onPress: () => { } },
            ]
        )
    }


    //注册成功后进行加密登录
    _encodeLoginAuto(code, uid){

        let params = new FormData();
        params.append("ac", "encodeLogin");
        params.append("uid", uid);  //去掉首尾空格
        params.append("code", code);
        params.append("edition", global.VersionNum);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);

        promise
            .then(response => {

                let headerIcon = '';
                if (response.data.head_icon.length > 0) {
                    headerIcon = response.data.head_icon;
                }

                let loginObject = {
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

                global.UserLoginObject = loginObject;

                //将数据存到本地
                global.UserInfo.shareInstance();
                global.UserInfo.saveUserInfo(loginObject, (result) => {
                });

                this.refs.LoadingView && this.refs.LoadingView.showSuccess('登录成功');

                // 从投注界面进来的。
                if (this.props.navigation.state.params.isBuy == true) {
                    // global.ShouYeYinDao=1;
                    PushNotification.emit('RefreshBalls');
                }

                //是否首页进入登录界面，goback返回界面不一样
                if (global.isHomeVcPush == true && global.isHomeAndLoginPush == false) {

                    this.props.navigation.goBack();

                } else {

                    this.props.navigation.goBack(global.RegisterSuccessGoToMeKey);

                }

                setTimeout(() => {
                    PushNotification.emit('HomeYinDao', global.UserLoginObject);
                    PushNotification.emit('LoginSuccess', global.UserLoginObject);
                }, 300)
            })
            .catch(err => {

            });
    }
    //登录试玩的函数
    _lonGinShiwanClick() {

        this.refs.LoadingView && this.refs.LoadingView.showLoading('正在登录...');
        let params = new FormData();
        params.append("ac", "regGuestUser");
        params.append("edition", global.VersionNum);
        params.append("tg_code", GlobalConfig.userData.bind_param ? GlobalConfig.userData.bind_param : '');


        var promise = BaseNetwork.sendNetworkRequest(params);

        promise
            .then(response => {

                this.refs.LoadingView && this.refs.LoadingView.cancer(0);
                //请求成功
                if (response.msg == 0 && response.data) {

                    this._encodeLoginAuto(response.data.code, response.data.uid);
                }
                else {

                    if (response.param) {
                        this.refs.LoadingView && this.refs.LoadingView.showFaile(response.param);
                    }
                }
            })
            .catch(err => {


                let errStr = err.message;
                if (errStr.includes("request failed")) {

                    if (isNetWorkConnected == true) {
                        errStr = '服务器请求失败';
                    }
                    else {
                        errStr = '网络请求失败';
                    }
                }

                this.refs.LoadingView && this.refs.LoadingView.showFaile(errStr);
            });

    }


    render() {
        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                <View style={[styles.container_inPutTextView, { marginTop: 40 }]}>
                    <Image style={styles.container_inPutTextView_Image} source={require('./img/ic_loginUser.png')} />
                    <TextInput
                        allowFontScaling={false}
                        returnKeyType="done"
                        autoCapitalize={'none'}
                        onChangeText={(text) => this.setState({ userText: text })}
                        placeholder='请输入用户名' underlineColorAndroid='transparent'
                        style={{ marginLeft: 10, width: 300, fontSize: 15, padding: 0 }}
                    >
                    </TextInput>
                </View>
                <View style={[styles.container_inPutTextView, { marginTop: 20 }]}>
                    <Image style={styles.container_inPutTextView_Image} source={require('./img/ic_loginPWD.png')} />
                    <TextInput allowFontScaling={false} returnKeyType="done" autoCapitalize={'none'} secureTextEntry={true} onChangeText={(text) => this.setState({ pwdText: text })}  placeholder='请输入密码' underlineColorAndroid='transparent' style={{ marginLeft: 10, width: 300, fontSize: 15, padding: 0 }} />
                </View>

                <View style={[styles.container_inPutTextView, { marginTop: 20 }]}>
                    <Image style={styles.container_inPutTextView_Image} source={require('./img/ic_verCode.png')} />
                    <TextInput returnKeyType="done" autoCapitalize={'none'} onChangeText={(text) => this.setState({ inputCode: text })} placeholder='请输入验证码' keyboardType = {'number-pad'}  underlineColorAndroid='transparent' style={{ marginLeft: 10, marginRight: 10, flex: 1, fontSize: 15, padding: 0 }} />
                    <LocalVcode
                        type={'number'}
                        maxDeg={5}
                        minDeg={-5}
                        maxFont={20}
                        minFont={18}
                        fontWeightArr={['normal']}
                        fontArr={['normal']}
                        getValue={(vcode) => this.state.veriyCode = vcode}
                    />
                </View>

                <View style={{ marginLeft: 15, marginRight: 15, flexDirection: 'row', marginTop: 20 }}>
                    <TouchableOpacity activeOpacity={1} onPress={() => navigate('ForgetPWD', { title: '密码找回' })} style={{ flex: 0.3 }}>
                        <CusBaseText style={{ fontSize: Adaption.Font(16, 14), color: 'black' }}> 忘记密码？</CusBaseText>
                    </TouchableOpacity>
                    <View style={{ flex: 0.56 }} />
                    <TouchableOpacity activeOpacity={1} onPress={() => {

                        if (global.isHomeVcPush == true) {

                            global.isHomeAndLoginPush = true;
                        }
                        else {
                            global.isHomeAndLoginPush = false;
                        }

                        navigate('ChatService', { callback: () => { }, title: '在线客服' })
                    }
                    }
                                      style={{ flex: 0.24 }}>
                        <CusBaseText style={{ fontSize: Adaption.Font(16, 14), color: 'black' }}>在线客服</CusBaseText>
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 30, marginLeft: 15, marginRight: 15 }}>
                    <TouchableOpacity activeOpacity={1} onPress={() => this._lonGinBtnClick()} style={{ backgroundColor: '#fc7c3f', height: Adaption.Width(44), borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <CusBaseText style={{ fontSize: Adaption.Font(18, 16), color: 'white' }}>登录</CusBaseText>
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 17, marginLeft: 15, marginRight: 15 }}>
                    <TouchableOpacity activeOpacity={1} onPress={() => navigate('Register', { title: '注册', isBuy: this.props.navigation.state.params.isBuy})} style={{ backgroundColor: 'white', borderColor: COLORS.appColor, borderWidth: 1, height: Adaption.Width(44), borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <CusBaseText style={{ fontSize: Adaption.Font(18, 16), color: COLORS.appColor }}>立即注册</CusBaseText>
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 17, marginLeft: 15, marginRight: 15 }}>
                    {GlobalConfig.userData.guest_status != '0' ?  <TouchableOpacity activeOpacity={1} onPress={() => this._lonGinShiwanClick()} style={{ backgroundColor: 'white', borderColor: COLORS.appColor, borderWidth: 1, height: Adaption.Width(44), borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <CusBaseText style={{ fontSize: Adaption.Font(18, 16), color: COLORS.appColor }}>免费试玩</CusBaseText>
                    </TouchableOpacity> : null}
                </View>

                <Toast
                    ref="toast"
                    position='bottom'
                />
                <LoadingView ref='LoadingView' />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },

    container_inPutTextView: {
        borderWidth: 1.0,
        borderColor: 'lightgrey',
        borderRadius: 5,
        height: 45,
        marginLeft: 15,
        marginRight: 15,
        flexDirection: 'row',
        alignItems: 'center',
        width: window.width
    },

    container_inPutTextView_Image: {
        width: 20,
        height: 20,
        marginLeft: 10
    },


});
