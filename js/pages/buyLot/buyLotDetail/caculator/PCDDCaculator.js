/**
    Author Ward
    Created by on 2017-10-06 15:36
    // 用于PC蛋蛋注数计算的JS文件
**/

export default {

	getPCDDNumMethod(playid, pickerArr) {

		if (playid == '1') {
			return calc_tema(pickerArr); //特码
		}
		else if (playid == '2') {
			return calc_temab3(pickerArr);  //特码包三
		}
		else if (playid == '3') {
			return calc_hh(pickerArr);  // 混合
		}
		else if (playid == 'calc_bs') {
			return calc_bs(pickerArr);  //特码波色
		}
		else if (playid == 'calc_bz') {
			return calc_bz(pickerArr);  //特码豹子
		}
		else if (playid == 'calc_dwd') {
			return calc_dwd(pickerArr);
		}
		else if (playid == 'calc_dw_dxds') {
			return calc_dw_dxds(pickerArr);
		}
		else if (playid == 'calc_tmdxds') {
			return calc_tmdxds(pickerArr);  // 特码大小单双
		}
		else {
			return 0;
		}
	}
}

//特码
function calc_tema(ba) {
	if (ba.length < 1 || !checkArrIs(ba, /[0-9]/)) {
		return 0;
	} else {
		return ba.length;
	}
}

function calc_temab3(ba) {
	if (ba.length < 3 || ba[2] == "") {
		return 0;
	} else {
		return 1;
	}
}

function calc_hh(ba) {
	if (ba.length < 1 || !checkArrIs(ba, /^([0-9]|[0-1][0-4])$/)) {
		return 0;
	} else {
		return ba.length;
	}
}

function calc_bs(ba) {
	if (ba.length < 1 || !checkArrIs(ba, /^([0-2])$/)) {
		return 0;
	} else {
		return ba.length;
	}
}

function calc_bz(ba) {
	if (parseInt(ba[0]) == 0) {
		return 1;
	} else {
		return 0;
	}
}

function calc_dwd(ba) {
	if (ba.length < 2) {
		return 0;
	} else {
		var zhushu = 0;
		for (var i = 1, len = ba.length; i < len; i += 1) {
			var res = ba[i].split("|");
			if (checkArrIs(res, /^([0-9])$/)) {
				zhushu += res.length;
			}
		}
		return zhushu;
	}
	return 0;
}

function calc_dw_dxds(ba) {
	if (ba.length < 2) {
		return 0;
	} else {
		var zhushu = 0;
		for (var i = 1, len = ba.length; i < len; i += 1) {
			var res = ba[i].split("|");
			if (checkArrIs(res, /^([0-3])$/)) {
				zhushu += res.length;
			}
		}
		return zhushu;
	}
	return 0;
}

function calc_tmdxds(ba) {
	if (ba.length < 1) {
		return 0;
	} else {
		return ba.length;
	}
}

// 判断数组元素是否都为一种格式
function checkArrIs(_arr, preg) {
	for (var k in _arr) {
		if (!preg.test(_arr[k])) {
			return false;
		}
	}
	return true;
}
