export const nameToSlug = (name: string) => {
    return name.replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').toLowerCase();
}

export const slugToName = (slug: string) => {
    return slug.replace(/-/g, ' ');
}