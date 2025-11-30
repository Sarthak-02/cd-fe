import api from "./axios";


export async function loginApi({userid,password}){
     console.log(userid,password)
    try{
        let resp = await api.post("/login",{
            userid,password
        })
        
        return resp.data ;
    }
    catch(err){
        console.log(err.response.data)
        throw err.response.data
    }
}

