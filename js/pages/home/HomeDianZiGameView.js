
import React, { Component } from 'react';
import {
    StyleSheet,
    WebView,
    View,
    Dimensions,
    TouchableOpacity,
    Image
} from 'react-native';
const { width, height } = Dimensions.get("window");
import BaseNetwork from "../../skframework/component/BaseNetwork"; //网络请求
import Orientation from 'react-native-orientation';
export default class HomeDianZiGameView extends Component {

    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({ navigation }) => ({

        header: null,

    });

    constructor(props) {
        super(props);
        this.state = {
            webWidth: width,
            webHeight: height,
        };
    }

    componentWillMount() {


        const initial = Orientation.getInitialOrientation();
        if (initial === 'PORTRAIT') {
            // do something
        } else {
            // do something else
        }
    }
    _orientationDidChange = (orientation) => {
        if (orientation === 'LANDSCAPE') {
            this.setState({ webWidth: height, webHeight: width });
        } else {
            // do something with portrait layout
        }
    }

    componentDidMount() {
        Orientation.lockToLandscapeRight();
        Orientation.addOrientationListener(this._orientationDidChange);
        this.refs.LoadingView && this.refs.LoadingView.showLoading('正在加载中...');
       

    }
    componentWillUnmount() {
        Orientation.getOrientation((err, orientation) => {
            Orientation.lockToPortrait();
        });


        // Remember to remove listener
        Orientation.removeOrientationListener(this._orientationDidChange);
    }
    _goBack(){
        this.props.navigation.goBack();
           
    }

    render() {

        return (
            <View style={{ width: this.state.webWidth, height: this.state.webHeight}}>
              
                <WebView
                    style={{ width: this.state.webWidth, height: this.state.webHeight }}
                    onLoadEnd={() => this.refs.LoadingView && this.refs.LoadingView.cancer()}
                    source={{ url: this.props.navigation.state.params.guest_url }}
                ></WebView>
                <TouchableOpacity
                    style={{ width: 40, height: 40,  position: 'absolute', left: 15, top: 25}}
                    activeOpacity={1}
                    onPress={() => this._goBack()}>
                    <Image resizeMode={'stretch'} source={require('./img/ic_dianzifan.png')} style={{ width: 40, height: 40, }} />
                </TouchableOpacity>
                <LoadingView ref='LoadingView' />
            </View>
        );
    }
}


