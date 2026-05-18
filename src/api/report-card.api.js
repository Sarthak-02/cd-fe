import api from "./axios";

export async function getStudentGradesApi(student_id) {
    try {
        const resp = await api.get(`/students/${student_id}/report/grades`);
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
