import { defineParams } from "@sveltejs/kit";

export const params = defineParams({
	collection: (param) =>
		param === "blogs" || param === "projects" ? param : undefined,
});
