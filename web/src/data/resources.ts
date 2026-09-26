/**
 * Official learning resources — Claude Academy, Claude Docs, the Claude Help Center and
 * Anthropic's own YouTube channel. Every URL here was checked against the official site.
 * Only add links from these official sources (see .claude/skills/lesson-writer/SKILL.md).
 */
export type ResourceKind = 'course' | 'docs' | 'help' | 'video' | 'tutorial'

export type Resource = {
  kind: ResourceKind
  title: string
  url: string
  source: 'Claude Academy' | 'Claude Docs' | 'Claude Help Center' | 'Anthropic on YouTube' | 'Anthropic on GitHub'
  description?: string
  descriptionAr?: string
  /** YouTube video id for embeddable videos */
  youtubeId?: string
}

const course = (title: string, slug: string, description: string, descriptionAr: string): Resource => ({
  kind: 'course',
  title,
  url: `https://academy.claude.com/courses/${slug}`,
  source: 'Claude Academy',
  description,
  descriptionAr,
})
const help = (title: string, path: string): Resource => ({
  kind: 'help',
  title,
  url: `https://support.claude.com/en/articles/${path}`,
  source: 'Claude Help Center',
})
const video = (title: string, youtubeId: string, description: string, descriptionAr: string): Resource => ({
  kind: 'video',
  title,
  url: `https://www.youtube.com/watch?v=${youtubeId}`,
  source: 'Anthropic on YouTube',
  youtubeId,
  description,
  descriptionAr,
})

export const R = {
  // ---------- Claude Academy (free courses with certificates) ----------
  claude101: course(
    'Claude 101',
    'claude-101',
    'Clear prompts, the AI Fluency framework, Projects, Skills, Connectors and Research.',
    'كتابة طلبات واضحة، وإطار الطلاقة في الذكاء الاصطناعي، والمشاريع، والمهارات، والموصلات، والبحث.',
  ),
  aiFluency: course(
    'AI Fluency: Framework & Foundations',
    'ai-fluency-framework-foundations',
    'The 4D framework: Delegation, Description, Discernment and Diligence.',
    'إطار الأبعاد الأربعة: التفويض، والوصف، والتمييز، والعناية.',
  ),
  aiFluencyStudents: course(
    'AI Fluency for students',
    'ai-fluency-for-students',
    'Use AI responsibly for learning, career planning and academic success.',
    'استخدم الذكاء الاصطناعي بمسؤولية في التعلّم والتخطيط المهني والنجاح الدراسي.',
  ),
  aiFluencyEducators: course(
    'AI Fluency for educators',
    'ai-fluency-for-educators',
    'Apply the 4D framework to course design and teaching.',
    'طبّق إطار الأبعاد الأربعة في تصميم المقررات والتدريس.',
  ),
  aiFluencyBuilders: course(
    'AI Fluency for builders',
    'ai-fluency-for-builders',
    'AI fluency for people who build products and software with AI.',
    'الطلاقة في الذكاء الاصطناعي لمن يبنون المنتجات والبرمجيات به.',
  ),
  claudeCode101: course(
    'Claude Code 101',
    'claude-code-101',
    'CLAUDE.md, subagents, skills, MCP servers and hooks in Claude Code.',
    'ملف CLAUDE.md والوكلاء الفرعيون والمهارات وخوادم MCP والخطافات في Claude Code.',
  ),
  agentSkillsCourse: course(
    'Introduction to agent skills',
    'introduction-to-agent-skills',
    'Build, configure and share skills — from your first SKILL.md to a full workflow.',
    'ابنِ المهارات واضبطها وشاركها — من أول ملف SKILL.md حتى سير عمل كامل.',
  ),
  mcpCourse: course(
    'Introduction to Model Context Protocol',
    'introduction-to-model-context-protocol',
    'Build MCP servers and clients: tools, resources and prompts.',
    'ابنِ خوادم وعملاء MCP: الأدوات والموارد والطلبات.',
  ),
  apiCourse: course(
    'Building with the Claude API',
    'building-with-the-claude-api',
    'The Claude API from first request to tool use, RAG and agents.',
    'واجهة Claude البرمجية من أول طلب حتى استخدام الأدوات والاسترجاع والوكلاء.',
  ),
  academyAll: {
    kind: 'course',
    title: 'All Claude Academy resources',
    url: 'https://academy.claude.com/all',
    source: 'Claude Academy',
    description: 'Every course, tutorial, use case and webinar in one place.',
    descriptionAr: 'كل الدورات والشروحات وحالات الاستخدام والندوات في مكان واحد.',
  } satisfies Resource,

  // ---------- Claude Docs ----------
  bestPractices: {
    kind: 'docs',
    title: 'Prompting best practices',
    url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices',
    source: 'Claude Docs',
    description: 'The official, always-updated guide to prompting Claude.',
    descriptionAr: 'الدليل الرسمي المحدَّث دائمًا لكتابة الطلبات لـ Claude.',
  } satisfies Resource,
  promptOverview: {
    kind: 'docs',
    title: 'Prompt engineering overview',
    url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview',
    source: 'Claude Docs',
  } satisfies Resource,
  skillsDocs: {
    kind: 'docs',
    title: 'Agent Skills overview',
    url: 'https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview',
    source: 'Claude Docs',
    description: 'How Skills work: metadata, instructions and resources loaded on demand.',
    descriptionAr: 'كيف تعمل المهارات: بيانات وصفية وتعليمات وموارد تُحمَّل عند الحاجة.',
  } satisfies Resource,
  claudeCodeDocs: {
    kind: 'docs',
    title: 'Claude Code overview',
    url: 'https://code.claude.com/docs/en/overview',
    source: 'Claude Docs',
    description: 'Install Claude Code and start coding with an AI agent.',
    descriptionAr: 'ثبّت Claude Code وابدأ البرمجة مع وكيل ذكاء اصطناعي.',
  } satisfies Resource,
  claudeCodeMemory: {
    kind: 'docs',
    title: 'Claude Code memory (CLAUDE.md)',
    url: 'https://code.claude.com/docs/en/memory',
    source: 'Claude Docs',
  } satisfies Resource,
  promptTutorial: {
    kind: 'tutorial',
    title: 'Interactive prompt engineering tutorial',
    url: 'https://github.com/anthropics/prompt-eng-interactive-tutorial',
    source: 'Anthropic on GitHub',
    description: 'A free, example-filled tutorial from Anthropic.',
    descriptionAr: 'شرح تفاعلي مجاني مليء بالأمثلة من Anthropic.',
  } satisfies Resource,

  // ---------- Claude Help Center ----------
  getStarted: help('Get started with Claude', '8114491-get-started-with-claude'),
  projects: help('What are projects?', '9517075-what-are-projects'),
  manageProjects: help('How can I create and manage projects?', '9519177-how-can-i-create-and-manage-projects'),
  artifacts: help('What are artifacts and how do I use them?', '17153992-what-are-artifacts-and-how-do-i-use-them'),
  skillsHelp: help('What are skills?', '12512176-what-are-skills'),
  useSkills: help('Use skills in Claude', '12512180-use-skills-in-claude'),
  createSkill: help('How to create custom skills', '12512198-how-to-create-custom-skills'),
  connectors: help('Use connectors to extend Claude’s capabilities', '11176164-use-connectors-to-extend-claude-s-capabilities'),
  research: help('Use research on Claude', '11088861-use-research-on-claude'),
  webSearch: help('Enable and use web search', '10684626-enable-and-use-web-search'),
  whenSearch: help('When should I use web search, extended thinking, and research?', '11095361-when-should-i-use-web-search-extended-thinking-and-research'),
  voice: help('Use voice mode', '11101966-use-voice-mode'),
  memory: help('Use Claude’s chat search and memory', '11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context'),
  incognito: help('Use incognito chats', '12260368-use-incognito-chats'),
  usageLimits: help('Usage limit best practices', '9797557-usage-limit-best-practices'),

  // ---------- Official Anthropic videos ----------
  vPrompting101: video(
    'Prompting 101 | Code w/ Claude',
    'ysPbXH0LpIE',
    'Anthropic’s Applied AI team builds a real prompt step by step.',
    'فريق Anthropic يبني طلبًا حقيقيًا خطوة بخطوة.',
  ),
  vPromptingAgents: video(
    'Prompting for Agents | Code w/ Claude',
    'XSZP9GhhuAc',
    'How to write prompts for Claude when it works as an agent.',
    'كيف تكتب الطلبات لـ Claude عندما يعمل كوكيل.',
  ),
  vClaudeCodeBP: video(
    'Claude Code best practices | Code w/ Claude',
    'gv0WHhKelSE',
    'Tips from the Anthropic team that builds Claude Code.',
    'نصائح من فريق Anthropic الذي يبني Claude Code.',
  ),
  vMcp201: video(
    'MCP 201 | Code w/ Claude',
    'HNzH5Us1Rvg',
    'The Model Context Protocol explained by one of its creators.',
    'بروتوكول MCP يشرحه أحد مبتكريه.',
  ),
  vAiFluencyIntro: video(
    'Introduction to AI Fluency',
    'JpGtOfSgR-c',
    'Lesson 1 of the AI Fluency course by Anthropic.',
    'الدرس الأول من دورة الطلاقة في الذكاء الاصطناعي من Anthropic.',
  ),
  vAiFluency4D: video(
    'The 4D Framework',
    'W4Ua6XFfX9w',
    'Delegation, Description, Discernment and Diligence — explained.',
    'التفويض والوصف والتمييز والعناية — بالشرح.',
  ),
} as const satisfies Record<string, Resource>

export const PLAYLISTS = [
  {
    title: 'Code w/ Claude — developer conference talks',
    titleAr: 'محاضرات مؤتمر Code w/ Claude',
    url: 'https://www.youtube.com/playlist?list=PLf2m23nhTg1P5BsOHUOXyQz5RhfUSSVUi',
  },
  {
    title: 'AI Fluency: Framework & Foundations — full course',
    titleAr: 'دورة الطلاقة في الذكاء الاصطناعي كاملة',
    url: 'https://www.youtube.com/playlist?list=PLf2m23nhTg1NjL3-jL3s0qZCYzO07ZQPv',
  },
]

export const allResources: Resource[] = Object.values(R)
