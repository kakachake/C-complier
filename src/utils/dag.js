/**
 * DAG优化
 */

/**
 * 节点类
 */
class node{
    left=-1
    right=-1
    id = ""
    var = []
    
    constructor(){
        this.var = []
    }
}

export class DAG{
    quadrupleList;
    DagQuadrupleList;
    nodeList=[];
    flag = []
    cnt = 0;

    constructor(quadrupleList, lexicalList){
        this.DagQuadrupleList = new Array()
        
        
        this.quadrupleList = quadrupleList
        this.templist = lexicalList.filter((w)=>{
            return w.type=="标志符"
        })
        this.wordlist = []
        for(var i = 0; i < this.templist.length; i++){
            if(!this.wordlist.find((e)=>{
                return e.value == this.templist[i].value
            })){
                this.wordlist.push(this.templist[i])
            }
        }
    }

    find_var(i, arg){
        if(this.nodeList[i].var.find((e)=>{
            return e == arg
        })){
            return 1;
        }else{
            return 0;
        }
    }

    add_operator(re, op, l, r){
        for(var i = this.cnt-1; i >= 0; --i){
            if(this.nodeList[i].left == l && this.nodeList[i].right == r && this.nodeList[i].id == op){
                this.nodeList[i].var.push(re);
                return ;
            }
        }
        this.nodeList.push(new node())
        this.nodeList[this.cnt].id = op;
        this.nodeList[this.cnt].var.push(re);
        this.nodeList[this.cnt].left = l;
        this.nodeList[this.cnt].right = r;
        this.cnt++;
    }

    dfs(x){
        if(this.nodeList[x].left != -1){
            this.flag[x] = 1;
            this.dfs(this.nodeList[x].left);
            if(this.nodeList[x].right!=-1){
                this.dfs(this.nodeList[x].right);
            }
        }
    }

    add_node(arg){
        
        for(var i = this.cnt - 1; i >= 0; --i){
            if(this.nodeList[i].id == arg || this.find_var(i, arg)) return i;
        }
        this.nodeList.push(new node())
        this.nodeList[this.cnt].id = arg;
        return this.cnt++;
    }

    dag(){
        for(var i = 0; i < this.quadrupleList.length; i++){
            var s = this.quadrupleList[i]
            var l = -1, r = -1;
            if(s.arg1!="/"){
                l = this.add_node(s.arg1)
            }
            if(s.arg2!="/"){
                r = this.add_node(s.arg2)
            }
            this.add_operator(s.result, s.op, l, r)
        }
        console.log(this.nodeList);
        
        for(var i = 0; i < this.cnt; ++i){
            if(this.nodeList[i].left != -1){
                this.DagQuadrupleList[i] = {}
                var ll = this.nodeList[this.nodeList[i].left]
                var rr = this.nodeList[this.nodeList[i].right]
                this.DagQuadrupleList[i].arg1 = ll&&ll.var.length>0?ll.var[0]:ll.id
                this.DagQuadrupleList[i].op = this.nodeList[i].id;
                if(this.nodeList[i].right != -1){
                    this.DagQuadrupleList[i].arg2 = rr&&rr.var.length>0?rr.var[0]:rr.id
                }else{
                    this.DagQuadrupleList[i].arg2 = "/"
                }
                this.DagQuadrupleList[i].result = this.nodeList[i].var[0];
            }
        }
        console.log(this.cnt);
        
        for(var i = 0; i < this.wordlist.length; i++){
            for(var j = this.DagQuadrupleList.length-1; j >= 0; --j){
                
                if(this.DagQuadrupleList[j]&&this.DagQuadrupleList[j].result == this.wordlist[i].value){
                    this.dfs(j);
                    break;
                }
            }
        }
        console.log(this.flag);
        
        var res = [];
        for(var i = 0; i < this.cnt; ++i){
            if(this.flag[i]){
                console.log(this.DagQuadrupleList[i]);
                res.push(this.DagQuadrupleList[i]);
            }
        }
        return res;
        // console.log(this.DagQuadrupleList);
    }
}