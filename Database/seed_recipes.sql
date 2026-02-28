USE RecipeSharingDB;

-- Insert a test user
INSERT INTO Users (FullName, Email, PasswordHash) 
VALUES ('Test User', 'test@example.com', '$2y$10$wN1Q/Xo/T.T1s1xU21w6G.3r2W7.IexjB.U6aP6/O6k3D/O0vB82O'); -- password is 'password123'

-- Get the inserted user ID
SET @uid = (SELECT UserId FROM Users WHERE Email = 'test@example.com' LIMIT 1);

-- Insert recipes for categories
-- 1 Breakfast
INSERT INTO Recipes (Title, Ingredients, Steps, ImageUrl, CookingTime, Servings, UserId, CategoryId) VALUES
('Classic Pancakes', 'Flour, Milk, Eggs, Sugar, Butter', 'Mix all ingredients. Cook on pan.', 'https://images.unsplash.com/photo-1528207776546-365bb710ee93', 20, 2, @uid, (SELECT CategoryId FROM Categories WHERE CategoryName='Breakfast'));

-- 2 Lunch
INSERT INTO Recipes (Title, Ingredients, Steps, ImageUrl, CookingTime, Servings, UserId, CategoryId) VALUES
('Grilled Cheese Sandwich', 'Bread, Cheddar Cheese, Butter', 'Butter bread. Add cheese. Grill until melted.', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af', 15, 1, @uid, (SELECT CategoryId FROM Categories WHERE CategoryName='Lunch'));

-- 3 Dinner
INSERT INTO Recipes (Title, Ingredients, Steps, ImageUrl, CookingTime, Servings, UserId, CategoryId) VALUES
('Spaghetti Bolognese', 'Spaghetti, Ground Beef, Tomato Sauce, Onion, Garlic', 'Cook spaghetti. Fry beef. Add sauce. Combine.', 'https://images.unsplash.com/photo-1598866594230-a7c12756260f', 40, 4, @uid, (SELECT CategoryId FROM Categories WHERE CategoryName='Dinner'));

-- 4 Dessert
INSERT INTO Recipes (Title, Ingredients, Steps, ImageUrl, CookingTime, Servings, UserId, CategoryId) VALUES
('Chocolate Lava Cake', 'Chocolate, Butter, Flour, Eggs, Sugar', 'Melt chocolate and butter. Mix dry ingredients. Bake 12 mins.', 'https://images.unsplash.com/photo-1511381939415-e44015466834', 25, 2, @uid, (SELECT CategoryId FROM Categories WHERE CategoryName='Dessert'));

-- 5 Appetizer
INSERT INTO Recipes (Title, Ingredients, Steps, ImageUrl, CookingTime, Servings, UserId, CategoryId) VALUES
('Bruschetta', 'Baguette, Tomatoes, Basil, Garlic, Olive Oil', 'Toast bread. Mix tomatoes with basil and oil. Top bread.', 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f', 15, 6, @uid, (SELECT CategoryId FROM Categories WHERE CategoryName='Appetizer'));

-- 6 Snack
INSERT INTO Recipes (Title, Ingredients, Steps, ImageUrl, CookingTime, Servings, UserId, CategoryId) VALUES
('Hummus', 'Chickpeas, Tahini, Lemon, Garlic, Olive Oil', 'Blend all ingredients until smooth.', 'https://images.unsplash.com/photo-1585238342024-78d387f4a707', 10, 4, @uid, (SELECT CategoryId FROM Categories WHERE CategoryName='Snack'));

-- 7 Beverage
INSERT INTO Recipes (Title, Ingredients, Steps, ImageUrl, CookingTime, Servings, UserId, CategoryId) VALUES
('Strawberry Smoothie', 'Strawberries, Yogurt, Milk, Honey', 'Blend until smooth.', 'https://images.unsplash.com/photo-1556881286-fc6915169721', 5, 1, @uid, (SELECT CategoryId FROM Categories WHERE CategoryName='Beverage'));

-- 8 Salad
INSERT INTO Recipes (Title, Ingredients, Steps, ImageUrl, CookingTime, Servings, UserId, CategoryId) VALUES
('Caesar Salad', 'Romaine, Parmesan, Croutons, Caesar Dressing', 'Chop lettuce. Mix with dressing. Top with croutons.', 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9', 15, 2, @uid, (SELECT CategoryId FROM Categories WHERE CategoryName='Salad'));

-- 9 Soup
INSERT INTO Recipes (Title, Ingredients, Steps, ImageUrl, CookingTime, Servings, UserId, CategoryId) VALUES
('Tomato Basil Soup', 'Tomatoes, Basil, Onion, Garlic, Veggie Broth', 'Cook ingredients. Blend. Simmer.', 'https://images.unsplash.com/photo-1547592180-85f173990554', 35, 4, @uid, (SELECT CategoryId FROM Categories WHERE CategoryName='Soup'));

-- 10 Vegan
INSERT INTO Recipes (Title, Ingredients, Steps, ImageUrl, CookingTime, Servings, UserId, CategoryId) VALUES
('Vegan Buddha Bowl', 'Quinoa, Sweet Potato, Kale, Chickpeas, Tahini', 'Roast veggies. Cook quinoa. Assemble with dressing.', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', 30, 2, @uid, (SELECT CategoryId FROM Categories WHERE CategoryName='Vegan'));

