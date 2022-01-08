<template>
  <el-form
    v-if="msPageList"
    class="ms-search-form"
    ref="form"
    v-bind="!isCollapse ? {...$props} : { class: 'ms-search-form--layout', labelWidth:'80px', ...$props, inline: false}">
    <div class="ms-search-form--prepend" v-if="$slots['prepend']">
      <slot name="prepend"></slot>
    </div>
    <div :class="{'ms-search-form--body': !isCollapse}">
      <component :is="!isCollapse ? 'div': 'el-row'" :class="{'ms-search-form--items': !isCollapse}" :gutter="10">
        <template v-if="isCollapse">
          <template v-if="searchSlots && searchSlots.length">
            <el-col
              v-for="(item, index) in searchSlots"
              :key="index"
              v-bind="getColProps()">
              <slot v-if="$slots[item+'-slot']" :name="item+'-slot'"></slot>
            </el-col>
          </template>
          <template v-else>
            <el-col
              v-for="(item, index) in searchSlotKeys"
              :key="index"
              v-bind="getColProps()">
              <slot v-if="$slots[item]" :name="item"></slot>
            </el-col>
          </template>
        </template>
        <div v-else class="ms-search-form--items-inner">
          <template v-if="searchSlots && searchSlots.length">
            <slot v-for="(item, index) in searchSlots" :key="index" :name="item+'-slot'"></slot>
          </template>
          <template v-else>
            <slot v-for="(item, index) in searchSlotKeys" :key="index" :name="item"></slot>
          </template>
        </div>
      </component>
      <template v-if="!isCollapse">
        <el-tooltip
          v-if="searchSlotKeys && searchSlotKeys.length && isSearchMore"
          effect="dark"
          content="更多"
          placement="bottom">
          <el-form-item>
            <el-button class="ms-search-form--items-more" @click="isCollapse = true">
              <i class="el-icon-d-arrow-right"></i>
            </el-button>
          </el-form-item>
        </el-tooltip>
        <!--native-type="submit"是修改button type属性为submit-->
        <el-form-item>
          <el-button v-if="searchSlotKeys.length" native-type="submit">{{searchText}}</el-button>
          <el-button v-if="searchSlotKeys.length" @click="msPageList.handleReset">{{resetText}}</el-button>
          <slot name="create"></slot>
          <slot name="append-button"></slot>
        </el-form-item>
        <slot></slot>
      </template>
      <el-row v-else>
        <el-form-item label=" ">
          <el-button native-type="submit" type="primary" >{{searchText}}</el-button>
          <el-button @click="isCollapse = false">收起</el-button>
          <el-button @click="msPageList.handleReset">{{resetText}}</el-button>
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
      default: '清空'
    },
    createText: {
      type: String,
      default: '创建'
    },
    onCreate: {
      type: Function
    }
  },
  computed: {
    searchSlotKeys () {
      return Object.keys(this.$slots).filter(key => key.includes('-slot'))
    }
  },
  watch: {
    isCollapse (value) {
      this.msPageList && this.msPageList.handleResize()
      if (value) {
        this.$nextTick(() => {
          this.$el.classList.remove('el-form--inline')
        })
      }
    }
  },
  data () {
    return {
      isCollapse: false,
      isSearchMore: false
    }
  },
  mounted () {
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
    handleReset () {
      this.$refs.form && this.$refs.form.resetFields && this.$refs.form.resetFields()
    },
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
        xl: 4,
        lg: 6,
        md: 8,
        sm: 12,
        ...props
      }
    }
  }
}
</script>
