<template>
  <div class="console">
    <el-row :gutter="10">
      <el-col :xl="12" :sm="8" :md="6" :lg="4" v-for="item in 6" :key="item">
        <el-card>
          <div class="statis-item">
            <h2>数据统计标题{{item}}</h2>
            <em>1000</em>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :lg="12" v-for="item in 4" :key="item">
        <el-card>
          <h2>客户增量统计{{item}}</h2>
          <PolylineChart :option="option1" style="height:426px"></PolylineChart>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PolylineChart from './components/chart/Polyline'
let option = JSON.parse('{"xAxis":{"type":"category","boundaryGap":false,"data":["2019-11-25","2019-11-26","2019-11-27","2019-11-28","2019-11-29","2019-11-30","2019-12-01","2019-12-02","2019-12-03","2019-12-04","2019-12-05","2019-12-06","2019-12-07","2019-12-08","2019-12-09","2019-12-10","2019-12-11","2019-12-12","2019-12-13","2019-12-14","2019-12-15","2019-12-16","2019-12-17","2019-12-18","2019-12-19","2019-12-20","2019-12-21","2019-12-22","2019-12-23","2019-12-24"]},"series":[{"data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21000,25796,0,0,0,0,0,0,0,0,0,0,0,0,0],"type":"line","smooth":true,"itemStyle":{"normal":{"color":"#409EFF","lineStyle":{"color":"#409EFF"}}},"areaStyle":{"color":"rgba(102,177,255,0.5)"}}]}')

export default {
  name: 'console',
  components: {
    PolylineChart
  },
  activated () {
    this.$forceUpdate()
  },
  data () {
    return {
      option1: option
    }
  }
}
</script>
<style lang="scss">
  .console{
    background-color:$--background-color-base;
    >.el-row{
      >.el-col{
        margin:5px 0;
      }
    }
    .el-card{
      box-shadow:0 1px 1px rgba(0, 0, 0, 0.1);
      border:0;
      &__body{
        padding:15px;
      }
    }
    h2{
      font-size:1.1em;
      margin-bottom:10px;
    }
    .statis-item{
      line-height:1;
      color:#666;
      em{
        font-size:2em;
        font-weight:normal;
        font-style:normal;
      }
    }
  }
</style>
