/**
 Created by Money on 2018/05/30
    单双， 的itemView
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
} from 'react-native';


export default class ItemView_TGOE extends Component {

    constructor(props) {
        super(props);

        this.handleSuperSlt = false;

        if (props.superSltDic['d_key'] && props.superSltDic['d_key'] == props.d_key) {
            // 综合过关，在这场比赛有选号时不为null
            this.handleSuperSlt = true;
            this.state = {
                seleIdx: props.superSltDic['sltIdx'],
            }

        } else {
            this.state = {
                seleIdx: -1,
            }
        }
    }

    _handleSuperSltDic(tit, sltdata) {
        // 回调一下上级选号内容。
        let dict = { sltIdx: this.props.superSltDic['sltIdx'], d_key: this.props.d_key, kTit: tit };
        Object.assign(dict, sltdata);
        this.handleSuperSlt = false;
        this.props.ballClick ? this.props.ballClick([dict]) : null; // 在这里走回调，他居然报警告 不允许我在render回调
    }

    componentWillReceiveProps(nextProps) {
        // 如果是综合过关，切换tabbar后，old_keys[1]为true，一定重置界面的选择状态 为superSltDic的值。其它的seleIdx都要设为: -1,
        if (nextProps.old_keys[1] == true) {

            if (nextProps.superSltDic['d_key'] && nextProps.superSltDic['d_key'] == nextProps.d_key) {
                this.handleSuperSlt = true;
                this.setState({
                    seleIdx: nextProps.superSltDic['sltIdx'],
                })

            } else {
                this.setState({
                    seleIdx: -1,
                })
            }

        } else if (nextProps.d_key != nextProps.slt_key && nextProps.old_keys.includes(nextProps.d_key)) {
            // 不能是当前选择的区 && 之前有选择过的。重置为1。
            this.setState({
                seleIdx: -1,
            })
        }
    }

    // 只刷新 当前选择的，和之前有选择的。 其余的就不刷了 浪费时间。
    shouldComponentUpdate(nextProps, nextState) {
        let aaa = nextProps.d_key != nextProps.slt_key && nextProps.old_keys.includes(nextProps.d_key);
        let bbb = nextState.seleIdx != -1 || nextState.seleIdx != this.state.seleIdx;
        let isRefresh = nextProps.old_keys[0];  // 第0个元素为true时，一定刷新。
        if (aaa || bbb || isRefresh) {
            return true;
        } else {
            return false;
        }
    }

    _centerVews() {
        let numColumn = 2;
        let data = this.props.data;
        let row = data.length / numColumn;
        var viewArr = [];

        for (let a = 0; a < row; a++) {

            var rowView = [];
            for (let b = 0; b < numColumn; b++) {
                let idx = (a * numColumn) + b;
                let isSelect = this.state.seleIdx == idx;

                let kTit = '';
                if (data[idx] != null) {
                    if (this.props.d_key == 'HFT' || this.props.d_key == 'DC') {
                        let k = data[idx]['k'];
                        k = k.replace(/H/g, '主');
                        k = k.replace(/V/g, '客');
                        k = k.replace(/X/g, '和');
                        kTit = k.length == 2 ? `${k.substr(0, 1)} / ${k.substr(1, 1)}` : k;

                    } else if (data[idx]['k'] == 'Odd') {
                        kTit = '单';
                    } else if (data[idx]['k'] == 'Even') {
                        kTit = '双';
                    } else if (data[idx]['k'] == 'Yes') {
                        kTit = '是';
                    } else if (data[idx]['k'] == 'No') {
                        kTit = '不是';
                    } else if (data[idx]['k'] == '1H') {
                        kTit = '上半场';
                    } else if (data[idx]['k'] == '2H') {
                        kTit = '下半场';
                    } else if (data[idx]['k'] == 'X') {
                        kTit = '和局';
                    } else if (data[idx]['k'] == 'q1') {
                        kTit = '开场 - 14:59';
                    } else if (data[idx]['k'] == 'q2') {
                        kTit = '15:00 - 29:59';
                    } else if (data[idx]['k'] == 'q3') {
                        kTit = '30:00 - 下半场';
                    } else if (data[idx]['k'] == 'q4') {
                        kTit = '下半场 - 59:59';
                    } else if (data[idx]['k'] == 'q5') {
                        kTit = '60:00 - 74:59';
                    } else if (data[idx]['k'] == 'q6') {
                        kTit = '75:00 - 全场';
                    } else if (data[idx]['k'] == 'B26M') {
                        kTit = '26分钟或之前';
                    } else if (data[idx]['k'] == 'A27M') {
                        kTit = '27分钟或之后';
                    } else if (data[idx]['k'] == 'NG') {
                        kTit = '无进球';
                    } else if (data[idx]['k'] == 'Shot') {
                        kTit = '射门';
                    } else if (data[idx]['k'] == 'Header') {
                        kTit = '头球';
                    } else if (data[idx]['k'] == 'Penalties') {
                        kTit = '点球';
                    } else if (data[idx]['k'] == 'FK') {
                        kTit = '任意球';
                    } else if (data[idx]['k'] == 'OG') {
                        kTit = '乌龙球';
                    }
                }

                if (isSelect && this.handleSuperSlt) {
                    this._handleSuperSltDic(kTit, data[idx]);
                }

                rowView.push(
                    <TouchableOpacity key={b} activeOpacity={0.8}
                        style={{
                            justifyContent: 'center', alignItems: 'center',
                            width: (SCREEN_WIDTH - 21) / numColumn, height: Adaption.Height(60),
                            borderColor: isSelect ? '#f00' : '#d2d2d2',
                            borderRightWidth: isSelect ? 1 : (b == numColumn - 1 ? 0 : 0.5), borderBottomWidth: isSelect ? 1 : (a == row - 1 ? 0 : 0.5),
                            borderLeftWidth: isSelect ? 1 : 0, borderTopWidth: isSelect ? 1 : 0,
                            backgroundColor: isSelect ? '#fafffa' : 'rgba(0,0,0,0)',
                        }}
                        onPress={() => {

                            if (data[idx] == null || data[idx]['p'] == '/') {
                                return;
                            }

                            let dict = {};
                            if (isSelect) {
                                this.state.seleIdx = -1;
                            } else {
                                this.state.seleIdx = idx;

                                dict['sltIdx'] = idx;
                                dict['d_key'] = this.props.d_key;
                                dict['kTit'] = kTit;
                                Object.assign(dict, data[idx]);
                            }

                            this.props.ballClick ? this.props.ballClick([dict]) : null;

                            this.setState({
                                seleIdx: this.state.seleIdx,
                            });
                        }}>

                        {data[idx] != null
                            ? <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: isSelect ? '#e33939' : '#313131' }}>{kTit}</Text>
                                <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: '#e33939', paddingTop: 5 }}>{data[idx]['p']}</Text>
                            </View>
                            : null
                        }
                    </TouchableOpacity>
                )
            }

            viewArr.push(
                <View key={a} style={{ flexDirection: 'row' }}>{rowView}</View>
            )
        }

        return viewArr;
    }


    render() {

        let hTit = this.props.nowGameData['h'], vTit = this.props.nowGameData['v'];
        let tit = '';
        if (this.props.d_key == 'TGOE') {
            tit = '单双';
        } else if (this.props.d_key == 'HTGOE') {
            tit = '单双 - 上半场';
        } else if (this.props.d_key == 'BTS') {
            tit = '双方球队进球';
        } else if (this.props.d_key == 'HBTS') {
            tit = '双方球队进球 - 上半场';
        } else if (this.props.d_key == 'HFT') {
            tit = '半场/全场-(主)**' + hTit + '**vs(客)**' + vTit;
        } else if (this.props.d_key == 'DC') {
            tit = '双重机会-(主)**' + hTit + '**vs(客)**' + vTit;
        } else if (this.props.d_key == 'HMG') {
            tit = '最多进球的半场';
        } else if (this.props.d_key == 'HMG1x2') {
            tit = '最多进球的半场 - 独赢';
        } else if (this.props.d_key == 'TFG3W') {
            tit = '首个进球时间-3项';
        } else if (this.props.d_key == 'TFG') {
            tit = '首个进球时间';
        } else if (this.props.d_key == 'FGM') {
            tit = '首个进球方式';
        }

        return (
            <View style={[this.props.style.a]}>
                {/* 灰 顶部 */}
                <View style={[this.props.style.b, { height: Adaption.Height(tit.length > 70 ? 65 : tit.length > 36 ? 55 : 40) }]}>
                    <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(17) }}>{this._titTextColor(tit)}</Text>
                </View>

                {this._centerVews()}
            </View>
        )
    }

    _titTextColor(tit) {
        let titArr = tit.split('**'); // 拆分
        let viewAr = [];
        for (let a = 0; a < titArr.length; a++) {
            viewAr.push(
                <Text key={a} allowFontScaling={false} style={{ color: a % 2 == 0 ? '#313131' : '#ee8447' }}>{titArr[a]}</Text>
            )
        }
        return viewAr;
    }
}

