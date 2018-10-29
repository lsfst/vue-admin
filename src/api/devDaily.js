import request from '@/utils/request'
import qs from 'qs'

export function fetch(query) {
    //直接对query操作会影响全局query
    let _query=JSON.parse(JSON.stringify(query));
    if(_query.countDate){
        _query.lte_countDate=_query.countDate[1]
        _query.gte_countDate=_query.countDate[0]
    }
    if(_query.crtTm){
        _query.lte_crtTm=_query.crtTm[1]
        _query.gte_crtTm=_query.crtTm[0]
    }
    _query.orderList = JSON.stringify(_query.orderList)
    return request({
        url: '/api/devCount',
        method: 'get',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2"},
        params: _query
    })
}

export function fetchMonthly(query) {
    //直接对query操作会影响全局query
    let _query=JSON.parse(JSON.stringify(query));
    if(_query.countDate){
        _query.lte_countDate=_query.countDate[1]
        _query.gte_countDate=_query.countDate[0]
    }
    if(_query.crtTm){
        _query.lte_crtTm=_query.crtTm[1]
        _query.gte_crtTm=_query.crtTm[0]
    }
    _query.orderList = JSON.stringify(_query.orderList)
    return request({
        url: '/api/devCount/month',
        method: 'get',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2"},
        params: _query
    })
}