<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: kakachake
 * @Date: 2019-12-19 09:18:25
 * @LastEditors  : kakachake
 * @LastEditTime : 2019-12-19 09:19:18
 -->
<template>
    <div>
        <div>
          <h1 v-show="editableTabs.length==0" style="font-size:50px;text-align:center;margin:200px 0 0 0">小C编译器</h1>
          <h3 v-show="editableTabs.length==0" style="text-align:center;">by 张泰民</h3>
        </div>
        <el-tabs @tab-click="handleClick" v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
        <el-tab-pane
            v-for="(item, index) in editableTabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
        >
             <cProject ref="project" :title="item.title"  :code="item.content"></cProject>
        </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import cProject from './cProject'
import {EventBus} from '../bus'
  export default {
    components:{
      cProject
    },
    data() {
      return {
        editableTabsValue: '0',
        editableTabs: [],
        tabIndex: 0
      }
    },
    watch:{

    },
    methods: {
      addTab(targetName, code) {
        let newTabName = (this.tabIndex++) + '';
        this.editableTabs.push({
          title: targetName+'.c',
          name: newTabName,
          content: code
        });
        this.editableTabsValue = newTabName;
        console.log(code);
        
      },
      removeTab(targetName) {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      },
      handleClick(e){
          console.log(e.label);
          // this.$router.replace('/project/'+e.label)
      }
    },
    created(){
        EventBus.$on('newProject',({name, code})=>{
            console.log(name);
            console.log(code);
            
            this.addTab(name, code)
        })
        EventBus.$on('export',()=>{
            console.log(this.$refs);
            console.log(this.$refs.project);
            this.$refs.project[Number(this.editableTabsValue)].ExportData()
            
        })
    }
  }
</script>