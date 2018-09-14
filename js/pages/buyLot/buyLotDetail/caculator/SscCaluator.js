
/**
    Author Ward
    Created by on 2017-10-04
    dec 用于时时彩注数计算的JS文件
		//***** 注意 contains 函数是自己定义的方法 *****
**/

export default {

	getSSCNumberMethod(playid, pickerArr) {

		if (playid == '1') {
			return calc_5x_zxfs(pickerArr); //五星直选复式
		}
		else if (playid == '2') {
			return calc_5x_zxds(pickerArr); // 五星直选单式
		}
		else if (playid == '82') {
			return calc_5x_zxzh(pickerArr);  // 五星直选组合
		}
		else if (playid == '83') {
			return calc_5x_zx120(pickerArr); 	//五星组选120
		}
		else if (playid == '84') {
			return calc_5x_zx60(pickerArr);  //五星 组选60
		}
		else if (playid == '85') {
			return calc_5x_zx30(pickerArr); //五星组选30
		}
		else if (playid == '86') {
			return calc_5x_zx20(pickerArr); //五星组选20
		}
		else if (playid == '87') {
			return calc_5x_zx10(pickerArr); //五星组选10
		}
		else if (playid == '88') {
			return calc_5x_zx5(pickerArr); //五星组选5
		}
		else if (playid == '3' || playid == '94') {
			return calc_4x_zxfs(pickerArr); // 四星 后|前直选复式
		}
		else if (playid == '4' || playid == '95') {
			return calc_4x_zxds(pickerArr); // 四星 后|前直选单式
		}
		else if (playid == '89' || playid == '96') {
			return calc_4x_zxzh(pickerArr);  // 四星 后|前 组合
		}
		else if (playid == '90' || playid == '97') {
			return calc_4x_zx24(pickerArr); // 四星 后|前组选24
		}
		else if (playid == '91' || playid == '98') {
			return calc_4x_zx12(pickerArr); //四星 后|前组选12
		}
		else if (playid == '92' || playid == '99') {
			return calc_4x_zx6(pickerArr); //四星 后|前组选6
		}
		else if (playid == '93' || playid == '100') {
			return calc_4x_zx4(pickerArr); //四星 后|前组选4
		}
		else if (playid == '5' || playid == '19' || playid == '101') {
			return calc_h3_zxfs(pickerArr); // 后|前|中三直选复式
		}
		else if (playid == '6' || playid == '20' || playid == '102') {
			return calc_h3_zxds(pickerArr); //后|前|中三直选单式
		}
		else if (playid == '7' || playid == '21' || playid == '103') {
			return calc_h3_zh(pickerArr); // 后|前|中三组合
		}
		else if (playid == '8' || playid == '22' || playid == '104') {
			return calc_h3_zxhz(pickerArr); //后|前|中三直选和值
		}
		else if (playid == '9' || playid == '23' || playid == '105') {
			return calc_h3_zxkd(pickerArr); //后|前|中三直选跨度
		}
		else if (playid == '10' || playid == '24' || playid == '106') {
			return calc_h3_z3fs(pickerArr); //后|前|中三组三复式
		}
		else if (playid == '11' || playid == '25' || playid == '107') {
			return calc_h3_z3ds(pickerArr); //后|前|中三组三单式
		}
		else if (playid == '12' || playid == '26' || playid == '108') {
			return calc_h3_z6fs(pickerArr); //后|前|中三组六复式
		}
		else if (playid == '13' || playid == '27' || playid == '109') {
			return calc_h3_z6ds(pickerArr); //后|前|中三组六单式
		}
		else if (playid == 'calc_h3_zuxhz') {
			return calc_h3_zuxhz(pickerArr); //后三组选和值
		}
		else if (playid == '16' || playid == '30' || playid == '112') {
			return calc_h3_zuxbd(pickerArr); //后|前|中三组选包胆
		}
		else if (playid == '17' || playid == '31' || playid == '113') {
			return calc_h3_sumws(pickerArr); //后|前|中三和值尾数
		}
		else if (playid == '18' || playid == '32' || playid == '114') {
			return calc_h3_tsh(pickerArr); //后|前|中三特殊号
		}
		else if (playid == '115' || playid == '33') {
			return calc_q2_zxfs(pickerArr); // 后|前二直选复式
		}
		else if (playid == '116' || playid == '34') {
			return calc_q2_zxds(pickerArr); //后|前二直选单式
		}
		else if (playid == '117' || playid == '35') {
			return calc_q2_zhxhz(pickerArr); // 后|前二直选和值
		}
		else if (playid == '118' || playid == '36') {
			return calc_q2_zxkd(pickerArr); // 后|前二直选跨度
		}
		else if (playid == '119' || playid == '37') {
			return calc_q2_zuxfs(pickerArr); // 后|前二组选复式
		}
		else if (playid == '120' || playid == '38') {
			return calc_q2_zuxds(pickerArr); //后|前二组选单式
		}
		else if (playid == '121' || playid == '39') {
			return calc_q2_zuxhz(pickerArr); // 后|前二组选和值
		}
		else if (playid == '122' || playid == '40') {
			return calc_q2_zuxbd(pickerArr); // 后|前二组选包胆
		}
		else if (playid == '41') {
			return calc_dwd(pickerArr); // 定位胆
		}
		else if (playid == '42' || playid == '44' || playid == '46' || playid == '48' || playid == '50') {
			return calc_bdw_31m(pickerArr);  //不定位- 前|后 三|四|五 一码
		}
		else if (playid == '43' || playid == '45' || playid == '47' || playid == '49' || playid == '51') {
			return calc_bdw_32m(pickerArr);  //不定位-前|后 三|四|五 二码
		}
		else if (playid == '52') {
			return calc_bdw_33m(pickerArr);  //不定位-五星三码
		}
		else if (playid == '53') {
			return calc_q2_dxds(pickerArr);  //前二大小单双
		}
		else if (playid == '54') {
			return calc_h2_dxds(pickerArr);  //后二大小单双
		}
		else if (playid == '55') {
			return calc_q3_dxds(pickerArr);  //前三大小单双
		}
		else if (playid == '56') {
			return calc_h3_dxds(pickerArr);  //后三大小单双
		}
		else if (playid == '57') {
			return calc_r2_zxfs(pickerArr); //任二直选复式
		}
		else if (playid == 'calc_r2_zxds') {
			return calc_r2_zxds(pickerArr); //任二直选单式
		}
		else if (playid == '59') {
			return calc_r2_zxhz(pickerArr); //任二直选和值
		}
		else if (playid == '60') {
			return calc_r2_zuxfs(pickerArr); //任二组选复式
		}
		else if (playid == 'calc_r2_zuxds') {
			return calc_r2_zuxds(pickerArr); //任二直选单式
		}
		else if (playid == '62') {
			return calc_r2_zuxhz(pickerArr); //任二直选和值
		}
		else if (playid == '63') {
			return calc_r3_zxfs(pickerArr); //任三直选复式
		}
		else if (playid == 'calc_r3_zxds') {
			return calc_r3_zxds(pickerArr); //任三直选单式
		}
		else if (playid == '65') {
			return calc_r3_zxhz(pickerArr); //任三直选和值
		}
		else if (playid == '66') {
			return calc_r3_zu3fs(pickerArr); //任三组三复式
		}
		else if (playid == 'calc_r3_zu3ds') {
			return calc_r3_zu3ds(pickerArr); //任三组三单式
		}
		else if (playid == '68') {
			return calc_r3_zu6fs(pickerArr); //任三组六复式
		}
		else if (playid == 'calc_r3_zu6ds') {
			return calc_r3_zu6ds(pickerArr); //任三组六单式
		}
		else if (playid == 'calc_r3_hhzx') {
			return calc_r3_hhzx(pickerArr); 
		}
		else if (playid == '71') {
			return calc_r3_zuxhz(pickerArr); //任三组三组选和值
		}
		else if (playid == '72') {
			return calc_r4_zxfs(pickerArr); //任四直选复式
		}
		else if (playid == '73') {
			return calc_r4_zxds(pickerArr); //任四直选单式
		}
		else if (playid == '74') {
			return calc_r4_zux24(pickerArr); //任四组选24
		}
		else if (playid == '75') {
			return calc_r4_zux12(pickerArr); //任四组选12
		}
		else if (playid == '76') {
			return calc_r4_zux6(pickerArr); //任四组选6
		}
		else if (playid == '77') {
			return calc_r4_zux4(pickerArr); //任四组选4
		}
		else if (playid == '79') {
			return calc_dw_dxds(pickerArr); // 定位大小单双
		}
		else if (playid == '80') {
			return calc_cfzz(pickerArr);  // 大小PK
		}
		else if (playid == 'calc_sqzp') {
			return calc_sqzp(pickerArr);
		}
		else if (playid == '123') {
			return calc_qw_yffs(pickerArr); // 趣味 一帆风顺
		}
		else if (playid == '124') {
			return calc_qw_hscs(pickerArr);  // 趣味 好事成双
		}
		else if (playid == '125') {
			return calc_qw_sykt(pickerArr);  // 趣味 三羊开泰
		}
		else if (playid == '126') {
			return calc_qw_sjfc(pickerArr);  // 趣味 四季发财
		}
		else if (playid == '127') {
			return calc_qw_wgfd(pickerArr);  // 趣味 五谷丰登
		}
		else if (playid == '78') {
			return calc_hzdxds(pickerArr); // 和值大小单双
		}
		else if (playid == '129') {
			return calc_longhu(pickerArr); // 龙虎斗
		}
		else if (playid == 'calc_interest') {
			return calc_interest(pickerArr); // 趣味
		}
		else if (playid == '131') {
			return calc_niunius(pickerArr);  // 牛牛
		}
		else {
			return 0;
		}
	}
}

// 五星直选复式
function calc_5x_zxfs(ba) {
	if (ba.length != 5) {
		return 0;
	}
	var num = [];
	for (var i = 0; i < ba.length; i++) {
		var res = ba[i].split("|");
		if (checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			num[i] = res.length;
		} else {
			return 0;
		}
	}
	return num[0] * num[1] * num[2] * num[3] * num[4];
}

// 五星直选单式
function calc_5x_zxds(ba) {
	var zhushu = 0;
	var ballArr = [];
	for (var i = 0; i < ba.length; i++) {
		var res = ba[i].split(/[\|\/]/);
		if (checkArrIs(res, /^([0-9]|[0][0-9])$/) && res.length == 5) {
			zhushu++;
			ballArr.push(res);
		}
	}
	return {zhushu: zhushu, ballArr: ballArr};
}

/* start at 2017-07-10 am */
// 五星直选组合
function calc_5x_zxzh(ba) {
	if (ba.length !== 5) {
		return 0;
	}
	var zhushu = 5;
	var temp_arr = [];
	for (var i = 0; i < 5; i += 1) {
		var res = ba[i].split("|");
		if (!checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			return 0;
		}
		temp_arr.push(res.length);
	}
	return zhushu * temp_arr[0] * temp_arr[1] * temp_arr[2] * temp_arr[3] * temp_arr[4];
}

//五星组选120
function calc_5x_zx120(ba) {
	if (ba.length < 5 || !checkArrIs(ba, /^([0-9]|[0][0-9])$/)) {
		return 0;
	}
	switch (ba.length) {
		case 5:
			return 1;
			break;
		case 6:
			return 6;
			break;
		case 7:
			return 21;
			break;
		case 8:
			return 56;
			break;
		case 9:
			return 126;
			break;
		case 10:
			return 252;
			break;
		default:
			return 0;
			break;
	}
	return 0;
}

//五星 组选60
function calc_5x_zx60(ba) {
	if (ba.length !== 2) {
		return 0;
	}
	var balls1 = ba[0].split("|")
	var balls2 = ba[1].split("|")
	if (!checkArrIs(balls1, /^([0-9]|[0][0-9])$/) || !checkArrIs(balls2, /^([0-9]|[0][0-9])$/)) {
		return 0;
	}
	var zhushu = 0;
	//循环二重号码球
	for (var i = 0; i < balls1.length; i += 1) {
		//判断该二重号是否与单号重复
		var temp_length = 0, sub_zhushu = 0;
		if (contains(balls2, balls1[i])) {
			temp_length = balls2.length - 1;
		} else {
			temp_length = balls2.length;
		}
		//计算单号球个数
		switch (temp_length) {
			case 3:
				sub_zhushu = 1;
				break;
			case 4:
				sub_zhushu = 4;
				break;
			case 5:
				sub_zhushu = 10;
				break;
			case 6:
				sub_zhushu = 20;
				break;
			case 7:
				sub_zhushu = 35;
				break;
			case 8:
				sub_zhushu = 56;
				break;
			case 9:
				sub_zhushu = 84;
				break;
			default:
				sub_zhushu = 0;
				break;
		}
		zhushu += sub_zhushu;
	}
	return zhushu;
}

//五星组选30
function calc_5x_zx30(ba) {
	if (ba.length !== 2) {
		return 0;
	}
	var balls1 = ba[0].split("|")
	var balls2 = ba[1].split("|")
	if (!checkArrIs(balls1, /^([0-9]|[0][0-9])$/) || !checkArrIs(balls2, /^([0-9]|[0][0-9])$/)) {
		return 0;
	}
	var zhushu = 0;
	//循环单号号码球
	for (var i = 0; i < balls2.length; i += 1) {
		var temp_length = 0, sub_zhushu = 0;
		if (contains(balls1, balls2[i])) {
			temp_length = balls1.length - 1;
		} else {
			temp_length = balls1.length;
		}
		//计算双重号号球个数
		switch (temp_length) {
			case 2:
				sub_zhushu = 1;
				break;
			case 3:
				sub_zhushu = 3;
				break;
			case 4:
				sub_zhushu = 6;
				break;
			case 5:
				sub_zhushu = 10;
				break;
			case 6:
				sub_zhushu = 15;
				break;
			case 7:
				sub_zhushu = 21;
				break;
			case 8:
				sub_zhushu = 28;
				break;
			case 9:
				sub_zhushu = 36;
				break;
			default:
				sub_zhushu = 0;
				break;
		}
		zhushu += sub_zhushu;
	}
	return zhushu;
}

//组选20
function calc_5x_zx20(ba) {
	if (ba.length !== 2) {
		return 0;
	}
	var balls1 = ba[0].split("|")
	var balls2 = ba[1].split("|")
	if (!checkArrIs(balls1, /^([0-9]|[0][0-9])$/) || !checkArrIs(balls2, /^([0-9]|[0][0-9])$/)) {
		return 0;
	}
	var zhushu = 0;
	//循环三重号码球
	for (var i = 0; i < balls1.length; i += 1) {
		var temp_length = 0, sub_zhushu = 0;
		if (contains(balls2, balls1[i])) {
			temp_length = balls2.length - 1;
		} else {
			temp_length = balls2.length;
		}
		//计算不同号号球个数
		switch (temp_length) {
			case 2:
				sub_zhushu = 1;
				break;
			case 3:
				sub_zhushu = 3;
				break;
			case 4:
				sub_zhushu = 6;
				break;
			case 5:
				sub_zhushu = 10;
				break;
			case 6:
				sub_zhushu = 15;
				break;
			case 7:
				sub_zhushu = 21;
				break;
			case 8:
				sub_zhushu = 28;
				break;
			case 9:
				sub_zhushu = 36;
				break;
			default:
				sub_zhushu = 0;
				break;
		}
		zhushu += sub_zhushu;
	}
	return zhushu;
}

//五星 组选10
function calc_5x_zx10(ba) {
	if (ba.length !== 2) {
		return 0;
	}
	var balls1 = ba[0].split("|")
	var balls2 = ba[1].split("|")
	if (!checkArrIs(balls1, /^([0-9]|[0][0-9])$/) || !checkArrIs(balls2, /^([0-9]|[0][0-9])$/)) {
		return 0;
	}
	var zhushu = 0;
	for (var i = 0; i < balls1.length; i += 1) {
		if (contains(balls2, balls1[i])) {
			zhushu += balls2.length - 1;
		} else {
			zhushu += balls2.length;
		}
	}
	return zhushu;
}

//五星 组选5
function calc_5x_zx5(ba) {
	if (ba.length !== 2) {
		return 0;
	}
	var balls1 = ba[0].split("|")
	var balls2 = ba[1].split("|")
	if (!checkArrIs(balls1, /^([0-9]|[0][0-9])$/) || !checkArrIs(balls2, /^([0-9]|[0][0-9])$/)) {
		return 0;
	}
	var zhushu = 0;
	for (var i = 0; i < balls1.length; i += 1) {
		if (contains(balls2, balls1[i])) {
			zhushu += balls2.length - 1;
		} else {
			zhushu += balls2.length;
		}
	}
	return zhushu;
}

/* end at 2017-07-10 pm */


// 四星直选复式f
function calc_4x_zxfs(ba) {
	if (ba.length != 4) {
		return 0;
	}
	var num = [];
	for (var i = 0; i < ba.length; i++) {
		var k = ba[i].split("|");
		if (checkArrIs(k, /^([0-9]|[0][0-9])$/)) {
			num[i] = k.length;
		} else {
			return 0;
		}
	}
	return num[0] * num[1] * num[2] * num[3];
}

// 四星直选单式
function calc_4x_zxds(ba) {
	var zhushu = 0;
	var ballArr = [];
	for (var i = 0; i < ba.length; i++) {
		var res = ba[i].split(/[\|\/]/);
		if (checkArrIs(res, /^([0-9]|[0][0-9])$/) && res.length == 4) {
			zhushu++;
			ballArr.push(res);
		}
	}
	return {zhushu: zhushu, ballArr: ballArr};
}

/* start at 2017-07-10 pm */

// 四星直选组合
function calc_4x_zxzh(ba) {
	if (ba.length !== 4) {
		return 0;
	}
	var zhushu = 4;
	var temp_arr = [];
	for (var i = 0; i < 4; i += 1) {
		var res = ba[i].split("|");
		if (!checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			return 0;
		}
		temp_arr.push(res.length);
	}
	return zhushu * temp_arr[0] * temp_arr[1] * temp_arr[2] * temp_arr[3];
}

// 四星组选24
function calc_4x_zx24(ba) {
	var len = ba.length;
	if (len < 4 || !checkArrIs(ba, /^([0-9]|[0][0-9])$/)) {
		return 0;
	}
	switch (len) {
		case 4:
			return 1;
			break;
		case 5:
			return 5;
			break;
		case 6:
			return 15;
			break;
		case 7:
			return 35;
			break;
		case 8:
			return 70;
			break;
		case 9:
			return 126;
			break;
		case 10:
			return 210;
			break;
		default:
			return 0;
			break;
	}
	return 0;
}

//四星 组选12
function calc_4x_zx12(ba) {
	var len = ba.length;
	if (len !== 2) {
		return 0;
	}
	var balls1 = ba[0].split("|");
	var balls2 = ba[1].split("|");
	if (!checkArrIs(balls1, /^([0-9]|[0][0-9])$/) || !checkArrIs(balls2, /^([0-9]|[0][0-9])$/)) {
		return 0;
	}
	var zhushu = 0;
	for (var i = 0; i < balls1.length; i += 1) {
		var temp_len = 0, sub_zhushu = 0;
		if (contains(balls2, balls1[i])) {
			temp_len = balls2.length - 1;
		} else {
			temp_len = balls2.length;
		}
		switch (temp_len) {
			case 2:
				sub_zhushu = 1;
				break;
			case 3:
				sub_zhushu = 3;
				break;
			case 4:
				sub_zhushu = 6;
				break;
			case 5:
				sub_zhushu = 10;
				break;
			case 6:
				sub_zhushu = 15;
				break;
			case 7:
				sub_zhushu = 21;
				break;
			case 8:
				sub_zhushu = 28;
				break;
			case 9:
				sub_zhushu = 36;
				break;
			default:
				sub_zhushu = 0;
				break;
		}
		zhushu += sub_zhushu;
	}
	return zhushu;
}

//四星组选6
function calc_4x_zx6(ba) {
	if (ba.length < 2 || !checkArrIs(ba, /^([0-9]|[0][0-9])$/)) {
		return 0;
	}
	var len = ba.length;
	switch (len) {
		case 2:
			return 1;
			break;
		case 3:
			return 3;
			break;
		case 4:
			return 6;
			break;
		case 5:
			return 10;
			break;
		case 6:
			return 15;
			break;
		case 7:
			return 21;
			break;
		case 8:
			return 28;
			break;
		case 9:
			return 36;
			break;
		case 10:
			return 45;
			break;
		default:
			return 0;
			break;
	}
	return 0;
}

//四星 组选4
function calc_4x_zx4(ba) {
	if (ba.length !== 2) {
		return 0;
	}
	var balls1 = ba[0].split("|");
	var balls2 = ba[1].split("|");
	if (!checkArrIs(balls1, /^([0-9]|[0][0-9])$/) || !checkArrIs(balls2, /^([0-9]|[0][0-9])$/)) {
		return 0;
	}
	var zhushu = 0;
	for (var i = 0; i < balls1.length; i += 1) {
		var sub_zhushu = 0;
		if (contains(balls2, balls1[i])) {
			sub_zhushu = balls2.length - 1;
		} else {
			sub_zhushu = balls2.length;
		}
		zhushu += sub_zhushu;
	}
	return zhushu;
}

/* end at 2017-07-10 pm */

// 三星直选复式
function calc_h3_zxfs(ba) {
	if (ba.length != 3) {
		return 0;
	}
	var num = [];
	for (var i = 0; i < ba.length; i++) {
		var k = ba[i].split("|");
		if (checkArrIs(k, /^([0-9]|[0][0-9])$/)) {
			num[i] = k.length;
		}
	}
	return num[0] * num[1] * num[2];
}

// 三星直选单式
function calc_h3_zxds(ba) {
	var zhushu = 0;
	var ballArr = [];
	for (var i = 0; i < ba.length; i++) {
		var res = ba[i].split(/[\|\/]/);
		if (checkArrIs(res, /^([0-9]|[0][0-9])$/) && res.length == 3) {
			zhushu++;
			ballArr.push(res);
		}
	}
	return {zhushu: zhushu, ballArr: ballArr};
}

// 后三组合
function calc_h3_zh(ba) {
	if (ba.length != 3) {
		return 0;
	}
	var num = [];
	for (var i = 0; i < ba.length; i++) {
		var res = ba[i].split(/[\|\/]/);
		if (checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			num[i] = res.length;
		} else {
			return 0;
		}
	}
	return num[0] * num[1] * num[2] * 3;
}

// 直选和值
function calc_h3_zxhz(ba) {
	var zhushu = 0;
	for (var i = 0; i < ba.length; i++) {
		var value = parseInt(ba[i]);
		if (value >= 0 && value <= 27) {
			var n = 0;
			if (value <= 13) {
				n = value + 2;
			} else if (value > 13) {
				n = 29 - value;
			}
			if (n == 12) {
				zhushu += 63;
			} else if (n == 13) {
				zhushu += 69;
			} else if (n == 14) {
				zhushu += 73;
			} else if (n == 15) {
				zhushu += 75;
			} else {
				zhushu += n * ((n - 1) / 2);
			}
		}
	}
	return zhushu;
}

// 直选跨度
function calc_h3_zxkd(ba) {
	var zhushu = 0;
	for (var i = 0; i < ba.length; i++) {
		var value = parseInt(ba[i]);
		switch (value) {
			case 0:
				zhushu += 10; break;
			case 1:
			case 9:
				zhushu += 54; break;
			case 2:
			case 8:
				zhushu += 96; break;
			case 3:
			case 7:
				zhushu += 126; break;
			case 4:
			case 6:
				zhushu += 144; break;
			case 5:
				zhushu += 150;
		}
	}
	return zhushu;
}

// 组三复式
function calc_h3_z3fs(ba) {
	var n = ba.length;
	var zhushu = 0;
	switch (n) {
		case 2:
			zhushu = 2; break;
		case 3:
			zhushu = 6; break;
		case 4:
			zhushu = 12; break;
		case 5:
			zhushu = 20; break;
		case 6:
			zhushu = 30; break;
		case 7:
			zhushu = 42; break;
		case 8:
			zhushu = 56; break;
		case 9:
			zhushu = 72; break;
		case 10:
			zhushu = 90; break;
	}
	return zhushu;
}

// 组三单式
function calc_h3_z3ds(ba) {
	var zhushu = 0;
	var ballArr = [];
	for (var i = 0; i < ba.length; i++) {
		var res = ba[i].split(/[\|\/]/);
		if (res.length == 3 && checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			if (res[0] == res[1] || res[0] == res[2] || res[1] == res[2]) {
				zhushu++;
				ballArr.push(res);
			}
		}
	}
	return {zhushu: zhushu, ballArr: ballArr};
}

// 组六复式
function calc_h3_z6fs(ba) {
	var n = ba.length;
	switch (n) {
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

// 组六单式
function calc_h3_z6ds(ba) {
	var zhushu = 0;
	var ballArr = [];
	for (var i = 0; i < ba.length; i++) {
		var res = ba[i].split(/[\|\/]/);
		if (res.length == 3 && checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			if (res[0] != res[1] && res[1] != res[2] && res[0] != res[2]) {
				zhushu++;
				ballArr.push(res);
			}
		}
	}
	return {zhushu: zhushu, ballArr: ballArr};
}



// 组选和值
function calc_h3_zuxhz(ba) {
	var zhushu = 0;
	for (var i = 0; i < ba.length; i++) {
		var value = parseInt(ba[i]);
		switch (value) {
			case 1:
			case 26:
				zhushu += 1; break;
			case 2:
			case 3:
			case 24:
			case 25:
				zhushu += 2; break;
			case 4:
			case 23:
				zhushu += 4; break;
			case 5:
			case 22:
				zhushu += 5; break;
			case 6:
			case 21:
				zhushu += 6; break;
			case 7:
			case 20:
				zhushu += 8; break;
			case 8:
			case 19:
				zhushu += 10; break;
			case 9:
			case 18:
				zhushu += 11; break;
			case 10:
			case 17:
				zhushu += 13; break;
			case 11:
			case 12:
			case 16:
			case 15:
				zhushu += 14; break;
			case 13:
			case 14:
				zhushu += 15; break;
		}
	}
	return zhushu;
}

// 组选包胆
function calc_h3_zuxbd(ba) {
	if (ba.length != 1 || !checkArrIs(ba, /^([0-9]|[0][0-9])$/)) {
		return 0;
	}
	return 54;
}

// 和值尾数
function calc_h3_sumws(ba) {
	if (ba.length < 1 || !checkArrIs(ba, /^([0-9]|[0][0-9])$/)) {
		return 0;
	} else {
		return ba.length;
	}
}

// 特殊号
function calc_h3_tsh(ba) {
	if (ba.length < 1 || !checkArrIs(ba, /^([0-2])$/)) {
		return 0;
	}
	return ba.length;
}

// 前二直选复式
function calc_q2_zxfs(ba) {
	if (ba.length != 2) {
		return 0;
	}
	var ba_0 = ba[0].split("|");
	var ba_1 = ba[1].split("|");
	if (checkArrIs(ba_0, /^([0-9]|[0][0-9])$/) && checkArrIs(ba_1, /^([0-9]|[0][0-9])$/)) {
		return ba_0.length * ba_1.length;
	} else {
		return 0;
	}
}

// 前二直选单式
function calc_q2_zxds(ba) {
	var zhushu = 0;
	var ballArr = [];
	for (var i = 0; i < ba.length; i++) {
		var res = ba[i].split(/[\|\/]/);
		if (res.length == 2 && checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			zhushu++;
			ballArr.push(res);
		}
	}
	return {zhushu: zhushu, ballArr: ballArr};
}

// 前二直选和值
function calc_q2_zhxhz(ba) {
	var zhushu = 0;
	for (var i = 0; i < ba.length; i++) {
		var value = parseInt(ba[i]);
		if (value < 10) {
			zhushu += value + 1;
		} else if (value < 19) {
			zhushu += (19 - value);
		}
	}
	return zhushu;
}


// 前二 直选跨度
function calc_q2_zxkd(ba) {
	var zhushu = 0;
	if (!checkArrIs(ba, /^([0-9]|[0][0-9])$/)) {
		return 0;
	}
	for (var i = 0; i < ba.length; i++) {
		var value = parseInt(ba[i]);
		switch (value) {
			case 0:
				zhushu += 10; break;
			case 1:
				zhushu += 18; break;
			case 2:
				zhushu += 16; break;
			case 3:
				zhushu += 14; break;
			case 4:
				zhushu += 12; break;
			case 5:
				zhushu += 10; break;
			case 6:
				zhushu += 8; break;
			case 7:
				zhushu += 6; break;
			case 8:
				zhushu += 4; break;
			case 9:
				zhushu += 2; break;
		}
	}
	return zhushu;
}

// 前二 组选复式
function calc_q2_zuxfs(ba) {
	var count = ba.length;
	if (!checkArrIs(ba, /^([0-9]|[0][0-9])$/)) {
		return 0;
	}
	switch (count) {
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

// 前二 组选单式
function calc_q2_zuxds(ba) {
	var zhushu = 0;
	var ballArr = [];
	for (var i = 0; i < ba.length; i++) {
		var res = ba[i].split(/[\|\/]/);
		if (res.length == 2 && checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			if (res[0] != res[1]) {
				zhushu++;
				ballArr.push(res);
			}
		}
	}
	return {zhushu: zhushu, ballArr: ballArr};
}

// 前二 组选和值
function calc_q2_zuxhz(ba) {
	var zhushu = 0;
	for (var i = 0; i < ba.length; i++) {
		var value = parseInt(ba[i]);
		switch (value) {
			case 1:
			case 2:
			case 16:
			case 17:
				zhushu += 1; break;
			case 3:
			case 4:
			case 14:
			case 15:
				zhushu += 2; break;
			case 5:
			case 6:
			case 12:
			case 13:
				zhushu += 3; break;
			case 7:
			case 8:
			case 10:
			case 11:
				zhushu += 4; break;
			case 9:
				zhushu += 5; break;
		}
	}
	return zhushu;
}

// 前二 组选包胆
function calc_q2_zuxbd(ba) {
	if (ba.length != 1 || !checkArrIs(ba, /^([0-9]|[0][0-9])$/)) {
		return 0;
	} else {
		return 9;
	}
}

// 定位胆
function calc_dwd(ba) {
	if (ba.length < 2) {
		return 0;
	}
	var zhushu = 0;
	for (var i = 1; i < ba.length; i++) {
		var res = ba[i].split(/[\|\/]/);
		if (checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			zhushu += res.length;
		}
	}
	return zhushu;
}

// 三星 不定位 3中1码
function calc_bdw_31m(ba) {
	if (ba.length < 1 || !checkArrIs(ba, /^([0-9]|[0][0-9])$/)) {
		return 0;
	} else {
		return ba.length;
	}
}

// 三星 不定位 3中2码
function calc_bdw_32m(ba) {
	if (!checkArrIs(ba, /^([0-9]|[0][0-9])$/)) {
		return 0;
	}
	var n = ba.length;
	return n * ((n - 1) / 2);
}
// 三星 不定位 3中3码
function calc_bdw_33m(ba) {
	if (!checkArrIs(ba, /^([0-9]|[0][0-9])$/)) {
		return 0;
	}
	var n = ba.length;
	switch (n) {
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

// 前二 大小单双
function calc_q2_dxds(ba) {
	if (ba.length != 2) {
		return 0;
	}
	var zhushu = 1;
	for (var i = 0; i < ba.length; i++) {
		var res = ba[i].split(/[\|\/]/);
		if (checkArrIs(res, /[0-3]/)) {
			zhushu *= res.length;
		} else {
			return 0;
		}
	}
	return zhushu;
}

// 后二 大小单双
function calc_h2_dxds(ba) {
	if (ba.length != 2) {
		return 0;
	}
	var zhushu = 1;
	for (var i = 0; i < ba.length; i++) {
		var res = ba[i].split(/[\|\/]/);
		if (checkArrIs(res, /[0-3]/)) {
			zhushu *= res.length;
		} else {
			return 0;
		}
	}
	return zhushu;
}

// 前三 大小单双
function calc_q3_dxds(ba) {
	if (ba.length != 3) {
		return 0;
	}
	var zhushu = 1;
	for (var i = 0; i < ba.length; i++) {
		var res = ba[i].split(/[\|\/]/);
		if (checkArrIs(res, /[0-3]/)) {
			zhushu *= res.length;
		} else {
			return 0;
		}
	}
	return zhushu;
}

// 后三 大小单双
function calc_h3_dxds(ba) {
	if (ba.length != 3) {
		return 0;
	}
	var zhushu = 1;
	for (var i = 0; i < ba.length; i++) {
		var res = ba[i].split(/[\|\/]/);
		if (checkArrIs(res, /[0-3]/)) {
			zhushu *= res.length;
		} else {
			return 0;
		}
	}
	return zhushu;
}

// 任二 直选复式
function calc_r2_zxfs(ba) {
	// console.log(ba);
	var len = ba.length;
	if (len < 3) return 0;

	var a = 0, b = 0, c = 0, d = 0, e = 0;
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
	if (ba[5]) {
		var res = ba[5].split(/[\|\/]/);
		if (checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			e = res.length;
		}
	}
	return a * (b + c + d + e) + b * (c + d + e) + c * (d + e) + d * e;
}

// 任二 直选单式
function calc_r2_zxds(ba) {
	var zhushu = 0;
	if (ba.length < 2) {
		return 0;
	}
	for (var i = 1; i < ba.length; i++) {
		var res = ba[i].split(/[\|\/]/);
		if (res.length == 2 && checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			zhushu++;
		}
	}
	return zhushu * pos_count;
}

// 任二 直选和值
function calc_r2_zxhz(ba) {
	let pos_count = ba[0]; // 截第一位出来。
	ba.splice(0, 1); // 干掉第一位。

	var zhushu = 0;
	if (ba.length < 2) {
		return 0;
	}
	for (var i = 1; i < ba.length; i++) {
		var sub_arr = [ba[i]];
		if (!checkArrIs(sub_arr, /^(([0-9]|[1][0-8])|([0][0-9]))$/)) {
			return 0;
		}
		var value = parseInt(ba[i]);
		switch (value) {
			case 0:
			case 18:
				zhushu += 1; break;
			case 1:
			case 17:
				zhushu += 2; break;
			case 2:
			case 16:
				zhushu += 3; break;
			case 3:
			case 15:
				zhushu += 4; break;
			case 4:
			case 14:
				zhushu += 5; break;
			case 5:
			case 13:
				zhushu += 6; break;
			case 6:
			case 12:
				zhushu += 7; break;
			case 7:
			case 11:
				zhushu += 8; break;
			case 8:
			case 10:
				zhushu += 9; break;
			case 9:
				zhushu += 10; break;
		}
	}
	return zhushu * pos_count;
}

// 任二 组选复式
function calc_r2_zuxfs(ba) {
	let pos_count = ba[0]; // 截第一位出来。
	ba.splice(0, 1); // 干掉第一位。

	var zhushu = 0;
	if (ba.length < 3) {
		return 0;
	}

	for (var i = 1; i < ba.length; i++) {
		var value = parseInt(ba[i]);
		if (value >= 0 && value <= 9) {
			zhushu++;
		}
	}
	return zhushu * ((zhushu - 1) / 2) * pos_count;
}

// 任二 组选单式
function calc_r2_zuxds(ba) {
	var zhushu = 0;
	if (ba.length < 2) {
		return 0;
	}
	for (var i = 1; i < ba.length; i++) {
		var res = ba[i].split(/[\|\/]/);
		if (res.length == 2 && checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			if (res[0] !== res[1]) {
				zhushu++;
			}
		}
	}
	return zhushu * pos_count;
}

// 任二 组选和值
function calc_r2_zuxhz(ba) {
	let pos_count = ba[0]; // 截第一位出来。
	ba.splice(0, 1); // 干掉第一位。

	var zhushu = 0;
	if (ba.length < 2) {
		return 0;
	}
	for (var i = 1; i < ba.length; i++) {
		var value = parseInt(ba[i]);
		switch (value) {
			case 1:
			case 2:
			case 16:
			case 17:
				zhushu += 1; break;
			case 3:
			case 4:
			case 14:
			case 15:
				zhushu += 2; break;
			case 5:
			case 6:
			case 12:
			case 13:
				zhushu += 3; break;
			case 7:
			case 8:
			case 10:
			case 11:
				zhushu += 4; break;
			case 9:
				zhushu += 5; break;
		}
	}
	return zhushu * pos_count;
}

// 任三 直选复式
function calc_r3_zxfs(ba) {
	var len = ba.length;
	if (len < 4) { return 0; }
	var a = 0, b = 0, c = 0, d = 0, e = 0;
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
	if (ba[5]) {
		var res = ba[5].split(/[\|\/]/);
		if (checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			e = res.length;
		}
	}
	//		console.log(a+' '+b+' '+c+' '+d+' '+e);
	return a * b * (c + d + e) + a * c * (d + e) + a * d * e + b * c * (d + e) + b * d * e + c * d * e;
}

// 任三 直选单式
function calc_r3_zxds(ba) {
	var zhushu = 0;
	if (ba.length < 2) {
		return 0;
	}
	for (var i = 1; i < ba.length; i++) {
		var res = ba[i].split(/[\|\/]/);
		if (res.length == 3 && checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			zhushu++;
		}
	}
	return zhushu * pos_count;
}

// 任三 直选和值
function calc_r3_zxhz(ba) {
	let pos_count = ba[0]; // 截第一位出来。
	ba.splice(0, 1); // 干掉第一位。

	var zhushu = 0;
	if (ba.length < 2) {
		return 0;
	}
	for (var i = 1; i < ba.length; i++) {
		var value = parseInt(ba[i]);
		if (value >= 0 && value <= 27) {
			var n = 0;
			if (value <= 13) {
				n = value + 2;
			} else if (value > 13) {
				n = 29 - value;
			}
			if (n == 12) {
				zhushu += 63;
			} else if (n == 13) {
				zhushu += 69;
			} else if (n == 14) {
				zhushu += 73;
			} else if (n == 15) {
				zhushu += 75;
			} else {
				zhushu += n * ((n - 1) / 2);
			}
		}
	}
	return zhushu * pos_count;
}

// 任三 组三复式
function calc_r3_zu3fs(ba) {
	let pos_count = ba[0]; // 截第一位出来。
	ba.splice(0, 1); // 干掉第一位。

	var zhushu = 0;
	var len = ba.length;
	if (len < 3) {
		return 0;
	}
	switch (len - 1) {
		case 2: zhushu = 2; break;
		case 3: zhushu = 6; break;
		case 4: zhushu = 12; break;
		case 5: zhushu = 20; break;
		case 6: zhushu = 30; break;
		case 7: zhushu = 42; break;
		case 8: zhushu = 56; break;
		case 9: zhushu = 72; break;
		case 10: zhushu = 90; break;
	}
	return zhushu * pos_count;

}

// 任三 组三单式
function calc_r3_zu3ds(ba) {
	var zhushu = 0;
	if (ba.length < 2 || ba[0] < 7) { return 0; }
	for (var i = 1; i < ba.length; i++) {
		var res = ba[i].split(/[\|\/]/);
		if (res.length == 3 && checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			if (res[0] == res[1] || res[0] == res[2] || res[1] == res[2]) {
				zhushu++;
			}
		}
	}
	return zhushu * pos_count;
}

// 任三 组六复式
function calc_r3_zu6fs(ba) {
	let pos_count = ba[0]; // 截第一位出来。
	ba.splice(0, 1); // 干掉第一位。

	var len = ba.length;
	var zhushu = 0;
	if (len < 4) {
		return 0;
	}
	switch (len - 1) {
		case 3: zhushu = 1; break;
		case 4: zhushu = 4; break;
		case 5: zhushu = 10; break;
		case 6: zhushu = 20; break;
		case 7: zhushu = 35; break;
		case 8: zhushu = 56; break;
		case 9: zhushu = 84; break;
		case 10: zhushu = 120; break;
	}
	return zhushu * pos_count;
}

// 任三 组六单式
function calc_r3_zu6ds(ba) {
	if (ba.length < 2) {
		return;
	}
	var zhushu = 0;
	for (var i = 1; i < ba.length; i++) {
		var res = ba[i].split(/[\|\/]/);
		if (res.length == 3 && checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			if (res[0] != res[1] && res[0] != res[2] && res[1] != res[2]) {
				zhushu++;
			}
		}
	}
	return zhushu * pos_count;
}

// 任三 混合组选
function calc_r3_hhzx(ba) {
	// return 0;
	// console.log("任三-混合组选：");
	// console.log(ba);
	if (ba.length < 2 || ba[1] == "") {
		return 0;
	}
	var zhushu = 0;
	for (var i = 1; i < ba.length; i++) {
		var res = ba[i].split(/[\|\/]/);
		if (res.length == 3 && checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			if (res[0] != res[1] || res[0] != res[2] || res[1] != res[2]) {
				zhushu++;
			}
		}
	}
	return zhushu * pos_count;
}

// 任三 组选和值
function calc_r3_zuxhz(ba) {
	let pos_count = ba[0]; // 截第一位出来。
	ba.splice(0, 1); // 干掉第一位。

	// console.log(ba);
	if (ba.length < 2) {
		return 0;
	}
	var zhushu = 0;
	for (var i = 1; i < ba.length; i++) {
		var value = parseInt(ba[i]);
		switch (value) {
			case 1:
			case 26:
				zhushu += 1; break;
			case 2:
			case 3:
			case 24:
			case 25:
				zhushu += 2; break;
			case 4:
			case 23:
				zhushu += 4; break;
			case 5:
			case 22:
				zhushu += 5; break;
			case 6:
			case 21:
				zhushu += 6; break;
			case 7:
			case 20:
				zhushu += 8; break;
			case 8:
			case 19:
				zhushu += 10; break;
			case 9:
			case 18:
				zhushu += 11; break;
			case 10:
			case 17:
				zhushu += 13; break;
			case 11:
			case 12:
			case 16:
			case 15:
				zhushu += 14; break;
			case 13:
			case 14:
				zhushu += 15; break;
		}
	}
	return zhushu * pos_count;
}

// 任四 直选复式
function calc_r4_zxfs(ba) {
	var len = ba.length;
	if (len < 5) { return 0; }

	var a = 0, b = 0, c = 0, d = 0, e = 0;
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
	if (ba[5]) {
		var res = ba[5].split(/[\|\/]/);
		if (checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			e = res.length;
		}
	}
	return a * b * c * d + a * b * c * e + a * c * d * e + b * c * d * e + a * b * d * e;
}

// 任四 直选单式
function calc_r4_zxds(ba) {
	if (ba.length < 2) {
		return 0;
	}
	var zhushu = 0;
	for (var i = 1; i < ba.length; i++) {
		var res = ba[i].split(/[\|\/]/);
		if (res.length == 4 && checkArrIs(res, /^([0-9]|[0][0-9])$/)) {
			zhushu++;
		}
	}
	return zhushu * pos_count;
}

// 任四 组选24
function calc_r4_zux24(ba) {
	let pos_count = ba[0]; // 截第一位出来。
	ba.splice(0, 1); // 干掉第一位。

	var len = ba.length;
	var resBalls = ba.slice(1);
	if (len < 5 || !checkArrIs(resBalls, /^([0-9]|[0][0-9])$/)) {
		return 0;
	}
	switch (len - 1) {
		case 4: return 1 * pos_count;
		case 5: return 5 * pos_count;
		case 6: return 15 * pos_count;
		case 7: return 35 * pos_count;
		case 8: return 70 * pos_count;
		case 9: return 126 * pos_count;
		case 10: return 210 * pos_count;
	}
}

// 任四 组选12
function calc_r4_zux12(ba) {
	let pos_count = ba[0]; // 截第一位出来。
	ba.splice(0, 1); // 干掉第一位。

	var len = ba.length;
	var resBalls = ba.slice(1);
	if (len < 3) {
		return 0;
	}
	var ball1 = ba[1].split("|");	// 2重号数组
	var ball2 = ba[2].split("|");	// 单号数组
	var zhushu = 0;
	for (var i = 0; i < ball1.length; i++) {
		var ball1_value = parseInt(ball1[i]);
		if (ball1_value >= 0 && ball1_value <= 9) {
			var n = 0;
			for (var j = 0; j < ball2.length; j++) {
				var ball2_value = parseInt(ball2[j]);
				if (ball2_value >= 0 && ball2_value <= 9 && ball2_value != ball1_value) {
					n++;
				}
			}
			zhushu += n * ((n - 1) / 2);
		}
	}
	return zhushu * pos_count;
}

// 任四 组选6
function calc_r4_zux6(ba) {
	let pos_count = ba[0]; // 截第一位出来。
	ba.splice(0, 1); // 干掉第一位。

	var len = ba.length;
	var resBalls = ba.slice(1);
	if (len < 3 || !checkArrIs(resBalls, /^([0-9]|[0][0-9])$/)) {
		return 0;
	}
	var n = 0;
	for (var i = 1; i < ba.length; i++) {
		var value = parseInt(ba[i]);
		if (value >= 0 && value <= 9) {
			n++;
		}
	}
	return n * ((n - 1) / 2) * pos_count;
}

// 任四 组选4
function calc_r4_zux4(ba) {
	let pos_count = ba[0]; // 截第一位出来。
	ba.splice(0, 1); // 干掉第一位。

	var len = ba.length;
	var resBalls = ba.slice(1);
	if (len < 3) {
		return 0;
	}
	var balls_1 = ba[1].split("|");	// 三重号
	var balls_2 = ba[2].split("|");	// 单号

	if (!checkArrIs(balls_1, /^([0-9]|[0][0-9])$/) || !checkArrIs(balls_2, /^([0-9]|[0][0-9])$/)) {
		return 0;
	}
	var zhushu = 0;
	for (var i = 0; i < balls_1.length; i++) {
		var ball1_v = parseInt(balls_1[i]);
		if (ball1_v >= 0 && ball1_v <= 9) {
			var n = 0;
			for (var j = 0; j < balls_2.length; j++) {
				var ball2_v = parseInt(balls_2[j]);
				if (ball2_v >= 0 && ball2_v <= 9 && ball2_v != ball1_v) {
					n++;
				}
			}
			zhushu += n;
		}
	}

	return zhushu * pos_count;
}

//南拳劈腿
function calc_dw_dxds(ba) {
	if (ba.length != 5) {
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

//侧妃之争
function calc_cfzz(ba) {
	if (ba.length < 1 || !checkArrIs(ba, /[0-9]/)) {
		return 0;
	} else {
		return ba.length;
	}
}

//侍寝之牌
function calc_sqzp(ba) {
	if (ba.length != 5) {
		return 0;
	}
	var zhushu = 0;
	for (var i = 0; i < ba.length; i++) {
		if (ba[i] != "?") {
			var res = ba[i].split(/[\|\/]/);
			if (checkArrIs(res, /[0-9]/)) {
				zhushu += res.length;
			}
		}
	}
	return zhushu;
}

function calc_qw_yffs(ba) {
	if (!checkArrIs(ba, /^([0-9]|[0][0-9])$/)) {
		return 0;
	} else {
		return ba.length;
	}
}

function calc_qw_hscs(ba) {
	if (!checkArrIs(ba, /^([0-9]|[0][0-9])$/)) {
		return 0;
	} else {
		return ba.length;
	}
}

function calc_qw_sykt(ba) {
	if (!checkArrIs(ba, /^([0-9]|[0][0-9])$/)) {
		return 0;
	} else {
		return ba.length;
	}
}

function calc_qw_sjfc(ba) {
	if (!checkArrIs(ba, /^([0-9]|[0][0-9])$/)) {
		return 0;
	} else {
		return ba.length;
	}
}

function calc_qw_wgfd(ba) {
	if (!checkArrIs(ba, /^([0-9]|[0][0-9])$/)) {
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

// 组选方法判断是否重号
function contains(arr, str) {
	var rsult = false;
	for (var i = 0; i < arr.length; i++) {
		if (str == arr[i]) {
			rsult = true;
		}
	}
	return rsult;
}

//和值大小单双
function calc_hzdxds(ba) {
	if (!checkArrIs(ba, /^([0-3])$/)) {
		return 0;
	} else {
		return ba.length;
	}
}

// 龙虎斗
function calc_longhu(ba) {
	// by zhang
	for (var i = 0; i < ba.length; i++) {
		if (ba[i].length != 2 || !checkArrIs(ba[i], /^([0-9])$/)) {
			return 0;
		}
	}
	return ba.length;
}

// 趣味
function calc_interest(ba) {
	// by zhang
	var zhushu = 0;
	for (var i = 0; i < ba.length; i++) {
		var balls = String(ba[i]).split("|");
		zhushu += balls.length;
	}
	return zhushu;
}

// 牛牛
function calc_niunius(ba) {
	// by zhang
	for (var i = 0; i < ba.length; i++) {
		if (parseInt(ba[i]) > 16 || parseInt(ba[i]) < 0) {
			return 0;
		}
	}
	return ba.length;
}
