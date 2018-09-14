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
    ActivityIndicator,
    Image
} from 'react-native';

import moment from 'moment';
import RefreshListView, {RefreshState} from 'react-native-refresh-list-view'
import BaseNetwork from '../../../skframework/component/BaseNetwork';
import TheStyles from '../TheLotStyles';



const {width, height} = Dimensions.get('window')
const screenWidth = width
const screenHight = height



//5s 320 6sp 414
class LhcOrSscListView extends Component {


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
            loadingText :'正在加载数据...',
            isShowLoad:true,
            zhuangtai:false,

        });
        timer = null;
        this.leftCellArray = [];
        this.rightCellArray = [];
        this.niuNiuLeftCellArry = [];
        this.niuNiuRightCellArray = [];
        this.textZangArr = ['庄','闲一','闲二','闲三','闲四','闲五'];
        this.flexZangArry = [45,45,45,45,45,45];
        this.lhcFlexTextArry = [50,50,50,50,50,50,50];
        this.lhcTextTile = ['生肖','单双','色波','五行','特头','尾数','单双'];
        this.nullBall1 = '9';
        this.baseFontSize =Adaption.Font(14, 12);
        this.hederFontSize=Adaption.Font(15, 12);
        this.qishuFontSize=Adaption.Font(14, 12);
        this.moreTime = 0;//页码
        this.requestDataNum = 20;  // 请求数据条数

    }

    componentWillReceiveProps(nextProps) {

        //重新赋值tag 和 jstag 同步刷新界面
        if (nextProps.jstag != null && nextProps.openListData.length != 0 && nextProps.tag != null)
        {
            if(this.state.tag != nextProps.tag) {
                this.setState({isShowLoad:false});
                this.state.js_tag = nextProps.jstag;
                this.state.tag =  nextProps.tag;
                this.state.dataSource = nextProps.openListData;

                this._loadData(nextProps.openListData);
                console.log(nextProps.openListData);
            }
        }
   
    }

    componentDidMount() {
        
        this._loadData(this.state.dataSource);
        this._fetchPreferentialData(true,false);
     }

  
    keyExtractor = (item, index) => {
        return item.id
    }


    _loadData(data) {
        this.leftCellArray = [];
        this.rightCellArray = [];
        this.niuNiuLeftCellArry = [];
        this.niuNiuRightCellArray = [];

       

        for(let i = 0; i < data.length; i++) {
            var bgColor = i % 2 == 0 ? '#f3f3f3' : '#fff';
            this.leftCellArray.push(this._leftCellTemple(i,bgColor,data[i]));
            this.rightCellArray.push(this._rightCellTemple(i,bgColor,data[i]));
            this.niuNiuLeftCellArry.push(this._niuNiuLeftCellTemple(i,bgColor,data[i]));
            this.niuNiuRightCellArray.push(this._niuNiuRightCellTemple(i,bgColor,data[i]));
        }
        this.setState({});
    }

    //每一个组件中必须有一个render方法，用于输出组件
    render() {
        //使用return 来返回要输出的内
        if (this.state.js_tag == 'lhc') {
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
            <View style={{width:225}}>
            <View style = {{flexDirection: 'row',height:40,width:225,flex:1}}>
            <View style={{width:52,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderTopWidth:1,borderTopColor:'#ccc',borderBottomWidth:0.5}}>
            <CusBaseText style={{fontSize:this.hederFontSize}}>期号</CusBaseText>
            </View>
            <View style={{width:123,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderTopWidth:1,borderTopColor:'#ccc',borderBottomWidth:0.5}}>
            <CusBaseText style={{fontSize:this.hederFontSize}}>平码</CusBaseText>
            </View>
            <View style={{width:50,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderTopWidth:1,borderTopColor:'#ccc',borderBottomWidth:0.5,borderRightWidth:0.5,borderRightColor:'#ccc'}}>
            <CusBaseText style={{fontSize:this.hederFontSize}}>特码</CusBaseText>
            </View>
            </View></View>
                      {this.leftCellArray}
            <ScrollView style={{position:'absolute',left:225,top:0}} horizontal={true}>
            <View>
            <View style = {{width:350,backgroundColor:'#fff'}}>
            <View style = {{width:350,flexDirection: 'row',height:40,flex:1}}>
            {this._allArrayView(this.lhcFlexTextArry ,this.lhcTextTile ,this.nullBall1)}
            </View></View>
                        {this.rightCellArray}
            </View>
            <View style={{width:225,}}>
            </View></ScrollView>
               {this.state.needloadBottowIndicator == true  ?(<View style={{marginVertical:15,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator /><Text style={{color:'gray'}}> {this.state.loadingText}</Text> </View>):null}
            </ScrollView>
            </View>
        );

    }   else if (this.state.js_tag = 'pkniuniu'){
  
        return (      
              <ScrollView vertical = {true} style={{flex:1}}
             refreshControl={
             <RefreshControl
               refreshing={this.state.isRefreshing}
               onRefresh={this._onRefresh.bind(this)}
               tintColor="#bbb"
               colors={['#ddd', '#0398ff']}
               progressBackgroundColor='#fff'
           > 
           </RefreshControl>
           }
       onMomentumScrollEnd = {this._contentViewScroll.bind(this)}
       ref={(scrollView) => { _scrollView = scrollView; }}>

          <View style={{width:width/2.0+55}}>
          <View style = {{flexDirection: 'row',height:40,width:width/2.0+55,flex:1}}>
          <View style={{width:55,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderTopWidth:1,borderTopColor:'#ccc',borderBottomWidth:0.5}}>
          <CusBaseText style={{fontSize:this.hederFontSize}}>期号</CusBaseText>
          </View>
          <View style={{flex:1,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderTopWidth:1,borderTopColor:'#ccc',borderBottomWidth:0.5,}}>
          <CusBaseText style={{fontSize:this.hederFontSize}}>开奖号码</CusBaseText>
          </View>
          </View></View>

                    {this.niuNiuLeftCellArry}

          <ScrollView style={{position:'absolute',left:width/2.0+55,top:0}} horizontal={true}>
          <View>
          <View style = {{width:270,backgroundColor:'#fff'}}>
          <View style = {{width:270,flexDirection: 'row',height:40,flex:1}}>
                     {this._allArrayView(this.flexZangArry ,this.textZangArr ,this.nullBall1)}
          </View></View>
                     {this.niuNiuRightCellArray}
          </View>

          <View style={{width:width/2.0+55}}></View>
          </ScrollView>
           {this.state.needloadBottowIndicator == true ? (<View style={{marginVertical:15,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
         <ActivityIndicator /><Text style={{color:'gray'}}>  {this.state.loadingText}</Text>
         </View>):null}
         </ScrollView>
    
      );}
    }
    
    

_niuNiuLeftCellTemple(key,bg,data){
        
      let jiequQishu = `${data.value.qishu}`;
      jiequQishu =  jiequQishu  != '' ? jiequQishu.substr(jiequQishu.length - 4, 4) :'--';
      let imageBall = data.value.balls == undefined ? "" :data.value.balls;
      let kaiBall = imageBall.split("+")
      let haoBall = kaiBall.join(' ')

    return (
        <View key={key+"left"} style={{width:width/2.0+55,backgroundColor:bg}}>
            <View style = {{flexDirection: 'row',height:40,width:width/2.0+55,flex:1}}>
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


_niuNiuRightCellTemple(key,bg,data){

    let imageBall = data.value.balls == undefined ? "" :data.value.balls;
    let kaiBall = imageBall.split("+")
    let ballsDescArr = [];  //庄家-闲五的号码pk数组

    for (let i = 0; i < 6; i++){
        let ballsNewArr = [kaiBall[i],kaiBall[i+1],kaiBall[i+2],kaiBall[i+3],kaiBall[i+4]];
        let ballsDesc = this._getNiuniu(ballsNewArr);
        ballsDescArr.push(ballsDesc);
    }

    let  titleArray  = [ballsDescArr[0],ballsDescArr[1],ballsDescArr[2],ballsDescArr[3],ballsDescArr[4],ballsDescArr[5]]; 
    return (
     <View key={key+"left"} style = {{width:270,backgroundColor:bg}}>
        <View style = {{width:270,flexDirection: 'row',height:40,flex:1}}>
        {this._allArrayView(this.flexZangArry,titleArray,imageBall)}
        </View></View>
        );
    }


    _allArrayView(flexArray,titleArray,imageBall){

        var arrayTitle =[];
        for (let i = 0; i< flexArray.length; i++){
           arrayTitle.push(
        //     <View style={{height:40, flex:flexArray[i],alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:0.5,borderBottomWidth:0.5,borderTopWidth:0.5,borderTopColor:'#ccc',}}>
        //     <CusBaseText style={{color:'rgba(85,85,85,1)',fontSize:this.baseFontSize}}>{imageBall != '' ? titleArray[i] : '--'}</CusBaseText>
        //   </View> 
        <View key={i} style={{flex:flexArray[i],alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderTopWidth:1,borderTopColor:'#ccc',borderBottomWidth:0.5,}}>
            <CusBaseText style={{fontSize:this.baseFontSize,color:'rgba(85,85,85,1)'}}>{imageBall != '' ? titleArray[i] : '--'}</CusBaseText>
            </View>
           )
        }
        return  arrayTitle;

   }


   _getNiuniu(array) {

    for (let a = 0; a < array.length; a++) {
        for (let b = a + 1; b < array.length; b++) {
            for (let c = b + 1; c < array.length; c++) {

                let isNiu = (parseInt(array[a]) + parseInt(array[b]) + parseInt(array[c])) % 10;
                if (isNiu == 0) {
                    let sum = (parseInt(array[0]) + parseInt(array[1]) + parseInt(array[2]) + parseInt(array[3]) + parseInt(array[4])) % 10;
                    
                    let result = `牛${sum}`;
                    result = result.replace(/0/g, '牛');
                    result = result.replace(/1/g, '一');
                    result = result.replace(/2/g, '二');
                    result = result.replace(/3/g, '三');
                    result = result.replace(/4/g, '四');
                    result = result.replace(/5/g, '五');
                    result = result.replace(/6/g, '六');
                    result = result.replace(/7/g, '七');
                    result = result.replace(/8/g, '八');
                    result = result.replace(/9/g, '九');
                    return result; // 跳出循环
                }
            }
        }
    }
    return '无牛'; // 上面循环都走完了，都没有进入if的话 就只能走这无牛啦
}



    _leftCellTemple(key,bg,data){

        let teMa = '';
        let jiequQishu = `${data.value.qishu}`;
        jiequQishu =  jiequQishu != '' ? jiequQishu.substr(jiequQishu.length - 4, 4) : '--';
        teMa = data.value.balls .substring(data.value.balls.length-2);
        let colors = lhcViewColor();
        var colorStr = '#e6374e';
        for (let b in colors) {
        let ballAr = colors[b].balls;

            if (ballAr.includes(teMa)) {
                colorStr = colors[b].color;
                break;
                }
            }

        return (
         <View key={key+"left"} style={{width:225,backgroundColor:bg}}>
                <View style = {{flexDirection: 'row',height:40,width:220,flex:1}}>
                    <View style={{width:52,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5}}>
                        <CusBaseText style={{color:'rgba(85,85,85,1)',fontSize:this.qishuFontSize}}>{jiequQishu}期</CusBaseText>
                    </View>
                    <View style={{width:123,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5,flexDirection: 'row'}}>                    
                        {data.value.balls != '' ? this._viewslhc(data.value.balls) : this._kspksText()}
                    </View>
                    <View style={{width:50,alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5,borderRightWidth:0.5,borderRightColor:'#ccc'}}>
                        <CusBaseText style={{color:colorStr,fontSize:this.baseFontSize}}>{teMa!= ''? teMa :"--"}</CusBaseText>
                    </View>
                </View></View>  
            );
         }

     _kspksText() {
            return (
            <View style={{ marginTop: 5 }}>
                <Text allowFontScaling={false} style={{ color: 'red', fontSize:this.baseFontSize}}> 正在开奖...</Text>
            </View>
            )
        }

        //六合彩
     _viewslhc(balls) {
            let string = balls;
            if (string == undefined) {
            return;
            }
            if (string == undefined) { return; }
            if (string.length > 0) {
            let array = string.split('+');
            let popped = array.pop();
            var viewArr = [];
            for (var i = 0; i < array.length; i++) {
                viewArr.push(
                <View key={i} style={{flexDirection: 'row'}}>
                    {this._lhcViewBalls(array[i])}
                </View>
                );
            }
            return viewArr;
            }
        }

     _lhcViewBalls(i) {
        var selectColor = '#e6374e';
        let default_color = lhcViewColor();
        for (var b in default_color) {
        let ballAr = default_color[b].balls;
        if (ballAr.includes(i)) {
            selectColor = default_color[b].color;
            break;
        }
     }

        return (
            <View key={i} style={{flexDirection: 'row'}}>
            <Text allowFontScaling={false} style={{color:selectColor,fontSize:this.baseFontSize,marginLeft:3}}>{i}</Text>
            </View>
           )
        }

    _rightCellTemple(key,bg,data){

            let allBallsArr =data.value.balls.split('+');
            let teMa = allBallsArr[allBallsArr.length - 1]; // 特码
            let teMaSum = parseInt(teMa.substr(0, 1)) + parseInt(teMa.substr(1, 1)); // 特码值相加
            let lhcZong = `合${teMaSum % 2 == 0 ? '双' : '单'}`;
            let lhcdanshuan = parseInt(teMa) % 2 == 0 ? '双' : '单';
            let shengxiao = shengxiaoIdxBalls(); // 传入一个号码 判断是哪个生肖 鼠、牛、虎、兔.....
            var sxName = '';

            for (let a in shengxiao) {
                let ballAr = shengxiao[a].balls;

                if (ballAr.includes(teMa)) {
                    sxName = shengxiao[a].name;
                    break;
                }
            }

            // 传入一个号码 判断是属于红波，绿波，蓝波
                let colors = lhcViewColor();
                var colorStr = '';

                for (let b in colors) {
                let ballArlhc = colors[b].balls;

                if (ballArlhc.includes(teMa)) {
                    colorStr = colors[b].colorName;
                    break;
                    }
                }

                 // 传入一个号码 判断是属于金、木、水、火、土
                 let wuAll = lhcViewWuXing();
                 var wuName = '';
                 for (let c in wuAll) {
                 let ballArwu = wuAll[c].jinBalls;
 
                 if (ballArwu.includes(teMa)) {
                    wuName = wuAll[c].wuxing;
                     break;
                     }
                 }

                // 传入一个号码 判断是属于几尾
                let weiAll = lhcViewWei();
                var weiName = '';
                for (let d in weiAll) {
                let ballArWei = weiAll[d].haoBalls;

                if (ballArWei.includes(teMa)) {
                   weiName = weiAll[d].weihao;
                    break;
                    }
                }
                
                 // 传入一个号码 判断是属于几头
                 let touAll = lhcViewTouHao();
                 var touName = '';
                 for (let e in touAll) {
                 let ballArTou = touAll[e].touBalls;
 
                 if (ballArTou.includes(teMa)) {
                    touName = touAll[e].touhao;
                     break;
                     }
                 }
              
         let titleArray = [sxName,lhcdanshuan,colorStr,wuName,touName,weiName,lhcZong];
            return (
                <View key={key+"left"} style = {{width:350,backgroundColor:bg}}>
                <View style = {{width:350,flexDirection: 'row',height:40,flex:1}}>
                    {this._allArrayView(this.lhcFlexTextArry ,titleArray ,allBallsArr)}
                </View></View>); 
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
        let  that  = this;
        that.setState({isRefreshing:true});
        setTimeout(() => {
            that.moreTime = 0;
            that._fetchPreferentialData(true,false);
        }, 200);
    }

    
    _kspksText() {
        return (
            <View style={{marginTop: 5}}>
                    <Text allowFontScaling={false} style={{color: 'gray'}}>
                        正在开奖.....
                    </Text>
                </View>
            )
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
                        console.log(datalistArray);

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
                        this.state.isLoadingData = true;
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


// 生肖下标 的号码
function shengxiaoIdxBalls() {

    var default_shengxiao = {
      ba_0: { name: '鼠', idx: 0, balls: [] },
      ba_1: { name: '牛', idx: 1, balls: [] },
      ba_2: { name: '虎', idx: 2, balls: [] },
      ba_3: { name: '兔', idx: 3, balls: [] },
      ba_4: { name: '龙', idx: 4, balls: [] },
      ba_5: { name: '蛇', idx: 5, balls: [] },
      ba_6: { name: '马', idx: 6, balls: [] },
      ba_7: { name: '羊', idx: 7, balls: [] },
      ba_8: { name: '猴', idx: 8, balls: [] },
      ba_9: { name: '鸡', idx: 9, balls: [] },
      ba_10: { name: '狗', idx: 10, balls: [] },
      ba_11: { name: '猪', idx: 11, balls: [] },
    };
  
    let currenYear = moment().format('YYYY'); // 获取到当前时间是哪一年
    let currenYid = (parseInt(currenYear) - 4) % 12; // 0-11 当年生肖的下标
    let shidx = global.yearId != '' ? parseInt(global.yearId) : currenYid;
  
    for (var k in default_shengxiao) {
      var start_balls = shidx - default_shengxiao[k].idx + 1;  // 计算生肖位置开始号码
      if (start_balls < 0) {
        start_balls = 12 + start_balls;
      }
      // 输出生肖对应的号码
      for (var i = start_balls; i < 50; i += 12) {
        if (i === 0) {
          continue;
        }
        var theball = i > 9 ? (i + '') : ('0' + i);
        default_shengxiao[k].balls.push(theball);
      }
    }
    return default_shengxiao;
  }



  function lhcViewColor() {
    
    var default_color = {
      red: { colorName:'红', color: '#e6374e', balls: ['01', '02', '07', '08', '12', '13', '18', '19', '23', '24', '29', '30', '34', '35', '40', '45', '46'] },
      blue: { colorName:'蓝',color: '#1b82e8', balls: ['03', '04', '09', '10', '14', '15', '20', '25', '26', '31', '36', '37', '41', '42', '47', '48'] },
      green: { colorName:'绿',color: '#38b06e', balls: ['05', '06', '11', '16', '17', '21', '22', '27', '28', '32', '33', '38', '39', '43', '44', '49'] }
    }
    return default_color;
   }

  
   function lhcViewWuXing (){
    var default_wuxing ={

        jingall: {wuxing:'金',jinBalls:['03', '04', '17', '18', '25', '26', '33', '34', '47', '48']},
        muall:  {wuxing:'木',jinBalls:['07', '08', '15', '16', '29', '30', '37', '38', '45', '46']},
        shuiall:  {wuxing:'水',jinBalls:['05', '06', '13', '14', '21', '22', '35', '36', '43', '44']},
        huoall:  {wuxing:'火',jinBalls:['01', '02', '09', '10', '23', '24', '31', '32', '39', '40']},
        tuall:  {wuxing:'土',jinBalls:['11', '12', '19', '20', '27', '28', '41', '42', '49']}

    }

    return  default_wuxing;

   }


   function  lhcViewWei(){

    var default_weishu ={
        onewei:    {weihao:'0尾',haoBalls:['10', '20', '30', '40']},
        towwei:    {weihao:'1尾',haoBalls:['01', '11', '21', '31', '41']},
        threewei:  {weihao:'2尾',haoBalls:['02', '12', '22', '32', '42']},
        fovewei:   {weihao:'3尾',haoBalls:['03', '13', '23', '33', '43']},
        fivewei:   {weihao:'4尾',haoBalls:['04', '14', '24', '34', '44']},
        sixwei:    {weihao:'5尾',haoBalls:['05', '15', '25', '35', '45']},
        sevenwei:  {weihao:'6尾',haoBalls:['06', '16', '26', '36', '46']},
        eightwei:  {weihao:'7尾',haoBalls:['07', '17', '27', '37', '47']},
        niewei:    {weihao:'8尾',haoBalls:['08', '18', '28', '38', '48']},
        tenwei:    {weihao:'9尾',haoBalls:['09', '19', '29', '39', '49']}
    }
   
    return default_weishu;

   }


   function  lhcViewTouHao(){

    var default_weishu ={
        onetou:    {touhao:'0头',touBalls:['01', '02', '03', '04','05','06','07','08','09']},
        towtou:    {touhao:'1头',touBalls:['10','11', '12', '13', '14', '15','16','17','18','19']},
        threentou:  {touhao:'2头',touBalls:['20', '21', '22', '23', '24','25','26','27','28','29']},
        fovetou:   {touhao:'3头',touBalls:['30', '31', '32', '33', '34','35','36','37','38','39']},
        fivetou:   {touhao:'4头',touBalls:['40', '41', '42', '43', '44','45','46','47','48','49']},
        
    }
   
    return default_weishu;

   }


/*
* 下面这是最重要的一行
*/
module.exports = LhcOrSscListView;