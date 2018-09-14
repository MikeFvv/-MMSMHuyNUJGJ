
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Clipboard,
    Modal,
    WebView,
    Dimensions,
} from 'react-native';

import SegmentedControl from '../../../../common/SegmentedControl';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view'


const { width, height } = Dimensions.get("window");
const KAdaptionWidth = width / 414;
const KAdaptionHeight = height / 736;

export default class InvitedCodeManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshState: RefreshState.Idle,

            dataList: [], // 邀请码数据

            isShow: false,  // 是否显示详情
            isNoData: false,
            isLoading: false,
        }
        // 下级模式类型
        this.subModelType = 1;   // 0 会员 ， 1 代理

        this.param_type = {
            "0": "不填邀请码",
            "1": "必填邀请码",
        };

        this.status = {
            "0": "未审核",
            "1": "等待业主审核",
            "2": "等待超管审核",
            "3": "审核通过",
            "4": "审核通过",
            "5": "拒绝通过",
        };

        this.item = null;

        this.loginObject = null;

        this.moreTime = 0;

        {
            (this: any).keyExtractor = this.keyExtractor.bind(this)
        }
        {
            (this: any).renderCell = this.renderCell.bind(this)
        }

    }

    componentWillMount() {
        console.log('====================================');
        console.log(';;;');
        console.log('====================================');
    }

    componentDidMount() {

        this._getUserInfo();
    }


    _getUserInfo() {

        this.loginObject = global.UserLoginObject;
        this.onHeaderRefresh();
        // this._fetchData();
    }


    _fetchData(isReload) {
        this.refs.LoadingView && this.refs.LoadingView.showLoading('正在加载数据...');
        let params = new FormData();
        params.append("ac", "getUserJoinCodeList");
        params.append("uid", this.loginObject.Uid);
        params.append('token', this.loginObject.Token);
        params.append('actype', this.subModelType); // 下级模式，0=会员，大于0代理
        params.append('sessionkey', this.loginObject.session_key);
        params.append('pageid', 0); 
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
                // console.log('-------------请求失败-----------', err);
                // Alert.alert(err);
            })

    }


    // 提示
    _nextPress = (content) => {
        Alert.alert(
            '温馨提示',
            '再戳我就崩给你看',
            [
                { text: '确定', onPress: () => { } },
            ]
        )
    }

    // 选择下级模式类型后操作  会员 or 代理
    _selectSubModelType() {

        if (!this.loginObject) {  // 有时会请求没回来 点击代理、会员会崩溃
            this._getUserInfo();
        } else {
            this._fetchData(true);

        }
    }



    keyExtractor = (item: any, index: number) => {
        return item.id
    }

    renderCell = (item) => {
        console.log(item);
        //  cell视图
        return <View style={styles.cellInvitedCodeStyle}>

            {/* 邀请码 */}
            <View style={styles.InvitedCodeViewStyle}>
                <Text style={styles.InvitedCodeText}>{item.item.value.param}</Text>
            </View>

            {/* 复制 */}
            <TouchableOpacity
                style={styles.copyInvitedCodeBtn}
                activeOpacity={0.7}
                onPress={() => {
                    this._setClipboardContent(item.item.value.param);
                }}
            >
                <Text style={styles.copyText}>复制</Text>
            </TouchableOpacity>

            {/* 域名 */}
            {/* <View style={styles.domainNameViewStyle}>
                <Text numberOfLines={1} style={{ color: 'black', fontSize: 12 }}>{item.item.value.link}</Text>
            </View> */}

            {/* 复制 */}
            {/* <TouchableOpacity
                style={styles.copyInvitedCodeBtn}
                activeOpacity={0.7}
                onPress={() => {
                    this._setClipboardContent(item.item.value.link);
                }}
            >
                <Text style={styles.copyText}>复制</Text>
            </TouchableOpacity> */}

            {/* 详情 */}
            <TouchableOpacity
                style={styles.copyInvitedCodeBtn}
                activeOpacity={0.7}
                onPress={() => {
                    this.item = item;
                    this.setState({ isShow: true })   // 详情显示
                }}
            >
                <Text style={styles.copyText}>详情</Text>
            </TouchableOpacity>

            {/* 时间 */}
            <View style={{ marginLeft: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Text numberOfLines={1} style={{ color: '#494949', fontSize: 16 * KAdaptionWidth }}>{item.item.value.time}</Text>
            </View>
        </View>
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



    // 复制操作
    async _setClipboardContent(value) {

        Clipboard.setString(value);
        try {
            var content = await Clipboard.getString();
            this.setState({ content });
            console.log('--------------' + content);

            Alert.alert(
                '温馨提示',
                content + ' 复制成功!',
                [
                    { text: '确定', onPress: () => { } },
                ]
            )

        } catch (e) {
            this.setState({ content: e.message });
        }
    }



    // 确定
    onOk() {
        this.setState({ isShow: false })
    }

    //弹窗
    _isShowDetailsView() {
        return (
            // 外层 是整个屏幕大小
            <View style={{ backgroundColor: 'rgba(0,0,0,0.1)', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: SCREEN_WIDTH - 60, height: 280, backgroundColor: 'white', borderRadius: 10, padding: 10 }}>

                    <View style={{ height: 30 }}>
                        <Text style={{ fontSize: 16, color: '#000', textAlign: 'center' }}>
                            详情
                        </Text>
                    </View>


                    {/* 分割线 */}
                    <View style={{ height: 1, backgroundColor: '#f1f1f1', marginLeft: -10, marginRight: -10 }} />
                    <Text style={{ fontSize: 14, color: '#000', textAlign: 'center', marginTop: 5, }}>
                        创建于：{this.item ? this.item.item.value.time : ""} 已注册：{this.item ? this.item.item.value.reg_count : ""}人
                     </Text>

                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 18, }}>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text style={styles.PopLotTitle}>
                                时时彩:
                             </Text>
                            <Text style={styles.PopLotTitle}>
                                11选5:
                             </Text>
                            <Text style={styles.PopLotTitle}>
                                PK10:
                             </Text>
                            <Text style={styles.PopLotTitle}>
                                六合彩:
                             </Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <Text style={styles.PopLotValue}>
                                {this.item ? this.item.item.value.fp_ssc : ""}
                            </Text>
                            <Text style={styles.PopLotValue}>
                                {this.item ? this.item.item.value.fp_11x5 : ""}
                            </Text>
                            <Text style={styles.PopLotValue}>
                                {this.item ? this.item.item.value.fp_pk10 : ""}
                            </Text>
                            <Text style={styles.PopLotValue}>
                                {this.item ? this.item.item.value.fp_lhc : ""}
                            </Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text style={styles.PopLotTitle}>
                                快三:
                             </Text>
                            <Text style={styles.PopLotTitle}>
                                3D:
                             </Text>
                            <Text style={styles.PopLotTitle}>
                                PC蛋蛋:
                             </Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <Text style={styles.PopLotValue}>
                                {this.item ? this.item.item.value.fp_k3 : ""}
                            </Text>
                            <Text style={styles.PopLotValue}>
                                {this.item ? this.item.item.value.fp_3d : ""}
                            </Text>
                            <Text style={styles.PopLotValue}>
                                {this.item ? this.item.item.value.fp_pcdd : ""}
                            </Text>
                        </View>
                    </View>

                    {/* 分割线 */}
                    <View style={{ height: 1, backgroundColor: '#f1f1f1', marginLeft: -10, marginRight: -10 }} />
                    {/* 确定 */}
                    <TouchableOpacity activeOpacity={0.7} style={{ justifyContent: 'center', alignItems: 'center', height: 30 }} onPress={() => this.onOk()}>
                        <Text style={{ fontSize: 15, color: 'red', textAlign: 'center', marginTop: 5 }}>
                            确定
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    onRequestClose() {

    }



    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topSegmentViewStyle}>
                    <SegmentedControl style={{ width: 180, height: 30, borderColor: '#ccc' }}
                        values={['会员', '代理']}
                        selectedIndex={1}
                        selectedColor={COLORS.appColor}

                        onChange={(selectedIndex) => {
                            if (this.subModelType == selectedIndex) {
                                return;
                            }
                            this.subModelType = selectedIndex;
                            this._selectSubModelType();
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


                <Modal
                    visible={this.state.isShow}
                    //显示是的动画默认none
                    //从下面向上滑动slide
                    //慢慢显示fade
                    animationType={'none'}
                    //是否透明默认是不透明 false
                    transparent={true}
                    //关闭时调用
                    onRequestClose={() => this.onRequestClose()}
                >{this._isShowDetailsView()}</Modal>
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

    // ****** 头部 ******
    topSegmentViewStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },

    SegmentedControlStyle: {
        width: 200,
        height: 30,
        borderColor: '#ccc'
    },

    cellInvitedCodeStyle: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
    },

    InvitedCodeViewStyle: {
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

    copyInvitedCodeBtn: {
        marginLeft: 10,
        height: 30,
        width: 60 * KAdaptionWidth,
        borderWidth: 1,
        borderColor: '#52b2fb',
        justifyContent: 'center',
        alignItems: 'center',
    },

    domainNameViewStyle: {
        marginLeft: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        width: SCREEN_WIDTH - 60 - 45 * 3 - 10 * 6,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

    copyText: {
        color: '#52b2fb',
        fontSize: 12,
    },

    PopLotTitle: {
        height: 35,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        color: '#5c5c5c',
    },

    PopLotValue: {
        marginLeft: 5,
        height: 35,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        color: 'red',
    },

    screenStyle: {
        flex: 1,
    }

});
