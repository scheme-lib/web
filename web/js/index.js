define(['vue'],function(Vue){

    Vue.config.debug = true;
    Vue.config.devtools = true;
    return { //坑
        template: new Vue({
            el:'#editor',
            data:{
                name:'hello,world',
            }
        })
    }
})
