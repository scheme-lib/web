requirejs.config({
    baseUrl: '/',
    paths: {
        app: '../app',
        jquery:['https://cdn.bootcss.com/jquery/3.2.1/jquery.min','js/jquery.min'],
        vue:['https://cdn.bootcss.com/vue/2.4.2/vue.min','js/vue.min'],
	vueresource:['https://cdn.bootcss.com/vue-resource/1.3.4/vue-resource.min','js/vue-resource.min'],
        editor:'dist/mavon-editor',
        'markdown-it':['https://cdn.bootcss.com/markdown-it/8.4.0/markdown-it.min','dist/markdown-it.min'],
        bootstrap :["https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min", "js/bootstrap.min"],
	//codemirror:["https://cdn.bootcss.com/codemirror/5.30.0/codemirror.min","js/codemirror.min"],
	//'codemirror/lib':['https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.14.2',],
	//cmmarkdown:["https://cdn.bootcss.com/codemirror/5.30.0/mode/markdown/markdown.min","js/mardown.min"],
        text:"js/text",
        highlight:"dist/highlight.pack",
	utils:'js/utils'
    },
    packages: [
    	// {
    	//     name: "codemirror",
    	//     location: ["https://cdn.bootcss.com/codemirror/5.30.0/","js"],
    	//     main: "codemirror.min",
    	//     lib: [".","lib"]
    	// },
	{
    	    name: "cmmarkdown/lib/codemirror",
    	    location: ["https://cdn.bootcss.com/codemirror/5.30.0/","js"],
    	    main: "codemirror",
    	    lib: ["."]
    	},
    	{
    	    name: "cmmarkdown",
    	    location: ["https://cdn.bootcss.com/codemirror/5.30.0/","js"],
    	    main: "mode/markdown/markdown.min"
    	},
    ],
    shim:{
        bootstrap : ['jquery'],
        'editor':{
            deps:['jquery','vue'],
            exports:'editor'
        },

    }
});

function component(name) {
    return function (resolve, reject) {
	require([name], function (comp) {
	    resolve(comp)
	})
    }
};



define(['vue','markdown-it','bootstrap','jquery','utils','text!/api/fileList',],function(Vue,MarkDown,bootstrap,jq,utils,fileList){
    
    var md=MarkDown({
	html: true,
	linkify: true,
	typographer: true
    });
    
    Vue.config.debug = true;
    Vue.config.devtools = true;
    Vue.component('editor', component('components/markdown-it/comp'));

     var Tree = Vue.extend({
	name: 'tree',
	props: ['node', 'length'],
	template: '#tree',
	data: function() {
            return {
            }
	},
	computed: {
           
	},
	 methods: {
	     toggle: function(node) {
		 if (node.isFolder) {
		     node.open = !node.open;
		 }
	     },
            add: function() {
		if (val = prompt()) {
                    this.node.children.push({
			name: val,
			children: []
                    });
		}
            },
	    select:function(node){
		var _this=this;
		var root=this.$root.$data.root;
		
		var activeTree=function(n){
		    n.active=false;
		    if (!n || !n.children || n.children.length<=0 ) return;
		    for (var i = 0, len = n.children.length; i < len; i++) {
			//console.log(n.children[i].name);
			n.children[i].active=false;
			var childs = n.children[i];
			if(childs && childs.children &&childs.children.length > 0){
			    activeTree(childs);
			}
		    }
		}
		activeTree(root);
		node.active=true;
		var p=this;
		while(p.$parent){
		    p=p.$parent;
		}
		p.$children[0].$emit('select', node);
		
	    },
            edit: function(node) {
		if (val = prompt()) {
                    node.name = val;
		    node.active=true;
		}
            },
            remove: function(node) {
		var _this = this;
		if (this.$parent.node) {
                    this.$parent.node.children.forEach(function(item, index) {
			if (item.name == node.name) {
                            _this.$parent.node.children.splice(index, 1);
			}
                    });
		} else {
                    this.$root.root = {};
		}
            }
	}
     });
    fileList=JSON.parse(fileList);
    
    var app=new Vue({
     	el: '#app',
     	name: 'app',
	data: {
	    selectNode:null,
	    value:'',
	    showEditor:false,
	    showPreview:true,
	    classPreview:'',
	    classText:'col-md-6',
	    showFullEditor:false,
	    classEditor:'col-md-10',
	    classTree:'col-md-2',
            root: {
		name: '文档',
		open:true,
		active:false,
		isFolder:true,
		children:fileList.result,
            }
	},
	components: {
            Tree
	},
	methods:{
	    toggleFullScreenEditor:function(){
		console.log(this.$el);
		
		if(!supportFullScreen()){
		    return;
		}
		if(fullScreenStatus()){
		    offFullScreenEvent(this.fullScreenCallback);
		    exitFullscreen();
		}else{
		    onFullScreenEvent(this.fullScreenCallback)
		    requestFullscreen(this.$el)
		}
	    },
	    fullScreenCallback () {
		this.isFullscreen = fullScreenStatus()
		if (!this.isFullscreen) {
		    offFullScreenEvent(this.fullScreenCallback)
		}
		this.$emit('change', this.isFullscreen)
		this.$emit('update:fullscreen', this.isFullscreen)
	    },
	    
	    toggleFullEditor:function(){
		this.showFullEditor=!this.showFullEditor;
		if(this.showFullEditor){
		    this.classEditor='col-md-12';
		}else{
		    this.classEditor='col-md-10';
		}
	    },
	    toggleEditor:function(){		
		this.showEditor=!this.showEditor;
	
	    },
	    togglePreview:function(){
		this.showPreview=!this.showPreview;
	    },
	    save:function(event){
		$.post('api/save',
		       {
			   'markdown':this.text,
			   'name':this.selectNode.name,
			   'path':this.selectNode.path,
		       },function(ret){
			   alert(ret.message);
		       },"json");
	    },
	    textChange : function(text){
		this.text=text;
	    },
	    select:function(node){
		var that=this;
		this.selectNode=node;
		if(node.isFolder){
		    $.get('/api/fileList',{name:node.name,path:node.path},function(ret){
			if(ret.code==0){
			    node.open=!node.open;
			    node.children=ret.result;
			}else{
			    alert(ret.message);
			}
		    });
		}else{
		    $.get('api/file',{name:node.path+node.name},function(ret){
			if(ret.code==0){
			    that.value=ret.result;
			}else{
			    alert(ret.message);
			}
			
		    });
		}
		
	    }
	    
	},
	watch:{
	    showEditor:function(){
		if(this.showEditor){
		    this.classPreview='';
		}else{
		    this.classPreview='col-md-12';
		}
	    },
	    showPreview:function(){
		if(this.showPreview){
		    this.classText='col-md-6';
		}else{
		    this.classText='col-md-12';
		}
	    }
	},

    });
    
    app.select(fileList.result[0]);
    

   
    
    //var result = md.render('# markdown-it rulezz!');
    //console.log(result);
    //console.log(md.disable([ 'link', 'image' ]));
})
