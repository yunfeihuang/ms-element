<template functional>
  <div :class="[
    `ms-page-list-layout`,
    data.staticClass,
    data.class]"
    :style="data.staticStyle && data.style ? [data.staticStyle,data.style] : data.staticStyle || data.style">
    <slot name="breadcrumb"></slot>
    <slot name="tabs"></slot>
    <slot name="search"></slot>
    <div class="ms-page-list-layout--table ms-loading-element" :class="{'ms-scroller': props.isScroll}">
      <slot name="table"></slot>
    </div>
    <el-row type="flex" align="middle" class="ms-page-list-layout--footer">
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
      <el-col class="ms-page-list-layout--action">
        <slot name="action"></slot>
      </el-col>
      <div class="ms-page-list-layout--pagination">
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
  componentName: 'MsPageListLayout',
  props: {
    isScroll: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss">
.ms-frame-layout--body{
  .ms-page-list-layout{
    position:absolute;
    width:100%;
    height:100%;
  }
}
.ms-drawer--body{
  .ms-page-list-layout{
    position: relative;;
    width:100%;
    height:100%;
    &--table{
      padding:0;
    }
    .form-search{
      margin-left:0;
      margin-top:0;
    }
  }
}
.is-iframe{
  .ms-page-list-layout{
    box-shadow: none;
  }
}
.ms-dialog .el-dialog__body .ms-page-list-layout{
  min-height: 85vh;
  height:100%;
  position: relative;;
}
.ms-page-list-layout{
  display:flex;
  flex-direction: column;
  box-sizing:border-box;
  background-color: $--color-white;
  &--table{
    overflow: hidden;
    box-sizing:border-box;
    padding: 0 10px;
    flex: auto;
  }
  &--footer{
    padding:5px 10px;
  }
  &.is-breadcrumb{
    border-top:30px solid transparent;
  }
  .el-breadcrumb{
    position:absolute;
    top:-30px;
    z-index:1;
    left:0;
    font-size:0.9rem;
  }
  .el-table{
    &__empty-text{
      line-height:1;
      color: #999;
      &:before{
        font-family: e-iconfont!important;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-size: 16px;
        line-height: 100%;
        content: "\e708";
        display:block;
        font-size: 40px;
        font-size: 6rem;
        margin-bottom:10px;
      }
    }
    &-column--index{
      white-space: nowrap;
      .cell{
        padding:0 4px;
        white-space: nowrap;
      }
    }
  }
  &--action{
    .el-button--default{
      &.el-button--small{
        padding-left:10px;
        padding-right:10px;
        height:28px;
      }
    }
  }
  &--search-drawer{
    position:absolute;
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
    .ms-scroller{
      max-height:68vh;
    }
    >.v-modal{
      position:absolute;
      background: $--color-white;
      outline:none;
    }
  }
  &--search-high{
    margin:10px;
  }
}
</style>
