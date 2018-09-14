/**
 Created by Money on 2018/03/21
 半/全场  的itemView
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';

import Moment from 'moment';

export default class BQChangItemView extends Component {

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
                <View style={[styles.itemHeaderGreyView, {height: Adaption.Height(60)}]}>
                    <Text allowFontScaling={false} style={{ marginTop: Adaption.Height(7), fontSize: Adaption.Font(18), color:'#313131' }}>{`${this.props.data.h}   VS   ${this.props.data.v}`}</Text>
                    <Text allowFontScaling={false} style={{ margin: Adaption.Height(7), fontSize: Adaption.Font(15), color:'#313131' }}>{Moment.unix(parseInt(this.props.data.begin_time)/1000).format('MM/DD HH:mm:ss')}</Text>
                </View>

                <BQChangItem style={{ width: (SCREEN_WIDTH - 21), height: this.props.style.height - Adaption.Height(61) }}
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
                    allPlayClick={() => {
                        this.props.allPlayClick ? this.props.allPlayClick() : null;
                    }}
                >
                </BQChangItem>
            </View>
        )
    }
}


class BQChangItem extends Component {

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
        
        let row = 2;   // 行
        let height = this.props.style.height / row;
        var rowViews = [];

        let data = [...this.props.data['HFT'], ...['所有玩法']];

        for (let a = 0; a < row; a++) {

            var columnViews = [];
            for (let b = 0; b < 5; b++) {
                let idx = b + (a * 5);
                
                let isSelect = this.state.seleIdx == idx || (this.props.cuntSItemId == this.props.lastSItemId && this.props.lastIdx == idx);

                if (idx == data.length - 1) {
                    columnViews.push(
                        <TouchableOpacity key={idx} activeOpacity={1} style={{ width: this.props.style.width / 5.0, height: height - 1.5,  justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => {
                                this.props.allPlayClick ? this.props.allPlayClick() : null;
                            }}>
                            <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(15, 12), color:'#7e6b5a', marginTop:2 }}>{`所有${'\n'}玩法`}</Text>
                            <Image resizeMode={'contain'} style={{ width: Adaption.Width(13), height: Adaption.Width(13) }} source={require('../../img/AllGame.png')}/>
                        </TouchableOpacity>
                    );

                } else {

                    let k = data[idx]['k'];
                    k = k.replace(/H/g, '主');
                    k = k.replace(/V/g, '客');
                    k = k.replace(/X/g, '和');
                    let title = k.length == 2 ? `${k.substr(0, 1)}/${k.substr(1, 1)}` : k;

                    columnViews.push(
                        <TouchableOpacity key={idx} activeOpacity={0.8} style={{
                            justifyContent: 'center', alignItems: 'center',
                            width: this.props.style.width / 5.0, height: height, 
                            borderColor: isSelect ? '#f00' : '#d2d2d2',
                            borderRightWidth: isSelect ? 1 : 0.5, borderBottomWidth: isSelect ? 1 : (a == row - 1 ? 0 : 0.5),
                            borderLeftWidth: isSelect ? 1 : 0, borderTopWidth: isSelect ? 1 : 0,
                            backgroundColor: isSelect ? '#fafffa' : 'rgba(0,0,0,0)',
                        }}
                            onPress={() => {

                                 if (data == null) {
                                    return;
                                }

                                let dict = {};
                                if (isSelect) {
                                    this.state.seleIdx = -1;
                                } else {
                                    this.state.seleIdx = idx;

                                    let ballD = {'playMethod': 'HFT', sltIdx: idx};
                                    ballD['kTit'] = title;
                                    Object.assign(ballD, data[idx]);
                                    dict[`${title}`] = ballD;
                                }

                                this.props.ballClick ? this.props.ballClick(dict) : null;
                                this.setState({ seleIdx: this.state.seleIdx });
                            }}>
                            {data != null
                                ? <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: isSelect ? '#e33939' : '#313131', marginBottom: 3 }}>{title}</Text>
                                    <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(14, 12), color: isSelect ? '#e33939' : '#676767' }}>{data[idx]['p']}</Text>
                                </View>
                                : null
                            }
                        </TouchableOpacity>
                    );
                }
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