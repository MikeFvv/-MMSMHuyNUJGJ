/**
 Created by Money on 2018/05/10
  双面路纸图
 */

import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

let inset_10 = Adaption.Width(10);

export default class RoadMapDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectIdx: this.props.selectIdx,
            scrollTitle: this.props.btnTitArr[this.props.selectIdx],
        }
    }

     // 返回是否要刷新render
    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.selectIdx == nextState.selectIdx && this.props.data == nextProps.data) {
            return false;  // 不刷新。
        }
        return true;
    }

    // 按钮
    _btnViews(data) {
        let viewArr = [], rowView = [];
        for (let a = 0; a < data.length; a++) {
            rowView.push(
                <TouchableOpacity activeOpacity={0.8} key={a} 
                    style={{ margin: inset_10, marginBottom: 3, width: SCREEN_WIDTH / 3.0 - inset_10*2, height: Adaption.Width(30), justifyContent: 'center', alignItems: 'center', 
                        borderColor: '#e5e5e5', borderWidth: a == this.state.selectIdx ? 0 : 1, borderRadius: 3, backgroundColor: a == this.state.selectIdx ? '#e33939' : '#fff'
                    }}
                    onPress={() => {
                        this.setState({
                            selectIdx: a,
                            scrollTitle: data[a],
                        })
                        this.props.clickBtnIdx ? this.props.clickBtnIdx(a) : null;
                    }}
                    >
                    <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 13), color: a == this.state.selectIdx ? '#fff' : '#494949' }}>{data[a]}</Text>
                </TouchableOpacity>
            )

            if (a % 3 == 2 || a == data.length - 1) {
                viewArr.push(<View key={a} style={{ flexDirection:'row' }}>{rowView}</View>)
                rowView = [];  // 换行 清空。
            }
        }
        return viewArr;
    }

    // 滚动表格
    _scrollTableView(data) {

        let tit = this.state.scrollTitle;
        let key = '';
        if (tit.includes('尾')) {
            key = 'hzwdx';
        } else if (tit.includes('后二')) {
            key = 'hrhz';
        } else if (tit.includes('和')) {
            key = 'bahz';
        } else if (tit.includes('特码')) {
            key = 'ba_4';
        } else if (tit.includes('冠') || tit.includes('一')) {
            key = tit.includes('龙') ? 'ba_1lh' : 'ba_1';
        } else if (tit.includes('亚') || tit.includes('二')) {
            key = tit.includes('龙') ? 'ba_2lh' : 'ba_2';
        } else if (tit.includes('季') || tit.includes('三')) {
            key = tit.includes('龙') ? 'ba_3lh' : 'ba_3';
        } else if (tit.includes('四')) {
            key = tit.includes('龙') ? 'ba_3lh' : 'ba_4';
        } else if (tit.includes('五')) {
            key = tit.includes('龙') ? 'ba_5lh' : 'ba_5';
        }

        let ba_ov = key == 'bahz' ? this.props.bahz_ov : this.props.ba_ov;

        let currentData = data[key];  // 当前的数据
        if (currentData[0] != null && currentData[0] != '?') {
            currentData.splice(0, 0, '?');  // ？号下一期的
        }
        console.log('key==='+key, currentData);
        let idx = currentData.length - 1;  // 下标从最后开始
        let lastState = '';  // 记录上次的状态
        let detourData = [[]]; // 到转弯了 数据就存在这里。
        let columnCont = 0;  // 记录最后显示有text的view的总列数。 主要用于改变scrollTableView的偏移量。
        let oneCont = 0; twoCont = 0;  // 记录大小单双的个数。
        let iiCount = 0;

        let viewsArr = []; // 总的，
        for (let ii = 0; ii < (iiCount > 0 ? iiCount : 200); ii++) {  // 列数

            let columnView = [];  // 每列的view
            let len = 5;  // 5行
            for (let jj = 0; jj < len; jj++) {

                let ball = currentData[idx];
                let crntBaState = '';
                if (ball == '?') {
                    crntBaState = '?';
                } else if ((lastState == '' && jj != 0) || ball == null) {
                    crntBaState = '';
                } else if (tit.includes('单双')) {
                    crntBaState = ball % 2 == 0 ? '双' : '单';
                } else if (tit.includes('大小')) {
                    crntBaState = ball < ba_ov ? '小' : '大';
                } else if (tit.includes('龙虎')) {
                    crntBaState = ball;
                }

                if ((lastState != crntBaState || ball == null) && (detourData.length > 1 || detourData[0].length > 0)) {
                    // 遍历删除前面为空的数组
                    for (let xx = detourData.length - 1; xx >= 0; xx--) {
                        let arr = detourData[xx];
                        if (arr.length == 0 && detourData[xx + 1] && detourData[xx + 1].length == 0) {
                            console.log('报告 排查发现两个非法目标。请求立即消灭。。', detourData);
                            detourData.splice(xx, 1); // 消灭
                            console.log('立即消灭。。', detourData);
                        } else if (arr.length > 0) {
                            console.log('报告 无法消灭 请求退出。当前速度=', xx);
                            break; // 如果先发现了不为空的数组，就要立即退出，再进去就是自寻死路
                        }
                        
                        if (ball == null) {
                            columnCont = viewsArr.length + 1;
                            iiCount = ii + 15; // 列数循环。在没有值后 在当前的(ii + 15)列 结束循环。
                            console.log('=========== 最大ii == '+columnCont);
                        }
                    }
                }

                if (crntBaState == lastState && lastState != '' && jj == 0) {
                    // 该到转弯了。 存起来。起飞后判断有值就拿出来显示。
                    detourData[detourData.length - 1].push(crntBaState);
                    console.log('报告 掉坑了。。', detourData);
                    idx--;
                    break;

                } else {

                    if (detourData[detourData.length - 1].length > 0) {
                        detourData.push([]);
                        console.log('报告 填坑完毕。似乎发现新坑。。', detourData);
                    }

                    // 没有转弯 正常起飞

                    if (detourData[len-jj-1] && detourData[len-jj-1].length > 0 || detourData.length > len-jj+1) {
                        if (detourData[len-jj-1].length > 0) {

                            let baStr = detourData[len-jj-1][0];
                            // 统计个数
                            if (baStr == '大' || baStr == '单' || baStr == '龙') {
                                oneCont += 1;
                            } else {
                                twoCont += 1;
                            }

                            columnView.push(
                                <View key={jj+100} style={{ width: Adaption.Width(27), height: Adaption.Width(27), borderColor: '#e5e5e5', borderBottomWidth: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: (baStr == '单' || baStr == '大' || baStr == '龙') ? '#494949' : '#e33939'}}>{baStr}</Text>
                                </View>
                            )
                            detourData[len-jj-1].splice(0, 1); // 删除
                            
                        } else {
                            columnView.push(
                                <View key={jj+100} style={{ width: Adaption.Width(27), height: Adaption.Width(27), borderColor: '#e5e5e5', borderBottomWidth: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                    {/* <Text style={{ fontSize: Adaption.Font(16, 14), color: '#5fcf66'}}>{ii}</Text> */}
                                </View>
                            )
                        }

                    } else {
                        
                        columnView.push(
                            <View key={jj+100} style={{ width: Adaption.Width(27), height: Adaption.Width(27), borderColor: '#e5e5e5', borderBottomWidth: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                {(lastState == crntBaState && crntBaState != '') || jj == 0
                                    ? <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 14), color: (crntBaState == '单' || crntBaState == '大' || crntBaState == '龙') ? '#494949' : crntBaState == '?' ? '#fa0' : '#e33939'}}>{crntBaState}</Text>
                                    //: <Text style={{ fontSize: Adaption.Font(16, 14), color: '#fa0'}}>{ii}</Text>
                                    : null
                                }
                            </View>
                        )

                        if ((lastState == crntBaState && crntBaState != '') || jj == 0) {
                            // 统计个数
                            if (idx >= 0) {
                                if (crntBaState == '大' || crntBaState == '单' || crntBaState == '龙') {
                                    oneCont += 1;
                                } else if (crntBaState != '?') {
                                    twoCont += 1;
                                }
                            }

                            lastState = crntBaState;
                            idx--; 

                        } else {
                            lastState = '';
                        }

                    }

                }
            }

            if (currentData[idx] == null && idx >= -2) {
                columnCont = viewsArr.length + 1;
                iiCount = ii + 15; // 列数循环。在没有值后 在当前的(ii + 15)列 结束循环。
                console.log('最大ii == '+columnCont);
            }

            if (columnView.length > 0) {
                viewsArr.push(
                    <View key={ii + 100} style={{ flexDirection: 'row' }}>
                        <View style={{ backgroundColor: '#e5e5e5', width: 0.6 }}></View>
                        <View key={ii + 100} style={{ }}>{columnView}</View>
                    </View>
                )
            }
        }


        // 设置滚动到当前最新的
        if (columnCont < 15) {  // 数里少的时候重置为0。
            this.refs.ScrollTableView && this.refs.ScrollTableView.scrollTo({ x: 0, animated: true }); // 滚动到最开始
        } else {
            // 防止ScrollView还没创建时，和偏移里的值从高变低时滚动不对，所以加延迟
            setTimeout(() => {
                this.refs.ScrollTableView && this.refs.ScrollTableView.scrollTo({ x: Adaption.Width(27) * columnCont - (SCREEN_WIDTH * 0.5), animated: true }); // 滚动到最开始
            }, 100);
        }
        
        let titleStr = `${this.state.scrollTitle.replace(/\-/g, '')}    ${this.state.scrollTitle.substr(this.state.scrollTitle.length - 2, 1)}（${oneCont}） ${this.state.scrollTitle.substr(-1)}（${twoCont}）`;
        return (
            <View>
                <View style={{ height: Adaption.Width(35), margin: inset_10, marginBottom: 0, backgroundColor: '#f3f3f3', justifyContent: 'center', alignItems: 'center' }}>
                    <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(17, 15), color: '#494949' }}>{titleStr}</Text>
                </View>

                <ScrollView style={{ marginLeft: inset_10, marginRight: inset_10, marginBottom: inset_10*2 }}
                    horizontal={true} // 水平显示
                    ref="ScrollTableView"
                    >
                    {viewsArr}
                </ScrollView>
            </View>
        )
    }

    render() {

        return (
            <View style={[this.props.style]}>
                {this._btnViews(this.props.btnTitArr)}
                {this._scrollTableView(this.props.data)}
            </View>
        )
    }

}
