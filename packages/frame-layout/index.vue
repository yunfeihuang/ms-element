<template>
  <div :class="['ms-frame-layout']">
    <div
      class="ms-frame-layout--aside"
      :class="{'is-collapse': isCollapse}"
      :style="{backgroundColor: menuProps ? menuProps.backgroundColor : ''}">
      <div
        v-if="$slots['logo'] || $scopedSlots['logo']"
        class="ms-frame-layout--logo">
        <slot name="logo" v-bind="{isCollapse:isCollapse}"></slot>
      </div>
      <div class="ms-frame-layout--menu ms-scroller">
        <slot v-if="$slots['menu']" name="menu" v-bind="{isCollapse:isCollapse}"></slot>
        <el-menu
          class="ms-frame-layout--menus"
          :collapse="isCollapse"
          :router="true"
          :default-active="$route.path"
          v-bind="menuProps">
          <template v-for="(item,index) in _menus">
            <el-submenu
              v-if="item.options"
              :index="item.index || item.title"
              :key="index"
              popper-class="ms-frame-layout--submenu">
              <template slot="title">
                <template v-if="item.icon">
                  <div style="display:inline" v-if="item.icon.indexOf('</i>')>-1" v-html="item.icon"></div>
                  <i v-else :class="item.iconClass || iconClass" v-html="item.icon"></i>
                </template>
                <i v-else :class="item.iconClass || iconClass"></i>
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
                  <i v-else :class="item.iconClass || iconClass" v-html="item.icon"></i>
                </template>
                <i v-else :class="item.iconClass || iconClass"></i>
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
          align="middle">
          <i v-if="asideCollapse" title="收起/展开左侧菜单" class="ms-frame-layout--collapse" :class="!isCollapse ? 'el-icon-s-fold': 'el-icon-s-unfold'"  @click="isCollapse=!isCollapse"></i>
          <template v-if="!$slots['header']">
            <el-col>
              <slot name="title" v-if="$slots['title']"></slot>
              <div class="ms-frame-layout--title" v-else>{{title}}</div>
            </el-col>
            <slot name="nav"></slot>
          </template>
          <slot v-else name="header"></slot>
        </el-row>
        <div class="ms-frame-layout--tabs" v-if="isTabs && apps.length">
          <el-tabs :value="currentAppIndex + ''" @tab-click="handleTab" editable @edit="handleTabsEdit">
            <el-tab-pane v-for="(item,index) in apps" :label="item.title" :name="index + ''" :key="index + item.route.path"></el-tab-pane>
          </el-tabs>
          <i class="el-icon-refresh ms-frame-layout--tabs-action" title="刷新" @click="refresh"></i>
          <el-dropdown trigger="click" @command="handleCommand">
            <i class="el-icon-arrow-down ms-frame-layout--tabs-action" title="更多"></i>
            <el-dropdown-menu slot="dropdown">
              <!--
              <el-dropdown-item command="refresh">刷新当前页签</el-dropdown-item>
              -->
              <el-dropdown-item command="all">关闭所有页签</el-dropdown-item>
              <el-dropdown-item command="other" :disabled="apps.length == 1">关闭其他页签</el-dropdown-item>
              <el-dropdown-item :disabled="currentAppIndex ==  0" command="left">关闭左边页签</el-dropdown-item>
              <el-dropdown-item :disabled="currentAppIndex == apps.length - 1" command="right">关闭右边页签</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="ms-frame-layout--body">
        <slot v-if="$slots['default'] || $scopedSlots['default']" v-bind="{include: keepAliveInclude, routerViewKey: routerViewKey}"></slot>
        <template v-else>
          <keep-alive :include="keepAliveInclude" :exclude="keepAliveExclude">
            <router-view class="ms-frame-layout--slot ms-scroller" ref="routerView" v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view class="ms-frame-layout--slot ms-scroller" :key="routerViewKey" v-if="!$route.meta.keepAlive"></router-view>
        </template>
      </div>
    </div>
    <slot name="other"></slot>
  </div>
</template>

<script>
let routerFromTab = false
let replaceRoute = false
export default {
  componentName: 'MsFrameLayout',
  provide () {
    return {
      'msFrameLayout': this
    }
  },
  props: {
    isTabs: {
      type: Boolean,
      default: true
    },
    defaultRoute: {
      type: [Object],
      default () {
        return {
          path: '/'
        }
      }
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
      default: 'el-icon-folder'
    },
    asideCollapse: {
      type:Boolean,
      default: true
    },
    refreshRoute: {
      default () {
        return {
          path: '/refresh',
          component: {
            beforeRouteEnter (to, from, next) {
              next(vm => {
                vm.$nextTick(() => {
                  vm.$router.replace(from)
                })
              })
            },
            template: `<div></div>`
          }
        }
      }
    },
    keepAliveExclude: {
      type: Array
    }
  },
  watch: {
    $route (value) {
      // console.log('route', value)
      this.pushRouterViewInclude(this.getRouteInclude(value))
      if (this.isTabs) {
        let _replaceRoute = replaceRoute
        if (replaceRoute) {
          replaceRoute = false
        }
        if (_replaceRoute && this.currentApp) {
          this.currentApp.title = this.getAppTitle(value)
          this.currentApp.route = value
          this.apps = [...this.apps]
        } else {
          if (value.matched && value.matched.length) {
            let app = this.apps.find(item => {
              if (item.route.path === value.path) {
                return true
              }
              if (item.route.matched.length == value.matched.length && item.route.matched.length > 1) {
                return item.route.matched.every((item2,i) => {
                  if (i < value.matched.length - 1) {
                    return item2 == value.matched[i]
                  }
                  return true
                })
              }
              return false
            })
            if (app) {
              app.route = value
              let title = this.getAppTitle(value)
              title && (app.title = title)
              this.currentApp = app
              this.refreshRouterViewInclude(value)
            } else {
              this.createRouter(value)
            }
          }
        }
      }
    },
    apps (value) {
      let apps = value.map(item => {
        let {route, vm, title} = item
        let {matched, ...others} = route
        return {
          title,
          vm: {
            show: vm.show
          },
          route: others
        }
      })
      sessionStorage.setItem('--ms-apps', JSON.stringify(apps))
    }
  },
  data () {
    let apps = sessionStorage.getItem('--ms-apps') ? JSON.parse(sessionStorage.getItem('--ms-apps')) : []
    apps.forEach(item => {
      item.route = this.$router.resolve(item.route.fullPath).resolved
    })
    return {
      apps,
      isCollapse: document.ontouchstart !== undefined,
      keepAliveInclude: [],
      routerViewKey: Math.random().toString(36)
    }
  },
  computed: {
    currentAppIndex () {
      let index = this.apps.findIndex(item => item.vm.show)
      return index > -1 ? index : 0
    },
    currentApp: {
      get () {
        return this.apps.find((item) => {
          if (item.vm) {
            if (item.vm.show) {
              return true
            }
          }
          return false
        })
      },
      set (value) {
        this.apps.forEach((item) => {
          if (item.vm) {
            item.vm.show = value === item
          }
          if (value === item && item.route.path !== this.$route.path && this.$route.matched.length === 1) {
            this.$router.push(item.route)
          }
        })
      }
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
    }
  },
  mounted () {
    window.top !== window && document.body.classList.add('is-iframe')
    if (this.isTabs) {
      const originalReplace = this.$router.replace
      this.$router.replace = function replace (location, onResolve, onReject) {
        return originalReplace.call(this, location, () => {
          replaceRoute = true
          onResolve && onResolve()
        }, onReject)
      }
      this.$router.afterEach((to, from) => {
        let app = this.getAppByPath(from.path)
        if (app) {
          app.route = from
        }
      })
      this.refreshRoute && this.$router.addRoutes([this.refreshRoute])
    }
  },
  methods: {
    getRouteInclude (route) {
      let result = []
      if (route.meta && route.meta.keepAlive && route.matched.length) {
        route.matched.forEach(item => {
          Object.values(item.components).forEach(component => {
            component.name && result.indexOf(component.name) == -1 && result.push(component.name)
          })
        })
      }
      return result
    },
    pushRouterViewInclude (value) {
      if (value.length) {
        let include = [
          ...this.keepAliveInclude,
          ...value.filter(item => this.keepAliveInclude.indexOf(item) == -1)
        ]
        if (JSON.stringify(include) !== JSON.stringify(this.keepAliveInclude)) {
          this.keepAliveInclude = include
        }
      }
    },
    removeRouterViewInclude (route) {
      let include = this.getRouteInclude(route)
      if (include.length && !routerFromTab) {
        this.keepAliveInclude = this.keepAliveInclude.filter(item => include.indexOf(item) == -1)
      }
      return include
    },
    refreshRouterViewInclude (route) {
      let include = this.removeRouterViewInclude(route)
      if (include.length && !routerFromTab) {
        this.$nextTick(() => {
          this.keepAliveInclude = [
            ...this.keepAliveInclude,
            ...include
          ]
        })
      }
    },
    createRouter (value) {
      this.pushApp({
        vm: {show: false},
        title: this.getAppTitle(value),
        route: value
      })
    },
    getAppTitle (value) {
      return value.meta && value.meta.title ? typeof value.meta.title === 'function' ? value.meta.title(value) : value.meta.title : value.fullPath
    },
    getAppByPath (path) {
      return this.apps.find(item => {
        return item.route.path === path
      })
    },
    pushApp (value) {
      let apps = []
      let currentApp = this.currentApp
      if (currentApp) {
        for (let i = 0; i < this.apps.length; i++) {
          apps.push(this.apps[i])
          if (i === this.currentAppIndex) {
            apps.push(value)
          }
        }
        this.apps = apps
      } else {
        this.apps = [value]
      }
      this.currentApp = value
    },
    refresh () {
      if (this.$route && this.$route.meta && this.$route.meta.keepAlive) {
        this.removeRouterViewInclude(this.$route)
        this.$router.replace({
          path: '/refresh'
        })
      } else {
        this.routerViewKey = Math.random().toString(36)
      }
    },
    routerPush (...arg) {
      routerFromTab = true
      return this.$router.push(...arg).finally(() => {
        routerFromTab = false
      })
    },
    removeApp (value) {
      if (value.route && value.route.matched.length) {
        let include = [...this.keepAliveInclude]
        value.route.matched.forEach(item => {
          Object.values(item.components).forEach(component => {
            component.name && (include = include.filter(item => item !== component.name))
          })
        })
        if (JSON.stringify(include) !== JSON.stringify(this.keepAliveInclude)) {
          this.keepAliveInclude = include
        }
      }
      let apps = [...this.apps]
      let index = apps.findIndex(item => item === value)
      apps = apps.filter(item => item !== value)
      let currentApp = null
      if (index === this.currentAppIndex) {
        if (apps[index]) {
          currentApp = apps[index]
        } else if (apps[index - 1]) {
          currentApp = apps[index - 1]
        }
      }
      this.apps = apps
      currentApp && this.routerPush(currentApp.route)
    },
    handleTab (tab) {
      let app = this.apps[parseInt(tab.name)]
      this.routerPush(app.route)
    },
    handleTabsEdit (targetName, action) {
      if (action === 'remove') {
        if (this.apps.length === 1) {
          this.handleCommand('all')
        } else {
          let app = this.apps[parseInt(targetName)]
          app && this.removeApp(app)
        }
      }
    },
    handleCommand (value) {
      if (value === 'refresh') {
        this.refresh()
      } else if (value === 'all') {
        this.apps = this.apps.filter(item => {
          if (this.defaultRoute && this.defaultRoute.path === item.route.path) {
            return true
          } else {
            return false
          }
        })
        if (this.apps && this.apps[0]) {
          this.currentApp = this.apps[0]
          this.routerPush(this.currentApp.route)
        } else {
          this.defaultRoute && this.$router.push(this.defaultRoute)
        }
      } else if (value === 'other') {
        this.apps = this.apps.filter(item => {
          return item === this.currentApp
        })
        this.currentApp = this.apps[0]
      } else if (value === 'left') {
        this.apps = this.apps.filter((item, index) => {
          if (index < this.currentAppIndex) {
            return false
          }
          return true
        })
        this.currentApp = this.apps[0]
      } else {
        this.apps = this.apps.filter((item, index) => {
          if (index > this.currentAppIndex) {
            return false
          }
          return true
        })
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
    }
    &--menu{
        flex:1;
        min-width: 0;
        margin-top:5px;
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
      display:flex;
      align-items: center;
      &-action{
        padding: 10px;
        cursor: pointer;
        font-size:1.3em;
      }
      .el-tabs{
        flex:auto;
        min-width: 0;
        &__header{
          margin-bottom:0;
        }
        &__new-tab{
          display:none;
          visibility: hidden;
          margin:9px 0 9px 10px;
        }
        &__nav-next,&__nav-prev{
          padding-top:4px;
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
    &--slot{
      background-color:$--color-white;
      height: 100%;
      box-sizing: border-box;
      position: absolute;
      width: 100%;
      padding-right: 10px;
      border: 10px solid transparent;
      border-right:0;
      left:0;
      top:0;
      background-clip: content-box;
    }
  }
  .is-iframe{
    .ms-frame-layout--aside,.ms-frame-layout--header{
      display:none;
    }
    .v-modal{
      background:#fff;
    }
  }
  div.ms-dialog{
    .el-dialog{
      &__body{
        padding:0;
        max-height: 90vh;
        overflow:auto;
        position: relative;
        iframe{
          width:100%;
          height:80vh;
          display: block;
        }
      }
      &__header{
        padding:10px;
        border-bottom:1px solid $--border-color-base;
        line-height:1;
      }
      &__title{
        line-height:1;
        font-size: 1.3em;
      }
      &__headerbtn{
        top: 7px;
        right: 10px;
      }
      &__close{
        font-size:22px;
      }
    }
  }
  div.ms-preview{
    background:transparent;
    display:table;
    user-select:none;
    .el-dialog{
      &__body{
        text-align:center;
        display:table-cell;
        vertical-align:middle;
        padding:0;
      }
      &__header{
        padding:0;
      }
      &__close{
        font-size:3rem;
        color:#fff;
        text-shadow:0 0 3px rgba(0,0,0,0.3);
      }
      &__headerbtn{
        z-index: 10;
      }
      &__title{
        display:none
      }
    }
    .swiper-container{
      height:100%;
      width:100vw;
    }
    img{
      max-width:100vw;
      max-height:100vh;
      transform: translate(-50%,-50%);
      position:absolute;
      top:50%;
      left:50%;
    }
  }
</style>
