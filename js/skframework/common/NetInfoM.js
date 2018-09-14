/**
 * Created by elvis on 2017/11/11.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    NetInfo
} from 'react-native';

class NetInfoM extends React.Component {

    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            isConnected: null,
            networkType: null
        };
    }

    //页面的组件渲染完毕（render）之后执行
    componentDidMount() {

        //检测网络是否连接
        NetInfo.isConnected.fetch().then(isConnected => {
            this.setState({ isConnected });
        });

        /*
          connectionInfo:

          type{ 
            - none - 设备处于离线状态。
            - wifi - 设备处于联网状态且通过wifi链接，或者是一个iOS的模拟器。
            - cellular - 设备是通过Edge、3G、WiMax或是LTE网络联网的。
            - unknown - 发生错误，网络状况不可知
            }

            effectiveType{
               - 2g 
            　 - 3g 
            　 - 4g 
            　 - unknown
            }
         */

        //检测网络类型信息
        NetInfo.getConnectionInfo().then((connectionInfo) => {

            if (connectionInfo.type == 'cellular') {
                this.setState({ networkType: connectionInfo.effectiveType });
            } else {
                this.setState({ networkType: connectionInfo.type });
            }

            // switch (connectionInfo.effectiveType) {
            //     case '2g':
            //         break;
            //     case '3g':
            //         break;
            //     case '4g':
            //         break;

            //     default:
            //         break;
            // }

        });

        //监听网络链接变化事件
        NetInfo.isConnected.addEventListener('change', this._handleIsConnectedChange);

        //监听网络类型变化事件
        NetInfo.addEventListener('connectionChange', this._handleConnectionInfoChange);

    }

    _handleIsConnectedChange = (isConnected) => {
        this.setState({ isConnected });
    }

    _handleConnectionInfoChange = (connectionInfo) => {
        this.setState({ networkType: connectionInfo.type });
    }

    //移除监听
    componentWillUnMount() {
        NetInfo.isConnected.removeEventListener('change', this._handleIsConnectedChange);
        NetInfo.removeEventListener('connectionChange', this._handleConnectionInfoChange);
    }

    //渲染
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>当前的网络状态：{this.state.isConnected ? '网络在线' : '离线'}</Text>
                <Text style={styles.welcome}>当前网络连接类型： {this.state.networkType}</Text>
            </View>
        );
    }

    //此方法仅Android的可用
    // <Text style={styles.welcome}>当前连接网络是否计费：{NetInfo.isConnectionExpensive === true ? '需要' : '不要'}</Text>
}



//样式定义
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30
    },
    welcome: {
        fontSize: 16,
        textAlign: 'left',
        margin: 10
    }
});


AppRegistry.registerComponent('SKyCPRN', () => NetInfoM);





