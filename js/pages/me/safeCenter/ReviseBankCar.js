'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TextInput,
    Alert,
  TouchableOpacity,
  ScrollView,
    StatusBar,
  DeviceEventEmitter,
  Image
} from 'react-native';

import DrawalSelectBankList from '../drawalCenter/DrawalSelectBankList';
import Regex from '../../../skframework/component/Regex'


var accountBank = '';
var accountNumber = '';
var accountProvice = '';
var accountCity = '';
var accountBankName = '';
var accountBankAdress = '';


//修改银行卡
class ReviseBankCar extends Component {

  static navigationOptions = ({ navigation }) => ({

    title: '修改银行卡',
      headerStyle: {backgroundColor: COLORS.appColor, marginTop: Android ?(parseFloat(global.versionSDK) > 19?StatusBar.currentHeight:0) : 0},
      headerTitleStyle: { color: 'white',alignSelf:'center' },
      //加入右边空视图,否则标题不居中  ,alignSelf:'center'
      headerRight: (
          <View style={GlobalStyles.nav_blank_view} />
      ),
    headerLeft: (
      <TouchableOpacity
        activeOpacity={1}
        style={GlobalStyles.nav_headerLeft_touch}
        onPress={() => { navigation.goBack() }}>
        <View style={GlobalStyles.nav_headerLeft_view} />
      </TouchableOpacity>
    ),
  });

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      dataSource: [],
      bankItem: null,
      accountName: '',
    };
    this.accountPwd = '';
  }

  //页面将要离开的是时候发送通知
  componentWillUnmount() {
    PushNotification.emit('refshBankList');
  }

  componentDidMount() {
    accountBankName = this.props.navigation.state.params.bankArray.item.value.bank_typename;
    accountBank = this.props.navigation.state.params.bankArray.item.value.bank_type;
    accountNumber = this.props.navigation.state.params.bankArray.item.value.card_num;
    accountProvice = this.props.navigation.state.params.bankArray.item.value.card_sheng;
    accountCity = this.props.navigation.state.params.bankArray.item.value.card_shi;
    accountBankAdress = this.props.navigation.state.params.bankArray.item.value.address;

    let loginObject = global.UserLoginObject;
    this.setState({ accountName: loginObject.Real_name })
    this._fetchData();
  }

  _fetchData() {

    let params = new FormData();
    params.append("ac", "getBankCardList");

    var promise = GlobalBaseNetwork.sendNetworkRequest(params);
    promise
      .then((responseData) => {
        // console.log('responseData',responseData);
        if (responseData.msg == 0) {
          this.setState({
            dataSource: responseData.data,
          });
        } else {
          Alert.alert(responseData.param);
        }

      })
      .catch((err) => {
        // console.log('请求失败-------------->', err);
      })
  }
  changeMoney(text){
    accountBankName = text;
    accountBank = '-1';
  }
 
  render() {

    return (
      <ScrollView
        onContentSizeChange={(contentWidth, contentHeight) => this._contentChange(contentWidth, contentHeight)}
        style={styles.container}
        automaticallyAdjustContentInsets={false}
        alwaysBounceHorizontal={false}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode={global.iOS ? 'on-drag' : 'none'}
      >

        <View style={styles.titleView}>
          <View style={styles.redView} />
          <CusBaseText style={styles.title}>卡号信息</CusBaseText>
        </View>
        <View style={styles.countView}>
          <CusBaseText style={styles.prex}>开户人姓名：</CusBaseText>
          <TextInput
            returnKeyType="done"
            underlineColorAndroid='transparent'
            defaultValue={global.UserLoginObject.Real_name}
            editable = {false}
            style={styles.value}
            keyboardType={global.iOS ? 'number-pad' : 'numeric'}
          ></TextInput>
        </View>
        <View style={styles.countView}>
					<CusBaseText style={styles.prex}>开户银行：</CusBaseText>
					<TextInput
						returnKeyType="done"
						underlineColorAndroid='transparent'
						style={{flex:0.8,fontSize: 14,height: 44,padding: 0,}}
			      defaultValue={accountBankName}
						keyboardType={global.iOS ? 'number-pad' : 'numeric'}
            onChangeText={(text)=>this.changeMoney(text)}
					></TextInput>
					<TouchableOpacity
						style={styles.selectBank}
						activeOpacity={1}
						onPress={() => {
							this.setState({
								visible: true,
							});
						}}
					>
					  <Image
              style={{width:15,height:15}}
              source={require('./img/ic_bankjiantou.png')}
            />
					</TouchableOpacity>
				</View>
        {/* <View style={styles.countView}>
          <CusBaseText style={styles.prex}>开户银行：</CusBaseText>
          <TouchableOpacity
            style={styles.selectBank}
            activeOpacity={1}
            onPress={() => {
              this.setState({
                visible: true,
              });
            }}
          >
            <CusBaseText style={this.state.bankItem ? { color: 'black' } : { color: 'rgb(201,201,206)' }}>{this.state.bankItem ? this.state.bankItem : accountBankName}</CusBaseText>
          </TouchableOpacity>
        </View> */}
        <View style={styles.countView}>
          <CusBaseText style={styles.prex}>银行账号：</CusBaseText>
          <TextInput
            returnKeyType="done"
            underlineColorAndroid='transparent'
            defaultValue={accountNumber}
            style={styles.value}
            keyboardType={global.iOS ? 'number-pad' : 'numeric'}
            onChangeText={(text) => accountNumber = text}
          ></TextInput>
        </View>
        <View style={styles.countView}>
          <CusBaseText style={styles.prex}>开户省/市：</CusBaseText>
          <TextInput
            underlineColorAndroid='transparent'
            style={styles.value}
            defaultValue={accountProvice}
            onChangeText={(text) => accountProvice = text}
          ></TextInput>
        </View>
 
        <View style={styles.countView}>
					<CusBaseText style={styles.prex}>开户行详细地址：</CusBaseText>
					<TextInput
						underlineColorAndroid='transparent'
						style={styles.value}
						defaultValue={accountBankAdress}
						onChangeText={(text) => accountBankAdress = text}
					></TextInput>
				</View>
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
        <TouchableOpacity
          style={styles.btn}
          activeOpacity={1}
          onPress={() => this._confirmClicked()}
        >
          <CusBaseText style={styles.btnText}>确认修改</CusBaseText>
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
            accountBankName = item.name;
            accountBank = item.id;
            this.setState({
              visible: false,
              bankItem: item.name,
            });
          }}
        />
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

    if (this.state.accountName.length == 0 || accountBank.length == 0 || accountNumber.length == 0 || accountProvice.length == 0 ) {
      Alert.alert('请完善信息');
      return;
    }

    if (this.accountPwd.length < 4) {
      Alert.alert('请输入4位交易密码');
      return;
    }

    if (!Regex(accountNumber.trim(), "bankcard")) {
      Alert.alert('该银行账号不合法！请重新输入!');
      return;
    }

    this._getUserInfo();
  }

  _getUserInfo() {

      var loginObject = global.UserLoginObject;
      this._postBankData(loginObject.Uid, loginObject.Token);
  }

  _postBankData = (uid, token) => {

    let params = new FormData();
    params.append("ac", "updateUserBankCard");
    params.append("uid", global.UserLoginObject.Uid);
    params.append("token", global.UserLoginObject.Token);
    params.append("id", this.props.navigation.state.params.bankArray.item.value.id);
    params.append("type", accountBank);
    params.append("card_num", accountNumber);
    params.append("card_sheng", accountProvice);
    params.append("address", accountBankAdress);
    params.append("more_bank",accountBank=='-1'?accountBankName:'');
    params.append("tk_pass", this.accountPwd);
    params.append("sessionkey", global.UserLoginObject.session_key);

    var promise = GlobalBaseNetwork.sendNetworkRequest(params);
    promise
      .then((responseData) => {

        // console.log('responseData',responseData);

        if (responseData.msg == 0) {
          global.BankListArray[this.props.navigation.state.params.bankArray.index].value.address = accountBankAdress;
          global.BankListArray[this.props.navigation.state.params.bankArray.index].value.bank_type = accountBank;
          global.BankListArray[this.props.navigation.state.params.bankArray.index].value.bank_typename = accountBankName;
          global.BankListArray[this.props.navigation.state.params.bankArray.index].value.card_num = accountNumber;
          global.BankListArray[this.props.navigation.state.params.bankArray.index].value.card_sheng = accountProvice;
         
          this.props.navigation.state.params.callback();
          this.props.navigation.goBack()
        } else {
          Alert.alert(responseData.param);
        }

      })
      .catch((err) => {
        Alert.alert(err);
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
    marginTop: 35,
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
    borderBottomWidth: 0.6,
    borderColor: '#ccc',
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
  },

  btnText: {
    color: 'white',
    fontSize: 16,
  },

  selectBank: {
    flex: 0.2,
    justifyContent: 'center',
    height: 44,
    // backgroundColor:'red'
  },

});


export default ReviseBankCar;
