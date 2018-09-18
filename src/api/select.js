import request from '@/utils/request'

export function discountS2(query) {
    return request({
        url: 'https://localhost:18089/esspadmin/api/select2/discountS2',
        method: 'get',
        headers: {'Authorization': "Basic YWRtaW46MTIzNDU2"},
        params: query
    })
}

