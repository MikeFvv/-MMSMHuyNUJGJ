import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Alert,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
export default class ChangePsd extends Component {

    constructor(props){
        super(props);
        this.state = {
            newName:'',
            oldName:'',
            Real_name:'',
            waiting: false,//防多次点击
        }
    }

    //接收上一个页面传过来的titl  e显示出来
    static navigationOptions = ({navigation}) => ({

        header: (
            <CustomNavBar
                centerText = {global.UserLoginObject.Real_name.length > 1 ? '修改真实姓名' : '设置真实姓名'}
                leftClick={() =>  navigation.goBack() }
            />
        ),
    });

    render() {
        const { navigate } = this.props.navigation;

        if (global.UserLoginObject.Real_name != null && global.UserLoginObject.Real_name.length>1) {
            return (
                <View style={styles.container}>
                    <View style = {styles.container_inPutTextViewTop} >
                        <CusBaseText style={{fontSize:16,color:'#4F4F4F',flex:0.2,textAlign: 'center'}}>{'旧姓名'}</CusBaseText>
                        <TextInput  allowFontScaling={false} placeholder={global.UserLoginObject.Real_name} onChangeText={(text) =>  this.setState({oldName:text})}  underlineColorAndroid='transparent' style={{marginLeft:15, fontSize:15,flex:0.8}}></TextInput>
                    </View>

                    <View style = {styles.container_inPutTextViewTop} >
                        <CusBaseText style={{fontSize:16,color:'#4F4F4F',flex:0.25,textAlign: 'center'}}>{'新的姓名'}</CusBaseText>
                        <TextInput allowFontScaling={false} onChangeText={(text) =>  this.setState({newName:text})} placeholder='请输入新的姓名' underlineColorAndroid='transparent' style={{marginLeft:15, fontSize:15,flex:0.8}}></TextInput>
                    </View>

                    <CusBaseText style={{fontSize:13,color:'#7d7d7d',textAlign:'center',marginTop:13}}>{'请填写真实的姓名'}</CusBaseText>

                    <TouchableOpacity activeOpacity={0.65} disabled={this.state.waiting} onPress={() => this._repeatClick(navigate)}>
                        <View style={{height:45,backgroundColor:COLORS.appColor,marginLeft:20,marginRight:20, borderRadius:5,marginTop:40,justifyContent:'center', alignItems:'center'}}>
                            <CusBaseText style={{flexDirection:'row',color:'white',fontSize:18}}>{'立即修改'}</CusBaseText>
                        </View>
                    </TouchableOpacity>

                    <LoadingView ref = 'LoadingView'/>

                </View>
            );
        }else {
            return(
                <View style={styles.container}>


                    <View style = {styles.container_inPutTextViewTop} >
                        <CusBaseText style={{fontSize:16,color:'#4F4F4F',flex:0.3,marginLeft:10}}>{'姓名'}</CusBaseText>
                        <TextInput allowFontScaling={false} onChangeText={(text) =>  this.setState({newName:text})} placeholder='请输入真实姓名' underlineColorAndroid='transparent' style={{marginLeft:15, fontSize:15,flex:1}}></TextInput>
                    </View>


                    <CusBaseText style={{fontSize:13,color:'#7d7d7d',textAlign:'center',marginTop:13}}>{'填写真实的姓名以便于提款验证'}</CusBaseText>

                    <TouchableOpacity  activeOpacity={0.65} disabled={this.state.waiting} onPress={() => this._repeatClick(navigate)}>
                        <View style={{height:45,backgroundColor:COLORS.appColor,marginLeft:20,marginRight:20, borderRadius:5,marginTop:40,justifyContent:'center', alignItems:'center'}}>
                            <CusBaseText style={{flexDirection:'row',color:'white',fontSize:18}}>{'确定'}</CusBaseText>
                        </View>
                    </TouchableOpacity>

                    <LoadingView ref = 'LoadingView'/>

                </View>
            );
        }



    }

    _repeatClick(navigate){

        this.state.newName = this.state.newName.trim(); //去掉首尾空格
        this.state.oldName = this.state.oldName.trim();
        this.setState({waiting: true});
        this._changePsd(navigate);
        setTimeout(()=> {
            this.setState({waiting: false})
        }, 2000);

    }

    _changePsd(navigate){

        if (global.UserLoginObject.Real_name == ''){ //首次设置真实姓名的判断

            if (this.state.newName.length == 0 || this.state.newName == '')
            {
                this._showInfo('真实姓名不能为空');
                return;
            }
            else if(this.state.newName.length == 1)
            {
                this._showInfo('真实姓名过短');
                return;
            }
            else {

                this._fetchData(navigate,global.UserLoginObject.Uid,global.UserLoginObject.Token);
            }
        }
        else {

            if (this.state.oldName.length == 0 || this.state.oldName == ''){
                this._showInfo('旧的真实姓名不能为空');
                return;
            }
            else if (this.state.newName.length == 0 || this.state.newName == '')
            {
                this._showInfo('真实姓名不能为空');
                return;
            }
            else if(this.state.newName.length == 1)
            {
                this._showInfo('真实姓名过短');
                return;
            }
            else {

                this._fetchData(navigate,global.UserLoginObject.Uid,global.UserLoginObject.Token);

            }
        }
    }


    _fetchData(navigate,uid,token){

        if (global.UserLoginObject.Real_name != null && global.UserLoginObject.Real_name.length>0) {
            //有旧姓名
            this.refs.LoadingView && this.refs.LoadingView.showLoading('正在修改姓名');
        }else {
            this.refs.LoadingView && this.refs.LoadingView.showLoading('正在设置姓名');
        }


            let params = new FormData();
            params.append("ac", "updateUserInfo");
            params.append("type",1);
            params.append("uid", uid);
            params.append("token", token);
            params.append("sessionkey",global.UserLoginObject.session_key);
            params.append("oldname", this.state.oldName);
            params.append("realname", this.state.newName);

            var promise = GlobalBaseNetwork.sendNetworkRequest (params);

            promise
                .then(response => {
                    this.refs.LoadingView && this.refs.LoadingView.cancer();
                    //请求成功
                    if (response.msg == 0 ){
                        if(global.UserLoginObject.Real_name.length <= 0){
                            //说明是第一次设置,根据后台逻辑,设置立即成功
                            this._updateInfo(response.data);

                            Alert.alert(
                                '提示',
                                '设置真实姓名成功',
                                [
                                    {text:'确定', onPress: () => {
                                        this.props.navigation.goBack();
                                        (this.props.navigation.state.params && this.props.navigation.state.params.callback) ? this.props.navigation.state.params.callback(response.msg) : null;
                                    }},
                                ]
                            );

                        }else {

                            Alert.alert(
                                '提示',
                                '修改真实姓名申请已提交',
                                [
                                    {text:'确定', onPress: () => {
                                        this.props.navigation.goBack();
                                    }},
                                ]
                            );
                        }

                    } else {
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

    _updateInfo(newName){
        global.UserLoginObject.Real_name = newName;//更新global状态,即时更新状态
        UserInfo.updateUserInfo(global.UserLoginObject, (error) => {});
        PushNotification.emit('MsgHasChange');
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

    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },

    container_inPutTextViewTop:{
        borderWidth:1.0,
        borderColor:'lightgrey',
        borderRadius:5,
        height:50,
        marginLeft:15,
        marginRight:15,
        marginTop:30,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:window.width,
    },

})
