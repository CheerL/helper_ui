<template>
    <div class='setting center'>
        <Row type='flex' justify="center" :gutter='16'>
            <Col :xs='22' :sm='10'>
                <div class="setting-list">
                    <div class='setting-item center' v-for='(setting, index) in bool_list' :key='index'>
                    <MyInput  type='bool' :value="setting.value" @input='bool_item_change' :index='index'>
                        <slot>{{setting.text}}</slot>
                    </MyInput>
                    </div>
                </div>
            </Col>
            <Col :xs='22' :sm='10'>
                <div class="setting-list">
                    <div class='setting-item center' v-for='(setting, index) in text_list' :key='index'>
                    <MyInput type='text' :value="setting.value" @input='text_item_change' :index='index' append='分钟'>
                        <slot>{{setting.text}}</slot>
                    </MyInput>
                    </div>
                <div v-show='bool_list.FLEXIBLE.value' class='setting-item center' v-for='(setting, index) in select_list' :key='index'>
                    <MyInput type='select' :value="setting.value" @input='select_item_change' :index='index' :options='setting.option_list'>
                        <slot>{{setting.text}}</slot>
                    </MyInput>
                </div>
                </div>
            </Col>
        </Row>
        <div class="center">
            <MyButton classes='setting-button' color='limegreen' @click='save_change'>确认修改</MyButton>
        </div>
    </div>
</template>

<script>
import MyInput from './MyInput'
import MyButton from './MyButton'
import $ from 'jquery'
import { mapMutations, mapActions } from 'vuex'

export default {
    components: {
        MyInput,
        MyButton
    },
    data: function () {
        window._setting = this
        return {
            state: this.$store.state.setting,
            unsave: false,
            on_leave: false,
            ori_bool_list: null,
            ori_text_list: null,
            ori_select_list: null
        }
    },
    computed: {
        bool_list:  () => _setting.state.bool_list,
        text_list:  () => _setting.state.text_list,
        select_list:  () => _setting.state.select_list,
    },
    methods: {
        ...mapMutations([
            'setting_item_change',
            'setting_list_change',
            'setting_last'
        ]),
        ...mapActions([
            'setting_update'
        ]),
        bool_item_change(val, index) {
            if (!this.ori_bool_list) {
                this.ori_bool_list = JSON.parse(JSON.stringify(this.state.bool_list))
                this.unsave = true
            }
            this.setting_item_change({list:'bool_list', item:index, val:val})
        },
        text_item_change(val, index) {
            if (!this.ori_text_list) {
                this.ori_text_list = JSON.parse(JSON.stringify(this.state.text_list))
                this.unsave = true
            }
            this.setting_item_change({list:'text_list', item:index, val:val})
        },
        select_item_change(val, index) {
            if (!this.ori_select_list) {
                this.ori_select_list = JSON.parse(JSON.stringify(this.state.select_list))
                this.unsave = true
            }
            this.setting_item_change({list:'select_list', item:index, val:val})
        },
        save_change () {
            if (this.unsave) {
                var res = new Object()
                var all_list = [this.bool_list, this.text_list, this.select_list]
                for (var count in all_list) {
                    for (var each in all_list[count]) {
                        res[each] = all_list[count][each].value
                    }
                }
                this.unsave = false
                $.post('/helper/setting/change/', JSON.stringify(res), function (data) {
                    if (data.res) {
                        if (!_setting.on_leave) {
                            _setting.$Modal.success({
                                title: '',
                                content: data.msg
                            })
                        }
                        _setting.ori_bool_list = null
                        _setting.ori_text_list = null
                        _setting.ori_select_list = null
                        _setting.setting_last()
                    }
                    else {
                        if (!_setting.on_leave) {
                            _setting.$Modal.error({
                                title: '',
                                content: data.msg
                            })
                        }
                        _setting.unsave = true
                    }
                })
            }
            else {
                this.$Modal.info({
                    title: '',
                    content: '没有任何修改'
                })
            }
        },
        cancel_change () {
            if (this.ori_bool_list) {
                this.setting_list_change({
                    list: 'bool_list',
                    val: this.ori_bool_list
                })
                this.ori_bool_list = null
            }
            if (this.ori_text_list) {
                this.setting_list_change({
                    list: 'text_list',
                    val: this.ori_text_list
                })
                this.ori_text_list = null
            }
            if (this.ori_select_list) {
                this.setting_list_change({
                    list: 'select_list',
                    val: this.ori_select_list
                })
                this.select_list = null
            }
            this.unsave = false
            this.on_leave = false
        },
        save_and_leave () {
            this.save_change()
            this.$router.push(this.to.path)
        },
        cancel_and_leave() {
            this.cancel_change()
            this.$router.push(this.to.path)
        },
        leave_setting () {
            this.on_leave = true
            if (this.unsave) {
                this.$Modal.confirm({
                    title: '',
                    content: '是否保存修改后的设置?',
                    okText: '是',
                    cancelText: '否',
                    onOk: this.save_and_leave,
                    onCancel: this.cancel_and_leave
                })
            }
        }
    },
    mounted () {
        this.setting_update()
    }
}


</script>

<style>
.setting {
    width: 100%;
    height: 100%;
    /*flex-direction: column;*/
    /*flex-wrap: nowrap;*/
}
.setting-list{
    margin-top: 1em;
    width: 100%;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
.setting-item{
    width: 100%;
    margin: 1em;
}
.setting-button{
    margin-top: 1em;
    margin-bottom: 2em;
    text-align: center;
    width: 7em;
}
</style>
