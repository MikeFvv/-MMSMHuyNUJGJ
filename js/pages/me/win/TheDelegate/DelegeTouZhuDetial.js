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
  FlatList,
  Modal,
  TextInput
} from 'react-native';
const { width, height } = Dimensions.get("window");
const KAdaptionWith = width / 414;
const KAdaptionHeight = height / 736;
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import BaseNetwork from "../../../../skframework/component/BaseNetwork"; //网络请求
import Adaption from "../../../../skframework/tools/Adaption";//字体适配
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view'
import HuoCalendar from "../../welfareTask/HuoCalendar";
import Moment from 'moment';


export default class DelegeTouZhuDetial extends React.Component {


  static navigationOptions = ({ navigation }) => ({
    // title: '投注明细',
    // headerStyle: { backgroundColor: COLORS.appColor, marginTop: Android ? (parseFloat(global.versionSDK) > 19 ? StatusBar.currentHeight : 0) : 0 },
    //
    // headerTitleStyle: { color: 'white', alignSelf: 'center' },
    // headerRight: (
    //   navigation.state.params ? (
    //     <TouchableOpacity activeOpacity={1} style={{ marginRight: 5, width: 60, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
    //       onPress={() => navigation.state.params.navigateRightPress()}>
    //       <CusBaseText style={{ fontSize: 15, color: 'white', textAlign: 'center' }}>
    //         {navigation.state.params.choiceData}
    //       </CusBaseText>
    //       <Image style={{ width: 12 * KAdaptionWith, height: 15 * KAdaptionHeight, marginLeft: 5 }}
    //         source={require("./img/ic_xiangxia.png")}
    //       />
    //     </TouchableOpacity>) : null
    // ),
    // headerLeft: (
    //   <TouchableOpacity
    //     activeOpacity={1}
    //     style={GlobalStyles.nav_headerLeft_touch}
    //     onPress={() => { navigation.goBack() }}>
    //     <View style={GlobalStyles.nav_headerLeft_view} />
    //   </TouchableOpacity>
    // ),
      header: (
          <CustomNavBar
              centerText = {"投注明细"}
              leftClick={() =>  navigation.goBack() }
              rightView={(
                    navigation.state.params ? (
                      <TouchableOpacity activeOpacity={1} style={{ marginRight: 5,marginTop:SCREEN_HEIGHT == 812?38:14, width: 60, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => navigation.state.params.navigateRightPress()}>
                        <CusBaseText style={{ fontSize: 15, color: 'white', textAlign: 'center',backgroundColor:'transparent' }}>
                          {navigation.state.params.choiceData}
                        </CusBaseText>
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
      isLoading: true, //网络请求状态
      error: false,
      errorInfo: "",
      token: '',
      uid: '',
      dataList: [],//购彩记录数据
      refreshState: RefreshState.Idle,
      isShowReceiveRedEnvelope: false,
      shouUserName: '',
      tishia : '',
    };
    let day = '0';
    if (HuoCalendar.getDate() < 10) {
      day = '0' + HuoCalendar.getDate()
    } else {
      day = HuoCalendar.getDate()
    }
    this.moreTime = 0;//页码
    this.jiaZai = 0;
    this.touzhuTypes = "0";//0 =全部, 2=已中奖, 5=未中奖, 3=待开奖, 4=撤单
    this.lasttime = "0";//0=当天, 1=最近一周, 2=最近一个月, 3=最近三个月, 默认为当天
    this.bdate = HuoCalendar.getFullYear() + '-' + (HuoCalendar.getMonth() + 1) + '-' + day;
    this.edate = HuoCalendar.getFullYear() + '-' + (HuoCalendar.getMonth() + 1) + '-' + day;
    { (this).keyExtractor = this.keyExtractor.bind(this) };
    { (this).renderCell = this.renderCell.bind(this) };
    this.showRedEnvelopeArray = [{ key: 0, value: '今天' }, { key: 1, value: '昨日' }, { key: 2, value: '本周' }, { key: 3, value: '本月' }, { key: 4, value: '上月' }]
  }

  _navigateRightPress = () => {
    this.setState({ isShowReceiveRedEnvelope: true, })
  }
  componentDidMount() {
    //设置初始导航栏的值
    this.props.navigation.setParams({
      navigateRightPress: this._navigateRightPress,
      choiceData: '今天',
    });

    this.onHeaderRefresh();
  }
  //头部刷新
  onHeaderRefresh = () => {

    this.setState({ refreshState: RefreshState.HeaderRefreshing })
    this.jiaZai = 0;
    this.moreTime = 0;
    this.state.dataList = [];
    this._fetchPreferentialData(true);

  }

  //获取投注明细数据
  _fetchPreferentialData(isReload) {

    //请求参数
    let params = new FormData();
    params.append("ac", "getDailiTouzhuLog");
    params.append("uid", global.UserLoginObject.Uid);
    params.append("token", global.UserLoginObject.Token);
    params.append("type", this.touzhuTypes);
    params.append("pageid", String(this.moreTime));
    params.append("lasttime", this.lasttime);
    params.append("username", this.state.shouUserName);
    params.append("gameid", "");
    params.append("sessionkey", global.UserLoginObject.session_key);


    var promise = BaseNetwork.sendNetworkRequest(params);

    promise
      .then(response => {
        if (response.msg == 0) {
          this.jiaZai = 1;
          let datalist = response.data;
        //  let datalist = response.data['list'];
          if (this.moreTime==0) {
            this.setState({
              refreshState:RefreshState.Idle,
            })
          }else {
            this.setState({
              refreshState: response.data == null ||datalist.length == 0 ? RefreshState.NoMoreData : RefreshState.Idle,
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
            dataList: dataList,
          })
          datalist = null;
          dataBlog = null;

        }else {
          this.jiaZai = 1;
          this.state.tishia = response.param;
          if (this.moreTime==0) {
            this.setState({
              refreshState:RefreshState.Failure,
            })
          }else {
            this.setState({
              refreshState: response.data == null||datalist.length == 0  ? RefreshState.NoMoreData : RefreshState.Idle,
            })
          }
        NewWorkAlert(response.param)
        }
      })
      .catch(err => { });

  }



  //请求数据的圈圈
  renderLoadingView() {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          animating={true}
          style={{
            height: 50
          }}
          color="red"
          size="large"
        />
      </View>
    );
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
    this._fetchPreferentialData(false);
  }

  //      this.touzhuTypes = "0",//记录类型,0=全部, 1=追号记录,2=中奖, 3=待开奖, 4=撤单，5未中奖
  //   this.lasttime="1",//0=当天, 1=最近一周, 2=最近一个月, 3=最近三个月, 默认为当天
  _onclickTouZhu(obj) {
    if (obj.i == 0) {
      this.touzhuTypes = '0'
      this.onHeaderRefresh();

    } else if (obj.i == 1) {
      this.touzhuTypes = '2'
      this.onHeaderRefresh();
    } else if (obj.i == 2) {
      this.touzhuTypes = '5'
      this.onHeaderRefresh();
    } else if (obj.i == 3) {
      this.touzhuTypes = '3'
      this.onHeaderRefresh();
    } else {
      this.touzhuTypes = '4'
      this.onHeaderRefresh();
    }

  }


  //无数据页面
  listEmptyComponent() {
    if (this.jiaZai == 0) {
      return (
        <View style={{ width: width, height: height - 150, justifyContent: 'center', alignItems: 'center' }}>
          <CusBaseText style={{ textAlign: 'center', marginTop: 5 }}>{this.state.tishia.length>0?this.state.tishia:'数据加载中...'}</CusBaseText>
        </View>
      );
    } else {
      return (
        <View style={{ width: width, height: height - 150, justifyContent: 'center', alignItems: 'center' }}>
          <Image style={{ width: 60 * KAdaptionWith, height: 50 * KAdaptionHeight }} source={require('./img/ic_wushuju.png')}></Image>
          <CusBaseText style={{ textAlign: 'center', marginTop: 5 }}>暂无数据^_^</CusBaseText>
        </View>
      );
    }

  }
  //cell
  renderCell = (item) => {
    const { navigate } = this.props.navigation;
    let winLabel = '';
    let winTextColor = ''
    if (item.item.value.status == '0' || item.item.value.status == '1') {
      winLabel = '待开奖';
      winTextColor = 'gray';
    } else if (item.item.value.status == '2' && item.item.value.win == 0 ) {
      winLabel = '未中奖';
      winTextColor = 'gray';
    } else if (item.item.value.status == '2' && item.item.value.win>0 ) {
      winLabel = '赢' + item.item.value.win + '元';
      winTextColor = 'rgb(0,109,0)';
    } else if (item.item.value.status == '4') {
      winLabel = '已撤单';
      winTextColor = 'gray';
    }
    return (
      <TouchableOpacity activeOpacity={1} style={styles.cellStyle} onPress={() => this._onAcitveClickCell(item, navigate)} >
        <View style={styles.linearlayout}>

          <View style={styles.relayout}>
            <CusBaseText style={{ flex: 0.28, marginLeft: 10, color: '#222222', textAlign: 'left', fontWeight: '400', fontSize: 15, marginTop: 3 }}>
              {item.item.value.username}
            </CusBaseText>
            <CusBaseText style={{ flex: 0.44, color: '#666666', textAlign: 'center', fontSize: 13, marginTop: 3, alignItems: 'center' }}>
              {/* 第{item.item.value.qishu}期 */}
              {item.item.value.game_name}
                      </CusBaseText>
            <CusBaseText style={{ flex: 0.28, color: 'red', textAlign: 'right', fontSize: 13, marginTop: 3, marginRight: 25 }}>
              -{item.item.value.price}元
                      </CusBaseText>
          </View>

          <View style={styles.relayout}>
            <Image style={{ width: 15, height: 15, marginLeft: width - 25, alignItems: 'center', marginTop: 4 }}
              source={require("./img/ic_winsanjiao.png")}
            />
          </View>

          <View style={styles.relayout}>
            <CusBaseText style={{ flex: 0.6, color: '#999999', textAlign: 'left', fontSize: 13, marginLeft: 10 }}>
              {item.item.value.tz_time}
            </CusBaseText>
            <CusBaseText style={{ flex: 0.4, color: winTextColor, textAlign: 'right', fontSize: 13, marginLeft: 10, marginRight: 25 }}>
              {winLabel}
            </CusBaseText>

          </View>

        </View>

      </TouchableOpacity>
    )
  }
  //cell的点击方法
  _onAcitveClickCell = (item, navigate) => {
    navigate('DelegeTouXiangQing', { callback: () => { this.onHeaderRefresh() }, detialArray: item.item })
  }
  //弹出框
  onRequestClose() {
    this.setState({
      isShowReceiveRedEnvelope: false,
    })
  }
  //   this.lasttime="1",//0=当天, 1=最近一周, 2=最近一个月, 3=最近三个月, 默认为当天
  _onAcitveClickData(item) {
    if (item.index == 0) {
      //设置初始导航栏的值
      this.props.navigation.setParams({
        choiceData: '今天',
      });
      this.lasttime = 0;

    } else if (item.index == 1) {
      //设置初始导航栏的值
      this.props.navigation.setParams({
        choiceData: '昨天',
      });
      this.lasttime = 1;
      // this.bdate = Moment().add(-1, 'days').format('YYYY-MM-DD');
      // this.edate = Moment().add(-1, 'days').format('YYYY-MM-DD');
    } else if (item.index == 2) {
      //设置初始导航栏的值
      this.props.navigation.setParams({
        choiceData: '本周',
      });
      this.lasttime = 2;
      // this.bdate = Moment().isoWeekday(1).format('YYYY-MM-DD');
      // this.edate = Moment().isoWeekday(7).format('YYYY-MM-DD');
    } else if (item.index == 3) {
      //设置初始导航栏的值
      this.props.navigation.setParams({
        choiceData: '本月',
      });
      this.lasttime = 3;
      // let time = Moment().month() + 1;
      // let year = HuoCalendar.getFullYear() + '-' + time;
      // let yearDate = Moment(year, "YYYY-MM").daysInMonth();
      // this.bdate = year + '-' + '01';
      // this.edate = year + '-' + yearDate;

    } else if (item.index == 4) {
      //设置初始导航栏的值
      this.props.navigation.setParams({
        choiceData: '上月',
      });
      this.lasttime = 4;
      // let time = Moment().month();
      // let year = HuoCalendar.getFullYear() + '-' + time;
      // let yearDate = Moment(year, "YYYY-MM").daysInMonth();
      // this.bdate = year + '-' + '01';
      // this.edate = year + '-' + yearDate;

    }
    this.onHeaderRefresh();
    this.setState({
      isShowReceiveRedEnvelope: false,
    })
  }

  _renderXuanDataItemView(item) {
    const { navigate } = this.props.navigation;
    return (
      <TouchableOpacity activeOpacity={1} style={{ width: width, height: 44, marginVertical: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}
        onPress={() => this._onAcitveClickData(item)} >
        <CusBaseText style={{ fontSize: Adaption.Font(15, 14), fontWeight: "400", textAlign: 'center' }}>
          {item.item.value}
        </CusBaseText>
      </TouchableOpacity>
    );
  }
  _isShowReceiveRedEnvel() {

    let modalHeight = 0;
    if (iOS) {
      modalHeight = 225;
    } else if (Android) {
      modalHeight = 248;
    }

    return (
      <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => this.onRequestClose()}>
        <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: width, height: 225, marginTop: height - modalHeight, backgroundColor: '#f3f3f3' }}>
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
  //点击搜索
  onClickSearch() {
    if(this.state.shouUserName.length<4){
      NewWorkAlert('您输入的账号有误')
      return;
    }
    this.onHeaderRefresh();
  }
  // setSearch(){
  //   this.onHeaderRefresh();
  // }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.sousou}>
          <TextInput
            style={styles.input}
            returnKeyType="search"
            placeholder="请输入下级账号"
            maxLength={30}
            underlineColorAndroid='transparent'
            // onEndEditing={(event)=> this.setSearch({event})}
            onChangeText={(text) => this.setState({ shouUserName: text })}>
          </TextInput>
          <TouchableOpacity activeOpacity={1} style={{ width: 24 * KAdaptionWith, height: 24 * KAdaptionHeight, marginRight: 10 }} onPress={() => this.onClickSearch()}>
            <Image style={{ width: 24 * KAdaptionWith, height: 24 * KAdaptionHeight, }}
              source={require("./img/fangdajing.png")}
            />
          </TouchableOpacity>
        </View>
        <ScrollableTabView
          automaticallyAdjustContentInsets={false}
          alwaysBounceHorizontal={false}
          style={styles.container}
          locked={false}
          renderTabBar={() => <DefaultTabBar tabStyle={{ paddingBottom: 0 }} style={{ height: 35, backgroundColor: 'white' }} />}
          onChangeTab={(obj) => this._onclickTouZhu(obj)}
          tabBarUnderlineStyle={styles.lineStyle}
          tabBarActiveTextColor={COLORS.appColor}>

          <RefreshListView
            automaticallyAdjustContentInsets={false}
            alwaysBounceHorizontal={false}
            data={this.state.dataList}
            renderItem={this.renderCell}
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
            data={this.state.dataList}
            renderItem={this.renderCell}
            keyExtractor={this.keyExtractor}
            refreshState={this.state.refreshState}
            onHeaderRefresh={this.onHeaderRefresh}
            onFooterRefresh={this.onFooterRefresh}
            ListEmptyComponent={this.listEmptyComponent(this)} // 没有数据时显示的界面
            tabLabel='已中奖'
          />

          <RefreshListView
            automaticallyAdjustContentInsets={false}
            alwaysBounceHorizontal={false}
            data={this.state.dataList}
            renderItem={this.renderCell}
            keyExtractor={this.keyExtractor}
            refreshState={this.state.refreshState}
            onHeaderRefresh={this.onHeaderRefresh}
            onFooterRefresh={this.onFooterRefresh}
            ListEmptyComponent={this.listEmptyComponent(this)} // 没有数据时显示的界面
            tabLabel='未中奖'
          />

          <RefreshListView
            automaticallyAdjustContentInsets={false}
            alwaysBounceHorizontal={false}
            data={this.state.dataList}
            renderItem={this.renderCell}
            keyExtractor={this.keyExtractor}
            refreshState={this.state.refreshState}
            onHeaderRefresh={this.onHeaderRefresh}
            onFooterRefresh={this.onFooterRefresh}
            ListEmptyComponent={this.listEmptyComponent(this)} // 没有数据时显示的界面
            tabLabel='待开奖'
          />

          <RefreshListView
            automaticallyAdjustContentInsets={false}
            alwaysBounceHorizontal={false}
            data={this.state.dataList}
            renderItem={this.renderCell}
            keyExtractor={this.keyExtractor}
            refreshState={this.state.refreshState}
            onHeaderRefresh={this.onHeaderRefresh}
            onFooterRefresh={this.onFooterRefresh}
            ListEmptyComponent={this.listEmptyComponent(this)} // 没有数据时显示的界面
            tabLabel='已撤单'
          />

        </ScrollableTabView>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeeee'
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
  lineStyle: {
    width: width / 5,
    height: 2,
    backgroundColor: COLORS.appColor,
  },
  input: {
    padding: 0,
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
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
    justifyContent: 'center'
  },

});
