//
//  AppDelegate+ThirdService.m
//  rainbowmkyl
//
//  Created by Mike on 2017/12/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "AppDelegate+ThirdService.h"

#import <RCTJPushModule.h>
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif

#import "WYWebController.h"

@implementation AppDelegate (ThirdService)






- (void)jPushService {
  
  JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
  
  entity.types = UNAuthorizationOptionAlert|UNAuthorizationOptionBadge|UNAuthorizationOptionSound;
  
  [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];
  [JPUSHService setupWithOption:self.launchOptions appKey:self.pushKey
                        channel:nil apsForProduction:true];
}



- (void)initWebRootController {
  if (self.webRootController==nil) {
    
    self.webRootController = [[UIViewController alloc] init];

    WYWebController *webVC = [[WYWebController alloc] init];

    self.webRootController = webVC;
  }
}








#pragma mark - Application

// 取得 APNs 标准信息内容
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [JPUSHService registerDeviceToken:deviceToken];
}
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
}


- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)   (UIBackgroundFetchResult))completionHandler {
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
}
// iOS 10 Support
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler {
  NSDictionary * userInfo = notification.request.content.userInfo;
  [JPUSHService handleRemoteNotification:userInfo];
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
  
  completionHandler(UNNotificationPresentationOptionAlert);  // 需要执行这个方法，选择是否提醒用户，有Badge、Sound、Alert三种类型可以选择设置
  
  [UIApplication sharedApplication].applicationIconBadgeNumber = 0;
  [JPUSHService setBadge:0];
}
// iOS 10 Support
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler {
  NSDictionary * userInfo = response.notification.request.content.userInfo;
  [JPUSHService handleRemoteNotification:userInfo];
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFOpenNotification object:userInfo];
  
  completionHandler();   // 系统要求执行这个方法
  
  [UIApplication sharedApplication].applicationIconBadgeNumber = 0;
  [JPUSHService setBadge:0];
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:notification.userInfo];
}

//点击App图标，使App从后台恢复至前台
- (void)applicationWillEnterForeground:(UIApplication *)application {
  [application setApplicationIconBadgeNumber:0];
  [application cancelAllLocalNotifications];
}

//按Home键使App进入后台
- (void)applicationDidEnterBackground:(UIApplication *)application{
  [application setApplicationIconBadgeNumber:0];
  [application cancelAllLocalNotifications];
}




@end



