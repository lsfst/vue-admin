<template>
    <div class="app-container">

        <div class="filter-container">
            <sticky class-name="sub-navbar">
                <el-col :span="6">
                    <el-input :placeholder="$t('table.tbSimCard.keySimCardID')" v-model="listQuery.keySimCardID"
                              clearable
                              prefix-icon="el-icon-search" style="width: 90%;" class="filter-item"/>
                </el-col>
                <el-col :span="6">
                    <el-select v-model="listQuery.idxSCGroupID" class="filter-item"
                               :placeholder="$t('table.tbSimCard.idxSCGroupID')" filterable remote
                               style="width:90%" clearable
                               @focus="switchIdxSCGroupID" :remote-method="remoteIdxSCGroupIDMethod"
                               :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in idxSCGroupIDOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-select :placeholder="$t('table.tbSimCard.areaCode')" v-model="listQuery.areaCode"
                               prefix-icon="el-icon-search" clearable style="width:  90%;" class="filter-item" remote
                               @focus="switchAreaCode"
                               clearable filterable :remote-method="remoteAreaCodeMethod" :loading="selectLoading">
                        <el-option v-for="item in areaCodeOptions" :key="item.value" :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-select v-model="listQuery.in_statusNew" :placeholder="$t('table.tbSimCard.statusNew')" clearable
                               multiple collapse-tags
                               style="width:  90%" class="filter-item">
                        <el-option v-for="item in statusNewOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-select v-model="listQuery.simPDevID" :placeholder="$t('table.tbSimCard.idxSimPDevID')" clearable
                               remote filterable
                               style="width:  90%" class="filter-item" @focus="switchSimPDevID"
                               :remote-method="remoteSimPDevIDMethod">
                        <el-option v-for="item in simPDevIDOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-input :placeholder="$t('table.tbSimCard.vifiId')" v-model="listQuery.vifiId" clearable
                              prefix-icon="el-icon-search" style="width:  90%;" class="filter-item"/>
                </el-col>
                <el-col :span="6">
                    <el-date-picker
                            v-model="listQuery.mdfTm"
                            type="daterange"
                            style="width: 90%"
                            range-separator="~"
                            :start-placeholder="$t('table.mdfTm')"
                            :end-placeholder="$t('table.mdfTm')">
                    </el-date-picker>
                </el-col>

                <operationsTemplate
                        :operations="operations"
                        :download-loading="downloadLoading"
                        :delete-disable="deleteDisable"
                        :edit-disable="editDisable"
                        @handleRefresh="handleRefresh"
                        @handleDownload="handleDownload"
                        @handleUpdate="handleUpdate"
                        @handleDelete="handleDelete"
                ></operationsTemplate>

            </sticky>
        </div>

        <!--@sort-change="handleFilter"-->
        <!--:default-sort = "{prop: 'idxAgentId', order: 'descending'}"-->
        <!--element table 自带的表头排序可以在本地进行，若要触发后台访问接口，可以使用@sort-change监听-->
        <!--@select 监听checkbox选中  @select-all 监听全选-->
        <div>

            <simpleTableTemplate
                    :list-loading="listLoading"
                    :table-key="tableKey"
                    :expand="expand"
                    :check="check"
                    :prefix="prefix"
                    :table-list="tableList"
                    :computed-lists="computedLists"
                    @tableRowClassName="tableRowClassName"
                    @renderSort="renderSort"
                    @selectionAll="selectionAll"
                    @selectionChange="selectionChange"
                    @clickRow="clickRow"
            ></simpleTableTemplate>

            <div class="pagination-container">
                <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                               :total="total" background layout="total, sizes, prev, pager, next, jumper"
                               @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
            </div>
        </div>


        <el-dialog :title="$t(textMap[dialogStatus])" :visible.sync="dialogFormVisible">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px"
                     style="width: 400px; margin-left:50px;">

                <el-form-item :label="$t('table.tbSimCard.imei')" prop="imei">
                    <el-input clearable v-model="temp.imei"/>
                </el-form-item>
                <el-form-item :label="$t('table.tbSimCard.idxSCGroupID')" prop="idxSCGroupID">
                    <el-select v-model="temp.idxSCGroupID" class="filter-item" placeholder="Please select" filterable remote
                               @focus="switchIdxSCGroupID" :remote-method="remoteIdxSCGroupIDMethod" :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in idxSCGroupIDOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbSimCard.status')" prop="status">
                    <el-select v-model="temp.status" class="filter-item" clearable>
                        <el-option v-for="item in statusOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbSimCard.restNetData')" prop="restNetData">
                    <el-input clearable v-model="temp.restNetData"/>
                </el-form-item>
                <el-form-item :label="$t('table.tbSimCard.number')" prop="number">
                    <el-input clearable v-model="temp.number"/>
                </el-form-item>
                <el-form-item :label="$t('table.tbSimCard.balance')" prop="balance">
                    <el-input clearable v-model="temp.balance"/>
                </el-form-item>
                <el-form-item :label="$t('table.tbSimCard.active')" prop="active">
                    <el-select v-model="temp.active" class="filter-item" filterable
                               clearable>
                        <el-option v-for="item in activeOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbSimCard.activeDays')" prop="activeDays">
                    <el-input clearable v-model="temp.activeDays"/>
                </el-form-item>

                <el-form-item :label="$t('table.tbSimCard.initConnectSign')" prop="initConnectSign">
                    <el-input clearable v-model="temp.initConnectSign"/>
                </el-form-item>

                <el-form-item :label="$t('table.tbSimCard.expireDate')">
                    <el-date-picker
                            v-model="temp.expireDate"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="date"
                            prop="expireDate">
                    </el-date-picker>
                </el-form-item>

                <el-form-item :label="$t('table.tbSimCard.remarks')" prop="remarks">
                    <el-input clearable v-model="temp.remarks"/>
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
    import simpleTableTemplate from '@/views/table/customTable/simpleTableTemplate'
    import operationsTemplate from '@/views/table/customTable/operationsTemplate'
    import Sticky from '@/components/Sticky'

    //import具体方法时，必须{}包裹
    import {fetch, create, update, remove} from '@/api/simcard'
    import {areaS2, SCGroupS2, simPDevS2} from '@/api/select'
    import {parseTime} from '@/utils'
    import {iccidFM, trafficFormat, toDecimals} from '@/filters/index'
    import {
        tableSortDown, tableSortUp, handleDelete, handleDownload, updateData, renderHeadSort, createData,
        handleUpdate, getList, selectionChange, selectionAll, areaFM, formatArea, debounce
    } from '@/utils/tableCustom'

    const statusOptions = [
        {key: 0, name: '启用'},
        {key: 1, name: '禁用'},
        {key: 2, name: '新卡'},
        {key: 10, name: '流量低'},
        {key: 11, name: '无流量'},
        {key: 12, name: '过期'},
        {key: 23, name: '失败'},
    ]
    const statusNewOptions = [
        {key: 1, name: '禁用', style: 'info'},
        {key: 2, name: '离线', style: 'info'},
        {key: 3, name: '空闲', style: 'success'},
        {key: 4, name: '异常', style: 'warning'},
        {key: 5, name: '使用中', style: 'blue'},
        {key: 6, name: '新卡', style: 'success'},
        {key: 10, name: '流量低', style: 'warning'},
        {key: 11, name: '无流量', style: 'danger'},
        {key: 12, name: '过期', style: 'danger'},
        {key: 23, name: '失败', style: 'danger'},
    ]

    const activeOptions = [
        {key: 0, name: '已激活'},
        {key: 1, name: '待激活(天)'},
        {key: 2, name: '待激活(时)'},
    ]

    const bindTypeOptions = [
        {key: 'D', name: '动态'},
        {key: 'S', name: '静态'},
    ]

    const statusKeyValue = statusOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})
    const statusNewKeyValue = statusNewOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})
    const statusNewKeyStyle = statusNewOptions.reduce((acc, cur) => {
        acc[cur.name] = cur.style
        return acc
    }, {})
    const bindTypeKeyValue = bindTypeOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})
    const activeKeyValue = activeOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})

    export default {
        name: 'ComplexTable',
        components: {Sticky,simpleTableTemplate,operationsTemplate},
//        filters: {
//            //expressions也可用作文本转换，但不支持复杂的逻辑
//            //filter用作文本转换，其this指代filters本体，若需要用到this可在computed进行
//        },
        data() {
            return {
                prefix:'table.tbSimCard.',
                tableKey: 'keySimCardID',
                tableList: [
                    {name: 'keySimCardID', width: {length: 180}, type: 'html', show: true},
                    {name: 'imei',expand:true},
                    {name: 'imsi',expand:true},
                    {name: 'idxSCGroupID', width: {length: 160}, show: true},
                    {name: 'groupName', width: {length: 160}, type: 'text', show: true},
                    {name: 'status', width: {length: 60}, type: 'text', show: true},
                    {name: 'areaCode', width: {length: 160}, type: 'html', show: true},
                    {name: 'statusNew', width: {length: 80}, type: 'tag',sort:true, show: true},
                    {name: 'bindType',expand:true},
                    {name: 'restNetData', width: {length: 100}, type: 'text', sort:true,show: true},
                    {name: 'number',expand:true},
                    {name: 'totalData',expand:true},
                    {name: 'monthTotalData', width: {length: 100}, type: 'text',sort:true, show: true},
                    {name: 'balance',expand:true},
                    {name: 'lastIdleTime',expand:true},
                    {name: 'active',expand:true},
                    {name: 'activeDays',expand:true},
                    {name: 'initConnectSign',expand:true},
                    {name: 'simpAndPort', width: {length: 110}, type: 'text',sort:true, show: true},
                    {name: 'expireDate', width: {length: 180}, type: 'date', show: true},
                    {name: 'vifiId', width: {length: 110}, type: 'text', show: true},
                    {name: 'totalSuccess',expand:true},
                    {name: 'totalFailed',expand:true},
                    {name: 'authRecord', width: {min:true,length: 120}, type: 'text', show: true},
                    {name: 'remarks',expand:true},
                    {name: 'mdfTm', width: {length: 180}, type: 'date', show: true},
                    {name: 'mdfBy',expand:true},
                    {name: 'crtTm',expand:true},
                    {name: 'crtBy',expand:true},
                    {name: 'failedDevices',style:{width:'100%'},expand:true},
                ],
                check: true,
                expand: true,
//                expandList: [
//                ],
                operations: ['edit','remove','download'],

                list: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    offset: 0,
                    limit: 20,
                    orderList: [],
                    keySimCardID: undefined,
                    idxSCGroupID: undefined,
                    simPDevID: undefined,
                    idxAreaId: undefined,
                    in_statusNew: [],
                    restNetData: undefined,
                    vifiId: undefined,
                    mdfTm: []       //时间组件绑定的是数组，需要处理
                },
                activeOptions: activeOptions,
                bindTypeOptions: bindTypeOptions,
                statusOptions: statusOptions,
                statusNewOptions: statusNewOptions,
                idxSCGroupIDOptions: [],
                idxSCGroupIDInitOptions: [],
                simPDevIDOptions: [],
                simPDevIDInitOptions: [],
                areaCodeOptions: [],
                areaCodeInitOptions: [],
                idxSCGroupIDQuery: {
                    query: '',
                    ownerId: 'eu.'
                },
                simPDevIDQuery: {
                    query: '',
                    ownerId: 'eu.'
                },
                areaCodeQuery: {
                    query: '',
                    ownerId: 'eu.'
                },
                editDisable: true,
                deleteDisable: true,
                checkedRows: [],
                temp: {
                    imei: undefined,
                    idxSCGroupID: undefined,
                    simPDevID: undefined,
                    status: undefined,
                    restNetData: undefined,
                    number: undefined,
                    active: undefined,
                    activeDays: undefined,
                    initConnectSign: undefined,
                    expireDate: undefined,
                    remarks: '',
                },
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: 'edit',
//                    create: 'create',
                    batchUpdate: 'batchEdit'
                },
                rules: {},
                singleRules: {
                    keySimCardID: [{required: true, message: 'keySimCardID is required', trigger: 'change'}],
                    idxSCGroupID: [{required: true, message: 'idxSCGroupID is required', trigger: 'change'}],
                    status: [{required: true, message: 'status is required', trigger: 'change'}],
                    restNetData: [{required: true, message: 'restNetData is required', trigger: 'blur'}],
                },
                batchRules: {},
                downloadLoading: false,
                selectLoading: false,
                lastDebounce: undefined,
                lastModifyTm: undefined
            }
        },
        created() {
            //生命周期执行顺序：data->created->computed(list初始换状态)->mounted->computed(此时getList执行完毕修改list)
            this.getList()
            this.lastModifyTm = (new Date()).getTime()
        },
        computed: {
            //就使用效果来看，computed与method没有区别，但性能上差距很大
            //method中，每次页面渲染时都会重新执行一次
            //computed:依赖收集、动态计算，依赖的值发生变化才会修改，否则取缓存值
            //因此对于非响应式依赖（如Date.now()），计算一次后将不会发生改变
            //多数情况下computed够用，但如果要在数据变化响应时，执行异步操作或开销较大的操作，可以使用watct
            //对list进行设置
            computedLists: function () {
                //页面初始化时会执行两次：第一次list还是初始化状态，之后
                let computedList = this.list;
                let obj;
                for (let i = 0; i < computedList.length; i++) {
                    //深拷贝与浅拷贝：直接赋值是浅拷贝，对于引用类型修改新值会直接修改原值
                    //几种拷贝方法比较：
                    //1.手动复制：依次复制对象各属性，本质上与Object.assign()一样
                    //2：可以处理一层深拷贝的方法：Object.assign()，可以处理简单json，对于json里面套json的数据则无法完全深拷贝
                    //3.转成json String再转回来：严格来说，这样会抛弃对象的constructor，也就是深拷贝之后，不管这个对象原来的构造函数是什么，在深拷贝之后都会变成Object
                    //  所以只能处理 Number, String, Boolean, Array, 扁平对象，即能够被 json 直接表示的数据结构。RegExp,function对象是无法通过这种方式深拷贝
                    //4.递归拷贝：注意相互引用导致的死循环
                    //5.Object.create()
                    //5.jquery 的$.extend方法
                    //lodash 的 _.cloneDeep方法
                    //需要变化的才修改
                    //TODO 修改会带来问题，诸如checkbox一类操作获取到的值非真实值
                    let tags = new Object();
                    obj = JSON.parse(JSON.stringify(computedList[i]))
                    obj.keySimCardID = iccidFM(obj.keySimCardID);
                    obj.status = statusKeyValue[obj.status];
                    obj.active = activeKeyValue[obj.active];
                    obj.statusNew = statusNewKeyValue[obj.statusNew];
                    obj.areaCode = areaFM.call(this, obj.areaCode);
                    obj.restNetData = trafficFormat(obj.restNetData);
                    obj.totalData = trafficFormat(obj.totalData);
                    obj.monthTotalData = trafficFormat(obj.monthTotalData);
                    obj.balance = toDecimals(obj.balance / 1000, 3);
                    tags.statusNew = statusNewKeyStyle[obj.statusNew];
                    obj.tags = tags

                    computedList[i].showData = obj
                }
                return computedList
            }
        },
        mounted(){
            SCGroupS2(this.idxSCGroupIDQuery).then(response => {
                const S2Data = response.data.data.items;
                this.idxSCGroupIDInitOptions = S2Data.map(item => {
                    return {value: item.id, label: item.text};
                });
                this.idxSCGroupIDOptions = this.idxSCGroupIDInitOptions;
            }),
                simPDevS2(this.simPDevIDQuery).then(response => {
                    const S2Data = response.data.data.items;
                    this.simPDevIDInitOptions = S2Data.map(item => {
                        return {value: item.id, label: item.text};
                    });
                    this.simPDevIDOptions = this.simPDevIDInitOptions;
                }),
                areaS2(this.areaCodeQuery).then(response => {
                    const S2Data = response.data.data.items;
                    this.areaCodeInitOptions = S2Data.map(item => {
                        return {value: item.id, label: formatArea.call(this, item.text)};
                    });
                    this.areaCodeOptions = this.areaCodeInitOptions;
                })
        },
        watch: {
            //去除搜索区所有dom事件绑定，统一在watch中监听queryList变化，对于有输入框的情况，需要处理字符输入带来的高频事件触发
            listQuery: {
                handler(curVal, oldVal){
                    debounce.call(this, 2000, function () {
                        this.getList()
                    })

                },
                //监听对象需要设置deep
                deep: true
            },
            //checkedList监听
            checkedRows: {
                handler(curVal, oldVal){
                    if(curVal.length>0){
                        this.editDisable = false
                        this.deleteDisable = false
                    }else {
                        this.editDisable = true
                        this.deleteDisable = true
                    }
                },
            },
        },
        //使用箭头函数来定义 method 函数需要注意
        //箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例
        methods: {
            getList() {
                getList.call(this, fetch)
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
                    imei: undefined,
                    idxSCGroupID: undefined,
                    status: undefined,
                    restNetData: undefined,
                    number: undefined,
                    simPDevID: undefined,
                    active: undefined,
                    activeDays: undefined,
                    initConnectSign: undefined,
                    expireDate: undefined,
                    remarks: '',
                }
            },
            handleUpdate() {
                handleUpdate.call(this)
            },
            handleRefresh() {
                //js赋值无法触发事件:1.手动触发2.watch监听
                this.listQuery = {
                    page: 1,
                    offset: 0,
                    limit: 20,
                    orderList: [],
                    keySimCardID: undefined,
                    idxSCGroupID: undefined,
                    simPDevID: undefined,
                    idxAreaId: undefined,
                    in_statusNew: [],
                    restNetData: undefined,
                    vifiId: undefined,
                    mdfTm: []
                }
            },
            updateData() {
                updateData.call(this, update)
            },
            //在渲染表头的时候，会调用此方法，h为createElement的缩写版  添加on.change事件即可
            renderSort(h, {column, $index}, index, name) {
                return renderHeadSort.call(this, h, {column, $index}, index, name)
            },
            handleDelete() {
                handleDelete.call(this, remove)
            },
            handleDownload() {
                const tHeader = ['keySimCardID', 'idxSCGroupID', 'simPDevID', 'areaCode', 'status', 'statusNew']
                handleDownload.call(this, tHeader, fetch)
            },
            remoteIdxSCGroupIDMethod(query) {
                //点击并不会触发远程查询时间，只有输入时才会触发
                if (query !== '') {
                    this.selectLoading = true;
                    this.idxSCGroupIDQuery.query = query,

                        SCGroupS2(this.idxSCGroupIDQuery).then(response => {
                            this.selectLoading = false;
                            const S2Data = response.data.data.items;
                            this.idxSCGroupIDOptions = S2Data.map(item => {
                                return {value: item.id, label: item.text};
                            });
                        }).catch(r => {
                            this.selectLoading = false
                        })
                }
            },
            remoteSimPDevIDMethod(query) {
                //点击并不会触发远程查询时间，只有输入时才会触发
                if (query !== '') {
                    this.selectLoading = true;
                    this.simPDevIDQuery.query = query,

                        simPDevS2(this.simPDevIDQuery).then(response => {
                            this.selectLoading = false;
                            const S2Data = response.data.data.items;
                            this.simPDevIDOptions = S2Data.map(item => {
                                return {value: item.id, label: item.text};
                            });
                        }).catch(r => {
                            this.selectLoading = false
                        })
                }
            },
            remoteAreaCodeMethod(query) {
                //点击并不会触发远程查询时间，只有输入时才会触发
                if (query !== '') {
                    this.selectLoading = true;
                    this.areaCodeQuery.query = query,

                        areaS2(this.areaCodeQuery).then(response => {
                            this.selectLoading = false;
                            const S2Data = response.data.data.items;
                            this.areaCodeOptions = S2Data.map(item => {
                                return {value: item.id, label: formatArea.call(this, item.text)};
                            });
                        }).catch(r => {
                            this.selectLoading = false
                        })
                }
            },
            switchIdxSCGroupID(){
                this.idxSCGroupIDOptions = this.idxSCGroupIDInitOptions
            },
            switchSimPDevID(){
                this.simPDevIDOptions = this.simPDevIDInitOptions
            },
            switchAreaCode(){
                this.areaCodeOptions = this.areaCodeInitOptions
            },
            selectionChange(val, row){
                this.checkedRows = val;
            },
            selectionAll(val, row){
                this.checkedRows = val;
            },
            tableRowClassName({row, rowIndex}) {
                if (rowIndex === 1) {
                    return 'warning-row';
                } else
                    return '';
            },
            clickRow(row){
                let checklist=this.checkedRows
                for(let i=checklist.length-1;i>=0;i--){
                    if(checklist[i].keySimCardID==row.keySimCardID){
                        return;
                    }
                }
                this.checkedRows.push(row)
            },
        }
    }
</script>
<style>


</style>
