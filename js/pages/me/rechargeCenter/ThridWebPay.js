'use strict';

import React, {Component} from 'react';

import {
    StyleSheet,
    WebView,
} from 'react-native';

class ThridWebPay extends Component {

    static navigationOptions = ({navigation}) => ({

        header: (
            <CustomNavBar
                centerText = {navigation.state.params.title}
                leftClick={() => navigation.goBack()}
            />
        ),

    });

    constructor(props) {
        super(props);

        this.webUrl = this.props.navigation.state.params.webUrl;
        this.method = this.props.navigation.state.params.method;
    }

    render() {

        return (
            <WebView
                automaticallyAdjustContentInsets={false}
                style={styles.webView}
                source={this._handleSource()}
                mixedContentMode={'always'} //接受不安全链接
                javaScriptEnabled={true} //Android iOS平台JavaScript是默认开启的
                startInLoadingState={true} //强制WebView在第一次加载时先显示loading视图。默认为true。
                scalesPageToFit={true} //设置是否要把网页缩放到适应视图的大小，以及是否允许用户改变缩放比例。
                bounces={false}
                onShouldStartLoadWithRequest={(event)=>{
                    // console.log(event);
                    this._changeTitle(event);
                    return true;
                }}
                onLoadEnd = {()=>{
                    this.props.navigation.setParams({
                        title:'支付',
                    });
                }}
            />
        );
    }

    _handleSource = () => {
        if (this.method === 'post') {
            return {uri: this.webUrl, method: this.method, body: this.props.navigation.state.params.body};
        }
        return {uri: this.webUrl, method: this.method}
    }

    _changeTitle = (event) => {
        this.props.navigation.setParams({
            title:event.title ? event.title : (event.url.length > 10 ? event.url.substr(0,10)+'...' : event.url),
        });
    }

}

const styles = StyleSheet.create({

    webView: {
        flex: 1,
        backgroundColor: 'white',
    },

});


export default ThridWebPay;