const UrlModel = require('../models/urlModel.js');
const dns = require('dns');


const protocolRegex = /^https?:\/\/(.*)/i; // match protocol and capture following
const hostNameRegex = /^(?:[a-z0-9\-_]+\.)+[a-z0-9\-_]+/i; // match hostname before /

exports.addUrl = function(req, res) {

    let url = req.body.url;
  
    if (url.match(/\/$/)) { // remove trailing /
        url = url.slice(0, -1); 
    }

    let protocolMatch = url.match(protocolRegex);
    if(!protocolMatch) {
        return res.json({"error": "invalid URL"}) // if you end the callback with response, ALWAYS return!
    }

    const hostAndQuery = protocolMatch[1]; //only the captured group(after) for dns.lookup(host_and_query)
    const hostNameMatch = hostAndQuery.match(hostNameRegex);
    console.log("hostNameMatch: " + hostNameMatch);
    if (hostNameMatch) {
        dns.lookup(hostNameMatch[0], err => { //the URL has a valid wwww.example.com[/whatever] format
            if (err) {
                res.json({"error": "invalid Hostname"})    
            } else { //url is ok. check if url exists in db            
            UrlModel
                .findOne({"originalUrl": url}, (err, doc) => {
                    if(err) return;
                    if(doc) { // url exists in db. return it.
                        res.json({"original_url": url, "short_url": doc.shortUrl});
                    } else { // add new url to db
                        let newUrlDoc = new UrlModel({originalUrl: url}); 
                        newUrlDoc.save((err, doc) => { // mongoose cues everything for connection
                            if(err) return console.log(err);
                            res.json({"original_url": doc.originalUrl, "short_url": doc.shortUrl})
                        });
                    }
                });    
            }
        });
    } else { // the url has invalid hostname
        res.json({"error": "invalid URL"});
    }
};

exports.redirectWithShortUrl = function(req, res) {
    const shortUrl = req.params.shortUrl;
    UrlModel
        .findOne({"shortUrl": shortUrl}, (err, doc) =>{
            if(err) return console.log(err);
            if(doc) {
                res.redirect(doc.originalUrl);
            } else {
                res.json({"error": "No such short-url found in db"})
            }
        });
};