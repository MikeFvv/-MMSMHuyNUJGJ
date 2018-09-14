/**
 * Created by kl on 2018/7/25.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    SectionList,
    TouchableOpacity,
    WebView,
} from 'react-native';

import MyInfoHeadView from "./MyInfoHeadView";

export default class GrowthDetail extends Component {

    static navigationOptions = ({navigation}) => ({
        header: (
            <CustomNavBar
                centerText = {navigation.state.params.title}
                leftClick={() => navigation.goBack()}
            />
        ),

    });

    constructor(props) {
        super(props);
        this.loginObject = global.UserLoginObject;
        this.state = {
            explist:null,
            expsum:null,
            html:null,
            selecteIndex:0,
        };
    }

    componentWillMount() {
        this.userRise = this.props.navigation.state.params.userRise;
        this._fetchUserExpTradLog();
    }

    _fetchUserExpTradLog() {
        this.refs.LoadingView && this.refs.LoadingView.showLoading('');
        let params = new FormData();
        params.append("ac", "GetUserExpTradLog");
        params.append("uid", global.UserLoginObject.Uid);
        params.append("token",global.UserLoginObject.Token);
        params.append("sessionkey",global.UserLoginObject.session_key);
        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((response) => {
                if (response.msg == 0) {
                    this.refs.LoadingView && this.refs.LoadingView.cancer();
                    this.setState({
                        explist:response.data.exp_list,
                        expsum:response.data.exp_sum,
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

    //成长规则
    _fetchRiseViewInfo() {
        this.refs.LoadingView && this.refs.LoadingView.showLoading('');
        let params = new FormData();
        params.append("ac", "GetRiseViewInfo");
        params.append("uid", global.UserLoginObject.Uid);
        params.append("token",global.UserLoginObject.Token);
        params.append("sessionkey",global.UserLoginObject.session_key);
        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((response) => {
                if (response.msg == 0) {
                    this.refs.LoadingView && this.refs.LoadingView.cancer();
                    this.setState({
                        html:response.data.replace(/&amp;/g,"&").replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&quot;/g,"'").replace(/&#039;/g,"\""),
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
                {this._headView()}
                {this._sectionList()}
                {this._webview()}
                {this._toolBar()}
                <LoadingView ref="LoadingView"/>
            </View>
        );
    }

    _headView = () => {
        if (this.state.selecteIndex == 1) {
            return null;
        }
        return (
            <MyInfoHeadView userRise={this.userRise} loginObject={this.loginObject}/>
        );
    }

    _sectionList = () => {
        if (this.state.selecteIndex == 1) {
            return null;
        }
        if (!this.state.explist && !this.state.expsum) {
            return null;
        }
        let sections = [];
        if (this.state.explist) {
            sections.push({key:"成长值分类统计：", data:this.state.expsum});
        }
        if (this.state.expsum) {
            sections.push({key:"奖励明细：", data:this.state.explist});
        }
        return (
            <SectionList
                style={{marginBottom:60}}
                renderSectionHeader={this._sectionHeader}
                renderItem={this._renderItem}
                sections={sections}
                ItemSeparatorComponent={this._renderSeparator}
                showsVerticalScrollIndicator={false}
            />
        );
    }

    _sectionHeader = (info) => {
        return (
            <View style={{height:40,justifyContent:'center',paddingLeft:15,backgroundColor:'white'}}>
                <CusBaseText style={{fontSize:17,color:'rgb(66,66,66)'}}>{info.section.key}</CusBaseText>
            </View>
        );
    }

    _renderItem = (info) => {
        let item = info.item;
        if (info.section.key == '成长值分类统计：') {
            return (
                <View style={{height:40,flexDirection:'row',alignItems:'center',paddingLeft:15,backgroundColor:'white'}}>
                    <CusBaseText style={{fontSize:17,color:'rgb(130,130,130)'}}>{item.title+'：'}</CusBaseText>
                    <CusBaseText style={{fontSize:17,color:'red'}}>{item.exp}</CusBaseText>
                </View>
            );
        }
        let times = item.date.split(' ')
        return (
            <View style={{flexDirection:'row',alignItems:'center',
                height:50,backgroundColor:'white',paddingRight:15,paddingLeft:15}}>
                <View style={{flex:0.33}}>
                    <CusBaseText style={{color:'rgb(66,66,66)',fontSize:17}}>{item.title}</CusBaseText>
                </View>
                <View style={{alignItems:'center',flex:0.33}}>
                    <CusBaseText style={{color:COLORS.appColor,fontSize:17}}>{item.exp+' 成长值'}</CusBaseText>
                </View>
                <View style={{justifyContent:'center',alignItems:'flex-end',flex:0.33}}>
                    <CusBaseText style={{color:'rgb(66,66,66)',fontSize:15,textAlign:'center'}}>{times[0]+'\n'+times[1]}</CusBaseText>
                </View>
            </View>
        );
    }

    _renderSeparator = () => {
        return(
            <View style={{height:1,backgroundColor:'rgb(244,244,244)'}}/>
        );
    }

    _toolBar = () => {
        return (
            <View style={{position:'absolute',top:SCREEN_HEIGHT-60-64,height:60,width:SCREEN_WIDTH,
                flexDirection:'row',alignItems:'center',backgroundColor:'rgb(244,244,244)'}}>
                {this._detailBtn()}
                <View style={{height:40,width:1,backgroundColor:'#ccc'}}/>
                {this._rulesBtn()}
            </View>
        );
    }

    _detailBtn = () => {
        if (this.state.selecteIndex == 0) {
            return (
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={this._loadDtails}
                    style={{flex:0.5,justifyContent:'center',alignItems:'center'}}>
                    <Image style={{height:25,width:25}} source={require('./img/ic_levelTitle_detail.png')}/>
                    <CusBaseText style={{color:'red',fontSize:15,marginTop:2}}>明细</CusBaseText>
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={this._loadDtails}
                style={{flex:0.5,justifyContent:'center',alignItems:'center'}}>
                <Image style={{height:25,width:25}} source={require('./img/ic_levelTitle_undetail.png')}/>
                <CusBaseText style={{color:'rgb(66,66,66)',fontSize:15,marginTop:2}}>明细</CusBaseText>
            </TouchableOpacity>
        );
    }

    _rulesBtn = () => {
        if (this.state.selecteIndex == 0) {
            return (
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={this._loadRules}
                    style={{flex:0.5,justifyContent:'center',alignItems:'center'}}>
                    <Image style={{height:25,width:25}} source={require('./img/ic_levelTitle_unrule.png')}/>
                    <CusBaseText style={{color:'rgb(66,66,66)',fontSize:15,marginTop:2}}>规则</CusBaseText>
                </TouchableOpacity>
            );
        }

        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={this._loadRules}
                style={{flex:0.5,justifyContent:'center',alignItems:'center'}}>
                <Image style={{height:25,width:25}} source={require('./img/ic_levelTitle_rule.png')}/>
                <CusBaseText style={{color:'red',fontSize:15,marginTop:2}}>规则</CusBaseText>
            </TouchableOpacity>
        );

    }

    _loadDtails = () => {
        if (this.state.selecteIndex == 0){
            return;
        }
        this.props.navigation.setParams({
            title:'成长明细',
        });
        this.setState({
            selecteIndex:0,
        });
        if (this.state.explist || this.state.expsum) {
            return;
        }
        this._fetchUserExpTradLog();
    }

    _loadRules = () => {
        if (this.state.selecteIndex == 1){
            return;
        }
        this.props.navigation.setParams({
            title:'规则',
        });
        this.setState({
            selecteIndex:1,
        });
        if (this.state.html) {
            return;
        }
        this._fetchRiseViewInfo();
    }

    _webview = () => {
        if (this.state.selecteIndex == 0) {
            return null;
        }
        if (!this.state.html) {
            return null;
        }
        return (
            <WebView
                style = {{flex:1,backgroundColor:'red'}}
                scalesPageToFit={false}
                bounces={false}
                source={{html:this.state.html}}
                onLoadEnd = {()=> this.refs.LoadingView && this.refs.LoadingView.cancer()}
            />
        );
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'rgb(244,244,244)',
    },
});