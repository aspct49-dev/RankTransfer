import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { validateFileType, validateMagicBytes, sanitizeText } from "@/lib/fileValidation";
import { sendToDiscord } from "@/lib/discord";

const ALLOWED_LOSSBACK = ["10%", "15%", "20%", "N/A"];

export async function POST(req: NextRequest) {
  const limited = rateLimit(req);
  if (limited) return limited;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const roobetName = sanitizeText(String(formData.get("roobetName") || ""));
  if (!roobetName || roobetName.length < 2) {
    return NextResponse.json({ error: "Roobet name must be at least 2 characters." }, { status: 400 });
  }

  const gamesPlayed = sanitizeText(String(formData.get("gamesPlayed") || ""));
  if (!gamesPlayed) {
    return NextResponse.json({ error: "Please enter your primary games." }, { status: 400 });
  }

  const vipLossback = String(formData.get("vipLossback") || "");
  if (!ALLOWED_LOSSBACK.includes(vipLossback)) {
    return NextResponse.json({ error: "Invalid VIP lossback value." }, { status: 400 });
  }

  const last30DaysProof = formData.getAll("last30DaysProof") as File[];
  const totalWagerProof = formData.getAll("totalWagerProof") as File[];

  if (last30DaysProof.length === 0) {
    return NextResponse.json({ error: "At least one last-30-days proof image required." }, { status: 400 });
  }
  if (totalWagerProof.length === 0) {
    return NextResponse.json({ error: "At least one total wager proof image required." }, { status: 400 });
  }
  if (last30DaysProof.length > 5 || totalWagerProof.length > 5) {
    return NextResponse.json({ error: "Maximum 5 images per section." }, { status: 400 });
  }

  for (const file of [...last30DaysProof, ...totalWagerProof]) {
    const typeCheck = validateFileType(file);
    if (!typeCheck.valid) return NextResponse.json({ error: typeCheck.error }, { status: 400 });
    const magicCheck = await validateMagicBytes(file);
    if (!magicCheck.valid) return NextResponse.json({ error: magicCheck.error }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "Unknown";

  const result = await sendToDiscord({ roobetName, gamesPlayed, vipLossback, last30DaysProof, totalWagerProof, ip });
  if (!result.ok) {
    return NextResponse.json({ error: "Failed to deliver application. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
