<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: kakachake
 * @Date: 2019-12-21 11:05:03
 * @LastEditors  : kakachake
 * @LastEditTime : 2019-12-21 11:06:26
 -->
<template>
  <div>
        <template>
            <el-row>
                <el-col :span="12">
                    <h3>原四元式：</h3>
                    <el-table
                    :data="quaList"
                    height="400"
                    border
                    :stripe="true"
                    style="width: 100%">
                    <el-table-column
                    type="index"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="op"
                    label="op"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="arg1"
                    label="arg1"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="arg2"
                    label="arg2">
                    </el-table-column>
                    <el-table-column
                    prop="result"
                    label="result">
                    </el-table-column>
                </el-table>
                </el-col>
                <el-col :span="12">
                    <h3>DAG优化后：</h3>
                    <el-table
                    :data="dagGrammar"
                    height="400"
                    border
                    :stripe="true"
                    style="width: 100%">
                    <el-table-column
                    type="index"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="op"
                    label="op"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="arg1"
                    label="arg1"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="arg2"
                    label="arg2">
                    </el-table-column>
                    <el-table-column
                    prop="result"
                    label="result">
                    </el-table-column>
                </el-table>
                </el-col>
            </el-row>
        </template>
  </div>
</template>

<script>
export default {
    props:['grammar', 'dagGrammar'],
    computed:{
        quaList(){
            return this.grammar.quadrupleList
        }
    }
}

</script>
<style>
</style>