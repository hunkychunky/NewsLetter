//jshint esversion: 8

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const fs = require('fs');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post('/', (req, res) =>{
    let firstName = req.body.fname;
    let lastName = req.body.lname;
    let email = req.body.email;  
    let data = {
        members: [
            {email_address: email,
             status: "subscribed",
             merge_fields: {
                 FNAME: firstName,
                 LNAME: lastName
             }}
        ]
    };

let jsonData = JSON.stringify(data);

    let options = {
        url: 'https://us5.api.mailchimp.com/3.0/lists/e30bace1fc?skip_merge_validation=<SOME_BOOLEAN_VALUE>&skip_duplicate_check=<SOME_BOOLEAN_VALUE>',
        method: 'POST',
        headers: {
            "Authorization": "Ahmad1 85f6ac38a6f47f5d6d238c92c1795242-us5"
        },
        body: jsonData
    };
    

    request(options, (error, response, body) => {
        if (error){
            res.sendFile(__dirname + "/failure.html");
        }else{
            if(response.statusCode === 200){
                res.sendFile(__dirname + "/success.html");
            } else{
                res.sendFile(__dirname + "/failure.html");
            }
        }
    });
    console.log(firstName, lastName, email);
});

app.post("/failure", (req, res) =>{
    res.redirect("/");
});

app.listen(process.env.PORT || 2000, () => {
    console.log("server running on port 2000");
});

// (async () => {
//     const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
//     const options = {logLevel: 'info', output: 'html', onlyCategories: ['performance'], port: chrome.port};
//     const runnerResult = await lighthouse('https://nameless-ocean-45392.herokuapp.com/', options);
  
//     const reportHtml = runnerResult.report;
//     fs.writeFileSync('lhreport.html', reportHtml);
  
//     console.log('Report is done for', runnerResult.lhr.finalUrl);
//     console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);
  
//     await chrome.kill();
//   })();
//API Key 
//85f6ac38a6f47f5d6d238c92c1795242-us5


//List ID
//e30bace1fc