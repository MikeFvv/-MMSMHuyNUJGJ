/**
 Author Ward
 Created by on 2018-08-14
 经典梯子游戏封装视图
 **/

import React, { Component } from 'react';

import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';

import LadderView from './viewClass/LadderClass/LadderView';
import LadderOpenInfo from './viewClass/LadderClass/LadderOpenInfoView';
import LadderBuyCenter from './viewClass/LadderClass/LadderBallPickeView';

import Toast, {DURATION} from 'react-native-easy-toast'  //土司视图

export default class newLotteryView extends Component{

    constructor(props){
        super(props);

        this.state = ({
            ladderInfoModel:null,  //传递给开奖视图的数据模型
            currentZhuShu:0,  //当前选择的号码注数
            openListArr: props.prevList,  //开奖信息数组
            tag:props.tag,
            finishTime:0,//请求数据完成的时间
            js_tag:props.js_tag,
            nextCountDownList: props.nextTimeList, //开奖数组10条
            peilvDataList:[],   //赔率号码数组
            currentPlayDataArr:[],  //当前玩法配置说明数组
            currentplayName:'',  //存放当前玩法name
        })
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.finishTime != 0 && this.state.finishTime == 0){
            this.setState({finishTime:nextProps.finishTime});
        }

        if (nextProps.prevList && this.state.openListArr.length <= 0){

            this.setState({openListArr:nextProps.prevList});
        }

        if (nextProps.nextTimeList && this.state.nextCountDownList.length <= 0){

            this.setState({nextCountDownList:nextProps.nextTimeList});
        }

        if (nextProps.peilvDataArr.length != 0 && this.state.peilvDataList.length == 0){
            this.setState({peilvDataList:nextProps.peilvDataArr});
        }

        if (nextProps.wafaDataArr.length != 0 && this.state.currentPlayDataArr.length == 0){

            let playName = nextProps.wafaDataArr[0] ? nextProps.wafaDataArr[0].submenu[0].playlist[0].playname : '';

            this.setState({currentPlayDataArr:nextProps.wafaDataArr, currentplayName:playName});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {

        let aaa = nextProps.finishTime != 0 && this.state.finishTime == 0;
        let bbb = nextProps.prevList && this.state.openListArr.length <= 0;
        let ccc = nextProps.nextTimeList && this.state.nextCountDownList.length <= 0;
        let ddd = nextProps.peilvDataArr.length != 0 && this.state.peilvDataList.length == 0;
        let eee = nextProps.wafaDataArr.length != 0 && this.state.currentPlayDataArr.length == 0;

        if (aaa || bbb || ccc || ddd || eee){
            return true;
        }
        else  {
            return false;
        }

    }

    render (){

        return <View style = {{flex:1, backgroundColor:'#fff'}}>
            <LadderView style = {{height:120}}  openList={this.state.openListArr}/>
            {this.state.currentPlayDataArr.length != 0 ? <ScrollView style = {{backgroundColor:'#fff', marginTop:80}}>
                <LadderBuyCenter
                peilvDataArr={this.state.peilvDataList}
                wanfaDataArr={this.state.currentPlayDataArr}
                style = {{height:360}}
                PickZhuShu={(pickerDataArr, ballsArcdomArr)=>{

                this.state.openListArr = [];  //这个数据也要赋值为空
                let ballsArr = [];
                let ballsDescArr = [];
                let peilvArr = [];

                for (let pickerData of pickerDataArr){
                ballsArr.push(pickerData.idx);
                ballsDescArr.push(pickerData.desc);
                peilvArr.push(pickerData.peilv);
            }

                let pickerDataDict = {[this.state.currentplayName]:ballsDescArr,[`${this.state.currentplayName}^^01`]:ballsArr,'赔率':peilvArr};

                this.props.BallsSelectArr ? this.props.BallsSelectArr(pickerDataDict, [this.state.currentplayName], ballsArcdomArr) : null;
            }}/>
                <View style = {{height:20, width:SCREEN_WIDTH, marginTop:50}}/>
                </ScrollView> : null}
            <LadderOpenInfo
                nextCountDownList={this.state.nextCountDownList}
                openList={this.state.openListArr}
                finishTime={this.state.finishTime}
                againRequestTime={(finishTime, nextList) => {
                    this.props.againRequestTime ? this.props.againRequestTime(finishTime, nextList) : null;
                }}
                tag={this.state.tag}
                js_tag={this.state.js_tag}
                style = {{position:'absolute', top:120, height:80, width:SCREEN_WIDTH, backgroundColor:'#eee'}}
                NoLoginClick = {() => {
                    this.props.pleaseLoginClick ? this.props.pleaseLoginClick() : null;
                }}
            />
            {/* 购物车按钮 */}
            <TouchableOpacity activeOpacity={0.9}
                              style={{ position: 'absolute', bottom: Adaption.Width(10), left: Adaption.Width(25), width: Adaption.Width(57), height: Adaption.Width(57), backgroundColor: '#fff', borderWidth: 1.0, borderColor: '#d3d3d3', borderRadius: Adaption.Width(57 * 0.5), justifyContent: 'center', alignItems: 'center' }}
                              onPress={() => {
                                  // 购物车回调
                                  this.props.shopCarClick ? this.props.shopCarClick() : null;
                              }}>
                <Image style={{ width: Adaption.Width(33), height: Adaption.Width(33) }} source={require('../img/ic_shopCar.png')} />

                {this.props.shopCarZhushuNum == 0 ? null :
                    <View style={{
                        backgroundColor: '#e33939', width: Adaption.Width(26), height: Adaption.Width(26), borderRadius: Adaption.Width(13),
                        justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: Adaption.Width(26)
                    }}>
                        <Text
                            allowFontScaling={false}
                            style={{ fontSize: this.props.shopCarZhushuNum > 99 ? Adaption.Font(12) : Adaption.Font(15), color: '#fff', backgroundColor: 'rgba(0,0,0,0)' }}>
                            {this.props.shopCarZhushuNum > 99 ? '99+' : this.props.shopCarZhushuNum}
                        </Text>
                    </View>
                }
            </TouchableOpacity>
            <Toast ref="Toast" position='center'/>
        </View>
    }
}