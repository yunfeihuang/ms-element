<template>
  <el-form
    class="ms-search-form"
    v-bind="!isCollapse ? {...$props} : { ...$props, class: 'ms-search-form--layout', labelWidth:'80px', inline: false}">
    <div class="ms-search-form--prepend" v-if="$slots['prepend']">
      <slot name="prepend"></slot>
    </div>
    <div :class="{'ms-search-form--body': !isCollapse}">
      <component :is="!isCollapse ? 'div': 'el-row'" :class="{'ms-search-form--items': !isCollapse}" :gutter="10">
        <div :class="{'ms-search-form--items-inner': !isCollapse}">
          <template v-if="searchSlots && searchSlots.length">
            <component
              :is="!isCollapse ? 'span': 'el-col'"
              v-for="(item, index) in searchSlots"
              :key="index"
              v-bind="getColProps()">
              <slot v-if="$slots[item+'-slot']" :name="item+'-slot'"></slot>
            </component>
          </template>
          <template v-else>
            <component
              :is="!isCollapse ? 'span': 'el-col'"
              v-for="(item, index) in searchSlotKeys"
              :key="index"
              v-bind="getColProps()">
              <slot v-if="$slots[item]" :name="item"></slot>
            </component>
          </template>
        </div>
      </component>
      <template v-if="!isCollapse">
        <el-tooltip
          v-if="searchSlots && searchSlots.length && isSearchMore"
          effect="dark"
          content="更多"
          placement="bottom">
          <div class="ms-search-form--items-more" @click="isCollapse = true">
            <i class="el-icon-d-arrow-right"></i>
          </div>
        </el-tooltip>
        <!--native-type="submit"是修改button type属性为submit-->
        <el-button v-if="searchSlotKeys.length" native-type="submit" size="small">{{searchText}}</el-button>
        <el-button v-if="searchSlotKeys.length" @click="msPageList.handleReset" size="small">{{resetText}}</el-button>
        <slot></slot>
      </template>
      <el-row v-else>
        <el-form-item label=" ">
          <el-button native-type="submit" type="primary" size="small">{{searchText}}</el-button>
          <el-button size="small" @click="isCollapse = false">收起</el-button>
          <el-button @click="msPageList.handleReset" size="small">{{resetText}}</el-button>
        </el-form-item>
      </el-row>
    </div>
    <div class="ms-search-form--append" v-if="$slots['append']">
      <slot name="append"></slot>
    </div>
  </el-form>
</template>

<script>
export default {
  name: 'MsSearchForm',
  inject: ['msPageList'],
  props: {
    searchSlots: {
      type: Array
    },
    searchText: {
      type: String,
      default: '搜索'
    },
    resetText: {
      type: String,
      default: '重置'
    }
  },
  computed: {
    searchSlotKeys () {
      return Object.keys(this.$slots).filter(key => key.includes('-slot'))
    }
  },
  watch: {
    isCollapse () {
      this.msPageList && this.msPageList.handleResize()
    }
  },
  data () {
    return {
      isCollapse: false,
      isSearchMore: false
    }
  },
  mounted () {
    console.log('slots', this)
    window.addEventListener('resize', this.handleResize, false)
    this.handleResize()
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.handleResize, false)
  },
  updated () {
    this.$nextTick(this.handleResize)
  },
  methods: {
    handleResize () {
      this.$resizeTimer && clearTimeout(this.$resizeTimer)
      this.$resizeTimer = setTimeout(() => {
        let node = this.$el.querySelector('.ms-search-form--items-inner')
        if (node) {
          this.isSearchMore = node.offsetWidth > node.parentNode.offsetWidth
        }
      }, 200)
    },
    getColProps (props) {
      return {
        xl: 5,
        lg: 6,
        md: 8,
        sm: 12,
        ...props
      }
    }
  }
}
</script>
