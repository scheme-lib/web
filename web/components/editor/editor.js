
const CONFIG = {
    'help_cn': 'help_cn',
    'help_en': 'help_en',
    'help_fr': 'help_fr',
    'words_cn': 'words_cn',
    'words_en': 'words_en',
    'words_fr': 'words_fr',
    'langList': ['en' , 'cn' , 'fr'],
    'toolbars': {
        'bold': true,
        'italic': true,
        'header': true,
        'underline': true,
        'strikethrough': true,
        'mark': true,
        'superscript': true,
        'subscript': true,
        'quote': true,
        'ol': true,
        'ul': true,
        'link': true,
        'imagelink': true,
        'code': true,
        'table': true,
        'undo': true,
        'redo': true,
        'trash': true,
        'save': true,
        'alignleft': true,
        'aligncenter': true,
        'alignright': true,
        'navigation': true,
        'subfield': true,
        'fullscreen': true,
        'readmodel': true,
        'htmlcode': true,
        'help': true,
        'preview': true
    }
};


function $toolbar_left_undo_click($vm) {
    if ($vm.d_history_index > 0) {
        $vm.d_history_index--
    }
    // $vm.$refs.vNoteDivEdit.innerHTML = $vm.s_markdown.render($vm.d_value)
    if ($vm.s_preview_switch) {
        let start = $vm.getTextareaDom().selectionStart
        let currentLength = $vm.d_value.length
        $vm.$nextTick(() => {
            // 光标操作
            start -= currentLength - $vm.d_value.length
            $vm.getTextareaDom().selectionStart = start
            $vm.getTextareaDom().selectionEnd = start
        })
    }
}
// redo
function $toolbar_left_redo_click($vm) {
    if ($vm.d_history_index < $vm.d_history.length - 1) {
        $vm.d_history_index++
    }
    // $vm.$refs.vNoteDivEdit.innerHTML = $vm.s_markdown.render($vm.d_value)
}
function $toolbar_left_trash_click($vm) {
    $vm.d_value = ''
    // $vm.$refs.vNoteDivEdit.innerHTML = $vm.s_markdown.render($vm.d_value)
}
function $toolbar_left_save_click($vm) {
    $vm.save($vm.d_value, $vm.d_render)
}
 const toolbar_left_click = (_type, $vm) => {
     var _param_of_insert_text = {
         'bold': {
             prefix: '**',
             subfix: '**',
             str: $vm.d_words.tl_bold
         },
         'italic': {
             prefix: '*',
             subfix: '*',
             str: $vm.d_words.tl_italic
         },
         'header': {
             prefix: '# ',
             subfix: ' #',
             str: $vm.d_words.tl_header
         },
         'underline': {
             prefix: '++',
             subfix: '++',
             str: $vm.d_words.tl_underline
         },
         'strikethrough': {
             prefix: '~~',
             subfix: '~~',
             str: $vm.d_words.tl_strikethrough
         },
         'mark': {
             prefix: '==',
             subfix: '==',
             str: $vm.d_words.tl_mark
         },
         'superscript': {
             prefix: '^',
             subfix: '^',
             str: $vm.d_words.tl_superscript
         },
         'subscript': {
             prefix: '~',
             subfix: '~',
             str: $vm.d_words.tl_subscript
         },
         'quote': {
             prefix: '> ',
             subfix: '',
             str: $vm.d_words.tl_quote
         },
         'ol': {
             prefix: '1. ',
             subfix: '',
             str: $vm.d_words.tl_ol
         },
         'ul': {
             prefix: '- ',
             subfix: '',
             str: $vm.d_words.tl_ul
         },
         'link': {
             prefix: '[](',
             subfix: ')',
             str: $vm.d_words.tl_link
         },
         'imagelink': {
             prefix: '![](',
             subfix: ')',
             str: $vm.d_words.tl_image
         },
         'code': {
             prefix: '```',
             subfix: '\n\n```\n',
             str: 'language'
         },
         'table': {
             prefix: '',
             subfix: '',
             str: '|column1|column2|column3|\n|-|-|-|\n|content1|content2|content3|\n'
         },
         'aligncenter': {
           prefix: '::: hljs-center\n\n',
           subfix: '\n\n:::\n',
           str: $vm.d_words.tl_aligncenter
         },
         'alignright': {
           prefix: '::: hljs-right\n\n',
           subfix: '\n\n:::\n',
           str: $vm.d_words.tl_alignright
         },
         'alignleft': {
           prefix: '::: hljs-left\n\n',
           subfix: '\n\n:::\n',
           str: $vm.d_words.tl_alignleft
         }
     };
     if (_param_of_insert_text.hasOwnProperty(_type)) {
         // 插入对应的内容
         $vm.insertText($vm.getTextareaDom(),
             _param_of_insert_text[_type]);
     }
     var _other_left_click = {
         'undo': $toolbar_left_undo_click,
         'redo': $toolbar_left_redo_click,
         'trash': $toolbar_left_trash_click,
         'save': $toolbar_left_save_click
     };
     if (_other_left_click.hasOwnProperty(_type)) {
         _other_left_click[_type]($vm);
     }
}

/**
 * 监听浏览器onresize
 * @param $vm
 */
const windowResize = ($vm) => {
    function sizeToStatus() {
        if ($vm.$el.clientWidth > 768) {
            // > 768
            $vm.s_subfield = $vm.subfield;
        }
        else {
            // <  768
            $vm.s_subfield = false;
        }
    }

    sizeToStatus();
    window.addEventListener('resize', function() {
        // 媒介查询
        if ($vm.$el.clientWidth > 768) {
            // > 768
            $vm.s_subfield = $vm.subfield;
        }
        else {
            // <  768
            $vm.s_subfield = false;
        }
    })
}


const keydownListen = ($vm , markdown) => {
    $vm.$el.addEventListener('keydown', function (e) {
        // 注册监听键盘事件
        if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
            // one key
            switch (e.keyCode) {
               /* case 9: {
                    // tab 单栏模式
                    if (!$vm.s_preview_switch) {
                        e.preventDefault()
                        if ($vm.$refs.vNoteDivEdit) {
                            let value = markdown.render($vm.d_value)
                            if (value !== null && value !== '') {
                                $vm.$refs.vNoteDivEdit.innerHTML = value
                                let sel = window.getSelection();
                                let range = sel.getRangeAt(0);
                                range = range.cloneRange();
                                range.setStartAfter($vm.$refs.vNoteDivEdit.lastChild)
                                range.collapse(true);
                                sel.removeAllRanges();
                                sel.addRange(range);
                            }
                        }
                    }
                    break;
                }*/
                case 119: {
                    // F8 导航
                    e.preventDefault()
                    $vm.toolbar_right_click('navigation')
                    break;
                }
                case 120: {
                    // F9 预览模式
                    e.preventDefault()
                    $vm.toolbar_right_click('preview')
                    break;
                }
                case 121: {
                    // F10 全屏
                    e.preventDefault()
                    $vm.toolbar_right_click('fullscreen')
                    break;
                }
                case 122: {
                    // F11 阅读
                    e.preventDefault()
                    $vm.toolbar_right_click('read')
                    break;
                }
                case 123: {
                    // F12 单双栏切花
                    e.preventDefault()
                    $vm.toolbar_right_click('subfield')
                    break;
                }
            }
        } else if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey) {
            // ctrl +
            switch (e.keyCode) {
                case 66: {
                    // B
                    e.preventDefault()
                    $vm.toolbar_left_click('bold')
                    break;
                }
                case 73: {
                    // I
                    e.preventDefault()
                    $vm.toolbar_left_click('italic')
                    break;
                }
                case 72: {
                    // H
                    e.preventDefault()
                    $vm.toolbar_left_click('header')
                    break;
                }
                case 85: {
                    // U
                    e.preventDefault()
                    $vm.toolbar_left_click('underline')
                    break;
                }
                case 68: {
                    // D
                    e.preventDefault()
                    $vm.toolbar_left_click('strikethrough')
                    break;
                }
                case 77: {
                    // M
                    e.preventDefault()
                    $vm.toolbar_left_click('mark')
                    break;
                }
                case 81: {
                    // Q
                    e.preventDefault()
                    $vm.toolbar_left_click('quote')
                    break;
                }
                case 79: {
                    // O
                    e.preventDefault()
                    $vm.toolbar_left_click('ol')
                    break;
                }
                case 76: {
                    // L
                    e.preventDefault()
                    $vm.toolbar_left_click('link')
                    break;
                }
                case 83: {
                    // S
                    e.preventDefault()
                    $vm.toolbar_left_click('save')
                    break;
                }
                case 90: {
                    // Z
                    e.preventDefault()
                    $vm.toolbar_left_click('undo')
                    break;
                }
                case 89: {
                    // Y
                    e.preventDefault()
                    $vm.toolbar_left_click('redo')
                    break;
                }
                case 8: {
                    // delete
                    e.preventDefault()
                    $vm.toolbar_left_click('trash')
                    break;
                }
            }
        } else if (e.ctrlKey && e.altKey && !e.shiftKey) {
            // ctrl + alt +
            switch (e.keyCode) {
                case 83: {
                    // S
                    e.preventDefault()
                    $vm.toolbar_left_click('superscript')
                    break;
                }
                case 85: {
                    // U
                    e.preventDefault()
                    $vm.toolbar_left_click('ul')
                    break;
                }
                case 76: {
                    // C
                    e.preventDefault()
                    $vm.toolbar_left_click('imagelink')
                    break;
                }
                case 67: {
                    // L
                    e.preventDefault()
                    $vm.toolbar_left_click('code')
                    break;
                }
                case 84: {
                    // T
                    e.preventDefault()
                    $vm.toolbar_left_click('table')
                    break;
                }
            }
        } else if (e.ctrlKey && e.shiftKey && !e.altKey) {
            // ctrl + shift
            switch (e.keyCode) {
                case 83: {
                    // S
                    e.preventDefault()
                    $vm.toolbar_left_click('subscript')
                    break;
                }
            }
        }
    });
}

 const insertTextAtCaret = (obj, {prefix, subfix, str}, $vm) => {
    obj.focus()
    if (document.selection) {
        alert('document.selection')
    } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
        var startPos = obj.selectionStart;
        var endPos = obj.selectionEnd;
        var tmpStr = obj.value;
        if (startPos === endPos) {
            // 直接插入
            obj.value = tmpStr.substring(0, startPos) + prefix + str + subfix + tmpStr.substring(endPos, tmpStr.length);
            obj.selectionStart = startPos + prefix.length;
            obj.selectionEnd = startPos + (str.length + prefix.length);
        } else {
            // 存在选中区域
            if (tmpStr.substring(startPos - prefix.length, startPos) === prefix && tmpStr.substring(endPos, endPos + subfix.length) === subfix) {
                // 取消
                obj.value = tmpStr.substring(0, startPos - prefix.length) + tmpStr.substring(startPos, endPos) + tmpStr.substring(endPos + subfix.length, tmpStr.length);
                obj.selectionStart = startPos - prefix.length;
                obj.selectionEnd = endPos - prefix.length;
            } else {
                // 确定
                obj.value = tmpStr.substring(0, startPos) + prefix + tmpStr.substring(startPos, endPos) + subfix + tmpStr.substring(endPos, tmpStr.length);
                obj.selectionStart = startPos + prefix.length;
                obj.selectionEnd = startPos + (endPos - startPos + prefix.length);
            }
        }
    } else {
        alert('else')
        // obj.value += str;
    }
    // 触发change事件
    $vm.d_value = obj.value
    obj.focus()
}
/**
 * 生成导航目录
 */
 const getNavigation = ($vm , full) => {
    let navigationContent;

    navigationContent = $vm.$refs.navigationContent

    navigationContent.innerHTML = $vm.d_render
    let nodes = navigationContent.children
    if (nodes.length) {
        for (let i = 0; i < nodes.length; i++) {
            judageH(nodes[i] , i , nodes)
        }
    }
    function judageH(node , i , nodes) {
        let reg = /^H[1-6]{1}$/;
        if (!reg.exec(node.tagName)) {
            node.style.display = 'none'
        } else {
            node.onclick = function () {
                let vShowContent = $vm.$refs.vShowContent;
                let vNoteEdit = $vm.$refs.vNoteEdit;
                if ($vm.s_subfield) {
                    // 双栏
                    if ($vm.s_preview_switch) {
                        // 编辑预览
                        vNoteEdit.scrollTop = vShowContent.children[i].offsetTop * (vNoteEdit.scrollHeight - vNoteEdit.offsetHeight) / (vShowContent.scrollHeight - vShowContent.offsetHeight);
                    } else {
                        // todo 编辑
                    }
                } else {
                    // 单栏
                    if ($vm.s_preview_switch) {
                        // 预览
                        vShowContent.scrollTop = vShowContent.children[i].offsetTop;
                    } else {
                        // todo 编辑
                    }
                }
            }
        }
    }
}

/**
 * 滚动条联动
 */
 const scrollLink = ($event, $vm) => {
    let element = $event.srcElement ? $event.srcElement : $event.target
    let ratio = element.scrollTop / (element.scrollHeight - element.offsetHeight)
    if ($vm.edit_scroll_height >= 0 && element.scrollHeight !== $vm.edit_scroll_height && (element.scrollHeight - element.offsetHeight - element.scrollTop <= 30)) {
        // star 内容变化 导致 高度增加  且滚动条距离底部小于25px  自动滚动到底部
        $vm.$refs.vNoteEdit.scrollTop = element.scrollHeight - element.offsetHeight
        ratio = 1
    }
    $vm.edit_scroll_height = element.scrollHeight
    // end ----
    if ($vm.$refs.vShowContent.scrollHeight > $vm.$refs.vShowContent.offsetHeight) {
        $vm.$refs.vShowContent.scrollTop = ($vm.$refs.vShowContent.scrollHeight - $vm.$refs.vShowContent.offsetHeight) * ratio
    }
}
/**
 * 监听浏览器fullscreen
 * @param $vm
 */
 const fullscreenchange = ($vm) => {
    // 阅读模式 全屏监听事件
    $vm.$el.addEventListener('fullscreenchange', function (e) {
        $vm.$toolbar_right_read_change_status()
    }, false);
    $vm.$el.addEventListener('mozfullscreenchange', function (e) {
        $vm.$toolbar_right_read_change_status()
    }, false);
    $vm.$el.addEventListener('webkitfullscreenchange', function (e) {
        $vm.$toolbar_right_read_change_status()
    }, false);
    $vm.$el.addEventListener('msfullscreenchange', function (e) {
        $vm.$toolbar_right_read_change_status()
    }, false);
}

function component(name) {
 return function (resolve, reject) {
 require([name], function (comp) {
 resolve(comp)
 })
 }
};

define(['text!./editor.html','markdown-it'], function (temp,markdownit) {

    var markdown_config = {
    html: true,        // Enable HTML tags in source
    xhtmlOut: true,        // Use '/' to close single tags (<br />).
    breaks: true,        // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-markdown',  // CSS language prefix for fenced blocks. Can be
    linkify: false,        // 自动识别url
    typographer: true,
    quotes: '“”‘’',
    highlight: function (str, lang) {
        return '<pre class="hljs"><code class="' + lang + '">' + markdown.utils.escapeHtml(str) + '</code></pre>';
    }
    }
    var markdown=markdownit( markdown_config);
    console.log(''+markdown.renderer);
    
    markdown.renderAsync = function (src, env, fuc, _env) {
        env = env || {};
        _env = _env || {};
        var _res = markdown.renderer.render(this.parse(src, env), this.options, env);
        if(_env['ishljs'] === false) fuc(_res)
        //todo else hljs(_res, fuc);
    };

    var autoTextarea=component('components/auto-textarea/auto-textarea');
    var s_md_toolbar_left=component('components/s-md-toolbar-left/s-md-toolbar-left');
var s_md_toolbar_right=component('components/s-md-toolbar-right/s-md-toolbar-right');

   
    // var markdown = require('markdown-it')(markdown_config);
    // // 表情
    // var emoji = require('markdown-it-emoji');
    // //
    // // 下标
    // var sub = require('markdown-it-sub')
    // // 上标
    // var sup = require('markdown-it-sup')
    // // <dl/>
    // var deflist = require('markdown-it-deflist')
    // // <abbr/>
    // var abbr = require('markdown-it-abbr')
    // // footnote
    // var footnote = require('markdown-it-footnote')
    // // insert 带有下划线 样式 ++ ++
    // var insert = require('markdown-it-ins')
    // // mark
    // var mark = require('markdown-it-mark')
    // //
    // var container = require('markdown-it-container')
    // // math katex
    // var katex = require('markdown-it-katex');
    // var miip = require('markdown-it-images-preview');
    // markdown.use(emoji)
    // // 	.use(sup)
    // 	.use(sub)
    // 	.use(container)
    // 	.use(container, 'hljs-left')/*align left */
    // 	.use(container, 'hljs-center')/*align center */
    // .use(container, 'hljs-right')/*align right */
    // .use(deflist)
    // .use(abbr)
    // .use(footnote)
    // .use(insert)
    // .use(mark)
    // .use(container)
    // .use(miip)
    // .use(katex)
    return {

	props: {
            // 是否渲染滚动条样式(webkit)
            scrollStyle: {
                type: Boolean,
                default: true
            },
            help: {
                type: String,
                default: null
            },
            // 初始value
            value: {
                type: String,
                default: ''
            },
            // 初始value
            language: {
                type: String,
                default: 'cn'
            },
            subfield: {
                type: Boolean,
                default: true
            },
            // 默认展示 edit & 其他 为编辑区域 preview  为预览区域
            default_open: {
                type:  String,
                default: null
            },
            // 是否开启编辑
            editable: {
                type: Boolean,
                default: true
            },
            // 是否开启工具栏
            toolbarsFlag: {
                type: Boolean,
                default: true
            },
            // 工具栏
            toolbars: {
                type: Object,
                default() {
                    return CONFIG.toolbars
                }
            },
            code_style:{
                type:String,
                default:'code-github'
            },
            placeholder: {
                type: String,
                default: null
            },
            ishljs: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                s_subfield: (() => {
                    return this.subfield;
                })(),
                s_autofocus: true,
                // 标题导航
                s_navigation: false,
                s_scrollStyle: (() => {
                    return this.scrollStyle
                })(),// props 是否渲染滚动条样式
                d_value: '',// props 文本内容
                d_render: '',// props 文本内容render
               /* d_value: (() => {
                    return this.value
                })(),// props 文本内容
                d_render: (() => {
                    return markdown.render(this.value);
                })(),// props 文本内容render*/
                s_preview_switch: (() => {
                    let default_open_ = this.default_open;
                    if (this.subfield && !default_open_) {
                        default_open_ = 'preview';
                    }
                    return default_open_ === 'preview' ? true : false;
                })(), // props true 展示编辑 false展示预览
                s_fullScreen: false,// 全屏编辑标志
                s_help: false,// markdown帮助
                s_html_code: false,// 分栏情况下查看html
                d_help: null,
                d_words: null,
                edit_scroll_height: -1,
                s_readmodel: false,
                s_table_enter: false, // 回车事件是否在表格中执行
               /* s_screen_phone_toggle: true,
                s_screen_phone: false,*/
                d_history: (() => {
                    let temp_array = []
                    temp_array.push(this.value)
                    return temp_array;
                })(), // 编辑记录
                d_history_index: 0, // 编辑记录索引
                currentTimeout: '',
                s_markdown: markdown,
                // s_tomarkdown: tomarkdown,
                d_image_file: []
            };
        },
        created() {
            // 初始化语言
            this.initLanguage();
            this.$nextTick(function() {
                // 初始化单栏数据
                this.loadDivData();
                // 初始化Textarea编辑开关
                this.editableTextarea();
            })
        },
        mounted(){
            var $vm = this;
            this.$el.addEventListener('paste', function(e){
                $vm.$paste(e);
            })
            this.$el.addEventListener('drop', function(e){
                $vm.$drag(e);
            })
            // 浏览器siz大小
            windowResize(this);
            keydownListen(this, markdown);
            // fullscreen事件
            fullscreenchange(this);
            this.d_value = this.value;
            // 将help添加到末尾
            document.body.appendChild(this.$refs.help);
        },
        beforeDestroy() {
            document.body.removeChild(this.$refs.help);
        },
        methods: {
            textAreaFocus() {
                this.$refs.vNoteTextarea.$el.children[1].focus();
            },
            $drag($e){
                var dataTransfer = $e.dataTransfer;
                if(dataTransfer){
                    var files = dataTransfer.files;
                    if(files.length > 0){
                        $e.preventDefault();
                        /*
                         function deepCopy(source) {
                         var result={};
                         for (var key in source) {
                         result[key] = typeof(source[key])==='object'? deepCopy(source[key]): source[key];
                         }
                         return result;
                         }
                         var tmp = deepCopy(files);
                         console.log(tmp);
                         */
                        for(var i = 0;i < files.length;i++){
                            this.$refs.toolbar_left.$imgFileAdd(files[i]);
                        }
                    }
                }
            },
            $paste($e){
                var clipboardData = $e.clipboardData;
                if(clipboardData){
                    var items = clipboardData.items;
                    if(!items) return ;
                    var types = clipboardData.types || [];
                    var item = null;
                    for(var i = 0; i < types.length; i++ ){
                        if( types[i] === 'Files' ){
                            item = items[i];
                            break;
                        }
                    }
                    if( item && item.kind === 'file' && item.type.match(/^image\//i) ){
                        var oFile = item.getAsFile();
                        this.$refs.toolbar_left.$imgFileAdd(oFile);
                    }
                }
            },
            $imgTouch(pos){
                var $vm = this;
                this.insertText(this.getTextareaDom(),
                    {
                        prefix: '\n![' + $vm.d_words.tl_image + '](' + pos + ')',
                        subfix: '',
                        str: ''
                    });
            },
            $imgDel(pos){
                this.s_markdown.image_del(pos);
                this.d_render = this.s_markdown.render(this.d_value);
                this.$emit('imgDel', pos);
            },
            $imgAdd(pos, $file, isinsert){
                if(isinsert === undefined) isinsert = true;
                var $vm = this;
                if(this.__rFilter == null)
                // this.__rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
                    this.__rFilter = /^image\//i;
                this.__oFReader = new FileReader();
                this.__oFReader.onload = function (oFREvent){
                    $vm.s_markdown.image_add(pos, oFREvent.target.result);
                    if(isinsert == true) {
                        $vm.insertText($vm.getTextareaDom(),
                        {
                            prefix: '\n![' + $vm.d_words.tl_image + '](' + pos + ')',
                            subfix: '',
                            str: ''
                        });
                        $vm.$nextTick(function() {
                            $vm.$emit('imgAdd', pos, $file);
                        })
                    }
                }
                if($file){
                    var oFile = $file;
                    if(this.__rFilter.test(oFile.type)){
                        this.__oFReader.readAsDataURL(oFile);
                    }
                }
            },
            $imgUpdateByUrl(pos, url) {
                var $vm = this;
                this.s_markdown.image_add(pos, url);
                this.$nextTick(function() {
                    $vm.d_render = this.s_markdown.render(this.d_value);
                })
            },
            $imgAddByUrl(pos, url) {
                if(this.$refs.toolbar_left.$imgAddByUrl(pos, url)) {
                    console.log('i am here')
                    this.$imgUpdateByUrl(pos, url);
                    return true;
                }
                return false;
            },
            $img2Url(filename, url) {
                // x.replace(/(\[[^\[]*?\](?=\())\(\s*(\.\/2)\s*\)/g, "$1(http://path/to/png.png)")
                filename = filename.replace(/(\.|\\|\+|\*|\?|\^|\$|\[|\]|\{|\}|\(|\)|\||\/)/g, "\\$1")
                var reg_str = "/(!\\[\[^\\[\]*?\\]\(?=\\(\)\)\\(\\s*\(" + filename + "\)\\s*\\)/g"
                var reg = eval(reg_str);
                this.d_value = this.d_value.replace(reg, "$1(" + url + ")")
            },
            $imglst2Url(imglst) {
                if(imglst instanceof Array) {
                    for(var i = 0;i < imglst.length;i++) {
                        this.$img2Url(imglst[i][0], imglst[i][1]);
                    }
                }
            },
            toolbar_left_click(_type) {
                toolbar_left_click(_type, this);
            },
            toolbar_right_click(_type) {
                toolbar_right_click(_type, this);
            },
            getNavigation($vm, full) {
                return getNavigation($vm, full);
            },
            // @event
            // 修改数据触发 （val ， val_render）
            change(val, render) {
                this.$emit('change', val, render)
            },
            // 切换全屏触发 （status , val）
            fullscreen(status, val) {
                this.$emit('fullscreen', status, val)
            },
            // 打开阅读模式触发（status , val）
            readmodel(status, val) {
                this.$emit('readmodel', status, val)
            },
            // 切换阅读编辑触发 （status , val）
            previewtoggle(status, val) {
                this.$emit('previewtoggle', status, val)
            },
            // 切换分栏触发 （status , val）
            subfieldtoggle (status, val) {
                this.$emit('subfieldtoggle', status, val)
            },
            // 切换htmlcode触发 （status , val）
            htmlcode(status, val) {
                this.$emit('htmlcode', status, val)
            },
            // 打开 , 关闭 help触发 （status , val）
            helptoggle(status, val) {
                this.$emit('helptoggle', status, val)
            },
            // 监听ctrl + s
            save(val, render) {
                this.$emit('save', val, render)
            },
            // 导航栏切换
            navigationtoggle(status, val) {
                this.$emit('navigationtoggle', status, val)
            },
            $toolbar_right_read_change_status() {
                this.s_readmodel = !this.s_readmodel
                if (this.readmodel) {
                    this.readmodel(this.s_readmodel, this.d_value)
                }
                if (this.s_readmodel && this.toolbars.navigation) {
                    this.getNavigation(this, true)
                }
            },
            // ---------------------------------------
            // 滚动条联动
            $v_edit_scroll($event) {
                scrollLink($event, this);
            },
            /*
             // 监听单栏输入框内容的变化------------------------
             $auto_textarea_div_change($event) {
             let element = $event.srcElement ? $event.srcElement : $event.target
             // this.d_value = tomarkdown(element.innerHTML)
             },
             // 单栏目 输入框enter
             $auto_textarea_div_enter($event) {
             // onecolumnKeyDownEnter($event, this, tomarkdown)
             },
             */
            // 获取textarea dom节点
            getTextareaDom() {
                return this.$refs.vNoteTextarea.$el.children[1]
            },
            // 工具栏插入内容
            insertText(obj, {prefix, subfix, str}) {
                // if (this.s_preview_switch) {
                insertTextAtCaret(obj, {prefix, subfix, str}, this);
                /*
                 } else {
                 // 单栏模式点击
                 let div = this.$refs.vNoteDivEdit;
                 let obj = document.createElement('div');
                 obj.innerHTML = markdown.render(prefix + str + subfix)
                 if (obj.children.length === 1 && obj.children[0].tagName === 'P') {
                 if (prefix === '[](' || prefix === '![](') {
                 onecolumnInsert(div, '<p>' + prefix + str + subfix + '</p>')
                 } else {
                 onecolumnInsert(div, obj.children[0].innerHTML)
                 }
                 } else {
                 onecolumnInsert(div, obj.innerHTML)
                 }
                 // 同步数据
                 // this.d_value = tomarkdown(div.innerHTML)
                 }
                 */
            },
            saveHistory () {
                this.d_history.splice(this.d_history_index + 1, this.d_history.length)
                this.d_history.push(this.d_value)
                this.d_history_index = this.d_history.length - 1
            },
            initLanguage () {
                let lang = CONFIG.langList.indexOf(this.language) >= 0 ? this.language : this.language.default;
                var $vm = this;
                markdown.renderAsync(CONFIG[`help_${lang}`], {}, function(res) {
                    $vm.d_help = res;
                }, {'ishljs': $vm.ishljs})
                this.d_words = CONFIG[`words_${lang}`];
            },
            // 编辑开关
            editableTextarea() {
		// console.log(this.$refs.vNoteTextarea.$el);
                // let text_dom = this.$refs.vNoteTextarea.$el.children[1];
                // if (this.editable) {
                //     text_dom.removeAttribute('disabled');
                // } else {
                //     text_dom.setAttribute('disabled' , 'disabled');
                // }
            },
            loadDivData() {
                // if (this.$refs.vNoteDivEdit) {
                //     this.$refs.vNoteDivEdit.innerHTML = markdown.render(this.d_value)
                // }
            },
        },
        watch: {
            d_value: function (val, oldVal) {
                var $vm = this;
                markdown.renderAsync($vm.d_value, {}, function(res) {
                    // render
                    $vm.d_render = res;
                    // change回调
                    if ($vm.change) $vm.change($vm.d_value, $vm.d_render);
                    // 改变标题导航
                    if ($vm.s_navigation) getNavigation($vm, false);
                    // v-model 语法糖
                    $vm.$emit('input', val)
                    // 塞入编辑记录数组
                    if ($vm.d_value === $vm.d_history[$vm.d_history_index]) return
                    window.clearTimeout($vm.currentTimeout)
                    $vm.currentTimeout = setTimeout(() => {
                        $vm.saveHistory()
                    }, 500);
                }, {'ishljs': $vm.ishljs})
            },
            value: function (val, oldVal) {
                if (val !== this.d_value) {
                    this.d_value = val
                    this.loadDivData();
                }
            },
            subfield: function (val, oldVal) {
                this.s_subfield = val
            },
            d_history_index () {
                if (this.d_history_index > 20) {
                    this.d_history.shift()
                    this.d_history_index = this.d_history_index - 1
                }
                this.d_value = this.d_history[this.d_history_index]
            },
            language: function (val) {
                this.initLanguage();
            },
            editable: function () {
                this.editableTextarea();
            },
            default_open: function (val) {
                let default_open_ = val;
                if (this.subfield && !default_open_) {
                    default_open_ = 'preview';
                }
                return this.s_preview_switch = default_open_ === 'preview' ? true : false;
            }
        },
	components: {
            'v-autoTextarea': autoTextarea,
            's-md-toolbar-left': s_md_toolbar_left,
            's-md-toolbar-right': s_md_toolbar_right
        },
        template: temp
    }
});
