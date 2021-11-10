#!/usr/bin/env python3

import io, os, sys
import csv
from datetime import datetime

infile = sys.argv[1]
outfile = sys.argv[2]

COINTRACKER_COLUMNS = ['Date', 'Received Quantity', 'Received Currency', 'Sent Quantity', 'Sent Currency', 'Fee Amount', 'Fee Currency', 'Tag']

def pad0(value):
    return str( round( float(value), 7 ) )

with io.open(infile, 'r') as infd:
  csvReader = csv.DictReader(infd)
  with io.open(outfile, 'w') as ofd:
    coinTracker = csv.DictWriter(ofd, COINTRACKER_COLUMNS)
    coinTracker.writeheader()
    for txn in csvReader:
      result = {
        'Date': datetime.strptime(txn['DateTime'], '%Y-%m-%d %H:%M:%S').strftime('%m/%d/%Y %T'),
        'Received Quantity': pad0(txn['Value_IN(ETH)']),
        'Received Currency': 'ETH',

        'Sent Quantity': pad0(txn['Value_OUT(ETH)']),
        'Sent Currency': 'ETH',

        'Fee Amount': pad0(txn['TxnFee(ETH)']),
        'Fee Currency': 'ETH',

        'Tag': ''
      }

      coinTracker.writerow(result)




