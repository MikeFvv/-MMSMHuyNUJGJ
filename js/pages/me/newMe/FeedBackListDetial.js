import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Platform,
  Alert,
  Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("window");
import BaseNetwork from "../../../skframework/component/BaseNetwork";
const KAdaptionWith = width / 414;
const KAdaptionHeight = height / 736;
import Moment from 'moment';

export default class FeedBackListDetial extends Component {
  static navigationOptions = ({ navigation }) => ({

      header: (
          <CustomNavBar
              centerText = {navigation.state.params.title}
              leftClick={() => {navigation.goBack()}}
          />
      ),

     // title:'消息详情',
     //  headerStyle: {backgroundColor: COLORS.appColor, marginTop: Android ?(parseFloat(global.versionSDK) > 19?StatusBar.currentHeight:0) : 0},
     //
     // headerTitleStyle:{color:'white',alignSelf:'center'},
     //  //加入右边空视图,否则标题不居中
     //  headerRight: (
     //      <View style={GlobalStyles.nav_blank_view} />
     //  ),
     // headerLeft: (
     //        <TouchableOpacity
     //            activeOpacity={1}
     //            style={GlobalStyles.nav_headerLeft_touch}
     //            onPress={() => { navigation.goBack() }}>
     //            <View style={GlobalStyles.nav_headerLeft_view} />
     //        </TouchableOpacity>
     //    ),

  });
  componentDidMount() {
    if (this.props.navigation.state.params.FeedBackList.item.value.status==1) {
        this._fetchPersonalMessagesData();
    }
  }

    _fetchPersonalMessagesData(){

//请求参数
    let params = new FormData();
    params.append("ac", "ReadOpinion");
    params.append("uid", global.UserLoginObject.Uid);
    params.append("token", global.UserLoginObject.Token);
    params.append("sessionkey", global.UserLoginObject.session_key);
    params.append("id",this.props.navigation.state.params.FeedBackList.item.value.id);

   var promise = BaseNetwork.sendNetworkRequest(params);

   promise
  .then(response => {
    if (response.msg==0) {
      PushNotification.emit('BiaoJiYijianFanKuiSuccess');
     }else {

     }
   })
  .catch(err => { });
}
   
 
  render() {
      let answer = '';
      let time = '';
      if(this.props.navigation.state.params.FeedBackList.item.value.answer=='') {
        time = Moment().format('YYYY-MM-DD HH:mm:ss');
        answer = '您的反馈我们已经在做处理,请耐心等待!';
      }else {
        answer = this.props.navigation.state.params.FeedBackList.item.value.answer;
        time =  Moment.unix(this.props.navigation.state.params.FeedBackList.item.value.reply_time).format('YYYY-MM-DD HH:mm:ss');
      }
    return (
      <View style = {styles.container}>
        <View style = {{marginLeft:10,width:width-20,marginTop:15,borderRadius:8,borderWidth: 1,borderColor: '#cdcdcd',backgroundColor:'white'}}>
          <CusBaseText  style = {{fontSize:16,color:'#767676',marginTop:10,marginLeft:10}}>
          {Moment.unix(this.props.navigation.state.params.FeedBackList.item.value.send_time).format('YYYY-MM-DD HH:mm:ss')}
          </CusBaseText>
          <CusBaseText  style = {{fontSize:16,color:'#767676',marginTop:10,marginLeft:10}}>
            反馈内容:
          </CusBaseText>
          <CusBaseText  style = {{fontSize:16,color:'#383838',marginTop:10,marginLeft:10}}>
            {this.props.navigation.state.params.FeedBackList.item.value.content}
          </CusBaseText>
          <View style = {{marginTop:10,marginLeft:15,width:width-50,height:1,backgroundColor:'lightgrey'}}></View>
          <CusBaseText  style = {{fontSize:16,color:'#767676',marginTop:10,marginLeft:10}}>
            {time}
          </CusBaseText>
          <CusBaseText  style = {{fontSize:16,color:'#767676',marginTop:10,marginLeft:10}}>
            回复:
          </CusBaseText>
          <CusBaseText  style = {{fontSize:16,color:'#383838',marginTop:10,marginLeft:10,textAlign:'center',height:50}}>
            {answer}
          </CusBaseText>
        </View>
      </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },

});
