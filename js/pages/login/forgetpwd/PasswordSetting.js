import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
export default class FindpsTrans extends Component {

    constructor(props){
        super(props);
        this.state = {
            password:'',  //密码
            passwordagain:'',  //确认密码
            waiting: false,//防多次点击

        }
    }

    //接收上一个页面传过来的titl  e显示出来
    static navigationOptions = ({navigation}) => ({

        header: (
            <CustomNavBar
                centerText = {navigation.state.params.title}
                leftClick={() =>  navigation.goBack() }
            />
        ),

        // title: navigation.state.params.title,
        // headerStyle: {backgroundColor: COLORS.appColor, marginTop: Android ?(parseFloat(global.versionSDK) > 19?StatusBar.currentHeight:0) : 0},
        // headerTitleStyle: {color: 'white',alignSelf:'center'},
        // //加入右边空视图,否则标题不居中  ,alignSelf:'center'
        // headerRight: (
        //     <View style={GlobalStyles.nav_blank_view} />
        // ),
        // headerLeft: (
        //     <TouchableOpacity
        //         activeOpacity={1}
        //         style={GlobalStyles.nav_headerLeft_touch}
        //         onPress={() => { navigation.goBack() }}>
        //         <View style={GlobalStyles.nav_headerLeft_view} />
        //     </TouchableOpacity>
        // ),
    });

    render() {
        const { navigate } = this.props.navigation;

        return (
            <View style={{flex:1,flexDirection:'column',backgroundColor:'#F3F3F3'}}>
                <View style={{flexDirection:'row',justifyContent:'center', alignItems:'center',height:40, backgroundColor:'white',marginTop:30}}>
                    <View style={styles.item_left}>
                        <Text style={{fontSize:Adaption.Font(17,15),color:'black'}}>{'新密码:'}</Text>
                    </View>

                    <View style={styles.container_text}>
                        <TextInput  secureTextEntry={true} onChangeText={(text) =>  this.setState({password:text})} placeholder='请输入密码...' underlineColorAndroid='transparent' style={{ fontSize:16,flex:3}}></TextInput>

                    </View>
                </View>

                <View style={styles.item_bottom}>
                    <View style={styles.item_left}>
                        <Text style={{fontSize:Adaption.Font(17,15),color:'black'}}>{'确认密码:'}</Text>
                    </View>

                    <View style={styles.container_text}>
                        <TextInput  secureTextEntry={true} onChangeText={(text) =>  this.setState({passwordagain:text})} placeholder='请再次输入密码...' underlineColorAndroid='transparent' style={{ fontSize:16,flex:3}}></TextInput>
                    </View>
                </View>

                <TouchableOpacity  disabled={this.state.waiting} activeOpacity={0.65} onPress={() => this._repeatClick(navigate)}>
                    <View style={{height:45,backgroundColor:COLORS.appColor,marginLeft:20,marginRight:20, borderRadius:5,marginTop:60,justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color:'white',fontSize:17}}>{'确定'}</Text>
                    </View>
                </TouchableOpacity>

                <LoadingView ref = 'LoadingView'/>

            </View>
        );
    }

    _repeatClick(navigate){
        this.setState({waiting: true});
        this._changePsd(navigate);
        setTimeout(()=> {
            this.setState({waiting: false})
        }, 2000);

    }

    _changePsd(navigate){

        if (this.state.password.length == 0 || this.state.passwordagain.length == 0){
            this._showInfo('请输入密码');
            return;
        }else if(this.state.password != this.state.passwordagain){
            this._showInfo('两次密码输入不一致');
            return;
        }


        this._fetchData(navigate);
    }


    _fetchData(navigate){
        this.refs.LoadingView && this.refs.LoadingView.showLoading('正在找回密码...');
        let params = new FormData();
        params.append("ac", "FPchangePassword");
        params.append("accessCode", this.props.navigation.state.params.data);
        params.append("pass", this.state.password);
        params.append('username', this.props.navigation.state.params.username)

        var promise = GlobalBaseNetwork.sendNetworkRequest (params);

        promise
            .then(response => {
                this.refs.LoadingView && this.refs.LoadingView.cancer();
                //请求成功
                if (response.msg == 0){
                    this._showInfo("找回密码成功");
                    if (global.forgetpwdKey) {
                        this.props.navigation.goBack(forgetpwdKey);
                        return;
                    }

                } else {
                    this._showInfo(response.param);
                }
            })
            .catch(err => { });

    }

    _showInfo(title){
        Alert.alert(
            '提示',
            title,
            [
                {text:'确定', onPress: () => {}},
            ]
        )
    }

}
const  styles = StyleSheet.create({


    item_top:{
        flexDirection:'row',justifyContent:'center', alignItems:'center',height:40
    },

    item_left:{
        width:115,paddingLeft:25,justifyContent:'center'

    },

    item_bottom:{
        flexDirection:'row',justifyContent:'center', alignItems:'center',height:40, backgroundColor:'white'
    },

    container_text:{
        flexDirection:'row',
        flex:1,
        marginRight:15,
        justifyContent:'center',
        alignItems:'center'

    },

    container_ForgetPWDView:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff',
        height:50,
        borderBottomWidth:0.5,
        borderColor:'lightgrey',
    },

})
