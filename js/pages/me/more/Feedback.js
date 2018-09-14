import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StatusBar,
    Image
} from 'react-native';
import BaseNetwork from "../../../skframework/component/BaseNetwork";
import Toast, {DURATION} from 'react-native-easy-toast'
export default class Feedback extends Component {

  //接收上一个页面传过来的title  显示出来
  static navigationOptions = ({ navigation }) => ({

      header: (
          <CustomNavBar
              centerText = {"我要反馈"}
              leftClick={() => {navigation.state.params.callback(),navigation.goBack()} }
          />
      ),


      // title: navigation.state.params.title,
      // headerStyle: {backgroundColor: COLORS.appColor, marginTop: Android ?(parseFloat(global.versionSDK) > 19?StatusBar.currentHeight:0) : 0},
      // headerTitleStyle:{color:'white',alignSelf:'center'},
      // //加入右边空视图,否则标题不居中  ,alignSelf:'center'
      // headerRight: (
      //     <View style={GlobalStyles.nav_blank_view} />
      // ),
      // headerLeft: (
      //       <TouchableOpacity
      //           activeOpacity={1}
      //           style={GlobalStyles.nav_headerLeft_touch}
      //           onPress={() => { navigation.goBack() }}>
      //           <View style={GlobalStyles.nav_headerLeft_view} />
      //       </TouchableOpacity>
      //   ),
  });

  constructor(props){
      super(props);
      this.state = {
          isAgree:false,
          isCuoWu:true,
          isTouSu:true,
          fankuiNeiRong:'',
          lianxi:'',
          type:'1',
      }
  }
  comintMessage(){
    if (this.state.fankuiNeiRong.length==0) {
      this.refs.toast.show('内容不能为空!',1000);
      return;
    }
    if (global_isSpace(this.state.fankuiNeiRong) || this.state.fankuiNeiRong.trim().length == 0) {
            this.refs.toast.show('内容不能为空!',1000);
            return;
        }
    if (this.state.fankuiNeiRong.length >200) {
          this.refs.toast.show('内容不能超过200字符!',1000);
          return;
      }
      this.refs.LoadingView && this.refs.LoadingView.showLoading('提交中..');
      let title = '建议';
      if (this.state.type=='1') {
        title = '建议';
      }else if(this.state.type=='2'){
        title = '投诉';
      }else{
        title = '错误报告';
      }

      //请求参数
      let params = new FormData();
      params.append("ac", "getFeedback");
      params.append("uid", global.UserLoginObject.Uid);
      params.append("token", global.UserLoginObject.Token);
      params.append("sessionkey", global.UserLoginObject.session_key);
      params.append("type", this.state.type);
      params.append("title", title);
      params.append("content", this.state.fankuiNeiRong);
      params.append("contact", this.state.lianxi);

      var promise = BaseNetwork.sendNetworkRequest(params);

      promise
        .then(response => {
          this.refs.LoadingView && this.refs.LoadingView.cancer();
        if (response.msg==0) {
        this.refs.toast.show('提交成功,感谢您的宝贵意见!',1000);
        setTimeout(() => {

           this.props.navigation.state.params.callback()
          this.props.navigation.goBack()

        }, 1000);

        }else {
        NewWorkAlert(response.param)
        }
      })
        .catch(err => { });
  }


    render(){
        const { navigate } = this.props.navigation;
        return (
            <View style = {styles.container}>
               <View style = {{height:40,width:SCREEN_WIDTH-30,marginTop:30,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                 {this.state.isAgree  == true ? (<View style = {{flex:1, alignItems:'center', justifyContent:'center'}}>
                     <TouchableOpacity onPress = {() => {this.setState({isAgree:false,isCuoWu:true,isTouSu:true,type:1})}} activeOpacity={1} style = {{alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
                       <View style = {{borderColor:'grey', borderWidth:1, width:Adaption.Width(22), height:Adaption.Width(22)}}></View>
                       <CusBaseText style = {{fontSize:Adaption.Font(17,16), color:'black',marginLeft:3}}>建议</CusBaseText>
                    </TouchableOpacity>
                    </View>) :
                    (<View style = {{flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                       <TouchableOpacity onPress = {() => {this.setState({isAgree:false})}} activeOpacity={1} style = {{alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
                          <Image style = {{width:Adaption.Width(22), height:Adaption.Width(22), borderColor:'grey', borderWidth:1}} source = {require('../../login/img/ic_checkBox.png')}></Image>
                          <CusBaseText style = {{fontSize:Adaption.Font(17,16), color:'black',marginLeft:3}}>建议</CusBaseText>
                      </TouchableOpacity>
                    </View>)}

                    {this.state.isCuoWu  == true ? (<View style = {{flex:1, alignItems:'center', justifyContent:'center'}}>
                        <TouchableOpacity onPress = {() => {this.setState({isCuoWu:false,isAgree:true,isTouSu:true,type:3})}} activeOpacity={1} style = {{alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
                          <View style = {{borderColor:'grey', borderWidth:1, width:Adaption.Width(22), height:Adaption.Width(22)}}></View>
                          <CusBaseText style = {{fontSize:Adaption.Font(17,16), color:'black',marginLeft:3}}>错误报告</CusBaseText>
                       </TouchableOpacity>
                       </View>) :
                       (<View style = {{flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                          <TouchableOpacity onPress = {() => {this.setState({isCuoWu:false})}} activeOpacity={1} style = {{alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
                             <Image style = {{width:Adaption.Width(22), height:Adaption.Width(22), borderColor:'grey', borderWidth:1}} source = {require('../../login/img/ic_checkBox.png')}></Image>
                             <CusBaseText style = {{fontSize:Adaption.Font(17,16), color:'black',marginLeft:3}}>错误报告</CusBaseText>
                         </TouchableOpacity>
                       </View>)}

                       {this.state.isTouSu  == true ? (<View style = {{flex:1, alignItems:'center', justifyContent:'center'}}>
                           <TouchableOpacity onPress = {() => {this.setState({isTouSu:false,isCuoWu:true,isAgree:true,type:2})}} activeOpacity={1} style = {{alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
                             <View style = {{borderColor:'grey', borderWidth:1, width:Adaption.Width(22), height:Adaption.Width(22)}}></View>
                             <CusBaseText style = {{fontSize:Adaption.Font(17,16), color:'black',marginLeft:3}}>投诉</CusBaseText>
                          </TouchableOpacity>
                          </View>) :
                          (<View style = {{flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                             <TouchableOpacity onPress = {() => {this.setState({isTouSu:false})}} activeOpacity={1} style = {{alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
                                <Image style = {{width:Adaption.Width(22), height:Adaption.Width(22), borderColor:'grey', borderWidth:1}} source = {require('../../login/img/ic_checkBox.png')}></Image>
                                <CusBaseText style = {{fontSize:Adaption.Font(17,16), color:'black',marginLeft:3}}>投诉</CusBaseText>
                            </TouchableOpacity>
                          </View>)}
               </View>
               <View style = {{width:SCREEN_WIDTH-30,height:200,borderWidth:1,borderRadius:5,borderColor:'white',marginTop:5,padding:10,backgroundColor:'white'}}>
                 <TextInput
                   style={{width:SCREEN_WIDTH-30,height:200,fontSize:15,padding:5,marginRight:15}}
                   multiline = {true}
                   numberOfLinesnumber = {0}
                   placeholder="输入反馈内容"
                   underlineColorAndroid ='transparent'
                   onChangeText={(text) => this.setState({fankuiNeiRong:text})}>
                 </TextInput>
               </View>

                <View style = {{width:SCREEN_WIDTH-30,height:50,marginTop:5,flexDirection:'row',alignItems:'center'}}>
                <CusBaseText style = {{fontSize:Adaption.Font(17,16),color:'#222222',textAlign:'center'}}>联系方式:</CusBaseText>
                 <TextInput
                   style={{width:SCREEN_WIDTH-30-85,height:40,fontSize:15,marginLeft:10,backgroundColor:'white',borderRadius:5,padding:5}}
                   numberOfLinesnumber = {0}
                   placeholder="请留下您的联系方式"
                   underlineColorAndroid ='transparent'
                   onChangeText={(text) => this.setState({lianxi:text})}>
                 </TextInput>
               </View>

              <TouchableOpacity onPress = {() => this.comintMessage()} activeOpacity={1}
                style = {{alignItems:'center', justifyContent:'center',width:SCREEN_WIDTH-30,height:40,backgroundColor:COLORS.appColor,marginTop:20,borderRadius:5}}>
                 <CusBaseText style = {{fontSize:Adaption.Font(17,16),color:'white',textAlign:'center'}}>确认信息</CusBaseText>
              </TouchableOpacity>
              <Toast
                     ref="toast"
                     position='center'
                 />
                <LoadingView ref = 'LoadingView'/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#f3f3f3',
        padding:15,
    },
})
