# eos-dapp-network

## Viewer

https://jungle.dappnetwork.liquideos.com/

https://dappnetwork.liquideos.com/

## Registering your DApp
### IPFS
```
METADATA="{\\\"enabled\\\": true, \\\"ipfshash\\\":\\\"YourIPFSHash\\\", \\\"name\\\": \\\"App Display Name\\\"}"
cleos push action dappnetwork1 regdapp "[ \"yourcontract\", \"$METADATA\"]" -p yourcontract
```
### HTTPS
```
METADATA="{\\\"enabled\\\": true, \\\"appurl\\\":\\\"https://yourappdomain.com\\\", \\\"name\\\": \\\"App Display Name\\\"}"
cleos push action dappnetwork1 regdapp "[ \"yourcontract\", \"$METADATA\"]" -p yourcontract
```

