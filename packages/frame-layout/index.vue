<template>
  <div :class="['ms-frame-layout', {'is-full-screen': fullScreen}]">
    <div
      v-if="!fullScreen"
      class="ms-frame-layout--sidebar"
      :class="{'is-collapse': isCollapse}"
      :style="{backgroundColor: menuProps ? menuProps.backgroundColor : ''}">
      <slot v-if="$slots['sidebar']" name="sidebar"></slot>
      <template v-else>
        <div
          v-if="$slots['logo']"
          class="ms-frame-layout--logo">
          <slot name="logo" v-bind="{isCollapse:isCollapse}"></slot>
        </div>
        <div class="ms-frame-layout--menu ms-scroller">
          <slot v-if="$slots['menu']" name="menu" v-bind="{isCollapse:isCollapse}"></slot>
          <el-menu
            v-else
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
                <template #title>
                  <template v-if="item.icon">
                    <div style="display:inline" v-if="item.icon.indexOf('</i>')>-1" v-html="item.icon"></div>
                    <i v-else :class="item.iconClass || iconClass" v-html="item.icon"></i>
                  </template>
                  <i v-else :class="item.iconClass || iconClass"></i>
                  <span>{{item.title}}</span>
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
      </template>
    </div>
    <div class="ms-frame-layout--main">
      <div class="ms-frame-layout--header" v-if="!fullScreen">
        <el-row
          class="ms-frame-layout--navbar"
          type="flex"
          align="middle">
          <i v-if="asideCollapse" title="收起/展开左侧菜单" class="ms-frame-layout--collapse" :class="!isCollapse ? 'el-icon-s-fold': 'el-icon-s-unfold'"  @click="isCollapse=!isCollapse"></i>
          <template v-if="!$slots['navbar']">
            <el-col style="flex:1">
              <slot name="title" v-if="$slots['title']"></slot>
              <div class="ms-frame-layout--title" v-else>{{title}}&nbsp;</div>
              <div class="ms-frame-layout--breadcrumb"></div>
            </el-col>
            <slot name="navbar-menu"></slot>
          </template>
          <slot v-else name="navbar"></slot>
        </el-row>
        <div class="ms-frame-layout--tabs" v-if="isTabs && apps.length">
          <el-tabs :modelValue="currentAppIndex + ''" @tab-click="handleTab" editable @edit="handleTabsEdit">
            <el-tab-pane v-for="(item,index) in apps" :label="item.title" :name="index + ''" :key="index + item.route.path"></el-tab-pane>
          </el-tabs>
          <i class="el-icon-refresh ms-frame-layout--tabs-action" title="刷新" @click="refresh"></i>
          <i class="el-icon-full-screen ms-frame-layout--tabs-action" @click="handleFullScreen"></i>
          <el-dropdown trigger="click" @command="handleCommand">
            <i class="el-icon-arrow-down ms-frame-layout--tabs-action" title="更多"></i>
            <template #dropdown>
              <el-dropdown-menu>
                <!--
                <el-dropdown-item command="refresh">刷新当前页签</el-dropdown-item>
                -->
                <el-dropdown-item command="all">关闭所有页签</el-dropdown-item>
                <el-dropdown-item command="other" :disabled="apps.length == 1">关闭其他页签</el-dropdown-item>
                <el-dropdown-item :disabled="currentAppIndex ==  0" command="left">关闭左边页签</el-dropdown-item>
                <el-dropdown-item :disabled="currentAppIndex == apps.length - 1" command="right">关闭右边页签</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="ms-frame-layout--body">
        <div class="ms-frame-layout--content ms-scroller">
          <slot v-if="$slots['default']" v-bind="{include: keepAliveInclude, routerViewKey: routerViewKey}"></slot>
          <router-view v-else v-slot="{ Component }" class="ms-frame-layout--slot">
            <keep-alive v-if="$route.meta.keepAlive" :include="keepAliveInclude" :exclude="keepAliveExclude">
              <component :is="Component" ></component>
            </keep-alive>
            <component :is="Component" v-if="!$route.meta.keepAlive"></component>
          </router-view>
        </div>
        <slot name="subbar"></slot>
      </div>
    </div>
    <slot name="other"></slot>
  </div>
</template>

<script>
let routerFromTab = false
let replaceRoute = false
export default {
  name: 'MsFrameLayout',
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
      this.parseRoute(value)
    },
    apps (value) {
      let apps = value.map(item => {
        let {route, vm, title} = item
        let {matched, ...others} = route
        console.log(matched)
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
      item.route = this.$router.resolve(item.route.fullPath)
    })
    return {
      apps,
      fullScreen: false,
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
            item.vm.show = value.route.fullPath === item.route.fullPath
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
      this.refreshRoute && this.$router.addRoute(this.refreshRoute)
      this.parseRoute(this.$route)
    }
    document.addEventListener("fullscreenchange", () => {
      this.fullScreen = document.fullscreenElement ? true : false
    })
  },
  methods: {
    parseRoute (value) {
      console.log('route', value)
      this.pushRouterViewInclude(this.getRouteInclude(value))
      const findIndex = value.matched.findIndex(item => item.components.default === this.$parent.$options)
      if (this.isTabs && findIndex > -1) {
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
              if (decodeURI(item.route.path) === decodeURI(value.path)) {
                return true
              }
              if (item.route.matched.length == value.matched.length && item.route.matched.length > findIndex + 2) {
                return item.route.matched.every((item2,i) => {
                  if (i < value.matched.length - 1) {
                    return item2.path == value.matched[i].path
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
      if (value.meta && !value.meta.keepAlive) {
        this.routerViewKey = value.path
      }
    },
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
      return value.params.title ? value.params.title : value.meta && value.meta.title ? typeof value.meta.title === 'function' ? value.meta.title(value) : value.meta.title : value.fullPath
    },
    getAppByPath (path) {
      return this.apps.find(item => {
        return item.route.path === path
      })
    },
    closeApp (path) {
      if (path) {
        let result = this.getAppByPath(path)
        result && this.removeApp(result)
      }
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
      let app = this.apps[parseInt(tab.props.name)]
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
    },
    handleFullScreen () {
      this.fullScreen = true
      document.body.requestFullscreen && document.body.requestFullscreen()
    }
  }
}
</script>
