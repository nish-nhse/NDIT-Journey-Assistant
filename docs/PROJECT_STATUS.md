# NDIT Journey Assistant - Project Status

Last Updated: 09 Nov 2026

## Current State

### Repository

Working GitHub Repository:
NDIT-Journey-Assistant

Pages:
Live

Root Files:
- index.html
- app.js
- styles.css

### Data Model

Implemented:

- capabilities.json
- collections.json
- governance.json
- journeys.json
- knowledge_articles.json
- knowledge_graph_relationships.json
- personas.json
- questions.json
- retrieval_rules.json
- services.json
- teams.json
- templates.json

Planned:

- glossary.json
- knowledge_content.json

## Current Assistant Experience

Step 1
Role Selection

How are you using NDIT today?

Supported Roles:
- Analyst
- Data Engineer
- Developer
- Service Manager
- Product Owner
- Solution Architect
- Information Governance Lead
- Business User

Step 2
Ask Question

Examples:

- I need help onboarding a dataset
- I need access to reporting data
- I need governance approval
- I need to integrate MESH

Step 3
Entity Detection

Implemented:

✅ Intent Detection

✅ Collection Detection

✅ Service Detection

Examples:

Question:
I need to onboard a Cancer dataset into Foundry

Detected:

Intent:
how-onboard

Collection:
Cancer

Service:
Foundry

## Current Problem Being Solved

Conversation State.

Target Experience:

User:
I need help onboarding a dataset

Assistant:
Which collection are you working with?

User:
Cancer

Assistant:
Which service are you using?

User:
Foundry

Assistant:
Returns full onboarding guidance.

## Next Sprint

Sprint 5

Implement:

- Conversation state engine
- Follow-up questions
- Missing collection prompts
- Missing service prompts
- Render guidance after gathering missing information

## Future Roadmap

Sprint 6
- Glossary Engine
- glossary.json

Questions:
- What is a Suite?
- What is Foundry?
- What is CRDL?
- What is a DPIA?

Sprint 7
- Confluence Content Search
- knowledge_content.json

Sprint 8
- Knowledge Graph Traversal
- Relationship-based recommendations

Sprint 9
- Copilot Studio Integration

## Architectural Goal

User Question
    ↓
Intent Detection
    ↓
Entity Detection
    ↓
Knowledge Graph
    ↓
Journey Guidance
    ↓
Knowledge Articles
    ↓
Recommendations

NOT

Dropdowns
    ↓
Lookup
