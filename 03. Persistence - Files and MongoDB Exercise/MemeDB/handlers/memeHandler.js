const fs = require("fs");
const qs = require("querystring");
const url = require("url");
const formidable = require("formidable");
const shortId = require("shortid");
const db = require(".././config/dataBase");

const allMemesPath = "./views/viewAll.html";
const addMemePath = "./views/addMeme.html";
const getDetailsPath = "./views/details.html";

function memeGenerator(id, title, memeSrc, description, privacy) {
    return {
        id: id,
        title: title,
        memeSrc: memeSrc,
        description: description,
        privacy: privacy,
        dateStamp: Date.now()
    }
}

function defaultResponse(res, data) {
    res.writeHead(200, {
        "content-type": "text/html"
    });

    res.end(data);
}

function viewAll(req, res) {
    let allMemes = db.getDb();

    allMemes = allMemes
        .sort((a, b) => {
            return b.dateStamp - a.dateStamp
        })
        .filter(currentMeme => {
            return currentMeme.privacy === "on"
        });

    let content = "";

    for (let meme of allMemes) {
        content += `<div class="meme">
              <a href="/getDetails?id=${meme.id}">
              <img class="memePoster" src="${meme.memeSrc}"/>          
            </div>`
    }
    fs.readFile(allMemesPath, "utf8", (err, data) => {
        if (err) {
            console.log(err);
            return
        }
        data = data.toString().replace(`<div id="replaceMe">{{replaceMe}}</div>`, content);

        defaultResponse(res, data);
    })
}

function viewAddMeme(req, res) {
    fs.readFile(addMemePath, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        defaultResponse(res, data)
    })

}

function addMeme(req, res) {
    let fileName = shortId.generate();

    let dbLength = Math.ceil(db.getDb().length / 10);

    let memePath = `./public/memeStorage/${dbLength}/${fileName}.jpg`;

    fs.access(`./public/memeStorage/${dbLength}`, (err) => {
        if (err) {
            fs.mkdirSync(`./public/memeStorage/${dbLength}`)
        }

        let form = new formidable.IncomingForm();

        form
            .on("error", err => {
                console.log(err);
            })
            .on("fileBegin", function (name, file) {
                file.path = memePath;
            });

        form.parse(req, function (err, fields, files) {
            console.log(fields);

            let id = shortId.generate();
            let createdMeme = memeGenerator(id, fields.memeTitle, memePath, fields.memeDescription, fields.status);

            db.add(createdMeme);

            db.save().then(() => {
                viewAll(req, res);
            }).catch((err) => {
                console.log(err);
            });
        });
    });
}

function getDetails(req, res) {
    let memeId = qs.parse(url.parse(req.url).query).id;

    fs.readFile(getDetailsPath, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        let targetedMeme = db.getMemeById(memeId);
        let content =
            `<div class="content">
                <img src="${targetedMeme.memeSrc}" alt=""/>
                <h3>Title  ${targetedMeme.title}</h3>
                <p> ${targetedMeme.description}</p>
                <button><a href="/downloadMeme?id=${targetedMeme.id}">Download Meme</a></button>
            </div>`;

        data = data.toString().replace(`<div id="replaceMe">{{replaceMe}}</div>`, content);
        defaultResponse(res, data);
    })
}

function downloadMeme(req, res) {
    let memeId = qs.parse(url.parse(req.url).query).id;
    let meme = db.getMemeById(memeId);

    res.setHeader('Content-disposition', 'attachment; filename=' + meme.id + ".jpg");
    res.setHeader('Content-type', "image/jpg");

    let filestream = fs.createReadStream(meme.memeSrc);
    filestream.pipe(res);
}

module.exports = (req, res) => {
    if (req.pathname === '/viewAllMemes' && req.method === 'GET') {
        viewAll(req, res)
    } else if (req.pathname === '/addMeme' && req.method === 'GET') {
        viewAddMeme(req, res)
    } else if (req.pathname === '/addMeme' && req.method === 'POST') {
        addMeme(req, res)
    } else if (req.pathname.startsWith('/getDetails') && req.method === 'GET') {
        getDetails(req, res)
    } else if (req.pathname.startsWith('/downloadMeme') && req.method === 'GET') {
        downloadMeme(req, res)
    } else {
        return true
    }
};