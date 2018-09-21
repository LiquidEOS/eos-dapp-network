#include "./DappNetwork.hpp"

using namespace eosio;

void DappNetwork::onclear(const clear& act ) {
    require_auth( _self );
    auto it = dapps_table.begin();
    while (it != dapps_table.end()) {
        it = dapps_table.erase(it);
    }
}

void DappNetwork::onregdapp(const regdapp& sc ) {
    require_auth( sc.contract );
    auto existing = dapps_table.find(sc.contract);
    if(existing != dapps_table.end()){
        dapps_table.modify(existing, 0, [&]( auto& s ) {
            s.contract = sc.contract;
            s.metadata = sc.metadata;
        });
    }
    else dapps_table.emplace( sc.contract, [&]( auto& s ) {
            s.contract = sc.contract;
            s.metadata = sc.metadata;
         });
}

void DappNetwork::apply( account_name contract, account_name act ) {
  if( contract != _this_contract )
     return;
  auto& thiscontract = *this;
  if( name{act} == N(regdapp) ) 
      onregdapp( unpack_action_data<regdapp>() );
  else if (name{act} == N(clear))
      onclear(unpack_action_data<clear>());
}

extern "C" {
    [[noreturn]] void apply( uint64_t receiver, uint64_t code, uint64_t action ) {
        DappNetwork dn( receiver );
        dn.apply( code, action );
        eosio_exit(0);
    }
}
