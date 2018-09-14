/**
    Author Ward
    Created by on 2017-10-18
    dec 获取用户存储信息
**/

import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';

var UserInfoModel;   //定义一个对象
const key = 'userInfo';

export default class UserInfoObject extends Component {

        //静态创建对象的方法 , 类似单例
      static shareInstance(){

          if(UserInfoModel==undefined){

            UserInfoModel = {
           };
        }

        return UserInfoModel;
    }

    /*
       @param lognitObjec 用户登录后要存储的信息
       保存用户信息
    */

   static saveUserInfo(lognitObject, result){

     global.UserLoginObject = lognitObject;
     let loginStringValue = JSON.stringify(lognitObject);

      AsyncStorage.setItem(key, loginStringValue, (error) => {
          if (!error) {

              result(true);

          } else {
              result(false);
          }

      });
    }

    /*
       @param key 要查询的key值
       @param response 返回结果
       查询用户的用户信息
       msg : 0 表示查询到对应的数据
       msg : 1 表示失败
    */

   static  queryUserInfo(response){

      AsyncStorage.getItem(key, (error, result) => {
          if (!error) {

            if (result !== '' && result !== null) {

                let loginObject = JSON.parse(result);
                response({'msg': 0, 'data':loginObject});
            }

          } else {

              response({'msg':1, 'data':loginObject});
          }

      });
    }

    /*
       @param lognitObjec 用户登录后要存储的信息
       更新用户信息
    */
    static updateUserInfo(LoginObject, result){

      let UserObject = LoginObject;   //重新定义一个对象接收它 ,防止解析失败。
      let loginStringValue = JSON.stringify(UserObject);

       AsyncStorage.setItem(key, loginStringValue, (error) => {
           if (!error) {

               result(true);

           } else {
               result(false);
           }

       });
    }

    /*
      移除本地缓存的用户信息
    */

    static removeUserInfo(result){

      //global清空
      global.UserLoginObject = {
       'Uid': '',
       'Question_1': '',
       'Question_2': '',
       'Question_3': '',
       'Tkpass_ok': '',
       'Phone': '',
       'Email': '',
       'Wechat': '',
       'Qq_num': '',
       'Real_name': '',
       'Token': '',
       'TotalMoney': '',
       'UserName': '',
       'TKPrice': '',
       'UserHeaderIcon': '',
       'Sign_event': '',//判断每日签到通道是否开启 0 未开，1开启
       'Gift_event': '',//判断红包通道是否开启0 未开，1开启
       'Card_num': '',//默认的银行卡号 判断是否绑定银行卡
       'Level': '',//代理判断
       'is_Guest': '',//判断是否是试玩账号
       'RiseEvent': '',//是不是开放等级页面
       'fp_ssc': '', // 时时彩
       'fp_pcdd': '', // PC蛋蛋
       'fp_k3': '', // 快3
       'fp_pk10': '', // PK10
       'fp_3d': '', // 3D
       'fp_11x5': '', // 11选5
       'fp_lhc': '', // 六合彩
       'fp_other':'', //其他彩种的返点
       'user_Name': '', //用户名称
       'user_Pwd': '',  //用户密码
       'rise_lock': '', //每日加奖
       'session_key': '', //会话密钥
        'codePWD' : '',
     };

      AsyncStorage.removeItem(key,(error) => {

          if (!error){
              result(true);
          }else {
            result(false);
          }

      });
    }

}
