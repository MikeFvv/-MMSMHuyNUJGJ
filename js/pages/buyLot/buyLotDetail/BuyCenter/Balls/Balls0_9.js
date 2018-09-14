/**
 Author Money
 Created by on 2017/10/01
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

let leftRate = 0.19; // 左右各占的比例
let rightRate = 0.81;

let tempArcInt = -1;
let tempArcArr = []; // 避免随机重复的

let lastBall = -1; // 上次点的。11x5不能选相同的。
let lastIdx = -1; // 哪排

class Balls0_9 extends Component {

  constructor(props) {
    super(props);

    // 这里根据传进来的号码，编历给个初始化的状态。点击选择的时候还更改状态。
    let ballsArr = [];
    for (var i = 0; i < this.props.balls.length; i++) {
      ballsArr.push({ball:this.props.balls[i].ball, state:false});
    }

    this.state = {
      ballState: ballsArr,
      isShowLeft:false,
    };
  }

  componentWillReceiveProps(nextProps) {

    // 机选
    if (nextProps.isBallsChange) {
      lastBall = -1; // 这个是手动点击选择号码时要记录的，点了机选就要重置了
      this._arcBallsMethod(nextProps);
    }

    // 清空
    if (nextProps.clearAllBalls) {
      for (let i = 0; i < nextProps.balls.length; i++) {
         this.state.ballState[i].state = false;
      }
      this.setState({
        ballState:this.state.ballState,
        isShowLeft:false,// 有时左边展开了，也要关掉
      })
      this.props.ballClick?this.props.ballClick(this._selectBalls(this.state.ballState)):null;
    }

    // 如果是点机选的，不能进这里。手动选号才能进入
    if (!nextProps.isBallsChange && lastBall >= 0) {
      // 11x5和k3的几种玩法。不能选相同号的处理。
      let k3_3 = nextProps.js_tag == 'k3' && nextProps.playid == '5' || nextProps.playid == '8' || nextProps.playid == '10';
      let x11x5 = nextProps.js_tag == '11x5' && nextProps.tpl == '3';
      if (x11x5 || k3_3) {
        if ((lastIdx == 1 && nextProps.idx == 2) || (lastIdx == 2 && nextProps.idx == 1)) {
          for (let a = 0; a < this.state.ballState.length; a++) {
            // 如果为true且和lastBall相等，就设为false，再走一次回调。
            if (this.state.ballState[a].state == true && lastBall == a) {
              this.state.ballState[a].state = false;
              this.props.ballClick?this.props.ballClick(this._selectBalls(this.state.ballState)):null;
              break;
            }
          }
        }
      }
    }

  }

  _arcBallsMethod (nextProps) {
    // 如果为真，则是点了机选。然后就往下走了
    let js_tag = nextProps.js_tag;
    let playid = nextProps.playid;
    let idx = nextProps.idx; // idx是拿到当前是第几排，有些随机选择每排选择的号码个数不一样时就用来区别了

    let ballsArr = [];
    let arcNumArr = []; // 随机要选择的数。
    if (js_tag == 'ssc') {
      // ssc 走这里， 再判断playid。
      if (playid == '83') {
        // 五星-组选120
        arcNumArr = this._returnArcBallArr(5);  // 随机选择5个号码

      } else if (playid == '84') {
        // 五星-组选60
        if (idx == 2) {
          arcNumArr = this._returnArcBallArr(3); // 第二排选择3个号码
        } else {
          arcNumArr = this._returnArcBallArr(1); // 第一排选择1个号码
          tempArcArr = arcNumArr; // idx=1存随机的数。当idx=2时随机出来的数不能有同这个数组的数。
        }
      } else if (playid == '85') {
        // 五星-组选30
        if (idx == 1) {
          arcNumArr = this._returnArcBallArr(2);
          tempArcArr = arcNumArr;
        } else {
          arcNumArr = this._returnArcBallArr(1);
        }
      } else if (playid == '86' || playid == '91' || playid == '98') {
        // 五星-组选20 || 四星-后、前四组选12
        if (idx == 2) {
          arcNumArr = this._returnArcBallArr(2);
        } else {
          arcNumArr = this._returnArcBallArr(1);
          tempArcArr = arcNumArr;
        }
      } else if (playid == '90' || playid == '97') {
        // 四星-后、前四组选24
        arcNumArr = this._returnArcBallArr(4);
      } else if (playid == '92' || playid == '99') {
        // 四星-后、前四组选6
        arcNumArr = this._returnArcBallArr(2);
      } else if (playid == '10' || playid == '24' || playid == '106' || playid == '119' || playid == '37' || playid == '43' || playid == '45' || playid == '47' || playid == '49' || playid == '51') {
        // 三星-后、前、中三组三复式 || 后、前二组选复式 || 不定位-前、后三二码、 前、后四二码、 五星二码
        arcNumArr = this._returnArcBallArr(2);
      } else if (playid == '12' || playid == '26' || playid == '108' || playid == '52') {
        // 三星-后、前、中三组六复式、 不定位-五星三码
        arcNumArr = this._returnArcBallArr(3);
      } else if (playid == '41' || playid == '79' || playid == '81') {
        // 定位胆、定位大小单双、极限号，只有一个号
        // 投注时需要拼?号的。["3", "?", "?", "?", "?"] // list[0][balls]:3 ? ? ? ? // [xiangqing]:万位(3)
        // ? 1|2|3 ? ? ?  == 千位(小|单|双)   // 有： @"ssc" 41 78 79 81; // @"3d" 12 (定位胆, 没有随机);
        if (idx == 1) {
          // 第一个进来先随机一个数，确定在哪一排
          tempArcInt = Math.floor(Math.random() * 5) + 1;
        }
        if (tempArcInt == idx) {
          arcNumArr = this._returnArcBallArr(1);
        }

      } else if (playid == '57') {
        // 任二-直选复式 ／ 选2个号
        if (idx == 1) {
          // 第一个进来先随机两个数，确定在哪一排
          tempArcInt = this._returnArcBallArr(2, 5).join('-');
        }
        let tempArcIntArr = tempArcInt.split('-');
        // 分隔了 再判断这个数组是否包含idx-1
        if (tempArcIntArr.includes((idx - 1).toString())) {
          arcNumArr = this._returnArcBallArr(1);
        }

      } else if (playid == '60' || playid == '66') {
        // 任二-组选复式, 任三-组三复式 ／ 选2个号
        arcNumArr = this._returnArcBallArr(2);
      } else if (playid == '63') {
        // 任三-直选复式 ／ 选3个号
        if (idx == 1) {
          // 第一个进来先随机两个数，确定在哪一排
          tempArcInt = this._returnArcBallArr(2, 5).join('-');
        }
        let tempArcIntArr = tempArcInt.split('-');
        // 分隔了 再判断这个数组是否包含idx-1
        if (!tempArcIntArr.includes((idx - 1).toString())) {
          arcNumArr = this._returnArcBallArr(1);
        }

      } else if (playid == '68') {
        // 任三-组六复式 ／ 选3个号
        arcNumArr = this._returnArcBallArr(3);
      } else if (playid == '72') {
        // 任四-直选复式 ／ 选4个号
        if (idx == 1) {
          // 第一个进来先随机一个数，确定在哪一排
          tempArcInt = Math.floor(Math.random() * 5) + 1;
        }
        if (tempArcInt != idx) {
          arcNumArr = this._returnArcBallArr(1);
        }

      } else if (playid == '74') {
        // 任四-组选24 ／ 选4个号
        arcNumArr = this._returnArcBallArr(4);

      } else if (playid == '75') {
        // 任四-组选12
        if (idx == 2) {
          arcNumArr = this._returnArcBallArr(2);
        } else {
          arcNumArr = this._returnArcBallArr(1);
          tempArcArr = arcNumArr;
        }
      } else if (playid == '76') {
        // 任四-组选6
        arcNumArr = this._returnArcBallArr(2);
      } else {
        if (idx == 1) {
          arcNumArr = this._returnArcBallArr(1);
          tempArcArr = arcNumArr;
        } else {
          arcNumArr = this._returnArcBallArr(1);
        }
      }

    } else if (js_tag == 'pcdd') {
      if (playid == '2') {
        // 特码包三
        arcNumArr = this._returnArcBallArr(3);
      } else if (playid == '6' || playid == '7') {
        // 信用 - 定位胆、定位大小单双 只选一个号
        if (idx == 1) {
          tempArcInt = Math.floor(Math.random() * 3) + 1;
        }
        if (tempArcInt == idx) {
          arcNumArr = this._returnArcBallArr(1);
        }

      } else {
        arcNumArr = this._returnArcBallArr(1);
      }

    } else if (js_tag == '11x5') {
      if (playid == '3' || playid == '8' || playid == '13') {
        // 前\中\后三组选复式
        arcNumArr = this._returnArcBallArr(3);
      } else if (playid == '5' || playid == '10' || playid == '15') {
        // 前\中\后三组选胆拖
        arcNumArr = (idx == 2) ? this._returnArcBallArr(2) : this._returnArcBallArr(1);
        tempArcArr = (idx == 1) ? arcNumArr : [];
      } else if (playid == '18' || playid == '23') {
        // 前\后二组选复式
        arcNumArr = this._returnArcBallArr(2);
      } else if (playid == '29' || playid == '52') {
        // 定位胆  // 信用-定位大小单双 只选一个号。
        if (idx == 1) {
          tempArcInt = Math.floor(Math.random() * 5) + 1;
        }
        if (tempArcInt == idx) {
          arcNumArr = this._returnArcBallArr(1);
        }

      } else if (playid == '31') {
        // 任选二中二  - 任选复式
        arcNumArr = this._returnArcBallArr(2);
      } else if (playid == '32') {
        // 任选三中三
        arcNumArr = this._returnArcBallArr(3);
      } else if (playid == '33') {
        // 任选四中四
        arcNumArr = this._returnArcBallArr(4);
      } else if (playid == '34') {
        // 任选五中五
        arcNumArr = this._returnArcBallArr(5);
      } else if (playid == '35') {
        // 任选六中五
        arcNumArr = this._returnArcBallArr(6);
      } else if (playid == '36') {
        // 任选七中五
        arcNumArr = this._returnArcBallArr(7);
      } else if (playid == '37') {
        // 任选八中五
        arcNumArr = this._returnArcBallArr(8);

      } else if (playid == '46') {
        // 任选三中三  - 任选胆拖
        arcNumArr = (idx == 2) ? this._returnArcBallArr(2) : this._returnArcBallArr(1);
        tempArcArr = (idx == 1) ? arcNumArr : [];

      } else if (playid == '47') {
        // 任选四中四
        arcNumArr = (idx == 2) ? this._returnArcBallArr(3) : this._returnArcBallArr(1);
        tempArcArr = (idx == 1) ? arcNumArr : [];

      } else if (playid == '48') {
        // 任选五中五
        arcNumArr = (idx == 2) ? this._returnArcBallArr(4) : this._returnArcBallArr(1);
        tempArcArr = (idx == 1) ? arcNumArr : [];

      } else if (playid == '49') {
        // 任选六中五
        arcNumArr = (idx == 2) ? this._returnArcBallArr(5) : this._returnArcBallArr(1);
        tempArcArr = (idx == 1) ? arcNumArr : [];

      } else if (playid == '50') {
        // 任选七中五
        arcNumArr = (idx == 2) ? this._returnArcBallArr(6) : this._returnArcBallArr(1);
        tempArcArr = (idx == 1) ? arcNumArr : [];

      } else if (playid == '51') {
        // 任选八中五
        arcNumArr = (idx == 2) ? this._returnArcBallArr(7) : this._returnArcBallArr(1);
        tempArcArr = (idx == 1) ? arcNumArr : [];

      } else {
        arcNumArr = this._returnArcBallArr(1);
        if (idx == 1) {
          tempArcArr = arcNumArr;
        } else if (idx == 2) {
          tempArcArr = [...tempArcArr, ...arcNumArr]
        }
      }

    } else if (js_tag == 'k3') {
      if (playid == '4') {
        // 三不同 - 标准
        arcNumArr = this._returnArcBallArr(3);
      } else if (playid == '5') {
        // 三不同 - 胆拖
        arcNumArr = (idx == 2) ? this._returnArcBallArr(2) : this._returnArcBallArr(1);
        tempArcArr = (idx == 1) ? arcNumArr : [];

      } else if (playid == '9') {
        // // 二不同 - 标准
        arcNumArr = this._returnArcBallArr(2);

      } else if (playid == '11') {
        // 定位大小单双 只有一个号. 需要拼?号的。
        if (idx == 1) {
          // 第一个进来先随机一个数，确定在哪一排
          tempArcInt = Math.floor(Math.random() * 3) + 1;
        }
        if (tempArcInt == idx) {
          arcNumArr = this._returnArcBallArr(1);
        }

      } else {
        arcNumArr = this._returnArcBallArr(1);
        tempArcArr = (idx == 1 && this.props.balls.length > 1) ? arcNumArr : [];
      }
    } else if (js_tag == 'pk10') {
      if (playid == '6' || playid == '10') {
        // 定位胆、信用-定位大小单双
        if (idx == 1) {
          tempArcInt = Math.floor(Math.random() * 10) + 1;
        }
        if (tempArcInt == idx) {
          arcNumArr = this._returnArcBallArr(1);
        }
      } else {
        arcNumArr = this._returnArcBallArr(1);
        if (idx == 1) {
          tempArcArr = arcNumArr;
        } else if (idx == 2) {
          tempArcArr = [...tempArcArr, ...arcNumArr]
        }
      }
    } else {
      arcNumArr = this._returnArcBallArr(1);
    }

    for (let i = 0; i < nextProps.balls.length; i++) {
      // 如果arcNumArr包含有i，就true。
      if (arcNumArr.includes(i)) {
        ballsArr.push({ball:nextProps.balls[i].ball, state:true});
      } else {
        ballsArr.push({ball:nextProps.balls[i].ball, state:false});
      }
    }

    if (ballsArr.length == this.props.balls.length) {
        this.setState({
          ballState: ballsArr,
          isShowLeft:false, // 有时左边展开了，也要关掉
        })
        // 选了号，回调！
        this.props.ballClick?this.props.ballClick(this._selectBalls(ballsArr)):null;
    }

  }

  _returnArcBallArr(count, lenght) {
    // 传入个数，返回随机数。不能重复！
    let arcArr = [];
    for (let i = 0; i < 100; i++) {
        let arcInt = Math.floor(Math.random() * (lenght ? lenght : this.props.balls.length));
        // 如果存在，就不加入数组。
        if ((!arcArr.includes(arcInt)) && (!tempArcArr.includes(arcInt))) {
            arcArr.push(arcInt);
            if (arcArr.length >= count) {
                break; // 个数够了，就退出循环。
            }
        }
    }
    return arcArr;
  }

  _renderItemView(item) {
    let ballWidth = Adaption.Width(43);
    let ballHeight = ballWidth;
    let radius = ballWidth * 0.5;
    if (this.props.isTSWidth > 0) {
      ballWidth = this.props.isTSWidth;
      radius = Adaption.Width(10);
    }
    let remains = this.props.balls.length % this.props.numColumn; // 余数
    
    let row = parseInt(this.props.balls.length / this.props.numColumn); // 要整数。
    // 有余数 要加1；
    if (remains > 0) {
      row = row + 1;
    }
    let insetW = (this.props.style.width * rightRate - (ballWidth * this.props.numColumn))/(this.props.numColumn+1);   //（item的宽 - 5个圆的宽）除6个间隔
    let insetH = (this.props.style.height - (ballHeight * row))/(row + 1); //（item的高 - 2个圆的高）除3个间隔。

    return(
      <TouchableOpacity activeOpacity={0.6}
        style = {{width:ballWidth, height:ballHeight, borderRadius:radius, marginLeft:insetW, marginTop:insetH,
          justifyContent:'center', alignItems:'center', backgroundColor:this.state.ballState[item.index].state?'#f00':'#fff'}}
          onPress = {()=> {
            lastBall = item.index;
            lastIdx = this.props.idx;
            this._selectBallsLimit(item)
          }}>
        <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(17), color:this.state.ballState[item.index].state?'#fff':'#f00'}}>{item.item.ball}</Text>
      </TouchableOpacity>
    )
  }

  // 选择号码的限制
  _selectBallsLimit(item) {

    let pcdd3 = this.props.js_tag == 'pcdd' && this.props.tpl == 1; // pcdd 特码包三
    let x11x5 = this.props.js_tag == '11x5' && this.props.tpl == 3 && this.props.idx == 1;
    let k3_3 = this.props.js_tag == 'k3' && (this.props.playid == '5' || this.props.playid == '10');

    if (this.props.js_tag == 'ssc' && this.props.tpl == 4) {
        // 时时彩-三星-组选包胆，只能选择一个号码的。
        for (let i = 0; i < this.state.ballState.length; i++) {
           if (item.index == i) {
             this.state.ballState[item.index].state = !this.state.ballState[item.index].state;
           } else {
             this.state.ballState[i].state = false;
           }
        }

    } else if (pcdd3 || x11x5 || k3_3) {
      let playid = this.props.playid;
      let len = 0;
      if (pcdd3) {
        len = 3; // pcdd 特码包三

      } else if (k3_3) {
        if (this.props.idx == 1) {
          if (this.props.playid == '5') { // 三不同号胆拖
            len = 2; 
          } else if (this.props.playid == '10') { // 二不同号胆拖
            len = 1; 
          }
        } else {
          if (this.props.playid == '5' || this.props.playid == '10') {
            len = 5;  
          }
        }

      } else if (x11x5) {
        if (playid == '20' || playid == '25' || playid == '45') {
          len = 1; //前后二组选胆拖 || 任选二中二

        } else if (playid == '5' || playid == '10' || playid == '15' || playid == '46') {
          len = 2; // 前中后三组选胆拖 || 任选三中三

        } else if (playid == '47') {
          len = 3; // 任选四中四

        } else if (playid == '48') {
          len = 4; // 任选五中五

        } else if (playid == '49') {
          len = 5; // 任选六中五

        } else if (playid == '50') {
          len = 6; // 任选七中五

        } else if (playid == '51') {
          len = 7; // 任选八中五
        }
      }

        this.state.ballState[item.index].state = !this.state.ballState[item.index].state;
        // 编历它true的个数
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
      isShowLeft:false,
    })
    this.props.ballClick?this.props.ballClick(this._selectBalls(this.state.ballState)):null;
  }

  // 选择的号码，
  _selectBalls(ballStates) {
    let selectBallArr = [];
    let numBalls = [];

    // 有些是中文的，多返回一个数字的回去。（大 小 单 双）
    let tpl = this.props.tpl;
    let isSscTpl5 = this.props.js_tag == 'ssc' && tpl == 5;
    let isPk10Tpl56 = this.props.js_tag == 'pk10' && (tpl == 5 || tpl == 6);
    let is11x5Tpl45 = this.props.js_tag == '11x5' && (tpl == 4 || tpl == 5);
    let is3dTpl5 = this.props.js_tag == '3d' && (tpl == 5 || tpl == 6 || tpl == 8 || tpl == 10 || tpl == 13 || tpl == 14 || tpl == 7 || tpl == 9 || tpl == 11);
    let isK3Tpl14 = this.props.js_tag == 'k3' && (tpl == 1 || tpl == 2 || tpl == 4 || tpl == 5 || tpl == 6 || tpl == 7 || tpl == 8);
    let isPcddTpl6 = this.props.js_tag == 'pcdd' && tpl == 6;

    ballStates.map((dic, idx) => {
      // 编历，如果它的state是true，就添加到selectBallArr数组。
      if (dic.state == true) {
        selectBallArr.push(dic.ball.toString());

        if (isSscTpl5 || isPk10Tpl56 || is11x5Tpl45 || is3dTpl5 || isK3Tpl14 || isPcddTpl6) {
          if (this.props.js_tag == 'k3' && (tpl == 2 || tpl == 5 || tpl == 6)) {
            numBalls.push((idx+1).toString());
          } else {
            numBalls.push(idx.toString());  // 返回中文号码下标的 如：（大 小 单 双） = （0 1 2 3）
          }
        }

      }
    })

    if (this.props.js_tag == 'ssc' && selectBallArr.length <= 0) {
      let playid = this.props.playid;
      // 这几个奇葩的，没有选择号 就要给个?回去。
      if (playid == '41' || playid == '79' || playid == '81') {
        selectBallArr.push('?');
        numBalls.push('?');
      }
    } else if (this.props.js_tag == '3d' && selectBallArr.length <= 0) {
      if (this.props.playid == '12') {
        selectBallArr.push('?');
      }
    } else if (this.props.js_tag == 'k3' && selectBallArr.length <= 0) {
      if (this.props.playid == '11') {
        selectBallArr.push('?');
        numBalls.push('?');
      }
    }

    // 最后返回一个字典； 表达式／变量做为字典的key时，要放在方括号内。
    if (isSscTpl5 || isPk10Tpl56 || is11x5Tpl45 || is3dTpl5 || isK3Tpl14 || isPcddTpl6) {
      return {[this.props.leftTitle] : selectBallArr,  [this.props.leftTitle + '0']: numBalls};
    } else {
      return {[this.props.leftTitle] : selectBallArr};
    }
  }

  render() {

    let leftImage = '';
    let titleMarginLeft = 0;
    let active = 1;
    let imgWidth = Adaption.Width(75);
    leftRate = 0.19;
    rightRate = 0.81;
    if (this.props.isLeftClick == true) {
      leftImage = require('../../../img/ic_ballOnClick.png');
      active = 0.6;

      if (this.props.leftTitle.length == 4) {
        leftRate = 0.24;
        rightRate = 0.76;
        imgWidth = Adaption.Width(95);
        titleMarginLeft = 4;
      } else if (this.props.leftTitle.length >= 5) {
        leftRate = 0.29;
        rightRate = 0.71;
        titleMarginLeft = 7;
        imgWidth = Adaption.Width(115);
      }

    } else if (this.props.isLeftClick == false) {
      leftImage = require('../../../img/ic_ballNoClick.png');
      titleMarginLeft = Adaption.Width(-6);
    }

    return(
      <TouchableOpacity activeOpacity = {1} style = {this.props.style} onPress = {()=> {
        this.setState({
          isShowLeft:false,
        })
      }}>
        <View style = {{flexDirection:'row', width:this.props.style.width, height:this.props.style.height - 1}}>
          <View style = {{width:this.props.style.width * leftRate, justifyContent:'center', alignItems:'flex-end'}}>
            <TouchableOpacity activeOpacity={active}
              onPress = {() => {
                this.props.isLeftClick ? this.setState({isShowLeft:!this.state.isShowLeft}):null
              }}>
              <ImageBackground style={{width:imgWidth,height:Adaption.Width(30), justifyContent:'center', alignItems:'center'}}
                source={leftImage}>
                <Text allowFontScaling={false} style = {{backgroundColor:'rgba(0,0,0,0)', color:'#fff', marginLeft:titleMarginLeft, fontSize:Adaption.Font(15)}}>{this.props.leftTitle}</Text>
              </ImageBackground>
            </TouchableOpacity>
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

        {this.state.isShowLeft ?
          <View style = {{
            position:'absolute',
            top:this.props.style.height/2 - Adaption.Height(22.5),
            left:this.props.style.width * leftRate,
            width:this.props.isOnlyAllClear ? Adaption.Width(100) : Adaption.Width(280),
            height:Adaption.Height(45),
            backgroundColor:'rgba(50,50,50,0.8)',
            borderRadius:Adaption.Height(45)*0.5,
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'space-between', 
          }}>

          <TouchableOpacity activeOpacity={0.6}
            style = {{marginLeft:10, width:Adaption.Height(30), height:Adaption.Height(30), borderRadius:Adaption.Height(30)*0.5,
              justifyContent:'center', alignItems:'center', backgroundColor:'#fff'}}
              onPress = {()=> {
                let ballsStates = [];
                this.state.ballState.map((dict, idx) => {
                  ballsStates.push({ball:dict.ball, state:true})
                })
                this.setState({
                  ballState: ballsStates,
                  isShowLeft: false,
                })
                this.props.ballClick?this.props.ballClick(this._selectBalls(ballsStates)):null;
              }}>
            <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(17), color:'#555'}}>全</Text>
          </TouchableOpacity>
          {this.props.isOnlyAllClear ? null :
            <TouchableOpacity activeOpacity={0.6}
              style = {{width:Adaption.Height(30), height:Adaption.Height(30), borderRadius:Adaption.Height(30)*0.5,
                justifyContent:'center', alignItems:'center', backgroundColor:'#fff'}}
                onPress = {()=> {
                  let ballsStates = [];
                  this.state.ballState.map((dict, idx) => {
                    ballsStates.push({ball:dict.ball, state:idx >= this.state.ballState.length/2 ? true : false})
                  })
                  this.setState({
                    ballState: ballsStates,
                    isShowLeft: false,
                  })
                  this.props.ballClick?this.props.ballClick(this._selectBalls(ballsStates)):null;
                }}>
              <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(17), color:'#555'}}>大</Text>
            </TouchableOpacity>
          }
          {this.props.isOnlyAllClear ? null :
            <TouchableOpacity activeOpacity={0.6}
              style = {{width:Adaption.Height(30), height:Adaption.Height(30), borderRadius:Adaption.Height(30)*0.5,
                justifyContent:'center', alignItems:'center', backgroundColor:'#fff'}}
                onPress = {()=> {
                  let ballsStates = [];
                  this.state.ballState.map((dict, idx) => {
                    ballsStates.push({ball:dict.ball, state:idx < this.state.ballState.length/2 ? true : false})
                  })
                  this.setState({
                    ballState: ballsStates,
                    isShowLeft: false,
                  })
                  this.props.ballClick?this.props.ballClick(this._selectBalls(ballsStates)):null;
                }}>
              <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(17), color:'#555'}}>小</Text>
            </TouchableOpacity>
          }
          {this.props.isOnlyAllClear ? null :
            <TouchableOpacity activeOpacity={0.6}
              style = {{width:Adaption.Height(30), height:Adaption.Height(30), borderRadius:Adaption.Height(30)*0.5,
                justifyContent:'center', alignItems:'center', backgroundColor:'#fff'}}
                onPress = {()=> {
                  let ballsStates = [];
                  this.state.ballState.map((dict, idx) => {
                    let ballInt = Number(dict.ball); // 有些号码（PK10）是字符串的，要转为整型
                    ballsStates.push({ball:dict.ball, state:ballInt % 2 == 1 ? true : false})
                  })
                  this.setState({
                    ballState: ballsStates,
                    isShowLeft: false,
                  })
                  this.props.ballClick?this.props.ballClick(this._selectBalls(ballsStates)):null;
                }}>
              <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(17), color:'#555'}}>奇</Text>
            </TouchableOpacity>
          }
          {this.props.isOnlyAllClear ? null :
            <TouchableOpacity activeOpacity={0.6}
              style = {{width:Adaption.Height(30), height:Adaption.Height(30), borderRadius:Adaption.Height(30)*0.5,
                justifyContent:'center', alignItems:'center', backgroundColor:'#fff'}}
                onPress = {()=> {
                  let ballsStates = [];
                  this.state.ballState.map((dict, idx) => {
                    let ballInt = Number(dict.ball);
                    ballsStates.push({ball:dict.ball, state:ballInt % 2 == 0 ? true : false})
                  })
                  this.setState({
                    ballState: ballsStates,
                    isShowLeft: false,
                  })
                  this.props.ballClick?this.props.ballClick(this._selectBalls(ballsStates)):null;
                }}>
              <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(17), color:'#555'}}>偶</Text>
            </TouchableOpacity>
          }
          <TouchableOpacity activeOpacity={0.6}
            style = {{marginRight:10, width:Adaption.Height(30), height:Adaption.Height(30), borderRadius:Adaption.Height(30)*0.5,
              justifyContent:'center', alignItems:'center', backgroundColor:'rgb(10,170,10)'}}
              onPress = {()=> {
                let ballsStates = [];
                this.state.ballState.map((dict, idx) => {
                  ballsStates.push({ball:dict.ball, state:false})
                })
                this.setState({
                  ballState: ballsStates,
                  isShowLeft: false,
                })
                this.props.ballClick?this.props.ballClick(this._selectBalls(ballsStates)):null;
              }}>
            <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(17), color:'#fff'}}>清</Text>
          </TouchableOpacity>
          </View> : null}
      </TouchableOpacity>
    )
  }

}

export default Balls0_9;
