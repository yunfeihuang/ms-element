<template functional>
  <div :class="[
    `e-page-list-layout`,
    {'is-breadcrumb':$slots['breadcrumb'] && $slots['breadcrumb'][0] && $slots['breadcrumb'][0].componentOptions.tag == 'el-breadcrumb'},
    data.staticClass,
    data.class]"
    :style="data.staticStyle && data.style ? [data.staticStyle,data.style] : data.staticStyle || data.style">
    <slot name="breadcrumb"></slot>
    <slot name="tabs"></slot>
    <template v-if="parent.searchMode=='high'">
      <slot v-if="$slots['search-high-after']"></slot>
      <div v-else class="e-page-list-layout--search-high">
        <el-button type="text" size="small" icon="el-icon-search" @click="parent.handleHighToggle">继续搜索</el-button>
        <el-button type="text" size="small" icon="el-icon-delete" @click="parent.handleHighCancel">清除搜索</el-button>
      </div>
    </template>
    <slot v-else name="search"></slot>
    <el-drawer
      v-if="$slots['search-high']"
      class="e-page-list-layout--search-drawer"
      title="高级搜索"
      :visible="parent.highVisible"
      :append-to-body="false"
      :modal-append-to-body="false"
      direction="ttb"
      size="auto"
      @close="parent.handleHighToggle(false)">
      <el-form v-bind="parent.getHighFormProps()" @submit.native.prevent="parent.handleHighSubmit">
        <el-row :gutter="10" class="ms-scroller">
          <slot name="search-high"></slot>
        </el-row>
        <el-form-item label=" ">
          <!--native-type="submit"是修改button type属性为submit-->
          <el-button native-type="submit" type="primary" size="small">确定</el-button>
          <el-button size="small" @click="parent.handleHighToggle">取消</el-button>
          <el-button size="small" @click="parent.handleHighReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <div class="e-page-list-layout--table" :class="{'ms-scroller': props.isScroll}">
      <slot name="table"></slot>
    </div>
    <el-row type="flex" align="middle" class="e-page-list-layout--footer">
      <div v-if="$slots['action']">
        <template v-if="parent.multipleSelectionAll && parent.multipleSelectionAll.length">
          已选
          <el-tooltip content="点击清空选中" placement="top-start">
            <a @click="parent.handleClearSelection" class="link">({{parent.multipleSelectionAll.length}})</a>
          </el-tooltip>
        </template>
        <template v-else>
          批量
        </template>
        &nbsp;&nbsp;
      </div>
      <el-col class="e-page-list-layout--action">
        <slot name="action"></slot>
      </el-col>
      <div class="e-page-list-layout--pagination">
        <slot v-if="$slots.pagination" name="pagination"></slot>
        <el-pagination
          v-else
          v-bind="parent.getPaginationProps(parent.pageData)"
          @current-change="parent.handleCurrentChange"
          @size-change="parent.handleSizeChange">
        </el-pagination>
      </div>
    </el-row>
    <slot></slot>
  </div>
</template>

<script>
export default {
  componentName: 'EPageListLayout',
  props: {
    isScroll: {
      type: Boolean,
      default: false
    }
  }
}
</script>
