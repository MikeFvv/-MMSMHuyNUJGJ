/**
 Author YangQi
 Created by on 2018-08-14
 pk10牛牛赛车动画背景视图
 **/

import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Dimensions,//get size of the device
    Animated,
    Easing
} from 'react-native';


const Window = Dimensions.get('window');
let {height, width} = Dimensions.get('window');

//f67057
//f74e5a
class SaiCheBackgroud extends Component{

    static propTypes={
    };


    static defaultProps={
        source: {uri:'https://i.kinja-img.com/gawker-media/image/upload/s--ZI7xve4h--/c_scale,fl_progressive,q_80,w_800/ceukprxttxixxluji8tj.jpg',width: 600,height: 400},
        duration: 10000,
        style:{height: Window.height},
        type: Easing.linear
    };


    constructor(props){
        super(props);

        this.state={
            move_1: new Animated.Value(0),
            move_2: new Animated.Value(0),
            width: width,
        };
    }

    //左到右动画
    firstAnimation(){
        Animated.sequence([

            //图一先右边偏一个点
            Animated.timing(this.state.move_1,{
                toValue: 1,
                duration: 0,
            }),

            Animated.parallel([
                //1左滑到最低
                Animated.timing(this.state.move_2,{
                    //0 ----》  width * 2 + 2 ==   width * 2 + 2
                    toValue: width * 2 - 2,
                    duration: this.props.duration,
                    easing: this.props.type,
                }),

                Animated.timing(this.state.move_1,{

                    //-1---》  width * 2 + 2 ==  width * 2 +3
                    toValue:  width * 2 + 2  ,
                    duration: this.props.duration,
                    easing: this.props.type,
                }),
            ])
        ]).start(() => {
            this.secondAnimation();
        });
    }


    //第二个动画  第二个起始x 是 -2 。。
    secondAnimation(){
        Animated.sequence([

            //第一个先到最左边
            Animated.timing(this.state.move_2,{

                toValue: - width * 2 + 3 ,
                duration:0,
            }),


            Animated.parallel([


                // width * 2 + 2 ---》2 * this.state.width * 2 + 6 ==   width * 2 + 6
                Animated.timing(this.state.move_1,{

                    toValue: 2 * this.state.width * 2 - 6,
                    duration: this.props.duration,
                    easing: this.props.type,
                }),

                //走的多
                // width * 2 + 2 ---》0 ==  width * 2 + 2。
                Animated.timing(this.state.move_2,{
                    toValue:0,
                    duration: this.props.duration,
                    easing: this.props.type,
                })
            ])

        ]).start(() => {
            this.firstAnimation();
        });
    }


    // firstAnimation(){
    //     Animated.sequence([
    //
    //         //2图先左边偏一下
    //         Animated.timing(this.state.move_2,{
    //             toValue: -1,
    //             duration: 0,
    //         }),
    //
    //         Animated.parallel([
    //             //1左滑到最低
    //             Animated.timing(this.state.move_1,{
    //                 //0 ----》  - width * 2 + 2 ==  - width * 2 + 2
    //                 toValue: -width * 2 + 2,
    //                 duration: this.props.duration,
    //                 easing: this.props.type,
    //             }),
    //
    //             Animated.timing(this.state.move_2,{
    //
    //                 //-1---》  - width * 2 - 2 == - width * 2 - 1
    //                 toValue: - width * 2 - 2  ,
    //                 duration: this.props.duration,
    //                 easing: this.props.type,
    //             }),
    //         ])
    //     ]).start(() => {
    //         this.secondAnimation();
    //     });
    // }
    //
    // //第二个动画  第二个起始x 是 -2 。。
    //
    // secondAnimation(){
    //     Animated.sequence([
    //
    //         //第一个先到最左边
    //         Animated.timing(this.state.move_1,{
    //
    //             toValue: width * 2 - 3 ,
    //             duration:0,
    //         }),
    //
    //
    //         Animated.parallel([
    //             //走的少
    //
    //             // - width * 2 - 2 ---》- 2 * this.state.width * 2 + 6 ==  - width * 2 + 8
    //             Animated.timing(this.state.move_2,{
    //
    //                 toValue: - 2 * this.state.width * 2 + 6,
    //                 duration: this.props.duration,
    //                 easing: this.props.type,
    //             }),
    //
    //             //走的多
    //             // width * 2 - 3 ---》0 ==  width * 2 - 3。
    //             Animated.timing(this.state.move_1,{
    //                 toValue:0,
    //                 duration: this.props.duration,
    //                 easing: this.props.type,
    //             })
    //         ])
    //
    //     ]).start(() => {
    //         this.firstAnimation();
    //     });
    // }
    // getWidth(e){
    //     var ImageWidth = e.nativeEvent.layout.width;
    //     this.setState({width: width});
    // }



    checkVisibility(){

    }
    render(){
        const slidingAnimation_1 = this.state.move_1;
        const slidingAnimation_2 = this.state.move_2;
        return(
            <View style={styles.main}>

                <Animated.Image  onLoadEnd={()=>{this.firstAnimation()}} source={this.props.source} style={[styles.daolu, {transform: [{translateX: slidingAnimation_1}]} ]}/>
                {/*<Animated.Image onLayout={this.getWidth.bind(this)} onLoadEnd={()=>{this.firstAnimation()}} source={this.props.source} style={[this.props.style, {transform: [{translateX: slidingAnimation_1}]} ]}/>*/}


                {/*<Animated.Image source={this.props.source} style={[this.props.style, {transform: [{translateX: slidingAnimation_2},{scaleX:-1}]}]}/>*/}
                <Animated.Image source={this.props.source} style={[styles.daolu2, {transform: [{translateX: slidingAnimation_2},]}]}/>

                {this.props.children}

            </View>
        );
    };
};

const styles = StyleSheet.create({
    main:{
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        width:width ,
        height: width == 414 ? 138 : width == 375 ? 125 : 106
        // backgroundColor:'black',
    },
    daolu: {

        marginLeft:-3*width,
        width: width * 2 ,
        height: width == 414 ? 138 : width == 375 ? 125 : 106,

    },

    daolu2: {
        // marginLeft: width,

        width: width * 2  ,
        height: width == 414 ? 138 : width == 375 ? 125 : 106,

    },
});



module.exports = SaiCheBackgroud;