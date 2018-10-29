<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div>
    <el-table
            v-loading="listLoading"
            element-loading-text="拼命加载中"
            ref="elTable"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            :data="computedLists"
            @select="selectionChange"
            @select-all="selectionAll"
            @row-click="clickRow"
            fit
            max-height="700"
            highlight-current-row
            :row-class-name="tableRowClassName"
            style="width: 100%;"
    >

        <el-table-column
                v-if="check"
                fixed="left"
                :prop="tableKey"
                type="selection"
                width="35">
        </el-table-column>

        <template v-for="item in columnList">
            <el-table-column v-if="item.width.min"  :min-width="item.width.length" align="center" :label="$t(prefix+item.name)">
                <template slot-scope="scope">
                    <i v-if="item.type=='date'" class="el-icon-time"></i>
                    <span v-if="item.type=='html'" v-html="scope.row.showData[item.name]"></span>
                    <el-tooltip v-else-if="item.type=='tip'" placement="top">
                        <div slot="content" v-html="scope.row.showData.tips[item.name]"></div>
                        <span v-html="scope.row.showData[item.name]"></span>
                    </el-tooltip>
                    <span v-else-if="item.type=='date'" v-text="scope.row.showData[item.name]"></span>
                    <el-tag v-else-if="item.type=='tag'" :type="scope.row.tags[item.name]" :style="item.style">{{ scope.row.showData[item.name]}}</el-tag>
                    <span v-else  v-text="scope.row.showData[item.name]"></span>
                </template>
            </el-table-column>
            <el-table-column v-else-if="item.sort"  :width="item.width.length" align="center" :label="$t(prefix+item.name)" :render-header="(h,obj,index) => renderSort(h,obj,index,item.name)">
                <template slot-scope="scope">
                    <i v-if="item.type=='date'" class="el-icon-time"></i>
                    <span v-if="item.type=='html'" v-html="scope.row.showData[item.name]"></span>
                    <el-tooltip v-else-if="item.type=='tip'" placement="top">
                        <div slot="content" v-html="scope.row.showData.tips[item.name]"></div>
                        <span v-html="scope.row.showData[item.name]"></span>
                    </el-tooltip>
                    <span v-else-if="item.type=='date'" v-text="scope.row.showData[item.name]"></span>
                    <el-tag v-else-if="item.type=='tag'" :type="scope.row.showData.tags[item.name]" :style="item.style">{{ scope.row.showData[item.name]}}</el-tag>
                    <span v-else  v-text="scope.row.showData[item.name]"></span>
                </template>
            </el-table-column>
            <el-table-column v-else  :width="item.width.length" align="center" :label="$t(prefix+item.name)">
                <template slot-scope="scope">
                    <i v-if="item.type=='date'" class="el-icon-time"></i>
                    <span v-if="item.type=='html'" v-html="scope.row.showData[item.name]"></span>
                    <el-tooltip v-else-if="item.type=='tip'" placement="top">
                        <div slot="content" v-html="scope.row.showData.tips[item.name]"></div>
                        <span v-html="scope.row.showData[item.name]"></span>
                    </el-tooltip>
                    <span v-else-if="item.type=='date'" v-text="scope.row.showData[item.name]"></span>
                    <el-tag v-else-if="item.type=='tag'" :type="scope.row.showData.tags[item.name]" :style="item.style">{{ scope.row.showData[item.name]}}</el-tag>
                    <span v-else  v-text="scope.row.showData[item.name]"></span>
                </template>
            </el-table-column>
        </template>

        <el-table-column type="expand" fixed="right" v-if="expand">
            <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item v-for="item in expandList" :key="item.name" :label="$t(prefix+item.name)" :style="item.style">
                        <span v-html="props.row.showData[item.name]"></span>
                    </el-form-item>
                </el-form>
            </template>
        </el-table-column>

    </el-table>
    </div>
</template>


<script>
    /**
     * @author lsf
     * @Date 2018/10/8 18:13
     * @Description 子与父组件之间两种方法通信方式
     * this.$emit('func',params) 子组件触发func事件，父组件监听，这种模式无法获取返回值
     * this.parent.func(params)  子组件直接调用父组件方法，可直接获取返回值------父组件中必须注册对应方法，否则无法使用
     *
     * expand 在点击展开的时候才会触发，之后值会缓存起来
     *
     * 一个完整的table的参数列表
     *              param                        required
     *   :list-loading="listLoading"
        :table-key="tableKey"                       Y
        :expand="expand"                            N
        :check="check"                              N
        :prefix="prefix"                            Y
        :table-list="tableList"                     Y
        :computed-lists="computedLists"             Y
        @tableRowClassName="tableRowClassName"      Y
        @renderSort="renderSort"                    Y
        @selectionAll="selectionAll"                N
        @selectionChange="selectionChange"          N
     * @return
     */
    export default {
        name:"simpleTableTemplate",
        props:['tableKey','listLoading','expand','prefix','check','tableList','computedLists'],
//        data(){
//            debugger
//            return {
//                computedLists2: this.operations,
//            }
//        },
        computed: {
            //从tableList提取出expandList，modalList
            columnList: function () {
                let columnList=[];
                let tableList = this.tableList;
                for (let i = 0; i < tableList.length; i++) {
                    if(!tableList[i].expand && !tableList[i].hide){
                        columnList.push(tableList[i])
                    }
                }
                return columnList
            },
            expandList: function () {
                let expandList=[];
                let tableList = this.tableList;
                for (let i = 0; i < tableList.length; i++) {
                    if(tableList[i].expand){
                        expandList.push(tableList[i])
                    }
                }
                return expandList
            },
        },
        methods:{
            renderSort(h,obj,index,name){
                return this.$parent.renderSort(h,obj,index,name)
            },
            tableRowClassName({row, rowIndex}){
                return this.$parent.tableRowClassName({row, rowIndex})
            },
            selectionAll(val,row){
                this.$emit('selectionAll',val, row)
            },
            selectionChange(val,row){
                this.$emit('selectionChange',val, row)
            },
            clickRow(row,event,column){
                this.$refs.elTable.toggleRowSelection(row,true)
                if(this.expand){
                    this.$refs.elTable.toggleRowExpansion(row)
                }
                this.$emit('clickRow',row)
            },

        },
    };
</script>