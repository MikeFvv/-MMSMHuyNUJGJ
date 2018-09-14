
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
    Modal,
    DeviceEventEmitter,
    
} from 'react-native';

import Toast, {DURATION} from 'react-native-easy-toast'  //土司视图
import LocalImg from "../../../../../res/img";
import Colors from "../../../../../skframework/component/Colors";
const {width, height} = Dimensions.get('window');
let iphoneX = global.iOS ? (SCREEN_HEIGHT == 812 ? true : false) : 0; //是否是iphoneX
let iphone5S = global.iOS ? (SCREEN_WIDTH == 320 ? true : false) : 0;

import SmartBtn from './SmartBtn';
import ArrNameBtn from './ArrNameBtn';
import SmartStlye from './SmartVersion3/SmartStyles';


export default class KnowChanPlan extends Component {

    static navigationOptions = ({navigation, screenProps}) => ({
        header: (
            <CustomNavBar
                centerText = {"修改方案"}
                leftClick={() =>  { global.isInShopCarVC = true; navigation.goBack()} }
            />
        ),
       });

    constructor(props) {
        super(props);

        this.state = {
            showBtn1: true,
            showBtn2: false,
            showBtn3: false,
            maxQishu: 20, //最大期数
            qiShuChange:false,   //是否是期数变化
            isNormalChaseNumberModel: true,
            isOpenQiShu:false,
            iswanfaArray:false,
            selectIdx:0,
            selsectNameIdx:0,

            qishu: this.props.navigation.state.params.qishu,
            tag: this.props.navigation.state.params.tag,
            datas: this.props.navigation.state.params.datas,
            js_tag: this.props.navigation.state.params.js_tag,
            backKey: this.props.navigation.state.params.backKey,

            wanfaZhudan:`${this.props.navigation.state.params.datas[0].value.wanfa}/`,
            heWanfa:this.props.navigation.state.params.datas[0].value.xiangqing,
            haderQishu:this.props.navigation.state.params.qishu,
            selseqishu:this.props.navigation.state.params.qishu,

            slectMutipleQiShuNormal: '10', //刚开始默认10 期 超过就30%的其他期；
            slectMutipleQiShu:'1',
            slectMutipleStartBeishu:'1',
            slectMutipleEveryTimesMultiplyBeiShu:'1',
            slectMutipleEveryTimesQiShu:'1',
            slectMutipleStartBeishuNormal: '1',
            minimumProfitabilityInTheWholeProcess: '30',  //默认给的 最大利率的一半 30%
            maxWinningAmount:0,

            beforePeriod: '5',
            beforePeriodProfitability: '50',
            afterPeriodProfitability: '20',
            totalProfitability: '30', //默认的最低盈利的 30 钱 

            maxProfitability:0,   //最大盈利；
            dataSourceNormal: [],
            dataSource:[],

            
            selseArray:[],
            backArray:[],
            nexWanFa:[],
            currentTime:'', //截止时间
            isFenPanTime:'',

            beiShu:this.props.navigation.state.params.beiShu, //倍数
            zhuiQiShu:this.props.navigation.state.params.zhuiQiShu, 
                // 是否追期 投的倍数 
            noBeforePrice:this.props.navigation.state.params.datas[0].value.singlePrice,

            oneZhuShu:this.props.navigation.state.params.datas[0].value.zhushu,
            oneMoney: this.props.navigation.state.params.datas[0].value.singlePrice,

            totalPrice:0,

            baseZhuShu: 0, // 刚开始进来取第一个玩法的的注数
            baseMoney: 0,   //刚开始进来取第一个玩法的金额  计算盈利生成期数

           

            totalMoney: { },
            totalMoneyNormal: { },

        }

        this.startQishuInfo =[];
        this.currentIdx = 0;  // 记录时间期数。
    }


    componentWillMount() {}

    
    componentWillUnmount() {
        this.subscription.remove();
        this.timer && clearInterval(this.timer);
    }

    componentDidMount() {

        global.isInShopCarVC = false;

        this._maxAllYiLv(); //先计算最大盈利
        this._calculationOfProfit(); //在计算全部盈利      
        this._featchData(this.state.tag);

        this.subscription = DeviceEventEmitter.addListener('changeQiShu', (dic) => {
            //接收到详情页发送的通知，刷新首页的数据，改变按钮颜色和文字，刷新UI
            this.setState({
                qishu: dic.textN,
            });
        });
    }


   //计算最大盈利
    _maxAllYiLv(){

        this.state.totalPrice = this.state.noBeforePrice/(this.state.zhuiQiShu * this.state.beiShu);

        this.state.oneMoney =  this.state.totalPrice,


        this.state.baseZhuShu = this.state.oneZhuShu, // 刚开始进来取第一个玩法的的注数
        this.state.baseMoney = this.state.totalPrice,   //刚开始进来取第一个玩法的金额  计算盈利生成期数

        this.state.totalMoney = {  //判断是那个玩法的总价格跟注视 来计算生成的最大期

            zhushu:this.state.oneZhuShu,
            money: this.state.totalPrice,
        };

        this.state.totalMoneyNormal = {  //判断是那个玩法的总价格跟注视 来计算生成的默认期数
            zhushu:this.state.oneZhuShu,
            money: this.state.totalPrice,
        };

     
        let totalWinMoney = 0;

        let isOneArray = this.state.nexWanFa.length > 0 ? this.state.nexWanFa : this.state.datas;  //判断第一次进去是否选择玩法 如果不是第一次进去就重新选择玩法 重新形成数组

        for (let i = 0;i < isOneArray.length;i ++)
        {
            var item = isOneArray[i];
            let peiAry = item.value.peilv.split("|");
            let pei = peiAry.pop();
            //每个彩种的中奖最大值
            totalWinMoney += parseFloat(pei) * item.value.singlePrice;
        }
        // //最大盈利率
        let yinglilv =  parseInt((totalWinMoney - this.state.totalPrice) / this.state.totalPrice * 100 );

         this.state.maxProfitability = yinglilv;
         this._calculationOfProfit(); //在计算全部盈利 
         
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
             console.log('要传的数组0000',newArray);
                this.setState({
                     nexWanFa:newArray, 
                     noBeforePrice:newArray[0].value.singlePrice,
                     oneZhuShu:newArray[0].value.zhushu,
                });

                this._maxAllYiLv(); //重新计算盈利
                                   
       }

    //计算盈利
    _calculationOfProfit() {

        let isOneArray = this.state.nexWanFa.length > 0 ? this.state.nexWanFa : this.state.datas;  //判断第一次进去是否选择玩法 如果不是第一次进去就重新选择玩法 重新形成数组

        let maxWinningAmount = 0;
        for (let i = 0; i < isOneArray.length; i++) {
            let value = isOneArray[i].value;
            let peiAry = value.peilv.split("|");

            let pei = peiAry.pop();
            maxWinningAmount += pei * value.singlePrice;
        }
        this.setState({maxWinningAmount: maxWinningAmount})

        this.allenCalculateScheduling(false);   //计算进来生成的期数 生成的注视 赢率
       
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
                        haderQishu: qishu,   // 当前期数
                        selseqishu:qishu,
                    });
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
                    haderQishu: qishu,   // 当前期数
                    selseqishu:qishu,
                   
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
            
        })
}



        openQiShu(){
            this.setState({
                isOpenQiShu:!this.state.isOpenQiShu,
            })
        }

        openArrWanFa(){

            this.setState({
                iswanfaArray:!this.state.iswanfaArray,
            }) 
        }
 

    render() {

        let qishu =  `${this.state.haderQishu}`;
        qishu = qishu.substr(qishu.length - 4, 4);
    
        return (
                    <View style={{flex: 1, backgroundColor: 'white',}}>  
                    <View style={SmartStlye.TimeStyle}>
                    <CusBaseText style={{color:'#707070'}}>第{qishu}期投注截止时间: </CusBaseText>  
                    <CusBaseText style={{color:'#e33939'}}>{(this.state.isFenPanTime < 0 && this.state.haderQishu > 0) ? '已封盘' : this._changeTime(this.state.isFenPanTime)}</CusBaseText>
                    </View>

                        <View style={{backgroundColor: '#f3f3f3',marginTop:5,height:height-40}}>
                               <View style={SmartStlye.linBox}>
                               <CusBaseText style={SmartStlye.leftTextStyle}> 起始期号: </CusBaseText>
                                <TouchableOpacity activeOpacity={1}
                                        style={SmartStlye.maxBorderStyle}
                                        onPress={() => {
                                           this.openQiShu()
                                         }}>
                                <View style={{width:186,  alignItems: 'center', justifyContent: 'center',}}>
                                 <CusBaseText style={SmartStlye.centerText}> {this.state.selseqishu} </CusBaseText> 
                                 </View>
                                <Image style={{width: 18, height: 18,marginTop:3}} source={require('../img/ic_buyLot_downRow.png')}></Image>    
                                </TouchableOpacity>
                                <CusBaseText style={SmartStlye.rightTextStyle}>期</CusBaseText>
                                </View>

                            <View style={SmartStlye.linBox}>
                                <CusBaseText style={SmartStlye.leftTextStyle}> 连续追号: </CusBaseText>
                                <View style={SmartStlye.maxBorderStyle}>
                                    <TouchableOpacity
                                        style={SmartStlye.btnStyle}
                                        onPress={() => { this._allBtnArray(1) }}>
                                            <CusBaseText style={SmartStlye.btnCenterText}>-</CusBaseText>

                                    </TouchableOpacity>

                                    <View style={{flex: 1}}>
                                        <TextInput allowFontScaling={false}
                                                   keyboardType={global.iOS ? 'number-pad' : 'numeric'}
                                                   onChangeText={(text) => {

                                                    //    if (text > this.state.maxQishu) {
                                                    //        text = this.state.maxQishu + '';
                                                    //    }

                                                    //    this.setState({slectMutipleQiShuNormal: text});

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
             
                                                        this.setState({});
                                                    }
             
                                                    this.allenCalculateScheduling(false);

                                                   }}
                                                //    value={this.state.slectMutipleQiShuNormal}
                                                   returnKeyType="done"
                                                   maxLength={5}
                                                   style={SmartStlye.inputStyle} 
                                                   underlineColorAndroid='transparent'

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
                                             </View>

                                    <TouchableOpacity
                                        style={SmartStlye.btnStyle}
                                        onPress={() => { this._allBtnArray(2) }}>
                                            <CusBaseText style={SmartStlye.btnCenterText}>+</CusBaseText>
                                    </TouchableOpacity>
                                </View>
                                <Text style={SmartStlye.rightTextStyle}>期</Text>
                            </View>

                            <View style={SmartStlye.linBox}>
                                <Text style={SmartStlye.leftTextStyle}> 起始倍数: </Text>
                                <View style={SmartStlye.maxBorderStyle}>
                                    <TouchableOpacity
                                        style={SmartStlye.btnStyle}
                                        onPress={() => { this._allBtnArray(3) }}>                                     
                                            <CusBaseText style={SmartStlye.btnCenterText}>-</CusBaseText>                                    
                                    </TouchableOpacity>
                                    <View style={{flex: 1}}>
                                        <TextInput allowFontScaling={false}
                                                   keyboardType={global.iOS ? 'number-pad' : 'numeric'}
                                                   onChangeText={(text) => {
                                                       this.setState({slectMutipleStartBeishuNormal: text});
                                                   }}
                                                   value={this.state.slectMutipleStartBeishuNormal}
                                                   returnKeyType="done"
                                                   maxLength={5}
                                                   style={SmartStlye.inputStyle} 
                                                   underlineColorAndroid='transparent'                                        
                                                   onFocus={() => {
                                                     
                                                   }}
                                                   onBlur={() => {
                                                       if (this.state.slectMutipleStartBeishuNormal == '') {
                                                           this.setState({slectMutipleStartBeishuNormal: '1'});
                                                       }  
                                                   } }/></View>
                                    <TouchableOpacity
                                        style={SmartStlye.btnStyle}
                                        onPress={() => { this._allBtnArray(4) }}>
                                            <CusBaseText style= {SmartStlye.btnCenterText}>+</CusBaseText>
                                     </TouchableOpacity>
                                </View>
                                <Text style={SmartStlye.rightTextStyle}>倍</Text>
                            </View>

                           <View style={SmartStlye.linBox}>
                               <CusBaseText style={SmartStlye.leftTextStyle}> 注单选择: </CusBaseText>
                                <TouchableOpacity activeOpacity={1} style={SmartStlye.maxBorderStyle} onPress={() => {  this.openArrWanFa() }}>
                                 <View style={SmartStlye.ZhuanXSStyle}>
                                 <CusBaseText numberOfLines={1} style={SmartStlye.centerText01}>
                             {`${this.state.wanfaZhudan}`}{this._xiangqingBallsTextView(this.state.heWanfa)}
                             </CusBaseText>

                                 </View>
                                <Image style={SmartStlye.ZhuanDImg} source={require('../img/ic_buyLot_downRow.png')}></Image>    
                                </TouchableOpacity>
                                </View>

                            <View style={{flexDirection: 'row'}}>
                            <View style={{marginLeft:20,marginTop:25}}>
                            <Text style={SmartStlye.YiLvTextStyle}> 预期盈利:   </Text></View>
                                <View style={{flex: 1,}}>
                                    <TouchableOpacity activeOpacity={1} style = {SmartStlye.YiLvBtn1View}
                                     onPress={() => 
                                     {this._yuQiYinglvResults(1) }} >

                                        <View style={[SmartStlye.YiLvBtn1,
                                        {borderColor: this.state.showBtn1 ? COLORS.appColor : '#9d9d9d',
                                        borderWidth: this.state.showBtn1 ? 5 : 0.7, }]}/>
                                        <Text style = {SmartStlye.YiLvTextStyle}>  全程最低盈利率 </Text>
                                        <TextInput allowFontScaling={false}
                                                   editable={this.state.showBtn1}
                                                   keyboardType = {global.iOS ? 'number-pad' : 'numeric'}
                                                   onChangeText = {(text) => {

                                                       if (text > this.state.maxProfitability)
                                                       {
                                                         text = this.state.maxProfitability + '';
                                                       } 
                                                                        //默认给的 最大利率的一半 30%
                                                       this.setState({minimumProfitabilityInTheWholeProcess: text});
                                                   }}

                                                   value = {this.state.minimumProfitabilityInTheWholeProcess}  //默认给的 最大利率的一半 30%
                                                   returnKeyType="done"
                                                   maxLength = {5}
                                                   style = {[SmartStlye.YiLvBt1Text,{backgroundColor: this.state.showBtn1 ? '#fff' : '#edeeef'}]} 
                                                   underlineColorAndroid='transparent'
                                                   onFocus = {() => { }}
                                                   onSubmitEditing = {() => {}
                                                }/>
                                        <Text style = {SmartStlye.YiLvBaiText}> %</Text>
                                    </TouchableOpacity>

                                    {/*追号方案二*/}
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => { this._yuQiYinglvResults(2)}}>
                                        {/*方案二第一行*/}
                                        <View style={SmartStlye.MinYiLvBtn3View}>
                                            <View style={[SmartStlye.MinYiLvBtn3,
                                               {borderWidth: this.state.showBtn2 ? 5 : 0.7,
                                                borderColor: this.state.showBtn2 ? Colors.appColor : '#9d9d9d',}]}/>
                                            <Text style={SmartStlye.YiLvTextStyle}>  前  </Text>
                                            <TextInput allowFontScaling={false}
                                                       editable={this.state.showBtn2}
                                                       keyboardType={global.iOS ? 'number-pad' : 'numeric'}
                                                       onChangeText={(text) => {

                                                           if (text > this.state.maxQishu) {
                                                               text = this.state.maxQishu + '';
                                                           }
                                                           this.setState({beforePeriod: text});
                                                       }}
                                                       value={this.state.beforePeriod}
                                                       returnKeyType="done"
                                                       maxLength={5}
                                                       style={[SmartStlye.MinYiLvBtn22Text,
                                                        { backgroundColor: this.state.showBtn2 ? '#fff' : '#edeeef',}]}
                                                        underlineColorAndroid='transparent'
                                                        onFocus={() => {}}/>

                                              <Text style={SmartStlye.YiLvTextStyle}>   期 </Text>
                                               <TextInput allowFontScaling={false}
                                                       editable={this.state.showBtn2}
                                                       keyboardType={global.iOS ? 'number-pad' : 'numeric'}
                                                       onChangeText={(text) => {

                                                           if (text > this.state.maxProfitability) {
                                                               text = this.state.maxProfitability + '';
                                                           }

                                                           //判断是否大于后期盈利
                                                           if (text < parseInt(this.state.afterPeriodProfitability) && text !== '') {
                                                               let before = parseInt(text);
                                                               before -= 1;
                                                               before > 0 ? before = 1 : before;
                                                               var after = `${before}` + '';
                                                               this.setState({afterPeriodProfitability: after});
                                                           }
                                                          
                                                           this.setState({beforePeriodProfitability: text});

                                                       }}
                                                       value={this.state.beforePeriodProfitability}
                                                       returnKeyType="done"
                                                       maxLength={5}
                                                       style={[SmartStlye.MinYiLvBtn22Text,{ backgroundColor: this.state.showBtn2 ? '#fff' : '#edeeef',}]}
                                                       underlineColorAndroid='transparent'
                                                       onFocus={() => { }}
                                                       onSubmitEditing={() => {

                                                           if (this.state.maxProfitability < 0) {
                                                               if (this.state.beforePeriodProfitability > this.state.maxProfitability) {
                                                                   this.setState({beforePeriodProfitability: (this.state.maxProfitability + '')});
                                                               }
                                                           }
                                                       } }/>

                                            <Text style={SmartStlye.YiLvBaiText}> %</Text>
                                        </View>

                                        {/*第二行*/}
                                        <View style={SmartStlye.MinYiLvBtn3View}>
                                            <Text style={SmartStlye.YiLvBtn2View}>之后盈利率  </Text>
                                            <TextInput allowFontScaling={false}
                                                       editable={this.state.showBtn2}
                                                       keyboardType={global.iOS ? 'number-pad' : 'numeric'}
                                                       onSubmitEditing={() => {

                                                           if (this.state.maxProfitability < 0) {
                                                               if (this.state.afterPeriodProfitability > parseFloat(this.state.beforePeriodProfitability, 10)) {
                                                                   
                                                                let befor = parseFloat(this.state.beforePeriodProfitability, 10) - 1;
                                                                   this.setState({afterPeriodProfitability: `${befor}`});
                                                               }
                                                           }  } }

                                                       onChangeText={(text) => {
                                                           if (this.state.maxProfitability > 0) {
                                                               if (text > parseInt(this.state.beforePeriodProfitability && text !== '')) {

                                                                   let before = parseInt(this.state.beforePeriodProfitability);
                                                                   before -= 1;
                                                                   text = `${before}` + '';
                                                               }
                                                           }

                                                           this.setState({afterPeriodProfitability: text});
                                                       }}

                                                       value={this.state.afterPeriodProfitability}
                                                       returnKeyType="done"
                                                       maxLength={5}
                                                       style={[SmartStlye.YiLvBtn2Text,{backgroundColor: this.state.showBtn2 ? '#fff' : '#edeeef',}]} 
                                                       underlineColorAndroid='transparent'
                                                       onFocus={() => { }} /> 

                                            <Text style={SmartStlye.YiLvBaiText}> %</Text>
                                        </View>
                                    </TouchableOpacity>

                                    {/*追号方案三*/}
                                    <TouchableOpacity style={SmartStlye.MinYiLvBtn3View}
                                        activeOpacity={1}
                                        onPress={() => { 
                                            this._yuQiYinglvResults(3)
                                        }}>

                                        <View style={[SmartStlye.MinYiLvBtn3,{borderWidth: this.state.showBtn3 ? 5 : 0.7, borderColor: this.state.showBtn3 ? Colors.appColor : '#9d9d9d',}]}/>
                                        <Text style={SmartStlye.YiLvTextStyle}>  全程最低盈利  </Text>
                                        <TextInput allowFontScaling={false}
                                                   editable={this.state.showBtn3}
                                                   keyboardType={global.iOS ? 'number-pad' : 'numeric'}
                                                   onChangeText={(text) => {
                                                       this.setState({totalProfitability: text});
                                                   }}
                                                   value={this.state.totalProfitability}
                                                   returnKeyType="done"
                                                   maxLength={5}
                                                   style={[SmartStlye.MinYiLvBtn2Text,{backgroundColor: this.state.showBtn3 ? '#fff' : '#edeeef',}]} 
                                                   underlineColorAndroid='transparent'
                                                   onFocus={() => {}}
                                                   onBlur={() => { }}  />

                                        <Text style={SmartStlye.YiLvTextStyle}> 元</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        <View style={SmartStlye.ChangViewStyle}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => { this._allBtnArray(5)}}
                                style={SmartStlye.ChangBtn1Stley}>
                                <CusBaseText
                                    style={SmartStlye.ChanBtn1TextStyle}>生成追号</CusBaseText>
                            </TouchableOpacity>
                        </View>
                    </View>
       <SmartBtn
            gameList={this.state.selseArray}
            selectedGameID={this.state.selectIdx}
            isClose={this.state.isOpenQiShu}
            close={() => {
              this.setState({
                isOpenQiShu: false,})
              }}

            caiZhongClick={(gameData, index) => {
           
              setTimeout(() => {
                 this.setState({
                     isOpenQiShu: false,
                     selectIdx: index,
                     selseqishu: gameData.qiShu,
                  }); 
                  this.diyiArrayJieQu(index)   
                               
              }, 100);
          } }
          /> 
            
         <ArrNameBtn
            gameList={this.state.datas}
            selectedGameID={this.state.selsectNameIdx}
            isClose={this.state.iswanfaArray}
            close={() => {
              this.setState({
                iswanfaArray: false,})
              }}
            caiZhongClick={(gameData, index) => {
            
              setTimeout(() => {
                 this.setState({
                    iswanfaArray: false,
                    selsectNameIdx: index,
                    wanfaZhudan: `${gameData.value.wanfa}/`,
                    heWanfa:gameData.value.xiangqing,
                  }); 
                  this.diyiArrayJieQu02(index)              
              }, 100);
            }
          } />
           <Toast ref="Toast" position='center'/>
         </View>
        )
    }



    _allBtnArray(indexId){

        if (indexId == 1) { // 追期的按钮 —— 减号
            
            let arraylength = this.state.slectMutipleQiShuNormal == '' ? '' : String(parseInt(this.state.slectMutipleQiShuNormal) - 1) <= 0  ? '1' : String(parseInt(this.state.slectMutipleQiShuNormal) - 1);
            this.state.slectMutipleQiShuNormal = arraylength; 
            this.allenCalculateScheduling(false);


        } else if ( indexId == 2){  // 追期的按钮 ++ 加号

            if (parseInt(this.state.slectMutipleQiShuNormal) < parseInt(this.state.maxQishu)) {

                let arraylength =  this.state.slectMutipleQiShuNormal == '' ? '' : String(parseInt(this.state.slectMutipleQiShuNormal) + 1);
                this.state.slectMutipleQiShuNormal = arraylength; 
                this.allenCalculateScheduling(false);

            }else{

                Alert.alert(`最大不能超过${this.state.maxQishu}期`); 
              
            }
           
            }else if ( indexId == 3){  //起始倍数的  —— 减号

            let selectBeishu = this.state.slectMutipleStartBeishuNormal == '' ? '' : String(parseInt(this.state.slectMutipleStartBeishuNormal) - 1) <= 0 ? '1' : String(parseInt(this.state.slectMutipleStartBeishuNormal) - 1);
            this.state.slectMutipleStartBeishuNormal = selectBeishu;
            this.allenCalculateScheduling(false);

        } else if ( indexId == 4){  // 起始倍数的 ++ 加号
        
        let selectBeishu =  this.state.slectMutipleStartBeishuNormal == '' ? '' : String(parseInt(this.state.slectMutipleStartBeishuNormal) + 1);
        this.state.slectMutipleStartBeishuNormal = selectBeishu;

        this.allenCalculateScheduling(false);

        }else if ( indexId == 5){

                //过滤错的
                if (this.state.minimumProfitabilityInTheWholeProcess === '') {

                    this.state.minimumProfitabilityInTheWholeProcess =' 1';
                }   //默认给的 最大利率的一半 30%

                if (this.state.beforePeriod === '') {

                    this.state.beforePeriod = '1'
                }

                if (this.state.beforePeriodProfitability === '') {

                    this.state.beforePeriodProfitability = '1';
                }

                if (this.state.afterPeriodProfitability === '') {

                    this.state.afterPeriodProfitability = '1';

                }

                if (this.state.totalProfitability === '') {

                     this.state.totalProfitability = '1';

                }
                
                let chasePlanStr = '';
                let planType = 0;

                if (this.state.showBtn1) {

                    if (this.state.maxProfitability < 0) {
                                       //默认给的 最大利率的一半 30%   minimumProfitabilityInTheWholeProcess
                        if (this.state.minimumProfitabilityInTheWholeProcess > this.state.maxProfitability) {

                            this.state.minimumProfitabilityInTheWholeProcess = this.state.maxProfitability - 1 + '';
                        }
                    }

                    chasePlanStr = `全程最低盈利率${this.state.minimumProfitabilityInTheWholeProcess}%`;

                    this.allenCalculateScheduling(false);

                }else if (this.state.showBtn2) {

                    if (this.state.maxProfitability < 0) {
                        //前面
                        if (this.state.beforePeriodProfitability > this.state.maxProfitability) {

                            this.state.beforePeriodProfitability = this.state.maxProfitability - 1 + '';
                        }
                        //    后面
                        if (this.state.afterPeriodProfitability > this.state.beforePeriodProfitability) {
                            this.state.afterPeriodProfitability = this.state.beforePeriodProfitability - 1 + '';
                        }
                    }

                    chasePlanStr = `前${this.state.beforePeriod}期${this.state.beforePeriodProfitability}%之后盈利率${this.state.afterPeriodProfitability}%`;
                    this.CalculationPlanTwo(false);
                } else {

                    chasePlanStr = `全程最低盈利${this.state.totalProfitability}元`;
                    this.CalculationPlanThere(false);
                }

        //KnowChanPlan2    AllenSmartChaseNumberVersion2
             this.props.navigation.navigate('HighEnergy', {
                title: '方案设置',
                currentTime: this.state.currentTime,
                isFenPanTime:this.state.isFenPanTime,
                tag: this.state.tag,
                qiShu: this.state.selseqishu,
                datas: this.state.nexWanFa.length > 0 ? this.state.nexWanFa : this.state.datas,
                dataSourceNormal:this.state.backArray.length > 0 ? this.state.backArray : this.state.selseArray,
                js_tag: this.state.js_tag,
                backKey: this.state.backKey,
                maxWinningAmount:this.state.maxWinningAmount,  
                totalMoneyNormal:this.state.totalMoneyNormal.money, 
            });

        }else{

        }
    }


    _yuQiYinglvResults(isSelectNoml){

             if (isSelectNoml == 1){
                   this.setState({
                          showBtn1: true,
                          showBtn2: false,
                          showBtn3: false
                      });

             }else if (isSelectNoml == 2){

                this.setState({
                    showBtn1: false,
                    showBtn2: true,
                    showBtn3: false
                });

             }else if (isSelectNoml == 3){

                this.setState({
                    showBtn1: false,
                    showBtn2: false,
                    showBtn3: true
                });
            }
        }

 //计算追号方案一
 allenCalculateScheduling(fasle) {

    if (this.startQishuInfo.length <= 0) return;
    let qishuPlans = [];
    let qishuNumer = this.state.haderQishu;
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
                                                                             //默认给的 最大利率的一半 30%
        if (((this.state.maxWinningAmount * num - money) * 100 / money) < parseInt(this.state.minimumProfitabilityInTheWholeProcess)) {
            dadao = false;
            while (true) {
                num++;
                moneyZ += this.state.baseMoney;
                money = (moneyZ).toFixed(2);

                let sex = ((this.state.maxWinningAmount * num - money) * 100 / money).toFixed(2);

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
                qiShu: qishu,
                num: num,
                money: money,
                openTime:'',
                key: i,
               
            });
        } else {
            break;
        }
        count++;
        zhushu = this.state.baseZhuShu;
    }

   this.state.selseArray =qishuPlans;

    console.log('生成的数组000000',qishuPlans);

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
                slectMutipleQiShuNormal:`${qishuPlans.length}`,
            });

       
            {
                this.refs.Toast && this.refs.Toast.show(`期数发生变化，方案智能生成${qishuPlans.length}期`, 2000);
            }
        }
        else
        {
            this.refs.Toast && this.refs.Toast.show('期数发生变化，成功生成追号方案', 2000);
        }

    }
    else
    {

        DeviceEventEmitter.emit('changeQiShu', {textN:`${qishuPlans.length}` });

        //弹框提示
        if(qishuPlans.length < slectMutipleQiShu)
        {
            this.setState({

                slectMutipleQiShuNormal:`${qishuPlans.length}`,
            });

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
            if (qishuPlans.length === 0){
               return;
            }else{
                this.refs.Toast && this.refs.Toast.show(`追号生成，方案智能生成${qishuPlans.length}期`, 2000);
            }
            
        }
    }

    return qishuPlans;
    
}


   //追号方案二
   CalculationPlanTwo(fasle){

    if (this.startQishuInfo.length <= 0) return;
    let qishuPlans = [];
    let qishuNumer = this.state.haderQishu;
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
    let twoQishi = this.ForCalculation(FristQiShi.length,slectMutipleStartBeishu,lastObject.qiShu + 1,this.state.slectMutipleQiShuNormal,slectafterPeriodProfitability,mony,num);

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

    this.state.selseArray =qishuPlans;

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

            if(fasle)
            {
                this.refs.Toast && this.refs.Toast.show(`期数发生变化，方案智能生成${qishuPlans.length}期`, 1000);
            }
            else
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

            if(fasle)
            {
                this.refs.Toast && this.refs.Toast.show(`期数发生变化，方案智能生成${qishuPlans.length}期`, 1000);
            }
            else
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
                qiShu: qishu,  //当前期数
                num: num ,  //当前倍数
                money: money,  //当前总金额
                openTime:'',
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

    let qishuPlans = [];
    let qishuNumer = this.state.haderQishu;
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

  
        if (((this.state.maxWinningAmount * num - money) ) < parseInt(this.state.totalProfitability)) {
            dadao = false;
            while (true) {
                num++;
                moneyZ += this.state.baseMoney;
                money = (moneyZ).toFixed(2);

                if ((((this.state.maxWinningAmount * num - money)) >= parseInt(this.state.totalProfitability)) || num >= 10000)
                {
                    if ((((this.state.maxWinningAmount * num - money) ) >= parseInt(this.state.totalProfitability))) {
                        dadao = true;
                    }
                    break;
                }
            }
        }

        if (dadao) {
            qishuPlans.push({
                qiShu: qishu,
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

    this.state.selseArray =qishuPlans;

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

            
            {
                this.refs.Toast && this.refs.Toast.show(`期数发生变化，方案智能生成${qishuPlans.length}期`, 1000);
            }
            
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




    diyiArrayJieQu(index){

        if (this.state.selseArray.length < 0) {
            return;
        }
    
        let array = this.state.selseArray;
    
        var newArray = [];
        if (index == 0){
            newArray = array;
        } else{
            
            var arr = array;
            var newArr = []  // 为了使用数组的push方法，一定要定义数据类型为数组
            for (var x = 0; x < arr.length; x++){
                newArr.push(arr[x])  // 用循环逐个把值保存在新数组内
            }
             // 删除原数组的一个值
              newArray  =  newArr.splice(index)  //选择从那个数组开始到那个数组结束
              this.setState({});
          }
          
              console.log('要传的数组',newArray);
                this.setState({
                     backArray:newArray, 
                });
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
            <CusBaseText  key={a} style={{color: a % 2 == 0 ? '#676767' : '#e33939'}}>
                {string}
            </CusBaseText>
        );
    }
    return textViews;
   }

}

