interface DatabaseRecord {
  remainingReads: number | null;
  encrypted: string;
  iv: string;
  id: string;
  url: string;
  createdAt: Date;
}
