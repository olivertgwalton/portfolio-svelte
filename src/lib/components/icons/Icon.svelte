<script lang="ts">
import { type IconName, iconPaths, iconViewBoxes } from "./icons";

let { name, class: className = "" }: { name: IconName; class?: string } =
	$props();
</script>

<svg
	viewBox={iconViewBoxes[name] ?? '0 0 24 24'}
	fill="currentColor"
	xmlns="http://www.w3.org/2000/svg"
	class={className}
	aria-hidden="true"
>
	<path d={iconPaths[name]} />
</svg>
