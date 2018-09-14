
/**
	Created by Money on 2018/08/12
	幸运扑克注数计算
*/

export default {

	getXypkNumMethod(playid, pickerArr) {

		if (playid == 1) { // 包选
			return pickerArr.length;

		} else if (playid == 2 || playid == 3 || playid == 4 || playid == 5 || playid == 6) { // All单选
			return pickerArr.length;

		} else if (playid == 7) { // 任选一
			return pickerArr.length;

		} else if (playid == 8) { // 任选二
			return calc_rx2(pickerArr);

		} else if (playid == 9) { // 任选三
			return calc_rx3(pickerArr);

		} else if (playid == 10) { // 任选四
			return calc_rx4(pickerArr);

		} else if (playid == 11) { // 任选五
			return calc_rx5(pickerArr);

		} else if (playid == 12) { // 任选六
			return calc_rx6(pickerArr);

		} else {
			return 0;
		}
	}
}


// 备注：组合算法

function calc_rx2(balls) {

	switch (balls.length) {
		case 2:
			return 1
		case 3:
			return 3
		case 4:
			return 6
		case 5:
			return 10
		case 6:
			return 15
		case 7:
			return 21
		case 8:
			return 28
		case 9:
			return 36
		case 10:
			return 45
		case 11:
			return 55
		case 12:
			return 66
		case 13:
			return 78
	}
}

function calc_rx3(balls) {
	switch (balls.length) {
		case 3:
			return 1
		case 4:
			return 4
		case 5:
			return 10
		case 6:
			return 20
		case 7:
			return 35
		case 8:
			return 56
		case 9:
			return 84
		case 10:
			return 120
		case 11:
			return 165
		case 12:
			return 220
		case 13:
			return 286
		default:
			return 0
	}
}

function calc_rx4(balls) {

	switch (balls.length) {
		case 4:
			return 1
		case 5:
			return 5
		case 6:
			return 15
		case 7:
			return 35
		case 8:
			return 70
		case 9:
			return 126
		case 10:
			return 210
		case 11:
			return 330
		case 12:
			return 495
		case 13:
			return 715
	}
}

function calc_rx5(balls) {

	switch (balls.length) {
		case 5:
			return 1
		case 6:
			return 6
		case 7:
			return 21
		case 8:
			return 56
		case 9:
			return 126
		case 10:
			return 252
		case 11:
			return 462
		case 12:
			return 792
		case 13:
			return 1287
	}
}

function calc_rx6(balls) {

	switch (balls.length) {
		case 6:
			return 1
		case 7:
			return 7
		case 8:
			return 28
		case 9:
			return 84
		case 10:
			return 210
		case 11:
			return 462
		case 12:
			return 924
		case 13:
			return 1716
	}
}

