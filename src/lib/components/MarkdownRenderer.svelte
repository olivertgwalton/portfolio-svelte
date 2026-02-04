<script lang="ts">
	import type { Token } from 'marked';
	import { resolve } from '$app/paths';

	/**
	 * Renders Markdown tokens using Svelte 5 snippets.
	 * Parsing is assumed to be handled on the server via `marked.lexer`.
	 */
	let { tokens }: { tokens: Token[] } = $props();
</script>

{#snippet renderToken(token: Token)}
	{#if token.type === 'heading'}
		{#if token.depth === 1}
			<h1>{@render renderInline(token.tokens)}</h1>
		{:else if token.depth === 2}
			<h2>{@render renderInline(token.tokens)}</h2>
		{:else if token.depth === 3}
			<h3>{@render renderInline(token.tokens)}</h3>
		{:else if token.depth === 4}
			<h4>{@render renderInline(token.tokens)}</h4>
		{:else if token.depth === 5}
			<h5>{@render renderInline(token.tokens)}</h5>
		{:else}
			<h6>{@render renderInline(token.tokens)}</h6>
		{/if}
	{:else if token.type === 'paragraph'}
		<p>
			{@render renderInline(token.tokens)}
		</p>
	{:else if token.type === 'list'}
		{#if token.ordered}
			<ol start={token.start}>
				{#each token.items as item, i (i)}
					<li>{@render renderInline(item.tokens)}</li>
				{/each}
			</ol>
		{:else}
			<ul>
				{#each token.items as item, i (i)}
					<li>{@render renderInline(item.tokens)}</li>
				{/each}
			</ul>
		{/if}
	{:else if token.type === 'code'}
		<pre><code class={token.lang ? `language-${token.lang}` : ''}>{token.text}</code></pre>
	{:else if token.type === 'blockquote'}
		<blockquote>
			{@render renderTokens(token.tokens ?? [])}
		</blockquote>
	{:else if token.type === 'hr'}
		<hr />
	{:else if token.type === 'space'}
		<!-- Ignore -->
	{:else if token.type === 'text'}
		<!-- Plain text block -->
		{token.text}
	{:else}
		<!-- Fallback for unhandled blocks -->
		<!-- <div class="bg-red-50 text-red-500 p-2 rounded text-xs">Unhandled block: {token.type}</div> -->
	{/if}
{/snippet}

{#snippet renderInline(inlineTokens: Token[] | undefined)}
	{#if inlineTokens}
		{#each inlineTokens as t, i (i)}
			{#if t.type === 'text'}
				{t.text}
			{:else if t.type === 'strong'}
				<strong>{t.text}</strong>
			{:else if t.type === 'em'}
				<em>{t.text}</em>
			{:else if t.type === 'codespan'}
				<code>{t.text}</code>
			{:else if t.type === 'link'}
				{#if t.href.startsWith('/')}
					<a href={resolve(t.href)} title={t.title}>
						{t.text}
					</a>
				{:else}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
					<a href={t.href} title={t.title}>
						{t.text}
					</a>
				{/if}
			{:else if t.type === 'br'}
				<br />
			{:else if t.type === 'del'}
				<del>{t.text}</del>
			{:else if t.type === 'image'}
				<img src={t.href} alt={t.text} title={t.title} loading="lazy" />
			{:else}
				{'text' in t ? t.text : ''}
			{/if}
		{/each}
	{/if}
{/snippet}

{#snippet renderTokens(list: Token[])}
	{#each list as t, i (i)}
		{@render renderToken(t)}
	{/each}
{/snippet}

<div class="prose max-w-none prose-stone lg:prose-xl dark:prose-invert">
	{@render renderTokens(tokens)}
</div>
