import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SectionList,
} from "react-native";

export default class LiShiDailyAtten extends Component {
  static navigationOptions = ({ navigation }) => ({

    header: (
        <CustomNavBar
            centerText = {"领取记录"}
            leftClick={() =>  navigation.goBack() }
        />
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      liShiArray: [{title: '本月', isHide: false, sectionID: 0, data: []}, {title: '上月', isHide: true, sectionID: 1, data: []}, {title: '上上月', isHide: true, sectionID: 2, data: []} ],
    };
    this.lasttime = 0; //0=当天, 1=最近一周, 2=最近一个月, 3=最近三个月, 默认为当天
  }

  componentDidMount() {
    this._fetchPreferentialData(this.lasttime);
  }

  _fetchPreferentialData(timeID) {

      let loginObject = global.UserLoginObject;
      //请求参数
      let params = new FormData();
      params.append("ac", "UserSignAwardLog");
      params.append("uid", loginObject.Uid);
      params.append("token",loginObject.Token);
      params.append("date", timeID);
      params.append("sessionkey",global.UserLoginObject.session_key);

      var promise = GlobalBaseNetwork.sendNetworkRequest(params);
      promise
        .then(response => { 

          if (response.msg == 0 && response.data.length > 0) {
            this.state.liShiArray[timeID].data = response.data;
          }

          if (timeID < 2) {
            this.lasttime += 1;
            this._fetchPreferentialData(this.lasttime);

          } else {
            this.setState({ 
              liShiArray: this.state.liShiArray, 
              isLoading: false,
            });
          }
      })
      .catch(err => { });
  }

  _renderItemView(item) {

    if (item.section.isHide) { // 隐藏
      return null;
    }

    const { navigate } = this.props.navigation;
    let yanse = item.item.status == '已领取' ? 'gray' : 'red';
    return (
      <TouchableOpacity activeOpacity={1} style={styles.cellStyle} >
        <View style={{flex:1,flexDirection:'column'}}>
         <CusBaseText style = {{marginLeft:15,marginTop:10,flex:0.6,fontSize:17,color:'#222222',}}>签到{item.item.sign_days}天奖励</CusBaseText>
          <CusBaseText style = {{marginLeft:15,flex:0.4,fontSize:14,textAlign:'left',color:yanse}}>{item.item.status}</CusBaseText>
        </View>
       
        <View style={{flex:1,flexDirection:'column'}}>
          <CusBaseText style = {{marginRight:15,marginTop:10,flex:0.6,fontSize:16,textAlign:'right',color:'rgba(0,153,68,1)'}}>{item.item.reward_price}元{item.item.price_type}</CusBaseText>
          <CusBaseText style = {{marginRight:15,flex:0.4,fontSize:14,textAlign:'right',color:'#666666'}}>{item.item.uptime}</CusBaseText>
        </View>
      </TouchableOpacity>
    );
  }

  // item之间的分隔线组件
  _itemSeparatorComponent(item) {
    // 如果是隐藏 返回null
    return item.section.isHide ? null : <View style={{ height: 1, width: SCREEN_WIDTH, backgroundColor: '#eeeeee' }}></View>
}

//   // 每个section之间的分隔组件
//   _sectionSeparatorComponent() {
//     return <View style={{height: 0.5, width: SCREEN_WIDTH, backgroundColor: '#d2d2d2'}}></View>
// }

  _renderSectionHeader(section) {
    return(
      <TouchableOpacity activeOpacity={0.8} style={{height: 45, width: SCREEN_WIDTH, backgroundColor: 'rgb(243,243,243)'}} 
          onPress={() => {

              this.state.liShiArray[section.section.sectionID].isHide = !this.state.liShiArray[section.section.sectionID].isHide;
              this.setState({
                liShiArray: this.state.liShiArray,
              })
          }}>
        <View style = {{flex:1,flexDirection: 'row',alignItems:'center'}}>
          <Image style={{width: 15, height: 15,marginLeft:15}} 
                  source={require('./img/ic_quanquan.png')}
          ></Image>
          
          <View style={{flex: 0.9,marginLeft:10}}>
              <CusBaseText style={{fontSize:17,color:'#222222'}}>{section.section.title}</CusBaseText>
          </View>
          <View style={{flex: 0.1}}>
              <Image style={{width: 13, height: 13}} 
                  source={ section.section.isHide ? require('./img/ic_shangjiantou.png') : require('./img/ic_xiajiantou.png')}
              ></Image>
          </View>
        </View>
        <View style={{width:SCREEN_WIDTH,height:0.7, backgroundColor:'#d2d2d2'}}></View>
      </TouchableOpacity>
    )
  }
  //无数据页面
  _listEmptyComponent() {
    return (
      <CusBaseText style={{ textAlign: 'center', marginTop: SCREEN_HEIGHT / 2 - 100 }}>暂无领取记录</CusBaseText>
    );
  }


  render() {
    const { navigate } = this.props.navigation;
    return(
      <View style={styles.container}>
        <View style ={styles.container}>
          <SectionList style={{}}
              ItemSeparatorComponent={(item) => this._itemSeparatorComponent(item)}  // 行之间的分隔线
           
              renderSectionHeader={(section) => this._renderSectionHeader(section)} // section头部的视图
              renderItem={(item) => this._renderItemView(item)}
              sections={this.state.liShiArray}
              keyExtractor={(item,index)=>{return String(index)}}  // 为每个Item生成一个key
              ListEmptyComponent={this._listEmptyComponent()} // 没有数据时显示的界面
          >
          </SectionList>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  cellStyle: {
    width: SCREEN_WIDTH,
    height: 60,
    alignItems:'center',
    flexDirection:'row',
    backgroundColor: 'white',
    marginVertical: 1, // cell垂直之间的间隔
  },

});
