//
//  RNBridgeModule.h
//  
//
//  Created by Money on 2017/9/20.
//  Copyright © 2017年 Money. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// 实现RCTBridgeModule协议
@interface RNBridgeModule : RCTEventEmitter

+ (void)postNotifyWithinfo:(NSDictionary *)info;

@end
