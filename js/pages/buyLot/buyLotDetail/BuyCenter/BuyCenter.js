/**
 Author Money
 Created by on 2017/09/30
 dec
 */

import React, { Component } from 'react';
import moment from 'moment';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Vibration,
} from 'react-native';

import RNShakeEvent  from 'react-native-shake-event';  //导入检测震动方法

import Balls0_9 from './Balls/Balls0_9'
import Balls0_9Peilv from './Balls/Balls0_9Peilv'
import LhcBalls0_9 from './Balls/LhcBalls0_9'
import LhcBalls0_9Peilv from './Balls/LhcBalls0_9Peilv'
import LhcBallsBlockPeilv from './Balls/LhcBallsBlockPeilv'
import LhcBallsBlockNumPeilv from './Balls/LhcBallsBlockNumPeilv'
import BallsPK from './Balls/BallsPK'
import SSCRxBottomView from './Balls/SSCRxBottomView'

class BuyCenter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ballsData:{}, // 选择的号码
      isBallsChange: false, // 随机
      clearAllBalls: false, // 清空
      rxData:[], // 任选
    };
  }


  componentDidMount() {

    //添加摇一摇监听
    RNShakeEvent.addEventListener('shake', () => {

       let islowCaiZhong = this.props.js_tag == 'lhc' || this.props.js_tag == '3d';


      //低频彩不能摇一摇选号
      if (islowCaiZhong == false && global.isOpenShake == true){

        Vibration.vibrate([0, 1000], false); //false 表示只震动一次

        this.setState({
          isBallsChange:true,
        })
      }
    })

    //清空号码的通知
    this.subscription = PushNotification.addListener('ClearAllBalls', () => {
      this.setState({
        clearAllBalls:true,
      })
    });
  }

  //移除通知和摇一摇监听
  componentWillUnmount() {

    if (typeof(this.subscription) == 'object'){
        this.subscription && this.subscription.remove();
    }

    RNShakeEvent.removeEventListener('shake');
  }

  _createBallsBlockView(Values) {
    if (this.props.js_tag == 'ssc') {
     return this._sscCreateViews(Values);

    } else if (this.props.js_tag == 'k3') {
      return this._k3CreateViews(Values);

    } else if (this.props.js_tag == '11x5') {
      return this._11x5CreateViews(Values);

    } else if (this.props.js_tag == 'pcdd') {
      return this._pcddCreateViews(Values);

    } else if (this.props.js_tag == '3d') {
      return this._3dCreateViews(Values);

    } else if (this.props.js_tag == 'pk10') {
      return this._pk10CreateViews(Values);

    } else if (this.props.js_tag == 'lhc') {
      return this._lhcCreateViews(Values);
    }
  }

  // 选号回调处理方法。
  _ballsHandle(selectBalls, addWenHao) {
    // 把之前选的号拿出来。
    let ballDict = this.state.ballsData;

    // 拼?号的，没有选号的 默认给个?。
    if (Object.keys(ballDict).length <= 0 && addWenHao != null) {
      let playid = addWenHao.playid;
      let wenHaoTitle = {};
      let wenhao3D = this.props.js_tag == '3d' && playid == '12';
      let wenhaoSSC = this.props.js_tag == 'ssc' && (playid == '41' || playid == '78' || playid == '79' || playid == '81');
      let wenhaoK3 = this.props.js_tag == 'k3' && playid == '11';
      if (wenhao3D || wenhaoSSC || wenhaoK3) {
        let title = Object.keys(selectBalls)[0];
        for (let i = 0; i < addWenHao.leftTitles.length; i++) {
          let wenhao = {[`${addWenHao.leftTitles[i]}`] : ['?']};
          Object.assign(wenHaoTitle, wenhao);

          if (Object.keys(selectBalls).includes(`${title}0`)) {
            let wenhao0 = {[`${addWenHao.leftTitles[i]}0`] : ['?']};
            Object.assign(wenHaoTitle, wenhao0);
          }
        }
      }
      Object.assign(ballDict, wenHaoTitle);
    }

    // Object.assign方法，一旦遇到同名属性会替换，没有同名就是添加。
    Object.assign(ballDict, selectBalls);

    let ballArr = Object.values(selectBalls);
    if (ballArr[0].length <= 0) {
      let tit = Object.keys(selectBalls)[0];
      delete ballDict[tit]; // 删除为空的key

      if (ballArr[1] != null) { // 可能还有一个`${title}0`的，也要删除。
        let tit = Object.keys(selectBalls)[1];
        delete ballDict[tit];
      }

      if (ballArr[2] != null) { // 可能还有一个赔率的，也要删除。
        let tit = Object.keys(selectBalls)[2];
        delete ballDict[tit];
      }

      if (ballDict.rx_title != null) {
        delete ballDict.rx_title; // rx的存在也要删除
      }
    }

    if (this.state.rxData.length > 0 && Object.keys(ballDict).length > 0) {
      // ssc任选的。且有值时进来。
      let rxTitleArr = [];
      this.state.rxData.map((dic, i) => {
        if (dic.state == true) {
          rxTitleArr.push(dic.title);
        }
      })
      Object.assign(ballDict, {'rx_title':rxTitleArr});
    }

    // 万千百十个位的都在按顺序存放 / 11x5 / k3的胆码拖码 /k3二同号
    let newBallDic = {};
    let keyArr = Object.keys(ballDict);

    // 时时彩 任选的ballDict加了rx_title的字段不能执行这个
    if (keyArr.length > 1 && addWenHao != null && this.state.rxData.length <= 0) {
      for (b in addWenHao.leftTitles) {
        let title = addWenHao.leftTitles[b];
        if (keyArr.includes(title)) {
          Object.assign(newBallDic, {[title] : ballDict[title]});
          if (keyArr.includes(`${title}0`)) {
            // k3二同号 / 大小单双。要多一个
            Object.assign(newBallDic, {[`${title}0`] : ballDict[`${title}0`]});
          }
        }
      }
      ballDict = newBallDic;
    }

    this.setState({
      ballsData:ballDict,
    })
    return ballDict;
  }

  // 创建Balls0_9的视图
  _ball0_9CreateView(values, balls, isClick, viewHeight, numColumn, isOnlyAllClear) {

    if (Object.keys(values) <= 0) {
      return [];
    }

    let leftTitles = values.content.split(' ');

    // 胆码|1 拖码|2，截断|后面的
    if (values.content.includes('|')) {
      for (let a = 0; a < leftTitles.length; a++) {
        leftTitles[a] = leftTitles[a].split('|')[0];
      }
    }

    if (this.props.js_tag == 'k3' && values.playid == '8') {
      // 快三 二同号 单选； 有两排（11〜66、1〜6）
      leftTitles = ['同号', '不同号'];
    }

    let viewWidth = 0;
    let isK3TS = this.props.js_tag == 'k3' && (values.tpl == 1 || values.tpl == 4);
    let is3dTS = this.props.js_tag == '3d' && (values.tpl == 6 || values.tpl == 8 || values.tpl == 10);
    if (isK3TS || is3dTS) {
      viewWidth = Adaption.Width(120);
    }

    var blockViews = [];
    for (var i = 0; i < leftTitles.length; i++) {

      if (values.tpl == '6' && values.playid == '8' && i == 1) {
        // 快三 二同号 单选； 有两排（11〜66、1〜6）
        balls = [];
        for (var j = 1; j <= 6; j++) {
          balls.push({key:j, ball:j})
        }
      }

      blockViews.push(
        <Balls0_9 key = {i} style = {{width:SCREEN_WIDTH, height:viewHeight}}
          balls = {balls}  // 要显示的号码
          isLeftClick = {isClick}  // 左边能不能点击
          isOnlyAllClear = {isOnlyAllClear ? isOnlyAllClear : false}  // 左边点击的是不是只有（全、清）
          isTSWidth = {viewWidth} // 宽
          leftTitle = {leftTitles[i]}  // 左边的title
          isBallsChange = {this.state.isBallsChange ? true : false} // 是否随机
          clearAllBalls = {this.state.clearAllBalls ? true : false} // 是否清空号码
          idx = {i + 1}  // 主要是记录是第几排的。 随机用到！
          js_tag = {this.props.js_tag}
          tpl = {values.tpl}
          playid = {values.playid}
          numColumn = {numColumn} // 每行显示几个号码
          ballClick = {(selectBalls) => {
            let addWenHao = {leftTitles:leftTitles, playid:values.playid, tpl:values.tpl}; // 拼?号的需要用到。
            let dict = this._ballsHandle(selectBalls, addWenHao);
            this.props.ballsClick?this.props.ballsClick(dict, leftTitles, balls):null;
            // 选了号码回来了，要重新设为false。
            this.setState({
              isBallsChange:false,
              clearAllBalls:false,
            })
          }}
          >
        </Balls0_9>
      );
    }
    return blockViews;
  }

  // 创建Balls0_9Peilv的视图
  _balls09PeilvCreateView(values, balls, viewHeight, numColumn) {
    if (Object.keys(values) <= 0) {
      return [];
    }

    let balls1 = [];
    for (let a = 0; a < balls.length; a++) {
     balls1.push({key:a, ball:balls[a]})
    }

    return (
      <Balls0_9Peilv key = {0} style = {{width:SCREEN_WIDTH, height:viewHeight}}
        balls = {balls}
        peilvs = {values.peilv.split('|')}
        leftTitle = {values.content}
        isBallsChange = {this.state.isBallsChange ? true : false} // 是否随机
        clearAllBalls = {this.state.clearAllBalls ? true : false} // 是否清空号码
        js_tag = {this.props.js_tag}
        tpl = {values.tpl}
        numColumn = {numColumn} // 每行显示几个号码
        ballClick = {(selectBalls) => {
          let dict = this._ballsHandle(selectBalls);
          this.props.ballsClick?this.props.ballsClick(dict, [values.content], balls1):null;
          // 选了号码回来了，要重新设为false。
          this.setState({
            isBallsChange:false,
            clearAllBalls:false,
          })
        }}
        >
      </Balls0_9Peilv>
    )
  }

  // 创建BallsPK的视图
  _ballsPKCreateView(values, balls, viewHeight, numColumn) {
    if (Object.keys(values) <= 0) {
      return [];
    }

    return (
      <BallsPK key = {0} style = {{width:SCREEN_WIDTH, height:viewHeight}}
        balls = {balls}
        leftTitle = {values.content}
        js_tag = {this.props.js_tag}
        numColumn = {numColumn}
        isBallsChange = {this.state.isBallsChange ? true : false} // 是否随机
        clearAllBalls = {this.state.clearAllBalls ? true : false} // 是否清空号码
        ballClick = {(selectBalls) => {
          let dict = this._ballsHandle(selectBalls);
          this.props.ballsClick?this.props.ballsClick(dict, [values.content], balls):null;
          // 选了号码回来了，要重新设为false。
          this.setState({
            isBallsChange:false,
            clearAllBalls:false,
          })
        }}
        >
      </BallsPK>
    )
  }

  // 创建LhcBalls0_9Peilv的视图
  _lhcBalls09PeilvCreateView(values, balls, viewHeight, numColumn) {
    if (Object.keys(values) <= 0) {
      return [];
    }

    return (
      <LhcBalls0_9Peilv key = {0} style = {{width:SCREEN_WIDTH, height:viewHeight}}
        balls = {balls}
        peilvs = {values.peilv.split('|')}
        playTitle = {values.playname}
        numColumn = {numColumn} // 每行显示几个号码
        clearAllBalls = {this.state.clearAllBalls ? true : false}
        ballClick = {(selectBalls) => {
          let dict = this._ballsHandle(selectBalls);
          this.props.ballsClick?this.props.ballsClick(dict, [values.playname]):null;
          this.setState({
            clearAllBalls:false,
          })
        }}
        >
      </LhcBalls0_9Peilv>
    )
  }

  // 创建LhcBalls0_9的视图
  _lhcBalls09CreateView(values, balls, viewHeight, numColumn) {
    if (Object.keys(values) <= 0) {
      return [];
    }
    let peilvs = values.peilv;
    if (values.tpl == 12) {
      // 自选不中
      peilvs = values.peilv.split('|');
    }

    return (
      <LhcBalls0_9 key = {0} style = {{width:SCREEN_WIDTH, height:viewHeight}}
        balls = {balls}
        peilvs = {peilvs}
        tpl = {values.tpl}
        playid = {values.playid}
        playTitle = {values.playname}
        numColumn = {numColumn} // 每行显示几个号码
        clearAllBalls = {this.state.clearAllBalls ? true : false}
        ballClick = {(selectBalls) => {
          let dict = this._ballsHandle(selectBalls);
          this.props.ballsClick?this.props.ballsClick(dict, [values.playname]):null;
          this.setState({
            clearAllBalls:false,
          })
        }}
        >
      </LhcBalls0_9>
    )
  }

  // 创建LhcBallsBlockPeilv的视图
  _lhcBallsBlockPeilvCreateView(values, balls, viewHeight, numColumn) {
    if (Object.keys(values) <= 0) {
      return [];
    }

    return (
      <LhcBallsBlockPeilv key = {0} style = {{width:SCREEN_WIDTH, height:viewHeight}}
        balls = {balls}
        peilvs = {values.peilv.split('|')}
        playTitle = {values.playname}
        numColumn = {numColumn} // 每行显示几个号码
        clearAllBalls = {this.state.clearAllBalls ? true : false}
        ballClick = {(selectBalls) => {
          let dict = this._ballsHandle(selectBalls);
          this.props.ballsClick?this.props.ballsClick(dict, [values.playname]):null;
          this.setState({
            clearAllBalls:false,
          })
        }}
        >
      </LhcBallsBlockPeilv>
    )
  }

  // 创建LhcBallsBlockNumPeilv的视图
  _lhcBallsBlockNumPeilvCreateView(values, balls, viewHeight, numColumn, ballsNumDec) {
    if (Object.keys(values) <= 0) {
      return [];
    }
    let itemWidth = 0;
    let itemHeight = 0;
    if (values.tpl == 8) {
      // 五行
      itemWidth = Adaption.Width(140);
      itemHeight = Adaption.Height(90);
    } else if (values.tpl == 2) {
      // 特码包波
      itemWidth = Adaption.Width(140);
      itemHeight = Adaption.Height(130);
    }

    let peilvs = values.peilv.split('|');
    let isHeXiao = false;
    if (values.tpl == 7 || values.tpl == 14 || values.tpl == 15) {
      isHeXiao = true; // 合肖 \\2345连肖 \\ 2345连尾
    }

    return (
      <LhcBallsBlockNumPeilv key = {0} style = {{width:SCREEN_WIDTH, height:viewHeight}}
        balls = {balls}
        ballsNumDec = {ballsNumDec}
        peilvs = {peilvs}
        playTitle = {values.playname}
        numColumn = {numColumn} // 每行显示几个号码
        itemWidth = {itemWidth}
        itemHeight = {itemHeight}
        isHeXiao = {isHeXiao}
        tpl = {values.tpl}
        clearAllBalls = {this.state.clearAllBalls ? true : false}
        ballClick = {(selectBalls) => {
          let dict = this._ballsHandle(selectBalls);
          this.props.ballsClick?this.props.ballsClick(dict, [values.playname]):null;
          this.setState({
            clearAllBalls:false,
          })
        }}
        >
      </LhcBallsBlockNumPeilv>
    )
  }

  _sscCreateViews(values) {
    var viewHeight = Adaption.Height(120); // 两行的给120，大概是每行高60。单行的给65
    var isClick = false;  // 左边能不能点击。
    let isOnlyAllClear = false; // 大小单双。
    // 需要显示的号码：
    var balls = [];
    if (values.tpl == 0) {
      // 0~9的号码。
      isClick = true;
      for (var i = 0; i < 10; i++) {
        balls.push({key:i, ball:i})
      }

    } else if (values.tpl == 2) {
      // 前中后三 直选和值 0〜27
      viewHeight = Adaption.Height(360);
      for (var i = 0; i <= 27; i++) {
        balls.push({key:i, ball:i})
      }

    } else if (values.tpl == 3) {
      // 前中后三 组选和值 1〜26
      viewHeight = Adaption.Height(360);
      for (var i = 1; i <= 26; i++) {
        balls.push({key:i, ball:i})
      }

    } else if (values.tpl == 4) {
      // 组选包胆 0 ~ 9
      for (var i = 0; i < 10; i++) {
        balls.push({key:i, ball:i})
      }

    } else if (values.tpl == 5) {
      // 大小单双
      isClick = true;
      isOnlyAllClear = true;
      viewHeight = Adaption.Height(70);
      var ballarr = ['大', '小', '单', '双'];
      for (var i = 0; i < ballarr.length; i++) {
        balls.push({key:i, ball:ballarr[i]})
      }

    } else if (values.tpl == 6) {
      // 特殊号 有赔率
      tpl = 6;
      numColumn = 4;
      viewHeight = Adaption.Height(100);
      balls = ['豹子', '顺子', '对子'];
      return this._balls09PeilvCreateView(values, balls, viewHeight, numColumn, tpl);

    } else if (values.tpl == 7) {
      // 前后二／任二 组选和值 1〜17
      viewHeight = Adaption.Height(240);
      for (var i = 1; i <= 17; i++) {
        balls.push({key:i, ball:i})
      }

    } else if (values.tpl == 8) {
      // console.log('ssc的tpl == 8');

    } else if (values.tpl == 9) {
      // 前后二 直选和值 0〜18
      viewHeight = Adaption.Height(240);
      for (var i = 0; i <= 18; i++) {
        balls.push({key:i, ball:i})
      }

    } else if (values.tpl == 10) {
      // 任二 直选和值 0〜18
      viewHeight = Adaption.Height(240);
      for (var i = 0; i <= 18; i++) {
        balls.push({key:i, ball:i})
      }

    } else if (values.tpl == 11) {
      // 信用 大小PK （万位 VS 千位）
      numColumn = 2;
      viewHeight = Adaption.Height(300);
      let array = ['万位', '千位', '百位', '十位', '个位'];
      let ballsArr = [];
      for (var i = 0; i < array.length; i++) {
        for (var j = i + 1; j < array.length; j++) {
          ballsArr.push({
            ball_1:array[i], ball_2:array[j],
          })
        }
      }
      for (var i = 0; i < ballsArr.length; i++) {
        let dic = ballsArr[i];
        balls.push({
          key:i, ball_1:dic.ball_1, ball_2:dic.ball_2,
        })
      }
      return this._ballsPKCreateView(values, balls, viewHeight, numColumn)
    }

    return this._ball0_9CreateView(values, balls, isClick, viewHeight, 5, isOnlyAllClear);
  }

  _pk10CreateViews(values) {
    var viewHeight = Adaption.Height(120); // 两行的
    var isClick = true;  // 左边能不能点击。
    let isOnlyAllClear = false;

    // 需要显示的号码：
    var balls = [];
    if (values.tpl == 0) {
      // 01~10的号码。
      for (var i = 1; i <= 10; i++) {
        // 个位数前面要拼个0；
        balls.push({key:i, ball: i<10 ? `0${i}` : `${i}`});
      }

    } else if (values.tpl == 2) {
      // 前二和值 3〜19. 有赔率显示 /每排高80
      viewHeight = Adaption.Height(320);
      for (var i = 3; i <= 19; i++) {
        balls.push(i.toString());
      }
      return this._balls09PeilvCreateView(values, balls, viewHeight, 5);

    } else if (values.tpl == 3) {
      // 前三和值 6〜27
      viewHeight = Adaption.Height(400);
      for (var i = 6; i <= 27; i++) {
        balls.push(i.toString());
      }
      return this._balls09PeilvCreateView(values, balls, viewHeight, 5);

    } else if (values.tpl == 4) {
      // 前四和值 10〜33
      viewHeight = Adaption.Height(400);
      for (var i = 10; i <= 33; i++) {
        balls.push(i.toString());
      }
      return this._balls09PeilvCreateView(values, balls, viewHeight, 5);

    } else if (values.tpl == 5) {
      // 大小单双
      isOnlyAllClear = true;
      viewHeight = Adaption.Height(70);
      var ballarr = ['大', '小', '单', '双'];
      for (var i = 0; i < ballarr.length; i++) {
        balls.push({key:i, ball:ballarr[i]})
      }

    } else if (values.tpl == 6) {
      // 前三特选
      isOnlyAllClear = true;
      viewHeight = Adaption.Height(70);
      var ballarr = ['全大', '全小', '全单', '全双'];
      for (var i = 0; i < ballarr.length; i++) {
        balls.push({key:i, ball:ballarr[i]})
      }

    } else if (values.tpl == 7) {
      // 位置PK
      isClick = false;
      viewHeight = Adaption.Height(300);
      let array = ['冠军', '亚军', '季军', '四名', '五名'];
      let ballsArr = [];
      for (var i = 0; i < array.length; i++) {
        for (var j = i + 1; j < array.length; j++) {
          ballsArr.push({
            ball_1:array[i], ball_2:array[j],
          })
        }
      }
      for (var i = 0; i < ballsArr.length; i++) {
        let dic = ballsArr[i];
        balls.push({
          key:i, ball_1:dic.ball_1, ball_2:dic.ball_2,
        })
      }
      return this._ballsPKCreateView(values, balls, viewHeight, 2)
    }

    return this._ball0_9CreateView(values, balls, isClick, viewHeight, 5, isOnlyAllClear);
  }

  _11x5CreateViews(values) {
    let numColumn = 6;
    var viewHeight = Adaption.Height(120); // 两行的
    var isClick = true;  // 左边能不能点击。
    let isOnlyAllClear = false;

    // 需要显示的号码：
    var balls = [];
    if (values.tpl == 0) {
      // 1~11的号码。
      for (var i = 1; i <= 11; i++) {
        balls.push({key:i, ball:i})
      }

    } else if (values.tpl == 3) {
      // 前中后三、前后二组选、任选 胆拖 1~11的号码。
      isClick = false;
      for (var i = 1; i <= 11; i++) {
        balls.push({key:i, ball:i})
      }

    } else if (values.tpl == 4) {
      // 定位大小单双
      numColumn = 5;
      isOnlyAllClear = true;
      viewHeight = Adaption.Height(70);
      let ballarr = ['大', '小', '单', '双'];
      for (var i = 0; i < ballarr.length; i++) {
        balls.push({key:i, ball:ballarr[i]})
      }

    } else if (values.tpl == 5) {
      // 总和大小单双
      numColumn = 5;
      isOnlyAllClear = true;
      var ballarr = ['总大', '总小', '总单', '总双', '尾大', '尾小'];
      for (var i = 0; i < ballarr.length; i++) {
        balls.push({key:i, ball:ballarr[i]})
      }

    } else if (values.tpl == 6) {
      // 龙虎斗
      isClick = false;
      numColumn = 2;
      viewHeight = Adaption.Height(300);
      let array = ['一位', '二位', '三位', '四位', '五位'];
      let ballsArr = [];
      for (var i = 0; i < array.length; i++) {
        for (var j = i + 1; j < array.length; j++) {
          ballsArr.push({
            ball_1:array[i], ball_2:array[j],
          })
        }
      }
      for (var i = 0; i < ballsArr.length; i++) {
        let dic = ballsArr[i];
        balls.push({
          key:i, ball_1:dic.ball_1, ball_2:dic.ball_2,
        })
      }
      return this._ballsPKCreateView(values, balls, viewHeight, numColumn)
    }

    return this._ball0_9CreateView(values, balls, isClick, viewHeight, numColumn, isOnlyAllClear);
  }

  _k3CreateViews(values) {
    let numColumn = 5;
    var viewHeight = Adaption.Height(120); // 两行的
    var isClick = false;  // 左边能不能点击。

    // 需要显示的号码：
    var balls = [];
    if (values.tpl == 0) {
      // 和值 3〜18大小单双 有赔率
      numColumn = 4;
      viewHeight = Adaption.Height(360);
      for (var i = 3; i <= 18; i++) {
        balls.push(i.toString());
      }
      let arr2 = ['大', '小', '单', '双'];
      balls = [...balls, ...arr2]; // 合并数组。
      return this._balls09PeilvCreateView(values, balls, viewHeight, numColumn);

    } else if (values.tpl == 1) {
      // 三同号 通选
      viewHeight = Adaption.Height(70);
      numColumn = 2;
      balls = [{key:0,ball:'三同号通选'}];

    } else if (values.tpl == 2) {
      // 三同号 单选
      let array = ['111', '222', '333', '444', '555', '666'];
      for (var i = 0; i < array.length; i++) {
        balls.push({key:i, ball:array[i]})
      }

    } else if (values.tpl == 3) {
      // 二／三不同号 胆拖
      for (var i = 1; i <= 6; i++) {
        balls.push({key:i, ball:i})
      }

    } else if (values.tpl == 9) {
      // 二／三不同号 标准
      for (var i = 1; i <= 6; i++) {
        balls.push({key:i, ball:i})
      }

    } else if (values.tpl == 4) {
      // 三连号
      viewHeight = Adaption.Height(70);
      numColumn = 2;
      balls = [{key:0,ball:'三连号通选'}];

    } else if (values.tpl == 5) {
      // 二同号 复选
      let array = ['11', '22', '33', '44', '55', '66'];
      for (var i = 0; i < array.length; i++) {
        balls.push({key:i, ball:array[i]})
      }

    } else if (values.tpl == 6) {
      // 二同号 单选； 有两排（11〜66、1〜6）
      let array = ['11', '22', '33', '44', '55', '66'];
      for (var i = 0; i < array.length; i++) {
        balls.push({key:i, ball:array[i]})
      }
    } else if (values.tpl == 7) {
      // 总和大小单双
      numColumn = 5;
      isOnlyAllClear = true;
      var ballarr = ['总大', '总小', '总单', '总双'];
      for (var i = 0; i < ballarr.length; i++) {
        balls.push({key:i, ball:ballarr[i]})
      }
      return this._ball0_9CreateView(values, balls, true, viewHeight, numColumn, true);

    } else if (values.tpl == 8) {
      // 定位大小单双
      numColumn = 5;
      viewHeight = Adaption.Height(70);
      let ballarr = ['大', '小', '单', '双'];
      for (var i = 0; i < ballarr.length; i++) {
        balls.push({key:i, ball:ballarr[i]})
      }
    }

    return this._ball0_9CreateView(values, balls, isClick, viewHeight, numColumn);
  }

  _pcddCreateViews(values) {
    let numColumn = 5;
    var viewHeight = Adaption.Height(120); // 两行的
    var isClick = false;  // 左边能不能点击。
    let isOnlyAllClear = false;

    // 需要显示的号码：
    var balls = [];
    if (values.tpl == 0) {
      // 特码 0〜27 有赔率
      viewHeight = Adaption.Height(480);
      for (var i = 0; i <= 27; i++) {
        balls.push(i.toString());
      }
      return this._balls09PeilvCreateView(values, balls, viewHeight, numColumn);

    } else if (values.tpl == 1) {
      // 特码包三 0 ~ 27
      viewHeight = Adaption.Height(360);
      for (var i = 0; i <= 27; i++) {
        balls.push({key:i, ball:i})
      }

    } else if (values.tpl == 2) {
      // 混合 大小单双... 有赔率
      viewHeight = Adaption.Height(180);
      balls = ['大', '小', '单', '双', '大单', '小单', '大双', '小双', '极大', '极小'];
      return this._balls09PeilvCreateView(values, balls, viewHeight, numColumn);

    } else if (values.tpl == 3) {
      // 波色  有赔率
      numColumn = 4;
      viewHeight = Adaption.Height(100);
      balls = ['红波', '绿波', '蓝波'];
      return this._balls09PeilvCreateView(values, balls, viewHeight, numColumn);

    } else if (values.tpl == 4) {
      // 豹子 有赔率
      numColumn = 3;
      viewHeight = Adaption.Height(100);
      balls = ['豹子'];
      return this._balls09PeilvCreateView(values, balls, viewHeight, numColumn);

    } else if (values.tpl == 5) {
      // 定位胆 0 ~ 9
      isClick = true;
      for (var i = 0; i <= 9; i++) {
        balls.push({key:i, ball:i})
      }

    } else if (values.tpl == 6) {
      // 定位大小单双
      isClick = true;
      isOnlyAllClear = true;
      viewHeight = Adaption.Height(70);
      let ballarr = ['大', '小', '单', '双'];
      for (var i = 0; i < ballarr.length; i++) {
        balls.push({key:i, ball:ballarr[i]})
      }
    }

    return this._ball0_9CreateView(values, balls, isClick, viewHeight, numColumn, isOnlyAllClear);
  }

  _3dCreateViews(values) {
    let numColumn = 5;
    var viewHeight = Adaption.Height(120); // 两行的
    var isClick = false;  // 左边能不能点击。
    let isOnlyAllClear = false;

    // 需要显示的号码：
    var balls = [];
    if (values.tpl == 0) {
      // 0~9的号码。
      isClick = true;
      for (var i = 0; i < 10; i++) {
        balls.push({key:i, ball:i})
      }

    } else if (values.tpl == 2) {
      // 三星直选和值 0〜27 有赔率显示 /每排高80
      viewHeight = Adaption.Height(480);
      for (var i = 0; i <= 27; i++) {
        balls.push(i.toString());
      }
      return this._balls09PeilvCreateView(values, balls, viewHeight, 5);

    } else if (values.tpl == 3) {
      // 三星组三和值 1〜26
      viewHeight = Adaption.Height(480);
      for (var i = 1; i <= 26; i++) {
        balls.push(i.toString());
      }
      return this._balls09PeilvCreateView(values, balls, viewHeight, 5);

    } else if (values.tpl == 4) {
      // 三星组六和值 3〜24
      viewHeight = Adaption.Height(400);
      for (var i = 3; i <= 24; i++) {
        balls.push(i.toString());
      }
      return this._balls09PeilvCreateView(values, balls, viewHeight, 5);

    } else if (values.tpl == 5) {
      // 大小单双
      viewHeight = Adaption.Height(70);
      var ballarr = ['大', '小', '单', '双'];
      for (var i = 0; i < ballarr.length; i++) {
        balls.push({key:i, ball:ballarr[i]})
      }

    } else if (values.tpl == 6) {
      // 对子通选
      numColumn = 2;
      viewHeight = Adaption.Height(70);
      balls = [{key:0,ball:'二同号通选'}];

    } else if (values.tpl == 7) {
      // 对子单选
      isClick = true;
      isOnlyAllClear = true;
      let array = ['00', '11', '22', '33', '44', '55', '66', '77', '88', '99'];
      for (var i = 0; i < array.length; i++) {
        balls.push({key:i, ball:array[i]})
      }

    } else if (values.tpl == 8) {
      numColumn = 2;
      viewHeight = Adaption.Height(70);
      balls = [{key:0,ball:'顺子通选'}];

    } else if (values.tpl == 9) {
      // 顺子单选
      isClick = true;
      numColumn = 4;
      isOnlyAllClear = true;
      let array = ['012', '123', '234', '345', '456', '567', '678', '789'];
      for (var i = 0; i < array.length; i++) {
        balls.push({key:i, ball:array[i]})
      }

    } else if (values.tpl == 10) {
      numColumn = 2;
      viewHeight = Adaption.Height(70);
      balls = [{key:0,ball:'豹子通选'}];

    } else if (values.tpl == 11) {
      // 豹子单选
      isClick = true;
      isOnlyAllClear = true;
      let array = ['000', '111', '222', '333', '444', '555', '666', '777', '888', '999'];
      for (var i = 0; i < array.length; i++) {
        balls.push({key:i, ball:array[i]})
      }

    } else if (values.tpl == 13) {
      // 定位大小单双
      isClick = true;
      isOnlyAllClear = true;
      viewHeight = Adaption.Height(70);
      var ballarr = ['大', '小', '单', '双'];
      for (var i = 0; i < ballarr.length; i++) {
        balls.push({key:i, ball:ballarr[i]})
      }

    } else if (values.tpl == 14) {
      // 总大小单双
      isClick = true;
      numColumn = 3;
      isOnlyAllClear = true;
      var ballarr = ['总大', '总小', '总单', '总双', '尾大', '尾小'];
      for (var i = 0; i < ballarr.length; i++) {
        balls.push({key:i, ball:ballarr[i]})
      }
    } else if (values.tpl == 12) {
      // 龙虎斗
      numColumn = 1;
      viewHeight = Adaption.Height(200);
      let array = ['百位', '十位', '个位'];
      let ballsArr = [];
      for (var i = 0; i < array.length; i++) {
        for (var j = i + 1; j < array.length; j++) {
          ballsArr.push({
            ball_1:array[i], ball_2:array[j],
          })
        }
      }
      for (var i = 0; i < ballsArr.length; i++) {
        let dic = ballsArr[i];
        balls.push({
          key:i, ball_1:dic.ball_1, ball_2:dic.ball_2,
        })
      }
      return this._ballsPKCreateView(values, balls, viewHeight, numColumn)
    }

    return this._ball0_9CreateView(values, balls, isClick, viewHeight, numColumn, isOnlyAllClear);
  }

  _lhcCreateViews(values) {
    let numColumn = 3;
    var viewHeight = Adaption.Height(120); // 两行的

    // 需要显示的号码：
    var balls = [];
    if (values.tpl == 0) {
      // 特码AB 正码 01〜49 有赔率
      numColumn = 5;
      viewHeight = Adaption.Height(800);
      for (var i = 1; i <= 49; i++) {
        balls.push(i < 10 ? `0${i}` : `${i}`);
      }
      return this._lhcBalls09PeilvCreateView(values, balls, viewHeight, numColumn);

    } else if (values.tpl == 1) {
      // 特码两面
      viewHeight = Adaption.Height(600);
      balls = ['特大', '特双', '特小单', '特地肖', '特小', '特大单', '特小双', '特前肖', '特大尾', '特大双', '特合单', '特后肖', '特小尾', '特合大', '特合双', '特家肖', '特单', '特合小', '特天肖', '特野肖'];
      return this._lhcBallsBlockPeilvCreateView(values, balls, viewHeight, numColumn);

    } else if (values.tpl == 2) {
      // 特码色波
      numColumn = 2;
      viewHeight = Adaption.Height(400);
      balls = ['红波', '蓝波', '绿波'];
      let ballsNumDec = ['01 02 07 08 12 13 18 19 23 24 29 30 34 35 40 45 46', '03 04 09 10 14 15 20 25 26 31 36 37 41 42 47 48', ' 05 06 11 16 17 21 22 27 28 32 33 38 39 43 44 49'];
      return this._lhcBallsBlockNumPeilvCreateView(values, balls, viewHeight, numColumn, ballsNumDec);

    } else if (values.tpl == 3) {
      // 特半波
      viewHeight = Adaption.Height(350);
      balls = ['红大', '红小', '红单', '红双', '蓝大', '蓝小', '蓝单', '蓝双', '绿大', '绿小', '绿单', '绿双'];
      return this._lhcBallsBlockPeilvCreateView(values, balls, viewHeight, numColumn);

    } else if (values.tpl == 4) {
      // 特半半波
      viewHeight = Adaption.Height(350);
      balls = ['红大单', '红小单', '红大双', '红小双', '蓝大单', '蓝小单', '蓝大双', '蓝小双', '绿大单', '绿小单', '绿大双', '绿小双'];
      return this._lhcBallsBlockPeilvCreateView(values, balls, viewHeight, numColumn);

    } else if (values.tpl == 5) {
      // 特头尾数
      viewHeight = Adaption.Height(430);
      balls = ['0头', '1头', '2头', '3头', '4头', '1尾', '2尾', '3尾', '4尾', '5尾', '6尾', '7尾', '8尾', '9尾', '0尾'];
      return this._lhcBallsBlockPeilvCreateView(values, balls, viewHeight, numColumn);

    } else if (values.tpl == 6 || values.tpl == 14) {
      // 特肖、平特一肖 || 二三四五连肖
      viewHeight = Adaption.Height(500);

      var default_shengxiao = this._shengxiaoIdxBalls();
      var ballsNumDec = [];
      for (var b in default_shengxiao) {
        balls.push(default_shengxiao[b].name);
        let ballAr = default_shengxiao[b].balls;
        ballsNumDec.push(ballAr.join(' '));
      }

      return this._lhcBallsBlockNumPeilvCreateView(values, balls, viewHeight, numColumn, ballsNumDec);

    } else if (values.tpl == 7) {
      // 合肖。 赔率在上方显示。
      viewHeight = Adaption.Height(450);

      var default_shengxiao = this._shengxiaoIdxBalls();
      var ballsNumDec = [];
      for (var b in default_shengxiao) {
        balls.push(default_shengxiao[b].name);
        let ballAr = default_shengxiao[b].balls;
        ballsNumDec.push(ballAr.join(' '));
      }

     return this._lhcBallsBlockNumPeilvCreateView(values, balls, viewHeight, numColumn, ballsNumDec);

    } else if (values.tpl == 8) {
      // 五行
      numColumn = 2;
      viewHeight = Adaption.Height(500);
      balls = ['金', '木', '水', '火', '土'];
      let ballsNumDec = ['03 04 17 18 25  26 33 34 47 48', '07 08 15 16 29  30 37 38 45 46', '05 06 13 14 21  22 35 36 43 44', '01 02 09 10 23  24 31 32 39 40', '11  12  19 20 27  28 41 42 49'];
      return this._lhcBallsBlockNumPeilvCreateView(values, balls, viewHeight, numColumn, ballsNumDec);

    } else if (values.tpl == 9 || values.tpl == 15) {
      // 平特尾数 || 2345连尾
      viewHeight = Adaption.Height(500);
      balls = ['0尾', '1尾', '2尾', '3尾', '4尾', '5尾', '6尾', '7尾', '8尾', '9尾'];
      let ballsNumDec = ['10 20 30 40', '01 11 21 31 41', '02 12 22 32 42', '03 13 23 33 43', '04 14 24 34 44', '05 15 25 35 45', '06 16 26 36 46', '07 17 27 37 47', '08 18 28 38 48', '09 19 29 39 49'];
      return this._lhcBallsBlockNumPeilvCreateView(values, balls, viewHeight, numColumn, ballsNumDec);

    } else if (values.tpl == 10) {
      // 七色波
      viewHeight = Adaption.Height(200);
      balls = ['红波', '蓝波', '绿波', '和局'];
      return this._lhcBallsBlockPeilvCreateView(values, balls, viewHeight, numColumn);

    } else if (values.tpl == 11) {
      // 总肖
      viewHeight = Adaption.Height(280);
      balls = ['2肖', '3肖', '4肖', '5肖', '6肖', '7肖', '总肖单', '总肖双'];
      return this._lhcBallsBlockPeilvCreateView(values, balls, viewHeight, numColumn);

    } else if (values.tpl == 12) {
      // 自选不中
      numColumn = 5;
      viewHeight = Adaption.Height(600);
      for (var i = 1; i <= 49; i++) {
        balls.push({key:i, ball: i<10 ? `0${i}` : `${i}`});
      }
      return this._lhcBalls09CreateView(values, balls, viewHeight, numColumn);

    } else if (values.tpl == 13) {
      // 连码
      numColumn = 5;
      viewHeight = Adaption.Height(600);
      for (var i = 1; i <= 49; i++) {
        balls.push({key:i, ball: i<10 ? `0${i}` : `${i}`});
      }
      return this._lhcBalls09CreateView(values, balls, viewHeight, numColumn);
    }
  }

  // 生肖下标 的号码
  _shengxiaoIdxBalls () {

    var default_shengxiao = {
      ba_0: {name: '鼠', idx: 0, balls: []},
      ba_1: {name: '牛', idx: 1, balls: []},
      ba_2: {name: '虎', idx: 2, balls: []},
      ba_3: {name: '兔', idx: 3, balls: []},
      ba_4: {name: '龙', idx: 4, balls: []},
      ba_5: {name: '蛇', idx: 5, balls: []},
      ba_6: {name: '马', idx: 6, balls: []},
      ba_7: {name: '羊', idx: 7, balls: []},
      ba_8: {name: '猴', idx: 8, balls: []},
      ba_9: {name: '鸡', idx: 9, balls: []},
      ba_10: {name: '狗', idx: 10, balls: []},
      ba_11: {name: '猪', idx: 11, balls: []},
    };

    let currenYear = moment().format('YYYY'); // 获取到当前时间是哪一年
    let currenYid = (parseInt(currenYear) - 4) % 12; // 0-11 当年生肖的下标
    let shidx = global.yearId != '' ? parseInt(global.yearId) : currenYid;
    for (var k in default_shengxiao) {
      var start_balls = shidx - default_shengxiao[k].idx + 1;  // 计算生肖位置开始号码
      if (start_balls < 0) {
        start_balls = 12 + start_balls;
      }
      // 输出生肖对应的号码
      for (var i = start_balls; i < 49; i += 12) {
        if (i === 0) {
          continue;
        }
        var theball = i > 9 ? (i + '') : ('0' + i);
        default_shengxiao[k].balls.push(theball);
      }
    }
    return default_shengxiao;
  }

  _sscRxView(PlayValues) {
    let playid = PlayValues.playid;
    let rx2 = playid == '59' || playid == '60' || playid == '62';
    let rx3 = playid == '65' || playid == '66' || playid == '68' || playid == '71';
    let rx4 = playid == '74' || playid == '75' || playid == '76' || playid == '77';
    if (this.props.js_tag == 'ssc' && (rx2 || rx3 || rx4)) {

      let titArr = ['万位', '千位', '百位', '十位', '个位'];
      let rxData = [];
      let state = false;
      let position = 0;
      for (let i = 0; i < titArr.length; i++) {
        if (rx2) {
          if (i >= 3) {
            state = true;
            position = 2;
          }
        } else if (rx3) {
          if (i >= 2) {
            state = true;
            position = 3;
          }
        } else if (rx4) {
          if (i >= 1) {
            state = true;
            position = 4;
          }
        }
        rxData.push({key:i, title:titArr[i], state:state})
      }
      let play_title = `从万位、千位、百位、十位、个位中至少选择${position}位`;

      this.state.rxData = this.state.rxData.length > 0 ? this.state.rxData : rxData;

      return (
        <SSCRxBottomView style = {{marginTop:10, width:SCREEN_WIDTH, height:70}}
          play_title = {play_title}
          data = {this.state.rxData}
          selectPostionArr = {(rxPostionArr) => {
            this.setState({
              rxData:rxPostionArr,
            })
            let rxTitleArr = [];
            let ballDict = this.state.ballsData;
            if (Object.keys(ballDict).length > 0) {
              rxPostionArr.map((dic, i) => {
                if (dic.state == true) {
                  rxTitleArr.push(dic.title);
                }
              })
              Object.assign(ballDict, {'rx_title':rxTitleArr});
              this.props.ballsClick?this.props.ballsClick(ballDict, this.props.currentPlayValues.content.split(' ')):null;
            }

          }}>
        </SSCRxBottomView>
      )
    }
  }

  render() {

    //高低频彩3D
    let islowCaiZhong = this.props.js_tag == 'lhc' || this.props.js_tag == '3d';

    return (
      <View style={this.props.style}>
        <View style={{ height: Adaption.Width(50), width: SCREEN_WIDTH, backgroundColor: 'rgba(244,242,228,1)', flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1.0, borderColor: 'lightgrey' }}>
          <View style={{ flex: 0.3 }}>
            {(islowCaiZhong) ? null :
              <TouchableOpacity activeOpacity={0.7} 
              style={{ marginLeft:10, width: Adaption.Width(100), height: Adaption.Width(37), borderWidth: 1.0, borderColor: '#888', borderRadius: 5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
              onPress={() => {
                this.setState({
                  isBallsChange: true,
                })
              }}>
              <Image style={{ width: Adaption.Width(23), height: Adaption.Width(23) }} source={require('../../img/ic_yaoyiyao.png')}></Image>
              <Text allowFontScaling={false} style={{ marginLeft: Adaption.Width(10), color: '#777', fontSize: Adaption.Font(17, 14) }}>摇一摇</Text>
              </TouchableOpacity>
            }
          </View>
          <View style={{ flex: 0.4 }}></View>
          <View style={{ flex: 0.3 }}>
            <TouchableOpacity activeOpacity={0.7}
              style={{ width: Adaption.Width(105), height: Adaption.Width(37), borderWidth: 1.0, borderColor: '#888', borderRadius: 5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
              onPress={() => {
                this.props.shopCarClick ? this.props.shopCarClick() : null;
              }}>
              <Image style={{ width: Adaption.Width(23), height: Adaption.Width(23) }} source={require('../../img/ic_shopCar.png')}></Image>
              <Text allowFontScaling={false} style={{ marginLeft: Adaption.Width(10), color: '#777', fontSize: Adaption.Font(17, 14) }}>购物车</Text>
            </TouchableOpacity>
            {this.props.shopCarZhushuNum == 0 ? null :
              <View style={{
                backgroundColor: '#f00', width: Adaption.Width(22), height: Adaption.Width(22), borderRadius: Adaption.Width(11.5),
                justifyContent: 'center', alignItems: 'center', position: 'absolute', top: -3, left: Adaption.Width(25)
              }}>
                <Text allowFontScaling={false} style={{ fontSize: this.props.shopCarZhushuNum > 99 ? Adaption.Font(11) : Adaption.Font(14), color: '#fff', backgroundColor: 'rgba(0,0,0,0)' }}>{this.props.shopCarZhushuNum > 99 ? '99+' : this.props.shopCarZhushuNum}</Text>
              </View>
            }
          </View>
        </View>

        <ScrollView style={this.props.style}
          automaticallyAdjustContentInsets={false}
          alwaysBounceHorizontal={false}
          showsVerticalScrollIndicator={false}
        >
          {this._createBallsBlockView(this.props.currentPlayValues)}
          {this._sscRxView(this.props.currentPlayValues)}
        </ScrollView>
      </View>
    );
    // return(
    //   <View style = {this.props.style}>
    //     {(this.props.tag == 'xglhc' || this.props.tag == 'fc3d' || this.props.tag == 'pl3') ? null :
    //       <View style = {{height:Adaption.Width(50), width:SCREEN_WIDTH, backgroundColor:'rgba(244,242,228,1)', flexDirection:'row', alignItems:'center', borderBottomWidth:1.0, borderColor:'lightgrey'}}>
    //          <View style = {{flex:0.72}}><Image style = {{width:Adaption.Width(100), height:Adaption.Width(40), marginLeft:10}} source = {require('../../img/ic_shakeOneMore.png')}></Image></View>
    //          <View style = {{flex:0.28}}>
    //            <TouchableOpacity activeOpacity={0.7} onPress = {()=> {
    //              this.setState({
    //                isBallsChange:true,
    //              })
    //            }}>
    //              <Image style = {{width:Adaption.Width(100), height:Adaption.Width(40), borderRadius:5}} source = {require('../../img/ic_arcdomPicke.png')}></Image>
    //            </TouchableOpacity>
    //          </View>
    //       </View>
    //     }

    //     <ScrollView style = {this.props.style}
    //       automaticallyAdjustContentInsets={false}
    //       alwaysBounceHorizontal = {false}
    //       showsVerticalScrollIndicator = {false}
    //       >
    //       {this._createBallsBlockView(this.props.currentPlayValues)}
    //       {this._sscRxView(this.props.currentPlayValues)}
    //     </ScrollView>
    //  </View>
    // );
  }
}

export default BuyCenter;
