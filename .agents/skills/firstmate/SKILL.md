---
name: firstmate
description: Meta-environment and orchestration pattern for high-throughput agentic engineering based on kunchenguid/firstmate. Manages fleets of autonomous agents using isolated Git worktrees, supervisor delegation (First Mate acting as primary orchestrator), validation gates, and durable knowledge preservation (via stow). Use when running complex, multi-track tasks in parallel without branch collision.
---

# Firstmate Agentic Engineering Meta-Environment

Firstmate (by Kun Chen) provides an architecture for high-throughput agentic software development, replacing manual agent micromanagement with a hierarchical supervisor pattern.

## 1. Core Operating Philosophy

1. **Single Point of Interaction**:
   - The developer communicates with a single primary orchestrator ("First Mate").
   - The First Mate decomposes goals, provisions isolated workspaces, supervises worker agents, and consolidates deliverable outputs (pull requests, merge proposals, audit reports).

2. **Isolated Worktrees**:
   - Every significant task or autonomous worker runs within an isolated Git worktree or task sandbox.
   - Prevents workspace dirtying, file contention, and concurrent merge conflicts.

3. **Validation Gates ("No-Mistakes")**:
   - Automated quality and syntax gates must pass before work is promoted from an agent branch to the main line.

4. **Durable Knowledge Stowage**:
   - Integrated with the `stow` skill to automatically harvest durable knowledge (user preferences, architectural choices, operational gotchas) at session end or before context resets.

## 2. Practical Application to Kabod Crest

- Use `firstmate` concepts when executing independent features concurrently (e.g., developing the Events page updates while independently hardening the checkout currency converter).
- Pair with `stow` to capture key decisions about Kabod Crest's product catalog (weights, prices, delivery logistics) into permanent project reference files.
