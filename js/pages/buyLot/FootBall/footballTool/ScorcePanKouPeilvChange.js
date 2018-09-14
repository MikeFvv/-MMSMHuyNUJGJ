/**
 * Created by Ward on 2018/08/27.
 * 用于体彩盘口切换的工具类(香港盘,马来盘,印尼盘,欧洲盘)
 */

export default {

   /*
     peilv:将要转换的赔率
     toPanKou:转成对应的盘口
   */

   getScorcePankouChangePeilv(peilv, toPanKou){

       let newPeilv = ''; //转换后的赔率

       if (toPanKou == '马来盘'){
           newPeilv = hkToMalaiPan(peilv);
       }
       else if (toPanKou == '印尼盘'){
           newPeilv = hkToYinNi(peilv);
       }
       else if (toPanKou == '欧洲盘'){
           newPeilv = hkToEuroup(peilv);
       }
       else {
           newPeilv = peilv;
       }

       return newPeilv;
   }
}

//香港盘与马来盘的赔率转换
function hkToMalaiPan(hkpeilv){

    let malaiPeilv = 0;  //转换后的马来赔率

    if (parseFloat(hkpeilv) > 1){
        malaiPeilv = Math.floor(1/parseFloat(hkpeilv)*100)/-100;
    }
    else {
        malaiPeilv = parseFloat(hkpeilv);
    }

    return `${malaiPeilv.toFixed(2)}`;
}

//香港盘和印尼盘的赔率转换
function hkToYinNi(hkpeilv){

    let yinNiPeilv = 0;  //转换后的印尼赔率

    if (parseFloat(hkpeilv) > 1){
        yinNiPeilv = parseFloat(hkpeilv);
    }
    else {
        yinNiPeilv = Math.floor(1/parseFloat(hkpeilv)*100)/-100;
    }

    return `${yinNiPeilv.toFixed(2)}`;
}

//香港盘和欧洲盘的赔率计算
function hkToEuroup(hkpeilv){

    return `${(parseFloat(hkpeilv) + 1).toFixed(2)}`;
}