import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("window");
import BaseNetwork from "../../skframework/component/BaseNetwork"; //网络请求

export default class Preferential extends Component {
  static navigationOptions = ({ navigation }) => ({

      header: (
          <CustomNavBar
              centerText = {"优惠活动"}
              leftClick={() =>  navigation.goBack() }
          />
      ),
  });

  constructor(props) {
    super(props);

    this.state = {
      error: false,
      errorInfo: "",
      preferentialArray: [], //优惠活动数据
      indexArray:[],
      isFristLoadImageEnd:false, //开始进入加载背景图显示标志by：yangqi
    };
    this.noData = 1;
  }

  componentDidMount() {

      this._fetchPreferentialData();
      this.refs.LoadingView && this.refs.LoadingView.showLoading('正在加载中...');
  }



  //获取优惠活动数据
  _fetchPreferentialData() {
    //请求参数
    let params = new FormData();
    params.append("ac", "getGameEventList");

    var promise = BaseNetwork.sendNetworkRequest(params);

    promise
      .then(response => {
        this.setState({isFristLoadImageEnd:true})
        if (response.msg==0) {
          let datalist = response.data;
          let dataBlog = [];
          let i = 0;
         if (response.data==undefined||response.data.length==0) {
             this.noData = 1;
             this.setState({ preferentialArray:[]});
            this.refs.LoadingView && this.refs.LoadingView.cancer();

         }else {
          this.noData =0;
           datalist.map(dict => {
             dataBlog.push({ key: i, value: dict });
             i++;
           });
           //用set去赋值
           this.setState({ preferentialArray: dataBlog});
           datalist = null;
           dataBlog = null;
         }
        }else {
        NewWorkAlert(response.param)
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

  isContains(str, substr) {
    return str.indexOf(substr) >= 0;
  }

  _renderPreferentialItemView(item) {

    const { navigate } = this.props.navigation;//source={{ uri: GlobalConfig.homeEvent() + item.item.value.phone_head }}
    return (//GlobalConfig.homeEvent() + item.item.value.phone_head
      <TouchableOpacity activeOpacity={1} style={styles.cellStyle} onPress={() => navigate('PreferentialDetial',{personString:item.item.value.event_id,personType:item.item.value.type, event_detail: item.item.value.event_detail})} >
        <Image
          source={{ uri:item.item.value.phone_head}}  resizeMode={'stretch'}
          onLoad = {()=> this.refs.LoadingView && this.refs.LoadingView.cancer()}
          style={{ width: width-20, height: 100}}
          onError={({nativeEvent:{error}})=>{
           item.item.value.phone_head = 'http://fcw102.com/Public/view/img/banner_default.jpg'
            this.setState({});
        }}/>

      </TouchableOpacity>
    );
  }
  // //无数据页面
  // _listEmptyComponent() {
  //   if(this.noData==0) {
  //     return null;
  //   }else {
  //   return (
  //     <CusBaseText style={{ textAlign: 'center', marginTop: height / 2 - 100 }}>暂无活动</CusBaseText>
  //   );
  // }
  // }

  //优惠活动
  _preferentialFlatlist() {

    return (
      this.noData!=0?<CusBaseText style={{ textAlign: 'center', marginTop: height / 2 - 100 }}>暂无活动</CusBaseText>:
      <FlatList
        automaticallyAdjustContentInsets={false}
        alwaysBounceHorizontal={false}
        data={this.state.preferentialArray}
      //  ListEmptyComponent={this._listEmptyComponent()} // 没有数据时显示的界面
        renderItem={item => this._renderPreferentialItemView(item)}
      />
    );
  }

  render() {
    const { navigate } = this.props.navigation;
    let textIm = this.state.isFristLoadImageEnd ? null: <Image source =  {require('./img/ic_home_huodong_loadImage.png')}
        style={{resizeMode:'stretch',width:width,height:height  - 49 - 64,position:'absolute',left:0,
            top:0,}} />;
    return (
    <View style={styles.container}>
        {/*第一次进入背景图*/}
       {textIm}
      {this._preferentialFlatlist()}
      <LoadingView ref = 'LoadingView'/>
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
    width: width-20,
    marginLeft:10,
    height: 100,
    backgroundColor: 'white',
    marginVertical: 5, // cell垂直之间的间隔
  },

});
