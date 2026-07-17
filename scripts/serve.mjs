import http from "node:http";
import {readFile,stat} from "node:fs/promises";
import {extname,join,normalize} from "node:path";
const root=normalize(join(import.meta.dirname,"..","public"));
const types={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".svg":"image/svg+xml",".webmanifest":"application/manifest+json"};
http.createServer(async(req,res)=>{try{let path=normalize(join(root,decodeURIComponent(req.url.split("?")[0])));if(!path.startsWith(root))throw Error();if((await stat(path)).isDirectory())path=join(path,"index.html");const data=await readFile(path);res.writeHead(200,{"content-type":types[extname(path)]||"application/octet-stream"});res.end(data)}catch{res.writeHead(404);res.end("Not found")}}).listen(4173,"127.0.0.1");
