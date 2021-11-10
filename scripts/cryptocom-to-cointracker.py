#!/usr/bin/env python3

import io, os, sys
import csv
from datetime import datetime

infile = sys.argv[1]
outfile = sys.argv[2]

# Timestamp (UTC),Transaction Description,Currency,Amount,To Currency,To Amount,Native Currency,Native Amount,Native Amount (in USD),Transaction Kind
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
        'Date': datetime.strptime(txn['Timestamp (UTC)'], '%Y-%m-%d %H:%M:%S').strftime('%m/%d/%Y %T'),
        'Received Quantity': '',
        'Received Currency': '',

        'Sent Quantity': '',
        'Sent Currency': '',

        'Fee Amount': '',
        'Fee Currency': '',

        'Tag': ''  # ['gift', 'lost', 'mined', 'airdrop', 'payment', 'fork', 'donation', 'staked']
      }

      if txn['Transaction Kind'] == 'crypto_earn_interest_paid':
        result['Tag'] = 'payment'

      if txn['To Amount']:
        result['Received Quantity'] = pad0(txn['To Amount'])
        result['Received Currency'] = txn['To Currency']

      result['Sent Quantity'] = pad0(txn['Amount'])
      result['Sent Currency'] = txn['Currency']

      coinTracker.writerow(result)




