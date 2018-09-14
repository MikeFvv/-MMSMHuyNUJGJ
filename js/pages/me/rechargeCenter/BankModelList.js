'use strict';

import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
} from 'react-native';

import RechargeAmountView from './RechargeAmountView';
import Regex from '../../../skframework/component/Regex';
const rowHeight = 120;


// 银行转账界面
export default class BankModelList extends Component {

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
            dataSource: [],
            renderAmount: 0,
            totalMoney: '',
        };
        this.recharNumber = '';//充值金额
    }

    componentWillMount() {
        this.paytype = this.props.navigation.state.params.paytype;
    }

    componentDidMount() {
        this.loginObject = global.UserLoginObject;
        if (this.loginObject) {
            this._getPayDataByType();
            this._onRershRMB();
        }
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
        params.append("type", this.paytype);
        params.append("uid", this.loginObject.Uid);
        params.append('token', this.loginObject.Token);
        params.append('sessionkey', this.loginObject.session_key);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((response) => {
                console.log('response--->', response);

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
                    <View style={styles.balance}>
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

                <View style={styles.rechaAmount}>
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
                        <CusBaseText style={[styles.namePrefix, { marginRight: 15 }]}>元</CusBaseText>
                    </View>
                    <RechargeAmountView
                        style={styles.rechaAmountSelect}
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
                    // extraData={this.state}
                    ListFooterComponent={this._renderListFooter}
                />
                <LoadingView ref="LoadingView" />
            </View>
        );

    }

    _renderItem = (info) => {

        return (
            <BankModelCell
                style={styles.itemStyle}
                item={info.item}
                onPress={this._onPress}
            />

        );
    }

    _getItemLayout = (data, index) => {
        return { length: rowHeight, offset: (rowHeight + 1) * index, index: index }
    }

    _renderSeparator = () => {
        return (
            <View style={styles.itemSeparator} />
        );
    }

    _keyExtractor = (item, index) => {
        return String(index);
    }

    _renderListFooter = () => {
        return (
            <View style={styles.listFooter}>
                <CusBaseText style={styles.tipText}>每次存款前，请一定到网站获取最新入款消息</CusBaseText>
            </View>
        );
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

        this.props.navigation.navigate('BankTransferInfo',
            {
                bankItem: item,
                recharMoney: this.recharNumber,
            });
    }

}

class BankModelCell extends Component {

    render() {

        return (
            <TouchableOpacity
                style={{ borderBottomWidth: 1, borderColor: '#cccccc' }}
                activeOpacity={1}
                onPress={() => {
                    this.props.onPress ? this.props.onPress(this.props.item) : null;
                }}
            >
                <View style={styles.bankModelCell}>

                    <View style={styles.cellLeft}>
                        <View style={styles.textContainer}><CusBaseText style={styles.prex}>银行</CusBaseText></View>
                        <View style={styles.textContainer}><CusBaseText style={styles.prex}>收款人</CusBaseText></View>
                        <View style={styles.textContainer}><CusBaseText style={styles.prex}>汇款资讯</CusBaseText></View>
                    </View>

                    <View style={styles.cellMid}>
                        <View style={styles.textContainer}><CusBaseText style={styles.desc}>{this.props.item.bank_type}</CusBaseText></View>
                        <View style={styles.textContainer}><CusBaseText style={styles.desc}>{this.props.item.real_name}</CusBaseText></View>
                        <View style={styles.textContainer}><CusBaseText style={styles.desc}>{this.props.item.bank_home}</CusBaseText></View>
                    </View>

                    <View style={styles.cellRight}>
                        <Image
                            style={styles.selectImg}
                            source={require('./img/ic_recharge_more.png')}
                        />
                    </View>

                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    //账户信息
    accountInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: SCREEN_WIDTH,
        height: 45,
        backgroundColor: 'rgb(240,240,245)',
    },

    account: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },

    namePrefix: {
        fontSize: 16,
        color: '#4d4d4d',
    },

    name: {
        fontSize: 15,
        color: 'red',
    },

    balance: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },

    //充值金额
    rechaAmount: {
        backgroundColor: 'white',
    },

    rechaAmountSelect: {
        paddingTop: 10,
        paddingBottom: 10,
    },

    inputAmount: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingLeft: 10,
        alignItems: 'center',
        width: SCREEN_WIDTH,
        height: 40,
    },

    inputText: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#f1f1f1',
        marginRight: 10,
        padding: 0,
        paddingLeft: 5,
        height: 28,
        textAlign: 'center',
    },

    itemStyle: {
        backgroundColor: 'white',
    },

    itemSeparator: {
        backgroundColor: '#cccccc',
        width: SCREEN_WIDTH,
        height: 1,
    },

    listFooter: {
        width: SCREEN_WIDTH,
        alignItems: 'center',
    },

    tipText: {
        marginTop: 10,
        fontSize: 15,
    },

    bankModelCell: {
        flexDirection: 'row',
        width: SCREEN_WIDTH,
        height: rowHeight,
        paddingLeft: 15,
        backgroundColor: 'white',
    },

    cellLeft: {
        flex: 1,
        justifyContent: 'center',
    },

    cellMid: {
        flex: 2,
        justifyContent: 'center',
        backgroundColor: 'white',
    },

    cellRight: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        backgroundColor: 'white',
    },

    textContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },

    prex: {
        fontSize: 15,
        color: '#7d7d7d',
        backgroundColor: 'white',
    },

    desc: {
        fontSize: 15,
        color: '#434343',
        backgroundColor: 'white',
    },

    selectImg: {
        width: 15,
        height: 15,
        marginRight: 15,
    },
});
