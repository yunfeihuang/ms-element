<template>
  <div :class="[
    `ms-page-list-layout`,
    {'is-flexbox': msPageList ? msPageList.fixedTableHead !== false : false}]">
    <teleport v-if="$slots['breadcrumb']" :to="breadcrumbTeleportTo">
      <slot name="breadcrumb"></slot>
    </teleport>
    <slot name="tabs"></slot>
    <slot name="search"></slot>
    <div class="ms-page-list-layout--table ms-loading-element" :class="{'ms-scroller': isScroll}">
      <slot name="table"></slot>
    </div>
    <el-row type="flex" align="middle" class="ms-page-list-layout--footer">
      <template v-if="$slots['action']">
        <template v-if="msPageList && msPageList.multipleSelectionAll && msPageList.multipleSelectionAll.length">
          {{checkedText}}
          <el-tooltip content="点击清空选中" placement="top-start">
            <span style="cursor: pointer;" @click="msPageList.handleClearSelection" class="el-button--text">({{msPageList.multipleSelectionAll.length}})</span>
          </el-tooltip>
        </template>
        <template v-else>
          {{batchText}}
        </template>
        &nbsp;&nbsp;
      </template>
      <div class="ms-page-list-layout--action">
        <slot name="action"></slot>
      </div>
      <slot v-if="$slots.pagination" name="pagination"></slot>
      <el-pagination
        v-else-if="msPageList && msPageList.response"
        v-bind="msPageList.getPaginationProps()"
        @current-change="msPageList.handleCurrentChange"
        @size-change="msPageList.handleSizeChange">
      </el-pagination>
    </el-row>
    <slot></slot>
  </div>
</template>

<script>
import {inject} from 'vue'
export default {
  name: 'MsPageListLayout',
  props: {
    checkedText: {
      type: String,
      default: '已选'
    },
    batchText: {
      type: String,
      default: '批量'
    },
    isScroll: {
      type: Boolean,
      default: false
    },
    breadcrumbTeleportTo: {
      type: String,
      default: '.ms-frame-layout--breadcrumb'
    }
  },
  setup () {
    const msPageList = inject('msPageList')
    return {
      msPageList
    }
  }
}
</script>
