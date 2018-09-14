/**
 * Created by Ward on 2018/07/18.
 * 足彩头部倒计时视图
 */

import React, { Component } from 'react';

import {
    View,
    TouchableOpacity,
    Image,
} from 'react-native';

export default class ScorceTimerFreshView extends Component{

    constructor(props){
        super(props);

        this.state = ({
            freshTime:props.gameTypeID == 0 ? 30 : 180,  //获取数据倒计时
            gameTypeIDX:props.gameTypeID,  //gameType:0滚球,1今日,2早盘
        })

        this.timer1 = null;
        this.watingClick = false;  //等待点击时间。防止用户过快点击重复调用接口
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.gameTypeID != this.state.gameTypeIDX){
            this.state.gameTypeIDX = nextProps.gameTypeID;
            this.state.freshTime = nextProps.gameTypeID == 0 ? 30 : 180;
        }

    }


    componentDidMount() {

        this._countDownTime();

    }


    //倒计时重新请求数据
    _countDownTime(){

        if (this.timer1) {
            return;
        }

        this.timer1 = setInterval(() => {

            if (this.state.freshTime < 1){

                this.state.freshTime = this.state.gameTypeIDX  == 0 ? 30 : 180;
                PushNotification.emit('FBGameCenterTimeLinFreshAPINotification');  //倒计时截止刷新足彩的通知
            }
            else {

                this.state.freshTime -= 1;
            }

            this.setState({freshTime:this.state.freshTime});

        }, 1000)
    }

    //销毁定时器
    componentWillUnmount() {

        this.timer1 && clearInterval(this.timer1);
    }


    render () {

        return <View style = {{flex:1, alignItems:'center', justifyContent:'center'}}>
            <TouchableOpacity
                activeOpacity={0.7}
                style = {{width:80, height:40, flexDirection:'row',justifyContent:'center', alignItems:'center'}}
                onPress = {()=> {

                    if (this.watingClick == false){

                        this.watingClick = true;
                        this.state.freshTime = this.state.gameTypeIDX == 0 ? 30 : 180;
                        PushNotification.emit('FBGameCenterTimeLinFreshAPINotification');  //倒计时截止刷新足彩的通知

                        setTimeout(()=>{this.watingClick = false},2000);
                    }
                }}
            >
                <CusBaseText style = {{color:'#fc7c30', fontSize:Adaption.Font(18,16)}}>
                    {this.state.freshTime}
                </CusBaseText>
                <Image source={require('../img/ic_freshTime.png')} style = {{width:24, height:24, marginLeft:10,resizeMode:'stretch'}}/>
            </TouchableOpacity>
        </View>
    }
}