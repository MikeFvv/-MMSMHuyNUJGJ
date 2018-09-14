/**
 Created by Money on 2017/10/13
 dec 随机，传入参数，返回数组投注所需要的参数。
 */

 import CalcReturnParam from '../CalcReturnParam';

 let tempArcArr = []; // 避免随机重复的

 export default {

   // 随机返回投注参数
   randomReturnTuoZhuParam(params) {
      let randomData = returnSelectBalls(params);

     let data = {
       ballsData: randomData.ballDict,  //当前选择的号码，可能包含赔率 或`%{title}0`
       playData: params.playData,  // 当前玩法的数据
       js_tag: params.js_tag,     // 当前js_tag
       tag: params.tag,           // 当前tag
       gameid: params.gameid,
       titles: params.titles,     // 所有的titles
       totalPrice: randomData.totalPrice,
       singlePrice: 2,
       zhushu: randomData.zhushu,
       qishu: params.qishu,
       peilvDataArr: params.peilvDataArr,  // 当前玩法赔率
     }

     if (params.js_tag == 'lhc') {
      return CalcReturnParam.getLHCTuoZhuParam(data);
     } else {
      return CalcReturnParam.getTuoZhuParam(data);
     }

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

function returnSelectBalls(params) {

  let len = params.ballsArr.length; // 随机的长度
  let ballsArr = params.ballsArr;
  let titles = params.titles;
  let playData = params.playData;
  let playid = params.playData.playid;
  let js_tag = params.js_tag;
  let tpl = params.playData.tpl;
  let peilvStr = getPeilvWithPlayid(playid, params.peilvDataArr);

  let ballDict = {}; // 选择的号码
  let zhushu = 1;    // 注数，默认1
  let totalPrice = 2;  // 总金额，默认2
  let tempArcInt = -1;  // 如定位胆时用到，用来记录随机的一位数

  
  titles.map((title, idx) => {

    let arcNumArr = returnArcBallArr(1, len);

    if (js_tag == 'ssc') {
      if (playid == '83') {
        // 五星-组选120
        arcNumArr = returnArcBallArr(5, len);
      } else if (playid == '84') {
        // 五星-组选60
        arcNumArr = (idx == 1) ? returnArcBallArr(3, len) : returnArcBallArr(1, len);
        tempArcArr = (idx == 0) ? arcNumArr : [];

      } else if (playid == '85') {
        // 五星-组选30
        arcNumArr = (idx == 0) ? returnArcBallArr(2, len) : returnArcBallArr(1, len);
        tempArcArr = (idx == 0) ? arcNumArr : [];

      } else if (playid == '86' || playid == '91' || playid == '98') {
        // 五星-组选20 || 四星-后、前四组选12
        arcNumArr = (idx == 1) ? returnArcBallArr(2, len) : returnArcBallArr(1, len);
        tempArcArr = (idx == 0) ? arcNumArr : [];

      } else if (playid == '90' || playid == '97') {
        // 四星-后、前组选24
        arcNumArr = returnArcBallArr(4, len);
      } else if (playid == '92' || playid == '99') {
        // 四星-后、前四组选6
        arcNumArr = returnArcBallArr(2, len);
      } else if (tpl == '2') {
        // 三星-后、前、中三直选和值 ／ 任三直选和值
        let arcInt = Math.floor(Math.random() * len);
        arcNumArr = [arcInt];
        let zhus = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 63, 69, 73, 75];
        if (arcInt >= 14) {
            arcInt = 13 - arcInt % 14;
        }
        zhushu = zhus[arcInt];

      } else if (playid == '9' || playid == '23' || playid == '105') {
        // 三星-后、前、中三直选跨度
        let arcInt = Math.floor(Math.random() * len);
        arcNumArr = [arcInt];
        let zhus = [10, 54, 96, 126, 144, 150, 144, 126, 96, 54];
        zhushu = zhus[arcInt];

      } else if (playid == '10' || playid == '24' || playid == '106') {
        // 三星-后、前、中三组三复式
        zhushu = 2;
        arcNumArr = returnArcBallArr(2, len);

      } else if (playid == '12' || playid == '26' || playid == '108') {
        // 三星-后、前、中三组六复式
        arcNumArr = returnArcBallArr(3, len);

      } else if (playid == '11' || playid == '25' || playid == '107') {
        //后|前|中三组三单式
        arcNumArr = returnArcBallArr(2, len);

      } else if (playid == '13' || playid == '27' || playid == '109') {
        //后|前|中三组六单式
        arcNumArr = returnArcBallArr(3, len);

      } else if (tpl == '3') {
        // 三星-后、前、中三组选和值 ／ 任三-组选和值
        let arcInt = Math.floor(Math.random() * len);
        arcNumArr = [arcInt];
        let zhus = [1, 2, 2, 4, 5, 6, 8, 10, 11, 13, 14, 14, 15];
        if (arcInt >= 13) {
            arcInt = 12 - arcInt % 13;
        }
        zhushu = zhus[arcInt];

      } else if (tpl == '9' || playid == '59') {
        // 前、后二直选和值
        let arcInt = Math.floor(Math.random() * len);
        arcNumArr = [arcInt];
        let zhus = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        if (arcInt >= 10) {
            arcInt = 8 - arcInt % 10;
        }
        zhushu = zhus[arcInt];

      } else if (tpl == '7') {
        // 前、后二组选和值 ／ 任二组选和值
        let arcInt = Math.floor(Math.random() * len);
        arcNumArr = [arcInt];
        let zhus = [1, 1, 2, 2, 3, 3, 4, 4, 5];
        if (arcInt >= 9) {
            arcInt = 7 - arcInt % 9;
        }
        zhushu = zhus[arcInt];

      } else if (playid == '36' || playid == '118') {
        // 前、后二直选跨度
        let arcInt = Math.floor(Math.random() * len);
        arcNumArr = [arcInt];
        let zhus = [10, 18, 16, 14, 12, 10, 8, 6, 4, 2];
        zhushu = zhus[arcInt];
      
      } else if (playid == '120' || playid == '38') {
        //后|前二组选单式
        arcNumArr = returnArcBallArr(2, len);
        
      } else if (playid == '37' || playid == '119' || playid == '43' || playid == '45' || playid == '47' || playid == '49' || playid == '51') {
        // 前、后二组选复式  // 不定位-前、后三二码、 前、后四二码、 五星二码
        arcNumArr = returnArcBallArr(2, len);
      } else if (playid == '41') {
        // 定位胆、只有一个号
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 5);
        }
        arcNumArr = (tempArcInt == idx) ? returnArcBallArr(1, len) : [];

      } else if (playid == '52') {
        // 五星三码
        arcNumArr = returnArcBallArr(3, len);

      } else if (playid == '57') {
        // 任二-直选复式 ／ 选2个号
        if (idx == 0) {
          tempArcInt = returnArcBallArr(2, 5).join('-');
        }
        let tempArcIntArr = tempArcInt.split('-');
        if (tempArcIntArr.includes((idx).toString())) {
          arcNumArr = returnArcBallArr(1, len);
        } else {
          arcNumArr = [];
        }

      } else if (playid == '63') {
        // 任三-直选复式 ／ 选3个号
        if (idx == 0) {
          tempArcInt = returnArcBallArr(2, 5).join('-');
        }
        let tempArcIntArr = tempArcInt.split('-');
        if (!tempArcIntArr.includes((idx).toString())) {
          arcNumArr = returnArcBallArr(1, len);
        } else {
          arcNumArr = [];
        }

      } else if (playid == '72') {
        // 任四-直选复式 ／ 选四个号
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 5);
        }
        arcNumArr = (tempArcInt != idx) ? returnArcBallArr(1, len) : [];

      } else if (playid == '60' || playid == '76') {
        // 任二-组选复式  / 任四-组选6
        arcNumArr = returnArcBallArr(2, len);
      } else if (playid == '66') {
        // 任三-组三复式
        zhushu = 2;
        arcNumArr = returnArcBallArr(2, len);
      } else if (playid == '68') {
        // 任三-组六复式
        arcNumArr = returnArcBallArr(3, len);
      } else if (playid == '74') {
        // 任四-组选24
        arcNumArr = returnArcBallArr(4, len);
      } else if (playid == '75') {
        // 任四-组选12
        arcNumArr = (idx == 1) ? returnArcBallArr(2, len) : returnArcBallArr(1, len);
        tempArcArr = (idx == 0) ? arcNumArr : [];

      } else if (playid == '130') {
        // 趣味  
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 4);
        }
        arcNumArr = (tempArcInt == idx) ? returnArcBallArr(1, len) : [];

      } else if (playid == '129') {
        // 龙虎斗
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 10);
        }
        arcNumArr = (tempArcInt == idx) ? returnArcBallArr(1, 3) : [];
        arcNumArr = arcNumArr.length > 0 ? [arcNumArr[0] + tempArcInt*3]: [];

      } else if (playid == '128') {
        // 双面盘
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 7);
        }
        arcNumArr = (tempArcInt == idx) ? returnArcBallArr(1, tempArcInt == 1 ? 5 : 4) : [];
        arcNumArr = arcNumArr.length > 0 ? [arcNumArr[0] + (tempArcInt > 1 ? tempArcInt*4+1 : tempArcInt*4)]: [];

      } else {
        if (playid == '82') {
          // 五星直选组合
          zhushu = 5;
        } else if (playid == '89' || playid == '96') {
          // 四星-后、前四组合
          zhushu = 4;
        } else if (playid == '7' || playid == '21' || playid == '103') {
          // 三星-后、前、中三组合
          zhushu = 3;
        } else if (playid == '16' || playid == '30' || playid == '112') {
          // 三星-后、前、中三组选包胆
          zhushu = 54;
        } else if (playid == '40' || playid == '122') {
          // 前、后二组选包胆
          zhushu = 9;
        }
        tempArcArr = (idx == 0) ? arcNumArr : [];
      }

    } else if (js_tag == '11x5') {
      if (playid == '3' || playid == '8' || playid == '13') {
        // 前\中\后三组选复式
        arcNumArr = returnArcBallArr(3, len);

      } else if (playid == 4 || playid == 9 || playid == 14) {
        // 前\中\后三组选单式
        arcNumArr = returnArcBallArr(3, len);

      } else if (playid == '5' || playid == '10' || playid == '15') {
        // 前\中\后三组选胆拖
        arcNumArr = (idx == 1) ? returnArcBallArr(2, len) : returnArcBallArr(1, len);
        tempArcArr = (idx == 0) ? arcNumArr : [];

      } else if (playid == '18' || playid == '23') {
        // 前\后二组选复式
        arcNumArr = returnArcBallArr(2, len);

      } else if (playid == 19 || playid == 24) {
        // 前\后二组选单式
        arcNumArr = returnArcBallArr(2, len);

      } else if (playid == '29' || playid == '52') {
        // 定位胆  // 信用-定位大小单双 只选一个号。
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 5);
        }
        arcNumArr = (tempArcInt == idx) ? returnArcBallArr(1, len) : [];

      } else if (playid == '31' || playid == 39) {
        // 任选二中二  - 任选复式
        arcNumArr = returnArcBallArr(2, len);
      } else if (playid == '32' || playid == 40) {
        // 任选三中三
        arcNumArr = returnArcBallArr(3, len);
      } else if (playid == '33' || playid == 41) {
        // 任选四中四
        arcNumArr = returnArcBallArr(4, len);
      } else if (playid == '34' || playid == 42) {
        // 任选五中五
        arcNumArr = returnArcBallArr(5, len);
      } else if (playid == '35' || playid == 43) {
        // 任选六中五
        arcNumArr = returnArcBallArr(6, len);
      } else if (playid == '36' || playid == 44) {
        // 任选七中五
        arcNumArr = returnArcBallArr(7, len);
      } else if (playid == '37') {
        // 任选八中五
        arcNumArr = returnArcBallArr(8, len);

      } else if (playid == '46') {
        // 任选三中三  - 任选胆拖
        arcNumArr = (idx == 1) ? returnArcBallArr(2, len) : returnArcBallArr(1, len);
        tempArcArr = (idx == 0) ? arcNumArr : [];

      } else if (playid == '47') {
        // 任选四中四
        arcNumArr = (idx == 1) ? returnArcBallArr(3, len) : returnArcBallArr(1, len);
        tempArcArr = (idx == 0) ? arcNumArr : [];

      } else if (playid == '48') {
        // 任选五中五
        arcNumArr = (idx == 1) ? returnArcBallArr(4, len) : returnArcBallArr(1, len);
        tempArcArr = (idx == 0) ? arcNumArr : [];

      } else if (playid == '49') {
        // 任选六中五
        arcNumArr = (idx == 1) ? returnArcBallArr(5, len) : returnArcBallArr(1, len);
        tempArcArr = (idx == 0) ? arcNumArr : [];

      } else if (playid == '50') {
        // 任选七中五
        arcNumArr = (idx == 1) ? returnArcBallArr(6, len) : returnArcBallArr(1, len);
        tempArcArr = (idx == 0) ? arcNumArr : [];

      } else if (playid == '51') {
        // 任选八中五
        arcNumArr = (idx == 1) ? returnArcBallArr(7, len) : returnArcBallArr(1, len);
        tempArcArr = (idx == 0) ? arcNumArr : [];

      } else if (playid == '54') {
        // 龙虎斗
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 10);
        }
        arcNumArr = (tempArcInt == idx) ? returnArcBallArr(1, 2) : [];
        arcNumArr = arcNumArr.length > 0 ? [arcNumArr[0] + tempArcInt*2]: [];

      } else if (playid == '56') {
        // 双面盘
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 7);
        }
        arcNumArr = (tempArcInt == idx) ? returnArcBallArr(1, tempArcInt == 0 ? 6 : 4) : [];
        arcNumArr = arcNumArr.length > 0 ? [arcNumArr[0] + tempArcInt*4 + (tempArcInt > 0 ? 2 : 0)]: [];
       
      } else {
        if (idx == 0) {
            tempArcArr = arcNumArr;
          } else if (idx == 1) {
            tempArcArr = [...tempArcArr, ...arcNumArr]
          }
      }

    } else if (js_tag == 'pk10') {
      if (playid == '6' || playid == '15') {
        // 定位胆 || 数字盘
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 10);
        }
        arcNumArr = (tempArcInt == idx) ? returnArcBallArr(1, len) : [];

      } else if (playid == '14') {
        // 双面盘
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 10);
        }
        arcNumArr = (tempArcInt == idx) ? returnArcBallArr(1, tempArcInt < 5 ? 6 : 4) : [];
        // arcNumArr = arcNumArr.length > 0 ? [arcNumArr[0] + (tempArcInt > 6 ? tempArcInt*6-(tempArcInt-6)*2 : tempArcInt*6)]: [];

      } else {
        if (idx == 0) {
          tempArcArr = arcNumArr;
        } else if (idx == 1) {
          tempArcArr = [...tempArcArr, ...arcNumArr]
        }
      }

    } else if (js_tag == 'k3') {
      if (playid == '4') {
        // 三不同号 - 标准
        arcNumArr = returnArcBallArr(3, len);
      } else if (playid == '5') {
        // 三不同号 - 胆拖
        arcNumArr = (idx == 1) ? returnArcBallArr(2, len) : returnArcBallArr(1, len);
        tempArcArr = (idx == 0) ? arcNumArr : [];

      } else if (playid == '8') {
        // 二同号-单选
        tempArcArr = idx == 0 ? arcNumArr : [];
        if (idx == 0) {
          arcNumArr = arcNumArr[0] >= 6 ? [arcNumArr[0] - 6] : arcNumArr;
        } else {
          arcNumArr = arcNumArr[0] < 6 ? [arcNumArr[0] + 6] : arcNumArr;
        }

      } else if (playid == '9') {
        // 二不同号 - 标准
        arcNumArr = returnArcBallArr(2, len);

      } else if (playid == '11') {
        // 定位胆、定位大小单双、极限号，只有一个号
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 3);
        }
        arcNumArr = (tempArcInt == idx) ? returnArcBallArr(1, len) : [];

      } else if (playid == '14') {
        // 双面盘
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 4);
        }
        arcNumArr = (tempArcInt == idx) ? returnArcBallArr(1, 4) : [];
        arcNumArr = arcNumArr.length > 0 ? [arcNumArr[0] + tempArcInt*4]: [];

      } else if (playid == '15') {
        // 三同号
        arcNumArr = (idx == 0) ? returnArcBallArr(1, len) : [];
        
      } else {
        tempArcArr = (idx == 0 && len > 1) ? arcNumArr : [];
      }

    } else if (js_tag == 'pcdd') {
      if (playid == 2) {
        // 特码包三
        arcNumArr = returnArcBallArr(3, len);

      } else if (playid == 3) {
        // 混合
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 2);
        }
        arcNumArr = (tempArcInt == idx) ? returnArcBallArr(1, len) : [];
      
      } else if (playid == '6' || playid == '7') {
        // 信用 - 定位胆、定位大小单双 只选一个号
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 3);
        }
        arcNumArr = (tempArcInt == idx) ? returnArcBallArr(1, len) : [];
      }

    } else if (js_tag == '3d') {

      if (playid == '4' || playid == '10' || playid == '11' || playid == '14') {
        // 三星-组三复式  // 前\后二组选复式 // 二码不定位
        arcNumArr = returnArcBallArr(2, len);
        if (playid == '4') {
          zhushu = 2;
        }

      } else if (playid == '5') {
        // 三星-组六复式
        arcNumArr = returnArcBallArr(3, len);

      } else if (playid == '12') {
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 3);
        }
        arcNumArr = tempArcInt == idx ? returnArcBallArr(1, len) : [];

      } else if (playid == '26') {
        // 双面盘
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 5);
        }
        arcNumArr = (tempArcInt == idx) ? returnArcBallArr(1, tempArcInt < 2 ? 5 : 4) : [];
        arcNumArr = arcNumArr.length > 0 ? [arcNumArr[0] + (tempArcInt*4 + (tempArcInt == 1 ? 2 : (tempArcInt > 1 ? 3 : 0)))]: [];
      
      } else if (playid == '27') {
        // 龙虎斗
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 3);
        }
        arcNumArr = (tempArcInt == idx) ? returnArcBallArr(1, 3) : [];
        arcNumArr = arcNumArr.length > 0 ? [arcNumArr[0] + tempArcInt*3]: [];

      } else {
        arcNumArr = returnArcBallArr(1, len);
        tempArcArr = idx == 1 ? [...tempArcArr, ...arcNumArr] : arcNumArr; // 防止机选重复
      }

    } else if (js_tag == 'lhc') {
      if (playid == '21') {
        // 自选不中
        arcNumArr = returnArcBallArr(6, len);

      } else if (playid == '8' || playid == '22' || playid == '26' || playid == '32' || playid == '33' || playid == '34') {
        // 特肖-合肖 || 二连肖 || 2连尾 || 二全中 || 二中特 || 特串
        arcNumArr = returnArcBallArr(2, len);

      } else if (playid == '23' || playid == '27' || playid == '30' || playid == '31') {
        // 三连肖 || 3连尾 || 三中二 || 三全中
        arcNumArr = returnArcBallArr(3, len);

      } else if (playid == '24' || playid == '28' || playid == '35') {
        // 四连肖 || 4连尾 || 四全中
        arcNumArr = returnArcBallArr(4, len);
        
      } else if (playid == '25' || playid == '29') {
        // 五连肖 || 5连尾
        arcNumArr = returnArcBallArr(5, len);
      }

    } else if (js_tag == 'xypk') {
      if (playid == 8) {
        // 任选二
        arcNumArr = returnArcBallArr(2, len);

      } else if (playid == 9) {
        // 任选三
        arcNumArr = returnArcBallArr(3, len);

      } else if (playid == 10) {
        // 任选四
        arcNumArr = returnArcBallArr(4, len);

      } else if (playid == 11) {
        // 任选五
        arcNumArr = returnArcBallArr(5, len);

      } else if (playid == 12) {
        // 任选六
        arcNumArr = returnArcBallArr(6, len);
      }
    
    } else if (js_tag == 'xync') {
      if (playid == 1) {
        // 双面盘
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 9);
        }
        arcNumArr = (tempArcInt == idx) ? returnArcBallArr(1, 8) : [];
        arcNumArr = arcNumArr.length > 0 ? [arcNumArr[0] + tempArcInt * 8]: [];
      }
    
    } else if (js_tag == 'qxc') {
      if (playid == 1) {
        // 一定位
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 4);
        }
        arcNumArr = tempArcInt == idx ? returnArcBallArr(1, len) : [];

      } else if (playid == 2) {
        // 二定复式，选择两个位
        if (idx == 0) {
          tempArcInt = returnArcBallArr(2, 4).join('-');
        }
        let tempArcIntArr = tempArcInt.split('-');
        if (tempArcIntArr.includes((idx).toString())) {
          arcNumArr = returnArcBallArr(1, len);
        } else {
          arcNumArr = [];
        }

      } else if (playid == 3) {
        // 三定复式， 选择三个位
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 4);
        }
        arcNumArr = (tempArcInt != idx) ? returnArcBallArr(1, len) : [];

      } else if (playid == 5) {
        // 二字现
        arcNumArr = returnArcBallArr(2, len);

      } else if (playid == 6) {
        // 三字现
        arcNumArr = returnArcBallArr(3, len);

      } else if (playid == 7) {
        // 和值组选
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 2);
        }
        arcNumArr = (tempArcInt == idx) ? returnArcBallArr(1, 4) : [];
        arcNumArr = arcNumArr.length > 0 ? [arcNumArr[0] + tempArcInt * 4]: [];

      } else if (playid == 8) {
        // 定位大小单双
        if (idx == 0) {
          tempArcInt = Math.floor(Math.random() * 4);
        }
        arcNumArr = tempArcInt == idx ? returnArcBallArr(1, len) : [];

      } else {
        arcNumArr = returnArcBallArr(1, len);
        tempArcArr = idx == 1 ? [...tempArcArr, ...arcNumArr] : arcNumArr;
      }
    }


    // 有中 没赔， 没中 有赔
    let isChinese = false, isPeilv = false;
    // 存放 随机选择的 ball, ballNum, 赔率;
    let rdmSltBlArr = [], rdmSltBlNumArr = [], rdmSltBlPlArr = []; 

    if (arcNumArr.length <= 0) {
      return;
    }

    // 编历ballsArr, 从数组里得到 ball, ballNum, 赔率;
    for (let j = 0; j < ballsArr.length; j++) {
      // 是否包含
      if (arcNumArr.includes(j)) {

        let k3hz = (js_tag == 'k3' && playid == '1') || (js_tag == 'pk10' && playid == '7'); // k3和值 || pk10冠亚和。改下标从0开始
        // 特肖、平特一肖 || 合肖 || 五行 || 二三四五连肖 下标从1开始
        let lhcIdxFrom1 = js_tag == 'lhc' && (tpl == '6' || tpl == '7' || tpl == '8' || tpl == '14');
        let k3th = js_tag == 'k3' && playid == '7'; // 二同号 标从1开始
        let xypkrx = js_tag == 'xypk' || js_tag == 'xync' || js_tag == 'tzyx'; // 幸运扑克 / 幸运农场 / 经典梯子

        // 用于判断那些ball是中文的，
        let preg = /^([\d]|[\d][\d])$/; // [\d] === [0-9] 查找数字
        isChinese = !preg.test(ballsArr[j].ball) || k3hz || k3th || lhcIdxFrom1 || xypkrx; // true:为中文
        isPeilv = params.ballsArr[j].peilv != null; // true:有赔率

        rdmSltBlArr.push(`${ballsArr[j].ball}`);

        
        if (js_tag == 'ssc' && (playid == '11' || playid == '25' || playid == '107')) {
          // SSC组三单式，加一位重复的号码。
          let sscZ3Repeat = rdmSltBlArr.length == 1 ? Math.floor(Math.random() * 2) : 0;

          if (sscZ3Repeat + 1 == rdmSltBlArr.length) {
            rdmSltBlArr.push(`${ballsArr[j].ball}`); // 再添加一次

          } else if (rdmSltBlArr.length == 2) {
            rdmSltBlArr.push(`${ballsArr[j].ball}`); // 再添加一次
          }
        }

        let xyncSMP = js_tag == 'xync' && playid == 1;  // 幸运农场 双面盘
        // 中文
        if (isChinese) {
          if (lhcIdxFrom1 || k3th) {
            rdmSltBlNumArr.push((j+1).toString()); // 下标从1开始

          } else if (xyncSMP) {
            rdmSltBlNumArr.push((j % 8).toString());

          } else {
            rdmSltBlNumArr.push(j.toString()); // 下标从0开始
          }
        }

        // 赔率
        if (isPeilv) {
          rdmSltBlPlArr.push(ballsArr[j].peilv);
        }

        if (arcNumArr.length == 1) {
          break; // 只有一个数的时候，拿到一个就退出了。
        }
      }
    }

    let dict = {};
    let rx2 = playid == '59' || playid == '60' || playid == '62';
    let rx3 = playid == '65' || playid == '66' || playid == '68' || playid == '71';
    let rx4 = playid == '74' || playid == '75' || playid == '76' || playid == '77';
    if (rx2 || rx3 || rx4) {
      // 随机选择位置
      let titArr = ['万位', '千位', '百位', '十位', '个位'];
      let arcTitArr = [];
      if (rx2) {
        arcTitArr = returnArcBallArr(2, titArr.length);
      } else if (rx3) {
        arcTitArr = returnArcBallArr(3, titArr.length);
      } else if (rx4) {
        arcTitArr = returnArcBallArr(4, titArr.length);
      }

      let selectTit = [];
      for (let a = 0; a < titArr.length; a++) {
        if (arcTitArr.includes(a)) {
          selectTit.push(titArr[a]);
        }
      }
      dict = {[title] : rdmSltBlArr, 'rx_title':selectTit};

    } else if (rdmSltBlArr.length > 0) {

      if (isPeilv) {
        // 赔率
        if (isChinese) {
          dict = {[title] : rdmSltBlArr, [`${title}^^01`] : rdmSltBlNumArr, '赔率' : rdmSltBlPlArr};
        } else {
          dict = {[title] : rdmSltBlArr, '赔率' : rdmSltBlPlArr};
        }

      } else if (isChinese) {
        // 数字 // 大小单双 
        dict = {[title] : rdmSltBlArr, [`${title}^^01`] : rdmSltBlNumArr};

      } else {
        dict = {[title] : rdmSltBlArr};
      }

      // lhc特殊的 重新加个赔率
      if (js_tag == 'lhc') {
        dict[title] = rdmSltBlArr;
        
        if (dict[`${title}^^01`] != null) {
          dict[`${title}^^01`] = rdmSltBlNumArr;
        }
        
        if (tpl == '7' || tpl == '12') {
          // 特肖-合肖 || 自选不中
          dict['赔率'] = peilvStr.split('|')[0];
          
        } else if (tpl == '13' || tpl == '14' || tpl == '15') {
          // 连码 || 连选-连肖、连尾
          if (peilvStr.length < 20) {
            dict['赔率'] = peilvStr;
          }
        }
      }

    }
    Object.assign(ballDict, dict);

  })
  totalPrice = totalPrice * zhushu;
  return {'ballDict':ballDict, 'zhushu':zhushu, 'totalPrice':totalPrice};
}


function returnArcBallArr(count, lenght) {
  // 传入个数，返回随机数。不能重复！
  let arcArr = [];
  for (let i = 0; i < 100; i++) {
      let arcInt = Math.floor(Math.random() * lenght);
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
