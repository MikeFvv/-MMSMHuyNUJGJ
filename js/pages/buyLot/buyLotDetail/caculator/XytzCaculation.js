/**
 Created by Ward on 2018/08/14
 经典梯子注数计算
 */

export default {

    getXytzNumMethod(playid, pickerArr) {

        if (pickerArr.length > 0) {
            return pickerArr.length;

        } else {
            return 0;
        }
    }
}