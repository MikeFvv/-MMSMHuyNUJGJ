/**
* Created by Mike on 2017/12/28.
* 无网络提示解决方案
*/

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';



export default class NoNetworkPrompt extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: '未能连接到互联网',
        headerStyle: { backgroundColor: COLORS.appColor, marginTop: 0 },
        headerTitleStyle: { color: 'white', alignSelf: 'center' },

        headerRight: (
            <View style={GlobalStyles.nav_blank_view} />
        ),
        headerLeft: (
            <TouchableOpacity
                activeOpacity={1}
                style={GlobalStyles.nav_headerLeft_touch}
                onPress={() => { navigation.goBack() }}>
                <View style={GlobalStyles.nav_headerLeft_view} />
            </TouchableOpacity>
        ),
    });


    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.promptTitleStyle}>
                    您的设备未启用移动网络或Wi-Fi网络
                </Text>
                <Text style={styles.instructions}>
                    如需要连接到互联网，可以参照以下方法：
                 </Text>
                <Text style={styles.instructions}>
                    在设备的 “设置” - “Wi-Fi网络” 设置面板中选择一个可用的Wi-Fi热点接入。
                </Text>

                <Text style={styles.instructions}>
                    在设备的 “设置” - “通用” - “网络” 设置面板中启用蜂窝数据 (启用后运营商可能会收取数据通信费用)。
                </Text>

                <Text style={styles.instructions}>
                    如果您已接入Wi-Fi网络：
                </Text>

                <Text style={styles.instructions}>
                    请检查您所连接的Wi-Fi热点是否已接入互联网，或该热点是否已允许您的设备访问互联网。
                </Text>

                <Text style={styles.firstPromptTitleStyle}>
                    第一次进入App系统弹框没有允许App使用数据， 解决方案:
                </Text>

                <Text style={styles.firstPromptContentStyle}>
                    「设置-通用-蜂窝移动网络-使用无线局域网与蜂窝移动的应用」选项中更改任意应用的联网权限设置后再恢复原先设置选项，完成操作后再次打开App
                </Text>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    promptTitleStyle: {
        marginTop: 20,
        fontSize: 16,
        textAlign: 'left',
        margin: 10,
        fontWeight: 'bold',
    },
    instructions: {
        margin: 10,
        textAlign: 'left',
        color: '#333333',
        marginBottom: 5,
    },

    firstPromptTitleStyle: {
        marginTop: 20,
        fontSize: 16,
        textAlign: 'left',
        margin: 10,
        fontWeight: 'bold',
        color: 'red',
    },

    firstPromptContentStyle: {
        margin: 10,
        textAlign: 'left',
        marginBottom: 5,
        color: '#f24c1d',
    },


});
