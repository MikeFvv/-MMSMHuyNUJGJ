/**
 Author Ward
 Created by on 2018-08-14
 梯子游戏界面总视图
 **/

import React, { Component } from 'react';
import {
    View,
    ImageBackground,
    Dimensions,
    Animated,
    Easing,
    StyleSheet,
} from 'react-native';

const linViewColor = '#e8472b';
let {height, width} = Dimensions.get('window');

export default class LadderView extends Component {


    constructor(props){
        super(props);

        this.state = ({
            countDownTime:0,
            ladderCount:null,  //梯子条数，默认3条
            isLeftBegin:null,  //从左边开始还是右边
            anim: [0, 1, 2, 3, 4, 5, 6, 7, 8].map(() => new Animated.Value(0)),//动画组初始值
            isShowLeftBack:false,  //是否点击为左边出发
            isShowXBack:false,  //是否点击为X出发
            isShowDoubleBack:false, //结果是否是双
            isShowSingleBack:false, //结果是否是单
            isShowRowList:false,  //是否展开列表
            openBallsList:[],  //开奖号码数组
            isReStart:false,  //是否重新开始游戏
            prevOpenQiShu:0,  //开奖的期数
        });

        this.timer1 = null;
        this.clickOpenListWating = false; //防止快速点击开奖按钮
    }

    componentWillReceiveProps(nextProps) {


        if (nextProps.openList && nextProps.openList.length != 0 && this.state.openBallsList.length <= 0) {

            let openBallsArr = [];
            if (nextProps.openList[0].value.balls != ''){
                openBallsArr = nextProps.openList[0].value.balls.split('+');
            }

            this.setState({
                openBallsList:openBallsArr,  //当前的开奖数据
            });
        }
    }

    componentDidMount() {

       this.subscription = PushNotification.addListener('LadderViewOpenRewardNotificaiton', (ballsArr) => {

            if (this.state.isReStart == false && this.state.openBallsList.length == 0) {

                this.state.isReStart = true;
                this.state.openBallsList = ballsArr;
                let isBeginAtLeft = null;
                let ladderLength = 0;
                let btnIndex = 0;  //动画数组下标

                if (ballsArr[0] == '0' && ballsArr[1] == '0' && ballsArr[2] == '1'){

                    isBeginAtLeft = true; //左3双
                    ladderLength = false;
                }
                else if (ballsArr[0] == '0' && ballsArr[1] == '1' && ballsArr[2] == '0'){
                     isBeginAtLeft = true; //左4单
                     ladderLength = true;
                     btnIndex = 1;
                }
                else if (ballsArr[0] == '1'  && ballsArr[1] == '0'  && ballsArr[2] == '0'){
                     isBeginAtLeft = false; //右3单
                     ladderLength = false;
                     btnIndex = 2;
                }
                else if (ballsArr[0] == '1' && ballsArr[1] == '1' && ballsArr[2] == '1'){
                    isBeginAtLeft = false; //右4双
                    ladderLength = true;
                    btnIndex = 3;
                }

                this.setState({isLeftBegin: isBeginAtLeft, ladderCount: ladderLength});

                this._clickAnimated(btnIndex);
            }
        });

       //当前倒计时的时间的通知
       this.subscription1 = PushNotification.addListener('LadderOPenInfoCountDownTimeNoificaiton', (currentOpen, currentQiShu) => {

           //倒计时数组获取成功。期数不等于0才执行下面的操作
           if (currentQiShu != 0){

               if (currentOpen == 0){
                   //倒计时为0时重置所有的状态
                   this.setState({
                       openBallsList:[],
                       isReStart: false,
                       isShowXBack:false,
                       isShowDoubleBack:false,
                       isShowSingleBack:false,
                       isLeftBegin:null,
                       ladderCount:null,
                       isShowLeftBack:false,
                   })
               }

               this.setState({countDownTime:currentOpen});
           }
       });


    }

    componentWillUnmount() {

        this.timer1 && clearInterval(this.timer1);

        if (typeof(this.subscription) == 'object'){
            this.subscription && this.subscription.remove();
        }

        if (typeof (this.subscription1) == 'object'){
            this.subscription1 && this.subscription1.remove();
        }

        //若组件被卸载，刷新state则直接返回，可以解决警告(倒计时组件可能造成的警告)
        this.setState = (state,callback) => {
            return;
        }
    }

    //从左到双的动画,从X到单的动画方法
    _leftToDoulbeAnimated(){

        this.state.anim.map((animated)=> animated.setValue(0));

        Animated.sequence([
            Animated.timing(this.state.anim[0], {
                toValue: 1, // 目标值
                duration: 200, // 动画时间
                easing: Easing.linear // 缓动函数
            }),
            Animated.timing(this.state.anim[1], {
                toValue: 1, // 目标值
                duration: 1000, // 动画时间
                easing: Easing.linear // 缓动函数
            }),
            Animated.timing(this.state.anim[2], {
                toValue: 1, // 目标值
                duration: 200, // 动画时间
                easing: Easing.linear // 缓动函数
            }),
            Animated.timing(this.state.anim[3], {
                toValue: 1, // 目标值
                duration: 1000, // 动画时间
                easing: Easing.linear // 缓动函数
            }),
            Animated.timing(this.state.anim[4], {
                toValue: 1, // 目标值
                duration: 200, // 动画时间
                easing: Easing.linear // 缓动函数
            }),
            Animated.timing(this.state.anim[5], {
                toValue: 1, // 目标值
                duration: 1000, // 动画时间
                easing: Easing.linear // 缓动函数
            }),
            Animated.timing(this.state.anim[6], {
                toValue: 1, // 目标值
                duration: 200, // 动画时间
                easing: Easing.linear // 缓动函数
            }),

        ]).start()
    }

    //从左到单的动画，X到双的动画
    _leftToSingleAnimated(){

        this.state.anim.map((animated)=> animated.setValue(0));

        Animated.sequence([
            Animated.timing(this.state.anim[0], {
                toValue: 1, // 目标值
                duration: 200, // 动画时间
                easing: Easing.linear // 缓动函数
            }),
            Animated.timing(this.state.anim[1], {
                toValue: 1, // 目标值
                duration: 1000, // 动画时间
                easing: Easing.linear // 缓动函数
            }),
            Animated.timing(this.state.anim[2], {
                toValue: 1, // 目标值
                duration: 200, // 动画时间
                easing: Easing.linear // 缓动函数
            }),
            Animated.timing(this.state.anim[3], {
                toValue: 1, // 目标值
                duration: 1000, // 动画时间
                easing: Easing.linear // 缓动函数
            }),
            Animated.timing(this.state.anim[4], {
                toValue: 1, // 目标值
                duration: 200, // 动画时间
                easing: Easing.linear // 缓动函数
            }),
            Animated.timing(this.state.anim[5], {
                toValue: 1, // 目标值
                duration: 1000, // 动画时间
                easing: Easing.linear // 缓动函数
            }),
            Animated.timing(this.state.anim[6], {
                toValue: 1, // 目标值
                duration: 200, // 动画时间
                easing: Easing.linear // 缓动函数
            }),
            Animated.timing(this.state.anim[7], {
                toValue: 1, // 目标值
                duration: 1000, // 动画时间
                easing: Easing.linear // 缓动函数
            }),
            Animated.timing(this.state.anim[8], {
                toValue: 1, // 目标值
                duration: 200, // 动画时间
                easing: Easing.linear // 缓动函数
            }),

        ]).start()
    }

    _createLineView(){

        let ladderLineViewArr = [];

        // =======================  从左到单，双的动画和视图  ======================
        //从左到双的视图样式
        let LeftToDoubleViewStyleArr = [{width: 8, height: 0, backgroundColor: linViewColor, borderRadius:3, marginLeft:(width - 140)/2 -9, marginTop:23}, {width: 0, height: 8, backgroundColor: linViewColor, borderRadius:3, marginLeft:-8, marginTop:35,},
            {width:8, height:0, marginTop:35, marginLeft:-8, backgroundColor: linViewColor, borderRadius:3,}, {width:0, height:8, marginTop:55, marginLeft:-8, backgroundColor: linViewColor, borderRadius:3,}, {width:8, height:0, marginTop:60, marginLeft:-160, backgroundColor: linViewColor, borderRadius:3,},
            {width:0, height:8, marginTop:75, marginLeft:-8, backgroundColor: linViewColor, borderRadius:3,}, {width:8, height:0, marginTop:75, marginLeft:-8, backgroundColor: linViewColor, borderRadius:3,}];
        //从左到双的输出动画样式
        let LeftToDoubleViewOutPutArr = [{height: this.state.anim[0].interpolate({inputRange:[0,1], outputRange:[0, 20],})}, {width: this.state.anim[1].interpolate({inputRange:[0,1], outputRange:[0, 160]})},
            {height: this.state.anim[2].interpolate({inputRange: [0, 1], outputRange: [0, 28],})}, { width: this.state.anim[3].interpolate({inputRange:[0,1], outputRange:[0, 160],}), marginLeft: this.state.anim[3].interpolate({inputRange:[0,1], outputRange:[0, -160]})},
            {height: this.state.anim[4].interpolate({inputRange: [0, 1], outputRange: [0, 22],})}, {width: this.state.anim[5].interpolate({inputRange: [0, 1], outputRange: [0, 160],})},  {height: this.state.anim[6].interpolate({inputRange: [0, 1], outputRange: [0, 20],})}];

        //从左到单的视图样式
        let LeftToSingleViewStyleArr = [{width: 8, height: 0, backgroundColor: linViewColor, borderRadius:3, marginLeft:(width - 140)/2 -10, marginTop:23}, {width: 0, height: 8, backgroundColor: linViewColor, borderRadius:3, marginLeft:-8, marginTop:30}, {width: 8, height: 0, backgroundColor: linViewColor, borderRadius:3, marginLeft:-8, marginTop:35},
            {width:0, height:8, marginTop:48, marginLeft:-8, backgroundColor: linViewColor, borderRadius:3,}, {width:8, height:0, marginTop:48, marginLeft:-160, backgroundColor: linViewColor, borderRadius:3,}, {width:0, height:8, marginTop:65, marginLeft:-8, backgroundColor: linViewColor, borderRadius:3},
            {width:8, height:0, marginTop:65, marginLeft:-8, backgroundColor: linViewColor, borderRadius:3}, {width:0, height:8, marginTop:82, marginLeft:-8, backgroundColor: linViewColor, borderRadius:3}, {width:8, height:0, marginTop:82, marginLeft:-160, backgroundColor: linViewColor, borderRadius:3}];

        //从左到单的输出动画样式
        let LeftToSingleOutPutArr = [{height: this.state.anim[0].interpolate({inputRange:[0,1], outputRange:[0, 15]})}, {width: this.state.anim[1].interpolate({inputRange:[0,1], outputRange:[0, 160],})}, {height: this.state.anim[2].interpolate({inputRange:[0,1], outputRange:[0, 20]})},
            { width: this.state.anim[3].interpolate({inputRange:[0,1], outputRange:[0, 160]}), marginLeft: this.state.anim[3].interpolate({inputRange:[0,1], outputRange:[0, -160]})}, {height: this.state.anim[4].interpolate({inputRange:[0,1], outputRange:[0, 25]})}, {width: this.state.anim[5].interpolate({inputRange:[0,1], outputRange:[0, 160],})},
            {height: this.state.anim[6].interpolate({inputRange:[0,1], outputRange:[0, 25]})}, {width: this.state.anim[7].interpolate({inputRange:[0,1], outputRange:[0, 160],}), marginLeft: this.state.anim[7].interpolate({inputRange:[0,1], outputRange:[0, -160]})}, {height: this.state.anim[8].interpolate({inputRange:[0,1], outputRange:[0, 15]})}];

        // =======================  从X到单，双的动画和视图  ======================
        //从X到单的视图样式
        let XToSingleViewStyleArr = [{width: 8, height: 0, backgroundColor: linViewColor, borderRadius:3, marginLeft:(width - 140)/2 + 141, marginTop:23}, {width: 0, height: 8, backgroundColor: linViewColor, borderRadius:3, marginLeft:-8, marginTop:35},
            {width: 8, height: 0, backgroundColor: linViewColor, borderRadius:3, marginLeft:-160, marginTop:35},  {width:0, height:8, marginTop:55, marginLeft:-8, backgroundColor: linViewColor, borderRadius:3}, {width:8, height:0, marginTop:55, marginLeft:-8, backgroundColor: linViewColor, borderRadius:3,},
            {width:8, height:8, marginTop:75, marginLeft:-160, backgroundColor: linViewColor, borderRadius:3,}, {width: 8, height: 0, backgroundColor: linViewColor, borderRadius:3, marginLeft:-161, marginTop:75}];
        //从X到单的输出动画样式
        let XToSingleViewOutPutArr = [{height: this.state.anim[0].interpolate({inputRange:[0,1], outputRange:[0, 20],})}, {width: this.state.anim[1].interpolate({inputRange:[0,1], outputRange:[0, 160],}), marginLeft: this.state.anim[1].interpolate({inputRange:[0,1], outputRange:[0, -160]})},
            {height: this.state.anim[2].interpolate({inputRange: [0, 1], outputRange: [0, 28],})}, {width: this.state.anim[3].interpolate({inputRange: [0, 1], outputRange: [0, 160],})}, {height: this.state.anim[4].interpolate({inputRange: [0, 1], outputRange: [0, 28],})},
            {width: this.state.anim[5].interpolate({inputRange:[0,1], outputRange:[0, 160],}), marginLeft: this.state.anim[5].interpolate({inputRange:[0,1], outputRange:[0, -159]})}, {height: this.state.anim[6].interpolate({inputRange: [0, 1], outputRange: [0, 22],})}];

        //从X到双的视图样式
        let XToDoubleViewStyleArr = [{width: 8, height: 0, backgroundColor: linViewColor, borderRadius:3, marginLeft:(width - 140)/2 + 142, marginTop:23}, {width: 0, height: 8, backgroundColor: linViewColor, borderRadius:3, marginLeft:-8, marginTop:30},
            {width: 8, height: 0, backgroundColor: linViewColor, borderRadius:3, marginLeft:-160, marginTop:30}, {width:0, height:8, marginTop:48, marginLeft:-8, backgroundColor: linViewColor, borderRadius:3,}, {width:8, height:0, marginTop:48, marginLeft:-8, backgroundColor: linViewColor, borderRadius:3,},
            {width:0, height:8, marginTop:65, marginLeft:-160, backgroundColor: linViewColor, borderRadius:3}, {width: 8, height: 0, backgroundColor: linViewColor, borderRadius:3, marginLeft:-160, marginTop:65}, {width: 0, height: 8, backgroundColor: linViewColor, borderRadius:3, marginLeft:-8, marginTop:82},
            {width: 8, height: 0, backgroundColor: linViewColor, borderRadius:3, marginLeft:-8, marginTop:85},];

        //从X到双的输出动画样式
        let XToDoubleOutPutArr = [{height: this.state.anim[0].interpolate({inputRange:[0,1], outputRange:[0, 10],})}, {width: this.state.anim[1].interpolate({inputRange:[0,1], outputRange:[0, 160],}), marginLeft: this.state.anim[1].interpolate({inputRange:[0,1], outputRange:[0, -160]})},
            {height: this.state.anim[2].interpolate({inputRange: [0, 1], outputRange: [0, 24]})}, {width: this.state.anim[3].interpolate({inputRange: [0, 1], outputRange: [0, 160],})}, {height: this.state.anim[4].interpolate({inputRange: [0, 1], outputRange: [0, 25],})},
            {width: this.state.anim[5].interpolate({inputRange:[0,1], outputRange:[0, 160]}), marginLeft: this.state.anim[5].interpolate({inputRange:[0,1], outputRange:[0, -160]})}, {height: this.state.anim[6].interpolate({inputRange: [0, 1], outputRange: [0, 25],})},
            {width: this.state.anim[7].interpolate({inputRange: [0, 1], outputRange: [0, 160]})}, {height: this.state.anim[8].interpolate({inputRange:[0,1], outputRange:[0, 15]})}];


        //从左到双的视图样式数组
        let styleArr = [];  //样式数组
        let outPutRangeArr = []; //样式动画输出数组

        if (this.state.isLeftBegin == true && this.state.ladderCount == false){
            styleArr = LeftToDoubleViewStyleArr;
            outPutRangeArr = LeftToDoubleViewOutPutArr;  //从左到双的动画过程
        }
        else if (this.state.isLeftBegin == true && this.state.ladderCount == true){
            styleArr = LeftToSingleViewStyleArr;
            outPutRangeArr = LeftToSingleOutPutArr;  //从左到单的动画过程
        }
        else if (this.state.isLeftBegin == false && this.state.ladderCount == false){

            styleArr = XToSingleViewStyleArr;
            outPutRangeArr = XToSingleViewOutPutArr; //从X到单的动画过程
        }
        else {
            styleArr = XToDoubleViewStyleArr;   //从X到双的动画过程
            outPutRangeArr = XToDoubleOutPutArr;
        }


        for (let i = 0; i < styleArr.length; i++){

            ladderLineViewArr.push(<Animated.View key={i} style = {[styleArr[i], outPutRangeArr[i]]}/>);
        }

        return <View style={{flexDirection:'row', position:'absolute', backgroundColor:'rgba(0,0,0,0)'}}>{ladderLineViewArr}</View>;
    }

    _clickAnimated(index){

        switch (index){

            case 0:
                this.setState({isLeftBegin:true, ladderCount:false, isShowLeftBack:true, isShowXBack:false, isShowSingleBack:false, isShowDoubleBack:false});
                this._leftToDoulbeAnimated();
                setTimeout(() => {this.setState({isShowDoubleBack:true})},3800);
                break;

            case 1:

                this.setState({isLeftBegin:true, ladderCount:true, isShowLeftBack:true, isShowXBack:false, isShowDoubleBack:false, isShowSingleBack:false});
                this._leftToSingleAnimated();
                setTimeout(() => {this.setState({isShowSingleBack:true})},5000);
                break;

            case 2:

                this.setState({isLeftBegin:false, ladderCount:false, isShowLeftBack:false, isShowXBack:true, isShowDoubleBack:false, isShowSingleBack:false});
                this._leftToDoulbeAnimated();
                setTimeout(() => {this.setState({isShowSingleBack:true})},3800);
                break;

            case 3:

                this.setState({isLeftBegin:false, ladderCount:true,  isShowLeftBack:false, isShowXBack:true, isShowSingleBack:false, isShowDoubleBack:false});
                this._leftToSingleAnimated();
                setTimeout(() => {this.setState({isShowDoubleBack:true})},5000);
                break;

            default:
                break;
        }
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

        return <View style = {this.props.style}>
            <ImageBackground style = {{height:120, alignItems:'center', justifyContent:'center'}} resizeMode="stretch" source={require('../../img/ladderViewImg/classicLadder.png')}>
                <View style = {{flexDirection:'row'}}>
                    <View style = {{width:(width - 140)/2, alignItems:'flex-end'}}>
                        <View style = {[{backgroundColor:this.state.isShowLeftBack ? linViewColor : '#735d4f', marginRight:-5}, styles.circleViewStyle]}>
                            <CusBaseText style = {styles.circleTextStyle}>
                                {this.state.isReStart == false ? '左' : this.state.isLeftBegin ? '左' : 'X'}
                            </CusBaseText>
                        </View>
                        <View style = {{width:10, height:70, borderRadius:8,backgroundColor:'#735d4f'}}/>
                        <View style = {[{backgroundColor:this.state.isShowSingleBack ? linViewColor : '#735d4f', marginRight:-5}, styles.circleViewStyle]}>
                            <CusBaseText style = {styles.circleTextStyle}>
                                单
                            </CusBaseText>
                        </View>
                    </View>
                    <View style = {{width:140, height:100}}/>
                    <View style = {{width:(width - 140)/2, alignItems:'flex-start'}}>
                        <View style = {[{backgroundColor:this.state.isShowXBack ? linViewColor : '#735d4f', marginLeft:-5}, styles.circleViewStyle]}>
                            <CusBaseText style = {styles.circleTextStyle}>
                                {this.state.isReStart == false ? '右' : this.state.isLeftBegin ? 'X' : '右'}
                            </CusBaseText>
                        </View>
                        <View style = {{width:10, height:70, borderRadius:8,backgroundColor:'#735d4f'}}/>
                        <View style = {[{backgroundColor:this.state.isShowDoubleBack ? linViewColor : '#735d4f', marginLeft:-5}, styles.circleViewStyle]}>
                            <CusBaseText style = {styles.circleTextStyle}>
                                双
                            </CusBaseText>
                        </View>
                    </View>
                    {this.state.ladderCount != null ? this.state.ladderCount == true ?
                        <View style = {{width:160, position:'absolute', left:(SCREEN_WIDTH - 140)/2 - 10}}>
                            <View style = {[{marginTop:25}, styles.ladderViewStyle]}/>
                            <View style = {[{marginTop:7}, styles.ladderViewStyle]}/>
                            <View style = {[{marginTop:7}, styles.ladderViewStyle]}/>
                            <View style = {[{marginTop:7}, styles.ladderViewStyle]}/>
                        </View> :  <View style = {{width:160, position:'absolute', left:(SCREEN_WIDTH - 140)/2 - 10}}>
                            <View style = {[{marginTop:30}, styles.ladderViewStyle]}/>
                            <View style = {[{marginTop:10}, styles.ladderViewStyle]}/>
                            <View style = {[{marginTop:10}, styles.ladderViewStyle]}/>
                        </View> : <View />
                    }
                </View>
            </ImageBackground>
            {this.state.isReStart == false ?  <ImageBackground style = {{position:'absolute',left:width/2 - 140, top:20, width:280, height:80, alignItems:'center', justifyContent:'center'}} resizeMode='stretch' source={require('../../img/ladderViewImg/TimeBack.png')}>
                <CusBaseText style = {{backgroundColor:'rgba(0,0,0,0)', color:'white', fontSize:30}}>
                    {this.state.countDownTime}
                </CusBaseText>
            </ImageBackground> : this._createLineView()}
        </View>
    };
}


const styles = StyleSheet.create({

    //左，右，单，双 背景圆的样式
    circleViewStyle:{
        width:20, 
        height:20, 
        borderRadius:10,
        alignItems:'center', 
        justifyContent:'center',
    },

    //左，右，单，双，文字样式
    circleTextStyle:{
        backgroundColor:'rgba(0,0,0,0)',
        color:'#fff',
        fontSize:Adaption.Font(14,11),
    },

    //LadderView中间 的样式
    ladderViewStyle:{
        height:10,
        borderRadius:8,
        backgroundColor:'#735d4f',
    }

})
