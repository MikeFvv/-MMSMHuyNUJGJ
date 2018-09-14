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
  Alert,
    StatusBar,
  Dimensions,
  Modal,
  TextInput,
  ImageBackground
} from "react-native";
const { width, height } = Dimensions.get("window");
const KAdaptionWith = width / 414;
const KAdaptionHeight = height / 736;

import Adaption from "../../../skframework/tools/Adaption";//字体适配
import BaseNetwork from "../../../skframework/component/BaseNetwork"; //网络请求
export default class RedPacketView extends Component {
  static navigationOptions = ({ navigation }) => ({

      header: (
          <CustomNavBar
              centerText = {"红包活动"}
              leftClick={() =>  navigation.goBack() }
          />
      ),

     // title:'红包活动',
     //  headerStyle: {backgroundColor: COLORS.appColor, marginTop: Android ?(parseFloat(global.versionSDK) > 19?StatusBar.currentHeight:0) : 0},
     // headerTitleStyle:{color:'white'},
     // headerLeft: (
     //        <TouchableOpacity
     //            activeOpacity={1}
     //            style={GlobalStyles.nav_headerLeft_touch}
     //            onPress={() => { navigation.goBack() }}>
     //            <View style={GlobalStyles.nav_headerLeft_view} />
     //        </TouchableOpacity>
     //    ),

  });

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true, //网络请求状态
      error: false,
      errorInfo: "",
      uid:'',
      token:'',
      redPacketArray:[], //红包活动数据
      isShowReceiveRedEnvelope:false,
      showRedEnvelopeArray:[],
        countDownTime: '00:00:00',
    };
    this.indexTime = 0;
  }

  componentDidMount() {
      this._fetchRedPacketData();
        this._changeTime();

  }
  //销毁定时器
  componentWillUnmount() {
      this.timer && clearInterval(this.timer);
  }

  //获取红包活动数据
  _fetchRedPacketData() {

        //请求参数
        let params = new FormData();
        params.append("ac", "getGameEventGiftList");
        params.append("uid", global.UserLoginObject.Uid);
        params.append("token", global.UserLoginObject.Token);

        var promise = BaseNetwork.sendNetworkRequest(params);

        promise
          .then(response => {
            if (response.msg==0) {
              let datalist = response.data;
            if (datalist&&datalist.length>0) {
              let dataBlog = [];
              let i = 0;

              datalist.map(dict => {
                dataBlog.push({ key: i, value: dict });
                i++;
              });
              //用set去赋值
              this.setState({redPacketArray: dataBlog,isLoading: false,});

              datalist = null;
              dataBlog = null;
            }
            }else {
            NewWorkAlert(response.param);
            }
          })
          .catch(err => { });
  }

  //请求数据的圈圈
  renderLoadingView() {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          animating={true}
          style={{
            height: 80
          }}
          color="red"
          size="large"
        />
      </View>
    );
  }
  //请求错误
  renderErrorView(error) {
    return (
      <View style={styles.container}>
        <CusBaseText>Fail:{error}</CusBaseText>
      </View>
    );
  }


_itemHongBao(item) {
  if (item.item.value.is_can_get==1) {
    return(
      <View style = {{height:100,width:width-30-20,flexDirection:'row',backgroundColor:'#f69d46',marginTop:10,padding:10}}>
         <Image style = {{width:50,height:60,marginTop:15,marginLeft:15}} source={require("././img/ic_hongbaoguan.png")}></Image>
         <View style = {styles.itemBGView}>
            <CusBaseText style = {styles.itemTextChong}>
              单笔充值满{item.item.value.event_param}元
            </CusBaseText>
            <View style = {styles.itemShengView}>
               <CusBaseText style = {{fontSize:15,color:'white',textAlign:'center',fontWeight:'500'}}>
                 还剩余
               </CusBaseText>
               <CusBaseText style = {{fontSize:18,color:'#feed38',textAlign:'center',fontWeight:'500'}}>
                 {item.item.value.yu_sheng}
               </CusBaseText>
               <CusBaseText style = {{fontSize:15,color:'white',textAlign:'center',fontWeight:'500'}}>
                个红包没领
               </CusBaseText>
            </View>
         </View>
      </View>
    );
  }else {
    return(
      <View style = {{height:100,width:width-30-20,flexDirection:'row',backgroundColor:'#9d9d9d',marginTop:10}}>
          <Image style = {{width:50,height:60,marginTop:15,marginLeft:15}} source={require("././img/ic_hongbaohui.png")}></Image>
          <View style = {styles.itemBGView}>
             <CusBaseText style = {styles.itemTextChong}>
              单笔充值满{item.item.value.event_param}元
             </CusBaseText>
             <View style = {styles.itemShengView}>
                <CusBaseText style = {{fontSize:15,color:'white',textAlign:'left',fontWeight:'500'}}>
                  还剩余
                </CusBaseText>
                <CusBaseText style = {{fontSize:18,color:'#feed38',textAlign:'left',fontWeight:'500'}}>
                  {item.item.value.yu_sheng}
                </CusBaseText>
                <CusBaseText style = {{fontSize:15,color:'white',textAlign:'left',fontWeight:'500'}}>
                 个红包没领
                </CusBaseText>
             </View>
          </View>
      </View>
    );
  }
}


 _changeTime() {

     this.timer = setInterval(() => {

        if (this.leftTime == 0) {
         this._fetchRedPacketData();
       } else if (this.leftTime >0) {
         this.leftTime = this.leftTime - 1;
         this.state.redPacketArray[this.indexTime].value.less_time = this.leftTime;
       }
       // var d=Math.floor(t/1000/60/60/24);
       let hour = Math.floor(this.leftTime / 60 / 60 % 24);
       let min = Math.floor(this.leftTime / 60 % 60);
       let sec = Math.floor(this.leftTime % 60);

       if (hour < 10) {
           hour = "0" + hour;
       }
       if (min < 10) {
           min = "0" + min;
       }
       if (sec < 10) {
           sec = "0" + sec;
       }
       let countDownTime = hour + ":" + min + ":" + sec;

       this.setState({
           countDownTime: countDownTime,
       });

    }, 1000);

}

 _itemZiGe(item){
   let lingquzhige = '';
   let iamegzuo = '';
   if (item.item.value.is_can_get ==0) {
     lingquzhige = '未达到领取资格';
      iamegzuo = '';
   }else if (item.item.value.is_can_get ==3) {
      lingquzhige = '审核中';
       iamegzuo = '';
   }else if (item.item.value.is_can_get ==4) {
     lingquzhige = '被抢光了';
      iamegzuo = '';
   }else if (item.item.value.is_can_get == 5) {
     lingquzhige = '已领取';
      iamegzuo = '';
   }else if (item.item.value.is_can_get ==1) {
     lingquzhige = '点击领取';
   iamegzuo = require('././img/ic_xuanzhetou.png')
   }else if (item.item.value.is_can_get==2) {
     iamegzuo = require('././img/ic_xuanzhetou.png')
      lingquzhige = this.state.countDownTime;
   }
   if (item.item.value.yu_sheng <=0) {
    lingquzhige = '红包已经领完';
   }
   return(
     <View style = {{height:35,justifyContent:'center',flexDirection:'row',alignItems:'center'}}>
       <CusBaseText style = {{flex:1,fontSize:Adaption.Font(15,14),color:'#222222'}}>
      {lingquzhige}
       </CusBaseText>
       <Image style = {{width:15,height:15}}  source={iamegzuo}></Image>
     </View>
   )
 }

  _renderRedPacketItemView(item) {
    if (item.item.value.is_can_get == 2) {
      this.leftTime=item.item.value.less_time;
      this.indexTime = item.index;
    }
    const { navigate } = this.props.navigation;
      return (
        <TouchableOpacity  activeOpacity={1}  style={styles.cellStyle}  onPress={() => this._onAcitveClickCell(item)} >
          <View style = {{height:60,justifyContent:'center'}}>
            <CusBaseText style = {{fontSize:Adaption.Font(15,15),color:'#000',fontWeight:'400'}}>
              {item.item.value.event_title}
            </CusBaseText>
          </View>
          <CusBaseText style  = {{fontSize:Adaption.Font(14,13),color:'#666666',textAlign:'left'}}>
            活动开始时间:{item.item.value.begin_time}
          </CusBaseText>
          {this._itemHongBao(item)}
          <CusBaseText style  = {{fontSize:Adaption.Font(14,13),color:'#666666',textAlign:'left',marginTop:10}}>
            活动结束时间:{item.item.value.end_time}
          </CusBaseText>
          <View style = {{width:width-30-20,height:1,backgroundColor:'#cdcdcd',marginTop:10}}>
          </View>
          {this._itemZiGe(item)}
        </TouchableOpacity>
      );
  }


onRequestClose() {
    this.setState({
      isShowReceiveRedEnvelope: false
      })
  }
_onAcitveClickCell(item){
  this.setState({
      isShowReceiveRedEnvelope: true,
      showRedEnvelopeArray:item,
  })
}
  //红包活动列表
  _renderRedPacketFlatlist() {
    if (this.state.isLoading && !this.state.error) {
      return this.renderLoadingView();
    } else if (this.state.error) {
      return this.renderErrorView(this.state.errorInfo);
    }

    return (
      <FlatList
        automaticallyAdjustContentInsets={false}
        alwaysBounceHorizontal = {false}
        data={this.state.redPacketArray}
        extraData={this.state}
        renderItem={item => this._renderRedPacketItemView(item)}
      />
    );
  }
_isShowReceiveRedEnvel(array){
  let hongbaoTitle = '';
  let hongbaoImage = '';
  let hongbaoButton = '';
  let hongbaoTag = 0;
  let hongbaoHeight = 0;
  if (array.item.value.yu_sheng <=0) {
    hongbaoTitle = '很抱歉，该红包已领取完!';
    hongbaoImage = require('././img/ic_hongbaoguan.png');
    hongbaoButton = '确定';
    hongbaoTag = 10001;
    hongbaoHeight = height/2;
  }else if (array.item.value.is_can_get ==1) {
    hongbaoTitle = '还剩余'+array.item.value.yu_sheng+'个红包没领';
    hongbaoImage = require('././img/ic_hongbaokai.png');
    hongbaoButton = '领取红包';
    hongbaoHeight = height/1.7;
    hongbaoTag = 10002;
  }else if (array.item.value.repeat ==0 || array.item.value.get_num ==0) {
    hongbaoTitle = '很抱歉，你还未达到领取资格！';
    hongbaoImage = require('././img/ic_hongbaoguan.png');
    hongbaoButton = '立即充值';
    hongbaoTag = 10003;
      hongbaoHeight = height/2;
  }else if (array.item.value.repeat ==1 ||array.item.value.get_num ==1|| array.item.value.is_can_get ==0) {
    hongbaoTitle = '已领取!';
    hongbaoImage = require('././img/ic_hongbaokai.png');
    hongbaoButton = '确定';
    hongbaoTag = 10004;
    hongbaoHeight = height/1.7;
  }
return(
    <TouchableOpacity activeOpacity={1} style = {{flex:1}} onPress={()=> this.onRequestClose()}>
      <View style={{backgroundColor:'rgba(0,0,0,0.2)', flex:1, alignItems:'center', justifyContent:'center'}}>
        <ImageBackground resizeMode={'stretch'} style = {{width:SCREEN_WIDTH-70, height:hongbaoHeight,borderRadius:40,justifyContent:'center',alignItems:'center',padding:20}} source = {hongbaoImage}>
          <CusBaseText style={{fontSize:Adaption.Font(20,18),color:'#feed38',textAlign:'center',fontWeight:'500',marginLeft:10,marginTop:60}}>
            {hongbaoTitle}
          </CusBaseText>
          <TouchableOpacity style ={{width:SCREEN_WIDTH-70-40,height:40,marginTop:50,backgroundColor:'#feed38',borderRadius:8,justifyContent:'center',alignItems:'center'}}
             activeOpacity={1} onPress={()=> this._onCloseHongBao(array,hongbaoTag)}>
            <CusBaseText style = {{fontSize:Adaption.Font(16,15),color:'red',textAlign:'center'}}>
              {hongbaoButton}
            </CusBaseText>
          </TouchableOpacity>
        </ImageBackground>
      </View>
      </TouchableOpacity>
    )
 }
 _onCloseHongBao(array,tag) {
 const { navigate } = this.props.navigation;
 if (tag == 10003) {
   this.setState({
      isShowReceiveRedEnvelope: false
    });
   return(
   navigate('RechargeCenter')
    )
  }else if (tag == 10001 || tag == 1004) {
    this.setState({
       isShowReceiveRedEnvelope: false
     });
  }else if (tag == 10002) {
    this.setState({
       isShowReceiveRedEnvelope: false
     });
    {this._fetchLingQuHongBao(array)}
  }
 }

  _fetchLingQuHongBao(param) {
    //请求参数
    let params = new FormData();
    params.append("ac", "userChargeCashBack");
    params.append("uid", this.state.uid);
    params.append("token", this.state.token);
    params.append("eventid",param.item.value.id);

    var promise = BaseNetwork.sendNetworkRequest(params);

    promise
      .then(response => {
        if (response.msg == 0) {
          {this._fetchRedPacketData()}
           Alert.alert(
               '提示',
               '恭喜你获得了'+response.data+'元红包',
               [
                   {text: '确定', onPress: () => {}},
               ]
           )
        }else {
          Alert.alert(
              '提示',
              response.param,
              [
                  {text: '确定', onPress: () => {}},
              ]
          )
        }

      })
      .catch(err => { });
  }

  render() {
    const { navigate } = this.props.navigation;
    return(
      <View style={styles.container}>
      {this.state.isShowReceiveRedEnvelope?<Modal
               visible={this.state.isShowReceiveRedEnvelope}
               //显示是的动画默认none
               //从下面向上滑动slide
               //慢慢显示fade
               animationType = {'none'}
               //是否透明默认是不透明 false
               transparent = {true}
               //关闭时调用
               onRequestClose={()=> this.onRequestClose()}
       >{this._isShowReceiveRedEnvel(this.state.showRedEnvelopeArray)}</Modal>:null}
        {this._renderRedPacketFlatlist()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  cellStyle: {
    marginLeft:15,
    width: width - 30,
    height: 270,
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 5, // cell垂直之间的间隔
    borderRadius:8,
    borderWidth:1,
    borderColor:'rgb(222,222,222)',
  },
  itemBGView:{
    flexDirection:'column',
    width:width-30-20-60-15,
  },
  itemTextChong:{
    fontSize:15,
    color:'white',
    textAlign:'center',
    marginTop:20,
    fontWeight:'500'
  },
  itemShengView:{
    flexDirection:'row',
    width:width-30-20-60-15,
    marginTop:15,
    alignItems:'center',
    justifyContent:'center',
  }

});
