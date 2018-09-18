<template>
    <div class="app-container">

        <div class="filter-container">
            <sticky class-name="sub-navbar">
                <el-input :placeholder="$t('table.tbAgent.idxAgentName')" v-model="listQuery.idxAgentName" clearable
                          prefix-icon="el-icon-search" style="width: 200px;" class="filter-item"
                          @keyup.enter.native="handleFilter"/>
                <el-input :placeholder="$t('table.tbAgent.name')" v-model="listQuery.name" style="width: 200px;"
                          prefix-icon="el-icon-search" clearable class="filter-item"
                          @keyup.enter.native="handleFilter"/>
                <el-input :placeholder="$t('table.tbAgent.phoneNumber')" v-model="listQuery.phoneNumber"
                          prefix-icon="el-icon-search" clearable style="width: 200px;" class="filter-item"
                          @keyup.enter.native="handleFilter"/>
                <el-select v-model="listQuery.agentLevel" :placeholder="$t('table.tbAgent.agentLevel')" clearable
                           style="width: 90px" class="filter-item" @change="handleFilter">
                    <el-option v-for="item in agentLevelOptions" :key="item.key" :label="item.display_name"
                               :value="item.key"/>
                </el-select>

                <el-select v-model="listQuery.status" :placeholder="$t('table.tbAgent.status')" clearable
                           style="width: 90px" class="filter-item" @change="handleFilter">
                    <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name"
                               :value="item.key"/>
                </el-select>
                <el-checkbox v-model="showAgentLevel" class="filter-item" style="margin-left:15px;"
                             @change="tableKey=tableKey+1">{{ $t('table.tbAgent.agentLevel') }}
                </el-checkbox>
                <el-checkbox v-model="showDiscount" class="filter-item" style="margin-left:15px;"
                             @change="tableKey=tableKey+1">{{ $t('table.tbAgent.discount') }}
                </el-checkbox>
                <el-checkbox v-model="showMdfBy" class="filter-item" style="margin-left:15px;"
                             @change="tableKey=tableKey+1">{{ $t('table.mdfBy') }}
                </el-checkbox>

                <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus"
                           @click="handleCreate">{{ $t('table.add') }}
                </el-button>
                <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                           :disabled="editDisable" @click="handleUpdate">{{ $t('table.edit') }}
                </el-button>
                <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete"
                           :disabled="deleteDisable" @click="handleDelete">{{ $t('table.delete') }}
                </el-button>
                <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                           @click="handleDownload">{{ $t('table.export') }}
                </el-button>
            </sticky>
        </div>

        <!--@sort-change="handleFilter"-->
        <!--:default-sort = "{prop: 'idxAgentId', order: 'descending'}"-->
        <!--element table 自带的表头排序可以在本地进行，若要触发后台访问接口，可以使用@sort-change监听-->
        <!--@select 监听checkbox选中  @select-all 监听全选-->
        <el-table
                v-loading="listLoading"
                :key="tableKey"
                :data="list"
                @select="selectionChange"
                @select-all="selectionAll"
                border
                fit
                max-height="1000"
                highlight-current-row
                :row-class-name="tableRowClassName"
                style="width: 100%;">


            <el-table-column
                    fixed="left"
                    prop="idxAgentId"
                    type="selection"
                    width="35">
            </el-table-column>
            <el-table-column :label="$t('table.tbAgent.idxAgentId')" width="160px" align="center"
                             :render-header="(h,obj,index) => renderSort(h,obj,index,'idxAgentId')">
                <template slot-scope="scope">
                    <span>{{ scope.row.idxAgentId }}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('table.tbAgent.idxAgentName')" width="160px" align="center"
                             :render-header="(h,obj,index) => renderSort(h,obj,index,'idxAgentName')">
                <template slot-scope="scope">
                    <span>{{ scope.row.idxAgentName }}</span>
                </template>
            </el-table-column>

            <el-table-column v-if="showAgentLevel" :label="$t('table.tbAgent.agentLevel')" width="110px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.agentLevel | levelFilter }}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('table.tbAgent.name')" width="110px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('table.tbAgent.phoneNumber')" width="150px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.phoneNumber }}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('table.tbAgent.status')" width="110px" align="center">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status | statusTagFilter">{{ scope.row.status | statusFilter}}</el-tag>
                    <!--<span>{{ scope.row.status }}</span>-->
                </template>
            </el-table-column>

            <el-table-column :label="$t('table.tbAgent.balance')" width="110px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.balance/1000 |decimalsFilter(3)}}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('table.tbAgent.credit')" width="110px" align="center">
                <template slot-scope="scope">
                    <span :style="{color:(scope.row.credit>=100000?'red':'#000')}">{{ scope.row.credit/1000 |decimalsFilter(3) }}</span>
                </template>
            </el-table-column>

            <el-table-column v-if="showDiscount" :label="$t('table.tbAgent.discount')" width="110px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.discount }}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('table.tbAgent.remark')" min-width="110px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.remark }}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('table.mdfTm')" width="160px" align="center" sortable>
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span>{{ scope.row.mdfTm | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>

            <el-table-column v-if="showMdfBy" :label="$t('table.mdfBy')" width="110px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.mdfBy }}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('table.crtTm')" width="160px" align="center">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span>{{ scope.row.crtTm | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('table.crtBy')" width="110px" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.crtBy }}</span>
                </template>
            </el-table-column>

            <el-table-column type="expand" fixed="right">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item :label="$t('table.tbAgent.idxAgentName')">
                            <span>{{ props.row.idxAgentName }}</span>
                        </el-form-item>
                        <el-form-item :label="$t('table.tbAgent.agentLevel')">
                            <span>{{ props.row.agentLevel }}</span>
                        </el-form-item>
                        <el-form-item :label="$t('table.tbAgent.phoneNumber')">
                            <span>{{ props.row.phoneNumber }}</span>
                        </el-form-item>
                        <el-form-item :label="$t('table.crtTm')">
                            <span>{{ props.row.crtTm }}</span>
                        </el-form-item>
                        <el-form-item :label="$t('table.mdfTm')">
                            <span>{{ props.row.mdfTm }}</span>
                        </el-form-item>
                        <el-form-item :label="$t('table.crtBy')">
                            <span>{{ props.row.crtBy }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination-container">
            <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                           :total="total" background layout="total, sizes, prev, pager, next, jumper"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
        </div>


        <el-dialog :title="$t(textMap[dialogStatus])" :visible.sync="dialogFormVisible">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px"
                     style="width: 400px; margin-left:50px;">

                <el-form-item v-if="dialogStatus!='batchUpdate'" :label="$t('table.tbAgent.idxAgentName')"
                              prop="idxAgentName">
                    <el-input clearable v-model="temp.idxAgentName"/>
                </el-form-item>
                <el-form-item v-if="dialogStatus!='batchUpdate'" :label="$t('table.tbAgent.name')" prop="name">
                    <el-input clearable v-model="temp.name"/>
                </el-form-item>
                <el-form-item v-if="dialogStatus!='batchUpdate'" :label="$t('table.tbAgent.phoneNumber')"
                              prop="phoneNumber">
                    <el-input clearable v-model="temp.phoneNumber"/>
                </el-form-item>
                <el-form-item :label="$t('table.tbAgent.status')" prop="status">
                    <el-select v-model="temp.status" class="filter-item" placeholder="Please select" clearable>
                        <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbAgent.balance')" prop="balance">
                    <el-input clearable v-model="temp.balance/1000"/>
                </el-form-item>
                <el-form-item :label="$t('table.tbAgent.credit')" prop="credit">
                    <el-input clearable v-model="temp.credit/1000"/>
                </el-form-item>
                <el-form-item :label="$t('table.tbAgent.discount')" prop="discount">
                    <el-select v-model="temp.discount" class="filter-item" placeholder="Please select" filterable remote
                               @focus="switchDiscount" :remote-method="remoteDiscountMethod" :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in discountOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('table.tbAgent.remark')">
                    <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.remark" type="textarea"
                              placeholder="Please input"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}
                </el-button>
                <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    //import具体方法时，必须{}包裹
    import {fetchList, createAgent, updateAgent, deleteAgent} from '@/api/agent'
    import {discountS2} from '@/api/select'
    import waves from '@/directive/waves' // 水波纹指令
    import {parseTime} from '@/utils'
    import {copyRelatedAttrs} from '@/filters/index'
    import {tableSortDown,tableSortUp,handleDelete,handleDownload,updateData,renderHeadSort,handleCreate,createData,
        handleUpdate,getList,selectionChange,selectionAll} from '@/utils/tableCustom'
    import Sticky from '@/components/Sticky'

    const levelOptions = [
        {key: '1', display_name: '一级'},
        {key: '2', display_name: '二级'},
        {key: '3', display_name: '三级'},
        {key: '4', display_name: '四级'},
        {key: '5', display_name: '五级'},
        {key: '6', display_name: '六级'},
        {key: '7', display_name: '七级'},
        {key: '8', display_name: '八级'},
        {key: '9', display_name: '九级'},
        {key: '10', display_name: '十级'},
        {key: '11', display_name: '十一级'},
        {key: '12', display_name: '十二级'},
        {key: '13', display_name: '十三级'},
        {key: '14', display_name: '十四级'},
        {key: '15', display_name: '十五级'},
        {key: '16', display_name: '十六级'},
        {key: '17', display_name: '十七级'},
        {key: '18', display_name: '十八级'},
        {key: '19', display_name: '十九级'},
        {key: '20', display_name: '二十级'},
    ]

    const statusOptions = [
        {key: 0, display_name: '正常', style: 'success'},
        {key: 1, display_name: '禁用', style: 'danger'},
    ]

    const statusKeyValue = statusOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.display_name
        return acc
    }, {})
    const statusKeyStyle = statusOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.style
        return acc
    }, {})
    // arr to obj ,such as { CN : "China", US : "USA" }

    const levelKeyValue = levelOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.display_name
        return acc
    }, {})

    export default {
        name: 'ComplexTable',
        directives: {
            waves
        },
        components: {Sticky},
        filters: {
            levelFilter(level){
                return levelKeyValue[level]
            },
            statusFilter(status) {
                return statusKeyValue[status]
            },
            statusTagFilter(status) {
                return statusKeyStyle[status]
            }
        },
        data() {
            return {
                tableKey: 'idxAgentId',
                list: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    offset: 0,
                    limit: 20,
                    agentLevel: undefined,
                    status: undefined,
                    idxAgentName: undefined,
                    name: undefined,
                    phoneNumber: undefined,
                    orderList: [],
                    table_columns: undefined,
                    importance: undefined,
                    title: undefined,
                    type: undefined,
                },
                agentLevelOptions: levelOptions,
                discountOptions: [],
                discountInitOptions: [],
                statusOptions: statusOptions,
                showAgentLevel: false,
                showDiscount: false,
                showMdfBy: false,
                editDisable: true,
                deleteDisable: true,
                checkedRows: [],
                temp: {
                    idxAgentName: undefined,
                    name: undefined,
                    phoneNumber: undefined,
                    status: undefined,
                    balance: 0,
                    credit: 0,
                    discount: undefined,
                    remark: ''
                },
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: 'edit',
                    create: 'create',
                    batchUpdate: 'batchEdit'
                },
                dialogPvVisible: false,
                rules: {},
                singleRules: {
                    idxAgentName: [{required: true, message: 'idxAgentName is required', trigger: 'blur'}],
                    name: [{required: true, message: 'name is required', trigger: 'blur'}],
                    phoneNumber: [{required: true, message: 'phoneNumber is required', trigger: 'blur'}],
                    status: [{required: true, message: 'status is required', trigger: 'change'}],
                    balance: [{required: true, message: 'balance is required', trigger: 'blur'}],
                    credit: [{required: true, message: 'credit is required', trigger: 'blur'}],
                    discount: [{required: true, message: 'discount is required', trigger: 'change'}]
                },
                batchRules: {},
                discountQuery: {
                    query: '',
                    ownerId: 'eu.'
                },
                downloadLoading: false,
                selectLoading: false,
            }
        },
        created() {
            this.getList()
        },
        mounted(){
            discountS2(this.discountQuery).then(response => {
                const S2Data = response.data.data.items;
                this.discountInitOptions = S2Data.map(item => {
                    return {value: item.id, label: item.text};
                });
                this.discountOptions = this.discountInitOptions;
            })
        },
        methods: {
            getList() {
                getList.call(this,fetchList)
            },
            handleFilter() {
                this.listQuery.page = 1
                this.listQuery.offset = (this.listQuery.page - 1) * this.listQuery.limit
                this.getList()
            },
            handleSizeChange(val) {
                this.listQuery.limit = val
                this.listQuery.offset = (this.listQuery.page - 1) * this.listQuery.limit
                this.getList()
            },
            handleCurrentChange(val) {
                this.listQuery.page = val
                this.listQuery.offset = (this.listQuery.page - 1) * this.listQuery.limit
                this.getList()
            },
            resetTemp() {
                this.temp = {
                    idxAgentName: undefined,
                    name: undefined,
                    phoneNumber: undefined,
                    status: undefined,
                    balance: 0,
                    credit: 0,
                    discount: undefined,
                    remark: ''
                }
            },
            handleCreate() {
                handleCreate.call(this)
            },
            createData() {
                createData.call(this,createAgent)
            },
            handleUpdate() {
                handleUpdate.call(this)
            },
            updateData() {
                updateData.call(this,updateAgent)
            },
            //在渲染表头的时候，会调用此方法，h为createElement的缩写版  添加on.change事件即可
            renderSort(h, {column, $index}, index, name) {
                return renderHeadSort.call(this,h, {column, $index}, index, name)
            },
            handleDelete() {
                handleDelete.call(this,deleteAgent)
            },
            handleDownload() {
                const tHeader = ['idxAgentId', 'idxAgentName', 'name', 'phoneNumber', 'status']
                handleDownload.call(this,tHeader,fetchList)
            },
            remoteDiscountMethod(query) {
                //点击并不会触发远程查询时间，只有输入时才会触发
                if (query !== '') {
                    this.selectLoading = true;
                    this.discountQuery.query = query,

                        discountS2(this.discountQuery).then(response => {
                            this.selectLoading = false;
                            const S2Data = response.data.data.items;
                            this.discountOptions = S2Data.map(item => {
                                return {value: item.id, label: item.text};
                            });
                        }).catch(r => {
                            this.selectLoading = false
                        })
                }
            },
            switchDiscount(){
                this.discountOptions = this.discountInitOptions
            },
            selectionChange(val, row){
                selectionChange.call(this,val,row)
            },
            selectionAll(val, row){
                selectionAll.call(this,val,row)
            },
            tableRowClassName({row, rowIndex}) {
                if (row.status === 1) {
                    return 'warning-row';
                } else
                    return '';
            }
        }
    }
</script>
<style>


</style>
