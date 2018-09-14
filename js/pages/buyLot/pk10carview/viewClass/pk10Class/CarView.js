/**
 Author Ward
 Created by on 2018-08-14
 pk10牛牛赛车视图类
 **/

import React, {Component} from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    View,
    Image, DeviceEventEmitter,
} from 'react-native';

let CarViewArr = [require('../../img/carViewImg/Car0.png'), require('../../img/carViewImg/Car1.png'), require('../../img/carViewImg/Car2.png'), require('../../img/carViewImg/Car3.png'), require('../../img/carViewImg/Car4.png')
    , require('../../img/carViewImg/Car5.png'), require('../../img/carViewImg/Car6.png'), require('../../img/carViewImg/Car7.png'), require('../../img/carViewImg/Car8.png'), require('../../img/carViewImg/Car9.png')]


export default class AnimitView extends Component {

    constructor(props) {
        super(props);
        this.state =
            {
                animi: new Animated.Value(0),
                keyI: this.props.ID,
                speed: '正常',
                isStartRace:false,
                resultArray:[],    //赛车的结果
                isChongXian:false,  //冲线动画
            };

        this.defaultDistance = 400+50;
        this.time = 0;
        this.lastSpeed = 0;
        this.animatedValue2 = new Animated.Value(0);
        this.stop = props.stop;

    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.isStartRace != this.state.isStartRace){

            if (nextProps.isStartRace == true){
                this.begin();
                this.time = 0;
                this.state.isSlowRace = false;
            }

            this.state.isStartRace = nextProps.isStartRace;
        }

        if (nextProps.isChongXian){

            this.state.isChongXian = nextProps.isChongXian;
        }

        if (nextProps.result.length != 0){
            this.state.resultArray = nextProps.result;
        }
    }

    componentDidMount() {

        this.subscription =DeviceEventEmitter.addListener('backStop',(dic)=>{
            //接收到详情页发送的通知，刷新首页的数据，改变按钮颜色和文字，刷新UI
            this.stop = dic.stop;

        });


        this.circle();

        this.state.animi.addListener((data) => {

                this.updateValue({key:this.state.keyI,current:data.value});
            }
        );
    }

    updateValue = (dict)=> {

        if(this.props.changeValue)

        {
            this.props.changeValue(dict);
        }

    }

    circle() {

        //赛果控制
        if (this.time > 100000)
        {
            return;
        }

        this.animatedValue2.setValue(0);

        Animated.timing(
            this.animatedValue2, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
            }
        ).start(() => this.circle());
    }

    begin()
    {
        if(this.stop) return;

        if(this.time == 0)
        {
            //一开始启动的动画
            this.setState({speed: '喷火'});

            let randomSpeed = Math.random() * 50 + 100;

            Animated.timing(this.state.animi, ({
                toValue: randomSpeed, // 目标值
                duration: 2000, // 动画时间
                easing: Easing.linear // 缓动函数
            })).start(() => this.begin());
        }
        else if (this.state.isChongXian == true) //冲线结束的动画
        {
             this.setState({speed: '喷火'});

             if(this.state.keyI == this.state.resultArray[0])
             {
                 Animated.timing(this.state.animi, ({
                     toValue: 350, // 目标值
                     duration: 500, // 动画时间
                     easing: Easing.linear // 缓动函数
                 })).start();

                 return;
             }
             else if(this.state.keyI == this.state.resultArray[1])
             {
                 Animated.timing(this.state.animi, ({
                     toValue: 350, // 目标值
                     duration: 550, // 动画时间
                     easing: Easing.linear // 缓动函数
                 })).start();
                 return;
             }
             else if(this.state.keyI == this.state.resultArray[2])
             {
                 Animated.timing(this.state.animi, ({
                     toValue: 350, // 目标值
                     duration: 600, // 动画时间
                     easing: Easing.linear // 缓动函数
                 })).start();
                 return;
             }
             else if(this.state.keyI == this.state.resultArray[3])
             {
                 Animated.timing(this.state.animi, ({
                     toValue: 350, // 目标值
                     duration: 650, // 动画时间
                     easing: Easing.linear // 缓动函数
                 })).start();
                 return;
             }
             else if(this.state.keyI == this.state.resultArray[4])
             {
                 Animated.timing(this.state.animi, ({
                     toValue: 350, // 目标值
                     duration: 700, // 动画时间
                     easing: Easing.linear // 缓动函数
                 })).start();
                 return;
             }
             else if(this.state.keyI == this.state.resultArray[5])
             {
                 Animated.timing(this.state.animi, ({
                     toValue: 350, // 目标值
                     duration: 750, // 动画时间
                     easing: Easing.linear // 缓动函数
                 })).start();
                 return;
             }
             else if(this.state.keyI == this.state.resultArray[6])
             {
                 Animated.timing(this.state.animi, ({
                     toValue: 350, // 目标值
                     duration: 800, // 动画时间
                     easing: Easing.linear // 缓动函数
                 })).start();
                 return;
             }
             else if(this.state.keyI == this.state.resultArray[7])
             {
                 Animated.timing(this.state.animi, ({
                     toValue: 350, // 目标值
                     duration: 850, // 动画时间
                     easing: Easing.linear // 缓动函数
                 })).start();
                 return;
             }
             else if(this.state.keyI == this.state.resultArray[8])
             {
                 Animated.timing(this.state.animi, ({
                     toValue: 350, // 目标值
                     duration: 900, // 动画时间
                     easing: Easing.linear // 缓动函数
                 })).start();
                 return;
             }
             else if(this.state.keyI == this.state.resultArray[9])
             {
                 Animated.timing(this.state.animi, ({
                     toValue: 350, // 目标值
                     duration: 1000, // 动画时间
                     easing: Easing.linear // 缓动函数
                 })).start();
                 return;
             }
        }
        else
        {
            //当用户左滑回到首页时判断就有用. 防止程序Crash
            let isExist = Object.values(this.state.animi)[0][0] ? true : false;

            if (isExist == true) {

                if (Object.values(this.state.animi)[0][0]._parent._value) {
                    this.lastSpeed = Object.values(this.state.animi)[0][0]._parent._value;
                    let randomSpeed = Math.random() * Adaption.Width(120) + 20;

                    if (randomSpeed > this.lastSpeed) {
                        let penhuo = ((randomSpeed - this.lastSpeed) / this.defaultDistance);

                        if (penhuo > 0.1) {
                            this.setState({speed: '喷火'});
                        }
                        else {
                            this.setState({speed: '正常'});
                        }
                    }
                    else {
                        this.setState({speed: '正常'});
                    }

                    Animated.timing(this.state.animi, ({
                        toValue: randomSpeed, // 目标值
                        duration: 2000, // 动画时间
                        easing: Easing.linear // 缓动函数
                    })).start(() => this.begin());
                }
            }

        }

        this.time += 2;

    }


    render() {

        return <Animated.View

            changeValue = {this.updateValue}

            key={this.state.keyI}
            style={[this.props.style,
                {
                    right: this.state.animi.interpolate({
                        inputRange: [0, 350],
                        outputRange: [0, this.defaultDistance]
                    })
                }]}><Image style = {[this.props.style,{resizeMode: 'cover'}]} source = {CarViewArr[this.state.keyI - 1]}/>
           <View style = {{flexDirection:'row', marginTop:Adaption.Width(-6)}}>
               <Animated.Image style={[{width:8, height:8, marginLeft:Adaption.Width(2)}, {
                   transform:[{
                       rotateZ: this.animatedValue2.interpolate({
                           inputRange:[0,1],
                           outputRange:['1180deg', '0deg']
                       })
                   }]
               }]} source = {require('../../img/carViewImg/wheel.png')}/>

               <Animated.Image style={[{width:8, height:8,marginLeft:Adaption.Width(15)}, {
                   transform:[{
                       rotateZ: this.animatedValue2.interpolate({
                           inputRange:[0,1],
                           outputRange:['1180deg', '0deg']
                       })
                   }]
               }]} source = {require('../../img/carViewImg/wheel.png')}

               />
               {this.state.speed == '喷火' ? <Image style = {{marginLeft:Adaption.Width(2),width:16, height:8, marginBottom:0,resizeMode:'stretch'}} source={require('../../img/carViewImg/fire.png')}/> : null}
           </View>
            {this.state.speed == '喷火' ? <Image style = {{position:'absolute' , marginLeft:-8, marginTop:-5, width:20, height:15, resizeMode:'cover'}} source={require('../../img/carViewImg/wind.png')}/> : null}
        </Animated.View>

    };

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        // justifyContent: 'center',
        alignItems: 'flex-end',
    },

    demo: {
        width: 35,
        height:12,
        marginTop:0,
        marginRight:10,
    },


    text: {
        fontSize: 20
    },

})
