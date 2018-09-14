/**
 Author Ward
 Created by on 2018-08-14
 pk10牛牛赛车界面视图
 **/

import React, {Component} from 'react';
import {
    View,
    Animated,
    Easing,
    Dimensions,
    ImageBackground,
    StyleSheet,
    Image,
    DeviceEventEmitter,
} from 'react-native';

let iponeXorSix  = (SCREEN_WIDTH == 375? true:false);
let ipone5 = (SCREEN_WIDTH == 320 ? true:false);

import CarTimingView from './CarView';
import SaiCheBack from './SaiCheBackgroud';

let {height, width} = Dimensions.get('window');

let CarFrontViewArr = [require('../../img/carViewImg/frontCar1.png'), require('../../img/carViewImg/frontCar2.png'), require('../../img/carViewImg/frontCar3.png')
    , require('../../img/carViewImg/frontCar4.png'), require('../../img/carViewImg/frontCar5.png'), require('../../img/carViewImg/frontCar6.png')
    , require('../../img/carViewImg/frontCar7.png'), require('../../img/carViewImg/frontCar8.png'), require('../../img/carViewImg/frontCar9.png')
    , require('../../img/carViewImg/frontCar10.png')];

let TimeNumberArr = [require('../../img/carViewImg/TimeNumber0.png'), require('../../img/carViewImg/TimeNumber1.png'), require('../../img/carViewImg/TimeNumber2.png'), require('../../img/carViewImg/TimeNumber3.png'),
    require('../../img/carViewImg/TimeNumber4.png'), require('../../img/carViewImg/TimeNumber5.png'), require('../../img/carViewImg/TimeNumber6.png'), require('../../img/carViewImg/TimeNumber7.png'), require('../../img/carViewImg/TimeNumber8.png'),
    require('../../img/carViewImg/TimeNumber9.png')]


export default class saicheRoot extends Component {

    constructor(props) {
        super(props);

        this.animatedValue = new Animated.Value(0);
        this.AnimationValue = new Animated.Value(0);  //车移动的动画
        this.AnimationValue1 = new Animated.Value(0); //灯光移动的动画
        this.AnimationValue3 = new Animated.Value(0); //灯光左右晃动的动画

        this.state = ({
            fadeInOpacity: new Animated.Value(0), //1消失动画
            rotation: new Animated.Value(0),    //2方向
            fontSize: new Animated.Value(0),       //2文字大小
            anim: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(() => new Animated.Value(0)),//动画组初始值
            daoluAnimat: new Animated.Value(0),
            paiming: '1,2,3,4,5,6,7,8,9,10',
            isFinishRace: false,  //是否完成比赛
            countDownText: 0,//倒计时
            showBeginLine: true,
            showEndLine: false,
            caiDaiHeight: new Animated.Value(0),
            caiDaiTopHeight: new Animated.Value(0),

            isStartAnimatedCar:false,   //赛车是否开始动画
            isShowBackTimeView:true,   //是否显示背景视图
            imageWidh:0,
            resultArr:[],//赛车结果数组
        })

        this.backStop = false;

        this.carOne = {key: 1, current: 0};
        this.carTwo = {key: 2, current: 0};
        this.carThere = {key: 3, current: 0};
        this.carFour = {key: 4, current: 0};
        this.carFive = {key: 5, current: 0};
        this.carSix = {key: 6, current: 0};
        this.carSeven = {key: 7, current: 0};
        this.carEight = {key: 8, current: 0};
        this.carNine = {key: 9, current: 0};
        this.carTen = {key: 10, current: 0};

        this.sortTime = null;   //刷新排名定时器
        this.isCompare = false;
        this.timer = null;
        this.isRefresh = false;  //重新刷新界面
        this.firstEnter = true;  //是否刚进入这个页面
        this.lateShowResult = true; //延迟显示开奖结果
    }

    componentWillReceiveProps(nextProps) {


        if (nextProps.openList && nextProps.openList.length != 0 && this.state.resultArr.length <= 0) {

            let result = nextProps.openList[0].value.balls.split('+');
            let ballNewArr = [];

            if (result.length != 0 && result.length != 1){

                for (let ball of result){
                    ball = ball.startsWith('0') ? ball.substr(1,2) : ball;
                    ballNewArr.push(ball);
                }
            }

            this.lateShowResult = ballNewArr.length == 0 ? false : true;  //是否显示排名

            this.setState({
                resultArr: ballNewArr,
            });
        }
    }


    componentDidMount() {

        this.setState({imageWidh: -width * 3});
        //开启排名计时器
        this.setRefresh();

        this.subscription = PushNotification.addListener('LeaveRaceCarViewNotification', ()=>{
            this.setState({imageWidh: 0});
            DeviceEventEmitter.emit('backStop', {stop: true});
        })

        //pk牛牛开奖的通知，刷新排名，停止车的动画
        this.subscription1 = PushNotification.addListener('PK10NiuNiuOpenReWardNotificaiton', (openBallsArr) => {

           if (this.state.resultArr.length == 0){

               if (openBallsArr.length == 10){

                   let ballNewArr = [];
                   for (let ball of openBallsArr){
                       ball = ball.startsWith('0') ? ball.substr(1,2) : ball;
                       ballNewArr.push(ball);
                   }

                   this.setState({resultArr:openBallsArr, isStartAnimatedCar:false});
               }
           }
        })

        //刷新当前界面的倒计时
        this.subscription2 = PushNotification.addListener('Pk10OpeninCountDownTimeNotificaiton', (currentOpen, currentQiShu) => {

            //如果获取倒计时失败。则不显示动画
            if (currentQiShu != 0){

                //倒计时为0时要开奖

                if (currentOpen == 0){

                    PushNotification.emit('ClosePukeViewNotification');  //通知扑克转牌
                    this.lateShowResult = false; //重置状态
                    this.setState({isStartAnimatedCar:true, resultArr:[], isShowBackTimeView:false});
                }

                if (this.state.isStartAnimatedCar == true){

                    if (this.isRefresh == false){

                        this.isRefresh = true;

                        this.setState({showBeginLine: false, isStartAnimatedCar: true});

                        //开启背景动画
                        this.begin();
                    }
                }

                PushNotification.emit('PKNiuNiuOpenPaiMingReWardNotification', this.state.paiming);

                this.setState({countDownText:currentOpen});
            }
        });
    }

    componentWillUnmount() {

        if (typeof(this.subscription) == 'object'){
            this.subscription && this.subscription.remove();
        }

        if (typeof(this.subscription1) == 'object'){
            this.subscription1 && this.subscription1.remove();
        }

        if (typeof(this.subscription2) == 'object'){
            this.subscription2 && this.subscription2.remove();
        }

        this.sortTime && clearTimeout(this.sortTime);
        this.timer && clearInterval(this.timer);

        //若组件被卸载，刷新state则直接返回，可以解决警告(倒计时组件可能造成的警告)
        this.setState = (state,callback) => {
            return;
        }

    }

    // ========= 赛车结果相关 ======= //

    lightingLeft() {

        this.AnimationValue1.setValue(0);

        Animated.timing(this.AnimationValue1, ({
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
        })).start(() => this.lightingLeft())

    }

    lightingRight() {

        this.AnimationValue3.setValue(0);

        Animated.timing(this.AnimationValue3, ({
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
        })).start(() => this.lightingRight())
    }

    beignRacing() {

        this.AnimationValue.setValue(0);

        Animated.timing(this.AnimationValue, ({
            toValue: 55, // 目标值
            duration: 3000, // 动画时间
            easing: Easing.linear // 缓动函数
        })).start();

    }


    //自定义随机刷新球频率
    setRefresh() {

        if (this.sortTime) {

            return;
        }

        this.sortTime = setInterval(() => {

          if (this.state.isStartAnimatedCar == false && this.lateShowResult == true) {

              let rankCarStr = '';

              if (this.state.resultArr.length != 0){

                  rankCarStr = `${this.state.resultArr[0]},${this.state.resultArr[1]},${this.state.resultArr[2]},${this.state.resultArr[3]},${this.state.resultArr[4]},${this.state.resultArr[5]},${this.state.resultArr[6]},${this.state.resultArr[7]},${this.state.resultArr[8]},${this.state.resultArr[9]}`;

              }
              else {
                  rankCarStr = '1,2,3,4,5,6,7,8,9,10';
              }

              PushNotification.emit('RacingCarRankNotification', rankCarStr);  //实时排名的字符串
              this.setState({paiming: rankCarStr});

          }
          else {

              this.isCompare = true;
              let carAry = [

                  this.carOne,
                  this.carTwo,
                  this.carThere,
                  this.carFour,
                  this.carFive,
                  this.carSix,
                  this.carSeven,
                  this.carEight,
                  this.carNine,
                  this.carTen,
              ];

              var compare = function (obj1, obj2) {
                  var val1 = parseInt(obj1.current, 10);
                  var val2 = parseInt(obj2.current, 10);

                  if (val1 < val2) {
                      return 1;
                  } else if (val1 > val2) {
                      return -1;
                  } else {
                      return 0;
                  }
              }

              carAry.sort(compare);

              let rankCarStr = `${carAry[0].key},${carAry[1].key},${carAry[2].key},${carAry[3].key},${carAry[4].key},${carAry[5].key},${carAry[6].key},${carAry[7].key},${carAry[8].key},${carAry[9].key}`
              PushNotification.emit('RacingCarRankNotification', rankCarStr);  //实时排名的字符串

              this.isCompare = false;
          }

        }, 500)
    }


    begin() {
        //显示赛果场景
        if (this.state.isStartAnimatedCar == false) {

            //开奖后动画大概是10秒
            setTimeout(()=> {
                this.setState({showBeginLine:true,isStartAnimatedCar:false,isFinishRace:false, showEndLine:false, isShowBackTimeView:true});
                this.isRefresh = false;
                this.props.FinishRace ? this.props.FinishRace(false) : null;
            }, 12000);

            //出现结果后路需要再跑一段
            this.state.daoluAnimat.setValue(0);
            var timing = Animated.timing;

            timing(this.state.daoluAnimat,
                {
                    toValue: 100, // 目标值
                    duration: 1900, // 动画时间
                    easing: Easing.linear // 缓动函数

                }).start();

            setTimeout(()=>{
                this.state.daoluAnimat.setValue(0);
                var timing = Animated.timing;

                timing(this.state.daoluAnimat,
                    {
                        toValue: 100, // 目标值
                        duration: 2000, // 动画时间
                        easing: Easing.linear // 缓动函数

                    }).start();
            },1900)

            //延迟冲线的动画
            setTimeout(()=>{
                this.lateShowResult = true;
                this.setState({showEndLine:true});
            },3800)

            //显示赛果的动画
            setTimeout(() => {

                this.props.FinishRace ? this.props.FinishRace(true) : null;
                this.setState({isFinishRace: true});
                this.beignRacing();

                if (this.firstEnter == true){

                    this.firstEnter = false;
                    this.lightingLeft();
                    this.lightingRight();
                }

                PushNotification.emit('ReadyToOpenRewardNotification');  //已经开奖的通知，提醒扑克翻牌

                //彩带的动画
                setTimeout(() => {

                    this.state.caiDaiHeight.setValue(0);
                    this.state.caiDaiTopHeight.setValue(0);

                    var timing = Animated.timing;
                    Animated.parallel(['caiDaiHeight', 'caiDaiTopHeight'].map(property => {
                        return timing(this.state[property], {
                            toValue: 1,
                            duration: 3500,
                            easing: Easing.linear
                        });
                    })).start()
                }, 1500);
            }, 5500)
            return;
        }

        //正常的赛车的动画
        this.state.daoluAnimat.setValue(0);
        var timing = Animated.timing;

        timing(this.state.daoluAnimat,
            {
                toValue: 100, // 目标值
                duration: 2000, // 动画时间
                easing: Easing.linear // 缓动函数

            }).start(() => this.begin());
    }

    _createCarView() {

        let CarViewsArr = [];
        for (let i = 0; i < this.state.anim.length; i++) {

            CarViewsArr.push(
                <CarTimingView
                   key={i + 1}
                   ID={i + 1}
                   isStartRace={this.state.isStartAnimatedCar}
                   isChongXian={this.state.showEndLine}
                   changeValue={(dict) => this.updateCurrent(dict)}
                   style={{
                       width: iponeXorSix?34.4:ipone5?30:35,  //图片宽高比  4：1
                       height: iponeXorSix?8.6:ipone5?7.5:8.25 + i * 0.25,
                       marginTop: -2.2,
                       marginRight: 30 + Adaption.Width(3.5) * i,
                   }}

                   result={this.state.resultArr}
                />
            )
        }
        return CarViewsArr;
    }


    updateCurrent(dict) {

        if (this.isCompare == true) return;

        if (dict.key == 1) {
            this.carOne.current = dict.current;
        }
        else if (dict.key == 2) {
            this.carTwo.current = dict.current;
        }
        else if (dict.key == 3) {
            this.carThere.current = dict.current;
        }
        else if (dict.key == 4) {
            this.carFour.current = dict.current;
        }
        else if (dict.key == 5) {
            this.carFive.current = dict.current;
        }
        else if (dict.key == 6) {
            this.carSix.current = dict.current;
        }
        else if (dict.key == 7) {
            this.carSeven.current = dict.current;
        }
        else if (dict.key == 8) {
            this.carEight.current = dict.current;
        }
        else if (dict.key == 9) {
            this.carNine.current = dict.current;
        }
        else if (dict.key == 10) {
            this.carTen.current = dict.current;
        }
    }


    _creatTimeView(time) {

        let TimeViewArr = [];
        let timeStr = `{${time}`;

        for (let i = 0; i < timeStr.length; i++) {

            let indexStr = timeStr[i];

            TimeViewArr.push(<Image key={i} style={{width: 25, height: 25, resizeMode: 'contain'}}
                                    source={TimeNumberArr[parseInt(indexStr, 10)]}>
            </Image>)
        }

        return TimeViewArr;
    }

    _changeTime(totalTime) {

        if (isNaN(totalTime) || totalTime <= 0) {
            return `00: 00: 00`;

        } else {

            let day = Math.floor((totalTime / 60 / 60 / 24) * 100) / 100; //保留两位小数
            let hour = Math.floor(totalTime / 60 / 60 % 24);
            let min = Math.floor(totalTime / 60 % 60);
            let seconds = Math.floor(totalTime % 60);

            //大于1天则要乘以24
            if (day >= 1.0) {
                hour = Math.floor(day * 24);
            }

            if (hour < 10) {
                hour = '0' + hour;
            }

            if (min < 10) {
                min = '0' + min;
            }

            if (seconds < 10) {
                seconds = '0' + seconds;
            }

            return `${hour}: ${min}: ${seconds}`;  //格式化输出
        }
    }

    render() {

        return (
            <View style={this.props.style}>

                {this.state.isFinishRace == false ? (<View style={{width: width, height: width == 414 ? 138 : width == 375 ? 125 : 106}}>

                    <Animated.Image
                        style={[styles.daolu,{
                            left:
                                this.state.daoluAnimat.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: [0, width * 2]
                                })
                            , marginLeft: this.state.imageWidh ? this.state.imageWidh : 0,
                        }]}
                        source={require("../../img/carViewImg/beijing2.png")}
                    />

                    {/*<SaiCheBack source={require('../img/carViewImg/beijing2.png')} duration={1000} style={{width:width,height:width*232/889,marginLeft:0,}} />*/}
                    <View style = {{position:'absolute', right:2,top:5}}>
                        {this.state.showBeginLine ? <Image style = {{width:40,height:20, resizeMode:'contain'}} source={this.state.countDownText <= 1 ? require('../../img/carViewImg/greenLight.png') : require('../../img/carViewImg/redLight.png')}/> : null}
                    </View>

                    <View style={{alignItems: 'flex-end', position: 'absolute', left: 0, top: iponeXorSix? 54:ipone5?47:60, width: width}}>

                        {this.state.showBeginLine ? <Image source={require('../../img/carViewImg/qidian.png')} style={{
                            position: 'absolute',
                            top: iponeXorSix ? -4:ipone5 ? -3:-5,
                            right: 60,
                            width: iponeXorSix ?45:ipone5?36:50,  //图片宽高比2：3
                            height: iponeXorSix ? 68 :ipone5?55:75,
                            bottom: 0,

                        }}/> : null}

                        {this.state.showEndLine ? <Image source={require('../../img/carViewImg/zhongdian.png')} style={{
                            position: 'absolute',
                            top: iponeXorSix?-20:ipone5?-17:-22,
                            left: 40,
                            width: iponeXorSix? 56:ipone5?46:62,  //图片宽高比216 × 336  = 2:3
                            height: iponeXorSix?85:ipone5?70:93,
                            bottom: 0,

                        }}/> : null}
                        {this._createCarView()}
                    </View>
                    {this.state.isShowBackTimeView == true ? <ImageBackground style={{
                        position: 'absolute',
                        top: Adaption.Height(40),
                        left: SCREEN_WIDTH / 2 - 100,
                        width: 200,
                        height: 60,
                        flexDirection:'row',
                        alignItems:'center',
                        justifyContent:'center',
                    }} resizeMode='stretch' source={require('../../img/carViewImg/RaceBack.png')}>
                        {this._creatTimeView(this.state.countDownText)}
                    </ImageBackground> : null}
                </View>) : (<View style={{height: 120}}>
                    <ImageBackground style={{height: 120, alignItems: 'center'}}
                                     source={require('../../img/carViewImg/PKStage.png')}
                                     resizeMode="stretch">
                        <View style={{flexDirection: 'row'}}>
                            <Animated.View style={[{alignItems: 'center', marginRight: 20, marginTop: 15}, {
                                top: this.AnimationValue.interpolate({
                                    inputRange: [0, 55],
                                    outputRange: [0, 23]
                                }),
                                width:this.AnimationValue.interpolate({
                                    inputRange: [0, 55],
                                    outputRange: [60, 80]
                                }),
                                height:this.AnimationValue.interpolate({
                                    inputRange: [0, 55],
                                    outputRange: [40, 60]
                                }),
                            }]}>
                                <Image style={{width: 40, height: 20, resizeMode: 'contain'}}
                                       source={require('../../img/carViewImg/Second.png')}/>
                                <Image style={{width: 80, height: 60, resizeMode: 'contain', marginTop: 5}}
                                       source={CarFrontViewArr[this.state.resultArr[1] - 1]}/>
                            </Animated.View>
                            <Animated.View style={[{alignItems: 'center', marginTop: 5}, {
                                top: this.AnimationValue.interpolate({
                                    inputRange: [0, 55],
                                    outputRange: [0, 23]
                                }),
                                width:this.AnimationValue.interpolate({
                                    inputRange: [0, 55],
                                    outputRange: [60, 80]
                                }),
                                height:this.AnimationValue.interpolate({
                                    inputRange: [0, 55],
                                    outputRange: [40, 60]
                                }),
                            }]}>
                                <Image style={{width: 40, height: 20, resizeMode: 'contain'}}
                                       source={require('../../img/carViewImg/First.png')}/>
                                <Image style={{width: 80, height: 60, resizeMode: 'contain', marginTop: 5}}
                                       source={CarFrontViewArr[this.state.resultArr[0] - 1]}/>
                            </Animated.View>
                            <Animated.View style={[{alignItems: 'center', marginLeft: 20, marginTop: 15}, {
                                top: this.AnimationValue.interpolate({
                                    inputRange: [0, 55],
                                    outputRange: [0, 23]
                                }),
                                width:this.AnimationValue.interpolate({
                                    inputRange: [0, 55],
                                    outputRange: [60, 80]
                                }),
                                height:this.AnimationValue.interpolate({
                                    inputRange: [0, 55],
                                    outputRange: [40, 60]
                                }),
                            }]}>
                                <Image style={{width: 40, height: 20, resizeMode: 'contain'}}
                                       source={require('../../img/carViewImg/Third.png')}/>
                                <Image style={{width: 80, height: 60, resizeMode: 'contain', marginTop: 5}}
                                       source={CarFrontViewArr[this.state.resultArr[2] - 1]}/>
                            </Animated.View>
                        </View>
                        <View style={{marginTop:7, flexDirection: 'row'}}>
                            <Animated.Image style={[{width: 10, height: 80, resizeMode: 'stretch'}, {
                                transform: [{
                                    rotateZ: this.AnimationValue1.interpolate({
                                        inputRange: [0, 0.5, 1],
                                        outputRange: ['-80deg', '80deg', '-80deg'],
                                    })
                                }]
                            }]} source={require('../../img/carViewImg/Light.png')}/>
                            <Animated.Image
                                style={[{width: 10, height: 80, marginLeft: 60, resizeMode: 'stretch'}, {
                                    transform: [{
                                        rotateZ: this.AnimationValue3.interpolate({
                                            inputRange: [0, 0.5, 1],
                                            outputRange: ['80deg', '-80deg', '80deg'],
                                        })
                                    }]
                                }]} source={require('../../img/carViewImg/Light.png')}/>
                            <Animated.Image
                                style={[{width: 10, height: 80, marginLeft: 100, resizeMode: 'stretch'}, {
                                    transform: [{
                                        rotateZ: this.AnimationValue1.interpolate({
                                            inputRange: [0, 0.5, 1],
                                            outputRange: ['-80deg', '80deg', '-80deg'],
                                        })
                                    }]
                                }]} source={require('../../img/carViewImg/Light.png')}/>
                            <Animated.Image
                                style={[{width: 10, height: 80, marginLeft: 50, resizeMode: 'stretch'}, {
                                    transform: [{
                                        rotateZ: this.AnimationValue3.interpolate({
                                            inputRange: [0, 0.5, 1],
                                            outputRange: ['80deg', '-80deg', '80deg'],
                                        })
                                    }]
                                }]} source={require('../../img/carViewImg/Light.png')}/>
                        </View>
                    </ImageBackground>
                    <Animated.Image style={[{height: 150, width:SCREEN_WIDTH, marginTop: -270, resizeMode: 'stretch'}, {
                        top: this.state.caiDaiTopHeight.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 350],
                        }),
                    }]} source={require('../../img/carViewImg/ColorDai.png')}/>
                </View>)}
            </View>
        );
    }
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        // justifyContent: 'center',
        alignItems: 'flex-end',
    },


    demo: {
        marginLeft: 0,
        width: 60,
        height: 30,
        resizeMode: 'contain',
    },

    text: {
        fontSize: 20
    },

    daolu: {

        width: width * 4,
        height: width == 414 ? 138 : width == 375 ? 125 : 106,
        // backgroundColor:'red',
    },

})
