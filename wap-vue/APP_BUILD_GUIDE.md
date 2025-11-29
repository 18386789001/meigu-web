# Forex Trading APP 打包指南

本指南详细说明如何将此 Vue 3 项目打包成 Android 和 iOS 原生应用。

## 📋 前置要求

### 通用要求
- Node.js (v16+)
- npm 或 yarn
- 已安装项目依赖：`npm install`

### Android 打包要求
- **Java JDK** (JDK 11 或 JDK 17 推荐)
  - 下载：https://adoptium.net/
  - 配置环境变量 `JAVA_HOME`

- **Android Studio** (最新版)
  - 下载：https://developer.android.com/studio
  - 安装时勾选：Android SDK、Android SDK Platform、Android Virtual Device

- **Android SDK** (API Level 22+，推荐 API 33)
  - 在 Android Studio 中通过 SDK Manager 安装
  - 配置环境变量 `ANDROID_HOME` 或 `ANDROID_SDK_ROOT`

### iOS 打包要求（仅限 macOS）
- **macOS** 操作系统（必须）
- **Xcode** (14.0+)
  - 从 App Store 下载
- **CocoaPods**
  ```bash
  sudo gem install cocoapods
  ```
- **Apple Developer 账号**
  - 个人开发者账号：$99/年
  - 企业账号：$299/年

---

## 🚀 打包步骤

### 第一步：构建 Web 应用

```bash
# 安装依赖（如果还未安装）
npm install

# 构建生产版本
npm run build
```

构建完成后，会在 `../../jar/syn` 目录生成静态文件。

---

### 第二步：初始化 Capacitor（首次打包需要）

如果是首次打包，需要初始化 Android 和 iOS 平台：

```bash
# 添加 Android 平台
npx cap add android

# 添加 iOS 平台（仅 macOS）
npx cap add ios
```

执行后会在项目根目录生成：
- `android/` - Android 项目目录
- `ios/` - iOS 项目目录

---

## 📱 Android 打包详细步骤

### 1. 同步代码到 Android 项目

每次修改代码后都需要执行：

```bash
# 1. 重新构建
npm run build

# 2. 同步到 Android
npx cap sync android

# 或者一次性更新（拷贝 web 资源 + 更新原生插件）
npx cap copy android && npx cap update android
```

### 2. 在 Android Studio 中打开项目

```bash
# 方式1：命令行打开
npx cap open android

# 方式2：手动打开
# 用 Android Studio 打开 android/ 目录
```

### 3. 配置应用信息

打开 `android/app/build.gradle`，修改以下配置：

```gradle
android {
    namespace "com.forex.app"  // 修改为您的包名
    compileSdkVersion 33
    defaultConfig {
        applicationId "com.forex.app"  // 修改为您的应用ID
        minSdkVersion 22
        targetSdkVersion 33
        versionCode 1       // 版本号（整数，每次发布递增）
        versionName "1.0.0" // 版本名称（显示给用户）
    }
}
```

修改应用名称：`android/app/src/main/res/values/strings.xml`

```xml
<resources>
    <string name="app_name">Forex Trading</string>
    <string name="title_activity_main">Forex Trading</string>
</resources>
```

### 4. 配置应用图标

替换以下目录中的图标文件：
- `android/app/src/main/res/mipmap-hdpi/ic_launcher.png` (72x72)
- `android/app/src/main/res/mipmap-mdpi/ic_launcher.png` (48x48)
- `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png` (96x96)
- `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png` (144x144)
- `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` (192x192)

推荐使用在线工具生成：https://romannurik.github.io/AndroidAssetStudio/

### 5. 生成签名密钥（Release 版本必需）

```bash
# Windows
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# macOS/Linux
keytool -genkey -v -keystore ~/my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

记住您设置的密码和别名！

### 6. 配置签名信息

创建 `android/key.properties`（不要提交到 Git）：

```properties
storePassword=你的密钥库密码
keyPassword=你的密钥密码
keyAlias=my-key-alias
storeFile=../my-release-key.keystore
```

修改 `android/app/build.gradle`，添加签名配置：

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 7. 打包 APK/AAB

#### 方式1：Android Studio GUI
1. 点击菜单：Build → Generate Signed Bundle / APK
2. 选择 APK 或 Android App Bundle (AAB)
3. 选择密钥文件和配置
4. 选择 `release` 构建类型
5. 点击 Finish

生成的文件位置：
- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

#### 方式2：命令行
```bash
# 进入 android 目录
cd android

# 打包 APK
./gradlew assembleRelease

# 打包 AAB (Google Play 推荐格式)
./gradlew bundleRelease

# Windows 使用
gradlew.bat assembleRelease
```

### 8. 安装测试

```bash
# 连接 Android 设备并启用 USB 调试

# 安装 APK
adb install android/app/build/outputs/apk/release/app-release.apk

# 或使用 Capacitor 命令
npx cap run android
```

---

## 🍎 iOS 打包详细步骤（macOS Only）

### 1. 同步代码到 iOS 项目

```bash
# 1. 重新构建
npm run build

# 2. 同步到 iOS
npx cap sync ios

# 或者
npx cap copy ios && npx cap update ios
```

### 2. 安装 CocoaPods 依赖

```bash
cd ios/App
pod install
cd ../..
```

### 3. 在 Xcode 中打开项目

```bash
npx cap open ios
```

### 4. 配置项目信息

在 Xcode 中：

1. **选择项目** → **TARGETS** → **App**
2. **General 标签页**：
   - Display Name: `Forex Trading` (应用显示名称)
   - Bundle Identifier: `com.forex.app` (修改为您的唯一标识符)
   - Version: `1.0.0` (版本号)
   - Build: `1` (构建号，每次提交 App Store 需递增)

3. **Signing & Capabilities 标签页**：
   - Team: 选择您的 Apple Developer 团队
   - 勾选 "Automatically manage signing"

### 5. 配置应用图标

1. 在 Xcode 左侧找到 `App` → `Assets.xcassets` → `AppIcon`
2. 拖拽各尺寸的图标图片到对应位置
3. 所需尺寸：
   - 20x20 @2x, @3x
   - 29x29 @2x, @3x
   - 40x40 @2x, @3x
   - 60x60 @2x, @3x
   - 1024x1024 (App Store)

推荐工具：https://www.appicon.co/

### 6. 配置启动屏幕（Launch Screen）

在 `ios/App/App/Assets.xcassets/Splash.imageset` 中替换启动图。

### 7. 配置权限（如果需要）

编辑 `ios/App/App/Info.plist`，添加权限说明：

```xml
<key>NSCameraUsageDescription</key>
<string>需要使用相机扫描二维码</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>需要访问相册上传图片</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>需要获取位置信息</string>
```

### 8. 选择构建设备和打包

#### 测试版本（开发调试）
1. 连接 iPhone 设备
2. 顶部选择您的设备
3. 点击 ▶️ 运行按钮

#### 发布版本（App Store 或 Ad Hoc）
1. 顶部选择 **"Any iOS Device (arm64)"**
2. 菜单：**Product** → **Archive**
3. 等待构建完成后，会自动打开 **Organizer** 窗口
4. 选择刚才的 Archive，点击 **Distribute App**
5. 选择发布方式：
   - **App Store Connect** - 发布到 App Store
   - **Ad Hoc** - 通过 TestFlight 或直接分发
   - **Development** - 开发测试
   - **Enterprise** - 企业内部分发

6. 按照向导完成签名和上传

### 9. TestFlight 测试（推荐）

1. 在 App Store Connect 中创建应用
2. 通过 Xcode 上传到 App Store Connect
3. 在 App Store Connect → TestFlight 中添加测试人员
4. 测试人员下载 TestFlight app 即可安装测试

---

## 🔧 常见问题

### Android 问题

**Q: Gradle 构建失败**
```bash
# 清理缓存重新构建
cd android
./gradlew clean
./gradlew assembleRelease
```

**Q: 签名错误**
- 检查 `key.properties` 路径和密码是否正确
- 确保 keystore 文件存在

**Q: SDK 版本问题**
- 在 Android Studio 中打开 SDK Manager
- 安装项目所需的 SDK 版本（推荐 API 33）

### iOS 问题

**Q: 找不到 Team 或签名失败**
- 在 Xcode 中登录 Apple ID: Xcode → Settings → Accounts
- 确保有有效的开发者证书

**Q: CocoaPods 安装失败**
```bash
# 更新 CocoaPods
sudo gem install cocoapods
pod repo update

# 清理后重新安装
cd ios/App
pod deintegrate
pod install
```

**Q: 构建失败 - architecture 问题**
- Xcode 14+ 默认不支持 Bitcode，确保已禁用
- Build Settings → Enable Bitcode → NO

---

## 📤 发布到应用商店

### Google Play Store (Android)

1. 访问 https://play.google.com/console
2. 创建应用
3. 填写商店信息（截图、描述、分类等）
4. 上传 AAB 文件（推荐）或 APK
5. 填写内容分级
6. 设置定价和分发
7. 提交审核

**注意**：Google Play 现在要求使用 AAB 格式。

### Apple App Store (iOS)

1. 访问 https://appstoreconnect.apple.com
2. 创建新应用
3. 填写应用信息
4. 上传截图（多尺寸）
5. 通过 Xcode Archive 上传构建版本
6. 在 App Store Connect 中选择构建版本
7. 提交审核

**审核时间**：通常 1-3 天

---

## 🔄 更新应用流程

每次发布新版本：

1. **修改版本号**
   - Android: `android/app/build.gradle` 中的 `versionCode` 和 `versionName`
   - iOS: Xcode 中的 Version 和 Build 号

2. **重新构建**
   ```bash
   npm run build
   npx cap sync android
   npx cap sync ios
   ```

3. **打包**
   - Android: 生成新的 AAB/APK
   - iOS: 创建新的 Archive

4. **上传到商店**
   - Google Play: 创建新版本，上传 AAB
   - App Store: 上传新构建，提交审核

---

## 📱 快速命令参考

```bash
# 构建 Web 资源
npm run build

# 同步所有平台
npx cap sync

# 打开原生 IDE
npx cap open android
npx cap open ios

# 在真机上运行
npx cap run android
npx cap run ios

# 更新 Capacitor 插件
npx cap update

# 查看 Capacitor 配置
npx cap ls
```

---

## 🎯 推荐的开发流程

1. **开发阶段**：使用 `npm run dev` 在浏览器中开发
2. **测试阶段**：
   - Android: `npx cap run android` 在真机/模拟器测试
   - iOS: `npx cap run ios` 在真机/模拟器测试
3. **发布阶段**：按本指南打包正式版本

---

## 📚 相关资源

- [Capacitor 官方文档](https://capacitorjs.com/docs)
- [Android 开发文档](https://developer.android.com/docs)
- [iOS 开发文档](https://developer.apple.com/documentation/)
- [Google Play 发布指南](https://support.google.com/googleplay/android-developer/answer/9859152)
- [App Store 审核指南](https://developer.apple.com/app-store/review/guidelines/)

---

**提示**：首次打包建议先在测试环境完整走一遍流程，熟悉后再打包正式版本。祝打包顺利！🎉
