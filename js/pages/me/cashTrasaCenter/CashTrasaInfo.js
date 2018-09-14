'use strict';

import React, { Component } from 'react';

import {
	StyleSheet,
	View,
	TouchableOpacity,
	TextInput,
	Image,
	ScrollView,
} from 'react-native';

import Regex from '../../../skframework/component/Regex';

class CashTrasaInfo extends Component {

	static navigationOptions = ({ navigation }) => ({

        header: (
			<CustomNavBar
				centerText = {'现金交易'}
				leftClick={() =>  navigation.goBack() }
			/>
        ),

	});

	constructor(props) {
		super(props);
		this.loginObject = null;
		this.info = null;
		this.pwd = '';
		this.relName = '';
		this.trasaMoney = '';

		this.state = {headerIcon:'',}
	}

	componentWillMount() {
        this.cleanUserAcount = this.props.navigation.state.params.cleanUserAcount;
		this.info = this.props.navigation.state.params.info;
		this.state.headerIcon = this.props.navigation.state.params.info.head_icon ? this.props.navigation.state.params.info.head_icon : '';
	}

	componentDidMount() {
		this.loginObject = global.UserLoginObject;
        global.CashTrasaInfoRouteKey = this.props.navigation.state.key;
	}

    componentWillUnmount() {
        global.CashTrasaInfoRouteKey = null;
    }

	render() {
		return (
			<ScrollView
				style={styles.container}
				keyboardDismissMode={global.iOS ? 'on-drag' : 'none'}
				automaticallyAdjustContentInsets={false}
				alwaysBounceHorizontal={false}>
				<Image
					style={styles.aver}
					source={this.state.headerIcon.length > 0 ? { uri: this.state.headerIcon } : require('../newMe/img/ic_newme_defaultHead.png')}
					onError={() => {
						this.setState({headerIcon:''});
					}}
				/>
				<View style={styles.nameView}>
					<CusBaseText style={styles.reName}>{this.info.real_name}</CusBaseText>
					<CusBaseText style={styles.nike}>{this.info.account}</CusBaseText>
				</View>
				<View style={styles.acountView}>
					<CusBaseText style={styles.acountTip}>转账金额</CusBaseText>
					<View style={styles.acountLine}></View>
					<View style={styles.moneyView}>
						<CusBaseText style={{ fontSize: 23 }}>¥</CusBaseText>
						<TextInput
							returnKeyType="done"
							maxLength={10}
							underlineColorAndroid='transparent'
							style={[styles.bigFont, styles.money]}
							keyboardType='numeric'
							onChangeText={(text) => this.trasaMoney = text}
							placeholder='请输入转账金额'
						/>
					</View>
				</View>
				<View style={styles.verifi}>
					<View style={[styles.moneyView, { height: 45 }]}>
						<CusBaseText style={{ fontSize: 20 }}>校验姓名</CusBaseText>
						<TextInput
							underlineColorAndroid='transparent'
							style={[styles.money, { height: 45, fontSize: 20 }]}
							onChangeText={(text) => this.relName = text}
							placeholder='请输入对方校验姓名'
						/>
					</View>
					<View style={styles.acountLine}/>
					<View style={[styles.moneyView, { height: 45 }]}>
						<CusBaseText style={styles.bigFont}>交易密码</CusBaseText>
						<TextInput
							returnKeyType="done"
							underlineColorAndroid='transparent'
							keyboardType={global.iOS ? 'number-pad' : 'numeric'}
							placeholder='请输入4位交易密码'
							secureTextEntry={true}
							maxLength={4}
							style={[styles.money, styles.bigFont, { height: 45 }]}
							onChangeText={(text) => this.pwd = text}
						>
						</TextInput>
					</View>
				</View>
				<CusBaseText style={styles.bottomTip}>钱将实时转入对方账户，无法退款</CusBaseText>
				<TouchableOpacity
					activeOpacity={1}
					style={styles.nextBtn}
					onPress={() => this._nextBtnClicked()}
				>
					<CusBaseText style={styles.nextText}>确认转账</CusBaseText>
				</TouchableOpacity>
				<LoadingView ref="LoadingView"/>
			</ScrollView>
		);
	}

	_nextBtnClicked = () => {

		if (this.trasaMoney.length <= 0) {
			this.refs.LoadingView && this.refs.LoadingView.showFaile('请输入转账金额');
			return;
		}

		if (!Regex(this.trasaMoney, "money")) {
            this.refs.LoadingView && this.refs.LoadingView.showFaile('请输入合法金额');
            return;
        }

		if (this.relName.length == 0 || global_isSpace(this.relName)) {
			this.refs.LoadingView && this.refs.LoadingView.showFaile('请输入转账账号校验姓名');
			return;
		}

		if (this.pwd.length == 0 || global_isSpace(this.pwd)) {
			this.refs.LoadingView && this.refs.LoadingView.showFaile('请输入交易密码');
			return;
		}

        this.refs.LoadingView && this.refs.LoadingView.showLoading('正在提交中...');

		let params = new FormData();
		params.append("ac", "sendMoneyToChild");
		params.append("username", this.info.account);
		params.append("realname", this.relName.trim());
		params.append("price", this.trasaMoney.trim());
		params.append("tk_pass", this.pwd.trim());
		params.append("uid", UserLoginObject.Uid);
		params.append("token", UserLoginObject.Token);
		params.append("sessionkey", UserLoginObject.session_key);

		var promise = GlobalBaseNetwork.sendNetworkRequest(params);
		promise
			.then((responseData) => {
				this.refs.LoadingView && this.refs.LoadingView.cancer();
				if (responseData.msg == 0) {

					let result = responseData.data;
					result.account = this.info.account;
					this.props.navigation.navigate('CashTrasaSubmit', { info: result,cleanUserAcount:this.cleanUserAcount});

				} else {
					this.refs.LoadingView && this.refs.LoadingView.showFaile(responseData.param);
				}

			})
			.catch((err) => {
				if (err && typeof(err) === 'string' && err.length > 0) {
                	this.refs.LoadingView && this.refs.LoadingView.showFaile(err);
            	}
			})

	}

}

const styles = StyleSheet.create({

	container: {
		flex: 1,
		backgroundColor: 'rgb(243,243,243)',
	},

	aver: {
		width: 75,
		height: 75,
		marginLeft: (SCREEN_WIDTH - 75) / 2,
		marginTop: 20,
		borderRadius: 75 / 2,
	},

	nameView: {
		marginTop: 10,
		marginBottom: 10,
		alignItems: 'center',
	},

	reName: {
		marginTop: 10,
		color: 'rgb(92,92,92)',
		fontSize: 17,
	},

	nike: {
		marginTop: 10,
		color: 'rgb(151,151,151)',
		fontSize: 15,
	},

	acountView: {
		paddingLeft: 10,
		backgroundColor: 'white',
	},

	acountTip: {
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 10,
		fontSize: 17,
	},

	acountLine: {
		height: 1,
		backgroundColor: "#ccc",
		marginLeft: 10,
	},

	moneyView: {
		padding: 0,
		marginLeft: 10,
		flexDirection: 'row',
		height: 60,
		alignItems: 'center',
	},

	bigFont: {
		fontSize: 20,
	},

	money: {
		flex: 1,
		height: 60,
		paddingLeft: 10,
	},

	verifi: {
		backgroundColor: 'white',
		marginTop: 15,
		marginLeft: 10,
	},

	bottomTip: {
		marginTop: 10,
		color: 'rgb(151,151,151)',
		fontSize: 15,
		marginLeft: 20,
	},

	nextBtn: {
		backgroundColor: COLORS.appColor,
		height: 35,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 20,
		marginRight: 20,
		marginTop: 20,
		borderRadius: 5,
	},

	nextText: {
		fontSize: 15,
		color: 'white',
	},

});


export default CashTrasaInfo;
