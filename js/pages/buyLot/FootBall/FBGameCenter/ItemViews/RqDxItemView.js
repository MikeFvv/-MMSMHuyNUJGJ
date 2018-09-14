/**
 Created by Money on 2018/06/19
    新的让球/大小 itemView
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity,
} from 'react-native';
import Moment from 'moment';

export default class RqDxItemView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            seleBallDic: {},
            seleIdx: -1,
        };
    }


    componentWillReceiveProps(nextProps) {

        if (nextProps.isReload) {
            // 重载
            this.setState({
                seleBallDic: {},
                seleIdx: -1,
            })

        } else {
            // 选择不是同一个区域的 && 有选择数据的 && 不是综合过关的。要清除
            if (!nextProps.lastSItemIdArr.includes(nextProps.cuntSItemId) && Object.keys(this.state.seleBallDic)[0] != null && nextProps.game_typeID != 3) {
                this.setState({
                    seleIdx: -1,  // 清除
                });
            }
        }
    }

    _btn(d_key, idx) {

        let sltBallDic = this.state.seleBallDic[this.props.cuntSItemId];
        let isSelect = sltBallDic && sltBallDic.playMethod == d_key && this.state.seleIdx == idx;  //&& sltBallDic.sltIdx == idx;

        let data = [];
        if (d_key == 'HC') {
            data = this.props.data.bet_data[d_key] ? [...[this.props.data.bet_data[d_key]['H']], ...[this.props.data.bet_data[d_key]['V']]] : [];
        } else if (d_key == 'GL') {
            data = this.props.data.bet_data[d_key] ? [...[this.props.data.bet_data[d_key]['OV']], ...[this.props.data.bet_data[d_key]['UN']]] : [];
        }

        return (
            <TouchableOpacity activeOpacity={0.8}
                style={{
                    justifyContent: 'center', alignItems: 'center', flexDirection: 'row',
                    height: Adaption.Width(50), marginTop: Adaption.Width(40 / 3),
                    borderColor: isSelect ? '#f00' : '#d2d2d2',
                    borderWidth: 1, borderRadius: 3,
                    backgroundColor: isSelect ? '#fafffa' : 'rgba(0,0,0,0)',
                }}
                onPress={() => {
                    if (data[idx] == null && data[idx].p == null && data[idx].p == '/' && data[idx].p == '') {
                        return;
                    }

                    let dict = {};
                    if (isSelect) {
                        this.state.seleIdx = -1;
                    } else {
                        this.state.seleIdx = idx;

                        let ballD = { 'playMethod': d_key, isHVXO: idx == 0 ? 'h' : 'v', sltIdx: idx };
                        if (d_key == 'HC') {
                            ballD['kTit'] = idx == 0 ? '主' : '客';
                        } else if (d_key == 'GL') {
                            ballD['kTit'] = idx == 0 ? '大' : '小';
                        }

                        Object.assign(ballD, data[idx]);
                        dict[this.props.cuntSItemId] = ballD;
                    }
                    this.props.ballsClick ? this.props.ballsClick(dict) : null;
                    this.setState({
                        // seleIdx: this.state.seleIdx,
                        seleBallDic: dict,
                    });

                }}
            >
                {d_key == 'HC' && data[idx] != null && data[idx].p != null && data[idx].p != '/' && data[idx].p != ''
                    ? <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            {data[idx].k.indexOf('-') == 0 ? <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: '#22AC38' }}>{`${data[idx].k}`.substr(1, `${data[idx].k}`.length - 1)}</Text> : null}
                            <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: isSelect ? '#e33939' : '#676767' }}>{data[idx].p}</Text>
                        </View>
                        {data[idx].t != null && data[idx].t != 'e' ? <Image resizeMode={'contain'} style={{ width: Adaption.Width(13), height: Adaption.Width(13) }} source={data[idx].t == 'd' ? require('../../img/PlDown.png') : require('../../img/PlUp.png')} /> : null}
                    </View>

                    // 大小
                    : d_key == 'GL' && data[idx] != null && data[idx].p != null && data[idx].p != '/' && data[idx].p != ''
                        ? <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: isSelect ? '#e33939' : '#676767' }}>{idx == 0 ? '大' : '小'}</Text>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: Adaption.Width(3) }}>
                                <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: '#22AC38' }}>{data[idx].k}</Text>
                                <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: isSelect ? '#e33939' : '#676767' }}>{data[idx].p}</Text>
                            </View>
                            {data[idx].t != null && data[idx].t != 'e' ? <Image resizeMode={'contain'} style={{ width: Adaption.Width(13), height: Adaption.Width(13) }} source={data[idx].t == 'd' ? require('../../img/PlDown.png') : require('../../img/PlUp.png')} /> : null}
                        </View>

                        : <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: '#676767' }}>{'/'}</Text>
                        </View>
                }


            </TouchableOpacity>
        )
    }

    render() {

        let corner = this.props.data.is_corner == 1 ? '角球数' : '';
        let score = this.props.game_typeID == 0 ? this.props.data.team_score : '滚球';
        let time = Moment.unix(parseInt(this.props.data.begin_time) / 1000).format('HH:mm');
        let rolling = this.props.data.rolling_time;
        rolling = rolling.replace(/1H/, '上半场');
        rolling = rolling.replace(/2H/, '下半场');

        return (
            <View style={[this.props.style, styles.itemBorderStyle]}>

                <View style={{ height: Adaption.Height(40), flexDirection: 'row', alignItems: 'center' }}>
                    <Text allowFontScaling={false} style={{ flex: 0.12, textAlign: 'center', fontSize: Adaption.Font(17), color: '#ee8447' }}>{score}</Text>
                    <Text allowFontScaling={false} style={{ flex: 0.25 + (rolling.length > 0 ? 0.13 : 0), textAlign: 'right', fontSize: Adaption.Font(17), color: '#ee8447' }}>{rolling}</Text>
                    {rolling.length > 0 ? null : <Text allowFontScaling={false} style={{ flex: 0.13, textAlign: 'right', fontSize: Adaption.Font(17), color: '#313131' }}>{time}</Text>}
                    <Text allowFontScaling={false} style={{ flex: 0.25, textAlign: 'center', fontSize: Adaption.Font(18), color: '#313131' }}>让球</Text>
                    <Text allowFontScaling={false} style={{ flex: 0.25, textAlign: 'center', fontSize: Adaption.Font(18), color: '#313131' }}>大/小</Text>
                </View>

                <View style={{ height: Adaption.Height(140), flexDirection: 'row', backgroundColor: '#fff' }}>

                    <View style={{ width: (SCREEN_WIDTH - 20) * 0.5, paddingLeft: 5 }}>
                        <View style={{ height: Adaption.Width(20), justifyContent: 'center' }}>
                            <Text style={{ fontSize: Adaption.Font(16, 14), color: '#82aaff' }}>{corner}</Text>
                        </View>
                        <View style={{ height: Adaption.Width(58), paddingTop: Adaption.Width(8) }}>
                            <Text style={{ fontSize: Adaption.Font(18, 16) }}>{this.props.data.h + `${this.props.data.is_neutral == 1 ? '[中]' : '[主]'}`}</Text>
                        </View>
                        <View style={{ height: Adaption.Width(58), paddingTop: Adaption.Width(8) }}>
                            <Text style={{ fontSize: Adaption.Font(18, 16) }}>{this.props.data.v}</Text>
                        </View>

                    </View>
                    <View style={{ width: Adaption.Width(88), marginRight: Adaption.Width(10) }}>
                        {this._btn('HC', 0)}
                        {this._btn('HC', 1)}
                    </View>
                    <View style={{ width: Adaption.Width(88) }}>
                        {this._btn('GL', 0)}
                        {this._btn('GL', 1)}
                    </View>

                </View>

                <TouchableOpacity activeOpacity={0.8} style={{ height: Adaption.Height(40), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                        this.props.allPlayClick ? this.props.allPlayClick() : null;
                    }}
                >
                    <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(18), color: '#7e6b5a' }}>所有玩法</Text>
                    <Image resizeMode={'contain'} style={{ left: 5, width: Adaption.Width(13), height: Adaption.Width(13) }} source={require('../../img/AllGame.png')} />
                </TouchableOpacity>

            </View>
        )
    }

}


const styles = StyleSheet.create({
    itemBorderStyle: {
        width: SCREEN_WIDTH - 20,
        margin: 10,
        borderColor: '#d2d2d2',
        borderWidth: 0.5,
        borderRadius: 3,
        backgroundColor: '#f3f3f3',
    },
})
