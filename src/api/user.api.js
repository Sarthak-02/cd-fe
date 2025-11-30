import api from "./axios";


export async function getAllUserApi(){
    try{
        const resp = await api.get("/user/all")

        return resp.data
    }
    catch(err){
        console.log(err)
        throw err
    }
}

export async function getUserApi(userid){
    try{
        const resp = await api.get(`/user?userid=${userid}`)

        return resp.data
    }
    catch(err){
        console.log(err)
        throw err
    }
}

export async function updateUserApi(userData) {
    try{
        const resp = await api.put('/user',{
            ...userData
        })

        return resp.data
    }
    catch(err){
        console.log(err)
        throw err
    }
}

export async function createUserApi(userData) {
    try{
        const resp = await api.post('/user',{
            ...userData
        })

        return resp.data
    }
    catch(err){
        console.log(err)
        throw err
    }
}