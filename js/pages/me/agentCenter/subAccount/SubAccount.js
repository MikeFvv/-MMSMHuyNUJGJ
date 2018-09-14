
'use strict';

import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    StyleSheet
} from 'react-native';
import HeaderBar from '../../../../common/HeaderBar';
import RebateSetup from './RebateSetup';
import InvitedCodeManage from './InvitedCodeManage';
import DomainNameManage from './DomainNameManage';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';

export default class SubAccount extends Component {

    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({ navigation }) => ({

        header: (
            <CustomNavBar
                centerText = {navigation.state.params.title}
                leftClick={() =>  navigation.goBack() }
            />
        ),
    });

    constructor(props) {
        super(props)
    }

    //创建子页面
    _views() {

        let viewArr = []

        viewArr.push(<RebateSetup
            key={0}
            navigator={this.props.navigation}
            tabLabel='返点设置'
            style={styles.page1}
        />);
        viewArr.push(<InvitedCodeManage
            key={1}
            navigator={this.props.navigation}
            tabLabel='邀请码管理'
            style={styles.page2}
        />);
        viewArr.push(<DomainNameManage
            key={2}
            navigator={this.props.navigation}
            tabLabel='域名管理'
            style={styles.page3}
        />);

        return viewArr;
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#f3f3f3" }}>

                <ScrollableTabView
                    automaticallyAdjustContentInsets={false}
                    alwaysBounceHorizontal={false}
                    renderTabBar={() =>
                        <DefaultTabBar
                            style={{ height: 40 }}
                            tabStyle={{ paddingBottom: 0 }}
                            backgroundColor='rgba(255, 255, 255, 0.7)'
                            activeTextColor={COLORS.appColor}
                            underlineStyle={{ backgroundColor: COLORS.appColor}}
                            textStyle={{ fontSize: 16 }}
                        />
                    }
                    tabBarPosition='top'
                >
                    {this._views()}

                </ScrollableTabView>

            </View >
        )
    }

}


const styles = StyleSheet.create({

    container: {
        flex: 1
    },

    switchView: {
        backgroundColor: 'white',
        height: 100,
    },

    errorView: {
        height: SCREEN_HEIGHT - 100,
        justifyContent: 'center',
        alignItems: 'center'
    },

    errorText: {
        color: 'red',
        fontSize: 20,
    },

    page1: {
        backgroundColor: 'white',
    },

    page2: {
        backgroundColor: 'white',
    },

    page3: {
        backgroundColor: 'white',
    },

});