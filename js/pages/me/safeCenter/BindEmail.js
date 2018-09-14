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

export default class BindEmail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oldEmail: '',
            newEmail: '',
            Email: global.UserLoginObject.Email,
            waiting: false,//防多次点击
            inputVerNum: '',  //验证码
            inputVerImg:'', //验证码图片
        }

    }

    //接收上一个页面传过来的titl  e显示出来
    static navigationOptions = ({navigation}) => ({

        header: (
            <CustomNavBar
                centerText={global.UserLoginObject.Email.length > 1 ? '修改邮箱' : '绑定邮箱'}
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
        if (global.UserLoginObject.Email.length > 1) {

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
                                // textAlign: 'center'
                            }}>{'原邮箱'}</CusBaseText>
                            <TextInput allowFontScaling={false} keyboardType={'email-address'}
                                       onChangeText={(text) => this.setState({oldEmail: text})}
                                       placeholder={global.UserLoginObject.Email} underlineColorAndroid='transparent'
                                       style={{marginLeft: 15, fontSize: 15, flex: 0.76}}/>
                        </View>

                        <View style={styles.container_inPutTextViewTop}>
                            <CusBaseText style={{
                                fontSize: 16,
                                color: '#4F4F4F',
                                flex: 0.24,
                                // textAlign: 'center'
                                marginLeft: 5,
                            }}>{'新邮箱'}</CusBaseText>
                            <TextInput allowFontScaling={false} keyboardType={'email-address'}
                                       onChangeText={(text) => this.setState({newEmail: text})}
                                       placeholder='请输入新邮箱' underlineColorAndroid='transparent'
                                       style={{marginLeft: 15, fontSize: 15, flex: 0.76}}/>
                        </View>


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
                            <CusBaseText style={{color: 'white', fontSize: 17}}>{'立即修改'} </CusBaseText>
                        </View>
                    </TouchableOpacity>

                    <LoadingView ref='LoadingView'/>

                </View>
            );
        } else {

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
                                // textAlign: 'center'
                            }}>{'邮箱'}</CusBaseText>
                            <TextInput allowFontScaling={false} keyboardType={'email-address'}
                                       onChangeText={(text) => this.setState({newEmail: text})}
                                       placeholder='请输入邮箱' underlineColorAndroid='transparent'
                                       style={{marginLeft: 15, fontSize: 15, flex: 0.76}}/>


                        </View>

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
                            <CusBaseText style={{color: 'white', fontSize: 17}}>{'确定'} </CusBaseText>
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

        this.state.Email = this.state.Email.trim();
        this.state.oldEmail = this.state.oldEmail.trim();

        if (this.state.Email.length > 0) {
            if (this.state.oldEmail.length == 0 || this.state.oldEmail == '') {
                this._showInfo('旧邮箱号不能为空');
                return;
            }
        }


        if (this.state.newEmail.length == 0 || this.state.newEmail == '') {
            this._showInfo('新邮箱号不能为空');
            return;

        } else {

            this._fetchData(navigate, global.UserLoginObject.Uid, global.UserLoginObject.Token);

        }

    }

    _fetchData(navigate, uid, token) {

        if (global.UserLoginObject.Email != '') {
            //有旧的
            this.refs.LoadingView && this.refs.LoadingView.showLoading('正在修改绑定邮箱');
        } else {
            this.refs.LoadingView && this.refs.LoadingView.showLoading('正在设置绑定邮箱');
        }


        let params = new FormData();
        params.append("ac", "updateUserInfo");
        params.append("uid", uid);
        params.append("token", token);
        params.append("oldemail", this.state.oldEmail);
        params.append("email", this.state.newEmail);
        params.append("type", 2);
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
                        this.state.oldEmail.length > 5 ?'修改邮箱成功':'绑定邮箱成功' ,
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

    _updateInfo(newEmail) {

        global.UserLoginObject.Email = newEmail;//更新global状态,即时更新状态
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
