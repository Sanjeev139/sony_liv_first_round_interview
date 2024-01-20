const express = require('express');
const axios = require('axios');
const fs = require('fs');

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

app.get('/get-role-based-data/:role', async(req,res) => {
    var JSONData;
    console.log("Role", req.params.role);
    const data = fs.readFile(filePath, 'utf-8', (err, data) => {
        if(err) {
            console.log(`Error reading data from ${filePath}`);
        } else {
            JSONData = data;
        }
    })
    result = JSON.parse(JSONData);
    if (req.params.role == "Admin") {
        console.log("File Path", filePath)
        result.map(data => 
            {
                console.log("Role", data.access_control.Admin)
                const adminAccessKeys = data.access_control.Admin || [];
                    
                // Filter the keys based on admin access
                const filtereData = Object.keys(data)
                    .filter(key => adminAccessKeys.includes(key))
                    .reduce((obj, key) => {
                    obj[key] = data[key];
                    return obj;
                    }, 
                {});
                    res.json(filtereData);
                })
    } else if (req.params.role == "Editor") 
    {
        result.map(data => {
            console.log("Role", data.access_control.Editor)
            const adminAccessKeys = data.access_control.Editor || [];
            
            // Filter the keys based on admin access
            const filtereData = Object.keys(data)
                .filter(key => adminAccessKeys.includes(key))
                .reduce((obj, key) => {
                obj[key] = data[key];
                return obj;
                }, {});
                    res.json(filtereData);
                })
    }
})

// PUT endpoint to update a todo's completion status
app.put('/update-data/:role', (req, res) => {
    const updateId = parseInt(req.params.role);
    const UpdateData = req.body;
  
    const index = data.findIndex((updateId) => updateId.role === role);
    if (index !== -1) {
        updateId[index] = { ...updateId[index], ...UpdateData };
      res.json(updateId[index]);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  });


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
