/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>
#import "AppDelegate+MMFun.h"



@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.launchOptions = launchOptions;
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  
  [self setLoadConfigThirdService];
  
  [self.window makeKeyAndVisible];
  return YES;
}


// ⭕️ 1. 手动调试代码时在 AppMacros.h 类修改
//    2. 需要修改 BundleIdntifier  版本号  默认的0.0.1可以测试
- (UIViewController *)nativeRootController {
  if (!_nativeRootController) {
    
    // ⭕️  ⚠️壳入口⚠️   UIViewController 替换自己的入口
    _nativeRootController = [[UIViewController alloc] init];
    _nativeRootController.view.backgroundColor = [UIColor redColor];  // 注意改变自己的背景颜色
  }
  return _nativeRootController;
}






@end















