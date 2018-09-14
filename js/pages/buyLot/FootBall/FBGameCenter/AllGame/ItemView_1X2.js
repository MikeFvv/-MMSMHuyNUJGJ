/**
 Created by Money on 2018/05/30
    独赢 的itemView
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
} from 'react-native';


export default class ItemView_1X2 extends Component {

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
        let numColumn = this.props.d_key.includes('1X2') ? 3 : 2;
        let data = this.props.data;
        if (this.props.d_key.includes('1X2')) {
            data = [data[0], data[2], data[1]];
        }
        var viewArr = [];

        for (let b = 0; b < numColumn; b++) {

            let isSelect = this.state.seleIdx == b;
            let kTit = data[b]['k'] == 'H' ? '主' : data[b]['k'] == 'V' ? '客' : '和局';

            if (isSelect && this.handleSuperSlt) {
                this._handleSuperSltDic(kTit, data[b]);
            }

            viewArr.push(
                <TouchableOpacity key={b} activeOpacity={0.8}
                    style={{
                        justifyContent: 'center', alignItems: 'center',
                        width: (SCREEN_WIDTH - 21) / numColumn, height: Adaption.Height(60),
                        borderColor: isSelect ? '#f00' : '#d2d2d2',
                        borderRightWidth: isSelect ? 1 : (b == numColumn - 1 ? 0 : 0.5), borderBottomWidth: isSelect ? 1 : 0,
                        borderLeftWidth: isSelect ? 1 : 0, borderTopWidth: isSelect ? 1 : 0,
                        backgroundColor: isSelect ? '#fafffa' : 'rgba(0,0,0,0)',
                    }}
                    onPress={() => {

                        let dict = {};
                        if (isSelect) {
                            this.state.seleIdx = -1;
                        } else {
                            this.state.seleIdx = b;

                            dict['sltIdx'] = b;
                            dict['d_key'] = this.props.d_key;
                            dict['kTit'] = kTit;
                            Object.assign(dict, data[b]);
                        }
                        this.props.ballClick ? this.props.ballClick([dict]) : null;

                        this.setState({
                            seleIdx: this.state.seleIdx,
                        });
                    }}>

                    <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: isSelect ? '#e33939' : '#313131' }}>{kTit}</Text>
                    <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: '#e33939', paddingTop: 5 }}>{data[b]['p']}</Text>

                </TouchableOpacity>
            )
        }

        return <View style={{ flexDirection: 'row' }}>{viewArr}</View>;
    }


    render() {

        let tit = '';
        if (this.props.d_key == '1X2') {
            tit = '独赢';
        } else if (this.props.d_key == 'H1X2') {
            tit = '独赢-**上半场**';
        } else if (this.props.d_key == 'CNS') {
            tit = '零失球';
        } else if (this.props.d_key == 'WTN') {
            tit = '零失球获胜';
        } else if (this.props.d_key == 'SBH') {
            tit = '双半场进球';
        } else if (this.props.d_key == 'WEH') {
            tit = '赢得任一半场';
        } else if (this.props.d_key == 'WBH') {
            tit = '赢得所有半场';
        } else if (this.props.d_key == 'R2G') {
            tit = '先进两球的一方';
        } else if (this.props.d_key == 'R3G') {
            tit = '先进三球的一方';
        } else if (this.props.d_key == 'WFB') {
            tit = '落后反超获胜';
        }
        tit = tit + '-(主)**' + this.props.nowGameData['h'] + '**vs(客)**' + this.props.nowGameData['v'];

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

