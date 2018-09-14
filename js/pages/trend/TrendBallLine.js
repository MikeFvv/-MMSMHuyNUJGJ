/**
 Created by Money on 2018/05/01
    走势内容 开奖号码and连线
 */

import React, { Component } from 'react';
import {
    View,
    Text,
    ART,
} from 'react-native';


export default class TrendBallLine extends Component {
    constructor(props) {
        super(props);

        this.state = {
            qishuArr: [],
            openBallArr: [],
        }
    }

    componentDidMount() {
        this._handleData(this.props.data);
    }

    // 返回是否要刷新render
    shouldComponentUpdate(nextProps, nextState) {
        // 外面是下拉刷新状态时，不刷新界面
        if (!nextProps.isPullRefresh) {
            return true;
        } else {
            return false;
        }
    }

    componentWillReceiveProps(nextProps) {
        // 相同就不再处理了
        if (this.props.data != nextProps.data) {
            this._handleData(nextProps.data);
        }
    }

    _handleData(data) {

        var openBallArr = [], qishuArray = [];
        let list = data['list'], js_tag = data['js_tag'];
        this.js_tag = js_tag;

        let baCount = 3;
        if (js_tag == 'ssc' || js_tag == '11x5') {
            baCount = 5;
        } else if (js_tag == 'pk10' || js_tag == 'pkniuniu') {
            baCount = 10;
        } else if (js_tag == 'xync') {
            baCount = 8;
        } else if (js_tag == 'qxc') {
            baCount = 4;
        }

        if (js_tag == 'xync') {

            for (let i = 0; i < list.length; i++) {
                qishuArray.push(list[i]['qishu'].substr(-4))
                let baArr = [[], []];

                for (let j = 0; j < baCount; j++) {
                    let ball = list[i][`ba_${j}`];
                    if (parseInt(ball) > 10) {
                        baArr[1].push(ball);
                    } else {
                        baArr[0].push(ball);
                    }
                }
                openBallArr.push(baArr);
            }
            this.setState({
                qishuArr: qishuArray,
                openBallArr: openBallArr,
            })
            return;
        }

        for (let i = 0; i < baCount; i++) {

            let baArr = [];
            for (let j = 0; j < list.length; j++) {

                if (i == 0) {
                    qishuArray.push(list[j]['qishu'].substr(-4));
                }
                baArr.push(list[j][`ba_${i}`]);
            }

            openBallArr.push(baArr);
        }

        this.setState({
            qishuArr: qishuArray,
            openBallArr: openBallArr,
        })
    }


    // 左边期数的视图
    _createQishuView(data) {

        let qishuViews = [];
        for (let b = 0; b < data.length + 3; b++) {
            qishuViews.push(
                <View key={b} style={{ height: Adaption.Height(40), justifyContent: 'center', alignItems: 'center', borderColor: '#eae9e7', borderBottomWidth: 1 }}>
                    <Text allowFontScaling={false} style={{ fontSize: b > data.length ? Adaption.Font(15) : Adaption.Font(16, 13) }}>{b == 0 ? '期数' : b == data.length + 1 ? '平均\n遗漏' : b == data.length + 2 ? '最大\n遗漏' : data[b - 1]}</Text>
                </View>
            )
        }
        return qishuViews;
    }

    // 中间走势balls视图
    _createBallsView(data) {

        // k3:1-6； 11x5:1-11， pk10:1-10， 0-9
        let vertical = 10;
        if (this.js_tag == 'k3') {
            vertical = 6;
        } else if (this.js_tag == '11x5') {
            vertical = 11;
        }

        let isStart1 = this.js_tag == 'k3' || this.js_tag == '11x5' || this.js_tag == 'pk10' || this.js_tag == 'pkniuniu';  // 从1开始

        let ballsView = [], postionArr = [], lineHView = [], lienVView = [];
        let viewH = Adaption.Height(40);
        let viewW = SCREEN_WIDTH * 0.87 / vertical;

        let yilouBaArr = [], maxYilouArr = [], ballCnt = [];  // 遗漏显示

        for (let i = data.length - 1; i >= -1; i--) { // 行,倒序从最后面那行开始创建

            // 行分隔线; 因为i--倒序那就插到最前面
            lineHView.splice(0, 0,
                <View key={i} style={{ backgroundColor: '#eae9e7', width: SCREEN_WIDTH * 0.87, height: 1, marginTop: viewH - 1 }}></View>
            )

            let rowViews = [];
            for (let j = 0; j < vertical; j++) {  // 列

                if (i == data.length - 1) {
                    yilouBaArr.push(0);
                    maxYilouArr.push(0);
                    ballCnt.push(0);

                    lienVView.push(
                        <View key={j} style={{ backgroundColor: '#eae9e7', width: 1, height: (data.length + 1) * viewH, marginRight: viewW - 1 }}></View>
                    )
                }

                let isOpenBa = data[i] == (isStart1 ? j + 1 : j);  // 是开奖的号码
                if (i > -1) {
                    if (isOpenBa) {

                        yilouBaArr[j] = 0;
                        postionArr.push({ x: j * viewW + viewW * 0.5, y: viewH + i * viewH + viewH * 0.5 });
                        ballCnt[j] = ballCnt[j] + 1;

                    } else {
                        yilouBaArr[j] = yilouBaArr[j] + 1;

                        // 记录最大遗漏
                        if (yilouBaArr[j] > maxYilouArr[j]) {
                            maxYilouArr[j] = yilouBaArr[j];
                        }

                    }
                }
                let str = i == -1 ? (isStart1 ? j + 1 : j) : isOpenBa ? `${data[i]}` : `${yilouBaArr[j]}`;

                rowViews.push(
                    <View key={j} style={{ height: Adaption.Height(40), width: viewW, justifyContent: 'center', alignItems: 'center' }}>
                        {isOpenBa
                            ? <View style={{ height: Adaption.Width(28), width: Adaption.Width(28), backgroundColor: isOpenBa ? '#f00' : '#fff', borderRadius: Adaption.Width(14), justifyContent: 'center', alignItems: 'center' }}>
                                <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 13), color: i == -1 ? '#000000' : isOpenBa ? '#fff' : '#707070' }}>{str}</Text>
                            </View>
                            : <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 13), color: i == -1 ? '#000000' : isOpenBa ? '#fff' : '#707070' }}>{str}</Text>
                        }
                    </View>
                )
            }

            ballsView.splice(0, 0, <View key={i} style={{ flexDirection: 'row' }}>{rowViews}</View>); // 因为i--倒序那就插到最前面
        }

        return (
            <View style={{ width: SCREEN_WIDTH * 0.87 }}>
                <View>{lineHView}</View>
                <View style={{ position: 'absolute', left: 0, top: 0, backgroundColor: 'rgba(0,0,0,0)', flexDirection: 'row' }}>{lienVView}</View>
                <View style={{ position: 'absolute', left: 0, top: 0, backgroundColor: 'rgba(0,0,0,0)' }}>{this._lineART(postionArr)}</View>
                <View style={{ position: 'absolute', left: 0, top: 0, backgroundColor: 'rgba(0,0,0,0)' }}>{ballsView}</View>
                <View>{this._createYilouView(maxYilouArr, ballCnt, viewW, data.length)}</View>
            </View>
        )
    }

    _lineART(data) {

        let postionStr = ''; // 'M300 10 L50 100 L100 150'    
        for (let i = 0; i < data.length; i++) {
            postionStr += `${i == 0 ? 'M' : 'L'}${data[i].x} ${data[i].y} `;
        }

        const path = ART.Path(postionStr);
        return (
            <ART.Surface width={SCREEN_WIDTH} height={(data.length + 1) * Adaption.Height(40)}>
                <ART.Shape d={path} stroke='#f00' strokeWidth={1}></ART.Shape>
            </ART.Surface>
        )
    }

    _createYilouView(maxYilous, ballCnt, viewW, row) {

        let views = [];
        for (let m = 0; m < 2; m++) {
            let rowV = [];
            for (let n = 0; n < maxYilous.length; n++) {
                rowV.push(
                    <View key={n} style={{ height: Adaption.Height(40), width: viewW, justifyContent: 'center', alignItems: 'center', borderColor: '#eae9e7', borderBottomWidth: 1, borderLeftWidth: 1 }}>
                        <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 13), color: '#000' }}>{m == 1 ? maxYilous[n] : ballCnt[n] == 0 ? 0 : Math.round((row - ballCnt[n]) / ballCnt[n])}</Text>
                    </View>
                )
            }
            views.push(<View key={m} style={{ flexDirection: 'row' }}>{rowV}</View>)
        }
        return views;
    }

    _createXyncBallsView(data) {

        let vertical = 10;

        let ballsView = [], lineHView = [], lienVView = [];
        let viewH = Adaption.Height(40);
        let viewW = SCREEN_WIDTH * 0.87 / vertical;

        let yilouBaArr = [], maxYilouArr = [], ballCnt = [];  // 遗漏显示需要的值

        for (let i = data.length - 1; i >= -1; i--) { // 行,倒序从最后面那行开始创建

            // 行分隔线; 因为i--倒序那就插到最前面
            lineHView.splice(0, 0,
                <View key={i} style={{ backgroundColor: '#eae9e7', width: SCREEN_WIDTH * 0.87, height: 1, marginTop: viewH - 1 }}></View>
            )

            let rowViews = [];
            for (let j = 0; j < vertical; j++) {  // 列

                if (i == data.length - 1) {

                    // 遗漏显示需要的值，每列开始默认为0。
                    yilouBaArr.push(0);
                    maxYilouArr.push(0);
                    ballCnt.push(0);

                    // 画到最后一行时，再画vertical列线
                    lienVView.push(
                        <View key={j} style={{ backgroundColor: '#eae9e7', width: 1, height: (data.length + 1) * viewH, marginRight: viewW - 1 }}></View>
                    )
                }

                let baj = `${i >= 0 && j + 1 < 10 && this.props.selectBtnIdx - 1 == 0 ? '0' : ''}${j + 1 + ((this.props.selectBtnIdx - 1) * 10)}`;
                let isOpenBa = i >= 0 && data[i][this.props.selectBtnIdx - 1].includes(baj);  // 为true是要显示开奖号码了

                if (i > -1) {
                    if (isOpenBa) {
                        yilouBaArr[j] = 0; // 遇到有开奖的 重置；
                        ballCnt[j] = ballCnt[j] + 1;  // 开奖个数 +1；

                    } else {
                        yilouBaArr[j] = yilouBaArr[j] + 1; // 遗漏 +1；

                        // 记录最大遗漏
                        if (yilouBaArr[j] > maxYilouArr[j]) {
                            maxYilouArr[j] = yilouBaArr[j];
                        }
                    }
                }

                let yilouStr = `${yilouBaArr[j]}`;

                rowViews.push(
                    <View key={j} style={{ height: Adaption.Height(40), width: viewW, justifyContent: 'center', alignItems: 'center' }}>
                        {isOpenBa
                            ? <View style={{ height: Adaption.Width(28), width: Adaption.Width(28), backgroundColor: isOpenBa ? '#f00' : '#fff', borderRadius: Adaption.Width(14), justifyContent: 'center', alignItems: 'center' }}>
                                <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 13), color: isOpenBa ? '#fff' : '#707070' }}>{baj}</Text>
                            </View>
                            : <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 13), color: i == -1 ? '#000000' : isOpenBa ? '#fff' : '#707070' }}>{i == -1 ? baj : yilouStr}</Text>
                        }
                    </View>
                )
            }
            ballsView.splice(0, 0, <View key={i} style={{ flexDirection: 'row' }}>{rowViews}</View>); // 因为i--倒序那就插到最前面
        }

        return (
            <View style={{ width: SCREEN_WIDTH * 0.87 }}>
                <View>{lineHView}</View>
                <View style={{ position: 'absolute', left: 0, top: 0, backgroundColor: 'rgba(0,0,0,0)', flexDirection: 'row' }}>{lienVView}</View>
                <View style={{ position: 'absolute', left: 0, top: 0, backgroundColor: 'rgba(0,0,0,0)' }}>{ballsView}</View>
                <View>{this._createYilouView(maxYilouArr, ballCnt, viewW, data.length)}</View>
            </View>
        )
    }

    render() {

        return (
            <View style={this.props.style}>
                {/* 走势内容 */}
                {this.state.qishuArr.length > 0
                    ? <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: SCREEN_WIDTH * 0.13 }}>
                            {this._createQishuView(this.state.qishuArr)}
                        </View>
                        {this.js_tag == 'xync'
                            ? this._createXyncBallsView(this.state.openBallArr)
                            : this._createBallsView(this.state.openBallArr[this.props.selectBtnIdx - 1])
                        }
                    </View>
                    : null
                }
            </View>
        )
    }

}
