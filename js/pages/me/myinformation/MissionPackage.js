/**
 * Created by kl on 2018/7/25.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    Text,
} from 'react-native';

export default class MissionPackage extends Component {

    static navigationOptions = ({navigation}) => ({
        header: (
            <CustomNavBar
                centerText={"任务礼包"}
                leftClick={() => {
                    (navigation.state.params && navigation.state.params.callback) ?
                        navigation.state.params.callback(navigation.state.params.taskList):null;
                    navigation.goBack();
                }}
            />
        ),
    });

    constructor(props) {
        super(props);
        this.state = {taskList:this.props.navigation.state.params.taskList};
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.taskList?this.state.taskList:null}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={this._renderSeparator}
                    showsVerticalScrollIndicator={false}
                    extraData={this.state}
                />
            </View>
        );
    }

    _keyExtractor = (item,index) => {
        return String(index);
    }

    _renderItem = (info) => {
        let item = info.item;
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',
                height:60,backgroundColor:'white',paddingRight:15,paddingLeft:15}}
                onPress={()=>this._jumpStatus(item)}
            >
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Image
                        source={require('./img/ic_levelTitle_gift.png')}
                        style={{width:22,height:20}}
                    />
                    <View style={{marginLeft:15,justifyContent:'center'}}>
                        <CusBaseText style={{color:'rgb(66,66,66)',fontSize:17}}>{item.title}</CusBaseText>
                        <CusBaseText style={{color:'rgb(130,130,130)',fontSize:14,marginTop:5}}>{item.addexp+' 成长值'}</CusBaseText>
                    </View>
                </View>
                {this._judgeStatus(item)}
            </TouchableOpacity>
        );
    }

    _judgeStatus = (item) => {
        if(item.status == 1) { //已完成
            return (<View style={{height:25,width:70,borderRadius:3,alignItems:'center',
                justifyContent:'center',backgroundColor:'green'}}>
                <CusBaseText style={{color:'white',fontSize:14}}>已完成</CusBaseText>
            </View>);
        }else {
            return (<View style={{height:25,width:70,borderRadius:3,alignItems:'center',
                justifyContent:'center',
                backgroundColor:'rgb(178,178,178)'}}>
                <CusBaseText style={{color:'white',fontSize:14}}>未完成</CusBaseText>
            </View>);
        }
    }

    _renderSeparator = () => {
        return(
            <View style={{height:1, backgroundColor:'rgb(244,244,244)'}}/>
        );
    }

    _jumpStatus = (item) => {
        if (item.status == 1) {
            return;
        }
        switch (item.title) {
            case '设置真实姓名':
                this.props.navigation.navigate('ChangeName',{callback:(msg)=>this._changeStatus(item,msg)});
                break;
            case '设置手机号码':
                this.props.navigation.navigate('ChangePhoNum',{callback:(msg)=>this._changeStatus(item,msg)});
                break;
            case '设置微信号码':
                this.props.navigation.navigate('BindWechat',{callback:(msg)=>this._changeStatus(item,msg)});
                break;
            case '设置QQ号码':
                this.props.navigation.navigate('BindQQ',{callback:(msg)=>this._changeStatus(item,msg)});
                break;
            case '设置邮箱号码':
                this.props.navigation.navigate('BindEmail',{callback:(msg)=>this._changeStatus(item,msg)});
                break;
            case '设置密保问题':
                this.props.navigation.navigate('ChangeEncrypt',{callback:(msg)=>this._changeStatus(item,msg)});
                break;
            case '绑定银行卡号':
                this.props.navigation.navigate('BindBankCard',{callback:(msg)=>this._changeStatus(item,msg)});
                break;
            case '当日点击签到':
                this.props.navigation.navigate('DailyAttendance',{callback:(msg)=>this._changeStatus(item,msg),msg:-1});
                break;
        }
    }

    _changeStatus = (item,msg) => {
        if (msg != 0) {
            return;
        }
        item.status = 1;
        this.setState({taskList:this.state.taskList});
        this.props.navigation.state.params.taskList = this.state.taskList;
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor:'rgb(244,244,244)',
    },

});