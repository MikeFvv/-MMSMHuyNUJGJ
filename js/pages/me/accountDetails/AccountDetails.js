/**
 Author kim
 Created by on 2017/10/6 0006
 dec 账户明细
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
    FlatList
} from "react-native";
import BaseNetwork from "../../../skframework/component/BaseNetwork";
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view'
import MenuPop_Window from "./MenuPop_Window";
const { width, height } = Dimensions.get("window");
const KAdaptionWidth = width / 414;
const KAdaptionHeight = height / 736;

export default class AccountDetails extends Component {
    // state: {
    //     dataList: Array<any>,
    //     refreshState: number,
    // }


    static navigationOptions = ({ navigation }) => ({

        header: (
            <CustomNavBar

                centerView = {
                    
                    (navigation.state.params.navigateTitlePress?
                        <TouchableOpacity
                            activeOpacity={0.7} onPress={() =>  navigation.state.params.navigateTitlePress?navigation.state.params.navigateTitlePress():null}>
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
                                    <CusBaseText
                                        style={{
                                            fontSize: Adaption.Font(17),
                                            color: 'white',
                                            marginLeft:5,
                                        }}>{navigation.state.params.navcLTitle}</CusBaseText>
                                        <Image style={{ width:15, height: 15,marginTop:3,marginLeft:15}} source={require('../../home/img/ic_sanjiao.png')}></Image>
                                </View>
                            </View>
                        </TouchableOpacity>:null
                    )
                }

                leftClick={() =>  navigation.goBack() }
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
                                marginLeft:5
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


        // headerStyle: { backgroundColor: COLORS.appColor, marginTop: Android ? (parseFloat(global.versionSDK) > 19 ? StatusBar.currentHeight : 0) : 0 },
        // headerTitleStyle: { color: 'white', alignSelf: 'center', justifyContent: 'center', },
        // //右边图片
        // headerRight: (
        //     navigation.state.params ? (
        //         <TouchableOpacity activeOpacity={1} style={{
        //             marginRight: 5,
        //             width: 80,
        //             flexDirection: 'row',
        //             justifyContent: 'center',
        //             alignItems: 'center'
        //         }}
        //             onPress={() => navigation.state.params.navigateRightPress()}>
        //             <Image style={{ width: 30 * KAdaptionWidth, height: 30 * KAdaptionHeight, marginLeft: 30 }}
        //                 source={require("../img/Agency/HeaderRsh.png")}
        //             />
        //         </TouchableOpacity>) : null
        // ),
        // headerTitle: (
        //     <TouchableOpacity
        //         activeOpacity={0.7} onPress={() => navigation.state.params.navigateTitlePress()}>
        //         <View style={{
        //             width: SCREEN_WIDTH - 80 - 20,
        //             height: 44,
        //             justifyContent: 'center',
        //             alignItems: 'center',
        //             flexDirection: 'row',
        //         }}>
        //             <View style={{
        //                 width: 130,
        //                 height: 35,
        //                 borderRadius: 5,
        //                 borderWidth: 1,
        //                 borderColor: 'white',
        //                 justifyContent: 'center',
        //                 alignItems: 'center',
        //             }}>
        //                 <CusBaseText
        //                     style={{
        //                         fontSize: Adaption.Font(17),
        //                         color: 'white'
        //                     }}>{navigation.state.params.navcLTitle}</CusBaseText>
        //             </View>
        //         </View>
        //     </TouchableOpacity>
        // ),
        // headerLeft: (
        //     <TouchableOpacity
        //         activeOpacity={1}
        //         style={GlobalStyles.nav_headerLeft_touch}
        //         onPress={() => { navigation.goBack() }}>
        //         <View style={GlobalStyles.nav_headerLeft_view} />
        //     </TouchableOpacity>
        // ),

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
            dataList: [], //账单数据
            showPop: false,//是否显示弹窗
            index: 0,
            dataArray: [],
            isLoaLong: false,
            isNoData: false,
            isShowReceiveRedEnvelope:false,
        }
        this.moreTime = 0;
        this.numberYe = 20;
        this.numMark = 0; 
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
        //进行访问网络
        if (global.UserLoginObject.Token.length > 0) {
            this.onHeaderRefresh();
        } else {
            Alert.alert("你还没有登录");

        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            navigateRightPress: this._navigateRightPress,
            navigateTitlePress: this._navigateTitlePress,
            choiceData: '今天',
            navcLTitle: "账户明细"
        });

        // 数据请求的状态
        this.setState({
            isLoaLong: true,
            isNoData: false,

        });

        //获取交易类型
        this.getTradeType();
        this.getTokenAndUid(0);

    }

    /**
     * 获取交易类型
     */
    getTradeType() {
        let params = new FormData();
        params.append("ac", "getTradType");
        var promise = BaseNetwork.sendNetworkRequest(params);
        promise.then(response => {
            if (response.msg == 0) {
                this.state.dataArray.push({ key: 0, value: "全部" })
                // console.log(response.data)
                //对象转换为数组
                for (var i in response.data) {
                    this.state.dataArray.push({ key: i, value: response.data[i] });
                }

            }

        });
    }

    /**
     * 图片点击事件
     * @private
     */
    _navigateRightPress = () => {
        this.setState({ isShowReceiveRedEnvelope: true, })
    }

    /**
     * 标题的点击事件
     * @private
     */
    _navigateTitlePress = () => {
        {
            this.setState({ showPop: !this.state.showPop });
        }
        // console.log(this.state.showPop);

    }

    //访问网络
    _fetchAccountData(isReload) {

        let requesMask = this.numMark;

        let params = new FormData();
        params.append("ac", "GetUserTradLog");
        params.append("uid", global.UserLoginObject.Uid);
        params.append("token", global.UserLoginObject.Token);
        params.append("type", this.type);//1=在线充值,2=公司入款,
        // 3=人工入款,4=活动赠送,5=投注退还,6=提款退还,
        // 7=分红赠送,8=返水退还,9=奖金派送,101=在线提款,
        // 102=投注金额,多个可以使用逗号(,)分割
        // params.append("status", "3");  //0=提交, 1=成功, 2=已处理完毕,3=全部
         params.append("lasttime", this.lasttime); //最大提取消息数量,默认为20条
        params.append("pageid", this.moreTime); //获取个人交易记录
        params.append("sessionkey", global.UserLoginObject.session_key);
        //对当前页数进行保存
        var promise = BaseNetwork.sendNetworkRequest(params);
        promise.then(response => {
            if(requesMask!=this.numMark){
                return;
              }
   
               if (response.msg == 0) {
                 
                 let datalist = response.data;
                 
                if (datalist && datalist.length > 0){
                 let dataBlog = [];
                 let i = 0;
                 datalist.map(dict => {
                   dataBlog.push({ key: i, value: dict });
                   i++;
                 });
   
                 let dataSourceList = isReload ? dataBlog : [...this.state.dataList, ...dataBlog]
                 for (let i = 0; i < dataSourceList.length; i++) {
                   dataSourceList[i].id = i
                 }
   
                 
                 if((dataSourceList.length/(this.moreTime+1))<this.nextWorkNum){
                   this.setState({
                    dataList: dataSourceList,
                     refreshState: RefreshState.NoMoreData,
                   })
                 }else{
                   this.setState({
                    dataList: dataSourceList,
                     refreshState: RefreshState.Idle,
                   });
                 }
   
                }else{
                
                 if(this.state.dataList.length>0){
                   this.setState({
                     refreshState:RefreshState.NoMoreData,
                   });
                 }else{
                   this.setState({
                     isLoaLong:false,
                     isNoData:true,
                     refreshState:RefreshState.Idle,
                   });
                 }
               }
   
                }else{
                 Alert.alert(response.param)
                }
             })
             promise.catch(err => { });
       }

    render() {
        const { navigate } = this.props.navigation;
        return (
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
                {this.state.showPop ?
                    <View style={{ position: 'absolute', top: 0, left: 0 }}>
                        <MenuPop_Window height={200} show={this.state.showPop} closeModal={(show) => {
                            this.setState({ showPop: show })
                        }}
                            clickButtonCallback={(data) => {
                                this.getIndexData(data)
                            }} dataArray={this.state.dataArray} index={this.state.index} />
                    </View> : null}

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

    /**
     * 回调方法
     * @param data 点击的位置
     */
    getIndexData(data) {
        // console.log("回调", data);
        //记录当前点击状态
        this.setState({ index: data });
        this.props.navigation.setParams({
            navcLTitle: this.state.dataArray[data].value,
        });
        this.getTokenAndUid(this.state.dataArray[data].key);

    }

    renderCell = (item) => {
        return (<View style={styles.container}>
            <View style={styles.item_one}>
                <CusBaseText style={{
                    flex: 0.5,
                    marginLeft: 15,
                    color: '#222222',
                    textAlign: 'left',
                    fontWeight: '300',
                    fontSize: 15,
                    marginTop: 5
                }}>{item.item.value.trad_type}</CusBaseText>

                <CusBaseText style={{
                    flex: 0.5,
                    marginRight: 10,
                    color: item.item.value.price.valueOf(Number) > 0 ? '#579957' : '#E94335',
                    textAlign: 'right',
                    fontSize: 15,
                    marginTop: 5
                }}>{item.item.value.price}元</CusBaseText>

            </View>
            <View style={styles.item_two}>
                <CusBaseText style={{
                    flex: 0.7,
                    color: '#666666',
                    textAlign: 'left',
                    fontSize: Adaption.Font(13, 12),
                    marginTop:2
                }}>单号:{item.item.value.dingdan}</CusBaseText>
                <CusBaseText style={{
                    flex: 0.3,
                    marginRight: 10,
                    color: '#666666',
                    textAlign: 'right',
                    fontSize: Adaption.Font(12, 11),
                    marginTop:2
             }}>{item.item.value.pay_time}</CusBaseText>
            </View>
            <View style={{width:SCREEN_WIDTH,height:1,backgroundColor:'#f3f3f3'}}></View>
        </View>)
    }


    keyExtractor = (item, index) => {
        return item.id
    }

    //尾部刷新
    onFooterRefresh = () => {
        //隐藏弹窗
        this.setState({ showPop: false })
        this.setState({ refreshState: RefreshState.FooterRefreshing})
        this.moreTime++;
        this._fetchAccountData(false);
    }
    //头部刷新
    onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing,
        isLoaLong: true,
        isNoData: false,    
        })
        this.moreTime = 0;
        this.setState({
            dataList: [],
        })
        this._fetchAccountData(true);

    }

    //   this.lasttime="1",//0=当天, 1=最近一周, 2=最近一个月, 3=最近三个月, 默认为当天
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

    let modalHeight = 0;
    if (iOS){
        modalHeight = 224;
    }else if(Android){
        modalHeight = 247;
    }

    return (
      <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => this.onRequestClose()}>
        <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: width, height: 224, marginTop: height - modalHeight, backgroundColor: '#f3f3f3' }}>
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

    //无数据页面
    listEmptyComponent() {
        if (this.state.isLoaLong == true) {
            return (
                <View style={{ width: width, height: height - height / 4, justifyContent: 'center', alignItems: 'center' }}>
                    <CusBaseText style={{ alignSelf: 'center' }}>数据加载中...</CusBaseText>
                </View>
            );
        } else if (this.state.isNoData == true) {
            return (
                <View style={{ width: width, height: height - height / 4, justifyContent: 'center', alignItems: 'center' }}>
                    <Image resizeMode={'stretch'} style={{ width: 60 * KAdaptionWidth, height: 50 * KAdaptionWidth }} source={require('../../home/img/ic_noData.png')} />
                    <CusBaseText style={{ alignSelf: 'center', marginTop: 5 }}>暂无数据</CusBaseText>
                </View>
            );
        }

    }


}

const styles = StyleSheet.create({

    container: {
        backgroundColor: 'white',
        height: 75,
        borderTopWidth: 1,
        borderTopColor: '#EBEBEB',
        width: width,
    },
    item_one: {
       // marginTop: 3,
        flexDirection: 'row',
        flex: 0.35,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    item_two: {
        marginLeft: 15,
        flex: 0.65,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    screenStyle: {
        flex: 1,
        backgroundColor: 'white'

    }

})
