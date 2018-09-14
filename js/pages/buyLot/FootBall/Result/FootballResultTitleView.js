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

let dropDownTitleList = [{key:0, title:'联赛', gameCount:0}, {key:1, title:'冠军', gameCount:0},
    ];

export  default  class FootballResultTitleView extends Component {

    constructor(props) {
        super(props);

        this.state = ({

            isShow:false,
            currentSelectIndex:props.selectIndex ? props.selectIndex : 1,  //默认选择的是今日赛事
            dropDownList:[],       //标题数组
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

    componentDidMount() {

        this.setState({
            dropDownList:dropDownTitleList,
        })
    }

    _renderItemView = (item) => {

        let radiusNum = 5;
        let borderCL = '#e33939';
        let borderWD = 1;
        let itemTitleCL = '#e33939';

        if (item.index != this.state.currentSelectIndex)
        {
            borderCL = '#d5d5d5';
            itemTitleCL = '#454545';
        }

        return <TouchableOpacity
            onPress = {() => {this.setState({isShow:false}); this.props.itemTitleSelect ? this.props.itemTitleSelect(item) : null}}
            activeOpacity = {1}
            style = {{marginTop:15, marginLeft:20,marginRight:20, flexDirection:'row', width:SCREEN_WIDTH/2 - 40, height:36, alignItems:'center', justifyContent:'center',  borderRadius:radiusNum, borderColor:borderCL, borderWidth:borderWD}}>

            <CusBaseText style = {{textAlign:'center',fontSize:Adaption.Font(16,13), color:itemTitleCL}}>
                {item.item.title}
            </CusBaseText>

            {item.index == this.state.currentSelectIndex ? <Image source = {require('../img/ic_ScorceSelect.png')} style = {{position:'absolute',bottom:0,right:0,width:17, height:17,}}/> : null}

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
                    numColumns={2} //指定多少列
                    showsVerticalScrollIndicator={false} //不显示右边滚动条
                    style = {{backgroundColor:'#fff', height:70}}
                />
                <View style = {{height:SCREEN_HEIGHT - 70}}>

                </View>
            </TouchableOpacity>
        </Modal>);
    }
}