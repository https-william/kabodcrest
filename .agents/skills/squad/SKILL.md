---
name: squad
description: Repository-native multi-agent team orchestration framework based on bradygaster/squad. Use when organizing complex development tasks into coordinated agent personas (Lead, Frontend, Backend, Tester, Reviewer), managing .squad directory artifacts (charters, decisions, ceremonies, routing), and maintaining cross-session memory and accountability.
---

# Squad Multi-Agent Orchestration Framework

Squad is an open-source, repository-native framework for orchestrating coordinated multi-agent AI teams directly inside the codebase. Rather than interacting with an unconstrained generalist agent, Squad structures work around defined roles, clear charters, and persistent repository state.

## 1. Core Architecture

The team's state and collaboration history are stored directly in the repository's `.squad/` directory:

- `.squad/team.md`: Defines the roster of active agents, their specialties, and current task assignments.
- `.squad/decisions.md`: Chronological log of architectural decisions, consensus rationale, and constraints agreed upon by the squad.
- `.squad/ceremonies.md`: Standard operational routines (daily standup summaries, sprint retrospectives, handoff checklists).
- `.squad/routing.md`: Task assignment logic routing specific domains (e.g., CSS/UI, backend API, tests, security) to the appropriate agent persona.

## 2. Standard Squad Roles

1. **Squad Lead (Coordinator)**:
   - Breaks high-level requirements into atomic subtasks.
   - Assigns subtasks according to the routing matrix.
   - Enforces the project's brand guidelines and architecture constraints.

2. **Frontend Engineer (Visual & Interaction Specialist)**:
   - Implements UI components according to `tokens.css` and `DESIGN.md`.
   - Manages responsive layouts, CSS grid/flexbox, accessibility (WCAG AA), and motion (GSAP).

3. **Backend / Integration Engineer**:
   - Manages Node.js server scripts, API endpoints, payment gateways (Paystack, Stripe), order persistence, and currency conversion logic.

4. **Quality & Review Engineer (Tester / Verifier)**:
   - Validates checkout calculations, edge cases, responsive breakpoints (mobile, tablet, desktop), broken asset paths, and form validations.

5. **Scribe (Memory & Documentation Specialist)**:
   - Records durable decisions, updates README/docs, and logs state changes into persistent notes.

## 3. Usage Guidelines for Kabod Crest

- When tackling large feature additions (e.g. multi-currency checkout, dynamic inventory allocation, new vertical pages):
  1. Define the roles needed.
  2. Log the architectural plan in `.squad/decisions.md`.
  3. Execute components with specialized focus.
  4. Verify against brand rules before merging or marking complete.
