/**
 * Created by Allen on 2018/02/16.
 *
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    Animated,
    Easing,
} from 'react-native';

let { height, width } = Dimensions.get('window');



// 自定义Header，覆盖系统提供的
export default class NavStyle extends Component {

    static defaultProps = {
        backgroundColor: 'white',
        fontSize: '18',
    };

    constructor(props) {
        super(props);

    }

    componentDidMount () {


    }

    animate () {


    }

    _createLeftNavView(){

            return (<TouchableOpacity style={{marginTop:0,padding:20}} activeOpacity={0.5}
                                      onPress = {() => this.props.leftClick()}><View style={[styles.nav_headerLeft_view,{  marginTop:height == 812?56:34,}]}  ></View></TouchableOpacity>)

    }

    render() {

        let  imageName = null;

        if (SCREEN_HEIGHT == 812)
        {
            imageName = require('./img/navbarX.png');
        }
        else
        {
            imageName = require('./img/navbar6sp.png');
        }
        imageName = null;

        return (
            <View style={[styles.container, { backgroundColor: COLORS.appColor }]}>

                {/*左边返回*/}
                <Image style={{width:SCREEN_WIDTH,height:(SCREEN_HEIGHT == 812 ? 88:64),position:'absolute',left:0, top:0}} source={imageName}/>
                {this._createLeftNavView()}
                
                {/*中间标题或者view*/}
                {this.props.centerText ? <CusBaseText style={[styles.imageLogoStyle]} adjustFontSizeToFit={true}>
                {this.props.centerText? this.props.centerText:''}
                </CusBaseText>:this.props.centerView}

                {/*右边View*/}
                {this.props.rightView ? this.props.rightView :null}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: height == 812 ? 88 : 64,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    leftStyle: {
        position:'absolute',
        top:18,
        left:20,
        paddingLeft: 15,
        width: 10,

        resizeMode: 'contain'
    },
    rightStyle: {
        // backgroundColor: 'yellow',
        marginTop: height == 812 ? 44 : 20,
        paddingRight: 10,
        // marginRight: 15,
        // alignItems: 'flex-end',
        // justifyContent: 'flex-end',
        alignSelf: 'center',
        textAlign: 'right',
        color: 'white',
        fontSize: 18,
        width: (width - 180) / 2,
    },
    // 1 cover 等比拉伸
    // 2 stretch 保持原有大小
    // 3 contain  图片拉伸  充满空间
    imageLogoStyle: {
        backgroundColor: 'transparent',
        position:'absolute',
        left:width/2.0-75,
        marginTop: height == 812 ? 54 : 30,
        width: 150,
        fontSize:18,

    color:'white',

        textAlign:'center'
    },

    nav_headerLeft_view: {
        width: 15,
        height: 15,
        borderColor: '#fff',
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        transform: [{ rotate: '45deg' }],
        position:'absolute',

        left:13,
        paddingLeft: 15,
        width: 10,
    },


});

