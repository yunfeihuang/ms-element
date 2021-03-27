<template>
  <div class="ms-query-form">
    <el-form v-if="searchMode == 'default'" v-bind="msPageList.getFormProps()" @submit.native.prevent="msPageList.handleSubmit">
      <div class="ms-query-form--prepend" v-if="$slots['prepend']">
        <slot name="prepend"></slot>
      </div>
      <el-form-item v-for="(item, index) in __option" :key="index" v-bind="getFormItemProps(item)">
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
        <component v-else :is="item.component || 'el-input'" v-bind="item.props" v-model="msPageList.query[item.prop]"/>
      </el-form-item>
      <template>
        <!--native-type="submit"是修改button type属性为submit-->
        <el-button native-type="submit" size="small">搜索</el-button>
        <el-button size="small" @click="handleHighToggle">高级搜索</el-button>
        <slot></slot>
      </template>
    </el-form>
    <template v-else>
      <div class="ms-query-form--search-high">
        <el-button type="text" size="small" icon="el-icon-search" @click="handleHighToggle">继续搜索</el-button>
        <el-button type="text" size="small" icon="el-icon-delete" @click="handleHighCancel">清除搜索</el-button>
      </div>
      <el-drawer
        class="ms-query-form--search-drawer"
        title="高级搜索"
        :visible.sync="highVisible"
        :append-to-body="false"
        :modal-append-to-body="false"
        direction="ttb"
        size="auto">
        <el-form v-bind="msPageList.getFormProps({class: '', labelWidth: '80px',inline:false})" ref="highQueryForm" @submit.native.prevent="handleHighSubmit">
          <el-row :gutter="10" class="scroller">
            <el-col v-bind="getColProps()" v-for="(item, index) in __option" :key="index">
              <el-form-item v-bind="getFormItemProps(item)">
                <template v-if="item.option">
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
                <slot v-else-if="$scopedSlots[item.prop] || $slots[item.prop]" :name="item.prop" v-bind="item.props"></slot>
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
  componentName: 'MsQueryForm',
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
        if (value && value.forEach) {
          value.forEach(item => {
            if (!(this.$scopedSlots[item.prop] || this.$slots[item.prop])) {
              if (this.msPageList.query && this.msPageList.query[item.prop] === undefined) {
                this.$set(this.msPageList.query, item.prop, item.value)
              }
            }
          })
        }
      }
    }
  },
  computed: {
    __option () {
      this.option.forEach(item => {
        if (item && item.label && item.props && !item.props.placeholder) {
          item.props.placeholder = '请输入' + item.label
        }
      })
      return this.option
    }
  },
  watch: {
    searchMode (value) {
      this.$emit('update:searchMode', value)
    }
  },
  data () {
    return {
      searchMode: 'default',
      highVisible: false
    }
  },
  methods: {
    getFormItemProps (item) {
      let {props, value, ...others} = item
      return others
    },
    getColProps (props) {
      return {
        xl: 4,
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
    }
  }
}
</script>
<style lang="scss">
  .ms-query-form{
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
      max-height:68vh;
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
  }
</style>
