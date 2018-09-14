import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Modal,
} from 'react-native';
const { width, height } = Dimensions.get("window");
const KAdaptionWith = width / 414;
const KAdaptionHeight = height / 736;
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import BaseNetwork from "../../skframework/component/BaseNetwork"; //网络请求
import Adaption from "../../skframework/tools/Adaption"; //字体适配
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view'
import TouZhuHeaderView from './TouZhuHeaderView';


export default class TouZhuRecord extends React.Component {



  static navigationOptions = ({ navigation }) => ({


    header: (

      <CustomNavBar
        leftClick={() => navigation.goBack()}
        centerView={
          (navigation.state.params ?
            <TouchableOpacity
              activeOpacity={0.7} onPress={() => navigation.state.params.navigateTitlePress ? navigation.state.params.navigateTitlePress() : null}>
              <View style={{
                width: SCREEN_WIDTH - 180 - 40,
                height: 44,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginTop: SCREEN_HEIGHT == 812 ? 40 : 20,
                marginLeft: 50,
                backgroundColor: 'transparent'
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
                      fontSize: Adaption.Font(17),
                      color: 'white',
                      marginLeft: 15
                    }}>{navigation.state.params.navcLTitle}</CusBaseText>
                  <Image style={{ width: 15 * KAdaptionWith, height: 15 * KAdaptionHeight, marginLeft: 15 }}
                    source={require("./img/ic_sanjiao.png")}
                  />
                </View>
              </View>
            </TouchableOpacity> : null
          )}
        rightView={
          (
            navigation.state.params ? (
              <TouchableOpacity activeOpacity={1} style={{
                marginRight: 5,
                width: 80,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: SCREEN_HEIGHT == 812 ? 40 : 20,
                backgroundColor: 'transparent'
              }}
                onPress={() => navigation.state.params.navigateRightPress()}>
                <CusBaseText style={{ fontSize: 14, color: 'white', textAlign: 'center' }}>
                  {navigation.state.params.choiceData}
                </CusBaseText>
                <Image style={{ width: 12 * KAdaptionWith, height: 15 * KAdaptionHeight, marginLeft: 5 }}
                  source={require("./img/ic_xiangxia.png")}
                />
              </TouchableOpacity>) : null
          )
        }

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
      wanfaindx: this.props.navigation.state.params.wanfa,
      dataList: [],//购彩记录数据
      zhuqiuDataList: [],
      cpmputGameList: [],
      refreshState: RefreshState.Idle,
      isShowReceiveRedEnvelope: false,
      isShowSwitchBlocksView: false,
      sport_Id: props.navigation.state.params.sportID ? props.navigation.state.params.sportID : 2001,  //体彩ID
    };
    this.moreTime = 0;//页码
    this.jiaZai = 0;
    this.start_time = '';
    this.gameTag = '';//游戏平台类型
    this.touzhuTypes = "0";//记录类型,0=全部, 1=追号记录,2=中奖, 3=待开奖, 4=撤单，5未中奖
    this.zhuQiuState = "";//0 待开奖,1:已中奖，2:未中奖 3：和局 4，已撤单，5：已结算
    this.lasttime = "0";//0=当天, 1=最近一周, 2=最近一个月, 3=最近三个月, 默认为当天
    this.touzhuRecordKey = '';
    { (this).keyExtractor = this.keyExtractor.bind(this) }
    { (this).renderCell = this.renderCell.bind(this) }
    { (this).renderComputGameCell = this.renderComputGameCell.bind(this) }
    this.showRedEnvelopeArray = [{ key: 0, value: '今天' }, { key: 1, value: '昨天' }, { key: 2, value: '本周' }, { key: 3, value: '本月' }, { key: 4, value: '上月' }]
  }

  _navigateRightPress = () => {
    this.setState({ isShowReceiveRedEnvelope: true, })
  }
  componentDidMount() {

    this.touzhuRecordKey = this.props.navigation.state.key;
    //设置初始导航栏的值
    this.props.navigation.setParams({
      navigateRightPress: this._navigateRightPress,
      navigateTitlePress: this._navigateTitlePress,
      choiceData: '今天',
      navcLTitle: this.state.wanfaindx == 1 ? '彩票' : '足球',
    });

    this._dataRequest();
  }

  //弹出玩法选择
  _navigateTitlePress = () => {

    this.setState({
      isShowSwitchBlocksView: !this.state.isShowSwitchBlocksView,
    });

  };

  _dataRequest() {
    this.moreTime = 0;
    this.jiaZai = 0;
    this.start_time = '';
    this.state.dataList = [];
    this.state.zhuqiuDataList = [];
    if (this.state.wanfaindx == 0) {
      this._fetchZhuQiuPreferentialData(true);
    } else if (this.state.wanfaindx == 1) {
      this._fetchPreferentialData(true);
    } else {
      this._fetchComputGameData(true);
    }
  }
  //头部刷新
  onHeaderRefresh = () => {

    this.setState({ refreshState: RefreshState.HeaderRefreshing })
    this.moreTime = 0;
    this.jiaZai = 0;
    this.start_time = '';
    this.state.dataList = [];
    this.state.zhuqiuDataList = [];
    this.state.cpmputGameList = [];
    if (this.state.wanfaindx == 0) {
      this._fetchZhuQiuPreferentialData(true);
    } else if (this.state.wanfaindx == 1) {
      this._fetchPreferentialData(true);
    } else {
      this._fetchComputGameData(true);
    }

  }
  //获取电子游戏投注记录
  _fetchComputGameData(isReload) {
    let loginObject = global.UserLoginObject;
    //请求参数
    let params = new FormData();
    params.append("ac", "GetWebUserTouzhuLog");
    params.append("uid", loginObject.Uid);
    params.append("token", loginObject.Token);
    params.append("count", '20');
    params.append("tag", this.gameTag);
    params.append("lasttime", this.lasttime);
    params.append("pageid", String(this.moreTime));
    params.append("sessionkey", global.UserLoginObject.session_key);

    var promise = BaseNetwork.sendNetworkRequest(params);

    promise
      .then(response => {
        if (response.msg == 0) {
          this.jiaZai = 1;
          let datalist = response.data;

          if (this.moreTime == 0) {
            this.setState({
              refreshState: RefreshState.Idle,
            })
          } else {
            if (response.data == null || response.data.length == 0) {
              this.setState({
                refreshState: RefreshState.NoMoreData,
              })
              return;
            } else {
              this.setState({
                refreshState: RefreshState.Idle,
              })
            }
          }

          let dataBlog = [];
          let i = 0;
          datalist.map(dict => {
            dataBlog.push({ key: i, value: dict });
            i++;
          });
          let dataList = isReload ? dataBlog : [...this.state.cpmputGameList, ...dataBlog]
          for (let i = 0; i < dataList.length; i++) {
            dataList[i].id = i
          }
          this.setState({
            cpmputGameList: dataList,
          })
          datalist = null;
          dataBlog = null;

        } else {
          this.jiaZai = 1;
          if (this.moreTime == 0) {
            this.setState({
              refreshState: RefreshState.Failure,
            })
          } else {
            this.setState({
              refreshState: response.data == null ? RefreshState.NoMoreData : RefreshState.Idle,
            })
          }
          NewWorkAlert(response.param)
        }
      })
      .catch(err => { });
  }

  //获取投注记录数据
  _fetchPreferentialData(isReload) {

    let loginObject = global.UserLoginObject;
    //请求参数
    let params = new FormData();
    params.append("ac", "getUserTouzhuLog");
    params.append("uid", loginObject.Uid);
    params.append("token", loginObject.Token);
    params.append("type", this.touzhuTypes);
    params.append("gameid", "0");
    params.append("pageid", String(this.moreTime));
    params.append("lasttime", this.lasttime);
    params.append("sessionkey", global.UserLoginObject.session_key);

    var promise = BaseNetwork.sendNetworkRequest(params);

    promise
      .then(response => {
        if (response.msg == 0) {
          this.jiaZai = 1;
          let datalist = response.data;

          if (this.moreTime == 0) {
            this.setState({
              refreshState: RefreshState.Idle,
            })
          } else {
            if (response.data == null || response.data.length == 0) {
              this.setState({
                refreshState: RefreshState.NoMoreData,
              })
              return;
            } else {
              this.setState({
                refreshState: RefreshState.Idle,
              })
            }
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

        } else {
          this.jiaZai = 1;
          if (this.moreTime == 0) {
            this.setState({
              refreshState: RefreshState.Failure,
            })
          } else {
            this.setState({
              refreshState: response.data == null ? RefreshState.NoMoreData : RefreshState.Idle,
            })
          }
          NewWorkAlert(response.param)
        }
      })
      .catch(err => { });
  }

  //获取足球记录数据
  _fetchZhuQiuPreferentialData(isReload) {

    let loginObject = global.UserLoginObject;
    //请求参数
    let params = new FormData();
    params.append("ac", "getUserBetslip");
    params.append("uid", loginObject.Uid);
    params.append("token", loginObject.Token);
    params.append("sport_id", this.state.sport_Id);
    params.append("status", this.zhuQiuState);
    params.append("lasttime", this.lasttime);
    params.append("end_time", this.start_time);
    params.append("sessionkey", global.UserLoginObject.session_key);

    var promise = BaseNetwork.sendNetworkRequest(params);

    promise
      .then(response => {
        if (response.msg == 0) {
          this.jiaZai = 1;
          let datalist = response.data['betslip'];

          if (this.start_time == '') {
            this.setState({
              refreshState: RefreshState.Idle,
            })
          } else {
            if (datalist == undefined || datalist.length == 0) {
              this.setState({
                refreshState: RefreshState.NoMoreData,
              })
              return;
            } else if (this.start_time == response.data.next_time) {
              this.setState({
                refreshState: RefreshState.NoMoreData,
              })
              return;
            }
            else {
              this.setState({
                refreshState: RefreshState.Idle,
              })
            }

          }
          this.start_time = response.data.next_time;

          let dataBlog = [];
          let i = 0;
          datalist.map(dict => {
            dataBlog.push({ key: i, value: dict });
            i++;
          });
          let dataList = isReload ? dataBlog : [...this.state.zhuqiuDataList, ...dataBlog];
          for (let i = 0; i < dataList.length; i++) {
            dataList[i].id = i
          }
          this.setState({
            zhuqiuDataList: dataList,
          })
          datalist = null;
          dataBlog = null;

        } else {
          this.jiaZai = 1;
          if (this.start_time == '') {
            this.setState({
              refreshState: RefreshState.Failure,
            })
          } else {
            this.setState({
              refreshState: response.data == null ? RefreshState.NoMoreData : RefreshState.Idle,
            })
          }
          NewWorkAlert(response.param)
          return;
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
    if (this.state.wanfaindx == 0) {
      this._fetchZhuQiuPreferentialData(false);
    } else {
      this._fetchPreferentialData(false);
    }
  }

  //      this.touzhuTypes = "0",//记录类型,0=全部, 1=追号记录,2=中奖, 3=待开奖, 4=撤单，5未中奖
  //   this.lasttime="1",//0=当天, 1=最近一周, 2=最近一个月, 3=最近三个月, 默认为当天
  //this.zhuQiuState = "5";//0 待开奖,1:已中奖，2:未中奖 3：和局 4，已撤单，5：已结算
  //"status": 0,          //0: 未开獎， 1:已中獎，2: 未中獎，3:和局， 4:已撤單
  _onclickTouZhu(obj) {
    if (obj.i == 0) {
      this.touzhuTypes = '0'
      this.zhuQiuState = "";
      this.onHeaderRefresh();

    } else if (obj.i == 1) {
      this.touzhuTypes = '3'
      this.zhuQiuState = "0";
      this.onHeaderRefresh();
    } else if (obj.i == 2) {
      this.touzhuTypes = '2'
      this.zhuQiuState = "1";
      this.onHeaderRefresh();
    } else if (obj.i == 3) {
      this.touzhuTypes = '1'
      this.zhuQiuState = "2";
      this.onHeaderRefresh();
    } else {
      this.touzhuTypes = '4'
      this.zhuQiuState = "4";
      this.onHeaderRefresh();
    }

  }
//
// <<<<<<< HEAD
//   //进入体彩的入口
//   _onclickTiCai() {
//     const { navigate } = this.props.navigation;
//     navigate('BuyLot');
//     // if(this.state.wanfaindx == 0) {
//     //   navigate('FootballGame',  {
//     //       gameId: 2001,
//     //    })
//     // }else {
//     //   navigate('BuyLotDetail', { gameId:'1' })
//     // }
//   }
// =======
    //进入体彩的入口
    _onclickTiCai() {
      const { navigate } = this.props.navigation;
      navigate('NewBuyLot');
      // if(this.state.wanfaindx == 0) {
      //   navigate('FootballGame',  {
      //       gameId: 2001,
      //    })
      // }else {
      //   navigate('BuyLotDetail', { gameId:'1' })
      // } 
    }
// >>>>>>> e8d45e6d7a0acb5a0141617d46d8bcd31fc95a22

  //无数据页面
  listEmptyComponent() {
    if (this.jiaZai == 0) {
      return (
        <View style={{ width: width, height: height - 180, justifyContent: 'center', alignItems: 'center' }}>
          <CusBaseText style={{ textAlign: 'center', marginTop: 5 }}>数据加载中...</CusBaseText>
        </View>
      );
    } else {
      const { navigate } = this.props.navigation;
      return (
        <View style={{ width: width, height: height - 180, justifyContent: 'center', alignItems: 'center' }}>
          <Image resizeMode={'stretch'} style={{ width: 60 * KAdaptionWith, height: 50 * KAdaptionWith }} source={require('./img/ic_noData.png')}></Image>
          <CusBaseText style={{ textAlign: 'center', marginTop: 5 }}>暂无数据</CusBaseText>
          <TouchableOpacity activeOpacity={1} style={{ width: 90, height: 30, marginTop: 5, backgroundColor: COLORS.appColor, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => this._onclickTiCai()}>
            <CusBaseText style={{ fontSize: 14, color: 'white', textAlign: 'center' }}>
              立即购买
            </CusBaseText>
          </TouchableOpacity>
        </View>
      );
    }

  }

  _onAcitveClickZhuQiuCell(item, navigate) {
    navigate('TouZhuZuCaiDanZhuDetial', { detialArray: item.item })
  }

  _onAcitveClickZhuChuanGuanQiuCell(item, navigate) {
    navigate('TouZhuZongHeDetial', { detialArray: item.item })
  }
  //cell
  renderCell = (item) => {
    const { navigate } = this.props.navigation;
    //"status": 0,          //0: 未开獎， 1:已中獎，2: 未中獎，3:和局， 4:已撤單
    if (this.state.wanfaindx == 0) {
      let winLabel = '';
      let winTextColor = ''
      if (item.item.value.bet_info[0].status == '0') {
        winLabel = '待开奖';
        winTextColor = '#ff7c34';
      } else if (item.item.value.bet_info[0].status == '2') {
        winLabel = '未中奖';
        winTextColor = 'red';
      } else if (item.item.value.bet_info[0].status == '1') {
        winLabel = '已中奖'
        winTextColor = 'rgb(0,109,0)';
      } else if (item.item.value.bet_info[0].status == '4') {
        winLabel = '已撤单';
        winTextColor = 'gray';
      } else if (item.item.value.bet_info[0].status == '3') {
        winLabel = '和局';
        winTextColor = 'rgb(0,109,0)';
      } else if (item.item.value.bet_info[0].status == '5') {
        winLabel = '危险球判定中';
        winTextColor = 'gray';
      } else if (item.item.value.bet_info[0].status == '6') {
        winLabel = '危险球撤單';
        winTextColor = 'gray';
      }



      if (item.item.value.bet_info.length > 1) {
        let zongHeState = '';
        let zongHeTextColor = '';

        let statusArr = [];
        for (let inIndex = 0; inIndex < item.item.value.bet_info.length; inIndex++) {
          statusArr.push(item.item.value.bet_info[inIndex].status);

        }


        if (statusArr.includes(4)) {
          zongHeState = '已撤单';
          zongHeTextColor = 'gray';

        } else if (statusArr.includes(0)) {
          zongHeState = '待开奖';
          zongHeTextColor = '#ff7c34';

        } else if (statusArr.includes(2)) {
          zongHeState = '未中奖';
          zongHeTextColor = 'red';

        } else {
          zongHeState = '已中奖'
          zongHeTextColor = 'rgb(0,109,0)';
        }


        return (
          <TouchableOpacity activeOpacity={1} onPress={() => this._onAcitveClickZhuChuanGuanQiuCell(item, navigate)} >
            <View style={{ width: width - 30, marginLeft: 15, height: 120, borderRadius: 8, backgroundColor: 'white', marginTop: 15 }}>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <CusBaseText style={{ color: '#222222', fontWeight: '500', fontSize: 16, marginLeft: 15 }}>
                  综合过关
                  </CusBaseText>
              </View>
              <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                <View style={{ flex: 0.7, justifyContent: 'center' }}>
                  <CusBaseText style={{ color: '#222222', fontWeight: '500', fontSize: 16, marginLeft: 15 }}>
                    {item.item.value.bet_info.length}串1
                  </CusBaseText>
                </View>
                <View style={{ flex: 0.3, justifyContent: 'center' }}>
                  <CusBaseText style={{ color: '#313131', fontWeight: '400', fontSize: 15, textAlign: 'right', marginRight: 15 }}>
                    已结算:{item.item.value.opened_result}
                  </CusBaseText>
                </View>

              </View>

              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                <View style={{ flex: 0.7, justifyContent: 'center' }}>
                  <CusBaseText style={{ color: '#313131', fontWeight: '400', fontSize: 16, marginLeft: 15 }}>
                    实际盈亏
                    </CusBaseText>
                </View>
                <View style={{ flex: 0.3, justifyContent: 'center' }}>
                  <CusBaseText style={{ color: '#313131', fontWeight: '400', fontSize: 15, textAlign: 'right', marginRight: 15 }}>
                    {item.item.value.profit}元
                    </CusBaseText>
                </View>
              </View>
              <View style={{ width: width - 60, height: 0.7, marginLeft: 15, backgroundColor: '#d2d2d2' }}></View>
              <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                <View style={{ flex: 0.7, flexDirection: 'row', alignItems: 'center' }}>
                  <CusBaseText style={{ color: '#222222', fontWeight: '400', fontSize: 15, marginLeft: 15 }}>
                    下注:   <CusBaseText style={{ fontWeight: '400', fontSize: 15, color: 'red' }}>
                      {item.item.value.bet_info[0].price}
                    </CusBaseText>
                    元
                    </CusBaseText>

                </View>
                <View style={{ flex: 0.3, justifyContent: 'center' }}>
                  <CusBaseText style={{ fontWeight: '400', fontSize: 15, textAlign: 'right', color: zongHeTextColor, marginRight: 15 }}>
                    {zongHeState}
                  </CusBaseText>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )
      } else {
        let h = '';
        if (item.item.value.game_type == 4) {
          h = item.item.value.bet_info[0].h;
        } else {
          h = item.item.value.bet_info[0].team;
        }


        return (
          <TouchableOpacity activeOpacity={1} onPress={() => this._onAcitveClickZhuQiuCell(item, navigate)} >
            <View style={{ width: width - 30, marginLeft: 15, height: 150, borderRadius: 8, backgroundColor: 'white', marginTop: 15 }}>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <CusBaseText style={{ color: '#222222', fontWeight: '500', fontSize: 16, marginLeft: 15 }}>
                  {item.item.value.bet_info[0].play_method}
                </CusBaseText>
              </View>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <CusBaseText style={{ color: '#222222', fontWeight: '500', fontSize: 16, marginLeft: 15 }}>
                  {h}
                </CusBaseText>
              </View>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <View style={{ flex: 0.7, flexDirection: 'row', alignItems: 'center' }}>
                  <CusBaseText style={{ color: '#222222', fontWeight: '400', fontSize: 15, marginLeft: 15 }}>
                    {item.item.value.bet_info[0].bet_content}
                  </CusBaseText>
                  <CusBaseText style={{ fontWeight: '400', fontSize: 15, color: 'red', marginLeft: 5 }}>
                    @{item.item.value.bet_info[0].new_odds}
                  </CusBaseText>
                </View>
              </View>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                <View style={{ flex: 0.7, justifyContent: 'center' }}>
                  <CusBaseText style={{ color: '#313131', fontWeight: '400', fontSize: 16, marginLeft: 15 }}>
                    实际盈亏
                    </CusBaseText>
                </View>
                <View style={{ flex: 0.3, justifyContent: 'center' }}>
                  <CusBaseText style={{ color: '#313131', fontWeight: '400', fontSize: 15, textAlign: 'right', marginRight: 15 }}>
                    {item.item.value.profit} 元
                    </CusBaseText>
                </View>
              </View>
              <View style={{ width: width - 60, height: 0.7, marginLeft: 15, backgroundColor: '#d2d2d2' }}></View>
              <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                <View style={{ flex: 0.7, flexDirection: 'row', alignItems: 'center' }}>
                  <CusBaseText style={{ color: '#222222', fontWeight: '400', fontSize: 15, marginLeft: 15 }}>
                    下注:   <CusBaseText style={{ fontWeight: '400', fontSize: 15, color: 'red' }}>
                      {item.item.value.bet_info[0].price}
                    </CusBaseText>
                    元
                    </CusBaseText>


                </View>
                <View style={{ flex: 0.3, justifyContent: 'center' }}>
                  <CusBaseText style={{ fontWeight: '400', fontSize: 15, textAlign: 'right', color: winTextColor, marginRight: 15 }}>
                    {winLabel}
                  </CusBaseText>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )
      }

    } else {

      let winLabel = '';
      let winTextColor = ''
      if (item.item.value.status == '0') {
        winLabel = '待开奖';
        winTextColor = 'gray';
      } else if (item.item.value.status == '2') {
        winLabel = '未中奖';
        winTextColor = 'gray';
      } else if (item.item.value.status == '1') {
        winLabel = '赢' + item.item.value.win + '元';
        winTextColor = 'rgb(0,109,0)';
      } else if (item.item.value.status == '3') {
        winLabel = '已撤单';
        winTextColor = 'gray';
      }
      return (
        <TouchableOpacity activeOpacity={1} onPress={() => this._onAcitveClickCell(item, navigate)} >
          <View style={styles.linearlayout}>
            <View style={styles.relayoutss}>
              <CusBaseText style={{ flex: 0.28, marginLeft: 10, color: '#222222', textAlign: 'left', fontWeight: '400', fontSize: 15 }}>
                {item.item.value.game_name}
              </CusBaseText>
              <CusBaseText style={{ flex: 0.44, color: '#666666', textAlign: 'center', fontSize: 13, alignItems: 'center' }}>
                第{item.item.value.qishu}期
                      </CusBaseText>
              <CusBaseText style={{ flex: 0.28, color: 'red', textAlign: 'right', fontSize: 13, marginRight: 25 }}>
                -{item.item.value.price}元
                      </CusBaseText>
            </View>

            <View style={styles.relayout}>
              <Image style={{ width: 15, height: 15, marginLeft: width - 25, alignItems: 'center', marginTop: 4 }}
                source={require('./img/ic_homesanjiao.png')}
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


  }
  //cell的点击方法
  _onAcitveClickCell = (item, navigate) => {
    navigate('TouZhuDetial', { callback: () => { this.onHeaderRefresh() }, detialArray: item.item, buyLotPushVCKey: this.touzhuRecordKey })
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
      this.lasttime = '0'
    } else if (item.index == 1) {
      //设置初始导航栏的值
      this.props.navigation.setParams({
        choiceData: '昨天',
      });
      this.lasttime = '1'

    } else if (item.index == 2) {
      //设置初始导航栏的值
      this.props.navigation.setParams({
        choiceData: '本周',
      });
      this.lasttime = '2'

    } else if (item.index == 3) {
      //设置初始导航栏的值
      this.props.navigation.setParams({
        choiceData: '本月',
      });
      this.lasttime = '3'
    }
    else if (item.index == 4) {
      //设置初始导航栏的值
      this.props.navigation.setParams({
        choiceData: '上月',
      });
      this.lasttime = '4'
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
      modalHeight = 224;
    } else if (Android) {
      modalHeight = 247;
    }

    return (
      <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => this.onRequestClose()}>
        <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: width, height: 224, marginTop: height - modalHeight, backgroundColor: '#f3f3f3' }}>
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
  _onclickMGGame(obj){
    if(obj.i==0){
      this.gameTag = '';
      this.onHeaderRefresh();
    }else{
      this.gameTag = HomeComputerGameArray[obj.i-1].value.tag;
      this.onHeaderRefresh();
    }
  }

  renderComputGameCell = (item) =>{
    let winColor = '';
    let topColor = '';
    let winMGLabel = '';
    let shuying = '';
    if(item.item.value.win==0) {
      winMGLabel = '-' + item.item.value.tz_price;
      winColor = '#999999';
      topColor = 'red';
      shuying = '输';
    }else {
      winMGLabel = '+' + item.item.value.win;
      winColor = 'rgb(0,109,0)';
      topColor = 'rgb(0,109,0)';
      shuying = '赢';
    }
    return (
      <TouchableOpacity activeOpacity={1}  >
        <View style={styles.MgDianZilinearlayout}>
          
            <CusBaseText style={{ marginTop:12, marginLeft: 10, color: '#222222', textAlign: 'left', fontWeight: '400', fontSize: Adaption.Font(17,15) }}>
              {item.item.value.game_name}
            </CusBaseText>
            <View style={{width:width-24,height:30,backgroundColor:'white',flexDirection:'row', alignItems: 'center'}}>
              <CusBaseText style={{flex:0.7, marginLeft: 10, color: '#222222', textAlign: 'left', fontWeight: '400', fontSize: Adaption.Font(17,15) }}>
                实际盈亏
              </CusBaseText>
              <CusBaseText style={{flex:0.3,marginRight:10,textAlign: 'right', color: topColor, fontWeight: '400', fontSize: Adaption.Font(17,15) }}>
              {winMGLabel}元
              </CusBaseText>
            </View>
            <View style={{width:width-24,height:30,backgroundColor:'white',flexDirection:'row', alignItems: 'center'}}>
              <CusBaseText style={{flex:0.3, marginLeft: 10, color: '#222222', textAlign: 'left', fontWeight: '400', fontSize: Adaption.Font(17,15) }}>
                下注: <CusBaseText style={{ marginLeft: 10, color: 'red', textAlign: 'left', fontWeight: '400', fontSize: Adaption.Font(17,15) }}>
                {item.item.value.tz_price}
              </CusBaseText>
               元
              </CusBaseText>
              <CusBaseText style={{flex:0.7,marginRight:10,textAlign: 'right', color: '#666666', fontWeight: '400', fontSize: Adaption.Font(17,15) }}>
              {item.item.value.tz_time}
              </CusBaseText>
            </View>
            <View style={{width:width-44,marginLeft:10,height:0.7,backgroundColor:'#cdcdcd'}}></View>
          
            <CusBaseText style={{ color: '#999999', textAlign: 'left', fontSize: Adaption.Font(15,14), marginLeft: 10,marginTop:7 }}>
              订单号: {item.item.value.dingdan}
            </CusBaseText>
        

        </View>

      </TouchableOpacity>
    )
  }
  _youxiGameView() {
    return (
      <ScrollableTabView
        contentContainerStyle={styles.container}
        automaticallyAdjustContentInsets={false}
        alwaysBounceHorizontal={false}
        scrollConen={{ width: width, height: height }}
        locked={false}
        renderTabBar={() => <DefaultTabBar tabStyle={{ paddingBottom: 0 }} style={{ height: 35, backgroundColor: 'white' }} />}
        onChangeTab={(obj) => this._onclickMGGame(obj)}
        tabBarUnderlineStyle={{ width: width / (HomeComputerGameArray.length + 1), height: 2, backgroundColor: COLORS.appColor, }}
        tabBarActiveTextColor={COLORS.appColor}>

        <RefreshListView
          key = {100}
          automaticallyAdjustContentInsets={false}
          alwaysBounceHorizontal={false}
          data={this.state.cpmputGameList}
          renderItem={this.renderComputGameCell}
          keyExtractor={this.keyExtractor}
          refreshState={this.state.refreshState}
          onHeaderRefresh={this.onHeaderRefresh}
          ListEmptyComponent={this.listEmptyComponent(this)} // 没有数据时显示的界面
          onFooterRefresh={this.onFooterRefresh}
          tabLabel='全部'
        />
        {this._MGGameView()}

      </ScrollableTabView>
    )
  }

  _MGGameView() {
    var viewArr = [];
    for (var i = 0; i < HomeComputerGameArray.length; i++) {

      viewArr.push(
        <RefreshListView
          key = {i+1}
          automaticallyAdjustContentInsets={false}
          alwaysBounceHorizontal={false}
          data={this.state.cpmputGameList}
          renderItem={this.renderComputGameCell}
          keyExtractor={this.keyExtractor}
          refreshState={this.state.refreshState}
          onHeaderRefresh={this.onHeaderRefresh}
          ListEmptyComponent={this.listEmptyComponent(this)} // 没有数据时显示的界面
          onFooterRefresh={this.onFooterRefresh}
          tabLabel={HomeComputerGameArray[i].value.pt_name}
        />
      );
    }
    return viewArr;
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.wanfaindx != 2 ?
          <ScrollableTabView
            contentContainerStyle={styles.container}
            automaticallyAdjustContentInsets={false}
            alwaysBounceHorizontal={false}
            scrollConen={{ width: width, height: height }}
            locked={false}
            renderTabBar={() => <DefaultTabBar tabStyle={{ paddingBottom: 0 }} style={{ height: 35, backgroundColor: 'white' }} />}
            onChangeTab={(obj) => this._onclickTouZhu(obj)}
            tabBarUnderlineStyle={styles.lineStyle}
            tabBarActiveTextColor={COLORS.appColor}>

            <RefreshListView
              automaticallyAdjustContentInsets={false}
              alwaysBounceHorizontal={false}
              data={this.state.wanfaindx == 1 ? this.state.dataList : this.state.zhuqiuDataList}
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
              data={this.state.wanfaindx == 1 ? this.state.dataList : this.state.zhuqiuDataList}
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
              data={this.state.wanfaindx == 1 ? this.state.dataList : this.state.zhuqiuDataList}
              renderItem={this.renderCell}
              keyExtractor={this.keyExtractor}
              refreshState={this.state.refreshState}
              onHeaderRefresh={this.onHeaderRefresh}
              onFooterRefresh={this.onFooterRefresh}
              ListEmptyComponent={this.listEmptyComponent(this)} // 没有数据时显示的界面
              tabLabel='中奖'
            />

            <RefreshListView
              automaticallyAdjustContentInsets={false}
              alwaysBounceHorizontal={false}
              data={this.state.wanfaindx == 1 ? this.state.dataList : this.state.zhuqiuDataList}
              renderItem={this.renderCell}
              keyExtractor={this.keyExtractor}
              refreshState={this.state.refreshState}
              onHeaderRefresh={this.onHeaderRefresh}
              onFooterRefresh={this.onFooterRefresh}
              ListEmptyComponent={this.listEmptyComponent(this)} // 没有数据时显示的界面
              tabLabel={this.state.wanfaindx == 1 ? '追号' : '未中奖'}
            />

            <RefreshListView
              automaticallyAdjustContentInsets={false}
              alwaysBounceHorizontal={false}
              data={this.state.wanfaindx == 1 ? this.state.dataList : this.state.zhuqiuDataList}
              renderItem={this.renderCell}
              keyExtractor={this.keyExtractor}
              refreshState={this.state.refreshState}
              onHeaderRefresh={this.onHeaderRefresh}
              onFooterRefresh={this.onFooterRefresh}
              ListEmptyComponent={this.listEmptyComponent(this)} // 没有数据时显示的界面
              tabLabel='撤单'
            />

          </ScrollableTabView> : this._youxiGameView()}
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
        {this.state.isShowSwitchBlocksView ?
          <TouZhuHeaderView
            isClose={this.state.isShowSwitchBlocksView}
            slectIndex={this.state.wanfaindx}
            close={() => {
              this.setState({
                isShowSwitchBlocksView: false,
              })
            }}
            onChange={(currentIndex) => {
              this.state.wanfaindx = currentIndex; // 改变了wanfaindx，再从allPlayData里拿对应的玩法数据。
              let wanfaName = '';
              if (currentIndex == 0) {
                wanfaName = '足球';
              } else if (currentIndex == 1) {
                wanfaName = '彩票';
              } else {
                wanfaName = '电子游戏';
              }
              this.setState({
                isShowSwitchBlocksView: false,
              });
              this.props.navigation.setParams({
                navcLTitle: wanfaName,
              });
              this._dataRequest();
            }} />
          : null
        }
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3'
  },
  lineStyle: {
    width: width / 5,
    height: 2,
    backgroundColor: COLORS.appColor,
  },


  linearlayout: {
    width: width,
    height: 70,
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
    backgroundColor: 'white',
    padding: 5,
  },
  MgDianZilinearlayout: {
    width: width-24,
    height: 121,
    marginLeft:12,
    marginTop:12,
    borderRadius:10,
    backgroundColor: 'white',
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
  relayoutss: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',

  },

});
