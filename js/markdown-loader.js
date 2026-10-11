// js/markdown-loader.js

const recipeCategories = {
    "☀️ На каждый день": [
        '0-always-at-home.md'
    ],
    "🥣 Супы": [
        '1-soup-finnish-salmon.md',
        '1-soup-homemade-solyanka.md',
        '1-soup-lentil-chicken.md'
    ],
    "🍳 Вторые блюда": [
        '2-kasha-chicken-mushrooms.md',
        '2-pasta-chicken-mushrooms.md',
        '2-pasta-one-pot-chicken.md'
    ],
    "🥞 Завтраки и Десерты": [
        'breakfast-one-pan-toast.md',
        'breakfast-overnight-jar.md',
        'breakfast-raejuusto-pancakes.md'
    ]
};

async function loadAllRecipes() {
    const container = document.getElementById('content');
    if (!container) return;

    container.innerHTML = '';

    for (const [categoryName, files] of Object.entries(recipeCategories)) {

        const categoryHeader = document.createElement('h2');
        categoryHeader.className = 'category-title';
        categoryHeader.innerText = categoryName;
        container.appendChild(categoryHeader);

        for (const fileName of files) {
            try {
                const response = await fetch('foodRecipes/' + fileName);
                if (!response.ok) throw new Error(`Не удалось загрузить: ${fileName}`);

                const markdownText = await response.text();
                const htmlContent = marked.parse(markdownText);

                const detailsElement = document.createElement('details');
                detailsElement.innerHTML = htmlContent;

                const firstHeader = detailsElement.querySelector('h1, h2, h3');
                if (firstHeader) {
                    const summaryElement = document.createElement('summary');
                    summaryElement.innerHTML = firstHeader.innerHTML;
                    firstHeader.parentNode.replaceChild(summaryElement, firstHeader);
                }

                // --- УМНАЯ МАГИЯ ЧЕКБОКСОВ ---
                // 1. Находим все заголовки (обычно h2 или h3) внутри плашки рецепта
                const headers = detailsElement.querySelectorAll('h1, h2, h3, h4');

                headers.forEach(header => {
                    // Проверяем, содержит ли текст заголовка слово "Ингредиенты" (в любом регистре)
                    if (header.textContent.toLowerCase().includes('ингредиенты')) {

                        // 2. Находим следующий за ним элемент (это должен быть список <ul>)
                        let nextElement = header.nextElementSibling;

                        // Если между заголовком и списком затесался другой тег (например, <p>), ищем дальше
                        while (nextElement && nextElement.tagName !== 'UL' && nextElement.tagName !== 'OL') {
                            nextElement = nextElement.nextElementSibling;
                        }

                        // 3. Если список найден, вешаем чекбоксы только на его элементы
                        if (nextElement) {
                            const ingredientsListItems = nextElement.querySelectorAll('li');
                            ingredientsListItems.forEach(item => {
                                item.classList.add('todo-item');
                                item.addEventListener('click', function () {
                                    this.classList.toggle('checked');
                                });
                            });
                        }

                        
                    }
                });

                container.appendChild(detailsElement);

            } catch (error) {
                console.error(error);
                const errorDiv = document.createElement('div');
                errorDiv.style.color = 'red';
                errorDiv.style.fontFamily = 'monospace';
                errorDiv.innerText = `[Ошибка] Файл не найден: foodRecipes/${fileName}`;
                container.appendChild(errorDiv);
            }
        }
    }
}

loadAllRecipes();
