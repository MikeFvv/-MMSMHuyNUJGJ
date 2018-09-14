import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
  Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("window");
const KAdaptionWith = width / 414;
const KAdaptionHeight = height / 736;
import BaseNetwork from "../../../skframework/component/BaseNetwork"; //网络请求

export default class ApplicationAgentDelege extends Component {
  static navigationOptions = ({ navigation }) => ({
     title:'申请代理',


      headerStyle: {backgroundColor: COLORS.appColor, marginTop: Android ?(parseFloat(global.versionSDK) > 19?StatusBar.currentHeight:0) : 0},

     headerTitleStyle:{color:'white',alignSelf:'center'},
      //加入右边空视图,否则标题不居中
      headerRight: (
          <View style={GlobalStyles.nav_blank_view} />
      ),
     headerLeft: (
            <TouchableOpacity
                activeOpacity={1}
                style={GlobalStyles.nav_headerLeft_touch}
                onPress={() => { navigation.goBack() }}>
                <View style={GlobalStyles.nav_headerLeft_view} />
            </TouchableOpacity>
        ),

  });
   _fetchShenQingDaiData(){

     //请求参数
     let params = new FormData();
     params.append("ac", "ApplyDaili");
     params.append("uid", global.UserLoginObject.Uid);
     params.append("token",global.UserLoginObject.Token);
     params.append("sessionkey",global.UserLoginObject.session_key);
     var promise = BaseNetwork.sendNetworkRequest(params);

     promise
       .then(response => {
         let datalist = response.data;
         let dataBlog = [];
         let i = 0;

         if (response.msg == 0 ) {
         this.props.navigation.goBack()
           Alert.alert(
               '提示',
               '申请成功',
               [
                   {text: '确定', onPress: () => {}},
               ]
           )
         }else {
           Alert.alert(
               '提示',
               response.param,
               [
                   {text: '确定', onPress: () => {}},
               ]
           )
         }

         datalist = null;
         dataBlog = null;
       })
       .catch(err => { });
   }

  shenQingDaiLi(){
    this._fetchShenQingDaiData();
  }
  render() {
    return (
      <View style = {styles.container}>
        <CusBaseText  style = {{fontSize:18,color:COLORS.appColor,textAlign:'center',marginTop:15}}>
            什么是代理？
        </CusBaseText>
        <CusBaseText  style = {{fontSize:14,color:'#666666',textAlign:'center',marginTop:15}}>
            可获得的返点,等于自身返点与下级返点的差值,如自身返点5,下级返点3,你将能获得下级投注金额2%的返点,如下级投注100元,你将获得2元.点击下级开户,可查看自身返点,
            也可为下级设置返点.
        </CusBaseText>
        <CusBaseText  style = {{fontSize:18,color:COLORS.appColor,textAlign:'center',marginTop:15}}>
             申请代理有什么好处？
        </CusBaseText>
        <CusBaseText  style = {{fontSize:14,color:'#666666',textAlign:'center',marginTop:15}}>
            可获得的返点,等于自身返点与下级返点的差值,如自身返点5,下级返点3,你将能获得下级投注金额2%的返点,如下级投注100元,你将获得2元.点击下级开户,可查看自身返点,
            也可为下级设置返点.
        </CusBaseText>
          <TouchableOpacity activeOpacity={1} onPress={() => this.shenQingDaiLi()}
            style={{marginTop:50,borderRadius:5,marginLeft:30,backgroundColor:COLORS.appColor,width:width-60,height:40,justifyContent:'center',alignItems:'center'}}>
            <CusBaseText style = {{fontSize:14,color:'white',textAlign:'center'}}>
              立即申请
            </CusBaseText>
          </TouchableOpacity>
      </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding:10
  },

});
