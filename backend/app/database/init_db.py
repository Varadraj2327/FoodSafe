from sqlalchemy import select, inspect, text
from app.database.connection import engine, SessionLocal
from app.database.base import Base
from app.models import (
    Category,
    Food,
    User,
    Favorite,
    QuizQuestion,
    QuizOption,
    QuizResult,
)

INITIAL_QUIZ_QUESTIONS = [
    {
        "question_text": "How can you detect starch adulteration in milk at home?",
        "explanation": "Adding iodine solution to milk containing starch produces a distinct blue color.",
        "options": [
            {"option_text": "Add a few drops of iodine solution", "is_correct": True},
            {"option_text": "Boil the milk with salt", "is_correct": False},
            {"option_text": "Mix with vinegar and check for foam", "is_correct": False},
            {"option_text": "Freeze the milk for 2 hours", "is_correct": False},
        ]
    },
    {
        "question_text": "Which harmful dye is commonly used to adulterate yellow turmeric powder?",
        "explanation": "Metanil yellow is a non-permitted synthetic dye added to turmeric, which causes stomach disturbances and neurotoxicity.",
        "options": [
            {"option_text": "Metanil Yellow", "is_correct": True},
            {"option_text": "Tartrazine", "is_correct": False},
            {"option_text": "Sunset Yellow", "is_correct": False},
            {"option_text": "Rhodamine B", "is_correct": False},
        ]
    },
    {
        "question_text": "What happens when pure unadulterated honey is dropped into a glass of cold water?",
        "explanation": "Pure honey has high density and viscosity, settling at the bottom in a lump without dissolving immediately.",
        "options": [
            {"option_text": "It settles at the bottom in a lump", "is_correct": True},
            {"option_text": "It dissolves instantly", "is_correct": False},
            {"option_text": "It floats on top of the water", "is_correct": False},
            {"option_text": "It turns the water milky white", "is_correct": False},
        ]
    },
    {
        "question_text": "What is the recommended test to check for iron filings in black tea leaves?",
        "explanation": "Iron filings adhere to a strong magnet when passed directly over adulterated tea leaves.",
        "options": [
            {"option_text": "Run a magnet over the tea leaves", "is_correct": True},
            {"option_text": "Dip tea leaves in lemon juice", "is_correct": False},
            {"option_text": "Heat tea leaves on a frying pan", "is_correct": False},
            {"option_text": "Mix tea leaves with baking soda", "is_correct": False},
        ]
    }
]
from app.core.security import get_password_hash

INITIAL_CATEGORIES = [
    {
        "name": "Dairy",
        "description": "Milk, ghee, butter, and dairy commodities essential for daily nutrition."
    },
    {
        "name": "Spices",
        "description": "Whole and ground spices used for flavor, color, and medicinal benefits."
    },
    {
        "name": "Sweeteners",
        "description": "Natural and refined sweeteners including raw honey, jaggery, and sugars."
    },
    {
        "name": "Beverages",
        "description": "Tea leaves, coffee, and herbal botanical infusions."
    },
    {
        "name": "Protein",
        "description": "Eggs, meat, poultry, fish, and plant-based protein sources."
    },
    {
        "name": "Grains",
        "description": "Staple grains, cereals, pulses, and whole wheat commodities."
    },
    {
        "name": "Fruits",
        "description": "Fresh, dried, and preserved fruits rich in natural vitamins and fiber."
    },
    {
        "name": "Bakery",
        "description": "Freshly baked goods, loaves, rolls, and flour-based culinary products."
    },
    {
        "name": "Nuts",
        "description": "Tree nuts, oilseeds, and nutrient-dense kernels."
    }
]

INITIAL_FOODS = [
    {
        "name": "Milk",
        "category_name": "Dairy",
        "description": "Fresh cattle milk widely consumed for calcium and protein.",
        "adulterants": "Water, starch, detergent, urea, synthetic milk (oil + emulsifiers), and formalin preservative.",
        "health_risks": "Gastrointestinal tract inflammation, kidney damage from urea, tissue toxicity from formalin, and severe nutrient dilution.",
        "consumer_precautions": "Storage: Keep refrigerated below 4°C.\n1. Water Slip Test: Put a drop of milk on a polished slanted surface. Pure milk flows slowly leaving a white trail.\n2. Starch Test: Add a few drops of iodine solution; blue coloration indicates starch presence.\n3. Detergent Test: Shake milk vigorously with water; dense lather indicates detergent."
    },
    {
        "name": "Turmeric",
        "category_name": "Spices",
        "description": "Golden spice powder ground from Curcuma longa rhizomes.",
        "adulterants": "Metanil yellow non-permitted dye, lead chromate, chalk powder, starch, and yellow ochre.",
        "health_risks": "Lead poisoning, neurotoxicity, anemia, stomach disturbances, and potential carcinogenic effects from Metanil yellow.",
        "consumer_precautions": "Storage: Store in a dark, dry container.\n1. Water Settling Test: Add a spoon of turmeric to warm water. Pure turmeric settles at the bottom leaving clear light-yellow water. Adulterated turmeric keeps water cloudy bright yellow.\n2. Paper Test: Pure turmeric leaves an orange-red stain when mixed with alkali (soap/lime)."
    },
    {
        "name": "Honey",
        "category_name": "Sweeteners",
        "description": "Natural unpasteurized nectar sweetener produced by honeybees.",
        "adulterants": "Sugar syrup, high-fructose corn syrup, invert sugar syrup, molasses, and rice syrup.",
        "health_risks": "Rapid blood glucose spikes, risk of diabetes, weight gain, and loss of natural enzymatic and anti-inflammatory properties.",
        "consumer_precautions": "Storage: Store at room temperature in a sealed glass jar.\n1. Cold Water Test: Drop a spoonful into a glass of cold water. Pure honey settles at the bottom in a lump without dissolving immediately. Sugar syrup dissolves quickly.\n2. Thumb Test: Put a drop on your thumb; pure honey stays intact while adulterated honey spills."
    },
    {
        "name": "Tea",
        "category_name": "Beverages",
        "description": "Processed black and green tea leaves (Camellia sinensis).",
        "adulterants": "Exhausted (used) re-dyed tea leaves, iron filings, coal tar dyes, Prussian blue, and artificial sawdust.",
        "health_risks": "Digestive tract ulceration from iron filings, chemical toxicity from synthetic coal tar dyes, and liver stress.",
        "consumer_precautions": "Storage: Keep airtight away from strong odors.\n1. Filter Paper Test: Spread tea leaves on wet filter paper. Synthetic dye leaves instant colored spots, whereas unadulterated tea releases color slowly.\n2. Magnet Test: Run a magnet over tea leaves to catch harmful iron filings."
    },
    {
        "name": "Eggs",
        "category_name": "Protein",
        "description": "Eggs are a protein-rich food that also provides essential nutrients.",
        "adulterants": "Synthetic artificial eggs (made from alginate, gelatin, alum, and calcium chloride), chemical dye coating, and stale un-refrigerated egg wash.",
        "health_risks": "Gastrointestinal distress, chemical toxicity from artificial egg shells, Salmonella infection, and severe food poisoning.",
        "consumer_precautions": "Storage: Keep refrigerated and cook thoroughly. Allergen: Egg.\n1. Water Float Test: Fresh eggs sink to the bottom of a bowl of cold water and lie flat. Stale or spoiled eggs float to the top due to built-up gas.\n2. Yolk Integrity Test: Crack egg onto a flat plate. Fresh egg yolk is round, firm, and stands high; artificial or spoiled egg yolk breaks immediately."
    },
    {
        "name": "Rice",
        "category_name": "Grains",
        "description": "Rice is a staple grain used in many meals.",
        "adulterants": "Plastic resin artificial rice, talcum powder coating for shine, urea polish, and marble/stone grit.",
        "health_risks": "Gastrointestinal blockages, stomach lining irritation from talcum powder, digestive disorders, and chemical toxicity from plastic polymers.",
        "consumer_precautions": "Storage: Store uncooked rice in a cool, dry place. Refrigerate cooked rice promptly.\n1. Water Sink Test: Stir a spoonful of raw rice into water. Real rice sinks; synthetic plastic rice floats on the water surface.\n2. Burn Test: Light a piece of rice with a match. Plastic rice smells like burning plastic and chars rapidly into a hard melt."
    },
    {
        "name": "Apples",
        "category_name": "Fruits",
        "description": "Apples provide dietary fiber and other nutrients.",
        "adulterants": "Industrial petroleum wax coating for artificial gloss, dye injections (Rhodamine B / Metanil Yellow) for artificial color, and heavy pesticide residues.",
        "health_risks": "Digestive discomfort, liver toxicity from paraffin wax ingestion, chemical poisoning from synthetic dye injections, and allergic reactions.",
        "consumer_precautions": "Storage: Wash before eating and store appropriately.\n1. Scraping Test: Gently scrape the surface of the apple skin with a knife blade. A white waxy residue indicates artificial wax coating.\n2. Hot Water Rinse: Dip apple in warm water for a few seconds; artificial wax melts and turns white and opaque on the skin."
    },
    {
        "name": "Bread",
        "category_name": "Bakery",
        "description": "Bread is a grain-based food commonly used in meals and snacks.",
        "adulterants": "Potassium bromate / iodate flour improvers, artificial brown caramel coloring in white wheat bread, and chemical preservatives.",
        "health_risks": "Thyroid disorders, potential carcinogenic risks from potassium bromate, gastrointestinal irritation, and mold toxicity.",
        "consumer_precautions": "Storage: Keep sealed, follow package instructions, and discard bread with visible mold. Allergen: Wheat/gluten where applicable.\n1. Label Inspection: Check ingredients for non-permitted improvers (Potassium Bromate).\n2. Mold & Moisture Inspection: Inspect slices under bright light; discard entire loaf if any mold spots appear."
    },
    {
        "name": "Almonds",
        "category_name": "Nuts",
        "description": "Almonds contain protein, fiber, and unsaturated fats.",
        "adulterants": "Wild bitter almonds mixed with sweet almonds (toxic amygdalin), red oxide mineral dye coating, and stale rancid kernels bleached with sulfur.",
        "health_risks": "Cyanide toxicity from bitter almonds, stomach inflammation from chemical dyes, and aflatoxin poisoning from improperly stored rancid kernels.",
        "consumer_precautions": "Storage: Keep in a cool, dry place in a sealed container. Allergen: Tree nut (almond).\n1. Rubbing Test: Rub almonds between moist white paper or cloth. Synthetic dye leaves a reddish-brown stain on the paper.\n2. Taste & Aroma Test: Pure almonds taste sweet and nutty. Avoid kernels with a harsh bitter taste or sour chemical smell."
    },
    {
        "name": "Bananas",
        "category_name": "Fruits",
        "description": "Bananas provide carbohydrates, fiber, and potassium.",
        "adulterants": "Calcium carbide artificial ripening agent, ethephon spray, and industrial chemical dip for uniform yellow color.",
        "health_risks": "Neurological symptoms, headache, dizziness, stomach cramps, and throat irritation caused by trace arsenic and phosphorus hydrides in calcium carbide.",
        "consumer_precautions": "Storage: Store according to ripeness and discard spoiled fruit.\n1. Appearance Inspection: Naturally ripened bananas have dark brown spots and green stalks. Calcium carbide ripened bananas are uniformly bright yellow with dark black stalks.\n2. Texture & Taste Test: Artificially ripened bananas feel firm on the outside but taste raw, sour, or tasteless inside."
    }
]

def initialize_database() -> None:
    """
    Creates all database tables if they do not exist and seeds initial
    categories, food items, and default admin user cleanly without creating duplicates.
    Automates SQLite column migrations if new fields are added.
    """
    # 1. Create tables if not existing
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        inspector = inspect(engine)
        existing_tables = inspector.get_table_names()

        # 2. Check and migrate legacy quiz_questions table if needed
        if "quiz_questions" in existing_tables:
            columns_quiz = [col["name"] for col in inspector.get_columns("quiz_questions")]
            if "question" in columns_quiz and "question_text" not in columns_quiz:
                db.execute(text("DROP TABLE quiz_questions CASCADE"))
                db.commit()
                Base.metadata.create_all(bind=engine)
                inspector = inspect(engine)
                existing_tables = inspector.get_table_names()

        # 3. Check and perform column migrations for image_path, view_count & full_name
        if "foods" in existing_tables:
            columns_foods = [col["name"] for col in inspector.get_columns("foods")]
            if "image_path" not in columns_foods:
                db.execute(text("ALTER TABLE foods ADD COLUMN image_path VARCHAR(255)"))
                db.commit()

            if "view_count" not in columns_foods:
                db.execute(text("ALTER TABLE foods ADD COLUMN view_count INTEGER DEFAULT 0"))
                db.commit()

        if "users" in existing_tables:
            columns_users = [col["name"] for col in inspector.get_columns("users")]
            if "full_name" not in columns_users:
                db.execute(text("ALTER TABLE users ADD COLUMN full_name VARCHAR(100)"))
                db.commit()
    except Exception as e:
        db.rollback()
        print(f"Migration notice: {e}")



    try:


        # Seed Default Admin Account
        existing_admin = db.scalar(select(User).where(User.username == "admin"))
        if not existing_admin:
            admin_user = User(
                username="admin",
                email="admin@foodsafe.org",
                hashed_password=get_password_hash("admin123"),
                is_admin=True
            )
            db.add(admin_user)

        # Category lookup map
        category_map = {}

        # Insert Categories
        for cat_data in INITIAL_CATEGORIES:
            existing_cat = db.scalar(
                select(Category).where(Category.name == cat_data["name"])
            )
            if not existing_cat:
                new_cat = Category(
                    name=cat_data["name"],
                    description=cat_data["description"]
                )
                db.add(new_cat)
                db.flush()  # Populate id
                category_map[cat_data["name"]] = new_cat.id
            else:
                category_map[cat_data["name"]] = existing_cat.id

        # Insert Foods
        for food_data in INITIAL_FOODS:
            existing_food = db.scalar(
                select(Food).where(Food.name == food_data["name"])
            )
            if not existing_food:
                cat_id = category_map.get(food_data["category_name"])
                if cat_id:
                    new_food = Food(
                        name=food_data["name"],
                        category_id=cat_id,
                        description=food_data["description"],
                        adulterants=food_data["adulterants"],
                        health_risks=food_data["health_risks"],
                        consumer_precautions=food_data["consumer_precautions"]
                    )
                    db.add(new_food)

        # Insert Initial Quiz Questions
        for q_data in INITIAL_QUIZ_QUESTIONS:
            existing_q = db.scalar(
                select(QuizQuestion).where(QuizQuestion.question_text == q_data["question_text"])
            )
            if not existing_q:
                new_q = QuizQuestion(
                    question_text=q_data["question_text"],
                    explanation=q_data["explanation"]
                )
                db.add(new_q)
                db.flush()
                for opt in q_data["options"]:
                    new_opt = QuizOption(
                        question_id=new_q.id,
                        option_text=opt["option_text"],
                        is_correct=opt["is_correct"]
                    )
                    db.add(new_opt)

        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()
