import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    FlatList,
    TouchableOpacity,
    Image,
    Text,
} from 'react-native';

class DrawerListView extends Component {

    //构造器
    constructor(props) {

        super(props);

        this.state = ({
            tag:props.tag ? props.tag : '',
            js_tag:props.jstag ? props.jstag : '',
            isRowList:false,
            dataSource: props.openList ? props.openList : [],
        })

        this.timer == null;
    }


    componentWillReceiveProps(nextProps) {

        //重新赋值tag 和 jstag 同步刷新界面
        if (nextProps.jstag != null && nextProps.openList.length != 0 && nextProps.tag != null){

            this.setState({
                js_tag:nextProps.jstag,
                tag:nextProps.tag,
                dataSource:nextProps.openList,
            })
        }
    }

    componentDidMount(){

      //分分种开奖时刷新的通知
      this.subscription = PushNotification.addListener('isRefreshOpenList', () => {

        this._fetchCurrentCZData(this.state.tag);

      });

    }

    //移除通知
    componentWillUnmount(){

        if (typeof(this.subscription) == 'object'){
            this.subscription && this.subscription.remove();
        }
    }

    //请求当前彩种的数据  //请求前10期开奖数据
    _fetchCurrentCZData(tag){

      let params = new FormData();
      params.append("ac", "getCPLogInfo");
      params.append("tag", tag);
      params.append('pcount', '10');  //显示前面10期开奖数据
      params.append('ncount', '5');

      var promise = GlobalBaseNetwork.sendNetworkRequest(params);
      promise
        .then((responseData) => {

          var prevList = [];
          var i = 0;
          let cainfoData = responseData.data;

          //解析prev数组
          cainfoData.prev.map((prev) =>{
              prevList.push({ key: i, value: prev});
              i++;
          });

          //setState方法可以立即改变界面, this.state.dataSource = prevList;值可以改变，但是不会立即刷新界面
          this.setState({
             dataSource:prevList,
          });

      })
    .catch((err) => {

    })

  }

    //点击改变高度
    _showLoList(isShow){

        this.setState({
            isRowList:isShow,
        })

            //展开列表动态改变控件高度,没有数据时不能展开
            if (isShow == true && this.state.dataSource.length != 0) {
                this._DrawerList.setNativeProps({
                    style: {
                        width: SCREEN_WIDTH,
                        height: this.state.dataSource.length * 30 + 20,
                    }
                })

                this._ListContent.setNativeProps({
                    style: {
                        width: SCREEN_WIDTH,
                        height: this.state.dataSource.length * 30 + 20,
                    }
                })

                this._drawRow.setNativeProps({
                    style: {
                        width: SCREEN_WIDTH,
                        height: 20,
                    }
                })
            }
            else {
                //收起列表高度统一设置为0
                this._DrawerList.setNativeProps({
                    style: {
                        width: SCREEN_WIDTH,
                        height: 20,
                    }
                })

                this._ListContent.setNativeProps({
                    style: {
                        height: 0,
                    }
                })

                this._drawRow.setNativeProps({
                    style: {
                        width: SCREEN_WIDTH,
                        height: 20,
                    }
                })

                this._HeaderView.setNativeProps({
                    styles: {
                        height: 0,
                    }
                })
            }
    }

    //头部视图
    _listHeaderComponent() {

      let isK3 = this.state.js_tag == 'k3';

      let isPK10 =  this.state.js_tag == 'pk10';

      return !isK3 ?
      (<View ref={(c) => this._HeaderView = c} style = {styles.List_HeaderView}>
          <View style = {[styles.List_Cell_Style, {flex: isPK10 ? 0.35 : 0.5}]}><CusBaseText style = {{fontSize:Adaption.Font(17,15), color:'black'}}>期数</CusBaseText></View>
          <View style = {[styles.List_Cell_Style, {flex: isPK10 ? 0.65 : 0.5}]}><CusBaseText style = {{fontSize:Adaption.Font(17,15), color:'black'}}>开奖号码</CusBaseText></View>
      </View>):(<View ref={(c) => this._HeaderView = c} style = {styles.List_HeaderView}>
          <View style = {styles.K3_Cell_Qishu}><CusBaseText style = {{fontSize:Adaption.Font(17,15), color:'black'}}>期数</CusBaseText></View>
          <View style = {styles.K3_Cell_KJHM}><CusBaseText style = {{fontSize:Adaption.Font(17,15), color:'black'}}>开奖号码</CusBaseText></View>
          <View style = {styles.K3_Cell_Comment}><CusBaseText style = {{fontSize:Adaption.Font(17,15), color:'black'}}>和值</CusBaseText></View>
          <View style = {styles.K3_Cell_Comment}><CusBaseText style = {{fontSize:Adaption.Font(17,15), color:'black',}}>大小</CusBaseText></View>
          <View style = {styles.K3_Cell_Comment}><CusBaseText style = {{fontSize:Adaption.Font(17,15), color:'black',}}>单双</CusBaseText></View>
      </View>);
    }

    //渲染每个子视图
    _renderItem = (item) => {

        //快三的判断
        let addNum = 0;

        let  ballStr = '';

        if (typeof(item) == 'object'){

            ballStr = item.item.value.balls;

            if (ballStr && ballStr.length == 5) {
                let ballArr = ballStr.split(' ');

                for (var i = 0; i < ballArr.length; i++) {
                    addNum += parseInt(ballArr[i]);
                }
            }
        }

        //大小判断
        let addStr = addNum >10 ? '大':'小';

        //单双判断
        let singleStr = addNum %2 != 0 ? '单':'双';

        //大小单双背景颜色

        var statuesBGcolor = addStr == '大' ? '#00a0e9' : '#f39800';
        var sigleBGcolor = singleStr == '单' ? '#00a0e9' : '#f39800';

        //背景颜色
        var bgColor = item.index % 2 == 0 ? '#f3f3f3' : '#fff';

        let isK3 = this.state.js_tag == 'k3';

        let isPK10 =  this.state.js_tag == 'pk10';


        return !isK3 ? (<View style = {{flexDirection:'row', height:28, width:SCREEN_WIDTH, backgroundColor:bgColor}}>
              <View style = {[styles.List_Cell_Style, {flex: isPK10 ? 0.35 : 0.5}]}><CusBaseText style = {{fontSize:Adaption.Font(15,13), textAlign:'center', color:'black'}}>{item.item.value.qishu ? item.item.value.qishu : '-'}</CusBaseText></View>
              <View style = {[styles.List_Cell_Style, {flex: isPK10 ? 0.65 : 0.5, marginRight:5}]}><CusBaseText style = {{fontSize:Adaption.Font(15,13), textAlign:'center', color:'red'}}>{ballStr.length != 0 ? ballStr:'正在开奖...'}</CusBaseText></View>
          </View>) : (<View style = {{flexDirection:'row', height:28, width:SCREEN_WIDTH, backgroundColor:bgColor}}>
              <View style = {styles.K3_Cell_Qishu}><CusBaseText style = {{fontSize:Adaption.Font(15,13),textAlign:'center', color:'red'}}>{item.item.value.qishu ? item.item.value.qishu : '-'}</CusBaseText></View>
              <View style = {styles.K3_Cell_KJHM}><CusBaseText style = {{fontSize:Adaption.Font(15,13), textAlign:'center',color:'red'}}>{ballStr != '' ? ballStr:'正在开奖...'}</CusBaseText></View>
              <View style = {styles.K3_Cell_Comment}><CusBaseText style = {{fontSize:Adaption.Font(15,13), textAlign:'center',color:'red'}}>{addNum != 0 ? addNum : '-'}</CusBaseText></View>
              <View style = {styles.K3_Cell_Comment}><View style = {{backgroundColor:statuesBGcolor, width:Adaption.Width(20), height:Adaption.Width(20), borderRadius:5, alignItems:'center', justifyContent:'center'}}><CusBaseText style = {{fontSize:Adaption.Font(15,13), textAlign:'center', color:'white', }}>{addNum != 0 ? addStr : '-'}</CusBaseText></View></View>
              <View style = {styles.K3_Cell_Comment}><View style = {{backgroundColor:sigleBGcolor, width:Adaption.Width(20), height:Adaption.Width(20), borderRadius:5, alignItems:'center', justifyContent:'center'}}><CusBaseText style = {{fontSize:Adaption.Font(15,13), textAlign:'center', color:'white'}}>{addNum != 0 ? singleStr : '-'}</CusBaseText></View></View>
          </View>);
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={1} ref={(c) => this._DrawerList = c} onPress = {() => this._showLoList(!this.state.isRowList)} style={this.props.style}>
                <FlatList
                    ref={(c) => this._ListContent = c}
                    style = {{width:SCREEN_WIDTH, height:0}}
                    renderItem={this._renderItem}
                    data={this.state.isRowList == true ? this.state.dataSource:null}
                    ListHeaderComponent={() => this._listHeaderComponent()}
                    automaticallyAdjustContentInsets={false}
                    alwaysBounceHorizontal = {false}
                    scrollEnabled = {false}
                    >
                </FlatList>
                <TouchableOpacity activeOpacity={0.5} ref={(c) => this._drawRow = c} onPress = {() => this._showLoList(!this.state.isRowList)}><Image style = {{width:SCREEN_WIDTH, height:20}} source = {require('../../img/ic_drawerListRow.png')}></Image></TouchableOpacity>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({

  //头部视图样式（标题）
    List_HeaderView:{
      flexDirection:'row',
      height:24,
      width:SCREEN_WIDTH,
      backgroundColor:'#f3f3f3',
      borderBottomWidth:1,
      borderColor:'lightgrey',
    },
    //普通cell的样式
    List_Cell_Style:{
      justifyContent:'center',
      alignItems:'center'
    },

    //快三特殊样式
    K3_Cell_Qishu:{
      flex:0.3,
      justifyContent:'center',
      alignItems:'center',
    },

    K3_Cell_KJHM:{
      flex:0.3,
      justifyContent:'center',
      alignItems:'center',
    },

    K3_Cell_Comment:{
      flex:0.13,
      justifyContent:'center',
      alignItems:'center',
    },

});

export  default  DrawerListView;
