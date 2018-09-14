import React, { Component } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';

import QRCode from 'react-native-qrcode';

export default class Aboutus extends Component {

    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({ navigation }) => ({

        header: (
            <CustomNavBar
                centerText = {"关于我们"}
                leftClick={() =>  navigation.goBack() }
            />
        ),



        // title: navigation.state.params.title,
        // headerStyle: { backgroundColor: COLORS.appColor, marginTop: Android ? (parseFloat(global.versionSDK) > 19 ? StatusBar.currentHeight : 0) : 0 },
        // headerTitleStyle: { color: 'white', alignSelf: 'center' },
        // //加入右边空视图,否则标题不居中  ,alignSelf:'center'
        // headerRight: (
        //     <View style={GlobalStyles.nav_blank_view} />
        // ),
        // headerLeft: (
        //     <TouchableOpacity
        //         activeOpacity={1}
        //         style={GlobalStyles.nav_headerLeft_touch}
        //         onPress={() => { navigation.goBack() }}>
        //         <View style={GlobalStyles.nav_headerLeft_view} />
        //     </TouchableOpacity>
        // ),
    });

    render() {
        let versionStr;
        if (iOS) {
            if (global.GLOBALmmRainbow && global.GLOBALmmRainbow['id']) {
                versionStr = '版本号' + VersionNum + '   ID:' + global.GLOBALmmRainbow['id'];
            } else {
                versionStr = '版本号' + VersionNum;
            }
        } else {
            versionStr = '版本号' + VersionNum;
        }
        let offAddress;
        if (SwitchURLIndex == 9 || SwitchURLIndex == 10) {
            offAddress = "";
        } else {
            offAddress = '官方地址:' + GlobalConfig.baseURL;
        }

        return (
            <View style={styles.container}>
                <CusBaseText style={styles.container_VersionTitle}>
                    {versionStr}
                </CusBaseText>
                {/* <CusBaseText style={{ marginTop: 40, fontSize: 16, color: '#414141', textAlign: 'center', }}>{offAddress}</CusBaseText> */}
                <View style={styles.QRCodeViewStyle}>
                    <QRCode
                        value={GlobalConfig.baseURL}
                        size={200}
                        bgColor='black'
                        fgColor='white' />
                </View>
                <CusBaseText style={styles.container_Detail}>扫描二维码即可分享给好友</CusBaseText>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',  //水平居中
    },

    //版本标题
    container_VersionTitle: {
        marginTop: 50,
        fontSize: 18,
        color: '#414141',
    },

    //二维码
    container_QRCode: {
        width: 124,
        height: 124,
        marginTop: 60,
    },

    //功能说明
    container_Detail: {
        marginTop: 20,
        fontSize: 16,
        color: '#414141',
        textAlign: 'center',
    },
    QRCodeViewStyle: {
        marginTop: 15,
    }
})
