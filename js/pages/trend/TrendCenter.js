
/**
 Created by Money on 2018/04/29
 */

import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  AsyncStorage,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import Toast, {DURATION} from 'react-native-easy-toast'  //土司视图
import TrendBallLine from './TrendBallLine';  // 走势中心内容

export default class TrendCenter extends Component {


  constructor(props) {
    super(props);

    this.state = {
      dataDic: [],
      isLoading: false,
      selectBtnIdx: props.selectIdx,
      isPullRefresh: false,
    };

    this.titleArr = [];
    this.js_tag = '';
  }

  componentDidMount() {
    this._getTrendData(this.props.game_id); // 获取数据
  }

  // 返回是否要刷新render
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.showGameView == true) {
      return false; // 显示选择玩法的view时不刷新
    }

    if (nextState.dataDic != this.state.dataDic || nextState.isLoading != this.state.isLoading || nextState.isPullRefresh != this.state.isPullRefresh || nextState.selectBtnIdx != this.state.selectBtnIdx) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showGameView) {
      return;
    }
    // id不相同 切换彩种了
    if (this.props.game_id != nextProps.game_id || (this.state.dataDic.gameid ? nextProps.game_id != this.state.dataDic.gameid : false)) {
      this._getTrendData(nextProps.game_id);
    }
  }

  // 先从缓存取，再请求
  _getTrendData(gameId) {

    let cacheData = global.GTrendDatas[`gameid${gameId}`];
    if (cacheData != null && cacheData['list'].length > 0) {
      this._handleData(cacheData); // 处理
    }

    if (this.state.selectBtnIdx >= 1) {
      this._requestTrendData(gameId, true);  // 请求
    } else {
      this._requestTrendData(gameId, false);  // 请求
    }

  }

  // 请求
  _requestTrendData(gameId, isShowLoad) {

    this.setState({
      isLoading: isShowLoad ? true : false,
    })

    let params = new FormData();
    params.append('ac', 'getTrenlistData');
    params.append('gameid', gameId);

    var promise = GlobalBaseNetwork.sendNetworkRequest(params);
    promise
      .then(response => {
        if (response.msg == 0) {

          global.GTrendDatas[`gameid${gameId}`] = response.data; 
          // 缓存数据
          let datas = JSON.stringify(global.GTrendDatas);
          AsyncStorage.setItem('TrendDatas', datas, (error) => { });

          this._handleData(response.data);

        } else {
          this.refs.Toast && this.refs.Toast.show('走势数据:  '+ response.param, 1500);
          this.setState({
            isPullRefresh: false,
            isLoading: false,
          })
        }

      })
      .catch(err => {
        this.refs.Toast && this.refs.Toast.show('走势数据请求失败！', 1500);
        this.setState({
          isPullRefresh: false,
          isLoading: false,
        })
      })
  }

  _handleData(data) {

    let js_tag = data['js_tag'];
    this.js_tag = js_tag;

    if (!this.state.isPullRefresh) { // 如果是下拉，则不重置。
      this.state.selectBtnIdx = js_tag == 'lhc' ? 0 : this.props.selectIdx; // 重置。
    }

    if (js_tag == '3d') {
      this.titleArr = ["百位走势", "十位走势", "个位走势"];
      
    } else if (js_tag == 'k3') {
      this.titleArr = ["一位走势", "二位走势", "三位走势"];

    } else if (js_tag == 'ssc') {
      this.titleArr = ["万位走势", "千位走势", "百位走势", "十位走势", "个位走势"];
        
    } else if (js_tag == '11x5') {
      this.titleArr = ["一位走势", "二位走势", "三位走势", "四位走势", "五位走势"];
        
    } else if (js_tag == 'pk10') {
      this.titleArr = ["冠军走势", "亚军走势", "季军走势", "第四名", "第五名", "第六名", "第七名", "第八名", "第九名", "第十名"];
        
    } else if (js_tag == 'pcdd') {
      this.titleArr = ["正码一", "正码二", "正码三"];
    
    } else {
      this.titleArr = ["开奖结果"];
    }
    
    this.props.game_id = data['gameid']; 
    this.props.currentData ? this.props.currentData({'game_id': data['gameid'], 'game_name': data['game_name'], 'js_tag': data['js_tag'] }) : null;

    this.setState({
      dataDic: data,
      isPullRefresh: false,
      isLoading: false,
    })
  }


  // 头部结果和走势的按钮
  _createHeaderBtn(data) {

    let btnArr = [];
    for (let a = 0; a <= (this.js_tag == 'lhc' ? 0 : data.length); a++) {
      btnArr.push(
        <TouchableOpacity key={a} activeOpacity={0.7} 
          style={{ width: this.js_tag == 'lhc' ? SCREEN_WIDTH : SCREEN_WIDTH / 4.0, justifyContent: 'center', alignItems: 'center', borderColor: COLORS.appColor, borderBottomWidth: this.state.selectBtnIdx == a ? 2 : 0 }}
          onPress={() => {
            if (a != this.state.selectBtnIdx) {

              if (a <= 1) {
                this.refs.HeaderScrollView && this.refs.HeaderScrollView.scrollTo({ x: 0, animated: true }); // 滚动到最开始
              } else if (a >= data.length - 1) {
                this.refs.HeaderScrollView && this.refs.HeaderScrollView.scrollToEnd({ animated: true }); // 滚动到最后
              } else {
                this.refs.HeaderScrollView && this.refs.HeaderScrollView.scrollTo({ x: (a-2) * SCREEN_WIDTH / 4.0 + (SCREEN_WIDTH / 4.0 / 2), animated: true }); // 最开始
              }
              this.setState({
                selectBtnIdx: a,
              })
            }
          }}>
          <Text allowFontScaling={false} style={{ color: this.state.selectBtnIdx == a ? COLORS.appColor : '#626262', fontSize: Adaption.Font(18, 15) }}>{a == 0 ? '开奖结果' : `${data[a-1]}`}</Text>
        </TouchableOpacity>
      )
    }
    return btnArr;
  }

  _loadingView() {
    return (
      <View style={{ backgroundColor: 'rgba(0,0,0,0.6)', height: Adaption.Width(80), width: Adaption.Width(100), borderRadius: 5, justifyContent: 'center', alignItems: 'center',position: 'absolute', left: SCREEN_WIDTH / 2 - Adaption.Width(50), top: SCREEN_HEIGHT / 2 - Adaption.Width(100) }}>
        <ActivityIndicator color="white"/>
        <Text style={{ marginTop: 10, fontSize: 14, color: 'white' }}>请求中...</Text>
      </View> 
    )
  }

  _onRefresh() {
    this._requestTrendData(this.props.game_id, false);  // 请求
    this.setState({
      isPullRefresh: true,
    })
  }

  render() {

    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>

        {/* 头部,防止和别的类用ScrollView冲突，所以外面加个View */}
        <View style={{ height: Adaption.Width(50), borderColor: '#eae9e7', borderBottomWidth: 1 }}>
          <ScrollView
            automaticallyAdjustContentInsets={false}
            alwaysBounceHorizontal={false}
            horizontal={true} // 水平显示
            showsVerticalScrollIndicator={false} // 显示滚动条
            showsHorizontalScrollIndicator={false}
            key={this.props.game_id}
            ref="HeaderScrollView"
          >
            {this.titleArr.length > 0 ? this._createHeaderBtn(this.titleArr) : null}
          </ScrollView>
        </View>

        {this.state.dataDic['list'] && this.state.dataDic['list'].length > 0 && this.state.selectBtnIdx > 0
          ? <ScrollView style={{ height: SCREEN_HEIGHT - Adaption.Width(100) - (SCREEN_HEIGHT == 812 ? 88 : 64) }}
            automaticallyAdjustContentInsets={false}
            alwaysBounceHorizontal={false}  
            refreshControl={
              <RefreshControl
                refreshing={this.state.isPullRefresh}  // 刷新时显示指示器
                onRefresh={() => this._onRefresh()}  // 开始刷新时调用
              >
              </RefreshControl>
            }
          >
            {/* 走势 */}
            <TrendBallLine
              data={this.state.dataDic}
              key={this.props.game_id}
              isPullRefresh={this.state.isPullRefresh}
              selectBtnIdx={this.state.selectBtnIdx}
            >
            </TrendBallLine>
          </ScrollView>

          : <View style={{ height: SCREEN_HEIGHT - Adaption.Width(100) - (SCREEN_HEIGHT == 812 ? 88 : 64) }}>
                {this.props.openResultView ? this.props.openResultView : null}
            </View>
        }
        
        {this.state.isLoading ? this._loadingView() : null}
        <Toast ref="Toast" position='center'/>
          
      </View>
    );
  }
}