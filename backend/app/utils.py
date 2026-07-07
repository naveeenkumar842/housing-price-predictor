import pandas as pd
from pathlib import Path
from typing import Union

def format_inr(amount: Union[float, int]) -> str:
    """Format a number as Indian Rupees (₹)"""
    if amount is None:
        return "₹0"
    
    amount = int(round(abs(amount)))
    s = str(amount)
    
    if len(s) <= 3:
        return f"₹{s}"
    
    reversed_s = s[::-1]
    parts = []
    parts.append(reversed_s[:3])
    remaining = reversed_s[3:]
    for i in range(0, len(remaining), 2):
        parts.append(remaining[i:i+2])
    
    formatted = ','.join([part[::-1] for part in parts[::-1]])
    return f"₹{formatted}"

def load_training_data():
    """Load the training dataset"""
    data_path = Path('data/House Price Dataset.csv')
    if data_path.exists():
        return pd.read_csv(data_path)
    return None