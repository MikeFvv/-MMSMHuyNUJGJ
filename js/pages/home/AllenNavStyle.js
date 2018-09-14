/**
 * Created by Allen on 2018/02/16.
 *
 */

import React, {Component} from 'react';
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
import Colors from "../../skframework/component/Colors";

let {height, width} = Dimensions.get('window');


// 自定义Header，覆盖系统提供的
export default class NavStyle extends Component {

    static defaultProps = {
        backgroundColor: 'white',
        fontSize: '18',
    };

    constructor(props) {
        super(props);
        this.state = {
            whichType: 1
        }

    }

    componentDidMount() {


    }

    animate() {


    }

    _createLeftNavView() {

        return (<TouchableOpacity style={{marginTop: 0, padding: 20}} activeOpacity={0.5}
                                  onPress={() => this.props.leftClick()}><View
            style={[styles.nav_headerLeft_view, {marginTop: height == 812 ? 56 : 34,}]}></View></TouchableOpacity>)

    }

    render() {

        let imageName = null;

        if (SCREEN_HEIGHT == 812) {
            imageName = require('./img/navbarX.png');
        }
        else {
            imageName = require('./img/navbar6sp.png');
        }
        imageName = null;

        return this.props.threeView ? (<View style={[styles.container, {backgroundColor: Colors.appColor}]}>

            {/*左边返回*/}
            <Image style={{
                width: SCREEN_WIDTH,
                height: (SCREEN_HEIGHT == 812 ? 88 : 64),
                position: 'absolute',
                left: 0,
                top: 0
            }} source={imageName}/>
            {this._createLeftNavView()}

            {/*中间标题或者view*/}
            {this.props.centerText ? <View style={[styles.imageLogoStyle2, {
                height: 35,width:219, marginTop: height == 812?41:22, backgroundColor: 'transparent',
                flexDirection:
                    'row',
                alignItems: 'center',
                justifyContent:
                    'center',
                borderRadius:5,
                borderWidth:2,
                borderColor:'white'
            }]}><TouchableOpacity onPress={()=>{this.props.centerTextscallback[0]();this.setState({whichType:1});}} activeOpacity={0.7} style={{backgroundColor:this.state.whichType == 1?'white':Colors.appColor,height:31,width:73, alignItems: 'center',
                justifyContent:
                    'center'}}><CusBaseText
                style={{color:this.state.whichType == 1?Colors.appColor:'white',fontSize:15,fontWeight:'700'}} adjustFontSizeToFit={true}>
                {this.props.centerTexts ? this.props.centerTexts[0] : ''}
            </CusBaseText></TouchableOpacity><TouchableOpacity onPress={()=>{this.props.centerTextscallback[1]();this.setState({whichType:2});}} activeOpacity={0.7} style={{borderLeftWidth:2,borderRightWidth:2,borderColor:'white',backgroundColor:this.state.whichType == 2?'white':Colors.appColor,height:31,width:73, alignItems: 'center',
                justifyContent:
                    'center'}}><CusBaseText
                style={{color:this.state.whichType == 2?Colors.appColor:'white',fontSize:15,fontWeight:'700'}} adjustFontSizeToFit={true}>
                {this.props.centerTexts ? this.props.centerTexts[1] : ''}
            </CusBaseText></TouchableOpacity><TouchableOpacity onPress={()=>{this.props.centerTextscallback[2]();this.setState({whichType:3});}} activeOpacity={0.7} style={{backgroundColor:this.state.whichType == 3?'white':Colors.appColor,height:31,width:69, alignItems: 'center',
                justifyContent:
                    'center'}}><CusBaseText
                style={{color:this.state.whichType == 3?Colors.appColor:'white',fontSize:15,fontWeight:'700'}} adjustFontSizeToFit={true}>
                {this.props.centerTexts ? this.props.centerTexts[2] : ''}
            </CusBaseText></TouchableOpacity></View> : this.props.centerView}

            {/*右边View*/}
            {this.props.rightView ? this.props.rightView : null}

        </View>) : (
            <View style={[styles.container, {backgroundColor: COLORS.appColor}]}>

                {/*左边返回*/}
                <Image style={{
                    width: SCREEN_WIDTH,
                    height: (SCREEN_HEIGHT == 812 ? 88 : 64),
                    position: 'absolute',
                    left: 0,
                    top: 0
                }} source={imageName}/>
                {this._createLeftNavView()}

                {/*中间标题或者view*/}
                {this.props.centerText ? <CusBaseText style={[styles.imageLogoStyle]} adjustFontSizeToFit={true}>
                    {this.props.centerText ? this.props.centerText : ''}
                </CusBaseText> : this.props.centerView}

                {/*右边View*/}
                {this.props.rightView ? this.props.rightView : null}

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
        position: 'absolute',
        top: 18,
        left: 20,
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
        position: 'absolute',
        left: width / 2.0 - 75,
        marginTop: height == 812 ? 54 : 30,
        width: 150,
        fontSize: 18,

        color: 'white',

        textAlign: 'center'
    },

    imageLogoStyle2: {
        backgroundColor: 'transparent',
        position: 'absolute',
        left: width / 2.0 - 100,
        marginTop: height == 812 ? 54 : 30,
        width: 150,
        fontSize: 18,

        color: 'white',

        textAlign: 'center'
    },

    nav_headerLeft_view: {
        width: 15,
        height: 15,
        borderColor: '#fff',
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        transform: [{rotate: '45deg'}],
        position: 'absolute',

        left: 13,
        paddingLeft: 15,
        width: 10,
    },


});

