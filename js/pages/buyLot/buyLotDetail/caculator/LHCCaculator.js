/**
 * 思索： 是否可以统一计算方法
 * 任何玩法都是号码加金额， 而且是手动输入
 * 那么所谓规则，就是把选中的号码和输入的金额进行分类和相加而已
 *
 * 通过统一计算注数文件，返回注数和金额， 从而取消单数金额 per_price_
 *
 * */

/**
	Author Ward
	Created by on 2017-10-06 16:07
**/

export default {

	getLHCNumberMethod(playid, pickerArr) {

		if (playid == '1' || playid == '36' || playid == '11' || playid == '12' || playid == '13' || playid == '14' || playid == '15' || playid == '16') {
			return calc_tema_zx(pickerArr); //特码A\B |正码一 〜 六
		}
		else if (playid == '2') {
			return calc_tema_2m(pickerArr);  //特码两面
		}
		else if (playid == '5') {
			return calc_tema_tws(pickerArr); // 特头尾数
		}
		else if (playid == '3') {
			return calc_tema_sebo(pickerArr); // 特码波色
		}
		else if (playid == '4') {
			return calc_tema_banse(pickerArr); // 特半波
		}
		else if (playid == '6') {
			return calc_tema_haose(pickerArr);  // 特半半波
		}
		else if (playid == '7') {
			return calc_tema_sx(pickerArr);   //特肖 直选
		}
		else if (playid == '8') {
			return calc_tema_hx(pickerArr);  //特肖 合肖
		}
		else if (playid == '9') {
			return calc_wuxing(pickerArr);  //五行 金木水火土
		}
		else if (playid == '10') {
			return calc_zhengma(pickerArr);  //正码
		}
		else if (playid == '17') {
			return calc_ptyx(pickerArr); //平特一肖
		}
		else if (playid == '18') {
			return calc_ptws(pickerArr);  //平特尾数
		}
		else if (playid == '19') {
			return calc_qisebo(pickerArr); //七色波
		}
		else if (playid == '20') {
			return calc_zongxiao(pickerArr); //总肖
		}
		else if (playid == '21') {
			return calc_zxbz(pickerArr); //自选不中
		}
		// else if (playid == '22' || playid == '26') {
		// 	return calc_2lianwei(pickerArr); //连选必中  2连肖 连尾
		// }
		// else if (playid == '23' || playid == '27') {
		// 	return calc_3lianwei(pickerArr); //连选必中  3连肖 连尾
		// }
		// else if (playid == '24' || playid == '28') {
		// 	return calc_4lianwei(pickerArr); //连选必中  4连肖 连尾
		// }
		// else if (playid == '25' || playid == '29') {
		// 	return calc_5lianwei(pickerArr); //连选必中  5连肖 连尾
		// }
		// else if (playid == '30') {
		// 	return calc_3m_2m(pickerArr);  //连码三中二
		// }
		// else if (playid == '31') {
		// 	return calc_3m_3m(pickerArr);   //连码三中三
		// }
		// else if (playid == '32' || playid == '33') {
		// 	return calc_2t_2m(pickerArr);  //二中特
		// }
		// else if (playid == '34') {
		// 	return calc_tc_2m(pickerArr); //特串
		// }
		// else if (playid == '35') {
		// 	return calc_4m_qz(pickerArr);  // 连码 四全中
		// }
		else {
			return 0;
		}

	}

}

//特码
function calc_tema_zx(ba) {
	if (ba.length < 1) {
		return { zhushu: 0, price: 0 };
	} else {
		var calc_price = 0;
		for (var k in ba) {
			var res_price = ba[k].split("|");
			calc_price += parseInt(res_price[1]);
			return { zhushu: ba.length, price: calc_price };
		}
	}
	return { zhushu: 0, price: 0 };
}

//特码两面
function calc_tema_2m(ba) {
	if (ba.length < 1) {
		return { zhushu: 0, price: 0 };
	} else {
		var calc_price = 0;
		for (var k in ba) {
			var sub_price = ba[k].split("|");
			calc_price += parseInt(sub_price[1]);
		}
		return { zhushu: ba.length, price: calc_price };
	}
	return { zhushu: 0, price: 0 };
}

//头尾数
function calc_tema_tws(ba) {
	if (ba.length < 1) {
		return { zhushu: 0, price: 0 };
	} else {
		var calc_price = 0;
		for (var k in ba) {
			var sub_price = ba[k].split("|");
			calc_price += parseInt(sub_price[1]);
		}
		return { zhushu: ba.length, price: calc_price };
	}
	return { zhushu: 0, price: 0 };
}

//波色
function calc_tema_sebo(ba) {
	if (ba.length < 1) {
		return { zhushu: 0, price: 0 };
	} else {
		var calc_price = 0;
		for (var k in ba) {
			var sub_price = ba[k].split("|");
			calc_price += parseInt(sub_price[1]);
		}
		return { zhushu: ba.length, price: calc_price };
	}
	return { zhushu: 0, price: 0 };
}

//半波
function calc_tema_banse(ba) {
	if (ba.length < 1) {
		return { zhushu: 0, price: 0 };
	} else {
		var calc_price = 0;
		for (var k in ba) {
			var sub_price = ba[k].split("|");
			calc_price += parseInt(sub_price[1]);
		}
		return { zhushu: ba.length, price: calc_price };
	}
	return { zhushu: 0, price: 0 };
}

//半半波
function calc_tema_haose(ba) {
	if (ba.length < 1) {
		return { zhushu: 0, price: 0 };
	} else {
		var calc_price = 0;
		for (var k in ba) {
			var sub_price = ba[k].split("|");
			calc_price += parseInt(sub_price[1]);
		}
		return { zhushu: ba.length, price: calc_price };
	}
	return { zhushu: 0, price: 0 };
}

//特肖 直选
function calc_tema_sx(ba) {
	if (ba.length < 1) {
		return { zhushu: 0, price: 0 };
	} else {
		var calc_price = 0;
		for (var k in ba) {
			var sub_price = ba[k].split("|");
			calc_price += parseInt(sub_price[1]);
		}
		return { zhushu: ba.length, price: calc_price };
	}
	return { zhushu: 0, price: 0 };
}

//特肖 合肖
function calc_tema_hx(ba) {
	// by zhang
	if (ba.length >= 2 && ba.length <= 11) {
		return { zhushu : 1};
	} else {
		return { zhushu : 0};
	}
}

//五行 金木水火土
function calc_wuxing(ba) {
	if (ba.length < 1) {
		return { zhushu: 0, price: 0 };
	} else {
		var calc_price = 0;
		for (var k in ba) {
			var sub_price = ba[k].split("|");
			calc_price += parseInt(sub_price[1]);
		}
		return { zhushu: ba.length, price: calc_price };
	}
	return { zhushu: 0, price: 0 };
}

function calc_zhengma(ba) {
	if (ba.length < 1 || ba[0] == "") {
		return { zhushu: 0, price: 0 };
	} else {
		var calc_price = 0;
		for (var k in ba) {
			var sub_price = ba[k].split("|");
			calc_price += parseInt(sub_price[1]);
		}
		return { zhushu: ba.length, price: calc_price };
	}
	return { zhushu: 0, price: 0 };
}

//平特一肖
function calc_ptyx(ba) {
	if (ba.length < 1 || ba[0] == "") {
		return { zhushu: 0, price: 0 };
	} else {
		var calc_price = 0;
		for (var k in ba) {
			var sub_price = ba[k].split("|");
			calc_price += parseInt(sub_price[1]);
		}
		return { zhushu: ba.length, price: calc_price };
	}
	return { zhushu: 0, price: 0 };
}


//平特尾数
function calc_ptws(ba) {
	if (ba.length < 1 || ba[0] == "") {
		return { zhushu: 0, price: 0 };
	} else {
		var calc_price = 0;
		for (var k in ba) {
			var sub_price = ba[k].split("|");
			calc_price += parseInt(sub_price[1]);
		}
		return { zhushu: ba.length, price: calc_price };
	}
	return { zhushu: ba.length, price: 0 };
}

//七色波
function calc_qisebo(ba) {
	if (ba.length < 1 || ba[0] == "") {
		return { zhushu: 0, price: 0 };
	} else {
		var calc_price = 0;
		for (var k in ba) {
			var sub_price = ba[k].split("|");
			calc_price += parseInt(sub_price[1]);
		}
		return { zhushu: ba.length, price: calc_price };
	}
	return { zhushu: ba.length, price: 0 };
}

//总肖
function calc_zongxiao(ba) {
	if (ba.length < 1 || ba[0] == "") {
		return { zhushu: 0, price: 0 };
	} else {
		var calc_price = 0;
		for (var k in ba) {
			var sub_price = ba[k].split("|");
			calc_price += parseInt(sub_price[1]);
		}
		return { zhushu: ba.length, price: calc_price };
	}
	return { zhushu: ba.length, price: 0 };
}

//自选不中
function calc_zxbz(ba) {
	// by zhang
	if (ba.length >= 6 && ba.length <= 11) {
		return { zhushu : 1};
	} else {
		return { zhushu : 0};
	}
}

//连选必中  连肖
// function calc_lianxiao(ba){
// 	if (ba.length < 1 || ba[0] == "") {
// 		return {zhushu: 0, price: 0};
// 	} else{
// 		var calc_price = 0;
// 		for (var k in ba) {
// 			var sub_price = ba[k].split("|");
// 			calc_price += parseInt(sub_price[1]);
// 		}
// 		return {zhushu: ba.length, price: calc_price};
// 	}
// 	return {zhushu: 0, price: 0};
// }

//连选必中 2 连肖
// function calc_2lianwei(ba) {
// 	if (ba.length < 3) {
// 		return { zhushu: 0, price: 0 };
// 	}
// 	if (ba[0] == "") {
// 		ba[0] = 0;
// 	}
// 	var zhushu = 0, price = 0;
// 	var res_len = ba.length - 1;
// 	zhushu += res_len * ((res_len - 1) / 2);
// 	price += parseInt(ba[0]) * zhushu;
// 	return { zhushu: zhushu, price: price };
// }

// // 3连肖
// function calc_3lianwei(ba) {
// 	// console.log("进入计算");
// 	// console.log(ba);
// 	if (ba.length < 4) {
// 		return { zhushu: 0, price: 0 };
// 	}
// 	if (ba[0] == "") {
// 		ba[0] = 0;
// 	}
// 	var zhushu = 0, price = 0;
// 	var res_len = ba.length - 1;
// 	zhushu += (res_len - 3) * (res_len / 2) + 1;
// 	price += parseInt(ba[0]) * zhushu;
// 	return { zhushu: zhushu, price: price };
// }

// // 4连肖
// function calc_4lianwei(ba) {
// 	if (ba.length < 5) {
// 		return { zhushu: 0, price: 0 };
// 	}
// 	if (ba[0] == "") {
// 		ba[0] = 0;
// 	}
// 	var len = ba.length - 1;
// 	switch (len) {
// 		case 4:
// 			return { zhushu: 1, price: parseInt(ba[0]) * 1 };
// 			break;
// 		case 5:
// 			return { zhushu: 5, price: parseInt(ba[0]) * 5 };
// 			break;
// 		case 6:
// 			return { zhushu: 15, price: parseInt(ba[0]) * 15 };
// 			break;
// 		default:
// 			return { zhushu: 0, price: 0 };
// 			break;
// 	}
// }

// // 5连肖
// function calc_5lianwei(ba) {
// 	if (ba.length < 6) {
// 		return { zhushu: 0, price: 0 };
// 	}
// 	if (ba[0] == "") {
// 		ba[0] = 0;
// 	}
// 	var len = ba.length - 1;
// 	switch (len) {
// 		case 5:
// 			return { zhushu: 1, price: parseInt(ba[0]) * 1 };
// 			break;
// 		case 6:
// 			return { zhushu: 6, price: parseInt(ba[0]) * 6 };
// 			break;
// 		default:
// 			return { zhushu: 0, price: 0 };
// 			break;
// 	}
// }

// //连选必中 连尾
// function calc_lianwei(ba) {
// 	if (ba.length < 1 || ba[0] == "") {
// 		return { zhushu: 0, price: 0 };
// 	} else {
// 		var calc_price = 0;
// 		for (var k in ba) {
// 			var sub_price = ba[k].split("|");
// 			calc_price += parseInt(sub_price[1]);
// 		}
// 		return { zhushu: ba.length, price: calc_price };
// 	}
// 	return { zhushu: 0, price: 0 };
// }

// function calc_3m_2m(ba) {
// 	if (ba.length < 4) {
// 		return { zhushu: 0, price: 0 };
// 	}
// 	if (ba[0] == "") {
// 		ba[0] = 0;
// 	}
// 	var zhushu = 0, price = 0;
// 	var res_len = ba.length - 1;
// 	zhushu += (res_len - 3) * (res_len / 2) + 1;
// 	price += parseInt(ba[0]) * zhushu;
// 	return { zhushu: zhushu, price: price };
// }

// function calc_3m_3m(ba) {
// 	if (ba.length < 4) {
// 		return { zhushu: 0, price: 0 };
// 	}
// 	if (ba[0] == "") {
// 		ba[0] = 0;
// 	}
// 	var zhushu = 0, price = 0;
// 	var res_len = ba.length - 1;
// 	zhushu += (res_len - 3) * (res_len / 2) + 1;
// 	price += parseInt(ba[0]) * zhushu;
// 	return { zhushu: zhushu, price: price };
// }


// function calc_2t_2m(ba) {
// 	if (ba.length < 3) {
// 		return { zhushu: 0, price: 0 };
// 	}
// 	if (ba[0] == "") {
// 		ba[0] = 0;
// 	}
// 	var zhushu = 0, price = 0;
// 	var res_len = ba.length - 1;
// 	zhushu += res_len * ((res_len - 1) / 2);
// 	price += parseInt(ba[0]) * zhushu;
// 	return { zhushu: zhushu, price: price };
// }

// function calc_tc_2m(ba) {
// 	if (ba.length < 3) {
// 		return { zhushu: 0, price: 0 };
// 	}
// 	if (ba[0] == "") {
// 		ba[0] = 0;
// 	}
// 	var zhushu = 0, price = 0;
// 	var res_len = ba.length - 1;
// 	zhushu += res_len * ((res_len - 1) / 2);
// 	price += parseInt(ba[0]) * zhushu;
// 	return { zhushu: zhushu, price: price };
// }

// function calc_4m_qz(ba) {
// 	if (ba.length < 5) {
// 		return { zhushu: 0, price: 0 };
// 	}
// 	if (ba[0] == "") {
// 		ba[0] = 0;
// 	}
// 	var len = ba.length - 1;
// 	switch (len) {
// 		case 4:
// 			return { zhushu: 1, price: parseInt(ba[0]) * 1 };
// 			break;
// 		case 5:
// 			return { zhushu: 5, price: parseInt(ba[0]) * 5 };
// 			break;
// 		case 6:
// 			return { zhushu: 15, price: parseInt(ba[0]) * 15 };
// 			break;
// 		case 7:
// 			return { zhushu: 35, price: parseInt(ba[0]) * 35 };
// 			break;
// 		case 8:
// 			return { zhushu: 70, price: parseInt(ba[0]) * 70 };
// 			break;
// 		case 9:
// 			return { zhushu: 126, price: parseInt(ba[0]) * 126 };
// 			break;
// 		case 10:
// 			return { zhushu: 210, price: parseInt(ba[0]) * 210 };
// 			break;
// 		default:
// 			return { zhushu: 0, price: 0 };
// 			break;
// 	}
// }
