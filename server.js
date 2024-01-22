const express = require('express');
const axios = require('axios');
const fs = require('fs');
const {getDataForAdminRole, getDataForEditorRole} = require("./services/roleBasedAccess")

const app = express();
const PORT = process.env.PORT || 3000;

var jsonDataObj = [];

const filePath = "./data/response.json"

async function createAndAppendData(res) {
    jsonDataObj.push(res);
    const jsonData = JSON.stringify(jsonDataObj, null, 2);
    console.log("From createAndAppendData function", jsonDataObj);
    fs.writeFileSync(filePath, jsonData, (err) => {
        if (err) {
            console.log(`error writing data into json file ${err}`)
        }
        else {
            console.log(`Data has been wriiten successfully to ${filePath}`)
        }
    })
}

app.get('/fetch-data/:id', async (req, res) => {
  try {
    if(req.params.id == 1) {
        var response = await axios.get("https://run.mocky.io/v3/48314576-ff23-405f-a8fa-d6643fa7d06e");
    } else if (req.params.id == 2) {
        var response = await axios.get("https://run.mocky.io/v3/85f33053-b7d2-4d49-8e94-694f8d335a4f");
    }
    res.json(response.data);
    createAndAppendData(response.data)
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/get-role-based-data/:role', async (req, res) => {
    console.log("Role", req.params.role);

    try {
        const result = await getDataFromJsonFile(filePath);

        if (req.params.role === "Admin") {
            console.log("Role =====", req.params.role);
            const getDataForAdmin = getDataForAdminRole(result);
            res.json(getDataForAdmin);
        } else if (req.params.role == "Editor") {
            console.log("Role =====", req.params.role);
            const getDataForEditor = getDataForEditorRole(result);
            res.json(getDataForEditor);

        } else {
            res.json({ message: `Role is not ${req.params.role}. Access denied.` });
        }
    } catch (err) {
        console.log("Error in fetching the role-based data ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


async function getDataFromJsonFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.log(`Error in reading data from ${filePath}: ${err.message}`);
        throw err; // Rethrow the error if needed
    }
}



app.put('/update-data', async (req, res) => {
    console.log("Update req ", req.body);
    const result = await getDataFromJsonFile(filePath);
    const Accessrole = parseInt(req.params.role);
    const UpdateData = req.body;
    if(req.body.role == "Admin") {
        const index = result.findIndex((role) => role === Accessrole);
        console.log("Index ===", index)
        if (index !== -1) {
            result[index] = { ...result[index], ...UpdateData };
            res.json(result[index]);
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
