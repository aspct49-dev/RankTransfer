export type VIPLossback = "10%" | "15%" | "20%" | "N/A";
export type GameType = "Slots" | "Sports" | "Keno" | "Table Games" | "Crash";
export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface Submission {
  id: string;
  roobetName: string;
  gamesPlayed: GameType[];
  vipLossback: VIPLossback;
  last30DaysProofUrls: string[];
  totalWagerProofUrls: string[];
  status: SubmissionStatus;
  adminNotes: string | null;
  discordDelivered: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitFormData {
  roobetName: string;
  gamesPlayed: GameType[];
  vipLossback: VIPLossback;
  last30DaysProof: File[];
  totalWagerProof: File[];
}
