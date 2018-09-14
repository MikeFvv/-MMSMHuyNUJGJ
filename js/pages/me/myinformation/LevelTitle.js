'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    FlatList,
    TouchableOpacity,
} from 'react-native';

import MyInfoHeadView from "./MyInfoHeadView";
import GrowthDetail from "./GrowthDetail";
import LevelReward from "./LevelReward";
import MissionPackage from "./MissionPackage";

class LevelTitle extends Component {

	constructor(props) {
	  super(props);
	  this.loginObject = global.UserLoginObject;
	  this.state = {
	  	userRise:null,
	  };
	}
    componentWillMount() {
        this._fetchUserEventRise();
    }

	//获取等级信息
    _fetchUserEventRise() {
    	this.refs.LoadingView && this.refs.LoadingView.showLoading('');
        let params = new FormData();
        params.append("ac", "GetUserEventRiseInfo");
        params.append("uid", global.UserLoginObject.Uid);
        params.append("token",global.UserLoginObject.Token);
        params.append("sessionkey",global.UserLoginObject.session_key);
        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
          .then((response) => {
            if (response.msg == 0) {
            	this.refs.LoadingView && this.refs.LoadingView.cancer();
                this.setState({
                    userRise:response.data,
                });
            }else {
                this.refs.LoadingView && this.refs.LoadingView.showFaile(response.param);
            }
          })
        .catch((err) => {
           if (err && typeof(err) === 'string' && err.length > 0) {
                this.refs.LoadingView && this.refs.LoadingView.showFaile(err);
            }
        });
    }

  	render() {
	    return (
	    	<View style={styles.container}>
                <MyInfoHeadView userRise={this.state.userRise} loginObject={this.loginObject}/>
                <TouchableOpacity activeOpacity={1}
                                  onPress={()=>{this.props.navigation.navigate('GrowthDetail',{userRise:this.state.userRise,title:'成长明细'})}}
                                  style={{backgroundColor:'white',height:40,marginTop:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                    <CusBaseText style={{fontSize:17,marginLeft:15,color:'rgb(66,66,66)'}}>成长明细及规则</CusBaseText>
                    <Image style={{width:12,height:12,marginRight:15}} source={require('./img/ic_levelTitle_row.png')}/>
                </TouchableOpacity>
                {this._levelRewardView()}
                <View style={{height:1,paddingLeft:0,paddingRight:0,backgroundColor:'rgb(244,244,244)'}}/>
                <TouchableOpacity activeOpacity={1}
                                  onPress={()=>{this.props.navigation.navigate('LevelReward')}}
                                  style={{backgroundColor:'white',height:40,paddingLeft:15,paddingRight:15,
                                      flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                    <CusBaseText style={{fontSize:17,color:'rgb(66,66,66)'}}>等级奖励记录</CusBaseText>
                    <Image style={{width:12,height:12}} source={require('./img/ic_levelTitle_row.png')}/>
                </TouchableOpacity>
	    		<FlatList
			          data={this._handTaskList()}
			          renderItem={this._renderItem}
			          ItemSeparatorComponent={this._renderSeparator}
			          keyExtractor={this._keyExtractor}
			          showsVerticalScrollIndicator={false}
			          ListHeaderComponent={this._renderListHeader}
			     />
			     <LoadingView ref="LoadingView"/>
	    	</View>
	    );
  	}

    _levelRewardView = () => {
        if (!this.state.userRise || !this.state.userRise.rise_list) {
            return null;
        }
        if (this.state.userRise.rise_list.length == 0) {
            return null;
        }
        let rise_list = this.state.userRise.rise_list;
        rise_list = rise_list.sort(
            (a,b) => {
                return a.stor - b.stor;
            }
        );
        return (
            <View style={{backgroundColor:'white',height:80,marginTop:10,paddingLeft:15,paddingRight:15}}>
                <CusBaseText style={{fontSize:17,marginTop:10,color:'rgb(130,130,130)'}}>您共获得的奖励：</CusBaseText>
                <View style={{marginTop:15,flex:1,flexDirection:'row'}}>
                    <View style={{flexDirection:'row',flex:0.33}}>
                        <CusBaseText style={{fontSize:17,color:'rgb(66,66,66)'}}>{rise_list[0]?rise_list[0].info:null}</CusBaseText>
                        <CusBaseText style={{fontSize:17,color:'red',marginLeft:3}}>{rise_list[0]?rise_list[0].reward:null}</CusBaseText>
                    </View>
                    <View style={{flexDirection:'row',flex:0.33,justifyContent:'center'}}>
                        <CusBaseText style={{fontSize:17,color:'rgb(66,66,66)'}}>{rise_list[1]?rise_list[1].info:null}</CusBaseText>
                        <CusBaseText style={{fontSize:17,color:'red',marginLeft:3}}>{rise_list[1]?rise_list[1].reward:null}</CusBaseText>
                    </View>
                    <View style={{flexDirection:'row',flex:0.33,justifyContent:'flex-end'}}>
                        <CusBaseText style={{fontSize:17,color:'rgb(66,66,66)'}}>{rise_list[2]?rise_list[2].info:null}</CusBaseText>
                        <CusBaseText style={{fontSize:17,color:'red',marginLeft:3}}>{rise_list[2]?rise_list[2].reward:null}</CusBaseText>
                    </View>
                </View>
            </View>
        );
    }

	_handTaskList = () => {
        if (!this.state.userRise || !this.state.userRise.task_list) {
            return null;
        }
        if (this.state.userRise.task_list.length == 0) {
            return null;
        }
        if (this.state.userRise.task_list.length <= 2) {
            return this.state.userRise.task_list;
        }
        return this.state.userRise.task_list.slice(0,2);
    }

    _keyExtractor = (item,index) => {
        return String(index);
    }

    _renderListHeader = () => {
        return(
            <TouchableOpacity activeOpacity={1} onPress={()=>{this.props.navigation.navigate('MissionPackage',
                {taskList:this.state.userRise.task_list,callback:(taskList)=>this._refreshTaskList(taskList)})}}
                              style={{backgroundColor:'white',height:40,marginTop:10,flexDirection:'row',
                                  alignItems:'center',justifyContent:'space-between'}}>
                <CusBaseText style={{fontSize:17,marginLeft:15,color:'rgb(66,66,66)'}}>任务礼包</CusBaseText>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <CusBaseText style={{fontSize:17,color:'rgb(66,66,66)',marginRight:5}}>查看全部</CusBaseText>
                    <Image style={{width:12,height:12,marginRight:15}} source={require('./img/ic_levelTitle_row.png')}/>
                </View>
            </TouchableOpacity>
        );
    }

    _renderItem = (info) => {
        let item = info.item;
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={()=>this._jumpStatus(item)}
                style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',
                height:60,backgroundColor:'white',paddingRight:15,paddingLeft:15}}>
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
            return (<View style={{height:25,width:70,alignItems:'center',borderRadius:3,
                justifyContent:'center',backgroundColor:'green'}}>
                <CusBaseText style={{color:'white',fontSize:14}}>已完成</CusBaseText>
            </View>);
        }else {
            return (<View style={{height:25,width:70,alignItems:'center',borderRadius:3,
                justifyContent:'center',
                backgroundColor:'rgb(178,178,178)'}}>
                <CusBaseText style={{color:'white',fontSize:14}}>未完成</CusBaseText>
            </View>);
        }
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
        this.setState({userRise:this.state.userRise});
    }

    _renderSeparator = () => {
        return(
            <View style={{height:1,backgroundColor:'rgb(244,244,244)'}}/>
        );
    }

    _refreshTaskList = (taskList) => {
        this.state.userRise.task_list = taskList;
        this.setState({userRise:this.state.userRise});
    }
}

const styles = StyleSheet.create({

	container:{
		flex:1,
		backgroundColor:'rgb(244,244,244)',
	},

});

export default LevelTitle;