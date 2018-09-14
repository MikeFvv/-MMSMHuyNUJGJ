import React, { Component } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("window");
const KAdaptionHeight = height / 736;
import Adaption from "../../skframework/tools/Adaption"; //字体适配


export default class NewestWinBang extends Component {
  static navigationOptions = ({ navigation }) => ({


      header: (
          <CustomNavBar
              leftClick={() =>  navigation.goBack() }
              centerText = {"中奖榜"}
          />
      ),


  });



  _renderWinBangItemView(item) {
    let winName = '';
    winName = item.item.value.username.substr(0,3);
      return (
        <View style={{height:40*KAdaptionHeight,width: width ,flexDirection: "row",justifyContent: "center",alignItems: "center"}}>
          <View style={{ flex: 1, flexDirection: "row",justifyContent: "center",alignItems: "center" }}>
            <CusBaseText style={{color: "#222222",fontSize: Adaption.Font(14, 13),textAlign: "center"}}>
              {winName}***
            </CusBaseText>
          </View>
          <View style={{flex:1}}>
            <CusBaseText style={{color: "#eb3349",fontSize: Adaption.Font(14, 13),textAlign: "center",}}>
              喜中{item.item.value.win}元
            </CusBaseText>
          </View>
          <View style={{flex:1}}>
            <CusBaseText style={{color: "#9e9e9e",fontSize: Adaption.Font(14, 13),textAlign: "center"}}>
              {item.item.value.gamename}
            </CusBaseText>
          </View>
        </View>
      );
  }
  _listWinHeaderComponent(){
    return(
      <View style = {{flexDirection:'row',width:width,height:44*KAdaptionHeight,justifyContent:'center',alignItems:'center',backgroundColor:'#eeeeee'}}>
        <CusBaseText style = {{flex:1,fontSize:15,color:'#222222',fontWeight:'400',textAlign:'center'}}>
          用户名
        </CusBaseText>
        <CusBaseText style = {{flex:1,fontSize:15,color:'#222222',fontWeight:'400',textAlign:'center'}}>
          中奖金额
        </CusBaseText>
        <CusBaseText style = {{flex:1,fontSize:15,color:'#222222',fontWeight:'400',textAlign:'center'}}>
          彩种
        </CusBaseText>
      </View>
    )
  }

  _moreNotificationFlatlist() {
    return (
      <FlatList
        automaticallyAdjustContentInsets={false}
        alwaysBounceHorizontal = {false}
        data={this.props.navigation.state.params.footWinArray}
        renderItem={item => this._renderWinBangItemView(item)}
      />
    );
  }

  render() {
    const { navigate } = this.props.navigation;
    return  <View style={styles.container}>
       {this._listWinHeaderComponent()}
        {this._moreNotificationFlatlist()}
      </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },


});
