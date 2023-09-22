const fetchSpaces = async () => {
    return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: `
        query Spaces{
          spaces{
              name
              displayName
              members
              logoUrl
          }
      }`,
        }),
        next: { tags: ["spaces"], revalidate: 60 },
    })
        .then((res) => res.json())
        .then((res) => res.data.spaces);
};

export default fetchSpaces;