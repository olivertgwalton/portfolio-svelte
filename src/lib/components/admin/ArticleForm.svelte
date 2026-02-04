<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import { untrack } from 'svelte';
	import X from 'phosphor-svelte/lib/X';
	import Input from '$lib/components/admin/ui/Input.svelte';
	import Textarea from '$lib/components/admin/ui/Textarea.svelte';
	import ImageUploadButton from '$lib/components/admin/ui/ImageUploadButton.svelte';

	let { initialData = null, action = '', submitLabel = 'Publish' } = $props();

	let title = $state(untrack(() => initialData?.title ?? ''));
	let slug = $state(untrack(() => initialData?.slug ?? ''));
	let excerpt = $state(untrack(() => initialData?.excerpt ?? ''));
	let content = $state(untrack(() => initialData?.content ?? ''));
	let coverImage = $state(untrack(() => initialData?.coverImage ?? ''));
	let tags = $state(untrack(() => initialData?.tags ?? ''));

	let isSlugTouched = $state(untrack(() => !!initialData?.slug));
	let contentInput: HTMLTextAreaElement;
	let uploadedImages = $state<string[]>([]);

	// Sync state when initialData changes (e.g. navigation)
	$effect(() => {
		title = initialData?.title ?? '';
		slug = initialData?.slug ?? '';
		excerpt = initialData?.excerpt ?? '';
		content = initialData?.content ?? '';
		coverImage = initialData?.coverImage ?? '';
		tags = initialData?.tags ?? '';
		isSlugTouched = !!initialData?.slug;
		uploadedImages = []; // Reset uploaded images for new article
	});

	// Auto-generate slug for new posts only
	$effect(() => {
		if (!initialData && !isSlugTouched && title) {
			slug = title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/(^-|-$)/g, '');
		}
	});

	function handleSlugInput() {
		isSlugTouched = true;
	}

	function handleImageUpload(url: string, filename: string) {
		uploadedImages.push(url);
		if (contentInput) {
			const pos = contentInput.selectionStart;
			const markdown = `\n![${filename}](${url})\n`;
			contentInput.value =
				contentInput.value.substring(0, pos) + markdown + contentInput.value.substring(pos);
			content = contentInput.value;
		}
	}

	function removeImage(url: string) {
		uploadedImages = uploadedImages.filter((img) => img !== url);
	}
</script>

<form
	method="POST"
	{action}
	use:enhance={() => {
		const toastId = toast.loading('Saving article...');
		return async ({ result, update }) => {
			if (result.type === 'redirect' || result.type === 'success') {
				toast.success('Article saved successfully!', { id: toastId });
			} else {
				toast.error('Failed to save article.', { id: toastId });
			}
			await update();
		};
	}}
	class="space-y-8"
>
	<div class="grid gap-6 md:grid-cols-2">
		<Input
			label="Title"
			id="title"
			bind:value={title}
			placeholder="The Future of Web..."
			required
		/>

		<div class="flex flex-col gap-2">
			<Input
				label="Slug"
				id="slug"
				bind:value={slug}
				oninput={handleSlugInput}
				placeholder="article-slug"
				required
				class="font-mono text-sm"
			/>
		</div>
	</div>

	<Textarea
		label="Excerpt"
		id="excerpt"
		bind:value={excerpt}
		rows={2}
		placeholder="A brief summary..."
		required
	/>

	<Input
		label="Tags (comma separated)"
		id="tags"
		bind:value={tags}
		placeholder="tech, svelte, design"
	/>

	<!-- Content (Markdown) -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<label
				for="content"
				class="text-muted-foreground text-xs font-black tracking-widest uppercase"
			>
				Content (Markdown)
			</label>
			<ImageUploadButton onUpload={handleImageUpload} />
		</div>

		{#if uploadedImages.length > 0}
			<div class="/30 flex flex-wrap gap-4 rounded-lg border border-stone-100 bg-stone-50/30 p-4">
				{#each uploadedImages as img (img)}
					<div
						class="group border-border relative h-20 w-20 overflow-hidden rounded-md border bg-white dark:border-stone-700"
					>
						<img src={img} alt="Uploaded" class="h-full w-full object-cover" />
						<div
							class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
						>
							<button
								type="button"
								class="text-foreground rounded bg-white px-2 py-1 text-[10px] font-bold hover:bg-stone-100"
								onclick={() => handleImageUpload(img, 'image')}
							>
								Insert
							</button>
							<button
								type="button"
								class="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
								onclick={() => removeImage(img)}
								aria-label="Remove image"
							>
								<X size={12} weight="bold" />
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<textarea
			name="content"
			id="content"
			bind:this={contentInput}
			bind:value={content}
			rows="15"
			placeholder="# Writing starts here..."
			required
			class="/50 w-full rounded-sm border-2 border-stone-100 bg-stone-50/50 p-6 font-mono text-sm leading-relaxed focus:border-stone-900 focus:outline-none dark:focus:border-stone-100"
		></textarea>
	</div>

	<Input
		label="Cover Image URL (Optional)"
		id="coverImage"
		bind:value={coverImage}
		placeholder="https://..."
	/>

	<div class="flex items-center gap-4 pt-8">
		<button
			type="submit"
			class="btn-polished btn-polished-primary bg-card px-12 py-4 text-sm font-bold text-white transition-all hover:scale-[1.02] hover:bg-black"
		>
			{submitLabel}
		</button>
		<a
			href={resolve('/admin')}
			class="text-muted-foreground hover:text-foreground text-sm font-bold transition-colors dark:hover:text-stone-100"
		>
			Cancel
		</a>
	</div>
</form>
