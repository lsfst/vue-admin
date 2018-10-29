<template>
    <div>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh"
                   @click="handleRefresh">{{ $t('table.refresh') }}
        </el-button>
        <template  v-for="item in operations">
            <el-button v-if="item=='add'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus"
                       @click="handleCreate">{{ $t('table.add') }}
            </el-button>
            <el-button v-if="item=='edit'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" :disabled="editDisable"
                        @click="handleUpdate">{{ $t('table.edit') }}
            </el-button>
            <el-button v-if="item=='remove'" class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" :disabled="deleteDisable"
                        @click="handleDelete">{{ $t('table.delete') }}
            </el-button>
            <el-button v-if="item=='download'" v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                       @click="handleDownload">{{ $t('table.export') }}
            </el-button>
        </template>
    </div>
</template>


<script>
    import waves from '@/directive/waves' // 水波纹指令

    export default {
        name:"operationsTemplate",
        directives: {
            waves
        },
        props:['operations','downloadLoading','deleteDisable','editDisable'],
//        data(){
//            return {
//                computedLists2: this.operations,
//            }
//        },
        methods:{
            handleRefresh(){
                this.$emit('handleRefresh')
            },
            handleCreate(){
                this.$emit('handleCreate')
            },
            handleUpdate(){
                this.$emit('handleUpdate')
            },
            handleDelete(){
                this.$emit('handleDelete')
            },
            handleDownload(){
                this.$emit('handleDownload')
            }
        }
    }
</script>