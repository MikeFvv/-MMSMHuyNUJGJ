import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    FlatList,
    Dimensions,
    Alert,
    Easing,
    Animated,
    ImageBackground
} from 'react-native';

const { width, height } = Dimensions.get("window");
const KAdaptionWith = width / 414;
const KAdaptionHeight = height / 736;
import HomeCaiFootView from './HomeCaiFootView';
// import { CachedImage, ImageCache } from "react-native-img-cache";
import {
  CachedImage,
  ImageCacheProvider
} from 'react-native-cached-image';

class HomeCaiBlockView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dataSource:this.props.dataSource,
      translateY: new Animated.Value(0),
      backupCpicon: false,//是否启用备用彩种地址
    };
    this.isJump == false;
  }

  componentWillReceiveProps(nextProps) {
      this.setState({
        dataSource:nextProps.dataSource,
      });
  }

  render() {
    return (
          <FlatList
             scrollEnabled = {false}
             keyExtractor={this._keyExtractor}
             data={this.state.dataSource}
             renderItem={item => this._renderItemView(item)}
             horizontal={false} //水平还是垂直
             showsVerticalScrollIndicator={false} //不显示右边滚动条
             numColumns={this.props.caizhongIndex == 3 ? 1 : 3} //指定多少列
             enableEmptySections={true}
             ListFooterComponent={this.props.caizhongIndex == 3 ?null:() => this._listFooterComponent()}
          />
    )

   }
   _listFooterComponent() {
    return (
      <HomeCaiFootView
        //backAction={this._backAction}
        // is_GuestShiWan={this.state.is_GuestShiWan}
        navigator={this.props.navigator}
      >
      </HomeCaiFootView>
    )

  }

   _keyExtractor = (item,index) => {
    return String(index);
      }

      _xingxingImage(item) {
        this.xingxingNumber = [1, 1, 1, 1, 1];
        var viewArr = [];
        for (var i = 0; i < this.xingxingNumber.length; i++) {
          viewArr.push(
            <Image
              key = {i}
              style={{ width: 13 * KAdaptionWith, height: 13 * KAdaptionHeight, marginTop: 12, marginLeft: i == 0 ? 0 : 5 }}
              source={i - item.item.value.score < 0 ? require('./img/ic_xingxingShi.png') : require('./img/ic_xingxingKong.png')} />
          );
        }
        return viewArr;
      }

      _renderItemView(item) {
        if (this.props.caizhongIndex == 3) {
          return (
            <TouchableOpacity activeOpacity={1}  style={styles.gameCellStyle} >
              <View style = {{flex:0.2,justifyContent:'center',alignItems:'center',marginLeft:10}}>
              <Image source={{ uri: item.item.value.icon }} style={{ width: 60, height: 60 }} />
              </View>
              <View style={{ flex:0.6, marginLeft: 15, justifyContent: 'center', }}>
                <CusBaseText style={{ fontSize: Adaption.Font(17, 16), fontWeight: "400", }}>
                  {item.item.value.pt_name}
                </CusBaseText>
                <ImageBackground style={{ flexDirection: 'row', }}>
                  {this._xingxingImage(item)}
                  <CusBaseText
                    style={{ fontSize: Adaption.Font(14, 13), fontWeight: "400", color: "#666666", marginTop: 10, marginLeft: 5 }}>
                    {item.item.value.number}人在玩
                    </CusBaseText>
                </ImageBackground>
              </View>
              <View style = {{flex:0.2,marginRight:10,justifyContent:'center',alignItems:'center',marginTop:5}}>
              <TouchableOpacity activeOpacity={1} style={styles.jinruStyle}
                onPress={() => this._goToMGGame(item)}>
                <CusBaseText style={{ fontSize: Adaption.Font(16, 15), color: COLORS.appColor }}>
                  进入
                </CusBaseText>
              </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        } else {
          if (item.index == this.state.dataSource.length - 1 && this.props.caizhongIndex == 0) {
            return (
              <TouchableOpacity activeOpacity={1} style={styles.cellStyle} onPress={() => this.props.navigator.navigate('NewBuyLot', { backAction: this.props.backAction })}>
                <Image source={require('./img/ic_chakangengduo.png')} style={{ width: 50, height: 50, marginTop: 3 }} />
                <CusBaseText style={{ fontSize: Adaption.Font(15, 15), fontWeight: "400", marginTop: 5 }}>
                  更多
              </CusBaseText>
                <CusBaseText
                  style={{ fontSize: Adaption.Font(12, 11), fontWeight: "400", color: "#666666", marginTop: 2 }}>
                  更多彩种分类
                        </CusBaseText>
              </TouchableOpacity>
            );
          }else {

            let hotAndNew =null;

            if(item.item.value.hot == 0){
              hotAndNew = null;
            }else if(item.item.value.hot == 1){
              hotAndNew = require('./img/ic_homeReMenHot.png');
            }else {
              hotAndNew = require('./img/ic_homeReMenNew.png');
            }
   
            return (
              <TouchableOpacity activeOpacity={1} style={styles.cellStyle}
                onPress={() => this._jumpBuyLotDetail(item)}>
               <View style = {{ height: 50,width: width / 3,backgroundColor: "white",alignItems: 'center'}}>
               <ImageCacheProvider >
                 <CachedImage resizeMode={'stretch'} source={{ uri: item.item.value.icon }} style={{ width: 50, height: 50}} />
              </ImageCacheProvider>
              <Image style={{width:18,height:10,left:width / 3 / 2 + 15,position: 'absolute'}} source={hotAndNew}></Image>
              </View>
    
                <CusBaseText style={{ fontSize: Adaption.Font(15, 15), fontWeight: "400", marginTop: 5 }}>
                  {item.item.value.game_name}
                </CusBaseText>
                <CusBaseText
                  style={{ fontSize: Adaption.Font(12, 11), fontWeight: "400", color: "#666666", marginTop: 2 }}>
                  {item.item.value.tip}
                </CusBaseText>
              </TouchableOpacity>
            );
          }
        }
      }

    // 跳转投注页
    _jumpBuyLotDetail(item) {

    if(item.item.value.type == 1) {
      if(item.item.value.enable == 2) {
        
        Alert.alert(
          '提示',
          '该彩种正在维护',
          [
              {text: '确定', onPress: () => {}},
          ]
      )
      return;
      }

        if (this.isJump == true) {
          return;
        }
        this.isJump = true;
    
        if (item.item.value.js_tag.includes('lhc')) {
          global.yearId = item.item.value.yearid;
        }
        global.isInBuyLotVC = true;  //是否在投注界面
        this.props.navigator.navigate('BuyLotDetail',
          {
            gameId: item.item.value.game_id,
            backAction: this.props.backAction
          });
        this.isJump = false;
      }else{
        if(item.item.value.enable == 2) {
        
          Alert.alert(
            '提示',
            '该彩种正在维护',
            [
                {text: '确定', onPress: () => {}},
            ]
        )
        return;
        }

          //  //进入体彩的入口
   this.props.navigator.navigate('FootballGame',  {
       gameId: item.item.value.game_id,
       backAction: this.props.backAction
    })
      }
    }

     //电子游戏入口
  _goToMGGame(item) {

    if(item.item.value.enable ==1) {
      Alert.alert(
        '温馨提示',
        '该游戏正在维护',
        [
          {
            text: '确定', onPress: () => {
            }
          },
        ]
      )
    }else {

    if (global.UserLoginObject.Token != '' || global.UserLoginObject.Token.length != 0) {
      if (global.UserLoginObject.is_Guest == 2) {
        this.props.navigator.navigate('HomeComputMGGameView', { backAction: this.props.backAction, title: item.item.value.pt_name,playGame:item.item.value.tag})
      } else {
        this.props.navigator.navigate('HomeLandComputGameView', { backAction: this.props.backAction, title: item.item.value.pt_name,playGame:item.item.value.tag})
  
      }
    } else {
      Alert.alert(
        '温馨提示',
        '您还未登录,请先登录',
        [
          {
            text: '确定', onPress: () => {
            }
          },
        ]
      )
    }
  }
  }

  //    //底部视图
  // _listFooterComponent() {
  //   return this.state.dataSource.length !== 0 ? (
  //     <View style={styles.footerComponent}>
  //       {this._footZuiXinZhongJiangBang()}
  //       {this._footZhongJiangGunDong()}
  //     </View>
  //   ) : null;
  // }

  //线
   _separatorView() {
    return (
      <View style={{ width: width, height: 1, backgroundColor: "#eeeeee" }} />
    );
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
        onPress={() => this.props.navigator.navigate('NewestWinBang', { footWinArray: this.state.footWinArray })}>
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
    if (this.state.footWinArray==null) {
      return [];
    }
    var viewArr = [];
    for (var i = 0; i < this.state.footWinArray.length; i++) {
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
              source={require('./img/ic_zhongjiang.png')}
            />
            <CusBaseText
              style={{
                color: "#9e9e9e",
                fontSize: Adaption.Font(12, 10),
                textAlign: "center",
                marginLeft: 3
              }}
            >
              {this.state.footWinArray[i].value.username}***
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
              喜中{this.state.footWinArray[i].value.win}元
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
              购买{this.state.footWinArray[i].value.gameid}
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
      duration: 300, //动画时间
      Easing: Easing.linear,
      delay: 1000 //文字停留时间
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
    justifyContent:'center',
    alignItems:'center'
  },

  footerComponent: {
    height: 130 * KAdaptionHeight,
    width: width
  },
  footZhongJiang: {
    overflow: "hidden",
   // height: 100 * KAdaptionHeight,
    width: width,
    backgroundColor: "#ffffff"
  },
  wrapper: {
    marginHorizontal: 5
  },
  cellStyle: {
    height: 100,
    width: width / 3,
    backgroundColor: "white",
    alignItems: 'center',
    justifyContent: 'center',
    // borderRightWidth:1,
    borderBottomWidth:0.5,
    borderColor:'#cccccc',
  },
  gameCellStyle: {
    flexDirection: 'row',
    height: 80,
    width: width,
    backgroundColor: "white",
    alignItems: 'center',
    //justifyContent: 'center',
    // borderRightWidth:1,
    borderBottomWidth: 0.5,
    borderColor: '#cccccc',
  },
  jinruStyle: {
    height: 32,
    width: 80 * KAdaptionWith,
    borderColor: COLORS.appColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 0.5,
  }

});


export default HomeCaiBlockView;
