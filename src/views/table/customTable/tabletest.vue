<template>
    <div class="app-container">
        <simpleTableTemplate
                :table="table"
                :table-key="tableKey"
                :expand="expand"
                :table-list="tableList"
                :expand-list="expandList"
                :computed-lists="computedLists"
                :computed-list3="computedList3"
        ></simpleTableTemplate>
    </div>
</template>

<script>
    import simpleTableTemplate from '@/views/table/customTable/simpleTableTemplate'

    export default {
        name:"tabletest",
        components: {
            simpleTableTemplate,
        },
        data(){
            return {
                table:'tbSimCard',
                $18nPrefix:'table.tbSimCard.',
                tableKey:'keySimCardID',
                expand:true,
                tableList: [
                    {name: 'keySimCardID', width:{length:'230'}, type:'html', show:true, label:'table.tbSimCard.keySimCardID'},
                    {name: 'idxSCGroupID', width:{length:'160'}, type:'text', show:true, label:'table.tbSimCard.idxSCGroupID'},
                    {name: 'status', width:{length:'60'}, type:'text', show:true, label:'table.tbSimCard.status'},
                    {name: 'areaCode', width:{length:'160',}, type:'html', show:true, label:'table.tbSimCard.areaCode'},
                    {name: 'statusNew', width:{length:'80'}, type:'tag', show:true, label:'table.tbSimCard.statusNew'},
                    {name: 'restNetData', width:{length:'100'}, type:'text', show:true, label:'table.tbSimCard.restNetData'},
                    {name: 'monthTotalData', width:{length:'100'}, type:'text', show:true, label:'table.tbSimCard.monthTotalData'},
                    {name: 'simpAndPort', width:{length:'110'}, type:'text', show:true, label:'table.tbSimCard.simpAndPort'},
                    {name: 'expireDate', width:{length:'180'}, type:'date', show:true, label:'table.tbSimCard.expireDate'},
                    {name: 'vifiId', width:{length:'110', min:true}, type:'text', show:true, label:'table.tbSimCard.vifiId'},
                    {name: 'mdfTm', width:{length:'180'}, type:'text', show:true, label:'table.tbSimCard.mdfTm'},
                ],
                expandList:[
                    {name:'imei',label:'table.tbSimCard.imei'},
                    {name:'imsi',label:'table.tbSimCard.imsi'},
                    {name:'bindType',label:'table.tbSimCard.bindType'},
                    {name:'number',label:'table.tbSimCard.number'},
                    {name:'totalData',label:'table.tbSimCard.totalData'},
                    {name:'balance',label:'table.tbSimCard.balance'},

                    {name:'lastIdleTime',label:'table.tbSimCard.lastIdleTime'},
                    {name:'active',label:'table.tbSimCard.active'},
                    {name:'activeDays',label:'table.tbSimCard.activeDays'},
                    {name:'initConnectSign',label:'table.tbSimCard.initConnectSign'},
                    {name:'totalSuccess',label:'table.tbSimCard.totalSuccess'},
                    {name:'totalFailed',label:'table.tbSimCard.totalFailed'},

                    {name:'remarks',label:'table.tbSimCard.remarks'},
                ],
                computedLists: [
                    {
                        "idxSCGroupID":"11113-客户测试2",
                        "balance":"33.000",
                        "cardType":"R",
                        "contFailed":1,
                        "crtBy":"_EUROOT",
                        "crtTm":"2018-03-05 13:44:05",
                        "expireDate":"2037-12-11 00:00:00",
                        "failedDevices":"3110174330002867",
                        "idxIccid":"89650550530940000010",
                        "imei":"",
                        "imsi":"454070016063522",
                        "keySimCardID":"<span><i class='img-telecom telecom-mobile'></i><a href='javascript:void(0);'>89650550530940000010</a></span>",
                        "lastZeroTime":"2018-03-20 00:00:01",
                        "mdfBy":"admin",
                        "mdfTm":"2018-09-29 09:37:48",
                        "monthTotalData":0,
                        "onlineTime":0,
                        "remarks":"",
                        "restNetData":"36.000G",
                        "restSMSNum":0,
                        "simpAndPort":"simp_117:255",
                        "ssId":0,
                        "status":"禁用",
                        "statusNew":"禁用",
                        "todayTotalData":0,
                        "totalData":0,
                        "totalFailed":0,
                        "totalSuccess":84,
                        "vifiId":"",
                        "areaCode":"<span><i class='img-country country-cn'></i>中国安徽</span>",
                        tags:{
                            statusNew:'danger'
                        }
                    },
                    {
                        "idxSCGroupID":"11113-客户测试2",
                        "balance":"33.000",
                        "cardType":"R",
                        "contFailed":1,
                        "crtBy":"_EUROOT",
                        "crtTm":"2018-03-05 13:44:05",
                        "expireDate":"2037-12-11 00:00:00",
                        "failedDevices":"3110174330002867",
                        "idxIccid":"89650550530940000010",
                        "imei":"",
                        "imsi":"454070016063522",
                        "keySimCardID":"<span><i class='img-telecom telecom-mobile'></i><a href='javascript:void(0);'>89650550530940000012</a></span>",
                        "lastZeroTime":"2018-03-20 00:00:01",
                        "mdfBy":"admin",
                        "mdfTm":"2018-09-29 09:37:48",
                        "monthTotalData":0,
                        "onlineTime":0,
                        "remarks":"",
                        "restNetData":"36.000G",
                        "restSMSNum":0,
                        "simpAndPort":"simp_117:255",
                        "ssId":0,
                        "status":"禁用",
                        "statusNew":"禁用",
                        "todayTotalData":0,
                        "totalData":0,
                        "totalFailed":0,
                        "totalSuccess":84,
                        "vifiId":"",
                        "areaCode":"<span><i class='img-country country-cn'></i>中国安徽</span>",
                        tags:{
                            statusNew:'danger'
                        }
                    }
                ],
                computedList0:[]
            }
        },
        computed: {
            //计算属性是可以在父子组件间传递的
            computedList3: function () {
                let computedList3 = this.computedLists;
                return computedList3
            }
        },

    }

</script>