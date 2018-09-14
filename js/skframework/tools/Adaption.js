

import {Dimensions} from 'react-native';

// 对没错，在这里拿到了屏幕的宽高了。
const {width, height} = Dimensions.get('window');

// 以414，736为宽高标准。
const BaseWidth = 414;
const BaseHeight = 736;

const AdaptionWidth = width / BaseWidth;
const AdaptionHeight = (height == 812 ? (height - 34 - 22) : height) / BaseHeight;

export  default {

    // 传一个你想要的字体大小，和一个你期待适配后的字体不能小于的字体大小
    // 使用：fontSize: Adaption.Font(17, 15)
    Font(mainFont, minFont) {
        return  (mainFont * AdaptionWidth) <= minFont ? minFont : mainFont * AdaptionWidth;
    },

    Height(height) {
        return height * AdaptionHeight;
    },

    Width(width) {
        return width * AdaptionWidth;
    },
}

// 使用之前，要先import Adaption from  '从哪里来的';
// 高：Adaption.Height(100)