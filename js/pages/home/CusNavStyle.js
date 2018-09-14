/**
 * Created by Mike on 2017/11/25.
 * 自定义导航栏
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    Animated,
    Easing,
} from 'react-native';

let { height, width } = Dimensions.get('window');


// 自定义Header，覆盖系统提供的
export default class NavStyle extends Component {

    static defaultProps = {
        backgroundColor: 'white',
        fontSize: '18',
    };

    constructor(props) {
        super(props);

        this.animatedValue = new Animated.Value(0);
    }

    _createLeftNavView(){


        if (this.props.leftText != ''){
            return (<CusBaseText style={styles.leftStyle} onPress={() =>
            {this.props.leftGiftClick ? this.props.leftGiftClick() : null}}
            >
                {this.props.leftText}
            </CusBaseText>)
        }
        else {

            return Hongbaolihe == 1 ? (<TouchableOpacity
                style = {{marginTop: height == 812 ? 30 : 20,paddingLeft: 15, alignSelf: 'center', flex:0.32}}
                activeOpacity={0.5}
                onPress = {() => this.props.leftGiftClick ? this.props.leftGiftClick() : null}>
                <Animated.Image
                    style={Hongbaolihe == 1 ? this._changeStyle() : {width:26, height:22, marginRight:10, marginTop:SCREEN_HEIGHT == 812 ? 15 :5}}
                    source = {require('./img/ic_home_gift.png')}
                >
                </Animated.Image>
            </TouchableOpacity>): (<TouchableOpacity
                style = {{marginTop: height == 812 ? 44 : 20,paddingLeft: 15, alignSelf: 'center', flex:0.32}}
                activeOpacity={0.5}
                onPress = {() => {

                    this.props.leftGiftClick ? this.props.leftGiftClick() : null;
                }}>
                <Image
                    style={{width:26, height:22}}
                    source = {PersonMessageArray==1?require('./img/ic_gerenxiaoxiHong.png'):require('./img/ic_gerenxiaoxi.png')}
                >
                </Image>
            </TouchableOpacity>)
        }

    }


    componentDidMount() {

        if (global.UserLoginObject.Uid != ''){
            this.animate();
        }
    }

    animate () {

        //点击之后就不会再抖动

        this.animatedValue.setValue(0);
        Animated.timing(
            this.animatedValue,
            {
                toValue: 1,
                duration: 800,
                easing: Easing.linear,
            }
        ).start(() => this.animate())

    }

    _changeStyle = () => {

        const rotateZ = this.animatedValue.interpolate({
            inputRange:[0, 1],
            outputRange:['-10deg', '10deg']
        });

        if (global.UserLoginObject.Uid != ''){
            return {width:26, height:22, marginRight:10, marginTop:SCREEN_HEIGHT == 812 ? 15 :5, transform:[{rotateZ}],};
        }
        return {width:26, height:22, marginRight:10, marginTop:SCREEN_HEIGHT == 812 ? 15 :5};
    }

    render() {

        return (
            <View style={[styles.container, { backgroundColor: this.props.backgroundColor }]}>
                {this._createLeftNavView()}
                <View style={[styles.imageLogoStyle]}></View>



                {this.props.rightText != '注册' ? (<CusBaseText style={[styles.rightStyle, { fontSize: this.props.fontSize, }]} adjustFontSizeToFit={true} onPress={() => this.props.rightClick()}>
                    ￥: <CusBaseText style = {{fontSize: this.props.fontSize, color:'#fff45c'}}>
                    {this.props.rightText}
                </CusBaseText>元
                </CusBaseText>) : (<CusBaseText style={[styles.rightStyle, { fontSize: this.props.fontSize }]} adjustFontSizeToFit={true} onPress={() => this.props.rightClick()}>
                    注册
                </CusBaseText>)}
                <View style={{position:'absolute',flexDirection:'row',width:WIDTH*0.4 ,left:(WIDTH -WIDTH*0.4)/2.0,alignItems:'center',justifyContent:'center'}}><Image style={[styles.imageLogoStyle2]}
                                                                                                                                       source={this.props.homeNavLogo != '' ? { uri: this.props.homeNavLogo } : ''}
                /></View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: height == 812 ? 88 : 64,
        flexDirection: 'row',
    },
    leftStyle: {
        // backgroundColor: 'blue',
        marginTop: height == 812 ? 44 : 20,
        paddingLeft: 15,
        // marginLeft: 15,
        // alignItems: 'center',
        // justifyContent: 'center',
        alignSelf: 'center',
        color: 'white',
        fontSize: 18,
        flex : 0.32,
    },
    rightStyle: {
        marginTop: height == 812 ? 44 : 20,
        paddingRight: 10,
        // marginRight: 15,
        // alignItems: 'flex-end',
        // justifyContent: 'flex-end',
        alignSelf: 'center',
        textAlign: 'right',
        color: 'white',
        fontSize: 18,
        //width: (width - 100) / 2,
        flex:0.32
    },
    // 1 cover 等比拉伸 
    // 2 stretch 保持原有大小 
    // 3 contain  图片拉伸  充满空间 
    imageLogoStyle: {
        // backgroundColor: 'red',
        marginTop: height == 812 ? 44 : 20,
        width: 200,
        height: 44,
        flex:0.36
    },

    imageLogoStyle2: {
        // backgroundColor: 'red',
        marginTop: height == 812 ? 44 : 20,
        width: 170,
        height: 44,
        resizeMode: 'contain',
        // flex:0.36
    },

});

