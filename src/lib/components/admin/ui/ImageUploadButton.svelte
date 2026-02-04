<script lang="ts">
	import { toast } from 'svelte-sonner';

	let { onUpload } = $props();

	let isUploading = $state(false);
</script>

<div class="relative">
	<input
		type="file"
		accept="image/*"
		class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
		disabled={isUploading}
		onchange={async (e) => {
			const input = e.currentTarget;
			if (!input.files?.length) return;

			const file = input.files[0];
			const formData = new FormData();
			formData.append('image', file);

			isUploading = true;
			const uploadToast = toast.loading('Uploading image...');

			try {
				const res = await fetch('/api/upload', {
					method: 'POST',
					body: formData
				});
				const data = await res.json();

				if (data.url) {
					toast.success('Image uploaded!', { id: uploadToast });
					onUpload(data.url, file.name);
				} else {
					throw new Error('No URL returned');
				}
			} catch (err) {
				console.error(err);
				toast.error('Upload failed.', { id: uploadToast });
			} finally {
				isUploading = false;
				input.value = '';
			}
		}}
	/>
	<button
		type="button"
		class="rounded bg-stone-200 px-3 py-1 text-xs font-bold text-secondary transition-colors hover:bg-stone-300 disabled:opacity-50 dark:bg-stone-800 dark:text-muted dark:hover:bg-stone-700"
	>
		{isUploading ? 'Uploading...' : '+ Insert Image'}
	</button>
</div>
