-- server/migrations/001-payments-and-matches.sql
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  provider_tx_id VARCHAR(128) UNIQUE,
  user_id VARCHAR(128) NOT NULL,
  provider VARCHAR(32) NOT NULL,
  amount_cents INTEGER,
  coins_awarded INTEGER,
  status VARCHAR(32),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS match_results (
  id SERIAL PRIMARY KEY,
  match_id VARCHAR(128) UNIQUE NOT NULL,
  winner_user_id VARCHAR(128),
  target_block JSONB,
  duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
