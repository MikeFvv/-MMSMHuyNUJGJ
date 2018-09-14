
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  TouchableHighlight,
  Button,
  FlatList,
  Modal,
  TextInput,
  AsyncStorage,
  Alert,
  DeviceEventEmitter,//引入监听事件
} from 'react-native';

import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import RefreshListView, {RefreshState} from 'react-native-refresh-list-view'
import Adaption from "../../../../skframework/tools/Adaption";
import BaseNetwork from "../../../../skframework/component/BaseNetwork"; //网络请求
import DialogSelected from './DateTimePicker';
import DrawalSelectBankList from '../../drawalCenter/DrawalSelectBankList';
import ListBanKFandian from './PopStateMent';
import Moment from 'moment';
import HuoCalendar from "../../welfareTask/HuoCalendar";

const { width, height } = Dimensions.get("window");
const KAdaptionWith = width / 414;
const KAdaptionHeight = height / 736;
const blankWidth = 50*KAdaptionWith;
const circleWidth = 60*KAdaptionWith;

let array = ['账号', '类型', '报表人数', '盈利']; //头部数组
let  usernameArray='';
let  next_uidNameUID='';
let alertName='';
let actypeId = '';
let nextuIdArray = [];
let backNullId = 0;

export default class TheSeenReport extends React.Component {

 static navigationOptions = ({ navigation }) => ({
            title: '下级报表',
     headerStyle: {backgroundColor: COLORS.appColor, marginTop: Android ?(parseFloat(global.versionSDK) > 19?StatusBar.currentHeight:0) : 0},
            headerTitleStyle:{color:'white',alignSelf:'center'},
            // 右边数组
            headerRight: (
              navigation.state.params?(
              <TouchableOpacity  activeOpacity={1}  style={{width:80,flexDirection:'row',justifyContent:'center',alignItems:'center',marginLeft:10}}
                  onPress={() => navigation.state.params.navigateRightPress()}>
                <CusBaseText allowFontScaling={false} style = {{fontSize:14,color:'white',textAlign:'center'}}>
                 {navigation.state.params.choiceData}
                </CusBaseText>
                <Image style={{ width: 12 * KAdaptionWith, height: 15 * KAdaptionHeight,marginLeft:5}}
                  source={require("./img/ic_xiangxia.png")}
                />
              </TouchableOpacity>):null),
                  //  左边返回按钮
                  headerLeft: (
           <TouchableOpacity
               activeOpacity={1}
               style={GlobalStyles.nav_headerLeft_touch}
               onPress={() => { 
                  //  返回上一页面 清空存的数组
                  nextuIdArray = [];
               let datas = JSON.stringify(nextuIdArray);
               AsyncStorage.setItem('DailiId', datas, (error) => {
            });
                 navigation.goBack() 

                 }}>
               <View style={GlobalStyles.nav_headerLeft_view} />
           </TouchableOpacity>
       ),
                 });
     constructor(props) {
             super(props);
             this.state = {
               nextDataList: [],//购彩记录数据
               refreshState: RefreshState.Idle,
               isShowReceiveRedEnvelope:false,
               searchId:'',  //用户名
               next_uidName:'',
               isNoData: false,
               isLoading: false,
               };


               this.moreTime = 0;//页码
               this.dataChang = 0; //日期类型
               this.numMark = 0; 
              //  this.nextWorkNum=20;
              this.timeData = 0;

               let day = '0';
               if (HuoCalendar.getDate()<10) {
                 day = '0'+HuoCalendar.getDate()
               }else {
                  day = HuoCalendar.getDate()
               }

              
                  //点击Cell 弹出底部弹出框选择状态
                this.showAlertSelected = this.showAlertSelected.bind(this);
                this.callbackSelected = this.callbackSelected.bind(this);
                this.showRedEnvelopeArray = [{key:0,value:'当天'},{key:1,value:'昨天'},{key:2,value:'本周'},{key:3,value:'本月'},{key:4,value:'上月'}]
         }

       _navigateRightPress = () => {
       this.setState({isShowReceiveRedEnvelope: true,})
       }

       //视图即将要出现的时候判断 用户命是否为空
       componentWillMount() {

        if (this.props.navigation.state.params.searchId.includes('****') || this.props.navigation.state.params.searchId==null){
          this.state.next_uidName = this.props.navigation.state.params.next_uidName;
          this.state.searchId = ''; 
          backNullId = this.props.navigation.state.params.next_uidName;
        }else{
          this.state.searchId = this.props.navigation.state.params.searchId; 
        }

       //设置初始导航栏的值
       this.props.navigation.setParams({
         navigateRightPress: this._navigateRightPress,
           choiceData: '当天',
     });
       
     }

       componentDidMount() {
         
         this.setState({
           isLoading:true,
           isNoData:false,
         });
         this._fetchPreferentialData(true,false);
       }


     //头部刷新
       onHeaderRefresh = () => {
         this.setState({refreshState: RefreshState.HeaderRefreshing,
           isLoading:true,
           isNoData:false,
         })
         this.moreTime = 0;
         this._fetchPreferentialData(true,false);
       }


            //尾部刷新
        onFooterRefresh = () => {
             this.setState({refreshState: RefreshState.FooterRefreshing})
             this.moreTime ++;
             this._fetchPreferentialData(false,true);
         }

         _getNextChangeNetWork(){

           this.setState({
           refreshState:RefreshState.Idle,
           isShowReceiveRedEnvelope:false,
           nextDataList:[],
           isLoading:true,
           isNoData:false,
           });

           this.moreTime = 0;//页码
           this._fetchPreferentialData(true,false);
           }



     //获取投注记录数据
     _fetchPreferentialData(isReload,ispou) {

              let requesMask = this.numMark;
               //请求参数
               let params = new FormData();
               params.append("ac", "getChlidStatic");   //请求类型
               params.append("uid",global.UserLoginObject.Uid);
               params.append("token",global.UserLoginObject.Token);
               params.append('sessionkey',global.UserLoginObject.session_key);
               params.append("pageid", String(this.moreTime));
               params.append("lasttime",this.timeData);
               params.append("username",this.state.searchId);
               params.append("user_id",this.state.next_uidName);
               var promise = BaseNetwork.sendNetworkRequest(params);

               promise.then(response => {

                 if(requesMask!=this.numMark){
                   return;
                 }
  
    
           if (response.msg == 0) {
             let nextArray = response.data;

              if (nextArray && nextArray.length>0){
               let josnBlogArr = [];
               let i = 0;
               nextArray.map(dict => {
                 josnBlogArr.push({ key: i, value: dict });
                 i++;
               });

               let newArr=[];  //点击进入下级
               if (ispou) {
                 newArr = isReload ? josnBlogArr : [...this.state.nextDataList, ...josnBlogArr]
               }else {
                 newArr = josnBlogArr;
               }

               for (let i = 0; i < newArr.length; i++) {
                 newArr[i].id = i
               }


            if((newArr.length/(this.moreTime+1))<20){
                this.setState({
                 nextDataList:newArr,
                 refreshState:RefreshState.Idle,
                })
              }else{
                this.setState({
                 nextDataList:newArr,
                 refreshState:RefreshState.Idle,
                });
              }

             }else{
                 if(this.state.nextDataList.length>0){
                   this.setState({
                     refreshState:RefreshState.NoMoreData,
                   });
                 }else{
                   this.setState({
                     isLoading:false,
                     isNoData:true,
                     refreshState:RefreshState.Idle,
                   });
                 }
               } 
            }else {
              this.setState({
                isLoading:false,
                isNoData:true,
                refreshState:RefreshState.Idle,
              });

              // Alert.alert('温馨提示',  response.param, [{text:'确定', onPress: () => {
              //   this.props.navigation.goBack();  
              // }}])
            }

           })
           .catch(err => { });
   }

       //无数据页面
 listEmptyComponent() {
   if (this.state.isLoading == true) {
     return (
         <View style = {{width:width,height:height-150,justifyContent:'center',alignItems:'center'}}>
           <CusBaseText style={{textAlign:'center',marginTop:5}}>数据加载中...</CusBaseText>
         </View>
     );
   }else  if(this.state.isNoData == true){
     return (
         <View style = {{width:width,height:height-150,justifyContent:'center',alignItems:'center'}}>
           <Image style={{width:60*KAdaptionWith,height:50*KAdaptionHeight}} source = {require('./img/ic_wushuju.png')}></Image>
           <CusBaseText style={{textAlign:'center',marginTop:5}}>暂无数据^_^</CusBaseText>
         </View>
     );
   }

 }

       //点击Cell
     showAlertSelected(item){
     usernameArray=item.item.value.username;
     next_uidNameUID=item.item.value.uid;
     actypeId = item.item.value.actype;

     let selectedArr = []

     if (actypeId == '会员'){
   
      selectedArr = [item.item.value.username,"返回上一级"];
    
     } else{

      if (item.item.value.next_count != 0 ) {
        selectedArr = [item.item.value.username,"查看报表","返回上级","查看下级"];
      }else {
        selectedArr = [item.item.value.username,"查看报表","返回上级"];
      }
     
     }

    
      this.dialog.show('请选择',selectedArr, '#696969', this.callbackSelected);
    }

       // 回调
      callbackSelected(i,item){
        const { navigate,goBack}=this.props.navigation;
       switch (i){
         case 0:
           break;
         case 1: // 图库

         if(actypeId == '会员') {

          this.props.navigation.goBack();  

         }else{
          navigate('TheStatements',{title:'代理报表',searchId:usernameArray,next_uid:next_uidNameUID,isSearchName:'1'})
         }
         
           //navigate('TheStatements',{title:'代理报表',searchId:usernameArray,next_uid:next_uidNameUID,isSearchName:'1'})
           break;
         case 2:
             
                  if (nextuIdArray != null && nextuIdArray.length > 1 ) {
                   
                    let backUid =  nextuIdArray[nextuIdArray.length - 2]; //跨级拿ID
                    nextuIdArray.pop();
  
               //  重新缓存数据
                   let datas = JSON.stringify(nextuIdArray);
                      AsyncStorage.setItem('DailiId', datas, (error) => { });
  
                      //拿到最后的值 去请求上一级代理的数据
                    this.setState({
                      next_uidName:backUid,
                      searchId:'',
                      });
                     this.moreTime=0;
                     this._fetchPreferentialData(false,false);
  
                    } else {
                      
                      if (nextuIdArray != null && nextuIdArray.length > 0){

                        nextuIdArray = [];
                        //  重新缓存数据
                         let datas = JSON.stringify(nextuIdArray);
                        AsyncStorage.setItem('DailiId', datas, (error) => {});
                        console.log("11123123123它的第一个子级页面的ID",backNullId);   
                          //拿到最后的值 去请求上一级代理的数据
                      this.setState({
                        next_uidName:backNullId,
                        searchId:'',
                        });
                       this.moreTime=0;
                       this._fetchPreferentialData(false,false);
                      } else {

                        nextuIdArray = [];
                        //  重新缓存数据
                         let datas = JSON.stringify(nextuIdArray);
                        AsyncStorage.setItem('DailiId', datas, (error) => {}); 
                         goBack();

                      }
                      
                            
              }
                   
           break;
           case 3:

           this.diyiArrayJieQu02(next_uidNameUID)

           this.setState({
             next_uidName:next_uidNameUID,
             searchId:'',
             });
            this.moreTime=0;
            this._fetchPreferentialData(false,false);
             break;
       }
     }


     diyiArrayJieQu02(next_uidNameUID){

           nextuIdArray.push(next_uidNameUID)
          // // 缓存数据
           let datas = JSON.stringify(nextuIdArray);
           AsyncStorage.setItem('DailiId', datas, (error) => { });                 
     }


 //cell
   renderCell = (item) => {
      const { navigate } = this.props.navigation;
      let dailiFandian =item.item.value.yingli_price?item.item.value.yingli_price:'0';
          dailiFandian=toDecimal2(dailiFandian);
     return (
       <TouchableOpacity  activeOpacity={1}  style={styles.cellStyle}
                  onPress={() => {
                    this.showAlertSelected(item)   //点击弹出底部
                  }}>
                 <View style={{flexDirection:'row',alignItems:'center', justifyContent: 'center',}}>
                 <CusBaseText  allowFontScaling={false} style={{color:'#5CACEE',width:SCREEN_WIDTH/4,textAlign:'center',backgroundColor:'white'}}>{item.item.value.username}</CusBaseText>
                 <CusBaseText allowFontScaling={false} style={{color:'#696969',width:SCREEN_WIDTH/4,textAlign:'center',backgroundColor:'white'}}>{item.item.value.actype}</CusBaseText>
                 <CusBaseText allowFontScaling={false} style={{color:'#696969',width:SCREEN_WIDTH/4,textAlign:'center',backgroundColor:'white'}}>{item.item.value.next_count}</CusBaseText>
                <View style={{justifyContent:'center',height:48*KAdaptionHeight,width:SCREEN_WIDTH/4,}}>
                 <CusBaseText allowFontScaling={false} style={{color:'orange',textAlign:'center',backgroundColor:'white'}}>{dailiFandian}</CusBaseText>
                 </View>
                 </View>
                </TouchableOpacity>
       )
 }

         //弹出框
          onRequestClose(){
            this.setState({
                isShowReceiveRedEnvelope: false,
            })
          }

     //   timeData // 0=当天, 1=昨天, 2=本周, 3=本月,  4=上月  默认为当天
          _onAcitveClickData(item)
          {

           this.numMark++;
           if(item.index == this.dataChang){
             return;
           }
           this.dataChang = item.index

           if (item.index == 0) {
               //设置初始导航栏的值
               this.props.navigation.setParams({
               choiceData: '当天',
               });
              
               this.timeData=0;
            }else if (item.index == 1)
            {
              //设置初始导航栏的值
              this.props.navigation.setParams({
              choiceData: '昨天',
              });
            
              this.timeData=1;
            }else if (item.index == 2)
            {
              //设置初始导航栏的值
              this.props.navigation.setParams({
              choiceData: '本周',
              });
             
              this.timeData=2;
            }else if (item.index == 3)
            {
              //设置初始导航栏的值
              this.props.navigation.setParams({
              choiceData: '本月',
              });
             
              this.timeData=3;
            }else if (item.index == 4)
            {
              //设置初始导航栏的值
              this.props.navigation.setParams({
              choiceData: '上月',
              });
             
              this.timeData=4;
            }
           
              this._getNextChangeNetWork();
       }

    _renderXuanDataItemView(item)
    {
      const { navigate } = this.props.navigation;
        return (
          <TouchableOpacity  activeOpacity={1}  style={{width:width,height:44,marginVertical: 1,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}
             onPress={() => this._onAcitveClickData(item)} >
           <Text  allowFontScaling={false} style={{fontSize: Adaption.Font(15, 14), fontWeight: "400",textAlign:'center'}}>
              {item.item.value}
            </Text>
          </TouchableOpacity>
        );
    }

   _isShowReceiveRedEnvel()
   {
     let modalHeight = 0;
     if (iOS) {
       modalHeight = 225;
     } else if (Android) {
       modalHeight = 248;
     }
      return(
        <TouchableOpacity activeOpacity={1} style = {{flex:1}} onPress={()=> this.onRequestClose()}>
         <View style={{backgroundColor:'rgba(0,0,0,0.2)', flex:1, alignItems:'center', justifyContent:'center'}}>
            <View style = {{width: width, height: 225, marginTop: height - modalHeight,backgroundColor:'#f3f3f3'}}>
              <FlatList
                automaticallyAdjustContentInsets={false}
                alwaysBounceHorizontal = {false}
                data={this.showRedEnvelopeArray}
                renderItem={item => this._renderXuanDataItemView(item)}
              />
            </View>
         </View>
         </TouchableOpacity>
       )
    }

    keyExtractor = (item, index) => {
      return item.id
    }


   render()
   {
       return (
       <View style ={styles.container}>
         <View style={{backgroundColor:'rgb(240,240,240)',flexDirection:'row',height:40,marginLeft:10}}>
              {this._views(array)}
              {/* 加UI渲染Cell */}
             </View>
              <RefreshListView
                automaticallyAdjustContentInsets={false}
                alwaysBounceHorizontal = {false}
                  data={this.state.nextDataList}
                  renderItem={this.renderCell}
                  refreshState={this.state.refreshState}
                  onHeaderRefresh={this.onHeaderRefresh}
                  keyExtractor={this.keyExtractor}
                  ListEmptyComponent={this.listEmptyComponent(this)} // 没有数据时显示的界面
                  onFooterRefresh={this.onFooterRefresh}
              />
     {this.state.isShowReceiveRedEnvelope?<Modal
                        visible={this.state.isShowReceiveRedEnvelope}
                        //显示是的动画默认none
                        //从下面向上滑动slide
                        //慢慢显示fade
                        animationType = {'none'}
                        //是否透明默认是不透明 false
                        transparent = {true}
                        //关闭时调用
                        onRequestClose={()=> this.onRequestClose()}
                >{this._isShowReceiveRedEnvel()}</Modal>:null}

              <DialogSelected ref={(dialog)=>{
              this.dialog = dialog;
              }} />
         </View>
          );
        }

        _views(array) {
            var viewArr = [];
            for (var i = 0; i < array.length; i++) {
                viewArr.push(
                  <View key = {i} style = {styles.circleView}>
                    <Text allowFontScaling={false} style = {styles.circleText}>
                    {array[i]}
                    </Text>
                    <View style = {styles.blankView}/>
                  </View>
                 );
                }
                return viewArr;
              }
         }

   //制保留2位小数，如：0，会在2后面补上00.即0.00
   function toDecimal2(x) {
      var f = parseFloat(x);
      if (isNaN(f)) {
       return false;
      }
      var f = Math.round(x*100)/100;
      var s = f.toString();
      var rs = s.indexOf('.');
      if (rs < 0) {
       rs = s.length;
       s += '.';
      }
      while (s.length <= rs + 2) {
       s += '0';
      }
      return s;
     }

const styles = StyleSheet.create({

 container:{
     flex:1,
     backgroundColor:'rgb(240,240,240)',
     // flexDirection:'row',
 },

 countView:{
     height:44*KAdaptionWith,
     marginLeft:20,
     marginRight:20,
     flexDirection: 'row',
     alignItems: 'center',
     borderBottomWidth:1,
     borderColor:'#ccc',
 },

relayout:{
  flexDirection:'row',
  flex:1,
  backgroundColor:'white',
  justifyContent:'center',
},

 prex:{
     // fontSize:15,
     fontSize: Adaption.Font(15, 13),
     color:'rgb(51,51,51)',
 },


 selectBank:{
     flex:1,
     justifyContent: 'center',
 },

 circleView: {
  flexDirection: 'row',
  width: SCREEN_WIDTH/4,
  height: 25*KAdaptionWith,
  marginTop:10,
},

circleText: {
  // fontSize: 18,
  fontSize: Adaption.Font(18, 16),
  width: circleWidth+20,
  height: 25*KAdaptionWith,
  backgroundColor:'rgba(1,1,1,0)',
  textAlign:'center',
},


blankView: {
 width: blankWidth,
 height: circleWidth,
},
cellStyle: {
   flexDirection:'row',
   flex:1,
   height:50*KAdaptionWith,
   backgroundColor:'white',
   borderBottomWidth:1,
   borderColor:'#d3d3d3',

},

});



