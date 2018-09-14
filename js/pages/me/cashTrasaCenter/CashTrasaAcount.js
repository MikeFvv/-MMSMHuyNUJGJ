
import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    TextInput,
    View,
} from 'react-native';

export default class CashTrasaAcount extends Component {

    static navigationOptions = ({navigation}) => ({

        header: (
            <CustomNavBar
                centerText = {'现金交易'}
                leftClick={() =>  navigation.goBack() }
            />
        ),

    });

    constructor(props) {
      super(props);
      this.loginObject = null;
      this.userAcount = '';
    }

    componentDidMount() {
        this.loginObject = global.UserLoginObject;
    }

    _cleanUserAcount = () => {
        this.userAcount = '';
        this.refs.userAcountInput.clear();
    }


    render(){

        return (
            <View style={styles.container}>
                <TextInput
                    ref="userAcountInput"
                    style={styles.input}
                    placeholder='请输入对方账户'
                    underlineColorAndroid='transparent'
                    onChangeText={(text) => this.userAcount=text}
                />
                <CusBaseText style={styles.tip}>钱将实时转入对方账户，无法退款</CusBaseText>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.nextBtn}
                    onPress={()=>this._nextBtnClicked()}
                >
                    <CusBaseText style={styles.nextText}>下一步</CusBaseText>
                </TouchableOpacity>
                <LoadingView ref="LoadingView"/>
            </View>
        );
    }

    _nextBtnClicked = () => {

        if (global_isSpace(this.userAcount) || this.userAcount.trim().length == 0) {
            this.refs.LoadingView && this.refs.LoadingView.showFaile("请输入对方账户");
            return;
        }

        let params = new FormData();
        params.append("ac", "TradGetUserInfo");
        params.append("username", this.userAcount.trim());
        params.append("uid", UserLoginObject.Uid);
        params.append("token", UserLoginObject.Token);
        params.append("sessionkey", UserLoginObject.session_key);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
          .then((responseData) => {

            if (responseData.msg == 0) {

                let result = responseData.data;
                result.account = this.userAcount.trim();
                this.props.navigation.navigate('CashTrasaInfo',{info:result,cleanUserAcount:this._cleanUserAcount});

            }else {
                this.refs.LoadingView && this.refs.LoadingView.showFaile(responseData.param);
            }

          })
        .catch((err) => {
            if (err && typeof(err) === 'string' && err.length > 0) {
                this.refs.LoadingView && this.refs.LoadingView.showFaile(err);
            }
        })
    }

}

const styles = StyleSheet.create({

    container:{
        flex:1,
    },

    input:{
        padding:0,
        marginTop:10,
        height:35,
        backgroundColor:'white',
        paddingLeft:20,
        fontSize:16,
    },

    tip:{
        fontSize:15,
        color:'rgb(148, 148, 148)',
        marginLeft: 20,
        marginTop:10,
    },

    nextBtn:{
        backgroundColor:COLORS.appColor,
        height:35,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
        marginRight: 20,
        marginTop:20,
        borderRadius:5,
    },

    nextText:{
        fontSize:15,
        color:'white',
    },

})