import GithubLogoIcon from 'phosphor-svelte/lib/GithubLogoIcon';
import LinkedinLogoIcon from 'phosphor-svelte/lib/LinkedinLogoIcon';
import TelegramLogoIcon from 'phosphor-svelte/lib/TelegramLogoIcon';
import InstagramLogoIcon from 'phosphor-svelte/lib/InstagramLogoIcon';

export const socialLinks = [
	{
		label: 'Github',
		href: 'https://github.com/olivertgwalton',
		icon: GithubLogoIcon
	},
	{
		label: 'LinkedIn',
		href: 'https://www.linkedin.com/in/oliver-walton03/',
		icon: LinkedinLogoIcon
	},
	{
		label: 'Telegram',
		href: 'https://t.me/oliverwalton03',
		icon: TelegramLogoIcon
	},
	{
		label: 'Instagram',
		href: 'https://instagram.com/oliverwalton03',
		icon: InstagramLogoIcon
	}
];

export const siteConfig = {
	title: 'Oliver Walton | Software Engineer',
	description:
		'British software engineer specializing in Frontend Architecture, Linux Systems, and Embedded Development. Building precise digital experiences.',
	url: 'https://oliverwalton.uk',
	author: 'Oliver Walton',
	keywords: [
		'Software Engineer',
		'Svelte',
		'SvelteKit',
		'TypeScript',
		'Rust',
		'Linux',
		'Frontend Architecture',
		'Embedded Development'
	],
	ogImage: '/api/og?title=Oliver%20Walton&description=Software%20Engineer'
};
