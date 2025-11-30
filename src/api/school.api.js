import api from "./axios";

export async function getAllSchoolApi() {
    try {
        const resp = await api.get("/school/all");
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getSchoolApi(school_id) {
    try {
        const resp = await api.get(`/school?school_id=${school_id}`);
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function createSchoolApi(schoolData) {
    try {
        const resp = await api.post("/school", { ...schoolData });
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function updateSchoolApi(schoolData) {
    try {
        const resp = await api.put("/school", { ...schoolData });
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function deleteSchoolApi(school_id) {
    try {
        const resp = await api.delete(`/school?school_id=${school_id}`);
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
