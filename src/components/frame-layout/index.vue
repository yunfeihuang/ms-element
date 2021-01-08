<template>
  <div :class="['e-frame-layout',`e-frame-layout--theme-${theme}`]"
    :style="{backgroundColor: theme=='dark' ? backgroundColor : ''}">
    <div class="e-frame-layout--aside" :style="asideStyle" :class="{'is-collapse': isCollapse}">
      <div
        v-if="$slots['logo'] || $scopedSlots['logo']"
        title="收起/展开左侧菜单"
        class="e-frame-layout--logo"
        :style="logoStyle"
        @click="isCollapse=!isCollapse">
        <slot name="logo" v-bind="{isCollapse:isCollapse}"></slot>
      </div>
      <div class="e-frame-layout--aside-inner scroller">
        <slot v-if="$slots['aside']" name="aside" v-bind="{isCollapse:isCollapse}"></slot>
        <el-menu
          class="e-frame-layout--menus"
          :collapse="isCollapse"
          :router="true"
          :default-active="$route.path"
          v-bind="_menuProps">
          <template v-for="(item,index) in _menus">
            <el-submenu
              v-if="item.options"
              :index="item.index || item.title"
              :key="index"
              popper-class="e-frame-layout--submenu">
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
    <div class="e-frame-layout--content">
      <el-row
        type="flex"
        v-if="!$slots['header']"
        class="e-frame-layout--header"
        align="middle" :style="headerStyle">
        <el-col>
          <slot name="title" v-if="$slots['title']"></slot>
          <div class="e-frame-layout--title" v-else>{{title}}</div>
          <div v-if="breadcrumb" :key="$route.path" class="e-frame-layout--breadcrumb"></div>
        </el-col>
        <slot name="nav"></slot>
      </el-row>
      <slot v-else name="header"></slot>
      <div class="e-frame-layout--body scroller">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  componentName: 'EFrameLayout',
  props: {
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
  data () {
    return {
      isCollapse: document.ontouchstart !== undefined
    }
  },
  computed: {
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
    logoStyle () {
      if (this.theme === 'dark-header') {
        return this.headerStyle
      }
      return {}
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
  }
}
</script>
