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
} from 'react-native';

const { width, height } = Dimensions.get("window");
const KAdaptionWith = width / 414;
const KAdaptionHeight = height / 736;
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
             numColumns={3} //指定多少列
             enableEmptySections={true}
           //  ListFooterComponent={() => this._listFooterComponent()}
          />
    )

   }

   _keyExtractor = (item,index) => {
    return String(index);
      }

      goZhuQiu(item) {
   //    FootballGame
   //  //进入体彩的入口
   this.props.navigator.navigate('FootballGame',  {
    // gameId: item.item.value.game_id,
    // gameName: item.item.value.game_name,
    // tag: item.item.value.tag,
    // js_tag: item.item.value.js_tag,
    // speed: item.item.value.speed,
    backAction: this.props.backAction
  })
      }

   _renderItemView(item) {
    // if ( this.props.caizhongIndex == 3) {
    //   return (
    //     <TouchableOpacity activeOpacity={1} style={styles.cellStyle} onPress={() => this.goZhuQiu(item)}>
    //       <Image source={require('./img/ic_zuqiu.png')} style={{ width: 50, height: 50, marginTop: 3 }} />
    //       <CusBaseText style={{ fontSize: Adaption.Font(15, 15), fontWeight: "400", marginTop: 5 }}>
    //         足球
    //       </CusBaseText>
    //       <CusBaseText
    //         style={{ fontSize: Adaption.Font(12, 11), fontWeight: "400", color: "#666666", marginTop: 2 }}>
    //         返奖率高达72%
    //                 </CusBaseText>
    //     </TouchableOpacity>
    //   );
    // }else 
    if (item.index == this.state.dataSource.length - 1 && this.props.caizhongIndex == 0) {
      return (
        <TouchableOpacity activeOpacity={1} style={styles.cellStyle} onPress={() => this.props.navigator.navigate('BuyLot', { backAction: this.props.backAction})}>
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
    } 
     else {
      // let iconImage = '';
      // let iconImageArray = item.item.value.icon.split('.png');
      // if(item.item.value.enable != 2){
      //   iconImage =item.item.value.icon;
      // }else {
      //   iconImage = iconImageArray[0] + '_2' + '.png' ;
      // }
    
      return (
        <TouchableOpacity activeOpacity={1} style={styles.cellStyle}
          onPress={() => this._jumpBuyLotDetail(item)}>
          <ImageCacheProvider
         >
           <CachedImage  resizeMode={'stretch'} source={{ uri: item.item.value.icon}}  style={{ width: 50, height: 50, marginTop: 3}} />
        </ImageCacheProvider>
   

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

     //底部视图
  _listFooterComponent() {
    return this.state.dataSource.length !== 0 ? (
      <View style={styles.footerComponent}>
        {this._footZuiXinZhongJiangBang()}
        {this._footZhongJiangGunDong()}
      </View>
    ) : null;
  }

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

});


export default HomeCaiBlockView;
