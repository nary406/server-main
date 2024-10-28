const { getDatabase, ref, query, orderByKey, startAt, get } = require('firebase/database');
const firebaseConfig = require('../config/firebaseConfig')
const { initializeApp } = require('firebase/app');
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

//@params No parameter
//@GET request
const getAlldevices = async (req, res, next) => {
    const mail = [
        "ftb001- Kollar", "stb001- Modaiyur", "nrmsv2f001- Ananthapuram",
        "rmsv3_001- Vengur", "rmsv3_002- Sithalingamadam", "rmsv32_001- Keelathalanur",
        "rmsv33_001- Perumukkal", "rmsv33_002- Agalur", "rmsv33_005- Saram",
        "rmsv34_002- Pootai", 'rmsv34_003-Siruvanthadu', "rmsv35_002- Puthirampattu", "rmsv35_006- Channamahgathihalli KA", "rmsv35_003- Vadalur", "rmsv35_007- Alagarai", "rmsv35_008- Kanniyapuram", "rmsv4_001- Melmalaiyanur",
        "rmsv4_002- Thandavankulam"
    ];

    try {
        console.time("Total Processing Time");

        const curr = new Date();
        const caldate = curr.toISOString().substring(0, 10);
        const uniValue = Math.floor(new Date(caldate).getTime() / 1000) - 19800;
        const currentTimestampVal = Math.floor(Date.now() / 1000);
        const timestamp24HoursAgo = currentTimestampVal - (24 * 60 * 60);

        const async = require('async');
        const batchSize = 4;

        async.mapLimit(mail, batchSize, async (email) => {
            const emailPrefix = email.split('-')[0].trim();
            const dataRef = ref(db, `data/${emailPrefix}/timestamp`);
            const queryRef = query(dataRef, orderByKey(), startAt("" + timestamp24HoursAgo));
            const snapshot = await get(queryRef);

            const records = [];
            snapshot.forEach((childSnapshot) => {
                const key = Number(childSnapshot.key);
                if (key > uniValue - (emailPrefix === "ftb001" ? 5400 : 0) && key < uniValue + 86400 - (emailPrefix === "ftb001" ? 5400 : 0)) {
                    records.push(childSnapshot);
                }
            });

            let p1Value = 0;
            let p1ValueTot = 0;
            let timeCount = 0;
            let prevTime = null;
            let flag = 0;

            records.forEach((record) => {
                const value = record.val();
                const timestamp = Number(record.key);
                const timeVal = (timestamp > 1663660000 && emailPrefix === "ftb001") ? 5400 - 230 : 0;
                const adjustedTimestamp = timestamp + timeVal + 19800;
                const dateForGraph = new Intl.DateTimeFormat('en-US', { hour: '2-digit', hour12: false }).format(new Date(adjustedTimestamp * 1000));
                const currentTime = Number(dateForGraph.split(":")[0]);

                const solarPower = value.solarVoltage * value.solarCurrent;

                if (!isNaN(solarPower)) {
                    if (prevTime === currentTime) {
                        timeCount++;
                        p1Value += solarPower;
                    } else {
                        if (flag === 1) {
                            p1ValueTot += p1Value / timeCount;
                        }
                        timeCount = 1;
                        p1Value = solarPower;
                        prevTime = currentTime;
                        flag = 1;
                    }
                }
            });

            if (flag === 1) {
                p1ValueTot += p1Value / timeCount;
            }

            p1ValueTot = (p1ValueTot / 1000).toFixed(2);

            const additionalDataRef = ref(db, `data/${emailPrefix}/latestValues`);
            const additionalData = await get(additionalDataRef);

            return {
                email,
                record: records.length > 0 ? true : false,
                p1ValueTot,
                additionalData: additionalData.val(),
            };
        }, (err, results) => {
            if (err) {
                console.error("Error:", err);
                res.status(500);
                return next(err);
            }

            const t = Math.ceil(Date.now() / 1000);
            const workingDevices = results.filter(result => result.record === true && Math.abs(result.additionalData.tValue - t) <= 1800);
            const notWorkingDevices = results.filter(result => result.record === false || Math.abs(result.additionalData.tValue - t) > 1800);
            res.status(200).json({ message: "Successful", data: { workingDevices, notWorkingDevices } });
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500);
        next(error);
    }
};

//@params selectedItem, Date
//@POST request

const getDate = async (req, res, next) => {
    try {
        const mail = req.body.selectedItem;
        const date = req.body.date;
        if (mail && date) {
            const curr = new Date(date);
           
            const dateOrg = curr.toISOString().substring(0, 10);


            const uniValue = Math.floor(new Date(dateOrg).getTime() / 1000) - 19800;
       
            const timestamp24HoursAgo = uniValue - (24 * 60 * 60);
         
            const dataRef = ref(db, `data/${mail}/timestamp`);
            const queryRef = query(dataRef, orderByKey(), startAt("" + timestamp24HoursAgo));
            const snapshots = await get(queryRef);
            const records = [];
            let k = 0;
            snapshots.forEach((childSnapshot) => {
                if (mail === "ftb001" && childSnapshot.key > 1663660000) {
                    k = 5400;
                }
                if (childSnapshot.key > uniValue  && childSnapshot.key < uniValue + 86400 ) {
                    records.push(childSnapshot);
                }
            });
        
            let axisValueCount = 0;
            const myArray1 = [];
            const myArray2 = [];
            const myArray3 = [];
            const myArray4 = [];
            const myArray5 = [];
            const myArray6 = [];
            const myArray7 = [];
            const myArray8 = [];
            const myArray9 = [];
            const myArray10 = [];
            const myArray11 = [];
            const myArray12 = [];
            let iterVal = 0;

            const dataCharts = Object.entries(records).map(([key, value]) => {
                const timestamp = Number(value.key);
                let timeVal = 0;
                if (timestamp > 1663660000 && mail === "ftb001") {
                    timeVal = 5400 ;
                }
                const t = new Date((timestamp  ) * 1000);

                const dateForGraph = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit',timeZone:"Asia/Kolkata", hour12: false }).format(t);
                let dateForGraphVal = "";
                if (dateForGraph.split(':')[0] === 24) {
                    dateForGraphVal = "00:" + dateForGraph.split(':')[1];
                }
                else {
                    dateForGraphVal = dateForGraph;
                }

                axisValueCount++;

              
    if (axisValueCount > 10) {
        // Apply isNaN to prevent NaN values in arrays
        myArray1.push(Math.abs(value.val().solarVoltage) || 0);
        myArray2.push(Math.abs(value.val().solarCurrent) || 0);
        myArray3.push(Math.abs(value.val().solarVoltage * value.val().solarCurrent) || 0);

        myArray4.push(Math.abs(value.val().inverterVoltage) || 0);
        myArray5.push(Math.abs(value.val().inverterCurrent) || 0);
        myArray6.push(Math.abs(value.val().inverterVoltage * value.val().inverterCurrent) || 0);

        myArray7.push(Math.abs(value.val().gridVoltage) || 0);
        myArray8.push(Math.abs(value.val().gridCurrent) || 0);
        myArray9.push(Math.abs(value.val().gridVoltage * value.val().gridCurrent) || 0);

        myArray10.push(Math.abs(value.val().batteryVoltage) || 0);
        myArray11.push(Math.abs(value.val().batteryCurrent) || 0);
        myArray12.push(Math.abs(value.val().batteryVoltage * value.val().batteryCurrent) || 0);

                    let sum1 = 0;
                    let sum2 = 0;
                    let sum3 = 0;
                    let sum4 = 0;
                    let sum5 = 0;
                    let sum6 = 0;
                    let sum7 = 0;
                    let sum8 = 0;
                    let sum9 = 0;
                    let sum10 = 0;
                    let sum11 = 0;
                    let sum12 = 0;

                    for (let i = iterVal; i < iterVal + 10; i++) {
                        sum1 += myArray1[i]||0;
                        sum2 += myArray2[i];
                        sum3 += myArray3[i];
                        sum4 += myArray4[i];
                        sum5 += myArray5[i];
                        sum6 += myArray6[i];
                        sum7 += myArray7[i];
                        sum8 += myArray8[i];
                        sum9 += myArray9[i];
                        sum10 += myArray10[i];
                        sum11 += myArray11[i];
                        sum12 += myArray12[i];
                    }
                    iterVal++;
                }

                return {
                    ccAxisXValue: dateForGraphVal,
                    SolarVoltage: (isNaN(value?.val()?.solarVoltage) ? 0 : Math.abs(value?.val()?.solarVoltage)).toFixed(2),
                    SolarCurrent: (isNaN(value?.val()?.solarCurrent) ? 0 : Math.abs(value?.val()?.solarCurrent)).toFixed(2),
                    SolarPower: (isNaN(value?.val()?.solarVoltage * value?.val()?.solarCurrent) ? 0 : Math.abs(value?.val()?.solarVoltage * value?.val()?.solarCurrent)).toFixed(2),
            
                    InverterVoltage: (isNaN(value?.val()?.inverterVoltage) ? 0 : Math.abs(value?.val()?.inverterVoltage)).toFixed(2),
                    InverterCurrent: (isNaN(value?.val()?.inverterCurrent) ? 0 : Math.abs(value?.val()?.inverterCurrent)).toFixed(2),
                    InverterPower: (isNaN(value?.val()?.inverterVoltage * value?.val()?.inverterCurrent) ? 0 : Math.abs(value?.val()?.inverterVoltage * value?.val()?.inverterCurrent)).toFixed(2),
            
                    GridVoltage: (isNaN(value?.val()?.gridVoltage) ? 0 : Math.abs(value?.val()?.gridVoltage)).toFixed(2),
                    GridCurrent: (isNaN(value?.val()?.gridCurrent) ? 0 : Math.abs(value?.val()?.gridCurrent)).toFixed(2),
                    GridPower: (isNaN(value?.val()?.gridVoltage * value?.val()?.gridCurrent) ? 0 : Math.abs(value?.val()?.gridVoltage * value?.val()?.gridCurrent)).toFixed(2),
            
                    BatteryVoltage: (isNaN(value?.val()?.batteryVoltage) ? 0 : Math.abs(value?.val()?.batteryVoltage)).toFixed(2),
                    BatteryCurrent: (isNaN(value?.val()?.batteryCurrent) ? 0 : Math.abs(value?.val()?.batteryCurrent)),
                    BatteryPower: (isNaN(value?.val()?.batteryVoltage * value?.val()?.batteryCurrent) ? 0 : Math.abs(value?.val()?.batteryVoltage * value?.val()?.batteryCurrent)).toFixed(2)
                };
            });

            let timeDelta
            if (mail === "rmsv35_003") {
                timeDelta = 1;
                console.log("vadalur");
            } else if (mail.startsWith("rmsv35")) {
                timeDelta = 5; // Set for other devices starting with "rmsv35"
            } else {
                timeDelta = 1; // Default for all other devices
            }
            
            res.status(200).json({ message: 'Data processed successfully', data: {dataCharts, timeDelta,  } });
        } else {
            res.status(400);
            next({ message: "Either values are empty" });
        }
    } catch (err) {
        res.status(500);
        next(err);
    }
};


//@params selectedItem
//@POST request
const postDB = async (req, res, next) => {
        try {
            // 1. Fetch the data
            // 2. Solar volatge and Solar current for an hour form the firebase
            // 3. Power Value V*I (each and every hr)
            // 4. Average the Power value for that hr
            // 5. W to Kw
    
            const mail = req.body.selectedItem;
            if (mail) {
                const databaseRef = ref(db, `data/${mail}/latestValues`);
                const snapshot = await get(databaseRef);
                var curr = new Date();
                
                const dateOrg = curr.toISOString().substring(0, 10);
                const caldate = dateOrg;
                const uniValue = parseInt((new Date(caldate) / 1000).toFixed(0))-19800 ;
   
                let currentTimestampVal = Math.floor(Date.now() / 1000);
                let timestamp24HoursAgo = currentTimestampVal - (24 * 60 * 60);
                const dataRef = ref(db, `data/${mail}/timestamp`);
                const queryRef = query(dataRef, orderByKey(), startAt("" + timestamp24HoursAgo));
                const snapshots = await get(queryRef);
    
                const records = [];
                let k = 0;
                snapshots.forEach((childSnapshot) => {
                    if (mail === "ftb001" && childSnapshot.key > 1663660000) {
                        k = 5400;
                    }
                    if (childSnapshot.key > uniValue  && childSnapshot.key < uniValue + 86400 ) {
                        records.push(childSnapshot);
                    }
                });
    
                let p1Value = 0;
                let p2Value = 0;
                let p3Value = 0;
                let p1ValueTot = 0;
                let p2ValueTot = 0;
                let p3ValueTot = 0;
                let timeCount = 0;
                let prevTime = null;
    
                const p1Values = [];
                const p2Values = [];
                const p3Values = [];
    const timeValues = [];
                
  
    let timeInterval

    if (mail === "rmsv35_003") {
        timeInterval = 1;
        console.log("vadalur");
    } else if (mail.startsWith("rmsv35")) {
        timeInterval = 5; // Set for other devices starting with "rmsv35"
    } else {
        timeInterval = 1; // Default for all other devices
    }
    
                const dataCharts = records.map((childSnapshot) => {
                    const value = childSnapshot.val();
                    const timestamp = Number(childSnapshot.key);
                    let timeVal = 0;
                    if (timestamp > 1663660000 && mail === "ftb001") {
                        timeVal = 5400 ;
                    }
   
                    const adjustedTimestamp = timestamp  ;
                     const dateForGraph = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit',timeZone:"Asia/Kolkata", hour12: false }).format(new Date(adjustedTimestamp * 1000));
               
    
                    const currentTime = parseInt(dateForGraph.split(':')[0], 10);

 
    
                    const solarPower = ((value.solarVoltage * value.solarCurrent)*timeInterval*60)/(1000*3600);
                    const gridPower = ((value.gridVoltage * value.gridCurrent)*timeInterval*60)/(1000*3600);
                    const inverterPower =((value.inverterVoltage * value.inverterCurrent)*timeInterval*60)/(1000*3600);
    
                    if (!isNaN(solarPower) && !isNaN(gridPower) && !isNaN(inverterPower)) {
                        if (prevTime === currentTime) {
                            timeCount++;
                            p1Value += solarPower;
                            p2Value += gridPower;
                            p3Value += inverterPower;
                        } else {
                            if (timeCount > 0) {
                                p1ValueTot += p1Value ;
                                p2ValueTot += p2Value ;
                                p3ValueTot += p3Value ;
                            }
                            timeCount = 1;
                            p1Value = solarPower;
                            p2Value = gridPower;
                            p3Value = inverterPower;
                            prevTime = currentTime;
                        }
     // previous developer code
    //                     p1Values.push(solarPower);
    //                     p2Values.push(gridPower);
    //                     p3Values.push(inverterPower);
    //                     timeValues.push(dateForGraph);
                    }

    
                    return {
                        ccAxisXValue: dateForGraph,
                        SolarVoltage: Math.floor(Math.abs(value.solarVoltage)),
                        SolarCurrent: Math.abs(value.solarCurrent).toFixed(2),
                        SolarPower: Math.floor(Math.abs(value.solarVoltage * value.solarCurrent)),
    
                        InverterVoltage: Math.floor(Math.abs(value.inverterVoltage)),
                        InverterCurrent: Math.abs(value.inverterCurrent).toFixed(2),
                        InverterPower: Math.floor(Math.abs(value.inverterVoltage * value.inverterCurrent)),
    
                        GridVoltage: Math.floor(Math.abs(value.gridVoltage)),
                        GridCurrent: Math.abs(value.gridCurrent).toFixed(2),
                        GridPower: Math.floor(Math.abs(value.gridVoltage * value.gridCurrent)),
    
                        BatteryVoltage: Math.floor(Math.abs(value.batteryVoltage)),
                        BatteryCurrent: Math.abs(value.batteryCurrent).toFixed(2),
                        BatteryPower: Math.floor(Math.abs(value.batteryVoltage * value.batteryCurrent)),
                    };
                });
    
                if (timeCount > 0) {
                    p1ValueTot += p1Value;
                    p2ValueTot += p2Value ;
                    p3ValueTot += p3Value ;
                }
  
                p1ValueTot = p1ValueTot .toFixed(2); // Solar Generation
                p2ValueTot = p2ValueTot .toFixed(2); // Grid Energy
                p3ValueTot = p3ValueTot .toFixed(2); // Load Consumption
   
                res.status(200).json({
                    message: 'Data processed successfully',
                    data: {
                        caldate,
                        snapshot,
                        dataCharts,
                        p1ValueTot,
                        p2ValueTot,
                        p3ValueTot,
                    }
                });
            } else {
                res.status(400);
                next({ message: "value is empty" });
            }
        } catch (error) {
            res.status(500);
            next(error);
        }
    }

const getValDate = async (req, res, next) => {
    try{
        const mail = req.body.selectedItem;
        const date = req.body.date;
        if(mail && date){
            const additionalDataRef = ref(db, `data/${mail}/latestValues`);
            const additionalData = await get(additionalDataRef);
            
            res.status(200).json({ 
                message: 'Data processed successfully', 
                data: {
                    SolarGeneration: Math.abs(additionalData.val().solarenergy),
                    GridEnergy: Math.abs(additionalData.val().gridenergy),
                    LoadConsumption: Math.abs(additionalData.val().loadconsumption),
                } 
            });
        }
        else{
            res.status(400);
            next({ message: "value is empty" });
        }
    }
    catch(err){
        console.error(err);
    }
}

module.exports = { getAlldevices, getDate, postDB, getValDate };