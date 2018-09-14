import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    Alert,
    TouchableOpacity,
} from 'react-native';

export default class ChangePsd extends Component {

    constructor(props){
        super(props);
        this.state = {
            oldPsd:'',
            newPsd:'',
            newPsdagain:'',
            waiting: false,//防多次点击
        }
    }

    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({navigation}) => ({

        header: (
            <CustomNavBar
                centerText = {navigation.state.params.title}
                leftClick={() =>  navigation.goBack() }
            />
        ),

    });

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <View style = {styles.container_inPutTextViewTop}>
                    <CusBaseText style={{fontSize:16,color:'#4F4F4F',flex:0.3,textAlign: 'center',textAlignVertical: 'center'}}>{'旧密码'}</CusBaseText>
                    <TextInput  allowFontScaling={false} secureTextEntry={true} onChangeText={(text) =>  this.setState({oldPsd:text})} placeholder='请输入您的登录密码' underlineColorAndroid='transparent' style={{marginLeft:15, fontSize:15,flex:0.7,textAlignVertical: 'center'}}></TextInput>
                </View>

                <View style = {styles.container_inPutTextViewMid}>
                    <CusBaseText style={{fontSize:16,color:'#4F4F4F',flex:0.3,textAlign: 'center',textAlignVertical: 'center'}}>{'新密码'}</CusBaseText>
                    <TextInput allowFontScaling={false} secureTextEntry={true} onChangeText={(text) =>  this.setState({newPsd:text})} placeholder='请输入新密码' underlineColorAndroid='transparent' style={{marginLeft:15,fontSize:15,flex:0.7}}></TextInput>
                </View>

                <View style = {styles.container_inPutTextView}>
                    <CusBaseText style={{fontSize:16,color:'#4F4F4F',flex:0.3,textAlign: 'center',textAlignVertical: 'center'}}>{'确认密码'}</CusBaseText>
                    <TextInput allowFontScaling={false} secureTextEntry={true} onChangeText={(text) =>  this.setState({newPsdagain:text})} placeholder='确认新密码' underlineColorAndroid='transparent' style={{marginLeft:15,fontSize:15,flex:0.7}}></TextInput>
                </View>

                <View style={{height:80,justifyContent:'center', alignItems:'center'}}>
                    <CusBaseText style={{fontSize:16,color:'#8B8B8B'}}>{'如果旧密码输错5次,将冻结您的账号'}</CusBaseText>
                </View>



                <TouchableOpacity disabled={this.state.waiting} activeOpacity={0.65}  onPress={() => this._repeatClick(navigate)} style={{height:45,backgroundColor:COLORS.appColor,marginLeft:20,marginRight:20, borderRadius:5,justifyContent:'center', alignItems:'center'}}>
                  <CusBaseText style={{textAlignVertical:'center',flexDirection:'row',color:'white',fontSize:17}}>{'立即修改'}</CusBaseText>
                </TouchableOpacity>

                <LoadingView ref = 'LoadingView'/>

           </View>
        );
    }

    _repeatClick(navigate){
        this.setState({waiting: true});
        this._changePsd(navigate);
        setTimeout(()=> {
            this.setState({waiting: false})
        }, 2000);

    }

    _changePsd(navigate){

        this.state.oldPsd = this.state.oldPsd.trim();//首尾去掉空格
        this.state.newPsd = this.state.newPsd.trim();
        this.state.newPsdagain = this.state.newPsdagain.trim();

        if (this.state.oldPsd.length == 0 || this.state.oldPsd == '') {
            this._showInfo('旧密码不能为空');
            return;
        }
        else  if (this.state.newPsd.length == 0 || this.state.newPsd == '') {
            this._showInfo('新密码不能为空');
            return;

        }else  if (this.state.newPsdagain.length == 0 || this.state.newPsdagain == '') {
            this._showInfo('确认密码不能为空');
            return;

        }else if (this.state.newPsdagain!=this.state.newPsd){
            this._showInfo('两次输入密码不一致');
            return;
            //  value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        } else if(!(this.state.newPsd.match(/^[a-z0-9]{6,20}$/i ))){
            this._showInfo('密码只支持6-20位的数字和字母');
            return;

        }else {

            this._fetchData(navigate,global.UserLoginObject.Uid, global.UserLoginObject.Token, this.state.oldPsd,this.state.newPsd, global.UserLoginObject.session_key);

        }

    }

    _fetchData(navigate,uid,token,oldpass,newpass,sessionKey){

        this.refs.LoadingView && this.refs.LoadingView.showLoading('正在修改登录密码...');

        let params = new FormData();
        params.append("ac", "setLoginPassVerify");
        params.append("uid", uid);
        params.append("token", token);
        params.append("oldpass", oldpass);
        params.append("newpass", newpass);
        params.append('sessionkey',sessionKey);

        var promise = GlobalBaseNetwork.sendNetworkRequest (params);

        promise
            .then(response => {
                this.refs.LoadingView && this.refs.LoadingView.cancer();
                //请求成功
                if (response.msg == 0) {

                    Alert.alert(
                        '提示',
                        '修改密码成功',
                        [
                            {text:'确定', onPress: () => {
                                //进入APP 默认去读缓存
                                global.UserInfo.shareInstance();
                                global.UserInfo.removeUserInfo((result) => {

                                    if (result == true){

                                        PushNotification.emit('LoginOutSuccess');

                                        if (global.passwordKey) {
                                            this.props.navigation.goBack(passwordKey);
                                            return;
                                        }

                                    }

                                })
                            }},
                        ]
                    );

                }
                else {
                    if (response.param) {
                        this.refs.LoadingView && this.refs.LoadingView.showFaile(response.param);
                    }
                }
            })
            .catch(err => {
                if (err && typeof(err) === 'string' && err.length > 0) {
                    this.refs.LoadingView && this.refs.LoadingView.showFaile(err);
                }
            });

    }

    _showInfo(title){
        Alert.alert(
            '提示',
            title,
            [
                {text:'确定', onPress: () => {}},
            ]
        )
    }

}

const  styles = StyleSheet.create({

        contleft:{
            flex:1,
            textAlign: 'right',
            paddingLeft:25,
            textAlignVertical: 'center',
            color:'#7D7E80'
        },

        container: {
            flex: 1,
            backgroundColor: '#ffffff',
        },

        container_inPutTextViewTop:{
            borderWidth:1.0,
            borderColor:'lightgrey',
            height:60,
            marginLeft:15,
            marginRight:15,
            marginTop:30,
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            width:window.width,
            borderBottomWidth:0,
        },
        container_inPutTextViewMid:{
            borderWidth:1.0,
            borderColor:'lightgrey',
            height:60,
            marginLeft:15,
            marginRight:15,
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            width:window.width,
            borderBottomWidth:0,
        },

        container_inPutTextView:{
            borderWidth:1.0,
            borderColor:'lightgrey',
            height:60,
            marginLeft:15,
            marginRight:15,
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            width:window.width
        },

        container_inPutTextView_Image:{
            width:20,
            height:20,
            marginLeft:10
        },

    })
