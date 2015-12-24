/**
 *	@author chenkailun
 *	2015-12-22
 *	email:k_yoho@163.com
 */
(function($) {

	//array的删除方法
	Array.prototype.remove=function(dx) { 
	    if(isNaN(dx)||dx>this.length){return false;} 
	    for(var i=0,n=0;i<this.length;i++) 
	    { 
	        if(this[i]!=this[dx]) 
	        { 
	            this[n++]=this[i] 
	        } 
	    } 
	    this.length-=1 
	}
	$.extend($.fn, {
		jSearch:function(setting) {

			var js = {
				//body的jQuery实例,放在这里是为了方便调用
				body: $(document.body),
				//默认开始时关闭状态
				show:false,
				//默认层级高度
				baseIndex:1000,
				currentLevel:0
			};

			//可能会用来生成界面的元素名
			var domName = {domName:{div:'<div></div>',p:'<p></p>',span:'<span></span>',ul:'<ul></ul>',li:'<li></li>'}};

			js = $.extend(js, setting, domName);

			//当前节点
			js.currentDoc = this;

			//生成界面
			js.dom = function() {
				//背景
				js.jSearchBack = $(js.domName.div);
				js.jSearchBack.css('z-index', js.baseIndex);
				js.jSearchBack.addClass('jsearch_back')

				js.jSearchBack.appendTo(js.body);

				//背景绑定事件
				js.jSearchBack.bind('click',js.closeAll);

				js.searchThree = {};
				js.searchThree.name = '筛选';
				js.searchThree.children = js.tree
			}

			//插件全部层关闭
			js.closeAll = function() {
				if(js.layers.length > 0) {
					var layer = js.layers[(js.layers.length - 1)];
					layer.animate({left:$(window).width()},300,function() {
						layer.remove();
						js.layers.remove(js.layers.length - 1);
						if(js.layers.length == 0) {
							//隐藏背景
							js.backShow(false);
						}else{
							js.closeAll();
						}
					});
					js.currentLevel--;
				}
			}

			//返回上一层
			js.goBack = function () {
				var layer = js.layers[(js.layers.length - 1)];
				layer.animate({left:$(window).width()},300,function() {
					layer.remove();
					js.layers.remove(js.layers.length - 1);
					if(js.layers.length == 0) {
						//隐藏背景
						js.backShow(false);
					}
				});
				js.currentLevel--;
			}

			//背景的显示或隐藏，默认不加参数为显示，可以跟1个参数，true或者false
			js.backShow = function() {
				js.nodeSelect.length = 0;
				if(arguments.length == 1) {
					if(arguments[0] == false) {
						js.jSearchBack.animate({opacity:0},300,function() {
							js.jSearchBack.hide();
							js.body.css('overflow','scroll');
						});
					}else{
						js.jSearchBack.show();
						js.jSearchBack.animate({opacity:0.5},300);
					}
				}else{
					js.jSearchBack.show();
					js.jSearchBack.animate({opacity:0.5},300);
				}
			}

			//顶端节点的点击事件
			js.createData = function(node) {

				if(typeof js.searchTmp == 'undefined') js.searchTmp = new Array;

				if(typeof js.retData == 'undefined') js.retData = {};

				//第一层的点击事件执行
				if(typeof node.bactext == 'undefined') {
					js.nodeSelect[js.currentNode].text(node.name);
					js.searchTmp[js.currentNode] = node.name;
				}else{
					js.nodeSelect[js.currentNode].text(node.bactext);
					js.searchTmp[js.currentNode] = node.bactext;
				}

				if(typeof node.val != 'undefined') {
					$.extend(js.retData,node.val);
				}else{
					var querys = node.vals;
					for (var i = 0; i < querys.length; i++) {
						$.extend(js.retData,querys[i]);
					}
				}

				js.goFirst();
			}

			js.goFirst = function() {
				if(js.layers.length > 1) {
					var layer = js.layers[(js.layers.length - 1)];
					layer.animate({left:$(window).width()},300,function() {
						layer.remove();
						js.layers.remove(js.layers.length - 1);
						if(js.layers.length == 0) {
							//隐藏背景
							js.backShow(false);
						}else{
							js.goFirst();
						}
					});
					js.currentLevel--;
				}
			}

			//节点的点击事件
			js.createLayer = function(parent) {

				if(typeof js.layers == 'undefined') {
					js.layers = new Array;
				}

				//创建子节点壳,返回节点盒子
				var nodeDomObj = js.createNodeBox(parent);

				//在壳中添加节点
				var children = parent.children;
				for (var i = 0; i < children.length; i++) {
					var nodeObj = children[i];
					var node = $(js.domName.li);
					node.attr('node',i);
					node.text(nodeObj.name);

					//有子节点
					if(typeof nodeObj.children != 'undefined') {
						//向右的标签
						var nodeIcon = $(js.domName.span);
						nodeIcon.text('»');
						nodeIcon.addClass('jsearch_node_icon');
						node.append(nodeIcon);

						if(js.layers.length == 0) {
							var nodeSelect = $(js.domName.span);
							nodeSelect.addClass('jsearch_node_select_text');
							nodeSelect.text('全部');
							if(typeof js.searchTmp != 'undefined') {
								nodeSelect.text(js.searchTmp[i]);
							}							
							node.append(nodeSelect);
							//创建节点全局变量，用于修改选择之后的信息显示
							if(typeof js.nodeSelect == 'undefined') {
								js.nodeSelect = new Array;
							}
							js.nodeSelect.push(nodeSelect);
						}

						node.attr('parent',JSON.stringify(nodeObj));
						//绑定弹出下一层（调用自身）
						node.bind("click",function() {
							if(js.layers.length == 1) {
								js.currentNode = $(this).attr('node');
							}
							js.createLayer(jQuery.parseJSON($(this).attr('parent')));
						});
					}else{//无子节点
						node.attr('parent',JSON.stringify(nodeObj));
						node.bind("click",function() {
							js.createData(jQuery.parseJSON($(this).attr('parent')));
						});
					}

					if(i == children.length - 1) {
						node.css('border-bottom','none');
					}
					
					nodeDomObj.nodeBox.append(node);
				}

				//弹出动画
				nodeDomObj.box.animate({'left':$(window).width()-nodeDomObj.box.width()},300);

				js.layers.push(nodeDomObj.box);
				//当前层级加1
				js.currentLevel++;
			}

			//创建子节点壳
			js.createNodeBox = function(parent) {

				if(typeof js.layers == 'undefined') js.layers = new Array;

				//节点
				var box = $(js.domName.div);
				box.css('z-index', js.baseIndex+js.currentLevel+1);
				box.addClass('jsearch_parent');

				//title
				var title = $(js.domName.div);
				title.addClass('jsearch_title_box');
				title.text(parent.name);
				//取消按钮
				var cancelBtn = $(js.domName.span);
				cancelBtn.addClass('jsearch_title_cancel');
				cancelBtn.text('×');
				title.append(cancelBtn);


				cancelBtn.bind('click',js.goBack);

				if(js.layers.length == 0) {
					//确定按钮
					var confirmBtn = $(js.domName.span);
					confirmBtn.addClass('jsearch_title_confirm');
					confirmBtn.text('确定');
					title.append(confirmBtn);

					confirmBtn.bind('click', js.confirm);
				}

				//做滚动的盒子
				var parentRollBox = $(js.domName.div);
				parentRollBox.addClass('jsearch_parent_roll_box');
				var nodeBox = $(js.domName.ul);
				nodeBox.addClass('jsearch_ul')

				parentRollBox.append(nodeBox);

				box.append(title);
				box.append(parentRollBox);

				js.body.append(box);

				//调整盒子初始位置
				box.css('left',$(window).width());

				box.show();

				var nodeDomObj = {box:box,nodeBox:nodeBox,title:title};

				return nodeDomObj;
			}

			//点击确定，关闭窗口，调用回调方法，传回数据
			js.confirm = function() {
				js.closeAll();
				if(typeof js.retData == 'undefined') js.retData = {};
				js.callback(js.retData);
			}

			//插件的显示和关闭方法
			js.pluginShow = function() {
				js.body.css('overflow','hidden');
				js.jSearchBack.show();
				js.jSearchBack.animate({opacity:0.5},300,function() {
					//当前显示层级加1
					js.createLayer(js.searchThree);
				});
			}

			//插件本身的初始化方法调用
			js.load = function() {
				//背景
				js.dom();
				//实例绑定点击事件
				js.currentDoc.bind('click', js.pluginShow);
				//背景绑定点击关闭事件
				js.jSearchBack.bind('click', js.closeAll);
			}

			js.load();
		}
	});
})(jQuery)