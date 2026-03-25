import { NextRequest, NextResponse } from "next/server";
import { fetchGithubRepoDetails } from "@/lib/github";
import { generateProjectReport } from "@/lib/gemini";

function parseGithubUrl(url: string) {
    try {
        // Remove trailing slashes and common extensions
        let cleanUrl = url.trim().replace(/\/+$/, "").replace(/\.git$/, "");
        const urlObj = new URL(cleanUrl);

        // Support github.com URLs
        if (urlObj.hostname === "github.com" || urlObj.hostname === "www.github.com") {
            const parts = urlObj.pathname.split("/").filter(Boolean);
            if (parts.length >= 2) {
                return { owner: parts[0], repo: parts[1] };
            }
        }
    } catch (e) {
        return null;
    }
    return null;
}

export async function POST(req: NextRequest) {
    try {
        const { repoUrl } = await req.json();

        if (!repoUrl) {
            return NextResponse.json({ error: "Repository URL is required" }, { status: 400 });
        }

        const parsed = parseGithubUrl(repoUrl);
        if (!parsed) {
            return NextResponse.json({ error: "Invalid GitHub Repository URL" }, { status: 400 });
        }

        // 1. Fetch data from GitHub
        const repoData = await fetchGithubRepoDetails(parsed.owner, parsed.repo);

        if (!repoData.readmeContent && repoData.treePaths.length === 0) {
            return NextResponse.json({ error: "Could not fetch adequate data from this repository. Ensure it is public." }, { status: 404 });
        }

        // 2. Generate Report via Gemini
        const reportText = await generateProjectReport(repoData);

        return NextResponse.json({ report: reportText, repoData });
    } catch (error: any) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate report" }, { status: 500 });
    }
}
