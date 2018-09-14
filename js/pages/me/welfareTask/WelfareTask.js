import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Text,
    Alert,
    StatusBar,
} from 'react-native';

import Adaption from "../../../skframework/tools/Adaption";

export default class WelfareTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gift_event: '',
            sign_event: '',
        };
    }

    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({ navigation }) => ({


        header: (
            <CustomNavBar
                centerText = {"福利任务"}
                leftClick={() => {navigation.state.params.callback(),navigation.goBack()} }
            />
        ),

    });

    componentDidMount() {

        let loginObject = global.UserLoginObject;
        this.setState({
            sign_event:loginObject.Sign_event,
            gift_event:loginObject.Gift_event,
        });
  }
    // 点击事件
    _clcik(navigate) {
      
            Alert.alert(
                '提示',
                '该通道未开通',
                [
                    {
                        text: '确定', onPress: () => {
                    }
                    },
                ]
            )
        
    }

    _onGoToDaily(navigate) {
        if (QianDaoWeiHu==60007) {
            Alert.alert(
                '提示',
                '该通道未开通',
                [
                    {
                        text: '确定', onPress: () => {
                    }
                    },
                ]
            )
        } else {
            navigate('DailyAttendance', {
            callback: () => {
            }
        })
        }

    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={styles.container}>

                {/*每日签到*/}
                <TouchableOpacity activeOpacity={1} onPress={() => this._onGoToDaily(navigate)} style={{
                    height: 61,

                    flexDirection: 'row',
                    // borderRightWidth: 1,
                    alignItems: 'center',
                    backgroundColor: 'white',
                    marginTop: 10,
                }}>
                    {/*<View style={{height:60,flex:1,backgroundColor:'white',}} >*/}
                    <Image style={{width: 45, height: 45, marginLeft: 15}}
                           source={require('../img/ic_meiriqiandao.png')}></Image>

                    <View style={styles.container_TaskView_Right}>
                        <CusBaseText style={styles.container_TaskView_Title}>每日签到</CusBaseText>
                        <CusBaseText style={styles.container_TaskView_Content}>签到领宝箱</CusBaseText>
                    </View>

                    <Image style={{width: 13, height: 13, marginRight: 15}}
                           source={require('../img/ic_buyLottery_right_arrow.png')}></Image>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} onPress={() => this._clcik(navigate)}
                                  style={{
                                      height: 61,
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      backgroundColor: 'white',
                                      marginTop: 10,
                                  }}>

                    <Image style={{width: 45, height: 45, marginLeft: 15}}
                           source={require('../img/ic_hongbaorenwu.png')}></Image>
                    <View style={styles.container_TaskView_Right}>
                        <CusBaseText style={styles.container_TaskView_Title}>优惠管理</CusBaseText>
                        <CusBaseText style={styles.container_TaskView_Content}>查看获得的优惠奖励</CusBaseText>
                    </View>

                    <Image style={{width: 13, height: 13, marginRight: 15}}
                           source={require('../img/ic_buyLottery_right_arrow.png')}></Image>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f3f3',
        // flexDirection:'row',
    },

    // container_TaskView_Left: {
    //     flex: 0.3,
    //     height: Adaption.height(80),
    //     alignItems: 'center',
    //     justifyContent: 'center'
    // },

    container_TaskView_Right: {
        flex: 1,
        height: Adaption.Height(60),
        justifyContent: 'center',
        marginLeft: 12,
    },

    container_TaskView_Title: {
        fontSize: Adaption.Font(16, 14),
        color: '#4d4d4d',

    },

    container_TaskView_Content: {
        fontSize: Adaption.Font(14, 13),
        color: 'lightgrey',
        marginTop: 10,
    },

})
