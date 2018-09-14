/**
    Author Ward
    Created by on 2017-10-26 15:57
    dec 弹出玩法切换，玩法说明提示框
**/

import React, { Component } from 'react';
import Toast, { DURATION } from 'react-native-easy-toast'

import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Text,
    Modal,
    ScrollView,
} from 'react-native';

export default class SubHelpMessageView extends Component {

  //构造器
  constructor(props)
  {
      super(props);

      this.state = ({

        isShow:false,                   //是否显示
        dataArr:[],                     //彩种数据源
        playWanFaDetail:'',           //当前彩种玩法说明
        userTotalPrice:global.UserLoginObject.TotalMoney,  //用户余额
        tag:'',  //所选的玩法的tag
      })

  }

  //一开始请求数据
  componentWillMount(){

  }

  componentWillReceiveProps(nextProps) {

    this.setState({
        isShow:nextProps.visible,
    });

    //当两个数据同时不为空
    if (nextProps.dataSource.length != 0 && nextProps.currenPlayDetail != null && nextProps.currenPlayDetail != ''){

        this.setState({
          dataArr:nextProps.dataSource,
          playWanFaDetail:nextProps.currenPlayDetail,
          tag:nextProps.tag,
        })
    }

  }

  componentDidMount(){

  }

  //根据数据创建视图
  _createCaiZhongView(listArr){

      //数据不为空时创建视图
      if (listArr.length != 0 && this.state.playWanFaDetail != ''){

      let caiZhongViewArr = [];

      let caizhongBackColor = '';

      for (let i = 0; i < listArr.length; i++) {

          let model = listArr[i];

          if (model.tag != this.state.tag){
             caizhongBackColor = '#fdfbf5';
          }
          else {
            caizhongBackColor = '#f5f5f5';
          }

          caiZhongViewArr.push(<TouchableOpacity activeOpacity={1} onPress = {() =>
            {
                //如果点击相同的玩法则不做操作
                if (this.state.tag != model.tag){
                    this.props.caiZhongClick ? this.props.caiZhongClick(model.game_id, model.game_name, model.tag, model.js_tag) : null;
                }
                else {
                    this.props.isChangeValue? this.props.isChangeValue(!this.state.isShow) : null;
                }
            }}
            key={i}
            style = {{height:50, alignItems:'center', justifyContent:'center', backgroundColor:caizhongBackColor}}
            >
            <CusBaseText style = {{color:'#5b594e', fontSize:Adaption.Width(20)}}>{model.game_name}</CusBaseText>
          </TouchableOpacity>);
      }

      return caiZhongViewArr;
    }
  }

  //刷新金额
  _onRershRMB() {

    if (global.UserLoginObject.Token == '') {
        this.refs.Toast.show('请先登录!', 1000);
        return;
    }

    let params = new FormData();
    params.append("ac", "flushPrice");
    params.append("uid", global.UserLoginObject.Uid);
    params.append("token", global.UserLoginObject.Token);
    params.append('sessionkey', this.loginObject.session_key);
    var promise = GlobalBaseNetwork.sendNetworkRequest(params);
    promise
      .then(response => {
        if (response.msg == 0) {

          this.refs.Toast.show('刷新金额成功!', 1000);

          if (typeof(response.data.user_price) == 'number'){

              response.data.user_price = response.data.price.toFixed(2);
          }

          this.setState({userTotalPrice:response.data.user_price});
          global.UserLoginObject.TotalMoney = response.data.user_price;
          global.UserLoginObject.Sign_event = response.data._user.sign_event;//判断每日签到通道是否开启 0 未开，1开启
          global.UserLoginObject.Gift_event = response.data._user.gift_event;//判断红包通道是否开启0 未开，1开启
          global.UserLoginObject.RiseEvent = response.data._user.rise_event,//是不是开放等级页面

          global.UserInfo.updateUserInfo(global.UserLoginObject, (result) => {});

          PushNotification.emit('RefreshUserTotalMoney', response.data.user_price);
        }
      })
      .catch(err => { });
  }

  render() {
      let iphoneX = global.iOS ? (SCREEN_HEIGHT == 812 ? true : false) : 0; //是否是iphoneX
      return (
          <Modal
              visible={this.state.isShow}
              animationType={'none'}
              transparent={true}
              onRequestClose={() => {}}
              >
              <TouchableOpacity activeOpacity={1} style = {{flex:1, backgroundColor:'rgba(0,0,0,0.2)'}} onPress = {() => {this.props.isChangeValue? this.props.isChangeValue(!this.state.isShow) : null}}>
                  <View style = {{marginBottom:iphoneX ? 34 : 0 , marginTop:iphoneX ? 34 : 0, flexDirection:'row',flex:1, }}>
                    <View style = {{flex:0.25}}></View>
                    <View style = {{flex:0.35, backgroundColor:'#ffffff', flexDirection:'column'}}>
                        <TouchableOpacity onPress = {() => {this.props.shumingClick?this.props.shumingClick():null}} activeOpacity={0.5} style = {{alignItems:'center', justifyContent:'center', height:80}}><CusBaseText style = {{color:'#5b594e', fontSize:Adaption.Width(20)}}>玩法说明</CusBaseText></TouchableOpacity>
                        {this.state.tag != 'xglhc' ? (<TouchableOpacity onPress = {() => {this.props.trendClick ? this.props.trendClick() : nill}} activeOpacity={0.5} style = {{alignItems:'center', justifyContent:'center', height:60}}><CusBaseText style = {{color:'#5b594e', fontSize:Adaption.Width(20)}}>走势图</CusBaseText></TouchableOpacity>):(null)}
                        <TouchableOpacity onPress = {() => this._onRershRMB()} activeOpacity={0.5} style = {{alignItems:'center', justifyContent:'center', height:80}}>
                            <View style = {{flexDirection:'row', justifyContent:'center'}}>
                            <CusBaseText style = {{color:'#5b594e', fontSize:Adaption.Width(18)}}>当前余额</CusBaseText>
                            <Image style = {{marginLeft:5, width:15,height:15}} source = {require('../../img/ic_buy_playRefresh.png')}></Image>
                            </View>
                            <CusBaseText style = {{color:'#5b594e', fontSize:Adaption.Width(16), marginTop:10}}>{this.state.userTotalPrice != '' ? `${this.state.userTotalPrice}元` : '0.00元'}</CusBaseText>
                        </TouchableOpacity>
                    </View>
                    <View style = {{width:1, height:SCREEN_HEIGHT, backgroundColor:'lightgrey'}}></View>
                    <View style = {{flex:0.4, backgroundColor:'#fff'}}>
                        <View style = {{borderBottomWidth:1, borderColor:'lightgrey', height:50, justifyContent:'center', alignItems:'center', backgroundColor:'#efefef'}}><CusBaseText style = {{color:'#5b594e', fontSize:Adaption.Width(20)}}>切换彩种</CusBaseText></View>
                        <ScrollView bounces={false}>
                            {this.state.dataArr.length != 0 ? this._createCaiZhongView(this.state.dataArr) : null}
                        </ScrollView>
                    </View>
                </View>
              </TouchableOpacity>
              <Toast ref="Toast" position='bottom'/>
          </Modal>
      )
  }
}
