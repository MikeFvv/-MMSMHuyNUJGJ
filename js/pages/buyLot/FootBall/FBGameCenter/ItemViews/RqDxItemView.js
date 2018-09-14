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
        } else if (nextProps.isAllBetCallback) {
            this.setState({
                seleIdx: -1,  // 清除
            });
            
        } else {
            // 选择不是同一个区域的 && 有选择数据的 && 不是综合过关的。要清除
            if (!nextProps.lastSItemIdArr.includes(nextProps.cuntSItemId) && Object.keys(this.state.seleBallDic)[0] != null && nextProps.game_typeID != 3) {
                this.setState({
                    seleIdx: -1,  // 清除
                });
            }
        }
    }

    // 只刷新 当前选择的，和之前有选择的。 其余的就不刷了 浪费时间。
    shouldComponentUpdate(nextProps, nextState) {
        let aaa = nextState.seleIdx != this.state.seleIdx; // 选择不同区域了 清除
        let bbb = nextProps.cuntSItemId == nextProps.lastSItemId; // 这个本次选择的
        let ccc = nextProps.cuntSItemId == nextProps.lastLastSItemIdx; // 上上次选择的，展开选择后 隐藏再展开 选不同区的号时 有用。
        let ddd = nextProps.data != this.props.data; // 数据源不相同时
        let eee = nextProps.isAllBetCallback == true;  // 从所有玩法 或 综合购物车 回来的
        let fff = nextProps.selectPanKou != this.props.selectPanKou;  //盘口改变时要刷新界面。赔率改变了
        if (aaa || bbb || ccc || ddd || eee || fff) {
            return true;
        } else {
            return false;
        }
    }

    _btn(d_key, idx) {

        let sltBallDic = this.state.seleBallDic[this.props.cuntSItemId];

         // 上次选择的。 主要是为了 点击收起展开时 选择状态保留住。
         let islastSlt = false;
         let isLast1 = this.state.seleIdx == -1;
         if (isLast1 && this.props.lastIdxArr[0] != -1) {
             for (let i = 0; i < this.props.lastSItemIdArr.length; i++) {
                 if (this.props.lastSItemIdArr[i] == this.props.cuntSItemId) {
                     if (this.props.lastIdxArr[i] == idx) {
                         islastSlt = true;
                         this.state.seleIdx = idx;
                     }
                 }
             }
         }

        let isSelect = (sltBallDic && sltBallDic.playMethod == d_key && this.state.seleIdx == idx) || (isLast1 && islastSlt);

        let dataModel = {};
        if (d_key == 'HC') {
            let data = this.props.data.bet_data[d_key] ? [...[this.props.data.bet_data[d_key]['H']], ...[this.props.data.bet_data[d_key]['V']]] : [];
            dataModel = data[idx] ? data[idx][0] : null;
        } else if (d_key == 'GL') {
            let data = this.props.data.bet_data[d_key] ? [...[this.props.data.bet_data[d_key]['OV']], ...[this.props.data.bet_data[d_key]['UN']]] : [];
            dataModel = data[idx - 2] ? data[idx - 2][0] : null;
        }

        let peilv = '';

        //角球盘口可能不存在HC.
        if (dataModel){

            //综合过关和冠军是没有盘口切换的
            if (this.props.tabIdx == 0){

                switch (this.props.selectPanKou){
                    case '香港盘':
                        peilv = dataModel.HK;
                        break;
                    case '马来盘':
                        peilv = dataModel.MY;
                        break;
                    case '印尼盘':
                        peilv = dataModel.IND;
                        break;
                    case '欧洲盘':
                        peilv = dataModel.DEC;
                }
            }
            else {
                peilv = dataModel.p;
            }
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
                    if (dataModel == null || dataModel.p == null || dataModel.p == '/' || dataModel.p == '') {
                        return;
                    }

                    let dict = {};
                    if (isSelect) {
                        // this.state.seleIdx = -1;
                    } else {
                        // this.state.seleIdx = idx;

                        let ballD = { 'playMethod': d_key, isHVXO: idx - (d_key == 'HC' ? 0 : 2) == 0 ? 'h' : 'v', sltIdx: idx };
                        if (d_key == 'HC') {
                            ballD['kTit'] = idx == 0 ? '主' : '客';
                        } else if (d_key == 'GL') {
                            ballD['kTit'] = (idx - 2 == 0) ? '大' : '小';
                        }

                        Object.assign(ballD, dataModel);
                        dict[this.props.cuntSItemId] = ballD;
                    }
                    this.props.ballsClick ? this.props.ballsClick(dict) : null;
                    this.setState({
                        seleIdx: isSelect ? -1 : idx,
                        seleBallDic: dict,
                    });

                }}
            >
                {d_key == 'HC' && dataModel != null && dataModel.p != null && dataModel.p != '/' && dataModel.p != ''
                    ? <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            {dataModel.k.indexOf('-') == 0 ? <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: '#22AC38' }}>{`${dataModel.k}`.substr(1, `${dataModel.k}`.length - 1)}</Text> : null}
                            <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: isSelect ? '#e33939' : '#676767' }}>{peilv}</Text>
                        </View>
                        {dataModel.t != null && dataModel.t != 'e' ? <Image resizeMode={'contain'} style={{ width: Adaption.Width(13), height: Adaption.Width(13) }} source={dataModel.t == 'd' ? require('../../img/PlDown.png') : require('../../img/PlUp.png')} /> : null}
                    </View>

                    // 大小
                    : d_key == 'GL' && dataModel != null && dataModel.p != null && dataModel.p != '/' && dataModel.p != ''
                        ? <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: isSelect ? '#e33939' : '#676767' }}>{idx - 2 == 0 ? '大' : '小'}</Text>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: Adaption.Width(3) }}>
                                <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: '#22AC38' }}>{dataModel.k}</Text>
                                <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: isSelect ? '#e33939' : '#676767' }}>{peilv}</Text>
                            </View>
                            {dataModel.t != null && dataModel.t != 'e' ? <Image resizeMode={'contain'} style={{ width: Adaption.Width(13), height: Adaption.Width(13) }} source={dataModel.t == 'd' ? require('../../img/PlDown.png') : require('../../img/PlUp.png')} /> : null}
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
        let score = this.props.game_typeID == 0 ? this.props.data.team_score : '';
        let time = Moment.unix(parseInt(this.props.data.begin_time) / 1000).format('MM/DD HH:mm');
        let rolling = this.props.data.rolling_time;
        rolling = rolling.replace(/1H/, '上半场');
        rolling = rolling.replace(/2H/, '下半场');

        return (
            <View style={[this.props.style, styles.itemBorderStyle]}>

                <View style={{ height: Adaption.Height(40), flexDirection: 'row', alignItems: 'center' }}>
                    <Text allowFontScaling={false} style={{ flex: 0.12, textAlign: 'center', fontSize: Adaption.Font(17), color: '#ee8447' }}>{score}</Text>
                    <Text allowFontScaling={false} style={{ flex: 0.38, textAlign: 'right', fontSize: Adaption.Font(17), color: rolling.length > 0 ? '#ee8447' : '#313131' }}>{rolling.length > 0 ? rolling : time}</Text>
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
                        {this._btn('GL', 2)}
                        {this._btn('GL', 3)}
                    </View>

                </View>

                {this.props.tabIdx != 1 ?  <TouchableOpacity activeOpacity={0.8} style={{ height: Adaption.Height(40), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                                                             onPress={() => {
                                                                 this.props.allPlayClick ? this.props.allPlayClick() : null;
                                                             }}
                >
                    <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(18), color: '#7e6b5a' }}>{`所有玩法(${this.props.data.all_bet_cnt})`}</Text>
                    <Image resizeMode={'contain'} style={{ left: 5, width: Adaption.Width(13), height: Adaption.Width(13) }} source={require('../../img/AllGame.png')} />
                </TouchableOpacity> : null}

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
