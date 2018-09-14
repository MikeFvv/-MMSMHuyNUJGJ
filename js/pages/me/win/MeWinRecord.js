/**
 Author cris
 Created by on 2017/10/6 0006
 dec 中奖记录
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    StatusBar,
    Dimensions,
    ART,
    TouchableOpacity,
    Modal,
    FlatList
} from "react-native";
import BaseNetwork from "../../../skframework/component/BaseNetwork";
import RefreshListView, {RefreshState} from 'react-native-refresh-list-view'
import LocalImages from "../../../../publicconfig/images";

const {width, height} = Dimensions.get("window");
const KAdaptionWidth = width / 414;
const KAdaptionHeight = height / 736;

export default class MeWinRecord extends Component {



    static navigationOptions = ({navigation}) => ({



     
        header: (

            <CustomNavBar
                leftClick={() =>  navigation.goBack() }
                centerText = "中奖记录"
                rightView = {
                    (
                        navigation.state.params ? (
                            <TouchableOpacity activeOpacity={1} style={{
                                marginRight: 5,
                                width: 80,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop:SCREEN_HEIGHT == 812?40:20,
                                backgroundColor:'transparent'
                            }}
                               onPress={() => navigation.state.params.navigateRightPress()}>
                              <CusBaseText style={{ fontSize: 14, color: 'white', textAlign: 'center' }}>
                                         {navigation.state.params.choiceData}
                              </CusBaseText>
                              <Image style={{width: 12 * KAdaptionWidth, height: 15 * KAdaptionHeight, marginLeft:5}}
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
            type: 0,//数据类型
            load_type: false,//是否加载更多
            page: 0,//页数
            error: false,
            uid: 0,
            refreshState: RefreshState.Idle,
            token: "",
            dataList: [], //购彩记录数据
            showPop: true,//是否显示弹窗
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
    getTokenAndUid() {

        if (global.UserLoginObject.Uid != '' && global.UserLoginObject.Token != ''){

            this.type = 0;
            //进行访问网络
            this.onHeaderRefresh();
        }
        else {
            Alert.alert("你还没有登录");

        }
    }

    componentDidMount() {
          //设置初始导航栏的值
    this.props.navigation.setParams({
        navigateRightPress: this._navigateRightPress,
        choiceData: '今天',
      });
   
        this.getTokenAndUid();

    }

    /**
     * 图片点击事件
     * @private
     */
    _navigateRightPress = () => {
        this.setState({ isShowReceiveRedEnvelope: true, })
      }
    _navTitlePress = () => {
        {this.setState({ showPop: !this.state.showPop })};
        // console.log(this.state.showPop);

    }

    //访问网络
    _fetchAccountData(isReload) {

        //请求参数
        let params = new FormData();
        params.append("ac", "getUserTouzhuLog");
        params.append("uid", global.UserLoginObject.Uid);
        params.append("token", global.UserLoginObject.Token);
        params.append("type", "2");
        params.append("gameid", "0");//
        params.append("pageid", this.moreTime);
        params.append("lasttime", this.lasttime);
        params.append("sessionkey", global.UserLoginObject.session_key);

        //对当前页数进行保存
        var promise = BaseNetwork.sendNetworkRequest(params);
        promise.then(response => {

          if (response.msg==0) {
            this.jiaZai =1;
            let datalist = response.data;
            if (this.moreTime==0) {
              this.setState({
                refreshState:RefreshState.Idle,
              })
            }else {
              this.setState({
                refreshState: response.data == null ? RefreshState.NoMoreData : RefreshState.Idle,
              })
              return;
            }
            let dataBlog = [];
            let i = 0;
            //遍历数据进行保存
            datalist.map(dict => {
                dataBlog.push({key: i, value: dict})
                i++;
            })
            let dataList = isReload ? dataBlog : [...this.state.dataList, ...dataBlog]

            for (let i = 0; i < dataList.length; i++) {
                dataList[i].id = i
            }

            this.setState({
                dataList: dataList,
            })
            //释放数据
            datalist = null;
            dataBlog = null;
          }else {
            this.jiaZai =1;
            
              this.setState({
                refreshState: RefreshState.Idle,
              })
           
            NewWorkAlert(response.param);
          }
        }).catch(err => {
        })
    }

    render() {
        const {navigate} = this.props.navigation;
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

    //cell的点击方法
    _onAcitveMeWinClickCell = (item, navigate) => {
      navigate('TouZhuDetial', {detialArray: item.item})
    }

    renderCell = (item) => {
        const { navigate } = this.props.navigation;

        return (
          <TouchableOpacity activeOpacity={1} style={styles.cellStyle} onPress={() => this._onAcitveMeWinClickCell(item, navigate)} >
            <View style={styles.linearlayout}>
                <View style={styles.relayout}>
                          <CusBaseText style={{flex:0.3,marginLeft:10,color:'#222222',textAlign:'left',fontWeight:'400',fontSize:15,marginTop:iOS?3:2}}>
                            {item.item.value.game_name}
                          </CusBaseText>
                          <CusBaseText style={{flex:0.4,color:'#666666',textAlign:'center',fontSize:13,marginTop:3,alignItems:'center'}}>
                            第{item.item.value.qishu}期
                          </CusBaseText>
                          <CusBaseText style={{flex:0.3,color:'red',textAlign:'right',fontSize:13,marginTop:3,marginRight:25}}>
                            -{item.item.value.price}元
                          </CusBaseText>
              </View>

              <View style={styles.relayout}>
                <Image style={{ width: 15, height: 15, marginLeft: width - 25, alignItems: 'center', marginTop: 4 }}
                  source={require('../../home/img/ic_homesanjiao.png')}
                />
              </View>

              <View style={styles.relayout}>
                <CusBaseText style={{ flex: 1, color: '#999999', textAlign: 'left', fontSize: 13, marginLeft: 10 }}>
                  {item.item.value.tz_time}
                </CusBaseText>
                <CusBaseText style={{ flex: 1, color: 'rgb(0,109,0)', textAlign: 'right', fontSize: 13, marginLeft: 10, marginRight: 25 }}>
                  {"赢" + item.item.value.win + "元"}
                </CusBaseText>

              </View>

            </View>

          </TouchableOpacity>
        )
    }

    keyExtractor = (item, index) => {
        return item.id
    }

    //尾部刷新
    onFooterRefresh = () => {
        //隐藏弹窗
        //this.setState({showPop:false})
        this.setState({refreshState: RefreshState.FooterRefreshing})
        this.moreTime++;
        this._fetchAccountData(false);
    }
//头部刷新
    onHeaderRefresh = () => {
        this.jiaZai =0;
        this.setState({refreshState: RefreshState.HeaderRefreshing})
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
    }
    else if (item.index == 4) {
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
      if (this.jiaZai == 0) {
        return (
            <View style={{width: width, height: height - 100, justifyContent: 'center', alignItems: 'center'}}>
                <CusBaseText style={{textAlign: 'center'}}>数据加载中....</CusBaseText>
            </View>
        );
      }else {
        const { navigate } = this.props.navigation;
        return (
          <View style={{ width: width, height: height - 180, justifyContent: 'center', alignItems: 'center' }}>
            <Image resizeMode={'stretch'} style={{ width: 60 , height: 50  }} source={require('../../home/img/ic_noData.png')}></Image>
            <CusBaseText style={{ textAlign: 'center', marginTop: 5,color:'#bfbfbf'}}>暂无记录</CusBaseText>
            <TouchableOpacity activeOpacity={1} style={{ width: 80, height: 25, marginTop: 5, backgroundColor:COLORS.appColor, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}
              onPress={() => navigate('BuyLot')}>
              <CusBaseText style={{ fontSize: 14, color: 'white', textAlign: 'center' }}>
                立即购买
                </CusBaseText>
            </TouchableOpacity>
          </View>
        );
        
      }
 
    }


}

const styles = StyleSheet.create({


    screenStyle:{
        flex:1,
        backgroundColor:'white'

    },

    imag: {
        flex: 1,
        // 设置主轴对齐方式
        justifyContent: 'center',
        // 设置侧轴对齐方式
        alignItems: 'center'
    },

    lineatal: {
        flexDirection: 'row',
        flex: 1,
        height: 100,
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    lineStyle: {
        width: width / 5,
        height: 2,
        backgroundColor: '#FF0000',
    },
    textStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    linearlayout: {
      width: width,
      height: 70,
      borderTopWidth: 1,
      borderTopColor: '#EBEBEB',
      padding:5,
    },

    txt: {
        textAlign: 'center',
        color: 'white',
        fontSize: 30,

    },
    relayout: {
      flexDirection: 'row',
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'center'
    },

})
