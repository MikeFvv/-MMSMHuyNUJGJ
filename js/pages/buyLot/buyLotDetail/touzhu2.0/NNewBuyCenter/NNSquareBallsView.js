/**
 Created by Money on 2018/08/08 18:08:08

 -----------    --------------
 |    大    |   |      龙     |
 -----------    | 06 18 30 42 |
    1.962       --------------
                    11.322

  请不要格式化代码，谢谢！。
 */


import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';

let tempArcInt = -1;  // 记录要记机哪一排，如定位胆只选其中一排的一个号码就行了。
let tempArcArr = []; // 避免随机重复的

let lastBall = -1; // 上次点的item。11x5不能选相同的。
let lastIdx = -1; // 哪排

import GetBallStatus from '../../touzhu2.0/newBuyTool/GetBallStatus';

export default class NNSquareBallsView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectBallIdxArr: [], // 选择号码的下标。
        }
    }

    componentWillReceiveProps(nextProps) {
        // 清空
        if (nextProps.clearAllBalls && this.state.selectBallIdxArr.length > 0) {
            this.setState({
                selectBallIdxArr: [],
            })
            this.props.ballClick ? this.props.ballClick({ [this.props.title]: [] }) : null;
        }

        // 机选
        if (nextProps.isBallsChange) {
            lastBall = -1;
            this._arcBallsMethod(nextProps);
        }

        // 如果是点机选的，不能进这里。手动选号才能进入
        if (!nextProps.isBallsChange && lastBall >= 0) {
            // k3 号码选择限制 -- 二同号单选 || 二、三不同号胆拖 
            let k3_3 = nextProps.js_tag == 'k3' && (nextProps.playid == '8' || nextProps.playid == '10' || nextProps.playid == '5');
            if (k3_3) {
                if ((lastIdx == 0 && nextProps.idx == 1) || (lastIdx == 1 && nextProps.idx == 0)) {
                    for (let a = 0; a < this.state.selectBallIdxArr.length; a++) {
                        // 如果有和lastBall相等的，就删除它，再走一次回调。
                        if (this.state.selectBallIdxArr[a] == lastBall) {
                            this.state.selectBallIdxArr.splice(a, 1);
                            this._returnBallsData(this.state.selectBallIdxArr);
                            break;
                        }
                    }
                }
            }
        }
    }

    _arcBallsMethod(nextProps) {

        let js_tag = nextProps.js_tag;
        let playid = nextProps.playid;
        let idx = nextProps.idx; // idx是拿到当前是第几排，有些随机选择每排选择的号码个数不一样时就用来区别了
        let arcNumArr = this._returnArcBallArr(1);  // 随机要选择的数。

        if (js_tag == 'k3') {
            if (playid == '4') {
                // 三不同 - 标准
                arcNumArr = this._returnArcBallArr(3);
            } else if (playid == '5') {
                // 三不同 - 胆拖
                arcNumArr = this._returnArcBallArr(idx == 0 ? 1 : 2);
                tempArcArr = idx == 0 ? arcNumArr : [];

            } else if (playid == '9') {
                // 二不同 - 标准
                arcNumArr = this._returnArcBallArr(2);

            } else if (playid == 14) {
                // 双面盘
                if (idx == 0) {
                    tempArcInt = Math.floor(Math.random() * 4);
                }
                arcNumArr = tempArcInt == idx ? this._returnArcBallArr(1) : [];

            } else if (playid == '15') {
                // 三同号
                if (idx == 0) {
                    tempArcInt = Math.floor(Math.random() * 2);
                }
                arcNumArr = tempArcInt == idx ? this._returnArcBallArr(1) : [];
            }

        } else if (js_tag == 'lhc') {
            if (playid == '8' || playid == '22' || playid == '26') {
                // 特肖-合肖 || 二连肖 || 2连尾
                arcNumArr = this._returnArcBallArr(2);

            } else if (playid == '23' || playid == '27') {
                // 三连肖 || 3连尾
                arcNumArr = this._returnArcBallArr(3);

            } else if (playid == '24' || playid == '28') {
                // 四连肖 || 4连尾
                arcNumArr = this._returnArcBallArr(4);

            } else if (playid == '25' || playid == '29') {
                // 五连肖 || 5连尾
                arcNumArr = this._returnArcBallArr(5);
            }

        } else if (js_tag == 'xync') {
            if (playid == 1) {
                if (idx == 0) {
                    tempArcInt = Math.floor(Math.random() * 9);
                }
                arcNumArr = tempArcInt == idx ? this._returnArcBallArr(1) : [];
            }
        }


        // 小到大排序
        if (arcNumArr.length > 1) {
            for (var x = 0; x < arcNumArr.length - 1; x++) {
                for (var y = 0; y < arcNumArr.length - 1 - x; y++) {

                    if (arcNumArr[y] > arcNumArr[y + 1]) {
                        let tempa = arcNumArr[y];
                        arcNumArr[y] = arcNumArr[y + 1];
                        arcNumArr[y + 1] = tempa;
                    }
                }
            }
        }

        this._returnBallsData(arcNumArr);  // 根据选择的下标回调 ball、peilv

        this.setState({
            selectBallIdxArr: arcNumArr,
        })
    }

    // 传入个数，返回随机的数组。不重复！
    _returnArcBallArr(count, lenght) {
        let arcArr = [];
        for (let i = 0; i < 100; i++) {
            let arcInt = Math.floor(Math.random() * (lenght ? lenght : this.props.balls.length));
            // 如果存在，就不加入数组。
            if ((!arcArr.includes(arcInt)) && (!tempArcArr.includes(arcInt))) {
                arcArr.push(arcInt);
                if (arcArr.length >= count) {
                    break; // 个数够了，就退出循环。
                }
            }
        }
        return arcArr;
    }

    _selectBalls(item) {
        var ballIdxArr = this.state.selectBallIdxArr;

        if (ballIdxArr.includes(item.index)) {
            // 存在，删除
            for (let idx in ballIdxArr) {
                if (ballIdxArr[idx] == item.index) {
                    ballIdxArr.splice(idx, 1);
                    break;
                }
            }

        } else {
            // 没有值，直接存
            if (ballIdxArr.length <= 0) {
                ballIdxArr.push(item.index);

            } else {

                // 选号限制个数。// 合肖（11个）、连肖（6个）、连尾（6个）
                let tpl11 = this.props.js_tag == 'lhc' && this.props.tpl == '7';
                let tpl6 = this.props.js_tag == 'lhc' && (this.props.tpl == '14' || this.props.tpl == '15');
                let k3 = this.props.js_tag == 'k3' && (this.props.playid == '8' || this.props.playid == '10');

                if (tpl11 || tpl6) {
                    let len = tpl11 ? 11 : 6;

                    if (ballIdxArr.length >= len) {
                        ballIdxArr.splice(0, 1); // 删除第一位
                    }

                } else if (k3) {
                    if (lastIdx == 0 && this.props.playid == '10') {
                        ballIdxArr = [];
                    } else {
                        if (ballIdxArr.length >= 5) {
                            ballIdxArr.splice(0, 1); // 删除第一位
                        }
                    }
                }

                // 有值，按大小插入
                for (let idx in ballIdxArr) {
                    if (item.index <= ballIdxArr[idx]) {
                        ballIdxArr.splice(idx, 0, item.index);
                        break;
                    } else if (idx == ballIdxArr.length - 1) {
                        ballIdxArr.push(item.index);
                    }
                }

                // 没有值，直接存 是防止ballIdxArr 为空。
                if (ballIdxArr.length <= 0) {
                    ballIdxArr.push(item.index);
                }

            }
        }

        this.setState({
            selectBallIdxArr: ballIdxArr,
        })
        this._returnBallsData(ballIdxArr); // 根据选择的ball下标 返回ball、peilv。
    }

    // 根据选择的ball下标 返回ball、peilv。
    _returnBallsData(selectBallIdxArr) {

        var selectBallArr = [], selectBallNumArr = [], selectPeilvs = [];
        for (let a = 0; a < selectBallIdxArr.length; a++) {
            let idx = selectBallIdxArr[a];
            let ball = this.props.balls[idx].ball;
            selectBallArr.push(`${ball}`);

            let k3hz = this.props.js_tag == 'k3' && this.props.playid == '1'; // k3和值
            let k3th = this.props.js_tag == 'k3' && this.props.playid == '7'; // 二同号

            let preg = /^([\d]|[\d][\d])$/; // [\d] === [0-9] 查找数字
            if (!preg.test(ball) || k3hz || k3th) {
                // 非数字的ball 要返回数字下标。
                let tpl = this.props.tpl;
                if ((tpl == '6' || tpl == '7' || tpl == '8' || tpl == '14') && this.props.js_tag == 'lhc') {
                    // 特肖、平特一肖 || 合肖 || 五行 || 二三四五连肖 下标从1开始
                    selectBallNumArr.push(`${idx + 1}`);

                } else if (k3th) {
                    selectBallNumArr.push(`${idx + 1}`);  // 二同号下标从1开始。

                } else {
                    // 如果.ballNum不为null。那就是双面盘的。
                    if (this.props.balls[idx].ballNum != null) {
                        selectBallNumArr.push(`${this.props.balls[idx].ballNum}`);
                    } else {
                        selectBallNumArr.push(`${idx}`);
                    }
                }
            }

            let peilv = this.props.balls[idx].peilv;
            let isSMP = this.props.balls[idx].ballNum != null; // 双面盘不返回赔率。在下注拼接时根据下标去获取。
            if (peilv != null && !isSMP) {
                selectPeilvs.push(this.props.balls[idx].peilv);
            }
        }

        let ballsdata = { [this.props.title]: selectBallArr };
        if (selectBallNumArr.length > 0) {
            ballsdata[`${this.props.title}^^01`] = selectBallNumArr;
        }

        if (selectPeilvs.length > 0) {
            ballsdata['赔率'] = selectPeilvs;
        }
        this.props.ballClick ? this.props.ballClick(ballsdata) : null;
    }

    _renderItemView(item) {

        let numColumn = this.props.numColumn;
        let ballWidth = this.props.style.width / numColumn - Adaption.Width(this.props.spaceWidth > 0 ? this.props.spaceWidth : 15);
        let ballHeight = Adaption.Width(this.props.itemHeight > 0 ? this.props.itemHeight : (item.item.ballNumDec ? 70 : 40));

        let spaceW = (this.props.style.width - (ballWidth * numColumn)) / (numColumn + 1);   //（item的宽 - 4个圆的宽）除4个间隔
        let spaceH = Adaption.Width(15);

        let itemIsSelect = this.state.selectBallIdxArr.includes(item.index); // 是不是选择状态的

        return (
            <View>
                <TouchableOpacity activeOpacity={0.6}
                    style={{
                        width: ballWidth, height: ballHeight, marginLeft: spaceW, marginTop: spaceH, justifyContent: 'center', alignItems: 'center',
                        borderRadius: 3, borderColor: itemIsSelect ? '#e33939' : '#cccccc', borderWidth: 1, backgroundColor: itemIsSelect ? '#e33939' : '#fff',
                    }}
                    onPress={() => {
                        lastBall = item.index;
                        lastIdx = this.props.idx;
                        this._selectBalls(item);
                    }}>

                    <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(item.item.ballNumDec ? 23 : (item.item.ball.length > 3 ? 18 : 20)), color: itemIsSelect ? '#fff' : '#e33939' }}>{item.item.ball}</Text>
                    {item.item.ballNumDec ?
                        <Text allowFontScaling={false} style={{ marginTop: 5, fontSize: Adaption.Font(item.item.ballNumDec.length == 14 ? 16.5 : 18.5), color: itemIsSelect ? '#fff' : '#e33939' }}>{item.item.ballNumDec}</Text>
                        : null
                    }

                </TouchableOpacity>

                {item.item.peilv ?
                    <View style={{ height: Adaption.Width(18), marginTop: 5 }}>
                        <Text allowFontScaling={false} style={{ textAlign: 'center', fontSize: Adaption.Font(17), color: '#757575' }}>{GetBallStatus.peilvHandle(item.item.peilv)}</Text>
                    </View>
                    : null
                }
            </View>
        )
    }

    render() {

        let _lhc = this.props.js_tag == 'lhc' && this.props.tpl == 7;  // lhc合肖

        return (
            <View style={this.props.style}>

                <View style={{ width: this.props.style.width, height: Adaption.Width(50), flexDirection: 'row', alignItems: 'center' }}>
                    <ImageBackground resizeMode={'contain'} source={require('../img/ic_defaultClick.png')}
                        style={{ width: Adaption.Width(80), height: Adaption.Width(50), marginLeft: Adaption.Width(10), justifyContent: 'center', alignItems: 'center' }}
                    >
                        <Text allowFontScaling={false} style={{ backgroundColor: 'rgba(0,0,0,0)', color: '#707070', fontSize: Adaption.Font(18, 15) }}>{this.props.title}</Text>
                    </ImageBackground>

                    {_lhc && this.props.singlePeilv
                        ? <Text style={{ marginLeft: Adaption.Width(20), color: '#707070', fontSize: Adaption.Font(17, 14) }}>{`赔率（${this.props.singlePeilv}）`}</Text>
                        : null
                    }
                </View>

                <FlatList style={{ marginBottom: Adaption.Width(10), marginTop: Adaption.Width(-10), width: this.props.style.width }}
                    automaticallyAdjustContentInsets={false}
                    alwaysBounceHorizontal={false}
                    data={this.props.balls}
                    renderItem={(item) => this._renderItemView(item)}
                    keyExtractor={(item, index) => { return String(index) }}
                    horizontal={false}
                    numColumns={this.props.numColumn}
                    scrollEnabled={false}
                >
                </FlatList>
                {this.props.isShowTitlt ? <View style={{ height: 0.5, width: this.props.style.width, backgroundColor: '#dadada' }}></View> : null}
            </View>
        )
    }

}

