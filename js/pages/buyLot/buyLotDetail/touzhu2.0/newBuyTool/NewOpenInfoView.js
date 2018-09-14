/**
 Author Ward
 Created by on 2018-01-04 08:51
 新版开奖信息视图
 **/

import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    AppState,
    Image,
    LayoutAnimation,
} from 'react-native';

import Moment from 'moment'; //日期计算控件
import GetBallStatus from './GetBallStatus'; // 获得号码球的状态， 什么颜色、生肖
import NewOpenBallsView from '../newBuyTool/NewOpenBallsView'

//K3的号码球图片
let k3Image = [require('../img/ic_buyLot_touzi1.png'), require('../img/ic_buyLot_touzi2.png'), require('../img/ic_buyLot_touzi3.png'), require('../img/ic_buyLot_touzi4.png'), require('../img/ic_buyLot_touzi5.png'), require('../img/ic_buyLot_touzi6.png')];
//幸运农场的号码球图片
let XYNCImageArr = [require('../../../img/axyncImg/lucky_ball_01.png'),require('../../../img/axyncImg/lucky_ball_02.png'),require('../../../img/axyncImg/lucky_ball_03.png'),require('../../../img/axyncImg/lucky_ball_04.png'),
    require('../../../img/axyncImg/lucky_ball_05.png'),require('../../../img/axyncImg/lucky_ball_06.png'),require('../../../img/axyncImg/lucky_ball_07.png'),require('../../../img/axyncImg/lucky_ball_08.png'),
    require('../../../img/axyncImg/lucky_ball_09.png'),require('../../../img/axyncImg/lucky_ball_10.png'),require('../../../img/axyncImg/lucky_ball_11.png'),require('../../../img/axyncImg/lucky_ball_12.png'),
    require('../../../img/axyncImg/lucky_ball_13.png'),require('../../../img/axyncImg/lucky_ball_14.png'),require('../../../img/axyncImg/lucky_ball_15.png'),require('../../../img/axyncImg/lucky_ball_16.png'),
    require('../../../img/axyncImg/lucky_ball_17.png'),require('../../../img/axyncImg/lucky_ball_18.png'),require('../../../img/axyncImg/lucky_ball_19.png'),require('../../../img/axyncImg/lucky_ball_20.png')];
//幸运扑克的号码球图片
let XYPokerA = [require('../pkImg/pkA_1.png'),require('../pkImg/pkA_2.png'),require('../pkImg/pkA_3.png'),require('../pkImg/pkA_4.png')];
let XYPoker2 = [require('../pkImg/pk2_1.png'),require('../pkImg/pk2_2.png'),require('../pkImg/pk2_3.png'),require('../pkImg/pk2_4.png')];
let XYPoker3 = [require('../pkImg/pk3_1.png'),require('../pkImg/pk3_2.png'),require('../pkImg/pk3_3.png'),require('../pkImg/pk3_4.png')];
let XYPoker4 = [require('../pkImg/pk4_1.png'),require('../pkImg/pk4_2.png'),require('../pkImg/pk4_3.png'),require('../pkImg/pk4_4.png')];
let XYPoker5 = [require('../pkImg/pk5_1.png'),require('../pkImg/pk5_2.png'),require('../pkImg/pk5_3.png'),require('../pkImg/pk5_4.png')];
let XYPoker6 = [require('../pkImg/pk6_1.png'),require('../pkImg/pk6_2.png'),require('../pkImg/pk6_3.png'),require('../pkImg/pk6_4.png')];
let XYPoker7 = [require('../pkImg/pk7_1.png'),require('../pkImg/pk7_2.png'),require('../pkImg/pk7_3.png'),require('../pkImg/pk7_4.png')];
let XYPoker8 = [require('../pkImg/pk8_1.png'),require('../pkImg/pk8_2.png'),require('../pkImg/pk8_3.png'),require('../pkImg/pk8_4.png')];
let XYPoker9 = [require('../pkImg/pk9_1.png'),require('../pkImg/pk9_2.png'),require('../pkImg/pk9_3.png'),require('../pkImg/pk9_4.png')];
let XYPoker10 = [require('../pkImg/pk10_1.png'),require('../pkImg/pk10_2.png'),require('../pkImg/pk10_3.png'),require('../pkImg/pk10_4.png')];
let XYPokerJ = [require('../pkImg/pkJ_1.png'),require('../pkImg/pkJ_2.png'),require('../pkImg/pkJ_3.png'),require('../pkImg/pkJ_4.png')];
let XYPokerQ = [require('../pkImg/pkQ_1.png'),require('../pkImg/pkQ_2.png'),require('../pkImg/pkQ_3.png'),require('../pkImg/pkQ_4.png')];
let XYPokerK = [require('../pkImg/pkK_1.png'),require('../pkImg/pkK_2.png'),require('../pkImg/pkK_3.png'),require('../pkImg/pkK_4.png')];
var isFreshOpenTime = false;  //是否刷新
const wenZiColor = '#535353';  //字体颜色
const CommentBackColor = "white";  //背景白色
const CommentTextColor = "#6c6d6e";  //文本黑色

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

class NewOpenInfoView extends Component {

    //构造器
    constructor(props) {
        super(props);

        this.finishTime = props.finishTime;

        let qishu = 0, jieZhiTime = 0, fengPan = 0;
        if (props.nextTimeList.length > 0) {  // 倒计时
            jieZhiTime = props.nextTimeList[0].opentime - (props.nextTimeList[0].server_time - this.finishTime) - Math.round(new Date() / 1000);
            //fengPan = props.nextTimeList[0].stoptime - (props.nextTimeList[0].server_time - this.finishTime) - Math.round(new Date() / 1000);
            qishu = props.nextTimeList[0].qishu; //下一个期数
            console.log('props.nextTimeList', props.nextTimeList);
        }

        let prevQiShu = 0, openBallsArr = [];
        if (props.prevList.length > 0) {  // 开奖号码数据
            let ballStr = props.prevList[0].value.balls;
            openBallsArr = ballStr && ballStr.length > 0 ? ballStr.split('+') : []; //开奖号码
            prevQiShu = props.prevList[0].value.qishu;  //上一期期数
        }

        //如果期数相差等于2期,说明后台返回的开奖结果有问题。需要本地处理
        if (qishu - prevQiShu == 2){
            prevQiShu = prevQiShu + 1;
            openBallsArr = [];
        }

        this.state = ({
            isRowList:false,
            openListArr: props.prevList,  //开奖信息数组
            openBallsArr: openBallsArr,  //开奖号码分割数组
            tag:props.tag,
            js_tag:props.js_tag,
            speed:props.speed,  //高低频彩
            prevQiShu: prevQiShu,          //上一期期数
            nextQiShu: qishu,          //下一个期数
            nextJieZhi: jieZhiTime,        //下一期截止时间
            isOpenReWard:false,  //是否开奖
            nextCountDownList: props.nextTimeList, //开奖数组10条
            // nextFengPan: fengPan, //距离封盘倒计时
            isShowUserMoney:false, //是否显示用户余额
        })

        this.currentCountDownIndex = 0;//当前下标
        this.timer = null;
        this.timerRefresh = null;
        this.historyOpenWating = false;  //点击历史开奖等待
        this.isRequsetCplogList = true;  // 防止进来时网络慢 nextCountDownList数组没有数据时 执行倒计时时会重复触发N次请求倒计时的方法
        this.isActiveFromBack = false;  //是否从后台重新进来激活
    }

    //属性改变时的方法
    componentWillReceiveProps(nextProps) {
        
        if (this.state.tag != nextProps.tag) {
            // 如果不相等 再赋值 再请求
            this.setState({
                tag: nextProps.tag,
                js_tag: nextProps.js_tag,
            })

            this._fetchCountDownData(nextProps.tag);
            this._fetchOpenInfoData(nextProps.tag);
        }

        // 本地到计时数组
        if (nextProps.nextTimeList.length > 0 && this.state.nextCountDownList.length <= 0) {
            this.finishTime = nextProps.finishTime;
            let jieZhiTime = nextProps.nextTimeList[0].opentime - (nextProps.nextTimeList[0].server_time - this.finishTime) - Math.round(new Date() / 1000);
            // let fengPanTime = nextProps.nextTimeList[0].stoptime - (nextProps.nextTimeList[0].server_time - this.finishTime) - Math.round(new Date() / 1000);
            console.log('nextProps.nextTimeList', nextProps.nextTimeList);
            this.setState({
                nextQiShu: nextProps.nextTimeList[0].qishu,          //下一个期数
                nextJieZhi: jieZhiTime,        //这一期开奖截止时间
               // nextFengPan: fengPanTime,  //这一期封盘时间
                nextCountDownList: nextProps.nextTimeList,
            })
        }

        if (nextProps.prevList.length > 0 && this.state.openListArr <= 0) {
            let ballStr = nextProps.prevList[0].value.balls;
            let splitArr = ballStr && ballStr.length > 0 ? ballStr.split('+') : []; //开奖号码

            this.setState({
                openBallsArr: splitArr,        //开奖号码
                prevQiShu: nextProps.prevList[0].value.qishu,    //上一期期数
                openListArr: nextProps.prevList,
            })
        }

        //如果期数相差等于2期,说明后台返回的开奖结果有问题。需要本地处理
        if (this.state.nextQiShu - this.state.prevQiShu == 2){
            this.setState({
                prevQiShu:this.state.prevQiShu + 1,
                openBallsArr:[],
            })
        }

    }


    //创建号码球属性信息的视图
    _initBallDescView(ballsArr){

        //分分钟开奖给5秒钟延迟
        if (((ballsArr.length == 0 || ballsArr.length == 1) && isFreshOpenTime == false)) {
            //如果开奖号码为''字符串并且刷新了，则延迟之后再次进来。防止每秒钟都在刷。

            isFreshOpenTime = true;
            let fastLottery = this.state.tag.includes('ff') || this.state.tag == 'jdxypk' || this.state.tag == 'xyqxc'; //幸运扑克和幸运七星彩都是分分钟开奖
            let duration = fastLottery ? 5 : 20;

             setTimeout(() => {

                isFreshOpenTime = false;
                this._fetchOpenInfoData(this.state.tag);

            }, duration * 1000);
        }

        let isOpening = (ballsArr.length ==0 || ballsArr.length == 1) ? true : false;

        if (this.state.js_tag == 'pcdd' || this.state.js_tag == 'k3' || this.state.js_tag == '3d') {

            var cellTitArr = [];
            let sum = this.state.js_tag == 'pcdd' ? ballsArr[ballsArr.length - 1]: this._sumResults(ballsArr);

            if (this.state.js_tag == 'pcdd') {
                cellTitArr = [
                    isOpening ? '-' : sum,
                    isOpening ? '-' : `${sum <= 13 ? '小' : '大'}`,
                    isOpening ? '-' : `${sum % 2 == 0 ? '双' : '单'}`,
                    isOpening ? '-' : GetBallStatus.getPcddColorToBallStr(sum, true),
                ];
            } else if (this.state.js_tag == 'k3') {
                cellTitArr = [
                    isOpening ? '-' : `${sum <= 10 ? '小' : '大'}`,
                    isOpening ? '-' : `${sum % 2 == 0 ? '双' : '单'}`,
                    isOpening ? '-' : sum,
                ];
            } else {
                if (!isOpening) {
                    for (ba of ballsArr) {
                        let ballStatus = `${parseInt(ba) < 5 ? '小' : '大'}${parseInt(ba) % 2 == 0 ? '双' : '单'}`;
                        cellTitArr.push(ballStatus);
                    }
                    cellTitArr.push(sum);
                } else {
                    cellTitArr = ['-', '-', '-', '-']
                }
            }

            var views = [];
            for (let i = 0; i < cellTitArr.length; i++) {
                let leftW = Adaption.Width(i == 0 ? 50 : i == cellTitArr.length - 1 ? cellTitArr.length == 3 ? 80 : 50 : 10);
                views.push(
                    <View key={i} style = {{backgroundColor:CommentBackColor, justifyContent:'center', alignItems:'center', width:Adaption.Width(37), height:Adaption.Font(25, 22), borderRadius:2, marginLeft: leftW}}>
                        <CusBaseText style = {{color:CommentTextColor, fontSize:Adaption.Font(15, 13)}}>
                            {cellTitArr[i]}
                        </CusBaseText>
                    </View>
                );
            }
            return <View style = {{flexDirection:'row'}}>{views}</View>


        } else if (this.state.js_tag == 'pk10') {

            let sum = !isOpening ? this._sumResults([ballsArr[0], ballsArr[1]]) : 0; // 总和; //冠亚军和值

            let dsStr = sum == 11 ? '和' : sum % 2 == 0 ? '双' : '单';
            let dxStr = sum >= 14 ? '大' : sum >= 9 ? '中' : '小';
            let longHu1 = parseInt(ballsArr[0]) > parseInt(ballsArr[ballsArr.length - 1]) ? '龙' : '虎';
            let longHu2 = parseInt(ballsArr[1]) > parseInt(ballsArr[ballsArr.length - 2]) ? '龙' : '虎';
            let longHu3 = parseInt(ballsArr[2]) > parseInt(ballsArr[ballsArr.length - 3]) ? '龙' : '虎';
            let longHu4 = parseInt(ballsArr[3]) > parseInt(ballsArr[ballsArr.length - 4]) ? '龙' : '虎';
            let longHu5 = parseInt(ballsArr[4]) > parseInt(ballsArr[ballsArr.length - 5]) ? '龙' : '虎';

            if (isOpening == true){
                sum = dsStr = dxStr = longHu1 = longHu2 = longHu3 = longHu4 = longHu5 = '-';
            }
            let titArr = [sum, dxStr, dsStr, longHu1, longHu2, longHu3, longHu4, longHu5];
            var views = [];
            for (let a = 0; a < titArr.length; a++) {
                let width = a < 3 ? 27 : 23;
                let left = a == 3 ? 30 : 8;
                views.push(
                    <View key={a} style = {{backgroundColor:CommentBackColor, justifyContent:'center', alignItems:'center', width: Adaption.Width(width), height:Adaption.Font(25, 22), borderRadius:2, marginLeft: Adaption.Width(left) }}>
                        <CusBaseText style = {{color:CommentTextColor, fontSize:Adaption.Font(15, 13)}}>
                            {titArr[a]}
                        </CusBaseText>
                    </View>
                );
            }
            return <View style = {{flexDirection:'row'}}>{views}</View>


        } else if (this.state.js_tag == 'ssc') {

            var cellTitArr = [];

            if (!isOpening) {
                for (ba of ballsArr) {
                    let ball = parseInt(ba);
                    let ballStatus = `${ball <= 4 ? '小' : '大'}${ball % 2 == 0 ? '双' : '单'}`;
                    cellTitArr.push(ballStatus);
                }

                cellTitArr.push(this._sscQianSanStatus([parseInt(ballsArr[0]), parseInt(ballsArr[1]), parseInt(ballsArr[2])]));
            } else {
                cellTitArr = ['-', '-', '-', '-', '-', '-'];
            }

            var views = [];
            for (let i = 0; i < cellTitArr.length; i++) {
                views.push(
                    <View key={i} style = {{backgroundColor:CommentBackColor, justifyContent:'center', alignItems:'center', width:Adaption.Width(36), height:Adaption.Font(25, 22), borderRadius:2, marginLeft:Adaption.Width(i == 5 ? 30 : 8)}}>
                        <CusBaseText style = {{color:CommentTextColor, fontSize:Adaption.Font(15, 13)}}>
                            {cellTitArr[i]}
                        </CusBaseText>
                    </View>
                );
            }
            return <View style = {{flexDirection:'row'}}>{views}</View>


        } else if (this.state.js_tag == '11x5') {

            //浅拷贝,防止改变数据源
            let temArray = [];
            ballsArr.map(dict => {
                temArray.push(dict)
            })

            let sortAr = this._sort(temArray); // 排序
            let sum = this._sumResults(ballsArr); // 总和

            let lastOpenBallStr = this.state.openListArr.length > 1 ? this.state.openListArr[1].value.balls : ''; // 拿到上一期的号码。
            let lastOpenBallArr = lastOpenBallStr && lastOpenBallStr.split('+');
            var repeatCount = 0;
            for (let n = 0; n < lastOpenBallArr.length; n++) {
                let b1 = lastOpenBallArr[n];
                if (ballsArr.includes(b1)) {
                    repeatCount += 1;
                }
            }

            let cellTitArr = [
                isOpening ? '-' : parseInt(sortAr[sortAr.length - 1]) - parseInt(sortAr[0]),
                isOpening ? '-' : repeatCount,
                isOpening ? '-' : `${sum <= 30 ? '小' : '大'}`,
                isOpening ? '-' : `${sum % 2 == 0 ? '双' : '单'}`,
            ];

            var views = [];
            for (let i = 0; i < cellTitArr.length; i++) {
                views.push(
                    <View key={i} style = {{backgroundColor:CommentBackColor, justifyContent:'center', alignItems:'center', width:Adaption.Width(36), height:Adaption.Font(25, 22), borderRadius:2, marginLeft: Adaption.Width(i == 0 ? 30 : i == 2 ? 60 : 10)}}>
                        <CusBaseText style = {{color:CommentTextColor, fontSize:Adaption.Font(15, 13)}}>
                            {cellTitArr[i]}
                        </CusBaseText>
                    </View>
                );
            }
            return <View style = {{flexDirection:'row'}}>{views}</View>


        } else if (this.state.js_tag == 'lhc') {

            let teMa = ballsArr[ballsArr.length - 1]; // 特码
            let teMaSum = !isOpening ? parseInt(teMa.substr(0, 1)) + parseInt(teMa.substr(1, 1)) : 0; // 特码值相加

            let shengxiao = isOpening ? '-' : GetBallStatus.getShengxiaoToBallStr(teMa);
            let cellTitArr = [
                shengxiao,
                isOpening ? '-' : GetBallStatus.getKindToShengxiao(shengxiao),
                isOpening ? '-' :  parseInt(teMa) > 24 ? '大' : '小',
                isOpening ? '-' :  parseInt(teMa) % 2 == 0 ? '双' : '单',
                isOpening ? '-' : GetBallStatus.getLhcColorToBallStr(teMa, true),
                isOpening ? '-' : `合${teMaSum % 2 == 0 ? '双' : '单'}`,
            ];

            var views = [];
            for (let i = 0; i < cellTitArr.length; i++) {
                let isLast = i == cellTitArr.length - 1;
                views.push(
                    <View key={i} style={{ marginLeft: Adaption.Width(isLast ? 30 : 8), width:Adaption.Width(isLast ? 40 : 35), height:Adaption.Font(25, 22), backgroundColor:CommentBackColor, justifyContent:'center', alignItems:'center'}}>
                        <CusBaseText style={{color:CommentTextColor, backgroundColor:'rgba(0,0,0,0)', fontSize:Adaption.Font(15,13)}}>{cellTitArr[i]}</CusBaseText>
                    </View>
                );
            }
            return <View style = {{flexDirection:'row'}}>{views}</View>
        }
        else if (this.state.js_tag == 'qxc'){

            var cellTitArr = [];

            if (!isOpening) {

                let ballSum = 0; //总和值
                let daxiao = '';  //大小
                let danshuang = ''; //单双

                for (ba of ballsArr) {
                    let ball = parseInt(ba);
                    ballSum += ball;
                    let ballStatus = `${ball <= 4 ? '小' : '大'}${ball % 2 == 0 ? '双' : '单'}`;
                    cellTitArr.push(ballStatus);
                }

                daxiao = ballSum > 17 ? '大' : '小';
                danshuang = ballSum % 2 == 0 ? '双' : '单';
                cellTitArr = [...cellTitArr,...[ballSum,daxiao,danshuang]];

            } else {
                cellTitArr = ['-', '-', '-', '-', '-', '-', '-'];
            }

            var views = [];
            for (let i = 0; i < cellTitArr.length; i++) {
                views.push(
                    <View key={i} style = {{backgroundColor:CommentBackColor, justifyContent:'center', alignItems:'center', width:Adaption.Width(35), height:Adaption.Font(25, 22), borderRadius:2, marginLeft:Adaption.Width(i == 4 ? 10 : 5)}}>
                        <CusBaseText style = {{color:CommentTextColor, fontSize:Adaption.Font(14, 11)}}>
                            {cellTitArr[i]}
                        </CusBaseText>
                    </View>
                );
            }
            return <View style = {{flexDirection:'row'}}>{views}</View>
        }
        else if (this.state.js_tag == 'xync'){

           let ballSum = 0;  //总和
           let ballDS = '';  //单双
           let ballTail = ''; // 尾小
           let longhu = '';  //龙虎
           let sumds = ''; //总和大小
           let cellTitArr = [];

           if (!isOpening) {

               for (let ball of ballsArr) {
                   ballSum += parseInt(ball, 10);
               }

               ballDS = ballSum % 2 == 0 ? '双' : '单';
               ballTail = ballSum % 10 > 4 ? '尾大' : '尾小';  //总和的个位数的大小
               longhu = parseInt(ballsArr[0], 10) > parseInt(ballsArr[ballsArr.length - 1], 10) ? '龙' : '虎';
               sumds = ballSum > 84 ? '大' : '小';

              cellTitArr = [
                   `${ballSum}`,
                   sumds,
                   ballDS,
                   ballTail,
                   longhu,
               ];
           }
           else {
               cellTitArr = ['-','-','-','-','-'];
           }

            var views = [];
            for (let i = 0; i < cellTitArr.length; i++) {
                let isLast = i == cellTitArr.length - 2;
                views.push(
                    <View key={i} style={{ marginLeft: Adaption.Width(isLast ? 30 : 8), width:Adaption.Width(isLast ? 40 : 35), height:Adaption.Font(25, 22), backgroundColor:CommentBackColor, justifyContent:'center', alignItems:'center'}}>
                        <CusBaseText style={{color:CommentTextColor, backgroundColor:'rgba(0,0,0,0)', fontSize:Adaption.Font(15,13)}}>{cellTitArr[i]}</CusBaseText>
                    </View>
                );
            }
            return <View style = {{flexDirection:'row'}}>{views}</View>
        }
        else if (this.state.js_tag == 'xypk'){

            let ballStatus = '';

            if (!isOpening){
                ballStatus = this._pokerNumStatus(ballsArr);
            }
            else {
                ballStatus = '-';
            }

            return <View style = {{flexDirection:'row'}}>
                <View style = {{flex:0.85}}/>
                <View style={{ marginRight: 15, width:Adaption.Width(60), height:Adaption.Font(25, 22), backgroundColor:CommentBackColor, justifyContent:'center', alignItems:'center'}}>
                <CusBaseText style={{color:CommentTextColor, backgroundColor:'rgba(0,0,0,0)', fontSize:Adaption.Font(14,11)}}>{!isOpening ? ballStatus : '-'}</CusBaseText>
            </View>
            </View>
        }
    }

    //开奖列表头部视图
    _listHeaderComponent() {

        var flexArr = [], titleArr = [];

        if (this.state.js_tag == 'k3' || this.state.js_tag == 'pcdd') {
            flexArr = [0.3, 0.3, 0.13, 0.13, 0.13];
            titleArr = ['期号', '开奖号码', this.state.js_tag == 'pcdd' ? '色波' : '和值', '大小', '单双'];

        } else if (this.state.js_tag == '3d') {
            flexArr = [0.16, 0.2, 0.11, 0.11, 0.14, 0.14, 0.14];
            titleArr = ['期号', '开奖号码', '和值', '跨度', '百位', '十位', '个位'];

        } else if (this.state.js_tag == 'lhc') {
            flexArr = [0.13, 0.45, 0.11, 0.1, 0.1, 0.11];
            titleArr = ['期号', '开奖号码', '家野', '大小', '单双', '色波'];

        } else if (this.state.js_tag == 'ssc') {
            flexArr = [0.14, 0.19, 0.11, 0.11, 0.11, 0.11, 0.11, 0.12];
            titleArr = ['期号', '开奖号码', '万位', '千位', '百位', '十位', '个位', '后三'];

        } else if (this.state.js_tag == '11x5') {
            flexArr = [0.25, 0.3, 0.13, 0.17, 0.15];
            titleArr = ['期号', '开奖号码', '跨度', '重号个数', '总和值'];

        } else if (this.state.js_tag == 'pk10') {
            flexArr = [0.2, 0.6, 0.2];
            titleArr = ['期号', '开奖号码', '冠亚军和'];
        }
        else if (this.state.js_tag == 'xypk'){
            flexArr = [0.3,0.4,0.3];
            titleArr = ['期号','开奖号码','形态'];
        }
        else if (this.state.js_tag == 'xync'){
            flexArr = [0.15, 0.48, 0.37];
            titleArr = ['期号','开奖号码','总和'];
        }
        else if (this.state.js_tag == 'qxc'){
            flexArr = [0.16, 0.2, 0.11, 0.11, 0.11, 0.11, 0.2];
            titleArr = ['期号', '开奖号码', '千位', '百位', '十位', '十位', '总和'];
        }

        var views = [];
        for (let i = 0; i < flexArr.length; i++) {
            views.push(
                <View key={i} style = {{flex:flexArr[i], alignItems:'center', justifyContent:'center'}}>
                    <CusBaseText style = {{fontSize: Adaption.Font(15,12), color: wenZiColor}}>{titleArr[i]}</CusBaseText>
                </View>
            )
        }
        return views.length <= 0 ? <View ref={(c) => this._HeaderView = c}></View> : <View ref={(c) => this._HeaderView = c} style = {styles.List_HeaderView}>{views}</View>
    }


    //开奖列表渲染Item
    _renderItem = (item) => {

        //背景颜色
        let cellBgColor = item.index % 2 == 0 ? '#f1f2f3' : '#fff';
        let ballsArr = item.item.value.balls ? item.item.value.balls.split('+') : [];
        let isOpen = item.item.value.balls && item.item.value.balls.length > 3;
        var flexArr = [], cellTitArr = [];  // flex占大小，显示的title
        let openQiShu = `${item.item.value.qishu}`;
        if (openQiShu != null && openQiShu.length > 1) {
            openQiShu = openQiShu.substr(openQiShu.length - 4, 4);
        }

        //快三和3D的开奖列表
        if (this.state.js_tag == 'k3' || this.state.js_tag == 'pcdd') {

            let sum = this.state.js_tag == 'pcdd' ? ballsArr[ballsArr.length - 1]: this._sumResults(ballsArr);
            flexArr = [0.3, 0.3, 0.13, 0.13, 0.13];
            cellTitArr = [
                openQiShu,
                !isOpen ? '正在开奖' : item.item.value.balls,
                !isOpen ? '-' : (this.state.js_tag == 'pcdd' ? GetBallStatus.getPcddColorToBallStr(sum, true) : sum),
                !isOpen ? '-' : `${sum <= (this.state.js_tag == 'pcdd' ? 13 : 10) ? '小' : '大'}`,
                !isOpen ? '-' : `${sum % 2 == 0 ? '双' : '单'}`,
            ];
            // pcdd:14- 27大，0-13小； k3:11-18大，3-10小
            if (this.state.js_tag == 'pcdd') { // 插入 ’+‘ ’=‘
                ballsArr.splice(1, 0, '+');
                ballsArr.splice(3, 0, '+');
                ballsArr.splice(5, 0, '=');
            }
            let pcddNewBalls = ballsArr.join(' ');

            var k3CellViews = [];
            for (let i = 0; i < flexArr.length; i++) {

                let cellTitleColor = 'rgba(0,0,0,0)';  //大小，单双文字颜色做特殊处理
                if (i >= flexArr.length - 2) {
                    if (cellTitArr[i] == '大' || cellTitArr[i] == '单') {
                        cellTitleColor = '#e60012';
                    } else {
                        cellTitleColor = '#009944';
                    }
                }

                k3CellViews.push(
                    <View key={i} style={{flex: flexArr[i], alignItems: 'center', justifyContent: 'center'}}>
                        {i == 1 && isOpen
                            ?(this.state.js_tag == 'k3'
                                    ?<View style={{ flexDirection: 'row', marginTop:3 }}>
                                        <Image style={{width: 25, height: 25}} source={k3Image[ballsArr[0] - 1]}/>
                                        <Image style={{width: 25, height: 25, marginLeft: 5}} source={k3Image[ballsArr[1] - 1]}/>
                                        <Image style={{width: 25, height: 25, marginLeft: 5}} source={k3Image[ballsArr[2] - 1]}/>
                                    </View>
                                    :<CusBaseText style={{ fontSize: Adaption.Font(15, 12), textAlign: 'center', color: '#eb3349' }}>{pcddNewBalls}</CusBaseText>
                            )
                            : i >= flexArr.length - 2 
                                ? <View style={{ height: 22, width: 22, borderRadius:2, alignItems: 'center', justifyContent: 'center', backgroundColor: cellTitleColor }}>
                                    <CusBaseText style={{ fontSize: Adaption.Font(14, 12), textAlign: 'center', color: '#fff' }}>
                                        {cellTitArr[i]}
                                    </CusBaseText>
                                </View>
                                : <CusBaseText style={{ fontSize: Adaption.Font(14, 12), textAlign: 'center', color: wenZiColor }}>
                                    {cellTitArr[i]}
                                </CusBaseText>
                        }
                    </View>
                );
            }
            return <View style={{flexDirection: 'row', height: 30, width: SCREEN_WIDTH, backgroundColor: cellBgColor}}>{k3CellViews}</View>

        } else if (this.state.js_tag == '3d') {

            let sum = this._sumResults(ballsArr); // 总和
            let sortAr = this._sort(item.item.value.balls.split('+')); // 排序
            let maxResult = parseInt(sortAr[sortAr.length - 1]) - parseInt(sortAr[0]);

            flexArr = [0.16, 0.2, 0.11, 0.11, 0.14, 0.14, 0.14];
            cellTitArr = [openQiShu, item.item.value.balls.replace(/\+/g,','), sum, maxResult];

            for (ba of ballsArr) {
                let ballStatus = `${parseInt(ba) < 5 ? '小' : '大'}${parseInt(ba) % 2 == 0 ? '双' : '单'}`;
                cellTitArr.push(ballStatus);
            }
            if (!isOpen) {
                cellTitArr = [openQiShu, '正在开奖', '-', '-', '-', '-', '-'];
            }

        } else if (this.state.js_tag == 'lhc') {

            let teMa = ballsArr[ballsArr.length - 1];
            let teXiaoStr = GetBallStatus.getShengxiaoToBallStr(teMa);
            // ballsArr.splice(ballsArr.length - 1, 0, '+'); // 插入一个 ’+‘ 号
            ballsArr[ballsArr.length - 2] = `${ballsArr[ballsArr.length - 2]}+${ballsArr[ballsArr.length - 1]}`;
            ballsArr.splice(ballsArr.length - 1, 1);

            flexArr = [0.13, 0.45, 0.11, 0.1, 0.1, 0.11];
            cellTitArr = [
                openQiShu,
                !isOpen ? '正在开奖' : ballsArr.join(','),
                !isOpen ? '-' : GetBallStatus.getKindToShengxiao(teXiaoStr),
                !isOpen ? '-' :  parseInt(teMa) > 24 ? '大' : '小',
                !isOpen ? '-' :  parseInt(teMa) % 2 == 0 ? '双' : '单',
                !isOpen ? '-' :  GetBallStatus.getLhcColorToBallStr(teMa, true),
            ];

            var lhcCellViews = [];
            for (let i = 0; i < flexArr.length; i++) {
                lhcCellViews.push(
                    <View key={i} style={{flex: flexArr[i], alignItems: 'center', justifyContent: 'center'}}>
                        {i == 1 && isOpen
                            ? this._lhcCellOpenBallsView(cellTitArr[i])
                            : <CusBaseText style={{ fontSize: Adaption.Font(14, 12), textAlign: 'center', color: wenZiColor }}>{cellTitArr[i]}</CusBaseText>
                        }
                    </View>
                )
            }
            return <View style={{flexDirection: 'row', height: 45, width: SCREEN_WIDTH, backgroundColor: cellBgColor}}>{lhcCellViews}</View>

        } else if (this.state.js_tag == 'ssc') {

            flexArr = [0.14, 0.19, 0.11, 0.11, 0.11, 0.11, 0.11, 0.12];
            cellTitArr = [
                openQiShu,
                !isOpen ? '正在开奖' : item.item.value.balls.replace(/\+/g, ','), //替换字符串的方法
            ];

            if (isOpen) {
                for (ba of ballsArr) {
                    let ball = parseInt(ba);
                    let ballStatus = `${ball <= 4 ? '小' : '大'}${ball % 2 == 0 ? '双' : '单'}`;
                    cellTitArr.push(ballStatus);
                }
                cellTitArr.push(this._sscQianSanStatus([parseInt(ballsArr[2]), parseInt(ballsArr[3]), parseInt(ballsArr[4])]));
            } else {
                cellTitArr = [...cellTitArr, ...['-', '-', '-', '-', '-', '-']]
            }

        } else if (this.state.js_tag == '11x5') {

            let sortAr = this._sort(ballsArr); // 排序
            let sum = this._sumResults(ballsArr); // 总和

            let lastOpenBallStr = item.index >= this.state.openListArr.length - 1 ? '' : this.state.openListArr[item.index + 1].value.balls; // 拿到上一期的号码。
            let lastOpenBallArr = lastOpenBallStr.split('+');
            var repeatCount = 0;
            for (let n = 0; n < lastOpenBallArr.length; n++) {
                let b1 = lastOpenBallArr[n];
                if (ballsArr.includes(b1)) {
                    repeatCount += 1;
                }
            }

            flexArr = [0.25, 0.3, 0.13, 0.17, 0.15];
            cellTitArr = [
                openQiShu,
                !isOpen ? '正在开奖' : item.item.value.balls.replace(/\+/g, ','), // .replace(/ /g, ', '), //替换所有空格为逗号
                !isOpen ? '-' : parseInt(sortAr[sortAr.length - 1]) - parseInt(sortAr[0]),
                !isOpen ? '-' : item.index >= this.state.openListArr.length - 1 ? '-' : repeatCount, // 上一期与当前一期有多少个重号的。
                !isOpen ? '-   -' : `${sum < 30 ? '小' : '大'}   ${sum % 2 == 0 ? '双' : '单'}`,
            ];

        } else if (this.state.js_tag == 'pk10') {

            let sum = isOpen ? this._sumResults([ballsArr[0], ballsArr[1]]) : 0; // 总和

            flexArr = [0.2, 0.6, 0.2];
            let qishus = openQiShu;
            let dsStr = sum == 11 ? '和' : sum % 2 == 0 ? '双' : '单';
            let dxStr = sum >= 14 ? '大' : sum >= 9 ? '中' : '小';
            cellTitArr = [
                qishus.length > 6 ? qishus.substr(qishus.length - 6, 6): qishus,
                !isOpen ? '正在开奖' : item.item.value.balls.replace(/\+/g, ','),
                !isOpen ? '-  -  -' : `${sum}  ${dxStr}  ${dsStr}`,
            ];
        }
        else if (this.state.js_tag == 'qxc'){
            flexArr = [0.16, 0.2, 0.11, 0.11, 0.11, 0.11, 0.2];

            cellTitArr = [
                openQiShu,
                !isOpen ? '正在开奖' : item.item.value.balls.replace(/\+/g, ','), //替换字符串的方法
            ];

            let sumBall = 0;  //总和值
            let danShuang = '';  //单双
            let daxiao = '';  //大小

            if (isOpen) {
                for (ba of ballsArr) {
                    let ball = parseInt(ba);
                    sumBall += ball;
                    let ballStatus = `${ball <= 4 ? '小' : '大'}${ball % 2 == 0 ? '双' : '单'}`;
                    cellTitArr.push(ballStatus);
                }

                danShuang = sumBall % 2 == 0 ? '双' : '单';
                daxiao = sumBall > 17 ? '大' : '小';

                cellTitArr.push(`${sumBall} ${daxiao} ${danShuang}`);

            } else {
                cellTitArr = [...cellTitArr, ...['-', '-', '-', '-', '-', '-']]
            }
        }
        else if (this.state.js_tag == 'xypk'){

            flexArr = [0.3, 0.4, 0.3];
            let pokerImg1 = '';  //扑克1的图片路径
            let pokerImg2 = '';  //扑克2的图片路径
            let pokerImg3 = '';  //扑克3的图片路径
            for (let i = 0 ; i < ballsArr.length; i++){

                let balls =  parseInt(ballsArr[i], 10);
                let pokers = parseInt((balls/4) + 1);
                let pokerColorIdx = (balls%4);
                let pokerArr = [];

                switch (pokers){
                    case 1:
                        pokerArr = XYPokerA;
                        break;
                    case 2:
                        pokerArr = XYPoker2;
                        break;
                    case 3:
                        pokerArr = XYPoker3;
                        break;
                    case 4:
                        pokerArr = XYPoker4;
                        break;
                    case 5:
                        pokerArr = XYPoker5;
                        break;
                    case 6:
                        pokerArr = XYPoker6;
                        break;
                    case 7:
                        pokerArr = XYPoker7;
                        break;
                    case 8:
                        pokerArr = XYPoker8;
                        break;
                    case 9:
                        pokerArr = XYPoker9;
                        break;
                    case 10:
                        pokerArr = XYPoker10;
                        break;
                    case 11:
                        pokerArr = XYPokerJ;
                        break;
                    case 12:
                        pokerArr = XYPokerQ;
                        break;
                    case 13:
                        pokerArr = XYPokerK;
                        break;
                    default:
                        break;
                }

                switch (i){
                    case 0:
                        pokerImg1 = pokerArr[pokerColorIdx];
                        break;
                    case 1:
                        pokerImg2 = pokerArr[pokerColorIdx];
                        break;
                    case 2:
                        pokerImg3 = pokerArr[pokerColorIdx];
                        break;
                    default:
                        break;
                }
            }

            let ballStatues = this._pokerNumStatus(ballsArr);

            cellTitArr = [openQiShu,
                !isOpen ? '正在开奖' : '',
                !isOpen ? '- - -' : ballStatues];

            let cellViews = [];
            for (let i = 0; i < flexArr.length; i++) {

                if (i == 1){

                    if (!isOpen){
                        cellViews.push(
                            <View key={i} style={{flex: flexArr[i], alignItems: 'center', justifyContent: 'center'}}>
                                <CusBaseText style={{ fontSize: Adaption.Font(14, 12), textAlign: 'center',color: i == 1 ? '#eb3349' : wenZiColor }}>
                                    {cellTitArr[i]}
                                </CusBaseText>
                            </View>
                        );
                    }
                    else {
                        cellViews.push(<View key = {i} style = {{flex: flexArr[i], flexDirection:'row', alignItems: 'center', justifyContent: 'center'}}>
                            <Image style = {{width:25,height:25,resizeMode:'contain'}} source = {pokerImg1}/>
                            <Image style = {{width:25,height:25,resizeMode:'contain'}} source = {pokerImg2}/>
                            <Image style = {{width:25,height:25,resizeMode:'contain'}} source = {pokerImg3}/>
                        </View>)
                    }
                }
                else  {

                    cellViews.push(
                        <View key={i} style={{flex: flexArr[i], alignItems: 'center', justifyContent: 'center'}}>
                            <CusBaseText style={{ fontSize: Adaption.Font(14, 12), textAlign: 'center',color: i == 1 ? '#eb3349' : wenZiColor }}>
                                {cellTitArr[i]}
                            </CusBaseText>
                        </View>
                    );
                }
            }

            return <View style={{flexDirection: 'row', height: 30,  width: SCREEN_WIDTH, backgroundColor: cellBgColor}}>{cellViews}</View>
        }
        else if (this.state.js_tag == 'xync'){
            flexArr = [0.15, 0.48, 0.37];

            let ballSum = 0;  //总和
            let ballDS = '';  //单双
            let ballTail = ''; // 尾小
            let longhu = '';  //龙虎
            let sumds = '';  //总和的大小

            for (let ball of ballsArr){
                ballSum += parseInt(ball, 10);
            }

            ballDS = ballSum % 2 == 0 ? '双' : '单';
            ballTail = ballSum % 10 > 4 ? '尾大' : '尾小';  //总和的个位数的大小
            longhu = parseInt(ballsArr[0],10) > parseInt(ballsArr[ballsArr.length - 1],10) ? '龙' : '虎';
            sumds = ballSum > 84 ? '大' : '小';
            let balldesc = `${ballSum} ${sumds} ${ballDS} ${ballTail} ${longhu}`;

            cellTitArr = [openQiShu,
                !isOpen ? '正在开奖...' : '',
                !isOpen ?  '- - - ' : balldesc];

            let cellViews = [];
            for (let i = 0; i < flexArr.length; i++) {

                if (i == 1){

                    if (!isOpen){
                        cellViews.push(
                            <View key={i} style={{flex: flexArr[i], alignItems: 'center', justifyContent: 'center'}}>
                                <CusBaseText style={{ fontSize: Adaption.Font(14, 12), textAlign: 'center',color: i == 1 ? '#eb3349' : wenZiColor }}>
                                    {cellTitArr[i]}
                                </CusBaseText>
                            </View>
                        );
                    }
                    else {

                        cellViews.push(<View key={i}
                                             style={{flex: flexArr[i], flexDirection: 'row', alignItems: 'center'}}>
                            <Image style={styles.XYNCImageStyle} source={XYNCImageArr[ballsArr[0] - 1]}/>
                            <Image style={styles.XYNCImageStyle} source={XYNCImageArr[ballsArr[1] - 1]}/>
                            <Image style={styles.XYNCImageStyle} source={XYNCImageArr[ballsArr[2] - 1]}/>
                            <Image style={styles.XYNCImageStyle} source={XYNCImageArr[ballsArr[3] - 1]}/>
                            <Image style={styles.XYNCImageStyle} source={XYNCImageArr[ballsArr[4] - 1]}/>
                            <Image style={styles.XYNCImageStyle} source={XYNCImageArr[ballsArr[5] - 1]}/>
                            <Image style={styles.XYNCImageStyle} source={XYNCImageArr[ballsArr[6] - 1]}/>
                            <Image style={styles.XYNCImageStyle} source={XYNCImageArr[ballsArr[7] - 1]}/>
                            <Image style={styles.XYNCImageStyle} source={XYNCImageArr[ballsArr[8] - 1]}/>
                        </View>)
                    }
                }
                else  {

                    cellViews.push(
                        <View key={i} style={{flex: flexArr[i], alignItems: 'center', justifyContent: 'center'}}>
                            <CusBaseText style={{ fontSize: Adaption.Font(14, 12), textAlign: 'center',color: i == 1 ? '#eb3349' : wenZiColor }}>
                                {cellTitArr[i]}
                            </CusBaseText>
                        </View>
                    );
                }
            }

            return <View style={{flexDirection: 'row', height: 30,  width: SCREEN_WIDTH, backgroundColor: cellBgColor}}>{cellViews}</View>
        }

        var cellViews = [];
        for (let i = 0; i < flexArr.length; i++) {

            cellViews.push(
                <View key={i} style={{flex: flexArr[i], alignItems: 'center', justifyContent: 'center'}}>
                    <CusBaseText style={{ fontSize: Adaption.Font(14, 12), textAlign: 'center',color: i == 1 ? '#eb3349' : wenZiColor }}>
                        {cellTitArr[i]}
                    </CusBaseText>
                </View>
            );

        }
        return <View style={{flexDirection: 'row', height: this.state.js_tag == 'lhc' ? 45 : 30,  width: SCREEN_WIDTH, backgroundColor: cellBgColor}}>{cellViews}</View>

    }

    // LHC开奖号码的文本显示
    _lhcCellOpenBallsView(balls) {
        let ballAr = balls.split(/[\,\+]/);
        var ballViews = [];
        for (i in ballAr) {
            let ba = ballAr[i];
            let color = GetBallStatus.getLhcColorToBallStr(ba);
            ballViews.push(
                <CusBaseText key={i} style={{ color: color }}>{`${ba}`}<CusBaseText key={i*20} style={{ color: '#707070' }}>{i == ballAr.length - 2 ? ' + ': i == ballAr.length - 1 ? '' : ','}</CusBaseText></CusBaseText>
            )
        }
        return <View>
                    <CusBaseText style={{fontSize: Adaption.Font(14, 12), textAlign: 'center' }}>
                        {ballViews}
                    </CusBaseText>
                    <CusBaseText style={{fontSize: Adaption.Font(14, 12), textAlign: 'center', color:wenZiColor, marginTop:4}}>
                        {this._getItemShengXiaoText(ballAr)}
                    </CusBaseText>
               </View>

    }

    //扑克牌开奖号码状态
    _pokerNumStatus(ballsArr){

        let ballStatues = '';  //开奖后的状态
        let pokerArr = [];  //扑克解析后数组

        if (ballsArr.length == 3){ //开奖号码长度为3时才能进来

            //浅拷贝
            let temArray = [];
            ballsArr.map(dict => {
                temArray.push(dict)
            })

            //对数组进行从小到大的排序
            temArray = this._sort(temArray);

            //开奖号码转成扑克和花色
            for (let i = 0; i < temArray.length; i++){

                let balls = parseInt(temArray[i], 10);
                let pokers = parseInt((balls/4) + 1);
                let pokerColorIdx = (balls%4);
                pokerArr.push({pokerNum:pokers, pokerIdx:pokerColorIdx});
            }

            //特殊的判断,A,Q,K也是顺子
            if (pokerArr[0].pokerNum == 1 && pokerArr[1].pokerNum == 12 && pokerArr[2].pokerNum == 13){  //顺子的状态

                //ballsArr = ['51', '47', '3']; Q,K,A,同花顺

                if (pokerArr[0].pokerIdx == pokerArr[1].pokerIdx && pokerArr[1].pokerIdx == pokerArr[2].pokerIdx){
                    ballStatues = '同花顺';
                }
                else {
                    ballStatues = '顺子';
                }
            }
            else {

                //非Q,K,A的判断

                if (pokerArr[1].pokerNum == pokerArr[0].pokerNum + 1 && pokerArr[2].pokerNum == pokerArr[1].pokerNum + 1 && pokerArr[0].pokerIdx == pokerArr[1].pokerIdx && pokerArr[1].pokerIdx == pokerArr[2].pokerIdx){
                    ballStatues = '同花顺';
                }
                else if (pokerArr[0].pokerNum == pokerArr[1].pokerNum && pokerArr[1].pokerNum == pokerArr[2].pokerNum) {
                    ballStatues = '豹子';
                }
                else if (pokerArr[0].pokerIdx == pokerArr[1].pokerIdx  && pokerArr[1].pokerIdx == pokerArr[2].pokerIdx){
                    ballStatues = '同花';
                }
                else if (pokerArr[1].pokerNum == pokerArr[0].pokerNum + 1 && pokerArr[2].pokerNum == pokerArr[1].pokerNum + 1){
                    ballStatues = '顺子';
                }
                else if (pokerArr[0].pokerNum == pokerArr[1].pokerNum || pokerArr[0].pokerNum == pokerArr[2].pokerNum || pokerArr[1].pokerNum == pokerArr[2].pokerNum){
                    ballStatues = '对子';
                }
                else if (pokerArr[0].pokerNum != pokerArr[1].pokerNum && pokerArr[0].pokerNum != pokerArr[2].pokerNum && pokerArr[1].pokerNum != pokerArr[2].pokerNum){
                    ballStatues = '单张';
                }
            }
        }

        return ballStatues;
    }

    // SSC前三号码状态
    _sscQianSanStatus(ballsAr) {
        ballsAr = this._sort(ballsAr); // 排序

        let status = '==';
        if (ballsAr[0] == ballsAr[1]) {
            if (ballsAr[1] == ballsAr[2]) {
                status = '豹子';
            } else {
                status = '组三';
            }
        } else if (ballsAr[1] == ballsAr[2]) {
            status = '组三';
        } else {
            status = '组六';
            if (this._sumResults(ballsAr) == ballsAr[0] * 3 + 3) {
                status = '顺子';
            }
        }
        return status;
    }

    // 数组排序
    _sort(ballsAr) {
        for (let a = 0; a < ballsAr.length; a++) {
            for (let b = a + 1; b < ballsAr.length; b++) {
                if (parseInt(ballsAr[a]) > parseInt(ballsAr[b])) {
                    let temp = ballsAr[a];
                    ballsAr[a] = ballsAr[b];
                    ballsAr[b] = temp;
                }
            }
        }
        return ballsAr;
    }

    // 计算数组里 值的总和
    _sumResults(ballsAr) {
        let sumBall = 0;
        for (let a = 0; a < ballsAr.length; a++) {
            let ball = parseInt(ballsAr[a]);
            sumBall += ball;
        }
        return sumBall;
    }

    // 返回头部六合彩生肖属性
    _getShengxiaoText(lhcballsArr){

        let lhcBallText = '';

        if (lhcballsArr.length != 0){

            for (let i = 0; i < lhcballsArr.length; i++){
                let ball = lhcballsArr[i];

                if (i == lhcballsArr.length - 1){
                    lhcBallText += GetBallStatus.getShengxiaoToBallStr(ball) + '      ';
                }
                else {
                    lhcBallText += GetBallStatus.getShengxiaoToBallStr(ball) + '    ';
                }
            }
        }

        return lhcBallText;
    }

    //ItemList六合彩生肖
    _getItemShengXiaoText(lhcballsArr){

        let lhcBallText = '';

        if (lhcballsArr.length != 0){

            for (let i = 0; i < lhcballsArr.length; i++){
                let ball = lhcballsArr[i];

                if (i == lhcballsArr.length - 1){
                    lhcBallText += GetBallStatus.getShengxiaoToBallStr(ball) + ' ';
                }
                else {
                    lhcBallText += GetBallStatus.getShengxiaoToBallStr(ball) + '  ';
                }
            }
        }

        return lhcBallText;
    }

    //点击展开历史开奖列表
    _showLoList(isShow, isAnimated){

        this.setState({
            isRowList:isShow,
        })

        let rowHeight = 30;

        //展开列表动态改变控件高度,没有数据时不能展开
        if (isShow == true && this.state.openListArr.length != 0) {


            this._openHeaderInfo.setNativeProps({
                style: {
                    height: 110 + (this.state.openListArr.length + 1) * rowHeight,
                }
            })

            this._ListContent.setNativeProps({
                style: {
                    height: (this.state.openListArr.length + 1) * rowHeight,
                }
            })


            //使用LayoutAnimation动画实现缓慢效果
            LayoutAnimation.configureNext(CustomLayoutAnimation);
        }
        else {

            //收起列表高度回到初始状态

            this._openHeaderInfo.setNativeProps({
                style: {
                    height: this.state.js_tag == 'lhc' ? 125 : 110,
                }
            })

            this._ListContent.setNativeProps({
                style: {
                    height: 0,
                }
            })

            this._HeaderView.setNativeProps({
                styles: {
                    height: 0,
                }
            })

            if (isAnimated == true){
                //使用LayoutAnimation动画实现缓慢效果
                LayoutAnimation.configureNext(CustomLayoutAnimation);
            }
        }
    }

    componentDidMount(){

        this._setTimeInval();


        this.setRefresh();
        //接受点击购物车的通知，回调当前时间
        this.subscription = PushNotification.addListener('DidGoToShopCarDetailVC', ()=> {

            this.props.getCurrentTime ?  this.props.getCurrentTime(this.state.nextJieZhi) : null;
            // this.props.getCurrentFengPan ? this.props.getCurrentFengPan(this.state.nextFengPan) : null;

        });

        AppState.addEventListener('change', (appState)=> {

            //活跃状态重新刷数据
            if (appState == 'active'){
                this.isActiveFromBack = true;
                this._fetchCountDownData(this.state.tag);
                this._fetchOpenInfoData(this.state.tag);
            }
        });

        AppState.addEventListener('memoryWarning', () => {
            //this.setState({memoryWarnings: this.state.memoryWarnings + 1});
        });

    }

    //移除通知
    componentWillUnmount(){

        this.timer && clearInterval(this.timer);
        this.timerRefresh && clearTimeout(this.timerRefresh);
        if (typeof(this.subscription) == 'object'){
            this.subscription && this.subscription.remove();
        }

        AppState.removeEventListener('change');
        AppState.removeEventListener('memoryWarning');


        //若组件被卸载，刷新state则直接返回，可以解决警告(倒计时组件可能造成的警告)
        this.setState = (state,callback) => {
            return;
        }
    }

    //自定义随机刷新球频率
    setRefresh(){
        if (this.timerRefresh ) {

            return;
        }

        this.timerRefresh = setInterval(()=>{

            global.random = true;
            this.setState({
                random:true,
            });
        },300)
    }

    _setTimeInval(){

        //重新加载数据

        if (this.timer) {
            return;
        }


        this.timer = setInterval(() => {

            if (this.state.nextJieZhi == 0 && this.state.nextQiShu != 0 && this.state.prevQiShu != 0) {

                this.currentCountDownIndex += 1;

                if (this.currentCountDownIndex < this.state.nextCountDownList.length) {

                    let nextQi = this.state.nextCountDownList[this.currentCountDownIndex].qishu;
                    this.state.prevQiShu = this.state.nextQiShu;  //如果到下一期。则赋值给上一期数
                    this.state.nextQiShu = nextQi;
                    this.state.openBallsArr = [];
                    global.CurrentQiShu = nextQi;
                    this._initBallDescView([]);
                }
                 PushNotification.emit('BuyLotDetailCountDown');  //倒计时结束发出通知
            }

            // 已封盘 倒计时数组已经用到最后一期了。请先去请求了。不等到最后一个数据用完才请求, this.state.nextQiShu != 0 判断是否请求到了期数。如果没有期数会一直请求。挡住重复请求
            if (this.state.nextJieZhi == 0 && this.currentCountDownIndex >= this.state.nextCountDownList.length - 2 && this.state.nextQiShu != 0) {
                if (this.isRequsetCplogList == true) {
                    this._fetchCountDownData(this.state.tag);
                    this.isRequsetCplogList = false;
                }
            }

             global.random = true;

            let currOpen = 0, currStop = 0;

            if (this.currentCountDownIndex < this.state.nextCountDownList.length) {
                // 倒计时时间直接用opentime 减 手机系统时间。
                currOpen = this.state.nextCountDownList[this.currentCountDownIndex].opentime - (this.state.nextCountDownList[this.currentCountDownIndex].server_time - this.finishTime)  - Math.round(new Date() / 1000);
                //currStop = this.state.nextCountDownList[this.currentCountDownIndex].stoptime - (this.state.nextCountDownList[this.currentCountDownIndex].server_time - this.finishTime)  - Math.round(new Date() / 1000);
                global.CurrentQiShu = this.state.nextCountDownList[this.currentCountDownIndex].qishu; // 直接从当前倒计时数组里面拿吧。 只要倒计时正确，这个期数敢错 我也无奈了
            }

            this.state.nextJieZhi = currOpen;
            //this.state.nextFengPan = currStop;

        }, 332);
    }

    _changeTime(totalTime) {

        if (isNaN(totalTime) || totalTime <= 0) {
            if (totalTime < 0) {
                console.log('nextJieZhi 小于0 == ', totalTime);
            }
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

            return `${hour}:${min}:${seconds}`;  //格式化输出
        }
    }

    //获取历史开奖数据接口
    _fetchOpenInfoData = (tag) =>{

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

                        //必须开奖后才会去刷新用户余额,有时候开奖号码为['']的数组
                        if (splitArr.length > 1){

                            //开奖后刷新金额
                            this._refreshUserLessMoney();
                        }

                        this.setState({
                            openBallsArr:splitArr,        //开奖号码
                            prevQiShu:prevModel.value.qishu != '' ? (prevModel.value.qishu):'',          //上一期期数
                            openListArr:prevList,
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

                        // 倒计时时间直接用opentime 减 手机系统时间。
                        let currOpen = nextModel.opentime - (nextModel.server_time - this.finishTime) - Math.round(new Date() / 1000);
                        //let currStop = nextModel.stoptime - (nextModel.server_time - this.finishTime) - Math.round(new Date() / 1000);
                        this.currentCountDownIndex = 0;//当前下标
                        this.props.againRequestTime ? this.props.againRequestTime(this.finishTime, nextList) : null;
                        console.log('请求的nextList。。。', nextList);
                        global.CurrentQiShu = nextModel.qishu;
                        
                        this.state.nextCountDownList = nextList;
                        this.state.nextQiShu = nextModel.qishu;
                        this.state.nextJieZhi = currOpen;
                        //this.state.nextFengPan = currStop;
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


    render() {

        return (
            <View style = {{backgroundColor:'#eeeeee', height: this.state.js_tag == 'lhc' ? 125 : 110, width:SCREEN_WIDTH}} ref={(c) => this._openHeaderInfo = c}>

                {/*上一期开奖结果和值啥的*/}
                <View style = {{flexDirection:'row', height:35}}>
                    <View style = {{flex:0.27, justifyContent:'center'}}>
                        <CusBaseText style = {{fontSize: Adaption.Font(16,13), color:wenZiColor, marginLeft:10}}>
                            第<CusBaseText style = {{ color:'#eb3349'}}>{this.state.prevQiShu != 0 ? `${this.state.prevQiShu}`.substr(`${this.state.prevQiShu}`.length - 4, 4) : '- -'}</CusBaseText>期
                        </CusBaseText>
                    </View>
                    <View style = {{flex:0.73, justifyContent:'center'}}>
                        { this._initBallDescView(this.state.openBallsArr) }
                    </View>
                </View>

                {/*上一期开奖结果 和历史开奖按钮*/}
                <View style = {{flexDirection:'row', height: this.state.js_tag == 'lhc' ? 50 : 35, alignItems:'center'}}>

                    {/*开奖球*/}
                    <View style = {{flex:0.75}}>
                    <NewOpenBallsView ballsArr={this.state.openBallsArr} jstag={this.state.js_tag}  status = {this.state.random}/>
                    {this.state.js_tag == 'lhc' ?  <CusBaseText style = {{marginLeft:10, marginTop:6, fontSize:Adaption.Font(17,14), color:wenZiColor, textAlign:'left'}}>
                        {this._getShengxiaoText(this.state.openBallsArr)}
                    </CusBaseText> : null}
                    </View>

                    <TouchableOpacity style = {{flex:0.25, alignItems:'center', flexDirection:'row', height:35}} activeOpacity={0.8}
                                      onPress = {() => {
                                          
                                          if (this.historyOpenWating == false){

                                              this.historyOpenWating = true;

                                              if (this.state.openListArr.length != 0){
                                                  this._showLoList(!this.state.isRowList, true);
                                              }

                                              setTimeout(()=> {this.historyOpenWating = false}, 1000);
                                          }
                                      }}>
                        <CusBaseText style = {{fontSize:Adaption.Font(16,13), color:wenZiColor}}>
                            历史开奖
                        </CusBaseText>
                        <Image
                            style = {{width:15, height:10}}
                            source={this.state.isRowList ? (require('../img/ic_buyLot_upRow.png')) : (require('../img/ic_buyLot_downRow.png')) }>
                        </Image>
                    </TouchableOpacity>

                </View>

                <FlatList
                    ref={(c) => this._ListContent = c}
                    style = {{width:SCREEN_WIDTH, height:0}}
                    renderItem={this._renderItem}
                    data={this.state.openListArr.length != 0 ? this.state.openListArr : []}
                    ListHeaderComponent={() => this._listHeaderComponent()}
                    automaticallyAdjustContentInsets={false}
                    alwaysBounceHorizontal = {false}
                />

                {/*下面倒计时*/}
                <View style = {{height: 40, flexDirection:'row'}}>

                    <View style = {{flex:0.55, flexDirection:'row', flexDirection:'row', alignItems:'center'}}>
                        <CusBaseText style = {{fontSize:Adaption.Font(15), color:wenZiColor, marginLeft:10}}>
                            {`第${this.state.nextQiShu ? `${this.state.nextQiShu}`.substr(`${this.state.nextQiShu}`.length - 4, 4) : '- -'}期${this.state.nextFengPan < 1 ? '已封盘' : '截止时间'}: `}
                        </CusBaseText>
                        <CusBaseText style = {{fontSize:Adaption.Font(16), color:'#eb3349'}}>
                            {this._changeTime(this.state.nextJieZhi)}
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
                <View style={{height: 1, width: SCREEN_WIDTH, backgroundColor:'#ddd'}} />
            </View>
        )
    }

}

const styles = StyleSheet.create({

    // 开奖列表头部视图样式（标题）
    List_HeaderView:{
        flexDirection:'row',
        height:24,
        width:SCREEN_WIDTH,
        backgroundColor:'#ffffff',
        alignItems:'center',
    },

    //幸运农场图片样式
    XYNCImageStyle:{
        width: Adaption.Width(25),
        height: Adaption.Width(26),
    }

});

export  default  NewOpenInfoView;
