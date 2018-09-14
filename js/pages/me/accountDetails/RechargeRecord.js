/**
 Author kim
 Created by on 2017/10/8 0008
 dec 充值记录
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    Modal,
    FlatList
} from "react-native";
import RefreshListView, {RefreshState} from 'react-native-refresh-list-view'
import BaseNetwork from "../../../skframework/component/BaseNetwork";
import HaderClick from "./HaderClick";


const {width, height} = Dimensions.get("window");
const KAdaptionWidth = width / 414;
const KAdaptionHeight = height / 736;


var   dataSource=[{game_id:'0',game_name:'全部'},{game_id:'1',game_name:'正在审核'},{game_id:'2',game_name:'充值成功'},{game_id:'3',game_name:'充值失败'}];//,{game_id:'4',game_name:'未付款'}


export default class RechargeRecord extends Component {

 

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
            dataArray:[],
            index:0,
            selectedGameID:0,
            isShowReceiveRedEnvelope:false,
        }
        this.lasttime = "0";//0=当天, 1=最近一周, 2=最近一个月, 3=最近三个月, 默认为当天
        this.showRedEnvelopeArray = [{ key: 0, value: '今天' }, { key: 1, value: '昨天' }, { key: 2, value: '本周' }, { key: 3, value: '本月' }, { key: 4, value: '上月' }]
        this.moreTime = 0;
        this.indexId = 0,
        this.jiaZai = 0;
        {
            (this).keyExtractor = this.keyExtractor.bind(this)
        }
        {
            (this).renderCell = this.renderCell.bind(this)
        }
    }

    static navigationOptions = ({navigation}) => ({

        header: (
            <CustomNavBar
                leftClick={() =>  navigation.goBack() }
                centerView = {(
                        <TouchableOpacity
                            activeOpacity={0.7} onPress={() => navigation.state.params.navTitlePress?navigation.state.params.navTitlePress():null}>
                            <View  style={{
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
                                    <CusBaseText style={{fontSize: Adaption.Font(17), color: 'white',marginLeft:5}}>{navigation.state.params.navcLTitle}</CusBaseText>
                                    <Image style={{ width:15, height: 15,marginTop:3,marginLeft:15}} source={require('../../home/img/ic_sanjiao.png')}></Image>
                                </View>
                            </View>
                        </TouchableOpacity>)}

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
                }/> 
                        ),
                  });


    componentDidMount() {
        this.props.navigation.setParams({
            navigateRightPress: this._navigateRightPress,
            navTitlePress: this._navTitlePress,
            choiceData: '今天',
            navcLTitle:'充值记录',
        });
        this._fetchAccountData(true);

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
    }

    //访问网络
    _fetchAccountData(isReload) {
        let params = new FormData();
        params.append("ac", "getUserCzLog");
        params.append("uid", global.UserLoginObject.Uid);
        params.append("token", global.UserLoginObject.Token);
        params.append('sessionkey',global.UserLoginObject.session_key);
        params.append("status", this.indexId);  //1=审核中, 2=已处理完毕, 3=充值失败，不传值为全部
        params.append("pageid", this.moreTime); //获取个人交易记录
        params.append("lasttime", this.lasttime); //获取个人交易记录
        //对当前页数进行保存
        var promise = BaseNetwork.sendNetworkRequest(params);
        promise.then(response => {
          if (response.msg==0) {
            this.jiaZai = 1;
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
          NewWorkAlert(response.param);
          }
        }).catch(err => {
        })
    }

    //cell的点击方法
    _onClickCell = (item, navigate) => {
        navigate('RechargeDetail', {detialArray: item.item })
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
                            <HaderClick
                            gameList={dataSource}
                            selectedGameID={this.state.selectedGameID}
                            isClose={this.state.showPop}
                            close={() => {
                                this.setState({
                                    showPop: false,
                                })
                            }}

                            caiZhongClick={(gameData, index) => {
                                if (this.indexId == gameData.game_id) {
                                this.setState({
                                    showPop: false,
                                })
                                return; // 选择相同 直接退出
                                }
                                else {
                                    this.props.navigation.setParams({
                                     navcLTitle: gameData.game_name,
                                    });
                                    this.indexId =  gameData.game_id;
                                    this.state.dataList = [];
                                    this.setState({
                                    showPop: false,
                                    selectedGameID: index,
                                    });
                                    this.onHeaderRefresh();
                               
                                }
                            }}
                            /> : null}
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

    
    renderCell = (item) => {
        const  {navigate}=this.props.navigation;
        return  <TouchableOpacity activeOpacity={1} style={styles.cellStyle} onPress={() => this._onClickCell(item, navigate)} >
            <View style={styles.linearlayout_layout}>
                <View style={styles.relayout_item}>
                    <CusBaseText style={{flex:1,marginLeft:10,color:'#222222',textAlign:'left',fontWeight:'400',fontSize:15,marginTop:5}}>
                        {item.item.value.type}
                    </CusBaseText>
                    {/* <CusBaseText style={{flex:0.3,color:'#666666',fontSize:13}}>
                        {item.item.value.type}
                    </CusBaseText> */}
                    <CusBaseText style={{flex:1,color: '#009944',textAlign:'right',fontSize:13,marginRight:30,fontWeight:'500'}}>

                        {item.item.value.pay_price} 元
                    </CusBaseText>
                </View>

               <View style={styles.relayout_item}>
                    <Image style={{ width: 15, height: 15, marginLeft: width - 25, alignItems: 'center'}}
                           source={require("../img/ic_recharge.png")}
                    />
                </View>
               <View style={styles.relayout_item}>
                    <CusBaseText allowFontScaling={true} numberOfLines={1} style={{ flex: 0.7, color: '#999999', textAlign: 'left', fontSize: 12, marginLeft: 10 }}>
                        订单{item.item.value.order}
                    </CusBaseText>
                    <CusBaseText style={{ flex: 0.3, textAlign: 'right', fontSize: 12,  marginRight: 30 }}>
                      {item.item.value.status}
                    </CusBaseText>
                </View>
            </View>
        </TouchableOpacity>
    }

    keyExtractor = (item, index) => {
        return item.id
    }

    //尾部刷新
    onFooterRefresh = () => {
        //隐藏弹窗
        this.setState({showPop:false})
        this.setState({refreshState: RefreshState.FooterRefreshing})
        this.moreTime++;
        this._fetchAccountData(false);
    }
//头部刷新
    onHeaderRefresh = () => {
        this.setState({refreshState: RefreshState.HeaderRefreshing})
        this.jiaZai = 0;
        this.moreTime = 0;
        this.state.dataList = [];
        this._fetchAccountData(true);

    }

//无数据页面
    listEmptyComponent() {
      if (this.jiaZai==0) {
        return (
            <View style={{width: width, height: height - height/4, justifyContent: 'center', alignItems: 'center'}}>
                <CusBaseText style={{textAlign: 'center', marginTop: 5}}>数据加载中...</CusBaseText>
            </View>
        );
      }else {
        return (
            <View style={{width: width, height: height - height/4, justifyContent: 'center', alignItems: 'center'}}>
                <Image resizeMode={'stretch'} style={{ width: 60 * KAdaptionWidth, height: 50 * KAdaptionWidth }} source={require('../../home/img/ic_noData.png')}/>
                <CusBaseText style={{textAlign: 'center', marginTop: 5}}>暂无数据</CusBaseText>
            </View>
        );
      }

    }

}
const styles = StyleSheet.create({

    container: {
        justifyContent:'center',
        backgroundColor: 'white',
        height: 70,
        borderTopWidth: 1,
        borderTopColor: '#EBEBEB',
        width: width,
    },
    relayout_item: {
        alignItems:'baseline',
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    linearlayout_layout: {
        backgroundColor: 'white',
        width: width,
        height: 70,
        borderTopWidth: 1,
        borderTopColor: '#EBEBEB',
        justifyContent:'center',
        alignItems:'center'
    },
    cellStyle:{
        alignItems:'center'
    },
    screenStyle:{
       flex:1
    },
    
    leftClickStyle:{
        width: SCREEN_WIDTH - 80 - 40,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop:SCREEN_HEIGHT == 812?40:20,
        marginLeft:20,
        backgroundColor:'transparent'
    },

    RightClickStyle:{
        marginRight: 5,
        width: 80,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:SCREEN_HEIGHT == 812?40:20,
        backgroundColor:'transparent'
    },

    TopClickStyle:{
        width: 130,
        height: 35,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
   




})
