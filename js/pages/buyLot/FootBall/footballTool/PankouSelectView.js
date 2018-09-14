/**
 * Created by Ward on 2018/07/17.
 * 足球彩票盘口选择视图
 */

import React, { Component } from 'react';
import {
    View,
} from 'react-native';

import ScorcePickList from './ScorcePickListView'; //下拉视图
import ScorceTimeView from './ScorceTimerFreshView'; //倒计时视图


export default class PankouSelectView extends Component{

    constructor(props){

        super(props);
    }

    render(){

        return <View style = {{backgroundColor:'#f5f6f7', height:50, width:SCREEN_WIDTH,flexDirection:'row'}}>
            <View style = {{flex:0.5}}>
                <ScorcePickList
                    viewType={'normal'}
                    style = {{width:SCREEN_WIDTH/2, height:50, backgroundColor:'#fff'}} dataSource={['香港盘','欧洲盘']}
                    dropDownItemSelect = {(itemObject)=>{
                        this.props.PankouPicker ? this.props.PankouPicker(itemObject) : null;
                    }}
                />
            </View>
            <View style = {{height:30, marginTop:10, width:1, backgroundColor:'#d7d8d9'}} />
            <View style = {{flex:0.5}}>
                <ScorceTimeView gameTypeID={this.props.gameTypeID}/>
            </View>
        </View>
    }

}