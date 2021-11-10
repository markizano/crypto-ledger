#!/usr/bin/env python3

import io, os, sys
import csv
from datetime import datetime

infile = sys.argv[1]
outfile = sys.argv[2]

#TXID', 'TXURL', 'DATE', 'TYPE', 'FROMPORTFOLIO', 'TOPORTFOLIO', 'COINAMOUNT', 'FEE', 'BALANCE', 'EXCHANGE', 'PERSONALNOTE

COINTRACKER_COLUMNS = ['Date', 'Received Quantity', 'Received Currency', 'Sent Quantity', 'Sent Currency', 'Fee Amount', 'Fee Currency', 'Tag']

with io.open(infile, 'r') as infd:
  csvReader = csv.DictReader(infd)
  with io.open(outfile, 'w') as ofd:
    coinTracker = csv.DictWriter(ofd, COINTRACKER_COLUMNS)
    coinTracker.writeheader()
    for txn in csvReader:
      result = {
        'Date': '',
        'Received Quantity': '',
        'Received Currency': '',
        'Sent Quantity': '',
        'Fee Amount': '',
        'Fee Currency': '',
        'Tag': ''
      }
      #>>> datetime.datetime.strptime(x['DATE'].split('(')[0].strip(), '%a %b %d %Y %H:%M:%S GMT%z')
      dtStr = txn['DATE'].split('(')[0].strip()
      dt = datetime.strptime(dtStr, '%a %b %d %Y %H:%M:%S GMT%z')
      result['Date'] = dt.strftime('%m/%d/%Y %T')
      qty, coin = txn['COINAMOUNT'].split(' ')
      if txn['FEE']:
        result['Fee Amount'] = txn['FEE'].split(' ')[0]
        result['Fee Currency'] = coin
      if txn['TYPE'] == 'deposit':
        result['Received Quantity'] = qty
        result['Received Currency'] = coin
      else:
        result['Sent Quantity'] = qty
        result['Sent Currency'] = coin
      coinTracker.writerow(result)




