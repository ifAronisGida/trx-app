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
  const [headerText, setHeaderText] = useState("Minden gyakorlat:")

  const updateTable = () => {
    setExerciseData(generateRandomExercises(allExerciseData));
    setHeaderText("Feladat blokk:")
  }

  return (
    <Layout home>

      <button className="button btn-dark" onClick={() => updateTable()}>Kérek egy blokkot!</button>
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

function generateRandomExercises(exerciseData) {

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
    if (counter % 100 === 0) numberOfExercises--;

    validBlock = true;
    //check if no more than 3 very difficult exercise is in block
    const maxDifficultyIsThree = tempNewBlock.filter(data => data.nehezseg === 3);
    if (maxDifficultyIsThree.length > 3) validBlock = false;

    //check if no more than 1 very easy exercise is in block
    const minDifficultyIsOne = tempNewBlock.filter(data => data.nehezseg === 1);
    if (minDifficultyIsOne.length > 1) validBlock = false;

    //check if no more than 2 ground exercise is in block
    const groundExercise = tempNewBlock.filter(data => data.orientacio === 'földön');
    if (groundExercise.length > 2) validBlock = false;

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