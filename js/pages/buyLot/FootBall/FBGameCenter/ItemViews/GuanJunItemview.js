/**
 Created by Money on 2018/04/06
 冠军 的itemView
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';

export default class GuanJunItemview extends Component {

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
        return (
            <View style={[styles.itemBorderStyle, this.props.style]}>
                {/* 灰 顶部 */}
                <View style={[styles.itemHeaderGreyView, {height: Adaption.Height(40)}]}>
                    <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(18), color:'#313131' }}>{`${this.props.data.h}`}</Text>
                </View>

                <GuanJunItem style={{ width: SCREEN_WIDTH - 21, height: this.props.style.height - Adaption.Height(41) }} 
                    data={this.props.data.bet_data}
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
                </GuanJunItem>

            </View>
        )
    }
}


class GuanJunItem extends Component {

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
       
        let data = this.props.data['CHP'];
        let row = Math.ceil(data.length / 2.0);  // 行
        let height = this.props.style.height / row;
        var rowViews = [];

        for (let a = 0; a < row; a++) {
            
            var columnViews = [];
            for (let b = 0; b < 2; b++) {
                let idx = b + (a * 2);

                let isSelect = this.state.seleIdx == idx || (this.props.cuntSItemId == this.props.lastSItemId && this.props.lastIdx == idx);

                columnViews.push(
                    <TouchableOpacity key={idx} activeOpacity={0.8} 
                        style={{
                            justifyContent: 'center', alignItems: 'center', flexDirection: 'row',
                            width: this.props.style.width / 2.0, height: height, 
                            borderColor: isSelect ? '#f00' : '#d2d2d2',
                            borderRightWidth: isSelect ? 1 : (b == 1 ? 0 : 0.5), borderBottomWidth: isSelect ? 1 : (a == row - 1 ? 0 : 0.5),
                            borderLeftWidth: isSelect ? 1 : 0, borderTopWidth: isSelect ? 1 : 0,
                            backgroundColor: isSelect ? '#fafffa' : 'rgba(0,0,0,0)',
                        }}
                        onPress={() => {
    
                            if (data[idx] == null) {
                                return;
                            }

                            let dict = {};
                            if (isSelect) {
                                this.state.seleIdx = -1;
                            } else {
                                this.state.seleIdx = idx;

                                let ballD = {'playMethod': 'CHP', sltIdx: idx};
                                Object.assign(ballD, data[idx]);
                                dict[`${data[idx].k}`] = ballD;
                            }

                            this.props.ballClick ? this.props.ballClick(dict) : null;
                            this.setState({ seleIdx: this.state.seleIdx });
                        }}>

                        {data[idx] != null
                            ? <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                <Text allowFontScaling={false} style={{ flex: 0.8, fontSize: Adaption.Font(16, 14), color: isSelect ? '#e33939' : '#313131', marginLeft: Adaption.Width(15) }}>{data[idx]['k']}</Text>
                                <Text allowFontScaling={false} style={{ flex: 0.2, fontSize: Adaption.Font(14, 12), color: isSelect ? '#e33939' : '#676767' }}>{data[idx]['p']}</Text>
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
        backgroundColor: '#fff',
    },

    itemHeaderGreyView: {
        // backgroundColor: '#f3f3f3',
        justifyContent: 'center',
        alignItems: 'center',
        width: SCREEN_WIDTH - 21, // 多减1为不挡住左右边线条
        height: 40,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        borderColor: '#d2d2d2',
        borderBottomWidth: 0.5,
    },
})