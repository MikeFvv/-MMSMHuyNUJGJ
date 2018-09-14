/**
 Author Ward
 Created by on 2018-08-14
 pk10牛牛闲一按钮视图
 **/

import React, {Component} from 'react';
import {
    TouchableOpacity,
} from 'react-native';
import PokerView from './pokerView';

export default class PokerXianYiBtn extends Component {

    constructor(props){
        super(props);

        this.state = ({
            isClick:false,  //是否点击
            peilvData:'',  //当前号码的赔率
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

    render () {

        return ( <TouchableOpacity activeOpacity={0.8} onPress = {() => {
            this.setState({isClick: !this.state.isClick});
            this.props.XianYiBtnClick ? this.props.XianYiBtnClick(!this.state.isClick, this.state.peilvData) : null;
        }} style = {[this.props.style, {backgroundColor:this.state.isClick ?  '#e33939' : '#fff'}]}>
            <CusBaseText style = {{marginBottom:5,fontSize:Adaption.Font(22,19), color:'#717171', backgroundColor:this.state.isClick ? '#e33939' : '#fff'}}>
                闲一
            </CusBaseText>
            <PokerView
                pickerBallsArr={this.state.pokerViewArr}
                isWinorLose={this.state.isWinOrLose}
                niuNumber={this.state.niuNiuNum}
                isOpenStatues={false}
                isZhuangBtn={false}
            />
        </TouchableOpacity>)

    }
}