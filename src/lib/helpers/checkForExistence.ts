export async function checkForExistence(userAgent: string, username: string, password: string) {
    const res = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?nation=${username}&q=ping`,
        {
            headers: {
                'X-Password': password,
                'User-Agent': userAgent
            }
        })
    const existence = res.status
    if (existence === 404) return "Not found"
    if (existence === 200) return `Successfully logged into ${username}`
    return "Not found"
}