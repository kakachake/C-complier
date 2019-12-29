<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: kakachake
 * @Date: 2019-12-19 08:55:03
 * @LastEditors  : kakachake
 * @LastEditTime : 2019-12-22 10:50:47
 -->
<template>
  <div>
    <el-menu  class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-submenu index="1">
            <template slot="title">文件</template>
            <el-menu-item index="2-1"><label for="files1">打开</label><input style="display:none;" type="file" id="files1" value="打开" @change="uploadFile"></el-menu-item>
            <el-menu-item index="new">新建</el-menu-item>
            <el-menu-item index="export" >保存</el-menu-item>
            <!-- <el-submenu index="2-4">
                <template slot="title">选项4</template>
                <el-menu-item index="2-4-1">选项1</el-menu-item>
                <el-menu-item index="2-4-2">选项2</el-menu-item>
                <el-menu-item index="2-4-3">选项3</el-menu-item>
            </el-submenu> -->
        </el-submenu>
        
    </el-menu>
  </div>
</template>

<script>
import {EventBus} from '../bus'
export default {
    methods:{
        handleSelect(key, keyPath){
            console.log(key, keyPath);
            if(key == 'new'){
                console.log("新建");
                this.$prompt('请输入工程名', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[0-9a-zA-Z_]+$/,
                    closeOnClickModal:false,
                    inputErrorMessage: '工程名为数字字母下划线组成'
                }).then(({ value }) => {
                    console.log(value);
                    
                    EventBus.$emit('newProject', {name:value, code:''});
                    this.$message({
                        type: 'success',
                        message: `工程${name}新建成功`
                    });
                }).catch((e) => {
                    console.log(e);
                    
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });       
                });
            }else if(key == 'export'){
                EventBus.$emit('export')
            }
        },
        uploadFile(){
            var code = ''
            const selectedFile = document.getElementById('files1').files[0]
            // 读取文件名
            var name = selectedFile.name
            var idx = name.indexOf(".c")
            console.log(idx);
            name = name.slice(0, idx)
            // 读取文件大小
            const size = selectedFile.size
            // FileReader对象，h5提供的异步api，可以读取文件中的数据。
            const reader = new FileReader()
            // readAsText是个异步操作，只有等到onload时才能显示数据。
            reader.readAsText(selectedFile)
            reader.onload = function () {
                    code = this.result
                    EventBus.$emit('newProject', {name, code});
            }
            console.log(code);
        }
    }
}

</script>
<style>
label{
    display: inline-block;
    width: 100%;
    height: 100%;
}
</style>