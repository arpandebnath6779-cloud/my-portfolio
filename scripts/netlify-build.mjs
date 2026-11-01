import { cp, mkdir, rm } from "node:fs/promises";
const files=["index.html","style.css","script.js","arpanx.css","arpanx.js"];
await rm("dist",{recursive:true,force:true});
await mkdir("dist",{recursive:true});
for(const file of files) await cp(file,"dist/"+file);
await cp("assets","dist/assets",{recursive:true});
console.log("Prepared portfolio files for Netlify.");
