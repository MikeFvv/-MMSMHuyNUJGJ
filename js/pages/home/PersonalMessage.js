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
  ScrollView,
  Modal,
} from "react-native";
const { width, height } = Dimensions.get("window");
const KAdaptionWidth = width / 414;
const KAdaptionHeight = height / 736;
import LocalImg from "../../res/img";
import LocalImages from "../../../publicconfig/images";
import BaseNetwork from "../../skframework/component/BaseNetwork"; //网络请求
import Adaption from "../../skframework/tools/Adaption"; //字体适配
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import SegmentedControl from "../../common/SegmentedControl";
import Moment from 'moment';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view'


export default class PersonalMessage extends Component {



  static navigationOptions = ({navigation, screenProps}) => ({

      header: (
          <CustomNavBar
          centerText = {"个人消息"}
          leftClick={() => {navigation.goBack()} }
               /* centerView = {
                         <View style={{
                                width: SCREEN_WIDTH - 30 - 65 - 58,
                                height: 44,
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row',
                                marginTop:SCREEN_HEIGHT == 812 ? 40 : 20,
                                marginLeft:35,
                                backgroundColor:'transparent',
                            }}>
                                <SegmentedControl
                                    values={['个人消息','意见反馈']}
                                    selectedColor='white'
                                    unSelectedColor={COLORS.appColor}
                                    style={{borderColor:'white'}}
                                    onChange={navigation.state.params?navigation.state.params.myInfoNavPress:null}
                                />
                            </View>
  
                }
                rightView = {
                    (
                      navigation.state.params.choiceData?
                        (
                            <TouchableOpacity activeOpacity={1} style={{
                                width: 80,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop:SCREEN_HEIGHT == 812?40:20,
                                backgroundColor:'transparent',
                                marginRight:10,
                            }}
                               onPress={() => navigation.state.params.navigateRightPress()}>
                              <CusBaseText style={{ fontSize: 14, color: 'white', textAlign: 'center' }}>
                                         {navigation.state.params.choiceData}
                              </CusBaseText>
                              <Image style={{width: 15 * KAdaptionWidth, height: 17 * KAdaptionHeight,marginLeft:5}}
                                     source={require("./img/ic_xiangxia.png")}
                              />
                            </TouchableOpacity>) : <View style = {{width:80}}/>
                    )
                } */
          />
      ),

  });

  constructor(props) {
    super(props);
    this.state = {
      showPageIndex:0,
      error: false,
      errorInfo: "",
      MessageArray: [], //个人消息数据
      isShowTime:false,
      yijianDataArray:[],
    };
    { (this).keyExtractor = this.keyExtractor.bind(this) }
    this.moreTime = 0;//页码
    this.jiaZai = 0;
    this.messageType = 0;//消息状态类别,0=全部,1=未读,2=已读
    this.cellHeight = 90;
    this.yijianPageid = 0;
    this.lasttime = "0";//0=当天, 1=最近一周, 2=最近一个月, 3=最近三个月, 默认为当天
    this.showRedEnvelopeArray = [{ key: 0, value: '当天' }, { key: 1, value: '最近一周' }, { key: 2, value: '最近一月' }, { key: 3, value: '最近三月' }, { key: 4, value: '取消' }]
  }
  // componentWillMount() {
  //   this.props.navigation.setParams({
  //
  //    });
  // }

  componentDidMount() {
  //   this.props.navigation.setParams({
  //       myInfoNavPress:this._showInfo,
      
  // });
  // this._fetchYijianFanKuiData(true);
  this.onHeaderRefresh();
    this.subscription = PushNotification.addListener('BiaoJiMessageSuccess', () => {
      this.onHeaderRefresh();
      this._fetchPersonalYiDuMessageData();
    });
  }

   //头部刷新
   onHeaderRefresh = () => {

    this.setState({ refreshState: RefreshState.HeaderRefreshing })
    this.moreTime = 0;
    this.state.MessageArray =[];
    this._fetchPersonalMessageData(true);

  }

//    //切换segment
//    _showInfo = (position) => {

//     if (this.state.showPageIndex === position) {
//         return;
//     }

//     if (this.state.showPageIndex == 0) {
//       this.lasttime = "0";
//       this._fetchYijianFanKuiData(true);
//         this.setState({
//             showPageIndex:1,
//         });
//         this.props.navigation.setParams({
//           choiceData: '当  天',
//       });
//     }else {
//       this.lasttime = "0";
//       this.onHeaderRefresh();
//       this.yijianPageid = 0;
//       this.props.navigation.setParams({
//         choiceData: '',
//     });
//         this.setState({
//             showPageIndex:0,
//         });
//     }
// }

// _navigateRightPress = () => {
//   this.setState({ isShowTime: true, })
// }

  //移除通知
  componentWillUnmount() {
    this.subscription && this.subscription.remove();
  }

   //获取个人消息数据
   _fetchPersonalYiDuMessageData() {

    if (global.UserLoginObject.Uid != '' && global.UserLoginObject.Token != '') {
          //请求参数
  let params = new FormData();
  params.append("ac", "flushPrice");
  params.append("uid", global.UserLoginObject.Uid);
  params.append("token", global.UserLoginObject.Token);
  params.append("sessionkey", global.UserLoginObject.session_key);

      var promise = GlobalBaseNetwork.sendNetworkRequest(params);

      promise
          .then(response => {
              if (response.msg == 0) {
                  let datalist = response.data;
                  if (response.data == null || response.data.length == 0) {
                      PersonMessageArray=0;
                      Hongbaolihe = 0;
                      Gerenfankui = 0;
                      Fuliqiandao = 0;

                  } else {
                     if((1 & response.data.user_flag)>0){
                      Hongbaolihe = 1;
                     }else {
                      Hongbaolihe = 0;   
                     }
                     if((2 & response.data.user_flag)>0){
                      PersonMessageArray = 1;
                     }else {
                      PersonMessageArray = 0;
                     }
                     if((4 & response.data.user_flag)>0){
                      Gerenfankui = 1;
                     }else {
                      Gerenfankui = 0;
                     }
                     if((8 & response.data.user_flag)>0){
                      Fuliqiandao = 1;
                     }else {
                      Fuliqiandao = 0;
                     }
                  }

              } else {

              }

          })
          .catch(err => {
          });
    }
}
  //获取个人消息数据
  _fetchPersonalMessageData(isReload) {

        //请求参数
        let params = new FormData();
        params.append("ac", "getUserMessage");
        params.append("uid", global.UserLoginObject.Uid);
        params.append("token", global.UserLoginObject.Token);
        params.append("type", this.messageType);
        params.append("sessionkey", global.UserLoginObject.session_key);
        params.append("limit", "20");
        params.append("pageid", this.moreTime);

        var promise = BaseNetwork.sendNetworkRequest(params);

        promise
          .then(response => {
            if (response.msg==0) {
              this.jiaZai = 1;
              let datalist = response.data;

              if (this.moreTime==0) {
                this.setState({
                  refreshState:RefreshState.Idle,
                })
              }else {
                this.setState({
                  refreshState: response.data.length == 0 ? RefreshState.NoMoreData : RefreshState.Idle,
                })
              }

              let dataBlog = [];
              let i = 0;
              datalist.map(dict => {
                dataBlog.push({ key: i, value: dict });
                i++;
              });
              let dataList = isReload ? dataBlog : [...this.state.dataList, ...dataBlog]
              for (let i = 0; i < dataList.length; i++) {
                dataList[i].id = i
              }
              this.setState({
                MessageArray: dataList,
              })
              datalist = null;
              dataBlog = null;

            }else {
              if (this.moreTime==0) {
                this.setState({
                  refreshState:RefreshState.Failure,
                })
              }else {
                this.setState({
                  refreshState: response.data == null ? RefreshState.NoMoreData : RefreshState.Idle,
                })
              }
            NewWorkAlert(response.param)
            }
          })
           .catch(err => { });
  }

  // //获取意见反馈数据
  // _fetchYijianFanKuiData(isReload){
  //      //请求参数
  //      let params = new FormData();
  //      params.append("ac", "getOpinionList");
  //      params.append("uid", global.UserLoginObject.Uid);
  //      params.append("token", global.UserLoginObject.Token);
  //      params.append("sessionkey", global.UserLoginObject.session_key);
  //      params.append("lasttime", this.lasttime);
  //      params.append("pageid", this.yijianPageid);

  //      var promise = BaseNetwork.sendNetworkRequest(params);

  //      promise
  //        .then(response => {
  //          if (response.msg==0) {
  //            this.jiaZai = 1;
  //            let datalist = response.data;

  //            if (this.yijianPageid==0) {
  //              this.setState({
  //                refreshState:RefreshState.Idle,
  //              })
  //            }else {
  //              this.setState({
  //                refreshState: response.data.length == 0 ? RefreshState.NoMoreData : RefreshState.Idle,
  //              })
  //            }

  //            let dataBlog = [];
  //            let i = 0;
  //            datalist.map(dict => {
  //              dataBlog.push({ key: i,isZhanKai:false,value: dict });
  //              i++;
  //            });
  //            let dataList = isReload ? dataBlog : [...this.state.dataList, ...dataBlog]
  //            for (let i = 0; i < dataList.length; i++) {
  //              dataList[i].id = i
  //            }
  //            this.setState({
  //             yijianDataArray: dataList,
  //            })
  //            datalist = null;
  //            dataBlog = null;

  //          }else {
  //            if (this.yijianPageid==0) {
  //              this.setState({
  //                refreshState:RefreshState.Failure,
  //              })
  //            }else {
  //              this.setState({
  //                refreshState: response.data == null ? RefreshState.NoMoreData : RefreshState.Idle,
  //              })
  //            }
  //          NewWorkAlert(response.param)
  //          }
  //        })
  //         .catch(err => { });
  // }

  
  //动态改变cell的高度
  _onTouchStart(e) {
    let descHeight = e.nativeEvent.layout.height;
    totalHeight = descHeight + 60 > 80 ? descHeight + 80 : 100;
    this.cellHeight = totalHeight;
  }

  _renderMessageItemView(item) {
    const { navigate } = this.props.navigation;
    let messImage = '';
    if (item.item.value.status == 1) {
      messImage = require('./img/ic_yidu.png');
    } else {
      messImage = require('./img/ic_weidu.png');
    }
    return (
      <TouchableOpacity ref={(h) => this._refMessageView = h} style={styles.cellStyle}
        activeOpacity={1} onPress={() => navigate('PersonMessageDetial', { personArray: item })}>
        <View style={{ flex: 1, flexDirection: 'column', padding: 10, justifyContent: 'center', alignItems: 'center' }}>
          <CusBaseText style={{ color: '#222222', fontSize: 15, fontWeight: '600' }} >
            {item.item.value.title}
          </CusBaseText>
          <CusBaseText style={styles.itemTextStyke} onLayout={(e) => this._onTouchStart(e)}>
            {item.item.value.content}
          </CusBaseText>
          <CusBaseText style={{ color: '#999999', fontSize: 13, marginTop: 5 }}>
            {Moment.unix(item.item.value.sendtime).format('YYYY-MM-DD HH:mm:ss')}
          </CusBaseText>
        </View>
        <Image style={{ width: 30, height: 30 }} source={messImage}></Image>
      </TouchableOpacity>
    );

  }
  //无数据页面
  listEmptyComponent() {
    if (this.jiaZai == 0) {
      return (
        <View style={{ width: width, height: height - 180, justifyContent: 'center', alignItems: 'center' }}>
        <CusBaseText style={{ textAlign: 'center', marginTop: 5 }}>数据加载中...</CusBaseText>
        </View>
      );
      }else {
    return (
      <CusBaseText style={{ textAlign: 'center', marginTop: height / 2 - 100 }}>暂无数据</CusBaseText>
    );
  }
  }

  //请求错误
  renderErrorView(error) {
    return (
      <View style={styles.container}>
        <CusBaseText>Fail:{error}</CusBaseText>
      </View>
    );
  }

  keyExtractor = (item, index) => {
    return item.id
  }
  //尾部刷新
  onFooterRefresh = () => {
    this.setState({ refreshState: RefreshState.FooterRefreshing })
    this.moreTime++;
    this._fetchPersonalMessageData(false);
  }

  //  //弹出框
  //  onRequestClose() {
  //   this.setState({
  //     isShowTime: false,
  //   })
  // }
  //   this.lasttime="1",//0=当天, 1=最近一周, 2=最近一个月, 3=最近三个月, 默认为当天
  // _onAcitveClickData(item) {
  //   if (item.index == 0) {
  //     //设置初始导航栏的值
  //     this.props.navigation.setParams({
  //       choiceData: '当   天',
  //     });
  //     this.lasttime = '0'
  //   } else if (item.index == 1) {
  //     //设置初始导航栏的值
  //     this.props.navigation.setParams({
  //       choiceData: '本  周',
  //     });
  //     this.lasttime = '1'
  //   } else if (item.index == 2) {
  //     //设置初始导航栏的值
  //     this.props.navigation.setParams({
  //       choiceData: '本  月',
  //     });
  //     this.lasttime = '2'
  //   } else if (item.index == 3) {
  //     //设置初始导航栏的值
  //     this.props.navigation.setParams({
  //       choiceData: '上  月',
  //     });
  //     this.lasttime = '3'

  //   }
  //   this.onYiJianHeaderRefresh();
  //   this.setState({
  //     isShowTime: false,
  //   })
  // }

  // _renderXuanDataItemView(item) {
  //   const { navigate } = this.props.navigation;
  //   return (
  //     <TouchableOpacity activeOpacity={1} style={{ width: width, height: 44, marginVertical: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}
  //       onPress={() => this._onAcitveClickData(item)} >
  //       <CusBaseText style={{ fontSize: Adaption.Font(15, 14), fontWeight: "400", textAlign: 'center' }}>
  //         {item.item.value}
  //       </CusBaseText>
  //     </TouchableOpacity>
  //   );
  // }
  // _isShowReceiveRedEnvel() {

  //   let modalHeight = 0;
  //   if (iOS){
  //       modalHeight = 180;
  //   }else if(Android){
  //       modalHeight = 203;
  //   }

  //   return (
  //     <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => this.onRequestClose()}>
  //       <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  //         <View style={{ width: width, height: 180, marginTop: height - modalHeight, backgroundColor: '#f3f3f3' }}>
  //           <FlatList
  //             automaticallyAdjustContentInsets={false}
  //             alwaysBounceHorizontal={false}
  //             data={this.showRedEnvelopeArray}
  //             renderItem={item => this._renderXuanDataItemView(item)}
  //           />
  //         </View>
  //       </View>
  //     </TouchableOpacity>
  //   )
  // }

  //消息状态类别,0=全部,1=未读,2=已读
  _onclickMessage(obj) {
    if (obj.i == 0) {
      this.messageType = 0;
      this.onHeaderRefresh();

    } else if (obj.i == 1) {
      this.messageType = 2;
      this.onHeaderRefresh();
    } else {
      this.messageType = 1;
      this.onHeaderRefresh();
    }

  }

  // _onYijianTouchStart(e) {
  //   let descHeight = e.nativeEvent.layout.height;
  //   totalHeight = descHeight + 90 > 175 ? descHeight + 90 : 175;
  //   this._refHeightView.setNativeProps({
  //     style: {height:totalHeight}
  // });
  // }

  // //意见反馈内容item 
  // _renderYiJianItemView(item) {
  //   let FanKuicontent = '反馈内容:'+ item.item.value.content;
  //   let fankuiChuLi = '';
  //   if(item.item.value.answer==''){
  //     fankuiChuLi = '您的反馈我们已经在做处理,请耐心等待!'
  //   }else {
  //     fankuiChuLi = item.item.value.answer;
  //   }
  //   if(item.item.isZhanKai==true) {
  //     return (
  //       <TouchableOpacity ref={(c) => this._refHeightView = c} activeOpacity={1} style={styles.yijianZhanKaiCell} onPress={() => this.onClickZhanKai(item)}>
  //         <View style={{ flex: 0.9,justifyContent: 'center'}}>
  //         <CusBaseText style={{flex:0.15, fontSize: Adaption.Font(15, 15), color:'#949494',marginTop:10,marginLeft:15}}>
  //         {Moment.unix(item.item.value.send_time).format('YYYY-MM-DD HH:mm:ss')}
  //         </CusBaseText>
  //         <CusBaseText onLayout={(e) => this._onYijianTouchStart(e)} style={{flex:0.7, fontSize: Adaption.Font(16, 15),color:'#000000',fontWeight:'400',marginTop:7,marginLeft:15}}>
  //           {FanKuicontent}
  //         </CusBaseText>
  //         <View style ={{height:1,width:SCREEN_WIDTH-30,backgroundColor:'#f3f3f3'}}></View>
  //         <CusBaseText style={{flex:0.15, fontSize: Adaption.Font(15, 14),color:'red',marginTop:10,marginLeft:15}}>
  //         {fankuiChuLi}
  //         </CusBaseText>
  //         </View>
  //         <Image style={{ width: 30, height: 20,marginLeft:(SCREEN_WIDTH-30)/2-15,marginTop:15 }}  source={require('./img/ic_shangla.png')}></Image>
  //       </TouchableOpacity>
  //     )
  //   }else {
  //   let FanKuicontent = '';
  //   FanKuicontent = item.item.value.content.substr(0, 5);  // .substr(截取起始下标, 截取的长度)
  //   let fankuiJieGuo = '';
  //   if(item.item.value.answer==''){
  //     fankuiJieGuo = '您的反馈我们已经在做处理......'
  //   }else {
  //     fankuiJieGuo = item.item.value.answer;
  //   }
  //   return (
  //     <TouchableOpacity activeOpacity={1} style={styles.yijianCell} onPress={() => this.onClick(item)}>
  //       <View style={{ backgroundColor: 'white', flex: 0.9,justifyContent: 'center'}}>
  //       <CusBaseText style={{flex:1, fontSize: Adaption.Font(18, 17), color:'#000000',fontWeight: "400",marginTop:10}}>
  //         {FanKuicontent}
  //       </CusBaseText>
  //       <CusBaseText style={{flex:1, fontSize: Adaption.Font(16, 15),color:'#949494',marginTop:7}}>
  //         {fankuiJieGuo}
  //       </CusBaseText>
  //       <CusBaseText style={{flex:1, fontSize: Adaption.Font(15, 14),color:'#767676',marginTop:3}}>
  //       {Moment.unix(item.item.value.send_time).format('YYYY-MM-DD HH:mm:ss')}
  //       </CusBaseText>
  //       </View>
  //       <Image style={{ width: 20, height: 20 }}  source={require('./img/ic_homesanjiao.png')}></Image>
  //     </TouchableOpacity>
  //   )
  //  }
  // }
  // onYiJianFooterRefresh = () => {
  //   this.setState({ refreshState: RefreshState.FooterRefreshing })
  //   this.yijianPageid++;
  //   this._fetchYijianFanKuiData(false);
  // }

  //  //头部刷新
  //  onYiJianHeaderRefresh = () => {

  //   this.setState({ refreshState: RefreshState.HeaderRefreshing })
  //   this.yijianPageid = 0;
  //   this.state.yijianDataArray =[];
  //   this._fetchYijianFanKuiData(true);

  // }
 

  // onClick(item){
  //   item.item.isZhanKai = true;
  //    this.setState({});
  // }
  // onClickZhanKai(item){
  //   item.item.isZhanKai = false;
  //   this.setState({}); 
  // }
  render() {
 
      return (
        <ScrollableTabView
          locked={true}
          automaticallyAdjustContentInsets={false}
          alwaysBounceHorizontal={false}
          renderTabBar={() => <DefaultTabBar tabStyle={{ paddingBottom: 0 }} style={{ height: 35, backgroundColor: 'white' }} />}
          onChangeTab={(obj) => this._onclickMessage(obj)}
          tabBarUnderlineStyle={styles.lineStyle}
          tabBarActiveTextColor={COLORS.appColor}>
  
          <RefreshListView
            automaticallyAdjustContentInsets={false}
            alwaysBounceHorizontal={false}
            data={this.state.MessageArray}
            renderItem={item => this._renderMessageItemView(item)}
            keyExtractor={this.keyExtractor}
            refreshState={this.state.refreshState}
            onHeaderRefresh={this.onHeaderRefresh}
            ListEmptyComponent={this.listEmptyComponent(this)} // 没有数据时显示的界面
            onFooterRefresh={this.onFooterRefresh}
            tabLabel='全部'
          />
  
          <RefreshListView
            automaticallyAdjustContentInsets={false}
            alwaysBounceHorizontal={false}
            data={this.state.MessageArray}
            renderItem={item => this._renderMessageItemView(item)}
            keyExtractor={this.keyExtractor}
            refreshState={this.state.refreshState}
            onHeaderRefresh={this.onHeaderRefresh}
            ListEmptyComponent={this.listEmptyComponent(this)} // 没有数据时显示的界面
            onFooterRefresh={this.onFooterRefresh}
            tabLabel='已读'
          />
          <RefreshListView
            automaticallyAdjustContentInsets={false}
            alwaysBounceHorizontal={false}
            data={this.state.MessageArray}
            renderItem={item => this._renderMessageItemView(item)}
            keyExtractor={this.keyExtractor}
            refreshState={this.state.refreshState}
            onHeaderRefresh={this.onHeaderRefresh}
            ListEmptyComponent={this.listEmptyComponent(this)} // 没有数据时显示的界面
            onFooterRefresh={this.onFooterRefresh}
            tabLabel='未读'
          />
  
        </ScrollableTabView>
      );
    }
 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(222,222,222)'
  },
  cellStyle: {
    width: width - 20,
    marginLeft: 10,
    height: this.cellHeight,
    marginVertical: 5, // cell垂直之间的间隔
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cdcdcd',
    flexDirection: 'row',
  },

  itemTextStyke: {
    fontSize: 13,
    color: '#666666',
    marginTop: 5
  },
  lineStyle: {
    width: width / 3,
    height: 2,
    backgroundColor: COLORS.appColor,
  },
  yijianCell:{
    width: width - 30,
    
    height: 90,
    marginVertical: 8, // cell垂直之间的间隔
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cdcdcd',
    flexDirection: 'row',
    justifyContent:'center',
    alignItems: 'center',
  },
  yijianZhanKaiCell:{
    width: width - 30,
    height: 175,
    marginVertical: 8, // cell垂直之间的间隔
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cdcdcd',
 
  }


});
