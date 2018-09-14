package com.skycprn.module;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.skycprn.module.PicNativeModule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by User on 2017/10/23.
 */

public class PicReactPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules=new ArrayList<>();
        //将我们创建的类添加进原生模块列表中
        modules.add(new PicNativeModule(reactContext));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        //返回值需要修改
        return Collections.emptyList();
    }
}
