/**
 Created by Money on 2018/06/01
    独赢 & 进球 大 / 小 的itemView
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
} from 'react-native';


export default class ItemView_1X2GL extends Component {

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

    _handleSuperSltDic(kTit, aTit, team, subkey, sltdata) {
        // 回调一下上级选号内容。
        let dict = { sltIdx: this.props.superSltDic['sltIdx'], d_key: this.props.d_key, kTit: kTit, ATit: aTit, team: team, subkey: subkey };
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

    _centerVews(hvxKey, tit, startIdx) {
        let numColumn = 2;
        let data = this.props.data[hvxKey];
        let row = data['OV'] ? data['OV'].length : 0;
        var viewArr = [];

        for (let a = 0; a < row; a++) {

            var rowView = [];
            for (let b = 0; b < numColumn; b++) {
                let idx = (a * numColumn) + b;
                let isSelect = this.state.seleIdx == (idx + startIdx);
                let key = b == 0 ? 'OV' : 'UN';

                if (isSelect && this.handleSuperSlt) {
                    this._handleSuperSltDic(b == 0 ? '大' : '小', tit, hvxKey, b == 0 ? 'OV' : 'UN', data[key][a]);
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

                            if (data[key][a] == null) {
                                return;
                            }

                            let dict = {};
                            if (isSelect) {
                                this.state.seleIdx = -1;
                            } else {
                                this.state.seleIdx = idx + startIdx;

                                dict['sltIdx'] = idx + startIdx;
                                dict['d_key'] = this.props.d_key;
                                dict['kTit'] = b == 0 ? '大' : '小';
                                dict['ATit'] = tit;
                                dict['team'] = hvxKey;
                                dict['subkey'] = b == 0 ? 'OV' : 'UN';
                                Object.assign(dict, data[key][a]);
                            }

                            this.props.ballClick ? this.props.ballClick([dict]) : null;

                            this.setState({
                                seleIdx: this.state.seleIdx,
                            });
                        }}>

                        {data[key][a] != null
                            ? <View>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(17, 15), color: isSelect ? '#e33939' : '#313131' }}>{b == 0 ? '大' : '小'}</Text>
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingTop: 5 }}>
                                    <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: isSelect ? '#e33939' : '#313131' }}>{data[key][a]['k']}</Text>
                                    <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: '#e33939', marginLeft: 10 }}>{data[key][a]['p']}</Text>
                                </View>
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
        return (
            <View>
                <View style={{ height: Adaption.Height(40), justifyContent: 'center', backgroundColor: '#e6e6e6' }}>
                    <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: '#6e655e', paddingLeft: Adaption.Width(20) }}>{tit}</Text>
                </View>
                {viewArr}
            </View>
        );
    }


    render() {

        let tit = '';
        let keyArr = ['H', 'V', 'X'];
        let titArr = ['主', '客', '和局'];

        if (this.props.d_key == '1X2GL') {
            tit = '独赢 & 进球 大/小';
        } else if (this.props.d_key == 'DCGL') {
            tit = '双重机会 & 进球 大/小';
            keyArr = ['HX', 'VX', 'HV'];
            titArr = ['主 / 和局', '客 / 和局', '主 / 客'];
        } else if (this.props.d_key == 'GLFTS') {
            tit = '进球 大/小 & 最先进球';
            keyArr = ['HFG', 'VFG'];
            titArr = ['主（最先进球）', '客（最先进球）'];
        }
        tit = tit + '-(主)**' + this.props.nowGameData['h'] + '**vs(客)**' + this.props.nowGameData['v'];

        if (this.props.d_key == 'GLBTS') {
            tit = '进球 大/小 & 双方球队进球';
            keyArr = ['Yes', 'No'];
            titArr = ['是', '不是'];
        } else if (this.props.d_key == 'GLTGOE') {
            tit = '进球 大/小 & 进球 单/双';
            keyArr = ['Odd', 'Even'];
            titArr = ['单', '双'];
        }

        return (
            <View style={[this.props.style.a]}>
                {/* 灰 顶部 */}
                <View style={[this.props.style.b, { height: Adaption.Height(tit.length > 70 ? 65 : tit.length > 35 ? 55 : 40) }]}>
                    <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(17) }}>{this._titTextColor(tit)}</Text>
                </View>

                {this._centerVews(keyArr[0], titArr[0], 0)}
                {this._centerVews(keyArr[1], titArr[1], 100)}
                {keyArr[2] ? this._centerVews(keyArr[2], titArr[2], 200) : null}

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

