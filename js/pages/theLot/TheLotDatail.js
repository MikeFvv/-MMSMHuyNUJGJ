
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  AsyncStorage,
  ScrollView,
  RefreshControl,
} from 'react-native';

let rightNavigationImage = require('../buyLot/img/ic_buyLotChange.png'); //点击导航栏右边图片
let requestDataStateImage = require('./img/ic_kai_frist.png'); //请求数据的状态图片
import Toast, { DURATION } from 'react-native-easy-toast'  //土司视图
const { width, height } = Dimensions.get("window");
import Adaption from '../../skframework/tools/Adaption';
import GameListView from './GameList/GameListView';      //彩种选择弹窗视图
import TrendOpenDatail from './TOTrend';
let OpenTime = require('./GameList/OpenTime');
import TrendCenter from '../trend/TrendCenter';  // 走势中心内容
let click = true; // 连续点击去投一注

export default class theLotDatail extends Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
    header: (
      <CustomNavBar
        leftClick={() => navigation.goBack()}
        centerView={
          <View style={styles.inNavigationHeadStyle}>
            <CusBaseText style={{ fontSize: 18, color: 'white' }}>{navigation.state.params.navcLTitle}</CusBaseText>
          </View>
          }
          
        rightView={
          <TouchableOpacity
            activeOpacity={1}
            style={styles.rightNavigationHeadStyle}
            onPress={() => navigation.state.params.navigateRightPress()}>
            <Image resizeMode={'contain'} style={{ width: Adaption.Width(20), height: Adaption.Width(20) }} source={rightNavigationImage} />
            <CusBaseText style={{ fontSize: Adaption.Font(17, 15), marginLeft: 2, color: 'white' }}>彩种</CusBaseText>
          </TouchableOpacity>
        }
      />
    ),
  })


  constructor(props) {

    super(props);
    this.state = {
      gameName: this.props.navigation.state.params.gameName,
      selectedGameID: this.props.navigation.state.params.selectedGameID,
      btonQishu: this.props.navigation.state.params.btonQishu,
      isShowOpen: false,
      haderOpenList: [],
      timeArray: [],
      jiezhiTime:'',
      fengPanTime:'',
      finishTime:'',
    };

    this.small_Tag = this.props.navigation.state.params.tag;
    this.bin_headTag = this.props.navigation.state.params.js_tag;
    this.hightEnable = -1;
    this.tempGameId = 0; // 切换彩种时临时使用。
  }

  componentDidMount() {
    this._fetchSubHeadData();
    this._isSaveCZData ();
    this.props.navigation.setParams({
      navigateRightPress: this._navigateRightPress,
      navcLTitle: this.props.navigation.state.params.gameName,
     });
    
   }
    //拿全部数据  如果有缓存就拿缓存的顺便刷新 如果没有缓存就重新请求
    _isSaveCZData (){
      if (global.AllPlayGameList.length != 0) {
        //如果没有缓存则取请求数据
        this.state.haderOpenList = global.AllPlayGameList;
        for (let b in this.state.haderOpenList) {  
              let ballAr = this.state.haderOpenList[b].tag;
           if (ballAr.includes(this.small_Tag)) {    
                    this.hightEnable = this.state.haderOpenList[b].enable;
                  break;
              } 
          }
      } 
      
    }

    //页面将要离开的是时候发送通知
    componentWillUnmount() {
      PushNotification.emit('Alllottery');
    }

    //点击头部要请求的的视图数据
    _navigateRightPress = () => { 
      this.setState({
         isShowOpen: !this.state.isShowOpen, 
        });
      }

  //请求当前时间的
  _fetchSubHeadData() {
    let params = new FormData();
    params.append("ac", "getCplogList");
    params.append("tag", this.small_Tag);
   
    var promise = GlobalBaseNetwork.sendNetworkRequest(params);
    promise
      .then((responseData) => {

        // let timeJSO = responseData.data[0].next
        // this.setState({
        //   timeArray: timeJSO,
        //   btonQishu: timeJSO[0].qishu,
        //   jiezhiTime: timeJSO[0].opentime,
        // })
        let timeJSO = responseData.data[0].next
        let fengPanTime = timeJSO[0].stoptime - timeJSO[0].server_time;
        this.setState({
          timeArray: timeJSO,
          btonQishu: timeJSO[0].qishu,
          jiezhiTime: timeJSO[0].openless,
          fengPanTime:fengPanTime,
          finishTime:Math.round(new Date() / 1000),
        })
         
      })
      .catch((err) => {
        if (err && typeof(err) === 'string' && err.length > 0) {
          this.refs.LoadingView && this.refs.LoadingView.showFaile(err);
      }
      })
  }


  render() {

    return (
      <View style={{flex: 1,backgroundColor: 'white'}}>
          <TrendCenter
          game_id={this.tempGameId > 0 ? this.tempGameId : this.state.selectedGameID}
          selectIdx={0} // 选择的下标
          showGameView={this.state.isShowOpen} // 为true时不刷新里面的界面
          currentData={(data) => {
            this.tempGameId = 0;
            this.state.selectedGameID = data.game_id;
            this.state.gameName = data.game_name;
            this.bin_headTag = data.js_tag;

            if (this.props.navigation.state.params && this.props.navigation.state.params.selectedGameID) { // 不是主界面的走势，改变导航栏的彩种名称
              this.props.navigation.state.params.gameName = data.game_name;
              this.props.navigation.setParams({ }) // 用于刷新一下导航栏
            } else {
              this.setState({ });
            }
          }}
          openResultView={// 开奖结果
            <TrendOpenDatail tag={this.small_Tag} pig_tage={this.bin_headTag}/>
          }>
        </TrendCenter>

        <OpenTime
          tag={this.small_Tag}
          // jiezhitime={this.state.jiezhiTime}
          // nextTimeData={this.state.timeArray}
          // prevqishu={this.state.btonQishu}
          jiezhitime={this.state.jiezhiTime}
          nextTimeData={this.state.timeArray}
          fengPanTime={this.state.fengPanTime}
          prevqishu={this.state.btonQishu}
          finishTime = {this.state.finishTime}
          touZhuClick={() => {
            this._geToBuyCenter();
          }}/>

             <GameListView
            isHightX ={137}
            isHight6 ={165}
            gameList={this.state.haderOpenList}
            selectedGameID={this.state.selectedGameID}
            isClose={this.state.isShowOpen}
            close={() => {
              this.setState({
                isShowOpen: false,})
              }}

            caiZhongClick={(gameData, index) => {

            if (this.state.gameName == gameData.game_name) {
              this.setState({ isShowOpen: false, })
              return; // 选择相同 直接退出

            } else {
              setTimeout(() => {
                this.props.navigation.setParams
                  ({ navcLTitle: gameData.game_name, });

                 this.small_Tag = gameData.tag;
                 this.bin_headTag = gameData.js_tag;
                 this.state.gameName = gameData.game_name;
                 this.hightEnable = gameData.enable; 
                 this.tempGameId = gameData.game_id; // 临时使用，如果请求不成功，就不改变this.game_id的值
                 this._fetchSubHeadData();
                 this.setState({
                  isShowOpen: false,
                  selectedGameID: index,
                  });                 
              }, 100);
            }
          }
        }>
        
        </GameListView>
      </View>
    );
  }

        _geToBuyCenter() {
          if (this.hightEnable != -1) {
            if (click) {
              click = false;
              global.isInBuyLotVC = true;
              this.props.navigation.navigate('BuyLotDetail', {
                gameId: this.state.selectedGameID,
              });
              this.time = setTimeout(() => {
                click = true;
              }, 1000);
            }
          } else {
            Alert.alert('提示', `${'该彩种'}正在维护`, [{
              text: '确定', onPress: () => { }
            }]);
          }
        }

   }

const styles = StyleSheet.create({
  inNavigationHeadStyle: {
    width: SCREEN_WIDTH - 140,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: SCREEN_HEIGHT == 812 ? 40 : 20,
  }, //导航栏中间头部样式
  rightNavigationHeadStyle: {
    width: 60, height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SCREEN_HEIGHT == 812 ? 40 : 20
  }, //导航栏右边间头部样式

})