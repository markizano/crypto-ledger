#!/usr/bin/env python3

import io, os, sys
import csv
from datetime import datetime

infile = sys.argv[1]
outfile = sys.argv[2]

# "Confirmed","Date","Type","Label","Address","Amount (RVN)","Asset","ID"
COINTRACKER_COLUMNS = ['Date', 'Received Quantity', 'Received Currency', 'Sent Quantity', 'Sent Currency', 'Fee Amount', 'Fee Currency', 'Tag']

def pad0(value):
    return '%f' % round( abs( float(value) ), 7 )

with io.open(infile, 'r') as infd:
  csvReader = csv.DictReader(infd)
  with io.open(outfile, 'w') as ofd:
    coinTracker = csv.DictWriter(ofd, COINTRACKER_COLUMNS)
    coinTracker.writeheader()
    for txn in csvReader:
      # 2021-10-25T08:36:36
      result = {
        'Date': datetime.strptime(txn['Date'], '%Y-%m-%dT%H:%M:%S').strftime('%m/%d/%Y %T'),
        'Received Quantity': '',
        'Received Currency': '',

        'Sent Quantity': '',
        'Sent Currency': '',

        'Fee Amount': '',
        'Fee Currency': '',

        'Tag': ''
      }
      if txn['Type'] == 'Received with':
        result['Received Currency'] = 'RVN'
        result['Received Quantity'] = txn['Amount (RVN)']
      if txn['Type'] == 'Sent to':
        result['Sent Currency'] = 'RVN'
        result['Sent Quantity'] = txn['Amount (RVN)']

      coinTracker.writerow(result)




