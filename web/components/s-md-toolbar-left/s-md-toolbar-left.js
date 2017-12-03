define(['text!./s-md-toolbar-left.html'], function (temp) {
    return {

	name: 's-md-toolbar-left',
	mounted(){
            this.trigger = this.$refs.img;
	},
	components: {
            // 'mu-popover': popover,
            // 'mu-list': list,
            // 'mu-list-item': listItem,
	},
	props: {
            // 是否开启编辑
            editable: {
		type: Boolean,
		default: true
            },
            // 工具栏
            toolbars: {
		type: Object,
		required: true
            },
            d_words: {
		type: Object,
		required: true
            }
	},
	data(){
            return {
		img_file: [['./0', null]],
		open: false,
		trigger: null,
		num: 0
            }
	},
	methods: {
            $imgFileListClick(pos){
		if(pos == 0)
                    this.$refs.imgfile[pos].click();
		else
                    this.$emit('imgTouch', this.img_file[pos][0]);
		this.open = false;
            },
            $imgFileAdd($file){
		this.img_file[0][0] = './' + this.num;
		this.img_file[0][1] = $file;
		this.img_file.unshift(['./' + (this.num + 1), null]);
		this.num = this.num + 1;
		this.$emit('imgAdd', this.img_file[1][0], $file);
            },
            $imgAdd($e){
		// 新增加
		this.$imgFileAdd($e.target.files[0]);
            },
            $imgDel(pos){
		this.$emit('imgDel', this.img_file[pos][0]);
		this.img_file.splice(pos, 1);
            },
            $imgDelByFilename(filename) {
		var pos = 0;
		while(this.img_file.length > pos) {
                    if(this.img_file[pos][0] == filename) {
			this.$emit('imgDel', filename);
			this.img_file.splice(pos, 1);
			return true;
                    }
                    pos += 1;
		}
		return false;
            },
            $imgAddByFilename(filename, $file) {
		for(var i = 0;i < this.img_file.length;i++)
                    if(this.img_file[i][0] == filename) return false;
		this.img_file[0][0] = filename;
		this.img_file[0][1] = $file;
		this.img_file.unshift(['./' + (this.num), null])
		this.$emit('imgAdd', this.img_file[1][0], $file, false);
		return true;
            },
            $imgAddByUrl(filename, $url) {
		for(var i = 0;i < this.img_file.length;i++)
                    if(this.img_file[i][0] == filename) return false;
		this.img_file[0][0] = filename;
		this.img_file[0][1] = $url;
		this.img_file.unshift(['./' + (this.num), null])
		return true;
            },
            $imgUpdateByFilename(filename, $file) {
		for(var i = 0;i < this.img_file.length;i++) {
                    if(this.img_file[i][0] == filename) {
			this.img_file[i][1] = $file;
			this.$emit('imgAdd', filename, $file, false);
			return true;
                    }
		}
		return false;
            },
            // 工具栏功能图标click-----------------
            $clicks(_type) {
		if(_type == "imagelink"){
                    this.open = true;
		}
		else {
                    // 让父节点来绑定事件并
                    this.$emit('toolbar_left_click', _type);
		}
            },
            handleClose(e){
		this.open = false;
            }
	},
        template: temp
    }
});
