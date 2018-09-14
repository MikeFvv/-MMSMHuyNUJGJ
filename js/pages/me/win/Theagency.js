import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    StatusBar,
    Image,
    Text,
    TouchableOpacity,
    Dimensions,
    Alert,
    ScrollView,
} from 'react-native';

import Adaption from "../../../skframework/tools/Adaption";

const {width, height} = Dimensions.get('window');


import HuoCalendar from "../welfareTask/HuoCalendar";


export default class The extends Component {

    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({ navigation }) => ({



        header: (
            <CustomNavBar
                centerText = {"代理中心"}
                leftClick={() =>  navigation.goBack() }
            />
        ),
    });

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={styles.container}>

                <Image style={{width: SCREEN_WIDTH, height: 145}} source={require('../img/Agency/ic_theagencyBack.png')}/>

                {/*代理说明、代理报表、下级报表*/}
                <View style={styles.rowSuperview }>

                    {/*代理说明*/}
                    <TouchableOpacity activeOpacity={1} onPress={() => navigate('Agenthat', {title: '代理说明'})}
                                      style={styles.touchItem}>
                        <View style={styles.touchItem}>
                            <Image style={styles.iconStyles} source={require('../img/Agency/dailishuoming.png')}></Image>
                            <Text allowFontScaling={false} style={styles.textTop}>代理说明</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ backgroundColor: '#e2e2e2', height: SCREEN_WIDTH / 3, width: 0.5 }} />

                    {/*代理报表*/}
                    <TouchableOpacity activeOpacity={1} onPress={() => navigate('TheStatements', {
                        title: '代理报表',
                    })} style={styles.touchItem}>
                        <View style={styles.touchItem}>
                            <Image style={styles.iconStyles} source={require('../img/Agency/dailibaobiao.png')}></Image>
                            <Text allowFontScaling={false} style={styles.textTop}>代理报表</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ backgroundColor: '#e2e2e2', height: SCREEN_WIDTH / 3, width: 0.5 }} />

                    {/*下级报表*/}
                    <TouchableOpacity activeOpacity={1} onPress={() => navigate('TheReportlower', {title: '下级报表'})}
                                      style={[styles.touchItem, {borderRightWidth: 1}]}>
                        <View style={styles.touchItem}>
                            <Image style={styles.iconStyles} source={require('../img/Agency/xiajibaobiao.png')}></Image>

                            <Text allowFontScaling={false} style={styles.textTop}>下级报表</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ backgroundColor: '#e2e2e2', height: 0.5 }} />


                {/*下级开户、下级管理、投注明细*/}
                <View style={styles.rowSuperview }>

                    {/*下级开户*/}
                    <TouchableOpacity activeOpacity={1} onPress={() => navigate('SubAccount', {title: '下级开户'})}
                                      style={styles.touchItem}>
                        <View style={styles.touchItem}>
                            <Image style={styles.iconStyles} source={require('../img/Agency/xiajikaihu.png')}></Image>
                            <Text allowFontScaling={false} style={styles.textTop}>下级开户</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ backgroundColor: '#e2e2e2', height: SCREEN_WIDTH / 3, width: 0.5 }} />

                    {/*下级管理*/}
                    <TouchableOpacity activeOpacity={1} onPress={() => navigate('TheLowerManager', {title: '下级管理'})}
                                      style={styles.touchItem}>
                        <View style={styles.touchItem}>
                            <Image style={styles.iconStyles} source={require('../img/Agency/xiajiguanli.png')}></Image>

                            <Text allowFontScaling={false} style={styles.textTop}>下级管理</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ backgroundColor: '#e2e2e2', height: SCREEN_WIDTH / 3, width: 0.5 }} />


                    {/*投注明细*/}
                    <TouchableOpacity activeOpacity={1} onPress={() => navigate('DelegeTouZhuDetial')}
                                      style={styles.touchItem}>
                        <View style={styles.touchItem}>
                            <Image style={styles.iconStyles} source={require('../img/Agency/touzhumingxi.png')}></Image>

                            <Text allowFontScaling={false} style={styles.textTop}>投注明细</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ backgroundColor: '#e2e2e2', height: 0.5 }} />


                <View style={styles.rowSuperview}>

                    <TouchableOpacity activeOpacity={1} onPress={() => navigate('TheDetails', {title: '交易明细'})}
                                      style={[styles.touchItem]}>
                        <View style={styles.touchItem}>
                            <Image style={styles.iconStyles}source={require('../img/Agency/jiaoyimingxi.png')}></Image>

                            <Text allowFontScaling={false} style={styles.textTop}>交易明细</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ backgroundColor: '#e2e2e2', height: SCREEN_WIDTH / 3, width: 0.5 }} />

                    <View style={styles.touchItem}></View>

                    <View style={{ backgroundColor: '#e2e2e2', height: SCREEN_WIDTH / 3, width: 0.5 }} />

                </View>

                <View style={{ backgroundColor: '#e2e2e2', height: 0.5 }} />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'rgb(230,230,230)',
        backgroundColor:'white',
        flex: 1
    },

    //单个模块视图
    container_HeaderView_Box: {
        borderColor: 'lightgrey',
        flex: 0.5,
        flexDirection: 'row',
        alignItems: 'center',      //垂直居中
        justifyContent: 'center',  //水平居中
        height: 50,
        borderBottomWidth: 1,
    },
    //模块里的图片
    container_HeaderView_Box_Image: {
        width: 20,
        height: 20,
    },
    //模块的文字
    container_HeaderView_Box_Text: {
        textAlign: 'left',
        fontSize: Adaption.Font(17, 15),
        marginLeft: 10,
    },

    //列表
    contain_SettingListView: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        height: 50,
    },

    //列表单个模块
    container_SettingListView_Model: {
        flex: 0.5,
        height: 50,
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderColor: 'lightgrey',
    },

    //列表模块左边
    container_SettingListView_Model_Left: {
        flex: 0.2,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },

    //列表模块右边
    container_SettingListView_Model_Right: {
        flex: 0.8,
        height: 50,
        flexDirection: 'column',
        justifyContent: 'center',
    },

    //右边标题
    container_SettingListView_Model_Right_Title: {
        fontSize: Adaption.Font(17, 15),
        color: '#454545',
    },

    //右边标题描述
    container_SettingListView_Model_Right_Content: {
        fontSize: Adaption.Font(14, 12),
        color: COLORS.global_subtitle_color,
    },
    //一整行布局
    rowSuperview: {
        flexDirection: 'row',
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH / 3,

    },

    //每一个按钮大背景
    touchItem: {
        // flex: 1,
        // flexDirection: 'row',
        // height: 60,
        justifyContent: 'center',
        alignItems: 'center',

        width: SCREEN_WIDTH / 3,
        height: SCREEN_WIDTH / 3,
    },

    iconStyles:{

        width:22,
        height:22,
    },

    //文字
    textTop: {
        marginTop: 16,
        fontSize: 17,
        color: '#414141'
    },


    textBottom: {
        marginTop: 5,
        color: COLORS.global_subtitle_color,
    },

    item: {
        flex: 1,
        flexDirection: 'row',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },

})
