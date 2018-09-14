
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions
} from 'react-native';

import LocalImages from "../../../publicconfig/images";
const { screenWidth, screenHeight } = Dimensions.get("window");

// 自定义Header，覆 盖系统提供的
export default class CustomNav extends Component {
    static defaultProps = {

    };
    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.navImage} source={LocalImages.ic_header_navback}>
                    <Text style={styles.leftStyle} onPress={() => this.props.leftClick()}>
                        注册
                    </Text>
                    <Text style={styles.leftStyle} onPress={() => this.props.leftClick()}>
                        登录
                    </Text>
                </Image>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 64,
        // backgroundColor: '#4ECBFC',
        flexDirection: 'row',
    },
    leftStyle: {
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    }, 
    navImage: {
        flex:1,
        height:64,
        width:screenWidth,
    },

});

