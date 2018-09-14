/**
 * Created by Allen on 2018/2/02.
 */

import React, {Component} from 'react';
import {
    Modal, Text, TouchableHighlight, View, Image, TouchableOpacity, Dimensions, Animated,
    Easing, Alert
} from 'react-native';
import LocalImg from "../res/img";

let {height, width} = Dimensions.get('window');
export default class AllenCircularView extends Component {

    constructor(props) {
        super(props);
        // this.state = {modalVisible: false};
        this.state = {navigation: props.navigation};
        this.spinValue = new Animated.Value(1)
    }

    // setModalVisible(visible) {
    //     this.setState({modalVisible: visible});
    // }

    spin () {
        this.spinValue.setValue(0)
        Animated.timing(
            this.spinValue,
            {
                toValue: 1,
                duration: 300,
                easing: Easing.linear
            }
        ).start((finished)=>{this.finished(finished)});
    }

    finished(f){
        console.log("f",f);
    }

    render() {
        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['135deg', '0deg']
        });
        let iphoneX = global.iOS ? (SCREEN_HEIGHT == 812 ? true : false) : 0; //是否是iphoneX
        return (
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                bottom: iphoneX?34:0,
                left: width / 2.0 - width / 5.0 / 2.0,
                height: width / 5.0,
                width: width / 5.0
            }}><TouchableOpacity

                activeOpacity={1.0}
                onPress={() => {
                    // if(!this.refs.plusimg.isShow) {
                    //     this.refs.plusimg.setNativeProps({transform: [{rotateZ: '45deg'}]});
                    //     this.refs.plusimg.isShow = true;
                    // }else{
                    //     this.refs.plusimg.setNativeProps({transform: [{rotateZ: '0deg'}]});
                    //     this.refs.plusimg.isShow = false;
                    // }

                    // console.log(this.refs.plusimg);
                    PushNotification.emit('allenReceiveSc', {
                        isShow: this.refs.plusimg.isShow,
                        navigation: this.state.navigation
                    });
                }}
            ><View style={{
                borderWidth: 0.7,
                borderColor: '#aaaaaa',
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
                height: 50,
                width: 50
            }}><Animated.Image ref='plusimg'
                      source={LocalImg.ic_page_plus}
                      style={{height: 20, width: 20, transform: [{rotate: spin}]}}/></View></TouchableOpacity></View>
        );
    }


    componentDidMount() {

    }


    componentWillMount() {
        this.subscription = PushNotification.addListener('allenReceiveReturn', (loginObject) => {
            // if (!this.state.navigate) {
            //     this.state.navigate = loginObject.navigation.navigate;
            // }
            // //allen临时加的
            // this.setModalVisible(!this.state.modalVisible);
            this.spin();
            return;
            //上面的要删除****
            // if (global.UserLoginObject.Token) {
            //     this.setModalVisible(!this.state.modalVisible);
            //     this.spin()
            //     // console.log(loginObject.navigation,global.UserLoginObject.Level,global.UserLoginObject.Sign_event);
            //
            //
            // } else {
            //     // console.log(this.refs.Toast);
            //     // this.refs.Toast && this.refs.Toast.show(`暂未获取到相关数据,请稍后..`, 1000);
            //     // return;
            //     // this.props.allenToastCallBack();
            //     Alert.alert(
            //         '提示',
            //         '您还未登录,请先去登录',
            //         [
            //             {
            //                 text: '确定', onPress: () => {
            //                     this.state.navigate('Login', {title: '登录',})
            //                 }
            //             },
            //             {
            //                 text: '取消', onPress: () => {
            //                 }
            //             },
            //         ]
            //     )
            // }
        });
    }




    componentWillUnmount() {
        // console.log("卸载");
        if (typeof(this.subscription) == 'object') {
            this.subscription && this.subscription.remove();
        }


        // if (typeof(this.subscription2) == 'object'){
        //
        //     this.subscription2 && this.subscription2.remove();
        // }

        // if (typeof(this.subscription3) == 'object'){
        //
        //     this.subscription3 && this.subscription3.remove();
        // }
    }
}