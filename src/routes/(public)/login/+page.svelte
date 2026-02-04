<script lang="ts">
	import { Button } from 'bits-ui';
	import { reveal } from '$lib/actions';
	import InteractiveGrid from '$lib/components/visuals/InteractiveGrid.svelte';

	let email = $state('');
	let password = $state('');

	function handleSubmit(e: Event) {
		e.preventDefault();
		// Auth logic goes here
		console.log('Login attempt:', { email, password });
	}
</script>

<svelte:head>
	<title>Login | Oliver Walton</title>
	<meta name="description" content="Access the secure admin dashboard." />
</svelte:head>

<section class="relative flex min-h-screen w-full items-center justify-center p-8">
	<InteractiveGrid fixed={true} />
	<div
		class="relative z-10 mx-auto flex w-full flex-col justify-center space-y-6 sm:w-87.5"
		use:reveal={{ delay: 0, y: 20 }}
	>
		<div
			class="rounded-2xl border border-black/5 bg-white/60 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-surface/60"
		>
			<div class="mb-8 space-y-2 text-center">
				<h1
					class="font-heading text-3xl font-black tracking-tighter text-primary"
				>
					Welcome back
				</h1>
				<p class="text-xs font-bold text-muted">
					Enter your credentials to access the admin panel
				</p>
			</div>

			<form onsubmit={handleSubmit} class="space-y-6">
				<!-- Email -->
				<div class="space-y-2">
					<label
						for="email"
						class="text-xs font-black tracking-widest text-secondary uppercase"
					>
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						placeholder="m@example.com"
						bind:value={email}
						required
						autocomplete="email"
						class="w-full border-b-2 border-stone-300 bg-transparent py-2 font-heading text-lg font-bold text-primary dark:focus:border-stone-100"
					/>
				</div>

				<!-- Password -->
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<label
							for="password"
							class="text-xs font-black tracking-widest text-secondary uppercase"
						>
							Password
						</label>
					</div>
					<input
						id="password"
						name="password"
						type="password"
						bind:value={password}
						required
						autocomplete="current-password"
						class="w-full border-b-2 border-stone-300 bg-transparent py-2 font-heading text-lg font-bold text-primary dark:focus:border-stone-100"
					/>
				</div>

				<!-- Submit -->
				<div class="pt-2">
					<Button.Root type="submit" class="btn-polished btn-polished-primary w-full py-4 text-sm">
						Login
					</Button.Root>
				</div>
			</form>
		</div>
	</div>
</section>
