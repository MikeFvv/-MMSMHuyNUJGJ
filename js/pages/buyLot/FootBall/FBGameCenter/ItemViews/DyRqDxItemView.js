/**
 Created by Money on 2018/03/21
 独赢 让球 大小 的itemView
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

export default class DyRqDxItemView extends Component {

    constructor(props) {
        super(props);

        let isFull = true;
        if (!props.lastSItemIdArr.includes('-1+-1')) {
            for (let i = 0; i < props.lastSItemIdArr.length; i++) {
                // 已有选择号时，刷新时 要把刷新前选择的号的选择状态显示出来，全场或半场也一样。
                if (props.lastSItemIdArr[i] == props.cuntSItemId) {
                    isFull = props.lastFullTimeArr[i];
                }
            }
        }

        this.state = {
            seleBallDic: {},
            isFullTime: isFull, // 是不是全场
            isClearBalls: false,
        };
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.isReload) {
            // 重载
            this.setState({
                seleBallDic: {},
                isFullTime: true, 
                isClearBalls: true,
            })

        }  else {
            // 选择不是同一个区域的 && 有选择数据的 && 不是综合过关的。要清除
            if (!nextProps.lastSItemIdArr.includes(nextProps.cuntSItemId) && Object.keys(this.state.seleBallDic)[0] != null && nextProps.game_typeID != 3) {
                this.setState({
                    isClearBalls: true,
                });
            }

            if (!nextProps.lastSItemIdArr.includes('-1+-1') && Object.keys(this.state.seleBallDic)[0] == null) {
                for (let i = 0; i < nextProps.lastSItemIdArr.length; i++) {
                    // 已有选择号时，刷新时 要把刷新前选择的号的选择状态显示出来，全场或半场也一样。
                    if (nextProps.lastSItemIdArr[i] == nextProps.cuntSItemId) {
                        this.setState({
                            isFullTime: nextProps.lastFullTimeArr[i],
                        })
                    }
                }
            }
        }
    }

    // 只刷新 当前选择的，和之前有选择的。 其余的就不刷了 浪费时间。
    shouldComponentUpdate(nextProps, nextState) {
        let aaa = nextState.isClearBalls != this.state.isClearBalls; // 选择不同区域了 为true。
        let bbb = nextProps.cuntSItemId == nextProps.lastSItemId; // 这个本次选择的
        let ccc = nextProps.cuntSItemId == nextProps.lastLastSItemIdx; // 上上次选择的，展开选择后 隐藏再展开 选不同区的号时 有用。
        let ddd = nextProps.data != this.props.data; // 数据源不相同时
        let eee = nextProps.isAllBetCallback == true;  // 从所有玩法 或 综合购物车 回来的
        let fff = nextState.seleBallDic != this.state.seleBallDic; // 选择号码数据不相同时。主要是综合过关 选择几关后 突然去取消第一次选择的 状态去不掉
        let ggg = nextState.isFullTime != this.state.isFullTime;  // 半场全场切换的
        if (aaa || bbb || ccc || ddd || eee || fff || ggg) {
            return true;
        } else {
            return false;
        }
    }

    render() {

        let h = this.props.style.height - Adaption.Height(60);
        let w = SCREEN_WIDTH - 21;
        let isShowCorner = this.props.data.is_corner == 1 ? '(角球数) ' : '';

        //是否显示比分，滚球要显示
        let teamScore = this.props.game_typeID != 0 ? 'VS' : this.props.data.team_score;
        
        let rollingTime = '';
        if (this.props.data.rolling_time.length > 0) {
            let splitArr = this.props.data.rolling_time.split(' '); //分割后台返回的时间字符串

            if (this.props.data.rolling_time.includes('1H')) {
                rollingTime = isShowCorner + '上半场 ' + splitArr[splitArr.length - 1]; //上半场

            } else if (this.props.data.rolling_time.includes('2H')) {
                rollingTime = isShowCorner + '下半场 ' + splitArr[splitArr.length - 1]; //下半场

            } else {
                rollingTime = isShowCorner + this.props.data.rolling_time;
            }
        } else {
            rollingTime = isShowCorner + Moment.unix(parseInt(this.props.data.begin_time)/1000).format('MM/DD HH:mm:ss');
        }

        return (
            <View style={[styles.itemBorderStyle, this.props.style]}>
                {/* 灰 顶部 */}
                <View style={[styles.itemHeaderGreyView, {height: Adaption.Height(60)}]}>
                    <Text allowFontScaling={false} style={{ marginTop: Adaption.Height(7), fontSize: Adaption.Font(17), color:'#313131' }}>{`${this.props.data.h}${this.props.data.is_neutral == 1 ? '[中]' : ''}   ${teamScore}   ${this.props.data.v}`}</Text>
                    <Text allowFontScaling={false} style={{ margin: Adaption.Height(5), fontSize: Adaption.Font(15), color:'#313131' }}>{rollingTime}</Text>
                </View>

                <View style={{ height: h, flexDirection: 'row' }}>

                    {/* 左边 */}
                    <View style={{ height: h, width: w * 0.2 }}>
                        <View style={{ height: (h-1) / 4.0, justifyContent: 'center', alignItems: 'center', borderColor: '#d2d2d2', borderRightWidth: 0.5, borderBottomWidth: 0.5 }}>
                            <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(17), color:'#313131' }}>独赢</Text>
                        </View>
                        <View style={{ height: (h-1) / 4.0, justifyContent: 'center', alignItems: 'center', borderColor: '#d2d2d2', borderRightWidth: 0.5, borderBottomWidth: 0.5 }}>
                            <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(17), color:'#313131' }}>让球</Text>
                        </View>
                        <View style={{ height: (h-1) / 4.0, justifyContent: 'center', alignItems: 'center', borderColor: '#d2d2d2', borderRightWidth: 0.5, borderBottomWidth: 0.5 }}>
                            <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(17), color:'#313131' }}>大小</Text>
                        </View>
                        <View style={{ height: h / 4.0, justifyContent: 'center', alignItems: 'center', borderColor: '#d2d2d2', borderRightWidth: 0.5 }}>
                            <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(17), color:'#313131' }}>单双</Text>
                        </View>
                    </View>

                    {/* 中间 */}
                    <DyRqDxItem style={{ height: h - 1, width: w * 0.6 }} 
                        data={this.props.data.bet_data}
                        isFullTime={this.state.isFullTime}
                        isClearBalls={this.state.isClearBalls}
                        cuntSItemId={this.props.cuntSItemId}
                        lastSItemIdArr={this.props.lastSItemIdArr}
                        lastIdxArr={this.props.lastIdxArr}
                        lastFullTimeArr={this.props.lastFullTimeArr}
                        isAllBetCallback={this.props.isAllBetCallback}
                        ballClick={(ballDic) => {

                            this.setState({
                                isClearBalls: false,
                                seleBallDic: ballDic,
                            })

                            this.props.ballsClick ? this.props.ballsClick(ballDic) : null;
                        }}
                    >
                    </DyRqDxItem>

                    {/* 右边 */}
                    <View style={{ height: h, width: w * 0.2 }}>
                        <View style={{
                            height: h / 2.0, justifyContent: 'center', alignItems: 'center',
                            borderColor: '#d2d2d2', borderBottomWidth: 0.5
                        }}>
                            <TouchableOpacity activeOpacity={0.8} style={{ backgroundColor: this.state.isFullTime ? COLORS.appColor : 'rgba(0,0,0,0)', width: w * 0.2 * 0.8, height: h / 2.0 / 4, borderRadius: h / 2.0 / 4 / 2, marginBottom: 10, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => {
                                    this.setState({
                                        isClearBalls: true,
                                        isFullTime: true,
                                    })
                                }}
                            >
                                <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(17, 15), color: this.state.isFullTime ? '#fff' : '#000' }}>全场</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity activeOpacity={0.8} style={{ backgroundColor: !this.state.isFullTime ? COLORS.appColor : 'rgba(0,0,0,0)', width: w * 0.2 * 0.8, height: h / 2.0 / 4, borderRadius: h / 2.0 / 4 / 2, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => {
                                    this.setState({
                                        isClearBalls: true,
                                        isFullTime: false,
                                    })
                                }}
                            >
                                <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(17, 15), color: !this.state.isFullTime ? '#fff' : '#000' }}>半场</Text>
                            </TouchableOpacity>

                        </View>
                        <TouchableOpacity activeOpacity={0.8} style={{ height: h / 2.0, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => {
                                this.props.allPlayClick ? this.props.allPlayClick() : null;
                            }}
                        >
                            <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(18), color:'#7e6b5a' }}>{`所有${'\n'}玩法`}</Text>
                            <Image resizeMode={'contain'} style={{width: Adaption.Width(13), height: Adaption.Width(13) }} source={require('../../img/AllGame.png')}/>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        )
    }
}


class DyRqDxItem extends Component {

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
          
        } else if (nextProps.isAllBetCallback == true) {
            // 从所有玩法选择号码后回调回来的 重置seleIdx，如果有选择号码的会从lastIdxArr里拿到状态
            this.setState({
                seleIdx: -1,
            })
        }
    }

    _centerVews() {

        let row = 4;  // 行
        let height = this.props.style.height / row;
        var rowViews = [];

        for (let a = 0; a < row; a++) {

            let playMethod = '';
            if (a == 0) {
                playMethod = '1X2'; // 独赢
            } else if (a == 1) {
                playMethod = 'HC'; // 让球
            } else if (a == 2) {
                playMethod = 'GL';  // 大小
            } else {
                playMethod = 'TGOE';  // 单双
            }

            if (!this.props.isFullTime) {
                playMethod = `H${playMethod}`; // 半场的
            }

            let data = this.props.data[playMethod];
            if (a == 0) {
                data = [this.props.data[playMethod][0], this.props.data[playMethod][2], this.props.data[playMethod][1]];
            } else if (a == 1) {
                data = this.props.data[playMethod] ? [...[this.props.data[playMethod]['H']], ...[this.props.data[playMethod]['V']]] : [];
            } else if (a == 2) {
                data = this.props.data[playMethod] ? [...[this.props.data[playMethod]['OV']], ...[this.props.data[playMethod]['UN']]] : [];
            }

            var columnViews = [];
            for (let b = 0; b < 3; b++) {
                let idx = b + (a * 3);
                
                // 上次选择的。 主要是为了 点击收起展开时 选择状态保留住。
                let islastSlt = false;
                let isLast1 = this.state.seleIdx == -1;
                if (isLast1 && this.props.lastIdxArr[0] != -1) {
                    for (let i = 0; i < this.props.lastSItemIdArr.length; i++) {
                        if (this.props.lastSItemIdArr[i] == this.props.cuntSItemId) {
                            if (this.props.lastIdxArr[i] == idx && this.props.lastFullTimeArr[i] == this.props.isFullTime) {
                                islastSlt = true;
                            }
                        }
                    }
                }
                let isSelect = this.state.seleIdx == idx || (isLast1 && islastSlt);

                let bIdx = a > 0 ? (b == 1 ? 2 : b == 2 ? 1 : 0) : b;

                columnViews.push(
                    <TouchableOpacity key={idx} activeOpacity={0.8} 
                        style={{
                            justifyContent: 'center', alignItems: 'center',
                            width: this.props.style.width / 3.0, height: height, 
                            borderColor: isSelect ? '#f00' : '#d2d2d2',
                            borderRightWidth: isSelect ? 1 : 0.5, borderBottomWidth: isSelect ? 1 : (a == row - 1 ? 0 : 0.5),
                            borderLeftWidth: isSelect ? 1 : 0, borderTopWidth: isSelect ? 1 : 0,
                            backgroundColor: isSelect ? '#fafffa' : 'rgba(0,0,0,0)',
                        }}
                        onPress={() => {
                            
                            if (data == null || data[bIdx] == null || data[bIdx].p == null || data[bIdx].p == '/' || data[bIdx].p == '') {
                                return;
                            }

                            let dict = {};
                            if (isSelect) {
                                this.state.seleIdx = -1;
                          
                            } else {
                                this.state.seleIdx = idx;

                                let ballD = {'playMethod': playMethod, 'isFullTime': this.props.isFullTime, isHVXO: bIdx == 0 ? 'h' : (a == 0 && bIdx == 1) ? 'x' : 'v', sltIdx: idx};

                                if (a == 0) {
                                    ballD['kTit'] = b == 0 ? '主' : b == 2 ? '客' : '和局';
                                } else if (a == 1) {
                                    ballD['kTit'] = b == 0 ? '主' : '客';
                                } else if (a == 2) {
                                    ballD['kTit'] = b == 0 ? '大' : '小';
                                } else if (a == 3) {
                                    ballD['kTit'] = b == 0 ? '单' : '双';
                                } 

                                Object.assign(ballD, data[bIdx]);
                                dict[this.props.cuntSItemId] = ballD;
                            }

                            this.props.ballClick ? this.props.ballClick(dict) : null;
                            this.setState({ seleIdx: this.state.seleIdx });
                        }}>

                        {/* 独赢 */}
                        {a == 0 && data != null && data[bIdx] != null && data[bIdx].p != null && data[bIdx].p != '/' && data[bIdx].p != ''
                            ?<View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: isSelect ? '#e33939' : '#676767' }}>{data[bIdx].p}</Text>
                                {data[bIdx].t != null && data[bIdx].t != 'e' ? <Image resizeMode={'contain'} style={{width: Adaption.Width(13), height: Adaption.Width(13), marginLeft: Adaption.Width(5) }} source={data[bIdx].t == 'd' ? require('../../img/PlDown.png') : require('../../img/PlUp.png')}/> : null}
                            </View>
                            
                            // 让球。主或客队里 k值有带负号的表示是那一队让分，让分就显示(显示不要负号)在那一队。  H:[{'k': '-1.5/2', 'p':'0.8'}];这代码主队让1.5/2个球
                            : a == 1 && data != null && data[bIdx] != null && data[bIdx].p != null && data[bIdx].p != '/' && data[bIdx].p != ''
                                ? <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <View  style={{ justifyContent: 'center', alignItems: 'center'}}>
                                        { data[bIdx].k.indexOf('-') == 0 ? <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: '#22AC38' }}>{`${data[bIdx].k}`.substr(1, `${data[bIdx].k}`.length - 1)}</Text> : null}
                                        <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: isSelect ? '#e33939' : '#676767' }}>{data[bIdx].p}</Text>
                                    </View>
                                    {data[bIdx].t != null && data[bIdx].t != 'e' ? <Image resizeMode={'contain'} style={{width: Adaption.Width(13), height: Adaption.Width(13) }} source={data[bIdx].t == 'd' ? require('../../img/PlDown.png') : require('../../img/PlUp.png')}/> : null}
                                </View>
                                    
                                    // 大小
                                    : a == 2 && data != null && data[bIdx] != null && data[bIdx].p != null && data[bIdx].p != '/' && data[bIdx].p != ''
                                        ? <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                            <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: isSelect ? '#e33939' : '#676767' }}>{b == 0 ? '大' : '小'}</Text>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: Adaption.Width(3) }}>
                                                <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: '#22AC38' }}>{data[bIdx].k}</Text>
                                                <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: isSelect ? '#e33939' : '#676767' }}>{data[bIdx].p}</Text>
                                            </View>
                                            {data[bIdx].t != null && data[bIdx].t != 'e' ? <Image resizeMode={'contain'} style={{width: Adaption.Width(13), height: Adaption.Width(13) }} source={data[bIdx].t == 'd' ? require('../../img/PlDown.png') : require('../../img/PlUp.png')}/> : null}
                                        </View> 

                                        // 单双
                                        : a == 3 && data != null && data[bIdx] != null && data[bIdx].p != null && data[bIdx].p != '/' && data[bIdx].p != ''
                                            ? <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                                <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: isSelect ? '#e33939' : '#676767' }}>{data[bIdx].p}</Text>
                                                {data[bIdx].t != null && data[bIdx].t != 'e' ? <Image resizeMode={'contain'} style={{width: Adaption.Width(13), height: Adaption.Width(13), marginLeft: Adaption.Width(5) }} source={data[bIdx].t == 'd' ? require('../../img/PlDown.png') : require('../../img/PlUp.png')}/> : null}
                                            </View>
                                            : <View style={{ justifyContent: 'center', alignItems: 'center'}}>
                                                <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: '#676767'}}>{a > 0 && b == 1 ? '' : '/'}</Text>
                                            </View>
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