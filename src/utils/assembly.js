/*
 * @Description: 
 * @Version: 2.0
 * @Autor: kakachake
 * @Date: 2019-12-20 08:51:11
 * @LastEditors  : kakachake
 * @LastEditTime : 2019-12-26 22:44:00
 */
/**
 * 目标代码类
 */
export class Assembly {
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
        this.quadrupleList.forEach(quadruple => {
            let res = null;
            switch (quadruple.op.charAt(0)) {
                case '=': {  
                    res = "LD " + quadruple.result + "," + quadruple.arg1;
                    break;
                }
                case '+': {  
                        this.targetCodeList.push("mov " + quadruple.result + "," + quadruple.arg1);
                        res = "add " + quadruple.result + "," + quadruple.arg2;
                    break;
                }
                case '-': {
                    {  
                        this.targetCodeList.push("mov " + quadruple.result + "," + quadruple.arg1);
                        res = "sub " + quadruple.result + "," + quadruple.arg2;
                    }
                    break;
                }
                case '*': {  
                    this.targetCodeList.push("mov " + quadruple.result + "," + quadruple.arg1);
                    res = "mul " + quadruple.result + "," + quadruple.arg2;
                    break;
                }
                case '/': {  
                    this.targetCodeList.push("mov " + quadruple.result + "," + quadruple.arg1);
                    res = "div " + quadruple.result + "," + quadruple.arg2;
                    break;
                }
                default: {
                    res = null;
                }
            }
            if (res) { 
                this.targetCodeList.push(res);
            }
        });
    }
}