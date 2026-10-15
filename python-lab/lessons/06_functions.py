def classify(restarts):
    if restarts >= 3:
        return "Review"
    return "Observe"

result = classify(4)
print(result)
