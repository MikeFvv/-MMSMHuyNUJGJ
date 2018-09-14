
import React, { Component } from 'react';
import {
    View,
    Modal,
    TouchableOpacity,
    Dimensions,
    WebView,
    Image
} from 'react-native';
const { width, height } = Dimensions.get("window");
import BaseNetwork from "../../skframework/component/BaseNetwork"; //网络请求

export default class HomeGongGao extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gongGaoContent:[],
            isShowGongGao:false,
          };
          this.isTiShi = false;
      
    }

    componentDidMount() {
        setTimeout(() => {
            this._onSheZhiTanChuang();
          }, 1300)

    //接受登录的通知
    this.subscription4 = PushNotification.addListener('LoginSuccess', (loginObject) => {


        {
          let yindaoKey = 'HomeYinDaoObjcet';
          UserDefalts.getItem(yindaoKey, (error, result) => {
              if (!error) {
                  if (result !== '' && result !== null) {
                      let yindao = JSON.parse(result);
                      if(yindao.homeYinDao==1){
                        setTimeout(() => {
                          this._onSheZhiTanChuang();
                        }, 4500)
                      }else{
                        setTimeout(() => {
                          this._onSheZhiTanChuang();
                        }, 500)  
                      }
                  } else {
                    setTimeout(() => {
                      this._onSheZhiTanChuang();
                    }, 500)
                  }
              }
          });
      
        }

      });
    }

    _onSheZhiTanChuang() {

        if (this.isTiShi == false) {
          if (global.UserLoginObject.Token == '' || global.UserLoginObject.Token.length == 0) {
            if (GongGaoContent.length == 0 || GongGaoContent == null) {
              this._fetchNoGongGaoData();
            } else {
              this.setState({ gongGaoContent: GongGaoContent, isShowGongGao: true })
            }
    
            // this._fetchNoGongGaoData();
          } else {
            this._fetchTokenGongGaoData();
          }
        } else {
          this.setState({ isShowGongGao: false })
        }
      }


  //获取不登录时公告弹窗
  _fetchNoGongGaoData() {
    //请求参数
    let params = new FormData();
    params.append("ac", "getNoticeAppForOffline");


    var promise = GlobalBaseNetwork.sendNetworkRequest(params);

    promise
      .then(response => {
        if (response.msg == 0) {
          if (response.data != undefined&&response.data.length>0) {
            this.setState({ gongGaoContent: response.data, isShowGongGao: true })
          }

        } 
      })
      .catch(err => {
      });
  }


      _fetchTokenGongGaoData() {

        //请求参数
        let params = new FormData();
        params.append("ac", "getNoticeAppForOnline");
        params.append("uid", global.UserLoginObject.Uid);
        params.append("token", global.UserLoginObject.Token);
        params.append("sessionkey", global.UserLoginObject.session_key);
    
        var promise = BaseNetwork.sendNetworkRequest(params);
    
        promise
          .then(response => {
    
            if (response.msg == 0) {
    
              if (response.data != undefined&&response.data.length>0) {
    
                this.setState({ gongGaoContent: response.data, isShowGongGao: true })
              }
    
            } else {
              // { this._alertShow(response.param) };
            }
    
          })
          .catch(err => {
          });
    
      }
     //我知道啦
  onDown() {
    this.isTiShi = false;

    this.setState({ gongGaoContent: [], isShowGongGao: false })
  }

  //不再提示
  onBuZaiDown() {
    this.isTiShi = true;

    this.setState({ gongGaoContent: [], isShowGongGao: false })
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

  //弹窗
  _isShowReceiveRedEnvel(content) {

    if (content.length != 0) {
      if (content[0].msgtype == 0) {
        let isTrue = true;
        if (global.iOS) {
          isTrue = false;
        } else {
          isTrue = true;
        }
        let preg = /^[A-Za-z0-9]+$/;
        let is = preg.test(content[0].content);
        let gonggaoContent = '';
        if(is==true){
          gonggaoContent =  this._decipher(content[0].content);
        }else {
          gonggaoContent = content[0].content;
        }
    
        let aa = gonggaoContent.replace(/&amp;/g,"&");
        let bb = aa.replace(/&gt;/g,">");
        let cc = bb.replace(/&lt;/g,"<");
        let dd = cc.replace(/&quot;/g,"'");
        let pop = dd.replace(/&#039;/g,"\"");
   

        return (
          <View style={{
            backgroundColor: 'rgba(0,0,0,0.1)',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <View style={{
              width: width - 40,
              height: 345,
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 10
            }}>
              <CusBaseText style={{ fontSize: Adaption.Font(15, 15), color: '#000', textAlign: 'center' }}>
                公告提示
                        </CusBaseText>
              <View
                style={{ width: width - 60, height: 270, marginTop: 5 }}>
                <WebView style={{ width: width - 60, height: 270 }}
                  scalesPageToFit={isTrue}
                  bounces={false}
                  source={{ html: pop, }}// baseUrl: ''中文乱码解决
                />
              </View>

              <View style={{
                width: width - 30,
                flexDirection: 'row',
                marginTop: 2,
                borderTopWidth: 1,
                marginLeft: -15,
                borderColor: 'lightgrey',
              }}>
                <TouchableOpacity activeOpacity={1}
                  style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => this.onDown()}>
                  <CusBaseText
                    style={{ fontSize: Adaption.Font(15, 15), color: '#00BFFF', textAlign: 'center' }}>
                    我知道了
                                </CusBaseText>
                </TouchableOpacity>
                <View style={{ width: 1, height: 42, backgroundColor: 'lightgrey' }}></View>
                <TouchableOpacity activeOpacity={1}
                  style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => this.onBuZaiDown()}>
                  <CusBaseText
                    style={{ fontSize: Adaption.Font(15, 15), color: 'red', textAlign: 'center' }}
                    allowFontScaling={false}>
                    不再提示
                                </CusBaseText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      } else {
        return (
          <View style={{
            backgroundColor: 'rgba(0,0,0,0.1)',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <View style={{
              width: width - 40,
              height: 345,
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 10
            }}>
              <CusBaseText style={{ fontSize: Adaption.Font(15, 15), color: '#000', textAlign: 'center' }}>
                公告提示
                        </CusBaseText>
              <View
                style={{ width: width - 60, height: 270, marginTop: 5 }}>
                <Image style={{ width: width - 60, height: 270 }}
                  resizeMode={'contain'}
                  source={{ uri: GlobalConfig.homeNotice() + content[0].phone_img }}
                ></Image>
              </View>
              <View style={{
                width: width - 30,
                flexDirection: 'row',
                marginTop: Android ? -7 : 2,
                borderTopWidth: 1,
                marginLeft: -15,
                borderColor: 'lightgrey',
              }}>
                <TouchableOpacity activeOpacity={1}
                  style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => this.onDown()}>
                  <CusBaseText
                    style={{ fontSize: Adaption.Font(15, 15), color: '#00BFFF', textAlign: 'center' }}>
                    我知道了
                                </CusBaseText>
                </TouchableOpacity>
                <View style={{ width: 1, height: 42, backgroundColor: 'lightgrey' }}></View>
                <TouchableOpacity activeOpacity={1}
                  style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => this.onBuZaiDown()}>
                  <CusBaseText
                    style={{ fontSize: Adaption.Font(15, 15), color: 'red', textAlign: 'center' }}
                    allowFontScaling={false}>
                    不再提示
                                </CusBaseText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      }
    }
  }

  onRequestClose() {
    this.setState({ isShowGongGao: false })
  }


    render() {
        return <View style={{ flex: 1 }}>
             {this.state.gongGaoContent != null ? <Modal
          visible={this.state.isShowGongGao}
          //显示是的动画默认none
          //从下面向上滑动slide
          //慢慢显示fade
          animationType={'none'}
          //是否透明默认是不透明 false
          transparent={true}
          //关闭时调用
          onRequestClose={() => this.onRequestClose()}
        >{this._isShowReceiveRedEnvel(this.state.gongGaoContent)}</Modal> : null}
            {/* <Modal
                visible={this.props.isClose}
                animationType={'none'}
                transparent={true}
                onRequestClose={() => { }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        this.props.close ? this.props.close() : null;
                    }}>
                    <View style={{ height: topHeight, width: SCREEN_WIDTH }}>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{ height: SCREEN_HEIGHT - topHeight, backgroundColor: 'rgba(0,0,0,0.4)' }}
                    onPress={() => {

                        this.props.close ? this.props.close() : null;
                    }}>
                    <View style={{ width: SCREEN_WIDTH, height: Adaption.Width(80), backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity activeOpacity={1}
                            style={{
                                backgroundColor: this.props.slectIndex == 0 ? '#e03a38' : 'white',
                                borderRadius: 5,
                                borderWidth: this.props.slectIndex == 0 ? 0 : 1,
                                borderColor: 'lightgray',
                                width: Adaption.Width(120),
                                height: Adaption.Width(40),
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: Adaption.Width(30),
                            }}
                            onPress={() => {

                                if (this.props.slectIndex == 0) {
                                    this.props.close ? this.props.close() : null;
                                } else {
                                    this.props.onChange ? this.props.onChange(0) : null;
                                }

                            }}>
                            <CusBaseText style={{ fontSize: Adaption.Font(19, 15), color: this.props.slectIndex == 0 ? 'white' : 'black' }}>
                                官方玩法
                            </CusBaseText>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1}
                            style={{
                                backgroundColor: this.props.slectIndex == 1 ? '#e03a38' : 'white',
                                borderRadius: 5,
                                borderWidth: this.props.slectIndex == 1 ? 0 : 1,
                                borderColor: 'lightgray',
                                width: Adaption.Width(120),
                                height: Adaption.Width(40),
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onPress={() => {

                                if (this.props.slectIndex == 1) {
                                    this.props.close ? this.props.close() : null;
                                } else {
                                    this.props.onChange ? this.props.onChange(1) : null;
                                }

                            }}>
                            <CusBaseText style={{ fontSize: Adaption.Font(19, 15), color: this.props.slectIndex == 1 ? 'white' : 'black' }}>
                                双面玩法
                            </CusBaseText>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal> */}
        </View>
    }
}