statuses = ["UP", "DOWN", "UP", "DOWN"]
down_count = 0
for status in statuses:
    if status == "DOWN":
        down_count += 1
print(down_count)
