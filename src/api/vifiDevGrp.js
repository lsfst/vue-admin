import request from '@/utils/request'
import qs from 'qs'

export function fetch(query) {
    //直接对query操作会影响全局query
    let _query=JSON.parse(JSON.stringify(query));
    _query.orderList = JSON.stringify(_query.orderList)
    if(_query.mdfTm){
        _query.lte_mdfTm=_query.mdfTm[1]
        _query.gte_mdfTm=_query.mdfTm[0]
    }
    return request({
        url: '/api/dev/group',
        method: 'get',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2"},
        params: _query
    })
}

export function create(data) {
    return request({
        url: '/api/dev/group',
        method: 'post',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2",'Content-Type':'application/x-www-form-urlencoded'},
        data:qs.stringify(data)
    })
}

export function update(data) {
    // let datas=JSON.parse(JSON.stringify(data));
    // datas.idList = JSON.stringify(data.idList)
    return request({
        url: '/api/dev/group',
        method: 'put',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2",'Content-Type':'application/x-www-form-urlencoded'},
        data:qs.stringify(data)
    })
}

export function remove(data) {
    return request({
        url: '/api/dev/group',
        method: 'delete',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2"},
        data:{idList:data}
    })
}
