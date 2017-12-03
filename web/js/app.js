requirejs.config({
    baseUrl: '/',
    paths: {
        app: '../app',
        jquery:['https://cdn.bootcss.com/jquery/3.2.1/jquery.min','js/jquery.min'],
        vue:['https://cdn.bootcss.com/vue/2.4.2/vue.min','js/vue.min'],
        editor:'dist/mavon-editor',
        'markdown-it':['https://cdn.bootcss.com/markdown-it/8.4.0/markdown-it.min','dist/markdown-it.min'],
        bootstrap :["https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min", "js/bootstrap.min"],
        text:"js/text",
        highlight:"dist/highlight.pack"
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

// require(['jquery','vue','markdown'],
// 	  function   ($,vue,md) {
// 	      //console.log($);
// 	      //console.log(vue);
// 	      console.log(md);

// 	  });
require(['js/indexController']);

