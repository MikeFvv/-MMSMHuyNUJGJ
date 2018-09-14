import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Linking
} from "react-native";
const { width, height } = Dimensions.get("window");
import Carousel from 'react-native-banner-carousel';
import BaseNetwork from "../../skframework/component/BaseNetwork"; //网络请求
import {
  CachedImage,
  ImageCacheProvider
} from 'react-native-cached-image';

export default class HomeLandComputGameView extends Component {
  static navigationOptions = ({ navigation }) => ({

    header: (
      <CustomNavBar
        centerText={navigation.state.params.title}
        leftClick={() => navigation.state.params.navLeftPress ? navigation.state.params.navLeftPress() : null}
      />
    ),
  });

  constructor(props) {
    super(props);

    this.state = {
      dianziArray: [],
      tuijianArray: [],
    };
  }

  componentDidMount() {
    this._fetchMGGameData();
    this._fetchTuiJianMGGameData();
    this.props.navigation.setParams({
      navLeftPress: this._clearGMGameList,
    });
  }
  _clearGMGameList = () => {

    Alert.alert(
      '温馨提示',
      '是否退出当前游戏?',
      [
        {
          text: '确定', onPress: () => {
            this.props.navigation.goBack();
               //请求参数
    let params = new FormData();
    params.append("ac", "flushPrice");
    params.append("uid", global.UserLoginObject.Uid);
    params.append("token", global.UserLoginObject.Token);
    params.append('sessionkey', global.UserLoginObject.session_key);
    params.append("click", "1");
    var promise = GlobalBaseNetwork.sendNetworkRequest(params);
    promise
      .then(response => {

        if (response.msg == 0) {
          global.UserLoginObject.TotalMoney = response.data.price;
          this.props.navigation.state.params.backAction ? this.props.navigation.state.params.backAction() : null;
          PushNotification.emit('RefreshUserTotalMoney', response.data.price);

        }
      })
      .catch(err => {

      });
             
          }
        },
        {
          text: '取消', onPress: () => {
          }
      },
      ]
    )
   

  }

  //获取所有电子游戏的列表
  _fetchMGGameData() {
    //请求参数
    let params = new FormData();
    params.append("ac", "GetH5GameList");
    params.append("tag", this.props.navigation.state.params.playGame);
    params.append("pageid", "0");
    params.append("rows", "20");

    var promise = BaseNetwork.sendNetworkRequest(params);

    promise
      .then(response => {
        if (response.msg == 0) {
          let datalist = response.data;
          let dataBlog = [];
          let i = 0;
          if (response.data == undefined || response.data.length == 0) {
            this.setState({ dianziArray: [] });
          } else {
            datalist.map(dict => {
              dataBlog.push({ key: i, value: dict });
              i++;
            });
            //用set去赋值
            this.setState({ dianziArray: dataBlog });
            datalist = null;
            dataBlog = null;
          }
        } else {
          NewWorkAlert(response.param)
        }
      })
      .catch(err => { });
  }

  //获取推荐电子游戏的
  _fetchTuiJianMGGameData() {
    //请求参数
    let params = new FormData();
    params.append("ac", "GetWebGameHotList");
    var promise = BaseNetwork.sendNetworkRequest(params);

    promise
      .then(response => {
        if (response.msg == 0) {
          let datalist = response.data;
          let dataBlog = [];
          let i = 0;
          if (response.data == undefined || response.data.length == 0) {
            this.setState({ tuijianArray: [] });
          } else {

            //  NSArray *dataArr = @[@1, @2, @3, @4, @5, @6, @7, @8, @9, @10];
            let arr1 = [];
            let arr2 = [];


            for (let i = 1; i <= datalist.length; i++) {
              arr2.push(datalist[i - 1]);
              if ((i % 3 == 0 && arr2.length == 3) || i == datalist.length) {
                arr1.push(arr2);
                arr2 = [];
              }
            }
            //用set去赋值
            this.setState({ tuijianArray: arr1 });
            datalist = null;
            dataBlog = null;
          }
        } else {
          NewWorkAlert(response.param)
        }
      })
      .catch(err => { });
  }

  _listHomeHeaderComponent() {
    return (
      <View style={{ width: width, height: 260, backgroundColor: 'white' }}>
        {this._SearchMGGame()}
        {this._MoreMGGame()}
        <View style={{ width: 100, height: 2, backgroundColor: COLORS.appColor }}>
        </View>
        <View style={{ width: width, height: 0.7, backgroundColor: '#cdcdcd' }}>
        </View>
        {this._tuijianMGGame()}
        {this._remenMGGame()}
        <View style={{ width: 100, height: 2, backgroundColor: COLORS.appColor }}></View>
        <View style={{ width: width, height: 1, backgroundColor: '#cdcdcd' }}></View>
      </View>
    );
  }

  _SearchMGGame() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ width: width, height: 50, backgroundColor: '#f3f3f3', justifyContent: 'center' }}>
        <TouchableOpacity activeOpacity={1} style={styles.searchStyle}
          onPress={() => navigate('HomeSearchMGGameView', { playGame: this.props.navigation.state.params.playGame })} >
          <CusBaseText style={{ flex: 0.95, fontSize: Adaption.Font(16, 15), color: "#666666", marginLeft: 15 }}>
            请输入游戏名称或关键字搜索
      </CusBaseText>
          <Image
            source={require('./img/ic_fangdajing.png')} resizeMode={'stretch'}
            style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
      </View>
    );
  }

  _MoreMGGame() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ width: width, height: 40, backgroundColor: 'white', alignItems: 'center', flexDirection: 'row' }}>
        <CusBaseText style={{ flex: 0.7, fontSize: Adaption.Font(18, 17), color: COLORS.appColor, marginLeft: 15 }}>
          推荐游戏
           </CusBaseText>
        <TouchableOpacity activeOpacity={1} style={{ flex: 0.3 }}
          onPress={() => navigate('HomeMoreComputGameView', { playGame: this.props.navigation.state.params.playGame })} >
          <CusBaseText style={{ fontSize: Adaption.Font(18, 17), color: '#222222', marginLeft: 5 }}>
            更多游戏 >
            </CusBaseText>
        </TouchableOpacity>

      </View>
    );
  }


  _tuijianMGGame() {
    if (this.state.tuijianArray.length == 0 || this.state.tuijianArray == undefined) {
      return (
        <View key={0} style={{ height: 135 }}>
          <Image source={{ uri: 'http://fcw102.com/Public/view/img/banner_default.jpg' }}
            style={{ width: width, height: 135 }} />
        </View>
      );
    } else {
      return (
        <View style={{ width: width, height: 135 }}>
          <Carousel
            autoplay
            autoplayTimeout={5000}
            loop
            index={0}
            showsPageIndicator={true}
            pageSize={width}
          >
            {this.state.tuijianArray.map((image, index) => this._renderPage(image, index))}

          </Carousel>
        </View>
      );
    }
  }

  _renderPage(image, index) {
    return (
      <FlatList
        key={101}
        showsVerticalScrollIndicator={false} //不显示右边滚动条
        horizontal={false} //水平还是垂直
        numColumns={3} //指定多少列
        data={image}
        renderItem={item => this._renderTuiJianMGgameItemView(item)}
      />

    );
  }
  _renderTuiJianMGgameItemView(item) {
    const { navigate } = this.props.navigation;
    return (
      <TouchableOpacity
        style={styles.tuijianMGgameStyle}
        key={item.index}
        activeOpacity={1}
        onPress={() => this._gotoActionGame(item,2)}>
        <Image resizeMode={'stretch'} source={{ uri: item.item.image_url }} style={{ width: 65, height: 65, }} />
        <CusBaseText style={{ fontSize: Adaption.Font(16, 15), fontWeight: "400", marginTop: 5 }}>
          {item.item.game_name}
        </CusBaseText>
      </TouchableOpacity>
    );
  }

  _remenMGGame() {
    return (
      <View style={{ width: width, height: 30, backgroundColor: 'white', alignItems: 'center', flexDirection: 'row' }}>
        <CusBaseText style={{ fontSize: Adaption.Font(18, 17), color: COLORS.appColor, marginLeft: 15 }}>
          热门游戏
           </CusBaseText>
      </View>
    );
  }


  _renderMGgameItemView(item) {

    const { navigate } = this.props.navigation;
    return (
      <TouchableOpacity activeOpacity={1} style={styles.cellStyle}
        onPress={() => this._gotoActionGame(item,1)}>
        <ImageCacheProvider
        >
          <CachedImage resizeMode={'stretch'} source={{ uri: item.item.value.image_url }} style={{ width: 65, height: 65, }} />
        </ImageCacheProvider>

        <CusBaseText style={{ fontSize: Adaption.Font(16, 15), fontWeight: "400", marginTop: 10 }}>
          {item.item.value.game_name}
        </CusBaseText>
      </TouchableOpacity>
    );
  }
  _gotoActionGame(item,tuijianIndex) {
    const { navigate } = this.props.navigation;
    let paramsNotice = new FormData();
    paramsNotice.append("ac", "GetWebGameUrl");
    paramsNotice.append("uid", global.UserLoginObject.Uid);
    paramsNotice.append("token", global.UserLoginObject.Token);
    paramsNotice.append("sessionkey", global.UserLoginObject.session_key);
    paramsNotice.append("tag", this.props.navigation.state.params.playGame);
    paramsNotice.append("gameid", tuijianIndex==2?item.item.gameid:item.item.value.id);
    var promise = GlobalBaseNetwork.sendNetworkRequest(paramsNotice);
    promise
      .then(response => {

        if (response.msg == 0) {
          if (global.OrientationLink == '1') {
            navigate('HomeDianZiGameView', { guest_url: response.data, title: tuijianIndex==2?item.item.game_name:item.item.value.game_name })
          } else {
            Linking.openURL(response.data).catch(err => console.error('An error occurred', err));

            Alert.alert(
              '温馨提示',
              '是否退出当前游戏?',
              [
                {
                  text: '确定', onPress: () => {
                    //请求参数
                    let params = new FormData();
                    params.append("ac", "flushPrice");
                    params.append("uid", global.UserLoginObject.Uid);
                    params.append("token", global.UserLoginObject.Token);
                    params.append('sessionkey', global.UserLoginObject.session_key);
                    params.append("click", "1");
                    var promise = GlobalBaseNetwork.sendNetworkRequest(params);
                    promise
                      .then(response => {

                        if (response.msg == 0) {
                          global.UserLoginObject.TotalMoney = response.data.price;
                        }
                      })
                      .catch(err => {

                      });
                  }
                },
              ]
            )
          }
          

        } else {
          Alert.alert(response.param)
        }
      })
      .catch(err => {

      });
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          key={1000}
          bounces={false}
          automaticallyAdjustContentInsets={false}
          alwaysBounceHorizontal={false}
          showsVerticalScrollIndicator={false} //不显示右边滚动条
          horizontal={false} //水平还是垂直
          numColumns={3} //指定多少列
          data={this.state.dianziArray}
          renderItem={item => this._renderMGgameItemView(item)}
          ListHeaderComponent={() => this._listHomeHeaderComponent()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  cellStyle: {
    height: 125,
    width: width / 3,
    backgroundColor: "white",
    alignItems: 'center',
    justifyContent: 'center',
    // borderRightWidth:1,
    borderBottomWidth: 0.5,
    // borderTopWidth:0.5,
    borderRightWidth: 0.5,
    borderColor: '#cccccc',
  },
  searchStyle: {
    width: width - 30,
    marginLeft: 15,
    height: 40,
    borderColor: '#d2d2d2',
    //justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 0.5,
    flexDirection: 'row',
    backgroundColor: 'white'
  },


  tuijianMGgameStyle: {
    height: 135,
    width: width / 3,
    backgroundColor: "white",
    alignItems: 'center',
    justifyContent: 'center',
  },

});
