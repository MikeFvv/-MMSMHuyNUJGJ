package com.skycprn.module;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.os.Build;
import android.util.Log;
import android.widget.Toast;
import com.eleven.lib.appupdatelibrary.AppUpdateUtils;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.skycprn.BuildConfig;
import com.skycprn.MainActivity;
import com.skycprn.MainApplication;
import com.skycprn.R;
import com.skycprn.android.ui.NativeActivity;
import com.skycprn.model.AppUpdateInfo;
import com.skycprn.utils.Contants;
import com.skycprn.utils.ThreadPoolFactory;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by kim
 * 所有android moudle的封装
 * on 2017/10/24 0024.
 */
public class RnAndroidReactModule extends ReactContextBaseJavaModule  {

    boolean isOpen;
    public static final String REACTCLASSNAME = "RnAndroidReactModule";
    private ReactContext mContext;

    public RnAndroidReactModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }
    @Override
    public String getName() {
        return REACTCLASSNAME;
    }

    @Override
    public boolean canOverrideExistingModule() {
        return true;
    }


     @ReactMethod
     public void getCodeVersion(String name,Promise promise){
         WritableMap writableMap=new WritableNativeMap();
         System.out.println("getVersionName="+getVersionName(mContext));
         writableMap.putString("codeVersion", getVersionName(mContext));
         promise.resolve(writableMap);
     }

    //版本号
    public  int getVersionCode(Context context) {
        return getPackageInfo(context).versionCode;
    }

    public String getVersionName(Context context){return getPackageInfo(context).versionName;}

    //获取包的信息
    private static PackageInfo getPackageInfo(Context context) {
        PackageInfo pi = null;

        try {
            PackageManager pm = context.getPackageManager();
            pi = pm.getPackageInfo(context.getPackageName(),
                    PackageManager.GET_CONFIGURATIONS);

            return pi;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return pi;
    }
    //获取string一些配置
    @ReactMethod
    public void getInitUrlConfigs(String name,Promise promise){
        WritableMap writableMap=new WritableNativeMap();
        writableMap.putString("rootUrl", mContext.getResources().getString(R.string.ROOT_URL));
        writableMap.putString("secondUrl", mContext.getResources().getString(R.string.SECOND_URL));
        writableMap.putString("website", mContext.getResources().getString(R.string.WEBSITE));
        writableMap.putString("number", mContext.getResources().getString(R.string.NUMBER));
        writableMap.putString("code", mContext.getResources().getString(R.string.Code));
        writableMap.putString("versionSDK", Build.VERSION.SDK_INT+"");
        promise.resolve(writableMap);
        Log.d("initconfig", mContext.getResources().getString(R.string.ROOT_URL));
    }


    /**
     * 版本更新
     */
     @ReactMethod
     public void versionUpdates(final String versionCode,final String versionName, final String website, final String number, final String ROOT_URL){
         ThreadPoolFactory.getNormalPool().execute(new Runnable() {
             @Override
             public void run() {
                 Map<String, String> postPrarm = new HashMap<>();
                 postPrarm.put("apkEnv", "1");
                 postPrarm.put("versionCode", versionCode);
                 postPrarm.put("versionName", versionName);
                 postPrarm.put("website", website);
                 postPrarm.put("number", number);
                 if(BuildConfig.APPLICATION_ID=="com.skycprn"){
                     postPrarm.put("applicationId", "com.bxvip.app.haocai_test");
                 }else{
                     postPrarm.put("applicationId", BuildConfig.APPLICATION_ID);

                 }

                 AppUpdateUtils.doCheckUpdate(mContext.getCurrentActivity(), ROOT_URL, postPrarm, "data", AppUpdateInfo.class);
             }
         });
     }


    //打开app
    @ReactMethod
    public void openApp(String packgeName){
        isOpen=false;
        //应用过滤条件
        Intent mainIntent = new Intent(Intent.ACTION_MAIN, null);
        mainIntent.addCategory(Intent.CATEGORY_LAUNCHER);
        //System.out.println("testrrr");
        PackageManager mPackageManager = mContext.getPackageManager();
        //System.out.println("tesr");
        List<ResolveInfo> mAllApps = mPackageManager.queryIntentActivities(mainIntent, 0);
        //按报名排序
        Collections.sort(mAllApps, new ResolveInfo.DisplayNameComparator(mPackageManager));
        for(ResolveInfo res : mAllApps){
            //该应用的包名和主Activity
            String pkg = res.activityInfo.packageName;
            String cls = res.activityInfo.name;
            //System.out.println("pkg---" +pkg);
            //System.out.println("打印出来的----" + packgeName);
            // 打开QQ pkg中包含"qq"，打开微信，pkg中包含"mm"
            if(pkg.contains(packgeName)){
                ComponentName componet = new ComponentName(pkg, cls);
                Intent intent = new Intent();
                intent.setComponent(componet);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                mContext.startActivity(intent);
                isOpen=true;
            }
        }

        if(!isOpen){
            Toast.makeText(mContext,"应用未安装,请下载",Toast.LENGTH_SHORT).show();
        }
    }

    //切换到原生项目
    @ReactMethod
    public void startActivityByClassname(String name,int type){

        if(type==1){
            Intent intent=new Intent();
            intent.setClass(mContext.getCurrentActivity(), NativeActivity.class);
            mContext.getCurrentActivity().startActivity(intent);
            if( mContext.getCurrentActivity()!=null)
               mContext.getCurrentActivity().finish();

        }else if(type==2){
            Intent intent=new Intent();
            intent.setClass(mContext.getCurrentActivity(), MainActivity.class);
            mContext.getCurrentActivity().startActivity(intent);
            if(MainApplication.nativeActivity!=null){
                MainApplication.nativeActivity.finish();

            }



        }

    }

    //获取项目类型
    @ReactMethod
    public void getProjectType(String name, Promise promise){
        WritableMap writableMap=new WritableNativeMap();
        writableMap.putInt("type", Contants.projectType);
        promise.resolve(writableMap);

    }


    /**
     * 注册通知的消息
     */
    @ReactMethod
    public void registNoticeMessage(){
    //    LocalBroadcastManager.getInstance(mContext).registerReceiver(mMssageReceiver,new IntentFilter(Constants.GANME_NAME_MESSAGE));
        //LocalBroadcastManager.getInstance(mContext).registerReceiver(mNoticReceiver,new IntentFilter(Constants.LOAD_DATA_MESSAGE));
    }
    /**
     * RCTDeviceEventEmitter方式
     * @param game_name
     */
    public void noticeMessage(String[] game_name){
        WritableMap params = Arguments.createMap();
        params.putString("game_id",game_name[0]);
        params.putString("game_name",game_name[1]);
        params.putString("tag",game_name[2]);
        mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("EventName",params);
    }

    /**
     * 通知网络加载成功
     * @param message
     */
   public void loadSuccessNotic(String message){
       WritableMap params = Arguments.createMap();
       params.putString("statue",message);
       Log.d("loadSuccessNoticTAG",message);
       mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
               .emit("LoadData",params);

   }

    private BroadcastReceiver mMssageReceiver=new BroadcastReceiver(){
        @Override
        public void onReceive(Context context, Intent intent) {
         /*   //接受数据
            String[] game_name =intent.getStringArrayExtra(Constants.GANME_NAME);
            noticeMessage(game_name);*/
        }
    };
    private BroadcastReceiver mNoticReceiver=new BroadcastReceiver(){
        @Override
        public void onReceive(Context context, Intent intent) {
          /*  //接受数据
            String message = intent.getStringExtra(Constants.NOTIC_MESSAGE);
            loadSuccessNotic(message);*/
        }
    };

}
