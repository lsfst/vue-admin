/**
 * Created by sz on 2018/9/18.
 * 表格相关的通用方法封装
 * 需要引用vue对象，call/apply 改变上下文
 */
/**
 * @Date 2018/9/18 17:40
 * @Description 查询
 * @return
 */
export function getList(func) {
    this.listLoading = true
    func(this.listQuery).then(response => {
        var data = response.data.data;
        this.list = data.contentList
        this.total = data.totalElements

        this.listLoading = false
    })
}
/**
 * @Date 2018/9/18 16:13
 * @Description 删除操作
 * @return
 */
export function handleDelete(func) {
    let idList = this.checkedRows.map(item => {
        return item[this.tableKey];
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
                    message: this.$t('table.deleteFailure')
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
        var temps = Object.assign({}, this.checkedRows[0])
        this.temp = copyRelatedAttrs(this.temp, temps)
        this.dialogStatus = 'update'
        this.rules = this.singleRules
    }

    this.dialogFormVisible = true
    this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
    })
}
/**
 * @Date 2018/9/18 16:35
 * @Description 更新操作
 * @return
 */
export function updateData(func) {
    this.$refs['dataForm'].validate((valid) => {
        if (valid) {
            const tempData = Object.assign({}, this.temp)
            const idList = this.checkedRows.map(item => {
                return item[this.tableKey];
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
                        message: this.$t('table.editFailure'),
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
            func(this.temp).then((res) => {
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
                        message: this.$t('table.createFailure'),
                        type: 'info'
                    })
                }


            })
        }
    })
}

/**
 * @Date 2018/9/18 17:53
 * @Description checkbox 操作
 * @return
 */
export function selectionChange(val,row) {
    if (val.length >= 1) {
        this.editDisable = false
    } else {
        this.editDisable = true
    }
    if (val.length > 0) {
        this.deleteDisable = false
    } else {
        this.deleteDisable = true
    }
    this.checkedRows = val;
}

export function selectionAll(val, row){
    if (val.length >= 1) {
        this.editDisable = false
    } else {
        this.editDisable = true
    }
    if (val.length > 0) {
        this.deleteDisable = false
    } else {
        this.deleteDisable = true
    }
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
                            this.handleFilter()
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
                            this.handleFilter()
                        }
                    },
                }),
            ]
        ),

    ]);
}

