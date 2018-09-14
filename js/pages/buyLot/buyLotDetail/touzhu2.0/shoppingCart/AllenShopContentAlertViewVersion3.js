/**
 Author Ward
 Created by Allen on 2018-03-14 16:45
 dec 新版加入购物车弹窗
 **/

import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Text,
    Modal,
    FlatList,
    Animated,
    TextInput
} from 'react-native';

import Toast, { DURATION } from 'react-native-easy-toast'  //土司视图
let iphoneX = SCREEN_HEIGHT == 812 ? true : false;
let iphone5S = SCREEN_WIDTH == 320 ? true : false;
let iphone6 = SCREEN_HEIGHT == 667 ? true : false;
export default class ShopContentAlertView extends Component {

    constructor(props){
        super(props);

        this.state = ({
            isShow:false,
            ballSourceArr:[],
            zhuShuNum:props.pickZhuShu,  //总的注数
            currentQiShu:props.qiShuNum, //当前期数
            currentGameName:props.caiZhongName, //当前彩种名称
            subTotalPrice:0.00,  //总的金额
            willWinPrice:0.00,  //预计盈利金额
            moneyText: '', // 当前文本框显示的文本
            defaultMoneyText: `输入金额`,
            isShowKeyboardView: true, // 是否显示键盘
            currentJsTag:props.jstag, //当前玩法tag
            caculateType:0,      //计算盈利类型 0 最大赔率， 1  逐行单注, 每行中一注,最多中N注， 2 单行多注, 限制最大注数.
            slectMutipleOne:'1',
            slectMutipleTwo:'1',
            isYuan:true,
            isShowListView:props.isGF!=0,

        })

        // 优先判断1-5分彩，再判断双面/官方玩法,新彩种全部改成一键购买
        let ffsf = props.tag.indexOf('ff') == 0 || props.tag.indexOf('sf') == 0 || props.tag.indexOf('wf') == 0 || props.tag == 'jdtxyx' || props.tag == 'jdxypk' || props.tag == 'xyqxc' || props.tag == 'jdxync';
        // isGF: 双面1，官方0。
        this.isShowOneKey = ffsf || (!ffsf && props.isGF == 1); // 一键购买。 成立条件：分分三分彩 或 (非分分三分 && 双面)

    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.dataArr.length != 0 && nextProps.playData && nextProps.playData.wanfa && nextProps.jstag != null){

            this.setState({
                isShow:nextProps.visiable,
                ballSourceArr:nextProps.dataArr,
                zhuShuNum:nextProps.pickZhuShu,
                currentQiShu:nextProps.qiShuNum,
                currentGameName:nextProps.caiZhongName,
                currentPlayData:nextProps.playData,
                moneyText: '', // 当前文本框显示的文本
                defaultMoneyText: `输入金额`,
                isShowKeyboardView: true, // 是否显示键盘
                currentJsTag:nextProps.jstag,
                isShowListView:nextProps.isGF!=0,
            });

            this._caculateSubTotal(nextProps.dataArr, nextProps.playData, nextProps.jstag, 0);
        }
        else if (nextProps.visiable == false) {//自动关闭后

            this.setState({
                isShow:nextProps.visiable,
                isShowKeyboardView: false, // 是否显示键盘
            })
        }

        // 优先判断1-5分彩，再判断双面/官方玩法,新彩种全部改成一键购买
        let ffsf = nextProps.tag.indexOf('ff') == 0 || nextProps.tag.indexOf('sf') == 0 || nextProps.tag.indexOf('wf') == 0 || nextProps.tag == 'jdtxyx' || nextProps.tag == 'jdxypk' || nextProps.tag == 'xyqxc' || nextProps.tag == 'jdxync';
        this.isShowOneKey = ffsf || (!ffsf && nextProps.isGF == 1); // 一键购买。 成立条件：分分三分彩 或 (非分分三分 && 双面)

    }

    //计算总金额和盈利
    _caculateSubTotal(dataSource, playData, js_tag, price) {

        if (price == null || price == 0) {
            this.setState({
                subTotalPrice: '0.00',
                willWinPrice: '0.00',
            })
            return;
        }

        let totalPrice = 0;  // 投注总金额
        let maxPeilv = 0;    // 单注最高赔率... 只需要最高的那个赔率

        if (dataSource.length == 1 || (dataSource[0].value.peilv != null && dataSource[0].value.peilv.includes('|'))) {

            if (dataSource[0].value.peilv != null && dataSource[0].value.peilv.includes('|')) {
                let peilvAr = dataSource[0].value.peilv.split('|');  //多个赔率的。
                maxPeilv = peilvAr[0]; 
                if (parseFloat(peilvAr[1]) > parseFloat(peilvAr[0])) {  // 六合彩 三中二
                    maxPeilv = peilvAr[1];
                }
            
            } else {
                maxPeilv = dataSource[0].value.peilv;
            }
        } else {
            //冒泡排序法拿到最高的peilv
            for (let i = 0; i < dataSource.length - 1; i++) {
                for (let j = 0; j < dataSource.length - i - 1; j++) {
                    if (parseFloat(dataSource[j].value.peilv) < parseFloat(dataSource[j + 1].value.peilv)) {
                        let temp = dataSource[j];
                        dataSource[j] = dataSource[j + 1];
                        dataSource[j + 1] = temp;
                    }
                }
            }
            maxPeilv = dataSource[0].value.peilv;
        }

        // 计算总金额
        for (let i = 0; i < dataSource.length; i++) {
            let shopModel = dataSource[i].value;
            totalPrice += shopModel.singlePrice * shopModel.zhushu;
        }
        
        maxPeilv = parseFloat(maxPeilv);
        winPrice = price * maxPeilv * 1;  // 单价 * 最高赔率 * 注数(只要单注)
        totalPrice = totalPrice.toFixed(2);
        winPrice = winPrice.toFixed(2);

        this.setState({
            subTotalPrice: totalPrice,
            willWinPrice: winPrice,
        })
    }


    //每个数据输入统一金额
    _resetSinglePrie(price){
        if (price == '') {
            price = 0;
        }
        for (let shopModel  of this.state.ballSourceArr) {
            shopModel.value.singlePrice = (Number.parseFloat || parseFloat)(price, 10);
            shopModel.value.totalPrice = (Number.parseFloat || parseFloat)(price, 10) * shopModel.value.zhushu;
        }

        this._caculateSubTotal(this.state.ballSourceArr, this.state.currentPlayData, this.state.currentJsTag, (Number.parseFloat || parseFloat)(price, 10));
        this.setState({ballSourceArr:this.state.ballSourceArr});
    }

    render() {

        return (
            <Modal
                visible={this.state.isShow}
                animationType={'slide'}
                transparent={true}
                onRequestClose={() => {}}
            >
                <View style = {{flex:1, backgroundColor:'rgba(0,0,0,0.2)', alignItems:'center', justifyContent:'center'}}>
                    <View style = {{ marginBottom: Adaption.Height(10), marginTop: SCREEN_HEIGHT - Adaption.Height((this.state.isShowListView ? 380 : 360) + 270 + 10) - (iphoneX ? 34 : 0) , borderRadius:5, backgroundColor:'#fff', height: Adaption.Height(this.state.isShowListView ? 380 : 360), width: SCREEN_WIDTH - Adaption.Width(40)}}>
                        
                        <View style={{ height: Adaption.Height(65), alignItems:'center'}}>
                            {this.isShowOneKey 
                                ? <View style={{ flexDirection:'row' }}>
                                    <View style={{flex: 0.1}}></View>
                                    <View style={{flex: 0.8, alignItems:'center', justifyContent:'center'}}>
                                        <View style={{ marginTop: Adaption.Height(5), height: Adaption.Height(30), alignItems:'center', justifyContent:'center'}}>
                                            <Text allowFontScaling={false} style={{ color:'#171717', fontSize:Adaption.Font(19,16) }}>{this.state.currentGameName}</Text>
                                        </View>
                                        <View style={{height: Adaption.Height(25)}}>
                                            <Text allowFontScaling={false} style={{ color:'#919191', fontSize:Adaption.Font(17,14) }}>第 <Text allowFontScaling={false} style={{color:'#F00', fontSize: Adaption.Font(18, 15)}}>{this.state.currentQiShu}</Text> 期</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={{flex: 0.1, marginTop: Adaption.Height(20)}} activeOpacity={1} onPress={() => {this.setState({isShow:false,slectMutipleOne:'1',slectMutipleTwo:'1'}); this.props.closeClick ? this.props.closeClick() : null}}>
                                        <Image style={{width: 20, height: 20}} source={require('../../../img/ic_buyLotClose.png')}></Image>
                                    </TouchableOpacity>
                                </View>
                                :<View>
                                    <View style={{ marginTop: Adaption.Height(5), height: Adaption.Height(30), alignItems:'center', justifyContent:'center'}}>
                                        <Text allowFontScaling={false} style={{ color:'#171717', fontSize:Adaption.Font(19,16) }}>{this.state.currentGameName}</Text>
                                    </View>
                                    <View style={{height: Adaption.Height(25)}}>
                                        <Text allowFontScaling={false} style={{ color:'#919191', fontSize:Adaption.Font(17,14) }}>第 <Text allowFontScaling={false} style={{color:'#F00', fontSize: Adaption.Font(18, 15)}}>{this.state.currentQiShu}</Text> 期</Text>
                                    </View>
                                </View>
                            }
                            <Image style={{ height: 1, width: SCREEN_WIDTH - Adaption.Width(60), marginTop: Adaption.Height(3) }} source={require('../../../img/ic_dottedLine.png')}/>
                        </View>

                        {this.state.isShowListView
                            ? <FlatList
                                automaticallyAdjustContentInsets={false}
                                alwaysBounceHorizontal = {false}
                                data = {this.state.ballSourceArr ? [{key:'1',name:'allen'}]: null}
                                renderItem = {(item)=>this._renderItemBallNumberView(item)}
                                horizontal = {false}
                            >
                            </FlatList>
                            : <View style={{ height: Adaption.Height(20) }}></View>
                        }

                        <View style={{ marginLeft: (iphone5S?Adaption.Width(21):Adaption.Width(28)), height: Adaption.Height(40), flexDirection:'row', alignItems:'center' }}>
                            <Text allowFontScaling={false} style={{ fontSize:Adaption.Font(17,14) }}>单注金额： </Text>
                            <TouchableOpacity activeOpacity={1} style = {{ borderColor: '#d3d3d3', borderWidth: 1, borderRadius: 3, alignItems:'center', flexDirection:'row', height: Adaption.Height(40), width: Adaption.Width(130) }}
                                onPress = {()=> {
                                    this.setState({
                                        isShowKeyboardView:true,
                                    })
                                }}>
                                <AllenFadeInView ref='AllenFadeInViewC' hasContent={this.state.isShow ?false:true} style={{position:'absolute',left:Adaption.Width(10),width:2,height:Adaption.Height(24),top:Adaption.Height(8),backgroundColor:'#456FEE'}}>
                                </AllenFadeInView>
                                <Text onLayout={(e)=>{ this._onLayout(e);}} allowFontScaling={false} style = {{color:this.state.moneyText.length <= 0 ? '#888' : '#000', marginLeft:15, fontSize:Adaption.Font(16,13)}}>
                                    <Text>{this.state.moneyText.length <= 0 ? this.state.defaultMoneyText : this.state.moneyText}</Text>
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={0.8}
                                style={{ borderColor: '#d3d3d3', borderWidth: 1, borderRightWidth:0, width: Adaption.Width(40), height: Adaption.Width(35),marginLeft:Adaption.Width(30),backgroundColor:this.state.isYuan?'#e33939':'white'}}
                                onPress={() => {
                                    this.state.isYuan = true;
                                    {/* if(this.state.moneyText == '') { return }; */}
                                    this._resetSinglePrie(this.state.isYuan?this.state.moneyText:(this.state.moneyText*0.1).toFixed(2));
                                }}>
                                <View style={{ alignItems: 'center',justifyContent:'center',flex:1}}>
                                    <Text allowFontScaling={false} style={{ color: this.state.isYuan?'white':'#434343', fontSize: Adaption.Font(17)}}>元</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={0.8}
                                style={{borderColor: '#d3d3d3', borderWidth: 1,borderLeftWidth:1, width: Adaption.Width(40), height: Adaption.Width(35),backgroundColor:this.state.isYuan?'white':'#e33939'}}
                                onPress={() => {
                                    this.state.isYuan = false;
                                    {/* if(this.state.moneyText == '') { return }; */}
                                    this._resetSinglePrie(this.state.isYuan?this.state.moneyText:(this.state.moneyText*0.1).toFixed(2));
                                }}>
                                <View style={{ alignItems: 'center',justifyContent:'center',flex:1}}>
                                    <Text allowFontScaling={false} style={{color:  this.state.isYuan?'#434343':'white', fontSize: Adaption.Font(17)}}>角</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style = {{height:Adaption.Height(this.state.isShowListView ? 60 : 80), flexDirection:'row',justifyContent:'space-around', alignItems:'center'}}>
                            <TouchableOpacity activeOpacity={0.8} style={styles.moneyButton}
                                onPress={() => {
                                    this.setState({moneyText:'50'});
                                    this._resetSinglePrie(this.state.isYuan?'50':'5');
                                }}>
                                <Text allowFontScaling={false} style={{ color: '#434343', fontSize: Adaption.Font(17) }}>￥50</Text>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={0.8} style={styles.moneyButton}
                                onPress={() => {
                                    this.setState({moneyText:'100'});
                                    this._resetSinglePrie(this.state.isYuan?'100':'10');
                                }}>
                                <Text allowFontScaling={false} style={{ color: '#434343', fontSize: Adaption.Font(17) }}>￥100</Text>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={0.8} style={styles.moneyButton}
                                onPress={() => {
                                    this.setState({moneyText:'200'});
                                    this._resetSinglePrie(this.state.isYuan?'200':'20');
                                }}>
                                <Text allowFontScaling={false} style={{ color: '#434343', fontSize: Adaption.Font(17) }}>￥200</Text>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={0.8} style={styles.moneyButton}
                                onPress={() => {
                                    this.setState({moneyText:'500'});
                                    this._resetSinglePrie(this.state.isYuan?'500':'50');
                                }}>
                                <Text allowFontScaling={false} style={{ color: '#434343', fontSize: Adaption.Font(17) }}>￥500</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={{height:1, width:SCREEN_WIDTH - Adaption.Width(40), backgroundColor:'lightgrey'}}></View>

                        <View style = {{height:Adaption.Height(50), marginTop: Adaption.Height(5), flexDirection:'row',alignItems: 'center',justifyContent:'space-around'}}>
                            <View style = {{flex:0.47,alignItems: 'center',justifyContent: 'center'}}><Text style={{color:'#b5b5b5',marginBottom:5}}>总注数</Text><Text allowFontScaling={false} style={{ color: '#434343', fontSize: Adaption.Font(17) }}><Text style={{color:'red'}}>{this.state.zhuShuNum}</Text>注</Text></View>
                            <View style = {{ height: Adaption.Height(35), backgroundColor:'lightgrey', width:1 }}></View>
                            <View style = {{flex:0.49,alignItems: 'center',justifyContent: 'center'}}><Text style={{color:'#b5b5b5',marginBottom:5}}>总金额</Text><Text allowFontScaling={false} style={{ color: '#434343', fontSize: Adaption.Font(17) }}><Text style={{color:'red'}}>{(this.state.subTotalPrice*this.state.slectMutipleOne*this.state.slectMutipleTwo).toFixed(2)}</Text>元</Text></View>
                        </View>

                        <View style = {{height:Adaption.Height(this.state.isShowListView ? 25 : 30), flexDirection:'row', justifyContent:'center', marginTop:Adaption.Height(10)}}>
                            <Text allowFontScaling={false} style = {{color:'#171717', fontSize:Adaption.Font(15,12)}}>若中奖,单注最高中:
                                <Text allowFontScaling={false} adjustsFontSizeToFit={true} style = {{color:'#22ac38', fontSize: Adaption.Font(15,12)}}>{(this.state.willWinPrice*this.state.slectMutipleOne*this.state.slectMutipleTwo).toFixed(2)}</Text>元
                            </Text>
                        </View>

                        <View style = {{flexDirection:'row',height:Adaption.Height(50), borderTopWidth:1, borderColor:'#e1e2e3'}}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress = {() => {

                                    if (this.isShowOneKey) {
                                        if (this.state.subTotalPrice <= 0) {
                                            this.refs.Toast && this.refs.Toast.show('请输入购买金额！', 1000);

                                        } else if (this.state.slectMutipleOne == '' || this.state.slectMutipleOne == '0') {
                                            this.refs.Toast && this.refs.Toast.show('请输入追号期数！', 1000);

                                        } else if (this.state.slectMutipleTwo =='' || this.state.slectMutipleTwo == '0') {
                                            this.refs.Toast && this.refs.Toast.show('请输入投注倍数！', 1000);

                                        } else {
                                            this.setState({isShow:false,slectMutipleOne:'1',slectMutipleTwo:'1'}); 
                                            this.props.addToShopCarClick ? this.props.addToShopCarClick(this.state.ballSourceArr) : null; 
                                        }
                                    } else {
                                        this.setState({isShow:false,slectMutipleOne:'1',slectMutipleTwo:'1'}); 
                                        this.props.closeClick ? this.props.closeClick() : null;
                                    }
                                }}
                                style = {{flex:0.49, justifyContent:'center', alignItems:'center'}}
                            >
                                <CusBaseText style = {{fontSize:Adaption.Font(18,15), color:'#78797a'}}>{this.isShowOneKey ? '加入购物车' : '取消'}</CusBaseText>
                            </TouchableOpacity>
                            <View style = {{height:(this.state.isShowListView?Adaption.Height(50):Adaption.Height(58)), backgroundColor:'lightgrey', width:1,marginBottom:0,marginTop:0}}></View>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress = {() =>  {
                                    if (this.state.subTotalPrice <= 0) {
                                        this.refs.Toast && this.refs.Toast.show('请输入购买金额！', 1000);

                                    } else if (this.state.slectMutipleOne == '' || this.state.slectMutipleOne == '0') {
                                        this.refs.Toast && this.refs.Toast.show('请输入追号期数！', 1000);

                                    } else if (this.state.slectMutipleTwo =='' || this.state.slectMutipleTwo == '0') {
                                        this.refs.Toast && this.refs.Toast.show('请输入投注倍数！', 1000);

                                    } else {
                                        this.setState({isShow:false,slectMutipleOne:'1',slectMutipleTwo:'1'});

                                        if (this.isShowOneKey) {
                                            this.props.comformBuyClick ? this.props.comformBuyClick(this.state.ballSourceArr) : null;
                                        } else {
                                            this.props.addToShopCarClick ? this.props.addToShopCarClick(this.state.ballSourceArr) : null;
                                        }
                                    }
                                }}
                                style = {{flex:0.49, justifyContent:'center', alignItems:'center'}}>
                                <CusBaseText style = {{fontSize:Adaption.Font(18,15), color:'#0094e7'}}>{this.isShowOneKey ? '一键购买' : '确定'}</CusBaseText>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {this.state.isShowKeyboardView ? this._createKeyboardView() : <View style = {{backgroundColor:'rgba(0,0,0,0)', height:Adaption.Height(270), width:SCREEN_WIDTH}}></View>}
                </View>
                <Toast ref="Toast" position='bottom'/>
            </Modal>
        )
    }


    _onLayout(e){
        // console.log("什么什么", e.nativeEvent.layout.width);
        let width = e.nativeEvent.layout.width;
        this.state.wenziWidth = width;
        this.refs.AllenFadeInViewC.setNativeProps({
            style: {left:this.state.moneyText.length<=0?Adaption.Width(10):Adaption.Width(10)*2 + width },
        });
    }


    // 弹出的键盘
    _createKeyboardView() {
        return(
            <View style = {{ backgroundColor:'#bababf', height:Adaption.Height(270), width:SCREEN_WIDTH }}>
                <View style = {{backgroundColor:'#f6f6f7', flexDirection:'row', height:Adaption.Height(50)}}>
                    <View style = {{justifyContent:'center', alignItems:'center', flex:1}}><Text allowFontScaling={false} style = {{fontSize:Adaption.Font(17, 15), color:'#999'}}>请输入购买金额</Text></View>
                    <TouchableOpacity activeOpacity={1}
                                      style = {{justifyContent:'center', alignItems:'center', height:Adaption.Height(50), position:'absolute', top:0, left:SCREEN_WIDTH - Adaption.Width(70)}}
                                      onPress = {()=> {
                                          this.setState({
                                              isShowKeyboardView: !this.state.isShowKeyboardView,
                                          })
                                      }}
                    >
                        <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(17, 15), color:'#000', fontWeight:'900'}}>完成</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    automaticallyAdjustContentInsets={false}
                    alwaysBounceHorizontal = {false}
                    data = {this._keyboardTitle()}
                    renderItem = {(item)=>this._renderItemView(item)}
                    horizontal = {false}
                    numColumns = {3}
                    scrollEnabled={false}
                >
                </FlatList>
            </View>
        )
    }

    _renderItemView(item) {
        return(
            <TouchableOpacity  activeOpacity={0.5} style = {{
                backgroundColor:(item.index == 9 || item.index == 11) ? 'rgba(0,0,0,0)' : '#fff', width:SCREEN_WIDTH * 0.31, height:Adaption.Height(47), justifyContent:'center', alignItems:'center',
                marginLeft:(SCREEN_WIDTH * 0.07)/4, marginTop:Adaption.Height(6.4), borderRadius:5}}
                              onPress = {()=> {

                                  // 限制输入长度为7
                                  if (this.state.moneyText.length >= 7 && item.index != 11) {
                                      return;
                                  }

                                  // 限制只有输入一位小数
                                  if (this.state.moneyText.includes('.')) {
                                      let arr = this.state.moneyText.split('.');
                                      let lastStr = arr[1];
                                      if (lastStr.length >=1 && item.index != 11) {
                                          return;
                                      }
                                  }

                                  let tempMoneyText = this.state.moneyText;
                                  if (item.index == 9) {
                                      // // 小数点。
                                      // // 已经输入了小数点就不能再输入了。 限制长度为6后不能再输入小数点
                                      // if (!this.state.moneyText.includes('.') && this.state.moneyText.length < 6 && this.state.moneyText.length > 0) {
                                      //     tempMoneyText = this.state.moneyText + item.item.tit;
                                      // } else {
                                      //     return;
                                      // }
                                  } else if (item.index == 11) {
                                      // 删除
                                      if (this.state.moneyText.length > 0) {
                                          tempMoneyText = this.state.moneyText.substr(0, this.state.moneyText.length-1);
                                      }
                                  } else {
                                      if (this.state.moneyText.length == 1 && this.state.moneyText == '0' && item.index == 10) {
                                          return;
                                      } else {
                                          if (this.state.moneyText == '0') {
                                              tempMoneyText = `${item.item.tit}`;
                                          } else {
                                              tempMoneyText = this.state.moneyText + item.item.tit;
                                          }
                                      }
                                  }

                                  this.setState({
                                      moneyText: tempMoneyText,
                                  })
                                  this._resetSinglePrie(tempMoneyText == '' ? 0 : this.state.isYuan?tempMoneyText:(tempMoneyText*0.1).toFixed(2));

                              }}>
                {item.index == 11
                    ? <Image resizeMode={'contain'} style={{width:Adaption.Width(40),height:Adaption.Width(40)}} source={require('../../../img/ic_keyboardDelete.png')}/>
                    : <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(22, 19), color:'#000'}}>{item.item.tit}</Text>
                }
            </TouchableOpacity>
        )
    }




    _header = () => {
        return <Text style={[{marginTop:10,marginLeft:10,fontSize:16,color:'#414141'}]}>{this.props.playData.wanfa}:</Text>;
    }

    // 键盘显示的文本
    _keyboardTitle() {
        var array = [];
        for (let i = 1; i <= 12; i++) {
            if (i == 10) {
                array.push({key:i, tit:' '});
            } else if (i == 11) {
                array.push({key:i, tit:'0'});
            } else if (i == 12) {
                array.push({key:i, tit:'delete'});
            } else {
                array.push({key:i, tit:i});
            }
        }
        return array;
    }



    //创建号码视图
    _renderItemBallNumberView(item) {
            // console.log("王海",item.index,this.state.ballSourceArr);
        let str = '';
        for(let i = 0 ; i < this.state.ballSourceArr.length; i++){
            let value = this.state.ballSourceArr[i].value;
            // console.log(value);
            str += value.xiangqing;
            if(i == this.state.ballSourceArr.length -1){

            }else {
                str += ', ';
            }
        }
        return (
            <View key={item.index+"21"} style={{paddingHorizontal:10,marginTop:10, width:SCREEN_WIDTH - Adaption.Width(40),  justifyContent:'center', alignItems:'center'}}>
                {/* <Text key={item.index+''} allowFontScaling={false} style={{color: '#919191', fontSize: Adaption.Font(16, 13)}}>{str}</Text> */}
                <CusBaseText style={{fontSize: Adaption.Font(16, 13)}}>{this._xiangqingBallsTextView(str)}</CusBaseText>
            </View>
        );
    }

    // 详情显示 加上颜色
    _xiangqingBallsTextView(ballsText) {

        if (ballsText == null || ballsText == '') {
            return [];
        }

        if (!ballsText.includes('(')) {
            return <CusBaseText style={{color: '#e33939'}}>{ballsText}</CusBaseText>
        }

        let ballsArr = ballsText.split(/[\(\)]/);
        var textViews = [];
        for (let a = 0; a < ballsArr.length; a++) {

            var string = '';
            if (a % 2 == 0) {
                if (a == 0) {
                    string = `${ballsArr[a]}(`;
                } else if (a == ballsArr.length - 1) {
                    string = `${ballsArr[a]})`;
                } else {
                    string = `)${ballsArr[a]}(`;
                }
            } else {
                string = ballsArr[a];
            }

            textViews.push(
                <CusBaseText key={a} style={{color: a % 2 == 0 ? '#707070' : '#e33939'}}>{string}</CusBaseText>
            );
        }
        return textViews;
    }

}



// AllenFadeInView.js


class AllenFadeInView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fadeAnim: new Animated.Value(0),          // 透明度初始值设为0
            isStop:false,
            hasContent:props.hasContent,
            hasStart:true,
            AnativePropsLeft: Adaption.Width(10)
        };
    }


    setNativeProps(nativeProps) {
        // console.log('nativeProps',this,this._root);
        if(this.refs._root) {
            this.refs._root.setNativeProps(
                nativeProps);
        }else{
            this.state.AnativePropsLeft = nativeProps.style.left;
        }
        // this.state.AnativePropsLeft = nativeProps.style.left;
    }
    componentDidMount() {
        this.startAnimation();                             // 开始执行动画
    }

    startAnimation(){
        // console.log("还敢执行吗");
        if(this.state.isStop||this.state.hasContent){
            this.state.hasStart = false;
            return;
        }
        this.state.fadeAnim.setValue(0);
        Animated.timing(                            // 随时间变化而执行的动画类型
            this.state.fadeAnim,                      // 动画中的变量值
            {
                duration: 1000,
                toValue: 1,                             // 透明度最终变为1，即完全不透明
            }
        ).start(()=> this.startAnimation());
    }
    render() {
        return !this.state.hidden ?(
            <Animated.View                            // 可动画化的视图组件
                ref='_root'
                style={{
                    ...this.props.style,
                    opacity: this.state.fadeAnim,          // 将透明度指定为动画变量值
                    // left:this.state.AnativePropsLeft
                }}
            >
                {this.props.children}
            </Animated.View>
        ):null;
    }

    componentWillUnmount() {

        this.state.isStop = true;

    }


    componentWillReceiveProps(nextProps) {
        // console.log("componentWillReceiveProps",nextProps);
        this.state.hasContent = nextProps.hasContent;
        this.state.hidden =  nextProps.hasContent;

        if(!this.state.hidden&&!this.state.hasStart){

            this.state.hasStart = true;
            this.startAnimation();
        }
    }


}



const styles = StyleSheet.create({

    //图片样式
    newBottomImage:{
        width:Adaption.Width(24),
        height:Adaption.Width(24),
        marginLeft:10,
    },

    //文字颜色
    newBottomText:{
        color:'white',
        fontSize:Adaption.Font(18,16),
        marginLeft:5
    },

    moneyButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#d3d3d3',
        borderWidth: 1,
        borderRadius: 3,
        width: Adaption.Width(65),
        height: Adaption.Font(35, 30),
    }
})
