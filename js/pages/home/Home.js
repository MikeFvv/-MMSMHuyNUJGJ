import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Alert,
  ScrollView,
  Platform,
  StatusBar,
  Easing,
  Animated,
  Modal,
  WebView,
  ImageBackground,
  NetInfo,
  AsyncStorage,
  Linking,
} from "react-native";

const { width, height } = Dimensions.get("window");
const KAdaptionWith = width / 414;
const KAdaptionHeight = height / 736;
import { StackNavigator } from "react-navigation";
import LocalImg from "../../res/img";
import LocalImages from "../../../publicconfig/images";

import BaseNetwork from "../../skframework/component/BaseNetwork"; //网络请求
import Adaption from "../../skframework/tools/Adaption"; //字体适配
import JPushModule from 'jpush-react-native';
import Toast, { DURATION } from 'react-native-easy-toast'
import LocalImgs from '../../../js/res/img';   // 缓冲图片
import HomeHeaderView from './HomeHeaderView';
import HomeCaiBlockView from './HomeCaiBlockView';
import HomeCaiFootView from './HomeCaiFootView';
import HomeGongGao from './HomeGongGao';

import GetSetStorge from '../../skframework/component/GetSetStorge'
import SwitchURLHome from '../../skframework/common/SwitchURLClass';
import DataRequest from '../../common/DataRequest'
import NavStyle from './CusNavStyle';
import HomeDefaultTabBar from './HomeDefaultTabBar'

import RNFetchBlob from "react-native-fetch-blob";

import { CachedImage, ImageCache } from "react-native-img-cache";
import Carousel from 'react-native-banner-carousel';
import DownAddress from '../../../js/skframework/common/DownAddress'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import HomeRedPacketView from './HomeRedPacket';  //左上角红包活动


export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      //  swiperShow: false,
      translateY: new Animated.Value(0),
      isShowGongGao: false,
      gongGaoContent: '',
      // dataSource: dataSource.cloneWithPages(SwiperArray),
      dataSource: [],
      homeArray: [],
      footWinArray: [],
      homeSystemArray: [],
      is_GuestShiWan: 0,
      banbarArray: [],
      backupCpicon: false,//是否启用备用彩种地址
      isShowOldVersion: false,  // 旧版本提示
      isNoNetwork: false,   // true = 无网络， false 有网络
      isNoNetworkBig: false,
      isNoDataLoad: false,
      backupBanbarCpicon: false, //轮番图加载不出来给默认图片代替
      isSystemWeiHu: isSystemMaintain, //系统维护
      caizhongIndex: 0,
      tabNames: ['热门', '高频彩', '低频彩', '全部'],
      tabIconNames: [require('./img/ic_remen.png'), require('./img/ic_gerenxiaoxi.png'), require('./img/ic_gerenxiaoxi.png'), require('./img/ic_gerenxiaoxi.png')],
      everyDayWinPrice: 0, //每日加奖奖金
      everyDayDesc : '', //每日加奖描述
    };

    this.loginOut = false;
    this.isJump == false;
    this.isTiShi = false;
    this.wating = false;
    this.isRefreshView = true;  //是否刷新render
    this.canPush = true;

    this.lineIPIndex1 = 0;
    this.lineIPIndex2 = 0;
    this.lineIPIndex3 = 0;
  }

  // 这里可以单独单独设置 属性
  static navigationOptions = ({ navigation, screenProps }) => ({
    // 这里面的属性和App.js的navigationOptions是一样的。
    header: (
      <NavStyle
        backgroundColor={COLORS.appColor}

        homeNavLogo={GlobalConfig.userData.phone_logo}
        fontSize={navigation.state.params ? ((global.UserLoginObject.Token != '') ? 14 : 18) : null}
        leftText={navigation.state.params ? ((global.UserLoginObject.Token != '') ? "" : '登录') : null}
        rightText={navigation.state.params ? ((global.UserLoginObject.Token != '') ? navigation.state.params.home_userMoney : '注册') : null}
        rightClick={() => navigation.state.params ? ((global.UserLoginObject.Token != '') ? "" : navigation.state.params.navigateRightPress()) : null}
        leftGiftClick={() => {
          navigation.state.params ? navigation.state.params.navigateLeftPress() : null
        }} />
    ),

    tabBarOnPress: (({ route, index }, jumpToIndex) => {
      // 只有调用jumpToIndex方法之后才会真正的跳转页面
      jumpToIndex(index);
      // console.log(route);
      navigation.state.params && navigation.state.params.tabBarPress ? navigation.state.params.tabBarPress() : null;
    }),


  })

  _navigateTabBarPress = () => {
    if (GlobalConfig.baseURL != undefined && GlobalConfig.baseURL.length > 0) {
      this._repeatRequestData();
    }
  }


  _repeatRequestData() {

    if (this.state.homeArray.length == 0 || this.state.homeArray == null) {
    //  this._fetchHomeData();
    } else {
      if (this.state.isNoDataLoad) {
        this.setState({
          isNoDataLoad: false,
        });
      }
    }
  }

  _navigateLeftPress = () => {


    if (global.UserLoginObject.Token == '') {
        //是否首页进入登录和注册
        global.isHomeVcPush = true;
        const {navigate} = this.props.navigation;
        navigate('Login', {title: '登录'});
    }
    else {

        //表示可以领取优惠派发活动
        if (Hongbaolihe == 1 && this.wating == false) {
            this._takeEveryReward();
            setTimeout(() => {
                this.wating = false;
            }, 2000);
        }
        else {

            const {navigate} = this.props.navigation;
            if (this.state.is_GuestShiWan == 2) {
                Alert.alert(
                    '温馨提示',
                    '您的账号是试玩账号,没有权限访问!',
                    [
                        {
                            text: '确定', onPress: () => {
                        }
                        },
                    ]
                )
            } else {
                if (this.canPush) {
                    this.canPush = false;
                    navigate('PersonalMessage', {
                        callback: () => {
                            this.props.navigation.setParams({});
                        }
                    })

                    setTimeout(()=>{
                        this.canPush  = true;
                    },1000);
                }
            }
        }
    }
  }

  //如果存在每日加奖
  _takeEveryReward(){

      this.refs.LoadingView && this.refs.LoadingView.showLoading('领取彩金中..');
      let params = new FormData();
      params.append('ac', 'UserGetEventAward');
      params.append('uid', global.UserLoginObject.Uid);
      params.append('token', global.UserLoginObject.Token);
      params.append('sessionkey', global.UserLoginObject.session_key);

      var promise = BaseNetwork.sendNetworkRequest(params);
      promise
          .then(response => {

              this.refs.LoadingView && this.refs.LoadingView.cancer();

              if (response.msg == 0) {
                  // 初始化
                  this.state.everyDayWinPrice = response.data.price;
                  this.state.everyDayDesc = response.data.title;
              }
              else {

                  if (response.param){
                      this.state.everyDayDesc = response.param;
                  }
              }

              //不管成功与否都要刷新导航栏
              let params = new FormData();
              params.append("ac", "flushPrice");
              params.append("uid", global.UserLoginObject.Uid);
              params.append("token", global.UserLoginObject.Token);
              params.append('sessionkey', global.UserLoginObject.session_key);
              var promise = BaseNetwork.sendNetworkRequest(params);
              promise
                  .then(response => {

                      if (response.msg == 0 && response.data){

                          if((1 & response.data.user_flag)>0){
                              Hongbaolihe = 1;
                          }else {
                              Hongbaolihe = 0;
                          }

                          this.isRefreshView = false;
                          this.props.navigation.setParams({});
                      }
                  })

                  .catch(error => {
                  })


              //点击打开每日嘉奖,登录后
              setTimeout(() => {

                  this.refs.HomeRedPacketClass && this.refs.HomeRedPacketClass.showRedPacketView(this.state.everyDayDesc, this.state.everyDayWinPrice);

              }, 500);
          })
          .catch(err => {

          });
  }

  _navigateRightPress = () => {

    //是否首页进入登录和注册
    global.isHomeVcPush = true;
    global.isHomeAndLoginPush = false;
    const { navigate } = this.props.navigation;
    navigate('Register', { title: '注册' });
  }

  refshToken() {


    if (global.UserLoginObject.Uid != ''
      && global.UserLoginObject.Token != '' && global.UserLoginObject.session_key != '') {

      if (this.time_interval) {

        this.time_interval = null;
        clearTimeout(this.time_interval);
      }

      let params = new FormData();
      params.append("ac", "flushPrice");
      params.append("uid", global.UserLoginObject.Uid);
      params.append("token", global.UserLoginObject.Token);
      params.append('sessionkey', global.UserLoginObject.session_key);
      var promise = BaseNetwork.sendNetworkRequest(params);
      promise
        .then(response => {


          //msg == 40000 则被踢下线
          if (response.msg == 40000) {

            this.loginOut = true;
            //清空用户信息
            global.UserInfo.shareInstance();
            global.UserInfo.removeUserInfo((result) => {

              if (result == true) {
                this.props.navigation.setParams({
                  home_userMoney: null,
                  navigateLeftPress: this._navigateLeftPress,
                  navigateRightPress: this._navigateRightPress,
                  tabBarPress: this._navigateTabBarPress,
                });
                //登录被踢下线, 发出通知刷新我的界面
                PushNotification.emit('LoginOutSuccess');
                PushNotification.emit('ClearAllBalls'); // 踢下线 不显示赔率
                this.props.navigation.navigate('Login', { title: '登录', indexR: 1 });
              }
            })
          }
          else {

           this.loginOut = false;

           if((1 & response.data.user_flag)>0){
              Hongbaolihe = 1;
           }
           else {
              Hongbaolihe = 0;
           }

            //请求到数据才会设置延迟方法
            this.time_interval = setTimeout(() => {

              this.refshToken();

            }, 8000);
          }
        })
        .catch(err => {

          this.time_interval = setTimeout(() => {

            this.refshToken();

          }, 8000);

        });
    }
  }

  componentWillMount() {

    if (Cpicon.length == 0 || Cpicon == undefined) {
      let homeImageKey = 'HomeImagDataObjcet';
      UserDefalts.getItem(homeImageKey, (error, result) => {
        if (!error) {
          if (result !== '' && result !== null) {
            let homeImageModel = JSON.parse(result);
            Cpicon = homeImageModel.cpicon;
            HomeBanner = homeImageModel.homeBanner;
            CPLinShiIcon = homeImageModel.cpLinShiIcon;
          }
        }
      });
    }


    this.state.banbarArray = SwiperArray;

    this.state.footWinArray = FootWinArray;

    this.state.homeSystemArray = HomeSystemArray;


  }


  componentDidMount() {

    if (Platform.OS === "ios") {
      // 版本更新
      // this._oldVersionjudgment();
    }
    this.state.is_GuestShiWan = global.UserLoginObject.is_Guest;

    if (HomeArray.length == 0 || HomeArray == undefined ) {
     this._fetchHomeArray();
    }else {
      this.state.homeArray = HomeArray;
    }
    // 缓冲页面停留延时

    //15秒过后刷新获取最新的首页数据覆盖之前旧的缓存
    // setTimeout(() => {
    //   this._fetchHomeData();
    // }, 20000);
    //检测网络是否连接
    NetInfo.isConnected.fetch().then(isConnected => {
      // this.setState({ isConnected });
    });

    //监听网络链接变化事件
    NetInfo.isConnected.addEventListener('connectionChange', this._handleIsConnectedChange);
    this._homeGetDataRequestCache(global.isFirstNetwork);

    //设置初始导航栏的值
    if (global.UserLoginObject.Uid != '') {

      this.props.navigation.setParams({
        home_userMoney: (global.UserLoginObject.TotalMoney),
        navigateLeftPress: this._navigateLeftPress,
        navigateRightPress: this._navigateRightPress,
        tabBarPress: this._navigateTabBarPress,
      });

    }
    else {

      this.props.navigation.setParams({
        home_userMoney: null,
        navigateLeftPress: this._navigateLeftPress,
        navigateRightPress: this._navigateRightPress,
        tabBarPress: this._navigateTabBarPress,
      });
    }


    // 通知
    JPushModule.addReceiveCustomMsgListener((message) => {
      // console.log(message);
      //这是默认的通知消息
      //alert(message.alertContent);
      // this.setState({pushMsg:message});

    });

    JPushModule.addReceiveOpenNotificationListener((message) => {
      // console.log(message);
      //alert(message.alertContent);
    })

    //输入域名防止过快进入首页不刷新数据导致空白
    if(CPYuMingShuRu ==1) {
      setTimeout(() => {
      this._fetchHomeArray();
  
      }, 2000);
    
     } 


    //延迟刷新用户token的接口
    setTimeout(() => {
      this.refshToken();
    }, 20000);

    this.subscription4444 = PushNotification.addListener('ShuaXinJinEr', () => {
          
      this._fetchPersonalMessageData();
    });

    //接受投注成功时刷新金额的通知
    this.subscription2 = PushNotification.addListener('RefreshUserTotalMoney', (money) => {

        this._renderReFresh();
      if (typeof (money) == 'number') {

        money = money.toFixed(2);
      }

      this.props.navigation.state.params.home_userMoney = money;
    })

    //接受我的界面刷新金额的通知
    this.subscription3 = PushNotification.addListener('RefreshHomeNavRightText', (money) => {

        this._renderReFresh();
      if (typeof (money) == 'number') {

        money = money.toFixed(2);
      }

      this.props.navigation.state.params.home_userMoney = money;
    })

    //接受登录的通知
    this.subscription4 = PushNotification.addListener('LoginSuccess', (loginObject) => {
      this._flatList.scrollToOffset({animated: true, offset: 0});
      this._renderReFresh();
      this.loginOut = false;
      this.state.is_GuestShiWan = loginObject.is_Guest;
     this._fetchPersonalMessageData();
   
      

      //防止didmount中解析失败，没有启动定时器
      {
        this.refshToken()
      }

      this._forceRefreshNav();

    });

    //退出登录成功重新给导航栏赋值
    this.subscription5 = PushNotification.addListener('LoginOutSuccess', () => {
      this.props.navigation.state.params.home_userMoney = null;
      this.loginOut = true;

    })

  }

    _fetchHomeArray() {
         //请求参数
         let params = new FormData();
         params.append("ac", "getGameListAtin");
         params.append("types", "");
         var promise = GlobalBaseNetwork.sendNetworkRequest(params, this.lineIPIndex3);
         promise
           .then(response => {
     
             if (response.msg == 0) {
     
               let datalist = response.data;
               if (datalist != undefined) {
     
                 // 初始化
                 this.lineIPIndex3 = 0;
                 let datalist = response.data;
     
                 let indexArray = [];
                 let dataBlog = [];
                 let i = 0;
     
                 datalist.map(dict => {
                   dataBlog.push({ key: i, value: dict });
                   i++;
                 });
                 datalist.map((item) => {
                 if (item.type == 1) {
     
                   if (item.hot == 1 ) {
                     indexArray.push({key: i, value: item});
                 }
               }else {
                 if (item.hot == 1 ) {
                   indexArray.push({key: i, value: item});
                   }
               }
                   i++;
               })
                indexArray.push({ key: 99, value: {} });
                 
               this.setState({homeArray:indexArray})
               }
             }
           })
           .catch(err => {
     
           });
    }

  _forceRefreshNav = () => {

    if (global.UserLoginObject.Uid != '') {

      this._renderReFresh();

      setTimeout(() => {
        this.props.navigation.setParams({
          home_userMoney: global.UserLoginObject.TotalMoney,
        });
      }, 3000);
    }
  }

  //防止刷新导航栏也会刷新render导致页面出现闪烁
  _renderReFresh(){

      this.isRefreshView = false;

      setTimeout(()=>{this.isRefreshView = true;}, 4000);
  }

  shouldComponentUpdate(nextProps,nextState) {
    
    //暂时解决首页刷新页面闪烁的问题
    if (this.isRefreshView == true){
      return true;
    }
    else {
      return false;
    }
  }

  //移除通知
  componentWillUnmount() {

    //移除监听
    NetInfo.isConnected.removeEventListener('connectionChange', this._handleIsConnectedChange);


    this.time_interval && clearTimeout(this.time_interval);

    if (typeof (this.subscription2) == 'object') {
      this.subscription2 && this.subscription2.remove();
    }

    if (typeof (this.subscription4444) == 'object') {
      this.subscription4444 && this.subscription4444.remove();
    }

    if (typeof (this.subscription3) == 'object') {
      this.subscription3 && this.subscription3.remove();
    }

    if (typeof (this.subscription4) == 'object') {
      this.subscription4 && this.subscription4.remove();
    }

    if (typeof (this.subscription5) == 'object') {
      this.subscription5 && this.subscription5.remove();
    }

  }



  //获取个人消息数据
  _fetchPersonalMessageData() {
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
                  if (response.data == null ) {
                      PersonMessageArray=0;
                      Hongbaolihe = 0;
                      Gerenfankui = 0;
                      Fuliqiandao = 0;
                      AnQuanZhongXin = 0;

                  } else {

                    // 顺便给金额赋一下值。。。。
                    if (typeof(response.data.price) == 'number') {
                        response.data.price = response.data.price.toFixed(2);
                    }
                    global.UserLoginObject.TotalMoney = response.data.price;

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
                     if((16 & response.data.user_flag)>0){
                      AnQuanZhongXin = 1;
                     }else {
                      AnQuanZhongXin = 0;
                     }
                  }

              } else {

              }

          })
          .catch(err => {
          });
  }
}

  // 网络监听方法
  _handleIsConnectedChange = (isConnected) => {

    this._homeGetDataRequestCache(isConnected);

  }


  _homeGetDataRequestCache(isConnected) {
    // 网络有变化时请求一遍数据
    if (isConnected) {
      this._repeatRequestData();

      if (this.state.isNoNetwork == true) {
        this.setState({
          isNoNetwork: false,
          isNoNetworkBig: false,
        });
      }

    } else {

      this.setState({
        isNoNetwork: true,
      });

      //  首页请求数据缓存
      let homeKey = 'HomeCaiZhongObjcet';
      UserDefalts.getItem(homeKey, (error, result) => {
        if (!error) {
          if (result !== '' && result !== null) {
            let homeModel = JSON.parse(result);
            this.setState({
              homeArray: homeModel.HomeCaiZhongArray,
              banbarArray: homeModel.HomeSwiperArray,
              footWinArray: homeModel.HomeFootWinArray,
              homeSystemArray: homeModel.HomeSystemArray
            });
            AllZhongArray = homeModel.HomeCaiZhongAllArray;
            HomeArray = homeModel.HomeCaiZhongArray;
            HomeHeightZhongArray = homeModel.HomeHeightCaiZhongArray;
            HomeLowZhongArray = homeModel.HomeLowCaiZhongArray;
          } else {
            this.setState({
              isNoNetworkBig: true,
            });
          }
        } else {
          this.setState({
            isNoNetworkBig: true,
          });
        }
      });
    }
  }




  _backAction = () => {
      console.log("我他妈的射了吗");
    // global.ShouYeYinDao=0;
    // PushNotification.emit('HomeYinDao', global.UserLoginObject);

    if (!this.loginOut) {

      this._forceRefreshNav();

    }

  }

  _oldVersionjudgment() {
    let oldVer = '1.60.0';
    let aa = VersionNum.replace(".", "")
    let bb = oldVer.replace(".", "")

    if (parseFloat(aa) < parseFloat(bb)) {
      this.setState({
        isShowOldVersion: true
      })
    }
  }

  _linking() {
    Linking.openURL(DownAddress(SwitchURLIndex)).catch(err => console.error('An error occurred', err));
  }


  _noDataLoadRetry() {
    this.refs.LoadingView && this.refs.LoadingView.showLoading('正在加载数据...');
    this._repeatRequestData();
  }

  // 旧版本提示框
  _isShowOldVersionView() {
    return (
      <View style={styles.OldVersionContainer}>
        <TouchableOpacity activeOpacity={0.7} style={styles.OldVersionOpacityStyle}
          onPress={() => this._linking()}>
          <View style={styles.OldVersionView1}>
            <CusBaseText style={{ fontSize: 26, color: '#4da5d3', }}>发现新版本</CusBaseText>
          </View>
          <View style={styles.OldVersionLine1Style} />
          <View style={styles.OldVersionView2}>
            <CusBaseText style={{ fontSize: 20 }}>马上更新, 新版本带给你更好的体验!</CusBaseText>
            <CusBaseText style={{ fontSize: 16, color: 'red' }}>温馨提示: 如果第一次没有更新过去,请退出后台程序从新运行一遍</CusBaseText>
          </View>
          <View style={styles.OldVersionLine2Style} />
          <View style={styles.OldVersionView3}>
            <CusBaseText style={{ fontSize: 18 }}>现在升级</CusBaseText>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  //无网络页面
  _noNetworkComponent() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, justifyContent: 'center', alignItems: 'center', marginTop: -100, }}>
        <Image resizeMode={'stretch'} style={{ width: 166.5, height: 166.5 }} source={LocalImgs.ic_noNetwork} />
        <CusBaseText style={{ fontSize: 16, textAlign: 'center', marginTop: 5, color: '#909090', }}>网络状态待提升</CusBaseText>

        <TouchableOpacity activeOpacity={0.5} style={{ marginTop: 20, height: 35, width: 130, justifyContent: 'center', marginTop: 15, borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, flexDirection: 'row', alignItems: 'center', backgroundColor: '#eaeaea', }} onPress={() => navigate('NoNetworkPrompt')}>
          <CusBaseText style={{ fontSize: 16, width: 116, color: '#5d3a41', textAlign: 'center' }}>查看解决方案</CusBaseText>
        </TouchableOpacity>

      </View>
    );
  }

  //无数据加载显示
  _noDataComponent() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, justifyContent: 'center', alignItems: 'center', marginTop: -100, }}>
        <Image resizeMode={'stretch'} style={{ width: 270, height: 149 }} source={LocalImgs.ic_dataLoadFailed} />
        <CusBaseText style={{ fontSize: 16, textAlign: 'center', marginTop: 5, color: '#909090', }}>数据加载失败 , 请重新加载~</CusBaseText>

        <TouchableOpacity activeOpacity={0.5} style={{ marginTop: 20, height: 35, width: 130, justifyContent: 'center', borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, flexDirection: 'row', alignItems: 'center', backgroundColor: '#eaeaea', }} onPress={() => this._noDataLoadRetry()}>
          <CusBaseText style={{ fontSize: 16, width: 116, color: '#5d3a41', textAlign: 'center' }}>刷新重试</CusBaseText>
        </TouchableOpacity>

      </View>
    );
  }

  //系统维护
  _isXiTongWeiHuLo() {
    const { navigate } = this.props.navigation;
    return (
      <ImageBackground style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, alignItems: 'center' }} source={require('./img/ic_weihubeijing.png')}  >
        <View style={{ height: 64, width: width, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.appColor }}>
          <CusBaseText style={{ fontSize: Adaption.Font(20, 18), color: '#fff', textAlign: 'center', marginTop: 20 }}>
            系统维护
              </CusBaseText>
        </View>
        <View style={{ flex: 0.65, alignItems: 'center' }}>
          <Image style={{ width: 300, height: 300, marginTop: 40 }} source={require('./img/ic_weihushizhong.png')}>
          </Image>
        </View>
        <View style={{ flex: 0.35, alignItems: 'center' }}>
          <CusBaseText style={{ marginTop: 10, fontSize: 23, color: COLORS.appColor, textAlign: 'center' }}>
            预计升级维护时间
            </CusBaseText>
          <CusBaseText style={{ marginTop: 10, fontSize: 20, color: COLORS.appColor, textAlign: 'center' }}>
            {SystemTime}
          </CusBaseText>
          <TouchableOpacity
            activeOpacity={0.5}
            style={{ marginTop: 10, height: 40, width: 150, justifyContent: 'center', borderRadius: 20, alignItems: 'center', backgroundColor: "rgb(21,169,233)", }}
            onPress={() => this._xitongweihu()}>
            <CusBaseText style={{ fontSize: 18, width: 116, color: '#fff', textAlign: 'center' }}>联系客服</CusBaseText>
          </TouchableOpacity>
        </View>

      </ImageBackground>
    )
  }
  _xitongweihu() {
    if(GlobalConfig.service_url()==undefined||GlobalConfig.service_url().length==0) {
        
      Alert.alert(
        '提示',
        '系统正在维护',
        [
            {text: '确定', onPress: () => {}},
        ]
    )
    }else {
    const { navigate } = this.props.navigation;
    this.setState({ isSystemWeiHu: false })
    navigate('ChatService', { callback: () => { this._fetchxitonghuidiaoData() }, title: '在线客服', })
    }
  }

  _fetchxitonghuidiaoData() {
    this.setState({ isSystemWeiHu: isSystemMaintain });
  }
  _noNetworkTopComponent() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ width: SCREEN_WIDTH, height: 45, backgroundColor: '#ffdfe2', marginTop: 0 }}>

        <TouchableOpacity activeOpacity={1} style={{ width: SCREEN_WIDTH, height: 45, backgroundColor: '#ffdfe2', marginTop: 0, flexDirection: 'row', alignItems: 'center', }} onPress={() => navigate('NoNetworkPrompt')}>

          <Image style={{ marginLeft: 15, width: 30, height: 30, }} source={require('./img/ic_noNetwork.png')}>
          </Image>

          <CusBaseText style={{ marginLeft: 15, fontSize: 16, color: '#5d3a41', textAlign: 'center' }}>
            当前网络不可用,请检查你的网络设置
          </CusBaseText>
        </TouchableOpacity>
      </View>
    )
  }

  //头部视图
  _listHeaderComponent() {
    return (
      <FlatList
        style={{ backgroundColor: 'white' }}
        ref={(flatList)=>this._flatList = flatList}
        bounces={false}
        automaticallyAdjustContentInsets={false}
        alwaysBounceHorizontal={false}
        data={this.state.homeArray}
        renderItem={item => this._renderItemView(item)}
        horizontal={false} //水平还是垂直
        showsVerticalScrollIndicator={false} //不显示右边滚动条
        ListFooterComponent={() => this._listFooterComponent()}
        ListHeaderComponent={() => this._listHomeHeaderComponent()}
      />
    );

  }

  _listHomeHeaderComponent() {
    return this.state.homeArray.length !== 0 ? (
      <HomeHeaderView
        backAction={this._backAction}
        // is_GuestShiWan={this.state.is_GuestShiWan}
        navigator={this.props.navigation}
      >
      </HomeHeaderView>
    ) : null;
  }

  _listFooterComponent() {
    return this.state.homeArray.length !== 0 ? (
      <HomeCaiFootView
        backAction={this._backAction}
        // is_GuestShiWan={this.state.is_GuestShiWan}
        navigator={this.props.navigation}
      >
      </HomeCaiFootView>
    ) : null;
  
  }

  _renderItemView(item) {
    return null;
  }


  render() {
    
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Modal
          visible={this.state.isSystemWeiHu}
          //显示是的动画默认none
          //从下面向上滑动slide
          //慢慢显示fade
          animationType={'none'}
          //是否透明默认是不透明 false
          transparent={true}
          //关闭时调用
          onRequestClose={() => {
          }}
        >{this._isXiTongWeiHuLo()}</Modal>

        <StatusBar
          animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
          hidden={false}  //是否隐藏状态栏。
          backgroundColor={COLORS.appColor} //状态栏的背景色
          translucent={true}//指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
          barStyle={'light-content'} // enum('default', 'light-content', 'dark-content')
        />

        {iOS ? this.state.isNoNetwork ? this._noNetworkTopComponent() : null : null}
        {this._listHeaderComponent()}
        {/* {this._renderFlatlist()} */}
        <HomeGongGao></HomeGongGao>
        <Toast
          ref="toast"
          position='center'
        />

        <Modal
          visible={this.state.isShowOldVersion}
          //显示是的动画默认none
          //从下面向上滑动slide
          //慢慢显示fade
          animationType={'none'}
          //是否透明默认是不透明 false
          transparent={true}
          //关闭时调用
          onRequestClose={() => {
          }}
        >{this._isShowOldVersionView()}</Modal>


        {iOS ? this.state.isNoNetworkBig ? this._noNetworkComponent() : null : null}
        {iOS ? this.state.isNoDataLoad ? this._noDataComponent() : null : null}

        <LoadingView ref='LoadingView' />
        <HomeRedPacketView ref="HomeRedPacketClass" />
      </View>
    );

  }



}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'white'
  },

  image: {
    position: 'absolute',
    // flexDirection: "row",
    alignItems: 'center',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'center',
  },



  OldVersionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',

  },

  OldVersionOpacityStyle: {
    width: SCREEN_WIDTH - 40 * 2,
    height: 220,
    backgroundColor: 'white',
    borderRadius: 5,
  },

  OldVersionLine1Style: {
    height: 3,
    backgroundColor: '#4da5d3',
  },
  OldVersionLine2Style: {
    height: 1.2,
    backgroundColor: '#e1e1e1',
  },

  OldVersionView1: {
    flex: 1,
    paddingLeft: 20,
    justifyContent: 'center',
  },
  OldVersionView2: {
    flex: 2,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center',
  },
  OldVersionView3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  lineStyle: {
    width: width / 4,
    height: 2,
    backgroundColor: COLORS.appColor,
  },


});
