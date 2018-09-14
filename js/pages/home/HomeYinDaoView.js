
import React, { Component } from 'react';
import {
    View,
    Modal,
    TouchableOpacity,
    Dimensions,
    Image
} from 'react-native';
const { width, height } = Dimensions.get("window");

export default class HomeYinDaoView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowYinDao:false,
          };
         
    }

    componentDidMount() {
           //接受登录的通知
    this.subscription4 = PushNotification.addListener('HomeYinDao', (loginObject) => {


        {
            if(HomeIndex == 0) {
            let yindaoKey = 'HomeYinDaoObjcet';
            UserDefalts.getItem(yindaoKey, (error, result) => {
                if (!error) {
                    if (result !== '' && result !== null) {
                        let yindao = JSON.parse(result);
                        if(yindao.homeYinDao==1&&global.ShouYeYinDao==0){
                          this.setState({isShowYinDao:true})
                        }
                    } else {
                       
                    }
                }
            });
        }
      
        }

      });
    
        let yindaoKey = 'HomeYinDaoObjcet';
        UserDefalts.getItem(yindaoKey, (error, result) => {
            if (!error) {
                if (result !== '' && result !== null) {
                    let yindao = JSON.parse(result);
                    if(yindao.homeYinDao==1&&global.ShouYeYinDao==0){
                      this.setState({isShowYinDao:true})
                    }
                } else {
                   
                }
            }
        });

    }

   


 //移除通知
 componentWillUnmount() {

   

    if (typeof (this.subscription4) == 'object') {
      this.subscription4 && this.subscription4.remove();
    }



  }

  //不再提示
  onBuZaiDown() {


    this.setState({ isShowYinDao: false })
    let homeyindaoObjcet = {
        homeYinDao: 0,
   }

   let homeYinDaoValue = JSON.stringify(homeyindaoObjcet);

   let key = 'HomeYinDaoObjcet';
   UserDefalts.setItem(key, homeYinDaoValue, (error) => {
       if (!error) {
       }
   });
  }

  //弹窗
  _isShowReceiveRedEnvel() {
      let image  = require('./img/ic_yindao5.png')
      if(height == 568) {
        image  = require('./img/ic_yindao5.png')
      }else if (height == 667) {
        image  = require('./img/ic_yindao6.png')
      } else if (height == 736) {
        image  = require('./img/ic_yindao8p.png')
      }else {
        image  = require('./img/ic_yindaox.png')
      }
   
        return (
          <TouchableOpacity style={{
            backgroundColor: 'rgba(0,0,0,0.1)',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          activeOpacity={1}
          onPress={() => this.onBuZaiDown()}>
          
         <Image style={{ width: width, height: height }}
                resizeMode={'contain'}
                 source={image}
             ></Image>
          </TouchableOpacity>
        )
  }

  onRequestClose() {
    this.setState({ isShowYinDao: false })
  }


    render() {
       
        return <View style={{ flex: 1 }}>
             {this.state.isShowYinDao != null ? <Modal
          visible={this.state.isShowYinDao}
          //显示是的动画默认none
          //从下面向上滑动slide
          //慢慢显示fade
          animationType={'none'}
          //是否透明默认是不透明 false
          transparent={true}
          //关闭时调用
          onRequestClose={() => this.onRequestClose()}
        >{this._isShowReceiveRedEnvel()}</Modal> : null}
          
        </View>
    }
}