import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    FlatList,
} from 'react-native';

const { width, height } = Dimensions.get("window");
 class HaderButton extends Component {

    constructor(props) {
        super(props); 
    }

      _renderItemView(item) {
    
        let  aWidth= SCREEN_WIDTH-15

        return(
          <TouchableOpacity activeOpacity={0.5} style = {{
            justifyContent: 'center',
            alignItems: 'center', 
             width: aWidth/3,
             height:45,
             borderRadius:45/2,
          }}
            onPress = {() => { 
              this.props.headerClick ? this.props.headerClick(item.index) : null
            }}>
             <View style={{
                 justifyContent: 'center',
                 alignItems: 'center', 
                 width: aWidth/3,
                 height:45,
                 borderRadius:45/2,
                 backgroundColor: item.index == this.props.selectIdx ? COLORS.appColor:'white',
              }}>
            <CusBaseText style ={{color: item.index == this.props.selectIdx ? 'white':'#7d7d7d',fontSize:15}}>{item.item.title}</CusBaseText>
            </View>
          </TouchableOpacity>
        )
      }

      

    render() {
        return (
            <View style={{}}>
             <FlatList
                canCancelContentTouches ={false}
                automaticallyAdjustContentInsets={false}
                alwaysBounceHorizontal = {false}
                data = {this.props.data}
                renderItem = {(item)=>this._renderItemView(item)}
                horizontal = {false}
                numColumns = {3}
                >
              </FlatList>
            </View>
        );
    }
}

export default HaderButton;




