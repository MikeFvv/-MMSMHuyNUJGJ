/**
 * Created by Ward on 2018/07/27.
 * 足球彩票赔率计算表
 */

import React, { Component } from 'react';
import {
    View,
    FlatList,
    ScrollView,
    StyleSheet,
} from 'react-native';

import PanKouChangeTool from '../footballTool/ScorcePanKouPeilvChange';  //盘口转换的工具类
let CellBackColor = '#f8f8f7';  //特殊Item颜色背景

export default class PeilvCaculateTable extends Component{

    static navigationOptions = ({ navigation }) => ({

        header: (

            <CustomNavBar
                leftClick={() => {navigation.goBack()}}
                centerText = {"赔率计算表"}
            />
        ),

    });

    constructor(props){
        super(props);

        this.state = ({
            peilvDataList:[],  //赔率转换表数据源
        })
    }

    componentDidMount() {

        //模拟赔率转换表
        let testDataArr = [{hkpeilv:'0.10'},{hkpeilv:'0.20'},{hkpeilv:'0.35'},{hkpeilv:'0.40'},{hkpeilv:'0.50'},{hkpeilv:'0.65'},{hkpeilv:'0.75'}
        ,{hkpeilv:'0.83'},{hkpeilv:'0.96'},{hkpeilv:'1.00'}, {hkpeilv:'1.15'},{hkpeilv:'1.35'},{hkpeilv:'1.45'},{hkpeilv:'1.55'},{hkpeilv:'1.65'}
        ,{hkpeilv:'1.74'},{hkpeilv:'1.97'},{hkpeilv:'2.05'},{hkpeilv:'3.45'},{hkpeilv:'4.25'},{hkpeilv:'5.00'},{hkpeilv:'8.00'},{hkpeilv:'10.00'}];
        this.setState({peilvDataList:testDataArr});
    }

    //创建赔率计算列表
    _createPeilvList(){

        let viewFlexArr = [0.2,0.2,0.2,0.2,0.2];
        let headerTitltArr = ['赔率盘', '投注金额', '赔率', '赢', '输'];
        let headerView = [];  //头部视图数组

        //创建头部视图
        for (let i = 0; i < headerTitltArr.length; i++){

            headerView.push(<View style = {{alignItems:'center', justifyContent:'center', flex:viewFlexArr[i]}}>
                <CusBaseText style = {styles.pankouTextColorStyle}>
                    {headerTitltArr[i]}
                </CusBaseText>
            </View>)
        }

        let headerContent = [];  //头部内容视图数组
        let pankouArr = ['香港盘', '马来盘', '印尼盘', '欧洲盘'];
        //模拟赔率计算列表
        let pankouTestDataArr = [[{tzprice:'1000',peilv:'0.80',win:'800',loss:'-1000'},{tzprice:'',peilv:'1.130',win:'1130',loss:'-1000'}],[{tzprice:'1000',peilv:'0.80',win:'800',loss:'-1000'},{tzprice:'',peilv:'-0.88',win:'1000',loss:'-880'}],
            [{tzprice:'1000',peilv:'1.13',win:'1130',loss:'-1000'},{tzprice:'',peilv:'-1.25',win:'1000',loss:'-1250'}],[{tzprice:'1000',peilv:'1.80',win:'800',loss:'-1000'},{tzprice:'',peilv:'2.13',win:'1130',loss:'-1000'}]];

        //循环创建内容视图
        for (let j = 0; j < pankouArr.length; j++){

            headerContent.push(<View style = {{flexDirection:'row', height:70, backgroundColor:j % 2 == 0 ? '#fff' : CellBackColor}}>
                <View style = {{flex:0.2, borderColor:'#d1d2d3', borderBottomWidth:.5, borderRightWidth:.5, alignItems:'center', justifyContent:'center'}}>
                    <CusBaseText style = {{fontSize:Adaption.Font(17,15)}}>
                        {pankouArr[j]}
                    </CusBaseText>
                </View>
                <View style = {{flex:0.8, height:70}}>
                    <View style = {{flexDirection:'row', height:35}}>
                        <View style = {[{flex:0.25}, styles.headerContentViewStyle]}>
                            <CusBaseText style = {{fontSize:Adaption.Font(15,12), color:pankouTestDataArr[j][0].tzprice.includes('-') ? '#e0393a' : '#444445'}}>
                                {pankouTestDataArr[j][0].tzprice}
                            </CusBaseText>
                        </View>
                        <View style = {[{flex:0.25}, styles.headerContentViewStyle]}>
                            <CusBaseText style = {{fontSize:Adaption.Font(15,12), color:pankouTestDataArr[j][0].peilv.includes('-') ? '#e0393a' : '#444445'}}>
                                {pankouTestDataArr[j][0].peilv}
                            </CusBaseText>
                        </View>
                        <View style = {[{flex:0.25}, styles.headerContentViewStyle]}>
                            <CusBaseText style = {{fontSize:Adaption.Font(15,12), color:pankouTestDataArr[j][0].win.includes('-') ? '#e0393a' : '#444445'}}>
                                {pankouTestDataArr[j][0].win}
                            </CusBaseText>
                        </View>
                        <View style = {[{flex:0.25}, styles.headerContentViewStyle]}>
                            <CusBaseText style = {{fontSize:Adaption.Font(15,12), color:pankouTestDataArr[j][0].loss.includes('-') ? '#e0393a' : '#444445'}}>
                                {pankouTestDataArr[j][0].loss}
                            </CusBaseText>
                        </View>
                    </View>
                    <View style = {{flexDirection:'row', height:35}}>
                        <View style = {[{flex:0.25}, styles.headerContentViewStyle]} />
                        <View style = {[{flex:0.25}, styles.headerContentViewStyle]}>
                            <CusBaseText style = {{fontSize:Adaption.Font(15,12), color:pankouTestDataArr[j][1].peilv.includes('-') ? '#e0393a' : '#444445'}}>
                                {pankouTestDataArr[j][1].peilv}
                            </CusBaseText>
                        </View>
                        <View style = {[{flex:0.25}, styles.headerContentViewStyle]}>
                            <CusBaseText style = {{fontSize:Adaption.Font(15,12), color:pankouTestDataArr[j][1].win.includes('-') ? '#e0393a' : '#444445'}}>
                                {pankouTestDataArr[j][1].win}
                            </CusBaseText>
                        </View>
                        <View style = {[{flex:0.25}, styles.headerContentViewStyle]}>
                            <CusBaseText style = {{fontSize:Adaption.Font(15,12), color:pankouTestDataArr[j][1].loss.includes('-') ? '#e0393a' : '#444445'}}>
                                {pankouTestDataArr[j][1].loss}
                            </CusBaseText>
                        </View>
                    </View>
                </View>
            </View>)
        }

        return <View style = {{height:315, width:SCREEN_WIDTH}}>
            <View style = {{flexDirection:'row', height:35, backgroundColor:CellBackColor}}>
                {headerView}
            </View>
            {headerContent}
        </View>
    }

    //FlatList相关
    _renderItemView = (item) => {

        let itemCellBackColor = item.index % 2 == 0 ? '#fff' : CellBackColor;
        let malaipan = PanKouChangeTool.getScorcePankouChangePeilv(item.item.hkpeilv, '马来盘');
        let yinnipan = PanKouChangeTool.getScorcePankouChangePeilv(item.item.hkpeilv, '印尼盘');

        return <View style = {{height:40, backgroundColor:itemCellBackColor, flexDirection:'row', width:SCREEN_WIDTH}}>
            <View style = {[styles.peilvItemStyle, {borderColor:'#d1d2d3', borderBottomWidth:.8, borderRightWidth:.8}]}>
                <CusBaseText style = {{fontSize:Adaption.Font(16,14), color:item.item.hkpeilv.includes('-') ? '#e0393a' : '#444445'}}>
                    {item.item.hkpeilv}
                </CusBaseText>
            </View>
            <View style = {[styles.peilvItemStyle, {borderColor:'#d1d2d3', borderBottomWidth:.8, borderRightWidth:.8}]}>
                <CusBaseText style = {{fontSize:Adaption.Font(16,14), color:malaipan.includes('-') ? '#e0393a' : '#444445'}}>
                    {malaipan}
                </CusBaseText>
            </View>
            <View style = {[styles.peilvItemStyle, {borderColor:'#d1d2d3', borderBottomWidth:.8, borderRightWidth:.8}]}>
                <CusBaseText style = {{fontSize:Adaption.Font(16,14), color:yinnipan.includes('-') ? '#e0393a' : '#444445'}}>
                    {yinnipan}
                </CusBaseText>
            </View>
        </View>

    }

    _listHeaderComponent(){

        return <View style = {{flexDirection:'row', height:35, backgroundColor:CellBackColor}}>
            <View style = {styles.peilvItemStyle}>
                <CusBaseText style = {styles.pankouTextColorStyle}>
                    香港盘
                </CusBaseText>
            </View>
            <View style = {styles.peilvItemStyle}>
                <CusBaseText style = {styles.pankouTextColorStyle}>
                    马来盘
                </CusBaseText>
            </View>
            <View style = {styles.peilvItemStyle}>
                <CusBaseText style = {styles.pankouTextColorStyle}>
                    印尼盘
                </CusBaseText>
            </View>
        </View>
    }

    render(){
        return <ScrollView style = {{flex:1, backgroundColor:'#fff'}}>
            <View style = {{backgroundColor:'#f5f6f7', height:45, width:SCREEN_WIDTH, justifyContent:'center', borderBottomWidth:1, borderColor:'#d1d2d3'}}>
               <CusBaseText style = {{fontSize:Adaption.Font(19,17), color:'black', marginLeft:15}}>
                   赔率计算列表
               </CusBaseText>
            </View>
            {this._createPeilvList()}
            <View style = {{backgroundColor:'#f5f6f7', height:45, width:SCREEN_WIDTH, justifyContent:'center', borderBottomWidth:1, borderColor:'#d1d2d3'}}>
                <CusBaseText style = {{fontSize:Adaption.Font(19,17), color:'black', marginLeft:15}}>
                    赔率转换表
                </CusBaseText>
            </View>
            <FlatList
                renderItem={this._renderItemView}
                data={this.state.peilvDataList.length != 0 ? this.state.peilvDataList : []}
                ListHeaderComponent={() => this._listHeaderComponent()}
            />
            <View style = {{height:40, width:SCREEN_WIDTH}}/>
        </ScrollView>
    }

}

const styles = StyleSheet.create({

    //盘口文字颜色
    pankouTextColorStyle:{
        color:'#7e6b58',
        fontSize:Adaption.Font(17,15)
    },

    //赔率计算列表单个Item的样式
    headerContentViewStyle:{
        height:35,
        borderColor:'#d1d2d3',
        borderBottomWidth:.8,
        borderRightWidth:.8,
        alignItems:'center',
        justifyContent:'center',
    },

    //FlatList样式
    peilvItemStyle:{
        flex:0.33,
        alignItems:'center',
        justifyContent:'center',
    }
})