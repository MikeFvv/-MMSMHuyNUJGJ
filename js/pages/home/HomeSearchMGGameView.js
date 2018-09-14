
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  TextInput,
  StatusBar,
  Linking
} from 'react-native';
const { width, height } = Dimensions.get("window");
import BaseNetwork from "../../skframework/component/BaseNetwork"; //网络请求
import {
  CachedImage,
  ImageCacheProvider
} from 'react-native-cached-image';
export default class HomeSearchMGGameView extends Component {
  static navigationOptions = ({ navigation }) => ({

    header: (
      null
    ),
  });
  constructor(props) {

    super(props);
    this.state = {

      searchGameArray: [],
    };
    this.recharNumber = '';
    this.noData = 0;
    this.searchKey = true;

  }

  //移除通知
  componentWillUnmount() {

    //若组件被卸载，刷新state则直接返回，可以解决警告(倒计时组件可能造成的警告)
    this.setState = (state, callback) => {
      return;
    }
  }
  //取消
  onBuZaiDown() {
    this.props.navigation.goBack()
  }


  _renderSearchMGgameItemView(item) {

    return (
      <TouchableOpacity activeOpacity={1} style={styles.cellStyle}
        onPress={() => this._gotoActionGame(item)}
      >
        <ImageCacheProvider
        >
          <CachedImage resizeMode={'stretch'} source={{ uri: item.item.value.image_url }} style={{ width: 65, height: 65, }} />
        </ImageCacheProvider>

        <CusBaseText style={{ fontSize: Adaption.Font(16, 15), fontWeight: "400", marginTop: 10 }}>
          {item.item.value.game_name}
        </CusBaseText>
        {global.UserLoginObject.is_Guest == 2 ?
          <TouchableOpacity activeOpacity={1} style={styles.shiwanStyle}
            onPress={() => this._gotoActionGame(item)}>
            <CusBaseText style={{ fontSize: Adaption.Font(16, 15), color: COLORS.appColor, }}>
              试玩
            </CusBaseText>
          </TouchableOpacity> : null}
      </TouchableOpacity>
    );
  }
  _gotoActionGame(item) {
    const { navigate } = this.props.navigation;
    if (global.UserLoginObject.Token != '' || global.UserLoginObject.Token.length != 0) {

      let paramsNotice = new FormData();
      paramsNotice.append("ac", "GetWebGameUrl");
      paramsNotice.append("uid", global.UserLoginObject.Uid);
      paramsNotice.append("token", global.UserLoginObject.Token);
      paramsNotice.append("sessionkey", global.UserLoginObject.session_key);
      paramsNotice.append("tag", this.props.navigation.state.params.playGame);
      paramsNotice.append("gameid", global.UserLoginObject.is_Guest == 2 ? item.item.value.id : item.item.value.id);
      var promise = GlobalBaseNetwork.sendNetworkRequest(paramsNotice);
      promise
        .then(response => {

          if (response.msg == 0) {
            if (global.OrientationLink == '1') {
              navigate('HomeDianZiGameView', { guest_url: response.data, title: item.item.value.game_name })
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
  }

  _listHomeHeaderComponent() {
    return (
      <View style={{ width: width, height: 95, backgroundColor: '#f3f3f3', alignItems: 'center', flexDirection: 'row' }}>
        <TouchableOpacity activeOpacity={1} style={styles.searchStyle} >
          <Image
            source={require('./img/ic_fangdajing.png')} resizeMode={'stretch'}
            style={{ width: 20, height: 20, marginLeft: 15 }} />
          <TextInput
            returnKeyType="search"
            autoCapitalize="none"
            style={{ width: width - 100, height: 40, marginLeft: 5 }}
            underlineColorAndroid='transparent'
            placeholder='请输入游戏名称或关键字搜索'
            maxLength={10}
            defaultValue={this.recharNumber}  // 值置为空。
            autoFocus={this.searchKey}
            keyboardType='default'
            onChangeText={(text) => {
              this.recharNumber = text;
            }}
            onSubmitEditing={() => {
              this.searchKey = false;
              this._searchGame();
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} style={{ width: 60, height: 35, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}
          onPress={() => this.onBuZaiDown()}>
          <CusBaseText style={{ flex: 0.95, fontSize: Adaption.Font(17, 16), fontWeight: "500", color: COLORS.appColor, marginLeft: 5 }}>
            取消
          </CusBaseText>
        </TouchableOpacity>
      </View>
    );
  }
  _searchGame() {
    //请求参数
    let params = new FormData();
    params.append("ac", "SearchGameList");
    params.append("tag", this.props.navigation.state.params.playGame);
    params.append("game_name", this.recharNumber);

    var promise = BaseNetwork.sendNetworkRequest(params);

    promise
      .then(response => {
        if (response.msg == 0) {
          let datalist = response.data;
          let dataBlog = [];
          let i = 0;
          if (response.data == undefined || response.data.length == 0) {
            this.noData = 1;
            this.setState({ searchGameArray: [] });
          } else {
            this.noData = 0;
            datalist.map(dict => {
              dataBlog.push({ key: i, value: dict });
              i++;
            });
            //用set去赋值
            this.setState({ searchGameArray: dataBlog });
            datalist = null;
            dataBlog = null;
          }
        } else {
          NewWorkAlert(response.param)
        }
      })
      .catch(err => { });
  }
  //无数据页面
  _listEmptyComponent() {
    if (this.noData == 0) {
      return null;
    } else {
      return (
        <CusBaseText style={{ textAlign: 'center', marginTop: height / 2 - 100, color: '#666666', fontSize: 16 }}>无结果,换个关键词试试~~</CusBaseText>
      );
    }
  }

  render() {


    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <FlatList
          bounces={false}
          automaticallyAdjustContentInsets={false}
          alwaysBounceHorizontal={false}
          showsVerticalScrollIndicator={false} //不显示右边滚动条
          horizontal={false} //水平还是垂直
          numColumns={3} //指定多少列
          data={this.state.searchGameArray}
          ListEmptyComponent={this._listEmptyComponent()} // 没有数据时显示的界面
          renderItem={item => this._renderSearchMGgameItemView(item)}
          ListHeaderComponent={() => this._listHomeHeaderComponent()}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: "white"
  },
  cellStyle: {
    height: global.UserLoginObject.Token == '' || global.UserLoginObject.Token.length == 0 ? 150 : 125,
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
    width: width - 75,
    marginLeft: 15,
    height: 40,
    borderColor: '#d2d2d2',
    //justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 0.5,
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: 35
  },

  shiwanStyle: {
    height: 25,
    width: 70,
    borderColor: COLORS.appColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 0.5,
    marginTop: 10,
  },
  tuijianMGgameStyle: {
    height: 160,
    width: width / 3,
    backgroundColor: "white",
    alignItems: 'center',
    justifyContent: 'center',
  },

});
