import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Text,
    Alert,
    StatusBar,
    FlatList,
    Dimensions,
    ImageBackground,
    Modal,
} from 'react-native';
const { width, height } = Dimensions.get("window");
const KAdaptionWith = width / 414;
const KAdaptionHeight = height / 736;
import Adaption from "../../../skframework/tools/Adaption";
import HuoCalendar from './HuoCalendar';
import BaseNetwork from "../../../skframework/component/BaseNetwork"; //网络请求

export default class DailyAttendance extends Component {

      //接收上一个页面传过来的title显示出来
  static navigationOptions = ({ navigation }) => ({

      header: (

          <CustomNavBar
              centerText={"每日签到"}
              leftClick={() => {navigation.state.params.callback(),navigation.goBack()} }
          />

    
        ),
      });

  /**
   * 组件初始化状态
   */

   constructor(props) {
     super(props);
     this.state = {
       current_year : HuoCalendar.getFullYear(),
       current_month : HuoCalendar.getMonth()+1,
       current_day : HuoCalendar.getDate(),
       date_num_array :[],
       qiandaoButton:'未签到',
       loglist:[],
       box_info:'',
       is_box:'',
       isClickQianDao:false,
       isTanChuBaoXiang:false,
     };
     this.hongbaoPrice = '';
     this.hongbaoPrice_type = '';
     this.weekArray = [{key:0,value:'日'},{key:1,value:'一'},{key:2,value:'二'},{key:3,value:'三'},{key:4,value:'四'},{key:5,value:'五'},{key:6,value:'六'}]
   }
   /**
    * 组件将要挂载
    * 设置月份数组以及计算出每月的第一天星期几
    */
   componentWillMount() {
       first_day = HuoCalendar.weekOfMonth();
       let date_num_array = this._initMonthDayNumber(this.state.current_year,this.state.current_month);
       this.setState({date_num_array : date_num_array, first_day : first_day});
   }
 
   //根据每月是星期几判断每月天数
   componentDidMount(){
   
     let itemArray = [];
     switch (this.state.first_day) {
       case 0:
         itemArray = this.state.date_num_array;
         break;
       case 1:
         itemArray = [{key:31,value:null}];
         for (var i = 0; i < this.state.date_num_array.length; i++) {
         itemArray.push(this.state.date_num_array[i]);
          }
         break;
       case 2:
         itemArray = [{key:31,value:null},{key:32,value:null}];
         for (var i = 0; i < this.state.date_num_array.length; i++) {
         itemArray.push(this.state.date_num_array[i]);
          }
         break;
       case 3:
         itemArray = [{key:31,value:null},{key:32,value:null},{key:33,value:null}];
         for (var i = 0; i < this.state.date_num_array.length; i++) {
         itemArray.push(this.state.date_num_array[i]);
          }
         break;
       case 4:
         itemArray = [{key:31,value:null},{key:32,value:null},{key:33,value:null},{key:34,value:null}];
         for (var i = 0; i < this.state.date_num_array.length; i++) {
         itemArray.push(this.state.date_num_array[i]);
          }
         break;
       case 5:
         itemArray = [{key:31,value:null},{key:32,value:null},{key:33,value:null},{key:34,value:null},{key:35,value:null}];
         for (var i = 0; i < this.state.date_num_array.length; i++) {
         itemArray.push(this.state.date_num_array[i]);
          }
         break;
       case 6:
         itemArray = [{key:31,value:null},{key:32,value:null},{key:33,value:null},{key:34,value:null},{key:35,value:null},{key:36,value:null}];
         for (var i = 0; i < this.state.date_num_array.length; i++) {
         itemArray.push(this.state.date_num_array[i]);
          }
         break;
       default:
       break;
     }
     this.setState({date_num_array:itemArray})

     this._fetchMeiRiQianDaoData();
   }


   _fetchMeiRiQianDaoData(){

         //请求参数
         let params = new FormData();
         params.append("ac", "getUserSignedLog");
         params.append("uid", global.UserLoginObject.Uid);
         params.append("token",global.UserLoginObject.Token);
         params.append("sessionkey",global.UserLoginObject.session_key);
        

         var promise = BaseNetwork.sendNetworkRequest(params);
         promise
           .then(response => {
          if (response.msg==0&&response.data !=undefined) {
            let day = '0';
            if (HuoCalendar.getDate()<10) {
              day = '0'+HuoCalendar.getDate()
            }else {
               day = HuoCalendar.getDate()
            }

          
            
            let year = '0';
            
            if (this.state.current_month<10) {
              year = '0'+this.state.current_month
            }else {
              year = this.state.current_month
            }

         
            
            let date = HuoCalendar.getFullYear() + '-' + year + '-' + day;
            let dataLoglist = [];
            if(response.data.log!=''){
              dataLoglist = response.data.log.split('+');
            }
             
        
            let dataBlog = [];
            let dataBoxBlog = [];
            
            if (dataLoglist.includes(date)) {
              this.setState({qiandaoButton:'已签到',isClickQianDao:false});
            }else {
             
              this.setState({qiandaoButton:'未签到',isClickQianDao:true});
            
            }
            for (var i = 0; i < dataLoglist.length; i++) {
              dataBlog.push({ key: i, value: dataLoglist[i]});
            }
       
            // let k = 0;
            // QianDaodata.map(dict => {
            //   dataBoxBlog.push({ key: i, value: dict });
            //   k++;
            // });
            //用set去赋值
            this.setState({loglist: dataLoglist,box_info:response.data.box_info,is_box:response.data.is_box});
            // for (var i = 0; i < dataBoxlist.length; i++) {
            //   if (dataBoxlist[i].status == 1) {
            //     this.setState({isClickBaoXiang:true});
            //   }else {
            //    this.setState({isClickBaoXiang:false});
            //   }
            // }
            datalist = null;
            dataBlog = null;
          }else {
          NewWorkAlert(response.param);
          }
        })
        .catch(err => { });
   }
  /**
   * 给月份数组附上每月天数
   * @param year 年份
   * @private
   */
  _initMonthDayNumber(year,month) {
      let _date_array = [];
      for (var i = 0; i < 12; i++) {
          switch (i + 1) {
              case 1:
              case 3:
              case 5:
              case 7:
              case 8:
              case 10:
              case 12:
        _date_array = [{key:0,value:1},{key:1,value:2},{key:2,value:3},{key:3,value:4},{key:4,value:5},{key:5,value:6}
          ,{key:6,value:7},{key:7,value:8},{key:8,value:9},{key:9,value:10},{key:10,value:11},{key:11,value:12}
          ,{key:12,value:13},{key:13,value:14},{key:14,value:15},{key:15,value:16},{key:16,value:17},{key:17,value:18},
        {key:18,value:19},{key:19,value:20},{key:20,value:21},{key:21,value:22},{key:22,value:23},{key:23,value:24},
        {key:24,value:25},{key:25,value:26},{key:26,value:27},{key:27,value:28}
        ,{key:28,value:29},{key:29,value:30},{key:30,value:31}]

              break;
              case 4:
              case 6:
              case 9:
              case 11:
          _date_array = [{key:0,value:1},{key:1,value:2},{key:2,value:3},{key:3,value:4},{key:4,value:5},{key:5,value:6}
            ,{key:6,value:7},{key:7,value:8},{key:8,value:9},{key:9,value:10},{key:10,value:11},{key:11,value:12}
            ,{key:12,value:13},{key:13,value:14},{key:14,value:15},{key:15,value:16},{key:16,value:17},
           {key:17,value:18},{key:18,value:19},{key:19,value:20},{key:20,value:21},{key:21,value:22},
            {key:22,value:23},{key:23,value:24},{key:24,value:25},{key:25,value:26},{key:26,value:27},{key:27,value:28}
          ,{key:28,value:29},{key:29,value:30}]
          break;

        case 2:
        if (HuoCalendar.isLeapYear(year)) {
          _date_array = [{key:0,value:1},{key:1,value:2},{key:2,value:3},{key:3,value:4},{key:4,value:5},{key:5,value:6},
            {key:6,value:7},{key:7,value:8},{key:8,value:9},{key:9,value:10},{key:10,value:11},{key:11,value:12},{key:12,value:13}
            ,{key:13,value:14},{key:14,value:15},{key:15,value:16},{key:16,value:17},{key:17,value:18},{key:18,value:19},{key:19,value:20}
            ,{key:20,value:21},{key:21,value:22},{key:22,value:23},{key:23,value:24},{key:24,value:25},{key:25,value:26},{key:26,value:27}
            ,{key:27,value:28},{key:28,value:29}]

          } else {
          _date_array = [{key:0,value:1},{key:1,value:2},{key:2,value:3},{key:3,value:4},{key:4,value:5},{key:5,value:6},{key:6,value:7},
            {key:7,value:8},{key:8,value:9},{key:9,value:10},{key:10,value:11},{key:11,value:12},{key:12,value:13},{key:13,value:14},
            {key:14,value:15},{key:15,value:16},{key:16,value:17},{key:17,value:18},{key:18,value:19},{key:19,value:20},{key:20,value:21}
            ,{key:21,value:22},{key:22,value:23},{key:23,value:24},{key:24,value:25},{key:25,value:26},{key:26,value:27},{key:27,value:28}]
            }
          break;
          default:
          break;
        }
      if (month == i+1) {
         return _date_array;
       }
      }
  }

  // 点击事件
  _clcik() {
    this.state.isClickQianDao?this._fetchQianDaoData():null;
  }
  _fetchQianDaoData(){

    this.refs.LoadingView && this.refs.LoadingView.showLoading();

    let loginObject = global.UserLoginObject;
    //请求参数
    let params = new FormData();
    params.append("ac", "gameUserSigned");
    params.append("uid", loginObject.Uid);
    params.append("token",loginObject.Token);
    params.append("sessionkey",global.UserLoginObject.session_key);

    var promise = BaseNetwork.sendNetworkRequest(params);
    promise
      .then(response => {
      this.refs.LoadingView && this.refs.LoadingView.cancer()
      if (response.msg == 0) {

        this._fetchMeiRiQianDaoData()
        Alert.alert(
            '提示',
            '签到成功',
            [
            { text: '确定', onPress: () => { } },
            ]
        )
      }else {
        Alert.alert(
            '提示',
            response.param,
            [
            { text: '确定', onPress: () => { } },
            ]
        )
      }
   })
      .catch(err => { });
  }
//头部
  _listHeaderComponent(){
    return(
      <View style = {{width:width,height:90*KAdaptionHeight,backgroundColor:'white'}}>
        <View style = {{flex:0.7,backgroundColor:'white',flexDirection:'row',alignItems:'center'}}>
        <View style = {{flex:0.8,backgroundColor:'white',flexDirection:'row',alignItems:'center'}}>
          <CusBaseText style = {{flex:0.4,fontSize:15,color:'#222222',fontWeight:'400',textAlign:'left',marginLeft:15}}>
            {this.state.current_year}-{this.state.current_month}月 
          </CusBaseText>
          <CusBaseText style = {{flex:0.45,fontSize:15,color:'#222222',textAlign:'left'}}>
            累计签到 <CusBaseText style = {{fontSize:15,color:'red',textAlign:'left'}}>
            {this.state.loglist.length}</CusBaseText> 天
         
          </CusBaseText>
  
      
          </View>
          <TouchableOpacity activeOpacity={1} style={{flex:0.2,width:70,height:30,borderRadius:5,backgroundColor:COLORS.appColor,justifyContent:'center',alignItems:'center',marginRight:10}}
             onPress={() => this._clcik()}>
           <CusBaseText style = {{fontSize:13,color:'white',textAlign:'center'}}>
             {this.state.qiandaoButton}
           </CusBaseText>
          </TouchableOpacity>
        </View>
        <View style = {{width:width,height:1,backgroundColor:'#f3f3f3'}}>
        </View>
        <View style = {{flex:0.3,flexDirection:'row'}}>
          {this._onHeaderView()}
        </View>
      </View>
    );
  }
    _onHeaderView(){
      var marqueeViewArr = [];
      for (var i = 0; i < this.weekArray.length; i++) {
        marqueeViewArr.push(
        <View key={i} style={{width:width/7,borderRadius:(width/7)/2,justifyContent:'center',alignItems:'center'}}>
           <CusBaseText  style={{fontSize: Adaption.Font(15, 14), textAlign:'center',color:'#222222'}}>
          {this.weekArray[i].value}
           </CusBaseText>
        </View>
        );
      }
    return marqueeViewArr;
 }

  _clcikBaoXing(){
   
   if(this.state.is_box == 0) {
     return;
   }else {
    
     this._fetchLingQuBaoXiang();
   }

  }

  _fetchLingQuBaoXiang(){
  this.refs.LoadingView && this.refs.LoadingView.showLoading();
 
    //请求参数
    let params = new FormData();
    params.append("ac", "UserSignAward");
    params.append("uid", global.UserLoginObject.Uid);
    params.append("token",global.UserLoginObject.Token);
    params.append("sessionkey",global.UserLoginObject.session_key);

    var promise = BaseNetwork.sendNetworkRequest(params);
    promise
      .then(response => {
        this.refs.LoadingView && this.refs.LoadingView.cancer()
      if (response.msg == 0) {
        this.hongbaoPrice = response.data.price;
        this.hongbaoPrice_type = response.data.price_type;
        this.setState({isTanChuBaoXiang:true});
        this._fetchMeiRiQianDaoData();

      }else {
        Alert.alert(
            '提示',
            response.param,
            [
            { text: '确定', onPress: () => { } },
            ]
        )
      }
   })
   .catch(err => { });
  }
//尾部
 _listFooterComponent(){
 
    const { navigate } = this.props.navigation;
    let lingQuZhiGe = '';
    let yanse = '';
    if(this.state.is_box==0) {
      if (this.state.box_info == '已领取'){
        lingQuZhiGe = '宝箱已派发';
        yanse = '#cdcdcd';
      }else {
        lingQuZhiGe = '未达到领取资格';
        yanse = '#cdcdcd';
      }
  
    }else{
      lingQuZhiGe = '可领取';
      yanse = COLORS.appColor;
    }

    return(

     <View style = {{width:width,backgroundColor:'white'}}>
        <View style = {{width:width,height:15,backgroundColor:'#f3f3f3'}}>
          <View style = {{width:width,height:0.5,backgroundColor:'#cdcdcd'}}>
          </View>
        </View>
       <View style = {{width:width,height:50,alignItems:'center',flexDirection:'row'}}>
         <CusBaseText style = {{flex:0.65,fontSize:16,color:'#222222',fontWeight:'700',textAlign:'left',marginLeft:15}}>
           累计签到奖励
         </CusBaseText>
         <TouchableOpacity activeOpacity={1} style = {{flex:0.35}} onPress={() => navigate('LiShiDailyAtten')}>
            <CusBaseText style = {{fontSize:14,color:rgb(72,159,229),textAlign:'center',marginRight:5}}>
                查看领取记录 >
             </CusBaseText>
          </TouchableOpacity>
       </View>
       <View style = {{width:width-30,marginLeft:15,height:0.5,backgroundColor:'#cdcdcd'}}></View>
       <TouchableOpacity activeOpacity={1} style = {{width:width,height:64,flexDirection:'row',justifyContent:'center',alignItems:'center'}} onPress={() => this._clcikBaoXing()}>
            <View style = {{flex:0.2}}>
              <Image style = {{width:50,height:50}}   source={require("././img/ic_jinLiang.png")}></Image>
            </View>
            <View style = {{flex:0.7,flexDirection:'column',justifyContent:'center',marginTop:8}}>
              <CusBaseText style = {styles.footerTian}>
               {this.state.box_info}
              </CusBaseText>
              <CusBaseText style = {{fontSize:15,color:yanse,textAlign:'left',marginTop:8}}>
                {lingQuZhiGe}
              </CusBaseText>
            </View>
            <Image style = {{width:15,height:15}}  source={require("././img/ic_xuanzhetou.png")}></Image>
          </TouchableOpacity>
          <View style = {{width:width,height:15,backgroundColor:'#f3f3f3'}}>
          <View style = {{width:width,height:0.5,backgroundColor:'#cdcdcd'}}>
          </View>
        </View>
      <CusBaseText style = {{fontSize:16,color:'#f37',marginTop:10,marginLeft:15}}>
        提示:
      </CusBaseText>
      <CusBaseText style = {{fontSize:16,color:'#222222',marginTop:5,marginLeft:15,marginRight:15}}>
         1、累计或连续签到到达相应的天数都可获得奖励!
      </CusBaseText>
      <CusBaseText style = {{fontSize:16,color:'#222222',marginTop:10,marginLeft:15,marginRight:15}}>
         2、领取宝箱即可随机获得代金券或现金奖励.
      </CusBaseText>

     </View>
   )
 }
 //ceLl
    _renderItemView(item) {
      const { navigate } = this.props.navigation;
      let day = '0';
      let year = '0';
     
      if (this.state.current_month<10) {
        year = '0'+this.state.current_month
      }else {
        year = this.state.current_month
      }
      if (item.item.value<10) {
        day = HuoCalendar.getFullYear() + '-'+ year + '-' + '0'+item.item.value
      }else {
         day = HuoCalendar.getFullYear() + '-'+ year + '-'+item.item.value
      }

     

      let itemBack = '#ffffff';
      let itemTextColor = '#666666';
      if (item.item.value == HuoCalendar.getDate()) {
         itemTextColor = 'red';
      }
      for (var i = 0; i < this.state.loglist.length; i++) {
        if (day == this.state.loglist[i]) {
          itemBack = COLORS.appColor;
          itemTextColor = '#ffffff';
        }
      }

        return (
          <View  style = {styles.itemView}>
            <View style = {{width:(width/7)/2,height:(width/7)/2,borderRadius:((width/7)/2)/2,justifyContent:'center',alignItems:'center',backgroundColor:itemBack}}>
              <CusBaseText style={{ fontSize: Adaption.Font(15, 14), textAlign:'center',color:itemTextColor}}>
                {item.item.value}
              </CusBaseText>
            </View>
          </View>
        );
    }

    onRequestClose(){
      this.setState({isTanChuBaoXiang:false});
    }
    //展开宝箱

    _isShowBaoXiangEnvel() {
      return (
       
          <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            
           <ImageBackground style={{width:width-40, marginLeft: 20,marginRight:20,height:Adaption.Height(350),justifyContent:'center',alignItems:'center'}}
            source={require('./img/ic_beijinga.png')} resizeMode="stretch">
            <Image style = {{width:Adaption.Width(103),height:Adaption.Height(88),marginTop:Adaption.Height(100)}} source={require('./img/ic_jinKai.png')} resizeMode="stretch"></Image>
            <CusBaseText style={{ fontSize: Adaption.Font(22, 20), textAlign:'center',color:'#222222',marginTop:Adaption.Height(50)}}>
              获得 <CusBaseText style={{ fontSize: Adaption.Font(25, 25), textAlign:'center',color:'red',marginTop:Adaption.Height(50)}}>
               {this.hongbaoPrice}
            </CusBaseText>元{this.hongbaoPrice_type}
            </CusBaseText>
          </ImageBackground>
          <TouchableOpacity activeOpacity={1} style={{width:50,height:50}}
          onPress={() => this.onRequestClose()}>
          <Image
           source={require('./img/ic_guanbi.png')} 
            style={{ width: 40, height: 40, marginTop: 10}} />

        </TouchableOpacity>
          </View>
      )
    }

    render(){
      const { navigate } = this.props.navigation;

      return (
        <View style = {styles.container}>
          <FlatList
            data={this.state.date_num_array}
            renderItem={item => this._renderItemView(item)}
            horizontal={false} //水平还是垂直
            numColumns={7} //指定多少列
            ListFooterComponent={() => this._listFooterComponent()}
            ListHeaderComponent={() => this._listHeaderComponent()}
            />
            <LoadingView ref = 'LoadingView'/>
            {this.state.isTanChuBaoXiang ? <Modal
          visible={this.state.isTanChuBaoXiang}
          //显示是的动画默认none
          //从下面向上滑动slide
          //慢慢显示fade
          animationType={'none'}
          //是否透明默认是不透明 false
          transparent={true}
          //关闭时调用
          onRequestClose={() => this.onRequestClose()}
        >{this._isShowBaoXiangEnvel()}</Modal> : null}
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#ffffff',
    },
    itemView:{
      width:width/7,
      height:width/7,
      borderRadius:(width/7)/2,
      justifyContent:'center',
      alignItems:'center',
      
    },
   
   
    footerTian:{
      fontSize:15,
      color:'#000',
      textAlign:'left',
      marginTop:-10
    }

})
