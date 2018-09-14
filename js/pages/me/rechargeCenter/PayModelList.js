'use strict';

import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
    Linking,
} from 'react-native';

import RechargeAmountView from './RechargeAmountView';
import Regex from '../../../skframework/component/Regex';

// 微信支付界面 支付宝 QQ支付 银联快捷
export default class PayModelList extends Component {

    static navigationOptions = ({ navigation }) => ({
        header: (
            <CustomNavBar
                centerText={navigation.state.params.title}
                leftClick={() => navigation.goBack()}
            />
        ),
    });

    constructor(props) {
        super(props);
        this.state = {
            renderAmount: 0,
            dataSource: [],
            totalMoney: '',
        };
        this.recharNumber = '';//充值金额
        this.lockReconnect = false;//避免重复连接
        this.reconnectCount = 0; //重连接次数,最大不超过30次
    }

    componentWillMount() {
        this.paytype = this.props.navigation.state.params.paytype;
        this.defaultTips = this.props.navigation.state.params.defaultTips;
        this.defaultSteps = this.props.navigation.state.params.defaultSteps;
    }

    componentDidMount() {
        this.loginObject = global.UserLoginObject;
        if (this.loginObject) {
            this._getPayDataByType();
            this._onRershRMB();
        }
    }

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }

    //刷新金额
    _onRershRMB() {
        let params = new FormData();
        params.append("ac", "flushPrice");
        params.append("uid", this.loginObject.Uid);
        params.append("token", this.loginObject.Token);
        params.append('sessionkey', this.loginObject.session_key);
        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then(response => {
                if (response.msg == 0) {
                    this.setState({
                        totalMoney: response.data.price,
                    });
                    this.loginObject.TotalMoney = response.data.price;
                    let loginStringValue = JSON.stringify(this.loginObject);
                    UserDefalts.setItem('userInfo', loginStringValue, (error) => { });
                }

            })
            .catch(err => { });
    }

    //获取相应支付接口的数据
    _getPayDataByType() {
        this.refs.LoadingView && this.refs.LoadingView.showLoading('loading');
        let params = new FormData();
        params.append("ac", "getPayDataByUtype");
        params.append("uid", this.loginObject.Uid);
        params.append('token', this.loginObject.Token);
        params.append('sessionkey', this.loginObject.session_key);
        params.append("type", this.paytype);
        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((response) => {
                if (response.msg != 0) {
                    this.refs.LoadingView && this.refs.LoadingView.showFaile(response.param);
                    return;
                }
                this.setState({
                    dataSource: response.data,
                });
            })
            .catch((err) => {
                if (err && typeof (err) === 'string' && err.length > 0) {
                    this.refs.LoadingView && this.refs.LoadingView.showFaile(err);
                }
            });
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.accountInfo}>
                    <View style={styles.account}>
                        <CusBaseText style={styles.namePrefix}>账号：</CusBaseText>
                        <CusBaseText style={styles.name}>{this.loginObject ? this.loginObject.UserName : null}</CusBaseText>
                    </View>
                    <View style={styles.account}>
                        <CusBaseText style={styles.namePrefix}>余额：</CusBaseText>
                        <CusBaseText style={styles.name}>{this.state.totalMoney}</CusBaseText>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                // this._onRershRMB()
                                this.refs.LoadingView && this.refs.LoadingView.showSuccess('刷新金额成功!');
                            }}
                        >
                            <Image
                                style={{height:30,width:30,marginLeft:15}}
                                source={require('./img/ic_shuaxin.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{backgroundColor:'white',}}>
                    <View style={styles.inputAmount}>
                        <CusBaseText style={styles.namePrefix}>充值金额：</CusBaseText>
                        <TextInput
                            returnKeyType="done"
                            underlineColorAndroid='transparent'
                            style={styles.inputText}
                            placeholder='请输入充值金额'
                            maxLength={10}
                            keyboardType='numeric'
                            defaultValue={this.state.renderAmount.toString()}
                            onChangeText={(text) => {
                                this.recharNumber = text;
                            }}
                        />
                        <CusBaseText style={styles.namePrefix}>元</CusBaseText>
                    </View>
                    <RechargeAmountView
                        style={{paddingTop:10,paddingBottom:10}}
                        selecteIndex={this.selecteIndex}
                        onPress={(value, rowID) => {
                            this.selecteIndex = rowID;
                            if (this.state.renderAmount == value) {
                                return;
                            }
                            this.recharNumber = value;
                            this.setState({
                                renderAmount: value,
                            });
                        }}
                        dataSource={[10,100,300,500,1000,3000,5000,10000]}
                    />
                </View>

                <View style={{ height: 40, flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>
                    <Image source={require('./img/ic_recharge_circle.png')} style={{ width: 20, height: 20 }} />
                    <CusBaseText style={{ color: '#565656', fontSize: 17, marginLeft: 10 }}>请选择支付渠道</CusBaseText>
                </View>

                <FlatList
                    automaticallyAdjustContentInsets={false}
                    alwaysBounceHorizontal={false}
                    data={this.state.dataSource}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={this._renderSeparator}
                    keyExtractor={this._keyExtractor}
                    showsVerticalScrollIndicator={false}
                    //extraData={this.state}
                />
                <LoadingView ref="LoadingView" />
            </View>
        );

    }

    _renderItem = (info) => {
        return (
            <PayModelCell
                paytype={this.paytype}
                item={info.item}
                defaultTips={this.defaultTips}
                onPress={this._onPress}
            />
        );
    }

    _renderSeparator = () => {
        return (<View style={styles.itemSeparator} />);
    }

    _keyExtractor = (item, index) => {
        return String(index);
    }

    // 检查输入金额
    _inspectInputAmount = () => {
        if (this.recharNumber.length <= 0) {
            this.refs.LoadingView && this.refs.LoadingView.showFaile('请输入充值金额');
            return false;
        }
        if (!Regex(this.recharNumber, "money")) {
            this.refs.LoadingView && this.refs.LoadingView.showFaile('请输入合法金额');
            return false;
        }
    }

    _onPress = (item) => {
        if (this._inspectInputAmount() == false) {
            return;
        }
        if (item.man == 1){ //直接跳
            this.props.navigation.navigate('RechargeInfo',
                {
                    payObject: item,
                    recharNumber: this.recharNumber,
                    defaultSteps:this.defaultSteps,
                    loginObject: this.loginObject,
                });
        }else {
            //第三方
            this._getThridData(item);
        }
    }

    _getThridData = (item) => {
        this.refs.LoadingView && this.refs.LoadingView.showLoading('loading');
        if (item.is_socket == 1) {
            this._createWebSocket(item);
            return;
        }else if (item.is_socket == 2) {
            this._request2(item);
            return;
        }
        let params = new FormData();
        params.append("ac", "submitPayThrid");
        params.append("uid", this.loginObject.Uid);
        params.append('token', this.loginObject.Token);
        params.append('sessionkey', this.loginObject.session_key);
        params.append("price", this.recharNumber);
        params.append("thrid_id", item.id);
        params.append("type", item.type);
        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((response) => {
                this._handThridData(response, item);
            })
            .catch((err) => {
                if (err && typeof (err) === 'string' && err.length > 0) {
                    this.refs.LoadingView && this.refs.LoadingView.showFaile(err);
                }
            })
    }

    _createWebSocket = (item) => {
        let ws = new WebSocket('ws://'+item.url);
        ws.onopen = () => {
            // connection opened
            console.log('send!!!!!!!!!!!!!!!!!!!!!!!!');
            let sendMsg = `{"data":"${item.socket_data}","price":${this.recharNumber}}`;
            ws.send(sendMsg); // send a message
        };
        ws.onmessage = (e) => {
            // a message was received
            console.log(e.data);
            ws.close();
            this._handThridData(JSON.parse(e.data),item);
        };
        ws.onerror = (e) => {
            // an error occurred
            console.log(e.message);
            this._reconnect(item);
        };
        ws.onclose = (e) => {
            // connection closed
            console.log(e.code, e.reason);
        };
    }

    //断线重连
    _reconnect = (item) => {
        if (this.reconnectCount > 30) {
            this.refs.LoadingView && this.refs.LoadingView.cancer();
            return;
        }
        if(this.lockReconnect) {
            return;
        }
        this.lockReconnect = true;
        this.reconnectCount += 1;
        //没连接上会一直重连，设置延迟2s避免请求过多
        this.timer = setTimeout(() => {
            this._createWebSocket(item);
            this.lockReconnect = false;
        }, 2000);
    }

    // is_socket = 2
    _request2 = (item) => {
        let params = new FormData();
        params.append("data", item.socket_data);
        params.append("price", this.recharNumber);
        fetch(item.url, {
            method: 'POST',
            headers: {'BXVIP-UA': 'ios'},
            body: params, // 参数
            timeout: 15, // 超时了
        })
            .then((responseData) => responseData.json())
            .then((response) => {
                this._handThridData(response,item);
            })
            .catch((err) => {});
    }

    _handThridData = (response, item) => {
        if (response.msg != 0) {
            this.refs.LoadingView && this.refs.LoadingView.showFaile(response.param);
            return;
        }
        this.refs.LoadingView && this.refs.LoadingView.cancer();
        let data = response.data;
        if (data.qrcode == 1) { //跳到web
            let urlString = '';
            if (data.method === 'post') {
                urlString = data.url;
                let body = data.data.replace(/>/g, '');
                if (data.brower && data.brower == 1) { //跳转外部浏览器
                    Linking.canOpenURL(urlString).then(supported => {
                        if(supported) {
                            Linking.openURL(urlString+'?'+body);
                        }
                    });
                }else { //跳转webview
                    this.props.navigation.navigate('ThridWebPay', { webUrl: urlString, method: data.method, body: body });
                }
            } else { //get
                if (data.data && data.data.length != 0) {
                    urlString = data.url + '?' + data.data.replace(/>/g, '');
                } else {
                    urlString = data.url;
                }
                if (data.brower && data.brower == 1) { //跳转外部浏览器
                    Linking.canOpenURL(urlString).then(supported => {
                        if(supported) {
                            Linking.openURL(urlString);
                        }
                    });
                }else {
                    this.props.navigation.navigate('ThridWebPay', { webUrl: urlString, method: data.method });
                }
            }
        } else { //跳到本地页
            item.orderNumber = data.dingdan;//订单号
            item.qrcode = data.url;//二维码链接
            this.props.navigation.navigate('RechargeInfo',
                {
                    payObject: item,
                    recharNumber: this.recharNumber,
                    defaultSteps:this.defaultSteps,
                    loginObject: this.loginObject,
                });
        }
    }
}

class PayModelCell extends Component {

    constructor(props) {
        super(props);
        this.dictImage = {
            "alipay.png": require('./img/ic_alipay.png'),
            "man_bank.png": require('./img/ic_man_bank.png'),
            "online_bank.png": require('./img/ic_online_bank.png'),
            "pay_icon_alipay.png": require('./img/ic_pay_icon_alipay.png'),
            "pay_icon_alipay2.png": require('./img/ic_pay_icon_alipay2.png'),
            "pay_icon_bankq.png": require('./img/ic_pay_icon_bankq.png'),
            "pay_icon_qq.png": require('./img/ic_pay_icon_qq.png'),
            "pay_icon_qq2.png": require('./img/ic_pay_icon_qq2.png'),
            "pay_icon_weixin.png": require('./img/ic_pay_icon_weixin.png'),
            "pay_icon_weixin2.png": require('./img/ic_pay_icon_weixin2.png'),
            "qq.png": require('./img/ic_qq.png'),
            "quick_bank.png": require('./img/ic_quick_bank.png'),
            "weixin.png": require('./img/ic_weixin.png'),

            "baidu.png": require('./img/ic_baidu.png'),
            "jd.png": require('./img/ic_jd.png'),
            "pay_icon_baidu.png": require('./img/ic_pay_icon_baidu.png'),
            "pay_icon_baidu2.png": require('./img/ic_pay_icon_baidu2.png'),
            "pay_icon_jd.png": require('./img/ic_pay_icon_jd.png'),
            "pay_icon_jd2.png": require('./img/ic_pay_icon_jd2.png'),
        };
    }

    render() {
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={styles.payCell}
                onPress={() => {
                    this.props.onPress ? this.props.onPress(this.props.item) : null;
                }}
            >
                <Image
                    style={styles.payImg}
                    source={this.dictImage[this.props.item.icon]}
                />
                <View style={styles.cellMid}>
                    <CusBaseText style={styles.modelName} numberOfLines={0}>{this.props.item.name ? this.props.item.name : ''}</CusBaseText>
                    <CusBaseText style={styles.modelDesc} numberOfLines={0}>{this._modelDesc(this.props.item)}</CusBaseText>
                </View>
                <Image
                    style={styles.payNextImg}
                    source={require('./img/ic_recharge_next.png')}
                />
            </TouchableOpacity>
        );
    }

    _modelDesc = (item) => {
        if (item.qrcode) { //main
            return item.tips ? item.tips : '';
        }
        //auto
        if (this.props.paytype == 3) {
            return item.tips ? item.tips : this.props.defaultTips.wx;
        } else if (this.props.paytype == 11) {
            return item.tips ? item.tips : this.props.defaultTips.qq;
        } else if (this.props.paytype == 5) {
            return item.tips ? item.tips : this.props.defaultTips.ali;
        }else if (this.props.paytype == 13) {
            return item.tips ? item.tips : this.props.defaultTips.bank;
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#f2f3f4',
    },
    //账户信息
    accountInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop:10,
        marginBottom:10,
        paddingLeft:10,
        paddingRight:10,
    },
    account: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    namePrefix: {
        fontSize: 16,
        color: 'rgb(110,110,110)',
    },
    name: {
        fontSize: 16,
        color: 'red',
    },
    inputAmount: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight:10,
    },
    inputText: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#f1f1f1',
        marginRight: 10,
        padding: 0,
        paddingLeft: 5,
        textAlign: 'center',
    },
    itemSeparator: {
        height: 1,
        backgroundColor: '#f0f1f2',
    },
    payCell: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft:15,
        paddingRight:15,
    },
    payImg: {
        width: 30,
        height: 30,
    },
    cellMid: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 15,
        marginRight:5,
    },
    modelName: {
        marginTop:10,
        fontSize:15,
        color: '#000000',
    },
    modelDesc: {
        marginTop:5,
        marginBottom:10,
        fontSize:13,
        color: 'rgb(163,163,163)',
    },
    payNextImg: {
        width: 15,
        height: 15,
    },
});