import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
    StatusBar,
  Dimensions,
  ImageBackground,
  DeviceEventEmitter,
  Modal,
  TextInput
} from "react-native";
const { width, height } = Dimensions.get("window");
const KAdaptionWith = width / 414;
const KAdaptionHeight = height / 736;


import BaseNetwork from "../../../skframework/component/BaseNetwork"; //网络请求
import Adaption from "../../../skframework/tools/Adaption"; //字体适配

export default class BangBankCar extends Component {
  static navigationOptions = ({ navigation }) => ({

      header: (
          <CustomNavBar
              centerText = {"银行卡"}
              leftClick={() => {navigation.state.params.callback(),navigation.goBack()} }
          />
      ),

     // title:'银行卡',
     //  headerStyle: {backgroundColor: COLORS.appColor, marginTop: Android ?(parseFloat(global.versionSDK) > 19?StatusBar.currentHeight:0) : 0},
     // headerTitleStyle:{color:'white',alignSelf:'center'},
     //  //加入右边空视图,否则标题不居中  ,alignSelf:'center'
     //  headerRight: (
     //      <View style={GlobalStyles.nav_blank_view} />
     //  ),
     // headerLeft:(
     //     <TouchableOpacity
     //        activeOpacity={1}
     //        style={GlobalStyles.nav_headerLeft_touch}
     //        onPress={()=>{navigation.state.params.callback(),navigation.goBack()}}>
     //        <View style={GlobalStyles.nav_headerLeft_view}/>
     //     </TouchableOpacity>
     // ),

  });

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true, //网络请求状态
      error: false,
      errorInfo: "",
      bankArray:[], //银行数据
      isShowReceiveRedEnvelope:false,
      showRedEnvelopeArray:[],
      isDeleteBank:false,
      jiaoyiPass:'',
    };
  }

  componentDidMount() {
    //接受登录的通知
    this.subscription = PushNotification.addListener('refshBankList', () => {
      this._fetchBangBankData();
    });
    this._fetchBangBankData();
  }
  //移除通知
    componentWillUnmount(){

      if (typeof (this.subscription) == 'object') {
          this.subscription && this.subscription.remove();
      }
    }
  //获取银行数据
  _fetchBangBankData() {

        //请求参数
        let params = new FormData();
        params.append("ac", "getUserBankCard");
        params.append("uid", global.UserLoginObject.Uid);
        params.append("token", global.UserLoginObject.Token);
        params.append("sessionkey", global.UserLoginObject.session_key);

        var promise = BaseNetwork.sendNetworkRequest(params);

        promise
          .then(response => {
          if (response.msg==0) {
            let datalist = response.data;
            let dataBlog = [];
            let i = 0;
            //用set去赋值

            datalist.map(dict => {
              dataBlog.push({ key: i, value: dict });
              i++;
            });
            //用set去赋值

            this.setState({bankArray: dataBlog});

            datalist = null;
            dataBlog = null;
          }else {
          NewWorkAlert(response.param);
          }

          })
          .catch(err => { });
  }

  //请求数据的圈圈
  renderLoadingView() {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          animating={true}
          style={{
            height: 80
          }}
          color="red"
          size="large"
        />
      </View>
    );
  }
  //请求错误
  renderErrorView(error) {
    return (
      <View style={styles.container}>
        <CusBaseText>Fail:{error}</CusBaseText>
      </View>
    );
  }
  _addBankCar(navigate){
        navigate( 
       'BindBankCard',{callback: () => {this._fetchBangBankData()}});
        return;
  }
  _listBankHeaderComponent(){
  const { navigate } = this.props.navigation;
  return(
    <TouchableOpacity activeOpacity={1}  style = {{width:width,height:45,flexDirection:'row',alignItems:'center',backgroundColor:'#000'}} onPress={()=>this._addBankCar(navigate)}>
      <CusBaseText style = {{flex:1,fontSize:Adaption.Font(16,15),color:'white',textAlign:'left',marginLeft:15}}>
        +添加银行卡
      </CusBaseText>
      <Image  style = {{width:15,height:15,marginRight:10}} source = {require('./img/ic_banSanJiao.png')}></Image>
    </TouchableOpacity>
  )
 }
  _renderBankItemView(item) {
    const { navigate } = this.props.navigation;
    let backBGImage = require('./img/ic_nongyeBank.png');
    let backIcon = require('./img/ic_LnongyeBank.png');
    let morenWidth = 0;
    let morenHeight = 0;
          if (item.item.value.is_default == 1) {
            morenWidth = 30;
            morenHeight = 30;
          }
          if (item.item.value.bank_typename == "中国农业银行") {
           backBGImage =  require('./img/ic_nongyeBank.png');
           backIcon =  require('./img/ic_LnongyeBank.png');

          }else if (item.item.value.bank_typename == "中国建设银行") {
            backBGImage =  require('./img/ic_jiansheBank.png');
            backIcon =  require('./img/ic_LjiangsheBank.png');

          }else if (item.item.value.bank_typename == "中国工商银行") {
            backBGImage =  require('./img/ic_gongshangBank.png');
            backIcon =  require('./img/ic_LgongshangBank.png');

          }else if (item.item.value.bank_typename == "中国招商银行") {
            backBGImage =  require('./img/ic_zhaoshangBank.png');
            backIcon =  require('./img/ic_LzhaoshangBank.png');

          }else if (item.item.value.bank_typename == "中国银行") {
            backBGImage =  require('./img/ic_zhongguoBank.png');
            backIcon =  require('./img/ic_LzhongguoBank.png');

          }else if (item.item.value.bank_typename == "中国邮政储蓄") {
            backBGImage =  require('./img/ic_youzhengBank.png');
            backIcon =  require('./img/ic_LyouzhengBank.png');

          }else if (item.item.value.bank_typename == "中国民生银行") {
            backBGImage =  require('./img/ic_mingshengBank.png');
            backIcon =  require('./img/ic_LmingshengBank.png');

          }else if (item.item.value.bank_typename == "中信银行") {
            backBGImage =  require('./img/ic_zhongxinBank.png');
            backIcon =  require('./img/ic_LzhongxinBank.png');

          }else if (item.item.value.bank_typename == "中国光大银行") {
            backBGImage =  require('./img/ic_guangdaBank.png');
            backIcon =  require('./img/ic_LguangdaBank.png');

          }else if (item.item.value.bank_typename == "兴业银行") {
            backBGImage =  require('./img/ic_xingyeBank.png');
            backIcon =  require('./img/ic_LxingyeBank.png');

          }else if (item.item.value.bank_typename == "华夏银行") {
            backBGImage =  require('./img/ic_huaxiaBank.png');
            backIcon =  require('./img/ic_LhuaxiaBank.png');

          }else if (item.item.value.bank_typename == "北京银行") {
            backBGImage =  require('./img/ic_beijingBank.png');
            backIcon =  require('./img/ic_LbeijingBank.png');

          }else if (item.item.value.bank_typename == "浦发银行") {
            backBGImage =  require('./img/ic_pufaBank.png');
            backIcon =  require('./img/ic_LpufaBank.png');

          }else if (item.item.value.bank_typename == "广发银行") {
            backBGImage =  require('./img/ic_pufaBank.png');
            backIcon =  require('./img/ic_LpufaBank.png');

          }else if (item.item.value.bank_typename == "平安银行") {
            backBGImage =  require('./img/ic_pinganBank.png');
            backIcon =  require('./img/ic_LpinganBank.png');

          }else if (item.item.value.bank_typename == "浙商银行") {
            backBGImage =  require('./img/ic_zheshangBank.png');
            backIcon =  require('./img/ic_LzheshangBank.png');

          }else if (item.item.value.bank_typename == "浙江稠州商业银行") {
            backBGImage =  require('./img/ic_hangzhouCZBank.png');
            backIcon =  require('./img/ic_LzhejiangCZBank.png');

          }else if (item.item.value.bank_typename == "顺德农村信用合作社") {
            backBGImage =  require('./img/ic_shundeNCBank.png');
            backIcon =  require('./img/ic_LshundeNCBank.png');

          }else if (item.item.value.bank_typename == "深圳发展银行") {
            backBGImage =  require('./img/ic_shenzhenFZBank.png');
            backIcon =  require('./img/ic_LshenzhenFZBank.png');

          }else if (item.item.value.bank_typename == "上海银行") {
            backBGImage =  require('./img/ic_shanghaiBank.png');
            backIcon =  require('./img/ic_LshanghaiBank.png');

          }else if (item.item.value.bank_typename == "上海农村商业银行") {
            backBGImage =  require('./img/ic_shanghaiSYBank.png');
            backIcon =  require('./img/ic_LshanghaiNCSYBank.png');

          }else if (item.item.value.bank_typename == "南京银行") {
            backBGImage =  require('./img/ic_nanjingBank.png');
            backIcon =  require('./img/ic_LnanjingBank.png');

          }else if (item.item.value.bank_typename == "交通银行") {
            backBGImage =  require('./img/ic_jiaotongBank.png');
            backIcon =  require('./img/ic_LjiaotongBank.png');

          }else if (item.item.value.bank_typename == "杭州银行") {
            backBGImage =  require('./img/ic_hangzhouBank.png');
            backIcon =  require('./img/ic_LhangzhouBank.png');

          }else if (item.item.value.bank_typename == "广州市农村信用社") {
            backBGImage =  require('./img/ic_guangzhouNCXYSBank.png');
            backIcon =  require('./img/ic_LguangzhouNCBank.png');

          }else if (item.item.value.bank_typename == "东亚银行") {
            backBGImage =  require('./img/ic_dongyaBank.png');
            backIcon =  require('./img/ic_LdongyaBank.png');

          }else if (item.item.value.bank_typename == "渤海银行") {
            backBGImage =  require('./img/ic_bohaiBank.png');
            backIcon =  require('./img/ic_LbohaiBank.png');

          }else if (item.item.value.bank_typename == "北京农村商业银行") {
            backBGImage =  require('./img/ic_beijingNCSYBank.png');
            backIcon =  require('./img/ic_LbeijingNCSYBank.png');

          }else if (item.item.value.bank_typename == "宁波银行") {
            backBGImage =  require('./img/ic_ningboBank.png');
            backIcon =  require('./img/ic_LningboBank.png');

          }else if (item.item.value.bank_typename == "广州银行") {
            backBGImage =  require('./img/ic_guangzhouBank.png');
            backIcon =  require('./img/ic_LguangzhouBank.png');
          }else{
            backBGImage = require('./img/ic_qitaBank.png');
            backIcon = require('./img/ic_qitaBankIcon.png');   
        }


    return(
      <TouchableOpacity activeOpacity={1} style = {{width:width-10,height:80,marginLeft:5,marginVertical: 15}} onPress={()=> this.onClickGoToBank(item)}>
        <ImageBackground style = {{width:width-10,height:80}} source ={backBGImage}>
          <View style = {{flex:1,flexDirection:'row'}}>
            <Image style = {{width:30,height:30,marginTop:5,marginLeft:5,marginTop:10}} source ={backIcon}>
            </Image>
            <View style = {{width:width-10-60-5,height:45,flexDirection:'column',backgroundColor:'rgba(1,1,1,0)',marginTop:10}}>
              <CusBaseText style={{flex:1,fontSize:Adaption.Font(15,15),color:'white',textAlign:'left',marginLeft:5}}>
                {item.item.value.bank_typename}
              </CusBaseText>
              <CusBaseText style={{flex:1,fontSize:Adaption.Font(13,12),color:'#D3D3D3',textAlign:'left',marginLeft:6}}>
                储蓄卡
              </CusBaseText>
            </View>
            <Image style = {{width:morenWidth,height:morenWidth}} source ={require('./img/ic_backMoRen.png')}>
            </Image>
          </View>
          <View style = {{flex:1,flexDirection:'column',backgroundColor:'rgba(1,1,1,0)',marginTop:20}}>
            <CusBaseText style={{fontSize:Adaption.Font(18,16),color:'white',textAlign:'center',fontWeight:'500'}}>
            {item.item.value.card_num.substr(0,4)} **** **** {item.item.value.card_num.substr(item.item.value.card_num.length-4,4)}
            </CusBaseText>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    )
  }
onClickGoToBank(item){
  this.setState({
      isShowReceiveRedEnvelope: true,
      showRedEnvelopeArray:item,
  })
}

//弹出框
 onRequestClose(){
   this.setState({
       isShowReceiveRedEnvelope: false,
   })
 }
 onRequestDeleBankClose(){
   this.setState({
       isDeleteBank: false,
   })
 }
   //设置默认银行卡
   _fetchSetMoreRenBank(arr){

     this.refs.LoadingView && this.refs.LoadingView.showLoading('设置中');

     //请求参数
     let params = new FormData();
     params.append("ac", "setUserBankDefault");
     params.append("uid", global.UserLoginObject.Uid);
     params.append("token", global.UserLoginObject.Token);
     params.append("id", arr.item.value.id);
     params.append("sessionkey", global.UserLoginObject.session_key);

     var promise = BaseNetwork.sendNetworkRequest(params);

     promise
       .then(response => {
         let datalist = response.data;
         let dataBlog = [];
         let i = 0;

         if (response.msg == 0 ) {
             this.refs.LoadingView && this.refs.LoadingView.cancer()
             this._fetchBangBankData();
           Alert.alert(
               '提示',
               '设置成功',
               [
                   {text: '确定', onPress: () => {}},
               ]
           )
         }else {
           Alert.alert(
               '提示',
               response.param,
               [
                   {text: '确定', onPress: () => {}},
               ]
           )
         }

         datalist = null;
         dataBlog = null;
       })
       .catch(err => { });
   }

   onClickXiuGai(ind,array,navigate){

      if (ind == 0) {
        this.setState({
            isShowReceiveRedEnvelope: false,
        })
         
       this._fetchSetMoreRenBank(array);
 
      }else if (ind == 1) {
        this.setState({
            isShowReceiveRedEnvelope: false,
        })
      navigate('ReviseBankCar',{callback:()=>{this._fetchBangBankData()},bankArray:array})
      }else if (ind == 2) {
        if (array.item.value.is_default==0) {
          this.setState({
              isShowReceiveRedEnvelope: false,
          })
          this.setState({
              isDeleteBank: true,
          })
        }else {

          Alert.alert(
              '提示',
              '默认银行卡不能解绑',
              [
                  {text: '确定', onPress: () => {this.setState({
                          isShowReceiveRedEnvelope: false,
                      })}},
              ]
          )

        }

      }
   }
     //解除绑定
   _fetchDeleteBankData(deleArray){
  

     this.refs.LoadingView && this.refs.LoadingView.showLoading('解除中');

     //请求参数
     let params = new FormData();
     params.append("ac", "delUserBankCard");
     params.append("uid", global.UserLoginObject.Uid);
     params.append("token", global.UserLoginObject.Token);
     params.append("id", deleArray.item.value.id);
      params.append("tk_pass",this.state.jiaoyiPass);
      params.append("sessionkey", global.UserLoginObject.session_key);

     var promise = BaseNetwork.sendNetworkRequest(params);

     promise
       .then(response => {
         let datalist = response.data;
         let dataBlog = [];
         let i = 0;

         if (response.msg == 0 ) {
           this.refs.LoadingView && this.refs.LoadingView.cancer()
             this._fetchBangBankData();
           Alert.alert(
               '提示',
               '解除绑定成功',
               [
                   {text: '确定', onPress: () => {}},
               ]
           )
         }else {
          this.refs.LoadingView && this.refs.LoadingView.cancer()
           Alert.alert(
               '提示',
               response.param,
               [
                   {text: '确定', onPress: () => {}},
               ]
           )
         }

         datalist = null;
         dataBlog = null;
       })
       .catch(err => { });
   }

      oncancalDelete(){
        this.setState({isDeleteBank:false,})
      }

      onQueDingDelete(bankArrr){
        if (this.state.jiaoyiPass.length ==0) {
          return NewWorkAlert('交易密码不能为空')
        }
        this.setState({isDeleteBank:false,})
        setTimeout(() => {
          this._fetchDeleteBankData(bankArrr);
        }, 500);
   
      }

   _isShowDeletBank(bankArr) {
     const { navigate } = this.props.navigation;
       return(
         <TouchableOpacity activeOpacity={1} style = {{flex:1}} >
          <View style={{backgroundColor:'rgba(0,0,0,0.2)', flex:1, alignItems:'center',justifyContent:'center'}}>
            <View style = {{width:width-50,height:120,alignItems:'center',backgroundColor:'#eeeeee',borderRadius:5,padding:5,marginTop:10}}>
              <CusBaseText style = {{fontSize:15,color:'#222222',textAlign:'center'}}>
                请输入4位纯数字的交易密码
              </CusBaseText>
              <TextInput
                style={{width:100,height:30,borderRadius:5,borderWidth:1,borderColor:'#cdcdcd',textAlign:'center',marginTop:15,padding:0}}
                underlineColorAndroid ='transparent'
                keyboardType='number-pad'
                secureTextEntry={true}
                maxLength={4}
                onChangeText={(text) => this.setState({jiaoyiPass:text})}>
              </TextInput>
              <View style={{backgroundColor:'#cdcdcd',width:width-50,height:1,marginTop:10}}>
              </View>

              <View style = {{width:width-50,height:50,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                  <TouchableOpacity activeOpacity={1} style = {{flex:1}}
                    onPress={()=> this.oncancalDelete()}>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <CusBaseText style = {{fontSize:15,color:'#666666',textAlign:'center'}}>
                      取消
                    </CusBaseText>
                      </View>
               
                  </TouchableOpacity>
                  <View style={{backgroundColor:'#cdcdcd',width:1,height:25}}>
                  </View>
                  <TouchableOpacity activeOpacity={1} style = {{flex:1}} onPress={()=> this.onQueDingDelete(bankArr)}>
                  <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <CusBaseText style = {{fontSize:15,color:'red',textAlign:'center'}}>
                      确定
                    </CusBaseText>
                    </View>
                  </TouchableOpacity>
              </View>
            </View>
          </View>
          </TouchableOpacity>
        )
   }

 _isShowReceiveRedEnvel(array){
  const { navigate } = this.props.navigation;
    return(
      <TouchableOpacity activeOpacity={1} style = {{flex:1}} onPress={()=> this.onRequestClose()}>
       <View style={{backgroundColor:'rgba(0,0,0,0.2)', flex:1, alignItems:'center'}}>
         <View style = {{width:width,height:105,justifyContent:'center',alignItems:'center',backgroundColor:'#eeeeee',marginTop:iOS?height==812?height-180:height-150:height-200}}>
           <TouchableOpacity activeOpacity={1}
             style = {{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'white',width:width}}
             onPress={()=> this.onClickXiuGai(0,array,navigate)}>
             <CusBaseText style = {{fontSize:Adaption.Font(15,14),color:'#222222',textAlign:'center'}}>
              设置默认银行卡
             </CusBaseText>
           </TouchableOpacity>
           <View style = {{width:width,height:1,backgroundColor:'#cdcdcd'}}></View>
           <TouchableOpacity activeOpacity={1}
             style = {{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'white',width:width}}
             onPress={()=> this.onClickXiuGai(1,array,navigate)}>
             <CusBaseText style = {{fontSize:Adaption.Font(15,14),color:'#222222',textAlign:'center'}}>
               修改
             </CusBaseText>
           </TouchableOpacity>
           <View style = {{width:width,height:1,backgroundColor:'#cdcdcd'}}></View>
           <TouchableOpacity activeOpacity={1}
             style = {{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'white',width:width}}
             onPress={()=> this.onClickXiuGai(2,array,navigate)}>
             <CusBaseText style = {{fontSize:Adaption.Font(15,14),color:'#222222',textAlign:'center'}}>
               解除绑定
             </CusBaseText>
           </TouchableOpacity>
         </View>
         <TouchableOpacity activeOpacity={1}
           style = {{width:width,height:35,justifyContent:'center',alignItems:'center',backgroundColor:'white',marginTop:10}}
           onPress={()=> this.onRequestClose()}>
           <CusBaseText style = {{fontSize:Adaption.Font(15,14),color:'red',textAlign:'center'}}>
             取消
           </CusBaseText>
         </TouchableOpacity>
       </View>
       </TouchableOpacity>
     )
  }


  _preferentialFlatlist() {
    return (
      <FlatList
        automaticallyAdjustContentInsets={false}
        alwaysBounceHorizontal = {false}
        data={this.state.bankArray}
        ListHeaderComponent={() => this._listBankHeaderComponent()}
        renderItem={item => this._renderBankItemView(item)}
      />
    );
  }

  render() {
    const { navigate } = this.props.navigation;
    return  <View style={styles.container}>
        {this._preferentialFlatlist()}
        {this.state.isShowReceiveRedEnvelope?<Modal
                 visible={this.state.isShowReceiveRedEnvelope}
                 //显示是的动画默认none
                 //从下面向上滑动slide
                 //慢慢显示fade
                 animationType = {'none'}
                 //是否透明默认是不透明 false
                 transparent = {true}
                 //关闭时调用
                 onRequestClose={()=> this.onRequestClose()}
         >{this._isShowReceiveRedEnvel(this.state.showRedEnvelopeArray)}</Modal>:null}
         {this.state.isDeleteBank?<Modal
                  visible={this.state.isDeleteBank}
                  //显示是的动画默认none
                  //从下面向上滑动slide
                  //慢慢显示fade
                  animationType = {'none'}
                  //是否透明默认是不透明 false
                  transparent = {true}
                  //关闭时调用
                  onRequestClose={()=> this.onRequestDeleBankClose()}
          >{this._isShowDeletBank(this.state.showRedEnvelopeArray)}</Modal>:null}
          <LoadingView ref = 'LoadingView'/>
      </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1d1d1d"
  },
  cellStyle: {
    marginLeft:15,
    width: width - 30,
    height: 220,
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 15, // cell垂直之间的间隔
    borderRadius:8,
    borderWidth:1,
    borderColor:'rgb(222,222,222)',
  },

});
