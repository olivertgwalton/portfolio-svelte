<script lang="ts">
import { page } from "$app/state";
import TwitterLogoIcon from "phosphor-svelte/lib/TwitterLogoIcon";
import LinkedinLogoIcon from "phosphor-svelte/lib/LinkedinLogoIcon";
import LinkIcon from "phosphor-svelte/lib/LinkIcon";
import CopyButton from "#lib/components/CopyButton.svelte";

let { title }: { title: string } = $props();

const url = $derived(page.url.href);

function shareTwitter() {
	window.open(
		`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
		"_blank",
	);
}

function shareLinkedin() {
	window.open(
		`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
		"_blank",
	);
}
</script>

<div class="my-12 border-t border-surface-200-800 pt-8">
	<h3 class="mb-4 font-heading text-lg font-bold text-surface-950-50">
		Share this post
	</h3>
	<div class="flex gap-4">
		<button
			type="button"
			onclick={shareTwitter}
			class="btn-icon bg-surface-100-900 transition-colors hover:bg-primary-500 hover:text-white"
			aria-label="Share on Twitter"
		>
			<span aria-hidden="true"
				><TwitterLogoIcon size={20} weight="fill" /></span
			>
		</button>
		<button
			type="button"
			onclick={shareLinkedin}
			class="btn-icon bg-surface-100-900 transition-colors hover:bg-[#0077b5] hover:text-white"
			aria-label="Share on LinkedIn"
		>
			<span aria-hidden="true"
				><LinkedinLogoIcon size={20} weight="fill" /></span
			>
		</button>
		<CopyButton
			text={() => url}
			label="Copy Link"
			icon={LinkIcon}
			class="relative btn-icon bg-surface-100-900 transition-colors hover:bg-surface-200-800"
			swapClass="absolute inset-0 flex items-center justify-center"
		/>
	</div>
</div>
