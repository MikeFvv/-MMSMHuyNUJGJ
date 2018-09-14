/**
 Created by Money on 2018/01/05

    ①        ②
  480.8     49.80
-------------------------
  万位
    ⑩ ① ② ③
    ④ ⑤ ⑥ ⑦

  请不要格式化代码，谢谢！。
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import GetBallStatus from '../../newBuyTool/GetBallStatus';

let tempArcInt = -1;
let tempArcArr = []; // 避免随机重复的

let lastBall = -1; // 上次点的item。11x5不能选相同的。
let lastIdx = -1; // 哪排

class NewBalls0_9Peilv extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectBallIdxArr: [], // 选择号码的下标。
    }
  }

  componentWillReceiveProps(nextProps) {
    // 清空
    if (nextProps.clearAllBalls) {
      this.setState({
        selectBallIdxArr: [],
      })
      this._returnBallsData([]);
    }

    // 机选
    if (nextProps.isBallsChange) {
      lastBall = -1; // 这个是手动点击选择号码时要记录的，点了机选就要重置了
      this._arcBallsMethod(nextProps);
    }

    // 如果是点机选的，不能进这里。手动选号才能进入
    if (!nextProps.isBallsChange && lastBall >= 0) {
      // 11x5和k3的几种玩法。不能选相同号的处理。
      let x11x5 = nextProps.js_tag == '11x5' && nextProps.tpl == '3';
      if (x11x5) {
        if ((lastIdx == 0 && nextProps.idx == 1) || (lastIdx == 1 && nextProps.idx == 0)) {
          for (let a = 0; a < this.state.selectBallIdxArr.length; a++) {
            // 如果有和lastBall相等的，就删除它，再走一次回调。
            if (this.state.selectBallIdxArr[a] == lastBall) {
              this.state.selectBallIdxArr.splice(a, 1);
              this._returnBallsData(this.state.selectBallIdxArr);
              break;
            }
          }
        }
      }
    }
  }

  _arcBallsMethod(nextProps) {

    let js_tag = nextProps.js_tag;
    let playid = nextProps.playid;
    let idx = nextProps.idx; // idx是拿到当前是第几排，有些随机选择每排选择的号码个数不一样时就用来区别了
    let arcNumArr = []; // 随机要选择的数。

    if (js_tag == 'ssc') {
      if (playid == '83') {
        // 五星-组选120
        arcNumArr = this._returnArcBallArr(5);  // 随机选择5个号码

      } else if (playid == '84') {
        // 五星-组选60
        arcNumArr = this._returnArcBallArr(idx == 0 ? 1 : 3); // 第一排选择1个号码、第二排选择3个号码、
        tempArcArr = idx == 0 ? arcNumArr : []; // idx==0存随机的数。当idx=1时随机出来的数不能有同这个数组的数。

      } else if (playid == '85') {
        // 五星-组选30
        arcNumArr = this._returnArcBallArr(idx == 0 ? 2 : 1); 
        tempArcArr = idx == 0 ? arcNumArr : []; 

      } else if (playid == '86' || playid == '91' || playid == '98') {
        // 五星-组选20 // 四星-后、前组选12
        arcNumArr = this._returnArcBallArr(idx == 0 ? 1 : 2); 
        tempArcArr = idx == 0 ? arcNumArr : []; 

      } else if (playid == '90' || playid == '97') {
        // 四星-后、前组选24
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

      } else if (playid == '41') {
        if (idx == 0) {
          // 第一个进来先随机一个数，确定在哪一排
          tempArcInt = Math.floor(Math.random() * 5);
        }
        arcNumArr = tempArcInt == idx ? this._returnArcBallArr(1) : [];

      } else if (playid == '57') {
        // 任二-直选复式 ／ 选2个号
        if (idx == 0) {
          // 第一个进来先随机两个数，确定在哪一排
          tempArcInt = this._returnArcBallArr(2, 5).join('-');
        }
        let tempArcIntArr = tempArcInt.split('-');
        // 分隔了 再判断这个数组是否包含idx
        if (tempArcIntArr.includes((idx).toString())) {
          arcNumArr = this._returnArcBallArr(1);
        }
        
      } else if (playid == '60' || playid == '66') {
        // 任二-组选复式, 任三-组三复式
        arcNumArr = this._returnArcBallArr(2);

      } else if (playid == '63') {
        // 任三-直选复式 ／ 选3个号
        if (idx == 0) {
          // 第一个进来先随机两个数，确定在哪一排
          tempArcInt = this._returnArcBallArr(2, 5).join('-');
        }
        let tempArcIntArr = tempArcInt.split('-');
        // 分隔了 再判断这个数组是否包含idx-1
        if (!tempArcIntArr.includes((idx).toString())) {
          arcNumArr = this._returnArcBallArr(1);
        }

      } else if (playid == '68') {
        // 任三-组六复式 ／ 选3个号
        arcNumArr = this._returnArcBallArr(3);

      } else if (playid == '72') {
        // 任四-直选复式 ／ 选4个号
        if (idx == 0) {
          // 第一个进来先随机一个数，确定在哪一排
          tempArcInt = Math.floor(Math.random() * 5);
        }
        if (tempArcInt != idx) {
          arcNumArr = this._returnArcBallArr(1);
        }

      } else if (playid == '74') {
        // 任四-组选24 ／ 选4个号
        arcNumArr = this._returnArcBallArr(4);

      } else if (playid == '75') {
        // 任四-组选12
        arcNumArr = this._returnArcBallArr(idx == 0 ? 1 : 2);
        tempArcArr = idx == 0 ? arcNumArr : []; 

      } else if (playid == '76') {
        // 任四-组选6
        arcNumArr = this._returnArcBallArr(2);

      } else if (playid == '128' || playid == '129') {
        // 双面盘 || 龙虎斗
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * (playid == '128' ? 7 : 10));
        }
        arcNumArr = tempArcInt == idx ? this._returnArcBallArr(1) : [];

      } else {
        arcNumArr = this._returnArcBallArr(1);
        tempArcArr = idx == 1 ? [...tempArcArr, ...arcNumArr] : arcNumArr; // 防止机选重复
      }

    } else if (js_tag == '11x5') {

      if (playid == '3' || playid == '8' || playid == '13') {
        // 前\中\后三组选复式
        arcNumArr = this._returnArcBallArr(3);

      }else if (playid == '5' || playid == '10' || playid == '15') {
        // 前\中\后三组选胆拖
        arcNumArr = this._returnArcBallArr(idx == 0 ? 1 : 2); 
        tempArcArr = idx == 0 ? arcNumArr : []; 

       } else if (playid == '18' || playid == '23') {
        // 前\后二组选复式
        arcNumArr = this._returnArcBallArr(2);

      } else if (playid == '29') {
        // 定位胆 只选一个号。
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 5);
        }
        arcNumArr = tempArcInt == idx ? this._returnArcBallArr(1) : [];

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
        arcNumArr = this._returnArcBallArr(idx == 0 ? 1 : 2);
        tempArcArr = idx == 0 ? arcNumArr : [];

      } else if (playid == '47') {
        // 任选四中四
        arcNumArr = this._returnArcBallArr(idx == 0 ? 1 : 3);
        tempArcArr = idx == 0 ? arcNumArr : [];

      } else if (playid == '48') {
        // 任选五中五
        arcNumArr = this._returnArcBallArr(idx == 0 ? 1 : 4);
        tempArcArr = idx == 0 ? arcNumArr : [];

      } else if (playid == '49') {
        // 任选六中五
        arcNumArr = this._returnArcBallArr(idx == 0 ? 1 : 5);
        tempArcArr = idx == 0 ? arcNumArr : [];

      } else if (playid == '50') {
        // 任选七中五
        arcNumArr = this._returnArcBallArr(idx == 0 ? 1 : 6);
        tempArcArr = idx == 0 ? arcNumArr : [];

      } else if (playid == '51') {
        // 任选八中五
        arcNumArr = this._returnArcBallArr(idx == 0 ? 1 : 7);
        tempArcArr = idx == 0 ? arcNumArr : [];

      } else if (playid == '54') {
        // 龙虎斗
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 10);
        }
        arcNumArr = tempArcInt == idx ? this._returnArcBallArr(1) : [];

      } else if (playid == '56') {
        // 双面盘
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 7);
        }
        arcNumArr = tempArcInt == idx ? this._returnArcBallArr(1) : [];

      } else {
        arcNumArr = this._returnArcBallArr(1);
        tempArcArr = idx == 1 ? [...tempArcArr, ...arcNumArr] : arcNumArr; // 防止机选重复
      }

    } else if (js_tag == '3d') {
      
      if (playid == '4' || playid == '10' || playid == '11' || playid == '14') {
        // 三星-组三复式  // 前\后二组选复式 // 二码不定位
        arcNumArr = this._returnArcBallArr(2);

      } else if (playid == '5') {
        // 三星-组六复式
        arcNumArr = this._returnArcBallArr(3);

      } else if (playid == '12') {
        if (idx == 0) {
          // 第一个进来先随机一个数，确定在哪一排
          tempArcInt = Math.floor(Math.random() * 3);
        }
        arcNumArr = tempArcInt == idx ? this._returnArcBallArr(1) : [];

      } else if (playid == '26' || playid == '27') {
        // 双面盘 || 龙虎斗
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * (playid == '26' ? 5 : 3)); // 确定在哪一排
        }
        arcNumArr = tempArcInt == idx ? this._returnArcBallArr(1) : [];
        
      } else {
        arcNumArr = this._returnArcBallArr(1);
        tempArcArr = idx == 1 ? [...tempArcArr, ...arcNumArr] : arcNumArr; // 防止机选重复
      }

    } else if (js_tag == 'pcdd') {
      // 特码包三
      if (playid == '2') {
        arcNumArr = this._returnArcBallArr(3);
      } else if (playid == '3') {
        // 混合
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 2);
        }
        arcNumArr = tempArcInt == idx ? this._returnArcBallArr(1) : [];

      } else {
        arcNumArr = this._returnArcBallArr(1);
      }

    } else if (js_tag == 'pk10') {
      if (playid == '6' || playid == '14' || playid == '15') {
        // 定位胆 || 双面盘 || 数字盘
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 10);
        }
        arcNumArr = tempArcInt == idx ? this._returnArcBallArr(1) : [];

      } else if (playid == '7') {
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 2);
        }
        arcNumArr = tempArcInt == idx ? this._returnArcBallArr(1) : [];

      } else {
        arcNumArr = this._returnArcBallArr(1);
        tempArcArr = idx == 1 ? [...tempArcArr, ...arcNumArr] : arcNumArr; // 防止机选重复
      }

    } else if (js_tag == 'lhc') {
      if (playid == '21') {
        // 自选不中
        arcNumArr = this._returnArcBallArr(6);

      } else if (playid == '30' || playid == '31') {
        // 三中二 / 三全中
        arcNumArr = this._returnArcBallArr(3);

      } else if (playid == '32' || playid == '33' || playid == '34') {
        // 二全中 / 二中特 / 特串
        arcNumArr = this._returnArcBallArr(2);

      } else if (playid == '35') {
        // 四全中
        arcNumArr = this._returnArcBallArr(4);

      } else {
        arcNumArr = this._returnArcBallArr(1);
      }
    
    } else if (js_tag == 'k3') {
      if (playid == '14') {
        // 双面盘
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 4);
        }
        arcNumArr = tempArcInt == idx ? this._returnArcBallArr(1) : [];
      }  
    
    } else if (js_tag == 'qxc') {
      if (playid == 7) {
        // 和值组选
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 2);
        }
        arcNumArr = tempArcInt == idx ? this._returnArcBallArr(1) : [];
        
      } else if (playid == 8) {
        // 定位大小单双
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 4);
        }
        arcNumArr = tempArcInt == idx ? this._returnArcBallArr(1) : [];

      } else {
        arcNumArr = this._returnArcBallArr(1);
      }
    }

    // 小到大排序
    if (arcNumArr.length > 1) {
      for (var x = 0; x < arcNumArr.length - 1; x++) {
        for (var y = 0; y < arcNumArr.length - 1 - x; y++) {
          
          if (arcNumArr[y] > arcNumArr[y + 1]) {
            let tempa = arcNumArr[y];
            arcNumArr[y] = arcNumArr[y + 1];
            arcNumArr[y + 1] = tempa;
          }
        }
      }
    }

    this._returnBallsData(arcNumArr);  // 根据选择的下标回调 ball、peilv

    this.setState({
      selectBallIdxArr: arcNumArr,
    })
  }

  // 传入个数，返回随机的数组。不重复！
  _returnArcBallArr(count, lenght) {
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

  _selectBalls(item) {
    var ballIdxArr = this.state.selectBallIdxArr;

    if (ballIdxArr.includes(item.index)) {
      // 存在，删除
      for (let idx in ballIdxArr) {
        if (ballIdxArr[idx] == item.index) {
          ballIdxArr.splice(idx, 1);
          break;
        }
      }

    } else {
      // 没有值，直接存
      if (ballIdxArr.length <= 0) {
        ballIdxArr.push(item.index);

      } else {

        // 选号限制个数。
        let playid = this.props.playid;
        let pcdd = this.props.js_tag == 'pcdd' && this.props.tpl == 1; // pcdd 特码包三
        let zxbd = this.props.js_tag == 'ssc' && this.props.tpl == 4; // 时时彩-三星-组选包胆
        let x11x5 = this.props.js_tag == '11x5' && this.props.tpl == 3 && this.props.idx == 0;
        let lhcZxbz = this.props.js_tag == 'lhc' && this.props.tpl == '12'; // 六合彩 自选不中最多能选11个号。
        let lhcLm = this.props.js_tag == 'lhc' && this.props.tpl == '13';  // 连码 最多能选10个号。

        if (pcdd || zxbd || x11x5 || lhcZxbz || lhcLm) {
          let len = 0;
          if (pcdd) {
            len = 3;

          } else if (zxbd) {
            len = 1;

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

          }  else if (lhcZxbz) {
            len = 11;
          } else if (lhcLm) {
            len = 10;
          }

          if (ballIdxArr.length >= len) {
            ballIdxArr.splice(0, 1); // 删除第一位
          }
        }

        // 有值，按大小插入
        for (let idx in ballIdxArr) {
          if (item.index <= ballIdxArr[idx]) {
            ballIdxArr.splice(idx, 0, item.index);
            break;
          } else if (idx == ballIdxArr.length - 1) {
            ballIdxArr.push(item.index);
          }
        }

        // 没有值，直接存 是防止len = 1的
        if (ballIdxArr.length <= 0) {
          ballIdxArr.push(item.index);
        }

      }
    }

    this.setState({
      selectBallIdxArr: ballIdxArr,
    })
    this._returnBallsData(ballIdxArr); // 根据选择的下标回调 ball、peilv
  }


  // 根据选择的ball下标 返回ball、peilv。
  _returnBallsData(selectBallIdxArr) {

    var selectBallArr = [], selectBallNumArr = [], selectPeilvs = [];
    let ssc_LHD = this.props.js_tag == 'ssc' && this.props.playid == '129'; // 龙虎斗 也不返回赔率
    let d3d_LHD = this.props.js_tag == '3d' && this.props.playid == '27';  // 龙虎斗 
    let pcddHH = this.props.js_tag == 'pcdd' && this.props.playid == 3;  // PCDD混合
    
    let pk10gyh = this.props.js_tag == 'pk10' && this.props.playid == 7;  // PK10冠亚和  下标从0开始

    for (let a = 0; a < selectBallIdxArr.length; a++) {
      let idx = selectBallIdxArr[a];
      let ball = this.props.balls[idx].ball;
      selectBallArr.push(`${ball}`);

      let preg = /^([\d]|[\d][\d])$/; // [\d] === [0-9] 查找数字
      if (!preg.test(ball) || pk10gyh) {
        // 非数字的ball 要返回数字下标。
        // 如果.ballNum不为null。那就是双面盘的。
        if (this.props.balls[idx].ballNum != null) {
          selectBallNumArr.push(`${this.props.balls[idx].ballNum}`);
        } else {
          selectBallNumArr.push(`${idx}`);
        }
      }

      let peilv = this.props.balls[idx].peilv;
      let isSMP = this.props.balls[idx].ballNum != null || pcddHH; // 双面盘不返回赔率，计算注数不能要赔率。在下注拼接时根据下标去获取。

      if (peilv != null && !isSMP && !ssc_LHD && !d3d_LHD) { 
        selectPeilvs.push(this.props.balls[idx].peilv);
      }
    }

    /*
    // 没有选号也要返回一个？
    if (selectBallIdxArr.length <= 0) {
      if ((this.props.js_tag == 'ssc' && this.props.playid == '41') || (this.props.js_tag == '3d' && this.props.playid == '12')) {
        // 定位胆
        selectBallArr = ['?'];
      }
    }
    */

    let ballsdata = { [this.props.title]: selectBallArr };
    if (selectBallNumArr.length > 0) {
      ballsdata[`${this.props.title}^^01`] = selectBallNumArr;
    }

    if (selectPeilvs.length > 0) {
      ballsdata['赔率'] = selectPeilvs;
    }
    this.props.ballClick ? this.props.ballClick(ballsdata) : null;
  }


  _renderItemView(item) {
    let pk10Gyh = this.props.idx == 0 && this.props.js_tag == 'pk10' && this.props.playid == 7; // pk10冠亚和 一排

    let ballWidth = Adaption.Width(43.5);  // 号码球的大小
    let numColumn = this.props.numColumn ? this.props.numColumn : 4;
    let remains = this.props.balls.length % numColumn; // 余数
    let row = (Number.parseInt || parseInt)(this.props.balls.length / numColumn) + (remains > 0 ? 1 : 0); // 取整数 有余数再+1

    let peilvHeight = item.item.peilv ? Adaption.Width(18) + 5 : 0; // 赔率显示的高，（比赔率fontSize 大1）。
    let W = this.props.style.width * (this.props.numColumn == 2 ? 0.5 : this.props.numColumn == 3 ? 0.8 : 0.9);
    let spaceW = (W - (ballWidth * numColumn)) / numColumn;   //（item的宽 - 4个圆的宽）除4个间隔
    let spaceH = (this.props.style.height - (this.props.isShowTitlt ? 30 : 10) - ((ballWidth + peilvHeight) * row)) / (row + (pk10Gyh ? 0 : 1)); //（item的高 - 2个圆的高）除3个间隔。

    let itemIsSelect = this.state.selectBallIdxArr.includes(item.index); // 是不是选择状态的

    var selectBallBackColor = '#e33939';
    var selectBallTextColor = '#e33939';
   
    let preg = /^([\d]|[\d][\d])$/; // [\d] === [0-9] 查找数字
    let isZW = preg.test(item.item.ball); // 是不是两位数字

    return (
      <View>
        <TouchableOpacity activeOpacity={0.6}
          style={{
            width: ballWidth, height: ballWidth, marginLeft: spaceW / 2, marginRight: spaceW / 2, marginTop: spaceH, justifyContent: 'center', alignItems: 'center',
            borderRadius: ballWidth * 0.5, borderColor: '#cccccc', borderWidth: itemIsSelect ? 0 : 1,
            backgroundColor: itemIsSelect ? selectBallBackColor : '#fff',
          }}
          onPress={() => {
            lastBall = item.index;
            lastIdx = this.props.idx;
            this._selectBalls(item);
          }}>

          <Text allowFontScaling={false} style={{ fontSize: Adaption.Font((item.item.ball.length > 1 && !isZW) ? 16.5 : 20), color: itemIsSelect ? '#fff' : selectBallTextColor }}>{item.item.ball}</Text>
        </TouchableOpacity>

        {item.item.peilv ?
          <View style={{ height: peilvHeight - 5, marginTop: 5 }}>
            <Text allowFontScaling={false} style={{ textAlign: 'center', fontSize: Adaption.Font(16.5), color: '#757575' }}>{GetBallStatus.peilvHandle(item.item.peilv)}</Text>
          </View>
          : null
        }
      </View>
    )
  }

  render() {

    let pk10Gyh = this.props.idx == 1 && this.props.js_tag == 'pk10' && this.props.playid == 7; // pk10冠亚和 二排

    return (
      <View style={this.props.style}>

        <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(17), marginLeft: 20, marginTop: pk10Gyh ? 0 : this.props.isShowTitlt ? 10 : 0, height: (this.props.isShowTitlt ? 20 : 0), color: '#707070' }}>{this.props.title}</Text>

        <FlatList style={{ width: this.props.style.width * (this.props.numColumn == 2 ? 0.5 : this.props.numColumn == 3 ? 0.8 : 0.9), marginLeft: this.props.style.width * (this.props.numColumn == 2 ? 0.25 : this.props.numColumn == 3 ? 0.1 : 0.05) }}
          automaticallyAdjustContentInsets={false}
          alwaysBounceHorizontal={false}
          data={this.props.balls}
          renderItem={(item) => this._renderItemView(item)}
          horizontal={false}
          numColumns={this.props.numColumn ? this.props.numColumn : 4}
          scrollEnabled={false}
        >
        </FlatList>
        {this.props.isShowTitlt ? <View style={{ height: 0.5, width: this.props.style.width, backgroundColor: '#dadada' }}></View> : null}
      </View>
    )
  }

}

export default NewBalls0_9Peilv;