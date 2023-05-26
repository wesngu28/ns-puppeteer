import { sleep } from "./sleep";

// Code largely adopted from Auralia, adjusted to use vanilla JS as opposed to jquery, as well as using more
// async await then promises.
export async function restoreRequest(userAgent: string, username: string, password: string) {
    let resolved = false;

    const iframe = document.getElementById("iframe")! as HTMLIFrameElement;
    iframe.removeEventListener("load", loadHandler);
    iframe.addEventListener("load", loadHandler);

    async function loadHandler(this: any) {
        iframe.removeEventListener("load", loadHandler);
        const iframeContents = iframe.contentWindow?.document! as any;

        if (iframeContents) {
            iframeContents.getElementById("restoreUserAgent").value = userAgent;
            iframeContents.getElementById("restoreLoggingIn").value = "1";
            iframeContents.getElementById("restoreNation").value = username;
            iframeContents.getElementById("restoreRestoreNation").value = `Restore ${username}`;
            iframeContents.getElementById("restoreRestorePassword").value = password;
            iframeContents.getElementById("restoreSubmit").click();

            await sleep(6000)
            return true
        }
    }

    iframe.src = "iframe.html";

    if (!resolved) {
        await sleep(6500)
        return false
    }
}