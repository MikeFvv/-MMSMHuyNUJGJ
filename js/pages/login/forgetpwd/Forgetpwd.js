import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';

import Adaption from "../../../skframework/tools/Adaption";

let registerKey = '';  //vid字段
export default class Forgetpwd extends Component {

    constructor(props){
        super(props);

        this.state = ({
            veriyCode:this._showCode(),  //生成随机验证码
            inputCode:'',   //获取输入的验证码
            inputUserName:'', //获取输入的用户名
            waiting: false,//防多次点击
            imgConformCode: '', //后台返回的验证码
        })
    }

    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({ navigation }) => ({

        header: (
            <CustomNavBar
                centerText = {"密码找回"}
                leftClick={() =>  navigation.goBack() }
            />
        ),
    });

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
                        imgConformCode: response.data.img,
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

    _repeatClick(navigate){
        this.setState({waiting: true});
        this._getUserSafety(navigate);
        setTimeout(()=> {
            this.setState({waiting: false})
        }, 2000);

    }

    //获取用户安全设定接口调用
    _getUserSafety(navigate){

        this.state.inputUserName = this.state.inputUserName.trim();

        if (this.state.inputUserName.length == 0) {
            this._showReponse('输入的用户名不能为空');
            return;
        }
        else if (!GlobalRegex(this.state.inputUserName, 'user')){
            this._showReponse('用户名格式不正确');
            return;
        }
        else if (this.state.inputCode.length == 0) {
            this._showReponse('验证码不能为空');
            return;
        }
        else if (!GlobalRegex(this.state.inputCode, "vcode")){
            this._showReponse('验证码格式不正确!');
            return;
        }
        else {

        let params = new FormData();  //创建请求数据表单
        params.append("ac", "FPgetAccountScrectList");
        params.append("username",  this.state.inputUserName);
        params.append('vcode', this.state.inputCode);
        params.append('vid', registerKey);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);

        promise
            .then(response => {
                //请求成功
                if (response.msg == 0) {

                    if(response.data.length == 0){
                        this._showReponse('您还没有设置相关选项,无法通过此方式找回密码!');
                    }else {

                        let listArr = response.data[0].split(',');

                        navigate('FindPWD', {title:'密码找回', username:this.state.inputUserName,list:listArr});
                    }

                }
                else
                {
                    this._showReponse(response.param);
                }
            })
            .catch(err => { });
        }
    }

    _showReponse(content){
        Alert.alert(
            '提示',
            content,
            [
                {text:'确定', onPress: () => this.setState({veriyCode:this._showCode()})},
            ]
        )
    }


    render(){
        const { navigate } = this.props.navigation;
        return (
            <View style = {styles.container}>
                <View style = {[styles.container_ForgetPWDView, {marginTop:20}]}>
                    <View style = {{flex:0.22}}><CusBaseText style = {{fontSize:Adaption.Font(16,14), color:'black', marginLeft:20}}>账号</CusBaseText></View>
                    <View style = {{flex:0.78}}><TextInput allowFontScaling={false} autoCapitalize={'none'} onChangeText={(text) =>  this.setState({inputUserName:text})} placeholder='请输入用户名' underlineColorAndroid='transparent' style = {{width:200, fontSize:16, marginLeft:20, padding:0}} /></View>
                </View>
                <View style = {styles.container_ForgetPWDView}>
                    <View style = {{flex:0.22}}><CusBaseText style = {{fontSize:Adaption.Font(16,14), color:'black', marginLeft:20}}>验证码</CusBaseText></View>
                    <View style = {{flex:0.5}}><TextInput allowFontScaling={false} returnKeyType="done" keyboardType = {'number-pad'} onChangeText={(text) =>  this.setState({inputCode:text})} maxLength={4} placeholder='请输入验证码' underlineColorAndroid='transparent' style = {{width:150, fontSize:16, marginLeft:20, padding:0}} /></View>
                    <View style = {{flex:0.23}}><TouchableOpacity activeOpacity={1} onPress={() => this.setState({veriyCode:this._showCode()})}><Image
                        style={{width: 85, height: Adaption.Width(40)}}
                        source={this.state.imgConformCode != "" ? {uri: this.state.imgConformCode} : (require('../img/ic_refreshCode.png'))} /></TouchableOpacity></View>
                </View>
                <View style = {{marginTop:40, marginLeft:15, marginRight:15}}>
                    <TouchableOpacity disabled={this.state.waiting} activeOpacity={0.65} onPress={() => this._repeatClick(navigate)} style={styles.container_ForgetPWDView_Btn}>
                        <CusBaseText style = {{fontSize:Adaption.Font(18,16), color:'white'}}>确定</CusBaseText>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    componentDidMount() {
        global.forgetpwdKey = this.props.navigation.state.key;
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#f3f3f3',
    },

    container_ForgetPWDView:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff',
        height:Adaption.Width(50),
        borderBottomWidth:0.5,
        borderColor:'lightgrey',
    },

    container_ForgetPWDView_Btn:{
        backgroundColor:COLORS.appColor,
        height:Adaption.Width(44),
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center'
    },

})
