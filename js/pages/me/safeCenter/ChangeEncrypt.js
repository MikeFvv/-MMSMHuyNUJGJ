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

            question_1:global.UserLoginObject.Question_1,
            question_2:global.UserLoginObject.Question_2,
            question_3:global.UserLoginObject.Question_3,
            waiting: false,//防多次点击
        };
    }

    //接收上一个页面传过来的titl  e显示出来
    static navigationOptions = ({navigation}) => ({

        header: (
            <CustomNavBar
                centerText = {global.UserLoginObject.Question_1 == '0'?'设置密保问题':'验证密保问题'}
                leftClick={() =>  navigation.goBack() }
            />
        ),
    });


    componentDidMount() {
        global.changeEncryptKey = this.props.navigation.state.key;
    }

    onPress=()=>{
        Alert.alert('yes');
    }

    renderContent=()=>{

        return (
            <TouchableOpacity onPress={this.onPress}>
                <CusBaseText>title:{this.state.data.title}</CusBaseText>
            </TouchableOpacity>
        );
    }

    onSelectMenu=(index, subindex, data)=>{
          this.setState({index, subindex, data});
    }

    render() {
        const { navigate } = this.props.navigation;

        if (global.UserLoginObject.Question_1 == '0' ){
            // 0 对应设置密保问题
            return (

                <View style={{flex:1,flexDirection:'column',backgroundColor:'#EBEBEB'}}>

                    <View style={{height:20}}></View>

                    <View style={{height:80,flexDirection:'column',backgroundColor:'white'}}>

                        <View style={styles.item_top}>
                            <View style={styles.item_left}>
                                <CusBaseText style={{fontSize:16}}>{'问题一:'}</CusBaseText>
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
                                <CusBaseText style={{fontSize:17}}>{'   答案'}</CusBaseText>
                            </View>

                            <View style={styles.container_text}>
                                <TextInput allowFontScaling={false} onChangeText={(text) =>   this.setState({question_ans1:text})} placeholder='请输入答案' underlineColorAndroid='transparent' style={{marginLeft:8, fontSize:15,flex:3,textAlignVertical: 'center'}}></TextInput>

                            </View>
                        </View>
                    </View>



                    <View style={{height:20}}></View>

                    <View style={{height:80,flexDirection:'column',backgroundColor:'white'}}>

                        <View style={styles.item_top}>
                            <View style={styles.item_left}>
                                <CusBaseText style={{fontSize:16}}>{'问题二:'}</CusBaseText>
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
                                <CusBaseText style={{fontSize:17}}>{'   答案'}</CusBaseText>
                            </View>

                            <View style={styles.container_text}>
                                <TextInput allowFontScaling={false} onChangeText={(text) =>   this.setState({question_ans2:text})} placeholder='请输入答案' underlineColorAndroid='transparent' style={{marginLeft:8, fontSize:15,flex:3,textAlignVertical: 'center'}}></TextInput>

                            </View>
                        </View>
                    </View>


                    <View style={{height:20}}></View>

                    <View style={{height:80,flexDirection:'column',backgroundColor:'white'}}>

                        <View style={styles.item_top}>
                            <View style={styles.item_left}>
                                <CusBaseText style={{fontSize:16}}>{'问题三:'}</CusBaseText>
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
                                <CusBaseText style={{fontSize:17}}>{'   答案'}</CusBaseText>
                            </View>

                            <View style={styles.container_text}>
                                <TextInput allowFontScaling={false} onChangeText={(text) =>   this.setState({question_ans3:text})} placeholder='请输入答案' underlineColorAndroid='transparent' style={{marginLeft:8, fontSize:15,flex:3,textAlignVertical: 'center'}}></TextInput>

                            </View>
                        </View>
                    </View>


                    <TouchableOpacity   activeOpacity={0.65} disabled={this.state.waiting} onPress={() =>this._repeatClick(navigate)}>
                        <View style={{height:45,backgroundColor:COLORS.appColor,marginLeft:20,marginRight:20, borderRadius:5,marginTop:50,justifyContent:'center', alignItems:'center'}}>
                            <CusBaseText style={{color:'white',fontSize:17}}>{'确定'}</CusBaseText>
                        </View>
                    </TouchableOpacity>

                    <LoadingView ref = 'LoadingView'/>

                </View>

            );

        }else {
            // 非0对应验证密保问题
            return (

                <View style={{flex:1,flexDirection:'column',backgroundColor:'#EBEBEB'}}>

                    <View style={{height:20}}></View>

                    <View style={{height:80,flexDirection:'column',backgroundColor:'white'}}>

                        <View style={styles.item_top}>
                            <View style={styles.item_left}>
                                <CusBaseText style={{fontSize:16}}>{'问题一:'}</CusBaseText>
                            </View>
                            <View style={styles.container_text}>
                                <ModalDropdown options={CONFIG}
                                               style={styles.dropdown_style}
                                               dropdownStyle={styles.dropdownStyle }
                                               defaultValue={CONFIG[(this.state.question_1)-1]}//数组对应的第一个是0
                                               textStyle={{fontSize:15}}
                                               onSelect={(index,text) => Alert.alert('index:'+index+'  text:'+text)}
                                               disabled={true}
                                />
                            </View>
                        </View>

                        <View style={styles.item_bottom}>
                            <View style={styles.item_left}>
                                <CusBaseText style={{fontSize:17}}>{'   答案'}</CusBaseText>
                            </View>

                            <View style={styles.container_text}>
                                <TextInput allowFontScaling={false} onChangeText={(text) =>   this.setState({question_ans1:text})} placeholder='请输入答案' underlineColorAndroid='transparent' style={{marginLeft:8, fontSize:15,flex:3,textAlignVertical: 'center'}}></TextInput>

                            </View>
                        </View>
                    </View>



                    <View style={{height:20}}></View>

                    <View style={{height:80,flexDirection:'column',backgroundColor:'white'}}>

                        <View style={styles.item_top}>
                            <View style={styles.item_left}>
                                <CusBaseText style={{fontSize:16}}>{'问题二:'}</CusBaseText>
                            </View>
                            <View style={styles.container_text}>
                                <ModalDropdown options={CONFIG}
                                               style={styles.dropdown_style}
                                               dropdownStyle={styles.dropdownStyle }
                                               defaultValue={CONFIG[(this.state.question_2)-1]}//数组对应的第一个是0
                                               textStyle={{fontSize:15}}
                                               onSelect={(index,text) => Alert.alert('index:'+index+'  text:'+text)}
                                               disabled={true}
                                />
                            </View>
                        </View>

                        <View style={styles.item_bottom}>
                            <View style={styles.item_left}>
                                <CusBaseText style={{fontSize:17}}>{'   答案'}</CusBaseText>
                            </View>

                            <View style={styles.container_text}>
                                <TextInput allowFontScaling={false} onChangeText={(text) =>   this.setState({question_ans2:text})} placeholder='请输入答案' underlineColorAndroid='transparent' style={{marginLeft:8, fontSize:15,flex:3,textAlignVertical: 'center'}}></TextInput>

                            </View>
                        </View>
                    </View>


                    <View style={{height:20}}></View>

                    <View style={{height:80,flexDirection:'column',backgroundColor:'white'}}>

                        <View style={styles.item_top}>
                            <View style={styles.item_left}>
                                <CusBaseText style={{fontSize:16}}>{'问题三:'}</CusBaseText>
                            </View>
                            <View style={styles.container_text}>
                                <ModalDropdown options={CONFIG}
                                               style={styles.dropdown_style}
                                               dropdownStyle={styles.dropdownStyle }
                                               defaultValue={CONFIG[(this.state.question_3)-1]} //数组对应的第一个是0
                                               textStyle={{fontSize:15}}
                                               onSelect={(index,text) => Alert.alert('index:'+index+'  text:'+text)}
                                               disabled={true}
                                />
                            </View>
                        </View>

                        <View style={styles.item_bottom}>
                            <View style={styles.item_left}>
                                <CusBaseText style={{fontSize:17}}>{'   答案'}</CusBaseText>
                            </View>

                            <View style={styles.container_text}>
                                <TextInput allowFontScaling={false} onChangeText={(text) =>   this.setState({question_ans3:text})} placeholder='请输入答案' underlineColorAndroid='transparent' style={{marginLeft:8, fontSize:15,flex:3,textAlignVertical: 'center'}}></TextInput>

                            </View>
                        </View>
                    </View>

                    <TouchableOpacity activeOpacity={0.65} disabled={this.state.waiting} onPress={() => this._repeatClickNext(navigate)}>
                        <View style={{height:45,backgroundColor:COLORS.appColor,marginLeft:20,marginRight:20, borderRadius:5,marginTop:60,justifyContent:'center', alignItems:'center'}}>
                            <CusBaseText style={{color:'white',fontSize:17}}>{'下一步'}</CusBaseText>
                        </View>
                    </TouchableOpacity>

                    <LoadingView ref = 'LoadingView'/>

                </View>

            );

        }


    }

    _repeatClick(navigate){
        this.setState({waiting: true});
        this._setingPsd(navigate);
        setTimeout(()=> {
            this.setState({waiting: false})
        }, 2000);

    }

    _repeatClickNext(navigate){
        this.setState({waiting: true});
        this._next(navigate);
        setTimeout(()=> {
            this.setState({waiting: false})
        }, 2000);

    }

    _next(navigate){

        this.state.question_ans1 = this.state.question_ans1.trim();
        this.state.question_ans2 = this.state.question_ans2.trim();
        this.state.question_ans3 = this.state.question_ans3.trim();

        if (this.state.question_ans1.length == 0 || this.state.question_ans1 == '') {
            this._showInfo('答案1不能为空');
            return;
        }
        else  if (this.state.question_ans2.length == 0 || this.state.question_ans2 == '') {
            this._showInfo('答案2不能为空');
            return;

        }else  if (this.state.question_ans3.length == 0 || this.state.question_ans3 == '') {
            this._showInfo('答案3不能为空');
            return;

        }else {

            this.refs.LoadingView && this.refs.LoadingView.showLoading('');

            let params = new FormData();

            params.append("ac", "FPcheckQuestion");
            params.append("username", global.UserLoginObject.UserName);
            params.append("question_1", this.state.question_1);
            params.append("question_2", this.state.question_2);
            params.append("question_3", this.state.question_3);
            params.append("answer_1",this.state.question_ans1 );
            params.append("answer_2",this.state.question_ans2);
            params.append("answer_3",this.state.question_ans3);

            var promise = GlobalBaseNetwork.sendNetworkRequest (params);

            promise
                .then(response => {
                    this.refs.LoadingView && this.refs.LoadingView.cancer();
                    //请求成功
                    if (response.msg == 0) {
                        navigate('FinalChangeEncry', {title:'修改密保问题',
                            code:response.data.accessCode,
                        })

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


    _setingPsd(navigate){

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



            this._fetchData(navigate,global.UserLoginObject.Uid,global.UserLoginObject.Token,
                this.state.hint_1,
                this.state.hint_2,
                this.state.hint_3,
                this.state.question_ans1,
                this.state.question_ans2,
                this.state.question_ans3,
            );


        }

    }

    _fetchData(navigate,uid,token,
               hint_1,hint_2, hint_3,
               question_ans1, question_ans2,question_ans3){

        this.refs.LoadingView && this.refs.LoadingView.showLoading('正在设置密保...');
        let params = new FormData();

        params.append("ac", "addUserHint");
        params.append("uid", uid);
        params.append('token', token);
        params.append('sessionkey', global.UserLoginObject.session_key);
        params.append("hint_1", hint_1);
        params.append("hint_2", hint_2);
        params.append("hint_3", hint_3);
        params.append("answer_1",question_ans1 );
        params.append("answer_2",question_ans2);
        params.append("answer_3",question_ans3);

        var promise = GlobalBaseNetwork.sendNetworkRequest (params);

        promise
            .then(response => {
                this.refs.LoadingView && this.refs.LoadingView.cancer();
                //请求成功
                if (response.msg == 0) {
                    this._updateInfo(hint_1,hint_2,hint_3);//更新数据

                    Alert.alert(
                        '提示',
                        '设置成功',
                        [
                            {text:'确定', onPress: () => {
                                PushNotification.emit('MsgHasChange');
                                this.props.navigation.goBack();
                                (this.props.navigation.state.params && this.props.navigation.state.params.callback) ? this.props.navigation.state.params.callback(response.msg) : null;
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


    _updateInfo(hint_1,hint_2,hint_3){

        //发出通知,告知安全中心,设置好了
        PushNotification.emit('UpdateTextAtOnce', "updateEncrypt");
        global.UserLoginObject.Question_1 = hint_1;//修改global对应的Question_1
        global.UserLoginObject.Question_2 = hint_2;//修改global对应的Question_2
        global.UserLoginObject.Question_3 = hint_3;//修改global对应的Question_3
        UserInfo.updateUserInfo(global.UserLoginObject, (error) => {});
        PushNotification.emit('MsgHasChange');

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
