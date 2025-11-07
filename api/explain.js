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

        // Get API keys from environment variables
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const HF_API_KEY = process.env.HF_API_KEY;
        
        console.log('🔍 Debug info:');
        console.log('- GEMINI_API_KEY exists:', !!GEMINI_API_KEY);
        console.log('- HF_API_KEY exists:', !!HF_API_KEY);
        console.log('- Code length:', code.length);
        console.log('- Language:', language);
        
        // Try Google Gemini first (fastest and best for Arabic!)
        if (GEMINI_API_KEY) {
            try {
                console.log('🤖 Trying Google Gemini...');
                
                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
                console.log('Gemini URL:', geminiUrl.replace(GEMINI_API_KEY, 'API_KEY_HIDDEN'));
                
                const response = await fetch(geminiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.3,
                            maxOutputTokens: 1000
                        }
                    })
                });

                console.log('Gemini response status:', response.status);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('Gemini response data:', JSON.stringify(data).substring(0, 200));
                    
                    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                        const explanation = data.candidates[0].content.parts[0].text;
                        console.log('✅ Success with Google Gemini! Length:', explanation.length);
                        return res.status(200).json({ 
                            explanation,
                            model: 'Google Gemini 1.5 Flash'
                        });
                    } else {
                        console.log('⚠️ Gemini returned data but no text found');
                    }
                } else {
                    const errorText = await response.text();
                    console.log('❌ Gemini failed with status:', response.status);
                    console.log('Error response:', errorText);
                }
            } catch (error) {
                console.error('Gemini error:', error.message);
                console.error('Error stack:', error.stack);
            }
        } else {
            console.log('⚠️ GEMINI_API_KEY not found, skipping Gemini');
        }
        
        // Try Hugging Face as fallback
        if (HF_API_KEY) {
            const models = [
                'mistralai/Mixtral-8x7B-Instruct-v0.1',
                'meta-llama/Llama-2-7b-chat-hf',
                'google/flan-t5-xxl'
            ];

            for (const model of models) {
                try {
                    console.log(`🤖 Trying ${model}...`);
                    
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
                        console.log(`✅ Success with ${model}`);
                        
                        let explanation = null;
                        if (Array.isArray(data) && data[0]?.generated_text) {
                            explanation = data[0].generated_text;
                        } else if (data.generated_text) {
                            explanation = data.generated_text;
                        }

                        if (explanation && explanation.trim().length > 20) {
                            return res.status(200).json({ 
                                explanation,
                                model: model 
                            });
                        }
                    } else {
                        const errorData = await response.json();
                        console.log(`❌ ${model} failed:`, errorData);
                    }
                } catch (error) {
                    console.error(`Error with ${model}:`, error.message);
                }
            }
        }
        
        // No API keys configured
        if (!GEMINI_API_KEY && !HF_API_KEY) {
            console.error('⚠️ No API keys found in environment variables');
            console.log('Add GEMINI_API_KEY or HF_API_KEY in Vercel Project Settings');
            console.log('Gemini key: https://aistudio.google.com/app/apikey');
            console.log('HuggingFace key: https://huggingface.co/settings/tokens');
        }

        // All models failed - trigger frontend fallback
        console.log('⚠️ All AI models failed, using frontend fallback');
        return res.status(200).json({ 
            explanation: null,
            fallback: true,
            message: 'AI models busy - using local analysis'
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'خطأ في الخادم' });
    }
}
