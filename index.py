# Online Python compiler (interpreter) to run Python online.
# Write Python 3 code in this online editor and run it.
 # ----------------------------------------------
# Crop Disease Management System (Simple Version)
# ----------------------------------------------

# Database of diseases (can be expanded)
DISEASE_DATABASE = {
    "rice": {
        "leaf blight": {
            "symptoms": ["yellow leaves", "brown tips", "wilting"],
            "management": [
                "Use resistant rice varieties.",
                "Apply recommended copper-based fungicides.",
                "Avoid standing water for long periods.",
                "Remove and destroy infected plants."
            ]
        },
        "blast": {
            "symptoms": ["diamond-shaped lesions", "grey center spots", "leaf burning"],
            "management": [
                "Use blast-resistant varieties.",
                "Apply tricyclazole fungicide.",
                "Maintain proper plant spacing.",
                "Avoid excessive nitrogen fertilizer."
            ]
        }
    },

    "tomato": {
        "early blight": {
            "symptoms": ["dark spots", "yellow leaves", "concentric rings"],
            "management": [
                "Apply chlorothalonil or copper fungicide.",
                "Rotate crops every 2–3 seasons.",
                "Water plants at the base (not on leaves)."
            ]
        },
        "late blight": {
            "symptoms": ["water-soaked spots", "white mildew", "leaf collapse"],
            "management": [
                "Use certified disease-free seeds.",
                "Apply mancozeb or metalaxyl fungicide.",
                "Destroy infected plants immediately."
            ]
        }
    }
}


# ----------------------------------------------
# Function: Identify disease based on symptoms
# ----------------------------------------------
def identify_disease(crop, symptom):
    crop = crop.lower()
    symptom = symptom.lower()

    if crop not in DISEASE_DATABASE:
        return None, f"No data available for crop: {crop}"

    for disease, info in DISEASE_DATABASE[crop].items():
        # check if symptom is in the list
        if any(symptom in s for s in info["symptoms"]):
            return disease, info

    return None, "No disease matched the given symptom."


# ----------------------------------------------
# Function: Display management advice
# ----------------------------------------------
def show_management(disease, info):
    print(f"\n=== Disease Identified: {disease.title()} ===")
    print("\nManagement Recommendations:")
    for step in info["management"]:
        print(f"✔ {step}")


# ----------------------------------------------
# Main Menu Driven Program
# ----------------------------------------------
def main():
    print("==============================================")
    print("   🌾 Crop Disease Management System")
    print("==============================================")

    while True:
        print("\n1. Identify Disease")
        print("2. List Supported Crops")
        print("3. Exit")

        choice = input("\nChoose an option (1-3): ")

        if choice == "1":
            crop = input("\nEnter crop name (rice/tomato/etc): ")
            symptom = input("Enter observed symptom: ")

            disease, details = identify_disease(crop, symptom)

            if disease:
                show_management(disease, details)
            else:
                print("\n❌", details)

        elif choice == "2":
            print("\nSupported crops:")
            for crop in DISEASE_DATABASE:
                print("•", crop)

        elif choice == "3":
            print("\nThank you for using the system!")
            break

        else:
            print("\nInvalid choice! Please select 1–3.")


# Run program
if __name__ == "__main__":
    main()
