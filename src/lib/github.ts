export async function fetchGithubRepoDetails(owner: string, repo: string) {
    const token = process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = {
        Accept: "application/vnd.github.v3+json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    // 1. Fetch README
    let readmeContent = "";
    try {
        const readmeRes = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/readme`,
            { headers }
        );
        if (readmeRes.ok) {
            const readmeData = await readmeRes.json();
            readmeContent = Buffer.from(readmeData.content, "base64").toString("utf-8");
        }
    } catch (error) {
        console.error("Failed to fetch README", error);
    }

    // 2. Fetch Repo Meta (Language, Description, etc)
    let repoMeta = null;
    try {
        const metaRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
        if (metaRes.ok) {
            repoMeta = await metaRes.json();
        }
    } catch (error) {
        console.error("Failed to fetch Repo Meta", error);
    }

    // 3. Fetch Tree (first level or recursive up to a limit)
    let treePaths: string[] = [];
    try {
        const defaultBranch = repoMeta?.default_branch || "main";
        const treeRes = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
            { headers }
        );
        if (treeRes.ok) {
            const treeData = await treeRes.json();
            if (treeData.tree) {
                // Limit to 500 paths to avoid huge prompts
                treePaths = treeData.tree
                    .filter((item: any) => item.type === "blob")
                    .map((item: any) => item.path)
                    .slice(0, 500);
            }
        }
    } catch (error) {
        console.error("Failed to fetch Repo Tree", error);
    }

    return {
        owner,
        repo,
        description: repoMeta?.description || "No description provided",
        language: repoMeta?.language || "Unknown",
        stars: repoMeta?.stargazers_count || 0,
        topics: repoMeta?.topics || [],
        readmeContent,
        treePaths,
    };
}
