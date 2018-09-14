import React, {Component} from 'react';

import {
    StyleSheet,
    FlatList,
    View,
    Platform,
    TouchableOpacity,
    Alert,
    Image,
    ImageBackground,
    Text,
} from 'react-native';

import NewLotBlockCell from "./NewLotBlockCell";
import CusIosBaseText from "../../skframework/component/CusIosBaseText";
let leftW = SCREEN_WIDTH * 0.24;
let rightW = SCREEN_WIDTH * 0.76;

const cols = 3;
const cellW = rightW / cols;

const cellH = Platform.OS === 'ios' ? 135 : 145;

class NewLotBlockViewThere extends Component {

    constructor(props) {

        super(props);

        this.state = {
            dataSource: [],
        };

    }

    //先加载缓存数据
    componentDidMount() {

        let BuyLotKey = 'GetIndexWebgameData';
        UserDefalts.getItem(BuyLotKey, (error, result) => {

            if (!error)
            {

                if (result !== '' && result !== null)
                {

                    let dateArray = JSON.parse(result);

                    this.setState({
                        isLoading: false,
                        dataSource:dateArray,
                    });

                }
                else
                {
                    this._fetchData();
                }

            }
            else
            {
                this._fetchData();
            }
        });

    }


    //请求电子游戏平台数据
    _fetchData = () => {

        if (this.state.isLoading === true)
        {
            return;
        }

        this.setState({
            isLoading: true,
        });

        {
            let params = new FormData();
            params.append("ac","GetIndexWebgame");

            var promise = GlobalBaseNetwork.sendNetworkRequest(params);
            promise
                .then((responseData) => {
                    //处理数据
                    if (responseData.msg != 0)
                    {
                        if (responseData.param)
                        {
                            Alert.alert(responseData.param);
                        }
                        return;
                    }

                    if(responseData.data && responseData.data.length > 0)
                    {

                        this.setState
                        ({
                            dataSource:responseData.data,
                            isLoading: false,
                        });

                        //存沙盒
                        let BuyLotCaizhongValue = JSON.stringify(responseData.data);
                        let key = 'GetIndexWebgameData';
                        UserDefalts.setItem(key, BuyLotCaizhongValue, (error) => {

                        });
                    }
                })

                .catch((err) => {

                    this.setState({
                        isLoading: false,
                    });

                })
        }
    }

    render() {


        if (this.state.dataSource && this.state.dataSource.length > 0) {

            return (
                <View style={styles.container}>

                    <FlatList
                        style={{backgroundColor: 'white',width:rightW}}
                        data={this.state.dataSource}
                        renderItem={this._renderItem}
                        // numColumns={3}
                        showsVerticalScrollIndicator={false}
                        enableEmptySections={true}
                    />
                </View>
            );

        } else {
            return (
                <View style={styles.container}/>
            );
        }

    }



    _renderItem = (info) => {
        return (
            <View style={styles.mcStyle}>

                <View style={{flex:0.2}}>
                <Image
                   source={{ uri: info.item.icon }}
                    style={{resizeMode:'stretch',width:55,height:55,marginLeft:20,marginTop:8}}
                />
                </View>

                <View style={{marginTop:15,flex:0.6,marginLeft:20,marginRight:10}} >

                    <CusIosBaseText>{info.item.pt_name}</CusIosBaseText>

                    <View style={{flexDirection:'row',marginTop:5, alignItems: 'center'}}>

                        <Image
                            source = {info.item.score > 0?require('./img/star_shi.png'):require('./img/star_kong.png')}
                            style={{resizeMode:'stretch',width:11,height:11,marginLeft:0}}
                        />
                        <Image
                            source = {info.item.score > 1?require('./img/star_shi.png'):require('./img/star_kong.png')}
                            style={{resizeMode:'stretch',width:11,height:11,marginLeft:2}}
                        />
                        <Image
                            source = {info.item.score > 2?require('./img/star_shi.png'):require('./img/star_kong.png')}
                            style={{resizeMode:'stretch',width:11,height:11,marginLeft:2}}
                        />
                        <Image
                            source = {info.item.score > 3?require('./img/star_shi.png'):require('./img/star_kong.png')}
                            style={{resizeMode:'stretch',width:11,height:11,marginLeft:2}}
                        />

                        <Image
                            source = {info.item.score > 4?require('./img/star_shi.png'):require('./img/star_kong.png')}
                            style={{resizeMode:'stretch',width:11,height:11,marginLeft:2}}
                        />

                        <CusIosBaseText>  {info.item.number}人在玩</CusIosBaseText>
                    </View>
                </View>

                <View style={{flex:0.2,alignItems:'center',justifyItems:'center',marginRight:10}}>
                    <TouchableOpacity
                    style={{height:26,width:70,borderColor:'#fc7c3f',marginTop:22,borderWidth:1,borderRadius:13,alignItems: 'center',justifyItems:'center',}}
                    activeOpacity={1}
                    onPress={ () => this._jumpBuyLotDetail(info)
                    }

                    >
                    <CusIosBaseText style={{color:'#fc7c3f',fontSize: Adaption.Font(17, 15),marginTop:3}} >进入</CusIosBaseText>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }


    // 点击cell跳转投注页
    _jumpBuyLotDetail(info) {
        if (info.item.enable == 1)
        {

            Alert.alert(
                '提示',
                '该彩种正在维护',
                [
                    {
                        text: '确定', onPress: () => {
                        }
                    },
                ]
            )
            return;
        }

        if (global.UserLoginObject.Token != '' || global.UserLoginObject.Token.length != 0) {
            if (global.UserLoginObject.is_Guest == 2) {
                this.props.navigator.navigate('HomeComputMGGameView', { backAction: this.props.backAction, title: info.item.pt_name,playGame:info.item.tag})
            } else {
                this.props.navigator.navigate('HomeLandComputGameView', { backAction: this.props.backAction, title: info.item.pt_name,playGame:info.item.tag})

            }
        } else {
            Alert.alert(
                '温馨提示',
                '您还未登录,请先登录',
                [
                    {
                        text: '确定', onPress: () => {
                        }
                    },
                ]
            )
        }


        //足彩入口
        // else if (info.item.js_tag === 'sport_key')
        // {
        //     //  //进入体彩的入口
        //     this.props.navigator.navigate('FootballGame',  {
        //         gameId: info.item.game_id,
        //         backAction: this.props.backAction
        //     })
        // }
        // else
        // {
        //     global.isInBuyLotVC = true;
        //     this.props.navigator.navigate('BuyLotDetail', {
        //         gameId: info.item.game_id,
        //         indexList: info.index,
        //     })
        // }
    }



}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection:'row',
    },

    itemStyle: {
        backgroundColor: 'white',
        width: cellW,
        height: SCREEN_WIDTH == 320 ? cellW + 25: cellW + 10,
        alignItems: 'center',
        // borderRightWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: '#cccccc',
    },

    mcStyle:{
        flexDirection:'row',
        height:70,
        borderBottomWidth: 0.5,
        borderColor: '#cccccc',


    },
});

export default NewLotBlockViewThere;
