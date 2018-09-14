
import React, { Component } from 'react';
import {
    StyleSheet,
    WebView,
    View,
} from 'react-native';
import BaseNetwork from "../../skframework/component/BaseNetwork"; //网络请求
export default class PreferentialDetial extends Component {

    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({ navigation }) => ({

        header: (
            <CustomNavBar
                centerText = {"活动详情"}
                leftClick={() =>  navigation.goBack() }
            />
        ),

    });

    constructor(props) {
        super(props);

        this.state = {
          preferentialDetialArray:'',
        };
    }


    componentDidMount(){
        this._fetchPreferentialDetialData();
        this.refs.LoadingView && this.refs.LoadingView.cancer(1);
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

    _fetchPreferentialDetialData() {
            this.refs.LoadingView && this.refs.LoadingView.showLoading('正在加载中...');
                //请求参数
              let params = new FormData();
               params.append("ac", "getEventContent");
                params.append("eid", this.props.navigation.state.params.personString);
                params.append("wtype", "");
                 var promise = BaseNetwork.sendHuoDongNetworkRequest(params);
                //var promise = BaseNetwork.sendNetworkRequest(params);
        
                promise.then(response => {
                    let array = response.split('"data":"');
                      let datalist = array[1].substr(0, array[1].length-2)
                      let preg = /^[A-Za-z0-9]+$/;
                      let is = preg.test(datalist);
                      let aaa = '';
                      if(is==true){
                          aaa =  this._decipher(datalist);
                      }else {
                          aaa = datalist;
                      }
                        let aa = aaa.replace(/&amp;/g,"&");
                        let bb = aa.replace(/&gt;/g,">");
                        let cc = bb.replace(/&lt;/g,"<");
                        let dd = cc.replace(/&quot;/g,"'");
                        let pop = dd.replace(/&#039;/g,"\"");
                           //用set去赋值
                     this.setState({ preferentialDetialArray: pop});
                        
       })
      .catch(err => {
          console.log(err)
      });
     
    }

    render(){

        return (
        <View style = {{flex: 1}}>
           <WebView style = {styles.container}
             resizeMode={'stretch'}
             scalesPageToFit={false}
             bounces={false}
             onLoadEnd = {()=> this.refs.LoadingView && this.refs.LoadingView.cancer()}
             source={{html:this.state.preferentialDetialArray}}
            ></WebView>
            <LoadingView ref = 'LoadingView'/>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
        height:SCREEN_HEIGHT,
        width:SCREEN_WIDTH,
    },
})
