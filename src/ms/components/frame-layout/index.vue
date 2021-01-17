<template>
  <div :class="['ms-frame-layout',`ms-frame-layout--theme-${theme}`]"
    :style="{backgroundColor: theme=='dark' ? backgroundColor : ''}">
    <div class="ms-frame-layout--aside" :style="asideStyle" :class="{'is-collapse': isCollapse}">
      <div
        v-if="$slots['logo'] || $scopedSlots['logo']"
        title="收起/展开左侧菜单"
        class="ms-frame-layout--logo"
        :style="logoStyle">
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
        <div class="ms-frame-layout--tabs" v-if="tabs.length">
          <el-tabs v-model="tab.path" @tab-click="handleTab" editable @edit="handleTabsEdit">
            <el-tab-pane v-for="(item,index) in tabs" :label="item.meta.title" :name="item.path" :key="index"></el-tab-pane>
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
      console.log(value, this.$router)
      let tabs = [...this.tabs]
      if (value.matched && value.matched.length) {
        if (tabs.every(item => item.path !== value.path)) {
          tabs.push(value)
          this.tabs = tabs
          this.tab = value
          let el = document.createElement('div')
          this.$el.querySelector('.ms-frame-layout--body').appendChild(el)
          new window.Vue({ // eslint-disable-line
            el,
            router: new window.Router({routes: this.$router.options.routes.filter(item => item.meta.group === value.meta.group)}),
            store: window.store,
            template: '<router-view></router-view>'
          })
        } else {
          this.tab = this.tabs.find(item => item.path === value.path)
        }
      }
    }
  },
  data () {
    return {
      tabs: [],
      tab: 'frist',
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
  },
  methods: {
    handleTab (tab, event) {
      console.log(tab, event)
      this.tab = this.tabs.find(item => item.path === tab.name)
    },
    handleTabsEdit (targetName, action) {
      console.log(targetName, action)
      if (action === 'remove') {
        let index = 0
        let _item = this.tabs.find((item, i) => {
          if (item.path === targetName) {
            index = i
            return true
          }
          return false
        })
        let tabs = this.tabs.filter(item => item !== _item)
        if (tabs[index]) {
          this.tab = tabs[index]
        } else if (tabs[tabs.length - 1]) {
          this.tab = tabs[tabs.length - 1]
        } else {
          this.tab = null
        }
        this.tabs = tabs
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
    &--nav{
      &-item{
        display:inline-block;
        position:relative;
        &.is-popup:hover{
          .ms-frame-layout--nav-menu{
            &-popup{
              display:block;
            }
            &-trigger{
              border-color:#ddd;
              border-bottom-color:$--color-white;
              z-index:11;
              background:$--color-white;
            }
          }
        }
        &:hover{
          color:$--color-primary;
        }
      }
      &-trigger{
        display:inline-block;
        padding:0 10px;
        cursor:pointer;
        border-left: 1px solid transparent;
        border-right: 1px solid transparent;
        border-bottom: 1px solid transparent;
        position:relative;
        i{
          margin-right:4px;
          vertical-align: middle;
        }
        .el-badge__content{
          margin-top:10px;
        }
      }
      &-popup{
        display:none;
        position:absolute;
        background:#fff;
        border:1px solid rgba(0,0,0,0.1);
        width:300px;
        height:400px;
        top:100%;
        right:0;
        z-index: 10;
        box-shadow:0 3px 8px rgba(0,0,0,0.1);
      }
    }
    &--body{
      position:relative;
      flex: 1;
      min-width: 0;
      background:$--background-color-base;
    }
    &--breadcrumb{
      display:inline-block;
      vertical-align:middle;
      .el-breadcrumb{
        &__inner{
          color:inherit!important;
          font-weight:normal;
        }
      }
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
    &--theme{
      &-dark{
        .ms-frame-layout{
          &--logo{
            i{
              color:inherit;
            }
          }
          &--aside{
            .el-submenu{
              &__title{
                &:hover{
                  background:rgba(255,255,255,0.15)!important;
                }
                i{
                  color:inherit;
                }
              }
            }
            .el-menu-item{
              &:hover{
                background:rgba(255,255,255,0.15)!important;
              }
              &.is-active{
                background:rgba(255,255,255,0.45)!important;
              }
            }
          }
          &--nav{
            &-item{
              &:hover{
                color:#fff;
              }
            }
          }
          &--body{
            position:relative;
            z-index:10;
            border-top-left-radius:3px;
          }
        }
        &-header{
          .ms-frame-layout{
            &--logo{
              i{
                color:inherit;
              }
            }
            &--nav{
              &-item{
                &:hover{
                  color:#fff;
                }
              }
            }
            &--body{
              position:relative;
              z-index:10;
              border-top-left-radius:3px;
            }
          }
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
</style>
