/**
 * Created by kl on 2018/8/31.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';


import { StackNavigator,} from "react-navigation";
import ChatService from "./ChatSerivce";
import CusNavStyle from "../home/CusNavStyle";

class IPLimit extends Component {

    static navigationOptions = () => ({
        header: (
            <CusNavStyle
                backgroundColor={COLORS.appColor}
                homeNavLogo={(global.IPLimitData && global.IPLimitData.phone_logo) ? global.IPLimitData.phone_logo : ''}
                hiddenText={true}
            />
        ),
    });

    componentWillMount() {
        console.log('global.IPLimitData'+ global.IPLimitData)
    }

    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.img} source={require('./img/ic_IPLimit_position.png')}/>
                <CusBaseText style={styles.title}>非常抱歉给您带来了不便</CusBaseText>
                <CusBaseText style={styles.desc}>{'由于您的IP所在地不在我们的服务区范围内\n' +
                    '我们暂时无法为您服务。\n' +
                    '如有误判，请点击联系在线客服 谢谢！'}</CusBaseText>
                <TouchableOpacity
                    style={styles.btn}
                    activeOpacity={0.7}
                    onPress={() => {
                        this.props.navigation.navigate('ChatService', {callback:() => {}, title:'在线客服',chatServiceURL:global.IPLimitData.service_url});
                    }}
                >
                    <Image style={{width:25,height:25,marginRight:10}} source={require('./img/ic_IPLimit_service.png')}/>
                    <CusBaseText style={{color:'#ff0000',fontSize:18}}>在线客服</CusBaseText>
                </TouchableOpacity>
            </View>
        );
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems:'center',
    },
    img:{
        marginTop:100,
        width:166/2,
        height:237/2,
    },
    title:{
        marginTop:15,
        fontSize:18,
        color:'#d81616',
    },
    desc:{
        marginTop:20,
        fontSize:13,
        color:'#8a8a8a',
        marginLeft: 55,
        marginRight: 55,
        textAlign:'center',
    },
    btn:{
        marginTop:40,
        width: 551/2,
        height: 86/2,
        borderWidth: 1,
        borderColor:'#ff0000',
        borderRadius:5,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor:'#ffe8e6',
        flexDirection: 'row',
    }
});

const IPLimitNav = StackNavigator(
    {
        IPLimit: { screen: IPLimit },
        ChatService: { screen: ChatService },
    },
);

export default IPLimitNav;