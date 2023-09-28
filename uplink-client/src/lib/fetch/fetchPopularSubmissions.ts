const fetchPopularSubmissions = async () => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-TOKEN": process.env.API_SECRET,
      },
      body: JSON.stringify({
        query: `
        query PopularSubmissions {
          popularSubmissions {
            author
            contestCategory
            spaceDisplayName
            spaceName
            contestId
            created
            id
            type
            url
            version
          }
        }`,
      }),
      next: { revalidate: 60 },
    })
      .then((res) => res.json())
      .then((res) => res.data.popularSubmissions)
      .then(async (submissions) => {
        return await Promise.all(
          submissions.map(async (submission, idx) => {
            const data = await fetch(submission.url).then((res) => res.json());
            return { ...submission, data: data };
          })
        );
      });
    return data;
  };

  export default fetchPopularSubmissions;