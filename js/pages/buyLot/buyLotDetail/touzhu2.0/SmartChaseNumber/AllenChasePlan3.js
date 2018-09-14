import React, {Component} from 'react';

import {
    StyleSheet,
    View,
    StatusBar,
    ScrollView,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    TextInput,
    ImageBackground,
    Dimensions,
    Modal,
    DeviceEventEmitter
} from 'react-native';
import LocalImg from "../../../../../res/img";
import Colors from "../../../../../skframework/component/Colors";
import SmartStlye from "./SmartVersion3/SmartStyles";

const {width, height} = Dimensions.get('window');
let iphoneX = global.iOS ? (SCREEN_HEIGHT == 812 ? true : false) : 0; //是否是iphoneX

// let iphoneX = SCREEN_HEIGHT == 812 ? true : false;
let iphone5S = global.iOS ? (SCREEN_WIDTH == 320 ? true : false) : 0;

export default class SmartChaseCell extends Component {

    constructor(props) {
        super(props);

        // let max = parseInt(this.props.basePercent) < 0 ? parseInt(this.props.basePercent) / 2 : parseInt(this.props.basePercent) * 2;
        // let after = parseInt(this.props.basePercent) > 0 ? parseInt(this.props.basePercent) / 2 : parseInt(this.props.basePercent) * 2;

        this.state = {
            visible: props.visible,
            showBtn1: true,
            showBtn2: false,
            showBtn3: false,
            maxYinglilv: props.maxProfitability,  //最大盈利率
            disscallBack: props.disscallBack,
            qishu: this.props.currentQishu,
            maxQishu: this.props.maxQishu, //最大期数
            beishu: '1',
            minimumProfitabilityInTheWholeProcess: '30',  //最大利率的一半
            beforePeriod: '5',

            beforePeriodProfitability: '50',
            afterPeriodProfitability: '20',
            totalProfitability: '30',
            isOpenQiShu: false,
            showQishuModal:false,
            qishuDetail:props.qishuDetail,
            indexone:502,
            selseqishu:props.selseqishu,
        }
        console.log("props.qishuDetail构造方法,",props.qishuDetail);

    }


    componentWillReceiveProps(nextProps) {
        console.log("nextProps.qishuDetail",nextProps.qishuDetail);
        this.state.qishuDetail = nextProps.qishuDetail;
        // this.state.selseqishu = nextProps.selseqishu;
        this.setState({
            visible: nextProps.visible,
            // qishu:nextProps.currentQishu,
        });
    }

    componentWillUnmount() {
        this.subscription.remove();
        this.subscription2.remove();
    }

    componentDidMount() {

        this.subscription = DeviceEventEmitter.addListener('changeQiShu', (dic) => {
            //接收到详情页发送的通知，刷新首页的数据，改变按钮颜色和文字，刷新UI
            this.setState({
                qishu: dic.textN,
            });
        });

        this.subscription2 = DeviceEventEmitter.addListener('changeQiShuIndex', (dic) => {
            //接收到详情页发送的通知，刷新首页的数据，改变按钮颜色和文字，刷新UI
            this.setState({
                selseqishu:dic.qiShuIndex
            });
        });
    }

//iphonex刘海44
    render() {

        let qishu = this.state.qishu;
        this.state.indexone++;
        let qishuArr = [this.state.qishuDetail,this.state.qishuDetail+1,this.state.qishuDetail+2,this.state.qishuDetail+3,this.state.qishuDetail+4,this.state.qishuDetail+5,this.state.qishuDetail+6,this.state.qishuDetail+7]
        return (
            <View>
                <Modal
                    style={{height: 300}}
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.visible}
                    onRequestClose={() => {
                        alert("Modal has been closed.")
                    }}
                >

                    <View style={{flex: 1, backgroundColor: 'transparent'}}>
                        <View style={{
                            backgroundColor: Colors.appColor,
                            height: iphoneX?88:64,
                            flexDirection: 'row',
                            paddingTop: iphoneX?40:20,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <TouchableOpacity style={{
                                marginTop: 0,
                                padding: 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'absolute',
                                left: 0,
                                top: iphoneX?45:25
                            }} activeOpacity={0.5}
                                              onPress={() => {
                                                  this.setState({
                                                      visible: false
                                                  })
                                                  this.state.disscallBack(false);
                                              }}><View
                                style={[styles.nav_headerLeft_view]}></View></TouchableOpacity>

                            <Text style={{color: 'white', fontSize: 20, fontWeight: '700'}}>修改方案</Text>
                        </View>

                        <View style={{
                            marginTop: 30,
                            flex: 1,
                            // top: 40,
                            // position: 'absolute',
                            // marginLeft: iphone5S ? 10 : 20,
                            // marginTop: 60,
                            // borderRadius: 5,
                            backgroundColor: '#edeeef',

                            // width: iphone5S ? width - 20 : width - 40,
                        }}>

                            <View style={{marginTop: 20, alignItems: 'center'}}><Text
                                style={{fontSize: 19}}>修改追号方案</Text></View>
                            <View style={{marginLeft: 20, flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
                                <Text style={{color: '#585859', fontSize: iphone5S ? 16 : 18}}>起始期号: </Text>
                                <TouchableOpacity activeOpacity={1}
                                                  style={[SmartStlye.maxBorderStyle, {
                                                      height: 32,
                                                      height: 32,
                                                      marginTop: 0,
                                                      width:186,
                                                  }]}
                                                  onPress={() => {
                                                      this.openQiShu()
                                                  }}>
                                    <View style={{width: 150, alignItems: 'center', justifyContent: 'center'}}>
                                        <CusBaseText
                                            style={SmartStlye.centerText}> {qishuArr[this.state.selseqishu]} </CusBaseText>
                                    </View>
                                    <Image style={{width: 18, height: 18, marginTop: 3}}
                                           source={require('../img/ic_buyLot_downRow.png')}></Image>
                                </TouchableOpacity>
                                <Text style={{fontSize: iphone5S ? 16 : 18, color: '#585859'}}> 期</Text>
                            </View>
                            <View style={{marginLeft: 20, flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                                <Text style={{color: '#585859', fontSize: iphone5S ? 16 : 18}}>连续追号: </Text>
                                <View style={{
                                    backgroundColor: 'white',
                                    borderWidth: 0.5,
                                    borderColor: '#9d9d9d',
                                    width: 188,
                                    height: 32,
                                    borderRadius: 3,
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <TouchableOpacity
                                        style={{flex: 0.5, alignItems: 'center', justifyContent: 'center', height: 31}}
                                        onPress={() => {
                                            this.setState({qishu: this.state.qishu == '' ? '' : String(parseInt(this.state.qishu) - 1) <= 0 ? '1' : String(parseInt(this.state.qishu) - 1)});
                                        }}>
                                        <View style={{}}>

                                            <CusBaseText style={{
                                                textAlign: 'center',
                                                color: "#676767",
                                                fontSize: 18
                                            }}>-</CusBaseText>

                                        </View>
                                    </TouchableOpacity>
                                    {/*分割线*/}
                                    {/*<View style={{width:((width == 320) ? (1) :(0.7)),height:32,backgroundColor:'#9d9d9d'}} />*/}

                                    <View style={{flex: 1}}>
                                        {/*<CusBaseText style={{textAlign:'center',color:'#535353'}} >4</CusBaseText>*/}
                                        <TextInput allowFontScaling={false}
                                                   keyboardType={global.iOS ? 'number-pad' : 'numeric'}
                                                   onChangeText={(text) => {

                                                       if (text > this.state.maxQishu) {
                                                           text = this.state.maxQishu + '';
                                                       }
                                                       this.setState({qishu: text});
                                                   }}
                                                   value={this.state.qishu}
                                                   returnKeyType="done"
                                                   maxLength={5}
                                                   style={{
                                                       padding: 0,

                                                       height: 32,
                                                       borderColor: '#9d9d9d',
                                                       borderWidth: 0.5,
                                                       backgroundColor: '#fff',

                                                       borderRadius: 1,
                                                       textAlign: 'center'
                                                   }} underlineColorAndroid='transparent'
                                            // value={this.state.isNormalChaseNumberModel ? this.state.slectMutipleQiShuNormal : this.state.slectMutipleQiShu}
                                                   onFocus={() => {

                                                       // if (this.state.isNormalChaseNumberModel) {
                                                       //     this.state.slectMutipleQiShuNormal == '' ? this.setState({slectMutipleQiShuNormal: '1'}) : null;
                                                       // } else {
                                                       //     this.state.slectMutipleQiShu == '' ? this.setState({slectMutipleQiShu: '1'}) : null;
                                                       // }
                                                   }}
                                                   onBlur={() => {
                                                       if (this.state.qishu == '') {
                                                           this.setState({qishu: '1'});
                                                       }
                                                       // if (this.state.isNormalChaseNumberModel) {
                                                       //     this.state.slectMutipleQiShuNormal == '' ? this.setState({slectMutipleQiShuNormal: '1'}) : null;
                                                       // } else {
                                                       //     this.state.slectMutipleQiShu == '' ? this.setState({slectMutipleQiShu: '1'}) : null;
                                                       // }
                                                   }
                                                   }
                                        />
                                    </View>

                                    {/*<View style={{width:((width == 320) ? (1) :(0.7)),height:32,backgroundColor:'#9d9d9d'}} />*/}
                                    <TouchableOpacity
                                        style={{flex: 0.5, alignItems: 'center', justifyContent: 'center', height: 31}}
                                        onPress={() => {

                                            if (parseInt(this.state.qishu) < parseInt(this.state.maxQishu)) {
                                                this.setState({qishu: this.state.qishu == '' ? '' : String(parseInt(this.state.qishu) + 1)});

                                            }

                                        }}>
                                        <View style={{flex: 0.5, alignItems: 'center', justifyContent: 'center'}}>
                                            <CusBaseText style={{
                                                textAlign: 'center',
                                                color: "#676767",
                                                fontSize: 20
                                            }}>+</CusBaseText>

                                        </View>
                                    </TouchableOpacity>


                                </View>
                                <Text style={{fontSize: iphone5S ? 16 : 18, color: '#585859'}}> 期</Text>
                            </View>

                            <View style={{marginLeft: 20, flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                                <Text style={{color: '#585859', fontSize: iphone5S ? 16 : 18}}>起始倍数: </Text>
                                <View style={{
                                    backgroundColor: 'white',
                                    borderWidth: 0.5,
                                    borderColor: '#9d9d9d',
                                    width: 188,
                                    height: 32,
                                    borderRadius: 3,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                    <TouchableOpacity
                                        style={{flex: 0.5, alignItems: 'center', justifyContent: 'center', height: 31}}
                                        onPress={() => {
                                            this.setState({beishu: this.state.beishu == '' ? '' : String(parseInt(this.state.beishu) - 1) <= 0 ? '1' : String(parseInt(this.state.beishu) - 1)});
                                        }}>
                                        <View style={{}}>

                                            <CusBaseText style={{
                                                textAlign: 'center',
                                                color: "#676767",
                                                fontSize: 18
                                            }}>-</CusBaseText>
                                        </View>
                                    </TouchableOpacity>
                                    {/*分割线*/}
                                    {/*<View style={{width:((width == 320) ? (1) :(0.7)),height:32,backgroundColor:'#9d9d9d'}} />*/}

                                    <View style={{flex: 1}}>
                                        {/*<CusBaseText style={{textAlign:'center',color:'#535353'}} >4</CusBaseText>*/}
                                        <TextInput allowFontScaling={false}
                                                   keyboardType={global.iOS ? 'number-pad' : 'numeric'}
                                                   onChangeText={(text) => {
                                                       this.setState({beishu: text});
                                                       // if (text > this.maxQishu) {
                                                       //     text = this.maxQishu + '';
                                                       // }
                                                       // if (this.state.isNormalChaseNumberModel) {
                                                       //     this.state.slectMutipleQiShuNormal = text != '' ? (text) : ('');
                                                       //     this.setState({});
                                                       // } else {
                                                       //     this.state.slectMutipleQiShu = text != '' ? (text) : ('');
                                                       //     // this.props.multipleClick ? this.props.multipleClick(text) : null;  //回调输入的倍数
                                                       //     this.setState({});
                                                       // }
                                                       //
                                                       // this.calculateScheduling(text, 1);

                                                   }}
                                                   value={this.state.beishu}
                                                   returnKeyType="done"
                                                   maxLength={5}
                                                   style={{
                                                       padding: 0,

                                                       height: 32,
                                                       borderColor: '#9d9d9d',
                                                       borderWidth: 0.5,
                                                       backgroundColor: '#fff',

                                                       borderRadius: 1,
                                                       textAlign: 'center'
                                                   }} underlineColorAndroid='transparent'
                                            // value={this.state.isNormalChaseNumberModel ? this.state.slectMutipleQiShuNormal : this.state.slectMutipleQiShu}
                                                   onFocus={() => {
                                                       // if (this.state.isNormalChaseNumberModel) {
                                                       //     this.state.slectMutipleQiShuNormal == '' ? this.setState({slectMutipleQiShuNormal: '1'}) : null;
                                                       // } else {
                                                       //     this.state.slectMutipleQiShu == '' ? this.setState({slectMutipleQiShu: '1'}) : null;
                                                       // }
                                                   }}
                                                   onBlur={() => {
                                                       if (this.state.beishu == '') {
                                                           this.setState({beishu: '1'});
                                                       }
                                                       // if (this.state.isNormalChaseNumberModel) {
                                                       //     this.state.slectMutipleQiShuNormal == '' ? this.setState({slectMutipleQiShuNormal: '1'}) : null;
                                                       // } else {
                                                       //     this.state.slectMutipleQiShu == '' ? this.setState({slectMutipleQiShu: '1'}) : null;
                                                       // }
                                                   }
                                                   }
                                        />
                                    </View>

                                    {/*<View style={{width:((width == 320) ? (1) :(0.7)),height:32,backgroundColor:'#9d9d9d'}} />*/}
                                    <TouchableOpacity
                                        style={{flex: 0.5, alignItems: 'center', justifyContent: 'center', height: 31}}
                                        onPress={() => {
                                            this.setState({beishu: this.state.beishu == '' ? '' : String(parseInt(this.state.beishu) + 1)});
                                        }}>
                                        <View style={{}}>

                                            <CusBaseText style={{
                                                textAlign: 'center',
                                                color: "#676767",
                                                fontSize: 20
                                            }}>+</CusBaseText>

                                        </View></TouchableOpacity>


                                </View>
                                <Text style={{fontSize: iphone5S ? 16 : 18, color: '#585859'}}> 倍</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>

                                <View style={{marginLeft: 20, justifyContent: 'center'}}>
                                    <Text style={{color: '#585859', fontSize: iphone5S ? 16 : 18}}>预期盈利: </Text>
                                </View>

                                <View style={{flex: 1}}>
                                    {/*追号方案一*/}
                                    <TouchableOpacity activeOpacity={1} style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 20,
                                    }}
                                                      onPress={() => {
                                                          this.setState({
                                                              showBtn1: true,
                                                              showBtn2: false,
                                                              showBtn3: false
                                                          });
                                                      }}
                                    >
                                        {/*<TouchableOpacity activeOpacity={0.7}*/}
                                        {/*onPress={() => {*/}
                                        {/*this.setState({*/}
                                        {/*showBtn1: true,*/}
                                        {/*showBtn2: false,*/}
                                        {/*showBtn3: false*/}
                                        {/*});*/}
                                        {/*}}>*/}
                                        <View style={{
                                            height: 16,
                                            width: 16,
                                            borderWidth: this.state.showBtn1 ? 5 : 0.7,
                                            borderColor: this.state.showBtn1 ? COLORS.appColor : '#9d9d9d',
                                            borderRadius: 8,
                                            backgroundColor: 'white'
                                        }}/>
                                        {/*</TouchableOpacity>*/}
                                        <Text style={{color: '#585859', fontSize: iphone5S ? 16 : 17}}> 全程最低盈利率 </Text>
                                        <TextInput allowFontScaling={false}
                                                   editable={this.state.showBtn1}
                                                   keyboardType={global.iOS ? 'number-pad' : 'numeric'}
                                                   onChangeText={(text) => {

                                                       // if (text === '')
                                                       // {
                                                       //     text = '1';
                                                       // }

                                                       //只判断大于0的情况 小于零确定dome来

                                                       if (text > this.state.maxYinglilv) {
                                                           text = this.state.maxYinglilv + '';
                                                       }


                                                       // if (text > this.maxQishu) {
                                                       //     text = this.maxQishu + '';
                                                       // }
                                                       // if (this.state.isNormalChaseNumberModel) {
                                                       //     this.state.slectMutipleQiShuNormal = text != '' ? (text) : ('');
                                                       //     this.setState({});
                                                       // } else {
                                                       //     this.state.slectMutipleQiShu = text != '' ? (text) : ('');
                                                       //     // this.props.multipleClick ? this.props.multipleClick(text) : null;  //回调输入的倍数
                                                       //     this.setState({});
                                                       // }
                                                       //
                                                       // this.calculateScheduling(text, 1);
                                                       this.setState({minimumProfitabilityInTheWholeProcess: text});

                                                   }}
                                                   value={this.state.minimumProfitabilityInTheWholeProcess}
                                                   returnKeyType="done"
                                                   maxLength={5}
                                                   style={{
                                                       padding: 0,
                                                       width: (iphone5S ? 45 : 45),
                                                       height: 30,
                                                       borderColor: '#9d9d9d',
                                                       borderWidth: 0.7,
                                                       backgroundColor: this.state.showBtn1 ? '#fff' : '#edeeef',

                                                       borderRadius: 3,
                                                       textAlign: 'center'
                                                   }} underlineColorAndroid='transparent'
                                            // value={this.state.isNormalChaseNumberModel ? this.state.slectMutipleQiShuNormal : this.state.slectMutipleQiShu}
                                                   onFocus={() => {
                                                       // if (this.state.isNormalChaseNumberModel) {
                                                       //     this.state.slectMutipleQiShuNormal == '' ? this.setState({slectMutipleQiShuNormal: '1'}) : null;
                                                       // } else {
                                                       //     this.state.slectMutipleQiShu == '' ? this.setState({slectMutipleQiShu: '1'}) : null;
                                                       // }
                                                   }}
                                                   onSubmitEditing={() => {

                                                       // if(this.state.maxYinglilv < 0)
                                                       // {
                                                       //     if (this.minimumProfitabilityInTheWholeProcess > this.state.maxYinglilv)
                                                       //     {
                                                       //         this.minimumProfitabilityInTheWholeProcess=(this.state.maxYinglilv + '');
                                                       //
                                                       //     }
                                                       // }
                                                   }
                                                   }
                                        />
                                        <Text style={{fontSize: 18, color: '#585859'}}> %</Text>
                                    </TouchableOpacity>

                                    {/*追号方案二*/}
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => {
                                            this.setState({
                                                showBtn1: false,
                                                showBtn2: true,
                                                showBtn3: false
                                            });
                                        }}
                                    >
                                        {/*方案二第一行*/}
                                        <View style={{
                                            flexDirection: 'row',
                                            marginTop: 10,
                                            marginLeft: 2,
                                            alignItems: 'center'
                                        }}>

                                            <View style={{
                                                height: 16,
                                                width: 16,
                                                borderWidth: this.state.showBtn2 ? 5 : 0.7,
                                                borderColor: this.state.showBtn2 ? Colors.appColor : '#9d9d9d',
                                                borderRadius: 8,
                                                backgroundColor: 'white'
                                            }}/>

                                            <Text style={{color: '#585859', fontSize: iphone5S ? 16 : 17}}> 前 </Text>
                                            <TextInput allowFontScaling={false}
                                                       editable={this.state.showBtn2}
                                                       keyboardType={global.iOS ? 'number-pad' : 'numeric'}
                                                       onChangeText={(text) => {

                                                           // if (text === '')
                                                           // {
                                                           //     text = '1';
                                                           // }

                                                           if (text > this.state.maxQishu) {
                                                               text = this.state.maxQishu + '';
                                                           }
                                                           this.setState({beforePeriod: text});
                                                       }}
                                                       value={this.state.beforePeriod}
                                                       returnKeyType="done"
                                                       maxLength={5}
                                                       style={{
                                                           padding: 0,
                                                           width: (iphone5S ? 45 : 45),
                                                           height: 30,
                                                           borderColor: '#9d9d9d',
                                                           borderWidth: 0.7,
                                                           backgroundColor: this.state.showBtn2 ? '#fff' : '#edeeef',

                                                           borderRadius: 3,
                                                           textAlign: 'center'
                                                       }} underlineColorAndroid='transparent'
                                                // value={this.state.isNormalChaseNumberModel ? this.state.slectMutipleQiShuNormal : this.state.slectMutipleQiShu}
                                                       onFocus={() => {
                                                           // if (this.state.isNormalChaseNumberModel) {
                                                           //     this.state.slectMutipleQiShuNormal == '' ? this.setState({slectMutipleQiShuNormal: '1'}) : null;
                                                           // } else {
                                                           //     this.state.slectMutipleQiShu == '' ? this.setState({slectMutipleQiShu: '1'}) : null;
                                                           // }
                                                       }}

                                            />
                                            <Text style={{fontSize: iphone5S ? 16 : 17, color: '#585859'}}> 期 </Text>
                                            <TextInput allowFontScaling={false}
                                                       editable={this.state.showBtn2}
                                                       keyboardType={global.iOS ? 'number-pad' : 'numeric'}
                                                       onChangeText={(text) => {


                                                           if (text > this.state.maxYinglilv) {
                                                               text = this.state.maxYinglilv + '';
                                                           }

                                                           //判断是否大于后期盈利
                                                           if (text < parseInt(this.state.afterPeriodProfitability) && text !== '') {
                                                               let before = parseInt(text);
                                                               before -= 1;
                                                               before > 0 ? before = 1 : before;
                                                               var after = `${before}` + '';
                                                               this.setState({afterPeriodProfitability: after});
                                                           }
                                                           // if (text > this.maxQishu) {
                                                           //     text = this.maxQishu + '';
                                                           // }
                                                           // if (this.state.isNormalChaseNumberModel) {
                                                           //     this.state.slectMutipleQiShuNormal = text != '' ? (text) : ('');
                                                           //     this.setState({});
                                                           // } else {
                                                           //     this.state.slectMutipleQiShu = text != '' ? (text) : ('');
                                                           //     // this.props.multipleClick ? this.props.multipleClick(text) : null;  //回调输入的倍数
                                                           //     this.setState({});
                                                           // }
                                                           //
                                                           // this.calculateScheduling(text, 1);
                                                           this.setState({beforePeriodProfitability: text});

                                                       }}
                                                       value={this.state.beforePeriodProfitability}
                                                       returnKeyType="done"
                                                       maxLength={5}
                                                       style={{
                                                           padding: 0,
                                                           width: (iphone5S ? 45 : 45),
                                                           height: 30,
                                                           borderColor: '#9d9d9d',
                                                           borderWidth: 0.7,
                                                           backgroundColor: this.state.showBtn2 ? '#fff' : '#edeeef',

                                                           borderRadius: 3,
                                                           textAlign: 'center'
                                                       }} underlineColorAndroid='transparent'
                                                // value={this.state.isNormalChaseNumberModel ? this.state.slectMutipleQiShuNormal : this.state.slectMutipleQiShu}
                                                       onFocus={() => {
                                                           // if (this.state.isNormalChaseNumberModel) {
                                                           //     this.state.slectMutipleQiShuNormal == '' ? this.setState({slectMutipleQiShuNormal: '1'}) : null;
                                                           // } else {
                                                           //     this.state.slectMutipleQiShu == '' ? this.setState({slectMutipleQiShu: '1'}) : null;
                                                           // }
                                                       }}
                                                       onSubmitEditing={() => {

                                                           if (this.state.maxYinglilv < 0) {
                                                               if (this.state.beforePeriodProfitability > this.state.maxYinglilv) {
                                                                   this.setState({beforePeriodProfitability: (this.state.maxYinglilv + '')});
                                                               }
                                                           }
                                                       }
                                                       }
                                            />
                                            <Text style={{fontSize: 18, color: '#585859'}}> %</Text>
                                        </View>

                                        {/*第二行*/}
                                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>

                                            <Text style={{
                                                color: '#585859',
                                                fontSize: iphone5S ? 16 : 17,
                                                marginLeft: 23
                                            }}>之后盈利率 </Text>
                                            <TextInput allowFontScaling={false}
                                                       editable={this.state.showBtn2}
                                                       keyboardType={global.iOS ? 'number-pad' : 'numeric'}

                                                       onSubmitEditing={() => {

                                                           if (this.state.maxYinglilv < 0) {
                                                               if (this.state.afterPeriodProfitability > parseFloat(this.state.beforePeriodProfitability, 10)) {

                                                                   let befor = parseFloat(this.state.beforePeriodProfitability, 10) - 1;

                                                                   this.setState({afterPeriodProfitability: `${befor}`});
                                                               }
                                                           }
                                                       }
                                                       }

                                                       onChangeText={(text) => {

                                                           // if (text === '')
                                                           // {
                                                           //     text = '1';
                                                           // }
                                                           //之后盈利不能大于之前盈利

                                                           if (this.state.maxYinglilv > 0) {
                                                               if (text > parseInt(this.state.beforePeriodProfitability && text !== '')) {

                                                                   let before = parseInt(this.state.beforePeriodProfitability);
                                                                   before -= 1;
                                                                   text = `${before}` + '';
                                                               }
                                                           }

                                                           this.setState({afterPeriodProfitability: text});

                                                       }}


                                                       value={this.state.afterPeriodProfitability}
                                                       returnKeyType="done"
                                                       maxLength={5}
                                                       style={{
                                                           padding: 0,
                                                           width: (iphone5S ? 40 : 40),
                                                           height: 30,
                                                           borderColor: '#9d9d9d',
                                                           borderWidth: 0.7,
                                                           backgroundColor: this.state.showBtn2 ? '#fff' : '#edeeef',

                                                           borderRadius: 3,
                                                           textAlign: 'center'
                                                       }} underlineColorAndroid='transparent'
                                                // value={this.state.isNormalChaseNumberModel ? this.state.slectMutipleQiShuNormal : this.state.slectMutipleQiShu}
                                                       onFocus={() => {
                                                           // if (this.state.isNormalChaseNumberModel) {
                                                           //     this.state.slectMutipleQiShuNormal == '' ? this.setState({slectMutipleQiShuNormal: '1'}) : null;
                                                           // } else {
                                                           //     this.state.slectMutipleQiShu == '' ? this.setState({slectMutipleQiShu: '1'}) : null;
                                                           // }
                                                       }}

                                            />
                                            <Text style={{fontSize: 18, color: '#585859'}}> %</Text>
                                        </View>
                                    </TouchableOpacity>
                                    {/*追号方案三*/}
                                    <TouchableOpacity style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 10,
                                    }}
                                                      activeOpacity={1}
                                                      onPress={() => {
                                                          this.setState({
                                                              showBtn1: false,
                                                              showBtn2: false,
                                                              showBtn3: true
                                                          });
                                                      }}>
                                        {/*<TouchableOpacity activeOpacity={0.7} onPress={() => {*/}
                                        {/*this.setState({*/}
                                        {/*showBtn1: false,*/}
                                        {/*showBtn2: false,*/}
                                        {/*showBtn3: true*/}
                                        {/*});*/}
                                        {/*}}>*/}
                                        <View style={{
                                            height: 16,
                                            width: 16,
                                            borderWidth: this.state.showBtn3 ? 5 : 0.7,
                                            borderColor: this.state.showBtn3 ? Colors.appColor : '#9d9d9d',
                                            borderRadius: 8,
                                            backgroundColor: 'white'
                                        }}/>
                                        {/*</TouchableOpacity>*/}
                                        <Text style={{color: '#585859', fontSize: iphone5S ? 16 : 17}}> 全程最低盈利 </Text>
                                        <TextInput allowFontScaling={false}
                                                   editable={this.state.showBtn3}
                                                   keyboardType={global.iOS ? 'number-pad' : 'numeric'}
                                                   onChangeText={(text) => {

                                                       // if (text === '')
                                                       // {
                                                       //     text = '1';
                                                       // }
                                                       this.setState({totalProfitability: text});

                                                   }}
                                                   value={this.state.totalProfitability}
                                                   returnKeyType="done"
                                                   maxLength={5}
                                                   style={{
                                                       padding: 0,
                                                       width: (iphone5S ? 45 : 45),
                                                       height: 30,
                                                       borderColor: '#9d9d9d',
                                                       borderWidth: 0.7,
                                                       backgroundColor: this.state.showBtn3 ? '#fff' : '#edeeef',

                                                       borderRadius: 3,
                                                       textAlign: 'center'
                                                   }} underlineColorAndroid='transparent'
                                            // value={this.state.isNormalChaseNumberModel ? this.state.slectMutipleQiShuNormal : this.state.slectMutipleQiShu}
                                                   onFocus={() => {
                                                       // if (this.state.isNormalChaseNumberModel) {
                                                       //     this.state.slectMutipleQiShuNormal == '' ? this.setState({slectMutipleQiShuNormal: '1'}) : null;
                                                       // } else {
                                                       //     this.state.slectMutipleQiShu == '' ? this.setState({slectMutipleQiShu: '1'}) : null;
                                                       // }
                                                   }}
                                                   onBlur={() => {
                                                       // if (this.state.isNormalChaseNumberModel) {
                                                       //     this.state.slectMutipleQiShuNormal == '' ? this.setState({slectMutipleQiShuNormal: '1'}) : null;
                                                       // } else {
                                                       //     this.state.slectMutipleQiShu == '' ? this.setState({slectMutipleQiShu: '1'}) : null;
                                                       // }
                                                   }
                                                   }
                                        />
                                        <Text style={{fontSize: 18, color: '#585859'}}> 元</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/*<View style={{*/}
                            {/*flexDirection: 'row',*/}
                            {/*height: (iphone5S ? 50 : 50),*/}
                            {/*borderTopWidth: 1,*/}
                            {/*borderColor: '#cdcecf',*/}
                            {/*marginTop: 20*/}
                            {/*}}>*/}
                            {/*<TouchableOpacity*/}
                            {/*activeOpacity={0.8}*/}


                            {/*onPress={() => {*/}
                            {/*this.setState({*/}
                            {/*visible: false*/}
                            {/*})*/}
                            {/*this.state.disscallBack(false);*/}
                            {/*}}*/}
                            {/*style={{flex: 0.49, justifyContent: 'center', alignItems: 'center'}}*/}
                            {/*>*/}
                            {/*<CusBaseText*/}
                            {/*style={{fontSize: Adaption.Font(18, 15), color: '#78797a'}}>取消</CusBaseText>*/}
                            {/*</TouchableOpacity>*/}
                            {/*<View style={{*/}
                            {/*height: (iphone5S ? 50 : 50),*/}
                            {/*backgroundColor: 'lightgrey',*/}
                            {/*width: 1*/}
                            {/*}}/>*/}

                            {/*/!*全程最低*!/*/}
                            {/*<TouchableOpacity*/}
                            {/*activeOpacity={0.8}*/}
                            {/*onPress={() => {*/}

                            {/*this.setState({*/}
                            {/*visible: false*/}
                            {/*})*/}

                            {/*//过滤错的*/}
                            {/*if (this.state.minimumProfitabilityInTheWholeProcess === '') {*/}
                            {/*this.setState({minimumProfitabilityInTheWholeProcess: '1'});*/}

                            {/*}*/}

                            {/*if (this.state.beforePeriod === '') {*/}

                            {/*// this.state.beforePeriod = '1';*/}

                            {/*this.setState({*/}
                            {/*beforePeriod: '1',*/}
                            {/*})*/}
                            {/*}*/}
                            {/*if (this.state.beforePeriodProfitability === '') {*/}

                            {/*this.setState({beforePeriodProfitability: '1'});*/}

                            {/*}*/}
                            {/*if (this.state.afterPeriodProfitability === '') {*/}

                            {/*this.setState({afterPeriodProfitability: '1'});*/}

                            {/*}*/}
                            {/*if (this.state.totalProfitability === '') {*/}
                            {/*// this.state.totalProfitability = '1';*/}
                            {/*this.setState({*/}
                            {/*totalProfitability: '1',*/}
                            {/*})*/}
                            {/*}*/}

                            {/*// if (this.state.subTotalPrice <= 0) {*/}
                            {/*//     this.refs.Toast && this.refs.Toast.show('请输入购买金额！', 1000);*/}
                            {/*// }else if(this.state.slectMutipleOne ==''||this.state.slectMutipleOne == '0') {this.refs.Toast && this.refs.Toast.show('请输入追号期数！', 1000);}*/}
                            {/*// else if(this.state.slectMutipleTwo ==''||this.state.slectMutipleTwo == '0'){this.refs.Toast && this.refs.Toast.show('请输入投注倍数！', 1000);*/}
                            {/*//*/}
                            {/*// }*/}
                            {/*// else {*/}
                            {/*//     this.setState({isShow:false,slectMutipleOne:'1',slectMutipleTwo:'1'});*/}
                            {/*//     this.props.addToShopCarClick ? this.props.addToShopCarClick(this.state.ballSourceArr) : null;*/}
                            {/*// }*/}
                            {/*// this.setState({visible:false});*/}
                            {/*let chasePlanStr = '';*/}
                            {/*let planType = 0;*/}
                            {/*if (this.state.showBtn1) {*/}
                            {/*if (this.state.maxYinglilv < 0) {*/}
                            {/*if (this.state.minimumProfitabilityInTheWholeProcess > this.state.maxYinglilv) {*/}
                            {/*this.setState({minimumProfitabilityInTheWholeProcess: (this.state.maxYinglilv - 1 + '')});*/}

                            {/*}*/}
                            {/*}*/}
                            {/*chasePlanStr = `全程最低盈利率${this.state.minimumProfitabilityInTheWholeProcess}%`;*/}
                            {/*planType = 1;*/}
                            {/*}*/}
                            {/*else if (this.state.showBtn2) {*/}

                            {/*if (this.state.maxYinglilv < 0) {*/}
                            {/*//前面*/}
                            {/*if (this.state.beforePeriodProfitability > this.state.maxYinglilv) {*/}
                            {/*this.setState({beforePeriodProfitability: (this.state.maxYinglilv - 1 + '')});*/}
                            {/*}*/}
                            {/*//    后面*/}
                            {/*if (this.state.afterPeriodProfitability > this.state.beforePeriodProfitability) {*/}
                            {/*this.setState({afterPeriodProfitability: (this.state.beforePeriodProfitability - 1 + '')});*/}

                            {/*console.log(this.afterPeriodProfitability);*/}
                            {/*}*/}
                            {/*}*/}

                            {/*chasePlanStr = `前${this.state.beforePeriod}期${this.state.beforePeriodProfitability}%之后盈利率${this.state.afterPeriodProfitability}%`;*/}
                            {/*planType = 2;*/}
                            {/*}*/}
                            {/*else {*/}
                            {/*chasePlanStr = `全程最低盈利${this.state.totalProfitability}元`;*/}
                            {/*planType = 3;*/}
                            {/*}*/}


                            {/*this.state.disscallBack(false, {*/}
                            {/*qishu: (this.state.qishu > 20 ? 20 : this.state.qishu),  //追号期数*/}
                            {/*startBeishu: this.state.beishu,  //起始倍数*/}
                            {/*chasePlanStr: chasePlanStr,       //追号描述*/}
                            {/*minimumProfitabilityInTheWholeProcess: this.state.minimumProfitabilityInTheWholeProcess, //方案一全程最低盈利*/}
                            {/*beforePeriod: this.state.beforePeriod,    //方案二的前多少期*/}
                            {/*beforePeriodProfitability: this.state.beforePeriodProfitability,  //方案二前面期数*/}
                            {/*afterPeriodProfitability: this.state.afterPeriodProfitability,   //方案二后面期数最低盈利*/}
                            {/*totalProfitability: this.state.totalProfitability,           //方案三全程最低盈利*/}
                            {/*planType: planType       //追号方案*/}
                            {/*});*/}
                            {/*}}*/}
                            {/*style={{flex: 0.49, justifyContent: 'center', alignItems: 'center'}}>*/}
                            {/*<CusBaseText*/}
                            {/*style={{fontSize: Adaption.Font(18, 15), color: '#0094e7'}}>确定</CusBaseText>*/}
                            {/*</TouchableOpacity>*/}
                            {/*</View>*/}

                            <TouchableOpacity style={{
                                flexDirection: 'row',
                                borderRadius: 5,
                                marginHorizontal: 20,
                                height: (iphone5S ? 50 : 50),
                                borderTopWidth: 1,
                                borderColor: '#cdcecf',
                                marginTop: 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: Colors.appColor
                            }} onPress={() => {

                                this.setState({
                                    visible: false
                                })

                                //过滤错的
                                if (this.state.minimumProfitabilityInTheWholeProcess === '') {
                                    this.setState({minimumProfitabilityInTheWholeProcess: '1'});

                                }

                                if (this.state.beforePeriod === '') {

                                    // this.state.beforePeriod = '1';

                                    this.setState({
                                        beforePeriod: '1',
                                    })
                                }
                                if (this.state.beforePeriodProfitability === '') {

                                    this.setState({beforePeriodProfitability: '1'});

                                }
                                if (this.state.afterPeriodProfitability === '') {

                                    this.setState({afterPeriodProfitability: '1'});

                                }
                                if (this.state.totalProfitability === '') {
                                    // this.state.totalProfitability = '1';
                                    this.setState({
                                        totalProfitability: '1',
                                    })
                                }

                                // if (this.state.subTotalPrice <= 0) {
                                //     this.refs.Toast && this.refs.Toast.show('请输入购买金额！', 1000);
                                // }else if(this.state.slectMutipleOne ==''||this.state.slectMutipleOne == '0') {this.refs.Toast && this.refs.Toast.show('请输入追号期数！', 1000);}
                                // else if(this.state.slectMutipleTwo ==''||this.state.slectMutipleTwo == '0'){this.refs.Toast && this.refs.Toast.show('请输入投注倍数！', 1000);
                                //
                                // }
                                // else {
                                //     this.setState({isShow:false,slectMutipleOne:'1',slectMutipleTwo:'1'});
                                //     this.props.addToShopCarClick ? this.props.addToShopCarClick(this.state.ballSourceArr) : null;
                                // }
                                // this.setState({visible:false});
                                let chasePlanStr = '';
                                let planType = 0;
                                if (this.state.showBtn1) {
                                    if (this.state.maxYinglilv < 0) {
                                        if (this.state.minimumProfitabilityInTheWholeProcess > this.state.maxYinglilv) {
                                            this.setState({minimumProfitabilityInTheWholeProcess: (this.state.maxYinglilv - 1 + '')});

                                        }
                                    }
                                    chasePlanStr = `全程最低盈利率${this.state.minimumProfitabilityInTheWholeProcess}%`;
                                    planType = 1;
                                }
                                else if (this.state.showBtn2) {

                                    if (this.state.maxYinglilv < 0) {
                                        //前面
                                        if (this.state.beforePeriodProfitability > this.state.maxYinglilv) {
                                            this.setState({beforePeriodProfitability: (this.state.maxYinglilv - 1 + '')});
                                        }
                                        //    后面
                                        if (this.state.afterPeriodProfitability > this.state.beforePeriodProfitability) {
                                            this.setState({afterPeriodProfitability: (this.state.beforePeriodProfitability - 1 + '')});

                                            console.log(this.afterPeriodProfitability);
                                        }
                                    }

                                    chasePlanStr = `前${this.state.beforePeriod}期${this.state.beforePeriodProfitability}%之后盈利率${this.state.afterPeriodProfitability}%`;
                                    planType = 2;
                                }
                                else {
                                    chasePlanStr = `全程最低盈利${this.state.totalProfitability}元`;
                                    planType = 3;
                                }


                                this.state.disscallBack(false, {
                                    qishu: (this.state.qishu > 20 ? 20 : this.state.qishu),  //追号期数
                                    startBeishu: this.state.beishu,  //起始倍数
                                    chasePlanStr: chasePlanStr,       //追号描述
                                    minimumProfitabilityInTheWholeProcess: this.state.minimumProfitabilityInTheWholeProcess, //方案一全程最低盈利
                                    beforePeriod: this.state.beforePeriod,    //方案二的前多少期
                                    beforePeriodProfitability: this.state.beforePeriodProfitability,  //方案二前面期数
                                    afterPeriodProfitability: this.state.afterPeriodProfitability,   //方案二后面期数最低盈利
                                    totalProfitability: this.state.totalProfitability,           //方案三全程最低盈利
                                    planType: planType,       //追号方案
                                    qiShu:qishuArr[this.state.selseqishu],
                                    qiShuIndex:this.state.selseqishu
                                });
                            }}><CusBaseText
                                style={{
                                    fontSize: Adaption.Font(20, 17),
                                    color: 'white',
                                    fontWeight: '700'
                                }}>生成追号</CusBaseText>
                            </TouchableOpacity>
                            {this.state.showQishuModal?(<View style={{
                                position: 'absolute',
                                left: 20,
                                top: 100,
                                width: 100,
                                // height: width - 40,
                                backgroundColor: 'white',
                                width: width - 40,
                                borderRadius:5,
                                borderColor:'#9d9d9d',
                                borderWidth:1
                                // flexDirection:'row'
                            }}><FlatList
                                // extraData={this.state.indexone}
                                automaticallyAdjustContentInsets={false}
                                alwaysBounceHorizontal = {false}
                                data = {qishuArr}
                                renderItem = {(item)=>this._renderItemView(item)}
                                horizontal = {false}
                                numColumns = {2}
                            >
                            </FlatList>
                                {/*<TouchableOpacity activeOpacity={0.5} style={{*/}
                                    {/*justifyContent: 'center', alignItems: 'center',*/}
                                    {/*width: SCREEN_WIDTH * 0.40,*/}
                                    {/*height: Adaption.Height(55),*/}
                                    {/*marginLeft: 12,*/}
                                    {/*marginTop: Adaption.Height(26),*/}
                                    {/*borderRadius: 5,*/}
                                {/*}}*/}
                                                  {/*onPress={() => {*/}
                                                      {/*// this.props.caiZhongClick ? this.props.caiZhongClick(item.item.value,item.index) : null*/}
                                                  {/*}}><View style={{*/}
                                    {/*width: SCREEN_WIDTH * 0.40,*/}
                                    {/*height: Adaption.Height(55),*/}
                                    {/*justifyContent: 'center',*/}
                                    {/*alignItems: 'center',*/}
                                    {/*borderColor: '#E0E0E0',*/}
                                    {/*borderWidth: 1,*/}
                                    {/*borderRadius: 5,*/}
                                {/*}}*/}
                                {/*><CusBaseText style={{}}>1000000</CusBaseText></View>*/}
                                {/*</TouchableOpacity>*/}
                                {/*<TouchableOpacity activeOpacity={0.5} style={{*/}
                                    {/*justifyContent: 'center', alignItems: 'center',*/}
                                    {/*width: SCREEN_WIDTH * 0.40,*/}
                                    {/*height: Adaption.Height(55),*/}
                                    {/*marginLeft: 12,*/}
                                    {/*marginTop: Adaption.Height(26),*/}
                                    {/*borderRadius: 5,*/}
                                {/*}}*/}
                                                  {/*onPress={() => {*/}
                                                      {/*// this.props.caiZhongClick ? this.props.caiZhongClick(item.item.value,item.index) : null*/}
                                                  {/*}}><View style={{*/}
                                    {/*width: SCREEN_WIDTH * 0.40,*/}
                                    {/*height: Adaption.Height(55),*/}
                                    {/*justifyContent: 'center',*/}
                                    {/*alignItems: 'center',*/}
                                    {/*borderColor: '#E0E0E0',*/}
                                    {/*borderWidth: 1,*/}
                                    {/*borderRadius: 5,*/}
                                {/*}}*/}
                                {/*><CusBaseText style={{}}>1000000</CusBaseText></View>*/}
                                {/*</TouchableOpacity>*/}
                                {/*<TouchableOpacity activeOpacity={0.5} style={{*/}
                                    {/*justifyContent: 'center', alignItems: 'center',*/}
                                    {/*width: SCREEN_WIDTH * 0.40,*/}
                                    {/*height: Adaption.Height(55),*/}
                                    {/*marginLeft: 12,*/}
                                    {/*marginTop: Adaption.Height(26),*/}
                                    {/*borderRadius: 5,*/}
                                {/*}}*/}
                                                  {/*onPress={() => {*/}
                                                      {/*// this.props.caiZhongClick ? this.props.caiZhongClick(item.item.value,item.index) : null*/}
                                                  {/*}}><View style={{*/}
                                    {/*width: SCREEN_WIDTH * 0.40,*/}
                                    {/*height: Adaption.Height(55),*/}
                                    {/*justifyContent: 'center',*/}
                                    {/*alignItems: 'center',*/}
                                    {/*borderColor: '#E0E0E0',*/}
                                    {/*borderWidth: 1,*/}
                                    {/*borderRadius: 5,*/}
                                {/*}}*/}
                                {/*><CusBaseText style={{}}>1000000</CusBaseText></View>*/}
                                {/*</TouchableOpacity>*/}
                                {/*<TouchableOpacity activeOpacity={0.5} style={{*/}
                                    {/*justifyContent: 'center', alignItems: 'center',*/}
                                    {/*width: SCREEN_WIDTH * 0.40,*/}
                                    {/*height: Adaption.Height(55),*/}
                                    {/*marginLeft: 12,*/}
                                    {/*marginTop: Adaption.Height(26),*/}
                                    {/*borderRadius: 5,*/}
                                {/*}}*/}
                                                  {/*onPress={() => {*/}
                                                      {/*// this.props.caiZhongClick ? this.props.caiZhongClick(item.item.value,item.index) : null*/}
                                                  {/*}}><View style={{*/}
                                    {/*width: SCREEN_WIDTH * 0.40,*/}
                                    {/*height: Adaption.Height(55),*/}
                                    {/*justifyContent: 'center',*/}
                                    {/*alignItems: 'center',*/}
                                    {/*borderColor: '#E0E0E0',*/}
                                    {/*borderWidth: 1,*/}
                                    {/*borderRadius: 5,*/}
                                {/*}}*/}
                                {/*><CusBaseText style={{}}>1000000</CusBaseText></View>*/}
                                {/*</TouchableOpacity>*/}
                                {/*<TouchableOpacity activeOpacity={0.5} style={{*/}
                                    {/*justifyContent: 'center', alignItems: 'center',*/}
                                    {/*width: SCREEN_WIDTH * 0.40,*/}
                                    {/*height: Adaption.Height(55),*/}
                                    {/*marginLeft: 12,*/}
                                    {/*marginTop: Adaption.Height(26),*/}
                                    {/*borderRadius: 5,*/}
                                {/*}}*/}
                                                  {/*onPress={() => {*/}
                                                      {/*// this.props.caiZhongClick ? this.props.caiZhongClick(item.item.value,item.index) : null*/}
                                                  {/*}}><View style={{*/}
                                    {/*width: SCREEN_WIDTH * 0.40,*/}
                                    {/*height: Adaption.Height(55),*/}
                                    {/*justifyContent: 'center',*/}
                                    {/*alignItems: 'center',*/}
                                    {/*borderColor: '#E0E0E0',*/}
                                    {/*borderWidth: 1,*/}
                                    {/*borderRadius: 5,*/}
                                {/*}}*/}
                                {/*><CusBaseText style={{}}>1000000</CusBaseText></View>*/}
                                {/*</TouchableOpacity>*/}
                            </View>):null}


                        </View>


                    </View>
                </Modal>

            </View>


        )
    }

    _renderItemView(item){
        console.log(item);
        return(this.state.selseqishu==item.index?(<TouchableOpacity activeOpacity={0.5} style={{
            justifyContent: 'center', alignItems: 'center',
            width: SCREEN_WIDTH * 0.40,
            height: Adaption.Height(45),
            marginLeft: 12,
            marginVertical: Adaption.Height(3),
            marginTop:6,
            borderRadius: 5,
        }}
                          onPress={() => {
                              // this.props.caiZhongClick ? this.props.caiZhongClick(item.item.value,item.index) : null
                              this.setState({selseqishu:item.index,showQishuModal:false});
                          }}><View style={{
            width: SCREEN_WIDTH * 0.40,
            height: Adaption.Height(45),
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#E0E0E0',
            borderWidth: 1,
            borderRadius: 5,
        }}
        ><ImageBackground style={{
            width: SCREEN_WIDTH * 0.40,
            height:Adaption.Height(45),
            justifyContent: 'center',
            alignItems: 'center',
        }}
                          resizeMode={'stretch'}
                          source={ require('../../../../me/img/ic_select_box.png') }
        ><CusBaseText style={{}}>{item.item}</CusBaseText></ImageBackground></View>
        </TouchableOpacity>):(<TouchableOpacity activeOpacity={0.5} style={{
            justifyContent: 'center', alignItems: 'center',
            width: SCREEN_WIDTH * 0.40,
            height: Adaption.Height(45),
            marginLeft: 12,
            marginVertical: Adaption.Height(3),
            marginTop:6,
            borderRadius: 5,
        }}
                                                onPress={() => {
                                                    // this.props.caiZhongClick ? this.props.caiZhongClick(item.item.value,item.index) : null
                                                    this.setState({selseqishu:item.index,showQishuModal:false});
                                                }}><View style={{
            width: SCREEN_WIDTH * 0.40,
            height: Adaption.Height(45),
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#E0E0E0',
            borderWidth: 1,
            borderRadius: 5,
        }}
        ><CusBaseText style={{}}>{item.item}</CusBaseText></View>
        </TouchableOpacity>))
    }

    openQiShu() {
        this.setState({
            showQishuModal: !this.state.showQishuModal,
        })
    }


}


const styles = StyleSheet.create({
    container: {
        height: height == 812 ? 88 : 64,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    leftStyle: {
        position: 'absolute',
        top: 18,
        left: 20,
        paddingLeft: 15,
        width: 10,

        resizeMode: 'contain'
    },
    rightStyle: {
        // backgroundColor: 'yellow',
        marginTop: height == 812 ? 44 : 20,
        paddingRight: 10,
        // marginRight: 15,
        // alignItems: 'flex-end',
        // justifyContent: 'flex-end',
        alignSelf: 'center',
        textAlign: 'right',
        color: 'white',
        fontSize: 18,
        width: (width - 180) / 2,
    },
    // 1 cover 等比拉伸
    // 2 stretch 保持原有大小
    // 3 contain  图片拉伸  充满空间
    imageLogoStyle: {
        backgroundColor: 'transparent',
        position: 'absolute',
        left: width / 2.0 - 75,
        marginTop: height == 812 ? 54 : 30,
        width: 150,
        fontSize: 18,

        color: 'white',

        textAlign: 'center'
    },

    imageLogoStyle2: {
        backgroundColor: 'transparent',
        position: 'absolute',
        left: width / 2.0 - 100,
        marginTop: height == 812 ? 54 : 30,
        width: 150,
        fontSize: 18,

        color: 'white',

        textAlign: 'center'
    },

    nav_headerLeft_view: {
        width: 15,
        height: 15,
        borderColor: '#fff',
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        transform: [{rotate: '45deg'}],
        position: 'absolute',

        left: 13,
        paddingLeft: 15,
        width: 10,
    },


});