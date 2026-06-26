const LP1_TOKEN_TTL_MS = 72 * 60 * 60 * 1000;

export type Lp1TokenLead = {
  created_at: string;
  lp1_token_issued_at?: string | null;
};

/**
 * LP1 links expire 72h after token issuance (arch §7).
 * Uses lp1_token_issued_at when set, otherwise falls back to created_at.
 */
export function isLp1TokenExpired(lead: Lp1TokenLead): boolean {
  const basis = lead.lp1_token_issued_at ?? lead.created_at;
  const issued = new Date(basis).getTime();
  return Date.now() - issued > LP1_TOKEN_TTL_MS;
}

export function lp1TokenExpiresAt(lead: Lp1TokenLead): Date {
  const basis = lead.lp1_token_issued_at ?? lead.created_at;
  return new Date(new Date(basis).getTime() + LP1_TOKEN_TTL_MS);
}
