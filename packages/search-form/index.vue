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
          <component :is="searchMode == 'default' ? 'span': 'el-col'" v-for="(item, index) in __defaultOption" :key="index"  v-bind="getColProps()">
          <el-form-item  v-bind="getFormItemProps(item)">
            <slot v-if="$scopedSlots[item.prop] || $slots[item.prop]" :name="item.prop" v-bind="item.props"></slot>
            <template v-else-if="item.option">
              <el-checkbox-group
                v-if="item.component == 'el-checkbox-group'"
                v-bind="item.props"
                v-model="msPageList.query[item.prop]">
                <el-checkbox
                  v-for="item in item.option"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-checkbox>
              </el-checkbox-group>
              <el-radio-group
                v-else-if="item.component == 'el-radio-group'"
                v-bind="item.props"
                v-model="msPageList.query[item.prop]">
                <el-radio
                  v-for="item in item.option"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-radio>
              </el-radio-group>
              <el-select
                v-else
                v-bind="item.props"
                v-model="msPageList.query[item.prop]"
                clearable>
                <el-option
                  v-for="item in item.option"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
            <template v-else-if="item.component=='el-date-picker'">
              <el-date-picker
                v-if="item.prop instanceof Array"
                v-bind="item.props"
                :value="msPageList.query[item.prop[0]] ? [msPageList.query[item.prop[0]],msPageList.query[item.prop[1]]] : []"
                @input="handleRangeInput($event, item.prop)"
              ></el-date-picker>
              <el-date-picker v-else v-bind="item.props" v-model="msPageList.query[item.prop]"></el-date-picker>
            </template>
            <component v-else :is="item.component || 'el-input'" v-bind="item.props" v-model="msPageList.query[item.prop]"/>
          </el-form-item>
          </component>
        </div>
      </component>
      <template v-if="searchMode == 'default'">
        <el-tooltip v-if="option && isSearchMore" effect="dark" content="更多搜索" placement="bottom">
          <div class="ms-search-form--items-more" @click="handleHighToggle">
            <i class="el-icon-d-arrow-right"></i>
          </div>
        </el-tooltip>
        <!--native-type="submit"是修改button type属性为submit-->
        <el-button native-type="submit" size="small">搜索</el-button>
        <slot></slot>
      </template>
      <el-row v-else>
        <el-form-item label=" ">
          <el-button native-type="submit" type="primary" size="small">确定</el-button>
          <el-button size="small" @click="handleHighCancel">收起</el-button>
          <el-button size="small" @click="handleHighReset">重置</el-button>
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
    option: {
      type: Array
    }
  },
  watch: {
    option: {
      immediate: true,
      handler (value) {
        this.initPageListQuery(value)
      }
    }
  },
  computed: {
    isHightSearch () {
      return this.option.some(item => item.hight === true)
    },
    __option () {
      return this.option.map(item => {
        let _item = {...item}
        _item.props = {...item.props}
        if (_item && _item.label && _item.props && !_item.props.placeholder) {
          _item.props.placeholder = '请输入' + _item.label
        }
        return _item
      })
    },
    __defaultOption () {
      let result = this.__option
      if (this.isHightSearch) {
        result = this.__option.filter(item => !item.hight)
      }
      return result
    },
    __hightOption () {
      let result = this.__option
      return result
    }
  },
  watch: {
    searchMode (value) {
      this.msPageList && this.msPageList.handleResize()
      this.$emit('update:searchMode', value)
      this.initPageListQuery(this.option)
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
    setTimeout(() => {
      this.option && this.initPageListQuery(this.option)
    }, 1000)
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
    initPageListQuery (option) {
      if (option && option.forEach) {
        let deleteFn = item => {
          if (item.prop instanceof Array) {
            item.prop.forEach(p => {
              this.$delete(this.msPageList.query, p)
            })
          } else {
            this.$delete(this.msPageList.query, item.prop)
          }
        }
        let addFn = item => {
          let keys = Object.keys(this.msPageList.query)
          if (item.component) {
            if (item.prop instanceof Array) {
              item.prop.forEach((p,i) => {
                if (!keys.includes(p)) {
                  this.$set(this.msPageList.query, p, item.value[i])
                }
              })
            } else {
              if (!keys.includes(item.prop)) {
                this.$set(this.msPageList.query, item.prop, item.value)
              }
            }
          }
        }
        option.forEach(item => {
          if (!(this.$scopedSlots[item.prop] || this.$slots[item.prop])) {
            if (this.msPageList.query) {
              if (this.searchMode === 'default') {
                if (item.hight) {
                  deleteFn(item)
                } else {
                  addFn(item)
                }
              } else {
                if (item.hight === false) {
                  deleteFn(item)
                } else {
                  addFn(item)
                }
              }
            }
          }
        })
      }
    },
    getFormItemProps (item) {
      let {props, value, prop, ...others} = item
      if (typeof prop === 'string') {
        others.prop = prop
      }
      return others
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
    },
    handleHighReset () {
      this.$refs.highQueryForm && this.$refs.highQueryForm.resetFields && this.$refs.highQueryForm.resetFields()
    },
    handleHighSubmit () {
      this.highVisible = false
      this.msPageList.handleSubmit()
    },
    handleRangeInput (value, keys = ['start_time', 'end_time']) {
      if (value && value[0]) {
        this.msPageList.query[keys[0]] = value[0]
        this.msPageList.query[keys[1]] = value[1]
      } else {
        keys.forEach(item => {
          this.msPageList.query[item] = null
        })
      }
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
