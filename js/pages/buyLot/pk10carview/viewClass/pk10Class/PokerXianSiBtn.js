/**
 Author Ward
 Created by on 2018-08-14
 pk10牛牛闲四按钮视图
 **/

import React, {Component} from 'react';
import {
    TouchableOpacity,
    ART,
    View,
} from 'react-native';
import PokerView from './pokerView';

export default class PokerXianSiBtn extends Component {

    constructor(props){
        super(props);

        this.state = ({
            isClick:false,  //是否点击
            peilvData:'',  //赔率字符串
            isWinOrLose:false,
            niuNiuNum:0,
            pokerViewArr:[{pokerNum:'A', pokerStyle:0},{pokerNum:'A', pokerStyle:0},{pokerNum:'A', pokerStyle:0},{pokerNum:'A', pokerStyle:0},{pokerNum:'A', pokerStyle:0}],//初始化值，保证显示5张背面的牌
        })
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.isClearAllBall == true){
            this.setState({isClick:false});
        }

        if (nextProps.peilvStr){
            this.state.peilvData = nextProps.peilvStr;
        }

        if (nextProps.isWinOrLose){
            this.setState({isWinOrLose:nextProps.isWinOrLose});
        }

        if (nextProps.ballStatues){

            let niuniuBall = 0;

            switch (nextProps.ballStatues){

                case '无牛':
                    niuniuBall = 11;
                    break;
                case '牛一':
                    niuniuBall = 1;
                    break;
                case '牛二':
                    niuniuBall = 2;
                    break;
                case '牛三':
                    niuniuBall = 3;
                    break;
                case '牛四':
                    niuniuBall = 4;
                    break;
                case '牛五':
                    niuniuBall = 5;
                    break;
                case '牛六':
                    niuniuBall = 6;
                    break;
                case '牛七':
                    niuniuBall = 7;
                    break;
                case '牛八':
                    niuniuBall = 8;
                    break;
                case '牛九':
                    niuniuBall = 9;
                    break;
                case '牛牛':
                    niuniuBall = 10;
                    break
            }

            this.setState({niuNiuNum:niuniuBall});
        }

        if (nextProps.pokerBallsArr.length != 0){

            let newpokerNumArr = [];  //开奖的扑克视图
            let idxArr = [0,1,2,3];   //扑克花色下标数组

            for (let i = 0; i < nextProps.pokerBallsArr.length; i ++){

                //存在才会去判断
                if (nextProps.pokerBallsArr[i]){

                    let pokerNumStr = nextProps.pokerBallsArr[i] == '01' ? 'A' : nextProps.pokerBallsArr[i] == '10' ? nextProps.pokerBallsArr[i] : nextProps.pokerBallsArr[i].substr(1,1) ;  //扑克号码字符串


                    let pokerObject = {pokerNum:pokerNumStr, pokerStyle:idxArr[1]};
                    newpokerNumArr.push(pokerObject);
                }
            }

            this.setState({pokerViewArr:newpokerNumArr});
        }
    }

    _lineART(data) {

        let postionStr = ''; // 'M300 10 L50 100 L100 150'
        for (let i = 0; i < data.length; i++) {
            postionStr += `${i == 0 ? 'M' : 'L'}${data[i].x} ${data[i].y} `;
        }

        const path = ART.Path(postionStr);
        return (
            <View style = {{alignItems:'center', alignItems:'center'}}>
                <ART.Surface width={(SCREEN_WIDTH - 110)/2} height={SCREEN_WIDTH != 320 ? 170 : 140}>
                    <ART.Shape d={path}  fill={this.state.isClick ? '#e33939' : '#fff'}/>
                </ART.Surface>
                <CusBaseText style = {{marginTop:SCREEN_WIDTH != 320 ? -165 : -135, fontSize:Adaption.Font(22,19), color:'#717171', backgroundColor:this.state.isClick ? '#e33939' : '#fff'}}>
                    闲四
                </CusBaseText>
                <PokerView
                    style = {{marginTop:5, marginLeft:SCREEN_WIDTH != 320 ? 15 : 30}}
                    pickerBallsArr={this.state.pokerViewArr}
                    isWinorLose={this.state.isWinOrLose}
                    niuNumber={this.state.niuNiuNum}
                    isOpenStatues={false}
                    isZhuangBtn={false}
                />
            </View>
        )
    }

    render () {

        return ( <TouchableOpacity activeOpacity={0.8} onPress = {() => {
            this.setState({isClick: !this.state.isClick});
            this.props.XianSiBtnClick ? this.props.XianSiBtnClick(!this.state.isClick,this.state.peilvData) : null;
        }} style = {this.props.style}>
            {SCREEN_WIDTH != 320 ? this._lineART([{x:(SCREEN_WIDTH - 110)/2,y:170}, {x:0,y:70}, {x:0,y:0}, {x:(SCREEN_WIDTH - 110)/2, y:0}]) : this._lineART([{x:(SCREEN_WIDTH - 110)/2,y:140}, {x:0,y:40}, {x:0,y:0}, {x:(SCREEN_WIDTH - 110)/2, y:0}])}
        </TouchableOpacity>)

    }
}