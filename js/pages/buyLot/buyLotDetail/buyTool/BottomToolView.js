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

class BottomToolView extends Component {

    //构造器
    constructor(props)
    {
        super(props);

        this.state = ({
          isYuanSelect:true,  //元是否选择，默认选择
          isJiaoSelect:false, //角是否选择
          isFenSelect:false,  //分是否选择
          isClear:false, //清空按钮是否可以点击
          isAddToCar:false, //加入购物车是否可以点击
          zhuShu: 0,   //注数
          price: 0.00,    //总价
          singlePrice: 2, //单价
          defaultPrice: '2', //默认价格，切换时重置
          isCanLookUpCar:false, //是否查看购物车
        })
    }

    //注数改变时再计算
    componentWillReceiveProps(nextProps) {

        this.setState({
          isClear:nextProps.isClearBtnEnable,
          isAddToCar:nextProps.isAddToShopBtnEnable,
        })

        if (nextProps.zhuShu != null)
        {
          //当缓存数据没有清空时,点击增加数组
          if (global.ShopHistoryArr.length != 0){

            if (nextProps.zhuShu == 0){

              this.state.isCanLookUpCar = true;

            }
            else {
              this.state.isCanLookUpCar = false;
            }

          }

           this._caculatePrice(nextProps.zhuShu, this.state.singlePrice);
        }
    }

    _caculatePrice(zhushu, price){

      //价格计算
      let  totalprice = Math.floor((zhushu* price) * 100) / 100;  //保留两位小数

      this.setState({
          price: totalprice,
          zhuShu:zhushu,
      })
    }

    render() {

        return (
            <View style={this.props.style}>
                <View style = {styles.bottomTopView}>
                    <View style = {{flex:0.45, justifyContent:'center', marginRight:5}}><CusBaseText style = {[styles.bottomTopView_PriceText, {textAlign:'right'}]}>共<CusBaseText style = {styles.bottomTopView_redPriceText}>{this.state.zhuShu}</CusBaseText>注, 单价</CusBaseText></View>
                    <View style = {{flex:0.15, justifyContent:'center'}}>
                      <TextInput
                        returnKeyType="done"
                        keyboardType={global.iOS?'number-pad':'numeric'}
                        style = {styles.bottomTopView_PriceTextInput}
                        onChangeText={(text) =>  {

                            if (text == NaN){

                                text = 0;
                            }

                            this.state.defaultPrice = text;

                            //Fix Bug 单价输入框里显示不变，防止用户输入单位改变计算错误，只改变总价, 根据单位重新计算单价和总价。
                            switch (global.LastSelectUnit){

                                case 0:

                                    text = text;
                                    break;

                                case 1:

                                    text = text/10;
                                    break;


                                case 2:

                                    text = text/100;
                                    break;

                            }

                            this.setState({singlePrice:text});
                            this._caculatePrice(this.state.zhuShu, text);

                        }}
                        underlineColorAndroid='transparent'
                        defaultValue = {'2'}
                        maxLength = {6}
                        >
                      </TextInput>
                    </View>
                    <View style = {{flex:0.40, justifyContent:'center'}}><CusBaseText style = {[styles.bottomTopView_PriceText, {textAlign:'left'}]}> 共<CusBaseText style = {styles.bottomTopView_redPriceText}>{this.state.price}</CusBaseText>元</CusBaseText></View>
                </View>
                <View style = {styles.bottomToolView}>
                    <View style = {{flex:0.25, height:Adaption.Height(40), marginLeft:10, justifyContent:'center'}}>
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
                    <View style = {{flex:0.55, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                        <TouchableOpacity activeOpacity={1} onPress = {() => {

                            if (this.state.isYuanSelect == false)
                            {
                              let price = 0;

                              switch (global.LastSelectUnit)
                              {

                                case 1:

                                  price = this.state.singlePrice*10; //上次单位是角

                                break;

                                case 2:

                                  price = this.state.singlePrice*100; //上次单位是分

                                break;

                                default:
                                break;
                              }

                              this.setState({

                                  singlePrice:price,
                              })

                              this._caculatePrice(this.state.zhuShu, price);
                            }

                             if (this.state.isYuanSelect == false){

                               this.setState({
                                   isYuanSelect:!this.state.isYuanSelect,
                                   isJiaoSelect:this.state.isYuanSelect,
                                   isFenSelect:this.state.isYuanSelect,
                                 });

                                 global.LastSelectUnit = 0;
                             }

                            }}>
                            <ImageBackground style = {styles.unnitImageStyle} resizeMode='cover' source = {this.state.isYuanSelect == true ? (require('../../img/ic_unnitDidSelect.png')):(require('../../img/ic_unnitUnSelect.png'))}>
                                <CusBaseText style = {{backgroundColor:'rgba(0,0,0,0)', color: this.state.isYuanSelect == true ? 'white':'rgba(29,30,31,1)', fontSize:Adaption.Font(17,15)}}>元</CusBaseText>
                            </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity  activeOpacity={1} onPress = {() => {

                              if (this.state.isJiaoSelect == false)
                              {
                                let price = 0;

                                switch (global.LastSelectUnit)
                                {
                                  case 0:

                                    price = this.state.singlePrice/10; //上次单位是元

                                  break;

                                  case 2:

                                    price = this.state.singlePrice*10; //上次单位是分

                                  break;

                                  default:
                                  break;
                                }

                                this.setState({

                                    singlePrice:price,
                                })

                                this._caculatePrice(this.state.zhuShu, price);
                              }

                             if  (this.state.isJiaoSelect == false) {

                              this.setState({
                                  isYuanSelect:this.state.isJiaoSelect,
                                  isJiaoSelect:!this.state.isJiaoSelect,
                                  isFenSelect:this.state.isJiaoSelect,
                                });

                                global.LastSelectUnit = 1;
                              }
                        }}>
                          <ImageBackground style = {styles.unnitImageStyle} resizeMode='cover' source = {this.state.isJiaoSelect == true ? (require('../../img/ic_unnitDidSelect.png')):(require('../../img/ic_unnitUnSelect.png'))}>
                              <CusBaseText style = {{backgroundColor:'rgba(0,0,0,0)', color: this.state.isJiaoSelect == true ? 'white':'rgba(29,30,31,1)', fontSize:Adaption.Font(17,15)}}>角</CusBaseText>
                          </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity  activeOpacity={1} onPress = {() => {

                          if (this.state.isFenSelect == false)
                          {
                            let price = 0;

                            switch (global.LastSelectUnit)
                            {
                              case 0:

                                price = this.state.singlePrice/100; //上次单位是元

                              break;

                              case 1:

                                price = this.state.singlePrice/10; //上次单位是角

                              break;

                              default:
                              break;
                            }

                            this.setState({

                                singlePrice:price,
                            })

                            this._caculatePrice(this.state.zhuShu, price);
                          }

                          if (this.state.isFenSelect == false) {

                            this.setState({
                              isFenSelect:!this.state.isFenSelect,
                              isYuanSelect:this.state.isFenSelect,
                              isJiaoSelect:this.state.isFenSelect,
                            });

                            global.LastSelectUnit = 2;
                        }

                          }}>
                            <ImageBackground style = {styles.unnitImageStyle} resizeMode='cover' source = {this.state.isFenSelect == true ? (require('../../img/ic_unnitDidSelect.png')):(require('../../img/ic_unnitUnSelect.png'))}>
                                <CusBaseText style = {{backgroundColor:'rgba(0,0,0,0)', color: this.state.isFenSelect == true ? 'white':'rgba(29,30,31,1)', fontSize:Adaption.Font(17,15)}}>分</CusBaseText>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                    <View style = {{flex:0.2, height:Adaption.Height(40), marginRight:10, justifyContent:'center'}}>
                      <TouchableOpacity activeOpacity={1} onPress = {() => {

                        if (this.state.isCanLookUpCar == true){
                            this.props.addOnPress('0','0','0'); //查看购物车
                        }else {

                          if (this.state.isAddToCar == true){
                            if (this.props.addOnPress)
                            {
                               this.props.addOnPress(this.state.price, this.state.singlePrice, this.state.zhuShu); //总价格, 单注价格, 选的注数
                            }
                          }
                        }

                      }}>
                        <Image style = {styles.bottomToolImageView} source = {this.state.isCanLookUpCar == true ? (require('../../img/ic_LookupCar.png')) : this.state.isAddToCar == true ? (require('../../img/ic_buyLottery_addEnable.png')):(require('../../img/ic_buyLottery_addUnable.png'))}>
                        </Image>
                      </TouchableOpacity>
                  </View>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({

    bottomTopView:{
      height:30,
      flexDirection:'row',
      backgroundColor:'#fff'
    },

    bottomTopView_PriceText:{
      color:'black',
      fontSize:Adaption.Font(17,15),
      marginTop:3,
    },

    bottomTopView_redPriceText:{
      color:'red',
      fontSize:Adaption.Font(16,14),
    },

    bottomTopView_PriceTextInput:{
        width:Adaption.Width(60),
        height:24,
        borderColor:'lightgrey',
        borderRadius:5,
        borderWidth:1.0,
        textAlign:'center',
        fontSize:Adaption.Font(16,14),
        padding:0,   //输入框必须加这个，要不然安卓会显示不全
    },

    bottomToolView:{
      height:50,
      backgroundColor:'rgba(29,30,31,1)',
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center',
    },

    bottomToolImageView:{
        width:Adaption.Width(80),
        height:Adaption.Height(36),
        borderRadius:5
    },

    unnitImageStyle:{
        width:Adaption.Width(40),
        height:Adaption.Width(40),
        marginLeft:10,
        marginRight:10,
        justifyContent:'center',
        alignItems:'center',
    }

});

export  default  BottomToolView;
