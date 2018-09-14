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
} from 'react-native';

import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';

import RefreshListView, { RefreshState } from 'react-native-refresh-list-view'

import Adaption from "../../../../skframework/tools/Adaption";
import BaseNetwork from "../../../../skframework/component/BaseNetwork"; //网络请求
import Moment from 'moment';
import HuoCalendar from "../../welfareTask/HuoCalendar";
import MenuPop_Window from "../../../me/accountDetails/MenuPop_Window";


const { width, height } = Dimensions.get("window");
const KAdaptionWith = width / 414;
const KAdaptionHeight = height / 736;
const blankWidth = 50 * KAdaptionWith;
const circleWidth = 60 * KAdaptionWith;
let alertName = '';


export default class TheDetails extends React.Component {

  static navigationOptions = ({ navigation }) => ({
      header: (
          <CustomNavBar
          //centerView   centerText
          centerView = {
                // navigation.state.params.title  

                (navigation.state.params.navigateTitlePress?
                  <TouchableOpacity
                      activeOpacity={0.7} onPress={() =>  navigation.state.params.navigateTitlePress?navigation.state.params.navigateTitlePress():null}>
                      <View style={{
                          width: SCREEN_WIDTH - 180 - 40 ,
                          height: 44,
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'row',
                          marginTop:SCREEN_HEIGHT == 812?40:20,
                          marginLeft:50,
                          backgroundColor:'transparent'
                      }}>
                          <View style={{
                              width: 130,
                              height: 35,
                              borderRadius: 5,
                              borderWidth: 1,
                              borderColor: 'white',
                              justifyContent: 'center',
                              alignItems: 'center',
                              flexDirection: 'row',
                          }}>
                              <CusBaseText
                                  style={{
                                      //fontSize: Adaption.Font(17),
                                      color: 'white',
                                      marginLeft:5,
                                  }}>{navigation.state.params.navcLTitle}</CusBaseText>
                          </View>
                      </View>
                  </TouchableOpacity>:null
              )
          }
                
              leftClick={() =>  navigation.goBack() }
              rightView = {(
                  navigation.state.params ? (
                      <TouchableOpacity activeOpacity={1} style={{ marginLeft: 10, width: 80,marginTop:SCREEN_HEIGHT == 812?38:14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                                        onPress={() => navigation.state.params.navigateRightPress()}>
                        <Text allowFontScaling={false} style={{ fontSize: 14, color: 'white', textAlign: 'center',backgroundColor:'transparent' }}>
                            {navigation.state.params.choiceData}
                        </Text>
                        <Image style={{ width: 12 * KAdaptionWith, height: 15 * KAdaptionHeight, marginLeft: 5 }}
                               source={require("./img/ic_xiangxia.png")}
                        />
                      </TouchableOpacity>) : null
              )}
          />
      ),

  });



  constructor(props) {
    super(props);
    this.state = {

      centerTradListdataList: [],//全部录数据
      refreshState: RefreshState.Idle,
      isShowReceiveRedEnvelope: false,
      isNoData: false,
      isLoading: false,
      haderISShow:false,
      alltypeArray:[],
      index: 0,
    };

    this.searchName = '';  // 搜索名称
    this.moreTimeOne = 0;//页码
    this.requestDataNum = 20;  // 请求数据条数
    this.dateType = 0; // 日期类型
    this.numMark = 0;
    this.timeData = 0; //判断时间 0 今天1 昨天2 本周 3本月 4上个月
    this.isTradtype = 0;
    this.showRedEnvelopeArray = [{ key: 0, value: '今天' }, { key: 1, value: '昨天' }, { key: 2, value: '本周' }, { key: 3, value: '本月' }, { key: 4, value: '上月' }]
  }


  _navigateRightPress = () => {
    this.setState({ isShowReceiveRedEnvelope: true, })
  }

  _navigateTitlePress = () =>{
    this.setState({
      haderISShow : !this.state.haderISShow
    }) 
  }  
  

  componentWillMount() {
    //设置初始导航栏的值
    this.props.navigation.setParams({
      navigateRightPress: this._navigateRightPress,
      navigateTitlePress: this._navigateTitlePress,
      choiceData: '今天',
      navcLTitle: '交易明细',
    });
  }

  componentDidMount() {

    this.setState({
      isLoading: true,
      isNoData: false,
    });
    this.getTradeType();
    this._getDailiCenterTradList(true);
   

  }

      /**
     * 获取交易类型
     */
    getTradeType() {
      let params = new FormData();
      params.append("ac", "getTradType");
      var promise = BaseNetwork.sendNetworkRequest(params);
      promise.then(response => {
          if (response.msg == 0) {
              this.state.alltypeArray.push({ key: 0, value: "全部类型" })
              // console.log(response.data)
              //对象转换为数组
              for (var i in response.data) {
                  this.state.alltypeArray.push({ key: i, value: response.data[i] });
              }

          }

      });
  }


  //头部刷新 
  onHeaderRefresh = () => {
    this.setState({
      refreshState: RefreshState.HeaderRefreshing,
      isLoading: true,
      isNoData: false,
    })

      this.moreTimeOne = 0;
      this._getDailiCenterTradList(true);
    
  }

  //尾部刷新 
  onFooterRefresh = () => {

    this.setState({ refreshState: RefreshState.FooterRefreshing })

      this.moreTimeOne++;
      this._getDailiCenterTradList(false);
  
  }


  // 1 初始 2 选择时间  3 查询   
  _getWingViewBaseNetwork() {

    this.setState({
      refreshState: RefreshState.Idle,
      isShowReceiveRedEnvelope: false,
      centerTradListdataList: [],
      isLoading: true,
      isNoData: false,
    });

      this.moreTimeOne = 0;
      this._getDailiCenterTradList(true);
  }

  //      this.touzhuTypes = "getDailiCenterTradList",//全部类型   
  _getDailiCenterTradList(isReload) {

    let requestMark = this.numMark;
    //全部类型
    this.refs.LoadingView && this.refs.LoadingView.showLoading('正在请求数据...');

    //请求参数
    let params = new FormData();
    params.append("ac", "getChildTradLog");   //请求类型
    params.append("uid", global.UserLoginObject.Uid);
    params.append("token", global.UserLoginObject.Token);
    params.append('sessionkey',global.UserLoginObject.session_key);
    params.append("pageid", String(this.moreTimeOne));
    params.append("lasttime", this.timeData);
    params.append("username", this.searchName);
    params.append("tradtype", this.isTradtype);
    
    var promise = BaseNetwork.sendNetworkRequest(params);
    promise.then(response => {

      this.refs.LoadingView && this.refs.LoadingView.showSuccess();

      if (requestMark != this.numMark) {
        return;
      }

      if (response.msg == 0) {

        let dataList = response.data;
        if (dataList && dataList.length > 0) {

          let dataBlog = [];
          let i = 0;
          dataList.map(dict => {
            dataBlog.push({ key: i, value: dict });
            i++;
          });
          let centerTradListdataList = isReload ? dataBlog : [...this.state.centerTradListdataList, ...dataBlog]
          for (let i = 0; i < centerTradListdataList.length; i++) {
            centerTradListdataList[i].id = i
          }

          // 防止两次请求
          if ((centerTradListdataList.length / (this.moreTimeOne + 1)) < 40) {
            this.setState({
              centerTradListdataList: centerTradListdataList,
              refreshState: RefreshState.NoMoreData,
            })
          } else {
            this.setState({
              centerTradListdataList: centerTradListdataList,
              refreshState: RefreshState.Idle,
            });
          }

        } else {

          if (this.state.centerTradListdataList.length > 0) {
            this.setState({
              refreshState: RefreshState.NoMoreData,
            })
          } else {
            this.setState({
              isLoading: false,
              isNoData: true,
              refreshState: RefreshState.Idle,
            });
          }

        }

      } else {

        this._alertPromptMessage(response.param);
      }

    })
    promise.catch(err => {

    });

  }


  _alertPromptMessage(message) {
    this.setState({
      isLoading: false,
      isNoData: true,
      refreshState: RefreshState.Idle,
    });

    Alert.alert(
      '提示',
      message,
      [{ text: '确定', onPress: () => { } },
      ])
  }

  //改变搜索的文本
  onChanegeTextKeyword(text) {
    this.searchName = text;
  }

  //搜索按钮点击  下级查询下级
  _searchSub() {

    if (this.searchName.length == 0) {
      this._showInfo('你输入的用户名为空')
    } else {
      this._getWingViewBaseNetwork();
    }
  }

  _showInfo(title) {
    Alert.alert(
      '提示',
      title,
      [
        {
          text: '确定', onPress: () => {
            this.setState({
              refreshState: RefreshState.Idle,
            })
          }
        },
      ]
    )
  }

  keyExtractor = (item: any, index: number) => {
    return item.id
  }


  //cell
  renderCell = (item) => {
    const { navigate } = this.props.navigation;
    let win_price = item.item.value.price;
    let statusName= '';
    let outTime = '';

    win_price = toDecimal2(win_price)  //  加这个是因为判断后台返回的有时候是number还是 字符串类型
    let winTextColor = ''

    if (win_price < 0) {
      winTextColor = 'red';
    } else {
      winTextColor = '#66CD00';
    }

    if (item.item.value.status_str == undefined && item.item.value.status == '1'){
      statusName=item.item.value.trad_type;
      outTime = item.item.value.pay_time;

    }else if ( item.item.value.status_str == undefined && item.item.value.trad_type == undefined){
      statusName=item.item.value.status;
      outTime = item.item.value.time;

    } else {
      statusName=item.item.value.status_str;
      outTime = item.item.value.time;
    }

    return (
      <TouchableOpacity activeOpacity={1} style={styles.cellStyle} >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 0 }}>
          <View style={{ marginLeft: 10 }}>
            <Text allowFontScaling={false} style={{ marginTop: 5, width: 200 * KAdaptionWith, height: 25 * KAdaptionHeight }}>{item.item.value.username}</Text>
            <Text allowFontScaling={false} style={{ marginTop: 4, width: 180 * KAdaptionWith, color: "#ABABAB", fontSize: Adaption.Font(12, 10) }}>{outTime}</Text>
          </View>

          <View style={{ marginLeft: 65 * KAdaptionWith, alignItems: 'center', marginTop: 0, }}>
            <Text allowFontScaling={false} style={{ marginRight: 5, color: winTextColor, height: 25, width: 135 * KAdaptionWith, textAlign: 'right' }}>{win_price + '元'}</Text>
            <Text allowFontScaling={false} style={{ marginRight: 5, marginTop: 2, width: 135* KAdaptionWith, textAlign: 'right' }}>{statusName}</Text>
          </View>

        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.sousou}>
          <TextInput
            autoCapitalize='none'
            autoCorrect={false}
            style={styles.input}
            underlineColorAndroid='transparent'
            returnKeyType="done"
            placeholder="请输入下级账号"
            maxLength={30}
            // onEndEditing={(event)=> this.setSearch({event})}
            onChangeText={(searchName) => {
              this.searchName = searchName;
            }}>

          </TextInput>
          <TouchableOpacity activeOpacity={1} style={{ width: 24, height: 24, marginRight: 10 }} onPress={this._searchSub.bind(this)}>
            <Image style={{ width: 24, height: 24, marginTop: 3 }}
              source={require("./img/fangdajing.png")}
            />
          </TouchableOpacity>
        </View>

        <View
          automaticallyAdjustContentInsets={false}
          alwaysBounceHorizontal={false}
          style={styles.container}
          locked={false}
          renderTabBar={() => <DefaultTabBar tabStyle={{ paddingBottom: 0 }} style={{ height: 35, backgroundColor: 'white' }} />}
          onChangeTab={(obj) => this._onclickDataTyle(obj)}
          tabBarUnderlineStyle={styles.lineStyle}
          tabBarActiveTextColor={COLORS.appColor}>
          <RefreshListView
            automaticallyAdjustContentInsets={false}
            alwaysBounceHorizontal={false}
            data={this.state.centerTradListdataList}
            renderItem={this.renderCell}
            keyExtractor={this.keyExtractor}
            refreshState={this.state.refreshState}
            onHeaderRefresh={this.onHeaderRefresh}
            onFooterRefresh={this.onFooterRefresh}
            ListEmptyComponent={this.listEmptyComponent(this)} // 没有数据时显示的界面
           
          />
        </View>

        {this.state.haderISShow ?
                    <View style={{ position: 'absolute', top: 0, left: 0 }}>
                        <MenuPop_Window height={200} show={this.state.haderISShow} closeModal={(show) => {
                            this.setState({ haderISShow: show })
                        }}
                            clickButtonCallback={(data) => {
                                this.getIndexData(data)
                            }} dataArray={this.state.alltypeArray} index={this.state.index} />
                    </View> : null}

        {this.state.isShowReceiveRedEnvelope ? <Modal
          visible={this.state.isShowReceiveRedEnvelope}
          //显示是的动画默认none
          //从下面向上滑动slide
          //慢慢显示fade
          animationType={'none'}
          //是否透明默认是不透明 false
          transparent={true}
          //关闭时调用
          onRequestClose={() => this.onRequestClose()}
        >{this._isShowReceiveRedEnvel()}</Modal> : null}
        <LoadingView ref='LoadingView' />

      </View>
    );
  }

     /**
     * 回调方法
     * @param data 点击的位置
     */
    getIndexData(data) {

      this.setState({ index: data });
      this.props.navigation.setParams({
          navcLTitle: this.state.alltypeArray[data].value,
      });

      if (this.state.alltypeArray[data].key === this.isTradtype ){
        return;
      }
      this.isTradtype = this.state.alltypeArray[data].key;
      console.log('opopopopop',this.state.alltypeArray[data].key);
      this._getWingViewBaseNetwork();
      
  }


  //弹出框
  onRequestClose() {

    this.setState({
      isShowReceiveRedEnvelope: false,
    })

  }

  // 选择日期查询
  _onClickSelectDate(item) {
    // 时间戳
    this.numMark++;

    // 相同就返回 不查询
    if (item.index == this.dateType) {
      return;
    }
    this.dateType = item.index;

    if (item.index == 0) {
      //设置初始导航栏的值
      this.props.navigation.setParams({
        choiceData: '今天',
      });
     
      this.timeData=0;

    } else if (item.index == 1) {
      //设置初始导航栏的值
      this.props.navigation.setParams({
        choiceData: '昨天',
      });
      this.timeData=1;
    } else if (item.index == 2) {
      //设置初始导航栏的值
      this.props.navigation.setParams({
        choiceData: '本周',
      });
     
      this.timeData=2;
    } else if (item.index == 3) {
      //设置初始导航栏的值
      this.props.navigation.setParams({
        choiceData: '本月',
      });
      this.timeData=3;
    } else if (item.index == 4) {
      //设置初始导航栏的值
      this.props.navigation.setParams({
        choiceData: '上月',
      });
      this.timeData=4;
    }

    this._getWingViewBaseNetwork();

  }

  _renderXuanDataItemView(item) {
    const { navigate } = this.props.navigation;
    return (
      <TouchableOpacity activeOpacity={1} style={{ width: width, height: 44, marginVertical: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}
        onPress={() => this._onClickSelectDate(item)} >
        <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(15, 14), fontWeight: "400", textAlign: 'center' }}>
          {item.item.value}
        </Text>
      </TouchableOpacity>
    );
  }


  _isShowReceiveRedEnvel() {

    return (
      <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => this.onRequestClose()}>
        <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: width, height: 225, marginTop: height - 225, backgroundColor: '#f3f3f3' }}>
            <FlatList
              automaticallyAdjustContentInsets={false}
              alwaysBounceHorizontal={false}
              data={this.showRedEnvelopeArray}
              renderItem={item => this._renderXuanDataItemView(item)}
            />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  // 加载视图 和 无数据页面
  listEmptyComponent() {
    if (this.state.isLoading == true) {
      return (
        <View style={{ width: width, height: height - 180, justifyContent: 'center', alignItems: 'center' }}>
          <CusBaseText style={{ textAlign: 'center', marginTop: 5 }}>数据加载中...</CusBaseText>
        </View>
      );
    } else if (this.state.isNoData == true) {
      return (
        <View style={{ width: width, height: height - 180, justifyContent: 'center', alignItems: 'center' }}>
          <Image resizeMode={'stretch'} style={{ width: 60 * KAdaptionWith, height: 50 * KAdaptionWith }} source={require('./img/ic_wushuju.png')}></Image>
          <CusBaseText style={{ textAlign: 'center', marginTop: 5 }}>暂无数据</CusBaseText>
        </View>
      );
    }

  }


}

//制保留2位小数，如：0，会在2后面补上00.即0.00
function toDecimal2(x) {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  var f = Math.round(x * 100) / 100;
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
  container: {
    flex: 1,
    backgroundColor: '#eeeeee'
  },
  lineStyle: {
    width: width / 5,
    height: 2,
    marginLeft: 25 * KAdaptionWith,
    backgroundColor: COLORS.appColor,
  },


  linearlayout: {
    width: width,
    height: 70,
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
  },
  listItemWrapper: {
    width: width / 4,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  listItemTextBlue: {
    color: '#45a162',
  },
  listItemTextRed: {
    color: '#c84a4a',
  },
  relayout: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },

  cellStyle: {
    flexDirection: 'row',
    flex: 1,
    height: 65 * KAdaptionWith,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#d3d3d3',
  },

  flex: {
    flex: 1,
  },

  topStatus: {
    marginTop: 25,
  },
  input: {
    padding: 0,
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },

  search: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold'
  },
  tip: {
    marginLeft: 5,
    marginTop: 5,
    color: '#C0C0C0',
  },
  sousou: {
    width: width - 30,
    height: 35,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
    borderRadius: 5,
    borderColor: '#cdcdcd',
    borderWidth: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'

  },

});
