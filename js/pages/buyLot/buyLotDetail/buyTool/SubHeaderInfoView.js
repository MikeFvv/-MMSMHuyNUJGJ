import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    Text,
    Image,
    ImageBackground,
    AppState,
} from 'react-native';

import  TheStyles from '../../../theLot/TheLotStyles';

import moment from 'moment';
let k3Image = [require('../touzhu2.0/img/ic_buyLot_touzi1.png'), require('../touzhu2.0/img/ic_buyLot_touzi2.png'), require('../touzhu2.0/img/ic_buyLot_touzi3.png'),
require('../touzhu2.0/img/ic_buyLot_touzi4.png'), require('../touzhu2.0/img/ic_buyLot_touzi5.png'), require('../touzhu2.0/img/ic_buyLot_touzi6.png')
];


var isFreshOpenTime = false;  //是否刷新

class SubHeaderInfoView extends Component {

    //构造器
    constructor(props)
    {
        super(props);

        this.state = ({
            tag:props.tag,
            js_tag:props.jstag,
            openBallsArr:[],        //开奖号码
            prevQiShu:props.prevModel ? (props.prevModel.value.qishu):'',          //上一期期数
            nextQiShu:props.nextModel ? (props.nextModel.value.qishu):'',          //下一个期数
            nextJieZhi:props.nextModel ? (props.nextModel.value.jiezhitime):'',        //下一期截止时间
            isLockZhuShu:props.isLockPlate,  //是否封盘
        })

        this.timer = null;
        this.timer1 = null;
    }

    componentWillReceiveProps(nextProps) {

        //重新赋值tag 和 jstag 同步刷新界面
        if (nextProps.jstag != null && nextProps.tag != null && nextProps.isLockPlate != null){

            this.setState({
                js_tag:nextProps.jstag,
                tag:nextProps.tag,
                isLockZhuShu:nextProps.isLockPlate,
            })
        }

        if (nextProps.nextModel != null && nextProps.prevModel != null){

            let ballStr = nextProps.prevModel.value.balls;
            let splitArr = [];

            if (typeof(ballStr) == 'string'){
                splitArr = ballStr.split(' ');
            }

            let jieZhiTime = 0;  //计算后的截止时间
            let lockTime = 0;  //玩法配置的锁定时间

            if (global.GameListConfigModel[nextProps.tag] != null){
                lockTime = parseInt(global.GameListConfigModel[nextProps.tag].lock_time, 10);
            }

            let systemTime = parseInt(moment().format('X'), 10);
            let differ = systemTime - nextProps.nextModel.value.server_time;
            jieZhiTime= nextProps.nextModel.value.end_time - systemTime - differ - parseInt(lockTime,10);

            //如果系统时间计算不出来使用jiezhiTime
            if (jieZhiTime <= 0){
                jieZhiTime = nextProps.nextModel.value.jiezhitime;
            }


            this.setState({
                openBallsArr:splitArr,        //开奖号码
                prevQiShu:nextProps.prevModel.value.qishu != '' ? (nextProps.prevModel.value.qishu):'',          //上一期期数
                nextQiShu:nextProps.nextModel.value.qishu != '' ? (nextProps.nextModel.value.qishu):'',          //下一个期数
                nextJieZhi:jieZhiTime,        //下一期截止时间
            })
        }
    }

    //接受用户切换彩种的通知
    componentDidMount(){

      this._setTimeInval();

        //接受点击购物车的通知，回调当前时间
        this.subscription = PushNotification.addListener('DidGoToShopCarDetailVC', ()=> {

            this.props.getCurrentTime ?  this.props.getCurrentTime(this.state.nextJieZhi) : null;

        });

        AppState.addEventListener('change', (appState)=> {

            //活跃状态重新刷数据
            if (appState == 'active'){
                this._fetchCurrentCZData(this.state.tag);
            }
        });

        AppState.addEventListener('memoryWarning', () => {
            //this.setState({memoryWarnings: this.state.memoryWarnings + 1});
        });

    }

    //移除通知
    componentWillUnmount(){

      this.timer && clearInterval(this.timer);
      this.timer1 && clearTimeout(this.timer1);

        if (typeof(this.subscription) == 'object'){
            this.subscription && this.subscription.remove();
        }

        AppState.removeEventListener('change');
        AppState.removeEventListener('memoryWarning');

    }

    //请求当前彩种的数据 ,   //请求前10期开奖数据
     _fetchCurrentCZData(tag){

       let params = new FormData();
       params.append("ac", "getCPLogInfo");
       params.append("tag", tag);
       params.append('pcount', '5');
       params.append('ncount', '5');

       var promise = GlobalBaseNetwork.sendNetworkRequest(params);
       promise
         .then((responseData) => {

           if (responseData.msg == 0)
           {
             let nextList = [];
             let prevList = [];
             let i = 0;
             let j = 0;
             let cainfoData = responseData.data;

             if (cainfoData.next != null && cainfoData.prev != null) {

                 let systemTime = parseInt(moment().format('X'), 10);

                 let isLock = cainfoData.lock_end_time - systemTime ;  //如果当前时间戳小于截止lockTime

                 this.props.isRefreshLockStatues ? this.props.isRefreshLockStatues(isLock > 0 ? true : false) : null;

                 if (isLock > 0){

                     this.setState({
                         isLockTouZhu:true,
                     })

                     PushNotification.emit('isLockTimeEnableTouZhu', isLock);

                     //设置锁定时间(封盘时间)
                     setTimeout(() => {

                         this.props.isRefreshLockStatues ? this.props.isRefreshLockStatues(false) : null;

                         this.setState({
                             isLockTouZhu:false,
                         })

                     }, isLock * 1000)
                 }

               //解析next数组
               cainfoData.next.map((next) => {
                   nextList.push({key: i, value: next});
                   i++;
               });
               //解析prev数组
               cainfoData.prev.map((prev) => {
                   prevList.push({key: j, value: prev});
                   j++;
               });

               //解析数据
               if (prevList.length != 0 && nextList.length != 0) {
                   let prevModel = prevList[0];
                   //请求下一期的开奖信息
                   let nextModel = nextList[0];

                   let KeyArr = Object.keys(prevModel.value);
                   let splitArr = [];

                   //包含balls字段
                   if (KeyArr.includes('balls')) {


                       let ballStr = '';

                       if (prevModel.value.balls != null) {

                           ballStr = prevModel.value.balls;
                           splitArr = ballStr.split(' ');
                       }
                   }

                   let jieZhiTime = 0;

                   let lockTime = 0;

                   if (global.GameListConfigModel[tag] != null){
                       lockTime =  parseInt(global.GameListConfigModel[tag].lock_time,10);
                   }

                   let systemTime = parseInt(moment().format('X'), 10);

                   //倒计时时间等于 结束时间-当前系统时间-差异时间-锁定时间
                   let differ = systemTime - nextModel.value.server_time;
                   jieZhiTime = nextModel.value.end_time - systemTime - differ - parseInt(lockTime,10);

                   //如果系统时间计算不出来使用jiezhiTime
                   if (jieZhiTime <= 0){
                       jieZhiTime = nextModel.value.jiezhitime;
                   }

                   //setState 方法弃用，可能导致定时器移除后还在update界面,直接赋值不会错误
                   this.state.prevQiShu = prevModel.value.qishu, //上一期开奖的期数
                   this.state.openBallsArr = splitArr,  //上期开奖号码数组
                   this.state.nextQiShu = nextModel.value.qishu,  //下一期开奖的期数
                   this.state.nextJieZhi = jieZhiTime,  //下一期截止时间

                   isFreshOpenTime = false; //请求数据回来再赋值

                   this._setTimeInval();
                }

               }
           }
       })
     .catch((err) => {
     })

   }

   _setTimeInval(){

          //重新加载数据

         if (this.timer) {
             return;
         }

          this.timer = setInterval(() => {

          global.CurrentQiShu = this.state.nextQiShu;  //一直刷新最新期数

          if (this.state.nextJieZhi < 1){

              this._fetchCurrentCZData(this.state.tag);
              PushNotification.emit('isRefreshOpenList');  //通知开奖列表刷新界面。防止开奖过快列表没有刷新
              PushNotification.emit('BuyLotDetailCountDown');  //倒计时结束发出通知
          }

          this.setState({
             nextJieZhi:this.state.nextJieZhi - 1,
           });
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


    //根据balls的长度创建号码
    _createBallsView(ballsArr){

      //分分钟开奖给5秒钟延迟
     if (this.state.openBallsArr.length == 1 && isFreshOpenTime == false){

      let expire  = 0;
      isFreshOpenTime = true;

      this.state.tag.includes('ff') ? expire = 10 : expire = 40;

      if (this.timer1){

        this.timer1 = null;  //先注销掉, 保证不会生成多个定时器，造成警告
      }

        this.timer1 = setTimeout(() => {

            this._fetchCurrentCZData(this.state.tag);
            PushNotification.emit('isRefreshOpenList');

        }, expire * 1000);
      }

      //PK10 和幸运飞艇号码都是10位数
      let isLHCAndPk10 = this.state.js_tag == 'pk10' || this.state.js_tag == 'lhc';

      //其他彩种
        if (ballsArr.length == 1 || ballsArr.length == 0)//正在开奖
        {
            return  <View style = {{flexDirection:'row', flex:isLHCAndPk10 ? 0.6 : 0.5, justifyContent:'center'}}><Image style = {{marginTop: isLHCAndPk10 ? 15 : 5,width:20, height:20}} source = {require('../../img/ic_waitopentime.png')}></Image><CusBaseText style = {{marginTop: isLHCAndPk10 ? 15 : 5, fontSize:Adaption.Font(16,14), color:'grey'}}>等待开奖...</CusBaseText></View>
        }
        else if (ballsArr.length > 1 && ballsArr.length <= 6)
        {
          if (this.timer1){

            this.timer1 = null;  //先注销掉, 保证不会生成多个定时器，造成警告
          }

            //幸运28 的号码
            if (ballsArr.length == 4){


                //红绿蓝颜色
                let greenArr = ['1', '4', '7', '10', '16', '19', '22', '25'];
                let blueArr = ['2','5','8','11','17','20','23','26'];
                let redArr = ['3','6','9','12','15','18','21','24'];
                let grayArr = ['0','13','14','27'];


                let ball1Color = '';
                let ball2Color = '';
                let ball3Color = '';
                let ball4Color = '';

                for (let i = 0; i < ballsArr.length; i ++){

                    let balls = ballsArr[i];
                    let lastBackColor = '';

                    //如果特码是0开头的,例如07 则截取最后一位字符串判断。
                    if (balls.length > 1 && balls.startsWith('0')){
                        balls = balls.substr(balls.length-1,1);
                    }


                    if (greenArr.includes(balls)){

                        lastBackColor = '#47ab4f';
                    }
                    else if (blueArr.includes(balls)){
                        lastBackColor = '#37a1de';
                    }
                    else if (redArr.includes(balls)){
                        lastBackColor = '#d84a47';
                    }
                    else if (grayArr.includes(balls)){
                        lastBackColor = '#adadad';
                    }

                    switch (i){

                        case 0:
                            ball1Color = lastBackColor;
                            break;
                        case 1:
                            ball2Color = lastBackColor;
                            break;
                        case 2:
                            ball3Color = lastBackColor;
                            break;
                        case 3:
                            ball4Color = lastBackColor;
                            break;
                        default:
                            break;
                    }
                }

                return <View style = {{flexDirection:'row', flex:isLHCAndPk10 ? 0.6 : 0.5, justifyContent:'center'}}>
                    <View  style={{flexDirection:'row', width:Adaption.Width(40), height:Adaption.Width(40)}}>
                        <View resizeMode='cover' style={{width:Adaption.Width(28), height:Adaption.Width(28), backgroundColor:ball1Color, justifyContent:'center', alignItems:'center', borderRadius:Adaption.Width(28)/2}}>
                            <CusBaseText style={{fontSize:Adaption.Font(15,12), color:'white', marginRight:3}}> {ballsArr[0]}</CusBaseText>
                        </View>
                        <CusBaseText allowFontScaling={false} style={{ fontSize: Adaption.Font(18)}}>+</CusBaseText>
                    </View>
                    <View  style={{flexDirection:'row', width:Adaption.Width(40), height:Adaption.Width(40)}}>
                        <View resizeMode='cover' style={{width:Adaption.Width(28), height:Adaption.Width(28), backgroundColor:ball2Color, justifyContent:'center', alignItems:'center', borderRadius:Adaption.Width(28)/2}}>
                            <CusBaseText style={{fontSize:Adaption.Font(15,12), color:'white', marginRight:3}}> {ballsArr[1]}</CusBaseText>
                        </View>
                        <CusBaseText allowFontScaling={false} style={{ fontSize: Adaption.Font(18)}}>+</CusBaseText>
                    </View>
                    <View  style={{flexDirection:'row', width:Adaption.Width(40), height:Adaption.Width(40)}}>
                        <View resizeMode='cover' style={{width:Adaption.Width(28), height:Adaption.Width(28), backgroundColor:ball3Color, justifyContent:'center', alignItems:'center', borderRadius:Adaption.Width(28)/2}}>
                            <CusBaseText style={{fontSize:Adaption.Font(15,12), color:'white', marginRight:3}}> {ballsArr[2]}</CusBaseText>
                        </View>
                        <CusBaseText allowFontScaling={false} style={{ fontSize: Adaption.Font(18)}}>=</CusBaseText>
                    </View>
                    <View  style={{flexDirection:'row', width:Adaption.Width(40), height:Adaption.Width(40)}}>
                        <View resizeMode='cover' style={{width:Adaption.Width(28), height:Adaption.Width(28), backgroundColor:ball4Color, justifyContent:'center', alignItems:'center', borderRadius:Adaption.Width(28)/2}}>
                            <CusBaseText style={{fontSize:Adaption.Font(15,12), color:'white', marginRight:3}}> {ballsArr[3]}</CusBaseText>
                        </View>
                        <CusBaseText allowFontScaling={false} style={{ fontSize: Adaption.Font(18)}}></CusBaseText>
                    </View>
                </View>;
            }
            else  if (ballsArr.length == 3){


                if(this.state.js_tag == 'k3') {
                    let arrk3 = [];
                    for (let j = 0; j < ballsArr.length; j++) {
                        arrk3.push(this._getimage(ballsArr[j],j));
                    }
                 return <View style = {{flexDirection:'row', flex:isLHCAndPk10 ? 0.6 : 0.5, justifyContent:'center'}}>{arrk3}</View>;
                }

                return <View style = {{flexDirection:'row', flex:isLHCAndPk10 ? 0.6 : 0.5, justifyContent:'center'}}>
                    <ImageBackground  resizeMode='cover' style = {{marginLeft:4, marginRight:4, width:Adaption.Width(28), height:Adaption.Width(28), backgroundColor:'rgba(0,0,0,0)', justifyContent:'center', alignItems:'center'}} source = {require('../../img/ic_unnitDidSelect.png')}>
                        <CusBaseText style = {{fontSize:Adaption.Font(15,12), color:'white'}}>{ballsArr[0]}</CusBaseText>
                    </ImageBackground>
                    <ImageBackground  resizeMode='cover' style = {{marginLeft:4, marginRight:4, width:Adaption.Width(28), height:Adaption.Width(28), backgroundColor:'rgba(0,0,0,0)', justifyContent:'center', alignItems:'center'}} source = {require('../../img/ic_unnitDidSelect.png')}>
                        <CusBaseText style = {{fontSize:Adaption.Font(15,12), color:'white'}}>{ballsArr[1]}</CusBaseText>
                    </ImageBackground>
                    <ImageBackground  resizeMode='cover' style = {{marginLeft:4, marginRight:4, width:Adaption.Width(28), height:Adaption.Width(28), backgroundColor:'rgba(0,0,0,0)', justifyContent:'center', alignItems:'center'}} source = {require('../../img/ic_unnitDidSelect.png')}>
                        <CusBaseText style = {{fontSize:Adaption.Font(15,12), color:'white'}}>{ballsArr[2]}</CusBaseText>
                    </ImageBackground>
                </View>;
            }
            else if (ballsArr.length == 5){

                return (<View style = {{flexDirection:'row', flex:isLHCAndPk10 ? 0.6 : 0.5, justifyContent:'center'}}>
                        <ImageBackground  resizeMode='cover' style = {{marginLeft:4, marginRight:4, width:Adaption.Width(26), height:Adaption.Width(26), backgroundColor:'rgba(0,0,0,0)', justifyContent:'center', alignItems:'center'}} source = {require('../../img/ic_unnitDidSelect.png')}><CusBaseText style = {{fontSize:Adaption.Font(14,12), color:'white',}}>{ballsArr[0]}</CusBaseText></ImageBackground>
                        <ImageBackground  resizeMode='cover' style = {{marginLeft:4, marginRight:4, width:Adaption.Width(26), height:Adaption.Width(26), backgroundColor:'rgba(0,0,0,0)', justifyContent:'center', alignItems:'center'}} source = {require('../../img/ic_unnitDidSelect.png')}><CusBaseText style = {{fontSize:Adaption.Font(14,12), color:'white',}}>{ballsArr[1]}</CusBaseText></ImageBackground>
                        <ImageBackground  resizeMode='cover' style = {{marginLeft:4, marginRight:4, width:Adaption.Width(26), height:Adaption.Width(26), backgroundColor:'rgba(0,0,0,0)', justifyContent:'center', alignItems:'center'}} source = {require('../../img/ic_unnitDidSelect.png')}><CusBaseText style = {{fontSize:Adaption.Font(14,12), color:'white',}}>{ballsArr[2]}</CusBaseText></ImageBackground>
                        <ImageBackground  resizeMode='cover' style = {{marginLeft:4, marginRight:4, width:Adaption.Width(26), height:Adaption.Width(26), backgroundColor:'rgba(0,0,0,0)', justifyContent:'center', alignItems:'center'}} source = {require('../../img/ic_unnitDidSelect.png')}><CusBaseText style = {{fontSize:Adaption.Font(14,12), color:'white',}}>{ballsArr[3]}</CusBaseText></ImageBackground>
                        <ImageBackground  resizeMode='cover' style = {{marginLeft:4, marginRight:4, width:Adaption.Width(26), height:Adaption.Width(26), backgroundColor:'rgba(0,0,0,0)', justifyContent:'center', alignItems:'center'}} source = {require('../../img/ic_unnitDidSelect.png')}><CusBaseText style = {{fontSize:Adaption.Font(14,12), color:'white',}}>{ballsArr[4]}</CusBaseText></ImageBackground>
                </View>)
            }
        }
        else if (ballsArr.length > 6 && ballsArr.length <= 7) // LHC
        {
            if (this.timer1){

              this.timer1 = null;  //先注销掉, 保证不会生成多个定时器，造成警告
            }

            let lhcBallArr = [];   //号码数组
            let shengXiaoArr = []; //生肖数组

            //判断是属于红波，绿波，蓝波
            let redBallArr = ['01','02','07','08','12','13','18','19','23','24','29','30','34','35','40','45','46'];
            let blueBallArr = ['03','04','09','10','14','15','20','25','26','31','36','37','41','42','47','48'];
            let greenBallArr = ['05','06','11','16','17','21','22','27','28','32','33','38','39','43','44','49'];


            let default_shengxiao = {
                ba_0: {name: '鼠', idx: 0, balls: []},
                ba_1: {name: '牛', idx: 1, balls: []},
                ba_2: {name: '虎', idx: 2, balls: []},
                ba_3: {name: '兔', idx: 3, balls: []},
                ba_4: {name: '龙', idx: 4, balls: []},
                ba_5: {name: '蛇', idx: 5, balls: []},
                ba_6: {name: '马', idx: 6, balls: []},
                ba_7: {name: '羊', idx: 7, balls: []},
                ba_8: {name: '猴', idx: 8, balls: []},
                ba_9: {name: '鸡', idx: 9, balls: []},
                ba_10: {name: '狗', idx: 10, balls: []},
                ba_11: {name: '猪', idx: 11, balls: []},
            };

            let currenYear = moment().format('YYYY'); // 获取到当前时间是哪一年
            let currenYid = (parseInt(currenYear) - 4) % 12; // 0-11 当年生肖的下标
            let shidx = global.yearId != '' ? parseInt(global.yearId) : currenYid;
            for (var k in default_shengxiao) {
                var start_balls = shidx - default_shengxiao[k].idx + 1;  // 计算生肖位置开始号码
                if (start_balls < 0) {
                    start_balls = 12 + start_balls;
                }
                // 输出生肖对应的号码
                for (var i = start_balls; i < 50; i += 12) {
                    if (i === 0) {
                        continue;
                    }
                    var theball = i > 9 ? (i + '') : ('0' + i);
                    default_shengxiao[k].balls.push(theball);
                }
            }

            //判断属于哪个生肖 鼠，牛，虎，兔，龙，蛇，马，羊，猴，鸡，狗，猪
            let shuXiaoArr = Object.values(default_shengxiao)[0].balls;
            let niuXiaoArr = Object.values(default_shengxiao)[1].balls;
            let huXiaoArr = Object.values(default_shengxiao)[2].balls;
            let tuXiaoArr = Object.values(default_shengxiao)[3].balls;
            let longXiaoArr = Object.values(default_shengxiao)[4].balls;
            let sheXiaoArr = Object.values(default_shengxiao)[5].balls;
            let maXiaoArr = Object.values(default_shengxiao)[6].balls;
            let yangXiaoArr = Object.values(default_shengxiao)[7].balls;
            let houXiaoArr = Object.values(default_shengxiao)[8].balls;
            let jiXiaoArr = Object.values(default_shengxiao)[9].balls;
            let gouXiaoArr = Object.values(default_shengxiao)[10].balls;
            let zhuXiaoArr = Object.values(default_shengxiao)[11].balls;


            for (let i = 0; i < ballsArr.length; i++) {

                let ballBackColor = '';
                let shengxiaoText = '';

                if (redBallArr.find((ball) => ball == ballsArr[i])){
                   ballBackColor = '#d84a47';
                }
                else if (blueBallArr.find((ball) => ball == ballsArr[i])) {
                   ballBackColor = '#37a1de';
                }
                else if (greenBallArr.find((ball) => ball == ballsArr[i])) {
                   ballBackColor = '#47ab4f';
                }

                if (shuXiaoArr.find((ball) => ball == ballsArr[i])){
                  shengxiaoText = '鼠';
                }
                else if (niuXiaoArr.find((ball) => ball == ballsArr[i])){
                  shengxiaoText = '牛';
                }
                else if (huXiaoArr.find((ball) => ball == ballsArr[i])){
                  shengxiaoText = '虎';
                }
                else if (tuXiaoArr.find((ball) => ball == ballsArr[i])){
                  shengxiaoText = '兔';
                }
                else if (longXiaoArr.find((ball) => ball == ballsArr[i])){
                  shengxiaoText = '龙';
                }
                else if (sheXiaoArr.find((ball) => ball == ballsArr[i])){
                  shengxiaoText = '蛇';
                }
                else if (maXiaoArr.find((ball) => ball == ballsArr[i])){
                  shengxiaoText = '马';
                }
                else if (yangXiaoArr.find((ball) => ball == ballsArr[i])){
                  shengxiaoText = '羊';
                }
                else if (houXiaoArr.find((ball) => ball == ballsArr[i])){
                  shengxiaoText = '猴';
                }
                else if (jiXiaoArr.find((ball) => ball == ballsArr[i])){
                  shengxiaoText = '鸡';
                }
                else if (gouXiaoArr.find((ball) => ball == ballsArr[i])){
                  shengxiaoText = '狗';
                }
                else if (zhuXiaoArr.find((ball) => ball == ballsArr[i])){
                  shengxiaoText = '猪';
                }

              //号码视图
              lhcBallArr.push(<View
                key={i}
                style = {{marginLeft:2, marginRight:2, width:Adaption.Width(24), height:Adaption.Width(24), borderRadius:Adaption.Width(24)/2, backgroundColor:ballBackColor, justifyContent:'center', alignItems:'center'}}>
                <CusBaseText style = {{color:'white', backgroundColor:'rgba(0,0,0,0)', fontSize:Adaption.Font(14,12)}}>{ballsArr[i]}</CusBaseText>
              </View>);

              //生肖视图
              shengXiaoArr.push(<View
                key={i + 8}
                style = {{width:i == ballsArr.length - 1 ? Adaption.Width(45) : Adaption.Width(24), height:Adaption.Width(24), justifyContent:'center', alignItems:'center'}}>
                <CusBaseText style = {{color:'black', fontSize:Adaption.Font(16,14)}}>{i == ballsArr.length - 1 ? (` + ${shengxiaoText}`) : (shengxiaoText)}</CusBaseText>
              </View>);
            }

            return (<View style = {{flexDirection:'column', flex:isLHCAndPk10 ? 0.6 : 0.5}}>
                <View style = {{flexDirection:'row', flex:0.5 }}>{lhcBallArr}</View>
                <View style = {{flexDirection:'row', flex:0.5 }}>{shengXiaoArr}</View>
            </View>);
        }
        else if (ballsArr.length == 10) { //Pk10

          if (this.timer1){

            this.timer1 = null;  //先注销掉, 保证不会生成多个定时器，造成警告
          }

            return (<View style = {{flexDirection:'column', flex:isLHCAndPk10 ? 0.6 : 0.5, justifyContent:'center'}}>
                <View style = {{flexDirection:'row', flex:0.5}}>
                    <ImageBackground  resizeMode='cover' style = {{marginLeft:4, marginRight:4, width:Adaption.Width(26), height:Adaption.Width(26), backgroundColor:'rgba(0,0,0,0)', justifyContent:'center', alignItems:'center'}} source = {require('../../img/ic_unnitDidSelect.png')}><CusBaseText style = {{fontSize:Adaption.Font(14,12), color:'white',}}>{ballsArr[0]}</CusBaseText></ImageBackground>
                    <ImageBackground  resizeMode='cover' style = {{marginLeft:4, marginRight:4, width:Adaption.Width(26), height:Adaption.Width(26), backgroundColor:'rgba(0,0,0,0)', justifyContent:'center', alignItems:'center'}} source = {require('../../img/ic_unnitDidSelect.png')}><CusBaseText style = {{fontSize:Adaption.Font(14,12), color:'white',}}>{ballsArr[1]}</CusBaseText></ImageBackground>
                    <ImageBackground  resizeMode='cover' style = {{marginLeft:4, marginRight:4, width:Adaption.Width(26), height:Adaption.Width(26), backgroundColor:'rgba(0,0,0,0)', justifyContent:'center', alignItems:'center'}} source = {require('../../img/ic_unnitDidSelect.png')}><CusBaseText style = {{fontSize:Adaption.Font(14,12), color:'white',}}>{ballsArr[2]}</CusBaseText></ImageBackground>
                    <ImageBackground  resizeMode='cover' style = {{marginLeft:4, marginRight:4, width:Adaption.Width(26), height:Adaption.Width(26), backgroundColor:'rgba(0,0,0,0)', justifyContent:'center', alignItems:'center'}} source = {require('../../img/ic_unnitDidSelect.png')}><CusBaseText style = {{fontSize:Adaption.Font(14,12), color:'white',}}>{ballsArr[3]}</CusBaseText></ImageBackground>
                    <ImageBackground  resizeMode='cover' style = {{marginLeft:4, marginRight:4, width:Adaption.Width(26), height:Adaption.Width(26), backgroundColor:'rgba(0,0,0,0)', justifyContent:'center', alignItems:'center'}} source = {require('../../img/ic_unnitDidSelect.png')}><CusBaseText style = {{fontSize:Adaption.Font(14,12), color:'white',}}>{ballsArr[4]}</CusBaseText></ImageBackground>
                </View>
                <View style = {{flexDirection:'row', flex:0.5}}>
                    <ImageBackground  resizeMode='cover' style = {{marginLeft:4, marginRight:4, width:Adaption.Width(26), height:Adaption.Width(26), backgroundColor:'rgba(0,0,0,0)', justifyContent:'center', alignItems:'center'}} source = {require('../../img/ic_unnitDidSelect.png')}><CusBaseText style = {{fontSize:Adaption.Font(14,12), color:'white',}}>{ballsArr[5]}</CusBaseText></ImageBackground>
                    <ImageBackground  resizeMode='cover' style = {{marginLeft:4, marginRight:4, width:Adaption.Width(26), height:Adaption.Width(26), backgroundColor:'rgba(0,0,0,0)', justifyContent:'center', alignItems:'center'}} source = {require('../../img/ic_unnitDidSelect.png')}><CusBaseText style = {{fontSize:Adaption.Font(14,12), color:'white',}}>{ballsArr[6]}</CusBaseText></ImageBackground>
                    <ImageBackground  resizeMode='cover' style = {{marginLeft:4, marginRight:4, width:Adaption.Width(26), height:Adaption.Width(26), backgroundColor:'rgba(0,0,0,0)', justifyContent:'center', alignItems:'center'}} source = {require('../../img/ic_unnitDidSelect.png')}><CusBaseText style = {{fontSize:Adaption.Font(14,12), color:'white',}}>{ballsArr[7]}</CusBaseText></ImageBackground>
                    <ImageBackground  resizeMode='cover' style = {{marginLeft:4, marginRight:4, width:Adaption.Width(26), height:Adaption.Width(26), backgroundColor:'rgba(0,0,0,0)', justifyContent:'center', alignItems:'center'}} source = {require('../../img/ic_unnitDidSelect.png')}><CusBaseText style = {{fontSize:Adaption.Font(14,12), color:'white',}}>{ballsArr[8]}</CusBaseText></ImageBackground>
                    <ImageBackground  resizeMode='cover' style = {{marginLeft:4, marginRight:4, width:Adaption.Width(26), height:Adaption.Width(26), backgroundColor:'rgba(0,0,0,0)', justifyContent:'center', alignItems:'center'}} source = {require('../../img/ic_unnitDidSelect.png')}><CusBaseText style = {{fontSize:Adaption.Font(14,12), color:'white',}}>{ballsArr[9]}</CusBaseText></ImageBackground>
                </View>
            </View>);
        }
    }


    render() {

        let headHeight = 80;

        //PK10 和幸运飞艇号码都是10位数
        let isLHCAndPk10 = this.state.js_tag == 'pk10' || this.state.js_tag == 'lhc';

        if (!isLHCAndPk10){
          headHeight = 60;
        }

        let prevQiShu = this.state.prevQiShu == '' ? '- -' : this.state.prevQiShu;
        let nextQiShu = this.state.nextQiShu == '' ? '- -' : this.state.nextQiShu;

        return (
            <View style={{backgroundColor:'rgba(244,242,228,1)', height:headHeight, flexDirection:'row',alignItems:'center', justifyContent:'center'}}>
                <View style = {styles.subHeaderLeftView}>
                    <View style = {{flex:isLHCAndPk10 ? 0.4 : 0.5, justifyContent:'center'}}><CusBaseText style = {styles.subHeaderViewQiShu}>{'第' + prevQiShu + '期'}</CusBaseText></View>
                    {this._createBallsView(this.state.openBallsArr)}
                </View>
                <View style = {{height:headHeight - 20, width:1, backgroundColor:'lightgrey'}}></View>
                <View style = {styles.subHeaderRightView}>
                    <View style = {{flex:isLHCAndPk10 ? 0.4 : 0.5, justifyContent:'center'}}><CusBaseText style = {styles.subHeaderViewQiShu}>距<CusBaseText style = {styles.subHeaderRedViewQiShu}>{nextQiShu}</CusBaseText>期截止</CusBaseText></View>
                    <View style = {{flex:isLHCAndPk10 ? 0.6 : 0.5, justifyContent:'center'}}><CusBaseText style = {{fontSize:Adaption.Font(20,18), color:'red'}}>{this.state.isLockZhuShu == true ? ('已封盘') : (this.state.nextJieZhi > 0 ? this._changeTime(this.state.nextJieZhi) : '00:00:00')}</CusBaseText></View>
                </View>
            </View>
        );
    }


    _getimage(i,j) {

            return (
                <Image key={j} style={[TheStyles.imagSize,{marginRight:10}]} source={k3Image[i-1]}/>
            );

    }


}

const styles = StyleSheet.create({

    subHeaderLeftView:{
        flexDirection:'column',
        flex:0.5,
        justifyContent:'center',
        alignItems:'center',
    },

    subHeaderRightView:{
        flexDirection:'column',
        flex:0.5,
        justifyContent:'center',
        alignItems:'center',
    },

    subHeaderViewQiShu: {
        fontSize:Adaption.Font(16,14),
        color:'grey'
    },

    subHeaderRedViewQiShu:{
        fontSize:Adaption.Font(16,14),
        color:'red'
    },


});

export  default  SubHeaderInfoView;
