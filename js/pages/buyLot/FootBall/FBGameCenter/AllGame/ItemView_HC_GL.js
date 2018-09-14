/**
 Created by Money on 2018/05/30
    让球、大小 的itemView
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
} from 'react-native';


export default class ItemView_HC_GL extends Component {

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

        this.isHC = this.props.d_key.includes('HC');  // true为让球，flase大小
    }

    _handleSuperSltDic(tit, key, sltdata) {
        // 回调一下上级选号内容。
        let dict = { sltIdx: this.props.superSltDic['sltIdx'], d_key: this.props.d_key, kTit: tit, team: key };
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
        let row = data['H'] ? data['H'].length : (data['OV'] ? data['OV'].length : 0);
        var viewArr = [];

        for (let a = 0; a < row; a++) {

            var rowView = [];
            for (let b = 0; b < numColumn; b++) {
                let idx = (a * numColumn) + b;
                let isSelect = this.state.seleIdx == idx;
                let key = '';
                let tit = '';
                if (b == 0) {
                    key = this.isHC ? 'H' : 'OV';  // 第一列： 主 / 大
                    tit = this.isHC ? '主' : '大';
                } else {
                    key = this.isHC ? 'V' : 'UN'; // 第二列：客 / 小
                    tit = this.isHC ? '客' : '小';
                }

                if (isSelect && this.handleSuperSlt) {
                    this._handleSuperSltDic(tit, key, data[key][a]);
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
                                this.state.seleIdx = idx;

                                dict['sltIdx'] = idx;
                                dict['d_key'] = this.props.d_key;
                                dict['kTit'] = tit;
                                dict['team'] = key;
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
                                    <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(17, 15), color: isSelect ? '#e33939' : '#313131' }}>{tit}</Text>
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingTop: 5 }}>
                                    {this.isHC && data[key][a]['k'] != null
                                        ? data[key][a]['k'].indexOf('-') == 0 ? <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: isSelect ? '#e33939' : '#313131', marginRight: 10 }}>{data[key][a]['k'].substr(1)}</Text> : null
                                        : <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: isSelect ? '#e33939' : '#313131', marginRight: 10 }}>{data[key][a]['k']}</Text>
                                    }
                                    <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: '#e33939' }}>{data[key][a]['p']}</Text>
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
        return viewArr;
    }


    render() {

        let hTit = this.props.nowGameData['h'], vTit = this.props.nowGameData['v'];
        let tit = '';
        if (this.props.d_key == 'HC') {
            tit = '让球-(主)**' + hTit + '**vs(客)**' + vTit;
        } else if (this.props.d_key == 'HHC') {
            tit = '让球-**上半场**-(主)**' + hTit + '**vs(客)**' + vTit;
        } else if (this.props.d_key == 'GL') {
            tit = '大小';
        } else if (this.props.d_key == 'HGL') {
            tit = '大小-**上半场';
        } else if (this.props.d_key == 'GLH') {
            tit = '球队进球数-(主)**' + hTit + '-大/小';
        } else if (this.props.d_key == 'GLV') {
            tit = '球队进球数-(客)**' + vTit + '-大/小';
        } else if (this.props.d_key == 'HGLH') {
            tit = '球队进球数-(主)**' + hTit + '-大/小-上半场';
        } else if (this.props.d_key == 'HGLV') {
            tit = '球队进球数-(客)**' + vTit + '-大/小-上半场';
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
                <Text key={a} allowFontScaling={false} style={{ fontSize: Adaption.Font(17), color: a % 2 == 0 ? '#313131' : '#ee8447' }}>{titArr[a]}</Text>
            )
        }
        return viewAr;
    }
}

