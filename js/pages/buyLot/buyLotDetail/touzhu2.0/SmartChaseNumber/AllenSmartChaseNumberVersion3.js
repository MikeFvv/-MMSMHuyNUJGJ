import React, {Component} from 'react';

import {
    StyleSheet,
    View,
    StatusBar,
    ScrollView,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    TextInput,
    ImageBackground,
    Dimensions,
    Alert,
    DeviceEventEmitter,  //通知
} from 'react-native';

import Moment from 'moment';
import SmartChaseCell from './AllenSmartChaseCell3';
import Toast, {DURATION} from 'react-native-easy-toast'
import TouZhuParam from '../../TouZhuParam';
import AllenChasePlan from './AllenChasePlan3';
import SmartStlye from "./SmartVersion3/SmartStyles";
import  ArrNameBtn from "./ArrNameBtn"


// 对没错，在这里拿到了屏幕的宽高了。
const {width, height} = Dimensions.get('window');

let iphoneX = global.iOS ? (SCREEN_HEIGHT == 812 ? true : false) : 0; //是否是iphoneX

// let iphoneX = SCREEN_HEIGHT == 812 ? true : false;
let iphone5S = global.iOS ? (SCREEN_WIDTH == 320 ? true : false) : 0;

// var currentQiShu = '';  //定义当前期数

export default class SmartChaseNumber extends Component {


    // static navigationOptions = ({navigation, screenProps}) => ({
    //
    //     header: (
    //         <CustomNavBar
    //             centerText = {"智能追号"}
    //             leftClick={() =>  { global.isInShopCarVC = true; navigation.goBack()} }
    //         />
    //     ),
    //
    // });

    static navigationOptions = ({navigation, screenProps}) => ({

        header: (
            <CustomNavBar
                centerText={"智能追号"}
                threeView={true}
                centerTexts={['平倍追号', '翻倍追号', '智能追号']}
                centerTextscallback={[() => {
                    navigation.state.params.navigateRightPress(1)
                }, () => {
                    navigation.state.params.navigateRightPress(2)
                }, () => {
                    navigation.state.params.navigateRightPress(3)
                }]}
                leftClick={() => {
                    global.isInShopCarVC = true;
                    navigation.goBack()
                }}
            />
        ),

    });

    constructor(props) {
        super(props);
        this.startQishuInfo = [];
        this.maxQishu = 20;

        let totalWinMoney = 0;

        for (let i = 0; i < this.props.navigation.state.params.datas.length; i++) {
            var item = this.props.navigation.state.params.datas[i];

            let peiAry = item.value.peilv.split("|");

            let pei = peiAry.pop();
            // console.log('pei',pei);
            //每个彩种的中奖最大值
            totalWinMoney += parseFloat(pei) * item.value.singlePrice;
            // console.log('totalWinMoney1',totalWinMoney);
        }
        // console.log('totalWinMoney',totalWinMoney);

        // //最大盈利率
        let yinglilv = parseInt((totalWinMoney - this.props.navigation.state.params.totalPrice) / this.props.navigation.state.params.totalPrice * 100);
        //
        // // yinglilv = yinglilv /2;
        // yinglilv = yinglilv > 0 ? (yinglilv / 2) :(yinglilv * 2);
        // if (yinglilv > 10000)
        // {
        //     yinglilv = 10000;
        // }
        // console.log('yinglilv',yinglilv);
        this.state = {
            isStop: true,   //追号默认trun
            slectMutipleQiShu: '1',
            slectMutipleStartBeishu: '1',
            slectMutipleEveryTimesQiShu: '1',
            slectMutipleEveryTimesMultiplyBeiShu: '1',
            slectMutipleQiShuNormal: '10',
            slectMutipleStartBeishuNormal: '1',

            isNormalChaseNumberModel: true,
            dataSource: [],
            dataSourceNormal: [],
            totalMoney: {
                zhushu: this.props.navigation.state.params.totalZhuShu,
                money: this.props.navigation.state.params.totalPrice
            },
            totalMoneyNormal: {
                zhushu: this.props.navigation.state.params.totalZhuShu,
                money: this.props.navigation.state.params.totalPrice
            },

            currentTime: '', //截止时间
            isFenPanTime: '',
            tag: this.props.navigation.state.params.tag,
            qiShu: this.props.navigation.state.params.qishu,
            datas: this.props.navigation.state.params.datas,
            js_tag: this.props.navigation.state.params.js_tag,
            backKey: this.props.navigation.state.params.backKey,

            showText: '正在加载中...',
            isShow: true,
            baseZhuShu: this.props.navigation.state.params.totalZhuShu,
            baseMoney: this.props.navigation.state.params.totalPrice,
            maxWinningAmount: 0,
            modalVisible: false,
            chasePlanStr: `全程最低盈利率30%`,
            indexone: 1,
            minimumProfitabilityInTheWholeProcess: '30',
            beforePeriod: '5',
            beforePeriodProfitability: '50',
            afterPeriodProfitability: '20',
            totalProfitability: '30',
            planType: 1,
            maxProfitability: yinglilv,
            basePercent: '39',
            qiShuChange: false,   //是否是期数变化
            isLockFengPan: false,  //是否显示已封盘
            type: 1,
            wanfaZhudan :`${this.props.navigation.state.params.datas[0].value.wanfa}/`,

            //翻倍追号参数
            fanbeizhuihaoqishu:'10',    //翻倍追号期数
            fanbeifanshu:'1',         //翻数
            fanbeiqishibeishu:'1',    //起始倍数
            fanbeiselectindex:1,     //番数
            fanbeiTotalMoney:0,         //翻倍总投资


            heWanfa:this.props.navigation.state.params.datas[0].value.xiangqing,
            iswanfaArray:false,
            selsectNameIdx:0,
            currentPlayFaIndex:0, //注单选择下标

            //新的基本倍数
            // newBaseMoney:0,

            realQishu:this.props.navigation.state.params.qishu,


            slectMutipleQiShuNormalPin:'10', //平倍的期数
            slectMutipleStartBeishuNormalPin:'1',//平倍的倍数


            qiShuIndex:0

        }
        // console.log('是吗',this.props.navigation.state.params.datas);

        this.currentIdx = 0;  // 记录时间期数。
    }


    componentWillMount() {


        // this._setTimeInval();
    }

    _navigateRightPress = (type) => {
        // this.setState({type:type});
        this.state.type = type;
        this._calculationOfProfit(this.state.datas);
        //各种鸡巴切换
        this.switchPlayFa();
    }


    switchPlayFa(){
        // if(this.state.type == 1){
        //
        // }else if(this.state.type == 2){
        //
        // }else{
        //
        // }

        // console.log("走哪里",this.state.type);
        if(this.state.type==1)
        {
            this.beginCalculatePin(this.state.qiShuChange);
        }
        else if(this.state.type == 2)
        {
            this.fanbeidatesource();
        }
        else
        {
            if(this.state.planType == 1){
                this.allenCalculateScheduling(this.state.qiShuChange,this.state.realQishu);
            }else if(this.state.planType == 2){
                this.CalculationPlanTwo(this.state.qiShuChange,this.state.realQishu);
            }else {
                this.CalculationPlanThere(this.state.qiShuChange,this.state.realQishu);
            }
            // this.allenCalculateScheduling(this.state.qiShuChange);
        }
    }


    componentDidMount() {
        // this.props.navigation.setParams({
        //     navigateRightPress: this._navigateRightPress,
        //
        // });

        this.props.navigation.setParams({
            allenNeedGoback: this._allenNeedGoback,
            navigateRightPress: this._navigateRightPress,
        });


        global.isInShopCarVC = false; //进入下一界面时改为false,防止弹窗在别的界面弹出




        this.refs.LoadingView && this.refs.LoadingView.showLoading('正在加载中...');
        this._featchData(this.state.tag);
        this._calculationOfProfit(this.state.datas);
    }


    _allenNeedGoback = () => {
        this.props.navigation.goBack();
    }

    //选择追号方案回调
    disscallBack(isShow, planData) {

        if (isShow == false) {
            this.setState({
                modalVisible: false
            })
        }
        //追号盈利率超过最大盈利率判断提示框

        if (planData) {
            // let maxYinglilv = (this.state.maxWinningAmount - this.state.baseMoney) / this.state.baseMoney * 100;
            let maxYinglilv = (this.state.maxWinningAmount - this.state.datas[this.state.currentPlayFaIndex].value.singlePrice) / this.state.datas[this.state.currentPlayFaIndex].value.singlePrice * 100;

            //方案一最大盈利过大
            if (planData.planType == 1 && (parseInt(planData.minimumProfitabilityInTheWholeProcess, 10) > maxYinglilv)) {
                setTimeout(() => {
                    Alert.alert("盈利率设置过大", `无法计算，请重新设置,此方案的最大盈利率约为${parseInt(maxYinglilv, 10)}%`, [{
                        text: '确定', onPress: () => {
                            this.state.modalVisible = true;
                        }
                    },])
                }, 100);
                return;
            }
            else if (planData.planType == 2 && (planData.beforePeriodProfitability > maxYinglilv)) {
                setTimeout(() => {
                    Alert.alert("盈利率设置过大", `无法计算，请重新设置,此方案的最大盈利率约为${parseInt(maxYinglilv, 10)}%`, [{
                        text: '确定', onPress: () => {
                            this.state.modalVisible = true;
                        }
                    },])
                }, 100);
                return;
            }
            // this.setState({modalVisible: isShow, slectMutipleQiShuNormal: planData.qishu,chasePlanStr:planData.chasePlanStr,slectMutipleStartBeishuNormal:planData.startBeishu});
            this.state.modalVisible = isShow;
            this.state.slectMutipleQiShuNormal = planData.qishu;   //追号期数
            this.state.chasePlanStr = planData.chasePlanStr;
            this.state.slectMutipleStartBeishuNormal = planData.startBeishu;  //起始倍数
            this.state.minimumProfitabilityInTheWholeProcess = planData.minimumProfitabilityInTheWholeProcess;
            this.state.beforePeriod = planData.beforePeriod;
            this.state.beforePeriodProfitability = planData.beforePeriodProfitability;
            this.state.afterPeriodProfitability = planData.afterPeriodProfitability;
            this.state.totalProfitability = planData.totalProfitability;
            this.state.planType = planData.planType;
            this.state.realQishu = planData.qiShu;
            this.state.qiShuIndex = planData.qiShuIndex;
            // console.log("this.state.realQishu",this.state.realQishu,this.state.qiShu);

            //开始计算
            this.beginCalculate2(false,planData.qiShu);
        }
        else {
            this.state.modalVisible = isShow;
        }
    }


    beginCalculate2(fasle,qishu) {
        //追号方案一
        if (this.state.planType == 1) {
            this.allenCalculateScheduling(fasle,qishu);
        }
        //追号方案二
        else if (this.state.planType == 2) {
            this.CalculationPlanTwo(fasle,qishu);
        }
        else {
            this.CalculationPlanThere(fasle,qishu);
        }
    }


    //追号方案三智能追号算法
    beginCalculate(fasle)
    {
        //追号方案一
        if (this.state.planType == 1)
        {
            this.allenCalculateScheduling(fasle);
        }
        //追号方案二
        else if (this.state.planType == 2)
        {
            this.CalculationPlanTwo(fasle);
        }
        else
        {
            this.CalculationPlanThere(fasle);
        }
    }

    //平倍追号
    beginCalculatePin(fasle){
        if (this.startQishuInfo.length <= 0) return;
        let qishuPlans = [];
        let qishuNumer = this.state.qiShu;
        // let openTime = this.startQishuInfo[0].value.end_time;
        let count = 0;
        let slectMutipleQiShu = this.state.isNormalChaseNumberModel ? this.state.slectMutipleQiShuNormalPin : this.state.slectMutipleQiShu;
        let slectMutipleStartBeishu = this.state.isNormalChaseNumberModel ? this.state.slectMutipleStartBeishuNormalPin : this.state.slectMutipleStartBeishu;
        let slectMutipleEveryTimesMultiplyBeiShu = this.state.slectMutipleEveryTimesMultiplyBeiShu;
        let slectMutipleEveryTimesQiShu = this.state.slectMutipleEveryTimesQiShu;

        let zhushu = 0;
        let moneyZ = 0;
        for (let i = 0; i < slectMutipleQiShu; i++) {
            let dadao = true;
            let qishu = qishuNumer++;
        //倍数
            let num = this.state.isNormalChaseNumberModel ? parseInt(slectMutipleStartBeishu) : slectMutipleStartBeishu * Math.pow(slectMutipleEveryTimesMultiplyBeiShu, Math.floor(count / slectMutipleEveryTimesQiShu));
            moneyZ += num * this.state.datas[this.state.currentPlayFaIndex].value.singlePrice;
            let money = (moneyZ).toFixed(2);

            // console.log("之前", num, moneyZ, (this.state.maxWinningAmount * num - money).toFixed(2), ((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(0));
            // if (((this.state.maxWinningAmount * num - money) * 100 / money) < parseInt(this.state.minimumProfitabilityInTheWholeProcess)) {
            //     dadao = false;
            //     while (true) {
            //         num++;
            //         moneyZ += this.state.baseMoney;
            //         money = (moneyZ).toFixed(2);
            //
            //         let sex = ((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(2);
            //         // sex = parseInt(sex,2);
            //         // console.log("呵是呵", num, moneyZ, (this.state.maxWinningAmount * num - money).toFixed(2), ((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(0));
            //         if ((((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(3) >= parseInt(this.state.minimumProfitabilityInTheWholeProcess)) || num >= 10000) {
            //             if ((((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(3) >= parseInt(this.state.minimumProfitabilityInTheWholeProcess))) {
            //                 dadao = true;
            //             }
            //             break;
            //         }
            //     }
            // }
            if (dadao) {
                qishuPlans.push({
                    time: qishu,
                    num: num,
                    money: money,
                    openTime: '',
                    key: i
                });
            } else {
                break;
            }
            count++;
            zhushu = this.state.baseZhuShu;
        }

        if (this.state.isNormalChaseNumberModel) {
            this.state.totalMoneyNormal.zhushu = zhushu;

            if (qishuPlans.length > 0) {
                let item = qishuPlans[qishuPlans.length - 1];
                this.state.totalMoneyNormal.money = item.money;
            }
            else {
                this.state.totalMoneyNormal.money = '0';
            }

        } else {
            this.state.totalMoney.zhushu = zhushu;
            if (qishuPlans.length > 0) {
                let item = qishuPlans[qishuPlans.length - 1];
                this.state.totalMoneyNormal.money = item.money;
            }
            else {
                this.state.totalMoneyNormal.money = '0';
            }
            // this.state.totalMoneyNormal.money = moneyZ.toFixed(2);
        }

        // console.log("qishuPlans",qishuPlans);

        this.state.isNormalChaseNumberModel ? this.setState({dataSourceNormal: qishuPlans}) : this.setState({

            dataSource: qishuPlans
        })

        //期数发生变化
        // if (fasle) {
        //     this.setState({
        //         qiShuChange: fasle
        //     })
        //
        //     //弹框提示
        //     if (qishuPlans.length < slectMutipleQiShu) {
        //         this.setState({
        //             modalVisible: false,
        //             slectMutipleQiShuNormal: `${qishuPlans.length}`,
        //         });
        //
        //         // if(fasle)
        //         {
        //             this.refs.Toast && this.refs.Toast.show(`期数发生变化，方案智能生成${qishuPlans.length}期`, 1000);
        //         }
        //         // else
        //         // {
        //         //     setTimeout(() => {
        //         //         Alert.alert("盈利率设置过大",`方案智能生成${qishuPlans.length}期`,[{
        //         //             text: '确定', onPress: () => {
        //         //             }
        //         //         },])
        //         //     }, 100);
        //         // }
        //     }
        //     else {
        //         this.refs.Toast && this.refs.Toast.show('期数发生变化，成功生成追号方案', 1000);
        //     }
        //
        // }
        // else {
        //
        //     DeviceEventEmitter.emit('changeQiShu', {textN: `${qishuPlans.length}`});
        //
        //     //弹框提示
        //     if (qishuPlans.length < slectMutipleQiShu) {
        //         this.setState({
        //             modalVisible: false,
        //             slectMutipleQiShuNormal: `${qishuPlans.length}`,
        //         });
        //
        //         // if(fasle)
        //         // {
        //         //     this.refs.Toast && this.refs.Toast.show(`期数发生变化，方案智能生成${qishuPlans.length}期`, 1000);
        //         // }
        //         // else
        //         {
        //             setTimeout(() => {
        //                 Alert.alert("盈利率设置过大", `方案智能生成${qishuPlans.length}期`, [{
        //                     text: '确定', onPress: () => {
        //                     }
        //                 },])
        //             }, 100);
        //         }
        //     }
        //     else {
        //         this.refs.Toast && this.refs.Toast.show('成功生成追号方案', 1000);
        //     }
        // }



        //期数发生变化
        if (fasle) {
            this.setState({
                qiShuChange: false
            })

            //弹框提示
            // if (qishuPlans.length < slectMutipleQiShu) {
            //     this.setState({
            //         modalVisible: false,
            //         slectMutipleQiShuNormal: `${qishuPlans.length}`,
            //     });
            //
            //     // if(fasle)
            //     {
            //         this.refs.Toast && this.refs.Toast.show(`期数发生变化，方案智能生成${qishuPlans.length}期`, 1000);
            //     }
            //     // else
            //     // {
            //     //     setTimeout(() => {
            //     //         Alert.alert("盈利率设置过大",`方案智能生成${qishuPlans.length}期`,[{
            //     //             text: '确定', onPress: () => {
            //     //             }
            //     //         },])
            //     //     }, 100);
            //     // }
            // }
            // else {
                this.refs.Toast && this.refs.Toast.show('期数发生变化，成功生成平倍追号方案', 1000);
            // }

        }
        else {

            // DeviceEventEmitter.emit('changeQiShu', {textN: `${qishuPlans.length}`});

            //弹框提示
            // if (qishuPlans.length < slectMutipleQiShu) {
            //     this.setState({
            //         modalVisible: false,
            //         slectMutipleQiShuNormal: `${qishuPlans.length}`,
            //     });
            //
            //     // if(fasle)
            //     // {
            //     //     this.refs.Toast && this.refs.Toast.show(`期数发生变化，方案智能生成${qishuPlans.length}期`, 1000);
            //     // }
            //     // else
            //     {
            //         setTimeout(() => {
            //             Alert.alert("盈利率设置过大", `方案智能生成${qishuPlans.length}期`, [{
            //                 text: '确定', onPress: () => {
            //                 }
            //             },])
            //         }, 100);
            //     }
            // }
            // else {
                this.refs.Toast && this.refs.Toast.show('成功生成平倍追号方案', 1000);
            // }
        }
        return qishuPlans;
    }

    render() {
        // console.log("this.state.qiShu",this.state.qiShu,this.state.modalVisible,this.state.isNormalChaseNumberModel,this.state.slectMutipleQiShuNormal);
        if (this.state.type == 1) {
            let maxNun = this.state.maxWinningAmount;
            return <View style={{flex: 1, backgroundColor: '#f6f6f6'}}><View
                style={{flex: 1, backgroundColor: '#f6f6f6'}}>

                {/*{this.state.modalVisible?(<AllenChasePlan visible={this.state.modalVisible} disscallBack={this.disscallBack.bind(this)}*/}
                                {/*basePercent={this.state.basePercent} maxProfitability={this.state.maxProfitability}*/}
                                {/*maxQishu={this.maxQishu} currentQishu={this.state.slectMutipleQiShuNormal} qishuDetail={this.state.qiShu}/>):null}*/}

                {/*截止时间*/}
                <View style={styles.timeStyle}>
                    <CusBaseText
                        style={{color: '#707070'}}>第{this.state.qiShu ? String(this.state.qiShu).substr(String(this.state.qiShu).length - 4) : null}期投注截止时间: </CusBaseText>
                    <CusBaseText  //this.state.currentTime > 0 ? this._changeTime(this.state.currentTime) : '00:00:00'
                        style={{color: '#e33939'}}>{(this.state.isFenPanTime < 0 && this.state.qiShu > 0) ? '已封盘' : this._changeTime(this.state.isFenPanTime)}</CusBaseText>
                </View>

                <View>
                    <View style={[styles.zhuihaoyiStyle, {backgroundColor: 'white'}]}>

                        <View style={{flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <CusBaseText style={{fontSize: Adaption.Font(17, 15), color: "#7d7d7d"}}>追号 </CusBaseText>
                            {/*<TextInput style={{width:40,backgroundColor:'yellow',textAlign:'center'}} placeholder = '1' placeholderTextColor = 'black' ></TextInput>*/}
                            <TextInput allowFontScaling={false} keyboardType={global.iOS ? 'number-pad' : 'numeric'}
                                       onChangeText={(text) => {
                                            //100 限制最大期数为100
                                           if (text > 20) {
                                               text = 20 + '';

                                               // DeviceEventEmitter.emit('changeQiShu', {textN: text});
                                           } else if(text == '0'){
                                               text = 1 + '';
                                           } else if (text == ''){
                                              text = '';
                                           }
                                           if (this.state.isNormalChaseNumberModel) {
                                               this.state.slectMutipleQiShuNormalPin = text != '' ? (text) : ('');
                                               // DeviceEventEmitter.emit('changeQiShu', {textN: this.state.slectMutipleQiShuNormal});

                                               this.setState({});
                                           }
                                           else {
                                               this.state.slectMutipleQiShu = text != '' ? (text) : ('');
                                               // DeviceEventEmitter.emit('changeQiShu', {textN: this.state.slectMutipleQiShuNormal});

                                               // this.props.multipleClick ? this.props.multipleClick(text) : null;  //回调输入的倍数
                                               this.setState({});
                                           }

                                           //这里需要做个判断当前追号类型
                                           // this.calculateScheduling(text, this.state.planType);

                                           // this.beginCalculate(false);
                                           this.beginCalculatePin(false);

                                       }}
                                       returnKeyType="done"
                                       maxLength={5}
                                       style={{
                                           padding: 0,
                                           width: (iphone5S ? 60 : 80),
                                           height: iphone5S ? 30 : 35,
                                           borderColor: '#b8b8b8',
                                           borderWidth: 1,
                                           backgroundColor: '#fff',

                                           borderRadius: 3,
                                           textAlign: 'center'
                                       }} underlineColorAndroid='transparent'
                                       value={this.state.isNormalChaseNumberModel ? this.state.slectMutipleQiShuNormalPin : this.state.slectMutipleQiShu}
                                       onFocus={() => {
                                           if (this.state.isNormalChaseNumberModel) {
                                               this.state.slectMutipleQiShuNormalPin == '' ? this.setState({slectMutipleQiShuNormalPin: '1'}) : null;
                                           } else {
                                               this.state.slectMutipleQiShu == '' ? this.setState({slectMutipleQiShu: '1'}) : null;
                                           }
                                           this.beginCalculatePin(false);
                                       }}
                                       onBlur={() => {
                                           if (this.state.isNormalChaseNumberModel) {
                                               // this.state.slectMutipleQiShuNormal == '' ? this.setState({slectMutipleQiShuNormal: '1'}) : null;
                                               if(this.state.slectMutipleQiShuNormalPin == ''){
                                                   this.state.slectMutipleQiShuNormalPin = '1'
                                                   this.setState({});
                                                   this.beginCalculatePin(false);
                                               }
                                           } else {
                                               this.state.slectMutipleQiShu == '' ? this.setState({slectMutipleQiShu: '1'}) : null;
                                           }

                                       }
                                       }
                            />

                            <CusBaseText style={{
                                fontSize: Adaption.Font(17, 15),
                                color: "#7d7d7d"
                            }}> 期 </CusBaseText>
                        </View>


                        <View style={{flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <CusBaseText style={{fontSize: Adaption.Font(17, 15), color: "#7d7d7d"}}>起始倍数 </CusBaseText>
                            {/*<TextInput style={{width:40,backgroundColor:'yellow',textAlign:'center'}} placeholder = '1' placeholderTextColor = 'black' ></TextInput>*/}
                            <TextInput allowFontScaling={false} keyboardType={global.iOS ? 'number-pad' : 'numeric'}
                                       onChangeText={(text) => {
                                            //最大倍数不能大于100
                                           if (text > 100) {
                                               text = 100 + '';

                                               // DeviceEventEmitter.emit('changeQiShu', {textN: text});
                                           }
                                           if (this.state.isNormalChaseNumberModel) {
                                               this.state.slectMutipleStartBeishuNormalPin = text != '' ? (text) : ('');
                                               // DeviceEventEmitter.emit('changeQiShu', {textN: this.state.slectMutipleQiShuNormal});

                                               this.setState({});
                                           }
                                           else {
                                               this.state.slectMutipleQiShu = text != '' ? (text) : ('');
                                               // DeviceEventEmitter.emit('changeQiShu', {textN: this.state.slectMutipleQiShuNormal});

                                               // this.props.multipleClick ? this.props.multipleClick(text) : null;  //回调输入的倍数
                                               this.setState({});
                                           }

                                           //这里需要做个判断当前追号类型
                                           // this.calculateScheduling(text, this.state.planType);

                                           // this.beginCalculate(false);
                                            this.beginCalculatePin(false);
                                       }}
                                       returnKeyType="done"
                                       maxLength={5}
                                       style={{
                                           padding: 0,
                                           width: (iphone5S ? 60 : 80),
                                           height: iphone5S ? 30 : 35,
                                           borderColor: '#b8b8b8',
                                           borderWidth: 1,
                                           backgroundColor: '#fff',

                                           borderRadius: 3,
                                           textAlign: 'center'
                                       }} underlineColorAndroid='transparent'
                                       value={this.state.isNormalChaseNumberModel ? this.state.slectMutipleStartBeishuNormalPin : this.state.slectMutipleStartBeishu}
                                       onFocus={() => {
                                           if (this.state.isNormalChaseNumberModel) {
                                               this.state.slectMutipleStartBeishuNormalPin == '' ? this.setState({slectMutipleStartBeishuNormalPin: '1'}) : null;
                                           } else {
                                               this.state.slectMutipleQiShu == '' ? this.setState({slectMutipleQiShu: '1'}) : null;
                                           }
                                       }}
                                       onBlur={() => {
                                           if (this.state.isNormalChaseNumberModel) {
                                               // this.state.slectMutipleStartBeishuNormal == '' ? this.setState({slectMutipleStartBeishuNormal: '1'}) : null;
                                               if(this.state.slectMutipleStartBeishuNormalPin == ''){
                                                   this.state.slectMutipleStartBeishuNormalPin = '1'
                                                   this.setState({});
                                                   this.beginCalculatePin(false);
                                               }
                                           } else {
                                               this.state.slectMutipleQiShu == '' ? this.setState({slectMutipleQiShu: '1'}) : null;
                                           }
                                       }
                                       }
                            />

                            <CusBaseText style={{
                                fontSize: Adaption.Font(17, 15),
                                color: "#7d7d7d"
                            }}> 倍 </CusBaseText>
                        </View>

                    </View>
                    <View style={{
                        backgroundColor: '#f6f6f6',
                        paddingVertical: 10,
                        flexDirection: 'row',
                        alignItems:'center',
                        paddingLeft: 10,

                    }}>
                        {/*<TouchableOpacity activeOpacity={0.7} onPress={() => {*/}
                            {/*this.setState({modalVisible: true});*/}
                        {/*}}>*/}
                            {/*<Text style={{fontWeight: '500', fontSize: Adaption.Font(19, 17), color: '#3AA0E4'}}>修改方案*/}
                                {/*></Text>*/}
                        {/*</TouchableOpacity>*/}

                        <View style={[SmartStlye.linBox,{marginTop:0}]}>
                            <CusBaseText style={[SmartStlye.leftTextStyle,{marginLeft:0,color:'black'}]}> 注单选择: </CusBaseText>


                            <TouchableOpacity activeOpacity={1} style={SmartStlye.maxBorderStyle} onPress={() => {  this.openArrWanFa() }}>
                                <View style={SmartStlye.ZhuanXSStyle}>
                                    <CusBaseText numberOfLines={1} style={[SmartStlye.centerText01,{color:'black'}]}>
                                        {`${this.state.wanfaZhudan}`}{this._xiangqingBallsTextView(this.state.heWanfa)}
                                    </CusBaseText>

                                </View>
                                <Image style={SmartStlye.ZhuanDImg} source={require('../img/ic_buyLot_downRow.png')}></Image>
                            </TouchableOpacity>


                        </View>

                    </View>
                </View>

                {/*表头*/}
                <View style={styles.biaoTouStyle}>

                    <View style={{flex: 0.1}}/>
                    <CusBaseText style={{
                        // fontSize: ((width == 320) ? (14) : (16)),
                        // color: '#707070',
                        // flex: 0.5,
                        // textAlign: 'center',
                        // writingDirection: 'rtl',

                        textAlignVertical: 'center',
                        textAlign: 'center',
                        // flex: 0.7,
                        width: 30,
                        height: 40,
                        writingDirection: 'rtl',
                        fontSize: ((width == 320) ? (14) : (16)),
                        color: '#707070',
                        borderColor: '#d2d2d2',
                        // borderWidth: 1,
                        // borderRadius: 11,
                        lineHeight: 20,
                        marginTop: -10,


                    }}> 序号</CusBaseText>

                    <View style={{flex: 0.25}}/>

                    <CusBaseText style={{
                        // fontSize: ((width == 320) ? (14) : (16)),
                        // color: '#707070',
                        // textAlign: 'center',
                        // writingDirection: 'rtl',


                        textAlignVertical: 'center',
                        textAlign: 'center',
                        // flex: 0.7,
                        width: 23,
                        height: 40,
                        writingDirection: 'rtl',
                        fontSize: ((width == 320) ? (14) : (16)),
                        color: '#707070',
                        borderColor: '#d2d2d2',
                        // borderWidth: 1,
                        // borderRadius: 11,
                        lineHeight: 20,
                        marginTop: -10,

                    }}> 期号</CusBaseText>
                    <CusBaseText style={{
                        fontSize: ((width == 320) ? (14) : (16)),
                        color: '#707070',
                        flex: 1.1,
                        textAlign: 'center',
                    }}>倍数</CusBaseText>
                    <CusBaseText style={{
                        fontSize: ((width == 320) ? (14) : (16)),
                        color: '#707070',
                        flex: 0.5,
                        textAlign: 'center',
                    }}>金额</CusBaseText>
                    <CusBaseText style={{
                        fontSize: ((width == 320) ? (14) : (16)),
                        color: '#707070',
                        flex: 0.9,
                        textAlign: 'center',
                    }}>中奖盈利</CusBaseText>
                    <CusBaseText style={{
                        fontSize: ((width == 320) ? (14) : (16)),
                        color: '#707070',
                        flex: 0.75,
                        textAlign: 'center',
                    }}>盈利率</CusBaseText>
                </View>

                <FlatList
                    // scrollEnabled={false}
                    ref='myListView'
                    data={this.state.isNormalChaseNumberModel ? this.state.dataSourceNormal : this.state.dataSource
                    }
                    extraData={this.state.indexone}
                    renderItem={(date) => this.renderItem(date)}
                />


            </View>
                <View style={{backgroundColor: '#dbdbdb', height: 1, width: SCREEN_WIDTH}}/>

                <View style={{height: 49, flexDirection: 'row', marginBottom: iphoneX ? 34 : 0}}>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
                        <View>
                            {this.state.isStop ? (<TouchableOpacity onPress={() => {
                                    this.setState({isStop: false})
                                }} activeOpacity={1} style={styles.check_Box}>
                                    <View style={{
                                        borderColor: '#a5a5a5', borderRadius: 3, borderWidth: 1, width: 25, height: 25,
                                        alignItems:
                                            'center', justifyContent: 'center'
                                    }}>
                                        <Image style={{width: 20, height: 20,}}
                                               source={require('../img/ic_smart_checkBox.png')}/></View>

                                </TouchableOpacity>) :
                                (<TouchableOpacity onPress={() => {
                                    this.setState({isStop: true})
                                }} activeOpacity={1} style={styles.check_Box}>
                                    <View style={{
                                        borderColor: '#a5a5a5',
                                        borderRadius: 3,
                                        borderWidth: 1,
                                        width: 25,
                                        height: 25
                                    }}/>

                                </TouchableOpacity>)}
                        </View>
                        <View style={{marginLeft: 10}}>
                            <CusBaseText
                                style={{fontSize: Adaption.Font(18, 16), color: "#6a6a6a"}}>中奖后停止追号</CusBaseText>
                            <CusBaseText style={{marginTop: 0, fontSize: Adaption.Font(18, 16), color: "#6a6a6a"}}>共追
                                <CusBaseText
                                    style={{
                                        color: "#e33939",
                                        fontSize: Adaption.Font(18, 16)
                                    }}> {this.state.dataSourceNormal.length} </CusBaseText>期
                                <CusBaseText
                                    style={{
                                        color: "#e33939",
                                        fontSize: Adaption.Font(18, 16)
                                    }}> {this.state.isNormalChaseNumberModel ? this.state.totalMoneyNormal.money : this.state.totalMoney.money}
                                </CusBaseText>元
                            </CusBaseText>
                        </View>
                    </View>
                    <TouchableOpacity activeOpacity={0.7} onPress={this.submit}>
                        <View style={{
                            height: 49,
                            backgroundColor: this.state.isLockFengPan == true ? "#bfbfbf" : "#b52e2f",
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <Text allowFontScaling={false}
                                  style={{marginHorizontal: 10, fontSize: 17, color: 'white'}}>确认投注</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <ArrNameBtn
                    isAllenWrite={true}
                    gameList={this.state.datas}
                    selectedGameID={this.state.selsectNameIdx}
                    isClose={this.state.iswanfaArray}
                    close={() => {
                        this.setState({
                            iswanfaArray: false,})
                    }}
                    caiZhongClick={(gameData, index) => {

                        this.setState({
                            iswanfaArray: false,
                            selsectNameIdx: index,
                            currentPlayFaIndex:index,
                            wanfaZhudan: `${gameData.value.wanfa}/`,     //玩法名称
                            heWanfa:gameData.value.xiangqing,           //玩法内容
                        });
                        setTimeout(() => {
                            // this._calculationOfProfit(this.state.datas);
                            // this.beginCalculatePin(false);
                            this._calculationOfProfit(this.state.datas);
                            // this.diyiArrayJieQu02(index)

                            if(this.state.type == 1)
                            {
                                this.beginCalculatePin(false);

                            }
                            else if(this.state.type == 2)
                            {
                                this.fanbeidatesource();
                            }
                            else if(this.state.type == 3)
                            {
                                // this.allenCalculateScheduling(false);
                                if(this.state.planType == 1){
                                    this.allenCalculateScheduling(false);
                                }else if(this.state.planType == 2){
                                    this.CalculationPlanTwo(false);
                                }else {
                                    this.CalculationPlanThere(false);
                                }

                            }
                            // this.diyiArrayJieQu02(index)
                        }, 100);
                    }
                    } />

                <LoadingView ref='LoadingView' isShow={this.state.isShow} showText={this.state.showText}/>
                <Toast ref="Toast" position='center'/>
            </View>
        }

        //2222222翻倍追号
        else if (this.state.type==2)

        {
            let maxNun = this.state.maxWinningAmount;
            return <View style={{flex: 1, backgroundColor: '#f6f6f6'}}><View
                style={{flex: 1, backgroundColor: '#f6f6f6'}}>


                {/*截止时间*/}
                <View style={styles.timeStyle}>
                    <CusBaseText
                        style={{color: '#707070'}}>第{this.state.qiShu ? String(this.state.qiShu).substr(String(this.state.qiShu).length - 4) : null}期投注截止时间: </CusBaseText>
                    <CusBaseText  //this.state.currentTime > 0 ? this._changeTime(this.state.currentTime) : '00:00:00'
                        style={{color: '#e33939'}}>{(this.state.isFenPanTime < 0 && this.state.qiShu > 0) ? '已封盘' : this._changeTime(this.state.isFenPanTime)}</CusBaseText>
                </View>


                {/*追号期数这行*/}
                <View>

                    <View style={[styles.zhuihaoyiStyle, {backgroundColor: 'white'}]}>
                        <View style={{flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center'}}>

                            {/*追号期数*/}
                            <CusBaseText style={{fontSize: Adaption.Font(17, 15), color: "#7d7d7d"}}>追号 </CusBaseText>

                            <TextInput allowFontScaling={false} keyboardType={global.iOS ? 'number-pad' : 'numeric'}
                                       onChangeText={(text) => {

                                           if (text > this.maxQishu)
                                           {
                                               text = this.maxQishu + '';
                                               DeviceEventEmitter.emit('changeQiShu', {textN: text});
                                           }


                                               this.state.fanbeizhuihaoqishu = text != '' ? (text) : ('');
                                               DeviceEventEmitter.emit('changeQiShu', {textN: this.state.fanbeizhuihaoqishu});
                                               this.setState({});
                                               //计算翻倍

                                           if(this.state.fanbeizhuihaoqishu > 0)
                                           {
                                               this.fanbeidatesource();

                                           }

                                       }}
                                       returnKeyType="done"
                                       maxLength={5}
                                       style={{
                                           padding: 0,
                                           width: (iphone5S ? 44 : 50),
                                           height: iphone5S ? 25 : 30,
                                           borderColor: '#b8b8b8',
                                           borderWidth: 1,
                                           backgroundColor: '#fff',
                                           borderRadius: 3,
                                           textAlign: 'center'
                                       }} underlineColorAndroid='transparent'

                                       value = { this.state.fanbeizhuihaoqishu }

                                       onFocus={() => {

                                               this.state.fanbeizhuihaoqishu == '' ? this.setState({fanbeizhuihaoqishu: '1'}) : null;

                                       }}
                                       onBlur={() => {

                                               this.state.fanbeizhuihaoqishu == '' ? this.setState({fanbeizhuihaoqishu: '1'}) : null;
                                       }}
                            />

                            <CusBaseText style={{
                                fontSize: Adaption.Font(17, 15),
                                color: "#7d7d7d"
                            }}> 期 </CusBaseText>

                            <CusBaseText style={{fontSize: Adaption.Font(17, 15), color: "#7d7d7d"}}>翻数 </CusBaseText>
                            {/*<TextInput style={{width:40,backgroundColor:'yellow',textAlign:'center'}} placeholder = '1' placeholderTextColor = 'black' ></TextInput>*/}
                            <TextInput allowFontScaling={false} keyboardType={global.iOS ? 'number-pad' : 'numeric'}
                                       onChangeText={(text) => {

                                           if (text > 3)
                                           {
                                               text = 3 + '';
                                               DeviceEventEmitter.emit('changeQiShu', {textN: text});
                                           }

                                               this.state.fanbeifanshu = text != '' ? (text) : ('');
                                                this.state.fanbeiselectindex = parseInt(this.state.fanbeifanshu);
                                               // this.setState({fanbeifanshu:'3',fanbeiselectindex:3});

                                           DeviceEventEmitter.emit('changeQiShu', {textN: this.state.fanbeifanshu});


                                               if(this.state.fanbeifanshu > 0)
                                               {
                                                   this.fanbeidatesource();
                                               }


                                       }}
                                       returnKeyType="done"
                                       maxLength={5}
                                       style={{
                                           padding: 0,
                                           width: (iphone5S ? 44 : 50),
                                           height: iphone5S ? 25 : 30,
                                           borderColor: '#b8b8b8',
                                           borderWidth: 1,
                                           backgroundColor: '#fff',

                                           borderRadius: 3,
                                           textAlign: 'center'
                                       }} underlineColorAndroid='transparent'
                                       value={this.state.fanbeifanshu }

                                       onFocus={() => {
                                           this.state.fanbeifanshu == '' ? this.setState({fanbeifanshu:'1',fanbeiselectindex:1}) : null;
                                       }}

                                       onBlur={() => {
                                               this.state.fanbeifanshu == '' ? this.setState({fanbeifanshu:'1',fanbeiselectindex:1}) : null;
                                       }}

                            />

                            <CusBaseText style={{fontSize: Adaption.Font(17, 15), color: "#7d7d7d",marginLeft:10}}>起始倍数 </CusBaseText>
                            {/*<TextInput style={{width:40,backgroundColor:'yellow',textAlign:'center'}} placeholder = '1' placeholderTextColor = 'black' ></TextInput>*/}
                            <TextInput allowFontScaling={false} keyboardType={global.iOS ? 'number-pad' : 'numeric'}
                                       onChangeText={(text) => {

                                           if (text > 100)
                                           {
                                               text =  '100';
                                               this.setState({fanbeiqishibeishu:text});
                                               DeviceEventEmitter.emit('changeQiShu', {textN: text});
                                           }

                                               this.state.fanbeiqishibeishu = text != '' ? (text) : ('');
                                               DeviceEventEmitter.emit('changeQiShu', {textN: this.state.fanbeiqishibeishu});
                                               this.setState({});


                                           //这里需要做个判断当前追号类型
                                           // this.calculateScheduling(text, this.state.planType);

                                           if(this.state.fanbeiqishibeishu > 0)
                                           {
                                               this.fanbeidatesource();

                                           }

                                       }}
                                       returnKeyType="done"
                                       maxLength={3}
                                       style={{
                                           padding: 0,
                                           width: (iphone5S ? 44 : 50),
                                           height: iphone5S ? 25 : 30,
                                           // marginLeft:5,
                                           borderColor: '#b8b8b8',
                                           borderWidth: 1,
                                           backgroundColor: '#fff',

                                           borderRadius: 3,
                                           textAlign: 'center'
                                       }} underlineColorAndroid='transparent'
                                       value={this.state.fanbeiqishibeishu }
                                       onFocus={() => {
                                               this.state.fanbeiqishibeishu == '' ? this.setState({fanbeiqishibeishu: '1'}) : null;
                                       }}
                                       onBlur={() => {
                                               this.state.fanbeiqishibeishu == '' ? this.setState({fanbeiqishibeishu: '1'}) : null;
                                       }}
                            />
                        </View>

                    </View>

                    <View style={{
                        backgroundColor: 'white',

                        // paddingVertical: 5,
                        flexDirection: 'row',

                        // justifyContent: 'flex-end',
                        // paddingRight: 10

                    }}>
                        <TouchableOpacity activeOpacity={0.7} style={{backgroundColor:this.state.fanbeiselectindex == 1?COLORS.appColor:'white',borderColor:COLORS.appColor,borderWidth:1,borderRadius:6,marginLeft:30,marginBottom:8,marginTop:5,
                        }} onPress={() => {
                            this.setState({fanbeiselectindex: 1,fanbeifanshu:'1'},()=>{this.fanbeidatesource()});


                        }}>

                            {/*borderRadius: ballWidth * 0.5, borderColor: '#979797', borderWidth: itemIsSelect ? 0 : 1,*/}
                            <CusBaseText style={{fontWeight: '500', fontSize: Adaption.Font(17, 15),marginLeft:10,marginRight:10,marginTop:1,marginBottom:1,color: this.state.fanbeiselectindex == 1?'white':COLORS.appColor,

                            }}>1 番</CusBaseText>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.7} style={{backgroundColor:this.state.fanbeiselectindex == 2?COLORS.appColor:'white',borderColor:COLORS.appColor,borderWidth:1,borderRadius:5,marginLeft:20,marginBottom:8,marginTop:5,
                        }} onPress={() => {
                            this.setState({fanbeiselectindex: 2,fanbeifanshu:'2'},()=>{this.fanbeidatesource()});

                        }}>

                            {/*borderRadius: ballWidth * 0.5, borderColor: '#979797', borderWidth: itemIsSelect ? 0 : 1,*/}
                            <CusBaseText style={{fontWeight: '500', fontSize: Adaption.Font(17, 15),marginLeft:10,marginRight:10,marginTop:1,marginBottom:1,color: this.state.fanbeiselectindex == 2?'white':COLORS.appColor,

                            }}>2 番</CusBaseText>
                        </TouchableOpacity>


                        <TouchableOpacity activeOpacity={0.7} style={{backgroundColor:this.state.fanbeiselectindex == 3?COLORS.appColor:'white',borderColor:COLORS.appColor,borderWidth:1,borderRadius:5,marginLeft:20,marginBottom:8,marginTop:5,
                        }} onPress={() => {
                            this.setState({fanbeiselectindex: 3,fanbeifanshu:"3"},()=>{this.fanbeidatesource()});

                        }}>

                            {/*borderRadius: ballWidth * 0.5, borderColor: '#979797', borderWidth: itemIsSelect ? 0 : 1,*/}
                            <CusBaseText  style={{fontWeight: '500', fontSize: Adaption.Font(17, 15),marginLeft:10,marginRight:10,marginTop:1,marginBottom:1,color: this.state.fanbeiselectindex == 3?'white':COLORS.appColor,

                            }}>3 番</CusBaseText >
                        </TouchableOpacity>

                    </View>
                </View>


                <View style={{
                    backgroundColor: '#f6f6f6',
                    paddingVertical: 10,
                    flexDirection: 'row',
                    alignItems:'center',
                    paddingLeft: 10,

                }}>
                    <View style={[SmartStlye.linBox,{marginTop:0}]}>
                        <CusBaseText style={[SmartStlye.leftTextStyle,{marginLeft:0,color:'black'}]}> 注单选择: </CusBaseText>


                        <TouchableOpacity activeOpacity={1} style={SmartStlye.maxBorderStyle} onPress={() => {  this.openArrWanFa() }}>
                            <View style={SmartStlye.ZhuanXSStyle}>
                                <CusBaseText numberOfLines={1} style={[SmartStlye.centerText01,{color:'black'}]}>
                                    {`${this.state.wanfaZhudan}`}{this._xiangqingBallsTextView(this.state.heWanfa)}
                                </CusBaseText>

                            </View>
                            <Image style={SmartStlye.ZhuanDImg} source={require('../img/ic_buyLot_downRow.png')}></Image>
                        </TouchableOpacity>


                    </View>

                </View>

                {/*表头*/}
                <View style={styles.biaoTouStyle}>

                    <View style={{flex: 0.1}}/>
                    <CusBaseText style={{
                        // fontSize: ((width == 320) ? (14) : (16)),
                        // color: '#707070',
                        // flex: 0.5,
                        // textAlign: 'center',
                        // writingDirection: 'rtl',

                        textAlignVertical: 'center',
                        textAlign: 'center',
                        // flex: 0.7,
                        width: 30,
                        height: 40,
                        writingDirection: 'rtl',
                        fontSize: ((width == 320) ? (14) : (16)),
                        color: '#707070',
                        borderColor: '#d2d2d2',
                        // borderWidth: 1,
                        // borderRadius: 11,
                        lineHeight: 20,
                        marginTop: -3,


                    }}> 序号</CusBaseText>

                    <View style={{flex: 0.25}}/>

                    <CusBaseText style={{
                        // fontSize: ((width == 320) ? (14) : (16)),
                        // color: '#707070',
                        // textAlign: 'center',
                        // writingDirection: 'rtl',


                        textAlignVertical: 'center',
                        textAlign: 'center',
                        // flex: 0.7,
                        width: 23,
                        height: 40,
                        writingDirection: 'rtl',
                        fontSize: ((width == 320) ? (14) : (16)),
                        color: '#707070',
                        borderColor: '#d2d2d2',
                        // borderWidth: 1,
                        // borderRadius: 11,
                        lineHeight: 20,
                        marginTop: -3,

                    }}> 期号</CusBaseText>
                    <CusBaseText style={{
                        fontSize: ((width == 320) ? (14) : (16)),
                        color: '#707070',
                        flex: 1.1,
                        textAlign: 'center',
                    }}>倍数</CusBaseText>
                    <CusBaseText style={{
                        fontSize: ((width == 320) ? (14) : (16)),
                        color: '#707070',
                        flex: 0.5,
                        textAlign: 'center',
                    }}>金额</CusBaseText>
                    <CusBaseText style={{
                        fontSize: ((width == 320) ? (14) : (16)),
                        color: '#707070',
                        flex: 0.9,
                        textAlign: 'center',
                    }}>中奖盈利</CusBaseText>
                    <CusBaseText style={{
                        fontSize: ((width == 320) ? (14) : (16)),
                        color: '#707070',
                        flex: 0.75,
                        textAlign: 'center',
                    }}>盈利率</CusBaseText>
                </View>

                <FlatList
                    // scrollEnabled={false}
                    ref='myListView'
                    data={this.state.dataSourceNormal}
                    extraData={this.state.indexone}
                    renderItem={(date) => this.renderItem(date)}
                />


            </View>
                <View style={{backgroundColor: '#dbdbdb', height: 1, width: SCREEN_WIDTH}}/>

                <View style={{height: 49, flexDirection: 'row', marginBottom: iphoneX ? 34 : 0}}>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
                        <View>
                            {this.state.isStop ? (<TouchableOpacity onPress={() => {
                                    this.setState({isStop: false})
                                }} activeOpacity={1} style={styles.check_Box}>
                                    <View style={{
                                        borderColor: '#a5a5a5', borderRadius: 3, borderWidth: 1, width: 25, height: 25,
                                        alignItems:
                                            'center', justifyContent: 'center'
                                    }}>
                                        <Image style={{width: 20, height: 20,}}
                                               source={require('../img/ic_smart_checkBox.png')}/></View>

                                </TouchableOpacity>) :
                                (<TouchableOpacity onPress={() => {
                                    this.setState({isStop: true})
                                }} activeOpacity={1} style={styles.check_Box}>
                                    <View style={{
                                        borderColor: '#a5a5a5',
                                        borderRadius: 3,
                                        borderWidth: 1,
                                        width: 25,
                                        height: 25
                                    }}/>

                                </TouchableOpacity>)}
                        </View>
                        <View style={{marginLeft: 10}}>
                            <CusBaseText
                                style={{fontSize: Adaption.Font(18, 16), color: "#6a6a6a"}}>中奖后停止追号</CusBaseText>
                            <CusBaseText style={{marginTop: 0, fontSize: Adaption.Font(18, 16), color: "#6a6a6a"}}>共追
                                <CusBaseText
                                    style={{
                                        color: "#e33939",
                                        fontSize: Adaption.Font(18, 16)
                                    }}> {this.state.dataSourceNormal.length} </CusBaseText>期
                                <CusBaseText
                                    style={{
                                        color: "#e33939",
                                        fontSize: Adaption.Font(18, 16)
                                    }}> {this.state.fanbeiTotalMoney}
                                </CusBaseText>元
                            </CusBaseText>
                        </View>
                    </View>
                    <TouchableOpacity activeOpacity={0.7} onPress={this.submit}>
                        <View style={{
                            height: 49,
                            backgroundColor: this.state.isLockFengPan == true ? "#bfbfbf" : "#b52e2f",
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <Text allowFontScaling={false}
                                  style={{marginHorizontal: 10, fontSize: 17, color: 'white'}}>确认投注</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <ArrNameBtn
                    isMidAllenWrite={true}
                    gameList={this.state.datas}
                    selectedGameID={this.state.selsectNameIdx}
                    isClose={this.state.iswanfaArray}
                    close={() => {
                        this.setState({
                            iswanfaArray: false,})
                    }}
                    caiZhongClick={(gameData, index) => {
                        // console.log("小莲的index",index);
                        this.setState({
                            iswanfaArray: false,
                            selsectNameIdx: index,
                            currentPlayFaIndex:index,
                            wanfaZhudan: `${gameData.value.wanfa}/`,     //玩法名称
                            heWanfa:gameData.value.xiangqing,           //玩法内容
                        });
                        setTimeout(() => {
                            this._calculationOfProfit(this.state.datas);
                            // this.diyiArrayJieQu02(index)

                            if(this.state.type == 1)
                            {
                                this.beginCalculatePin(false);

                            }
                            else if(this.state.type == 2)
                            {
                                this.fanbeidatesource();
                            }
                            else if(this.state.type == 3)
                            {
                                // this.allenCalculateScheduling(false);
                                if(this.state.planType == 1){
                                    this.allenCalculateScheduling(false);
                                }else if(this.state.planType == 2){
                                    this.CalculationPlanTwo(false);
                                }else {
                                    this.CalculationPlanThere(false);
                                }

                            }
                        }, 100);
                    }
                    } />

                <LoadingView ref='LoadingView' isShow={this.state.isShow} showText={this.state.showText}/>
                <Toast ref="Toast" position='center'/>
            </View>
        }

        //33333智能追号
        else if (this.state.type == 3)
        {
            let maxNun = this.state.maxWinningAmount;
            return <View style={{flex: 1, backgroundColor: '#f6f6f6'}}><View
                style={{flex: 1, backgroundColor: '#f6f6f6'}}>

                <AllenChasePlan visible={this.state.modalVisible} disscallBack={this.disscallBack.bind(this)}
                                basePercent={this.state.basePercent} maxProfitability={this.state.maxProfitability}
                                maxQishu={this.maxQishu} currentQishu={this.state.slectMutipleQiShuNormal} qishuDetail={this.state.qiShu} selseqishu={this.state.qiShuIndex}/>

                {/*截止时间*/}
                <View style={styles.timeStyle}>
                    <CusBaseText
                        style={{color: '#707070'}}>第{this.state.qiShu ? String(this.state.qiShu).substr(String(this.state.qiShu).length - 4) : null}期投注截止时间: </CusBaseText>
                    <CusBaseText  //this.state.currentTime > 0 ? this._changeTime(this.state.currentTime) : '00:00:00'
                        style={{color: '#e33939'}}>{(this.state.isFenPanTime < 0 && this.state.qiShu > 0) ? '已封盘' : this._changeTime(this.state.isFenPanTime)}</CusBaseText>
                </View>

                <View>
                    <View style={[styles.zhuihaoyiStyle, {backgroundColor: 'white'}]}>

                        <View style={{flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center'}}>

                            <CusBaseText style={{fontSize: Adaption.Font(15, 13), color: "#7d7d7d"}}>追号 </CusBaseText>
                            {/*<TextInput style={{width:40,backgroundColor:'yellow',textAlign:'center'}} placeholder = '1' placeholderTextColor = 'black' ></TextInput>*/}
                            <TextInput allowFontScaling={false} keyboardType={global.iOS ? 'number-pad' : 'numeric'}
                                       onChangeText={(text) => {

                                           if (text > this.maxQishu) {
                                               text = this.maxQishu + '';

                                               DeviceEventEmitter.emit('changeQiShu', {textN: text});
                                           }
                                           if (this.state.isNormalChaseNumberModel) {
                                               this.state.slectMutipleQiShuNormal = text != '' ? (text) : ('');
                                               DeviceEventEmitter.emit('changeQiShu', {textN: this.state.slectMutipleQiShuNormal});

                                               this.setState({});
                                           }
                                           else {
                                               this.state.slectMutipleQiShu = text != '' ? (text) : ('');
                                               DeviceEventEmitter.emit('changeQiShu', {textN: this.state.slectMutipleQiShuNormal});

                                               // this.props.multipleClick ? this.props.multipleClick(text) : null;  //回调输入的倍数
                                               this.setState({});
                                           }

                                           //这里需要做个判断当前追号类型
                                           // this.calculateScheduling(text, this.state.planType);
                                           if(this.state.slectMutipleQiShu > 0)
                                           {
                                               this.beginCalculate2(false,this.state.realQishu);

                                           }

                                       }}
                                       returnKeyType="done"
                                       maxLength={5}
                                       style={{
                                           padding: 0,
                                           width: (iphone5S ? 40 : 50),
                                           height: iphone5S ? 25 : 30,
                                           borderColor: '#b8b8b8',
                                           borderWidth: 1,
                                           backgroundColor: '#fff',

                                           borderRadius: 3,
                                           textAlign: 'center'
                                       }} underlineColorAndroid='transparent'
                                       value={this.state.isNormalChaseNumberModel ? this.state.slectMutipleQiShuNormal : this.state.slectMutipleQiShu}
                                       onFocus={() => {
                                           if (this.state.isNormalChaseNumberModel) {
                                               this.state.slectMutipleQiShuNormal == '' ? this.setState({slectMutipleQiShuNormal: '1'}) : null;
                                           } else {
                                               this.state.slectMutipleQiShu == '' ? this.setState({slectMutipleQiShu: '1'}) : null;
                                           }
                                       }}
                                       onBlur={() => {
                                           if (this.state.isNormalChaseNumberModel) {
                                               this.state.slectMutipleQiShuNormal == '' ? this.setState({slectMutipleQiShuNormal: '1'}) : null;
                                           } else {
                                               this.state.slectMutipleQiShu == '' ? this.setState({slectMutipleQiShu: '1'}) : null;
                                           }
                                       }
                                       }
                            />

                            <CusBaseText style={{
                                fontSize: Adaption.Font(15, 13),
                                color: "#7d7d7d"
                            }}> 期 {this.state.chasePlanStr}</CusBaseText>
                            <TouchableOpacity activeOpacity={0.7} style={{}} onPress={() => {

                            // this.props.navigation.navigate('KnowChanPlan3',{'qishu':this.state.qiShu,});

                            // this.setState({modalVisible: true});
                                this.setState({modalVisible: true});
                            }}>
                            <Text style={{fontWeight: '500', fontSize: Adaption.Font(15, 13), color: '#3AA0E4',}}> 修改方案
                            ></Text>
                            </TouchableOpacity>


                        </View>

                    </View>

                    {/*<View style={{*/}
                        {/*// backgroundColor: 'white',*/}
                        {/*paddingVertical: 5,*/}
                        {/*flexDirection: 'row',*/}
                        {/*// justifyContent: 'center',*/}
                        {/*alignItems:'center',*/}
                        {/*paddingRight: 10,*/}
                        {/*height:40*/}
                    {/*}}>*/}



                        {/*<CusBaseText style={{marginLeft:10}} >注单选择:</CusBaseText>*/}


                        {/*<CusBaseText style={{marginLeft:10,flex:0.6,backgroundColor:'blue'}} >选择框预留</CusBaseText>*/}

                        {/*<TouchableOpacity activeOpacity={0.7} style={{flex:0.4,backgroundColor:'red'}} onPress={() => {*/}

                            {/*this.props.navigation.navigate('KnowChanPlan3',{'qishu':this.state.qiShu,});*/}

                            {/*// this.setState({modalVisible: true});*/}
                        {/*}}>*/}
                            {/*<Text style={{fontWeight: '500', fontSize: Adaption.Font(19, 17), color: '#3AA0E4',}}>修改方案*/}
                                {/*></Text>*/}
                        {/*</TouchableOpacity>*/}
                    {/*</View>*/}
                    <View style={{
                        backgroundColor: '#f6f6f6',
                        paddingVertical: 10,
                        flexDirection: 'row',
                        alignItems:'center',
                        paddingLeft: 10,

                    }}>
                        {/*<TouchableOpacity activeOpacity={0.7} onPress={() => {*/}
                        {/*this.setState({modalVisible: true});*/}
                        {/*}}>*/}
                        {/*<Text style={{fontWeight: '500', fontSize: Adaption.Font(19, 17), color: '#3AA0E4'}}>修改方案*/}
                        {/*></Text>*/}
                        {/*</TouchableOpacity>*/}

                        <View style={[SmartStlye.linBox,{marginTop:0}]}>
                            <CusBaseText style={[SmartStlye.leftTextStyle,{marginLeft:0,color:'black'}]}> 注单选择: </CusBaseText>


                            <TouchableOpacity activeOpacity={1} style={SmartStlye.maxBorderStyle} onPress={() => {  this.openArrWanFa() }}>
                                <View style={SmartStlye.ZhuanXSStyle}>
                                    <CusBaseText numberOfLines={1} style={[SmartStlye.centerText01,{color:'black'}]}>
                                        {`${this.state.wanfaZhudan}`}{this._xiangqingBallsTextView(this.state.heWanfa)}
                                    </CusBaseText>

                                </View>
                                <Image style={SmartStlye.ZhuanDImg} source={require('../img/ic_buyLot_downRow.png')}></Image>
                            </TouchableOpacity>


                        </View>

                    </View>


                </View>

                {/*表头*/}
                <View style={styles.biaoTouStyle}>

                    <View style={{flex: 0.1}}/>
                    <CusBaseText style={{
                        // fontSize: ((width == 320) ? (14) : (16)),
                        // color: '#707070',
                        // flex: 0.5,
                        // textAlign: 'center',
                        // writingDirection: 'rtl',

                        textAlignVertical: 'center',
                        textAlign: 'center',
                        // flex: 0.7,
                        width: 30,
                        height: 40,
                        writingDirection: 'rtl',
                        fontSize: ((width == 320) ? (14) : (16)),
                        color: '#707070',
                        borderColor: '#d2d2d2',
                        // borderWidth: 1,
                        // borderRadius: 11,
                        lineHeight: 20,
                        marginTop: -10,


                    }}> 序号</CusBaseText>

                    <View style={{flex: 0.25}}/>

                    <CusBaseText style={{
                        // fontSize: ((width == 320) ? (14) : (16)),
                        // color: '#707070',
                        // textAlign: 'center',
                        // writingDirection: 'rtl',


                        textAlignVertical: 'center',
                        textAlign: 'center',
                        // flex: 0.7,
                        width: 23,
                        height: 40,
                        writingDirection: 'rtl',
                        fontSize: ((width == 320) ? (14) : (16)),
                        color: '#707070',
                        borderColor: '#d2d2d2',
                        // borderWidth: 1,
                        // borderRadius: 11,
                        lineHeight: 20,
                        marginTop: -10,

                    }}> 期号</CusBaseText>
                    <CusBaseText style={{
                        fontSize: ((width == 320) ? (14) : (16)),
                        color: '#707070',
                        flex: 1.1,
                        textAlign: 'center',
                    }}>倍数</CusBaseText>
                    <CusBaseText style={{
                        fontSize: ((width == 320) ? (14) : (16)),
                        color: '#707070',
                        flex: 0.5,
                        textAlign: 'center',
                    }}>金额</CusBaseText>
                    <CusBaseText style={{
                        fontSize: ((width == 320) ? (14) : (16)),
                        color: '#707070',
                        flex: 0.9,
                        textAlign: 'center',
                    }}>中奖盈利</CusBaseText>
                    <CusBaseText style={{
                        fontSize: ((width == 320) ? (14) : (16)),
                        color: '#707070',
                        flex: 0.75,
                        textAlign: 'center',
                    }}>盈利率</CusBaseText>
                </View>

                <FlatList
                    // scrollEnabled={false}
                    ref='myListView'
                    data={this.state.isNormalChaseNumberModel ? this.state.dataSourceNormal : this.state.dataSource
                    }
                    extraData={this.state.indexone}
                    renderItem={(date) => this.renderItem(date)}
                />


            </View>
                <View style={{backgroundColor: '#dbdbdb', height: 1, width: SCREEN_WIDTH}}/>

                <View style={{height: 49, flexDirection: 'row', marginBottom: iphoneX ? 34 : 0}}>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
                        <View>
                            {this.state.isStop ? (<TouchableOpacity onPress={() => {
                                    this.setState({isStop: false})
                                }} activeOpacity={1} style={styles.check_Box}>
                                    <View style={{
                                        borderColor: '#a5a5a5', borderRadius: 3, borderWidth: 1, width: 25, height: 25,
                                        alignItems:
                                            'center', justifyContent: 'center'
                                    }}>
                                        <Image style={{width: 20, height: 20,}}
                                               source={require('../img/ic_smart_checkBox.png')}/></View>

                                </TouchableOpacity>) :
                                (<TouchableOpacity onPress={() => {
                                    this.setState({isStop: true})
                                }} activeOpacity={1} style={styles.check_Box}>
                                    <View style={{
                                        borderColor: '#a5a5a5',
                                        borderRadius: 3,
                                        borderWidth: 1,
                                        width: 25,
                                        height: 25
                                    }}/>

                                </TouchableOpacity>)}
                        </View>
                        <View style={{marginLeft: 10}}>
                            <CusBaseText
                                style={{fontSize: Adaption.Font(18, 16), color: "#6a6a6a"}}>中奖后停止追号</CusBaseText>
                            <CusBaseText style={{marginTop: 0, fontSize: Adaption.Font(18, 16), color: "#6a6a6a"}}>共追
                                <CusBaseText
                                    style={{
                                        color: "#e33939",
                                        fontSize: Adaption.Font(18, 16)
                                    }}> {this.state.dataSourceNormal.length} </CusBaseText>期
                                <CusBaseText
                                    style={{
                                        color: "#e33939",
                                        fontSize: Adaption.Font(18, 16)
                                    }}> {this.state.isNormalChaseNumberModel ? this.state.totalMoneyNormal.money : this.state.totalMoney.money}
                                </CusBaseText>元
                            </CusBaseText>
                        </View>
                    </View>
                    <TouchableOpacity activeOpacity={0.7} onPress={this.submit}>
                        <View style={{
                            height: 49,
                            backgroundColor: this.state.isLockFengPan == true ? "#bfbfbf" : "#b52e2f",
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <Text allowFontScaling={false}
                                  style={{marginHorizontal: 10, fontSize: 17, color: 'white'}}>确认投注</Text>
                        </View>
                    </TouchableOpacity>
                </View>


                <ArrNameBtn
                    isAllenWrite={true}
                    gameList={this.state.datas}
                    selectedGameID={this.state.selsectNameIdx}
                    isClose={this.state.iswanfaArray}
                    close={() => {
                        this.setState({
                            iswanfaArray: false,})
                    }}
                    caiZhongClick={(gameData, index) => {
                        // console.log("小莲的index",index);
                        this.setState({
                            iswanfaArray: false,
                            selsectNameIdx: index,
                            currentPlayFaIndex:index,
                            wanfaZhudan: `${gameData.value.wanfa}/`,     //玩法名称
                            heWanfa:gameData.value.xiangqing,           //玩法内容
                        });
                        setTimeout(() => {
                            // this._calculationOfProfit(this.state.datas);
                            // this.beginCalculatePin(false);
                            // this.diyiArrayJieQu02(index)
                            this._calculationOfProfit(this.state.datas);
                            // this.diyiArrayJieQu02(index)

                            if(this.state.type == 1)
                            {
                                this.beginCalculatePin(false);

                            }
                            else if(this.state.type == 2)
                            {
                                this.fanbeidatesource();
                            }
                            else if(this.state.type == 3)
                            {
                                // this.allenCalculateScheduling(false);
                                if(this.state.planType == 1){
                                    this.allenCalculateScheduling(false,this.state.realQishu);
                                }else if(this.state.planType == 2){
                                    this.CalculationPlanTwo(false,this.state.realQishu);
                                }else {
                                    this.CalculationPlanThere(false,this.state.realQishu);
                                }

                            }
                        }, 100);
                    }
                    } />

                <LoadingView ref='LoadingView' isShow={this.state.isShow} showText={this.state.showText}/>
                <Toast ref="Toast" position='center'/>
            </View>
        }
    }


    //2222翻倍页面计算注单
    fanbeidatesource()
    {
        let dataarray = [];
        let qishuNumer = this.state.qiShu;  //当前期数
        // this.setState({
        //     iswanfaArray: false,
        //     selsectNameIdx: index,
        //     wanfaZhudan: `${gameData.value.wanfa}/`,     //玩法名称
        //     heWanfa:gameData.value.xiangqing,           //玩法内容
        // });

        let  haha = this.state.datas[this.state.selsectNameIdx];
        let singePrice = haha.value.singlePrice * haha.value.zhushu;   //一注基本倍数
        let totalMoney = 0;
        let qishibeishu = parseInt(this.state.fanbeiqishibeishu);  //上一期倍数
        for (let i = 0; i < this.state.fanbeizhuihaoqishu; i++)
        {

            // 当期倍数 = 起始倍数 + 翻数* 期数
            // let currentNum = i == 0 ? parseInt(this.state.fanbeiqishibeishu): this.state.fanbeiselectindex == 1 ?parseInt(this.state.fanbeiqishibeishu) : parseInt(this.state.fanbeiqishibeishu) * this.state.fanbeiselectindex * i;

            qishibeishu = i==0? qishibeishu:qishibeishu * this.state.fanbeiselectindex;

            totalMoney +=  qishibeishu * singePrice;

            dataarray.push({
                time: qishuNumer++,
                num: qishibeishu,           //当期倍数
                money: totalMoney.toFixed(2),       //当期总本金
                openTime: '',
                key: i
            });

        }

        this.setState({dataSourceNormal:dataarray,fanbeiTotalMoney:totalMoney.toFixed(2)});
    }

    submit = () => {
        // console.log(this.state.isNormalChaseNumberModel?this.state.dataSourceNormal:this.state.dataSource,this.state.isStop);
        if (this.startQishuInfo.length <= 0 || (this.state.isNormalChaseNumberModel ? this.state.dataSourceNormal.length == 0 : this.state.dataSource == 0)) {
            this.refs.Toast && this.refs.Toast.show(`投注失败！请先选择投注方案`, 1000);
            return;
        }

        if (this.state.isLockFengPan == true) {

            this.refs.Toast && this.refs.Toast.show('当前期数已封盘，禁止投注!', 2000);
        } else {

            this._comformRequest(this.props.navigation);
        }

    }

    //cell
    renderItem(date) {
        // console.log('index', date,this.state.maxWinningAmount);
        return (

            <SmartChaseCell allenData={date} clickPlus={this.clickPlus.bind(this)}
                            clickMinus={this.clickMinus.bind(this)}
                            maxWinningAmount={this.state.maxWinningAmount}
                            jineCallBack={this.jineCallBack.bind(this)}/>

        );
    }

    jineCallBack() {

    }

    //点击加号按钮
    clickPlus(item) {

        item.num++;

        let objectT = this.state.datas[this.state.currentPlayFaIndex];
        item.money = (item.num * objectT.value.singlePrice).toFixed(2)

        // item.money = (item.num * this.state.baseMoney).toFixed(2)
        // console.log("加");
        //    刷新
        //     this.refs.myListView
        this.totalMoney();
    }

    //点击减号按钮
    clickMinus(item) {
        if (item.num == 1) return;
        item.num--;

        let objectT = this.state.datas[this.state.currentPlayFaIndex];
        item.money = (item.num * objectT.value.singlePrice).toFixed(2)

        // item.money = (item.num * this.state.baseMoney).toFixed(2)
        // console.log("减");
        this.totalMoney();
    }

    //计算总金额跟注数
    totalMoney() {
        let money = 0;
        let zhushu = 0;
        let totalArr = this.state.isNormalChaseNumberModel ? this.state.dataSourceNormal : this.state.dataSource;

        // let objectT = this.state.datas[this.state.currentPlayFaIndex];
        // item.money = (item.num * objectT.value.totalPrice).toFixed(2)


        for (let i = 0; i < totalArr.length; i++) {
            // zhushu +=  totalArr[i].num;
            // money += totalArr[i].num * this.state.baseMoney
            money += totalArr[i].num * (this.state.datas[this.state.currentPlayFaIndex].value.singlePrice);

            totalArr[i].money = money.toFixed(2);
        }
        // this.setState({
        //     totalMoney:{zhushu:zhushu,money:money}
        // });
        if (this.state.isNormalChaseNumberModel)
        {
            //this.state.totalMoneyNormal.zhushu = zhushu;
            this.state.totalMoneyNormal.money = money.toFixed(2);
            this.state.fanbeiTotalMoney = money.toFixed(2);;

        }
        else
        {
            // this.state.totalMoney.zhushu = zhushu;
            this.state.totalMoney.money = money.toFixed(2);
            this.state.fanbeiTotalMoney = money.toFixed(2);;
        }
        this.state.indexone++;
        this.setState({});
        // console.log("怎么不执行");
    }


    //计算追号方案一
    allenCalculateScheduling(fasle,myqiShu) {
        // console.log("myqishu",myqiShu);
        if (this.startQishuInfo.length <= 0) return;
        let qishuPlans = [];
        let qishuNumer = myqiShu?myqiShu:this.state.qiShu;
        // console.log("qishuNumer",qishuNumer);
        // let openTime = this.startQishuInfo[0].value.end_time;
        let count = 0;
        let slectMutipleQiShu = this.state.isNormalChaseNumberModel ? this.state.slectMutipleQiShuNormal : this.state.slectMutipleQiShu;
        let slectMutipleStartBeishu = this.state.isNormalChaseNumberModel ? this.state.slectMutipleStartBeishuNormal : this.state.slectMutipleStartBeishu;
        let slectMutipleEveryTimesMultiplyBeiShu = this.state.slectMutipleEveryTimesMultiplyBeiShu;
        let slectMutipleEveryTimesQiShu = this.state.slectMutipleEveryTimesQiShu;

        let zhushu = 0;
        let moneyZ = 0;
        for (let i = 0; i < slectMutipleQiShu; i++) {
            let dadao = true;
            let qishu = qishuNumer++;

            let num = this.state.isNormalChaseNumberModel ? parseInt(slectMutipleStartBeishu) : slectMutipleStartBeishu * Math.pow(slectMutipleEveryTimesMultiplyBeiShu, Math.floor(count / slectMutipleEveryTimesQiShu));
            // moneyZ += num * this.state.baseMoney;
            moneyZ += num * this.state.datas[this.state.currentPlayFaIndex].value.singlePrice;
            let money = (moneyZ).toFixed(2);
            // let moneyjs = (moneyZ).toFixed(2);

            // console.log("之前", num, moneyZ, (this.state.maxWinningAmount * num - money).toFixed(2), ((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(0));
            let  origin = num;
            if (((this.state.maxWinningAmount * num - money) * 100 / money) < parseInt(this.state.minimumProfitabilityInTheWholeProcess)) {
                dadao = false;
                while (true) {
                    num++;
                    // moneyZ += this.state.baseMoney;
                    // moneyZ += num * this.state.datas[this.state.currentPlayFaIndex].value.singlePrice;
                    let realMoneyZ = moneyZ + (num-origin)*this.state.datas[this.state.currentPlayFaIndex].value.singlePrice;
                    money = (realMoneyZ).toFixed(2);



                    //计算用
                  // let  moneyZz = num * this.state.datas[this.state.currentPlayFaIndex].value.singlePrice;
                  //  moneyjs = (moneyZz).toFixed(2);

                    let sex = ((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(2);
                    // sex = parseInt(sex,2);
                    // console.log("呵是呵", num, moneyZ, (this.state.maxWinningAmount * num - money).toFixed(2), ((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(0));
                    if ((((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(3) >= parseInt(this.state.minimumProfitabilityInTheWholeProcess)) || num >= 10000) {
                        if ((((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(3) >= parseInt(this.state.minimumProfitabilityInTheWholeProcess))) {
                            dadao = true;
                            moneyZ = realMoneyZ;
                        }
                        break;
                    }
                }
            }
            if (dadao) {
                qishuPlans.push({
                    time: qishu,
                    num: num,
                    money: money,
                    openTime: '',
                    key: i
                });
            } else {
                break;
            }
            count++;
            zhushu = this.state.baseZhuShu;
        }

        if (this.state.isNormalChaseNumberModel) {
            this.state.totalMoneyNormal.zhushu = zhushu;

            if (qishuPlans.length > 0) {
                let item = qishuPlans[qishuPlans.length - 1];
                this.state.totalMoneyNormal.money = item.money;
            }
            else {
                this.state.totalMoneyNormal.money = '0';
            }

        } else {
            this.state.totalMoney.zhushu = zhushu;
            if (qishuPlans.length > 0) {
                let item = qishuPlans[qishuPlans.length - 1];
                this.state.totalMoneyNormal.money = item.money;
            }
            else {
                this.state.totalMoneyNormal.money = '0';
            }
            // this.state.totalMoneyNormal.money = moneyZ.toFixed(2);
        }

        this.state.isNormalChaseNumberModel ? this.setState({dataSourceNormal: qishuPlans}) : this.setState({

            dataSource: qishuPlans
        })

        //期数发生变化
        if (fasle) {
            this.setState({
                qiShuChange: false
            })

            //弹框提示
            if (qishuPlans.length < slectMutipleQiShu) {
                this.setState({
                    modalVisible: false,
                    slectMutipleQiShuNormal: `${qishuPlans.length}`,
                });

                // if(fasle)
                {
                    this.refs.Toast && this.refs.Toast.show(`期数发生变化，方案智能生成${qishuPlans.length}期`, 1000);
                }
                // else
                // {
                //     setTimeout(() => {
                //         Alert.alert("盈利率设置过大",`方案智能生成${qishuPlans.length}期`,[{
                //             text: '确定', onPress: () => {
                //             }
                //         },])
                //     }, 100);
                // }
            }
            else {
                this.refs.Toast && this.refs.Toast.show('期数发生变化，成功生成追号方案', 1000);
            }

        }
        else {

            DeviceEventEmitter.emit('changeQiShu', {textN: `${qishuPlans.length}`});

            //弹框提示
            if (qishuPlans.length < slectMutipleQiShu) {
                this.setState({
                    modalVisible: false,
                    slectMutipleQiShuNormal: `${qishuPlans.length}`,
                });

                // if(fasle)
                // {
                //     this.refs.Toast && this.refs.Toast.show(`期数发生变化，方案智能生成${qishuPlans.length}期`, 1000);
                // }
                // else
                {
                    setTimeout(() => {
                        Alert.alert("盈利率设置过大", `方案智能生成${qishuPlans.length}期`, [{
                            text: '确定', onPress: () => {
                            }
                        },])
                    }, 100);
                }
            }
            else {
                this.refs.Toast && this.refs.Toast.show('成功生成追号方案', 1000);
            }
        }

        return qishuPlans;
    }

    //追号方案二
    CalculationPlanTwo(fasle,myqiShu) {

        if (this.startQishuInfo.length <= 0) return;
        let qishuPlans = [];
        let qishuNumer = myqiShu?myqiShu:this.state.qiShu;
        // let openTime = this.startQishuInfo[0].value.end_time;

        let count = 0;
        //追号第一部分起始期数
        let slectMutipleQiShu = this.state.isNormalChaseNumberModel ? this.state.beforePeriod : this.state.slectMutipleQiShu;

        //追号起始倍数
        let slectMutipleStartBeishu = this.state.isNormalChaseNumberModel ? this.state.slectMutipleStartBeishuNormal : this.state.slectMutipleStartBeishu;

        //追号前面期数和盈利率
        let slectbeforePeriod = this.state.beforePeriod;
        let slectbeforePeriodProfitability = this.state.beforePeriodProfitability;

        //追号后面的盈利率
        let slectafterPeriodProfitability = this.state.afterPeriodProfitability;


        //这个两个暂时不用管
        let slectMutipleEveryTimesMultiplyBeiShu = this.state.slectMutipleEveryTimesMultiplyBeiShu;
        let slectMutipleEveryTimesQiShu = this.state.slectMutipleEveryTimesQiShu;

        let zhushu = 0;
        let moneyZ = 0;

        //追号二思路  前面可以按照追号一来，唯一区别是追号期数改变，后面需要记住第二部分 起始期数  起始金额  盈利率

        // 封装计算for循环   (起始序列  起始追号倍数 当前期数  追号期数 盈利率 当前总金额 起始倍数)
        let FristQiShi = this.ForCalculation(0, slectMutipleStartBeishu, qishuNumer, slectMutipleQiShu, slectbeforePeriodProfitability, 0, 1);


        //第二部分  拿到第一部分最后一期

        let lastObject = FristQiShi[FristQiShi.length - 1];

        //      (起始序列             起始追号倍数           当前期数      追号期数总期数       第二部门盈利率)
        let mony = parseInt(lastObject.money, 10);
        let num = parseInt(lastObject.num, 10);
        let twoQishi = this.ForCalculation(FristQiShi.length, slectMutipleStartBeishu, lastObject.time + 1, this.state.slectMutipleQiShuNormal, slectafterPeriodProfitability, mony, num);

        qishuPlans = FristQiShi.concat(twoQishi);

        let fanlly = qishuPlans[qishuPlans.length - 1];

        if (this.state.isNormalChaseNumberModel) {
            this.state.totalMoneyNormal.zhushu = zhushu;
            this.state.totalMoneyNormal.money = parseInt(fanlly.money, 10);
        }
        else {
            this.state.totalMoney.zhushu = zhushu;
            this.state.totalMoney.money = moneyZ.toFixed(2);
        }

        this.state.isNormalChaseNumberModel ? this.setState({dataSourceNormal: qishuPlans}) : this.setState({
            dataSource: qishuPlans
        })

        //期数发生变化
        if (fasle) {
            this.setState({
                qiShuChange: false,

            })

            //弹框提示
            if (qishuPlans.length < this.state.slectMutipleQiShuNormal) {
                this.setState({
                    modalVisible: false,
                    slectMutipleQiShuNormal: `${qishuPlans.length}`,
                });

                // if(fasle)
                {
                    this.refs.Toast && this.refs.Toast.show(`期数发生变化，方案智能生成${qishuPlans.length}期`, 1000);
                }
                // else
                // {
                //     setTimeout(() => {
                //         Alert.alert("盈利率设置过大",`方案智能生成${qishuPlans.length}期`,[{
                //             text: '确定', onPress: () => {
                //             }
                //         },])
                //     }, 100);
                // }
            }
            else {
                this.refs.Toast && this.refs.Toast.show('期数发生变化，成功生成追号方案', 1000);
            }

        }
        else {
            this.setState({
                qiShuChange: false,

            });

            //弹框提示
            if (qishuPlans.length < this.state.slectMutipleQiShuNormal) {

                this.setState({
                    modalVisible: false,
                    slectMutipleQiShuNormal: `${qishuPlans.length}`,
                });

                // if(fasle)
                // {
                //     this.refs.Toast && this.refs.Toast.show(`期数发生变化，方案智能生成${qishuPlans.length}期`, 1000);
                // }
                // else
                {
                    setTimeout(() => {
                        Alert.alert("盈利率设置过大", `方案智能生成${qishuPlans.length}期`, [{
                            text: '确定', onPress: () => {
                            }
                        },])
                    }, 100);
                }
            }
            else {
                this.refs.Toast && this.refs.Toast.show('成功生成追号方案', 1000);
            }
        }

        return qishuPlans;
    }

    ForCalculation(begin, slectMutipleStartBeishu, qishuNumer, slectMutipleQiShu, slectbeforePeriodProfitability, totalMoney, currentNum) {
        let qishuPlans = [];
        let zhushu = 0;
        let moneyZ = totalMoney;
        let count = 0;
        for (let i = begin; i < slectMutipleQiShu; i++) {
            let dadao = true;

            //当前期数
            let qishu = qishuNumer++;
            let num = Math.max(slectMutipleStartBeishu, currentNum);

            // 每次增加最小金额 =  最小倍数 * 当前金额底注
            // moneyZ += num * this.state.baseMoney;
            moneyZ += num * this.state.datas[this.state.currentPlayFaIndex].value.singlePrice;
            let money = (moneyZ).toFixed(2);
            let  origin = num;
            //  1 3 2.40 80  当前倍数 当前金额 当前盈利 当前盈利率
            // console.log("之前", num, moneyZ, (this.state.maxWinningAmount * num - money).toFixed(2), ((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(0));
            //maxWinningAmount 单注中奖金额 比如投3元 中5.4  这里如果盈利率小于最小要求盈利率  增加当期投注金额
            let curent = ((this.state.maxWinningAmount * num - money) / money * 100);
            curent = parseInt(curent, 10);
            //第一期特殊处理
            if (i == 0 && (curent > parseInt(slectbeforePeriodProfitability))) {
                dadao = true;
            }
            else if (((this.state.maxWinningAmount * num - money) / money * 100) < parseInt(slectbeforePeriodProfitability)) {
                dadao = false;
                while (true) {
                    //增加投注倍数
                    num++;
                    // moneyZ += this.state.baseMoney;  //
                    // moneyZ += num * this.state.datas[this.state.currentPlayFaIndex].value.singlePrice;
                    // money = (moneyZ).toFixed(2);

                    let realMoneyZ = moneyZ + (num-origin)*this.state.datas[this.state.currentPlayFaIndex].value.singlePrice;
                    money = (realMoneyZ).toFixed(2);
                    //每增加一次投注倍数再次计算盈利率 如果盈利率大于等于最小盈利率 满足要求 dadao赋值true
                    let percent = ((this.state.maxWinningAmount * num - money) / money * 100);
                    percent = parseInt(percent, 10);
                    if ((parseInt(slectbeforePeriodProfitability) <= ((this.state.maxWinningAmount * num - money) / money * 100).toFixed(2)) || num >= 10000) {
                        if ((parseInt(slectbeforePeriodProfitability) <= ((this.state.maxWinningAmount * num - money) / money * 100).toFixed(2))) {
                            dadao = true;
                            moneyZ = realMoneyZ;
                        }
                        break;
                    }
                }
            }

            if (dadao) {
                qishuPlans.push({
                    time: qishu,  //当前期数
                    num: num,  //当前倍数
                    money: money,  //当前总金额
                    openTime: '',
                    key: i
                });
            }
            else {
                break;
            }
            count++;
            zhushu = this.state.baseZhuShu;

        }


        return qishuPlans;
    }

    //智能追号方案三
    CalculationPlanThere(fasle,myqiShu) {

        if (this.startQishuInfo.length <= 0) return;

        // this.startQishuInfo
        // {time: '20171221078',num:'1',money:'2'};
        let qishuPlans = [];
        let qishuNumer = myqiShu?myqiShu:this.state.qiShu;
        // let openTime = this.startQishuInfo[0].value.end_time;

        let count = 0;
        let slectMutipleQiShu = this.state.isNormalChaseNumberModel ? this.state.slectMutipleQiShuNormal : this.state.slectMutipleQiShu;
        let slectMutipleStartBeishu = this.state.isNormalChaseNumberModel ? this.state.slectMutipleStartBeishuNormal : this.state.slectMutipleStartBeishu;
        let slectMutipleEveryTimesMultiplyBeiShu = this.state.slectMutipleEveryTimesMultiplyBeiShu;
        let slectMutipleEveryTimesQiShu = this.state.slectMutipleEveryTimesQiShu;

        let zhushu = 0;
        let moneyZ = 0;

        for (let i = 0; i < slectMutipleQiShu; i++) {
            let dadao = true;
            let qishu = qishuNumer++;

            let num = this.state.isNormalChaseNumberModel ? parseInt(slectMutipleStartBeishu) : slectMutipleStartBeishu * Math.pow(slectMutipleEveryTimesMultiplyBeiShu, Math.floor(count / slectMutipleEveryTimesQiShu));
            // moneyZ += num * this.state.baseMoney;
            moneyZ += num * this.state.datas[this.state.currentPlayFaIndex].value.singlePrice;
            let money = (moneyZ).toFixed(2);
            let  origin = num;
            // console.log("之前", num, moneyZ, (this.state.maxWinningAmount * num - money).toFixed(2), ((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(0));
            if (((this.state.maxWinningAmount * num - money)) < parseInt(this.state.totalProfitability)) {
                dadao = false;
                while (true) {
                    num++;
                    // moneyZ += this.state.baseMoney;
                    // moneyZ += num * this.state.datas[this.state.currentPlayFaIndex].value.singlePrice;
                    // money = (moneyZ).toFixed(2);

                    let realMoneyZ = moneyZ + (num-origin)*this.state.datas[this.state.currentPlayFaIndex].value.singlePrice;
                    money = (realMoneyZ).toFixed(2);
                    // console.log("呵是呵", num, moneyZ, (this.state.maxWinningAmount * num - money).toFixed(2), ((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(0));
                    if ((((this.state.maxWinningAmount * num - money)) >= parseInt(this.state.totalProfitability)) || num >= 10000) {
                        if ((((this.state.maxWinningAmount * num - money)) >= parseInt(this.state.totalProfitability))) {
                            dadao = true;
                            moneyZ = realMoneyZ;
                        }
                        break;
                    }
                }
            }

            // console.log("之后", num, moneyZ, this.state.maxWinningAmount * num, (this.state.maxWinningAmount * num - money).toFixed(2), ((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(0));
            if (dadao) {
                qishuPlans.push({
                    time: qishu,
                    num: num,
                    money: money,
                    openTime: '',
                    key: i
                });
            } else {
                break;
            }
            count++;
            zhushu = this.state.baseZhuShu;
            // console.log((this.state.maxWinningAmount * num - money).toFixed(2), ((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(0));
            // console.log(((this.state.maxWinningAmount * num - money) * 100 / money) >= parseInt(this.state.minimumProfitabilityInTheWholeProcess));
        }

        if (this.state.isNormalChaseNumberModel) {
            this.state.totalMoneyNormal.zhushu = zhushu;
            // this.state.totalMoneyNormal.money = moneyZ.toFixed(2);
            if (qishuPlans.length > 0) {
                let item = qishuPlans[qishuPlans.length - 1];
                this.state.totalMoneyNormal.money = item.money;
            }
            else {
                this.state.totalMoneyNormal.money = '0';
            }
        } else {
            this.state.totalMoney.zhushu = zhushu;
            // this.state.totalMoney.money = moneyZ.toFixed(2);
            if (qishuPlans.length > 0) {
                let item = qishuPlans[qishuPlans.length - 1];
                this.state.totalMoneyNormal.money = item.money;
            }
            else {
                this.state.totalMoneyNormal.money = '0';
            }
        }


        this.state.isNormalChaseNumberModel ? this.setState({dataSourceNormal: qishuPlans}) : this.setState({

            dataSource: qishuPlans
        })

        //期数发生变化
        if (fasle) {
            this.setState({
                qiShuChange: fasle
            })

            //弹框提示
            if (qishuPlans.length < slectMutipleQiShu) {
                this.setState({
                    modalVisible: false,
                    slectMutipleQiShuNormal: `${qishuPlans.length}`,
                });

                // if(fasle)
                {
                    this.refs.Toast && this.refs.Toast.show(`期数发生变化，方案智能生成${qishuPlans.length}期`, 1000);
                }
                // else
                // {
                //     setTimeout(() => {
                //         Alert.alert("盈利率设置过大",`方案智能生成${qishuPlans.length}期`,[{
                //             text: '确定', onPress: () => {
                //             }
                //         },])
                //     }, 100);
                // }
            }
            else {
                this.refs.Toast && this.refs.Toast.show('期数发生变化，成功生成追号方案', 1000);
            }

        }
        else {
            //弹框提示
            if (qishuPlans.length < slectMutipleQiShu) {
                this.setState({
                    modalVisible: false,
                    slectMutipleQiShuNormal: `${qishuPlans.length}`,
                });

                // if(fasle)
                // {
                //     this.refs.Toast && this.refs.Toast.show(`期数发生变化，方案智能生成${qishuPlans.length}期`, 1000);
                // }
                // else
                {
                    setTimeout(() => {
                        Alert.alert("盈利率设置过大", `方案智能生成${qishuPlans.length}期`, [{
                            text: '确定', onPress: () => {
                            }
                        },])
                    }, 100);
                }
            }
            else {
                this.refs.Toast && this.refs.Toast.show('成功生成追号方案', 1000);
            }
        }

        return qishuPlans;
    }

    //计算追号方案
    calculateScheduling(text, type) {


        if (this.startQishuInfo.length <= 0) return;

        // this.startQishuInfo
        // {time: '20171221078',num:'1',money:'2'};
        let qishuPlans = [];
        let qishuNumer = this.state.qiShu;
        // let openTime = this.startQishuInfo[0].value.end_time;

        let count = 0;
        let slectMutipleQiShu = this.state.isNormalChaseNumberModel ? this.state.slectMutipleQiShuNormal : this.state.slectMutipleQiShu;
        let slectMutipleStartBeishu = this.state.isNormalChaseNumberModel ? this.state.slectMutipleStartBeishuNormal : this.state.slectMutipleStartBeishu;
        let slectMutipleEveryTimesMultiplyBeiShu = this.state.slectMutipleEveryTimesMultiplyBeiShu;
        let slectMutipleEveryTimesQiShu = this.state.slectMutipleEveryTimesQiShu;

        let zhushu = 0;
        let moneyZ = 0;


        switch (type) {
            case 1:
                if (this.state.isNormalChaseNumberModel) {
                    slectMutipleQiShu = text != '' ? (this.state.slectMutipleQiShuNormal) : ('1');
                }
                else {
                    slectMutipleQiShu = text != '' ? (this.state.slectMutipleQiShu) : ('1');
                }
                break;
            case 2:
                if (this.state.isNormalChaseNumberModel) {
                    slectMutipleStartBeishu = text != '' ? (this.state.slectMutipleStartBeishuNormal) : ('1');
                }
                else {
                    slectMutipleStartBeishu = text != '' ? (this.state.slectMutipleStartBeishu) : ('1');
                }
                break;
            case 3:
                slectMutipleEveryTimesQiShu = text != '' ? (this.state.slectMutipleEveryTimesQiShu) : ('1');
                break;
            case 4:
                slectMutipleEveryTimesMultiplyBeiShu = text != '' ? (this.state.slectMutipleEveryTimesMultiplyBeiShu) : ('1');
                break;
        }

        for (let i = 0; i < slectMutipleQiShu; i++) {
            let qishu = qishuNumer++;
            let num = this.state.isNormalChaseNumberModel ? parseInt(slectMutipleStartBeishu) : slectMutipleStartBeishu * Math.pow(slectMutipleEveryTimesMultiplyBeiShu, Math.floor(count / slectMutipleEveryTimesQiShu));
            // moneyZ += num * this.state.baseMoney;
            moneyZ += num * this.state.datas[this.state.currentPlayFaIndex].value.singlePrice;
            let money = (moneyZ).toFixed(2);
            // console.log("之前", num, moneyZ, this.state.maxWinningAmount * num - money, ((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(0));
            if (((this.state.maxWinningAmount * num - money) * 100 / money) < parseInt(this.state.minimumProfitabilityInTheWholeProcess)) {
                while (true) {
                    num++;
                    // moneyZ += this.state.baseMoney;
                    moneyZ += num * this.state.datas[this.state.currentPlayFaIndex].value.singlePrice;
                    money = (moneyZ).toFixed(2);
                    // console.log("呵是呵", num, moneyZ, this.state.maxWinningAmount * num - money, ((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(0));
                    if ((((this.state.maxWinningAmount * num - money) * 100 / money) >= parseInt(this.state.minimumProfitabilityInTheWholeProcess)) || num >= 100) {
                        break;
                    }
                }
            }
            // console.log("之后", num, moneyZ, this.state.maxWinningAmount * num - money, ((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(0));
            qishuPlans.push({
                time: qishu,
                num: num,
                money: money,
                openTime: '',
                key: i
            });
            count++;
            zhushu = this.state.baseZhuShu;
            // console.log(this.state.maxWinningAmount * num - money, ((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(0));
            // console.log(((this.state.maxWinningAmount * num - money) * 100 / money) >= parseInt(this.state.minimumProfitabilityInTheWholeProcess));
        }
        if (this.state.isNormalChaseNumberModel) {
            this.state.totalMoneyNormal.zhushu = zhushu;
            this.state.totalMoneyNormal.money = moneyZ.toFixed(2);
        }
        else {
            this.state.totalMoney.zhushu = zhushu;
            this.state.totalMoney.money = moneyZ.toFixed(2);
        }

        this.state.isNormalChaseNumberModel ? this.setState({dataSourceNormal: qishuPlans}) : this.setState({
            dataSource: qishuPlans
        })
        return qishuPlans;
    }


    _changeTime(time) {

        if (time == null || time <= 0) {
            return '00:00:00';

        } else {

            let hour = Math.floor(time / (60 * 60));  // 总时间戳 / (1小时的秒数)
            let min = Math.floor(time / 60 % 60);  // 总时间戳 / 1分钟的秒数 % 1分钟的秒数
            let seconds = Math.floor(time % 60);  // 总时间戳 % 1分钟的秒数
            return `${hour < 10 ? '0' + hour : hour}:${min < 10 ? '0' + min : min}:${seconds < 10 ? '0' + seconds : seconds}`;
        }
    }

    //定时器开始
    _setTimeInval() {

        //重新加载数据
        if (this.timer) {
            return;
        }
        this.timer = setInterval(() => {

            if (this.state.isFenPanTime < 0) {
                this.setState({
                    isLockFengPan: true,
                });
            } else {
                this.setState({
                    isLockFengPan: false,
                });
            }
            if (this.state.currentTime < 1 && this.startQishuInfo.length > 0) {

                //      PushNotification.emit('CountTimeDeadLine1');  //倒计时结束发出通知
                // 准备取下一期的时间。
                this.currentIdx += 1;
                //切换到下一期的时候会走if里面的内容
                if (this.currentIdx < this.startQishuInfo.length) {
                    // console.log("这是什么");
                    // 下一期的stopless 要减少上一期的openless。
                    let stopTime = this.startQishuInfo[this.currentIdx].stopless - this.startQishuInfo[this.currentIdx - 1].openless;
                    let openTime = this.startQishuInfo[this.currentIdx].openless - this.startQishuInfo[this.currentIdx - 1].openless;
                    let qishu = this.startQishuInfo[this.currentIdx].qishu;

                    this.setState({
                        isFenPanTime: stopTime,  // 封盘时间
                        currentTime: openTime,     // 开奖时间
                        qiShu: qishu,  //下一期开奖的期数
                        qiShuChange: true,
                        isLockFengPan: false,
                        realQishu:qishu,
                        qiShuIndex:0
                    });

                    if (this.state.isNormalChaseNumberModel) {
                        if(this.state.type == 1){
                            this.beginCalculatePin(this.state.qiShuChange);
                        }else if(this.state.type == 2){
                            this.fanbeidatesource();
                        }else {
                            // if(this.state.planType == 1) {
                            //     this.allenCalculateScheduling(this.state.qiShuChange);
                            // }
                            DeviceEventEmitter.emit('changeQiShuIndex', {qiShuIndex: 0});

                            if(this.state.planType == 1){
                                this.allenCalculateScheduling(this.state.qiShuChange);
                            }else if(this.state.planType == 2){
                                this.CalculationPlanTwo(this.state.qiShuChange);
                            }else {
                                this.CalculationPlanThere(this.state.qiShuChange);
                            }
                            // this.allenCalculateScheduling(this.state.qiShuChange);
                        }

                    }
                    else {
                        this.allenCalculateScheduling(this.state.qiShuChange);
                    }

                    PushNotification.emit('CountTimeDeadLine1');  //倒计时结束发出通知

                }
            }
            // console.log('this.currentIdx,为什么 ',this.currentIdx);

            // 已封盘 且nextData数据已经用到最后一期了。请先去请求了。
            if (this.state.isFenPanTime == 0 && this.currentIdx >= this.startQishuInfo.length - 1) {
                // console.log("这是什么让我看看");
                // 请求新的倒计时数据。
                this._featchData(this.state.tag);
            }

            this.setState({
                isFenPanTime: this.state.isFenPanTime - 1,
                currentTime: this.state.currentTime - 1,
            });

        }, 1000);

    }


//刷新头部倒计时
    _featchData(tag) {
        let params = new FormData();
        params.append('ac', 'getCplogList');
        params.append('tag', tag);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                if (responseData.msg == 0 && responseData.data.length != 0) {

                    this.startQishuInfo = responseData.data[0].next;
                    // console.log("开始期数信息",this.startQishuInfo);
                    this.currentIdx = 0;  // 重置。

                    let stopTime = this.startQishuInfo [0].stopless;
                    let openTime = this.startQishuInfo [0].openless;
                    let qishu = this.startQishuInfo [0].qishu;

                    this.setState({
                        isFenPanTime: stopTime,  // 封盘时间
                        currentTime: openTime,     // 开奖时间
                        qiShu: qishu,  //下一期开奖的期数
                        isShow: false,
                        realQishu:qishu,
                        qiShuIndex:0
                    });
                }

                if (this.state.isNormalChaseNumberModel) {
                    if(this.state.type==1){
                        this.beginCalculatePin(this.state.qiShuChange);
                    }else if(this.state.type == 2){
                        this.fanbeidatesource()
                    }else {
                        DeviceEventEmitter.emit('changeQiShuIndex', {qiShuIndex: 0});
                        // this.allenCalculateScheduling(this.state.qiShuChange);
                        if(this.state.planType == 1){
                            this.allenCalculateScheduling(this.state.qiShuChange);
                        }else if(this.state.planType == 2){
                            this.CalculationPlanTwo(this.state.qiShuChange);
                        }else {
                            this.CalculationPlanThere(this.state.qiShuChange);
                        }
                    }
                }
                else {
                    // this.allenCalculateScheduling(this.state.qiShuChange);
                    if(this.state.planType == 1){
                        this.allenCalculateScheduling(this.state.qiShuChange);
                    }else if(this.state.planType == 2){
                        this.CalculationPlanTwo(this.state.qiShuChange);
                    }else {
                        this.CalculationPlanThere(this.state.qiShuChange);
                    }


                }

                this._setTimeInval();
            })
            .catch((err) => {
                this.setState({
                    isShow: false
                });
            })
    }


    //计算盈利
    _calculationOfProfit(datas) {


        if(this.state.type == 1){
            // console.log(datas);
            let maxWinningAmount = 0;
            // for (let i = 0; i < datas.length; i++) {
                let value = datas[this.state.currentPlayFaIndex].value;
                // console.log(value.peilv, this.state.baseMoney, value);

                let peiAry = value.peilv.split("|");

                let pei = peiAry.pop();
                maxWinningAmount += pei * value.singlePrice;
            // }


            // console.log(maxWinningAmount);
            this.setState({maxWinningAmount: maxWinningAmount})
            // console.log("中奖金额", maxWinningAmount - this.state.baseMoney);
        } else if(this.state.type == 2){
            // console.log(datas);
            // let maxWinningAmount = 0;
            // for (let i = 0; i < datas.length; i++) {
            //     let value = datas[i].value;
            //     console.log(value.peilv, this.state.baseMoney, value);
            //
            //     let peiAry = value.peilv.split("|");
            //
            //     let pei = peiAry.pop();
            //     maxWinningAmount += pei * value.singlePrice;
            // }
            //
            //
            // console.log(maxWinningAmount);
            // this.setState({maxWinningAmount: maxWinningAmount})
            // console.log("中奖金额", maxWinningAmount - this.state.baseMoney);




            // console.log(datas);
            let maxWinningAmount = 0;
            // for (let i = 0; i < datas.length; i++) {
            let value = datas[this.state.currentPlayFaIndex].value;
            // console.log(value.peilv, this.state.baseMoney, value);

            let peiAry = value.peilv.split("|");

            let pei = peiAry.pop();
            maxWinningAmount += pei * value.singlePrice;
            // }


            // console.log(maxWinningAmount);
            this.setState({maxWinningAmount: maxWinningAmount})
            // console.log("中奖金额", maxWinningAmount - this.state.baseMoney);

        } else if(this.state.type == 3){
            // console.log(datas);
            // let maxWinningAmount = 0;
            // for (let i = 0; i < datas.length; i++) {
            //     let value = datas[i].value;
            //     console.log(value.peilv, this.state.baseMoney, value);
            //
            //     let peiAry = value.peilv.split("|");
            //
            //     let pei = peiAry.pop();
            //     maxWinningAmount += pei * value.singlePrice;
            // }
            //
            //
            // console.log(maxWinningAmount);
            // this.setState({maxWinningAmount: maxWinningAmount})
            // console.log("中奖金额", maxWinningAmount - this.state.baseMoney);


            // console.log(datas);
            let maxWinningAmount = 0;
            // for (let i = 0; i < datas.length; i++) {
            let value = datas[this.state.currentPlayFaIndex].value;
            // console.log(value.peilv, this.state.baseMoney, value);

            let peiAry = value.peilv.split("|");

            let pei = peiAry.pop();
            maxWinningAmount += pei * value.singlePrice;
            // }


            // console.log(maxWinningAmount);
            this.setState({maxWinningAmount: maxWinningAmount})
            // console.log("中奖金额", maxWinningAmount - this.state.baseMoney);
        }

    }

    //确认投注的方法
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


        let {datas, tag, js_tag, isStop} = this.state;
        let  datasCopy = this.cloneDeep(datas);
        let date = [datas[this.state.currentPlayFaIndex]];
        //克隆一个对象 防止源数据污染Allen
        let dateCopy = [datasCopy[this.state.currentPlayFaIndex]];
        // console.log("datadatacopy",dateCopy,date);

        // let {dataSource, tag, js_tag, zhuiQiShu, beiShu, isStop} = this.state;
        // let parameter = {
        //     dataSource: dataSource,
        //     tag: tag,
        //     js_tag: js_tag,
        //     zhuiQiShu: zhuiQiShu,
        //     beiShu: beiShu,
        //     isStop: isStop ? 1 : 0,
        // }

        let beishuArray = [];
        for (let i = 0; i < this.state.dataSourceNormal.length; i++) {
            let object = this.state.dataSourceNormal[i];
            beishuArray.push(object.num);
        }



        let parameter = {

            dataSource: dateCopy,
            zhuiQiShu: this.state.dataSourceNormal.length,
            isStop: isStop ? 1 : 0,
            beiShu: 2,
            beiShuArray: beishuArray,
        }

        // 如果dataSource里的期数小于当前期数，再提示他清空 或保留下一期
        if (datas[0].value.qishu == "")
        {
            Alert.alert("提示", "期数没获取到！")

        }
        else if (parseInt(datas[0].value.qishu) < parseInt(this.state.qiShu))
        {
            Alert.alert("提示", `${datas[0].value.qishu}该期已截止，清空或保留到下一期`,
                [

                    {
                        text: '切换下一期', onPress: () => {

                            for(let i = 0; i < datas.length; i++)
                            {
                                datas[i].value.qishu = this.state.qiShu;
                                datasCopy[i].value.qishu = this.state.qiShu;
                            }
                        }
                    }
                ])
            return;
        }



        //start allen 重要判断期数比对 只针对智能追号
        if ((parseInt(datas[0].value.qishu) < parseInt(this.state.realQishu))&&this.state.type == 3){
            for(let i = 0; i < datas.length; i++)
            {
                // datas[i].value.qishu = this.state.realQishu;
                datasCopy[i].value.qishu = this.state.realQishu;
            }
        }

        //end

        if (uid.length != 0 && token.length != 0) {
            this.state.isShow = true;
            this.state.showText = "正在提交投注";
            this.refs.LoadingView && this.refs.LoadingView.showLoading('正在提交投注');
            let params = TouZhuParam.returnSubmitTuoZhuParam(parameter);
            // console.log('购物车参数', params);

            var promise = GlobalBaseNetwork.sendNetworkRequest(params);
            promise
                .then((responseData) => {
                    this.setState({isShow: false});

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

                        //发出清空号码的通知
                        PushNotification.emit('ClearAllBalls');

                        // this.setState({
                        //     dataSource: [],
                        //     totalPrice: 0,   //总价格
                        //     totalZhuShu: 0,  //总的注数
                        //     beiShu: 1, //倍数默认为1倍
                        // })


                        // unifyPrice = 0;
                        ShopHistoryArr = [];  //历史购物车赋空
                        global.BeiShu = '1';     //重新初始化，防止下次进来计算出错
                        global.ZhuiQiShu = '1';
                        PushNotification.emit('ClearShopCarOffNotification');  //清空购物车，屏蔽查看购物车按钮的通知
                        PushNotification.emit('HandAutoAddNotification', 0);

                        global.isInShopCarVC = true;
                        PushNotification.emit('TouZhuSuccessNotifcation', touZhuSuccessMessge); //投注成功通知
                        navigate.goBack(this.state.backKey);

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
                        Alert.alert(
                            '提示',
                            responseData.param,
                            [{
                                text: '确定', onPress: () => {
                                }
                            }],
                        )
                    }
                })
                .catch((err) => {

                    this.refs.LoadingView && this.refs.LoadingView.dissmiss();

                })
        }
    }


    iTofixed(num, fractionDigits) {

        return (Math.round(num * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits) + Math.pow(10, -(fractionDigits + 1))).toString().slice(0, -1)

    };


    componentWillUnmount() {
        // console.log("销毁");
        this.timer && clearInterval(this.timer);
        //this.timer1 && clearTimeout(this.timer1);

    }



    // 详情显示 加上颜色
    _xiangqingBallsTextView(ballsText) {

        if (ballsText == null || ballsText == '') {
            return [];
        }

        if (!ballsText.includes('(')) {
            return <CusBaseText  style={{color: '#e33939'}}>{ballsText}</CusBaseText>
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
                <CusBaseText  key={a} style={{color: a % 2 == 0 ? 'black' : '#e33939'}}>
                    {string}
                </CusBaseText>
            );
        }
        return textViews;
    }



    diyiArrayJieQu02(index){

        if (this.state.datas.length < 0) {
            return;
        }

        let array = this.state.datas;
        var newArray = [];
        var arr = array;
        var newArr = []  // 为了使用数组的push方法，一定要定义数据类型为数组
        for (var x = 0; x < arr.length; x++){
            newArr.push(arr[x])  // 用循环逐个把值保存在新数组内
        }

        newArray = newArr.splice(index,1);

        //选择从那个数组开始到那个数组结束
        // console.log('要传的数组0000',newArray);
        this.setState({
            nexWanFa:newArray,
            noBeforePrice:newArray[0].value.singlePrice,
            oneZhuShu:newArray[0].value.zhushu,
        });

        this._maxAllYiLv(); //重新计算盈利

    }


    openArrWanFa(){

        this.setState({
            iswanfaArray:!this.state.iswanfaArray,
        })
    }



    //深拷贝AllenWang

    cloneDeep(obj){
        if( typeof obj !== 'object' || Object.keys(obj).length === 0 ){
            return obj
        }
        let resultData = {}
        return this.recursion(obj, resultData)
    }

     recursion(obj, data={}){
        for(key in obj){
            if( typeof obj[key] == 'object' && Object.keys(obj[key].length>0 )){
                data[key] = this.recursion(obj[key])
            }else{
                data[key] = obj[key]
            }
        }
        return data
    }

}

const styles = StyleSheet.create({

    superViewStyles: {},

    timeStyle: {
        backgroundColor: '#f6f6f6',
        height: 30,
        width: global.width,
        // textAlign:'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },

    switchStyle: {
        backgroundColor: "white",
        height: 46,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',

    },

    switchTextStyle: {
        color: '#6a6a6a',
        // height:46,
        // width:global.width/2,
        fontSize: 17,
    },

    zhuihaoyiStyle: {
        flexDirection: 'row',

        height: 50,
        alignItems: 'center',
        justifyContent: 'center',

    },

    biaoTouStyle: {

        flexDirection: 'row',

        height: 48,
        backgroundColor: 'white',
        alignItems: 'center',

    },

    cellSuperStyle: {
        height: 38,
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'space-around',
        alignItems: 'center',

    },

})