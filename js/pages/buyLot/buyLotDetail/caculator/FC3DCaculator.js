
/**
    Author Ward
    Created by on 2017-10-06 14:41
**/

export default {

      getFC3DNumMethod(playID, pickerArr){

       if (playID == '1') {
            return calc_3x_zhxfs(pickerArr);  //三星 直选复式
		}
		else if (playID == '2') {
			 return calc_3x_zhxds(pickerArr); // 三星 直选单式
		}
        else if (playID == '3') {
            return calc_3x_zhxhz(pickerArr);  //三星 和值  牛逼的存在
        }
        else if (playID == '4') {
            return calc_3x_zu3fs(pickerArr);  //三星 组三复式
        }
        else if (playID == '5') {
            return calc_3x_zu6fs(pickerArr);  //三星 组六复式
        }
        else if (playID == '6') {
            return calc_3x_zu3hz(pickerArr);  //三星 组三和值
        }
        else if (playID == '7') {
            return calc_3x_zu6hz(pickerArr); //三星 组六和值
        }
        else if (playID == '8') {
            return calc_2x_q2zhxfs(pickerArr); //二星  前二直选复式
        }
        else if (playID == '9') {
            return calc_2x_h2zhxfs(pickerArr);  //二星 后二直选复式
        }
        else if (playID == '10') {
            return calc_2x_q2zuxfs(pickerArr); //二星 后二组选复式
        }
        else if (playID == '11') {
            return calc_2x_h2zuxfs(pickerArr); //二星 后二组选复式
        }
       else if (playID == '12') {
           return calc_dwd_dwd(pickerArr);  //定位胆
       }
        else if (playID == '13') {
            return calc_bdw_1mbdw(pickerArr);  //不定位 一码
        }
        else if (playID == '14') {
            return calc_bdw_2mbdw(pickerArr); //不定位 二码
        }
        else if (playID == '15') {
            return calc_dxds_q2dxds(pickerArr); //大小单双 前二
        }
        else if (playID == '16') {
            return calc_dxds_h2dxds(pickerArr); 	//大小单双 后二
        }
        else if (playID == '17') {
            return calc_dztx(pickerArr);  //对子通选
        }
        else if (playID == '18') {
            return calc_dzdx(pickerArr);  //对子单选
        }
        else if (playID == '19') {
            return calc_sztx(pickerArr);  //顺子通选
        }
        else if (playID == '20') {
            return calc_szdx(pickerArr);  //顺子单选
        }
        else if (playID == '21') {
            return calc_bztx(pickerArr);  //豹子通选
        }
        else if (playID == '22') {
            return calc_bzdx(pickerArr);  //豹子单选
        }
        else if (playID == '23') {
            return calc_lhd(pickerArr); //龙虎斗
        }
        else if (playID == '24') {
            return calc_dw_dxds(pickerArr); //定位大小单双
        }
        else if (playID == '25') {
            return calc_hz_dxds(pickerArr); //总大小单双
		}
		else {
			return 0;  //不符合条件则返回注数0
		}

      }
}

  //三星直选复式
  function calc_3x_zhxfs(balls){
    if(balls.length != 3){
      return 0;
    }
    var ba0 = balls[0].split('|');
    var ba1 = balls[1].split('|');
    var ba2 = balls[2].split('|');
    return ba0.length * ba1.length * ba2.length;
  }

  //三星 直选单式
  function calc_3x_zhxds(ba){
	  // by zh
    if (ba.length < 1) {
      return 0;
	}
	var zhushu = 0;
	var ballArr = [];
    for (var i = 0; i < ba.length; i++) {
      var balls = ba[i].split(/[\|\/]/);
      if (checkArrIs(balls, /^([0-9]|[0][0-9])$/) && balls.length == 3) {
		zhushu++;
		ballArr.push(balls);
      }
    }
    return {zhushu: zhushu, ballArr: ballArr};
  }

	//三星 和值  牛逼的存在
function calc_3x_zhxhz(balls) {
	if (balls.length < 1 || balls[0] == "") {
		return 0;
	} else {
		return balls.length;
	}
}

	//三星 组三复式
 function calc_3x_zu3fs(ba){
		if(ba.length < 2){
			return 0;
		}
		switch(ba.length){
			case 2:
			return 2;
			case 3:
			return 6;
			case 4:
			return 12;
			case 5:
			return 20;
			case 6:
			return 30;
			case 7:
			return 42;
			case 8:
			return 56;
			case 9:
			return 72;
			case 10:
			return 90;
		}
		return 0;
	}

	//三星 组六复式
	function calc_3x_zu6fs(ba){
		if(ba.length < 3){
			return 0;
		}
		switch(ba.length){
			case 3:
			return 1;
			case 4:
			return 4;
			case 5:
			return 10;
			case 6:
			return 20;
			case 7:
			return 35;
			case 8:
			return 56;
			case 9:
			return 84;
			case 10:
			return 120;
		}
		return 0;
	}

	//三星 组三和值
function calc_3x_zu3hz(ba) {
	if (ba.length < 1 || ba[0] == "") {
		return 0;
	} else {
		return ba.length;
	}
}

	//三星 组六和值
function calc_3x_zu6hz(ba) {
	if (ba.length < 1 || ba[0] == "") {
		return 0;
	} else {
		return ba.length;
	}
}

	//二星  前二直选复式
	function calc_2x_q2zhxfs(ba){
		// console.log(ba);
		if(ba.length != 2){
			return 0;
		}
		var ba0 = ba[0].split('|');
		var ba1 = ba[1].split('|');
		return ba0.length * ba1.length;
	}

	//二星 后二直选复式
	function calc_2x_h2zhxfs(ba){
		if(ba.length != 2){
			return 0;
		}
		var ba0 = ba[0].split('|');
		var ba1 = ba[1].split('|');
		return ba0.length * ba1.length;
	}

	//二星 前二组选复式
	function calc_2x_q2zuxfs(ba){
		if(ba.length < 2){
			return 0;
		}
		switch(ba.length){
			case 2:
			return 1;
			case 3:
			return 3;
			case 4:
			return 6;
			case 5:
			return 10;
			case 6:
			return 15;
			case 7:
			return 21;
			case 8:
			return 28;
			case 9:
			return 36;
			case 10:
			return 45;
		}
		return 0;
	}

	//二星 后二组选复式
	function calc_2x_h2zuxfs(ba){
		if(ba.length < 2){
			return 0;
		}
		switch(ba.length){
			case 2:
			return 1;
			case 3:
			return 3;
			case 4:
			return 6;
			case 5:
			return 10;
			case 6:
			return 15;
			case 7:
			return 21;
			case 8:
			return 28;
			case 9:
			return 36;
			case 10:
			return 45;
		}
		return 0;
	}

	//定位胆
	function calc_dwd_dwd(ba){
		if(ba.length < 2){
			return 0;
		}
		var num = 0;
		for (var i = 1; i < ba.length; i++) {
			var len = ba[i].split('|');
			if (checkArrIs(len, /^([0-9]|[0][0-9])$/)) {
				num += len.length;
			}
		}
		return num;
	}

	//不定位 一码
 function calc_bdw_1mbdw(ba){
		if(ba.length < 1 || ba[0] == ""){
			return 0;
		}else{
			return ba.length;
		}
	}

	//不定位 二码
	function calc_bdw_2mbdw(ba){
		if(ba.length < 2){
			return 0;
		}
		switch(ba.length){
			case 2:
			return 1;
			case 3:
			return 3;
			case 4:
			return 6;
			case 5:
			return 10;
			case 6:
			return 15;
			case 7:
			return 21;
			case 8:
			return 28;
			case 9:
			return 36;
			case 10:
			return 45;
		}
		return 0;
	}

	//大小单双 前二
	function calc_dxds_q2dxds(ba){
		if(ba.length != 2){
			return 0;
		}else{
			var ba0 = ba[0].split('|');
			var ba1 = ba[1].split('|');
			return ba0.length * ba1.length;
		}
	}

	//大小单双 后二
	function calc_dxds_h2dxds(ba){
		if(ba.length != 2){
			return 0;
		}else{
			var ba0 = ba[0].split('|');
			var ba1 = ba[1].split('|');
			return ba0.length * ba1.length;
		}
	}

	//对子通选
	function calc_dztx(ba){
		if (ba.length < 1 || ba[0] == "") {
			return 0;
		}else{
			return 1;
		}
	}

	//对子单选
	function calc_dzdx(ba){
		if (ba.length < 1 || ba[0] == "") {
			return 0;
		} else{
			return ba.length;
		}
	}

	//顺子通选
	function calc_sztx(ba){
		// console.log(ba);
		if (ba.length < 1 || ba[0] == "") {
			return 0;
		} else{
			return 1;
		}
	}

	//顺子单选
 function calc_szdx(ba){
		if(ba.length < 1 || ba[0] == ""){
			return 0;
		}else{
			return ba.length;
		}
	}

	//豹子通选
	function calc_bztx(ba){
		if(ba.length < 1 || ba[0] === ""){
			return 0;
		}else{
			return 1;
		}
	}

	//豹子单选
	function calc_bzdx(ba){
		if (ba.length < 1 || ba[0] == "") {
			return 0;
		} else{
			return ba.length;
		}
	}

	//龙虎斗
	function calc_lhd(ba){
		if(ba.length < 1 || ba[0] == ""){
			return 0;
		}else{
			return ba.length;
		}
		return 0;
	}

	//定位大小单双
  function calc_dw_dxds(ba){
		if (ba.length < 2 || ba[1] == "") {
			return 0;
		} else{
			var zhushu = 0;
			for (var i = 1, len = ba.length; i < len ; i += 1) {
				var res_balls = ba[i].split("|");
				zhushu += res_balls.length;
			}
			return zhushu;
		}
		return 0;
	}

	//总大小单双
	function calc_hz_dxds(ba){
		if (ba.length < 1 || ba[0] == "") {
			return 0;
		} else{
			return ba.length;
		}
		return 0;
	}

  function countNum2(num){
  	var result = 0;
  	for(var n = 0; n < 10 && n <= num; n++){
  		for(var k = 0; k < 10 && k <= num; k++){
  			for(var j = 0; j < 10 && j <= num; j++){
  				var count = j+k+n;
  				if(count == num){
  					result++;
  				}
  			}
  		}
  	}
  	return result;
  }

  //封装 组三和值的单个注数计算
  function count_zu3hz(num){

  	switch(num){
  		case 1:
  		case 26:
  		case 3:
  		case 24:
  			return 1;
  			break;
  		case 2:
  		case 25:
  			return 2;
  			break;
  		case 4:
  		case 23:
  		case 5:
  		case 22:
  		case 6:
  		case 21:
  			return 3;
  			break;
  		case 7:
  		case 20:
  		case 9:
  		case 18:
  		case 12:
  		case 15:
  			return 4;
  			break;
  		case 8:
  		case 19:
  		case 10:
  		case 17:
  		case 11:
  		case 16:
  		case 13:
  		case 14:
  			return 5;
  			break;
  	}
  	return 0;
  }

  //组六 单个值的注数计算
  function count_zu6hz(num){
  	switch(num){
  		case 3:
  		case 4:
  		case 23:
  		case 24:
  			return 1;
  			break;
  		case 5:
  		case 22:
  			return 2;
  			break;
  		case 6:
  		case 21:
  			return 3;
  			break;
  		case 7:
  		case 20:
  			return 4;
  			break;
  		case 8:
  		case 19:
  			return 5;
  			break;
  		case 9:
  		case 18:
  			return 7;
  			break;
  		case 10:
  		case 17:
  			return 8;
  			break;
  		case 11:
  		case 16:
  			return 9;
  			break;
  		case 12:
  		case 13:
  		case 14:
  		case 15:
  			return 10;
  			break;
  	}
  	return 0;
  }

	// 龙虎斗
	function calc_longhu (ba) {
		// by zhang
		for (var i = 0; i < ba.length; i++) {
			if (ba[i].length != 2 || !checkArrIs(ba[i], /^([0-9])$/)) {
				return 0;
			}
		}
		return ba.length;
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