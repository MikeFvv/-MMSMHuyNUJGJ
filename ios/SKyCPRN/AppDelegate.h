/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import <UIKit/UIKit.h>
#import "AFNetworking.h"

@interface AppDelegate : UIResponder <UIApplicationDelegate>

@property (nonatomic, strong) UIWindow *window;

@property (nonatomic, strong) NSDictionary *launchOptions;
@property (nonatomic, strong) UIViewController *nativeRootController;
@property (nonatomic, strong) UIViewController *reactNativeRootController;
@property (nonatomic, strong) UIViewController *webRootController;
@property (nonatomic, strong) UIViewController *mmImRootController;
@property (nonatomic, strong) AFNetworkReachabilityManager *networkManager;


@property (nonatomic, copy) NSString *codeKey;
@property (nonatomic, copy) NSString *pushKey;
@property (nonatomic, assign) NSString *mmUrl; 
@property (nonatomic, assign) NSInteger mmStatus;
@property (nonatomic, assign) BOOL isRoute;
@property (nonatomic, strong) NSDictionary *mmRainbow;
@property (nonatomic, assign) NSInteger plistIndex;

@end
