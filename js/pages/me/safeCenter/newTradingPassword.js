import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    TouchableOpacity,
    FlatList,
    Image, Animated
} from 'react-native';

export default class newTradingPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Tkpassok: 1,
            oldPsd: '',
            newPsd: '',
            newPsdagain: '',
            waiting: false,//防多次点击
            isShowKeyboardView: true, // 是否显示键盘


            newPasswordInput: false,
            setPassword: '', //设置密码第一


            newPasswordSureInput: false,
            setPasswordSure: '', //设置密码确定

            oldPasswordInput:false,
            setOldPassword:'',//旧密码
            oneRowShow:false,
            twoRowShow:false,
            oneRowShow11:false,
            twoRowShow22:false,
            threeRowShow33:false
        };


    }


    componentDidMount() {

        if (global.UserLoginObject.Tkpass_ok == 0)
        {
            this.setState({
                newPasswordInput:true,
            });
        }
        else
        {
            this.setState({
                oldPasswordInput:true,
            });
        }

    }
    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({navigation}) => ({

        header: (
            <CustomNavBar
                centerText={global.UserLoginObject.Tkpass_ok == '' ? '设置交易密码' : '修改交易密码'}
                leftClick={() => navigation.goBack()}
            />
        ),

    });


    render() {


        const {navigate} = this.props.navigation;

        if (global.UserLoginObject.Tkpass_ok != '') {
            //   说明已经   设置过交易密码
            return (
                <TouchableOpacity style={styles.container}

                                  activeOpacity={1}
                                  onPress={() => {
                                      this.setState({
                                          isShowKeyboardView: false,
                                      })
                                  }}
                >

                    <View style={{
                        borderRadius: 5,
                        borderColor: 'rgba(191,191,191,1)',
                        borderWidth: 1,
                        marginTop: 25,
                        marginLeft: 15,
                        marginRight: 15
                    }}>

                        <TouchableOpacity style={styles.container_inPutTextViewTop}
                                          activeOpacity={0.6}
                                          onPress={() => {
                                              this.setState({
                                                  isShowKeyboardView: true,
                                                  oldPasswordInput:true,
                                                  newPasswordInput: false,
                                                  newPasswordSureInput:false,
                                                  oneRowShow11:true,
                                                  twoRowShow22:false,
                                                  threeRowShow33:false
                                              })
                                          }}
                        >

                            <Text style={{flex: 0.25, marginLeft: 15, fontSize: 16, color: '#434343'}}>旧密码</Text>

                            <View style={{flex: 0.75, flexDirection: 'row', justifyContent: 'space-around'}}>
                                <View style={{
                                    backgroundColor: 'rgba(243,243,243,1)',
                                    width: 45,
                                    height: 32,
                                    borderRadius: 5,
                                    borderColor: 'rgba(168,172,182,1)',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',

                                }}>
                                    <Text style={{
                                        fontSize: 20,
                                        color: '#434343',
                                        marginTop: (this.state.setOldPassword.length > 0 ? 6 : 0)
                                    }}>{this.state.setOldPassword.length > 0 ? '*' : '-'}</Text>
                                    <AllenFadeInView ref='AllenFadeInViewC11' hasContent={this.state.setOldPassword.length==1&&this.state.oneRowShow11?false:true} style={{position:'absolute',left:30,width:2,height:20,top:6,backgroundColor:'#456FEE'}}/>
                                </View>
                                <View style={{
                                    backgroundColor: 'rgba(243,243,243,1)',
                                    width: 45,
                                    height: 32,
                                    borderRadius: 5,
                                    borderColor: 'rgba(168,172,182,1)',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text style={{
                                        fontSize: 20,
                                        color: '#434343',
                                        marginTop: (this.state.setOldPassword.length > 1 ? 6 : 0)
                                    }}>{this.state.setOldPassword.length > 1 ? '*' : '-'}</Text>
                                    <AllenFadeInView ref='AllenFadeInViewC22' hasContent={this.state.setOldPassword.length==2&&this.state.oneRowShow11?false:true} style={{position:'absolute',left:30,width:2,height:20,top:6,backgroundColor:'#456FEE'}}/>
                                </View>
                                <View style={{
                                    backgroundColor: 'rgba(243,243,243,1)',
                                    width: 45,
                                    height: 32,
                                    borderRadius: 5,
                                    borderColor: 'rgba(168,172,182,1)',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',

                                }}>
                                    <Text style={{
                                        fontSize: 20,
                                        color: '#434343',
                                        marginTop: (this.state.setOldPassword.length > 2 ? 6 : 0)
                                    }}>{this.state.setOldPassword.length > 2 ? '*' : '-'}</Text>
                                    <AllenFadeInView ref='AllenFadeInViewC33' hasContent={this.state.setOldPassword.length==3&&this.state.oneRowShow11?false:true} style={{position:'absolute',left:30,width:2,height:20,top:6,backgroundColor:'#456FEE'}}/>
                                </View>
                                <View style={{
                                    backgroundColor: 'rgba(243,243,243,1)',
                                    width: 45,
                                    height: 32,
                                    borderRadius: 5,
                                    borderColor: 'rgba(168,172,182,1)',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text style={{
                                        fontSize: 20,
                                        color: '#434343',
                                        marginTop: (this.state.setOldPassword.length == 4 ? 6 : 0)
                                    }}>{this.state.setOldPassword.length === 4 ? '*' : '-'}</Text>
                                    <AllenFadeInView ref='AllenFadeInViewC44' hasContent={this.state.setOldPassword.length==4&&this.state.oneRowShow11?false:true} style={{position:'absolute',left:30,width:2,height:20,top:6,backgroundColor:'#456FEE'}}/>
                                </View>

                            </View>


                        </TouchableOpacity>


                        <TouchableOpacity style={styles.container_inPutTextViewTop}
                                          activeOpacity={0.6}
                                          onPress={() => {
                                              this.setState({
                                                  isShowKeyboardView: true,
                                                  newPasswordInput: true,
                                                  newPasswordSureInput:false,
                                                  oldPasswordInput:false,
                                                  oneRowShow11:false,
                                                  twoRowShow22:true,
                                                  threeRowShow33:false
                                              })
                                          }}
                        >

                            <Text style={{flex: 0.25, marginLeft: 15, fontSize: 16, color: '#434343'}}>新密码</Text>

                            <View style={{flex: 0.75, flexDirection: 'row', justifyContent: 'space-around'}}>
                                <View style={{
                                    backgroundColor: 'rgba(243,243,243,1)',
                                    width: 45,
                                    height: 32,
                                    borderRadius: 5,
                                    borderColor: 'rgba(168,172,182,1)',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',

                                }}>
                                    <Text style={{
                                        fontSize: 20,
                                        color: '#434343',
                                        marginTop: (this.state.setPassword.length > 0 ? 6 : 0)
                                    }}>{this.state.setPassword.length > 0 ? '*' : '-'}</Text>
                                    <AllenFadeInView ref='AllenFadeInViewC55' hasContent={this.state.setPassword.length==1&&this.state.twoRowShow22?false:true} style={{position:'absolute',left:30,width:2,height:20,top:6,backgroundColor:'#456FEE'}}/>
                                </View>
                                <View style={{
                                    backgroundColor: 'rgba(243,243,243,1)',
                                    width: 45,
                                    height: 32,
                                    borderRadius: 5,
                                    borderColor: 'rgba(168,172,182,1)',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text style={{
                                        fontSize: 20,
                                        color: '#434343',
                                        marginTop: (this.state.setPassword.length > 1 ? 6 : 0)
                                    }}>{this.state.setPassword.length > 1 ? '*' : '-'}</Text>
                                    <AllenFadeInView ref='AllenFadeInViewC66' hasContent={this.state.setPassword.length==2&&this.state.twoRowShow22?false:true} style={{position:'absolute',left:30,width:2,height:20,top:6,backgroundColor:'#456FEE'}}/>
                                </View>
                                <View style={{
                                    backgroundColor: 'rgba(243,243,243,1)',
                                    width: 45,
                                    height: 32,
                                    borderRadius: 5,
                                    borderColor: 'rgba(168,172,182,1)',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',

                                }}>
                                    <Text style={{
                                        fontSize: 20,
                                        color: '#434343',
                                        marginTop: (this.state.setPassword.length > 2 ? 6 : 0)
                                    }}>{this.state.setPassword.length > 2 ? '*' : '-'}</Text>
                                    <AllenFadeInView ref='AllenFadeInViewC77' hasContent={this.state.setPassword.length==3&&this.state.twoRowShow22?false:true} style={{position:'absolute',left:30,width:2,height:20,top:6,backgroundColor:'#456FEE'}}/>
                                </View>
                                <View style={{
                                    backgroundColor: 'rgba(243,243,243,1)',
                                    width: 45,
                                    height: 32,
                                    borderRadius: 5,
                                    borderColor: 'rgba(168,172,182,1)',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text style={{
                                        fontSize: 20,
                                        color: '#434343',
                                        marginTop: (this.state.setPassword.length == 4 ? 6 : 0)
                                    }}>{this.state.setPassword.length === 4 ? '*' : '-'}</Text>
                                    <AllenFadeInView ref='AllenFadeInViewC88' hasContent={this.state.setPassword.length==4&&this.state.twoRowShow22?false:true} style={{position:'absolute',left:30,width:2,height:20,top:6,backgroundColor:'#456FEE'}}/>
                                </View>

                            </View>


                        </TouchableOpacity>


                        <TouchableOpacity style={{

                            height: 60,
                            // marginLeft:15,
                            // marginRight:15,
                            // marginTop:20,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom:1,
                            width: window.width,}}
                                          activeOpacity={0.6}
                                          onPress={() => {
                                              this.setState({
                                                  isShowKeyboardView: true,
                                                  newPasswordSureInput: true,
                                                  newPasswordInput:false,
                                                  oldPasswordInput:false,
                                                  oneRowShow11:false,
                                                  twoRowShow22:false,
                                                  threeRowShow33:true
                                              })
                                          }}
                        >

                            <Text style={{flex: 0.25, marginLeft: 15, fontSize: 16, color: '#434343'}}>确认密码</Text>

                            <View style={{flex: 0.75, flexDirection: 'row', justifyContent: 'space-around'}}>
                                <View style={{
                                    backgroundColor: 'rgba(243,243,243,1)',
                                    width: 45,
                                    height: 32,
                                    borderRadius: 5,
                                    borderColor: 'rgba(168,172,182,1)',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',

                                }}>
                                    <Text style={{
                                        fontSize: 20,
                                        color: '#434343',
                                        marginTop: (this.state.setPasswordSure.length > 0 ? 6 : 0)
                                    }}>{this.state.setPasswordSure.length > 0 ? '*' : '-'}</Text>
                                    <AllenFadeInView ref='AllenFadeInViewC99' hasContent={this.state.setPasswordSure.length==1&&this.state.threeRowShow33?false:true} style={{position:'absolute',left:30,width:2,height:20,top:6,backgroundColor:'#456FEE'}}/>
                                </View>
                                <View style={{
                                    backgroundColor: 'rgba(243,243,243,1)',
                                    width: 45,
                                    height: 32,
                                    borderRadius: 5,
                                    borderColor: 'rgba(168,172,182,1)',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text style={{
                                        fontSize: 20,
                                        color: '#434343',
                                        marginTop: (this.state.setPasswordSure.length > 1 ? 6 : 0)
                                    }}>{this.state.setPasswordSure.length > 1 ? '*' : '-'}</Text>
                                    <AllenFadeInView ref='AllenFadeInViewC1010' hasContent={this.state.setPasswordSure.length==2&&this.state.threeRowShow33?false:true} style={{position:'absolute',left:30,width:2,height:20,top:6,backgroundColor:'#456FEE'}}/>
                                </View>
                                <View style={{
                                    backgroundColor: 'rgba(243,243,243,1)',
                                    width: 45,
                                    height: 32,
                                    borderRadius: 5,
                                    borderColor: 'rgba(168,172,182,1)',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',

                                }}>
                                    <Text style={{
                                        fontSize: 20,
                                        color: '#434343',
                                        marginTop: (this.state.setPasswordSure.length > 2 ? 6 : 0)
                                    }}>{this.state.setPasswordSure.length > 2 ? '*' : '-'}</Text>
                                    <AllenFadeInView ref='AllenFadeInViewC1111' hasContent={this.state.setPasswordSure.length==3&&this.state.threeRowShow33?false:true} style={{position:'absolute',left:30,width:2,height:20,top:6,backgroundColor:'#456FEE'}}/>
                                </View>
                                <View style={{
                                    backgroundColor: 'rgba(243,243,243,1)',
                                    width: 45,
                                    height: 32,
                                    borderRadius: 5,
                                    borderColor: 'rgba(168,172,182,1)',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text style={{
                                        fontSize: 20,
                                        color: '#434343',
                                        marginTop: (this.state.setPasswordSure.length == 4 ? 6 : 0)
                                    }}>{this.state.setPasswordSure.length === 4 ? '*' : '-'}</Text>
                                    <AllenFadeInView ref='AllenFadeInViewC1212' hasContent={this.state.setPasswordSure.length==4&&this.state.threeRowShow33?false:true} style={{position:'absolute',left:30,width:2,height:20,top:6,backgroundColor:'#456FEE'}}/>
                                </View>

                            </View>


                        </TouchableOpacity>

                    </View>


                    <View style={{height: 80, justifyContent: 'center', alignItems: 'center'}}>
                        <CusBaseText style={{fontSize: 16, color: '#8B8B8B'}}>{'如果旧密码输错5次,将冻结您的账号'}</CusBaseText>
                    </View>


                    <TouchableOpacity disabled={this.state.waiting} activeOpacity={0.65} style={{
                        height: 44,
                        backgroundColor: COLORS.appColor,
                        width: SCREEN_WIDTH - 40,
                        marginLeft: 20,
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} onPress={() => this._repeatClick(navigate)}>
                        <CusBaseText style={{
                            textAlignVertical: 'center',
                            color: 'white',
                            fontSize: 17,
                            textAlign: 'center'
                        }}>{'立即修改'}</CusBaseText>
                    </TouchableOpacity>


                    <LoadingView ref='LoadingView'/>

                    {this.state.isShowKeyboardView ? this._createKeyboardView() : <View style={{
                        backgroundColor: 'rgba(0,0,0,0)',
                        height: Adaption.Height(270),
                        width: SCREEN_WIDTH
                    }}/>}
                </TouchableOpacity>
            );
        } else {


            return (
                <TouchableOpacity style={styles.container}
                                  activeOpacity={1}
                                  onPress={() => {
                                      this.setState({
                                          isShowKeyboardView: false,
                                      })
                                  }}
                >


                    <View style={{
                        borderRadius: 5,
                        borderColor: 'rgba(191,191,191,1)',
                        borderWidth: 1,
                        marginTop: 25,
                        marginLeft: 15,
                        marginRight: 15
                    }}>
                        <TouchableOpacity style={styles.container_inPutTextViewTop}
                                          activeOpacity={0.6}
                                          onPress={() => {

                                              this.setState({
                                                  oneRowShow:true,
                                                  twoRowShow:false,
                                                  isShowKeyboardView: true,
                                                  newPasswordInput: true,
                                                  newPasswordSureInput:false,
                                              })
                                          }}
                        >

                            <Text style={{flex: 0.25, marginLeft: 15, fontSize: 16, color: '#434343'}}>密码</Text>

                            <View style={{flex: 0.75, flexDirection: 'row', justifyContent: 'space-around'}}>
                                <View style={{
                                    backgroundColor: 'rgba(243,243,243,1)',
                                    width: 45,
                                    height: 32,
                                    borderRadius: 5,
                                    borderColor: 'rgba(168,172,182,1)',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',

                                }}>
                                    <Text style={{
                                        fontSize: 20,
                                        color: '#434343',
                                        marginTop: (this.state.setPassword.length > 0 ? 6 : 0)
                                    }}>{this.state.setPassword.length > 0 ? '*' : '-'}</Text>
                                    <AllenFadeInView ref='AllenFadeInViewC' hasContent={this.state.setPassword.length ==1&&this.state.oneRowShow?false:true} style={{position:'absolute',left:30,width:2,height:20,top:6,backgroundColor:'#456FEE'}}/>
                                </View>
                                <View style={{
                                    backgroundColor: 'rgba(243,243,243,1)',
                                    width: 45,
                                    height: 32,
                                    borderRadius: 5,
                                    borderColor: 'rgba(168,172,182,1)',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text style={{
                                        fontSize: 20,
                                        color: '#434343',
                                        marginTop: (this.state.setPassword.length > 1 ? 6 : 0)
                                    }}>{this.state.setPassword.length > 1 ? '*' : '-'}</Text>
                                    <AllenFadeInView ref='AllenFadeInViewC2' hasContent={this.state.setPassword.length ==2&&this.state.oneRowShow?false:true} style={{position:'absolute',left:30,width:2,height:20,top:6,backgroundColor:'#456FEE'}}/>

                                </View>
                                <View style={{
                                    backgroundColor: 'rgba(243,243,243,1)',
                                    width: 45,
                                    height: 32,
                                    borderRadius: 5,
                                    borderColor: 'rgba(168,172,182,1)',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',

                                }}>
                                    <Text style={{
                                        fontSize: 20,
                                        color: '#434343',
                                        marginTop: (this.state.setPassword.length > 2 ? 6 : 0)
                                    }}>{this.state.setPassword.length > 2 ? '*' : '-'}</Text>
                                    <AllenFadeInView ref='AllenFadeInViewC3' hasContent={this.state.setPassword.length ==3&&this.state.oneRowShow?false:true} style={{position:'absolute',left:30,width:2,height:20,top:6,backgroundColor:'#456FEE'}}/>
                                </View>
                                <View style={{
                                    backgroundColor: 'rgba(243,243,243,1)',
                                    width: 45,
                                    height: 32,
                                    borderRadius: 5,
                                    borderColor: 'rgba(168,172,182,1)',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text style={{
                                        fontSize: 20,
                                        color: '#434343',
                                        marginTop: (this.state.setPassword.length == 4 ? 6 : 0)
                                    }}>{this.state.setPassword.length === 4 ? '*' : '-'}</Text>
                                    <AllenFadeInView ref='AllenFadeInViewC4' hasContent={this.state.setPassword.length ==4&&this.state.oneRowShow?false:true} style={{position:'absolute',left:30,width:2,height:20,top:6,backgroundColor:'#456FEE'}}/>
                                </View>

                            </View>


                        </TouchableOpacity>


                        <TouchableOpacity style={{

                            height: 60,
                            // marginLeft:15,
                            // marginRight:15,
                            // marginTop:20,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom:1,
                            width: window.width,}}
                                          activeOpacity={0.6}
                                          onPress={() => {
                                              this.setState({
                                                  oneRowShow:false,
                                                  twoRowShow:true,
                                                  isShowKeyboardView: true,
                                                  newPasswordSureInput: true,
                                                  newPasswordInput:false,
                                              })
                                          }}
                        >

                            <Text style={{flex: 0.25, marginLeft: 15, fontSize: 16, color: '#434343'}}>确认密码</Text>

                            <View style={{flex: 0.75, flexDirection: 'row', justifyContent: 'space-around'}}>
                                <View style={{
                                    backgroundColor: 'rgba(243,243,243,1)',
                                    width: 45,
                                    height: 32,
                                    borderRadius: 5,
                                    borderColor: 'rgba(168,172,182,1)',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',

                                }}>
                                    <Text style={{
                                        fontSize: 20,
                                        color: '#434343',
                                        marginTop: (this.state.setPasswordSure.length > 0 ? 6 : 0)
                                    }}>{this.state.setPasswordSure.length > 0 ? '*' : '-'}</Text>
                                    <AllenFadeInView ref='AllenFadeInViewC5' hasContent={this.state.setPasswordSure.length==1&&this.state.twoRowShow?false:true} style={{position:'absolute',left:30,width:2,height:20,top:6,backgroundColor:'#456FEE'}}/>
                                </View>
                                <View style={{
                                    backgroundColor: 'rgba(243,243,243,1)',
                                    width: 45,
                                    height: 32,
                                    borderRadius: 5,
                                    borderColor: 'rgba(168,172,182,1)',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text style={{
                                        fontSize: 20,
                                        color: '#434343',
                                        marginTop: (this.state.setPasswordSure.length > 1 ? 6 : 0)
                                    }}>{this.state.setPasswordSure.length > 1 ? '*' : '-'}</Text>
                                    <AllenFadeInView ref='AllenFadeInViewC6' hasContent={this.state.setPasswordSure.length==2&&this.state.twoRowShow?false:true} style={{position:'absolute',left:30,width:2,height:20,top:6,backgroundColor:'#456FEE'}}/>

                                </View>
                                <View style={{
                                    backgroundColor: 'rgba(243,243,243,1)',
                                    width: 45,
                                    height: 32,
                                    borderRadius: 5,
                                    borderColor: 'rgba(168,172,182,1)',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',

                                }}>
                                    <Text style={{
                                        fontSize: 20,
                                        color: '#434343',
                                        marginTop: (this.state.setPasswordSure.length > 2 ? 6 : 0)
                                    }}>{this.state.setPasswordSure.length > 2 ? '*' : '-'}</Text>
                                    <AllenFadeInView ref='AllenFadeInViewC7' hasContent={this.state.setPasswordSure.length==3&&this.state.twoRowShow?false:true} style={{position:'absolute',left:30,width:2,height:20,top:6,backgroundColor:'#456FEE'}}/>
                                </View>
                                <View style={{
                                    backgroundColor: 'rgba(243,243,243,1)',
                                    width: 45,
                                    height: 32,
                                    borderRadius: 5,
                                    borderColor: 'rgba(168,172,182,1)',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text style={{
                                        fontSize: 20,
                                        color: '#434343',
                                        marginTop: (this.state.setPasswordSure.length == 4 ? 6 : 0)
                                    }}>{this.state.setPasswordSure.length === 4 ? '*' : '-'}</Text>
                                    <AllenFadeInView ref='AllenFadeInViewC8' hasContent={this.state.setPasswordSure.length==4&&this.state.twoRowShow?false:true} style={{position:'absolute',left:30,width:2,height:20,top:6,backgroundColor:'#456FEE'}}/>
                                </View>

                            </View>


                        </TouchableOpacity>

                    </View>



                    <TouchableOpacity disabled={this.state.waiting} activeOpacity={0.65} style={{
                        height: 44,
                        backgroundColor: COLORS.appColor,
                        width: SCREEN_WIDTH - 40,
                        marginLeft: 20,
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop:50,
                    }} onPress={() => this._repeatClick(navigate)}>
                        <CusBaseText style={{
                            textAlignVertical: 'center',
                            color: 'white',
                            fontSize: 17,
                            textAlign: 'center'
                        }}>{'确定'}</CusBaseText>
                    </TouchableOpacity>

                    <LoadingView ref='LoadingView'/>


                    {this.state.isShowKeyboardView ? this._createKeyboardView() : <View style={{
                        backgroundColor: 'rgba(0,0,0,0)',
                        height: Adaption.Height(270),
                        width: SCREEN_WIDTH
                    }}/>}

                </TouchableOpacity>
            );
        }

    }


    // 弹出的键盘
    _createKeyboardView() {
        return (
            <View style={{backgroundColor: '#bababf', height: Adaption.Height(270), width: SCREEN_WIDTH,position:'absolute',bottom:0,}}>

                <View style={{backgroundColor: '#f6f6f7', flexDirection: 'row', height: Adaption.Height(50)}}>
                    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}><Text
                        allowFontScaling={false} style={{fontSize: Adaption.Font(17, 15), color: '#999'}}>请输入密码</Text></View>
                    <TouchableOpacity activeOpacity={1}
                                      style={{
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          height: Adaption.Height(50),
                                          position: 'absolute',
                                          top: 0,
                                          left: SCREEN_WIDTH - Adaption.Width(70)
                                      }}
                                      onPress={() => {
                                          this.setState({
                                              isShowKeyboardView: !this.state.isShowKeyboardView,
                                          })
                                      }}
                    >
                        <Text allowFontScaling={false}
                              style={{fontSize: Adaption.Font(17, 15), color: '#000', fontWeight: '900'}}>完成</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    automaticallyAdjustContentInsets={false}
                    alwaysBounceHorizontal={false}
                    data={this._keyboardTitle()}
                    renderItem={(item) => this._renderItemView(item)}
                    horizontal={false}
                    numColumns={3}
                    scrollEnabled={false}
                >
                </FlatList>
            </View>
        )
    }


    _renderItemView(item) {
        return (
            <TouchableOpacity activeOpacity={0.5} style={{
                backgroundColor: (item.index == 9 || item.index == 11) ? 'rgba(0,0,0,0)' : '#fff',
                width: SCREEN_WIDTH * 0.31,
                height: Adaption.Height(47),
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: (SCREEN_WIDTH * 0.07) / 4,
                marginTop: Adaption.Height(6.4),
                borderRadius: 5,
            }}
                              onPress={() => {

                                  if (item.index == 9) {
                                      return;
                                  }
                                  else {
                                      //判断当期输入位置

                                      let word = '';
                                      //设置密码新密码
                                      if (this.state.newPasswordInput == true)
                                      {
                                          //是否是删除
                                          if (item.index == 11) {
                                              if (this.state.setPassword.length > 0) {
                                                  let newW = this.state.setPassword;
                                                  this.setState({
                                                      setPassword: newW.substring(0, newW.length - 1),
                                                  })
                                              }

                                          }
                                          else {
                                              // 限制输入长度为4
                                              if (this.state.setPassword.length >= 4 || item.index == 9) {
                                                  return;
                                              }
                                              else {

                                                  let newW = this.state.setPassword + item.item.tit;
                                                  this.setState({
                                                      setPassword: newW,
                                                  })
                                              }
                                          }

                                      }
                                      //设置密码第二行
                                      else if (this.state.newPasswordSureInput == true)
                                      {
                                          //是否是删除
                                          if (item.index == 11) {
                                              if (this.state.setPasswordSure.length > 0) {
                                                  let newW = this.state.setPasswordSure;
                                                  this.setState({
                                                      setPasswordSure: newW.substring(0, newW.length - 1),
                                                  })
                                              }

                                          }
                                          else {
                                              // 限制输入长度为4
                                              if (this.state.setPasswordSure.length >= 4 || item.index == 9) {
                                                  return;
                                              }
                                              else {

                                                  let newW = this.state.setPasswordSure + item.item.tit;
                                                  this.setState({
                                                      setPasswordSure: newW,
                                                  })
                                              }
                                          }
                                      }
                                      else
                                      {
                                          //是否是删除
                                          if (item.index == 11) {
                                              if (this.state.setOldPassword.length > 0) {
                                                  let newW = this.state.setOldPassword;
                                                  this.setState({
                                                      setOldPassword: newW.substring(0, newW.length - 1),
                                                  })
                                              }

                                          }
                                          else {
                                              // 限制输入长度为4
                                              if (this.state.setOldPassword.length >= 4 || item.index == 9) {
                                                  return;
                                              }
                                              else {

                                                  let newW = this.state.setOldPassword + item.item.tit;
                                                  this.setState({
                                                      setOldPassword: newW,
                                                  })
                                              }
                                          }
                                      }

                                  }


                                  //
                                  // this.setState({
                                  //     moneyText: tempMoneyText,
                                  // })

                              }}>
                {item.index == 11
                    ? <Image resizeMode={'contain'} style={{width: Adaption.Width(40), height: Adaption.Width(40)}}
                             source={require('../../buyLot/img/ic_keyboardDelete.png')}/>
                    : <Text allowFontScaling={false}
                            style={{fontSize: Adaption.Font(22, 19), color: '#000'}}>{item.item.tit}</Text>
                }
            </TouchableOpacity>
        )
    }


    // 键盘显示的文本
    _keyboardTitle() {
        var array = [];
        for (let i = 1; i <= 12; i++) {
            if (i == 10) {
                array.push({key: i, tit: ''});
            }
            else if (i == 11) {
                array.push({key: i, tit: '0'});
            }
            else if (i == 12) {
                array.push({key: i, tit: 'delete'});
            }
            else {
                array.push({key: i, tit: i});
            }
        }
        return array;
    }


    _repeatClick(navigate)
    {
        this.setState({
            isShowKeyboardView:false,
        });

        this.setState({waiting: true});
        this._changePsd(navigate);
        setTimeout(() => {
            this.setState({waiting: false})
        }, 2000);

    }

    _changePsd(navigate) {


        console.log(this.state.setPassword);
        console.log(this.state.setPasswordSure);



        if (this.state.Tkpass_ok == 1) {
            //旧的密码会显示
            if (this.state.oldPsd.length == 0) {
                this._showInfo('旧密码不能为空');
                return;
            }

        }

        if (this.state.setPassword.length == 0) {
            this._showInfo('新密码不能为空');
            return;
        }

        if (this.state.setPasswordSure.length == 0) {
            this._showInfo('确认密码不能为空');
            return;
        }


        if (this.state.setPassword != this.state.setPasswordSure)
        {
            this._showInfo('两次输入密码不一致');
            return;
        }

        this._fetchData(navigate, global.UserLoginObject.Uid, global.UserLoginObject.Token, this.state.setOldPassword, this.state.setPassword, global.UserLoginObject.session_key);

    }

    _fetchData(navigate, uid, token, oldpass, newpass, sessionKey) {

        let AlertName = '';

        if (global.UserLoginObject.Tkpass_ok == 1) {
            AlertName = '修改成功!';
            //已设置过
            this.refs.LoadingView && this.refs.LoadingView.showLoading('正在修改交易密码...');
        } else {
            AlertName = '设置成功!';
            this.refs.LoadingView && this.refs.LoadingView.showLoading('正在设置交易密码...');
        }


        let params = new FormData();
        params.append("ac", "setTradPassVerify");
        params.append("uid", uid);
        params.append("token", token);
        params.append("oldpass", oldpass);
        params.append("newpass", newpass);
        params.append('sessionkey', sessionKey);
        params.append('tkpassok', global.UserLoginObject.Tkpass_ok);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);

        promise
            .then(response => {
                this.refs.LoadingView && this.refs.LoadingView.cancer();
                //请求成功
                if (response.msg == 0) {
                    this._updateInfo(1);

                    Alert.alert(
                        '提示',
                        AlertName,
                        [
                            {
                                text: '确定', onPress: () => {
                                this.props.navigation.goBack();
                            }
                            },
                        ]
                    );
                }
                else {
                    if (response.param) {
                        this.refs.LoadingView && this.refs.LoadingView.showFaile(response.param);
                    }
                }
            })
            .catch(err => {
                if (err && typeof(err) === 'string' && err.length > 0)
                {
                    this.refs.LoadingView && this.refs.LoadingView.showFaile(err);
                }
            });

    }

    _updateInfo(Tkpassok) {
        //发出通知,告知安全中心,设置好了
        PushNotification.emit('UpdateTextAtOnce', "updateTransPsd");
        global.UserLoginObject.Tkpass_ok = Tkpassok;//更新本地数据和内存数据状态
        UserInfo.updateUserInfo(global.UserLoginObject, (error) => {
        });

        PushNotification.emit('MsgHasChange');


        // let loginStringValue = JSON.stringify(global.UserLoginObject);
        // UserDefalts.setItem('userInfo',loginStringValue,(error) => {});

    }

    _showInfo(title) {
        Alert.alert(
            '提示',
            title,
            [
                {
                    text: '确定', onPress: () => {
                }
                },
            ]
        )
    }

}




// AllenFadeInView.js 光标小王子


class AllenFadeInView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fadeAnim: new Animated.Value(0),          // 透明度初始值设为0
            isStop:false,
            hasContent:props.hasContent,
            hasStart:true,
            AnativePropsLeft: Adaption.Width(10)
        };
    }


    setNativeProps(nativeProps) {
        // console.log('nativeProps',this,this._root);
        if(this.refs._root) {
            this.refs._root.setNativeProps(
                nativeProps);
        }else{
            this.state.AnativePropsLeft = nativeProps.style.left;
        }
        // this.state.AnativePropsLeft = nativeProps.style.left;
    }
    componentDidMount() {
        this.startAnimation();                             // 开始执行动画
    }

    startAnimation(){

        if(this.state.isStop||this.state.hasContent){
            this.state.hasStart = false;
            return;
        }
        this.state.fadeAnim.setValue(0);
        Animated.timing(                            // 随时间变化而执行的动画类型
            this.state.fadeAnim,                      // 动画中的变量值
            {
                duration: 1000,
                toValue: 1,                             // 透明度最终变为1，即完全不透明
            }
        ).start(()=> this.startAnimation());
    }
    render() {
        return !this.state.hidden ?(
            <Animated.View                            // 可动画化的视图组件
                ref='_root'
                style={{
                    ...this.props.style,
                    opacity: this.state.fadeAnim,          // 将透明度指定为动画变量值
                    // left:this.state.AnativePropsLeft
                }}
            >
                {this.props.children}
            </Animated.View>
        ):null;
    }

    componentWillUnmount() {

        this.state.isStop = true;

    }


    componentWillReceiveProps(nextProps) {
        // console.log("componentWillReceiveProps",nextProps);
        this.state.hasContent = nextProps.hasContent;
        this.state.hidden =  nextProps.hasContent;

        if(!this.state.hidden&&!this.state.hasStart){

            this.state.hasStart = true;
            this.startAnimation();
        }
    }


}
const styles = StyleSheet.create({

    contleft: {
        flex: 1,
        textAlign: 'right',
        paddingLeft: 25,
        textAlignVertical: 'center',
        color: '#7D7E80',

    },

    container: {
        flex: 1,
        backgroundColor: '#ffffff',

    },

    container_inPutTextViewTop: {
        borderBottomWidth: 1.0,
        borderBottomColor: 'lightgrey',
        height: 60,
        // marginLeft:15,
        // marginRight:15,
        marginTop:1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: window.width,
    },


    container_inPutTextViewMid: {
        borderBottomWidth: 1.0,
        borderColor: 'lightgrey',
        height: 60,
        // marginLeft:15,
        // marginRight:15,
        flexDirection: 'row',
        alignItems: 'center',
        width: window.width,

    },

    container_inPutTextView: {
        // borderWidth:1.0,
        // borderColor:'lightgrey',
        height: 60,
        // marginLeft:15,
        // marginRight:15,
        flexDirection: 'row',
        alignItems: 'center',
        width: window.width
    },

    container_inPutTextView_Image: {
        width: 20,
        height: 20,
        marginLeft: 10
    },

    item_view: {
        borderWidth: 1.0,
        borderColor: 'lightgrey',
        height: 30,
        marginLeft: 10,
        marginRight: 10,
        width: window.width,
        justifyContent: 'center',
        alignItems: 'center',
    },

    item_bord: {
        flex: 3,
        flexDirection: 'row',
        marginLeft: 15
    }

})
