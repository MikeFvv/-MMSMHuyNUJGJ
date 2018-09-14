import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("window");
import Adaption from "../../skframework/tools/Adaption"; //字体适配
import moment from 'moment';

export default class TouZhuZongHeDetial extends Component {
  static navigationOptions = ({ navigation }) => ({

      header: (
          <CustomNavBar
              centerText = {"详情"}
              leftClick={() =>  navigation.goBack() }
          />
      ),


  });

  constructor(props) {
    super(props);
    this.state = {
      detialArray: {}, //详情数据
      backupCpicon:false,//是否启用备用彩种地址
    };
  }
  componentWillMount() {
    this.setState({
      detialArray: this.props.navigation.state.params.detialArray.value.bet_info,
    })
  }
  //头部视图
  _createHeaderView() {
    //"status": 0,          //0: 未开獎， 1:已中獎，2: 未中獎，3:和局， 4:已撤單
    //判断该订单状态是否为已撤单
    let winLabel = '';
    let winTextColor = '';
    let winState = '';
   
      let statusArr = [];
      for (let inIndex = 0; inIndex < this.state.detialArray.length; inIndex++) {
        statusArr.push(this.state.detialArray[inIndex].status);
       
      }


      if (statusArr.includes(4)) {
       winLabel = '已撤单';
         winTextColor = 'gray';
    
      } else if (statusArr.includes(0)) {
        winLabel = '待开奖';
        winTextColor = '#ff7c34';
   
      } else if (statusArr.includes(2)) {
        winLabel = '未中奖';
        winTextColor = 'red';

      } else {
        winState =  + this.state.detialArray[0].win_price + '元';
        winLabel = '已中奖'
        winTextColor = 'rgb(0,109,0)';
      }

   

    return (
    <View style = {{width:width, height:270,justifyContent:'center',alignItems:'center'}}>
      <View style={{ width: width, height: 90, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
        <View style={{ flex: 0.25 }}>
          <Image style={{ width: 60, height: 60, marginLeft: 15 }}
            source={require('./img/ic_zuqiu.png')}>
          </Image>
        </View>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', marginLeft: 10 }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center',marginTop:10}}>
            <CusBaseText style={{flex:0.7, fontSize: Adaption.Font(17, 16), color: '#222222', textAlign: 'left',marginLeft: 15 }}>
              足球
            </CusBaseText>
            <CusBaseText style={{flex:0.3, fontSize: Adaption.Font(17, 16), color: 'rgb(0,109,0)', textAlign: 'right', marginRight: 20 }}>
            {winState}
            </CusBaseText>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', }}>
            <CusBaseText style={{flex:0.7, fontSize: Adaption.Font(16, 16), color: 'gray', textAlign: 'left',marginLeft: 15 }}>
             普通投注
            </CusBaseText>
            <CusBaseText style={{flex:0.3, fontSize: Adaption.Font(16, 16), color: winTextColor, textAlign: 'right' ,marginRight: 15}}>
              {winLabel}
            </CusBaseText>
          </View>
        </View>
      </View>

      <View style={{ width: width, height: 1.5, backgroundColor: '#eeeeee' }}>
        </View>

        <View style={{ width: width, height: 40, backgroundColor: 'white', alignItems: 'center', flexDirection: 'row' }}>
          <View style={{ marginLeft: 20, width: 6, height: 20, backgroundColor: COLORS.appColor }}>
          </View>
          <CusBaseText style={{ fontSize: Adaption.Font(17, 16), color: '#222222', textAlign: 'left', marginLeft: 5,fontWeight:'500' }}>
            订单内容
        </CusBaseText>
        </View>

        <View style={{ width: width, height: 25, backgroundColor: 'white', flexDirection: 'row' }}>
          <CusBaseText style={{ marginLeft: 30, fontSize: Adaption.Font(15, 14), color: '#666666', textAlign: 'left' }}>
            订  单  号
        </CusBaseText>
          <CusBaseText style={{ marginLeft: 15, fontSize: Adaption.Font(15, 14), color: '#222222', textAlign: 'left' }}>
          {this.props.navigation.state.params.detialArray.value.betslip_id} 
          </CusBaseText>
        </View>

        <View style={{ width: width, height: 25, backgroundColor: 'white', flexDirection: 'row' }}>
          <CusBaseText style={{ marginLeft: 30, fontSize: Adaption.Font(15, 14), color: '#666666', textAlign: 'left' }}>
            投注金额
        </CusBaseText>
          <CusBaseText style={{ marginLeft: 15, fontSize: Adaption.Font(15, 14), color: '#222222', textAlign: 'left' }}>
          {this.props.navigation.state.params.detialArray.value.bet_info[0].price}元
          </CusBaseText>
        </View>

         <View style={{ width: width, height: 25, backgroundColor: 'white', flexDirection: 'row' }}>
          <CusBaseText style={{ marginLeft: 30, fontSize: Adaption.Font(15, 14), color: '#666666', textAlign: 'left' }}>
            过关方式
        </CusBaseText>
          <CusBaseText style={{ marginLeft: 15, fontSize: Adaption.Font(15, 14), color: '#222222', textAlign: 'left' }}>
          {this.props.navigation.state.params.detialArray.value.bet_info.length}串1
          </CusBaseText>
        </View>
   
        <View style={{ width: width, height: 25, backgroundColor: 'white', flexDirection: 'row' }}>
          <CusBaseText style={{ marginLeft: 30, fontSize: Adaption.Font(15, 14), color: '#666666', textAlign: 'left' }}>
            投注时间
        </CusBaseText>
          <CusBaseText style={{ marginLeft: 15, fontSize: Adaption.Font(15, 14), color: '#222222', textAlign: 'left' }}>
          {moment.unix(this.props.navigation.state.params.detialArray.value.bet_info[0].bet_time/1000).format('YYYY-MM-DD HH:mm:ss')}
          </CusBaseText>
        </View>
        <View style={{ width: width, height: 20, backgroundColor: 'white', alignItems: 'center', flexDirection: 'row' }}>
          <View style={{ marginLeft: 20, width: 6, height: 20, backgroundColor: COLORS.appColor }}>
          </View>
          <CusBaseText style={{ fontSize: Adaption.Font(17, 16), color: '#222222', textAlign: 'left', marginLeft: 5,fontWeight:'500' }}>
            我的投注
        </CusBaseText>
        </View> 

        <View style={{ width: width, height: 25, backgroundColor: 'white', flexDirection: 'row',marginTop: 15}}>
        <Image
        source={require('./img/ic_chupiaokou.png')}  resizeMode={'stretch'}
          style={{ width: width-30, height: 10,marginLeft:15,marginTop:8}}/>
        </View>
    </View>
    )
  }

  _renderItemView(item){
    let winLabel = '';
      let winTextColor = ''
      if (item.item.status == '0') {
        winLabel = '待开奖';
        winTextColor = '#ff7c34';
      } else if (item.item.status == '2') {
        winLabel = '未中奖';
        winTextColor = 'red';
      } else if (item.item.status == '1') {
        winLabel = '已中奖'
        winTextColor = 'rgb(0,109,0)';
      } else if (item.item.status == '4') {
        winLabel = '已撤单';
        winTextColor = 'gray';
      }else if (item.item.status == '3') {
        winLabel = '和局';
        winTextColor = 'gray';
      }
    return(
      
          <TouchableOpacity activeOpacity={1}  >
            <View style = {styles.cellStyle}>
              <View style = {{flex:1,justifyContent:'center'}}>
                 <CusBaseText style={{color:'#222222',fontWeight:'500',fontSize:16,marginLeft:15}}>
                 {item.item.play_method}
                 {item.item.play_method.is_corner==1?<CusBaseText style={{ fontSize: Adaption.Font(16, 15),backgroundColor:'#ff7c34', color: 'white', textAlign: 'center', marginLeft:10,fontWeight:'500' }}>
                         角球数
                   </CusBaseText>:null}
                  </CusBaseText>
              </View>
              <View style = {{flex:1,justifyContent:'center'}}>
               <CusBaseText style={{color:'#222222',fontWeight:'500',fontSize:16,marginLeft:15}}>
                 {item.item.team}
                </CusBaseText>
              </View>
              <View style = {{flex:1,justifyContent:'center',flexDirection:'row'}}>
                 <View style = {{flex:0.7,flexDirection:'row',alignItems:'center'}}>
                    <CusBaseText style={{color:'#222222',fontWeight:'400',fontSize:15,marginLeft:15}}>
                    {item.item.bet_content}
                    </CusBaseText> 
                    <CusBaseText style={{fontWeight:'400',fontSize:15,color:'red',marginLeft:5}}>
                     @{item.item.new_odds}
                    </CusBaseText>  
                  </View>
                  <View style = {{flex:0.3,justifyContent:'center'}}>
                    <CusBaseText style={{fontWeight:'400',fontSize:15,textAlign:'right',color:winTextColor,marginRight:15}}>
                    {winLabel}
                    </CusBaseText>  
                  </View>
              </View>
              <View style = {{flex:1,justifyContent:'center'}}>
              <CusBaseText style={{color:'#222222',fontWeight:'500',fontSize:16,marginLeft:15}}>
              比赛时间 {moment.unix(item.item.bet_time/1000).format('YYYY-MM-DD HH:mm:ss')}
              </CusBaseText>
              </View>
            
            </View>
          </TouchableOpacity>
    )
  }

  
  _keyExtractor = (item,index) => {
    return String(index);
      }

 ItemSeparatorComponent(){
return(
   <Image
        source={require('./img/ic_xuxianaa.png')}  resizeMode={'stretch'}
          style={{ width: width-80, height: 1,marginLeft:40}}/>
   )
 }
  render() {
    const { navigate } = this.props.navigation;
    
    return (
     
       <FlatList
        style = {styles.container}
        bounces={false}
        automaticallyAdjustContentInsets={false}
        alwaysBounceHorizontal={false}
        data={this.state.detialArray}
        renderItem={item => this._renderItemView(item)}
        showsVerticalScrollIndicator={false} //不显示右边滚动条
        ListHeaderComponent={() => this._createHeaderView()}
        ItemSeparatorComponent = {() => this.ItemSeparatorComponent()}
       ></FlatList>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  cellStyle: {
    width:width-50,
    marginLeft:25,
    height:130,
    backgroundColor:'white',
    shadowColor: 'gray',    // 设置阴影
    shadowOffset: {width:0.5, height: 0.5},
    shadowOpacity: 0.4,   // 透明度
    shadowRadius: 1,
    elevation:2,   //   高度，设置Z轴，可以产生立体效果


  },

 

});
