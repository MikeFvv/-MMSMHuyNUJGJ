import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    AppState,
} from 'react-native';

import Moment from 'moment';
let iphone5S = global.iOS ? (SCREEN_WIDTH == 320 ? true : false) : 0;

class NormalHeaderView extends Component {

    //构造器
    constructor(props) {
        super(props);

        this.finishTime = props.finishTime;

        this.currentCountDownIndex = 0; //当前下标
        if (props.theQiShu > 0 && props.nextTimeList && props.nextTimeList.length > 0) {
            for (let a = 0; a < props.nextTimeList.length; a++) {
                let qishu = props.nextTimeList[a].qishu;
                if (props.theQiShu == qishu) {
                    this.currentCountDownIndex = a;  // 当前是第几个了呀呀
                    break;
                }
            }
        }
        

        let jieZhiTime = 0, fengPan = 0;
        if (props.nextTimeList.length > 0) {  // 倒计时
            jieZhiTime = props.nextTimeList[this.currentCountDownIndex].opentime - (props.nextTimeList[this.currentCountDownIndex].server_time - this.finishTime) - Math.round(new Date() / 1000);
            //fengPan = props.nextTimeList[this.currentCountDownIndex].stoptime - (props.nextTimeList[this.currentCountDownIndex].server_time - this.finishTime) - Math.round(new Date() / 1000);
        }

        this.state = ({
            countTime: jieZhiTime,
            //nextFengPanTime: fengPan,  //封盘时间
            qiShu: props.theQiShu,
            tag: props.tag ? props.tag : '',
            nextCountDownList: props.nextTimeList,
        })

    }


    //将要接收到传过来的数据
    componentWillReceiveProps(nextProps) {

        if (nextProps.tag != null) {

            if (nextProps.tag != this.state.tag){
                this.currentCountDownIndex = 0;
            }

            this.state.tag = nextProps.tag;
        }
    }

    componentWillMount() {
        this._setTimeInval();
    }

    componentDidMount() {

        AppState.addEventListener('change', (appState) => {

            //活跃状态重新刷数据
            if (appState == 'active') {
                this._fetchCountDownData(this.state.tag);
            }
        });

        AppState.addEventListener('memoryWarning', () => {
            //this.setState({memoryWarnings: this.state.memoryWarnings + 1});
        });
    }

    //移除通知
    componentWillUnmount() {
        AppState.removeEventListener('change');
        AppState.removeEventListener('memoryWarning');
    }

    //获取彩种倒计时接口，返回10条数据，本地倒计时

    _fetchCountDownData(tag){

        let params = new FormData();
        params.append('ac', 'getCplogList');
        params.append('tag', tag);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                if (responseData.msg == 0) {

                    if (responseData.data.length != 0){

                        let nextList = responseData.data[0].next;
                        let nextModel = nextList[0];

                        this.finishTime = Math.round(new Date() / 1000);

                        // 倒计时时间直接用opentime 减 手机系统时间。
                        let currOpen = nextModel.opentime - (nextModel.server_time - this.finishTime) - Math.round(new Date() / 1000);
                       // let currStop = nextModel.stoptime - (nextModel.server_time - this.finishTime) - Math.round(new Date() / 1000);
                        this.currentCountDownIndex = 0;//当前下标

                        this.setState({
                            nextCountDownList: nextList,
                            qiShu: nextModel.qishu,
                            countTime: currOpen,  //下一期截止时间
                            //nextFengPanTime: currStop,
                        });

                        global.CurrentQiShu = nextModel.qishu;

                        // this.props.currentQiShu ? this.props.currentQiShu(nextModel.qishu) : null;  //回调期数
                        //this.props.FengPanBlock ?  this.props.FengPanBlock(false) : null; //回调封盘状态

                          this._setTimeInval();
                    }

                }
                else {
                    this.refs.Toast && this.refs.Toast.show(responseData.param, 1000);
                }
            })

            .catch((err) => {
            })
    }


    //定时器开始
    _setTimeInval() {

        //重新加载数据
        if (this.timer) {
            return;
        }

        this.timer = setInterval(() => {

            if (this.state.countTime < 1) {

                this.currentCountDownIndex += 1;

                if (this.currentCountDownIndex < this.state.nextCountDownList.length) {

                    let nextQi = this.state.nextCountDownList[this.currentCountDownIndex].qishu;
                    this.setState({
                        qiShu: nextQi,
                    })

                    global.CurrentQiShu = nextQi;  //拿到下一期期数
                    // this.props.currentQiShu ? this.props.currentQiShu(nextQi) : null;  //回调期数
                    //this.props.FengPanBlock ?  this.props.FengPanBlock(false) : null; //回调封盘状态
                }

                // PushNotification.emit('CountTimeDeadLine1');
            }

             // 已封盘 倒计时数组已经用到最后一期了。请先去请求了。不等到最后一个数据用完才请求
             if (this.state.countTime == 0 && this.currentCountDownIndex >= this.state.nextCountDownList.length - 1) {
                this._fetchCountDownData(this.state.tag);
            }


            // if (this.state.nextFengPanTime == 0) {
            //     this.props.FengPanBlock ? this.props.FengPanBlock(true) : null;  //回调封盘状态
            // }


            let currOpen = 0, currStop = 0;
            if (this.currentCountDownIndex < this.state.nextCountDownList.length) {
                // 倒计时时间直接用opentime 减 手机系统时间。
                currOpen = this.state.nextCountDownList[this.currentCountDownIndex].opentime - (this.state.nextCountDownList[this.currentCountDownIndex].server_time - this.finishTime)  - Math.round(new Date() / 1000);
                //currStop = this.state.nextCountDownList[this.currentCountDownIndex].stoptime - (this.state.nextCountDownList[this.currentCountDownIndex].server_time - this.finishTime)  - Math.round(new Date() / 1000);
            }

            this.setState({
                countTime: currOpen > 0 ? currOpen : 0, 
                //nextFengPanTime: currStop,
            });

        }, 1000);

    }

    _changeTime(totalTime) {

        if (isNaN(totalTime)) {
            return '00:00:00';
        }
        else {
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

    //销毁定时器
    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    render() {
        return (
            <View style={this.props.style}>

                <View style={{ height: this.props.style.height * 0.35, justifyContent: 'center', alignItems: 'center' }}>
                    <CusBaseText style={{ fontSize: Adaption.Font(16, 14), color: 'grey' }}>
                        第
                        <CusBaseText style={{ color: 'red' }}>{this.state.qiShu ? this.state.qiShu : ''}</CusBaseText>
                        期投注截止时间：
                        <CusBaseText style={{ color: 'red' }}>{this._changeTime(this.state.countTime)}</CusBaseText>
                    </CusBaseText>
                </View>

                <View style={{ height: this.props.style.height * 0.65, width: SCREEN_WIDTH, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', backgroundColor: '#fff' }}>
                    {/* 添加注单 */}
                    <TouchableOpacity activeOpacity={0.5} style={styles.btnView}
                        onPress={() => {
                            this.props.comformOnPress ? this.props.comformOnPress() : null
                        }}>
                        <Image style={styles.imgview} source={require('../../../img/ic_buyLotGoBack.png')} />
                        <Text allowFontScaling={false} style={{ color: '#6a6a6a', fontSize: Adaption.Font(17, 14) }}> 添加注单</Text>
                    </TouchableOpacity>
                    
                    {/* 机选1注 */}
                    <TouchableOpacity activeOpacity={0.5} style={styles.btnView}
                        onPress={() => {
                            this.props.arcdomOneOnPress ? this.props.arcdomOneOnPress() : null
                        }}>
                        <Image style={styles.imgview} source={require('../../../img/ic_arcdomOne.png')} />
                        <Text allowFontScaling={false} style={{ color: '#6a6a6a', fontSize: Adaption.Font(17, 14) }}> 机选1注</Text>
                    </TouchableOpacity>

                    {/* 低频彩 不显示追号 */}
                    {this.props.speed == 1 ?
                        <TouchableOpacity activeOpacity={0.5} style={styles.btnView} 
                            onPress={() => {
                                this.props.smartChaseOnPress ? this.props.smartChaseOnPress(this.state.countTime, this.state.tag, this.state.qiShu) : null
                            }}>
                            <Image style={styles.imgview} source={require('../../../img/ic_smart_zhuihao.png')} />
                            <Text allowFontScaling={false} style={{ color: '#e33939', fontSize: Adaption.Font(17.5, 14) }}> 智能追号</Text>
                        </TouchableOpacity> 
                        : null
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    btnView: {
        flex: 0.26, 
        height: Adaption.Height(40),
        justifyContent: 'center', 
        alignItems: 'center', 
        flexDirection: 'row', 
        borderWidth: 1, 
        borderColor: '#e6e6e6', 
        borderRadius: 5, 
        backgroundColor: '#f6f6f6',
    },

    imgview:{
        width: Adaption.Width(18), 
        height: Adaption.Width(18),
    },
});

export default NormalHeaderView;
