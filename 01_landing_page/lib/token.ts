const LP2_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type Lp2TokenLead = {
  created_at: string;
  selbstauskunft_angefordert_at?: string | null;
};

/** LP2 links expire 7 days after selbstauskunft was requested (arch §7). */
export function isLp2TokenExpired(lead: Lp2TokenLead): boolean {
  const basis = lead.selbstauskunft_angefordert_at ?? lead.created_at;
  const issued = new Date(basis).getTime();
  if (Number.isNaN(issued)) return true;
  return Date.now() - issued > LP2_TOKEN_TTL_MS;
}

export function lp2TokenExpiresAt(lead: Lp2TokenLead): Date {
  const basis = lead.selbstauskunft_angefordert_at ?? lead.created_at;
  return new Date(new Date(basis).getTime() + LP2_TOKEN_TTL_MS);
}
