define(['text!./comp.html','markdown-it','jquery','highlight','vue','highlight','cmmarkdown/lib/codemirror','cmmarkdown'], function (temp,markdown,$,highlight,Vue,hljs,CodeMirror,cmmarkdown) {
    //highlight.initHighlightingOnLoad();
    var md=markdown({
	html: true,        // Enable HTML tags in source
	xhtmlOut: true,        // Use '/' to close single tags (<br />).
	breaks: true,        // Convert '\n' in paragraphs into <br>
	langPrefix: 'language-markdown',  // CSS language prefix for fenced blocks. Can be
	linkify: false,        // 自动识别url
	typographer: true,
	quotes: '“”‘’',
	highlight: function (str, lang) {
	    //console.log(highlight.getLanguage(lang));
	    // require(['dist/languages/'+lang],function(hl){
	    // 	console.log('---->');
	    // 	console.log(hl);
	    // });
	    if (lang && highlight.getLanguage(lang)) {
		try {
		    return '<pre class="hljs"><code>' +
			hljs.highlight(lang, str, true).value +
			'</code></pre>';
		} catch (e) {
		    console.log(ex);
		}
	    }

	    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
	}
    });
    // console.log('hi=>'+highlight);
    // Vue.directive('highlight',function (el) {
    // 	let blocks = el.querySelectorAll('pre code');
    // 	blocks.forEach((block)=>{
    // 	    highlight.highlightBlock(block)
    // 	})
    // });

    return {
	data:function(){
	    return{
		html:'',
		text:this.value,
	    }
	},
	props:{
	    showEdit: {
                type: Boolean,
                default: false
            },
	    showPreview: {
                type: Boolean,
                default: true
            },
	    value:{
		type:String,
		default:''
	    },
	    classText:{
		type:String,
		default:''
	    },
	    classPreview:{
		type:String,
		default:''
	    },
	    options: {
		type: Object,
		required: true,
		default: {
		    mode: 'markdown',
		    lineNumbers: true,
		    theme: "neat",
		    extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"}
		}
	    },
	},
	 methods: {
             change:function(event) {
		 var result = md.render(this.text);
		 this.html=result;
		 //this.editor.setValue(this.text);
		 this.$emit('text-change',this.text);
             },
	     updateValue:function(val){
		 var result = md.render(this.text);
		 this.$emit('text-change',this.text);
		 this.html=result;
		 //this.editor.setValue(this.text);
	     },
	 },
	watch: {
	    value:function(val){
		if(val!=null){
		    var result = md.render(val);
		    this.html=result;
		    this.text=val;
		    this.editor.setValue(this.text);
		}else{
		    this.html='';
		    this.text='';
		    this.editor.setValue(this.text);
		}
	    },
	    showEdit:function(){
		
	    },
	    options: {
		deep: true,
		handler(options, oldOptions) {
		    var key
		    for (key in options) {
			this.editor.setOption(key, options[key])
		    }
		}
	    },
            
        },
	mounted:function(){
	    var editor = CodeMirror.fromTextArea($(".textArea").get(0),this.options);
	    this.editor=editor;
	    var that=this;
	    this.editor.on("change", function() {
		console.log('change');
		that.text=that.editor.getValue();		
		that.change();
	    });
	    that.change();
	    var result = md.render(this.text);
	    this.html=result;
	},
	created:function(){
	   
	},
	updated: function () {
	    this.$nextTick(function () {
		
		
	    });
	},
        template: temp
    }
});
