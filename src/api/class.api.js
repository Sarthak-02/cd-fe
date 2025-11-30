import api from "./axios";

export async function getAllClassApi() {
    try {
        const resp = await api.get("/class/all");
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getClassApi(class_id) {
    try {
        const resp = await api.get(`/class?class_id=${class_id}`);
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function createClassApi(classData) {
    try {
        const resp = await api.post("/class", { ...classData });
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function updateClassApi(classData) {
    try {
        const resp = await api.put("/class", { ...classData });
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function deleteClassApi(class_id) {
    try {
        const resp = await api.delete(`/class?class_id=${class_id}`);
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
