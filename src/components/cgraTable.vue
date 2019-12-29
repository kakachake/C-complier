<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: kakachake
 * @Date: 2019-12-21 09:18:35
 * @LastEditors  : kakachake
 * @LastEditTime : 2019-12-21 10:15:09
 -->
<template>
  <div>
      <template>
        <h2 v-show="errorList&&errorList.length" style="color:red;">错误：</h2>
        <el-table v-show="errorList&&errorList.length"
            :data="errorList"
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
        <h2 v-show="errorList&&errorList.length">语法分析结果：</h2>
        <el-table
            :data="analyseList"
            height="400"
            border
            :stripe="true"
            style="width: 100%">
            <el-table-column
            type="index"
            >
            </el-table-column>
            <el-table-column
            prop="analyseStackString"
            label="分析栈"
            >
            </el-table-column>
            <el-table-column
            prop="wordString"
            label="输入串"
            >
            </el-table-column>
            <el-table-column
            prop="semanticStackString"
            label="语义栈">
            </el-table-column>
        </el-table>
    </template>
  </div>
</template>

<script>
export default {
    props:['grammar'],
    computed:{
        analyseList(){
            return this.grammar.analyseResult
        },
        errorList(){
            return this.grammar.errorList;
        }
    }
}

</script>
<style>
</style>