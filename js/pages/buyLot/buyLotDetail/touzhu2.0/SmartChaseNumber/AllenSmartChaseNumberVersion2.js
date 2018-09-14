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
import SmartChaseCell from './AllenSmartChaseCell';
import Toast, {DURATION} from 'react-native-easy-toast'
import TouZhuParam from '../../TouZhuParam';
import AllenChasePlan from './AllenChasePlan';


// 对没错，在这里拿到了屏幕的宽高了。
const {width, height} = Dimensions.get('window');

let iphoneX = global.iOS ? (SCREEN_HEIGHT == 812 ? true : false) : 0; //是否是iphoneX

// let iphoneX = SCREEN_HEIGHT == 812 ? true : false;
let iphone5S = global.iOS ? (SCREEN_WIDTH == 320 ? true : false) : 0;

// var currentQiShu = '';  //定义当前期数

export default class SmartChaseNumber extends Component {


    static navigationOptions = ({navigation, screenProps}) => ({

        header: (
            <CustomNavBar
                centerText = {"智能追号"}
                leftClick={() =>  { global.isInShopCarVC = true; navigation.goBack()} }
            />
        ),

    });

    constructor(props) {
        super(props);
        this.startQishuInfo = [];
        this.maxQishu = 20;

        let totalWinMoney = 0;

        for (let i = 0;i < this.props.navigation.state.params.datas.length;i ++)
        {
            var item = this.props.navigation.state.params.datas[i];

            let peiAry = item.value.peilv.split("|");

            let pei = peiAry.pop();

            //每个彩种的中奖最大值
            totalWinMoney += parseFloat(pei) * item.value.singlePrice;
        }

        // //最大盈利率
        let yinglilv =  parseInt((totalWinMoney - this.props.navigation.state.params.totalPrice) / this.props.navigation.state.params.totalPrice * 100 );
        //
        // // yinglilv = yinglilv /2;
        // yinglilv = yinglilv > 0 ? (yinglilv / 2) :(yinglilv * 2);
        // if (yinglilv > 10000)
        // {
        //     yinglilv = 10000;
        // }

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
           
            currentTime:'', //截止时间
            isFenPanTime:'',
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
            basePercent:'39',
            qiShuChange:false,   //是否是期数变化
            isLockFengPan:false,  //是否显示已封盘
            
        }

        this.currentIdx = 0;  // 记录时间期数。
    }


    componentWillMount() {


        // this._setTimeInval();
    }


    componentDidMount() {

        global.isInShopCarVC = false; //进入下一界面时改为false,防止弹窗在别的界面弹出

        this.props.navigation.setParams({
            allenNeedGoback: this._allenNeedGoback
        });


        this.refs.LoadingView && this.refs.LoadingView.showLoading('正在加载中...');
        this._featchData(this.state.tag);
        this._calculationOfProfit(this.state.datas);
    }


    _allenNeedGoback = () => {
        this.props.navigation.goBack();
    }

    //选择追号方案回调
    disscallBack(isShow, planData)
    {

        if (isShow == false)
        {
            this.setState({
                modalVisible :false
            })
        }
        //追号盈利率超过最大盈利率判断提示框

        if (planData)
        {
            let maxYinglilv = (this.state.maxWinningAmount -  this.state.baseMoney)/ this.state.baseMoney *100;

            //方案一最大盈利过大
            if(planData.planType == 1 && (parseInt(planData.minimumProfitabilityInTheWholeProcess,10) > maxYinglilv))
            {
                setTimeout(() => {
                    Alert.alert("盈利率设置过大",`无法计算，请重新设置,此方案的最大盈利率约为${parseInt(maxYinglilv,10)}%`, [{
                        text: '确定', onPress: () => {
                            this.state.modalVisible = true;
                        }
                    },])
                }, 100);
                return;
            }
            else if (planData.planType == 2 && (planData.beforePeriodProfitability > maxYinglilv))
            {
                setTimeout(() => {
                    Alert.alert("盈利率设置过大",`无法计算，请重新设置,此方案的最大盈利率约为${parseInt(maxYinglilv,10)}%`, [{
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

            //开始计算
            this.beginCalculate(false);
        }
        else
        {
            this.state.modalVisible = isShow;
        }
    }

    beginCalculate(fasle)
    {
        //追号方案一
        if(this.state.planType == 1)
        {
            this.allenCalculateScheduling(fasle);
        }
        //追号方案二
        else if(this.state.planType == 2)
        {
            this.CalculationPlanTwo(fasle);
        }
        else
        {
            this.CalculationPlanThere(fasle);
        }
    }

    render() {

        let maxNun = this.state.maxWinningAmount;
        return <View style={{flex: 1, backgroundColor: '#f6f6f6'}}><View style={{flex: 1, backgroundColor: '#f6f6f6'}}>

            <AllenChasePlan visible={this.state.modalVisible} disscallBack={this.disscallBack.bind(this)} basePercent = {this.state.basePercent} maxProfitability = {this.state.maxProfitability} maxQishu = {this.maxQishu} currentQishu = {this.state.slectMutipleQiShuNormal}  />

            {/*截止时间*/}
            <View style={styles.timeStyle}>
                <CusBaseText
                    style={{color: '#707070'}}>第{this.state.qiShu ? String(this.state.qiShu).substr(String(this.state.qiShu).length-4):null}期投注截止时间: </CusBaseText>
                <CusBaseText  //this.state.currentTime > 0 ? this._changeTime(this.state.currentTime) : '00:00:00'
                    style={{color: '#e33939'}}>{ (this.state.isFenPanTime < 0 && this.state.qiShu > 0) ? '已封盘' : this._changeTime(this.state.isFenPanTime)}</CusBaseText>
            </View>
           
            <View>
                <View style={[styles.zhuihaoyiStyle, {backgroundColor: 'white'}]}>

                    <View style={{flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <CusBaseText style={{fontSize: Adaption.Font(17,15), color: "#7d7d7d"}}>追号 </CusBaseText>
                        {/*<TextInput style={{width:40,backgroundColor:'yellow',textAlign:'center'}} placeholder = '1' placeholderTextColor = 'black' ></TextInput>*/}
                        <TextInput allowFontScaling={false} keyboardType={global.iOS ? 'number-pad' : 'numeric'}
                                   onChangeText={(text) => {

                                       if (text > this.maxQishu)
                                       {
                                           text = this.maxQishu + '';

                                           DeviceEventEmitter.emit('changeQiShu', {textN:text});
                                       }
                                       if (this.state.isNormalChaseNumberModel)
                                       {
                                           this.state.slectMutipleQiShuNormal = text != '' ? (text) : ('');
                                           DeviceEventEmitter.emit('changeQiShu', {textN:this.state.slectMutipleQiShuNormal });

                                           this.setState({});
                                       }
                                       else
                                       {
                                           this.state.slectMutipleQiShu = text != '' ? (text) : ('');
                                           DeviceEventEmitter.emit('changeQiShu', {textN:this.state.slectMutipleQiShuNormal });

                                           // this.props.multipleClick ? this.props.multipleClick(text) : null;  //回调输入的倍数
                                           this.setState({});
                                       }

                                       //这里需要做个判断当前追号类型
                                       // this.calculateScheduling(text, this.state.planType);

                                       this.beginCalculate(false);

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

                        <CusBaseText style={{fontSize: Adaption.Font(17,15), color: "#7d7d7d"}}> 期 {this.state.chasePlanStr}</CusBaseText>
                    </View>

                </View>
                <View style={{
                    backgroundColor: 'white',
                    paddingVertical: 5,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    paddingRight: 10
                }}>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => {
                        this.setState({modalVisible: true});
                    }}>
                        <Text style={{fontWeight: '500', fontSize: Adaption.Font(19,17), color: '#3AA0E4'}}>修改方案
                            ></Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/*表头*/}
            <View style={styles.biaoTouStyle}>

                <View style={{flex:0.1}} />
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
                    marginTop:-10,


                }}> 序号</CusBaseText>

                <View style={{flex:0.25}} />

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
                    marginTop:-10,

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
                        <CusBaseText style={{fontSize: Adaption.Font(18,16), color: "#6a6a6a"}}>中奖后停止追号</CusBaseText>
                        <CusBaseText style={{marginTop: 0, fontSize: Adaption.Font(18,16), color: "#6a6a6a"}}>共追
                            <CusBaseText
                            style={{color: "#e33939",fontSize: Adaption.Font(18,16)}}> {this.state.dataSourceNormal.length} </CusBaseText>期
                            <CusBaseText
                            style={{color: "#e33939",fontSize: Adaption.Font(18,16)}}> {this.state.isNormalChaseNumberModel ? this.state.totalMoneyNormal.money : this.state.totalMoney.money}
                            </CusBaseText>元
                        </CusBaseText>
                    </View>
                </View>
                <TouchableOpacity activeOpacity={0.7} onPress={this.submit}>
                    <View style={{height: 49, backgroundColor: this.state.isLockFengPan == true ? "#bfbfbf": "#b52e2f",flexDirection: 'row', alignItems: 'center'}}>
                        <Text allowFontScaling={false}
                              style={{marginHorizontal: 10, fontSize: 17, color: 'white'}}>确认投注</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <LoadingView ref='LoadingView' isShow={this.state.isShow} showText={this.state.showText}/>
            <Toast ref="Toast" position='center'/>
        </View>
    }

    submit = () => {
        // console.log(this.state.isNormalChaseNumberModel?this.state.dataSourceNormal:this.state.dataSource,this.state.isStop);
        if (this.startQishuInfo.length <= 0 || (this.state.isNormalChaseNumberModel ? this.state.dataSourceNormal.length == 0 : this.state.dataSource == 0)) {
            this.refs.Toast && this.refs.Toast.show(`投注失败！请先选择投注方案`, 1000);
            return;
        }

        if (this.state.isLockFengPan == true) {

            this.refs.Toast && this.refs.Toast.show('当前期数已封盘，禁止投注!', 2000);
        }else {

            this._comformRequest(this.props.navigation);
        }
        
    }

    //cell
    renderItem(date) {
         console.log('index',date);
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
        item.money = (item.num * this.state.baseMoney).toFixed(2)
        // console.log("加");
        //    刷新
        //     this.refs.myListView
        this.totalMoney();
    }

    //点击减号按钮
    clickMinus(item) {
        if (item.num == 1) return;
        item.num--;
        item.money = (item.num * this.state.baseMoney).toFixed(2)
        // console.log("减");
        this.totalMoney();
    }

    //计算追号方案一
    allenCalculateScheduling(fasle) {

        if (this.startQishuInfo.length <= 0) return;
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
        for (let i = 0; i < slectMutipleQiShu; i++)
        {
            let dadao = true;
            let qishu = qishuNumer++;

            let num = this.state.isNormalChaseNumberModel ? parseInt(slectMutipleStartBeishu) : slectMutipleStartBeishu * Math.pow(slectMutipleEveryTimesMultiplyBeiShu, Math.floor(count / slectMutipleEveryTimesQiShu));
            moneyZ += num * this.state.baseMoney;
            let money = (moneyZ).toFixed(2);

            // console.log("之前", num, moneyZ, (this.state.maxWinningAmount * num - money).toFixed(2), ((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(0));
            if (((this.state.maxWinningAmount * num - money) * 100 / money) < parseInt(this.state.minimumProfitabilityInTheWholeProcess)) {
                dadao = false;
                while (true) {
                    num++;
                    moneyZ += this.state.baseMoney;
                    money = (moneyZ).toFixed(2);

                    let sex = ((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(2);
                    // sex = parseInt(sex,2);
                    // console.log("呵是呵", num, moneyZ, (this.state.maxWinningAmount * num - money).toFixed(2), ((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(0));
                    if ((((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(3) >= parseInt(this.state.minimumProfitabilityInTheWholeProcess)) || num >= 10000) {
                        if ((((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(3) >= parseInt(this.state.minimumProfitabilityInTheWholeProcess)))
                        {
                            dadao = true;
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

        if (this.state.isNormalChaseNumberModel)
        {
            this.state.totalMoneyNormal.zhushu = zhushu;

            if(qishuPlans.length > 0)
            {
                let item = qishuPlans[qishuPlans.length - 1];
                this.state.totalMoneyNormal.money = item.money;
            }
            else
            {
                this.state.totalMoneyNormal.money = '0';
            }

        } else {
            this.state.totalMoney.zhushu = zhushu;
            if(qishuPlans.length > 0)
            {
                let item = qishuPlans[qishuPlans.length - 1];
                this.state.totalMoneyNormal.money = item.money;
            }
            else
            {
                this.state.totalMoneyNormal.money = '0';
            }
            // this.state.totalMoneyNormal.money = moneyZ.toFixed(2);
        }

        this.state.isNormalChaseNumberModel ? this.setState({dataSourceNormal: qishuPlans}) : this.setState({

            dataSource: qishuPlans
        })

        //期数发生变化
        if(fasle)
        {
            this.setState({
                qiShuChange:fasle
            })

            //弹框提示
            if(qishuPlans.length < slectMutipleQiShu)
            {
                this.setState({
                    modalVisible :false,
                    slectMutipleQiShuNormal:`${qishuPlans.length}`,
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
            else
            {
                this.refs.Toast && this.refs.Toast.show('期数发生变化，成功生成追号方案', 1000);
            }

        }
        else
        {

            DeviceEventEmitter.emit('changeQiShu', {textN:`${qishuPlans.length}` });

            //弹框提示
            if(qishuPlans.length < slectMutipleQiShu)
            {
                this.setState({
                    modalVisible :false,
                    slectMutipleQiShuNormal:`${qishuPlans.length}`,
                });

                // if(fasle)
                // {
                //     this.refs.Toast && this.refs.Toast.show(`期数发生变化，方案智能生成${qishuPlans.length}期`, 1000);
                // }
                // else
                {
                    setTimeout(() => {
                        Alert.alert("盈利率设置过大",`方案智能生成${qishuPlans.length}期`,[{
                            text: '确定', onPress: () => {
                            }
                        },])
                    }, 100);
                }
            }
            else
            {
                this.refs.Toast && this.refs.Toast.show('成功生成追号方案', 1000);
            }
        }

        return qishuPlans;
    }

    //追号方案二
    CalculationPlanTwo(fasle){

        if (this.startQishuInfo.length <= 0) return;
        let qishuPlans = [];
        let qishuNumer = this.state.qiShu;
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
        let FristQiShi = this.ForCalculation(0,slectMutipleStartBeishu,qishuNumer,slectMutipleQiShu ,slectbeforePeriodProfitability,0,1);


        //第二部分  拿到第一部分最后一期

        let lastObject = FristQiShi[FristQiShi.length -1];

        //      (起始序列             起始追号倍数           当前期数      追号期数总期数       第二部门盈利率)
        let mony = parseInt(lastObject.money,10);
        let num = parseInt(lastObject.num,10);
        let twoQishi = this.ForCalculation(FristQiShi.length,slectMutipleStartBeishu,lastObject.time + 1,this.state.slectMutipleQiShuNormal,slectafterPeriodProfitability,mony,num);

        qishuPlans = FristQiShi.concat(twoQishi);

        let fanlly = qishuPlans[qishuPlans.length -1];

        if (this.state.isNormalChaseNumberModel)
        {
            this.state.totalMoneyNormal.zhushu = zhushu;
            this.state.totalMoneyNormal.money = parseInt(fanlly.money,10);
        }
        else
        {
            this.state.totalMoney.zhushu = zhushu;
            this.state.totalMoney.money = moneyZ.toFixed(2);
        }

        this.state.isNormalChaseNumberModel ? this.setState({dataSourceNormal: qishuPlans}) : this.setState({
            dataSource: qishuPlans
        })

        //期数发生变化
        if(fasle)
        {
            this.setState({
                qiShuChange:fasle,

            })

            //弹框提示
            if(qishuPlans.length < this.state.slectMutipleQiShuNormal)
            {
                this.setState({
                    modalVisible :false,
                    slectMutipleQiShuNormal:`${qishuPlans.length}`,
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
            else
            {
                this.refs.Toast && this.refs.Toast.show('期数发生变化，成功生成追号方案', 1000);
            }

        }
        else
        {
            this.setState({
                qiShuChange:fasle,

            });

            //弹框提示
            if(qishuPlans.length < this.state.slectMutipleQiShuNormal)
            {

                this.setState({
                    modalVisible :false,
                    slectMutipleQiShuNormal:`${qishuPlans.length}`,
                });

                // if(fasle)
                // {
                //     this.refs.Toast && this.refs.Toast.show(`期数发生变化，方案智能生成${qishuPlans.length}期`, 1000);
                // }
                // else
                {
                    setTimeout(() => {
                        Alert.alert("盈利率设置过大",`方案智能生成${qishuPlans.length}期`,[{
                            text: '确定', onPress: () => {
                            }
                        },])
                    }, 100);
                }
            }
            else
            {
                this.refs.Toast && this.refs.Toast.show('成功生成追号方案', 1000);
            }
        }

        return qishuPlans;
    }

    ForCalculation(begin,slectMutipleStartBeishu,qishuNumer,slectMutipleQiShu,slectbeforePeriodProfitability,totalMoney,currentNum)
    {
        let qishuPlans = [];
        let zhushu = 0;
        let moneyZ = totalMoney;
        let count = 0;
        for (let i = begin; i < slectMutipleQiShu; i++)
        {
            let dadao = true;

            //当前期数
            let qishu = qishuNumer++;
            let num = Math.max(slectMutipleStartBeishu,currentNum);

            // 每次增加最小金额 =  最小倍数 * 当前金额底注
            moneyZ += num * this.state.baseMoney ;
            let money = (moneyZ).toFixed(2);
            //  1 3 2.40 80  当前倍数 当前金额 当前盈利 当前盈利率
            // console.log("之前", num, moneyZ, (this.state.maxWinningAmount * num - money).toFixed(2), ((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(0));
            //maxWinningAmount 单注中奖金额 比如投3元 中5.4  这里如果盈利率小于最小要求盈利率  增加当期投注金额
            let curent = ((this.state.maxWinningAmount *num   - money ) / money * 100 );
            curent = parseInt(curent,10);
            //第一期特殊处理
            if (i == 0 && (curent > parseInt(slectbeforePeriodProfitability)))
            {
                dadao = true;
            }
            else if(((this.state.maxWinningAmount *num - money ) / money * 100 ) < parseInt(slectbeforePeriodProfitability))
            {
                dadao = false;
                while (true)
                {
                    //增加投注倍数
                    num++;
                    moneyZ += this.state.baseMoney;  //
                    money = (moneyZ).toFixed(2);
                    //每增加一次投注倍数再次计算盈利率 如果盈利率大于等于最小盈利率 满足要求 dadao赋值true
                    let percent = ((this.state.maxWinningAmount *num   - money ) / money * 100 );
                    percent = parseInt(percent,10);
                    if ((parseInt(slectbeforePeriodProfitability) <= ((this.state.maxWinningAmount *num   - money ) / money * 100 ).toFixed(2) )  || num >= 10000)
                    {
                        if ((parseInt(slectbeforePeriodProfitability) <= ((this.state.maxWinningAmount *num  - money ) / money * 100 ).toFixed(2) ) )
                        {
                            dadao = true;
                        }
                        break;
                    }
                }
            }

            if (dadao)
            {
                qishuPlans.push({
                    time: qishu,  //当前期数
                    num: num ,  //当前倍数
                    money: money,  //当前总金额
                    openTime: '',
                    key: i
                });
            }
            else
            {
                break;
            }
            count++;
            zhushu = this.state.baseZhuShu;

        }


        return qishuPlans;
    }

    //智能追号方案三
    CalculationPlanThere(fasle){

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

        for (let i = 0; i < slectMutipleQiShu; i++)
        {
            let dadao = true;
            let qishu = qishuNumer++;

            let num = this.state.isNormalChaseNumberModel ? parseInt(slectMutipleStartBeishu) : slectMutipleStartBeishu * Math.pow(slectMutipleEveryTimesMultiplyBeiShu, Math.floor(count / slectMutipleEveryTimesQiShu));
            moneyZ += num * this.state.baseMoney;
            let money = (moneyZ).toFixed(2);

            // console.log("之前", num, moneyZ, (this.state.maxWinningAmount * num - money).toFixed(2), ((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(0));
            if (((this.state.maxWinningAmount * num - money) ) < parseInt(this.state.totalProfitability)) {
                dadao = false;
                while (true) {
                    num++;
                    moneyZ += this.state.baseMoney;
                    money = (moneyZ).toFixed(2);
                    // console.log("呵是呵", num, moneyZ, (this.state.maxWinningAmount * num - money).toFixed(2), ((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(0));
                    if ((((this.state.maxWinningAmount * num - money)) >= parseInt(this.state.totalProfitability)) || num >= 10000)
                    {
                        if ((((this.state.maxWinningAmount * num - money) ) >= parseInt(this.state.totalProfitability))) {
                            dadao = true;
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
            if(qishuPlans.length > 0)
            {
                let item = qishuPlans[qishuPlans.length - 1];
                this.state.totalMoneyNormal.money = item.money;
            }
            else
            {
                this.state.totalMoneyNormal.money = '0';
            }
        } else {
            this.state.totalMoney.zhushu = zhushu;
            // this.state.totalMoney.money = moneyZ.toFixed(2);
            if(qishuPlans.length > 0)
            {
                let item = qishuPlans[qishuPlans.length - 1];
                this.state.totalMoneyNormal.money = item.money;
            }
            else
            {
                this.state.totalMoneyNormal.money = '0';
            }
        }


        this.state.isNormalChaseNumberModel ? this.setState({dataSourceNormal: qishuPlans}) : this.setState({

            dataSource: qishuPlans
        })

        //期数发生变化
        if(fasle)
        {
            this.setState({
                qiShuChange:fasle
            })

            //弹框提示
            if(qishuPlans.length < slectMutipleQiShu)
            {
                this.setState({
                    modalVisible :false,
                    slectMutipleQiShuNormal:`${qishuPlans.length}`,
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
            else
            {
                this.refs.Toast && this.refs.Toast.show('期数发生变化，成功生成追号方案', 1000);
            }

        }
        else
        {
            //弹框提示
            if(qishuPlans.length < slectMutipleQiShu)
            {
                this.setState({
                    modalVisible :false,
                    slectMutipleQiShuNormal:`${qishuPlans.length}`,
                });

                // if(fasle)
                // {
                //     this.refs.Toast && this.refs.Toast.show(`期数发生变化，方案智能生成${qishuPlans.length}期`, 1000);
                // }
                // else
                {
                    setTimeout(() => {
                        Alert.alert("盈利率设置过大",`方案智能生成${qishuPlans.length}期`,[{
                            text: '确定', onPress: () => {
                            }
                        },])
                    }, 100);
                }
            }
            else
            {
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
                if (this.state.isNormalChaseNumberModel)
                {
                    slectMutipleQiShu = text != '' ? (this.state.slectMutipleQiShuNormal) : ('1');
                }
                else
                {
                    slectMutipleQiShu = text != '' ? (this.state.slectMutipleQiShu) : ('1');
                }
                break;
            case 2:
                if (this.state.isNormalChaseNumberModel)
                {
                    slectMutipleStartBeishu = text != '' ? (this.state.slectMutipleStartBeishuNormal) : ('1');
                }
                else
                {
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

        for (let i = 0; i < slectMutipleQiShu; i++)
        {
            let qishu = qishuNumer++;
            let num = this.state.isNormalChaseNumberModel ? parseInt(slectMutipleStartBeishu) : slectMutipleStartBeishu * Math.pow(slectMutipleEveryTimesMultiplyBeiShu, Math.floor(count / slectMutipleEveryTimesQiShu));
            moneyZ += num * this.state.baseMoney;
            let money = (moneyZ).toFixed(2);
            // console.log("之前", num, moneyZ, this.state.maxWinningAmount * num - money, ((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(0));
            if (((this.state.maxWinningAmount * num - money) * 100 / money) < parseInt(this.state.minimumProfitabilityInTheWholeProcess)) {
                while (true) {
                    num++;
                    moneyZ += this.state.baseMoney;
                    money = (moneyZ).toFixed(2);
                    console.log("呵是呵", num, moneyZ, this.state.maxWinningAmount * num - money, ((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(0));
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
            console.log(this.state.maxWinningAmount * num - money, ((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(0));
            console.log(((this.state.maxWinningAmount * num - money) * 100 / money) >= parseInt(this.state.minimumProfitabilityInTheWholeProcess));
        }
        if (this.state.isNormalChaseNumberModel)
        {
            this.state.totalMoneyNormal.zhushu = zhushu;
            this.state.totalMoneyNormal.money = moneyZ.toFixed(2);
        }
        else
        {
            this.state.totalMoney.zhushu = zhushu;
            this.state.totalMoney.money = moneyZ.toFixed(2);
        }

        this.state.isNormalChaseNumberModel ? this.setState({dataSourceNormal: qishuPlans}) : this.setState({
            dataSource: qishuPlans
        })
        return qishuPlans;
    }

    //计算总金额跟注数
    totalMoney() {
        let money = 0;
        let zhushu = 0;
        let totalArr = this.state.isNormalChaseNumberModel ? this.state.dataSourceNormal : this.state.dataSource;
        for (let i = 0; i < totalArr.length; i++) {
            // zhushu +=  totalArr[i].num;
            money += totalArr[i].num * this.state.baseMoney
            totalArr[i].money = money.toFixed(2);
        }
        // this.setState({
        //     totalMoney:{zhushu:zhushu,money:money}
        // });
        if (this.state.isNormalChaseNumberModel) {
            //this.state.totalMoneyNormal.zhushu = zhushu;
            this.state.totalMoneyNormal.money = money.toFixed(2);
        } else {
            // this.state.totalMoney.zhushu = zhushu;
            this.state.totalMoney.money = money.toFixed(2);
        }
        this.state.indexone++;
        this.setState({});
        // console.log("怎么不执行");
    }

    _changeTime(time) {

        if (time == null || time <= 0) {
            return '00:00:00';

        } else {

            let hour = Math.floor(time / (60 * 60));  // 总时间戳 / (1小时的秒数)
            let min = Math.floor(time / 60 % 60);  // 总时间戳 / 1分钟的秒数 % 1分钟的秒数
            let seconds = Math.floor(time % 60);  // 总时间戳 % 1分钟的秒数
            return `${hour < 10 ? '0'+hour : hour}:${min < 10 ? '0'+min : min}:${seconds < 10 ? '0'+seconds : seconds}`;
        }
    }

 //定时器开始
 _setTimeInval() {

    //重新加载数据
    if (this.timer)
    {
        return;
    }
    this.timer = setInterval(() => {

         if(this.state.isFenPanTime < 0 ){
            this.setState({
            isLockFengPan : true,
            });
         }else{
            this.setState({
                isLockFengPan : false,
                });
         }
        if (this.state.currentTime < 1 && this.startQishuInfo.length > 0) {

             //      PushNotification.emit('CountTimeDeadLine1');  //倒计时结束发出通知
            // 准备取下一期的时间。
            this.currentIdx += 1;
            
            if (this.currentIdx < this.startQishuInfo.length) {

                // 下一期的stopless 要减少上一期的openless。
                let stopTime = this.startQishuInfo[this.currentIdx].stopless - this.startQishuInfo[this.currentIdx - 1].openless;
                let openTime = this.startQishuInfo[this.currentIdx].openless - this.startQishuInfo[this.currentIdx - 1].openless;
                let qishu = this.startQishuInfo[this.currentIdx].qishu;

                this.setState({
                    isFenPanTime: stopTime,  // 封盘时间
                    currentTime: openTime,     // 开奖时间
                    qiShu:qishu,  //下一期开奖的期数
                    qiShuChange:true,
                    isLockFengPan:false,
                });

         if (this.state.isNormalChaseNumberModel)
            {
                this.allenCalculateScheduling(this.state.qiShuChange);
            }
            else
            {
                this.allenCalculateScheduling(this.state.qiShuChange);
            }
                
            PushNotification.emit('CountTimeDeadLine1');  //倒计时结束发出通知

            }
        }

        // 已封盘 且nextData数据已经用到最后一期了。请先去请求了。
        if (this.state.isFenPanTime == 0 && this.currentIdx >= this.startQishuInfo.length - 1) {
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

            this.currentIdx = 0;  // 重置。

            let stopTime = this.startQishuInfo [0].stopless;
            let openTime = this.startQishuInfo [0].openless;
            let qishu = this.startQishuInfo [0].qishu;

            this.setState({
                isFenPanTime: stopTime,  // 封盘时间
                currentTime: openTime,     // 开奖时间
                qiShu: qishu,  //下一期开奖的期数
                isShow: false
               
            });
        }

        if (this.state.isNormalChaseNumberModel)
            {
                this.allenCalculateScheduling(this.state.qiShuChange);
            }
            else
            {
                this.allenCalculateScheduling(this.state.qiShuChange);
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
        console.log(datas);
        let maxWinningAmount = 0;
        for (let i = 0; i < datas.length; i++) {
            let value = datas[i].value;
            console.log(value.peilv, this.state.baseMoney, value);

            let peiAry = value.peilv.split("|");

            let pei = peiAry.pop();
            maxWinningAmount += pei * value.singlePrice;
        }


        console.log(maxWinningAmount);
        this.setState({maxWinningAmount: maxWinningAmount})
        console.log("中奖金额", maxWinningAmount - this.state.baseMoney);
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



        let {datas, tag, js_tag,isStop} = this.state;

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
        for (let i = 0;i < this.state.dataSourceNormal.length;i++)
        {
            let object = this.state.dataSourceNormal[i];
            beishuArray.push(object.num);
        }

        let parameter = {

            dataSource :datas,
            zhuiQiShu: this.state.dataSourceNormal.length,
            isStop: isStop ? 1 : 0,
            beiShu: 2,
            beiShuArray:beishuArray,
        }

        // 如果dataSource里的期数小于当前期数，再提示他清空 或保留下一期
        if (datas[0].value.qishu == "" ) {
            Alert.alert("提示", "期数没获取到！")

        } else if (parseInt(datas[0].value.qishu) < parseInt(this.state.qiShu)) {
            Alert.alert("提示", `${datas[0].value.qishu}该期已截止，清空或保留到下一期`,
                [

                    {
                        text: '切换下一期', onPress: () => {
                        datas[0].value.qishu = this.state.qiShu;
                    }
                    }
                ])
            return;
        }

        if (uid.length != 0 && token.length != 0) {
            this.state.isShow = true;
            this.state.showText = "正在提交投注";
            this.refs.LoadingView && this.refs.LoadingView.showLoading('正在提交投注');
            let params = TouZhuParam.returnSubmitTuoZhuParam(parameter);
            console.log('购物车参数', params);

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

        height: 38,
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