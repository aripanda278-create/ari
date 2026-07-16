import {readFile, writeFile} from "node:fs/promises";

const sourceFile = process.argv[2] || "map-latest.sql";
const outputFile = process.argv[3] || "public/map-data.js";

function parseValues(line) {
  const start = line.indexOf("VALUES (");
  if (start < 0) return null;
  const body = line.slice(start + 8, line.lastIndexOf(");"));
  const values = [];
  let value = "", quoted = false;
  for (let index = 0; index < body.length; index++) {
    const char = body[index];
    if (quoted) {
      if (char === "\\" && index + 1 < body.length) value += body[++index];
      else if (char === "'" && body[index + 1] === "'") { value += "'"; index++; }
      else if (char === "'") quoted = false;
      else value += char;
    } else if (char === "'") quoted = true;
    else if (char === ",") { values.push(value.trim()); value = ""; }
    else value += char;
  }
  values.push(value.trim());
  return values;
}

const sql = await readFile(sourceFile, "utf8");
const villages = [];
for (const line of sql.split(/\r?\n/)) {
  const row = parseValues(line);
  if (!row || row.length < 13) continue;
  villages.push({
    x: Number(row[1]), y: Number(row[2]), tribe: Number(row[3]),
    village: row[5], playerId: Number(row[6]), player: row[7],
    alliance: row[9], population: Number(row[10]) || 0,
    capital: String(row[12]).toUpperCase() === "TRUE"
  });
}
const payload = `window.MAP_META=${JSON.stringify({source:"https://ts4.x1.international.travian.com/map.sql",updatedAt:new Date().toISOString(),villages:villages.length})};\nwindow.MAP_DATA=${JSON.stringify(villages)};\n`;
await writeFile(outputFile, payload, "utf8");
console.log(`Updated ${outputFile}: ${villages.length} villages`);
