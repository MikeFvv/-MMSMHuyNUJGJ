import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get("window");
const KAdaptionWith = width / 414;
const KAdaptionHeight = height / 736;
import { CachedImage, ImageCache } from "react-native-img-cache";

class HomeReCaiBlockView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dataSource: this.props.dataSource,
      footWinArray: this.props.footWinArray,
      backupCpicon: false,//是否启用备用彩种地址
      onlongIndex: 10000,
      onDeleteCaiIndex: 10000,
    };
    this.isJump == false;
  }


  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: nextProps.dataSource,
    });
  }

  render() {
    return (
      <View style={{ width: width, height: this.state.dataSource.length / 3 * 100 }}>
        <FlatList
          scrollEnabled={false}
          data={this.state.dataSource}
          keyExtractor={this._keyExtractor}
          renderItem={item => this._renderItemView(item)}
          horizontal={false} //水平还是垂直
          showsVerticalScrollIndicator={false} //不显示右边滚动条
          numColumns={3} //指定多少列
          enableEmptySections={true}
          ListFooterComponent={() => this._listFooterComponent()}
        />
      </View>
    );

  }
  _keyExtractor = (item, index) => {
    return String(index);
  }

  _renderItemView(item) {
    if (item.index == this.state.dataSource.length - 1 && this.props.caizhongIndex == 0) {
      return (
        <TouchableOpacity activeOpacity={1} style={styles.cellStyle} onPress={() => this.props.navigator.navigate('NewBuyLot')}>
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
    } else {

      return (

        <TouchableOpacity activeOpacity={1} style={styles.cellStyle}
          onPress={() => this._jumpBuyLotDetail(item)}
        // onLongPress ={() => this._onLongItemPress(item)}
        >
          {this.state.onlongIndex == item.index ? <View style={styles.cellViewStyle}>
            <CachedImage
              source={{
                uri: item.item.value.icon ,
                cache: 'force-cache'
              }}
              style={{ width: 50, height: 50, marginLeft: 10, marginTop: 3 }} />
            <TouchableOpacity style={{ width: 23, height: 23, marginLeft: -8, marginTop: -22 }} activeOpacity={1} onPress={() => this._deleteCaiZhong(item)}>
              <Image style={{ width: 23, height: 23 }}
                source={require('./img/ic_deleteCai.png')}
              />
            </TouchableOpacity>
          </View> : item.item.value.game_name == '添加彩种' ? <Image style={{ width: 50, height: 50, marginTop: 3 }}
            source={require('./img/ic_tianjiaCaiZhong.png')}
          /> : <CachedImage
                source={{
                  uri: this.state.backupCpicon ? GlobalConfig.backupCpicon() + item.item.value.tag + '.png' : Cpicon + item.item.value.tag + '.png',
                  cache: 'force-cache'
                }}
                style={{ width: 50, height: 50, marginTop: 3 }}
                onError={({ nativeEvent: { error } }) => {
                  if (error) {
                    this.setState({
                      backupCpicon: true,
                    });
                  }
                }} />}
          {item.item.value.game_name == "添加彩种" ? <CusBaseText style={{ fontSize: Adaption.Font(15, 15), fontWeight: "400", marginTop: 15 }}>
            添加彩种
        </CusBaseText> : <CusBaseText style={{ fontSize: Adaption.Font(15, 15), fontWeight: "400", marginTop: 7 }}>
              {item.item.value.game_name}
            </CusBaseText>}
          {item.item.value.game_name == '添加彩种' ? null : <CusBaseText
            style={{ fontSize: Adaption.Font(12, 11), fontWeight: "400", color: "#666666", marginTop: 2 }}>
            {item.item.value.qishu}
          </CusBaseText>}

        </TouchableOpacity>
      );

    }

  }

  //长按删除事件
  _onLongItemPress(item) {
    if (item.item.value.game_name != '添加彩种') {
      this.setState({ onlongIndex: item.index })
    }
  }

  _deleteCaiZhong(item) {
    item.item.value.game_name = "添加彩种";
    this.setState({ onlongIndex: 10000 })
  }

  // 跳转投注页
  _jumpBuyLotDetail(item) {

    if (item.item.value.game_name != '添加彩种') {
      if (this.isJump == true) {
        return;
      }
      this.isJump = true;

      if (item.item.value.js_tag.includes('lhc')) {
        global.yearId = item.item.value.yearid;
      }


      //进入非体彩的界面入口吧】
      this.props.navigator.navigate('BuyLotDetail', {
        gameId: item.item.value.game_id,
        backAction: this.props.backAction
      })


      this.isJump = false;
    } else {
      this.props.navigator.navigate('HomeCustmCaiZhongView', );
    }
  }

  _listFooterComponent() {
    return (
      null
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  footerComponent: {
    height: 0.1 * KAdaptionHeight,
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
    borderBottomWidth: 0.5,
    borderColor: '#cccccc',
  },
  cellViewStyle: {
    height: 50,
    width: width / 3 - 1,
    backgroundColor: 'white',
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',


  }

});


export default HomeReCaiBlockView;