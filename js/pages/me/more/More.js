import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Switch,
    Alert,
} from 'react-native';

import Adaption from "../../../skframework/tools/Adaption";

 export default class More extends Component {

     constructor(props) {
         super(props);

         this.state = ({
             isLogin: '',  //判断登录的状态
         })
     }

     //接收上一个页面传过来的title显示出来
     static navigationOptions = ({navigation}) => ({


         header: (
             <CustomNavBar
                 centerText={"更多设置"}
                 leftClick={() => navigation.goBack()}
             />
         ),

     });

     componentWillMount() {

         let key = 'systemObjcet';
         UserDefalts.getItem(key, (error, result) => {
             if (!error) {
                 if (result !== '' && result !== null) {
                     let systemModel = JSON.parse(result);

                     global.isOpenShake = systemModel.openShake ? systemModel.openShake : false;

                     this.setState({
                         isOpen1: systemModel.openShake ? systemModel.openShake : false,
                         isOpen2: systemModel.openNotifcate ? systemModel.openNotifcate : false,
                     })
                 }
                 else {
                     //首次进入APP初始化状态都是不开启
                     this.setState({
                         isOpen1: true,
                         isOpen2: true,
                     })
                 }
             }
         });
     }

     componentDidMount() {

         this._setUserInfo();
     }

     //接受登录的通知
     _setUserInfo() {

         this.setState({
             isLogin: (global.UserLoginObject.Token) ? global.UserLoginObject.Token : '',
         })

     }

    // 提交游戏偏好需要的gameid
    _updateUserHobby() {

        let keys = Object.keys(global.GTouZhuGameID);
        if (keys.length <= 0) {
            return;  // 没有值直接退出
        }

        let gameidStr_list = '';
        for (let i = 0; i < keys.length; i++) {
            let gaid = keys[i];
            let count = GTouZhuGameID[gaid];
            gameidStr_list += (i == keys.length - 1 ? `${gaid}:${count}` : `${gaid}:${count},`);
        }

        let params = new FormData();
        params.append("ac", "updateUserHobby");
        params.append("uid", global.UserLoginObject.Uid);
        params.append("token", global.UserLoginObject.Token);
        params.append("sessionkey", global.UserLoginObject.session_key);
        params.append("str_list", gameidStr_list);
    
        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then(response => {
                if (response.msg == 0) {
                    // 成功后，清空，存储。
                    global.GTouZhuGameID = {};
                    let datas = JSON.stringify(global.GTouZhuGameID);
                    UserDefalts.setItem('TouZhuGameIDNote', datas, (error) => { });
                }
            })
            .catch(err => {
            });
    }

    
     //退出登录的方法
     _loginOutMethod(){

         //试玩账号直接退出
         if (global.UserLoginObject.is_Guest == 2) {
            
             //进入APP 默认去读缓存
             global.UserInfo.shareInstance();
             global.UserInfo.removeUserInfo((result) => {

                 if (result == true) {

                     PushNotification.emit('LoginOutSuccess');
                     this.props.navigation.goBack();
                 }
             });
         }
         else {

            this._updateUserHobby(); // 提交gameid, 用于后台搞游戏偏好的。

            PersonMessageArray=0;
            Hongbaolihe = 0;
            Gerenfankui = 0;
            Fuliqiandao = 0;
             this.refs.LoadingView && this.refs.LoadingView.showLoading('正在退出...');

             let params = new FormData();
             params.append("ac", "userLogout");
             params.append("uid", global.UserLoginObject.Uid);
             params.append("token", global.UserLoginObject.Token);
             params.append('sessionkey', global.UserLoginObject.session_key);

             var promise = GlobalBaseNetwork.sendNetworkRequest(params);

             promise
                 .then(response => {

                     this.refs.LoadingView && this.refs.LoadingView.cancer();

                     if (response.msg == 0) {

                         //进入APP 默认去读缓存
                         global.UserInfo.shareInstance();
                         global.UserInfo.removeUserInfo((result) => {

                             if (result == true) {

                                 PushNotification.emit('LoginOutSuccess');
                                 this.props.navigation.goBack();
                             }
                         });
                     }

                 })
                 .catch(err => {
                 });
         }
     }

     render() {
         const {navigate} = this.props.navigation;
         return (
             <View style={styles.container}>
                 <TouchableOpacity activeOpacity={1} style={styles.container_MoreSettingView}>
                     <View style={{flex: 0.8, flexDirection: 'row', alignItems: 'center'}}>
                         <Image style={styles.container_MoreSettingView_Image}
                                source={require('../img/ic_openShake.png')} />
                         <CusBaseText style={styles.container_MoreSettingView_Text}>开启摇一摇震动</CusBaseText>
                     </View>
                     <View style={{flex: 0.2}}><Switch onValueChange={(value) => {
                         this.setState({isOpen1: value});
                         global.isOpenShake = value;
                         let systemObjcet = {
                             openShake: value,
                             openNotifcate: this.state.isOpen2,
                         }

                         let systemStringValue = JSON.stringify(systemObjcet);

                         let key = 'systemObjcet';
                         UserDefalts.setItem(key, systemStringValue, (error) => {
                             if (!error) {
                             }
                         });
                     }}
                        value={this.state.isOpen1}>
                     </Switch></View>
                 </TouchableOpacity>
                 
                 {/*<TouchableOpacity activeOpacity={1} style={styles.container_MoreSettingView}>*/}
                     {/*<View style={{flex: 0.8, flexDirection: 'row', alignItems: 'center'}}>*/}
                         {/*<Image style={styles.container_MoreSettingView_Image}*/}
                                {/*source={require('../img/ic_notificate.png')} />*/}
                         {/*<CusBaseText style={styles.container_MoreSettingView_Text}>开启中奖通知</CusBaseText>*/}
                     {/*</View>*/}
                     {/*<View style={{flex: 0.2}}><Switch onValueChange={(value) => {*/}
                         {/*this.setState({isOpen2: value});*/}

                         {/*let systemObjcet = {*/}
                             {/*openShake: this.state.isOpen1,*/}
                             {/*openNotifcate: value,*/}
                         {/*}*/}

                         {/*let systemStringValue = JSON.stringify(systemObjcet);*/}

                         {/*let key = 'systemObjcet';*/}
                         {/*UserDefalts.setItem(key, systemStringValue, (error) => {*/}
                             {/*if (!error) {*/}
                             {/*}*/}
                         {/*});*/}
                     {/*}}*/}
                     {/*value={this.state.isOpen2}>*/}
                     {/*</Switch></View>*/}
                 {/*</TouchableOpacity>*/}

                 <TouchableOpacity activeOpacity={1} onPress={() => navigate('AboutUs', {title: '关于我们'})}
                                   style={styles.container_MoreSettingView}>
                     <View style = {{flex:0.89, flexDirection:'row', alignItems:'center'}}><Image style={styles.container_MoreSettingView_Image}
                            source={require('../img/ic_aboutUs.png')} />
                         <CusBaseText style={styles.container_MoreSettingView_Text}>关于我们</CusBaseText></View>
                     <View style = {{flex:0.11}}><Image style = {{width:10, height:20}} source = {require('../myinformation/img/ic_levelTitle_row.png')}/></View>
                 </TouchableOpacity>

                 {this.state.isLogin != '' ? (<TouchableOpacity onPress={() => {

                     Alert.alert(
                         '提示',
                         '是否退出登录',
                         [
                             {text: '确定', onPress: () => {this._loginOutMethod()}},
                             {text: '取消', onPress: () => {}}
                         ])
                    }}
                    style={styles.container_MoreSettingView_LoginBtn}
                    activeOpacity={1}>
                     <CusBaseText style={{color: 'white', fontSize: Adaption.Font(20, 17)}}>退出登录</CusBaseText>
                 </TouchableOpacity>) : (null)}

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

    container_MoreSettingView:{
        width:window.width,
        height:Adaption.Width(50),
        borderBottomWidth:1.0,
        borderColor:'lightgrey',
        flexDirection:'row',
        alignItems:'center',
    },

    container_MoreSettingView_Text:{
        marginLeft:15,
        fontSize:Adaption.Font(17,14)
    },

    container_MoreSettingView_Image:{
        width:30,
        height:30,
        marginLeft:15
    },

    container_MoreSettingView_LoginBtn:{
        marginTop:50,
        marginLeft:20,
        marginRight:20,
        height:Adaption.Width(44),
        borderRadius:5,
        backgroundColor:COLORS.appColor,
        justifyContent:'center',
        alignItems:'center',
    }

});
