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
import moment from 'moment';

export default class MoreNotification extends Component {
  static navigationOptions = ({ navigation }) => ({

      header: (
          <CustomNavBar
              centerText = {'公告'}
              leftClick={() =>  navigation.goBack() }
          />
      ),

  });

  constructor(props) {

    super(props);
    this.titleHeight=0;
    this.state = {
      notiArray:[], //公告数据
      itemHeight:90,
    };
    this.cellHeight = 90;
  }
  componentDidMount() {
    this.setState({
      notiArray: this.props.navigation.state.params.notiArray,
    })
  }

  //动态改变cell的高度
  _onTouchStart(e) {
    let descHeight = e.nativeEvent.layout.height;
    totalHeight = descHeight + 60 > 80 ? descHeight + 80 : 100;
    this.cellHeight = totalHeight;
  }
  _decipher(val) {
   
    let valByte = [];
    let keyByte = [`0`.charCodeAt(0)]; // 48

    for (let a = 0; a < val.length; a++) {
        valByte.push( parseInt(val[a], 16));
    }
 

    if (valByte.length % 2 != 0) {
        return;
    }

    let tempAr = [];
    for (let i = 0; i < valByte.length; i+=2) {
        tempAr.push( valByte[i] << 4 | valByte[i + 1] );
    }


    for (let a = 0; a < tempAr.length; a++) {
        for (let b = keyByte.length - 1; b >= 0; b--) {
            tempAr[a] = tempAr[a] ^ keyByte[b];
        }
    }
    
    var str = '';
    for (var i = 0; i < tempAr.length; i++) {
        str += String.fromCharCode(tempAr[i]);
    }
    return decodeURIComponent(escape(str));

}

  _renderNotificationItemView(item) {
    let preg = /^[A-Za-z0-9]+$/;
    let is = preg.test(item.item.content);
    let notificationContent = '';
    if(is==true){
      notificationContent =  this._decipher(item.item.content);
    }else {
      notificationContent = item.item.content;
    }

      return (

        <TouchableOpacity ref={(h) => this._refMessageView = h} style={styles.cellStyle}
          activeOpacity={1} >

          <View style={{ flex: 1, flexDirection: 'column', padding: 5 }}>
            <CusBaseText style ={{marginLeft:10,marginTop:5,color:'red',fontSize:14,textAlign:'center'}} >
               系统公告
            </CusBaseText>
            <CusBaseText style={styles.itemTextStyke} onLayout={(e) => this._onTouchStart(e)}>
              {notificationContent}
            </CusBaseText>
            <View style = {{height:1,backgroundColor:'#cdcdcd',marginTop:10}}>
            </View>
            <CusBaseText style = {{marginLeft:10,color:'#999999',fontSize:12,marginTop:5}}>
               [系统公告]{moment.unix(item.item.send_time).format('YYYY-MM-DD HH:mm:ss')}
            </CusBaseText>
          </View>
        </TouchableOpacity>

      );
  }

  _renderItemView(item) {
      return (
        <TouchableOpacity activeOpacity={1} style = {{marginVertical: 5,flexDirection:'row',}}>
           <View style = {{width:1,height:height-64,backgroundColor:'#cdcdcd',marginTop:-15,marginLeft:30}}>
           </View>
           <Image style = {{width:50,height:50,marginLeft:-20}} source={require("./img/ic_rili.png")}>
           </Image>
        </TouchableOpacity>
      );
  }


  _moreNotificationFlatlist() {

    if (this.state.isLoading && !this.state.error) {
      return this.renderLoadingView();
    } else if (this.state.error) {
      return this.renderErrorView(this.state.errorInfo);
    }

    return (
      <FlatList
        automaticallyAdjustContentInsets={false}
        alwaysBounceHorizontal = {false}
        data={this.state.notiArray}
        renderItem={item => this._renderNotificationItemView(item)}
      />
    );
  }

  _moreFlatlist() {

    if (this.state.isLoading && !this.state.error) {
      return this.renderLoadingView();
    } else if (this.state.error) {
      return this.renderErrorView(this.state.errorInfo);
    }

    return (
      <FlatList
        scrollEnabled = {false}
        automaticallyAdjustContentInsets={false}
        alwaysBounceHorizontal = {false}
        data={this.state.notiArray}
        renderItem={item => this._renderItemView(item)}
      />
    );
  }

  render() {
    const { navigate } = this.props.navigation;
    return  <View style={styles.container}>
        <View style = {{flex:0.15}}>
        {this._moreFlatlist()}
        </View>
        <View style = {{flex:0.85}}>
          {this._moreNotificationFlatlist()}
        </View>
      </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'row',
    backgroundColor: 'rgb(222,222,222)'
  },
  cellStyle: {
    width: width - 80,
    marginLeft: 10,
    height: this.cellHeight,
    marginVertical: 5, // cell垂直之间的间隔
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cdcdcd',

    backgroundColor:'white'
  },

  itemTextStyke: {
    fontSize: 13,
    marginTop: 5,
    color:'#222222',
    marginLeft:10
  },
  lineStyle: {
    width: width / 3,
    height: 2,
    backgroundColor:COLORS.appColor,
  },

});
