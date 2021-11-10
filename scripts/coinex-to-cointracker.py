#!/usr/bin/env python3

import io, os, sys
import csv
from datetime import datetime

infile = sys.argv[1]
outfile = sys.argv[2]

# Execution Time,Sending,Receiving,Side,Executed Price,Executed Amount,Executed Value,Fees,Fees Coin Type,Executed Type
# Order Time,Sending,Receiving,Type,Side,Order Price,Order Amount,Executed Amount,Value,Avg.Price
COINTRACKER_COLUMNS = ['Date', 'Received Quantity', 'Received Currency', 'Sent Quantity', 'Sent Currency', 'Fee Amount', 'Fee Currency', 'Tag']

def pad0(value):
    return '%f' % round( abs( float(value) ), 7 )

with io.open(infile, 'r') as infd:
  csvReader = csv.DictReader(infd)
  with io.open(outfile, 'w') as ofd:
    coinTracker = csv.DictWriter(ofd, COINTRACKER_COLUMNS)
    coinTracker.writeheader()
    for txn in csvReader:
      # 2021-11-04 05:30:35
      result = {
        'Date': datetime.strptime(txn['Execution Time'], '%Y-%m-%d %H:%M:%S').strftime('%m/%d/%Y %T'),
        'Sent Quantity': {
          'buy': pad0(txn['Executed Value']),
          'sell': pad0(txn['Executed Amount']),
        }.get(txn['Side'].lower()),
        'Sent Currency': {
          'buy': txn['Receiving'],
          'sell': txn['Sending'],
        }.get(txn['Side'].lower()),

        'Received Quantity': {
          'buy': pad0(txn['Executed Amount']),
          'sell': pad0(txn['Executed Value']),
        }.get(txn['Side'].lower()),
        'Received Currency': {
          'buy': txn['Sending'],
          'sell': txn['Receiving'],
        }.get(txn['Side'].lower()),

        'Fee Amount': txn['Fees'],
        'Fee Currency': txn['Fees Coin Type'],

        'Tag': ''  # ['gift', 'lost', 'mined', 'airdrop', 'payment', 'fork', 'donation', 'staked']
      }

      coinTracker.writerow(result)




