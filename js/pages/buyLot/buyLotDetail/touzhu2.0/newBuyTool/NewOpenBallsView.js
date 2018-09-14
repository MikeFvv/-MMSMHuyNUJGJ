/**
 Created by Ward on 2018/01/30 09:15
 头部开奖号码视图
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    ImageBackground,
    Image,
} from 'react-native';

import Moment from 'moment'; //日期计算控件
import GetBallStatus from './GetBallStatus';
const commentBallImage = require('../img/ic_buyLot_newballs.png');      //通用的号码球图片路径
//K3的号码球图片
let k3Image = [require('../img/ic_buyLot_touzi1.png'), require('../img/ic_buyLot_touzi2.png'), require('../img/ic_buyLot_touzi3.png'), require('../img/ic_buyLot_touzi4.png'), require('../img/ic_buyLot_touzi5.png'), require('../img/ic_buyLot_touzi6.png')];
//幸运农场的号码球图片
let XYNCImageArr = [require('../../../img/axyncImg/lucky_ball_01.png'),require('../../../img/axyncImg/lucky_ball_02.png'),require('../../../img/axyncImg/lucky_ball_03.png'),require('../../../img/axyncImg/lucky_ball_04.png'),
    require('../../../img/axyncImg/lucky_ball_05.png'),require('../../../img/axyncImg/lucky_ball_06.png'),require('../../../img/axyncImg/lucky_ball_07.png'),require('../../../img/axyncImg/lucky_ball_08.png'),
    require('../../../img/axyncImg/lucky_ball_09.png'),require('../../../img/axyncImg/lucky_ball_10.png'),require('../../../img/axyncImg/lucky_ball_11.png'),require('../../../img/axyncImg/lucky_ball_12.png'),
    require('../../../img/axyncImg/lucky_ball_13.png'),require('../../../img/axyncImg/lucky_ball_14.png'),require('../../../img/axyncImg/lucky_ball_15.png'),require('../../../img/axyncImg/lucky_ball_16.png'),
    require('../../../img/axyncImg/lucky_ball_17.png'),require('../../../img/axyncImg/lucky_ball_18.png'),require('../../../img/axyncImg/lucky_ball_19.png'),require('../../../img/axyncImg/lucky_ball_20.png')];

//幸运扑克的号码球图片
let XYPokerA = [require('../pkImg/pkA_1.png'),require('../pkImg/pkA_2.png'),require('../pkImg/pkA_3.png'),require('../pkImg/pkA_4.png')];
let XYPoker2 = [require('../pkImg/pk2_1.png'),require('../pkImg/pk2_2.png'),require('../pkImg/pk2_3.png'),require('../pkImg/pk2_4.png')];
let XYPoker3 = [require('../pkImg/pk3_1.png'),require('../pkImg/pk3_2.png'),require('../pkImg/pk3_3.png'),require('../pkImg/pk3_4.png')];
let XYPoker4 = [require('../pkImg/pk4_1.png'),require('../pkImg/pk4_2.png'),require('../pkImg/pk4_3.png'),require('../pkImg/pk4_4.png')];
let XYPoker5 = [require('../pkImg/pk5_1.png'),require('../pkImg/pk5_2.png'),require('../pkImg/pk5_3.png'),require('../pkImg/pk5_4.png')];
let XYPoker6 = [require('../pkImg/pk6_1.png'),require('../pkImg/pk6_2.png'),require('../pkImg/pk6_3.png'),require('../pkImg/pk6_4.png')];
let XYPoker7 = [require('../pkImg/pk7_1.png'),require('../pkImg/pk7_2.png'),require('../pkImg/pk7_3.png'),require('../pkImg/pk7_4.png')];
let XYPoker8 = [require('../pkImg/pk8_1.png'),require('../pkImg/pk8_2.png'),require('../pkImg/pk8_3.png'),require('../pkImg/pk8_4.png')];
let XYPoker9 = [require('../pkImg/pk9_1.png'),require('../pkImg/pk9_2.png'),require('../pkImg/pk9_3.png'),require('../pkImg/pk9_4.png')];
let XYPoker10 = [require('../pkImg/pk10_1.png'),require('../pkImg/pk10_2.png'),require('../pkImg/pk10_3.png'),require('../pkImg/pk10_4.png')];
let XYPokerJ = [require('../pkImg/pkJ_1.png'),require('../pkImg/pkJ_2.png'),require('../pkImg/pkJ_3.png'),require('../pkImg/pkJ_4.png')];
let XYPokerQ = [require('../pkImg/pkQ_1.png'),require('../pkImg/pkQ_2.png'),require('../pkImg/pkQ_3.png'),require('../pkImg/pkQ_4.png')];
let XYPokerK = [require('../pkImg/pkK_1.png'),require('../pkImg/pkK_2.png'),require('../pkImg/pkK_3.png'),require('../pkImg/pkK_4.png')];

export default class NewOpenBallsView extends Component {

    constructor(props) {
        super(props);

        this.state = ({
            openBallsArray: this.props.ballsArr,   //开奖号码数组
            js_tag: this.props.jstag,
            arcDomBallArr: [],   //随机号码数组,开奖闪烁
            isCreateView: false, //是否已经创建视图
        })

        this.random = true;
        this.lastView = null;
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.ballsArr && nextProps.jstag) {

            this.setState({
                openBallsArray: nextProps.ballsArr,
                js_tag: nextProps.jstag,
            })
        }
    }


    /* 
    count：需要返回的个数
    lenght: 可随机的数
    isRepeat：是否重复(true为可重复)
    startIndx：随机开始下标
    isContain0：个位数是否要包含0
    return 返回随机的数组
    */
    _returnArcBallArr(count, lenght, isRepeat, startIndx, isContain0) {
        let arcArr = [];
        for (let i = 0; i < 100; i++) {
            let arcInt = Math.floor(Math.random() * lenght) + startIndx;
            if (isContain0) {
                arcInt = arcInt < 10 ? `0${arcInt}` : `${arcInt}`;
            }
            // 如果存在，就不加入数组。
            if (!arcArr.includes(arcInt) || isRepeat) {
                arcArr.push(arcInt);
                if (arcArr.length >= count) {
                    break; // 个数够了，就退出循环。
                }
            }
        }
        return arcArr;
    }

    //创建号码球视图
    _createBallsView(ballsArr) {
        
        // 是否使用随机闪烁的开奖号码
        let isUserArcBallsView = ballsArr.length == 0 || ballsArr.length == 1;

        if (global.random == false) {
            return this.lastView;
        
        } else {

            if (isUserArcBallsView) {
                // 随机闪烁开奖的号码
                let arcDomNumArr = [];   //随机号码数组

                if (this.state.js_tag == 'k3') {
                    arcDomNumArr = this._returnArcBallArr(3, 6, true, 1, false);
                
                } else if (this.state.js_tag == 'pcdd') {
                    arcDomNumArr = this._returnArcBallArr(3, 10, true, 0, false);
                    let addNum = 0;//PCDD和值
                    for (let n = 0; n < arcDomNumArr.length; n++) {
                        addNum += arcDomNumArr[n];
                    }
                    arcDomNumArr.push(addNum);

                } else if (this.state.js_tag == 'ssc') {
                    arcDomNumArr = this._returnArcBallArr(5, 10, true, 0, false);
                
                } else if (this.state.js_tag == '11x5') {
                    arcDomNumArr = this._returnArcBallArr(5, 11, false, 1, true);
                
                } else if (this.state.js_tag == '3d') {
                    arcDomNumArr = this._returnArcBallArr(3, 10, true, 0, false);
                
                } else if (this.state.js_tag == 'pk10') {
                    arcDomNumArr = this._returnArcBallArr(10, 10, false, 1, true);
                
                } else if (this.state.js_tag == 'lhc') {
                    arcDomNumArr = this._returnArcBallArr(7, 49, false, 1, true);
                }
                else if (this.state.js_tag == 'xync') {
                    arcDomNumArr = this._returnArcBallArr(8, 20, false, 1, true);
                }
                else if (this.state.js_tag == 'xypk') {
                    arcDomNumArr = this._returnArcBallArr(3, 52, false, 0, true);
                }
                else if (this.state.js_tag == 'qxc'){
                    arcDomNumArr = this._returnArcBallArr(4, 10, true, 0, false);
                }

                //刷新随机状态为可以禁止刷新
                global.random = false;

                ballsArr = arcDomNumArr;
            }


            var tpmpView = null;

            if (this.state.js_tag == 'k3') {
                tpmpView = 
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image style={{width: 25, height: 25, marginLeft: 10, marginRight:5}} source={k3Image[ballsArr[0] - 1]}/>
                    <Image style={{width: 25, height: 25, marginLeft: 5, marginRight:5}} source={k3Image[ballsArr[1] - 1]}/>
                    <Image style={{width: 25, height: 25, marginLeft: 5}} source={k3Image[ballsArr[2] - 1]}/>
                </View>

            } else if (this.state.js_tag == 'pcdd') {
                var pcddBallsView = [];
                for (let i = 0; i < ballsArr.length; i++) {
                    let balls = ballsArr[i];

                    //如果特码是0开头的,例如07 则截取最后一位字符串判断。
                    if (balls.length > 1 && balls.startsWith('0')) {
                        balls = balls.substr(balls.length - 1, 1);
                    }

                    let lastBackColor = GetBallStatus.getPcddColorToBallStr(balls);
                    let markStr = (i == 0 || i == 1) ? ' +' : (i == 2 ? ' =' : '');

                    pcddBallsView.push(
                        <View key={i}
                            style={{flexDirection: 'row', width: 40, height: 40, marginLeft: 10, alignItems: 'center'}}>
                            <View style={[styles.PCDD_BallView, {backgroundColor: i == ballsArr.length - 1 ? lastBackColor : '#707070'}]}>
                                <CusBaseText style={styles.PCDD_BallText}> {ballsArr[i]}</CusBaseText>
                            </View>
                            <CusBaseText style={{fontSize: Adaption.Font(17)}}>{markStr}</CusBaseText>
                        </View>
                    );
                }
                tpmpView = <View style={{flexDirection: 'row', alignItems: 'center'}}>{pcddBallsView}</View>

            } else if (this.state.js_tag == 'ssc' || this.state.js_tag == '11x5' || this.state.js_tag == 'qxc') {
                var ssc_11x5BallsView = [];
                for (let i = 0; i < ballsArr.length; i++) {
                    ssc_11x5BallsView.push(
                        <ImageBackground key={i} style={styles.SSC_11X5_BallView} source={commentBallImage} resizeMode='cover'>
                            <CusBaseText style={styles.SSC_11X5_BallText}>{ballsArr[i]}</CusBaseText>
                        </ImageBackground>
                    );
                }
                tpmpView = <View style={{flexDirection: 'row', alignItems: 'center'}}>{ssc_11x5BallsView}</View>

            } else if (this.state.js_tag == '3d') {
                var fc3dBallsView = [];
                for (let i = 0; i < ballsArr.length; i++) {
                    fc3dBallsView.push(
                        <ImageBackground key={i} style={styles.FC3D_BallView} source={commentBallImage} resizeMode='cover'>
                            <CusBaseText style={styles.FC3D_BallText}>{ballsArr[i]}</CusBaseText>
                        </ImageBackground>
                    );
                }
                tpmpView =<View style={{flexDirection: 'row', alignItems: 'center'}}>{fc3dBallsView}</View>

            } else if (this.state.js_tag == 'pk10') {

                let pk10ColorArr = ['#e4e501', '#2964a1', '#929696', '#f09635', '#7bccdf', '#2a4d97', '#cacbcc', '#e53339', '#4e1e11', '#4eb333'];
                var pk10BallsView = [];
                for (let i = 0; i < ballsArr.length; i++) {
                    let balls = ballsArr[i];
                    let lastBackColor = pk10ColorArr[parseInt(balls) - 1];

                    pk10BallsView.push(
                        <View key={i} style={[styles.PK10_BallStyle, {backgroundColor: lastBackColor}]}>
                            <CusBaseText style={styles.PK10_BallText}>{ballsArr[i]}</CusBaseText>
                        </View>
                    );
                }
                tpmpView = <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>{pk10BallsView}</View>

            } else if (this.state.js_tag == 'lhc') {
                let lhcBallsView = []; 
                for (let i = 0; i < ballsArr.length; i++) {
                
                    let balls = ballsArr[i];
                    let ballBackColor = GetBallStatus.getLhcColorToBallStr(balls);
                    let shengxiaoText = GetBallStatus.getShengxiaoToBallStr(balls);

                    //创建开奖号码视图
                    if (i == ballsArr.length - 1) {
                        lhcBallsView.push(
                            <View key={0} style={{ marginLeft: 1, marginRight: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <CusBaseText style={{color: '#707070', fontSize: Adaption.Font(16, 13)}}>+</CusBaseText>
                            </View>
                        )
                    }
                    lhcBallsView.push(
                        <View key={i+1} style={{ marginLeft: 4, marginRight: 4, width: Adaption.Width(26), height: Adaption.Width(26), borderRadius: Adaption.Width(13),
                            backgroundColor: ballBackColor, justifyContent: 'center', alignItems: 'center' }}>
                            <CusBaseText style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0)', fontSize: Adaption.Font(15, 12) }}>{balls}</CusBaseText>
                        </View>
                    );
                }
                tpmpView = <View style={{flexDirection: 'row', marginLeft: 4}}>{lhcBallsView}</View>;
            }
            else if (this.state.js_tag == 'xync'){

                let xyncViewArrs = [];  //视图数组

                for (let i = 0; i < ballsArr.length; i++){

                    xyncViewArrs.push(<Image key={i} source={XYNCImageArr[ballsArr[i] - 1]} style = {{width:Adaption.Width(30),height:Adaption.Width(30), resizeMode:'stretch'}}/>)
                }

                tpmpView = <View style={{flexDirection: 'row', marginLeft: 10}}>{xyncViewArrs}</View>;
            }
            else if (this.state.js_tag == 'xypk'){

                let pokerImg1 = '';  //扑克1的图片路径
                let pokerImg2 = '';  //扑克2的图片路径
                let pokerImg3 = '';  //扑克3的图片路径
                for (let i = 0 ; i < ballsArr.length; i++){

                    let balls = parseInt(ballsArr[i], 10);
                    let pokers = parseInt((balls/4) + 1);
                    let pokerColorIdx = (balls%4);
                    let pokerArr = [];

                    switch (pokers){
                        case 1:
                            pokerArr = XYPokerA;
                            break;
                        case 2:
                            pokerArr = XYPoker2;
                            break;
                        case 3:
                            pokerArr = XYPoker3;
                            break;
                        case 4:
                            pokerArr = XYPoker4;
                            break;
                        case 5:
                            pokerArr = XYPoker5;
                            break;
                        case 6:
                            pokerArr = XYPoker6;
                            break;
                        case 7:
                            pokerArr = XYPoker7;
                            break;
                        case 8:
                            pokerArr = XYPoker8;
                            break;
                        case 9:
                            pokerArr = XYPoker9;
                            break;
                        case 10:
                            pokerArr = XYPoker10;
                            break;
                        case 11:
                            pokerArr = XYPokerJ;
                            break;
                        case 12:
                            pokerArr = XYPokerQ;
                            break;
                        case 13:
                            pokerArr = XYPokerK;
                            break;
                        default:
                            break;
                    }

                    switch (i){
                        case 0:
                            pokerImg1 = pokerArr[pokerColorIdx];
                            break;
                        case 1:
                            pokerImg2 = pokerArr[pokerColorIdx];
                            break;
                        case 2:
                            pokerImg3 = pokerArr[pokerColorIdx];
                            break;
                        default:
                            break;
                    }
                }

                tpmpView = <View style = {{flexDirection:'row'}}>
                            <Image style = {{width:30,height:30, marginLeft:10, resizeMode:'contain'}} source = {pokerImg1}/>
                            <Image style = {{width:30,height:30, marginLeft:5, resizeMode:'contain'}} source = {pokerImg2}/>
                            <Image style = {{width:30,height:30, marginLeft:5, resizeMode:'contain'}} source = {pokerImg3}/>
                        </View>

            }

            if (isUserArcBallsView) {
                this.lastView = tpmpView
                return this.lastView;
            } else {
                return tpmpView;
            }
            
        }
    }


    render() {

        return (
            <View style={this.props.style}>
                {this._createBallsView(this.state.openBallsArray)}
            </View>
        )
    }
}

const styles = StyleSheet.create({

    // ==========  开奖号码视图样式  ==========

    //PK10号码视图样式
    PK10_BallStyle: {
        marginRight: SCREEN_WIDTH == 320 ? 2 : 6,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    //PK10号码文字样式
    PK10_BallText: {
        color: 'white',
        fontSize: Adaption.Font(15)
    },

    //3D号码球视图样式
    FC3D_BallView: {
        width: 30,
        height: 30,
        marginLeft: Adaption.Width(10),
        backgroundColor: 'rgba(0,0,0,0)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    //3D号码文字样式
    FC3D_BallText: {
        color: '#af2e3e',
        fontSize: Adaption.Font(17, 14)
    },

    //PCDD号码球视图样式
    PCDD_BallView: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14
    },

    //PCDD号码文本样式
    PCDD_BallText: {
        fontSize: Adaption.Font(15, 12),
        color: 'white',
        marginRight: 3,
        backgroundColor: 'rgba(0,0,0,0)'
    },

    //SSC,11x5号码球视图样式
    SSC_11X5_BallView: {
        width: 30,
        height: 30,
        marginLeft: Adaption.Width(10),
        backgroundColor: 'rgba(0,0,0,0)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    //SSC,11x5号码球文字样式
    SSC_11X5_BallText: {
        color: '#af2e3e',
        fontSize: Adaption.Font(16, 13),
        marginBottom:3,
    },

})
