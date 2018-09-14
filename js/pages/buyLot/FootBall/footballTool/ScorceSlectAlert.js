/**
 * Created by Ward on 2018/03/21.
 */

import React, { Component } from 'react'
import {
    View,
    Modal,
    ImageBackground,
    TouchableOpacity,
    Image,
} from 'react-native'

//选择框图片数组
let scoreImageList = ['',
    require('../img/ic_LeagueSort.png'), require('../img/ic_TouZhuRecord.png'),
    require('../img/ic_SportsRules.png'), require('../img/ic_GameResult.png'), require('../img/ic_PeiLvCaculate.png')];

//选择框文字数组
let scoreTitleList = ['余额:','筛选联赛','投注记录','体育规则','比赛结果', '赔率计算表'];

export default class ScorceSlectAlert extends Component {

    constructor(props) {
        super(props);

        this.state = ({

            isShow:false,
        })
    }

    showAlertView = () => {
        this.setState({
            isShow:true,
        })
    }

    _initScroceListView(){

        let scroceListViewArr = [];  //视图数组

        for (let i = 0; i < scoreImageList.length; i++){

            scroceListViewArr.push(i != 0 ? <TouchableOpacity  activeOpacity={0.9} onPress = {() => {this.setState({isShow:false}); this.props.CellClick ? this.props.CellClick(i) : null;}} key = {i} style = {{alignItems:'center',flexDirection:'row', height:40, borderBottomWidth:1,borderBottomColor:'#dfdfdf'}}>
                <Image style = {{marginLeft:15, width:19, height:19}} source={scoreImageList[i]}/>
                <CusBaseText style = {{marginLeft:15, color:'#535353', fontSize:Adaption.Font(17,14)}}>
                    {scoreTitleList[i]}
                </CusBaseText>
            </TouchableOpacity> : <View key = {i} style = {{alignItems:'center',flexDirection:'row', height:40, borderBottomWidth:1,borderBottomColor:'#dfdfdf'}}>
                <CusBaseText style = {{marginLeft:15, color:'black', fontSize:Adaption.Font(17,15)}}>
                    余额:<CusBaseText style = {{color:'#fc7c3f', fontSize:Adaption.Font(16,14)}}>
                    {` ¥${global.UserLoginObject.TotalMoney != '' ? global.UserLoginObject.TotalMoney : '0.00'}`}
                </CusBaseText>
                </CusBaseText>
            </View>)
        }

        return scroceListViewArr;
    }

    render() {

        let isIphoneX = SCREEN_HEIGHT == 812 ? true : false;  //是否为iphoneX

        let leftViewHeight = isIphoneX ? 88 : 64;

        return (<Modal
            visible={this.state.isShow}
            animationType={'fade'}
            transparent={true}
            onRequestClose={() => {}}>
            <TouchableOpacity activeOpacity={1} onPress = {() => this.setState({isShow:false})} style = {{width:SCREEN_WIDTH,  height:SCREEN_HEIGHT, backgroundColor:'rgba(0,0,0,0)', flexDirection:'row'}}>
                <View style = {{width:SCREEN_WIDTH - 150}}>
                    <View style = {{marginTop:leftViewHeight, backgroundColor:'rgba(0,0,0,0.5)', height:SCREEN_HEIGHT - leftViewHeight}}/>
                </View>
                <View style = {{width:150}}>
                    <View style = {{height:leftViewHeight - 20}}/>
                    <ImageBackground source={require('../img/ic_MoreFunction.png')} resizeMode={'stretch'} style = {{width:150, height:270,backgroundColor:'rgba(0,0,0,0)'}}>
                        <View style = {{marginTop:30}}>{this._initScroceListView()}</View>
                    </ImageBackground>
                    <View style = {{backgroundColor:'rgba(0,0,0,0.5)', height:SCREEN_HEIGHT - leftViewHeight + 20 - 270}}/>
                </View>
            </TouchableOpacity>
        </Modal>);
    }
}
