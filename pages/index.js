import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import React, {useState} from 'react';
import { uuid } from 'uuidv4';

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

  const [exerciseData, setExerciseData] = useState(allExerciseData);
  const [headerText, setHeaderText] = useState("Minden gyakorlat:");
  const [settingsHidden, setSettingsHidden] = useState(true);
  const [settings, setSettings] = useState({difficultyOne: '1', difficultyThree: '3', groundExercise: '2'});

  const updateTable = () => {
    setExerciseData(generateRandomExercises(allExerciseData, settings));
    setHeaderText("Feladat blokk:")
  }

  return (
    <Layout home>
      <div className="container flex">
        <div className="row">
          <button className="button btn-dark col" onClick={() => updateTable()}>Generálás</button>
          <button className="button btn-dark col" onClick={() => setSettingsHidden(!settingsHidden)}>Szabályok menü</button>
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
          </form>
          </div>
        </div>
        
          
        
      </div>
      
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>{headerText}</h2>

        <table className="table table-striped" >
          <thead>
            <tr key='header'>
              <th>izomcsoport</th>
              <th>feladat</th>
              <th>nehézség</th>
              <th>orientáció</th>
            </tr>
          </thead>
          <tbody>

          {exerciseData.map(({ izomcsoport, feladat, nehezseg , orientacio, id }) => (
            
              <tr key={id}>
                <td>{izomcsoport}</td> 
                <td>{feladat}</td>
                <td>{nehezseg}</td>
                <td>{orientacio}</td>
              </tr>
            

          ))}
        </tbody>
        </table>
      </section>

    </Layout>
  )
}

function generateRandomExercises(exerciseData, settings) {

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
  console.log('Generated valid block: ')
  console.log(newBlock);

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