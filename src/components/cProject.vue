<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: kakachake
 * @Date: 2019-12-19 08:58:49
 * @LastEditors  : kakachake
 * @LastEditTime : 2019-12-28 23:54:00
 -->
<template>
  <div>
    <el-row >
        <el-col :span="24">
            <div style="border: 1px solid #ddd;font-size:24px;" id="div1">
                <textarea :id="'editor_demo'+id"></textarea>
            </div>
        </el-col>
    </el-row>
    <el-row>
            <el-button @click="getValue">编译</el-button>
    </el-row>
    <el-row>
            <el-col :span="12">
                <div class="ctable-wrap">
                    <h2 style="text-align:center;">词法分析</h2>
                    <clexTable
                        :lexicalList="lexicalList"
                        :lexicalErrorList="lexicalErrorList"></clexTable>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="ctable-wrap">
                    <h2 style="text-align:center;">语法分析</h2>
                    <cgraTable
                        :grammar="grammar"></cgraTable>
                </div>
            </el-col>
    </el-row>
    <el-row>
            <el-col :span="12">
                <div class="ctable-wrap">
                    <h2 style="text-align:center;">语义分析</h2>
                    <cquaTable
                        :grammar="grammar" :dagGrammar="dagGrammar"></cquaTable>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="ctable-wrap">
                    <h2 style="text-align:center;">目标代码</h2>
                    <el-card style="min-height:400px;max-height:400px; overflow:auto;">
                        <div v-for="item in this.assembly.dataList" :key="item">
                            {{item}}
                        </div>
                    </el-card>
                </div>
            </el-col>
    </el-row>
    <el-row >
        <div class="ctable-wrap"  style="overflow: auto;" >
            <h2>语法分析树</h2>
            <el-card style="overflow: auto;">
                <TreeChart :json="treeData"></TreeChart>
            </el-card>
        </div>
    </el-row>
  </div>
</template>

<script>
import {EventBus} from '../bus'
import TreeChart from "vue-tree-chart";
import clexTable from './clexTable'
import cquaTable from './cquaTable'
import cgraTable from './cgraTable'
import { DAG } from '../utils/dag'
import { Lexical } from '../utils/lexical'
// import { Assembly } from '../utils/assembly'
import { Assembly } from '../utils/_assembly'
import { Grammar } from '../utils/grammar'
import {grammarObject} from '../utils/common'
export default {
    props:['code', 'title'],
    watch:{
        $route() {
            // console.log("route");
            
            // if (this.$route) {
            //     this.init()
            // }
        }
    },
    components:{
        clexTable,
        cgraTable,
        cquaTable,
        TreeChart
    },
    data(){
        return {
            id:'',
            editor: null,
            lexicalList:[],
            grammar:{},
            treeData:[],
            assembly:{},
            lexicalErrorList:[],
            dagGrammar:[]
        }
    },
    methods:{
        addErrorLine(arr){  // 错误行在Textarea中标红
                arr.forEach((v) => {
                    console.log(v);
                    console.log(this.editor);
                    
                    this.editor.addLineClass(v.line - 1,  // 注意codeMirror行数默认从0开始
                        'wrap', 'errorLine');  // 为错误的行添加自定义的errorLine样式
                })
        },
        init() {
            var that = this
            console.log("editor_demo"+that.id);
            
            this.editor = CodeMirror.fromTextArea(document.getElementById("editor_demo"+that.id), {
                lineNumbers: true,
                indentWithTabs: true,
                mode: "text/x-csrc",  // 类C代码
                matchBrackets: true,
            });
            this.editor.setSize('100%','400');
        },
        getValue(){
            for (let i = 0; i < this.editor.lineCount(); ++i) {  // 清除上一次的标红信息
                if (this.editor.getLineHandle(i).wrapClass) {  // 如果存在覆盖的样式
                    this.editor.removeLineClass(i);  // 清除自定义的样式
                }
            }
            console.log(this.editor.getValue());
            var lexical = new Lexical(this.editor.getValue().split('\n'))
            console.log(lexical);
            this.lexicalList = lexical.dataList
            this.lexicalErrorList = lexical.errorList;
            this.grammar = new Grammar(JSON.parse(JSON.stringify(lexical)));

            this.treeData = grammarObject.S;
            this.dagGrammar = new DAG(this.grammar.quadrupleList, this.lexicalList).dag()

            this.assembly = new Assembly(this.grammar.quadrupleList);
            this.addErrorLine(this.lexicalErrorList);
            this.addErrorLine(this.grammar.errorList);
            console.log(this.assembly);
        },
        ExportData(){ 
            //定义文件内容，类型必须为Blob 否则createObjectURL会报错 
            let content = new Blob([this.editor.getValue()],{type:"text/plain"})
            
            //生成url对象 
            let urlObject = window.URL || window.webkitURL || window  
            console.log(window);
            
            console.log(urlObject);
            
            let url = urlObject.createObjectURL(content)  
            //生成<a></a>DOM元素 
            let el = document.createElement('a') 
            //链接赋值 
            el.href = url 
            el.download =this.title.indexOf(".c")!=-1?this.title: this.title+".c"
            //必须点击否则不会下载 
            el.click()
            //移除链接释放资源  
            urlObject.revokeObjectURL(url) 
        } 
    },
    mounted(){
        this.id = +new Date()
        this.$nextTick(()=>{
            this.init()
            this.editor.setValue(this.code)
        })
    },
}

</script>
<style>
.ctable-wrap{
    padding: 10px;
    margin: 10px;
    border:1px solid rgb(223, 223, 223);
    border-radius: 5px;
    background: #f8ffff
}
.CodeMirror{
    font-family: SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace !important;
}
.code-mirror{
    font-size: 18px;
}

.errorLine {
    background: #ffa39e;
}
</style>