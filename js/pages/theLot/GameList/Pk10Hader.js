
  import React, {Component} from 'react';

  import {
      Text,
      View,
      Dimensions,
      StyleSheet,
   } from 'react-native';
  
   const {width,height} = Dimensions.get('window')
   const screenWidth = width
   const screenHight = height
   
  class Pk10Hader extends Component{
   
    constructor(props){
        super(props);

        this.state = ({
            alljs_tag:props.js_tag ? props.js_tag : '',
        });

        this.baseFontSize =Adaption.Font(15, 13);

    }
  

    componentWillReceiveProps(nextProps) {

        //重新赋值tag 和 jstag 同步刷新界面
        if (nextProps.js_tag != null ){
      
            this.setState({
                alljs_tag:nextProps.js_tag,
            })
        }
      }


  //每一个组件中必须有一个render方法，用于输出组件
   render () {
    //使用return 来返回要输出的内容
    return(
     <View style= {{flexDirection: 'row',flex:1,}}>
     {this._allCaiZhong()}
     </View>  
         )
    }


   _allCaiZhong(){


      let numberArrFlex = [];  titleArrName = [];

    if (this.state.alljs_tag == 'pk10'){

        numberArrFlex = [0.13,0.49,0.18,0.1,0.1];
        titleArrName  = ['期号','开奖号码','冠亚军和','大小','单双'];

    }
    else if (this.state.alljs_tag == 'pcdd'){

        numberArrFlex = [0.15,0.55,0.25,0.15];
        titleArrName  = ['期号','开奖号码','大小单双','色波'];

    } else if (this.state.alljs_tag == 'k3') {

        numberArrFlex = [0.15,0.40,0.1,0.1,0.1,0.25];
        titleArrName  = ['期号','开奖号码','和值','大小','单双','状态'];
    } else if (this.state.alljs_tag == '3d'){
     
        numberArrFlex = [0.15,0.40,0.11,0.11,0.11,0.11,0.11];
        titleArrName  = ['期号','开奖号码','和值','跨度','百位','十位','个位'];

    }else if (this.state.alljs_tag == '11x5'){

        numberArrFlex = [0.18,0.43,0.12,0.25,0.25,];
        titleArrName  = ['期号','开奖号码','跨度','重号个数','总和值'];
    }

        var arrayTitle =[];
        for (let i = 0; i< numberArrFlex.length; i++){

           arrayTitle.push(
            <View  key={i} style={{height:40 ,flex:numberArrFlex[i],alignItems: 'center', justifyContent:'center',borderBottomColor:'#ccc',borderLeftColor:'#ccc',borderTopWidth:1,borderTopColor:'#ccc',borderLeftWidth:1,borderBottomWidth:0.5,}}>
             <CusBaseText style={{fontSize:this.baseFontSize}}>{titleArrName[i]}</CusBaseText>  
            </View>
           )
        }
        return  arrayTitle;
   }


}

/*
* 下面这是最重要的一行
*/
module.exports = Pk10Hader;