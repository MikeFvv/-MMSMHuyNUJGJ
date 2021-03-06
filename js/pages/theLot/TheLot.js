import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Dimensions,
  NetInfo,
  ImageBackground,
} from 'react-native';

import moment from 'moment';
import TheStyles from './TheLotStyles';
import { CachedImage, ImageCache } from "react-native-img-cache";
import BaseNetwork from '../../skframework/component/BaseNetwork';
import AllImg from "./TheLotStyleImg";



const { width, height } = Dimensions.get('window');
const KAdaptionWith = width / 414;
const KAdaptionHeight = height / 736;

const blankWidth = 4 * KAdaptionWith; //间距
const circleWidth = 28 * KAdaptionWith; //圆大小

export default class TheLot extends Component {

    static navigationOptions = ({navigation, screenProps}) => ({
        tabBarOnPress: (({route, index}, jumpToIndex) => {
            // 只有调用jumpToIndex方法之后才会真正的跳转页面
            jumpToIndex(index);
            // console.log(route);
            navigation.state.params && navigation.state.params.tabBarPress ? navigation.state.params.tabBarPress() : null;
        }),
        //transparent
        header: (
            <View style={{
              width: SCREEN_WIDTH, 
              height: (SCREEN_HEIGHT == 812 ? 88 : 64), 
              flexDirection: 'row',
              backgroundColor:COLORS.appColor
            }}>

              <View style={{
                  width: SCREEN_WIDTH - 173 / 3.0 - 10,
                  backgroundColor: 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center'
              }}>
                <CusBaseText style={{
                    color: 'white',
                    fontSize: 18,
                    marginLeft: 80,
                    marginTop: (SCREEN_HEIGHT == 812 ? 40 : 20)
                }}>开奖大厅</CusBaseText>
              </View></View>
        ),
    });

    constructor(props) {
      super(props);
      this.state = {
        dataList: [], //大厅数据
        isNoNetwork: false,   // true = 无网络， false 有网络
        refreshing: true,
      }
       this.lineReplace = 0; //线路替换
    }

  componentDidMount() {
    //接受登录的通知
    this.subscription = PushNotification.addListener('Alllottery', () => {
      this._fetchPreferentialData();
    });
    //检测网络是否连接
    NetInfo.isConnected.fetch().then(isConnected => {
      // this.setState({ isConnected });
    });
    //监听网络链接变化事件
    NetInfo.isConnected.addEventListener('connectionChange', this._handleIsConnectedChange);
    //this.getValue()
    UserDefalts.getItem("TheLotCaiZhongObjcet", (error, result) => {
      if (!error) {
        if (result !== '' && result !== null) {
          this._fetchPreferentialData();
          // let TheLotModel = JSON.parse(result);
          // this.setState({
          //   dataList: TheLotModel.TheLotCaiZhongArray, refreshing: false
          // });
          
          setTimeout(() => {
            this._fetchPreferentialData();

          }, 100000);
        } else {
       this._fetchPreferentialData();
        }
      }
    });


    this.timer = setInterval(() => {
      this._fetchPreferentialData();
    }, 100000);

  }

  // 网络监听方法
  _handleIsConnectedChange = (isConnected) => {
    // 网络有变化时请求一遍数据
    if (isConnected) {
      this._fetchPreferentialData();

      if (this.state.isNoNetwork == true) {
        this.setState({
          isNoNetwork: false,
        });
      }

    } else {

      UserDefalts.getItem("TheLotCaiZhongObjcet", (error, result) => {
        if (!error) {
          if (result !== '' && result !== null) {

            // let TheLotModel = JSON.parse(result);
            // this.setState({
            //   dataList: TheLotModel.TheLotCaiZhongArray,

            // });
          } else {
            this.setState({
              isNoNetwork: true,
            });
          }
        } else {
          this.setState({
            isNoNetwork: true,
          });
        }
      });
    }
  }

  //移除通知
  componentWillUnmount() {
    //移除监听
    NetInfo.isConnected.removeEventListener('connectionChange', this._handleIsConnectedChange);
    if (typeof (this.subscription) == 'object') {
      this.subscription && this.subscription.remove();
    }
    this.timer && clearTimeout(this.timer);
  }

  //获取开奖大厅的数据（每个彩种的信息）
  _fetchPreferentialData() {
    //请求参数
    let params = new FormData();
    params.append("ac", "getKjCpLog");
    params.append("pcount", "3");
    var promise = GlobalBaseNetwork.sendNetworkRequest(params);
    promise
      .then(response => {
        if (response.msg == 0) {
          let listArray = response.data;
          if (listArray && listArray.length > 0) {

            for (let i = listArray.length - 1; i >= 0; i--) {
                for (let j = 0; j < listArray.length; j++) {
                    let dic = listArray[j];
                    if (listArray[i] == dic['game_id']) {
                      listArray.splice(j, 1);  // 删除
                      listArray.splice(0, 0, dic); // 添加到第一位
                        break;
                    }
                }
            }

            this.setState({dataList: listArray, refreshing: false,})
            let thelotObjcet = { TheLotCaiZhongArray:listArray}

            let TheLotCaizhongValue = JSON.stringify(thelotObjcet);
            let key = 'TheLotCaiZhongObjcet';
          UserDefalts.setItem(key, TheLotCaizhongValue, (error) => {
             if (!error) {
             }
          });

          }
        } else {
          this.refs.LoadingView && this.refs.LoadingView.showFaile(response.param ? response.param : '');
        }
      })
      .catch(err => {
        if (err && typeof(err) === 'string' && err.length > 0) {
          this.refs.LoadingView && this.refs.LoadingView.showFaile(err);
      }
      });
  }

      //无网络页面
      _noNetworkComponent() {
        return (
          <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, justifyContent: 'center', alignItems: 'center', marginTop: -80, }}>
            <Image resizeMode={'stretch'} style={{ width: 166.5, height: 166.5 }} source={LocalImgs.ic_noNetwork} />
            <CusBaseText style={{ textAlign: 'center', marginTop: 5 }}>当前网络不可用，请检查你的网络设置</CusBaseText>
          </View>
        );
      }
      renderCell = (item) => {
        const { navigate } = this.props.navigation;
        return (
          <TouchableOpacity activeOpacity={1}
            onPress={() => navigate('TheLotDatail', { callback: () => { this._fetchPreferentialData() }, tag: item.item.tag, gameName: item.item.game_name, 
            js_tag: item.item.js_tag,
            selectedGameID:item.item.gameid,btonQishu:item.item.prev[0].qishu},)}>
            <OpenCell
              value={item.item}>
            </OpenCell>
          </TouchableOpacity>
        )
      }

      // 下拉刷新触发
      handleRefresh = () => {
        this._fetchPreferentialData();
      };

      _keyExtractor = (item,index) => {
        return String(index);
        }
  //程序入口
  render() {
    return (
      this.state.dataList.length > 0 ?
        <View style={TheStyles.container}>
          {this.state.isNoNetwork ? this._noNetworkComponent() : null}
          <FlatList
            automaticallyAdjustContentInsets={false}
            alwaysBounceHorizontal={false}
            showsVerticalScrollIndicator={false} //不显示右边滚动条
            renderItem={item => this.renderCell(item)}
            data={this.state.dataList}
            refreshing={false}
            onRefresh={this.handleRefresh}
            keyExtractor={this._keyExtractor}
          />
          <LoadingView ref='LoadingView' />

        </View> : <View >
          <Image
            source={AllImg.isNetwork}
            style={{ resizeMode: 'stretch', width: width, height: height - 49 - 64 }}
          />
          <ActivityIndicator
            animating={true}
            style={{ height: 80, position: 'absolute', left: width / 2 - 18, top: height / 2 - 80 }}
            color='#d3d3d3'
            size="large"
          />
        </View>
    );
  }

}


class OpenCell extends Component {

  constructor(props) {
    super(props);
    this.state = {
      backupCpicon: false,//是否启用备用彩种地址
    };
  }

  render() {

    let imageBall = this.props.value.prev.length > 0 ? (this.props.value.prev[0].balls == undefined ? "" : this.props.value.prev[0].balls) : "";
    return (
      <View style={TheStyles.cellStyle}>
        <View style={{ flex: 0.15, marginTop: 22, marginLeft: 10 }}>
          <CachedImage  source={{
              uri:this.props.value.icon,
              cache: 'force-cache'
            }} style={TheStyles.imgUrlSize}></CachedImage>
        </View>
        <View style={{ flex: 0.85, justifyContent: 'center', marginLeft: 17 }}>
          <CusBaseText allowFontScaling={false} style={{ fontSize: Adaption.Font(17, 15), }}>{this.props.value.game_name == undefined ? '' : this.props.value.game_name}</CusBaseText>
          <View style={{ width: width - 40, height: 35 * KAdaptionHeight, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ flex: 0.81 }}>
              {imageBall != '' ? this._kspksAllViewUI(this.props.value) : this._kspksText()}
            </View>
            <View style={{ flex: 0.19, }}>
              <Image style={{ width: 22, height: 22,marginTop:3}} source={AllImg.rightArrowImg}></Image>
            </View>

          </View>
          <View style={{ width: width - 40, height: 20 * KAdaptionHeight, flexDirection: 'row', marginTop: 5 }}>
            <View style={{ flex: 0.5 }}>
              <CusBaseText allowFontScaling={false} style={{ marginTop: 3, color: 'gray', fontSize: Adaption.Font(15, 13) }}>{this.props.value.prev.length > 0 ? '第' + this.props.value.prev[0].qishu + '期' : ''}</CusBaseText>
            </View>
            <View style={{
              flex: 0.5, marginTop: 3 * KAdaptionHeight, alignItems: 'center',
              justifyContent: 'center',
            }}>
              <CusBaseText allowFontScaling={false} style={{ color: 'gray', fontSize: Adaption.Font(12, 10), backgroundColor: 'rgba(0,0,0,0)', marginTop: 3 * KAdaptionHeight, marginRight: 42 * KAdaptionWith, textAlign: 'right' }} >
                {this.props.value.prev.length > 0 ? (moment.unix(this.props.value.prev.length > 0 ? this.props.value.prev[0].opentime : "1979-00-00 00:00:00").format('YYYY-MM-DD HH:mm')) : ''}</CusBaseText>
            </View>
          </View>
        </View>
      </View>
    )
  }

  _kspksText() {
    return (
      <View style={{ marginTop: 5 * KAdaptionHeight }}>
        <CusBaseText allowFontScaling={false} style={{ color: 'gray', fontSize: Adaption.Font(17, 15) }}>
          正在开奖.....
       </CusBaseText>
      </View>
    )
  }

  //判断是否是K3、PCDD 和其他彩种的 数据渲染界面
  _kspksAllViewUI(value) {
   
    if (value.prev[0] == undefined) { return; }
    let string = value.prev[0].balls;
    if (string == undefined) { return; }
    let allBalls = [];

    if (string.length > 0) {
      allBalls = string.split('+');
    }else{
      return;
    }



    if (value.js_tag == 'pcdd') {
      return (
        <View style={TheStyles.roundSizeView}>
          {this._pcddTextViews(allBalls)}
        </View>
      )
    } else if (value.js_tag == 'k3') {
      return (
        <View style={[TheStyles.k3BallView, TheStyles.k3BallImage]}>
          {this._Imgviews(allBalls)}
        </View>
      )

    } else if (value.js_tag == 'xync'){
      return (
        <View style={[TheStyles.k3BallView, TheStyles.k3BallImage]}>
       { this._fruitSvegetables(allBalls)} 
       </View>
      )

    } else if (value.js_tag == 'tzyx'){

        return (
        <View style={[TheStyles.k3BallView, TheStyles.k3BallImage]}>
        { this._tzyxTiZiView(allBalls)} 
       </View>
      )

    }else if (value.js_tag == 'xypk'){
      return (
        <View style={{flexDirection: 'row',}}>
        { this._xingyunPK(allBalls)} 
       </View>
      )

    }else if (value.js_tag == 'lhc') {
      return (
        <View style={TheStyles.roundSizeView}>
          {this._viewslhc(allBalls)}
        </View>
      )

    } else if (value.js_tag == 'pk10' ||value.js_tag == 'pkniuniu') {
      return (
        <View style={TheStyles.roundSizeView}>
          {this._pk10View(allBalls)}
        </View>
      )
    } else {
      return (
        <View style={TheStyles.roundSizeView}>
          {this._otherViews(allBalls)}
        </View>
      )
    }
  }



  _tzyxTiZiView(allBalls){
             
    let ladderCount = parseInt(allBalls[1],10) == 0 ? '3' : '4';

    let  leftRight = parseInt(allBalls[0],10) == 0 ? '左' :'右';
    let  singleStr = parseInt(allBalls[2],10) == 0 ? '单' :'双';
    let  singleStrColor = parseInt(allBalls[2],10) != 0 ? '#00a0e9' :'#e33939';
    
    return (
      <View style={{flexDirection: 'row',}}>
     
       <View style = {{ width: 35*KAdaptionWith,
            height: 35*KAdaptionWith,backgroundColor:'#dcdcdc', borderRadius:35*KAdaptionWith * 0.5,}}>
              <CusBaseText style={[TheStyles.textRound,{color:'#626262',marginTop:6* KAdaptionWith}]}>
                {leftRight}
              </CusBaseText>
            </View>

             <View style = {{ width: 35*KAdaptionWith,
            height: 35*KAdaptionWith,backgroundColor:'#626262', borderRadius:35*KAdaptionWith * 0.5,marginLeft:15* KAdaptionWith}}>
              <CusBaseText style={[TheStyles.textRound,{color:'white',marginTop:6* KAdaptionWith}]}>
                {ladderCount}
              </CusBaseText>
            </View>

             <View style = {{ width: 35*KAdaptionWith,
            height: 35*KAdaptionWith,backgroundColor:singleStrColor, borderRadius:35*KAdaptionWith * 0.5,marginLeft:15* KAdaptionWith}}>
              <CusBaseText style={[TheStyles.textRound,{color:'white',marginTop:6}]}>
                {singleStr}
              </CusBaseText>
            </View>

      </View>
    );
  }

  _fruitSvegetables(allBalls){

      var viewArr = [];
      for (var i = 0; i < allBalls.length; i++) {
        viewArr.push(
          <View key={i} style={{ flexDirection: 'row',marginLeft:4* KAdaptionWith }}>
          <View  style ={TheStyles.Pk10BallView}>
            <Image style={{height:30,width:30}} source={AllImg.lucky_ballArray[parseInt(allBalls[i]) - 1]}></Image>
          </View>
          </View>
        );
      }
      return viewArr;
  }

  //幸运扑克
  _xingyunPK(allBalls){
   
   let imgPk1= ''; let imgPK2= ''; let imgPK3= ''; let xyViewPk10 = [];

   for (let i = 0 ; i < allBalls.length; i++){

       let ballText = parseInt(allBalls[i], 10);
       let numText = parseInt((ballText/4) + 1);
       let numColorIdx = (ballText%4);
       let numAllArr = [];

       switch (numText){
           case 1:
           numAllArr = AllImg.pokerAImgArr;
               break;
           case 2:
           numAllArr = AllImg.poker2ImgArr;
               break;
           case 3:
           numAllArr = AllImg.poker3ImgArr;
               break;
           case 4:
           numAllArr = AllImg.poker4ImgArr;
               break;
           case 5:
           numAllArr = AllImg.poker5ImgArr;
               break;
           case 6:
           numAllArr = AllImg.poker6ImgArr;
               break;
           case 7:
           numAllArr = AllImg.poker7ImgArr;
               break;
           case 8:
           numAllArr = AllImg.poker8ImgArr;
               break;
           case 9:
           numAllArr = AllImg.poker9ImgArr;
               break;
           case 10:
           numAllArr = AllImg.poker10ImgArr;
               break;
           case 11:
           numAllArr = AllImg.pokerJImgArr;
               break;
           case 12:
           numAllArr = AllImg.pokerQImgArr;
               break;
           case 13:
           numAllArr = AllImg.pokerKImgArr;
               break;
           default:
               break;
       }

       switch (i){
           case 0:
               imgPk1 = numAllArr[numColorIdx];
               break;
           case 1:
               imgPk2 = numAllArr[numColorIdx];
               break;
           case 2:
               imgPk3 = numAllArr[numColorIdx];
               break;
           default:
               break;
       }
   }

   xyViewPk10 = <View style = {{flexDirection:'row',marginTop:10}}>
                            <Image style = {{width:35,height:35,resizeMode:'contain'}} source = {imgPk1}/>
                            <Image style = {{width:35,height:35, marginLeft:3, resizeMode:'contain'}} source = {imgPk2}/>
                            <Image style = {{width:35,height:35, marginLeft:3, resizeMode:'contain'}} source = {imgPk3}/>     
      </View>
    return xyViewPk10;

  }

  //PC蛋蛋的布局
  _pcddTextViews(allBalls) {

      var viewArr = [];
      for (var i = 0; i < allBalls.length; i++) {
        var str = '';
        if (i == allBalls.length - 2) {
          str = '=';
        } else if (i < allBalls.length - 2) {
          str = '+';
        } else {
          str = '';
        }

        if (i == allBalls.length - 1) {
          viewArr.push(
            <View key={i}>
              {this._pcDDViews(allBalls[i])}
            </View>
          );
        } else {
          viewArr.push(
            <View key={i} style={TheStyles.roundView}>
              <ImageBackground style={{
                width: 35*KAdaptionWith,
                height: 35*KAdaptionWith,
              }} resizeMode='cover' source={require('../buyLot/buyLotDetail/touzhu2.0/img/ic_buyLot_newballs.png')}>
                <CusBaseText allowFontScaling={false} style={TheStyles.textRound}>{allBalls[i]}</CusBaseText>
              </ImageBackground>
              <CusBaseText allowFontScaling={false} style={{ fontSize: 20, marginLeft: 3 * KAdaptionWith }}>{str}</CusBaseText>
            </View>
          );
        }
      }
      return viewArr;
    
  }


  // 快三图片
  _Imgviews(allBalls) {
      var viewArr = [];
      for (var i = 0; i < allBalls.length; i++) {
        viewArr.push(
          <View key={i} style={{ marginLeft:2 * KAdaptionWith }} >
            <Image style={TheStyles.imagSize} source={AllImg.imgArrk3[parseInt(allBalls[i]) - 1]}></Image>
          </View>
        );
      }
      return viewArr;
  }

  // 其他彩中的调用
  _otherViews(allBalls) {
      var viewArr = [];
      for (var i = 0; i < allBalls.length; i++) {
        viewArr.push(
          <View key={i} style={TheStyles.roundView}>
            <ImageBackground style={{
              width: 35*KAdaptionWith,
              height: 35*KAdaptionWith,
            }} resizeMode='cover' source={require('../buyLot/buyLotDetail/touzhu2.0/img/ic_buyLot_newballs.png')}>
              <View>
                <CusBaseText style={TheStyles.textRound}>
                  {allBalls[i]}
                </CusBaseText>
              </View>
            </ImageBackground>
          </View>);
      }
      return viewArr;
  }

  //六合彩
  _viewslhc(allBalls) {
      var viewArr = [];
      for (var i = 0; i < allBalls.length; i++) {
        viewArr.push(
          <View key={i} style={TheStyles.roundView}>
            {this._lhcView(allBalls[i])}
          </View>
        );
      }
      return viewArr;
  }

  _lhcView(i) {
    var selectColor = '#e6374e';
    var default_color = {
      red: { color: '#e6374e', balls: ['01', '02', '07', '08', '12', '13', '18', '19', '23', '24', '29', '30', '34', '35', '40', '45', '46'] },
      blue: { color: '#1b82e8', balls: ['03', '04', '09', '10', '14', '15', '20', '25', '26', '31', '36', '37', '41', '42', '47', '48'] },
      green: { color: '#38b06e', balls: ['05', '06', '11', '16', '17', '21', '22', '27', '28', '32', '33', '38', '39', '43', '44', '49'] }
    }

    for (var b in default_color) {
      let ballAr = default_color[b].balls;
      if (ballAr.includes(i)) {
        selectColor = default_color[b].color;
        break;
      }
    }

    return (
      <View key={i} style={[TheStyles.roundView, TheStyles.colorRoundView, { backgroundColor: selectColor }]}>
        <Text allowFontScaling={false} style={TheStyles.textRoundWhite}>{i}</Text>
      </View>
    )
  }

  // PK拾
  _pk10View(allBalls) {
      var viewArr = [];
      for (var i = 0; i < allBalls.length; i++) {
        viewArr.push(
          <View key={i} style={TheStyles.roundView}>
            {this._pk10ColorView(allBalls[i])}
          </View>
        );
      }
      return viewArr;
  }

  _pk10ColorView(i) {
    let colorArr = ['#E5E500', '#2A64AE', '#949695', '#F29535', '#7DCBDF', '#2C489C', '#CBCBCB', '#e6374e', '#421E20', '#4FB233'];
    return (
      <View key={i} style={{ flexDirection: 'row' }}>
        <View style={[TheStyles.Pk10BallView, { backgroundColor: colorArr[parseInt(i) - 1] }]}>
          <CusBaseText allowFontScaling={false} style={TheStyles.textRoundWhite}>
            {i}
          </CusBaseText>
        </View>
      </View>
    )
  }

  //PC蛋蛋
  _pcDDViews(i) {
    let isIphoneX = SCREEN_HEIGHT == 812 ? true : false;  //是否为iphoneX
    let heightS = 30*KAdaptionWith;
    switch (i) {
      case "0":
      case "13":
      case "14":
      case "27":
        return (
          <View style={{ backgroundColor: '#707070',marginTop: isIphoneX ? 2 : 0, marginLeft: 2 * KAdaptionWith,
          marginRight: 0,
          width: heightS,
          height: heightS,
          borderRadius:heightS * 0.5,   // 四边的框宽
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'red',
          }}>
            <CusBaseText style={TheStyles.textRoundWhite}>{i}</CusBaseText>
          </View>
        );
        break;

      default:
        let colorArr1 = ['#e6374e', '#32b16c', '#00a0ea'];
        return (
          <View style={{ backgroundColor: colorArr1[parseInt(i) % 3],marginTop: isIphoneX ? 2 : 0,
            marginLeft: 2 * KAdaptionWith,
            marginRight: 0,
            width: heightS,
            height: heightS,
            borderRadius: heightS * 0.5,   // 四边的框宽
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'red',
          }}>
            <CusBaseText style={TheStyles.textRoundWhite}>{i}</CusBaseText>
          </View>
        );
    }
  }

}