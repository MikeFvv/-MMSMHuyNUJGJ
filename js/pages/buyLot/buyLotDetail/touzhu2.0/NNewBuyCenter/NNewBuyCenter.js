/**
 Created by Money on 2018/07/17

   投注选号View的总管家

   请不要格式化代码，谢谢！。
 */

import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Vibration,
} from 'react-native';

import RNShakeEvent from 'react-native-shake-event';  //导入检测震动方法
import GetBallStatus from '../newBuyTool/GetBallStatus';

import NewBalls0_9Peilv from './NNewBalls0_9Peilv';
import SingleInputView from './NSingleInputView';
import NSquareBallsView from './NNSquareBallsView';
import NPokerView from './NPokerView';

export default class NNewBuyCenter extends Component {

    constructor(props) {
        super(props);

        this.state = {
            ballsData: {}, // 选择的号码
            isBallsChange: false, // 随机
            clearAllBalls: false, // 清空
            TitlesArr: [], // 1.渲染视图时 把titArr 和ballsArr存起来。
            BallAsrr: [], // 2.避免切换玩法时 没有选号直接进入购物车里面点机选一注拿不到要机选的号码。
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    // 返回是否要刷新render
    shouldComponentUpdate(nextProps, nextState) {
        let aa = nextProps.peilvDataArr != this.props.peilvDataArr || nextProps.shopCarZhushuNum != this.props.shopCarZhushuNum; //数据改变
        let bb = nextProps.currentPlayData != this.props.currentPlayData; // 当前玩法数据改变
        let cc = nextState.clearAllBalls != this.state.clearAllBalls;  // 清空选号
        let ee = nextState.isBallsChange == true; // 是否机选
        let ff = Object.keys(nextState.ballsData)[0] != null; // 有选号内容的。 主要为六合连码改赔率、K3 11X5不能选相同号
        if (aa || bb || cc || ee || ff) {
            return true;
        } else {
            return false;
        }
    }


    componentDidMount() {
        //添加摇一摇监听
        RNShakeEvent.addEventListener('shake', () => {
            // speed == '1', 属于高频彩，设置为都可以摇一摇选号
            if (this.props.speed == '1' && global.isInBuyLotVC == true && global.isOpenShake == true) {
                Vibration.vibrate([0, 1000], false); //false 表示只震动一次
                this.setState({
                    isBallsChange: true,
                })
            }
        })

        //清空号码的通知
        this.subscription = PushNotification.addListener('ClearAllBalls', () => {
            this.setState({
                clearAllBalls: true,
            })
        });
    }

    //移除通知和摇一摇监听
    componentWillUnmount() {

        if (typeof (this.subscription) == 'object') {
            this.subscription && this.subscription.remove();
        }

        RNShakeEvent.removeEventListener('shake');
    }


    _createBallsBlockView(Values) {
        if (Object.keys(Values).length <= 0) {
            return [];
        }

        if (this.props.js_tag == 'ssc') {
            return this._sscCreateViews(Values);

        } else if (this.props.js_tag == '11x5') {
            return this._11x5CreateViews(Values);

        } else if (this.props.js_tag == '3d') {
            return this._3dCreateViews(Values);

        } else if (this.props.js_tag == 'pk10') {
            return this._pk10CreateViews(Values);

        } else if (this.props.js_tag == 'lhc') {
            return this._lhcCreateViews(Values);

        } else if (this.props.js_tag == 'qxc') {
            return this._qxcCreateViews(Values); // 海南七星彩

        } else if (this.props.js_tag == 'xync') {
            return this._xyncCreateViews(Values); // 幸运农场

        } else if (this.props.js_tag == 'xypk') {
            return this._xypkCreateViews(Values); // 幸运扑克
        }
    }

    // 选号回调处理方法。
    _ballsHandle(selectBalls, value) {

        let ballDict = this.state.ballsData;

        // lhc特殊的加个赔率
        if (this.props.js_tag == 'lhc') {
            let peilvStr = this._getPeilvWithPlayid(value.playid);

            if (value.tpl == '7' || value.tpl == '12') {
                // 特肖-合肖 || 自选不中
                let baseIdx = value.tpl == '7' ? 2 : 6;  // 合肖2个号，自选不中要6个号
                let tit = Object.keys(selectBalls)[0];
                let ballsLength = selectBalls[tit].length;
                if (ballsLength >= baseIdx && ballsLength <= 11) {
                    // 自选不中，6个号码至11个号码 拿赔率。小于6就把赔率搞为0；
                    selectBalls['赔率'] = peilvStr.split('|')[ballsLength - baseIdx];
                } else {
                    selectBalls['赔率'] = '0.0';
                }
            } else if (value.tpl == '13' || value.tpl == '14' || value.tpl == '15') {
                // 连码 || 连选-连肖、连尾
                if (peilvStr.length < 20) {
                    selectBalls['赔率'] = peilvStr;
                }
            }

            // 自选 统一输入金额的。
            if (this.props.wanfaindex == 0 && ballDict['LhcPrice'] == null && selectBalls['LhcPrice'] == null && this.refs.PriceInput) {
                let price = this.refs.PriceInput._lastNativeText ? this.refs.PriceInput._lastNativeText : '0';
                selectBalls['LhcPrice'] = price;
            }
        }

        // Object.assign方法，一旦遇到同名属性会替换，没有同名就是添加。
        Object.assign(ballDict, selectBalls);

        // 号码为空。要删除存在的key
        let ballArr = Object.values(selectBalls);
        if (ballArr[0].length <= 0) {
            let tit = Object.keys(selectBalls)[0];
            delete ballDict[tit]; // 删除为空的key

            if (ballDict[`${tit}^^01`] != null) { // 可能还有一个`${title}^^01`的，也要删除。
                delete ballDict[`${tit}^^01`];
            }

            if (ballDict[`赔率`] != null) { // 可能还有一个赔率的，也要删除。
                delete ballDict[`赔率`];
            }

            if (ballDict[`LhcPrice`] != null) { // 六合彩自选的价格
                delete ballDict[`LhcPrice`];
            }
        }

        // 万千百十个位的按顺序存放
        let newBallDic = {};
        let keyArr = Object.keys(ballDict);
        // 时时彩 任选的ballDict加了rx_title的字段不能执行这个
        if (keyArr.length > 1 && ballDict.赔率 == null && value.leftTitles.length > 1) {
            for (b in value.leftTitles) {
                let title = value.leftTitles[b];
                if (keyArr.includes(title)) {
                    Object.assign(newBallDic, { [title]: ballDict[title] });
                    if (keyArr.includes(`${title}^^01`)) {
                        // k3二同号 / 大小单双。要多一个
                        Object.assign(newBallDic, { [`${title}^^01`]: ballDict[`${title}^^01`] });
                    }
                }
            }
            ballDict = newBallDic;
        }

        this.setState({
            ballsData: ballDict,
        })
        return ballDict;
    }

    // 创建Balls0_9Peilv的视图  H:80 NoPeilv H:65   
    _balls09PeilvCreateView(values, balls, numColumn, contents) {

        if (balls.length <= 0) {
            return [];
        }

        let contentArr = contents && contents.length > 0 ? contents : (values.content.includes('+') ? values.content.split('+') : [values.playname]);
        let peilvArr = this._getPeilvWithPlayid(values.playid).split('|');
        this.state.BallAsrr = [];

        // 胆码|1 拖码|2，截断|后面的
        if (values.content.includes('|')) {
            for (let a = 0; a < contentArr.length; a++) {
                contentArr[a] = contentArr[a].split('|')[0];
            }
        }

        // 不显示赔率的。传入的balls包括key和ball。 
        if (balls[0].key == null) {
            for (let k = 0; k < balls.length; k++) {
                balls[k] = { key: k, ball: balls[k] };
                if (peilvArr.length > 1) {
                    balls[k].peilv = peilvArr[k] ? peilvArr[k] : '0.0';
                }
            }
        }
        this.state.BallAsrr = balls;

        this.state.TitlesArr = contentArr;

        let singlePeilv = '';
        if (this.props.js_tag == 'lhc' && (values.tpl == 12 || values.tpl == 13)) {
            if (values.tpl == 12) {
                // 自选不中
                singlePeilv = this.state.ballsData['赔率'] ? this.state.ballsData['赔率'] : '0.0';
            } else {
                // 连码
                singlePeilv = peilvArr.join('|');
                if (values.playid == 30) {
                    singlePeilv = [`${GetBallStatus.peilvHandle(peilvArr[0])}(中二) / ${GetBallStatus.peilvHandle(peilvArr[1])}(中三)`];
                } else if (values.playid == 33) {
                    singlePeilv = [`${GetBallStatus.peilvHandle(peilvArr[0])}(中特) / ${GetBallStatus.peilvHandle(peilvArr[1])}(中二)`];
                }
            }
        }

        var blockViews = [];
        for (let i = 0; i < contentArr.length; i++) {
            blockViews.push(
                <NewBalls0_9Peilv key={i} style={{ width: SCREEN_WIDTH }}
                    balls={balls}  // 要显示的号码
                    title={contentArr[i]}  // 左上角的title
                    numColumn={numColumn} // 每行显示几个号码
                    isBallsChange={this.state.isBallsChange ? true : false} // 是否随机
                    clearAllBalls={this.state.clearAllBalls ? true : false} // 是否清空号码
                    singlePeilv={singlePeilv}
                    idx={i}  // 主要是记录是第几排的。 随机用到！
                    js_tag={this.props.js_tag}
                    tpl={values.tpl}
                    playid={values.playid}
                    ballClick={(selectBalls) => {
                        let val = { leftTitles: contentArr, playid: values.playid, tpl: values.tpl };
                        let dict = this._ballsHandle(selectBalls, val);
                        this.props.ballsClick ? this.props.ballsClick(dict, this.props.currentPlayData, this.state.TitlesArr, this.state.BallAsrr) : null;
                        // 选了号码回来了，要重新设为false。
                        this.setState({
                            isBallsChange: false,
                            clearAllBalls: false,
                        })
                    }}
                >
                </NewBalls0_9Peilv>
            );
        }
        return blockViews;
    }

    _ballsSquareCreateView(values, balls, numColumn, itemHeight, spaceWidth) {
        if (balls.length <= 0) { return [] }

        let contentArr = values.content.includes('+') ? values.content.split('+') : [values.playname];
        let peilvArr = this._getPeilvWithPlayid(values.playid).split('|');
        this.state.BallAsrr = [];

        // 胆码|1 拖码|2，截断|后面的
        if (values.content.includes('|')) {
            for (let a = 0; a < contentArr.length; a++) {
                contentArr[a] = contentArr[a].split('|')[0];
            }
        }

        let playid = values.playid;
        let xyncSMP = this.props.js_tag == 'xync' && playid == 1;
        if (xyncSMP) {
            if (xyncSMP) {
                contentArr = ['总和', '第一球', '第二球', '第三球', '第四球', '第五球', '第六球', '第七球', '第八球'];
            }

        } else {
            // 拼好balls需要的数据,
            for (let i = 0; i < balls.length; i++) {
                if (balls[i].ball != null) {
                    balls[i].key = i;
                    if (peilvArr.length > 1 && (values.tpl != 7 && this.props.js_tag == 'lhc')) {
                        balls[i].peilv = peilvArr[i];
                    }
                } else {
                    balls[i] = { key: i, ball: balls[i] };
                    if (peilvArr.length > 1) {
                        balls[i].peilv = peilvArr[i];
                    }
                }
            }
            this.state.BallAsrr = balls;
        }

        this.state.TitlesArr = contentArr;

        let singlePeilv = '';
        if (this.props.js_tag == 'lhc' && values.tpl == 7) {
            // 合肖
            singlePeilv = this.state.ballsData['赔率'] ? this.state.ballsData['赔率'] : '0.0';
        }

        var blockViews = [];
        for (let i = 0; i < contentArr.length; i++) {

            if (xyncSMP) {
                balls = i == 0 ? ['总和大', '总和小', '总和单', '总和双', '总和尾大', '总和尾小', '龙', '虎'] : ['大', '小', '单', '双', '尾大', '尾小', '合数单', '合数双'];

                for (let b = 0; b < balls.length; b++) {
                    balls[b] = { key: b, ball: balls[b] };
                }
                this.state.BallAsrr = [...this.state.BallAsrr, ...balls];
            }

            blockViews.push(
                <NSquareBallsView key={i} style={{ width: SCREEN_WIDTH }}
                    balls={balls}
                    title={contentArr[i]}
                    numColumn={numColumn} // 每行显示几个号码
                    itemHeight={itemHeight}
                    spaceWidth={spaceWidth}
                    isBallsChange={this.state.isBallsChange ? true : false} // 是否随机
                    clearAllBalls={this.state.clearAllBalls ? true : false} // 是否清空号码
                    singlePeilv={singlePeilv}
                    idx={i}  // 主要是记录是第几排的。 随机用到！
                    js_tag={this.props.js_tag}
                    tpl={values.tpl}
                    playid={values.playid}
                    ballClick={(selectBalls) => {
                        let val = { leftTitles: contentArr, playid: values.playid, tpl: values.tpl };
                        let dict = this._ballsHandle(selectBalls, val);
                        this.props.ballsClick ? this.props.ballsClick(dict, this.props.currentPlayData, this.state.TitlesArr, this.state.BallAsrr) : null;
                        // 选了号码回来了，要重新设为false。
                        this.setState({
                            isBallsChange: false,
                            clearAllBalls: false,
                        })
                    }}
                >
                </NSquareBallsView>
            )
        }
        return blockViews;
    }

    // 扑克
    _pokerCreateView(values, balls, numColumn, itemHeight, spaceWidth) {
        if (balls.length <= 0) { return [] }

        let contentArr = values.content.length > 0 ? values.content.split('+') : [values.playname];
        let peilvArr = this._getPeilvWithPlayid(values.playid).split('|');

        // 拼好balls需要的数据,
        for (let i = 0; i < balls.length; i++) {
            balls[i] = { key: i, ball: balls[i] };
            if (peilvArr.length > 1) {
                balls[i].peilv = peilvArr[i];
            }
        }
        this.state.BallAsrr = balls;
        this.state.TitlesArr = contentArr;

        var blockViews = [];
        for (let i = 0; i < contentArr.length; i++) {
            blockViews.push(
                <NPokerView key={i} style={{ width: SCREEN_WIDTH }}
                    balls={balls}
                    title={contentArr[i]}
                    numColumn={numColumn}
                    itemHeight={itemHeight}
                    spaceWidth={spaceWidth}
                    isBallsChange={this.state.isBallsChange ? true : false} // 是否随机
                    clearAllBalls={this.state.clearAllBalls ? true : false} // 是否清空号码
                    singlePeilv={peilvArr.length == 1 && peilvArr[0].length > 0 ? peilvArr[0] : null} // 顶部显示赔率
                    js_tag={this.props.js_tag}
                    tpl={values.tpl}
                    playid={values.playid}
                    ballClick={(selectBalls) => {
                        let val = { leftTitles: contentArr, playid: values.playid, tpl: values.tpl };
                        let dict = this._ballsHandle(selectBalls, val);
                        this.props.ballsClick ? this.props.ballsClick(dict, this.props.currentPlayData, this.state.TitlesArr, this.state.BallAsrr) : null;
                        // 选了号码回来了，要重新设为false。
                        this.setState({
                            isBallsChange: false,
                            clearAllBalls: false,
                        })
                    }}
                >
                </NPokerView>
            )
        }
        return blockViews;
    }

    // 创建单式的视图 
    _createSingleInputView(values) {

        let playid = values.playid;
        let contentArr = ['号码'], balls = [];
        var defaultBalls = '1 2 3';
        if (this.props.js_tag == '3d' && playid == 2) {
            contentArr = ['百位', '十位', '个位'];
            for (let i = 0; i < 10; i++) {
                balls.push({ key: i, ball: i })
            }

        } else if (this.props.js_tag == 'pk10') {
            if (playid == 3) {
                contentArr = ['冠军', '亚军']; // 前二直选单式
                defaultBalls = '1 2';

            } else if (playid == 5) {
                contentArr = ['冠军', '亚军', '季军']; // 前三直选单式
            }

            for (var i = 1; i <= 10; i++) {
                balls.push({ key: i, ball: i < 10 ? `0${i}` : `${i}` })
            }

        } else if (this.props.js_tag == '11x5') {
            if (playid == 2) {
                contentArr = ['第一位', '第二位', '第三位']; // 前三直选单式

            } else if (playid == 7) {
                contentArr = ['第二位', '第三位', '第四位']; // 中三直选单式

            } else if (playid == 12) {
                contentArr = ['第三位', '第四位', '第五位']; // 后三直选单式

            } else if (playid == 4 || playid == 9 || playid == 14) {
                contentArr = ['号码'];  // 前\中\后三组选单式

            } else if (playid == 17) {
                contentArr = ['第一位', '第二位']; // 前二直选单式
                defaultBalls = '1 2';

            } else if (playid == 22) {
                contentArr = ['第四位', '第五位']; // 后二直选单式
                defaultBalls = '1 2';

            } else if (playid == 19 || playid == 24) {
                contentArr = ['号码']; // 前\后二组选单式
                defaultBalls = '1 2';

            } else if (playid == 38) {
                // 任选一中一
                defaultBalls = '1';
            } else if (playid == 39) {
                // 任选二中二
                defaultBalls = '1 2';
            } else if (playid == 40) {
                // 任选三中三
                defaultBalls = '1 2 3';
            } else if (playid == 41) {
                // 任选四中四
                defaultBalls = '1 2 3 4';
            } else if (playid == 42) {
                // 任选五中五
                defaultBalls = '1 2 3 4 5';
            } else if (playid == 43) {
                // 任选六中五
                defaultBalls = '1 2 3 4 5 6';
            } else if (playid == 44) {
                // 任选七中五
                defaultBalls = '1 2 3 4 5 6 7';
            }

            for (let i = 1; i <= 11; i++) {
                balls.push({ key: i, ball: i })
            }

        } else if (this.props.js_tag == 'ssc') {
            if (playid == 2) {
                defaultBalls = '1 2 3 4 5';
                contentArr = ['万位', '千位', '百位', '十位', '个位']; // 五星-直选单式

            } else if (playid == 4) {
                defaultBalls = '1 2 3 4';
                contentArr = ['千位', '百位', '十位', '个位']; // 后四直选单式

            } else if (playid == 95) {
                defaultBalls = '1 2 3 4';
                contentArr = ['万位', '千位', '百位', '十位']; // 前四直选单式

            } else if (playid == 6) {
                defaultBalls = '1 2 3';
                contentArr = ['百位', '十位', '个位']; // 后三直选单式

            } else if (playid == 20) {
                defaultBalls = '1 2 3';
                contentArr = ['万位', '千位', '百位']; // 前三直选单式

            } else if (playid == 102) {
                defaultBalls = '1 2 3';
                contentArr = ['千位', '百位', '十位']; // 中三直选单式

            } else if (playid == 11 || playid == 25 || playid == 107) {
                defaultBalls = '1 1 2';
                contentArr = ['组三']; // 后|前|中三组三单式

            } else if (playid == 13 || playid == 27 || playid == 109) {
                defaultBalls = '1 2 3';
                contentArr = ['组六']; // 后|前|中三组六单式

            } else if (playid == 116) {
                defaultBalls = '1 2';
                contentArr = ['十位', '个位']; // 后二直选单式

            } else if (playid == 34) {
                defaultBalls = '1 2';
                contentArr = ['万位', '千位']; // 前二直选单式

            } else if (playid == 120 || playid == 38) {
                defaultBalls = '1 2';
                contentArr = ['组选']; // 后|前二组选单式
            }

            for (let i = 0; i < 10; i++) {
                balls.push({ key: i, ball: i })
            }
        }


        // 购物车机选用到。
        this.state.TitlesArr = contentArr;
        this.state.BallAsrr = balls;

        return (
            <SingleInputView style={{}}
                playname={values.playname}
                defaultBalls={defaultBalls}
                playTitle={values.play_title}
                js_tag={this.props.js_tag}
                playid={values.playid}
                clearAllBalls={this.state.clearAllBalls ? true : false} // 是否清空号码
                ballClick={(selectBalls) => {
                    console.log(selectBalls);

                    let val = { leftTitles: [values.playname], playid: values.playid, tpl: values.tpl };
                    let dict = this._ballsHandle(selectBalls, val);

                    this.props.ballsClick ? this.props.ballsClick(dict, this.props.currentPlayData, this.state.TitlesArr, this.state.BallAsrr) : null;
                    // 选了号码回来了，要重新设为false。
                    this.setState({
                        clearAllBalls: false,
                    })
                }}>

            </SingleInputView>
        )
    }

    _sscCreateViews(values) {
        var balls = [];

        if (values.tpl == 0) {
            for (var i = 0; i < 10; i++) {
                balls.push({ key: i, ball: i })
            }

        } else if (values.tpl == 1 || values.tpl == 8) {
            // 单式
            return this._createSingleInputView(values);

        } else if (values.tpl == 2) {
            // 前\中\后三 直选和值 0〜27
            for (var i = 0; i <= 27; i++) {
                balls.push({ key: i, ball: i })
            }

        } else if (values.tpl == 3) {
            // 任三-组选和值 1〜26
            for (var i = 1; i <= 26; i++) {
                balls.push({ key: i, ball: i })
            }

        } else if (values.tpl == 4) {
            // 组选包胆
            for (var i = 0; i < 10; i++) {
                balls.push({ key: i, ball: i })
            }

        } else if (values.tpl == 5) {
            // 大小单双
            let baArr = ['大', '小', '单', '双'];
            for (var i = 0; i < baArr.length; i++) {
                balls.push({ key: i, ball: baArr[i] })
            }

        } else if (values.tpl == 6) {
            balls = ['豹子', '顺子', '对子'];

        } else if (values.tpl == 7) {
            // 前、后二组选和值
            for (var i = 1; i <= 17; i++) {
                balls.push({ key: i, ball: i })
            }

        } else if (values.tpl == 9 || values.tpl == 10) {
            // 前、后二直选和值  // 任二 直选和值
            for (var i = 0; i <= 18; i++) {
                balls.push({ key: i, ball: i })
            }
        }

        return this._balls09PeilvCreateView(values, balls, 5);
    }


    _11x5CreateViews(values) {
        var balls = [];

        if (values.tpl == 0) {
            for (var i = 1; i <= 11; i++) {
                balls.push({ key: i, ball: `${i}` })
            }

        } else if (values.tpl == 1) {
            // 单式
            return this._createSingleInputView(values);

        } else if (values.tpl == 3) {
            // 胆拖
            for (var i = 1; i <= 11; i++) {
                balls.push({ key: i, ball: `${i}` })
            }
        }

        return this._balls09PeilvCreateView(values, balls, 6);
    }


    _3dCreateViews(values) {
        var balls = [];

        if (values.playid == 2) {
            // 三星-直选单式
            return this._createSingleInputView(values);

        } else if (values.tpl == 0) {
            // 不显示赔率
            for (var i = 0; i < 10; i++) {
                balls.push({ key: i, ball: i })
            }

        } else if (values.playid == 3) {
            // 三星直选和值  
            for (let i = 0; i <= 27; i++) {
                balls.push(`${i}`);
            }

        } else if (values.playid == 6) {
            // 三星组三和值
            for (let i = 1; i <= 26; i++) {
                balls.push(`${i}`);
            }

        } else if (values.playid == 7) {
            // 三星组六和值
            for (let i = 3; i <= 24; i++) {
                balls.push(`${i}`);
            }
        }
        return this._balls09PeilvCreateView(values, balls, 5);
    }


    _pk10CreateViews(values) {
        var balls = [];

        if (values.playid == 3 || values.playid == 5) {
            // 前二\三单式
            return this._createSingleInputView(values);

        } else if (values.tpl == 0) {
            // 不显示赔率
            for (var i = 1; i <= 10; i++) {
                balls.push({ key: i, ball: i < 10 ? `0${i}` : `${i}` })
            }
        }
        return this._balls09PeilvCreateView(values, balls, 5);
    }


    _lhcCreateViews(values) {
        var balls = [];
        var numColumn = 4;
        var itemHeight = 0;
        var spaceWidth = 0;

        if (values.tpl == 0) {
            // 特码A B 
            for (var i = 1; i <= 49; i++) {
                balls.push(i < 10 ? `0${i}` : `${i}`);
            }
            return this._balls09PeilvCreateView(values, balls);

        } else if (values.tpl == 1) {
            // 特码两面
            balls = ['特大', '特双', '特小单', '特地肖', '特小', '特大单', '特小双', '特前肖', '特大尾', '特大双', '特合单', '特后肖', '特小尾', '特合大', '特合双', '特家肖', '特单', '特合小', '特天肖', '特野肖'];

        } else if (values.tpl == 2) {
            // 特码色波
            numColumn = 2;
            itemHeight = 120;
            spaceWidth = 30;
            let name = ['红波', '蓝波', '绿波'];
            let ballsNumDec = ['01 02 07 08 12 13 18 19 23 24 29 30 34 35 40 45 46', '03 04 09 10 14 15 20 25 26 31 36 37 41 42 47 48', ' 05 06 11 16 17 21 22 27 28 32 33 38 39 43 44 49'];
            for (let i = 0; i < name.length; i++) {
                balls.push({ ball: name[i], ballNumDec: ballsNumDec[i] });
            }


        } else if (values.tpl == 3) {
            // 特半波
            balls = ['红大', '红小', '红单', '红双', '蓝大', '蓝小', '蓝单', '蓝双', '绿大', '绿小', '绿单', '绿双'];

        } else if (values.tpl == 4) {
            // 特半半波
            balls = ['红大单', '红小单', '红大双', '红小双', '蓝大单', '蓝小单', '蓝大双', '蓝小双', '绿大单', '绿小单', '绿大双', '绿小双'];

        } else if (values.tpl == 5) {
            // 特码尾数
            balls = ['0头', '1头', '2头', '3头', '4头', '1尾', '2尾', '3尾', '4尾', '5尾', '6尾', '7尾', '8尾', '9尾', '0尾'];

        } else if (values.tpl == 6 || values.tpl == 7 || values.tpl == 14) {
            // 特肖、平特一肖 || 合肖 || 二三四五连肖
            numColumn = 3;
            var default_shengxiao = GetBallStatus.getLhcShengxiaoBalls(values.tpl == 7 ? true : false);
            for (let b in default_shengxiao) {
                balls.push({ ball: default_shengxiao[b].name, ballNumDec: default_shengxiao[b].balls.join(' ') });
            }

        } else if (values.tpl == 8) {
            // 五行
            numColumn = 2;
            itemHeight = 100;
            spaceWidth = 35;
            let name = ['金', '木', '水', '火', '土'];
            let ballsNumDec = ['04 05 18 19 26 27 34 35 48 49', '01 08 09 16 17 30 31 38 39 46 47', '06 07 14 15 22 23 36 37 44 45', '02 03 10 11 24 25 32 33 40 41', ' 12  13  20  21  28  29  42  43'];
            for (let i = 0; i < name.length; i++) {
                balls.push({ ball: name[i], ballNumDec: ballsNumDec[i] });
            }

        } else if (values.tpl == 9 || values.tpl == 15) {
            // 平特尾数 || 2345连尾
            numColumn = 3;
            let name = ['0尾', '1尾', '2尾', '3尾', '4尾', '5尾', '6尾', '7尾', '8尾', '9尾'];
            let ballsNumDec = ['10 20 30 40', '01 11 21 31 41', '02 12 22 32 42', '03 13 23 33 43', '04 14 24 34 44', '05 15 25 35 45', '06 16 26 36 46', '07 17 27 37 47', '08 18 28 38 48', '09 19 29 39 49'];
            for (let i = 0; i < name.length; i++) {
                balls.push({ ball: name[i], ballNumDec: ballsNumDec[i] });
            }

        } else if (values.tpl == 10) {
            // 七色波
            balls = ['红波', '蓝波', '绿波', '和局'];
        } else if (values.tpl == 11) {
            // 总肖
            balls = ['2肖', '3肖', '4肖', '5肖', '6肖', '7肖', '总肖单', '总肖双'];

        } else if (values.tpl == 12 || values.tpl == 13) {
            // 自选不中  // 连码  不显示赔率
            for (let i = 1; i <= 49; i++) {
                balls.push({ key: i, ball: i < 10 ? `0${i}` : `${i}` })
            }
            return this._balls09PeilvCreateView(values, balls);
        }

        return this._ballsSquareCreateView(values, balls, numColumn, itemHeight, spaceWidth);
    }

    _qxcCreateViews(values) {
        let playid = values.playid;
        var balls = [];
        var contents = [];

        if (playid == 1 || playid == 2 || playid == 3 || playid == 4) {
            // 一定位 / 二定复式 / 三定复式 / 四定复式
            for (var i = 0; i < 10; i++) {
                balls.push({ key: i, ball: i })
            }
            contents = ['千位', '百位', '十位', '个位'];

        } else if (playid == 5 || playid == 6) {
            // 二字现 / 三字现
            for (var i = 0; i < 10; i++) {
                balls.push({ key: i, ball: i })
            }
        }
        return this._balls09PeilvCreateView(values, balls, 5, contents);
    }


    _xyncCreateViews(values) {
        var numColumn = 4;
        var balls = [];

        if (values.playid == 1) {
            // 双面盘  
            balls = ['大', '小', '单', '双', '尾大', '尾小', '合数单', '合数双'];

        } else {
            // 第？球
            balls = ['1号', '2号', '3号', '4号', '5号', '6号', '7号', '8号', '9号', '10号', '11号', '12号', '13号', '14号', '15号', '16号',
                '17号', '18号', '19号', '20号', '大', '小', '单', '双', '尾大', '尾小', '合数单', '合数双', '东', '南', '西', '北', '中', '发', '白'];
        }
        return this._ballsSquareCreateView(values, balls, numColumn);
    }

    _xypkCreateViews(values) {
        var numColumn = 4;
        var itemHeight = 0;
        var spaceWidth = 0;
        var balls = [];

        if (values.playid == 1) {
            // 包选
            balls = ['对子', '顺子', '同花', '豹子', '同花顺'];
            numColumn = 3;
            itemHeight = 110;

        } else if (values.playid == 4) {
            // 单选顺子
            balls = ['A23', '234', '345', '456', '567', '678', '789', '8910', '91011', '10JQ', 'JQK', 'QKA'];
            numColumn = 3;
            itemHeight = 80;

        } else if (values.playid == 6) {
            // 单选同花顺
            balls = ['黑桃', '红桃', '梅花', '方块'];
            spaceWidth = 30;

        } else if (values.playid == 2) {
            // 单选豹子
            balls = ['AAA', '222', '333', '444', '555', '666', '777', '888', '999', '101010 ', 'JJJ', 'QQQ', 'KKK'];
            numColumn = 3;
            itemHeight = 80;

        } else if (values.playid == 3) {
            // 单选对子
            balls = ['AA', '22', '33', '44', '55', '66', '77', '88', '99', '1010', 'JJ', 'QQ', 'KK'];
            itemHeight = 80;

        } else if (values.playid == 5) {
            // 单选同花
            balls = ['黑桃', '红桃', '梅花', '方块'];
            spaceWidth = 30;

        } else {
            // 任选一
            balls = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
            itemHeight = 80;
        }
        return this._pokerCreateView(values, balls, numColumn, itemHeight, spaceWidth);
    }

    // 根据playid 取到赔率
    _getPeilvWithPlayid(playid) {
        let plDataArr = this.props.peilvDataArr;
        var peilvStr = '';
        for (let a = 0; a < plDataArr.length; a++) {
            if (playid == plDataArr[a].playid) {
                peilvStr = plDataArr[a].peilv;
                break;
            }
        }
        return peilvStr;
    }

    render() {
        if (this.props.currentPlayData == null) { return null };

        return (
            <View style={[this.props.style, { flexDirection: 'row', flex: 1, backgroundColor: '#f3f3f3' }]}>

                {/* 临时的机选按钮 */}
                <TouchableOpacity activeOpacity={0.7} style={{ position: 'absolute', top: 0, left: 0, width: 100, height: Adaption.Width(15) }}
                    onPress={() => { this.setState({ isBallsChange: true }) }}>
                </TouchableOpacity>

                <ScrollView style={{ height: this.props.style.height, marginTop: Adaption.Width(15), }}
                    key={this.props.currentPlayData ? this.props.currentPlayData.playid : ''}
                    automaticallyAdjustContentInsets={false}
                    alwaysBounceHorizontal={false}
                    showsVerticalScrollIndicator={true} // 显示滚动条
                    contentContainerStyle={{ paddingBottom: 25 }}
                >
                    {this.props.currentPlayData ? this._createBallsBlockView(this.props.currentPlayData) : null}
                    <View style={{ width: 1, height: Adaption.Width(60) }}></View>
                </ScrollView>

                {/* 购物车按钮 */}
                <TouchableOpacity activeOpacity={0.9}
                    style={{ position: 'absolute', bottom: Adaption.Width(10), left: Adaption.Width(25), width: Adaption.Width(57), height: Adaption.Width(57), backgroundColor: '#fff', borderWidth: 1.0, borderColor: '#d3d3d3', borderRadius: Adaption.Width(57 * 0.5), justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                        // 购物车回调
                        this.props.shopCarClick ? this.props.shopCarClick(this.props.currentPlayData, this.state.TitlesArr, this.state.BallAsrr) : null;
                    }}>
                    <Image style={{ width: Adaption.Width(33), height: Adaption.Width(33) }} source={require('../../../img/ic_shopCar.png')}></Image>

                    {this.props.shopCarZhushuNum == 0 ? null :
                        <View style={{
                            backgroundColor: '#e33939', width: Adaption.Width(26), height: Adaption.Width(26), borderRadius: Adaption.Width(13),
                            justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: Adaption.Width(26)
                        }}>
                            <Text allowFontScaling={false} style={{ fontSize: this.props.shopCarZhushuNum > 99 ? Adaption.Font(12) : Adaption.Font(15), color: '#fff', backgroundColor: 'rgba(0,0,0,0)' }}>{this.props.shopCarZhushuNum > 99 ? '99+' : this.props.shopCarZhushuNum}</Text>
                        </View>
                    }
                </TouchableOpacity>

            </View>
        );
    }

}
