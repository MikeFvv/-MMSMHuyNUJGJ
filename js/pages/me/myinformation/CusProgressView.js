import React,{Component}from 'react';
import {
    View,
    StyleSheet,
    Text,
}from 'react-native';

export default class CusProgressView extends Component {

	static defaultProps = {
		//当前进度
        progress: 1,
		//进度条颜色
        progressColor: 'rgb(165,24,32)',
        //buffer进度条颜色
        bufferColor: 'rgb(254,232,11)',
	}

    constructor(props) {
      super(props);

      if (this.props.progress > 100) {
        this.state = {
            progress:100,
        };
      }else {
        this.state = {
            progress:Math.round(this.props.progress * 100) / 100,
        };
      }
    
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.progress > 100) {
            this.setState({
                progress:100,
            });
        }else {
            this.setState({
                progress:Math.round(nextProps.progress * 100) / 100,
            }); 
        }
    }

    render() {
        return (
            <View
                style={[{backgroundColor:this.props.progressColor},this.props.style,styles.container]}
                onLayout={this._onProgressLayout}
            >
                <View
                    ref="buffer"
                    style={{
                        flex:this.state.progress/100,
                        backgroundColor:this.props.bufferColor,
                        justifyContent: 'center',
                        borderRadius:8,
                    }}
                >
                    <Text
                        ref="proText"
                        style={styles.proText}
                        textAlignVertical='textAlignVertical'
                        allowFontScaling={false}
                    >
                        {this.state.progress+'%'}
                    </Text>
                  
                </View>
                
            </View>
        );
    }

    _onProgressLayout = (event) => {
        this.progresswidth = event.nativeEvent.layout.width;
        this.refs.buffer.setNativeProps({
            style:{
                width:this.progresswidth*this.state.progress,
            }
        });
        this.refs.proText.setNativeProps({
            style:{
                marginLeft:this.progresswidth/2-25,
            }
        });
    }

    _judgeSize = () => {
        if (!this.props.style) {
            return false;
        }
        if (!this.props.style.flex && !this.props.style.width && !this.props.style.height) {
            return false;
        }
    }

}

const styles = StyleSheet.create({

    container:{
        flexDirection: 'row',
        borderRadius:8,
        overflow:'hidden',
    },

    proText:{
        width:50,
        color:'black',
        backgroundColor:'transparent',
        textAlign: 'center',
    },

});