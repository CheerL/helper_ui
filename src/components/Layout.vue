<template>
    <div class="layout"
        @mousedown='start($event)'
        @mouseup='end($event)'
        @touchstart='start($event)'
        @touchmove='move($event)'
    >
        <div  class='layout-menu' :style='menu_style' v-show='menu_show'>
            <LayoutMenu></LayoutMenu>
        </div>
        <div class='layout-main center' :style='main_style'>
            <div class='layout-show-button center' :style='button_style' v-show='button_show' @click.stop='show'>
                <template v-if='!menu_show'>
                    <Icon type="chevron-right" color='white'></Icon>
                </template>
                <template v-else>
                    <Icon type="chevron-left" color='white'></Icon>
                </template>
            </div>
            <LayoutMain></LayoutMain>
        </div>
        <template v-if='button_show && menu_show'>
            <div class="layout-show-mask" @click.stop='show'></div>
        </template>
    </div>
</template>

<script>
import LayoutMenu from './LayoutMenu'
import LayoutMain from './LayoutMain'
import _ from 'lodash'
import { mapMutations, mapActions } from 'vuex'


export default {
    data: function () {
        window._main = this
        return {
            state: this.$store.state.main,
            menu_show: false,
            button_show: false,
            
            menu_style: {
                width: 0
            },
            main_style: {
                width: '100%'
            },
            button_style: {
                left: 0
            }
        }
    },
    components: {
        LayoutMenu,
        LayoutMain
    },
    methods: {
        ...mapMutations({
            _size: 'size'
        }),
        change_size: function(width) {
            if (width < 768) {
                this._size('xs')
            }
            else if (width < 992) {
                this._size('sm')
            }
            else if (width < 1200) {
                this._size('md')
            }
            else {
                this._size('lg')
            }
        },
        resize: _.debounce(
            function () {
                var width = document.documentElement.clientWidth
                this.change_size(width)
                if (this.size == 'xs' || !this.is_login) {
                    var menu_width = 0
                }
                else {
                    var menu_width = 130
                }
                var main_width = width - menu_width
                this.menu_show = menu_width ? true : false
                this.button_show = (menu_width || !this.is_login) ? false : true
                this.menu_style.width = menu_width + 'px'
                this.main_style.width = main_width + 'px'

                if (this.button_show) {
                    this.menu_style.position = ''
                    this.button_style.left = '0px'
                }
            },
            25
        ),
        show: function () {
            if (this.size == 'xs') {
                if (!this.menu_show) {
                    this.menu_show = true
                    this.menu_style.position = 'absolute'
                    this.menu_style.width = '130px'
                    this.button_style.left = '130px'
                }
                else {
                    this.menu_show = false
                    this.menu_style.position = ''
                    this.menu_style.width = '0px'
                    this.button_style.left = '0px'
                }
            }
        },
        start: event => {
            if (event.pageX) {
                this._start_x = event.pageX
                this._start_y = event.pageY
            }
            else {
                this._start_x = event.targetTouches[0].pageX
                this._start_y = event.targetTouches[0].pageY
            }
        },
        move: event => {
            this._end_x = event.targetTouches[0].pageX
            this._end_y = event.targetTouches[0].pageY
            var move_x = this._end_x - this._start_x
            var move_y = this._end_y - this._start_y
            
            if (Math.abs(move_x) > Math.abs(move_y) && (this._end_x - this._start_x) * (_main.menu_show? -1: 1) > 50) {
                this._add = true
                _main.$el.addEventListener('touchend', _main.end)
            }
            else if (this._add) {
                this._add = false
                _main.$el.removeEventListener('touchend', _main.end)
            }
        },
        end: event => {
            if (event.type == 'mouseup') {
                this._end_x = event.pageX
                this._end_y = event.pageY
                var move_x = this._end_x - this._start_x
                var move_y = this._end_y - this._start_y

                if (Math.abs(move_x) > Math.abs(move_y) && (this._end_x - this._start_x) * (_main.menu_show? -1: 1) > 100) {
                    _main.show()
                    this._start_x = null
                    this._end_x = null
                }
            }
            else if (event.type == 'touchend') {
                _main.show()
                this._start_x = null
                this._end_x = null
                if (event.type == 'touchend') {
                    this._add = false
                    _main.$el.removeEventListener('touchend', _main.end)
                }
            }
        },
    },
    computed: {
        is_login () {
            return this.state.is_login
        },
        size () {
            return this.state.size
        }
    },
    mounted: function () {
        this.resize()
        window.addEventListener('resize', this.resize)
    },
    beforeDestroy: function () {
        window.removeEventListener('resize', this.resize)
    },
    watch: {
        is_login (val) {
            this.resize()
        }
    }
}
</script>

<style>
html {
    overflow: hidden;
    font-size: 14px;
}

.layout {
    position: absolute;
    background: #f5f7f9;
    height: 100%;
    width: 100%;
}

.layout-menu {
    float: left;
    height: 100%;
    background: #626362;
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 10;
}

.layout-main {
    position: relative;
    float: left;
    height: 100%;
    z-index: 0;
}

.layout-show-button{
    height: 50px;
    width: 20px;
    float: left;
    z-index: 100;
    position: absolute;
    background: #626362;
}

.layout-show-mask{
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 5;
}

.center {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    /*align-content: center;*/
}
</style>