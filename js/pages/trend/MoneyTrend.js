
/**
 Created by Money on 2018/04/29
 */

import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";

import TrendCenter from './TrendCenter';  // 走势中心内容
import SelectGameView from '../trend/SelectGameView';      //彩种选择弹窗视图
import TrendOpenDatail from '../theLot/TOTrend';

let click = true; // 连续点击

export default class MoneyTrend extends Component {
  
  static navigationOptions = ({ navigation }) => ({
    header: (
        <View style={{ width: SCREEN_WIDTH, height: (SCREEN_HEIGHT == 812 ? 88 : 64), flexDirection: 'row', backgroundColor: COLORS.appColor }}>
            <TouchableOpacity
              activeOpacity={1}
              style={{ width: 80, paddingLeft: 15, justifyContent: 'center', marginTop: SCREEN_HEIGHT == 812 ? 40 : 20 }}
              onPress={() => {
                  global.isInBuyLotVC = true;  //返回上一界面时改为true
                  navigation.state.params && navigation.state.params.gameId ? navigation.goBack() : null
              }}
            >
            {navigation.state.params && navigation.state.params.gameId ? <View style={{ width: 15, height: 15, borderColor: '#fff', borderLeftWidth: 1, borderBottomWidth: 1, transform: [{ rotate: '45deg' }] }}></View> : null}
            </TouchableOpacity>

            <View style={{ width: SCREEN_WIDTH - 160, justifyContent: 'center', alignItems: 'center' }} >
              <CusBaseText style={{ color: 'white', fontSize: 18, marginTop: (SCREEN_HEIGHT == 812 ? 40 : 20) }}>{ navigation.state.params && navigation.state.params.gameName ? navigation.state.params.gameName : '基本走势' }</CusBaseText>
            </View>

            <TouchableOpacity
              activeOpacity={1}
              style={{ width: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: SCREEN_HEIGHT == 812 ? 40 : 20 }}
              onPress={() => navigation.state.params.navigateRightPress()}
            >
              <Image resizeMode={'contain'} style={{ width: 20, height: 20 }} source={require('../buyLot/img/ic_buyLotChange.png')} />
              <CusBaseText style={{ fontSize: Adaption.Font(17, 16), marginLeft: 2, color: 'white' }}>彩种</CusBaseText>
            </TouchableOpacity>
        </View>
    ),
  });

  constructor(props) {
    super(props);

    this.state = {
      isShowGameView: false,
    };

    let dic = global.AllPlayGameList.length > 0 ? global.AllPlayGameList[0] : {};
    this.game_id = dic['game_id'] ? dic['game_id'] : 1;
    this.game_name = dic['game_name'] ? dic['game_name'] : ''; 
    this.js_tag = dic['js_tag'] ? dic['js_tag'] : '';
    this.tag = dic['tag'] ? dic['tag'] : ''; 
    this.tempGameId = 0; // 切换彩种时临时使用。

    if (this.props.navigation.state.params != null && this.props.navigation.state.params.gameId != null && global.AllPlayGameList.length > 0 && Object.keys(global.GameListConfigModel).length > 0) {
      this.game_id = this.props.navigation.state.params.gameId; // 从投注界面进来的。
      let gameDic = global.GameListConfigModel[`${this.game_id}`];
      this.game_name = gameDic['game_name'];
      this.js_tag = gameDic['js_tag']; 
      this.tag = gameDic['tag'];
    }
    
  }

  componentDidMount() {
    this.props.navigation.setParams({
      navigateRightPress: this._navigateRightPress,
    })
  }

  _navigateRightPress = () => {
    this.setState({
      isShowGameView: !this.state.isShowGameView,
    })
  }

  render() {

    let bottomX = (SCREEN_HEIGHT == 812 && this.props.navigation.state.params && this.props.navigation.state.params.gameId) ? 34 : 0;

    return (
      <View style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
        <TrendCenter
          game_id={this.tempGameId > 0 ? this.tempGameId : this.game_id}
          selectIdx={1} // 选择的下标
          showGameView={this.state.isShowGameView} // 为true时不刷新里面的界面
          currentData={(data) => {
            this.tempGameId = 0;
            this.game_id = data.game_id;
            this.game_name = data.game_name;
            this.js_tag = data.js_tag;

            if (this.props.navigation.state.params && this.props.navigation.state.params.gameId) { // 不是主界面的走势，改变导航栏的彩种名称
              this.props.navigation.state.params.gameName = data.game_name;
              this.props.navigation.setParams({ }) // 用于刷新一下导航栏
            } else {
              this.setState({ });
            }
          }}
          openResultView={// 开奖结果
            <TrendOpenDatail tag={this.tag} pig_tage={this.js_tag} hideLoad={true}/>
          }
        >
        </TrendCenter>
        
        {/* 底部 去投一注 */}
        {this.game_id && this.game_name.length > 0
          ?<View style={{ height: Adaption.Width(50), marginBottom: bottomX, flexDirection: 'row', alignItems: 'center', borderColor: '#eae9e7', borderTopWidth: 1, backgroundColor: '#fff' }}>
            <View style={{ width: Adaption.Width(120), alignItems: 'center', justifyContent: 'center' }}>
              <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(17, 15), color:'#4d4d4d' }}>{this.game_name}</Text>
            </View>
            <TouchableOpacity
              activeOpacity={1}
              style={{ marginLeft: Adaption.Width(180), width: Adaption.Width(100), height: Adaption.Width(35), alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.appColor, borderRadius: 3 }}
              onPress={() => {
                if (click) {
                  click = false;
                  setTimeout(() => {
                    click = true;
                  }, 1000);
                  
                  if (this.props.navigation.state.params.gameId != null) {

                    global.isInBuyLotVC = true;  //返回上一界面时改为true
                    // 返回上界面
                    if (this.props.navigation.state.params.gameId != this.game_id) {
                      // 切换过彩种的，返回要回调game_id回去，重新请求数据刷新界面
                      this.props.navigation.state.params.callbackGameid(this.game_id);
                      this.props.navigation.goBack();
                    } else {
                      this.props.navigation.goBack();
                    }

                  } else {
                    global.isInBuyLotVC = true;  //返回上一界面时改为true
                    this.props.navigation.navigate('BuyLotDetail', { gameId: this.game_id });
                  }
                }
              }}
            >
              <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(17, 15), color: 'white' }}>去投一注</Text>
            </TouchableOpacity>
          </View>
          :null
        }

        <SelectGameView
          currentGameid={this.game_id}
          isClose={this.state.isShowGameView}
          close={() => {
              this.setState({
                  isShowGameView: false,
              })
          }}
          caiZhongClick={(gameData) => {

            this.tag = gameData.tag;
            this.tempGameId = gameData.game_id; // 临时使用，如果请求不成功，就不改变this.game_id的值
            this.setState({
                isShowGameView: false,
            })
          }}
        >
        </SelectGameView>
          
      </View>
    );
  }
}