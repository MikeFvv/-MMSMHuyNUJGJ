/**
 Created by on 2017/10/30
 确定提交投注的请求方法
 */

export default {

  returnSubmitTuoZhuParam(parameter) {
    return returnTuoZhuParam(parameter);
  },

}

// 提交投注最终需要的参数
function returnTuoZhuParam(parameter) {

  let uid = global.UserLoginObject.Uid;
  let token = global.UserLoginObject.Token;
  let dataSource = parameter.dataSource;

  //这里普通投注和智能追号做个判断
  if (uid.length != 0 && token.length != 0) {
    var listArr = [];

    for (let i = 0; i < dataSource.length; i++) {
      let model = dataSource[i];
      let listStr = `${model.value.playid}#${model.value.singlePrice}#${model.value.balls}`;
      listArr.push(listStr);
    }


    // 购物车的确认投注 倍数 暂时这样写先。
    let zhuiQiShu = parseInt(parameter.zhuiQiShu);
    let multipleArr = [];
    
    if (parameter.beiShuArray && parameter.beiShuArray.length > 0) {
        multipleArr = parameter.beiShuArray;

    } else {
        // zhuiQiShu为1时 即当前期 不算是追号。
        for (let m = 0; m < zhuiQiShu; m++) {
          multipleArr.push(parameter.beiShu);
        }
    }


    let params = new FormData();
    params.append('ac', 'userSubmitTouzhu');
    params.append('uid', uid);
    params.append('token', token);
    params.append('sessionkey', global.UserLoginObject.session_key);
    params.append('gameid', parseInt(dataSource[0].value.gameid));
    params.append('qishu', dataSource[0].value.qishu);
    params.append('auto', zhuiQiShu); // 追多少期。1:追1期 即当前期，2:追号2期（包含当期）
    params.append('multiple', multipleArr.join('|')); // 追号的倍数用|隔开
    params.append('stop', parameter.isStop); // 0中奖后继续追号， 1中奖后停追。
    params.append('ver', global.VersionNum);
    params.append('data', JSON.stringify(listArr));
    // params.append('form_unique_token', Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2) + Math.round(new Date() / 1000));

    console.log(params);
    return params;
  }
}

 