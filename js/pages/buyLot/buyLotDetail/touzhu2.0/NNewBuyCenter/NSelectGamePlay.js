/**
 Created by Money on 2018/07/16
 选择官方 双面玩法。和里面的玩法。。。
 */
import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Modal,
    FlatList,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

export default class NSelectGamePlay extends Component {

    constructor(props) {
        super(props);

        let isShowWanfaMenu = true;
        let isShowOneMenu = true;
        let isShowTwoMenu = true;
        if (props.js_tag == 'lhc') {
            isShowWanfaMenu = false;
            
        } else if (props.js_tag == 'qxc') {
            isShowTwoMenu = false;

        } else if (props.js_tag == 'xync') {
            isShowWanfaMenu = false;
            isShowTwoMenu = false;

        } else if (props.js_tag == 'xypk') {
            isShowWanfaMenu = false;
        }

        if (props.wanfaIdx == 1 && props.js_tag != 'xync' && props.js_tag != 'xypk') {
            isShowOneMenu = false;
        }

        this.state = {
            wanfaIdx: props.wanfaIdx,  // 前面那个是1，后台那个是0。官方为0，双面为1
            slectOneIdx: props.slectOneIdx,  // 一级菜单
            slectTwoIdx: props.slectTwoIdx,  // 二级菜单
            slectThreeIdx: props.slectThreeIdx,// 三级菜单
            isShowWanfaMenu: isShowWanfaMenu,  // 是否显示 官方双面那按钮
            isShowOneMenu: isShowOneMenu,  // 是否显示 官方双面 下面那排view(现在一般是双面的不显示)
            isShowTwoMenu: isShowTwoMenu,  // 是否显示 最下面那排view
            currentGamePlayData: props.allGamePlayData[props.wanfaIdx],
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            // currentGamePlayData: nextProps.allGamePlayData[nextProps.wanfaIdx],
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        let aaa = this.state.wanfaIdx != nextState.wanfaIdx;
        let bbb = this.state.slectOneIdx != nextState.slectOneIdx;
        let ccc = this.state.slectTwoIdx != nextState.slectTwoIdx;
        let ddd = this.state.slectThreeIdx != nextState.slectThreeIdx;
        let eee = this.state.currentGamePlayData != nextState.currentGamePlayData;

        if (aaa || bbb || ccc || ddd || eee) {
            return true;
        } else {
            return false;
        }
    }

    // 下标，前面那个是1，后面那个是0。
    render() {

        return (
            <Modal
                visible={this.props.isClose}
                transparent={true}
                style={{ flex: 1 }}
            >
                <TouchableOpacity activeOpacity={1}
                    onPress={() => {
                        this.props.close ? this.props.close() : null;
                    }}>
                    <View style={{ height: SCREEN_HEIGHT == 812 ? 88 : 64, width: SCREEN_WIDTH }}></View>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1}
                    style={{ height: SCREEN_HEIGHT, backgroundColor: 'rgba(0,0,0,0.4)' }}
                    onPress={() => {
                        this.props.close ? this.props.close() : null;
                    }}>
                    {this.state.isShowWanfaMenu
                        ? <TouchableOpacity activeOpacity={1} style={{ width: SCREEN_WIDTH, height: Adaption.Width(70), backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity activeOpacity={1}
                                style={{
                                    backgroundColor: this.state.wanfaIdx == 1 ? '#e33939' : 'white',
                                    borderRadius: 5,
                                    borderWidth: this.state.wanfaIdx == 1 ? 0 : 1,
                                    borderColor: 'lightgray',
                                    width: Adaption.Width(120),
                                    height: Adaption.Width(40),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: Adaption.Width(30),
                                }}
                                onPress={() => {
                                    if (this.state.wanfaIdx == 1) {
                                        this.props.close ? this.props.close() : null;
                                    } else {
                                        this.props.onPressWanfaIdx ? this.props.onPressWanfaIdx(1) : null;
                                    }
                                }}>
                                <CusBaseText style={{ fontSize: Adaption.Font(19, 15), color: this.state.wanfaIdx == 1 ? 'white' : 'black' }}>{this.props.titleData[0]}</CusBaseText>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={1}
                                style={{
                                    backgroundColor: this.state.wanfaIdx == 0 ? '#e33939' : 'white',
                                    borderRadius: 5,
                                    borderWidth: this.state.wanfaIdx == 0 ? 0 : 1,
                                    borderColor: 'lightgray',
                                    width: Adaption.Width(120),
                                    height: Adaption.Width(40),
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onPress={() => {
                                    this.setState({
                                        wanfaIdx: 0,
                                        isShowOneMenu: true,
                                        currentGamePlayData: this.props.allGamePlayData[0],
                                    })
                                    this.props.playClick ? this.props.playClick(this.props.allGamePlayData[0][this.state.slectOneIdx].submenu[this.state.slectTwoIdx].playlist[this.state.slectThreeIdx], this.state.slectOneIdx, this.state.slectTwoIdx, this.state.slectThreeIdx, true) : null;
                                }}>
                                <CusBaseText style={{ fontSize: Adaption.Font(19, 15), color: this.state.wanfaIdx == 0 ? 'white' : 'black' }}>{this.props.titleData[1]}</CusBaseText>
                            </TouchableOpacity>
                        </TouchableOpacity>
                        : null
                    }

                    {this.state.isShowOneMenu
                        ? <TouchableOpacity activeOpacity={1} style={{ backgroundColor: '#fff', flexDirection: 'row', flexWrap: 'wrap' }}>{this._createOneMenuView(this.state.currentGamePlayData)}</TouchableOpacity>
                        : null
                    }
                    {this.state.isShowOneMenu && this.state.isShowTwoMenu
                        ? <TouchableOpacity activeOpacity={1} style={{ backgroundColor: '#f5f5f5' }}>
                            {this._createTwoMenuView(this.state.currentGamePlayData[this.state.slectOneIdx]['submenu'])}
                        </TouchableOpacity>
                        : null
                    }
                </TouchableOpacity>
            </Modal>
        )
    }

    _createOneMenuView(value) {
        let space = Adaption.Width(13);
        let viewArr = [];
        for (let a = 0; a < value.length; a++) {
            viewArr.push(
                <TouchableOpacity key={a} activeOpacity={0.5}
                    onPress={() => {

                        if (!this.state.isShowTwoMenu) {
                            // 不显示twoMenu的，点击直接回调了。
                            this.props.playClick ? this.props.playClick(this.state.currentGamePlayData[a].submenu[0].playlist[0], a, 0, 0) : null;

                        } else {
                            this.setState({
                                slectOneIdx: a,
                                slectTwoIdx: 0,
                                slectThreeIdx: 0,
                            })
                            // 默认返回当前点击的一级菜单里面的第一条数据，第五个参数true是不需要隐藏这个model。
                            this.props.playClick ? this.props.playClick(this.state.currentGamePlayData[a].submenu[0].playlist[0], a, 0, 0, true) : null;
                        }
                    }}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor: '#dbdbdb',
                        backgroundColor: this.state.slectOneIdx == a ? '#e33939' : '#fff',
                        borderWidth: this.state.slectOneIdx == a ? 0 : 1,
                        borderRadius: 5,
                        height: Adaption.Width(37),
                        width: (SCREEN_WIDTH - 5 * space) / (value.length < 4 ? value.length : 4),
                        marginLeft: space,
                        marginTop: space,
                        marginBottom: a == value.length - 1 ? Adaption.Width(20) : 0,
                    }}
                >
                    <Text allowFontScaling={false} style={{ color: this.state.slectOneIdx == a ? '#fff' : '#5f5f5f', fontSize: value[a].name.length > 5 ? Adaption.Font(16, 12) : Adaption.Font(18, 14) }}>{value[a].name}</Text>
                </TouchableOpacity>
            )
        }
        return viewArr;
    }


    // 创建二三级玩法视图
    _createTwoMenuView(playDataArray) {

        let playname = playDataArray[0].playlist[0].playname;
        let numColu = (playname.length >= 5 && !playname.includes('1') && !playname.includes('/')) ? 2 : 3;

        var singleViewArr = [];
        var totalHeight = 20; // 额外加20
        for (let i = 0; i < playDataArray.length; i++) {

            let playlist = playDataArray[i].playlist;//当前所对应的玩法
            let row = Math.ceil(playlist.length / numColu);
            let cellHeight = row * 50 + 10;
            totalHeight += cellHeight;

            singleViewArr.push(
                <SingleMenuView key={playlist[0].playid} style={{ flexDirection: 'row', height: Adaption.Width(cellHeight), width: SCREEN_WIDTH }}
                    listData={playlist}
                    name={playDataArray[i].name}
                    rowIdx={i}
                    numColumn={numColu}
                    twoindex={this.state.slectTwoIdx}
                    threeindex={this.state.slectThreeIdx}
                    isLastItem={i == playDataArray.length - 1 ? true : false}
                    itemClick={(data, twoidx, threeidx) => {

                        // 选择没改变的 直接关闭。
                        if (twoidx == this.state.slectTwoIdx && threeidx == this.state.slectThreeIdx) {
                            this.props.close ? this.props.close() : null;
                        } else {
                            this.props.playClick ? this.props.playClick(data, this.state.slectOneIdx, twoidx, threeidx) : null;
                        }
                    }}
                >
                </SingleMenuView>
            )
        }
        return (
            <ScrollView style={{ height: totalHeight > Adaption.Height(400) ? Adaption.Height(400) : totalHeight }}>{singleViewArr}</ScrollView>
        )
    }
}

class SingleMenuView extends Component {

    constructor(props) {
        super(props);
    }

    _renderItemView = (item) => {
        let itemW = (this.props.style.width * 0.73 - 4 * Adaption.Width(10)) / 3.0;
        if (this.props.numColumn == 2) {
            itemW = (this.props.style.width * 0.73 - 3 * Adaption.Width(10)) / 2.0;
        }

        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: itemW,
                    height: Adaption.Width(40),
                    marginTop: Adaption.Width(10),
                    marginLeft: Adaption.Width(10),
                    borderRadius: Adaption.Width(5),
                    borderWidth: Adaption.Width(1),
                    borderColor: (this.props.threeindex == item.index && this.props.twoindex == this.props.rowIdx) ? '#e33939' : '#dbdbdb',
                }}
                onPress={() => {
                    this.props.itemClick ? this.props.itemClick(item.item, this.props.rowIdx, item.index) : null
                }}>
                <CusBaseText style={{ color: (this.props.threeindex == item.index && this.props.twoindex == this.props.rowIdx) ? '#e33939' : '#5f5f5f', fontSize: Adaption.Font(17, 14) }}>
                    {item.item.playname}
                </CusBaseText>
            </TouchableOpacity>
        )
    }

    render() {

        let leftW = this.props.style.width * (this.props.name.length >= 6 ? 0.32 : 0.27);
        let rightW = this.props.style.width * (this.props.name.length >= 6 ? 0.68 : 0.73);

        return (
            <View>
                <View style={this.props.style}>

                    <View style={{ width: leftW }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ alignItems: 'center', left: Adaption.Width(10), top: Adaption.Width(55 - 15) / 2.0 }}>
                                <View style={{ width: Adaption.Width(15), height: Adaption.Width(15), borderRadius: Adaption.Width(15 * 0.5), borderColor: '#d3d3d3', borderWidth: 3 }}></View>
                                <View style={{ width: 1, height: this.props.isLastItem ? 0 : this.props.style.height - (Adaption.Width(55 - 30) / 2.0), backgroundColor: '#d3d3d3' }}></View>
                            </View>
                            <View style={{ left: 15, justifyContent: 'center', height: Adaption.Width(55) }}>
                                <CusBaseText style={{ fontSize: Adaption.Font(17), color: '#535353' }}>
                                    {this.props.name}
                                </CusBaseText>
                            </View>
                        </View>
                    </View>

                    <View style={{ width: rightW }}>
                        <FlatList
                            style={{}}
                            automaticallyAdjustContentInsets={false}
                            alwaysBounceHorizontal={false}
                            data={this.props.listData}
                            renderItem={this._renderItemView}
                            keyExtractor={(item, index) => { return String(index) }}
                            horizontal={false} //水平还是垂直
                            numColumns={this.props.numColumn} //指定多少列
                            scrollEnabled={false}
                        >
                        </FlatList>
                    </View>
                </View>
                {this.props.isLastItem ? null : <Image style={{ height: Adaption.Width(0.5), width: this.props.style.width - 35, marginLeft: 30, }} source={require('../../../img/ic_dottedLine.png')} />}
            </View>
        );
    }
}