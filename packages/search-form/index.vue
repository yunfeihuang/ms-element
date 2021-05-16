<template>
  <div class="ms-search-form">
    <el-form 
      v-if="searchMode == 'default'"
      v-bind="msPageList.getFormProps()"
      @submit.native.prevent="msPageList.handleSubmit">
      <div class="ms-search-form--prepend" v-if="$slots['prepend']">
        <slot name="prepend"></slot>
      </div>
      <el-form-item v-for="(item, index) in __defaultOption" :key="index" v-bind="getFormItemProps(item)">
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
      <div class="ms-search-form--append" v-if="$slots['append']">
        <slot name="append"></slot>
      </div>
      <template>
        <!--native-type="submit"是修改button type属性为submit-->
        <el-button native-type="submit" size="small">搜索</el-button>
        <el-button size="small" v-if="isHightSearch" @click="handleHighToggle">高级搜索</el-button>
        <slot></slot>
      </template>
    </el-form>
    <template v-else>
      <div class="ms-search-form--search-high">
        <el-button type="text" size="small" icon="el-icon-search" @click="handleHighToggle">继续搜索</el-button>
        <el-button type="text" size="small" icon="el-icon-delete" @click="handleHighCancel">清除搜索</el-button>
      </div>
      <el-drawer
        class="ms-search-form--search-drawer"
        title="高级搜索"
        :visible.sync="highVisible"
        :append-to-body="false"
        :modal-append-to-body="false"
        direction="ttb"
        size="auto">
        <el-form v-bind="msPageList.getFormProps({class:'', labelWidth:'80px',inline:false})" ref="highQueryForm" @submit.native.prevent="handleHighSubmit">
          <el-row :gutter="10" class="ms-scroller">
            <el-col v-bind="getColProps()" v-for="(item, index) in __hightOption" :key="index">
              <el-form-item v-bind="getFormItemProps(item)">
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
                    v-model="msPageList.query[item.prop]">
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
            </el-col>
          </el-row>
          <el-form-item label=" ">
            <!--native-type="submit"是修改button type属性为submit-->
            <el-button native-type="submit" type="primary" size="small">确定</el-button>
            <el-button size="small" @click="handleHighToggle(false)">取消</el-button>
            <el-button size="small" @click="handleHighReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>
    </template>
  </div>
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
      highVisible: false
    }
  },
  mounted () {
    this.option && this.initPageListQuery(this.option)
  },
  methods: {
    initPageListQuery (option) {
      if (option && option.forEach) {
        let deleteFn = item => {
          if (item.prop instanceof Array) {
            item.prop.forEach(p => {
              if (this.msPageList.query[p] !== undefined) {
                delete this.msPageList.query[p]
              }
            })
          } else {
            delete this.msPageList.query[item.prop]
          }
        }
        let addFn = item => {
          if (item.component) {
            if (item.prop instanceof Array) {
              item.prop.forEach((p,i) => {
                this.$set(this.msPageList.query, p, item.value[i])
              })
            } else {
              this.$set(this.msPageList.query, item.prop, item.value)
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
    &--search-drawer{
      position:absolute;
      border:10px solid transparent;
      box-sizing: border-box;
      .el-drawer{
        box-shadow:0 0 15px rgba(0,0,0,0.1);
        &__header{
          padding:15px;
          padding-bottom:0;
          margin-bottom:15px;
        }
        .el-date-editor,.el-select{
          width:100%;
        }
        &__body{
          padding:0 15px;
        }
      }
    }
    .ms-scroller{
      max-height:60vh;
    }
    .v-modal{
      position:absolute;
      background: $--color-white;
      outline:none;
      background-clip: content-box;
      border: 10px solid transparent;
      box-sizing: border-box;
    }
    &--search-high{
      margin:10px;
    }
    .el-tabs{
      margin-top: 10px;
      &__header{
        margin-bottom:0;
      }
    }
    .form-search{
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
