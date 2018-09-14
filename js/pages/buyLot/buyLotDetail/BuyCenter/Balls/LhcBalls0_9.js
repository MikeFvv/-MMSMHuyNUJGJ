/**
 Author Money
 Created by on 2017/10/05
  ⑥
 */
import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground,
} from 'react-native';


class LhcBalls0_9 extends Component {

  constructor(props) {
    super(props);

    // 这里根据传进来的号码，编历给个初始化的状态。点击选择的时候还更改状态。
    let ballsArr = [];
    for (var i = 0; i < this.props.balls.length; i++) {
      ballsArr.push({ball:this.props.balls[i].ball, state:false});
    }

    let peilvStr = '';
    if (this.props.tpl == '13') {
      // 连码赔率显示的。
      let peilvarr = this.props.peilvs.split('|');
      if (this.props.playid == 30) {
        peilvStr = `${peilvarr[0]}(中二)／${peilvarr[1]}(中三)`;
      } else if (this.props.playid == 33) {
        peilvStr = `${peilvarr[0]}(中特)／${peilvarr[1]}(中二)`;
      } else {
        peilvStr = `${peilvarr[0]}(${this.props.playTitle})`;
      }
    }

    this.state = {
      ballState: ballsArr,
      currentPeilv:(this.props.tpl == '12') ? 0 : this.props.peilvs, // 自选不中的给0
      currentPeilvStr:peilvStr, // 连码赔率显示的。
    };
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.clearAllBalls) {
      for (let i = 0; i < nextProps.balls.length; i++) {
        this.state.ballState[i].state = false;
        this.setState({
          ballState:this.state.ballState,
        })
        this.props.ballClick?this.props.ballClick(this._selectBalls(this.state.ballState)):null;
      }
    }
  }

  _renderItemView(item) {
    let ballWidth = Adaption.Width(43);
    let remains = this.props.balls.length % this.props.numColumn; // 余数
    var row = parseInt(this.props.balls.length / this.props.numColumn, 10); // 要整数。
    // 有余数 要加1；
    if (remains > 0) {
      row = row + 1;
    }

    let insetW = (this.props.style.width - (ballWidth * this.props.numColumn))/(this.props.numColumn + 1);   //（item的宽 - 5个圆的宽）除6个间隔
    let insetH = (this.props.style.height - 40 - (ballWidth * row))/(row + 1); //（item的高 - 2个圆的高）除3个间隔。

    var selectColor = '#f00';
    // var default_color = {
    //   red: {name: '红波', color: '#e6374e', val: 0, balls: ['01','02','07','08','12','13','18','19','23','24','29','30','34','35','40','45','46']},
    //   blue: {name: '蓝波', color: '#1b82e8', val: 1, balls: ['03','04','09','10','14','15','20','25','26','31','36','37','41','42','47','48']},
    //   green: {name: '绿波', color: '#38b06e', val: 2, balls: ['05','06','11','16','17','21','22','27','28','32','33','38','39','43','44','49']}
    // }

    // for (var b in default_color) {
    //   let ballAr = default_color[b].balls;
    //   if (ballAr.includes(item.item.ball)) {
    //     selectColor = default_color[b].color;
    //     break;
    //   }
    // }

    return(
      <View>
        <TouchableOpacity activeOpacity={0.6}
          style = {{width:ballWidth, height:ballWidth, borderRadius:ballWidth*0.5, marginLeft:insetW, marginTop:insetH,
            justifyContent:'center', alignItems:'center', backgroundColor:this.state.ballState[item.index].state?selectColor:'#fff'}}
            onPress = {()=> {
              this._selectBallsLimit(item);
            }}>
          <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(17), color:this.state.ballState[item.index].state?'#fff':selectColor}}>{item.item.ball}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // 选择号码的限制
  _selectBallsLimit(item) {
    if (this.props.tpl == '13' || this.props.tpl == '12') {
      // 连码，自选不中
      this.state.ballState[item.index].state = !this.state.ballState[item.index].state;
      let len = 0;
      if (this.props.tpl == '13') {
        len = 10; // 连码最多能选10个号。
      } else if (this.props.tpl == '12') {
        len = 11;  // 自选不中最多能选11个号。
      }

      // 编历它为true的个数
      let ballSlc = 0; // 记录状态为true的个数
      for (let i = 0; i < this.state.ballState.length; i++) {
        let ballDic = this.state.ballState[i];
        if (ballDic.state == true) {
          ballSlc += 1;
        }
      }

      if (ballSlc > len) {
        for (let j = 0; j < this.state.ballState.length; j++) {
          if (this.state.ballState[j].state == true) {
            if (j != item.index) { // j 不能等于刚刚点的这个下标。
              this.state.ballState[j].state = false;
              break;
            }
          }
        }
      }

    } else {
      this.state.ballState[item.index].state = !this.state.ballState[item.index].state;
    }

    this.setState({
      ballState:this.state.ballState,
    })
    this.props.ballClick?this.props.ballClick(this._selectBalls(this.state.ballState)):null;
  }

  // 选择的号码，
  _selectBalls(ballStates) {
    var selectBallArr = [];
    ballStates.map((dic, idx) => {
      // 编历，如果它的state是true，就添加到selectBallArr数组。
      if (dic.state == true) {
        selectBallArr.push(dic.ball);
      }
    })

    let isCurrentPeilv = this.state.currentPeilv;
    if (this.props.tpl == '12') {
      if (selectBallArr.length >= 6 && selectBallArr.length <= 11) {
        // 自选不中，6个号码至11个号码 拿赔率。小于6就把赔率搞为0；
        isCurrentPeilv = this.props.peilvs[selectBallArr.length - 6];

        this.setState({
          currentPeilv:isCurrentPeilv,
        })
      } else if (selectBallArr.length < 6) {
        isCurrentPeilv = 0;
        this.setState({
          currentPeilv:isCurrentPeilv,
        })
      }
    }
    // 最后返回一个字典； 表达式／变量做为字典的key时，要放在方括号内。
    return {[this.props.playTitle] : selectBallArr, '赔率' : isCurrentPeilv};
  }

  render() {

    return(
      <View style = {this.props.style}>
        <View style = {{height:30, width:this.props.style.width, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
          <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(16), color:'#f00'}}>{this.props.playTitle}</Text>
          <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(16), color:'#333', marginLeft:20}}>赔率：</Text>
          <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(16), color:'#f00', marginLeft:0}}>{global.UserLoginObject.Token == '' ? '-.-' : ((this.props.tpl == '13') ? this.state.currentPeilvStr : this.state.currentPeilv)}</Text>
        </View>
        <View style = {{height:0.6, width:this.props.style.width, backgroundColor:'#d3d3d3'}}></View>

        <FlatList style = {{width:this.props.style.width, height:this.props.style.height - 30}}
          automaticallyAdjustContentInsets={false}
          alwaysBounceHorizontal = {false}
          data = {this.props.balls}
          renderItem = {(item)=>this._renderItemView(item)}
          horizontal = {false}
          numColumns = {this.props.numColumn}
          scrollEnabled={false}
          >
        </FlatList>
      </View>
    )
  }

}

export default LhcBalls0_9;
