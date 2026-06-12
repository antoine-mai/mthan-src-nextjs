<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Karpathy Behavioral Guidelines

Behavioral guidelines to reduce common LLM coding mistakes.

## 1. Think Before Coding
- **Don't assume. Don't hide confusion. Surface tradeoffs.**
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First
- **Minimum code that solves the problem. Nothing speculative.**
- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

## 3. Surgical Changes
- **Touch only what you must. Clean up only your own mess.**
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

## 4. Goal-Driven Execution
- **Define success criteria. Loop until verified.**
- Transform tasks into verifiable goals (e.g., write tests or check behavior before and after).
- For multi-step tasks, state a brief plan and verify each step.

# Project Custom Rules
- **Do not automatically run build commands (`npm run build`, `next build`, etc.)** unless explicitly requested by the user.
- **Do not run development server commands (`npm run dev`, `next dev`, etc.)** under any circumstances, as the user runs the dev server themselves.
- **Use lowercase only for file and folder names** (e.g., use kebab-case like `admin-layout.tsx` instead of CamelCase/PascalCase). Do not use uppercase letters in any file or directory names.
- **Do not use semicolons (`;`) in JavaScript or TypeScript files.** Avoid trailing semicolons at the end of statements.
- **Do not use rounded corners in CSS/styling (`rounded-*`, border-radius, etc.)** under any circumstances, unless explicitly requested by the user.
