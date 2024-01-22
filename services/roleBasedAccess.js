const getDataForAdminRole = (req, res) => {
    return req.map(data => {
        const adminAccessKeys = data.access_control.Admin || [];
        console.log("Admin access key ===", adminAccessKeys);
        const filterData = Object.keys(data)
        .filter(key => adminAccessKeys.includes(key))
        .reduce((obj, key) => {
            obj[key] = data[key];
            return obj;
        }, {});
        res = filterData;
        console.log("Inside getDataForAdminRole() function ", res)
        return res;
    });
}

const getDataForEditorRole = (req, res) => {
    return req.map(data => {
        const adminAccessKeys = data.access_control.Editor || [];
        console.log("Admin access key ===", adminAccessKeys);
        const filterData = Object.keys(data)
        .filter(key => adminAccessKeys.includes(key))
        .reduce((obj, key) => {
            obj[key] = data[key];
            return obj;
        }, {});
        res = filterData;
        console.log("Inside getDataForAdminRole() function ", res)
        return res;
    });
}
module.exports = {
    getDataForAdminRole,
    getDataForEditorRole
}