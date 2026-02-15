<script lang="ts">
    import PaletteIcon from "phosphor-svelte/lib/PaletteIcon";
    import CheckIcon from "phosphor-svelte/lib/CheckIcon";
    import MoonIcon from "phosphor-svelte/lib/MoonIcon";
    import SunIcon from "phosphor-svelte/lib/SunIcon";
    import MonitorIcon from "phosphor-svelte/lib/MonitorIcon";
    import { Menu } from "@skeletonlabs/skeleton-svelte";
    import { getThemeContext, themes } from "$lib/theme.svelte";

    const modeOptions = [
        { id: "light", name: "Light", icon: SunIcon },
        { id: "dark", name: "Dark", icon: MoonIcon },
        { id: "system", name: "System", icon: MonitorIcon },
    ];

    const theme = getThemeContext();
</script>

<Menu>
    <Menu.Trigger class="btn-icon hover:preset-tonal" aria-label="Appearance">
        <span aria-hidden="true"><PaletteIcon size={20} weight="bold" /></span>
    </Menu.Trigger>
    <Menu.Positioner>
        <Menu.Content
            class="z-50 w-56 rounded-container border border-surface-200-800 bg-surface-50-950 p-2 shadow-xl"
        >
            <Menu.ItemGroup>
                <Menu.ItemGroupLabel
                    class="px-3 py-1.5 text-xs font-bold uppercase opacity-60"
                    >Theme</Menu.ItemGroupLabel
                >
                {#each themes as t (t.id)}
                    <Menu.Item
                        value={t.id}
                        onclick={(e) => theme.setTheme(t.id, e)}
                        class="flex cursor-pointer items-center justify-between rounded-container px-3 py-2 text-sm font-medium transition-colors hover:preset-tonal {theme.theme ===
                        t.id
                            ? 'text-primary-500'
                            : ''}"
                    >
                        <Menu.ItemText>{t.name}</Menu.ItemText>
                        {#if theme.theme === t.id}
                            <Menu.ItemIndicator
                                ><span aria-hidden="true"
                                    ><CheckIcon size={16} weight="bold" /></span
                                ></Menu.ItemIndicator
                            >
                        {/if}
                    </Menu.Item>
                {/each}
            </Menu.ItemGroup>

            <Menu.Separator class="my-1 h-px bg-surface-200-800" />

            <Menu.ItemGroup>
                <Menu.ItemGroupLabel
                    class="px-3 py-1.5 text-xs font-bold uppercase opacity-60"
                    >Mode</Menu.ItemGroupLabel
                >
                {#each modeOptions as m (m.id)}
                    {@const Icon = m.icon}
                    <Menu.Item
                        value={m.id}
                        onclick={(e) => theme.setMode(m.id, e)}
                        class="flex cursor-pointer items-center justify-between rounded-container px-3 py-2 text-sm font-medium transition-colors hover:preset-tonal {theme.mode ===
                        m.id
                            ? 'text-primary-500'
                            : ''}"
                    >
                        <div class="flex items-center gap-2">
                            <span aria-hidden="true"><Icon size={16} /></span>
                            <Menu.ItemText>{m.name}</Menu.ItemText>
                        </div>
                        {#if theme.mode === m.id}
                            <Menu.ItemIndicator
                                ><span aria-hidden="true"
                                    ><CheckIcon size={16} weight="bold" /></span
                                ></Menu.ItemIndicator
                            >
                        {/if}
                    </Menu.Item>
                {/each}
            </Menu.ItemGroup>
        </Menu.Content>
    </Menu.Positioner>
</Menu>
