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

export default function Input({allExerciseData}) {
  return (
    <div className="container">
      <div className="row">
        <h2 className="col">Minden gyakorlat:</h2>
        <Link href="/"><a className="col">Vissza</a></Link>
      </div>
    
      <table className="table table-striped" >
        <thead>
          <tr key='header'>
            <th >izomcsoport</th>
            <th >feladat</th>
            <th >nehézség</th>
            <th >orientáció</th>
          </tr>
        </thead>
        <tbody>

        {allExerciseData.map(({ izomcsoport, feladat, nehezseg , orientacio, id }) => (
          
            <tr key={id}>
              <td>{izomcsoport}</td> 
              <td>{feladat}</td>
              <td>{nehezseg}</td>
              <td>{orientacio}</td>
            </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}