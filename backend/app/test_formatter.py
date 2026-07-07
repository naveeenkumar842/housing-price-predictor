from app.utils import format_inr

# Test cases
test_values = [
    265000,
    245000,
    385000,
    175000,
    290000,
    220000,
    410000,
    255000,
    160000,
    350000,
    195000,
    1000,
    10000,
    100000,
    1000000,
    10000000,
    123456789
]

print("Testing INR Formatter:")
print("-" * 40)
for value in test_values:
    formatted = format_inr(value)
    print(f"{value:>12,} -> {formatted}")