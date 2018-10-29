import request from '@/utils/request'
import qs from 'qs'

export function fetch(query) {
    //直接对query操作会影响全局query
    let _query=JSON.parse(JSON.stringify(query));
    _query.orderList = JSON.stringify(_query.orderList)
    if(_query.lastConnectTime){
        _query.lte_lastConnectTime=_query.lastConnectTime[1]
        _query.gte_lastConnectTime=_query.lastConnectTime[0]
    }
    if(_query.lastConnectTime){
        _query.lte_lastConnectTime=_query.lastConnectTime[1]
        _query.gte_lastConnectTime=_query.lastConnectTime[0]
    }
    _query.in_online=_query.in_online?_query.in_online.join(","):_query.in_online
    _query.in_bootFirstISP=_query.in_bootFirstISP?_query.in_bootFirstISP.join(","):_query.in_bootFirstISP
    return request({
        url: '/api/dev',
        method: 'get',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2"},
        params: _query
    })
}

export function create(data) {
    return request({
        url: '/api/dev',
        method: 'post',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2",'Content-Type':'application/x-www-form-urlencoded'},
        data:qs.stringify(data)
    })
}

export function update(data) {
    // let datas=JSON.parse(JSON.stringify(data));
    // datas.idList = JSON.stringify(data.idList)
    return request({
        url: '/api/dev',
        method: 'put',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2",'Content-Type':'application/x-www-form-urlencoded'},
        data:qs.stringify(data)
    })
}

export function remove(data) {
    return request({
        url: '/api/dev',
        method: 'delete',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2"},
        data:{idList:data}
    })
}

export function check(data) {
    return request({
        url: '/api/dev/check',
        method: 'get',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2"},
        params: data
    })
}


export function fetchAction(query) {
    //直接对query操作会影响全局query
    let _query=JSON.parse(JSON.stringify(query));
    _query.orderList = JSON.stringify(_query.orderList)
    _query.in_cardType=_query.in_cardType?_query.in_cardType.join(","):_query.in_cardType
    _query.in_reqAct=_query.in_reqAct?_query.in_reqAct.join(","):_query.in_reqAct
    if(_query.reqDate){
        _query.lte_reqDate=_query.reqDate[1]
        _query.gte_reqDate=_query.reqDate[0]
    }
    return request({
        url: '/api/dev/action',
        method: 'get',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2"},
        params: _query
    })
}

export function fetchCmd(query) {
    //直接对query操作会影响全局query
    let _query=JSON.parse(JSON.stringify(query));
    _query.orderList = JSON.stringify(_query.orderList)
    return request({
        url: '/api/dev/cmd',
        method: 'get',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2"},
        params: _query
    })
}

