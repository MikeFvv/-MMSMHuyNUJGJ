/**
 Author Ward
 Created by on 2018-08-14
 pk10牛牛游戏开奖信息视图
 **/

import React, { Component } from 'react';

import {
    View,
    Image,
    FlatList,
    TouchableOpacity,
    LayoutAnimation,
    StyleSheet,
    AppState,
} from 'react-native';

const wenZiColor = '#535353';  //字体颜色

var CustomLayoutAnimation = {
    duration: 500,
    create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
    },
    update: {
        type: LayoutAnimation.Types.easeInEaseOut,
    },
};

export default class Pk10NiuNiuOpenInfoView extends Component{

    constructor(props) {
        super(props);

        this.state = ({
            countDownText: 0,//倒计时
            paiming: '',
            isShowRowList:false,
            openBallsList:[],  //历史开奖数组
            countDownList:[], //本地倒计时数组
            prevQiShu:0, //上期开奖期数
            nextQiShu:0,  //当前投注期数
            openBallsArr:[], //当前开奖号码数组
            tag:props.tag,  //tag值
        })

        this.timer = null;
        this.clickOpenListWating = false; //防止快速点击开奖按钮
        this.currentCountDownIndex = 0;  //当前本地倒计时数组的下标
        this.isFreshOpenReward = false; //是否开奖
        this.isOpenReward = false; //是否算出开奖结果
        this.finishTime = 0;//请求回来的时间
        this.isActiveFromBack = false;  //是否从后台重新进来激活
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.finishTime && this.finishTime == 0){
            this.finishTime = nextProps.finishTime;
        }

        if (nextProps.openList && nextProps.openList.length != 0 && this.state.openBallsList.length <= 0) {

            let ballsArr = nextProps.openList[0].value.balls.split('+');

            this.setState({
                openBallsList: nextProps.openList,
                prevQiShu: nextProps.openList[0].value.qishu,
                openBallsArr:ballsArr,
            });
        }

        if (nextProps.nextCountDownList && nextProps.nextCountDownList.length != 0 && this.state.countDownList.length <= 0) {

            let nextQi = nextProps.nextCountDownList[this.currentCountDownIndex].qishu;
            let nextTime = nextProps.nextCountDownList[0].opentime - (nextProps.nextCountDownList[0].server_time - this.finishTime) - Math.round(new Date() / 1000);

            this.setState({
                countDownList: nextProps.nextCountDownList,
                nextQiShu: nextQi,
                countDownText: nextTime,
            });
        }

        //如果期数相差等于2期,说明后台返回的开奖结果有问题。需要本地处理
        if (this.state.nextQiShu - this.state.prevQiShu == 2){
            this.setState({
                prevQiShu:this.state.prevQiShu + 1,
                openBallsArr:[],
            })
        }
    }

    componentDidMount() {

        this._setTimeInval();

        this.subscription1 = PushNotification.addListener('RacingCarRankNotification', (rankStr)=> {
            this.setState({paiming:rankStr});
        })

        AppState.addEventListener('change', (appState)=> {

            //活跃状态重新刷数据
            if (appState == 'active'){
                this.isActiveFromBack = true;
                this._fetchCountDownData(this.state.tag);
            }
        });


    }

    _setTimeInval() {


        if (this.timer) {
            return;
        }

        this.timer = setInterval(() => {

            if (this.state.countDownText == 0 && this.state.nextQiShu != 0 && this.state.prevQiShu != 0) {

                this.currentCountDownIndex += 1;

                if (this.currentCountDownIndex < this.state.countDownList.length) {

                    let nextQi = this.state.countDownList[this.currentCountDownIndex].qishu;
                    this.state.prevQiShu = this.state.nextQiShu;  //如果到下一期。则赋值给上一期数
                    this.state.nextQiShu = nextQi;
                    this.state.openBallsArr = [];  //赋空
                    global.CurrentQiShu = nextQi;
                }
                this.isOpenReward = false;  //重置状态
                PushNotification.emit('BuyLotDetailCountDown');  //倒计时结束发出通知
            }

            // 倒计时数组提前3期去更新下。防止倒到最后倒计时出现错乱. 请先去请求了。不等到最后一个数据用完才请求, this.state.nextQiShu != 0 判断是否请求到了期数。如果没有期数会一直请求。挡住重复请求
            if (this.state.countDownText == 0 && this.currentCountDownIndex >= this.state.countDownList.length - 3 && this.state.nextQiShu != 0) {

                 this._fetchCountDownData(this.state.tag);
            }

            let currOpen = 0;

            if (this.currentCountDownIndex < this.state.countDownList.length) {
                // 倒计时时间直接用opentime 减 手机系统时间。
                currOpen = this.state.countDownList[this.currentCountDownIndex].opentime - (this.state.countDownList[this.currentCountDownIndex].server_time - this.finishTime)  - Math.round(new Date() / 1000);
            }

            PushNotification.emit('Pk10OpeninCountDownTimeNotificaiton', currOpen, this.state.nextQiShu);

            this.setState({countDownText:currOpen});

        }, 500);

    }

    componentWillUnmount() {

        if (typeof(this.subscription1) == 'object'){
            this.subscription1 && this.subscription1.remove();
        }

        this.timer && clearInterval(this.timer);
        AppState.removeEventListener('change');

        //若组件被卸载，刷新state则直接返回，可以解决警告(倒计时组件可能造成的警告)
        this.setState = (state, callback) => {
            return;
        }
    }

    _showFlatList(isShow){

        this.setState({
            isShowRowList:isShow,
        })

        let rowHeight = Adaption.Height(30);

        //展开列表动态改变控件高度,没有数据时不能展开
        if (isShow == true) {

            this._openHeaderInfo.setNativeProps({
                style: {
                    height: 100 + (this.state.openBallsList.length + 1) * rowHeight,
                }
            })

            this._ListContentView.setNativeProps({
                style: {
                    height: (this.state.openBallsList.length + 1) * rowHeight,
                }
            })

            //使用LayoutAnimation动画实现缓慢效果
            LayoutAnimation.configureNext(CustomLayoutAnimation);
        }
        else {

            //收起列表高度回到初始状态

            this._openHeaderInfo.setNativeProps({
                style: {
                    height: 100,
                }
            })

            this._ListContentView.setNativeProps({
                style: {
                    height: 0,
                }
            })

            this._HeaderView.setNativeProps({
                styles: {
                    height: 0,
                }
            })


            LayoutAnimation.configureNext(CustomLayoutAnimation);

        }
    }

    _renderItemView = (item) => {

        let viewBackColor = item.index % 2 == 0 ? '#f1f2f3' : '#fff';
        let isOpenning = item.item.value.balls.length == 0 || item.item.value.balls.length == 1 ? true : false;
        let balls = item.item.value.balls.replace(/\+/g, ',');
        let ballsArr = balls.split(',');
        let newBalls = ''; //过滤后的号码
        let ballsDescArr = [];  //庄家-闲五的号码pk数组

        if (ballsArr.length != 0){

            for (let i = 0; i < 6; i++){

                let ballsNewArr = [ballsArr[i],ballsArr[i+1],ballsArr[i+2],ballsArr[i+3],ballsArr[i+4]];
                let ballsDesc = this._caculateNiuNiuStatues(ballsNewArr);
                ballsDescArr.push(ballsDesc);
            }

            for (balls of ballsArr){
                balls = balls.startsWith('0') ? balls.substr(1,1) : balls;
                newBalls += balls + ',';
            }
        }


        let openQiShu = `${item.item.value.qishu}`;
        if (openQiShu != null && openQiShu.length > 1) {
            openQiShu = openQiShu.substr(openQiShu.length - 4, 4);
        }

        return <View style = {{height:Adaption.Height(30), flexDirection:'row', backgroundColor:viewBackColor}}>
            <View style = {styles.CellQiShuStyle}>
                <CusBaseText style = {styles.CellQiShuWenBenStyle}>
                    {openQiShu}
                </CusBaseText>
            </View>
            <View style = {styles.CellBallStyle}>
                <CusBaseText style = {{color:isOpenning ? '#707070' : '#eb3349', fontSize:Adaption.Font(14,11)}}>
                    {isOpenning ? '- - -' : newBalls}
                </CusBaseText>
            </View>
            <View style = {styles.CellTextStyle}>
                <CusBaseText style = {styles.CellWenBenStyle}>
                    {isOpenning ? '-' : ballsDescArr[0]}
                </CusBaseText>
            </View>
            <View style = {styles.CellTextStyle}>
                <CusBaseText style = {styles.CellWenBenStyle}>
                    {isOpenning ? '-' : ballsDescArr[1]}
                </CusBaseText>
            </View>
            <View style = {styles.CellTextStyle}>
                <CusBaseText style = {styles.CellWenBenStyle}>
                    {isOpenning ? '-' : ballsDescArr[2]}
                </CusBaseText>
            </View>
            <View style = {styles.CellTextStyle}>
                <CusBaseText style = {styles.CellWenBenStyle}>
                    {isOpenning ? '-' : ballsDescArr[3]}
                </CusBaseText>
            </View>
            <View style = {styles.CellTextStyle}>
                <CusBaseText style = {styles.CellWenBenStyle}>
                    {isOpenning ? '-' : ballsDescArr[4]}
                </CusBaseText>
            </View>
            <View style = {styles.CellTextStyle}>
                <CusBaseText style = {styles.CellWenBenStyle}>
                    {isOpenning ? '-' : ballsDescArr[5]}
                </CusBaseText>
            </View>
        </View>
    }

    _listHeaderComponent(){
        return <View style = {{flexDirection:'row', height:Adaption.Height(30), borderBottomWidth:1, borderColor:'#f1f2f3'}} ref={(c) => this._HeaderView = c}>
            <View style = {styles.CellQiShuStyle}>
                <CusBaseText style = {styles.CellQiShuWenBenStyle}>
                    期号
                </CusBaseText>
            </View>
            <View style = {styles.CellBallStyle}>
                <CusBaseText style = {styles.CellBallWenBenStyle}>
                    开奖号码
                </CusBaseText>
            </View>
            <View style = {styles.CellTextStyle}>
                <CusBaseText style = {styles.CellWenBenStyle}>
                    庄
                </CusBaseText>
            </View>
            <View style = {styles.CellTextStyle}>
                <CusBaseText style = {styles.CellWenBenStyle}>
                    闲一
                </CusBaseText>
            </View>
            <View style = {styles.CellTextStyle}>
                <CusBaseText style = {styles.CellWenBenStyle}>
                    闲二
                </CusBaseText>
            </View>
            <View style = {styles.CellTextStyle}>
                <CusBaseText style = {styles.CellWenBenStyle}>
                    闲三
                </CusBaseText>
            </View>
            <View style = {styles.CellTextStyle}>
                <CusBaseText style = {styles.CellWenBenStyle}>
                    闲四
                </CusBaseText>
            </View>
            <View style = {styles.CellTextStyle}>
                <CusBaseText style = {styles.CellWenBenStyle}>
                    闲五
                </CusBaseText>
            </View>
        </View>
    }

    _rankCarView(rankStr) {

        let rankViewArr = [];

        if (rankStr != '') {

            let rankCarArr = rankStr.split(',');
            let pk10ColorArr = ['#e4e501', '#2964a1', '#929696', '#f09635', '#7bccdf', '#2a4d97', '#cacbcc', '#e53339', '#4e1e11', '#4eb333'];

            for (let i = 0; i < rankCarArr.length; i++) {

                let balls = rankCarArr[i];
                let lastBackColor = pk10ColorArr[parseInt(balls) - 1];

                rankViewArr.push(<View key={i} style={{
                    marginLeft: 3,
                    backgroundColor: lastBackColor,
                    width: Adaption.Width(20),
                    height: Adaption.Width(26),
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <CusBaseText style={{color: '#fff', fontSize: Adaption.Font(15, 12)}}>{balls}</CusBaseText>
                </View>)
            }
        }

        return rankViewArr;
    }

    _changeTime(totalTime) {

        if (isNaN(totalTime) || totalTime <= 0) {
            return `00: 00: 00`;

        } else {

            let day = Math.floor((totalTime / 60 / 60 / 24) * 100) / 100; //保留两位小数
            let hour = Math.floor(totalTime / 60 / 60 % 24);
            let min = Math.floor(totalTime / 60 % 60);
            let seconds = Math.floor(totalTime % 60);

            //大于1天则要乘以24
            if (day >= 1.0) {
                hour = Math.floor(day * 24);
            }

            if (hour < 10) {
                hour = '0' + hour;
            }

            if (min < 10) {
                min = '0' + min;
            }

            if (seconds < 10) {
                seconds = '0' + seconds;
            }

            return `${hour}: ${min}: ${seconds}`;  //格式化输出
        }
    }

    //获取历史开奖数据接口
    _fetchOpenInfoData = (tag) =>{

        this.isFreshOpenReward = false;

        let params = new FormData();
        params.append('ac','getKjCpLog');
        params.append('tag', tag);
        params.append('pcount', 10);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                if (responseData.msg == 0) {

                    let prevList = [];
                    responseData.data.map((prev, j) => {
                        prevList.push({key: j, value: prev});
                    });

                    //解析数据
                    if (prevList.length != 0) {

                        let prevModel = prevList[0];

                        if (prevModel.value.qishu != this.state.prevQiShu && this.isActiveFromBack == false){
                            return;  //请求回来跟要请求的开奖期数不一致。就不刷新界面
                        }

                        this.isActiveFromBack = false;

                        let ballStr = prevModel.value.balls;
                        let splitArr = [];

                        if (typeof(ballStr) == 'string'){
                            splitArr = ballStr.split('+');
                        }

                      //期数要是当前正在开奖的期数
                        if (splitArr.length == 10 && splitArr[0] != ''){
                            PushNotification.emit('PK10NiuNiuOpenReWardNotificaiton', splitArr);
                        }

                        //必须开奖后才会去刷新用户余额,有时候开奖号码为['']的数组
                        if (splitArr.length > 1){

                            //开奖后刷新金额
                            this._refreshUserLessMoney();
                        }

                        this.setState({
                            openBallsArr:splitArr,        //开奖号码
                            prevQiShu:prevModel.value.qishu != '' ? (prevModel.value.qishu):'',          //上一期期数
                            openBallsList:prevList,
                        })

                    }

                }
            })
            .catch((err) => {
            })
    }

    //获取彩种倒计时接口，返回10条数据，本地倒计时
    _fetchCountDownData(tag){

        let params = new FormData();
        params.append('ac', 'getCplogList');
        params.append('tag', tag);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                this.isRequsetCplogList = true;  // 请求返回后 重置为true.

                if (responseData.msg == 0) {

                    if (responseData.data.length != 0){

                        let nextList = responseData.data[0].next;
                        let nextModel = nextList[0];
                        this.finishTime = Math.round(new Date() / 1000);
                        console.log('请求完成时的时间戳' + this.finishTime);

                        // 倒计时时间直接用opentime 减 手机系统时间。

                       let currOpen = nextModel.opentime - (nextModel.server_time - this.finishTime) - Math.round(new Date() / 1000);

                       this.currentCountDownIndex = 0;//当前下标
                       global.CurrentQiShu = nextModel.qishu;
                       this.props.againRequestTime ? this.props.againRequestTime(this.finishTime, nextList) : null;

                       this.setState({
                           countDownList:nextList,
                           nextQiShu:nextModel.qishu,
                           countDownText:currOpen,
                       })

                    }
                } else {
                    this.refs.Toast && this.refs.Toast.show(responseData.param, 1000);
                }
            })

            .catch((err) => {
            })
    }

    //开奖后刷新用户金额接口
    _refreshUserLessMoney(){

        //请求参数
        if (global.UserLoginObject.Uid != '' && global.UserLoginObject.Token != ''){

            let params = new FormData();
            params.append("ac", "flushPrice");
            params.append("uid", global.UserLoginObject.Uid);
            params.append("token", global.UserLoginObject.Token);
            params.append('sessionkey', global.UserLoginObject.session_key);
            var promise = GlobalBaseNetwork.sendNetworkRequest(params);
            promise
                .then(response => {

                    if (response.msg == 0) {

                        //数字类型的取两位小数
                        if (typeof(response.data.price) == 'number') {

                            response.data.price = response.data.price.toFixed(2);
                        }

                        global.UserLoginObject.TotalMoney = response.data.price;

                    }
                })
                .catch(err => {

                });
        }

    }



    //创建右边号码详情视图
    _initBallsDetailView(ballsArr){

        if (ballsArr.length != 0 && ballsArr.length != 1){

            let ballsDescArr = [];  //庄家-闲五的号码pk数组
            for (let i = 0; i < 6; i++){

                let ballsNewArr = [ballsArr[i],ballsArr[i+1],ballsArr[i+2],ballsArr[i+3],ballsArr[i+4]];
                let ballsDesc = this._caculateNiuNiuStatues(ballsNewArr);
                ballsDescArr.push(ballsDesc);
            }

            if (this.isOpenReward == false){
                this.isOpenReward = true;

                PushNotification.emit('PkNiuNiuOpenStatuesNotification', ballsDescArr, this.state.openBallsArr);
            }


            return <View style = {{flex:0.7, alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
                <View style = {{width:Adaption.Width(34), height:20, backgroundColor:'#fff', alignItems:'center', justifyContent:'center'}}>
                    <CusBaseText style = {{color:'#707070', fontSize:Adaption.Font(14,11)}}>
                        {ballsDescArr[0]}
                    </CusBaseText>
                </View>
                <View style = {{marginLeft:Adaption.Width(20), width:Adaption.Width(34), height:20, backgroundColor:'#fff', alignItems:'center', justifyContent:'center'}}>
                    <CusBaseText style = {{color:'#707070', fontSize:Adaption.Font(14,11)}}>
                        {ballsDescArr[1]}
                    </CusBaseText>
                </View>
                <View style = {{marginLeft:Adaption.Width(8), width:Adaption.Width(34), height:20, backgroundColor:'#fff', alignItems:'center', justifyContent:'center'}}>
                    <CusBaseText style = {{color:'#707070', fontSize:Adaption.Font(14,11)}}>
                        {ballsDescArr[2]}
                    </CusBaseText>
                </View>
                <View style = {{marginLeft:Adaption.Width(8), width:Adaption.Width(34), height:20, backgroundColor:'#fff', alignItems:'center', justifyContent:'center'}}>
                    <CusBaseText style = {{color:'#707070', fontSize:Adaption.Font(14,11)}}>
                        {ballsDescArr[3]}
                    </CusBaseText>
                </View>
                <View style = {{marginLeft:Adaption.Width(8), width:Adaption.Width(34), height:20, backgroundColor:'#fff', alignItems:'center', justifyContent:'center'}}>
                    <CusBaseText style = {{color:'#707070', fontSize:Adaption.Font(14,11)}}>
                        {ballsDescArr[4]}
                    </CusBaseText>
                </View>
                <View style = {{marginLeft:Adaption.Width(8), width:Adaption.Width(34), height:20, backgroundColor:'#fff', alignItems:'center', justifyContent:'center'}}>
                    <CusBaseText style = {{color:'#707070', fontSize:Adaption.Font(14,11)}}>
                        {ballsDescArr[5]}
                    </CusBaseText>
                </View>
            </View>
        }
        else {

            if (this.isFreshOpenReward == false){
                this.isFreshOpenReward = true;

                setTimeout(() => {this._fetchOpenInfoData(this.state.tag);}, 9000);
            }

             return <View style = {{flex:0.7, alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
                <View style = {{width:Adaption.Width(34), height:20, backgroundColor:'#fff', alignItems:'center', justifyContent:'center'}}>
                    <CusBaseText style = {{color:'#707070', fontSize:Adaption.Font(14,11)}}>
                         -
                    </CusBaseText>
                </View>
                <View style = {{marginLeft:Adaption.Width(20), width:Adaption.Width(34), height:20, backgroundColor:'#fff', alignItems:'center', justifyContent:'center'}}>
                    <CusBaseText style = {{color:'#707070', fontSize:Adaption.Font(14,11)}}>
                        -
                    </CusBaseText>
                </View>
                <View style = {{marginLeft:Adaption.Width(8), width:Adaption.Width(34), height:20, backgroundColor:'#fff', alignItems:'center', justifyContent:'center'}}>
                    <CusBaseText style = {{color:'#707070', fontSize:Adaption.Font(14,11)}}>
                        -
                    </CusBaseText>
                </View>
                <View style = {{marginLeft:Adaption.Width(8), width:Adaption.Width(34), height:20, backgroundColor:'#fff', alignItems:'center', justifyContent:'center'}}>
                    <CusBaseText style = {{color:'#707070', fontSize:Adaption.Font(14,11)}}>
                        -
                    </CusBaseText>
                </View>
                <View style = {{marginLeft:Adaption.Width(8), width:Adaption.Width(34), height:20, backgroundColor:'#fff', alignItems:'center', justifyContent:'center'}}>
                    <CusBaseText style = {{color:'#707070', fontSize:Adaption.Font(14,11)}}>
                        -
                    </CusBaseText>
                </View>
                <View style = {{marginLeft:Adaption.Width(8), width:Adaption.Width(34), height:20, backgroundColor:'#fff', alignItems:'center', justifyContent:'center'}}>
                    <CusBaseText style = {{color:'#707070', fontSize:Adaption.Font(14,11)}}>
                        -
                    </CusBaseText>
                </View>
            </View>
        }
    }

    //计算五个号码所组成的一组号码的牛牛值
    _caculateNiuNiuStatues(ballsArr) {

        let niuniuBallStatue = '';
        let ballResult = null;  //判断是否找到符合条件的
        let niuniuBall1 = ''; //符合条件的号码
        let niuniuBall2 = ''; //符合条件的号码
        let niuniuBall3 = ''; //符合条件的号码

        for (let i = 0; i < ballsArr.length; i++){

            for (let j = i + 1; j < ballsArr.length; j++){

                for (let k = j + 1; k < ballsArr.length; k ++){

                    ballResult = (parseInt(ballsArr[i],10) + parseInt(ballsArr[j],10) + parseInt(ballsArr[k],10)) % 10 == 0 ? true : false;

                    if (ballResult){
                        niuniuBall1 = ballsArr[i];
                        niuniuBall2 = ballsArr[j];
                        niuniuBall3 = ballsArr[k];
                        break;
                    }
                    else {
                        continue;
                    }
                }

                if (ballResult){
                    break;
                }
                else {
                    continue;
                }
            }

            if (ballResult){
                break;
            }
            else {
                continue;
            }
        }

        if (niuniuBall1 != '' && niuniuBall2 != '' && niuniuBall3 != ''){

            //符合条件的号码

           let ballsSum =  parseInt(ballsArr[0],10) + parseInt(ballsArr[1],10) + parseInt(ballsArr[2],10) + parseInt(ballsArr[3],10) + parseInt(ballsArr[4],10);
           let niuniuIdx = ballsSum % 10;

            switch (niuniuIdx){
                case 0:
                    niuniuBallStatue = '牛牛';
                    break;
                case 1:
                    niuniuBallStatue = '牛一';
                    break;
                case 2:
                    niuniuBallStatue = '牛二';
                    break;
                case 3:
                    niuniuBallStatue = '牛三';
                    break;
                case 4:
                    niuniuBallStatue = '牛四';
                    break;
                case 5:
                    niuniuBallStatue = '牛五';
                    break;
                case 6:
                    niuniuBallStatue = '牛六';
                    break;
                case 7:
                    niuniuBallStatue = '牛七';
                    break;
                case 8:
                    niuniuBallStatue = '牛八';
                    break;
                case 9:
                    niuniuBallStatue = '牛九';
                    break;
                default:
                    break;
            }

        }
        else {

            //无牛了。循环很多遍没有符合条件的就是无牛
            niuniuBallStatue = '无牛';
        }

        return niuniuBallStatue;

    }

    render (){

        return <View style = {this.props.style} ref={(c) => this._openHeaderInfo = c}>
                <View style = {{height:30, flexDirection:'row'}}>
                    <View style = {{flex:0.3, justifyContent:'center'}}>
                        <CusBaseText style = {{marginLeft:15, color:'#535353', fontSize:Adaption.Font(16,13)}}>
                            第 <CusBaseText style = {{color:'#eb3349'}}>
                            {`${this.state.prevQiShu}`.substr(`${this.state.prevQiShu}`.length - 4, 4)}
                        </CusBaseText> 期
                        </CusBaseText>
                    </View>
                    {this._initBallsDetailView(this.state.openBallsArr)}
                </View>
                <View style = {{height:30, flexDirection:'row', justifyContent:'center'}}>
                    <View style = {{marginLeft:10,flexDirection:'row', flex:0.7, alignItems:'center'}}>
                        {this._rankCarView(this.state.paiming)}
                    </View>
                    <TouchableOpacity onPress = {() => {
                        if (this.clickOpenListWating == false){

                            this.clickOpenListWating = true;
                            this._showFlatList(!this.state.isShowRowList);
                            setTimeout(()=> {this.clickOpenListWating = false},1000);
                        }
                    }} activeOpacity={0.8} style = {{flex:0.3, alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
                        <CusBaseText style = {{color:'#535353'}}>
                            历史开奖
                        </CusBaseText>
                        <Image style = {{width:15, height:10}} source={this.state.isShowRowList ? (require('../../../buyLotDetail/touzhu2.0/img/ic_buyLot_upRow.png')) : (require('../../../buyLotDetail/touzhu2.0/img/ic_buyLot_downRow.png')) }/>
                    </TouchableOpacity>
                </View>
                <FlatList
                    ref={(c) => this._ListContentView = c}
                    style = {{width:SCREEN_WIDTH, height:0, backgroundColor:'#fff'}}
                    renderItem={this._renderItemView}
                    data={this.state.openBallsList}
                    ListHeaderComponent={() => this._listHeaderComponent()}
                    automaticallyAdjustContentInsets={false}
                    alwaysBounceHorizontal = {false}
                    scrollEnabled = {false}
                />
                <View style = {{height:40, flexDirection:'row', justifyContent:'center'}}>
                    <View style = {{flex:0.55, flexDirection:'row', flexDirection:'row', alignItems:'center'}}>
                        <CusBaseText style = {{fontSize:Adaption.Font(15), color:wenZiColor, marginLeft:10}}>
                            {`第${this.state.nextQiShu ? `${this.state.nextQiShu}`.substr(`${this.state.nextQiShu}`.length - 4, 4) : '- -'}期${this.state.nextFengPan < 1 ? '已封盘' : '截止时间'}: `}
                        </CusBaseText>
                        <CusBaseText style = {{fontSize:Adaption.Font(16), color:'#eb3349'}}>
                            {this._changeTime(this.state.countDownText)}
                        </CusBaseText>
                    </View>
                    <View style = {{flex:0.45,  alignItems:'flex-end', justifyContent:'center'}}>
                        <TouchableOpacity activeOpacity={1} style = {{marginRight:5, justifyContent:'center'}} onPress = {() => {

                            if (global.UserLoginObject.Uid == '' ){

                                this.props.NoLoginClick ?  this.props.NoLoginClick() : null;
                            }


                        }}>
                            {global.UserLoginObject.Uid ? <CusBaseText style = {{fontSize:Adaption.Font(15)}}>
                                    余额:<CusBaseText style = {{fontSize:Adaption.Font(15), color:'#eb3349'}}>
                                    {global.UserLoginObject.TotalMoney}
                                </CusBaseText>元
                                </CusBaseText> :
                                <CusBaseText style = {{fontSize:Adaption.Font(15)}}>
                                    余额:请<CusBaseText style = {{fontSize:Adaption.Font(15), color:'#00a3e9'}}>
                                    [登录]
                                </CusBaseText>
                                </CusBaseText>}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
    }
}

const styles = StyleSheet.create({
    //CellItem
    CellTextStyle:{
        flex:0.1,
        alignItems:'center',
        justifyContent:'center',
    },

    //Cell期号样式
    CellQiShuWenBenStyle:{
        fontSize:Adaption.Font(16,13),
        color:'#707070',
    },

    //Cell号码样式
    CellBallWenBenStyle:{
        fontSize:Adaption.Font(14,11),
        color:'#707070',
    },

    //Cell文本样式
    CellWenBenStyle:{
        fontSize:Adaption.Font(15,12),
        color:'#707070',
    },

    CellBallStyle: {
        flex:0.35,
        alignItems:'center',
        justifyContent:'center',
    },

    CellQiShuStyle : {
        flex:0.15,
        alignItems:'center',
        justifyContent:'center',
    },

})