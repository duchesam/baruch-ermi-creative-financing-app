# Company integration — 2026-11-03

Adds company navigation and an explicit example-data notice to the existing financing workspace. All calculations, preset selection, form state, printing and property lookup behavior are preserved.

The Team Portal link requires the companion `duchesam/baruch-ermi` portal change to be deployed first. Current destinations are the original verified application URLs. Future `finance.baruch-ermi.org` and `leads.baruch-ermi.org` hostnames are not activated by this branch.

This app has no source-level sign-in or shared Lead Desk storage. Its Vercel project currently protects deployments except custom domains. Before adding a custom domain, establish and test authentication or suitable protection. Do not imply that a company navigation link makes this app private.

Publish only with owner approval, after the company portal is live. Revert this commit to remove these navigation and notice additions; no data migration is involved.
