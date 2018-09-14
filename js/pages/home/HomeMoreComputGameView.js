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
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view'
import {
  CachedImage,
  ImageCacheProvider
} from 'react-native-cached-image';

export default class HomeMoreComputGameView extends Component {
  static navigationOptions = ({ navigation }) => ({

    header: (
      <CustomNavBar
        centerText={'更多游戏'}
        leftClick={() => navigation.goBack()}
      />
    ),
  });

  constructor(props) {
    super(props);

    this.state = {
      dianziArray: [],
      refreshState: RefreshState.Idle,
    };
    this.pageid = 0;//页码
    { (this).keyExtractor = this.keyExtractor.bind(this) }
  }

  componentDidMount() {
    this._fetchMGGameData(true);
  }
  //头部刷新
  onHeaderRefresh = () => {

    this.setState({ refreshState: RefreshState.HeaderRefreshing })
    this.pageid = 0;
    this.state.dianziArray = [];
    this._fetchMGGameData(true);
  }

  //获取所有电子游戏的列表
  _fetchMGGameData(isReload) {
    //请求参数
    let params = new FormData();
    params.append("ac", "GetH5GameList");
    params.append("tag", this.props.navigation.state.params.playGame);
    params.append("pageid", this.pageid);
    params.append("rows", "20");

    var promise = BaseNetwork.sendNetworkRequest(params);

    promise
      .then(response => {
        if (response.msg == 0) {
          let datalist = response.data;
          let dataBlog = [];
          let i = 0;
          if (this.pageid == 0) {
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

          if (response.data == undefined || response.data.length == 0) {
            this.setState({ dianziArray: [] });
          } else {
            datalist.map(dict => {
              dataBlog.push({ key: i, value: dict });
              i++;
            });
            let dataList = isReload ? dataBlog : [...this.state.dianziArray, ...dataBlog]
            for (let i = 0; i < dataList.length; i++) {
              dataList[i].id = i
            }
            this.setState({
              dianziArray: dataList,
            })
            datalist = null;
            dataBlog = null;
          }
        } else {
          if (this.pageid == 0) {
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

  //尾部刷新
  onFooterRefresh = () => {
    this.setState({ refreshState: RefreshState.FooterRefreshing })
    this.pageid++;

    this._fetchMGGameData(false);

  }


  _listHomeHeaderComponent() {
    return (
      <View style={{ width: width, height: 93, backgroundColor: 'white' }}>
        {this._SearchMGGame()}
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


  _remenMGGame() {
    return (
      <View style={{ width: width, height: 40, backgroundColor: 'white', alignItems: 'center', flexDirection: 'row' }}>
        <CusBaseText style={{ fontSize: Adaption.Font(18, 17), color: COLORS.appColor, marginLeft: 15 }}>
          推荐游戏
           </CusBaseText>
      </View>
    );
  }

  _renderMGgameItemView(item) {

    const { navigate } = this.props.navigation;
    return (
      <TouchableOpacity activeOpacity={1} style={styles.cellStyle}
        onPress={() => this._gotoActionGame(item)}>
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
  keyExtractor = (item, index) => {
    return item.id
  }
  render() {
    return (
      <View style={styles.container}>
        <RefreshListView
          bounces={false}
          automaticallyAdjustContentInsets={false}
          alwaysBounceHorizontal={false}
          showsVerticalScrollIndicator={false} //不显示右边滚动条
          renderItem={item => this._renderMGgameItemView(item)}
          horizontal={false} //水平还是垂直
          numColumns={3} //指定多少列
          data={this.state.dianziArray}
          ListHeaderComponent={() => this._listHomeHeaderComponent()}
          keyExtractor={this.keyExtractor}
          refreshState={this.state.refreshState}
          onHeaderRefresh={this.onHeaderRefresh}
          onFooterRefresh={this.onFooterRefresh}
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
  tuijianStyle: {
    height: 25,
    width: 70,
    borderColor: COLORS.appColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 0.5,
    marginTop: 10,
    marginBottom: 20
  },
  tuijianMGgameStyle: {
    height: 160,
    width: width / 3,
    backgroundColor: "white",
    alignItems: 'center',
    justifyContent: 'center',
  },

});
