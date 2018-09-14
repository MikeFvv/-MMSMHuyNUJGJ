'use strict';

import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    FlatList,
} from 'react-native';

import PayModelList from './PayModelList';
import BankModelList from './BankModelList';
import OnlineModelList from './OnlineModelList';

export default class RechargeCenter extends Component {

    static navigationOptions = ({ navigation }) => ({

        header: (
            <CustomNavBar
                centerText={"充值"}
                leftClick={() => navigation.goBack()}
            />
        ),

    });

    constructor(props) {
        super(props);

        this.state = {
            payTypes: [],  //用户可用的支付的方式
        };

        this.loginObject = null;

        this.defaultTips = {
            wx: '',
            qq: '',
            ali:'',
            bank:'',
        };

        this.defaultSteps = {
            wx: '',
            qq: '',
            ali:'',
            bank:'',
        };

        this.dictImagePay = {
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

    componentDidMount() {

        this._readCache();

        this.loginObject = global.UserLoginObject;

        if (this.loginObject) {
            this._defaultTips();
            this._getPayTypeByUtype();
        }
    }

    //默认提示
    _defaultTips() {

        let params = new FormData();
        params.append("ac", "getDefaultTips");
        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then(response => {

                if (response.msg == 0) {

                    if (response.data) {

                        this.defaultTips = {
                            wx: response.data.weixin_tips ? response.data.weixin_tips : '',
                            qq: response.data.qq_tips ? response.data.qq_tips : '',
                            ali: response.data.alipay_tips ? response.data.alipay_tips : '',
                            bank: response.data.bank_tips ? response.data.bank_tips : '',
                        }

                        this.defaultSteps = {
                            wx: response.data.weixin_step ? response.data.weixin_step : '',
                            qq: response.data.qq_step ? response.data.qq_step : '',
                            ali: response.data.alipay_step ? response.data.alipay_step : '',
                            bank: response.data.bank_step ? response.data.bank_step : '',
                        };
                    }

                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    _readCache() {

        let key = 'AllPayTypes';
        UserDefalts.getItem(key, (error, result) => {

            if (error || !result) {
                return;
            }
            let payTypes = JSON.parse(result);
            payTypes && payTypes.length > 0 ? this.setState({ payTypes: payTypes }) : null;

        });
    }

    //用户可用的支付接口
    _getPayTypeByUtype() {

        this.refs.LoadingView && this.refs.LoadingView.showLoading('loading');

        let params = new FormData();
        params.append("ac", "getPayTypeByUtype");
        params.append("client_type", "3");
        params.append("uid", this.loginObject.Uid);
        params.append('token', this.loginObject.Token);
        params.append('sessionkey', this.loginObject.session_key);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((response) => {
                if (response.msg != 0) {
                    this.refs.LoadingView && this.refs.LoadingView.showFaile(response.param);
                    return;
                }
                let payTypes = response.data;
                payTypes ? this.setState({ payTypes: payTypes }) : null;
                if (payTypes && payTypes.length == 0){
                    this.refs.LoadingView && this.refs.LoadingView.showFaile('无可用支付方式');
                }
                //缓存所有数据
                let key = 'AllPayTypes';
                UserDefalts.setItem(key, JSON.stringify(payTypes), (error) => { });

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
                <FlatList
                    automaticallyAdjustContentInsets={false}
                    alwaysBounceHorizontal={false}
                    showsVerticalScrollIndicator={false}
                    data={this.state.payTypes}
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtractor}
                    ItemSeparatorComponent={this._renderSeparator}
                />
                <LoadingView ref="LoadingView" />
            </View>
        );
    }

    _renderItem = (info) => {
        return (
            <View>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.payModelCell}
                    onPress={() => {

                        if (info.item.id == 3) { //微信
                            this.props.navigation.navigate('PayModelList', { paytype: info.item.id, defaultTips: this.defaultTips, defaultSteps:this.defaultSteps,title: info.item.name});
                        } else if (info.item.id == 11) { //qq
                            this.props.navigation.navigate('PayModelList', { paytype: info.item.id, defaultTips: this.defaultTips, defaultSteps:this.defaultSteps,title: info.item.name});
                        } else if (info.item.id == 5) { //支付宝
                            this.props.navigation.navigate('PayModelList', { paytype: info.item.id, defaultTips: this.defaultTips, defaultSteps:this.defaultSteps,title: info.item.name});
                        } else if (info.item.id == 1) { //在线支付
                            this.props.navigation.navigate('OnlineModelList', { paytype: info.item.id, title: info.item.name});
                        } else if (info.item.id == 15) { //网银转账
                            this.props.navigation.navigate('BankModelList', { paytype: info.item.id, title: info.item.name});
                        } else if (info.item.id == 13) { //银联快捷
                            this.props.navigation.navigate('PayModelList', { paytype: info.item.id, defaultTips: this.defaultTips,defaultSteps:this.defaultSteps, title: info.item.name });
                        }else {
                            this.props.navigation.navigate('PayModelList', { paytype: info.item.id, title: info.item.name});
                        }

                    }}
                >
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>

                        <Image
                            style={styles.payModelImg}
                            source={this.dictImagePay[info.item.icon]}
                        />

                        <CusBaseText style={styles.payModelName}>{info.item.name ? info.item.name : null}</CusBaseText>
                    </View>
                    <Image
                        style={styles.payNextImg}
                        source={require('./img/ic_recharge_next.png')}
                    />

                </TouchableOpacity>
                <View style={styles.blankLineViewStyle}></View>
            </View>
        );
    }

    _renderSeparator = () => {
        return (<View style={styles.itemSeparator} />);
    }

    _keyExtractor = (item, index) => {
        return String(index);
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor:'#f2f3f4',
    },

    itemSeparator: {
        height: 12,
        backgroundColor: '#f0f1f2',
    },

    payModelCell: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
    },

    payModelImg: {
        marginLeft: 30,
        width: 30,
        height: 30,
        marginTop:10,
        marginBottom:10,
    },

    payModelName: {
        marginLeft: 15,
        fontSize: 17,
    },

    payNextImg: {
        marginRight: 15,
        width: 15,
        height: 15,
    },

});