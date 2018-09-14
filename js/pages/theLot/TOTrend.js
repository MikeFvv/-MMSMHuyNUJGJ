import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    AsyncStorage,
    TouchableOpacity,
    Dimensions,
    Image,
    ActivityIndicator,
} from 'react-native';

let NewSSCListView = require('./GameList/NewSSCListView');
let Greeting = require('./GameList/EncapPropsGameId');
let LhcOrSsc = require('./GameList/LhcOrSscListView');
let noDataListImage = require('../home/img/ic_noData.png'); //没有数据显示的图片

const { width, height } = Dimensions.get("window");

export default class TOTrend extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isHaveLoding: false,
          dataOPenList:[],
          isLoading:false,
        };
        this.isDataArr = 0;
      }

      componentDidMount() {
        this._nameData(this.props.tag);
      }

      componentWillUnmount = () => {
        this.setState = (state,callback)=>{
          return; //因为在组件挂载（mounted）之后进行了异步操作 此时异步操作中callback还在执行，因此setState没有得到值
        };
    }
  
      componentWillReceiveProps(nextProps) {
        // 相同就不再处理了
        if (this.props.tag  != nextProps.tag) {
          this.state.dataOPenList = []
          this._nameData(nextProps.tag);
        }  
    }


      _nameData(tag) { //缓存的数据
       
        let dataArr = global.OpenAllData_tag[`tag${tag}`] == undefined ? [] : global.OpenAllData_tag[`tag${tag}`];
        // 判断一个是否为空 因为上面从global拿不到值时会变成null的。
        if (dataArr != null && dataArr.length > 0) {
          this._openListData(dataArr);
          this._fetchPreferentialData(tag ,false);
        }else{
          if (this.props.hideLoad == true) {
            // 走势主界面 或 投注进入时，hideLoad == true 不显示加载框。
            this._fetchPreferentialData(tag ,false);
          } else {
            this._fetchPreferentialData(tag ,true);
          }
        }
       
      }


   //获取开奖大厅的数据（每个彩种的信息）
   _fetchPreferentialData(tag,isShowLoad) {
   
    this.setState({
      isLoading: isShowLoad ? true : false,
    })

    //请求参数
    let requesMake = this.isDataArr;
    let params = new FormData();
    params.append("ac", "getKjCpLog");
    params.append("tag", tag);
    params.append('pcount', '30');
    params.append("pageid", '0');
    var promise = GlobalBaseNetwork.sendNetworkRequest(params);
    promise
      .then(response => {

        if (requesMake != this.isDataArr) {
          return;
        }
        if (response.msg == 0) {

           global.OpenAllData_tag[`tag${tag}`] = response.data; // 当前玩法数据
          // // // 缓存数据
           let datas = JSON.stringify(global.OpenAllData_tag);
           AsyncStorage.setItem('OpenAllData_tag', datas, (error) => {
             // console.log(error);
            });

          this._openListData(response.data);

        } else {
          this.setState({ 
            isHaveLoding:true,
            isLoading: false,
          })
        }
      })

      .catch(err => {
       
        if (err.message = "Network request failed") {
          this.refs.LoadingView && this.refs.LoadingView.showFaile(err);
          this.setState({ 
            isHaveLoding:true,
            isLoading: false,
          })
        }

      });
  }


     _openListData(datalistArray){
      if (datalistArray && datalistArray.length > 0) {

        let dataBlog = [];
        let i = 0;
        datalistArray.map(dict => {
          dataBlog.push({ key: i, value: dict });
          i++;
        });

        this.setState({
          dataOPenList: dataBlog,
          isHaveLoding:false,
          isLoading: false,
        });
      }else{

        this.setState({
          dataOPenList: [],
          isHaveLoding:true,
          isLoading: false,
        });
      }
     }

     _loadingView() {
      return (
        <View style={{ backgroundColor: 'rgba(0,0,0,0.6)', height: Adaption.Width(80), width: Adaption.Width(100), borderRadius: 5, justifyContent: 'center', alignItems: 'center',position: 'absolute', left: SCREEN_WIDTH / 2 - Adaption.Width(50), top: SCREEN_HEIGHT / 2 - Adaption.Width(100) }}>
          <ActivityIndicator color="white"/>
          <Text style={{ marginTop: 10, fontSize: 14, color: 'white' }}>加载中...</Text>
        </View> 
      )
    }


    render() {
        return (
            <View style={styles.container}>
                { this.state.dataOPenList.length > 0 ? this._allOpenList(this.props.pig_tage) : this._listEmptyComponent(this.state.isHaveLoding) }
                {this.state.isLoading ? this._loadingView() : null}
            </View>
        );
    }


    _allOpenList(pig_tage) {  //开奖分类界面判断
        
        if (pig_tage == 'pk10' || pig_tage == 'pcdd' ||
          pig_tage == 'k3' ||pig_tage == '3d' || pig_tage == '11x5') {
          return (
            <Greeting
              openListData={this.state.dataOPenList ? this.state.dataOPenList : []}
              tag={this.props.tag}
              jstag={pig_tage} />)

        } else if (pig_tage == 'lhc') {
          return (
            <LhcOrSsc
              openListData={this.state.dataOPenList ? this.state.dataOPenList : []}
              tag={this.props.tag}
              jstag={pig_tage} />)

        } else {
          return (
            <NewSSCListView
              openListData={this.state.dataOPenList ? this.state.dataOPenList : []}
              tag={this.props.tag}
              jstag={pig_tage}/>)
        }
      }

       //无数据页面
  _listEmptyComponent(isHaveLoding) {
    if ( isHaveLoding == true) {
      return (
        <View style={{ width: width, height: height - height / 4, justifyContent: 'center', alignItems: 'center' }}>
          <Image resizeMode={'stretch'} style={{ width: 60, height: 50 }} source={noDataListImage} />
          <Text allowFontScaling={false} style={{ textAlign: 'center', marginTop: 5 }}>暂无数据</Text>
        </View>);

        } else { return;}
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    button: {
        width: 120,
        height: 45,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4398ff',
    }
});

