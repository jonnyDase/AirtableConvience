class Company {
    constructor(name){
        this._name = name;
        this._ARR = {};
        this._MonthlyBurn = {};
        this._cashHand = {};
        this._mtl = {};
        this._id;
        this._fundType;
        this._old = [];
        this._irr = {};
        this._MOIC = {};
        this._cost = {};
        this._fmv = {}
    }

    setID(value){
        this._id = value;
    }

    setFund(value){
        this._fundType = value;
    }

    setOld(arr, arrGrow, stock, totalFunding, fmv, burn, irr, multiple){
        this._old = [arr, arrGrow, stock, totalFunding, fmv, burn, irr, multiple]
    }

    addCasHand(quarterYear, value){
        this._cashHand[quarterYear] = value;
    }

    addFairMarketValue(quarterYear, value){
        this._fmv[quarterYear] = value;
    }

    addCost(quarterYear, cost){
        this._cost[quarterYear] = cost;
    }

    addIRR(quarterYear, irr){
        this._irr[quarterYear] = irr;
    }

    addMOIC(quarterYear, moic){
        this._MOIC[quarterYear] = moic;
    }

    addARR(quarterYear, arr){
        this._ARR[quarterYear] = arr;
    }

    addMonthlyBurn(quarterYear, monthlyBurn){
        this._MonthlyBurn[quarterYear] = monthlyBurn;
    }

    addMTL(quarterYear, mtl){
        this._mtl[quarterYear] = mtl;
    }

    getRecentVal(list, filter){
        let last = this.getMostDate(list);

        if (!(last === undefined)){
            if(!(Math.abs(list[last]) < filter)){
                return list[last];
            }
            return null;
        }
        return null;
    }


    getMostDate(list){
        //Gathering all the date keys
        let quarters = Object.keys(list);
        if (quarters.length < 1){
            return undefined;
        }

        if (quarters[0].split(' ')[0] === undefined || quarters[0].split(' ')[1] === undefined){
            return undefined;
        }

        let index = 0;


        //finding the most recent quarter with cash values assigned
        for(let i = 0; i < quarters.length; i++){
            if(list[quarters[i]] > 10){
                index = i
            }
        }
        
        let year = Number(quarters[index].split(' ')[0]);
        let quarts = Number(quarters[index].split(' ')[1].replace('Q', ''));

        //finding most recent quarter with ARR value
        for(let i = 0; i < quarters.length; i++){
            if(year < Number(quarters[i].split(' ')[0]) && list[quarters[i]] > 10){
                year = Number(quarters[i].split(' ')[0]);
                quarts = Number(quarters[i].split(' ')[1].replace('Q', ''));
            } else if(year == Number(quarters[i].split(' ')[0]) && Number(quarters[i].split(' ')[1].replace('Q', '')) > quarts && list[quarters[i]] > 10){
                year = Number(quarters[i].split(' ')[0]);
                quarts = Number(quarters[i].split(' ')[1].replace('Q', ''));

            }
        }

        //string recomposition
        return String(year).concat(' Q'.concat(String(quarts)))
    }
    

    //For finding respective growths
    getLastDates(){
        //Gathering all the date keys
        let quarters = Object.keys(this._ARR);

        if (quarters[0].split(' ')[0] === undefined || quarters[0].split(' ')[1] === undefined){
            return ['pass', 'pass']
        }

        let index = 0;


        //finding the most recent quarter with cash values assigned
        for(let i = 0; i < quarters.length; i++){
            if(this._ARR[quarters[i]] > 10){
                index = i
            }
        }
        
        let year = Number(quarters[index].split(' ')[0]);
        let quarts = Number(quarters[index].split(' ')[1].replace('Q', ''));

        //finding most recent quarter with ARR value
        for(let i = 0; i < quarters.length; i++){
            if(year < Number(quarters[i].split(' ')[0]) && this._ARR[quarters[i]] > 10){
                year = Number(quarters[i].split(' ')[0]);
                quarts = Number(quarters[i].split(' ')[1].replace('Q', ''));
            } else if(year == Number(quarters[i].split(' ')[0]) && Number(quarters[i].split(' ')[1].replace('Q', '')) > quarts && this._ARR[quarters[i]] > 10){
                year = Number(quarters[i].split(' ')[0]);
                quarts = Number(quarters[i].split(' ')[1].replace('Q', ''));

            }
        }


        //setting up previous year
        let year_1 = year;
        let quarts_1 = quarts - 1;

        //Logic if most recent is Q1
        if(quarts == 1){
            year_1 = year - 1;
            quarts_1 = 4
        }

        //string recomposition
        return [String(year).concat(' Q'.concat(String(quarts))),
                String(year_1).concat(' Q'.concat(String(quarts_1)))]
    }

    //
    getARRGrowth(){
        let years = this.getLastDates();

        let newARR = this._ARR[years[0]];
        let oldARR = this._ARR[years[1]];

        if (!(newARR == null) && !(oldARR == null)){
            return newARR / oldARR - 1;
        } else {
            return null
        }
    }

    getARR(){
        let years = this.getLastDates();
        if (Math.abs(this._ARR[years[0]]) < 200){
            return null;
        }
        return this._ARR[years[0]];
    }

    getMothlyBurn(){
        let years = this.getLastDates();
        if (Math.abs(this._MonthlyBurn[years[0]]) < 200){
            return null;
        }
        return this._MonthlyBurn[years[0]];
    }

    getStock(){
        return null
    }


    toUpdateData() {
        return {
            "LastUpdate" : this.getLastDates()[0],
            "ARR" : Number(this.getARR()) || this._old[0],
            "ARR Growth" : this.getARRGrowth() || this._old[1],
            "Stock" : this.getStock() || this._old[2],
            "Total Funding" : this.getRecentVal(this._cost, 10000) || this._old[3],
            "FMV" : this.getRecentVal(this._fmv, 10000) || this._old[4],
            "Burn Rate" : this.getMothlyBurn() || this._old[5],
            "IRR" : this.getRecentVal(this._irr, .03) || this._old[6],
            "Multiple" : this.getRecentVal(this._MOIC, 1.01) || this._old[7],
            "CashHand" : this.getRecentVal(this._cashHand, 10000)
        };
    }
    

    print(){
        console.log('----------------');
        console.log(this._name);
        console.log(this._ARR);
    }
}







//----------------------------
let table = base.getTable("Portfolio Reporting");
let query = await table.selectRecordsAsync({fields: table.fields});

let companies = [];
let company_name = [];

for (let record of query.records) {

    //Gathering variables from Names
    let name = record.getCellValue("Name").split('-')[0];
    let quarter = record.getCellValue("Name").split('-')[1];

    let company = '';

    if (record.getCellValue("Company")){
        company = record.getCellValue("Company")[0].name;
    }
    

    //Gathering cell values
    let arr = record.getCellValue("ARR / Annualized Revenue");
    let monthlyBurn = record.getCellValue("Avg. Monthly Burn");
    let fundtype = record.getCellValue("Fund New");
    let cashHand = record.getCellValue("Cash on Hand");
    

    //Enters if only company has not previously been recorded
    if (!(company == null) && !company_name.includes(company)){

        //Noting that we have not added this company to our colleciton
        company_name.push(company);

        
        //Creating new company object
        let company1 = new Company(company);
        company1.addARR(quarter, arr);
        company1.addMonthlyBurn(quarter, monthlyBurn);
        company1.setFund(fundtype);
        company1.addCasHand(quarter, cashHand);

        //Adding this company to our list
        companies.push(company1);
    } else if (!(name == null)){

        //finding each companies matching index
        let index = 0;
        for(let i = 0; i < companies.length; i++){
            if (companies[i]._name == name){
                index = i;
            }
        }

        //Updating over out new index
        companies[index].addARR(quarter, arr);
        companies[index].addMonthlyBurn(quarter, monthlyBurn);
        companies[index].addCasHand(quarter, cashHand);
    }
}



//Fetch Data from Investments Folder
let tableIRR = base.getTable("IRR");
let queryIRR = await tableIRR.selectRecordsAsync({ fields: tableIRR.fields });


for (let record of queryIRR.records){
    let companyName = record.getCellValue('Company')
    if (companyName == null){
        //pass
    } else{
        let companyName = record.getCellValue('Company')[0].name;
        let irr = record.getCellValue('IRR');
        let moic = record.getCellValue('Multiple');
        let quarter = record.getCellValue('Quarter').name;
        let totalInvest = record.getCellValue('Cost');
        let fmv = record.getCellValue('Total Value');


        if(companyName !== undefined){
            let index = companies.findIndex(c => c._name === companyName);
            if (!(index === -1)){
                companies[index].addIRR(quarter, irr)
                companies[index].addMOIC(quarter, moic)
                companies[index].addCost(quarter, totalInvest)
                companies[index].addFairMarketValue(quarter, fmv)
            }
        }
    }
    
}

// Fetch data from the third table
let tableUpdate = base.getTable("Engage Scripted Table");
let queryUpdate = await tableUpdate.selectRecordsAsync({ fields: tableUpdate.fields });


//Send new record up
for (let record1 of queryUpdate.records) {
    if(record1.getCellValue('Company')){
        //Gathering all the different previous data
        let companyName = record1.getCellValue('Company')[0].name;
        let arr = record1.getCellValue('ARR');
        let arr_grow = record1.getCellValue('ARR Growth');
        let stock = record1.getCellValue('Stock');
        let totalFunding = record1.getCellValue('Total Funding');
        let fmv = record1.getCellValue('FMV');
        let burn = record1.getCellValue('Burn Rate');
        let irr = record1.getCellValue("IRR");
        let multiple = record1.getCellValue("Multiple");
    
        let index = companies.findIndex(c => c._name === companyName);
        if (index !== -1) {
            companies[index].setID(record1.id);
            companies[index].setOld(arr, arr_grow, stock, totalFunding, fmv, burn, irr, multiple)
        }
    }
}

//removing all companies without id
let company_final = []
for(let company of companies){
    if (company._id != undefined){
        company_final.push(company)
    }
}


// Prepare records for updating the "Engage Table"
let updates = company_final.map(company => {
    return {
        id: company._id,
        fields: company.toUpdateData()
    };
});

//Update
//await tableUpdate.updateRecordsAsync(updates)

// Update records in the "Jonathan's Table"
const batchSize = 50;


for (let i = 0; i < updates.length; i += batchSize) {
    await tableUpdate.updateRecordsAsync(updates.slice(i, i + batchSize));
}

console.log('Complete')
