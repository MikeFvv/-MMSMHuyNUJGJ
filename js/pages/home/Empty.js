import React, { Component } from "react";
import {
    View,

} from "react-native";

export default class Empty extends Component {

    // 这里可以单独单独设置 属性
    static navigationOptions = ({ navigation, screenProps }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。

        tabBarOnPress: (({ route, index }, jumpToIndex) => {
            // 只有调用jumpToIndex方法之后才会真正的跳转页面
            jumpToIndex(index);
            // console.log(route);
            navigation.state.params && navigation.state.params.tabBarPress ? navigation.state.params.tabBarPress() : null;
        }),


    })

    render() {

        return (<View>

        </View>)
    }

}