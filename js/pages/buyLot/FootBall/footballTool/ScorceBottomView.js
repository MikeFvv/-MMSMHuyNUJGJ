/**
 * Created by Ward on 2018/04/07.
 */

import React, { Component } from 'react'
import {
    View,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Image,
    Alert,
} from 'react-native'

var currentPeilv = 0; //当前的全局赔率
var lastParams = null; //投注最后拼接的模型

export default class ScorceBottomView extends Component {

    constructor(props) {
        super(props);

        this.state = ({
            isAccpectGoodPeilv:true,  //是否自动接受最佳赔率　
            pickDataDict:props.normalPickDataDict ? props.normalPickDataDict : null, //非综合过关选择号码的数据
            zongHeDataDict:props.zongHePickDataDict ? props.zongHePickDataDict : null, //综合过关选择号码的数据
            singlePrice:'0',  //单注价格，默认为最小下注金额
            willWinMoney:'0',  //预计能赢的钱
            minTake:0, //下注金额下限
            maxTake:0, //下注金额上限
            gameTypeIndex:1, //切换玩法时需要重置单价为min_take
            tabIndex:0, //切换Tab玩法时也需要重置
            sport_Id:props.sportID ? props.sportID : 2001,  //体彩的Id
        });

        this.isJustEnterIng = true;//是否刚刚进入体彩页面
    }

    //接受将要改变的属性
    componentWillReceiveProps(nextProps) {

       if (nextProps.normalPickDataDict){
           this.state.pickDataDict = nextProps.normalPickDataDict;
           //this._freshPeilv();
       }
       else {
           this.state.pickDataDict = null;
       }

       if (nextProps.zongHePickDataDict){
           this.state.zongHeDataDict = nextProps.zongHePickDataDict;
       }
       else {
           this.state.zongHeDataDict = null;
       }

       if (nextProps.currentTabIndex != this.state.tabIndex){
           this.isJustEnterIng = true; //重新赋值
           this.state.tabIndex = nextProps.currentTabIndex;
       }

    }

    //刷新当前选择的号码所属赛事的赔率
    _freshPeilv(){

        if (Object.values(this.state.pickDataDict).length != 0) {

            let sportModel = Object.values(this.state.pickDataDict)[0];
            let sportKey = Object.keys(this.state.pickDataDict)[0];

            let params = new FormData();

            params.append('ac', 'getSportGameData');
            params.append('game_type', this.state.gameTypeIndex);
            params.append('play_group', this.state.tabIndex);
            params.append('schedule_id', sportModel.data.schedule_id);

            var promise = GlobalBaseNetwork.sendNetworkRequest(params);
            promise
                .then((responseData) => {

                   if (Object.keys(this.state.pickDataDict).length == 0){ //用户可能选择后取消。数据请求延迟导致界面显示错误。还能投注

                       return;
                   }

                  if (responseData.msg == 0 && responseData.data){

                    let newPeilvArr = [];   //新的赔率数组
                    let isNeedRender = false; //是否需要刷新render

                    if (sportModel.playMethod == 'HC'){
                        //让球会出现多个

                        newPeilvArr  = responseData.data[0].bet_data[sportModel.playMethod][sportModel.isHVXO.toUpperCase()];

                        for (let i = 0; i < newPeilvArr.length; i++){

                            if (sportModel.k == newPeilvArr[i].k){
                                if (sportModel.p != newPeilvArr[i].p){
                                    sportModel.p = newPeilvArr[i].p;
                                    isNeedRender = true;
                                }
                            }
                        }
                    }
                    else if (sportModel.playMethod == 'GL'){
                        //大小也会出现多个
                        let isHost = sportModel.isHVXO == 'h' ? true : false;
                        let keyStr = isHost ? 'OV' : 'UN';
                        newPeilvArr = responseData.data[0].bet_data[sportModel.playMethod][keyStr];

                        for (let i = 0; i < newPeilvArr.length; i++){

                            if (sportModel.k == newPeilvArr[i].k){
                                if (sportModel.p != newPeilvArr[i].p){
                                    sportModel.p = newPeilvArr[i].p;
                                    isNeedRender = true;
                                }
                            }
                        }
                    }
                    else {

                        //如果请求的bet_data 存在
                        if (responseData.data[0].bet_data) {

                            let peilvArr = [];  //拿到最新的赔率数组

                            if (sportModel.playMethod == 'TCS' || sportModel.playMethod == 'HTCS'){
                                peilvArr  = responseData.data[0].bet_data[sportModel.playMethod][sportModel.isHVXO.toUpperCase()];
                            }
                            else if (sportModel.playMethod == 'HFT' || sportModel.playMethod == 'TG'){
                                peilvArr  = responseData.data[0].bet_data[sportModel.playMethod];
                            }

                            let isNeedRender = false;

                            if (peilvArr.length != 0){

                                for (model of peilvArr){

                                    if (model.k == sportModel.k){

                                        if (sportModel.p != model.p){
                                            sportModel.p = model.p;
                                            isNeedRender = true;
                                        }
                                        break;
                                    }
                                }
                            }
                         }
                      }

                      //是否需要刷新render
                      if (isNeedRender == true){
                          this.setState({pickDataDict:{[sportKey]:sportModel}});
                      }
                    }
                })
                .catch((err) => {

                })
        }

    }

    componentDidMount() {

        //下注成功或者清空号码时收到的通知清空选号界面
        this.subscription1 = PushNotification.addListener('ClearFootBallGameViewBallNotification', () => {

            this.setState({pickDataDict:null, zongHeDataDict:null})

        });
    }

    //移除组件
    componentWillUnmount() {

        if (typeof(this.subscription1) == 'object'){
            this.subscription1 && this.subscription1.remove();
        }
    }

    //拼接投注的参数返回上一个界面
    _verbFBTouZhuParams(){

        let betDataArr = []; //拼接的数组
        lastParams = new FormData();

        if (this.state.pickDataDict){

            for (let i = 0; i < Object.values(this.state.pickDataDict).length; i ++) {

                let model = Object.values(this.state.pickDataDict)[i];
                if (model) {

                    lastParams.append('is_better', this.state.isAccpectGoodPeilv ? 1 : 0);

                    let teamData = ''; //大小，让分，波胆拼接三层时用到的参数.

                    if (model.playMethod.includes('GL')) { // 大小
                        teamData = model.isHVXO == 'h' ? 'OV' : 'UN';

                    } else if (model.playMethod.includes('HC') || model.playMethod.includes('TCS')) { // 让分 // 波胆
                        teamData = `${model.isHVXO.toUpperCase()}`;
                    }

                    let betModel = {
                        'history_id': model.data.history_id,
                        'price': this.state.singlePrice,
                        'schedule_id': model.data.schedule_id,
                        'sport_id': this.state.sport_Id,
                        'team_score':model.data.team_score,
                        'play_method':model.playMethod,
                        'k':model.k,
                        'p':model.p,
                        'team':teamData,
                    };
                    betDataArr.push(betModel);
                    lastParams.append('data', JSON.stringify(betDataArr));

                    return lastParams;

                }
                else {
                    return null;
                }
            }

        }
        else if (this.state.zongHeDataDict){

            //非综合过关的下注拼接
            let playMehtodStr = ''; //多个玩法的拼接

            for (let i = 0; i < Object.values(this.state.zongHeDataDict.dataArr).length; i ++) {

                let zongHeModel =  Object.values(this.state.zongHeDataDict.dataArr)[i];

                if (zongHeModel){

                    if (i == 0){
                        playMehtodStr = zongHeModel.value.playMethod;
                    }
                    else {
                        playMehtodStr = playMehtodStr + ',' + zongHeModel.value.playMethod;
                    }

                    let teamData = ''; //大小，让分，波胆拼接三层时用到的参数.

                    if (zongHeModel.value.playMethod.includes('GL')) { // 大小
                        teamData = zongHeModel.value.isHVXO == 'h' ? 'OV' : 'UN';

                    } else if (zongHeModel.value.playMethod.includes('HC') || zongHeModel.value.playMethod.includes('TCS')) { // 让分 // 波胆
                        teamData = `${zongHeModel.value.isHVXO.toUpperCase()}`;

                    }

                    let betModel = {
                        'history_id': zongHeModel.value.data.history_id,
                        'price': this.state.singlePrice,
                        'schedule_id': zongHeModel.value.data.schedule_id,
                        'sport_id': this.state.sport_Id,
                        'team_score':zongHeModel.value.data.team_score,
                        'play_method':zongHeModel.value.playMethod,
                        'k':zongHeModel.value.k,
                        'p':zongHeModel.value.p,
                        'team':teamData,
                    };
                    if (zongHeModel.value.is_all_method) {
                        betModel['is_all_method'] = zongHeModel.value.is_all_method;
                    }

                    betDataArr.push(betModel);
                }
            }

            lastParams.append('is_better', this.state.isAccpectGoodPeilv ? 1 : 0);
            lastParams.append('data', JSON.stringify(betDataArr));
            return lastParams;
        }
        else {
            return null;
        }
    }

    render() {

        let miaosuStr = ''; //选择号码详情
        let peilvStr = ''; //赔率详情

        if (this.state.pickDataDict){

            //非综合过关的底部选择
            let model = Object.values(this.state.pickDataDict)[0];   //选择号码数据模型
            if (model) {
                //选择的号码不为空

                let isHost = model.isHVXO == 'h' ? true : false;

                if (model.playMethod.includes('HC')) { //让球显示主客队拼上赔率描述
                    miaosuStr = isHost ? `${model.data.h}${model.k}` : `${model.data.v}${model.k}`;
                
                } else if (model.playMethod.includes('1X2')) { //独赢直接显示主客队拼上赔率
                    miaosuStr = model.isHVXO == 'h' ? model.data.h : model.isHVXO == 'v' ? model.data.v : '和局';
                
                } else if (model.playMethod.includes('GL')) { //大小
                    miaosuStr = model.isHVXO == 'h' ? `大${model.k}` : `小${model.k}`;

                } else if (model.playMethod.includes('TGOE')) { // 单双
                    miaosuStr = model.k == 'Odd' ? `单` : `双`;

                } else if (model.isHVXO == 'o') { // 波胆的 其他
                    miaosuStr = '其他';

                } else if (model.playMethod == 'HFT') { // 半场/全场
                    let k = model.k;
                    k = k.replace(/H/g, '主');
                    k = k.replace(/V/g, '客');
                    k = k.replace(/X/g, '和');
                    miaosuStr = k;
                    
                } else { // 直接拼接描述和赔率
                    miaosuStr = model.k;
                }

                //如果是让分或者大小盈利不减去本金
                if (model.playMethod == 'HC' || model.playMethod == 'GL' || model.playMethod == 'HHC' || model.playMethod == 'HGL') {

                    switch (this.props.currentPanKou){
                        case '香港盘':
                            currentPeilv = parseFloat(model.HK, 10);  //香港盘盈利等于赔率 X 本金
                            peilvStr = `@${model.HK}`;
                            break;
                        case '马来盘':
                            currentPeilv = 1.00;  //马来盘盈利等于本金
                            peilvStr = `@${model.MY}`;
                            break;
                        case '印尼盘':
                            currentPeilv = 1.00;   //印尼盘盈利等于本金
                            peilvStr = `@${model.IND}`;
                            break;
                        case '欧洲盘':
                            currentPeilv = parseFloat(model.DEC, 10) - 1;  //欧洲盘盈利等于赔率 - 1
                            peilvStr = `@${model.DEC}`;
                    }
                }
                else {
                    //其他的都会减去本金
                    currentPeilv = parseFloat(model.p, 10) - 1;
                    peilvStr = `@${model.p}`;
                }

                this.state.minTake = 2;
                this.state.maxTake = parseInt(model.data.max_stake, 10);

                //刚进来体彩界面赋值单价给最小金额
                if (this.isJustEnterIng == true){
                    this.isJustEnterIng = false;
                    this.state.singlePrice = `${this.state.minTake}`;
                }

                this.state.willWinMoney = this.state.singlePrice == 0 ? '0.00' : (currentPeilv * parseInt(this.state.singlePrice, 10)).toFixed(2);//首次选择直接计算结果，防止数据没刷新
            }
            else {
                //选择的号码为空时
                this.state.willWinMoney = '0.00';
                this.state.minTake = 0;
                this.state.maxTake = 0;
            }
        }
        else if (this.state.zongHeDataDict){
            //综合过关的底部

            miaosuStr = this.state.zongHeDataDict.desc;
            peilvStr = this.state.zongHeDataDict.peilv == 0 ? '' : `@${this.state.zongHeDataDict.peilv}`;

            //如果综合过关的数据为空时，则全部改为0
            if (this.state.zongHeDataDict.dataArr.length != 0){

                this.state.minTake = 2;
                this.state.maxTake = parseInt(this.state.zongHeDataDict.dataArr[0].value.data.max_stake, 10);

                //刚进来体彩界面赋值单价给最小金额
                if (this.isJustEnterIng == true){
                    this.isJustEnterIng = false;
                    this.state.singlePrice = `${this.state.minTake}`;
                }

                this.state.willWinMoney = this.state.singlePrice == 0 ? '0.00' : ((parseFloat(this.state.zongHeDataDict.peilv, 10) - 1) * parseInt(this.state.singlePrice, 10)).toFixed(2);//首次选择直接计算结果，防止数据没刷新
            }
            else {
                this.state.minTake = 0;
                this.state.maxTake = 0;
                this.state.willWinMoney = '0.00';
            }
        }
        else {
            //下注成功时清空底部的金额
            this.state.minTake = 0;
            this.state.maxTake = 0;
            this.state.willWinMoney = '0.00';
        }

        return (<View style = {this.props.style}>
            <View style = {{height:40, backgroundColor:'#eaeaea', flexDirection:'row', alignItems:'center'}}>
               <View style = {{flex:0.55}}>
                   <CusBaseText style = {{marginLeft:10, fontSize:Adaption.Font(16,13), color:'#313131'}}>
                       {miaosuStr} <CusBaseText style = {{fontSize:Adaption.Font(15,12), color:'#e33933'}}>
                       {peilvStr}
                   </CusBaseText>
                   </CusBaseText>
               </View>
                <View style = {{flex:0.45}}>
                    {this.state.isAccpectGoodPeilv ?  <TouchableOpacity activeOpacity = {0.7} style = {{flexDirection:'row', alignItems:'center'}} onPress = { () => {this.setState({isAccpectGoodPeilv:false})}}>
                        <ImageBackground style = {{width:15, height:15}} source = {require('../img/ic_NormalBox.png')}>
                            <Image style = {{width:15, height:15}} source = {require('../img/ic_TickOff.png')}/>
                        </ImageBackground>
                        <CusBaseText style = {{color:'black', fontSize:Adaption.Font(18,15)}}>
                            自动接受最佳赔率
                        </CusBaseText>
                    </TouchableOpacity> : <TouchableOpacity activeOpacity = {0.7} style = {{flexDirection:'row', alignItems:'center'}} onPress = { () => {this.setState({isAccpectGoodPeilv:true})}}>
                        <ImageBackground style = {{width:15, height:15}} source = {require('../img/ic_NormalBox.png')}>
                        </ImageBackground>
                        <CusBaseText style = {{color:'black', fontSize:Adaption.Font(18,15)}}>
                            自动接受最佳赔率
                        </CusBaseText>
                    </TouchableOpacity>}
                </View>
            </View>
            <View style = {{height:50, backgroundColor:'#434343', flexDirection:'row', alignItems:'center'}}>
                <View style = {{flex:0.78, flexDirection:'row', alignItems:'center'}}>
                    <TextInput
                        style = {{marginLeft:10, backgroundColor:'#fff', borderRadius:5, width:84, height:32, color:'#e33933', textAlign:'center', fontSize:Adaption.Font(17,14)}}
                        defaultValue = {this.state.singlePrice}
                        returnKeyType="done"
                        keyboardType={'number-pad'}
                        maxLength={7}
                        onChangeText={(text) => {

                            this.setState({singlePrice:text});
                        }}
                        onFocus={() => {
                            this.setState({singlePrice:''});
                        }}
                    />
                    <CusBaseText style = {{marginLeft:10, fontSize:Adaption.Font(18,15), color:'#fff'}}>
                        元, 可赢<CusBaseText style = {{fontSize:Adaption.Font(18,15), color:'#e33933'}}>
                        {this.state.willWinMoney}
                    </CusBaseText>元
                    </CusBaseText>
                </View>
                <View style = {{flex:0.22}}>
                    <TouchableOpacity
                        activeOpacity = {0.7}
                        style = {{height:50, backgroundColor:'#e33933', justifyContent:'center', alignItems:'center'}}
                        onPress = { () => {

                            if (this.state.minTake != 0 && this.state.maxTake != 0){
                                //选择了号码，正常的下注逻辑判断

                                if (parseInt(this.state.singlePrice) < 1){
                                    Alert.alert('温馨提示',  `最低下注金额为1元`, [{text:'确定', onPress: () => {}}])

                                }
                                else if (parseInt(this.state.singlePrice) > this.state.maxTake){
                                    Alert.alert('温馨提示',  `最高下注金额为${this.state.maxTake}元`, [{text:'确定', onPress: () => {}}])

                                }
                                else {

                                    let newData = this._verbFBTouZhuParams();
                                    this.props.XiaZhuOnPress ? this.props.XiaZhuOnPress(newData) : null;
                                }
                            }
                            else {
                                //如果没选择号码，点击下注直接返回null
                                this.props.XiaZhuOnPress ? this.props.XiaZhuOnPress(null) : null;
                            }
                        }}>
                        <CusBaseText style = {{color:'white', fontSize:Adaption.Font(18,15)}}>
                            下 注
                        </CusBaseText>
                    </TouchableOpacity>
                </View>
            </View>
        </View>);
    }
}
