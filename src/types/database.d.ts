interface DatabaseStructure {
  remainingReads: number | null;
  encrypted: string;
  iv: string;
  id: string;
  url?: string;
  date?: Date;
}
