/**
 Created by Money on 2018/07/17

   投注选号View的总管家

   请不要格式化代码，谢谢！。
 */

import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Vibration,
} from 'react-native';

import RNShakeEvent from 'react-native-shake-event';  //导入检测震动方法

import NewBalls0_9Peilv from './NNewBalls0_9Peilv';
import SingleInputView from './NSingleInputView';

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
        let aa = nextProps.peilvDataArr != this.props.peilvDataArr; //数据改变
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
        }
    }

    // 选号回调处理方法。
    _ballsHandle(selectBalls, value) {

        let ballDict = this.state.ballsData;

        // Object.assign方法，一旦遇到同名属性会替换，没有同名就是添加。
        Object.assign(ballDict, selectBalls);

        // 号码为空。要删除存在的key
        let ballArr = Object.values(selectBalls);
        if (ballArr[0].length <= 0) {
            let tit = Object.keys(selectBalls)[0];
            delete ballDict[tit]; // 删除为空的key

            if (ballDict[`${tit}0`] != null) { // 可能还有一个`${title}0`的，也要删除。
                delete ballDict[`${tit}0`];
            }

            if (ballDict[`赔率`] != null) { // 可能还有一个赔率的，也要删除。
                delete ballDict[`赔率`];
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
                    if (keyArr.includes(`${title}0`)) {
                        // k3二同号 / 大小单双。要多一个
                        Object.assign(newBallDic, { [`${title}0`]: ballDict[`${title}0`] });
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
    _balls09PeilvCreateView(values, balls, viewHeight, numColumn) {

        if (balls.length <= 0) {
            return [];
        }

        let contentArr = values.content.length > 0 ? values.content.split('+') : [values.playname];
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

        var blockViews = [];
        for (let i = 0; i < contentArr.length; i++) {
            blockViews.push(
                <NewBalls0_9Peilv key={i} style={{ width: SCREEN_WIDTH, height: Adaption.Width(viewHeight) }}
                    balls={balls}  // 要显示的号码
                    title={contentArr[i]}  // 左上角的title
                    numColumn={numColumn} // 每行显示几个号码
                    isBallsChange={this.state.isBallsChange ? true : false} // 是否随机
                    clearAllBalls={this.state.clearAllBalls ? true : false} // 是否清空号码
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
        var viewHeight = 180;
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
            viewHeight = 7 * 65;
            for (var i = 0; i <= 27; i++) {
                balls.push({ key: i, ball: i })
            }

        } else if (values.tpl == 3) {
            // 任三-组选和值 1〜26
            viewHeight = 7 * 65;
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
            viewHeight = 100;
            let baArr = ['大', '小', '单', '双'];
            for (var i = 0; i < baArr.length; i++) {
                balls.push({ key: i, ball: baArr[i] })
            }

        } else if (values.tpl == 6) {
            viewHeight = 150;
            balls = ['豹子', '顺子', '对子'];

        } else if (values.tpl == 7) {
            // 前、后二组选和值
            viewHeight = 5 * 65;
            for (var i = 1; i <= 17; i++) {
                balls.push({ key: i, ball: i })
            }

        } else if (values.tpl == 9 || values.tpl == 10) {
            // 前、后二直选和值  // 任二 直选和值
            viewHeight = 5 * 65;
            for (var i = 0; i <= 18; i++) {
                balls.push({ key: i, ball: i })
            }
        }

        return this._balls09PeilvCreateView(values, balls, viewHeight, 5);
    }


    _11x5CreateViews(values) {
        var viewHeight = 180;
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

        return this._balls09PeilvCreateView(values, balls, viewHeight, 6);
    }


    _3dCreateViews(values) {
        var viewHeight = 180;
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
            viewHeight = 6 * 90;
            for (let i = 0; i <= 27; i++) {
                balls.push(`${i}`);
            }

        } else if (values.playid == 6) {
            // 三星组三和值
            viewHeight = 6 * 90;
            for (let i = 1; i <= 26; i++) {
                balls.push(`${i}`);
            }

        } else if (values.playid == 7) {
            // 三星组六和值
            viewHeight = 5 * 90;
            for (let i = 3; i <= 24; i++) {
                balls.push(`${i}`);
            }
        }
        return this._balls09PeilvCreateView(values, balls, viewHeight, 5);
    }


    _pk10CreateViews(values) {
        var viewHeight = 180;
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
        return this._balls09PeilvCreateView(values, balls, viewHeight, 5);
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
                <ScrollView style={{ height: this.props.style.height, marginTop: Adaption.Width(15), }}
                    key={this.props.currentPlayData ? this.props.currentPlayData.playid : ''}
                    automaticallyAdjustContentInsets={false}
                    alwaysBounceHorizontal={false}
                    showsVerticalScrollIndicator={true} // 显示滚动条
                    contentContainerStyle={{ paddingBottom: 25 }}
                >
                    {this.props.currentPlayData ? this._createBallsBlockView(this.props.currentPlayData) : null}
                </ScrollView>
            </View>
        );
    }

}
