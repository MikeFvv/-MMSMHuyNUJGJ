import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    StatusBar,
    Dimensions,
    ImageBackground,

} from 'react-native';

const {width, height} = Dimensions.get("window");
const KAdaptionWith = width / 414;
const KAdaptionHeight = height / 736;
import BaseNetwork from "../../../skframework/component/BaseNetwork"; //网络请求
export default class Safetycenter extends Component {

    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({navigation}) => ({

        header: (
            <CustomNavBar
                centerText={"安全中心"}
                leftClick={() => {
                    navigation.state.params.callback(), navigation.goBack()
                }}
            />
        ),

    });

    constructor(props) {
        super(props);
        this.state = {
            isBank: false,
            backArray: [],//银行列表数据
            question_1: '',//判断密保页视图
            question_2: '',//判断密保页视图
            question_3: '',//判断密保页视图
            text: 'noUpdate',//刷新文本
        };
    }

    componentWillMount() {

        let loginObject = global.UserLoginObject;
        this.setState({
            question_1: loginObject.Question_1,
            tkpass_ok: loginObject.Tkpass_ok,
            Phone: loginObject.Phone,
            Email: loginObject.Email,
            Qq_num: loginObject.Qq_num,
            Wechat: loginObject.Wechat,
            user: loginObject.UserName,
        });
    }


    componentDidMount() {

        //接收设置交易密码和密保问题的通知,通过setState重新渲染界面
        this.subscription = PushNotification.addListener('UpdateTextAtOnce', (text) => {
            this.setState({text: text});
        });

        this.subscription1 = PushNotification.addListener('MsgHasChange', (text) => {
            this.setState({});
        });

        global.passwordKey = this.props.navigation.state.key;
        this._fetchBankData();
    }


    componentWillUnmount() {
        if (typeof (this.subscription) == 'object') {
            this.subscription && this.subscription.remove();
        }

        if (typeof (this.subscription1) == 'object') {
            this.subscription1 && this.subscription1.remove();
        }
    }

    //获取银行数据
    _fetchBankData() {

        let loginObject = global.UserLoginObject;
        //请求参数
        let params = new FormData();
        params.append("ac", "getUserBankCard");
        params.append("uid", loginObject.Uid);
        params.append("token", loginObject.Token);
        params.append("sessionkey", global.UserLoginObject.session_key);

        var promise = BaseNetwork.sendNetworkRequest(params);

        promise
            .then(response => {
                if (response.msg == 0) {
                    let datalist = response.data;
                    global.BankListArray = [];
                    //用set去赋值
                    if (datalist == undefined || datalist.length == 0) {
                        this.setState({isBank: true})
                    } else {
                        this.setState({isBank: false})
                    }
                    if (datalist && datalist.length > 0) {
                        let dataBlog = [];
                        let i = 0;

                        datalist.map(dict => {
                            dataBlog.push({key: i, value: dict});
                            i++;
                        });
                        //用set去赋值
                        global.BankListArray = dataBlog;

                        this.setState({backArray: dataBlog});

                        datalist = null;
                        dataBlog = null;
                    }

                } else {
                    NewWorkAlert(response.param);
                }
            })
            .catch(err => {
            });
    }

    //绑定银行卡页面
    onClickGoToBank(navigate) {
        navigate('BangBankCar', {
            callback: () => {
                this.setState({backArray:global.BankListArray});
            }
        })

    }

    setWuYangBank(navigate) {
        return (
            <TouchableOpacity activeOpacity={1} style={{width: width - 30, height: 80, marginLeft: 15}}
                              onPress={() => this.onClickGoToBank(navigate)}>
                <Image resizeMode={'stretch'} style={{width: width - 30, height: 80}}
                       source={require('./img/ic_bankDef.png')}/>
            </TouchableOpacity>
        )
    }


    setBankCark(navigate) {
        let backBGImage = '';
        let backIcon = '';
        let bankName = '';
        let bankTitle = '';
        let bankQianTitle = '';
        let chuxuka = '';
        let bankMoRenKa = '';
        for (var i = 0; i < this.state.backArray.length; i++) {
            if (this.state.backArray[i].value.is_default == 1) {
                bankName = this.state.backArray[i].value.bank_typename;
                chuxuka = '储蓄卡';
                bankMoRenKa = require('./img/ic_backMoRen.png');
                bankQianTitle = this.state.backArray[i].value.card_num.substr(0, 4);
                bankTitle = this.state.backArray[i].value.card_num.substr(this.state.backArray[i].value.card_num.length - 4, 4);
                if (this.state.backArray[i].value.bank_typename == "中国农业银行") {
                    backBGImage = require('./img/ic_nongyeBank.png');
                    backIcon = require('./img/ic_LnongyeBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "中国建设银行") {
                    backBGImage = require('./img/ic_jiansheBank.png');
                    backIcon = require('./img/ic_LjiangsheBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "中国工商银行") {
                    backBGImage = require('./img/ic_gongshangBank.png');
                    backIcon = require('./img/ic_LgongshangBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "中国招商银行") {
                    backBGImage = require('./img/ic_zhaoshangBank.png');
                    backIcon = require('./img/ic_LzhaoshangBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "中国银行") {
                    backBGImage = require('./img/ic_zhongguoBank.png');
                    backIcon = require('./img/ic_LzhongguoBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "中国邮政储蓄") {
                    backBGImage = require('./img/ic_youzhengBank.png');
                    backIcon = require('./img/ic_LyouzhengBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "中国民生银行") {
                    backBGImage = require('./img/ic_mingshengBank.png');
                    backIcon = require('./img/ic_LmingshengBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "中信银行") {
                    backBGImage = require('./img/ic_zhongxinBank.png');
                    backIcon = require('./img/ic_LzhongxinBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "中国光大银行") {
                    backBGImage = require('./img/ic_guangdaBank.png');
                    backIcon = require('./img/ic_LguangdaBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "兴业银行") {
                    backBGImage = require('./img/ic_xingyeBank.png');
                    backIcon = require('./img/ic_LxingyeBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "华夏银行") {
                    backBGImage = require('./img/ic_huaxiaBank.png');
                    backIcon = require('./img/ic_LhuaxiaBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "北京银行") {
                    backBGImage = require('./img/ic_beijingBank.png');
                    backIcon = require('./img/ic_LbeijingBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "浦发银行") {
                    backBGImage = require('./img/ic_pufaBank.png');
                    backIcon = require('./img/ic_LpufaBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "广发银行") {
                    backBGImage = require('./img/ic_pufaBank.png');
                    backIcon = require('./img/ic_LpufaBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "平安银行") {
                    backBGImage = require('./img/ic_pinganBank.png');
                    backIcon = require('./img/ic_LpinganBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "浙商银行") {
                    backBGImage = require('./img/ic_zheshangBank.png');
                    backIcon = require('./img/ic_LzheshangBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "浙江稠州商业银行") {
                    backBGImage = require('./img/ic_hangzhouCZBank.png');
                    backIcon = require('./img/ic_LzhejiangCZBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "顺德农村信用合作社") {
                    backBGImage = require('./img/ic_shundeNCBank.png');
                    backIcon = require('./img/ic_LshundeNCBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "深圳发展银行") {
                    backBGImage = require('./img/ic_shenzhenFZBank.png');
                    backIcon = require('./img/ic_LshenzhenFZBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "上海银行") {
                    backBGImage = require('./img/ic_shanghaiBank.png');
                    backIcon = require('./img/ic_LshanghaiBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "上海农村商业银行") {
                    backBGImage = require('./img/ic_shanghaiSYBank.png');
                    backIcon = require('./img/ic_LshanghaiNCSYBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "南京银行") {
                    backBGImage = require('./img/ic_nanjingBank.png');
                    backIcon = require('./img/ic_LnanjingBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "交通银行") {
                    backBGImage = require('./img/ic_jiaotongBank.png');
                    backIcon = require('./img/ic_LjiaotongBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "杭州银行") {
                    backBGImage = require('./img/ic_hangzhouBank.png');
                    backIcon = require('./img/ic_LhangzhouBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "广州市农村信用社") {
                    backBGImage = require('./img/ic_guangzhouNCXYSBank.png');
                    backIcon = require('./img/ic_LguangzhouNCBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "东亚银行") {
                    backBGImage = require('./img/ic_dongyaBank.png');
                    backIcon = require('./img/ic_LdongyaBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "渤海银行") {
                    backBGImage = require('./img/ic_bohaiBank.png');
                    backIcon = require('./img/ic_LbohaiBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "北京农村商业银行") {
                    backBGImage = require('./img/ic_beijingNCSYBank.png');
                    backIcon = require('./img/ic_LbeijingNCSYBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "宁波银行") {
                    backBGImage = require('./img/ic_ningboBank.png');
                    backIcon = require('./img/ic_LningboBank.png');

                } else if (this.state.backArray[i].value.bank_typename == "广州银行") {
                    backBGImage = require('./img/ic_guangzhouBank.png');
                    backIcon = require('./img/ic_LguangzhouBank.png');

                } else {
                    backBGImage = require('./img/ic_qitaBank.png');
                    backIcon = require('./img/ic_qitaBankIcon.png');
                }
            }
        }
        return (
            <TouchableOpacity activeOpacity={1}
                              style={{width: width - 10, height: 80, marginLeft: 5, marginVertical: 15}}
                              onPress={() => this.onClickGoToBank(navigate)}>
                <ImageBackground style={{width: width - 10, height: 80}} source={backBGImage}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Image style={{width: 30, height: 30, marginTop: 5, marginLeft: 5, marginTop: 10}}
                               source={backIcon}>
                        </Image>
                        <View style={{
                            width: width - 10 - 60 - 5,
                            height: 45,
                            flexDirection: 'column',
                            backgroundColor: 'rgba(1,1,1,0)',
                            marginTop: 10
                        }}>
                            <CusBaseText style={{
                                flex: 1,
                                fontSize: Adaption.Font(15, 15),
                                color: 'white',
                                textAlign: 'left',
                                marginLeft: 5
                            }}>
                                {bankName}
                            </CusBaseText>
                            <CusBaseText style={{
                                flex: 1,
                                fontSize: Adaption.Font(13, 12),
                                color: '#D3D3D3',
                                textAlign: 'left',
                                marginLeft: 6
                            }}>
                                {chuxuka}
                            </CusBaseText>
                        </View>
                        <Image style={{width: 30, height: 30}} source={bankMoRenKa}>
                        </Image>
                    </View>
                    <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'rgba(1,1,1,0)', marginTop: 20}}>
                        <CusBaseText style={{
                            fontSize: Adaption.Font(18, 16),
                            color: 'white',
                            textAlign: 'center',
                            fontWeight: '500'
                        }}>
                        {bankQianTitle} **** **** {bankTitle}
                        </CusBaseText>
                    </View>
                </ImageBackground>
            </TouchableOpacity>

        )
    }


    render() {


        let name = global.UserLoginObject.Real_name;
        if (name.length > 0) {
            console.log('haha');
        }
        const {navigate} = this.props.navigation;
        return (

            <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'white'}}>

                <View style={{backgroundColor: '#F3F3F3', height: 10}}/>

                {/*设置交易密码、修改登录密码、绑定银行卡*/}
                <View style={[styles.rowSuperview]}>

                    {/*设置交易密码*/}
                    <TouchableOpacity activeOpacity={0.65} underlayColor={'#F3F3F3'}
                                      onPress={() => navigate('ChangeTransPsd', {tkpass_ok: global.UserLoginObject.Tkpass_ok,})}
                                      style={styles.touchItem}>
                        <View style={styles.touchItem}>


                            <Image style={styles.iconStyles} source={require('../img/ic_tranpaword1.png')}/>
                            <CusBaseText
                                style={styles.textTop}>{global.UserLoginObject.Tkpass_ok == 0 ? '设置交易密码' : '修改交易密码'}</CusBaseText>

                            {global.UserLoginObject.Tkpass_ok == 0 ?<View style={styles.bonteStyle}/>:null}
                        </View>
                    </TouchableOpacity>


                    <View style={{backgroundColor: '#e2e2e2', height: SCREEN_WIDTH / 3, width: 0.5}}/>

                    {/*修改登录密码*/}
                    <TouchableOpacity activeOpacity={0.65} underlayColor={'#F3F3F3'}
                                      onPress={() => navigate('ChangePsd', {title: '修改登录密码'})} style={styles.touchItem}>
                        <View style={styles.touchItem}>
                            <Image style={styles.iconStyles} source={require('../img/ic_password1.png')}/>
                            <CusBaseText style={styles.textTop}>{'修改登录密码'}</CusBaseText>
                        </View>
                    </TouchableOpacity>

                    <View style={{backgroundColor: '#e2e2e2', height: SCREEN_WIDTH / 3, width: 0.5}}/>

                    {/*绑定银行卡*/}
                    <TouchableOpacity activeOpacity={0.65} underlayColor={'#F3F3F3'}
                                      onPress={() => navigate('BangBankCar', {
                                          callback: () => {
                                            this.setState({backArray:global.BankListArray});
                                          }
                                      })} style={styles.touchItem}>
                        <View style={styles.touchItem}>

                            {this.state.isBank ?<View style={styles.bonteStyle}/>:null}

                                <Image style={styles.iconStyles} source={require('../img/ic_bindcard1.png')}/>
                            <CusBaseText style={styles.textTop}>{'绑定银行卡'}</CusBaseText>
                        </View>
                    </TouchableOpacity>

                </View>

                <View style={{backgroundColor: '#e2e2e2', height: 0.5}}/>


                {/*修改真实姓名、设置密保问题、绑定邮箱*/}
                <View style={[styles.rowSuperview]}>

                    {/*修改真实姓名*/}
                    <TouchableOpacity activeOpacity={0.65} underlayColor={'#F3F3F3'}
                                      onPress={() => navigate('ChangeName')}
                                      style={styles.touchItem}>

                        <View style={styles.touchItem}>

                            {global.UserLoginObject.Real_name.length > 1 ? null:<View style={styles.bonteStyle}/>}

                            <Image style={styles.iconStyles} source={require('../img/ic_realname1.png')}/>
                            <CusBaseText
                                style={styles.textTop}>{global.UserLoginObject.Real_name.length > 1 ? '修改真实姓名' : '设置真实姓名'}</CusBaseText>
                        </View>
                    </TouchableOpacity>

                    <View style={{backgroundColor: '#e2e2e2', height: SCREEN_WIDTH / 3, width: 0.5}}/>

                    {/*设置密保问题*/}
                    <TouchableOpacity activeOpacity={0.65} underlayColoric_password={'#F3F3F3'}
                                      onPress={() => navigate('ChangeEncrypt', {
                                          question_1: this.state.question_1,
                                          user: this.state.user,
                                      })} style={styles.touchItem}>
                        <View style={styles.touchItem}>
                            {global.UserLoginObject.Question_1 == '0' ? <View style={styles.bonteStyle}/> :null}

                            <Image style={styles.iconStyles} source={require('../img/ic_security1.png')}/>
                            <CusBaseText
                                style={styles.textTop}>{global.UserLoginObject.Question_1 == '0' ? '设置密保问题' : '修改密保问题'}</CusBaseText>
                        </View>
                    </TouchableOpacity>

                    <View style={{backgroundColor: '#e2e2e2', height: SCREEN_WIDTH / 3, width: 0.5}}/>

                    {/*绑定邮箱*/}
                    <TouchableOpacity activeOpacity={0.65} underlayColor={'#F3F3F3'}
                                      onPress={() => navigate('BindEmail', {Email: this.state.Email})}
                                      style={styles.touchItem}>
                        <View style={styles.touchItem}>

                            {global.UserLoginObject.Email.length > 1 ? null:<View style={styles.bonteStyle}/>}

                            <Image style={styles.iconStyles} source={require('../img/ic_bindmail1.png')}/>
                            <CusBaseText
                                style={styles.textTop}>{global.UserLoginObject.Email.length > 1 ? '修改邮箱' : '绑定邮箱'}</CusBaseText>
                        </View>
                    </TouchableOpacity>


                </View>

                <View style={{backgroundColor: '#e2e2e2', height: 0.5}}/>

                {/*绑定手机、绑定微信、绑定qq*/}
                <View style={styles.rowSuperview}>

                    {/*绑定手机*/}
                    <TouchableOpacity activeOpacity={0.65} underlayColor={'#F3F3F3'}
                                      onPress={() => navigate('ChangePhoNum', {Phone: '123'})} style={styles.touchItem}>
                        <View style={styles.touchItem}>
                            {global.UserLoginObject.Phone.length > 1 ? null:<View style={styles.bonteStyle}/>}

                            <Image style={styles.iconStyles} source={require('../img/ic_bindphone1.png')}/>
                            <CusBaseText
                                style={styles.textTop}>{global.UserLoginObject.Phone.length > 1 ? '修改手机' : '绑定手机'}</CusBaseText>
                        </View>
                    </TouchableOpacity>

                    <View style={{backgroundColor: '#e2e2e2', height: SCREEN_WIDTH / 3, width: 0.5}}/>

                    {/*绑定微信*/}
                    <TouchableOpacity activeOpacity={0.65} underlayColor={'#F3F3F3'}
                                      onPress={() => navigate('BindWechat', {Wechat: this.state.Wechat})}
                                      style={styles.touchItem}>
                        <View style={styles.touchItem}>
                            {global.UserLoginObject.Wechat.length > 1 ? null:<View style={styles.bonteStyle}/>}

                            <Image style={styles.iconStyles} source={require('../img/ic_bindwx1.png')}/>
                            <CusBaseText
                                style={styles.textTop}>{global.UserLoginObject.Wechat.length > 1 ? '修改微信' : '绑定微信'}</CusBaseText>
                        </View>
                    </TouchableOpacity>

                    <View style={{backgroundColor: '#e2e2e2', height: SCREEN_WIDTH / 3, width: 0.5}}/>

                    {/*绑定qq*/}
                    <TouchableOpacity activeOpacity={0.65} underlayColor={'#F3F3F3'}
                                      onPress={() => navigate('BindQQ', {Qq_num: this.state.Qq_num})}
                                      style={styles.touchItem}>
                        <View style={styles.touchItem}>
                            {global.UserLoginObject.Qq_num.length > 1 ? null:<View style={styles.bonteStyle}/>}

                            <Image style={styles.iconStyles} source={require('../img/ic_bindqq1.png')}/>
                            <CusBaseText
                                style={styles.textTop}>{global.UserLoginObject.Qq_num.length > 1 ? '修改QQ' : '绑定QQ'}</CusBaseText>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{backgroundColor: '#f3f3f3', height: 10}}/>

                {/*绑定信用卡*/}

                <View style={{height: 50, justifyContent: 'center', alignItems: 'center'}}>

                    <CusBaseText style={{fontSize: 15, color: '#4d4d4c'}}>
                        {'默认提现银行卡'}
                    </CusBaseText>
                </View>

                {this.state.isBank ? this.setWuYangBank(navigate) : this.setBankCark(navigate)}

            </View>
        );
    }
}

const styles = StyleSheet.create({

    //一整行布局
    rowSuperview: {
        flexDirection: 'row',
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH / 3,
        // backgroundColor: 'red',
    },

    //红点
    bonteStyle:{

        backgroundColor: 'red',
        width:6,
        height: 6,
        position: 'absolute',
        right:(SCREEN_WIDTH == 320?40:48),
        top:(SCREEN_WIDTH == 320?26:34),
        borderRadius:3
    },

    //每一个按钮大背景
    touchItem: {
        // flex: 1,
        // flexDirection: 'row',
        // height: 60,
        justifyContent: 'center',
        alignItems: 'center',

        width: SCREEN_WIDTH / 3,
        height: SCREEN_WIDTH / 3,
        // backgroundColor: 'yellow',
    },

    iconStyles: {
        width: 21,
        height: 21,
    },

    //文字
    textTop: {
        marginTop: 16,
        fontSize: Adaption.Font(17, 15),
        color: '#414141'
    },


    textBottom: {
        marginTop: 5,
        color: COLORS.global_subtitle_color,
    },

    item: {
        flex: 1,
        flexDirection: 'row',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },


})
