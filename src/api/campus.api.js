import api from "./axios";

export async function getAllCampusApi() {
    try {
        const resp = await api.get("/campus/all");
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getCampusApi(campus_id) {
    try {
        const resp = await api.get(`/campus?campus_id=${campus_id}`);
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function createCampusApi(campusData) {
    try {
        const resp = await api.post("/campus", { ...campusData });
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function updateCampusApi(campusData) {
    try {
        const resp = await api.put("/campus", { ...campusData });
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function deleteCampusApi(campus_id) {
    try {
        const resp = await api.delete(`/campus?campus_id=${campus_id}`);
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
