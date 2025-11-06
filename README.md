# Arabic Explainer | شرح البرمجة بالعربية

A project to help Arabs see and learn what code means in Arabic and how it works.  
مشروع لمساعدة العرب على رؤية وفهم معنى الكود بالعربية وكيف يعمل

## 🌟 Features | المميزات

- **Bilingual Support** - Full English/Arabic language support with RTL layout
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Modern UI** - Clean, professional design with interactive elements
- **Code Examples** - JavaScript code examples with Arabic explanations
- **Easy to Use** - Simple language toggle and smooth navigation

## 🚀 Getting Started | البداية

### View the Website | عرض الموقع

Simply open `index.html` in your web browser to view the website locally.

Or serve it using any static file server:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000`

### Project Structure | هيكل المشروع

```
arabic-explainer/
├── index.html          # Main landing page
├── about.html          # About page
├── css/
│   └── styles.css      # All styles and responsive design
├── js/
│   └── main.js         # JavaScript for interactivity
├── assets/
│   └── README.md       # Assets directory documentation
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## 🎨 Customization | التخصيص

### Changing Colors | تغيير الألوان

Edit CSS variables in `css/styles.css`:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    /* ... more variables */
}
```

### Adding Content | إضافة محتوى

Both `index.html` and `about.html` use bilingual content with classes:
- `.lang-en` for English content
- `.lang-ar` for Arabic content

Example:
```html
<h1>
    <span class="lang-en">English Text</span>
    <span class="lang-ar" style="display: none;">النص العربي</span>
</h1>
```

## 🔧 Technologies Used | التقنيات المستخدمة

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox and Grid
- **JavaScript (ES6+)** - Interactive features
- **Google Fonts** - Cairo (Arabic) and Roboto (English) fonts

## 🤝 Contributing | المساهمة

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📝 License | الترخيص

This project is open source and available for educational purposes.

## 💡 Future Enhancements | التحسينات المستقبلية

- [ ] Add more code examples with different programming languages
- [ ] Create interactive code playground
- [ ] Add video tutorials
- [ ] Build a community forum
- [ ] Mobile app version

---

Made with ❤️ for the Arab developer community | صُنع بـ ❤️ لمجتمع المطورين العرب
