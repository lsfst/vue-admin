import request from '@/utils/request'
import qs from 'qs'

export function fetch(query) {
    //直接对query操作会影响全局query
    let _query=JSON.parse(JSON.stringify(query));
    _query.orderList = JSON.stringify(_query.orderList)
    return request({
        url: '/api/globalSIM',
        method: 'get',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2"},
        params: _query
    })
}

export function create(data) {
    return request({
        url: '/api/globalSIM',
        method: 'post',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2",'Content-Type':'application/x-www-form-urlencoded'},
        data:qs.stringify(data)
    })
}

export function update(data) {
    return request({
        url: '/api/globalSIM',
        method: 'put',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2",'Content-Type':'application/x-www-form-urlencoded'},
        data:qs.stringify(data)
    })
}

export function remove(data) {
    return request({
        url: '/api/globalSIM',
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
        url: '/api/globalSIM/group',
        method: 'get',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2"},
        params: _query
    })
}

export function createGroup(data) {
    return request({
        url: '/api/globalSIM/group',
        method: 'post',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2",'Content-Type':'application/x-www-form-urlencoded'},
        data:qs.stringify(data)
    })
}

export function updateGroup(data) {
    // let datas=JSON.parse(JSON.stringify(data));
    // datas.idList = JSON.stringify(data.idList)
    return request({
        url: '/api/globalSIM/group',
        method: 'put',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2",'Content-Type':'application/x-www-form-urlencoded'},
        data:qs.stringify(data)
    })
}

export function removeGroup(data) {
    return request({
        url: '/api/globalSIM/group',
        method: 'delete',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2"},
        data:{idList:data}
    })
}