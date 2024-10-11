INSERT INTO books(title, form, isbn, summary,detail,author,pages,contents,price,pub_date)
VALUES
('어린왕자들','종이책',0,'어리다','많이 어리다','김어림',100,'목차입니다',20000,'2019-01-01'),
('신데렐라들','종이책',1,'유리구두','투명한 유리구두','김구두',100,'목차입니다',20000,'2024-09-25'),
('백설공주들','종이책',2,'사과','빨간 사과','김사과',100,'목차입니다',20000,'2024-09-01'),
('흥부와 놀부들','종이책',3,'제비','까만 제비','김제비',100,'목차입니다',20000,'2024-10-02');

SELECT * FROM books
LEFT JOIN category
ON books.category_id=category.id
WHERE books.id=1;

INSERT INTO likes(user_id, liked_book_id)
VALUES (1, 1);