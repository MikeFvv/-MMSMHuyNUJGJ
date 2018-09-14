import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
const { width, height } = Dimensions.get("window");
const KAdaptionHeight = height / 736;
import MarqueeLabel from "react-native-lahk-marquee-label"; //跑马灯
import Carousel from 'react-native-banner-carousel';
import HomeCaiBlockView from './HomeCaiBlockView';
import HomeDefaultTabBar from './HomeDefaultTabBar'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import Toast, { DURATION } from 'react-native-easy-toast'
import {
  CachedImage,
  ImageCacheProvider
} from 'react-native-cached-image';

class HomeHeaderView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      backupBanbarCpicon: false, //轮番图加载不出来给默认图片代替
      banberArray: [],
      systemNoticeArray: [],
      homeCaiArray: [],
      homeHeightArray: [],
      homeLowArray: [],
      tabNames: ['热门', '高频彩', '低频彩', '体育彩'],
      tiyuArray: [],
      tabIconNames: [require('./img/ic_remen.png'), require('./img/ic_gerenxiaoxi.png'), require('./img/ic_gerenxiaoxi.png'), require('./img/ic_gerenxiaoxi.png')],
    };
    this.zuqiuArray = [{ key: 1, value: 2 }];
    this.headerHeight = 0;
    if (HomeArray.length % 3 > 0) {
      this.headerHeight = HomeArray.length / 3 * 100 + 260 * KAdaptionHeight + 140;
    } else {
      this.headerHeight = HomeArray.length / 3 * 100 + 260 * KAdaptionHeight + 40;
    }

    this.imageArrCache = [];

  }

  componentWillMount() {

    if (SwiperArray.length == 0 || SwiperArray == undefined) {
      this._fetchBanber();
    } else {
         this.state.banberArray = SwiperArray;
           let imageArr = [];
           for (let index = 0; index < SwiperArray.length; index++) {
             const element = SwiperArray[index].banner;
            imageArr.push(element);
          }
        this.imageArrCache = imageArr;
            
    }


    if (HomeSystemArray.length == 0 || HomeSystemArray == undefined) {
      this._fetchSystemNotification();
    } else {
      this.state.systemNoticeArray = HomeSystemArray;
    }


    this.state.homeCaiArray = HomeArray;
    this.state.homeHeightArray = HomeHeightZhongArray;
    this.state.homeLowArray = HomeLowZhongArray;
    this.state.tiyuArray = TiYuArray;


  }
  componentDidMount() {
    setTimeout(() => {
      this._fetchBanber();
      this._fetchSystemNotification();
      this.fetchHomeCaiArray();
    }, 2000);

    // setTimeout(() => {
    //   this._fetchSystemNotification();
    // }, 5000);

    // setTimeout(() => {
    //   this.fetchHomeCaiArray();
    // }, 8000);

    //接受登录的通知
    this.subscription423 = PushNotification.addListener('LoginSuccess', (loginObject) => {
      if (global.UserLoginObject.is_Guest == 2) {
        return;
      } else {
        this._fetchGamePianHaoData();
      }

    });

  }

  //移除通知
  componentWillUnmount() {

    if (typeof (this.subscription423) == 'object') {
      this.subscription423 && this.subscription423.remove();
    }


  }

  _fetchGamePianHaoData() {
    let params = new FormData();
    params.append("ac", "getUserHobby");
    params.append("uid", global.UserLoginObject.Uid);
    params.append("token", global.UserLoginObject.Token);
    params.append("sessionkey", global.UserLoginObject.session_key);

    var promise = GlobalBaseNetwork.sendNetworkRequest(params);

    promise
      .then(response => {
        if (response.msg == 0) {
          global.YouXiPianHaoData = response.data ? response.data : [];

          if (global.YouXiPianHaoData.length > 0) {

            for (let i = global.YouXiPianHaoData.length - 1; i >= 0; i--) {

              // 排序 MoneyZhang 的彩种列表
              for (let j = 0; j < global.AllPlayGameList.length; j++) {
                let dic = global.AllPlayGameList[j];
                if (global.YouXiPianHaoData[i] == dic['game_id']) {
                  global.AllPlayGameList.splice(j, 1);  // 删除
                  global.AllPlayGameList.splice(0, 0, dic); // 添加到第一位
                  break;
                }
              }

              // 排序 HomeArray 数据
              for (let h = 0; h < HomeArray.length; h++) {
                let dic = HomeArray[h];
                if (global.YouXiPianHaoData[i] == dic.value['game_id']) {
                  HomeArray.splice(h, 1);  // 删除
                  HomeArray.splice(0, 0, dic); // 添加到第一位
                  break;
                }
              }

              // 排序 HomeHeightZhongArray 数据
              for (let hh = 0; hh < HomeHeightZhongArray.length; hh++) {
                let dic = HomeHeightZhongArray[hh];
                if (global.YouXiPianHaoData[i] == dic.value['game_id']) {
                  HomeHeightZhongArray.splice(hh, 1);  // 删除
                  HomeHeightZhongArray.splice(0, 0, dic); // 添加到第一位
                  break;
                }
              }
            }

            this.setState({ homeCaiArray: HomeArray, homeHeightArray: HomeHeightZhongArray })
          }

        }
      })
      .catch(err => {
      });
  }

  fetchHomeCaiArray() {
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
            AllZhongArray = dataBlog;
            HomeHeightZhongArray = [];
            HomeLowZhongArray = [];
            HomeArray = [];
            TiYuArray = [];
            datalist.map((item) => {
              if (item.type == 1) {
                if (item.speed == 1) {
                  HomeHeightZhongArray.push({ key: i, value: item });
                } else if (item.speed == 0) {
                  HomeLowZhongArray.push({ key: i, value: item });
                }
                if (item.hot == 1) {
                  indexArray.push({ key: i, value: item });
                }
              } else {
                TiYuArray.push({ key: i, value: item });
                if (item.hot == 1) {
                  indexArray.push({ key: i, value: item });
                }
              }
              i++;
            })
            // for (var j = 0; j < datalist.length; j++) {
            //   indexArray.push({ key: j, value: datalist[j] });
            //   if (j == 16) {
            //     break;
            //   }
            // }
            // indexArray.push({ key: 17, value: {} });
            indexArray.push({ key: 99, value: {} });


            // 游戏偏好 在这里for循环里面改变顺序。
            for (let i = global.YouXiPianHaoData.length - 1; i >= 0; i--) {

              // 首页彩种
              for (let h = 0; h < indexArray.length; h++) {
                let dic = indexArray[h];
                if (global.YouXiPianHaoData[i] == dic.value['game_id']) {
                  indexArray.splice(h, 1);  // 删除
                  indexArray.splice(0, 0, dic); // 添加到第一位
                  break;
                }
              }

              // 首页高频彩
              for (let hh = 0; hh < HomeHeightZhongArray.length; hh++) {
                let dic = HomeHeightZhongArray[hh];
                if (global.YouXiPianHaoData[i] == dic.value['game_id']) {
                  HomeHeightZhongArray.splice(hh, 1);  // 删除
                  HomeHeightZhongArray.splice(0, 0, dic); // 添加到第一位
                  break;
                }
              }
            }
            // 到这里循环结束了，indexArray和HomeHeightZhongArray，就是按偏好排序后的数据
            HomeArray = indexArray;


            this.setState({ homeCaiArray: indexArray, homeHeightArray: HomeHeightZhongArray, homeLowArray: HomeLowZhongArray, tiyuArray: TiYuArray })

            let homeKey = 'HomeCaiZhongObjcet';
            UserDefalts.getItem(homeKey, (error, result) => {
              if (!error) {
                if (result !== '' && result !== null) {
                  let homeModel = JSON.parse(result);
                  homeModel.HomeCaiZhongArray = HomeArray;
                  homeModel.HomeHeightCaiZhongArray = HomeHeightZhongArray;
                  homeModel.HomeLowCaiZhongArray = HomeLowZhongArray;
                  homeModel.HomeCaiZhongAllArray = AllZhongArray;
                  homeModel.HomeTiYuArray = TiYuArray;
                  UserDefalts.setItem(homeKey, JSON.stringify(homeModel), (error) => { });
                }
              }
            });

          }

        }
      })
      .catch(err => {



      });
  }

  _fetchBanber() {
    //请求参数
    let params = new FormData();
    params.append("ac", "getSystemBanner");
    var promise = GlobalBaseNetwork.sendNetworkRequest(params);
    promise
      .then(response => {
        if (response.msg == 0) {

          let datalist = response.data;
          if (datalist && datalist.length > 0) {

            let datalist = response.data;
            // let dataBannerList = response.data['banner'];
            // let dataNonticeList = response.data['notice'];
            // let dataWinlist = response.data['winlist'];

            if (datalist) {
              let imageArr = [];
              for (let index = 0; index < datalist.length; index++) {
                const element = datalist[index].banner;
                imageArr.push(element);
              }
              this.imageArrCache = imageArr;
            }

            this.setState({ banberArray: datalist })
            SwiperArray = datalist;

            let homeKey = 'HomeCaiZhongObjcet';
            UserDefalts.getItem(homeKey, (error, result) => {
              if (!error) {
                if (result !== '' && result !== null) {
                  let homeModel = JSON.parse(result);
                  homeModel.HomeSwiperArray = SwiperArray;
                  UserDefalts.setItem(homeKey, JSON.stringify(homeModel), (error) => { });
                }
              }
            });


          }

        }
      })
      .catch(err => {

      });
  }

  _fetchSystemNotification() {

    let paramsNotice = new FormData();
    paramsNotice.append("ac", "getSystemNotice");
    var promise = GlobalBaseNetwork.sendNetworkRequest(paramsNotice);
    promise
      .then(response => {
  
        if (response.msg == 0) {

          let datalist = response.data;
          if (datalist && datalist.length > 0) {

            this.setState({ systemNoticeArray: datalist })
            HomeSystemArray = datalist;
            let homeKey = 'HomeCaiZhongObjcet';
            UserDefalts.getItem(homeKey, (error, result) => {
              if (!error) {
                if (result !== '' && result !== null) {
                  let homeModel = JSON.parse(result);
                  homeModel.HomeSystemArray = HomeSystemArray;
                  UserDefalts.setItem(homeKey, JSON.stringify(homeModel), (error) => { });
                }
              }
            });


          }

        }
      })
      .catch(err => {

      });
  }

  render() {

    return (
      <View
        ref={(c) => this._refHeightView = c}
        style={styles.headerComponent}>
        {this._renderSwiper()}
        {this._headerTouzhuList()}
        <View
          key={4}
          style={{ width: width, height: 1, backgroundColor: "#f3f3f3" }}
        />
        {this._headerMarquee()}
        <View
          key={6}
          style={{ width: width, height: 1, backgroundColor: "#f3f3f3" }}
        />
        {this._headerReMenCaiZhong()}
        <Toast
          ref="toast"
          position='center'
        />

      </View>
    );

  }
  //头部轮播图
  _renderSwiper() {

    if (this.state.banberArray.length == 0 || this.state.banberArray == undefined) {
      return (
        <View key={0} style={{ height: 150 * KAdaptionHeight }}>
          <Image source={{ uri: 'http://fcw102.com/Public/view/img/banner_default.jpg' }}
            style={styles.swiperImage} />
        </View>
      );
    } else {
      if (this.state.backupBanbarCpicon == true) {
        return (
          <View key={0} style={{ height: 150 * KAdaptionHeight }}>
            <Image source={{ uri: 'http://fcw102.com/Public/view/img/banner_default.jpg' }}
              style={styles.swiperImage} />
          </View>
        );
      } else {
        return (
          <View style={{ width: width, height: 150 * KAdaptionHeight }}>
            <Carousel
              autoplay
              autoplayTimeout={5000}
              loop
              index={0}
              showsPageIndicator={true}
              pageSize={width}
            >
              {this.state.banberArray.map((image, index) => this._renderPage(image, index))}

            </Carousel>
          </View>
        );
      }
    }
  }


  _renderPage(image, index) {

    return (
      <TouchableOpacity
        key={index}
        activeOpacity={1}
        onPress={() => this.props.navigator.navigate('Preferential')}>
        <ImageCacheProvider
          urlsToPreload={this.imageArrCache}
        >
          <CachedImage resizeMode={'stretch'} source={{ uri: image.banner }} style={styles.swiperImage}
          onError={({nativeEvent:{error}})=>{
            this.setState({backupBanbarCpicon:true});
        }} />
        </ImageCacheProvider>

      </TouchableOpacity>
    );
  }

  //头部充值，提款，活动，在线客服图标
  _headerTouzhuList() {

    return (
      <View key={3} style={styles.headerCaiZhong}>

        <View style={{ flex: 1 }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.onChongZhi()}
          >
            <View style={styles.slideHeader}>
              <Image
                style={{
                  width: 34 * KAdaptionHeight,
                  height: 34 * KAdaptionHeight
                }}
                source={require('./img/ic_zaixianchongzhi.png')}
              />
              <CusBaseText
                style={{ fontSize: Adaption.Font(13, 13), color: "#454545", textAlign: "center", marginTop: 3 }}
              >
                在线充值
             </CusBaseText>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={styles.zhongLine}>
          <Image style={{ width: 1, height: 30 }}
            source={require('./img/ic_homexuxian.png')} />
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            automaticallyAdjustContentInsets={false}
            alwaysBounceHorizontal={false}
            activeOpacity={1}
            onPress={() => this.onTouZhuJiLu()}
          >
            <View style={styles.slideHeader}>
              <Image
                style={{
                  width: 34 * KAdaptionHeight,
                  height: 34 * KAdaptionHeight
                }}
                source={require('./img/ic_zaixiantikuan.png')}
              />
              <CusBaseText
                style={{
                  fontSize: Adaption.Font(13, 13),
                  color: "#454545",
                  textAlign: "center",
                  marginTop: 3
                }}
              >
                在线提现
                            </CusBaseText>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={styles.zhongLine}>
          <Image style={{ width: 1, height: 30 }}
            source={require('./img/ic_homexuxian.png')} />
        </View>

        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{ flexDirection: 'column' }}
            onPress={() => this.props.navigator.navigate('Preferential')}
          >
            <View style={styles.slideHeader}>
              <Image
                style={{
                  width: 34 * KAdaptionHeight,
                  height: 34 * KAdaptionHeight
                }}
                source={require('./img/ic_huodong.png')}
              />
              <CusBaseText
                style={{ fontSize: Adaption.Font(13, 13), color: "#454545", textAlign: "center", marginTop: 3 }}
              >
                优惠活动
                            </CusBaseText>
            </View>
          </TouchableOpacity>

        </View>

        <View
          style={styles.zhongLine}>
          <Image style={{ width: 1, height: 30 }}
            source={require('./img/ic_homexuxian.png')} />
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.props.navigator.navigate('ChatService', { callback: () => { }, title: '在线客服' })}
          >
            <View style={styles.slideHeader}>
              <Image
                style={{
                  width: 34 * KAdaptionHeight,
                  height: 34 * KAdaptionHeight
                }}
                source={require('./img/ic_zaixiankefu.png')}
              />
              <CusBaseText
                style={{ fontSize: Adaption.Font(13, 13), color: "#454545", textAlign: "center", marginTop: 3 }}
              >
                在线客服
                            </CusBaseText>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  //通知跑马灯
  _headerMarquee() {
    return (
      <View key={5} style={styles.headerMarquee}>
        <TouchableOpacity style={{ flexDirection: "row" }} activeOpacity={1}
          onPress={() => this.gongGaoYeMian()}>
          <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
            <Image style={{ width: 30 * KAdaptionHeight, height: 33 * KAdaptionHeight }}
              source={require('./img/ic_laba.png')} />
          </View>
          <View style={{ flex: 0.9 }}>
            {this._marqueeViews()}
          </View>
          <View style={{ width: 15, alignItems: "center", justifyContent: "center", marginRight: 5 }}
          >
            <Image style={{ width: 15, height: 15 }}
              source={require('./img/ic_homesanjiao.png')}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  _decipher(val) {
   
    let valByte = [];
    let keyByte = [`0`.charCodeAt(0)]; // 48

    for (let a = 0; a < val.length; a++) {
        valByte.push( parseInt(val[a], 16));
    }
 

    if (valByte.length % 2 != 0) {
        return;
    }

    let tempAr = [];
    for (let i = 0; i < valByte.length; i+=2) {
        tempAr.push( valByte[i] << 4 | valByte[i + 1] );
    }


    for (let a = 0; a < tempAr.length; a++) {
        for (let b = keyByte.length - 1; b >= 0; b--) {
            tempAr[a] = tempAr[a] ^ keyByte[b];
        }
    }
    
    var str = '';
    for (var i = 0; i < tempAr.length; i++) {
        str += String.fromCharCode(tempAr[i]);
    }
    return decodeURIComponent(escape(str));

}



  _marqueeViews() {
    if (this.state.systemNoticeArray == null || this.state.systemNoticeArray.length == 0) {
      return (
        <MarqueeLabel style={styles.marqueeLab} duration={15000} text={'暂无公告'}
          textStyle={{ fontSize: Adaption.Font(15, 14), color: "#222222" }} />
      )
    } else {
      let preg = /^[A-Za-z0-9]+$/;
      let is = preg.test(this.state.systemNoticeArray[0].content);
      let marContent = '';
      if(is==true){
        marContent =  this._decipher(this.state.systemNoticeArray[0].content);
      }else {
        marContent = this.state.systemNoticeArray[0].content;
      }
      if (marContent.includes('\\n')) {
        marContent = marContent.replace(/\\n/g, " ");
       
      } 
    
      let durat = 0;
      if(marContent>150){
        durat = 100000;
      }else {
        durat = 40000;
      }

      return (
        <MarqueeLabel style={styles.marqueeLab} duration={durat} text={marContent}
          textStyle={{ fontSize: Adaption.Font(15, 14), color: "#222222" }} />

        //    <MarqueeLabel style={styles.marqueeLab} duration={40000} text={this.state.homeSystemArray[0].content} textStyle={{ fontSize: Adaption.Font(15, 14), color: "#222222" }} />
      )
    }
  }

  //热门彩种切换
  _headerReMenCaiZhong() {
    let tabNames = this.state.tabNames;
    let tabIconNames = this.state.tabIconNames;
    return (
      <ScrollableTabView
        locked={true}
        renderTabBar={() => <HomeDefaultTabBar tabNames={tabNames} tabIconNames={tabIconNames} />}
        tabBarUnderlineStyle={styles.lineStyle}
        onChangeTab={(obj) => this._onclickCaiZhong(obj)}
        tabBarActiveTextColor={COLORS.appColor}>
        <HomeCaiBlockView
          caizhongIndex={0}
          dataSource={this.state.homeCaiArray}
          navigator={this.props.navigator}
          backAction={this.props.backAction}
          tabLabel='热门'

        />
        <HomeCaiBlockView
          caizhongIndex={1}
          dataSource={this.state.homeHeightArray}
          navigator={this.props.navigator}
          backAction={this.props.backAction}
          tabLabel='高频彩'
        />
        <HomeCaiBlockView
          caizhongIndex={2}
          dataSource={this.state.homeLowArray}
          navigator={this.props.navigator}
          backAction={this.props.backAction}
          tabLabel='低频彩'
        />
        <HomeCaiBlockView
          caizhongIndex={3}
          dataSource={this.state.tiyuArray}
          backAction={this.props.backAction}
          navigator={this.props.navigator}
          tabLabel='体育彩'
        />
      </ScrollableTabView>
    );
  }

  _onclickCaiZhong(obj) {
    switch (obj.i) {
      case 0:
        if (this.state.homeCaiArray != undefined && this.state.homeCaiArray.length % 3 > 0) {
          this._refHeightView.setNativeProps({
            style: { backgroundColor: 'white', width: width, height: (this.state.homeCaiArray.length - this.state.homeCaiArray.length % 3) / 3 * 100 + 260 * KAdaptionHeight + 135 }
          });
        } else {
          this._refHeightView.setNativeProps({
            style: { backgroundColor: 'white', width: width, height: this.state.homeCaiArray.length / 3 * 100 + 260 * KAdaptionHeight + 35 }
          });
        }
        break;
      case 1:
        if (this.state.homeHeightArray != undefined, this.state.homeHeightArray.length % 3 > 0) {
          this._refHeightView.setNativeProps({
            style: { backgroundColor: 'white', width: width, height: (this.state.homeHeightArray.length - this.state.homeHeightArray.length % 3) / 3 * 100 + 260 * KAdaptionHeight + 135 }
          });
        } else {
          this._refHeightView.setNativeProps({
            style: { backgroundColor: 'white', width: width, height: this.state.homeHeightArray.length / 3 * 100 + 260 * KAdaptionHeight + 35 }
          });
        }
        break;
      case 2:
        if (this.state.homeLowArray != undefined && this.state.homeLowArray.length % 3 > 0) {
          this._refHeightView.setNativeProps({
            style: { backgroundColor: 'white', width: width, height: (this.state.homeLowArray.length - this.state.homeLowArray.length % 3) / 3 * 100 + 260 * KAdaptionHeight + 135 }
          });
        } else {
          this._refHeightView.setNativeProps({
            style: { backgroundColor: 'white', width: width, height: this.state.homeLowArray.length / 3 * 100 + 260 * KAdaptionHeight + 35 }
          });
        }
        break;
      default:
        //  alert('敬请期待')
        // this._refHeightView.setNativeProps({
        //   style: {backgroundColor: 'white',width:width,height:260*KAdaptionHeight+135}});
        if (this.state.tiyuArray.length % 3 > 0) {
          this._refHeightView.setNativeProps({
            style: { backgroundColor: 'white', width: width, height: (this.state.tiyuArray.length - this.state.tiyuArray.length % 3) / 3 * 100 + 260 * KAdaptionHeight + 135 }
          });
        } else {
          this._refHeightView.setNativeProps({
            style: { backgroundColor: 'white', width: width, height: this.state.tiyuArray.length / 3 * 100 + 260 * KAdaptionHeight + 35 }
          });
        }
        break;
    }
  }

  gongGaoYeMian() {

    if (this.state.systemNoticeArray == null || this.state.systemNoticeArray == 0) {
      this.refs.toast.show('暂无公告!', 500);
    } else {
      this.props.navigator.navigate('MoreNotification', { notiArray: this.state.systemNoticeArray, })
    }
  }

  //在线充值按钮
  onChongZhi() {
    if (global.UserLoginObject.Token != '' || global.UserLoginObject.Token.length != 0) {
      if (global.UserLoginObject.is_Guest == 2) {
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
        this.props.navigator.navigate('RechargeCenter')
      }
    } else {
      Alert.alert(
        '提示',
        '您还未登录,请先去登录',
        [
          {
            text: '确定', onPress: () => {
              this.props.navigator.navigate('Login', { title: '登录', })
            }
          },
          {
            text: '取消', onPress: () => {
            }
          },
        ]
      )
    }

  }
  //在线提现按钮
  onTouZhuJiLu() {

    if (global.UserLoginObject.Token != '' || global.UserLoginObject.Token.length != 0) {
      if (global.UserLoginObject.is_Guest == 2) {
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



        if (global.UserLoginObject.Card_num) {
          this.props.navigator.navigate('DrawalInfo');
        }
        else {
          this.props.navigator.navigate('BindBankCard', { callback: () => { }, BindBankCardPreviousAction: 'DrawalCenter' });
        }
        return;


      }

    } else {
      Alert.alert(
        '提示',
        '您还未登录,请先去登录',
        [
          {
            text: '确定', onPress: () => {
              this.props.navigator.navigate('Login', { title: '登录', })
            }
          },
          {
            text: '取消', onPress: () => {
            }
          },
        ]
      )
    }

  }

}

const styles = StyleSheet.create({

  headerComponent: {
    height: this.headerHeight,
    width: width
  },
  swiperImage: {
    width: width,
    height: 150 * KAdaptionHeight,
  },
  headerCaiZhong: {
    height: 70 * KAdaptionHeight,
    width: width,
    backgroundColor: "#ffffff",
    flexDirection: "row",
  },
  slideHeader: {
    height: 70 * KAdaptionHeight,
    justifyContent: "center",
    alignItems: "center"
  },
  zhongLine: {
    width: 1,
    height: 30 * KAdaptionHeight,
    marginTop: 20 * KAdaptionHeight,
    marginBottom: 10 * KAdaptionHeight,
    backgroundColor: "#cdcdcd"
  },
  headerMarquee: {
    flexDirection: "row",
    width: width,
    height: 33 * KAdaptionHeight,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  marqueeLab: {
    fontSize: Adaption.Font(15, 14),
    textAlign: "center",
    margin: 20
  },
  lineStyle: {
    width: width / 4,
    height: 2,
    backgroundColor: COLORS.appColor,
  },
  textaaaStyle: {
    flex: 1,
    fontSize: 32,
    marginTop: 20,
    textAlign: 'center',
    color: '#3d3d3d'
  },
  lineStyle: {
    width: width / 4,
    height: 2,
    backgroundColor: COLORS.appColor,
  },

});


export default HomeHeaderView;