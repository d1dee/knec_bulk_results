import { parse } from "node-html-parser";
import { tabletojson } from "tabletojson";
import { indexes } from "./indexes.ts";

const learners: Array<{ name: string; indexNumber: string }> = indexes;

const BASE_URL = "https://results.knec.ac.ke/";

if (!BASE_URL) {
    console.error("Usage: deno run --allow-net fetch_page.ts <url>");
    Deno.exit(1);
}

async function queryKnec(learner: { INDEXNO: string; NAME: string }) {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Host", "results.knec.ac.ke");
        myHeaders.append(
            "User-Agent",
            "Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0",
        );
        myHeaders.append(
            "Accept",
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/jxl,image/webp,image/png,image/svg+xml,*/*;q=0.8",
        );
        myHeaders.append("Accept-Language", "en-US,en;q=0.5");
        myHeaders.append("Accept-Encoding", "gzip, deflate, br, zstd");
        myHeaders.append(
            "Content-Type",
            "application/x-www-form-urlencoded",
        );
        myHeaders.append("Origin", "https://results.knec.ac.ke");
        myHeaders.append("DNT", "1");
        myHeaders.append("Sec-GPC", "1");
        myHeaders.append("Connection", "keep-alive");
        myHeaders.append("Referer", "https://results.knec.ac.ke/");
        myHeaders.append(
            "Cookie",
            "ASP.NET_SessionId=o4ob2tilag4axxj2z315pnp1",
        );
        myHeaders.append("Upgrade-Insecure-Requests", "1");
        myHeaders.append("Sec-Fetch-Dest", "document");
        myHeaders.append("Sec-Fetch-Mode", "navigate");
        myHeaders.append("Sec-Fetch-Site", "same-origin");
        myHeaders.append("Sec-Fetch-User", "?1");
        myHeaders.append("host", "results.knec.ac.ke");

        const urlencoded = new URLSearchParams();
        urlencoded.append("indexNumber", learner.INDEXNO);
        urlencoded.append("name", learner.NAME.split(" ")[0]);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: urlencoded,
        };

        const result = await fetch(
            "https://results.knec.ac.ke/Home/CheckResults",
            requestOptions,
        );
        if (result.status !== 200) {
            return queryKnec(learner);
        } else {
            return result.text();
        }
    } catch (err: any) {
        console.log(err.message);
        return queryKnec(learner);
    }
}

try {
    const results = [];

    for await (const learner of learners) {
        const responseText = await queryKnec(learner);

        const root = parse(responseText);
        const resultsArray = tabletojson.convert(
            root.querySelector("#grid")?.outerHTML || "",
        ).flat();

        const subjects = resultsArray.map((v) => v["SUBJECT NAME"]);

        const resObj = Object.fromEntries(
            subjects.map((s) => [
                s,
                resultsArray.find((sa) => sa["SUBJECT NAME"] === s)["GRADE"],
            ]),
        );
        const nameIndex = root.querySelector(
            ".table-borderless > tbody:nth-child(2) > tr:nth-child(1) > th:nth-child(1)",
        )?.text.split(" - ");

        if (!nameIndex) {
            continue;
        }

        const [index, name] = nameIndex;
        results.push({
            indexNumber: index,
            name: name,
            school: root.querySelector(
                ".table-borderless > tbody:nth-child(2) > tr:nth-child(2) > th:nth-child(1)",
            )?.text,
            meanGrade: root.querySelector(
                ".table-borderless > tbody:nth-child(2) > tr:nth-child(3) > th:nth-child(1) > span:nth-child(2)",
            )?.text,
            ...resObj,
        });
    }

    Deno.writeTextFileSync("results.json", JSON.stringify(results));
} catch (error) {
    console.error(`Failed to fetch ${BASE_URL}:`, error);
}
