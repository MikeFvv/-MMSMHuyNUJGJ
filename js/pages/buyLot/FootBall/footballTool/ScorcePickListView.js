/**
 * Created by Ward on 2018/07/17.
 * 足球彩票下拉选择视图
 */

import React, { Component } from 'react';
import {
    FlatList,
    TouchableOpacity,
    Image,
    View,
} from 'react-native';

export default class ScorcePickListView extends Component{

    constructor(props){
        super(props);

        this.state = ({
            selectDataList:props.dataSource ? props.dataSource : [],  //接收上个页面
            selectIndexTag:0,  //默认选择的下标
            isClickPankou:false, //是否点击盘口
        })
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.dataSource != this.state.selectDataList){
            this.setState({
                selectDataList:nextProps.dataSource,
            })
        }
    }

    _renderItemView = (item) =>{

        return <TouchableOpacity
                activeOpacity={0.7}
                style = {{height:40, flexDirection:'row', alignItems:'center', backgroundColor:this.state.selectIndexTag == item.index ? '#fef1de' : '#feffff'}}
                onPress = {()=> {

                    this.setState({
                        selectIndexTag:item.index,
                        isClickPankou:!this.state.isClickPankou,
                    })

                    this.contentViewHeight.setNativeProps({
                        style: {
                            height: 50,
                            width:this.props.style.width,
                        }
                    })

                    this.props.dropDownItemSelect ? this.props.dropDownItemSelect(item) : null;
                }}
                >
            <View style = {{flex:0.93, justifyContent:'center'}}>
                <CusBaseText style = {{color:'#55595a', marginLeft:15, fontSize:Adaption.Font(17,15)}}>
                    {item.item}
                </CusBaseText>
            </View>
            {this.state.selectIndexTag == item.index ? <View style = {{flex:0.15, justifyContent:'center'}}>
                <Image source={require('../img/ic_pickListGou.png')} style = {{width:14,height:14, resizeMode:'stretch'}}/>
            </View> : <View style = {{flex:0.07}}/>}
        </TouchableOpacity>
    }

    render() {

        {/* viewType = normal 是盘口的选择视图，其他的都是分类下拉的选择视图*/}

        return (this.props.viewType == 'normal' ? <View style={[this.props.style]} ref={(c) => this.contentViewHeight = c}>
            <TouchableOpacity
                activeOpacity={0.7}
                style = {{height:50, flexDirection:'row',justifyContent:'center', alignItems:'center', backgroundColor:'#f5f6f7'}}
                onPress = {()=> {
                    this.state.isClickPankou = !this.state.isClickPankou;

                    if (this.state.isClickPankou == true){

                        this.contentViewHeight.setNativeProps({
                            style: {
                                height: 50 + this.state.selectDataList.length * 40,
                                width:this.props.style.width,
                            }
                        })
                    }
                    else {

                        this.contentViewHeight.setNativeProps({
                            style: {
                                height: 50,
                                width:this.props.style.width,
                            }
                        })
                    }
                }}
            >
                <CusBaseText style = {{color:'black', fontSize:Adaption.Font(18,16)}}>
                    {this.state.selectDataList[this.state.selectIndexTag]}
                </CusBaseText>
                <Image source={require('../img/ic_pankouRow.png')} style = {{width:15, height:15, marginLeft:10, resizeMode:'stretch'}}/>
            </TouchableOpacity>
            <FlatList
                data={this.state.selectDataList}
                renderItem={this._renderItemView}
                extraData={this.state}  //防止state刷新界面没刷新
            />
        </View> : <View style={[this.props.style]} ref={(c) => this.contentViewHeight = c}>
            <TouchableOpacity
                activeOpacity={0.7}
                style = {{borderRadius:5,borderColor:'#d3d3d3',borderWidth:1, marginTop:10, height:50, flexDirection:'row',justifyContent:'center', alignItems:'center'}}
                onPress = {()=> {
                    this.state.isClickPankou = !this.state.isClickPankou;

                    if (this.state.isClickPankou == true){

                        this.contentViewHeight.setNativeProps({
                            style: {
                                height: 70 + this.state.selectDataList.length * 40,
                                width:this.props.style.width,
                            }
                        })
                    }
                    else {

                        this.contentViewHeight.setNativeProps({
                            style: {
                                height: 50,
                                width:this.props.style.width,
                            }
                        })
                    }
                }}
            >
                <View style = {{flex:0.9}}>
                    <CusBaseText style = {{marginLeft:10, color:'black', fontSize:Adaption.Font(18,16)}}>
                        {this.state.selectDataList[this.state.selectIndexTag]}
                    </CusBaseText>
                </View>
                <View style = {{flex:0.1}}>
                    <Image source={require('../img/arrowDown.png')} style = {{width:13, height:13, resizeMode:'stretch'}}/>
                </View>
            </TouchableOpacity>
            <FlatList
                style = {{backgroundColor:'#fff',borderRightWidth:1, borderLeftWidth:1, borderBottomWidth:1, borderColor:'#d3d3d3', borderRadius:5}}
                data={this.state.selectDataList}
                renderItem={this._renderItemView}
                extraData={this.state}  //防止state刷新界面没刷新
            />
        </View>)
    }

}