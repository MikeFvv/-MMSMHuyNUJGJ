/**
 Author Money
 Created by on 2017/10/06
 --------------
 |      龙     |
 | 06 18 30 42 |
 --------------
    11.322
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

class LhcBallsBlockNumPeilv extends Component {

  constructor(props) {
    super(props);

    // 这里根据传进来的号码，编历给个初始化的状态。点击选择的时候还更改状态。
    let ballsArr = [];
    for (var i = 0; i < this.props.balls.length; i++) {
      ballsArr.push({ball:this.props.balls[i], state:false});
    }

    ballsAndPeilvData = [];
    if (this.props.isHeXiao == true) {
      // 合肖，在顶上显示赔率。
      for (let i = 0; i < this.props.balls.length; i++) {
        ballsAndPeilvData.push({key:i, 'ball':this.props.balls[i], 'ballNumDec':this.props.ballsNumDec[i]})
      }

    } else if (this.props.balls.length <= this.props.peilvs.length) {
      for (let i = 0; i < this.props.balls.length; i++) {
        ballsAndPeilvData.push({key:i, 'ball':this.props.balls[i], 'peilv':this.props.peilvs[i], 'ballNumDec':this.props.ballsNumDec[i]})
      }
    }
    let pl = 0;
    if (this.props.tpl == 14 || this.props.tpl == 15) {
      pl = this.props.peilvs;
    }
    this.state = {
      ballState: ballsArr,
      currentPeilv:pl,
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
    let ballWidth = Adaption.Width(125);
    let ballHeight = Adaption.Height(75);

    if (this.props.itemWidth > 0) {
      ballWidth = this.props.itemWidth;
      ballHeight = this.props.itemHeight;
    }

    let remains = this.props.balls.length % this.props.numColumn; // 余数
    var row = parseInt(this.props.balls.length / this.props.numColumn, 10); // 要整数。
    // 有余数 要加1；
    if (remains > 0) {
      row = row + 1;
    }
    let peilvHeight = Adaption.Width(18); // 赔率显示的高，（比赔率fontSize 大1）。
    if (this.props.isHeXiao == true) {
      peilvHeight = 0;
    }
    let insetW = (this.props.style.width - (ballWidth * this.props.numColumn))/(this.props.numColumn);   //（item的宽 - 5个圆的宽）除6个间隔
    let insetH = (this.props.style.height - 40 - ((ballHeight + peilvHeight) * row))/(row + 1); //（item的高 - 2个圆的高）除3个间隔。

    return(
      <View>
        <TouchableOpacity activeOpacity={0.8}
          style = {{width:ballWidth, height:ballHeight, borderRadius:Adaption.Width(8), marginLeft:insetW/2, marginRight:insetW/2, marginTop:insetH,
            justifyContent:'center', alignItems:'center', backgroundColor:this.state.ballState[item.index].state?'#f00':'#fff'}} 
            // backgroundColor:this.state.ballState[item.index].state?'#f00':'#fff'
            // backgroundColor:'#fff', borderWidth:1, borderColor:this.state.ballState[item.index].state?'#f00':'rgba(0,0,0,0)'
            onPress = {()=> {
              this._selectBallsLimit(item);
            }}>
          <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(21), color:this.state.ballState[item.index].state?'#fff':'#f00'}}>{item.item.ball}</Text>
          <Text allowFontScaling={false} style = {{marginTop:5, fontSize:Adaption.Font(17), color:this.state.ballState[item.index].state?'#fff':'#f00'}}>{item.item.ballNumDec}</Text>
          {/* <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(21), color:'#444'}}>{item.item.ball}</Text>
          <Text style = {{flexDirection:'row', marginTop:5}}>{this._ballsTextView(this.state.ballState[item.index].state, item.item.ballNumDec)}</Text> */}
        </TouchableOpacity>

        {this.props.isHeXiao ? null :
          <View style = {{height:peilvHeight}}>
            <Text allowFontScaling={false} style = {{textAlign:'center', fontSize:Adaption.Font(16), color:'#666'}}>{global.UserLoginObject.Token == '' ? '-.-' : item.item.peilv}</Text>
          </View>
        }
      </View>
    )
  }

  _ballsTextView(state, ballsStr) {
    let ballAr = ballsStr.split(' ');
    var ballViews = [];
    for (ba in ballAr) {
      let color = this._colorWithBall(ballAr[ba]);
      let tit = `${ballAr[ba]} `;
      ballViews.push(
        <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(17), color:state?color:color}}>{tit}</Text>
      )
    }
    return ballViews;
  }

  _colorWithBall (ball) {
    var selectColor = '#f00';
    var default_color = {
      red: {name: '红波', color: '#e6374e', val: 0, balls: ['01','02','07','08','12','13','18','19','23','24','29','30','34','35','40','45','46']},
      blue: {name: '蓝波', color: '#1b82e8', val: 1, balls: ['03','04','09','10','14','15','20','25','26','31','36','37','41','42','47','48']},
      green: {name: '绿波', color: '#38b06e', val: 2, balls: ['05','06','11','16','17','21','22','27','28','32','33','38','39','43','44','49']}
    }

    for (var b in default_color) {
      let ballAr = default_color[b].balls;
      if (ballAr.includes(ball)) {
        selectColor = default_color[b].color;
        break;
      }
    }
    return selectColor;
  }

  // 选择号码的限制
  _selectBallsLimit(item) {

    if (this.props.isHeXiao) {

      // 合肖（11个）、连肖（6个）、连尾（6个）。要限制选号个数
      this.state.ballState[item.index].state = !this.state.ballState[item.index].state;
      let len = 0;
      if (this.props.tpl == '7') {
        len = 11;
      } else if (this.props.tpl == '14' || this.props.tpl == '15') {
        len = 6;
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
    var selectPeilvs = [];
    var numBalls = [];

    ballStates.map((dic, idx) => {
      // 编历，如果它的state是true，就添加到selectBallArr数组。
      if (dic.state == true) {
        selectBallArr.push(dic.ball);
        if (this.props.tpl == '14' || this.props.tpl == '7' || this.props.tpl == '6' ||  this.props.tpl == '8') {
          numBalls.push(idx+1); // 连肖 \ 特肖-合肖 \特肖-特肖、平特一肖 \ 五行 下标从1开始
        } else {
          numBalls.push(idx);// 返回中文号码的下标
        }

        if (this.props.isHeXiao == false) {
          let dict = ballsAndPeilvData[idx];
          selectPeilvs.push(dict.peilv);
        }
      }
    })

    let isCurrentPeilv = this.state.currentPeilv;
    if (this.props.isHeXiao == true && this.props.tpl == 7) {
      if (selectBallArr.length >= 2 && selectBallArr.length <= 11) {
        isCurrentPeilv = this.props.peilvs[selectBallArr.length - 2];

        this.setState({
          currentPeilv:isCurrentPeilv,
        })
      } else if (selectBallArr.length < 2) {
        isCurrentPeilv = 0;
        this.setState({
          currentPeilv:isCurrentPeilv,
        })
      }
    }

    // 最后返回一个字典； 表达式／变量做为字典的key时，要放在方括号内。
    return {[this.props.playTitle] : selectBallArr, [this.props.playTitle + '0'] : numBalls, '赔率' : this.props.isHeXiao ? isCurrentPeilv : selectPeilvs};
  }

  render() {

    return(
      <View style = {this.props.style}>
        <View style = {{height:30, width:this.props.style.width, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
          <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(16), color:'#f00'}}>{this.props.playTitle}</Text>
          <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(16), color:'#333', marginLeft:20}}>赔率</Text>
          {this.props.isHeXiao ? <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(16), color:'#f00', marginLeft:5}}>{global.UserLoginObject.Token == '' ? '-.-' : this.state.currentPeilv}</Text> : null}
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

export default LhcBallsBlockNumPeilv;
