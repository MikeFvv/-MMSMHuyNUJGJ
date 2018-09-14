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
} from "react-native";
import Toast, { DURATION } from 'react-native-easy-toast'
const { width, height } = Dimensions.get("window");

import BaseNetwork from "../../skframework/component/BaseNetwork"; //网络请求
import Adaption from "../../skframework/tools/Adaption";

export default class TodayProfitLoss extends Component {
  static navigationOptions = ({ navigation }) => ({

      header: (
          <CustomNavBar
              centerText = {"今日盈亏"}
              leftClick={() =>  navigation.goBack() }
          />
      ),
  });

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      errorInfo: "",
      lossArray: [],
    };
  }

  componentWillMount() {
    this._fetchPreferentialData();
  }

 _fetchPreferentialData(){
      //请求参数
      let params = new FormData();
      params.append("ac", "todayWin");
      params.append("uid", global.UserLoginObject.Uid);
      params.append("token", global.UserLoginObject.Token);

      var promise = BaseNetwork.sendNetworkRequest(params);

      promise
        .then(response => {
          if (response.msg == 0) {
            let dataList = response.data;
            this.setState({lossArray:dataList})
          } else {
      NewWorkAlert(response.param);
          }

        })
        .catch(err => { });
}

 _onMeAction(){

      const { navigate } = this.props.navigation;
   
           if (global.UserLoginObject.Card_num){
            navigate('DrawalInfo');
           }
           else {
            navigate('BindBankCard',{callback: () => {},BindBankCardPreviousAction:'DrawalCenter'});
           }
           return;
         
    
    

}

  _onShuaixin(){
   this.refs.Toast.show('刷新成功!', 1000);
   this._fetchPreferentialData();

   }
  render() {
    const { navigate } = this.props.navigation;
    return(
      this.state.lossArray.length==0?<View style={{flex: 1,alignItems:'center',justifyContent:'center',backgroundColor: '#f3f3f3',}}><CusBaseText style= {{fontSize:15}}>
          数据加载中...
        </CusBaseText></View>:<View style={styles.container}>
      <View style={styles.container}>
       <View style = {{flex:0.4,marginTop:10,backgroundColor:'white'}}>
          <CusBaseText style= {{flex:0.2,fontSize:17,color:'#222222',marginLeft:10,marginTop:10}}>
            盈亏总额(元)
          </CusBaseText>
          <View style = {{flex:0.6,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
            <CusBaseText style= {{fontSize:25,color:'red'}}>
              {typeof (this.state.lossArray.zhong) == 'number'?this.state.lossArray.zhong.toFixed(2):this.state.lossArray.zhong}
            </CusBaseText>
            <TouchableOpacity activeOpacity={1} onPress={() => this._onShuaixin()} style={{marginLeft:10}}>
              <Image style={{ width: 20, height: 20 }} source={require('./img/ic_shuaxina.png')}></Image>
            </TouchableOpacity>
          </View>
          <CusBaseText style= {{flex:0.2,fontSize:15,color:'#666666',marginTop:10,textAlign:'center'}}>
            盈亏计算方式:中奖 - 投注 + 活动 + 返点
          </CusBaseText>
       </View>

       <View style = {{flex:0.6,marginTop:10,backgroundColor:'white'}}>
         <View style = {{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
           <View style = {{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
             <CusBaseText style= {styles.container_wenzi}>
               {typeof (this.state.lossArray.tou_price) == 'number'?this.state.lossArray.tou_price.toFixed(2):this.state.lossArray.tou_price}
             </CusBaseText>
             <CusBaseText style= {styles.container_miaoshu}>
               投注金额
             </CusBaseText>
           </View>
           <Image style={{ width:1, height: 60 }} source={require('./img/ic_shuxian.png')}></Image>
           <View style = {{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
             <CusBaseText style= {styles.container_wenzi}>
               {typeof (this.state.lossArray.win_price) == 'number'?this.state.lossArray.win_price.toFixed(2):this.state.lossArray.win_price}
             </CusBaseText>
             <CusBaseText style= {styles.container_miaoshu}>
               中奖金额
             </CusBaseText>
           </View>
           <Image style={{ width:1, height: 60 }} source={require('./img/ic_shuxian.png')}></Image>
           <View style = {{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
             <CusBaseText style= {styles.container_wenzi}>
               {typeof (this.state.lossArray.huo_price) == 'number'?this.state.lossArray.huo_price.toFixed(2):this.state.lossArray.huo_price}
             </CusBaseText>
             <CusBaseText style= {styles.container_miaoshu}>
               活动礼金
             </CusBaseText>
           </View>
         </View>

         <View style = {{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
           <View style = {{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
             <CusBaseText style= {styles.container_wenzi}>
              {typeof (this.state.lossArray.fan_price) == 'number'?this.state.lossArray.fan_price.toFixed(2):this.state.lossArray.fan_price}
             </CusBaseText>
             <CusBaseText style= {styles.container_miaoshu}>
               返点金额
             </CusBaseText>
           </View>
           <Image style={{ width:1, height: 60 }} source={require('./img/ic_shuxian.png')}></Image>
           <View style = {{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
             <CusBaseText style= {styles.container_wenzi}>
               {typeof (this.state.lossArray.pay_price) == 'number'?this.state.lossArray.pay_price.toFixed(2):this.state.lossArray.pay_price}
             </CusBaseText>
             <CusBaseText style= {styles.container_miaoshu}>
               充值金额
             </CusBaseText>
           </View>
           <Image style={{ width:1, height: 60 }} source={require('./img/ic_shuxian.png')}></Image>
           <View style = {{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
             <CusBaseText style= {styles.container_wenzi}>
               {typeof (this.state.lossArray.ti_price) == 'number'?this.state.lossArray.ti_price.toFixed(2):this.state.lossArray.ti_price}
             </CusBaseText>
             <CusBaseText style= {styles.container_miaoshu}>
               提现金额
             </CusBaseText>
           </View>
         </View>

       </View>
    </View>
       <View style={{marginTop:155,width:width, height:60, backgroundColor: '#ffffff', flexDirection: 'row' }}>
           <TouchableOpacity activeOpacity={1} onPress={() => navigate('RechargeCenter')} style={[styles.container_HeaderView_Box, { borderRightWidth: 1, }]}>
               <Image style={{width:20,height:20}} source={require('./img/ic_topup.png')}></Image>
               <CusBaseText style={[styles.container_HeaderView_Box_Text, {color: COLORS.appColor,}]}>充值</CusBaseText>
           </TouchableOpacity>
           <TouchableOpacity activeOpacity={1} onPress={() => this._onMeAction()} style={styles.container_HeaderView_Box}>
               <Image style={{width:20,height:20}} source={require('./img/ic_drawcash.png')}></Image>
               <CusBaseText style={[styles.container_HeaderView_Box_Text, {color: 'green',}]}>提现</CusBaseText>
           </TouchableOpacity>
       </View>
       <Toast ref="Toast" position='center'/>
     </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  //单个模块视图
  container_HeaderView_Box: {
      borderColor: 'lightgrey',
      flex: 0.5,
      flexDirection: 'row',
      alignItems: 'center',      //垂直居中
      justifyContent: 'center',  //水平居中
      height: Adaption.Width(60),

  },
  //模块的文字
  container_HeaderView_Box_Text: {
      textAlign: 'left',
      fontSize: Adaption.Font(18, 16),
      marginLeft: 10,
  },
  container_wenzi:{
    fontSize:17,
    color:COLORS.appColor,
    textAlign:'center'
  },
  container_miaoshu:{
    fontSize:17,
    color:'#666666',
    textAlign:'center',
    marginTop:10
  },
  cellStyle: {
    width: width-20,
    marginLeft:10,
    height: 100,
    backgroundColor: 'white',
    marginVertical: 5, // cell垂直之间的间隔
  },

});
