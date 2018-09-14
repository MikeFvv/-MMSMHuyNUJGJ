/**
 * Created by kl on 2018/7/25.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Image,
} from 'react-native';
import CusIosBaseText from "../../../skframework/component/CusIosBaseText";
import LocalImgs from "../../../res/img";

export default class LevelReward extends Component {

    static navigationOptions = ({navigation}) => ({
        header: (
            <CustomNavBar
                centerText={"等级奖励"}
                leftClick={() => navigation.goBack()}
            />
        ),
    });

    constructor(props) {
        super(props);
        this.state = {
            risekList:null,
            nodata:false,
        };
    }

    componentWillMount() {
        this._fetchRiseRewardLog();
    }

    _fetchRiseRewardLog() {
        this.refs.LoadingView && this.refs.LoadingView.showLoading('');
        let params = new FormData();
        params.append("ac", "GetRiseRewardLog");
        params.append("uid", global.UserLoginObject.Uid);
        params.append("token",global.UserLoginObject.Token);
        params.append("sessionkey",global.UserLoginObject.session_key);
        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((response) => {
                if (response.msg == 0)
                {
                    this.refs.LoadingView && this.refs.LoadingView.cancer();

                    if(response.data.length > 0)
                    {
                        this.setState({
                            risekList:response.data,
                            nodata:false

                        });
                    }
                    else
                    {
                        this.setState({
                            nodata:true
                        })
                    }
                }
                else
                {
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

                {this.state.nodata == true ?<View style={{flex:1,justifyContent: 'center',alignItems:'center'}}>
                    <Image resizeMode={'stretch'} style={{ width: 80, height: 78 }} source={require('./img/no_content.png')} />
                    <CusIosBaseText
                    style={{fontSize:Adaption.Font(14,16),marginTop:10}} >暂无内容</CusIosBaseText>
                </View> :<FlatList
                    data={this.state.risekList?this.state.risekList:null}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={this._renderSeparator}
                    showsVerticalScrollIndicator={false}
                /> }

                <LoadingView ref="LoadingView"/>
            </View>
        );
    }

    _keyExtractor = (item,index) => {
        return String(index);
    }

    _renderItem = (info) => {
        let item = info.item;
        let times = item.date.split(' ')
        return (
            <View style={{flexDirection:'row',alignItems:'center',
                height:50,backgroundColor:'white',paddingRight:15,paddingLeft:15}}>
                <View style={{flex:0.33}}>

                    <CusBaseText style={{color:'rgb(66,66,66)',fontSize:17}}>{item.title}</CusBaseText>
                </View>
                <View style={{alignItems:'center',flex:0.33}}>
                    <CusBaseText style={{color:COLORS.appColor,fontSize:17}}>{'+'+item.price+' 彩金'}</CusBaseText>
                </View>
                <View style={{justifyContent:'center',alignItems:'flex-end',flex:0.33}}>
                    <CusBaseText style={{color:'rgb(66,66,66)',fontSize:15,textAlign:'center'}}>{this._showTime(times)}</CusBaseText>
                </View>
            </View>
        );
    }

    _showTime = (times) => {
        if (times[0] && times[1]) {
            return times[0]+'\n'+times[1];
        }
        return times[0];
    }

    _renderSeparator = () => {
        return(
            <View style={{height:1, backgroundColor:'rgb(244,244,244)'}}/>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'rgb(244,244,244)',
    },
});