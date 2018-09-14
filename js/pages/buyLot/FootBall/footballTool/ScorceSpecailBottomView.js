/**
 * Created by Ward on 2018/04/11.
 */

import React, { Component } from 'react'
import {
    View,
    TouchableOpacity,
    Alert,
} from 'react-native'


export default class ScorceSpecailBottomView extends Component {

    constructor(props){

        super(props);

        this.state = {
            pickDataDict:null,  //选择号码的数据模型
            lastSelectDescStr: '', //最终选择的号码的描述， 购物车需要
            lastPeilvStr: '', //最终选择的赔率的字符串，购物车需要
            nextDataArray: [], //传到购物车里的数组，购物车需要
        }
    }

    //接受将要改变的属性
    componentWillReceiveProps(nextProps) {

        if (nextProps.PickDataDict){
            this.setState({pickDataDict:nextProps.PickDataDict});
        }
    }

    componentDidMount() {

        //下注成功或者清空号码时收到的通知清空选号界面
        this.subscription1 = PushNotification.addListener('ClearFootBallGameViewBallNotification', () => {

            this.setState({pickDataDict:null})

        });

        // 综合过关 有删除过item后点添加比赛返回的
        this.subscription3 = PushNotification.addListener('RefreshFootBallGameViewBallNotification', (clearSItemId) => {
            // 其实回调到这里，pickDataDict的值已经改了。为防止出错还是还来一下delete。
            
            for (let a = 0; a < clearSItemId.length; a++) {
                delete this.state.pickDataDict[clearSItemId[a]];  // 删除掉在购物车里面删除的货；
            }
            this.setState({
                pickDataDict: this.state.pickDataDict,
            });
        });
    }

    //移除组件
    componentWillUnmount() {

        if (typeof(this.subscription1) == 'object'){
            this.subscription1 && this.subscription1.remove();
        }
        if (typeof(this.subscription3) == 'object') {
            this.subscription3 && this.subscription3.remove();
        }
    }


    render() {

        let miaosuStr = '';//描述字符串
        let peilvStr = '';//赔率字符串
        let isSuitStr = ''; //是否满足最小为3串1

        if (this.state.pickDataDict){

            let keyArr = Object.keys(this.state.pickDataDict);

            if (keyArr.length == 0){//删除所有数据后
                miaosuStr = '';
                peilvStr = '';
                isSuitStr = '';
            }
            else if (keyArr.length == 1){//只选择了一串的号码

                let model = Object.values(this.state.pickDataDict)[0];
                miaosuStr = '1串1';
                peilvStr = `@${model.p}`;
                isSuitStr = '(最小串3关)';

            }
            else if (keyArr.length == 2){//只选了两串的号码

                let model = Object.values(this.state.pickDataDict)[0];
                let model1 = Object.values(this.state.pickDataDict)[1];
                let lastPeilV = (parseFloat(model.p,10) *  parseFloat(model1.p,10)).toFixed(2);

                miaosuStr = '2串1';
                peilvStr = `@${lastPeilV}`;
                isSuitStr = '(最小串3关)';
            }
            else {//选了三串或以上的号码

                let modelArr = Object.values(this.state.pickDataDict);
                let lastPeiLV = 0;

                for (let i = 0; i < modelArr.length; i++){

                    let model = modelArr[i];

                    if (i == 0){
                        lastPeiLV = parseFloat(model.p, 10);
                    }
                    else {
                        lastPeiLV = (lastPeiLV * parseFloat(model.p, 10)).toFixed(2);
                    }
                }

                miaosuStr = `${modelArr.length}串1`;
                peilvStr = `@${lastPeiLV}`;
                isSuitStr = '';

                this.state.lastSelectDescStr = miaosuStr;
                this.state.lastPeilvStr = lastPeiLV;
            }
        }

        return (<View style = {this.props.style}>
            <View style = {{height:50, backgroundColor:'#434343', flexDirection:'row', alignItems:'center'}}>
                <View style = {{flex:0.78, flexDirection:'row', alignItems:'center'}}>
                    <CusBaseText style = {{marginLeft:15, fontSize:Adaption.Font(17,14), color:'#fff'}}>
                        {miaosuStr} <CusBaseText style = {{fontSize:Adaption.Font(16,13), color:'#e33933'}}>
                        {peilvStr}
                    </CusBaseText>{isSuitStr}
                    </CusBaseText>
                </View>
                <View style = {{flex:0.22}}>
                    <TouchableOpacity
                        activeOpacity = {0.7}
                        style = {{height:50, backgroundColor:'#e33933', justifyContent:'center', alignItems:'center'}}
                        onPress = { () => {

                            if (this.state.pickDataDict){

                                //选择号码后进行判断

                                let keyArr = Object.keys(this.state.pickDataDict);

                                if (keyArr.length < 3 || keyArr.length > 10){
                                    Alert.alert('温馨提示',  '不符合串关要求,至少要串3关,最大串10关!', [{text:'确定', onPress: () => {}}])
                                }
                                else {

                                    let i = 0;
                                    let modelArr = Object.values(this.state.pickDataDict);

                                    if (this.state.nextDataArray.length != 0){
                                        this.state.nextDataArray = [];  //防止重复添加数据
                                    }

                                    modelArr.map((model) => {
                                        this.state.nextDataArray.push({key: i, value: model});
                                        i++;
                                    });

                                    let pushDict = {'peilv':this.state.lastPeilvStr, 'desc':this.state.lastSelectDescStr, 'dataArr':this.state.nextDataArray};

                                    this.props.NextStepOnPress ? this.props.NextStepOnPress(pushDict) : null;
                                }
                            }
                            else {
                                //没有选择号码是返回null到上一界面
                                this.props.NextStepOnPress ? this.props.NextStepOnPress(null) : null;
                            }

                        }}>
                        <CusBaseText style = {{color:'white', fontSize:Adaption.Font(18,15)}}>
                            下一步
                        </CusBaseText>
                    </TouchableOpacity>
                </View>
            </View>
        </View>);
    }
}
