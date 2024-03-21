import request from "@/utlis/request";

export const loadPieChartData = () => {
    return request.get('/chart')
}

export const loadColumnChartData = () => {
    return request.get('/chart-date')
}

export const loadMapData = () => {
    return request.get('/chart-map')
}