<script>
	let { src, alt, class: className } = $props();
</script>

<enhanced:img {src} {alt} class="h-auto w-full rounded-xl {className}" />
