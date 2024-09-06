const { parse } = require('csv-parse');
const fs = require('fs');
const path= require('path')
// const { pipeline } = require('stream');

// // Paths
// const sourcePath = __dirname + '/kepler_data.csv';
// const destinationPath = __dirname + '/kepler_data_clean.json';

// // Create read and write streams
// const stream = fs.createReadStream(sourcePath, { encoding: 'utf8' });
// const destination = fs.createWriteStream(destinationPath);

// // Write the opening array bracket
// destination.write('[');

// let isFirstLine = true;

// // Parse the CSV and pipe data to the destination
// stream.pipe(parse({
//     comment: '#',
//     columns: true,
// }))
// .on('data', (data) => {
//     if (!isFirstLine) {
//         destination.write(',\n');
//     }
//     destination.write(JSON.stringify(data));
//     isFirstLine = false;
// })
// .on('end', () => {
//     // Write the closing array bracket and close the stream
//     destination.write('\n]');
//     destination.end();
//     console.log('Finished writing to the JSON file');
// })
// .on('error', (err) => {
//     console.error('Error:', err.message);
// });


const isHabitablePlanet = (planet)=>{
    return planet['koi_disposition']==='CONFIRMED'
    && planet['koi_prad'] < 1.6 
    && planet['koi_insol'] >0.36 && planet['koi_insol'] < 1.11;
}

const keplerStream = fs.createReadStream(path.join(__dirname,'kepler_data.csv'));

const csvParser = parse({
    comment:'#',
    columns:true
})

const habitablePlanets = [];


keplerStream.pipe(csvParser)

csvParser.on('data',(data)=>{
    if(isHabitablePlanet(data)){

        console.log("in the data callback")
        habitablePlanets.push(data)
    }
})

csvParser.on('error',(err)=>{
    console.error(err);
})

csvParser.on('end',()=>{
console.log("Successfully parsed the csv data from the readable stream");
console.log(habitablePlanets.map(planet=>{
    return planet['kepler_name']
}))
console.log(habitablePlanets.length+ ' habitable planets found by kepler')
})

console.log("last line of code")








