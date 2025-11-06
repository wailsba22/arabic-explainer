// Vercel Serverless Function - handles AI requests without CORS
// Deploy this to Vercel and it will work automatically!

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { code, language } = req.body;
        
        if (!code || !language) {
            return res.status(400).json({ error: 'Missing code or language' });
        }

        const prompt = `شرح الكود التالي المكتوب بلغة ${language} باللغة العربية بشكل مفصل وواضح:

\`\`\`${language}
${code}
\`\`\`

اشرح ما يفعله الكود، كيف يعمل، والمفاهيم المهمة. الشرح بالعربية:`;

        // Try Hugging Face API - Get API key from environment variables
        const HF_API_KEY = process.env.HF_API_KEY;
        
        if (!HF_API_KEY) {
            console.error('HF_API_KEY not found in environment variables');
            return res.status(503).json({ 
                error: 'AI service not configured. Please add HF_API_KEY to environment variables.' 
            });
        }
        
        const models = [
            'mistralai/Mixtral-8x7B-Instruct-v0.1',
            'meta-llama/Llama-2-7b-chat-hf'
        ];

        for (const model of models) {
            try {
                const response = await fetch(
                    `https://api-inference.huggingface.co/models/${model}`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${HF_API_KEY}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            inputs: prompt,
                            parameters: {
                                max_new_tokens: 500,
                                temperature: 0.7,
                                return_full_text: false
                            }
                        })
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    
                    let explanation = null;
                    if (Array.isArray(data) && data[0]?.generated_text) {
                        explanation = data[0].generated_text;
                    } else if (data.generated_text) {
                        explanation = data.generated_text;
                    }

                    if (explanation) {
                        return res.status(200).json({ 
                            explanation,
                            model: model 
                        });
                    }
                }
            } catch (error) {
                console.error(`Error with ${model}:`, error);
            }
        }

        // If all fail, return error
        return res.status(503).json({ 
            error: 'جميع نماذج AI غير متاحة حالياً. جرب مرة أخرى لاحقاً.' 
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'خطأ في الخادم' });
    }
}
