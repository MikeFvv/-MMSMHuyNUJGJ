/**
 Created by Money on 2018/01/04

   投注选号View的总管家
   
   请不要格式化代码，谢谢！。
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
  Vibration,
} from 'react-native';

import RNShakeEvent from 'react-native-shake-event';  //导入检测震动方法

import NewGameDateSelctView from './NewGameDateSelctView'; //新版玩法选择视图
import NewBalls0_9Peilv from './NewBalls/NBalls0_9Peilv'
import NSquareBallsView from './NewBalls/NSquareBallsView'
import SingleInputView from './NewBalls/SingleInputView'
import NLhcOptionView from './NewBalls/NLhcOptionView'
import GetBallStatus from '../newBuyTool/GetBallStatus';

let leftW = SCREEN_WIDTH * 0.26;
let rightW = SCREEN_WIDTH * 0.74;

var oneIdx_left = 0;  // 左边listview选择的下标
var towIdx = 0;  //当前选择的是二级玩法菜单下标
var threeIdx = 0;  //当前选择的三级玩法菜单下标

export default class NewBuyCenter extends Component {

  constructor(props) {
    super(props);

    // 点击右上角的切换彩种 要重新走到这里 BuyLotDetail的isRefreshBuyCenter控制。
    oneIdx_left = 0; towIdx = 0; threeIdx = 0;

    // 点击导航的官方信用玩法切换成功 也要走到这里。props.wafaDataArr才有值
    var leftTitleArr = [], submenuData = [], playDate = {}, showSelectPlay = false;
    if (props.wafaDataArr.length > 0) {

      // 双面玩法。 不需要选择玩法的弹出框。submenuData不给值。
      if (props.wanfaindex == 1 && props.wafaDataArr.length == 1) {
        
        let list = props.wafaDataArr[0].submenu[0].playlist;
        for (let k = 0; k < list.length; k++) {
          leftTitleArr.push({ key: k, title: list[k].playname });
        }
        playDate = list[oneIdx_left];

      } else {
        
        for (let k = 0; k < props.wafaDataArr.length; k++) {
          let data = props.wafaDataArr[k];
          leftTitleArr.push({ key: k, title: data.name });
        }

        submenuData = props.wafaDataArr[oneIdx_left].submenu;
        playDate = submenuData[towIdx].playlist[threeIdx];
        showSelectPlay = this._InterfaceIsShowPeilvViewToPlayData(playDate, true);
      }
    }

    this.state = {
      leftTitleData: leftTitleArr, // 一级
      currentSubmenuData: submenuData, // 二级 弹出玩法的数据
      currentPlayDate: playDate, // 三级 弹出玩法点击时改变
      isShowPlaySelectView: false, // 是否显示 玩法选择视图
      isShowSelectPlay: showSelectPlay,  // 是否显示 选择玩法的那个按钮。
      ballsData: {}, // 选择的号码
      isBallsChange: false, // 随机
      clearAllBalls: false, // 清空
      rxData: [], // 任选
      TitlesArr: [], // 1.渲染视图时 把titArr 和ballsArr存起来。
      BallAsrr: [], // 2.避免切换玩法时 没有选号直接进入购物车里面点机选一注拿不到要机选的号码。
    };
  }

  
  componentWillReceiveProps(nextProps) {
  
    if (nextProps.wafaDataArr == null || nextProps.wafaDataArr.length == 0) {
      return;
    }

    var leftTitleArr = [];

    // 双面玩法。 不需要选择玩法的弹出框。submenuData不给值。
    if (nextProps.wanfaindex == 1 && nextProps.wafaDataArr.length == 1) {

      let list = nextProps.wafaDataArr[0].submenu[0].playlist;
      for (let k = 0; k < list.length; k++) {
        leftTitleArr.push({ key: k, title: list[k].playname });
      }
      
      this.setState({
        leftTitleData: leftTitleArr,
        currentPlayDate: list[oneIdx_left],
      })

    } else {

      for (let k = 0; k < nextProps.wafaDataArr.length; k++) {
        let data = nextProps.wafaDataArr[k];
        leftTitleArr.push({ key: k, title: data.name });
      }

      let submenuDatas = nextProps.wafaDataArr[oneIdx_left].submenu;
      this._InterfaceIsShowPeilvViewToPlayData(submenuDatas[towIdx].playlist[threeIdx]);

      this.setState({
        leftTitleData: leftTitleArr,
        currentSubmenuData: submenuDatas,
        currentPlayDate: submenuDatas[towIdx].playlist[threeIdx],
      }) 
    }
  }

  // 返回是否要刷新render
  shouldComponentUpdate(nextProps, nextState) {
    let aa = nextProps.wafaDataArr != this.props.wafaDataArr || nextProps.peilvDataArr != this.props.peilvDataArr || nextProps.shopCarZhushuNum != this.props.shopCarZhushuNum; //数据改变
    let bb = nextState.currentPlayDate != this.state.currentPlayDate; // 当前玩法数据改变
    let cc = nextState.clearAllBalls != this.state.clearAllBalls;  // 清空选号
    let dd = nextState.isShowPlaySelectView != this.state.isShowPlaySelectView;  // 是否玩法选择
    let ee = nextState.isBallsChange == true; // 是否机选
    let ff = Object.keys(nextState.ballsData)[0] != null; // 有选号内容的。 主要为六合连码改赔率、K3 11X5不能选相同号
    if (aa || bb || cc || dd || ee || ff) {
        return true;
    } else {
        return false;
    }
  }

  
  componentDidMount() {

    //添加摇一摇监听
    RNShakeEvent.addEventListener('shake', () => {

      // speed == '1', 属于高频彩，设置为都可以摇一摇选号
      if (this.props.speed == '1' && global.isInBuyLotVC == true && global.isOpenShake == true) {
        Vibration.vibrate([0, 1000], false); //false 表示只震动一次
        this.setState({
          isBallsChange: true,
        })
      }
    })

    //清空号码的通知
    this.subscription = PushNotification.addListener('ClearAllBalls', () => {
      this.setState({
        clearAllBalls: true,
      })
    });
  }

  //移除通知和摇一摇监听
  componentWillUnmount() {

    if (typeof (this.subscription) == 'object') {
      this.subscription && this.subscription.remove();
    }

    RNShakeEvent.removeEventListener('shake');
  }


  _createBallsBlockView(Values) {
    if (Object.keys(Values).length <= 0) {
      return [];
    }

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

    } else if (this.props.js_tag == 'qxc') {
      return this._qxcCreateViews(Values); // 海南七星彩

    } else if (this.props.js_tag == 'lhc') {
      return this.props.wanfaindex == 0 ? this._lhcCreateViews(Values) : this._lhcOptionViews(Values);
    }
  }

  // 选号回调处理方法。
  _ballsHandle(selectBalls, value) {

    let ballDict = this.state.ballsData;

    // lhc特殊的加个赔率
    if (this.props.js_tag == 'lhc') {
      let peilvStr = this._getPeilvWithPlayid(value.playid);

      if (value.tpl == '7' || value.tpl == '12') {
        // 特肖-合肖 || 自选不中
        let baseIdx = value.tpl == '7' ? 2 : 6;  // 合肖2个号，自选不中要6个号
        let tit = Object.keys(selectBalls)[0];
        let ballsLength = selectBalls[tit].length;
        if (ballsLength >= baseIdx && ballsLength <= 11) {
          // 自选不中，6个号码至11个号码 拿赔率。小于6就把赔率搞为0；
          selectBalls['赔率'] = peilvStr.split('|')[ballsLength - baseIdx];
        } else {
          selectBalls['赔率'] = '0';
        }
      } else if (value.tpl == '13' || value.tpl == '14' || value.tpl == '15') {
        // 连码 || 连选-连肖、连尾
        if (peilvStr.length < 20) {
          selectBalls['赔率'] = peilvStr; 
        }
      }

      // 自选 统一输入金额的。
      if (this.props.wanfaindex == 0 && ballDict['LhcPrice'] == null && selectBalls['LhcPrice'] == null && this.refs.PriceInput) {
        let price = this.refs.PriceInput._lastNativeText ? this.refs.PriceInput._lastNativeText : '0';
        selectBalls['LhcPrice'] = price;
      }

    }


    // Object.assign方法，一旦遇到同名属性会替换，没有同名就是添加。
    Object.assign(ballDict, selectBalls);

    // 号码为空。要删除存在的key
    let ballArr = Object.values(selectBalls);
    if (ballArr[0].length <= 0) {
      let tit = Object.keys(selectBalls)[0];
      delete ballDict[tit]; // 删除为空的key

      if (ballDict[`${tit}^^01`] != null) { // 可能还有一个`${title}^^01`的，也要删除。
        delete ballDict[`${tit}^^01`];
      }

      if (ballDict[`赔率`] != null) { // 可能还有一个赔率的，也要删除。
        delete ballDict[`赔率`];
      }

      if (ballDict[`LhcPrice`] != null) { // 六合彩自选的价格
        delete ballDict[`LhcPrice`];
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

    // 万千百十个位的按顺序存放
    let newBallDic = {};
    let keyArr = Object.keys(ballDict);
    // 时时彩 任选的ballDict加了rx_title的字段不能执行这个
    if (keyArr.length > 1 && ballDict.赔率 == null && value.leftTitles.length > 1 && this.state.rxData.length <= 0) {
      for (b in value.leftTitles) {
        let title = value.leftTitles[b];
        if (keyArr.includes(title)) {
          Object.assign(newBallDic, { [title]: ballDict[title] });
          if (keyArr.includes(`${title}^^01`)) {
            // k3二同号 / 大小单双。要多一个
            Object.assign(newBallDic, { [`${title}^^01`]: ballDict[`${title}^^01`] });
          }
        }
      }
      ballDict = newBallDic;
    }

    this.setState({
      ballsData: ballDict,
    })
    return ballDict;
  }

  // 创建Balls0_9Peilv的视图  H:80 NoPeilv H:65   
  _balls09PeilvCreateView(values, balls, isShowTitlt, viewHeight, numColumn, contents) {

    if (balls.length <= 0) {
      return [];
    }
    
    let contentArr = contents && contents.length > 0 ? contents : (values.content.includes('+') ? values.content.split('+') : [values.playname]);
    let peilvArr = this._getPeilvWithPlayid(values.playid).split('|'); 
    this.state.BallAsrr = [];

    // 胆码|1 拖码|2，截断|后面的
    if (values.content.includes('|')) {
      for (let a = 0; a < contentArr.length; a++) {
        contentArr[a] = contentArr[a].split('|')[0];
      }
    }
    
    // 双面盘的 contentArr都要重写。balls也要另外组合
    let sscSMP = this.props.js_tag == 'ssc' && values.playid == 128;
    let pk10SMP = this.props.js_tag == 'pk10' && values.playid == 14;
    let x11x5SMP = this.props.js_tag == '11x5' && values.playid == 56;
    let d3dSMP = this.props.js_tag == '3d' && values.playid == 26;
    let k3SMP = this.props.js_tag == 'k3' && values.playid == 14;
    let pcddHH = this.props.js_tag == 'pcdd' && values.playid == 3; // pcdd混合
    let d3dLHD = this.props.js_tag == '3d' && values.playid == 27; // 3D龙虎斗
    let x11x5LHD = this.props.js_tag == '11x5' && values.playid == 54; // 11x5龙虎斗
    let sscLHD = this.props.js_tag == 'ssc' && values.playid == 129; // ssc龙虎斗
    let pk10GYH = this.props.js_tag == 'pk10' && values.playid == 7; // pk10冠亚和
    let qxcHZZX = this.props.js_tag == 'qxc' && values.playid == 7; // qxc和值组选

    if (sscSMP || pk10SMP || x11x5SMP || d3dSMP || k3SMP || pcddHH || d3dLHD || x11x5LHD || sscLHD || pk10GYH || qxcHZZX) {
      
      if (sscSMP) {
        contentArr = ['总和值', '后二和值', '万位', '千位', '百位', '十位', '个位'];
      } else if (pk10SMP) {
        contentArr = ['冠军', '亚军', '季军', '四名', '五名', '六名', '七名', '八名', '九名', '十名'];
      } else if (x11x5SMP) {
        contentArr = ['总和值', '后二和值', '号码一', '号码二', '号码三', '号码四', '号码五'];
      } else if (d3dSMP) {
        contentArr = ['总和值', '后二和值', '百位', '十位', '个位'];
      } else if (k3SMP) {
        contentArr = ['号码一', '号码二', '号码三', '混合'];
      } else if (pcddHH) {
        contentArr = ['特码大小单双', '色波/豹子'];
      } else if (x11x5LHD) {
        contentArr = ['一位、二位', '一位、三位', '一位、四位', '一位、五位', '二位、三位', '二位、四位', '二位、五位', '三位、四位', '三位、五位', '四位、五位'];
      } else if (sscLHD) {
        contentArr = ['万、千', '万、百', '万、拾', '万、个', '千、百', '千、拾', '千、个', '百、拾', '百、个', '拾、个'];
      } else if (pk10GYH) {
        contentArr = ['1冠亚和', '2冠亚和'];
      }
      
    
    } else {
      // 不是双面盘的。
      // 不显示赔率的。传入的balls包括key和ball。 
      if (balls[0].key == null) {
        for (let k = 0; k < balls.length; k++) {
          balls[k] = { key: k, ball: balls[k] };
          if (peilvArr.length > 1) {
            balls[k].peilv = peilvArr[k] ? peilvArr[k] : '0.0';
          }
        }
      }
      this.state.BallAsrr = balls;
    }

    let isshowtitle = isShowTitlt ? true : (contentArr.length > 1 ? true : false);
    if (pk10GYH) {
      isshowtitle = false;
    }
    this.state.TitlesArr = contentArr; 

    var blockViews = [];
    for (let i = 0; i < contentArr.length; i++) {

      if (sscSMP) {
        // 双面盘
        balls = i == 1 ? ['大', '小', '单', '双', '中'] : ['大', '小', '单', '双'];
        viewHeight = i == 1 ? 200 : 110;

        for (let b = 0; b < balls.length; b++) {
          let idx = i > 1 ? i*4+b+1 : i*4+b;
          balls[b] = { key: idx, ball: balls[b], ballNum: idx, peilv: peilvArr[idx] };
        }  
        // 双面盘的 要拼一起。
        this.state.BallAsrr = [...this.state.BallAsrr, ...balls];

      } else if (pk10SMP) {
        viewHeight = i < 5 ? 160 : 90; // 赔率统一
        balls = i < 5 ? ['大', '小', '单', '双', '龙', '虎'] : ['大', '小', '单', '双'];

        for (let b = 0; b < balls.length; b++) {
          // let idx = i > 6 ? i*6+b-(i-6)*2 : i*6+b;
          balls[b] = { key: b, ball: balls[b] };
        }  
        // 双面盘的 要拼一起。
        this.state.BallAsrr = [...this.state.BallAsrr, ...balls];

      } else if (x11x5SMP) {
        balls = i == 0 ? ['大', '小', '单', '双', '尾大', '尾小'] : ['大', '小', '单', '双'];
        viewHeight = i == 0 ? 200 : 110;

        for (let b = 0; b < balls.length; b++) {
          let idx = i*4+b + (i > 0 ? 2 : 0);
          balls[b] = { key: idx, ball: balls[b], ballNum: idx, peilv: peilvArr[idx] };
        }  
        this.state.BallAsrr = [...this.state.BallAsrr, ...balls];

      } else if (d3dSMP) {
        viewHeight = i <= 1 ? 200 : 110;
        balls = i == 0 ? ['大', '小', '单', '双', '尾大', '尾小'] : i == 1 ? ['大', '小', '单', '双', '中'] : ['大', '小', '单', '双']; 
        
        for (let b = 0; b < balls.length; b++) {
          let idx = i*4+b + (i == 1 ? 2 : (i > 1 ? 3 : 0));
          balls[b] = { key: idx, ball: balls[b], ballNum: idx, peilv: peilvArr[idx] };
        }  
        this.state.BallAsrr = [...this.state.BallAsrr, ...balls];

      } else if (k3SMP) {
        balls = i == 3 ? ['半顺', '红号', '大红', '小红'] : ['大', '小', '单', '双']; 
        
        for (let b = 0; b < balls.length; b++) {
          let idx = i*4+b;
          balls[b] = { key: idx, ball: balls[b], ballNum: idx, peilv: peilvArr[idx] };
        }  
        this.state.BallAsrr = [...this.state.BallAsrr, ...balls];

      } else if (pcddHH) {
        balls =  balls = i == 0 ? ['大', '小', '单', '双', '大单', '小单', '大双', '小双', '极大', '极小'] : ['红波', '绿波', '蓝波', '豹子'];
        viewHeight = i == 0 ? 300 : 120;

        for (let b = 0; b < balls.length; b++) {
          let idx = i*10+b;
          balls[b] = { key: idx, ball: balls[b], ballNum: idx, peilv: peilvArr[idx] };
        }  
        this.state.BallAsrr = [...this.state.BallAsrr, ...balls];

      } else if (d3dLHD) {
        balls = ['龙', '虎', '和'];
        for (let b = 0; b < balls.length; b++) {
          let idx = i*3+b;
          balls[b] = { key: idx, ball: balls[b], ballNum: idx, peilv: peilvArr[peilvArr.length == balls.length ? b : idx] };
        }  
        this.state.BallAsrr = [...this.state.BallAsrr, ...balls];

      } else if (x11x5LHD) {
        balls = ['龙', '虎'];  // 赔率统一
        for (let b = 0; b < balls.length; b++) {
          let idx = i*2+b;
          balls[b] = { key: idx, ball: balls[b], ballNum: idx };
        }  
        this.state.BallAsrr = [...this.state.BallAsrr, ...balls];

      } else if (sscLHD) {
        balls = ['龙', '虎', '和'];
        for (let b = 0; b < balls.length; b++) {
          let idx = i*3+b;
          balls[b] = { key: idx, ball: balls[b], ballNum: idx, peilv: peilvArr[peilvArr.length == balls.length ? b : idx] };
        }  
        this.state.BallAsrr = [...this.state.BallAsrr, ...balls];

      } else if (pk10GYH) {
        viewHeight = i == 0 ? 2 * 96 : 5 * 90;
        if (i == 0) {
          balls = ['大', '小', '单', '双', '中', '和'];
        } else {
          balls = [];
          for (let i = 3; i <= 19; i++) {
            balls.push(`${i}`);
          }
        }
        for (let b = 0; b < balls.length; b++) {
          let idx = i*6+b;
          balls[b] = { key: idx, ball: balls[b], ballNum: idx, peilv: peilvArr[idx] };
        } 
        this.state.TitlesArr = ['冠亚和'];
        this.state.BallAsrr = [...this.state.BallAsrr, ...balls];

      }  else if (qxcHZZX) {
        balls = i == 0 ? ['大', '小', '单', '双'] : ['大单', '小单', '大双', '小双'];
        for (let b = 0; b < balls.length; b++) {
          let idx = i*4+b;
          balls[b] = { key: idx, ball: balls[b], ballNum: idx, peilv: peilvArr[idx] ? peilvArr[idx] : '0.0' };
        }  
        this.state.BallAsrr = [...this.state.BallAsrr, ...balls];
      }

      blockViews.push(
        <NewBalls0_9Peilv key={i} style={{ width: rightW, height: Adaption.Width(viewHeight - (isshowtitle ? 0 : 20)) }}
          balls={balls}  // 要显示的号码
          title={contentArr[i]}  // 左上角的title
          isShowTitlt={isshowtitle} // 是否显示title ->万位、千位
          numColumn={numColumn} // 每行显示几个号码
          isBallsChange={this.state.isBallsChange ? true : false} // 是否随机
          clearAllBalls={this.state.clearAllBalls ? true : false} // 是否清空号码
          idx={i}  // 主要是记录是第几排的。 随机用到！
          js_tag={this.props.js_tag}
          tpl={values.tpl}
          playid={values.playid}
          ballClick={(selectBalls) => {
            let val = { leftTitles: contentArr, playid: values.playid, tpl: values.tpl };
            let dict = this._ballsHandle(selectBalls, val);
            if (this.props.js_tag == 'pk10' && values.playid == 7) {
              // pk10冠亚和
              dict = this._pk10GyhBalls(dict);
            }
            this.props.ballsClick ? this.props.ballsClick(dict, this.state.currentPlayDate, this.state.TitlesArr, this.state.BallAsrr) : null;
            // 选了号码回来了，要重新设为false。
            this.setState({
              isBallsChange: false,
              clearAllBalls: false,
            })
          }}
        >
        </NewBalls0_9Peilv>
      );
    }
    return blockViews;
  }

  _pk10GyhBalls(ballDict) {
      // pk10冠亚和  
      let aaa1 = ballDict['1冠亚和'];
      let aaa2 = ballDict['2冠亚和'];
      let bbb1 = ballDict['1冠亚和^^01'];
      let bbb2 = ballDict['2冠亚和^^01'];
      return {'冠亚和': [...(aaa1 == null ? [] : aaa1), ...(aaa2 == null ? [] : aaa2)], '冠亚和^^01': [...(bbb1 == null ? [] : bbb1), ...(bbb2 == null ? [] : bbb2)]};
  }

  // 创建BallsK3View的视图   H:90  NoPeilv H:80
  _ballsSquareCreateView(values, balls, isShowTitlt, viewHeight, numColumn, itemHeight) {
    if (balls.length <= 0) { return [] }

    let contentArr = values.content.includes('+') ? values.content.split('+') : [values.playname];
    let peilvArr = this._getPeilvWithPlayid(values.playid).split('|');
    this.state.BallAsrr = [];

    // 胆码|1 拖码|2，截断|后面的
    if (values.content.includes('|')) {
      for (let a = 0; a < contentArr.length; a++) {
        contentArr[a] = contentArr[a].split('|')[0];
      }
    }

    let playid = values.playid;
    // 双面盘的 contentArr都要重写。balls也要另外组合
    if (this.props.js_tag == 'k3' && (playid == 8 || playid == 14 || playid == 15)) {
      // 二同号-单选 || 双面盘 || 三同号
      if (values.playid == 14) {
        contentArr = ['号码一', '号码二', '号码三', '混合'];
      } else if (values.playid == 8) {
        contentArr = ['同号', '不同号'];
      } else if (values.playid == 15) {
        contentArr = ['通选', '单选'];
      }

    } else {
      // 拼好balls需要的数据,
      for (let i = 0; i < balls.length; i++) {
        if (balls[i].ball != null) {
          balls[i].key = i;
          if (peilvArr.length > 1 && (values.tpl != 7 && this.props.js_tag == 'lhc')) {
            balls[i].peilv = peilvArr[i];
          }
        } else {
          balls[i] = { key: i, ball: balls[i] };
          if (peilvArr.length > 1) {
            balls[i].peilv = peilvArr[i];
          }
        }
      }
      this.state.BallAsrr = balls;
    }
    
    let isshowtitle = contentArr.length > 1 ? true : (isShowTitlt ? true : false);
    this.state.TitlesArr = contentArr; 

    var blockViews = [];
    for (let i = 0; i < contentArr.length; i++) {

      if (this.props.js_tag == 'k3' && (playid == 8 || playid == 14 || playid == 15)) {
        if (playid == 14) {
          balls = i == 3 ? ['半顺', '红号', '大红', '小红'] : ['大', '小', '单', '双']; 
          
          for (let b = 0; b < balls.length; b++) {
            let idx = i*4+b;
            balls[b] = { key: idx, ball: balls[b], ballNum: idx, peilv: peilvArr[idx] };
          }  
          this.state.BallAsrr = [...this.state.BallAsrr, ...balls];
  
        } else if (playid == 8) {
          balls = [];
          for (let j = 1; j <= 6; j++) {
            balls.push({ key: i*6+j, ball: i == 0 ? `${j}${j}` : `${j}` })
          }
          this.state.BallAsrr = [...this.state.BallAsrr, ...balls];

        } else if (playid == 15) {
          viewHeight = i == 0 ? 130 : 200;
          numColumn = i == 0 ? 1 : 3;
          balls = i == 0 ? ['三同号通选'] : ['111', '222', '333', '444', '555', '666'];

          for (let b = 0; b < balls.length; b++) {
            let idx = i+b;
            balls[b] = { key: idx, ball: balls[b], ballNum: idx, peilv: peilvArr[idx] };
          } 
          this.state.BallAsrr = [...this.state.BallAsrr, ...balls];
        }
      }

      blockViews.push(
        <NSquareBallsView key={i} style={{ width: rightW, height: Adaption.Width(viewHeight - (isshowtitle ? 0 : 20)) }}
          balls={balls}
          title={contentArr[i]}
          isShowTitlt={isshowtitle} // 是否显示title ->万位、千位
          numColumn={numColumn} // 每行显示几个号码
          itemHeight={itemHeight}
          isBallsChange={this.state.isBallsChange ? true : false} // 是否随机
          clearAllBalls={this.state.clearAllBalls ? true : false} // 是否清空号码
          idx={i}  // 主要是记录是第几排的。 随机用到！
          js_tag={this.props.js_tag}
          tpl={values.tpl}
          playid={values.playid}
          ballClick={(selectBalls) => {
            let val = { leftTitles: contentArr, playid: values.playid, tpl: values.tpl };
            let dict = this._ballsHandle(selectBalls, val);
            this.props.ballsClick ? this.props.ballsClick(dict, this.state.currentPlayDate, this.state.TitlesArr, this.state.BallAsrr) : null;
            // 选了号码回来了，要重新设为false。
            this.setState({
              isBallsChange: false,
              clearAllBalls: false,
            })
          }}
        >
        </NSquareBallsView>
      )
    }
    return blockViews;
  }

    // 六合彩自选的视图
    _ballsLhcOptionView(values, balls, viewHeight, numColumn) {
      if (balls.length <= 0) { return [] }
  
      let contentArr = [values.playname];
      let peilvArr = this._getPeilvWithPlayid(values.playid).split('|');
  
      // 拼好balls需要的数据,
      for (let i = 0; i < balls.length; i++) {
        balls[i] = { ball: balls[i] };
        if (peilvArr.length > 1) {
          balls[i].peilv = peilvArr[i];
        } 
      }
      this.state.TitlesArr = contentArr;
      this.state.BallAsrr = balls;
  
      return (
        <NLhcOptionView style={{ width: rightW, height: Adaption.Width(viewHeight) }}
          balls={balls}
          title={values.playname}
          numColumn={numColumn} 
          isBallsChange={this.state.isBallsChange ? true : false} // 是否随机
          clearAllBalls={this.state.clearAllBalls ? true : false} // 是否清空号码
          tpl={values.tpl}
          playid={values.playid}
          ballClick={(selectBalls) => {
            let val = { leftTitles: contentArr, playid: values.playid, tpl: values.tpl };
            let dict = this._ballsHandle(selectBalls, val);
            this.props.ballsClick ? this.props.ballsClick(dict, this.state.currentPlayDate, this.state.TitlesArr, this.state.BallAsrr) : null;
            // 选了号码回来了，要重新设为false。
            this.setState({
              isBallsChange: false,
              clearAllBalls: false,
            })
          }}
        >
        </NLhcOptionView>
      )
    }

  
  // 创建单式的视图 
  _createSingleInputView(values) {

    let playid = values.playid;
    let contentArr = ['号码'], balls = [];
    var defaultBalls = '1 2 3';
    if (this.props.js_tag == '3d' && playid == 2) {
      contentArr = ['百位', '十位', '个位'];
      for (let i = 0; i < 10; i++) {
        balls.push({ key: i, ball: i })
      }

    } else if (this.props.js_tag == 'pk10') {
      if (playid == 3) {
        contentArr = ['冠军', '亚军']; // 前二直选单式
        defaultBalls = '1 2';

      } else if (playid == 5) {
        contentArr = ['冠军', '亚军', '季军']; // 前三直选单式
      }

      for (var i = 1; i <= 10; i++) {
        balls.push({ key: i, ball: i < 10 ? `0${i}` : `${i}` })
      }

    } else if (this.props.js_tag == '11x5') {
      if (playid == 2) {
        contentArr = ['第一位', '第二位', '第三位']; // 前三直选单式

      } else if (playid == 7) {
        contentArr = ['第二位', '第三位', '第四位']; // 中三直选单式

      } else if (playid == 12) {
        contentArr = ['第三位', '第四位', '第五位']; // 后三直选单式

      } else if (playid == 4 || playid == 9 || playid == 14) {
        contentArr = ['号码'];  // 前\中\后三组选单式

      } else if (playid == 17) {
        contentArr = ['第一位', '第二位']; // 前二直选单式
        defaultBalls = '1 2';

      } else if (playid == 22) {
        contentArr = [ '第四位', '第五位']; // 后二直选单式
        defaultBalls = '1 2';

      } else if (playid == 19 || playid == 24) {
         contentArr = ['号码']; // 前\后二组选单式
         defaultBalls = '1 2';

      } else if (playid == 38) {
        // 任选一中一
        defaultBalls = '1';
      } else if (playid == 39) {
        // 任选二中二
        defaultBalls = '1 2';
      } else if (playid == 40) {
        // 任选三中三
        defaultBalls = '1 2 3';
      } else if (playid == 41) {
        // 任选四中四
        defaultBalls = '1 2 3 4';
      } else if (playid == 42) {
        // 任选五中五
        defaultBalls = '1 2 3 4 5';
      } else if (playid == 43) {
        // 任选六中五
        defaultBalls = '1 2 3 4 5 6';
      } else if (playid == 44) {
        // 任选七中五
        defaultBalls = '1 2 3 4 5 6 7';
      }

      for (let i = 1; i <= 11; i++) {
        balls.push({ key: i, ball: i })
      }

    } else if (this.props.js_tag == 'ssc') {
      if (playid == 2) {
        defaultBalls = '1 2 3 4 5';
        contentArr = ['万位', '千位', '百位', '十位', '个位']; // 五星-直选单式
     
      } else if (playid == 4) {
        defaultBalls = '1 2 3 4';
        contentArr = ['千位', '百位', '十位', '个位']; // 后四直选单式

      } else if (playid == 95) {
        defaultBalls = '1 2 3 4';
        contentArr = ['万位', '千位', '百位', '十位']; // 前四直选单式
      
      } else if (playid == 6) {
        defaultBalls = '1 2 3';
        contentArr = ['百位', '十位', '个位']; // 后三直选单式

      } else if (playid == 20) {
        defaultBalls = '1 2 3';
        contentArr = ['万位', '千位', '百位']; // 前三直选单式

      } else if (playid == 102) {
        defaultBalls = '1 2 3';
        contentArr = ['千位', '百位', '十位']; // 中三直选单式

      } else if (playid == 11 || playid == 25 || playid == 107) {
        defaultBalls = '1 1 2';
        contentArr = ['组三']; // 后|前|中三组三单式

      } else if (playid == 13 || playid == 27 || playid == 109) {
        defaultBalls = '1 2 3';
        contentArr = ['组六']; // 后|前|中三组六单式

      } else if (playid == 116) {
        defaultBalls = '1 2';
        contentArr = ['十位', '个位']; // 后二直选单式

      } else if (playid == 34) {
        defaultBalls = '1 2';
        contentArr = ['万位', '千位']; // 前二直选单式

      } else if (playid == 120 || playid == 38) {
        defaultBalls = '1 2';
        contentArr = ['组选']; // 后|前二组选单式
      }

      for (let i = 0; i < 10; i++) {
        balls.push({ key: i, ball: i })
      }
    }

  
    // 购物车机选用到。
    this.state.TitlesArr = contentArr;
    this.state.BallAsrr = balls;

    return(
      <SingleInputView style={{ }}
       playname={values.playname}
       defaultBalls={defaultBalls}
       playTitle={values.play_title}
       js_tag={this.props.js_tag}
       playid={values.playid}
       clearAllBalls={this.state.clearAllBalls ? true : false} // 是否清空号码
       ballClick={(selectBalls) => {
        console.log(selectBalls);

        let val = { leftTitles: [values.playname], playid: values.playid, tpl: values.tpl };
        let dict = this._ballsHandle(selectBalls, val);
        
        this.props.ballsClick ? this.props.ballsClick(dict, this.state.currentPlayDate, this.state.TitlesArr, this.state.BallAsrr) : null;
         // 选了号码回来了，要重新设为false。
        this.setState({
          clearAllBalls: false,
        })
       }}>

      </SingleInputView>
    )
  }

  _sscCreateViews(values) {
    var viewHeight = 210; // 3*70
    var isShowTitlt = false;
    var numColumn = 4;
    var balls = [];
    
    if (values.playid == 128) {
      // 双面盘
      viewHeight = 110;
      balls = ['大', '小', '单', '双'];

    } else if (values.playid == 129) {
      // 龙虎斗
      viewHeight = 110;
      numColumn = 3;
      balls = ['龙', '虎', '和'];

    } else if (values.playid == 131) {
      // 牛牛
      viewHeight = 4 * 100;
      balls = ['牛一', '牛二', '牛三', '牛四', '牛五', '牛六', '牛七', '牛八', '牛九', '牛牛', '无牛', '有牛', '牛大', '牛小', '牛单', '牛双' ];

    } else if (values.tpl == 0) {
      for (var i = 0; i < 10; i++) {
        balls.push({ key: i, ball: i })
      }

    } else if (values.tpl == 1 || values.tpl == 8) {
      // 单式
      return this._createSingleInputView(values);

    } else if (values.tpl == 2) {
      // 前\中\后三 直选和值 0〜27
      viewHeight = 7 * 65;
      for (var i = 0; i <= 27; i++) {
        balls.push({ key: i, ball: i })
      }

    } else if (values.tpl == 3) {
      // 任三-组选和值 1〜26
      viewHeight = 7 * 65;
      for (var i = 1; i <= 26; i++) {
        balls.push({key:i, ball:i})
      }

    } else if (values.tpl == 4) {
      // 组选包胆
      for (var i = 0; i < 10; i++) {
        balls.push({ key: i, ball: i })
      }

    } else if (values.tpl == 5) {
      // 大小单双
      viewHeight = 100;
      let baArr = ['大', '小', '单', '双'];
      for (var i = 0; i < baArr.length; i++) {
        balls.push({ key: i, ball: baArr[i] })
      }

    } else if (values.tpl == 6) {
      viewHeight = 100;
      numColumn = 3;
      balls = ['豹子', '顺子', '对子'];

    } else if (values.tpl == 7) {
      // 前、后二组选和值
      viewHeight = 5 * 65;
      for (var i = 1; i <= 17; i++) {
        balls.push({ key: i, ball: i })
      }

    } else if (values.tpl == 9 || values.tpl == 10) {
      // 前、后二直选和值  // 任二 直选和值
      viewHeight = 5 * 65;
      for (var i = 0; i <= 18; i++) {
        balls.push({ key: i, ball: i })
      }

    }

    return this._balls09PeilvCreateView(values, balls, isShowTitlt, viewHeight, numColumn);
  }


  _k3CreateViews(values) {
    var viewHeight = 170;
    var isShowTitlt = false;
    var numColumn = 4;
    var balls = [];
    
    if (values.playid == '14') {
      // 双面盘  
      viewHeight = 110;
      balls = ['大', '小', '单', '双'];

    } else if (values.playid == 15) {
      // 新三同号
      balls = ['三同号通选', '111', '222', '333', '444', '555', '666'];

    } else if (values.tpl == 0) {
      // 和值
      viewHeight = 480; // 5*96
      balls = ['大', '小', '单', '双'];
      for (var i = 0; i <= 15; i++) {
        balls.push(`${i + 3}`);
      }

    } else if (values.tpl == 3) {
      // 二\三不同号-胆拖
      balls = ['1', '2', '3', '4', '5', '6'];

    } else if (values.tpl == 5) {
      // 二同号 复选
      balls = ['11', '22', '33', '44', '55', '66'];
    } 

    return this._ballsSquareCreateView(values, balls, isShowTitlt, viewHeight, numColumn);
  }

  _11x5CreateViews(values) {
    var viewHeight = 210; // 3*70
    var balls = [];
    var numColumn = 4;

    if (values.playid == 54) {
      // 龙虎斗
      viewHeight = 90;
      numColumn = 2;
      balls = ['龙', '虎'];
    
    } else if (values.playid == 56) {
      // 双面盘
      viewHeight = 110;
      balls = ['大', '小', '单', '双'];

    } else if (values.playid == 57) {
      // 牛牛
      viewHeight = 4 * 100;
      balls = ['牛一', '牛二', '牛三', '牛四', '牛五', '牛六', '牛七', '牛八', '牛九', '牛牛', '无牛', '有牛', '牛大', '牛小', '牛单', '牛双' ];
      
    } else if (values.tpl == 0) {
      for (var i = 1; i <= 11; i++) {
        balls.push({ key: i, ball: `${i}` })
      }

    } else if (values.tpl == 1) {
      // 单式
      return this._createSingleInputView(values);

    } else if (values.tpl == 3) {
      // 胆拖
      for (var i = 1; i <= 11; i++) {
        balls.push({ key: i, ball: `${i}` })
      }
    } 

    return this._balls09PeilvCreateView(values, balls, values.playid == 32 ? true : false, viewHeight, numColumn);
  }

  _pcddCreateViews(values) {
    var viewHeight = 200;
    var isShowTitlt = false;
    var balls = [];

    if (values.tpl == 0) {
      // 特码 有赔率
      viewHeight = 630; // 7*90
      for (let i = 0; i <= 27; i++) {
        balls.push(`${i}`);
      }

    } else if (values.tpl == 1) {
      // 特码包三 无赔率
      viewHeight = 455; //7*65
      for (let i = 0; i <= 27; i++) {
        balls.push({ key: i, ball: `${i}` })
      }

    } else if (values.tpl == 2) {
      // 混合 有赔率
      viewHeight = 400;
      balls = ['大', '小', '单', '双', '大单', '小单', '大双', '小双', '极大', '极小', '红波', '绿波', '蓝波', '豹子'];
    }
    return this._balls09PeilvCreateView(values, balls, isShowTitlt, viewHeight);
  }


  _3dCreateViews(values) {
    var viewHeight = 3 * 70;
    var balls = [];
    var numColumn = 4;

    if (values.playid == 26) {
      // 双面盘
      viewHeight = 110;
      balls = ['大', '小', '单', '双']; 

    } else if (values.playid == 27) {
      // 龙虎斗
      viewHeight = 110;
      numColumn = 3;
      balls = ['龙', '虎', '和'];

    } else if (values.playid == 2) {
      // 三星-直选单式
      return this._createSingleInputView(values);

    } else if (values.tpl == 0) {
      // 不显示赔率
      for (var i = 0; i < 10; i++) {
        balls.push({ key: i, ball: i })
      }

    } else if (values.playid == 3) {
      // 三星直选和值  
      viewHeight = 7 * 90;
      for (let i = 0; i <= 27; i++) {
        balls.push(`${i}`);
      }

    } else if (values.playid == 6) {
      // 三星组三和值
      viewHeight = 7 * 90;
      for (let i = 1; i <= 26; i++) {
        balls.push(`${i}`);
      }

    } else if (values.playid == 7) {
      // 三星组六和值
      viewHeight = 6 * 90;
      for (let i = 3; i <= 24; i++) {
        balls.push(`${i}`);
      }
    }
    return this._balls09PeilvCreateView(values, balls, false, viewHeight, numColumn);
  }


  _pk10CreateViews(values) {
    var viewHeight = 3 * 70;
    var isShowTitlt = true;
    var balls = [];

    if (values.playid == '14') {
      // 双面盘
      viewHeight = 110;
      balls = ['大', '小', '单', '双']; 

    } else if (values.playid == 3 || values.playid == 5) {
      // 前二\三单式
      return this._createSingleInputView(values);

    } else if (values.tpl == 0) {
      // 不显示赔率
      for (var i = 1; i <= 10; i++) {
        balls.push({ key: i, ball: i < 10 ? `0${i}` : `${i}` })
      }

    } else if (values.playid == 7) {
       // 冠亚和. 有赔率显示
       isShowTitlt = false;
       viewHeight = 6 * 90;
       balls = ['大', '小', '单', '双', '中', '和'];
      for (let i = 3; i <= 19; i++) {
        balls.push(`${i}`);
      }
    }
    return this._balls09PeilvCreateView(values, balls, isShowTitlt, viewHeight);
  }

  _qxcCreateViews(values) {
    let playid = values.playid;
    var viewHeight = 90;
    var isShowTitlt = false;
    var numColumn = 4;
    var balls = [];
    var contents = [];
    

    if (playid == 7) {
      // 和值组选
      balls = ['大', '小', '单', '双'];
      contents = ['总和值', '组合'];
      viewHeight = 110;

    } else if (playid == 8) {
      // 定位
      balls = ['大', '小', '单', '双'];
      contents = ['千位', '百位', '十位', '个位'];

    } else if (playid == 9) {
      // 前二
      balls = ['大', '小', '单', '双'];
      contents = ['千位', '百位'];

    } else if (playid == 10) {
      // 前三
      balls = ['大', '小', '单', '双'];
      contents = ['千位', '百位', '十位'];
      
    } else if (playid == 11) {
      // 后二
      balls = ['大', '小', '单', '双'];
      contents = ['十位', '个位'];
      
    } else if (playid == 12) {
      // 后三
      balls = ['大', '小', '单', '双'];
      contents = ['百位', '十位', '个位'];
    }
    return this._balls09PeilvCreateView(values, balls, isShowTitlt, viewHeight, numColumn, contents);
  }

  _lhcCreateViews(values) {
    var isShowTitlt = false;
    var balls = [];

    if (values.tpl == 0) {
      // 特码A B 
      for (var i = 1; i <= 49; i++) {
        balls.push(i < 10 ? `0${i}` : `${i}`);
      }
      return this._balls09PeilvCreateView(values, balls, isShowTitlt, 13 * 90);

    } else if (values.tpl == 1) {
      // 特码两面
      balls = ['特大', '特双', '特小单', '特地肖', '特小', '特大单', '特小双', '特前肖', '特大尾', '特大双', '特合单', '特后肖', '特小尾', '特合大', '特合双', '特家肖', '特单', '特合小', '特天肖', '特野肖'];
      return this._ballsSquareCreateView(values, balls, isShowTitlt, 630, 3);

    } else if (values.tpl == 2) {
      // 特码色波
      let name = ['红波', '蓝波', '绿波'];
      let ballsNumDec = ['01 02 07 08 12 13 18 19 23 24 29 30 34 35 40 45 46', '03 04 09 10 14 15 20 25 26 31 36 37 41 42 47 48', ' 05 06 11 16 17 21 22 27 28 32 33 38 39 43 44 49'];
      for (let i = 0; i < name.length; i++) {
        balls.push({ ball: name[i], ballNumDec: ballsNumDec[i] });
      }
      return this._ballsSquareCreateView(values, balls, isShowTitlt, 500, 1, 110);

    } else if (values.tpl == 3) {
      // 特半波
      balls = ['红大', '红小', '红单', '红双', '蓝大', '蓝小', '蓝单', '蓝双', '绿大', '绿小', '绿单', '绿双'];
      return this._ballsSquareCreateView(values, balls, isShowTitlt, 360, 3);

    } else if (values.tpl == 4) {
      // 特半半波
      balls = ['红大单', '红小单', '红大双', '红小双', '蓝大单', '蓝小单', '蓝大双', '蓝小双', '绿大单', '绿小单', '绿大双', '绿小双'];
      return this._ballsSquareCreateView(values, balls, isShowTitlt, 360, 3);

    } else if (values.tpl == 5) {
      // 特码尾数
      balls = ['0头', '1头', '2头', '3头', '4头', '1尾', '2尾', '3尾', '4尾', '5尾', '6尾', '7尾', '8尾', '9尾', '0尾'];
      return this._ballsSquareCreateView(values, balls, isShowTitlt, 450, 3);

    } else if (values.tpl == 6 || values.tpl == 7 || values.tpl == 14) {
      // 特肖、平特一肖 || 合肖 || 二三四五连肖
      var default_shengxiao = GetBallStatus.getLhcShengxiaoBalls(values.tpl == 7 ? true : false);
      for (let b in default_shengxiao) {
        balls.push({ ball: default_shengxiao[b].name, ballNumDec: default_shengxiao[b].balls.join(' ') });
      }
      return this._ballsSquareCreateView(values, balls, isShowTitlt, values.tpl == 7 ? 600 : 700, 2);

    } else if (values.tpl == 8) {
      // 五行
      let name = ['金', '木', '水', '火', '土'];
      let ballsNumDec = ['04 05 18 19 26  27 34 35 48 49', '01 08 09 16 17 30 31 38 39 46 47', '06 07 14 15 22  23 36 37 44 45', '02 03 10 11 24  25 32 33 40 41', ' 12  13  20  21  28  29  42  43'];
      for (let i = 0; i < name.length; i++) {
        balls.push({ ball: name[i], ballNumDec: ballsNumDec[i] });
      }
      return this._ballsSquareCreateView(values, balls, isShowTitlt, 450, 2, 90);

    } else if (values.tpl == 9 || values.tpl == 15) {
      // 平特尾数 || 2345连尾
      let name = ['0尾', '1尾', '2尾', '3尾', '4尾', '5尾', '6尾', '7尾', '8尾', '9尾'];
      let ballsNumDec = ['10 20 30 40', '01 11 21 31 41', '02 12 22 32 42', '03 13 23 33 43', '04 14 24 34 44', '05 15 25 35 45', '06 16 26 36 46', '07 17 27 37 47', '08 18 28 38 48', '09 19 29 39 49'];
      for (let i = 0; i < name.length; i++) {
        balls.push({ ball: name[i], ballNumDec: ballsNumDec[i] });
      }
      return this._ballsSquareCreateView(values, balls, isShowTitlt, 600, 2);

    } else if (values.tpl == 10) {
      // 七色波
      balls = ['红波', '蓝波', '绿波', '和局'];
      return this._ballsSquareCreateView(values, balls, isShowTitlt, 220, 3);
    } else if (values.tpl == 11) {
      // 总肖
      balls = ['2肖', '3肖', '4肖', '5肖', '6肖', '7肖', '总肖单', '总肖双'];
      return this._ballsSquareCreateView(values, balls, isShowTitlt, 300, 3);

    } else if (values.tpl == 12 || values.tpl == 13) {
      // 自选不中  // 连码  不显示赔率
      for (let i = 1; i <= 49; i++) {
        balls.push({ key: i, ball: i < 10 ? `0${i}` : `${i}` })
      }
      return this._balls09PeilvCreateView(values, balls, isShowTitlt, 13 * 60);
    }
  }

  
  // 六合彩自选下注的视图
  _lhcOptionViews(values) {
    var balls = [];
    let viewHeight = 0, numColumn = 3;

    if (values.tpl == 0) {
      // 特码A B 
      numColumn = 4;
      for (var i = 1; i <= 49; i++) {
        balls.push(i < 10 ? `0${i}` : `${i}`);
      }

    } else if (values.tpl == 1) {
      // 特码两面
      balls = ['特大', '特双', '特小单', '特地肖', '特小', '特大单', '特小双', '特前肖', '特大尾', '特大双', '特合单', '特后肖', '特小尾', '特合大', '特合双', '特家肖', '特单', '特合小', '特天肖', '特野肖'];
      viewHeight = Math.ceil(balls.length / numColumn) * 90;

    } else if (values.tpl == 2) {
      // 特码色波
      numColumn = 2;
      balls = ['红波', '蓝波', '绿波'];

    } else if (values.tpl == 3) {
      // 特半波
      balls = ['红大', '红小', '红单', '红双', '蓝大', '蓝小', '蓝单', '蓝双', '绿大', '绿小', '绿单', '绿双'];

    } else if (values.tpl == 4) {
      // 特半半波
      balls = ['红大单', '红小单', '红大双', '红小双', '蓝大单', '蓝小单', '蓝大双', '蓝小双', '绿大单', '绿小单', '绿大双', '绿小双'];
      viewHeight = Math.ceil(balls.length / numColumn) * 90;

    } else if (values.tpl == 5) {
      // 特码尾数
      balls = ['0头', '1头', '2头', '3头', '4头', '1尾', '2尾', '3尾', '4尾', '5尾', '6尾', '7尾', '8尾', '9尾', '0尾'];

    } else if (values.tpl == 6) {
      // 特肖、平特一肖
      numColumn = 2;
      balls = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

    } else if (values.tpl == 8) {
      // 五行
      numColumn = 2;
      balls = ['金', '木', '水', '火', '土'];
      
    } else if (values.tpl == 9) {
      // 平特尾数 
      numColumn = 2;
      balls = ['0尾', '1尾', '2尾', '3尾', '4尾', '5尾', '6尾', '7尾', '8尾', '9尾'];

    } else if (values.tpl == 10) {
      // 七色波
      numColumn = 2;
      balls = ['红波', '蓝波', '绿波', '和局'];

    } else if (values.tpl == 11) {
      // 总肖
      numColumn = 2;
      balls = ['2肖', '3肖', '4肖', '5肖', '6肖', '7肖', '总肖单', '总肖双'];

    } else if (values.tpl == 7 || values.tpl == 14) {
      // 合肖 || 二三四五连肖
      var default_shengxiao = GetBallStatus.getLhcShengxiaoBalls(values.tpl == 7 ? true : false);
      for (let b in default_shengxiao) {
        balls.push({ ball: default_shengxiao[b].name, ballNumDec: default_shengxiao[b].balls.join(' ') });
      }
      return this._ballsSquareCreateView(values, balls, false, 600, 2);

    } else if (values.tpl == 15) {
      // 2345连尾
      let name = ['0尾', '1尾', '2尾', '3尾', '4尾', '5尾', '6尾', '7尾', '8尾', '9尾'];
      let ballsNumDec = ['10 20 30 40', '01 11 21 31 41', '02 12 22 32 42', '03 13 23 33 43', '04 14 24 34 44', '05 15 25 35 45', '06 16 26 36 46', '07 17 27 37 47', '08 18 28 38 48', '09 19 29 39 49'];
      for (let i = 0; i < name.length; i++) {
        balls.push({ ball: name[i], ballNumDec: ballsNumDec[i] });
      }
      return this._ballsSquareCreateView(values, balls, false, 500, 2);

    } else if (values.tpl == 12 || values.tpl == 13) {
      // 自选不中 / 连码 
      for (let i = 1; i <= 49; i++) {
        balls.push({ key: i, ball: i < 10 ? `0${i}` : `${i}` })
      }
      return this._balls09PeilvCreateView(values, balls, false, 13 * 60);

    }

    viewHeight = viewHeight > 0 ? viewHeight : Math.ceil(balls.length / numColumn) * 70;
    return this._ballsLhcOptionView(values, balls, viewHeight, numColumn);
  }

  // 左边View的item
  _renderItemView(item) {
    
    let itemTextFontSize = 0;
    if (item.item.title.length >= 7) {
      itemTextFontSize = 13;
    } else if (item.item.title.length >= 6 && !item.item.title.includes('-')) {
      itemTextFontSize = 15;
    } else if (item.item.title.length >= 5) {
      itemTextFontSize = 16;
    } else {
      itemTextFontSize = 18;
    }

    return (
      <TouchableOpacity activeOpacity={1}
        onPress={() => {
          if (oneIdx_left != item.index) {
              // 选择不相等时 重置 选择下标。
            oneIdx_left = item.index; towIdx = 0; threeIdx = 0;

            if (this.props.wanfaindex == 1 && this.props.wafaDataArr.length == 1) {
              // 回调当前选择的玩法数据 
              let list = this.props.wafaDataArr[0].submenu[0].playlist;
              this.props.ballsClick ? this.props.ballsClick({}, list[item.index]) : null;

              this.setState({
                ballsData: {}, // 清空选择号码
                currentPlayDate: list[item.index],
              })

            } else {
              // 回调当前选择的玩法数据 
              let submenus = this.props.wafaDataArr[item.index].submenu;
              this.props.ballsClick ? this.props.ballsClick({}, submenus[0].playlist[0]) : null;

              this._InterfaceIsShowPeilvViewToPlayData(submenus[0].playlist[0]);
              this.setState({
                ballsData: {}, // 清空选择号码
                rxData:[], // 任选清空
                currentSubmenuData: submenus,
                currentPlayDate: submenus[0].playlist[0],
              });
            }
          }
        }}>
        <ImageBackground
          resizeMode={'contain'}
          source={oneIdx_left == item.index ? require('../img/ic_selectClick.png') : require('../img/ic_defaultClick.png')}
          style={{ width: leftW - Adaption.Width(10), height: Adaption.Width(this.state.leftTitleData.length > 7 ? 50 : 55), marginLeft: 5, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text allowFontScaling={false} style={{ backgroundColor: 'rgba(0,0,0,0)', color: oneIdx_left == item.index ? '#e33939' : '#707070', marginLeft: 0, fontSize: Adaption.Font(itemTextFontSize) }}>
            {item.item.title}
          </Text>
        </ImageBackground>
      </TouchableOpacity>
    )
  }

  // 根据playid 取到赔率
  _getPeilvWithPlayid(playid) {
    let plDataArr = this.props.peilvDataArr;
    var peilvStr = '';
    for (let a = 0; a < plDataArr.length; a++) {
      if (playid == plDataArr[a].playid) {
        peilvStr = plDataArr[a].peilv;
        break;
      }
    }
    return peilvStr;
  }

  render() {
    if (this.props.wafaDataArr.length <= 0) { return null };

    let playid = this.state.currentPlayDate ? this.state.currentPlayDate.playid : '';
    let peilvStr = this._getPeilvWithPlayid(playid);
    let peilvArr = peilvStr.split('|'); // 根据赔率的个数来判断，是否在上面统一显示赔率。除lhc的个别外

    if (this.props.js_tag == 'lhc') {

      if (playid == '8' || playid == '21') {
        // 特肖-合肖 || 自选不中
        let baseidx = playid == '8' ? 2 : 6;  // 合肖2个号，自选不中要6个号
        let tit = Object.keys(this.state.ballsData)[0];
        if (tit == null) {
          peilvArr = ['0'];
        } else {
          let ballsLength = this.state.ballsData[tit].length;
          if (ballsLength >= baseidx && ballsLength <= 11) {
            peilvArr = [peilvArr[ballsLength - baseidx]];
          } else {
            peilvArr = ['0'];
          }
        }
      
      } else if (playid == '30' || playid == '33') {
        // 三中二/三 || 二中特
        if (this.props.wanfaindex != 0) {
          peilvArr = [peilvStr];
        } else {
          peilvArr = playid == '30' ? [`${GetBallStatus.peilvHandle(peilvArr[0])}(中二)/${GetBallStatus.peilvHandle(peilvArr[1])}(中三)`] : [`${GetBallStatus.peilvHandle(peilvArr[0])}(中特)/${GetBallStatus.peilvHandle(peilvArr[1])}(中二)`];
        }
      }
    }

    if (this.props.js_tag == 'ssc') {
      if (playid == '130' || playid == '89' || playid == '96' || playid == '7' || playid == '21' || playid == '103' || playid == '82') {
        // 趣味、四星组合 、三星组合、五星组合
        peilvArr = [peilvStr];
    
      } else if (playid == '16' || playid == '30' || playid == '112' || playid == '71') {
        // 三星组选包胆 || 71任三组选和值
        peilvArr = [peilvStr];
      }
    }

    return (

      <View style={[this.props.style, { flexDirection: 'row', flex: 1 }]}>

        <View style={{ backgroundColor: '#f3f3f3', width: leftW }}>

          {/* 临时的机选按钮 */}
          <TouchableOpacity activeOpacity={0.7} style={{ width: leftW, height: Adaption.Width(10) }}
            onPress={() => {this.setState({ isBallsChange: true})}}> 
          </TouchableOpacity>

          <FlatList style={{flex: SCREEN_WIDTH < 350 ? 0.78 : 0.82}}
            automaticallyAdjustContentInsets={false}
            alwaysBounceHorizontal={false}
            data={this.state.leftTitleData}
            renderItem={(item) => this._renderItemView(item)}
            horizontal={false}
            numColumns={1}
          >
          </FlatList>

          <View style={{flex: SCREEN_WIDTH < 350 ? 0.22 : 0.18, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity activeOpacity={0.7}
              style={{ width: Adaption.Width(57), height: Adaption.Width(57), backgroundColor:'#fff', borderWidth: 1.0, borderColor: '#d3d3d3', borderRadius: Adaption.Width(57*0.5), justifyContent: 'center', alignItems: 'center' }}
              onPress={() => {
                // 购物车回调
                this.props.shopCarClick ? this.props.shopCarClick(this.state.currentPlayDate, this.state.TitlesArr, this.state.BallAsrr) : null;
              }}>
              <Image style={{ width: Adaption.Width(33), height: Adaption.Width(33) }} source={require('../../../img/ic_shopCar.png')}></Image>
              
              {this.props.shopCarZhushuNum == 0 ? null :
                <View style={{
                  backgroundColor: '#e33939', width: Adaption.Width(26), height: Adaption.Width(26), borderRadius: Adaption.Width(13),
                  justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: leftW * 0.26
                }}>
                  <Text allowFontScaling={false} style={{ fontSize: this.props.shopCarZhushuNum > 99 ? Adaption.Font(12) : Adaption.Font(15), color: '#fff', backgroundColor: 'rgba(0,0,0,0)' }}>{this.props.shopCarZhushuNum > 99 ? '99+' : this.props.shopCarZhushuNum}</Text>
                </View>
              }
            </TouchableOpacity>
          </View>

        </View>
        <View style={{ backgroundColor: '#fff', width: rightW}}>
          {this.state.isShowSelectPlay ?
            <View style={{ height: Adaption.Height(peilvArr.length == 1 ? 80 : 60), justifyContent: 'center', alignItems: 'center', marginTop: Adaption.Height(peilvArr.length == 1 ? 10 : 0) }}>
              <TouchableOpacity activeOpacity={0.8}
                style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderColor: '#d3d3d3', borderWidth: 1, borderRadius: 5, width: Adaption.Width(240), height: Adaption.Height(40) }}
                onPress={() => {
                  // 玩法菜单个数大于1才显示。
                  if (!(this.state.currentSubmenuData.length == 1 && this.state.currentSubmenuData[0].playlist.length <= 1)) {
                    this.setState({
                    isShowPlaySelectView: true,
                  })
                  }
                }}>
                <View style={{ flex: 0.12 }}></View>
                <View style={{ alignItems: 'center', flex: 0.76 }}>
                  <Text allowFontScaling={false} style={{ color: '#434343', fontSize: Adaption.Font(18) }}>{this.state.currentPlayDate ? this.state.currentPlayDate.playname : ''}</Text>
                </View>
                <View style={{ flex: 0.12 }}>
                  {!(this.state.currentSubmenuData.length == 1 && this.state.currentSubmenuData[0].playlist.length <= 1) 
                    ? <Image resizeMode={'contain'} style={{ width: 15, height: 15 }} source={require("../img/ic_daosanjiao.png")} /> 
                    : null
                  }
                </View>
              </TouchableOpacity>
              {peilvArr.length == 1 && this.props.peilvDataArr.length > 0 && !(this.props.js_tag == 'lhc' && this.props.wanfaindex == 1) ?
                <Text allowFontScaling={false} style={{ marginTop: 5, color: '#707070', fontSize: Adaption.Font(16) }}>(赔率：{GetBallStatus.peilvHandle(peilvArr[0])})</Text>
                : null
              }
            </View>
            : null
          }

          {peilvArr.length == 1 && this.state.isShowSelectPlay == false && this.props.peilvDataArr.length > 0 && !(this.props.js_tag == 'lhc' && this.props.wanfaindex == 1) ?
            <View style={{ height: 40, alignItems: 'flex-end', justifyContent: 'center', marginRight:Adaption.Width(20) }}>
              <Text allowFontScaling={false} style={{ color: '#707070', fontSize: Adaption.Font(16) }}>(赔率：{GetBallStatus.peilvHandle(peilvArr[0])})</Text>
            </View>
            : null
          }
          
          {peilvArr.length == 1 && this.props.js_tag == 'lhc' && this.props.wanfaindex == 1 ?
            <View style={{ height: Adaption.Width(this.state.isShowSelectPlay == false ? 60 : 40), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(17), color: '#494949', marginRight: Adaption.Width(7) }}>总金额</Text>
              <TextInput ref='PriceInput' allowFontScaling={false} keyboardType={'numeric'} maxLength={6} 
                style={{ textAlign: 'center', width: Adaption.Width(80), height: Adaption.Width(30), borderRadius: 3, borderColor: '#ccc', borderWidth: 1, fontSize: Adaption.Font(18) }}
                onBlur={(e) => {
                  let price = e.nativeEvent.text ? e.nativeEvent.text : '0';
                  // ballsData有值再写入price，再回调
                  if (Object.keys(this.state.ballsData).length > 0) {
                    this.state.ballsData['LhcPrice'] = price;
                    this.props.ballsClick ? this.props.ballsClick(this.state.ballsData, this.state.currentPlayDate, this.state.TitlesArr, this.state.BallAsrr) : null;
                  }
                }}>
              </TextInput>
              <Text allowFontScaling={false} style={{ marginLeft: Adaption.Width(7), fontSize: Adaption.Font(17), color: '#494949' }}>赔率: <Text allowFontScaling={false} style={{ color: '#f00' }}>{GetBallStatus.peilvHandle(peilvArr[0])}</Text></Text>
            </View>
            :null
          }

          <ScrollView style={{ height: this.props.style.height }}
            key={this.state.currentPlayDate ? this.state.currentPlayDate.playid : ''}
            automaticallyAdjustContentInsets={false}
            alwaysBounceHorizontal={false}
            showsVerticalScrollIndicator={true} // 显示滚动条
            contentContainerStyle={{ paddingBottom: 25 }}
          >
            {this.state.currentPlayDate ? this._createBallsBlockView(this.state.currentPlayDate) : null}
          </ScrollView>

        </View>
        {this.state.currentPlayDate ?
          <NewGameDateSelctView
            isClose={this.state.isShowPlaySelectView}
            values={this.state.currentSubmenuData}
            title={this.state.leftTitleData[oneIdx_left] != null ? this.state.leftTitleData[oneIdx_left].title : ''}
            towIndex={towIdx}
            threeIndex={threeIdx}
            close={() => {
              this.setState({
                isShowPlaySelectView: false,
              })
            }}
            playClick={(playData, towIndex, threeIndex) => {
              // 切换玩法数据 回调到这里。
              towIdx = towIndex; threeIdx = threeIndex;

              // 回调空数据
              this.props.ballsClick ? this.props.ballsClick({}, playData) : null;

              this._InterfaceIsShowPeilvViewToPlayData(playData);

              this.setState({
                ballsData: {}, // 清空选择号码
                rxData:[], // 任选清空
                isShowPlaySelectView: !this.state.isShowPlaySelectView,
                currentPlayDate: playData,
              })
            }}>
          </NewGameDateSelctView>
        : null}
      </View>
    );
  }


  // 根据选的玩法，判断界面上的赔率、玩法点击按钮 是否要显示。
  _InterfaceIsShowPeilvViewToPlayData(playData, isChangeWanfa) {

    if (this.props.js_tag.length <= 0) {
      return; // js_tag值还没回来时，下面判断会延迟。
    }

    var showSelectPlay = this.props.js_tag == 'lhc' ? true : this.props.wanfaindex == 1 ? false : true; // 默认都显示,双面玩法不显示。 SSC\11x5\3D\PK10

    if (this.props.js_tag == 'k3') {
      showSelectPlay = false;

    } else if (this.props.js_tag == 'pcdd') {
      showSelectPlay = false;

    } else if (this.props.js_tag == 'lhc' && playData.tpl == 12) {
      // 自选不中
      showSelectPlay = false;
    }

    if (isChangeWanfa) {
      return showSelectPlay;
    } else {
      this.setState({
        isShowSelectPlay: showSelectPlay, // 是否显示 选择玩法的那个按钮。
      })
    }
  }

}
