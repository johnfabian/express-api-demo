import json
import random

def generate_todos(count):
    todos = []
    statuses = ["In-Progress", "Not-Started", "Completed"]
    priorities = ["Low", "Medium", "High"]
    
    for i in range(1, count + 1):
        todos.append({
            "id": i,
            "title": f"Task {i}: Detailed update required for feature implementation.",
            "status": random.choice(statuses),
            "priority": random.choice(priorities),
            "due_date": f"2024-{(i%12)+1:02d}", # Simple date mocking
            "tags": random.choice(["work", "personal", "urgent"])
        })
    return todos

if __name__ == "__main__":
    TOTAL_ITEMS = 1000
    todos_list = generate_todos(TOTAL_ITEMS)
    
    # Output the JSON content to data/todos.json
    output_filename = "data/todos.json"
    with open(output_filename, 'w') as f:
        json.dump(todos_list, f, indent=2)
    
    print(f"Successfully generated {TOTAL_ITEMS} items and saved them to {output_filename}")
