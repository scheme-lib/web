
function conponent(name) {
 return function (resolve, reject) {
 require([name], function (comp) {
 resolve(comp)
 })
 }
};



define(['vue','markdown-it','text!/docs/md/sample.md'],function(Vue,markdown,sample){
    
    var md=markdown({
	html: true,
	linkify: true,
	typographer: true
    });
    //console.log(index);
    //Vue.component('component', conponent('components/comp/comp'));
    //Vue.component('editor', conponent('components/editor/editor'));

    Vue.component('editor', conponent('components/markdown-it/comp'));
    new Vue({
     	el: '#editor',
     	name: 'app',
	data:function() {
	    return{
		value:sample
	    };
	    
	}
    });
        
    //var result = md.render('# markdown-it rulezz!');
    //console.log(result);
    //console.log(md.disable([ 'link', 'image' ]));

})
