/**
 Created by Money on 2018/05/19
*/

import React, { Component } from 'react';
import {
    View,
    Text,
} from 'react-native';


export default class RoadTimeView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stopless: props.fengPanTime,  // 封盘时间
            openless: props.openTime,     // 开奖时间
            qishu: global.CurrentQiShu,   // 当前期数
        }

        this.nextData = props.nextData;
        this.currentIdx = 0;  // 为防止用户要投注界面停留了几期后 才进入路图。所以idx不能固定取0

        if (global.CurrentQiShu > 0 && this.nextData.length > 0) {
            for (let a = 0; a < props.nextData.length; a++) {
                let qishu = props.nextData[a].qishu;
                if (global.CurrentQiShu == qishu) {
                    this.currentIdx = a;
                    break;
                }
            }
        }
    }

   
    componentDidMount() {
        this._timeInterval();  // 时间倒计
    }

    componentWillUnmount() {
        this.fengPanTimer && clearInterval(this.fengPanTimer);
    }
   
    
    _timeInterval() {
        
        // 进来先自减一次。
        this.setState({
            stopless: this.state.stopless - 1,
            openless: this.state.openless - 1,
        });

        this.fengPanTimer = setInterval(() => {
            if (this.state.openless < 1 && this.nextData.length > 0) {
                // 准备取下一期的时间。
                this.currentIdx += 1;
                this.props.enterNextQi ? this.props.enterNextQi() : null; // 回调回去，请求开奖记录。

                if (this.currentIdx < this.nextData.length) {

                    // 下一期的stopless 要减少上一期的openless。
                    let stopTime = this.nextData[this.currentIdx].stopless - this.nextData[this.currentIdx - 1].openless;
                    let openTime = this.nextData[this.currentIdx].openless - this.nextData[this.currentIdx - 1].openless;
                    let qishu = this.nextData[this.currentIdx].qishu;

                    this.setState({
                        stopless: stopTime,  // 封盘时间
                        openless: openTime,     // 开奖时间
                        qishu: qishu,   // 当前期数
                    });
                }
            }

            // 已封盘 且nextData数据已经用到最后一期了。请先去请求了。
            if (this.state.stopless == 0 && this.currentIdx >= this.nextData.length - 1) {
                // 请求新的倒计时数据。
                this._getCplogList();
            }

            this.setState({
                stopless: this.state.stopless - 1,
                openless: this.state.openless - 1,
            });

        }, 1000)
    }

    _getCplogList() {
        let params = new FormData();
        params.append('ac', 'getCplogList');
        params.append('tag', this.props.tag);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((response) => {

                if (response.msg == 0 && response.data.length != 0) {

                    this.nextData = response.data[0].next;
                    this.currentIdx = 0;  // 重置。

                    let stopTime = this.nextData[0].stopless;
                    let openTime = this.nextData[0].openless;
                    let qishu = this.nextData[0].qishu;

                    this.setState({
                        stopless: stopTime,  // 封盘时间
                        openless: openTime,     // 开奖时间
                        qishu: qishu,   // 当前期数
                    });
                }

            })
            .catch((error) => {
            })
    }

    _formatTime(time) {
        if (time == null || time <= 0) {
            return '00:00:00';

        } else {

            let hour = Math.floor(time / (60 * 60));  // 总时间戳 / (1小时的秒数)
            let min = Math.floor(time / 60 % 60);  // 总时间戳 / 1分钟的秒数 % 1分钟的秒数
            let seconds = Math.floor(time % 60);  // 总时间戳 % 1分钟的秒数

            return `${hour < 10 ? '0'+hour : hour}:${min < 10 ? '0'+min : min}:${seconds < 10 ? '0'+seconds : seconds}`;
        }
    }
   

    render() {
        return (
            <View style={[this.props.style]}>
                <Text style={{ color: '#707070', fontSize: Adaption.Font(17, 14) }}>
                    第<Text style={{color: '#e33939'}}>{this.state.qishu}</Text>期投注截止时间：
                    <Text style={{color: '#e33939'}}>{(this.state.stopless < 0 && this.state.qishu > 0) ? '已封盘' : this._formatTime(this.state.stopless)}</Text>
                </Text>
            </View>
        )
    }

}
