/**
 Author Money
 Created by on 2017/10/10
 dec 传入参数，返回投注所需要的参数。
 */

 // ====== 算法的类 ======
 import SSCCaculMethod from './caculator/SscCaluator'; //时时彩计算注数方法
 import C11x5CaculMethod from './caculator/C11x5caculator'; //11x5计算注数方法
 import K3CaculMethod from './caculator/K3Caculator';    //K3计算注数的方法
 import PK10CaculMethod from './caculator/PK10Caculator'; //pk10计算注数的方法
 import FC3DCaculMethod from './caculator/FC3DCaculator';  //福彩3D计算注数的方法
 import PCDDCaculMethod from './caculator/PCDDCaculator';  //PCDD计算注数的方法
 import LHCCaculMethod from './caculator/LHCCaculator';  //六合彩计算注数的方法
 import QXCCalculation from './caculator/QXCCalculation';  // 七星彩注数
 import XyncCalculation from './caculator/XyncCalculation'; // 幸运农场注数
 import XypkCalculation from './caculator/XypkCalculation'; // 幸运扑克注数
 import XytzCaculation from './caculator/XytzCaculation';  //经典梯子
 import PkniuniuCaculation from './caculator/PkNiuniuCaculation';  //pk牛牛
 import GetBallStatus from './touzhu2.0/newBuyTool/GetBallStatus'; // 用于拿六合彩生肖对应的号码

export default {

  //（非六合彩的号码拼接）
  getTuoZhuParam(params) {
    return handleTouZhuBalls(params);
  },

  // 六合彩投注号码拼接
  getLHCTuoZhuParam(params) {
    return handleLHCTouZhuBalls(params);
  },

  // 计算返回注数
  zhuShuReturnMethod(parameter) {
    return calcAllPlayGame(parameter);
  },

  // 添加号码前缀的
  addBallQZ(titles, selectTitles, selectBallsNum) {
    return addBallsQZ(titles, selectTitles, selectBallsNum);
  },

  // 六合彩的 所选的号码 几个为一注。
  lhcZhuShu_lianxuan_lianmas(ballArr, playid) {
    return lhcZhu_lianxuan_lianma(ballArr, playid);
  },
}


// 根据playid 取到赔率
function getPeilvWithPlayid(playid, plDataArr) {
  var peilvStr = '';
  for (let a = 0; a < plDataArr.length; a++) {
    if (playid == plDataArr[a].playid) {
      peilvStr = plDataArr[a].peilv;
      break;
    }
  }
  return peilvStr;
}

// 通过生肖去获取对应的号码
function getLhcStatusBalls(sxStr, isHeXiao) {

  let ballStr = '';
  let shengxiao = GetBallStatus.getLhcShengxiaoBalls(isHeXiao);

  for (let b in shengxiao) {
    if (shengxiao[b].name == sxStr) {
      ballStr = shengxiao[b].balls.join(',');
      break;
    }
  }
  return ballStr;
}

// 获取*连尾 and 五行 对应的号码，
function getLhcLianWeiBalls(tit) {

  let ballStr = '';
  if (tit.includes('尾')) {
    let baArray = [];
    let weiInt = parseInt(tit.substr(0, 1));
    if (weiInt == 0) {
      weiInt = 10;
    }
    for (let i = weiInt; i < 50; i += 10) {
      baArray.push(i < 10 ? `0${i}` : `${i}`);
    }
    ballStr = baArray.join(',');

  } else if (tit == '金') {
    ballStr = '04,05,18,19,26,27,34,35,48,49';
  } else if (tit == '木') {
    ballStr = '01,08,09,16,17,30,31,38,39,46,47';
  } else if (tit == '水') {
    ballStr = '06,07,14,15,22,23,36,37,44,45';
  } else if (tit == '火') {
    ballStr = '02,03,10,11,24,25,32,33,40,41';
  } else if (tit == '土') {
    ballStr = '12,13,20,21,28,29,42,43';
  }
  return ballStr;
}

// 六合彩投注号码拼接
function handleLHCTouZhuBalls(params) {

  let shopCarModelArr = [];

  let ballsData = params.ballsData;
  let playData = params.playData;
  let playid = playData.playid;
  let js_tag = params.js_tag;

  let title = params.titles[0];
  let ballArr = ballsData[title];
  let peilvArr = ballsData.赔率 ? ballsData.赔率 : 0;

  //号码和详情是拼接成一起的，不是分开的
  if (playData.tpl == '7' || playData.tpl == '12'){
    // 合肖 || 自选不中
     let peilvStr = ballsData.赔率;
     let ballsXiangQing = playData.tpl == '12' ? ballArr.join(' ') : ballArr.join(' ');
     let ballNums = ballArr.join('+');;

     if (ballsData[`${title}^^01`] != null) {
       ballNums = ballsData[`${title}^^01`].join('+');
     }

     if (playData.tpl == '12' && playid == '21') {
       // 自选不中
      let maNum = '';
      switch (ballArr.length) {
        case 6: maNum = '六不中'; break;
        case 7: maNum = '七不中'; break;
        case 8: maNum = '八不中'; break;
        case 9: maNum = '九不中'; break;
        case 10: maNum = '十不中'; break;
        case 11: maNum = '十一不中'; break;
        default:
          break;
      }
       ballsXiangQing = `${maNum}:(${ballsXiangQing})`
     }

     let lhcBallsXiangqing = '';
     if (playData.tpl == '7') {
        // 合肖。和号码拼接在一起。
        for (let m = 0; m < ballArr.length; m++) {
          let shengxiaoStr = ballArr[m];
          let shengxiaoBalls = getLhcStatusBalls(shengxiaoStr, true);
          lhcBallsXiangqing += `${shengxiaoStr}(${shengxiaoBalls}) `;
        }
      }

      let price = params.singlePrice;
      if (ballsData['LhcPrice']) {
        price = parseFloat(ballsData['LhcPrice']) / params.zhushu;  // 输入的总金额 除 注数
      }

     let shopCarModel = {
         singlePrice: price,  //单价
         totalPrice: price,   //总价
         zhushu: params.zhushu,       //注数
         balls: ballNums,  // 号码拼接的字符串： '09 01 01'
         wanfa: playData.wanfa,  // 玩法
         peilv: peilvStr,  // 赔率
         gameid: params.gameid,
         playid: playData.playid,  // playid
         xiangqing: ballsXiangQing,  // 详情
         lhcBallsXiangqing: lhcBallsXiangqing,  // 六合彩 生肖有号码的详情。
         qishu: params.qishu,   // 期数
         tag: params.tag,   //彩种种类
     };

     shopCarModelArr.push({value:shopCarModel});

  } else if (playData.tpl == '13' || playData.tpl == '14' || playData.tpl == '15') {
    // 连码 连肖 连尾
    let newBallsArr = lhcZhu_lianxuan_lianma(ballArr, playData.playid);
    let newBallsZW = [];
    if (ballsData[`${title}^^01`] != null) {
      newBallsZW = newBallsArr;
      newBallsArr = lhcZhu_lianxuan_lianma(ballsData[`${title}^^01`], playData.playid);
    }

    let sltPeilvAr = []; // 选择的号码对应的赔率
    if ((playData.tpl == '14' || playData.tpl == '15') && typeof(ballsData.赔率) == 'object') {
      // 连肖、连尾的赔率
      sltPeilvAr = lhcZhu_lianxuan_lianma(ballsData.赔率, playData.playid);
    }

    newBallsArr.map((ballA, i) => {
      let ballNum = `${ballA.join('+')}`;
      let xiangqingStr = ballA.join(' ');

      if (ballsData[`${title}^^01`] != null) {
        xiangqingStr = newBallsZW[i].join(' ');
      }

      let lhcBallsXiangqing = '';
      if (playData.tpl == '14' || playData.tpl == '15') {
        // 连肖 // 连尾
        for (let n = 0; n < newBallsZW[i].length; n++) {
          let shengxiaoStr = newBallsZW[i][n];
          let shengxiaoBalls = playData.tpl == '15' ? getLhcLianWeiBalls(shengxiaoStr) : getLhcStatusBalls(shengxiaoStr);
          lhcBallsXiangqing += `${shengxiaoStr}(${shengxiaoBalls}) `;
        }
      }

      let price = params.singlePrice;
      if (ballsData['LhcPrice']) {
        price = parseFloat(ballsData['LhcPrice']) / params.zhushu;  // 输入的总金额 除 注数
      }

      let peilvStr = (ballsData.赔率.length == 1 && playData.tpl != '13') ? ballsData.赔率[0] : ballsData.赔率;
      if ((playData.tpl == '14' || playData.tpl == '15') && typeof(ballsData.赔率) == 'object') {
        // 连肖、连尾的赔率 取最小的显示。
        for (let x = 0; x < sltPeilvAr[i].length; x++) {
          if (x == 0) {
            peilvStr = sltPeilvAr[i][x];
          } else {
            if (parseFloat(peilvStr) > parseFloat(sltPeilvAr[i][x])) {
              peilvStr = sltPeilvAr[i][x];
            }
          }
        }
      }

      // 定义对象，类似Model
      let shopCarModel = {
          singlePrice: price,  //单价
          totalPrice: price,   //总价
          zhushu: 1,   //注数
          balls: ballNum,
          wanfa: playData.wanfa,  // 玩法
          peilv: peilvStr,  // tpl==13连码的赔率返回是字符串 不是数组。
          gameid: params.gameid,
          playid: playData.playid,
          xiangqing: xiangqingStr,  // 详情
          lhcBallsXiangqing: lhcBallsXiangqing,
          qishu: params.qishu,
          tag: params.tag,
      };
     shopCarModelArr.push({value:shopCarModel});
    })

  } else {
    // 号码分开投注的。
    for (let i = 0; i < ballArr.length; i++) {
      let ballNum = '';
      let lastPeilv = peilvArr[i];

      // 从ballsData里面拿到 所选号码对应的下标（数字）。
      if (ballsData[`${title}^^01`] == null) {
        ballNum = ballArr[i];
      } else {
        ballNum = ballsData[`${title}^^01`][i];
      }

      let xiangqingStr = ballArr[i];
      if (playid == '10' && title.includes('正码')) {
        // 正码混选
        xiangqingStr = `正码：${ballArr[i]}`;

      } else if (playid == '11' || playid == '12' || playid == '13' || playid == '14' || playid == '15' || playid == '16') {
        // 正码一 〜 正码六
        xiangqingStr = `${title}：${ballArr[i]}`;
      }

      let lhcBallsXiangqing = '';
      if (playid == '7' || playid == '17' || playid == '18' || playid == '9') {
        // 特肖 || 平特一肖 || 平特尾数 || 五行
        let shengxiaoStr = ballArr[i];
        let shengxiaoBalls = (playid == '7' || playid == '17') ? getLhcStatusBalls(shengxiaoStr) : getLhcLianWeiBalls(shengxiaoStr);
        lhcBallsXiangqing += `${shengxiaoStr}(${shengxiaoBalls})`;
      }

      let price = params.singlePrice;
      if (ballsData['LhcPrice'] && ballsData['LhcPrice'][i]) {
        price = parseFloat(ballsData['LhcPrice'][i]);
      }

        // 定义对象，类似Model
        let shopCarModel = {
            singlePrice: price,  //单价
            totalPrice: price,   //总价
            zhushu: 1,   //注数
            balls: ballNum,  // 号码拼接的字符串： '09 01 01'
            wanfa: playData.wanfa,  // 玩法
            peilv: lastPeilv,  // 赔率
            gameid: params.gameid,  // gameid
            playid: playData.playid,  // playid
            xiangqing: xiangqingStr, //`${title}(${ballArr[i]})`,  // 详情
            lhcBallsXiangqing: lhcBallsXiangqing,
            qishu: params.qishu,   // 期数
            tag: params.tag,   //彩种种类
        };

       shopCarModelArr.push({value:shopCarModel});
     }
  }

    for(let i = 0 ; i < shopCarModelArr.length; i++){
        shopCarModelArr[i].key = i;
        shopCarModelArr[i]['isFoldClick'] = false; //是否点击展开或折叠。默认为false, 低频彩折叠判断 5月18日
    }
  return (shopCarModelArr);
}

//（非六合彩的号码拼接）
function handleTouZhuBalls(params) {

  let ballsData = params.ballsData;
  let playData = params.playData;
  let playid = playData.playid;
  let js_tag = params.js_tag;
  let playPeilv = getPeilvWithPlayid(playid, params.peilvDataArr);

  let shopCarModelArr = [];  // 最终要返回的数组

  // 号码分开投注的。
  let k3HZ = js_tag == 'k3' && playData.tpl == 0; // 快三-和值。
  let sscTSH = js_tag == 'ssc' && (playData.tpl == 6 || playid == '78'); // 时时彩-特殊号 / 双面-和值大小单双
  let pcddTM = js_tag == 'pcdd' && playid == 1; // 特码|混合
  let pcddHH = (js_tag == 'pcdd' && playid == 3) || (js_tag == 'k3' && playid == 15); // pcdd混合 || K3三同号 // 按双面盘的拼接
  let pk10GYH = js_tag == 'pk10' && playid == 7; // 冠亚和
  let d3dHZ = js_tag == '3d' && (playData.tpl == 2 || playData.tpl == 3 || playData.tpl == 4); // 直选和值、组三和值、组六和值
  let qxcHZZX = js_tag == 'qxc' && playid == 7;  // 和值组选
  let xypkBX = js_tag == 'xypk' && playid == 1;  // 幸运扑克包选
  let xyncNQ = js_tag == 'xync' && (playid == 2 || playid == 3 || playid == 4 || playid == 5 || playid == 6 || playid == 7 || playid == 8 || playid == 9); // 第一球 〜 第八球
  let xytzJD = js_tag == 'tzyx';
  let pkniuniu = js_tag == 'pkniuniu';
  // 牛牛
  let isNiuniu = playData.playname.includes('牛牛');
  // 双面盘(PK10除外) 或者 龙虎斗
  let isSMP_LHD = (playData.playname.includes('双面盘') && js_tag != 'pk10' && js_tag != 'xync') || playData.playname.includes('龙虎斗');

  if (k3HZ || sscTSH || pcddTM || d3dHZ || xypkBX || xyncNQ || isNiuniu || xytzJD) {
    // 号码分开投注的（单注模式，每个号码的赔率都不同的）

    let title = params.titles[0];  // 这样的 titles只有一个值的，直接拿第0个下标就好了。
    let ballArr = ballsData[title];  // 拿到当前选择的号码
    let peilvArr = ballsData.赔率;   // 选择的号码对应的赔率

    for (let i = 0; i < ballArr.length; i++) {

      let lastPeilv = peilvArr != null ? peilvArr[i] : playPeilv; 
      let ballNum = ballsData[`${title}`][i];

      // 如果[`${title}^^01`] 不为空，则改变ballNum的值。
      if (ballsData[`${title}^^01`] != null) {
        ballNum = ballsData[`${title}^^01`][i];
      }

      let xiangqing = `${title}(${ballArr[i]})`;
      if (js_tag == '3d' && (playData.tpl == 3 || playData.tpl == 4)) {
        xiangqing = ballArr[i]; // 3d 组三、六和值
      }

      let shopCarModel = {
          singlePrice: params.singlePrice,  //单价
          totalPrice: params.singlePrice,   //总价
          zhushu: 1,       //注数
          balls: ballNum,  // 号码拼接的字符串： '09 01 01'
          wanfa: playData.wanfa,  // 玩法
          peilv: lastPeilv,  // 赔率
          gameid: params.gameid,
          playid: playData.playid,
          xiangqing: xiangqing,  // 详情：百位(6) || 前二和值：16
          qishu: params.qishu,   // 期数
          tag: params.tag,
      };
      shopCarModelArr.push({value:shopCarModel});
    }

  } else if (playData.wanfa.includes('单式')) {

    let titles = params.titles;
    let ballsArr = Object.values(ballsData)[0];

    // 购物车里机选一注的单式，ballsArr重新赋值
    if ((!Object.keys(ballsData)[0].includes('单式') && !playData.wanfa.includes('任选')) || Object.keys(ballsData)[0].includes('号码')) {
      ballsArr = Object.values(ballsData); // 单排的

      if (Object.keys(ballsData).length > 1) { // 多排的,百十个位
        let bals = [];
        for (b of ballsArr) {
          bals.push(b[0]);
        }
        ballsArr = [];
        ballsArr[0] = bals;
      }
    }

    for (let i = 0; i < ballsArr.length; i++) {
      let ballNum = ballsArr[i].join('|');
      let xiangqing = '';

      if (playData.wanfa.includes('组') || playData.wanfa.includes('任选')) { // 组选 组三 组六 任选
        xiangqing = `${titles[0]}(${ballsArr[i].join('|')})`;

      } else {
        for (let b = 0; b < titles.length; b++) {
          xiangqing += `${titles[b]}(${ballsArr[i][b]})${b == titles.length - 1 ? '' : ' '}`;
        }
      }

      let shopCarModel = {
          singlePrice: params.singlePrice,  //单价
          totalPrice: params.singlePrice,   //总价
          zhushu: 1,       //注数
          balls: ballNum,  // 号码拼接的字符串： '09|01|01'
          wanfa: playData.wanfa,  // 玩法
          peilv: playPeilv,  // 赔率
          gameid: params.gameid,
          playid: playData.playid,
          xiangqing: xiangqing, 
          qishu: params.qishu,   // 期数
          tag: params.tag,
      };
      shopCarModelArr.push({value:shopCarModel});
    }

  } else if (isSMP_LHD || pcddHH || pk10GYH || qxcHZZX) {
    // 双面盘 / 龙虎斗
    let peilvArr = playPeilv.split('|'); 
    let titlesArr = params.titles;
    let selectTitles = Object.keys(ballsData);

    for (let i = 0; i < titlesArr.length; i++) {

      if (selectTitles.includes(titlesArr[i])) {

        let title = titlesArr[i];
        let ballArr = ballsData[title];  // 拿到当前选择的号码
        let ballNUmArr = ballsData[`${title}^^01`];  // 对应的下标。

        for (let j = 0; j < ballArr.length; j++) {

          let ballNum = ballNUmArr[j];
          let lastPeilv = peilvArr.length == 1 ? peilvArr[0] : peilvArr[ballNUmArr[j]];
          if (lastPeilv == null) {
            lastPeilv = peilvArr[parseInt(ballNUmArr[j])%3]; // 3D SSC特殊龙虎斗
          }
          let xiangqing = pcddHH ? `${playData.playname == '三同号' ? '豹子' : playData.playname}(${ballArr[j]})` : `${title}(${ballArr[j]})`;

          let shopCarModel = {
              singlePrice: params.singlePrice,  //单价
              totalPrice: params.singlePrice,   //总价
              zhushu: 1,       //注数
              balls: ballNum,  // 号码拼接的字符串： '09 01 01'
              wanfa: playData.wanfa,  // 玩法
              peilv: lastPeilv,  // 赔率
              gameid: params.gameid,
              playid: playData.playid,
              xiangqing: xiangqing,  // 详情：百位(6) || 前二和值：16
              qishu: params.qishu,   // 期数
              tag: params.tag,
          };
          shopCarModelArr.push({value:shopCarModel});

        }
      }
    }
  
  } else {

    // 号码不分开投注的。走这里
    let selectTitles = Object.keys(ballsData);
    let selectBalls = Object.values(ballsData);
    let selectBallsNum = Object.values(ballsData);

    // 编历判断这个title有没有包含^^01的，有就要干掉它。
    for (let i = 0; i < selectTitles.length; i++) {
      if (selectTitles[i].includes('^^01')) {
          selectTitles.splice(i, 1); // 选择有的title
          selectBalls.splice(i, 1);  // 选择的号码。可能包括中文的（大小单双）
          selectBallsNum.splice(i - 1, 1); // 选择的号码，全是数字的。
      }
    }

    // 号码前面 拼前缀的。
    let sscBallQZ = js_tag == 'ssc' && (playid == 41 || playid == 57 || playid == 63 || playid == 72); // 定位胆、任二、三、四直选复式、//@"任选玩法"];
    let pk10BallQZ = js_tag == 'pk10' && (playid == 6 || playid == 15 || playid == 14); // 定位胆、数字盘、双面盘
    let x11x5BallQZ = js_tag == '11x5' && (playid == 29 || playid == 52); // 定位胆、定位大小单双
    let pcddBallQZ = js_tag == 'pcdd' && (playid == 6 || playid == 7); // 定位胆、定位大小单双
    let d3dBallQZ = js_tag == '3d' && (playid == 12 || playid == 24); // 定位胆、定位大小单双
    let qxcBallQZ = js_tag == 'qxc' && (playid == 1 || playid == 2 || playid == 3 || playid == 4 || playid == 8);  // 一定位、二、三、四定复式、定位大小单双
    let xyncBallQZ = js_tag == 'xync' && playid == 1;  // 双面盘
    if (sscBallQZ || pk10BallQZ || x11x5BallQZ || pcddBallQZ || d3dBallQZ || qxcBallQZ || xyncBallQZ) {
      selectBallsNum = addBallsQZ(params.titles, selectTitles, selectBallsNum);
    }

    let ballsStr = '';
    let xiangqingStr = '';
    let lastPeilv = playPeilv; // playData.peilv;
    if (ballsData.rx_title != null && ballsData.rx_title.length > 0) {
      // ssc-任选
      let seTitle = ballsData.rx_title;
      xiangqingStr = seTitle.join(' ');

      for (let n = 0; n < selectTitles.length; n++) {
        if (selectTitles[n].includes('rx_title')) {
            selectTitles.splice(n, 1);
            selectBalls.splice(n, 1);
        }
      }
      selectBalls = addBallsQZ(['万位', '千位', '百位', '十位', '个位'], ballsData.rx_title, selectBalls);
      selectBalls.map((ballsArr, i) => {

        let rowBallStr = '';
        if (selectTitles.length == 1) {
          rowBallStr = ballsArr.join('+'); // 只有一排的。直接用空格隔开。
        } else {
           rowBallStr = ballsArr.join('|');
        }

        if (i == 0) {
          ballsStr = rowBallStr;
        } else {
          ballsStr = `${ballsStr}+${rowBallStr}`;
        }
      })
      let baArr = ballsStr.split('+'); // 折分，干掉前缀，再拼
      baArr.splice(0, 1);
      xiangqingStr = `${xiangqingStr}(${baArr.join(' ')})`;

    } else {

      // balls拼接说明:  | 行内分隔符, + 行直接的分隔符, 如果有位置解析放在最前面
      // 详情显示拼接： | 行内分隔符,  空格 行直接的分隔符, 
      selectBalls.map((ballsArr, i) => {
        // 这个显示可能有中文的。有中文的号码，xiangqing要显示中文，balls要显示数字。所以分开声明两个吧。
        let rowBallStr = '';
        let rowBallNumStr = '';
        if (selectBalls.length == 1 && selectTitles.length == 1) {
          rowBallStr = ballsArr.join(' '); // 只有一排的。直接用空格隔开，用于提交投注的ballNum用‘=’隔开。
          rowBallNumStr = selectBallsNum[i].join('+');
        } else {
           rowBallStr = ballsArr.join('|');
           rowBallNumStr = selectBallsNum[i].join('|');
        }

        if (i == 0) {  // balls用rowBallNumStr拼接，xiangqing用rowBallStr拼接，
          ballsStr = rowBallNumStr;
          xiangqingStr =  `${selectTitles[i]}(${rowBallStr})`;
        } else {
          ballsStr = `${ballsStr}+${rowBallNumStr}`;
          xiangqingStr = `${xiangqingStr} ${selectTitles[i]}(${rowBallStr})`;
        }
      })


      if (sscBallQZ || pk10BallQZ || x11x5BallQZ || pcddBallQZ || d3dBallQZ || qxcBallQZ || xyncBallQZ) {
        ballsStr = ''; // 这些要拼前缀的，要重新拼ballsStr。因为它前面多了一个前缀号
        for (let i = 0; i < selectBallsNum.length; i++) {
          let rowBallNumStr = selectBallsNum[i].join('|');
          if (i == 0) {
            ballsStr = rowBallNumStr;
          } else {
            ballsStr = `${ballsStr}+${rowBallNumStr}`;
          }
        }
      }

    }
    
    let shopCarModel = {
        singlePrice: params.singlePrice,  //单价
        totalPrice: params.totalPrice,   //总价
        zhushu: params.zhushu,       //注数
        balls: ballsStr,  // 号码拼接的字符串： '09 01 01'
        wanfa: playData.wanfa,  // 玩法
        peilv: lastPeilv,  // 赔率
        gameid: params.gameid,
        playid: playData.playid,
        xiangqing: xiangqingStr,  // 详情：万位(6) 千位(6) 百位(6)
        qishu: params.qishu,   // 期数
        tag: params.tag,
    };
    shopCarModelArr.push({value:shopCarModel});
  }

    for(let i = 0 ; i < shopCarModelArr.length; i++){
        shopCarModelArr[i].key = i;
        shopCarModelArr[i]['isFoldClick'] = false; //是否点击展开或折叠。默认为false, 低频彩折叠判断 5月18日
    }

  return shopCarModelArr;
}

// 计算返回注数
function calcAllPlayGame(parameter) {

  let selectballs = parameter.selectballs; // 所选的号码
  let titles = parameter.titles;  // 所有的title
  let js_tag = parameter.js_tag;  // 当前的js_tag
  let playData = parameter.playData; // 当前玩法的数据
  let playid = playData.playid;
  let tpl = playData.tpl;

  // 如果为空，注数为0，return
  if (Object.keys(selectballs).length <= 0) {
    return 0;
  }

    //拿到回调后的号码的key
    let selectBallsKey = Object.keys(selectballs);
    let selectBallsArr = Object.values(selectballs);
    let zhushu = 0;

    // 有些是有中文的， 要干掉它。
    for (let i = 0; i < selectBallsKey.length; i++) {
      if (selectBallsKey[i].includes('^^01')) {
          selectBallsKey.splice(i, 1);
          selectBallsArr.splice(i - 1, 1);
      }

      // ssc 任选的要干掉
      if (selectBallsKey[i] != null && selectBallsKey[i].includes('rx_title')) {
        selectBallsKey.splice(i, 1);
        selectBallsArr.splice(i, 1);
      }
    }

    // 拼 前缀的。
    let sscBallQZ = js_tag == 'ssc' && (playid == 41 || playid == 57 || playid == 63 || playid == 72); // 定位胆、任二、三、四直选复式、//@"任选玩法"];
    let pk10BallQZ = js_tag == 'pk10' && (playid == 6 || playid == 15); // 定位胆、数字盘
    let x11x5BallQZ = js_tag == '11x5' && (playid == 29 || playid == 52); // 定位胆、定位大小单双
    let pcddBallQZ = js_tag == 'pcdd' && (playid == 6 || playid == 7);  // 定位胆、定位大小单双
    let d3dBallQZ = js_tag == '3d' && (playid == 12 || playid == 24); // 定位胆、定位大小单双
    let qxcBallQZ = js_tag == 'qxc' && (playid == 1 || playid == 2 || playid == 3 || playid == 4 || playid == 8);  // 一定位、二、三、四定复式、定位大小单双
    let lhcLmBallQZ = js_tag == 'lhc' && (tpl == '7' || tpl == '12');  // 合肖、自选不中
    let lhcLmLx = js_tag == 'lhc' && (tpl == '13' || tpl == '14' || tpl == '15'); //六合彩 连码 连肖
    let pcddHH = (js_tag == 'pcdd' && playid == 3) || (js_tag == 'k3' && playid == 15) || (playData.wanfa.includes('龙虎斗')); // pcdd混合 || K3三同号  || 龙虎斗
    let qxcHZZX = js_tag == 'qxc' && playid == 7;  // 和值组选
    if (sscBallQZ || pk10BallQZ || x11x5BallQZ || pcddBallQZ || d3dBallQZ || qxcBallQZ) {
      selectBallsArr = addBallsQZ(titles, selectBallsKey, selectBallsArr);
    }

    //定义一个拼接后的参数的数组
    let caculateZhuShuArr = [];
    let balls = '';

    if (parameter.playData.playname.includes('双面盘') || pcddHH || qxcHZZX) {
      // 双面盘。 所有彩种的双面盘注数直接在这里计算，然后直接返回注数。
      for (let b in selectBallsArr) {

        let preg = /^([\d]|[1-9][\d])$/; // 最大的是pk10的56，幸运农场最大72

        for (let c in selectBallsArr[b]) {
          if (preg.test(selectBallsArr[b][c])) {
            zhushu += 1;
          } else {
            zhushu = 0;
          }
        }
      }
      return zhushu;
      
    } else if (selectBallsKey.includes('赔率')) {

        if (titles.length == 1) {
            // 六合彩
            if (js_tag == 'lhc') {
              if (lhcLmBallQZ) {
                for (let j = 0; j < selectBallsArr[0].length; j++) {
                  caculateZhuShuArr.push(selectBallsArr[0][j])
                }

              } else if (lhcLmLx) {
                let arr = lhcZhu_lianxuan_lianma(selectBallsArr[0], playid);
                zhushu = arr.length;
                return zhushu;

              } else {
                for (let j = 0; j < selectBallsArr[0].length; j++) {
                  caculateZhuShuArr.push(selectBallsArr[0][j] + '|0'); // 这里加的'|0'只是计算注数是用到。
                }
              }
            } else {
              for (let i = 0; i < selectBallsArr[0].length; i++) {
                  balls = selectBallsArr[0][i];
                  caculateZhuShuArr.push(balls);  //单个列表的数据直接加入数组中
              }
            }
        }

    } else {

        if (titles.length == 1 || selectBallsKey[0].includes('单式')) {
           for (let i = 0; i < selectBallsArr[0].length; i++) {
               balls = selectBallsArr[0][i];
               caculateZhuShuArr.push(balls);  //单个列表的数据直接加入数组中
           }

        } else if (selectBallsKey.length == titles.length) {
          
            for (let i = 0; i< selectBallsArr.length; i ++) {
              balls = '';
               for (let j = 0; j < selectBallsArr[i].length; j++) {
                   if (j == selectBallsArr[i].length - 1) {
                     balls += selectBallsArr[i][j].toString();
                     caculateZhuShuArr.push(balls);
                   } else {
                     balls += selectBallsArr[i][j].toString() + '|';
                   }
               }
            }

          } else {
            // 有拼 前缀的。一排算一注的。
            if (sscBallQZ || pk10BallQZ || x11x5BallQZ || pcddBallQZ || d3dBallQZ || qxcBallQZ) {
              for (let i = 0; i< selectBallsArr.length; i ++) {
                balls = '';
                for (let j = 0; j < selectBallsArr[i].length; j++) {
                  if (j == selectBallsArr[i].length - 1) {
                    balls += selectBallsArr[i][j].toString();
                    caculateZhuShuArr.push(balls);
                  } else {
                    balls += selectBallsArr[i][j].toString() + '|';
                  }
                }
              }
            }
          }
      }

      if (selectballs.rx_title != null && selectballs.rx_title.length > 0) {
        let titArr = ['万位', '千位', '百位', '十位', '个位'];
        caculateZhuShuArr = addBallsQZ(titArr, selectballs.rx_title, caculateZhuShuArr);

        let rx2 = playid == '59' || playid == '60' || playid == '62';
        let rx3 = playid == '65' || playid == '66' || playid == '68' || playid == '71';
        let rx4 = playid == '74' || playid == '75' || playid == '76' || playid == '77';
        let count = selectballs.rx_title.length;
        let pos_count = 0;
        if (rx2) {
          switch(count) {
            case 2: pos_count = 1; break;
            case 3: pos_count = 3; break;
            case 4: pos_count = 6; break;
            case 5: pos_count = 10; break;
            default: pos_count = 0; break;
          }
        } else if (rx3) {
          switch(count) {
            case 3: pos_count = 1; break;
            case 4: pos_count = 4; break;
            case 5: pos_count = 10; break;
            default: pos_count = 0; break;
          }
        } else if (rx4) {
          switch(count) {
            case 4: pos_count = 1; break;
            case 5: pos_count = 5; break;
            default: pos_count = 0; break;
          }
        }
        caculateZhuShuArr.splice(0, 0, pos_count); // 选择的位数的个数，插入到0位。用来算注数，
        // 和后台写的有点区别，后台的pos_count在后面算法算了，在算法我们拿不到这个值，所以从这里传到算法里面算得最终注数。
      } else if (selectballs.rx_title != null && selectballs.rx_title.length <= 0) {
        caculateZhuShuArr = [];
      }

      if (js_tag == 'ssc') {
        zhushu = SSCCaculMethod.getSSCNumberMethod(playid, caculateZhuShuArr);
      }
      else if (js_tag == '11x5') {
        zhushu = C11x5CaculMethod.get11x5NumberMethod(playid, caculateZhuShuArr);
      }
      else if (js_tag == 'k3') {
        zhushu = K3CaculMethod.getK3NumMethod(playid, caculateZhuShuArr);
      }
      else if (js_tag == 'pk10') {
        zhushu = PK10CaculMethod.getPK10NumMethod(playid, caculateZhuShuArr);
      }
      else if (js_tag == '3d') {
        zhushu = FC3DCaculMethod.getFC3DNumMethod(playid, caculateZhuShuArr);
      }
      else if (js_tag == 'pcdd') {
        zhushu = PCDDCaculMethod.getPCDDNumMethod(playid, caculateZhuShuArr);
      }
      else if (js_tag == 'lhc' && !lhcLmLx) {
        let dict = LHCCaculMethod.getLHCNumberMethod(playid, caculateZhuShuArr);
        zhushu = dict.zhushu;
      }
      else if (js_tag == 'qxc') {
        zhushu = QXCCalculation.getQXCNumMethod(playid, caculateZhuShuArr);

      } else if (js_tag == 'xync') {
        zhushu = XyncCalculation.getXyncNumMethod(playid, caculateZhuShuArr);

      } else if (js_tag == 'xypk') {
        zhushu = XypkCalculation.getXypkNumMethod(playid, caculateZhuShuArr);
      }
      else if (js_tag == 'tzyx'){
        zhushu = XytzCaculation.getXytzNumMethod(playid, caculateZhuShuArr);
      }
      else if (js_tag == 'pkniuniu'){
          zhushu = PkniuniuCaculation.getPkniuniuNumMethod(playid, caculateZhuShuArr);
      }

      return zhushu;
  }

// 添加号码前缀的
function addBallsQZ(titles, selectTitles, selectBallsNum) {

  // 更改selectBallsNum，在它前面拼上 前缀。
  let prefixArr = [];
  let idx = 1;
  for (let i = 1; i <= titles.length; i++) {
      prefixArr.push(idx);
      idx *= 2;
  }

  let qzInt = 0;
  for (let i = 0; i < selectTitles.length; i++) {
    let tit = selectTitles[i];

    for (let j = 0; j < titles.length; j++) {
      if (tit == titles[j]) {
        qzInt += prefixArr[j];
        break;
      }
    }
  }
  selectBallsNum.splice(0, 0, [qzInt]); // 前缀的值，插入到0位
  return selectBallsNum;
}

// 六合彩的 所选的号码 几个为一注。
function lhcZhu_lianxuan_lianma(ballArr, playid) {
  // 连选必中的-连肖-连尾 || 连码
  let newBallsArr = [];
  if (playid == '22' || playid == '26' || playid == '32' || playid == '33' || playid == '34') {
    // 二连肖 || 2连尾 || 连码-二全中 | 二中特 | 特串 两个号一注
    for (let a = 0; a < ballArr.length; a++) {
      for (let b = a+1; b < ballArr.length; b++) {
        newBallsArr.push([ballArr[a], ballArr[b]]);
      }
    }
  } else if (playid == '23' || playid == '27' || playid == '30' || playid == '31') {
    // 三连肖 || 3连尾 || 连码-三中三 | 三全中 三个号一注
    for (let a = 0; a < ballArr.length; a++) {
      for (let b = a+1; b < ballArr.length; b++) {
        for (let c = b+1; c < ballArr.length; c++) {
           newBallsArr.push([ballArr[a], ballArr[b], ballArr[c]]);
        }
      }
    }
  } else if (playid == '24' || playid == '28' || playid == '35') {
    // 四连肖 || 4连尾 || 连码 四个号一注
    for (let a = 0; a < ballArr.length; a++) {
      for (let b = a+1; b < ballArr.length; b++) {
        for (let c = b+1; c < ballArr.length; c++) {
          for (let d = c+1; d < ballArr.length; d++) {
            newBallsArr.push([ballArr[a], ballArr[b], ballArr[c], ballArr[d]]);
          }
        }
      }
    }
  } else if (playid == '25' || playid == '29') {
    // 五连肖 || 5连尾 五个号一注
    for (let a = 0; a < ballArr.length; a++) {
      for (let b = a+1; b < ballArr.length; b++) {
        for (let c = b+1; c < ballArr.length; c++) {
          for (let d = c+1; d < ballArr.length; d++) {
            for (let e = d+1; e < ballArr.length; e++) {
              newBallsArr.push([ballArr[a], ballArr[b], ballArr[c], ballArr[d], ballArr[e]]);
            }
          }
        }
      }
    }
  }

  return newBallsArr;
}
