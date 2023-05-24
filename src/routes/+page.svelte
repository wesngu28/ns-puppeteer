<script lang="ts">
    let files: FileList;

    import { onMount } from 'svelte'
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
</script>

<header class="bg-gray-50 w-full text-center border-gray-200 border">
    <h1 class="text-3xl my-8">NationStates Puppet Manager</h1>
</header>

<p>Read External File</p>
<input bind:files class="file:border-0 file:text-sm file:bg-blue-50 file:mr-5 hover:file:cursor-pointer mx-auto mt-4 h-10 mb-1 text-sm transition border-0 rounded appearance-none bg-blue-400 p-2 hover:bg-opacity-50" type="file" id="file-input" accept=".txt">

<div class="flex flex-col">
    <p class="mb-2">Enter Nations</p>
    <textarea on:input={() => localStorage.setItem("list", nationList)} bind:value={nationList} class='w-[600px] p-2 mb-1 text-sm bg-transparent border rounded appearance-none border-neutral-400 disabled:bg-neutral-100' rows=15/>
    <div>
        <button class="mx-auto mt-4 h-10 mb-1 text-sm transition border-0 rounded appearance-none bg-blue-400 p-2 hover:bg-opacity-50">Start</button>
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
</div>