
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    Modal,
    FlatList,
    ImageBackground
} from 'react-native';

const { width, height } = Dimensions.get("window");
const KAdaptionWidth = width / 414;
const KAdaptionHeight = height / 736;

import DrawalSelectBankList from '../../drawalCenter/DrawalSelectBankList';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view'
import SegmentedControl from '../../../../common/SegmentedControl';
import SubAccountModalView from './SubAccountModalView';


export default class DomainNameManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshState: RefreshState.Idle,
            ruleIndex: this.props.currentIndex,

            storageSub: null,
            visible: false,

            invitedCodeListArr: [],
            dataList: [], // 域名数据

            isNoData: false,
            isLoading: false,
            isShowInvitedCode: false,
            colorRedOrGray: false,
        }

        this.subList = [{ 'id': 0, 'name': '使用现有的邀请码' }, { 'id': 1, 'name': '设置新的邀请码' }];

        this.itemId = 0;
        this.oddsIndex = 0;
        this.domainNameId = null;  // 域名ID
        this.invitedCodeItem = null;  // 邀请码 item


        this.param_type = {
            "0": "不填邀请码",
            "1": "必填邀请码",
        };

        this.status = {
            "0": "审核中",
            "1": "审核中",
            "2": "审核中",
            "3": "审核中",
            "4": "审核通过",
            "5": "拒绝通过",
        };

        this.loginObject = null;

        this.moreTime = 0;
        this.addDomainNameSuccess = null;

        {
            (this: any).keyExtractor = this.keyExtractor.bind(this)
        }
        {
            (this: any).renderCell = this.renderCell.bind(this)
        }

    }



    componentDidMount() {

        this.setState({
            storageSub: this.subList[0],
        });

        this._getUserInfo();

        this.addDomainNameSuccess = PushNotification.addListener('AddDomainNameSuccess', () => {
            this.onHeaderRefresh();
        })
    }

    componentWillUnmount() {
        // 移除监听
        if (typeof (this.addDomainNameSuccess) === 'object') {
            this.addDomainNameSuccess && this.addDomainNameSuccess.remove();
        }

    }

    _getUserInfo() {

        this.loginObject = global.UserLoginObject;
        this.onHeaderRefresh();
        // this._fetchData();
        this._getInvitedCodeListData();
    }


    // 获取邀请码列表数据
    _getInvitedCodeListData(isReload) {

        let params = new FormData();
        params.append("ac", "getUserJoinCodeList");
        params.append("uid", this.loginObject.Uid);
        params.append('token', this.loginObject.Token);
        params.append('sessionkey', this.loginObject.session_key);
        params.append('actype', "2"); // 查看类型（0=会员、1=代理，2=全部）

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                if (responseData.msg == 0) {

                    // Alert.alert(responseData.param);
                    let dataListMap = responseData.data;
                    if (dataListMap && dataListMap.length > 0) {

                        let dataBlog = [];
                        let i = 0;

                        //遍历数据进行保存
                        dataListMap.map(dict => {
                            dataBlog.push({ key: i, value: dict })
                            i++;
                        })
                        let dataList = isReload ? dataBlog : [...this.state.invitedCodeListArr, ...dataBlog]

                        for (let i = 0; i < dataList.length; i++) {
                            dataList[i].id = i
                        }

                        this.setState({
                            invitedCodeListArr: dataList,
                        })

                        console.log('aaaaa');

                    } else {

                        this.setState({
                            invitedCodeListArr: [],
                        });
                    }
                } else {

                    this.setState({
                        invitedCodeListArr: [],
                    });
                    NewWorkAlert(responseData.param);
                }

            })
            .catch((err) => {
                // console.log('-------------请求失败-----------', err);
                // Alert.alert(err);
            })

    }


    // 获取域名列表数据
    _fetchData(isReload) {
        this.refs.LoadingView && this.refs.LoadingView.showLoading('正在加载数据...');

        let params = new FormData();
        params.append("ac", "getUserEnomList");
        params.append("uid", this.loginObject.Uid);
        params.append('token', this.loginObject.Token);
        params.append('etype', 0);  // 0=全部, 1=仅可用
        params.append('actype', this.itemId); // 获取类型, 0=自身域名, 1=总代理下级域名, 2=股东下级域名

        params.append('sessionkey', global.UserLoginObject.session_key);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                this.refs.LoadingView && this.refs.LoadingView.showSuccess();

                if (responseData.msg == 0) {

                    // Alert.alert(responseData.param);
                    let dataListMap = responseData.data;
                    if (dataListMap && dataListMap.length > 0) {

                        let dataBlog = [];
                        let i = 0;

                        //遍历数据进行保存
                        dataListMap.map(dict => {
                            dataBlog.push({ key: i, value: dict })
                            i++;
                        })
                        let dataList = isReload ? dataBlog : [...this.state.dataList, ...dataBlog]

                        for (let i = 0; i < dataList.length; i++) {
                            dataList[i].id = i
                        }

                        this.setState({
                            refreshState: RefreshState.NoMoreData,
                            dataList: dataList,
                        })
                    } else {

                        this.setState({
                            isLoading: false,
                            isNoData: true,
                            refreshState: RefreshState.Idle,
                            dataList: [],
                        });
                    }

                } else {
                    this.setState({
                        isLoading: false,
                        isNoData: true,
                        refreshState: RefreshState.Idle,
                        dataList: [],
                    });
                    NewWorkAlert(responseData.param);
                }

            })
            .catch((err) => {
                console.log('-------------请求失败-----------', err);
                // Alert.alert(err);
            })

    }

    // 选择域名类型
    _selectDomainNameType() {
        this._fetchData(true);
    }


    keyExtractor = (item: any, index: number) => {
        return item.id
    }

    renderCell = (item) => {

        let vvva = item.item.value.status == 4 ? <TouchableOpacity
            style={styles.desBtn}
            activeOpacity={0.7}
            onPress={() => {
                this.domainNameId = item.item.value.id;
                this.setState({
                    visible: true,
                });
            }}
        >
            <Text style={styles.desText}>设置赔率</Text>
        </TouchableOpacity> : null;    // 菜单

        return <View style={styles.cellStyle}>
            {/* 域名 */}
            <View style={styles.domainNameViewStyle}>
                <Text numberOfLines={1} style={{ color: 'black', fontSize: 12, }}>{item.item.value.enom}</Text>
            </View>

            {/* 邀请码 */}
            <View style={styles.InvitedCodeViewStyle}>
                <Text style={styles.InvitedCodeText}>{item.item.value.bind_param}</Text>
            </View>

            <Text style={styles.blankView} />

            {/* 状态 */}
            <View style={styles.InvitedCodeViewStyle}>
                <Text style={[styles.TextStyle, styles.righttTextStyle]}>{this.status[item.item.value.status]}</Text>
            </View>

            {/* 设置赔率 */}
            {vvva}

        </View>
    }


    // 确认添加
    _nextPress = () => {
        Alert.alert(
            '温馨提示',
            '再戳我就崩给你看',
            [
                { text: '确定', onPress: () => { } },
            ]
        )
    }

    //尾部刷新
    onFooterRefresh = () => {
        //隐藏弹窗
        this.setState({ showPop: false })
        this.setState({ refreshState: RefreshState.FooterRefreshing })
        this.moreTime++;
        this._fetchData(false);
    }
    //头部刷新
    onHeaderRefresh = () => {
        this.setState({
            refreshState: RefreshState.HeaderRefreshing,
            isLoading: true,
            isNoData: false,
            dataList: [],
        })

        this.moreTime = 0;
        this._fetchData(true);

    }


    // 加载视图 和 无数据页面
    listEmptyComponent() {
        if (this.state.isLoading == true) {
            return (
                <View style={{ width: width, height: height - 180, justifyContent: 'center', alignItems: 'center' }}>
                    <CusBaseText style={{ textAlign: 'center', marginTop: 5 }}>数据加载中...</CusBaseText>
                </View>
            );
        } else if (this.state.isNoData == true) {
            return (
                <View style={{ width: width, height: height - height / 4, justifyContent: 'center', alignItems: 'center' }}>
                    <Image resizeMode={'stretch'} style={{ width: 60 * KAdaptionWidth, height: 50 * KAdaptionHeight }} source={require('../../../home/img/ic_noData.png')} />
                    <Text style={{ textAlign: 'center', marginTop: 5 }}>暂无数据</Text>
                </View>
            );
        }
    }

    // 设置赔率
    _setOdds() {

        if (this.oddsIndex == 0) {
            this.setState({
                isShowInvitedCode: true,
            });
        } else {
            // 返回 返点设置
        }

    }


    _setOddsOk() {

        let params = new FormData();

        params.append("ac", "BindEnomParam");
        params.append("uid", this.loginObject.Uid);
        params.append('token', this.loginObject.Token);
        params.append('sessionkey', this.loginObject.session_key);

        if (!this.invitedCodeItem) {
            return;
        }
        params.append("eid", this.invitedCodeItem.item.value.id);// 邀请码ID
        params.append("id", this.domainNameId); // 域名id

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                if (responseData.msg == 0) {
                    Alert.alert('设置成功');
                } else {
                    Alert.alert(responseData.param);
                }
            })
            .catch((err) => {
                Alert.alert(err);
            })


        this.setState({
            isShowInvitedCode: false,
        });
    }


    render() {
        return (
            <View style={styles.container}>

                {/*添加新域名*/}
                <TouchableOpacity activeOpacity={0.7} onPress={() => this.props.navigator.navigate('AddDomainName', { title: '添加域名' })} style={{
                    height: 45,
                    flexDirection: 'row',
                    // borderRightWidth: 1,
                    justifyContent: 'space-between',
                    backgroundColor: '#f3f3f4',
                    alignItems: 'center',
                    height: 45,

                }}>
                    <View style={{
                        flexDirection: 'row',
                        backgroundColor: '#f3f3f4',
                        alignItems: 'center',
                    }}>
                        <CusBaseText style={styles.newAddStyle}>+</CusBaseText>
                        <CusBaseText style={styles.newDomainName_TitleStyle}> 添加新域名</CusBaseText>
                    </View>
                    <Image style={{ width: 13, height: 13, marginRight: 15 }}
                        source={require('../../img/right_arrow.png')}></Image>
                </TouchableOpacity>


                <View style={styles.topSegmentViewStyle}>
                    {/* 这里有个bug在下面写样式没有效果 */}
                    <SegmentedControl style={{ width: 180, height: 32, borderColor: '#ccc', marginTop: 15 }}
                        values={['我的域名', '下级域名']}
                        selectedIndex={0}
                        selectedColor={COLORS.appColor}

                        onChange={(selectedIndex) => {
                            if (this.itemId == selectedIndex) {
                                return;
                            }
                            this.itemId = selectedIndex;
                            this._selectDomainNameType();
                        }}
                    />

                </View>

                {/* cell视图  */}
                <View style={styles.screenStyle}>
                    <RefreshListView
                        automaticallyAdjustContentInsets={false}
                        alwaysBounceHorizontal={false}
                        data={this.state.dataList}
                        renderItem={this.renderCell}
                        keyExtractor={this.keyExtractor}
                        refreshState={this.state.refreshState}
                        onHeaderRefresh={this.onHeaderRefresh}
                        ListEmptyComponent={this.listEmptyComponent(this)} // 没有数据时显示的界面
                    />
                </View>


                <DrawalSelectBankList
                    dataSource={this.subList}
                    visible={this.state.visible}
                    onCancel={() => {
                        this.setState({
                            visible: false,
                        });
                    }}
                    onPress={(item) => {
                        this.setState({
                            visible: false,
                            storageSub: item,
                        });
                        this.oddsIndex = item.id;
                        this._setOdds();
                    }}
                />

                <SubAccountModalView
                    isClose={this.state.isShowInvitedCode}
                    dataSource={this.state.invitedCodeListArr}
                    close={() => {
                        this.setState({
                            isShowInvitedCode: false,
                        })
                    }}
                    modalClick={(gameData) => {

                        this.invitedCodeItem = gameData;
                        this.setState({
                            isShowInvitedCode: false,
                        })
                        this._setOddsOk();
                    }}
                >
                </SubAccountModalView>

                <LoadingView ref='LoadingView' />
            </View>
        );
    }

}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },

    newAddStyle: {
        marginLeft: 15,
        color: '#000000',
        fontSize: 26,
    },

    newDomainName_TitleStyle: {
        color: '#000000',
        fontSize: 18,
    },



    topSegmentViewStyle: {
        width: SCREEN_WIDTH,
        // flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        height: 60,
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

    InvitedCodeViewStyle: {
        borderRadius: 5,
        marginLeft: 10,
        borderWidth: 1,
        borderColor: '#d2d2d2',
        width: 70 * KAdaptionWidth,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

    InvitedCodeText: {
        color: '#6e6e6e',
        fontSize: 12,
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







    // ****** 头部 ******
    topViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50,
        alignItems: 'center',
    },

    domainNameBtn: {
        width: SCREEN_WIDTH / 2 - 40,
        height: 30,
        marginLeft: 10,
    },

    myDomainNameView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 27,
    },
    myDomainNameText: {
        flex: 1,
        color: COLORS.appColor,
        textAlign: 'center',
    },

    rightImg: {
        width: 15,
        height: 15,
    },

    lineViewStyle: {
        width: SCREEN_WIDTH / 2 - 40,
        height: 3,
        backgroundColor: COLORS.appColor,
    },

    topBtn: {
        backgroundColor: COLORS.appColor,
        borderRadius: 6,
        width: SCREEN_WIDTH / 2 - 40,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,

    },
    topBtnText: {
        color: 'white',
        fontSize: 14,
    },

    cellStyle: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
        // borderBottomWidth:1,
        // borderBottomColor:'#ccc',
    },

    domainNameViewStyle: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        height: 30,
        width: SCREEN_WIDTH / 3,
        justifyContent: 'center',
    },

    blankView: {
        flex: 1,
    },

    TextStyle: {
        color: '#9b9b9b',
        fontSize: 12,
    },

    leftTextStyle: {
        marginLeft: 10,
    },

    righttTextStyle: {
        marginLeft: 10,
        marginRight: 10,
    },

    desBtn: {
        marginLeft: 2,
        height: 30,
        width: 72,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#52b2fb',
        justifyContent: 'center',
        alignItems: 'center',
    },

    desText: {
        color: '#52b2fb',
        fontSize: 12,
    },

    screenStyle: {
        flex: 1,
    },


    // 邀请码
    InvitedCodeListStyle: {
        marginLeft: 25,
        marginTop: 10,
        borderRadius: 5,
        borderWidth: 1,

        width: (SCREEN_WIDTH - 30 * 2 - 30 * 3) / 2,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // 邀请码
    InvitedCodeImageStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: (SCREEN_WIDTH - 30 * 2 - 30 * 3) / 2 + 5,
        height: 35 + 5,
    },

});
