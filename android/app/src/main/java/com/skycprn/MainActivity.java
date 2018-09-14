
package com.skycprn;
import android.annotation.TargetApi;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.RequiresApi;
import android.support.v4.view.ViewCompat;
import android.view.MotionEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowManager;
import com.bugtags.library.Bugtags;
import com.facebook.react.ReactActivity;
import cn.jpush.android.api.JPushInterface;

public class MainActivity extends ReactActivity   {

/**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */

    @Override
    protected String getMainComponentName() {
        return "SKyCPRN";
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        statusBar();
        //setTranslucentStatus(true);
        super.onCreate(savedInstanceState);
        JPushInterface.init(this);

    }


    //兼容状态栏
    public void statusBar(){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            View decorView = this.getWindow().getDecorView();
            decorView.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
                @RequiresApi(api = Build.VERSION_CODES.KITKAT_WATCH)
                @Override
                public WindowInsets onApplyWindowInsets(View v, WindowInsets insets) {
                    WindowInsets defaultInsets = v.onApplyWindowInsets(insets);
                    return defaultInsets.replaceSystemWindowInsets(
                            defaultInsets.getSystemWindowInsetLeft(),
                            0,
                            defaultInsets.getSystemWindowInsetRight(),
                            defaultInsets.getSystemWindowInsetBottom());
                }

            });
            ViewCompat.requestApplyInsets(decorView);
        }
    }

//    @Override
//    public void onWindowFocusChanged(boolean hasFocus) {
//        super.onWindowFocusChanged(hasFocus);
//        if(hasFocus && Build.VERSION.SDK_INT>=19){
//            View decorView=getWindow().getDecorView();
//            int option=View.SYSTEM_UI_FLAG_FULLSCREEN
//                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
//                    | View.SYSTEM_UI_FLAG_IMMERSIVE
//                    | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY ;
//            decorView.setSystemUiVisibility(option);
//        }
//    }

    @TargetApi(19)
    private void setTranslucentStatus(boolean on) {
        Window win = getWindow();
        WindowManager.LayoutParams winParams = win.getAttributes();
        final int bits = WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS;
        if (on) {
            winParams.flags |= bits;
        } else {
            winParams.flags &= ~bits;
        }
        win.setAttributes(winParams);

    }

    @Override
    protected void onPause() {
        super.onPause();
        JPushInterface.onPause(this);
        Bugtags.onPause(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        Bugtags.onResume(this);
        JPushInterface.onResume(this);
    }

    @Override
    public boolean dispatchGenericMotionEvent(MotionEvent event) {
        Bugtags.onDispatchTouchEvent(this, event);
        return super.dispatchGenericMotionEvent(event);
    }

}

