<script lang="ts">
    import { XMLParser } from 'fast-xml-parser';
    let files: FileList;
    let startButtonText = "Start"
    let running = false
    let message = ""
    let userAgent = ""
    let currentStatus = 0
    
    import { onMount } from 'svelte'
	import { sleep } from '../lib/helpers/sleep';
    import { checkForExistence } from '../lib/helpers/checkForExistence';
	import { restoreRequest } from '../lib/helpers/restoreRequest';
    let nationList = "Enter nations"
    onMount(() => {
        const store = localStorage.getItem("list");
        if (store) nationList = store
    })
    $: if (files) {
        if (files[0]) {
            const reader = new FileReader()
            reader.onload = (e) => {
                if (typeof e.target?.result === "string") {
                    nationList = e.target?.result as string
                }
            }
            reader.readAsText(files[0])
        }
    }
    let confirm: HTMLButtonElement | null = null
    async function waitForButtonClick(): Promise<void> {
        await new Promise<void>((resolve) => {
            confirm!.addEventListener('click', () => {
                resolve();
            });
        });
    }
</script>

<header class="bg-gray-50 w-full text-center border-gray-200 border">
    <h1 class="text-3xl my-8">NationStates Puppet Manager</h1>
</header>

<div class="flex flex-col">
    <p>Read External File</p>
    <input bind:files class="file:border-0 file:text-sm file:bg-blue-50 file:mr-5 hover:file:cursor-pointer mx-auto mt-4 h-10 mb-1 text-sm transition border-0 rounded appearance-none bg-blue-400 p-2 hover:bg-opacity-50" type="file" id="file-input" accept=".txt">
    <form on:submit={async(e) => {
        e.preventDefault()
        const parser = new XMLParser()
        let nations = nationList.split('\n')
        running = true
        message = "Starting login process..."
        await sleep(2500)
        for (let i = 0; i < nations.length; i++) {
            let [ username, password ] = nations[i].split(',')
            if (!username || !password) continue
            const existence = await checkForExistence(userAgent, parser, username, password)
            if (existence !== "Not found") {
                 message = existence
            } else {
                startButtonText = "Restore?"
                message = `${username} needs to be restored. Restore?`
                await waitForButtonClick()
                await restoreRequest(userAgent, username, password)
                const existence = await checkForExistence(userAgent, parser, username, password)
                if (existence !== "Not found") {
                    message = existence
                } else {
                    message = `Are you sure ${username} is a nation or you provided the right credentials? Skipping...`
                }
            }
            currentStatus++;
            await sleep(2500)
        }
        message = "Process successfully finished."
        await sleep(2500)
        currentStatus = 0
        running = false
    }}>
        <div class="mb-2">
            <label for="userAgent" class="mb-2">User Agent</label>
        </div>
        <input required name="userAgent" bind:value={userAgent} class='max-w-[250px] h-10 px-2 mb-1 text-sm bg-transparent border rounded appearance-none border-neutral-400 disabled:bg-neutral-100' type='text' placeholder='User Agent' />
        <p class="mb-2">Enter Nations</p>
        <textarea required on:change={() => localStorage.setItem("list", nationList)} bind:value={nationList} class='w-[600px] p-2 mb-1 text-sm bg-transparent border rounded appearance-none border-neutral-400 disabled:bg-neutral-100' rows=15/>
        <div>
            <button disabled={running} class="disabled:opacity-50 mx-auto mt-4 h-10 mb-1 text-sm transition border-0 rounded appearance-none bg-blue-400 p-2 hover:bg-opacity-50" type="submit">Start</button>
            <button on:click={() => localStorage.setItem("list", nationList)} class="mx-auto mt-4 h-10 mb-1 text-sm transition border-0 rounded appearance-none bg-blue-400 p-2 hover:bg-opacity-50">Save to Storage</button>
            <button on:click={() => {
                const blob = new Blob([nationList], { type: 'text/plain' });
    
                const url = URL.createObjectURL(blob);
    
                const link = document.createElement('a');
                link.href = url;
                link.download = 'text.txt';
                link.click();
    
                URL.revokeObjectURL(url);
            }} class="mx-auto mt-4 h-10 mb-1 text-sm transition border-0 rounded appearance-none bg-blue-400 p-2 hover:bg-opacity-50">Save to File</button>
        </div>
    </form>

    {#if running}
        <p class="mt-2">{`${currentStatus}/${nationList.split('\n').length}`}</p>
        <p class="mt-2">{message}</p>
        <button bind:this={confirm} class="mx-auto mt-4 h-10 mb-1 text-sm transition border-0 rounded appearance-none bg-blue-400 p-2 hover:bg-opacity-50">Restore</button>
    {/if}
</div>

<iframe id="iframe" style="position: absolute; left: -5000px;" src="/iframe.html" title="iFrame for logging/restoring nations" />