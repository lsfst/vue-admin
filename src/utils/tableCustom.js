/**
 * Created by sz on 2018/9/18.
 * 表格相关的通用方法封装
 * 需要引用vue对象，call/apply 改变上下文
 * 总结通用属性:
 * tableKey-主键
 * list-数据列表
 * total-总数
 * listLoading-loading标识
 * listQuery-参数列表：通用参数{page: 1,offset: 0,limit: 20,orderList: []}
 * editDisable-编辑model显示标识
 * deleteDisable-删除model显示标识
 * checkedRows-checkbox选中列表
 *temp:{}  model框参数
 * dialogFormVisible-model显示
 *  textMap: {
                    update: 'edit',
                    create: 'create',
                    batchUpdate: 'batchEdit'
                }   -model状态
 * rules: {}  -model验证规则
 * singleRules：{}  -单选规则
 * batchRules：{}  -批量规则
 * downloadLoading -下载loading
 * selectLoading  -select loading
 * lastDebounce   -页面查询控制：作为定时任务标识作为节流控制
 * lastModifyTm   -页面查询控制：记录上次查询时间作为节流控制
 *
 * 关于表格组件模板
 * 正常来讲，搜索区和modal比较简单，应该是比较好实现的，但遇到remote select，肯定是在父组件中定义相应的remoteMothod,子组件用$emit去调用
 * 但子组件中也需要去注册相应的方法，这个没法动态实现
 *
 * 表格模板
 * 相关的标签主要有:
 * span:{v-text,
 *      v-html,
 *      date(带入icon前缀)
 * }
 * e-tag:{
 * type
 * }
 * expand
 * show checkbox控制column 显示
 *
 * 表格的不同字段可能需要进行不同过滤处理，这一步还是得在父组件中进行，子组件只需要展示数据即可
 * 补充：实践后发现，computed后的数据已经不是原始数据，无法正常处理编辑modal，所以这个表格模板只适用于统计类表的数据展示
 *困难：主要在于$i18必须挂载在vue实例上才能作用，不得不频繁call调用vue实例，而filter中无法获取到vue实例，因此只能选择在computed中处理，而这又与编辑冲突
 *
 * 解决：对于需要编辑操作的表格，可以在computed的时候进行属性复制，一份保存原值，一份用于展示;
 * 对于不需要修改的表格，直接操作keyID即可
 *
 * 参数总结
 * table:
 * items:{
 *      name,
 *      width:{
 *          length:
 *          min:true/false
 *      },
 *      type:{
 *           text,
 *           html,
 *           date,
 *           tag:{
 *              type:这个只能在数据传入时确认，可以在computed时增加一个tagList接受所有的tag-type
 *           }
 *      },
 *      show，
 *      label:表头
 * }
 *
 *  expandList:{
 *           name，
 *           label
 *      },

 *
 * /

 /**
 * @Date 2018/9/18 17:40
 * @Description 查询：清空chckedRows
 * @return
 */
import {iccidFM, trafficFormat, toDecimals,limitFormat} from '@/filters/index'
export function getList(func) {
    this.listLoading = true
    func(this.listQuery).then(response => {
        var data = response.data.data;
        this.list = data.contentList
        this.total = data.totalElements
        this.checkedRows=[]
        this.listLoading = false
    }).catch(() => {
        this.listLoading = false
        this.$notify({
            title: this.$t('table.selectError'),
            message: this.$t('table.selectError'),
            type: 'warning',
            duration: 2000
        })
    });
}
/**
 * @Date 2018/9/18 16:13
 * @Description 删除操作
 * @return
 */
export function handleDelete(func) {
    let idList = this.checkedRows.map(item => {
        return item.keyID || item[this.tableKey] ;
    })
    this.$confirm(this.$t('table.deleteTips').replace('{}',idList.length ), this.$t('table.tips'), {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel'),
        type: 'warning'
    }).then(() => {
        func(idList).then(response => {
            if (response.data.code == 0) {
                this.$message({
                    type: 'success',
                    message: this.$t('table.deleteSuccess')
                });
                this.getList()
            } else {
                this.$message({
                    type: 'error',
                    message: this.$t('table.deleteFailure')+':'+response.data.reason
                });
            }
        })
    }).catch(() => {
        this.$message({
            type: 'info',
            message: this.$t('table.deleteCancel')
        });
    });
}

function formatJson(filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => {
        return v[j]
    }))
}
/**
 * @Date 2018/9/18 16:16
 * @Description  表格下载操作
 * @return
 */
export function handleDownload(tHeader,func) {
    this.downloadLoading = true
    var exportListQuery = JSON.parse(JSON.stringify(this.listQuery));
    exportListQuery.table_columns = tHeader.join(",")
    exportListQuery.offset = 0
    //暂时限制1000条
    exportListQuery.limit = 1000
    func(exportListQuery).then(response => {
        const exportData = formatJson(tHeader, response.data.data.contentList);
        import
        ('@/vendor/Export2Excel').then(excel => {
            excel.export_json_to_excel({
                header: tHeader,
                data: exportData,
                filename: 'table-list'
            })
            this.$notify({
                title: this.$t('table.success'),
                message: this.$t('table.downLoadSuccess'),
                type: 'success',
                duration: 2000
            })

            this.downloadLoading = false
        })
    })
}
/**
 * @Date 2018/9/18 17:36
 * @Description 操作编辑表格
 * @return
 */
export function handleUpdate() {
    if (this.checkedRows.length > 1) {
        //批量编辑：重置所有选项
        this.dialogStatus = 'batchUpdate'
        this.rules = this.batchRules
        this.resetTemp()
    } else {
        //单项编辑
        //不应该简单替换为全部数据，而应只保留表单上的数据
        var temps = copyRelatedAttrs(this.temp, Object.assign({}, this.checkedRows[0]))
        //原始数据，需要处理radio和decimals
        this.temp=formatTemps(temps,this.tableList)
        this.dialogStatus = 'update'
        this.rules = this.singleRules
    }

    this.dialogFormVisible = true
    this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
    })
}
function copyRelatedAttrs(targetObj,fromObj) {
    for(let key in targetObj){
        targetObj[key]=fromObj[key]
    }
    return targetObj
}

function formatTemps(temps,tableList,isSubmit) {
    isSubmit=isSubmit || false
    for(let i=tableList.length-1;i>=0;i--){
        if(tableList[i].format &&  temps[tableList[i].name]){
            let ratio=tableList[i].format.ratio
            if(ratio){
                if(isSubmit){
                    temps[tableList[i].name]=temps[tableList[i].name]*ratio
                }else {
                    temps[tableList[i].name]=temps[tableList[i].name]/ratio
                }
            }
            if(tableList[i].format.decimals && !isSubmit){
                temps[tableList[i].name]=toDecimals(temps[tableList[i].name],tableList[i].format.decimals)
            }
        }
    }
    return temps
}
/**
 * @Date 2018/9/18 16:35
 * @Description 更新操作
 * @return
 */
export function updateData(func) {
    this.$refs['dataForm'].validate((valid) => {
        if (valid) {
            const tempData = formatTemps(Object.assign({}, this.temp),this.tableList,true)
            const idList = this.checkedRows.map(item => {
                return item.keyID || item[this.tableKey];
            })
            tempData.idList = idList.join(",")
            func(tempData).then((res) => {
                if (res.data.code == 0) {
                    this.dialogFormVisible = false
                    this.$notify({
                        title: this.$t('table.success'),
                        message: this.$t('table.editSuccess'),
                        type: 'success',
                        duration: 2000
                    })
                    this.getList()
                } else {
                    this.$message({
                        message: this.$t('table.editFailure')+':'+res.data.reason,
                        type: 'info'
                    })
                }

            })
        }
    })
}

/**
 * @Date 2018/9/18 17:03
 * @Description 操作新增model
 * @return
 */
export function handleCreate() {
    this.resetTemp()
    this.dialogStatus = 'create'
    this.dialogFormVisible = true
    this.rules = this.singleRules
    this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
    })
}
/**
 * @Date 2018/9/18 17:05
 * @Description 新增操作
 * @return
 */
export function createData(func) {
    this.$refs['dataForm'].validate((valid) => {
        if (valid) {
            func(formatTemps(this.temp,this.tableList,true)).then((res) => {
                if (res.data.code == 0) {
                    this.dialogFormVisible = false
                    this.$notify({
                        title: this.$t('table.success'),
                        message: this.$t('table.createSuccess'),
                        type: 'success',
                        duration: 2000
                    })
                    this.getList()
                } else {
                    this.$message({
                        message: this.$t('table.createFailure')+':'+res.data.reason,
                        type: 'info'
                    })
                }


            })
        }
    })
}
/**
 * @author lsf
 * @Date 2018/9/29 14:35
 * @Param idle-时间,action-方法
 * @Description  针对页面查询的节流函数，控制页面请求频率
 * queryList停止变化一段时间后才会开始更新
 * 改进：这个延迟时间应该仅限制连续事件的触发即可，如果距离上一次更新时间超过两秒，应该直接执行
 * TODO 多次call，apply,应该有更优雅的方法
 * @return
 */
export function debounce (idle, action) {
    let now=(new Date()).getTime()
    let ctx = this, args = arguments
    if(!this.lastModifyTm || now-this.lastModifyTm>2000){
        this.lastModifyTm=now
        action.apply(ctx, args)
    }else {
        this.lastModifyTm=now
        return function(){
            clearTimeout(this.lastDebounce)
            this.lastDebounce = setTimeout(function(){
                action.apply(ctx, args)
            }, idle)
        }.apply(this)
    }

}

/**
 * @Date 2018/9/18 17:53
 * @Description checkbox 操作
 * 2018/10/13 修改：直接在watch中统一监视checkedRows,check操作 只修改checkedRows值，那这两个方法可以废弃了
 * @return
 */
export function selectionChange(val,row) {
    // if (val.length >= 1) {
    //     this.editDisable = false
    // } else {
    //     this.editDisable = true
    // }
    // if (val.length > 0) {
    //     this.deleteDisable = false
    // } else {
    //     this.deleteDisable = true
    // }
    this.checkedRows = val;
}

export function selectionAll(val, row){
    // if (val.length >= 1) {
    //     this.editDisable = false
    // } else {
    //     this.editDisable = true
    // }
    // if (val.length > 0) {
    //     this.deleteDisable = false
    // } else {
    //     this.deleteDisable = true
    // }
    this.checkedRows = val;
}
/**
 * @Date 2018/9/18 16:53
 * @Description 自定义表头排序
 * @return
 */
export function renderHeadSort(h, {column, $index}, index, name) {
    return h('span', [
        h('span', column.label),
        h('span',
            [
                h('i', {
                    attrs: {
                        id: name + '_up'
                    },
                    class: 'up',
//                            style: 'margin-left: 5px;',
                    on: {
                        click: () => {
                            let input = document.getElementById(name + '_up')
                            let itemClass = input.className
                            if (itemClass.indexOf("onU") == -1) {
                                input.classList.add("onU")
                                document.getElementById(name + '_down').classList.remove("onU")
                                this.listQuery.orderList = this.listQuery.orderList.filter(function (item) {
                                    return item[0] != name;
                                });
                                this.listQuery.orderList.push([name, 1])
                            } else {
                                input.classList.remove("onU")
                                this.listQuery.orderList = this.listQuery.orderList.filter(function (item) {
                                    return item[0] != name;
                                });
                            }
                            // this.handleFilter()
                        }
                    },
                }),
                h('i', {
                    class: 'down',
                    attrs: {
                        id: name + '_down'
                    },
                    on: {
                        click: () => {
                            let input = document.getElementById(name + '_down')
                            let itemClass = input.className
                            if (itemClass.indexOf("onU") == -1) {
                                input.classList.add("onU")
                                document.getElementById(name + '_up').classList.remove("onU")
                                this.listQuery.orderList = this.listQuery.orderList.filter(function (item) {
                                    return item[0] != name;
                                });
                                this.listQuery.orderList.push([name, 0])
                            } else {
                                input.classList.remove("onU")
                                this.listQuery.orderList = this.listQuery.orderList.filter(function (item) {
                                    return item[0] != name;
                                });
                            }
                            // this.handleFilter()
                        }
                    },
                }),
            ]
        ),

    ]);
}

/**
 * transform 地区数据 to 地区名称
 * @param keyAreaId
 *      格式：u.@continent.@country.@region.@city
 *      层层筛选，显示出最小粒度且有效的地区
 * @param ignoreCountry 是否不显示国家名
 *      type: boolean
 *
 * @notice 目前只有中国，才有地区和城市
 * @return string 地区名称
 */
export function formatArea(keyAreaId) {
    let result = "";
    if (keyAreaId && keyAreaId !== "N") {
        let areas, country, region, regionAndCity;
        areas = keyAreaId.split(".")
        country = this.$t("country." + areas[2])
        if (areas.length > 3) {
            region = this.$t("cn.region." + areas[3])
        }
        if (areas.length > 4) {
            regionAndCity = this.$t("cn." + areas[3] + "." + areas[4]);
        }
        if (country) {
            result += country;
            //优先{regionAndCity},查不到再检查region
            if (regionAndCity) {
                result += regionAndCity.replace(".", "-");
            } else if (region) {
                result += region;
            }
        }
    }
    return result || "-";
};

/**
 * 逻辑同formatArea，
 * @return string 带国旗图标的地区名称（html）
 */
export function areaFM(keyAreaId) {
    let result = "";
    if (keyAreaId && keyAreaId !== "N") {
        let areas, country, region, regionAndCity;
        areas = keyAreaId.split(".")
        if(areas.length>1){
            country = this.$t("country." + areas[2])
        }else {
            country=keyAreaId
        }
        if (areas.length > 3) {
            region = this.$t("cn.region." + areas[3])
        }
        if (areas.length > 4) {
            regionAndCity = this.$t("cn." + areas[3] + "." + areas[4]);
        }
        if (country) {
            result += country;
            //优先{regionAndCity},查不到再检查region
            if (regionAndCity) {
                result += regionAndCity.replace(".", "-");
            } else if (region) {
                result += region;
            }
        }
    }
    if (result) {
        result = "<span><i class='img-country country-" + keyAreaId.split(".")[2] + "'></i>" + result + "</span>";
    }
    return result || "-";
}

/**
 * @author lsf
 * @Date 2018/10/18 10:14
 * @Description  数据处理
 * @return
 */
export function computedFmt(computedList,tableList) {
    let format,name,obj;
    for(let i=computedList.length-1;i>=0;i--){
        let tags = {};
        let tips={};
        obj = JSON.parse(JSON.stringify(computedList[i]))
        for(let j=tableList.length-1;j>=0;j--){
            name=tableList[j].name
            if(tableList[j].type=="tag"){
                if(obj[name] || obj[name] ==0){
                    //方法或对象
                    if(typeof tableList[j].tagData==="function"){
                        tags[name]=tableList[j].tagData(obj[name],obj)
                    }else{
                        tags[name]=tableList[j].tagData[obj[name]]
                    }
                }
            }
            if(tableList[j].type=="tip"){
                try {
                    if(tableList[j].tips && typeof tableList[j].tips === "function") { //tips是函数
                        tips[name]=tableList[j].tips(obj[name],obj)  //value,rowData参数
                    } else { //不是函数
                        tips[name]=tableList[j][name]
                    }
                } catch(e) {
                    tips[name]="-"
                }
            }
            if(tableList[j].format){
                format=tableList[j].format

                //优先执行自定义function，注意空值判断
                if(format.fmt){
                    if(typeof format.fmt === "function") { //fmt是函数
                        let fmt=format.fmt.call(this,obj[name],obj)
                        if(fmt.fmt){
                            obj[name]=fmt.fmt
                        }else {
                            obj[name]=fmt
                        }
                        //特例：部分tip直接由fmt返回
                        if(tableList[j].type=="tip"  && fmt.tip){
                            tips[name]=fmt.tip  || tips[name]
                                }
                    }

                }

                if(!obj[name] && obj[name]!=0){
                    continue
                }
                if(format.ratio){
                    obj[name]=obj[name]/format.ratio
                }
                if(format.decimals){
                    obj[name]=toDecimals(obj[name],format.decimals)
                }
                if(format.iccidFM){
                    obj[name]=iccidFM(obj[name])
                }
                if(format.areaFM){
                    obj[name]=areaFM.call(this,obj[name])
                }
                if(format.trafficFM){
                    obj[name]=trafficFormat(obj[name])
                }
                if(format.limitFM){
                    obj[name]=limitFormat(obj[name])
                }
                if(format.comData){
                    obj[name]=format.comData[obj[name]] || obj[name]
                }
            }
        }
        obj.tags=tags
        obj.tips=tips
        computedList[i].showData=obj
    }
    return computedList;
}

export function remoteQuery(func,query,name,format) {
    format=format || ""
    if (query !== '') {
        this.selectLoading = true;
            func({query:query,idxOwnerId:'eu.'}).then(response => {
                this.selectLoading = false;
                const S2Data = response.data.data.items;
                this[name+'Options'] = S2Data.map(item => {
                    if(format=="area"){
                        return {value: item.id, label: formatArea.call(this,item.text)};
                    }else if(format=="iccid"){
                        return {value: item.id, label: iccidFM(this,item.text)};
                    }
                    return {value: item.id, label: item.text};
                });
            }).catch(r => {
                this.selectLoading = false
            })
    }
}

export function remoteInitQuery(func,name,format) {
    format=format || ""
    func({query:'',idxOwnerId:'eu.'}).then(response => {
               const S2Data = response.data.data.items;
               this[name+'InitOptions'] = S2Data.map(item => {
                   if(format=="area"){
                       return {value: item.id, label: formatArea.call(this,item.text)};
                   }else if(format=="iccid"){
                       return {value: item.id, label: iccidFM(this,item.text)};
                   }
                   return {value: item.id, label: item.text};
               });
               this[name+'Options'] = this[name+'InitOptions'];
           })
}

export function countIds(value) {
    let arr = value.split(","), num = arr.length,checkArr=[];
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
              num--;
            }
        } else if (arr[str].trim() == "") {
            num--;
        }
        return num;
    }
}
