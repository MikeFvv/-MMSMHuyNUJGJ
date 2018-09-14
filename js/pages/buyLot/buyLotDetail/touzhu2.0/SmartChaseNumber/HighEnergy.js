import React, {Component} from 'react';

import {
    StyleSheet,
    View,
    StatusBar,
    ScrollView,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    TextInput,
    ImageBackground,
    Dimensions,
    Alert,
    DeviceEventEmitter,  //通知
} from 'react-native';

import Moment from 'moment';
import SmartChaseCell from './AllenSmartChaseCell3';
import Toast, {DURATION} from 'react-native-easy-toast'
import TouZhuParam from '../../TouZhuParam';
import AllenChasePlan from './AllenChasePlan3';

import KnowChanPlan from './KnowChanPlan'
const {width, height} = Dimensions.get('window');
let iphoneX = global.iOS ? (SCREEN_HEIGHT == 812 ? true : false) : 0; //是否是iphoneX
let iphone5S = global.iOS ? (SCREEN_WIDTH == 320 ? true : false) : 0;
export default class HighEnergy extends Component {


    static navigationOptions = ({navigation, screenProps}) => ({

        header: (
            <CustomNavBar
                centerText = {"智能追号"}
                threeView = {true}
                centerTexts = {['平倍追号','翻倍追号','智能追号']}
                centerTextscallback = {[()=>{navigation.state.params.navigateRightPress(1)},()=>{navigation.state.params.navigateRightPress(2)},()=>{navigation.state.params.navigateRightPress(3)}]}
                leftClick={() =>  { global.isInShopCarVC = true; navigation.goBack()} }
            />
        ),

    });

    constructor(props) {
        super(props);
        this.state = {

            currentTime: this.props.navigation.state.params.currentTime,
            isFenPanTime:this.props.navigation.state.params.isFenPanTime,
            tag: this.props.navigation.state.params.tag,
            qiShu: this.props.navigation.state.params.qiShu,
            datas: this.props.navigation.state.params.datas,
            js_tag: this.props.navigation.state.params.js_tag,
            maxWinningAmount:this.props.navigation.state.params.maxWinningAmount,
            isShow: true,
            totalMoneyNormal:this.props.navigation.state.params.totalMoneyNormal,
            dataSourceNormal:this.props.navigation.state.params.dataSourceNormal,
            isStop: true,   //追号默认trun
            backKey: this.props.navigation.state.params.backKey,
            isDataS :[],
            isChangGeDataNormal:true,
            isCopyArray:[],
            isSealTime : 0,
            isFeiPanText:false,
            type:1
            
        }
        this.currentIdx = 0;
        this.startQishuInfo=[];
    }


    textonecallback(){

    }
    texttwocallback(){

    }
    textthreecallback(){

    }


    componentDidMount() {


        this.props.navigation.setParams({
            navigateRightPress: this._navigateRightPress,

        });

        global.isInShopCarVC = false; //进入下一界面时改为false,防止弹窗在别的界面弹出
        this.refs.LoadingView && this.refs.LoadingView.showLoading('正在加载中...');
        var arr = this.state.datas;
        var newArr = []  // 为了使用数组的push方法，一定要定义数据类型为数组
        newArr.push(arr[0])  // 拿到第一个数组 
        this.state.isDataS = newArr;
        this._setTimeInval();

        console.log('购物车参数', this.state.dataSourceNormal,);
    }

    _navigateRightPress = (type) => {
       console.log(type);
    }


    _changeArray(){
   
        this.state.isCopyArray = this.state.dataSourceNormal;  
        newArrA1=[];  
        for(var i=0;i<this.state.isCopyArray.length;i++){
            newArrA1.push(this.state.isCopyArray[i])  // 用循环逐个把值保存在新数组内 
            newArrA1[i].qiShu = newArrA1[i].qiShu + 1;
        }
       this.setState({
        isCopyArray : newArrA1,
       });
      
    }
    
   

    //程序人口
    render() {

        let maxNun = this.state.maxWinningAmount;
        return <View style={{flex: 1, backgroundColor: '#f6f6f6'}}><View style={{flex: 1, backgroundColor: '#f6f6f6'}}>
            {/*截止时间*/}
            <View style={styles.timeStyle}>
                <CusBaseText
                    style={{color: '#707070'}}>第{this.state.qiShu ? String(this.state.qiShu).substr(String(this.state.qiShu).length-4):null}期投注截止时间: </CusBaseText>
                <CusBaseText
                    style={{color: '#e33939'}}>{(this.state.isFenPanTime < 0 && this.state.qiShu > 0) ? '已封盘' : this._changeTime(this.state.isFenPanTime)}</CusBaseText>
            </View>
      
                <View style={{
                    backgroundColor: 'white',
                    paddingVertical: 5,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingRight: 10,
                    height:55,
                }}>
                    <TouchableOpacity  style={{marginLeft:width/2+80}}
                    activeOpacity={0.7} onPress={() => {}}>
                        <Text style={{fontWeight: '500', fontSize: Adaption.Font(19,17), color: '#05e400'}}>修改方案
                            ></Text>
                    </TouchableOpacity>
                </View>
            
            {/*表头*/}
                <View style={{flexDirection: 'row',}}>
                 {this._cellHader()}
                 </View>

            <FlatList
                // scrollEnabled={false}
                ref='myListView'
                data={this.state.isCopyArray.length < 1 ? this.state.dataSourceNormal : this.state.isCopyArray}
                extraData={this.state.indexone}
                renderItem={(date) => this.renderItem(date)}
            />
           
        </View>
            <View style={{backgroundColor: '#dbdbdb', height: 1, width: SCREEN_WIDTH}}/>

            <View style={{height: 49, flexDirection: 'row', marginBottom: iphoneX ? 34 : 0}}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
                <View>
                        {this.state.isStop ? (<TouchableOpacity onPress={() => {
                                this.setState({isStop: false})
                            }} activeOpacity={1} style={styles.check_Box}>
                                <View style={{
                                    borderColor: '#a5a5a5', borderRadius: 3, borderWidth: 1, width: 25, height: 25,
                                    alignItems:
                                        'center', justifyContent: 'center'
                                }}>
                                    <Image style={{width: 20, height: 20,}}
                                           source={require('../img/ic_smart_checkBox.png')}/></View>

                            </TouchableOpacity>) :
                            (<TouchableOpacity onPress={() => {
                                this.setState({isStop: true})
                            }} activeOpacity={1} style={styles.check_Box}>
                                <View style={{
                                    borderColor: '#a5a5a5',
                                    borderRadius: 3,
                                    borderWidth: 1,
                                    width: 25,
                                    height: 25
                                }}/>

                            </TouchableOpacity>)}
                    </View>

                    <View style={{marginLeft: 10}}>
                        <CusBaseText style={{fontSize: Adaption.Font(18,16), color: "#6a6a6a"}}>中奖后停止追号</CusBaseText>
                        <CusBaseText style={{marginTop: 0, fontSize: Adaption.Font(18,16), color: "#6a6a6a"}}>共追
                            <CusBaseText
                            style={{color: "#e33939",fontSize: Adaption.Font(18,16)}}> {this.state.dataSourceNormal.length} </CusBaseText>期
                            <CusBaseText
                            style={{color: "#e33939",fontSize: Adaption.Font(18,16)}}> {this.state.totalMoneyNormal}
                            </CusBaseText>元
                        </CusBaseText>
                    </View>
                </View>
                <TouchableOpacity activeOpacity={0.7} onPress={this.submit}>
                    <View style={{height: 49, backgroundColor:this.state.isFeiPanText == false ?  "#e33939" : "#ccc", flexDirection: 'row', alignItems: 'center'}}>
                        <Text allowFontScaling={false}
                              style={{marginHorizontal: 10, fontSize: 17, color: 'white'}}>确认追号</Text>
                    </View>
                </TouchableOpacity>
            </View>

               <LoadingView ref='LoadingView' />
        
        </View>
    }


      //头部封装

      _cellHader(){
        let numhederArrFlex = [];  titleHaderArrName = [];
           numhederArrFlex = [0.1,0.15,0.15,0.2,0.2,0.2];
          titleHaderArrName  = ['序号','期号','倍数','金额','中将盈利','盈利率'];
          var arrayHaderTitle =[];
          for (let i = 0; i< numhederArrFlex.length; i++){
             arrayHaderTitle.push(
              <View  key={i} style={{height:40,flex:numhederArrFlex[i],alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderTopWidth:1,borderTopColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5,}}>
               <CusBaseText style={{fontSize:this.baseFontSize}}>{titleHaderArrName[i]}</CusBaseText>  
              </View>
             )
          }
          return  arrayHaderTitle;
      }
  

    submit = () => {
         
        if (this.state.isFeiPanText == true){

            this.refs.LoadingView && this.refs.LoadingView.showLoading('已封盘，不能下注，请稍等...');          
        }else{

            this._comformRequest(this.props.navigation);
        }
       
       
    }

    //cell
    renderItem(date) {
      return(
      <View style={{flexDirection: 'row',flex:1,backgroundColor:date.index%2?'white':'#f6f6f6'}}>{this._renDerItemCell(date)}</View>
       )
    }

      _renDerItemCell(date){
          let numDateArrFlex = [0.1,0.15,0.15,0.2,0.2,0.2];
          let qishu =  `${date.item.qiShu}`;
          //let numAdd = `${(Math.ceil(date.item.money))}`;
          let winningProfit =  (this.state.maxWinningAmount*date.item.num - date.item.money).toFixed(2);
          let profitE = ((this.state.maxWinningAmount*date.item.num - date.item.money)*100/date.item.money).toFixed(0);
          let colorArr= ['#676767','#676767','#676767','#676767','#e33939','#e33939',]
          qishu =  qishu.substr(qishu.length - 4, 4);
          let titleDateArrName  = [date.index+1,qishu,date.item.num,date.item.money,winningProfit,`${profitE}%`];

          var arraydataTitle =[];
          for (let i = 0; i< numDateArrFlex.length; i++){
            arraydataTitle.push(
              <View  key={i} style={{backgroundColor:date.index%2?'#f6f6f6':'white',height:40,flex:numDateArrFlex[i],alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:1,}}>
               <CusBaseText style={{fontSize:this.baseFontSize,color:colorArr[i]}}>{titleDateArrName[i]}</CusBaseText>  
              </View>
             )
          }
          return  arraydataTitle;
      }



      _changeTime(time) {

        if (time == null || time <= 0) {
            return '00:00:00';

        } else {

            let hour = Math.floor(time / (60 * 60));  // 总时间戳 / (1小时的秒数)
            let min = Math.floor(time / 60 % 60);  // 总时间戳 / 1分钟的秒数 % 1分钟的秒数
            let seconds = Math.floor(time % 60);  // 总时间戳 % 1分钟的秒数

            return `${hour < 10 ? '0'+hour : hour}:${min < 10 ? '0'+min : min}:${seconds < 10 ? '0'+seconds : seconds}`;
        }
    }

  //定时器开始
  _setTimeInval() {

    //重新加载数据
    if (this.timer)
    {
        return;
    }
    this.timer = setInterval(() => {

         if (this.state.isFenPanTime < 0){

            this.setState({
                isFeiPanText:true,
            })
         }else {

            this.setState({
                isFeiPanText:false,
            }) 
         }


        if (this.state.currentTime < 1 && this.startQishuInfo.length > 0) {

             //      PushNotification.emit('CountTimeDeadLine1');  //倒计时结束发出通知
            // 准备取下一期的时间。
            this.currentIdx += 1;
            
            if (this.currentIdx < this.startQishuInfo.length) {

                // 下一期的stopless 要减少上一期的openless。
                let stopTime = this.startQishuInfo[this.currentIdx].stopless - this.startQishuInfo[this.currentIdx - 1].openless;
                let openTime = this.startQishuInfo[this.currentIdx].openless - this.startQishuInfo[this.currentIdx - 1].openless;
                let qishu = this.startQishuInfo[this.currentIdx].qishu;

                this.setState({
                    isFenPanTime: stopTime,  // 封盘时间
                    currentTime: openTime,     // 开奖时间
                    qiShu: qishu,   // 当前期数
                    
                });
            }
        }

        // 已封盘 且nextData数据已经用到最后一期了。请先去请求了。
        if (this.state.isFenPanTime == 0 && this.currentIdx >= this.startQishuInfo.length - 1) {
            // 请求新的倒计时数据。
            this._featchData(this.state.tag);
        }

        this.setState({
            isFenPanTime: this.state.isFenPanTime - 1,
            currentTime: this.state.currentTime - 1,
        });

    }, 1000);

}


//刷新头部倒计时
_featchData(tag) {
let params = new FormData();
params.append('ac', 'getCplogList');
params.append('tag', tag);

var promise = GlobalBaseNetwork.sendNetworkRequest(params);
promise
    .then((responseData) => {
  
        if (responseData.msg == 0 && responseData.data.length != 0) {

            this.startQishuInfo = responseData.data[0].next;

            this.currentIdx = 0;  // 重置。

            let stopTime = this.startQishuInfo [0].stopless;
            let openTime = this.startQishuInfo [0].openless;
            let qishu = this.startQishuInfo [0].qishu;

            this.setState({
                isFenPanTime: stopTime,  // 封盘时间
                currentTime: openTime,     // 开奖时间
                qiShu: qishu,   // 当前期数
            });
        }

            this._setTimeInval();
    })
    .catch((err) => {

        this.setState({
            isShow: false
        });
        
    })
}


    //确认投注的方法
    _comformRequest(navigate) {
        let uid = global.UserLoginObject.Uid;
        let token = global.UserLoginObject.Token;

        if (token == null || token.length <= 0) {
            Alert.alert('提示', '您登录过期,请重新登录',
                [
                    {
                        text: '取消', onPress: () => {
                    }
                    },
                    {
                        text: '确定', onPress: () => {
                        this.props.navigation.navigate('Login', {title: '登录', isBuy: true});
                    }
                    },
                ])
            return;
        }

        let {isDataS, tag, js_tag,isStop} = this.state;
        let beishuArray = [];
        for (let i = 0;i < this.state.dataSourceNormal.length;i++)
        {
            let object = this.state.dataSourceNormal[i];
            beishuArray.push(object.num);
        }

        let parameter = {

            dataSource :isDataS,
            zhuiQiShu: this.state.dataSourceNormal.length,
            isStop: isStop ? 1 : 0,
            beiShu: 2,
            beiShuArray:beishuArray,
        }

        // 如果dataSource里的期数小于当前期数，再提示他清空 或保留下一期
        if (isDataS[0].value.qishu == "" ) {
            Alert.alert("提示", "期数没获取到！")

        } else if (parseInt(isDataS[0].value.qishu) < parseInt(this.state.qiShu)) {
            Alert.alert("提示", `${isDataS[0].value.qishu}该期已截止，清空或保留到下一期`,
                [

                    {
                        text: '重新选号', onPress: () => { navigate.goBack(this.state.backKey)}
                    },
                    {
                         text: '切换下一期', onPress: () => {
                             isDataS[0].value.qishu = this.state.qiShu;

                    }
                   },
                ])
            return;
        }

        if (uid.length != 0 && token.length != 0) {
            this.state.isShow = true;
            this.refs.LoadingView && this.refs.LoadingView.showLoading('正在提交投注');
            let params = TouZhuParam.returnSubmitTuoZhuParam(parameter);
            console.log('购物车参数', params);
            console.log('购物车参数01', parameter);

            var promise = GlobalBaseNetwork.sendNetworkRequest(params);
            promise
                .then((responseData) => {
                    this.setState({isShow: false});

                    this.refs.LoadingView && this.refs.LoadingView.dissmiss();

                    if (responseData.msg == 0) {

                        //数字类型的取两位小数
                        if (typeof(responseData.data.less) == 'number') {

                            responseData.data.less = responseData.data.less.toFixed(2);
                        }

                        let touZhuSuccessMessge = `投注成功！您还剩余: ${responseData.data.less}元`;
                        global.UserLoginObject.TotalMoney = responseData.data.less; //刷新金额
                        global.UserInfo.updateUserInfo(global.UserLoginObject, (result) => {
                        });
                        PushNotification.emit('RefreshUserTotalMoney', responseData.data.less);

                        //发出清空号码的通知
                        PushNotification.emit('ClearAllBalls');

                        // unifyPrice = 0;
                        ShopHistoryArr = [];  //历史购物车赋空
                        global.BeiShu = '1';     //重新初始化，防止下次进来计算出错
                        global.ZhuiQiShu = '1';
                        PushNotification.emit('ClearShopCarOffNotification');  //清空购物车，屏蔽查看购物车按钮的通知
                        PushNotification.emit('HandAutoAddNotification', 0);

                        global.isInShopCarVC = true;
                        PushNotification.emit('TouZhuSuccessNotifcation', touZhuSuccessMessge); //投注成功通知
                      
                        navigate.goBack(this.state.backKey);
                       

                    }
                    else if (responseData.msg == 20010) { //余额不足是否前往充值

                        Alert.alert(
                            '温馨提示',
                            '您的余额不足，是否前往充值',
                            [{
                                text: '确定', onPress: () => {
                                    this.props.navigation.navigate('RechargeCenter')
                                }
                            },
                                {
                                    text: '取消', onPress: () => {
                                }
                                },
                            ],
                        )
                    } else {
                        Alert.alert(
                            '提示',
                            responseData.param,
                            [{
                                text: '确定', onPress: () => {
                                }
                            }],
                        )
                    }
                })
                .catch((err) => {

                    if (err != null && err.message != '')
                    {
                        this.refs.LoadingView && this.refs.LoadingView.showFaile('投注失败');
                    }
                    else {
                        this.refs.LoadingView && this.refs.LoadingView.cancer(1000);
                    }

                })
        }
    }


    iTofixed(num, fractionDigits) {

        return (Math.round(num * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits) + Math.pow(10, -(fractionDigits + 1))).toString().slice(0, -1)

    };


    componentWillUnmount() {
        // console.log("销毁");
        this.timer && clearInterval(this.timer);
        //this.timer1 && clearTimeout(this.timer1);

    }

}

const styles = StyleSheet.create({

    superViewStyles: {},

    timeStyle: {
        backgroundColor: '#f6f6f6',
        height: 40,
        width: global.width,
        // textAlign:'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },

    switchStyle: {
        backgroundColor: "white",
        height: 46,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',

    },

    switchTextStyle: {
        color: '#6a6a6a',
        fontSize: 17,
    },

    zhuihaoyiStyle: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',

    },

    biaoTouStyle: {
        flexDirection: 'row',
        height:40,
        backgroundColor: 'white',
    },

    cellSuperStyle: {
        height: 38,
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'space-around',
        alignItems: 'center',

    },

})