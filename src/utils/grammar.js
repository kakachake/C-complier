/**
 * 词法分析结果类
 */

import {AnalyseNode, Word, Error, Quadruple} from './entity'
import {grammarObject} from './common'
class GrammarAnalyseResult {
    analyseStackString;  // 当前分析栈
    wordString;  // 当前输入串
    semanticStackString;  // 当前语义栈
    constructor(analyseStackString, wordString, semanticStackString) {  // 构造函数
        this.analyseStackString = analyseStackString;
        this.wordString = wordString;
        this.semanticStackString = semanticStackString;
    }
}

/**
 * ES5标准，为数组类型添加获取尾元素的操作，用来模拟栈
 */
Array.prototype.top = function () {  // 获取栈顶元素
    if (this.length)  // 如果数组内有元素
        return this[this.length - 1];
    else
        return null;
};

/**
 * 词法分析类
 */
export class Grammar {
    lexical;  // 词法分析器
    wordList = [];  // 单词列表
    analyseStack = [];  // 分析栈
    semanticStack = [];  // 语义栈
    analyseResult = [];  // 语法分析过程
    analyseTree=[] //语法分析树
    quadrupleList = [];  // 四元式列表
    errorList = [];  //错误信息列表
    errorFlag = false;  // 语法分析出错标志
    tempVariableList = [];  // 临时变量列表
    dataList = this.analyseResult;  // 浅拷贝，统一数据格式，方便前端渲染
    /*私有变量*/
    op;
    arg1;
    arg2;
    res;

    /**
     * 构造函数
     */
    constructor(lexical) {  // 构造函数，继承词法分析结果
        this.lexical = lexical;
        this.wordList = lexical.wordList;
        grammarObject.S = new AnalyseNode("S", AnalyseNode.NON_TERMINAL_SYMBOL)
        if (this.wordList.length)
            this.analyse();
    }

    /**
     * 新建临时变量函数
     */
    newTempVariable = () => {
        const variable = "T" + (this.tempVariableList.length).toString();  
        this.tempVariableList.push(variable);  // 将新建的临时变量加入临时变量列表
        return variable;
    };
    /**
     * 新建全局变量函数
     */
    newVariable = () => {
        const variable = "D" + (this.tempVariableList.length).toString();  
        this.tempVariableList.push(variable);  // 将新建的临时变量加入临时变量列表
        return variable;
    };
    /**
     * 移进函数
     */
    forward = () => {
        this.analyseStack.pop();  // 弹出分析栈栈顶元素
        this.wordList.splice(0, 1);  // 弹出单词列表首元素
    };

    /**
     * 新建错误实例函数
     */
    newError = (info, word) => {
        // this.analyseStack.pop();  // 弹出分析栈栈顶元素
        // this.wordList.splice(0, 1);  // 弹出单词列表首元素
        // this.forward();  // 调用移进函数
        this.errorList.push(new Error(info, word.line, word.value));  // 新建错误实例放入栈
        this.errorFlag = true;  // 置出错标识为真
    };


    /**
     * 终结符处理函数
     */
    terminalSymbol = (symbol, word, treeNode) => {
        if (Word.isConst(word) || symbol === word.value) {  // 如果是常量
            this.forward();
            treeNode.push({
                name:word.value,
                image_url:"https://static.refined-x.com/static/avatar.jpg",
                // children:[],
                extend:false,
            })
        } else if (symbol === "id" && word.type === Word.IDENTIFIER) {  // 如果单词是标识符，并且分析栈栈顶元素是id
            this.forward();
            treeNode.push({
                name:word.value,
                // children:[],
                image_url:"https://static.refined-x.com/static/avatar.jpg",
                extend:false
            })
        } else {  // 都不符合，出错
            this.newError("语法错误", word);
            return false;
        }
    };

    /**
     * 非终结符处理函数
     */
    nonTerminalSymbol(symbol, word, treeNode) {
        let newWord = (value, type = Word.UN_DEFINE, flag = true) =>  // 新建单词函数
        new Word(1, value, type, flag);
        let p = ["Z'", "U'", "E'", "H'", "L'", "T'"];
        if (p.includes(symbol)) {  // 如果是带'的符号，需要特殊处理，便于使用switch
            symbol = (p.indexOf(symbol) + 1).toString();  // 将索引位置转化为字符
        }
        let production = [];  // 产生式列表
        let forwardProduction = () => {  // 移进
            this.analyseStack.pop();  // 弹出栈顶元素
            if(production.length==[]){
                treeNode.push({
                    name:'ε',
                    // children:[],
                    image_url:"https://static.refined-x.com/static/avatar.jpg",
                    extend:false
                })
            }else{
                production.forEach((v) => {
                    if (v.name){
                        this.analyseStack.push(v);  // 如果已经是AnalyseNode类型的，即产生式左边的符号，直接加入栈
                        if(!AnalyseNode.isActionSymbol(v) || ['printf','scanf'].includes(v.name))
                            if(['printf','scanf'].includes(v.name)){
                                treeNode.push({
                                    name:v.name,
                                    image_url:"https://static.refined-x.com/static/avatar.jpg",
                                    extend:false
                                })
                            }else{
                                treeNode.push(v)
                            }
                    } 
                    else {
                        let node = new AnalyseNode(v)
                        this.analyseStack.push(node);  // 如果不是，新建结点入栈
                        if(!AnalyseNode.isActionSymbol(v) || ['printf','scanf'].includes(node.name)){
                            if(['printf','scanf'].includes(node.name)){
                                treeNode.push({
                                    name:node.name,
                                    image_url:"https://static.refined-x.com/static/avatar.jpg",
                                    extend:false
                                })
                            }else{
                                treeNode.push(node)
                            }
                        }
                    } 
                });
            }
        };
        switch (symbol.charAt(0)) {
            case 'S':  // 开始符号
                if (word.value === 'void') {  // S->void main ( ) { A }
                    production = ['}', grammarObject.A(), '{', ')', '(', 'main', 'void'];
                    forwardProduction();
                } else if (word.value === 'int'){
                    production = ['}',';', new AnalyseNode("num", AnalyseNode.TERMINAL_SYMBOL), 'return', grammarObject.A(), '{', ')', '(', 'main', 'int'];
                    forwardProduction();
                }else {  // 设计主函数以void开始，暂不考虑设计函数
                    this.newError("主函数没有返回值", word);
                }
                break;
            case 'A': {
                if (Word.isNotStartKey(word.value)||word.type === Word.IDENTIFIER) {  // A->C A
                    production = [grammarObject.A(), grammarObject.C()];
                } else {  // A->ε
                    production = [];
                }
                forwardProduction();
                break;
            }
            case 'E': {  //E -> else E'
                if(word.value === 'else'){
                    production = [                        
                        grammarObject.E1(),
                        new AnalyseNode("else", AnalyseNode.TERMINAL_SYMBOL)
                    ]
                }else{
                    production=[]
                }
                forwardProduction();
                break;
            }
            case '3':{ //E' -> if(G) {A} E | {A}
                console.log("wordvalue==>>>>>>>>>>>>>>"+word.value);
                
                if(word.value === 'if'){
                    production = [
                        grammarObject.E(),
                        new AnalyseNode('}', AnalyseNode.TERMINAL_SYMBOL),
                        grammarObject.A(),
                        new AnalyseNode('{', AnalyseNode.TERMINAL_SYMBOL),
                        new AnalyseNode(')', AnalyseNode.TERMINAL_SYMBOL),
                        grammarObject.G(),
                        new AnalyseNode('(', AnalyseNode.TERMINAL_SYMBOL),
                        new AnalyseNode("if", AnalyseNode.TERMINAL_SYMBOL),
                    ];
                }else { 
                    production = [
                        new AnalyseNode('}', AnalyseNode.TERMINAL_SYMBOL),
                        grammarObject.A(),
                        new AnalyseNode('{', AnalyseNode.TERMINAL_SYMBOL)
                    ]
                }
                forwardProduction();
                break;
            }
            case 'B': {
                if (word.value === "printf") {  // B->printf ( P )  ;
                    production = [new AnalyseNode(';', AnalyseNode.TERMINAL_SYMBOL),
                        new AnalyseNode(')', AnalyseNode.TERMINAL_SYMBOL), grammarObject.P(),
                        new AnalyseNode('(', AnalyseNode.TERMINAL_SYMBOL),
                        new AnalyseNode("printf", AnalyseNode.ACTION_SYMBOL)
                    ];
                } else if (word.value === "scanf") {  // B->scanf ( id )  ;
                    production = [new AnalyseNode(';', AnalyseNode.TERMINAL_SYMBOL), 
                        new AnalyseNode(')', AnalyseNode.TERMINAL_SYMBOL),
                        new AnalyseNode("id", AnalyseNode.TERMINAL_SYMBOL, word.value),
                        new AnalyseNode('(', AnalyseNode.TERMINAL_SYMBOL),
                        new AnalyseNode("scanf", AnalyseNode.ACTION_SYMBOL)
                    ];
                } else if (word.value === "if") {  // B->if ( G )  { A }  E
                    production = [
                        grammarObject.E(),
                        new AnalyseNode('}', AnalyseNode.TERMINAL_SYMBOL),
                        grammarObject.A(),
                        new AnalyseNode('{', AnalyseNode.TERMINAL_SYMBOL),
                        new AnalyseNode(')', AnalyseNode.TERMINAL_SYMBOL),
                        grammarObject.G(),
                        new AnalyseNode('(', AnalyseNode.TERMINAL_SYMBOL),
                        new AnalyseNode("if", AnalyseNode.TERMINAL_SYMBOL),
                    ];
                } else if (word.value === "while") {  // B->while ( G )  { A } 
                    production = [
                        new AnalyseNode('}', AnalyseNode.TERMINAL_SYMBOL),
                        grammarObject.A(),
                        new AnalyseNode('{', AnalyseNode.TERMINAL_SYMBOL),
                        new AnalyseNode(')', AnalyseNode.TERMINAL_SYMBOL),
                        grammarObject.G(),
                        new AnalyseNode('(', AnalyseNode.TERMINAL_SYMBOL),
                        new AnalyseNode("while", AnalyseNode.TERMINAL_SYMBOL)
                    ];
                } else if (word.value === "for") {  // B-> for ( Y Z;  G ; Q) { A } 
                    production = [
                        new AnalyseNode('}', AnalyseNode.TERMINAL_SYMBOL),
                        grammarObject.A(),
                        new AnalyseNode('{', AnalyseNode.TERMINAL_SYMBOL),
                        new AnalyseNode(')', AnalyseNode.TERMINAL_SYMBOL),
                        grammarObject.Q(),
                        new AnalyseNode(';', AnalyseNode.TERMINAL_SYMBOL),
                        grammarObject.G(),
                        new AnalyseNode(';', AnalyseNode.TERMINAL_SYMBOL),
                        grammarObject.Z(),
                        grammarObject.Y(),
                        new AnalyseNode('(', AnalyseNode.TERMINAL_SYMBOL),
                        new AnalyseNode("for", AnalyseNode.TERMINAL_SYMBOL),
                    ];
                } else {  // B->ε
                    production = [];
                }
                forwardProduction();
                break;
            }
            case 'C':  // C->X B R
                production = [grammarObject.R(), grammarObject.B(), grammarObject.X()];
                forwardProduction();
                break;
            case 'X':
                if (Word.isDataType(word.value)) {  // X->Y Z ;
                    production = [new AnalyseNode(';', AnalyseNode.TERMINAL_SYMBOL), grammarObject.Z(), grammarObject.Y()];
                } else {  // X->ε
                    production = [];
                }
                forwardProduction();
                break;
            case 'Y':
                if (Word.isDataType(word.value)) {  // Y->int | bool | char
                    production = [new AnalyseNode(word.value, AnalyseNode.TERMINAL_SYMBOL)];
                    forwardProduction();
                } else {
                    production = [];
                    forwardProduction();
                }
                break;
            case 'Z':
                if (word.type === Word.IDENTIFIER) {  // Z-> U Z' //定义变量
                    production = [grammarObject.Z1(), grammarObject.U()];
                    forwardProduction();
                } else {
                    this.newError("非法标识符", word);
                }
                break;
            case '1':  // Z'
                if (word.value === ',') {  // Z'-> , Z
                    production = [grammarObject.Z(), new AnalyseNode(word.value, AnalyseNode.TERMINAL_SYMBOL)];
                } else {  // Z'->ε
                    production = [];
                }
                forwardProduction();
                break;
            case 'U':
                if (word.type === Word.IDENTIFIER) {  // U-> ASS_U id U'  //定义变量
                    production = [
                        grammarObject.U1(), new AnalyseNode("id", AnalyseNode.TERMINAL_SYMBOL, word.value), grammarObject.ASS_U];
                    forwardProduction();
                } else {
                    this.newError("非法标识符", word);
                }
                break;
            case '2':  // U'
                if (word.value === '=') {  // U'->= L @EQ_U' //定义变量
                    production = [grammarObject.EQ_U1, grammarObject.L(), new AnalyseNode(word.value, AnalyseNode.TERMINAL_SYMBOL)];
                } else {  // U'->ε
                    production = [];
                }
                forwardProduction();
                break;
            case 'R':
                if (word.type === Word.IDENTIFIER) {  // R-> @ASS_R id = L @EQ ; //更改变量值
                    if(this.wordList[1].type == "双运算符"){
                        if(['++','--'].includes(this.wordList[1].value)){
                            if(this.wordList[1].value == '++'){
                                this.wordList.splice(1, 1, newWord('=', Word.OPERATOR), newWord(word.value, Word.IDENTIFIER), newWord('+', Word.OPERATOR), newWord(1, Word.INT_CONST))
                            }else{
                                this.wordList.splice(1, 1, newWord('=', Word.OPERATOR), newWord(word.value, Word.IDENTIFIER), newWord('-', Word.OPERATOR), newWord(1, Word.INT_CONST))
                            }
                        }
                    }
                    production = [
                        new AnalyseNode(";", AnalyseNode.TERMINAL_SYMBOL),
                        grammarObject.EQ, grammarObject.L(),
                        new AnalyseNode("=", AnalyseNode.TERMINAL_SYMBOL),
                        new AnalyseNode("id", AnalyseNode.TERMINAL_SYMBOL, word.value), grammarObject.ASS_R,
                    ];
                } else {  // R->ε
                    production = [];
                }
                forwardProduction();
                break;
            case 'P':
                if (word.type === Word.IDENTIFIER) {  //P->@ASS_P id   grammarObject.ASS_P//语义动作符
                    production = [new AnalyseNode("id", AnalyseNode.TERMINAL_SYMBOL), grammarObject.ASS_P];
                    forwardProduction();
                } else if (word.type === Word.INT_CONST) {  // P->@ASS_P num
                    production = [new AnalyseNode("num", AnalyseNode.TERMINAL_SYMBOL), grammarObject.ASS_P];
                    forwardProduction();
                } else if (word.type === Word.CHAR_CONST) {  // P->@ASS_P ch
                    production = [new AnalyseNode("ch", AnalyseNode.TERMINAL_SYMBOL), grammarObject.ASS_P];
                    forwardProduction();
                } else if (word.type === Word.STRING_CONST) {  // P->@ASS_P str
                    production = [new AnalyseNode("str", AnalyseNode.TERMINAL_SYMBOL), grammarObject.ASS_P];
                    forwardProduction();
                } else {
                    this.newError("不能识别的数据类型", word);
                }
                break;
            case 'D':
                if (Word.isComparisonOperator(word.value)) {  // D-> ==  | !=  | > | < 
                    production = [new AnalyseNode(word.value, AnalyseNode.TERMINAL_SYMBOL)];
                    forwardProduction();
                } else {
                    this.newError("非法运算符", word);
                }
                break;
            case 'G': //比较大小
                if (word.type === Word.IDENTIFIER || word.type === Word.INT_CONST) {  // G->F D F
                    production = [grammarObject.F(), grammarObject.D(), grammarObject.F()];
                    forwardProduction();
                }else {
                    this.newError("数据类型无法进行算术运算", word);
                }
                break;
            case 'L': //变量四则运算
                if (word.type === Word.IDENTIFIER || word.type === Word.INT_CONST || word.type === Word.CHAR_CONST || word.type === Word.BOOL_CONST || word.value === '(') {  // L->T L' @ADD_SUB
                    production = [grammarObject.ADD_SUB, grammarObject.L1(), grammarObject.T()];
                    forwardProduction();
                } else {
                    this.newError("算数据类型无法进行算术运算或括号不匹配", word); 
                }
                break;
            case '5':  // L' //变量加减法
                if (word.value === '+') {  // L'->+ L @ADD
                    production = [grammarObject.ADD, grammarObject.L(), new AnalyseNode('+', AnalyseNode.TERMINAL_SYMBOL)];
                } else if (word.value === '-') {  // L'->- L @SUB
                    production = [grammarObject.SUB, grammarObject.L(), new AnalyseNode('-', AnalyseNode.TERMINAL_SYMBOL)];
                } else {  // L'->ε
                    production = [];
                }
                forwardProduction();
                break;
            case 'T': //T -> F T' //
                if (word.type === Word.IDENTIFIER || word.type === Word.INT_CONST || word.type === Word.CHAR_CONST || word.type === Word.BOOL_CONST || word.value === '(') {  
                    production = [grammarObject.DIV_MUL, grammarObject.T1(), grammarObject.F()];
                    forwardProduction();
                } else {
                    this.newError("数据类型无法进行算术运算", word);
                }
                break;
            case '6':  // T' 变量乘除
                if (word.value === '*') {  // T'->* T @MUL
                    production = [grammarObject.MUL, grammarObject.T(), new AnalyseNode('*', AnalyseNode.TERMINAL_SYMBOL)];
                } else if (word.value === '/') {  // T'->/ T @DIV
                    production = [grammarObject.DIV, grammarObject.T(), new AnalyseNode('/', AnalyseNode.TERMINAL_SYMBOL)];
                } else {  // T'->ε
                    production = [];
                }
                forwardProduction();
                break;
            case 'F':
                if (word.type === Word.IDENTIFIER) {  // F-> @ASS_F id //变量加减乘除
                    production = [new AnalyseNode("id", AnalyseNode.TERMINAL_SYMBOL, word.value), grammarObject.ASS_F];
                } else if (word.type === Word.INT_CONST || word.type === Word.BOOL_CONST) {  // F-> @ASS_F num
                    production = [new AnalyseNode("num", AnalyseNode.TERMINAL_SYMBOL, word.value), grammarObject.ASS_F];
                } else if (word.type === Word.CHAR_CONST) {  // F->@ASS_F ch
                    production = [new AnalyseNode("ch", AnalyseNode.TERMINAL_SYMBOL, word.value), grammarObject.ASS_F];
                } else if (word.value === '(') {  // F->( L )
                    production = [new AnalyseNode(')', AnalyseNode.TERMINAL_SYMBOL),
                        grammarObject.L(), new AnalyseNode('(', AnalyseNode.TERMINAL_SYMBOL)];
                } else {  // F->ε
                    production = [];
                }
                forwardProduction();
                break;
            case 'O':
                if (Word.isSelfOperator(word.value)) {  // O-> @SINGLE_OP ++ | @SINGLE_OP --
                    production = [new AnalyseNode(word.value, AnalyseNode.TERMINAL_SYMBOL)]
                } else {  // O->ε
                    production = [];
                }
                forwardProduction();
                break;
            case 'Q':
                if (word.type === Word.IDENTIFIER) {  // Q->  id O
                    production = [grammarObject.O(), new AnalyseNode("id", AnalyseNode.TERMINAL_SYMBOL, word.value)];
                } else {  // Q->ε
                    production = [];
                }
                forwardProduction();
                break;
        }
    }

    /**
     * 动作符处理函数
     */
    actionSymbol(symbol, word) {
        if (symbol === "printf") {
            this.op = "P";
            this.wordList.splice(0, 1);  // 弹出单词列表首元素
        } else if (symbol === "scanf") {
            this.op = "S";
            this.wordList.splice(0, 1);  // 弹出单词列表首元素
        } else if (symbol === "@ADD_SUB") {
            if (this.op != null && (this.op === "+" || this.op === "-")) {
                this.arg2 = this.semanticStack.pop();
                this.arg1 = this.semanticStack.pop();
                this.res = this.newTempVariable();
                this.quadrupleList.push(new Quadruple(this.op, this.arg1, this.arg2, this.res));
                this.semanticStack.push(this.res);
                this.op = null;
            }
        } else if (symbol === "@ADD") {
            this.op = "+";
        } else if (symbol === "@SUB") {
            this.op = "-";
        } else if (symbol === "@DIV_MUL") {
            if (this.op != null && (this.op === "*" || this.op === "/")) {
                this.arg2 = this.semanticStack.pop();
                this.arg1 = this.semanticStack.pop();
                this.res = this.newTempVariable();
                this.quadrupleList.push(new Quadruple(this.op, this.arg1, this.arg2, this.res));
                this.semanticStack.push(this.res);
                this.op = null;
            }
        } else if (symbol === "@DIV") {
            this.op = "/";
        } else if (symbol === "@MUL") {
            this.op = "*";
        }else if (["@ASS_F", "@ASS_R", "@ASS_U"].includes(symbol)) {
            this.semanticStack.push(word.value);
        } else if (symbol === "@ASS_P") {
            this.semanticStack.push(word.value);
            this.arg1 = this.semanticStack.pop();
            this.res = this.newVariable();
            if (word.type !== Word.IDENTIFIER) {
                this.quadrupleList.push(new Quadruple("D", this.arg1, "/", this.res));
                this.arg1 = this.res;
            }
            this.quadrupleList.push(new Quadruple(this.op, this.arg1, "/", "/"));
        } else if (symbol === "@EQ" || symbol === "@EQ_U'") {
            this.op = "=";
            this.arg1 = this.semanticStack.pop();
            this.res = this.semanticStack.pop();
            this.quadrupleList.push(new Quadruple(this.op, this.arg1, "/", this.res));
            this.op = null;
        }
        this.analyseStack.pop();
    }

    /**
     * LL(1)分析函数
     * */
    analyse() {
        let pushResult = () => {  // 将当前分析结果加入语法分析结果列表，语法糖
            let analyseStackString = '';
            this.analyseStack.forEach(v => analyseStackString += v.name+'');  // 箭头函数简写，下同
            let wordString = '';
            this.wordList.forEach(v => wordString += v.value+' ');
            let semanticStackString = this.semanticStack.toString();  // 字符串数组直接调用toString()，等于.join('')
            this.analyseResult.push(new GrammarAnalyseResult(analyseStackString, wordString, semanticStackString));  // 语法分析结果
        };
        if (!this.lexical.errorFlag) {  // 如果词法分析未出错
            this.analyseStack.push(new AnalyseNode('$', AnalyseNode.END_SYMBOL));  // 符号栈放入终结符
            this.analyseStack.push(grammarObject.S);  // 放入文法开始符号
            this.semanticStack.push('$');  // 语义栈放入终结符
            let i=0;
            while (this.analyseStack.length && this.semanticStack.length&&++i<=5000) {  // 如果符号栈与语义栈均不为空
                pushResult();
                if (!this.wordList.length) {  // 输入串为空，说明词法分析有BUG，未识别出错误的符号
                    this.errorFlag = true;
                    break;
                }
                let top = this.analyseStack.top();  // 当前栈顶元素
                let word = this.wordList[0];  // 待分析单词
                if (word.value === '$' && top.name === '$') {  // 分析结束，待分析单词与栈顶元素均为结束符
                    this.forward();  // 弹出所有元素，结束while循环
                } else if (top.name === '$') {  // 分析栈结束，输入串未结束，出错
                    this.analyseStack.pop();  // 弹出分析栈元素
                    this.errorFlag = true;  // 将错误标志置为真
                } else if (AnalyseNode.isTerminalSymbol(top)) {  // 栈顶是终结符
                    if(this.terminalSymbol(top.name, word, top.children)==false){
                        break;
                    }
                } else if (AnalyseNode.isNonTerminalSymbol(top)) {  // 栈顶是非终结符
                    this.nonTerminalSymbol(top.name, word, top.children);
                } else if (AnalyseNode.isActionSymbol(top)) {  // 栈顶是动作符
                    this.actionSymbol(top.name, word);
                }
                top.children.reverse();
            }
        }
    }
}