import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StatusBar,
    Image,
    FlatList
} from 'react-native';
import BaseNetwork from "../../../skframework/component/BaseNetwork";
import Toast, {DURATION} from 'react-native-easy-toast'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import Moment from 'moment';
export default class FeedbackList extends Component {

  //接收上一个页面传过来的title  显示出来
  static navigationOptions = ({ navigation }) => ({

      header: (
          <CustomNavBar
              centerText = {"意见反馈"}
              leftClick={() => {navigation.state.params.callback(),navigation.goBack()} }
          />
      ),

  });

  constructor(props){
      super(props);
      this.state = {
          isAgree:false,
          isCuoWu:true,
          isTouSu:true,
          fankuiNeiRong:'',
          lianxi:'',
          dataSource:[],
          huifuDataSource:[],
          NoHuiFuDataSource:[],
      }
  }
    //移除通知
    componentWillUnmount() {
    this.subscription && this.subscription.remove();
  }

  componentDidMount() {

  this._fetchYijianFanKuiData();
  this.subscription = PushNotification.addListener('BiaoJiYijianFanKuiSuccess', () => {
    this._fetchYijianFanKuiData();
    });

  }


  //获取意见反馈数据
  _fetchYijianFanKuiData(){
    //请求参数
    let params = new FormData();
    params.append("ac", "getOpinionList");
    params.append("uid", global.UserLoginObject.Uid);
    params.append("token", global.UserLoginObject.Token);
    params.append("sessionkey", global.UserLoginObject.session_key);


    var promise = BaseNetwork.sendNetworkRequest(params);

    promise
      .then(response => {
        if (response.msg==0) {
       
          let datalist = response.data;

       
          let dataBlog = [];
          let huifuData = [];
          let NoHuiFuData = [];
          let i = 0;
          if(datalist!=null) {
          datalist.map(dict => {
              if(dict.answer=='') {
                NoHuiFuData.push({key:i,value:dict});
              }else {
                huifuData.push({key:i,value:dict});
              }
            dataBlog.push({ key: i,value: dict });
            i++;
          });
        }
        
          this.setState({
            dataSource: dataBlog,
            NoHuiFuDataSource:NoHuiFuData,
            huifuDataSource:huifuData,
          })
          datalist = null;
          dataBlog = null;
          huifuData = null;
          NoHuiFuData = null;

        }else {
         
        NewWorkAlert(response.param)
        }
      })
       .catch(err => { });
}


  _keyExtractor = (item,index) => {
    return String(index);
      }

      _renderItemView(item) {
        const { navigate } = this.props.navigation;
          let state = '';
          if(item.item.value.answer =='') {
            state = '未回复';
          }else {
            state = '已回复';  
          }
        return(
            <TouchableOpacity activeOpacity={1} onPress={() => navigate('FeedBackListDetial', { FeedBackList:item,title:item.item.value.title })} style = {styles.itemCell}>
              <CusBaseText style = {{flex:1,fontSize:15,color:'#222222',fontWeight:'400',textAlign:'center'}}>
              {item.item.value.title}
              </CusBaseText>
              <CusBaseText style = {{flex:1,fontSize:15,color:'#222222',fontWeight:'400',textAlign:'center'}}>
                {state}
              </CusBaseText>
              <CusBaseText style = {{flex:1,fontSize:15,color:'#222222',fontWeight:'400',textAlign:'center'}}>
              {Moment.unix(item.item.value.send_time).format('YYYY-MM-DD HH:mm:ss')}
              </CusBaseText>
            </TouchableOpacity>
          )
  
  
    }

    ListHeaderComponent() {
        return(
            <View style = {{flexDirection:'row',width:SCREEN_WIDTH,height:40,justifyContent:'center',alignItems:'center',backgroundColor:'white',marginTop:10,  borderBottomWidth:0.5,borderColor:'#cccccc',}}>
              <CusBaseText style = {{flex:1,fontSize:15,color:'#222222',fontWeight:'400',textAlign:'center'}}>
                标题
              </CusBaseText>
              <CusBaseText style = {{flex:1,fontSize:15,color:'#222222',fontWeight:'400',textAlign:'center'}}>
                状态
              </CusBaseText>
              <CusBaseText style = {{flex:1,fontSize:15,color:'#222222',fontWeight:'400',textAlign:'center'}}>
                反馈时间
              </CusBaseText>
            </View>
          )
    }

  //无数据页面
  _listEmptyComponent() {
  
    return (
      <CusBaseText style={{ textAlign: 'center', marginTop: SCREEN_HEIGHT / 2 - 100 }}>暂无数据</CusBaseText>
    );

  }
 

    render(){
        const { navigate } = this.props.navigation;
        return (
         <View style = {styles.container}>
            <View style={{width:SCREEN_WIDTH, height:45, backgroundColor: '#ffffff', flexDirection: 'row',justifyContent:'center',alignItems:'center' }}>
           <TouchableOpacity activeOpacity={1} onPress={() => navigate('Feedback',{callback: () => {this._fetchYijianFanKuiData()}})} style={styles.container_HeaderView_Box}>
               <Image style={{width:20,height:20}} source={require('./img/ic_fankui.png')}></Image>
               <CusBaseText style={[styles.container_HeaderView_Box_Text, {color: '#00a0e9',}]}>我要反馈</CusBaseText>
           </TouchableOpacity>
           <View style={{width:1, height:30, backgroundColor: 'lightgrey'}}></View>
           <TouchableOpacity activeOpacity={1} onPress = {() => navigate('ChatService', {callback:() => {},title:'在线客服'})} style={styles.container_HeaderView_Box}>
               <Image style={{width:20,height:20}} source={require('./img/ic_kefu.png')}></Image>
               <CusBaseText style={[styles.container_HeaderView_Box_Text, {color: '#00a0e9',}]}>联系客服</CusBaseText>
           </TouchableOpacity>
            </View>
            <View style={{width:SCREEN_WIDTH, height:1, backgroundColor: 'lightgrey'}}></View>

              <ScrollableTabView
              locked={true}
          automaticallyAdjustContentInsets={false}
          alwaysBounceHorizontal={false}
          style={{width:SCREEN_WIDTH,height:SCREEN_HEIGHT-46}}
          renderTabBar={() => <DefaultTabBar tabStyle={{ paddingBottom: 0 }} style={{ height: 35, backgroundColor: 'white' }} />}
          tabBarUnderlineStyle={styles.lineStyle}
          tabBarActiveTextColor={COLORS.appColor}>

           <FlatList
      
             keyExtractor={this._keyExtractor}
             data={this.state.dataSource}
             renderItem={item => this._renderItemView(item)}
             horizontal={false} //水平还是垂直
             showsVerticalScrollIndicator={false} //不显示右边滚动条
             enableEmptySections={true}
             ListEmptyComponent={this._listEmptyComponent()} // 没有数据时显示的界面
             tabLabel='全部'
             ListHeaderComponent = {() => this.ListHeaderComponent()}
          />

           <FlatList
        
             keyExtractor={this._keyExtractor}
             data={this.state.huifuDataSource}
             renderItem={item => this._renderItemView(item)}
             horizontal={false} //水平还是垂直
             showsVerticalScrollIndicator={false} //不显示右边滚动条
             enableEmptySections={true}
             ListEmptyComponent={this._listEmptyComponent()} // 没有数据时显示的界面
             tabLabel='已回复'
             ListHeaderComponent = {() => this.ListHeaderComponent()}
           //  ListFooterComponent={() => this._listFooterComponent()}
          />

           <FlatList
             keyExtractor={this._keyExtractor}
             data={this.state.NoHuiFuDataSource}
             renderItem={item => this._renderItemView(item)}
             horizontal={false} //水平还是垂直
             showsVerticalScrollIndicator={false} //不显示右边滚动条
             enableEmptySections={true}
             ListEmptyComponent={this._listEmptyComponent()} // 没有数据时显示的界面
             tabLabel='未回复'
             ListHeaderComponent = {() => this.ListHeaderComponent()}
           //  ListFooterComponent={() => this._listFooterComponent()}
          />

        </ScrollableTabView>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#f3f3f3',
    },
      //单个模块视图
  container_HeaderView_Box: {
    borderColor: 'lightgrey',
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',      //垂直居中
    justifyContent: 'center',  //水平居中

  },
//模块的文字
  container_HeaderView_Box_Text: {
    textAlign: 'left',
    fontSize: Adaption.Font(18, 16),
    marginLeft: 10,
  },
  lineStyle: {
    width: SCREEN_WIDTH / 3,
    height: 2,
    backgroundColor:COLORS.appColor,
  },
  itemCell: {
    flexDirection:'row',
    width:SCREEN_WIDTH,
    height:40,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'white',
     borderBottomWidth:0.5,
     borderColor:'#cccccc',
  }

})
