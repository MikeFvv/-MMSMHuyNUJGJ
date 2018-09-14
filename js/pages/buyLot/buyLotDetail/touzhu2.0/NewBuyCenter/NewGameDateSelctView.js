/**
 Created by Ward on 2018/01/06
 新版玩法选择视图
 */
import React, { Component } from 'react';
import {
    View,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    FlatList,
} from 'react-native';

export default class NewGameDateSelctView extends Component {

    constructor(props) {
        super(props);

        var numColu = 3; // item显示多少列

        this.state = ({
            isClose: props.isClose,
            playDataArr: props.values,    //当前一级菜单下所有玩法
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isClose: nextProps.isClose,
            playDataArr: nextProps.values, //当前一级菜单下所有玩法
        })
    }

    //动态创建玩法视图
    _createGamePlayView(playDataArray) {

        var singleViewArr = [];
        for (let i = 0; i < playDataArray.length; i++) {

            let playlist = playDataArray[i].playlist;//当前所对应的玩法

            let playlist_key = []; // 加个key
            for (let n = 0; n < playlist.length; n++) {
                playlist_key[n] = { key: n, value: playlist[n] };
            }

            let row = parseInt(playlist.length / numColu) + (playlist.length % numColu > 0 ? 1 : 0);
            let cellHeight = row * 50 + 10;

            singleViewArr.push(
                <SingleView key={i} style={{ flexDirection: 'row', height: Adaption.Width(cellHeight), width: SCREEN_WIDTH - Adaption.Width(40) }}
                    listData={playlist_key}
                    name={playDataArray[i].name}
                    idx={i}
                    numColumn={numColu}
                    towindex={this.props.towIndex}
                    threeindex={this.props.threeIndex}
                    isLastItem={i == playDataArray.length - 1 ? true : false}
                    itemClick={(data, towidx, threeidx) => {

                        // 选择没改变的 直接关闭。
                        if (towidx == this.props.towIndex && threeidx == this.props.threeIndex) {
                            this.props.close ? this.props.close() : null;
                        } else {
                            this.props.playClick ? this.props.playClick(data, towidx, threeidx) : null;
                        }
                    }}
                >
                </SingleView>
            )
        }
        return singleViewArr;
    }

    render() {

        if (this.state.playDataArr.length <= 0) {
            return null;
        }

        let viewHeight = 60; // 视图高度
        for (let a = 0; a < this.state.playDataArr.length; a++) {
            let playlist = this.state.playDataArr[a].playlist;

            let playname = playlist[0].playname;
            numColu = (playname.length >= 5 && !playname.includes('1') && !playname.includes('/')) ? 2 : 3;

            let row = parseInt(playlist.length / numColu) + (playlist.length % numColu > 0 ? 1 : 0);
            viewHeight += row * 50 + 10;
        }
        viewHeight += 30; // 额外 再加30
        viewHeight = viewHeight > 480 ? 480 : viewHeight;

        return (
            <Modal
                visible={this.state.isClose}
                animationType={'none'}
                transparent={true}
                onRequestClose={() => { }}
            >
                <TouchableOpacity activeOpacity={1} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                        this.props.close ? this.props.close() : null;
                    }}>
                    <TouchableOpacity activeOpacity={1}
                        style={{ height: Adaption.Width(viewHeight), width: SCREEN_WIDTH - Adaption.Width(40), backgroundColor: '#fff', borderRadius: 5 }}>
                        <View style={{ flexDirection: 'row', height: Adaption.Width(60) }}>
                            <View style={{ flex: 0.1 }}></View>
                            <View style={{ flex: 0.9, justifyContent: 'center', alignItems: 'center' }}>
                                <CusBaseText style={{ color: '#535353', fontSize: Adaption.Font(20, 18) }}>
                                    {this.props.title}
                                </CusBaseText>
                            </View>
                            <TouchableOpacity activeOpacity={0.7} style={{ flex: 0.1, justifyContent: 'center' }}
                                onPress={() => {
                                    this.props.close ? this.props.close() : null;
                                }}>
                                <Image style={{ width: Adaption.Width(17), height: Adaption.Width(17) }} source={require('../img/ic_buyLot_Close.png')} />
                            </TouchableOpacity>
                        </View>
                        
                        <Image style={{ height: Adaption.Width(1), width: SCREEN_WIDTH - Adaption.Width(40) }} source={require('../../../img/ic_dottedLine.png')} />

                        <ScrollView>
                            {this._createGamePlayView(this.state.playDataArr)}
                        </ScrollView>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        )
    }
}

class SingleView extends Component {

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
                    borderColor: (this.props.threeindex == item.index && this.props.towindex == this.props.idx) ? '#eb384d' : '#cccccc',
                }}
                onPress={() => {
                    this.props.itemClick ? this.props.itemClick(item.item.value, this.props.idx, item.index) : null
                }}>
                <CusBaseText style={{ color: (this.props.threeindex == item.index && this.props.towindex == this.props.idx) ? '#eb384d' : '#5f5f5f', fontSize: Adaption.Font(17, 14) }}>
                    {item.item.value.playname}
                </CusBaseText>
            </TouchableOpacity>
        )
    }

    render() {

        let leftW = this.props.style.width * (this.props.name.length >= 6 ?  0.32 : 0.27);
        let rightW = this.props.style.width * (this.props.name.length >= 6 ?  0.68 : 0.73);

        return (
            <View>
                <View style={this.props.style}>

                    <View style={{ width: leftW }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ alignItems: 'center', left: Adaption.Width(10), top: Adaption.Width(55-15) / 2.0 }}>
                                <View style={{ width: Adaption.Width(15), height: Adaption.Width(15), borderRadius: Adaption.Width(15*0.5), borderColor: '#d3d3d3', borderWidth: 3 }}></View>
                                <View style={{ width: 1, height: this.props.isLastItem ? 0 : this.props.style.height - (Adaption.Width(55-30) / 2.0), backgroundColor: '#d3d3d3' }}></View>
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
                            style={{ }}
                            automaticallyAdjustContentInsets={false}
                            alwaysBounceHorizontal={false}
                            data={this.props.listData}
                            renderItem={this._renderItemView}
                            horizontal={false} //水平还是垂直
                            numColumns={this.props.numColumn} //指定多少列
                            scrollEnabled={false}
                        >
                        </FlatList>
                    </View>
                </View>
                {this.props.isLastItem ? null : <Image style={{ height: Adaption.Width(0.5), width: this.props.style.width - 35, marginLeft:30, }} source={require('../../../img/ic_dottedLine.png')} />}
            </View>
        );
    }
}

