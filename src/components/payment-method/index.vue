<template functional>
  <el-radio-group
    :class="['is-checker', 'e-payment-method', `e-payment-method--${props.size}`, data.staticClass, data.class]"
    :style="data.staticStyle && data.style ? [data.staticStyle,data.style] : data.staticStyle || data.style"
    v-bind="data.attrs"
    v-on="listeners" size="small">
    <el-radio v-if="$options.methods.defaultProps(props.options).wx && (!props.show || props.show.indexOf('wx') > -1 )"
      :label="$options.methods.defaultProps(props.options).wx" border>
      <e-icon style="color:#1AAD19">&#xe63a;</e-icon>微信支付
    </el-radio>
    <el-radio v-if="$options.methods.defaultProps(props.options).zfb && (!props.show || props.show.indexOf('zfb') > -1)"
      :label="$options.methods.defaultProps(props.options).zfb" border>
      <e-icon style="color:#02A3E3">&#xe629;</e-icon>支付宝支付
    </el-radio>
    <el-radio v-if="$options.methods.defaultProps(props.options).off && (!props.show || props.show.indexOf('off') > -1)"
      :label="$options.methods.defaultProps(props.options).off" border>
      <e-icon style="zoom:1.45">&#xe611;</e-icon>线下支付
    </el-radio>
  </el-radio-group>
</template>

<script>
export default {
  componentName: 'EPaymentMethod',
  methods: {
    defaultProps (prop) {
      return prop || {wx: 1, zfb: 2, off: 10}
    }
  }
}
</script>
