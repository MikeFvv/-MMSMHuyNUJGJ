import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    Alert,
    TouchableOpacity,
    Image,
} from 'react-native';

var registerKey = '';  //验证码秘钥

export default class ChangePhoNum extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oldPhoneNum: '',
            newPhoneNum: '',
            Phone: global.UserLoginObject.Phone,
            waiting: false,//防多次点击
            inputVerNum: '',  //验证码
            inputVerImg:'', //验证码图片
        }
    }

    //接收上一个页面传过来的titl  e显示出来
    static navigationOptions = ({navigation}) => ({

        header: (
            <CustomNavBar
                centerText={global.UserLoginObject.Phone.length > 1 ? '修改手机' : '绑定手机'}
                leftClick={() => navigation.goBack()}
            />
        ),
    });

    componentWillMount(){

        this._showCode();
    }

    //验证码随机数的方法
    _showCode() {

        let params = new FormData();

        params.append("ac", "getVerifyImage");

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);

        promise
            .then(response => {

                if (response.msg == 0) {

                    registerKey = response.data.vid;
                    this.setState({
                        inputVerImg: response.data.img,
                    })

                }
                else {
                    return '';
                }
            })
            .catch(err => {

                return '';

            });
    }


    render() {
        const {navigate} = this.props.navigation;

        if (global.UserLoginObject.Phone.length > 1) {
            // 说明已经设置过手机号码
            return (
                <View style={styles.container}>


                    <View style={{
                        borderRadius: 4,
                        borderColor: 'rgba(191,191,191,1)',
                        borderWidth: 1,
                        marginTop: 25,
                        marginLeft: 15,
                        marginRight: 15
                    }}>


                        <View style={styles.container_inPutTextViewTop}>
                            <CusBaseText style={{
                                fontSize: 16,
                                color: '#4F4F4F',
                                flex: 0.24,
                                marginLeft: 5,
                            }}>{'原手机'}</CusBaseText>
                            <TextInput allowFontScaling={false} keyboardType={'number-pad'}
                                       onChangeText={(text) => this.setState({oldPhoneNum: text})}
                                       placeholder={global.UserLoginObject.Phone} underlineColorAndroid='transparent'
                                       style={{marginLeft: 15, fontSize: 15, flex: 0.76}}/>
                        </View>

                        <View style={styles.container_inPutTextViewTop}>
                            <CusBaseText style={{
                                fontSize: 16,
                                color: '#4F4F4F',
                                flex: 0.24,
                                marginLeft: 5,
                            }}>{'新手机'}</CusBaseText>
                            <TextInput allowFontScaling={false} keyboardType={'number-pad'}
                                       onChangeText={(text) => this.setState({newPhoneNum: text})}
                                       placeholder='请输入新手机号码'
                                       underlineColorAndroid='transparent'
                                       style={{marginLeft: 15, fontSize: 15, flex: 0.76}}/>
                        </View>

                        {/*验证码*/}
                        <View style={{
                            height: 50,
                            width: window.width,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>


                            {/*<View style={{flex:1,flexDirection: 'row',height: 50,justifyContent: 'center',*/}
                            {/*alignItems: 'center',}}>*/}
                            <CusBaseText style={{
                                fontSize: 16,
                                color: '#4F4F4F',
                                flex: 0.4,
                                marginLeft: 5,
                            }}>{'验证码'}</CusBaseText>

                            <TextInput allowFontScaling={false} keyboardType={'number-pad'}
                                       onChangeText={(text) => this.setState({inputVerNum: text})}
                                       placeholder='请输入验证码' underlineColorAndroid='transparent'
                                       maxLength={4}
                                       style={{marginLeft: 15, fontSize: 15, flex: (SCREEN_WIDTH == 320 ? 0.6 : 0.7)}}/>

                            {/*</View>*/}
                            <TouchableOpacity activeOpacity={0.8} style = {{width:Adaption.Width(110), height:50}} onPress={()=>{this._showCode()}}>
                            <Image
                                style={{position: 'absolute', right: 0, bottom: 0, width:Adaption.Width(110), height:50, resizeMode:'contain'}}
                                source={this.state.inputVerImg != "" ? {uri: this.state.inputVerImg} : (require('../../login/img/ic_refreshCode.png'))}
                            />
                            </TouchableOpacity>

                        </View>


                    </View>
                    <TouchableOpacity activeOpacity={0.65}
                                      onPress={() => this._repeatClick(navigate)}>
                        <View style={{
                            height: 45,
                            backgroundColor: COLORS.appColor,
                            marginLeft: 20,
                            marginRight: 20,
                            borderRadius: 5,
                            marginTop: 40,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <CusBaseText style={{color: 'white', fontSize: 17}}>{'立即修改'}</CusBaseText>
                        </View>
                    </TouchableOpacity>

                    <LoadingView ref='LoadingView'/>

                </View>
            );
        } else {
            //   说明没有设置过手机号码

            return (
                <View style={styles.container}>


                    <View style={{
                        borderRadius: 4,
                        borderColor: 'rgba(191,191,191,1)',
                        borderWidth: 1,
                        marginTop: 25,
                        marginLeft: 15,
                        marginRight: 15
                    }}>

                        <View style={styles.container_inPutTextViewTop}>
                            <CusBaseText style={{
                                fontSize: 16,
                                color: '#4F4F4F',
                                flex: 0.24,
                                marginLeft: 5,
                            }}>{'手机号'}</CusBaseText>
                            <TextInput allowFontScaling={false} keyboardType={'number-pad'}
                                       onChangeText={(text) => this.setState({newPhoneNum: text})}
                                       placeholder='请输入手机号码' underlineColorAndroid='transparent'
                                       style={{marginLeft: 15, fontSize: 15, flex: 0.76}}/>
                        </View>


                        {/*验证码*/}
                        <View style={{
                            height: 50,
                            width: window.width,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>


                            {/*<View style={{flex:1,flexDirection: 'row',height: 50,justifyContent: 'center',*/}
                            {/*alignItems: 'center',}}>*/}
                            <CusBaseText style={{
                                fontSize: 16,
                                color: '#4F4F4F',
                                flex: 0.4,
                                marginLeft: 5,
                            }}>{'验证码'}</CusBaseText>

                            <TextInput allowFontScaling={false} keyboardType={'number-pad'}
                                       onChangeText={(text) => this.setState({inputVerNum: text})}
                                       placeholder='请输入验证码' underlineColorAndroid='transparent'
                                       maxLength={4}
                                       style={{marginLeft: 15, fontSize: 15, flex: (SCREEN_WIDTH == 320 ? 0.6 : 0.7)}}/>

                            {/*</View>*/}

                            <TouchableOpacity activeOpacity={0.8} style = {{width:Adaption.Width(110), height:50}} onPress={()=>{this._showCode()}}>
                                <Image
                                    style={{position: 'absolute', right: 0, bottom: 0, width:Adaption.Width(110), height:50, resizeMode:'stretch'}}
                                    source={this.state.inputVerImg != "" ? {uri: this.state.inputVerImg} : (require('../../login/img/ic_refreshCode.png'))}
                                />
                            </TouchableOpacity>
                        </View>


                    </View>
                    <TouchableOpacity activeOpacity={0.65}
                                      onPress={() => this._repeatClick(navigate)}>
                        <View style={{
                            height: 45,
                            backgroundColor: COLORS.appColor,
                            marginLeft: 20,
                            marginRight: 20,
                            borderRadius: 5,
                            marginTop: 40,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <CusBaseText style={{color: 'white', fontSize: 17}}>{'确定'}</CusBaseText>
                        </View>
                    </TouchableOpacity>

                    <LoadingView ref='LoadingView'/>

                </View>
            );

        }


    }

    _repeatClick(navigate) {

        if (this.state.waiting == false) {
            this.state.waiting = true;
            this._changePsd(navigate);
            setTimeout(() => {
                this.state.waiting = false;
            }, 2000);
        }

    }

    _changePsd(navigate) {

        this.state.oldPhoneNum = this.state.oldPhoneNum.trim();
        this.state.newPhoneNum = this.state.newPhoneNum.trim(); //去掉首尾两端空格

        //判断是设置还是修改
        if (global.UserLoginObject.Phone.length > 1)
        {
            if (this.state.oldPhoneNum.length == 0 || this.state.newPhoneNum.length == 0 || this.state.oldPhoneNum == '' || this.state.newPhoneNum == '')
            {
                this._showInfo('手机号码不能为空');
                return;
            }

            if (this.state.oldPhoneNum.length < 11 || this.state.newPhoneNum.length < 11)
            {
                this._showInfo('手机号码少于11位');
                return;
            }


            if (!GlobalRegex(this.state.newPhoneNum, 'phonum') || !GlobalRegex(this.state.oldPhoneNum, 'phonum')) {
                this._showInfo('手机号码格式不正确');
                return;
            }

        }
        else {
            if (this.state.newPhoneNum.length == 0) {
                this._showInfo('手机号码不能为空');
                return;
            }

            if (this.state.newPhoneNum.length < 11) {
                this._showInfo('手机号码少于11位');
                return;
            }


            if (!GlobalRegex(this.state.newPhoneNum, 'phonum')) {
                this._showInfo('手机号码格式不正确');
                return;
            }

        }

        this._fetchData(navigate, global.UserLoginObject.Uid, global.UserLoginObject.Token);


    }

    _fetchData(navigate, uid, token) {

        if (global.UserLoginObject.Phone != '') {
            //已设置过
            this.refs.LoadingView && this.refs.LoadingView.showLoading('正在修改绑定手机');
        }
        else {
            this.refs.LoadingView && this.refs.LoadingView.showLoading('正在设置绑定手机');
        }


        let params = new FormData();
        params.append("ac", "updateUserInfo");
        params.append("uid", uid);
        params.append("token", token);
        params.append("type", 3);
        params.append("oldphone", this.state.oldPhoneNum);
        params.append("phone", this.state.newPhoneNum);
        params.append("sessionkey", global.UserLoginObject.session_key);
        params.append('vcode', this.state.inputVerNum);
        params.append('vid', registerKey);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);

        promise
            .then(response => {
                this.refs.LoadingView && this.refs.LoadingView.cancer();
                //请求成功
                if (response.msg == 0) {

                    this._updateInfo(response.data);

                    Alert.alert(
                        '提示',
                         this.state.oldPhoneNum.length > 5 ?'修改手机号码成功':'绑定手机号码成功' ,
                        [
                            {
                                text: '确定', onPress: () => {
                                    this.props.navigation.goBack();
                                    (this.props.navigation.state.params && this.props.navigation.state.params.callback) ? this.props.navigation.state.params.callback(response.msg) : null;
                                }
                            },
                        ]
                    );
                }
                else {

                    this._showCode();
                    if (response.param) {
                        Alert.alert('温馨提示', response.param)
                    }
                }
            })
            .catch(err => {
                if (err && typeof(err) === 'string' && err.length > 0) {
                    this.refs.LoadingView && this.refs.LoadingView.showFaile(err);
                }
            });

    }

    _updateInfo(newPhone) {

        global.UserLoginObject.Phone = newPhone;//更新global状态,是为了即时更新
        UserInfo.updateUserInfo(global.UserLoginObject, (error) => {
        });
        // let loginStringValue = JSON.stringify(global.UserLoginObject);
        // UserDefalts.setItem('userInfo',loginStringValue,(error) => {});
        PushNotification.emit('MsgHasChange');

    }

    _showInfo(title) {
        Alert.alert(
            '提示',
            title,
            [
                {
                    text: '确定', onPress: () => {
                    }
                },
            ]
        )
    }

}
const styles = StyleSheet.create({


    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },

    container_inPutTextViewTop: {
        borderBottomWidth: 1.0,
        borderColor: 'lightgrey',
        height: 50,
        // marginLeft:15,
        // borderRadius:5,
        // marginRight:15,
        // marginTop:30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: window.width,

    },


    container_inPutTextView_Image: {
        width: 20,
        height: 20,
        marginLeft: 10
    },

})
