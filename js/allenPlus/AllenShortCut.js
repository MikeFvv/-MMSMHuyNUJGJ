/**
 * Created by Allen on 2018/2/01.
 */

import React, {Component} from 'react';
import {
    Modal,
    Text,
    Image,
    TouchableOpacity,
    View,
    Dimensions,
    Alert,
    TouchableWithoutFeedback,
    TouchableHighlight,
    PanResponder,
    StyleSheet,
    Animated,
    Easing
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'

let {height, width} = Dimensions.get('window');
import LocalImg from "../res/img";
import AllenShortCutScrollView from "./AllenShortCutScrollView";

let iphone5S = global.iOS ? (SCREEN_WIDTH == 320 ? true : false) : 0;
let iphoneX = global.iOS ? (SCREEN_HEIGHT == 812 ? true : false) : 0; //是否是iphoneX
export default class AllenShortCut extends Component {

    constructor(props) {
        super(props);
        this.state = {modalVisible: false, navigate: null, isLogin: ''};
        // this.isLogin = '';
        this.spinValue = new Animated.Value(0)


    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

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
            outputRange: ['0deg', '135deg']
        });

        return (
            <View>
                <Modal
                    style={{height: 300}}
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        alert("Modal has been closed.")
                    }}
                >
                    {/*<View style={{flex:1,backgroundColor:'rgba(0,0,0,0.2)'}}>*/}


                    {/*<TouchableOpacity onPress={() => {*/}
                    {/*this.setModalVisible(!this.state.modalVisible)*/}
                    {/*}}>*/}
                    {/*<Text style={{marginTop:40}}>推出</Text>*/}
                    {/*</TouchableOpacity>*/}

                    {/*</View>*/}
                    {/*<TouchableWithoutFeedback*/}
                    {/*onPress={() => console.log('haha')}>*/}
                    {/*<View style={{flex: 1, marginBottom: iphoneX ? 83 : 49, backgroundColor: 'rgba(0,0,0,0.2)',  ...StyleSheet.absoluteFillObject}}*/}
                    {/*{...this.wrapperPanResponder.panHandlers}*/}
                    {/*/>*/}
                    <View style={styles.pan_container} {...this._gestureHandlers} />

                    <View style={{
                        bottom: iphoneX?105:71,
                        position: 'absolute',
                        marginLeft: 20,
                        marginTop: 60,
                        borderRadius: 5,
                        backgroundColor: '#ffffff',
                        height: width - 40 - 20,
                        width: width - 40,
                        alignItems: 'center',

                    }}>

                        <View style={{
                            width: width - 40 - 20,
                            alignItems: 'center',
                            paddingTop: 10,
                            height: iphone5S ? 50 : 60
                        }}>
                            <View style={{
                                position: 'absolute',
                                bottom: 0,
                                width: width - 40 - 20,
                                borderStyle: 'dashed',
                                borderWidth: 0.5,
                                borderColor: '#bababa'
                            }}></View>

                            <CusBaseText allowFontScaling={false} style={{
                                color: '#171717',
                                fontSize: Adaption.Font(22, 19),
                                marginTop: 10
                            }}>快捷方式</CusBaseText>


                        </View>
                        <AllenShortCutScrollView width={width - 40} height={width - 40 - 20 - 60}
                                                 hideCommonCallBack={this.hideCommonCallBack}
                                                 navigate={this.state.navigate} Level={global.UserLoginObject.Level}
                                                 sign_event={global.UserLoginObject.Sign_event}/>

                    </View>

                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        bottom: iphoneX?34:-0,
                        left: width / 2.0 - width / 5.0 / 2.0,
                        height: width / 5.0,
                        width: width / 5.0
                    }}><TouchableOpacity

                        activeOpacity={1.0}
                        onPress={() => {

                            this.setModalVisible(!this.state.modalVisible);
                            // this.spin()
                            PushNotification.emit('allenReceiveReturn', {
                                isShow: null,
                                navigation: null
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
                              source={LocalImg.ic_page_plus} style={{
                        height: 20,
                        width: 20,
                        transform: [{rotate: spin}]}}
                    /></View></TouchableOpacity></View>

                    {/*</TouchableWithoutFeedback>*/}
                </Modal>
                {/*<Toast ref="Toast" position='center'/>*/}
            </View>


        );
    }

    hideCommonCallBack = () => {
        console.log("隐藏", !this.state.modalVisible);
        this.setModalVisible(!this.state.modalVisible);
    }

    componentWillMount() {
        // console.log("你妈几把");

        this._gestureHandlers = {
            onStartShouldSetResponder: () => true,
            // onMoveShouldSetResponder: ()=> true,
            onResponderGrant: () => {
                // console.log('老子')
                this.setState({modalVisible:false});
                PushNotification.emit('allenReceiveReturn', {
                    isShow: null,
                    navigation: null
                });

            },
            onResponderMove: () => {
                // console.log(1)
            },
            onResponderRelease: () => {
                // console.log('几把')
            },
        }

        this.wrapperPanResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, g) => false,
            onPanResponderGrant: () => {
                console.log('GRANTED TO WRAPPER');
            },
            onPanResponderMove: (evt, gestureState) => {
                console.log('WRAPPER MOVED');
            }
        });

        // this.scollerPanResponder = PanResponder.create({
        //     onStartShouldSetPanResponder: (e, g) => true,
        //     onPanResponderGrant: () => {
        //         console.log('GRANTED TO SCROLLER');
        //     },
        //     onPanResponderMove: (evt, gestureState) => {
        //         console.log('SCROLLER MOVED');
        //     }
        // });


        // this.isLoading = true;


        // this._gestureHandlers = {
        //     onStartShouldSetResponder: () => true,
        //     // onMoveShouldSetResponder: ()=> true,
        //     onResponderGrant: ()=>{console.log('老子')},
        //     onResponderMove: ()=>{console.log(1)},
        //     onResponderRelease: ()=>{console.log('几把')},
        // }
        // this._gestureHandlers2 = {
        //     onStartShouldSetResponder: () => true,
        //     // onMoveShouldSetResponder: ()=> true,
        //     onResponderGrant: ()=>{console.log('老子2')},
        //     onResponderMove: ()=>{console.log(2)},
        //     onResponderRelease: ()=>{console.log('几把2')}
        // }


        let that = this;
        this.subscription = PushNotification.addListener('allenReceiveSc', (loginObject) => {
            if (!this.state.navigate) {
                this.state.navigate = loginObject.navigation.navigate;
            }
            //allen临时加的
            // this.setModalVisible(!this.state.modalVisible);
            // this.spin();
            // return;
            //上面的要删除****
            if (global.UserLoginObject.is_Guest == 2) {
                Alert.alert(
                    '温馨提示',
                    '您的账号是试玩账号,没有权限访问!',
                    [
                        {
                            text: '确定', onPress: () => {
                            }
                        },
                    ]
                )

                return;
            }


            if (global.UserLoginObject.Token) {
                this.setModalVisible(!this.state.modalVisible);
                this.spin()
                // console.log(loginObject.navigation,global.UserLoginObject.Level,global.UserLoginObject.Sign_event);


            } else {
                // console.log(this.refs.Toast);
                // this.refs.Toast && this.refs.Toast.show(`暂未获取到相关数据,请稍后..`, 1000);
                // return;
                // this.props.allenToastCallBack();
                Alert.alert(
                    '提示',
                    '您还未登录,请先去登录',
                    [
                        {
                            text: '确定', onPress: () => {
                                this.state.navigate('Login', {title: '登录',})
                            }
                        },
                        {
                            text: '取消', onPress: () => {
                            }
                        },
                    ]
                )
            }
        });


        // console.log("componentDidMount","loginObject");
        // this.state.isLogin = global.UserLoginObject.Token;
        // this.state.Level = global.UserLoginObject.Level;
        // this.state.sign_event = global.UserLoginObject.Sign_event;
        // isLogin: global.UserLoginObject.Token,  //Token
        //     userName: global.UserLoginObject.UserName, //用户名
        //     headerIcon: global.UserLoginObject.UserHeaderIcon,//用户头像
        //     totalMoney:  global.UserLoginObject.TotalMoney,//用户总金额
        //     tkPrice: global.UserLoginObject.TKPrice, //提款金额
        //     Level:global.UserLoginObject.Level,//代理
        //     is_GuestShiWan:global.UserLoginObject.is_Guest,
        //     sign_event:global.UserLoginObject.Sign_event,

        // this.subscription2 = PushNotification.addListener('LoginSuccess', (loginObject)=>{
        //
        //     console.log("loginObject",loginObject);
        //     // this.isLoading = false;
        //     this.state.Level = loginObject.Level;//代理
        //     this.state.sign_event = loginObject.Sign_event;
        //     this.state.isLogin =  loginObject.Token; //Token
        //
        //
        //
        //
        //
        //
        // });

        // 接受用户退出登录的通知
        this.subscription3 = PushNotification.addListener('LoginOutSuccess', () => {
            this.setModalVisible(false);
        });
    }

    componentDidMount() {

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    pan_container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        marginBottom: iphoneX ? 83 : 49,
        backgroundColor: 'rgba(0,0,0,0.2)'
    },
    scroll_view: {
        backgroundColor: 'teal',
        maxHeight: 350
    }
});
