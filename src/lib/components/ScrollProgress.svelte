<div
	class="pointer-events-none fixed top-0 left-0 z-60 h-1 w-full bg-transparent"
>
	<div class="progress h-full origin-left bg-primary-500"></div>
</div>

<style>
.progress {
	/* Stays empty when the page can't scroll or scroll timelines are unsupported. */
	transform: scaleX(0);
	animation: grow linear both;
	animation-timeline: scroll(root);
}

@keyframes grow {
	from {
		transform: scaleX(0);
	}
	to {
		transform: scaleX(1);
	}
}
</style>
