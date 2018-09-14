import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    Alert,
    TouchableOpacity,
} from 'react-native';

export default class ChangeTransPsd extends Component {

    constructor(props){
        super(props);
        this.state = {
            Tkpassok:1,
            oldPsd:'',
            newPsd:'',
            newPsdagain:'',
            waiting: false,//防多次点击
        };
    }

    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({navigation}) => ({

        header: (
            <CustomNavBar
                centerText = {global.UserLoginObject.Tkpass_ok == ''?'设置交易密码':'修改交易密码'}
                leftClick={() =>  navigation.goBack() }
            />
        ),

    });


    render() {
        const { navigate } = this.props.navigation;
        if ( global.UserLoginObject.Tkpass_ok != ''){
            //   说明已经   设置过交易密码
            return (
                <View style={styles.container}>
                    <View style = {styles.container_inPutTextViewTop}>
                        <CusBaseText style={{fontSize:16,color:'#4F4F4F',flex:0.3,textAlign: 'center',textAlignVertical: 'center'}}>{'旧的密码'}</CusBaseText>
                        <TextInput allowFontScaling={false} returnKeyType="done" maxLength={4} keyboardType={'numeric'} secureTextEntry={true} onChangeText={(text) =>  this.setState({oldPsd:text})} placeholder='请输入4位旧交易密码' underlineColorAndroid='transparent' style={{marginLeft:15, fontSize:15,flex:0.7,textAlignVertical: 'center'}}></TextInput>
                    </View>

                    <View style = {styles.container_inPutTextViewMid}>
                        <CusBaseText style={{fontSize:16,color:'#4F4F4F',flex:0.3,textAlign: 'center',textAlignVertical: 'center'}}>{'新的密码'}</CusBaseText>
                        <TextInput allowFontScaling={false} returnKeyType="done" maxLength={4} keyboardType={'numeric'} secureTextEntry={true} onChangeText={(text) =>  this.setState({newPsd:text})} placeholder='请输入4位数新密码' underlineColorAndroid='transparent' style={{marginLeft:15,fontSize:15,flex:0.7}}></TextInput>
                    </View>

                    <View style = {styles.container_inPutTextView}>
                        <CusBaseText style={{fontSize:16,color:'#4F4F4F',flex:0.3,textAlign: 'center',textAlignVertical: 'center'}}>{'确认密码'}</CusBaseText>
                        <TextInput allowFontScaling={false} returnKeyType="done" maxLength={4} keyboardType={'numeric'} secureTextEntry={true} onChangeText={(text) =>  this.setState({newPsdagain:text})} placeholder='确认4位数新密码' underlineColorAndroid='transparent' style={{marginLeft:15,fontSize:15,flex:0.7}}></TextInput>
                    </View>

                    <View style={{height:80,justifyContent:'center', alignItems:'center'}}>
                        <CusBaseText style={{fontSize:16,color:'#8B8B8B'}}>{'如果旧密码输错5次,将冻结您的账号'}</CusBaseText>
                    </View>


                    <TouchableOpacity disabled={this.state.waiting} activeOpacity={0.65} style={{height:44,backgroundColor:COLORS.appColor,width:SCREEN_WIDTH-40,marginLeft:20,borderRadius:5,justifyContent:'center', alignItems:'center'}} onPress={() => this._repeatClick(navigate)}>
                        <CusBaseText style={{textAlignVertical:'center',color:'white',fontSize:17,textAlign:'center'}}>{'立即修改'}</CusBaseText>
                    </TouchableOpacity>


                    <LoadingView ref = 'LoadingView'/>
                </View>
            );
        }else {
            return (
                <View style={styles.container}>


                    <View style = {styles.container_inPutTextViewTop}>
                        <CusBaseText style={{fontSize:16,color:'#4F4F4F',flex:0.3,textAlign: 'center',textAlignVertical: 'center'}}>{'新的密码'}</CusBaseText>
                        <TextInput allowFontScaling={false} returnKeyType="done"  maxLength={4} keyboardType={'numeric'} secureTextEntry={true} onChangeText={(text) =>  this.setState({newPsd:text})} placeholder='请输入4位数新密码' underlineColorAndroid='transparent' style={{marginLeft:15,fontSize:15,flex:0.7}}></TextInput>
                    </View>

                    <View style = {styles.container_inPutTextView}>
                        <CusBaseText style={{fontSize:16,color:'#4F4F4F',flex:0.3,textAlign: 'center',textAlignVertical: 'center'}}>{'确认密码'}</CusBaseText>
                        <TextInput allowFontScaling={false} returnKeyType="done"  maxLength={4} keyboardType={'numeric'} secureTextEntry={true} onChangeText={(text) =>  this.setState({newPsdagain:text})} placeholder='确认4位数新密码' underlineColorAndroid='transparent' style={{marginLeft:15,fontSize:15,flex:0.7}}></TextInput>
                    </View>

                    <View style={{height:80,justifyContent:'center', alignItems:'center'}}>
                        <CusBaseText allowFontScaling={false} style={{fontSize:16,color:'#8B8B8B'}}>{'如果旧密码输错5次,将冻结您的账号'}</CusBaseText>
                    </View>



                    <TouchableOpacity disabled={this.state.waiting} activeOpacity={0.65} style={{height:44,backgroundColor:COLORS.appColor,width:SCREEN_WIDTH-40,marginLeft:20,borderRadius:5,justifyContent:'center', alignItems:'center'}} onPress={() => this._repeatClick(navigate)}>
                        <CusBaseText style={{textAlignVertical:'center',color:'white',fontSize:17,textAlign:'center'}}>{'立即修改'}</CusBaseText>
                    </TouchableOpacity>

                    <LoadingView ref = 'LoadingView'/>
                </View>
            );
        }

    }

    _repeatClick(navigate){
        this.setState({waiting: true});
        this._changePsd(navigate);
        setTimeout(()=> {
            this.setState({waiting: false})
        }, 2000);

    }

    _changePsd(navigate){

        if ( this.state.Tkpass_ok == 1) {
            //旧的密码会显示
            if(this.state.oldPsd.length==0){
                this._showInfo('旧密码不能为空');
                return;
            }

        }

        if(this.state.newPsd.length==0){
            this._showInfo('新密码不能为空');
            return;
        }

        if(this.state.newPsdagain.length==0){
            this._showInfo('确认密码不能为空');
            return;
        }

        if(this.state.newPsd != this.state.newPsdagain){
            this._showInfo('两次输入密码不一致');
            return;
        }

        this._fetchData(navigate,global.UserLoginObject.Uid, global.UserLoginObject.Token, this.state.oldPsd,this.state.newPsd, global.UserLoginObject.session_key);

    }

    _fetchData(navigate,uid,token,oldpass,newpass,sessionKey){

        let AlertName = '';

        if (global.UserLoginObject.Tkpass_ok == 1){
            AlertName = '修改成功!';
            //已设置过
            this.refs.LoadingView && this.refs.LoadingView.showLoading('正在修改交易密码...');
        }else {
            AlertName = '设置成功!';
            this.refs.LoadingView && this.refs.LoadingView.showLoading('正在设置交易密码...');
        }


        let params = new FormData();
        params.append("ac", "setTradPassVerify");
        params.append("uid", uid);
        params.append("token", token);
        params.append("oldpass", oldpass);
        params.append("newpass", newpass);
        params.append('sessionkey', sessionKey);
        params.append('tkpassok', global.UserLoginObject.Tkpass_ok);

        var promise = GlobalBaseNetwork.sendNetworkRequest (params);

        promise
            .then(response => {
                this.refs.LoadingView && this.refs.LoadingView.cancer();
                //请求成功
                if (response.msg == 0){
                    this._updateInfo(1);

                    Alert.alert(
                        '提示',
                        AlertName,
                        [
                            {text:'确定', onPress: () => {
                                this.props.navigation.goBack();
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

    _updateInfo(Tkpassok){
        //发出通知,告知安全中心,设置好了
        PushNotification.emit('UpdateTextAtOnce', "updateTransPsd");
        global.UserLoginObject.Tkpass_ok = Tkpassok;//更新本地数据和内存数据状态
        UserInfo.updateUserInfo(global.UserLoginObject, (error) => {});
        // let loginStringValue = JSON.stringify(global.UserLoginObject);
        // UserDefalts.setItem('userInfo',loginStringValue,(error) => {});

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
            alignItems:'center',
            justifyContent:'center',
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
            alignItems:'center',
            width:window.width
        },

        container_inPutTextView_Image:{
            width:20,
            height:20,
            marginLeft:10
        },

        item_view:{
            borderWidth:1.0,
            borderColor:'lightgrey',
            height:30,
            marginLeft:10,
            marginRight:10,
            width:window.width,
            justifyContent:'center',
            alignItems:'center',
        },

        item_bord:{
            flex:3,
            flexDirection:'row',
            marginLeft:15
        }

    })
