import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Alert,
    TextInput,
    StatusBar,
    Image,
    Dimensions
} from 'react-native';
const { width, height } = Dimensions.get("window");
const KAdaptionWith = width / 414;
const KAdaptionHeight = height / 736;

import Adaption from "../../../skframework/tools/Adaption";
import BaseNetwork from "../../../skframework/component/BaseNetwork";
import Moment from 'moment';

var CryptoJS = require("crypto-js");  //加密的库
var registerKey = ''; //注册的秘钥

export default class FreeShiWan extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isArgree: true,
            veriyCode: this._showCode(),
            inputUserName: '',  //试玩
            inputPWD: '',  //试玩密码
            inputComformPWD: '', //确认的密码
            inputCode: '',  //输入的验证码
            imgConformCode:'',  //后台返回的Base64验证码
        }
    }

    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({ navigation }) => ({

        header: (
            <CustomNavBar
                centerText = {"免费试玩"}
                leftClick={() =>  navigation.goBack() }
            />
        ),

        // title: "免费试玩",
        // headerStyle: {backgroundColor: COLORS.appColor, marginTop: Android ?(parseFloat(global.versionSDK) > 19?StatusBar.currentHeight:0) : 0},
        // headerTitleStyle: { color: 'white' ,alignSelf:'center'},
        // //加入右边空视图,否则标题不居中  ,alignSelf:'center'
        // headerRight: (
        //     <View style={GlobalStyles.nav_blank_view} />
        // ),
        // headerLeft: (
        //     <TouchableOpacity
        //         activeOpacity={1}
        //         style={GlobalStyles.nav_headerLeft_touch}
        //         onPress={() => { navigation.goBack() }}>
        //         <View style={GlobalStyles.nav_headerLeft_view} />
        //     </TouchableOpacity>
        // ),
    });


    componentDidMount() {

        this._fetchMianFeiData();
    }
    _fetchMianFeiData() {

        //请求参数
        let params = new FormData();
        params.append("ac", "getGuestUsername");

        var promise = BaseNetwork.sendNetworkRequest(params);

        promise
            .then(response => {

                if (response.msg == 0&&response.data !=undefined) {
                    //用set去赋值
                    this.setState({ inputUserName: response.data });
                } else {
                    Alert.alert(
                        '提示',
                        response.param,
                        [
                            { text: '确定', onPress: () => { } },
                        ]
                    )
                }


            })
            .catch(err => { { } });
    }

    //验证码随机数的方法
    _showCode() {

        let code = '';
        //请求参数
        let params = new FormData();

        let shijianchuo = Moment().format('X');
        let arcdomStr = Math.floor(Math.random() * 1000);
        let encodeStr = shijianchuo + arcdomStr;
        encodeStr = CryptoJS.MD5(encodeStr).toString();

        params.append("ac", "getVerify");
        params.append("key", encodeStr);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);

        promise
            .then(response => {

                if (response.msg == 0) {

                    registerKey = encodeStr;
                    this.setState({
                        imgConformCode:response.data,
                    })

                }
                else{
                    return '';
                }
            })
            .catch(err => {

                return '';

            });
    }

    //注册按钮点击的方法
    _registerShiWanMethod() {


        if (this.state.isArgree == false){

          Alert.alert(
            '提示',
            '请先勾选服务协议',
            [
              { text: '确定', onPress: () => { } },
            ]
          )

        }
        else {

          if (this.state.inputUserName.length == 0
              || this.state.inputPWD.length == 0
              || this.state.inputComformPWD.length == 0
              || this.state.inputCode.length == 0
          ) {
              this._showInfo('请完善您填写的信息');
          }
          else {

              if (this.state.inputPWD != this.state.inputComformPWD) {
                  this._showInfo('两次输入的密码不一致');
                  return;
              }

              this.refs.LoadingView && this.refs.LoadingView.showLoading('正在注册...');

              let params = new FormData();  //创建请求数据表单
              params.append("ac", "guestReg");
              params.append("username", this.state.inputUserName.trim());
              params.append("password", this.state.inputPWD.trim());
              params.append("client_type", iOS ? 3 : 2);
              params.append("edition", global.VersionNum);
              params.append("key", registerKey);
              params.append("vcode", this.state.inputCode);

              var promise = GlobalBaseNetwork.sendNetworkRequest(params);

              promise
                  .then(response => {

                      this.refs.LoadingView && this.refs.LoadingView.cancer(0);
                      //请求成功
                      if (response.msg == 0&&response.data !=undefined) {
                          this.refs.LoadingView && this.refs.LoadingView.showSuccess('注册成功');

                          let headerIcon = '';
                          if (response.data._user.head_icon.length > 0) {
                              headerIcon = response.data._user.head_icon;
                          }

                          let loginObject = {
                              'Uid': response.data._user.uid,
                              'Question_1': response.data._user.question_1,
                              'Question_2': response.data._user.question_2,
                              'Question_3': response.data._user.question_3,
                              'Tkpass_ok': response.data._user.tkpass_ok,
                              'Phone': response.data._user.phone,
                              'Email': response.data._user.email,
                              'Wechat': response.data._user.wechat,
                              'Qq_num': response.data._user.qq_num,
                              'Real_name': response.data._user.real_name,
                              'Token': response.data.token,
                              'TotalMoney': response.data.user_price.toString(),
                              'UserName': response.data._user.username,
                              'TKPrice': response.data._user.last_get_price.toString(),
                              'UserHeaderIcon': headerIcon,
                              'Sign_event': response.data._user.sign_event,//判断每日签到通道是否开启 0 未开，1开启
                              'Gift_event': response.data._user.gift_event,//判断红包通道是否开启0 未开，1开启
                              'Card_num': response.data._user.card_num,//默认的银行卡号 判断是否绑定银行卡
                              'Level': response.data._user.level,//代理判断
                              'is_Guest': response.data._user.is_guest,//判断是否是试玩账号
                              'RiseEvent': response.data._user.rise_event,//是不是开放等级页面

                              'fp_ssc': response.data._user.fp_ssc, // 时时彩
                              'fp_pcdd': response.data._user.fp_pcdd, // PC蛋蛋
                              'fp_k3': response.data._user.fp_k3, // 快3
                              'fp_pk10': response.data._user.fp_pk10, // PK10
                              'fp_3d': response.data._user.fp_3d, // 3D
                              'fp_11x5': response.data._user.fp_11x5, // 11选5
                              'fp_lhc': response.data._user.fp_lhc, // 六合彩
                              'user_Name': this.state.userText, //用户名称
                              'user_Pwd': this.state.pwdText,  //用户密码
                              'rise_lock': response.data._user.rise_lock, //每日加奖跳动
                          };

                          global.UserLoginObject = loginObject;

                          //将数据存到本地, 延迟一分钟再赋值，可能可以防止出现登录失败也赋值的问题😂
                          setTimeout(() => {
                              global.UserInfo.shareInstance();
                              global.UserInfo.saveUserInfo(global.UserLoginObject, (result) => {
                              });
                          }, 30000);

                          //是否首页进入注册，再进入免费试玩界面
                          if (global.isHomeVcPush == true && global.isHomeAndLoginPush == false) {

                              this.props.navigation.goBack(global.infoLogin);

                          } else {

                              this.props.navigation.goBack(global.RegisterSuccessGoToMeKey);

                          }

                          setTimeout(()=>{
                              PushNotification.emit('LoginSuccess', global.UserLoginObject);
                          },300)

                      }
                      else {
                          this._showInfo(response.param);
                      }
                  })
                  .catch(err => { });

          }

        }

    }

    //弹出提示框的方法
    _showInfo(content) {
        Alert.alert(
            '提示',
            content,
            [
                { text: '确定', onPress: () => { } },
            ]
        )
    }

    render() {
        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                <View style={styles.container_RegisterView}>
                    <View style={{ borderBottomWidth: 0.7, borderColor: 'lightgrey', height: 50 * KAdaptionHeight, flexDirection: 'row', alignItems: 'center' }}>
                        <CusBaseText style={{ fontSize: Adaption.Font(17, 15), color: 'black', marginLeft: 5 }}>用户账号</CusBaseText>
                        <TextInput allowFontScaling={false} defaultValue={this.state.inputUserName} underlineColorAndroid='transparent' style={{ width: 200, fontSize: Adaption.Font(16, 14), marginLeft: 20, padding: 0 }}></TextInput>
                    </View>
                    <View style={{ borderBottomWidth: 0.7, borderColor: 'lightgrey', height: 50 * KAdaptionHeight, flexDirection: 'row', alignItems: 'center' }}>
                        <CusBaseText style={{ fontSize: Adaption.Font(17, 15), color: 'black', marginLeft: 5 }}>登录密码</CusBaseText>
                        <TextInput allowFontScaling={false} returnKeyType="done" onChangeText={(text) => this.state.inputPWD = text} secureTextEntry={true} placeholder='请输入密码' underlineColorAndroid='transparent' style={{ width: 200, fontSize: Adaption.Font(16, 14), marginLeft: 20, padding: 0 }}></TextInput>
                    </View>
                    <View style={{ borderBottomWidth: 0.7, borderColor: 'lightgrey', height: 50 * KAdaptionHeight, flexDirection: 'row', alignItems: 'center' }}>
                        <CusBaseText style={{ fontSize: Adaption.Font(17, 15), color: 'black', marginLeft: 5 }}>重复密码</CusBaseText>
                        <TextInput allowFontScaling={false} returnKeyType="done" onChangeText={(text) => this.state.inputComformPWD = text} secureTextEntry={true} placeholder='请再次输入密码' underlineColorAndroid='transparent' style={{ width: 200, fontSize: Adaption.Font(16, 14), marginLeft: 20, padding: 0 }}></TextInput>
                    </View>
                    <View style={{ borderBottomWidth: 0.7, borderColor: 'lightgrey', height: 50 * KAdaptionHeight, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 0.2 }}><CusBaseText style={{ fontSize: Adaption.Font(17, 15), color: 'black', marginLeft: 5 }}>验证码</CusBaseText></View>
                        <View style={{ flex: 0.5 }}><TextInput allowFontScaling={false} returnKeyType="done" keyboardType={global.iOS ? 'number-pad' : 'numeric'} onChangeText={(text) => this.state.inputCode = text} placeholder='输入验证码' underlineColorAndroid='transparent' maxLength={4} style={{ width: 200, fontSize: Adaption.Font(16, 14), marginLeft: 20, padding: 0 }}></TextInput></View>
                        <View style={{ flex: 0.3 }}>
                            <TouchableOpacity activeOpacity={1} onPress={() => this.setState({ veriyCode: this._showCode() })}>
                                <Image style={{ width: 85, height: Adaption.Width(40)}} source={this.state.imgConformCode != "" ? {uri: this.state.imgConformCode} : (require('../img/ic_refreshCode.png'))}>
                                </Image>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ height: 50 * KAdaptionHeight, flexDirection: 'row', alignItems: 'center' }}>
                        {this.state.isArgree == true ? (<View style={{ marginLeft: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                          <TouchableOpacity onPress={() => { this.setState({ isArgree: false }) }} activeOpacity={1} style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                              <Image style={{ width: Adaption.Width(18), height: Adaption.Width(18), borderColor: 'grey', borderWidth: 1 }} source={require('../img/ic_checkBox.png')}></Image>
                              <CusBaseText style={{ fontSize: Adaption.Font(16, 14), color: 'black' }}>我已同意并阅读</CusBaseText>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => { navigate('ServiceArgreement', { title: GlobalConfig.userData.web_name + '服务协议' }) }} activeOpacity={0.5}>
                              <CusBaseText style={{ fontSize: Adaption.Font(15, 13), color: 'red' }}>《{GlobalConfig.userData.web_name}服务协议》</CusBaseText>
                          </TouchableOpacity></View>) : (<View style={{ marginLeft: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                          <TouchableOpacity onPress={() => { this.setState({ isArgree: true }) }} activeOpacity={1} style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                              <View style={{ borderColor: 'grey', borderWidth: 1, width: Adaption.Width(18), height: Adaption.Width(18) }}></View>
                              <CusBaseText style={{ fontSize: Adaption.Font(16, 14), color: 'black' }}>我已同意并阅读</CusBaseText>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => { navigate('ServiceArgreement', { title: GlobalConfig.userData.web_name + '服务协议' }) }} activeOpacity={0.5}>
                              <CusBaseText style={{ fontSize: Adaption.Font(15, 13), color: 'red' }}>《{GlobalConfig.userData.web_name}服务协议》</CusBaseText>
                          </TouchableOpacity></View>)}
                    </View>
                </View>
                <View style={{ marginTop: 30 * KAdaptionHeight, marginLeft: 15, marginRight: 15 }}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => this._registerShiWanMethod()} style={styles.container_RegisterView_Btn}>
                        <CusBaseText style={{ fontSize: Adaption.Font(18, 16), color: 'white' }}>立即注册</CusBaseText>
                    </TouchableOpacity>
                </View>
                <View style={{ marginLeft: 15, marginRight: 15, flexDirection: 'row', marginTop: 20 * KAdaptionHeight }}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => { navigate('ChatService', {callback:() => { }, title: '在线客服' }) }} style={{ flex: 0.2 }}>
                        <CusBaseText style={{ fontSize: Adaption.Font(15, 13), color: 'black' }}>在线客服</CusBaseText>
                    </TouchableOpacity>
                    <View style={{ flex: 0.43 }}></View>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => { this.props.navigation.goBack(global.infoLogin); }} style={{ flex: 0.4 }}>
                        <CusBaseText style={{ fontSize: Adaption.Font(15, 13), color: 'black' }}>已有账号直接登录</CusBaseText>
                    </TouchableOpacity>
                </View>
                <CusBaseText style={{ marginLeft: 15, marginRight: 15, marginTop: 20 * KAdaptionHeight, color: 'red', fontSize: Adaption.Font(15, 13), height: 180 * KAdaptionHeight }}>
                    1、每个IP每天仅允许有3个试玩账号;{'\n'}2、每个试玩账号从注册开始,有效时间为72小时,超过时间系统自动回收;{'\n'}3、试玩账号仅供玩家熟悉游戏,不允许充值和提款;{'\n'}
                    4、试玩账号不享有参加优惠活动的权利;{'\n'}5、试玩账号的赔率仅供参考,可能与正式账号赔率不相符;{'\n'}6、其他未说明事项以本公司解释为准.
                </CusBaseText>
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

    container_RegisterView: {
        marginTop: 30 * KAdaptionHeight,
        marginLeft: 15,
        marginRight: 15,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'lightgrey',
        height: 250 * KAdaptionHeight,

    },

    container_RegisterView_Btn: {
        backgroundColor:COLORS.appColor,
        height: 40 * KAdaptionHeight,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },

});
