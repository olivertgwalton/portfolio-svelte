import { defineParams } from "@sveltejs/kit/params";

export const params = defineParams({
	collection: (param) =>
		param === "blogs" || param === "projects" ? param : undefined,
});
