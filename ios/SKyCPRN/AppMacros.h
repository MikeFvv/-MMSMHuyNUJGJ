//
//  AppMacros.h
//  rainbowmkyl
//
//  Created by Mike on 2017/11/30.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#ifndef AppMacros_h
#define AppMacros_h

// ✰✰✰✰✰✰✰✰✰✰✰✰ 注意事项 ✰✰✰✰✰✰✰✰✰✰✰✰
// a.⭕️❗️❗️❗️ 马甲是RN开发需改成  isAppRNDevelopment = 1
// b. 使用了 AFNetworking、Bugtags、SAMKeychain 4个第三方, 如果重复冲突了， 只能删除自己的，不可删原有的
// ✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰

// 0 上架AppStore  ⭕️
// 1 RN页面;       ⚠️只调试使用
// 2 网页版;       ⚠️只调试使用
// 3 原生马甲页面；  ⚠️只调试使用
static NSInteger const kSwitchRoute = 0;      // ⭕️   上架默认0   -（RN开发勿修改）

// ✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰✰
// 是否是使用 RN马甲开发  ⭕️
// 0   否
// 1   是
static NSInteger const isAppRNDevelopment = 1;      // ⭕️  不是RN开发勿修改 默认 0


#endif /* AppMacros_h */














