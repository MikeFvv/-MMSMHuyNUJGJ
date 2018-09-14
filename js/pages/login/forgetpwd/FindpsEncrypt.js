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

export default class ChangeEncrypt extends  Component {

    constructor(props){
        super(props);
        this.state = {
            hint_1:0,//用户设置密保时选择的问题
            hint_2:0,
            hint_3:0,
            question_ans1:'',
            question_ans2:'',
            question_ans3:'',

        };
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

    onPress=()=>{
        Alert.alert('yes');
    }


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
                                               onSelect={(index,text) => this.setState({hint_1:(1+parseInt(index))})}
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
                                               onSelect={(index,text) => this.setState({hint_2:(1+parseInt(index))})}
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
                                               onSelect={(index,text) => this.setState({hint_3:(1+parseInt(index))})}
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


                    <TouchableOpacity   onPress={() => this._setingPsd(navigate)}>
                        <View style={{height:45,backgroundColor:COLORS.appColor,marginLeft:20,marginRight:20, borderRadius:5,marginTop:50,justifyContent:'center', alignItems:'center'}}>
                            <Text style={{color:'white',fontSize:17}}>{'确定'}</Text>
                        </View>
                    </TouchableOpacity>

                </View>

            );
    }

    _setingPsd(navigate){
        if (this.state.question_ans1.length == 0){
            this._showInfo('答案1不能为空');
            return;
        }
        else  if (this.state.question_ans2.length == 0) {
            this._showInfo('答案2不能为空');
            return;

        }else  if (this.state.question_ans3.length == 0) {
            this._showInfo('答案3不能为空');
            return;

        }else {

            this._fetchData(navigate,this.props.navigation.state.params.username,
                this.state.hint_1,
                this.state.hint_2,
                this.state.hint_3,
                this.state.question_ans1,
                this.state.question_ans2,
                this.state.question_ans3,
            );

        }

    }

    _fetchData(navigate,user,
               hint_1,hint_2, hint_3,
               question_ans1, question_ans2,question_ans3){

        let params = new FormData();

        params.append("username", user);
        params.append("ac", "FPcheckQuestion");
        params.append("question_1", hint_1);
        params.append("answer_1",question_ans1 );
        params.append("question_2", hint_2);
        params.append("answer_2",question_ans2);
        params.append("question_3", hint_3);
        params.append("answer_3",question_ans3);


        var promise = GlobalBaseNetwork.sendNetworkRequest (params);

        promise
            .then(response => {
                //请求成功
                if (response.msg == 0){
                    navigate('PasswordSetting', {title:'密码找回',data:response.data.accessCode
                        ,username:this.props.navigation.state.params.username});
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

    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },

    container_text:{
        flexDirection:'row',
        flex:1,
        marginLeft:8,
        marginRight:15,
        justifyContent:'center',
        alignItems:'center'

    },
    item_view:{
        flexDirection:'row',
        width:SCREEN_WIDTH,
        height:165,
        marginTop:30

    },

    item_text:{
        flex:1,
        paddingLeft:15,
        justifyContent:'center',
        alignItems:'center'
    },

    item_top:{
        flexDirection:'row',justifyContent:'center', alignItems:'center',height:40
    },

    item_bottom:{
        flexDirection:'row',justifyContent:'center', alignItems:'center',height:40
    },

    item_left:{
        width:115,paddingLeft:15,justifyContent:'center', alignItems:'center'

    },

    dropdown_style:{
        height:40,flex:1,paddingLeft:10,justifyContent:'center'
    },

    dropdownStyle:{
        height:300,width:210,
    }


})
