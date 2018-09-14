/**
 Created by on 2017/10/14 001
  提款记录
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    StatusBar,
    Dimensions,
    TouchableOpacity,
    Modal,
    FlatList,
} from "react-native";
import Toast, { DURATION } from 'react-native-easy-toast'
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view'
import BaseNetwork from "../../../skframework/component/BaseNetwork";
import * as moment from "moment";
import MenuPop_Window from "../accountDetails/MenuPop_Window";
const { width, height } = Dimensions.get("window");

const KAdaptionWidth = width / 414;
const KAdaptionHeight = height / 736;



export default class BuyRecord extends Component {
    static navigationOptions = ({ navigation }) => ({

        header: (
            <CustomNavBar
                // centerText = {"提款记录"}
                leftClick={() => navigation.goBack()}
                centerView={
                    (
                        <TouchableOpacity
                            activeOpacity={0.7} onPress={() => navigation.state.params.navTitlePress?navigation.state.params.navTitlePress():null}>
                            <View style={{
                                width: SCREEN_WIDTH - 180 - 40 ,
                                height: 44,
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row',
                                marginTop:SCREEN_HEIGHT == 812?40:20,
                                marginLeft:50,
                                backgroundColor:'transparent'
                            }}>
                                <View style={{
                                    width: 130,
                                    height: 35,
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: 'white',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                }}>
                                    <Text
                                        allowFontScaling={false} style={{ fontSize: Adaption.Font(17), color: 'white',marginLeft:5}}>{navigation.state.params.navcLTitle}</Text>
                                <Image style={{ width:15, height: 15,marginTop:3,marginLeft:15}} source={require('../../home/img/ic_sanjiao.png')}></Image>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                }

                rightView = {
                    (
                        navigation.state.params ? (
                            <TouchableOpacity activeOpacity={1} style={{
                                width: 80,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop:SCREEN_HEIGHT == 812?40:20,
                                backgroundColor:'transparent',
                            }}
                               onPress={() => navigation.state.params.navigateRightPress()}>
                              <CusBaseText style={{ fontSize: 14, color: 'white', textAlign: 'center' }}>
                                         {navigation.state.params.choiceData}
                              </CusBaseText>
                              <Image style={{width: 15 * KAdaptionWidth, height: 17 * KAdaptionHeight,marginLeft:5}}
                                     source={require("../../home/img/ic_xiangxia.png")}
                              />
                            </TouchableOpacity>) : null
                    )
                }
            />
        ),
    });


    constructor(props) {
        super(props)
        this.state = {
            load_type: false,//是否加载更多
            page: 0,//页数
            error: false,
            uid: 0,
            refreshState: RefreshState.Idle,
            token: "",
            dataList: [], //充值记录数据
            showPop: false,//是否显示弹窗
            dataArray: [],
            index: 0,
            isShowReceiveRedEnvelope:false,

        }
        this.moreTime = 0;
        this.jiaZai = 0;
        this.lasttime = "0";//0=当天, 1=最近一周, 2=最近一个月, 3=最近三个月, 默认为当天
        this.showRedEnvelopeArray = [{ key: 0, value: '今天' }, { key: 1, value: '昨天' }, { key: 2, value: '本周' }, { key: 3, value: '本月' }, { key: 4, value: '上月' }]
        {
            (this).keyExtractor = this.keyExtractor.bind(this)
        }
        {
            (this).renderCell = this.renderCell.bind(this)
        }
    }

    /**
     * 获取token和uid
     */
    getTokenAndUid(type) {

        this.type = type;
        if (global.UserLoginObject.Token.length > 0) {
            this.onHeaderRefresh();
        } else {
            Alert.alert("你还没有登录");
        }
    }
    componentDidMount() {
        this.props.navigation.setParams({
            navigateRightPress: this._navigateRightPress,
            navTitlePress: this._navTitlePress,
            navcLTitle: "提款记录",
            choiceData: '今天',
        });
        //获取全部数据 第一次进来数据要请求的参数
        this.getTokenAndUid(0);
        this.initData()

    }

    /**
     * 点击图片事件 刷新数据
     */
    _navigateRightPress = () => {
        this.setState({ isShowReceiveRedEnvelope: true, })
    }

    //点击头部要请求的的视图数据
    _navTitlePress = () => { { this.setState({ showPop: !this.state.showPop }) };}

    //网络请求
    _fetchAccountData(isReload) {
        let params = new FormData();
        params.append("ac", "getUserTKLog");   //提款记录
        params.append("uid", global.UserLoginObject.Uid);
        params.append("token", global.UserLoginObject.Token);
        params.append("sessionkey", global.UserLoginObject.session_key);
        params.append("status", this.type);  //0为全部, 1=审核, 2=通过, 3=取消
        params.append("pageid", this.moreTime);
        params.append("lasttime", this.lasttime); //0 1 2 3 4

        var promise = BaseNetwork.sendNetworkRequest(params);
        promise.then(response => {
            if (response.msg==0) {
                this.jiaZai = 1;
                let datalist = response.data;
             if (datalist && datalist.length > 0) {
                if (this.moreTime==0) {
                  this.setState({
                    refreshState:RefreshState.Idle,
                  })
                }else {
                  this.setState({
                    refreshState: response.data.length == 0 ||response.data == null ? RefreshState.NoMoreData : RefreshState.Idle,
                  })
                }
                let dataBlog = [];
                let i = 0;
                //遍历数据进行保存
                datalist.map(dict => {
                    dataBlog.push({key: i, value: dict})
                    i++;
                })
                let dataList = isReload ? dataBlog : [...this.state.dataList, ...dataBlog];
    
                for (let i = 0; i < dataList.length; i++) {
                    dataList[i].id = i
                }
    
                this.setState({
                    dataList: dataList,
                })
            }else{

                if (this.state.dataList.length > 0) {
                    this.setState({
                      refreshState: response.data == null ? RefreshState.NoMoreData : RefreshState.Idle,
                    })
                  } else {
                    this.setState({
                      refreshState: RefreshState.Idle,
                    });
                  }
            }

              }else {
                this.jiaZai =1;
            
                this.setState({
                  refreshState: RefreshState.Idle,
                })
             
              NewWorkAlert(response.param);
              NewWorkAlert(response.param);
              }

        }).catch(err => {

            if (err && typeof(err) === 'string' && err.length > 0) {
                this.refs.LoadingView && this.refs.LoadingView.showFaile(err);
            }
            
        })
    }

    //cell的点击方法
    _onClickCell = (item, navigate) => {
        navigate('TheRecorDatail', { detialArray: item.item })
    }

    //默认数据数据 type 传什么填什么
    initData = () => {
        this.state.dataArray.push({ key: 0, value: "全部" })
        this.state.dataArray.push({ key: 1, value: "审核中" })
        this.state.dataArray.push({ key: 2, value: "已通过" })
        this.state.dataArray.push({ key: 3, value: "已取消" })
        //  this.props.navigation.setParams({
        //     navcLTitle: this.state.dataArray.value,
        // });
    }

    //call的渲染和数组，属性
    render() {
        return (
            <View style={styles.screenStyle}>
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
                        onFooterRefresh={this.onFooterRefresh}
                    />
                </View>
                {this.state.showPop ?
                    <View style={{ position: 'absolute', top: 0, left: 0 }}>
                        <MenuPop_Window width={60} height={100} show={this.state.showPop} closeModal={(show) => {
                            this.setState({ showPop: show })
                        }}
                            clickButtonCallback={(data) => {
                                this.getIndexData(data)
                            }} dataArray={this.state.dataArray} index={this.state.index} />
                    </View> : null}
                <Toast ref="Toast" position='center' />

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

    //调用点击头部参数，清除数据的，从新去请求数据赋值
    getIndexData(data) {
        this.setState({ index: data });
        this.getTokenAndUid(this.state.dataArray[data].key);
        this.props.navigation.setParams({
            navcLTitle: this.state.dataArray[data].value,
        });

    }

    renderCell = (item) => { // cell 的视图渲染

       
        let isStatu = item.item.value.status !='' &&  item.item.value.status != undefined ? item.item.value.status :''; 
        
        let statuStr = isStatu;  //状态字符串
        let statuIS  = isStatu;   //是否已出款状态

                
        const { navigate } = this.props.navigation;
        return <TouchableOpacity activeOpacity={1} style={styles.cellStyle} onPress={() => this._onClickCell(item, navigate)} >
            <View style={{ flex: 0.6,}}>
                <Text allowFontScaling={false} style={{ width: 100 * KAdaptionWidth, textAlign: 'center', marginTop: 14 }}>{statuStr}</Text>
                <Text allowFontScaling={false} style={{ marginLeft: 5, marginTop: 10, color: '#666666', fontSize: Adaption.Font(13, 11),marginTop: 12, }}>单号{item.item.value.order !=''  &&  item.item.value.order != undefined ? item.item.value.order :'无单号'}</Text>
            </View>
            <View style={{ flex: 0.4, flexDirection: 'row' }}>
                <View style={{ flex: 0.88 }}>
                    <Text allowFontScaling={false} style={{ marginRight: 1, color: 'red', textAlign: 'right', marginTop: 12, }}>{item.item.value.price !=''  && item.item.value.price != undefined  ? item.item.value.price :'0.00'}元</Text>
                    <Text allowFontScaling={false} style={{ marginRight: 1, color: '#666666', textAlign: 'right', marginTop: 12, fontSize: Adaption.Font(13, 11), }}>{item.item.value.time}</Text>
                </View>
                <View style={{ flex: 0.12, alignItems: 'center', justifyContent: 'center' }}>
                    <Image style={{ width: 15, height: 15, alignItems: 'center' }}
                        source={require("../img/ic_recharge.png")}
                    />
                </View>
            </View>
        </TouchableOpacity>
    }

    keyExtractor = (item, index) => {
        return item.id    //点击的时候默认传的参数，状态就是那个
    }

    //尾部刷新
    onFooterRefresh = () => {
        //隐藏弹窗
        this.setState({ showPop: false })
        this.setState({ refreshState: RefreshState.FooterRefreshing })
        this.moreTime++;
        this._fetchAccountData(false);
    }
    //头部刷新
    onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing })
        this.jiaZai = 0;
        this.moreTime = 0;
        this.setState({
            dataList: [],
        })
        this._fetchAccountData(true);

    }

    //无数据页面
    listEmptyComponent() {
        if (this.jiaZai == 0) {
            return (
                <View style={{ width: width, height: height - height / 4, justifyContent: 'center', alignItems: 'center' }}>
                    <Text allowFontScaling={false} style={{ textAlign: 'center' }}>数据加载中...</Text>
                </View>
            );
        } else {
            return (
                <View style={{ width: width, height: height - height / 4, justifyContent: 'center', alignItems: 'center' }}>
                    <Image resizeMode={'stretch'} style={{ width: 60 * KAdaptionWidth, height: 50 * KAdaptionWidth }} source={require('../../home/img/ic_noData.png')} />
                    <Text allowFontScaling={false} style={{ textAlign: 'center', marginTop: 5 }}>暂无数据</Text>
                </View>
            );
        }

    }


    _onAcitveClickData(item) {
        if (item.index == 0) {
          //设置初始导航栏的值
          this.props.navigation.setParams({
            choiceData: '今天',
          });
          this.lasttime = '0'
     
        } else if (item.index == 1) {
          //设置初始导航栏的值
          this.props.navigation.setParams({
            choiceData: '昨天',
          });
          this.lasttime = '1'
     
        } else if (item.index == 2) {
          //设置初始导航栏的值
          this.props.navigation.setParams({
            choiceData: '本周',
          });
          this.lasttime = '2'
    
        } else if (item.index == 3) {
          //设置初始导航栏的值
          this.props.navigation.setParams({
            choiceData: '本月',
          });
          this.lasttime = '3'
    
    
        } else if (item.index == 4) {
            //设置初始导航栏的值
            this.props.navigation.setParams({
              choiceData: '上月',
            });
            this.lasttime = '4'
    
          }
        this.onHeaderRefresh();
        this.setState({
          isShowReceiveRedEnvelope: false,
        })
      }
    
      _renderXuanDataItemView(item) {
        const { navigate } = this.props.navigation;
        return (
          <TouchableOpacity activeOpacity={1} style={{ width: width, height: 44, marginVertical: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}
            onPress={() => this._onAcitveClickData(item)} >
            <CusBaseText style={{ fontSize: Adaption.Font(15, 14), fontWeight: "400", textAlign: 'center' }}>
              {item.item.value}
            </CusBaseText>
          </TouchableOpacity>
        );
      }

      _isShowReceiveRedEnvel() {

        return (
          <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => this.onRequestClose()}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: width, height: 224, marginTop: height - 224, backgroundColor: '#f3f3f3' }}>
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
    
     //弹出框
     onRequestClose() {
        this.setState({
          isShowReceiveRedEnvelope: false,
        })
      }
  }

const styles = StyleSheet.create({

    container: {
        justifyContent: 'center',
        backgroundColor: 'white',
        height: 70,
        borderTopWidth: 1,
        borderTopColor: '#EBEBEB',
        width: width,
    },
    relayout_item: {
        alignItems: 'baseline',
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    linearlayout_layout: {
        backgroundColor: 'white',
        width: width,
        height: 70,
        borderTopWidth: 1,
        borderTopColor: '#EBEBEB',
    },
    cellStyle: {
        flexDirection: 'row',
        flex: 1,
        height: 75 * KAdaptionWidth,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: '#d3d3d3',
    },
    screenStyle: {
        flex: 1
    }

})
