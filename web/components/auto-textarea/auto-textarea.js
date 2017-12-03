define(['text!./auto-textarea.html'], function (temp) {
    return {
	
 data() {
            return {
                temp_value: (() => {
                    return this.value;
                })(),
                s_autofocus: (() => {
                    if (this.autofocus) {
                        return 'autofocus'
                    } else {
                        null
                    }
                })()
            };
        },
        created() {
        },
        props: {
            autofocus: {
                type: Boolean,
                default: false
            },
            value: {
                type: String,
                default: ''
            },
            placeholder: {
                type: String,
                default: ''
            },
            border: {
                type: Boolean,
                default: false
            },
            resize: {
                type: Boolean,
                default: false
            },
            onchange: {
                type: Function,
                default: null
            },
            fontSize: {
                type: String,
                default: '14px'
            },
            lineHeight: {
                type: String,
                default: '18px'
            }
        },
        methods: {
            change($event) {
                if (this.onchange) {
                    this.onchange(this.temp_value , $event)
                }
            }
        },
        watch: {
            value: function (val, oldVal) {
                this.temp_value = val
            },
            temp_value: function (val, oldVal) {
                this.$emit('input' , val)
            }
        },
        template: temp
    }
});
