# jSearch
移动web搜索插件

看案例的时候请使用可以模拟手机端的浏览器，因为是完全面向移动web端的，所以没有考虑兼容问题，该插件配合jLoad插件的reLoad函数可以实现筛选和分页的通用解决方案，但是有特殊需求的话可能需要改一下插件

##插件的初始化
非常简单
```javascript
//$("#search")会绑定一个点击事件，点击会弹出
$("#search").jSearch({
  //数据结构，具体结构如何请往下看
	tree:tree,
	//点击确定之后的回调函数
	callback:function(data) {
		console.log(data);
		alert('查询');
	}
});
```

##tree的结构
tree是一个js的数组，数组中包含多个节点，每个节点类型是一个json格式的数据，可以包含的属性有name、children、val、vals、backtext五个属性，目前必须要包含两层结构以上（包含两层），第一层必须要有children属性，并且会忽略val,vals,backtext属性，children中同样存放数组，数组中同样可以包含节点，val属性可以存放一个需要提交的json数据，vals是一个数组，可以包含多个提交的数据。<br/>
jSearch默认使用name属性作为最后一层节点点击之后的回显得值，但是有些时候却并不是这样，例如点击`成都市`，但是想显示`四川省-成都市`，这个时候backtext就可以作为回显的标准，具有backtext属性的节点点击时将不会使用name的值作为回显<br/>
以下是一些数据结构的案例<br/>
    
    最简单的双层的数据结构
```javascript
var tree = [{name:'性别',children:[
  {name:'全部',val:{gender:''}},
  {name:'男',val:{gender:'男'}},
  {name:'女',val:{gender:'女'}}
]}]
```

    三层数据结构
```javascript
var tree = [{name:'区域',children:[
  {naem:'四川',children:[
    {name:'全部',val:{city:''}},
    {name:'成都市',val:{city:'成都市'}},
    {name:'成都市',val:{city:'自贡市'}}
  ]}
]}]
```

    三层数据结构带backtext
```javascript
var tree = [{name:'区域',children:[
  {naem:'四川省',children:[
    {name:'全部',val:{city:''}},
    {name:'成都市',val:{city:'成都市'},backtext:'四川省-成都市'},
    {name:'成都市',val:{city:'自贡市'},backtext:'四川省-自贡市'}
  ]}
]}]
```

    三层数据结构带backtext和多个查询参数
```javascript
var tree = [{name:'区域',children:[
  {naem:'四川省',children:[
    {name:'全部',vals:[{province:''},{city:''}]},
    {name:'成都市',vals:[{province:'四川省'},{city:'成都市'}],backtext:'四川省-成都市'},
    {name:'成都市',vals:[province:'四川省'},{city:'自贡市'}],backtext:'四川省-自贡市'}
  ]}
]}]
```

    最后会将val和vals中的数据组合成一个json传到回调中

这些应该能满足基本的查询需求<br/>
###希望大家多多指正
