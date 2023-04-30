import axios from 'axios';
import { load } from 'cheerio';


const reseracherId = "fvOYgyAAAAAJ"; // "LbgTPRwAAAAJ";
const baseUrl = "https://scholar.google.com/citations?user={0}&hl=en&cstart={1}&pagesize=100"
const debugMode = true;

function print() {
    if (debugMode) {
        let outStr = "";
        for (let index = 0; index < arguments.length; index++) {
            const a = arguments[index];
            outStr += a;
        }
        console.log(outStr);
    }
}

function _createUrl(researcherId, start) {
    return baseUrl.replace("{0}", researcherId).replace("{1}", start)
}

async function fetch_papers(researcherId, maxPapers = 100) {
    print("- Google Scholar fetch started -")
    let data = []
    let lastData = null;
    let STEP = 100 // maximum supported by scholar

    for (let round = 0; round < maxPapers; round = round + STEP) {

        let reseracherUrl = _createUrl(researcherId, round);
        print("Created url ", reseracherUrl)

        let request = await axios.get(reseracherUrl);
        if (request.status != 200) {
            console.error("Unable to get content from " + reseracherUrl);
            return;
        }
        let currData = request.data;

        let researcherData = _parse(currData);
        if (researcherData.length > 0) {
            let lastElement = researcherData[researcherData.length - 1].title;
            if (lastData != lastElement) {
                data.push(researcherData);
                lastData = lastElement;
            }
            else {
                break;
            }
        }
        else {
            break;
        }
    }
    data = data.flat(1);
    print(`Found ${data.length} papers`);
    print("- Google Scholar fetch ended -");
    return data;
}


function _parse(html) {
    const $ = load(html)

    let titles = [];
    $(".gsc_a_t > a").each((i, el) => {
        titles.push($(el).text())
    })  // title

    let authors = [];
    $(".gsc_a_t > .gs_gray").each((i, el) => {
        authors.push($(el).text())
    })  // authors

    // authors contains also the venues
    if (authors.length != titles.length * 2) {
        console.error("Unable to retrieve the conference")
    }

    let cits = [];
    $(".gsc_a_c > a").each((i, el) => {
        cits.push($(el).text())
    })  // citations

    let years = [];
    $(".gsc_a_y > span").each((i, el) => {
        let t = $(el).text()
        if (t == "Year") {
            return;
        }
        years.push(t)
    })  // year

    if (cits.length != years.length || years.length != titles.length) {
        console.error("Unable to retrieve data");
        return;
    }

    let finalData = []
    let authorIdx = 0;
    for (let i = 0; i < titles.length; i++) {
        finalData.push({
            "title": titles[i],
            "authors": authors[authorIdx],
            "venue": authors[authorIdx + 1],
            "citations": cits[i],
            "year": years[i]
        })
        authorIdx += 2;
    }

    return finalData
}

///
// MAIN
if (debugMode) {
    (async () => {
        console.log("Getting ", reseracherId)
        let data = []
        await fetch_papers(reseracherId).then((d)=>{data = d;})    
        console.log(data)
        console.log("Done")
    })();
}
///