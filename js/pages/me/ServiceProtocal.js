
import React, { Component } from 'react';
import {
    WebView,
} from 'react-native';

import createInvoke from 'react-native-webview-invoke/native'

export default class ServiceProtocal extends Component {

    webview: WebView
    invoke = createInvoke(() => this.webview)

    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({ navigation }) => ({

        header: (
            <CustomNavBar
                centerText = {navigation.state.params.title}
                leftClick={() =>  navigation.goBack() }
            />
        ),

    });

    componentWillMount() {

        //传给HTML参数
        this.webInitializeSend = () => (GlobalConfig.userData.web_title)

    }

    componentDidMount() {

        this.invoke
            .define('set', this.webWannaSet)
            .define('initSend', this.webInitializeSend)
    }


    render(){

        return (

            <WebView
                onLoadStart={this.onLoadPageStart}
                ref={webview => this.webview = webview}
                onLoadEnd={this.onLoadPageEnd}
                source={require('./ServiceProtocal.html')}
                onMessage={this.invoke.listener}
            />
            // <LoadingView ref='LoadingView' />

        );
    }
}
