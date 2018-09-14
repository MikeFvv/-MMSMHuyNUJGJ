import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Dimensions,

} from 'react-native';

const { width, height } = Dimensions.get('window');
let iphoneX = global.iOS ? (SCREEN_HEIGHT == 812 ? true : false) : 0; //是否是iphoneX
let iphone5S = global.iOS ? (SCREEN_WIDTH == 320 ? true : false) : 0;

// 在这里设置每个布局的属性
const styles = StyleSheet.create({

ZhuanXSStyle:{
  width:186, 
   alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
},

ZhuanDImg:{
  width: 18,
   height: 18,
   marginTop:3
},

YiLvTextStyle:{
  color: '#585859', 
  fontSize: iphone5S ? 16 : 17
},


YiLvBtn1View:{
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 20,
},


YiLvBtn1:{
  height: 16,
  width: 16,
  borderRadius: 8,
  backgroundColor: 'white',
},

YiLvBt1Text:{
  padding: 0,
  width: (iphone5S ? 70 : 70),
  height: 30,
  borderColor: '#9d9d9d',
  borderWidth: 0.7,
  borderRadius: 3,
  textAlign: 'center'
},


YiLvBaiText:{
  fontSize: 18, 
  color: '#585859'
},


YiLvBtn2View:{
  color: '#585859',
  fontSize: iphone5S ? 16 : 17,
  marginLeft: 23
},

YiLvBtn2Text:{
  padding: 0,
  width: (iphone5S ? 104 : 104),
  height: 30,
  borderColor: '#9d9d9d',
  borderWidth: 0.7,
  borderRadius: 3,
  textAlign: 'center'
},


MinYiLvBtn3View:{
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 10,
},

MinYiLvBtn3:{
  height: 16,
  width: 16,
  borderRadius: 8,
  backgroundColor: 'white'
},

MinYiLvBtn2Text:{
  padding: 0,
  width: (iphone5S ? 86 : 86),
  height: 30,
  borderColor: '#9d9d9d',
  borderWidth: 0.7,
  borderRadius: 3,
  textAlign: 'center'
},

MinYiLvBtn22Text:{
  padding: 0,
  width: (iphone5S ? 68 : 68),
  height: 30,
  borderColor: '#9d9d9d',
  borderWidth: 0.7,
  borderRadius: 3,
  textAlign: 'center'
},


ChangViewStyle:{
  flexDirection: 'row',
  height: (iphone5S ? 50 : 50),
  marginTop: 20,
},

ChangBtn1Stley:{
  height:45,marginTop:10,
  marginLeft:25,
  width:width-48, 
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor:COLORS.appColor,
  borderRadius:10

},

ChanBtn1TextStyle:{
  fontSize: Adaption.Font(24, 22), 
  color: 'white'
},



  TimeStyle:{
    height:40,
    justifyContent:'center',
    alignItems:'center', 
    flexDirection:'row',   
    },
    
    linBox:{
        height:45,
        marginTop:15,
        flexDirection: 'row',
    
    },
    
    leftTextStyle:{
        marginLeft: 20,
        fontSize: iphone5S ? 16 : 18, 
        marginTop:12,
        color:'#676767',
    },
    
    rightTextStyle:{
        marginLeft:5,
        fontSize: iphone5S ? 16 : 18,
        marginTop:12,color:'#676767',
    },
    
    maxBorderStyle:{
        height: 35,
        marginLeft:2,
        backgroundColor: 'white',
        marginTop:5, 
        width: 221,
        borderWidth: 1,
        borderColor: '#9d9d9d',
        borderRadius: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    
        centerText:{
            fontSize: iphone5S ? 16 : 18,
            color:'#676767',
        },

        centerText01:{
          fontSize: iphone5S ? 15 : 17,
          color:'#676767',  
      },

      centerText03:{
        fontSize: iphone5S ? 15 : 17,
        color:'#676767',
    },
    
        btnCenterText:
        {
            fontSize: iphone5S ? 26 : 24,
            color:'#676767'
        },
    
        btnStyle:{
            flex: 0.24,
            alignItems: 'center',
            justifyContent: 'center', 
            height: 35,
        },
    
        inputStyle:{
            padding: 0,
            height: 35,
            borderColor: '#9d9d9d',
            borderWidth:1,
            backgroundColor: '#fff',
            borderRadius: 1,
            textAlign: 'center'
        },
    
});


module.exports = styles;
