'use strict';

import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ImageBackground,
    Dimensions,

} from 'react-native';

import TheStyles from '../theLot/TheLotStyles';
import Adaption from '../../skframework/tools/Adaption';

import { CachedImage, ImageCache } from "react-native-img-cache";
const { width, height } = Dimensions.get('window');

const IMG_HEIGHT = 60;
const blankWidth = 3; //两个圆间的空格宽度
const circleWidth = Adaption.Width(23); //圆的宽度

const KAdaptionWith = SCREEN_WIDTH / 414;
const KAdaptionHeight = SCREEN_HEIGHT / 736;


class LotListCell extends Component {

    static defaultProps = {
        item: null,
    };

    constructor(props) {

        super(props);

        this.timer = null;

        this.prevItem = null;//显示的上一期
        if (this.props.item.prev && this.props.item.prev[0]) {

            this.state = {
                countDownTime: '00:00:00',
                prevItem: this.props.item.prev[0],
                backupCpicon: false,//是否启用备用彩种地址
            };

        } else {

            this.state = {
                countDownTime: '00:00:00',
                prevItem: null,
                backupCpicon: false,//是否启用备用彩种地址
            };
        }

        if (props.item && props.item.nextIndex) {
            this.nextIndex = props.item.nextIndex;//倒计时next数组
            this.leftTime = props.item.leftTime;//倒计时时间
            this.prevTime = props.item.prevTime;//倒计时前一个时间
            this.getCountDown();
        } else {
            this.nextIndex = 0;
            if (props.item && props.item.next && props.item.next[this.nextIndex] && props.item.next[this.nextIndex].jiezhitime) {
                this.prevTime = this.props.item.next[this.nextIndex].jiezhitime;
                this.leftTime = this.props.item.next[this.nextIndex].jiezhitime;
                this.getCountDown();
            }
        }
    }

    componentWillMount() {
        this._endUnmount = false;
        PushNotification.addListener('Buy_Lot_Time', (data) => {
            if (data[this.props.item.game_id] !== null) {
                this.leftTime = data[this.props.item.game_id];
            }
        });
    }

    componentWillUnmount() {
        this._endUnmount = true;
        this.timer && clearInterval(this.timer);
    }

    render() {

        return (
            <View style={styles.container}>

                <CachedImage
                    source={{
                        uri: this.state.backupCpicon ? CPLinShiIcon + this.props.item.tag + '.png' : Cpicon + this.props.item.tag + '.png',
                        cache: 'force-cache'
                    }}
                    style={styles.leftImg}
                    onError={({ nativeEvent: { error } }) => {
                        this.setState({
                            backupCpicon: true,
                        });
                    }}
                />
                <View style={styles.midView}>
                    <View style={styles.mideTopView}>
                        <CusBaseText
                            style={styles.themeName}>{this.props.item.game_name ? this.props.item.game_name : 0}</CusBaseText>
                        <CusBaseText
                            style={styles.numberCount}>{this.state.prevItem ? '第' + this.state.prevItem.qishu + '期' : ''}</CusBaseText>
                    </View>
                    <View style={styles.mideMidView}>
                        {this._views()}
                    </View>
                    <View style={styles.mideBttomView}>
                        <CusBaseText style={styles.tip}>{this._qishuText()}</CusBaseText>
                        <CusBaseText style={styles.lotTime}>{this.state.countDownTime}</CusBaseText>
                    </View>
                </View>
                <Image style={styles.rightImg} source={require('./img/ic_buyLottery_right_arrow.png')}></Image>

            </View>
        );
    }

    _qishuText = () => {

        if (this.props.item.next && this.props.item.next[this.nextIndex] && this.props.item.next[this.nextIndex].qishu) {
            return '距离第' + this.props.item.next[this.nextIndex].qishu + '期,截止还有';
        } else {
            return '';
        }
    }

    _views() {


        if (!this.state.prevItem) {
            return (<Text style={{ color: 'gray' }}>正在开奖.....</Text>);
        }

        if (!this.state.prevItem.balls) {
            return (<Text style={{ color: 'gray' }}>正在开奖.....</Text>);
        }

        if (this.state.prevItem.balls.length == 0 || this.state.prevItem.balls == "" || this.state.prevItem.balls == undefined) {
            return (<Text style={{ color: 'gray' }}>正在开奖.....</Text>);
        }


        let array = this.state.prevItem.balls.split(' ');

        if (this.props.item.js_tag === 'pcdd') {

            return (
                <View style={TheStyles.roundSizeView}>
                    {this._pcddViews(array)}
                </View>
            );

        } else if (this.props.item.js_tag === 'k3') {

            return (
                <View style={TheStyles.k3BallView}>
                    <View style={TheStyles.k3BallImage}>
                        {this._k3views(array)}
                    </View>
                </View>
            );

        } else if (this.props.item.js_tag === 'lhc') {

            return (
                <View style={TheStyles.roundSizeView}>
                    {this._lhcviews(array)}
                </View>
            );

        } else if (this.props.item.js_tag === 'pk10') {

            return (
                <View style={TheStyles.roundSizeView}>
                    {this._pk10views(array)}
                </View>
            );

        } else {

            return (
                <View style={TheStyles.roundSizeView}>
                    {this._otherviews(array)}
                </View>
            );

        }

    }

    //PC蛋蛋的布局
    _pcddViews(array) {

        var viewArr = [];

        for (var i = 0; i < array.length; i++) {
            var str = '';
            if (i == array.length - 2) {
                str = '=';
            } else if (i < array.length - 2) {
                str = '+';
            } else {
                str = '';
            }

            if (i == array.length - 1) {
                viewArr.push(
                    <View key={i}>
                        {this._pcddSingleView(array[i])}
                    </View>
                );
            } else {

                viewArr.push(
                    <View key={i} style={TheStyles.roundView}>
                        <ImageBackground style={{
                            width: 30,
                            height: 30,
                        }} resizeMode='cover' source={require('./buyLotDetail/touzhu2.0/img/ic_buyLot_newballs.png')}>
                            <CusBaseText allowFontScaling={false} style={TheStyles.textRound}>{array[i]}</CusBaseText>
                        </ImageBackground>
                        <CusBaseText allowFontScaling={false} style={{ fontSize: 20, marginLeft: 3 * KAdaptionWith }}>{str}</CusBaseText>
                    </View>
                );
            }
        }
        return viewArr;
    }

    _pcddSingleView(i) {
        switch (i) {
            case "0":
            case "13":
            case "14":
            case "27":
                return (
                    <View style={[TheStyles.colorRoundView, { backgroundColor: '#707070' }]}>
                        <CusBaseText style={TheStyles.textRoundWhite}>{i}</CusBaseText>
                    </View>
                );
                break;

            default:
                let colorArr1 = ['#eb344a', '#32b16c', '#00a0ea'];
                return (
                    <View style={[TheStyles.colorRoundView, { backgroundColor: colorArr1[parseInt(i) % 3] }]}>
                        <CusBaseText style={TheStyles.textRoundWhite}>{i}</CusBaseText>
                    </View>
                );
        }
    }

    //k3
    _k3views(array) {

        var viewArr = [];
        let imgArr = [
             require('./buyLotDetail/touzhu2.0/img/ic_buyLot_touzi1.png'), require('./buyLotDetail/touzhu2.0/img/ic_buyLot_touzi2.png'), require('./buyLotDetail/touzhu2.0/img/ic_buyLot_touzi3.png'),
             require('./buyLotDetail/touzhu2.0/img/ic_buyLot_touzi4.png'), require('./buyLotDetail/touzhu2.0/img/ic_buyLot_touzi5.png'), require('./buyLotDetail/touzhu2.0/img/ic_buyLot_touzi6.png')
        ];
        for (var i = 0; i < array.length; i++) {
            viewArr.push(
                <View key={i} style={{ marginLeft: 4 * KAdaptionWith }} >
                    <Image style={TheStyles.imagSize} source={imgArr[parseInt(array[i]) - 1]}></Image>
                </View>
            );
        }
        return viewArr;
    }



    //六合彩
    _lhcviews(array) {

        var viewArr = [];
        for (var i = 0; i < array.length; i++) {
            viewArr.push(
                <View key={i} style={TheStyles.roundView}>
                    {this._lhcSingleView(array[i])}
                </View>
            );
        }
        return viewArr;
    }

    _lhcSingleView(i) {
        var selectColor = '#e6374e';
        var default_color = {
            red: { color: '#e6374e', balls: ['01', '02', '07', '08', '12', '13', '18', '19', '23', '24', '29', '30', '34', '35', '40', '45', '46'] },
            blue: { color: '#1b82e8', balls: ['03', '04', '09', '10', '14', '15', '20', '25', '26', '31', '36', '37', '41', '42', '47', '48'] },
            green: { color: '#38b06e', balls: ['05', '06', '11', '16', '17', '21', '22', '27', '28', '32', '33', '38', '39', '43', '44', '49'] }
        }

        for (var b in default_color) {
            let ballAr = default_color[b].balls;
            if (ballAr.includes(i)) {
                selectColor = default_color[b].color;
                break;
            }
        }

        return (
            <View key={i} style={[TheStyles.roundView, TheStyles.colorRoundView, { backgroundColor: selectColor }]}>
                <Text allowFontScaling={false} style={TheStyles.textRoundWhite}>{i}</Text>
            </View>
        )
    }

    // PK拾
    _pk10views(array) {

        var viewArr = [];
        for (var i = 0; i < array.length; i++) {
            viewArr.push(
                <View key={i} style={TheStyles.roundView}>
                    {this._pk10SingleView(array[i])}
                </View>
            );
        }
        return viewArr;
    }

    _pk10SingleView(i) {
        let colorArr = ['#E5E500', '#2A64AE', '#949695', '#F29535', '#7DCBDF', '#2C489C', '#CBCBCB', '#E83338', '#421E20', '#4FB233'];
        return (
            <View key={i} style={{ flexDirection: 'row' }}>
                <View style={[TheStyles.Pk10BallView, { backgroundColor: colorArr[parseInt(i) - 1] }]}>
                    <CusBaseText allowFontScaling={false} style={TheStyles.textRoundWhite}>
                        {i}
                    </CusBaseText>
                </View>
            </View>
        )
    }

    // 其他彩中的调用
    _otherviews(array) {

        var viewArr = [];
        for (var i = 0; i < array.length; i++) {
            viewArr.push(
                <View key={i} style={TheStyles.roundView}>
                    <ImageBackground style={{
                        width: 30,
                        height: 30,
                    }} resizeMode='cover' source={require('./buyLotDetail/touzhu2.0/img/ic_buyLot_newballs.png')}>
                        {/* <View style={TheStyles.colorRoundView}>   */}
                        <View>
                            <CusBaseText allowFontScaling={false} style={TheStyles.textRound}>
                                {array[i]}
                            </CusBaseText>
                        </View>
                    </ImageBackground>
                </View>
            );
        }
        return viewArr;
    }


    // _text(title,i) {
    // 	return (
    // 		<View key={i} style = {styles.circleView}>
    // 			<CusBaseText style = {styles.circleText}>
    // 			     {title}
    // 	        </CusBaseText>
    // 	        <View style = {styles.blankView}/>
    // 		</View>
    // 	);
    // }

    // timestamp是秒 getTime()是毫秒
    getCountDown() {

        if (this.timer) {
            return;
        }

        this.timer = setInterval(() => {

            //组件挂载了
            if (this._endUnmount == true) {
                return;
            }

            if (this.leftTime <= 0) {

                this.nextIndex++;

                if (this.nextIndex == this.props.item.next.length) {

                    this.nextIndex = 0;
                    this.props.countDownFinished ? this.props.countDownFinished() : null;

                } else {

                    this._fetchSingleData();

                    this.leftTime = this.props.item.next[this.nextIndex].jiezhitime - this.prevTime;
                    this.prevTime = this.props.item.next[this.nextIndex].jiezhitime;

                    let jiezhitime = this.props.item.next[this.nextIndex].jiezhitime;
                    this.props.countDown ? this.props.countDown(this.nextIndex, jiezhitime, this.leftTime, this.prevTime) : null;
                }

            } else {
                this.leftTime = this.leftTime - 1;

                let jiezhitime = --this.props.item.next[this.nextIndex].jiezhitime;
                this.props.countDown ? this.props.countDown(this.nextIndex, jiezhitime, this.leftTime, this.prevTime) : null;
            }

            // var d=Math.floor(t/1000/60/60/24);
            let day = Math.floor((this.leftTime / 60 / 60 / 24) * 100) / 100; //保留两位小数
            var hour = Math.floor(this.leftTime / 60 / 60 % 24);
            var min = Math.floor(this.leftTime / 60 % 60);
            var sec = Math.floor(this.leftTime % 60);

            //大于1天则要乘以24
            if (day >= 1.0) {
                hour = Math.floor(day * 24);
            }

            if (hour < 10) {
                hour = "0" + hour;
            }
            if (min < 10) {
                min = "0" + min;
            }
            if (sec < 10) {
                sec = "0" + sec;
            }
            var countDownTime = hour + ":" + min + ":" + sec;

            this.setState({
                countDownTime: countDownTime
            });

        }, 1000);
    }

    _fetchSingleData = () => {

        let params = new FormData();
        params.append("ac", "getCPLogInfo");
        params.append("tag", this.props.item.tag);//小类
        params.append('pcount', '1'); //上一期
        params.append('ncount', '0');

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {
                if (responseData.msg == 0) {
                    if (responseData.data && responseData.data.prev && responseData.data.prev.length > 0) {

                        this.props.item.prev[0] = responseData.data.prev[0];

                        this.setState({
                            prevItem: responseData.data.prev[0],
                        });
                    }
                }
            })
            .catch((err) => {
            })
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },

    leftImg: {
        width: IMG_HEIGHT,
        height: IMG_HEIGHT,
        borderRadius: IMG_HEIGHT / 2,
        marginLeft: 10,
    },

    midView: {
        flex: 1,
        marginLeft: 10,
        backgroundColor: 'white',
    },

    rightImg: {
        width: 20,
        height: 20,
        marginRight: 6,
    },

    mideTopView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 7,
        // backgroundColor: 'red',
    },

    mideMidView: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'gray',
    },

    mideBttomView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 7,
        // backgroundColor: 'green',
    },

    themeName: {
        fontSize: Adaption.Font(16, 15),
    },

    numberCount: {
        fontSize: Adaption.Font(14, 13),
    },

    circleView: {
        flexDirection: 'row',
        width: circleWidth + blankWidth,
        height: circleWidth,
    },

    circleText: {

        color: 'white',
        fontSize: Adaption.Font(18, 14),
        textAlign: 'center',
        backgroundColor: 'red',

        width: circleWidth,
        height: circleWidth,
        borderRadius: circleWidth / 2,
        overflow: 'hidden',
    },

    tip: {
        fontSize: Adaption.Font(13, 12),
    },

    lotTime: {
        fontSize: Adaption.Font(13, 12),
        color: '#f3453c',
    }

});

export default LotListCell;
