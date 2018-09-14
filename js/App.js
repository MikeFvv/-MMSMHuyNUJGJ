import React from 'react';
import {
    AppRegistry, Text, View, Button, TouchableOpacity,
    StatusBar, StyleSheet, Platform, Image
} from 'react-native';

import { StackNavigator, TabNavigator,TabBarBottom,TabBarTop } from "react-navigation";

import Home from './pages/home/Home';
import BuyLot from './pages/buyLot/BuyLot';
import TheLot from './pages/theLot/TheLot';
import Trend from './pages/trend/MoneyTrend';
import Login from './pages/login/Login'; //登录界面
import Register from './pages/login/register/Register';  //注册界面
import More from './pages/me/more/More'; //更多设置
import AboutUs from './pages/me/more/Aboutus'; //关于我们
import Feedback from './pages/me/more/Feedback';
import WelFareTask from './pages/me/welfareTask/WelfareTask'; //福利任务
import SafetyCenter from './pages/me/safeCenter/Safetycenter';
import TheLotDatail from './pages/theLot/TheLotDatail';
import Preferential from './pages/home/Preferential';//优惠活动
import BuyTrend from './pages/trend/MoneyTrend'; // 走势2
import RoadPaper from './pages/buyLot/roadPaper/RoadPaper'; // 路纸图


import FinalChangeEncry from './pages/me/safeCenter/FinalChangeEncry'; //安全中心验证密保问题后修改

import MeWinRecord from './pages/me/win/MeWinRecord'; //中奖记录
import MeWinRecordDetails from './pages/me/win/MeWinRecordDetails'; //中奖记录详情
import Safetycenter from './pages/me/safeCenter/Safetycenter'; //中奖记录详情
import ChangePsd from './pages/me/safeCenter/ChangePsd'; //安全中心修改密码
import ChangeName from './pages/me/safeCenter/ChangeName'; //安全中心修改真实姓名
import BindQQ from './pages/me/safeCenter/BindQQ'; //安全中心修改QQ绑定
import ChangePhoNum from './pages/me/safeCenter/ChangePhoNum'; //安全中心修改手机号码
import BindWechat from './pages/me/safeCenter/BindWechat'; //安全中心绑定微信号
import BindEmail from './pages/me/safeCenter/BindEmail'; //安全中心绑定邮箱
import NewChangeTransPsd from './pages/me/safeCenter/newTradingPassword'; //安全中心绑定邮箱

import ChangeEncrypt from './pages/me/safeCenter/ChangeEncrypt'; //安全中心修改密保问题
import BuyRecord from './pages/me/win/BuyRecord'; //提款记录
import TheRecorDatail from './pages/me/win/TheRecorDatail'; //提款记录详情
import MoreNotification from './pages/home/MoreNotification'; //公告
import TouZhuRecord from './pages/home/TouZhuRecord'; //投注记录&购彩记录
import ForgetPWD from './pages/login/forgetpwd/Forgetpwd';  //忘记密码
import TouZhuZuCaiDanZhuDetial from './pages/home/TouZhuZuCaiDanZhuDetial'; //投注足球单注详情
import HomeComputMGGameView from './pages/home/HomeComputMGGameView'; //电子游戏
import HomeLandComputGameView from './pages/home/HomeLandComputGameView'; //电子游戏
import HomeMoreComputGameView from './pages/home/HomeMoreComputGameView'; //电子游戏
import HomeSearchMGGameView from './pages/home/HomeSearchMGGameView'; //搜索电子游戏
import HomeDianZiGameView from './pages/home/HomeDianZiGameView'; 
import FindPWD from './pages/login/forgetpwd/Findpassword';   //密码找回
import BuyLotDetail from './pages/buyLot/buyLotDetail/BuyLotDetail';
import PersonalMessage from './pages/home/PersonalMessage'; //个人消息
import ChatService from './pages/me/ChatSerivce';  //客服中心
import Theagency from './pages/me/win/Theagency'; //代理中心

import RechargeCenter from './pages/me/rechargeCenter/RechargeCenter'; //充值中心
import RechargeInfo from './pages/me/rechargeCenter/RechargeInfo'; //充值信息
import ThridWebPay from './pages/me/rechargeCenter/ThridWebPay'; //第三方web支付
import BankTransferInfo from './pages/me/rechargeCenter/BankTransferInfo'; //银行转账详情
import RechargeSubmit from './pages/me/rechargeCenter/RechargeSubmit'; //充值提交
import PayModelList from './pages/me/rechargeCenter/PayModelList'; //wx,qq,ali充值方式
import OnlineModelList from './pages/me/rechargeCenter/OnlineModelList'; //在线支付
import BankModelList from './pages/me/rechargeCenter/BankModelList'; //网银转账


import BindBankCard from './pages/me/drawalCenter/BindBankCard'; //绑定银行卡
import DrawalInfo from './pages/me/drawalCenter/DrawalInfo'; //提款信息
import DrawalSubmit from './pages/me/drawalCenter/DrawalSubmit'; //提款提交

import CashTrasaAcount from './pages/me/cashTrasaCenter/CashTrasaAcount'; //现金交易 输入账户
import CashTrasaInfo from './pages/me/cashTrasaCenter/CashTrasaInfo';//现金交易信息
import CashTrasaSubmit from './pages/me/cashTrasaCenter/CashTrasaSubmit';//现金交易提交

import Agenthat from './pages/me/win/TheDelegate/Agenthat'; //代理说明
import TheStatements from './pages/me/win/TheDelegate/TheStatements'; //代理说明
import DailyAttendance from './pages/me/welfareTask/DailyAttendance'; //每日签到
import LiShiDailyAtten from './pages/me/welfareTask/LiShiDailyAtten'; //每日签到历史
import RedPacketView from './pages/me/welfareTask/RedPacketView'; //红包活动
import ShopCarDetail from './pages/buyLot/buyLotDetail/shoppingCar/ShopCarDetail';//投注列表
import TouZhuDetial from './pages/home/TouZhuDetial'; //投注详情
import TheReportlower from './pages/me/win/TheDelegate/TheReportlower'     //下级报表
import TheLowerManager from './pages/me/win/TheDelegate/TheLowerManager'     //下级管理
import TheDetails from './pages/me/win/TheDelegate/TheDetails'     //交易明显
import TouZhuZongHeDetial from './pages/home/TouZhuZongHeDetial'; //足球综合过关投注详情

import TheSeenReport from './pages/me/win/TheDelegate/TheSeenReport'     //查看代理下级
import TheSeenManagement from './pages/me/win/TheDelegate/TheSeenManagement'     //查看代理下级


import DelegeTouZhuDetial from './pages/me/win/TheDelegate/DelegeTouZhuDetial'; //代理投注明细
import DelegeTouXiangQing from './pages/me/win/TheDelegate/DelegtTouXiangQing'; //代理投注明细详情
import BangBankCar from './pages/me/safeCenter/BangBankCar'; //银行卡列表
import ReviseBankCar from './pages/me/safeCenter/ReviseBankCar'; //修改银行卡

import FindpsTrans from './pages/login/forgetpwd/FindpsTrans'; //通过交易密码找回密码
import PasswordSetting from './pages/login/forgetpwd/PasswordSetting'; //找回密码重置
import FindpsEmail from './pages/login/forgetpwd/FindpsEmail'; //通过邮箱找回密码
import FindpsPhoneNum from './pages/login/forgetpwd/FindpsPhoneNum'; //通过手机号码找回密码
import FindpsEncrypt from './pages/login/forgetpwd/FindpsEncrypt'; //通过密保问题找回密码
import MyInfo from './pages/me/myinformation/MyInfo'; //个人信息页面

import GrowthDetail from './pages/me/myinformation/GrowthDetail'; //成长明细
import LevelReward from './pages/me/myinformation/LevelReward'; //等级奖励
import MissionPackage from './pages/me/myinformation/MissionPackage'; //任务礼包

import NewestWinBang from './pages/home/NewestWinBang'; //中奖榜
import PersonMessageDetial from './pages/home/PersonMessageDetial'; //个人消息详情
import ApplicationAgentDelege from './pages/me/win/ApplicationAgentDelege'; //申请代理
import PreferentialDetial from './pages/home/PreferentialDetial'; //活动详情
import FreeShiWan from './pages/login/register/FreeShiWan';  //免费试玩

import SubAccount from './pages/me/agentCenter/subAccount/SubAccount'; // 下级开户
import RebateOddsTable from './pages/me/agentCenter/subAccount/RebateOddsTable'; // 返点赔率表
import AddDomainName from './pages/me/agentCenter/subAccount/AddDomainName'; // 添加域名

import LocalImg from "./res/img";
import LocalImages from "../publicconfig/images";
import AccountDetails from "./pages/me/accountDetails/AccountDetails";//账户详情
import RechargeRecord from "./pages/me/accountDetails/RechargeRecord";//充值记录
import RechargeDetail from "./pages/me/accountDetails/RechargeDetail";//充值详情
import TodayProfitLoss from './pages/me/TodayProfitLoss';//今日盈亏
import ServiceArgreement from './pages/me/ServiceProtocal';  //服务协议
import NoNetworkPrompt from './pages/home/NoNetworkPrompt'


import NewMe from "./pages/me/newMe/NewMe";
import FeedbackList from "./pages/me/newMe/FeedbackList";
import FeedBackListDetial from "./pages/me/newMe/FeedBackListDetial";
//智能追号
import SmartChaseNumber from './pages/buyLot/buyLotDetail/touzhu2.0/SmartChaseNumber/SmartChaseNumber';//智能追号
import AllenSmartChaseNumberVersion2 from './pages/buyLot/buyLotDetail/touzhu2.0/SmartChaseNumber/AllenSmartChaseNumberVersion2'; //智能追号version2
import AllenSmartChaseNumberVersion3 from './pages/buyLot/buyLotDetail/touzhu2.0/SmartChaseNumber/AllenSmartChaseNumberVersion3'; //智能追号version3

import KnowChanPlan3 from './pages/buyLot/buyLotDetail/touzhu2.0/SmartChaseNumber/KnowChanPlan';//智能追号3.0
import HighEnergy from './pages/buyLot/buyLotDetail/touzhu2.0/SmartChaseNumber/HighEnergy';//智能追号3.0


//自定义tabBar
import TabJs from './allenPlus/AllenTabBar';
import AllenShortCutMainView from './allenPlus/AllenShortCutMainView';
import HomeCustmCaiZhongView from './pages/home/HomeCustmCaiZhongView'; //自定义彩种
import EmptyClass from './pages/home/Empty'

import FootballGame from './pages/buyLot/FootBall/FootballGame';  // 足球Buy详情
import FBAllGame from './pages/buyLot/FootBall/FBGameCenter/AllGame/FBAllGame'; // 足球所有玩法
import Screening from './pages/buyLot/FootBall/more/Screening';  // 足球 筛选联赛
import GameRulesHome from './pages/buyLot/FootBall/GameRules/GameRulesHome'; // 足球玩法规则

//测试用
import AllenTestView from './allenPlus/AllenTestDemo';
import AllenDragShortCutMainView from './allenPlus/AllenDragShortCutMainView';
import FBShopCarView from './pages/buyLot/FootBall/fbShopCar/FBShopCarList'; //体彩购物车列表
import FootballResult from './pages/buyLot/FootBall/Result/FootballResult';
import FootballResultDetail from "./pages/buyLot/FootBall/Result/FootballResultDetail";
import FootballPeilvCaculate from './pages/buyLot/FootBall/more/PeilvCaculateTable';  //足彩赔率计算表

//新全部彩种界面
import NewBuyLot from './pages/buyLot/NewBuyLot';

//SsReturnWater时时返水
import  SsReturnWater from './pages/me/more/SsReturnWater';

// IP限制
import IPLimit from "./pages/me/IPLimit";

// 通过TabNavigator做路由映射
const MainTab = TabNavigator({
    Home: {
        screen: Home,
        navigationOptions: () => TabOptions('首页', LocalImg.ic_tabbar_home, LocalImages.ic_tabbar_home_active, '首页'),
    },
    TheLot: {
        screen: TheLot,
        navigationOptions: () => TabOptions('开奖', LocalImg.ic_tabbar_thelot,LocalImages.ic_tabbar_thelot_active, '开奖'),
    },
    EmptyClass: {
        screen: EmptyClass,
        navigationOptions: () => TabOptions('购彩', LocalImg.ic_tabbar_buylot, LocalImages.ic_tabbar_buylot_active, '购彩大厅'),
    },
    Trend: {
        screen: Trend,
        navigationOptions: () => TabOptions('走势', LocalImg.ic_tabbar_trend, LocalImages.ic_tabbar_trend_active, '走势'),
    },
    Me: {
        screen: NewMe,
        navigationOptions: () => TabOptions('我的', LocalImg.ic_tabbar_me, LocalImages.ic_tabbar_me_active),
    },
}, {
        tabBarComponent:TabJs,

        animationEnabled: false,  // 是否在更改标签时显示动画。
        tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
        swipeEnabled: false, // 是否允许在标签之间进行滑动。
        lazy: true, // 是否根据需要懒惰呈现标签，而不是提前制作，意思是在app打开的时候将底部标签栏全部加载，默认false,推荐改成true哦。
        backBehavior: 'none', // 按 back 键是否跳转到第一个 Tab， none 为不跳转
        StatusBar: {
            translucent: true,
        },
        tabBarOptions: {
            // iOS属性
            // 因为第二个tabbar是在页面中创建的，所以前景色的设置对其无效，当然也可以通过设置tintColor使其生效
            activeTintColor: COLORS.appColor, // label和icon的前景色 活跃状态下（选中）。
            inactiveTintColor: '#999', // label和icon的前景色 不活跃状态下(未选中)。

            activeBackgroundColor: '#ffffff', //label和icon的背景色 活跃状态下（选中） 。
            inactiveBackgroundColor: '#ffffff', // label和icon的背景色 不活跃状态下（未选中）。

            showLabel: true, // 是否显示label，默认开启。
            style: {
                height: 49,
                backgroundColor: '#f3f3f3', // TabBar 背景色
            }, // tabbar的样式。
            labelStyle: { fontSize: 13 }, //label的样式。
            iconStyle: {
                margin: (Platform.OS === 'android') ? -7 : {},//对于安卓底部tab适配
            },
            // 安卓属性

            // activeTintColor:'', // label和icon的前景色 活跃状态下（选中） 。
            // inactiveTintColor:'', // label和icon的前景色 不活跃状态下(未选中)。
            showIcon: true, // 是否显示图标，默认关闭。
            // showLabel:true, //是否显示label，默认开启。
            // style:{}, // tabbar的样式。
            // labelStyle:{}, // label的样式。
            upperCaseLabel: false, // 是否使标签大写，默认为true。
            // pressColor:'', // material涟漪效果的颜色（安卓版本需要大于5.0）。
            // pressOpacity:'', // 按压标签的透明度变化（安卓版本需要小于5.0）。
            // scrollEnabled:false, // 是否启用可滚动选项卡。
            // tabStyle:{}, // tab的样式。
            indicatorStyle: { height: 0 }, // android 中TabBar下面会显示一条线，高度设为 0 后就不显示线了
            // labelStyle:{}, // label的样式。
            // iconStyle:{}, // 图标的样式。
        },
    });




const MainNav = StackNavigator({

    MainTab: { screen: MainTab },
    // 将TabNavigator包裹在StackNavigator里面可以保证跳转页面的时候隐藏tabbar

    //将需要跳转的页面注册在这里，全局才可以跳转
    Login: { screen: Login },
    MoreSetting: { screen: More },
    AboutUs: { screen: AboutUs },
    Feedback: { screen: Feedback },
    WelfareTask: { screen: WelFareTask },
    SafetyCenter: { screen: SafetyCenter },
    TheLotDatail: { screen: TheLotDatail },
    Preferential: { screen: Preferential },
    BuyTrend: { screen: BuyTrend },
    RoadPaper: {screen: RoadPaper },
    BuyLot: { screen: BuyLot,},
    MeWinRecord: { screen: MeWinRecord },
    //账单详情界面
    AccountDetails: { screen: AccountDetails },
    MeWinRecordDetails: { screen: MeWinRecordDetails },
    Safetycenter: { screen: Safetycenter },
    BuyRecord: { screen: BuyRecord },
    MoreNotification: { screen: MoreNotification },
    Register: { screen: Register },
    TouZhuRecord: { screen: TouZhuRecord },
    ForgetPWD: { screen: ForgetPWD },
    FindPWD: { screen: FindPWD },
    BuyLotDetail: { screen: BuyLotDetail },
    PersonalMessage: { screen: PersonalMessage },
    ChatService: { screen: ChatService },
    Theagency: { screen: Theagency },

    ChatService: { screen: ChatService },
    Theagency: { screen: Theagency },
    Agenthat: { screen: Agenthat },
    TheStatements: { screen: TheStatements },
    ChangePsd: { screen: ChangePsd },
    ChangeName: { screen: ChangeName },
    BindQQ: { screen: BindQQ },
    ChangePhoNum: { screen: ChangePhoNum },
    BindWechat: { screen: BindWechat },
    BindEmail: { screen: BindEmail },
    FinalChangeEncry: { screen: FinalChangeEncry },
    DailyAttendance: { screen: DailyAttendance },
    RedPacketView: { screen: RedPacketView },
    ShopCarView: { screen: ShopCarDetail },

    TouZhuDetial: { screen: TouZhuDetial },
    TheReportlower: { screen: TheReportlower },
    TheLowerManager: { screen: TheLowerManager },
    ChangeEncrypt: { screen: ChangeEncrypt },
    TheDetails: { screen: TheDetails },
    DelegeTouZhuDetial: { screen: DelegeTouZhuDetial },
    DelegeTouXiangQing: { screen: DelegeTouXiangQing },

    TheSeenReport: { screen: TheSeenReport },
    TheSeenManagement: { screen: TheSeenManagement },
    BangBankCar: { screen: BangBankCar },
    RechargeRecord: { screen: RechargeRecord },//充值记录
    ReviseBankCar: { screen: ReviseBankCar },
    TheRecorDatail: { screen: TheRecorDatail },
    AccountDetails: { screen: AccountDetails },
    MeWinRecordDetails: { screen: MeWinRecordDetails },
    Safetycenter: { screen: Safetycenter },
    BuyRecord: { screen: BuyRecord },
    MoreNotification: { screen: MoreNotification },
    Register: { screen: Register },
    TouZhuRecord: { screen: TouZhuRecord },
    TouZhuZuCaiDanZhuDetial: { screen: TouZhuZuCaiDanZhuDetial },
    ForgetPWD: { screen: ForgetPWD },
    FindPWD: { screen: FindPWD },
    BuyLotDetail: { screen: BuyLotDetail },
    PersonalMessage: { screen: PersonalMessage },
    ChatService: { screen: ChatService },
    Theagency: { screen: Theagency },
    FeedBackListDetial: { screen: FeedBackListDetial },

    Agenthat: { screen: Agenthat },
    ChangePsd: { screen: ChangePsd },
    ChangeName: { screen: ChangeName },
    BindQQ: { screen: BindQQ },
    ChangePhoNum: { screen: ChangePhoNum },
    BindWechat: { screen: BindWechat },
    BindEmail: { screen: BindEmail },
    ChangeTransPsd: { screen: NewChangeTransPsd },
    FinalChangeEncry: { screen: FinalChangeEncry },
    DailyAttendance: { screen: DailyAttendance },
    RedPacketView: { screen: RedPacketView },
    ShopCarView: { screen: ShopCarDetail },

    TouZhuDetial: { screen: TouZhuDetial },
    TheReportlower: { screen: TheReportlower },
    TheLowerManager: { screen: TheLowerManager },
    ChangeEncrypt: { screen: ChangeEncrypt },
    TheDetails: { screen: TheDetails },
    DelegeTouZhuDetial: { screen: DelegeTouZhuDetial },
    DelegeTouXiangQing: { screen: DelegeTouXiangQing },

    TheSeenReport: { screen: TheSeenReport },
    TheSeenManagement: { screen: TheSeenManagement },
    BangBankCar: { screen: BangBankCar },
    RechargeRecord: { screen: RechargeRecord },//充值记录
    RechargeDetail: { screen: RechargeDetail },
    ReviseBankCar: { screen: ReviseBankCar },
    TheRecorDatail: { screen: TheRecorDatail },

    //交易中心
    RechargeCenter: { screen: RechargeCenter },
    RechargeInfo: { screen: RechargeInfo },
    BankTransferInfo: { screen: BankTransferInfo },
    ThridWebPay: { screen: ThridWebPay },
    RechargeSubmit: { screen: RechargeSubmit },
    DrawalSubmit: { screen: DrawalSubmit },
    PayModelList: { screen: PayModelList },
    OnlineModelList: { screen: OnlineModelList },
    BankModelList: { screen: BankModelList },
    FeedbackList: { screen: FeedbackList },//意见反馈
    

    //提款中心
    BindBankCard: { screen: BindBankCard },
    DrawalInfo: { screen: DrawalInfo },
    DrawalSubmit: { screen: DrawalSubmit },
    HomeComputMGGameView: { screen: HomeComputMGGameView },
    HomeLandComputGameView: { screen: HomeLandComputGameView },
    HomeMoreComputGameView: { screen: HomeMoreComputGameView },
    HomeSearchMGGameView: { screen: HomeSearchMGGameView },
    HomeDianZiGameView: { screen: HomeDianZiGameView },

    //现金交易
    CashTrasaAcount: { screen: CashTrasaAcount },
    CashTrasaInfo: { screen: CashTrasaInfo },
    CashTrasaSubmit: { screen: CashTrasaSubmit },
    NewestWinBang: { screen: NewestWinBang },
    PersonMessageDetial: { screen: PersonMessageDetial },
    ApplicationAgentDelege: { screen: ApplicationAgentDelege },
    PreferentialDetial: { screen: PreferentialDetial },
    FreeShiWan: { screen: FreeShiWan },

    //找回密码
    FindpsTrans: { screen: FindpsTrans },
    PasswordSetting: { screen: PasswordSetting },
    FindpsEmail: { screen: FindpsEmail },
    FindpsPhoneNum: { screen: FindpsPhoneNum },
    FindpsEncrypt: { screen: FindpsEncrypt },

    //个人信息
    MyInfo: { screen: MyInfo },
    GrowthDetail: { screen: GrowthDetail },
    LevelReward: { screen: LevelReward },
    MissionPackage: { screen: MissionPackage },

    // 下级开户
    SubAccount: { screen: SubAccount },
    // 返点赔率表
    RebateOddsTable: { screen: RebateOddsTable },
    // 添加域名
    AddDomainName: { screen: AddDomainName },
    TouZhuZongHeDetial: { screen: TouZhuZongHeDetial },

    //服务协议
    ServiceArgreement: { screen: ServiceArgreement },
    LiShiDailyAtten: { screen: LiShiDailyAtten },
    TodayProfitLoss: { screen: TodayProfitLoss },
    NoNetworkPrompt: { screen: NoNetworkPrompt },

    //智能追号
    SmartChaseNumber:{screen:SmartChaseNumber},
    KnowChanPlan3:{screen:KnowChanPlan3},
    HighEnergy:{screen:HighEnergy},

    //智能追号Version
    AllenSmartChaseNumberVersion2:{screen:AllenSmartChaseNumberVersion2},

    //智能追号Version3版本
    AllenSmartChaseNumberVersion3:{screen:AllenSmartChaseNumberVersion3},

    //自定义彩种
    HomeCustmCaiZhongView:{screen:HomeCustmCaiZhongView},

    //+ plus
    AllenShortCutMainView:{screen:AllenShortCutMainView},

    FootballGame: {screen: FootballGame},  // 足球
    FBAllGame: {screen: FBAllGame}, // 足球所有玩法
    Screening : {screen: Screening },  // 筛选联赛
    FBShopCar : {screen: FBShopCarView}, //体彩购物车列表
    GameRulesHome: {screen: GameRulesHome},  // 足球玩法规则
    PeilvCaculate: {screen: FootballPeilvCaculate},//足彩赔率计算表


    FootballResult:{screen:FootballResult}, //足球结果
    FootballResultDetail:{screen:FootballResultDetail}, //足球结果详情
    //拖拽测试 (以后会删除)
    AllenTestView:{screen:AllenTestView},
    //拖拽正式版
    AllenDragShortCutMainView:{screen:AllenDragShortCutMainView},


    //新全部彩种
    NewBuyLot:{screen:NewBuyLot},

    //时时返水
    SsReturnWater:{screen:SsReturnWater},
    
});



const TabOptions = (tabBarTitle, normalImage, selectedImage, navTitle) => {

    const tabBarLabel = tabBarTitle;
    const tabBarIcon = (({ tintColor, focused }) => {
        return (
            <Image resizeMode="stretch"
                // 可以用过判断focused来修改选中图片和默认图片
                source={!focused ? normalImage : selectedImage}
                // 如果想要图标原来的样子可以去掉tintColor
                // style={[(Platform.OS === 'ios') ? { height: 26, width: 26 } : { height: 24, width: 24 }, { tintColor: tintColor }]}
          // {/*春节代码，源代码上面*/}
                   style={[(Platform.OS === 'ios') ? { height: 26, width: 26 } : { height: 24, width: 24 }]}

            />
        )
    });
    const headerTitle = navTitle;
    const headerTitleStyle = { fontSize: 18, color: 'white', alignSelf: 'center' };
    // header的style
    const headerStyle={backgroundColor: COLORS.appColor, marginTop: Android ?(parseFloat(global.versionSDK) > 19?StatusBar.currentHeight:0) : 0};
    const tabBarVisible = true;
    // const header = null;
    return { tabBarLabel, tabBarIcon, headerTitle, headerTitleStyle, headerStyle, tabBarVisible };
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
});

export default MainNav;
