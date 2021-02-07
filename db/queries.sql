-- Список всех категорий
SELECT * FROM categories;

-- Список категорий, для которых создана минимум одна публикация
SELECT id, name FROM categories
	JOIN articles_categories
	ON id = category_id
	GROUP BY id;

-- Список категорий с количеством публикаций
SELECT id, name, count(article_id) FROM categories
	LEFT JOIN articles_categories
	ON id = category_id
	GROUP BY id;

-- Список публикаций
SELECT * FROM articles;

-- Список объявлений, сначала свежие
SELECT
	articles.*,
	COUNT(comments.id) AS comments_count,
	STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
	users.first_name,
	users.last_name,
	users.email
FROM articles
	JOIN articles_categories ON articles.id = articles_categories.article_id
	JOIN categories ON articles_categories.category_id = category_id
	LEFT JOIN comments ON comments.article_id = articles.id
	JOIN users ON users.id = articles.user_id
	GROUP BY articles.id, users.id;

-- Полная информация определённого объявления
SELECT
	articles.*,
	COUNT(comments.id) AS comments_count,
	STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
	users.first_name,
	users.last_name,
	users.email
FROM articles
	JOIN articles_categories ON articles.id = articles_categories.article_id
	JOIN categories ON articles_categories.category_id = category_id
	LEFT JOIN comments ON comments.article_id = articles.id
	JOIN users ON users.id = articles.user_id
WHERE articles.id = 1
	GROUP BY articles.id, users.id;

-- 5 свежих комментариев
SELECT
	comments.id,
	comments.article_id,
	users.first_name,
	users.last_name,
	comments.text
FROM comments
	JOIN users ON comments.user_id = users.id
	ORDER BY comments.created_at DESC
	LIMIT 5;

-- Список комментариев для определённого объявления
SELECT
	comments.id,
	comments.article_id,
	users.first_name,
	users.last_name,
	comments.text
FROM comments
	JOIN users ON comments.user_id = users.id
WHERE comments.article_id = 2
	ORDER BY comments.created_at DESC;

-- Обновление заголовка определённого объявления
UPDATE articles
  SET title = 'Как я встретил Новый год'
WHERE id = 1;
