'use strict';
import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    TouchableOpacity,
    FlatList,
    Image,
    TextInput,
    Linking,
} from 'react-native';

import RechargeAmountView from './RechargeAmountView';
import Regex from '../../../skframework/component/Regex';

// 在线支付
export default class OnlineModelList extends Component {

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
        this.lockReconnect = false;//避免重复连接
        this.reconnectCount = 0; //重连接次数,最大不超过30次

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
		params.append("type", this.paytype);
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

				<View style={{backgroundColor:'white'}}>
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
				<Image style={{width:35,height:35,marginRight:15,marginBottom:10,marginTop:10}} source={this._bankicon(info.item)}/>
				<CusBaseText style={{flex:1,fontSize:16}}>{info.item.name}</CusBaseText>
                <Image
                    style={{width:15,height:15}}
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
        this._getThridData(item);
	}

	// auto  通过第三方支付 跳转web
	_getThridData(item) {

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
        params.append("type", "1");
		params.append("subtype", item.id);  // 二级类型，针对type=1 在线支付

		var promise = GlobalBaseNetwork.sendNetworkRequest(params);
		promise
			.then((response) => {
                this._handThridData(response,item);
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

    _handThridData = (response,item) => {

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
        paddingLeft:15,
        paddingRight:15,
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
        backgroundColor: '#f0f1f2',
		height: 1,
	},
    itemStyle: {
        backgroundColor:'white',
        flexDirection:'row',
        alignItems: 'center',
        paddingLeft:20,
		paddingRight:15,
    },
});