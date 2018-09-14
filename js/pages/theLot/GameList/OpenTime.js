import React, {
    Component
} from 'react';

import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    Alert,
} from 'react-native';
import Moment from 'moment';


const {width,height} = Dimensions.get('window')
const screenWidth = width
const screenHight = height

 class OpenTime extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tag:props.tag?props.tag:'',
            dataTime:props.nextTimeData ? props.nextTimeData : [],  //数据数组
            nextjiezhitime:props.jiezhitime ? props.jiezhitime : '', //当前时间
            oneqishu:props.prevqishu ? props.prevqishu:'',
            fengPanTime:props.fengPanTime ? props.fengPanTime:'',
            finishTime: Math.round(new Date() / 1000),
        };

        this.timer01= null;
        this.timer02=null;
        this.currentIdx = 0;  // 为防止用户要投注界面停留了几期后 才进入路图。所以idx不能固定取0


        if (this.state.oneqishu > 0 && this.state.dataTime.length > 0) {
            for (let a = 0; a < props.nextTimeData.length; a++) {
                let qishu = props.nextTimeData[a].qishu;
                if (this.state.oneqishu == qishu) {
                    this.currentIdx = a;
                    break;
                }
            }
        }
    }


     componentWillReceiveProps(nextProps) {
      //重新赋值tag 和 jstag 同步刷新界面
      if (nextProps.nextTimeData != 0){
         if(this.state.tag != nextProps.tag) {

             this._featchData(nextProps.tag);
         }
        this.setState({
            tag:nextProps.tag?nextProps.tag:'',
            dataTime:nextProps.nextTimeData,
            oneqishu:nextProps.prevqishu,
            nextjiezhitime:nextProps.jiezhitime,
            fengPanTime:nextProps.fengPanTime ? nextProps.fengPanTime:'',
          })
          }

          if (this.state.oneqishu > 0 && this.state.dataTime.length > 0) {
            for (let a = 0; a < nextProps.nextTimeData.length; a++) {
                let qishu = nextProps.nextTimeData[a].qishu;
                if (this.state.oneqishu == qishu) {
                    this.currentIdx = a;
                    break;
                }
            }
        }
    }



    componentDidMount() {

        //this._featchData(this.state.tag);
        this._countTime();
    }

    componentWillUnmount() {

        this.timer01 && clearInterval(this.timer01);
        this.timer02 && clearTimeout(this.timer02);
 
        }

        
        
        _countTime(){

        this.timer01 = setInterval(() => {

            if (this.state.nextjiezhitime < 1 && this.state.dataTime.length > 0) {
                // 准备取下一期的时间。
                this.currentIdx += 1;
                // this.props.enterNextQi ? this.props.enterNextQi() : null; // 回调回去，请求开奖记录。

                if (this.currentIdx < this.state.dataTime.length) {

                    // 下一期的stopless 要减少上一期的openless。
            
                    let qishu = this.state.dataTime[this.currentIdx].qishu;

                    this.setState({
                        oneqishu: qishu,   // 当前期数
                    });
                }
            }

            
        // 已封盘 且nextData数据已经用到最后一期了。请先去请求了。
        if (this.state.fengPanTime == 0 && this.currentIdx >= this.state.dataTime.length - 1) {
            // 请求新的倒计时数据。
            this._featchData(this.state.tag);
        }

        let currOpen = 0, currStop = 0;
            if (this.currentIdx < this.state.dataTime.length) {
                // 倒计时时间直接用opentime 减 手机系统时间。
                currOpen = this.state.dataTime[this.currentIdx].opentime - (this.state.dataTime[this.currentIdx].server_time - this.state.finishTime) - Math.round(new Date() / 1000);
                currStop = this.state.dataTime[this.currentIdx].stoptime - (this.state.dataTime[this.currentIdx].server_time - this.state.finishTime) - Math.round(new Date() / 1000);
            }

        this.setState({
            fengPanTime: currStop,
            nextjiezhitime:currStop,
        });


          }, 1000);


        }


        
   

    render() {

          let  qishu3 ='';
          if(this.state.oneqishu== '0'){
            qishu3 =this.state.oneqishu
          } else{
            let qishuStr = `${this.state.oneqishu}`; // 防止期数返回的类型不是string
            qishu3 = qishuStr.substr(qishuStr.length - 4, 4);  // .substr(截取起始下标, 截取的长度)
          }

        let iphoneX = global.iOS ? (SCREEN_HEIGHT == 812 ? true : false) : 0; //是否是iphoneX
        return (
            <View style={{height:50,flexDirection: 'row',backgroundColor:'rgba(48,49,50,10)',marginBottom:iphoneX?34:0}}>
            <View style={{width:SCREEN_WIDTH-SCREEN_WIDTH/3,flexDirection: 'row',}} >
            <View style={{alignItems:'center',justifyContent:'center',flex:1,flexDirection: 'row',}}>
                 <CusBaseText style={{color:'white',fontSize:Adaption.Font(16, 14)}}>距离 {qishu3} 期投注截止</CusBaseText> 
                 <CusBaseText style={{color:'red',fontSize:Adaption.Font(16, 14)}}>  {this.state.fengPanTime < 0 && this.state.oneqishu > 0 ? '已封盘' : this._changeTime(this.state.fengPanTime)}</CusBaseText>
                 </View>           
                 </View>
                 <View style={{width:30,backgroundColor:'rgba(48,49,50,10)',}}>
                 </View>

                 <TouchableOpacity style={{width:SCREEN_WIDTH/3-30,backgroundColor:'#e33933',}}
                  onPress = {() => {
                    this.props.touZhuClick ? this.props.touZhuClick() : null;
                  }}>
                  <View style={{alignItems:'center',justifyContent:'center',flex:1}}>
                 <CusBaseText style={{color:'white',fontSize:Adaption.Font(18, 16),}}>去投一注</CusBaseText>
                 </View>
                  </TouchableOpacity>

            </View>
        );
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


     //底部刷新
     _featchData(tag){
         // console.log("tag",tag);

         let params = new FormData();
         params.append("ac", "getCplogList");
         params.append("tag", tag);
         var promise = GlobalBaseNetwork.sendNetworkRequest(params);
         promise
             .then((response) => {
            
                if (response.msg == 0 && response.data.length != 0) {

                    this.state.dataTime = response.data[0].next;
                    this.currentIdx = 0;  // 重置。

                    this.state.finishTime = Math.round(new Date() / 1000);
                    let openTime = this.state.dataTime[0].opentime - (this.state.dataTime[0].server_time - this.state.finishTime) - Math.round(new Date() / 1000);
                    let stopTime = this.state.dataTime[0].stoptime - (this.state.dataTime[0].server_time - this.state.finishTime) - Math.round(new Date() / 1000);

                    let qishu = this.state.dataTime[0].qishu;

                    this.setState({
                        fengPanTime: stopTime,  // 封盘时间
                        nextjiezhitime: openTime,     // 开奖时间
                        oneqishu: qishu,   // 当前期数
                    });
                }

                //  var nextList = [];
                //  var i = 0;
                //  let cainfoData = responseData.data[0];
                //  //解析next数组
                //  cainfoData.next.map((next) =>{
                //      nextList.push({ key: i, value: next});
                //      i++;
                //  });

                
                //  //请求下一期的开奖信息
                //  let nextModel = nextList[0];
                // // let jieZhiTime = nextModel.value.opentime - nextModel.value.server_time;
                // let  jieZhiTime = nextModel.value.stoptime - nextModel.value.server_time;


                //  this.setState ({
                //      oneqishu:nextModel.value.qishu ,  //下一期开奖的期数
                //      nextjiezhitime:jieZhiTime,  //下一期截止时间
                //      // isShow:false

                //  })
                
             })
             .catch((err) => {
                if (err && typeof(err) === 'string' && err.length > 0) {
                    this.refs.LoadingView && this.refs.LoadingView.showFaile(err);
                }
             })
     }




};

// 65+10+16+5+10
const styles = StyleSheet.create({

    tip: {
        marginTop: 17,
    },
});


 module.exports = OpenTime;


