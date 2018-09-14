
/**
 Created by Money on 2018/05/29
  所有玩法 - 总管家
 */

import React, { Component } from "react";
import {
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';

import FBAllGameCenter from './FBAllGameCenter';
let callbackAllSltDic = {};
export default class FBAllGame extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: (
      <CustomNavBar
        leftClick={() => {
          if (navigation.state.params.game_type == 3) {
            navigation.state.params.callback(callbackAllSltDic, navigation.state.params.backupSltDic ? navigation.state.params.backupSltDic.sectionItemiId : null);
          }
          navigation.goBack();
        }}
        centerView={
          <View style={{ top: SCREEN_HEIGHT == 812 ? 44 : 20, height: 44, justifyContent: 'center', alignItems: 'center' }}>
            <CusBaseText style={{ fontSize: 18, color: 'white', }}>{'所有玩法'}</CusBaseText>
          </View>
        }
        rightView={
          <TouchableOpacity activeOpacity={0.8}
            style={{ top: SCREEN_HEIGHT == 812 ? 44 : 20, right: 5, height: 44, width: 44, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => {
              navigation.state.params ? navigation.state.params.navRightPress() : null;
            }}
          >
            <Image resizeMode={'contain'} style={{ width: 27, height: 27 }} source={require('../../img/ic_refresh.png')} />
          </TouchableOpacity>
        }
      />
    ),
  });

  constructor(props) {
    super(props);

    callbackAllSltDic = props.navigation.state.params.allSltDic;  // 进来就把原来的值赋给它。

  }

  componentDidMount() {

    this.props.navigation.setParams({
      navRightPress: this._navRightPress,
    })

    // 清空号码的通知
    this.clearNotify = PushNotification.addListener('ClearFootBallGameViewBallNotification', () => {
      callbackAllSltDic = {};
      this.props.navigation.state.params.sltDic = {}; // 得改变。
      this.props.navigation.state.params.allSltDic = {};
    });
  }

  componentWillUnmount() {

    if (typeof (this.clearNotify) == 'object') {
      this.clearNotify && this.clearNotify.remove();
    }
  }

  _navRightPress = () => {
    PushNotification.emit('RefreshAllGame');
  }


  _gameCenterView(tabIndex, title) {
    return (
      <FBAllGameCenter key={tabIndex}
        sport_id={this.props.navigation.state.params.sport_id}
        hg_id={this.props.navigation.state.params.nowGameData.hg_id}
        game_type={this.props.navigation.state.params.game_type}
        superSltDic={this.props.navigation.state.params.sltDic}
        superAllSltDic={this.props.navigation.state.params.allSltDic}
        superBackupSltDic={this.props.navigation.state.params.backupSltDic}
        tabIdx={this.props.navigation.state.params.tabIdx}
        play_group={this.props.navigation.state.params.play_group}
        tabLabel={title}
        nowGameData={this.props.navigation.state.params.nowGameData}
        leagueData={this.props.navigation.state.params.leagueData}
        navigate={this.props.navigation.navigate} // 传入导航
        selectPanKou={this.props.navigation.state.params.selecctPanKou}
        zongheBackData={(allSltDic, sltDic) => {
          callbackAllSltDic = allSltDic;
          this.props.navigation.state.params.sltDic = sltDic; // 得改变。
        }}
      >
      </FBAllGameCenter>
    )
  }


  render() {

    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
          {this._gameCenterView(0, '所有盘口')}

        {/*<ScrollableTabView*/}
          {/*automaticallyAdjustContentInsets={false}*/}
          {/*alwaysBounceHorizontal={false}*/}
          {/*style={{ height: SCREEN_HEIGHT - 90 }}*/}
          {/*onScroll={(postion) => {*/}
            {/*if (postion % 1 == 0) {*/}
              {/*this.setState({});*/}
            {/*}*/}
          {/*}}*/}
          {/*renderTabBar={() =>*/}
            {/*<ScrollableTabBar*/}
              {/*backgroundColor={'#fff'}*/}
              {/*activeTextColor={COLORS.appColor}*/}
              {/*underlineStyle={{ backgroundColor: COLORS.appColor, height: 3 }}*/}
              {/*textStyle={{ fontSize: 17 }}*/}
            {/*>*/}
            {/*</ScrollableTabBar>*/}
          {/*}>*/}

          {/*{this._gameCenterView(0, '所有盘口')}*/}
          {/*{this._gameCenterView(1, '让球 & 大小盘口')}*/}
          {/*{this._gameCenterView(2, '上半场盘口')}*/}
          {/*{this._gameCenterView(3, '比分盘口')}*/}
          {/*{this._gameCenterView(4, '主盘口')}*/}
          {/*{this._gameCenterView(5, '进球盘口')}*/}
          {/*{this._gameCenterView(6, '其他盘口')}*/}

        {/*</ScrollableTabView>*/}

      </View>
    );
  }
}