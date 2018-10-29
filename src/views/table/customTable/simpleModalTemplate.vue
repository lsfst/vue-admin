<!--<template xmlns:v-bind="http://www.w3.org/1999/xhtml">-->
    <!--<div>-->
        <!--<el-dialog :title="$t(textMap[dialogStatus])" :visible.sync="dialogFormVisible">-->
            <!--<el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px"-->
                     <!--style="width: 400px; margin-left:50px;">-->

                <!--<el-form-item :label="$t('table.tbSimCard.imei')" prop="imei">-->
                    <!--<el-input clearable v-model="temp.imei"/>-->
                <!--</el-form-item>-->
                <!--<el-form-item :label="$t('table.tbSimCard.idxSCGroupID')" prop="idxSCGroupID">-->
                    <!--<el-select v-model="temp.idxSCGroupID" class="filter-item" placeholder="Please select" filterable remote-->
                               <!--@focus="switchIdxSCGroupID" :remote-method="remoteIdxSCGroupIDMethod" :loading="selectLoading"-->
                               <!--clearable>-->
                        <!--<el-option v-for="item in idxSCGroupIDOptions" :key="item.value" :label="item.label"-->
                                   <!--:value="item.value"/>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->

                <!--<el-form-item :label="$t('table.tbSimCard.status')" prop="status">-->
                    <!--<el-select v-model="temp.status" class="filter-item" clearable>-->
                        <!--<el-option v-for="item in statusOptions" :key="item.key" :label="item.name"-->
                                   <!--:value="item.key"/>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->

                <!--<el-form-item :label="$t('table.tbSimCard.restNetData')" prop="restNetData">-->
                    <!--<el-input clearable v-model="temp.restNetData"/>-->
                <!--</el-form-item>-->
                <!--<el-form-item :label="$t('table.tbSimCard.number')" prop="number">-->
                    <!--<el-input clearable v-model="temp.number"/>-->
                <!--</el-form-item>-->
                <!--<el-form-item :label="$t('table.tbSimCard.balance')" prop="balance">-->
                    <!--<el-input clearable v-model="temp.balance"/>-->
                <!--</el-form-item>-->
                <!--<el-form-item :label="$t('table.tbSimCard.active')" prop="active">-->
                    <!--<el-select v-model="temp.active" class="filter-item" filterable-->
                               <!--clearable>-->
                        <!--<el-option v-for="item in activeOptions" :key="item.key" :label="item.name"-->
                                   <!--:value="item.key"/>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->

                <!--<el-form-item :label="$t('table.tbSimCard.activeDays')" prop="activeDays">-->
                    <!--<el-input clearable v-model="temp.activeDays"/>-->
                <!--</el-form-item>-->

                <!--<el-form-item :label="$t('table.tbSimCard.initConnectSign')" prop="initConnectSign">-->
                    <!--<el-input clearable v-model="temp.initConnectSign"/>-->
                <!--</el-form-item>-->

                <!--<el-form-item :label="$t('table.tbSimCard.expireDate')">-->
                    <!--<el-date-picker-->
                            <!--v-model="temp.expireDate"-->
                            <!--value-format="yyyy-MM-dd HH:mm:ss"-->
                            <!--type="date"-->
                            <!--prop="expireDate">-->
                    <!--</el-date-picker>-->
                <!--</el-form-item>-->

                <!--<el-form-item :label="$t('table.tbSimCard.remarks')" prop="remarks">-->
                    <!--<el-input clearable v-model="temp.remarks"/>-->
                <!--</el-form-item>-->
            <!--</el-form>-->
            <!--<div slot="footer" class="dialog-footer">-->
                <!--<el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>-->
                <!--<el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}-->
                <!--</el-button>-->
                <!--<el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>-->
            <!--</div>-->
        <!--</el-dialog>-->

    <!--</div>-->
<!--</template>-->


<!--<script>-->
  <!--/**-->
   <!--* @author lsf-->
   <!--* @Date 2018/10/10 15:18-->
   <!--* @Description 简单modal组件（不包含remote select）-->
   <!--* 可以直接在这里定义rules-->
   <!--*/-->
    <!--export default {-->
        <!--name:"simpleModalTemplate",-->
        <!--props:['dialogStatus','dialogFormVisible','prefix','temp','tableList'],-->
        <!--data(){-->
            <!--return{-->
                <!--textMap: {-->
                    <!--update: 'edit',-->
                    <!--create: 'create',-->
                    <!--batchUpdate: 'batchEdit'-->
                <!--},-->
            <!--}-->
        <!--},-->
      <!--computed: {-->
          <!--editList: function () {-->
              <!--let editList = [];-->
              <!--let tableList = this.tableList;-->
              <!--for (let i = 0; i < tableList.length; i++) {-->
                  <!--if (tableList[i].edit) {-->
                      <!--editList.push(tableList[i])-->
                  <!--}-->
              <!--}-->
              <!--return editList-->
          <!--},-->
      <!--},-->
        <!--methods:{-->
            <!--renderSort(h,obj,index,name){-->
                <!--return this.$parent.renderSort(h,obj,index,name)-->
            <!--},-->
            <!--tableRowClassName({row, rowIndex}){-->
                <!--return this.$parent.tableRowClassName({row, rowIndex})-->
            <!--},-->
            <!--selectionAll(val,row){-->
                <!--this.$emit('selectionAll',val, row)-->
            <!--},-->
            <!--selectionChange(val,row){-->
                <!--this.$emit('selectionChange',val, row)-->
            <!--},-->
        <!--},-->
    <!--};-->
<!--</script>-->