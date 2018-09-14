
import React, {Component} from 'react';

import {
    Text,
    View,
    Dimensions,
    FlatList,
    Alert,
    Image,
 } from 'react-native';


 import RefreshListView, { RefreshState } from 'react-native-refresh-list-view'
 import BaseNetwork from '../../../skframework/component/BaseNetwork';
 import TheStyles from '../TheLotStyles';

 let Pk10Hader = require('./Pk10Hader');

 const {width,height} = Dimensions.get('window');
 const screenWidth = width;
 const screenHight = height;

 let   othercolor = 'rgba(85,85,85,1)';

 class EncapPropsGameId extends Component{
  

  constructor(props){
    super(props);

    this.state = ({
      tag:props.tag ? props.tag : '',
      js_tag:props.jstag ? props.jstag : '',
      dataSource: props.openListData ? props.openListData : [],
      isNodata:false,  
      isLoading:false,
      refreshState: RefreshState.Idle,
      pageid: "0",//页码 
  });

  this.moreTime = 0;//页码
  this.requestDataNum = 30;  // 请求数据条数
  this.numMark = 0; 
  this.baseFontSize =Adaption.Font(15, 13);
  this.qishuFontSize=Adaption.Font(15, 12);
  

  { this.keyExtractor = this.keyExtractor.bind(this) };
  { this.renderCell = this.renderCell.bind(this) };

  }

componentWillReceiveProps(nextProps) {

  //重新赋值tag 和 jstag 同步刷新界面
  if (nextProps.jstag != null && nextProps.openListData.length != 0 && nextProps.tag != null){
      // this.setState({
         this.state.js_tag=nextProps.jstag;
         this.state.tag=nextProps.tag;
         this.state.dataSource=nextProps.openListData;
      // })
  }
}

    
  componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return; //因为在组件挂载（mounted）之后进行了异步操作 此时异步操作中callback还在执行，因此setState没有得到值
    };
  }


  //获取开奖大厅的数据（每个彩种的信息）
_fetchPreferentialData(isReload) {
   
    let requesMask = this.numMark;
  
    let params = new FormData();
    params.append("ac", "getKjCpLog");
    params.append("tag", this.state.tag);
    params.append('pcount', this.requestDataNum);
    params.append("pageid", String(this.moreTime)); 
    var promise = BaseNetwork.sendNetworkRequest(params);
    promise
      .then(response => {
            
        if(requesMask!=this.numMark){
          return;
        }
  
        if (response.msg == 0) {
          let datalistArray = response.data;
          if (datalistArray && datalistArray.length > 0) {
  
            let dataBlog = [];
            let i = 0;
            datalistArray.map(dict => {
              dataBlog.push({ key: i, value: dict });
              i++;
            });
  
            let dataList = isReload ? dataBlog : [...this.state.dataSource, ...dataBlog]
            for (let i = 0; i < dataList.length; i++) {
              dataList[i].id = i
            }
  
            if((dataList.length/(this.moreTime+1))<this.requestDataNum){
                                   
              this.setState({
                dataSource:dataList,
                refreshState:RefreshState.Idle,
                 })

               }else{
                 this.setState({
                  dataSource:dataList,
                  refreshState:RefreshState.Idle,
                 });
               }  

          }else{

              if(this.state.dataSource.length>0){
                  this.setState({
                    refreshState:RefreshState.NoMoreData,
                  });

                }else{
                  this.setState({
                    isLoading:false,
                    isNoData:true,
                    refreshState:RefreshState.Idle,
                  });
                }
          }
  
        } else {
  
          Alert.alert(response.param)
        }
      })
      .catch(err => {

        if (err && typeof(err) === 'string' && err.length > 0) {
          this.refs.LoadingView && this.refs.LoadingView.showFaile(err);}
      });
  }


    //头部视图的显示
     _header = () => {

        return (<Pk10Hader  js_tag={this.state.js_tag}/>);
    }

     keyExtractor = (item, index) => {
        return String(index);
    }

    //每一个组件中必须有一个render方法，用于输出组件
   render () {
      //使用return 来返回要输出的内容
      return(
       <View style={{backgroundColor:'#fff'}} >
          <RefreshListView
            ListEmptyComponent={this.listEmptyComponent(this)} // 没有数据时显示的界面
            automaticallyAdjustContentInsets={false}
            alwaysBounceHorizontal={false}
            showsVerticalScrollIndicator={false} //不显示右边滚动条
            data={this.state.dataSource}
            ListHeaderComponent={this._header}
            renderItem={this.renderCell}
            keyExtractor={this.keyExtractor}
            refreshState={this.state.refreshState}
            onHeaderRefresh={this.onHeaderRefresh}
            onFooterRefresh={this.onFooterRefresh}/>   
            </View>
         )
      }  
      
    
    //  item 的程序 路口
     renderCell = (item) => {
             //背景颜色
            var bgColor = item.index % 2 == 0 ? '#f3f3f3' : '#fff';

            return(
              <View style={{backgroundColor:bgColor,flexDirection: 'row',height:40,width:width,}}>
              {this._allUI(item.item.value,item.index)}
              </View>
          )
        }


     //试图的显示  
     _allUI(value,row){

                let jiequQishu = `${value.qishu}`;
                let imageBall = value.balls == undefined ? "" : value.balls;
                
                let kaiBall = value.balls.split("+")

                let  haoBall ='';
                if (this.state.js_tag == 'k3'|| this.state.js_tag == '3d'){
                  haoBall = kaiBall.join('    ')
                }  else{
                  haoBall = kaiBall.join(' ')
                }
               
                jiequQishu = jiequQishu !='' ?  jiequQishu.substr(jiequQishu.length - 4, 4) : '--';
                
        if (this.state.js_tag == 'pcdd' || this.state.js_tag == 'k3'|| this.state.js_tag == '3d') {
      
                //快三的判断
                let addNum = 0;//和值或特码
                let newBallStr = '';//开奖号码
                let ballArr = [];

                //不为空才计算
                if (imageBall != ''){

                    ballArr = imageBall.split('+');
                    for (var i = 0; i < ballArr.length; i++) {
                        addNum += (Number.parseInt || parseInt)(ballArr[i]);//和值计算
                        if (this.state.js_tag == 'pcdd') {

                            if (i < ballArr.length - 1){
                                newBallStr += ballArr[i] + '+';
                            }

                        }else {

                            newBallStr = imageBall;
                    }
                }

                  if (this.state.js_tag == 'pcdd'){
                      addNum = addNum - (Number.parseInt || parseInt)([ballArr[ballArr.length - 1]], 10);
                    }
          }

            //大小判断
            let addStr = '';

            if  (this.state.js_tag == 'pcdd'){
                addStr = addNum > 13 ? '大' : '小'  //幸运28 14- 27 是大，0-13是小
            } else if (this.state.js_tag == 'k3'){
                addStr = addNum > 10 ? '大' : '小'   //快三和值 11-18大，3-10小
              }

              
            //单双判断 pcdd
            let singleStr = addNum % 2 != 0 ? '单' : '双';
            let isRBG = ''; //判断pcdd颜色定义
            
                if (addNum == '0' ||  addNum == '13' || addNum == '14' || addNum == '27'){
                  isRBG = '无';
                } else{
                  let colorArr1 = ['红', '绿', '蓝'];
                  isRBG = colorArr1[parseInt(addNum) % 3];
                }


              //快三显示状态
              let allState = '';
              if (ballArr[0] == ballArr[1]) {
                  if (ballArr[1] == ballArr[2]) {
                    allState = '豹子';
                  } else {
                    allState = '二同号';
                  }
              } else if (ballArr[1] == ballArr[2] || ballArr[0] == ballArr[2]) {
                allState = '二同号';
              }  else if (parseInt(ballArr[0])+ parseInt(ballArr[1])+ parseInt(ballArr[2]) == parseInt(ballArr[0]) * 3 + 3){
                allState = '顺子';
              } else {
                allState = '三不同';
                  
              }
      
             
                //福彩3D 的跨度
                let mix3D = (Math.max.apply(null, ballArr));//最大值
                let min3D =  (Math.min.apply(null, ballArr));//最小值
                let kudu  =   mix3D - min3D;
                //福彩3D 百位 十位 个位
                let bits = ballArr[0];
                let ten  = ballArr[1];
                let baiwei = ballArr[2];
                //判断 百位 十位 个位 是大小单双
                let bigBits = bits > 4 ? '大' : '小'   //大小   0-4  5-9
                let bitsSingle  = bits % 2 != 0 ? '单' : '双';
                let bigTen = ten > 4 ? '大' : '小'   //大小   0-4  5-9
                let tenSingle  = ten % 2 != 0 ? '单' : '双';
                let bigBaiwei = baiwei > 4 ? '大' : '小'   //大小   0-4  5-9
                let baiweiSingle  = baiwei % 2 != 0 ? '单' : '双'; 

          
          if (this.state.js_tag == 'pcdd' ){
            return (
              <View style = {{flexDirection: 'row',height:40,width:width,flex:1}}>
              <View style={{flex:0.15,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                  <CusBaseText style={{fontSize:this.qishuFontSize,color:othercolor}}>{jiequQishu}期</CusBaseText>  
                  </View>
                  <View style={{flex:0.55,flexDirection:'row',alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                  {/* {this._pcddTextViews(value.balls)} */}
                  {imageBall != '' ? this._pcddTextViews(value.balls) : this._kspksText()}
                  </View> 
                  <View style={{flex:0.25,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                  <CusBaseText style={{fontSize: this.baseFontSize,color:othercolor}}> {imageBall != ''? (addStr+singleStr) : '--'}</CusBaseText> 
                  </View> 
                  <View style={{flex:0.15,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                  <CusBaseText style={{fontSize:this.baseFontSize,color:othercolor}}> {imageBall != '' ? isRBG : '--'}</CusBaseText> 
                  </View> 
                  </View>
                  )
            
          }else if (this.state.js_tag == 'k3'){ 
          return  (
            <View style = {{flexDirection: 'row',height:40,width:width,flex:1}}>
            <View style={{flex:0.15,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5,}}>
                <CusBaseText style={{fontSize: this.qishuFontSize,color:othercolor}}>{jiequQishu}期</CusBaseText>  
                </View>
                <View style={{flex:0.40,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                <CusBaseText style={{color:'red',fontSize: this.baseFontSize}}>{imageBall != '' ? haoBall :' 正在开奖...'}</CusBaseText> 
                </View> 
                <View style={{flex:0.1,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                <CusBaseText style={{fontSize: this.baseFontSize,color:othercolor}}>{ imageBall != ''? addNum : '--'}</CusBaseText> 
                </View> 
                <View style={{flex:0.1,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                <CusBaseText style={{fontSize:this.baseFontSize,color:othercolor}}>{imageBall != ''? addStr : '--'}</CusBaseText> 
                </View> 
                <View style={{flex:0.1,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                <CusBaseText style={{fontSize:this.baseFontSize,color:othercolor}}>{imageBall != ''? singleStr : '--'}</CusBaseText> 
                </View> 
                <View style={{flex:0.25,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                <CusBaseText style={{fontSize: this.baseFontSize,color:othercolor}}>{imageBall != ''? allState  : '--'}</CusBaseText> 
                </View> 
                </View>
                )

          } else if (this.state.js_tag == '3d'){
            return(
              <View style = {{flexDirection: 'row',height:40,width:width,flex:1}}>
              <View style={{flex:0.15,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                  <CusBaseText style={{fontSize:this.qishuFontSize,color:othercolor}}>{jiequQishu}期</CusBaseText>  
                  </View>
                  <View style={{flex:0.40,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                  <CusBaseText style={{color:'red',fontSize: this.baseFontSize }}>{imageBall != '' ? haoBall :' 正在开奖...'}</CusBaseText> 
                  </View> 
                  <View style={{flex:0.11,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                  <CusBaseText style={{fontSize: this.baseFontSize,color:othercolor}}>{imageBall != ''? addNum  : '--'}</CusBaseText> 
                  </View> 
                  <View style={{flex:0.11,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                  <CusBaseText style={{fontSize: this.baseFontSize,color:othercolor}}>{imageBall != ''? kudu   : '--'}</CusBaseText> 
                  </View> 
                  <View style={{flex:0.11,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                  <CusBaseText style={{fontSize:this.baseFontSize,color:othercolor}}>{imageBall != ''? (bigBits+bitsSingle) : '--'}</CusBaseText> 
                  </View> 
                  <View style={{flex:0.11,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                  <CusBaseText style={{fontSize:this.baseFontSize,color:othercolor}}>{imageBall != ''? (bigTen+tenSingle) : '--'}</CusBaseText> 
                  </View> 
                  <View style={{flex:0.11,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                  <CusBaseText style={{fontSize:this.baseFontSize,color:othercolor}}>{imageBall != ''? (bigBaiwei+baiweiSingle) : '--'}</CusBaseText> 
                  </View> 
                  </View>
                )
              } 

      } else if (this.state.js_tag == 'pk10') {

          let guanYaJunStr = '';
          let pk10BallArr = value.balls.split('+');
          let guanYaAddNum = 0; //冠亚军和值

          for (let i = 0; i < pk10BallArr.length; i++){
            if (i <= 1){
                  guanYaAddNum += (Number.parseInt || parseInt)(pk10BallArr[i], 10);
            }else { 
                break;
              }
            }

       
          let dsStr = guanYaAddNum == 11 ? '和' : guanYaAddNum % 2 == 0 ? '双' : '单';
          let dxStr = guanYaAddNum >= 14 ? '大' : guanYaAddNum >= 9 ? '中' : '小';

        return  (
            <View style = {{flexDirection: 'row',height:40,width:width,flex:1}}>
            <View style={{flex:0.13,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                <CusBaseText style={{fontSize: Adaption.Font(14, 11),color:othercolor}}>{jiequQishu}期</CusBaseText>  
                </View>
                <View style={{flex:0.49,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                <CusBaseText style={{color:'red',fontSize: Adaption.Font(13, 10)}}>{imageBall != '' ? haoBall :'正在开奖...'}</CusBaseText> 
                </View> 
                <View style={{flex:0.18,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                <CusBaseText style={{fontSize:this.baseFontSize,color:othercolor}}>{imageBall != '' ? guanYaAddNum :'--'}</CusBaseText> 
                </View> 
                <View style={{flex:0.1,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                <CusBaseText style={{fontSize: this.baseFontSize,color:othercolor}}>{imageBall != '' ? dxStr :'--'}</CusBaseText> 
                </View> 
                <View style={{flex:0.1,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                <CusBaseText style={{fontSize: this.baseFontSize,color:othercolor}}>{imageBall != '' ? dsStr :'--'}</CusBaseText> 
                </View> 
                </View>
                )

        } else if (this.state.js_tag == '11x5') {
                      //不为空才计算
                    let results  = 0;
                    let  ballArr11x5 = [];
                    if (value.balls != '')
                    {
                          ballArr11x5 = value.balls.split('+');
                      for (var i = 0; i < ballArr11x5.length; i++)
                      {
                        results += (Number.parseInt || parseInt)(ballArr11x5[i]);//和值计算
                      } 
                    }
      
                  //11x5 的跨度
                  let mix3D11x5 = (Math.max.apply(null, ballArr11x5));//最大值
                  let min3D11x5 =  (Math.min.apply(null, ballArr11x5));//最小值
                  let kudu11x5  =   mix3D11x5 - min3D11x5;
                  let isSame    = '';

                  //计算重号个数
                  let rownun = row;
                  var lastArrray = [];
                  var currentArray = [];

                  if(row == (this.state.dataSource.length - 1))
                  {
                      //最后一行
                      isSame = 0;
                  }
                  else
                  {
                      currentArray = value.balls.split('+').sort();
                      let date = this.state.dataSource[rownun + 1];
                      lastArrray = date.value.balls.split('+').sort();
                      let  threr = lastArrray[2];
                      if (lastArrray.length == 0 || currentArray.length == 0)
                      {
                          isSame = 0;
                      }
                      else
                      {
                          var pointerA = 0;
                          var pointerB = 0;
                          var sameArray = [];
                          while (pointerA < currentArray.length && pointerB < lastArrray.length)
                          {
                              if (currentArray[pointerA] < lastArrray[pointerB])
                              {
                                  pointerA++;
                              }
                              else if (currentArray[pointerA] > lastArrray[pointerB])
                              {
                                  pointerB++;
                              }
                              else
                              {
                                  sameArray.push(currentArray[pointerA]);
                                  pointerA++;
                                  pointerB++;
                              }
                          }
                          isSame = sameArray.length;
                      }
                  }

                  let single11x5 =  results < 30 ? '小':'大';  
                  let samll11x5 = results % 2 != 0 ? '单' : '双';
                
        return(
              <View style = {{flexDirection: 'row',height:40,width:width,flex:1}}>
              <View style={{flex:0.18,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                  <CusBaseText style={{fontSize: this.qishuFontSize,color:othercolor}}>{jiequQishu}期</CusBaseText>  
                  </View>
                  <View style={{flex:0.43,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                  <CusBaseText style={{color:'red',fontSize: this.baseFontSize}}>{imageBall != '' ? haoBall :'正在开奖...'}</CusBaseText> 
                  </View> 
                  <View style={{flex:0.12,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                  <CusBaseText style={{fontSize: this.baseFontSize,color:othercolor}}>{imageBall != '' ? kudu11x5 :'--'}</CusBaseText> 
                  </View> 
                  <View style={{flex:0.25,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                  <CusBaseText style={{fontSize: this.baseFontSize,color:othercolor}}>{imageBall != '' ? isSame :'--'}</CusBaseText> 
                  </View> 
                  <View style={{flex:0.25,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                  <CusBaseText style={{fontSize: this.baseFontSize,color:othercolor}}>{imageBall != '' ? (single11x5+samll11x5) :'--'}</CusBaseText> 
                  </View> 
                  </View>
              )

              } 
        }



        //PC 蛋蛋的布局
        _pcddTextViews(balls) {
          let string = balls;
          if (string == undefined) {
            return;
          }

          if (string.length > 0) {
            let array = string.split('+');
            var viewArr = [];
            for (var i = 0; i < array.length; i++) {
              var str = '';
              if (i == array.length - 2) {
                str = '=';
              } else if (i < array.length - 2) {
                str = '+';
              } else {
                str = '';
              }
              if (i == array.length - 1) {
                viewArr.push(
                  <View key={i}>
                    {this._pcDDViews(array[i])}
                  </View>
                );
              } else {
                viewArr.push(
                  <View key={i} style={{flexDirection: 'row',}}>
                  <Text style={{color:'red',marginLeft:7,fontSize: this.baseFontSize}}>{array[i]}</Text>
                  <Text allowFontScaling={false}  style={{marginLeft: 10,fontSize: this.baseFontSize}}>{str}</Text> 
                  </View>
                );
              }
            }
            return viewArr;
          }
        }

        //PC蛋蛋
        _pcDDViews(i) {
          switch (i) {
            case "0":
            case "13":
            case "14":
            case "27":
              return (
                <View style={{}}>
                  <CusBaseText style={{marginLeft:7,color: '#707070',fontSize:this.baseFontSize}}>{i}</CusBaseText>
                </View>
              );
              break;
            default:
              let colorArr1 = ['#eb344a', '#32b16c', '#00a0ea'];
              return (
                <View style={{}}>
                  <CusBaseText style={{marginLeft:7,fontSize: this.baseFontSize, color:colorArr1[parseInt(i) % 3] }}>{i}</CusBaseText>
                </View>
              )
          }

        }

    _kspksText() {
          return (
            <View style={{ marginTop: 5 }}>
              <Text allowFontScaling={false} style={{ color: 'red', fontSize: this.baseFontSize,}}> 正在开奖...</Text>
            </View>
          )
        }


    //头部刷新
     onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing, 
        isLoading:true,
        isNodata:false,
        })
        this.moreTime = 0;
        this._fetchPreferentialData(true);
      }

      //尾部刷新
      onFooterRefresh = () => {
        this.setState({ refreshState: RefreshState.FooterRefreshing })
        this.moreTime++;
        this._fetchPreferentialData(false);
      }

        //无数据页面
        listEmptyComponent() {
         if (this.state.isNodata == true){
        return (
            <View style={{ width: width, height: height - height / 4, justifyContent: 'center', alignItems: 'center' }}>
              <Image resizeMode={'stretch'} style={{ width: 60, height: 50 }} source={require('../../home/img/ic_noData.png')} />
              <Text allowFontScaling={false} style={{ textAlign: 'center', marginTop: 5 }}>暂无数据</Text>
            </View>
          );
          }
        }

    }

 /*
 * 下面这是最重要的一行
 */
module.exports = EncapPropsGameId;