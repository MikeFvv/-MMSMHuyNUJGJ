/**
 Author Money
 Created by on 2017/10/06
 --------------
 |    特大     |
 --------------
    1.962
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

var ballsAndPeilvData = [];

class LhcBallsBlockPeilv extends Component {

  constructor(props) {
    super(props);

    // 这里根据传进来的号码，编历给个初始化的状态。点击选择的时候还更改状态。
    let ballsArr = [];
    for (var i = 0; i < this.props.balls.length; i++) {
      ballsArr.push({ball:this.props.balls[i], state:false});
    }

    ballsAndPeilvData = [];
    if (this.props.balls.length == this.props.peilvs.length) {
      for (let i = 0; i < this.props.balls.length; i++) {
        ballsAndPeilvData.push({key:i, 'ball':this.props.balls[i], 'peilv':this.props.peilvs[i]})
      }
    }

    this.state = {
      ballState: ballsArr,
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
    let ballWidth = Adaption.Width(85);
    let ballHeight = Adaption.Height(35);
    let remains = this.props.balls.length % this.props.numColumn; // 余数
    var row = parseInt(this.props.balls.length / this.props.numColumn, 10); // 要整数。
    // 有余数 要加1；
    if (remains > 0) {
      row = row + 1;
    }
    let peilvHeight = Adaption.Width(18); // 赔率显示的高，（比赔率fontSize 大1）。
    let insetW = (this.props.style.width - (ballWidth * this.props.numColumn))/(this.props.numColumn);   //（item的宽 - 5个圆的宽）除6个间隔
    let insetH = (this.props.style.height - 40 - ((ballHeight + peilvHeight) * row))/(row + 1); //（item的高 - 2个圆的高）除3个间隔。

    return(
      <View>
        <TouchableOpacity activeOpacity={0.6}
          style = {{width:ballWidth, height:ballHeight, borderRadius:Adaption.Width(8), marginLeft:insetW/2, marginRight:insetW/2, marginTop:insetH,
            justifyContent:'center', alignItems:'center', backgroundColor:this.state.ballState[item.index].state?'#f00':'#fff'}}
            onPress = {()=> {
              this.state.ballState[item.index].state = !this.state.ballState[item.index].state;
              this.setState({
                ballState:this.state.ballState,
              })
              this.props.ballClick?this.props.ballClick(this._selectBalls(this.state.ballState)):null;
            }}>
          <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(17), color:this.state.ballState[item.index].state?'#fff':'#f00'}}>{item.item.ball}</Text>
        </TouchableOpacity>

        <View style = {{height:peilvHeight}}>
          <Text allowFontScaling={false} style = {{textAlign:'center', fontSize:Adaption.Font(16), color:'#666'}}>{global.UserLoginObject.Token == '' ? '-.-' : item.item.peilv}</Text>
        </View>
      </View>
    )
  }

  // 选择的号码，
  _selectBalls(ballStates) {
    var selectBallArr = [];
    var selectPeilvs = [];
    var numBalls = [];

    ballStates.map((dic, idx) => {
      // 编历，如果它的state是true，就添加到selectBallArr数组。
      if (dic.state == true) {
        selectBallArr.push(dic.ball);

        let dict = ballsAndPeilvData[idx];
        selectPeilvs.push(dict.peilv);

        numBalls.push(idx);// 返回中文号码的下标
      }
    })
    // 最后返回一个字典； 表达式／变量做为字典的key时，要放在方括号内。
    return {[this.props.playTitle] : selectBallArr, [this.props.playTitle + '0'] : numBalls, '赔率' : selectPeilvs};
  }

  render() {

    return(
      <View style = {this.props.style}>
        <View style = {{height:30, width:this.props.style.width, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
          <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(16), color:'#f00'}}>{this.props.playTitle}</Text>
          <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(16), color:'#333', marginLeft:20}}>赔率</Text>
        </View>
        <View style = {{height:0.6, width:this.props.style.width, backgroundColor:'#d3d3d3'}}></View>

        <FlatList style = {{width:this.props.style.width, height:this.props.style.height - 30}}
          automaticallyAdjustContentInsets={false}
          alwaysBounceHorizontal = {false}
          data = {ballsAndPeilvData}
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

export default LhcBallsBlockPeilv;
