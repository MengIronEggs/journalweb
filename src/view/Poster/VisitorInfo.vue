<style scoped lang="less">
.visitorInfo{
  height: 100%;
  .content{
    height: 70%;
    padding-top: .15rem;
    .contit{
      .titone{
        line-height: .2rem;
        padding-left: .1rem;
        span{
          display: inline-block;
          width: .4rem;
          text-align-last: justify;
        }
      }
      padding-bottom: .1rem;
    }
  }
}
 
</style>
<template>
 <div class="visitorInfo">
    <!--搜索框部分-->
  <div class='table-header'>
    <div class="search-block">
      <el-form :model="querydata" ref='houseResourceData'>
        <el-row :gutter='24' class="search-line">  
          <el-col :span="8" >
            <el-form-item label="杂志：" style="padding-left: .1rem;">
              <el-select v-model="querydata.journal" @clear="handelClear" @change="conditionSelect" clearable placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>                           
            </el-form-item>       
          </el-col>     
          <el-col :span="8">
            <el-form-item label="文章：" style="padding-left: .1rem;">
              <el-select  v-model="querydata.article" :disabled="isDis" @change="articleSelect" clearable placeholder="请选择">
                <el-option
                  v-for="item in Artoptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>  
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="handleClickEchart" icon="el-icon-search">搜索</el-button>
          </el-col>
        </el-row>
       </el-form>
    </div>
  </div>
  <div class="content">
    <div class="contit">
      <div class="titone"> <span>累计用户数</span> ：<span style="color:#d06d6a">{{addUppersons}}</span></div>
      <div class="titone"><span>访问人数</span> ：<span style="color:#807fdb">{{visitorpersons}}</span></div> 
    </div>
    <div ref="echartsType" :style="{width: '100%', height: '100%'}"></div>
  </div>
 </div>
</template>

<script>
let echarts = require('echarts/lib/echarts')  
// require 不用 import 引入是因为 import 需要详细的路径
import 'echarts/lib/chart/line'
// // // 引入提示框和title组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/toolbox'
export default {
  data() {
    return {
      querydata: { //条件
        journal: '', //杂志
        article: '', //文章
      },
      isDis: true,
      options: [], // 杂志数组
      Artoptions: [], // 文章数组
      addUppersons: '', //累计用户
      visitorpersons: '', //访问用户
      Accruedvisit: [], //累计访问数组
      Pagevisit: [], //累计访问数组
      thirtyDay: [], //30t天日期数组
    }

  },
  methods: {
    // 杂志加载方法
    pageListonLoad() {
      this.$get(`GetEjJournallistWhere`).then(res => {
        if (res.Code == 200 && res.Data) {
          if(res.Data && res.Data.length > 0) {
            this.options = this.handleJournalArr(res.Data, 'jou')
            this.querydata.journal = this.options[this.options.length-1].value
            this.conditionSelect()
            this.handleClickEchart()
          }
          
        }
      });
    },
    // 处理数组
    handleJournalArr(arr, flag) {
      var Arr = []
      arr.forEach(item => {
        if(flag == 'jou') {
          Arr.push({value: item.id, label: item.title})
        }else {
          Arr.push({value: item.id, label: item.articlename})
        }
      });
      return Arr
    },
    // 文章列表
    conditionSelect(val) {
      this.$get(`GetEjArticlelistWhere?cond=journalid&arg=${this.querydata.journal}`).then(res => {
        if (res.Code == 200 && res.Data) {
          this.isDis = false
          if(res.Data.length > 0) {
            this.Artoptions = this.handleJournalArr(res.Data, 'art')
            this.querydata.article = ''
          }
          this.handleClickEchart()
        }
      });
    },
    articleSelect() {
      this.handleClickEchart()
    },
    // 获取图表数据
    handleClickEchart() {
      if(this.querydata.journal != '') {
        this.thirtyDay = this.getMounthThirty()
        this.$get(`GetTotalEjCount?journalvisit=${this.querydata.journal}&pagevisit=${this.querydata.article}`).then(res => {
          if (res.Code == 200 && res.Data) {
            this.handleTotalaccrued(res.Data.TotalpageAll.totalcouts, 'addUppersons')
            this.handleTotalaccrued(res.Data.Totalpage.counts, 'visitorpersons')
            console.log(this.addUppersons,'xxx')
            if(res.Data.Pagevisit) {
              // this.Accruedvisit = this.handleVisitArr(res.Data.Accruedvisit)
              this.Pagevisit = this.handleVisitArr(res.Data.Pagevisit)
              this.darwLine()
            }
          }
        });
      
      }else{
         this.$message({
                message: '请选择杂志期刊！',
                type: 'warning',
                customClass: 'form-error',
                showClose: true,
                duration: 2000,
            });
      }
    },
    // 处理总数和访问人数
    handleTotalaccrued(str, key) {
      this[key] = str
    },
    handleVisitArr(arr) {
      var Arr = []
      this.thirtyDay.forEach(item => {
        var count = 0
        arr.forEach(Item => {
          if(item == Item.gtime) {
            count = Item.counts
          }  
        })
        Arr.push(count)
      })
      console.log(Arr)
      return Arr
    },
    // 绘制图画
    darwLine(arr) {
      var myChart = echarts.init(this.$refs['echartsType'])
      var option = {
          title: {
              text: '近30天访问趋势',
              left: '1%',
          },
          tooltip : {
              trigger: 'axis',
              axisPointer: {
                  type: 'cross',
                  label: {
                      backgroundColor: '#6a7985'
                  }
              }
          },
          colors: ['#4572a8','#aa4643','#89a64e',],
          legend: {
              data:['访问人数',] //'累计用户数'
          },
          toolbox: {
              feature: {
                  saveAsImage: {}
              }
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis : [
              {
                  type : 'category',
                  boundaryGap : false,
                  data : this.thirtyDay
              }
          ],
          yAxis : [
              {
                  type : 'value'
              }
          ],
          series : [
              // {
              //     name:'访问人数',
              //     type:'line',
              //     stack: '总量',
              //     areaStyle: {normal: {}},
              //     data: this.Pagevisit,
              //     itemStyle : {
              //       color:'#d06d6a'    
              //         // normal : {  
              //         //     lineStyle:{  
              //         //         // color:'#00FF00'  
              //         //     }  
              //         // }  
              //     },  
              // },
              {
                  name:'访问人数',
                  type:'line',
                  stack: '总量',
                  label: {
                      normal: {
                          show: true,
                          position: 'top'
                      }
                  },
                  itemStyle : {  
                      color:'#807fdb'
                      // normal : {  
                      //     lineStyle:{  
                      //         color:'#4572a8'  
                      //     }  
                      // }  
                  },  
                  areaStyle: {normal: {}},
                  data: this.Pagevisit
              }
          ]
      };
      myChart.setOption(option,true);
    },
    handelClear() {
      this.isDis = true;
      this.querydata.article = ''
      console.log(111)
    },
    getMounthThirty() {
      var lastMonth = [];
      for(var i = 0;i<30;i++){
        lastMonth.unshift(new Date(new Date()
        .setDate(new Date().getDate()-i))
        .toLocaleString().substring(0,10))
      }
      lastMonth.forEach((item,i) => {
        lastMonth[i] = (new Date(item)).Format("yyyy-MM-dd")
      }) 
      return lastMonth
    }

  },
  created() {
    this.pageListonLoad()
  },
  mounted() {
    // console.log(lastMonth,11)
    
    // this.handleClickEchart()
  }
}
</script>


