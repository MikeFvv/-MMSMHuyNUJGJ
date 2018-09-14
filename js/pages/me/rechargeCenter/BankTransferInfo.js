'use strict';

import React, { Component } from 'react';

import {
	StyleSheet,
	View,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Clipboard,
	Image,
} from 'react-native';

import moment from 'moment';
import Picker from 'react-native-picker';
import DrawalSelectBankList from '../drawalCenter/DrawalSelectBankList';

class BankTransferInfo extends Component {

	static navigationOptions = ({ navigation }) => ({

		header: (
			<CustomNavBar
				centerText={"银行转账"}
				leftClick={() => {
                    Picker.hide();
                    navigation.goBack();
                }}
			/>
		),

	});

	constructor(props) {
		super(props);

		this.state = {
			storageBank: null,
			bankList: [],
			visible: false,
			storageTime: moment().format('YYYY-MM-DD HH:mm'),
		};
		this.loginObject = null;
		this.bankItem = null;
		this.storageMoney = '';
		this.storageName = '';
	}

	componentWillMount() {
		this.bankItem = this.props.navigation.state.params.bankItem;
		this.storageMoney = this.props.navigation.state.params.recharMoney;
	}

	componentWillUnmount() {
		global.RechargeInfoRouteKey = null;
		global.BankTransferInfoRouteKey = null;
	}

	componentDidMount() {

		global.BankTransferInfoRouteKey = this.props.navigation.state.key;

		this.loginObject = global.UserLoginObject;
		// this.storageName = this.loginObject.Real_name;

		if (global.bankList.length <= 0) {
			this._fetchBankList();//请求银行卡列表
		} else {
			this.setState({
				bankList: global.bankList,
			});
		}

	}

	_fetchBankList() {

		let params = new FormData();
		params.append("ac", "getBankCardList");

		var promise = GlobalBaseNetwork.sendNetworkRequest(params);
		promise
			.then((responseData) => {

				if (responseData.msg == 0) {
					this.setState({
						bankList: responseData.data,
					});
				} else {
					if (responseData.param) {
						Alert.alert(responseData.param);
					}
				}

			})
			.catch((err) => {
				if (err && typeof (err) === 'string' && err.length > 0) {
					this.refs.LoadingView && this.refs.LoadingView.showFaile(err);
				}
			})
	}


	_showTimePicker = () => {

		let years = [],
			hours = [],
			minutes = [];

        let curDate = new Date();
        let preDate = new Date(curDate.getTime() - 24*60*60*1000);  //前一天
        let nextDate = new Date(preDate.getTime() - 24*60*60*1000);  //前一天

        let cd = moment(curDate).format('YYYY-MM-DD');
        years.push(moment(nextDate).format('YYYY-MM-DD'));
        years.push(moment(preDate).format('YYYY-MM-DD'));
        years.push(cd);


        let ch = curDate.getHours(); //获取当前小时数(0-23)
        let cm = curDate.getMinutes(); //获取当前分钟数(0-59)
        if (ch < 10) {
            ch = '0'+ch;
        }else {
            ch = ''+ch;
        }
        if (cm < 10) {
            cm = '0'+ch;
        }else {
            cm = ''+cm;
        }

		for (let i = 0; i < 24; i++) {
            if (i<10) {
                hours.push('0' + i);
            }else {
                hours.push(i+'');
            }
		}

		for (let i = 0; i < 60; i++) {
            if (i<10) {
                minutes.push('0' + i);
            }else {
                minutes.push(i+'');
            }
		}

		let pickerData = [years, hours, minutes];

        let selectedValue = [cd,ch,cm];

        Picker.init({
			pickerData,
			selectedValue:selectedValue,
			pickerTitleText: '选择时间',
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			wheelFlex: [2, 1, 1],
			onPickerConfirm: pickedValue => {
				// console.log('area', pickedValue);

				let time = pickedValue[0]+' '+pickedValue[1]+':'+pickedValue[2];

				this.setState({
					storageTime: time,
				});
			},
			onPickerCancel: pickedValue => {
			},
			onPickerSelect: pickedValue => {
				let targetValue = [...pickedValue];

				// forbidden some value such as some 2.29, 4.31, 6.31...
				if (JSON.stringify(targetValue) !== JSON.stringify(pickedValue)) {
					// android will return String all the time，but we put Number into picker at first
					// so we need to convert them to Number again
					targetValue.map((v, k) => {
						if (k !== 3) {
							targetValue[k] = parseInt(v);
						}
					});
					Picker.select(targetValue);
				}
			}
		});
		Picker.show();
	}

	render() {
		return (
			<ScrollView
				automaticallyAdjustContentInsets={false}
				alwaysBounceHorizontal={false}
				showsVerticalScrollIndicator={false}
				keyboardDismissMode={global.iOS ? 'on-drag' : 'none'}
				style={styles.container}>


				<View style={styles.titleView}>
					<Image
						style={styles.headImageViewStyle}
						source={require('./img/ic_recharge_circle.png')}
					/>
					<CusBaseText style={styles.titleTextStyle}>银行转账信息</CusBaseText>
				</View>
				<View style={styles.viewContentOne}>
					<View style={styles.view21}>
						<CusBaseText style={styles.prexText}>开户行网点</CusBaseText>
						<CusBaseText style={styles.prexText}>收款人</CusBaseText>
						<CusBaseText style={styles.prexText}>银行</CusBaseText>
						<CusBaseText style={styles.prexText}>账号</CusBaseText>
					</View>
					<View style={styles.view22}>
						<CusBaseText style={styles.valueTextStyle}>{this.bankItem.bank_home}</CusBaseText>
						<View style={{ flexDirection: 'row' }}>
							<CusBaseText style={styles.valueTextStyle}>{this.bankItem.real_name}</CusBaseText>

							<TouchableOpacity
								style={styles.copyBtnStyle}
								activeOpacity={0.7}
								onPress={() => {
									Clipboard.setString(this.bankItem.real_name);
								}}
							>
								<CusBaseText style={styles.copyBtnText}>复制</CusBaseText>
							</TouchableOpacity>

						</View>
						<CusBaseText style={styles.valueTextStyle}>{this.bankItem.bank_type}</CusBaseText>
						<View style={{ flexDirection: 'row' }}>
							<CusBaseText style={styles.valueTextStyle}>{this.bankItem.bank_card}</CusBaseText>

							<TouchableOpacity
								style={styles.copyBtnStyle}
								activeOpacity={0.7}
								onPress={() => {
									Clipboard.setString(this.bankItem.bank_card);
								}}
							>
								<CusBaseText style={styles.copyBtnText}>复制</CusBaseText>
							</TouchableOpacity>

						</View>
					</View>
				</View>


				<View style={styles.titleView}>
					<Image
						style={styles.headImageViewStyle}
						source={require('./img/ic_recharge_circle.png')}
					/>
					<CusBaseText style={styles.titleTextStyle}>请确认填写转账金额与时间</CusBaseText>
				</View>

				<View style={styles.viewContentTwo}>
					<View style={styles.view21}>
						<View style={styles.inputPrexView}><CusBaseText style={styles.prexText} >存入金额</CusBaseText></View>
						<View style={styles.inputPrexView}><CusBaseText style={styles.prexText} >存款时间</CusBaseText></View>
					</View>
					<View style={styles.view22}>
						<TextInput
							underlineColorAndroid='transparent'
							style={styles.input}
							editable={false}
							defaultValue={this.storageMoney.toString()}
							onChangeText={(text) => this.storageMoney = text}
						/>

						<TouchableOpacity
							underlineColorAndroid='transparent'
							activeOpacity={1}
							style={styles.selectBank}
							onPress={() => {
								this._showTimePicker();
							}}
						>
							<CusBaseText style={[{ color: 'black' }, styles.timeText]}>{this.state.storageTime}</CusBaseText>
							<Image style={{ width: 15, height: 15, marginLeft: 30, }} source={require('./img/ic_drawal_arrow.png')} />
						</TouchableOpacity>

					</View>
				</View>


				<View style={styles.titleView}>
					<Image
						style={styles.headImageViewStyle}
						source={require('./img/ic_recharge_circle.png')}
					/>
					<CusBaseText style={styles.titleTextStyle}>存款人</CusBaseText>
				</View>

				<View style={styles.viewContentThree}>
					<View style={styles.view21}>
						<View style={styles.inputPrexView}><CusBaseText style={styles.prexText}>存款人姓名</CusBaseText></View>
					</View>
					<View style={styles.view22}>

						<TextInput
							underlineColorAndroid='transparent'
							style={styles.input}
							onChangeText={(text) => this.storageName = text}
							// defaultValue={this.storageName ? this.storageName : ''}
							placeholder='存款人姓名'
						/>

					</View>
				</View>

				<View style={styles.titleView}>
					<Image
						style={styles.headImageViewStyle}
						source={require('./img/ic_bank_prompt.png')}
					/>
					<CusBaseText style={styles.cellText}>每次存款前，请一定到网站获取最新入款信息</CusBaseText>
				</View>

				<TouchableOpacity
					style={styles.payBtnStyle}
					activeOpacity={1}
					onPress={() => {
						this._nextPress();
					}}
				>
					<CusBaseText style={styles.payText}>我已转账</CusBaseText>
				</TouchableOpacity>

				<DrawalSelectBankList
					dataSource={this.state.bankList}
					visible={this.state.visible}
					onCancel={() => {
						this.setState({
							visible: false,
						});
					}}
					onPress={(item) => {
						this.setState({
							visible: false,
							storageBank: item,
						});
					}}
				/>
				<LoadingView ref="LoadingView" />
			</ScrollView>
		);
	}

	//我已转账
	_nextPress = () => {

		if (global_isSpace(this.state.storageTime) || this.state.storageTime.trim().length == 0) {
			this.refs.LoadingView && this.refs.LoadingView.showFaile('请选择存款时间');
			return;
		}

		if (global_isSpace(this.storageName) || this.storageName.trim().length == 0) {
			this.refs.LoadingView && this.refs.LoadingView.showFaile('请填写入款人姓名');
			return;
		}

		this._postBankInfo();
	}

	_postBankInfo = () => {

		this.refs.LoadingView && this.refs.LoadingView.showLoading('loading');

		let params = new FormData();

		params.append("uid", this.loginObject.Uid);
		params.append("token", this.loginObject.Token);
		params.append('sessionkey', this.loginObject.session_key);
		params.append("ac", "submitPayCompany");

		params.append("pay_id", this.bankItem.id); //我方银行卡id
		params.append("price", this.storageMoney); //用户存入的金额
		params.append("time", this.state.storageTime);//存款人存款的时间,直接传时间格式
		params.append("card_name", this.storageName.trim()); //存款人姓名或持卡人姓名

		var promise = GlobalBaseNetwork.sendNetworkRequest(params);
		promise
			.then((response) => {

				if (response.msg == 0) {
					this.refs.LoadingView && this.refs.LoadingView.cancer();
					this.props.navigation.navigate('RechargeSubmit', { recharNumber: this.storageMoney, order: response.data.order });
				} else {
					this.refs.LoadingView && this.refs.LoadingView.showFaile(response.param);
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
	},

	titleView: {
		height: 40,
		paddingLeft: 10,
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: 'rgb(240, 240, 240)',
	},

	headImageViewStyle: {
		width: 16,
		height: 16,
		marginRight: 10,
	},

	titleTextStyle: {
		fontSize: 15,
		color: '#6b6c6d',
	},
	cellText: {
		fontSize: 13,
		color: '#313233',
	},

	viewContentOne: {
		flexDirection: 'row',
		backgroundColor: 'white',
		paddingBottom: 10,
	},
	viewContentTwo: {
		flexDirection: 'row',
		backgroundColor: 'white',
		paddingBottom: 10,
	},

	viewContentThree: {
		flexDirection: 'row',
		backgroundColor: 'white',
		paddingBottom: 10,
	},

	viewContentFour: {
		flexDirection: 'row',
		backgroundColor: 'white',
		paddingBottom: 10,
	},

	view21: {
		paddingLeft: 20,
		backgroundColor: 'white',
	},

	view22: {
		paddingLeft: 10,
		backgroundColor: 'white',
	},

	valueTextStyle: {
		paddingTop: 15,
		color: 'rgb(134, 134, 134)',
		fontSize: Adaption.Font(16, 14),
	},

	view3: {
		backgroundColor: 'white',
		flexDirection: 'row',
		paddingBottom: 10,
	},

	inputPrexView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},

	prexText: {
		paddingTop: 15,
		color: 'rgb(87, 87, 87)',
		fontSize: Adaption.Font(16, 14),
	},


	input: {
		padding: 0,
		marginTop: 10,
		fontSize: 15,
		width: SCREEN_WIDTH / 3 * 2 - 10,
		height: 38,
		borderRadius: 5,
		borderColor: '#ccc',
		borderWidth: 1,
		textAlign: 'center',
	},

	selectBank: {
		marginTop: 10,
		width: SCREEN_WIDTH / 3 * 2 - 10,
		height: 40,
		borderRadius: 5,
		borderColor: '#ccc',
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},

	bankText: {
		fontSize: 13,
		textAlign: 'center',
	},

	tipView: {
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},

	payBtnStyle: {
		backgroundColor: COLORS.appColor,
		borderRadius: 5,
		width: SCREEN_WIDTH - 80,
		height: 45,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 25,
		marginLeft: 40,
		marginBottom: 10,
	},

	payText: {
		color: 'white',
		fontSize: 15,
	},

	copyBtnStyle: {
		marginTop: 8,
		marginLeft: 15,
		height: 24,
		width: 50,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: COLORS.appColor,
		justifyContent: 'center',
		alignItems: 'center',
	},

	copyBtnText: {
		color: COLORS.appColor,
		fontSize: 14,
	},

});


export default BankTransferInfo;