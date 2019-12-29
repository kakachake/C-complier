/**
 * 词法分析器
 */
import {Word, Error} from './entity'
export class Lexical {
    wordList = [];  // 单词表
    errorList = [];  // 错误信息列表
    noteFlag = false;  // 多行注释标志
    errorFlag = false;  // 词法分析出错标志
    dataList = this.wordList;  // 浅拷贝，统一数据格式，方便前端渲染
    /**
     * 构造函数
     */
    constructor(str) {
        str.forEach((v, index) => {  // 对每行进行分析
            this.analyse(v.trim(), index + 1);
        });
        if (this.noteFlag) {  // 如果仍然存在多行注释的标志
            this.errorList.push(new Error(Word.MULTI_COMMENT_NO_FINAL_SYMBOL, str.length, str[str.length - 1]));
        } else {
            if (this.wordList.length) {  // 如果单词列表不为空，即str不为空字符串
                if (this.wordList.slice(-1)[0]['type'] !== Word.END)   // 如果不是以$结束，即单词列表中最后一个单词的类型不为终结符
                    this.wordList.push(new Word(str.length + 1, "$", Word.END));  // 加入终结符单词，避免语法分析出错
            }
        }
    }


    isDigit = ch => '0123456789'.includes(ch);


    isInteger = word => {
        let flag = true;
        [...word].forEach(c => { 
            if (!this.isDigit(c)) flag = false;
        });
        return flag;
    };


    isChar = word => 0 <= word.charCodeAt(0) && word.charCodeAt(0) <= 255;


    isLetter = ch => ch.length === 1 && ch.match(/[a-z]/i) !== null;


    isID = word => {
        let i = 0;
        if (Word.isKey(word)) return false; 
        let temp = word.charAt(0);
        if (this.isLetter(temp) || temp === '_') {  // 合法的标识符以字母开头或者以下划线开头
            [...word].forEach(ch => {  
                if (this.isLetter(ch) || ch === '_' || this.isDigit(ch))  
                    i++;
            });
            if (i === word.length) 
                return true;
        }
        return false;
    };


    analyse = (str, line) => { 
        console.log(`正在分析第${line}行，当前字符串为${str}`);
        
        let beginIndex = 0, index = 0, length = str.length;
        let word = null, temp = null, tabs = [' ', '\t', '\r', '\n'];  
        let newWord = (value, type = Word.UN_DEFINE, flag = true) =>  // 新建单词函数
            new Word(line, value, type, flag);
        let newError = (word) => {  // 添加错误函数
            this.errorList.push(new Error(word.type, line, word.value));
            this.errorFlag = true;  // 错误标志置真
        };
        while (index < length) {  //
            temp = str.charAt(index);  
            if (!this.noteFlag) {  // 如果不处于多行注释中
                console.log(temp);
                if (this.isLetter(temp) || temp === '_' || this.isDigit(temp)) {  
                    beginIndex = index++;  // 赋值开始位置，移入
                    
                    while (index < length && !Word.isBoundarySign(str.charAt(index)) &&
                    !Word.isOperator(str.charAt(index)) && !tabs.includes(str.charAt(index))) { 
                        index++;
                    }
                    let w = str.substring(beginIndex, index);  // 取出字符串
                    if (Word.isKey(w)) {
                        word = newWord(w, Word.KEY);
                    } else if (this.isID(w)) { 
                        word = newWord(w, Word.IDENTIFIER);
                    } else if (this.isInteger(w)) { 
                        word = newWord(w, Word.INT_CONST);
                    }  else {  
                        word = newWord(w, Word.UN_DEFINE, false);
                        newError(word);
                    }
                    index--;  // 回退一位
                } else if (temp === "'") {  // 字符常量，以单引号开始
                    if (index + 2 >= length) {
                        word = newWord(str.substr(index, 2), Word.UN_DEFINE, false);
                        newError(word);
                    } else if (str.charAt(index + 2) !== "'") {
                        word = newWord(str.substring(index, length - 1), Word.CHAR_END_WITH_OTHER, false);
                        index += 2;
                        newError(word);
                    } else if (!this.isChar(str.charAt(index + 1))) {
                        word = newWord(str.substr(index, 3), Word.CHAR_ILLEGAL, false);
                        index += 2;
                        newError(word);
                    } else {
                        word = newWord(str.substr(index, 3), Word.CHAR_CONST);
                        index += 2;
                    }
                } else if (temp === '"') {  // 字符串常量，以双引号开始
                    beginIndex = index;
                    while (++index < length && this.isChar(str.charAt(index))) {  
                        if (str.charAt(index) === '"') 
                            break;
                    }
                    if (index < length || (str.charAt(index - 1) === '"' && beginIndex !== index - 1)) { // 如果没到末尾或者末尾是单引号，注意此时的index位置应该与开始时不一样
                        word = newWord(str.substring(beginIndex, index) + '"', Word.STRING_CONST);
                    } else if (str.substring(beginIndex,str.length).indexOf('"')===str.substring(beginIndex,str.length).lastIndexOf('"')) {
                        word = newWord(str.substring(beginIndex, index), Word.STRING_END_WITH_OTHER, false);
                        newError(word);
                    }
                    else{  // 出错
                        word = newWord(str.substring(beginIndex, index), Word.UN_DEFINE, false);
                        newError(word);
                    }
                } else if (temp === '!') {
                    if (index + 1 < length && str.charAt(index + 1) === '=') {  // 如果是不等于
                        word = newWord(str.substr(index++, 2), Word.OPERATOR);
                    } else {
                        word = newWord(str.substr(index, 1), Word.OPERATOR);
                    }
                }
                 else if (temp === '/') {
                    index++;
                    if (index < length && str.charAt(index) === '/')  // 双斜杠注释，跳过识别该行剩下的内容
                        break;
                    else if (index < length && str.charAt(index) === '*') {  // 多行注释开始
                        this.noteFlag = true;  // 置多行注释标志为真
                        break;
                    } else {  // 否则是除号
                        word = newWord(str.substr(index - 1, 1), Word.OPERATOR);
                    }
                    index--;
                } else if (temp === '>' || temp === '<') { 
                    if (index + 1 < length && str.charAt(index + 1) === '=') {  // 判断是不是<=或者>=
                        index++;
                        temp += '=';
                    }
                    word = newWord(temp, Word.OPERATOR);
                } else if (tabs.includes(temp)) {  
                    word = null;
                } else if (Word.isOperator(temp)){ 
                    console.log(temp+str.charAt(index+1));
                    if(Word.isOperator(temp+str.charAt(index+1))){
                        word = newWord(temp+str.charAt(index+1), Word.DOUBLE_OPERATOR);
                        index++;
                    }else{
                        word = newWord(temp, Word.OPERATOR);
                    }
                }
                else if (Word.isBoundarySign(temp))  // 如果是界符
                    word = newWord(temp, Word.BOUNDARY_SIGN);
                else if (temp === '$') {  // 如果是终结符
                    word = newWord(temp, Word.END);
                } else {  // 都不是，出错
                    word = newWord(temp, Word.UN_DEFINE, false);
                    newError(word);
                }
            } else {
                let i = str.indexOf("*/");  // 查找多行注释结束标志在本行的位置
                if (i !== -1) {  // 如果本行存在多行注释结束标志
                    this.noteFlag = false;  // 置多行注释标志为假
                    index = i + 2;  // 向后跳两个字符
                    continue;
                } else
                    break;
            }
            if (word != null) {  // 如果不是空，增加字符
                console.log(`本次词法分析到的单词为`);
                console.log(word);
                
                
                this.wordList.push(word);
            }
            index++;
        }
    };
}