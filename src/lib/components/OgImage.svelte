<script lang="ts">
	let { title = 'Oliver Walton', description = 'Software Engineer' } = $props();
</script>

<div
	style="
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background-color: #221d27;
    padding: 60px;
    font-family: sans-serif;
  "
>
	<!-- Top Bar / Brand -->
	<div
		style="
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
    "
	>
		<div style="display: flex; align-items: center; gap: 12px;">
			<div
				style="
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #d2c4de;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          color: #221d27;
          font-size: 20px;
        "
			>
				OW
			</div>
			<div style="color: #d2c4de; font-weight: 700; font-size: 24px; letter-spacing: -0.02em;">
				oliverwalton.uk
			</div>
		</div>
		<div
			style="
        color: #834588;
        font-weight: 600;
        font-size: 18px;
        text-transform: uppercase;
        letter-spacing: 0.1em;
      "
		>
			Portfolio
		</div>
	</div>

	<!-- Main Content Area -->
	<div
		style="
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      margin-top: 40px;
      margin-bottom: 60px;
    "
	>
		<!-- Tag / Badge -->
		<div
			style="
        display: flex;
        background-color: #3b3237;
        color: #efbdeb;
        padding: 8px 16px;
        border-radius: 99px;
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 32px;
        border: 1px solid #501854;
      "
		>
			SOFTWARE ENGINEER
		</div>

		<!-- Title -->
		<div
			style="
        display: flex;
        font-size: 80px;
        font-weight: 800;
        color: #d2c4de;
        line-height: 1.1;
        letter-spacing: -0.03em;
        margin-bottom: 24px;
        text-align: left;
      "
		>
			{title}
		</div>

		<!-- Description -->
		<div
			style="
        display: flex;
        font-size: 32px;
        font-weight: 400;
        color: #c2b6cf;
        line-height: 1.5;
        max-width: 900px;
        text-align: left;
      "
		>
			{description}
		</div>
	</div>

	<!-- Code / Tech Footer -->
	<div
		style="
      display: flex;
      width: 100%;
      padding-top: 40px;
      border-top: 1px solid #3b3237;
      justify-content: flex-start;
      gap: 32px;
    "
	>
		<div style="display: flex; flex-direction: column; gap: 8px;">
			<span style="color: #834588; font-size: 14px; font-weight: 700; text-transform: uppercase;"
				>Stack</span
			>
			<span style="color: #efbdeb; font-size: 20px; font-weight: 600;"
				>SvelteKit &amp; Tailwind</span
			>
		</div>
		<div style="display: flex; flex-direction: column; gap: 8px;">
			<span style="color: #834588; font-size: 14px; font-weight: 700; text-transform: uppercase;"
				>Focus</span
			>
			<span style="color: #efbdeb; font-size: 20px; font-weight: 600;">Frontend Architecture</span>
		</div>
		<div style="display: flex; flex-direction: column; gap: 8px;">
			<span style="color: #834588; font-size: 14px; font-weight: 700; text-transform: uppercase;"
				>Systems</span
			>
			<span style="color: #efbdeb; font-size: 20px; font-weight: 600;">Linux &amp; Embedded</span>
		</div>
	</div>
</div>
