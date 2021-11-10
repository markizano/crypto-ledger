#!/usr/bin/env python3

import io, os, sys
import csv
from datetime import datetime

infile = sys.argv[1]
outfile = sys.argv[2]

# Cryptocurrency,Amount,Transaction Type,Confirmed At
COINTRACKER_COLUMNS = ['Date', 'Received Quantity', 'Received Currency', 'Sent Quantity', 'Sent Currency', 'Fee Amount', 'Fee Currency', 'Tag']

def pad0(value):
    return '%f' % round( abs( float(value) ), 7 )

with io.open(infile, 'r') as infd:
  csvReader = csv.DictReader(infd)
  with io.open(outfile, 'w') as ofd:
    coinTracker = csv.DictWriter(ofd, COINTRACKER_COLUMNS)
    coinTracker.writeheader()
    for txn in csvReader:
      # 2021-11-04 14:09:48
      result = {
        'Date': datetime.strptime(txn['Confirmed At'], '%Y-%m-%d %H:%M:%S').strftime('%m/%d/%Y %T'),
        'Received Quantity': '',
        'Received Currency': '',

        'Sent Quantity': '',
        'Sent Currency': '',

        'Fee Amount': '',
        'Fee Currency': '',

        'Tag': ''  # ['gift', 'lost', 'mined', 'airdrop', 'payment', 'fork', 'donation', 'staked']
      }

      if float(txn['Amount']) > 0:
        result['Received Quantity'] = pad0(txn['Amount'])
        result['Received Currency'] = txn['Cryptocurrency']
      else:
        result['Sent Quantity'] = pad0(txn['Amount'])
        result['Sent Currency'] = txn['Cryptocurrency']

      coinTracker.writerow(result)




