package com.skycprn.utils;

import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.skycprn.MainActivity;
import com.skycprn.MainApplication;
import com.skycprn.android.ui.NativeActivity;
import com.skycprn.model.SwtichMode;
import com.skycprn.web.ui.WebViewActivity;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;


/**
 * Created by kim
 * on 2017/12/5.
 * 请求网络
 */

public class HttpUtils {

    public static HttpUtils instance;

    public static HttpUtils getInstance() {
        synchronized (HttpUtils.class) {
            if (instance == null) {
                instance = new HttpUtils();
            }
        }
        return instance;
    }

//adsf
    public void getDataAsync(final Context context, String appid) {
        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url("http://plist2.bxvip588.com/index.php/appApi/request/ac/getIosAppData/appid/"+appid+"/key/d20a1bf73c288b4ad4ddc8eb3fc59274704a0495")
                .build();
        client.newCall(request).enqueue(new Callback() {

            @Override
            public void onFailure(Call call, IOException e) {
                updateMessage("访问网络失败，请检查网络");
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if(response.isSuccessful()){
                    String data=response.body().string();
                    Log.d("data",data);
                    parseData(context,data);
                }
            }

        });
    }

    public void jumpCatchPage(Context context){

        switch (SwtichMode.getInstance().status){
            case Contants.PROJECT_ANDROID:
                jumpTopage(context,NativeActivity.class, Contants.PROJECT_ANDROID);
                closeCurrentActivity();
                break;

            case Contants.PROJECT_RN:
                jumpTopage(context,MainActivity.class, Contants.PROJECT_RN);
                closeCurrentActivity();
                break;

            case Contants.PROJECT_RN_MODE:
                jumpTopage(context,MainActivity.class, Contants.PROJECT_RN_MODE);
                closeCurrentActivity();
                break;

            case Contants.PROJECT_WEB:
                //jumpTopage(context,MainActivity.class,Contants.PROJECT_RN);

                if(SwtichMode.getInstance().web_url.isEmpty()){
                    updateMessage("该通道暂时没开通");
                }else{

                    jumpTopage(context,WebViewActivity.class, Contants.PROJECT_WEB);
                    closeCurrentActivity();

                }
                break;
        }

    }

    //数据解析
    public void parseData(Context context,String data){
        try {
            JSONObject person = new JSONObject(data);
            JSONObject jsonObject= person.getJSONObject("data");
            SwtichMode.getInstance().plat = jsonObject.getString("plat");//android or ios
            SwtichMode.getInstance().code_key = jsonObject.getString("code_key");
            SwtichMode.getInstance().ji_push_key = jsonObject.getString("ji_push_key");
            SwtichMode.getInstance().status = jsonObject.getString("status");
            SwtichMode.getInstance().yezhu_name = jsonObject.getString("yezhu_name");
            SwtichMode.getInstance().website = jsonObject.getString("website");
            SwtichMode.getInstance().web_url = jsonObject.getString("url");
            Log.d("status", SwtichMode.getInstance().status);
            Log.d("code_key", SwtichMode.getInstance().code_key);
            switch (SwtichMode.getInstance().status){
                case Contants.PROJECT_ANDROID:
                    jumpTopage(context,NativeActivity.class, Contants.PROJECT_ANDROID);
                    closeCurrentActivity();
                    break;

                case Contants.PROJECT_RN:
                    jumpTopage(context,MainActivity.class, Contants.PROJECT_RN);
                    closeCurrentActivity();
                    break;

                case Contants.PROJECT_RN_MODE:
                    jumpTopage(context,MainActivity.class, Contants.PROJECT_RN_MODE);
                    closeCurrentActivity();
                    break;

                case Contants.PROJECT_WEB:
                    //jumpTopage(context,MainActivity.class,Contants.PROJECT_RN);

                    if(SwtichMode.getInstance().web_url.isEmpty()){
                        updateMessage("你的网址为空");
                        SwtichMode.getInstance().status = "-1";
                    }else{
                        jumpTopage(context,WebViewActivity.class, Contants.PROJECT_WEB);
                        closeCurrentActivity();
                        SwtichMode.getInstance().status= Contants.PROJECT_WEB;
                    }
                    break;

            }


        } catch (JSONException e) {
            e.printStackTrace();
        }


    }


    //jump to page
    public void jumpTopage(Context context,Class clzz,String type){

        Intent intent = new Intent(context, clzz);
        context.startActivity(intent);

        if(Contants.PROJECT_WEB!=type){
            Contants.isSwtichNative = type;
        }

    }


    //关闭界面
    public void closeCurrentActivity(){
        Log.d("launchActivity", MainApplication.launchActivity+"");
        if(MainApplication.launchActivity!=null){
            MainApplication.launchActivity.finish();
        }



    }
    //更新界面
    public void updateMessage(final String message){

        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if(MainApplication.launchActivity!=null){
                    MainApplication.launchActivity.message.setText(message);
                }

            }
        });


    }


}
