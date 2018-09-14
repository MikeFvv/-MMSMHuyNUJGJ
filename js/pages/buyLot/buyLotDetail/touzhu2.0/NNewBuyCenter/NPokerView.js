/**
 Created by Money on 2018/08/08 18:08:08
    幸运扑克
    请不要格式化代码，谢谢！。
 */

import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    ImageBackground,
} from 'react-native';

import GetBallStatus from '../newBuyTool/GetBallStatus';

let tempArcArr = []; // 避免随机重复的

export default class NPokerView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectBallIdxArr: [], // 选择号码的下标。
        }

        this.pK1234Img = [require('../pkImg/poker1.png'), require('../pkImg/poker2.png'), require('../pkImg/poker3.png'), require('../pkImg/poker4.png')];
        this.pkA_KImg = [
            require('../pkImg/ic_pkA.png'), require('../pkImg/ic_pk2.png'), require('../pkImg/ic_pk3.png'), require('../pkImg/ic_pk4.png'), require('../pkImg/ic_pk5.png'),
            require('../pkImg/ic_pk6.png'), require('../pkImg/ic_pk7.png'), require('../pkImg/ic_pk8.png'), require('../pkImg/ic_pk9.png'), require('../pkImg/ic_pk10.png'),
            require('../pkImg/ic_pkJ.png'), require('../pkImg/ic_pkQ.png'), require('../pkImg/ic_pkK.png')
        ];

        this.pkbxImg1 = [require('../pkImg/pkA_1.png'), require('../pkImg/pkA_1.png'), require('../pkImg/pkA_1.png'), require('../pkImg/pkA_1.png'), require('../pkImg/pkA_2.png')];
        this.pkbxImg2 = [require('../pkImg/pkA_2.png'), require('../pkImg/pk2_3.png'), require('../pkImg/pk3_1.png'), require('../pkImg/pkA_2.png'), require('../pkImg/pk2_2.png')];
        this.pkbxImg3 = [require('../pkImg/pk3_2.png'), require('../pkImg/pk3_2.png'), require('../pkImg/pk4_1.png'), require('../pkImg/pkA_3.png'), require('../pkImg/pk3_2.png')];
    }

    componentWillReceiveProps(nextProps) {
        // 清空
        if (nextProps.clearAllBalls && this.state.selectBallIdxArr.length > 0) {
            this.setState({
                selectBallIdxArr: [],
            })
            this.props.ballClick ? this.props.ballClick({ [this.props.title]: [] }) : null;
        }

        // 机选
        if (nextProps.isBallsChange) {
            this._arcBallsMethod(nextProps);
        }
    }

    _arcBallsMethod(nextProps) {

        let js_tag = nextProps.js_tag;
        let playid = nextProps.playid;
        let arcNumArr = this._returnArcBallArr(1);  // 随机要选择的数。

        if (js_tag == 'xypk') {
            if (playid == 8) {
                // 任选二
                arcNumArr = this._returnArcBallArr(2);

            } else if (playid == 9) {
                // 任选三
                arcNumArr = this._returnArcBallArr(3);

            } else if (playid == 10) {
                // 任选四
                arcNumArr = this._returnArcBallArr(4);

            } else if (playid == 11) {
                // 任选五
                arcNumArr = this._returnArcBallArr(5);

            } else if (playid == 12) {
                // 任选六
                arcNumArr = this._returnArcBallArr(6);
            }
        }

        // 小到大排序
        if (arcNumArr.length > 1) {
            for (var x = 0; x < arcNumArr.length - 1; x++) {
                for (var y = 0; y < arcNumArr.length - 1 - x; y++) {

                    if (arcNumArr[y] > arcNumArr[y + 1]) {
                        let tempa = arcNumArr[y];
                        arcNumArr[y] = arcNumArr[y + 1];
                        arcNumArr[y + 1] = tempa;
                    }
                }
            }
        }

        this._returnBallsData(arcNumArr);  // 根据选择的下标回调 ball、peilv

        this.setState({
            selectBallIdxArr: arcNumArr,
        })
    }

    // 传入个数，返回随机的数组。不重复！
    _returnArcBallArr(count, lenght) {
        let arcArr = [];
        for (let i = 0; i < 100; i++) {
            let arcInt = Math.floor(Math.random() * (lenght ? lenght : this.props.balls.length));
            // 如果存在，就不加入数组。
            if ((!arcArr.includes(arcInt)) && (!tempArcArr.includes(arcInt))) {
                arcArr.push(arcInt);
                if (arcArr.length >= count) {
                    break; // 个数够了，就退出循环。
                }
            }
        }
        return arcArr;
    }

    _selectBalls(item) {
        var ballIdxArr = this.state.selectBallIdxArr;

        if (ballIdxArr.includes(item.index)) {
            // 存在，删除
            for (let idx in ballIdxArr) {
                if (ballIdxArr[idx] == item.index) {
                    ballIdxArr.splice(idx, 1);
                    break;
                }
            }

        } else {
            // 没有值，直接存
            if (ballIdxArr.length <= 0) {
                ballIdxArr.push(item.index);

            } else {

                // 有值，按大小插入
                for (let idx in ballIdxArr) {
                    if (item.index <= ballIdxArr[idx]) {
                        ballIdxArr.splice(idx, 0, item.index);
                        break;
                    } else if (idx == ballIdxArr.length - 1) {
                        ballIdxArr.push(item.index);
                    }
                }

                // 没有值，直接存 是防止ballIdxArr 为空。
                if (ballIdxArr.length <= 0) {
                    ballIdxArr.push(item.index);
                }
            }
        }

        this.setState({
            selectBallIdxArr: ballIdxArr,
        })
        this._returnBallsData(ballIdxArr); // 根据选择的ball下标 返回ball、peilv。
    }

    // 根据选择的ball下标 返回ball、peilv。
    _returnBallsData(selectBallIdxArr) {

        var selectBallArr = [], selectBallNumArr = [], selectPeilvs = [];
        for (let a = 0; a < selectBallIdxArr.length; a++) {
            let idx = selectBallIdxArr[a];
            let ball = this.props.balls[idx].ball;
            selectBallArr.push(`${ball}`);

            selectBallNumArr.push(`${idx}`);

            let peilv = this.props.balls[idx].peilv;
            if (peilv != null) {
                selectPeilvs.push(this.props.balls[idx].peilv);
            }
        }

        let ballsdata = { [this.props.title]: selectBallArr };
        if (selectBallNumArr.length > 0) {
            ballsdata[`${this.props.title}^^01`] = selectBallNumArr;
        }

        if (selectPeilvs.length > 0) {
            ballsdata['赔率'] = selectPeilvs;
        }

        this.props.ballClick ? this.props.ballClick(ballsdata) : null;
    }

    _renderItemView(item) {

        let numColumn = this.props.numColumn;
        let ballWidth = this.props.style.width / numColumn - Adaption.Width(this.props.spaceWidth > 0 ? this.props.spaceWidth : 15);
        let ballHeight = Adaption.Width(this.props.itemHeight > 0 ? this.props.itemHeight : 100);

        let spaceW = (this.props.style.width - (ballWidth * numColumn)) / (numColumn + 1);
        let spaceH = Adaption.Width(15);

        let itemIsSelect = this.state.selectBallIdxArr.includes(item.index); // 是不是选择状态的

        return (
            <View>
                <TouchableOpacity activeOpacity={0.8}
                    style={{
                        width: ballWidth, height: ballHeight, marginLeft: spaceW, marginTop: spaceH, justifyContent: 'center', alignItems: 'center',
                        borderStyle: itemIsSelect ? 'solid' : 'dashed', borderRadius: 3, borderColor: itemIsSelect ? '#f00' : '#cccccc', borderWidth: 1, backgroundColor: '#fff',
                    }}
                    onPress={() => {
                        this._selectBalls(item);
                    }}>

                    {this._createPkView(item, ballWidth, ballHeight)}
                </TouchableOpacity>

                {item.item.peilv ?
                    <View style={{ height: Adaption.Width(18), marginTop: 5 }}>
                        <Text allowFontScaling={false} style={{ textAlign: 'center', fontSize: Adaption.Font(17), color: '#757575' }}>{GetBallStatus.peilvHandle(item.item.peilv)}</Text>
                    </View>
                    : null
                }
            </View>
        )
    }

    _createPkView(item, ballWidth, ballHeight) {
        let playid = this.props.playid;

        if (playid == 1) {
            // 包选
            return (
                <View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', height: Adaption.Width(35) }}>
                        <Text style={{ fontSize: Adaption.Font(22, 19), color: '#e33939' }}>{item.item.ball}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', height: ballHeight * 0.5, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: Adaption.Font(21, 18), color: '#656565' }}>如</Text>
                        <Image style={{ resizeMode: 'contain', width: ballWidth * 0.2, height: ballHeight * 0.4, marginLeft: Adaption.Width(5) }}
                            source={this.pkbxImg1[item.index]}>
                        </Image>
                        <Image style={{ resizeMode: 'contain', width: ballWidth * 0.2, height: ballHeight * 0.4, marginLeft: Adaption.Width(5) }}
                            source={this.pkbxImg2[item.index]}>
                        </Image>
                        <Image style={{ resizeMode: 'contain', width: ballWidth * 0.2, height: ballHeight * 0.4, marginLeft: Adaption.Width(5) }}
                            source={this.pkbxImg3[item.index]}>
                        </Image>
                    </View>
                </View>
            )

        } else if (playid == 4) {
            // 单选顺子
            return (
                <View style={{ flexDirection: 'row' }}>
                    <Image style={{ resizeMode: 'contain', width: ballWidth * 0.6, height: ballHeight * 0.7 }}
                        source={this.pkA_KImg[item.index]}>
                    </Image>
                    <Image style={{ resizeMode: 'contain', width: ballWidth * 0.6, height: ballHeight * 0.7, marginLeft: -(ballWidth * 0.39) }}
                        source={this.pkA_KImg[(item.index + 1) % 13]}>
                    </Image>
                    <Image style={{ resizeMode: 'contain', width: ballWidth * 0.6, height: ballHeight * 0.7, marginLeft: -(ballWidth * 0.39) }}
                        source={this.pkA_KImg[(item.index + 2) % 13]}>
                    </Image>
                </View>
            )

        } else if (playid == 6) {
            // 单选同花顺
            return (
                <View>
                    <View style={{ justifyContent: 'flex-end', width: ballWidth, height: ballHeight * 0.5 }}>
                        <Image style={{ resizeMode: 'contain', width: ballWidth * 0.5, height: ballHeight * 0.45, marginLeft: Adaption.Width(10) }}
                            source={this.pK1234Img[item.index % 4]}>
                        </Image>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <View style={{ width: ballWidth * 0.5, height: ballHeight * 0.5 }}></View>
                        <Text style={{ fontSize: Adaption.Font(19, 16), color: item.index % 2 ? '#e33939' : '#222' }}>{`顺${'\n'}子`}</Text>
                    </View>
                </View>
            )

        } else if (playid == 2) {
            // 单选豹子
            return (
                <View style={{ flexDirection: 'row' }}>
                    <Image style={{ resizeMode: 'contain', width: ballWidth * 0.6, height: ballHeight * 0.7 }}
                        source={this.pkA_KImg[item.index]}>
                    </Image>
                    <Image style={{ resizeMode: 'contain', width: ballWidth * 0.6, height: ballHeight * 0.7, marginLeft: -(ballWidth * 0.39) }}
                        source={this.pkA_KImg[item.index]}>
                    </Image>
                    <Image style={{ resizeMode: 'contain', width: ballWidth * 0.6, height: ballHeight * 0.7, marginLeft: -(ballWidth * 0.39) }}
                        source={this.pkA_KImg[item.index]}>
                    </Image>
                </View>
            )

        } else if (playid == 3) {
            // 单选对子
            return (
                <View style={{ flexDirection: 'row' }}>
                    <Image style={{ resizeMode: 'contain', width: ballWidth * 0.6, height: ballHeight * 0.7 }}
                        source={this.pkA_KImg[item.index]}>
                    </Image>
                    <Image style={{ resizeMode: 'contain', width: ballWidth * 0.6, height: ballHeight * 0.7, marginLeft: -(ballWidth * 0.3) }}
                        source={this.pkA_KImg[item.index]}>
                    </Image>
                </View>
            )

        } else if (playid == 5) {
            // 单选同花
            return (
                <ImageBackground resizeMode={'contain'} source={this.pK1234Img[item.index % 4]}
                    style={{ width: ballWidth, height: ballHeight * 0.5, justifyContent: 'center', alignItems: 'center' }}
                >
                </ImageBackground>
            )

        } else {
            // 任选一
            return (
                <Image style={{ resizeMode: 'contain', width: ballWidth * 0.6, height: ballHeight * 0.7 }}
                    source={this.pkA_KImg[item.index]}>
                </Image>
            )
        }
    }


    render() {
        return (
            <View style={this.props.style}>

                {this.props.singlePeilv != null
                    ? <View style={{ height: Adaption.Width(20), justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#606060', fontSize: Adaption.Font(18, 16) }}>{`（赔率：${this.props.singlePeilv}）`}</Text>
                    </View>
                    : null
                }

                <FlatList style={{ width: this.props.style.width }}
                    automaticallyAdjustContentInsets={false}
                    alwaysBounceHorizontal={false}
                    data={this.props.balls}
                    renderItem={(item) => this._renderItemView(item)}
                    horizontal={false}
                    numColumns={this.props.numColumn}
                    scrollEnabled={false}
                >
                </FlatList>
            </View>
        )
    }

}
