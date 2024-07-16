/// <reference types="../@types/jquery" />



// error in destroy the charts that already exists, if any item clicked after using inputs to filter the data, there is an error I cannot find any solution for it. if you know how to fix, please send the answer to he email.
let rowData = document.getElementById('rowData');

// script.js
$(document).ready(function () {


    class getData {
        async fetchData(url) {
            // const response = await fetch(`http://localhost:3000/`);
            const response = await fetch(`${url}`);
            let result = await response.json();
            // console.log(result.transactions);
            return result;
        }
        async fetchTransactionsById(url, id) {
            // const response = await fetch(`http://localhost:3000/`);
            const response = await fetch(`${url}`);
            let result = await response.json();
            // console.log(result);
            
            let ids =[];
            for (let i = 0; i < result.customers.length; i++) {
                ids.push(result.customers[i].id)
            }
            let dates =[];
            let amounts = [];
            // console.log(result.transactions.length);
           for (let i = 0; i < result.transactions.length; i++) {
                // console.log(result.transactions[i].customer_id);
                // console.log();
               
                // console.log(ids);
                if (result.transactions[i].customer_id == id) {
                   
                    // return ;
                    dates.push(result.transactions[i].date);
                    amounts.push(result.transactions[i].amount);

                }
           }
        //    console.log(ids);
           return {
            ids : ids,
            amounts: amounts,
            dates: dates
           }
            // return result.transactions;
        }
       
        

    }


    class displayData extends getData {
        constructor() {
            super();
            this.chartHandler = new CustomerChart();
        }
       

        displayObjects(group) {

            let allTransactions = group.transactions;
            let allCustomers = group.customers;
            let totalAmounts = {};

            // Initialize totalAmounts with customer IDs and names
            for (const customer of allCustomers) {
                totalAmounts[customer.id] = {
                    customer_id: customer.id,
                    customer_name: customer.name,
                    total_amount: 0
                };
            }

            // Sum up the transaction amounts for each customer
            for (const transaction of allTransactions) {
                if (totalAmounts[transaction.customer_id]) {
                    totalAmounts[transaction.customer_id].total_amount += transaction.amount;
                }
            }



            // Convert totalAmounts to an array if needed
            let result = Object.values(totalAmounts);



            let tableBox = '';
            for (const customer of result) {
                tableBox += `    <tr class="rowItem">
                    <td  data_id='${customer["customer_id"]}' class="customerName text-capitalize">${customer["customer_name"]}</td>
                    <td class="customerAmount">
                    ${customer["total_amount"]}
                    </td>
                </tr>

                `;
            }

            rowData.innerHTML = tableBox;
            this.showCustomerChart();
            return result;
        }

        showCustomerChart() {
           
            $('.customerName').on('click', async (e) => {
                let customerId = $(e.target).attr('data_id');
                let theName = $(e.target).text();
            //    console.log(customerId);
                // get customer transaction dates, and amounts per day
                let x = await this.fetchTransactionsById('./data/db.json', customerId);
                // console.log(x);
                // this.chartHandler.destroyChartInstance("1");
                this.chartHandler.showPerDate(x, theName);
               
                // send to chart (id, name, dates, amounts)

            })
        }
     
    }


    class Filters extends displayData {


        constructor(final,dataHandler , chartHandler) {
            super();
            this.final = final;
            this.filteredData = []; // Store filtered data here
            this.nameFilter = ''; // global
            this.amountFilter = 0; // global
            this.dataHandler = dataHandler; 
            this.chartHandler = chartHandler;
            this.initializeFilters(); // called when initial
        }


        initializeFilters() {
          
            $('#customerFilter').on('input', (e) => {
                // this.nameFilter = e.currentTarget.value.toLowerCase(); //updated on input to be reused i apply filter

                // let y = this.applyFilters();
                // // how charthandler here? look at this at initialization event
                // // this.filterHandler = null;
                // // this.filterHandler = new Filters(final); 
                // //this.filterHandler.chartHandler = this.chartHandler;
                // this.chartHandler.showChart(y);
               
                this.nameFilter = e.currentTarget.value.toLowerCase();
            let filteredData = this.applyFilters();
     
            this.chartHandler.showChart(filteredData);




            });

            $('#amountFilter').on('input', (e) => {
               
                let inputValue = e.currentTarget.value.trim();
                this.amountFilter = parseFloat(inputValue);
                if (isNaN(this.amountFilter)) {
                    this.amountFilter = 0; // Default to 0 if input is not a valid number
                }
                let filteredData = this.applyFilters();
                this.chartHandler.showChart(filteredData);

                // this.amountFilter = parseFloat(e.currentTarget.value);
                // if (isNaN(this.amountFilter)) {
                //     this.amountFilter = 0; // Ensure amount is a number
                // }

                // let y = this.applyFilters();
                // this.chartHandler.showChart(y);



            });


        }


        applyFilters() {
           
            // console.log(this.final);
            let tableBox = '';
            let matchFound = false;
            this.filteredData = [];

            for (let i = 0; i < this.final.length; i++) {
                let customer = this.final[i];
                let matchesName = customer.customer_name.toLowerCase().startsWith(this.nameFilter); // returns true or false
                let matchesAmount = customer.total_amount >= this.amountFilter; // returns true or false
                // check if both matches true or false, to apply the two filters together
                if (matchesName && matchesAmount) {
                    tableBox += `
                        <tr class="rowItem">
                            <td data_id='${customer.customer_id}' class="customerName text-capitalize">${customer.customer_name}</td>
                            <td class="customerAmount">
                                ${customer.total_amount}
                            </td>
                        </tr>`;
                    matchFound = true;
                    // Store filtered customer object
                    this.filteredData.push(customer);
                }

            }
                // if not found, nothing to display, why if? why not else? need to ask again, otherwise it will never work
            if (!matchFound) {
                tableBox = '';
            }
            // push the filtered data   into the table
            rowData.innerHTML = tableBox;
            this.showCustomerChart();
            $('#ChartForCustomer')
 // needed to call it here to add clicks for the displayed data
 
            let x = this.filteredData
           
            return x;
        }
      
   
    }


    class assignEvents {
        constructor() {
            this.dataHandler = new getData();
            this.displayHandler = new displayData();
            this.chartHandler = new CustomerChart();
            this.filterHandler = null;
        };

       




        async initialize() {
            let result = await this.dataHandler.fetchData('./data/db.json');
            
            // let transactions = this.dataHandler.fetchData('http://localhost:3000', 'transactions');
            let final = this.displayHandler.displayObjects(result);
           
            this.filterHandler = new Filters(final,this.dataHandler, this.chartHandler); // Initialize Filters class with final data
            // I assume i added this to make filters inherit from chart class
            this.filterHandler.chartHandler = this.chartHandler;
            // Initialize event listeners for filtering
            // let filteredData = this.filterHandler.initializeFilters();

            // Initialize event listeners for filtering
            this.filterHandler.initializeFilters();

            // this.displayHandler.showCustomerChart();
         
           

            // Example of accessing filtered data after applying filters


            this.chartHandler.showChart(final);
           





        }
    }














    class CustomerChart {
        constructor() {
            this.chartInstances = {}; // Store chart instances by their canvas ID
        }
        destroyAllCharts() {
            for (let chartId in this.chartInstances) {
                if (this.chartInstances.hasOwnProperty(chartId)) {
                    this.chartInstances[chartId].destroy();
                    delete this.chartInstances[chartId];
                }
            }
        }
    
        destroyChartInstance(chartId) {
            // console.log(chartId);
            if (this.chartInstances[chartId]) {
                // this.chartInstances[chartId].destroy();
                delete this.chartInstances[chartId];
            }
        }
        showChart(final) {

      
        this.destroyAllCharts();

            let names = []
            let amounts = []
            for (let i = 0; i < final.length; i++) {
                names.push(final[i].customer_name);
                amounts.push(final[i].total_amount);
            }
            const ctx = document.getElementById("myChart").getContext('2d');

            const data = {
                // labels are the days
                labels: names,
                datasets: [{
                    label: 'Transactions',
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: '#14A800',
                    // borderWidth: 0.2,
                    // data for amounts
                    data: amounts,
                    fill: 'origin',
                    barThickness: 'flex', // Flexible bar thickness
                    maxBarThickness: 50,  // Maximum bar thickness in pixels
                }]
            };

            const config = {
                type: 'bar',
                data: data,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: false,
                            text: 'Chart.js Line Boundaries'
                        }
                    },

                    onHover: function (event, elements) {
                        event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
                    }
                }
            };


           // Create a new chart instance and store it
      
           this.chartInstances['myChart'] = new Chart(ctx, config);
        }

        showPerDate(customerData, theName) {
            for (var i = 0; i < customerData.ids.length; i++) {
                // console.log(customerData.ids[i]);
                this.destroyChartInstance(customerData.ids[i])
            }
            
       // Destroy all existing chart instances before creating a new one
       this.destroyAllCharts();
           
            const ctx = document.getElementById('ChartForCustomer').getContext('2d');

            const data = {
                // labels are the days
                labels: customerData.dates,
                datasets: [{
                    label: 'Transactions',
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: '#14A800',
                    // borderWidth: 0.2,
                    // data for amounts
                    data: customerData.amounts,
                    fill: 'origin',
                    barThickness: 'flex', // Flexible bar thickness
                    maxBarThickness: 50,  // Maximum bar thickness in pixels
                }]
            };

            const config = {
                type: 'bar',
                data: data,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: theName
                        }
                    },

                    onHover: function (event, elements) {
                        event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
                    }
                }
            };


           // Create a new chart instance and store it
           this.chartInstances['ChartForCustomer'] = new Chart(ctx, config);
          
        }
        
    }

    const events = new assignEvents();
    events.initialize();


});





