/**
 Author Ward
 Created by on 2018-08-14
 pk10牛牛庄家按钮视图
 **/

import React, {Component} from 'react';
import {
    TouchableOpacity,
    ART,
    View,
    Image,
} from 'react-native';
import PokerView from './pokerView';

export default class PokerZhuangBtn extends Component {

    constructor(props){
        super(props);

        this.state = ({
            isClick:false,  //是否点击
            niuNiuNum:0, //牛牛号码
            pokerViewArr:[{pokerNum:'A', pokerStyle:0},{pokerNum:'A', pokerStyle:0},{pokerNum:'A', pokerStyle:0},{pokerNum:'A', pokerStyle:0},{pokerNum:'A', pokerStyle:0}],//初始化值，保证显示5张背面的牌
        })
    }

    componentWillReceiveProps(nextProps) {

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


                    let pokerObject = {pokerNum:pokerNumStr, pokerStyle:idxArr[0]};
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
            <View style = {{alignItems:'center', justifyContent:'center'}}>
                <ART.Surface width={110} height={SCREEN_WIDTH != 320 ? 170 : 120}>
                    <ART.Shape d={path} stroke='#bfbfbf' strokeWidth={1} fill={this.state.isClick ? '#e33939' : '#fff'}/>
                </ART.Surface>
                <PokerView
                    style = {{marginTop:SCREEN_WIDTH != 320 ? -150 : -110, marginLeft:Adaption.Width(20)}}
                    pickerBallsArr={this.state.pokerViewArr}
                    niuNumber={this.state.niuNiuNum}
                    isOpenStatues={false}
                    isZhuangBtn={true}
                    isWinorLose={'0'}
                />
                <Image style = {{marginTop:20,width:SCREEN_WIDTH != 320 ? 50 : 30, height:SCREEN_WIDTH != 320 ? 50 : 30, resizeMode:'stretch'}} source = {require('../../img/carViewImg/ic_pokerGuest.png')}/>
            </View>
        )
    }

    render () {

        return ( <TouchableOpacity activeOpacity={1} onPress = {() => {
        }} style = {this.props.style}>
            {SCREEN_WIDTH != 320 ? this._lineART([{x:0,y:170}, {x:110,y:170}, {x:110,y:0}, {x:0, y:0}, {x:0,y:170}]) : this._lineART([{x:0,y:110}, {x:110,y:110}, {x:110,y:0}, {x:0, y:0}, {x:0,y:110}])}
        </TouchableOpacity>)

    }
}