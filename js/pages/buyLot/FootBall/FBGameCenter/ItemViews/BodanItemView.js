
/**
 Created by Money on 2018/03/21
 波胆 的itemView
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';

import Moment from 'moment';

export default class BodanItemView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            seleBallDic: {},
            isClearBalls: false,
        };
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.cuntSItemId != nextProps.lastSItemId && Object.keys(this.state.seleBallDic)[0] != null) {
            this.setState({
                isClearBalls: true,
            });
        }
    }

    // 只刷新 当前选择的，和之前有选择的。 其余的就不刷了 浪费时间。
    shouldComponentUpdate(nextProps, nextState) {
        let aaa = nextState.isClearBalls != this.state.isClearBalls; // 选择不同区域了 为true。
        let bbb = nextProps.cuntSItemId == nextProps.lastSItemId; // 这个本次选择的
        let ccc = nextProps.cuntSItemId == nextProps.lastLastSItemIdx; // 上上次选择的，展开选择后 隐藏再展开 选不同区的号时 有用。
        let ddd = nextProps.data != this.props.data; // 数据源不相同时
        if (aaa || bbb || ccc || ddd) {
            return true;
        } else {
            return false;
        }
    }
    
    render() {

        let h = this.props.style.height - Adaption.Height(60);
        let isSltOrd = this.props.cuntSItemId == this.props.lastSItemId && this.props.lastIdx == 30; // 是否选择了其它。
        return (
            <View style={[styles.itemBorderStyle, this.props.style]}>
                {/* 灰 顶部 */}
                <View style={[styles.itemHeaderGreyView, {height: Adaption.Height(60)}]}>
                    <Text allowFontScaling={false} style={{ marginTop: Adaption.Height(7), fontSize: Adaption.Font(18), color:'#313131' }}>{`${this.props.data.h}   VS   ${this.props.data.v}`}</Text>
                    <Text allowFontScaling={false} style={{ margin: Adaption.Height(7), fontSize: Adaption.Font(15), color:'#313131' }}>{Moment.unix(parseInt(this.props.data.begin_time)/1000).format('MM/DD HH:mm:ss')}</Text>
                </View>

                <View style={{ height: h, flexDirection: 'row' }}>
                    {/* 左边 */}
                    <View style={{ height: h, width: (SCREEN_WIDTH - 21) * 0.1 }}>
                        <View style={{ height: (h-1) * 0.4, justifyContent: 'center', alignItems: 'center', borderColor: '#d2d2d2', borderRightWidth: 0.5, borderBottomWidth: 0.5 }}>
                            <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(17), color:'#313131' }}>主</Text>
                        </View>
                        <View style={{ height: (h-1.5) * 0.4, justifyContent: 'center', alignItems: 'center', borderColor: '#d2d2d2', borderRightWidth: 0.5, borderBottomWidth: 0.5 }}>
                            <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(17), color:'#313131' }}>客</Text>
                        </View>
                        <View style={{ height: (h-1) * 0.2, justifyContent: 'center', alignItems: 'center', borderColor: '#d2d2d2', borderRightWidth: 0.5 }}>
                            <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(17), color:'#313131' }}>平</Text>
                        </View>
                    </View>

                    {/* 中间 */}
                    <BodanItem style={{ height: h - 1, width: (SCREEN_WIDTH - 21) * 0.75 }}
                        data={this.props.data.bet_data}
                        isHalf={this.props.isHalf}
                        isClearBalls={this.state.isClearBalls}
                        cuntSItemId={this.props.cuntSItemId}
                        lastSItemId={this.props.lastSItemId}
                        lastIdx={this.props.lastIdx}
                        ballClick={(ballDic) => {
                            this.setState({
                                isClearBalls: false,
                                seleBallDic: ballDic,
                            })
                            this.props.ballsClick ? this.props.ballsClick(ballDic) : null;
                        }}
                    >
                    </BodanItem>

                    {/* 右边 */}
                    <View style={{ height: h, width: (SCREEN_WIDTH - 21) * 0.15 }}>
                        <View style={{ height: (h-1) * 0.4, borderColor: '#d2d2d2', borderBottomWidth: 0.5 }}></View>
                        <TouchableOpacity activeOpacity={0.8} 
                            style={{ 
                                justifyContent: 'center', alignItems: 'center',
                                height: (h-1.5) * 0.2, width: (SCREEN_WIDTH - 21) * 0.15,
                                borderColor: isSltOrd ? '#f00' : '#d2d2d2',
                                borderRightWidth: isSltOrd ? 1 : 0, borderBottomWidth: isSltOrd ? 1 : 0.5,
                                borderLeftWidth: isSltOrd ? 1 : 0, borderTopWidth: isSltOrd ? 1 : 0,
                                backgroundColor: isSltOrd ? '#fafffa' : 'rgba(0,0,0,0)',
                            }}
                            onPress={() => {
                                if (!isSltOrd) {
                                    let ballD = {'playMethod': this.props.isHalf ? 'HTCS' : 'TCS', 'isFullTime': !this.props.isHalf, isHVXO: 'o', sltIdx: 30};
                                    Object.assign(ballD, this.props.data.bet_data[this.props.isHalf ? 'HTCS' : 'TCS']['O'][0]);
                                    this.state.seleBallDic = {['其他']: ballD};
                                } else {
                                    this.state.seleBallDic = {}; 
                                }

                                this.setState({ 
                                    seleBallDic: this.state.seleBallDic,
                                    isClearBalls: isSltOrd ? false : true,
                                });
                                this.props.ballsClick ? this.props.ballsClick(this.state.seleBallDic) : null;
                                
                            }}>
                            <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), marginBottom: 3, color: '#313131' }}>其他</Text>
                            <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(14, 12), color: '#676767' }}>
                                {this.props.data.bet_data[this.props.isHalf ? 'HTCS' : 'TCS']['O']? this.props.data.bet_data[this.props.isHalf ? 'HTCS' : 'TCS']['O'][0].p : ''}
                            </Text>
                        </TouchableOpacity>
                        <View style={{ height: (h-1) * 0.4}}></View>
                    </View>
                </View>
            </View>
        )
    }

}

class BodanItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            seleIdx: -1,
        };
    }


    componentWillReceiveProps(nextProps) {
        // 清空
        if (nextProps.isClearBalls) {
          this.setState({
            seleIdx: -1,
          })
        }
    }


    _centerVews() {

        let row = 5;  // 行
        let height = this.props.style.height / row;
        var rowViews = [];

        let propsData = this.props.data[this.props.isHalf ? 'HTCS' : 'TCS']; // 半场 or 全场

        for (let a = 0; a < row; a++) {

            let data = [];
            if (a == 0 || a == 1) {
                data = propsData['H'];
            } else if (a == 2 || a == 3) {
                data = propsData['V'];
            } else if (a == 4) {
                data = propsData['X'];
            }

            var columnViews = [];
            for (let b = 0; b < 5; b++) {
                let idx = b + (a * 5);
                let isSelect = this.state.seleIdx == idx || (this.props.cuntSItemId == this.props.lastSItemId && this.props.lastIdx == idx);

                let bIdx = (a == 1 || a == 3) ? b + 5 : b;

                columnViews.push(
                    <TouchableOpacity key={idx} activeOpacity={0.8} 
                        style={{
                            justifyContent: 'center', alignItems: 'center',
                            width: this.props.style.width / 5.0, height: height, 
                            borderColor: isSelect ? '#f00' : '#d2d2d2',
                            borderRightWidth: isSelect ? 1 : 0.5, borderBottomWidth: isSelect ? 1 : (a == row - 1 ? 0 : 0.5),
                            borderLeftWidth: isSelect ? 1 : 0, borderTopWidth: isSelect ? 1 : 0,
                            backgroundColor: isSelect ? '#fafffa' : 'rgba(0,0,0,0)',
                        }}
                        onPress={() => {
    
                            if (data[bIdx] == null) {
                                return;
                            }

                            let dict = {};
                            if (isSelect) {
                                this.state.seleIdx = -1;
                            } else {
                                this.state.seleIdx = idx;
                                
                                let ballD = {'playMethod': this.props.isHalf ? 'HTCS' : 'TCS', 'isFullTime': !this.props.isHalf, isHVXO: a == 0 || a == 1 ? 'h' : a == 2 || a == 3 ? 'v' : 'x', sltIdx: idx};
                                Object.assign(ballD, data[bIdx]);
                                dict[`${data[bIdx].k}`]  = ballD;
                            }

                            this.props.ballClick ? this.props.ballClick(dict) : null;
                            this.setState({ seleIdx: this.state.seleIdx });
                        }}>
                        {data != null && data[bIdx] != null 
                            ? <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: isSelect ? '#e33939' : '#313131', marginBottom: 3 }}>{data[bIdx].k}</Text>
                                <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(14, 12), color: isSelect ? '#e33939' : '#676767' }}>{data[bIdx].p}</Text>
                            </View>
                            : null
                        }
                    </TouchableOpacity>
                )
            }

            rowViews.push(
                <View key={a} style={{ flex: 0.5, flexDirection: 'row' }}>{columnViews}</View>
            )
        }
        return rowViews;
    }
 
    render() {
        return (
            <View style={this.props.style}>{this._centerVews()}</View>
        );
    }
}

const styles = StyleSheet.create({
    itemBorderStyle: { 
        width: SCREEN_WIDTH - 20,
        margin: 10,
        borderColor: '#d2d2d2',
        borderWidth: 0.5,
        borderRadius: 3,
        backgroundColor: '#fff',
    },

    itemHeaderGreyView: {
        backgroundColor: '#f3f3f3',
        justifyContent: 'center',
        alignItems: 'center',
        width: SCREEN_WIDTH - 21, // 多减1为不挡住左右边线条
        height: 60,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        borderColor: '#d2d2d2',
        borderBottomWidth: 0.5,
    },
})