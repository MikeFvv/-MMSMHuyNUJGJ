'use strict';

import React, { Component } from 'react';

import {
	StyleSheet,
	View,
	TouchableOpacity,
	FlatList,
	Image,
	TextInput,
} from 'react-native';

import RechargeAmountView from './RechargeAmountView';
import Regex from '../../../skframework/component/Regex';

// 在线支付
export default class OnlineModelView extends Component {

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

        this.dictImage = {
            "bank1": require('./img/bank-logo/bank1.png'),
            "bank2": require('./img/bank-logo/bank2.png'),
            "bank3": require('./img/bank-logo/bank3.png'),
            "bank4": require('./img/bank-logo/bank4.png'),
            "bank5": require('./img/bank-logo/bank5.png'),
            "bank6": require('./img/bank-logo/bank6.png'),
            "bank7": require('./img/bank-logo/bank7.png'),
            "bank8": require('./img/bank-logo/bank8.png'),
            "bank9": require('./img/bank-logo/bank9.png'),
            "bank10": require('./img/bank-logo/bank10.png'),
            "bank11": require('./img/bank-logo/bank11.png'),
            "bank12": require('./img/bank-logo/bank12.png'),
            "bank13": require('./img/bank-logo/bank13.png'),
            "bank14": require('./img/bank-logo/bank14.png'),
            "bank15": require('./img/bank-logo/bank15.png'),
            "bank16": require('./img/bank-logo/bank16.png'),
            "bank17": require('./img/bank-logo/bank17.png'),
            "bank18": require('./img/bank-logo/bank18.png'),
            "bank19": require('./img/bank-logo/bank19.png'),
            "bank20": require('./img/bank-logo/bank20.png'),
            "bank21": require('./img/bank-logo/bank21.png'),
            "bank22": require('./img/bank-logo/bank22.png'),
            "bank23": require('./img/bank-logo/bank23.png'),
            "bank24": require('./img/bank-logo/bank24.png'),
            "bank25": require('./img/bank-logo/bank25.png'),
            "bank26": require('./img/bank-logo/bank26.png'),
            "bank27": require('./img/bank-logo/bank27.png'),
            "bank28": require('./img/bank-logo/bank28.png'),
            "bank29": require('./img/bank-logo/bank29.png'),
        };
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

				let onlineList = [];
				for (let key in response.data) {
					onlineList.push(response.data[key]);
				}

				this.setState({
					dataSource: onlineList,
					item: onlineList[0],
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
			<View style={[this.props.style, styles.container]}>

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
                    <CusBaseText style={{ color: '#565656', fontSize: 17, marginLeft: 10 }}>请选择支付银行</CusBaseText>
                </View>

                <FlatList
                    automaticallyAdjustContentInsets={false}
                    alwaysBounceHorizontal={false}
                    data={this.state.dataSource}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={this._renderSeparator}
                    keyExtractor={this._keyExtractor}
                    showsVerticalScrollIndicator={false}
                />

                <LoadingView ref="LoadingView" />

			</View>
		);
	}

    _renderItem = (info) => {
		return (
			<TouchableOpacity
				activeOpacity={1}
				style={styles.itemStyle}
                onPress={() => this._onPress(info.item)}
			>
                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                    <Image style={{width:35,height:35,marginLeft:20}} source={this._bankicon(info.item)}/>
                    <CusBaseText style={styles.itemText}>{info.item.name}</CusBaseText>
                </View>
                <Image
                    style={styles.nextImg}
                    source={require('./img/ic_recharge_next.png')}
                />
			</TouchableOpacity>
		);
	}

	_renderSeparator = () => {
		return (<View style={styles.itemSeparator} />);
	}

	_keyExtractor = (item, index) => {
		return String(index);
	}

	_bankicon = (item) => {
        // return { url: GlobalConfig.baseURL + '/Public/view/phone/images/bank/bank-logo/type' + this.state.item.id + '.png' }
        return this.dictImage['bank'+item.id];
    }

	// 检查输入金额
	_inspectInputAmount = () => {

		if (this.recharNumber.length <= 0) {
			Alert.alert('请输入充值金额');
			return false;
		}

		if (!Regex(this.recharNumber, "money")) {
			Alert.alert('请输入合法金额');
			return false;
		}
	}

    _onPress = (item) => {
		if (this._inspectInputAmount() == false) {
			return;
		}
        this._getThridData(item);
	}


	// auto  通过第三方支付 跳转web
	_getThridData(item) {

		this.refs.LoadingView && this.refs.LoadingView.showLoading('loading');
		let params = new FormData();
		params.append("ac", "submitPayThrid");
		params.append("uid", this.loginObject.Uid);
		params.append('token', this.loginObject.Token);
		params.append('sessionkey', this.loginObject.session_key);
		params.append("price", this.recharNumber);
        params.append("type", "1");
		params.append("subtype", item.id);  // 二级类型，针对type=1 在线支付

		console.log('params--->', params);

		var promise = GlobalBaseNetwork.sendNetworkRequest(params);
		promise
			.then((response) => {

				if (response.msg != 0) {
					this.refs.LoadingView && this.refs.LoadingView.showFaile(response.param);
					return;
				}

				this.refs.LoadingView && this.refs.LoadingView.cancer();

				let data = response.data;

				if (data.qrcode == 1) { //webview

					let urlString = '';

					if (data.method === 'post') {

						urlString = data.url;
						let body = data.data.replace(/>/g, '');

						this.props.navigation.navigate('ThridWebPay', { webUrl: urlString, method: data.method, body: body });

					} else { //get

						if (data.data && data.data.length != 0) {
							urlString = data.url + '?' + data.data.replace(/>/g, '');
						} else {
							urlString = data.url;
						}

						this.props.navigation.navigate('ThridWebPay', { webUrl: urlString, method: data.method});
					}

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
	},

	//账户信息
	accountInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: SCREEN_WIDTH,
		height: 40,
		backgroundColor: 'rgb(240,240,245)',
	},

	account: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 15,
	},

	namePrefix: {
		fontSize: 15,
		color: 'rgb(110,110,110)',
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

	itemSeparator: {
		backgroundColor: '#cccccc',
		width: SCREEN_WIDTH,
		height: 1,
	},

    itemStyle: {
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center',
        width: SCREEN_WIDTH,
        height: 60,
        backgroundColor:'white',
    },

	itemText: {
		marginLeft:20,
		fontSize: 15,
	},

    nextImg: {
        marginRight: 15,
        width: 15,
        height: 15,
    },

});

