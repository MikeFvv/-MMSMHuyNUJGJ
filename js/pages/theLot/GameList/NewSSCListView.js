import React, {Component} from 'react';

import {
    Text,
    View,
    Dimensions,
    FlatList,
    ScrollView,
    RefreshControl,
    Alert,
    ListView,
    Image,
    ActivityIndicator
} from 'react-native';

import moment from 'moment';
import RefreshListView, {RefreshState} from 'react-native-refresh-list-view'
import BaseNetwork from '../../../skframework/component/BaseNetwork';
import TheStyles from '../TheLotStyles';
import AllImg from "../TheLotStyleImg";


const {width, height} = Dimensions.get('window')
const screenWidth = width
const screenHight = height

const KAdaptionWith = width / 414;
const KAdaptionHeight = height / 736;

const blankWidth = 4 * KAdaptionWith; //间距
const circleWidth = 28 * KAdaptionWith; //圆大小


class NewSSCListView extends Component {

    constructor(props) {
        super(props);
        this.state = ({

            tag: props.tag ? props.tag : '',
            js_tag: props.jstag ? props.jstag : '',
            dataSource: props.openListData ? props.openListData : [],
            isRefreshing:false,
            needloadBottowIndicator:false,
            isFirstreachBottow:true,
            isLoadingData:false,
            loadingText :''
        });

        timer = null;
        this.leftCellArray = [];
        this.rightCellArray = [];
        this.xyncLeftCellAray = [];
        this.xyncRightCellArry = [];
        this.baseFontSize =Adaption.Font(15, 13);
        this.hederFontSize=Adaption.Font(15, 12);
        this.qishuFontSize=Adaption.Font(15, 13);
        this.moreTime = 0;//页码
        this.requestDataNum = 30;  // 请求数据条数
        this.flexTextArr = [50,50,50,50,50,50,50];
        this.fcFlexArr = [45,45,45,45,45];
        this.fctTitleArr = ['总和','大小','单双','尾数','龙虎'];
        this.sscTextArr = ['万位','千位','百位','十位','个位','前三','后三'];
        this.isBalls = '9';
    }

    componentWillReceiveProps(nextProps) {

        //重新赋值tag 和 jstag 同步刷新界面
        if (nextProps.jstag != null && nextProps.openListData.length != 0 && nextProps.tag != null)
        {
            if(this.state.tag != nextProps.tag) {
                this.setState({isShowLoad:true});
                this.state.js_tag = nextProps.jstag;
                this.state.tag =  nextProps.tag;
                // this._fetchPreferentialData(true,false);
                this.state.dataSource = nextProps.openListData;
                this._loadData(nextProps.openListData);
            }

            // if(this.state.dataSource.length==0&&nextProps.openListData.length!=0) {
            //     this._loadData(nextProps.openListData);
            //  }
        }
   
    }


    componentDidMount() {
            this._loadData(this.state.dataSource);
        }

  
    keyExtractor = (item, index) => {
            return item.id
        }


    _loadData(data) {
            this.leftCellArray = [];
            this.rightCellArray = [];
            this.xyncLeftCellAray = [];
            this.xyncRightCellArry = [];
            for(let i = 0; i < data.length; i++) {
                var bgColor = i % 2 == 0 ? '#f3f3f3' : '#fff';
                this.leftCellArray.push(this._leftCellTemple(i,bgColor,data[i]));
                this.rightCellArray.push(this._rightCellTemple(i,bgColor,data[i]));
                this.xyncLeftCellAray.push(this._xyncleftCellTemple(i,bgColor,data[i]));
                this.xyncRightCellArry.push(this._xyncRightCellTemple(i,bgColor,data[i]));

            }
            this.setState({});
        }


    //每一个组件中必须有一个render方法，用于输出组件
    render() {
        //使用return 来返回要输出的内容 大字段判断 
        if (this.state.js_tag == 'ssc'){
            return (  
         <View style={{flex:1}}>
            <ScrollView vertical = {true} style={{flex:1}}
                refreshControl={
                <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh.bind(this)}
                tintColor="#bbb"
                colors={['#ddd', '#0398ff']}
                progressBackgroundColor='#fff'>
                </RefreshControl>
                }
                onMomentumScrollEnd = {this._contentViewScroll.bind(this)}
                ref={(scrollView) => { _scrollView = scrollView; }}>
    
       <View style={{width:width/2.0+5}}>
            <View style = {{flexDirection: 'row',height:40,width:width/2.0+5,flex:1}}>
            <View style={{width:55,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderTopWidth:1,borderTopColor:'#ccc',borderBottomWidth:0.5}}>
            <CusBaseText style={{fontSize:this.hederFontSize}}>期号</CusBaseText>
            </View>
            <View style={{flex:1,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderTopWidth:1,borderTopColor:'#ccc',borderBottomWidth:0.5,}}>
            <CusBaseText style={{fontSize:this.hederFontSize}}>开奖号码</CusBaseText>
            </View>
            </View></View>
                        {this.leftCellArray}
            <ScrollView style={{position:'absolute',left:width/2.0+5,top:0}} horizontal={true} >
            <View>
            <View style = {{width:350,backgroundColor:'#fff'}}>
            <View style = {{width:350,flexDirection: 'row',height:40,flex:1}}>
              {this._allArrayView(this.flexTextArr,this.sscTextArr, this.isBalls)}
            </View>
            </View>
              {this.rightCellArray}
            </View>
      
            <View style={{width:width/2.0+5}}></View>

            </ScrollView>
            {this.state.needloadBottowIndicator == true ? (<View style={{marginVertical:15,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator /><Text style={{color:'gray'}}>  {this.state.loadingText}</Text>
            </View>):null} 
            </ScrollView> 
            </View>

        );

        }  else if ( this.state.js_tag ='xync') {
            //titleArrName = ['期号','开奖号码','总和','大小','单双','尾数','龙虎'];
            return ( 
                 <ScrollView vertical = {true} style={{flex:1}}
                refreshControl={
                <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh.bind(this)}
                tintColor="#bbb"
                colors={['#ddd', '#0398ff']}
                progressBackgroundColor='#fff'> 
                </RefreshControl>
                }
                onMomentumScrollEnd = {this._contentViewScroll.bind(this)}
                ref={(scrollView) => { _scrollView = scrollView; }} >
            <View style={{width:width/2.0+85}}>
            <View style = {{flexDirection: 'row',height:40,width:width/2.0+85,flex:1}}>
            <View style={{width:55,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderTopWidth:1,borderTopColor:'#ccc',borderBottomWidth:0.5}}>
            <CusBaseText style={{fontSize:this.hederFontSize}}>期号</CusBaseText>
            </View>
            <View style={{flex:1,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderTopWidth:1,borderTopColor:'#ccc',borderBottomWidth:0.5,}}>
            <CusBaseText style={{fontSize:this.hederFontSize}}>开奖号码</CusBaseText>
            </View>
            </View></View>

        {this.xyncLeftCellAray}

            <ScrollView style={{position:'absolute',left:width/2.0+85,top:0}} horizontal={true} >
            <View>
            <View style = {{width:225,backgroundColor:'#fff'}}>
            <View style = {{width:225,flexDirection: 'row',height:40,flex:1}}>
                 {this._allArrayView(this.fcFlexArr,this.fctTitleArr,this.isBalls)}
            </View></View>
                 {this.xyncRightCellArry}
            </View>
      
            <View style={{width:width/2.0+85}}></View>
            </ScrollView>
            {this.state.needloadBottowIndicator == true ? (<View style={{marginVertical:15,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator /><Text style={{color:'gray'}}>  {this.state.loadingText}</Text>
            </View>):null}</ScrollView>
          );
        } 
    }


    _xyncleftCellTemple(key,bg,data){
   
          let jiequQishu = `${data.value.qishu}`;
          jiequQishu =  jiequQishu  != '' ? jiequQishu.substr(jiequQishu.length - 4, 4) :'--';
          let imageBall = data.value.balls == undefined ? "" :data.value.balls;
          let kaiBall = imageBall.split("+")
          let haoBall = kaiBall.join('   ')
        return (
            <View key={key+"left"} style={{width:width/2.0+85,backgroundColor:bg}}>
                <View style = {{flexDirection: 'row',height:40,width:width/2.0+85,flex:1}}>
                    <View style={{width:55,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                        <CusBaseText style={{color:'rgba(85,85,85,1)',fontSize:this.qishuFontSize}}>{jiequQishu}期</CusBaseText>
                    </View>
                    <View style={{flex:1,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5,flexDirection: 'row'}}>
                       {haoBall!= ''? this._fruitSvegetables(imageBall):this._kspksText()}
                    </View>
                </View>
            </View>
        );
    }


    _kspksText() {
        return (
          <View style={{ marginTop: 5 * KAdaptionHeight }}>
            <CusBaseText allowFontScaling={false} style={{ color: 'gray', fontSize: Adaption.Font(17, 15) }}>
              正在开奖.....
           </CusBaseText>
          </View>
        )
      }

    _xyncRightCellTemple(key,bg,data){

          let allBallsArr = data.value.balls == undefined ? "" : data.value.balls.split('+');
          let xyncAddNum = 0;
          for (var i = 0; i < allBallsArr.length; i++) {
                xyncAddNum += (Number.parseInt || parseInt)(allBallsArr[i]);//和值计算
             }

          let sunSize = xyncAddNum  <=84 ? '小' :'大';
          let sunSingle = xyncAddNum %2 != 0 ? '单' :"双";
          let aGe = `${xyncAddNum}`.slice('');
          let sunGe = aGe[0] <=4 ? '尾小':'尾大'; 
          let aTiger = allBallsArr[0] < allBallsArr[7] ? '虎':'龙';
          let titleArr = [xyncAddNum,sunSize,sunSingle,sunGe,aTiger];
             
    return (
    <View key={key+"left"} style = {{width:225,backgroundColor:bg}}>
        <View style = {{width:225,flexDirection: 'row',height:40,flex:1}}> 
        {this._allArrayView(this.fcFlexArr,titleArr,allBallsArr)}
        </View></View>);
      }

    _fruitSvegetables(balls){

        if (balls == undefined) { return; }
        if (balls.length > 0) {
          let array = balls.split('+');
          var viewArr = [];
          
          for (var i = 0; i < array.length; i++) {
            viewArr.push(
              <View key={i} style={{ flexDirection: 'row',}}>
              <View  style ={TheStyles.Pk10BallView}>
                <Image style={{height:25,width:25}} source={AllImg.lucky_ballArray[parseInt(array[i]) - 1]}></Image>
              </View>
              </View>
            );
          }
          return viewArr;
        }
      }



    _leftCellTemple(key,bg,data){
        
        let jiequQishu = `${data.value.qishu}`;
        jiequQishu =  jiequQishu  != '' ? jiequQishu.substr(jiequQishu.length - 4, 4) :'--';
         
         let imageBall = data.value.balls == undefined ? "" :data.value.balls;
          let kaiBall = imageBall.split("+")
          let haoBall = kaiBall.join('   ')
        return (
            <View key={key+"left"} style={{width:width/2.0+5,backgroundColor:bg}}>
                <View style = {{flexDirection: 'row',height:40,width:width/2.0+5,flex:1}}>
                    <View style={{width:55,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                        <CusBaseText style={{color:'rgba(85,85,85,1)',fontSize:this.qishuFontSize}}>{jiequQishu}期</CusBaseText>
                    </View>
                    <View style={{flex:1,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5,flexDirection: 'row'}}>
                        <CusBaseText style={{color:'red',fontSize:this.baseFontSize}}>{haoBall!= ''? haoBall:"正在开奖..."}</CusBaseText>
                    </View>
                </View>
            </View>
        );
    }


    _rightCellTemple(key,bg,data){

            let allBallsArr = data.value.balls == undefined ? "" : data.value.balls.split('+');
            let wanBall= `${parseInt(allBallsArr[0]) <= 4 ? '小' : '大'}${parseInt(allBallsArr[0]) % 2 == 0 ? '双' : '单'}`;
            let qianBall= `${parseInt(allBallsArr[1]) <= 4 ? '小' : '大'}${parseInt(allBallsArr[1]) % 2 == 0 ? '双' : '单'}`;
            let baiBall= `${parseInt(allBallsArr[2]) <= 4 ? '小' : '大'}${parseInt(allBallsArr[2]) % 2 == 0 ? '双' : '单'}`;
            let shiBall= `${parseInt(allBallsArr[3]) <= 4 ? '小' : '大'}${parseInt(allBallsArr[3]) % 2 == 0 ? '双' : '单'}`;
            let geBall= `${parseInt(allBallsArr[4]) <= 4 ? '小' : '大'}${parseInt(allBallsArr[4]) % 2 == 0 ? '双' : '单'}`;
            let qiansan =this._sscQianSanStatus([parseInt(allBallsArr[0]), parseInt(allBallsArr[1]), parseInt(allBallsArr[2])]);
            let housan = this._sscQianSanStatus([parseInt(allBallsArr[2]), parseInt(allBallsArr[3]), parseInt(allBallsArr[4])]);;
            let titleArr = [wanBall,qianBall,baiBall,shiBall,geBall,qiansan,housan];
           
        return (<View key={key+"left"} style = {{width:350,backgroundColor:bg}}>
            <View style = {{width:350,flexDirection: 'row',height:40,flex:1}}>
            {this._allArrayView(this.flexTextArr,titleArr,allBallsArr)}
            </View></View>);
    }

    _allArrayView(flexArray,titleArray,imageBall){

        var arrayTitle =[];
        for (let i = 0; i< flexArray.length; i++){
           arrayTitle.push(
            <View key={i} style={{flex:flexArray[i],alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderTopWidth:1,borderTopColor:'#ccc',borderBottomWidth:0.5,}}>
            <CusBaseText style={{fontSize:this.baseFontSize,color:'rgba(85,85,85,1)'}}>{imageBall != '' ? titleArray[i] : '--'}</CusBaseText>
            </View>
           )
        }
        return  arrayTitle;
   }
    
      // SSC前三号码状态
      _sscQianSanStatus(allBallsArr) {
        allBallsArr = this._sort(allBallsArr); // 排序

        let status = '--';
        if (allBallsArr[0] == allBallsArr[1]) {
            if (allBallsArr[1] == allBallsArr[2]) {
                status = '豹子';
            } else {
                status = '组三';
            }
        } else if (allBallsArr[1] == allBallsArr[2]) {
            status = '组三';
        } else {
            status = '组六';
            if (this._sumResults(allBallsArr) == allBallsArr[0] * 3 + 3) {
                status = '顺子';
            }
        }
        return status;
    }





  // 数组排序
  _sort(allBallsArr) {
    for (let a = 0; a < allBallsArr.length; a++) {
        for (let b = a + 1; b < allBallsArr.length; b++) {
            if (parseInt(allBallsArr[a]) > parseInt(allBallsArr[b])) {
                let temp = allBallsArr[a];
                allBallsArr[a] = allBallsArr[b];
                allBallsArr[b] = temp;
            }
        }
    }
    return allBallsArr;
}

        // 计算数组里 值的总和
        _sumResults(allBallsArr) {
            let sumBall = 0;
            for (let a = 0; a < allBallsArr.length; a++) {
                let ball = parseInt(allBallsArr[a]);
                sumBall += ball;
            }
            return sumBall;
        }

    _contentViewScroll(e){

            var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
            var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
            var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
            if (offsetY + oriageScrollHeight >= contentSizeHeight) {

                if(this.state.isFirstreachBottow&&!this.state.isLoadingData) {
                    this.setState({
                       loadingText:'加载数据中...',
                       needloadBottowIndicator:true,
                });
                  timer = setTimeout(() => {
                      this.moreTime ++;
                      this._fetchPreferentialData(false,true,contentSizeHeight-oriageScrollHeight-50);



                    }, 200);
                    this.state.isLoadingData = true;
                }

        }
    }

    componentWillUnmount() {
        if(timer) {
            clearTimeout(timer);
        }
    }



    _onRefresh() {
        // console.log("_onRefresh...");
        let  that  = this;
        that.setState({isRefreshing:true});
        setTimeout(() => {
            that.moreTime = 0;
            that._fetchPreferentialData(true,false);

        }, 200);
    }


  
    //获取开奖大厅的数据（每个彩种的信息）
    _fetchPreferentialData(isReload,isxiala,juli) {

        // let requesMask = this.numMark;
        let dataList = [];

        let params = new FormData();
        params.append("ac", "getKjCpLog");
        params.append("tag", this.state.tag);
        params.append('pcount', this.requestDataNum);
        params.append("pageid", String(this.moreTime));
        var promise = BaseNetwork.sendNetworkRequest(params);
        promise
            .then(response => {

                if (response.msg == 0) {
                    let datalistArray = response.data;
                    if (datalistArray && datalistArray.length > 0) {


                        let dataBlog = [];
                        let i = 0;
                        datalistArray.map(dict => {
                            dataBlog.push({ key: i, value: dict });
                            i++;
                        });

                         dataList = isReload ? dataBlog : [...this.state.dataSource, ...dataBlog]
                        for (let i = 0; i < dataList.length; i++) {
                            dataList[i].id = i
                        }

                        this._loadData(dataList);
                        this.state.dataSource = dataList;
                        this.setState({isRefreshing: false, isShowLoad:false});


                    }else{

                        this.setState({isRefreshing: false, isShowLoad:false});

                    }


                } else {
                    this.setState({isRefreshing: false, isShowLoad:false});
                    Alert.alert(response.param)
                }

                if (isxiala) {
                    _scrollView.scrollTo({y: juli});
                   
                    this.state.isFirstreachBottow = true;
                    this.state.isLoadingData = false;
                    if((dataList.length/(this.moreTime+1))<this.requestDataNum){
                 
                        this.setState({loadingText: '数据加载完毕'});
                        return;
                    }else {
                
                        this.setState({loadingText: '上拉加载数据...'});
                    }
                    }else{
                    if((dataList.length/(this.moreTime+1))<this.requestDataNum){

                        this.setState({loadingText: '数据加载完毕'});

                    }else {
                        this.setState({loadingText: "上拉加载数据..."});
                    }
                }



            })
            .catch(err => {
                this.setState({isRefreshing: false, isShowLoad:false});
                if (isxiala) {
                    _scrollView.scrollTo({y: juli});
                   
                    this.state.isFirstreachBottow = true;
                    this.state.isLoadingData = false;
                    this.setState({loadingText: '上拉加载数据...'});
                }else{
                    this.setState({loadingText:"上拉加载数据..."});
                }
                if (err && typeof(err) === 'string' && err.length > 0) {
                    this.refs.LoadingView && this.refs.LoadingView.showFaile(err);
                }
            });
    }

}



//     //获取开奖大厅的数据（每个彩种的信息）
//     _fetchPreferentialData(isReload,isxiala,juli) {
//         // let requesMask = this.numMark;

//         let params = new FormData();
//         params.append("ac", "getKjCpLog");
//         params.append("tag", this.state.tag);
//         params.append('pcount', this.requestDataNum);
//         params.append("pageid", String(this.moreTime));
//         var promise = BaseNetwork.sendNetworkRequest(params);
//         promise
//             .then(response => {

//                 if (response.msg == 0) {
//                     let datalistArray = response.data;
//                     if (datalistArray && datalistArray.length > 0) {


//                         let dataBlog = [];
//                         let i = 0;
//                         datalistArray.map(dict => {
//                             dataBlog.push({ key: i, value: dict });
//                             i++;
//                         });

//                         let dataList = isReload ? dataBlog : [...this.state.dataSource, ...dataBlog]
//                         for (let i = 0; i < dataList.length; i++) {
//                             dataList[i].id = i
//                         }

//                         this._loadData(dataList);
//                         this.state.dataSource = dataList;
//                         this.setState({isRefreshing: false});


//                     }else{

//                         this.setState({isRefreshing: false});

//                     }

//                 } else {
//                     this.setState({isRefreshing: false});
//                     Alert.alert(response.param)
//                 }

//                 if (isxiala) {
//                     _scrollView.scrollTo({y: juli});
                   
//                     this.state.isFirstreachBottow = true;
//                     this.state.isLoadingData = false;
//                     this.setState({loadingText: '下拉加载数据...'});
//                 }

//             })
//             .catch(err => {
//                 this.setState({isRefreshing: false});
//                 if (isxiala) {
//                     _scrollView.scrollTo({y: juli});
                   
//                     this.state.isFirstreachBottow = true;
//                     this.state.isLoadingData = false;
//                     this.setState({loadingText: '下拉加载数据...'});
//                 }
//             });
//     }

// }





/*
* 下面这是最重要的一行
*/
module.exports = NewSSCListView;