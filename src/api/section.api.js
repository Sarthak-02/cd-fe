import api from "./axios";

export async function getAllSectionApi() {
    try {
        const resp = await api.get("/section/all");
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getSectionApi(section_id) {
    try {
        const resp = await api.get(`/section?section_id=${section_id}`);
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function createSectionApi(sectionData) {
    try {
        const resp = await api.post("/section", { ...sectionData });
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function updateSectionApi(sectionData) {
    try {
        const resp = await api.put("/section", { ...sectionData });
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function deleteSectionApi(section_id) {
    try {
        const resp = await api.delete(`/section?section_id=${section_id}`);
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
