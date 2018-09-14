'use strict';

import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    Alert,
} from 'react-native';

import SegmentedControl from "../../../common/SegmentedControl";
import LevelTitle from './LevelTitle';
import ImagePicker from 'react-native-image-picker'; //第三方相机

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

//图片选择器参数设置
var options = {
    title: '请选择图片来源',
    cancelButtonTitle:'取消',
    chooseFromLibraryButtonTitle:'从相册中选择',
    takePhotoButtonTitle:'拍照',
    allowsEditing:true,//图片可调整,仅支持ios
    maxWidth: 100, // photos only默认为手机屏幕的宽，高与宽一样，为正方形照片
    maxHeight: 100, // photos only
    noData:false,//如果为true，则禁用data生成base64 字段（大大提高了大型照片的性能）
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

// navigate('MyInfo',{switchSegment:true});

export default class MyInfo extends Component {

    static navigationOptions = ({navigation}) => ({
        header: (
            <CustomNavBar
                leftClick={() =>  navigation.goBack() }
                centerView = {
                    (global.RiseEvent == 1 ?
                            <View style={{
                                width: SCREEN_WIDTH - 30 - 65 - 20,
                                height: 44,
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row',
                                marginTop:SCREEN_HEIGHT == 812 ? 40 : 20,
                                marginLeft:20,
                                backgroundColor:'transparent',
                            }}>
                                <SegmentedControl
                                    values={['个人信息','等级头衔']}
                                    selectedColor='white'
                                    unSelectedColor={COLORS.appColor}
                                    style={{borderColor:'white'}}
                                    onChange={navigation.state.params?navigation.state.params.myInfoNavPress:null}
                                    selectedIndex={navigation.state.params && navigation.state.params.segmentedPosition?
                                        navigation.state.params.segmentedPosition:0}
                                />
                            </View>
                            :
                            <View style = {{
                                flex:1,
                                justifyContent:'center',
                                alignItems:'center',
                            }}>
                                <CusBaseText style = {{color:'white', fontSize:18, marginTop:SCREEN_HEIGHT == 812 ? 40 : 20, backgroundColor:'transparent'}}>
                                    个人信息
                                </CusBaseText>
                            </View>)
                }
                rightView = {
                    <View style = {{width:30}}/>
                }
            />
        ),
    })

    constructor(props) {
        super(props );
        this.state = {
            showPageIndex:0,
            headerIcon: global.UserLoginObject.UserHeaderIcon,//用户头像
            realName: global.UserLoginObject.Real_name, //真实姓名
            phone:global.UserLoginObject.Phone,//用户手机号
            qqNum: global.UserLoginObject.Qq_num, //用户qq
            weChat: global.UserLoginObject.Wechat, //用户微信号
            email:global.UserLoginObject.Email,//用户邮箱
        };
    }

    componentWillMount() {
        this.props.navigation.setParams({
            myInfoNavPress:this._showInfo,
            segmentedPosition:0,
        });
        //是不是要切换Segment到等级头衔
        if (this.props.navigation.state.params && this.props.navigation.state.params.switchSegment) {
            this.switchSegment = this.props.navigation.state.params.switchSegment;
            this.switchSegment ?  this._showInfo(1) : null;
        }
    }

    //切换segment
    _showInfo = (position) => {
        if (this.state.showPageIndex == position) {
            return;
        }
        this.props.navigation.setParams({
            segmentedPosition:position,
        });
        if (this.state.showPageIndex == 0) {
            this.setState({
                showPageIndex:1,
            });
        }else {
            this.setState({
                showPageIndex:0,
            });
        }
    }


    render() {
        if (this.state.showPageIndex == 0){
            //个人信息界面
            return this._Info();
        }else {
            //等级头衔
            return(
                <LevelTitle navigation={this.props.navigation}/>
            );
        }
    }

    //个人信息界面
    _Info(){
        return(
            <View style={{flex:1, backgroundColor: '#f2f3f4'}}>
                <View style={{backgroundColor: '#ffffff', height:65,flexDirection:"row",justifyContent:'center',alignItems:'center', marginTop:20}}>
                    <View style = {{flex:0.85}}><CusBaseText style={{fontSize:17,color:'black',marginLeft:15}}>{'头像'}</CusBaseText></View>
                    <TouchableOpacity activeOpacity={0.8}  onPress={this.choosePicture.bind(this)} style={{flex:0.15, alignItems:'center',marginRight:60, flexDirection:'row'}}>
                        <Image style={{width:58,height:58, borderRadius:29,marginTop:3,marginBottom:3, borderWidth:1, borderColor:'lightgrey'}}
                               source={this.state.headerIcon != '' ? {uri: this.state.headerIcon} : (require('./img/ic_levelTitle_aver.png')) }
                        />
                        <Image style = {{marginLeft:15, width:8, height:16}} source = {require('./img/ic_levelTitle_row.png')} />
                    </TouchableOpacity>
                </View>
                <View style={{backgroundColor: '#ffffff', width:SCREEN_WIDTH,height:46,flexDirection:"row",justifyContent:'center',alignItems:'center', marginTop:20, borderBottomWidth:0.5, borderColor:'#ebeced'}}>
                    <CusBaseText style={styles.textLeft}>{'真实姓名'}</CusBaseText>
                    <View style={styles.textRightCon}>
                        <CusBaseText style={styles.textRight}>{this.state.realName==''?'未绑定':this.state.realName}</CusBaseText>
                    </View>
                </View>
                <View style={{backgroundColor: '#ffffff', width:SCREEN_WIDTH,height:46,flexDirection:"row",justifyContent:'center',alignItems:'center',  borderBottomWidth:0.5, borderColor:'#ebeced'}}>
                    <CusBaseText style={styles.textLeft}>{'手机号'}</CusBaseText>
                    <View style={styles.textRightCon}>
                        <CusBaseText style={styles.textRight}>{this.state.phone==''?'未绑定':this.state.phone}</CusBaseText>
                    </View>
                </View>
                <View style={{backgroundColor: '#ffffff', width:SCREEN_WIDTH,height:46,flexDirection:"row",justifyContent:'center',alignItems:'center',  borderBottomWidth:0.5, borderColor:'#ebeced'}}>
                    <CusBaseText style={styles.textLeft}>{'QQ'}</CusBaseText>
                    <View style={styles.textRightCon}>
                        <CusBaseText style={styles.textRight}>{this.state.qqNum==''?'未绑定':this.state.qqNum}</CusBaseText>
                    </View>
                </View>
                <View style={{backgroundColor: '#ffffff', width:SCREEN_WIDTH,height:46,flexDirection:"row",justifyContent:'center',alignItems:'center',  borderBottomWidth:0.5, borderColor:'#ebeced'}}>
                    <View style={{flex:1}}>
                        <CusBaseText style={styles.textLeft}>{'微信'}</CusBaseText>
                    </View>
                    <View style={styles.textRightCon}>
                        <CusBaseText style={styles.textRight}>{this.state.weChat==''?'未绑定':this.state.weChat}</CusBaseText>
                    </View>
                </View>
                <View style={{backgroundColor: '#ffffff', width:SCREEN_WIDTH,height:46,flexDirection:"row",justifyContent:'center',alignItems:'center',  borderBottomWidth:0.5, borderColor:'#ebeced'}}>
                    <CusBaseText style={styles.textLeft}>{'邮箱'}</CusBaseText>
                    <View style={styles.textRightCon}>
                        <CusBaseText style={styles.textRight}>{this.state.email==''?'未绑定':this.state.email}</CusBaseText>
                    </View>
                </View>
                <LoadingView ref = 'LoadingView'/>
            </View>
        );
    }

    choosePicture() {
       //拍照和相机
        ImagePicker.showImagePicker(options, (response) => {
            // console.log('Response = ', response);
            if (response.didCancel) {
                // console.log('用户取消了选择！');
            }
            else if (response.error) {
                //alert("ImagePicker发生错误：" + response.error);
                // console.log("ImagePicker发生错误：" + response.error);
            }
            else if (response.customButton) {
                alert("自定义按钮点击：" + response.customButton);
            }
            else {
                /*let source = { uri: response.uri };
                // You can also display the image using data:
                this.setState({
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                    avatarSource: source
                });*/

                //后台规定的格式 'data-png-'
                this.imgUpload('data-jpg-' + response.data);
            }
        });
    }

    imgUpload(base64data){
        this.refs.LoadingView && this.refs.LoadingView.showLoading('正在上传头像...');
        let params = new FormData();
        params.append("ac", "UploadUserHeadIconByBase64");
        params.append("token",global.UserLoginObject.Token);
        params.append("uid", global.UserLoginObject.Uid);
        params.append("img", base64data);
        params.append("sessionkey", global.UserLoginObject.session_key);
        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then(response => {
                this.refs.LoadingView && this.refs.LoadingView.cancer();
                //请求成功
                if (response.msg == 0) {
                    this._fetchData(response.data);//修改用户资料
                }else{
                    this._show(response.param);
                }
            })
            .catch(err => {});
    }

    _fetchData(icon){
        let params = new FormData();
        params.append("ac", "updateUserInfo");
        params.append("token",global.UserLoginObject.Token);
        params.append("uid", global.UserLoginObject.Uid);
        params.append("icon", icon);
        params.append("type", 8);
        params.append("sessionkey", global.UserLoginObject.session_key);
        var promise = GlobalBaseNetwork.sendNetworkRequest (params);
        promise
            .then(response => {
                if (response.msg == 0 && response.data) {
                    PushNotification.emit('ChangeUserImage', response.data);
                    this._updateInfo(response.data);//更新本地数据
                    this._show('上传头像成功');
                    this.setState({
                        headerIcon: response.data,
                    });
                } else {
                    this.refs.LoadingView && this.refs.LoadingView.showFaile(response.param);
                }
            })
            .catch(err => {});
    }

    _updateInfo(newHeaderIcon){
        global.UserLoginObject.UserHeaderIcon = newHeaderIcon;//更新global状态,否则个人信息界面头像不会即时更新
        global.UserLoginObject.HeaderIcon = newHeaderIcon;//更新global状态,否则个人信息界面头像不会即时更新
        UserInfo.updateUserInfo(global.UserLoginObject, (error) => {});
    }

    _show(title){
        Alert.alert(
            '提示',
            title,
            [{text:'确定', onPress: () => {}}]
        )
    }

}

const  styles = StyleSheet.create({
    textLeft: {
        fontSize:17,color:'black',paddingLeft:15
    },
    textRightCon: {
        flex:2,alignItems:'flex-end',marginRight:15
    },
    textRight: {
        fontSize:17,color:'black',paddingLeft:15
    },
    item:{
        margin:15,
        height:30,
        borderWidth:1,
        padding:6,
        borderColor:'#ddd',
        textAlign:'center'
    },
})