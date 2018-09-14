/**
 Created by Money on 2018/07/17

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
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import GetBallStatus from '../newBuyTool/GetBallStatus';

let tempArcInt = -1;
let tempArcArr = []; // 避免随机重复的

let lastBall = -1; // 上次点的item。11x5不能选相同的。
let lastIdx = -1; // 哪排

let tuoMaSelectIdxArr = []; // 记录变态了 不能选择重复的号码 11x5 ssc的胆拖。点全大小单双时使用。

export default class NNewBalls0_9Peilv extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectBallIdxArr: [], // 选择号码的下标。
      sltBtnState: [false, false, false, false, false, false],
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

    if (!nextProps.isBallsChange && tuoMaSelectIdxArr.length > 0 && nextProps.idx == 0) {
      for (let b = 0; b < this.state.selectBallIdxArr.length; b++) {
        if (tuoMaSelectIdxArr.includes(this.state.selectBallIdxArr[b])) {
          this.state.selectBallIdxArr.splice(b, 1);
          b--;
        }
      }
      tuoMaSelectIdxArr = []; // 值已经被使用了，就重置了
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

      } else if (playid == '5' || playid == '10' || playid == '15') {
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
      if (playid == 1) {
        // 一定位
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 4);
        }
        arcNumArr = tempArcInt == idx ? this._returnArcBallArr(1) : [];

      } else if (playid == 2) {
        // 二定复式，选择两个位
        if (idx == 0) {
          // 第一个进来先随机两个数，确定在哪一排
          tempArcInt = this._returnArcBallArr(2, 4).join('-');
        }
        let tempArcIntArr = tempArcInt.split('-');
        // 分隔了 再判断这个数组是否包含idx-1
        if (!tempArcIntArr.includes((idx).toString())) {
          arcNumArr = this._returnArcBallArr(1);
        }

      } else if (playid == 3) {
        // 三定复式， 选择三个位
        if (idx == 0) {
          // 第一个进来先随机一个数，确定在哪一排
          tempArcInt = Math.floor(Math.random() * 4);
        }
        if (tempArcInt != idx) {
          arcNumArr = this._returnArcBallArr(1);
        }

      } else if (playid == 5) {
        // 二字现
        arcNumArr = this._returnArcBallArr(2);

      } else if (playid == 6) {
        // 三字现
        arcNumArr = this._returnArcBallArr(3);

      } else {
        arcNumArr = this._returnArcBallArr(1);
        tempArcArr = idx == 1 ? [...tempArcArr, ...arcNumArr] : arcNumArr; // 防止机选重复
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

          } else if (lhcZxbz) {
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

    let btnSltIdx = -1;

    if (selectBallIdxArr.length >= Math.floor(this.props.balls.length / 2)) {  // 选够一半号码时 再走。

      if (selectBallIdxArr.length == this.props.balls.length) {
        btnSltIdx = 0;

      } else {

        if (selectBallIdxArr[0] >= Math.floor(this.props.balls.length / 2)) {

          for (let x = 0; x < selectBallIdxArr.length; x++) {
            if (selectBallIdxArr[x] + 1 > Math.floor(this.props.balls.length / 2)) {
              btnSltIdx = 1;
            } else {
              btnSltIdx = -1;
              break;
            }
          }

          // 总数是单数的变态，防止11x5选5个大号也显示大
          if (this.props.balls.length / 2.0 % 1 != 0 && btnSltIdx != -1) {
            if (selectBallIdxArr.length <= Math.floor(this.props.balls.length / 2)) {
              btnSltIdx = -1;
            }
          }

        } else {
          for (let x = 0; x < selectBallIdxArr.length; x++) {
            if (selectBallIdxArr[x] + 1 <= Math.floor(this.props.balls.length / 2)) {
              btnSltIdx = 2;
            } else {
              btnSltIdx = -1;
              break;
            }
          }
        }

        if (btnSltIdx == -1) {
          if (parseInt(this.props.balls[selectBallIdxArr[0]].ball) % 2 == 1) {

            for (let x = 0; x < selectBallIdxArr.length; x++) {
              if (parseInt(this.props.balls[selectBallIdxArr[x]].ball) % 2 == 1) {
                btnSltIdx = 3;
              } else {
                btnSltIdx = -1;
                break;
              }
            }

          } else {

            for (let x = 0; x < selectBallIdxArr.length; x++) {
              if (parseInt(this.props.balls[selectBallIdxArr[x]].ball) % 2 == 0) {
                btnSltIdx = 4;
              } else {
                btnSltIdx = -1;
                break;
              }
            }
          }

          if (this.props.balls.length / 2.0 % 1 != 0 && btnSltIdx != -1) {

            if (parseInt(this.props.balls[0].ball) % 2 == 1 && parseInt(this.props.balls[selectBallIdxArr[0]].ball) % 2 == 1) {
              if (selectBallIdxArr.length <= Math.floor(this.props.balls.length / 2)) {
                btnSltIdx = -1;
              }
            }

            if (parseInt(this.props.balls[0].ball) % 2 == 0 && parseInt(this.props.balls[selectBallIdxArr[0]].ball) % 2 == 0) {
              if (selectBallIdxArr.length <= Math.floor(this.props.balls.length / 2)) {
                btnSltIdx = -1;
              }
            }
          }

        }

      }
    }

    for (let bt = 0; bt < this.state.sltBtnState.length; bt++) {
      if (btnSltIdx == bt) {
        this.state.sltBtnState[bt] = true;
      } else {
        this.state.sltBtnState[bt] = false;
      }
    }

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

    let ballWidth = Adaption.Width(43.5);  // 号码球的大小
    let numColumn = this.props.numColumn ? this.props.numColumn : 5;

    let W = this.props.style.width * 0.9;
    let spaceW = (W - (ballWidth * numColumn)) / numColumn;   //（item的宽 - 4个圆的宽）除4个间隔
    let spaceH = Adaption.Width(15);

    let itemIsSelect = this.state.selectBallIdxArr.includes(item.index); // 是不是选择状态的

    var selectBallBackColor = '#e33939';
    var selectBallTextColor = '#ff0000';

    let preg = /^([\d]|[\d][\d])$/; // [\d] === [0-9] 查找数字
    let isZW = preg.test(item.item.ball); // 是不是两位数字

    return (
      <View>
        <TouchableOpacity activeOpacity={0.6}
          style={{
            width: ballWidth, height: ballWidth, marginLeft: spaceW / 2, marginRight: spaceW / 2, marginTop: spaceH, justifyContent: 'center', alignItems: 'center',
            borderRadius: ballWidth * 0.5, borderColor: '#979797', borderWidth: itemIsSelect ? 0 : 1,
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
          <View style={{ height: Adaption.Width(18), marginTop: 5 }}>
            <Text allowFontScaling={false} style={{ textAlign: 'center', fontSize: Adaption.Font(16.5), color: '#757575' }}>{GetBallStatus.peilvHandle(item.item.peilv)}</Text>
          </View>
          : null
        }
      </View>
    )
  }

  _createButtonView() {
    let titArr = ['全', '大', '小', '单', '双', '清'];
    let btnW = Adaption.Width(36), spaceW = Adaption.Width(10);
    let butArr = [];

    for (let i = 0; i < titArr.length; i++) {

      let isSelect = this.state.sltBtnState[i];

      butArr.push(
        <TouchableOpacity key={i} activeOpacity={0.4}
          style={{
            justifyContent: 'center', alignItems: 'center', width: btnW, height: btnW, backgroundColor: isSelect ? '#ff0000' : '#fff',
            marginLeft: spaceW, borderRadius: btnW / 2, borderColor: '#ababab', borderWidth: isSelect ? 0 : 1,
          }}
          onPress={() => {
            lastBall = -1;
            let ballIdxArr = [];
            if (i == 0) {
              for (let a = 0; a < this.props.balls.length; a++) {
                ballIdxArr.push(a);
              }
            } else if (i == 1) {
              for (let a = 0; a < this.props.balls.length; a++) {
                if (a + 1 > Math.floor(this.props.balls.length / 2)) {
                  ballIdxArr.push(a);
                }
              }
            } else if (i == 2) {
              for (let a = 0; a < this.props.balls.length; a++) {
                if (a + 1 <= Math.floor(this.props.balls.length / 2)) {
                  ballIdxArr.push(a);
                }
              }
            } else if (i == 3) {
              for (let a = 0; a < this.props.balls.length; a++) {
                if (parseInt(this.props.balls[a].ball) % 2 == 1) {
                  ballIdxArr.push(a);
                }
              }
            } else if (i == 4) {
              for (let a = 0; a < this.props.balls.length; a++) {
                if (parseInt(this.props.balls[a].ball) % 2 == 0) {
                  ballIdxArr.push(a);
                }
              }
            } else {
              ballIdxArr = [];
            }

            if (this.props.js_tag == '11x5' && this.props.tpl == 3) {
              tuoMaSelectIdxArr = ballIdxArr;
            }

            this.setState({
              selectBallIdxArr: ballIdxArr,
            })
            this._returnBallsData(ballIdxArr); // 根据选择的下标回调 ball、peilv

          }}
        >
          <Text allowFontScaling={false} style={{ color: isSelect ? '#fff' : '#6a6a6a', fontSize: Adaption.Font(17, 14) }}>{titArr[i]}</Text>
        </TouchableOpacity>
      )
    }
    return butArr;
  }

  render() {

    let _11x5 = this.props.js_tag == '11x5' && this.props.tpl == 3 && this.props.idx == 0; // 11x5所有胆码
    let _ssc = this.props.js_tag == 'ssc' && (this.props.tpl == 4 || this.props.tpl == 6); // ssc所有组选包胆 || 特殊号
    let _lhc = this.props.js_tag == 'lhc' && (this.props.tpl == 12 || this.props.tpl == 13);  // lhc自选不中 / 连码
    var isShowQdxdsView = true; // 是否显示全大小单双清的view
    if (_11x5 || _ssc || _lhc) {
      isShowQdxdsView = false;
    }

    return (
      <View style={this.props.style}>

        <View style={{ width: this.props.style.width, height: Adaption.Width(50), flexDirection: 'row', alignItems: 'center' }}>
          <ImageBackground resizeMode={'contain'} source={require('../img/ic_defaultClick.png')}
            style={{ width: Adaption.Width(80), height: Adaption.Width(50), marginLeft: Adaption.Width(10), justifyContent: 'center', alignItems: 'center' }}
          >
            <Text allowFontScaling={false} style={{ backgroundColor: 'rgba(0,0,0,0)', color: '#707070', fontSize: Adaption.Font(18, 15) }}>{this.props.title}</Text>
          </ImageBackground>

          {isShowQdxdsView ?
            <View style={{ width: this.props.style.width * 0.7, height: Adaption.Width(40), marginLeft: Adaption.Width(10), backgroundColor: '#dcdcdc', borderRadius: 20, flexDirection: 'row', alignItems: 'center' }}>
              {this._createButtonView()}
            </View>
            : null
          }

          {_lhc && this.props.singlePeilv
            ? <Text allowFontScaling={false} style={{ marginLeft: Adaption.Width(20), color: '#707070', fontSize: Adaption.Font(17, 14) }}>{`赔率（${this.props.singlePeilv}）`}</Text>
            : null
          }

        </View>


        <FlatList style={{ marginBottom: Adaption.Width(15), width: this.props.style.width * 0.9, marginLeft: this.props.style.width * 0.05 }}
          automaticallyAdjustContentInsets={false}
          alwaysBounceHorizontal={false}
          data={this.props.balls}
          renderItem={(item) => this._renderItemView(item)}
          keyExtractor={(item, index) => { return String(index) }}
          horizontal={false}
          numColumns={this.props.numColumn ? this.props.numColumn : 5}
          scrollEnabled={false}
        >
        </FlatList>
      </View>
    )
  }

}
