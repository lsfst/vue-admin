/**
 * Created by sz on 2018/10/11.
 * 表单验证方法，通用的方法直接在这里统一定义好
 * 1.需要进行dom操作的验证，直接在相应的vue实例里面通过watch操作
 * 2.需要根据其他字段值进行判断的，直接在data里面定义validate方法，就可以通过this获取相应值
 * 3.validate方法只有三个固定参数rule,value,callback，无法自定义参数，因此长度判断只能直接用自带的min,width
 */

/**
 * @author lsf
 * @Date 2018/10/12 13:49
 * @Description 数字检查
 * @return
 */
export function digit(rule, value, callback) {
    const reg = /^\d+$/
    if (!value) {
        callback()
    } else if (!reg.test(value)) {
        return callback(new Error('请输入数字'))
    } else {
        callback()
    }
}

/**
 * @author lsf
 * @Date 2018/10/12 14:27
 * @Description integer
 * @return
 */
export function integer(rule, value, callback) {
    const reg = /^(?:-?(?:0|[1-9][0-9]*))$/
    if (!value) {
        callback()
    } else if (!reg.test(value)) {
        return callback(new Error('请输入整数'))
    } else {
        callback()
    }
}

/**
 * @author lsf
 * @Date 2018/10/12 13:50
 * @Description 身份证
 * @return
 */
export function identity(rule, value, callback) {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    if (value==undefined || value==null || value=="") {
        callback()
    } else if (!reg.test(value)) {
        return callback(new Error('证件号码不正确'))
    } else {
        callback()
    }
}

// /**
//  * @author lsf
//  * @Date 2018/10/12 13:52
//  * @Description 小数点检查：类似金钱,首位不为0,最多2位小数
//  * @return
//  */
// export function decimals(rule, value, callback) {
//     const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
//     if (!value) {
//         callback()
//     } else if (!reg.test(value)) {
//         return callback(new Error('请填写数字,最多2位小数'))
//     } else {
//         callback()
//     }
// }

/**
 * @author lsf
 * @Date 2018/10/12 13:55
 * @Description required验证
 * @return
 */
export function required(rule, value, callback) {
    if (value==undefined || value==null || value=="") {
        return callback(new Error('必填字段'))
    } else {
        callback()
    }
}
/**
 * @author lsf
 * @Date 2018/10/16 11:57
 * @Description  ip验证
 * @return
 */
export function ip(rule, value, callback) {
    let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    if (value==undefined || value==null || value=="" || value==[]) {
        callback()
    } else {
        if(Array.isArray(value)){
            for(let v in value){
                if(!reg.test(value[v])){
                    return callback(new Error('存在无效ip地址'))
                }
            }
        }else {
            if(value.indexOf(",")!=-1){
                let arr=value.split(",");
                for(let v in arr){
                    if(!reg.test(arr[v])){
                        return callback(new Error('存在无效ip地址'))
                    }
                }
            }else {
                if(!reg.test(v)){
                    return callback(new Error('存在无效ip地址'))
                }
            }
        }
    }
     callback()
}

/**
 * @author lsf
 * @Date 2018/10/12 13:55
 * @Description 中文检查：禁用
 * test 与 exec:test返回boolean（是否存在模式） ，exec返回数组（匹配结果）
 * @return
 */
export function zh(rule, value, callback) {
    var patrn=/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;//存在中文
    if (value==undefined || value==null || value=="") {
        callback()
    } else if(patrn.test(value)){
        return callback(new Error('不支持中文'))
    }else {
        callback()
    }
}

/**
 * @author lsf
 * @Date 2018/10/12 15:02
 * @Description 大小判断
 * @return
 */
export function moreThan(rule, value, callback) {
    let min=this.min || 0;

    if (value==undefined || value==null || value=="") {
        callback()
    } else if(value<=min){
        return callback(new Error('必须大于'+min))
    }else {
        callback()
    }
}

/**
 * @author lsf
 * @Date 2018/10/12 15:02
 * @Description 大小判断
 * @return
 */
export function strLen(rule, value, callback) {
    let min=this.min || 0;
    let max=this.max || 0;

    return function (rule, value, callback) {
        if (value==undefined || value==null || value=="") {
            callback()
        } else if(value.length<min || value.length>max){
            return callback(new Error('请输入一个长度在'+min+'和'+max+'之间的字符串'))
        }else {
            callback()
        }
    }()

}

/**
 * @author lsf
 * @Date 2018/10/12 14:49
 * @Description  validate统一转换
 * 对于批量编辑，去除required限制
 * 将验证配置直接放进tableList，传进来的是tableList
 *  tableList: [
                {name: 'keyDevGrpID', vali:{required:true,strLen:[a,b],zh:false,moreThan:10,trigger:'change'}},
                ]
 * eg:keyDevGrpID:{required:true,strLen:[a,b],zh:false,moreThan:10,trigger:'change'}===>
 *  keyDevGrpID: [
 {validator:required, trigger: 'change'},
 { min:a,max: b, message: '长度在'a+'和'+b+'个字符内', trigger: 'change'},
 {validator: zh, trigger: 'change'}.
 {validator:function (rule, value, callback) {
                            if (value < 10) {
                                callback(new Error('不能小于10'))
                            } else {
                                callback();
                            }
                        }, trigger: 'change'}
 ],
 * @return
 */
export function _getValidateRules(tableList, isEdit) {
    isEdit = isEdit || false
    let validateRules = {}, field = "", trigger = "blur";
    if (tableList && Array.isArray(tableList)) {
        for (let obj of tableList) {
            field = obj.name;
            let vali = obj.vali,valiArr = [];
            if (vali) {
                trigger = vali.trigger || trigger;
                if (vali.required && !isEdit) {
                    valiArr.push({required:true,message:'必填字段', trigger: trigger})
                }
                if (vali.zh != undefined && !vali.zh) {
                    valiArr.push({validator: zh, trigger: trigger})
                }
                if (vali.ip) {
                    valiArr.push({validator: ip, trigger: trigger})
                }
                if (vali.integer) {
                    valiArr.push({validator: integer, trigger: trigger})
                }
                if (vali.strLen) {
                    //数组或单个数字
                    if (Array.isArray(vali.strLen)) {
                        let min = 0, max = 0;
                        if (vali.strLen.length == 1) {
                            max = vali.strLen[0]
                        } else if (vali.strLen.length == 2) {
                            max = vali.strLen[1]
                            min = vali.strLen[0]
                        }
                        valiArr.push({min:min,max:max,message:'请输入一个长度在'+min+'和'+max +'间的字符串', trigger: trigger})
                    }
                }
                if (vali.moreThan) {
                    valiArr.push({
                        validator: function (rule, value, callback) {
                            if (value == undefined || value == null || value == "") {
                                callback()
                            } else if (value < vali.moreThan) {
                                return callback(new Error('请输入一个大于' + vali.moreThan + '的值'))
                            } else {
                                callback()
                            }
                        }, trigger: trigger
                    })
                }
                if (vali.lessThan) {
                    valiArr.push({
                        validator: function (rule, value, callback) {
                            if (value == undefined || value == null || value == "") {
                                callback()
                            } else if (value > vali.lessThan) {
                                return callback(new Error('请输入一个小于' + vali.lessThan + '的值'))
                            } else {
                                callback()
                            }
                        }, trigger: trigger
                    })
                }
                if (vali.decimals) {
                    let decimals = parseInt(vali.decimals);
                    valiArr.push({
                        validator: function (rule, value, callback) {
                            let valArr = value && value.toString().split(".");
                            if (value == undefined || value == null || value == "") {
                                callback()
                            }else if (isNaN(decimals) || isNaN(parseFloat(value)) || !isFinite(value)) {
                                callback()
                            } else if (valArr && valArr.length===2 && ( valArr[1].length > decimals )) {
                                return callback(new Error('小数点限制' + decimals+ '位'))
                            } else {
                                callback()
                            }
                        }, trigger: trigger
                    })
                }
                if (vali.repeatCheck) {
                    //重复id检测
                    valiArr.push({
                        validator: function (rule, value, callback) {
                            if (value == undefined || value == null || value == "") {
                                callback()
                            }else {
                                var arr = value.split(",");
                                var num = arr.length;
                                var checkArr=[];
                                for (var str = 0; str < arr.length; str++) {
                                    //检查重复元素
                                    if (arr[str].indexOf("-") > 0) {
                                        var arr0 = arr[str].split("-");
                                        if (arr0[0].length >= 8) {
                                            var start = arr0[0].substring(arr0[0].length - 8, arr0[0].length);
                                            var end = arr0[1].substring(arr0[1].length - 8, arr0[1].length);
                                            if (end > start)
                                                num += end - start;
                                        } else {
                                            return callback(new Error('id长度不足8位'))
                                        }
                                    } else if (arr[str].trim() == "") {
                                        num--;
                                    }else {
                                        checkArr.push(arr[str]);
                                    }
                                }
                                var map=arrRepeatCheck(checkArr);
                                if(map.size==0){
                                    callback()
                                }else {
                                    //输出重复列表
                                    return callback(new Error('存在重复ID:'+JSON.stringify(map)))
                                }
                            }
                        }, trigger: trigger
                    })
                }
                if(vali.valid){
                    if(typeof vali.valid === "function"){
                        valiArr.push({
                            validator: vali.valid, trigger: trigger
                        })
                    }
                }
                if(vali.editValid && isEdit){
                    if(typeof vali.editValid === "function"){
                        valiArr.push({
                            validator: vali.editValid, trigger: trigger
                        })
                    }
                }
            }
            if(valiArr.length>0){
                validateRules[field] = valiArr
            }
        }
    }
    return validateRules
}

function arrNoExist(arr,ele){
    //indexOf并不能完全检查出相同id  如：11112,111121 最好的还是数组遍历,不过实际上并不存在这样的情况
    var arrStr = JSON.stringify(arr);
    if(arrStr.indexOf(ele)==-1){
        return true;
    }
    return false;
}

function arrRepeatCheck(arr){
    var arrStr = JSON.stringify(arr);
    var repeatArr=[];
    var repeat=new Map();
    for (var i = 0; i < arr.length; i++) {
        var repeatLen=arrStr.match(new RegExp(arr[i],"g")).length;
        //会重复打印，先存进arr
        if (repeatLen>1 && arrNoExist(repeatArr,arr[i])){
            repeatArr.push(arr[i]);
            // console.log(arr[i]+":"+repeatLen);
            repeat.set(arr[i],repeatLen);
        }
    }
    return repeat;
}

const vifidevGrp_rules={
    keyDevGrpID: [
        {validator:required, trigger: 'blur'},
        { max: 64, message: '长度在 64 个字符内', trigger: 'blur'},
        {validator: zh, trigger: 'blur'}
    ],
    name: [
        {validator:required, trigger: 'blur'},
        { max: 64,message: '长度在64个字符内', trigger: 'blur'}
    ],
    termAuthType: [{validator:required, trigger: 'blur'}],
    devExpire: [{
        validator: function (rule, value, callback) {
            if (value < 180) {
                callback(new Error('最小值为180'))
            } else {
                callback();
            }
        }, trigger: 'blur'
    }],
    rateLimit: [{
        validator: function (rule, value, callback) {
            if (value < 10) {
                callback(new Error('不能小于10'))
            } else {
                callback();
            }
        }, trigger: 'blur'
    }],
    dayLimitVal: [{
        validator: function (rule, value, callback) {
            if (value > 2000) {
                callback(new Error('最大值为2000'))
            } else {
                callback();
            }
        }, trigger: 'blur'
    },
        {
            validator: function (rule, value, callback) {
                var valArr = value && value.split(".");
                //空值检测是required的职责，这里空值通过
                if( value===null || value===undefined || value===""){
                    callback();
                }
                if( valArr && valArr.length===2 && ( valArr[1].length > 3 )){
                    callback(new Error('小数点限制3位'))
                }
                callback();
            }, trigger: 'blur'
        }],
    dayLimitRate: [{
        validator: function (rule, value, callback) {
            if (value < 10) {
                callback(new Error('不能小于10'))
            } else {
                callback();
            }
        }, trigger: 'blur'
    }],
    monLimitVal: [{
        validator: function (rule, value, callback) {
            if (value > 2000) {
                callback(new Error('最大值为2000'))
            } else {
                callback();
            }
        }, trigger: 'blur'
    },{
        validator: function (rule, value, callback) {
            //空值检测是required的职责，这里空值通过
            if( value===null || value===undefined || value===""){
                callback();
            }
            let valArr = value && value.split(".");
            if( valArr && valArr.length===2 && ( valArr[1].length > 3 )){
                callback(new Error('小数点限制3位'))
            }
            callback();
        }, trigger: 'blur'
    }],
    monLimitRate: [{
        validator: function (rule, value, callback) {
            if (value < 10) {
                callback(new Error('不能小于10'))
            } else {
                callback();
            }
        }, trigger: 'blur'
    }],
}

