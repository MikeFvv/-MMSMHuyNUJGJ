import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    AppState,
} from 'react-native';

import Moment from 'moment';
let iphone5S =global.iOS ? (SCREEN_WIDTH == 320 ? true : false):0;

class LHCHeaderView extends Component {

    //构造器
    constructor(props)
    {
        super(props);

        this.state = ({
           countTime: props.nextJieZhi,
           qiShu:props.theQiShu,
           tag: props.tag ? props.tag : '',
        })
    }

    //将要接收到传过来的数据
    componentWillReceiveProps(nextProps){

        if (nextProps.tag != null){

            this.state.tag = nextProps.tag;
        }
    }

    componentWillMount(){

        this._setTimeInval();

    }

    componentDidMount(){

        AppState.addEventListener('change', (appState)=> {

            //活跃状态重新刷数据
            if (appState == 'active'){
                this._featchData(this.state.tag);
            }
        });

        AppState.addEventListener('memoryWarning', () => {
            //this.setState({memoryWarnings: this.state.memoryWarnings + 1});
        });

    }

    //移除通知
    componentWillUnmount(){

        AppState.removeEventListener('change');
        AppState.removeEventListener('memoryWarning');

    }

    //刷新头部倒计时
    _featchData(tag){

        let params = new FormData();
        params.append("ac", "getCPLogInfo");
        params.append("tag", tag);
        params.append('pcount', '1');
        params.append('ncount', '1');

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                var nextList = [];
                var i = 0;
                let cainfoData = responseData.data;
                //解析next数组
                cainfoData.next.map((next) =>{
                    nextList.push({ key: i, value: next});
                    i++;
                });

                //请求下一期的开奖信息
                let nextModel = nextList[0];

                let jieZhiTime = 0;  //计算后的截止时间
                let lockTime = 0;  //玩法配置的锁定时间

                if (global.GameListConfigModel[tag] != null){
                    lockTime =  parseInt(global.GameListConfigModel[tag].lock_time, 10);
                }

                let systemTime = parseInt(Moment().format('X'), 10);

                let differ = systemTime - nextModel.value.server_time;
                jieZhiTime = nextModel.value.end_time - systemTime - differ - parseInt(lockTime,10);

                //如果系统时间计算不出来使用jiezhiTime
                if (jieZhiTime <= 0){
                    jieZhiTime =nextModel.value.jiezhitime;
                }

                this.props.currentQiShu ? this.props.currentQiShu(nextModel.value.qishu) : null;  //回调期数

                this.setState ({
                    qiShu:nextModel.value.qishu,  //下一期开奖的期数
                    countTime:jieZhiTime,  //下一期截止时间
                })

                this._setTimeInval();
            })
            .catch((err) => {
                // console.log('请求失败-------------->', err);
            })
    }

    //定时器开始
    _setTimeInval(){

        //重新加载数据

        if (this.timer) {
            return;
        }

         this.timer = setInterval(() => {

         if (this.state.countTime < 1){

             this._featchData(this.state.tag);
             PushNotification.emit('CountTimeDeadLine1');
         }

         this.setState({
            countTime:this.state.countTime - 1,
          })

       }, 1000);
    }

    _changeTime(totalTime) {

        if (isNaN(totalTime))
        {
            return '00:00:00';
        }
        else
        {
          let day = Math.floor((totalTime  /60 / 60 / 24) * 100)/100; //保留两位小数
          let hour = Math.floor(totalTime  /60 / 60 % 24);
          let min = Math.floor(totalTime  /60 % 60);
          let seconds = Math.floor(totalTime % 60);

          //大于1天则要乘以24
          if (day >= 1.0){
              hour = Math.floor(day * 24);
          }

            if (hour < 10)
            {
                hour = '0' + hour;
            }

            if (min < 10)
            {
                min = '0' + min;
            }

            if (seconds < 10)
            {
                seconds = '0' + seconds;
            }

            return `${hour}:${min}:${seconds}`;  //格式化输出
        }
    }

    //销毁定时器
    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }

    render() {

        // {/*下面2个按钮（香港六合彩是返回购彩和清空全部  非官方彩是返回购彩和智能追号）*/}
        let theTwoButton = (this.props.tag == 'xglhc') ?  (<TouchableOpacity style = {{flex:0.3,marginRight:15}} activeOpacity={0.5} onPress = {() => this.props.clearAllNumOnPress ? this.props.clearAllNumOnPress() : null}>
            <Image style = {styles.cpToolImageView} source = {require('../../../img/ic_clearAll.png')}></Image>

        </TouchableOpacity>) : (<TouchableOpacity style = {{marginRight:15,flex:0.3,marginLeft:15, height:30, flex:(iphone5S?0.3:0.26), justifyContent:'center', alignItems:'center', flexDirection:'row', borderWidth:1, borderColor:'lightgrey', borderRadius:5, backgroundColor:'#f7f8f9'}} activeOpacity={0.5} onPress = {() => this.props.smartNum ? this.props.smartNum() : null}>
            <Image style = {{width:15, height:15}} source = {require('../../../img/ic_smart_zhuihao.png')}></Image>
            <Text allowFontScaling={false} style = {{marginLeft:5, color:'#e33939'}}>智能追号</Text>

        </TouchableOpacity>)
        return (
            <View style = {this.props.style}>

                <View style = {{flex:0.3}}>
                  <CusBaseText style = {styles.cpQiShuInfo}>距{this.state.qiShu ? this.state.qiShu : ''}期还有
                    <CusBaseText style = {{fontSize:Adaption.Font(15,13), color:'red'}}>{this.state.countTime > 0 ? this._changeTime(this.state.countTime) : '00:00:00'}
                    </CusBaseText>
                  </CusBaseText>
                </View>

                <View style = {{flexDirection:'row',alignItems:'center', justifyContent:'space-between', flex:0.7,width:SCREEN_WIDTH}}>

                <TouchableOpacity style = {{marginLeft:15, height:30, flex:(iphone5S?0.3:0.26), justifyContent:'center', alignItems:'center', flexDirection:'row', borderWidth:1, borderColor:'lightgrey', borderRadius:5, backgroundColor:'#f7f8f9'}} activeOpacity={0.5} onPress = {() => this.props.comformOnPress ? this.props.comformOnPress() : null}>
                    <Image style = {{width:15, height:15}} source = {require('../../../img/ic_buyLotGoBack.png')}></Image>
                    <Text allowFontScaling={false} style = {{marginLeft:5, color:'#737373'}}>返回购彩</Text>
                    {/* <TouchableOpacity style = {{height:30, flex:0.26}} activeOpacity={0.5} onPress = {() => this.props.comformOnPress ? this.props.comformOnPress() : null}>
                        <Image style = {styles.cpToolImageView}  source = {require('../../../img/ic_handleAdd.png')}></Image> */}
                    </TouchableOpacity>
                    {theTwoButton}

                    {/*<View style = {{flex:0.45}}></View>*/}


                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    cpQiShuInfo:{
      fontSize:Adaption.Font(16,14),
      color:'grey',
      marginTop:5,
    },

    cpToolImageView:{
      width:Adaption.Width(100),
      height:30,
      marginLeft:10,
      marginRight:10,
      borderColor:'lightgrey',
      borderWidth:1.0,
      borderRadius:5
    },

});

export  default  LHCHeaderView;
