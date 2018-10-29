import request from '@/utils/request'
import qs from 'qs'

export function fetch(query) {
    //直接对query操作会影响全局query
    let _query=JSON.parse(JSON.stringify(query));
    _query.orderList = JSON.stringify(_query.orderList)
    _query.in_statusNew=_query.in_statusNew?_query.in_statusNew.join(","):_query.in_statusNew
    if(_query.mdfTm){
        _query.lte_mdfTm=_query.mdfTm[1]
        _query.gte_mdfTm=_query.mdfTm[0]
    }
    return request({
        url: '/api/simCard',
        method: 'get',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2"},
        params: _query
    })
}

export function create(data) {
    return request({
        url: '/api/simCard',
        method: 'post',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2",'Content-Type':'application/x-www-form-urlencoded'},
        data:qs.stringify(data)
    })
}

export function update(data) {
    // let datas=JSON.parse(JSON.stringify(data));
    // datas.idList = JSON.stringify(data.idList)
    return request({
        url: '/api/simCard',
        method: 'put',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2",'Content-Type':'application/x-www-form-urlencoded'},
        data:qs.stringify(data)
    })
}

export function remove(data) {
    return request({
        url: '/api/simCard',
        method: 'delete',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2"},
        data:{idList:data}
    })
}

export function fetchGroup(query) {
    //直接对query操作会影响全局query
    let _query=JSON.parse(JSON.stringify(query));
    _query.orderList = JSON.stringify(_query.orderList)
    return request({
        url: '/api/simCard/group',
        method: 'get',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2"},
        params: _query
    })
}

export function createGroup(data) {
    return request({
        url: '/api/simCard/group',
        method: 'post',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2",'Content-Type':'application/x-www-form-urlencoded'},
        data:qs.stringify(data)
    })
}

export function updateGroup(data) {
    // let datas=JSON.parse(JSON.stringify(data));
    // datas.idList = JSON.stringify(data.idList)
    return request({
        url: '/api/simCard/group',
        method: 'put',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2",'Content-Type':'application/x-www-form-urlencoded'},
        data:qs.stringify(data)
    })
}

export function removeGroup(data) {
    return request({
        url: '/api/simCard/group',
        method: 'delete',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2"},
        data:{idList:data}
    })
}

export function fetchSales(query) {
    //直接对query操作会影响全局query
    let _query=JSON.parse(JSON.stringify(query));
    _query.orderList = JSON.stringify(_query.orderList)
    return request({
        url: '/api/simCard/sales',
        method: 'get',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2"},
        params: _query
    })
}

export function createSales(data) {
    return request({
        url: '/api/simCard/sales',
        method: 'post',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2",'Content-Type':'application/x-www-form-urlencoded'},
        data:qs.stringify(data)
    })
}

export function updateSales(data) {
    return request({
        url: '/api/simCard/sales',
        method: 'put',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2",'Content-Type':'application/x-www-form-urlencoded'},
        data:qs.stringify(data)
    })
}

export function removeSales(data) {
    return request({
        url: '/api/simCard/sales',
        method: 'delete',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2"},
        data:{idList:data}
    })
}

export function fetchDaily(query) {
    //直接对query操作会影响全局query
    let _query=JSON.parse(JSON.stringify(query));
    _query.orderList = JSON.stringify(_query.orderList)
    if(_query.crtTm){
        _query.lte_crtTm=_query.crtTm[1]
        _query.gte_crtTm=_query.crtTm[0]
    }
    if(_query.countDate){
        _query.lte_countDate=_query.countDate[1]
        _query.gte_countDate=_query.countDate[0]
    }
    return request({
        url: '/api/simCard/daily',
        method: 'get',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2"},
        params: _query
    })
}

export function fetchMonthly(query) {
    //直接对query操作会影响全局query
    let _query=JSON.parse(JSON.stringify(query));
    _query.orderList = JSON.stringify(_query.orderList)
    if(_query.crtTm){
        _query.lte_crtTm=_query.crtTm[1]
        _query.gte_crtTm=_query.crtTm[0]
    }
    if(_query.countDate){
        _query.lte_countDate=_query.countDate[1]
        _query.gte_countDate=_query.countDate[0]
    }
    return request({
        url: '/api/simCard/monthly',
        method: 'get',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2"},
        params: _query
    })
}
