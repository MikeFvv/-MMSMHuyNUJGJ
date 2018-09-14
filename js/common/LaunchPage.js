
import React, { Component } from 'react';
import { View, Text, StyleSheet,Animated,Dimensions } from 'react-native';
import GetSetStorge from './skframework/component/GetSetStorge';

import LocalImages from '../publicconfig/images';  //加载图片
import LocalImgs from '../res/img';  //加载图片

class LaunchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {  //这是动画效果
            bounceValue: new Animated.Value(1)
        };
    }
    componentDidMount() {
        Animated.timing(
            this.state.bounceValue, { toValue: 1.2, duration: 1000 }
        ).start();
        this.timer = setTimeout(() => {
            GetSetStorge.getStorgeAsync('isFrist').then((result) => {
                if (result == null || result == '') {
                    //第一次启动 
                    this.props.navigation.navigate('guideView');
                    GetSetStorge.setStorgeAsync('isFrist', 'true');
                } else {
                    //第二次启动s 
                    this.props.navigation.navigate('MainTab');
                }
            }).catch((error) => {
               
                console.log('系统异常' + error);
               
            });
        }, 1000);

    }
    componentWillUpdate = () => {
        clearTimeout(this.timer);
    }

    render() {
        return (
            <Animated.Image
                style={{
                    width: SCREEN_WIDTH,
                    height: SCREEN_HEIGHT,
                    transform: [{ scale: this.state.bounceValue }]
                }}
                source={LocalImgs.ic_public_launchImage}
            />
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});


export default LaunchPage;
