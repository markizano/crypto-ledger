
# Crypto Ledger

## Purpose
I created this project because I am growing weary of keeping track of all my coins in all these
places. I want a simple interface to tell me how much of what is held where and I don't care if
you are an exchange, dApp, wallet address or which blockchain you are on.

I want a single pane of glass that lets me see my net worth in crypto.
I don't want to have to submit KYC in order to view this information either since it should be private
and local to me.

## Concept

### Operation
I select a blockchain/coin, I enter my address.
The interface will then populate with all of the transactions and the price of the transaction at
the timestamp it took place.

### View/Design
I can see my current wealth as well across all transactions.
I can see graphs of my portfolio and what is allocated where.
When I make trades or move crypto from wallet to wallet or exchange ERC20/BEP20 tokens, they are automatically
detected and the interface updates with the latest info, polling every few seconds/minutes to ensure
records are kept up to date.

## Security
This interface will run local to the machine of the user that wants to keep track of this information.
Results can be exported to CSV for integrations into other tools.
Pricing, transaction information and such may be queried from other configurable sources via the user.

## Integrations
To Developers: You can integrate with exchanges and such to collect information from them. I just don't
want this interface being locked into a single entity for all information.
Ideally, with each integration, it's added into an averaging mechanism that averages/normalizes the
price among all the configurable exchanges (for price information) and summarize an average of said
data.


