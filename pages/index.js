import React, {useState} from 'react';
import { uuid } from 'uuidv4';
import Link from 'next/link';

export async function getServerSideProps() {
  
  const res = await fetch("https://sheet.best/api/sheets/fe3d2f14-0e9c-4448-901a-b850c22c0ab8?_raw=1")
  const data = await res.json();

  const allExerciseData = data.map(data => ({
    
      ...data,
      id: uuid()
    
  }));
  console.log(allExerciseData);

  return {
    props: {
      allExerciseData
    }
  }
}

export default function Home({allExerciseData}) {
  
  const [generatedExerciseList, setGeneratedExerciseList] = useState({activation: [], firstBlock: [], secondBlock: [], thirdBlock: [], connectors: []});

  const [settingsHidden, setSettingsHidden] = useState(true);
  const [settings, setSettings] = useState({difficultyOne: '1', difficultyThree: '3', groundExercise: '2', dev: false});

  const updateTable = () => {
    setGeneratedExerciseList(generateRandomExercises([...allExerciseData], settings));  
  
  }

  return (

      <div className="container">
        <div className="row">
          <button className="button btn-dark col" onClick={() => updateTable()}>Generálás</button>
          <button className="button btn-dark col" onClick={() => setSettingsHidden(!settingsHidden)}>Szabályok menü</button>
          <Link href="/input"><button className="button btn-dark col">Input megtekintése</button></Link>
        </div>
        
        <div className="row" hidden={settingsHidden} >
          <div className="card card-body">
          <form>
            <div className="row">
              <label className="col">1-es nehézség max:</label>
              <input type="number" min="0" max="4" className="col" value={settings.difficultyOne} onChange={e => setSettings({...settings, difficultyOne: e.target.value})}></input>
            </div>

            <div className="row">
              <label className="col">3-es nehézség max:</label>
              <input type="number" min="0" max="4" className="col" value={settings.difficultyThree} onChange={e => setSettings({...settings, difficultyThree: e.target.value})}></input>
            </div>

            <div className="row">
              <label className="col">Földön feladatok max:</label>
              <input type="number" min="0" max="4" className="col" value={settings.groundExercise} onChange={e => setSettings({...settings, groundExercise: e.target.value})}></input>
            </div>

            <div className="row">
              <label className="col">Feladat részletek mutatása:</label>
              <input type="checkbox" className="col" checked={settings.dev} onChange={e => setSettings({...settings, dev: e.target.checked})}></input>
            </div>

          </form>
          </div>
        </div>
        
          
        
        <div contentEditable>
        <h6 className="row">bemelegítés</h6>
        <h6 className="row">aktivációs feladatok (7 perces tabata)</h6>
        <ul className="row">
          {generatedExerciseList.activation.map(({ feladat, nehezseg, orientacio, izomcsoport , id}) => (
            <li key={id}>{settings.dev ? feladat + ' | ' + nehezseg + ' | ' + orientacio + ' | '+izomcsoport : feladat}</li>
          ))}
        </ul>

        <h6 className="row">1. blokk (7 perces tabata)</h6>
        <ul className="row">
          {generatedExerciseList.firstBlock.map(({ feladat, nehezseg, orientacio, izomcsoport , id}) => (
            <li key={id}>{settings.dev ? feladat + ' | ' + nehezseg + ' | ' + orientacio + ' | '+izomcsoport : feladat}</li>
          ))}
        </ul>

        <h6 className="row">átvezető 1 perc: {
          generatedExerciseList.connectors.length < 1 ? 'null' : settings.dev ? 
          generatedExerciseList.connectors[0].feladat + ' | ' +
          generatedExerciseList.connectors[0].nehezseg + ' | ' +
          generatedExerciseList.connectors[0].orientacio + ' | ' +
          generatedExerciseList.connectors[0].izomcsoport : generatedExerciseList.connectors[0].feladat
          }</h6>

        <h6 className="row">2. blokk (7 perces tabata)</h6>
        <ul className="row">
          {generatedExerciseList.secondBlock.map(({ feladat, nehezseg, orientacio, izomcsoport , id}) => (
            <li key={id}>{settings.dev ? feladat + ' | ' + nehezseg + ' | ' + orientacio + ' | '+izomcsoport : feladat}</li>
          ))}
        </ul>

        <h6 className="row">átvezető 1 perc: {
          generatedExerciseList.connectors.length < 1 ? 'null' : settings.dev ? 
          generatedExerciseList.connectors[1].feladat + ' | ' +
          generatedExerciseList.connectors[1].nehezseg + ' | ' +
          generatedExerciseList.connectors[1].orientacio + ' | ' +
          generatedExerciseList.connectors[1].izomcsoport : generatedExerciseList.connectors[1].feladat
          }</h6>

        <h6 className="row">3. blokk (7 perces tabata)</h6>
        <ul className="row">
          {generatedExerciseList.thirdBlock.map(({ feladat, nehezseg, orientacio, izomcsoport , id}) => (
            <li key={id}>{settings.dev ? feladat + ' | ' + nehezseg + ' | ' + orientacio + ' | '+izomcsoport : feladat}</li>
          ))}
        </ul>

        <h6 className="row">nyújtás, levezetés</h6>
        </div>
      </div>


  )
}

function generateRandomExercises(exerciseDataProp, settings) {
  let exerciseData = [...exerciseDataProp];
  let connectorDataSet = exerciseData.filter(data => data.izomcsoport === 'aerob');
  exerciseData = exerciseData.filter(data => data.izomcsoport !== 'aerob');
  console.log(connectorDataSet);
  let randomExerciseData = {activation: [], firstBlock: [], secondBlock: [], thirdBlock: [], connectors: []};

  //activation
  randomExerciseData = {...randomExerciseData, activation: generateRandomBlock(exerciseData, settings)}
  console.log(exerciseData);
  console.log(randomExerciseData.activation);
  exerciseData = exerciseData.filter(data => !randomExerciseData.activation.includes(data));
  console.log(exerciseData);

  //firstBlock
  randomExerciseData = {...randomExerciseData, firstBlock: generateRandomBlock(exerciseData, settings)}
  console.log(exerciseData);
  console.log(randomExerciseData.firstBlock);
  exerciseData = exerciseData.filter(data => !randomExerciseData.firstBlock.includes(data));
  console.log(exerciseData);

  //secondBlock
  randomExerciseData = {...randomExerciseData, secondBlock: generateRandomBlock(exerciseData, settings)}
  console.log(exerciseData);
  console.log(randomExerciseData.secondBlock);
  exerciseData = exerciseData.filter(data => !randomExerciseData.secondBlock.includes(data));
  console.log(exerciseData);

  //thirdBlock
  randomExerciseData = {...randomExerciseData, thirdBlock: generateRandomBlock(exerciseData, settings)}
  console.log(exerciseData);
  console.log(randomExerciseData.thirdBlock);
  exerciseData = exerciseData.filter(data => !randomExerciseData.thirdBlock.includes(data));
  console.log(exerciseData);

  //connectors
  randomExerciseData.connectors.push(connectorDataSet[getRandomInt(connectorDataSet.length)]);
  connectorDataSet = connectorDataSet.filter(data => !randomExerciseData.connectors.includes(data));
  randomExerciseData.connectors.push(connectorDataSet[getRandomInt(connectorDataSet.length)]);
  


  return randomExerciseData
}

function generateRandomBlock(exerciseData, settings) {

  console.log(exerciseData.length);

  //create block
  let newBlock = [];
  let validBlock = false;
  let numberOfExercises = 4;
  let counter = 0;

  while (!validBlock) {

    let tempNewBlock = [];

    for (let i = 0; i < numberOfExercises; i++) {
      tempNewBlock.push(exerciseData[getRandomInt(exerciseData.length)]);
    }


    //if can't generate valid block decrease number of exercises
    counter++;
    if (counter % 1000 === 0) numberOfExercises--;

    validBlock = true;
    //check if no more than 3 very difficult exercise is in block
    const maxDifficultyIsThree = tempNewBlock.filter(data => data.nehezseg === 3);
    if (maxDifficultyIsThree.length > settings.difficultyThree) validBlock = false;

    //check if no more than 1 very easy exercise is in block
    const minDifficultyIsOne = tempNewBlock.filter(data => data.nehezseg === 1);
    if (minDifficultyIsOne.length > settings.difficultyOne) validBlock = false;

    //check if no more than 2 ground exercise is in block
    const groundExercise = tempNewBlock.filter(data => data.orientacio === 'földön');
    if (groundExercise.length > settings.groundExercise) validBlock = false;

    //check for duplicates
    if ((new Set(tempNewBlock)).size !== tempNewBlock.length) validBlock = false;

    //output and sort a valid block
    if (validBlock) {
      for(let i = 0; i < 4 - numberOfExercises; i++) {
        tempNewBlock.push(getInvalidObject());
      }
      newBlock = tempNewBlock.sort((a, b) => a.orientacio.localeCompare(b.orientacio));
    }
  }


  //console.log("orientation filtered out:" + orientation);
  //console.log('Generated valid block: ')
  //console.log(newBlock);

  return newBlock;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getInvalidObject() {
  return {
    id: uuid(),
    izomcsoport: 'X',
    feladat: 'X',
    nehezseg: 'X',
    orientacio: 'X'
  }
}