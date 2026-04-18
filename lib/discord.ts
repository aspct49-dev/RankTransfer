export interface DiscordSubmission {
  roobetName: string;
  discordUsername: string;
  gamesPlayed: string;
  vipLossback: string;
  kycHelp: string;
  last30DaysProof: File[];
  totalWagerProof: File[];
  ip: string;
}

export async function sendToDiscord(data: DiscordSubmission): Promise<{ ok: boolean; error?: string }> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return { ok: false, error: "Discord webhook not configured." };

  const submittedAt = new Date().toLocaleString("en-US", {
    timeZone: "UTC",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const embed = {
    title: "🎰 New Rank Transfer Application",
    color: 0xf5c518,
    fields: [
      { name: "👤 Roobet Name", value: `\`${data.roobetName}\``, inline: true },
      { name: "💬 Discord", value: data.discordUsername ? `\`${data.discordUsername}\`` : "Not provided", inline: true },
      { name: "💸 VIP Lossback", value: `\`${data.vipLossback}\``, inline: true },
      { name: "🎮 Primary Games", value: data.gamesPlayed || "N/A", inline: false },
      { name: "🪪 KYC Help Needed", value: data.kycHelp, inline: true },
      {
        name: "📊 Last 30 Days Proof",
        value: `${data.last30DaysProof.length} image(s) attached`,
        inline: true,
      },
      {
        name: "📈 Total Wager Proof",
        value: `${data.totalWagerProof.length} image(s) attached`,
        inline: true,
      },
      { name: "🌐 IP Address", value: `\`${data.ip}\``, inline: true },
      { name: "⏰ Submitted At", value: `${submittedAt} UTC`, inline: true },
    ],
    footer: { text: "RankTransfer.com — VIP Rank Transfer Service" },
    timestamp: new Date().toISOString(),
  };

  const form = new FormData();
  form.append("payload_json", JSON.stringify({ embeds: [embed] }));

  const allFiles = [
    ...data.last30DaysProof.map((f, i) => ({ file: f, name: `last30_${i + 1}_${f.name}` })),
    ...data.totalWagerProof.map((f, i) => ({ file: f, name: `total_wager_${i + 1}_${f.name}` })),
  ];

  allFiles.forEach(({ file, name }, i) => {
    form.append(`files[${i}]`, file, name);
  });

  try {
    const res = await fetch(webhookUrl, { method: "POST", body: form });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Discord error: ${res.status} — ${text}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Network error" };
  }
}
