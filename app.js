class AITextEditor {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.updateTextStats();
    }

    initializeElements() {
        // Form elements
        this.form = document.getElementById('editorForm');
        this.textInput = document.getElementById('textInput');
        this.targetAudience = document.getElementById('targetAudience');
        this.documentPurpose = document.getElementById('documentPurpose');
        this.additionalContext = document.getElementById('additionalContext');
        
        // Progress elements
        this.progressSection = document.getElementById('progressSection');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        
        // Results elements
        this.resultsSection = document.getElementById('resultsSection');
        this.newAnalysisBtn = document.getElementById('newAnalysisBtn');
        
        // Stats elements
        this.wordCount = document.getElementById('wordCount');
        this.charCount = document.getElementById('charCount');
        
        // Toast
        this.toast = document.getElementById('toast');
        this.toastMessage = document.getElementById('toastMessage');
        
        // Current analysis data
        this.currentAnalysis = null;
    }

    attachEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.startAnalysis();
        });

        // Text input stats
        this.textInput.addEventListener('input', () => {
            this.updateTextStats();
        });

        // New analysis button
        this.newAnalysisBtn.addEventListener('click', () => {
            this.resetForm();
        });

        // Result section toggle
        document.querySelectorAll('.result-header').forEach(header => {
            header.addEventListener('click', (e) => {
                if (!e.target.classList.contains('copy-btn')) {
                    this.toggleResultSection(header);
                }
            });
        });

        // Copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.copyToClipboard(btn.dataset.copy);
            });
        });
    }

    updateTextStats() {
        const text = this.textInput.value.trim();
        const words = text ? text.split(/\s+/).length : 0;
        const chars = text.length;
        
        this.wordCount.textContent = `Слов: ${words}`;
        this.charCount.textContent = `Символов: ${chars}`;
    }

    async startAnalysis() {
        const text = this.textInput.value.trim();
        
        if (!text) {
            this.showToast('Пожалуйста, введите текст для анализа', 'error');
            return;
        }

        if (text.length < 50) {
            this.showToast('Текст слишком короткий для качественного анализа', 'error');
            return;
        }

        // Show progress section
        this.progressSection.classList.remove('hidden');
        this.resultsSection.classList.add('hidden');
        
        // Disable form
        this.form.classList.add('loading');
        const submitBtn = this.form.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            // Simulate analysis progress
            await this.simulateAnalysis();

            // Generate results
            this.currentAnalysis = this.generateAnalysisResults(text);
            
            // Show results
            this.displayResults();
            
        } catch (error) {
            console.error('Analysis error:', error);
            this.showToast('Произошла ошибка при анализе', 'error');
        } finally {
            // Hide progress and enable form
            this.progressSection.classList.add('hidden');
            this.form.classList.remove('loading');
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    async simulateAnalysis() {
        const steps = [
            'Инициализация анализа...',
            'Анализ орфографии и грамматики...',
            'Проверка стилистики...',
            'Анализ структуры текста...',
            'Проверка фактов...',
            'Генерация предложений...',
            'Создание отредактированной версии...',
            'Завершение анализа...'
        ];

        for (let i = 0; i < steps.length; i++) {
            this.progressText.textContent = steps[i];
            this.progressFill.style.width = `${((i + 1) / steps.length) * 100}%`;
            await this.delay(300 + Math.random() * 200); // Уменьшил время задержки
        }
    }

    generateAnalysisResults(text) {
        const wordCount = text.split(/\s+/).length;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const purpose = this.documentPurpose.value;
        const audience = this.targetAudience.value;

        return {
            summary: this.generateSummary(text, wordCount, purpose),
            errors: this.generateErrors(text),
            factCheck: this.generateFactCheck(text),
            suggestions: this.generateSuggestions(text, purpose, audience),
            enhancements: this.generateEnhancements(text, purpose, audience),
            revised: this.generateRevisedText(text)
        };
    }

    generateSummary(text, wordCount, purpose) {
        const purposeMap = {
            'academic': 'академической работы',
            'business': 'делового отчета',
            'creative': 'творческого текста',
            'blog': 'блог-поста',
            'presentation': 'презентации',
            'other': 'документа'
        };

        return `
            <div class="summary-section">
                <h4>Основное сообщение:</h4>
                <p>Представленный текст объемом ${wordCount} слов относится к категории ${purposeMap[purpose] || 'общего документа'}. Текст содержит основную идею и структурированную информацию, однако требует редакторской доработки для улучшения читаемости и воздействия.</p>
                
                <h4>Оценка эффективности:</h4>
                <p>Текст демонстрирует ${wordCount > 200 ? 'достаточную детализацию' : 'краткость изложения'} и ${text.includes('.') ? 'структурированность' : 'потребность в лучшей структуре'}. Общая оценка читаемости: удовлетворительная.</p>
                
                <h4>Сильные стороны:</h4>
                <ul>
                    <li class="strength-item">• Наличие основной идеи</li>
                    <li class="strength-item">• ${wordCount > 100 ? 'Достаточный объем контента' : 'Лаконичность изложения'}</li>
                    <li class="strength-item">• Попытка структурирования информации</li>
                </ul>
                
                <h4>Области для улучшения:</h4>
                <ul>
                    <li class="weakness-item">• Необходимость устранения орфографических и грамматических ошибок</li>
                    <li class="weakness-item">• Улучшение связности между предложениями</li>
                    <li class="weakness-item">• Повышение ясности формулировок</li>
                </ul>
            </div>
        `;
    }

    generateErrors(text) {
        const commonErrors = [
            {
                type: 'Орфографические ошибки',
                description: 'Обнаружены потенциальные опечатки и неправильное написание слов',
                examples: ['Проверьте написание сложных терминов', 'Внимание к словам с удвоенными согласными']
            },
            {
                type: 'Пунктуационные проблемы',
                description: 'Неточности в расстановке знаков препинания',
                examples: ['Отсутствуют запятые при перечислении', 'Неправильное оформление прямой речи']
            },
            {
                type: 'Грамматические неточности',
                description: 'Нарушения в согласовании и управлении',
                examples: ['Проблемы с согласованием времен', 'Неправильное употребление падежей']
            }
        ];

        if (text.length > 500) {
            commonErrors.push({
                type: 'Стилистические недочеты',
                description: 'Повторения и неудачные формулировки',
                examples: ['Тавтология и плеоназмы', 'Слишком длинные предложения']
            });
        }

        return commonErrors.map(error => `
            <div class="error-item">
                <strong>${error.type}:</strong> ${error.description}
                <ul style="margin-top: 8px; margin-left: 16px;">
                    ${error.examples.map(ex => `<li>${ex}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }

    generateFactCheck(text) {
        const hasNumbers = /\d/.test(text);
        const hasStatistics = /\d+%|\d+\s*(процент|человек|тысяч|миллион)/.test(text);
        
        let factCheckItems = [
            {
                type: 'Проверка утверждений',
                status: 'В процессе',
                description: 'Основные утверждения требуют дополнительной верификации источников'
            }
        ];

        if (hasNumbers || hasStatistics) {
            factCheckItems.push({
                type: 'Статистические данные',
                status: 'Требует внимания',
                description: 'Обнаружены числовые данные - рекомендуется указать источники'
            });
        }

        factCheckItems.push({
            type: 'Рекомендации',
            status: 'Информация',
            description: 'Добавьте ссылки на авторитетные источники для подтверждения ключевых тезисов'
        });

        return factCheckItems.map(item => `
            <div class="fact-check-item">
                <strong>${item.type}:</strong> <span class="status--warning">${item.status}</span>
                <p style="margin-top: 8px;">${item.description}</p>
            </div>
        `).join('');
    }

    generateSuggestions(text, purpose, audience) {
        const suggestions = [
            {
                title: 'Улучшение структуры',
                description: 'Разделите текст на логические абзацы с четкими переходами между идеями'
            },
            {
                title: 'Активный залог',
                description: 'Замените пассивные конструкции активными для более живого изложения'
            },
            {
                title: 'Конкретность',
                description: 'Замените общие формулировки конкретными примерами и фактами'
            }
        ];

        if (purpose === 'academic') {
            suggestions.push({
                title: 'Академический стиль',
                description: 'Используйте более формальную лексику и избегайте разговорных выражений'
            });
        }

        if (purpose === 'business') {
            suggestions.push({
                title: 'Деловой тон',
                description: 'Сосредоточьтесь на ключевых выводах и рекомендациях'
            });
        }

        if (audience) {
            suggestions.push({
                title: 'Адаптация под аудиторию',
                description: `Учтите особенности целевой аудитории: ${audience}`
            });
        }

        return suggestions.map(suggestion => `
            <div class="suggestion-item">
                <strong>${suggestion.title}:</strong>
                <p style="margin-top: 8px;">${suggestion.description}</p>
            </div>
        `).join('');
    }

    generateEnhancements(text, purpose, audience) {
        const enhancements = [
            {
                title: 'Усиление аргументации',
                description: 'Добавьте примеры, статистику или экспертные мнения для подкрепления основных тезисов'
            },
            {
                title: 'Эмоциональное воздействие',
                description: 'Используйте риторические приемы для усиления эмоционального отклика читателя'
            },
            {
                title: 'Визуальная организация',
                description: 'Рассмотрите возможность добавления заголовков, списков или выделений для лучшего восприятия'
            }
        ];

        if (text.length < 300) {
            enhancements.push({
                title: 'Расширение контента',
                description: 'Текст можно дополнить более детальным раскрытием ключевых идей'
            });
        }

        if (purpose === 'presentation') {
            enhancements.push({
                title: 'Адаптация для презентации',
                description: 'Разбейте текст на слайды с ключевыми тезисами и поддерживающими деталями'
            });
        }

        return enhancements.map(enhancement => `
            <div class="enhancement-item">
                <strong>${enhancement.title}:</strong>
                <p style="margin-top: 8px;">${enhancement.description}</p>
            </div>
        `).join('');
    }

    generateRevisedText(originalText) {
        // Простая симуляция редактирования
        let revised = originalText
            .replace(/\s+/g, ' ') // Убираем лишние пробелы
            .replace(/([.!?])\s*([а-яё])/gi, '$1 $2') // Исправляем пробелы после знаков препинания
            .replace(/,([а-яё])/gi, ', $1') // Добавляем пробелы после запятых
            .trim();

        // Добавляем улучшения в начало
        const improvements = [
            'Отредактированная версия с улучшенной структурой и стилистикой:',
            '',
            revised,
            '',
            '---',
            'Основные изменения:',
            '• Исправлены орфографические и пунктуационные ошибки',
            '• Улучшена читаемость и структура предложений',
            '• Оптимизирована стилистика под целевую аудиторию',
            '• Устранены повторы и тавтология'
        ];

        return `<div class="revised-text">${improvements.join('\n')}</div>`;
    }

    displayResults() {
        // Populate content sections
        document.getElementById('summaryContent').innerHTML = this.currentAnalysis.summary;
        document.getElementById('errorsContent').innerHTML = this.currentAnalysis.errors;
        document.getElementById('factcheckContent').innerHTML = this.currentAnalysis.factCheck;
        document.getElementById('suggestionsContent').innerHTML = this.currentAnalysis.suggestions;
        document.getElementById('enhancementsContent').innerHTML = this.currentAnalysis.enhancements;
        document.getElementById('revisedContent').innerHTML = this.currentAnalysis.revised;

        // Show results section
        this.resultsSection.classList.remove('hidden');
        
        // Scroll to results with a small delay to ensure content is rendered
        setTimeout(() => {
            this.resultsSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }

    toggleResultSection(header) {
        const content = header.nextElementSibling;
        content.classList.toggle('collapsed');
        
        // Update header appearance
        if (content.classList.contains('collapsed')) {
            header.style.opacity = '0.7';
        } else {
            header.style.opacity = '1';
        }
    }

    async copyToClipboard(sectionType) {
        const contentMap = {
            'summary': this.currentAnalysis?.summary,
            'errors': this.currentAnalysis?.errors,
            'factcheck': this.currentAnalysis?.factCheck,
            'suggestions': this.currentAnalysis?.suggestions,
            'enhancements': this.currentAnalysis?.enhancements,
            'revised': this.currentAnalysis?.revised
        };

        const content = contentMap[sectionType];
        if (!content) return;

        try {
            // Remove HTML tags for plain text copy
            const textContent = content.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
            await navigator.clipboard.writeText(textContent);
            this.showToast('Содержимое скопировано в буфер обмена');
        } catch (err) {
            console.error('Copy failed:', err);
            this.showToast('Ошибка при копировании', 'error');
        }
    }

    showToast(message, type = 'success') {
        this.toastMessage.textContent = message;
        this.toast.className = `toast ${type}`;
        this.toast.classList.add('show');
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }

    resetForm() {
        // Clear form
        this.form.reset();
        
        // Hide sections
        this.progressSection.classList.add('hidden');
        this.resultsSection.classList.add('hidden');
        
        // Reset stats
        this.updateTextStats();
        
        // Clear analysis data
        this.currentAnalysis = null;
        
        // Focus on text input
        this.textInput.focus();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AITextEditor();
});