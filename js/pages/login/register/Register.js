import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Alert,
    TextInput,
    Image,
    Dimensions,
    AsyncStorage,
    NetInfo,
} from 'react-native';

const {width, height} = Dimensions.get("window");
const KAdaptionWith = width / 414;
const KAdaptionHeight = height / 736;

import Adaption from "../../../skframework/tools/Adaption";
import LocalVcode from '../../me/safeCenter/LocalValidation';

var isNetWorkConnected = true;   //网络链接是否正常

export default class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isArgree: true,
            veriyCode: '',
            inputUserName: '',  //注册的用户名
            inputPWD: '',  //注册的密码
            inputComformPWD: '', //确认的密码
            inputCode: '',  //输入的验证码
            inputInviteCode: '', //输入的邀请码
            isNeedInviteCode: '0',  //是否需要邀请码 0:不需要 1:需要
            imgConformCode: '',  //后台返回的Base64验证码
            isShowLoginView: false,  //是否显示登录界面视图,从首页点击注册按钮进入
            userText: '',   //用户名
            pwdText: '',    //密码
        }
    }

    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({navigation}) => ({
        header: (
            <CustomNavBar
                centerText={"快速注册"}
                leftClick={() => navigation.goBack()}
            />
        ),
    });

    componentWillMount() {

        //获取本地是否缓存邀请码，防止请求失败后不需要邀请码的也会出现邀请码
        AsyncStorage.getItem('iSNeedInviteCode', (error, result) => {
            if (!error) {

                if (result !== '' && result !== null) {

                    let inviteCodeType = JSON.parse(result);
                    this.setState({
                        isNeedInviteCode: inviteCodeType,
                    })
                }
            }
            else {
                //没有缓存则读取请求的信息
                if (GlobalConfig.userData.param_type) {
                    this.setState({
                        isNeedInviteCode: GlobalConfig.userData.param_type,
                    })
                }
            }
        })
    }

    componentDidMount() {

        global.infoLogin = this.props.navigation.state.key;

        global.rcode.length > 0 ? this.state.inputInviteCode = global.rcode : this.state.inputInviteCode = "";  //如果有默认邀请码则赋值

        NetInfo.isConnected.fetch().then(isConnected => {

            isNetWorkConnected = isConnected;
        });


    }

    //注册按钮点击的方法
    _registerMethod() {

        this.state.inputUserName = this.state.inputUserName.trim();
        this.state.inputPWD = this.state.inputPWD.trim();


        //是否需要邀请码进行注册
        let result = this.state.isNeedInviteCode == '' ? (this.state.inputUserName.length == 0 || this.state.inputPWD.length == 0
            || this.state.inputComformPWD.length == 0 || this.state.inputCode.length == 0 || this.state.inputInviteCode.length == 0) :
            (this.state.inputUserName.length == 0 || this.state.inputPWD.length == 0
                || this.state.inputComformPWD.length == 0 || this.state.inputCode.length == 0);

        if (this.state.isArgree == false) {

            Alert.alert(
                '提示',
                '请先勾选服务协议',
                [
                    {
                        text: '确定', onPress: () => {
                    }
                    },
                ]
            )

        }
        else {

            if (result) {
                this._showInfo('请完善您填写的信息');
            }
            else {

                //账号格式不正确
                if (!GlobalRegex(this.state.inputUserName, 'user')){
                    this.refs.LoadingView && this.refs.LoadingView.showFaile('输入的账号格式不正确', 1);
                    return;
                }
                else if (!GlobalRegex(this.state.inputPWD, 'password')){
                    this.refs.LoadingView && this.refs.LoadingView.showFaile('输入的密码格式不正确', 1);
                    return;
                }
                else if (this.state.inputPWD != this.state.inputComformPWD) {
                    this._showInfo('两次输入的密码不一致');
                    return;
                }
                //验证码不正确
                else if (this.state.inputCode != this.state.veriyCode){
                    this.refs.LoadingView && this.refs.LoadingView.showFaile('验证码不正确', 1);
                    return;
                }
                else {
                    this.refs.LoadingView && this.refs.LoadingView.showLoading('正在注册'); //注册成功

                    let isNeedInvitedCode = this.state.isNeedInviteCode == '' ? true : false;

                    let params = new FormData();  //创建请求数据表单
                    params.append("ac", "regUser");
                    params.append("username", this.state.inputUserName);
                    params.append("password", this.state.inputPWD);
                    params.append("tg_code", isNeedInvitedCode ? this.state.inputInviteCode.trim() : (GlobalConfig.userData.bind_param ? GlobalConfig.userData.bind_param : '')); //非邀请码模式默认传后台返回的邀请码
                    params.append("vcode", '6666');
                    params.append("vid", 'b97ec930-7c7c-11e8-acae-0242ac190002');
                    params.append("edition", global.VersionNum);
                    var mainUrl =  global.GlobalConfig.baseURL;
                    if (mainUrl.includes('http://'))
                    {
                        mainUrl = mainUrl.substring(7,mainUrl.length);
                    }
                    params.append("domain", mainUrl);  //附带主线路域名

                    var promise = GlobalBaseNetwork.sendNetworkRequest(params);

                    promise
                        .then(response => {

                            this.refs.LoadingView && this.refs.LoadingView.cancer(0); //注册成功
                            //请求成功
                            if (response.msg == 0 && response.data) {

                                this._encodeLoginAuto(response.data.code, response.data.uid);
                            }
                            else {
                                //验证码不正确重新刷新
                                this._showInfo(response.param ? response.param : '');
                            }
                        })
                        .catch(err => {

                            let errStr = err.message;

                            if (errStr.includes("request failed")) {
                                errStr = '服务器请求失败';
                            }

                            this.refs.LoadingView && this.refs.LoadingView.showFaile(errStr, 3);  //服务器请求错误提示

                        });
                }
            }
        }
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
                    'session_key':response.data.session_key,
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
                    'is_Guest': response.data.text,//判断是否是试玩账号 test 0=正式 ，1=测试 ，2=试玩
                    // 'RiseEvent': response.data.rise_event,//是不是开放等级页面
                    'fp_ssc': response.data.fp_ssc, // 时时彩
                    'fp_pcdd': response.data.fp_pcdd, // PC蛋蛋
                    'fp_k3': response.data.fp_k3, // 快3
                    'fp_pk10': response.data.fp_pk10, // PK10
                    'fp_3d': response.data.fp_3d, // 3D
                    'fp_11x5': response.data.fp_11x5, // 11选5
                    'fp_lhc': response.data.fp_lhc, // 六合彩
                    'user_Name': this.state.inputUserName, //用户名称
                    'user_Pwd': this.state.inputPWD,  //用户密码
                    'codePWD' : response.data.code,  //加密登录
                    //'rise_lock': response.data.rise_lock, //每日加奖跳动
                };

                global.UserLoginObject = loginObject;

                //将数据存到本地
                global.UserInfo.shareInstance();
                global.UserInfo.saveUserInfo(loginObject, (result) => {
                });

                this.refs.LoadingView && this.refs.LoadingView.showSuccess('注册成功');

                // 从投注界面进来的。
                if (this.props.navigation.state.params.isBuy == true) {
                    //global.ShouYeYinDao=1;
                    PushNotification.emit('RefreshBalls');
                }

                //是否首页进入登录界面，goback返回界面不一样
                if (global.isHomeVcPush == true && global.isHomeAndLoginPush == false) {

                    this.props.navigation.goBack();

                } else {

                    this.props.navigation.goBack(global.RegisterSuccessGoToMeKey);

                }

                setTimeout(() => {
                    PushNotification.emit('LoginSuccess', global.UserLoginObject);
                    PushNotification.emit('HomeYinDao', global.UserLoginObject);
                }, 300)
            })
            .catch(err => {

            });
    }

    //弹出提示框的方法
    _showInfo(content) {

        Alert.alert(
            '提示',
            content,
            [
                {
                    text: '确定', onPress: () => {
                }
                },
            ]
        )
    }

    render() {

        const {navigate} = this.props.navigation;

        return (

            <View style={styles.container}>
                <View style={[styles.container_RegisterView, {height: this.state.isNeedInviteCode == '' ? (Adaption.Width(300)) : (Adaption.Width(250))}]}>
                    {this.state.isNeedInviteCode == '' ? (<View style={styles.container_RegisterView_TextView}>
                        <CusBaseText
                            style={{fontSize: Adaption.Font(17, 15), color: 'black', marginLeft: 5}}>邀请码   </CusBaseText>
                        <TextInput allowFontScaling={false} returnKeyType="done"
                                   keyboardType={global.iOS ? 'number-pad' : 'numeric'}
                                   onChangeText={(text) => this.setState({inputInviteCode: text})} maxLength={6}
                                   placeholder='请输入邀请码' defaultValue={global.rcode.length > 0 ? global.rcode : ""}
                                   underlineColorAndroid='transparent' style={{
                            width: 200,
                            fontSize: Adaption.Font(16, 14),
                            marginLeft: 20,
                            padding: 0
                        }} />
                    </View>) : null}
                    <View style={styles.container_RegisterView_TextView}>
                        <CusBaseText
                            style={{fontSize: Adaption.Font(17, 15), color: 'black', marginLeft: 5}}>用户账号</CusBaseText>
                        <TextInput allowFontScaling={false} returnKeyType="done" autoCapitalize={'none'}
                                   onChangeText={(text) => this.setState({inputUserName: text})} placeholder='请输入用户名'
                                   underlineColorAndroid='transparent' style={{
                            width: 200,
                            fontSize: Adaption.Font(16, 14),
                            marginLeft: 20,
                            padding: 0
                        }} />
                    </View>
                    <View style={styles.container_RegisterView_TextView}>
                        <CusBaseText
                            style={{fontSize: Adaption.Font(17, 15), color: 'black', marginLeft: 5}}>登录密码</CusBaseText>
                        <TextInput allowFontScaling={false} returnKeyType="done"
                                   onChangeText={(text) => this.setState({inputPWD: text})} secureTextEntry={true}
                                   placeholder='请输入密码' underlineColorAndroid='transparent' style={{
                            width: 200,
                            fontSize: Adaption.Font(16, 14),
                            marginLeft: 20,
                            padding: 0
                        }} />
                    </View>
                    <View style={styles.container_RegisterView_TextView}>
                        <CusBaseText
                            style={{fontSize: Adaption.Font(17, 15), color: 'black', marginLeft: 5}}>重复密码</CusBaseText>
                        <TextInput allowFontScaling={false} returnKeyType="done"
                                   onChangeText={(text) => this.setState({inputComformPWD: text})}
                                   secureTextEntry={true} placeholder='再次输入密码' underlineColorAndroid='transparent'
                                   style={{
                                       width: 200,
                                       fontSize: Adaption.Font(16, 14),
                                       marginLeft: 20,
                                       padding: 0
                                   }} />
                    </View>
                    <View style={styles.container_RegisterView_TextView}>
                        <View style={{flex: 0.3}}><CusBaseText style={{
                            fontSize: Adaption.Font(17, 15),
                            color: 'black',
                            marginLeft: 5
                        }}>验证码</CusBaseText></View>
                        <View style={{flex:0.68}}>
                            <TextInput allowFontScaling={false} returnKeyType="done"
                             keyboardType={global.iOS ? 'number-pad' : 'numeric'}
                             onChangeText={(text) => this.setState({inputCode: text})}
                             placeholder='输入验证码' underlineColorAndroid='transparent'
                             maxLength={4} style={{width: 200, fontSize: Adaption.Font(16, 14), marginLeft: 20, padding: 0}} />
                        </View>
                        <LocalVcode
                            type={'number'}
                            maxDeg={5}
                            minDeg={-5}
                            maxFont={16}
                            minFont={14}
                            fontWeightArr={['normal']}
                            fontArr={['normal']}
                            getValue={(vcode) => this.state.veriyCode = vcode}
                        />
                    </View>
                    <View style={{width:SCREEN_WIDTH, height: 50, flexDirection: 'row', alignItems: 'center'}}>
                        {this.state.isArgree == true ? (<View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <TouchableOpacity onPress={() => {
                                    this.setState({isArgree: false})
                                }} activeOpacity={1} style={{
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    flex:0.43
                                }}>
                                    <Image style={{
                                        width: Adaption.Width(18),
                                        height: Adaption.Width(18),
                                        marginLeft:10,
                                        borderColor: 'grey',
                                        borderWidth: 1
                                    }} source={require('../img/ic_checkBox.png')} />
                                    <CusBaseText
                                        style={{marginLeft:5, fontSize: Adaption.Font(16, 14), color: 'black'}}>注册即表示同意</CusBaseText>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    navigate('ServiceArgreement', {title: GlobalConfig.userData.web_title + '服务协议'})
                                }} activeOpacity={0.5} style = {{flex:0.5}}>
                                    <CusBaseText style={{
                                        fontSize: Adaption.Font(15, 13),
                                        color: '#0aa1ea'
                                    }} numberOfLines={1}>《{GlobalConfig.userData.web_title}服务协议》</CusBaseText>
                                </TouchableOpacity></View>) :
                            (<View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <TouchableOpacity onPress={() => {
                                    this.setState({isArgree: true})
                                }} activeOpacity={1} style={{
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    flex:0.43
                                }}>
                                    <View style={{
                                        borderColor: 'grey',
                                        borderWidth: 1,
                                        marginLeft:10,
                                        width: Adaption.Width(18),
                                        height: Adaption.Width(18)
                                    }} />
                                    <CusBaseText
                                        style={{ marginLeft:5, fontSize: Adaption.Font(16, 14), color: 'black'}}>注册即表示同意</CusBaseText>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    navigate('ServiceArgreement', {title: GlobalConfig.userData.web_title + '服务协议'})
                                }} activeOpacity={0.5} style = {{flex:0.5}}>
                                    <CusBaseText style={{
                                        fontSize: Adaption.Font(15, 13),
                                        color: '#0aa1ea'
                                    }} numberOfLines={1}>《{GlobalConfig.userData.web_title}服务协议》</CusBaseText>
                                </TouchableOpacity>
                            </View>)}
                    </View>
                </View>
                <View style={{marginTop: 25, marginLeft: 15, marginRight: 15}}>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => {
                        this._registerMethod()
                    }} style={styles.container_RegisterView_Btn}>
                        <CusBaseText style={{fontSize: Adaption.Font(18, 16), color: 'white'}}>立即注册</CusBaseText>
                    </TouchableOpacity>
                </View>

                <View style={{marginLeft: 15, marginRight: 15, flexDirection: 'row', marginTop: 20}}>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => {
                        navigate('ChatService', {callback:() => {},title: '在线客服'})
                    }} style={{flex: 0.3}}>
                        <CusBaseText style={{fontSize: Adaption.Font(16, 14), color: 'black'}}>在线客服</CusBaseText>
                    </TouchableOpacity>
                    <View style={{flex: 0.45}}></View>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => {

                        this.props.navigation.goBack()

                    }} style={{flex: 0.51}}>
                        <CusBaseText style={{fontSize: Adaption.Font(15, 13), color: 'black'}}>已有账号?直接登录</CusBaseText>
                    </TouchableOpacity>
                </View>
                <CusBaseText style={{
                    marginLeft: 15,
                    marginRight: 15,
                    marginTop: 20,
                    color: 'red',
                    fontSize: Adaption.Font(15),
                    height: 80
                }}>1、用户账号请输入5~20个英文字母或数字或下划线，不能使用中文。{'\n'}2、登录密码请输入6~20个英文字母或数字或下划线</CusBaseText>
                <LoadingView ref='LoadingView'/>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },


    container_RegisterView: {
        marginTop: 30 * KAdaptionHeight,
        marginLeft: 15,
        marginRight: 15,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'lightgrey',

    },

    container_RegisterView_TextView: {
        borderBottomWidth: 0.7,
        borderColor: 'lightgrey',
        height: Adaption.Width(50),
        flexDirection: 'row',
        alignItems: 'center',
    },

    container_RegisterView_Btn: {
        backgroundColor: COLORS.appColor,
        height: Adaption.Width(44),
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },

    container_inPutTextView: {
        borderWidth: 1.0,
        borderColor: 'lightgrey',
        borderRadius: 5,
        height: 40,
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
