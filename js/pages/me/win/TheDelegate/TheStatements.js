import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Image,
    View,
    Dimensions,
    Platform,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
    ScrollView,
    Alert,
    TextInput,
    FlatList,
    Modal,
} from 'react-native';

import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import BaseNetwork from "../../../../skframework/component/BaseNetwork"; //网络请求
import Adaption from "../../../../skframework/tools/Adaption"; //字体适配
import DrawalSelectBankList from '../../drawalCenter/DrawalSelectBankList';
import Moment from 'moment';
import HuoCalendar from "../../welfareTask/HuoCalendar";

const {width, height} = Dimensions.get("window");
const KAdaptionWith = width / 414;
const KAdaptionHeight = height / 736;

let loginObject = null;
let alertName = '';   //请求失败接受后台返回的数据字段
let dataArray = [];


export default class TheStatements extends Component {

    static navigationOptions = ({navigation}) => ({


        header: (
            <CustomNavBar
                centerText={navigation.state.params.title}
                leftClick={() => navigation.goBack()}
                rightView={(
                    navigation.state.params ? (
                        <TouchableOpacity activeOpacity={1} style={{
                            width: 80,
                            marginTop: SCREEN_HEIGHT == 812 ? 38 : 14,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: 10
                        }}
                                          onPress={navigation.state.params ? navigation.state.params.navigateRightPress : null}>
                            <Text allowFontScaling={false} style={{
                                fontSize: 14,
                                color: 'white',
                                backgroundColor: 'transparent',
                                textAlign: 'center'
                            }}>
                                {navigation.state.params.choiceData}
                            </Text>
                            <Image style={{width: 12 * KAdaptionWith, height: 15 * KAdaptionHeight, marginLeft: 5}}
                                   source={require("./img/ic_xiangxia.png")}
                            />
                        </TouchableOpacity>) : null
                )}
            />
        ),

    });

    constructor(props) {

        super(props);

        this.state = {
            weatherdataSource: {},
            isShowReceiveRedEnvelope: false,
            next_uid: '',   // 从下级管理 下级报表传过来的值请求的下级数据 _uid 判断是那个会员或代理下级
            isSearchName: '',  // 从下级管理 下级报表传过来的值请求的下级数据 _uid 判断是那个会员或代理下级

        };

        this.timeData = 0
        this.jintitanlist = 0;
        this.zuotianlist = 0;
        this.benzhoulist = 0;
        this.benyuelist = 0;
        this.shangyelist = 0;
        this.dataListdata = this.props.navigation.state.params.jintitanlist;
        this.searchId = this.props.navigation.state.params.searchId ? this.props.navigation.state.params.searchId : '';
        // this.next_uid = this.props.navigation.state.params.next_uid?this.props.navigation.state.params.next_uid:'';
        // this.isSearchName = this.props.navigation.state.params.isSearchName?this.props.navigation.state.params.isSearchName:'';
        this.jintianData = {};
        this.zuotianData = {};
        this.benzhouData = {};
        this.benyueData = {};
        this.shangyeData = {};
        this.newTime = Moment().format('YYYY-MM-DD HH:mm:ss');
        let day = '0';
        if (HuoCalendar.getDate() < 10) {
            day = '0' + HuoCalendar.getDate()
        } else {
            day = HuoCalendar.getDate()
        }

        //开始时间  //结束时间
        this.showRedEnvelopeArray = [{key: 0, value: '今天'}, {key: 1, value: '昨天'}, {key: 2, value: '本周'}, {
            key: 3,
            value: '本月'
        }, {key: 4, value: '上月'}]
    }

    _navigateRightPress = () => {
        this.setState({
            isShowReceiveRedEnvelope: true,
        });
    }

    //视图即将要出现的时候判断 上一个下级管理，下级表报那边 传过来是是否为空
    componentWillMount() {
        this.setState({
            // searchId:this.props.navigation.state.params.searchId==null ?'':this.props.navigation.state.params.searchId,
            next_uid: this.props.navigation.state.params.next_uid == null ? '' : this.props.navigation.state.params.next_uid,
            isSearchName: this.props.navigation.state.params.isSearchName == null ? '' : this.props.navigation.state.params.isSearchName,
        })
    }

    componentDidMount() {

        if (global.UserLoginObject.Uid != '') {
            this._fetchPersonalMessageData();

        } else {
            Alert.alert(
                '温馨提示',
                '登录超时,请重新登录',
                [
                    {
                        text: '确定', onPress: () => {
                    }
                    },
                ]
            )
        }

    }

    _fetchNoData() {
        //请求参数
        let params = new FormData();
        params.append("ac", "getDailiStaticData");
        params.append("uid", global.UserLoginObject.Uid);
        params.append('token', global.UserLoginObject.Token);
        params.append("lasttime", this.timeData);
        params.append('sessionkey', global.UserLoginObject.session_key);

        // 判断是否是从 1下级表报 或 2下级管理 还是 代理报表传过来的值是否为空
        if (this.state.isSearchName === '1') {
            params.append("search", "");
        } else {

            params.append("search", this.searchId);
        }

        params.append("user_id", this.state.next_uid);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then(response => {

                if (response.msg == 0) {
                    this.setState({weatherdataSource: response.data,});

                } else {
                    this._showInfo(response.param);
                }

            })
            .catch(err => {
                if (err && typeof(err) === 'string' && err.length > 0) {
                    this._showInfo(alertName)
                }
            });

    }

    //代理报表数据
    _fetchPersonalMessageData() {


        if (this.dataListdata == 1) {
            this.jintianData = this.props.navigation.state.params.jintianData;

            this.setState({weatherdataSource: this.props.navigation.state.params.jintianData});
            //设置初始导航栏的值
            this.props.navigation.setParams({
                navigateRightPress: this._navigateRightPress,
                choiceData: '今天',
            });
        } else {


            this.refs.LoadingView && this.refs.LoadingView.showLoading('正在加载中...');
            //请求参数
            let params = new FormData();
            params.append("ac", "getDailiStaticData");
            params.append("uid", global.UserLoginObject.Uid);
            params.append('token', global.UserLoginObject.Token);
            params.append("lasttime", this.timeData);
            params.append('sessionkey', global.UserLoginObject.session_key);
            // 判断是否是从 1下级表报 或 2下级管理 还是 代理报表传过来的值是否为空
            if (this.state.isSearchName === '1') {
                params.append("search", "");
            } else {

                params.append("search", this.searchId);
            }

            params.append("user_id", this.state.next_uid);

            var promise = GlobalBaseNetwork.sendNetworkRequest(params);
            promise
                .then(response => {

                    if (response.msg == 0) {
                        this.jintianData = response.data;
                        this.jintitanlist = 1;
                        this.setState({weatherdataSource: response.data,});
                        //设置初始导航栏的值
                        this.props.navigation.setParams({
                            navigateRightPress: this._navigateRightPress,
                            choiceData: '今天',
                        });
                    } else {
                        this.props.navigation.setParams({
                            navigateRightPress: this._navigateRightPress,
                            choiceData: '今天',
                        });
                        this._showInfo(response.param);
                    }

                })
                .catch(err => {
                    if (err && typeof(err) === 'string' && err.length > 0) {
                        this.props.navigation.setParams({
                            navigateRightPress: this._navigateRightPress,
                            choiceData: '今天',
                        });
                        this._showInfo('请求服务器失败')
                    }
                });

        }

        //昨天
        //请求参数
        let zuotianParams = new FormData();
        zuotianParams.append("ac", "getDailiStaticData");
        zuotianParams.append("uid", global.UserLoginObject.Uid);
        zuotianParams.append('token', global.UserLoginObject.Token);
        zuotianParams.append("lasttime", "1");
        zuotianParams.append('sessionkey', global.UserLoginObject.session_key);

        // zuotianParams.append("search", this.searchId);
        // 判断是否是从 1下级表报 或 2下级管理 还是 代理报表传过来的值是否为空
        if (this.state.isSearchName === '1') {
            zuotianParams.append("search", "");
        } else {

            zuotianParams.append("search", this.searchId);
        }

        zuotianParams.append("user_id", this.state.next_uid);

        var promise = GlobalBaseNetwork.sendNetworkRequest(zuotianParams);
        promise
            .then(response => {

                if (response.msg == 0) {
                    this.zuotianlist = 1;
                    this.zuotianData = response.data;

                } else if (response.msg == 1) {
                    Alert.alertp(param)
                }

            })
            .catch(err => {
            });

        //本周
        //请求参数
        let benzhouParams = new FormData();
        benzhouParams.append("ac", "getDailiStaticData");
        benzhouParams.append("uid", global.UserLoginObject.Uid);
        benzhouParams.append('token', global.UserLoginObject.Token);
        benzhouParams.append("lasttime", "2");
        benzhouParams.append('sessionkey', global.UserLoginObject.session_key);

        // 
        // benzhouParams.append("search", this.searchId);
        // 判断是否是从 1下级表报 或 2下级管理 还是 代理报表传过来的值是否为空
        if (this.state.isSearchName === '1') {
            benzhouParams.append("search", "");
        } else {

            benzhouParams.append("search", this.searchId);
        }

        benzhouParams.append("user_id", this.state.next_uid);

        var promise = GlobalBaseNetwork.sendNetworkRequest(benzhouParams);
        promise
            .then(response => {

                if (response.msg == 0) {
                    this.benzhoulist = 1;
                    this.benzhouData = response.data;

                }

            })
            .catch(err => {
            });
        //本月
        //请求参数
        let benyueParams = new FormData();
        benyueParams.append("ac", "getDailiStaticData");
        benyueParams.append("uid", global.UserLoginObject.Uid);
        benyueParams.append('token', global.UserLoginObject.Token);
        benyueParams.append("lasttime", "3");
        benyueParams.append('sessionkey', global.UserLoginObject.session_key);

        // benyueParams.append("search", this.searchId);
        // 判断是否是从 1下级表报 或 2下级管理 还是 代理报表传过来的值是否为空
        if (this.state.isSearchName === '1') {
            benyueParams.append("search", "");
        } else {

            benyueParams.append("search", this.searchId);
        }

        benyueParams.append("user_id", this.state.next_uid);

        var promise = GlobalBaseNetwork.sendNetworkRequest(benyueParams);
        promise
            .then(response => {

                if (response.msg == 0) {
                    this.benyuelist = 1;
                    this.benyueData = response.data;

                }

            })
            .catch(err => {
            });
        //上月
        //请求参数
        let shangyueParams = new FormData();
        shangyueParams.append("ac", "getDailiStaticData");
        shangyueParams.append("uid", global.UserLoginObject.Uid);
        shangyueParams.append('token', global.UserLoginObject.Token);
        shangyueParams.append("lasttime", "4");
        shangyueParams.append('sessionkey', global.UserLoginObject.session_key);
        // shangyueParams.append("search", this.searchId);
        // 判断是否是从 1下级表报 或 2下级管理 还是 代理报表传过来的值是否为空
        if (this.state.isSearchName === '1') {
            shangyueParams.append("search", "");
        } else {

            shangyueParams.append("search", this.searchId);
        }

        shangyueParams.append("user_id", this.state.next_uid);

        var promise = GlobalBaseNetwork.sendNetworkRequest(shangyueParams);
        promise
            .then(response => {

                if (response.msg == 0) {
                    this.shangyelist = 1;
                    this.shangyeData = response.data;

                }

            })
            .catch(err => {
            });
    }

    //弹出框
    onRequestClose() {
        this.setState({
            isShowReceiveRedEnvelope: false,
        })
    }

    _keyExtractor = (item, index) => {
        return String(index);
    }

    //this.endTime/homeTime="",// 0=当天, 1=昨天, 2=本周, 3=本月,  4=上月  默认为当天
    _onAcitveClickData(item) {

        this.setState({
            isShowReceiveRedEnvelope: false,
        });


        // 点击相同的选项不重复load data
        if (this.props.navigation.state.params.choiceData === item.item.value) {
            return;
        }

        if (item.index == 0) {
            //设置初始导航栏的值
            this.props.navigation.setParams({
                choiceData: '今天',
            });
            this.setState({
                weatherdataSource: this.jintianData,
            });
        } else if (item.index == 1) {
            //设置初始导航栏的值
            this.props.navigation.setParams({
                choiceData: '昨天',
            });
            if (this.zuotianlist == 1) {
                this.setState({
                    weatherdataSource: this.zuotianData,
                });
            } else {

                this._fetchNoData();
            }

        } else if (item.index == 2) {
            //设置初始导航栏的值
            this.props.navigation.setParams({
                choiceData: '本周',
            });
            if (this.benzhoulist == 1) {
                this.setState({
                    weatherdataSource: this.benzhouData,
                });
            } else {

                this._fetchNoData();
            }

        } else if (item.index == 3) {
            //设置初始导航栏的值
            this.props.navigation.setParams({
                choiceData: '本月',
            });
            if (this.benyuelist == 1) {
                this.setState({
                    weatherdataSource: this.benyueData,
                });
            } else {

                this._fetchNoData();
            }

        } else if (item.index == 4) {
            //设置初始导航栏的值
            this.props.navigation.setParams({
                choiceData: '上月',
            });
            if (this.shangyelist == 1) {
                this.setState({
                    weatherdataSource: this.shangyeData,
                });
            } else {
                this._fetchNoData();
            }

        }
    }

    _renderXuanDataItemView(item) {
        const {navigate} = this.props.navigation;
        return (
            <TouchableOpacity activeOpacity={1} style={{
                width: width,
                height: 44,
                marginVertical: 1,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center'
            }}
                              onPress={() => this._onAcitveClickData(item)}>
                <Text allowFontScaling={false}
                      style={{fontSize: Adaption.Font(15, 14), fontWeight: "400", textAlign: 'center'}}>
                    {item.item.value}
                </Text>
            </TouchableOpacity>
        );
    }

    _isShowReceiveRedEnvel() {
        let modalHeight = 0;
        if (iOS) {
            modalHeight = 225;
        } else if (Android) {
            modalHeight = 248;
        }
        return (
            <TouchableOpacity activeOpacity={1} style={{flex: 1}} onPress={() => this.onRequestClose()}>
                <View style={{
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <View style={{
                        width: width,
                        height: 225,
                        marginTop: height - modalHeight,
                        backgroundColor: '#f3f3f3'
                    }}>
                        <FlatList
                            automaticallyAdjustContentInsets={false}
                            alwaysBounceHorizontal={false}
                            data={this.showRedEnvelopeArray}
                            renderItem={item => this._renderXuanDataItemView(item)}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    //搜索按钮点击
    onClickSearch() {
        if (this.searchId.length == 0) {
            this._showInfo('你输入的用户名为空')
        } else {

            this.dataListdata = 2; // 搜索的从新的走数据请求
            this._fetchPersonalMessageData();

            this.setState({
                weatherdataSource: [],  // 点击搜索的时候从新刷新状态赋值
            });


        }
    }

    _showInfo(title) {
        Alert.alert(
            '提示',
            title,
            [
                {
                    text: '确定', onPress: () => {
                }
                },
            ]
        )
    }

    render() {

        console.log('是否是空的',this.state.weatherdataSource);
        if (this.jintitanlist == 1) {
            console.log('111');
        }
        return (
            <View style={[styles.container]}>

                <View style={{backgroundColor: '#f3f3f3'}}>
                    <View style={[styles.sousou]}>
                        <TextInput
                            style={styles.input}
                            returnKeyType="search"
                            placeholder="账号查询"
                            maxLength={15}
                            underlineColorAndroid='transparent'
                            // onEndEditing={(event)=> this.setSearch({event})}
                            defaultValue={this.searchId}
                            onChangeText={(text) => 
                            this.searchId = text
                           
                            }>
                        </TextInput>
                        <TouchableOpacity activeOpacity={1}
                                          style={{
                                              width: 25 * KAdaptionWith,
                                              height: 24 * KAdaptionHeight,
                                              marginRight: 10
                                          }}
                                          onPress={() => this.onClickSearch()}>
                            <Image style={{width: 25 * KAdaptionWith, height: 24 * KAdaptionHeight,}}
                                   source={require("./img/fangdajing.png")}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{
                    marginTop: 0,
                    borderColor: '#EAEAEA',
                    borderWidth: 0.5,
                    marginLeft: 5,
                    width: width - 10,
                    backgroundColor: 'white'
                }}/>

                <View style={{flexDirection: 'row',}}>

                     <View style={styles.oneTopImg}>
                        <View style={styles.oneTextImg}>
                            <Text allowFontScaling={false}
                                  style={styles.texTop}>{this.state.weatherdataSource &&  this.state.weatherdataSource.tz_price ?  parseFloat(this.state.weatherdataSource.tz_price, 10).toFixed(2) : '0.00' }</Text>
                            <Text allowFontScaling={false} style={styles.textNext}>投注金额</Text>
                        </View>
                    </View>


                    <Image style={{width: 1, height:(SCREEN_HEIGHT == 568 ? 50 :60),marginTop:(SCREEN_HEIGHT == 812 ? 33 :25)}} source={require('./img/ic_dottedShuLine.png')} />

                    <View style={styles.oneTopImg}>
                        <View style={styles.oneTextImg}>
                            <Text allowFontScaling={false}
                                  style={styles.texTop}>{this.state.weatherdataSource &&  this.state.weatherdataSource.win_price  ? parseFloat(this.state.weatherdataSource.win_price, 10).toFixed(2): '0.00' }</Text>
                            <Text allowFontScaling={false} style={styles.textNext}>中奖金额</Text>
                        </View>
                    </View>

                    <Image style={{width: 1, height:(SCREEN_HEIGHT == 568 ? 50 :60),marginTop:(SCREEN_HEIGHT == 812 ? 33 :25)}} source={require('./img/ic_dottedShuLine.png')} />

                    <View style={styles.oneTopImg}>

                        <View style={styles.oneTextImg}>
                            <Text allowFontScaling={false}
                                  style={styles.texTop}>{this.state.weatherdataSource &&  this.state.weatherdataSource.event_price  ?  parseFloat(this.state.weatherdataSource.event_price, 10).toFixed(2):'0.00'}</Text>
                            <Text allowFontScaling={false} style={styles.textNext}>活动礼金</Text>
                        </View>

                    </View>

                </View>

                <View style={{flexDirection: 'row'}}>

                    <View style={styles.oneTopImg}>

                        <View style={styles.oneTextImg}>
                            <Text allowFontScaling={false}
                                  style={styles.texTop}>{ this.state.weatherdataSource &&  this.state.weatherdataSource.team_fandian ?  parseFloat(this.state.weatherdataSource.team_fandian, 10).toFixed(2) : '0.00'}</Text>
                            <Text allowFontScaling={false} style={styles.textNext}>团队返点</Text>
                        </View>

                    </View>

                    <Image style={{width: 1, height:(SCREEN_HEIGHT == 568 ? 50 :60),marginTop:(SCREEN_HEIGHT == 812 ? 33 :25)}} source={require('./img/ic_dottedShuLine.png')} />

                    <View style={styles.oneTopImg}>
                        <View style={styles.oneTextImg}>
                            <Text allowFontScaling={false}
                                  style={styles.texTop}>{this.state.weatherdataSource &&  this.state.weatherdataSource.team_win ? parseFloat(this.state.weatherdataSource.team_win, 10).toFixed(2):'0.00' }</Text>
                            <Text allowFontScaling={false} style={styles.textNext}>团队盈利</Text>
                        </View>
                    </View>

                    <Image style={{width: 1, height:(SCREEN_HEIGHT == 568 ? 50 :60),marginTop:(SCREEN_HEIGHT == 812 ? 33 :25)}} source={require('./img/ic_dottedShuLine.png')} />

                    <View style={styles.oneTopImg}>
                        <View style={styles.oneTextImg}>
                            <Text allowFontScaling={false}
                                  style={styles.texTop}>{this.state.weatherdataSource &&  this.state.weatherdataSource.tz_count ?  this.state.weatherdataSource.tz_count : '0' }</Text>
                            <Text allowFontScaling={false} style={styles.textNext}>投注人数</Text>
                        </View>
                    </View>

                </View>

                <View style={{flexDirection: 'row'}}>

                    <View style={styles.oneTopImg}>
                        <View style={styles.oneTextImg}>
                            <Text allowFontScaling={false}
                                  style={styles.texTop}>{this.state.weatherdataSource &&  this.state.weatherdataSource.reg_count  ? this.state.weatherdataSource.reg_count : '0'}</Text>
                            <Text allowFontScaling={false} style={styles.textNext}>注册人数</Text>
                        </View>
                    </View>

                    <Image style={{width: 1, height:(SCREEN_HEIGHT == 568 ? 50 :60),marginTop:(SCREEN_HEIGHT == 812 ? 33 :25)}} source={require('./img/ic_dottedShuLine.png')} />

                    <View style={styles.oneTopImg}>
                        <View style={styles.oneTextImg}>
                            <Text allowFontScaling={false}
                                  style={styles.texTop}>{this.state.weatherdataSource &&  this.state.weatherdataSource.xiaji_count  ?  this.state.weatherdataSource.xiaji_count : '0'}</Text>
                            <Text allowFontScaling={false} style={styles.textNext}>下级人数</Text>
                        </View>
                    </View>

                    <Image style={{width: 1, height:(SCREEN_HEIGHT == 568 ? 50 :60),marginTop:(SCREEN_HEIGHT == 812 ? 33 :25)}} source={require('./img/ic_dottedShuLine.png')} />

                    <View style={styles.oneTopImg}>
                        <View style={styles.oneTextImg}>
                            <Text allowFontScaling={false}
                                  style={styles.texTop}>{this.state.weatherdataSource &&  this.state.weatherdataSource.team_price > 0 ?  parseFloat(this.state.weatherdataSource.team_price, 10).toFixed(2) :'0.00'} </Text>
                            <Text allowFontScaling={false} style={styles.textNext}>团队余额</Text>
                        </View>
                    </View>

                </View>

                <View style={{flexDirection: 'row'}}>

                    <View style={styles.oneTopImg}>

                        <View style={styles.oneTextImg}>
                            <Text allowFontScaling={false}
                                  style={styles.texTop}>{this.state.weatherdataSource &&  this.state.weatherdataSource.first_pay_count ?  this.state.weatherdataSource.first_pay_count : 0}</Text>
                            <Text allowFontScaling={false} style={styles.textNext}>首充人数</Text>
                        </View>

                    </View>

                    <Image style={{width: 1, height:(SCREEN_HEIGHT == 568 ? 50 :60),marginTop:(SCREEN_HEIGHT == 812 ? 33 :25)}} source={require('./img/ic_dottedShuLine.png')} />

                    <View style={styles.oneTopImg}>
                        <View style={styles.oneTextImg}>
                            <Text allowFontScaling={false}
                                  style={styles.texTop}>{this.state.weatherdataSource && this.state.weatherdataSource.pay_count  ? this.state.weatherdataSource.pay_count : '0' }</Text>
                            <Text allowFontScaling={false} style={styles.textNext}>充值人数</Text>
                        </View>
                    </View>
                    <Image style={{width: 1, height:(SCREEN_HEIGHT == 568 ? 50 :60),marginTop:(SCREEN_HEIGHT == 812 ? 33 :25)}} source={require('./img/ic_dottedShuLine.png')} />

                    <View style={styles.oneTopImg}>
                        <View style={styles.oneTextImg}>
                            <Text allowFontScaling={false}
                                  style={styles.texTop}>{this.state.weatherdataSource && this.state.weatherdataSource.pay_price  ?  parseFloat(this.state.weatherdataSource.pay_price, 10).toFixed(2) : '0' }</Text>
                            <Text allowFontScaling={false} style={styles.textNext}>充值金额</Text>
                        </View>
                    </View>
                </View>

                <View style={{flexDirection: 'row'}}>

                    <View style={styles.oneTopImg}>

                        <View style={styles.oneTextImg}>
                            <Text allowFontScaling={false}
                                  style={styles.texTop}>{this.state.weatherdataSource &&  this.state.weatherdataSource.get_price ?  parseFloat(this.state.weatherdataSource.get_price, 10).toFixed(2) :'0.00'}</Text>
                            <Text allowFontScaling={false} style={styles.textNext}>提现金额</Text>
                        </View>

                    </View>

                    <Image style={{width: 1, height:(SCREEN_HEIGHT == 568 ? 50 :60),marginTop:(SCREEN_HEIGHT == 812 ? 33 :25)}} source={require('./img/ic_dottedShuLine.png')} />

                    <View style={styles.oneTopImg}>
                        <View style={styles.oneTextImg}>
                            <Text allowFontScaling={false}
                                  style={styles.texTop}>{this.state.weatherdataSource &&  this.state.weatherdataSource.daili_fandian ?  parseFloat(this.state.weatherdataSource.daili_fandian, 10).toFixed(2) :'0.00'}</Text>
                            <Text allowFontScaling={false} style={styles.textNext}>代理返点</Text>
                        </View>
                    </View>

                    <View style={styles.oneTopImg}>
                        <View style={styles.oneTextImg}>
                        </View>
                    </View> 
                </View>


                {/*<View style={{alignItems:'center',justifyContent:'center',marginTop:10}}>*/}
                {/*<Text allowFontScaling={false} style={{textAlign:'center',color:'#d3d3d3'}}>{'报表更新时间:'+this.newTime}</Text>*/}
                {/*</View>*/}
                <LoadingView ref='LoadingView' />
                {this.state.isShowReceiveRedEnvelope ? <Modal
                    visible={this.state.isShowReceiveRedEnvelope}
                    //显示是的动画默认none
                    //从下面向上滑动slide
                    //慢慢显示fade
                    animationType={'none'}
                    //是否透明默认是不透明 false
                    transparent={true}
                    //关闭时调用
                    onRequestClose={() => this.onRequestClose()}
                >{this._isShowReceiveRedEnvel()}</Modal> : null}

            </View>
        );
    }

}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    flex: {
        flex: 1,
    },

    topStatus: {
        marginTop: 25,
    },

    input: {
        padding: 0,
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
    },

    search: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold'
    },

    tip: {
        marginLeft: 5,
        marginTop: 5,
        color: '#C0C0C0',
    },

    texTop: {
        textAlign: 'center',
        color: '#ff7c34',
        marginTop: 25,
        fontSize:15
    },

    textNext: {
        textAlign: 'center',
        marginTop: 15,
        color: '#666666',
        fontSize:15
    },

    oneTextImg: {
        // marginTop:20,
        flex: 0.98,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },

    oneTopImg: {
        height: 105 * KAdaptionHeight,
        flex: 0.333333,
        // borderColor: '#EAEAEA',
        // borderRightWidth:3,
        backgroundColor: 'white',
        // borderStyle : 'dashed',

    },

    sousou: {
        width: width - 30,
        height: 33,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        borderRadius: 5,
        borderColor: '#cdcdcd',
        borderWidth: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    lineStyles:{
        width: 1,
        height:(SCREEN_HEIGHT == 568 ? 50 :60),
        marginTop:(SCREEN_HEIGHT == 812 ? 33 :25)
    },

});
