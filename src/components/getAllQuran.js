export default async function getAllQuran(path) {
    return getQuranData(path);
}

function getQuranData(path) {
    const allQuran = axios
        .get(path)
        .then(response => response.data)
        .then(data => data);
    return allQuran;
}