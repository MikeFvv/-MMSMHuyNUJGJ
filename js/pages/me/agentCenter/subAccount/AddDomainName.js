// 添加域名界面


'use strict';

import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
    TextInput,
    Image,
} from 'react-native';

import DrawalSelectBankList from '../../drawalCenter/DrawalSelectBankList';
import Regex from '../../../../skframework/component/Regex';

var registerKey = '';  //验证码秘钥

export default class AddDomainName extends Component {

    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.title,
        headerStyle: { backgroundColor: COLORS.appColor, marginTop: Android ? (parseFloat(global.versionSDK) > 19 ? StatusBar.currentHeight : 0) : 0 },
        headerTitleStyle: { color: 'white' },
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
            ruleIndex: this.props.currentIndex,

            storagePtype: null,
            visible: false,

            storageIP: null,
            ipVisible: false,
            inputVerNum: '',  //验证码
            inputVerImg: '', //验证码图片

        }
        this.ptypeList = [{ 'id': 0, 'name': '不填邀请码' }, { 'id': 1, 'name': '必填邀请码' }];
        this.IPList = [];

        this.loginObject = null;
        this.domainName = '';
        this.remark = '';

    }


    componentDidMount() {
        this.setState({
            storagePtype: this.ptypeList[0],
        })

        this._getUserInfo();
    }

    _getUserInfo() {

        this.loginObject = global.UserLoginObject;
        this._fetchData();
    }

    _fetchData() {

        let params = new FormData();
        params.append("ac", "getEnomLIplist");
        params.append("uid", this.loginObject.Uid);
        params.append('token', this.loginObject.Token);
        params.append('sessionkey', this.loginObject.session_key);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                if (responseData.msg == 0) {
                    // Alert.alert(responseData.param);

                    let IPList = [];

                    responseData.data.map((item) => {
                        IPList.push({ id: item.id, name: item.ip });
                        // IPList = item.data;
                    })

                    this.IPList = IPList

                } else {
                    Alert.alert(responseData.param);
                }

            })
            .catch((err) => {
                console.log('请求失败-------------->', err);
                // Alert.alert(err);
            })

    }


    // 确认添加
    _nextPress = () => {

        if (!this.domainName || this.domainName.length == 0) {
            Alert.alert('请填写域名!');
            return;
        }

        if (!Regex(this.domainName, "enom")) {
            Alert.alert('该域名不合法！请重新输入!');
            return;
        }

        // if (!this.state.storagePtype || this.state.storagePtype.name.length == 0) {
        //     Alert.alert('请填写邀请码');
        //     return;
        // }

        if (!this.state.storageIP || this.state.storageIP.name.length == 0) {
            Alert.alert('请选择解析IP');
            return;
        }

        this._postAddDomainNameInfo();
    }


    // 确认添加 域名
    _postAddDomainNameInfo = () => {

        this.refs.LoadingView && this.refs.LoadingView.showLoading('正在添加...');

        let params = new FormData();

        params.append("ac", "addNewUserEnom");
        params.append("uid", this.loginObject.Uid);
        params.append('token', this.loginObject.Token);
        params.append("enom", this.domainName);// 需要添加的域名地址
        params.append("ip", this.state.storageIP.id); // 选中的可用ip的id
        params.append("remark", this.remark); // 获取域名备注
        params.append('vcode', this.state.inputVerNum);
        params.append('vid', registerKey);

        // params.append("ptype", this.state.storagePtype.id);// 邀请码模式: 0=不填 1=必填
        params.append('sessionkey', this.loginObject.session_key);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                this.refs.LoadingView && this.refs.LoadingView.showSuccess();

                if (responseData.msg == 0) {

                    this.props.navigation.goBack();
                    Alert.alert('添加成功');
                    PushNotification.emit('AddDomainNameSuccess');

                } else {
                    Alert.alert(responseData.param);
                }

            })
            .catch((err) => {
                Alert.alert(err);
            })
    }

    componentWillMount() {

        this._showCode();
    }

    //验证码随机数的方法
    _showCode() {

        let params = new FormData();

        params.append("ac", "getVerifyImage");

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);

        promise
            .then(response => {

                if (response.msg == 0) {

                    registerKey = response.data.vid;
                    this.setState({
                        inputVerImg: response.data.img,
                    })

                }
                else {
                    return '';
                }
            })
            .catch(err => {

                return '';

            });
    }



    render() {
        return (
            <View style={styles.container}>

                <View style={styles.frameViewStyle}>
                    {/* 1 域名 */}
                    <View style={styles.TypeViewStyle}>
                        <Text style={styles.titleStyle}>域名地址</Text>
                        <TextInput
                            autoCapitalize='none'
                            autoCorrect={false}
                            underlineColorAndroid='transparent'
                            style={styles.inputText}
                            placeholder='请输入域名，不用带http://'
                            onChangeText={(text) => this.domainName = text}
                        ></TextInput>
                    </View>
                    {/* 下分割线 */}
                    <View style={styles.lineViewStyle} />

                    {/* 2 邀请码 */}
                    {/* <View style={styles.TypeViewStyle}>
                        <Text style={styles.titleStyle}>邀请码</Text>
                        <TouchableOpacity
                            key={1}
                            activeOpacity={0.7}
                            style={styles.selectViewStyle}
                            onPress={() => {
                                this.setState({
                                    visible: true,
                                });
                            }}
                        >
                            <Text style={[this.state.storagePtype ? { color: 'black' } : { color: 'rgb(201,201,206)' }, styles.timeText]}>{this.state.storagePtype ? this.state.storagePtype.name : '不填邀请码'}</Text>
                        </TouchableOpacity>
                    </View> */}

                    {/* 下分割线 */}
                    {/* <View style={styles.lineViewStyle} /> */}

                    {/* 3 解析IP */}
                    <View style={styles.TypeViewStyle}>
                        <Text style={styles.titleStyle}>IP地址</Text>
                        <TouchableOpacity
                            key={1}
                            activeOpacity={0.7}
                            style={styles.selectViewStyle}
                            onPress={() => {
                                this.setState({
                                    ipVisible: true,
                                });
                            }}
                        >
                            <Text style={[this.state.storageIP ? { color: 'black' } : { color: 'rgb(201,201,206)' }, styles.timeText]}>{this.state.storageIP ? this.state.storageIP.name : '--请选择IP地址--'}</Text>
                        </TouchableOpacity>
                    </View>
                    {/* 下分割线 */}
                    <View style={styles.lineViewStyle} />

                    {/* 4 域名备注 */}
                    <View style={styles.TypeViewStyle}>
                        <Text style={styles.titleStyle}>域名备注</Text>
                        <TextInput
                            autoCapitalize='none'
                            autoCorrect={false}
                            underlineColorAndroid='transparent'
                            style={styles.inputText}
                            placeholder='请输入域名备注'
                            onChangeText={(text) => this.remark = text}
                        ></TextInput>
                    </View>
                    {/* 下分割线 */}
                    <View style={styles.lineViewStyle} />

                    <View style={styles.TypeViewStyle}>
                        <Text style={styles.titleStyle}>验证码</Text>
                        
                        <View style={styles.VerCodeImageStyle}>
                            <TextInput allowFontScaling={false} keyboardType={'number-pad'}
                                onChangeText={(text) => this.setState({ inputVerNum: text })}
                                placeholder='请输入验证码' underlineColorAndroid='transparent'
                                maxLength={4}
                                style={{ marginLeft: 5, fontSize: 15, flex: 1 }} />

                            {/*</View>*/}
                            <TouchableOpacity activeOpacity={0.7} style={{ width: Adaption.Width(110), height: 50 }} onPress={() => { this._showCode() }}>
                                <Image
                                    style={{ position: 'absolute', right: 0, bottom: 0, width: Adaption.Width(110), height: 50, resizeMode: 'contain' }}
                                    source={this.state.inputVerImg != "" ? { uri: this.state.inputVerImg } : (require('../../../login/img/ic_refreshCode.png'))}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* 下分割线 */}
                    <View style={styles.lineViewStyle} />

                </View>


                <TouchableOpacity
                    style={styles.confirmBtn}
                    activeOpacity={0.7}
                    onPress={() => {
                        this._nextPress();
                    }}
                >
                    <Text style={styles.confirmBtnText}>确认添加</Text>
                </TouchableOpacity>


                <DrawalSelectBankList
                    dataSource={this.ptypeList}
                    visible={this.state.visible}
                    onCancel={() => {
                        this.setState({
                            visible: false,
                        });
                    }}
                    onPress={(item) => {
                        this.setState({
                            visible: false,
                            storagePtype: item,
                        });
                    }}
                />

                <DrawalSelectBankList
                    dataSource={this.IPList}
                    visible={this.state.ipVisible}
                    onCancel={() => {
                        this.setState({
                            ipVisible: false,
                        });
                    }}
                    onPress={(item) => {
                        this.setState({
                            ipVisible: false,
                            storageIP: item,
                        });
                    }}
                />
                <LoadingView ref='LoadingView' />

            </View>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f3f4',
        alignItems: 'center',
    },

    frameViewStyle: {
        margin: 20,
        marginTop: 30,
        borderWidth: 1,
        backgroundColor: '#ffffff',
        borderColor: '#ececec',
        alignItems: 'center',
        borderRadius: 5,
    },


    TypeViewStyle: {
        flexDirection: 'row',
        height: 50,
        width: SCREEN_WIDTH - 15 * 2,
        alignItems: 'center',
    },

    titleStyle: {
        marginLeft: 10,
        width: 70,
        color: '#525354',
        fontSize: 16,
    },

    domainName: {
        color: 'black',
    },

    inputText: {
        flex: 1,
        height: 32,
        paddingLeft: 5,
        textAlign: 'left',
        color: 'black',
        fontSize: 15,
        padding: 0,
        marginLeft: 5,
        marginRight: 15,
    },

    lineViewStyle: {
        width: SCREEN_WIDTH - 20 * 2,
        height: 1,
        backgroundColor: '#ececec',
    },

    selectViewStyle: {
        marginLeft: 5,
        paddingLeft: 5,
    },

    confirmBtn: {
        backgroundColor: COLORS.appColor,
        borderRadius: 6,
        width: SCREEN_WIDTH - 80,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },

    confirmBtnText: {
        color: 'white',
        fontSize: 17,
    },

    selectBank: {
        marginTop: 10,
        width: 180,
        height: 30,
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    VerCodeImageStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    
});





