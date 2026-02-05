<script lang="ts">
	import { reveal } from '$lib/actions';
	import InteractiveGrid from '$lib/components/visuals/InteractiveGrid.svelte';
	import { authClient } from '$lib/auth/client';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;

		const { error } = await authClient.signIn.email({
			email,
			password
		});

		if (error) {
			toast.error(error.message || 'Login failed');
			loading = false;
			return;
		}

		toast.success('Signed in successfully');
		await goto(resolve('/admin'));
	}
</script>

<svelte:head>
	<title>Login | Oliver Walton</title>
	<meta name="description" content="Access the secure admin dashboard." />
</svelte:head>

<section
	class="relative flex min-h-screen w-full items-center justify-center bg-surface-50-950 p-8"
>
	<InteractiveGrid fixed={true} />
	<div
		class="relative z-10 mx-auto flex w-full flex-col justify-center space-y-6 sm:w-87.5"
		use:reveal={{ delay: 0, y: 20 }}
	>
		<div
			class="rounded-2xl border border-surface-200-800 bg-surface-50-950/60 p-8 shadow-xl backdrop-blur-xl"
		>
			<div class="mb-8 space-y-2 text-center">
				<h1 class="font-heading text-3xl font-black tracking-tighter text-surface-950-50">
					Welcome back
				</h1>
				<p class="text-xs font-bold text-surface-600-400">
					Enter your credentials to access the admin panel
				</p>
			</div>

			<form onsubmit={handleSubmit} class="space-y-6">
				<!-- Email -->
				<div class="space-y-2">
					<label
						for="email"
						class="text-xs font-black tracking-widest text-surface-600-400 uppercase"
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
						class="w-full border-b-2 border-surface-200-800 bg-transparent py-2 font-heading text-lg font-bold text-surface-950-50 focus:border-primary-500 focus:outline-none"
					/>
				</div>

				<!-- Password -->
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<label
							for="password"
							class="text-xs font-black tracking-widest text-surface-600-400 uppercase"
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
						class="w-full border-b-2 border-surface-200-800 bg-transparent py-2 font-heading text-lg font-bold text-surface-950-50 focus:border-primary-500 focus:outline-none"
					/>
				</div>

				<!-- Submit -->
				<div class="pt-2">
					<button
						type="submit"
						class="btn w-full preset-filled-primary-500 py-4 text-sm font-bold"
						disabled={loading}
					>
						{loading ? 'Signing in...' : 'Login'}
					</button>
				</div>
			</form>
		</div>
	</div>
</section>
