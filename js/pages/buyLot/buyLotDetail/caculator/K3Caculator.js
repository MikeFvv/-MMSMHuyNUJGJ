/**
    Author Ward
    Created by on 2017-10-05
    dec 用于快三注数计算的JS文件
**/

export default {

	getK3NumMethod(playid, pickerArr) {

		if (playid == '1') {
			return calc_sum(pickerArr); // 和值
		}
		else if (playid == '2') {
			return calc_3thtx(pickerArr); // 三同号 通选
		}
		else if (playid == '3') {
			return calc_3thdx(pickerArr); // 三同号 单选
		}
		else if (playid == '4') {
			return calc_3bthbz(pickerArr); // 三不同号 标准
		}
		else if (playid == '5') {
			return calc_3bthdt(pickerArr); // 三不同号 胆拖
		}
		else if (playid == '6') {
			return calc_3lhtx(pickerArr); // 三连号 通选
		}
		else if (playid == '7') {
			return calc_2thfx(pickerArr); // 二同号 复选
		}
		else if (playid == '8') {
			return calc_2thdx(pickerArr); // 二同号 单选
		}
		else if (playid == '9') {
			return calc_2bthbz(pickerArr);  // 二不同号 标准
		}
		else if (playid == '10') {
			return calc_2bthdt(pickerArr); // 二不同号 胆拖
		}
		else if (playid == '13') {
			return calc_rx1m(pickerArr); //任选一
		}
		else if (playid == '12') {
			return calc_hz_dxds(pickerArr); //和值大小单双
		}
		else if (playid == 'calc_dwdxds') {
			return calc_dwdxds(pickerArr); // 定位大小单双
		}
		else {
			return 0;
		}
	}
}


// 和值
function calc_sum(ba) {
	if (ba.length < 1 || ba[0] == "") {
		return 0;
	}
	return ba.length;
}

// 三同号 通选
function calc_3thtx(ba) {
	if (ba.length < 1 || ba[0] == "") {
		return 0;
	}
	return ba.length;
}

// 三同号 复选
function calc_3thdx(ba) {
	if (ba.length < 1 || ba[0] == "") {
		return 0;
	}
	return ba.length;
}

// 三不同号 标准
function calc_3bthbz(ba) {
	var len = ba.length;
	if (len < 3) { return 0; }
	switch (len) {
		case 3: return 1;
		case 4: return 4;
		case 5: return 10;
		case 6: return 20;
	}
}

// 三不同号 胆拖
function calc_3bthdt(ba) {
	if (ba.length < 2 || ba[1] == "") {
		return 0;
	}
	var danma = ba[0].split("|");		// 胆码
	var tuoma = ba[1].split("|");		// 拖码
	if (!checkArrIs(danma, /[1-6]/) || !checkArrIs(tuoma, /[1-6]/)) {
		return 0;
	}
	if (danma.length == 2) {
		return tuoma.length;
	} else if (danma.length == 1) {
		var n = tuoma.length;
		return n * ((n - 1) / 2);
	}
	return 0;
}

// 三连号 通选
function calc_3lhtx(ba) {
	if (ba.length < 1 || ba[0] == "") {
		return 0;
	}
	return ba.length;
}

// 二同号 复选
function calc_2thfx(ba) {
	if (!checkArrIs(ba, /[1-6]/)) {
		return 0;
	}
	return ba.length;
}

// 二同号 单选
function calc_2thdx(ba) {
	if (ba.length < 2) {
		return 0;
	}

	var tonghao = ba[0].split("|");
	if (!checkArrIs(tonghao, /[1-6]/)) {
		return 0;
	}

	var th_length = tonghao.length;
	var btonghao = ba[1].split("|");
	if (!checkArrIs(btonghao, /[1-6]/)) {
		return 0;
	}
	var bth_length = btonghao.length;
	return th_length * bth_length;
}

// 二不同号 标准
function calc_2bthbz(ba) {
	if (!checkArrIs(ba, /[1-6]/)) {
		return 0;
	}
	var len = ba.length;
	if (len < 2) { return 0; }
	return len * ((len - 1) / 2);
}

// 二不同号 胆拖
function calc_2bthdt(ba) {
	if (ba.length < 2) {
		return 0;
	}
	var ba0 = ba[0].split("|");
	if (!checkArrIs(ba0, /^[1-6]$/)) {
		return 0;
	}
	var ba1 = ba[1].split("|");
	if (!checkArrIs(ba1, /^[1-6]$/)) {
		return 0;
	}
	return ba1.length;
}

//任选一
function calc_rx1m(ba) {
	if (ba.length < 1) {
		return 0;
	} else {
		return ba.length;
	}
}

//总大小单双
function calc_hz_dxds(ba) {
	if (ba.length < 1 || ba[0] == "") {
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

// 定位大小单双
function calc_dwdxds(ba) {
	if (ba.length != 3) {
		return 0;
	}
	var zhushu = 0;
	for (var i = 0; i < ba.length; i++) {
		if (ba[i] != "?") {
			var res = ba[i].split(/[\|\/]/);
			if (checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
				zhushu += res.length;
			}
		}
	}
	return zhushu;
}
