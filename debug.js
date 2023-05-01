import axios from 'axios';
import { load } from 'cheerio';
// import { fetch_papers } from './main.js';

const debugMode = true;
const reseracherId = "fvOYgyAAAAAJ"; // "LbgTPRwAAAAJ";

///
// MAIN
if (debugMode) {
    (async () => {
        console.log("Getting ", reseracherId)
        let data = []
        await fetch_papers(reseracherId).then((d) => { data = d; })
        console.log(data)
        console.log("Done")
    })();
}
///