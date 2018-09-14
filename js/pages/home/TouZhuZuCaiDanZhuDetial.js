import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  ScrollView,
  ImageBackground
} from "react-native";
const { width, height } = Dimensions.get("window");
import BaseNetwork from "../../skframework/component/BaseNetwork"; //网络请求
import Adaption from "../../skframework/tools/Adaption"; //字体适配
import moment from 'moment';

export default class TouZhuZuCaiDanZhuDetial extends Component {
  static navigationOptions = ({ navigation }) => ({

      header: (
          <CustomNavBar
              centerText = {"详情"}
              leftClick={() =>  navigation.goBack() }
          />
      ),


  });

  constructor(props) {
    super(props);
    this.state = {
      detialArray: {}, //详情数据
      backupCpicon:false,//是否启用备用彩种地址
    };
  }
  componentWillMount() {
    this.setState({
      detialArray: this.props.navigation.state.params.detialArray,
    })
  }
  //头部视图
  _createHeaderView() {
    //"status": 0,          //0: 未开獎， 1:已中獎，2: 未中獎，3:和局， 4:已撤單
    //判断该订单状态是否为已撤单
    let winLabel = '';
    let winTextColor = '';
    let winState = '';

    if (this.state.detialArray.value.bet_info[0].status == 0 ) {
        winLabel = '待开奖';
        winTextColor = '#ff7c34';
      } 
      else if (this.state.detialArray.value.bet_info[0].status == 3) {
        winLabel = '和局';
        winTextColor = 'rgb(0,109,0)';
      }else if (this.state.detialArray.value.bet_info[0].status ==2) {
        winLabel = '未中奖';
        winTextColor = 'red';
      } else if (this.state.detialArray.value.bet_info[0].status == 1) {
        winState =  + this.state.detialArray.value.bet_info[0].win_price + '元';
        winLabel = '已中奖'
        winTextColor = 'rgb(0,109,0)';
      } else if (this.state.detialArray.value.bet_info[0].status == 4) {
        winLabel = '已撤单';
        winTextColor = 'gray';
      }


 

    return (
      <View style={{ width: width, height: 90, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
        <View style={{ flex: 0.25 }}>
          <Image style={{ width: 60, height: 60, marginLeft: 15 }}
            source={require('./img/ic_zuqiu.png')}>
          </Image>
        </View>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', marginLeft: 10 }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center',marginTop:10}}>
            <CusBaseText style={{flex:0.7, fontSize: Adaption.Font(17, 16), color: '#222222', textAlign: 'left',marginLeft: 15 }}>
              足球
            </CusBaseText>
            <CusBaseText style={{flex:0.3, fontSize: Adaption.Font(17, 16), color: 'rgb(0,109,0)', textAlign: 'right', marginRight: 20 }}>
            {winState}
            </CusBaseText>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', }}>
            <CusBaseText style={{flex:0.7, fontSize: Adaption.Font(16, 16), color: 'gray', textAlign: 'left',marginLeft: 15 }}>
             普通投注
            </CusBaseText>
            <CusBaseText style={{flex:0.3, fontSize: Adaption.Font(16, 16), color: winTextColor, textAlign: 'right' ,marginRight: 15}}>
              {winLabel}
            </CusBaseText>
          </View>
        </View>
      </View>
    )
  }

  //是否开奖
  on_shifouKaiJiang() {
    //"status": 0,          //0: 未开獎， 1:已中獎，2: 未中獎，3:和局， 4:已撤單
    let kaijiang = '';
    if (this.state.detialArray.value.bet_info[0].status == 0 ) {
        kaijiang = '待开奖';
      } 
      else if (this.state.detialArray.value.bet_info[0].status == 3) {
        kaijiang = '和局';
      }else if (this.state.detialArray.value.bet_info[0].status == 2) {
        kaijiang = '未中奖';
      } else if (this.state.detialArray.value.bet_info[0].status == 1) {
        kaijiang = '已中奖'
      } else if (this.state.detialArray.value.bet_info[0].status == 4) {
        kaijiang = '已撤单';
       
      }


    return (
      <View style={{ width: width, height: 25, backgroundColor: 'white', flexDirection: 'row' }}>
        <CusBaseText style={{ marginLeft: 49, fontSize: Adaption.Font(14, 14), color: '#666666', textAlign: 'left' }}>
          是否中奖:
    </CusBaseText>
        <CusBaseText style={{ marginLeft: 10, fontSize: Adaption.Font(14, 14), color: '#222222', textAlign: 'left' }}>
          {kaijiang}
        </CusBaseText>
      </View>

    )
  }

  on_KaiJiangshijian() {

    let kaijiangshijian = ''
    if (this.state.detialArray.value.bet_info[0].status == 0 || this.state.detialArray.value.bet_info[0].status == 1) {
      kaijiangshijian = '--';
    } else if (this.state.detialArray.value.bet_info[0].status == 3) {
      kaijiangshijian = this.state.detialArray.value.bet_info[0].js_time;
    } else if (this.state.detialArray.value.bet_info[0].status == 4) {
       kaijiangshijian = '--';
    } else if (this.state.detialArray.value.bet_info[0].status == 2) {
      kaijiangshijian = this.state.detialArray.value.bet_info[0].js_time;
    }

    return (
      <View style={{ width: width, height: 25, backgroundColor: 'white', flexDirection: 'row' }}>
        <CusBaseText style={{ marginLeft: 49, fontSize: Adaption.Font(14, 14), color: '#666666', textAlign: 'left' }}>
          开奖时间:
   </CusBaseText>
        <CusBaseText style={{ marginLeft: 10, fontSize: Adaption.Font(14, 14), color: '#222222', textAlign: 'left' }}>
          {kaijiangshijian}
        </CusBaseText>
      </View>
    )
  }
  //撤单
  _fetchCheDanData() {

    this.refs.LoadingView && this.refs.LoadingView.showLoading('撤单中');

        //请求参数
        let params = new FormData();
        params.append("ac", "cancelTouzhu");
        params.append("uid", global.UserLoginObject.Uid);
        params.append("token", global.UserLoginObject.Token);
        params.append("idlist", this.state.detialArray.value.guid);
        params.append("gameid", this.state.detialArray.value.gameid);
        params.append("sessionkey", global.UserLoginObject.session_key);

        var promise = BaseNetwork.sendNetworkRequest(params);

        promise
          .then(response => {
            this.refs.LoadingView && this.refs.LoadingView.cancer()
            if (response.msg == "0") {

              Alert.alert(
                '提示',
                '撤单成功',
                [
                  { text: '确定', onPress: () => { this.props.navigation.state.params.callback(), this.props.navigation.goBack() } },
                ]
              )


            } else {
              Alert.alert(
                '提示',
                response.param,
                [
                  { text: '确定', onPress: () => { } },
                ]
              )
            }
          })
          .catch(err => { });
  }
  _onAcitveClickZaiLaiYiZhu(indexIn, navigate) {
    if (indexIn == 0) {
      this._fetchCheDanData();
    } else {
      navigate('FootballGame', { gameId: this.state.detialArray.value.gameid })
    }
  }
  //在来一注&撤单
  onZaiLaiYiZhu() {
    const { navigate } = this.props.navigation;
    let _againUIBtton = '';
    let indexButton = 0;
    if (this.state.detialArray.value.status == "0" || this.state.detialArray.value.status == "1") {
      indexButton = 0;
      _againUIBtton = '撤单';

    } else if (this.state.detialArray.value.status == "2" || this.state.detialArray.value.status == "3" || this.state.detialArray.value.status == "4") {
      indexButton = 1;
      _againUIBtton = '再来一注'
    }
    return (
      <TouchableOpacity activeOpacity={1} style={{ marginTop: 10, backgroundColor:COLORS.appColor, height: 40, marginLeft: 35, width: width - 70, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}
        onPress={() => this._onAcitveClickZaiLaiYiZhu(indexButton, navigate)}>
        <CusBaseText style={{ fontSize: 16, color: 'white', textAlign: 'center' }}>
          {_againUIBtton}
        </CusBaseText>
      </TouchableOpacity>
    )
  }

  render() {
    const { navigate } = this.props.navigation;
    let h = '';
    if(this.state.detialArray.value.game_type==4) {
    h =  this.state.detialArray.value.bet_info[0].h;
    }else{
    h =  this.state.detialArray.value.bet_info[0].team;
    }
    
    return (
      <ScrollView style={styles.container}
        automaticallyAdjustContentInsets={false}
        alwaysBounceHorizontal={false}
      >
        {this._createHeaderView()}
        <View style={{ width: width, height: 1.5, backgroundColor: '#eeeeee' }}>
        </View>

        <View style={{ width: width, height: 40, backgroundColor: 'white', alignItems: 'center', flexDirection: 'row' }}>
          <View style={{ marginLeft: 20, width: 6, height: 20, backgroundColor: COLORS.appColor }}>
          </View>
          <CusBaseText style={{ fontSize: Adaption.Font(17, 16), color: '#222222', textAlign: 'left', marginLeft: 5,fontWeight:'500' }}>
            订单内容
        </CusBaseText>
        </View>

        <View style={{ width: width, height: 25, backgroundColor: 'white', flexDirection: 'row' }}>
          <CusBaseText style={{ marginLeft: 35, fontSize: Adaption.Font(14, 14), color: '#666666', textAlign: 'left' }}>
            订  单  号:
        </CusBaseText>
          <CusBaseText style={{ marginLeft: 10, fontSize: Adaption.Font(14, 14), color: '#222222', textAlign: 'left' }}>
          {this.state.detialArray.value.betslip_id} 
          </CusBaseText>
        </View>

        <View style={{ width: width, height: 25, backgroundColor: 'white', flexDirection: 'row' }}>
          <CusBaseText style={{ marginLeft: 35, fontSize: Adaption.Font(14, 14), color: '#666666', textAlign: 'left' }}>
            投注金额:
        </CusBaseText>
          <CusBaseText style={{ marginLeft: 10, fontSize: Adaption.Font(14, 14), color: '#222222', textAlign: 'left' }}>
          {this.state.detialArray.value.bet_info[0].price} 
          </CusBaseText>
        </View>

        <View style={{ width: width, height: 25, backgroundColor: 'white', flexDirection: 'row' }}>
          <CusBaseText style={{ marginLeft: 35, fontSize: Adaption.Font(14, 14), color: '#666666', textAlign: 'left' }}>
            投注赔率:
        </CusBaseText>
          <CusBaseText style={{ marginLeft: 10, fontSize: Adaption.Font(14, 14), color: '#222222', textAlign: 'left' }}>
          @{this.state.detialArray.value.bet_info[0].new_odds}  <CusBaseText style={{ marginLeft: 10, fontSize: Adaption.Font(14, 14), color: COLORS.appColor, textAlign: 'left' }}>
          (此赔率为出票时的赔率)
          </CusBaseText>
          </CusBaseText>
        </View>

        <View style={{ width: width, height: 25, backgroundColor: 'white', flexDirection: 'row' }}>
          <CusBaseText style={{ marginLeft: 35, fontSize: Adaption.Font(14, 14), color: '#666666', textAlign: 'left' }}>
            过关方式:
        </CusBaseText>
          <CusBaseText style={{ marginLeft: 10, fontSize: Adaption.Font(14, 14), color: '#222222', textAlign: 'left' }}>
            单关
          </CusBaseText>
        </View>

        <View style={{ width: width, height: 25, backgroundColor: 'white', flexDirection: 'row' }}>
          <CusBaseText style={{ marginLeft: 35, fontSize: Adaption.Font(14, 14), color: '#666666', textAlign: 'left' }}>
            半场赛果:
        </CusBaseText>
          <CusBaseText style={{ marginLeft: 10, fontSize: Adaption.Font(14, 14), color: '#222222', textAlign: 'left' }}>
          {this.state.detialArray.value.bet_info[0].HTG}
          </CusBaseText>
        </View>

        <View style={{ width: width, height: 25, backgroundColor: 'white', flexDirection: 'row' }}>
          <CusBaseText style={{ marginLeft: 35, fontSize: Adaption.Font(14, 14), color: '#666666', textAlign: 'left' }}>
            全场赛果:
        </CusBaseText>
          <CusBaseText style={{ marginLeft: 10, fontSize: Adaption.Font(14, 14), color: '#222222', textAlign: 'left' }}>
          {this.state.detialArray.value.bet_info[0].TG}
          </CusBaseText>
        </View>
        {/* {this.on_shifouKaiJiang()}
        {this.on_KaiJiangshijian()} */}
        <View style={{ width: width, height: 25, backgroundColor: 'white', flexDirection: 'row' }}>
          <CusBaseText style={{ marginLeft: 35, fontSize: Adaption.Font(14, 14), color: '#666666', textAlign: 'left' }}>
            投注时间:
        </CusBaseText>
          <CusBaseText style={{ marginLeft: 10, fontSize: Adaption.Font(14, 14), color: '#222222', textAlign: 'left' }}>
          {moment.unix(this.state.detialArray.value.bet_info[0].bet_time/1000).format('YYYY-MM-DD HH:mm:ss')}
          </CusBaseText>
        </View>

        <View style={{ width: width, height: 20, backgroundColor: 'white', alignItems: 'center', flexDirection: 'row' }}>
          <View style={{ marginLeft: 20, width: 6, height: 20, backgroundColor: COLORS.appColor }}>
          </View>
          <CusBaseText style={{ fontSize: Adaption.Font(17, 16), color: '#222222', textAlign: 'left', marginLeft: 5,fontWeight:'500' }}>
            我的投注
        </CusBaseText>
        </View>

           <ImageBackground style={{
                        marginTop: 15,
                        marginLeft: 10,
                        marginRight: 10,
                        height:  Adaption.Height(120),
                        justifyContent:'center'
                    }} source={require('./img/ic_danzhuxiangqing.png')} resizeMode="stretch">
                    <CusBaseText style={{ fontSize: Adaption.Font(18, 17), color: '#222222', textAlign: 'left', marginLeft:20,fontWeight:'500' }}>
                    {this.state.detialArray.value.bet_info[0].play_method}
                    {this.state.detialArray.value.bet_info[0].is_corner==1?<CusBaseText style={{ fontSize: Adaption.Font(16, 15),backgroundColor:'#ff7c34', color: 'white', textAlign: 'center', marginLeft:10,fontWeight:'500' }}>
                         角球数
                    </CusBaseText>:null}
                  </CusBaseText>
                  <CusBaseText style={{ fontSize: Adaption.Font(18, 17), color: '#222222', textAlign: 'left', marginLeft:20,marginTop:10,fontWeight:'500' }}>
                  {h}
                  </CusBaseText>
                 <CusBaseText style={{ fontSize: Adaption.Font(18, 17), color: '#222222', textAlign: 'left', marginLeft:20,marginTop:10,fontWeight:'500'  }}>
                 {this.state.detialArray.value.bet_info[0].bet_content} @<CusBaseText style={{ fontSize: Adaption.Font(18, 17), color: 'red', textAlign: 'left', marginLeft: 5 }}>
                 {this.state.detialArray.value.bet_info[0].new_odds} 
                 </CusBaseText>
                 </CusBaseText>
                        {/* <FlatList
                            style={{marginTop: 14, marginBottom: 20}}
                            renderItem={item => this._renderItemView(item)}
                            data={this.state.dataSource.length != 0 ? this.state.dataSource : null}
                            keyExtractor={this._keyExtractor}
                        >
                        </FlatList> */}
                    </ImageBackground>

        {/* <View style={{ width: width, height: 100, backgroundColor: 'white', alignItems: 'center', flexDirection: 'row' }}> */}
          {/* <CusBaseText style={{ fontSize: Adaption.Font(14, 14), color: '#222222', textAlign: 'left', marginLeft: width / 8,marginTop:5 }}>
            {this.state.detialArray.value.xiangqing}
          </CusBaseText> */}
        {/* </View> */}
        {/* {this.onZaiLaiYiZhu()} */}
          <LoadingView ref = 'LoadingView'/>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  cellStyle: {
    width: width,
    height: 115,
    marginVertical: 15, // cell垂直之间的间隔
    flexDirection: 'row',
  },
  itemViewStyle: {
    height: 115,
    width: width - 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cdcdcd',
    backgroundColor: 'white'

  },
  itemTextStyke: {
    marginTop: 5,
    fontSize: 13,
    color: '#222222',
    marginLeft: 10,
    width: width - 100,
  },

});
