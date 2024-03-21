import request from "@/utlis/request";

export const submit = (data) => {
    return request.post('/survey',
        data
    )
} 
