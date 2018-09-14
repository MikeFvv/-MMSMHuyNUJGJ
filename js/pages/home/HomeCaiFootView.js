import React, { Component } from 'react';

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
} from 'react-native';

const { width, height } = Dimensions.get("window");
const KAdaptionWith = width / 414;
const KAdaptionHeight = height / 736;
import { CachedImage, ImageCache } from "react-native-img-cache";

class HomeCaiFootView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dataSource:[],
      translateY: new Animated.Value(0),
    };
  
  }
  componentWillMount() {
   
      this.fetchFootData(); 
   
  }
  componentDidMount() {
    if(FootWinArray==undefined||FootWinArray.length==0){
      this.showHeadBar(0, 10);

    }else{
      this.showHeadBar(0, FootWinArray.length);
    }
  setTimeout(() => {
    this.fetchFootData();
  }, 900000);
  }

  fetchFootData(){
     //请求参数
     let params = new FormData();
     params.append("ac", "userWinList");
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
                         let dataWinBlog = [];
                        let j = 0;

                        datalist.map(dict => {
                            dataWinBlog.push({ key: j, value: dict });
                            j++;
                        });
                    this.setState({dataSource:dataWinBlog})
                    FootWinArray = dataWinBlog;
                    let homeKey = 'HomeCaiZhongObjcet';
                    UserDefalts.getItem(homeKey, (error, result) => {
                      if (!error) {
                        if (result !== '' && result !== null) {
                          let homeModel = JSON.parse(result);
                          homeModel.HomeFootWinArray=FootWinArray;
                          UserDefalts.setItem(homeKey, JSON.stringify(homeModel), (error) => {});
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
    return this.state.dataSource.length !== 0 ? (
        <View style={styles.footerComponent}>
          {this._footZuiXinZhongJiangBang()}
          {this._footZhongJiangGunDong()}
        </View>
      ) :<View style={styles.footerComponent}>
        {this._footZuiXinZhongJiangBang()}
      </View>;

   }


  //底部视图最新中奖榜
  _footZuiXinZhongJiangBang() {
    return (
      <View
        style={{
          height: 28 * KAdaptionHeight,
          width: width,
          alignItems: "center",
          flexDirection: "row",
          backgroundColor: "rgb(240,240,240)"
        }}
      >
        <CusBaseText
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: "#141414",
            marginLeft: 10
          }}
        >
          最新中奖榜
                </CusBaseText>
      </View>
    );
  }

  //底部最新中奖名单滚动
  _footZhongJiangGunDong() {

    return (
      <TouchableOpacity style={styles.footZhongJiang} activeOpacity={1}
        onPress={() => this.props.navigator.navigate('NewestWinBang', { footWinArray: this.state.dataSource })}>
        <Animated.View
          style={[
            styles.wrapper,
            {
              transform: [
                {
                  translateY: this.state.translateY
                }
              ]
            }
          ]}
        >
          {this._footWinViews()}
        </Animated.View>
      </TouchableOpacity>
    );
  }


  _footWinViews() {
    let winName = '';
    if (this.state.dataSource==null) {
      return [];
    }
    var viewArr = [];
    for (var i = 0; i < this.state.dataSource.length; i++) {
      winName = this.state.dataSource[i].value.username.substr(0,3);
      viewArr.push(
        <View
          key={i}
          style={{
            height: 20,
            width: width - 20,
            marginLeft: 10,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Image
              style={{
                width: 13 * KAdaptionWith,
                height: 13 * KAdaptionHeight,
                marginLeft: 10
              }}
              source={require('./img/ic_zhongjiangbang.png')}
            />
            <CusBaseText
              style={{
                color: "#9e9e9e",
                fontSize: Adaption.Font(12, 10),
                textAlign: "center",
                marginLeft: 3
              }}
            >
            {winName}***
                        </CusBaseText>
          </View>
          <View style={{ flex: 1 }}>
            <CusBaseText
              style={{
                color: "#eb3349",
                fontSize: Adaption.Font(12, 10),
                textAlign: "center",
              }}
            >
              喜中{this.state.dataSource[i].value.win}元
                        </CusBaseText>
          </View>
          <View style={{ flex: 1 }}>
            <CusBaseText
              style={{
                color: "#9e9e9e",
                fontSize: Adaption.Font(12, 10),
                textAlign: "center",
                marginLeft: 3
              }}
            >
              {this.state.dataSource[i].value.gamename}
            </CusBaseText>
          </View>
        </View>
      );
    }
    return viewArr;
  }
  showHeadBar(index, count) {
    index++;
    Animated.timing(this.state.translateY, {
      toValue: -20 * index, //40为文本View的高度
      duration: 200, //动画时间
      Easing: Easing.linear,
      delay: 1500 //文字停留时间
    }).start(() => {
      //每一个动画结束后的回调
      if (index >= count) {
        index = 0;
        this.state.translateY.setValue(0);
      }
      this.showHeadBar(index, count); //循环动画
    });
  }
  

  
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor: 'white',
  },

  footerComponent: {
    height: 150 * KAdaptionHeight,
    width: width
  },
  footZhongJiang: {
    overflow: "hidden",
  //  height: 100 * KAdaptionHeight,
    width: width,
    backgroundColor: "#ffffff"
  },
  wrapper: {
    marginHorizontal: 5
  },

});


export default HomeCaiFootView;
