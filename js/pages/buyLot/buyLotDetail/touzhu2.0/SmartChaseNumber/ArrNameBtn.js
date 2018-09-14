
import React, { Component } from 'react';
import {
    View,
    Text,
    Modal,
    FlatList,
    TouchableOpacity,
    Image, Dimensions,
} from 'react-native';

var dataList=[];
const {width, height} = Dimensions.get('window');

export default class ArrNameBtn extends Component {

  constructor(props) {
      super(props);

      this.state = ({
          isClose: props.isClose,
      });
      
     dataList = [];
     this.props.gameList.map((item,i)=>{
        dataList.push({key:i,value:item});
    })
      
  }

  componentWillReceiveProps(nextProps) {

    this.setState({
      isClose: nextProps.isClose,
    })


    dataList=[];
    nextProps.gameList.map((item,i)=>{
        dataList.push({key:i,value:item});
    })
  }

  _renderItemView(item) {
    return(

      <TouchableOpacity activeOpacity={0.5} style = {{
        justifyContent:'center', 
        alignItems:'center',
        width: SCREEN_WIDTH ,
        height: Adaption.Height(30),
        marginLeft:12,
        marginTop:Adaption.Height(10),
        borderRadius:5,
       
      }}
        onPress = {() => {
          this.props.caiZhongClick ? this.props.caiZhongClick(item.item.value,item.index) : null
        }}>
      <View style={{flexDirection:'row',flex:1}}>

      <View style={{flex:0.70,}}>
      <CusBaseText numberOfLines={1} style={{marginLeft:20,}}> 
      {`${item.item.value.value.wanfa}`} {this._xiangqingBallsTextView(item.item.value.value.xiangqing)}
      </CusBaseText>
      </View>

       <View style={{flex:0.3,}}>
       <Image style={{marginLeft:20,width: 20, height: 20}}
       source={item.index == this.props.selectedGameID 
        ? require("../img/faSelect.png") : require("../img/faDefault.png")}/>
       </View>
        </View>

        <View style={{marginTop:5,width:SCREEN_WIDTH-10,height:2,}}>
        <Image   
        resizeMode={'stretch'}  
        style={{width:SCREEN_WIDTH-75, height: 1}}
        source={require('../img/xiaoLine.png')}/>
        </View>

      </TouchableOpacity>
    )
  }

  render() {
    let iphoneX = global.iOS ? (SCREEN_HEIGHT == 812 ? true : false) : 0; //是否是iphoneX
    return (
      <Modal
        visible={this.state.isClose}
        animationType={'none'}
        transparent={true}
        onRequestClose={() => { }}
        >
          <TouchableOpacity activeOpacity={1}
            onPress = {() => {
              this.props.close ? this.props.close() : null
            }}>   

            <TouchableOpacity activeOpacity={1} style = {{backgroundColor:'#fff',
            width:SCREEN_WIDTH-40,
            height:Adaption.Height(90),
            paddingBottom:15,
            borderColor: '#9d9d9d',
            borderWidth: 1,
            marginLeft:20,
            marginTop:this.props.isAllenWrite?(height == 812?220:195):this.props.isMidAllenWrite?(height == 812?255:231):335,

            borderRadius:5,
            }}>
              <FlatList
                automaticallyAdjustContentInsets={false}
                alwaysBounceHorizontal = {false}
                data = {dataList}
                renderItem = {(item)=>this._renderItemView(item)}
                horizontal = {false}
                >
              </FlatList>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
    )
  }



   // 详情显示 加上颜色
   _xiangqingBallsTextView(ballsText) {

    if (ballsText == null || ballsText == '') {
        return [];
    }

    if (!ballsText.includes('(')) {
        return <CusBaseText style={{color: '#e33939'}}>{ballsText}</CusBaseText>
    }

    let ballsArr = ballsText.split(/[\(\)]/);
    var textViews = [];
    for (let a = 0; a < ballsArr.length; a++) {

        var string = '';
        if (a % 2 == 0) {
            if (a == 0) {
                string = `${ballsArr[a]}(`;
            } else if (a == ballsArr.length - 1) {
                string = `${ballsArr[a]})`;
            } else {
                string = `)${ballsArr[a]}(`;
            }
        } else {
            string = ballsArr[a];
        }

        textViews.push(
            <CusBaseText key={a} style={{color: a % 2 == 0 ? 'black' : '#e33939'}}>
                {string}
            </CusBaseText>
        );
    }
    return textViews;
}

}
