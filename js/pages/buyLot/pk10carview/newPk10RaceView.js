/**
 Author Ward
 Created by on 2018-08-14
 pk10牛牛游戏封装视图
 **/

import React, { Component } from 'react';

import {
   View,
   ScrollView,
} from 'react-native';

import RaceCarView from './viewClass/pk10Class/saicheRoot';
import Pk10NiuNiuHeanderView from './viewClass/pk10Class/Pk10NiuNiuOpenInfoView';
import PokerAgenBtn from './viewClass/pk10Class/PokerAgenleBtn';
import PokerXianErBtn from './viewClass/pk10Class/PokerXianErBtn';
import PokerXianSiBtn from './viewClass/pk10Class/PokerXianSiBtn';
import PokerZhuangBtn from './viewClass/pk10Class/PokerZhuangBtn';
import PokerXianYiBtn from './viewClass/pk10Class/PokerXianYiBtn';
import PokerXianWuBtn from './viewClass/pk10Class/PokerXianWuBtn';
import Pk10NiuNiuBottom from './viewClass/pk10Class/PK10NiuNiuBottomView';

export default class newPk10RaceView extends Component{

    constructor(props){
        super(props);

        this.state = ({
            isCompleteRace:false,  //是否完成比赛
            currentZhuShu:0,  //当前选择的号码注数
            selectBallArr:[], //选择号码的数组
            openListArr: props.prevList,  //开奖信息数组
            tag:props.tag,
            js_tag:props.js_tag,
            nextCountDownList: props.nextTimeList, //开奖数组10条
            isClearAllBall:false,  //是否清空号码
            currentPlayDataArr:[],  //当前玩法配置说明数组
            currentplayName:'',  //存放当前玩法name
            peilvDataArr:[],   //存放当前赔率数组
            ballsArcdomList:[], //存放机选的号码数组
            openBallStatuesArr:[], //存放开奖号码状态的数组 庄家-闲五的状态
            openBallsArr:[],  //开奖号码,用于展示牌的数组
            openWinStatuesArr:[], //庄家与闲家PK的输赢状态数组
            pickerBallsDesc:'', //底部工具栏显示的号码选择描述
            pickerBallsPeilv:'0', //盈利的总赔率
            finishTime:0, //请求回来的数据
            singlePrice:'',//当前底部工具栏的输入金额
        })
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.finishTime != 0 && this.state.finishTime == 0){
            this.setState({finishTime:nextProps.finishTime});
        }

        if (nextProps.prevList && this.state.openListArr.length <= 0){

            this.setState({openListArr:nextProps.prevList});
        }

        if (nextProps.nextTimeList && this.state.nextCountDownList.length <= 0){

            this.setState({nextCountDownList:nextProps.nextTimeList});
        }

        if (nextProps.peilvDataArr.length != 0 && this.state.peilvDataArr.length == 0){

            let peilvArr = nextProps.peilvDataArr[0].peilv.split('|');
            let ballArr = ['闲一', '闲二', '闲三', '闲四', '闲五'];
            let arcdomArr = []; //机选号码数组

            for (let i = 0; i < ballArr.length; i++){
                let ballObject = {ball:ballArr[i], peilv:peilvArr[i]};
                arcdomArr.push(ballObject);
            }

            this.setState({peilvDataArr:peilvArr, ballsArcdomList:arcdomArr});
        }

        if (nextProps.wanfaDataArr.length != 0 && this.state.currentPlayDataArr.length == 0){

            let playName = nextProps.wanfaDataArr[0] ? nextProps.wanfaDataArr[0].submenu[0].playlist[0].playname : '';
            this.setState({currentplayName:playName, currentPlayDataArr:nextProps.wanfaDataArr});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {

        let aaa = nextProps.finishTime != 0 && this.state.finishTime == 0
        let bbb = nextProps.prevList && this.state.openListArr.length <= 0
        let ccc = nextProps.nextTimeList && this.state.nextCountDownList.length <= 0
        let ddd = nextProps.peilvDataArr.length != 0 && this.state.peilvDataArr.length == 0
        let eee = nextProps.wanfaDataArr.length != 0 && this.state.currentPlayDataArr.length == 0;
        let fff = nextState.openBallsArr != this.state.openBallsArr;  //开奖号码不同时
        let ggg = nextState.isCompleteRace != this.state.isCompleteRace;  //比赛完成的状态
        let hhh = nextState.currentZhuShu != this.state.currentZhuShu; //注数不同时
        let iii = nextState.selectBallArr != this.state.selectBallArr; //选择的号码改变时

        if (aaa || bbb || ccc || ddd || eee || fff || ggg || hhh || iii){
            return true;
        }
        else  {
            return false;
        }

    }

    componentDidMount() {


        this.subscription = PushNotification.addListener('ClearAllBalls', () => {
            this.setState({isClearAllBall:true, currentZhuShu:0, selectBallArr:[], pickerBallsDesc:'', pickerBallsPeilv:'0',singlePrice:''})
        })

        this.subscription1 = PushNotification.addListener('PkNiuNiuOpenStatuesNotification', (ballsDescArr, openBallsArr) => {

            let zhuangStatue = this._getBallsIdx(ballsDescArr[0]);  //庄家的下标
            let xianyiStatue = this._getBallsIdx(ballsDescArr[1]);  //庄家的下标
            let xianerStatue = this._getBallsIdx(ballsDescArr[2]);  //庄家的下标
            let xiansanStatue = this._getBallsIdx(ballsDescArr[3]);  //庄家的下标
            let xiansiStatue = this._getBallsIdx(ballsDescArr[4]);  //庄家的下标
            let xianwuStatue = this._getBallsIdx(ballsDescArr[5]);  //庄家的下标

            let xianyiWin = xianyiStatue > zhuangStatue ? '0' : '1';
            let xianerWin = xianerStatue > zhuangStatue ? '0' : '1';
            let xiansanWin = xiansanStatue > zhuangStatue ? '0' : '1';
            let xiansiWin = xiansiStatue > zhuangStatue ? '0' : '1';
            let xianwuWin = xianwuStatue > zhuangStatue ? '0' : '1';

            this.setState({
                openBallStatuesArr:ballsDescArr,
                openBallsArr:openBallsArr,
                openWinStatuesArr:[xianyiWin, xianerWin, xiansanWin, xiansiWin, xianwuWin],
            })
        })

        //下注成功重置底部金额工具栏
        this.subscription2 = PushNotification.addListener('SubmitTouZhuSucessNotification',()=>{
            this.setState({singlePrice:''})
        })
    }

    //根据牛牛状态拿到下标做输赢比较
    _getBallsIdx(balls){

        let ballIdx = 0;

        switch (balls){

            case '无牛':
                ballIdx = 0;
                break;
            case '牛一':
                ballIdx = 1;
                break;
            case '牛二':
                ballIdx = 2;
                break;
            case '牛三':
                ballIdx = 3;
                break;
            case '牛四':
                ballIdx = 4;
                break;
            case '牛五':
                ballIdx = 5;
                break;
            case '牛六':
                ballIdx = 6;
                break;
            case '牛七':
                ballIdx = 7;
                break;
            case '牛八':
                ballIdx = 8;
                break;
            case '牛九':
                ballIdx = 9;
            case '牛牛':
                ballIdx = 10;
                break;

        }

        return ballIdx;
    }

    componentWillUnmount() {

        if (typeof(this.subscription) == 'object') {
            this.subscription && this.subscription.remove();
        }

        if (typeof(this.subscription1) == 'object') {
            this.subscription1 && this.subscription1.remove();
        }

        if (typeof(this.subscription2) == 'object') {
            this.subscription2 && this.subscription2.remove();
        }
    }

    //处理所选择的号码

    _handlePickNumArr(statueStr, btnUniqueId, peilvStr, btnIdx){

        this.state.openListArr = [];  //这个数据也要赋值为空
        this.state.isClearAllBall = false;  //重新选择时赋值为false

        if (statueStr == true){
            this.state.selectBallArr.push({'idx':btnIdx, 'desc':btnUniqueId, 'peilv':peilvStr});
        }
        else {
            for (let i = 0; i < this.state.selectBallArr.length; i++){

                let pickerDict = this.state.selectBallArr[i];
                if (pickerDict.desc == btnUniqueId){
                    this.state.selectBallArr.splice(i, 1);
                    break;
                }
            }
        }


        let ballsArr = [];  //选择的号码视图
        let ballsDescArr = []; //选择号码详情视图
        let peilvArr = [];  //赔率数组
        let selectNumDesc = '';  //底部工具栏显示的号码详情
        let wiilWinPeilv = 0;  //总的盈利的赔率

        for (let pickerData of this.state.selectBallArr){
            ballsArr.push(pickerData.idx);
            ballsDescArr.push(pickerData.desc);
            peilvArr.push(pickerData.peilv);
            selectNumDesc += `${pickerData.desc}@${pickerData.peilv}`;
            wiilWinPeilv += parseFloat(pickerData.peilv);
        }

        this.setState({currentZhuShu:this.state.selectBallArr.length,pickerBallsDesc:selectNumDesc, pickerBallsPeilv:`${wiilWinPeilv}`});

        let pickerDataDict = {[this.state.currentplayName]:ballsDescArr,[`${this.state.currentplayName}^^01`]:ballsArr,'赔率':peilvArr};

        this.props.BallsSelectArr ? this.props.BallsSelectArr(pickerDataDict,[this.state.currentplayName], this.state.ballsArcdomList) : null;
    }

    render (){

        return <View style = {{flex:1, backgroundColor:'#fff'}}>
            <RaceCarView
                style = {{backgroundColor: '#fff'}}
                FinishRace={(isFinish)=> {this.setState({isCompleteRace:isFinish})}}
                openList={this.state.openListArr}
            />
            {this.state.currentPlayDataArr.length != 0 ?
                <View style={{marginTop: 100, flexDirection: 'row'}}>
                    <PokerAgenBtn
                        style={{marginTop: SCREEN_WIDTH != 320 ? 170 : 110, width: SCREEN_WIDTH, height: 100}}
                        isClearAllBall={this.state.isClearAllBall}
                        peilvStr={this.state.peilvDataArr[2]}
                        isWinOrLose={this.state.openWinStatuesArr[2]}
                        ballStatues={this.state.openBallStatuesArr[3]}
                        pokerBallsArr={[this.state.openBallsArr[3], this.state.openBallsArr[4], this.state.openBallsArr[5], this.state.openBallsArr[6], this.state.openBallsArr[7]]}
                        XianSanBtnClick={(isClick, peilvStr) => {
                            this._handlePickNumArr(isClick, '闲三', peilvStr, 2);
                        }}
                    />
                    <PokerXianYiBtn
                        style={{
                            position: 'absolute',
                            left: 0,
                            width: (SCREEN_WIDTH - 110) / 2,
                            height: SCREEN_WIDTH != 320 ? 100 : 70,
                            borderColor: '#bfbfbf',
                            borderBottomWidth: 1,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        isClearAllBall={this.state.isClearAllBall}
                        peilvStr={this.state.peilvDataArr[0]}
                        isWinOrLose={this.state.openWinStatuesArr[0]}
                        ballStatues={this.state.openBallStatuesArr[1]}
                        pokerBallsArr={[this.state.openBallsArr[1], this.state.openBallsArr[2], this.state.openBallsArr[3], this.state.openBallsArr[4], this.state.openBallsArr[5]]}
                        XianYiBtnClick={(isClick, peilvStr) => {
                            this._handlePickNumArr(isClick, '闲一', peilvStr, 0);
                        }}
                    />
                    <PokerXianWuBtn
                        style={{
                            position: 'absolute',
                            right: 0,
                            width: (SCREEN_WIDTH - 110) / 2,
                            height: SCREEN_WIDTH != 320 ? 100 : 70,
                            borderColor: '#bfbfbf',
                            borderBottomWidth: 1,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        isClearAllBall={this.state.isClearAllBall}
                        peilvStr={this.state.peilvDataArr[4]}
                        isWinOrLose={this.state.openWinStatuesArr[4]}
                        ballStatues={this.state.openBallStatuesArr[5]}
                        pokerBallsArr={[this.state.openBallsArr[5], this.state.openBallsArr[6], this.state.openBallsArr[7], this.state.openBallsArr[8], this.state.openBallsArr[9]]}
                        XianWuBtnClick={(isClick, peilvStr) => {
                            this._handlePickNumArr(isClick, '闲五', peilvStr, 4);
                        }}
                    />
                    <PokerXianErBtn
                        style={{
                            position: 'absolute',
                            top: SCREEN_WIDTH != 320 ? 100 : 70,
                            backgroundColor: 'rgba(0,0,0,0)'
                        }}
                        isClearAllBall={this.state.isClearAllBall}
                        peilvStr={this.state.peilvDataArr[1]}
                        isWinOrLose={this.state.openWinStatuesArr[1]}
                        ballStatues={this.state.openBallStatuesArr[2]}
                        pokerBallsArr={[this.state.openBallsArr[2], this.state.openBallsArr[3], this.state.openBallsArr[4], this.state.openBallsArr[5], this.state.openBallsArr[6]]}
                        XianErBtnClick={(isClick, peilvStr) => {
                            this._handlePickNumArr(isClick, '闲二', peilvStr, 1);
                        }}
                    />
                    <PokerZhuangBtn
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: (SCREEN_WIDTH - 110) / 2,
                            right: (SCREEN_WIDTH - 110) / 2,
                            backgroundColor: 'rgba(0,0,0,0)'
                        }}
                        ballStatues={this.state.openBallStatuesArr[0]}
                        pokerBallsArr={[this.state.openBallsArr[0], this.state.openBallsArr[1], this.state.openBallsArr[2], this.state.openBallsArr[3], this.state.openBallsArr[4]]}
                    />
                    <PokerXianSiBtn
                        style={{
                            position: 'absolute',
                            top: SCREEN_WIDTH != 320 ? 100 : 70,
                            right: 0,
                            backgroundColor: 'rgba(0,0,0,0)'
                        }}
                        isClearAllBall={this.state.isClearAllBall}
                        peilvStr={this.state.peilvDataArr[3]}
                        isWinOrLose={this.state.openWinStatuesArr[3]}
                        ballStatues={this.state.openBallStatuesArr[4]}
                        pokerBallsArr={[this.state.openBallsArr[4], this.state.openBallsArr[5], this.state.openBallsArr[6], this.state.openBallsArr[7], this.state.openBallsArr[8]]}
                        XianSiBtnClick={(isClick, peilvStr) => {
                            this._handlePickNumArr(isClick, '闲四', peilvStr, 3);
                        }}
                    />
                </View>
            : null}
            <Pk10NiuNiuHeanderView
                nextCountDownList={this.state.nextCountDownList}
                openList={this.state.openListArr}
                tag={this.state.tag}
                finishTime={this.state.finishTime}
                style = {{position:'absolute', top:this.state.isCompleteRace == false ? SCREEN_WIDTH == 414 ? 138 : SCREEN_WIDTH == 375 ? 125 : 106 : 120, height:100, width:SCREEN_WIDTH, backgroundColor:'#eee'}}
                NoLoginClick = {() => {
                    this.props.pleaseLoginClick ? this.props.pleaseLoginClick() : null;
                }}
                againRequestTime={(finishTime, nextList) => {
                    this.props.againRequestTime ? this.props.againRequestTime(finishTime, nextList) : null;
                }}
            />
            <Pk10NiuNiuBottom
                style = {{position:'absolute', bottom:SCREEN_HEIGHT == 812 ? 34 : 0, left:0, width:SCREEN_WIDTH, height:90}}
                pickerNumDesc={this.state.pickerBallsDesc}
                pickerNumPeilv={this.state.pickerBallsPeilv}
                singlePrice={this.state.singlePrice}
                MoreFuctionClick = {()=> {

                    this.props.MoreFuctionClick ? this.props.MoreFuctionClick() : null;
                }}
                xiaZhuClick = {()=> {
                    this.props.XiaZhuClick ? this.props.XiaZhuClick(this.state.singlePrice) : null;
                }}
                priceInputBlock = {(price) => {
                    this.state.singlePrice = price;
                }}
                ZhuShuPicker={this.state.currentZhuShu}
            />
        </View>
    }
}