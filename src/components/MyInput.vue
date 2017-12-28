<template>
    <div class="input" :id='id' :class='classes'>
        <div class='input_info'>
            <slot></slot>
        </div>
        <div  class='input_main'>
            <template v-if="type === 'bool'">
                <i-switch size='super' v-model='the_value' @input='update' style="float: right;"></i-switch>
            </template>
            <template v-else-if="type === 'text'">
                <Input size='large' v-model='the_value' @input='update'>
                    <span v-if='prepend' slot="prepend">{{prepend}}</span>
                    <span v-if='append' slot="append">{{append}}</span>
                </Input>
            </template>
            <template v-if="type === 'select'">
                <Select v-model='the_value' @input='update'>
                    <Option v-for='(option, index) in options' :value='option.value' :key='index'>
                        {{option.label}}
                    </Option>
                </Select>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    props: ['id', 'value', 'type', 'classes', 'prepend', 'append', 'options', 'index'],
    data: function () {
        return {
            the_value: this.value
        }
    },
    methods: {
        update: function () {
            if (this.type === 'bool') {
                this.$emit('input', Boolean(this.the_value), this.index)
            }
            else if (this.type === 'text') {
                this.$emit('input', Number(this.the_value), this.index)
            }
            else if (this.type === 'select') {
                this.$emit('input', this.the_value, this.index)
            }
        }
    },
    watch: {
        value: function (value) {
            this.the_value = value
        }
    }
}
</script>

<style>
.input{
    width: 250px;
    height: 60px;
    border-bottom: 2px solid #657180;
    border-top: 2px solid #657180;
    padding: 8px;
}
.input_info {
    float: left;
    height: 100%;
    width: 50%;
    display: flex;
    align-items: center;
    font-size: 18px;
}
.input_main {
    float: right;
    width: 100px;
}
</style>


