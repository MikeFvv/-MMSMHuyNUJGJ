/**
 Author Ward
 Created by on 2018-08-14
 梯子号码选择视图
 **/

import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
} from 'react-native';

export default class LadderBallPickeView extends Component {

    constructor(props){
        super(props);

        this.state = ({
            pickerBallSArr:[],  //选择号码的数组
            peilvDataList:[],  //存放赔率的数组
            ballsArcdomArr:[],  //购物车机选需要的数组
            isClearAllBallNum:false, //投注页面是否点击清空号码
        })
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.peilvDataArr.length != 0 && this.state.peilvDataList.length == 0) {

            let peilvArr = nextProps.peilvDataArr[0].peilv.split('|');
            let ballArr = ["左","右","3","4","单","双","单3","双3","单4","双4"]
            let arcdomArr = []; //机选号码数组

            for (let i = 0; i < peilvArr.length; i++){
                let ballObject = {ball:ballArr[i], peilv:peilvArr[i]};
                arcdomArr.push(ballObject);
            }

            this.setState({peilvDataList: peilvArr, ballsArcdomArr:arcdomArr});
        }
    }

    componentDidMount() {

        this.subscription = PushNotification.addListener('ClearAllBalls', () => {
            this.setState({pickerBallSArr:[], isClearAllBallNum:true});  //清空号码的通知
        })
    }

    componentWillUnmount() {

        if (typeof(this.subscription) == 'object') {
            this.subscription && this.subscription.remove();
        }
    }

    //统一处理点击的函数
    _handleClickBall(statueStr, btnIDStr, currentIndex, peilvStr){

        this.state.isClearAllBallNum = false;  //选择号码后又设置为false

        if (statueStr == true){

            this.state.pickerBallSArr.push({'idx':currentIndex, peilv:peilvStr, desc:btnIDStr});
        }
        else {
            for (let i = 0; i < this.state.pickerBallSArr.length; i++){

                let pickerDict = this.state.pickerBallSArr[i];
                if (pickerDict.idx == currentIndex){
                    this.state.pickerBallSArr.splice(i, 1);
                    break;
                }
            }
        }

        this.props.PickZhuShu ? this.props.PickZhuShu(this.state.pickerBallSArr, this.state.ballsArcdomArr) : null;

    }

    render (){

        return <View style = {this.props.style}>
            <View style = {{backgroundColor:'#f6f6f6',borderRadius:5, borderWidth:1, borderColor:'#d2d2d2', marginLeft:15, marginRight:15, height:162, width:SCREEN_WIDTH - 30, marginTop:10}}>
                <View style = {{flexDirection:'row', height:40,borderColor:'#d2d2d2', borderBottomWidth:1}}>
                    <View style = {{flex:0.25, alignItems:'center', justifyContent:'center'}}>
                        <CusBaseText style = {{fontSize:Adaption.Font(18,15), color:'#313131'}}>
                            号码
                        </CusBaseText>
                    </View>
                    <View style = {{flex:0.25, alignItems:'center', justifyContent:'center'}}>
                        <CusBaseText style = {{fontSize:Adaption.Font(18,15), color:'#313131'}}>
                            赔率
                        </CusBaseText>
                    </View>
                    <View style = {{flex:0.25, alignItems:'center', justifyContent:'center'}}>
                        <CusBaseText style = {{fontSize:Adaption.Font(18,15), color:'#313131'}}>
                            号码
                        </CusBaseText>
                    </View>
                    <View style = {{flex:0.25, alignItems:'center', justifyContent:'center'}}>
                        <CusBaseText style = {{fontSize:Adaption.Font(18,15), color:'#313131'}}>
                            赔率
                        </CusBaseText>
                    </View>
                </View>
                <View style = {{flexDirection:'row', height:40}}>
                    <View style = {{borderRightWidth:1, borderBottomWidth:1, borderColor:'#d2d2d2', flex:0.25, alignItems:'center', justifyContent:'center'}}>
                        <View style = {{width:24,height:24, backgroundColor:'#dcdcdc', borderRadius:12, alignItems:'center', justifyContent:'center'}}>
                            <CusBaseText style = {{color:'#676767', fontSize:Adaption.Font(17,14)}}>
                                左
                            </CusBaseText>
                        </View>
                    </View>
                    <LadderPeilvBtn
                        descBtnStr={'左'}
                        borderRigth={true}
                        borderBottom={true}
                        peilv={this.state.peilvDataList[0]}
                        iscancleSelect={this.state.isClearAllBallNum}
                        onClickAC={(statue, btnID, peilv) => {
                            this._handleClickBall(statue, btnID, 0, peilv);
                        }}
                    />
                    <View style = {{borderRightWidth:1, borderBottomWidth:1, borderColor:'#d2d2d2', flex:0.25, alignItems:'center', justifyContent:'center'}}>
                        <View style = {{width:24,height:24, backgroundColor:'#dcdcdc', borderRadius:12, alignItems:'center', justifyContent:'center'}}>
                            <CusBaseText style = {{color:'#676767', fontSize:Adaption.Font(17,14)}}>
                                右
                            </CusBaseText>
                        </View>
                    </View>
                    <LadderPeilvBtn
                        descBtnStr={'右'}
                        borderRigth={false}
                        borderBottom={true}
                        peilv={this.state.peilvDataList[1]}
                        iscancleSelect={this.state.isClearAllBallNum}
                        onClickAC={(statue, btnID, peilv) => {
                            this._handleClickBall(statue, btnID, 1, peilv);
                        }}
                    />
                </View>
                <View style = {{flexDirection:'row', height:40}}>
                    <View style = {{borderRightWidth:1, borderBottomWidth:1, borderColor:'#d2d2d2', flex:0.25, alignItems:'center', justifyContent:'center'}}>
                        <View style = {{width:24,height:24, backgroundColor:'#626262', borderRadius:12, alignItems:'center', justifyContent:'center'}}>
                            <CusBaseText style = {{color:'#fff', fontSize:Adaption.Font(17,14)}}>
                                3
                            </CusBaseText>
                        </View>
                    </View>
                    <LadderPeilvBtn
                        descBtnStr={'3'}
                        borderRigth={true}
                        borderBottom={true}
                        peilv={this.state.peilvDataList[2]}
                        iscancleSelect={this.state.isClearAllBallNum}
                        onClickAC={(statue, btnID, peilv) => {
                            this._handleClickBall(statue, btnID, 2, peilv);
                        }}
                    />
                    <View style = {{borderRightWidth:1, borderBottomWidth:1, borderColor:'#d2d2d2', flex:0.25, alignItems:'center', justifyContent:'center'}}>
                        <View style = {{width:24,height:24, backgroundColor:'#626262', borderRadius:12, alignItems:'center', justifyContent:'center'}}>
                            <CusBaseText style = {{color:'#fff', fontSize:Adaption.Font(17,14)}}>
                                4
                            </CusBaseText>
                        </View>
                    </View>
                    <LadderPeilvBtn
                        descBtnStr={'4'}
                        borderRigth={false}
                        borderBottom={true}
                        peilv={this.state.peilvDataList[3]}
                        iscancleSelect={this.state.isClearAllBallNum}
                        onClickAC={(statue, btnID, peilv) => {
                            this._handleClickBall(statue, btnID, 3, peilv);
                        }}
                    />
                </View>
                <View style = {{flexDirection:'row', height:40}}>
                    <View style = {{borderRightWidth:1, borderColor:'#d2d2d2', flex:0.25, alignItems:'center', justifyContent:'center'}}>
                        <View style = {{width:24,height:24, backgroundColor:'#00a0e9', borderRadius:12, alignItems:'center', justifyContent:'center'}}>
                            <CusBaseText style = {{color:'#fff', fontSize:Adaption.Font(17,14)}}>
                                单
                            </CusBaseText>
                        </View>
                    </View>
                    <LadderPeilvBtn
                        descBtnStr={'单'}
                        borderRigth={true}
                        borderBottom={false}
                        peilv={this.state.peilvDataList[4]}
                        iscancleSelect={this.state.isClearAllBallNum}
                        onClickAC={(statue, btnID, peilv) => {

                            this._handleClickBall(statue, btnID, 4, peilv);
                        }}
                    />
                    <View style = {{borderRightWidth:1,borderColor:'#d2d2d2', flex:0.25, alignItems:'center', justifyContent:'center'}}>
                       <View style = {{width:24,height:24, backgroundColor:'#e33939', borderRadius:12, alignItems:'center', justifyContent:'center'}}>
                            <CusBaseText style = {{color:'#fff', fontSize:Adaption.Font(17,14)}}>
                                双
                            </CusBaseText>
                        </View>
                    </View>
                    <LadderPeilvBtn
                        descBtnStr={'双'}
                        borderRigth={false}
                        borderBottom={false}
                        peilv={this.state.peilvDataList[5]}
                        iscancleSelect={this.state.isClearAllBallNum}
                        onClickAC={(statue, btnID, peilv) => {
                            this._handleClickBall(statue, btnID, 5, peilv);
                        }}
                    />
                </View>
            </View>
            <View style = {{backgroundColor:'#f6f6f6',borderRadius:5, borderWidth:1, borderColor:'#d2d2d2', marginLeft:15, marginRight:15, height:160, width:SCREEN_WIDTH - 30, marginTop:10}}>
                <View style = {{height:38, alignItems:'center', justifyContent:'center',borderColor:'#d2d2d2', borderBottomWidth:1}}>
                    <CusBaseText style = {{fontSize:Adaption.Font(19,16), color:'#313131'}}>
                        终点X梯子
                    </CusBaseText>
                </View>
                <View style = {{flexDirection:'row', height:40,borderColor:'#d2d2d2', borderBottomWidth:1}}>
                    <View style = {{flex:0.25, alignItems:'center', justifyContent:'center'}}>
                        <CusBaseText style = {{fontSize:Adaption.Font(18,15), color:'#313131'}}>
                            号码
                        </CusBaseText>
                    </View>
                    <View style = {{flex:0.25, alignItems:'center', justifyContent:'center'}}>
                        <CusBaseText style = {{fontSize:Adaption.Font(18,15), color:'#313131'}}>
                            赔率
                        </CusBaseText>
                    </View>
                    <View style = {{flex:0.25, alignItems:'center', justifyContent:'center'}}>
                        <CusBaseText style = {{fontSize:Adaption.Font(18,15), color:'#313131'}}>
                            号码
                        </CusBaseText>
                    </View>
                    <View style = {{flex:0.25, alignItems:'center', justifyContent:'center'}}>
                        <CusBaseText style = {{fontSize:Adaption.Font(18,15), color:'#313131'}}>
                            赔率
                        </CusBaseText>
                    </View>
                </View>
                <View style = {{flexDirection:'row', height:40}}>
                    <View style = {{borderRightWidth:1, borderBottomWidth:1, borderColor:'#d2d2d2', flex:0.25, alignItems:'center', flexDirection:'row', justifyContent:'center'}}>
                        <View style = {{marginLeft:7,width:24,height:24, backgroundColor:'#00a0e9', borderRadius:12, alignItems:'center', justifyContent:'center'}}>
                            <CusBaseText style = {{color:'#fff', fontSize:Adaption.Font(17,14)}}>
                                单
                            </CusBaseText>
                        </View>
                        <View style = {{marginTop:-15, marginLeft:-7, width:12, height:12, borderRadius:6, backgroundColor:'#626262', alignItems:'center', justifyContent:'center'}}>
                            <CusBaseText style = {{color:'#fff', fontSize:Adaption.Font(10,7)}}>
                                3
                            </CusBaseText>
                        </View>
                    </View>
                    <LadderPeilvBtn
                        descBtnStr={'单3'}
                        borderRigth={true}
                        borderBottom={true}
                        iscancleSelect={this.state.isClearAllBallNum}
                        peilv={this.state.peilvDataList[6]}
                        onClickAC={(statue, btnID, peilv) => {
                            this._handleClickBall(statue, btnID, 6, peilv);
                        }}
                    />
                    <View style = {{borderRightWidth:1, borderBottomWidth:1, borderColor:'#d2d2d2', flex:0.25, alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
                        <View style = {{ marginTop:-15, width:12, height:12, borderRadius:6, backgroundColor:'#626262', alignItems:'center', justifyContent:'center'}}>
                            <CusBaseText style = {{color:'#fff', fontSize:Adaption.Font(10,7)}}>
                                3
                            </CusBaseText>
                        </View>
                        <View style = {{marginLeft:-3, width:24,height:24, backgroundColor:'#e33939', borderRadius:12, alignItems:'center', justifyContent:'center'}}>
                            <CusBaseText style = {{color:'#fff', fontSize:Adaption.Font(17,14)}}>
                                双
                            </CusBaseText>
                        </View>
                    </View>
                    <LadderPeilvBtn
                        descBtnStr={'双3'}
                        borderRigth={false}
                        borderBottom={true}
                        iscancleSelect={this.state.isClearAllBallNum}
                        peilv={this.state.peilvDataList[7]}
                        onClickAC={(statue, btnID, peilv) => {
                            this._handleClickBall(statue, btnID, 7, peilv);
                        }}
                    />
                </View>
                <View style = {{flexDirection:'row', height:40}}>
                    <View style = {{borderRightWidth:1, borderColor:'#d2d2d2', flex:0.25, alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
                        <View style = {{marginRight:-4, marginTop:-15, width:12, height:12, borderRadius:6, backgroundColor:'#626262', alignItems:'center', justifyContent:'center'}}>
                            <CusBaseText style = {{color:'#fff', fontSize:Adaption.Font(9,6)}}>
                                4
                            </CusBaseText>
                        </View>
                        <View style = {{marginRight:4,width:24,height:24, backgroundColor:'#00a0e9', borderRadius:12, alignItems:'center', justifyContent:'center',flexDirection:'row'}}>
                            <CusBaseText style = {{color:'#fff', fontSize:Adaption.Font(17,14)}}>
                                单
                            </CusBaseText>
                        </View>
                    </View>
                    <LadderPeilvBtn
                        descBtnStr={'单4'}
                        borderRigth={true}
                        borderBottom={false}
                        iscancleSelect={this.state.isClearAllBallNum}
                        peilv={this.state.peilvDataList[8]}
                        onClickAC={(statue, btnID, peilv) => {
                            this._handleClickBall(statue, btnID, 8, peilv);
                        }}
                    />
                    <View style = {{borderRightWidth:1, borderColor:'#d2d2d2', flex:0.25, alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
                        <View style = {{marginLeft:7, width:24,height:24, backgroundColor:'#e33939', borderRadius:12, alignItems:'center', justifyContent:'center'}}>
                            <CusBaseText style = {{color:'#fff', fontSize:Adaption.Font(17,14)}}>
                                双
                            </CusBaseText>
                        </View>
                        <View style = {{marginTop:-15, marginLeft:-7, width:12, height:12, borderRadius:6, backgroundColor:'#626262', alignItems:'center', justifyContent:'center'}}>
                            <CusBaseText style = {{color:'#fff', fontSize:Adaption.Font(9,6)}}>
                                4
                            </CusBaseText>
                        </View>
                    </View>
                    <LadderPeilvBtn
                        descBtnStr={'双4'}
                        borderRigth={false}
                        borderBottom={false}
                        iscancleSelect={this.state.isClearAllBallNum}
                        peilv={this.state.peilvDataList[9]}
                        onClickAC={(statue, btnID, peilv) => {
                            this._handleClickBall(statue, btnID, 9, peilv);
                        }}
                    />
                </View>
            </View>
        </View>
    }
}


//梯子游戏单个按钮点击视图
export class LadderPeilvBtn extends Component {

    constructor(props){
        super(props);

        this.state = ({
            peilvBtnClick:false,
            btnIdStr:props.descBtnStr,
            peilvStr:'',  //赔率字符串
        })
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.peilv) {

            this.setState({peilvStr: nextProps.peilv});
        }

        if (nextProps.iscancleSelect == true){
            this.setState({peilvBtnClick:false})
        }
    }


    render (){
        return <TouchableOpacity onPress = {() => {this.setState({peilvBtnClick:!this.state.peilvBtnClick}); this.props.onClickAC ? this.props.onClickAC(!this.state.peilvBtnClick, this.state.btnIdStr,this.state.peilvStr) : null;}} activeOpacity={0.7}
                                 style = {{backgroundColor:this.state.peilvBtnClick ? '#e33939' : '#fff',  borderColor:'#d2d2d2', borderRightWidth:this.props.borderRigth ? 1 : 0, borderBottomWidth:this.props.borderBottom ? 1 : 0, flex:0.25, alignItems:'center', justifyContent:'center'}}>
            <CusBaseText style = {{color:this.state.peilvBtnClick ? '#fff' : '#676767', fontSize:Adaption.Font(17,14)}}>
                {this.state.peilvStr}
            </CusBaseText>
        </TouchableOpacity>
    }
}