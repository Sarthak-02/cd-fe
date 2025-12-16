import api from "./axios";

export async function getAllStudentApi(campus_id) {
    try {
        const resp = await api.get(`/student/all?campus_id=${campus_id}`);
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getStudentApi(student_id) {
    try {
        const resp = await api.get(`/student?student_id=${student_id}`);
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function createStudentApi(studentData) {
    try {
        const resp = await api.post("/student", { ...studentData });
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function updateStudentApi(studentData) {
    try {
        const resp = await api.put("/student", { ...studentData });
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function deleteStudentApi(student_id) {
    try {
        const resp = await api.delete(`/student?student_id=${student_id}`);
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
