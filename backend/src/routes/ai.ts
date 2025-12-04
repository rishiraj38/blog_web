import { Hono } from "hono";
import { verify } from "hono/jwt";

const BLOCKED_DOMAINS = [
    "pornhub", "xvideos", "xnxx", "xhamster", "redtube", "youporn",
    "brazzers", "onlyfans", "chaturbate", "livejasmin", "stripchat",
    "thepiratebay", "1337x", "rarbg", "torrentz", "kickass",
    "phishing", "malware", "virus", "hack", "crack", "warez",
    "darkweb", "silkroad", "drugs", "weapons",
    "gore", "bestgore", "liveleak",
];

const BAD_WORDS = [
    "fuck", "shit", "ass", "bitch", "bastard", "damn", "crap",
    "dick", "cock", "pussy", "cunt", "whore", "slut",
    "nigger", "nigga", "faggot", "retard",
    "kill", "murder", "rape", "terrorist", "bomb",
    "nazi", "hitler",
];

function isBlockedDomain(url: string): boolean {
    const lowerUrl = url.toLowerCase();
    return BLOCKED_DOMAINS.some(domain => lowerUrl.includes(domain));
}

function containsAbusiveContent(text: string): { isAbusive: boolean; reason: string } {
    const lowerText = text.toLowerCase();
    const foundBadWords: string[] = [];
    
    for (const word of BAD_WORDS) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = lowerText.match(regex);
        if (matches && matches.length > 0) {
            foundBadWords.push(word);
        }
    }
    
    if (foundBadWords.length >= 3) {
        return { 
            isAbusive: true, 
            reason: "Content contains too many inappropriate words. Please provide appropriate content." 
        };
    }
    
    return { isAbusive: false, reason: "" };
}

function sanitizeText(text: string): string {
    let sanitized = text;
    for (const word of BAD_WORDS) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        sanitized = sanitized.replace(regex, '*'.repeat(word.length));
    }
    return sanitized;
}

export const aiRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
        OPENROUTER_API_KEY: string;
    }
}>();

aiRouter.use("/*", async (c, next) => {
    const jwt = c.req.header("Authorization");
    if (!jwt) {
        c.status(401);
        return c.json({ error: "unauthorized" });
    }
    try {
        const payload = await verify(jwt, c.env.JWT_SECRET);
        if (!payload) {
            c.status(401);
            return c.json({ error: "unauthorized" });
        }
        await next();
    } catch (e) {
        c.status(401);
        return c.json({ error: "unauthorized" });
    }
});

aiRouter.post("/summarize", async (c) => {
    const body = await c.req.json();
    const { url, text } = body;

    if (!url && !text) {
        return c.json({ error: "Please provide a URL or text to summarize" }, 400);
    }

    if (url) {
        if (isBlockedDomain(url)) {
            return c.json({ 
                error: "⚠️ This URL is blocked. Please provide a legitimate article or blog post URL." 
            }, 400);
        }
    }

    if (text) {
        const contentCheck = containsAbusiveContent(text);
        if (contentCheck.isAbusive) {
            return c.json({ error: `⚠️ ${contentCheck.reason}` }, 400);
        }
    }

    let contentToSummarize = text ? sanitizeText(text) : "";

    if (url) {
        try {
            const jinaUrl = `https://r.jina.ai/${url}`;
            const response = await fetch(jinaUrl, {
                headers: {
                    "Accept": "text/plain"
                }
            });
            
            if (!response.ok) {
                return c.json({ error: "Failed to fetch URL content. The page might be blocked or unavailable." }, 400);
            }
            
            contentToSummarize = await response.text();
            
            const fetchedContentCheck = containsAbusiveContent(contentToSummarize);
            if (fetchedContentCheck.isAbusive) {
                return c.json({ 
                    error: "⚠️ The content from this URL contains inappropriate material and cannot be summarized." 
                }, 400);
            }
            
            contentToSummarize = sanitizeText(contentToSummarize).substring(0, 15000); 
        } catch (e) {
            console.error("URL fetch error:", e);
            return c.json({ error: "Failed to fetch URL" }, 400);
        }
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${c.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-chat-v3-0324:free",
                messages: [
                    {
                        role: "system",
                        content: `You are an expert content summarizer. Create clear, well-structured summaries in markdown format.

Rules:
1. Start with a brief 2-3 sentence overview
2. List key points as bullet points
3. Use **bold** for important terms and concepts
4. Use headings (##) to organize different sections if the content covers multiple topics
5. Keep the summary concise but comprehensive
6. If the content is about a technical topic, include any important code concepts or steps
7. Do NOT include any inappropriate, offensive, or harmful content in your summary`
                    },
                    {
                        role: "user",
                        content: `Please summarize the following article/content:\n\n${contentToSummarize}`
                    }
                ],
                max_tokens: 1500
            })
        });

        const data = await response.json();
        if (data.error) {
            console.error("OpenRouter error:", data.error);
            const fallbackResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${c.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "openrouter/auto",
                    messages: [
                        {
                            role: "user",
                            content: `Summarize this content with bullet points and bold key terms:\n\n${contentToSummarize.substring(0, 8000)}`
                        }
                    ]
                })
            });
            const fallbackData = await fallbackResponse.json();
            const fallbackSummary = (fallbackData as {choices?: {message?: {content?: string}}[]}).choices?.[0]?.message?.content || "No summary generated";
            return c.json({ summary: fallbackSummary });
        }
        
        const summary = (data as {choices?: {message?: {content?: string}}[]}).choices?.[0]?.message?.content || "No summary generated";

        return c.json({ summary });
    } catch (e) {
        console.error(e);
        return c.json({ error: "AI Service unavailable" }, 500);
    }
});
