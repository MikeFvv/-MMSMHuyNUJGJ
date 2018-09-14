/**
 Author Ward
 Created by on 2018-08-14
 pk10牛牛扑克视图
 **/

import React, {Component} from 'react';

import {
    View,
    Animated,
    Easing,
    Image, StyleSheet,
    Text,
} from 'react-native';
import LocalImg from "../../../../../res/img";

//定义扑克牌的图片资源数组
let pokerAImgArr = [require('../../img/pokerViewImg/pokerPaperImg/pokerA_0.png'), require('../../img/pokerViewImg/pokerPaperImg/pokerA_1.png'), require('../../img/pokerViewImg/pokerPaperImg/pokerA_2.png'), require('../../img/pokerViewImg/pokerPaperImg/pokerA_3.png')];
let poker2ImgArr = [require('../../img/pokerViewImg/pokerPaperImg/poker2_0.png'), require('../../img/pokerViewImg/pokerPaperImg/poker2_1.png'), require('../../img/pokerViewImg/pokerPaperImg/poker2_2.png'), require('../../img/pokerViewImg/pokerPaperImg/poker2_3.png')];
let poker3ImgArr = [require('../../img/pokerViewImg/pokerPaperImg/poker3_0.png'), require('../../img/pokerViewImg/pokerPaperImg/poker3_1.png'), require('../../img/pokerViewImg/pokerPaperImg/poker3_2.png'), require('../../img/pokerViewImg/pokerPaperImg/poker3_3.png')];
let poker4ImgArr = [require('../../img/pokerViewImg/pokerPaperImg/poker4_0.png'), require('../../img/pokerViewImg/pokerPaperImg/poker4_1.png'), require('../../img/pokerViewImg/pokerPaperImg/poker4_2.png'), require('../../img/pokerViewImg/pokerPaperImg/poker4_3.png')];
let poker5ImgArr = [require('../../img/pokerViewImg/pokerPaperImg/poker5_0.png'), require('../../img/pokerViewImg/pokerPaperImg/poker5_1.png'), require('../../img/pokerViewImg/pokerPaperImg/poker5_2.png'), require('../../img/pokerViewImg/pokerPaperImg/poker5_3.png')];
let poker6ImgArr = [require('../../img/pokerViewImg/pokerPaperImg/poker6_0.png'), require('../../img/pokerViewImg/pokerPaperImg/poker6_1.png'), require('../../img/pokerViewImg/pokerPaperImg/poker6_2.png'), require('../../img/pokerViewImg/pokerPaperImg/poker6_3.png')];
let poker7ImgArr = [require('../../img/pokerViewImg/pokerPaperImg/poker7_0.png'), require('../../img/pokerViewImg/pokerPaperImg/poker7_1.png'), require('../../img/pokerViewImg/pokerPaperImg/poker7_2.png'), require('../../img/pokerViewImg/pokerPaperImg/poker7_3.png')];
let poker8ImgArr = [require('../../img/pokerViewImg/pokerPaperImg/poker8_0.png'), require('../../img/pokerViewImg/pokerPaperImg/poker8_1.png'), require('../../img/pokerViewImg/pokerPaperImg/poker8_2.png'), require('../../img/pokerViewImg/pokerPaperImg/poker8_3.png')];
let poker9ImgArr = [require('../../img/pokerViewImg/pokerPaperImg/poker9_0.png'), require('../../img/pokerViewImg/pokerPaperImg/poker9_1.png'), require('../../img/pokerViewImg/pokerPaperImg/poker9_2.png'), require('../../img/pokerViewImg/pokerPaperImg/poker9_3.png')];
let poker10ImgArr = [require('../../img/pokerViewImg/pokerPaperImg/poker10_0.png'), require('../../img/pokerViewImg/pokerPaperImg/poker10_1.png'), require('../../img/pokerViewImg/pokerPaperImg/poker10_2.png'), require('../../img/pokerViewImg/pokerPaperImg/poker10_3.png')];
let pokerJImgArr = [require('../../img/pokerViewImg/pokerPaperImg/pokerJ_0.png'), require('../../img/pokerViewImg/pokerPaperImg/pokerJ_1.png'), require('../../img/pokerViewImg/pokerPaperImg/pokerJ_2.png'), require('../../img/pokerViewImg/pokerPaperImg/pokerJ_3.png')];
let pokerQImgArr = [require('../../img/pokerViewImg/pokerPaperImg/pokerQ_0.png'), require('../../img/pokerViewImg/pokerPaperImg/pokerQ_1.png'), require('../../img/pokerViewImg/pokerPaperImg/pokerQ_2.png'), require('../../img/pokerViewImg/pokerPaperImg/pokerQ_3.png')];
let pokerKImgArr = [require('../../img/pokerViewImg/pokerPaperImg/pokerK_0.png'), require('../../img/pokerViewImg/pokerPaperImg/pokerK_1.png'), require('../../img/pokerViewImg/pokerPaperImg/pokerK_2.png'), require('../../img/pokerViewImg/pokerPaperImg/pokerK_3.png')];
let winorLoseArr = [require('../../img/pokerViewImg/pokerWin.png'), require('../../img/pokerViewImg/pokerLose.png')];
let niuniuArr = [require('../../img/pokerViewImg/pokerNiuNiu_Win.png'), require('../../img/pokerViewImg/pokerNiuNiu_Lose.png')];
let noniuArr = [require('../../img/pokerViewImg/pokerNoNiu_Win.png'), require('../../img/pokerViewImg/pokerNoNiu_Lose.png')];
let niu1Arr = [require('../../img/pokerViewImg/pokerNiu1_Win.png'), require('../../img/pokerViewImg/pokerNiu1_Lose.png')];
let niu2Arr = [require('../../img/pokerViewImg/pokerNiu2_Win.png'), require('../../img/pokerViewImg/pokerNiu2_Lose.png')];
let niu3Arr = [require('../../img/pokerViewImg/pokerNiu3_Win.png'), require('../../img/pokerViewImg/pokerNiu3_Lose.png')];
let niu4Arr = [require('../../img/pokerViewImg/pokerNiu4_Win.png'), require('../../img/pokerViewImg/pokerNiu4_Lose.png')];
let niu5Arr = [require('../../img/pokerViewImg/pokerNiu5_Win.png'), require('../../img/pokerViewImg/pokerNiu5_Lose.png')];
let niu6Arr = [require('../../img/pokerViewImg/pokerNiu6_Win.png'), require('../../img/pokerViewImg/pokerNiu6_Lose.png')];
let niu7Arr = [require('../../img/pokerViewImg/pokerNiu7_Win.png'), require('../../img/pokerViewImg/pokerNiu7_Lose.png')];
let niu8Arr = [require('../../img/pokerViewImg/pokerNiu8_Win.png'), require('../../img/pokerViewImg/pokerNiu8_Lose.png')];
let niu9Arr = [require('../../img/pokerViewImg/pokerNiu9_Win.png'), require('../../img/pokerViewImg/pokerNiu9_Lose.png')];


export default class pokerView extends Component {

    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({navigation}) => ({

        header: (
            <CustomNavBar
                centerText={'扑克牌动画'}
                leftClick={() => navigation.goBack()}
            />
        ),
    })

    constructor(props) {
        super(props);

        this.state = ({
            isClickOpen: false,
            pokerArray: props.pickerBallsArr ? props.pickerBallsArr : [],   //扑克数字数组
            isWinOrLose: '0',  //输赢状态 true-> win, false -> lose
            niuNiuStatues: props.niuNumber ? props.niuNumber : null,  //1-9 -> 牛一 到牛九, 10 -> 牛牛 11 -> 无牛 , 0做参数有问题
            winImgWidth: new Animated.Value(0),  //赢，或者输图片动画
            winImgHeight: new Animated.Value(0),
            openStatues: props.isOpenStatues ? props.isOpenStatues : null, //开奖状态
            isZhuangBtn:props.isZhuangBtn,  //是否是庄家按钮
        })

        this.AnimatedValue = [0, 1, 2, 3, 4].map(() => new Animated.Value(0));   //扑克牌翻转第一个动画

        this.AnimatedValueTwo = [0, 1, 2, 3, 4].map(() => new Animated.Value(0));   //扑克牌翻转第一个动画

        this.turnUp = false;  //当前的扑克的状态.默认是关闭的
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.isOpenStatues != this.state.openStatues) {

            this.setState({
                openStatues: nextProps.isOpenStatues,
                isClickOpen: nextProps.isOpenStatues,
            })
        }

        if (nextProps.pickerBallsArr.length != 0){
            this.setState({pokerArray:nextProps.pickerBallsArr})
        }

        if (nextProps.isWinorLose){
            this.setState({isWinOrLose:nextProps.isWinorLose});
        }

        if (nextProps.niuNumber){
            this.setState({niuNiuStatues:nextProps.niuNumber})
        }
    }

    componentDidMount() {

        //开牌的通知
        this.subscription = PushNotification.addListener('ReadyToOpenRewardNotification', () => {
            this.turnUp = true;
            this._pokerAimated();
        })

        //关牌的通知
        this.subscription1 = PushNotification.addListener('ClosePukeViewNotification', ()=>{
            this.turnUp = false;
            this._pokerAimated();
        })

    }

    componentWillUnmount() {

        if (typeof(this.subscription) == 'object') {
            this.subscription && this.subscription.remove();
        }

        if (typeof(this.subscription1) == 'object') {
            this.subscription1 && this.subscription1.remove();
        }
    }

    //开牌动画
    _pokerAimated() {


        if (this.turnUp == false) {

            this.setState({isClickOpen: false});//把输赢的状态去掉
            //关牌的动画

            Animated.spring(this.AnimatedValue[4], {
                toValue: 0,
                friction: 8,
                tension: 10
            }).start();


            setTimeout(() => {

                Animated.spring(this.AnimatedValue[3], {
                    toValue: 0,
                    friction: 8,
                    tension: 10
                }).start();


            }, 100)
            setTimeout(() => {

                Animated.spring(this.AnimatedValue[2], {
                    toValue: 0,
                    friction: 8,
                    tension: 10
                }).start();


            }, 200)
            setTimeout(() => {

                Animated.spring(this.AnimatedValue[1], {
                    toValue: 0,
                    friction: 8,
                    tension: 10
                }).start();


            }, 300)
            setTimeout(() => {

                Animated.spring(this.AnimatedValue[0], {
                    toValue: 0,
                    friction: 8,
                    tension: 10
                }).start();

            }, 400)



            Animated.spring(this.AnimatedValueTwo[4], {
                toValue: 0,
                friction: 8,
                tension: 10
            }).start();

            setTimeout(() => {
                Animated.spring(this.AnimatedValueTwo[3], {
                    toValue: 0,
                    friction: 8,
                    tension: 10
                }).start();

            }, 100)
            setTimeout(() => {

                Animated.spring(this.AnimatedValueTwo[2], {
                    toValue: 0,
                    friction: 8,
                    tension: 10
                }).start();


            }, 200)
            setTimeout(() => {

                Animated.spring(this.AnimatedValueTwo[1], {
                    toValue: 0,
                    friction: 8,
                    tension: 10
                }).start();


            }, 300)
            setTimeout(() => {

                Animated.spring(this.AnimatedValueTwo[0], {
                    toValue: 0,
                    friction: 8,
                    tension: 10
                }).start();

            }, 400)

        }
        else {

            //开牌的动画

            this.state.winImgWidth.setValue(0);
            this.state.winImgHeight.setValue(0);

            setTimeout(() => this.setState({isClickOpen: true}), 1500); //延迟显示输赢的状态

            setTimeout(() => {
                var timing = Animated.timing;
                Animated.parallel(['winImgWidth', 'winImgHeight'].map(property => {
                    return timing(this.state[property], {
                        toValue: 1,
                        duration: 1000,
                        easing: Easing.linear
                    });
                })).start();
            }, 2100);

            this.turnUp = true;

            Animated.spring(this.AnimatedValue[0], {
                toValue: 180,
                friction: 8,
                tension: 10
            }).start();


            setTimeout(() => {

                Animated.spring(this.AnimatedValue[1], {
                    toValue: 180,
                    friction: 8,
                    tension: 10
                }).start();


            }, 100)
            setTimeout(() => {

                Animated.spring(this.AnimatedValue[2], {
                    toValue: 180,
                    friction: 8,
                    tension: 10
                }).start();


            }, 200)
            setTimeout(() => {

                Animated.spring(this.AnimatedValue[3], {
                    toValue: 180,
                    friction: 8,
                    tension: 10
                }).start();


            }, 300)
            setTimeout(() => {

                Animated.spring(this.AnimatedValue[4], {
                    toValue: 180,
                    friction: 8,
                    tension: 10
                }).start();

            }, 400)



            Animated.spring(this.AnimatedValueTwo[0], {
                toValue: 180,
                friction: 8,
                tension: 10
            }).start();

            setTimeout(() => {
                Animated.spring(this.AnimatedValueTwo[1], {
                    toValue: 180,
                    friction: 8,
                    tension: 10
                }).start();

            }, 100)
            setTimeout(() => {

                Animated.spring(this.AnimatedValueTwo[2], {
                    toValue: 180,
                    friction: 8,
                    tension: 10
                }).start();


            }, 200)
            setTimeout(() => {

                Animated.spring(this.AnimatedValueTwo[3], {
                    toValue: 180,
                    friction: 8,
                    tension: 10
                }).start();


            }, 300)
            setTimeout(() => {

                Animated.spring(this.AnimatedValueTwo[4], {
                    toValue: 180,
                    friction: 8,
                    tension: 10
                }).start();

            }, 400)

        }

    }

    _createPokerView() {

        let pokerViewArr = [];

        if (this.state.pokerArray.length != 0) {

            for (let i = 0; i < this.state.pokerArray.length; i++) {

                let pokerImgPath = this._getPokerImgPath(this.state.pokerArray[i]);

                pokerViewArr.push(<View key = {i}>
                        <Animated.Image style={[styles.flipCard, {
                            transform: [{
                                rotateY: this.AnimatedValue[i].interpolate({
                                    inputRange: [0, 180],
                                    outputRange: ['0deg', '180deg'],
                                })
                            }]
                        }]} source={require('../../img/pokerViewImg/pokerBack.png')}/>


                        <Animated.Image style={[styles.flipCard, styles.flipCardBack, {
                            transform: [{
                                rotateY: this.AnimatedValueTwo[i].interpolate({
                                    inputRange: [0, 180],
                                    outputRange: ['180deg', '360deg']
                                })
                            }]
                        }]} source={pokerImgPath}/>
                    </View>
                )
            }
        }

        return pokerViewArr;
    }

    //根据数据获取对应的图片路径

    _getPokerImgPath(pokerModel) {

        if (pokerModel) {

            let pokerImgPath = '';
            //pokerStyle 0,1,2,3 => ♠️ ♥️ ♣️ ♦️

            if (pokerModel.pokerNum == 'A') {
                pokerImgPath = pokerAImgArr[pokerModel.pokerStyle];
            }
            else if (pokerModel.pokerNum == '2') {
                pokerImgPath = poker2ImgArr[pokerModel.pokerStyle];
            }
            else if (pokerModel.pokerNum == '3') {
                pokerImgPath = poker3ImgArr[pokerModel.pokerStyle];
            }
            else if (pokerModel.pokerNum == '4') {
                pokerImgPath = poker4ImgArr[pokerModel.pokerStyle];
            }
            else if (pokerModel.pokerNum == '5') {
                pokerImgPath = poker5ImgArr[pokerModel.pokerStyle];
            }
            else if (pokerModel.pokerNum == '6') {
                pokerImgPath = poker6ImgArr[pokerModel.pokerStyle];
            }
            else if (pokerModel.pokerNum == '7') {
                pokerImgPath = poker7ImgArr[pokerModel.pokerStyle];
            }
            else if (pokerModel.pokerNum == '8') {
                pokerImgPath = poker8ImgArr[pokerModel.pokerStyle];
            }
            else if (pokerModel.pokerNum == '9') {
                pokerImgPath = poker9ImgArr[pokerModel.pokerStyle];
            }
            else if (pokerModel.pokerNum == '10') {
                pokerImgPath = poker10ImgArr[pokerModel.pokerStyle];
            }
            // else if (pokerModel.pokerNum == 'J') {
            //     pokerImgPath = pokerJImgArr[pokerModel.pokerStyle];
            // }
            // else if (pokerModel.pokerNum == 'Q') {
            //     pokerImgPath = pokerQImgArr[pokerModel.pokerStyle];
            // }
            // else if (pokerModel.pokerNum == 'K') {
            //     pokerImgPath = pokerKImgArr[pokerModel.pokerStyle];
            // }

            return pokerImgPath;
        }

        return '';
    }

    _getPokerStatuePath(statues) {

        let niuNiuImgPath = '';

        switch (statues) {

            case 11:
                niuNiuImgPath = this.state.isWinOrLose == '0' ? noniuArr[0] : noniuArr[1];
                break;

            case 1:
                niuNiuImgPath = this.state.isWinOrLose == '0' ? niu1Arr[0] : niu1Arr[1];
                break;

            case 2:
                niuNiuImgPath = this.state.isWinOrLose == '0' ? niu2Arr[0] : niu2Arr[1];
                break;

            case 3:
                niuNiuImgPath = this.state.isWinOrLose == '0' ? niu3Arr[0] : niu3Arr[1];
                break;

            case 4:
                niuNiuImgPath = this.state.isWinOrLose == '0' ? niu4Arr[0] : niu4Arr[1];
                break;

            case 5:
                niuNiuImgPath = this.state.isWinOrLose == '0' ? niu5Arr[0] : niu5Arr[1];
                break;

            case 6:
                niuNiuImgPath = this.state.isWinOrLose == '0' ? niu6Arr[0] : niu6Arr[1];
                break;

            case 7:
                niuNiuImgPath = this.state.isWinOrLose == '0' ? niu7Arr[0] : niu7Arr[1];
                break;

            case 8:
                niuNiuImgPath = this.state.isWinOrLose == '0' ? niu8Arr[0] : niu8Arr[1];
                break;

            case 9:
                niuNiuImgPath = this.state.isWinOrLose == '0' ? niu9Arr[0] : niu9Arr[1];
                break;

            case 10:
                niuNiuImgPath = this.state.isWinOrLose == '0' ? niuniuArr[0] : niuniuArr[1];
                break;

            default:
                break;
        }

        return niuNiuImgPath;
    }


    render() {

        let niuNiuStatuesPath = '';

        if (this.state.niuNiuStatues) {

            niuNiuStatuesPath = this._getPokerStatuePath(this.state.niuNiuStatues)
        }

        return <View style={this.props.style}>

            <View style={{flexDirection: 'row'}}>
                {this._createPokerView()}
            </View>

            {this.state.isClickOpen ? <Animated.Image style = {[{right:-15, bottom:10, position:'absolute', width:Adaption.Width(45), height:Adaption.Width(37), resizeMode:'stretch'}, {
            width: this.state.winImgWidth.interpolate({
            inputRange: [0,1],
            outputRange: [30,  Adaption.Width(45)],
            }),
            height:this.state.winImgHeight.interpolate({
            inputRange: [0,1],
            outputRange:[24, Adaption.Width(37)],
            }),
            }]} source={this.state.isZhuangBtn == false ? this.state.isWinOrLose == '0' ? winorLoseArr[0] : winorLoseArr[1] : null}/> : null}
            {this.state.isClickOpen ? <Image style = {{left:0, bottom:5, position:'absolute', width:Adaption.Width(36), height:Adaption.Width(18), resizeMode:'stretch'}} source={niuNiuStatuesPath} /> : null}
        </View>
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    flipCard: {
        width: Adaption.Width(35),
        height: Adaption.Width(35 * 121 / 88),
        marginLeft: Adaption.Width(-20),
        alignItems: 'center',
        justifyContent: 'center',
        backfaceVisibility: 'hidden',
        // flexDirection: 'row',
    },
    flipCardBack: {

        position: "absolute",
        top: 0,
    },
    flipText: {
        width: 20,
        fontSize: 10,
        color: 'white',
        fontWeight: 'bold',
    }
});