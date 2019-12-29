/**
 * 单词类
 */
export class Word {
    value;  // 单词的值
    type;  // 单词类型
    line;  // 单词所在行
    flag = true;  // 单词是否合法

    /**
     * 构造函数，单词的合法性默认为真
     */
    constructor(line=0, value, type = "未知类型", flag = true) {
        this.value = value;
        this.type = type;
        this.line = line;
        this.flag = flag;
    }

    static KEY = "关键字";
    static OPERATOR = "运算符";
    static DOUBLE_OPERATOR = "双运算符";
    static INT_CONST = "整形常量";
    static CHAR_CONST = "字符常量";
    static BOOL_CONST = "布尔常量";
    static FLOAT_CONST = "浮点型常量";
    static STRING_CONST = "字符串常量";
    static IDENTIFIER = "标志符";
    static BOUNDARY_SIGN = "界符";
    static END = "结束符";
    static UN_DEFINE = "未知类型";
    static CHAR_END_WITH_OTHER = "定义的字符常量没有以单引号结尾";
    static CHAR_ILLEGAL = "定义的字符不合法";
    static STRING_END_WITH_OTHER = "定义的字符常量没有以双引号结尾";
    static MULTI_COMMENT_NO_FINAL_SYMBOL = "多行注释缺少结束标志";
    static key = ['void', 'main', 'return', 'bool', 'int', 'char', 'float', 'if', 'else', 'while', 'for',
        'printf', 'scanf'];  // 关键词集合
    static operator = ['+', '-', '++', '--', '*', '/', '>', '<', '>=', '<=', '==',
        '!=', '=', '&&', '||', '!', '?', '|', '&', '+=', '-=', '*=', '/='];  // 运算符集合
    static boundarySign = ['(', ')', '{', '}', ';', ','];  // 界符集合


    static isKey = function (word) {
        return this.key.includes(word)
    }
 
    static isOperator = function name(word) {
        return this.operator.includes(word);
    }



    static isBoundarySign = function name(word) {
        return this.boundarySign.includes(word);
    }


    static isArOperator = word => ['+', '-', '*', '/'].includes(word);

    static isComparisonOperator = word => ['>', '<', '!=', '==', '>=', '<='].includes(word);



    static isDataType = word => ["int", "char", "bool"].includes(word);

    static isSelfOperator = word => ['++', '--'].includes(word);

    static isNotStartKey = function (word) {
        return this.key.slice(3).includes(word);
    }


    static isConst = function (word) {
        return word.type === this.INT_CONST   // 如果单词是整形常数
        || word.type === this.CHAR_CONST  // 如果单词是字符串型常数
        || word.type === this.BOOL_CONST  // 如果单词是布尔型常数
        || word.type === this.STRING_CONST;  // 如果单词是字符串型常数
    }

}

/**
 * 错误单词类
 */
export class Error {
    info;  // 错误信息；
    line;  // 错误所在行
    word;  // 错误的单词


    constructor(info, line, word) {  // 构造函数
        this.info = info;
        this.line = line;
        this.word = word;
    }
}


/**
 * 分析栈节点类
 */
export class AnalyseNode {
    name;  // 节点名
    value;  // 节点值
    type;  // 节点类型
    children=[];// 孩子节点（构造语法分析树）
    image_url;


    constructor(name, type = "终结符", value = null) {
        this.name = name;
        this.value = value;
        this.type = type;
        this.image_url="https://static.refined-x.com/static/avatar.jpg";
    }

    static NON_TERMINAL_SYMBOL = "非终结符";
    static TERMINAL_SYMBOL = "终结符";
    static ACTION_SYMBOL = "动作符";
    static END_SYMBOL = "结束符";
    static nonTerminalSymbolList = ["S", "A", "B", "C", "D", "E", "F", "G", "H", "L", "M", "O", "P", "Q", "X", "Y", "Z", "R", "U", "Z'", "U'", "E'", "H'", "L'", "T", "T'"];  // 非终结符集合
    static actionSymbolList = ["@ADD_SUB", "@ADD", "@SUB", "@DIV_MUL", "@DIV", "@MUL", "@SINGLE", "@SINGLE_OP", "@ASS_R", "@ASS_Q", "@ASS_F", "@ASS_U", "@ASS_P", "@ASS_S", "@TRAN_LF", "@EQ", "@EQ_U'",  "printf", "scanf"];  // 动作符集合

    /**
     * 判断单词是否是非终结符
     */
    static isNonTerminalSymbol = function (word) {
        return this.nonTerminalSymbolList.includes(word.name);   
    }

    /**
     * 判断单词是否是终结符
     */
    static isTerminalSymbol = word => {
        let n = ['id', 'num', 'ch', 'str'];
        return (Word.isKey(word.name) || Word.isOperator(word.name) || Word.isBoundarySign(word.name)
            || n.includes(word.name)) && (word.name !== "printf" && word.name !== "scanf");
    };

    /**
     * 判断单词是否是动作符
     */
    static isActionSymbol = function (word){ return this.actionSymbolList.includes(word.name);} 
}

/**
 * 四元式
 */
export class Quadruple {
    op;  // 操作符
    arg1;  // 第一个操作数
    arg2;  // 第二个操作数
    result;  // 结果

    constructor(op, arg1, arg2, result) {
        this.op = op;
        this.arg1 = arg1;
        this.arg2 = arg2;
        this.result = result;
    }
}

