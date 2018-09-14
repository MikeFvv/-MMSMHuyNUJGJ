

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';

import SegmentedControl from '../../../../common/SegmentedControl';
import DrawalSelectBankList from '../../drawalCenter/DrawalSelectBankList';
import Regex from '../../../../skframework/component/Regex'

const defaultNum = 8.5

// 适配
const kRightViewWidth = SCREEN_WIDTH < 360 ? 160 : 200
const kArrowButtomWidth = SCREEN_WIDTH < 360 ? 80 : 100
const kInputTextWidth = SCREEN_WIDTH < 360 ? 60 : 80


export default class RebateSetup extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isRefreshing: false,

			storageIP: null,
			visible: false,

			lotTypetObjct: {
				fp_sscValue: defaultNum, // 时时彩
				fp_pcddValue: defaultNum, // PC蛋蛋
				fp_k3Value: defaultNum, // 快3
				fp_pk10Value: defaultNum, // PK10
				fp_3dValue: defaultNum, // 3D
				fp_11x5Value: defaultNum, // 11选5
				fp_lhcValue: defaultNum, // 六合彩
			},
		}
		this.allDataArray = [];  // 请求返点赔率表第一个类型数据

		this.ruleIndex = 1,  // 下级模式类型 0 会员 ， 1 代理
			this.IPList = [];

		this.lotTypetImageObjct = {
			fp_sscValue: 'cqssc', // 时时彩
			fp_pcddValue: 'bj28', // PC蛋蛋
			fp_k3Value: 'gxk3', // 快3
			fp_pk10Value: 'pk10', // PK10
			fp_3dValue: 'fc3d', // 3D
			fp_11x5Value: 'sh11x5', // 11选5
			fp_lhcValue: 'xglhc', // 六合彩
		}

		this.loginObject = null;
	}

	componentDidMount() {
		this._getUserInfo();
		this._onRefresh();

		// this._fetchTableData('ssc');
	}

	_getUserInfo() {

		this.loginObject = global.UserLoginObject;

		// 更新数据
		this.setState({
			lotTypetObjct: {
				fp_sscValue: this.loginObject.fp_ssc, // 时时彩
				fp_pcddValue: this.loginObject.fp_pcdd, // PC蛋蛋
				fp_k3Value: this.loginObject.fp_k3, // 快3
				fp_pk10Value: this.loginObject.fp_pk10, // PK10
				fp_3dValue: this.loginObject.fp_3d, // 3D
				fp_11x5Value: this.loginObject.fp_11x5, // 11选5
				fp_lhcValue: this.loginObject.fp_lhc, // 六合彩
			},
		})
		this._fetchDomainList();
	}


	//请求域名列表
	_fetchDomainList() {

		let params = new FormData();
		params.append("ac", "getUsefulEnomList");
		params.append("uid", this.loginObject.Uid);
		params.append('token', this.loginObject.Token);
		params.append('sessionkey', this.loginObject.session_key);

		// params.append('type', 1);  // 0=全部, 1=仅可用
		// params.append('actype', 0);  // 获取类型, 0=自身域名, 1=总代理下级域名, 2=股东下级域名

		var promise = GlobalBaseNetwork.sendNetworkRequest(params);
		promise
			.then((responseData) => {

				if (responseData.msg == 0) {
					let IPList = [];

					let index = 0;
					responseData.data.map((item) => {

						if (index == 0) {
							IPList.push({ id: '0', name: '使用默认' });
							index = 1;
						}
						IPList.push({ id: item.id, name: item.enom });
						// IPList = item.data;
					})
					this.IPList = IPList;

				} else {
					Alert.alert(responseData.param);
				}

			})
			.catch((err) => {
				console.log('请求失败-------------->', err);
				// Alert.alert(err);
			})

	}


	_onRefresh() {
		this.setState({ isRefreshing: true });
		setTimeout(() => {
			this.setState({
				// data: data.orderData,
				isRefreshing: false
			})
		}, 1500)
	}

	// 增加 or 减少
	// countType  计算类型  0 减法 , 1 加法
	// lotType 采种类型
	_additionOrsubtract(countType, lotType) {

		let lotTypetObjct = this.state.lotTypetObjct;

		let num = 0;
		switch (lotType) {
			case 'fp_ssc':
				num = this._count(countType, lotTypetObjct.fp_sscValue, this.loginObject.fp_ssc)
				lotTypetObjct.fp_sscValue = num
				break;
			case 'fp_pcdd':
				num = this._count(countType, lotTypetObjct.fp_pcddValue, this.loginObject.fp_pcdd)
				lotTypetObjct.fp_pcddValue = num
				break;
			case 'fp_k3':
				num = this._count(countType, lotTypetObjct.fp_k3Value, this.loginObject.fp_k3)
				lotTypetObjct.fp_k3Value = num
				break;
			case 'fp_pk10':
				num = this._count(countType, lotTypetObjct.fp_pk10Value, this.loginObject.fp_pk10)
				lotTypetObjct.fp_pk10Value = num
				break;
			case 'fp_3d':
				num = this._count(countType, lotTypetObjct.fp_3dValue, this.loginObject.fp_3d)
				lotTypetObjct.fp_3dValue = num
				break;
			case 'fp_11x5':
				num = this._count(countType, lotTypetObjct.fp_11x5Value, this.loginObject.fp_11x5)
				lotTypetObjct.fp_11x5Value = num
				break;
			case 'fp_lhc':
				num = this._count(countType, lotTypetObjct.fp_lhcValue, this.loginObject.fp_lhc)
				lotTypetObjct.fp_lhcValue = num
				break;
			default:
				break;
		}

		this.setState({
			lotTypetObjct: lotTypetObjct
		})

	}

	// 计算方法
	// countType  计算类型  0 减法 , 1 加法
	// value 计算值
	// maxValue 上级给的返点最大值
	// 返回计算后的值
	_count(countType, value, maxValue) {
		if (countType == 0) {
			if (value <= 0) {
				num = 0
			} else {
				num = value - 0.1
			}

		} else {
			if (value >= maxValue) {
				num = maxValue
			} else {
				num = value + 0.1
			}
		}
		return Math.round(num * 100) / 100;
	}


	// 创建邀请码
	_nextPress = () => {

		// if (!this.state.storageIP || this.state.storageIP.name.length == 0) {
		// 	Alert.alert('请先选择一个域名');
		// 	return;
		// }


		if (!Regex(this.state.lotTypetObjct.fp_sscValue, "number")) {
			Alert.alert('【时时彩】请输入有效的数值类型!');
			return;
		}
		if (!Regex(this.state.lotTypetObjct.fp_pcddValue, "number")) {
			Alert.alert('【PC蛋蛋】请输入有效的数值类型!');
			return;
		}
		if (!Regex(this.state.lotTypetObjct.fp_k3Value, "number")) {
			Alert.alert('【快3】请输入有效的数值类型!');
			return;
		}
		if (!Regex(this.state.lotTypetObjct.fp_pk10Value, "number")) {
			Alert.alert('【PK10】请输入有效的数值类型!');
			return;
		}
		if (!Regex(this.state.lotTypetObjct.fp_3dValue, "number")) {
			Alert.alert('【3D】请输入有效的数值类型!');
			return;
		}
		if (!Regex(this.state.lotTypetObjct.fp_11x5Value, "number")) {
			Alert.alert('【11选5】请输入有效的数值类型!');
			return;
		}
		if (!Regex(this.state.lotTypetObjct.fp_lhcValue, "number")) {
			Alert.alert('【六合彩】请输入有效的数值类型!');
			return;
		}

		this._createInvitationCode();
	}

	// 创建邀请码请求数据
	_createInvitationCode = () => {

		//请求参数
		let params = new FormData();
		params.append("ac", "createJoinCode");
		params.append("uid", this.loginObject.Uid);
		params.append("token", this.loginObject.Token);
		params.append("actype", this.ruleIndex); // 下级模式，0=会员，1=代理
		// params.append("eid", this.state.storageIP.id); // 获取域名域名ID,0=默认域名
		params.append('sessionkey', this.loginObject.session_key);

		params.append("vssc", this.state.lotTypetObjct.fp_sscValue); // 时时彩返点设置
		params.append("vpcdd", this.state.lotTypetObjct.fp_pcddValue); // PC蛋蛋返点设置
		params.append("vk3", this.state.lotTypetObjct.fp_k3Value); // 快3返点设置
		params.append("vpk10", this.state.lotTypetObjct.fp_pk10Value); // PK10返点设置
		params.append("v3d", this.state.lotTypetObjct.fp_3dValue); // 福彩3D返点设置
		params.append("v11x5", this.state.lotTypetObjct.fp_11x5Value); // 11选5返点设置
		params.append("vlhc", this.state.lotTypetObjct.fp_lhcValue); // 六合彩返点设置

		var promise = GlobalBaseNetwork.sendNetworkRequest(params);
		promise
			.then((responseData) => {

				if (responseData.msg == 0) {
					Alert.alert('创建邀请码成功');

				} else {
					Alert.alert(responseData.param);
				}

			})
			.catch((err) => {
				Alert.alert(err);
			})
	}

	_mesPop() {
		if (this.IPList.length > 0) {
			this.setState({
				visible: true,
			});
		} else {
			Alert.alert(
				'温馨提示',
				'还没有创建域名, 快去创建一个吧',
				[
					{ text: '确定', onPress: () => { } },
				]
			)
		}
	}




	// 跳转返点赔率表
	_jumpRebateOddsTable() {

		this.props.navigator.navigate('RebateOddsTable', {
			title: '返点赔率表', allDataArray: this.allDataArray
		})
	}


	/**
	* 获取返点赔率表网络数据
	* @private
	*/
	_fetchTableData = (type) => {
		this.allDataArray = [];
		let params = new FormData();
		params.append("ac", "getFPInfoBy0");
		params.append("tag", type);
		params.append("uid", global.UserLoginObject.Uid);
		params.append("token", global.UserLoginObject.Token);
		var promise = GlobalBaseNetwork.sendNetworkTabelRequest(params);
		promise.then(response => {

			if (response.msg == 0) {
				this.allDataArray = response.data;
			}
		}).catch((error) => {

		})
	}




	render() {

		return (
			<View style={styles.container}>
				<View style={styles.topSegmentViewStyle}>
					{/* 这里有个bug在下面写样式没有效果 */}
					<SegmentedControl style={{ width: 180, height: 30, borderColor: '#ccc', marginTop: 15 }}
						values={['会员', '代理']}
						selectedIndex={1}
						selectedColor={COLORS.appColor}

						onChange={(selectedIndex) => {
							if (this.ruleIndex == selectedIndex) {
								return;
							}

							this.ruleIndex = selectedIndex;
						}}
					/>

					<TouchableOpacity style={styles.TouchTextStyle} activeOpacity={0.3} onPress={() => this._jumpRebateOddsTable()} >
						<Text style={styles.RebateTextStyle}>点击查看返点赔率表</Text>
					</TouchableOpacity>

				</View>


				<ScrollView style={styles.midScrollStyle}>

					<View style={styles.midViewStyle}>

						{/* 1 时时彩 */}
						<View style={styles.boxViewStyle}>

							<View style={styles.leftViewSytle}>

								<Image style={styles.leftImg} source={{ uri: GlobalConfig.cpicon() + this.lotTypetImageObjct.fp_sscValue + ".png" }} />
								<Text style={styles.shishiCaiStyle}>时时彩</Text>
							</View>

							<View style={styles.rightViewSytle}>
								<View style={styles.rightTopViewSytle}>
									<TextInput
										returnKeyType="done"
										underlineColorAndroid='transparent'
										style={styles.inputText}
										keyboardType='numeric'
										defaultValue={this.state.lotTypetObjct.fp_sscValue.toString()}
										onChangeText={(text) => {
											this.state.lotTypetObjct.fp_sscValue = text;
										}}
									/>

									{/* 两个按钮 */}
									<View style={styles.arrowButtomStyle}>

										<View style={styles.leftArrow}>
											<TouchableOpacity style={styles.touchStyle} activeOpacity={0.3} onPress={() => {
												this._additionOrsubtract(0, 'fp_ssc')
											}}>
												<Image style={styles.bottomLeftImageView} source={require('../../img/subAccount/ic_subLeft.png')}></Image>
											</TouchableOpacity>
										</View>

										<View style={styles.verLineStyle} />
										<View style={styles.rightArrow}>
											<TouchableOpacity style={styles.touchStyle} activeOpacity={0.3} onPress={() => {
												this._additionOrsubtract(1, 'fp_ssc')
											}}>
												<Image style={styles.bottomLeftImageView} source={require('../../img/subAccount/ic_subRight.png')}></Image>
											</TouchableOpacity>
										</View>
									</View>
								</View>
								<Text style={styles.subTextStyle}>自身返点{this.loginObject ? this.loginObject.fp_ssc : defaultNum}可为下级设置返点0-{this.loginObject ? this.loginObject.fp_ssc : defaultNum}</Text>
							</View>
						</View>

						{/* 2 快三 */}
						<View style={styles.boxViewStyle}>

							<View style={styles.leftViewSytle}>
								<Image style={styles.leftImg} source={{ uri: GlobalConfig.cpicon() + this.lotTypetImageObjct.fp_k3Value + ".png" }} />
								<Text style={styles.shishiCaiStyle}>快三</Text>
							</View>
							<View style={styles.rightViewSytle}>
								<View style={styles.rightTopViewSytle}>
									<TextInput
										returnKeyType="done"
										underlineColorAndroid='transparent'
										style={styles.inputText}
										keyboardType='numeric'
										defaultValue={this.state.lotTypetObjct.fp_k3Value.toString()}
										onChangeText={(text) => {
											this.state.lotTypetObjct.fp_k3Value = text;
										}}
									/>
									{/* 两个按钮 */}
									<View style={styles.arrowButtomStyle}>
										<View style={styles.leftArrow}>
											<TouchableOpacity style={styles.touchStyle} activeOpacity={0.3} onPress={() => {
												this._additionOrsubtract(0, 'fp_k3')
											}}>
												<Image style={styles.bottomLeftImageView} source={require('../../img/subAccount/ic_subLeft.png')}></Image>
											</TouchableOpacity>
										</View>

										<View style={styles.verLineStyle} />

										<View style={styles.rightArrow}>
											<TouchableOpacity style={styles.touchStyle} activeOpacity={0.3} onPress={() => {
												this._additionOrsubtract(1, 'fp_k3')
											}}>
												<Image style={styles.bottomLeftImageView} source={require('../../img/subAccount/ic_subRight.png')}></Image>
											</TouchableOpacity>
										</View>
									</View>
								</View>
								<Text style={styles.subTextStyle}>自身返点{this.loginObject ? this.loginObject.fp_k3 : defaultNum}可为下级设置返点0-{this.loginObject ? this.loginObject.fp_k3 : defaultNum}</Text>
							</View>


						</View>

						{/* 3 11选5 */}
						<View style={styles.boxViewStyle}>
							<View style={styles.leftViewSytle}>
								<Image style={styles.leftImg} source={{ uri: GlobalConfig.cpicon() + this.lotTypetImageObjct.fp_11x5Value + ".png" }} />
								<Text style={styles.shishiCaiStyle}>11选5</Text>
							</View>
							<View style={styles.rightViewSytle}>
								<View style={styles.rightTopViewSytle}>
									<TextInput
										returnKeyType="done"
										underlineColorAndroid='transparent'
										style={styles.inputText}
										keyboardType='numeric'
										defaultValue={this.state.lotTypetObjct.fp_11x5Value.toString()}
										onChangeText={(text) => {
											this.state.lotTypetObjct.fp_11x5Value = text;
										}}
									/>
									{/* 两个按钮 */}
									<View style={styles.arrowButtomStyle}>
										<View style={styles.leftArrow}>
											<TouchableOpacity style={styles.touchStyle} activeOpacity={0.3} onPress={() => {
												this._additionOrsubtract(0, 'fp_11x5')
											}}>
												<Image style={styles.bottomLeftImageView} source={require('../../img/subAccount/ic_subLeft.png')}></Image>
											</TouchableOpacity>
										</View>

										<View style={styles.verLineStyle} />
										<View style={styles.rightArrow}>
											<TouchableOpacity style={styles.touchStyle} activeOpacity={0.3} onPress={() => {
												this._additionOrsubtract(1, 'fp_11x5')
											}}>
												<Image style={styles.bottomLeftImageView} source={require('../../img/subAccount/ic_subRight.png')}></Image>
											</TouchableOpacity>
										</View>
									</View>
								</View>
								<Text style={styles.subTextStyle}>自身返点{this.loginObject ? this.loginObject.fp_11x5 : defaultNum}可为下级设置返点0-{this.loginObject ? this.loginObject.fp_11x5 : defaultNum}</Text>
							</View>
						</View>

						{/* 4 福彩3D */}
						<View style={styles.boxViewStyle}>
							<View style={styles.leftViewSytle}>
								<Image style={styles.leftImg} source={{ uri: GlobalConfig.cpicon() + this.lotTypetImageObjct.fp_3dValue + ".png" }} />
								<Text style={styles.shishiCaiStyle}>福彩3D</Text>
							</View>

							<View style={styles.rightViewSytle}>
								<View style={styles.rightTopViewSytle}>
									<TextInput
										returnKeyType="done"
										underlineColorAndroid='transparent'
										style={styles.inputText}
										keyboardType='numeric'
										defaultValue={this.state.lotTypetObjct.fp_3dValue.toString()}
										onChangeText={(text) => {
											this.state.lotTypetObjct.fp_3dValue = text;
										}}
									/>

									{/* 两个按钮 */}
									<View style={styles.arrowButtomStyle}>

										<View style={styles.leftArrow}>
											<TouchableOpacity style={styles.touchStyle} activeOpacity={0.3} onPress={() => {

												this._additionOrsubtract(0, 'fp_3d')

											}}>
												<Image style={styles.bottomLeftImageView} source={require('../../img/subAccount/ic_subLeft.png')}></Image>
											</TouchableOpacity>
										</View>

										<View style={styles.verLineStyle} />

										<View style={styles.rightArrow}>
											<TouchableOpacity style={styles.touchStyle} activeOpacity={0.3} onPress={() => {
												this._additionOrsubtract(1, 'fp_3d')
											}}>
												<Image style={styles.bottomLeftImageView} source={require('../../img/subAccount/ic_subRight.png')}></Image>
											</TouchableOpacity>
										</View>
									</View>
								</View>
								<Text style={styles.subTextStyle}>自身返点{this.loginObject ? this.loginObject.fp_3d : defaultNum}可为下级设置返点0-{this.loginObject ? this.loginObject.fp_3d : defaultNum}</Text>
							</View>
						</View>


						{/* 5 PK拾 */}
						<View style={styles.boxViewStyle}>
							<View style={styles.leftViewSytle}>
								<Image style={styles.leftImg} source={{ uri: GlobalConfig.cpicon() + this.lotTypetImageObjct.fp_pk10Value + ".png" }} />
								<Text style={styles.shishiCaiStyle}>PK拾</Text>
							</View>
							<View style={styles.rightViewSytle}>
								<View style={styles.rightTopViewSytle}>
									<TextInput
										returnKeyType="done"
										underlineColorAndroid='transparent'
										style={styles.inputText}
										keyboardType='numeric'
										defaultValue={this.state.lotTypetObjct.fp_pk10Value.toString()}
										onChangeText={(text) => {
											this.state.lotTypetObjct.fp_pk10Value = text;
										}}
									/>

									{/* 两个按钮 */}
									<View style={styles.arrowButtomStyle}>

										<View style={styles.leftArrow}>
											<TouchableOpacity style={styles.touchStyle} activeOpacity={0.3} onPress={() => {

												this._additionOrsubtract(0, 'fp_pk10')

											}}>
												<Image style={styles.bottomLeftImageView} source={require('../../img/subAccount/ic_subLeft.png')}></Image>
											</TouchableOpacity>
										</View>

										<View style={styles.verLineStyle} />

										<View style={styles.rightArrow}>
											<TouchableOpacity style={styles.touchStyle} activeOpacity={0.3} onPress={() => {

												this._additionOrsubtract(1, 'fp_pk10')

											}}>
												<Image style={styles.bottomLeftImageView} source={require('../../img/subAccount/ic_subRight.png')}></Image>
											</TouchableOpacity>
										</View>
									</View>
								</View>

								<Text style={styles.subTextStyle}>自身返点{this.loginObject ? this.loginObject.fp_pk10 : defaultNum}可为下级设置返点0-{this.loginObject ? this.loginObject.fp_pk10 : defaultNum}</Text>
							</View>
						</View>

						{/* 6 PC蛋蛋 幸运28 */}
						<View style={styles.boxViewStyle}>
							<View style={styles.leftViewSytle}>
								<Image style={styles.leftImg} source={{ uri: GlobalConfig.cpicon() + this.lotTypetImageObjct.fp_pcddValue + ".png" }} />
								<Text style={styles.shishiCaiStyle}>PC蛋蛋</Text>
							</View>
							<View style={styles.rightViewSytle}>
								<View style={styles.rightTopViewSytle}>
									<TextInput
										returnKeyType="done"
										underlineColorAndroid='transparent'
										style={styles.inputText}
										keyboardType='numeric'
										defaultValue={this.state.lotTypetObjct.fp_pcddValue.toString()}
										onChangeText={(text) => {
											this.state.lotTypetObjct.fp_pcddValue = text;
										}}
									/>

									{/* 两个按钮 */}
									<View style={styles.arrowButtomStyle}>

										<View style={styles.leftArrow}>
											<TouchableOpacity style={styles.touchStyle} activeOpacity={0.3} onPress={() => {

												this._additionOrsubtract(0, 'fp_pcdd')

											}}>
												<Image style={styles.bottomLeftImageView} source={require('../../img/subAccount/ic_subLeft.png')}></Image>
											</TouchableOpacity>
										</View>

										<View style={styles.verLineStyle} />

										<View style={styles.rightArrow}>
											<TouchableOpacity style={styles.touchStyle} activeOpacity={0.3} onPress={() => {

												this._additionOrsubtract(1, 'fp_pcdd')

											}}>
												<Image style={styles.bottomLeftImageView} source={require('../../img/subAccount/ic_subRight.png')}></Image>
											</TouchableOpacity>
										</View>
									</View>
								</View>
								<Text style={styles.subTextStyle}>自身返点{this.loginObject ? this.loginObject.fp_pcdd : defaultNum}可为下级设置返点0-{this.loginObject ? this.loginObject.fp_pcdd : defaultNum}</Text>
							</View>


						</View>

						{/* 7 六合彩 */}
						<View style={styles.boxViewStyle}>
							<View style={styles.leftViewSytle}>
								<Image style={styles.leftImg} source={{ uri: GlobalConfig.cpicon() + this.lotTypetImageObjct.fp_lhcValue + ".png" }} />
								<Text style={styles.shishiCaiStyle}>六合彩</Text>
							</View>

							<View style={styles.rightViewSytle}>
								<View style={styles.rightTopViewSytle}>
									<TextInput
										returnKeyType="done"
										underlineColorAndroid='transparent'
										style={styles.inputText}
										keyboardType='numeric'
										defaultValue={this.state.lotTypetObjct.fp_lhcValue.toString()}
										onChangeText={(text) => {
											this.state.lotTypetObjct.fp_lhcValue = text;
										}}
									/>

									{/* 两个按钮 */}
									<View style={styles.arrowButtomStyle}>
										<View style={styles.leftArrow}>
											<TouchableOpacity style={styles.touchStyle} activeOpacity={0.3} onPress={() => {
												this._additionOrsubtract(0, 'fp_lhc')
											}}>
												<Image style={styles.bottomLeftImageView} source={require('../../img/subAccount/ic_subLeft.png')}></Image>
											</TouchableOpacity>
										</View>

										<View style={styles.verLineStyle} />
										<View style={styles.rightArrow}>
											<TouchableOpacity style={styles.touchStyle} activeOpacity={0.3} onPress={() => {
												this._additionOrsubtract(1, 'fp_lhc')
											}}>
												<Image style={styles.bottomLeftImageView} source={require('../../img/subAccount/ic_subRight.png')}></Image>
											</TouchableOpacity>
										</View>
									</View>
								</View>
								<Text style={styles.subTextStyle}>自身返点{this.loginObject ? this.loginObject.fp_lhc : defaultNum}可为下级设置返点0-{this.loginObject ? this.loginObject.fp_lhc : defaultNum}</Text>
							</View>
						</View>


					</View>
				</ScrollView>
				<View style={styles.bottomViewStyle}>
					{/* <TouchableOpacity
						key={1}
						activeOpacity={1}
						style={styles.selectTime}
						onPress={() => {
							this._mesPop();
						}}
					>
						<Text style={[this.state.storageIP ? { color: 'black' } : { color: 'rgb(201,201,206)' }, styles.timeText]}>{this.state.storageIP ? this.state.storageIP.name : '--请选择域名--'}</Text>
					</TouchableOpacity> */}
					<TouchableOpacity
						style={styles.payBtn}
						activeOpacity={0.7}
						onPress={() => {
							this._nextPress();
						}}
					>
						<Text style={styles.payText}>创建邀请码</Text>
					</TouchableOpacity>
					<DrawalSelectBankList
						dataSource={this.IPList}
						visible={this.state.visible}
						onCancel={() => {
							this.setState({
								visible: false,
							});
						}}
						onPress={(item) => {
							this.setState({
								visible: false,
								storageIP: item,
							});
						}}
					/>
				</View>
			</View >
		);
	}


}



const styles = StyleSheet.create({

	container: {
		flex: 1,
		backgroundColor: '#ffffff',
	},

	topSegmentViewStyle: {
		width: SCREEN_WIDTH,
		// flexDirection: "row",
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingLeft: 10,
		height: 90,
	},

	TouchTextStyle: {
		width: SCREEN_WIDTH,
		height: 25,
		alignItems: 'center',
		justifyContent: 'center',
		// marginRight: 15,
		marginBottom: 10,
	},

	RebateTextStyle: {
		color: COLORS.appColor,
		fontSize: 14,
		textAlign: 'right',
	},

	// ****** 中间 ******
	midScrollStyle: {
		flex: 0.8,
		backgroundColor: "#f3f3f3",
	},


	midViewStyle: {
		flex: 1,
		backgroundColor: '#ffffff',
	},

	boxViewStyle: {
		height: 70,
		alignItems: 'center',
		flexDirection: 'row',
		borderWidth: 1,
		borderRadius: 10,
		borderColor: '#e8e8e8',
		marginTop: 0,
		marginLeft: 10,
		marginRight: 10,
		// margin: 10,
		justifyContent: 'space-between',
	},

	// 左边
	leftViewSytle: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},

	leftImg: {
		marginLeft: 10,
		justifyContent: 'center',
		width: 50,
		height: 50,
	},

	shishiCaiStyle: {
		fontSize: FONT_SIZE(16),
		color: 'black',
		// alignItems: 'center',
		marginLeft: 10,
		textAlign: 'center',
	},


	// 右边
	rightViewSytle: {
		width: kRightViewWidth,
	},

	rightTopViewSytle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	inputText: {
		width: kInputTextWidth,
		height: 32,
		borderWidth: 1,
		borderRadius: 5,
		borderColor: '#767676',
		// marginLeft: 10,
		paddingLeft: 5,
		textAlign: 'center',
		color: 'black',
		fontSize: 14,
		padding: 0,
	},

	arrowButtomStyle: {
		flexDirection: 'row',
		width: kArrowButtomWidth,
		borderWidth: 1,
		borderRadius: 5,
		borderColor: '#e6e6e6',
		marginRight: 0,
	},

	leftArrow: {
		flex: 0.5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	verLineStyle: {
		width: 1,
		backgroundColor: '#d8d8d8',
	},
	rightArrow: {
		flex: 0.5,
		justifyContent: 'center',
		alignItems: 'center',
	},
	touchStyle: {
		flex: 1,
		width: kArrowButtomWidth / 2,
		justifyContent: 'center',
		alignItems: 'center',
	},

	bottomLeftImageView: {
		height: 16,
		width: 16,
	},

	// 下级设置返点Text
	subTextStyle: {
		fontSize: 12,
		marginTop: 5,
		color: '#767676',
	},


	// ****** 下边 ******
	bottomViewStyle: {
		height: 60,
		backgroundColor: '#ffffff',
		justifyContent: 'center',
		alignItems: 'center',
	},
	selectTime: {
		width: SCREEN_WIDTH - 80,
		height: 30,
		borderRadius: 6,
		borderColor: '#ccc',
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},

	timeText: {
		fontSize: 14,
		textAlign: 'center',

	},

	payBtn: {
		backgroundColor: COLORS.appColor,
		borderRadius: 6,
		width: SCREEN_WIDTH - 80,
		height: 35,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 8,
	},

	payText: {
		color: 'white',
		fontSize: 14,
	},

});