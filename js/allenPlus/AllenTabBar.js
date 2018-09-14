/**
 * Created by Allen on 2018/2/01.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    NativeModules,
    ImageBackground,
    DeviceEventEmitter,
    Dimensions,
    PixelRatio,
    Image
} from 'react-native';
import LocalImg from "../res/img";
import AllenCircularView from './AllenCircularView';
import HomeYinDao from '../pages/home/HomeYinDaoView';

export const deviceWidth = Dimensions.get('window').width;      //设备的宽度
export const deviceHeight = Dimensions.get('window').height;    //设备的高度

const defaultPixel = 2;
const defaultW = Platform.OS ==='ios'?750:720;
const defaultH = Platform.OS ==='ios'?1334:1280;
const w2 = defaultW / defaultPixel;
const h2 = defaultH / defaultPixel;
const scale = Math.min(deviceHeight / h2, deviceWidth / w2);   //获取缩放比例



 function setSpText(size: number) {
    // size = size/pixelRatio;
    // size = Math.round((size * scale + 0.5) * pixelRatio / fontScale);
    return size;
}

//noinspection JSAnnotator
 function scaleSize(size: number) {
    size = Math.round(size * scale + 0.5);
    return size / defaultPixel;
}

global.FONT = setSpText;

global.SCALE = scaleSize;

global.WIDTH = deviceWidth;

global.HEIGHT = deviceHeight;




export default class Tab extends Component {
    renderItem = (route, index) => {
        const {
            navigation,
            jumpToIndex,
        } = this.props;

        const focused = index === navigation.state.index;
        const color = focused ? this.props.activeTintColor : this.props.inactiveTintColor;
        let TabScene = {
            focused:focused,
            route:route,
            tintColor:color
        };

        if(index==2){
            return (<View
                    key={route.key}
                    style={[styles.tabItem,{backgroundColor:'transparent'}]}>
                    </View>
            );
        }

        return (
            <TouchableOpacity
                activeOpacity={1.0}
                key={route.key}
                style={styles.tabItem}
                onPress={() => jumpToIndex(index)}
            >
                <View
                    style={styles.tabItem}>
                    {this.props.renderIcon(TabScene)}
                    <Text style={{ ...styles.tabText,marginTop:SCALE(10),color }}>{this.props.getLabel(TabScene)}</Text>
                </View>
            </TouchableOpacity>
        );
    };
  
    render(){
        let iphoneX = global.iOS ? (SCREEN_HEIGHT == 812 ? true : false) : 0; //是否是iphoneX
        const {navigation,jumpToIndex} = this.props;
        const {routes,} = navigation.state;
        const focused = 1 === navigation.state.index;
        HomeIndex = navigation.state.index;
        // if(navigation.state.index==0||navigation.state.index==4){
        //     PushNotification.emit('ShuaXinJinEr');
        // }
        const color = focused ? this.props.activeTintColor : this.props.inactiveTintColor;
        let TabScene = {
            focused:focused,
            route:routes[2],
            tintColor:color
        };
        return (<View style={{width:WIDTH,backgroundColor:'#f3f3f3',paddingBottom:iphoneX?34:0}}>
            <View style={{backgroundColor:'#f3f3f3', width:WIDTH,height:0.3}}></View>
            <View style={styles.tab}>
                {routes && routes.map((route,index) => this.renderItem(route, index))}
            </View>
            <AllenCircularView navigation={navigation}/>
          {/* //  {navigation.state.index==0?<HomeYinDao></HomeYinDao>:null} */}
        </View>);
    }
}
const styles = {
    tab:{
        width:WIDTH,
        backgroundColor:'transparent',
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'flex-end',
        backgroundColor:'#f3f3f3',

    },
    tabItem:{
        height:49,
        width:SCALE(100),
        alignItems:'center',
        justifyContent:'center',
    },
    tabText:{

        fontSize:13,
        color:'red'
    },
    tabTextChoose:{

    },
    tabImage:{

    },
}