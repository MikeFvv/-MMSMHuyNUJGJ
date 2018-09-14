import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ImageBackground,
    Image,
} from 'react-native';

class LHCBottomToolView extends Component {

    //构造器
    constructor(props)
    {
        super(props);

        this.state = ({
          isClear:false, //清空按钮是否可以点击
          isAddToCar:false, //加入购物车是否可以点击
          zhuShu: 0,   //注数
          isStop:true,
        })
    }

    //注数改变时再计算
    componentWillReceiveProps(nextProps) {

      //注数为0时底部按钮不能点击
      this.setState({
        isClear:nextProps.isClearBtnEnable,
        isAddToCar:nextProps.isAddToShopBtnEnable,
      })

      if (nextProps.zhuShu != null){

        //当缓存数据没有清空时,点击增加数组
        if (ShopHistoryArr.length != 0){

          if (nextProps.zhuShu == 0){

            this.state.isCanLookUpCar = true;

          }
          else {
            this.state.isCanLookUpCar = false;
          }

        }

        this.setState({
          zhuShu:nextProps.zhuShu,
        });

      }

    }


    render() {
        return (
            <View style={this.props.style}>
              <View style = {{flex:0.25, marginLeft:10, alignItems:'center', justifyContent:'center'}}>
                  <TouchableOpacity activeOpacity={1} onPress = {() => {

                    if (this.state.isClear == true)
                    {
                      if (this.props.clearOnPress)
                      {
                         this.props.clearOnPress();
                      }
                    }

                  }}>
                  <Image style = {styles.bottomToolImageView} source = {this.state.isClear ? (require('../../img/ic_buyLottery_clearEnable.png')):(require('../../img/ic_buyLottery_clearUnable.png'))}></Image>
                  </TouchableOpacity>
              </View>
              <View style = {{flex:0.55, justifyContent:'center', alignItems:'center'}}><CusBaseText style = {styles.bottomTopView_PriceText}>已选择 <CusBaseText style = {styles.bottomTopView_redPriceText}>{this.state.zhuShu}</CusBaseText> 注</CusBaseText></View>
              <View style = {{flex:0.2, marginRight:10, alignItems:'center', justifyContent:'center'}}>
                <TouchableOpacity activeOpacity={1} onPress = {() => {

                  if (this.state.isCanLookUpCar == true){

                      this.props.addOnPress('0'); //查看

                  }else {

                    if (this.state.isAddToCar == true)
                    {
                      if (this.props.addOnPress)
                      {
                         this.props.addOnPress(this.state.zhuShu);
                      }
                    }
                  }
                }}>
                    <Image style = {styles.bottomToolImageView} source = {this.state.isCanLookUpCar == true ? (require('../../img/ic_LookupCar.png')) : this.state.isAddToCar ? (require('../../img/ic_buyLottery_addEnable.png')):(require('../../img/ic_buyLottery_addUnable.png'))}></Image>
                </TouchableOpacity>
              </View>
          </View>
        );
    }
}

const styles = StyleSheet.create({

    bottomTopView_PriceText:{
      color:'white',
      fontSize:Adaption.Font(17,15),
      marginTop:3,
    },

    bottomTopView_redPriceText:{
      color:'red',
      fontSize:Adaption.Font(16,14),
    },

    bottomToolImageView:{
        width:Adaption.Width(80),
        height:Adaption.Height(36),
        borderRadius:5
    },

});

export  default  LHCBottomToolView;
