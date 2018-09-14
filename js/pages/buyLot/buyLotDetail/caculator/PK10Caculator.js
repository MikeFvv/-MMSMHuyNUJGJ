/**
    Author Ward
    Created by on 2017-10-06 11:17
**/

export default {

      getPK10NumMethod(playID, pickerArr){

          if (playID == '1')
          {
              return calc_q1_zxfs(pickerArr); // 前一 直选复式
          }
          else if (playID == '2') {
              return calc_q2_zxfs(pickerArr); // 前二 直选复式
          }
          else if (playID == '3') {
          	  return calc_q2_zxds(pickerArr); //前二直选单式
		  }
          else if (playID == '4') {
              return calc_q3_zxfs(pickerArr); // 前三 直选复式
          }
          else if (playID == '5') {
          	  return calc_q3_zxds(pickerArr);  // 前三直选单式
		  }
          else if (playID == '6' || playID == '15') {
              return calc_dwd(pickerArr);  //定位胆 || 数字盘
          }
          else if (playID == '7') {
              return calc_q2_hz(pickerArr);  //前二和值
          }
          else if (playID == '8') {
              return calc_q3_hz(pickerArr);  //前三和值
          }
          else if (playID == '9') {
              return calc_q4_hz(pickerArr);
          }
          else if (playID == '11') {
              return calc_q3_dxds(pickerArr);  //前三总大小单双
          }
          else if (playID == '12') {
              return calc_q3_qtx(pickerArr);
          }
          else if (playID == '13') {
              return calc_whjx(pickerArr);
          }
          else {
              return 0;  //不符合条件则返回注数0
          }

      }
}

	// 前一 直选复式
	function calc_q1_zxfs(ba) {
		if(ba.length < 1 || ba[0] == ""){
			return 0;
		}else{
			return ba.length;
		}
	}

	// 前二 直选复式
	function calc_q2_zxfs(ba) {
		if (ba.length < 2) {
			return 0;
		}
		var zhushu = 0;
		var balls1 = ba[0].split("|");
		var balls2 = ba[1].split("|");
		if (!checkArrIs(balls1, /[0-1][0-9]/) || !checkArrIs(balls2, /[0-1][0-9]/))  {
			return 0;
		}

		for (var i = 0; i < balls1.length; i++) {
			for (var j = 0; j < balls2.length; j++) {
				if (balls1[i] != balls2[j]) {
					zhushu++;
				}
			}
		}
		return zhushu;
	}

	// 前二  直选单式
 function calc_q2_zxds(ba) {
		if (ba.length < 1 || ba[0] == "") {
			return 0;
		}
		var zhushu = 0;
		var ballArr = [];
		for (var i = 0; i < ba.length; i++) {
			var balls = ba[i].split(/[\|\/]/);
			if(balls.length == 2 && checkArrIs(balls, /^(([0][1-9]|[1][0])|([1-9]|[1][0]))$/) && balls[0] != balls[1]){
				if (parseInt(balls[0]) != parseInt(balls[1])) {
					zhushu++;
					ballArr.push(balls);
				}
			}
		}
		return {zhushu: zhushu, ballArr: ballArr};
	}

	// 前三 直选复式
	function calc_q3_zxfs(ba) {
		if (ba.length < 3) {
			return 0;
		}
		var zhushu = 0;
		var balls1 = ba[0].split("|");
		var balls2 = ba[1].split("|");
		var balls3 = ba[2].split("|");
		if (!checkArrIs(balls1, /[0-1][0-9]/) || !checkArrIs(balls2, /[0-1][0-9]/) || !checkArrIs(balls3, /[0-1][0-9]/))  {
			return 0;
		}
		for (var i = 0; i < balls1.length; i++) {
			for (var j = 0; j < balls2.length; j++) {
				for (var n = 0; n < balls3.length; n++) {
					if (balls1[i] != balls2[j] && balls3[n] != balls1[i] && balls2[j] != balls3[n]) {
						zhushu++;
					}
				}
			}
		}
		return zhushu;
	}

	// 前三 直选单式
	function calc_q3_zxds(ba) {
		if (ba.length < 1 || ba[0] == "") {
			return 0;
		}
		var zhushu = 0;
		var ballArr = [];
		for (var i = 0; i < ba.length; i++) {
			var balls = ba[i].split(/[\|\/]/);
			if(balls.length == 3 && checkArrIs(balls, /^(([0][1-9]|[1][0])|([1-9]|[1][0]))$/)){
				if (parseInt(balls[0]) != parseInt(balls[1]) && parseInt(balls[1]) != parseInt(balls[2]) && parseInt(balls[0]) != parseInt(balls[2])) {
					zhushu++;
					ballArr.push(balls);
				}
			}
		}
		return {zhushu: zhushu, ballArr: ballArr};
	}

  //定位胆
function calc_dwd(ba) {
		if (ba.length < 2) {
			return 0;
		}
		var zhushu = 0;
		for (var i = 1; i < ba.length; i++) {
			var subballs = ba[i].split("|");
			for(var k in subballs) {
				if (subballs != '' && parseInt(subballs[k])>0 && parseInt(subballs[k]) <= 10) {
					zhushu++;
				}
			}
		}
		return zhushu;
	}

	/* 自定义玩法 */
	//前二和值
 function calc_q2_hz(ba){
		if(ba.length < 1){
			return 0;
		}
		return ba.length;
	}

	//前三和值
 function calc_q3_hz(ba){
		if(ba.length < 1){
			return 0;
		}
		return ba.length;
	}

	//前四和值
 function calc_q4_hz(ba){
		if(ba.length < 1){
			return 0;
		}
		return ba.length;
	}

	//定位大小单双
	function calc_all_dxds(ba){
		if(ba.length < 2 || ba[1] == ""){
			return 0;
		}
		var zhushu = 0;
		for(var i = 1; i < ba.length; i += 1){
			var res = ba[i].split("|");
			zhushu += res.length;
		}
		return zhushu;
	}

	//前三总大小单双
	function calc_q3_dxds(ba){
		if(ba.length < 1 || ba[0] == ""){
			return 0;
		}else{
			return ba.length;
		}
	}

	//前三特选
	function calc_q3_qtx(ba){
		if(ba.length < 1 || ba[0] == ""){
			return 0;
		}else{
			return ba.length;
		}
	}

	//龙虎斗
function calc_whjx(ba){
		if(ba.length < 0 || ba[0] == ""){
			return 0;
		}else{
			return ba.length;
		}
	}

  // 判断数组元素是否都为一种格式
  function checkArrIs(_arr, preg) {
    for(var k in _arr) {
      if (!preg.test(_arr[k])) {
        return false;
      }
    }
    return true;
  }
