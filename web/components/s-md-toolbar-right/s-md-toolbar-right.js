define(['text!./s-md-toolbar-right.html'], function (temp) {
    return {
	name: 's-md-toolbar-right',
	props: {
            // 工具栏
            s_subfield: {
		type: Boolean ,
		required: true
            },
            toolbars: { type: Object, required: true },
            s_preview_switch: { type: Boolean, required: true },
            s_fullScreen: { type: Boolean, required: true },
            s_html_code: { type: Boolean, required: true },
            s_navigation: { type: Boolean, required: true },
            d_words: {
		type: Object,
		required: true
            }
	},
	methods: {
            // 工具栏功能图标click-----------------
            $clicks(_type) {
		// 让父节点来绑定事件并
		this.$emit('toolbar_right_click', _type);
            }
	},
        template: temp
    }
});
