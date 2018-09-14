/**
 Author Money
 Created by on 2017/10/05
   ⑥
 48.800
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

let leftRate = 0.19; // 左右各占的比例
let rightRate = 0.81;
let ballsAndPeilvData = [];

class Balls0_9Peilv extends Component {

  constructor(props) {
    super(props);

    // 这里根据传进来的号码，编历给个初始化的状态。点击选择的时候还更改状态。
    let ballsArr = [];
    for (let i = 0; i < this.props.balls.length; i++) {
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

    // 机选
    if (nextProps.isBallsChange) {
      // 如果为真，则是点了机选。然后就往下走了
      let ballsArr = [];
      let racInt = Math.floor(Math.random() * nextProps.balls.length);
      for (let i = 0; i < nextProps.balls.length; i++) {
        if (i == racInt) {
          ballsArr.push({ball:nextProps.balls[i], state:true});
        } else {
          ballsArr.push({ball:nextProps.balls[i], state:false});
        }
      }
      this.setState({
        ballState: ballsArr,
      })
      // 选了号，回调！
      this.props.ballClick?this.props.ballClick(this._selectBalls(ballsArr)):null;
    }

    // 清空
    if (nextProps.clearAllBalls) {
      for (let i = 0; i < nextProps.balls.length; i++) {
        this.state.ballState[i].state = false;
      }
      this.setState({
        ballState: this.state.ballState,
      })
      this.props.ballClick?this.props.ballClick(this._selectBalls(this.state.ballState)):null;
    }

  }

  _renderItemView(item) {
    let ballWidth = Adaption.Width(43);
    let remains = this.props.balls.length % this.props.numColumn; // 余数
    let row = parseInt(this.props.balls.length / this.props.numColumn, 10); // 要整数。
    // 有余数 要加1；
    if (remains > 0) {
      row = row + 1;
    }
    let peilvHeight = Adaption.Width(18); // 赔率显示的高，（比赔率fontSize 大1）。
    let insetW = (this.props.style.width * rightRate - (ballWidth * this.props.numColumn))/(this.props.numColumn+0.5);   //（item的宽 - 5个圆的宽）除6个间隔
    let insetH = (this.props.style.height - ((ballWidth + peilvHeight) * row))/(row + 1); //（item的高 - 2个圆的高）除3个间隔。
    let ispcddTpl3 = this.props.js_tag == 'pcdd' && this.props.tpl == '3';
    return(
      <View>
        <TouchableOpacity activeOpacity={0.6}
          style = {{width:ballWidth, height:ballWidth, borderRadius:ballWidth*0.5, marginLeft:insetW/2, marginRight:insetW/2, marginTop:insetH,
            justifyContent:'center', alignItems:'center', backgroundColor:this.state.ballState[item.index].state
            ? (ispcddTpl3 ? (item.index == 1 ? '#38b06e' : item.index == 2 ? '#1b82e8' : '#f00'):'#f00') :'#fff'}}
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
    let selectBallArr = [];
    let selectPeilvs = [];
    let numBalls = [];

    // 有些是中文的，多返回一个数字的回去。（豹子 顺子 对子）
    let isSscTpl6 = this.props.js_tag == 'ssc' && this.props.tpl == 6;
    let isPcddTpl234 = this.props.js_tag == 'pcdd' && (this.props.tpl == 2 || this.props.tpl == 3 || this.props.tpl == 4);

    ballStates.map((dic, idx) => {
      // 编历，如果它的state是true，就添加到selectBallArr数组。
      if (dic.state == true) {
        selectBallArr.push(dic.ball);

        let dict = ballsAndPeilvData[idx];
        selectPeilvs.push(dict.peilv);

        if (isSscTpl6 || isPcddTpl234) {
          numBalls.push(idx); // 返回中文号码的下标 如：（豹子 顺子 对子） = （0 1 2 ）
        }

      }
    })
    // 最后返回一个字典； 表达式／变量做为字典的key时，要放在方括号内。
    if (isSscTpl6 || isPcddTpl234) {
      return {[this.props.leftTitle] : selectBallArr, [this.props.leftTitle + '0'] : numBalls, '赔率' : selectPeilvs};
    } else {
      return {[this.props.leftTitle] : selectBallArr, '赔率' : selectPeilvs};
    }
  }

  render() {

    return(
      <View style = {this.props.style}>
        <View style = {{flexDirection:'row', width:this.props.style.width, height:this.props.style.height - 1}}>

          <View style = {{width:this.props.style.width * leftRate, justifyContent:'center', alignItems:'flex-end'}}>
            <TouchableOpacity activeOpacity={1}>
              <ImageBackground style={{width:Adaption.Width(75),height:Adaption.Width(30), justifyContent:'center', alignItems:'center'}}
                source={ require('../../../img/ic_ballNoClick.png')}>
                <Text allowFontScaling={false} style = {{backgroundColor:'rgba(0,0,0,0)', color:'#fff', marginLeft:Adaption.Width(-6), fontSize:Adaption.Font(15)}}>{this.props.leftTitle}</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>

          <FlatList style = {{width:this.props.style.width * rightRate}}
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
        <View style = {{height:1, width:this.props.style.width, backgroundColor:'#d3d3d3'}}></View>
      </View>
    )
  }

}

export default Balls0_9Peilv;
