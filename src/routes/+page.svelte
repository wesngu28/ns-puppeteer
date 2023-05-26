<script lang="ts">
	// Imports
	import { onMount } from 'svelte';
	import { sleep } from '../lib/helpers/sleep';
	import { checkForExistence } from '../lib/helpers/checkForExistence';
	import { restoreRequest } from '../lib/helpers/restoreRequest';

	// State and ref
	let files: FileList;
	let restoreDisable = true;
	let running = false;
	let cancel = false
	let message = '';
	let userAgent = '';
	let currentStatus = 0;
	let nationList = 'Enter nations';
	let confirm: HTMLButtonElement | null = null;

	// When app launches, pull any existing data from local storage.
	onMount(() => {
		const store = localStorage.getItem('nationList');
		if (store) nationList = store;
		const localUserAgent = localStorage.getItem('nationUserAgent');
		if (localUserAgent) userAgent = localUserAgent;
	});

	// Whenever files change, check whether or not a file was inputed, and if so, set it
	// to the nation list variable.
	$: if (files) {
		if (files[0]) {
			const reader = new FileReader();
			reader.onload = (e) => {
				if (typeof e.target?.result === 'string') {
					nationList = e.target?.result as string;
				}
			};
			reader.readAsText(files[0]);
		}
	}

	// Async function that returns a promise to delay execution during restores
	async function waitForButtonClick(): Promise<void> {
		await new Promise<void>((resolve) => {
			confirm!.addEventListener('click', () => {
				resolve();
			});
		});
	}

	// Handle submit process
	async function handleSubmit(e: Event) {
		e.preventDefault();
		let nations = nationList.split('\n');
		running = true;
		message = 'Starting login process...';
		await sleep(1000);
		let i = 0;
		while (i < nations.length && !cancel) {
			let [username, password] = nations[i].split(',');
			if (!username || !password) continue;
			const existence = await checkForExistence(userAgent, username, password);
			if (existence !== 'Not found') {
				message = existence
				currentStatus++;
				await sleep(1000);
			} else {
				restoreDisable = false
				message = `${username} needs to be restored. Restore?`;
				await waitForButtonClick();
				message = `Restoring ${username}, please wait...`;
				// The need to confirm a restoration is because nationstates enforces a one click
				// per action rule on nations that aren't your own.
				await restoreRequest(userAgent, username, password);
				const existence = await checkForExistence(userAgent, username, password);
				if (existence !== 'Not found') {
					message = `Successfully restored ${username}`
				} else {
					message = `Are you sure ${username} is a nation or you provided the right credentials? Skipping...`
				}
				restoreDisable = true
				currentStatus++;
				await sleep(1000);
			}
			i++
		}
		if (!cancel) {
			message = 'Process successfully finished.'
			await sleep(1000);
			currentStatus = 0;
			running = false;
		}
		if (cancel) {
			message = 'Process cancelled.'
			await sleep(1000);
			currentStatus = 0;
			running = false;
			cancel = false;
		}
	}
</script>

<header class="bg-gray-50 w-full text-center border-gray-200 border">
	<h1 class="text-3xl my-8 wrap break-words">NS Puppeteer</h1>
</header>

<div class="flex flex-col">
	<p class="mt-4">Read External File</p>
	<input
		bind:files
		class="w-max file:border-0 file:text-sm file:bg-blue-50 file:mr-5 hover:file:cursor-pointer
        mt-4 h-10 mb-1 text-sm transition border-0 rounded appearance-none bg-blue-400 p-2 hover:bg-opacity-50"
		type="file"
		id="file-input"
		accept=".txt"
	/>
	<button
		on:click={() => localStorage.clear()}
		class="w-max mt-4 h-10 mb-1 text-sm transition border-0 rounded appearance-none bg-blue-400 p-2 hover:bg-opacity-50"
		>Clear Current Storage</button
	>
	<form on:submit={async (e) => handleSubmit(e)}>
		<div class="mt-4 mb-2">
			<label for="userAgent" class="mb-2">User Agent</label>
		</div>
		<input
			required
			name="userAgent"
			on:change={() => localStorage.setItem('nationUserAgent', userAgent)}
			bind:value={userAgent}
			class="max-w-[250px] h-10 px-2 mb-1 text-sm bg-transparent border rounded appearance-none border-neutral-400 disabled:bg-neutral-100"
			type="text"
			placeholder="User Agent"
		/>
		<p class="mb-2">Enter Nations</p>
		<textarea
			required
			on:change={() => localStorage.setItem('nationList', nationList)}
			bind:value={nationList}
			class="w-[300px] md:w-[600px] p-2 mb-1 text-sm bg-transparent border rounded appearance-none border-neutral-400 disabled:bg-neutral-100"
			rows="15"
		/>
		<div>
			<button
				disabled={running}
				class="disabled:opacity-50 mx-auto mt-4 h-10 mb-1 text-sm transition border-0 rounded appearance-none bg-blue-400 p-2 hover:bg-opacity-50"
				type="submit">Start</button
			>
			<button
				disabled={!running}
				on:click={() => cancel = true}
				class="disabled:opacity-50 mx-auto mt-4 h-10 mb-1 text-sm transition border-0 rounded appearance-none bg-blue-400 p-2 hover:bg-opacity-50"
				type="button">Cancel</button
			>
			<button
				type="button"
				on:click={() => localStorage.setItem('nationList', nationList)}
				class="mx-auto mt-4 h-10 mb-1 text-sm transition border-0 rounded appearance-none bg-blue-400 p-2 hover:bg-opacity-50"
				>Save to Storage</button
			>
			<button
				type="button"
				on:click={() => {
					// Button to handle saving to filesystem
					const blob = new Blob([nationList], { type: 'text/plain' });
					const url = URL.createObjectURL(blob);
					const link = document.createElement('a');

					link.href = url;
					link.download = 'text.txt';
					link.click();
					URL.revokeObjectURL(url);
				}}
				class="mx-auto mt-4 h-10 mb-1 text-sm transition border-0 rounded appearance-none bg-blue-400 p-2 hover:bg-opacity-50"
				>Save to File</button
			>
		</div>
	</form>

	{#if running}
		<p class="mt-2">{`${currentStatus}/${nationList.split('\n').length}`}</p>
		<p class="mt-2">{message}</p>
		<button
			disabled={restoreDisable}
			bind:this={confirm}
			class="mx-auto mt-4 h-10 mb-1 text-sm transition border-0 rounded appearance-none bg-blue-400 p-2 hover:bg-opacity-50"
			>Restore</button
		>
	{/if}
</div>

<!--Iframe that acts as a hidden form to facilitate restoring nations.!-->
<iframe
	id="iframe"
	style="position: absolute; left: -5000px;"
	src="/iframe.html"
	title="iFrame for logging/restoring nations"
/>
