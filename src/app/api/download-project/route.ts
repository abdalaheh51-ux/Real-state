import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { writeFileSync, readFileSync, unlinkSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Paths to include in the project source zip (relative to project root).
// Excludes node_modules, .next, .git, skills, db data, dev logs, tmp files.
const INCLUDE_PATHS = [
  "src",
  "prisma",
  "public",
  "package.json",
  "bun.lock",
  "tsconfig.json",
  "next.config.ts",
  "tailwind.config.ts",
  "postcss.config.mjs",
  "components.json",
  "eslint.config.mjs",
  "Caddyfile",
  ".env",
];

export async function GET() {
  const projectRoot = process.cwd();
  const tmpDir = join(projectRoot, ".tmp-zip");
  try {
    mkdirSync(tmpDir, { recursive: true });
    const stamp = Date.now();
    const zipPath = join(tmpDir, `real-estate-project-${stamp}.zip`);

    // Build the zip args — only include paths that exist.
    const existing = INCLUDE_PATHS.filter((p) =>
      existsSync(join(projectRoot, p))
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "No project files found" },
        { status: 500 }
      );
    }

    // Use zip CLI: -r recursive, -q quiet, -X no extra file attributes
    // Exclude common junk patterns even within included dirs.
    const excludeArgs = [
      "-x",
      "*/node_modules/*",
      "*/.next/*",
      "*/.git/*",
      "*/.tmp-pdf/*",
      "*/.tmp-zip/*",
      "*/dev.log",
      "*/server.log",
      "*.DS_Store",
    ];

    execSync(
      `cd "${projectRoot}" && zip -r -q -X "${zipPath}" ${existing
        .map((p) => `"${p}"`)
        .join(" ")} ${excludeArgs.join(" ")}`,
      { timeout: 30000, stdio: "pipe" }
    );

    const zipBuffer = readFileSync(zipPath);

    // cleanup
    try {
      unlinkSync(zipPath);
    } catch {
      /* ignore */
    }

    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="real-estate-project.zip"`,
        "Content-Length": String(zipBuffer.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[download-project] error:", err);
    return NextResponse.json(
      { error: "تعذّر إنشاء ملف المشروع", detail: String(err) },
      { status: 500 }
    );
  }
}
