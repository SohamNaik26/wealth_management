import requests

x = requests.get('https://api.llama.fi/overview/fees/ethereum?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyFees')

print(x.text)