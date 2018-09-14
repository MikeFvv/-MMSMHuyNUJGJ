import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    WebView,
} from 'react-native';

export default class Agenthat extends Component {

    static navigationOptions = ({ navigation }) => ({

        header: (
            <CustomNavBar
                centerText = {"代理说明"}
                leftClick={() =>  navigation.goBack() }
            />
        ),

    });

    constructor(props){
        super(props);

        this.state = ({
            agentHTML:'',  //代理说明HTML字符串
        })
    }

    componentDidMount(){

        this._fetchAgentHtmlData();
    }

    _fetchAgentHtmlData(){

        let params = new FormData();
        params.append("ac", "getSpecialContent");
        params.append("uid", global.UserLoginObject.Uid);
        params.append("token", global.UserLoginObject.Token);
        params.append('sessionkey', global.UserLoginObject.session_key);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);

        promise
            .then(response => {

                if (response.msg == 0 && response.data) {

                    //判断是否为加密的字符，如果不是则直接去解析，如果是则先解密后再解析
                    let dataStr = response.data.content.substr(0, response.data.content.length-2)
                    let preg = /^[A-Za-z0-9]+$/;
                    let is = preg.test(dataStr);
                    let lastHtml = '';
                    if(is==true){
                        lastHtml =  this._decodeHtml(response.data.content)
                    }else {
                        lastHtml = response.data.content;
                    }

                    let agentHtmlstr = this._replaceStr(lastHtml);
                    this.setState({agentHTML:agentHtmlstr});
                }
            })
            .catch(err => { })
    }

    //自定义解密算法
    _decodeHtml(val) {

        let valByte = [];
        let keyByte = [`0`.charCodeAt(0)]; // 48  拿到'0'的Ascii码值

        for (let a = 0; a < val.length; a++) {
            valByte.push( parseInt(val[a], 16));  //将每个字符转成16进制
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
        return decodeURIComponent(escape(str));  //解决中文编码问题

    }

    //去掉html转义的字符
    _replaceStr(htmlStr){

        let chatServiceURL1 = htmlStr.replace(/&amp;/g,"&");
        let chatServiceURL2 = chatServiceURL1.replace(/&gt;/g,">");
        let chatServiceURL3 = chatServiceURL2.replace(/&lt;/g,"<");
        let chatServiceURL4 = chatServiceURL3.replace(/&quot;/g,"");
        let chatServiceURL5 = chatServiceURL4.replace(/&#039;/g,"");

        return chatServiceURL5;
    }

    render(){

        return (
          <View style = {styles.container}>
              <Image style={{width: SCREEN_WIDTH, height: 105}} source={require('./img/ic_agent_shuoming.png')}/>
              <WebView
                  style = {{width:SCREEN_WIDTH, height:SCREEN_HEIGHT - 105}}
                  bounces={false}
                  source={{html:this.state.agentHTML ? this.state.agentHTML : ''}}
                  automaticallyAdjustContentInsets={false}
                  scalesPageToFit={false}
              />
          </View>
        );
    }

}



const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
    },

})
