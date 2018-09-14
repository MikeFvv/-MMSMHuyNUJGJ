
/**
	Created by Money on 2018/08/12
	幸运农场注数计算
*/

export default {

	getXyncNumMethod(playid, pickerArr) {

		if (pickerArr.length > 0) {
			return pickerArr.length;

		} else {
			return 0;
		}
	}
}
