
import React, { Component } from 'react';
import {
    StyleSheet,
    WebView,
    StatusBar,
    TouchableOpacity,
    View
} from 'react-native';

export default class Feedback extends Component {

    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({ navigation }) => ({

        header: (
            <CustomNavBar
                centerText = {"在线客服"}
                leftClick={() => {navigation.state.params.callback(),navigation.goBack()}}
            />
        ),
    });

    componentDidMount(){
      this.refs.LoadingView && this.refs.LoadingView.showLoading('正在联系客服...');
      this.refs.LoadingView && this.refs.LoadingView.cancer(5);
    }

    render(){
        return (
           <View style = {{flex: 1}}>
             <WebView
             style = {styles.container}
             bounces={false}
             automaticallyAdjustContentInsets={false}
             source={{uri:this._chatService()}}
             >
             </WebView>
             <LoadingView ref = 'LoadingView'/>
           </View>
        );

    }

    _chatService = () => {

        if (this.props.navigation.state.params && this.props.navigation.state.params.chatServiceURL) {
            return this._formatChatServiceURL(this.props.navigation.state.params.chatServiceURL)
        }
        if (GlobalConfig.service_url()) {
            return this._formatChatServiceURL(GlobalConfig.service_url())
        }
        return "";
    }

    //后台返回URL作特殊处理
    _formatChatServiceURL = (chatServiceURL) => {
        let chatServiceURL5 = '';
        if(chatServiceURL){
            let chatServiceURL1 = chatServiceURL.replace(/(\\u0026)/g,"&").replace(/&amp;/g,"&")
            let chatServiceURL2 = chatServiceURL1.replace(/&gt;/g,">");
            let chatServiceURL3 = chatServiceURL2.replace(/&lt;/g,"<");
            let chatServiceURL4 = chatServiceURL3.replace(/&quot;/g,"");
            chatServiceURL5 = chatServiceURL4.replace(/&#039;/g,"");
        }
        return chatServiceURL5
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#f3f3f3',
        height:SCREEN_HEIGHT,
        width:SCREEN_WIDTH,
    },
})
