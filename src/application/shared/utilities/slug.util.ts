import slugify from "slugify";

export const createUniqueSlug = async (
	name: string,
	isUnique: (slug: string) => Promise<boolean>,
): Promise<string> => {
	const baseSlug = slugify(name, {
		lower: true,
		strict: true,
		trim: true,
	});

	let slug = baseSlug;
	let counter = 1;

	while (!(await isUnique(slug))) {
		slug = `${baseSlug}-${counter}`;
		counter++;
	}

	return slug;
};
