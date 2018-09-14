/**
    Author Ward
    Created by on 2017-10-05
    dec 用于11选5注数计算的JS文件
**/
export default {

	get11x5NumberMethod(playID, pickerArr) {

		if (playID == '1' || playID == '6' || playID == '11') {
			return calc_3m_q3zhxfs(pickerArr);  //三码 前|中|后三直选复式
		}
		else if (playID == '2' || playID == '7' || playID == '12') {
			return calc_3m_q3zhxds(pickerArr);  //三码 前|中|后三直选单式
		}
		else if (playID == '3' || playID == '8' || playID == '13') {
			return calc_3m_q3zuxfs(pickerArr); //三码 前|中|后三组选复式
		}
		else if (playID == '4' || playID == '9' || playID == '14') {
			return calc_3m_q3zuxds(pickerArr); //三码 前|中|后三组选单式
		}
		else if (playID == '5' || playID == '10' || playID == '15') {
			return calc_3m_q3zuxdt(pickerArr); //三码 前|中|后三组选胆拖
		}
		else if (playID == '16' || playID == '21') {
			return calc_2m_q2zhxfs(pickerArr);  //二码 前|后二直选复式
		}
		else if (playID == '17' || playID == '22') {
			return calc_2m_q2zhxds(pickerArr);  //二码 前|后二直选单式
		}
		else if (playID == '18' || playID == '23') {
			return calc_2m_q2zuxfs(pickerArr); //二码 前|后二组选复式
		}
		else if (playID == '19' || playID == '24') {
			return calc_2m_q2zuxds(pickerArr);  //二码 前|后二组选单式
		}
		else if (playID == '20' || playID == '25') {
			return calc_2m_q2zuxdt(pickerArr);  // 二码 前|后二组选胆拖
		}
		else if (playID == '26') {
			return calc_bdw_q3w(pickerArr);  //不定位  前三位
		}
		else if (playID == '27') {
			return calc_bdw_z3w(pickerArr); //不定位  中三位
		}
		else if (playID == '28') {
			return calc_bdw_h3w(pickerArr); //不定位  后三位
		}
		else if (playID == '29') {
			return calc_dwd_dwd(pickerArr); //定位胆
		}
		else if (playID == '30') {
			return calc_rxfs_rx1z1(pickerArr); //任选复式 任选一中一
		}
		else if (playID == '31') {
			return calc_rxfs_rx2z2(pickerArr); //任选复式 任选二中二
		}
		else if (playID == '32') {
			return calc_rxfs_rx3z3(pickerArr); //任选复式 任选三中三
		}
		else if (playID == '33') {
			return calc_rxfs_rx4z4(pickerArr); //任选复式 任选四中四
		}
		else if (playID == '34') {
			return calc_rxfs_rx5z5(pickerArr); // 任选复式 任选五中五
		}
		else if (playID == '35') {
			return calc_rxfs_rx6z5(pickerArr); //任选复式 任选六中五
		}
		else if (playID == '36') {
			return calc_rxfs_rx7z5(pickerArr); //任选复式 任选七中五
		}
		else if (playID == '37') {
			return calc_rxfs_rx8z5(pickerArr); //任选复式 任选八中五
		}
		else if (playID == '38') {
			return calc_rxds_rx1z1(pickerArr); //任选单式 任选一中一
		}
        else if (playID == '39') {
			return calc_rxds_rx2z2(pickerArr); //任选单式 任选二中二
        }
        else if (playID == '40') {
			return calc_rxds_rx3z3(pickerArr); //任选单式 任选三中三
        }
        else if (playID == '41') {
            return calc_rxds_rx4z4(pickerArr); //任选单式 任选四中四
        }
        else if (playID == '42') {
            return calc_rxds_rx5z5(pickerArr); //任选单式 任选五中五
        }
        else if (playID == '43') {
            return calc_rxds_rx6z5(pickerArr); //任选单式 任选六中五
        }
        else if (playID == '44') {
            return calc_rxds_rx7z5(pickerArr); //任选单式 任选七中五
        }
		else if (playID == '45') {
			return calc_rxdt_rx2z2(pickerArr); //任选胆拖 任选二中二
		}
		else if (playID == '46') {
			return calc_rxdt_rx3z3(pickerArr); //任选胆拖 任选三中三
		}
		else if (playID == '47') {
			return calc_rxdt_rx4z4(pickerArr); //任选胆拖 任选四中四
		}
		else if (playID == '48') {
			return calc_rxdt_rx5z5(pickerArr); //任选胆拖 任选五中五
		}
		else if (playID == '49') {
			return calc_rxdt_rx6z5(pickerArr); //任选胆拖 任选六中五
		}
		else if (playID == '50') {
			return calc_rxdt_rx7z5(pickerArr);   //任选胆拖 任选七中五
		}
		else if (playID == '51') {
			return calc_rxdt_rx8z5(pickerArr);   //任选胆拖 任选八中五
		}
		else if (playID == 'calc_dwd_dxds') {
			return calc_dwd_dxds(pickerArr); 	//定位胆-大小单双
		}
		else if (playID == 'calc_sum_dxds') {
			return calc_sum_dxds(pickerArr); // 和值-大小单双
		}
		else if (playID == 'calc_lhd') {
			return calc_lhd(pickerArr);
		}
		else if (playID == 'calc_q5z1') {
			return calc_q5z1(pickerArr);

		} else if (playID == '57') {
			return calc_niunius(pickerArr);  // 牛牛

		} else {
			return 0;  //不符合条件则返回注数0
		}
	}
}

//三码 前三直选复式
function calc_3m_q3zhxfs(ba) {
	if (ba.length != 3) {
		return 0;
	}
	ba0 = ba[0].split('|');
	ba1 = ba[1].split('|');
	ba2 = ba[2].split('|');
	if (!checkArrIs(ba0, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/) || !checkArrIs(ba1, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/) || !checkArrIs(ba2, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
		return 0;
	}
	var num = 0;
	for (var i in ba0) {
		for (var j in ba1) {
			for (var k in ba2) {
				if (ba2[k] != ba1[j] && ba2[k] != ba0[i] && ba1[j] != ba0[i]) {
					num++;
				}
			}
		}
	}
	return num;
}

//三码 前三直选单式
function calc_3m_q3zhxds(ba) {
	if (ba.length < 1) {
		return 0;
	}
	var num = 0;
	var ballArr = [];
	for (var k in ba) {
		var len = ba[k].split(/[\/\|]/);
		var resBalls = repeatArr(len);
		if (len.length == 3 && resBalls.length == 3 && checkArrIs(len, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
			num++;
			ballArr.push(len);
		}
	}
	return {zhushu: num, ballArr: ballArr};
}

//三码 前三组选复式
function calc_3m_q3zuxfs(ba) {
	var num = ba.length;
	if (num < 3 || !checkArrIs(ba, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
		return 0;
	}
	switch (num) {
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
		case 11:
			return 165;
	}
	return 0;
}

//三码 前三组选单式
function calc_3m_q3zuxds(ba) {
	if (ba.length < 1) {
		return 0;
	}
	var num = 0;
	var ballArr = [];
	for (var k in ba) {
		var len = ba[k].split(/[\/\|]/);
		var resBalls = repeatArr(len);
		if (len.length == 3 && resBalls.length == 3 && checkArrIs(len, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
			num++;
			ballArr.push(len);
		}
	}
	return {zhushu: num, ballArr: ballArr};
}

//三码 前三组选胆拖
function calc_3m_q3zuxdt(ba) {
	if (ba.length < 2) {
		return 0;
	}
	var ba1 = ba[0].split('|');
	var ba2 = ba[1].split('|');
	if (!checkArrIs(ba1, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/) || !checkArrIs(ba2, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
		return 0;
	}
	if (ba1.length == 2 && ba2.length != 0) {
		return ba2.length;
	} else {
		switch (ba2.length) {
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
}



//二码 前二直选复式
function calc_2m_q2zhxfs(ba) {
	if (ba.length != 2) {
		return 0;
	}
	ba0 = ba[0].split('|');
	ba1 = ba[1].split('|');
	if (!checkArrIs(ba0, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/) || !checkArrIs(ba1, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
		return 0;
	}
	var num = 0;
	for (var i in ba0) {
		for (var j in ba1) {
			if (ba1[j] != ba0[i]) {
				num++;
			}
		}
	}
	return num;
};

//二码 前二直选单式
function calc_2m_q2zhxds(ba) {
	if (ba.length < 1) {
		return 0;
	}
	var num = 0;
	var ballArr = [];
	for (var k in ba) {
		var len = ba[k].split(/[\/\|]/);
		var resBalls = repeatArr(len);
		if (len.length == 2 && resBalls.length == 2 && checkArrIs(len, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
			num++;
			ballArr.push(len);
		}
	}
	return {zhushu: num, ballArr: ballArr};
};

//二码 前二组选复式
function calc_2m_q2zuxfs(ba) {
	if (ba.length < 2 || !checkArrIs(ba, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
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
		case 11:
			return 55;
	}
};

//二码 前二组选单式
function calc_2m_q2zuxds(ba) {
	if (ba.length < 1) {
		return 0;
	}
	var num = 0;
	var ballArr = [];
	for (var k in ba) {
		var len = ba[k].split(/[\/\|]/);
		var resBalls = repeatArr(len);
		if (len.length == 2 && resBalls.length == 2 && checkArrIs(len, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
			num++;
			ballArr.push(len);
		}
	}
	return {zhushu: num, ballArr: ballArr};
};

//二码 前二组选胆拖
function calc_2m_q2zuxdt(ba) {
	if (ba.length != 2) {
		return 0;
	}
	var ba1 = ba[1].split('|');
	if (!checkArrIs(ba1, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
		return 0;
	}
	return ba1.length;
};



//不定位  前三位
function calc_bdw_q3w(ba) {
	if (ba.length < 1 || !checkArrIs(ba, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
		return 0;
	}
	return ba.length;
};

//不定位  中三位
function calc_bdw_z3w(ba) {
	if (ba.length < 1 || !checkArrIs(ba, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
		return 0;
	}
	return ba.length;
};

//不定位  后三位
function calc_bdw_h3w(ba) {
	if (ba.length < 1 || !checkArrIs(ba, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
		return 0;
	}
	return ba.length;
};

//定位胆
function calc_dwd_dwd(ba) {
	if (ba.length < 2) {
		return 0;
	}

	var num = 0;
	for (var i = 1; i < ba.length; i++) {
		var child_arr = ba[i].split("|");
		if (checkArrIs(child_arr, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
			num += child_arr.length;
		}
	}
	return num;
}

//任选复式 任选一中一
function calc_rxfs_rx1z1(ba) {
	if (ba.length < 1 || !checkArrIs(ba, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
		return 0;
	}
	return ba.length;
}

//任选复式 任选二中二
function calc_rxfs_rx2z2(ba) {
	if (ba.length < 2 || !checkArrIs(ba, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
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
		case 11:
			return 55;
	}
}

//任选复式 任选三中三
function calc_rxfs_rx3z3(ba) {
	if (ba.length < 3 || !checkArrIs(ba, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
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
		case 11:
			return 165;
	}
}

//任选复式 任选四中四
function calc_rxfs_rx4z4(ba) {
	if (ba.length < 4 || !checkArrIs(ba, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
		return 0;
	}
	switch (ba.length) {
		case 4:
			return 1;
		case 5:
			return 5;
		case 6:
			return 15;
		case 7:
			return 35;
		case 8:
			return 70;
		case 9:
			return 126;
		case 10:
			return 210;
		case 11:
			return 330;
	}
}

//任选复式 任选五中五
function calc_rxfs_rx5z5(ba) {
	if (ba.length < 5 || !checkArrIs(ba, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
		return 0;
	}
	switch (ba.length) {
		case 5:
			return 1;
		case 6:
			return 6;
		case 7:
			return 21;
		case 8:
			return 56;
		case 9:
			return 126;
		case 10:
			return 252;
		case 11:
			return 462;
	}
};

//任选复式 任选六中五
function calc_rxfs_rx6z5(ba) {
	if (ba.length < 6 || !checkArrIs(ba, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
		return 0;
	}
	switch (ba.length) {
		case 6:
			return 1;
		case 7:
			return 7;
		case 8:
			return 28;
		case 9:
			return 84;
		case 10:
			return 210;
		case 11:
			return 462;
	}
}

//任选复式 任选七中五
function calc_rxfs_rx7z5(ba) {
	if (ba.length < 7 || !checkArrIs(ba, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
		return 0;
	}
	switch (ba.length) {
		case 7:
			return 1;
		case 8:
			return 8;
		case 9:
			return 36;
		case 10:
			return 120;
		case 11:
			return 330;
	}
}

//任选复式 任选八中五
function calc_rxfs_rx8z5(ba) {
	if (ba.length < 8 || !checkArrIs(ba, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
		return 0;
	}
	switch (ba.length) {
		case 8:
			return 1;
		case 9:
			return 9;
		case 10:
			return 45;
		case 11:
			return 165;
	}
};

//任选单式 任选一中一
function calc_rxds_rx1z1(ba) {
	if (ba.length < 1) {
		return 0;
	}
	var num = 0;
	var ballArr = [];
	for (var i in ba) {
		var len = ba[i].split(/[\|\/]/);
		if (len.length == 1 && checkArrIs(len, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
			num++;
			ballArr.push(len);
		}
	}
	return {zhushu: num, ballArr: ballArr};
}

//任选单式 任选二中二
function calc_rxds_rx2z2(ba) {
	if (ba.length < 1) {
		return 0;
	}
	var num = 0;
	var ballArr = [];
	for (var i in ba) {
		var len = ba[i].split(/[\|\/]/);
		var resBalls = repeatArr(len);
		if (resBalls.length == 2 && len.length == 2 && checkArrIs(resBalls, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
			num++;
			ballArr.push(len);
		}
	}
	return {zhushu: num, ballArr: ballArr};
};

//任选单式 任选三中三
function calc_rxds_rx3z3(ba) {
	if (ba.length < 1) {
		return 0;
	}
	var num = 0;
	var ballArr = [];
	for (var i in ba) {
		var len = ba[i].split(/[\|\/]/);
		var resBalls = repeatArr(len);
		if (resBalls.length == 3 && len.length == 3 && checkArrIs(resBalls, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
			num++;
			ballArr.push(len);
		}
	}
	return {zhushu: num, ballArr: ballArr};
};

//任选单式 任选四中四
function calc_rxds_rx4z4(ba) {
	if (ba.length < 1) {
		return 0;
	}
	var num = 0;
	var ballArr = [];
	for (var i in ba) {
		var len = ba[i].split(/[\|\/]/);
		var resBalls = repeatArr(len);
		if (resBalls.length == 4 && len.length == 4 && checkArrIs(resBalls, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
			num++;
			ballArr.push(len);
		}
	}
	return {zhushu: num, ballArr: ballArr};
};

//任选单式 任选五中五
function calc_rxds_rx5z5(ba) {
	if (ba.length < 1) {
		return 0;
	}
	var num = 0;
	var ballArr = [];
	for (var i in ba) {
		var len = ba[i].split(/[\|\/]/);
		var resBalls = repeatArr(len);
		if (resBalls.length == 5 && len.length == 5 && checkArrIs(resBalls, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
			num++;
			ballArr.push(len);
		}
	}
	return {zhushu: num, ballArr: ballArr};
};

//任选单式 任选六中五
function calc_rxds_rx6z5(ba) {
	if (ba.length < 1) {
		return 0;
	}
	var num = 0;
	var ballArr = [];
	for (var i in ba) {
		var len = ba[i].split(/[\|\/]/);
		var resBalls = repeatArr(len);
		if (resBalls.length == 6 && len.length == 6 && checkArrIs(resBalls, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
			num++;
			ballArr.push(len);
		}
	}
	return {zhushu: num, ballArr: ballArr};
};

//任选单式 任选七中五
function calc_rxds_rx7z5(ba) {
	if (ba.length < 1) {
		return 0;
	}
	var num = 0;
	var ballArr = [];
	for (var i in ba) {
		var len = ba[i].split(/[\|\/]/);
		var resBalls = repeatArr(len);
		if (resBalls.length == 7 && len.length == 7 && checkArrIs(resBalls, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
			num++;
			ballArr.push(len);
		}
	}
	return {zhushu: num, ballArr: ballArr};
};

//任选单式 任选八中五
function calc_rxds_rx8z5(ba) {
	if (ba.length < 1) {
		return 0;
	}
	var num = 0;
	var ballArr = [];
	for (var i in ba) {
		var len = ba[i].split(/[\|\/]/);
		var resBalls = repeatArr(len);
		if (resBalls.length == 8 && len.length == 8 && checkArrIs(resBalls, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
			num++;
			ballArr.push(len);
		}
	}
	return {zhushu: num, ballArr: ballArr};
};

//任选胆拖 任选二中二
function calc_rxdt_rx2z2(ba) {
	if (ba.length != 2) {
		return 0;
	}
	var ba1 = ba[1].split(/[\|\/]/);
	if (ba1.length < 1 || !checkArrIs(ba1, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
		return 0;
	}
	return ba1.length;
};

//任选胆拖 任选三中三
function calc_rxdt_rx3z3(ba) {
	if (ba.length != 2) {
		return 0;
	}
	var ba0 = ba[0].split('|');
	var ba1 = ba[1].split('|');
	if (!checkArrIs(ba0, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/) || !checkArrIs(ba1, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
		return 0;
	}
	if (ba0.length == 2) {
		return ba1.length;
	} else {
		if (ba1.length < 2) {
			return 0;
		}
		var num = 0;
		for (var m = ba1.length; m > 0; m--) {
			num += m - 1;
		}
		return num;
	}
};

//任选胆拖 任选四中四
function calc_rxdt_rx4z4(ba) {
	if (ba.length < 2) {
		return 0;
	}
	var ba0 = ba[0].split('|');
	var ba1 = ba[1].split('|');
	if (!checkArrIs(ba0, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/) || !checkArrIs(ba1, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
		return 0;
	}
	if ((ba0.length + ba1.length) < 4) {
		return 0;
	}
	switch (ba0.length) {
		case 1:
			var k = 0;
			var n = ba1.length - 2;  //胆码固定1求  则拖码3求为一注
			var num = [];
			for (var i = n; i > 0; i--) {
				num[k] = (k + 1) * i;
				k++;
			}
			var result = 0;
			for (var i in num) {
				result += num[i];
			}
			return result;
		case 2:
			var n = ba1.length - 1;    //胆码固定2码  则拖码2个球为一注
			var num = [];
			var result = 0;
			for (var i = n, j = 0; i > 0; i--) {
				num[j] = i;
				j++;
			}
			for (var i in num) {
				result += num[i];
			}
			return result;
		case 3:
			return ba1.length;
	}
	return 0;
};

//任选胆拖 任选五中五
function calc_rxdt_rx5z5(ba) {
	if (ba.length != 2) {
		return 0;
	}
	var ba0 = ba[0].split('|');
	var ba1 = ba[1].split('|');
	if (!checkArrIs(ba0, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/) || !checkArrIs(ba1, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
		return 0;
	}
	if ((ba0.length + ba1.length) < 5) {
		return 0;
	}
	switch (ba0.length) {
		case 1:
			switch (ba1.length) {
				case 4:
					return 1;
				case 5:
					return 5;
				case 6:
					return 15;
				case 7:
					return 35;
				case 8:
					return 70;
				case 9:
					return 126;
				case 10:
					return 210;
			}
		case 2: 		//拖码3个球为一注
			var k = 0;
			var n = ba1.length - 2;  //胆码固定2求  则拖码3求为一注
			var num = [];
			for (var i = n; i > 0; i--) {
				num[k] = (k + 1) * i;
				k++;
			}
			var result = 0;
			for (var i in num) {
				result += num[i];
			}
			return result;
		case 3:
			var n = ba1.length - 1;    //胆码固定3码  则拖码2个球为一注
			var num = [];
			var result = 0;
			for (var i = n, j = 0; i > 0; i--) {
				num[j] = i;
				j++;
			}
			for (var i in num) {
				result += num[i];
			}
			return result;
		case 4:
			return ba1.length;
	}
};

//任选胆拖 任选六中五
function calc_rxdt_rx6z5(ba) {
	if (ba.length != 2) {
		return 0;
	}
	var ba0 = ba[0].split('|');
	var ba1 = ba[1].split('|');
	if (!checkArrIs(ba0, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/) || !checkArrIs(ba1, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
		return 0;
	}
	if ((ba0.length + ba1.length) < 6) {
		return 0;
	}
	switch (ba0.length) {
		case 1:
			switch (ba1.length) {
				case 5:
					return 1;
				case 6:
					return 6;
				case 7:
					return 21;
				case 8:
					return 56;
				case 9:
					return 126;
				case 10:
					return 252;
			}
		case 2:
			switch (ba1.length) {
				case 4:
					return 1;
				case 5:
					return 5;
				case 6:
					return 15;
				case 7:
					return 35;
				case 8:
					return 70;
				case 9:
					return 126;
			}
		case 3:
			switch (ba1.length) {
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
			}
		case 4:
			switch (ba1.length) {
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
			}
		case 5:
			return ba1.length;
	}
};

//任选胆拖 任选七中五
function calc_rxdt_rx7z5(ba) {
	if (ba.length != 2) {
		return 0;
	}
	var ba0 = ba[0].split('|');
	var ba1 = ba[1].split('|');
	if (!checkArrIs(ba0, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/) || !checkArrIs(ba1, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
		return 0;
	}
	if ((ba0.length + ba1.length) < 7) {
		return 0;
	}
	switch (ba0.length) {
		case 1:
			switch (ba1.length) {
				case 6:
					return 1;
				case 7:
					return 7;
				case 8:
					return 28;
				case 9:
					return 84;
				case 10:
					return 210;
			}
		case 2:
			switch (ba1.length) {
				case 5:
					return 1;
				case 6:
					return 6;
				case 7:
					return 21;
				case 8:
					return 56;
				case 9:
					return 126;
			}
		case 3:
			switch (ba1.length) {
				case 4:
					return 1;
				case 5:
					return 5;
				case 6:
					return 15;
				case 7:
					return 35;
				case 8:
					return 70;
			}
		case 4:
			switch (ba1.length) {
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
			}
		case 5:
			switch (ba1.length) {
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
			}
		case 6:
			return ba1.length;
	}
};

//任选胆拖 任选八中五
function calc_rxdt_rx8z5(ba) {
	if (ba.length != 2) {
		return 0;
	}
	var ba0 = ba[0].split('|');
	var ba1 = ba[1].split('|');
	if (!checkArrIs(ba0, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/) || !checkArrIs(ba1, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
		return 0;
	}
	if ((ba0.length + ba1.length) < 8) {
		return 0;
	}
	switch (ba0.length) {
		case 1:
			switch (ba1.length) {
				case 7:
					return 1;
				case 8:
					return 8;
				case 9:
					return 36;
				case 10:
					return 120;
			}
		case 2:
			switch (ba1.length) {
				case 6:
					return 1;
				case 7:
					return 7;
				case 8:
					return 28;
				case 9:
					return 84;
			}
		case 3:
			switch (ba1.length) {
				case 5:
					return 1;
				case 6:
					return 6;
				case 7:
					return 21;
				case 8:
					return 56;
			}
		case 4:
			switch (ba1.length) {
				case 4:
					return 1;
				case 5:
					return 5;
				case 6:
					return 15;
				case 7:
					return 35;
			}
		case 5:
			switch (ba1.length) {
				case 3:
					return 1;
				case 4:
					return 4;
				case 5:
					return 10;
				case 6:
					return 20;
			}
		case 6:
			switch (ba1.length) {
				case 2:
					return 1;
				case 3:
					return 3;
				case 4:
					return 6;
				case 5:
					return 10;
			}
		case 7:
			return ba1.length;
	}
}

//定位胆-大小单双
function calc_dwd_dxds(ba) {
	if (ba.length < 2 || ba[1] == "") {
		return 0;
	}
	var zhushu = 0;
	for (var i = 1, len = ba.length; i < len; i += 1) {
		var res = ba[i].split(/[\|\/]/);
		if (checkArrIs(res, /^([0-3])$/)) {
			zhushu += res.length;
		}
	}
	return zhushu;
}

// 和值-大小单双
function calc_sum_dxds(ba) {
	if (ba.length < 1 || !checkArrIs(ba, /^([0-5])$/)) {
		return 0;
	} else {
		return ba.length;
	}
}

function calc_lhd(ba) {
	if (ba.length < 1 || !checkArrIs(ba, /^([0-4]v[0-4])$/)) {
		return 0;
	} else {
		return ba.length;
	}
}

function calc_q5z1(ba) {
	if (ba.length < 1 || !checkArrIs(ba, /^(([0][1-9]|[1][0-1])|([1-9]|[1][0-1]))$/)) {
		return 0;
	} else {
		return ba.length;
	}
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

// 判断数组元素是否都为一种格式
function checkArrIs(_arr, preg) {
	for (var k in _arr) {
		if (!preg.test(_arr[k])) {
			return false;
		}
	}
	return true;
}

//去除数组中的重复值
function repeatArr(arr){
	var res = [];
	var jsons = {};
	for(var i = 0; i < arr.length; i++){
		if (!jsons[`${parseInt(arr[i])}`]) {
			res.push(arr[i]);
			jsons[`${parseInt(arr[i])}`] = 1;
		}
	}
	return res;
}