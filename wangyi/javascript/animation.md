# animation
- 实现方法
    +  gif
    +  flash
    +  css3
    +  js
- setInterval（连续执行）
    + setInterval(func，delay) // fun,触发时间间隔时间
- setTimeout（执行一次）
    + setTimeout(func[,delay]) // fun,触发时间间隔，默认为0
- requestAnimationFrame
    + requestAnimationFrame(func)
- 常见动画
    + 形变
    + 位移
    + 旋转
    + 透明

- 多媒体
    + video
        ```
        <video src='movie.mov' width=320 height=240></video>
        ```
    + audio
    ```
    <audio src='music.mp3'></audio>
    ```
    + 多媒体格式兼容
    ```
    var a = new Audio();
    a.canPlayType('audio');
    ```
    + 属性
        *  src
        *  controls
        *  autoplay
        *  preload(预加载)
            -   none
            -   metadata（预加载媒体元数据）
            -   auto（预加载资源信息）
        *  loop(循环)
    + 方法/属性
        *  load()
        *  play()
        *  pause()
        *  playbackRate // 播放速度
        *  currentTime
        *  volume
        *  muted // 静声
    + 状态
        *  paused
        *  seeking // 跳转
        *  ended // 播放完成
        *  duration
        *  initialTime //媒体开始时间
    + 事件
        *  loadstart
        *  loadmetadata // 媒体元数据已经加载完成
        *  canplay
        *  play
        *  waiting // 缓存数据不够，播放暂停
        *  playing
- 图形编程（canvas）
    ```
    <canvas id="coolfe" width='300' height='100'></canvas> // 默认 300，150
    ```
- 渲染上下文
    ```
    var canvas = document.getElementById('coolfe');
    var ctx = canvas.getContext('2d');
    ```
- globalCompositeOperation
        * ctx.globalCompositeOperation = 'destination-over';
- 绘画步奏
    + 清除画布
    + 绘制图形
    + 保存渲染上下文状态
    + 绘画图形
    + 回复渲染上下文状态
    + 绘制图形
    + 保存渲染上下文状态
    + 绘画图形
    + 回复渲染上下文状态
- https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial























