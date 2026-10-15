raw_count = "five"
try:
    count = int(raw_count)
    print(count)
except ValueError:
    print("Enter a whole number")
