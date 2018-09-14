'use strict';

import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    NetInfo,
} from 'react-native';

import ScrollableTabView, { DefaultTabBar,ScrollableTabBar } from 'react-native-scrollable-tab-view';
import LotBlockView from './LotBlockView';

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

class BuyLot extends Component {

    static navigationOptions = ({ navigation, screenProps }) => ({

        header: (
            <CustomNavBar
                centerText = {"全部彩种"}
                leftClick={() =>  {navigation.state.params.backAction ? navigation.state.params.backAction() : null; navigation.goBack()}}
            />
        ),
    });

    constructor(props) {
        super(props);

        this.state = {
            showStyle: 'block',
            isLoading: false,
        };

        this.allList = [];
        this.shishicaiList = [];
        this.kuaisanList = [];
        this.pkshiList = [];
        this.shiyixuanwuList = [];
        this.liuhecaiList = [];
        this.fucaiList = [];
        this.erbaList = [];
        this.sportList= [];
        this.otherList= [];
    }

    componentDidMount() {

        // 检测网络是否连接
        NetInfo.isConnected.fetch().then(isConnected => {
            // this.setState({ isConnected });
        });


        //监听网络链接变化事件
        NetInfo.isConnected.addEventListener('connectionChange', this._handleIsConnectedChange);

        let BuyLotKey = 'BuyLotCaiZhongObjcet';
        UserDefalts.getItem(BuyLotKey, (error, result) => {

            if (!error) {
                if (result !== '' && result !== null) {

                    let BuyLotModel = JSON.parse(result);
                    this.allList = [];
                    this.shishicaiList = [];
                    this.kuaisanList = [];
                    this.pkshiList = [];
                    this.shiyixuanwuList = [];
                    this.liuhecaiList = [];
                    this.fucaiList = [];
                    this.erbaList = [];
                    this.sportList= [];
                    this.otherList= [];

                    let i = 0;
                    if (BuyLotModel.BuyLotCaiZhongArray && BuyLotModel.BuyLotCaiZhongArray.length > 0 )
                    {
                        BuyLotModel.BuyLotCaiZhongArray.map((item) => {

                                this.allList.push(item);

                                if (item.js_tag === '3d')
                                {
                                    this.fucaiList.push(item);
                                }
                                else if (item.js_tag === 'ssc')
                                {
                                    this.shishicaiList.push(item);
                                }
                                else if (item.js_tag === 'k3')
                                {
                                    this.kuaisanList.push(item);
                                }

                                else if(item.js_tag === 'pk10')
                                {
                                    this.pkshiList.push(item);
                                }
                                else if(item.js_tag === 'lhc')
                                {
                                    this.liuhecaiList.push(item);
                                }
                                else if(item.js_tag === 'pcdd')
                                {
                                    this.erbaList.push(item);
                                }
                                else if(item.js_tag === '11x5')
                                {
                                    this.shiyixuanwuList.push(item)
                                }
                                else if(item.js_tag === 'sport_key')
                                {
                                    this.sportList.push(item)
                                }
                                else
                                {
                                    this.otherList.push(item)
                                }
                            i++;
                        })

                    }

                    this.setState({
                        isLoading: false,
                    });


                }else {
                    this._fetchData();
                }

            }else {
                this._fetchData();
            }
        });

        this.props.navigation.setParams({
            navigatePress: this._switchShowStyle,
            buyLot_showImg: 'block',
            navLeftPress: this._leftClick,
        });
        setTimeout(() => {
            this._fetchData();
        }, 3000);

    }

    _leftClick = () => {
        this.props.navigation.goBack();
    }

    // 网络监听方法
    _handleIsConnectedChange = (isConnected) => {
        // 网络有变化时请求一遍数据
        if (isConnected) {

            this._fetchData();

        } else {

            let BuyLotKey = 'BuyLotCaiZhongObjcet';
            UserDefalts.getItem(BuyLotKey, (error, result) => {
                if (!error) {

                    if (result !== '' && result !== null) {
                        let BuyLotModel = JSON.parse(result);

                        this.allList = [];
                        this.shishicaiList = [];
                        this.kuaisanList = [];
                        this.pkshiList = [];
                        this.shiyixuanwuList = [];
                        this.liuhecaiList = [];
                        this.fucaiList = [];
                        this.erbaList = [];
                        this.sportList= [];
                        this.otherList= [];

                        let i = 0;

                        if(BuyLotModel.BuyLotCaiZhongArray && BuyLotModel.BuyLotCaiZhongArray.length > 0)
                        {
                            BuyLotModel.BuyLotCaiZhongArray.map((item) => {

                                    this.allList.push(item);

                                    if (item.js_tag === '3d')
                                    {
                                        this.fucaiList.push(item);
                                    }
                                    else if (item.js_tag === 'ssc')
                                    {
                                        this.shishicaiList.push(item);
                                    }
                                    else if (item.js_tag === 'k3')
                                    {
                                        this.kuaisanList.push(item);
                                    }

                                    else if(item.js_tag === 'pk10')
                                    {
                                        this.pkshiList.push(item);
                                    }
                                    else if(item.js_tag === 'lhc')
                                    {
                                        this.liuhecaiList.push(item);
                                    }
                                    else if(item.js_tag === 'pcdd')
                                    {
                                        this.erbaList.push(item);
                                    }
                                    else if(item.js_tag === '11x5')
                                    {
                                        this.shiyixuanwuList.push(item)
                                    }
                                    else if(item.js_tag === 'sport_key')
                                    {
                                        // this.sportList.push(item)
                                    }
                                    else
                                    {
                                        this.otherList.push(item)
                                    }
                                i++;
                            })

                        }

                        this.setState({
                            isLoading: false,
                        });

                    }
                }
            });
        }
    }


    _reloadData = () => {
        if (this.allList.length === 0) {
            this._fetchData();
        }
    }

    // 箭头函数自动绑定this
    _switchShowStyle = () => {

        if (this.state.showStyle == 'block') {

            this.setState({
                showStyle: 'list',
            });

            this.props.navigation.setParams({
                buyLot_showImg: 'list',
            })

        } else {

            this.setState({
                showStyle: 'block',
            });


            this.props.navigation.setParams({
                buyLot_showImg: 'block',
            })

        }
    }

    //请求网络数据
    _fetchData = () => {

        if (this.state.isLoading === true) {
            return;
        }

        this.setState({
            isLoading: true,
        });

        {
            let params = new FormData();
            params.append("ac", "getGameListAtin");
            // params.append("enable", "0");

            var promise = GlobalBaseNetwork.sendNetworkRequest(params);
            promise
                .then((responseData) => {
                    //处理数据
                    if (responseData.msg != 0) {
                        if (responseData.param) {
                            Alert.alert(responseData.param);
                        }
                        return;
                    }

                    // this.allList = global.AllPlayGameList;
                    this.allList = [];
                    this.shishicaiList = [];
                    this.kuaisanList = [];
                    this.pkshiList = [];
                    this.shiyixuanwuList = [];
                    this.liuhecaiList = [];
                    this.fucaiList = [];
                    this.erbaList = [];
                     this.sportList= [];
                    this.otherList= [];
                    let i = 0;
                    if(responseData.data && responseData.data.length > 0)
                    {
                        responseData.data.map((item) => {
                                this.allList.push(item);

                                if (item.js_tag === '3d')
                                {
                                    this.fucaiList.push(item);
                                }
                                else if (item.js_tag === 'ssc')
                                {
                                    this.shishicaiList.push(item);
                                }
                                else if (item.js_tag === 'k3')
                                {
                                    this.kuaisanList.push(item);
                                }

                                else if(item.js_tag === 'pk10')
                                {
                                    this.pkshiList.push(item);
                                }
                                else if(item.js_tag === 'lhc')
                                {
                                    this.liuhecaiList.push(item);
                                }
                                else if(item.js_tag === 'pcdd')
                                {
                                    this.erbaList.push(item);
                                }
                                else if(item.js_tag === '11x5')
                                {
                                    this.shiyixuanwuList.push(item)
                                }
                                else  if(item.js_tag === 'sport_key')
                                {
                                    this.sportList.push(item)
                                }
                                else
                                {
                                    this.otherList.push(item)
                                }
                            i++;
                        })

                        //加一个足彩位置
                        // this.allList.push({'99':'11'});

                    }


                    this.setState({
                        isLoading: false,
                    });

                    let BuyLotObjcet = {
                        BuyLotCaiZhongArray: this.allList,
                    }

                    let BuyLotCaizhongValue = JSON.stringify(BuyLotObjcet);

                    let key = 'BuyLotCaiZhongObjcet';
                    UserDefalts.setItem(key, BuyLotCaizhongValue, (error) => {
                    });

                })

                .catch((err) => {

                    this.setState({
                        isLoading: false,
                    });

                })
        }


    }

    renderLoadingView = () => {

        return (
            <View style={styles.container}>

              <Image
                  source =  {require('./img/ic_buy_collection_frist.png')}
                  style={{resizeMode:'stretch',width:screenWidth,height:screenHeight  - 49 }}
              />

              <ActivityIndicator
                  animating={true}
                  style={{ height: 80,position:'absolute',left:screenWidth/2 - 18, top:screenHeight / 2 - 80}}
                  color='#d3d3d3'
                  size="large"

              />

            </View>
        )
    }

    //加载失败view
    renderErrorView = (errorInfo) => {
        return (
            <View style={styles.errorView}>
              <Text style={styles.errorText}>
                  {errorInfo}
              </Text>
            </View>
        );
    }

    render()
    {
        if (this.state.isLoading && this.allList.length === 0)
        {
            //加载等待的view
            return this.renderLoadingView();
        }
        return (
            <ScrollableTabView
                style={{marginBottom:SCREEN_HEIGHT == 812?34:0}}

                automaticallyAdjustContentInsets={false}
                alwaysBounceHorizontal={false}
                renderTabBar={() =>
                    <ScrollableTabBar
                        backgroundColor='rgba(255, 255, 255, 0.7)'
                        activeTextColor='#fc7c3f'
                        underlineStyle={{ backgroundColor: '#fc7c3f',height:2}}
                        textStyle={{fontSize: Adaption.Font(17, 15),fontWeight: "500"}}
                        
                        tabStyle={{paddingBottom:10}}
                        style={{height:42}}
                    />
                }
                tabBarPosition='top'
            >
                {this._views()}

            </ScrollableTabView>

        );
    }



    //创建子页面
    _views() {

        let viewArr = []

        if (this.state.showStyle == 'block')
        {

            viewArr.push(<LotBlockView
                key={0}
                type = {0}
                dataSource={this.allList}
                navigator={this.props.navigation}
                countDown={(itemIndex, nextIndex, jiezhitime, leftTime, prevTime) => this._countDownTime('all', itemIndex, nextIndex, jiezhitime, leftTime, prevTime)}
                countDownFinished={() => this._fetchData()}
                tabLabel='全部彩种'
                style={styles.page1}
                backAction={this.props.backAction}

            />);
            viewArr.push(<LotBlockView
                key={1}
                type = {1}

                dataSource={this.shishicaiList}
                navigator={this.props.navigation}
                countDown={(itemIndex, nextIndex, jiezhitime, leftTime, prevTime) => this._countDownTime('shishicai', itemIndex, nextIndex, jiezhitime, leftTime, prevTime)}
                countDownFinished={() => this._fetchData()}
                tabLabel='时时彩'
                style={styles.page2}
                backAction={this.props.backAction}

            />);
            viewArr.push(<LotBlockView
                key={2}
                type = {2}

                dataSource={this.kuaisanList}
                navigator={this.props.navigation}
                countDown={(itemIndex, nextIndex, jiezhitime, leftTime, prevTime) => this._countDownTime('kuaisan', itemIndex, nextIndex, jiezhitime, leftTime, prevTime)}
                countDownFinished={() => this._fetchData()}
                tabLabel='快三'
                style={styles.page3}
                backAction={this.props.backAction}

            />);
            viewArr.push(<LotBlockView
                key={3}
                type = {3}

                dataSource={this.sportList}
                navigator={this.props.navigation}
                countDown={(itemIndex, nextIndex, jiezhitime, leftTime, prevTime) => this._countDownTime('sport', itemIndex, nextIndex, jiezhitime, leftTime, prevTime)}
                countDownFinished={() => this._fetchData()}
                tabLabel='体育彩'
                style={styles.page3}
                backAction={this.props.backAction}

            />);
            viewArr.push(<LotBlockView
                key={4}
                type = {4}

                dataSource={this.pkshiList}
                navigator={this.props.navigation}
                countDown={(itemIndex, nextIndex, jiezhitime, leftTime, prevTime) => this._countDownTime('pkshi', itemIndex, nextIndex, jiezhitime, leftTime, prevTime)}
                countDownFinished={() => this._fetchData()}
                tabLabel='PK 拾'
                style={styles.page3}
                backAction={this.props.backAction}

            />);
            viewArr.push(<LotBlockView
                key={5}
                type = {5}

                dataSource={this.shiyixuanwuList}
                navigator={this.props.navigation}
                countDown={(itemIndex, nextIndex, jiezhitime, leftTime, prevTime) => this._countDownTime('shiyixuanwu', itemIndex, nextIndex, jiezhitime, leftTime, prevTime)}
                countDownFinished={() => this._fetchData()}
                tabLabel='11 选 5'
                style={styles.page3}
                backAction={this.props.backAction}

            />);

            viewArr.push(<LotBlockView
                key={6}
                type = {6}

                dataSource={this.fucaiList}
                navigator={this.props.navigation}
                countDown={(itemIndex, nextIndex, jiezhitime, leftTime, prevTime) => this._countDownTime('fucai', itemIndex, nextIndex, jiezhitime, leftTime, prevTime)}
                countDownFinished={() => this._fetchData()}
                tabLabel='3D'
                style={styles.page3}
                backAction={this.props.backAction}

            />);
            viewArr.push(<LotBlockView
                key={7}
                type = {7}

                dataSource={this.liuhecaiList}
                navigator={this.props.navigation}
                countDown={(itemIndex, nextIndex, jiezhitime, leftTime, prevTime) => this._countDownTime('liuhecai', itemIndex, nextIndex, jiezhitime, leftTime, prevTime)}
                countDownFinished={() => this._fetchData()}
                tabLabel='六合彩'
                style={styles.page3}
            />);

            viewArr.push(<LotBlockView
                key={8}
                type = {8}

                dataSource={this.erbaList}
                navigator={this.props.navigation}
                countDown={(itemIndex, nextIndex, jiezhitime, leftTime, prevTime) => this._countDownTime('erba', itemIndex, nextIndex, jiezhitime, leftTime, prevTime)}
                countDownFinished={() => this._fetchData()}
                tabLabel='PC 蛋蛋'
                style={styles.page3}
                backAction={this.props.backAction}

            />);

            viewArr.push(<LotBlockView
                key={9}
                type = {9}

                dataSource={this.otherList}
                navigator={this.props.navigation}
                countDown={(itemIndex, nextIndex, jiezhitime, leftTime, prevTime) => this._countDownTime('other', itemIndex, nextIndex, jiezhitime, leftTime, prevTime)}
                countDownFinished={() => this._fetchData()}
                tabLabel='其他'
                style={styles.page3}
                backAction={this.props.backAction}

            />);
        }
        return viewArr;
    }

    _countDownTime = (tag, itemIndex, nextIndex, jiezhitime, leftTime, prevTime) =>
    {


        if (tag === 'shishicai')
        {
            this.shishicaiList[itemIndex].nextIndex = nextIndex;
            this.shishicaiList[itemIndex].leftTime = leftTime;
            this.shishicaiList[itemIndex].prevTime = prevTime;
            this.shishicaiList[itemIndex].next[nextIndex].jiezhitime = jiezhitime;
        }
        else if (tag === 'kuaisan')
        {
            this.kuaisanList[itemIndex].nextIndex = nextIndex;
            this.kuaisanList[itemIndex].leftTime = leftTime;
            this.kuaisanList[itemIndex].prevTime = prevTime;
            this.kuaisanList[itemIndex].next[nextIndex].jiezhitime = jiezhitime;
        }
        else if(tag === 'pkshi')
        {
            this.pkshiList[itemIndex].nextIndex = nextIndex;
            this.pkshiList[itemIndex].leftTime = leftTime;
            this.pkshiList[itemIndex].prevTime = prevTime;
            this.pkshiList[itemIndex].next[nextIndex].jiezhitime = jiezhitime;
        }
        else if(tag === 'shiyixuanwu')
        {
            this.shiyixuanwuList[itemIndex].nextIndex = nextIndex;
            this.shiyixuanwuList[itemIndex].leftTime = leftTime;
            this.shiyixuanwuList[itemIndex].prevTime = prevTime;
            this.shiyixuanwuList[itemIndex].next[nextIndex].jiezhitime = jiezhitime;
        }
        else if(tag === 'liuhecai')
        {
            this.liuhecaiList[itemIndex].nextIndex = nextIndex;
            this.liuhecaiList[itemIndex].leftTime = leftTime;
            this.liuhecaiList[itemIndex].prevTime = prevTime;
            this.liuhecaiList[itemIndex].next[nextIndex].jiezhitime = jiezhitime;
        }
        else if(tag === 'fucai')
        {
            this.fucaiList[itemIndex].nextIndex = nextIndex;
            this.fucaiList[itemIndex].leftTime = leftTime;
            this.fucaiList[itemIndex].prevTime = prevTime;
            this.fucaiList[itemIndex].next[nextIndex].jiezhitime = jiezhitime;
        }
        else if(tag === 'erba')
        {
            this.erbaList[itemIndex].nextIndex = nextIndex;
            this.erbaList[itemIndex].leftTime = leftTime;
            this.erbaList[itemIndex].prevTime = prevTime;
            this.erbaList[itemIndex].next[nextIndex].jiezhitime = jiezhitime;
        }
        else if(tag === 'all')
        {
            this.allList[itemIndex].nextIndex = nextIndex;
            this.allList[itemIndex].leftTime = leftTime;
            this.allList[itemIndex].prevTime = prevTime;
            this.allList[itemIndex].next[nextIndex].jiezhitime = jiezhitime;
        }
        else if(tag === 'sport')
        {
            this.sportList[itemIndex].nextIndex = nextIndex;
            this.sportList[itemIndex].leftTime = leftTime;
            this.sportList[itemIndex].prevTime = prevTime;
            this.sportList[itemIndex].next[nextIndex].jiezhitime = jiezhitime;
        }
        else if(tag === 'other')
        {
            this.otherList[itemIndex].nextIndex = nextIndex;
            this.otherList[itemIndex].leftTime = leftTime;
            this.otherList[itemIndex].prevTime = prevTime;
            this.otherList[itemIndex].next[nextIndex].jiezhitime = jiezhitime;
        }

    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1
    },

    switchView: {
        backgroundColor: 'white',
        height: 100,
    },

    errorView: {
        height: SCREEN_HEIGHT - 100,
        justifyContent: 'center',
        alignItems: 'center'
    },

    errorText: {
        color: 'red',
        fontSize: 20,
    },

    page1: {
        backgroundColor: 'white',
    },

    page2: {
        backgroundColor: 'white',
    },

    page3: {
        backgroundColor: 'white',
    },

});


export default BuyLot;
