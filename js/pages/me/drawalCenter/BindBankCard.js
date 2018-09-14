'use strict';

import React, { Component } from 'react';

import {
	StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	StatusBar,
	Image
} from 'react-native';

import DrawalSelectBankList from './DrawalSelectBankList';
import Regex from '../../../skframework/component/Regex'

//绑定银行卡
class BindBankCard extends Component {

	static navigationOptions = ({ navigation }) => ({

        header: (
			<CustomNavBar
				centerText = {"绑定银行卡"}
				leftClick={() => {
					(navigation.state.params && navigation.state.params.callback) ? navigation.state.params.callback():null;
                    navigation.goBack();
				}}
			/>
        ),

	});

	constructor(props) {
		super(props);

		this.state = {
			contentChange: null,
			visible: false,
			dataSource: [],
			bankItem: null,
			nameEdit: true,//开户名是否可以编辑
			accountBankBankEdit:true,
			accountBank:'',
		};

		this.loginObject = null;
		this.accountPwd = '';
		this.accountQueRenPwd = '';
		this.accountCity = '';
		this.accountCityAddrees = '';
		this.accountProvice = '';
		this.accountNumber = '';
		this.accountName = '';
		this.accountBankBank='';
	}

	//页面将要离开的是时候发送通知
	componentWillUnmount() {
		PushNotification.emit('refshBankList');
	}

	componentDidMount() {
		this.loginObject = global.UserLoginObject;
		this._fetchBankList();
	}

	_fetchBankList() {
		let params = new FormData();
		params.append("ac", "getBankCardList");
		var promise = GlobalBaseNetwork.sendNetworkRequest(params);
		promise
			.then((response) => {
				if (response.msg == 0) {
					let nameEdit = this.state.nameEdit;
					if (this.loginObject.Real_name && this.loginObject.Real_name.length > 0) {
						this.accountName = this.loginObject.Real_name;
						nameEdit = false;
					}
					response.data.push({id:'-1',name:'其它银行'});
					this.setState({
						dataSource: response.data,
						nameEdit: nameEdit,
					});

				} else {
					if (response.param) {
						Alert.alert(response.param ? response.param : '');
					}
				}

			})
			.catch((err) => {
				if (err && typeof(err) === 'string' && err.length > 0) {
                	this.refs.LoadingView && this.refs.LoadingView.showFaile(err);
            	}
			})
	}

	kaihuName() {
		return (
			<TextInput
				underlineColorAndroid='transparent'
				style={styles.value}
				placeholder={this.state.nameEdit ? '请输入开户名' : ''}
				defaultValue={this.state.nameEdit ? '' : this.accountName}
				onChangeText={(text) => this.accountName = text}
				editable={this.state.nameEdit}
			></TextInput>
		)
	}

	render() {

		return (
			<ScrollView
				onContentSizeChange={(contentWidth, contentHeight) => this._contentChange(contentWidth, contentHeight)}
				style={styles.container}
				automaticallyAdjustContentInsets={false}
				alwaysBounceHorizontal={false}
				scrollEnabled = {false}
				showsVerticalScrollIndicator={false}
				keyboardDismissMode={global.iOS ? 'on-drag' : 'none'}
				keyboardShouldPersistTaps ={global.iOS ? 'never' : 'always'}
			>
				<CusBaseText style={styles.tip}>请如实填写您的出款银行资料，以免有心人士窃取</CusBaseText>
				<View style={styles.titleView}>
					<View style={styles.redView} />
					<CusBaseText style={styles.title}>卡号信息</CusBaseText>
				</View>
				<View style={styles.countView}>
					<CusBaseText style={styles.prex}>开户人姓名：</CusBaseText>
					{this.kaihuName()}
				</View>
				<Image style={{marginLeft:20,width:SCREEN_WIDTH-40,height:1}}
              source={require('./img/ic_xuxian.png')}
               />
			   {this.state.accountBank != '-1'?
			   <View style={styles.countView}>
					<CusBaseText style={styles.prex}>开户银行：</CusBaseText>
					<TouchableOpacity style={styles.selectBank} activeOpacity={1}
				  onPress={() => {this.setState({visible: true,});}}>
				  <CusBaseText style={this.state.bankItem ? { color: 'black' } : { color: 'rgb(201,201,206)' }}>{this.state.bankItem ? this.state.bankItem.name : '请选择银行卡'}</CusBaseText>
				  <Image style={{width:15,height:15,marginLeft:100}} source={require('./img/ic_bankjiantou.png')}/>
			    	</TouchableOpacity>
				</View>:
				<View style={styles.countView}>
				<CusBaseText style={styles.prex}>开户银行：</CusBaseText>
					<TextInput
						underlineColorAndroid='transparent'
						style={{flex:0.8,fontSize: 14,height: 44,padding: 0,}}
						placeholder={ '请输入银行'}
						onChangeText={(text) => this.accountBankBank = text}
					></TextInput>
					<TouchableOpacity style={styles.selectBank} activeOpacity={1}
				  onPress={() => {this.setState({visible: true,});}}>
				  <Image style={{width:15,height:15,marginLeft:100}} source={require('./img/ic_bankjiantou.png')}/>
			    	</TouchableOpacity>
			   </View>}
			   <Image style={{marginLeft:20,width:SCREEN_WIDTH-40,height:1}}
              source={require('./img/ic_xuxian.png')}
               />
				<View style={styles.countView}>
					<CusBaseText style={styles.prex}>银行卡账号：</CusBaseText>
					<TextInput
						returnKeyType="done"
						underlineColorAndroid='transparent'
						style={styles.value}
						placeholder='请输入银行卡账号'
						keyboardType={global.iOS ? 'number-pad' : 'numeric'}
						onChangeText={(text) => this.accountNumber = text}
					></TextInput>
				</View>
				<Image style={{marginLeft:20,width:SCREEN_WIDTH-40,height:1}}
              source={require('./img/ic_xuxian.png')}
               />
				<View style={styles.countView}>
					<CusBaseText style={styles.prex}>开户省/市：</CusBaseText>
					<TextInput
						underlineColorAndroid='transparent'
						style={styles.value}
						placeholder='请输入省/市'
						onChangeText={(text) => this.accountProvice = text}
					></TextInput>
				</View>
				<Image style={{marginLeft:20,width:SCREEN_WIDTH-40,height:1}}
              source={require('./img/ic_xuxian.png')}
               />
				<View style={styles.countView}>
					<CusBaseText style={styles.prex}>开户行详细地址：</CusBaseText>
					<TextInput
						underlineColorAndroid='transparent'
						style={styles.value}
						placeholder='请输入详细地址'
						onChangeText={(text) => this.accountCityAddrees = text}
					></TextInput>
				</View>
				<Image style={{marginLeft:20,width:SCREEN_WIDTH-40,height:1}}
              source={require('./img/ic_xuxian.png')}
               />
				<View style={styles.countView}>
					<CusBaseText style={styles.prex}>交易密码：</CusBaseText>
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
				<Image style={{marginLeft:20,width:SCREEN_WIDTH-40,height:1}}
              source={require('./img/ic_xuxian.png')}
               />
			
			   {global.UserLoginObject.Tkpass_ok != 1?<CusBaseText style={{marginLeft: 20,marginTop:8,marginRight:8,fontSize: 16,color: 'rgb(51,51,51)',}}>亲爱的用户,由于您还没有设置过交易密码,将被设置成默认交易密码。</CusBaseText>:null}
				<TouchableOpacity
					style={styles.btn}
					activeOpacity={1}
					onPress={() => this._confirmClicked()}
				>
					<CusBaseText style={styles.btnText}>立即绑定</CusBaseText>
				</TouchableOpacity>
				{this.state.contentChange ? <View style={{ flex: 1, height: (SCREEN_HEIGHT - this.state.contentChange + 50) }}></View> : null}
				<DrawalSelectBankList
					dataSource={this.state.dataSource}
					visible={this.state.visible}
					onCancel={() => {
						this.setState({
							visible: false,
						});
					}}
					onPress={(item) => {
						if(item.id == '-1') {
						this.accountBankBank = '';
						}else {
						this.accountBankBank = item.name;
						}
					//	this.accountBank = item.id;
						this.setState({
							visible: false,
							bankItem: item,
		                 	accountBank:item.id,
							accountBankBankEdit:false,
						});
					}}
				/>
				<LoadingView ref="LoadingView"/>
			</ScrollView>
		);
	}

	_contentChange = (contentWidth, contentHeight) => {

		if (contentHeight < SCREEN_HEIGHT) {
			this.setState({
				contentChange: contentHeight,
			});
		}

	}

	_confirmClicked = () => {
		
        
		if (this.accountName.trim().length == 0 || this.accountBankBank.length == 0 || this.accountNumber.length == 0 || this.accountProvice.trim().length == 0 ) {
			this.refs.LoadingView && this.refs.LoadingView.showFaile('请完善信息');
			return;
		}
		

		if (this.accountPwd.length < 4) {
			this.refs.LoadingView && this.refs.LoadingView.showFaile('请输入4位交易密码');
			return;
		}

		this._postBankData();
	}

	_postBankData = () => {

		this.refs.LoadingView && this.refs.LoadingView.showLoading('loading');

		let params = new FormData();
		params.append("ac", "addUserBankCard");
		params.append("uid", this.loginObject.Uid);
		params.append("token", this.loginObject.Token);
		params.append("realname", this.accountName.trim());
		params.append("card_sheng", this.accountProvice.trim());
		params.append("type", this.state.accountBank);
		params.append("card_num", this.accountNumber);
		params.append("tk_pass", this.accountPwd);
		params.append("address", this.accountCityAddrees);
		params.append("more_bank", this.state.accountBank=='-1'?this.accountBankBank:'');
		params.append("sessionkey", global.UserLoginObject.session_key);

		var promise = GlobalBaseNetwork.sendNetworkRequest(params);
		promise
			.then((response) => {
				if (response.msg == 0) {
					this.refs.LoadingView && this.refs.LoadingView.cancer();
					global.UserLoginObject.Card_num = this.accountNumber;
					global.UserLoginObject.Real_name = this.accountName;
					global.UserLoginObject.Tkpass_ok = 1;

					let loginStringValue = JSON.stringify(global.UserLoginObject);
					UserDefalts.setItem('userInfo', loginStringValue, (error) => { });
					global.BankListArray.push({key:global.BankListArray.length,value:{address:this.accountCityAddrees,bank_type:this.state.accountBank,
						bank_typename:this.accountBankBank,card_num:this.accountNumber,card_sheng:this.accountProvice.trim(),card_shi:"",id:response.data.bank_id,is_default:global.BankListArray.length==0?1:0,}});
					//点击提款进入
					if (this.props.navigation.state.params.BindBankCardPreviousAction == 'DrawalCenter') {
						this.props.navigation.navigate('DrawalInfo');
						return;
					}

					//点击现金交易进入
					if (this.props.navigation.state.params.BindBankCardPreviousAction == 'CashTrasaCenter') {
						this.props.navigation.navigate('CashTrasaAcount');
						return;
					}

                    this.props.navigation.goBack();
                    (this.props.navigation.state.params && this.props.navigation.state.params.callback) ? this.props.navigation.state.params.callback(response.msg) : null;

				} else {
					this.refs.LoadingView && this.refs.LoadingView.showFaile(response.param);
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
		backgroundColor: 'white',
	},

	tip: {
		marginLeft: 20,
		marginTop: 20,
		fontSize: 14,
		color: 'rgb(51,51,51)',
	},

	titleView: {
		marginTop: 10,
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 20,
	},

	redView: {
		backgroundColor: COLORS.appColor,
		width: 8,
		height: 20,
	},

	title: {
		fontSize: 15,
		color: 'rgb(51,51,51)',
		marginLeft: 10,
	},

	countView: {
		height: 44,
		marginLeft: 20,
		marginRight: 20,
		flexDirection: 'row',
		alignItems: 'center',
		// borderBottomWidth: 1,
		// borderColor: '#ccc',
	},

	prex: {
		fontSize: 15,
		color: 'rgb(51,51,51)',
	},

	value: {
		flex: 1,
		fontSize: 14,
		height: 44,
		padding: 0,
	},

	btn: {
		marginTop: 30,
		backgroundColor: COLORS.appColor,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 20,
		marginRight: 20,
		borderRadius: 5,
	},

	btnText: {
		color: 'white',
		fontSize: 16,
	},

	selectBank: {
		flex: 1,
		flexDirection:'row',
	//	justifyContent: 'center',
		// marginLeft: 15,
		height: 44,
		 alignItems:'center',
		  //justifyContent:'center',
	},

});


export default BindBankCard;
