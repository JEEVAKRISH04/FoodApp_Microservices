import mysql.connector
import bcrypt

def seed_db():
    print("Connecting to MySQL Database...")
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="240702",
        database="foodapp"
    )
    cursor = conn.cursor()

    print("Creating Admin User...")
    admin_email = "admin@foodapp.com"
    hashed_pw = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt())
    
    # Insert Admin if not exists
    cursor.execute("SELECT id FROM users WHERE email = %s", (admin_email,))
    if not cursor.fetchone():
        insert_admin_query = "INSERT INTO users (email, password, role) VALUES (%s, %s, %s)"
        cursor.execute(insert_admin_query, (admin_email, hashed_pw, "ROLE_ADMIN"))
        print(f"Admin User created: {admin_email} / admin123")
    else:
        print("Admin user already exists.")

    print("Generating 20 Restaurants...")
    restaurants = [
        ("The Gourmet Kitchen", "Fine dining experience", "American", "123 Main St, New York", "https://images.unsplash.com/photo-1550966871-3ed8cdb5ed0c", 4.8, "11:00 AM - 10:00 PM"),
        ("Spice Route", "Authentic Indian Flavors", "Indian", "456 Oak Avenue, San Francisco", "https://images.unsplash.com/photo-1585937421612-70a008356fbe", 4.6, "12:00 PM - 11:00 PM"),
        ("Luigi's Trattoria", "Classic Italian Pasta and Pizza", "Italian", "789 Pine Road, Boston", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5", 4.7, "10:00 AM - 9:00 PM"),
        ("Sushi Master", "Fresh and Authentic Sushi", "Japanese", "321 Cedar Blvd, Seattle", "https://images.unsplash.com/photo-1579871494447-9811cf80d66c", 4.9, "11:30 AM - 10:00 PM"),
        ("El Camino Real", "Vibrant Mexican Cuisine", "Mexican", "654 Elm St, Austin", "https://images.unsplash.com/photo-1565299585323-38d6b0865b47", 4.5, "10:00 AM - 11:00 PM"),
        ("Wok This Way", "Fast & Fresh Chinese", "Chinese", "987 Maple Drive, Chicago", "https://images.unsplash.com/photo-1525351484163-7529414344d8", 4.3, "11:00 AM - 9:30 PM"),
        ("Burger Joint", "The Best Burgers in Town", "American", "147 Birch Lane, Miami", "https://images.unsplash.com/photo-1568901346375-23c9450c58cd", 4.6, "10:30 AM - 10:30 PM"),
        ("Vegan Delights", "Plant-based goodness", "Vegan", "258 Ash Way, Portland", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd", 4.8, "08:00 AM - 8:00 PM"),
        ("Seoul Kitchen", "Authentic Korean BBQ", "Korean", "369 Spruce St, Los Angeles", "https://images.unsplash.com/photo-1580651315530-69c8e0026377", 4.7, "12:00 PM - 11:00 PM"),
        ("The French Bistro", "Elegant French Dining", "French", "753 Pinecone Cir, Washington DC", "https://images.unsplash.com/photo-1504674900247-0877df9cc836", 4.9, "05:00 PM - 11:00 PM"),
        ("Thai Orchid", "Spicy and Sweet Thai", "Thai", "159 Walnut Blvd, Denver", "https://images.unsplash.com/photo-1559314809-0d155014e29e", 4.5, "11:00 AM - 9:00 PM"),
        ("Mediterranean Breeze", "Fresh Mediterranean food", "Mediterranean", "753 Oak St, Atlanta", "https://images.unsplash.com/photo-1544148103-0773bf10d330", 4.6, "11:00 AM - 10:00 PM"),
        ("Pancake House", "Breakfast all day", "Breakfast", "951 Maple Ave, Dallas", "https://images.unsplash.com/photo-1506084868230-bb9d95c24759", 4.4, "06:00 AM - 2:00 PM"),
        ("Steakhouse 55", "Premium Cut Steaks", "Steakhouse", "357 Cedar St, Las Vegas", "https://images.unsplash.com/photo-1544025162-d76694265947", 4.8, "04:00 PM - 12:00 AM"),
        ("Ramen Bowl", "Warm and Comforting Bowls", "Japanese", "654 Elm Rd, San Diego", "https://images.unsplash.com/photo-1552611052-33e04de081de", 4.7, "11:00 AM - 10:00 PM"),
        ("Taco Fiesta", "Street Tacos and Margaritas", "Mexican", "123 Cherry Ln, Houston", "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b", 4.5, "10:00 AM - 12:00 AM"),
        ("Healthy Eats", "Salads and Smoothies", "Healthy", "789 Willow Way, Denver", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd", 4.6, "07:00 AM - 8:00 PM"),
        ("Pizza Express", "Wood Fired Pizzas", "Italian", "321 Aspen Dr, Chicago", "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3", 4.3, "11:00 AM - 11:00 PM"),
        ("Curry House", "Spicy and Flavorful Curries", "Indian", "456 Birch St, New York", "https://images.unsplash.com/photo-1565557623262-b51c2513a641", 4.7, "12:00 PM - 10:00 PM"),
        ("Seafood Catch", "Fresh from the Sea", "Seafood", "987 Ocean Blvd, Miami", "https://images.unsplash.com/photo-1615141982883-c7da0ead3447", 4.8, "12:00 PM - 10:00 PM")
    ]

    insert_rest_query = """
        INSERT INTO restaurants (name, description, cuisine_type, address, image_url, rating, opening_hours)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """

    cursor.execute("SELECT COUNT(*) FROM restaurants")
    if cursor.fetchone()[0] == 0:
        cursor.executemany(insert_rest_query, restaurants)
        print("Generated 20 Restaurants.")
    else:
        print("Restaurants exist, skipping.")

    conn.commit()

    print("Generating 3 Menu Items per Restaurant...")
    cursor.execute("SELECT id, cuisine_type FROM restaurants")
    all_rests = cursor.fetchall()
    
    # Generic menu items varied by cuisine
    cuisine_menus = {
        "American": [
            ("Classic Cheeseburger", "Mains", 12.99, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd", "Juicy beef patty with cheese", True, False),
            ("French Fries", "Sides", 4.99, "https://images.unsplash.com/photo-1576107232684-1279f3908594", "Crispy golden fries", True, True),
            ("Milkshake", "Desserts", 5.99, "https://images.unsplash.com/photo-1572490122747-3968bca52084", "Thick and creamy vanilla shake", True, True)
        ],
        "Indian": [
            ("Chicken Tikka Masala", "Mains", 14.99, "https://images.unsplash.com/photo-1565557623262-b51c2513a641", "Rich and creamy tomato curry", True, False),
            ("Garlic Naan", "Breads", 3.99, "https://images.unsplash.com/photo-1601050690597-df0568f70950", "Soft bread with garlic and butter", True, True),
            ("Vegetable Biryani", "Mains", 12.99, "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8", "Aromatic rice cooked with veggies", True, True)
        ],
        "Italian": [
            ("Margherita Pizza", "Mains", 13.99, "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3", "Classic tomato and mozzarella pizza", True, True),
            ("Spaghetti Carbonara", "Mains", 15.99, "https://images.unsplash.com/photo-1612874742237-6526221588e3", "Creamy pasta with pancetta", True, False),
            ("Tiramisu", "Desserts", 7.99, "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9", "Coffee-flavored Italian dessert", True, True)
        ],
        "Japanese": [
            ("Spicy Tuna Roll", "Sushi", 8.99, "https://images.unsplash.com/photo-1579871494447-9811cf80d66c", "Fresh tuna with spicy mayo", True, False),
            ("Miso Soup", "Starters", 3.99, "https://images.unsplash.com/photo-1548943487-a2e4d43b4859", "Traditional Japanese soup", True, True),
            ("Chicken Teriyaki", "Mains", 16.99, "https://images.unsplash.com/photo-1552611052-33e04de081de", "Grilled chicken with sweet teriyaki glaze", True, False)
        ],
        "Mexican": [
            ("Beef Tacos", "Mains", 9.99, "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b", "Three street-style beef tacos", True, False),
            ("Chips and Guacamole", "Starters", 6.99, "https://images.unsplash.com/photo-1582878826629-29b7ad1cb431", "Freshly made guac with crisp chips", True, True),
            ("Chicken Enchiladas", "Mains", 13.99, "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee", "Oven-baked enchiladas", True, False)
        ],
        "Default": [
            ("Signature Dish", "Mains", 15.99, "https://images.unsplash.com/photo-1544025162-d76694265947", "Chef's special", True, False),
            ("House Salad", "Starters", 7.99, "https://images.unsplash.com/photo-1512621776951-a57141f2eefd", "Fresh greens with vinaigrette", True, True),
            ("Chocolate Cake", "Desserts", 6.99, "https://images.unsplash.com/photo-1578985545062-69928b1d9587", "Rich dark chocolate cake", True, True)
        ]
    }

    insert_menu_query = """
        INSERT INTO menu_items (restaurant_id, name, category, price, image_url, description, is_available, is_veg)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    
    cursor.execute("SELECT COUNT(*) FROM menu_items")
    if cursor.fetchone()[0] == 0:
        added = 0
        for rest in all_rests:
            r_id = rest[0]
            cuisine = rest[1]
            menus = cuisine_menus.get(cuisine, cuisine_menus["Default"])
            
            for m in menus:
                cursor.execute(insert_menu_query, (r_id, m[0], m[1], m[2], m[3], m[4], m[5], m[6]))
                added += 1
        print(f"Generated {added} Menu Items.")
    else:
        print("Menu items already exist, skipping.")

    conn.commit()
    cursor.close()
    conn.close()
    print("Seeding Complete!")

if __name__ == "__main__":
    seed_db()
