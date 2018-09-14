/**
 Author kim
 Created by on 2017/10/9 0009
 dec 绘制虚线
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';

export default class DashLine extends Component {
    render() {
        var len = Math.ceil(SCREEN_WIDTH / 4);
        var arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(i);
        }

        return <View style={styles.dashLine}>
            {
                arr.map((item, index) => {
                    return <Text style={styles.dashItem} key={'dash' + index}> </Text>
                })
            }
        </View>
    }
}
const styles = StyleSheet.create({
    dashLine: {
        flexDirection: 'row',
        backgroundColor:'#DDDDDD'
    },
    dashItem: {
        height: 1,
        width: 2,
        marginRight: 2,
        flex: 1,
        backgroundColor: 'white',
    }
})