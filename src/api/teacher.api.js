import api from "./axios";

export async function getAllTeacherApi() {
    try {
        const resp = await api.get("/teacher/all");
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getTeacherApi(teacher_id) {
    try {
        const resp = await api.get(`/teacher?teacher_id=${teacher_id}`);
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function createTeacherApi(teacherData) {
    try {
        const resp = await api.post("/teacher", { ...teacherData });
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function updateTeacherApi(teacherData) {
    try {
        const resp = await api.put("/teacher", { ...teacherData });
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function deleteTeacherApi(teacher_id) {
    try {
        const resp = await api.delete(`/teacher?teacher_id=${teacher_id}`);
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
