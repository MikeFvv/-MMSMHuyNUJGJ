/**
 * Created by Mike on 2017/9/22.
 * 下面使用的都不用再导入 ， 可以直接使用， 每个的上面有使用例子
 */
import React, { Component } from 'react';
import {
    Dimensions, PixelRatio,
    Platform, Alert, DeviceEventEmitter, AsyncStorage, Text
} from 'react-native';
import FontSize from '../component/TextSize';
import Colors from '../component/Colors';
import BaseNetwork from '../component/BaseNetwork';
import Adaption from '../tools/Adaption';
import RNLoading from '../component/RNLoading';   //加载框
import RNDelegtLoading from '../component/RNDelegtLoading';   //加载框
import RNAlertView from '../component/RNAlertView'; //自定义弹框
import UserInfo from '../../skframework/common/UserInfoObject';
import Config from './Config';   // 配置文件
import GlobalStyles from './GlobalStyles'  // 全局样式
import CusIosBaseText from '../component/CusIosBaseText';//基础text
import RNRequest from '../common/Request'//fetch-blob网络请求
import AllenNavStyle from '../../pages/home/AllenNavStyle';
import AllenDragAndReplaceView from '../../allenPlus/AllenDragAndReplace';
import Regex from '../component/Regex'

let { height, width } = Dimensions.get('window');
const X_WIDTH = 375;
const X_HEIGHT = 812;

global.RouterIndex = null;

// ✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰
// 手动修改这里  ✰✰✰✰✰✰✰✰✰ 🐶🐶🐶 ✰✰✰✰✰✰✰✰✰

// 使用RN调整参数  默认 false
// 是  true  
// 否  false 
global.GLOBALisRNParameters = true;

// 切换路由
// 0 自动判断=>真页面或者输入域名页面；
// 1 真页面；
// 2 马甲页面；
global.SwitchRoute = 1;

// 版本号    版本号的格式：v<主版本号>.<副版本号>.<发布号>
global.VersionNum = 'v2.56.1';
// --------------------

// 业主请求URL 每个App的请求域名(每个App都不一样) 会返回不同的域名及状态
// Xcode运行会根据Xcode返回的确定具体Index ,  命名行运行默认显示 SwitchURLIndex的 Index
// 0 测试库；
// 1 七天彩01；    2 七天彩02；
// 3 彩票榜01；    4 彩票榜02；
// 8 好彩 01；     7 好彩 02；
// 9 大发彩票 01； 10 大发彩票 02;
// 11 M567C01-567彩01； 12 M567C02-567彩02;
// 13 M369C01-369彩P-01； 14 M369C02-369彩P-02;
// 15 MQC01-Q彩P-01； 16 MQC02-q彩P-02;
// 17 1256彩 易发彩票 YFCP01    18 1256彩 易发彩票 YFCP02;
global.SwitchURLIndex = 0;

// ✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰


// 系统是iOS    使用： 例  iOS?true:false,
global.iOS = (Platform.OS === 'ios');
// 系统是安卓   使用： 例  Android?true:false,
global.Android = (Platform.OS === 'android');
// 获取屏幕宽度  使用： 例  SCREEN_WIDTH
global.SCREEN_WIDTH = width;
// 获取屏幕高度  使用： 例  SCREEN_HEIGHT
global.SCREEN_HEIGHT = height;
// 获取屏幕分辨率  iPhone5 = 2  iPhone6 = 2  iPhone 6 Plus = 3
global.PixelRatio = PixelRatio.get();

// 最小线宽  没效果： 可以使用  1 / PixelRatio
// global.GlobalPixel = 1 / PixelRatio;

//判断字符串是”“或者空格或者连续空格
global.global_isSpace = (str) => {
    if (str == "") return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
}

// 常用颜色    使用： 例  COLORS.appColor
global.COLORS = Colors;
// 适配字体  使用： 例  FONT_SIZE(14)  会根据屏幕大小调整字体大小, 以iPhone5屏幕大小为基准字体
global.FONT_SIZE = FontSize;
// 弹出框  使用： 例 Alert.alert("提示弹框");
global.Alert = Alert;

// 网络请求  使用： 例  GlobalBaseNetwork.sendNetworkRequest(params);
global.GlobalBaseNetwork = BaseNetwork;
// 正则判断
global.GlobalRegex = Regex;

// 配置文件
global.GlobalConfig = Config;
// 全局样式
global.GlobalStyles = GlobalStyles;

//基础文本类
global.CusBaseText = global.iOS ? CusIosBaseText : Text;

//fetch-blob网络请求
global.RNRequest = RNRequest;

//字体适配的方法
global.Adaption = Adaption;

//默认进来是开启摇一摇和通知
global.isOpenShake = true;
global.Cpicon = '';
global.HomeBanner = '';
global.CPLinShiIcon = '';
global.CPYuMingShuRu = 0;

//全局
global.CustomNavBar = AllenNavStyle;

global.isSystemMaintain = false;   //是否是系统维护
global.SystemTime = '';   //维护时间
global.HomeYinDao = 0;   //首页引导
global.HomeIndex = 0;   

global.TouZhuGuide = 0;  // 投注是否显示引导页面 ，0不显示，1显示。

//全局可拖拽类
global.AllenDragAndReplaceView = AllenDragAndReplaceView;


//用户登录后存储的信息
global.UserLoginObject = {
    'session_key':'',
    'Uid': '',
    'Question_1': '',
    'Question_2': '',
    'Question_3': '',
    'Tkpass_ok': '',
    'Phone': '',
    'Email': '',
    'Wechat': '',
    'Qq_num': '',
    'Real_name': '',
    'Token': '',
    'TotalMoney': '',
    'UserName': '',
    'TKPrice': '',
    'UserHeaderIcon': '',
    'Sign_event': '',//判断每日签到通道是否开启 0 未开，1开启
    'Gift_event': '',//判断红包通道是否开启0 未开，1开启
    'Card_num': '',//默认的银行卡号 判断是否绑定银行卡
    'Level': '',//代理判断
    'is_Guest': '',//判断是否是试玩账号
    'RiseEvent': '',//是不是开放等级页面
    'fp_ssc': '', // 时时彩
    'fp_pcdd': '', // PC蛋蛋
    'fp_k3': '', // 快3
    'fp_pk10': '', // PK10
    'fp_3d': '', // 3D
    'fp_11x5': '', // 11选5
    'fp_lhc': '', // 六合彩
    'user_Name': '', //用户名称
    'user_Pwd': '',  //用户密码
    'rise_lock': '', //每日加奖是否跳动
    'codePWD' : '',  //加密登录密文
}

// 请求错误提示
global.NewWorkAlert = (param) => {
    Alert.alert(
        '提示',
        param,
        [
            {
                text: '确定', onPress: () => {
                }
            },
        ]
    )
}


// 通知监听的方法
global.PushNotification = DeviceEventEmitter;

//进度提示框
global.LoadingView = RNLoading;
//进度提示框
global.DelegtLoadingView = RNDelegtLoading;

//自定义Alert
global.RNAlert = RNAlertView;

//UserInfo
global.UserInfo = UserInfo;

//存储本地的方法
global.UserDefalts = AsyncStorage;
//存储所有彩种数据
global.AllZhongArray = [];
//存储首页彩种数据
global.HomeArray = [];
//存储首页高频彩种数据
global.HomeHeightZhongArray = [];
//存储首页低频彩种数据
global.HomeLowZhongArray = [];
//存储首页轮播图数据
global.SwiperArray = [];
//存储首页底部中奖榜数据
global.FootWinArray = [];
//存储首页系统公告数据
global.HomeSystemArray = [];
//存储不登录时公告字段
global.GongGaoContent = [];
//体彩
global.TiYuArray = [];
//存储登录时公告字段
global.GongGaoToeknContent = "";

global.PersonMessageArray = 0;
global.Hongbaolihe = 0;
global.Gerenfankui = 0;
global.Fuliqiandao = 0;
global.QianDaoWeiHu = 0;
global.AnQuanZhongXin = 0;
global.ShouYeYinDao = 0;
global.BankListArray = [];//银行卡列表数组



//存储玩法配置的模型
global.GameListConfigModel = {};

//公告弹窗
global.isTiShi = false;    // 是否不再提示
global.isMeDown = true;    // 我知道啦

global.invCode = ""; // 邀请码。

//存储银行列表
global.bankList = [];

// 弹出玩法时的一个内容
global.Wanfa = 0;    // 官方 or 信用
global.OneMenu = 0;   // 一级菜单（上面）
global.TwoMenu = 0;   // 二级菜单（下左）
global.ThreeMenu = 0; // 三级菜单（下右）

// 切官方信用时取
global.Wanfa_1 = 0;    // 官方 or 信用
global.OneMenu_1 = 0;   // 一级菜单（上面）
global.TwoMenu_1 = 0;   // 二级菜单（下左）
global.ThreeMenu_1 = 0; // 三级菜单（下右）

//新版玩法选择
global.currentLeftSelectIdx = 0; //默认选择左边第一个玩法

global.ShopHistoryArr = []; //保存用户选择的号码,和玩法数组
global.BeiShu = '1';     //保存用户选的倍数
global.ZhuiQiShu = '1';   //保存用户选的期数
global.LastSelectUnit = 0;  //上次选择的单位 0:元， 1：角, 2:分
global.CurrentQiShu = '';  //当前期数

global.GPlayDatas = {};  // 彩种存储
global.GTrendDatas = {};  // 走势数据存储
global.GTouZhuGameID = {};  // 记录投注的gameid,用来搞游戏偏好。

global.yearId = ''; // 年id，六合彩生肖用到

//缓存右上角的彩种列表
global.AllPlayGameList = [];
//游戏偏好
global.YouXiPianHaoData = [];

//缓存开奖大厅的数据
global.OpenAllData = [];
global.OpenAllData_tag = {};
global.openOpenAll = [];
// 是否固定
global.GlobalFixed = false;
//是否开启app全量更新
global.isOpenUpdate = false;
//默认android rootUrl
global.RootUrl = "http://plist.bxvip588.com";
global.secondUrl = "/list.php";
//安卓更新版本code
global.code = "101";
//android手机系统sdk等级 //默认兼容19以上
global.versionSDK = 21;

// 是否有网络 true  or  false
global.isFirstNetwork = true;

// 切换线路使用 线路存储
global.GlobalLineIPArray = [];
// 请求少于GlobalLineIPRequestMax次 继续请求
global.GlobalLineIPRequestMax = 10;

global.GlobalLineIPIndex = null;

// 购彩定时器
global.time = 0;

// 控制购彩界面随机刷球
global.random = true;

//是否显示用户等级头衔
global.RiseEvent = 0;

//是不是iphoneX  使用global.isIphoneX()
global.isIphoneX = () => {
    return (
        Platform.OS === 'ios' &&
        ((height === X_HEIGHT && width === X_WIDTH) ||
            (height === X_WIDTH && width === X_HEIGHT))
    );
};