/**
 * Created by sz on 2018/10/16.
 * 数据统计 api
 */
import request from '@/utils/request'

export function last30DaysTraffic() {
    return request({
        url: 'api/simCard/last30DaysTraffic',
        method: 'get',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2"},
    })
}

export function getGrpMonthInfo(data) {
    return request({
        url: 'api/grpCount/getGrpMonthInfo',
        method: 'get',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2"},
        params:data
    })
}
