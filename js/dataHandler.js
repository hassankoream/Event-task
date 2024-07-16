class getData {
    async fetchData(url) {
        const response = await fetch(`${url}`);
        let result = await response.json();
        return result;
    }

    async fetchTransactionsById(url, id) {
        const response = await fetch(`${url}`);
        let result = await response.json();

        let ids = [];
        let dates = [];
        let amounts = [];

        // console.log("Result:", result); // Log the entire result object to inspect its structure

        for (let i = 0; i < result.transactions.length; i++) {
            if (result.transactions[i].customer_id == id) {
                // console.log("Found transaction:", result.transactions[i]);
                dates.push(result.transactions[i].date);
                amounts.push(result.transactions[i].amount);
            }
        }

        return {
            ids: ids, // Make sure to populate ids if needed
            amounts: amounts,
            dates: dates
        };
    }
}

