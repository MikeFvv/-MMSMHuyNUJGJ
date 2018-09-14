/**
    Author Ward
    Created by on 2017-10-14 19:10
    用于投注界面倒计时弹窗
**/

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Modal,
    TouchableOpacity,
} from 'react-native';

export default class RNAlertView extends Component {

  constructor(props){
    super(props);

    this.state = ({

      isShow:false,
      dissMissTime:3,   //消失时间
      contentString:'', //显示的内容
    })

      this.timer1 = null;
  }

  render() {

      if (!this.state.isShow) return null;

      return (
        <Modal
            visible={this.state.isShow}
            //显示是的动画默认none
            //从下面向上滑动slide
            //慢慢显示fade
            animationType={'fade'}
            //是否透明默认是不透明 false
            transparent={true}
            //关闭时调用
            onRequestClose={() => {}}
          >
          <View style = {styles.container}>
              <View style = {styles.AlertView}>
                 <View style = {{justifyContent:'center', alignItems:'center', height:20, marginTop:10}}><CusBaseText style = {{fontSize:Adaption.Font(18,15), fontWeight:'900'}}>{this.props.alertTitle}</CusBaseText></View>
                 <View style = {{justifyContent:'center', alignItems:'center', height:70}}><CusBaseText style = {{fontSize:Adaption.Font(16,14), color:'grey'}}>{this.state.contentString}</CusBaseText></View>
                 <View style = {{height:1, backgroundColor:'lightgrey'}}/>
                 <View style = {{flexDirection:'row', height:50}}>
                    <TouchableOpacity onPress = {() => {this.setState({isShow:false}); this.props.dissmissClick ? this.props.dissmissClick() : null} } style = {{flex:0.49, justifyContent:'center', alignItems:'center'}}><CusBaseText style = {{fontSize:Adaption.Font(17,15), color:'red'}}>{this.props.comformBtnTitle}</CusBaseText></TouchableOpacity>
                    <View style = {{height:50, backgroundColor:'lightgrey', width:1}}/>
                    <TouchableOpacity onPress = {() => {this.setState({isShow:false}); this.props.comformClick? this.props.comformClick() : null} } style = {{flex:0.49, justifyContent:'center', alignItems:'center'}}><CusBaseText style = {{fontSize:Adaption.Font(17,15), color:'blue'}}>{`${this.props.cancleBtnTitle}(${this.state.dissMissTime})`}</CusBaseText></TouchableOpacity>
                 </View>
              </View>
          </View>
        </Modal>
      )
  }

  //显示
  show(alerStr){
    this.setState({
        isShow:true,  //显示弹窗
        dissMissTime:3,
        contentString:alerStr,
    })
  }

  //消失弹窗

  dissmiss = (delay) => {

    let duration = 0;

    if (delay == null || delay <= 0){
      duration = 3;
    }else {
      duration = delay;
    }

    if (this.timer1){

    }
    else {
        this.timer1 = setInterval(() => {

            //组件已经移除，事件没有停止
            if (this.state.dissMissTime == 0){
                return;
            }

            this.setState({
                dissMissTime:this.state.dissMissTime - 1,
            })

        }, 1000);
    }

    this.timer = setTimeout(() => {
        this.setState({
            isShow:false,
        });

        //this._endUnmount = true;

    },duration*1000);

  }

    componentWillMount() {
        this._endUnmount = false; //防止定时器过快消失
    }

  componentWillUnmount() {

    this.timer && clearTimeout(this.timer);
    this.timer1 && clearInterval(this.timer1);

      //若组件被卸载，刷新state则直接返回，可以解决警告(倒计时组件可能造成的警告)
      this.setState = (state,callback) => {
          return;
      }
  }


}

const styles = StyleSheet.create({

    container:{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      flex:1,
      backgroundColor:'rgba(0,0,0,0.1)',
    },

    AlertView:{
      backgroundColor:'white',
      borderRadius:10,
      borderWidth:1,
    //   height:140,
      marginLeft:30,
      marginRight:30,
      borderColor:'lightgrey',
    }
})
