
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    WebView
} from 'react-native';

import DrawalSelectBankList from '../../drawalCenter/DrawalSelectBankList';
import BaseNetwork from "../../../../skframework/component/BaseNetwork";
import createInvoke from 'react-native-webview-invoke/native'

const KAdaptionWidth = SCREEN_WIDTH / 414;
const KAdaptionHeight = SCREEN_HEIGHT / 736;

export default class RebateOddsTable extends Component {

    webview: WebView
    invoke = createInvoke(() => this.webview)

    webWannaSet = (data) => {
        alert(`[Receive From Web] '${data}'`)
    }

    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({ navigation }) => ({

        header: (
            <CustomNavBar
                centerText={'返点赔率表'}
                leftClick={() => navigation.goBack()}
                rightView={(
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{
                            flexDirection: 'row',
                            height: 30,
                            width: 85,
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            marginRight: 10,
                            marginTop: SCREEN_HEIGHT == 812 ? 50 : 30,
                        }}
                        onPress={() => navigation.state.params.navigateRightPress(navigation)}>
                        <CusBaseText style={{
                            color: 'white',
                            fontSize: 14,
                            backgroundColor: 'transparent',
                        }}>{navigation.state.params.storageLotType ? navigation.state.params.storageLotType.name : '时时彩'}</CusBaseText>
                        <Image style={{ width: 15, height: 18, marginLeft: 5, }}
                            source={require('../../../home/img/ic_xiangxia.png')} />
                    </TouchableOpacity>
                )}
            />
        ),

    });

    constructor(props) {

        super(props);
        this.allDataArray = [];
        this.isCurrentWebData = false;
        this.state = {
            storageLotType: null,
            visible: false,
            isNoData: false,  // 无数据
            lotTypeList: [
                { 'id': 1, 'name': '时时彩', "type": "ssc" },
                { 'id': 2, 'name': 'PK拾', "type": "pk10" },
                { 'id': 3, 'name': '快3', "type": 'k3' },
                { 'id': 4, 'name': '11选5', 'type': '11x5' },
                { 'id': 5, 'name': 'PC蛋蛋', 'type': 'pcdd' },
                { 'id': 6, 'name': '3D', 'type': '3d' },
                { 'id': 7, 'name': '六合彩', 'type': 'lhc' },
                { 'id': 8, 'name': '经典梯子', 'type': 'tzyx' },
                { 'id': 9, 'name': '幸运农场', 'type': 'xync' },
                { 'id': 10, 'name': 'PK拾牛牛', 'type': 'pkniuniu' },
                { 'id': 11, 'name': '幸运扑克', 'type': 'xypk' },
                { 'id': 12, 'name': '七星彩', "type": 'qxc'},
                 // { 'id': 8, 'name': '其他', 'type': 'other' },
            ],

        }
    }

    _navigateRightPress = (navigate) => {
        this.setState({
            visible: true,
        });
    }


    //无数据页面
    listEmptyComponent() {
        return (
            <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
                <Image resizeMode={'stretch'} style={{ width: 60 * KAdaptionWidth, height: 50 * KAdaptionHeight }} source={require('../../../home/img/ic_noData.png')} />
                <Text style={{ textAlign: 'center', marginTop: 5 }}>暂无数据</Text>
            </View>
        );
    }


    /**
     * 获取网络数据
     * @private
     */
    _fetchTableData = (type) => {
        this.refs.LoadingView && this.refs.LoadingView.showLoading('正在加载数据...');

        this.allDataArray = [];
        let params = new FormData();
        params.append("ac", "getFPInfoBy0");
        params.append("tag", type);
        params.append("uid", global.UserLoginObject.Uid);
        params.append("token", global.UserLoginObject.Token);
        params.append('sessionkey', global.UserLoginObject.session_key);

        var promise = BaseNetwork.sendNetworkTabelRequest(params);
        promise.then(response => {
            this.refs.LoadingView && this.refs.LoadingView.cancer(1);
            // console.log(this.allDataArray);

            if (response.msg == 0) {
                this.isCurrentWebData = true;
                this.allDataArray = response.data;

                if (typeof (this.allDataArray) == "undefined") {
                    this.setState({
                        isNoData: true,
                    });

                } else {
                    this.setState({
                        isNoData: false,
                    });
                    this.webview.postMessage(JSON.stringify(this.allDataArray))

                }
            } else {
                this.refs.LoadingView && this.refs.LoadingView.showFaile(response.param);
            }

        }).catch((error) => {
            this.refs.LoadingView && this.refs.LoadingView.cancer();
        })
    }

    componentDidMount() {
        this.props.navigation.setParams({
            navigateRightPress: this._navigateRightPress,
            storageLotType: this.state.lotTypeList[0],
        });

        this.invoke
            .define('set', this.webWannaSet)

        setTimeout(() => {
            this._fetchTableData('ssc');
        }, 1000);  // 延时1s取数据

        // this.webview.postMessage(JSON.stringify(this.props.navigation.state.params.allDataArray))
    }

    webWannaGet = () => this.isCurrentWebData ? JSON.stringify(this.allDataArray) : JSON.stringify(this.props.navigation.state.params.allDataArray);

    render() {
        var source_html = Android ? { uri: 'file:///android_asset/html/ROTable.html' } : require('./html/ROTable.html');
        return (
            <View style={{ flex: 1 }}>
                <WebView ref={w => this.webview = w}
                    source={source_html}
                >
                </WebView>

                {this.state.isNoData ? this.listEmptyComponent() : null}

                {this.state.visible ? this.initWindonsPopup() : null}
                <LoadingView ref='LoadingView' />
            </View>
        );
    }

    /**
     * 初始化弹窗
     * @returns {XML}
     */
    initWindonsPopup = () => {
        return <DrawalSelectBankList
            dataSource={this.state.lotTypeList}
            visible={this.state.visible}
            onCancel={() => {
                this.setState({
                    visible: false,
                });
            }}
            onPress={(item) => {
                this.setState({
                    visible: false,
                });
                this.props.navigation.setParams({
                    storageLotType: item,
                });

                this._fetchTableData(item.type);

            }}
        />
    }

}

const styles = StyleSheet.create({

    itemStyle: {
        width: SCREEN_WIDTH / 3 - 10,
        height: 40,
        borderColor: '#DBDBDB',
        justifyContent: 'center',
        alignItems: 'center',
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },

});
