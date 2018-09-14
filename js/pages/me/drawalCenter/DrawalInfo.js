'use strict';
import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
    Image,
    TextInput,
} from 'react-native';

import Regex from '../../../skframework/component/Regex';
import DrawalSelectBankList from './DrawalSelectBankList';

const itemHeight = 45;

export default class DrawalInfo extends Component {

    static navigationOptions = ({ navigation }) => ({

        header: (
            <CustomNavBar
                centerText={"提 款"}
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
                        onPress={() => navigation.state.params.navigateRightPress()}>
                        <CusBaseText style={{
                            color: 'white',
                            fontSize: 16,
                            backgroundColor: 'transparent',
                        }}>提款记录</CusBaseText>
                    </TouchableOpacity>
                )}
            />
        ),

    });

    constructor(props) {
        super(props);

        this.state = {
            resultObject: null,
            visible: false,
            bankItem: null,
        };

        this.loginObject = null;
        this.drawalMoney = '';
        this.accountPwd = '';
    }

    componentDidMount() {

        //记住提款界面的key 成功后跳转
        global.DrawalinfoViewControllerKey = this.props.navigation.state.key;

        this.props.navigation.setParams({
            navigateRightPress: this._navigateRightPress,
        });
        this.loginObject = global.UserLoginObject;
        this._fetchData();
    }


    /**
     *  点击事件 提款记录
     * @private
     */
    _navigateRightPress = () => {
        const { navigate } = this.props.navigation;
        navigate('BuyRecord', { title: '提款记录' });
    }

    _fetchData() {

        this.refs.LoadingView && this.refs.LoadingView.showLoading('正在加载…');

        let params = new FormData();
        params.append("ac", "getTkPriceWhere");
        params.append("uid", this.loginObject.Uid);
        params.append("token", this.loginObject.Token);
        params.append("sessionkey", this.loginObject.session_key);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                if (responseData.msg == 0) {

                    this.refs.LoadingView && this.refs.LoadingView.cancer();
                    let bankID = `${responseData.data.bink_id}`;
                    let bankItemObject = null;

                    if (responseData.data.banklist){

                        for (let i = 0 ; i < responseData.data.banklist.length; i++){

                            let bankModel = responseData.data.banklist[i];

                            if (bankID == bankModel.id){
                                bankItemObject = bankModel; //拿到目前默认银行卡的Item
                                break;
                            }
                        }
                    }

                    this.setState({
                        resultObject: responseData.data,
                        bankItem: bankItemObject ? bankItemObject : null,
                    });

                } else {

                    //余额不足不能进入提款界面
                    if (responseData.param) {
                        this.refs.LoadingView && this.refs.LoadingView.showFaile(responseData.param);
                    }

                    setTimeout(() => {

                    }, 1000);
                }

            })
            .catch((err) => {
                if (err && typeof (err) === 'string' && err.length > 0) {
                    this.refs.LoadingView && this.refs.LoadingView.showFaile(err);
                }
            })
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <ScrollView
                    style={styles.container}
                    automaticallyAdjustContentInsets={false}
                    alwaysBounceHorizontal={false}
                    showsVerticalScrollIndicator={false}
                    keyboardDismissMode={global.iOS ? 'on-drag' : 'none'}
                >

                    <View style={styles.blankLineViewStyle}></View>
                    <View style={styles.topView}>
                        <CusBaseText style={styles.prexStyle}>收款姓名</CusBaseText>
                        <CusBaseText style={styles.prexStyle}>{this.state.resultObject ? this.state.resultObject.real_name : ''}</CusBaseText>
                    </View>
                    <View style={styles.topView}>
                        <CusBaseText style={styles.prexStyle}>账户余额</CusBaseText>
                        <CusBaseText style={styles.prexStyle}>￥{this.state.resultObject ? this.state.resultObject.price : ''}</CusBaseText>
                    </View>

                    <View style={styles.blankLineViewStyle}></View>

                    <View style={styles.consuView}>
                        <CusBaseText style={styles.prexStyle}>消费比例</CusBaseText>

                        <View style={styles.consumptionViewStyle}>
                            <View style={styles.consuItemView}>
                                <CusBaseText style={styles.consuPrex}>提款需达投注量：</CusBaseText>
                                <CusBaseText style={styles.consuPrexCentent}>{this.state.resultObject ? this.state.resultObject.price_rq : ''}</CusBaseText>
                            </View>

                            <View style={styles.consuItemView}>
                                <CusBaseText style={styles.consuPrex}>已达投注量：</CusBaseText>
                                <CusBaseText style={styles.consuPrexCentent}>{this.state.resultObject ? this.state.resultObject.tz_count : ''}</CusBaseText>
                            </View>
                        </View>

                        <View style={styles.consumptionViewStyle}>
                            <View style={styles.consuItemView}>
                                <CusBaseText style={styles.consuPrex}>是否可以提款：</CusBaseText>
                                <CusBaseText style={styles.consuPrexCentent}>{this.state.resultObject ? (this.state.resultObject.tk_where == 0 ? '否' : '是') : ''}</CusBaseText>
                            </View>

                            <View style={styles.consuItemView}>
                                <CusBaseText style={styles.consuPrex}>手续费：</CusBaseText>
                                <CusBaseText style={styles.consuPrexCentent}>今日还可免费<CusBaseText style={[styles.consuPrex, { color: 'red' }]}>{this.state.resultObject ? this.state.resultObject.price_fee_count : ''}</CusBaseText>次</CusBaseText>
                            </View>
                        </View>

                    </View>

                    <View style={styles.blankLineViewStyle}></View>

                    <View style={styles.accountView}>
                        <View style={styles.accountItemView}>
                            <CusBaseText style={styles.prexStyle}>收款银行：</CusBaseText>


                            <TouchableOpacity
                                style={styles.selectBank}
                                activeOpacity={1}
                                onPress={() => {
                                    this.setState({
                                        visible: true,
                                    });
                                }}
                            >
                                <View style={styles.bankNameViewStyle}>
                                    <CusBaseText style={styles.prexStyle}>{this.state.bankItem ? (this.state.bankItem.bank_typename) : ''}</CusBaseText>
                                    <Image style={{ width: 15, height: 15, marginLeft: 20, }} source={require('./img/ic_bankjiantou.png')} />
                                </View>
                            </TouchableOpacity>

                        </View>
                        <View style={styles.accountItemView}>
                            <CusBaseText style={styles.prexStyle}>收款账号：</CusBaseText>
                            <CusBaseText style={styles.prexStyle}>{this.state.bankItem ? this.state.bankItem.card : ''}</CusBaseText>
                        </View>
                        <View style={styles.accountItemView}>
                            <CusBaseText style={styles.prexStyle}>提款金额：</CusBaseText>
                            <TextInput
                                returnKeyType="done"
                                underlineColorAndroid='transparent'
                                style={styles.value}
                                placeholder={`最少提款金额为${this.state.resultObject ? this.state.resultObject.min_take : 0}元`}
                                keyboardType={global.iOS ? 'number-pad' : 'numeric'}
                                onChangeText={(text) => this.drawalMoney = text}
                            >
                            </TextInput>
                        </View>
                        <View style={styles.accountItemView}>
                            <CusBaseText style={styles.prexStyle}>交易密码：</CusBaseText>
                            <TextInput
                                returnKeyType="done"
                                underlineColorAndroid='transparent'
                                style={styles.value}
                                placeholder='请输入4位交易密码'
                                keyboardType={global.iOS ? 'number-pad' : 'numeric'}
                                maxLength={4}
                                secureTextEntry={true}
                                onChangeText={(text) => this.accountPwd = text}
                            ></TextInput>
                        </View>
                    </View>

                    <View style={styles.costStateView}>
                        <CusBaseText style={styles.tikuanStyle}>提款手续费：</CusBaseText>
                        <CusBaseText style={styles.costStateText}>{this.state.resultObject ? this._calServiceChargeString() : ''}</CusBaseText>
                    </View>

                    <TouchableOpacity
                        style={styles.btn}
                        activeOpacity={0.7}
                        onPress={() => { this._confirmClicked() }}
                    >
                        <CusBaseText style={styles.btnText}>确认</CusBaseText>
                    </TouchableOpacity>
                    <DrawalSelectBankList
                        dataSource={this.state.resultObject ? this.state.resultObject.banklist : []}
                        visible={this.state.visible}
                        onCancel={() => {
                            this.setState({
                                visible: false,
                            });
                        }}
                        onPress={(item) => {
                            this.setState({
                                visible: false,
                                bankItem: item,
                            });
                        }}
                    />
                </ScrollView>
                <LoadingView ref="LoadingView" />
            </View>
        );
    }

    _calServiceChargeString = () => {

        let _xzTake = (Number.parseFloat || parseFloat)(this.state.resultObject.xz_take, 10).toFixed(2);
        let _getTake = (Number.parseFloat || parseFloat)(this.state.resultObject.get_take, 10).toFixed(2);
        let _youhuikouchu = (Number.parseFloat || parseFloat)(this.state.resultObject.youhui, 10).toFixed(2);
        let serviceCharge = parseFloat(_xzTake) + parseFloat(_getTake) + parseFloat(_youhuikouchu);

        let result = serviceCharge + '元' + '(行政费:' + _xzTake + '元' + '+手续费:' + _getTake + '元' + '+扣除:' + _youhuikouchu + '元)';
        return result;
    }

    _calServiceCharge = () => {

        let _xzTake = this.state.resultObject.xz_take;
        let _getTake = this.state.resultObject.get_take;
        let _youhuikouchu = this.state.resultObject.youhui;
        let serviceCharge = parseFloat(_xzTake) + parseFloat(_getTake) + parseFloat(_youhuikouchu);

        return serviceCharge;
    }

    _confirmClicked = () => {

        if (!this.state.resultObject) {
            this.refs.LoadingView && this.refs.LoadingView.showFaile('提款信息不完善');
            return;
        }

        if (global_isSpace(this.drawalMoney) || this.drawalMoney.trim().length == 0) {
            this.refs.LoadingView && this.refs.LoadingView.showFaile('请输入提款金额');
            return;
        }

        if (!Regex(this.drawalMoney, "money")) {
            this.refs.LoadingView && this.refs.LoadingView.showFaile('请输入合法金额');
            return;
        }

        if (parseFloat(this.drawalMoney) < parseFloat(this.state.resultObject.min_take)) {
            let tip = '最小提款金额不能低于' + this.state.resultObject.min_take + '元';
            Alert.alert(tip);
            return;
        }

        if (parseFloat(this.drawalMoney) > parseFloat(this.state.resultObject.max_take)) {
            let tip = '最大提款金额不能高于' + this.state.resultObject.max_take + '元';
            Alert.alert(tip);
            return;
        }

        if (global_isSpace(this.accountPwd) || this.accountPwd.length < 4) {
            this.refs.LoadingView && this.refs.LoadingView.showFaile('请输入4位交易密码');
            return;
        }

        let serviceCharge = this._calServiceCharge();

        if ((parseFloat(this.drawalMoney) - serviceCharge) <= 0) {
            Alert.alert('提款金额小于提款手续费，您无法提款');
            return;
        }

        let title = '此次提款需要扣除手续费:' + serviceCharge + '元,最终将获得' + (parseFloat(this.drawalMoney) - serviceCharge) + '元,您确定需要提款吗?';

        Alert.alert(
            '提示',
            title,
            [
                { text: '取消', onPress: () => { } },
                {
                    text: '确定', onPress: () => {
                        this._drawalApply();
                    }
                },
            ]
        );
    }

    _drawalApply = () => {

        this.refs.LoadingView && this.refs.LoadingView.showLoading('loading');

        let params = new FormData();
        params.append("ac", "getTkPrice");
        params.append("uid", this.loginObject.Uid);
        params.append("token", this.loginObject.Token);
        params.append("price", this.drawalMoney.trim());
        params.append("tk_pass", this.accountPwd.trim());
        params.append("bankid", this.state.bankItem.id);
        params.append("sessionkey", this.loginObject.session_key);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                if (responseData.msg == 0) {
                    this.refs.LoadingView && this.refs.LoadingView.cancer();
                    this.props.navigation.navigate('DrawalSubmit', { drawalNumber: this.drawalMoney });
                } else {
                    this.refs.LoadingView && this.refs.LoadingView.showFaile(responseData.param);
                }

            })
            .catch((err) => {
                if (err && typeof (err) === 'string' && err.length > 0) {
                    this.refs.LoadingView && this.refs.LoadingView.showFaile(err);
                }
            })
    }

}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
        marginBottom: 20,
    },

    topView: {
        marginLeft: 10,
        marginRight: 10,
        borderColor: '#ccc',
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 42,
    },

    prexStyle: {
        fontSize: 17,
        color: '#272829',
    },

    consuView: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
    },

    consuTip: {
        fontSize: 17,
        fontWeight: 'bold',
    },

    consuItemView: {
        flexDirection: 'row',
    },

    consumptionViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },

    bankNameViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        marginRight: 20,
    },

    consuPrex: {
        color: '#838485',
        fontSize: 15,
    },
    consuPrexContent: {
        color: '#000000',
        fontSize: 15,
    },

    tikuanStyle: {
        color: '#000000',
        fontSize: 15,
    },


    accountView: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 20,
    },

    accountItemView: {
        borderColor: '#ccc',
        borderBottomWidth: 0.7,
        flexDirection: 'row',
        height: itemHeight,
        alignItems: 'center',
    },



    costStateView: {
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'row',
        marginBottom: 15,
    },

    costStateText: {
        fontSize: 15,
        color: 'red',
        flex: 1,
    },

    btn: {
        marginTop: 20,
        borderRadius: 5,
        backgroundColor: COLORS.appColor,
        height: itemHeight,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 30,
        marginRight: 30,
    },

    btnText: {
        color: 'white',
        fontSize: 16,
    },

    selectBank: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: itemHeight,
    },

    value: {
        padding: 0,
        flex: 1,
        fontSize: 14,
        height: itemHeight,
    },

    blankLineViewStyle: {
        height: 12,
        backgroundColor: '#f0f1f2',
    },



});

