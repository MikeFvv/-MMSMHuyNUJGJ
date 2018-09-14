/**
 Created by Ward on 2018/08/15
 pk10牛牛注数计算
 */

export default {

    getPkniuniuNumMethod(playid, pickerArr) {

        if (pickerArr.length > 0) {
            return pickerArr.length;

        } else {
            return 0;
        }
    }
}