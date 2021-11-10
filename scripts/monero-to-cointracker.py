#!/usr/bin/env python3

import io, os, sys
import csv
from datetime import datetime

infile = sys.argv[1]
outfile = sys.argv[2]

# block,direction,unlocked,timestamp,amount,running balance,hash,payment ID,fee,destination,amount,index,note
COINTRACKER_COLUMNS = ['Date', 'Received Quantity', 'Received Currency', 'Sent Quantity', 'Sent Currency', 'Fee Amount', 'Fee Currency', 'Tag']

def pad0(value):
    return '%f' % round( abs( float(value) ), 7 )

with io.open(infile, 'r') as infd:
  csvReader = csv.DictReader(infd)
  with io.open(outfile, 'w') as ofd:
    coinTracker = csv.DictWriter(ofd, COINTRACKER_COLUMNS)
    coinTracker.writeheader()
    for txn in csvReader:
      # 2021-11-08 00:20:20
      result = {
        'Date': datetime.strptime(txn['timestamp'], '%Y-%m-%d %H:%M:%S').strftime('%m/%d/%Y %T'),
        'Received Quantity': '',
        'Received Currency': '',

        'Sent Quantity': '',
        'Sent Currency': '',

        'Fee Amount': txn['fee'],
        'Fee Currency': 'XMR',

        'Tag': ''  # ['gift', 'lost', 'mined', 'airdrop', 'payment', 'fork', 'donation', 'staked']
      }

      if txn['direction'] == 'in':
        result['Received Quantity'] = pad0(txn['amount'])
        result['Received Currency'] = 'XMR'
      else:
        result['Sent Quantity'] = pad0(txn['amount'])
        result['Sent Currency'] = 'XMR'

      coinTracker.writerow(result)

