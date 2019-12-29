/*
 * @Description: 
 * @Version: 2.0
 * @Autor: kakachake
 * @Date: 2019-12-28 23:18:27
 * @LastEditors  : kakachake
 * @LastEditTime : 2019-12-29 00:01:32
 */
export class Assembly {
    R = new Array(15);
    max = 3; //最大寄存器数量
    cum = 0; //当前已使用数量
    quadrupleList;  // 四元式字符串数组
    targetCodeList = [];  // 目标代码字符串数组
    dataList = this.targetCodeList;  // 浅拷贝，统一数据格式，方便前端渲染
    now = 4;
    loop = false;


    /**
     * 构造函数
     */
    constructor(content) {
        this.quadrupleList = JSON.parse(JSON.stringify(content));  
        this.quadrupleList.forEach((quadruple, i) => {
            var pos = this.is_inR(quadruple.arg1);
            if(pos == -1){
                pos = this.get_pos(i);
                if(this.R[pos] && this.get_lastuse(i, this.R[pos])<this.quadrupleList.length){
                    this.targetCodeList.push("ST R"+pos+", "+this.R[pos])
                }
                this.targetCodeList.push("LD R"+pos+", "+quadruple.arg1)
            }
            this.R[pos] = quadruple.result
            if(quadruple.arg2!="/"){
                var oper = this.return_oper(quadruple.op);
                var right = this.get_right(quadruple.arg2)
                this.targetCodeList.push(oper + "R"+ pos + ", " + right)
            }
        });
    }

    get_right(c){
        var pos = this.is_inR(c);
        if(pos != -1){
            return "R"+pos;
        }else{
            return c;
        }
    }

    return_oper(c){
        if(c == '+'){
            return "ADD ";
        }else if(c == '-'){
            return "SUB ";
        }else if(c == '*'){
            return "MUL ";
        }else if(c == '/'){
            return "DIV ";
        }
    }

    is_inR(arg){
        for(var i = 0; i < this.max; i++){
            if(arg == this.R[i]){
                return i;
            }
        }
        return -1;
    }    

    get_pos(i){
        if(this.cum < this.max) return this.cum++;
        var ans = -1, mlu = -1;
        for(var j = 0; j < this.max; j++){
            var lu = this.get_lastuse(i, this.R[j]);
            if(lu > mlu){
                mlu = lu;
                ans = j;
            }
        }
        return ans;
    }

    get_lastuse(i, c){
        for(;i < this.quadrupleList.length;i++){
            if(this.quadrupleList[i].arg1 == c || this.quadrupleList[i].arg2&&this.quadrupleList[i].arg2 == c){
                return i;
            }
        }
        return this.quadrupleList.length;
    }
}