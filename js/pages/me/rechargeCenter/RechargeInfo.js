'use strict';

import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
    NativeModules,
    Linking,
    Clipboard,
} from 'react-native';

import Regex from '../../../skframework/component/Regex';

class RechargeInfo extends Component {

	static navigationOptions = ({navigation}) => ({

        header: (
			<CustomNavBar
				centerText = {navigation.state.params ? navigation.state.params.navTitle : null}
				leftClick={() => navigation.goBack()}
			/>
        ),

    });

	constructor(props) {
	  	super(props);
	  	this.payObject = null;
		this.loginObject = null;
		this.recharNumber = '';
		this.nikeName = '';
		this.placeholder = '';
		this.state = {
			refreshCode:false,
		};
	}

	componentWillMount() {
        this.loginObject = this.props.navigation.state.params.loginObject;
		this.payObject = this.props.navigation.state.params.payObject;
		this.recharNumber = this.props.navigation.state.params.recharNumber;
        this.defaultSteps = this.props.navigation.state.params.defaultSteps;
        this.qrcodeURL = this.payObject.qrcode;
	}

	componentDidMount() {
		global.RechargeInfoRouteKey = this.props.navigation.state.key;
        this.props.navigation.setParams({
            navTitle:this._platform(),
        });
	}

	componentWillUnmount() {
		global.RechargeInfoRouteKey = null;
		global.BankTransferInfoRouteKey = null;
	}

    render() {
	    return (
	      <ScrollView 
	      	  automaticallyAdjustContentInsets={false}
        	  alwaysBounceHorizontal = {false}
        	  keyboardDismissMode={global.iOS?'on-drag':'none'}
        	  showsVerticalScrollIndicator={false}
              style={styles.container}
          >
              <View style={styles.tipView}>
                  <Image source={require('./img/ic_recharge_circle.png')} style={{ width: 20, height: 20 }} />
                  <CusBaseText style={styles.tipText}>{this._topTips()}</CusBaseText>
              </View>
              {this.payObject.man == 1 ?
                  <TextInput
                      style={styles.nikeNameInput}
                      placeholder={this.placeholder}
                      underlineColorAndroid='transparent'
                      defaultValue={this.nikeName}
                      onChangeText={(text) => {
                          this.nikeName=text;
                      }}
                  />:null
              }
              <View style={{height:1,backgroundColor:'rgb(240,240,240)'}} />
              <View style={styles.rechargInfo}>
		      	<View>
                    {this.payObject.man == 0 ?
                        <CusBaseText style={styles.prex}>订 单 号   ：</CusBaseText>:null
                    }
                    <CusBaseText style={styles.prex}>充值金额 ：</CusBaseText>
                    {this._showPrexView()}
		      	</View>
		      	<View>
                    {this.payObject.man == 0 ?
                        <CusBaseText style={styles.prex}>{this.payObject.orderNumber}</CusBaseText>:null
                    }
                    <View style={{marginTop:10,flexDirection:'row',alignItems:'center'}}>
                        <CusBaseText style={{fontSize:16,color:COLORS.appColor}}>{this.recharNumber}</CusBaseText>
                        <CusBaseText style={{color:'#535353',fontSize:15,marginLeft:2}}>元</CusBaseText>
                    </View>
                    {this._showValueView()}
		      	</View>
		      </View>
		      <TouchableOpacity
		        activeOpacity={1}
		      	style={styles.codeBtn}
		      	onPress={this._refreshCode}
		      >
		      	<Image
			      	style={styles.codeImg}
			      	source={this.state.refreshCode ? require('./img/ic_refreshCode.png') : {uri:this.qrcodeURL} }
			      	onError={({nativeEvent: {error}}) => {
	                    this.setState({
	                        refreshCode:true,
	                    });
	                }}
			     />
		      </TouchableOpacity>
              <TouchableOpacity
		        activeOpacity={1}
		      	style={styles.prepBtn}
		      	onPress={() => this._nowPay()}
		      >
		      	 <CusBaseText style={styles.btnText}>立即充值</CusBaseText>
		      </TouchableOpacity>
              <View style={styles.explain}>
                  <CusBaseText style={styles.explainText}>扫码步骤：</CusBaseText>
                  <CusBaseText style={styles.explainText}>1、点立即充值将自动保存二维码到相册，并且打开{this.payObject.title}</CusBaseText>
                  <CusBaseText style={styles.explainText}>2、请在{this.payObject.title}中打开“扫一扫”</CusBaseText>
                  <CusBaseText style={styles.explainText}>3、在扫一扫中点击右上角，选择“从相册选取二维码”选取二维码的图片</CusBaseText>
                  <CusBaseText style={styles.explainText}>4、输入您预充值的金额并进行转账。如充值未及时到账，请联系在线客服</CusBaseText>
              </View>
		      <LoadingView ref="LoadingView"/>
	      </ScrollView>
	    );
	}

	_showStepInstruct = () => {
	    let stepInstruct = '';
        if (this.payObject.title == '微信') {
            stepInstruct = this.defaultSteps.wx;
        }else if (this.payObject.title == '支付宝') {
            stepInstruct = this.defaultSteps.ali;
        }else if (this.payObject.title == 'QQ') {
            stepInstruct = this.defaultSteps.qq;
        }
        stepInstruct = stepInstruct.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&&quot;/g, "").replace(/&#039;/g, "");
        return '扫码步骤:\n'+ stepInstruct;
    }

	_showPrexView = () => {
	    if (this.payObject.show == 1) {
            return (<View>
                <CusBaseText style={styles.prex}>收款账号 ：</CusBaseText>
                <CusBaseText style={styles.prex}>收 款 人   ：</CusBaseText>
            </View>);
	    }
	    return null;
    }

    _showValueView = () => {
        if (this.payObject.show == 1) {
            return (
                <View style={{marginTop:8,flex:1}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <CusBaseText style={{fontSize:15,color:'#ff7c34'}}>{this.payObject.account}</CusBaseText>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{borderRadius:10,borderColor:COLORS.appColor,borderWidth:1,marginLeft:25,
                                width:53,height:20,justifyContent:'center',alignItems:'center'}}
                            onPress={() => {
                                Clipboard.setString(this.payObject.account);
                            }}
                        >
                            <CusBaseText style={{color:COLORS.appColor,fontSize:15}}>复制</CusBaseText>
                        </TouchableOpacity>
                    </View>
                    <CusBaseText style={styles.prex}>{this.payObject.nickname}</CusBaseText>
                </View>);
        }
        return null;
    }

    _platform = () => {
        if (this.payObject.title == '微信') {
            this.placeholder = '请输入微信昵称';
            return '微信转账';
        }else if (this.payObject.title == '支付宝') {
            this.placeholder = '请输入支付宝昵称';
            return '支付宝转账';
        }else if (this.payObject.title == 'QQ') {
            this.placeholder = '请输入qq号码';
            return 'QQ钱包转账';
        }
    }

    _topTips = () => {
	    let tip = null;
	    if (this.payObject.man == 0){
            tip = '第三方转账信息';
        }else {
            tip = '转账信息';
        }
        if (this.payObject.title == 'QQ') {
            return this.payObject.title + '钱包' + tip;
        }
        return this.payObject.title + tip;
    }

    _refreshCode = () => {
		if (this.state.refreshCode === true) {
			this.setState({
				refreshCode: false,
			});
		}
	}

	_nowPay = () => {
        if (this.payObject.man == 1) {
            if (this.payObject.title == 'QQ') {
                if (global_isSpace(this.nikeName) || this.nikeName.trim().length == 0) {
                    this.refs.LoadingView && this.refs.LoadingView.showFaile("请输入qq号码");
                    return;
                }
                if (!Regex(this.nikeName, "qq")) {
                    this.refs.LoadingView && this.refs.LoadingView.showFaile('请输入合法的qq号码');
                    return;
                }
            }
            if (global_isSpace(this.nikeName) || this.nikeName.trim().length == 0) {
                this.refs.LoadingView && this.refs.LoadingView.showFaile("请输入昵称");
                return;
            }
        }

        Alert.alert(
			            '提示',
			            '是否为您保存二维码到本地相册，并为您打开'+this.payObject.title+'吗?',
			            [
			              {text: '取消', onPress: () => {}},
			              {text: '确定', onPress: () => {
			              		this._saveCodeImg();
			              }}
			            ]
			        );
	}

	//长按保存二维码到相册
	_saveCodeImg = () => {
        NativeModules.RNBridgeModule.savePhoto(this.qrcodeURL,(result)=>{
            if (result.length == 0) { //成功
                //第三方直接打开
                if (this.payObject.man == 0) {
                    this._openAPPURL();
                }else {
                    this._postPayData();
                }
            }else {
                Alert.alert(result);
            }
        });

	}

	_openAPPURL = () => {
		// '微信' 'QQ'
        let openURL = null;
        if (this.payObject.title == '微信') {
            openURL =Android?"tencent.mm": 'weixin://';
        }else if (this.payObject.title == '支付宝') {
            openURL = Android?"AlipayGphone":'alipay://';
        }else if (this.payObject.title == 'QQ') {
            openURL =Android?"mobileqq": 'mqq://';
        }
        if (openURL == null) {
            this.refs.LoadingView && this.refs.LoadingView.showFaile('无法打开未知的平台');
            return;
        }
        Linking.canOpenURL(openURL).then(supported => {
            if(supported) {
                Linking.openURL(openURL);
            }else {
                this.refs.LoadingView && this.refs.LoadingView.showFaile('请先安装'+this.payObject.title);
            }
        });
	}

    //支付信息
    _postPayData = () => {
        let params = new FormData();
        params.append("ac", "submitPayQrcode");
        params.append("type", this.payObject.type);
        params.append("account", this.nikeName.trim());
        params.append("price", this.recharNumber);
        params.append("id", this.payObject.id);
        params.append("uid", this.loginObject.Uid);
        params.append('token', this.loginObject.Token);
		params.append('sessionkey', this.loginObject.session_key);
        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((response) => {
                if (response.msg == 0) {
                    this._openAPPURL();
                }else {
                    this.refs.LoadingView && this.refs.LoadingView.showFaile('充值信息提交失败');
                }
            })
            .catch((err) => {
                this.refs.LoadingView && this.refs.LoadingView.showFaile(err);
            })
    }

}

const styles = StyleSheet.create({

	container:{
		flex:1,
		backgroundColor:'white',
	},
	tipView:{
        flexDirection: 'row',
        alignItems:'center',
		backgroundColor:'rgb(240,240,240)',
		height:45,
		paddingLeft:15,
	},
	tipText:{
		fontSize:15,
		color:'#707070',
        marginLeft:15,
	},
    nikeNameInput:{
        marginLeft:36,
        height:40,
        fontSize:15,
    },
	rechargInfo:{
		flexDirection: 'row',
		marginLeft:15,
        marginRight:15,
	},
	prex:{
        marginTop:10,
		fontSize:15,
		color: '#535353',
	},
	codeBtn:{
		marginTop:20,
		width:145,
		height:145,
		marginLeft:(SCREEN_WIDTH-145)/2,
		marginBottom: 10,
		backgroundColor:'#ccc',
	},
	codeImg:{
	    flex:1,
		resizeMode:'contain',
		// width:145,
		// height:145,
	},
	prepBtn:{
		backgroundColor:COLORS.appColor,
		borderRadius:5,
		justifyContent:'center',
		alignItems: 'center',
		marginLeft: 20,
		marginRight: 20,
		height:40,
		marginTop: 10,
	},
	btnText:{
		color:'white',
		fontSize:15,
	},
    stepInstruct:{
        color: '#535353',
        fontSize:15,
        margin:15,
    },
    explain:{
        margin:20,
    },
    explainText:{
        marginTop: 10,
    },

});


export default RechargeInfo;
