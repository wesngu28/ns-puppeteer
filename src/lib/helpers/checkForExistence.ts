import type { XMLParser } from "fast-xml-parser";

export async function checkForExistence(userAgent: string, parser: XMLParser, username: string, password: string) {
    const res = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?nation=${username}`)
    const existence = res.status
    if (existence === 200) {
        const rawxml = await res.text()
        let xml = parser.parse(rawxml);
        const response = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?nation=${username}&q=ping`, { 
            headers: {
                'X-Password': password,
                'User-Agent': userAgent
            }
            });
        if (response.status === 200) {
            return `Successfully logged into ${xml.NATION.FULLNAME}`
        }
        return "Not found"
    }
    return "Not found"
}