

#import "WYWebController.h"
#import "WYWebProgressLayer.h"
#import "UIView+Frame.h"
#import "WLWebProgressLayer.h"


#import "BoxInfoModels.h"
#import "BoxInfoModel.h"
#import "MMNetWorkManager.h"


// 获取屏幕宽度与高度
#define kUIScreenWidth       [UIScreen mainScreen].bounds.size.width
#define kUIScreenHeight      [UIScreen mainScreen].bounds.size.height
// 适配屏幕比例 iPhone6
#define kUIScreenWidth_Scale_iPhone6(_X_) (_X_ * (kUIScreenWidth/375))
// 适配屏幕比例 iPhone6
#define kUIScreenHeight_Scale_iPhone6(_X_) (_X_ * (kUIScreenHeight/667))

#define AlertWidth kUIScreenWidth_Scale_iPhone6(300)
#define AlertHeight kUIScreenHeight_Scale_iPhone6(300)


@interface WYWebController ()<UIWebViewDelegate>

@property (nonatomic, strong) UIView *alertView;

@property (nonatomic, strong) UIImageView *imgView;

//
@property (nonatomic, strong) BoxInfoModel *model;




@end

@implementation WYWebController
{
  UIWebView *_webView;
  
  WYWebProgressLayer *_progressLayer; ///< 网页加载进度条
}

- (void)viewDidLoad {
  [super viewDidLoad];
  
  [self requestBoxData];
  
  self.view.backgroundColor = [UIColor whiteColor];
  [self setupUI];
  
}

- (void)setupUI {
  _webView = [[UIWebView alloc] initWithFrame:self.view.bounds];
  _webView.delegate = self;
  
  
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  NSString *mmUrl = [defaults objectForKey:@"MM_mmUrl"];

  
  NSString *addHttpUrl;
  if (mmUrl.length > 0) {
    if([mmUrl rangeOfString:@"http"].location == NSNotFound){
      addHttpUrl = [NSString stringWithFormat:@"http://%@", mmUrl];
    } else {
      addHttpUrl = mmUrl;
    }
  } else {
    addHttpUrl = @"https://www.baidu.com";
  }
  
  
  NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:addHttpUrl]];
  [_webView loadRequest:request];
  
  _webView.backgroundColor = [UIColor whiteColor];
  [self.view addSubview:_webView];
}

#pragma mark - UIWebViewDelegate
- (void)webViewDidStartLoad:(UIWebView *)webView {
  
  //    _progressLayer = [WYWebProgressLayer layerWithFrame:CGRectMake(0, 64, SCREEN_WIDTH, 2)];
  _progressLayer = [WYWebProgressLayer layerWithFrame:CGRectMake(0, 0, SCREEN_WIDTH, 2)];
  [self.view.layer addSublayer:_progressLayer];
  [_progressLayer startLoad];
}

- (void)webViewDidFinishLoad:(UIWebView *)webView {
  [_progressLayer finishedLoad];
  self.title = [webView stringByEvaluatingJavaScriptFromString:@"document.title"];
}

- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error {
  [_progressLayer finishedLoad];
}

- (void)dealloc {
  NSLog(@"i am dealloc");
}


- (void)loadAlertView {
  
  self.alertView = [[UIView alloc] init];
  self.alertView.backgroundColor = [UIColor clearColor];
  self.alertView.layer.cornerRadius = 10;
  self.alertView.frame = CGRectMake(0, 0, AlertWidth, AlertHeight);
  self.alertView.layer.position = self.view.center;
  [self.view addSubview:self.alertView];
  
  
  UIImageView  *imgView = [[UIImageView alloc]initWithFrame: CGRectMake(0, 0, AlertWidth, AlertHeight)];
  
  imgView.layer.cornerRadius = 10;
  
  imgView.contentMode = UIViewContentModeScaleAspectFill;
  imgView.clipsToBounds = YES;
  //  imgView.backgroundColor = [UIColor redColor];
  
  imgView.image = [UIImage imageNamed:@"bg_image"];
  
  NSURL *photourl = [NSURL URLWithString:self.model.phone_img];
  
  UIImage *images = [UIImage imageWithData:[NSData dataWithContentsOfURL:photourl]];
  
  imgView.image = images;
  
  [self.alertView  addSubview:imgView];
  
  imgView.userInteractionEnabled = YES;
  
  UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(jumpAppUrl)];
  [imgView addGestureRecognizer:tap];
  _imgView = imgView;
  
  [self showAnimation];
}


- (void)showAnimation
{
  self.alertView.layer.position = self.view.center;
  self.alertView.transform = CGAffineTransformMakeScale(0.90, 0.90);
  [UIView animateWithDuration:0.25 delay:0 usingSpringWithDamping:0.8 initialSpringVelocity:1 options:UIViewAnimationOptionCurveLinear animations:^
   {
     self.alertView.transform = CGAffineTransformMakeScale(1.0, 1.0);
   }
                   completion:^(BOOL finished)
   {
     
   }];
}



-(void)jumpAppUrl {
  
  [[UIApplication sharedApplication] openURL:[NSURL URLWithString:self.model.clickhref]];
}


- (void)requestBoxData {
  
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  NSString *requestUrl = [defaults objectForKey:@"MM_mmUrl"];
  
  NSString *addHttpUrl;
  if([requestUrl rangeOfString:@"http"].location == NSNotFound){
    addHttpUrl = [NSString stringWithFormat:@"http://%@", requestUrl];
  }
  
  NSString *phoneApiUrl = [NSString stringWithFormat:@"%@/index.php/PhoneApi/request/ac/getNoticeApp/tui_type/2", addHttpUrl];
  
  //  NSLog(@"%@",phoneApiUrl);
  //  NSDictionary *parameters = @{@"ac": @"getNoticeApp", @"tui_type": @"2"};
  
  __weak typeof(self) weakSelf = self;
  
  [MMNetWorkManager requestWithType:HttpRequestTypeGet withUrlString:phoneApiUrl withParaments:nil withSuccessBlock:^(NSDictionary *object) {
    
    // NSLog(@"post请求数据成功： *** %@", object);
    NSInteger msg = [object[@"msg"] integerValue];
    if (msg == 0) {
      BoxInfoModels *modelsa = [BoxInfoModels friendWithDict:object];
      weakSelf.model = modelsa.data;
      
      if (weakSelf.model.clickhref.length > 0) {
        [weakSelf loadAlertView];
      }
    }
    
  } withFailureBlock:^(NSError *error) {
    NSLog(@"post error： *** %@", error);
  } progress:^(float progress) {
    NSLog(@"progress： *** %f", progress);
    
  }];
  
}



@end









