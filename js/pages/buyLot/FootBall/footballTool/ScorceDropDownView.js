/**
 * Created by Ward on 2018/03/21.
 */

import React, { Component } from 'react'
import {
    View,
    Modal,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native'

let dropDownTitleList = [{key:0, title:'滚球', gameCount:0, sportID: 2001}, {key:1, title:'今日赛事', gameCount:0, sportID: 2001},
    {key:2, title:'早盘', gameCount:0, sportID: 2001}, {key:3, title:'综合过关', gameCount:0, sportID: 2001}, {key:4, title:'冠军', gameCount:0, sportID: 2001}];

export  default  class ScorceDropDownView extends Component {

    constructor(props) {
        super(props);

        this.state = ({

            isShow:false,
            currentSelectIndex:props.selectIndex ? props.selectIndex : 1,  //默认选择的是今日赛事
            dropDownList:[],       //标题数组
            sport_Id:props.sportID ? props.sportID : 2001,  //sportID
        })
    }

    show = () => {
        this.setState({
            isShow:true,
        })
    }

    //属性改变时的方法
    componentWillReceiveProps(nextProps) {

        if (nextProps.selectIndex != this.state.currentSelectIndex){
            this.setState({
                currentSelectIndex:nextProps.selectIndex,
            })
        }
    }

    //一进来默认显示初始数据0条
    componentWillMount(){

        this.setState({dropDownList:dropDownTitleList});
    }

    componentDidMount() {

        this._fetchTypeData();
    }

    componentWillUnmount(){
        dropDownTitleList = [{key:0, title:'滚球', gameCount:0, sportID: 2001}, {key:1, title:'今日赛事', gameCount:0, sportID: 2001},
            {key:2, title:'早盘', gameCount:0, sportID: 2001}, {key:3, title:'综合过关', gameCount:0, sportID: 2001}, {key:4, title:'冠军', gameCount:0, sportID: 2001}];  //退出页面时全部赋值0条
    }

    //请求足彩列表的类型数据
    _fetchTypeData(){

        let params = new FormData();
        params.append('ac', 'getSportMatchList');
        params.append('game_type', 5);
        params.append('sport_id',  this.state.sport_Id);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                let typeDataModel = {today:[], early:[], parlay:[], champion:[], inPlay:[]};

                if (responseData.msg == 0 && responseData.data){

                    typeDataModel = responseData.data;
                    this._setDataSource(typeDataModel);
                    this.props.isSystemVerb ?  this.props.isSystemVerb(false, '') : null;
                }
                else if (responseData.msg == 50003){
                    this._setDataSource(typeDataModel);
                    this.props.isSystemVerb ?  this.props.isSystemVerb(true, responseData.data.maintenance_time) : null;
                }
            })
            .catch((err) => {

            })
    }

    _setDataSource(typeModel){

        //判断请求结果是否回来 0 滚球, 1今日赛事， 2 早盘， 3 综合过关， 4 冠军
        if (typeModel.inPlay){

            for (let i = 0; i < dropDownTitleList.length; i++){

                let model = dropDownTitleList[i];

                switch (i){

                    case 0 :

                        model.gameCount = typeModel.inPlay[0] ? typeModel.inPlay[0].game_cnt : 0;
                        model.sportID = typeModel.inPlay[0] ? typeModel.inPlay[0].sport_id : 0;
                        break;

                    case 1 :

                        model.gameCount = typeModel.today[0] ? typeModel.today[0].game_cnt : 0;
                        model.sportID = typeModel.today[0] ? typeModel.today[0].sport_id : 0;
                        break;

                    case 2 :

                        model.gameCount = typeModel.early[0] ? typeModel.early[0].game_cnt : 0;
                        model.sportID = typeModel.early[0] ? typeModel.early[0].sport_id : 0;
                        break;

                    case 3 :

                        model.gameCount = typeModel.parlay[0] ? typeModel.parlay[0].game_cnt : 0;
                        model.sportID = typeModel.parlay[0] ? typeModel.parlay[0].sport_id : 0;
                        break;

                    case 4 :

                        model.gameCount = typeModel.champion[0] ? typeModel.champion[0].game_cnt : 0;
                        model.sportID = typeModel.champion[0] ? typeModel.champion[0].sport_id : 0;
                        break;

                    default :
                        break;
                }
            }

            this.setState({
                dropDownList:dropDownTitleList,
            })
        }
    }

    _renderItemView = (item) => {

        let radiusNum = 5;
        let borderCL = '#e33939';
        let borderWD = 1;
        let itemTitleCL = '#e33939';

        if (item.index != this.state.currentSelectIndex){
            borderCL = '#d5d5d5';
            itemTitleCL = '#454545';
        }

        return <TouchableOpacity
            onPress = {() => {this.setState({isShow:false}); this.props.itemTitleSelect ? this.props.itemTitleSelect(item) : null}}
            activeOpacity = {1}
            style = {{marginTop:15, marginLeft:7, flexDirection:'row', width:SCREEN_WIDTH/3 - 9, height:36, alignItems:'center', justifyContent:'center',  borderRadius:radiusNum, borderColor:borderCL, borderWidth:borderWD}}>
                <CusBaseText style = {{textAlign:'center',marginLeft:5, width:SCREEN_WIDTH/3 - 9 - 24,fontSize:Adaption.Font(15,12), color:itemTitleCL}}>
                    {item.item.title} <CusBaseText style = {{textAlign:'left', fontSize:Adaption.Font(14,11), color:'#e33939'}}>
                    {item.item.gameCount}
                </CusBaseText>
                </CusBaseText>
                {item.index == this.state.currentSelectIndex ? <Image source = {require('../img/ic_ScorceSelect.png')} style = {{marginTop:17,width:17, height:17}}/> : null}
        </TouchableOpacity>
    }

    render () {

        let topHeight =  SCREEN_HEIGHT == 812 ? 88 : 64;

        return (<Modal
            visible={this.state.isShow}
            animationType={'fade'}
            transparent={true}
            onRequestClose={() => {}}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {this.setState({isShow:false})}}>
                <View style={{ height: topHeight, width: SCREEN_WIDTH}}>
                </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity = {1} onPress = {() => {this.setState({isShow:false})}} style = {{width:SCREEN_WIDTH, height:SCREEN_HEIGHT, backgroundColor:'rgba(0,0,0,0.4)'}}>
                <FlatList
                    data={this.state.dropDownList.length != 0 ? this.state.dropDownList : []}
                    renderItem={item => this._renderItemView(item)}
                    horizontal={false} //水平还是垂直
                    numColumns={3} //指定多少列
                    showsVerticalScrollIndicator={false} //不显示右边滚动条
                    style = {{backgroundColor:'#fff', height:120}}
                />
                <View style = {{height:SCREEN_HEIGHT - 120}}>

                </View>
            </TouchableOpacity>
        </Modal>);
    }
}