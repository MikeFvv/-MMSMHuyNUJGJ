

import React, {Component} from 'react';

import PropTypes from 'prop-types';
import {

    View,
    StyleSheet,
    Dimensions,
    Image,
    Text,
    TouchableOpacity,
    Platform,
    PanResponder,
    Animated

} from 'react-native';
const defalutStringArr   = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 0,
    // 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    // 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]
const {width, height} = Dimensions.get('window');
const defalutFontWeight = ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
const defalutNum = 4;
const defalutMinFont = 23;
const defalutMaxFont = 30;
const defalutMinDeg = -45;
const defalutMaxDeg = 45;
const defalutFont = ['italic','normal'];
const defalutRightMove = 164;
const defalutOffset =3;
const defalutItemImg = {uri:'https://necaptcha.nosdn.127.net/e64b10592be349dda2684e91678c221a@2x.png'}
const defalutBackGroundImg={uri:'https://necaptcha.nosdn.127.net/d9a5865962df4431a0dce6b8c5a8dfa9@2x.jpg'}

export default class Verification extends Component {

    constructor(props) {
        super(props);
        this.state = {
            num:this.props.num||defalutNum,//数量
            minFont:this.props.minFont||defalutMinFont,//最小字体
            maxFont:this.props.MaxFont||defalutMaxFont,//最大字体
            minDeg:this.props.minDeg||defalutMinDeg,//最大旋转角度
            maxDeg:this.props.maxDeg||defalutMaxDeg,//最小旋转角度
            fontWeightArr : this.props.fontWeight||defalutFontWeight,//字体宽度
            stringArr:this.props.stringArr||defalutStringArr,//内容范围
            fontArr:this.props.font||defalutFont,//字体字号

            result:null,
            opacity:0,
            backGroundImg:this.props.backGroundImg||defalutBackGroundImg,
            itemImg:this.props.itemImg||defalutItemImg,
            rightMove:this.props.rightMove||defalutRightMove,//正确位置
            offset:this.props.offset||defalutOffset,//偏差量
        }

        this.move = 0;
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this._onShouldSetPanResponder.bind(this),
            onMoveShouldSetPanResponder: this._onShouldSetPanResponder.bind(this),
            onPanResponderGrant: this._onPanResponderGrant.bind(this),
            onPanResponderMove: this._onPanResponderMove.bind(this),
            onPanResponderRelease: this._onPanResponderRelease.bind(this),
            onPanResponderTerminate: this._onPanResponderRelease.bind(this),
        });



    }

    componentDidMount() {
        this._startVerification()
    }
    _startVerification(){

        let {num,maxFont,minFont,fontWeightArr,minDeg,maxDeg,stringArr,fontArr} =this.state
        let reslutContent=[], reslutColor=[],reslutFont=[],reslutWeight=[], reslutSize=[], reslutDeg=[];
        for (let i = 0; i < num; ++i) {
            /*随机内容*/
            reslutContent.push(stringArr[Math.floor(Math.random() * stringArr.length)]);
            /*随机颜色*/
            //此时用0xffffff而不用0x1000000是为了过滤掉白色
            reslutColor.push(`#${('00000'+(Math.random()*0xffffff<<0).toString(16)).substr(-6)}`);
            /*随机字号*/
            reslutFont.push(fontArr[Math.floor(Math.random() * fontArr.length)]);
            /*随机字体宽度*/
            reslutWeight.push(fontWeightArr[Math.floor(Math.random() * fontWeightArr.length)]);
            /*随机字体大小*/
            reslutSize.push(Math.floor(Math.random() * (maxFont-minFont+1)+minFont));
            /*随机旋转角度*/
            reslutDeg.push( [{rotateZ:`${ Math.floor(Math.random() * (maxDeg-minDeg+1)+minDeg)}deg`}]);
        }
        if(this.props.getValue){
            this.props.getValue(reslutContent.join(''))
        }
        this.setState({
            reslutContent,
            reslutColor,
            reslutFont,
            reslutWeight,
            reslutSize,
            reslutDeg
        });
    }
    _onShouldSetPanResponder(e, gesture){
        if(Math.abs(gesture.dy) < Math.abs(gesture.dx)){
            this.setState({opacity:1})
            return true
        };
        return false

    }
    _onPanResponderMove(e, gesture){
        let {boxWidth,imgWidth} = this.state
        this.move += e.nativeEvent.locationX;
        let maxMove = boxWidth-imgWidth
        if(this.move < 0 ){
            this.move  = 0
        }
        if(this.move >=  maxMove){
            this.move  = maxMove
        }
        this.scrollContainer.setNativeProps({style: {width:this.move}})
        this.scrollImg.setNativeProps({style: {left:this.move}})

    }
    _onPanResponderRelease(e, gesture){
        let {rightMove,offset} = this.state
        this.scrollContainer.setNativeProps({style: {width:0}})
        this.scrollImg.setNativeProps({style: {left:0}})
        this.scrollText.setNativeProps({style: {opacity:1}})
        if((rightMove-offset)<=this.move&& this.move<=(rightMove+offset)){
            this.setState({
                result:true
            })

            this.props.getValue&&this.props.getValue(true)
        }else{
            this.setState({
                result:false
            })
            this.props.getValue&&this.props.getValue(false)
            this.scrollView.setNativeProps({style:{borderColor:'#f54c47'}})

        }
        this.move  = 0//清空上一次的位置
        this.scrollText.setNativeProps({style: {opacity:1}})



    }
    _onPanResponderGrant(){
        this.setState({
            result:null
        })
        this.move  = 0//清空上一次的位置
        this.scrollText.setNativeProps({style: {opacity:0}})
        this.scrollView.setNativeProps({style:{borderColor:'#2693f7'}})
    }

    _turn(code,type){
        if(code === null){
            switch(type){
                // case 'img' : return require('./images/rightArrow.png');break;
                case 'text' : return  '向右滑动滑块填充拼图';break;
                case 'backgroundColor' : return '#2693f7';break;
            }
        }
        if(code === false){

            switch(type){
                // case 'img' : return require('./images/error.png');break;
                case 'text' : return  '校验失败';break;
                case 'backgroundColor' : return '#fff';break;
            }

        }
        if(code === true){
            switch(type){
                // case 'img' : return require('./images/right.png');break;
                case 'text' : return  '校验成功';break;
                case 'backgroundColor' : return '#fff';break;
            }
        }

    }
    _onLayout(e,type){
        let {x, y, width, height} = e.nativeEvent.layout;
        this.setState({
            [type]:width
        })
    }
    _randomView(n){
        let reslutView = [];
        let {  reslutContent,  reslutColor, reslutFont, reslutWeight,  reslutSize, reslutDeg,  num}=  this.state;
        if(reslutContent&&reslutContent.lengthh !=0){

            for (let i = 0; i < n; ++i) {
                reslutView.push( <Text allowFontScaling={false} key={i} style={[defalutStyles.randomText,this.props.randomText,{transform:reslutDeg[i],fontSize:reslutSize[i], fontWeight:reslutWeight[i],color:reslutColor[i],fontStyle:reslutFont[i]}]}>{reslutContent[i]}</Text>)
            }
            return reslutView
        }


    }

    render() {
        let {num,backGroundImg,itemImg,result,opacity} = this.state
        let {type} = this.props
        if(type == 'number')
        {
            return   <TouchableOpacity activeOpacity={0.8} style={[defalutStyles.randomView,{width:28*num, height:Adaption.Width(50)},this.props.container]} onPress={()=>{this._startVerification(num)}}>
                {this._randomView(num)}
            </TouchableOpacity>
        }

        return <View/>

    }


}

const defalutStyles = StyleSheet.create({

    randomView:{//验证码View
        backgroundColor:'#F2F2F2',
        height: (Platform.OS === "ios" ? 50 : 34),
        flexDirection:'row',
        paddingHorizontal:3,
        alignItems:'center',
        justifyContent:'center',
    },
    randomText:{
        fontSize: 28,
        paddingHorizontal:5,
        fontWeight:'bold',
    },
    arrowImgView:{
        width:40,
        height:38,
        justifyContent:'center',
        alignItems:'center'
    },
    arrowImg:{
        height:26,
        width:26
    },
    backgroundImg:{
        width:300,
        resizeMode: 'cover',
        height:150,
        position:'absolute',
        left:-1,
        top:-160,
        zIndex:2,
        opacity:0
    },
    imgContainer:{
        width:300,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        height:40,
        borderWidth:1,
        borderColor:'#2693f7',
        position:'relative'
    },
    marginView:{
        height:38,
        backgroundColor:'#d2e9fd'
    },
    partImg:{
        height:150,
        resizeMode: 'cover',
        position:'absolute',
        left:-1,
        top:-160,
        zIndex:3,
        width:45,
        opacity:0
    },
    imgTextView:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    imgText:{
        color:'#45494c'
    }
});
if(React.PropTypes){
    Verification.propTypes = {
        stringArr:React.PropTypes.array,
        fontWeight:React.PropTypes.array,
        num:React.PropTypes.number,
        minFont:React.PropTypes.number,
        maxFont:React.PropTypes.number,
        minDeg:React.PropTypes.number,
        maxDeg:React.PropTypes.number,
        font:React.PropTypes.array,
        defalutRightMove: React.PropTypes.number,
        defalutOffset:React.PropTypes.number,
        defalutItemImg :React.PropTypes.object,
        defalutBackGroundImg:React.PropTypes.object,
        getValue:React.PropTypes.func.isRequired,
    }

}else{
    Verification.propTypes = {
        stringArr:PropTypes.array,
        fontWeight:PropTypes.array,
        num: PropTypes.number,
        minFont: PropTypes.number,
        maxFont: PropTypes.number,
        minDeg: PropTypes.number,
        maxDeg: PropTypes.number,
        font: PropTypes.array,
        defalutRightMove:  PropTypes.number,
        defalutOffset: PropTypes.number,
        defalutItemImg : PropTypes.object,
        defalutBackGroundImg: PropTypes.object,
        getValue: PropTypes.func.isRequired,
    }
}