// script.js
document.addEventListener('DOMContentLoaded', function() {
    const codeBox = document.getElementById('code-box');
    const langSelect = document.getElementById('lang-select');
    const explainBtn = document.getElementById('explain-btn');
    const output = document.getElementById('explanation-output');
    const contactForm = document.querySelector('.contact-form');

    // Initialize CodeMirror
    const editor = CodeMirror.fromTextArea(codeBox, {
        lineNumbers: true,
        mode: 'javascript',
        theme: 'monokai',
        indentUnit: 4,
        tabSize: 4,
        autoCloseBrackets: true,
        matchBrackets: true,
        lineWrapping: true
    });

    // Update mode when language changes
    langSelect.addEventListener('change', function() {
        const mode = getCodeMirrorMode(langSelect.value);
        editor.setOption('mode', mode);
    });

    if (explainBtn) {
        explainBtn.addEventListener('click', async function() {
            const code = editor.getValue().trim();
            const language = langSelect.value;

            if (!code) {
                alert('Please enter some code first.');
                return;
            }

            // Show loading
            output.innerHTML = '<h3>Explanation</h3><p>جاري التحليل...</p>';

            try {
                const explanation = await getAIExplanation(code, language);
                output.innerHTML = `<h3>Explanation (${language})</h3><div style="white-space: pre-wrap;">${explanation}</div>`;
            } catch (error) {
                console.error('Error details:', error);
                output.innerHTML = `<h3>Explanation</h3><p style="color: #e74c3c;">⚠️ ${error.message}</p><p style="margin-top: 1rem;">يرجى التحقق من مفتاح API في ملف script.js والحصول على مفتاح صالح من <a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a></p>`;
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    async function getAIExplanation(code, language) {
        // 🚀 Using Serverless API - works perfectly with GitHub Pages!
        
        try {
            // Try serverless backend first (works when deployed to Vercel/GitHub Pages)
            const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:3000/api/explain'  // Local development
                : '/api/explain';  // Production (Vercel)
            
            console.log('Calling serverless API...');
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code,
                    language: getLanguageName(language)
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ AI explanation received!');
                return data.explanation;
            } else {
                console.log('API failed, using local analysis...');
            }
            
        } catch (error) {
            console.log('API error:', error.message);
        }
        
        // Fallback to smart local analysis
        return generateSmartExplanation(code, language);
    }

    function generateSmartExplanation(code, language) {
        const langName = getLanguageName(language);
        let explanation = `📖 **شرح الكود (${langName})**\n\n`;
        
        const lines = code.split('\n');
        const trimmedLines = lines.map(l => l.trim()).filter(l => l.length > 0);
        
        // Detailed analysis
        const analysis = analyzeCode(code, language);
        
        // 1. Overview
        explanation += `**📋 نظرة عامة:**\n`;
        explanation += `• اللغة: ${langName}\n`;
        explanation += `• عدد الأسطر: ${trimmedLines.length}\n`;
        explanation += `• مستوى التعقيد: ${analysis.complexity}\n\n`;
        
        // 2. Purpose detection
        if (analysis.purpose) {
            explanation += `**🎯 الغرض من الكود:**\n${analysis.purpose}\n\n`;
        }
        
        // 3. Components
        if (analysis.imports.length > 0) {
            explanation += `**📦 المكتبات المستوردة:**\n`;
            analysis.imports.forEach(imp => {
                explanation += `• ${imp.name} - ${imp.description}\n`;
            });
            explanation += `\n`;
        }
        
        if (analysis.functions.length > 0) {
            explanation += `**⚙️ الدوال (Functions):**\n`;
            analysis.functions.forEach(func => {
                explanation += `• **${func.name}**: ${func.description}\n`;
            });
            explanation += `\n`;
        }
        
        if (analysis.classes.length > 0) {
            explanation += `**🏗️ الكلاسات (Classes):**\n`;
            analysis.classes.forEach(cls => {
                explanation += `• **${cls.name}**: ${cls.description}\n`;
            });
            explanation += `\n`;
        }
        
        if (analysis.variables.length > 0) {
            explanation += `**📊 المتغيرات الرئيسية:**\n`;
            analysis.variables.forEach(v => {
                explanation += `• ${v.name} (${v.type})\n`;
            });
            explanation += `\n`;
        }
        
        // 4. Concepts
        if (analysis.concepts.length > 0) {
            explanation += `**💡 المفاهيم البرمجية المستخدمة:**\n`;
            analysis.concepts.forEach(concept => {
                explanation += `• ${concept}\n`;
            });
            explanation += `\n`;
        }
        
        // 5. Step by step
        if (analysis.steps.length > 0) {
            explanation += `**📝 شرح الخطوات:**\n`;
            analysis.steps.forEach((step, i) => {
                explanation += `${i + 1}. ${step}\n`;
            });
            explanation += `\n`;
        }
        
        // 6. Output
        if (analysis.output) {
            explanation += `**🖥️ النتيجة المتوقعة:**\n${analysis.output}\n\n`;
        }
        
        return explanation;
    }
    
    function analyzeCode(code, language) {
        const lines = code.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const analysis = {
            imports: [],
            functions: [],
            classes: [],
            variables: [],
            concepts: [],
            steps: [],
            purpose: '',
            output: '',
            complexity: 'بسيط'
        };
        
        // Determine complexity
        if (lines.length > 50) analysis.complexity = 'معقد';
        else if (lines.length > 20) analysis.complexity = 'متوسط';
        
        // Language-specific analysis
        switch (language) {
            case 'python':
                analyzePython(code, lines, analysis);
                break;
            case 'javascript':
                analyzeJavaScript(code, lines, analysis);
                break;
            case 'java':
                analyzeJava(code, lines, analysis);
                break;
            default:
                analyzeGeneric(code, lines, analysis);
        }
        
        return analysis;
    }
    
    function analyzePython(code, lines, analysis) {
        // Detect imports
        lines.forEach(line => {
            if (line.startsWith('import ') || line.startsWith('from ')) {
                const parts = line.split(' ');
                const libName = parts[1].replace(',', '');
                analysis.imports.push({
                    name: libName,
                    description: getPythonLibDescription(libName)
                });
            }
            
            // Functions
            if (line.startsWith('def ')) {
                const match = line.match(/def (\w+)\((.*?)\):/);
                if (match) {
                    analysis.functions.push({
                        name: match[1],
                        description: describePythonFunction(match[1], match[2])
                    });
                }
            }
            
            // Classes
            if (line.startsWith('class ')) {
                const match = line.match(/class (\w+)/);
                if (match) {
                    analysis.classes.push({
                        name: match[1],
                        description: 'كلاس يمثل كائن برمجي'
                    });
                }
            }
            
            // Variables
            if (line.includes('=') && !line.startsWith('def') && !line.startsWith('class')) {
                const match = line.match(/(\w+)\s*=/);
                if (match && analysis.variables.length < 5) {
                    analysis.variables.push({
                        name: match[1],
                        type: detectPythonType(line)
                    });
                }
            }
        });
        
        // Detect purpose
        if (code.includes('print(')) analysis.purpose = 'برنامج يقوم بطباعة نص أو قيم على الشاشة';
        if (code.includes('input(')) analysis.purpose = 'برنامج تفاعلي يطلب إدخال من المستخدم';
        if (code.includes('for ') || code.includes('while ')) {
            analysis.concepts.push('الحلقات التكرارية (Loops)');
            analysis.purpose = 'برنامج يستخدم التكرار لتنفيذ عمليات متعددة';
        }
        if (code.includes('if ')) analysis.concepts.push('الشروط المنطقية (Conditionals)');
        if (code.includes('def ')) analysis.concepts.push('الدوال (Functions)');
        if (code.includes('class ')) analysis.concepts.push('البرمجة الكائنية (OOP)');
        if (code.includes('[') && code.includes(']')) analysis.concepts.push('القوائم (Lists)');
        if (code.includes('{') && code.includes('}') && code.includes(':')) analysis.concepts.push('القواميس (Dictionaries)');
        
        // Generate steps
        if (code.includes('def main()') || code.includes('if __name__')) {
            analysis.steps.push('يبدأ البرنامج من دالة main()');
        }
        if (analysis.imports.length > 0) {
            analysis.steps.push(`استيراد المكتبات المطلوبة: ${analysis.imports.map(i => i.name).join(', ')}`);
        }
        if (analysis.variables.length > 0) {
            analysis.steps.push('تعريف المتغيرات الأساسية');
        }
        if (analysis.functions.length > 0) {
            analysis.steps.push(`تعريف ${analysis.functions.length} دالة لتنفيذ المهام`);
        }
        if (code.includes('print(')) {
            const prints = code.match(/print\((.*?)\)/g);
            if (prints) {
                analysis.output = `سيطبع البرنامج ${prints.length} نتيجة على الشاشة`;
            }
        }
    }
    
    function analyzeJavaScript(code, lines, analysis) {
        lines.forEach(line => {
            // Imports
            if (line.startsWith('import ') || line.startsWith('const ') && line.includes('require(')) {
                const match = line.match(/['"](.+?)['"]/);
                if (match) {
                    analysis.imports.push({
                        name: match[1],
                        description: getJSLibDescription(match[1])
                    });
                }
            }
            
            // Functions
            if (line.includes('function ')) {
                const match = line.match(/function (\w+)/);
                if (match) {
                    analysis.functions.push({
                        name: match[1],
                        description: 'دالة لتنفيذ مهمة محددة'
                    });
                }
            }
            if (line.match(/const \w+ = \(/)) {
                const match = line.match(/const (\w+) =/);
                if (match) {
                    analysis.functions.push({
                        name: match[1],
                        description: 'Arrow function حديثة'
                    });
                }
            }
        });
        
        if (code.includes('console.log')) analysis.purpose = 'برنامج يطبع نتائج في Console';
        if (code.includes('document.')) analysis.purpose = 'سكريبت للتعامل مع عناصر صفحة الويب';
        if (code.includes('addEventListener')) analysis.concepts.push('معالجة الأحداث (Event Handling)');
        if (code.includes('async ') || code.includes('await ')) analysis.concepts.push('البرمجة غير المتزامنة (Async)');
        if (code.includes('fetch(')) analysis.concepts.push('طلبات HTTP');
    }
    
    function analyzeJava(code, lines, analysis) {
        lines.forEach(line => {
            if (line.startsWith('import ')) {
                const match = line.match(/import (.+?);/);
                if (match) {
                    analysis.imports.push({
                        name: match[1].split('.').pop(),
                        description: 'مكتبة Java'
                    });
                }
            }
            
            if (line.includes('public static void main')) {
                analysis.purpose = 'برنامج Java رئيسي قابل للتنفيذ';
            }
        });
        
        if (code.includes('System.out.println')) analysis.output = 'يطبع نتائج في Terminal';
        if (code.includes('class ')) analysis.concepts.push('البرمجة الكائنية (OOP)');
    }
    
    function analyzeGeneric(code, lines, analysis) {
        analysis.purpose = 'كود برمجي عام';
        if (code.includes('print') || code.includes('cout') || code.includes('Console.Write')) {
            analysis.output = 'يطبع نتائج على الشاشة';
        }
    }
    
    function getPythonLibDescription(lib) {
        const libs = {
            'numpy': 'للحسابات الرياضية والمصفوفات',
            'pandas': 'لتحليل البيانات',
            'matplotlib': 'لرسم المخططات البيانية',
            'requests': 'للتعامل مع HTTP',
            'flask': 'لإنشاء تطبيقات ويب',
            'django': 'إطار عمل ويب متكامل',
            'random': 'لتوليد أرقام عشوائية',
            'math': 'للعمليات الرياضية',
            'datetime': 'للتعامل مع التاريخ والوقت',
            'os': 'للتعامل مع نظام التشغيل',
            'sys': 'للوصول لمعاملات النظام',
            'json': 'للتعامل مع JSON'
        };
        return libs[lib] || 'مكتبة خارجية';
    }
    
    function getJSLibDescription(lib) {
        const libs = {
            'react': 'مكتبة لبناء واجهات المستخدم',
            'express': 'إطار عمل لبناء سيرفرات Node.js',
            'axios': 'للتعامل مع HTTP requests',
            'fs': 'للتعامل مع الملفات',
            'path': 'للتعامل مع مسارات الملفات'
        };
        return libs[lib] || 'مكتبة JavaScript';
    }
    
    function describePythonFunction(name, params) {
        if (name === 'main') return 'الدالة الرئيسية للبرنامج';
        if (name.startsWith('get')) return 'دالة لجلب أو إرجاع قيمة';
        if (name.startsWith('set')) return 'دالة لتعيين قيمة';
        if (name.startsWith('calculate')) return 'دالة لحساب قيمة';
        if (name.startsWith('print')) return 'دالة للطباعة';
        if (params) return `دالة تأخذ معاملات: ${params}`;
        return 'دالة مخصصة';
    }
    
    function detectPythonType(line) {
        if (line.includes('[') && line.includes(']')) return 'قائمة (List)';
        if (line.includes('{') && line.includes('}')) return 'قاموس (Dictionary)';
        if (line.includes('"') || line.includes("'")) return 'نص (String)';
        if (line.match(/=\s*\d+$/)) return 'رقم (Integer)';
        if (line.match(/=\s*\d+\.\d+/)) return 'رقم عشري (Float)';
        if (line.includes('True') || line.includes('False')) return 'قيمة منطقية (Boolean)';
        return 'متغير';
    }

    function getLanguageName(lang) {
        const names = {
            python: 'Python',
            javascript: 'JavaScript',
            java: 'Java',
            cpp: 'C++',
            csharp: 'C#',
            php: 'PHP',
            ruby: 'Ruby',
            go: 'Go',
            rust: 'Rust',
            swift: 'Swift',
            kotlin: 'Kotlin',
            typescript: 'TypeScript',
            html: 'HTML',
            css: 'CSS',
            sql: 'SQL',
            bash: 'Bash'
        };
        return names[lang] || lang;
    }

    function getCodeMirrorMode(lang) {
        const modes = {
            python: 'python',
            javascript: 'javascript',
            java: 'text/x-java',
            cpp: 'text/x-c++src',
            csharp: 'text/x-csharp',
            php: 'php',
            ruby: 'ruby',
            go: 'go',
            rust: 'rust',
            swift: 'swift',
            kotlin: 'text/x-java', // Kotlin uses Java mode
            typescript: 'javascript', // TypeScript uses JS mode
            html: 'htmlmixed',
            css: 'css',
            sql: 'sql',
            bash: 'shell'
        };
        return modes[lang] || 'javascript';
    }
});