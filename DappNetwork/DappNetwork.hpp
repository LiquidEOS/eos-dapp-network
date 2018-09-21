#pragma once

#include <eosiolib/eosio.hpp>
#include <eosiolib/transaction.hpp>
#include <eosiolib/types.hpp>
#include <eosiolib/asset.hpp>
#include <eosiolib/currency.hpp>
#include <eosio.system/eosio.system.hpp>

using namespace eosio;

class DappNetwork : public eosio::contract {
   public:
      DappNetwork( account_name self )
      :contract(self),
       _this_contract(self),
       dapps_table( self, self )
      {}
      void apply( account_name contract, account_name act );

      // @abi table
      struct dapp
      {
          account_name contract;
          string       metadata;
          uint64_t primary_key() const { return contract; }
          EOSLIB_SERIALIZE( dapp, (contract)(metadata) )
      };
      
      
      // @abi action
      struct clear
      {
          
      };
      
      // @abi action
      struct regdapp
      {
          account_name contract;
          string       metadata;
          EOSLIB_SERIALIZE( regdapp, (contract)(metadata) )
      };
   private:
      account_name      _this_contract;
      void onclear(const clear& act );
      void onregdapp(const regdapp& sc );
      multi_index<N(dapp), dapp> dapps_table;  
};