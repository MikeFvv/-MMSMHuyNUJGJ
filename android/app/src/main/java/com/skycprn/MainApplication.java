package com.skycprn;
import android.app.Application;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.StrictMode;
import android.util.Log;
import android.view.View;

import com.bugtags.library.Bugtags;
import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import com.jadsonlourenco.RNShakeEvent.RNShakeEventPackage;
import com.beefe.picker.PickerViewPackage;
import com.imagepicker.ImagePickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import cn.jpush.reactnativejpush.JPushPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.jadsonlourenco.RNShakeEvent.RNShakeEventPackage;
import com.beefe.picker.PickerViewPackage;
import com.imagepicker.ImagePickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import cn.jpush.reactnativejpush.JPushPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.jadsonlourenco.RNShakeEvent.RNShakeEventPackage;
import com.beefe.picker.PickerViewPackage;
import com.imagepicker.ImagePickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import cn.jpush.reactnativejpush.JPushPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.imagepicker.ImagePickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.jadsonlourenco.RNShakeEvent.RNShakeEventPackage;
import com.microsoft.codepush.react.CodePush;
import java.util.Arrays;
import java.util.List;

import com.skycprn.android.ui.LaunchActivity;
import com.skycprn.android.ui.NativeActivity;
import com.skycprn.crash.CrashHandler;
import com.skycprn.module.PicReactPackage;
import com.skycprn.module.RnAndroidReactPackage;
import cn.jpush.reactnativejpush.JPushPackage;

public class MainApplication extends Application implements ReactApplication {
    private static MainApplication instance = null;

    public static NativeActivity nativeActivity;
    public static LaunchActivity launchActivity;

    // 设置为 true 将不弹出 toast
    private boolean SHUTDOWN_TOAST = false;
    // 设置为 true 将不 log
    private boolean SHUTDOWN_LOG = false;

    public static MainApplication getInstance() {
        if (instance == null) {
            instance = new MainApplication();
        }
        return instance;
    }
  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;// import com.facebook.react.BuildConfig;请勿在此导入此包
    }
      @Override
      protected String getJSBundleFile() {
 return CodePush.getJSBundleFile();
}

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new VectorIconsPackage(),
            new RNShakeEventPackage(),
            new PickerViewPackage(),
            new ImagePickerPackage(),
            new RNFetchBlobPackage(),
            new JPushPackage(),
            new VectorIconsPackage(),
            new RNShakeEventPackage(),
            new PickerViewPackage(),
            new ImagePickerPackage(),
            new RNFetchBlobPackage(),
            new JPushPackage(),
            new VectorIconsPackage(),
            new RNShakeEventPackage(),
            new PickerViewPackage(),
            new ImagePickerPackage(),
            new RNFetchBlobPackage(),
            new JPushPackage(),
            new RNFetchBlobPackage(),
            new ImagePickerPackage(),
            new CodePush(getResources().getString(R.string.codepush_android), getApplicationContext(), BuildConfig.DEBUG),// import com.facebook.react.BuildConfig;请勿在此导入此包
              //将我们创建的原生包管理器给添加进来
              new PicReactPackage(),
              new RnAndroidReactPackage(), //只需添加这里
              new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG),
              new RNShakeEventPackage()   //摇一摇
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }
  @Override
  public void onCreate() {
    super.onCreate();
      // 开启异常捕获
      CrashHandler.getInstance().init(this);
      SoLoader.init(this, /* native exopackage */ false);
      // 7.0的问题解决,url访问的问题
      StrictMode.VmPolicy.Builder builder = new StrictMode.VmPolicy.Builder();
      StrictMode.setVmPolicy(builder.build());
      //在这里初始化
      Bugtags.start("8d52d16417f77541ae28f71fdacc5e15", this, Bugtags.BTGInvocationEventNone);

  }

    public static PackageInfo getPackinfo() throws PackageManager.NameNotFoundException {
        PackageManager pm = instance.getPackageManager();
        return pm.getPackageInfo(instance.getPackageName(), 0);
    }
    public static int getVersionCode() {
        try {
            return getPackinfo().versionCode;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return -1;
    }
    /**
     * 返回当前程序版本名
     */
    public static String getAppVersionName() {
        String versionName = "";
        try {
            versionName = getPackinfo().versionName;
            if (versionName == null || versionName.length() <= 0) {
                return "";
            }
        } catch (Exception e) {
            Log.e("VersionInfo", "Exception", e);
        }
        return versionName;
    }


}
