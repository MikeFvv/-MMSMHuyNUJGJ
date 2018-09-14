
/**
 * Created by Mike on 2017/12/08.
 * 业主下载地址 使用例子： import DownAddress from './DownAddress';     DownAddress(index);
 */



// iOS 业主下载地址
export default (index) => {
    let urlPath = '';
    switch (index) {
        case 0:
            // 测试库
            return 'https://dafuvip.com/sky321';
        case 1:
            // 七天彩01
            return 'https://dafuvip.com/qtc001';
        case 2:
            // 七天彩02
            return '--';
        case 3:
            // 彩票榜01
            return 'https://dafuvip.com/cpb001';
        case 4:
            // 彩票榜02
            return 'https://dafuvip.com/cpb002';
        case 5:
            // 567彩01
            return 'https://dafuvip.com/567cp1';
        case 6:
            // 567彩02
            return 'https://dafuvip.com/567cp2';
        case 7:
            // 好彩 02
            return 'https://dafuvip.com/hchc02';
        case 8:
            // 好彩 01
            return 'https://dafuvip.com/hchc01';
        case 9:
            // 大发彩票 01  URL 交换
            return '--';
        case 10:
            // 大发彩票 02  URL 交换
            return 'https://dafuvip.com/dafa02';
        case 11:
            // M567C01 
            return 'https://dafuvip.com/567cp1';
        case 12:
            // M567C02
            return 'https://dafuvip.com/567cp2';
        case 13: 
            // M369C01   369彩P-01  直营
            return 'https://itunes.apple.com/cn/app/id1329177895';
        case 14:
            // M369C02  369彩P-02  代理
            return 'https://itunes.apple.com/cn/app/id1329177895';
        case 15:
            // MQC01  Q彩-01  直营 
            return '--';
        case 16:
            // MQC02  Q彩-02  代理
            return 'https://dafuvip.com/qcqc02';
        default:
            // 测试库
            return urlPath;
    }
    return urlPath;
};