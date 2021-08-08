<template>
  <el-form 
    v-bind="msPageList.getFormProps(searchMode == 'default' ?  { class: ['form-search', 'ms-search-form']} : { class: 'ms-search-form--layout', labelWidth:'80px',inline:false})"
    @submit.native.prevent="msPageList.handleSubmit">
    <div class="ms-search-form--prepend" v-if="$slots['prepend']">
      <slot name="prepend"></slot>
    </div>
    <div :class="{'ms-search-form--body': searchMode == 'default'}">
      <component :is="searchMode == 'default' ? 'div': 'el-row'" :class="{'ms-search-form--items': searchMode == 'default'}" :gutter="10">
        <div :class="{'ms-search-form--items-inner': searchMode == 'default'}">
          <component :is="searchMode == 'default' ? 'span': 'el-col'" v-for="(item, index) in searchSlots" :key="index" v-bind="getColProps()">
            <slot v-if="$scopedSlots['$'+item] || $slots['$'+item]" :name="'$'+item"></slot>
          </component>
        </div>
      </component>
      <template v-if="searchMode == 'default'">
        <el-tooltip v-if="searchSlots && searchSlots.length && isSearchMore" effect="dark" content="更多搜索" placement="bottom">
          <div class="ms-search-form--items-more" @click="handleHighToggle">
            <i class="el-icon-d-arrow-right"></i>
          </div>
        </el-tooltip>
        <!--native-type="submit"是修改button type属性为submit-->
        <el-button native-type="submit" size="small">搜索</el-button>
        <el-button native-type="reset" size="small">重置</el-button>
        <slot></slot>
      </template>
      <el-row v-else>
        <el-form-item label=" ">
          <el-button native-type="submit" type="primary" size="small">确定</el-button>
          <el-button size="small" @click="handleHighCancel">收起</el-button>
          <el-button native-type="reset" size="small">重置</el-button>
        </el-form-item>
      </el-row>
    </div>
    <div class="ms-search-form--append" v-if="$slots['append']">
      <slot name="append"></slot>
    </div>
  </el-form>
</template>

<script>
import {Form} from 'element-ui'
export default {
  componentName: 'MsSearchForm',
  inject: ['msPageList'],
  props: {
    ...Form.props,
    searchSlots: {
      type: Array,
      default () {
        return []
      }
    }
  },
  watch: {
    searchMode (value) {
      this.msPageList && this.msPageList.handleResize()
      this.$emit('update:searchMode', value)
    }
  },
  data () {
    return {
      searchMode: 'default',
      highVisible: false,
      isSearchMore: false
    }
  },
  mounted () {
    window.addEventListener('resize', this.handleResize, false)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize, false)
  },
  updated () {
    this.handleResize()
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
    },
    handleHighCancel () {
      this.searchMode = 'default'
      this.highVisible = false
    },
    handleHighToggle (visible) {
      this.searchMode = 'hight'
      this.highVisible = typeof visible === 'boolean' ? visible : !this.highVisible
    }
  }
}
</script>
<style lang="scss">
  .ms-search-form{
    &--prepend{
      margin-bottom:10px;
    }
    &--layout{
      margin:10px 10px 0;
      .el-date-editor,.el-select{
        width:100%;
      }
    }
    &--body{
      display:inline-flex;
      max-width:100%
    }
    &--items{
      flex:1;
      overflow:hidden;
      &-inner{
        white-space: nowrap;
        width: max-content;
      }
      &-more{
        height: 32px;
        line-height: 32px;
        background:linear-gradient(90deg, rgba(255,255,255,0.1) 0%,rgba(255,255,255,1) 100%);
        width: 40px;
        margin-left:-40px;
        display: inline-block;
        // margin-right:10px;
        text-align: right;
        padding-right:10px;
        z-index: 100;
        position: relative;
        cursor: pointer;
        >i{
          transform: rotate(90deg);
          font-size: 1.25em;
          background: #fff;
        }
      }
    }
    .el-tabs{
      &__header{
        margin-bottom:0;
      }
    }
    &.form-search{
      margin:10px 10px 0;
      .el-form-item,.el-button {
        margin-bottom: 10px;
      }
      .el-button{
        padding-right:8px;
        padding-left:8px;
        min-width:60px;
      }
    }
  }
</style>
