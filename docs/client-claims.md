# Claims the site makes because the client said so

The rule: the site makes an absolute statement ("we take no commission", "every result is reviewed",
"we never...") only where the client's brief says it. Everything else is attributed to its source
("the Immigration Service says...") or softened. This list is every absolute claim in the live copy that
comes from the brief, with where the brief says it, so each one can be confirmed or changed in one pass.

Brief = "BloomAbroad website fixes P0 copy for developer" (36 pages).

## Needs a written yes from Remi before launch

These are the claims that carry the most risk. Remi and Dr Kolawole co-founded and led Solid-Link
Consulting, an international education consultancy (brief, About page). The site also says BloomAbroad is
independent, is not an agent, and takes no commission. Those can all be true, and a reader who learns
about Solid-Link will still ask. Ask Remi to confirm each point below in writing, and keep her reply.

1. **No commission.** "We take no commission from anyone." Brief pages 7, 16, 25 and 27. Confirm that
   neither Ubisphere Ltd, BloomAbroad, Remi, Dr Kolawole nor Solid-Link receives commission, a referral fee
   or any other payment from a university, agent or institution in connection with BloomAbroad users.
2. **Not an agent / does not apply for you.** "We don't apply to universities for you, we don't send you
   to any institution." Brief pages 7, 14, 16, 25 and 27. Confirm BloomAbroad does not do this, and that
   it does not hand BloomAbroad users to Solid-Link or to any other agency.
3. **Independent.** "An independent view." Brief pages 14, 16 and 25. Confirm what independent means here
   given Solid-Link, and whether the relationship should be disclosed on /about.
4. **Solid-Link's status.** Does Solid-Link still operate? If it does, say so on /about, and consider a
   line on how BloomAbroad and Solid-Link are kept apart. If it has closed, the About page should say that.
5. **Every result reviewed by a consultant.** Brief pages 6, 14, 16 and 21. Confirm there will be enough
   consultant capacity at launch for every result, because the Privacy Notice and Terms promise it.
6. **Never asks for money to "show funds"; never handles visa fees.** Brief pages 7, 14, 17 and 25.
7. **Documents.** "We don't prepare, source or advise on financial documents." Brief page 26.

## Other absolute claims, all from the brief

| Claim | Where the brief says it |
| --- | --- |
| Payment only through the secure checkout; never by bank transfer to a personal account | Pages 14, 17, 25 |
| We never sell your information, and don't share it with universities, agents or immigration authorities unless you ask | Pages 5, 6, 25 |
| Never pre-ticked consent; age bands only, never date of birth | Pages 4, 5 |
| Same price whatever the outcome ("Same price, every outcome") | Page 24 |
| Outcome within 5 working days | Pages 16, 25 |
| Every outcome comes with a summary for parents and sponsors | Pages 16, 26 |
| The assessment asks nothing about money amounts or visa history (the free checklist) | Page 11 |
| Every assessment applies the same expert-designed methodology, with reasoning recorded so it can be audited | Pages 20, 27 |
| No outcome guarantees admission or a visa; no one can guarantee those | Pages 5, 6, 14, 25 |

## Claims I removed because the brief doesn't say them

- "The same facts always lead to the same assessment" (How we assess)
- "Official guidance ... always comes first" (homepage)
- "Written and reviewed by an expert" (guides hub): guides are reviewed, not written, by Dr Kolawole
- "BloomAbroad checks readiness only" (enrolment readiness page)
- "...so you can check every fact yourself" (guides hub)
- A set of guide lines that went beyond the official page they cite. They are now attributed
  ("the Immigration Service says...") or softened.

## How this is enforced

`scripts/check-voice.mjs` prints a warning for absolute words (always, never, guarantee, no one, best,
proven and similar) in any sentence that is not one of the brief's own claims. It does not fail the
build, because a person has to decide. Add a pattern to `CLIENT_ABSOLUTES` in that script only after
confirming the brief says it.
