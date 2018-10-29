/**
 * @author lsf
 * @Description 定义全局过滤器
 * @return   filter,computed,method区别
 */
export { parseTime, formatTime } from '@/utils'

function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/* 数字 格式化*/
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

export function toThousandslsFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}
/**
 * @author lsf
 * @Date 2018/9/12 15:38
 * @Description 小数点格式化
 * @return
 */
export function decimalsFilter(value,decimals) {
    return Number(value).toFixed(decimals)
}
// /**
//  * @author lsf
//  * @Date 2018/9/14 15:58
//  * @Description  json属性复制
//  * @return
//  */
// export function copyRelatedAttrs(targetObj,fromObj) {
//   for(let key in targetObj){
//       targetObj[key]=fromObj[key]
//   }
//   return targetObj
// }
/**
 * @author lsf
 * @Date 2018/9/27 10:23
 * @Description js无原生startWith,endWith方法，自己实现
 * @return
 */
String.prototype.endWith=function(s){
    if(s==null||s==""||this.length==0||s.length>this.length)
        return false;
    if(this.substring(this.length-s.length)==s)
        return true;
    else
        return false;
    return true;
};
String.prototype.startWith=function(s){
    if(s==null||s==""||this.length==0||s.length>this.length)
        return false;
    if(this.substr(0,s.length)==s)
        return true;
    else
        return false;
    return true;
};

/**
 * @author lsf
 * @Date 2018/9/27 10:23
 * @Description 字符串startWith，endWith
 * @return
 */
export function iccidFM(keyICCId) {
    if (keyICCId == "" || keyICCId == null) {
        return "-";
    }
    var result;
    if (keyICCId && keyICCId !== "-") {
        keyICCId = keyICCId.trim();
        if (keyICCId.startWith("898600") || keyICCId.startWith("898602") || keyICCId.startWith("898604") || keyICCId.startWith("898607")) {
            result = "<span><i class='img-telecom telecom-mobile'></i>" + "<a href='javascript:void(0);'>" + keyICCId + "</a></span>";
        } else if (keyICCId.startWith("898601") || keyICCId.startWith("898609") || keyICCId.startWith("898606")) {
            result = "<span><i class='img-telecom telecom-unicom'></i>" + "<a href='javascript:void(0);'>" + keyICCId + "</a></span>";
        } else if (keyICCId.startWith("898603") || keyICCId.startWith("898611")) {
            result = "<span><i class='img-telecom telecom-telecom'></i>" + "<a href='javascript:void(0);'>" + keyICCId + "</a></span>";
        } else
            result = "<span><i class='img-telecom'></i>" + "<a href='javascript:void(0);'>" + keyICCId + "</a></span>";
    }
    return result || "-";
}

export function toDecimals(value, digits) {
    var number = parseFloat(value);
    digits = parseInt(digits);
    if (isNaN(number) || isNaN(digits)) {
        return value;
    }
    var ratio = Math.pow(10, digits);
    number = Math.round(number * ratio) / ratio;

    var result = number.toString();
    var rs = result.indexOf('.');
    if (rs < 0) {
        rs = result.length;
        result += '.';
    }
    while (result.length <= rs + digits) {
        result += '0';
    }
    return result;
}

/**
 *  流量格式化到G，初始单位K(调整小数点单位)
 * @param value
 */
export function trafficFormat(value,decimals){
    if( !value || typeof value !== "number")
        return 0;
    if( value<Math.pow(10,3)){
        return value +"K";
    } else if(value<Math.pow(10,6)){
        return toDecimals(value/1000,3)+"M";
    } else return toDecimals(value/Math.pow(10,6),decimals || 3)+"G";
}

export function limitFormat(value) {
    if (value.toString() === "0") {
        value = '不限'
    } else {
        value = toDecimals(value, 3);
    }
    return value;
}

export  function formatTimeMSec2Day(timeVal) {
    // timeVal = parseInt(timeVal / 1000); //parseInt(timeVal/1000);
    if (!timeVal || timeVal === "NaN" || timeVal < 0) {
        timeVal = 0;
    }
    var result = "";
    if (timeVal >= 24 * 3600) {
        result += parseInt(timeVal / (24 * 3600)) + "D ";
        timeVal = timeVal % (24 * 3600);
    }
    if (timeVal >= 0 && timeVal < 60) {
        result += "00:00:" + (timeVal < 10 ? ("0" + parseInt(timeVal)) : parseInt(timeVal));
    } else if (timeVal >= 60) {
        if (timeVal >= 3600) {

            result += (parseInt(timeVal / 3600) < 10 ? ("0" + parseInt(timeVal / 3600)) : parseInt(timeVal / 3600)) + ":";
            if (timeVal % 3600 > 0) {
                var t1 = timeVal % 3600;
                result += (parseInt(t1 / 60) < 10 ? ("0" + parseInt(t1 / 60)) : parseInt(t1 / 60)) + ":";
                if (t1 % 60 > 0) {
                    result += (t1 % 60 < 10 ? ("0" + t1 % 60) : t1 % 60);
                } else {
                    result += "00";
                }
            } else {
                result += "00:00";
            }
        } else {
            result += "00:" + (parseInt(timeVal / 60) < 10 ? ("0" + parseInt(timeVal / 60)) : parseInt(timeVal / 60)) + ":";
            if (timeVal % 60 > 0) {
                result += (timeVal % 60 < 10 ? ("0" + timeVal % 60) : timeVal % 60);
            } else {
                result += "00";
            }
        }
    }
    return result;
};


