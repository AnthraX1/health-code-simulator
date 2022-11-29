# 通用库使用手册

## `base.js`

### `addStorageField`

```javascript
addStorageField(storage_id, selector, display_name, placeholder, filter = (x) => x)
```

将页面中元素与 `localStorage` 中的一个键值绑定。绑定的元素内容将与 `localStorage` 中对应的值同步，并为这些元素增加点击事件，引导用户改变该项的值。

- `storage_id: string` 必需，指定 `localStorage` 中存储的键值。
- `selector: string` 必需，指定要绑定的元素 CSS 选择器。元素将通过 `document.querySelectorAll(selector)` 方法获取。
- `display_name: string` 必需，显示在弹出提示框中的标题上（“修改 xxx：”）。
- `placeholder: string` 必需，`localStorage` 中的值未设定时的默认值。
- `filter: function`：可选，过滤器函数。接收 `localStorage` 中的值为参数，元素的 `innerHTML` 将设置为过滤器返回的内容。默认为 `(x) => x`。

`presetFilters` 提供了一些预设过滤器，如：`presetFilters.name`, `presetFilters.idcard(head = 2, tail = 2, mask = 18 - head - tail)`。

#### 示例

身份证号，只显示前三位和后三位：

```javascript
addStorageField("_idcard", "#idcard", "身份证号", "110101195306153019", presetFilters.idcard(3, 3))
```

### `initServiceWorker`

```javascript
initServiceWorker(project_name)
```

初始化 Service Worker，用于预加载内容以供离线使用。

- `project_name: string | Array`：必需，一个或多个项目名称，需与项目在 `src/` 中的路径名相同。例如 `"ykm"`，`["ykm", "skm", "trip-card"]`。

### `setDynamicTime`

```javascript
setDynamicTime(selector, start = 0, end = 19)
```

设置页面中动态更新的时间，指定元素的内容将定期与最新系统时间同步。格式为 `YYYY-MM-DD HH:mm:ss.SSSZ`，将通过提供的 `start` 及 `end` 截取此字符串。默认更新时间为 `1000ms`，可通过 `setUpdateInterval` 调整。

- `selector: string` 必需，指定要绑定的元素 CSS 选择器。元素将通过 `document.querySelectorAll(selector)` 方法获取。
- `start: number` 可选，字符串起始下标，默认为 0。
- `end: number` 可选，字符串截止下标，默认为 19。

### `setStaticTime`

```javascript
setStaticTime(selector, start = 0, end = 19, traceback_hours = 0, traceback_range = 0, filter = (x) => x)
```

设置页面中元素的内容为向前推算的静态时间。格式为 `YYYY-MM-DD HH:mm:ss.SSSZ`，将通过提供的 `start` 及 `end` 截取此字符串。

- `selector: string` 必需，指定要绑定的元素 CSS 选择器。元素将通过 `document.querySelectorAll(selector)` 方法获取。
- `start: number` 可选，字符串起始下标，默认为 0。
- `end: number` 可选，字符串截止下标，默认为 19。
- `traceback_hours: number` 可选，向前推算的小时数，默认为 0。
- `traceback_range: number` 可选，向前推算的随机波动范围小时数，默认为 0。
- `filter: function`：可选，过滤器函数。接收生成的字符串为参数，元素的 `innerHTML` 将设置为过滤器返回的内容。默认为 `(x) => x`。

最终生成的小时数范围为 `(now - traceback_hours - traceback_range / 2, now - traceback_hours + traceback_range / 2)`。

如果 HTML 标签上指定了 `data-traceback-time` 及 `data-traceback-range`，将依照标签属性的值设定这两项的值。

## `nav.css`

`nav.css` 提供了模拟小程序及应用内浏览器导航栏 UI 的样式，由 `nav.scss` 编译而来。引入 `nav.css` 后，还需在 `html` 文件中加入下面的 HTML。

### `navbar` —— 导航栏

`navbar--wechat`

微信小程序白色导航栏

```html
<div class="navbar navbar--wechat">
  <div class="navbar__placeholder"></div>
  <div class="navbar__inner" style="background: white;">
    <div class="navbar__left">
      <div class="navbar__buttons">
        <div class="navbar__button-goback" onclick="history.back();"></div>
      </div>
    </div>
    <div class="navbar__center">
      <span>页面标题</span>
    </div>
    <div class="navbar__right"></div>
  </div>
</div>
```

`navbar--wechat-alternative`

微信小程序透明背景或深色背景导航栏

```html
<div class="navbar navbar--wechat-alternative">
  <div class="navbar__placeholder"></div>
  <div class="navbar__inner">
    <div class="navbar__left">
      <div class="navbar__buttons">
        <div class="navbar__button-goback" onclick="history.back();"></div>
      </div>
    </div>
    <div class="navbar__center">
      <span>页面标题</span>
    </div>
    <div class="navbar__right"></div>
  </div>
</div>
```

`navbar--wechat-browser`

微信应用内浏览器导航栏

```html
<div class="navbar navbar--wechat-browser">
  <div class="navbar__placeholder"></div>
  <div class="navbar__inner">
    <div class="navbar__left">
      <div class="navbar__buttons">
        <div class="navbar__button-goback" onclick="history.back();"></div>
      </div>
    </div>
    <div class="navbar__center">
      <span>页面标题</span>
    </div>
  </div>
</div>
```

`navbar--alipay`

支付宝小程序白色导航栏

```html
<div class="navbar navbar--alipay">
  <div class="navbar__placeholder"></div>
  <div class="navbar__inner">
    <div class="navbar__title">
      页面标题
    </div>
  </div>
</div>
```

`navbar--alipay-alternative`

支付宝小程序透明背景或深色背景导航栏

```html
<div class="navbar navbar--alipay-alternative">
  <div class="navbar__placeholder"></div>
  <div class="navbar__inner">
    <div class="navbar__title">
      页面标题
    </div>
  </div>
</div>
```

### `capsule` —— 小程序右上角“胶囊”按钮

`capsule--wechat` 微信小程序右上角按钮：
```html
<div class="capsule capsule--wechat" onclick="navigateHome();">
  <svg class="capsule__menu-icon" viewBox="0 0 64 28" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="14" r="9.5"/>
    <circle cx="54" cy="14" r="6"/>
    <circle cx="10" cy="14" r="6"/>
  </svg>
  <div class="capsule__splitter"></div>
  <svg class="capsule__exit-icon" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="9"/>
    <circle cx="30" cy="30" r="23" stroke-width="6" fill="transparent"/>
  </svg>
</div>
```

`capsule--alipay`

支付宝小程序右上角按钮

```html
<div class="capsule capsule--alipay" onclick="navigateHome();">
  <svg class="capsule__menu-icon" viewBox="0 0 64 28" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="14" r="6" />
    <circle cx="54" cy="14" r="6" />
    <circle cx="10" cy="14" r="6" />
  </svg>
  <div class="capsule__splitter"></div>
  <svg class="capsule__exit-icon" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <line x1="21" y1="21" x2="39" y2="39" stroke-width="5" />
    <line x1="39" y1="21" x2="21" y2="39" stroke-width="5" />
    <circle cx="30" cy="30" r="24" stroke-width="5" fill="transparent" />
  </svg>
</div>
```

`capsule--alternative`

透明背景或深色背景右上角按钮，可与 `capsule--wechat` 和 `capsule--alipay` 搭配。

```html
<div class="capsule capsule--wechat capsule--alternative">...</div>
<div class="capsule capsule--alipay capsule--alternative">...</div>
```