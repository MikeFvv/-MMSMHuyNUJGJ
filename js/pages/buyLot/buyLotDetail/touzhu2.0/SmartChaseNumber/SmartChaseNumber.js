import React, { Component } from 'react';

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
    Dimensions
} from 'react-native';

import Moment from 'moment';
import SmartChaseCell from  './SmartChaseCell';
import Toast, { DURATION } from 'react-native-easy-toast'
import TouZhuParam from '../../TouZhuParam';


// 对没错，在这里拿到了屏幕的宽高了。
const {width, height} = Dimensions.get('window');

let iphoneX = global.iOS ? (SCREEN_HEIGHT == 812 ? true : false) : 0; //是否是iphoneX

// let iphoneX = SCREEN_HEIGHT == 812 ? true : false;
let iphone5S =global.iOS ? (SCREEN_WIDTH == 320 ? true : false):0;

// var currentQiShu = '';  //定义当前期数

export default class SmartChaseNumber extends Component {


    static navigationOptions = ({ navigation, screenProps }) => ({

        headerTintColor: "white",
        headerStyle: {backgroundColor: COLORS.appColor, marginTop: Android ?(parseFloat(global.versionSDK) > 19?StatusBar.currentHeight:0) : 0},
        title: navigation.state.params.title,
        headerTitleStyle: {alignSelf:'center'},
        //加入右边空视图,否则标题不居中  ,alignSelf:'center'
        headerRight: (
            <View style={GlobalStyles.nav_blank_view} />
        ),
        headerLeft: (
            <TouchableOpacity
                style={GlobalStyles.nav_headerLeft_touch}
                activeOpacity={1}
                onPress={navigation.state.params ? navigation.state.params.allenNeedGoback : null}>
                <View style={GlobalStyles.nav_headerLeft_view} />
            </TouchableOpacity>
        ),
    });



    constructor(props){
        super(props);
        this.startQishuInfo = [];
        this.maxQishu = 1;
        this.state = {
            isStop:false,
            slectMutipleQiShu:'1',
            slectMutipleStartBeishu:'1',
            slectMutipleEveryTimesQiShu:'1',
            slectMutipleEveryTimesMultiplyBeiShu:'1',
            slectMutipleQiShuNormal:'1',
            slectMutipleStartBeishuNormal:'1',


            isNormalChaseNumberModel:true,
            dataSource: [],
            dataSourceNormal:[],
            totalMoney:{zhushu:this.props.navigation.state.params.totalZhuShu,money:this.props.navigation.state.params.totalPrice},
            totalMoneyNormal:{zhushu:this.props.navigation.state.params.totalZhuShu,money:this.props.navigation.state.params.totalPrice},
            currentTime: this.props.navigation.state.params.jiezhiTime,
            tag:this.props.navigation.state.params.tag,
            qiShu:this.props.navigation.state.params.qishu,
            datas:this.props.navigation.state.params.datas,
            js_tag:this.props.navigation.state.params.js_tag,
            backKey:this.props.navigation.state.params.backKey,

            showText:'正在加载中...',
            isShow:true,
            baseZhuShu:this.props.navigation.state.params.totalZhuShu,
            baseMoney:this.props.navigation.state.params.totalPrice


        }

        // console.log(this.state);

        // currentQiShu = this.props.navigation.state.params.qishu;


    }



    componentWillMount(){


        // this._setTimeInval();
    }



    componentDidMount() {


        this.props.navigation.setParams({
            allenNeedGoback: this._allenNeedGoback
        });


        this.refs.LoadingView && this.refs.LoadingView.showLoading('正在加载中...');
        this._featchData(this.state.tag);
    }



    _allenNeedGoback = ()=>{
        this.props.navigation.goBack();
    }

    render(){
        return <View style={{flex:1,backgroundColor:'#f6f6f6'}}><View style={{flex:1,backgroundColor:'#f6f6f6'}}>
                    {/*截止时间*/}
                     <View style = {styles.timeStyle} >
                            <CusBaseText  style={{color:'#707070'}}>第{this.state.qiShu ? this.state.qiShu : ''}期投注截止时间: </CusBaseText>
                            <CusBaseText  style={{color:'#e33939'}}>{this.state.currentTime > 0 ? this._changeTime(this.state.currentTime) : '00:00:00'}</CusBaseText>

                     </View>
                    {/*普通高级切换view*/}
                    <View style = {styles.switchStyle}>

                        <TouchableOpacity

                            activeOpacity={0.5}
                            onPress={()=> this.clickPuTong()}
                        >
                            <CusBaseText style = {[styles.switchTextStyle,{color:this.state.isNormalChaseNumberModel?'#e33939':'#6a6a6a'}]}>普通追号 </CusBaseText>


                        </TouchableOpacity>


                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={()=> this.clickGaoJi()}
                        >
                            <CusBaseText style = {[styles.switchTextStyle,{color:this.state.isNormalChaseNumberModel?'#6a6a6a':'#e33939'}]}>高级追号 </CusBaseText>
                        </TouchableOpacity>
                        <View style={{height:4,width:120,backgroundColor:'#e33939',position:'absolute',bottom:0,left:this.state.isNormalChaseNumberModel?(width/2.0-120)/2.0:(width*3/2.0-120)/2.0}}></View>
                    </View>



            {/*追号倍数一*/}
            {/*<View style={styles.zhuihaoyiStyle} >*/}

                {/*<View style={{flexDirection: 'row',flex:1,justifyContent: 'center'}}>*/}
                    {/*<Text  >追号</Text>*/}
                    {/*<TextInput style={{width:40,backgroundColor:'yellow',textAlign:'center'}} placeholder = '1' placeholderTextColor = 'black' ></TextInput>*/}
                    {/*<Text>期数</Text>*/}
                {/*</View>*/}


                {/*<View style={{flexDirection: 'row',flex:1,justifyContent: 'center'}}>*/}
                    {/*<Text>起始</Text>*/}
                    {/*<TextInput style={{width:40,backgroundColor:'yellow',textAlign:'center'}} placeholder = '1' placeholderTextColor = 'black' ></TextInput>*/}
                    {/*<Text>倍数</Text>*/}
                {/*</View>*/}



            {/*</View>*/}
            <View>
            <View style={styles.zhuihaoyiStyle}>

                <View style={{flexDirection: 'row',flex:1,justifyContent: 'center',alignItems:'center'}}>
                    <CusBaseText style={{fontSize:19,color:"#7d7d7d"}}>追号 </CusBaseText>
                    {/*<TextInput style={{width:40,backgroundColor:'yellow',textAlign:'center'}} placeholder = '1' placeholderTextColor = 'black' ></TextInput>*/}
                    <TextInput allowFontScaling={false} keyboardType = {global.iOS?'number-pad':'numeric'} onChangeText = {(text) => {
                        if (text > this.maxQishu){
                            text = this.maxQishu+'';
                        }
                        if(this.state.isNormalChaseNumberModel){
                            this.state.slectMutipleQiShuNormal = text !='' ? (text) : ('');
                            this.setState({});
                        }else {
                            this.state.slectMutipleQiShu = text != '' ? (text) : ('');
                            // this.props.multipleClick ? this.props.multipleClick(text) : null;  //回调输入的倍数
                            this.setState({});
                        }

                        this.calculateScheduling(text,1);

                    }}
                               returnKeyType="done"
                               maxLength = {5}
                               style = {{padding:0,  width:(iphone5S?60:80) ,height:38, borderColor:'lightgrey', borderWidth:1, backgroundColor:'#fff', marginTop:5, borderRadius:3, textAlign:'center'}} underlineColorAndroid ='transparent' value={this.state.isNormalChaseNumberModel?this.state.slectMutipleQiShuNormal:this.state.slectMutipleQiShu}
                               onFocus={()=>{
                                   if(this.state.isNormalChaseNumberModel){
                                       this.state.slectMutipleQiShuNormal == ''?this.setState({slectMutipleQiShuNormal:'1'}):null;
                                   }else{
                                       this.state.slectMutipleQiShu == '' ? this.setState({slectMutipleQiShu: '1'}) : null;
                                   }
                               }}
                               onBlur={()=> {
                                   if (this.state.isNormalChaseNumberModel) {
                                       this.state.slectMutipleQiShuNormal == '' ? this.setState({slectMutipleQiShuNormal: '1'}) : null;
                                   } else {
                                       this.state.slectMutipleQiShu == '' ? this.setState({slectMutipleQiShu: '1'}) : null;
                                   }
                               }
                               }
                    ></TextInput>

                    <CusBaseText style={{fontSize:19,color:"#7d7d7d"}}> 期数</CusBaseText>
                </View>



                    <View style={{flexDirection: 'row',flex:1,justifyContent: 'center',alignItems:'center'}}>
                        <CusBaseText style={{fontSize:19,color:"#7d7d7d"}}>起始 </CusBaseText>
                        {/*<TextInput style={{width:40,backgroundColor:'yellow',textAlign:'center'}} placeholder = '1' placeholderTextColor = 'black' ></TextInput>*/}
                        <TextInput allowFontScaling={false} keyboardType = {global.iOS?'number-pad':'numeric'} onChangeText = {(text) => {


                            if(this.state.isNormalChaseNumberModel){
                                this.state.slectMutipleStartBeishuNormal = text != '' ? (text) : ('');
                                this.setState({});
                            }else {
                                //输入倍数时的计算
                                this.state.slectMutipleStartBeishu = text != '' ? (text) : ('');
                                // this.props.multipleClick ? this.props.multipleClick(text) : null;  //回调输入的倍数

                            }

                            this.calculateScheduling(text,2);
                        }}
                                   returnKeyType="done"
                                   maxLength = {5}
                                   style = {{padding:0,  width:(iphone5S?60:80) ,height:38, borderColor:'lightgrey', borderWidth:1, backgroundColor:'#fff', marginTop:5, borderRadius:3, textAlign:'center'}} underlineColorAndroid ='transparent' value={this.state.isNormalChaseNumberModel?this.state.slectMutipleStartBeishuNormal:this.state.slectMutipleStartBeishu}
                                   onFocus={()=>{
                                       if(this.state.isNormalChaseNumberModel){
                                           this.state.slectMutipleStartBeishuNormal == '' ? this.setState({slectMutipleStartBeishuNormal: '1'}):null;
                                       }else {
                                           this.state.slectMutipleStartBeishu == '' ? this.setState({slectMutipleStartBeishu: '1'}) : null;
                                       }
                                       }}
                                   onBlur={()=>{
                                       if(this.state.isNormalChaseNumberModel){
                                           this.state.slectMutipleStartBeishuNormal == '' ? this.setState({slectMutipleStartBeishuNormal: '1'}):null;
                                       }else {
                                           this.state.slectMutipleStartBeishu == '' ? this.setState({slectMutipleStartBeishu: '1'}) : null;
                                       }
                                   }}></TextInput>
                        <CusBaseText style={{fontSize:19,color:"#7d7d7d"}}> 倍数</CusBaseText>
                    </View>
            </View>

            {/*追号倍数一*/}
                {this.state.isNormalChaseNumberModel?null:<View style={styles.zhuihaoyiStyle}>

                <View style={{flexDirection: 'row',flex:1,justifyContent: 'center',alignItems:'center'}}>
                    <CusBaseText style={{fontSize:19,color:"#7d7d7d"}}>每隔 </CusBaseText>
                    {/*<TextInput style={{width:40,backgroundColor:'yellow',textAlign:'center'}} placeholder = '1' placeholderTextColor = 'black' ></TextInput>*/}
                    <TextInput allowFontScaling={false} keyboardType = {global.iOS?'number-pad':'numeric'} onChangeText = {(text) => {
                        //输入倍数时的计算
                        this.state.slectMutipleEveryTimesQiShu = text != '' ? (text) : ('');
                        // this.props.multipleClick ? this.props.multipleClick(text) : null;  //回调输入的倍数
                        this.calculateScheduling(text,3);
                    }}
                               returnKeyType="done"
                               maxLength = {5}
                               style = {{padding:0,  width:(iphone5S?60:80) ,height:38, borderColor:'lightgrey', borderWidth:1, backgroundColor:'#fff', marginTop:5, borderRadius:3, textAlign:'center'}} underlineColorAndroid ='transparent' value={this.state.slectMutipleEveryTimesQiShu}
                               onFocus={()=>{

                                   this.state.slectMutipleEveryTimesQiShu == ''? this.setState({slectMutipleEveryTimesQiShu:'1'}):null;
                               }}
                               onBlur={()=>{

                                   this.state.slectMutipleEveryTimesQiShu == ''? this.setState({slectMutipleEveryTimesQiShu:'1'}):null;
                               }}></TextInput>
                    <CusBaseText style={{fontSize:19,color:"#7d7d7d"}}>    期</CusBaseText>
                </View>


                {/*<View style={{flexDirection: 'row',flex:1,justifyContent: 'center'}}>*/}
                    {/*<Text>起始</Text>*/}
                    {/*<TextInput style={{width:40,backgroundColor:'yellow',textAlign:'center'}} placeholder = '1' placeholderTextColor = 'black' ></TextInput>*/}
                    {/*<Text>倍数</Text>*/}
                {/*</View>*/}



                    <View style={{flexDirection: 'row',flex:1,justifyContent: 'center',alignItems:'center'}}>
                        <CusBaseText style={{fontSize:19,color:"#7d7d7d"}}>倍数 </CusBaseText>
                        {/*<TextInput style={{width:40,backgroundColor:'yellow',textAlign:'center'}} placeholder = '1' placeholderTextColor = 'black' ></TextInput>*/}
                        <TextInput allowFontScaling={false} keyboardType = {global.iOS?'number-pad':'numeric'} onChangeText = {(text) => {
                            //输入倍数时的计算
                            this.state.slectMutipleEveryTimesMultiplyBeiShu = text != '' ? (text) : ('');
                            // this.props.multipleClick ? this.props.multipleClick(text) : null;  //回调输入的倍数
                            this.calculateScheduling(text,4);
                        }}
                                   returnKeyType="done"
                                   maxLength = {5}
                                   style = {{padding:0, width:(iphone5S?60:80) ,height:38, borderColor:'lightgrey', borderWidth:1, backgroundColor:'#fff', marginTop:5, borderRadius:3, textAlign:'center'}} underlineColorAndroid ='transparent' value={this.state.slectMutipleEveryTimesMultiplyBeiShu}
                                   onFocus={()=>{
                                       this.state.slectMutipleEveryTimesMultiplyBeiShu == ''? this.setState({slectMutipleEveryTimesMultiplyBeiShu:'1'}):null;
                                   }}
                                   onBlur={()=>{
                                       this.state.slectMutipleEveryTimesMultiplyBeiShu == ''? this.setState({slectMutipleEveryTimesMultiplyBeiShu:'1'}):null;
                                   }}></TextInput>
                        <CusBaseText style={{fontSize:19,color:"#7d7d7d"}}> 倍数</CusBaseText>
                    </View>
            </View>}



            </View>


               {/*表头*/}
                <View style={styles.biaoTouStyle}>
                    <CusBaseText style={{fontSize:((width == 320) ? (16) :(19)),color:'#707070', flex:1.3,textAlign:'center'}}> 期数</CusBaseText>
                    <CusBaseText style={{fontSize:((width == 320) ? (16) :(19)),color:'#707070', flex:1,textAlign:'center'}}>倍数</CusBaseText>
                    <CusBaseText style={{fontSize:((width == 320) ? (16) :(19)),color:'#707070', flex:1,textAlign:'center'}}>金额</CusBaseText>
                    <CusBaseText style={{fontSize:((width == 320) ? (16) :(19)),color:'#707070', flex:1,textAlign:'center'}}>开奖时间</CusBaseText>
                </View>

            <FlatList
                // scrollEnabled={false}
                ref = 'myListView'
                data={this.state.isNormalChaseNumberModel?this.state.dataSourceNormal:this.state.dataSource
                }
                renderItem={(date)=> this.renderItem(date)}
            />



               </View>
            <View style={{backgroundColor:'#dbdbdb',height:1,width:SCREEN_WIDTH}} />
            <View style={{height:49,flexDirection:'row',  marginBottom: iphoneX ? 34 : 0}}>
                <View style={{flex:1,flexDirection:'row',alignItems:'center',marginLeft:20}}>
                    <View>
                    {this.state.isStop? (<TouchableOpacity onPress = {() => {this.setState({isStop:false})}} activeOpacity={1} style = {styles.check_Box}>
                            <View style = {{borderColor:'#a5a5a5',borderRadius:3, borderWidth:1, width:25, height:25,
                                alignItems:
                            'center',justifyContent:'center'}}>
                                <Image style = {{width:20, height:20,}} source = {require('../img/ic_smart_checkBox.png')}></Image></View>

                        </TouchableOpacity>):
                        (<TouchableOpacity onPress = {() => {this.setState({isStop:true})}} activeOpacity={1} style = {styles.check_Box}>
                            <View style = {{borderColor:'#a5a5a5',borderRadius:3, borderWidth:1, width:25, height:25}}></View>

                        </TouchableOpacity>)}
                </View>
                    <View style={{marginLeft:10}}>
                        <CusBaseText style={{fontSize:18,color:"#6a6a6a"}}>中奖后停止追号</CusBaseText>
                        <CusBaseText style={{marginTop:0,fontSize:18,color:"#6a6a6a"}}>共<CusBaseText style={{color:"#e33939"}}> {this.state.isNormalChaseNumberModel?this.state.totalMoneyNormal.zhushu:this.state.totalMoney.zhushu} </CusBaseText>注<CusBaseText style={{color:"#e33939"}}> {this.state.isNormalChaseNumberModel?this.state.totalMoneyNormal.money:this.state.totalMoney.money} </CusBaseText>元</CusBaseText>
                    </View>
                </View>
                <TouchableOpacity activeOpacity={0.7} onPress={this.submit}>
                <View style={{height:49,backgroundColor:"#e33939",flexDirection:'row',alignItems:'center'}}>
                <Text allowFontScaling={false} style={{marginHorizontal:10,fontSize:17,color:'white'}}>确认投注</Text>
                </View>
                </TouchableOpacity>
            </View>
            <LoadingView ref='LoadingView' isShow={this.state.isShow} showText={this.state.showText} />
            <Toast ref="Toast" position='center'/>
        </View>
    }



    clickPuTong()
    {
        // console.log('putong')
        // this.setState({isNormalChaseNumberModel:true});
        this.state.isNormalChaseNumberModel = true;
       this.calculateScheduling();
        if(this.startQishuInfo.length <=0){
            this.setState({});
        }
    }

    clickGaoJi()
    {
        // console.log('gaoji')

        // if(this.state.dataSource.length==0){


            this.state.isNormalChaseNumberModel = false;
             this.calculateScheduling();
        if(this.startQishuInfo.length <=0){
            this.setState({});
        }
        // }else{
        //     this.setState({isNormalChaseNumberModel:false});
        // }




    }

    submit = ()=>{
        // console.log(this.state.isNormalChaseNumberModel?this.state.dataSourceNormal:this.state.dataSource,this.state.isStop);
        if(this.startQishuInfo.length <=0||(this.state.isNormalChaseNumberModel?this.state.dataSourceNormal.length == 0:this.state.dataSource == 0)) {
            this.refs.Toast && this.refs.Toast.show(`投注失败！请先选择投注方案`, 1000);
            return;
        }
        this._comformRequest(this.props.navigation);
    }



    //cell
    renderItem(date){
        // console.log('index',date);
        return(

            <SmartChaseCell  allenData={date} clickPlus={this.clickPlus.bind(this)} clickMinus={this.clickMinus.bind(this)}/>


        );
    }

    //点击加号按钮
    clickPlus(item){

        item.num ++;
        item.money=(item.num*this.state.baseMoney).toFixed(2)
        // console.log("加");
    //    刷新
    //     this.refs.myListView
        this.totalMoney();
    }

    //点击减号按钮
    clickMinus(item){
        if (item.num==1) return;
        item.num --;
        item.money=(item.num*this.state.baseMoney).toFixed(2)
        // console.log("减");
        this.totalMoney();
    }


    //计算追号方案
    calculateScheduling(text,type){


        if(this.startQishuInfo.length<=0) return;

        // this.startQishuInfo
        // {time: '20171221078',num:'1',money:'2'};
        let qishuPlans = [];
        let qishuNumer = this.startQishuInfo[0].value.qishu;
        // let openTime = this.startQishuInfo[0].value.end_time;

        let count = 0;
        let slectMutipleQiShu = this.state.isNormalChaseNumberModel?this.state.slectMutipleQiShuNormal:this.state.slectMutipleQiShu;
        let slectMutipleStartBeishu = this.state.isNormalChaseNumberModel?this.state.slectMutipleStartBeishuNormal:this.state.slectMutipleStartBeishu;
        let slectMutipleEveryTimesMultiplyBeiShu  =this.state.slectMutipleEveryTimesMultiplyBeiShu;
        let slectMutipleEveryTimesQiShu=this.state.slectMutipleEveryTimesQiShu;

        let zhushu = 0;
        let moneyZ = 0;



        switch (type){
            case 1:
                    if(this.state.isNormalChaseNumberModel){
                        slectMutipleQiShu = text != '' ? (this.state.slectMutipleQiShuNormal) : ('1');
                    }else {
                        slectMutipleQiShu = text != '' ? (this.state.slectMutipleQiShu) : ('1');
                    }
                break;
            case 2:
                if(this.state.isNormalChaseNumberModel) {
                    slectMutipleStartBeishu = text != '' ? (this.state.slectMutipleStartBeishuNormal) : ('1');
                }else{
                    slectMutipleStartBeishu = text != '' ? (this.state.slectMutipleStartBeishu) : ('1');
                }
                break;
            case 3:

                slectMutipleEveryTimesQiShu = text != '' ? (this.state.slectMutipleEveryTimesQiShu) : ('1');

                break;
            case 4:

                slectMutipleEveryTimesMultiplyBeiShu = text != '' ? (this.state.slectMutipleEveryTimesMultiplyBeiShu) : ('1');

                break;

        }


        for(let i = 0 ; i < slectMutipleQiShu;i++){

            let qishu = qishuNumer++;

            let num =  this.state.isNormalChaseNumberModel?parseInt(slectMutipleStartBeishu):slectMutipleStartBeishu * Math.pow(slectMutipleEveryTimesMultiplyBeiShu,Math.floor(count/slectMutipleEveryTimesQiShu));
            let money = (num*this.state.baseMoney).toFixed(2);

            qishuPlans.push({time:qishu,num:num,money:money,openTime:this.startQishuInfo[i].value.end_time,key:i});
            count++;
            zhushu =this.state.baseZhuShu;
            moneyZ += num*this.state.baseMoney;
        }
        if(this.state.isNormalChaseNumberModel) {
            this.state.totalMoneyNormal.zhushu = zhushu;
            this.state.totalMoneyNormal.money = moneyZ.toFixed(2);
        }else{
            this.state.totalMoney.zhushu = zhushu;
            this.state.totalMoney.money = moneyZ.toFixed(2);
        }




        this.state.isNormalChaseNumberModel?this.setState({dataSourceNormal:qishuPlans}):this.setState({

            dataSource:qishuPlans
        })





        return qishuPlans;
    }


    //计算总金额跟注数

    totalMoney(){
        let money = 0;
        let zhushu = 0;
        let totalArr = this.state.isNormalChaseNumberModel?this.state.dataSourceNormal:this.state.dataSource;
        for(let i = 0; i < totalArr.length; i++){
            // zhushu +=  totalArr[i].num;
             money += totalArr[i].num*this.state.baseMoney
        }
        // this.setState({
        //     totalMoney:{zhushu:zhushu,money:money}
        // });
        if(this.state.isNormalChaseNumberModel) {
            //this.state.totalMoneyNormal.zhushu = zhushu;
            this.state.totalMoneyNormal.money = money.toFixed(2);
        }else{
           // this.state.totalMoney.zhushu = zhushu;
            this.state.totalMoney.money = money.toFixed(2);
        }

        this.setState({});

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


    //定时器开始
    _setTimeInval(){



        //重新加载数据

        if (this.timer) {
            return;
        }

        this.timer = setInterval(() => {
            // console.log("定期器定时器");

            if (this.state.currentTime < 1){

                this._featchData(this.state.tag);

              //  PushNotification.emit('CountTimeDeadLine1');  //倒计时结束发出通知
            }

            this.setState({
                currentTime:this.state.currentTime - 1,
            })

        }, 1000);

    }



    //刷新头部倒计时
    _featchData(tag){
        // console.log("tag",tag);

        let params = new FormData();
        params.append("ac", "getCPLogInfo");
        params.append("tag", tag);
        params.append('pcount', '1');
        params.append('ncount', '100');

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {
            // console.log("responseData",responseData);
                // this.refs.LoadingView && this.refs.LoadingView.cancer();


                var nextList = [];
                var i = 0;
                let cainfoData = responseData.data;
                //解析next数组
                cainfoData.next.map((next) =>{
                    nextList.push({ key: i, value: next});
                    i++;
                });

                // console.log("nextList",nextList);
                this.startQishuInfo = nextList;

                //请求下一期的开奖信息
                let nextModel = nextList[0];
                this.maxQishu = nextList.length;

                let jieZhiTime = 0;  //计算后的截止时间
                let lockTime = 0;  //玩法配置的锁定时间

                if (global.GameListConfigModel[tag] != null){
                    lockTime = global.GameListConfigModel[tag].lock_time;
                }

                let systemTime = (Number.parseInt || parseInt)(Moment().format('X'), 10);

                let differ = systemTime - nextModel.value.server_time;
                jieZhiTime = nextModel.value.end_time - systemTime - differ - parseInt(lockTime,10);

                //如果系统时间计算不出来使用jiezhiTime
                if (jieZhiTime <= 0){
                    jieZhiTime = nextModel.value.jiezhitime;
                }

                this.setState ({
                    qiShu:nextModel.value.qishu ,  //下一期开奖的期数
                    currentTime:jieZhiTime,  //下一期截止时间
                    isShow:false

                })


                if(this.state.isNormalChaseNumberModel) {
                  this.calculateScheduling();
                }else{
                    this.calculateScheduling();
                }

                // this.props.currentQiShu ? this.props.currentQiShu(nextModel.value.qishu) : null;  //回调期数

                this._setTimeInval();
            })
            .catch((err) => {
                // console.log('请求失败-------------->', err);
                this.setState({
                    isShow:false
                });
            })

        // console.log("结束...");
    }




    //确认投注的方法
    _comformRequest(navigate) {
        let uid = global.UserLoginObject.Uid;
        let token = global.UserLoginObject.Token;

        if (token == null || token.length <= 0) {
            Alert.alert('提示', '您登录过期,请重新登录',
                [
                    {text: '取消', onPress: () => {}},
                    {text: '确定', onPress: () => {
                        this.props.navigation.navigate('Login',{title:'登录', isBuy:true});
                    }},
                ])
            return;
        }

        let {datas, tag, js_tag} = this.state;
        let parameter = {
            smartChaseNumArr:this.state.isNormalChaseNumberModel?this.state.dataSourceNormal:this.state.dataSource,
            isSmartChaseNum:true,
            dataSource: datas,
            tag: tag,
            js_tag: js_tag,
            zhuiQiShu: this.state.isNormalChaseNumberModel?parseInt(this.state.slectMutipleQiShuNormal):parseInt(this.state.slectMutipleQiShu),
            beiShu: this.state.isNormalChaseNumberModel?this.state.slectMutipleStartBeishuNormal:this.state.slectMutipleStartBeishu,
            isStop: this.state.isStop?1:0
        }

        // 如果dataSource里的期数小于当前期数，再提示他清空 或保留下一期
        if (datas[0].value.qishu == "") {
            Alert.alert("提示", "期数没获取到！")

        } else if (parseInt(datas[0].value.qishu) < parseInt(this.state.qiShu)) {
            Alert.alert("提示", `${datas[0].value.qishu}该期已截止，清空或保留到下一期`,
                [

                    {text:'切换下一期', onPress:()=>{
                        datas[0].value.qishu = this.state.qiShu;
                    }}
                ])
            return;
        }

        if (uid.length != 0 && token.length != 0) {
            this.state.isShow = true;
            this.state.showText = "正在提交投注";
            this.refs.LoadingView && this.refs.LoadingView.showLoading('正在提交投注');
            let params = TouZhuParam.returnSubmitTuoZhuParam(parameter);

            var promise = GlobalBaseNetwork.sendNetworkRequest(params);
            promise
                .then((responseData) => {
                    this.setState({isShow:false});

                    this.refs.LoadingView && this.refs.LoadingView.cancer();

                    if (responseData.msg == 0) {

                        //数字类型的取两位小数
                        if (typeof(responseData.data.less) == 'number'){

                            responseData.data.less = responseData.data.less.toFixed(2);
                        }

                        this.refs.Toast && this.refs.Toast.show(`投注成功！您还剩余: ${responseData.data.less}元`, 1000);
                        global.UserLoginObject.TotalMoney =  responseData.data.less; //刷新金额
                        global.UserInfo.updateUserInfo(global.UserLoginObject, (result) => {});
                        PushNotification.emit('RefreshUserTotalMoney', responseData.data.less);

                        //发出清空号码的通知
                        PushNotification.emit('ClearAllBalls');

                        // this.setState({
                        //     dataSource: [],
                        //     totalPrice: 0,   //总价格
                        //     totalZhuShu: 0,  //总的注数
                        //     beiShu: 1, //倍数默认为1倍
                        // })



                        // unifyPrice = 0;
                        ShopHistoryArr = [];  //历史购物车赋空
                        global.BeiShu = '1';     //重新初始化，防止下次进来计算出错
                        global.ZhuiQiShu = '1';
                        PushNotification.emit('ClearShopCarOffNotification');  //清空购物车，屏蔽查看购物车按钮的通知
                        PushNotification.emit('HandAutoAddNotification', 0);

                        setTimeout(() => {

                            navigate.goBack(this.state.backKey);

                        }, 1000);
                    }
                    else if (responseData.msg == 40005){ //余额不足是否前往充值

                        Alert.alert(
                            '温馨提示',
                            '您的余额不足，是否前往充值',
                            [ { text: '确定', onPress: () => { this.props.navigation.navigate('RechargeCenter') } },
                                { text: '取消', onPress: () => { } },
                            ],
                        )
                    } else {
                        Alert.alert(
                            '提示',
                            responseData.param,
                            [{ text: '确定', onPress: () => { } }],
                        )
                    }
                })
                .catch((err) => {

                    if (err != null && err.message != ''){
                        this.refs.LoadingView && this.refs.LoadingView.showFaile('投注失败');
                    }
                    else {
                        this.refs.LoadingView && this.refs.LoadingView.cancer(1000);
                    }

                })
        }
    }





    componentWillUnmount() {
        // console.log("销毁");
        this.timer && clearInterval(this.timer);
        //this.timer1 && clearTimeout(this.timer1);

    }

}

const styles = StyleSheet.create({

    superViewStyles:{


    },

    timeStyle: {
        backgroundColor:'#f6f6f6',
        height:30,
        width:global.width,
        // textAlign:'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },

    switchStyle:{
        backgroundColor:"white",
        height:46,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',

    },

    switchTextStyle:{
        color:'#6a6a6a',
        // height:46,
        // width:global.width/2,
        fontSize:17,
    },

    zhuihaoyiStyle:{
        flexDirection: 'row',

        height:50,
        alignItems: 'center',
        justifyContent: 'center',

    },

    biaoTouStyle:{

        flexDirection: 'row',

        height:38,
        backgroundColor:'white',
        alignItems: 'center',

    },

    cellSuperStyle:{
        height:38,
        flexDirection: 'row',
        backgroundColor:'white',
        justifyContent: 'space-around',
        alignItems: 'center',

    },

})