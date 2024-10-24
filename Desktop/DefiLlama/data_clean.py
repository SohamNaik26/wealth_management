import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import requests

pd.read_csv

x = requests.get('https://api.llama.fi/overview/fees/ethereum?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyFees')

print(x.text)
df.plot()