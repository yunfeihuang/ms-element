<template>
  <div :class="['ms-frame-layout',`ms-frame-layout--theme-${theme}`]"
    :style="{backgroundColor: theme=='dark' ? backgroundColor : ''}">
    <div class="ms-frame-layout--aside" :style="asideStyle" :class="{'is-collapse': isCollapse}">
      <div
        v-if="$slots['logo'] || $scopedSlots['logo']"
        title="收起/展开左侧菜单"
        class="ms-frame-layout--logo">
        <slot name="logo" v-bind="{isCollapse:isCollapse}"></slot>
      </div>
      <div class="ms-frame-layout--aside-inner scroller">
        <slot v-if="$slots['aside']" name="aside" v-bind="{isCollapse:isCollapse}"></slot>
        <el-menu
          class="ms-frame-layout--menus"
          :collapse="isCollapse"
          :router="true"
          :default-active="$route.path"
          v-bind="_menuProps">
          <template v-for="(item,index) in _menus">
            <el-submenu
              v-if="item.options"
              :index="item.index || item.title"
              :key="index"
              popper-class="ms-frame-layout--submenu">
              <template slot="title">
                <template v-if="item.icon">
                  <div style="display:inline" v-if="item.icon.indexOf('</i>')>-1" v-html="item.icon"></div>
                  <i v-else :class="iconClass" v-html="item.icon"></i>
                </template>
                <i v-else></i>
                <span slot="title">{{item.title}}</span>
              </template>
              <el-menu-item v-for="child in item.options"
                :route="child.route"
                :index="child.index"
                :key="child.index">
                  {{child.title}}
              </el-menu-item>
            </el-submenu>
            <el-menu-item
              v-else
              class="el-submenu__title"
              :route="item.route"
              :index="item.index"
              :key="item.index">
                <template v-if="item.icon">
                  <div style="display:inline" v-if="item.icon.indexOf('</i>')>-1" v-html="item.icon"></div>
                  <i v-else :class="iconClass" v-html="item.icon"></i>
                </template>
                <i v-else></i>
                <span>{{item.title}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
    </div>
    <div class="ms-frame-layout--content">
      <div class="ms-frame-layout--header">
        <el-row
          type="flex"
          align="middle" :style="headerStyle">
          <i class="ms-frame-layout--collapse" :class="!isCollapse ? 'el-icon-s-fold': 'el-icon-s-unfold'"  @click="isCollapse=!isCollapse"></i>
          <template v-if="!$slots['header']">
            <el-col>
              <slot name="title" v-if="$slots['title']"></slot>
              <div class="ms-frame-layout--title" v-else>{{title}}</div>
              <div v-if="breadcrumb" :key="$route.path" class="ms-frame-layout--breadcrumb"></div>
            </el-col>
            <slot name="nav"></slot>
          </template>
          <slot v-else name="header"></slot>
        </el-row>
        <div class="ms-frame-layout--tabs" v-if="pages.length">
          <el-tabs :value="active" @tab-click="handleTab" editable @edit="handleTabsEdit">
            <el-tab-pane v-for="(item,index) in pages" :label="item.route.meta.title" :name="item.resolvePath" :key="index"></el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="ms-frame-layout--body scroller">
        <slot v-if="!isTabs"></slot>
        <!--
        <component v-for="(item,index) in tabs" :key="index" :is="item.matched[0].components.default" v-show="item == tab"></component>
        -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  componentName: 'MsFrameLayout',
  props: {
    isTabs: {
      type: Boolean,
      default: true
    },
    title: {
      type: String
    },
    menus: {
      type: Array
    },
    menuProps: {
      type: Object
    },
    iconClass: {
      default: 'iconfont'
    },
    theme: {
      type: String,
      default: 'default'
    },
    backgroundColor: {
      type: String
    },
    breadcrumb: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    $route (value) {
      this.pageChange(value)
    }
  },
  data () {
    return {
      pages: [],
      isCollapse: document.ontouchstart !== undefined
    }
  },
  computed: {
    active () {
      if (this.pages.length) {
        let item = this.pages.find(item => item && item.vm && item.vm.show)
        if (item) {
          return item.resolvePath
        }
      }
      return null
    },
    _menus () {
      return this.menus.map(item => {
        if (item.route) {
          item.index = item.route.path ? item.route.path : item.route
        }
        if (item.options) {
          item.options = item.options.map(item2 => {
            if (item2.route) {
              item2.index = item2.route.path ? item2.route.path : item2.route
            }
            return item2
          })
        }
        return item
      })
    },
    _menuProps () {
      let result = this.menuProps || {}
      if (this.theme === 'dark') {
        result = {
          textColor: '#f5f5f5',
          activeTextColor: '#fff',
          ...this.menuProps,
          backgroundColor: this.backgroundColor
        }
      }
      return result
    },
    asideStyle () {
      return {
        color: this._menuProps.textColor
      }
    },
    headerStyle () {
      if (this.theme.indexOf('dark') > -1) {
        return {
          color: '#fff',
          backgroundColor: this.backgroundColor
        }
      }
      return {}
    }
  },
  mounted () {
    if (window.top !== window) {
      document.body.classList.add('is-iframe')
    }
  },
  methods: {
    pageChange (value) {
      let pages = [...this.pages]
      if (value.matched && value.matched.length) {
        if (pages.every(item => item.route.path !== value.path)) {
          let el = document.createElement('div')
          this.$el.querySelector('.ms-frame-layout--body').appendChild(el)
          let router = new window.Router({
            routes: this.$router.options.routes.filter(item => item.path === value.path)
          })
          router.beforeEach((to, from, next) => {
            if (to.path === from.path) {
              pages.forEach(item => {
                if (item.vm && item.vm.show) {
                  item.route = to
                }
              })
            }
            next()
          })
          var $vm = new window.Vue({ // eslint-disable-line
            el,
            router: router,
            store: this.$store,
            template: `<router-view class="page-router-view" :class="{'is-active': show}"></router-view>`,
            mounted () {
              this.$emit('ready')
            },
            watch: {
              show (value) {
                this.$emit(value ? 'show' : 'hidden')
              }
            },
            data () {
              return {
                show: true
              }
            },
            destroyed () {
              this.$el.parentNode.removeChild(this.$el)
            }
          })
          let index = 0
          let currentPage = pages.find((item, i) => {
            if (item.vm.show) {
              index = i
            }
            return item.vm.show
          })
          let addPage = {
            vm: $vm,
            route: value,
            resolvePath: value.path.replaceAll('/', '__')
          }
          if (currentPage) {
            currentPage.vm.show = false
            if (pages.length > 1) {
              pages[index] = [currentPage, addPage]
              this.pages = pages.flat()
            } else {
              pages.push(addPage)
              this.pages = pages
            }
          } else {
            this.pages = [addPage]
          }
        } else {
          this.pageVisibleChange(value.path)
        }
      }
    },
    pageVisibleChange (path) {
      this.pages.forEach(item => {
        let is = item.route.path === path
        if (item.vm) {
          item.vm.show = is
        }
      })
      console.log('this.pages', this.pages)
    },
    pageRemove (path) {
      let index = 0
      let vm = null
      let active = null
      let pages = this.pages.filter((item, i) => {
        if (item.resolvePath === path) {
          vm = item.vm
          index = i
          return false
        } else {
          return true
        }
      })
      if (pages[index]) {
        active = pages[index].route.path
      } else if (pages[pages.length - 1]) {
        active = pages[pages.length - 1].route.path
      }
      this.pages = pages
      this.pageVisibleChange(active)
      vm && vm.$destroy && vm.$destroy()
    },
    handleTab (tab, event) {
      this.pages.forEach(item => {
        if (item.resolvePath === tab.name) {
          this.$router.push(item.route)
        }
      })
    },
    handleTabsEdit (targetName, action) {
      if (action === 'remove') {
        this.pageRemove(targetName)
      }
    }
  }
}
</script>
<style lang="scss">
  .ms-frame-layout{
    display:flex;
    height:100%;
    width: 100%;
    position:absolute;
    background-color: $frame-layout--theme-color;
    &--logo{
      text-align:center;
      height:$frame-layout--logo-height;
      cursor: pointer;
      box-sizing: border-box;
      display:flex;
      img{
        max-width:100%;
        max-height:100%;
        margin:auto;
      }
      i{
        color:$--color-primary;
        margin:auto;
      }
    }
    &--aside{
      display:flex;
      flex-direction:column;
      width:$frame-layout--aside-width;
      transition: width 0.3s ease 0s;
      box-shadow:0 0 3px rgba(0, 0, 0, 0.15);
      position:relative;
      z-index:10;
      &.is-collapse{
        width:$frame-layout--aside-collapse-width;
      }
      &-inner{
        flex:1;
        min-width: 0;
        margin-top:5px;
      }
    }
    &--content{
      flex: 1;
      min-width: 0;
      position:relative;
      display:flex;
      height:100%;
      width: 100%;
      flex-direction: column;
    }
    &--header{
      box-shadow:3px 0 3px rgba(0, 0, 0, 0.15);
      position:relative;
      z-index:10;
      min-height:$frame-layout--header-height;
      margin-left:1px;
      background:#fff;
      .el-dropdown{
        color:inherit;
      }
    }
    &--collapse{
      font-size: 1.8em;
      color:#999;
      margin: 0 10px;
      cursor: pointer;
    }
    &--tabs{
      background:#fff;
      padding-left:20px;
      border-top:1px solid #f5f5f5;
      .el-tabs{
        &__header{
          margin-bottom:0;
        }
        &__new-tab{
          display:none;
        }
        &__nav-wrap::after{
          display: none;
        }
        &__item{
          line-height: 38px;
          height:38px;
          .el-icon-close{
            opacity: 0;
            position: absolute;
            right: 0;
            margin-top:-7px;
            top: 50%;
            font-size:14px;
          }
          &:hover, &.is-active{
            .el-icon-close{
              opacity: 1;
            }
          }
          &:last-child{
            padding-right:20px!important;
          }
        }
      }
    }
    &--title{
      font-size:18px;
      font-weight: normal;
      line-height:$frame-layout--header-height;
      display:inline-block;
      vertical-align:middle;
      padding-left:10px;
    }
    &--body{
      position:relative;
      flex: 1;
      min-width: 0;
      background:$--background-color-base;
    }
    &--menus{
      width:100%;
      border-right:0;
      .el-menu{
        &--collapse{
          .el-submenu{
            &.is-active{
              background:$--color-primary!important;
            }
            &.is-opened{
              i{
                color:inherit!important;
              }
            }
          }
        }
      }
      .el-menu-item{
        &.is-active{
          background:$--color-primary;
          color:#fff;
        }
      }
      .el-submenu{
        .el-menu-item{
          min-width:0;
          height: 3rem;
          line-height: 3rem;
          text-indent:5px;
          &.is-active{
            background:$--color-primary;
            color:#fff;
          }
        }
        &__title{
          height: 3.2rem;
          line-height: 3.2rem;
          i{
            font-size:1.4rem;
            margin-right: 5px;
            width: 20px;
            display: inline-block;
            font-style:normal;
            &:first-child{
              &:empty{
                text-align:center;
                &:before{
                  content: '⚪';
                  font-size:1.1em;
                }
              }
            }
          }
        }
      }
    }
    &--submenu{
      .el-menu{
        &-item{
          color:inherit;
          padding-top:12px;
          padding-bottom:12px;
          height:auto;
          line-height: normal;
          font-size:inherit;
        }
        &--popup{
          border:1px solid $--border-color-base;
          box-shadow:0 0 10px rgba(0,0,0,0.1);
        }
      }
      .el-submenu{
        &__title{
          height:auto;
          line-height: normal;
          padding-top:12px;
          padding-bottom:12px;
        }
      }
    }
    &--menu-icon{
      display:inline-block;
    }
  }
  .is-iframe{
    .ms-frame-layout--aside,.ms-frame-layout--header{
      display:none;
    }
    .ms-page-list-layout{
      border:0;
    }
  }
  .page-router-view{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    visibility: hidden;
    overflow:hidden;
    box-sizing: border-box;
    &.is-active{
      visibility: visible;
      z-index: 1;
      overflow:visible;
    }
  }
</style>
