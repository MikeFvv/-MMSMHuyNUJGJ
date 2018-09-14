/**
 Created by on 2018/03/07
 获得号码球的状态， 如 颜色、生肖
 */
import moment from 'moment';

export default {

  // 传入一个号码 判断是属于红波，绿波，蓝波
  getLhcColorToBallStr(ball, isName) {
    let colors = lhcBallColor();
    var colorStr = '#e33939';
    for (let b in colors) {
      let ballAr = colors[b].balls;
      if (ballAr.includes(ball)) {
        colorStr = isName ? colors[b].name : colors[b].color;
        break;
      }
    }
    return colorStr;
  },


  // 传入一个号码 判断是哪个生肖 鼠、牛、虎、兔.....
  getShengxiaoToBallStr(ball) {
    let shengxiao = shengxiaoIdxBalls();
    var sxName = '';
    for (let a in shengxiao) {
      let ballAr = shengxiao[a].balls;
      if (ballAr.includes(ball)) {
        sxName = shengxiao[a].name;
        break;
      }
    }
    return sxName;
  },


  // 传入一个生肖(鼠、牛、虎、兔), 判断是哪个生肖种类 家肖、野肖
  getKindToShengxiao(shengxiao) {
    let shengXiao_kind = {
      jiao: { name: '家', shengXiao: ['羊', '马', '牛', '猪', '狗', '鸡'] },
      ye: { name: '野', shengXiao: ['猴', '蛇', '龙', '兔', '虎', '鼠'] },
    };
    var kind = '';
    for (let c in shengXiao_kind) {
      let ballAr = shengXiao_kind[c].shengXiao;
      if (ballAr.includes(shengxiao)) {
        kind = shengXiao_kind[c].name;
        break;
      }
    }
    return kind;
  },


  getPcddColorToBallStr(ball, isName) {
    let color = '';
    if (ball == 0 || ball == 13 || ball == 14 || ball == 27) {
      color = isName ? '无' : '#707070';
      
    } else {
      let colorArr = ['#e33939', '#32b16c', '#21a7eb'];
      if (isName) {
        colorArr = ['红', '绿', '蓝'];
      }
      color = colorArr[parseInt(ball) % 3];
    }
    return color;
  },

  // 赔率去掉后面多的0。
  peilvHandle(peilv) {
    if (peilv == null) {
      return '';
    }

    if (peilv == '') {
      return '0.0';
    }

    let preg = /^[\d\.\|]{0,}$/;    // 匹配 0-9 小数点 |分割线
    let isZW = preg.test(peilv); 

    if (peilv.includes('|') && isZW) {
      let peilvArr = peilv.split('|');
      for (let a = 0; a < peilvArr.length; a++) {
        
        let plv = `${parseFloat(peilvArr[a])}`;
        if (!plv.includes('.')) { // 如果没有小数点的，保留一位小数
          plv = parseFloat(peilvArr[a]).toFixed(1);
        } 
        peilvArr[a] = plv;
      }
      return peilvArr.join('|');

    } else {
      let pl = `${parseFloat(peilv)}`;
      if (!pl.includes('.')) { // 如果没有小数点的，保留一位小数
        pl = parseFloat(peilv).toFixed(1);
      } 

      if (pl == 'NaN' || !isZW) {
        return peilv;
      } else {
        return pl;
      }
    }
  },

  getLhcShengxiaoBalls(isHeXiao) {
    return shengxiaoIdxBalls(isHeXiao);
  }
  
}

function lhcBallColor() {
  let default_color = {
    red: { name: '红', color: '#e33939', balls: ['01', '02', '07', '08', '12', '13', '18', '19', '23', '24', '29', '30', '34', '35', '40', '45', '46'] },
    blue: { name: '蓝', color: '#21a7eb', balls: ['03', '04', '09', '10', '14', '15', '20', '25', '26', '31', '36', '37', '41', '42', '47', '48'] },
    green: { name: '绿', color: '#32b16c', balls: ['05', '06', '11', '16', '17', '21', '22', '27', '28', '32', '33', '38', '39', '43', '44', '49'] }
  }
  return default_color;
}

// 生肖下标 的号码
function shengxiaoIdxBalls(isHeXiao) {

  var default_shengxiao = {
    ba_0: { name: '鼠', idx: 0, balls: [] },
    ba_1: { name: '牛', idx: 1, balls: [] },
    ba_2: { name: '虎', idx: 2, balls: [] },
    ba_3: { name: '兔', idx: 3, balls: [] },
    ba_4: { name: '龙', idx: 4, balls: [] },
    ba_5: { name: '蛇', idx: 5, balls: [] },
    ba_6: { name: '马', idx: 6, balls: [] },
    ba_7: { name: '羊', idx: 7, balls: [] },
    ba_8: { name: '猴', idx: 8, balls: [] },
    ba_9: { name: '鸡', idx: 9, balls: [] },
    ba_10: { name: '狗', idx: 10, balls: [] },
    ba_11: { name: '猪', idx: 11, balls: [] },
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
    for (var i = start_balls; i < (isHeXiao ? 49 : 50); i += 12) {
      if (i === 0) {
        continue;
      }
      var theball = i > 9 ? (i + '') : ('0' + i);
      default_shengxiao[k].balls.push(theball);
    }
  }
  return default_shengxiao;
}
