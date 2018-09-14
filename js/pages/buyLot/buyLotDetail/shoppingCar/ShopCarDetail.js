import React, {Component} from 'react';

import {
    StyleSheet,
    View,
    Alert,
    TouchableOpacity,
    FlatList,
    Image,
    Text,
    TextInput,
    ImageBackground,
    Modal,
    Dimensions, Animated, Easing
} from 'react-native';

import Toast, {DURATION} from 'react-native-easy-toast'

import NormalHeader from './normalCZ/NormalHeaderView'; //普通彩种的头部
import NormalBottom from './normalCZ/NormalBottomTool'; //普通彩种的底部
import AllenKeyboard from '../../../../allenPlus/AllenKeyboard';
import GetBallStatus from '../touzhu2.0/newBuyTool/GetBallStatus';

import TouZhuParam from '../TouZhuParam'; // 最终投注需要的参数
import RandomPlay from './RandomPlay'; // 随机
import AllenBottomTool from './normalCZ/AllenBottomTool';
import CusIosBaseText from "../../../../skframework/component/CusIosBaseText";

var currentQiShu = '';  //定义当前期数
var isRemindJieZhi = false; //是否提示用户到期
let iphoneX = global.iOS ? (SCREEN_HEIGHT == 812 ? true : false) : 0; //是否是iphoneX
export default class ShopCarDetail extends Component {

    static navigationOptions = ({navigation, screenProps}) => ({

        header: (
            null
        ),
    })

    //构造器
    constructor(props) {
        super(props);

        this.state = ({
            isArgree: true,      // 是否同意协议
            isStop: true,      // 是否中奖追停 默认不停
            tag: this.props.navigation.state.params.playDataModel.tag ? this.props.navigation.state.params.playDataModel.tag : '',  //传过来的彩种tag
            js_tag: this.props.navigation.state.params.playDataModel.js_tag,
            speed: this.props.navigation.state.params.playDataModel.speed,
            dataSource: this.props.navigation.state.params.dataModelArr ? this.props.navigation.state.params.dataModelArr : [],  //传过来的号码数组
            currentTime: this.props.navigation.state.params.leaveTime,   //开奖截止时间
            currentFengPan: this.props.navigation.state.params.fengPanTime, //封盘时间
            totalPrice: 0,   //总价格
            totalZhuShu: 0,  //总的注数
            perPrice: 0, //单注价格
            beiShu: global.BeiShu, //倍数默认为1倍
            zhuiQiShu: global.ZhuiQiShu,  //追多少期
            isShowBallsDetail: false,  //是否显示号码详情
            currentLookBallsText: '',  //当前查看的号码详情
            currentLookWanFaTitle: '', //当前查看的投注号码玩法名称
            marginTop: 0,
            showKeyboard: false,
            addValue: 60,
            currentInputPriceIndex: -1, //当前输入金额的Item
            isLockFengPan: this.props.navigation.state.params.fengPanTime > 0 ? false : true,  //是否显示已封盘
        })
        currentQiShu = global.CurrentQiShu;
        this.inputPriceLength = '';
        this.comformTouZhuWating = false; //防止快速点击下注按钮

        // this.animatedValue = new Animated.Value(0);
        // this.marginTop = this.animatedValue.interpolate({
        //     inputRange: [0, 1],
        //     outputRange: [0, -(Adaption.Height(270))]
        // })
    }

    componentWillReceiveProps(nextProps) {

        //手动添加重新计算注数，期数，价格
        if (nextProps.navigation.state.params.dataModelArr.length != 0) {

            this._caculateDataInFo(nextProps.navigation.state.params.dataModelArr, nextProps.navigation.state.params.playDataModel.tag);
        }

    }

    //每次进来重新计算注数, 倍数, 期数, 单价, 总价
    _caculateDataInFo(dataArr, playTag) {

        //六合彩不用计算期数
        if (playTag == 'xglhc') {

            let singlePrice = 0;               //单价
            let zhushu = 0;                   //总的注数
            let totalPrice = 0;               //总的价格
            let beishu = parseInt(global.BeiShu);       //倍数
            let zhuiQi = parseInt(global.ZhuiQiShu);   //追期数
            let shopModel = {};

            for (let i = 0; i < dataArr.length; i++) {

                shopModel = dataArr[i];
                zhushu += shopModel.value.zhushu;  //计算总的注数
                totalPrice += shopModel.value.zhushu * beishu * shopModel.value.singlePrice;
            }

            //重新赋值
            this.setState({

                totalZhuShu: zhushu,
                totalPrice: totalPrice,
                beiShu: beishu,
                zhuiQiShu: zhuiQi,
            })

        } else {

            let singlePrice = 0;               //单价
            let zhushu = 0;                   //总的注数
            let totalPrice = 0;               //总的价格
            let beishu = parseInt(global.BeiShu);       //倍数
            let zhuiQiShu = parseInt(global.ZhuiQiShu);  //期数
            let shopModel = {};

            for (let i = 0; i < dataArr.length; i++) {

                shopModel = dataArr[i];
                zhushu += shopModel.value.zhushu;  //计算总的注数
                totalPrice += shopModel.value.zhushu * beishu * shopModel.value.singlePrice * zhuiQiShu;
            }

            //重新赋值
            this.setState({

                totalZhuShu: zhushu,
                totalPrice: totalPrice,
                beiShu: beishu,
                zhuiQiShu: zhuiQiShu,
            })
        }

    }

    componentDidMount() {

        global.isInShopCarVC = true; //是否在购物车界面
        global.isInBuyLotVC = false;  //是否在投注界面

        this.props.navigation.setParams({
            clearShopCar: this._clearShopCar,
        })

        //接受倒计时通知,弹出是否清空购物车界面
        this.subscription = PushNotification.addListener('CountTimeDeadLine1', () => {

            //已经选了内容的
            if (isRemindJieZhi == false && this.state.dataSource.length != 0 && global.isInShopCarVC == true && global.isInBuyLotVC == false) {
                //自定义弹窗
                this.refs.RNAlert && this.refs.RNAlert.show();
                this.refs.RNAlert && this.refs.RNAlert.dissmiss(3);
                isRemindJieZhi = true;
            }

            //延迟30秒设置为False,防止 通知过快重复弹窗
            setTimeout(() => {

                isRemindJieZhi = false;
            }, 30000);

        });
    }

    componentWillUnmount() {

        if (typeof(this.subscription) == 'object') {
            this.subscription && this.subscription.remove(); //移除通知
        }
    }

    //清空购物车的方法, 箭头函数，导航栏按钮的方法
    _clearShopCar = () => {

        if (this.state.totalZhuShu == 0) {
            global.ShopHistoryArr = [];
            global.BeiShu = '1';     //重新初始化，防止下次进来计算出错
            global.ZhuiQiShu = '1';
            PushNotification.emit('ClearShopCarOffNotification');  //清空购物车，屏蔽查看购物车按钮的通知
            PushNotification.emit('HandAutoAddNotification', 0);
            this.props.navigation.goBack();
        }
        else {
            Alert.alert(
                '温馨提示',
                '您是否要清空购物车',
                [
                    {
                        text: '取消', onPress: () => {
                        }
                    },
                    {
                        text: '确定', onPress: () => {
                            this._reasetShopCar();
                            PushNotification.emit('HandAutoAddNotification', 0);
                            this.props.navigation.goBack();
                        }
                    },
                ]
            )
        }
    }

    //重置购物车数据
    _reasetShopCar() {

        this.refs.Toast && this.refs.Toast.show('清空购物车成功!', 1000);

        this.setState({
            dataSource: [],
            totalPrice: 0,   //总价格
            totalZhuShu: 0,  //总的注数
            beiShu: 1, //倍数默认为1倍
            zhuiQiShu: 1, //默认追期数1
        })

        global.ShopHistoryArr = [];  //历史购物车赋空
        global.BeiShu = '1';     //重新初始化，防止下次进来计算出错
        global.ZhuiQiShu = '1';
        PushNotification.emit('ClearShopCarOffNotification');  //清空购物车，屏蔽查看购物车按钮的通知
    }

    _keyExtractor = (item, index) => {
        return String(index);
    }

    //加载视图
    _renderItemView = (item) => {

        let titleHeight = 35;  //标题的高度
        let numberHeight = 30; //号码详情的高度
        let zhushuHeight = 35;  //注数的高度

        let cellHeight = titleHeight + numberHeight + zhushuHeight + 5;  //动态计算高度

        return (
            <View style={{marginLeft: 12, marginRight: 12, marginTop: 5, height: cellHeight, backgroundColor: '#fff'}}>

                <View style={{paddingLeft: 10, height: 30, justifyContent: 'center'}}>
                    <CusBaseText style={{fontSize: Adaption.Font(20, 17), color: '#6a6a6a'}}>
                        {item.item.value.wanfa}
                    </CusBaseText>
                </View>

                <View style={{paddingLeft: 10, height: 30, alignItems: 'center', flexDirection: 'row'}}>
                    <TouchableOpacity style={{flex: 0.48}} activeOpacity={0.5}
                                      onPress={() => {
                                          this.setState({
                                              isShowBallsDetail: true,
                                              currentLookBallsText: item.item.value.xiangqing,
                                              currentLookWanFaTitle: item.item.value.wanfa,
                                          })
                                      }}>
                        <CusBaseText numberOfLines={1} style={{fontSize: Adaption.Font(18, 16)}}>
                            {this._xiangqingBallsTextView(item.item.value.xiangqing)}
                        </CusBaseText>
                    </TouchableOpacity>
                    <View style={{flex: 0.4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <TextInput
                            style={{
                                borderBottomWidth: 0.5,
                                borderColor: "#a5a5a5",
                                width: Adaption.Width(100),
                                height: 25,
                                color: '#e33939',
                                textAlign: 'center',
                                fontSize: Adaption.Font(19, 16)
                            }}
                            defaultValue={item.item.value.singlePrice.toString()}
                            returnKeyType="done"
                            keyboardType={'decimal-pad'}
                            maxLength={this.inputPriceLength != '' && this.state.currentInputPriceIndex == item.index ? this.inputPriceLength.length + 1 : 7}
                            onChangeText={(price) => {

                                //index 当前输入框的下标, 输入的金额
                                let shopModel = this.state.dataSource[item.index];

                                //如果输入了0开头的直接改为0.
                                if (price.length == 1 && price == '0') {
                                    price = `${price}.`;
                                    this.inputPriceLength = price;
                                }
                                else if (price.includes('.') && price != '.' && this.inputPriceLength == '') {

                                    this.inputPriceLength = price;
                                    this.setState({currentInputPriceIndex: item.index})

                                    let priceArr = price.split('.');

                                    if (priceArr[1].length == 0) {

                                        price = `${priceArr[0]}`;
                                    }
                                    else if (priceArr[1].length > 1) {
                                        price = `${priceArr[0]}.${priceArr[1].substr(0, 1)}`;
                                    }
                                }
                                else if (price.includes('.') && price != '.' && this.inputPriceLength != '') {
                                    //没有小数点时则限制长度为7
                                    this.setState({currentInputPriceIndex: item.index})
                                }
                                else if (price == '.' || (parseFloat(price) == 0 && !price.includes('.') && price != '0')) {
                                    if (price == '.') {
                                        price = '0.'; // 如果开头就直接输入了小数点，那就在前面自动加个0
                                        this.inputPriceLength = price;
                                    } else {
                                        price = '0';
                                        this.inputPriceLength = '0';  // 限制不能连续输入几个0。
                                    }
                                    this.setState({currentInputPriceIndex: item.index})

                                }
                                else {
                                    this.setState({currentInputPriceIndex: -1})
                                    this.inputPriceLength = '';
                                }

                                //如果金额为空后台会返回参数错误。强制赋值为0
                                if (price == '') {
                                    price = '0';
                                }

                                shopModel.value.singlePrice = price;

                                this._sumTotalPrice(this.state.beiShu, this.state.zhuiQiShu, this.state.dataSource);
                                //重新赋值数据源，刷新界面
                                this.setState({
                                    dataSource: this.state.dataSource,
                                });

                            }}

                            onFocus={() => {

                                let priceStr = `${item.item.value.singlePrice}`;

                                if (priceStr.includes('.')) {
                                    this.inputPriceLength = priceStr.substr(0, priceStr.length - 1);  //选择新的输入框后重新赋值
                                }
                                else {
                                    this.inputPriceLength = '';
                                }

                                this.setState({currentInputPriceIndex: item.index})
                                this.refs.AllenKeyBoard.hideAllenKeyboard();
                            }}
                        >
                        </TextInput>
                        <CusBaseText
                            style={{paddingLeft: 5, fontSize: Adaption.Font(18, 16), color: '#9d9d9d'}}>元</CusBaseText>
                    </View>
                    <TouchableOpacity style={{flex: 0.12, alignItems: 'center'}} activeOpacity={0.5}
                                      onPress={() => {
                                          let zhuShu = this.state.totalZhuShu - this.state.dataSource[item.index].value.zhushu; //减去对应的注数
                                          this.state.dataSource.splice(item.index, 1);  //移除对应的数据
                                          this._sumTotalPrice(this.state.beiShu, this.state.zhuiQiShu, this.state.dataSource);
                                          this.setState({
                                              dataSource: this.state.dataSource,    //删除某个数据
                                              totalZhuShu: zhuShu,     //重新计算注数
                                          })
                                      }}>
                        <Image style={{width: 25, height: 25}} source={require('../../img/ic_shopCarDelete.png')}/>
                    </TouchableOpacity>
                </View>

                <View style={{paddingLeft: 10, height: 35, justifyContent: 'center'}}>
                    <CusBaseText numberOfLines={1} style={{fontSize: Adaption.Font(17, 15), color: '#6a6a6a'}}>共
                        <CusBaseText style={{
                            color: '#e33939',
                            fontSize: Adaption.Font(17, 15)
                        }}> {item.item.value.zhushu} </CusBaseText>注
                        <CusBaseText style={{
                            color: '#828282',
                            fontSize: Adaption.Font(16, 14)
                        }}> {`赔率:${GetBallStatus.peilvHandle(item.item.value.peilv)}`} </CusBaseText>
                    </CusBaseText>
                </View>

                <Image style={{height: 1, width: SCREEN_WIDTH - 44 - 20, marginLeft: 10, marginTop: 3}}
                       source={require('../../img/ic_dottedLine.png')}/>
            </View>
        )
    }

    //底部视图
    _listFooterComponent(navigation) {
        return (
            <View style={{
                flexDirection: 'row',
                marginTop: 10,
                paddingBottom: 10,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {/*<TouchableOpacity activeOpacity={1}*/}
                {/*style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}*/}
                {/*onPress={() => {*/}
                {/*this.setState({isArgree: this.state.isArgree ? false : true});*/}
                {/*}}>*/}
                {/*{this.state.isArgree*/}
                {/*? <Image style={{*/}
                {/*width: Adaption.Width(18),*/}
                {/*height: Adaption.Width(18),*/}
                {/*borderColor: 'grey',*/}
                {/*borderWidth: 1*/}
                {/*}} source={require('../../img/ic_checkBlue.png')}/>*/}
                {/*: <View style={{*/}
                {/*borderColor: 'grey',*/}
                {/*borderWidth: 1,*/}
                {/*width: Adaption.Width(18),*/}
                {/*height: Adaption.Width(18)*/}
                {/*}}/>*/}
                {/*}*/}
                {/*<CusBaseText style={{fontSize: Adaption.Font(16, 14), color: '#9d9d9d'}}>我已阅读并同意</CusBaseText>*/}
                {/*</TouchableOpacity>*/}
                <TouchableOpacity activeOpacity={1} style={{
                    flexDirection: 'row', width: WIDTH - Adaption.Width(18), alignItems: 'center',
                    justifyContent: 'center',
                }} onPress={() => {
                        this.setState({isArgree: this.state.isArgree ? false : true});
                }}>
                    {this.state.isArgree
                        ? <Image style={{
                            width: Adaption.Width(18),
                            height: Adaption.Width(18),
                            borderColor: 'grey',
                            borderWidth: 1
                        }} source={require('../../img/ic_checkBlue.png')}/>
                        : <View style={{
                            borderColor: 'grey',
                            borderWidth: 1,
                            width: Adaption.Width(18),
                            height: Adaption.Width(18)
                        }}/>
                    }
                    <CusBaseText style={{
                        fontSize: Adaption.Font(16, 14),
                        color: '#9d9d9d'
                    }}> 我已阅读并同意<CusIosBaseText style={{fontSize: Adaption.Font(15, 13),color: '#00a0e9'}}
                                              onPress={() => {
                                                  navigation.navigate('ServiceArgreement', {title: GlobalConfig.userData.web_title + '服务协议'})
                                              }}>《{GlobalConfig.userData.web_title}服务协议》</CusIosBaseText></CusBaseText>
                </TouchableOpacity>
            </View>
    )
    }

    // 确认投注的方法
    _comformRequest(navigate) {
        let uid = global.UserLoginObject.Uid;
        let token = global.UserLoginObject.Token;

        if (token == null || token.length <= 0) {
        Alert.alert('提示', '您登录过期,请重新登录',
        [
    {
        text: '取消', onPress: () => {
    }
    },
    {
        text: '确定', onPress: () => {
        this.props.navigation.navigate('Login', {title: '登录', isBuy: true});
    }
    },
        ])
        return;
    }

        let {dataSource, tag, js_tag, zhuiQiShu, beiShu, isStop} = this.state;
        let parameter = {
        dataSource: dataSource,
        zhuiQiShu: zhuiQiShu,
        beiShu: beiShu,
        isStop: isStop ? 1 : 0,
    }

        // 预防dataSource里面没有期 而global有值
        if (dataSource[0].value.qishu == "" && global.CurrentQiShu > 1) {
        dataSource[0].value.qishu = global.CurrentQiShu;
    }

        // 如果dataSource里的期数小于当前期数，再提示他清空 或保留下一期
        if (dataSource[0].value.qishu == "") {
        Alert.alert("提示", "期数没获取到！")
        return;

    } else if (parseInt(dataSource[0].value.qishu) < parseInt(currentQiShu)) {
        Alert.alert("提示", `${dataSource[0].value.qishu}该期已截止，清空或保留到下一期`,
        [
    {
        text: '清空', onPress: () => {
        this._reasetShopCar();
    }
    },
    {
        text: '保留下一期', onPress: () => {
        dataSource[0].value.qishu = currentQiShu;
    }
    }
        ])
        return;
    }

        if (uid.length != 0 && token.length != 0) {
        this.refs.LoadingView && this.refs.LoadingView.showLoading('正在提交投注');
        let params = TouZhuParam.returnSubmitTuoZhuParam(parameter);
        console.log('购物车参数', params);
        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
        .then((responseData) => {

        this.refs.LoadingView && this.refs.LoadingView.dissmiss();

        if (responseData.msg == 0) {

        //数字类型的取两位小数
        if (typeof(responseData.data.less) == 'number') {

        responseData.data.less = responseData.data.less.toFixed(2);
    }

        let touZhuSuccessMessge = `投注成功！您还剩余: ${responseData.data.less}元`;
        global.UserLoginObject.TotalMoney = responseData.data.less; //刷新金额
        global.UserInfo.updateUserInfo(global.UserLoginObject, (result) => {
    });
        PushNotification.emit('RefreshUserTotalMoney', responseData.data.less);

        global.ShopHistoryArr = [];  //历史购物车赋空
        global.BeiShu = '1';     //重新初始化，防止下次进来计算出错
        global.ZhuiQiShu = '1';

        // 存储所投注的gameid，用于游戏偏好。
        let gameid_Str = `${this.state.dataSource[0].value.gameid}`;
        global.GTouZhuGameID[gameid_Str] = (global.GTouZhuGameID[gameid_Str] ? global.GTouZhuGameID[gameid_Str] : 0) + 1;
        let datas = JSON.stringify(global.GTouZhuGameID);
        UserDefalts.setItem('TouZhuGameIDNote', datas, (error) => {});

        PushNotification.emit('ClearShopCarOffNotification');  //清空购物车，屏蔽查看购物车按钮的通知
        PushNotification.emit('HandAutoAddNotification', 0);
        PushNotification.emit('TouZhuSuccessNotifcation', touZhuSuccessMessge); //投注成功通知
        this.props.navigation.goBack()

    }
        else if (responseData.msg == 20010) { //余额不足是否前往充值

        Alert.alert(
        '温馨提示',
        '您的余额不足，是否前往充值',
        [{
        text: '确定', onPress: () => {
        this.props.navigation.navigate('RechargeCenter')
    }
    },
    {
        text: '取消', onPress: () => {
    }
    },
        ],
        )
    } else {
        if (responseData.param) {
        this.refs.Toast && this.refs.Toast.show(responseData.param, 1200);
    }
    }
    })
        .catch((err) => {

        this.refs.LoadingView && this.refs.LoadingView.dissmiss();

    })
    }
    }

    //计算总额的方法
    _sumTotalPrice(beiShu, zhuiQiShu, dataArr) {

        let totalMoney = 0;

        for (let i = 0; i < dataArr.length; i++) {
        let shopcarModel = dataArr[i];
        totalMoney += shopcarModel.value.singlePrice * shopcarModel.value.zhushu * parseInt(beiShu) * parseInt(zhuiQiShu);
    }

        totalMoney = Math.floor(totalMoney * 100) / 100; //保留两位小数

        this.setState({
        totalPrice: totalMoney,
    })
    }


    _onLayout(event) {
        //使用大括号是为了限制let结构赋值得到的变量的作用域，因为接来下还要结构解构赋值一次
        {
            //获取根View的宽高，以及左上角的坐标值
            let {x, y, width, height} = event.nativeEvent.layout;
        // console.log('通过onLayout得到的宽度：' + width);
        // console.log('通过onLayout得到的高度：' + height);
    }

        //通过Dimensions API获取屏幕宽高
        let {width, height} = Dimensions.get('window');
        // console.log('通过Dimensions得到的宽度：' + width);
        // console.log('通过Dimensions得到的高度：' + height);
    }


    _createLeftNavView() {

        return (<TouchableOpacity style={{marginTop: 0, padding: 20}} activeOpacity={0.5}
        onPress={() => this._normalGoBackToBuyLotDetailVC()}><View
        style={[styles.nav_headerLeft_view, {marginTop: SCREEN_HEIGHT == 812 ? 56 : 34,}]} />
        </TouchableOpacity>)

    }

    _normalGoBackToBuyLotDetailVC = () => {

        global.ShopHistoryArr = this.state.dataSource;

        //手动添加返回改变状态，防止重复弹窗
        global.isInShopCarVC = false; //是否在购物车界面
        global.isInBuyLotVC = true;  //是否在投注界面

        PushNotification.emit('HandAutoAddNotification', global.ShopHistoryArr.length);
        if (global.ShopHistoryArr.length != 0) {
        global.BeiShu = `${this.state.beiShu}`;       //缓存倍数
        global.ZhuiQiShu = `${this.state.zhuiQiShu}`; //缓存追期数

    } else {
        global.BeiShu = '1';       //缓存倍数
        global.ZhuiQiShu = '1'; //缓存追期数
        PushNotification.emit('ClearShopCarOffNotification'); //判断是否清空购物车
    }

        this.props.navigation.goBack();
    }

    render() {

        let iphoneX = SCREEN_HEIGHT == 812 ? true : false; //是否是iphoneX
        let navHeaderHeight = iphoneX ? 88 : 64;
        let bottomHeight = iphoneX ? 34 : 0;

        let imageName = null;
        return (
        <View>
        <View style={[styles.container, {marginTop: this.state.marginTop}]}
        onLayout={this._onLayout}
        ref='carView'
        >
        <View style={{
            backgroundColor: COLORS.appColor, height: navHeaderHeight, flexDirection: 'row',
            justifyContent: 'space-between',
        }}>
        {/*左边返回*/}
        <Image style={{
            width: SCREEN_WIDTH,
            height: (SCREEN_HEIGHT == 812 ? 88 : 64),
            position: 'absolute',
            left: 0,
            top: 0
        }} source={imageName}/>
        {this._createLeftNavView()}

        {/*中间标题或者view*/}
        <CusBaseText style={[styles.imageLogoStyle]} adjustFontSizeToFit={true}>
        购物车
        </CusBaseText>


        </View>
        <NormalHeader
        style={{height: Adaption.Height(100), alignItems: 'center'}}
        tag={this.state.tag}
        speed={this.state.speed}
        nextTimeList={this.props.navigation.state.params.nextTimeList}
        nextJieZhi={this.state.currentTime}
        nextFengPan={this.state.currentFengPan}
        theQiShu={currentQiShu}
        currentQiShu={(qishu) => {
            currentQiShu = qishu
        }}
        FengPanBlock={(isLock) => {
            this.setState({isLockFengPan: isLock});
        }}

        comformOnPress={() => {
            this._normalGoBackToBuyLotDetailVC();
        }}
        arcdomOneOnPress={() => {
            // 机选
            let playDataModel = this.props.navigation.state.params.playDataModel;
            playDataModel.qishu = currentQiShu;
            let arcTouZhuParm = RandomPlay.randomReturnTuoZhuParam(playDataModel);
            let zhushu = arcTouZhuParm[0].value.zhushu;
            let totalPrice = arcTouZhuParm[0].value.totalPrice * (Number.parseInt || parseInt)(this.state.beiShu) * (Number.parseInt || parseInt)(this.state.zhuiQiShu);

            totalPrice = Math.floor(totalPrice * 100) / 100; //保留两位小数

            this.setState({
                totalPrice: totalPrice + this.state.totalPrice,
                totalZhuShu: (Number.parseInt || parseInt)(zhushu) + this.state.totalZhuShu,
            })

            arcTouZhuParm = [...arcTouZhuParm, ...this.state.dataSource];

            this.setState({
                dataSource: arcTouZhuParm,
            })
        }}

        smartChaseOnPress={(jiezhiTime, tag, qishu) => {

            if (this.state.dataSource.length <= 0) {
                this.refs.Toast && this.refs.Toast.show('请先选择需要投注的号码!', 1000);
                return;
            }
            else {

                let isDifferentWanFa = false;

                if (this.state.dataSource.length > 1) {

                    for (let i = 0; i < this.state.dataSource.length; i++) {

                        if (i < this.state.dataSource.length - 1) {

                            if (this.state.dataSource[i].value.wanfa != this.state.dataSource[i + 1].value.wanfa) {
                                isDifferentWanFa = true;
                                break;
                            }
                        }
                    }
                }

                if (isDifferentWanFa == false) {

                    this.props.navigation.navigate('AllenSmartChaseNumberVersion2', {
                        title: '智能追号',
                        //jiezhiTime: jiezhiTime,
                        tag: tag,
                        qishu: qishu,
                        datas: this.state.dataSource,
                        js_tag: this.state.js_tag,
                        currentQiShu: currentQiShu,
                        backKey: this.props.navigation.state.key,
                        totalZhuShu: this.state.totalZhuShu,
                        totalPrice: this.state.totalPrice / (this.state.zhuiQiShu * this.state.beiShu)
                    });

                }
                else {

                    Alert.alert('仅支持单一玩法', '您的选号包含多种玩、暂无法进行只能追号', [
                        {
                            text: '确定', onPress: () => {
                            }
                        },
                    ]);
                }
            }
        }}
        >
        </NormalHeader>

        <ImageBackground style={{
            marginTop: 10,
            marginLeft: 10,
            marginRight: 10,
            height: SCREEN_HEIGHT - 150 - Adaption.Height(100) - navHeaderHeight - bottomHeight - 60 + this.state.addValue
        }} source={require('../../img/ic_NormalHeader.png')} resizeMode="stretch">
        <FlatList
        style={{marginTop: 14, marginBottom: 20}}
        renderItem={item => this._renderItemView(item)}
        data={this.state.dataSource.length != 0 ? this.state.dataSource : null}
        keyExtractor={this._keyExtractor}
        >
        </FlatList>
        </ImageBackground>

        {
            this._listFooterComponent(this.props.navigation)
        }

        <AllenBottomTool
        ref='AllenBottomTool'
        keyboardCallBack={(showKeyboard, title) => {
            showKeyboard ? this.refs.AllenKeyBoard.showAllenKeyboard(title) : this.refs.AllenKeyBoard.hideAllenKeyBoard(title);
            this.setState({
                marginTop: iphoneX ? -(Adaption.Height(270) - 50 - 25) : -(Adaption.Height(270) - 50),
                addValue: 0
            });
            // // this.animatedValue.setValue(0);
            // Animated.timing(
            //     this.animatedValue,
            //     {
            //         toValue: 1,
            //         duration: 400,
            //         easing: Easing.easeOut
            //     }
            // ).start();
        }}
        changeOrginl={(title, content) => {
            this.refs.AllenKeyBoard.setWhichText(title, content)
        }}
        fatherView={this.refs.carView}
        allenrefresh={(offset) => {
            console.log("有执行", offset);
            this.setState({marginTop: offset});
        }}
        style={{
            paddingBottom: 0,
            marginBottom: bottomHeight,
            height: 150,
            backgroundColor: 'rgba(254,255,255,0.8)'
        }}
        zhuShu={this.state.totalZhuShu}
        speed={this.state.speed}
        totalPrice={this.state.totalPrice}
        isRunStopClick={(isRunStop) => {
            this.setState({
                isStop: isRunStop,
            });
        }}
        clearAllNumOnPress={() => {
            Alert.alert(
                '提示',
                '是否清空购物车数据!',
                [
                    {
                        text: '取消', onPress: () => {
                        }
                    },
                    {
                        text: '确定', onPress: () => {
                            this._reasetShopCar();
                        }
                    },
                ]
            );
        }}

        comformOnPress={() => {
            if (this.state.dataSource.length <= 0) {
                Alert.alert('提示', '您的投注列表空空如也!', [{
                    text: '确定', onPress: () => {
                    }
                }]);

            } else if (this.state.isArgree == true) {

                if (this.state.isLockFengPan == true) { //封盘时不能点击投注

                    this.refs.Toast && this.refs.Toast.show('当前期数已封盘，禁止投注!', 2000);
                    return;
                }
                else {
                    if (this.comformTouZhuWating == false) {

                        this.comformTouZhuWating = true;
                        this._comformRequest(this.props.navigation);
                        setTimeout(() => {
                            this.comformTouZhuWating = false
                        }, 1000)
                    }
                }

            } else {
                Alert.alert('提示', '请先阅读并同意服务协议', [{
                    text: '确定', onPress: () => {
                    }
                }]);
            }
        }}
        multipleClick={(pickBeiShu) => {
            //重新计算总价， 根据倍数
            if (pickBeiShu == '0' || pickBeiShu == '') {
                this.setState({
                    beiShu: pickBeiShu,
                    totalPrice: 0,
                })

            } else {
                this.setState({
                    beiShu: pickBeiShu,
                })
                this._sumTotalPrice(pickBeiShu, this.state.zhuiQiShu, this.state.dataSource);
            }
        }}
        qishuClick={(pickQiShu) => {
            // 追期数
            if (pickQiShu == '0' || pickQiShu == '') {
                this.setState({
                    zhuiQiShu: pickQiShu,
                    totalPrice: 0,
                })

            } else {
                this.setState({
                    zhuiQiShu: pickQiShu,
                })
                this._sumTotalPrice(this.state.beiShu, pickQiShu, this.state.dataSource);
            }
        }}
        >
        </AllenBottomTool>
        <Modal
        visible={this.state.isShowBallsDetail}
        //显示是的动画默认none
        //从下面向上滑动slide
        //慢慢显示fade
        animationType={'none'}
        //是否透明默认是不透明 false
        transparent={true}
        onRequestClose={() => {
        }}
        >
        <TouchableOpacity activeOpacity={1} style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.2)'
        }}
        onPress={() => {
            this.setState({isShowBallsDetail: false})
        }}>
        <TouchableOpacity activeOpacity={1} ref={(c) => this._Views = c} style={{
            width: SCREEN_WIDTH * 0.9,
            height: Adaption.Height(200),
            borderRadius: 5,
            backgroundColor: '#fff',
            alignItems: 'center'
        }}>

        <View style={{
            height: Adaption.Height(48),
            justifyContent: 'center',
            alignItems: 'center'
        }}>
        <CusBaseText
        style={{fontSize: Adaption.Font(18, 16)}}>{this.state.currentLookWanFaTitle}</CusBaseText>
        </View>
        <Image style={{height: 1, width: SCREEN_WIDTH * 0.8}}
        source={require('../../img/ic_dottedLine.png')}/>

        <Text allowFontScaling={false}
        ref={(c) => this._ballTextView = c}
        style={{padding: 10, fontSize: Adaption.Font(20, 18)}}
        onLayout={(event) => this._onBallsTextLayout(event)}>
        {this._xiangqingBallsTextView(this.state.currentLookBallsText)}
        </Text>

        <View style={{height: 1, width: SCREEN_WIDTH * 0.9, backgroundColor: '#e3e3e3'}}></View>

        <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: Adaption.Height(50)
        }}>
        <TouchableOpacity activeOpacity={1} style={{
            flex: 0.48,
            height: Adaption.Height(50),
            justifyContent: 'center',
            alignItems: 'center'
        }}
        onPress={() => {
            this.setState({isShowBallsDetail: false})
        }}>
        <CusBaseText
        style={{fontSize: Adaption.Font(19, 17), color: '#898989'}}>取消</CusBaseText>
        </TouchableOpacity>
        <View
        style={{
            height: Adaption.Height(50),
            width: 1,
            backgroundColor: '#e3e3e3'
        }}/>
        <TouchableOpacity activeOpacity={1} style={{
            flex: 0.48,
            height: Adaption.Height(50),
            justifyContent: 'center',
            alignItems: 'center'
        }}
        onPress={() => {
            this.setState({isShowBallsDetail: false})
        }}>
        <CusBaseText
        style={{fontSize: Adaption.Font(19, 17), color: '#00a0e9'}}>确定</CusBaseText>
        </TouchableOpacity>
        </View>

        </TouchableOpacity>
        </TouchableOpacity>
        </Modal>
        <LoadingView ref='LoadingView'/>
        <Toast ref="Toast" position='center'/>
        <RNAlert comformBtnTitle={'确定'} cancleBtnTitle={'取消'} comformClik={() => {
            this._reasetShopCar();
            isRemindJieZhi = false;
        }} dissmissClick={() => {
            isRemindJieZhi = false;
        }} ref='RNAlert' alertTitle={'提示'} alertContent={'本期倒计时截止' + '\n' + '是否清空购物车'}/>
        </View>
        <AllenKeyboard ref='AllenKeyBoard' spitout={(textValue1) => {
            // this.setState({textValue1})
            this.refs.AllenBottomTool.updateTextOne(textValue1);
        }}
        spitout2={(textValue2) => {
            // this.setState({textValue1})
            this.refs.AllenBottomTool.updateTextTwo(textValue2);
        }}
        hideKeboardCallBack={(whichOne) => {
            this.state.marginTop = 0;
            this.refs.AllenBottomTool.hideBottomContent(whichOne);
            // this.refs.AllenBottomTool
        }}

        comfirmBet={() => {
            if (this.state.dataSource.length <= 0) {
                Alert.alert('提示', '您的投注列表空空如也!', [{
                    text: '确定', onPress: () => {
                    }
                }]);

            } else if (this.state.isArgree == true) {

                if (this.state.isLockFengPan == true) { //封盘时不能点击投注

                    this.refs.Toast && this.refs.Toast.show('当前期数已封盘，禁止投注!', 2000);
                    return;
                }
                else {
                    if (this.comformTouZhuWating == false) {

                        this.comformTouZhuWating = true;
                        this._comformRequest(this.props.navigation);
                        setTimeout(() => {
                            this.comformTouZhuWating = false
                        }, 1000)
                    }
                }

            } else {
                Alert.alert('提示', '请先阅读并同意服务协议', [{
                    text: '确定', onPress: () => {
                    }
                }]);
            }
        }}
        />
        {/*<AllenKeyboard ref='AllenKeyBoard2' spitout={(textValue2) => {*/}
        {/*// this.setState({textValue2})*/}
        {/*this.refs.AllenBottomTool.updateTextTwo(textValue2);*/}
        {/*}}*/}
        {/*hideKeboardCallBack={() => {*/}
        {/*this.setState({marginTop: 0});*/}
        {/*this.refs.AllenBottomTool.hideBottomContent();*/}
        {/*}}*/}
        {/*/>*/}
        </View>
        )
    }

    // 弹出的详情视图 高度。
    _onBallsTextLayout(event) {
        let height = event.nativeEvent.layout.height;

        if (height > Adaption.Height(100)) {
        this._Views.setNativeProps({
        style: {
        height: height + Adaption.Height(100), // 文本高度 + 头尾固定的高度
    }
    });

    } else {
        this._Views.setNativeProps({
        style: {
        height: Adaption.Height(200),  // 弹出的整个view的高度
    }
    });

        this._ballTextView.setNativeProps({
        style: {
        height: Adaption.Height(100), // 默认的ballText高度
    }
    });
    }
    }

    // 详情显示 加上颜色
    _xiangqingBallsTextView(ballsText) {

        if (ballsText == null || ballsText == '') {
        return [];
    }

        if (!ballsText.includes('(')) {
        return <CusBaseText style={{color: '#e33939'}}>{ballsText}</CusBaseText>
    }

        let ballsArr = ballsText.split(/[\(\)]/);
        var textViews = [];
        for (let a = 0; a < ballsArr.length; a++) {

        var string = '';
        if (a % 2 == 0) {
        if (a == 0) {
        string = `${ballsArr[a]}(`;
    } else if (a == ballsArr.length - 1) {
        string = `${ballsArr[a]})`;
    } else {
        string = `)${ballsArr[a]}(`;
    }
    } else {
        string = ballsArr[a];
    }

        textViews.push(
        <CusBaseText key={a} style={{color: a % 2 == 0 ? '#7d7d7d' : '#e33939'}}>
        {string}
        </CusBaseText>
        );
    }
        return textViews;
    }

    }

    const styles = StyleSheet.create({

        container: {
        position: 'absolute',
        flex: 1,
        backgroundColor: '#f3f3f3',
    },

        multipleToolView: {
        height: 60,
        backgroundColor: '#fff',
    },
        nav_headerLeft_view: {
        width: 15,
        height: 15,
        borderColor: '#fff',
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        transform: [{rotate: '45deg'}],
        position: 'absolute',

        left: 13,
        paddingLeft: 15,
        width: 10,
    },

        imageLogoStyle: {
        backgroundColor: 'transparent',
        position: 'absolute',
        left: SCREEN_WIDTH / 2.0 - 75,
        marginTop: SCREEN_HEIGHT == 812 ? 54 : 30,
        width: 150,
        fontSize: 18,

        color: 'white',

        textAlign: 'center'
    },

    });
