
/**
	Created by Money on 2018/08/12
	七星彩注数计算
*/

export default {

	getQXCNumMethod(playid, pickerArr) {

		if (playid == 1) {
			return calc_ydws(pickerArr);  // 一定位

		} else if (playid == 2) {
			return calc_r2_zxfs(pickerArr); // 二定复式

		} else if (playid == 3) {
			return calc_r3_zxfs(pickerArr); // 三定复式

		} else if (playid == 4) {
			return calc_r4_zxfs(pickerArr); // 四定复式

		} else if (playid == 5) {
			return calc_2zxs(pickerArr);  // 二字现

		} else if (playid == 6) {
			return calc_3zxs(pickerArr);  // 三字现

		} else if (playid == 7) {
			return calc_hzzxs(pickerArr);   // 和值组选 / 类似双面盘下注

		} else if (playid == 8) {
			return calc_dwdxds(pickerArr);   // 定位大小单双

		} else if (playid == 9) {
			return calc_q2dxds(pickerArr);  // 前二大小单双

		} else if (playid == 10) {
			return calc_q3dxds(pickerArr);  // 前三大小单双

		} else if (playid == 11) {
			return calc_h2dxds(pickerArr);  // 后二大小单双

		} else if (playid == 12) {
			return calc_h3dxds(pickerArr);  // 后三大小单双

		} else {
			return 0;
		}

	}
}

// 一定位胆
function calc_ydws(ba) {
	if (ba.length < 2) {
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

// 二定 直选复式
function calc_r2_zxfs(ba) {
	var len = ba.length;
	if (len < 3) return 0;

	var a = 0, b = 0, c = 0, d = 0;
	if (ba[1]) {
		var res = ba[1].split(/[\|\/]/);
		if (checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			a = res.length;
		}
	}
	if (ba[2]) {
		var res = ba[2].split(/[\|\/]/);
		if (checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			b = res.length;
		}
	}
	if (ba[3]) {
		var res = ba[3].split(/[\|\/]/);
		if (checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			c = res.length;
		}
	}
	if (ba[4]) {
		var res = ba[4].split(/[\|\/]/);
		if (checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			d = res.length;
		}
	}

	return a * (b + c + d) + b * (c + d) + c * d;
}


// 三定 直选复式
function calc_r3_zxfs(ba) {
	var len = ba.length;
	if (len < 4) { return 0; }
	var a = 0, b = 0, c = 0, d = 0;
	if (ba[1]) {
		var res = ba[1].split(/[\|\/]/);
		if (checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			a = res.length;
		}
	}
	if (ba[2]) {
		var res = ba[2].split(/[\|\/]/);
		if (checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			b = res.length;
		}
	}
	if (ba[3]) {
		var res = ba[3].split(/[\|\/]/);
		if (checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			c = res.length;
		}
	}
	if (ba[4]) {
		var res = ba[4].split(/[\|\/]/);
		if (checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			d = res.length;
		}
	}

	return a * b * (c + d) + a * c * d + b * c * d;
}

// 四定 直选复式
function calc_r4_zxfs(ba) {
	var len = ba.length;
	if (len < 5) { return 0; }

	var a = 0, b = 0, c = 0, d = 0;
	if (ba[1]) {
		var res = ba[1].split(/[\|\/]/);
		if (checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			a = res.length;
		}
	}
	if (ba[2]) {
		var res = ba[2].split(/[\|\/]/);
		if (checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			b = res.length;
		}
	}
	if (ba[3]) {
		var res = ba[3].split(/[\|\/]/);
		if (checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			c = res.length;
		}
	}
	if (ba[4]) {
		var res = ba[4].split(/[\|\/]/);
		if (checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			d = res.length;
		}
	}
	return a * b * c * d;
}


// 二字现
function calc_2zxs(ba) {
	if (ba.length < 2 || !checkArrIs(ba, /^([0-9]|[0][0-9])$/)) {
		return 0;
	}
	switch (ba.length) {
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
}

// 三字现
function calc_3zxs(ba) {
	if (ba.length < 3 || !checkArrIs(ba, /^([0-9]|[0][0-9])$/)) {
		return 0;
	}
	switch (ba.length) {
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
}

// 和值组选
function calc_hzzxs(balls) {
	return balls.length;
}   

// 定位大小单双
function calc_dwdxds(ba) {
	if (ba.length < 2) {
		return 0;
	}
	var num = 0;
	for (var i = 1; i < ba.length; i++) {
		var len = ba[i].split('|');
		if (checkArrIs(len, /^([0-3])$/)) {
			num += len.length;
		}
	}
	return num;
}

// 前二大小单双
function calc_q2dxds(balls) {
	if (balls.length != 2) {
		return 0;
	}
	var ba0 = balls[0].split('|');
	var ba1 = balls[1].split('|');
	return ba0.length * ba1.length;
}

// 前三大小单双
function calc_q3dxds(balls) {
	if (balls.length != 3) {
		return 0;
	}
	var ba0 = balls[0].split('|');
	var ba1 = balls[1].split('|');
	var ba2 = balls[2].split('|');
	return ba0.length * ba1.length * ba2.length;
}

// 后二大小单双
function calc_h2dxds(balls) {
	if (balls.length != 2) {
		return 0;
	}
	var ba0 = balls[0].split('|');
	var ba1 = balls[1].split('|');
	return ba0.length * ba1.length;
}

// 后三大小单双
function calc_h3dxds(balls) {
	if (balls.length != 3) {
		return 0;
	}
	var ba0 = balls[0].split('|');
	var ba1 = balls[1].split('|');
	var ba2 = balls[2].split('|');
	return ba0.length * ba1.length * ba2.length;
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