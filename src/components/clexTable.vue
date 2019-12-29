<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: kakachake
 * @Date: 2019-12-20 15:02:22
 * @LastEditors: kakachake
 * @LastEditTime: 2019-12-21 09:58:19
 -->
<template>
  <div class="">
      <template>
        <h2 v-show="lexicalErrorList&&lexicalErrorList.length" style="color:red;">错误：</h2>
        <el-table v-show="lexicalErrorList&&lexicalErrorList.length"
            :data="lexicalErrorList"
            border
            :stripe="true"
            style="width: 100%">
            <el-table-column
            type="index"
            >
            </el-table-column>
            <el-table-column
            prop="word"
            label="错误单词"
            >
            </el-table-column>
            <el-table-column
            prop="info"
            label="错误内容"
            >
            </el-table-column>
            <el-table-column
            prop="line"
            label="所在行">
            </el-table-column>
        </el-table>
        <el-table
            :data="lexicalList"
            height="400"
            border
            :stripe="true"
            style="width: 100%">
            <el-table-column
            type="index"
            >
            </el-table-column>
            <el-table-column
            prop="value"
            label="值"
            >
            </el-table-column>
            <el-table-column
            prop="type"
            label="类型"
            >
            </el-table-column>
            <el-table-column
            prop="line"
            label="所在行">
            </el-table-column>
        </el-table>
    </template>
  </div>
</template>

<script>
export default {
  name: '',
  data() { 
    return {

    }
  },
  props: {
      lexicalList:{
          type:Array
      },
      lexicalErrorList:{
          type:Array
      }
  },
  components:{
  },
  mounted() {

  },
  methods:{

  },
 }
</script>

<style scoped>

</style>