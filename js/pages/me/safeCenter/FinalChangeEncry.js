import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    StatusBar,
    Dimensions,
    TouchableOpacity,
    Alert,
    Image,


} from 'react-native';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import ModalDropdown from 'react-native-modal-dropdown';
const CONFIG = [
    '您母亲的姓名是？',
    '您父亲的姓名是？',
    '您配偶的姓名是？',
    '您的出生地是？',
    '您高中班主任的名字是？',
    '您初中班主任的名字是？',
    '您小学班主任的名字是？',
    '您的小学校名是？',
    '您父亲的生日是？',
    '您母亲的生日是？',
    '您配偶的生日是？'

];

export default class FinalChangeEncry extends  Component {

    constructor(props){
        super(props);
        this.state = {
            hint_1:0,//用户设置密保时选择的问题
            hint_2:0,
            hint_3:0,
            question_ans1:'',
            question_ans2:'',
            question_ans3:'',

            waiting: false,//防多次点击
        };
    }

    //接收上一个页面传过来的titl  e显示出来
    static navigationOptions = ({navigation}) => ({

        title: navigation.state.params.title,
        headerStyle: {backgroundColor: COLORS.appColor, marginTop: Android ?(parseFloat(global.versionSDK) > 19?StatusBar.currentHeight:0) : 0},
        headerTitleStyle: {color: 'white',alignSelf:'center'},
        //加入右边空视图,否则标题不居中  ,alignSelf:'center'
        headerRight: (
            <View style={GlobalStyles.nav_blank_view} />
        ),
        headerLeft: (
            <TouchableOpacity
                activeOpacity={1}
                style={GlobalStyles.nav_headerLeft_touch}
                onPress={() => { navigation.goBack() }}>
                <View style={GlobalStyles.nav_headerLeft_view} />
            </TouchableOpacity>
        ),
    });


    render() {
        const { navigate } = this.props.navigation;
        return (

            <View style={{flex:1,flexDirection:'column',backgroundColor:'#EBEBEB'}}>

                <View style={{height:20}}></View>

                <View style={{height:80,flexDirection:'column',backgroundColor:'white'}}>

                    <View style={styles.item_top}>
                        <View style={styles.item_left}>
                            <Text style={{fontSize:16}}>{'问题一:'}</Text>
                        </View>
                        <View style={styles.container_text}>
                            <ModalDropdown options={CONFIG}
                                           style={styles.dropdown_style}
                                           dropdownStyle={styles.dropdownStyle }
                                           defaultValue={'点击选择密保问题'}
                                           textStyle={{fontSize:15}}
                                           onSelect={(index,text) => this.setState({hint_1:(parseInt(index)+1)})}
                            />
                        </View>
                    </View>

                    <View style={styles.item_bottom}>
                        <View style={styles.item_left}>
                            <Text style={{fontSize:17}}>{'   答案'}</Text>
                        </View>

                        <View style={styles.container_text}>
                            <TextInput  onChangeText={(text) =>   this.setState({question_ans1:text})} placeholder='请输入答案' underlineColorAndroid='transparent' style={{marginLeft:8, fontSize:15,flex:3,textAlignVertical: 'center'}}></TextInput>

                        </View>
                    </View>
                </View>



                <View style={{height:20}}></View>

                <View style={{height:80,flexDirection:'column',backgroundColor:'white'}}>

                    <View style={styles.item_top}>
                        <View style={styles.item_left}>
                            <Text style={{fontSize:16}}>{'问题二:'}</Text>
                        </View>
                        <View style={styles.container_text}>
                            <ModalDropdown options={CONFIG}
                                           style={styles.dropdown_style}
                                           dropdownStyle={styles.dropdownStyle }
                                           defaultValue={'点击选择密保问题'}
                                           textStyle={{fontSize:15}}
                                           onSelect={(index,text) => this.setState({hint_2:(parseInt(index)+1)})}
                            />
                        </View>
                    </View>

                    <View style={styles.item_bottom}>
                        <View style={styles.item_left}>
                            <Text style={{fontSize:17}}>{'   答案'}</Text>
                        </View>

                        <View style={styles.container_text}>
                            <TextInput  onChangeText={(text) =>   this.setState({question_ans2:text})} placeholder='请输入答案' underlineColorAndroid='transparent' style={{marginLeft:8, fontSize:15,flex:3,textAlignVertical: 'center'}}></TextInput>

                        </View>
                    </View>
                </View>


                <View style={{height:20}}></View>

                <View style={{height:80,flexDirection:'column',backgroundColor:'white'}}>

                    <View style={styles.item_top}>
                        <View style={styles.item_left}>
                            <Text style={{fontSize:16}}>{'问题三:'}</Text>
                        </View>
                        <View style={styles.container_text}>
                            <ModalDropdown options={CONFIG}
                                           style={styles.dropdown_style}
                                           dropdownStyle={styles.dropdownStyle }
                                           defaultValue={'点击选择密保问题'}
                                           textStyle={{fontSize:15}}
                                           onSelect={(index,text) => this.setState({hint_3:(parseInt(index)+1)})}
                            />
                        </View>
                    </View>

                    <View style={styles.item_bottom}>
                        <View style={styles.item_left}>
                            <Text style={{fontSize:17}}>{'   答案'}</Text>
                        </View>

                        <View style={styles.container_text}>
                            <TextInput  onChangeText={(text) =>   this.setState({question_ans3:text})} placeholder='请输入答案' underlineColorAndroid='transparent' style={{marginLeft:8, fontSize:15,flex:3,textAlignVertical: 'center'}}></TextInput>

                        </View>
                    </View>
                </View>


                <TouchableOpacity  disabled={this.state.waiting} activeOpacity={0.65}  onPress={() => this._repeatClick(navigate)}>
                    <View style={{height:45,backgroundColor:COLORS.appColor,marginLeft:20,marginRight:20, borderRadius:5,marginTop:50,justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color:'white',fontSize:17}}>{'确定'}</Text>
                    </View>
                </TouchableOpacity>

                <LoadingView ref = 'LoadingView'/>

            </View>

        );


    }

    _repeatClick(navigate){
        this.setState({waiting: true});
        this._setingPsd();
        setTimeout(()=> {
            this.setState({waiting: false})
        }, 2000);

    }

    _setingPsd(){

        this.state.question_ans1 = this.state.question_ans1.trim();
        this.state.question_ans2 = this.state.question_ans2.trim();
        this.state.question_ans3 = this.state.question_ans3.trim();

        if (this.state.hint_1 == 0){
            this._showInfo('问题1不能为空');
            return;
        }
        else if (this.state.question_ans1.length == 0 || this.state.question_ans1 == '') {
            this._showInfo('请输入问题1的答案');
            return;
        }
        else if (this.state.hint_2 == 0){
            this._showInfo('问题2不能为空');
            return;
        }
        else  if (this.state.question_ans2.length == 0 || this.state.question_ans2 == ''){
            this._showInfo('请输入问题2的答案');
            return;
        }
        else if (this.state.hint_3 == 0){
            this._showInfo('问题3不能为空');
            return;
        }
        else if (this.state.question_ans3.length == 0 || this.state.question_ans3 == '') {
            this._showInfo('请输入问题3的答案');
            return;
        }
        else {

            this.refs.LoadingView && this.refs.LoadingView.showLoading('正在修改密保问题...');

            let params = new FormData();

            params.append("ac", "FPchangeUserHint");
            params.append("accessCode",this.props.navigation.state.params.code);
            params.append("hint_1", this.state.hint_1);
            params.append("hint_2", this.state.hint_2);
            params.append("hint_3", this.state.hint_3);
            params.append("answer_1",this.state.question_ans1);
            params.append("answer_2",this.state.question_ans2);
            params.append("answer_3",this.state.question_ans3);
            params.append('uid', global.UserLoginObject.Uid);
            params.append('sessionkey', global.UserLoginObject.session_key);
            params.append('token', global.UserLoginObject.Token);

            var promise = GlobalBaseNetwork.sendNetworkRequest (params);

            promise
                .then(response => {
                    this.refs.LoadingView && this.refs.LoadingView.cancer();
                    //  请求成功
                    if (response.msg == 0) {
                        this._updateInfo(this.state.hint_1,this.state.hint_2,this.state.hint_3);//更新数据

                        Alert.alert(
                            '提示',
                            '修改成功',
                            [
                                {text:'确定', onPress: () => {
                                    if (global.changeEncryptKey) {
                                        this.props.navigation.goBack(changeEncryptKey);
                                        return;
                                    }
                                }},
                            ]
                        );

                    }
                    else {
                        if (response.param) {
                            this.refs.LoadingView && this.refs.LoadingView.showFaile(response.param);
                        }
                    }
                })
                .catch(err => {
                    if (err && typeof(err) === 'string' && err.length > 0) {
                        this.refs.LoadingView && this.refs.LoadingView.showFaile(err);
                    }
                });
        }

    }

    _updateInfo(hint_1,hint_2,hint_3){

        global.UserLoginObject.Question_1 = hint_1;//修改global对应的Question_1
        global.UserLoginObject.Question_2 = hint_2;//修改global对应的Question_2
        global.UserLoginObject.Question_3 = hint_3;//修改global对应的Question_3
        UserInfo.updateUserInfo(global.UserLoginObject, (error) => {});
        // let loginStringValue = JSON.stringify(global.UserLoginObject);
        // UserDefalts.setItem('userInfo',loginStringValue,(error) => {});

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

    item_bottom:{
        flexDirection:'row',justifyContent:'center', alignItems:'center',height:40,
    },

    item_left:{
        width:115,paddingLeft:15,justifyContent:'center', alignItems:'center'

    },
    container_text:{
        flexDirection:'row',
        flex:1,
        marginLeft:8,
        marginRight:15,
        justifyContent:'center',
        alignItems:'center'

    },

    dropdown_style:{
        height:40,flex:1,paddingLeft:10,justifyContent:'center'
    },

    dropdownStyle:{
        height:300,width:210,
    }

})
