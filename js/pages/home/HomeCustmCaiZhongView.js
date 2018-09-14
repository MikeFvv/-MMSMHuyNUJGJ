import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    TouchableOpacity,
    FlatList,
    Dimensions,
    StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get("window");
import { CachedImage, ImageCache } from "react-native-img-cache";

export default class HomeCustmCaiZhongView extends Component {
    static navigationOptions = ({ navigation }) => ({
        title:'自定义彩种',
   
         headerStyle: {backgroundColor: COLORS.appColor, marginTop: Android ?(parseFloat(global.versionSDK) > 19?StatusBar.currentHeight:0) : 0},
   
        headerTitleStyle:{color:'white',alignSelf:'center'},
         //加入右边空视图,否则标题不居中  ,alignSelf:'center'
         headerRight: (
             <View style={GlobalStyles.nav_blank_view} />
         ),
        headerLeft: (
               <TouchableOpacity
                   activeOpacity={1}
                   style={GlobalStyles.nav_headerLeft_touch}
                   onPress={() => { navigation.goBack() }}>
                   <View style={GlobalStyles.nav_headerLeft_view} />
               </TouchableOpacity>
           ),
   
     });
  constructor(props) {
    super(props);

    this.state = {
      backupCpicon: false,//是否启用备用彩种地址
      dataSource:AllZhongArray,
    };
  
  }
  componentDidMount() {

  }


  render() {
    return (
          <FlatList
             style = {styles.container}
             data={this.state.dataSource}
             bounces={false}
             renderItem={item => this._renderItemView(item)}
             horizontal={false} //水平还是垂直
             showsVerticalScrollIndicator={false} //不显示右边滚动条
             numColumns={3} //指定多少列
             enableEmptySections={true}
          />
    );

   }

   _renderItemView(item) {
  
      return (

        <TouchableOpacity activeOpacity={1} style={styles.cellStyle}
          onPress={() => this._addCaiZhong(item)}>
          <CachedImage
            source={{
              uri: this.state.backupCpicon ? GlobalConfig.backupCpicon() + item.item.value.tag + '.png' : Cpicon + item.item.value.tag + '.png',
              cache: 'force-cache'
            }}
            style={{ width: 50, height: 50, marginTop: 3 }}
            onError={({ nativeEvent: { error } }) => {
              if (error) {
                this.setState({
                  backupCpicon: true,
                });
              }
            }} />

          <CusBaseText style={{ fontSize: Adaption.Font(15, 15), fontWeight: "400", marginTop: 5 }}>
            {item.item.value.game_name}
          </CusBaseText>
          <CusBaseText
            style={{ fontSize: Adaption.Font(12, 11), fontWeight: "400", color: "#666666", marginTop: 2 }}>
            全天{item.item.value.qishu}期
                    </CusBaseText>
        </TouchableOpacity>
      );


  }

    //
    _addCaiZhong(item) {

     }

  
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor: 'white',
  },

  cellStyle: {
    height: 100,
    width: width / 3,
    backgroundColor: "white",
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth:1,
    borderBottomWidth:1,
    borderColor:'#cccccc',
  },

});

