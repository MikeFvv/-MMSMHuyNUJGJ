/**
 Author Money
 Created by on 2017/10/06
 ---------------
 | 冠军 VS 亚军  |
 ---------------
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

let leftRate = 0.18; // 左右各占的比例
let rightRate = 0.82;
var ballsAndPeilvData = [];

class BallsPK extends Component {

  constructor(props) {
    super(props);

    // 这里根据传进来的号码，编历给个初始化的状态。点击选择的时候还更改状态。
    let balls_1Arr = [];
    let balls_2Arr = [];
    for (var i = 0; i < this.props.balls.length; i++) {
      balls_1Arr.push({ball:this.props.balls[i].ball_1, state:false});
      balls_2Arr.push({ball:this.props.balls[i].ball_2, state:false});
    }

    this.state = {
      ball_1State: balls_1Arr,
      ball_2State: balls_2Arr,
    };
  }

  componentWillReceiveProps(nextProps) {

    // 清空
    if (nextProps.clearAllBalls) {
      for (let i = 0; i < nextProps.balls.length; i++) {
        this.state.ball_1State[i].state = false;
        this.state.ball_2State[i].state = false;
      }
      this.setState({
        ball_1State: this.state.ball_1State,
        ball_2State: this.state.ball_2State,
      });
      this.props.ballClick?this.props.ballClick(this._selectBalls(this.state.ball_2State)):null;
    }

    // 机选
    if (nextProps.isBallsChange) {
      // 点了机选 就往下走
      let vs = Math.floor(Math.random() * 2); // 随机 确定是左边还是右边vs
      let arcInt = Math.floor(Math.random() * this.props.balls.length);

      for (var i = 0; i < this.props.balls.length; i++) {

        if (i == arcInt) {
          if (vs == 0) {
            this.state.ball_1State[i].state = true;
            this.state.ball_2State[i].state = false;

          } else if (vs == 1) {
            this.state.ball_1State[i].state = false;
            this.state.ball_2State[i].state = true;
          }
        } else {
          this.state.ball_1State[i].state = false;
          this.state.ball_2State[i].state = false;
        }
      }

      this.setState({
        ball_1State: this.state.ball_1State,
        ball_2State: this.state.ball_2State,
      });

      if (vs == 0) {
        this.props.ballClick?this.props.ballClick(this._selectBalls(this.state.ball_1State)):null;
      } else if (vs == 1) {
        this.props.ballClick?this.props.ballClick(this._selectBalls(this.state.ball_2State)):null;
      }
    }
  }

  _renderItemView(item) {
    let ballWidth = Adaption.Width(55);
    let ballHeight = Adaption.Height(35);
    let remains = this.props.balls.length % this.props.numColumn; // 余数
    var row = parseInt(this.props.balls.length / this.props.numColumn, 10); // 要整数。
    // 有余数 要加1；
    if (remains > 0) {
      row = row + 1;
    }
    let insetH = (this.props.style.height - (ballHeight * row))/(row + 1); //（item的高 - 2个圆的高）除3个间隔。

    let insetLeft = 0;
    if (this.props.numColumn == 1) {
      insetLeft = ballWidth;
    }

    return(
      <View style = {{marginLeft:insetLeft, marginTop:insetH, flexDirection:'row', justifyContent:'center', alignItems:'center', width:(this.props.style.width * rightRate)*0.5}}>
        <TouchableOpacity activeOpacity={0.6}
          style = {{width:ballWidth, height:ballHeight, borderRadius:5,
            justifyContent:'center', alignItems:'center', backgroundColor:this.state.ball_1State[item.index].state?'#f00':'#fff'}}
            onPress = {()=> {
              this.state.ball_1State[item.index].state = !this.state.ball_1State[item.index].state;
              this.setState({
                ball_1State:this.state.ball_1State,
              })
              this.props.ballClick?this.props.ballClick(this._selectBalls(this.state.ball_1State)):null;
            }}>
          <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(17), color:this.state.ball_1State[item.index].state?'#fff':'#f00'}}>{item.item.ball_1}</Text>
        </TouchableOpacity>

        <View style = {{marginLeft:3, marginRight:3, justifyContent:'center', alignItems:'center', width:Adaption.Width(30), height:Adaption.Width(30) ,borderRadius:Adaption.Width(30), borderColor:'#777', borderWidth:1}}>
          <Text allowFontScaling={false} style = {{color:'#777', fontSize:Adaption.Font(17), backgroundColor:'rgba(0,0,0,0)'}}>VS</Text>
        </View>

        <TouchableOpacity activeOpacity={0.6}
          style = {{width:ballWidth, height:ballHeight, borderRadius:5,
            justifyContent:'center', alignItems:'center', backgroundColor:this.state.ball_2State[item.index].state?'#f00':'#fff'}}
            onPress = {()=> {
              this.state.ball_2State[item.index].state = !this.state.ball_2State[item.index].state;
              this.setState({
                ball_2State:this.state.ball_2State,
              })
              this.props.ballClick?this.props.ballClick(this._selectBalls(this.state.ball_2State)):null;
            }}>
          <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(17), color:this.state.ball_2State[item.index].state?'#fff':'#f00'}}>{item.item.ball_2}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // 选择的号码，
  _selectBalls(ballStates) {
    var selectBallArr = [];
    var numBalls = [];
    let PKballs = [];
    if (this.props.js_tag == 'ssc') {
       PKballs = ['万位', '千位', '百位', '十位', '个位'];
    } else if (this.props.js_tag == '3d') {
      PKballs = ['百位', '十位', '个位'];
    } else if (this.props.js_tag == 'pk10') {
      PKballs = ['冠军', '亚军', '季军', '四名', '五名'];
    } else if (this.props.js_tag == '11x5') {
      PKballs = ['一位', '二位', '三位', '四位', '五位'];
    }
    this.state.ball_1State.map((dic, idx) => {
      // 编历，如果它的state是true，就添加到selectBallArr数组。
      if (dic.state == true) {
        if (!(this.props.js_tag == '11x5' || this.props.js_tag == 'pk10')) {
          selectBallArr.push([dic.ball[0], this.state.ball_2State[idx].ball[0]]);
        } else {
          selectBallArr.push([dic.ball, this.state.ball_2State[idx].ball]);
        }

        let numBall_1 = -1;
        let numBall_2 = -1;
        for (var i = 0; i < PKballs.length; i++) {
          if (PKballs[i] == dic.ball) {
            numBall_1 = i;
          }
          if (PKballs[i] == this.state.ball_2State[idx].ball) {
            numBall_2 = i;
          }
        }
        numBalls.push([numBall_1, numBall_2]);

      }
    })
    this.state.ball_2State.map((dic, idx) => {
      // 编历，如果它的state是true，就添加到selectBallArr数组。
      if (dic.state == true) {
        if (!(this.props.js_tag == '11x5' || this.props.js_tag == 'pk10')) {
          selectBallArr.push([dic.ball[0], this.state.ball_1State[idx].ball[0]]);
        } else {
          selectBallArr.push([dic.ball, this.state.ball_1State[idx].ball]);
        }
        

        let numBall_1 = -1;
        let numBall_2 = -1;
        for (var i = 0; i < PKballs.length; i++) {
          if (PKballs[i] == dic.ball) {
            numBall_1 = i;
          }
          if (PKballs[i] == this.state.ball_1State[idx].ball) {
            numBall_2 = i;
          }
        }
        numBalls.push([numBall_1, numBall_2]);

      }
    })
    // 最后返回一个字典； 表达式／变量做为字典的key时，要放在方括号内。
    return {[this.props.leftTitle] : selectBallArr, [this.props.leftTitle + '0']: numBalls};
  }

  render() {

    return(
      <View style = {this.props.style}>
        <View style = {{flexDirection:'row', width:this.props.style.width, height:this.props.style.height - 1}}>

          <View style = {{width:this.props.style.width * leftRate, justifyContent:'center', alignItems:'flex-end'}}>
            <ImageBackground style={{width:Adaption.Width(70),height:Adaption.Width(28), justifyContent:'center', alignItems:'center'}}
              source={ require('../../../img/ic_ballNoClick.png')}>
              <Text allowFontScaling={false} style = {{backgroundColor:'rgba(0,0,0,0)', color:'#fff', marginLeft:Adaption.Width(-6), fontSize:Adaption.Font(15)}}>{this.props.leftTitle}</Text>
            </ImageBackground>
          </View>

          <FlatList style = {{width:this.props.style.width * rightRate}}
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
        <View style = {{height:1, width:this.props.style.width, backgroundColor:'#d3d3d3'}}></View>
      </View>
    )
  }

}

export default BallsPK;
