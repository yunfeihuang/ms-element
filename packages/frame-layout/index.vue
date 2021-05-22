<template>
  <div :class="['ms-frame-layout']">
    <div class="ms-frame-layout--aside" :class="{'is-collapse': isCollapse}">
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
        <div class="ms-frame-layout--tabs" v-if="apps.length">
          <el-tabs :value="currentAppIndex + ''" @tab-click="handleTab" editable @edit="handleTabsEdit">
            <el-tab-pane v-for="(item,index) in apps" :label="item.title" :name="index + ''" :key="index"></el-tab-pane>
          </el-tabs>
          <el-dropdown trigger="click" @command="handleCommand">
            <i class="el-icon-arrow-down ms-frame-layout--tabs-action"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="all">关闭所有页签</el-dropdown-item>
              <el-dropdown-item command="other" :disabled="apps.length == 1">关闭其他页签</el-dropdown-item>
              <el-dropdown-item :disabled="currentAppIndex ==  0" command="left">关闭左边页签</el-dropdown-item>
              <el-dropdown-item :disabled="currentAppIndex == apps.length - 1" command="right">关闭右边页签</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="ms-frame-layout--body">
        <router-view v-if="!isCreateApp" class="ms-frame-layout--slot ms-scroller"></router-view>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
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
    isCreateApp: {
      type: Boolean
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
      default: 'iconfont'
    },
    asideCollapse: {
      type:Boolean,
      default: true
    }
  },
  watch: {
    $route (value) {
      console.log('$route', value)
      if (this.isTabs) {
        if (value.matched && value.matched.length) {
          if (this.apps.every(item => {
            if (this.isCreateApp) {
              if (item.vm) {
                if (item.vm.$router) {
                  return item.vm.$router.getMatchedComponents(value.path).length === 0
                } else {
                  return item.route.path !== value.path
                }
              }
              return true
            } else {
              return value.matched.every(item2 => {
                return item.route.path !== (item2.path == '' ? value.path : item2.path)
              })
            }
          })) {
            if (this.isCreateApp) {
              this.createRouter(value)
            } else {
              if (value && value.meta && value.meta.title) {
                this.createRouter(value)
              } else {
                let currentApp = this.currentApp
                currentApp.route = value
                this.apps = [...this.apps]
              }
            }
          } else {
            let app = this.getAppByPath(value.path)
            if (app) {
              if (this.isCreateApp && app && app.vm && Object.keys(app.vm).length < 2) {
                app.vm = this.createRouterApp(value)
              }
              this.currentApp = app
              if (app.vm && app.vm.$route && app.vm.$route.fullPath !== value.fullPath && value.matched.length === 1) {
                app.vm.$router.replace({
                  path: value.path,
                  query: value.query,
                  params: value.params
                })
              }
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
    return {
      apps: sessionStorage.getItem('--ms-apps') ? JSON.parse(sessionStorage.getItem('--ms-apps')) : [],
      currentAppIndex: 0,
      isCollapse: document.ontouchstart !== undefined
    }
  },
  computed: {
    currentApp: {
      get () {
        let self = this
        return this.apps.find((item, index) => {
          if (item.vm) {
            if (item.vm.show) {
              self.currentAppIndex = index
              return true
            }
          }
          return false
        })
      },
      set (value) {
        this.apps.forEach((item, index) => {
          if (item.vm) {
            item.vm.show = value === item
          }
          if (value === item) {
            this.currentAppIndex = index
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
    // console.log('fdasfdas', this.$router.resolve('/user2'))
    if (window.top !== window) {
      document.body.classList.add('is-iframe')
    }
    if (this.isTabs) {
      if (!this.isCreateApp) {
        this.$router.beforeEach((to, from, next) => {
          let app = this.getAppByPath(from.path)
          if (app) {
            app.route = from
          }
          next()
        })
      } else {
        const Router = this.findVueRouter()
        if (Router) {
          const originalPush = Router.prototype.push
          Router.prototype.push = function push (location, onResolve, onReject) {
            if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
            return originalPush.call(this, location).catch(err => err)
          }
        }
        this.$router.beforeEach((to, from, next) => {
          if (to.path === from.path) {
            let app = this.currentApp
            app.vm.$router.push({
              path: to.path,
              params: to.params,
              query: to.query
            })
          }
          next()
        })
      }
    }
  },
  methods: {
    findVueRouter () {
      return window.Vue._installedPlugins.find(item => item.name === 'VueRouter')
    },
    createRouter (value) {
      let $vm = null
      if (this.isCreateApp) {
        $vm = this.createRouterApp(value)
      } else {
        $vm = {show: false}
      }
      this.pushApp({
        vm: $vm,
        title: value.meta && value.meta.title ? typeof value.meta.title === 'function' ? value.meta.title(value) : value.meta.title : value.fullPath,
        route: value
      })
    },
    createRouterApp (route) {
      let el = document.createElement('div')
      this.$el.querySelector('.ms-frame-layout--body').appendChild(el)
      const Router = this.findVueRouter()
      let router = new Router({
        routes: this.$router.options.routes.filter(item => {
          if (item.path === route.path) {
            return true
          } else if (item.children && item.children.length) {
            return JSON.stringify(item.children).indexOf(`"${route.path}"`) > -1
          }
          return false
        })
      })
      let self = this
      return new window.Vue({ // eslint-disable-line
        el,
        router: router,
        store: this.$store,
        template: `<router-view class="app-router-view ms-scroller" :class="{'is-active': show}"></router-view>`,
        mounted () {
          this.$router.beforeEach((to, from, next) => {
            console.log('beforeEach', to, from)
            if (!to.matched || to.matched.length === 0) {
              self.$router.push({
                path: to.path,
                params: to.params,
                query: to.query
              })
            } else {
              next()
            }
          })
          this.$router.afterEach((to, from) => {
            let app1 = self.getAppByPath(to.path)
            let app2 = self.getAppByPath(from.path)
            if (app1 && app1 === app2) {
              app1.route = to
              self.apps = [...self.apps]
            }
          })
          this.$emit('ready')
        },
        watch: {
          show (value) {
            this.$emit(value ? 'show' : 'hidden')
          }
        },
        data () {
          return {
            show: false
          }
        },
        destroyed () {
          this.$el.parentNode.removeChild(this.$el)
        }
      })
    },
    getAppByPath (path) {
      return this.apps.find(item => {
        if (item.vm && item.vm.$router) {
          return item.vm.$router.getMatchedComponents(path).length > 0
        } else {
          return item.route.path === path
        }
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
    removeApp (value) {
      let apps = [...this.apps]
      let index = apps.findIndex(item => item === value)
      apps = apps.filter(item => item !== value)
      let currentApp = null
      if (apps[index]) {
        currentApp = apps[index]
      } else if (apps[index - 1]) {
        currentApp = apps[index - 1]
      }
      this.apps = apps
      value.vm && value.vm.$destroy && value.vm.$destroy()
      currentApp && this.$router.push(currentApp.route)
    },
    handleTab (tab, event) {
      let app = this.apps[parseInt(tab.name)]
      this.$router.push(app.route)
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
      if (value === 'all') {
        this.apps = this.apps.filter(item => {
          if (this.defaultRoute && this.defaultRoute.path === item.route.path) {
            return true
          } else {
            item.vm && item.vm.$destroy && item.vm.$destroy()
            return false
          }
        })
        if (this.apps && this.apps[0]) {
          this.currentApp = this.apps[0]
        } else {
          this.defaultRoute && this.$router.push(this.defaultRoute)
        }
      } else if (value === 'other') {
        this.apps = this.apps.filter(item => {
          if (item !== this.currentApp) {
            item.vm && item.vm.$destroy && item.vm.$destroy()
          }
          return item === this.currentApp
        })
      } else if (value === 'left') {
        this.apps = this.apps.filter((item, index) => {
          if (index < this.currentAppIndex) {
            item.vm && item.vm.$destroy && item.vm.$destroy()
            return false
          }
          return true
        })
      } else {
        this.apps = this.apps.filter((item, index) => {
          if (index > this.currentAppIndex) {
            item.vm && item.vm.$destroy && item.vm.$destroy()
            return false
          }
          return true
        })
      }
    },
    updateAppTitle (vm, title) {
      let app = this.apps.find(item => item.vm === vm)
      app && (app.title = title)
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
          i{
            font-size:1.4px;
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
    &--slot{
      background-color:$--color-white;
      height: 100%;
      box-sizing: border-box;
      position:relative;
      background-clip: content-box;
      position: absolute;
      width: 100%;
      padding: 10px;
      left:0;
      top:0;
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
  .app-router-view{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    visibility: hidden;
    box-sizing: border-box;
    padding: 10px;
    background-color:$--color-white;
    background-clip: content-box;
    box-shadow: inset 0 0 0 10px $--background-color-base;
    &.is-active{
      visibility: visible;
      z-index: 1;
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
