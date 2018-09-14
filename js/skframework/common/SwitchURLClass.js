
/**
 * Created by Mike on 2017/11/11.
 * 业主URL 使用例子： import SwitchURL from './SwitchURL';     SwitchURL(index);
 */


// 业主URL
export default (index) => {
    // http://www.94flash.com
    switch (index) {
        case 0:
            // 测试库    
            //return 'http://test.ce64.com';   // 永城彩票
            return 'http://qaclient.sg04.com';   // QA测试
            //  return 'http://app.zjgguolong.com';   // 测试外网
            //  return 'http://client.sg04.com';     // 测试内网
             // return 'http://client1.sg04.com';     // mycat
            //  return 'http://ios.1153345.com';    // 迅盈彩票
            //  return 'http://ios4.yktytools.com';    // F彩    toltal001  fcadmin001
            //  return 'http://app.app679zzz.com';   // 679彩   时时采彡-掌上助手
            //  return 'http://hcw201.com';    //hcw901.com 红彩   tuhao002   123123qaz

        case 1:
            // 七天彩01
            return 'http://www.qtc000.com';
        case 2:
            // 七天彩02
            return 'http://www.qtc000.com';
        case 3:
            // 彩票榜01
            return 'http://cpb0005.com';
        case 4:
            // 彩票榜02
            return 'http://cpb0004.com';
        case 7:
            // 好彩 02
            return 'http://999-app111.com';
        case 8:
            // 好彩 01
            return 'http://999-app111.com';
        case 9:
            // 大发彩票 01  URL 交换
            return 'http://vip0234.com';
        case 10:
            // 大发彩票 02  URL 交换
            return 'http://vip0234.com1';
        case 11:
            // M567C01 
            return 'http://567mm.cc';
        case 12:
            // M567C02
            return 'http://rn.bsspjx.com';
        case 13:
            // M369C01   369彩P-01  直营
            return 'http://369app-linkgoping.com';
        case 14:
            // M369C02  369彩P-02  代理
            return 'http://369app-linkgoping.com';
        case 15:
            // MQC01  Q彩-01  直营 
            return 'ios.svsbearing.com';
        case 16:
            // MQC02  Q彩-02  代理
            return 'ios.svsbearing.com';
        case 17:
            // 易发彩票  YFCP01
            return 'android1.ios1256.com';
        case 18:
            // 易发彩票  YFCP02
            return 'http://android2.ios1256.com	';
        case 19:
            // 九州
            return 'http://hh1700.com';

        default:
            // 测试库
            return "";
    }
    return "";
};