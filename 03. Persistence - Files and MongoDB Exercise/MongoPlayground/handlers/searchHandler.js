const fs = require('fs');
const Image = require('mongoose').model('Image');
const Tag = require('mongoose').model('Tag');

module.exports = (req, res) => {
  if (req.pathname === '/search') {
    fs.readFile('./views/results.html', 'utf8', (err, html) => {
      if (err) {
        throw err;
      }

      const params = {};

      if (req.pathquery.afterDate) { }
      if (req.pathquery.beforeDate) { }
      if (req.pathquery.Limit) { }

      if (req.pathquery.tagName) {
        const tags = req.pathquery.tagName
          .split(',')
          .filter(e => e.length > 0);

        if (tags.length > 0) {
          Tag.find({ name: { $in: tags } }).then(data => {
            const tagIds = data.map(m => m._id);
            params.tags = tagIds;
            getImagesAndRespond(params);
          });
        } else {
          getImagesAndRespond(params);
        }
      }
      
      function getImagesAndRespond(params) {
        Image.find(params).then(data => {
          let imageHtml = '';
      
          for (let image of data) {
            imageHtml += imageTemplate(image);
          }
      
          html = html.replace('<div class="replaceMe"></div>', imageHtml);
      
          res.writeHead(200, {
            'Content-Type': 'text/html'
          });
      
          res.write(html);
          res.end();
        });
      }
    });
  } else {
    return true
  }
}

function imageTemplate(image) {
  return `<fieldset id="${image._id}">
  <img src="${image.url}">
  </img><p>${image.description}<p/>
  <button onclick='location.href="/delete?id=${image._id}"'class='deleteBtn'>Delete
  </button> 
  </fieldset>`;
}