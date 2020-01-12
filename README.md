# vue-gantt

> dhtmlxGantt with vue.js, A gantt component for Vue.js

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9090
npm run dev

# build for production with minification
npm run build

```

## gantt功能总结

1. 按钮切换
    - 今天
    - 上一屏
    - 下一屏

2. 时间 marker
    - TodayMarker
    - 项目Marker

3. 拖拽
    - moveTask
    - 左右拖拽task

4. 任务样式
    - 没有开始的时间
    - 没有结束的时间
    - 两者都没有

5. 状态
    - 未开始
    - 进行中
    - 已完成
    - 逾期

6. 点击显示任务弹窗

7. tooltip提示信息

8. 数据
    - 过滤
    - 筛选
    - 格式化


## 核心
除去官方提供的配置和事件，主要集中在数据的聚合。一是将从接口获取的数据结构转换为gantt所需的数据结构；二是数据同步更新，我的做法是利用lodash的diff函数计算出更新前后数据的变化项，然后利用gantt提供的事件与方法逐个更新，性能方面就回到了老生常谈的话题上了，不再赘述。另外值得一提的是经过大量数据的测试dhtmlxGantt框架的性能是非常可观的，一次重新渲染的速度要大于重新排序所消耗的时间。（据说5.0以上版本再性能上还有不少提升，并且增加了更多实用的api，只是貌似暂时不对外，只能从官网例子上一睹为快了）
 
