<script lang="ts">
	import { page } from '$app/state';
	import TwitterLogoIcon from 'phosphor-svelte/lib/TwitterLogoIcon';
	import LinkedinLogoIcon from 'phosphor-svelte/lib/LinkedinLogoIcon';
	import LinkIcon from 'phosphor-svelte/lib/LinkIcon';
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
	import { fade } from 'svelte/transition';

	let { title } = $props();

	let copied = $state(false);
	const url = $derived(page.url.href);

	function copyLink() {
		navigator.clipboard.writeText(url);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	function shareTwitter() {
		window.open(
			`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
			'_blank'
		);
	}

	function shareLinkedin() {
		window.open(
			`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
			'_blank'
		);
	}
</script>

<div class="my-12 border-t border-surface-200-800 pt-8">
	<h3 class="mb-4 font-heading text-lg font-bold text-surface-950-50">Share this post</h3>
	<div class="flex gap-4">
		<button
			onclick={shareTwitter}
			class="btn-icon bg-surface-100-900 transition-colors hover:bg-primary-500 hover:text-white"
			aria-label="Share on Twitter"
		>
			<span aria-hidden="true"><TwitterLogoIcon size={20} weight="fill" /></span>
		</button>
		<button
			onclick={shareLinkedin}
			class="btn-icon bg-surface-100-900 transition-colors hover:bg-[#0077b5] hover:text-white"
			aria-label="Share on LinkedIn"
		>
			<span aria-hidden="true"><LinkedinLogoIcon size={20} weight="fill" /></span>
		</button>
		<button
			onclick={copyLink}
			class="relative btn-icon bg-surface-100-900 transition-colors hover:bg-surface-200-800"
			aria-label="Copy Link"
		>
			{#if copied}
				<div in:fade={{ duration: 150 }} class="absolute inset-0 flex items-center justify-center">
					<span aria-hidden="true"><CheckIcon size={20} weight="bold" class="text-success-500" /></span>
				</div>
			{:else}
				<div in:fade={{ duration: 150 }} class="absolute inset-0 flex items-center justify-center">
					<span aria-hidden="true"><LinkIcon size={20} weight="bold" /></span>
				</div>
			{/if}
		</button>
	</div>
</div>
