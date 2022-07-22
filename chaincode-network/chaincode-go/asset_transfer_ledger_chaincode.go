/*
 SPDX-License-Identifier: Apache-2.0
*/

/*
====CHAINCODE EXECUTION SAMPLES (CLI) ==================

==== Invoke assets ====
peer chaincode invoke -C myc1 -n asset_transfer -c '{"Args":["CreateAsset","asset1","blue","5","tom","35"]}'
peer chaincode invoke -C myc1 -n asset_transfer -c '{"Args":["CreateAsset","asset2","red","4","tom","50"]}'
peer chaincode invoke -C myc1 -n asset_transfer -c '{"Args":["CreateAsset","asset3","blue","6","tom","70"]}'
peer chaincode invoke -C myc1 -n asset_transfer -c '{"Args":["TransferAsset","asset2","jerry"]}'
peer chaincode invoke -C myc1 -n asset_transfer -c '{"Args":["TransferAssetByColor","blue","jerry"]}'
peer chaincode invoke -C myc1 -n asset_transfer -c '{"Args":["DeleteAsset","asset1"]}'

==== Query assets ====
peer chaincode query -C myc1 -n asset_transfer -c '{"Args":["ReadAsset","asset1"]}'
peer chaincode query -C myc1 -n asset_transfer -c '{"Args":["GetAssetsByRange","asset1","asset3"]}'
peer chaincode query -C myc1 -n asset_transfer -c '{"Args":["GetAssetHistory","asset1"]}'

Rich Query (Only supported if CouchDB is used as state database):
peer chaincode query -C myc1 -n asset_transfer -c '{"Args":["QueryAssetsByOwner","tom"]}'
peer chaincode query -C myc1 -n asset_transfer -c '{"Args":["QueryAssets","{\"selector\":{\"owner\":\"tom\"}}"]}'

Rich Query with Pagination (Only supported if CouchDB is used as state database):
peer chaincode query -C myc1 -n asset_transfer -c '{"Args":["QueryAssetsWithPagination","{\"selector\":{\"owner\":\"tom\"}}","3",""]}'

INDEXES TO SUPPORT COUCHDB RICH QUERIES

Indexes in CouchDB are required in order to make JSON queries efficient and are required for
any JSON query with a sort. Indexes may be packaged alongside
chaincode in a META-INF/statedb/couchdb/indexes directory. Each index must be defined in its own
text file with extension *.json with the index definition formatted in JSON following the
CouchDB index JSON syntax as documented at:
http://docs.couchdb.org/en/2.3.1/api/database/find.html#db-index

This asset transfer ledger example chaincode demonstrates a packaged
index which you can find in META-INF/statedb/couchdb/indexes/indexOwner.json.

If you have access to the your peer's CouchDB state database in a development environment,
you may want to iteratively test various indexes in support of your chaincode queries.  You
can use the CouchDB Fauxton interface or a command line curl utility to create and update
indexes. Then once you finalize an index, include the index definition alongside your
chaincode in the META-INF/statedb/couchdb/indexes directory, for packaging and deployment
to managed environments.

In the examples below you can find index definitions that support asset transfer ledger
chaincode queries, along with the syntax that you can use in development environments
to create the indexes in the CouchDB Fauxton interface or a curl command line utility.


Index for docType, owner.

Example curl command line to define index in the CouchDB channel_chaincode database
curl -i -X POST -H "Content-Type: application/json" -d "{\"index\":{\"fields\":[\"docType\",\"owner\"]},\"name\":\"indexOwner\",\"ddoc\":\"indexOwnerDoc\",\"type\":\"json\"}" http://hostname:port/myc1_assets/_index


Index for docType, owner, size (descending order).

Example curl command line to define index in the CouchDB channel_chaincode database:
curl -i -X POST -H "Content-Type: application/json" -d "{\"index\":{\"fields\":[{\"size\":\"desc\"},{\"docType\":\"desc\"},{\"owner\":\"desc\"}]},\"ddoc\":\"indexSizeSortDoc\", \"name\":\"indexSizeSortDesc\",\"type\":\"json\"}" http://hostname:port/myc1_assets/_index

Rich Query with index design doc and index name specified (Only supported if CouchDB is used as state database):
peer chaincode query -C myc1 -n asset_transfer -c '{"Args":["QueryAssets","{\"selector\":{\"docType\":\"asset\",\"owner\":\"tom\"}, \"use_index\":[\"_design/indexOwnerDoc\", \"indexOwner\"]}"]}'

Rich Query with index design doc specified only (Only supported if CouchDB is used as state database):
peer chaincode query -C myc1 -n asset_transfer -c '{"Args":["QueryAssets","{\"selector\":{\"docType\":{\"$eq\":\"asset\"},\"owner\":{\"$eq\":\"tom\"},\"size\":{\"$gt\":0}},\"fields\":[\"docType\",\"owner\",\"size\"],\"sort\":[{\"size\":\"desc\"}],\"use_index\":\"_design/indexSizeSortDoc\"}"]}'
*/

package main

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/golang/protobuf/ptypes"
	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

const index = "color~name"

// SimpleChaincode implements the fabric-contract-api-go programming model
type SimpleChaincode struct {
	contractapi.Contract
}

type Asset struct {
	DocType        string `json:"docType"` 
	Id             string `json:"id"`      //the field tags are needed to keep case from bouncing around
	From           string `json:"from"`
	FromId 	       string `json:"fromId"`
	To             string `json:"to"`
	ToId 	       string `json:"toId"`
	DueDate        time.Time `json:"dueDate"`
	Amount         int `json:"amount"`
	Name           string `json:"name"`
	Status         string    `json:"status"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

// HistoryQueryResult structure used for returning result of history query
type HistoryQueryResult struct {
	Record    *Asset    `json:"record"`
	TxId      string    `json:"txId"`
	Timestamp time.Time `json:"timestamp"`
	IsDelete  bool      `json:"isDelete"`
}

// PaginatedQueryResult structure used for returning paginated query results and metadata
type PaginatedQueryResult struct {
	Records             []*Asset `json:"records"`
	FetchedRecordsCount int32    `json:"fetchedRecordsCount"`
	Bookmark            string   `json:"bookmark"`
}

// CreateAsset initializes a new asset in the ledger
func (t *SimpleChaincode) CreateAsset(ctx contractapi.TransactionContextInterface, assetID, from string, fromId string, to string, toId string, dueDate time.Time, amount int, name string, status string, createdAt time.Time, updatedAt time.Time) error {
	exists, err := t.AssetExists(ctx, assetID)
	if err != nil {
		return fmt.Errorf("failed to get asset: %v", err)
	}
	if exists {
		return fmt.Errorf("asset already exists: %s", assetID)
	}

	asset := &Asset{
		DocType: "asset",
		Id: assetID,
		From: from,
		FromId: fromId,
		To: to,
		ToId: toId,
		DueDate: dueDate,
		Amount: amount,
		Name: name,
		Status: status,
		CreatedAt: createdAt,
		UpdatedAt: updatedAt,
	}
	assetBytes, err := json.Marshal(asset)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(assetID, assetBytes)
	if err != nil {
		return err
	}

	//  Create an index to enable color-based range queries, e.g. return all blue assets.
	//  An 'index' is a normal key-value entry in the ledger.
	//  The key is a composite key, with the elements that you want to range query on listed first.
	//  In our case, the composite key is based on indexName~color~name.
	//  This will enable very efficient state range queries based on composite keys matching indexName~color~*
	index, err := ctx.GetStub().CreateCompositeKey(index, []string{asset.Id})
	if err != nil {
		return err
	}
	//  Save index entry to world state. Only the key name is needed, no need to store a duplicate copy of the asset.
	//  Note - passing a 'nil' value will effectively delete the key from state, therefore we pass null character as value
	value := []byte{0x00}
	return ctx.GetStub().PutState(index, value)
}

// ReadAsset retrieves an asset from the ledger
func (t *SimpleChaincode) ReadAsset(ctx contractapi.TransactionContextInterface, assetID string) (*Asset, error) {
	assetBytes, err := ctx.GetStub().GetState(assetID)
	if err != nil {
		return nil, fmt.Errorf("failed to get asset %s: %v", assetID, err)
	}
	if assetBytes == nil {
		return nil, fmt.Errorf("asset %s does not exist", assetID)
	}

	var asset Asset
	err = json.Unmarshal(assetBytes, &asset)
	if err != nil {
		return nil, err
	}

	return &asset, nil
}

// DeleteAsset removes an asset key-value pair from the ledger
func (t *SimpleChaincode) DeleteAsset(ctx contractapi.TransactionContextInterface, assetID string) error {
	_, err := t.ReadAsset(ctx, assetID)
	if err != nil {
		return err
	}

	err = ctx.GetStub().DelState(assetID)
	if err != nil {
		return fmt.Errorf("failed to delete asset %s: %v", assetID, err)
	}

	// colorNameIndexKey, err := ctx.GetStub().CreateCompositeKey(index, []string{asset.Color, asset.id})
	// if err != nil {
	// 	return err
	// }

	// Delete index entry
	return nil
}

// constructQueryResponseFromIterator constructs a slice of assets from the resultsIterator
func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) ([]*Asset, error) {
	var assets []*Asset
	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var asset Asset
		err = json.Unmarshal(queryResult.Value, &asset)
		if err != nil {
			return nil, err
		}
		assets = append(assets, &asset)
	}

	return assets, nil
}

// GetAssetsByRange performs a range query based on the start and end keys provided.
// Read-only function results are not typically submitted to ordering. If the read-only
// results are submitted to ordering, or if the query is used in an update transaction
// and submitted to ordering, then the committing peers will re-execute to guarantee that
// result sets are stable between endorsement time and commit time. The transaction is
// invalidated by the committing peers if the result set has changed between endorsement
// time and commit time.
// Therefore, range queries are a safe option for performing update transactions based on query results.
func (t *SimpleChaincode) GetAssetsByRange(ctx contractapi.TransactionContextInterface, startKey, endKey string) ([]*Asset, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange(startKey, endKey)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	return constructQueryResponseFromIterator(resultsIterator)
}

// QueryAssets uses a query string to perform a query for assets.
// Query string matching state database syntax is passed in and executed as is.
// Supports ad hoc queries that can be defined at runtime by the client.
// If this is not desired, follow the QueryAssetsForOwner example for parameterized queries.
// Only available on state databases that support rich query (e.g. CouchDB)
// Example: Ad hoc rich query
func (t *SimpleChaincode) QueryAssets(ctx contractapi.TransactionContextInterface, queryString string) ([]*Asset, error) {
	return getQueryResultForQueryString(ctx, queryString)
}

// getQueryResultForQueryString executes the passed in query string.
// The result set is built and returned as a byte array containing the JSON results.
func getQueryResultForQueryString(ctx contractapi.TransactionContextInterface, queryString string) ([]*Asset, error) {
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	return constructQueryResponseFromIterator(resultsIterator)
}

// GetAssetsByRangeWithPagination performs a range query based on the start and end key,
// page size and a bookmark.
// The number of fetched records will be equal to or lesser than the page size.
// Paginated range queries are only valid for read only transactions.
// Example: Pagination with Range Query
func (t *SimpleChaincode) GetAssetsByRangeWithPagination(ctx contractapi.TransactionContextInterface, startKey string, endKey string, pageSize int, bookmark string) (*PaginatedQueryResult, error) {

	resultsIterator, responseMetadata, err := ctx.GetStub().GetStateByRangeWithPagination(startKey, endKey, int32(pageSize), bookmark)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	assets, err := constructQueryResponseFromIterator(resultsIterator)
	if err != nil {
		return nil, err
	}

	return &PaginatedQueryResult{
		Records:             assets,
		FetchedRecordsCount: responseMetadata.FetchedRecordsCount,
		Bookmark:            responseMetadata.Bookmark,
	}, nil
}

// QueryAssetsWithPagination uses a query string, page size and a bookmark to perform a query
// for assets. Query string matching state database syntax is passed in and executed as is.
// The number of fetched records would be equal to or lesser than the specified page size.
// Supports ad hoc queries that can be defined at runtime by the client.
// If this is not desired, follow the QueryAssetsForOwner example for parameterized queries.
// Only available on state databases that support rich query (e.g. CouchDB)
// Paginated queries are only valid for read only transactions.
// Example: Pagination with Ad hoc Rich Query
func (t *SimpleChaincode) QueryAssetsWithPagination(ctx contractapi.TransactionContextInterface, queryString string, pageSize int, bookmark string) (*PaginatedQueryResult, error) {

	return getQueryResultForQueryStringWithPagination(ctx, queryString, int32(pageSize), bookmark)
}

// getQueryResultForQueryStringWithPagination executes the passed in query string with
// pagination info. The result set is built and returned as a byte array containing the JSON results.
func getQueryResultForQueryStringWithPagination(ctx contractapi.TransactionContextInterface, queryString string, pageSize int32, bookmark string) (*PaginatedQueryResult, error) {

	resultsIterator, responseMetadata, err := ctx.GetStub().GetQueryResultWithPagination(queryString, pageSize, bookmark)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	assets, err := constructQueryResponseFromIterator(resultsIterator)
	if err != nil {
		return nil, err
	}

	return &PaginatedQueryResult{
		Records:             assets,
		FetchedRecordsCount: responseMetadata.FetchedRecordsCount,
		Bookmark:            responseMetadata.Bookmark,
	}, nil
}

// GetAssetHistory returns the chain of custody for an asset since issuance.
func (t *SimpleChaincode) GetAssetHistory(ctx contractapi.TransactionContextInterface, assetID string) ([]HistoryQueryResult, error) {
	log.Printf("GetAssetHistory: ID %v", assetID)

	resultsIterator, err := ctx.GetStub().GetHistoryForKey(assetID)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var records []HistoryQueryResult
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var asset Asset
		if len(response.Value) > 0 {
			err = json.Unmarshal(response.Value, &asset)
			if err != nil {
				return nil, err
			}
		} else {
			asset = Asset{
				Id: assetID,
			}
		}

		timestamp, err := ptypes.Timestamp(response.Timestamp)
		if err != nil {
			return nil, err
		}

		record := HistoryQueryResult{
			TxId:      response.TxId,
			Timestamp: timestamp,
			Record:    &asset,
			IsDelete:  response.IsDelete,
		}
		records = append(records, record)
	}

	return records, nil
}

// AssetExists returns true when asset with given ID exists in the ledger.
func (t *SimpleChaincode) AssetExists(ctx contractapi.TransactionContextInterface, assetID string) (bool, error) {
	assetBytes, err := ctx.GetStub().GetState(assetID)
	if err != nil {
		return false, fmt.Errorf("failed to read asset %s from world state. %v", assetID, err)
	}

	return assetBytes != nil, nil
}


func main() {
	chaincode, err := contractapi.NewChaincode(&SimpleChaincode{})
	if err != nil {
		log.Panicf("Error creating asset chaincode: %v", err)
	}

	if err := chaincode.Start(); err != nil {
		log.Panicf("Error starting asset chaincode: %v", err)
	}
}
