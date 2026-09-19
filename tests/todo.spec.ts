import { test, expect } from '@playwright/test';

test.describe('Тестирование Todo App', () => {

  // Перед каждым тестом открываем главную страницу приложения
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200');
  });

  test('Успешное добавление новой задачи', async ({ page }) => {
    const input = page.locator('input[placeholder="What needs to be done?"]');
    const addButton = page.getByRole('button', { name: 'Add' });

    // 1. Вводим текст и нажимаем Add
    await input.fill('Авто-тест Playwright');
    await addButton.click();

    // 2. Проверяем, что задача появилась на экране
    const todoItem = page.locator('text=Авто-тест Playwright');
    await expect(todoItem).toBeVisible();
  });

  test('Редактирование задачи (Ожидаемо падает из-за бага 500)', async ({ page }) => {
    const input = page.locator('input[placeholder="What needs to be done?"]');
    const addButton = page.getByRole('button', { name: 'Add' });

    // 1. Добавляем задачу
    await input.fill('apple');
    await addButton.click();

    // 2. Нажимаем кнопку Edit напротив нашей задачи
    // Ищем кнопку Edit, которая находится в той же строке, что и текст 'apple'
    const todoRow = page.locator('.todo-item', { hasText: 'apple' }); 
    // Если классов нет, Playwright найдет по тексту кнопки:
    await page.getByRole('button', { name: 'Edit' }).first().click();

    // 3. Меняем текст на apple2 и сохраняем
    const editInput = page.locator('input[value="apple"], input.edit-input, .todo-item input').first();
    await editInput.fill('apple2');
    await page.getByRole('button', { name: 'Save' }).click();

    // 4. Проверяем, изменился ли текст (этот шаг упадет из-за бага с кнопкой Save!)
    await expect(page.locator('input.edit-input, .todo-item input').first()).not.toBeVisible();

    // Проверяем, что в списке элементов отображается текст apple2
    await expect(page.locator('.todo-item-text, label').locator('text=apple2')).toBeVisible();

  });
});
