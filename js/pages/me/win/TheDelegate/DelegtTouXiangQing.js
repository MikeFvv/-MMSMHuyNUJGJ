import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Platform,
  Alert,
  Dimensions,
  ScrollView
} from "react-native";
const { width, height } = Dimensions.get("window");
const KAdaptionWith = width / 414;
import Adaption from "../../../../skframework/tools/Adaption";//字体适配
export default class DelegtTouXiangQing extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: '详情',

      headerStyle: {backgroundColor: COLORS.appColor, marginTop: Android ?(parseFloat(global.versionSDK) > 19?StatusBar.currentHeight:0) : 0},


    headerTitleStyle: { color: 'white' },
    headerLeft: (
            <TouchableOpacity
                activeOpacity={1}
                style={GlobalStyles.nav_headerLeft_touch}
                onPress={() => { navigation.goBack() }}>
                <View style={GlobalStyles.nav_headerLeft_view} />
            </TouchableOpacity>
        ),

  });

  constructor(props) {
    super(props);
    this.state = {
      detialArray: {}, //详情数据
      backupCpicon:false,
    };
  }
  componentWillMount() {
    this.setState({
      detialArray: this.props.navigation.state.params.detialArray,
    })
  }
  //头部视图
  _createHeaderView() {
    //判断该订单状态是否为已撤单
    let phaseLable = '';
    let notWingLable = '';

    let kaijiang = '';
    if (this.state.detialArray.value.status == "0" || this.state.detialArray.value.status == "1") {
      phaseLable = '待开奖';
      notWingLable = '待开奖';
    } else if (this.state.detialArray.value.status == "2" &&this.state.detialArray.value.win==0) {
      if(this.state.detialArray.value.game_name.includes('28')){
        let ballsArr = this.state.detialArray.value.kj_balls.split(' ');
        ballsArr.splice(1, 0, '+');
        ballsArr.splice(3, 0, '+');
        ballsArr.splice(5, 0, '=');
        phaseLable = ballsArr.join(' ');
      }else {
      phaseLable = this.state.detialArray.value.kj_balls;
      }
      notWingLable = '未中奖';
    } else if (this.state.detialArray.value.status == "4") {
      phaseLable = '';
      notWingLable = '已撤单';
    } else if (this.state.detialArray.value.status == "2" &&this.state.detialArray.value.win>0) {
      if(this.state.detialArray.value.game_name.includes('28')){
        let ballsArr = this.state.detialArray.value.kj_balls.split(' ');
        ballsArr.splice(1, 0, '+');
        ballsArr.splice(3, 0, '+');
        ballsArr.splice(5, 0, '=');
        phaseLable = ballsArr.join(' ');
      }else {
      phaseLable = this.state.detialArray.value.kj_balls;
      }
      notWingLable = '已中奖,赢' + this.state.detialArray.value.win + '元';
    }


    return (
      <View style={{ width: width, height: 90, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
        <View style={{ flex: 0.2 }}>
          <Image style={{ width: 60*KAdaptionWith, height: 60*KAdaptionWith, marginLeft: 15 }}
            source={{uri:this.state.detialArray.value.icon}}
           >
          </Image>
        </View>
        <View style={{ flex: 0.8, flexDirection: 'column', justifyContent: 'center', marginLeft: 10 }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <CusBaseText style={{ fontSize: Adaption.Font(17, 16), color: '#222222', textAlign: 'left' }}>
              {this.state.detialArray.value.game_name}
            </CusBaseText>
            <CusBaseText style={{ fontSize: Adaption.Font(15, 14), color: 'rgb(133,134,135)', textAlign: 'left', marginLeft: 13 }}>
              第{this.state.detialArray.value.qishu}期
            </CusBaseText>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <CusBaseText style={{ fontSize: Adaption.Font(15, 14), color: 'gray', textAlign: 'left' }}>
              开奖号码:
            </CusBaseText>
            <CusBaseText style={{ fontSize: Adaption.Font(14, 13), color: 'red', textAlign: 'left', marginLeft: 8 }}>
              {phaseLable}
            </CusBaseText>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <CusBaseText style={{ fontSize: Adaption.Font(15, 14), color: 'rgb(0,109,0)', textAlign: 'left' }}>
              {notWingLable}
            </CusBaseText>
          </View>
        </View>
      </View>
    )
  }

  //是否开奖
  on_shifouKaiJiang() {
    let kaijiang = '';
    if (this.state.detialArray.value.status == "0" || this.state.detialArray.value.status == "1") {
      kaijiang = '待开奖';
    } else if (this.state.detialArray.value.status == "2" && this.state.detialArray.value.win==0) {
      kaijiang = '未中奖';
    } else if (this.state.detialArray.value.status == "4") {
      kaijiang = '已撤单';
    } else if (this.state.detialArray.value.status == "2" && this.state.detialArray.value.win>0) {
      kaijiang = '已中奖';
    }

    return (
      <View style={{ width: width, height: 25, backgroundColor: 'white', flexDirection: 'row' }}>
        <CusBaseText style={{ marginLeft: 40, fontSize: Adaption.Font(14, 14), color: '#666666', textAlign: 'left' }}>
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
    if (this.state.detialArray.value.status == "0" || this.state.detialArray.value.status == "1") {
        kaijiangshijian = '--';
    } else if (this.state.detialArray.value.status == "3") {
      kaijiangshijian = this.state.detialArray.value.js_time;
    } else if (this.state.detialArray.value.status == "4") {
      kaijiangshijian = '--';
    } else if (this.state.detialArray.value.status == "2") {
      kaijiangshijian = this.state.detialArray.value.js_time;
    }

    return (
      <View style={{ width: width, height: 25, backgroundColor: 'white', flexDirection: 'row' }}>
        <CusBaseText style={{ marginLeft: 40, fontSize: Adaption.Font(14, 14), color: '#666666', textAlign: 'left' }}>
          开奖时间:
   </CusBaseText>
        <CusBaseText style={{ marginLeft: 10, fontSize: Adaption.Font(14, 14), color: '#222222', textAlign: 'left' }}>
          {kaijiangshijian}
        </CusBaseText>
      </View>
    )
  }



  render() {
    const { navigate } = this.props.navigation;
    return (
      <ScrollView style={styles.container}
        automaticallyAdjustContentInsets={false}
        alwaysBounceHorizontal={false}
      >
        {this._createHeaderView()}
        <View style={{ width: width, height: 1.5, backgroundColor: '#eeeeee' }}>
        </View>

        <View style={{ width: width, height: 40, backgroundColor: 'white', alignItems: 'center', flexDirection: 'row' }}>
          <View style={{ marginLeft: width / 8 - 15, width: 6, height: 20, backgroundColor: COLORS.appColor }}>
          </View>
          <CusBaseText style={{ fontSize: Adaption.Font(17, 16), color: '#222222', textAlign: 'left', marginLeft: 5 }}>
            订单内容
        </CusBaseText>
        </View>

        <View style={{ width: width, height: 25, backgroundColor: 'white', flexDirection: 'row' }}>
          <CusBaseText style={{ marginLeft: 40, fontSize: Adaption.Font(14, 14), color: '#666666', textAlign: 'left' }}>
            订  单  号:
        </CusBaseText>
          <CusBaseText style={{ marginLeft: 10, fontSize: Adaption.Font(14, 14), color: '#222222', textAlign: 'left' }}>
            {this.state.detialArray.value.zhudan}
          </CusBaseText>
        </View>

        <View style={{ width: width, height: 25, backgroundColor: 'white', flexDirection: 'row' }}>
          <CusBaseText style={{ marginLeft: 40, fontSize: Adaption.Font(14, 14), color: '#666666', textAlign: 'left' }}>
            投注金额:
        </CusBaseText>
          <CusBaseText style={{ marginLeft: 10, fontSize: Adaption.Font(14, 14), color: '#222222', textAlign: 'left' }}>
            {this.state.detialArray.value.price}
          </CusBaseText>
        </View>

        <View style={{ width: width, height: 25, backgroundColor: 'white', flexDirection: 'row' }}>
          <CusBaseText style={{ marginLeft: 40, fontSize: Adaption.Font(14, 14), color: '#666666', textAlign: 'left' }}>
            投注注数:
        </CusBaseText>
          <CusBaseText style={{ marginLeft: 10, fontSize: Adaption.Font(14, 14), color: '#222222', textAlign: 'left' }}>
            {this.state.detialArray.value.zhushu}
          </CusBaseText>
        </View>

        {/* <View style={{ width: width, height: 25, backgroundColor: 'white', flexDirection: 'row' }}>
          <CusBaseText style={{ marginLeft: 49, fontSize: Adaption.Font(14, 14), color: '#666666', textAlign: 'left' }}>
            投注返点:
        </CusBaseText>
          <CusBaseText style={{ marginLeft: 10, fontSize: Adaption.Font(14, 14), color: '#222222', textAlign: 'left' }}>
            {this.state.detialArray.value.fandian}
          </CusBaseText>
        </View> */}

        <View style={{ width: width, height: 25, backgroundColor: 'white', flexDirection: 'row' }}>
          <CusBaseText style={{ marginLeft: 40, fontSize: Adaption.Font(14, 14), color: '#666666', textAlign: 'left' }}>
            投注赔率:
        </CusBaseText>
          <CusBaseText style={{ marginLeft: 10, fontSize: Adaption.Font(14, 14), color: '#222222', textAlign: 'left' }}>
            1 : {this.state.detialArray.value.peilv}
          </CusBaseText>
        </View>

        <View style={{ width: width, height: 25, backgroundColor: 'white', flexDirection: 'row' }}>
          <CusBaseText style={{ marginLeft: 40, fontSize: Adaption.Font(14, 14), color: '#666666', textAlign: 'left' }}>
            投注时间:
        </CusBaseText>
          <CusBaseText style={{ marginLeft: 10, fontSize: Adaption.Font(14, 14), color: '#222222', textAlign: 'left' }}>
            {this.state.detialArray.value.tz_time}
          </CusBaseText>
        </View>
        {this.on_shifouKaiJiang()}
        {this.on_KaiJiangshijian()}
        <View style={{ width: width, height: 25, backgroundColor: 'white', flexDirection: 'row' }}>
          <CusBaseText style={{ marginLeft: 40, fontSize: Adaption.Font(14, 14), color: '#666666', textAlign: 'left' }}>
            玩法名称:
        </CusBaseText>
          <CusBaseText style={{ marginLeft: 10, fontSize: Adaption.Font(14, 14), color: '#222222', textAlign: 'left' }}>
            {this.state.detialArray.value.wanfa}
          </CusBaseText>
        </View>

        <View style={{ width: width, height: 20, backgroundColor: 'white', alignItems: 'center', flexDirection: 'row' }}>
          <View style={{ marginLeft: width / 8 - 15, width: 6, height: 20, backgroundColor: COLORS.appColor }}>
          </View>
          <CusBaseText style={{ fontSize: Adaption.Font(17, 16), color: '#222222', textAlign: 'left', marginLeft: 5 }}>
            投注号码
        </CusBaseText>
        </View>

        <View style={{ width: width, height: 50, backgroundColor: 'white', alignItems: 'center', flexDirection: 'row' }}>
          <CusBaseText style={{ fontSize: Adaption.Font(14, 14), color: '#222222', textAlign: 'left', marginLeft: width / 8 }}>
            {this.state.detialArray.value.xiangqing}
          </CusBaseText>
        </View>
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
